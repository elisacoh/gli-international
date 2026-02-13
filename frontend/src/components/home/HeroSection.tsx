'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('home.hero');
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section className="h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
      <div className="w-full h-full flex items-center justify-center px-6 md:px-8 lg:px-16">
        {/* Centered Image Container */}
        <div ref={ref} className="relative w-full max-w-5xl h-[70vh]">
          {/* Image with Overlay */}
            <div
              ref={ref}
              className="relative w-full h-full overflow-hidden"
              style={{ backgroundColor: 'rgb(231, 227, 216)' }}
            >

            <motion.div
              className="absolute inset-0"
              initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
              animate={isVisible ? {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
              } : {}}
              transition={{
                duration: 1.4,
                ease: [0.43, 0.13, 0.23, 0.96],
                delay: 0.1
              }}
            >
              <img
                src="/singapore.jpg"
                alt="Singapore"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </motion.div>

            {/* Content on Image - Centered */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 sm:px-8 md:px-12"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-6 md:mb-8 leading-relaxed tracking-wide max-w-3xl">
                {t('title')}<br className="hidden sm:block" />
                <span className="sm:inline"> </span>{t('subtitle')}
              </h1>
              <Link
                href={`/${locale}/formations`}
                className="inline-block border-2 border-white text-white px-6 sm:px-8 md:px-10 py-3 md:py-4 text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                {t('cta').toUpperCase()}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
