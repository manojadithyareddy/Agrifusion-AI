import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// Import all locale files
import en from './en.json';
import hi from './hi.json';
import kn from './kn.json';
import te from './te.json';

export type LocaleCode = 'en' | 'hi' | 'kn' | 'te';

export interface LocaleInfo {
  code: LocaleCode;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', direction: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr' },
];

// Map locale codes to their imported JSON
const localeData: Record<LocaleCode, Record<string, unknown>> = { en, hi, kn, te };

// ─── Deeply nested key lookup (e.g. "home.stats.crops") ───
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Fallback: return the key itself
    }
  }
  return typeof current === 'string' ? current : path;
}

// ─── Context ───
interface I18nContextType {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  locales: LocaleInfo[];
}

const I18nContext = createContext<I18nContextType | null>(null);

// ─── Provider ───
interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: LocaleCode;
}

export function I18nProvider({ children, defaultLocale = 'en' }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    // Try to restore from localStorage
    const saved = localStorage.getItem('agrifusion_locale');
    if (saved && saved in localeData) {
      return saved as LocaleCode;
    }
    return defaultLocale;
  });

  const setLocale = useCallback((newLocale: LocaleCode) => {
    setLocaleState(newLocale);
    localStorage.setItem('agrifusion_locale', newLocale);
    // Set HTML lang attribute for accessibility
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      // Look up in current locale, fall back to English
      let value = getNestedValue(localeData[locale], key);
      if (value === key && locale !== 'en') {
        value = getNestedValue(localeData['en'], key);
      }

      // Interpolate parameters like {{name}}
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          value = value.replace(`{{${paramKey}}}`, String(paramValue));
        });
      }

      return value;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, locales: SUPPORTED_LOCALES }}>
      {children}
    </I18nContext.Provider>
  );
}

// ─── Hook ───
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
