'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';

const locales = ['fr', 'en'] as const;

const localeNames = {
  fr: '',
  en: '',
};

const localeFlags = {
  fr: '🇫🇷',
  en: '🇬🇧',
};

export default function LocaleSelector() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = params.locale as string;

  const switchLocale = (newLocale: string) => {
    if (!pathname) return;

    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');

    // Build new path with new locale
    const newPath = `/${newLocale}${pathWithoutLocale}`;

    // Navigate to new locale
    // This will also update the cookie automatically
    router.push(newPath);
  };

  return (
    <div className="relative">
      <select
        value={currentLocale}
        onChange={(e) => switchLocale(e.target.value)}
        className="appearance-none bg-transparent border border-gray-300 rounded px-3 py-1.5 pr-8 text-sm cursor-pointer hover:border-gray-400 transition font-light"
        aria-label="Select language"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeFlags[locale]} {localeNames[locale]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}
