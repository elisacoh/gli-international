'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import FormationCard from './FormationCard';

export default function FormationsSection() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('home.formations');

  const [formations, setFormations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFormations() {
      try {
        const supabase = createClient();

        // Fetch coup de coeur destinations with seminar data
        const { data: coupDeCoeur } = await supabase
          .from('destinations')
          .select(`
            id,
            image_url,
            country,
            city,
            start_date,
            seminar:seminars!inner(id, title)
          `)
          .eq('is_coup_de_coeur', true)
          .eq('is_active', true)
          .order('start_date', { ascending: true })
          .limit(3);

        let finalFormations = coupDeCoeur || [];

        // Backfill with recent destinations if needed
        if (finalFormations.length < 3) {
          const { data: recent } = await supabase
            .from('destinations')
            .select(`
              id,
              image_url,
              country,
              city,
              start_date,
              seminar:seminars!inner(id, title)
            `)
            .eq('is_active', true)
            .order('start_date', { ascending: true })
            .limit(3 - finalFormations.length);

          if (recent) {
            finalFormations = [...finalFormations, ...recent];
          }
        }

        // Transform data to match FormationCard interface
        const transformed = finalFormations.slice(0, 3).map((dest: any) => {
          // Handle seminar data (might be array or object depending on Supabase response)
          const seminar = Array.isArray(dest.seminar) ? dest.seminar[0] : dest.seminar;
          const seminarTitle = seminar?.title || {};

          return {
            id: dest.id,
            title: seminarTitle[locale] || seminarTitle.fr || Object.values(seminarTitle)[0] || '',
            location: `${dest.city?.[locale] || dest.city?.fr || ''}, ${dest.country?.[locale] || dest.country?.fr || ''}`,
            image: dest.image_url || '',
            date: dest.start_date ? new Date(dest.start_date).toLocaleDateString(locale, { month: 'long', year: 'numeric' }) : '',
          };
        });

        setFormations(transformed);
      } catch (error) {
        console.error('Error fetching formations:', error);
        // On error, show empty array
        setFormations([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFormations();
  }, [locale]);

  return (
    <section className="min-h-screen flex items-center py-20 md:py-24" style={{backgroundColor: 'rgb(231, 227, 216)'}}>
      <div className="w-full px-6 md:px-8 lg:px-16">
        {/* Section Header */}
        <div className="mb-14 md:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight tracking-wide mb-5 md:mb-6">
            Nos Séminaires
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-light max-w-3xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Formations Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : formations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-14 md:mb-16">
            {formations.map((formation, index) => (
              <FormationCard
                key={formation.id}
                formation={formation}
                delay={index * 150}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600 font-light">
              Aucune formation disponible pour le moment.
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center pt-4">
          <Link
            href={`/${locale}/formations`}
            className="inline-block border-2 border-gray-900 text-gray-900 px-8 sm:px-10 md:px-12 py-4 md:py-5 text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            Voir tous les séminaires
          </Link>
        </div>
      </div>
    </section>
  );
}
