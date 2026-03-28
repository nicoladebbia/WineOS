/**
 * Calculate Levenshtein distance between two strings
 * This measures the minimum number of single-character edits required to change one string into another
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Calculate string similarity as a value between 0 and 1
 * 1 means strings are identical, 0 means completely different
 */
export function stringSimilarity(a: string, b: string): number {
  if (a === b) return 1.0;
  if (a.length === 0 || b.length === 0) return 0.0;
  
  // Normalize strings for comparison (lowercase, remove accents)
  const normalizedA = normalizeString(a);
  const normalizedB = normalizeString(b);
  
  const distance = levenshteinDistance(normalizedA, normalizedB);
  const maxLength = Math.max(normalizedA.length, normalizedB.length);
  
  return 1 - distance / maxLength;
}

/**
 * Normalize string for comparison (lowercase, remove accents)
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .trim();
}

/**
 * Find similar wine in the list based on name similarity
 * Returns the most similar wine if similarity is above threshold
 */
export function findSimilarWine(wines: any[], newWineName: string, threshold: number = 0.8): any | null {
  if (!wines || wines.length === 0 || !newWineName) return null;
  
  let mostSimilarWine = null;
  let highestSimilarity = 0;
  
  wines.forEach(wine => {
    const similarity = stringSimilarity(wine.name, newWineName);
    
    if (similarity > threshold && similarity > highestSimilarity) {
      highestSimilarity = similarity;
      mostSimilarWine = wine;
    }
  });
  
  return mostSimilarWine;
}