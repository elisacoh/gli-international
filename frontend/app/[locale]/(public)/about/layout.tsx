import { generatePageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return generatePageMetadata({
    locale,
    title: {
      en: 'About Us - GLI International',
      fr: 'À Propos - GLI International',
      ka: 'ჩვენს შესახებ - GLI International',
    },
    description: {
      en: 'Learn about GLI International, our mission to provide exceptional professional training seminars worldwide, and how we transform your travels into enriching educational opportunities.',
      fr: 'Découvrez GLI International, notre mission de fournir des séminaires de formation professionnelle exceptionnels dans le monde entier, et comment nous transformons vos voyages en opportunités éducatives enrichissantes.',
      ka: 'გაიგეთ GLI International-ის შესახებ, ჩვენი მისია უზრუნველვყოთ განსაკუთრებული პროფესიული ტრენინგის სემინარები მსოფლიოში.',
    },
    path: '/about',
    image: 'https://www.gli-international.com/about.webp',
  });
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
