export interface Wine {
  id: string;
  name: string;
  year: number;
  country: 'Italy' | 'France';
  region: string;
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
}

export interface WineFormData {
  name: string;
  year: number | string;
  country: 'Italy' | 'France';
  region: string;
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

export type ReorderStatus = 'ok' | 'warning' | 'urgent';

export interface DailySaleFormData {
  wineId: string;
  quantity: number | string;
  date: string;
}