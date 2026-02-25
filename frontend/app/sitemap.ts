import { MetadataRoute } from 'next';

const baseUrl = 'https://www.gli-international.com';
const locales = ['en', 'fr', 'ka'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // Root redirect - points to French homepage
  routes.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
    alternates: {




      languages: {
        en: `${baseUrl}/en`,
        fr: `${baseUrl}/fr`,
        ka: `${baseUrl}/ka`,
      },
    },
  });

  // Static pages for each locale
  const staticPages = [
    '',  // homepage
    'about',
    'contact',
    'formations',
  ];

  // Legal pages per locale
  const legalPages = {
    en: [
      'legal-notice',
      'terms-and-conditions',
      'privacy-policy',
    ],
    fr: [
      'mentions-legales',
      'conditions-generales-de-vente',
      'politique-de-confidentialite',
    ],
    ka: [
      'legal-notice',
      'terms-and-conditions',
      'privacy-policy',
    ],
  };

  // Add static pages for each locale
  locales.forEach((locale) => {
    staticPages.forEach((page) => {
      routes.push({
        url: `${baseUrl}/${locale}${page ? `/${page}` : ''}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${page ? `/${page}` : ''}`,
            fr: `${baseUrl}/fr${page ? `/${page}` : ''}`,
            ka: `${baseUrl}/ka${page ? `/${page}` : ''}`,
          },
        },
      });
    });

    // Add legal pages for each locale
    const localeSpecificLegalPages = legalPages[locale as keyof typeof legalPages];
    localeSpecificLegalPages.forEach((page) => {
      routes.push({
        url: `${baseUrl}/${locale}/${page}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    });
  });

  return routes;
}
