'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface CheckoutData {
  destinationId: string;
  seminarId: string;
  title: string;
  description: string;
  destination: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  startDate: string | null;
  endDate: string | null;
  duration: number | null;
  availableSpots: number | null;
  included: string[];
}

interface CheckoutClientProps {
  data: CheckoutData;
  locale: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

interface ParticipantInfo {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  profession: string;
  companyName: string;
  address: string;
  message: string;
}

interface PromoCodeState {
  code: string;
  isValid: boolean;
  isValidating: boolean;
  promoId?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountAmount?: number;
  errorMessage?: string;
}

export default function CheckoutClient({ data, locale, searchParams }: CheckoutClientProps) {
  const t = useTranslations('checkout');
  const tDetail = useTranslations('seminarDetail');

  const participantsCount = parseInt((searchParams.participants as string) || '1');
  const tripStartDate = searchParams.tripStartDate as string | undefined;
  const tripEndDate = searchParams.tripEndDate as string | undefined;

  const [participants, setParticipants] = useState<ParticipantInfo[]>(
    Array.from({ length: participantsCount }, () => ({
      firstName: '',
      lastName: '',
      email: '',
      countryCode: '+33', // Default to France
      phone: '',
      profession: '',
      companyName: '',
      address: '',
      message: '',
    }))
  );

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [promoCode, setPromoCode] = useState<PromoCodeState>({
    code: '',
    isValid: false,
    isValidating: false,
  });

  const [promoInput, setPromoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format dates for display
  const formatDateRange = () => {
    if (!data.startDate || !data.endDate) return null;

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    const startDay = String(start.getDate()).padStart(2, '0');
    const startMonth = String(start.getMonth() + 1).padStart(2, '0');
    const startYear = start.getFullYear();

    const endDay = String(end.getDate()).padStart(2, '0');
    const endMonth = String(end.getMonth() + 1).padStart(2, '0');
    const endYear = end.getFullYear();

    return `${startDay}/${startMonth}/${startYear} - ${endDay}/${endMonth}/${endYear}`;
  };

  // Format single date for trip date display
  const formatTripDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format trip date range
  const formatTripDateRange = () => {
    if (!tripStartDate || !tripEndDate) return null;
    return `${formatTripDate(tripStartDate)} - ${formatTripDate(tripEndDate)}`;
  };

  const displayDate = formatDateRange();
  const displayTripDate = formatTripDateRange();
  const durationText = data.duration
    ? `${data.duration} ${data.duration > 1 ? (tDetail('days') || 'jours') : (tDetail('day') || 'jour')}`
    : null;

  // Get currency symbol
  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      EUR: '€',
      USD: '$',
      GBP: '£',
      GEL: '₾',
    };
    return symbols[currency] || currency;
  };

  const currencySymbol = getCurrencySymbol(data.currency);

  // Price calculation with multi-participant discount
  // Discount applies ONLY to first 2 participants (25% off)
  // Additional participants pay full price
  const discountedParticipants = Math.min(participantsCount, 2);
  const fullPriceParticipants = Math.max(0, participantsCount - 2);

  const discountedSubtotal = participantsCount >= 2 ? data.price * 2 * 0.75 : 0; // First 2 with 25% discount
  const fullPriceSubtotal = participantsCount === 1 ? data.price : data.price * fullPriceParticipants;
  const baseSubtotal = participantsCount >= 2 ? discountedSubtotal + fullPriceSubtotal : data.price;

  // Calculate the discount amount for display
  const multiParticipantDiscount = participantsCount >= 2 ? data.price * 2 * 0.25 : 0;
  const subtotalAfterMultiDiscount = baseSubtotal;

  // Apply promo code discount on the already discounted price
  const promoDiscount = promoCode.isValid ? (promoCode.discountAmount || 0) : 0;
  const subtotalAfterAllDiscounts = subtotalAfterMultiDiscount - promoDiscount;

  // const tax = subtotalAfterAllDiscounts * 0.2; // 20% VAT
  const total = subtotalAfterAllDiscounts;

  // For backend: store the final calculation details
  const priceBreakdown = {
    basePrice: data.price,
    participantsCount,
    baseSubtotal,
    multiParticipantDiscount,
    promoCode: promoCode.isValid ? promoCode.code : null,
    promoDiscount,
    subtotalBeforeTax: subtotalAfterAllDiscounts,
    total,
  };

  const handleParticipantChange = (index: number, field: keyof ParticipantInfo, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  };

  const validatePromoCode = async () => {
    if (!promoInput.trim()) return;

    setPromoCode({
      code: promoInput,
      isValid: false,
      isValidating: true,
    });

    try {
      // Call Netlify function for promo code validation
      const response = await fetch('/.netlify/functions/validate-promo-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: promoInput,
          formation_id: data.seminarId,
          amount: subtotalAfterMultiDiscount,
        }),
      });

      const responseData = await response.json();

      if (responseData.is_valid) {
        setPromoCode({
          code: promoInput,
          isValid: true,
          isValidating: false,
          promoId: responseData.promo_id,
          discountType: responseData.discount_type,
          discountValue: responseData.discount_value,
          discountAmount: responseData.discount_amount,
        });
      } else {
        setPromoCode({
          code: promoInput,
          isValid: false,
          isValidating: false,
          errorMessage: responseData.error_message || (t('promoCodeInvalid') || 'Code promo invalide'),
        });
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      setPromoCode({
        code: promoInput,
        isValid: false,
        isValidating: false,
        errorMessage: t('promoCodeInvalid') || 'Code promo invalide',
      });
    }
  };

  const removePromoCode = () => {
    setPromoCode({
      code: '',
      isValid: false,
      isValidating: false,
    });
    setPromoInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert(t('mustAcceptTerms') || 'Vous devez accepter les conditions générales');
      return;
    }

    setIsSubmitting(true);

    try {
      // Format participants information for email
      const participantsDetails = participants.map((p, i) => `
Participant ${i + 1}:
- Nom: ${p.lastName}
- Prénom: ${p.firstName}
- Email: ${p.email}
- Téléphone: ${p.phone}
- Profession: ${p.profession}
- Société: ${p.companyName}
- Adresse: ${p.address}
${p.message ? `- Message: ${p.message}` : ''}
      `).join('\n');

      const currencySymbol = getCurrencySymbol(data.currency);

      // Prepare email message
      const emailMessage = `
NOUVELLE DEMANDE DE RÉSERVATION
================================

DÉTAILS DE LA FORMATION
------------------------
Formation: ${data.title}
Destination: ${data.destination} - ${data.city}, ${data.country}
Dates du voyage: ${displayTripDate || `${tripStartDate} → ${tripEndDate}`}
Nombre de participants: ${participantsCount}
Prix par personne: ${data.price}${currencySymbol}
${promoCode.isValid ? `Code promo: ${promoCode.code}\nRéduction: -${promoDiscount.toFixed(2)}${currencySymbol}` : ''}

💰 TOTAL: ${total.toFixed(2)}${currencySymbol}

INFORMATIONS DES PARTICIPANTS
------------------------------
${participantsDetails}

---
Cette demande a été envoyée depuis le site web GLI International.
Pour répondre au client, utilisez l'email: ${participants[0].email}
      `;

      // Using FormSubmit - same as contact form
      const response = await fetch('https://formsubmit.co/contact@gli-international.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: `${participants[0].firstName} ${participants[0].lastName}`,
          email: participants[0].email,
          message: emailMessage,
          _subject: `🎓 Nouvelle réservation - ${data.title}`,
          _template: 'table',
          _captcha: 'false',
        })
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      // Record promo code usage if a promo code was applied
      if (promoCode.isValid && promoCode.promoId) {
        try {
          // Generate a unique booking ID for tracking
          const bookingId = `booking_${Date.now()}_${participants[0].email.replace(/[^a-zA-Z0-9]/g, '_')}`;

          // Record the promo code usage
          const usageResponse = await fetch('/.netlify/functions/record-promo-usage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              promo_code_id: promoCode.promoId,
              payment_id: bookingId,
              discount_amount: promoDiscount,
              original_amount: subtotalAfterMultiDiscount,
              final_amount: total,
            }),
          });

          const usageData = await usageResponse.json();
          if (!usageData.success) {
            console.warn('Failed to record promo code usage:', usageData.error_message);
            // Don't fail the booking, just log the warning
          } else {
            console.log('Promo code usage recorded successfully:', usageData.usage_id);
          }
        } catch (promoError) {
          console.error('Error recording promo code usage:', promoError);
          // Don't fail the booking if promo recording fails
        }
      }

      // Prepare query params for confirmation page
      const confirmParams = new URLSearchParams({
        seminarTitle: data.title,
        destination: `${data.city}, ${data.country}`,
        tripDates: displayTripDate || '',
        participantsCount: participantsCount.toString(),
        total: total.toFixed(2),
        currency: data.currency,
      });

      // Redirect to confirmation page
      window.location.href = `/${locale}/formations/${data.destinationId}/checkout/confirmation?${confirmParams.toString()}`;
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert(t('errorSubmitting') || 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
      <div className="w-full px-4 md:px-8 lg:px-16">
        {/* Back Button */}
        <Link
          href={`/${locale}/formations/${data.destinationId}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 font-light"
        >
          ← {t('back') || 'Retour'}
        </Link>

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-8 tracking-wide">
          {t('title') || 'Confirmation et paiement'}
        </h1>

        <style dangerouslySetInnerHTML={{__html: `
          .checkout-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          @media (min-width: 1024px) {
            .checkout-grid {
              grid-template-columns: 2fr 1fr;
              gap: 3rem;
            }
          }
        `}} />

        <form onSubmit={handleSubmit}>
          <div className="checkout-grid">
            {/* Left Column - Forms */}
            <div className="space-y-6">

              {/* Participants Information */}
              <div className="bg-white p-6 md:p-8 lg:p-10">
                <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-wide">
                  {t('participantsInformation') || 'Informations des participants'}
                </h2>
                <div className="space-y-6">
                  {participants.map((participant, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <h3 className="text-lg font-light text-gray-900 mb-4">
                        {t('participant') || 'Participant'} {index + 1}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 font-light mb-2">
                            {t('firstName') || 'Prénom'} *
                          </label>
                          <input
                            type="text"
                            required
                            value={participant.firstName}
                            onChange={(e) => handleParticipantChange(index, 'firstName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 font-light mb-2">
                            {t('lastName') || 'Nom'} *
                          </label>
                          <input
                            type="text"
                            required
                            value={participant.lastName}
                            onChange={(e) => handleParticipantChange(index, 'lastName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-700 font-light mb-2">
                            {t('email') || 'Email'} *
                          </label>
                          <input
                            type="email"
                            required
                            value={participant.email}
                            onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-700 font-light mb-2">
                            {t('phone') || 'Téléphone'} *
                          </label>
                          <div className="flex gap-2 w-full">
                          {/*  <select*/}
                          {/*    value={participant.countryCode}*/}
                          {/*    onChange={(e) => handleParticipantChange(index, 'countryCode', e.target.value)}*/}
                          {/*    className="flex-shrink-0 px-3 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"*/}
                          {/*  >*/}
                          {/*    <option value="+33">🇫🇷 +33</option>*/}
                          {/*    <option value="+995">🇬🇪 +995</option>*/}
                          {/*    <option value="+1">🇺🇸 +1</option>*/}
                          {/*    <option value="+44">🇬🇧 +44</option>*/}
                          {/*    <option value="+49">🇩🇪 +49</option>*/}
                          {/*    <option value="+39">🇮🇹 +39</option>*/}
                          {/*    <option value="+34">🇪🇸 +34</option>*/}
                          {/*    <option value="+351">🇵🇹 +351</option>*/}
                          {/*    <option value="+32">🇧🇪 +32</option>*/}
                          {/*    <option value="+41">🇨🇭 +41</option>*/}
                          {/*    <option value="+31">🇳🇱 +31</option>*/}
                          {/*    <option value="+46">🇸🇪 +46</option>*/}
                          {/*    <option value="+47">🇳🇴 +47</option>*/}
                          {/*    <option value="+45">🇩🇰 +45</option>*/}
                          {/*    <option value="+358">🇫🇮 +358</option>*/}
                          {/*    <option value="+48">🇵🇱 +48</option>*/}
                          {/*    <option value="+420">🇨🇿 +420</option>*/}
                          {/*    <option value="+43">🇦🇹 +43</option>*/}
                          {/*    <option value="+30">🇬🇷 +30</option>*/}
                          {/*    <option value="+90">🇹🇷 +90</option>*/}
                          {/*    <option value="+971">🇦🇪 +971</option>*/}
                          {/*    <option value="+966">🇸🇦 +966</option>*/}
                          {/*    <option value="+974">🇶🇦 +974</option>*/}
                          {/*    <option value="+965">🇰🇼 +965</option>*/}
                          {/*    <option value="+962">🇯🇴 +962</option>*/}
                          {/*    <option value="+961">🇱🇧 +961</option>*/}
                          {/*    <option value="+212">🇲🇦 +212</option>*/}
                          {/*    <option value="+213">🇩🇿 +213</option>*/}
                          {/*    <option value="+216">🇹🇳 +216</option>*/}
                          {/*    <option value="+20">🇪🇬 +20</option>*/}
                          {/*    <option value="+86">🇨🇳 +86</option>*/}
                          {/*    <option value="+81">🇯🇵 +81</option>*/}
                          {/*    <option value="+82">🇰🇷 +82</option>*/}
                          {/*    <option value="+91">🇮🇳 +91</option>*/}
                          {/*    <option value="+65">🇸🇬 +65</option>*/}
                          {/*    <option value="+60">🇲🇾 +60</option>*/}
                          {/*    <option value="+66">🇹🇭 +66</option>*/}
                          {/*    <option value="+84">🇻🇳 +84</option>*/}
                          {/*    <option value="+62">🇮🇩 +62</option>*/}
                          {/*    <option value="+63">🇵🇭 +63</option>*/}
                          {/*    <option value="+61">🇦🇺 +61</option>*/}
                          {/*    <option value="+64">🇳🇿 +64</option>*/}
                          {/*    <option value="+55">🇧🇷 +55</option>*/}
                          {/*    <option value="+52">🇲🇽 +52</option>*/}
                          {/*    <option value="+54">🇦🇷 +54</option>*/}
                          {/*    <option value="+56">🇨🇱 +56</option>*/}
                          {/*    <option value="+57">🇨🇴 +57</option>*/}
                          {/*    <option value="+51">🇵🇪 +51</option>*/}
                          {/*    <option value="+27">🇿🇦 +27</option>*/}
                          {/*    <option value="+234">🇳🇬 +234</option>*/}
                          {/*    <option value="+254">🇰🇪 +254</option>*/}
                          {/*    <option value="+7">🇷🇺 +7</option>*/}
                          {/*    <option value="+380">🇺🇦 +380</option>*/}
                          {/*  </select>*/}
                            <input
                              type="tel"
                              required
                              value={participant.phone}
                              onChange={(e) => handleParticipantChange(index, 'phone', e.target.value)}
                              placeholder="+33601020304"
                              className="flex-1 min-w-0 px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-700 font-light mb-2">
                            {t('profession') || 'Profession'} *
                          </label>
                          <input
                            type="text"
                            required
                            value={participant.profession}
                            onChange={(e) => handleParticipantChange(index, 'profession', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-700 font-light mb-2">
                            {t('companyName') || 'Nom de la société'} *
                          </label>
                          <input
                            type="text"
                            required
                            value={participant.companyName}
                            onChange={(e) => handleParticipantChange(index, 'companyName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-700 font-light mb-2">
                            {t('address') || 'Adresse'} *
                          </label>
                          <input
                            type="text"
                            required
                            value={participant.address}
                            onChange={(e) => handleParticipantChange(index, 'address', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-700 font-light mb-2">
                            {t('message') || 'Message (optionnel)'}
                          </label>
                          <textarea
                            value={participant.message}
                            onChange={(e) => handleParticipantChange(index, 'message', e.target.value)}
                            placeholder={t('messagePlaceholder') || 'Avez-vous des demandes particulières ?'}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-white p-6 md:p-8 lg:p-10">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-5 h-5 mt-0.5"
                  />
                  <span className="text-sm text-gray-600 font-light">
                    {t('acceptTerms') || 'J\'accepte les'}{' '}
                    <Link href={`/${locale}/conditions-generales-de-vente`} className="underline hover:text-gray-900" target="_blank" rel="noopener noreferrer">
                      {t('termsAndConditions') || 'conditions générales de vente'}
                    </Link>
                  </span>
                </label>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div>
              <div className="bg-white p-6 md:p-8 lg:p-10 rounded-2xl shadow-sm lg:sticky lg:top-24">
                <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-wide">
                  {t('orderSummary') || 'Récapitulatif'}
                </h2>

                {/* Seminar Details */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="font-light text-gray-900 mb-2">{data.title}</h3>
                  <p className="text-sm text-gray-600 font-light mb-1">{data.destination}</p>
                  {displayDate && <p className="text-sm text-gray-600 font-light mb-1">{displayDate}</p>}
                  {durationText && <p className="text-sm text-gray-600 font-light mb-1">{durationText}</p>}
                  {displayTripDate && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-900 font-medium mb-1">
                        {t('tripDates') || 'Dates du voyage'}:
                      </p>
                      <p className="text-sm text-gray-900 font-light">
                        {displayTripDate}
                      </p>
                    </div>
                  )}
                </div>

                {/* Promo Code Section */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <label className="block text-sm text-gray-700 font-light mb-2">
                    {t('promoCode') || 'Code promo'}
                  </label>

                  {promoCode.isValid ? (
                    // Applied promo code
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-light text-green-800">
                          {t('promoCodeApplied') || 'Code promo appliqué'}: <strong>{promoCode.code}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removePromoCode}
                        className="text-sm text-gray-600 hover:text-gray-900 font-light underline"
                      >
                        {t('removePromoCode') || 'Retirer'}
                      </button>
                    </div>
                  ) : (
                    // Promo code input
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder={t('promoCodePlaceholder') || 'Entrez votre code promo'}
                        className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                        disabled={promoCode.isValidating}
                      />
                      <button
                        type="button"
                        onClick={validatePromoCode}
                        disabled={promoCode.isValidating || !promoInput.trim()}
                        className="w-full px-6 py-3 bg-gray-900 text-white text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {promoCode.isValidating ? (t('promoCodeValidating') || 'Validation...') : (t('applyPromoCode') || 'Appliquer')}
                      </button>
                    </div>
                  )}

                  {/* Error message */}
                  {!promoCode.isValid && promoCode.errorMessage && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="font-light">{promoCode.errorMessage}</span>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 font-light">
                    <span>{t('pricePerPerson') || 'Prix par personne'}</span>
                    <span>{data.price}{currencySymbol}</span>
                  </div>
                  {participantsCount >= 2 ? (
                    <>
                      <div className="flex justify-between text-gray-600 font-light text-sm">
                        <span>• 2 premiers participants (-25%)</span>
                        <span>{(data.price * 2 * 0.75).toFixed(2)}{currencySymbol}</span>
                      </div>
                      {fullPriceParticipants > 0 && (
                        <div className="flex justify-between text-gray-600 font-light text-sm">
                          <span>• {fullPriceParticipants} participant{fullPriceParticipants > 1 ? 's' : ''} supplémentaire{fullPriceParticipants > 1 ? 's' : ''}</span>
                          <span>{fullPriceSubtotal.toFixed(2)}{currencySymbol}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-between text-gray-600 font-light">
                      <span>{t('participants') || 'Participants'}</span>
                      <span>× {participantsCount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-900 font-light border-t border-gray-200 pt-3">
                    <span>{t('subtotal') || 'Sous-total'}</span>
                    <span>{baseSubtotal.toFixed(2)}{currencySymbol}</span>
                  </div>

                  {/* Promo code discount - only show if promo code is applied */}
                  {promoCode.isValid && promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600 font-light">
                      <span>
                        {t('discount') || 'Réduction'}
                        {promoCode.discountType === 'percentage'
                          ? ` (-${promoCode.discountValue}%)`
                          : ''
                        }
                      </span>
                      <span>-{promoDiscount.toFixed(2)}{currencySymbol}</span>
                    </div>
                  )}

                  {/*<div className="flex justify-between text-gray-600 font-light">*/}
                  {/*  /!*<span>{t('tax') || 'TVA (20%)'}</span>*!/*/}
                  {/*  /!*<span>{tax.toFixed(2)}{currencySymbol}</span>*!/*/}
                  {/*</div>*/}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-light text-gray-900">{t('total') || 'Total'}</span>
                    <span className="text-3xl font-light text-gray-900">{total.toFixed(2)}{currencySymbol}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!acceptedTerms || isSubmitting}
                  className="w-full bg-gray-900 text-white py-4 px-6 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (t('sending') || 'Envoi...') : (t('sendRequest') || 'Envoyer la demande')}
                </button>

                <p className="text-xs text-gray-500 font-light text-center mt-4">
                  {t('securePayment') || 'Paiement 100% sécurisé'}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
