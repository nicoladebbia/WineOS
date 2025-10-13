import { useState, useMemo } from 'react';
import { WineTemplate } from '@/types/wineDatabase';
import { WineType, Country } from '@/types/wine';

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'relevance';

interface FilterState {
  type: WineType | 'all';
  country: Country | 'all';
  classification: string | 'all';
  sortBy: SortOption;
}

const initialFilters: FilterState = {
  type: 'all',
  country: 'all',
  classification: 'all',
  sortBy: 'relevance',
};

/**
 * Hook to manage advanced filtering and sorting for wine database
 */
export const useDatabaseFilters = (wines: WineTemplate[]) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const filteredWines = useMemo(() => {
    let result = [...wines];

    // Apply type filter
    if (filters.type !== 'all') {
      result = result.filter((wine) => wine.type === filters.type);
    }

    // Apply country filter
    if (filters.country !== 'all') {
      result = result.filter((wine) => wine.country === filters.country);
    }

    // Apply classification filter
    if (filters.classification !== 'all') {
      result = result.filter((wine) => wine.classification === filters.classification);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => (a.avgPrice || 0) - (b.avgPrice || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.avgPrice || 0) - (a.avgPrice || 0));
        break;
      case 'relevance':
      default:
        // Keep original order (search relevance)
        break;
    }

    return result;
  }, [wines, filters]);

  const setFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.country !== 'all' ||
    filters.classification !== 'all' ||
    filters.sortBy !== 'relevance';

  // Get unique classifications from wines
  const availableClassifications = useMemo(() => {
    const classifications = new Set<string>();
    wines.forEach((wine) => {
      if (wine.classification) {
        classifications.add(wine.classification);
      }
    });
    return Array.from(classifications).sort();
  }, [wines]);

  return {
    filters,
    filteredWines,
    setFilter,
    resetFilters,
    hasActiveFilters,
    availableClassifications,
  };
};
