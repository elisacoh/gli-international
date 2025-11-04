'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from "next/link";
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function AboutSection() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('home.about');
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section className="min-h-screen snap-start flex items-center py-20 md:py-24" style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
      <div className="w-full px-6 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">

          {/* Text Content */}
          <div className="space-y-5 md:space-y-6 lg:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight tracking-wide">
              {t('title')}
            </h2>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed font-light">
              {t.rich('description', {
                strong: (chunks) => <strong className="font-semibold">{chunks}</strong>
              })}
            </p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed font-light">
              {t.rich('description2', {
                strong: (chunks) => <strong className="font-semibold">{chunks}</strong>
              })}
            </p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed font-light">
              {t.rich('description3', {
                strong: (chunks) => <strong className="font-semibold">{chunks}</strong>
              })}
            </p>

            <div className="pt-2">
              <Link
                href={`/${locale}/about`}
                className="inline-block border-2 border-black text-black px-8 sm:px-10 md:px-12 lg:px-14 py-4 md:py-5 text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300"
              >
                EN SAVOIR PLUS
              </Link>
            </div>
          </div>

          {/* Image */}
          <div ref={ref} className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] order-first lg:order-last">
            <img
              src="/seminar.webp"
              alt="Medical seminar"
              className={`w-full h-full object-cover transition-all duration-1000 ease-out ${
                isVisible
                  ? 'opacity-100 scale-100 translate-x-0'
                  : 'opacity-0 scale-95 translate-x-10'
              }`}
            />
          </div>

        </div>
      </div>
    </section>
  );
}

