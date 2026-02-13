'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface AdminNavProps {
  locale: string;
  userEmail: string;
}

export default function AdminNav({ locale, userEmail }: AdminNavProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push(`/${locale}/admin/login`);
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="backdrop-blur-md" style={{backgroundColor: 'rgba(231, 227, 216, 0.95)'}}>
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href={`/${locale}/admin`} className="flex items-center transition-opacity hover:opacity-80">
                <img
                  src="/logo-gli-text.png"
                  alt="GLI Admin"
                  className="h-8 md:h-10 w-auto"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-12 sm:flex sm:space-x-10">
              <Link
                href={`/${locale}/admin/dashboard`}
                className="relative text-sm tracking-wide font-light text-gray-600 hover:text-gray-900 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900 after:origin-left after:transition-transform after:duration-300 after:scale-x-0 hover:after:scale-x-100"
              >
                Tableau de bord
              </Link>
              <Link
                href={`/${locale}/admin/seminars`}
                className="relative text-sm tracking-wide font-light text-gray-600 hover:text-gray-900 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900 after:origin-left after:transition-transform after:duration-300 after:scale-x-0 hover:after:scale-x-100"
              >
                Séminaires
              </Link>
              <Link
                href={`/${locale}/admin/destinations`}
                className="relative text-sm tracking-wide font-light text-gray-600 hover:text-gray-900 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900 after:origin-left after:transition-transform after:duration-300 after:scale-x-0 hover:after:scale-x-100"
              >
                Destinations
              </Link>
              <Link
                href={`/${locale}/admin/promo-codes`}
                className="relative text-sm tracking-wide font-light text-gray-600 hover:text-gray-900 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900 after:origin-left after:transition-transform after:duration-300 after:scale-x-0 hover:after:scale-x-100"
              >
                Codes Promo
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-gray-600 font-light tracking-wide">{userEmail}</span>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center px-6 py-2 border border-gray-900 text-sm font-light tracking-wide text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 disabled:opacity-50"
            >
              {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
