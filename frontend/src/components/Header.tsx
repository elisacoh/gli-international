'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import LocaleSelector from './LocaleSelector';

export default function Header() {
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as string;
  const t = useTranslations('nav');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === `/${locale}${path}` || pathname.startsWith(`/${locale}${path}/`);
  };

  const navLinkClass = (path: string) => {
    const active = isActive(path);
    return `relative text-sm tracking-wide font-light transition-all duration-300 ${
      active
        ? 'text-gray-900 font-normal'
        : 'text-gray-600 hover:text-gray-900'
    } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900 after:origin-left after:transition-transform after:duration-300 ${
      active
        ? 'after:scale-x-100'
        : 'after:scale-x-0 hover:after:scale-x-100'
    }`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{backgroundColor: 'rgba(231, 227, 216, 0.95)'}}>
      <nav className="w-full px-8 md:px-16 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center -ml-4 transition-opacity hover:opacity-80">
            <img
              src="/logo-gli-text.png"
              alt="GLI International"
              className="h-8 md:h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link
              href={`/${locale}/about`}
              className={navLinkClass('/about')}
            >
              {t('about')}
            </Link>
            <Link
              href={`/${locale}/formations`}
              className={navLinkClass('/formations')}
            >
              Séminaires
            </Link>
            <Link
              href={`/${locale}/contact`}
              className={navLinkClass('/contact')}
            >
              {t('contact')}
            </Link>
            <LocaleSelector />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-6 pb-6">
            <div className="flex flex-col space-y-6">
              <Link
                href={`/${locale}/about`}
                className={`text-sm tracking-wide font-light transition-colors ${
                  isActive('/about') ? 'text-gray-900 font-normal' : 'text-gray-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('about')}
              </Link>
              <Link
                href={`/${locale}/formations`}
                className={`text-sm tracking-wide font-light transition-colors ${
                  isActive('/formations') ? 'text-gray-900 font-normal' : 'text-gray-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Séminaires
              </Link>
              <Link
                href={`/${locale}/contact`}
                className={`text-sm tracking-wide font-light transition-colors ${
                  isActive('/contact') ? 'text-gray-900 font-normal' : 'text-gray-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('contact')}
              </Link>
              <div className="pt-4 border-t border-gray-300">
                <LocaleSelector />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
