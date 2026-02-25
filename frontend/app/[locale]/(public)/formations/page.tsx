import { createClient } from '@/lib/supabase/server';
import FormationsClient from './FormationsClient';
import { generatePageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return generatePageMetadata({
    locale,
    title: {
      en: 'Our Training Programs & Seminars',
      fr: 'Nos Programmes de Formation & Séminaires',
      ka: 'ჩვენი სასწავლო პროგრამები და სემინარები',
    },
    description: {
      en: 'Discover our selection of professional training seminars for' +
          ' health professionals in the most beautiful destinations worldwide.',
      fr: 'Découvrez notre sélection de séminaires de formation' +
          ' professionnelle pour les professionnels de santé dans les plus belles destinations du monde.',
      ka: 'აღმოაჩინეთ ჩვენი პროფესიული ტრენინგის სემინარები ჯანდაცვის პროფესიონალებისთვის, იურისტებისთვის და მეწარმეებისთვის.',
    },
    path: '/formations',
  });
}

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

export default async function FormationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = createClient();

  // Fetch active seminars
  const { data: seminars } = await supabase
    .from('seminars')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  // Fetch active destinations
  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_active', true)
    .order('start_date', { ascending: true });

  // Combine seminars with their destinations
  const formationsData = (seminars || []).map((seminar: Seminar) => {
    const seminarDestinations = (destinations || []).filter(
      (dest: Destination) => dest.seminar_id === seminar.id
    );

    return {
      seminar,
      destinations: seminarDestinations,
    };
  }).filter(item => item.destinations.length > 0); // Only show seminars with destinations

  return <FormationsClient formationsData={formationsData} locale={locale} />;
}
