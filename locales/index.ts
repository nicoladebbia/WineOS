/**
 * Locale exports and utilities
 */

import { enUS, Translations } from './en-US';
import { enGB } from './en-GB';
import { itIT } from './it-IT';
import { frFR } from './fr-FR';
import { esES } from './es-ES';
import { deDE } from './de-DE';
import { SupportedLocale } from '@/config/i18n';

export const translations: Record<SupportedLocale, Translations> = {
  'en-US': enUS,
  'en-GB': enGB,
  'it-IT': itIT,
  'fr-FR': frFR,
  'es-ES': esES,
  'de-DE': deDE,
};

export { enUS, enGB, itIT, frFR, esES, deDE };
export type { Translations };
