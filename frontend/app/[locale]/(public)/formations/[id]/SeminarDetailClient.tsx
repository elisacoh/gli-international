'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MapPin, Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface SeminarData {
  id: string;
  seminarId: string;
  title: string;
  description: string;
  shortDescription: string | null;
  destination: string;
  city: string;
  country: string;
  image: string;
  price: number;
  currency: string;
  startDate: string | null;
  endDate: string | null;
  availableSpots: number | null;
  included: string[];
}

interface SeminarDetailClientProps {
  data: SeminarData;
  locale: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SeminarDetailClient({ data, locale, searchParams }: SeminarDetailClientProps) {
  const router = useRouter();
  const t = useTranslations('seminarDetail');
  const [participants, setParticipants] = useState(1);
  const [tripStartDate, setTripStartDate] = useState<string>('');
  const [tripEndDate, setTripEndDate] = useState<string>('');

  // Calculate max end date (start date + 3 weeks = 21 days)
  const getMaxEndDate = (startDate: string) => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const maxEnd = new Date(start);
    maxEnd.setDate(maxEnd.getDate() + 21);
    return maxEnd.toISOString().split('T')[0];
  };

  // Get dates from URL parameters
  const startDateParam = searchParams.startDate as string | undefined;
  const endDateParam = searchParams.endDate as string | undefined;

  // Format date range as dd/mm/yyyy
  const formatFullDateRange = (start: string, end: string) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    const startDay = String(startDateObj.getDate()).padStart(2, '0');
    const startMonth = String(startDateObj.getMonth() + 1).padStart(2, '0');
    const startYear = startDateObj.getFullYear();

    const endDay = String(endDateObj.getDate()).padStart(2, '0');
    const endMonth = String(endDateObj.getMonth() + 1).padStart(2, '0');
    const endYear = endDateObj.getFullYear();

    return `${startDay}/${startMonth}/${startYear} - ${endDay}/${endMonth}/${endYear}`;
  };

  // Format date from database (YYYY-MM-DD) to display format
  const formatDateFromDB = (start?: string, end?: string) => {
    if (!start || !end) return null;
    return formatFullDateRange(start, end);
  };

  const displayDate = (startDateParam && endDateParam)
    ? formatFullDateRange(startDateParam, endDateParam)
    : formatDateFromDB(data.startDate ?? undefined, data.endDate ?? undefined);

  // Calculate duration in days
  const calculateDuration = () => {
    if (!data.startDate || !data.endDate) return null;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day
    return diffDays;
  };

  const duration = calculateDuration();
  const durationText = duration ? `${duration} ${duration > 1 ? t('days') || 'jours' : t('day') || 'jour'}` : null;

  // Price calculation with multi-participant discount
  // Discount applies ONLY to first 2 participants (25% off)
  // Additional participants pay full price
  const discountedParticipants = Math.min(participants, 2);
  const fullPriceParticipants = Math.max(0, participants - 2);

  const discountedSubtotal = participants >= 2 ? data.price * 2 * 0.75 : 0; // First 2 with 25% discount
  const fullPriceSubtotal = participants === 1 ? data.price : data.price * fullPriceParticipants;
  const totalPrice = participants >= 2 ? discountedSubtotal + fullPriceSubtotal : data.price;

  // Calculate amounts for display
  const baseTotal = data.price * participants;
  const multiParticipantDiscount = participants >= 2 ? data.price * 2 * 0.25 : 0;

  const handleContinue = () => {
    // Validate that trip dates are selected
    if (!tripStartDate || !tripEndDate) {
      alert(t('selectTripDate') || 'Veuillez sélectionner les dates du voyage');
      return;
    }

    // Validate that end date is after start date
    if (new Date(tripEndDate) < new Date(tripStartDate)) {
      alert('La date de fin doit être après la date de début');
      return;
    }

    // Validate maximum duration (3 weeks = 21 days)
    const start = new Date(tripStartDate);
    const end = new Date(tripEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 21) {
      alert(t('maxDurationExceeded') || 'La durée maximale du voyage est de 3 semaines (21 jours)');
      return;
    }

    // Build URL with participants and dates
    const params = new URLSearchParams({
      participants: participants.toString(),
      tripStartDate: tripStartDate,
      tripEndDate: tripEndDate,
    });

    // Add seminar dates - prioritize search params over destination dates
    if (startDateParam) {
      params.append('startDate', startDateParam);
    } else if (data.startDate) {
      params.append('startDate', data.startDate);
    }

    if (endDateParam) {
      params.append('endDate', endDateParam);
    } else if (data.endDate) {
      params.append('endDate', data.endDate);
    }

    router.push(`/${locale}/formations/${data.id}/checkout?${params.toString()}`);
  };

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
      <div className="w-full px-4 md:px-8 lg:px-16">
        {/* Back Button */}
        <Link
          href={`/${locale}/formations`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 font-light"
        >
          ← {t('back') || 'Retour'}
        </Link>

        <style dangerouslySetInnerHTML={{__html: `
          .formation-detail-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          @media (min-width: 1024px) {
            .formation-detail-grid {
              grid-template-columns: 2fr 1fr;
              gap: 3rem;
            }
          }
        `}} />
        <div className="formation-detail-grid">
          {/* Left Column - Image and Description */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-[4/3] overflow-hidden mb-8">
              <img
                src={data.image}
                alt={data.destination}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title and Location */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 tracking-wide">
                {data.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="text-lg font-light">{data.destination}</span>
              </div>
            </div>

            {/* Info Cards */}
            {(displayDate || durationText) && (
              <div className="flex flex-wrap gap-4 mb-8">
                {displayDate && (
                  <div className="bg-white p-4 flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-light">{t('date') || 'Date'}</span>
                    </div>
                    <p className="text-gray-900 font-light">{displayDate}</p>
                  </div>
                )}
                {durationText && (
                  <div className="bg-white p-4 flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-light">{t('duration') || 'Durée'}</span>
                    </div>
                    <p className="text-gray-900 font-light">{durationText}</p>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                {t('description') || 'Description'}
              </h2>
              <p className="text-gray-600 font-light leading-relaxed whitespace-pre-wrap">
                {data.description}
              </p>
              {data.shortDescription && (
                <p className="text-gray-600 font-light leading-relaxed mt-4">
                  {data.shortDescription}
                </p>
              )}
              <p className="text-gray-600 font-light leading-relaxed mt-4">
                {t('detailsEmail') || 'Toutes les informations détaillées sur le programme vous seront envoyées par email après votre inscription.'}
              </p>
            </div>

            {/* Included */}
            {data.included && data.included.length > 0 && (
              <div>
                <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                  {t('included') || 'Inclus'}
                </h2>
                <div className="space-y-3">
                  {data.included.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 font-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <div className="bg-white p-8 sticky top-28">
              <div className="mb-6">
                <p className="text-sm text-gray-500 font-light mb-2">{t('pricePerPerson') || 'Prix par personne'}</p>
                <p className="text-4xl font-light text-gray-900">
                  {data.price}{data.currency === 'EUR' ? '€' : data.currency}
                </p>
              </div>

              {/* Available Spots */}
              {data.availableSpots && data.availableSpots > 0 && (
                <div className="mb-6 text-sm text-gray-600">
                  {t('availableSpots') || 'Places disponibles'}: <span className="font-medium">{data.availableSpots}</span>
                </div>
              )}

              {/* Number of Participants */}
              <div className="mb-6">
                <label className="block text-sm text-gray-700 font-light mb-3">
                  <Users className="w-4 h-4 inline-block mr-2" />
                  {t('participants') || 'Nombre de participants'}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                    className="w-12 h-12 border border-gray-300 hover:border-gray-900 transition-colors flex items-center justify-center text-xl"
                    disabled={participants <= 1}
                  >
                    -
                  </button>
                  <span className="text-2xl font-light text-gray-900 w-12 text-center">
                    {participants}
                  </span>
                  <button
                    onClick={() => setParticipants(Math.min(data.availableSpots || 10, participants + 1))}
                    className="w-12 h-12 border border-gray-300 hover:border-gray-900 transition-colors flex items-center justify-center text-xl"
                    disabled={participants >= (data.availableSpots || 10)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Trip Date Pickers */}
              <div className="mb-6">
                <label className="block text-sm text-gray-700 font-light mb-3">
                  {t('tripDates') || 'Dates du voyage'} *
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 font-light mb-1">
                      {t('tripStartDate') || 'Date de début'}
                    </label>
                    <input
                      type="date"
                      required
                      value={tripStartDate}
                      onChange={(e) => {
                        setTripStartDate(e.target.value);
                        // Reset end date if it exceeds max duration
                        if (tripEndDate) {
                          const maxEnd = getMaxEndDate(e.target.value);
                          if (tripEndDate > maxEnd) {
                            setTripEndDate('');
                          }
                        }
                      }}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker?.();
                        } catch (error) {
                          // Fallback for browsers that don't support showPicker
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 font-light mb-1">
                      {t('tripEndDate') || 'Date de fin'}
                    </label>
                    <input
                      type="date"
                      required
                      value={tripEndDate}
                      onChange={(e) => setTripEndDate(e.target.value)}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker?.();
                        } catch (error) {
                          // Fallback for browsers that don't support showPicker
                        }
                      }}
                      min={tripStartDate}
                      max={getMaxEndDate(tripStartDate)}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                {participants >= 2 ? (
                  // Show breakdown when discount applies
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs text-gray-600 font-light">
                      <span>2 premiers participants (-25%)</span>
                      <span>{discountedSubtotal.toFixed(2)}{data.currency === 'EUR' ? '€' : data.currency}</span>
                    </div>
                    {fullPriceParticipants > 0 && (
                      <div className="flex justify-between text-xs text-gray-600 font-light">
                        <span>+{fullPriceParticipants} supplémentaire{fullPriceParticipants > 1 ? 's' : ''}</span>
                        <span>{fullPriceSubtotal.toFixed(2)}{data.currency === 'EUR' ? '€' : data.currency}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-green-600 font-light pt-2 border-t border-gray-100">
                      <span>Économie totale</span>
                      <span>-{multiParticipantDiscount.toFixed(2)}{data.currency === 'EUR' ? '€' : data.currency}</span>
                    </div>
                  </div>
                ) : null}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-light">{t('total') || 'Total'}</span>
                  <span className="text-3xl font-light text-gray-900">
                    {totalPrice.toFixed(2)}{data.currency === 'EUR' ? '€' : data.currency}
                  </span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="w-full bg-gray-900 text-white py-4 px-6 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={data.availableSpots !== null && data.availableSpots === 0}
              >
                {data.availableSpots !== null && data.availableSpots === 0 ? (t('soldOut') || 'Complet') : (t('continue') || 'Continuer')}
              </button>

              {/* Info */}
              <p className="text-xs text-gray-500 font-light text-center mt-4">
                {t('noPaymentYet') || 'Aucun paiement ne sera effectué à cette étape'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
