'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import FormationCard from './FormationCard';

export default function FormationsSection() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('home.formations');

  // Mock formations data - will be replaced with real data from API
  const formations = [
    {
      id: 1,
      title: 'Implantologie Avancée',
      location: 'Tbilisghi, Géorgie',
      image: '../../../georgia.avif',
      date: 'Mars 2025',
    },
    {
      id: 2,
      title: 'Orthodontie Moderne',
      location: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1974&auto=format&fit=crop',
      date: 'Avril 2025',
    },
    {
      id: 3,
      title: 'Chirurgie Esthétique',
      location: 'Singapour',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop',
      date: 'Mai 2025',
    },
  ];

  return (
    <section className="min-h-screen snap-start flex items-center py-16 md:py-24" style={{backgroundColor: 'rgb(231, 227, 216)'}}>
      <div className="w-full px-4 md:px-8 lg:px-16">
        {/* Section Header */}
        <div className="mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-tight tracking-wide mb-4 md:mb-6">
            Nos Séminaires
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 font-light max-w-2xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Formations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {formations.map((formation, index) => (
            <FormationCard
              key={formation.id}
              formation={formation}
              delay={index * 150}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href={`/${locale}/formations`}
            className="inline-block border border-gray-900 text-gray-900 px-8 md:px-10 py-3 md:py-4 text-xs md:text-sm font-light tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            Voir tous les séminaires
          </Link>
        </div>
      </div>
    </section>
  );
}
