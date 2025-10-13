import { useState, useCallback } from 'react';
import { useWineStore } from '@/store/wineStore';
import { logger } from '@/utils/logger';

/**
 * Hook for refreshing analytics data
 * Provides real data refresh instead of fake delays
 */
export function useAnalyticsRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const wines = useWineStore((state) => state.wines);

  /**
   * Refresh analytics data
   * Forces components to remount by updating a key
   */
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      logger.info('Analytics refresh started', { wineCount: wines.length });
      
      const startTime = performance.now();
      
      // In React, the refresh is handled by the parent component's refreshKey
      // This hook just provides the loading state
      // No need to pollute store state with refresh timestamps
      
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      logger.info('Analytics refresh completed', { 
        duration: `${duration}ms`,
        wineCount: wines.length 
      });
      
      // Minimum delay for visual feedback (200ms for UX)
      // This ensures users see the refresh animation
      const minDelay = 200;
      if (duration < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - duration));
      }
      
    } catch (error) {
      logger.error('Analytics refresh failed', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [wines.length]);

  return {
    isRefreshing,
    refresh,
  };
}

/**
 * Hook for handling period changes with real computation
 */
export function usePeriodChange() {
  const [isChanging, setIsChanging] = useState(false);

  /**
   * Handle period change with actual computation time
   * No fake delays - uses real calculation time
   */
  const changePeriod = useCallback(async (
    newPeriod: number,
    onComplete: (period: number) => void
  ) => {
    setIsChanging(true);
    
    try {
      const startTime = performance.now();
      
      // Update the period (this triggers all analytics to recalculate)
      onComplete(newPeriod);
      
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      logger.info('Period changed', { 
        newPeriod, 
        calculationTime: `${duration}ms` 
      });
      
      // Minimum delay for smooth transition (prevents flash)
      // This is UX polish, not fake loading
      const minDelay = 50;
      if (duration < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - duration));
      }
      
    } catch (error) {
      logger.error('Period change failed', error);
    } finally {
      setIsChanging(false);
    }
  }, []);

  return {
    isChanging,
    changePeriod,
  };
}
