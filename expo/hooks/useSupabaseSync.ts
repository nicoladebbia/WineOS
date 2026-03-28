import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { 
  isSupabaseConfigured, 
  getSupabaseStatus, 
  syncWinesToSupabase, 
  fetchWinesFromSupabase,
  recordSyncTime,
  getLastSyncTime,
  setSupabaseEnabled
} from '@/services/supabaseService';
import { useWineStore } from '@/store/wineStore';
import { Wine } from '@/types/wine';
import NetInfo from '@react-native-community/netinfo';
import { logger } from '@/utils/logger';

export function useSupabaseSync() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('offline');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const isSyncingRef = useRef(false);
  
  const wines = useWineStore((state) => state.wines);
  const importDataFromJson = useWineStore((state) => state.importDataFromJson);
  
  // Merge wines with conflict resolution (last-write-wins based on lastUpdated)
  const mergeWines = useCallback((local: Wine[], remote: Wine[]): Wine[] => {
    const merged = new Map<string, Wine>();
    
    // Add all local wines
    local.forEach(wine => merged.set(wine.id, wine));
    
    // Merge remote wines with conflict resolution
    remote.forEach(remoteWine => {
      const localWine = merged.get(remoteWine.id);
      
      if (!localWine) {
        // New wine from remote
        merged.set(remoteWine.id, remoteWine);
      } else {
        // Conflict: use most recent lastUpdated
        const localTime = new Date(localWine.lastUpdated).getTime();
        const remoteTime = new Date(remoteWine.lastUpdated).getTime();
        
        if (remoteTime > localTime) {
          // Remote is newer, use it
          merged.set(remoteWine.id, remoteWine);
        }
        // Otherwise keep local (it's newer or same)
      }
    });
    
    return Array.from(merged.values());
  }, []);
  
  // Function to sync data with Supabase
  const syncData = useCallback(async () => {
    if (!isConfigured || !isEnabled || !isOnline) {
      setSyncStatus('offline');
      return;
    }

    // Prevent concurrent syncs
    if (isSyncingRef.current) {
      logger.debug('Sync already in progress, skipping...');
      return;
    }
    
    try {
      isSyncingRef.current = true;
      setSyncStatus('syncing');
      
      // Push local wines to Supabase with error handling
      try {
        await syncWinesToSupabase(wines);
      } catch (syncError) {
        logger.error('Failed to push wines to Supabase', syncError);
        // If table doesn't exist, disable sync silently
        if (syncError instanceof Error && syncError.message.includes('Could not find the table')) {
          logger.info('Supabase table not set up yet, disabling sync');
          await setSupabaseEnabled(false);
          setIsEnabled(false);
          setSyncStatus('offline');
          return;
        }
        throw new Error(`Sync failed: ${syncError instanceof Error ? syncError.message : 'Unknown error'}`);
      }
      
      // Pull wines from Supabase with error handling
      let remoteWines;
      try {
        remoteWines = await fetchWinesFromSupabase();
      } catch (fetchError) {
        logger.error('Failed to fetch wines from Supabase', fetchError);
        // If table doesn't exist, disable sync silently
        if (fetchError instanceof Error && fetchError.message.includes('Could not find the table')) {
          logger.info('Supabase table not set up yet, disabling sync');
          await setSupabaseEnabled(false);
          setIsEnabled(false);
          setSyncStatus('offline');
          return;
        }
        throw new Error(`Fetch failed: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      }
      
      if (remoteWines && remoteWines.length > 0) {
        // Merge remote wines with local wines using conflict resolution
        const mergedWines = mergeWines(wines, remoteWines);
        
        // Only update if there are actual changes
        if (JSON.stringify(mergedWines) !== JSON.stringify(wines)) {
          try {
            importDataFromJson(JSON.stringify(mergedWines));
          } catch (importError) {
            logger.error('Failed to import merged data', importError);
            throw new Error('Failed to merge remote changes');
          }
        }
      }
      
      // Record sync time with error handling
      try {
        await recordSyncTime();
        const lastSync = await getLastSyncTime();
        setLastSyncTime(lastSync);
      } catch (timeError) {
        logger.warn('Failed to record sync time', timeError);
        // Non-critical error, continue
      }
      
      setSyncStatus('synced');
    } catch (error) {
      logger.error('Error syncing with Supabase', error);
      setSyncStatus('offline');
      // Optionally notify user of sync failure
    } finally {
      isSyncingRef.current = false;
    }
  }, [isConfigured, isEnabled, isOnline, wines, importDataFromJson, mergeWines]);
  
  // Debounced sync - only sync once every 5 seconds max
  const debouncedSync = useCallback(
    debounce(() => {
      syncData();
    }, 5000, { leading: false, trailing: true }),
    [syncData]
  );
  
  // Check if Supabase is configured
  useEffect(() => {
    const checkSupabaseConfig = async () => {
      const configured = await isSupabaseConfigured();
      setIsConfigured(configured);
      
      if (configured) {
        const status = getSupabaseStatus();
        setIsEnabled(status.enabled);
        
        const lastSync = await getLastSyncTime();
        setLastSyncTime(lastSync);
      }
    };
    
    checkSupabaseConfig();
  }, []);
  
  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOffline = !isOnline;
      setIsOnline(state.isConnected ?? false);
      
      // If we're back online and sync is enabled, trigger a sync
      if (wasOffline && state.isConnected && isEnabled && isConfigured) {
        logger.info('Network restored, triggering sync...');
        syncData();
      }
    });
    
    return () => unsubscribe();
  }, [isOnline, isEnabled, isConfigured, syncData]);
  
  // Sync data when wines change and sync is enabled (debounced)
  useEffect(() => {
    if (isEnabled && isConfigured && isOnline && wines.length > 0) {
      debouncedSync();
    }
    
    // Cleanup debounce on unmount
    return () => {
      debouncedSync.cancel();
    };
  }, [wines, isEnabled, isConfigured, isOnline, debouncedSync]);
  
  // Function to manually trigger a sync (immediate, not debounced)
  const manualSync = useCallback(async () => {
    // Cancel any pending debounced syncs
    debouncedSync.cancel();
    await syncData();
  }, [syncData, debouncedSync]);
  
  // Function to enable/disable sync
  const toggleSync = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);
    setSupabaseEnabled(enabled);
    
    if (enabled) {
      if (isConfigured && isOnline) {
        syncData();
      }
    } else {
      setSyncStatus('offline');
      debouncedSync.cancel();
    }
  }, [isConfigured, isOnline, syncData, debouncedSync]);
  
  return {
    isConfigured,
    isEnabled,
    syncStatus,
    lastSyncTime,
    isOnline,
    manualSync,
    toggleSync
  };
}