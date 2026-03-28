import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Wine, Sale } from '@/types/wine';
import { config } from './config';
import { logger } from '@/utils/logger';

// Configuration state
let isSupabaseEnabled = false;
let supabaseClient: SupabaseClient | null = null;
let supabaseUrl: string | null = null;
let supabaseKey: string | null = null;

// Database types
interface Database {
  public: {
    Tables: {
      wines: {
        Row: Wine;
        Insert: Omit<Wine, 'id'> & { id?: string };
        Update: Partial<Wine>;
      };
      sales: {
        Row: Sale & { wine_id: string };
        Insert: Omit<Sale, 'id'> & { id?: string; wine_id: string };
        Update: Partial<Sale>;
      };
    };
  };
}

// Initialize Supabase configuration
export async function initializeSupabase(url: string, key: string): Promise<boolean> {
  try {
    // Validate URL and key
    if (!url || !key) {
      throw new Error('Supabase URL and key are required');
    }
    
    if (!url.includes('supabase.co')) {
      throw new Error('Invalid Supabase URL format');
    }
    
    if (key.length < 20) {
      throw new Error('Invalid Supabase key format');
    }

    // Create Supabase client
    supabaseClient = createClient<Database>(url, key, {
      auth: {
        persistSession: false,
      },
    });

    // Test connection by attempting to query with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 10000)
    );
    
    const queryPromise = supabaseClient.from('wines').select('count', { count: 'exact', head: true });
    
    const { error } = await Promise.race([queryPromise, timeoutPromise]) as any;
    
    if (error) {
      logger.error('Supabase connection test failed', error);
      throw new Error(`Connection test failed: ${error.message}`);
    }

    // Store credentials
    supabaseUrl = url;
    supabaseKey = key;
    
    // Save to AsyncStorage with error handling
    try {
      await AsyncStorage.setItem('supabase_url', url);
      await AsyncStorage.setItem('supabase_key', key);
    } catch (storageError) {
      logger.warn('Failed to save credentials to storage', storageError);
      // Continue anyway as connection is established
    }
    
    // Enable Supabase integration
    isSupabaseEnabled = true;
    
    logger.success('Supabase initialized successfully');
    return true;
  } catch (error) {
    logger.error('Error initializing Supabase', error);
    supabaseClient = null;
    isSupabaseEnabled = false;
    throw error; // Rethrow to allow caller to handle
  }
}

// Check if Supabase is configured
export async function isSupabaseConfigured(): Promise<boolean> {
  try {
    // Check if already initialized
    if (supabaseClient && isSupabaseEnabled) {
      return true;
    }

    // Try to load from AsyncStorage
    const url = await AsyncStorage.getItem('supabase_url');
    const key = await AsyncStorage.getItem('supabase_key');
    
    if (url && key) {
      // Try to initialize with stored credentials
      return await initializeSupabase(url, key);
    }

    // Check config service
    if (config.hasSupabaseConfig() && config.supabaseUrl && config.supabaseAnonKey) {
      return await initializeSupabase(config.supabaseUrl, config.supabaseAnonKey);
    }
    
    return false;
  } catch (error) {
    logger.error('Error checking Supabase configuration', error);
    return false;
  }
}

// Enable/disable Supabase integration
export function setSupabaseEnabled(enabled: boolean): void {
  isSupabaseEnabled = enabled;
}

// Get Supabase status
export function getSupabaseStatus(): { enabled: boolean; url: string | null; key: string | null } {
  return {
    enabled: isSupabaseEnabled,
    url: supabaseUrl,
    key: supabaseKey ? '***' + supabaseKey.slice(-4) : null, // Mask key for security
  };
}

// Sync wines to Supabase
export async function syncWinesToSupabase(wines: Wine[]): Promise<boolean> {
  if (!isSupabaseEnabled || !supabaseClient) {
    logger.debug('Supabase not enabled or not configured');
    return false;
  }
  
  if (!wines || wines.length === 0) {
    logger.debug('No wines to sync');
    return true;
  }
  
  try {
    logger.info('Syncing wines to Supabase', { count: wines.length });

    // Upsert wines (insert or update) with timeout
    const winesPromise = supabaseClient
      .from('wines')
      .upsert(wines, { onConflict: 'id' });
      
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Wines sync timeout')), 30000)
    );
    
    const { error: winesError } = await Promise.race([winesPromise, timeoutPromise]) as any;

    if (winesError) {
      // Check if table doesn't exist - this is expected if Supabase isn't set up
      if (winesError.message && winesError.message.includes('Could not find the table')) {
        logger.info('Supabase tables not created yet. Please set up your database schema.');
        // Return false gracefully instead of throwing
        return false;
      }
      throw new Error(`Failed to sync wines: ${winesError.message}`);
    }

    // Sync sales for each wine
    const allSales: (Sale & { wine_id: string })[] = [];
    wines.forEach(wine => {
      if (wine.sales && Array.isArray(wine.sales)) {
        wine.sales.forEach(sale => {
          allSales.push({
            ...sale,
            wine_id: wine.id,
          });
        });
      }
    });

    if (allSales.length > 0) {
      const salesPromise = supabaseClient
        .from('sales')
        .upsert(allSales, { onConflict: 'id' });
        
      const salesTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sales sync timeout')), 30000)
      );
      
      const { error: salesError } = await Promise.race([salesPromise, salesTimeoutPromise]) as any;

      if (salesError) {
        throw new Error(`Failed to sync sales: ${salesError.message}`);
      }
    }

    logger.success('Sync completed successfully');
    return true;
  } catch (error) {
    logger.error('Error syncing wines to Supabase', error);
    throw error; // Rethrow to allow caller to handle
  }
}

// Fetch wines from Supabase
export async function fetchWinesFromSupabase(): Promise<Wine[] | null> {
  if (!isSupabaseEnabled || !supabaseClient) {
    logger.debug('Supabase not enabled or not configured');
    return null;
  }
  
  try {
    logger.info('Fetching wines from Supabase');

    // Fetch wines
    const { data: wines, error: winesError } = await supabaseClient
      .from('wines')
      .select('*')
      .order('name', { ascending: true });

    if (winesError) {
      // Check if table doesn't exist - this is expected if Supabase isn't set up
      if (winesError.message && winesError.message.includes('Could not find the table')) {
        logger.info('Supabase tables not created yet. Please set up your database schema.');
        return null;
      }
      throw winesError;
    }

    if (!wines) {
      return [];
    }

    // Fetch sales for all wines
    const { data: sales, error: salesError } = await supabaseClient
      .from('sales')
      .select('*')
      .order('date', { ascending: false });

    if (salesError) {
      throw salesError;
    }

    // Merge sales into wines
    const winesWithSales: Wine[] = wines.map(wine => {
      const wineSales = sales?.filter(sale => sale.wine_id === wine.id).map(sale => ({
        id: sale.id,
        date: sale.date,
        quantity: sale.quantity,
      })) || [];

      return {
        ...wine,
        sales: wineSales,
      };
    });

    logger.success('Fetched wines from Supabase', { count: winesWithSales.length });
    return winesWithSales;
  } catch (error) {
    logger.error('Error fetching wines from Supabase', error);
    return null;
  }
}

// Record last sync time
export async function recordSyncTime(): Promise<void> {
  try {
    const now = new Date().toISOString();
    await AsyncStorage.setItem('last_supabase_sync', now);
  } catch (error) {
    logger.error('Error recording sync time', error);
  }
}

// Get last sync time
export async function getLastSyncTime(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('last_supabase_sync');
  } catch (error) {
    logger.error('Error getting last sync time', error);
    return null;
  }
}

// Clear Supabase configuration
export async function clearSupabaseConfig(): Promise<void> {
  try {
    await AsyncStorage.removeItem('supabase_url');
    await AsyncStorage.removeItem('supabase_key');
    await AsyncStorage.removeItem('last_supabase_sync');
    
    supabaseClient = null;
    supabaseUrl = null;
    supabaseKey = null;
    isSupabaseEnabled = false;
  } catch (error) {
    logger.error('Error clearing Supabase configuration', error);
  }
}