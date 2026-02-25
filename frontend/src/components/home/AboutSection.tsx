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
    <section className="h-screen flex items-center py-12" style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
      <div className="w-full px-6 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-center max-h-[85vh]">

          {/* Text Content */}
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 leading-tight tracking-wide">
              {t('title')}
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-light">
              {t.rich('description', {
                strong: (chunks) => <strong className="font-semibold">{chunks}</strong>
              })}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-light">
              {t.rich('description2', {
                strong: (chunks) => <strong className="font-semibold">{chunks}</strong>
              })}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-light">
              {t.rich('description3', {
                strong: (chunks) => <strong className="font-semibold">{chunks}</strong>
              })}
            </p>

            <div className="pt-2">
              <Link
                href={`/${locale}/about`}
                className="inline-block border-2 border-black text-black px-6 sm:px-8 md:px-10 py-3 md:py-4 text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
              >
                {t('cta').toUpperCase()}
              </Link>
            </div>
          </div>

          {/* Image */}
          <div ref={ref} className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] order-first lg:order-last">
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

