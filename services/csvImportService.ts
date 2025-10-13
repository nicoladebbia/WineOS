import { WineFormData } from '@/types/wine';

export interface CSVRow {
  [key: string]: string;
}

export interface CSVMapping {
  name: string;
  year: string;
  producer?: string;
  quantity: string;
  purchasePrice: string;
  sellingPrice?: string;
  supplier?: string;
}

export interface ParsedWineData {
  name: string;
  year: number;
  producer?: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
}

/**
 * Parse CSV text content
 */
export function parseCSV(content: string): CSVRow[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row');
  }

  const headers = lines[0].split(',').map((h) => h.trim());
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim());
    if (values.length !== headers.length) {
      console.warn(`Skipping row ${i + 1}: column count mismatch`);
      continue;
    }

    const row: CSVRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    rows.push(row);
  }

  return rows;
}

/**
 * Map CSV rows to wine data using the provided mapping
 */
export function mapCSVToWines(
  rows: CSVRow[],
  mapping: CSVMapping,
  defaults: {
    type: string;
    country: string;
    region: string;
    minQuantity: number;
    quantityTarget: number;
  }
): ParsedWineData[] {
  const wines: ParsedWineData[] = [];

  for (const row of rows) {
    try {
      const name = row[mapping.name];
      const yearStr = row[mapping.year];
      const quantityStr = row[mapping.quantity];
      const purchasePriceStr = row[mapping.purchasePrice];

      // Required fields
      if (!name || !yearStr || !quantityStr || !purchasePriceStr) {
        console.warn('Skipping row: missing required field', row);
        continue;
      }

      const year = parseInt(yearStr);
      const quantity = parseInt(quantityStr);
      const purchasePrice = parseFloat(purchasePriceStr);

      if (isNaN(year) || isNaN(quantity) || isNaN(purchasePrice)) {
        console.warn('Skipping row: invalid number format', row);
        continue;
      }

      // Validate ranges
      if (year < 1900 || year > new Date().getFullYear() + 1) {
        console.warn(`Skipping row: invalid year ${year}`, row);
        continue;
      }

      if (quantity <= 0 || quantity > 100000) {
        console.warn(`Skipping row: invalid quantity ${quantity}`, row);
        continue;
      }

      if (purchasePrice <= 0 || purchasePrice > 10000) {
        console.warn(`Skipping row: invalid price ${purchasePrice}`, row);
        continue;
      }

      // Optional fields
      const producer = mapping.producer ? row[mapping.producer] : undefined;
      const supplier = mapping.supplier ? row[mapping.supplier] : defaults.country;
      
      let sellingPrice = 0;
      if (mapping.sellingPrice) {
        sellingPrice = parseFloat(row[mapping.sellingPrice] || '0');
      }
      
      // If no selling price, use 40% margin as default
      if (sellingPrice <= purchasePrice) {
        sellingPrice = purchasePrice * 1.4;
      }

      // Build wine name with producer if provided
      const fullName = producer ? `${name} - ${producer}` : name;

      wines.push({
        name: fullName,
        year,
        producer,
        quantity,
        purchasePrice,
        sellingPrice,
        supplier,
      });
    } catch (error) {
      console.error('Error processing row:', row, error);
    }
  }

  return wines;
}

/**
 * Get available columns from CSV
 */
export function getCSVColumns(rows: CSVRow[]): string[] {
  if (rows.length === 0) return [];
  return Object.keys(rows[0]);
}

/**
 * Auto-detect column mapping based on common patterns
 */
export function autoDetectMapping(columns: string[]): Partial<CSVMapping> {
  const mapping: Partial<CSVMapping> = {};

  const lowerColumns = columns.map((c) => c.toLowerCase());

  // Name detection
  const namePatterns = ['name', 'wine', 'wine name', 'product', 'item'];
  for (const pattern of namePatterns) {
    const index = lowerColumns.findIndex((c) => c.includes(pattern));
    if (index >= 0) {
      mapping.name = columns[index];
      break;
    }
  }

  // Year detection
  const yearPatterns = ['year', 'vintage', 'annata'];
  for (const pattern of yearPatterns) {
    const index = lowerColumns.findIndex((c) => c.includes(pattern));
    if (index >= 0) {
      mapping.year = columns[index];
      break;
    }
  }

  // Producer detection
  const producerPatterns = ['producer', 'winery', 'maker', 'produttore'];
  for (const pattern of producerPatterns) {
    const index = lowerColumns.findIndex((c) => c.includes(pattern));
    if (index >= 0) {
      mapping.producer = columns[index];
      break;
    }
  }

  // Quantity detection
  const quantityPatterns = ['quantity', 'qty', 'amount', 'bottles', 'quantita'];
  for (const pattern of quantityPatterns) {
    const index = lowerColumns.findIndex((c) => c.includes(pattern));
    if (index >= 0) {
      mapping.quantity = columns[index];
      break;
    }
  }

  // Purchase price detection
  const purchasePatterns = ['purchase', 'cost', 'buy', 'acquisto', 'costo'];
  for (const pattern of purchasePatterns) {
    const index = lowerColumns.findIndex((c) => c.includes(pattern) && c.includes('price'));
    if (index >= 0) {
      mapping.purchasePrice = columns[index];
      break;
    }
  }

  // Selling price detection
  const sellingPatterns = ['selling', 'sell', 'retail', 'vendita'];
  for (const pattern of sellingPatterns) {
    const index = lowerColumns.findIndex((c) => c.includes(pattern) && c.includes('price'));
    if (index >= 0) {
      mapping.sellingPrice = columns[index];
      break;
    }
  }

  // Supplier detection
  const supplierPatterns = ['supplier', 'vendor', 'fornitore'];
  for (const pattern of supplierPatterns) {
    const index = lowerColumns.findIndex((c) => c.includes(pattern));
    if (index >= 0) {
      mapping.supplier = columns[index];
      break;
    }
  }

  return mapping;
}
