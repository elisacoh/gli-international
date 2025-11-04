'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MapPin, Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Mock data - same as in the list page
const mockSeminars = [
  {
    id: 1,
    title: 'Implantologie Avancée',
    destination: 'Tbilisi, Géorgie',
    image: '/georgia.avif',
    price: 2499,
    date: '15-20 Mars 2025',
    duration: '6 jours',
    category: 'Dentisterie',
    featured: true,
    popular: true,
    description: 'Perfectionnez vos compétences en implantologie avec ce séminaire intensif dirigé par des experts reconnus internationalement. Vous apprendrez les dernières techniques et technologies dans le domaine de l\'implantologie dentaire moderne.',
    program: [
      'Jour 1-2: Fondamentaux de l\'implantologie moderne',
      'Jour 3-4: Techniques chirurgicales avancées',
      'Jour 5: Gestion des cas complexes',
      'Jour 6: Pratique clinique et certification'
    ],
    included: [
      'Formation théorique et pratique',
      'Matériel pédagogique complet',
      'Certificat de participation',
      'Hébergement 5 étoiles',
      'Repas et pauses café',
      'Excursions culturelles'
    ]
  },
  {
    id: 2,
    title: 'Orthodontie Moderne',
    destination: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073',
    price: 1899,
    date: '10-14 Avril 2025',
    duration: '5 jours',
    category: 'Dentisterie',
    featured: false,
    popular: true,
    description: 'Découvrez les dernières avancées en orthodontie moderne et les techniques invisibles. Formation complète avec ateliers pratiques dans la ville lumière.',
    program: [
      'Jour 1: Introduction aux aligneurs invisibles',
      'Jour 2-3: Planification numérique et cas cliniques',
      'Jour 4: Techniques avancées',
      'Jour 5: Pratique et évaluation'
    ],
    included: [
      'Formation complète',
      'Documentation technique',
      'Certificat professionnel',
      'Hébergement centre Paris',
      'Petit-déjeuner inclus',
      'Visite guidée de Paris'
    ]
  },
  {
    id: 3,
    title: 'Chirurgie Esthétique',
    destination: 'Singapour',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2052',
    price: 3299,
    date: '5-12 Mai 2025',
    duration: '8 jours',
    category: 'Chirurgie',
    featured: true,
    popular: false,
    description: 'Séminaire exclusif de chirurgie esthétique dans l\'une des destinations médicales les plus avancées au monde. Apprenez des techniques de pointe avec des chirurgiens renommés.',
    program: [
      'Jour 1-2: Fondamentaux de la chirurgie esthétique',
      'Jour 3-4: Techniques faciales avancées',
      'Jour 5-6: Procédures corporelles',
      'Jour 7: Gestion post-opératoire',
      'Jour 8: Examen et certification'
    ],
    included: [
      'Formation intensive',
      'Accès à la clinique privée',
      'Certificat international',
      'Hôtel de luxe Marina Bay',
      'Tous les repas inclus',
      'Excursions et activités'
    ]
  },
  {
    id: 4,
    title: 'Parodontologie Clinique',
    destination: 'Barcelone, Espagne',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070',
    price: 1699,
    date: '22-26 Juin 2025',
    duration: '5 jours',
    category: 'Dentisterie',
    featured: false,
    popular: true,
    description: 'Maîtrisez les techniques modernes de parodontologie dans la magnifique ville de Barcelone.',
    program: [
      'Jour 1: Diagnostic parodontal',
      'Jour 2-3: Techniques chirurgicales',
      'Jour 4: Maintenance et prévention',
      'Jour 5: Cas pratiques'
    ],
    included: [
      'Formation complète',
      'Kit parodontal',
      'Certificat',
      'Hébergement boutique',
      'Repas inclus',
      'Visite de Barcelone'
    ]
  },
  {
    id: 5,
    title: 'Dermatologie Esthétique',
    destination: 'Dubai, EAU',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070',
    price: 2899,
    date: '8-14 Juillet 2025',
    duration: '7 jours',
    category: 'Dermatologie',
    featured: true,
    popular: false,
    description: 'Formation avancée en dermatologie esthétique dans le luxe de Dubai, avec accès aux dernières technologies.',
    program: [
      'Jour 1-2: Injectables et fillers',
      'Jour 3-4: Lasers et technologies',
      'Jour 5-6: Traitements combinés',
      'Jour 7: Certification'
    ],
    included: [
      'Formation premium',
      'Accès équipements de pointe',
      'Certificat international',
      'Hôtel 5 étoiles',
      'Tous les repas',
      'Safari dans le désert'
    ]
  },
  {
    id: 6,
    title: 'Endodontie Avancée',
    destination: 'Lisbonne, Portugal',
    image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?q=80&w=2073',
    price: 1599,
    date: '15-19 Août 2025',
    duration: '5 jours',
    category: 'Dentisterie',
    featured: false,
    popular: false,
    description: 'Perfectionnez vos techniques endodontiques avec les meilleurs spécialistes européens.',
    program: [
      'Jour 1: Anatomie canalaire moderne',
      'Jour 2-3: Techniques de traitement',
      'Jour 4: Cas complexes',
      'Jour 5: Pratique et évaluation'
    ],
    included: [
      'Formation technique',
      'Équipement professionnel',
      'Certificat',
      'Hébergement centre-ville',
      'Petits-déjeuners',
      'Découverte de Lisbonne'
    ]
  },
];

export default function SeminarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('seminarDetail');
  const locale = useParams().locale as string;
  const [participants, setParticipants] = useState(1);

  const seminar = mockSeminars.find(s => s.id === parseInt(params.id as string));

  if (!seminar) {
    return (
      <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
        <div className="w-full px-4 md:px-8 lg:px-16">
          <p className="text-center text-gray-600">{t('notFound')}</p>
        </div>
      </div>
    );
  }

  const totalPrice = seminar.price * participants;

  const handleContinue = () => {
    router.push(`/${locale}/formations/${seminar.id}/checkout?participants=${participants}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
      <div className="w-full px-4 md:px-8 lg:px-16">
        {/* Back Button */}
        <Link
          href={`/${locale}/formations`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 font-light"
        >
          ← {t('back')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image and Description */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-[4/3] overflow-hidden mb-8">
              <img
                src={seminar.image}
                alt={seminar.destination}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title and Location */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 tracking-wide">
                {seminar.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="text-lg font-light">{seminar.destination}</span>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-light">{t('date')}</span>
                </div>
                <p className="text-gray-900 font-light">{seminar.date}</p>
              </div>
              <div className="bg-white p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-light">{t('duration')}</span>
                </div>
                <p className="text-gray-900 font-light">{seminar.duration}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                {t('description')}
              </h2>
              <p className="text-gray-600 font-light leading-relaxed">
                {seminar.description}
              </p>
            </div>

            {/* Program */}
            <div className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                {t('program')}
              </h2>
              <div className="space-y-3">
                {seminar.program.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 font-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Included */}
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                {t('included')}
              </h2>
              <div className="space-y-3">
                {seminar.included.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 font-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <div className="bg-white p-8 sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-gray-500 font-light mb-2">{t('pricePerPerson')}</p>
                <p className="text-4xl font-light text-gray-900">{seminar.price}€</p>
              </div>

              {/* Number of Participants */}
              <div className="mb-6">
                <label className="block text-sm text-gray-700 font-light mb-3">
                  <Users className="w-4 h-4 inline-block mr-2" />
                  {t('participants')}
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
                    onClick={() => setParticipants(Math.min(10, participants + 1))}
                    className="w-12 h-12 border border-gray-300 hover:border-gray-900 transition-colors flex items-center justify-center text-xl"
                    disabled={participants >= 10}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-light">{t('total')}</span>
                  <span className="text-3xl font-light text-gray-900">{totalPrice}€</span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="w-full bg-gray-900 text-white py-4 px-6 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-all duration-300"
              >
                {t('continue')}
              </button>

              {/* Info */}
              <p className="text-xs text-gray-500 font-light text-center mt-4">
                {t('noPaymentYet')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
