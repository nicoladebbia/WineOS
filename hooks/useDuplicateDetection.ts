import { useMemo } from 'react';
import { useWineStore } from '@/store/wineStore';
import { Wine } from '@/types/wine';

interface DuplicateMatch {
  wine: Wine;
  matchType: 'exact' | 'similar';
  confidence: number;
}

/**
 * Hook to detect duplicate wines in inventory
 * Helps prevent adding the same wine twice
 */
export const useDuplicateDetection = (
  name: string,
  year: string | number,
  producer?: string
): DuplicateMatch | null => {
  const wines = useWineStore((state) => state.wines);

  return useMemo(() => {
    if (!name || !year) {
      return null;
    }

    const searchName = name.toLowerCase().trim();
    const searchYear = typeof year === 'string' ? parseInt(year) : year;
    const searchProducer = producer?.toLowerCase().trim();

    for (const wine of wines) {
      const wineName = wine.name.toLowerCase();
      const wineYear = wine.year;

      // Exact match: same name and year
      if (wineName === searchName && wineYear === searchYear) {
        return {
          wine,
          matchType: 'exact',
          confidence: 100,
        };
      }

      // Exact match with producer: name contains producer and same year
      if (searchProducer && wineName.includes(searchProducer) && wineYear === searchYear) {
        const baseWineName = searchName.replace(searchProducer, '').trim();
        if (wineName.includes(baseWineName)) {
          return {
            wine,
            matchType: 'exact',
            confidence: 95,
          };
        }
      }

      // Similar match: very similar name and same year (might be typo or slight variation)
      if (wineYear === searchYear) {
        const similarity = calculateStringSimilarity(searchName, wineName);
        if (similarity > 0.8) {
          return {
            wine,
            matchType: 'similar',
            confidence: Math.round(similarity * 100),
          };
        }
      }
    }

    return null;
  }, [wines, name, year, producer]);
};

/**
 * Calculate string similarity using Levenshtein distance
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) {
    return 1.0;
  }

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
