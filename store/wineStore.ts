import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Wine, ReorderStatus, Sale, WineFormData } from '@/types/wine';
import { findSimilarWine } from '@/utils/stringUtils';

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
  backupData: () => Promise<void>;
  restoreData: () => Promise<boolean>;
}

export const useWineStore = create<WineState>()(
  persist(
    (set, get) => ({
      wines: [],
      
      addWine: (wine) => {
        const newWine: Wine = {
          ...wine,
          id: Date.now().toString(),
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
          id: Date.now().toString(),
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
          console.error('Error importing data:', error);
          return false;
        }
      },
      
      findSimilarWine: (name) => {
        return findSimilarWine(get().wines, name, 0.8);
      },
      
      clearAllData: () => {
        set({ wines: [] });
      },
      
      backupData: async () => {
        try {
          const jsonData = get().exportDataAsJson();
          await AsyncStorage.setItem('wine-backup', jsonData);
          await AsyncStorage.setItem('wine-backup-date', new Date().toISOString());
        } catch (error) {
          console.error('Error creating backup:', error);
        }
      },
      
      restoreData: async () => {
        try {
          const jsonData = await AsyncStorage.getItem('wine-backup');
          if (!jsonData) {
            return false;
          }
          
          return get().importDataFromJson(jsonData);
        } catch (error) {
          console.error('Error restoring backup:', error);
          return false;
        }
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