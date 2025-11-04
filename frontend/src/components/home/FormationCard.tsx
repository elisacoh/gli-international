'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface FormationCardProps {
  formation: {
    id: number;
    title: string;
    location: string;
    image: string;
    date: string;
  };
  delay?: number;
}

export default function FormationCard({ formation, delay = 0 }: FormationCardProps) {
  const params = useParams();
  const locale = params.locale as string;
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <Link
      key={formation.id}
      href={`/${locale}/formations/${formation.id}`}
      className="group"
      ref={ref}
    >
      {/* Image */}
      <div className="relative h-64 md:h-72 lg:h-80 overflow-hidden mb-4 md:mb-6">
        <img
          src={formation.image}
          alt={formation.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all ease-out ${
            isVisible
              ? 'opacity-100 scale-100 translate-y-0 duration-700'
              : 'opacity-0 scale-95 translate-y-10 duration-1000'
          }`}
          style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
        />
      </div>

      {/* Content */}
      <div className="space-y-1 md:space-y-2">
        <h3 className="text-lg md:text-xl font-light text-gray-900 tracking-wide group-hover:text-gray-600 transition-colors">
          {formation.title}
        </h3>
        <p className="text-xs md:text-sm text-gray-500 font-light tracking-wide">
          {formation.location}
        </p>
        <p className="text-xs md:text-sm text-gray-400 font-light">
          {formation.date}
        </p>
      </div>
    </Link>
  );
}
