import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import SeminarDetailClient from './SeminarDetailClient';

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

export default async function SeminarDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id, locale } = await params;
  const search = await searchParams;
  const supabase = createClient();

  // Fetch the destination by ID
  const { data: destination, error: destError } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (destError || !destination) {
    notFound();
  }

  // Fetch the related seminar
  const { data: seminar, error: seminarError } = await supabase
    .from('seminars')
    .select('*')
    .eq('id', destination.seminar_id)
    .eq('is_active', true)
    .single();

  if (seminarError || !seminar) {
    notFound();
  }

  // Extract language-specific data
  const getLocalizedText = (jsonbField: Record<string, string>, fallback: string = '') => {
    return jsonbField?.[locale] || jsonbField?.['fr'] || jsonbField?.['en'] || fallback;
  };

  // Process included items - handle both string arrays and multilingual objects
  const processIncludedItems = (items: any): string[] => {
    if (!Array.isArray(items)) return [];
    return items.map(item => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item !== null) {
        return getLocalizedText(item);
      }
      return '';
    }).filter(Boolean);
  };

  const formattedData = {
    id: destination.id,
    seminarId: seminar.id,
    title: getLocalizedText(seminar.title),
    description: getLocalizedText(seminar.description),
    shortDescription: seminar.short_description ? getLocalizedText(seminar.short_description) : null,
    destination: `${getLocalizedText(destination.city)}, ${getLocalizedText(destination.country)}`,
    city: getLocalizedText(destination.city),
    country: getLocalizedText(destination.country),
    image: destination.image_url,
    price: Number(destination.price),
    currency: destination.currency || 'EUR',
    startDate: destination.start_date || null,
    endDate: destination.end_date || null,
    availableSpots: destination.available_spots || null,
    included: processIncludedItems(seminar.included),
  };

  return (
    <SeminarDetailClient
      data={formattedData}
      locale={locale}
      searchParams={search}
    />
  );
}
