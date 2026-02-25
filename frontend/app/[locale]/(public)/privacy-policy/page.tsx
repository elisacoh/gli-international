import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    locale: 'en',
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
    path: '/privacy-policy',
  });
}

export default function PrivacyPolicyPage() {
  return (
    <div
      className="min-h-screen py-16 md:py-20 lg:py-24"
      style={{ backgroundColor: "rgb(231, 227, 216)" }}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-8 md:mb-12">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-gray-700 font-light">
          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              1. Data collected
            </h2>
            <p className="mb-4">
              When using the gli-international.com website, we may collect the
              following data:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                Information submitted via contact forms (first name, last name,
                email address, message)
              </li>
              <li>
                Technical information related to navigation (IP address,
                browser, pages viewed)
              </li>
            </ul>
            <p>
              This data is strictly limited to what is necessary to ensure the
              proper functioning of the website and to respond to user requests.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              2. Purpose of data processing
            </h2>
            <p className="mb-4">
              The collected data is used for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Responding to requests sent via the contact form</li>
              <li>Managing registrations for seminars and services offered</li>
              <li>Improving user experience and website content</li>
              <li>Conducting anonymized statistical analysis</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              3. Legal basis for processing
            </h2>
            <p className="mb-4">
              Data processing is based on:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Your consent when you voluntarily submit information via a form
              </li>
              <li>
                The legitimate interest of GLI International to ensure the
                management and improvement of its services
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              4. Data recipients
            </h2>
            <p className="mb-4">
              The collected data is intended exclusively for GLI International
              and its technical service providers (hosting provider, email
              service).
            </p>
            <p>
              Data is neither sold nor transmitted to third parties for
              commercial purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              5. Data retention period
            </h2>
            <p className="mb-4">
              Your data is retained for the period strictly necessary for the
              purposes for which it was collected:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Form data: 3 years from the last contact</li>
              <li>
                Cookies and trackers: period defined by current regulations
                (max. 13 months)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              6. Cookies and trackers
            </h2>
            <p className="mb-4">
              The website uses cookies to improve your browsing experience and
              conduct visitor statistics.
            </p>
            <p className="mb-4">
              You can configure your browser to refuse or manage cookies.
            </p>
            <p>
              An information banner allows you to accept or refuse cookies
              during your first visit.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              7. Your rights
            </h2>
            <p className="mb-4">
              In accordance with the General Data Protection Regulation (GDPR),
              you have the following rights regarding your data:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Right of access</li>
              <li>Right to rectification</li>
              <li>Right to erasure</li>
              <li>Right to object</li>
              <li>Right to restriction of processing</li>
              <li>Right to data portability</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, you can contact us at the following
              address:{" "}
              <a
                href="mailto:contact@gli-international.com"
                className="text-gray-900 underline hover:text-gray-700"
              >
                contact@gli-international.com
              </a>
            </p>
            <p>
              You also have the right to lodge a complaint with a competent data
              protection supervisory authority.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              8. Data security
            </h2>
            <p className="mb-4">
              GLI International implements all appropriate technical and
              organizational measures to protect your data against accidental
              destruction, loss, alteration, disclosure, or unauthorized access.
            </p>
            <p>
              However, no method of transmission over the Internet or electronic
              storage is completely secure. We strive to protect your data, but
              we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              9. Changes to the privacy policy
            </h2>
            <p className="mb-4">
              We reserve the right to modify this privacy policy at any time to
              reflect legal, technical, or organizational changes.
            </p>
            <p>
              Any modification will be published on this page with an update
              date.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-normal text-gray-900 mb-4">
              10. Contact
            </h2>
            <p>
              For any questions regarding this privacy policy or the management
              of your personal data, you can contact us at:{" "}
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
