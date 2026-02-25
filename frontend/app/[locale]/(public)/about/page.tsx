'use client';

import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
      {/* Header Section - Full Width */}
      <div className="w-full px-4 md:px-8 lg:px-16 pt-8 mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-wide">
          {t('title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 font-light">
          {t('subtitle')}
        </p>
      </div>

      {/* Main Content - Text Left */}
      <div className="w-full px-4 md:px-8 lg:px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-16">
            {/* Left Column - Text */}
            <div className="space-y-8 md:space-y-10 lg:space-y-12" id="text-content">
              {/* Mission */}
              <div>
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6 tracking-wide">
                  {t('mission.title')}
                </h2>
                <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed">
                  {t('mission.description')}
                </p>
              </div>

              {/* Vision */}
              <div>
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6 tracking-wide">
                  {t('vision.title')}
                </h2>
                <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed">
                  {t('vision.description')}
                </p>
              </div>

              {/*/!* Values *!/*/}
              {/*<div>*/}
              {/*  <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6 tracking-wide">*/}
              {/*    {t('values.title')}*/}
              {/*  </h2>*/}
              {/*  <div className="space-y-6">*/}
              {/*    <div>*/}
              {/*      <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide">*/}
              {/*        {t('values.excellence.title')}*/}
              {/*      </h3>*/}
              {/*      <p className="text-base text-gray-600 font-light leading-relaxed">*/}
              {/*        {t('values.excellence.description')}*/}
              {/*      </p>*/}
              {/*    </div>*/}
              {/*    <div>*/}
              {/*      <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide">*/}
              {/*        {t('values.innovation.title')}*/}
              {/*      </h3>*/}
              {/*      <p className="text-base text-gray-600 font-light leading-relaxed">*/}
              {/*        {t('values.innovation.description')}*/}
              {/*      </p>*/}
              {/*    </div>*/}
              {/*    <div>*/}
              {/*      <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide">*/}
              {/*        {t('values.experience.title')}*/}
              {/*      </h3>*/}
              {/*      <p className="text-base text-gray-600 font-light leading-relaxed">*/}
              {/*        {t('values.experience.description')}*/}
              {/*      </p>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/* Approach */}
              <div>
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6 tracking-wide">
                  {t('approach.title')}
                </h2>
                <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed">
                  {t('approach.description')}
                </p>
              </div>
            </div>

            {/* Right Column - Empty */}
            <div></div>
          </div>
      </div>
    </div>
  );
}
