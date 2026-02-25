'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

interface ConfirmationClientProps {
  locale: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ConfirmationClient({ locale, searchParams }: ConfirmationClientProps) {
  const t = useTranslations('confirmation');

  // Extract data from URL params
  const seminarTitle = searchParams.seminarTitle as string || '';
  const destination = searchParams.destination as string || '';
  const tripDates = searchParams.tripDates as string || '';
  const participantsCount = searchParams.participantsCount as string || '1';
  const total = searchParams.total as string || '0';
  const currency = searchParams.currency as string || '€';

  // Format currency symbol
  const getCurrencySymbol = (curr: string) => {
    const symbols: Record<string, string> = {
      EUR: '€',
      USD: '$',
      GBP: '£',
      GEL: '₾',
    };
    return symbols[curr] || curr;
  };

  const currencySymbol = getCurrencySymbol(currency);

  // Track page view for analytics (optional)
  useEffect(() => {
    // You can add analytics tracking here if needed
    console.log('Booking confirmation viewed');
  }, []);

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 tracking-wide">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 font-light">
              {t('message')}
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-white p-8 mb-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-wide">
              {t('summary')}
            </h2>

            <div className="space-y-4">
              {/* Seminar */}
              {seminarTitle && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600 font-light mb-1">{t('seminar')}</p>
                  <p className="text-gray-900 font-light">{seminarTitle}</p>
                </div>
              )}

              {/* Destination */}
              {destination && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600 font-light mb-1">{t('destination')}</p>
                  <p className="text-gray-900 font-light">{destination}</p>
                </div>
              )}

              {/* Trip Dates */}
              {tripDates && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600 font-light mb-1">{t('tripDates')}</p>
                  <p className="text-gray-900 font-light">{tripDates}</p>
                </div>
              )}

              {/* Participants */}
              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600 font-light mb-1">{t('participants')}</p>
                <p className="text-gray-900 font-light">
                  {participantsCount} {t('participant')}{parseInt(participantsCount) > 1 ? 's' : ''}
                </p>
              </div>

              {/* Total Amount */}
              <div className="pt-2">
                <p className="text-sm text-gray-600 font-light mb-1">{t('totalAmount')}</p>
                <p className="text-2xl font-light text-gray-900">
                  {parseFloat(total).toFixed(2)}{currencySymbol}
                </p>
              </div>
            </div>
          </div>

          {/* Email Confirmation Notice */}
          <div className="bg-blue-50 border border-blue-200 p-6 mb-8">
            <p className="text-blue-900 font-light text-center">
              {t('confirmationEmailSent')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}`}
              className="px-8 py-4 bg-gray-900 text-white text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-all duration-300 text-center"
            >
              {t('backToHome')}
            </Link>
            <Link
              href={`/${locale}#contact`}
              className="px-8 py-4 bg-white border border-gray-900 text-gray-900 text-sm font-light tracking-widest uppercase hover:bg-gray-50 transition-all duration-300 text-center"
            >
              {t('contactUs')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}