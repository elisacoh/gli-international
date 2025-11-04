'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, ShoppingCart } from 'lucide-react';

export default function Header() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('nav');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{backgroundColor: 'rgba(231, 227, 216, 0.95)'}}>
      <nav className="w-full px-8 md:px-16 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center -ml-4">
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
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
            >
              {t('about')}
            </Link>
            <Link
              href={`/${locale}/formations`}
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
            >
              Séminaires
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
            >
              {t('contact')}
            </Link>
            <Link
              href={`/${locale}/cart`}
              className="text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
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
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('about')}
              </Link>
              <Link
                href={`/${locale}/formations`}
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                Séminaires
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('contact')}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
