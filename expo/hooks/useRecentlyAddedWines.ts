import { useMemo } from 'react';
import { useWineStore } from '@/store/wineStore';
import { Wine } from '@/types/wine';

interface RecentWine {
  wine: Wine;
  daysAgo: number;
}

/**
 * Hook to get recently added wines for quick re-ordering
 */
export const useRecentlyAddedWines = (limit: number = 5): RecentWine[] => {
  const wines = useWineStore((state) => state.wines);

  return useMemo(() => {
    if (wines.length === 0) {
      return [];
    }

    const now = new Date();

    // Get all wines with their age
    const winesWithAge = wines.map((wine) => {
      const addedDate = new Date(wine.lastUpdated);
      const diffTime = Math.abs(now.getTime() - addedDate.getTime());
      const daysAgo = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      return {
        wine,
        daysAgo,
      };
    });

    // Sort by most recent first
    winesWithAge.sort((a, b) => a.daysAgo - b.daysAgo);

    // Return the most recent ones within the limit
    return winesWithAge.slice(0, limit);
  }, [wines, limit]);
};

/**
 * Hook to get frequently re-ordered wines
 */
export const useFrequentWines = (limit: number = 5) => {
  const wines = useWineStore((state) => state.wines);

  return useMemo(() => {
    if (wines.length === 0) {
      return [];
    }

    // Count restocks (proxy for reordering frequency)
    const wineFrequency = wines.map((wine) => ({
      wine,
      restockCount: wine.restocks?.length || 0,
      salesCount: wine.sales?.length || 0,
    }));

    // Sort by restock frequency, then by sales
    wineFrequency.sort((a, b) => {
      if (a.restockCount !== b.restockCount) {
        return b.restockCount - a.restockCount;
      }
      return b.salesCount - a.salesCount;
    });

    return wineFrequency.slice(0, limit).map((item) => item.wine);
  }, [wines, limit]);
};
