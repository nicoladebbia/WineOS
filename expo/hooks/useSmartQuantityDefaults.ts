import { useMemo } from 'react';
import { useWineStore } from '@/store/wineStore';
import { WineTemplate } from '@/types/wineDatabase';
import { WineType } from '@/types/wine';

interface QuantityDefaults {
  quantity: number;
  minQuantity: number;
  quantityTarget: number;
  explanation: string;
}

const CASE_SIZE = 6;

/**
 * Hook to provide intelligent quantity defaults based on:
 * 1. Wine classification (DOCG = premium = smaller quantities)
 * 2. User's historical patterns for similar wines
 * 3. Wine type patterns
 */
export const useSmartQuantityDefaults = (wine: WineTemplate | null): QuantityDefaults => {
  const wines = useWineStore((state) => state.wines);

  return useMemo(() => {
    // Default fallback
    const defaultValues: QuantityDefaults = {
      quantity: 12,
      minQuantity: 6,
      quantityTarget: 24,
      explanation: 'Standard case quantity (12 bottles)',
    };

    if (!wine) {
      return defaultValues;
    }

    // 1. Adjust based on classification
    let baseQuantity = 12; // Default to 1 case
    let explanation = '';

    if (wine.classification === 'DOCG') {
      baseQuantity = 6; // Premium wines = half case
      explanation = 'Premium DOCG classification suggests smaller initial order';
    } else if (wine.classification === 'DOC') {
      baseQuantity = 12; // Standard case
      explanation = 'DOC classification: standard case quantity';
    } else if (wine.classification === 'IGT' || wine.classification === 'IGP') {
      baseQuantity = 24; // Table wines = 2 cases
      explanation = 'Table wine: larger initial quantity recommended';
    }

    // 2. Adjust based on average price
    if (wine.avgPrice) {
      if (wine.avgPrice > 100) {
        baseQuantity = Math.min(baseQuantity, 6); // Very expensive = half case max
        explanation = 'High-value wine: conservative initial quantity';
      } else if (wine.avgPrice > 50) {
        baseQuantity = Math.min(baseQuantity, 12); // Expensive = 1 case max
        explanation = 'Premium price point: moderate initial quantity';
      } else if (wine.avgPrice < 15) {
        baseQuantity = Math.max(baseQuantity, 24); // Cheap = at least 2 cases
        explanation = 'Value wine: larger initial quantity recommended';
      }
    }

    // 3. Check user's historical patterns for similar wines
    const similarWines = wines.filter((w) => {
      const typeMatch = w.type === wine.type;
      const regionMatch = w.region === wine.region;
      const nameMatch = w.name.toLowerCase().includes(wine.name.toLowerCase().split(' ')[0]);
      return typeMatch && (regionMatch || nameMatch);
    });

    if (similarWines.length > 0) {
      const avgQuantity =
        similarWines.reduce((sum, w) => sum + w.quantity, 0) / similarWines.length;
      const avgMin =
        similarWines.reduce((sum, w) => sum + w.minQuantity, 0) / similarWines.length;
      const avgTarget =
        similarWines.reduce((sum, w) => sum + w.quantityTarget, 0) / similarWines.length;

      // Use historical patterns if significantly different
      if (Math.abs(avgQuantity - baseQuantity) > 6) {
        baseQuantity = Math.round(avgQuantity / CASE_SIZE) * CASE_SIZE; // Round to nearest case
        explanation = `Based on your ${similarWines.length} similar wines`;
      }

      // Calculate min and target from historical ratios
      const minRatio = avgMin / avgQuantity || 0.5;
      const targetRatio = avgTarget / avgQuantity || 2;

      return {
        quantity: baseQuantity,
        minQuantity: Math.round(baseQuantity * minRatio / CASE_SIZE) * CASE_SIZE || CASE_SIZE,
        quantityTarget: Math.round(baseQuantity * targetRatio / CASE_SIZE) * CASE_SIZE || baseQuantity * 2,
        explanation,
      };
    }

    // 4. Default min and target based on base quantity
    const minQuantity = Math.max(CASE_SIZE, Math.round(baseQuantity * 0.5));
    const quantityTarget = baseQuantity * 2;

    return {
      quantity: baseQuantity,
      minQuantity,
      quantityTarget,
      explanation: explanation || 'Standard case quantity',
    };
  }, [wine, wines]);
};
