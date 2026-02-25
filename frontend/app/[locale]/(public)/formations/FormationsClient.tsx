'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Calendar } from 'lucide-react';
import SeminarCard from '@/components/formations/SeminarCard';

interface Seminar {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  short_description?: Record<string, string>;
  included: string[];
  is_active: boolean;
}

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
  is_active: boolean;
}

interface FormationData {
  seminar: Seminar;
  destinations: Destination[];
}

interface FormationsClientProps {
  formationsData: FormationData[];
  locale: string;
}

export default function FormationsClient({ formationsData, locale }: FormationsClientProps) {
  const t = useTranslations('formations');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Flatten destinations for filtering
  const allDestinations = formationsData.flatMap(({ seminar, destinations }) =>
    destinations.map(dest => ({
      ...dest,
      seminar,
    }))
  );

  const filteredDestinations = allDestinations.filter((item) => {
    // Search by destination city or country
    const searchText = searchQuery.toLowerCase();
    const matchesSearch =
      (item.city[locale] || item.city.fr || '').toLowerCase().includes(searchText) ||
      (item.country[locale] || item.country.fr || '').toLowerCase().includes(searchText) ||
      (item.seminar.title[locale] || item.seminar.title.fr || '').toLowerCase().includes(searchText);

    // Filter by date range
    let matchesDate = true;
    if (startDate && item.start_date) {
      matchesDate = matchesDate && new Date(item.start_date) >= new Date(startDate);
    }
    if (endDate && item.end_date) {
      matchesDate = matchesDate && new Date(item.end_date) <= new Date(endDate);
    }

    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
      <div className="w-full px-4 md:px-8 lg:px-16">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 tracking-wide">
            {t('title')}
          </h1>
          <p className="text-base md:text-lg text-gray-600 font-light max-w-3xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          {/* Search Bar and Date Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            {/*<div className="flex-1 relative">*/}
            {/*  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />*/}
            {/*  <input*/}
            {/*    type="text"*/}
            {/*    placeholder={t('searchPlaceholder')}*/}
            {/*    value={searchQuery}*/}
            {/*    onChange={(e) => setSearchQuery(e.target.value)}*/}
            {/*    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all text-gray-900 placeholder-gray-400 font-light"*/}
            {/*  />*/}
            {/*</div>*/}
            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-4 bg-white border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all text-gray-900 placeholder-gray-400 font-light"
              />
            </div>


            {/* Date Range Filter */}
            <div className="flex gap-2 md:w-auto">
              <div className="flex-1 md:w-48">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker?.();
                    } catch (error) {
                      // Fallback for browsers that don't support showPicker
                    }
                  }}
                  className="w-full px-4 py-4 bg-white border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all text-gray-900 font-light text-sm cursor-pointer"
                  placeholder="Date début"
                />
              </div>
              <div className="flex-1 md:w-48">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker?.();
                    } catch (error) {
                      // Fallback for browsers that don't support showPicker
                    }
                  }}
                  className="w-full px-4 py-4 bg-white border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all text-gray-900 font-light text-sm cursor-pointer"
                  placeholder="Date fin"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 font-light">
            {filteredDestinations.length} {t('resultsFound')}
          </p>
        </div>

        {/* Seminars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination) => (
            <SeminarCard
              key={destination.id}
              destination={destination}
              locale={locale}
              filterStartDate={startDate}
              filterEndDate={endDate}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 font-light text-lg">
              {t('noResults')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
