import { useState, useEffect } from 'react';
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
import NetInfo from '@react-native-community/netinfo';

export function useSupabaseSync() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('offline');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  
  const wines = useWineStore((state) => state.wines);
  const importDataFromJson = useWineStore((state) => state.importDataFromJson);
  
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
      setIsOnline(state.isConnected ?? false);
      
      // If we're back online and sync is enabled, trigger a sync
      if (state.isConnected && isEnabled && isConfigured) {
        syncData();
      }
    });
    
    return () => unsubscribe();
  }, [isEnabled, isConfigured]);
  
  // Sync data when wines change and sync is enabled
  useEffect(() => {
    if (isEnabled && isConfigured && isOnline && wines.length > 0) {
      syncData();
    }
  }, [wines, isEnabled, isConfigured, isOnline]);
  
  // Function to sync data with Supabase
  const syncData = async () => {
    if (!isConfigured || !isEnabled || !isOnline) {
      setSyncStatus('offline');
      return;
    }
    
    try {
      setSyncStatus('syncing');
      
      // Push local wines to Supabase
      await syncWinesToSupabase(wines);
      
      // Pull wines from Supabase
      const remoteWines = await fetchWinesFromSupabase();
      
      if (remoteWines) {
        // Merge remote wines with local wines
        // This is a simplified approach - a real implementation would need
        // more sophisticated conflict resolution
        const mergedWines = [...wines];
        
        // Import remote wines
        if (remoteWines.length > 0) {
          importDataFromJson(JSON.stringify(remoteWines));
        }
      }
      
      // Record sync time
      await recordSyncTime();
      const lastSync = await getLastSyncTime();
      setLastSyncTime(lastSync);
      
      setSyncStatus('synced');
    } catch (error) {
      console.error('Error syncing with Supabase:', error);
      setSyncStatus('offline');
    }
  };
  
  // Function to manually trigger a sync
  const manualSync = async () => {
    await syncData();
  };
  
  // Function to enable/disable sync
  const toggleSync = (enabled: boolean) => {
    setIsEnabled(enabled);
    setSupabaseEnabled(enabled);
    
    if (enabled) {
      if (isConfigured && isOnline) {
        syncData();
      }
    } else {
      setSyncStatus('offline');
    }
  };
  
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