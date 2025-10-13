/**
 * Internationalization Context
 * Provides locale and translation functions throughout the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupportedLocale, LocaleConfig, SUPPORTED_LOCALES, DEFAULT_LOCALE, getDeviceLocale } from '@/config/i18n';
import { translations, Translations } from '@/locales';
import { logger } from '@/utils/logger';

const LOCALE_STORAGE_KEY = '@wineos:locale';

interface I18nContextValue {
  locale: SupportedLocale;
  localeConfig: LocaleConfig;
  t: Translations;
  setLocale: (locale: SupportedLocale) => Promise<void>;
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
  formatDate: (date: Date | string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize locale from storage or device
  useEffect(() => {
    const initializeLocale = async () => {
      try {
        // Try to load saved locale
        const savedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
        
        if (savedLocale && savedLocale in SUPPORTED_LOCALES) {
          setLocaleState(savedLocale as SupportedLocale);
          logger.info('Loaded saved locale', { locale: savedLocale });
        } else {
          // Use device locale
          const deviceLocale = getDeviceLocale();
          setLocaleState(deviceLocale);
          logger.info('Using device locale', { locale: deviceLocale });
        }
      } catch (error) {
        logger.error('Failed to initialize locale', error);
        setLocaleState(DEFAULT_LOCALE);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeLocale();
  }, []);

  // Set locale and persist
  const setLocale = useCallback(async (newLocale: SupportedLocale) => {
    try {
      await AsyncStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      setLocaleState(newLocale);
      logger.info('Locale changed', { locale: newLocale });
    } catch (error) {
      logger.error('Failed to save locale', error);
    }
  }, []);

  // Get current locale config
  const localeConfig = SUPPORTED_LOCALES[locale];

  // Get translations for current locale
  const t = translations[locale];

  // Format currency with locale
  const formatCurrency = useCallback(
    (amount: number): string => {
      if (!isFinite(amount) || isNaN(amount)) {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: localeConfig.currency,
        }).format(0);
      }

      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: localeConfig.currency,
      }).format(amount);
    },
    [locale, localeConfig.currency]
  );

  // Format number with locale
  const formatNumber = useCallback(
    (num: number): string => {
      if (!isFinite(num) || isNaN(num)) {
        return '0';
      }

      return new Intl.NumberFormat(locale).format(num);
    },
    [locale]
  );

  // Format date with locale
  const formatDate = useCallback(
    (date: Date | string): string => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;

      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }

      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(dateObj);
    },
    [locale]
  );

  const value: I18nContextValue = {
    locale,
    localeConfig,
    t,
    setLocale,
    formatCurrency,
    formatNumber,
    formatDate,
  };

  // Don't render children until locale is initialized
  if (!isInitialized) {
    return null;
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Hook to use i18n context
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  
  return context;
}

/**
 * Hook to get translations only
 */
export function useTranslations(): Translations {
  const { t } = useI18n();
  return t;
}

/**
 * Hook to format currency
 */
export function useCurrency() {
  const { formatCurrency, localeConfig } = useI18n();
  return { formatCurrency, currency: localeConfig.currency, symbol: localeConfig.currencySymbol };
}
