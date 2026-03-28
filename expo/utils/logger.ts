import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

/**
 * Enterprise-grade logging utility with:
 * - Environment-aware log levels
 * - Log persistence to AsyncStorage
 * - PII scrubbing
 * - User context tracking
 * - Performance monitoring
 * - Log export functionality
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userContext?: UserContext;
  deviceContext?: DeviceContext;
}

interface UserContext {
  userId?: string;
  restaurantId?: string;
  sessionId?: string;
}

interface DeviceContext {
  platform: string;
  osVersion: string;
  appVersion: string;
  deviceModel?: string;
  deviceName?: string;
}

interface PerformanceTimer {
  startTime: number;
  label: string;
}

class Logger {
  private isDevelopment: boolean;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize: number = 500; // Keep last 500 logs
  private userContext: UserContext = {};
  private deviceContext: DeviceContext;
  private performanceTimers: Map<string, PerformanceTimer> = new Map();
  private sessionId: string;
  private isInitialized: boolean = false;

  constructor() {
    // Check if we're in development mode
    this.isDevelopment = __DEV__ || Constants.expoConfig?.extra?.environment === 'development';
    
    // Generate session ID
    this.sessionId = this.generateSessionId();
    
    // Initialize device context with null safety
    this.deviceContext = {
      platform: Platform.OS,
      osVersion: Platform.Version?.toString() || 'Unknown',
      appVersion: Constants.expoConfig?.version || '1.0.0',
      deviceModel: Device.modelName ?? 'Unknown',
      deviceName: Device.deviceName ?? 'Unknown',
    };
    
    // Load persisted logs
    this.loadPersistedLogs();
  }

  /**
   * Initialize logger (call on app start)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      await this.loadPersistedLogs();
      this.isInitialized = true;
      this.info('Logger initialized', { sessionId: this.sessionId });
    } catch (error) {
      // Silently fail initialization - logger should still work
      console.error('[Logger] Initialization failed:', error);
      this.isInitialized = true; // Mark as initialized anyway
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Set user context for all future logs
   */
  setUserContext(userId?: string, restaurantId?: string): void {
    this.userContext = {
      userId,
      restaurantId,
      sessionId: this.sessionId,
    };
    this.info('User context updated', this.userContext);
  }

  /**
   * Clear user context (on logout)
   */
  clearUserContext(): void {
    this.userContext = {};
    this.info('User context cleared');
  }

  /**
   * Scrub PII from data
   */
  private scrubPII(data: any): any {
    if (!data) return data;
    
    try {
      const piiPatterns = {
        email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
        creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
      };

      let scrubbedData = JSON.stringify(data);
      
      scrubbedData = scrubbedData.replace(piiPatterns.email, '[EMAIL_REDACTED]');
      scrubbedData = scrubbedData.replace(piiPatterns.phone, '[PHONE_REDACTED]');
      scrubbedData = scrubbedData.replace(piiPatterns.creditCard, '[CARD_REDACTED]');
      
      try {
        return JSON.parse(scrubbedData);
      } catch {
        return scrubbedData;
      }
    } catch (error) {
      // If scrubbing fails, return original data (better than crashing)
      return data;
    }
  }

  /**
   * Add log entry to buffer
   */
  private addToBuffer(level: LogLevel, message: string, data?: any): void {
    try {
      const logEntry: LogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp: new Date().toISOString(),
        level,
        message,
        data: this.scrubPII(data),
        userContext: { ...this.userContext },
        deviceContext: { ...this.deviceContext },
      };

      this.logBuffer.push(logEntry);

      // Maintain buffer size
      if (this.logBuffer.length > this.maxBufferSize) {
        this.logBuffer = this.logBuffer.slice(-this.maxBufferSize);
      }

      // Persist logs asynchronously (don't block)
      this.persistLogs().catch(() => {
        // Silently fail - don't crash app due to logging
      });
    } catch (error) {
      // Silently fail - logging should never crash the app
      console.error('[Logger] Failed to add log entry:', error);
    }
  }

  /**
   * Debug level - only logs in development
   */
  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, data || '');
      this.addToBuffer('debug', message, data);
    }
  }

  /**
   * Info level - only logs in development
   */
  info(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, data || '');
      this.addToBuffer('info', message, data);
    }
  }

  /**
   * Success level - only logs in development
   */
  success(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(`[SUCCESS] ✓ ${message}`, data || '');
      this.addToBuffer('success', message, data);
    }
  }

  /**
   * Warning level - logs in all environments
   */
  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data || '');
    this.addToBuffer('warn', message, data);
  }

  /**
   * Error level - logs in all environments
   */
  error(message: string, error?: any, data?: any): void {
    const errorData = {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
      ...data,
    };

    console.error(`[ERROR] ${message}`, errorData);
    this.addToBuffer('error', message, errorData);
  }

  /**
   * Performance timing - start timer
   */
  time(label: string): void {
    if (this.isDevelopment) {
      this.performanceTimers.set(label, {
        startTime: Date.now(),
        label,
      });
      console.time(`[PERF] ${label}`);
    }
  }

  /**
   * Performance timing - end timer
   */
  timeEnd(label: string): void {
    if (this.isDevelopment) {
      const timer = this.performanceTimers.get(label);
      if (timer) {
        const duration = Date.now() - timer.startTime;
        console.timeEnd(`[PERF] ${label}`);
        this.info(`Performance: ${label}`, { duration: `${duration}ms` });
        this.performanceTimers.delete(label);
      }
    }
  }

  /**
   * Group logs together - only in development
   */
  group(label: string, callback: () => void): void {
    if (this.isDevelopment) {
      console.group(label);
      callback();
      console.groupEnd();
    }
  }

  /**
   * Persist logs to AsyncStorage
   */
  private async persistLogs(): Promise<void> {
    try {
      const logsJson = JSON.stringify(this.logBuffer);
      await AsyncStorage.setItem('app-logs', logsJson);
      await AsyncStorage.setItem('app-logs-updated', new Date().toISOString());
    } catch (error) {
      // Silently fail - don't crash app due to logging
    }
  }

  /**
   * Load persisted logs from AsyncStorage
   */
  private async loadPersistedLogs(): Promise<void> {
    try {
      const logsJson = await AsyncStorage.getItem('app-logs');
      if (logsJson) {
        this.logBuffer = JSON.parse(logsJson);
      }
    } catch (error) {
      // Silently fail - start with empty buffer
      this.logBuffer = [];
    }
  }

  /**
   * Get all logs
   */
  async getLogs(): Promise<LogEntry[]> {
    await this.loadPersistedLogs();
    return this.logBuffer;
  }

  /**
   * Get logs by level
   */
  async getLogsByLevel(level: LogLevel): Promise<LogEntry[]> {
    const logs = await this.getLogs();
    return logs.filter(log => log.level === level);
  }

  /**
   * Export logs as JSON string
   */
  async exportLogsAsJson(): Promise<string> {
    try {
      const logs = await this.getLogs();
      return JSON.stringify({
        exportDate: new Date().toISOString(),
        sessionId: this.sessionId,
        deviceContext: this.deviceContext,
        userContext: this.userContext,
        totalLogs: logs.length,
        logs,
      }, null, 2);
    } catch (error) {
      // Return minimal valid JSON if export fails
      return JSON.stringify({
        exportDate: new Date().toISOString(),
        error: 'Failed to export logs',
        totalLogs: 0,
        logs: [],
      }, null, 2);
    }
  }

  /**
   * Export logs as formatted text
   */
  async exportLogsAsText(): Promise<string> {
    try {
      const logs = await this.getLogs();
      let text = `WineOS App Logs\n`;
      text += `Export Date: ${new Date().toISOString()}\n`;
      text += `Session ID: ${this.sessionId}\n`;
      text += `Device: ${this.deviceContext.platform} ${this.deviceContext.osVersion}\n`;
      text += `App Version: ${this.deviceContext.appVersion}\n`;
      text += `Total Logs: ${logs.length}\n`;
      text += `\n${'='.repeat(80)}\n\n`;

      logs.forEach(log => {
        try {
          text += `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}\n`;
          if (log.data) {
            text += `  Data: ${JSON.stringify(log.data, null, 2)}\n`;
          }
          text += `\n`;
        } catch (error) {
          text += `[${log.timestamp}] [ERROR] Failed to format log entry\n\n`;
        }
      });

      return text;
    } catch (error) {
      return `WineOS App Logs\nExport Date: ${new Date().toISOString()}\nError: Failed to export logs\n`;
    }
  }

  /**
   * Clear all logs
   */
  async clearLogs(): Promise<void> {
    try {
      this.logBuffer = [];
      await AsyncStorage.removeItem('app-logs');
      await AsyncStorage.removeItem('app-logs-updated');
      this.info('Logs cleared');
    } catch (error) {
      console.error('[Logger] Failed to clear logs:', error);
      // Still clear the buffer even if AsyncStorage fails
      this.logBuffer = [];
    }
  }

  /**
   * Get log statistics
   */
  async getLogStats(): Promise<{
    total: number;
    byLevel: Record<LogLevel, number>;
    lastUpdated: string | null;
  }> {
    try {
      const logs = await this.getLogs();
      const lastUpdated = await AsyncStorage.getItem('app-logs-updated');

      const byLevel: Record<LogLevel, number> = {
        debug: 0,
        info: 0,
        success: 0,
        warn: 0,
        error: 0,
      };

      logs.forEach(log => {
        if (log.level && byLevel.hasOwnProperty(log.level)) {
          byLevel[log.level]++;
        }
      });

      return {
        total: logs.length,
        byLevel,
        lastUpdated,
      };
    } catch (error) {
      console.error('[Logger] Failed to get log stats:', error);
      return {
        total: 0,
        byLevel: {
          debug: 0,
          info: 0,
          success: 0,
          warn: 0,
          error: 0,
        },
        lastUpdated: null,
      };
    }
  }
}

// Export singleton instance
export const logger = new Logger();
