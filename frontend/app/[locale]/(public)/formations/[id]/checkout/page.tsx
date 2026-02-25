import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CheckoutClient from './CheckoutClient';

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

export default async function CheckoutPage({
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

  // Get dates from search params (prioritize these) or destination
  const startDate = (search.startDate as string) || destination.start_date || null;
  const endDate = (search.endDate as string) || destination.end_date || null;

  // Calculate duration if dates are available
  const calculateDuration = () => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const formattedData = {
    destinationId: destination.id,
    seminarId: seminar.id,
    title: getLocalizedText(seminar.title),
    description: getLocalizedText(seminar.description),
    destination: `${getLocalizedText(destination.city)}, ${getLocalizedText(destination.country)}`,
    city: getLocalizedText(destination.city),
    country: getLocalizedText(destination.country),
    price: Number(destination.price),
    currency: destination.currency || 'EUR',
    startDate,
    endDate,
    duration: calculateDuration(),
    availableSpots: destination.available_spots || null,
    included: processIncludedItems(seminar.included),
  };

  return (
    <CheckoutClient
      data={formattedData}
      locale={locale}
      searchParams={search}
    />
  );
}
