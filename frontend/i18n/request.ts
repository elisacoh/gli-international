import { getRequestConfig } from 'next-intl/server';

// Supported locales
export const locales = ['fr', 'en', 'ka'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

// Locale display names for UI
export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  ka: 'ქართული', // Georgian
};

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request
  let locale = await requestLocale;

  // Ensure that the incoming locale is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}/common.json`)).default,
  };
});