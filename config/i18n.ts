/**
 * Internationalization (i18n) Configuration
 * Supports multiple languages and currencies
 */

export type SupportedLocale = 'en-US' | 'en-GB' | 'it-IT' | 'fr-FR' | 'es-ES' | 'de-DE';
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP';

export interface LocaleConfig {
  code: SupportedLocale;
  name: string;
  currency: SupportedCurrency;
  currencySymbol: string;
  flag: string;
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleConfig> = {
  'en-US': {
    code: 'en-US',
    name: 'English (US)',
    currency: 'USD',
    currencySymbol: '$',
    flag: '🇺🇸',
  },
  'en-GB': {
    code: 'en-GB',
    name: 'English (UK)',
    currency: 'GBP',
    currencySymbol: '£',
    flag: '🇬🇧',
  },
  'it-IT': {
    code: 'it-IT',
    name: 'Italiano',
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇮🇹',
  },
  'fr-FR': {
    code: 'fr-FR',
    name: 'Français',
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇫🇷',
  },
  'es-ES': {
    code: 'es-ES',
    name: 'Español',
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇪🇸',
  },
  'de-DE': {
    code: 'de-DE',
    name: 'Deutsch',
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇩🇪',
  },
};

export const DEFAULT_LOCALE: SupportedLocale = 'en-US';

/**
 * Get device locale or fallback to default
 */
export function getDeviceLocale(): SupportedLocale {
  try {
    // Try to get device locale
    const deviceLocale = Intl.DateTimeFormat().resolvedOptions().locale as SupportedLocale;
    
    // Check if supported
    if (deviceLocale in SUPPORTED_LOCALES) {
      return deviceLocale;
    }
    
    // Try to match language code (e.g., 'en' from 'en-CA')
    const languageCode = deviceLocale.split('-')[0];
    const matchingLocale = Object.keys(SUPPORTED_LOCALES).find(
      (locale) => locale.startsWith(languageCode)
    ) as SupportedLocale;
    
    return matchingLocale || DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}
