'use client';

interface OrganizationSchemaProps {
  locale: string;
}

export function OrganizationSchema({ locale }: OrganizationSchemaProps) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GLI International',
    legalName: 'BRDWISE',
    url: 'https://www.gli-international.com',
    logo: 'https://www.gli-international.com/logo-gli-text.png',
    description: locale === 'fr'
      ? 'GLI International organise des séminaires exceptionnels dans le monde entier pour les professionnels de santé.'
      : 'GLI International organizes exceptional seminars worldwide for health professionals.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@gli-international.com',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'French', 'Georgian'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kursebi Street N°15',
      addressLocality: 'Tbilisi',
      addressCountry: 'GE',
    },
    sameAs: [
      // Add your social media URLs here when available
      // 'https://www.facebook.com/gliinternational',
      // 'https://www.linkedin.com/company/gliinternational',
      // 'https://www.instagram.com/gliinternational',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}

interface CourseSchemaProps {
  name: string;
  description: string;
  provider: string;
  url: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
  currency?: string;
  locale: string;
}

export function CourseSchema({
  name,
  description,
  provider,
  url,
  location,
  startDate,
  endDate,
  price,
  currency = 'EUR',
  locale,
}: CourseSchemaProps) {
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
      sameAs: 'https://www.gli-international.com',
    },
    url,
    ...(location && {
      location: {
        '@type': 'Place',
        name: location,
      },
    }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(price && {
      offers: {
        '@type': 'Offer',
        price: price.toString(),
        priceCurrency: currency,
        url,
        availability: 'https://schema.org/InStock',
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

interface WebSiteSchemaProps {
  locale: string;
}

export function WebSiteSchema({ locale }: WebSiteSchemaProps) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GLI International',
    url: 'https://www.gli-international.com',
    description: locale === 'fr'
      ? 'Séminaires de formation professionnelle dans le monde entier'
      : 'Professional training seminars worldwide',
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://www.gli-international.com/${locale}/formations?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
}
