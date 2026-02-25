'use client';

import Link from 'next/link';
import { MapPin, Calendar } from 'lucide-react';

interface Destination {
  id: string;
  seminar_id: string;
  image_url: string;
  country: Record<string, string>;
  city: Record<string, string>;
  price: number;
  currency: string;
  start_date?: string;
  end_date?: string;
  available_spots?: number;
  seminar: {
    id: string;
    title: Record<string, string>;
    description: Record<string, string>;
    short_description?: Record<string, string>;
  };
}

interface SeminarCardProps {
  id:string;
  title: Record<string,string>;
  destination: Destination;
  locale: string;
  filterStartDate?: string;
  filterEndDate?: string;
}

export default function SeminarCard({ destination, locale, filterStartDate, filterEndDate }: SeminarCardProps) {
  const { seminar } = destination;

  // Get translated texts with fallback
  const title = seminar.title[locale] || seminar.title.fr || Object.values(seminar.title)[0] || '';
  const city = destination.city[locale] || destination.city.fr || Object.values(destination.city)[0] || '';
  const country = destination.country[locale] || destination.country.fr || Object.values(destination.country)[0] || '';

  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Format price with currency symbol
  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      EUR: '€',
      USD: '$',
      GBP: '£',
      GEL: '₾',
    };
    return symbols[currency] || currency;
  };

  // Build detail URL - use destination ID as each destination has unique pricing/dates
  // Include filter dates if provided
  const buildDetailUrl = () => {
    const baseUrl = `/${locale}/formations/${destination.id}`;

    if (filterStartDate || filterEndDate) {
      const params = new URLSearchParams();
      if (filterStartDate) params.append('startDate', filterStartDate);
      if (filterEndDate) params.append('endDate', filterEndDate);
      return `${baseUrl}?${params.toString()}`;
    }

    return baseUrl;
  };

  const detailUrl = buildDetailUrl();

  return (
    <Link href={detailUrl}>
      <div className="group bg-white overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={destination.image_url}
            alt={`${city}, ${country}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Date Badge */}
          {destination.start_date && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-light tracking-wide text-gray-900">
                  {formatDate(destination.start_date)}
                </span>
              </div>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Destination */}
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-light tracking-wide">
              {city}, {country}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-light text-gray-900 mb-4 tracking-wide group-hover:text-gray-700 transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Short Description */}
          {seminar.short_description && (seminar.short_description[locale] || seminar.short_description.fr) && (
            <p className="text-sm text-gray-600 font-light tracking-wide mb-4 line-clamp-2">
              {seminar.short_description[locale] || seminar.short_description.fr}
            </p>
          )}

          {/* Price and Spots */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <span className="text-xs text-gray-500 font-light block mb-1">À partir de</span>
              <span className="text-2xl font-light text-gray-900">
                {destination.price}{getCurrencySymbol(destination.currency)}
              </span>
            </div>
            {destination.available_spots !== undefined && destination.available_spots !== null && (
              <div className="text-right">
                <span className="text-xs text-gray-500 font-light block mb-1">Places</span>
                <span className="text-lg font-light text-gray-900">
                  {destination.available_spots > 0 ? destination.available_spots : 'Complet'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
