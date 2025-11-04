'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Calendar } from 'lucide-react';
import SeminarCard from '@/components/formations/SeminarCard';

// Mock data for seminars
const mockSeminars = [
  {
    id: 1,
    title: 'Implantologie Avancée',
    destination: 'Tbilisi, Géorgie',
    image: '/georgia.avif',
    price: 2499,
    date: '15-20 Mars 2025',
    category: 'Dentisterie',
    featured: true,
    popular: true,
  },
  {
    id: 2,
    title: 'Orthodontie Moderne',
    destination: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073',
    price: 1899,
    date: '10-14 Avril 2025',
    category: 'Dentisterie',
    featured: false,
    popular: true,
  },
  {
    id: 3,
    title: 'Chirurgie Esthétique',
    destination: 'Singapour',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2052',
    price: 3299,
    date: '5-12 Mai 2025',
    category: 'Chirurgie',
    featured: true,
    popular: false,
  },
  {
    id: 4,
    title: 'Parodontologie Clinique',
    destination: 'Barcelone, Espagne',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070',
    price: 1699,
    date: '22-26 Juin 2025',
    category: 'Dentisterie',
    featured: false,
    popular: true,
  },
  {
    id: 5,
    title: 'Dermatologie Esthétique',
    destination: 'Dubai, EAU',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070',
    price: 2899,
    date: '8-14 Juillet 2025',
    category: 'Dermatologie',
    featured: true,
    popular: false,
  },
  {
    id: 6,
    title: 'Endodontie Avancée',
    destination: 'Lisbonne, Portugal',
    image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?q=80&w=2073',
    price: 1599,
    date: '15-19 Août 2025',
    category: 'Dentisterie',
    featured: false,
    popular: false,
  },
];

export default function FormationsPage() {
  const t = useTranslations('formations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'popular' | 'featured'>('all');

  const filteredSeminars = mockSeminars.filter((seminar) => {
    const matchesSearch = seminar.destination
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'popular' && seminar.popular) ||
      (activeFilter === 'featured' && seminar.featured);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
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
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all text-gray-900 placeholder-gray-400 font-light"
              />
            </div>

            {/* Date Filter */}
            <div className="relative md:w-64">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all text-gray-900 font-light appearance-none"
              >
                <option value="">{t('allDates')}</option>
                <option value="march">Mars 2025</option>
                <option value="april">Avril 2025</option>
                <option value="may">Mai 2025</option>
                <option value="june">Juin 2025</option>
                <option value="july">Juillet 2025</option>
                <option value="august">Août 2025</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-2 text-sm font-light tracking-wide transition-all ${
                activeFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {t('filterAll')}
            </button>
            <button
              onClick={() => setActiveFilter('popular')}
              className={`px-6 py-2 text-sm font-light tracking-wide transition-all ${
                activeFilter === 'popular'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {t('filterPopular')}
            </button>
            <button
              onClick={() => setActiveFilter('featured')}
              className={`px-6 py-2 text-sm font-light tracking-wide transition-all ${
                activeFilter === 'featured'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {t('filterFeatured')}
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 font-light">
            {filteredSeminars.length} {t('resultsFound')}
          </p>
        </div>

        {/* Seminars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSeminars.map((seminar) => (
            <SeminarCard key={seminar.id} seminar={seminar} />
          ))}
        </div>

        {/* No Results */}
        {filteredSeminars.length === 0 && (
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
