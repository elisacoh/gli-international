import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import '../globals.css';
import { OrganizationSchema, WebSiteSchema } from '@/components/StructuredData';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const baseUrl = 'https://www.gli-international.com';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const titles = {
    en: 'GLI International - Travel, Learn, Deduct: Professional Training Worldwide',
    fr: 'GLI International - Voyagez, Apprenez, Rencontrez  :' +
        ' Formations Professionnelles dans le Monde',
    ka: 'GLI International - იმოგზაურეთ, ისწავლეთ, გამოაკელით: პროფესიული ტრენინგი მსოფლიოში',
  };

  const descriptions = {
    en: 'GLI International organizes exceptional seminars worldwide for health professionals. Transform your travels into enriching professional training opportunities.',
    fr: 'GLI International organise des séminaires exceptionnels dans le monde entier pour les professionnels de santé. Transformez vos voyages en opportunités de formation professionnelle enrichissantes.',
    ka: 'GLI International აწყობს განსაკუთრებულ სემინარებს მთელ მსოფლიოში ჯანდაცვის პროფესიონალებისთვის, იურისტებისთვის და მეწარმეებისთვის.',
  };

  const title = titles[locale as keyof typeof titles] || titles.en;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en;

  return {
    title: {
      default: title,
      template: '%s | GLI International',
    },
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      languages: {
        en: '/en',
        fr: '/fr',
        ka: '/ka',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : locale === 'ka' ? 'ka_GE' : 'en_US',
      url: `${baseUrl}/${locale}`,
      title,
      description,
      siteName: 'GLI International',
      images: [
        {
          url: `${baseUrl}/logo-gli-without-text.png`,
          width: 1200,
          height: 630,
          alt: 'GLI International Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/logo-gli-without-text.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Add your verification codes here when you have them
      // google: 'your-google-site-verification',
      // yandex: 'your-yandex-verification',
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} scroll-smooth`}>
      <head>
        <OrganizationSchema locale={locale} />
        <WebSiteSchema locale={locale} />
      </head>
      <body>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}