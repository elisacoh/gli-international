'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Footer() {
  const params = useParams();
  const locale = params.locale as string;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-400 mt-12 md:mt-16" style={{backgroundColor: 'rgb(231, 227, 216)'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 py-8 md:py-12 lg:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
          {/* Logo */}
          <div>
            <img
              src="/logo-gli-text.png"
              alt="GLI International"
              className="h-8 md:h-10 w-auto mb-2 md:mb-4"
            />
          </div>

          {/* Links */}
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-8 lg:space-x-12">
            <Link
              href={`/${locale}/${locale === 'fr' ? 'politique-de-confidentialite' : 'privacy-policy'}`}
              className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors font-light tracking-wide"
            >
              {locale === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}
            </Link>
            <Link
              href={`/${locale}/${locale === 'fr' ? 'mentions-legales' : 'legal-notice'}`}
              className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors font-light tracking-wide"
            >
              {locale === 'fr' ? 'Mentions légales' : 'Legal Notice'}
            </Link>
            <Link
              href={`/${locale}/${locale === 'fr' ? 'conditions-generales-de-vente' : 'terms-and-conditions'}`}
              className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors font-light tracking-wide"
            >
              {locale === 'fr' ? 'CGV' : 'Terms & Conditions'}
            </Link>
            <p className="text-xs md:text-sm text-gray-400 font-light">
              © {currentYear} GLI International
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
