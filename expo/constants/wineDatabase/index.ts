import { WineTemplate } from '@/types/wineDatabase';
import { italianWines } from './italian';
import { frenchWines } from './french';
import { spanishWines } from './spanish';
import { otherWines } from './other';

export const wineDatabase: WineTemplate[] = [
  ...italianWines,
  ...frenchWines,
  ...spanishWines,
  ...otherWines,
];

export const getWineById = (id: string): WineTemplate | undefined => {
  return wineDatabase.find(wine => wine.id === id);
};

export const getWinesByCountry = (country: string): WineTemplate[] => {
  return wineDatabase.filter(wine => wine.country === country);
};

export const getWinesByType = (type: string): WineTemplate[] => {
  return wineDatabase.filter(wine => wine.type === type);
};

export const getWinesByRegion = (region: string): WineTemplate[] => {
  return wineDatabase.filter(wine => wine.region === region);
};
