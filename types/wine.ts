export type WineType = 'Red' | 'White' | 'Rosé' | 'Sparkling' | 'Dessert' | 'Fortified';
export type Country = 'Italy' | 'France' | 'Spain' | 'USA' | 'Argentina' | 'Australia' | 'Germany' | 'Portugal' | 'South Africa' | 'Chile';

export interface Wine {
  id: string;
  name: string;
  year: number;
  type: WineType;
  country: Country;
  region: string;
  grapeVariety?: string;
  supplier: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  minQuantity: number;
  quantityTarget: number; // New field for target inventory
  averageWeeklySales: number;
  lastUpdated: string;
  notes?: string;
  sales: Sale[];
  restocks?: Restock[]; // Track restock history
}

export interface WineFormData {
  name: string;
  year: number | string;
  type: WineType;
  country: Country;
  region: string;
  grapeVariety?: string;
  supplier: string;
  purchasePrice: number | string;
  sellingPrice: number | string;
  quantity: number | string;
  minQuantity: number | string;
  quantityTarget: number | string; // New field for target inventory
  notes?: string;
}

export interface Sale {
  id: string;
  date: string;
  quantity: number;
}

export interface Restock {
  id: string;
  date: string;
  quantity: number;
  purchasePrice: number;
  totalCost: number;
}

export type ReorderStatus = 'ok' | 'warning' | 'urgent';

export interface DailySaleFormData {
  wineId: string;
  quantity: number | string;
  date: string;
}