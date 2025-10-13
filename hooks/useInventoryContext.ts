import { useMemo } from 'react';
import { useWineStore } from '@/store/wineStore';
import { WineTemplate } from '@/types/wineDatabase';
import { Wine } from '@/types/wine';

interface InventoryContext {
  hasWine: boolean;
  existingVersions: Wine[];
  totalBottles: number;
  totalValue: number;
  avgPurchasePrice: number;
}

/**
 * Hook to show context about what's already in inventory when viewing a wine
 */
export const useInventoryContext = (wine: WineTemplate | null): InventoryContext => {
  const wines = useWineStore((state) => state.wines);

  return useMemo(() => {
    const emptyContext: InventoryContext = {
      hasWine: false,
      existingVersions: [],
      totalBottles: 0,
      totalValue: 0,
      avgPurchasePrice: 0,
    };

    if (!wine) {
      return emptyContext;
    }

    // Find all wines in inventory that match this wine template
    const existingVersions = wines.filter((w) => {
      // Match by name (exact or contains base wine name)
      const baseName = wine.name.toLowerCase();
      const inventoryName = w.name.toLowerCase();

      // Check if inventory wine name contains the base wine name
      if (inventoryName.includes(baseName)) {
        return true;
      }

      // Check if it matches any producer from this wine
      const matchesProducer = wine.producers.some((producer) =>
        inventoryName.includes(producer.toLowerCase())
      );

      if (matchesProducer && inventoryName.includes(baseName.split(' ')[0])) {
        return true;
      }

      return false;
    });

    if (existingVersions.length === 0) {
      return emptyContext;
    }

    const totalBottles = existingVersions.reduce((sum, w) => sum + w.quantity, 0);
    const totalValue = existingVersions.reduce(
      (sum, w) => sum + w.quantity * w.purchasePrice,
      0
    );
    const avgPurchasePrice =
      existingVersions.reduce((sum, w) => sum + w.purchasePrice, 0) / existingVersions.length;

    return {
      hasWine: true,
      existingVersions,
      totalBottles,
      totalValue,
      avgPurchasePrice: Math.round(avgPurchasePrice * 100) / 100,
    };
  }, [wine, wines]);
};
