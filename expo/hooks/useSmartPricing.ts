import { useState, useEffect } from 'react';
import { useWineStore } from '@/store/wineStore';
import { WineTemplate } from '@/types/wineDatabase';

interface PriceSuggestion {
  purchasePrice: number;
  sellingPrice: number;
  explanation: string;
  confidence: 'high' | 'medium' | 'low';
  sources: string[];
}

/**
 * Hook to provide intelligent price suggestions based on:
 * 1. Database average price
 * 2. User's historical pricing patterns
 * 3. Similar wines in inventory
 */
export const useSmartPricing = (wine: WineTemplate | null) => {
  const wines = useWineStore((state) => state.wines);
  const [suggestion, setSuggestion] = useState<PriceSuggestion | null>(null);

  useEffect(() => {
    if (!wine) {
      setSuggestion(null);
      return;
    }

    const sources: string[] = [];
    let purchasePrice = 0;
    let sellingPrice = 0;
    let confidence: 'high' | 'medium' | 'low' = 'low';
    let explanation = '';

    // 1. Check database average price
    if (wine.avgPrice && wine.avgPrice > 0) {
      purchasePrice = wine.avgPrice;
      sources.push('database average');
      confidence = 'medium';
    }

    // 2. Find similar wines in inventory (same name, region, or producer)
    const similarWines = wines.filter((w) => {
      const nameMatch = w.name.toLowerCase().includes(wine.name.toLowerCase().split(' ')[0]);
      const regionMatch = w.region === wine.region;
      const producerMatch = wine.producers.some((p) => w.name.includes(p));
      return nameMatch || regionMatch || producerMatch;
    });

    if (similarWines.length > 0) {
      const avgPurchase =
        similarWines.reduce((sum, w) => sum + w.purchasePrice, 0) / similarWines.length;
      const avgSelling =
        similarWines.reduce((sum, w) => sum + w.sellingPrice, 0) / similarWines.length;

      // If we have similar wines, use their pricing (higher confidence)
      if (avgPurchase > 0) {
        purchasePrice = Math.round(avgPurchase * 100) / 100;
        sources.push(`${similarWines.length} similar wines in your inventory`);
        confidence = 'high';
      }

      if (avgSelling > 0) {
        sellingPrice = Math.round(avgSelling * 100) / 100;
      }
    }

    // 3. Calculate user's average margin from all wines
    if (wines.length > 0 && purchasePrice > 0) {
      const margins = wines
        .filter((w) => w.purchasePrice > 0 && w.sellingPrice > w.purchasePrice)
        .map((w) => (w.sellingPrice - w.purchasePrice) / w.purchasePrice);

      if (margins.length > 0) {
        const avgMargin = margins.reduce((sum, m) => sum + m, 0) / margins.length;
        
        // If we don't have a selling price yet, calculate from margin
        if (sellingPrice === 0) {
          sellingPrice = Math.round(purchasePrice * (1 + avgMargin) * 100) / 100;
          sources.push(`your average ${Math.round(avgMargin * 100)}% margin`);
        }
      }
    }

    // 4. Fallback to wine type averages
    if (purchasePrice === 0) {
      const sameTypeWines = wines.filter((w) => w.type === wine.type);
      if (sameTypeWines.length > 0) {
        const avgPrice =
          sameTypeWines.reduce((sum, w) => sum + w.purchasePrice, 0) / sameTypeWines.length;
        purchasePrice = Math.round(avgPrice * 100) / 100;
        sources.push(`average ${wine.type} wine price`);
        confidence = 'low';
      }
    }

    // Build explanation
    if (sources.length > 0) {
      explanation = `Suggested based on ${sources.join(' and ')}.`;
      
      if (confidence === 'high') {
        explanation += ' This is a strong recommendation.';
      } else if (confidence === 'medium') {
        explanation += ' You may want to adjust based on your supplier.';
      } else {
        explanation += ' Please verify with your supplier.';
      }
    } else {
      explanation = 'No pricing data available. Please enter prices manually.';
    }

    // Only provide suggestion if we have at least a purchase price
    if (purchasePrice > 0) {
      setSuggestion({
        purchasePrice,
        sellingPrice: sellingPrice > purchasePrice ? sellingPrice : purchasePrice * 1.4, // Default 40% margin
        explanation,
        confidence,
        sources,
      });
    } else {
      setSuggestion(null);
    }
  }, [wine, wines]);

  return suggestion;
};
