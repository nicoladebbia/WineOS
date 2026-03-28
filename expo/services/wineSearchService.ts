import Fuse from 'fuse.js';
import { wineDatabase } from '@/constants/wineDatabase';
import { WineTemplate, WineSearchResult } from '@/types/wineDatabase';

// Configure Fuse.js for fuzzy search
const fuseOptions = {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'aliases', weight: 1.5 },
    { name: 'producers', weight: 1 },
    { name: 'region', weight: 0.8 },
    { name: 'subRegion', weight: 0.6 },
    { name: 'grapeVariety', weight: 0.5 }
  ],
  threshold: 0.3, // 0 = perfect match, 1 = match anything
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true
};

const fuse = new Fuse(wineDatabase, fuseOptions);

/**
 * Search for wines by name, producer, region, or grape variety
 */
export const searchWines = (query: string): WineSearchResult[] => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const results = fuse.search(query.trim());
  
  return results.map(result => ({
    wine: result.item,
    score: result.score || 0
  }));
};

/**
 * Get a specific wine by ID
 */
export const getWineById = (id: string): WineTemplate | undefined => {
  return wineDatabase.find(wine => wine.id === id);
};

/**
 * Get popular/featured wines (first 10)
 */
export const getPopularWines = (): WineTemplate[] => {
  return wineDatabase.slice(0, 10);
};

/**
 * Get wines by country
 */
export const getWinesByCountry = (country: string): WineTemplate[] => {
  return wineDatabase.filter(wine => 
    wine.country.toLowerCase() === country.toLowerCase()
  );
};

/**
 * Get wines by type
 */
export const getWinesByType = (type: string): WineTemplate[] => {
  return wineDatabase.filter(wine => 
    wine.type.toLowerCase() === type.toLowerCase()
  );
};

/**
 * Get wines by region
 */
export const getWinesByRegion = (region: string): WineTemplate[] => {
  return wineDatabase.filter(wine => 
    wine.region.toLowerCase().includes(region.toLowerCase()) ||
    wine.subRegion?.toLowerCase().includes(region.toLowerCase())
  );
};

/**
 * Get total wine count
 */
export const getTotalWineCount = (): number => {
  return wineDatabase.length;
};

/**
 * Get total producer count
 */
export const getTotalProducerCount = (): number => {
  const allProducers = wineDatabase.flatMap(wine => wine.producers);
  return new Set(allProducers).size;
};
