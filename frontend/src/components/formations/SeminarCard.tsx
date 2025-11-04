'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MapPin, Calendar, Star } from 'lucide-react';

interface SeminarCardProps {
  seminar: {
    id: number;
    title: string;
    destination: string;
    image: string;
    price: number;
    date: string;
    category: string;
    featured: boolean;
    popular: boolean;
  };
}

export default function SeminarCard({ seminar }: SeminarCardProps) {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('formations');

  return (
    <Link href={`/${locale}/formations/${seminar.id}`}>
      <div className="group bg-white overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={seminar.image}
            alt={seminar.destination}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {seminar.featured && (
              <span className="bg-gray-900 text-white px-3 py-1 text-xs font-light tracking-wide">
                <Star className="w-3 h-3 inline-block mr-1" />
                {t('featured')}
              </span>
            )}
            {seminar.popular && (
              <span className="bg-white text-gray-900 px-3 py-1 text-xs font-light tracking-wide">
                {t('popular')}
              </span>
            )}
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Destination */}
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-light tracking-wide">
              {seminar.destination}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-light text-gray-900 mb-4 tracking-wide group-hover:text-gray-700 transition-colors">
            {seminar.title}
          </h3>

          {/* Date */}
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-light">
              {seminar.date}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-500 font-light">{t('from')}</span>
            <span className="text-2xl font-light text-gray-900">
              {seminar.price}€
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
