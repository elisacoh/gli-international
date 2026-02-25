import { generatePageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return generatePageMetadata({
    locale,
    title: {
      en: 'Contact Us - GLI International',
      fr: 'Contactez-nous - GLI International',
      ka: 'დაგვიკავშირდით - GLI International',
    },
    description: {
      en: 'Get in touch with GLI International. Have questions about our training seminars? We\'re here to help.',
      fr: 'Contactez GLI International. Des questions sur nos séminaires de formation ? Nous sommes là pour vous aider.',
      ka: 'დაუკავშირდით GLI International-ს. გაქვთ შეკითხვები ჩვენი ტრენინგის სემინარების შესახებ?',
    },
    path: '/contact',
    image: 'https://www.gli-international.com/contact.webp',
  });
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
