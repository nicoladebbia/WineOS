import { WineType, Country } from '@/types/wine';
import { regions } from './regions';

/**
 * Wine types available for filtering
 * Centralized to ensure consistency across the app
 */
export const WINE_TYPES: readonly WineType[] = [
  'Red',
  'White',
  'Rosé',
  'Sparkling',
  'Dessert',
  'Fortified'
] as const;

/**
 * Countries available for filtering
 * Centralized to ensure consistency across the app
 */
export const COUNTRIES: readonly Country[] = [
  'Italy',
  'France',
  'Spain',
  'USA',
  'Argentina',
  'Australia',
  'Germany',
  'Portugal',
  'South Africa',
  'Chile'
] as const;

/**
 * Reorder status options for filtering
 */
export const REORDER_STATUSES = ['ok', 'warning', 'urgent'] as const;

/**
 * Number of previous prices to show in restock modal
 */
export const PRICE_HISTORY_COUNT = 3;

/**
 * Creates a flat list of all regions with country prefixes for display
 * Sorted alphabetically by label
 */
export const getAllRegionsWithCountry = () => {
  return Object.entries(regions)
    .flatMap(([country, regionList]) =>
      regionList.map(region => ({
        value: region,
        label: `${region} (${country})`,
        country: country as Country
      }))
    )
    .sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Type for region with country information
 */
export type RegionWithCountry = ReturnType<typeof getAllRegionsWithCountry>[number];
