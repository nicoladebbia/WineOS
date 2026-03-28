import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid/non-secure';
import { Wine, ReorderStatus, Sale, WineFormData } from '@/types/wine';
import { findSimilarWine } from '@/utils/stringUtils';
import { testWines } from '@/constants/testWines';
import { logger } from '@/utils/logger';
import { translations } from '@/constants/translations';

// Constants for analytics calculations
const VELOCITY_LOOKBACK_DAYS = 28;
const VELOCITY_CRITICAL_THRESHOLD = 7;
const VELOCITY_WARNING_THRESHOLD = 14;
const CASE_SIZE = 6;

export interface DailySalesData {
  date: string;
  quantity: number;
  revenue: number;
}

export interface MonthlySalesData {
  date: string; // Format: "Jan", "Feb", etc. or "2024-01"
  quantity: number;
  revenue: number;
}

export interface VelocityAlert {
  wine: Wine;
  currentStock: number;
  weeklySalesRate: number;
  daysUntilStockout: number;
  urgency: 'critical' | 'warning' | 'watch';
  suggestedReorder: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  profitMargin: number;
  avgProfitPerSale: number;
  avgSaleValue: number;
}

export interface ComprehensiveAnalytics {
  bottles: number;
  revenue: number;
  profit: number;
  avgSaleValue: number;
  salesCount: number;
}

interface WineState {
  wines: Wine[];
  addWine: (wine: Omit<Wine, 'id' | 'lastUpdated' | 'sales'>) => void;
  updateWine: (id: string, wine: Partial<Wine>) => void;
  deleteWine: (id: string) => void;
  getReorderStatus: (wine: Wine) => ReorderStatus;
  getSuggestedReorderQuantity: (wine: Wine) => number;
  getWineById: (id: string) => Wine | undefined;
  getWinesByCountry: (country: 'Italy' | 'France') => Wine[];
  getWinesByRegion: (region: string) => Wine[];
  getWinesNeedingReorder: () => Wine[];
  getOutOfStockWines: () => Wine[];
  recordSale: (id: string, quantity: number, date: string) => void;
  getTotalSales: (id: string) => number;
  getRecentSales: (id: string, days: number) => Sale[];
  getTotalSalesInPeriod: (days: number) => number;
  getTopSellingWines: (limit: number) => Wine[];
  searchWines: (query: string) => Wine[];
  exportData: () => string;
  exportDataAsJson: () => string;
  importDataFromJson: (jsonData: string) => boolean;
  findSimilarWine: (name: string) => Wine | null;
  clearAllData: () => void;
  loadTestData: () => void;
  backupData: () => Promise<void>;
  restoreData: () => Promise<boolean>;
  // Analytics functions (optimized)
  getComprehensiveAnalytics: (days: number) => ComprehensiveAnalytics;
  getSalesByDay: (days: number) => DailySalesData[];
  getMonthlySalesData: (months: number) => MonthlySalesData[];
  getVelocityAlerts: () => VelocityAlert[];
  getRevenueMetrics: (days: number) => RevenueMetrics;
  getTrendComparison: (days: number) => { current: number; previous: number; change: number };
  getTopSellingWinesByRevenue: (limit: number, days: number) => Array<{ wine: Wine; quantity: number; revenue: number }>;
  // Legacy functions (deprecated but kept for compatibility)
  getRevenueInPeriod: (days: number) => number;
  getProfitInPeriod: (days: number) => number;
}

export const useWineStore = create<WineState>()(
  persist(
    (set, get) => ({
      wines: testWines, // Load test wines by default
      
      addWine: (wine) => {
        const newWine: Wine = {
          ...wine,
          id: nanoid(),
          lastUpdated: new Date().toISOString(),
          sales: [], // Initialize sales as an empty array
        };
        
        set((state) => ({
          wines: [...state.wines, newWine],
        }));
        
        // Auto backup after adding wine
        get().backupData();
      },
      
      updateWine: (id, updatedWine) => {
        set((state) => ({
          wines: state.wines.map((wine) => 
            wine.id === id 
              ? { 
                  ...wine, 
                  ...updatedWine, 
                  lastUpdated: new Date().toISOString() 
                } 
              : wine
          ),
        }));
        
        // Auto backup after updating wine
        get().backupData();
      },
      
      deleteWine: (id) => {
        set((state) => ({
          wines: state.wines.filter((wine) => wine.id !== id),
        }));
        
        // Auto backup after deleting wine
        get().backupData();
      },
      
      getReorderStatus: (wine) => {
        // If quantity is 0 or below minQuantity, it's urgent
        if (wine.quantity <= 0 || wine.quantity <= wine.minQuantity) {
          return 'urgent';
        }
        
        // If quantity is below target, it's a warning
        if (wine.quantity < wine.quantityTarget) {
          return 'warning';
        }
        
        // Otherwise, it's ok
        return 'ok';
      },
      
      getSuggestedReorderQuantity: (wine) => {
        // Calculate suggested reorder quantity based on target quantity
        const suggestedQuantity = Math.max(0, wine.quantityTarget - wine.quantity);
        
        // Round up to nearest multiple of 6 (standard wine case)
        return Math.ceil(suggestedQuantity / 6) * 6;
      },
      
      getWineById: (id) => {
        return get().wines.find((wine) => wine.id === id);
      },
      
      getWinesByCountry: (country) => {
        return get().wines.filter((wine) => wine.country === country);
      },
      
      getWinesByRegion: (region) => {
        return get().wines.filter((wine) => wine.region === region);
      },
      
      getWinesNeedingReorder: () => {
        return get().wines.filter((wine) => {
          const status = get().getReorderStatus(wine);
          return status === 'warning' || status === 'urgent';
        });
      },
      
      getOutOfStockWines: () => {
        return get().wines.filter((wine) => wine.quantity <= 0);
      },
      
      recordSale: (id, quantity, date) => {
        const wine = get().getWineById(id);
        
        if (!wine) return;
        
        // Create new sale record
        const sale: Sale = {
          id: nanoid(),
          date,
          quantity,
        };
        
        // Update wine with new sale and reduced quantity
        set((state) => ({
          wines: state.wines.map((w) => 
            w.id === id 
              ? { 
                  ...w, 
                  sales: [...(w.sales || []), sale],
                  quantity: Math.max(0, w.quantity - quantity),
                  lastUpdated: new Date().toISOString(),
                  // Recalculate average weekly sales based on last 4 weeks
                  averageWeeklySales: calculateAverageWeeklySales([...(w.sales || []), sale])
                } 
              : w
          ),
        }));
        
        // Auto backup after recording sale
        get().backupData();
      },
      
      getTotalSales: (id) => {
        const wine = get().getWineById(id);
        if (!wine) return 0;
        
        // Ensure sales exists and is an array before calling reduce
        return wine.sales && Array.isArray(wine.sales) 
          ? wine.sales.reduce((total, sale) => total + sale.quantity, 0)
          : 0;
      },
      
      getRecentSales: (id, days) => {
        const wine = get().getWineById(id);
        if (!wine || !wine.sales || !Array.isArray(wine.sales)) return [];
        
        const now = new Date();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return wine.sales.filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate >= cutoffDate && saleDate <= now;
        });
      },
      
      getTotalSalesInPeriod: (days) => {
        const now = new Date();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return get().wines.reduce((total, wine) => {
          if (!wine.sales || !Array.isArray(wine.sales)) return total;
          
          const periodSales = wine.sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= cutoffDate && saleDate <= now;
          });
          
          return total + periodSales.reduce((wineTotal, sale) => wineTotal + sale.quantity, 0);
        }, 0);
      },
      
      getTopSellingWines: (limit) => {
        // Calculate total sales for each wine in the last 30 days
        const now = new Date();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        
        const winesWithSales = get().wines.map(wine => {
          if (!wine.sales || !Array.isArray(wine.sales)) {
            return { wine, recentSales: 0 };
          }
          
          const recentSales = wine.sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= cutoffDate && saleDate <= now;
          });
          
          const totalRecentSales = recentSales.reduce((total, sale) => total + sale.quantity, 0);
          
          return {
            wine,
            recentSales: totalRecentSales
          };
        });
        
        // Sort by recent sales (descending) and take the top 'limit' wines
        return winesWithSales
          .sort((a, b) => b.recentSales - a.recentSales)
          .slice(0, limit)
          .map(item => item.wine);
      },
      
      searchWines: (query) => {
        if (!query || query.trim() === '') {
          return get().wines;
        }
        
        const normalizedQuery = query.toLowerCase().trim();
        
        return get().wines.filter(wine => {
          return (
            wine.name.toLowerCase().includes(normalizedQuery) ||
            wine.supplier.toLowerCase().includes(normalizedQuery) ||
            wine.region.toLowerCase().includes(normalizedQuery) ||
            wine.country.toLowerCase().includes(normalizedQuery) ||
            wine.year.toString().includes(normalizedQuery)
          );
        });
      },
      
      exportData: () => {
        const wines = get().wines;
        
        // Create CSV header
        let csv = 'ID,Nome,Anno,Paese,Regione,Fornitore,Prezzo Acquisto,Prezzo Vendita,Quantità,Quantità Minima,Quantità Target,Media Vendite Settimanali,Ultimo Aggiornamento,Note\n';
        
        // Add wine data
        wines.forEach(wine => {
          const row = [
            wine.id,
            `"${wine.name.replace(/"/g, '""')}"`,
            wine.year,
            wine.country,
            `"${wine.region.replace(/"/g, '""')}"`,
            `"${wine.supplier.replace(/"/g, '""')}"`,
            wine.purchasePrice,
            wine.sellingPrice,
            wine.quantity,
            wine.minQuantity,
            wine.quantityTarget,
            wine.averageWeeklySales,
            wine.lastUpdated,
            wine.notes ? `"${wine.notes.replace(/"/g, '""')}"` : ''
          ].join(',');
          
          csv += row + '\n';
        });
        
        // Add sales data
        csv += '\nID Vino,ID Vendita,Data,Quantità\n';
        
        wines.forEach(wine => {
          if (wine.sales && Array.isArray(wine.sales)) {
            wine.sales.forEach(sale => {
              const row = [
                wine.id,
                sale.id,
                sale.date,
                sale.quantity
              ].join(',');
              
              csv += row + '\n';
            });
          }
        });
        
        return csv;
      },
      
      exportDataAsJson: () => {
        return JSON.stringify(get().wines, null, 2);
      },
      
      importDataFromJson: (jsonData) => {
        try {
          const importedWines = JSON.parse(jsonData);
          
          if (!Array.isArray(importedWines)) {
            return false;
          }
          
          // Validate the imported data
          const isValid = importedWines.every(wine => 
            typeof wine === 'object' &&
            typeof wine.id === 'string' &&
            typeof wine.name === 'string' &&
            typeof wine.year === 'number' &&
            (wine.country === 'Italy' || wine.country === 'France') &&
            typeof wine.region === 'string' &&
            typeof wine.quantity === 'number'
          );
          
          if (!isValid) {
            return false;
          }
          
          // Ensure each wine has a sales array
          const processedWines = importedWines.map(wine => ({
            ...wine,
            sales: wine.sales && Array.isArray(wine.sales) ? wine.sales : []
          }));
          
          // Import the data
          set({ wines: processedWines });
          return true;
        } catch (error) {
          logger.error('Error importing data', error);
          return false;
        }
      },
      
      findSimilarWine: (name) => {
        return findSimilarWine(get().wines, name, 0.8);
      },
      
      clearAllData: () => {
        set({ wines: [] });
      },
      
      loadTestData: () => {
        set({ wines: testWines });
      },
      
      backupData: async () => {
        try {
          const jsonData = get().exportDataAsJson();
          await AsyncStorage.setItem('wine-backup', jsonData);
          await AsyncStorage.setItem('wine-backup-date', new Date().toISOString());
        } catch (error) {
          logger.error('Error creating backup', error);
          // Rethrow to allow caller to handle
          throw new Error(`Failed to create backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      restoreData: async () => {
        try {
          const jsonData = await AsyncStorage.getItem('wine-backup');
          if (!jsonData) {
            logger.warn('No backup found to restore');
            return false;
          }
          
          const success = get().importDataFromJson(jsonData);
          if (!success) {
            throw new Error('Failed to import backup data - invalid format');
          }
          return success;
        } catch (error) {
          logger.error('Error restoring backup', error);
          throw new Error(`Failed to restore backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      // Analytics functions (optimized with error handling)
      
      /**
       * OPTIMIZED: Single-pass comprehensive analytics calculation
       * Calculates bottles, revenue, profit, and avg sale value in ONE loop
       */
      getComprehensiveAnalytics: (days) => {
        try {
          const wines = get().wines;
          if (!wines || !Array.isArray(wines)) {
            logger.warn('getComprehensiveAnalytics: wines is not an array');
            return { bottles: 0, revenue: 0, profit: 0, avgSaleValue: 0, salesCount: 0 };
          }

          // FIXED: Handle ALL_TIME_PERIOD
          const MAX_DAYS = 365 * 10; // 10 years max
          const actualDays = Math.min(days, MAX_DAYS);
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - actualDays);
          
          let bottles = 0;
          let revenue = 0;
          let cost = 0;
          let salesCount = 0;
          
          wines.forEach(wine => {
            if (!wine.sales || !Array.isArray(wine.sales)) return;
            
            wine.sales.forEach(sale => {
              try {
                const saleDate = new Date(sale.date);
                if (isNaN(saleDate.getTime())) return; // Invalid date
                if (saleDate < cutoffDate) return; // Outside period
                
                bottles += sale.quantity;
                revenue += sale.quantity * wine.sellingPrice;
                cost += sale.quantity * wine.purchasePrice;
                salesCount++;
              } catch (error) {
                logger.error('Error processing sale', error);
              }
            });
          });
          
          const profit = revenue - cost;
          const avgSaleValue = salesCount > 0 ? revenue / salesCount : 0;
          
          return { bottles, revenue, profit, avgSaleValue, salesCount };
        } catch (error) {
          logger.error('getComprehensiveAnalytics failed', error);
          return { bottles: 0, revenue: 0, profit: 0, avgSaleValue: 0, salesCount: 0 };
        }
      },
      
      // Legacy functions (use getComprehensiveAnalytics instead)
      getRevenueInPeriod: (days) => {
        return get().getComprehensiveAnalytics(days).revenue;
      },
      
      getProfitInPeriod: (days) => {
        return get().getComprehensiveAnalytics(days).profit;
      },
      
      /**
       * OPTIMIZED: Get sales by day with proper error handling
       * Pre-generates date array to avoid creating Date objects in loop
       */
      getSalesByDay: (days) => {
        try {
          const wines = get().wines;
          if (!wines || !Array.isArray(wines)) {
            return [];
          }

          // FIXED: Cap days at reasonable limit to prevent memory issues
          const MAX_DAYS = 365;
          const actualDays = Math.min(days, MAX_DAYS);

          // Pre-generate all dates for the period (optimization)
          const dates: string[] = [];
          const now = new Date();
          for (let i = actualDays - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
          }
          
          // Create result map with all dates initialized to zero
          const result = new Map<string, { quantity: number; revenue: number }>();
          dates.forEach(date => result.set(date, { quantity: 0, revenue: 0 }));
          
          // Calculate cutoff date once
          const cutoffDate = new Date(dates[0]);
          
          // Single pass through all wines and sales
          wines.forEach(wine => {
            if (!wine.sales || !Array.isArray(wine.sales)) return;
            
            wine.sales.forEach(sale => {
              try {
                const saleDate = new Date(sale.date);
                if (isNaN(saleDate.getTime()) || saleDate < cutoffDate) return;
                
                const dateKey = sale.date;
                const existing = result.get(dateKey);
                if (existing) {
                  existing.quantity += sale.quantity;
                  existing.revenue += sale.quantity * wine.sellingPrice;
                }
              } catch (error) {
                logger.error('Error processing sale in getSalesByDay', error);
              }
            });
          });
          
          // Convert map to array
          return dates.map(date => ({
            date,
            ...result.get(date)!,
          }));
        } catch (error) {
          logger.error('getSalesByDay failed', error);
          return [];
        }
      },

      /**
       * OPTIMIZED: Get monthly sales data directly without fetching full year
       * Single O(n) pass through sales, groups by month
       * FIXED: Input validation, bounds checking, performance limits, safe array access
       */
      getMonthlySalesData: (months) => {
        try {
          // CRITICAL FIX #1: Input validation
          if (!Number.isInteger(months) || months < 1) {
            logger.warn('Invalid months parameter (must be positive integer)', { months });
            return [];
          }

          // CRITICAL FIX #2: Maximum limit to prevent DoS
          const MAX_MONTHS = 24;
          const safeMonths = Math.min(months, MAX_MONTHS);
          
          if (months > MAX_MONTHS) {
            logger.warn('Months parameter exceeds maximum, capping at 24', { requested: months, capped: MAX_MONTHS });
          }

          const wines = get().wines;
          if (!wines || !Array.isArray(wines)) {
            return [];
          }

          // Generate month keys for the period
          const monthKeys: string[] = [];
          const now = new Date();
          
          // Generate months by walking backwards from current month
          for (let i = safeMonths - 1; i >= 0; i--) {
            // Create date object for the target month
            const targetYear = now.getFullYear();
            const targetMonth = now.getMonth() - i;
            
            // Create proper date (handles year boundaries correctly)
            const date = new Date(targetYear, targetMonth, 1);
            
            // Format: "2024-01", "2024-02", etc.
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const monthKey = `${year}-${String(month).padStart(2, '0')}`;
            monthKeys.push(monthKey);
          }

          // Initialize result map
          const result = new Map<string, { quantity: number; revenue: number }>();
          monthKeys.forEach(key => result.set(key, { quantity: 0, revenue: 0 }));

          // Calculate cutoff date (first day of oldest month)
          const cutoffDate = new Date(now.getFullYear(), now.getMonth() - (safeMonths - 1), 1);

          // CRITICAL FIX #3: Performance limit on sales processing
          const MAX_SALES_TO_PROCESS = 100000;
          let processedCount = 0;
          let limitReached = false;

          // Single pass through all wines and sales
          wines.forEach(wine => {
            if (!wine.sales || !Array.isArray(wine.sales)) return;
            if (limitReached) return;

            wine.sales.forEach(sale => {
              // Check performance limit
              if (processedCount >= MAX_SALES_TO_PROCESS) {
                if (!limitReached) {
                  logger.warn('Sales processing limit reached', { 
                    limit: MAX_SALES_TO_PROCESS,
                    wineCount: wines.length 
                  });
                  limitReached = true;
                }
                return;
              }
              processedCount++;

              try {
                const saleDate = new Date(sale.date);
                if (isNaN(saleDate.getTime()) || saleDate < cutoffDate) return;

                // Extract month key from sale date
                const year = saleDate.getFullYear();
                const month = saleDate.getMonth() + 1;
                const monthKey = `${year}-${String(month).padStart(2, '0')}`;
                
                const existing = result.get(monthKey);
                if (existing) {
                  existing.quantity += sale.quantity;
                  existing.revenue += sale.quantity * wine.sellingPrice;
                }
              } catch (error) {
                logger.error('Error processing sale in getMonthlySalesData', error);
              }
            });
          });

          // CRITICAL FIX #4: Safe array access with bounds checking
          // FIXED: Use translations for month names (i18n support)
          const monthNames: readonly string[] = translations.analytics.monthsShort;
          
          return monthKeys.map(key => {
            const [year, month] = key.split('-');
            
            // Parse month with radix 10 and validate
            const monthNum = parseInt(month, 10);
            const monthIndex = monthNum - 1;
            
            // CRITICAL: Bounds check before array access
            const monthName = (monthIndex >= 0 && monthIndex < monthNames.length)
              ? monthNames[monthIndex]
              : 'Unknown';

            // CRITICAL FIX #5: Safe map access without non-null assertion
            const data = result.get(key);
            if (!data) {
              // Shouldn't happen since we pre-populated, but be defensive
              logger.warn('Missing data for month key', { key });
              return {
                date: monthName,
                quantity: 0,
                revenue: 0,
              };
            }

            return {
              date: monthName,
              quantity: data.quantity,
              revenue: data.revenue,
            };
          });
        } catch (error) {
          logger.error('getMonthlySalesData failed', error);
          return [];
        }
      },
      
      /**
       * Get velocity alerts with proper constants and error handling
       */
      getVelocityAlerts: () => {
        try {
          const wines = get().wines;
          if (!wines || !Array.isArray(wines)) {
            return [];
          }

          const now = new Date();
          const lookbackDate = new Date(now.getTime() - VELOCITY_LOOKBACK_DAYS * 24 * 60 * 60 * 1000);
          
          return wines
            .map(wine => {
              try {
                const recentSales = wine.sales?.filter(sale => {
                  const saleDate = new Date(sale.date);
                  return !isNaN(saleDate.getTime()) && saleDate >= lookbackDate;
                }) || [];
                
                const totalSold = recentSales.reduce((sum, sale) => sum + sale.quantity, 0);
                const weeklySalesRate = totalSold / 4;
                const daysUntilStockout = weeklySalesRate > 0 
                  ? (wine.quantity / weeklySalesRate) * 7 
                  : Infinity;
                
                let urgency: 'critical' | 'warning' | 'watch';
                if (daysUntilStockout < VELOCITY_CRITICAL_THRESHOLD) {
                  urgency = 'critical';
                } else if (daysUntilStockout < VELOCITY_WARNING_THRESHOLD) {
                  urgency = 'warning';
                } else {
                  urgency = 'watch';
                }
                
                const deficit = Math.max(0, wine.quantityTarget - wine.quantity);
                const suggestedReorder = Math.ceil(deficit / CASE_SIZE) * CASE_SIZE;
                
                return {
                  wine,
                  currentStock: wine.quantity,
                  weeklySalesRate,
                  daysUntilStockout,
                  urgency,
                  suggestedReorder,
                };
              } catch (error) {
                logger.error('Error calculating velocity alert for wine', error);
                return null;
              }
            })
            .filter((alert): alert is VelocityAlert => 
              alert !== null && 
              alert.daysUntilStockout < VELOCITY_WARNING_THRESHOLD && 
              alert.weeklySalesRate > 0
            )
            .sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);
        } catch (error) {
          logger.error('getVelocityAlerts failed', error);
          return [];
        }
      },
      
      getRevenueMetrics: (days) => {
        // FIXED: Handle ALL_TIME_PERIOD
        const MAX_DAYS = 365 * 10; // 10 years max
        const actualDays = Math.min(days, MAX_DAYS);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - actualDays);
        
        let totalRevenue = 0;
        let totalCost = 0;
        let salesCount = 0;
        
        get().wines.forEach(wine => {
          const periodSales = wine.sales?.filter(sale => 
            new Date(sale.date) >= cutoffDate
          ) || [];
          
          periodSales.forEach(sale => {
            totalRevenue += sale.quantity * wine.sellingPrice;
            totalCost += sale.quantity * wine.purchasePrice;
            salesCount++;
          });
        });
        
        const grossProfit = totalRevenue - totalCost;
        
        return {
          totalRevenue,
          totalCost,
          grossProfit,
          profitMargin: totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0,
          avgProfitPerSale: salesCount > 0 ? grossProfit / salesCount : 0,
          avgSaleValue: salesCount > 0 ? totalRevenue / salesCount : 0,
        };
      },
      
      /**
       * FIXED: Get trend comparison with correct logic
       * Compares current period to previous period of same duration
       */
      getTrendComparison: (days) => {
        try {
          const wines = get().wines;
          if (!wines || !Array.isArray(wines)) {
            return { current: 0, previous: 0, change: 0 };
          }

          // FIXED: Handle ALL_TIME_PERIOD
          const MAX_DAYS = 365 * 10; // 10 years max
          const actualDays = Math.min(days, MAX_DAYS);

          const now = new Date();
          const currentStart = new Date(now);
          currentStart.setDate(currentStart.getDate() - actualDays);
          const previousStart = new Date(currentStart);
          previousStart.setDate(previousStart.getDate() - actualDays);
          
          let current = 0;
          let previous = 0;
          
          wines.forEach(wine => {
            if (!wine.sales || !Array.isArray(wine.sales)) return;
            
            wine.sales.forEach(sale => {
              try {
                const saleDate = new Date(sale.date);
                if (isNaN(saleDate.getTime())) return;
                
                // Current period: last 'days' days
                if (saleDate >= currentStart && saleDate <= now) {
                  current += sale.quantity;
                }
                // Previous period: 'days' days before that
                else if (saleDate >= previousStart && saleDate < currentStart) {
                  previous += sale.quantity;
                }
              } catch (error) {
                logger.error('Error processing sale in getTrendComparison', error);
              }
            });
          });
          
          const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
          
          return { current, previous, change };
        } catch (error) {
          logger.error('getTrendComparison failed', error);
          return { current: 0, previous: 0, change: 0 };
        }
      },
      
      getTopSellingWinesByRevenue: (limit, days) => {
        // FIXED: Handle ALL_TIME_PERIOD (very large numbers)
        const MAX_DAYS = 365 * 10; // 10 years max
        const actualDays = Math.min(days, MAX_DAYS);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - actualDays);
        
        return get().wines
          .map(wine => {
            const periodSales = wine.sales?.filter(sale => 
              new Date(sale.date) >= cutoffDate
            ) || [];
            
            const quantity = periodSales.reduce((sum, sale) => 
              sum + sale.quantity, 0
            );
            
            const revenue = quantity * wine.sellingPrice;
            
            return { wine, quantity, revenue };
          })
          .filter(item => item.quantity > 0)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, limit);
      }
    }),
    {
      name: 'wine-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper function to calculate average weekly sales based on the last 4 weeks
function calculateAverageWeeklySales(sales: Sale[]): number {
  if (!sales || !Array.isArray(sales) || sales.length === 0) return 0;
  
  const now = new Date();
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  
  // Filter sales from the last 4 weeks
  const recentSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate >= fourWeeksAgo && saleDate <= now;
  });
  
  // Sum up quantities
  const totalQuantity = recentSales.reduce((sum, sale) => sum + sale.quantity, 0);
  
  // Calculate weekly average
  return totalQuantity / 4;
}