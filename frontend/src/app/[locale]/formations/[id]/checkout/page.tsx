'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CreditCard, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Mock data - same as before
const mockSeminars = [
  {
    id: 1,
    title: 'Implantologie Avancée',
    destination: 'Tbilisi, Géorgie',
    price: 2499,
    date: '15-20 Mars 2025',
    duration: '6 jours',
  },
  {
    id: 2,
    title: 'Orthodontie Moderne',
    destination: 'Paris, France',
    price: 1899,
    date: '10-14 Avril 2025',
    duration: '5 jours',
  },
  {
    id: 3,
    title: 'Chirurgie Esthétique',
    destination: 'Singapour',
    price: 3299,
    date: '5-12 Mai 2025',
    duration: '8 jours',
  },
  {
    id: 4,
    title: 'Parodontologie Clinique',
    destination: 'Barcelone, Espagne',
    price: 1699,
    date: '22-26 Juin 2025',
    duration: '5 jours',
  },
  {
    id: 5,
    title: 'Dermatologie Esthétique',
    destination: 'Dubai, EAU',
    price: 2899,
    date: '8-14 Juillet 2025',
    duration: '7 jours',
  },
  {
    id: 6,
    title: 'Endodontie Avancée',
    destination: 'Lisbonne, Portugal',
    price: 1599,
    date: '15-19 Août 2025',
    duration: '5 jours',
  },
];

interface ParticipantInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function CheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations('checkout');
  const locale = useParams().locale as string;

  const participantsCount = parseInt(searchParams.get('participants') || '1');
  const seminar = mockSeminars.find(s => s.id === parseInt(params.id as string));

  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [participants, setParticipants] = useState<ParticipantInfo[]>(
    Array.from({ length: participantsCount }, () => ({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    }))
  );

  const [paymentMethod, setPaymentMethod] = useState<'visa' | 'mastercard'>('visa');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (!seminar) {
    return (
      <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
        <div className="w-full px-4 md:px-8 lg:px-16">
          <p className="text-center text-gray-600">{t('notFound')}</p>
        </div>
      </div>
    );
  }

  const subtotal = seminar.price * participantsCount;
  const tax = subtotal * 0.2; // 20% VAT
  const total = subtotal + tax;

  const handleParticipantChange = (index: number, field: keyof ParticipantInfo, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert(t('mustAcceptTerms'));
      return;
    }
    // TODO: Implement payment processing
    alert(t('paymentNotImplemented'));
  };

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
      <div className="w-full px-4 md:px-8 lg:px-16">
        {/* Back Button */}
        <Link
          href={`/${locale}/formations/${seminar.id}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 font-light"
        >
          ← {t('back')}
        </Link>

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-8 tracking-wide">
          {t('title')}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <div className="bg-white p-6 md:p-8">
                <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-wide">
                  {t('contactInformation')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 font-light mb-2">
                      {t('firstName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo.firstName}
                      onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-light mb-2">
                      {t('lastName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo.lastName}
                      onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-light mb-2">
                      {t('email')} *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-light mb-2">
                      {t('phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 font-light mb-2">
                      {t('address')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-light mb-2">
                      {t('city')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo.city}
                      onChange={(e) => setContactInfo({ ...contactInfo, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-light mb-2">
                      {t('postalCode')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo.postalCode}
                      onChange={(e) => setContactInfo({ ...contactInfo, postalCode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 font-light mb-2">
                      {t('country')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo.country}
                      onChange={(e) => setContactInfo({ ...contactInfo, country: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                    />
                  </div>
                </div>
              </div>

              {/* Participants Information */}
              <div className="bg-white p-6 md:p-8">
                <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-wide">
                  {t('participantsInformation')}
                </h2>
                <div className="space-y-6">
                  {participants.map((participant, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <h3 className="text-lg font-light text-gray-900 mb-4">
                        {t('participant')} {index + 1}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 font-light mb-2">
                            {t('firstName')} *
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
                            {t('lastName')} *
                          </label>
                          <input
                            type="text"
                            required
                            value={participant.lastName}
                            onChange={(e) => handleParticipantChange(index, 'lastName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 font-light mb-2">
                            {t('email')} *
                          </label>
                          <input
                            type="email"
                            required
                            value={participant.email}
                            onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 font-light mb-2">
                            {t('phone')} *
                          </label>
                          <input
                            type="tel"
                            required
                            value={participant.phone}
                            onChange={(e) => handleParticipantChange(index, 'phone', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all font-light"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 md:p-8">
                <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-wide">
                  {t('paymentMethod')}
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-4 border-2 border-gray-300 hover:border-gray-900 transition-all cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="visa"
                      checked={paymentMethod === 'visa'}
                      onChange={() => setPaymentMethod('visa')}
                      className="w-5 h-5"
                    />
                    <CreditCard className="w-6 h-6 text-gray-600" />
                    <span className="font-light text-gray-900">Visa</span>
                  </label>
                  <label className="flex items-center gap-4 p-4 border-2 border-gray-300 hover:border-gray-900 transition-all cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="mastercard"
                      checked={paymentMethod === 'mastercard'}
                      onChange={() => setPaymentMethod('mastercard')}
                      className="w-5 h-5"
                    />
                    <CreditCard className="w-6 h-6 text-gray-600" />
                    <span className="font-light text-gray-900">Mastercard</span>
                  </label>
                </div>

                {/* Terms and Conditions */}
                <div className="mt-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-5 h-5 mt-0.5"
                    />
                    <span className="text-sm text-gray-600 font-light">
                      {t('acceptTerms')}{' '}
                      <Link href={`/${locale}/terms`} className="underline hover:text-gray-900">
                        {t('termsAndConditions')}
                      </Link>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div>
              <div className="bg-white p-6 md:p-8 sticky top-24">
                <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-wide">
                  {t('orderSummary')}
                </h2>

                {/* Seminar Details */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="font-light text-gray-900 mb-2">{seminar.title}</h3>
                  <p className="text-sm text-gray-600 font-light mb-1">{seminar.destination}</p>
                  <p className="text-sm text-gray-600 font-light mb-1">{seminar.date}</p>
                  <p className="text-sm text-gray-600 font-light">{seminar.duration}</p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 font-light">
                    <span>{t('pricePerPerson')}</span>
                    <span>{seminar.price}€</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-light">
                    <span>{t('participants')}</span>
                    <span>× {participantsCount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-light">
                    <span>{t('subtotal')}</span>
                    <span>{subtotal}€</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-light">
                    <span>{t('tax')}</span>
                    <span>{tax.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-light text-gray-900">{t('total')}</span>
                    <span className="text-3xl font-light text-gray-900">{total.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!acceptedTerms}
                  className="w-full bg-gray-900 text-white py-4 px-6 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('proceedToPayment')}
                </button>

                <p className="text-xs text-gray-500 font-light text-center mt-4">
                  {t('securePayment')}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
