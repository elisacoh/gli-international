import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    locale: 'fr',
    title: {
      en: 'Privacy Policy',
      fr: 'Politique de Confidentialité',
      ka: 'Privacy Policy',
    },
    description: {
      en: 'Privacy policy and data protection information for GLI International.',
      fr: 'Politique de confidentialité et informations sur la protection des données de GLI International.',
      ka: 'Privacy policy and data protection information for GLI International.',
    },
    path: '/politique-de-confidentialite',
  });
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div
      className="min-h-screen py-16 md:py-20 lg:py-24"
      style={{ backgroundColor: "rgb(231, 227, 216)" }}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-8 md:mb-12">
          Politique de Confidentialité
        </h1>

        <div className="space-y-8 text-gray-700 font-light">
          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              1. Données collectées
            </h2>
            <p className="mb-4">
              Dans le cadre de l'utilisation du site gli-international.com, nous
              pouvons être amenés à collecter les données suivantes :
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                Informations transmises via les formulaires de contact (nom,
                prénom, adresse e-mail, message)
              </li>
              <li>
                Informations techniques liées à la navigation (adresse IP,
                navigateur, pages consultées)
              </li>
            </ul>
            <p>
              Ces données sont strictement limitées à ce qui est nécessaire pour
              assurer le bon fonctionnement du site et répondre aux demandes des
              utilisateurs.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              2. Finalités du traitement
            </h2>
            <p className="mb-4">
              Les données collectées ont pour objectifs :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Répondre aux demandes envoyées via le formulaire de contact</li>
              <li>Gérer les inscriptions aux séminaires et services proposés</li>
              <li>Améliorer l'expérience utilisateur et le contenu du site</li>
              <li>Réaliser des analyses statistiques anonymisées</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              3. Base légale du traitement
            </h2>
            <p className="mb-4">
              Le traitement des données est fondé sur :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Votre consentement lorsque vous soumettez volontairement des
                informations via un formulaire
              </li>
              <li>
                L'intérêt légitime de GLI international pour assurer la gestion
                et l'amélioration de ses services
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              4. Destinataires des données
            </h2>
            <p className="mb-4">
              Les données collectées sont destinées exclusivement à GLI
              international et à ses éventuels prestataires techniques
              (hébergeur, outil de messagerie).
            </p>
            <p>
              Elles ne sont ni vendues ni transmises à des tiers à des fins
              commerciales.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              5. Durée de conservation
            </h2>
            <p className="mb-4">
              Vos données sont conservées pour la durée strictement nécessaire
              aux finalités pour lesquelles elles ont été collectées :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Données des formulaires : 3 ans à compter du dernier contact
              </li>
              <li>
                Cookies et traceurs : durée définie par la réglementation en
                vigueur (max. 13 mois)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              6. Cookies et traceurs
            </h2>
            <p className="mb-4">
              Le site utilise des cookies pour améliorer votre expérience de
              navigation et réaliser des statistiques de visites.
            </p>
            <p className="mb-4">
              Vous pouvez configurer votre navigateur pour refuser ou gérer les
              cookies.
            </p>
            <p>
              Un bandeau d'information vous permet d'accepter ou de refuser les
              cookies lors de votre première visite.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              7. Vos droits
            </h2>
            <p className="mb-4">
              Conformément au Règlement Général sur la Protection des Données
              (RGPD), vous disposez des droits suivants sur vos données :
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Droit d'accès</li>
              <li>Droit de rectification</li>
              <li>Droit d'effacement</li>
              <li>Droit d'opposition</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
            </ul>
            <p className="mb-4">
              Pour exercer ces droits, vous pouvez nous contacter à l'adresse
              suivante :{" "}
              <a
                href="mailto:contact@gli-international.com"
                className="text-gray-900 underline hover:text-gray-700"
              >
                contact@gli-international.com
              </a>
            </p>
            <p>
              Vous disposez également du droit d'introduire une réclamation
              auprès d'une autorité de contrôle compétente en matière de
              protection des données.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              8. Sécurité des données
            </h2>
            <p className="mb-4">
              GLI international met en œuvre toutes les mesures techniques et
              organisationnelles appropriées pour protéger vos données contre
              toute destruction accidentelle, perte, altération, divulgation ou
              accès non autorisé.
            </p>
            <p>
              Toutefois, aucune méthode de transmission sur Internet ou de
              stockage électronique n'est totalement sécurisée. Nous nous
              efforçons de protéger vos données, mais nous ne pouvons garantir
              une sécurité absolue.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              9. Modifications de la politique de confidentialité
            </h2>
            <p className="mb-4">
              Nous nous réservons le droit de modifier cette politique de
              confidentialité à tout moment afin de refléter les évolutions
              légales, techniques ou organisationnelles.
            </p>
            <p>
              Toute modification sera publiée sur cette page avec une date de
              mise à jour.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              10. Contact
            </h2>
            <p>
              Pour toute question relative à cette politique de confidentialité
              ou à la gestion de vos données personnelles, vous pouvez nous
              contacter à l'adresse :{" "}
              <a
                href="mailto:contact@gli-international.com"
                className="text-gray-900 underline hover:text-gray-700"
              >
                contact@gli-international.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
