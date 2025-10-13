/**
 * Date utility functions for consistent date handling across the app
 */

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/**
 * Get yesterday's date (cached for performance)
 * Creates a new date only when the day changes
 */
let cachedYesterday: Date | null = null;
let cachedYesterdayDay: number | null = null;

const getYesterdayInternal = (): Date => {
  const today = new Date();
  const todayDay = today.getDate();
  
  // Only recalculate if the day has changed
  if (cachedYesterday === null || cachedYesterdayDay !== todayDay) {
    cachedYesterday = new Date();
    cachedYesterday.setDate(cachedYesterday.getDate() - 1);
    cachedYesterdayDay = todayDay;
  }
  
  return cachedYesterday;
};

/**
 * Check if a date is yesterday
 */
export const isYesterday = (date: Date): boolean => {
  return isSameDay(date, getYesterdayInternal());
};

/**
 * Get yesterday's date
 */
export const getYesterday = (): Date => {
  // Return a new Date object to prevent mutation
  return new Date(getYesterdayInternal());
};

/**
 * Format date as YYYY-MM-DD for storage
 */
export const formatDateForStorage = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Get a pluralized string for bottles
 */
export const pluralizeBottles = (count: number, translations: { bottle: string; bottles: string }): string => {
  return count === 1 ? translations.bottle : translations.bottles;
};
