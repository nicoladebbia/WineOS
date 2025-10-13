/**
 * Analytics utility functions for formatting and calculations
 * All functions include proper error handling and type safety
 * 
 * NOTE: For currency formatting, use useCurrency() hook from I18nContext
 * This provides locale-aware formatting with proper currency symbols
 */

import Colors from '@/constants/colors';

// Configuration constants
const TREND_THRESHOLD_POSITIVE = 5;
const TREND_THRESHOLD_NEGATIVE = -5;

/**
 * Format currency with Euro symbol
 * @deprecated Use useCurrency() hook from I18nContext for locale-aware formatting
 * Kept for backward compatibility
 */
export const formatCurrency = (amount: number): string => {
  if (!isFinite(amount) || isNaN(amount)) {
    return '€0.00';
  }
  return `€${amount.toFixed(2)}`;
};

/**
 * Format large numbers with K/M suffix
 * Preserves full number in tooltip-friendly format
 */
export const formatNumber = (num: number, preservePrecision: boolean = false): string => {
  if (!isFinite(num) || isNaN(num)) {
    return '0';
  }
  
  if (preservePrecision) {
    return num.toLocaleString();
  }
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Format percentage with sign
 */
export const formatPercentage = (value: number, showSign: boolean = true): string => {
  if (!isFinite(value) || isNaN(value)) {
    return '0.0%';
  }
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

export interface TrendInfo {
  direction: 'up' | 'down' | 'stable';
  color: string;
  icon: '↑' | '↓' | '→';
}

/**
 * Get trend direction and color with configurable thresholds
 */
export const getTrendInfo = (
  value: number,
  positiveThreshold: number = TREND_THRESHOLD_POSITIVE,
  negativeThreshold: number = TREND_THRESHOLD_NEGATIVE
): TrendInfo => {
  if (!isFinite(value) || isNaN(value)) {
    return { direction: 'stable', color: Colors.lightText, icon: '→' };
  }
  
  if (value > positiveThreshold) {
    return { direction: 'up', color: Colors.success, icon: '↑' };
  } else if (value < negativeThreshold) {
    return { direction: 'down', color: Colors.danger, icon: '↓' };
  }
  return { direction: 'stable', color: Colors.lightText, icon: '→' };
};

/**
 * Format date range label
 */
export const getDateRangeLabel = (days: number): string => {
  if (days === 1) return 'Today';
  if (days === 7) return 'Last 7 Days';
  if (days === 30) return 'Last 30 Days';
  if (days === 90) return 'Last 90 Days';
  return `Last ${days} Days`;
};

/**
 * Get period label for display (handles all time period)
 */
export const getPeriodLabel = (days: number): string => {
  if (days === 1) return 'Today';
  if (days === 7) return 'Last 7 days';
  if (days === 30) return 'Last 30 days';
  if (days >= Number.MAX_SAFE_INTEGER / 2) return 'All time';
  return `Last ${days} days`;
};

/**
 * Get short day name from date string
 * FIXED: Handles invalid dates safely
 */
export const getShortDayName = (dateString: string): string => {
  if (!dateString) {
    return '---';
  }
  
  const date = new Date(dateString);
  
  // Validate date
  if (isNaN(date.getTime())) {
    return '---';
  }
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayIndex = date.getDay();
  
  // Bounds check (defensive programming)
  if (dayIndex < 0 || dayIndex >= days.length) {
    return '---';
  }
  
  return days[dayIndex];
};

/**
 * Get medal emoji for ranking
 */
export const getMedalEmoji = (rank: number): string => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `${rank}.`;
};

/**
 * Calculate percentage of max value (for progress bars)
 * Fixed: Handles edge cases properly
 */
export const getPercentageOfMax = (value: number, maxValue: number): number => {
  if (!isFinite(value) || !isFinite(maxValue) || maxValue === 0) {
    return 0;
  }
  return Math.min(Math.max((value / maxValue) * 100, 0), 100);
};

/**
 * Get profit margin color based on percentage
 */
export const getProfitMarginColor = (margin: number): string => {
  if (!isFinite(margin) || isNaN(margin)) {
    return Colors.lightText;
  }
  if (margin >= 30) return Colors.success;
  if (margin >= 15) return Colors.warning;
  return Colors.danger;
};

/**
 * Get urgency color for velocity alerts
 */
export const getUrgencyColor = (urgency: 'critical' | 'warning' | 'watch'): string => {
  switch (urgency) {
    case 'critical':
      return Colors.danger;
    case 'warning':
      return Colors.warning;
    default:
      return Colors.lightText;
  }
};

/**
 * Format time ago (e.g., "2 hours ago")
 * Handles future dates and invalid dates
 */
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Handle future dates
  if (diffMs < 0) {
    return 'In the future';
  }
  
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString();
};

/**
 * Proper interface for sales with date
 */
export interface SaleWithDate {
  date: string;
  [key: string]: any; // Allow additional properties
}

export interface GroupedSales<T extends SaleWithDate> {
  today: T[];
  yesterday: T[];
  thisWeek: T[];
  older: T[];
}

/**
 * Group sales by date category (Today, Yesterday, This Week, etc.)
 * Now with proper TypeScript types
 */
export const groupSalesByDateCategory = <T extends SaleWithDate>(
  sales: T[]
): GroupedSales<T> => {
  if (!sales || !Array.isArray(sales)) {
    return { today: [], yesterday: [], thisWeek: [], older: [] };
  }

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  return {
    today: sales.filter(s => s.date === today),
    yesterday: sales.filter(s => s.date === yesterdayStr),
    thisWeek: sales.filter(s => {
      try {
        const saleDate = new Date(s.date);
        return !isNaN(saleDate.getTime()) && 
               saleDate > weekAgo && 
               s.date !== today && 
               s.date !== yesterdayStr;
      } catch {
        return false;
      }
    }),
    older: sales.filter(s => {
      try {
        const saleDate = new Date(s.date);
        return !isNaN(saleDate.getTime()) && saleDate <= weekAgo;
      } catch {
        return false;
      }
    }),
  };
};
