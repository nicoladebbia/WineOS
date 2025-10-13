import { useMemo } from 'react';
import { useWineStore } from '@/store/wineStore';
import { Country } from '@/types/wine';

interface SupplierSuggestion {
  name: string;
  frequency: number;
  lastUsed: Date;
  countries: Country[];
  avgPurchasePrice: number;
}

/**
 * Hook to track and suggest suppliers based on usage patterns
 */
export const useSupplierMemory = (country?: Country, region?: string) => {
  const wines = useWineStore((state) => state.wines);

  const suggestions = useMemo(() => {
    if (wines.length === 0) {
      return [];
    }

    // Build supplier usage map
    const supplierMap = new Map<string, SupplierSuggestion>();

    wines.forEach((wine) => {
      if (!wine.supplier || wine.supplier.trim().length === 0) return;

      const existing = supplierMap.get(wine.supplier);
      if (existing) {
        existing.frequency += 1;
        existing.avgPurchasePrice =
          (existing.avgPurchasePrice * (existing.frequency - 1) + wine.purchasePrice) /
          existing.frequency;
        if (!existing.countries.includes(wine.country)) {
          existing.countries.push(wine.country);
        }
        const wineDate = new Date(wine.lastUpdated);
        if (wineDate > existing.lastUsed) {
          existing.lastUsed = wineDate;
        }
      } else {
        supplierMap.set(wine.supplier, {
          name: wine.supplier,
          frequency: 1,
          lastUsed: new Date(wine.lastUpdated),
          countries: [wine.country],
          avgPurchasePrice: wine.purchasePrice,
        });
      }
    });

    // Convert to array and sort
    let supplierList = Array.from(supplierMap.values());

    // Filter by country if provided
    if (country) {
      const countryFiltered = supplierList.filter((s) => s.countries.includes(country));
      if (countryFiltered.length > 0) {
        supplierList = countryFiltered;
      }
    }

    // Sort by frequency (most used first), then by recency
    supplierList.sort((a, b) => {
      if (a.frequency !== b.frequency) {
        return b.frequency - a.frequency;
      }
      return b.lastUsed.getTime() - a.lastUsed.getTime();
    });

    // Return top 10 suppliers
    return supplierList.slice(0, 10);
  }, [wines, country, region]);

  const getAllSuppliers = useMemo(() => {
    const allSuppliers = new Set<string>();
    wines.forEach((wine) => {
      if (wine.supplier && wine.supplier.trim().length > 0) {
        allSuppliers.add(wine.supplier);
      }
    });
    return Array.from(allSuppliers).sort();
  }, [wines]);

  return {
    suggestions,
    allSuppliers: getAllSuppliers,
    hasSuppliers: suggestions.length > 0,
  };
};
