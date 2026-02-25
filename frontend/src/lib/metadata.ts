import type { Metadata } from 'next';

const baseUrl = 'https://www.gli-international.com';

interface PageMetadataProps {
  locale: string;
  title: {
    en: string;
    fr: string;
    ka: string;
  };
  description: {
    en: string;
    fr: string;
    ka: string;
  };
  path: string;
  image?: string;
  noIndex?: boolean;
}

export function generatePageMetadata({
  locale,
  title,
  description,
  path,
  image = `${baseUrl}/logo-gli-text.png`,
  noIndex = false,
}: PageMetadataProps): Metadata {
  const pageTitle = title[locale as keyof typeof title] || title.en;
  const pageDescription = description[locale as keyof typeof description] || description.en;
  const fullUrl = `${baseUrl}/${locale}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: fullUrl,
      languages: {
        en: `${baseUrl}/en${path}`,
        fr: `${baseUrl}/fr${path}`,
        ka: `${baseUrl}/ka${path}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : locale === 'ka' ? 'ka_GE' : 'en_US',
      url: fullUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: 'GLI International',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [image],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}
