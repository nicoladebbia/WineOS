import Constants from 'expo-constants';

interface AppConfig {
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  appEnv: string;
  apiTimeout: number;
  enableAnalytics: boolean;
  enableCrashReporting: boolean;
}

class ConfigService {
  private config: AppConfig;

  constructor() {
    const extra = Constants.expoConfig?.extra || {};
    
    this.config = {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || extra.supabaseUrl || null,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || extra.supabaseAnonKey || null,
      appEnv: process.env.EXPO_PUBLIC_APP_ENV || extra.appEnv || 'development',
      apiTimeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || extra.apiTimeout || '10000', 10),
      enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true' || extra.enableAnalytics === true,
      enableCrashReporting: process.env.EXPO_PUBLIC_ENABLE_CRASH_REPORTING === 'true' || extra.enableCrashReporting === true,
    };
  }

  get supabaseUrl(): string | null {
    return this.config.supabaseUrl;
  }

  get supabaseAnonKey(): string | null {
    return this.config.supabaseAnonKey;
  }

  get appEnv(): string {
    return this.config.appEnv;
  }

  get apiTimeout(): number {
    return this.config.apiTimeout;
  }

  get enableAnalytics(): boolean {
    return this.config.enableAnalytics;
  }

  get enableCrashReporting(): boolean {
    return this.config.enableCrashReporting;
  }

  isProduction(): boolean {
    return this.config.appEnv === 'production';
  }

  isDevelopment(): boolean {
    return this.config.appEnv === 'development';
  }

  hasSupabaseConfig(): boolean {
    return !!(this.config.supabaseUrl && this.config.supabaseAnonKey);
  }
}

export const config = new ConfigService();
