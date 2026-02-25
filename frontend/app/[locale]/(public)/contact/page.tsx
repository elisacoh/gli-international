'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('home.contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      // Using FormSubmit - a free form submission service
      const response = await fetch('https://formsubmit.co/contact@gli-international.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `Nouveau message de ${formData.name} - Contact GLI International`,
          _template: 'table',
          _captcha: 'false',
        })
      });

      if (response.ok) {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', message: '' });

        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      setSubmitError(true);
      setTimeout(() => setSubmitError(false), 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(231, 227, 216)' }}>
      {/* Header Section - Full Width */}
      <div className="w-full px-4 md:px-8 lg:px-16 mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-wide">
          {t('title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 font-light">
          {t('subtitle')}
        </p>
      </div>

      {/* Main Content - Form */}
      <div className="w-full px-4 md:px-8 lg:px-16 pb-16">
        <div className="max-w-2xl">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-7">
            <div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-0 py-4 md:py-5 border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:ring-0 transition-colors bg-transparent text-gray-900 placeholder-gray-400 font-light text-base md:text-lg"
                placeholder={t('name')}
              />
            </div>

            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-0 py-4 md:py-5 border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:ring-0 transition-colors bg-transparent text-gray-900 placeholder-gray-400 font-light text-base md:text-lg"
                placeholder={t('email')}
              />
            </div>

            <div>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-0 py-4 md:py-5 border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:ring-0 transition-colors bg-transparent text-gray-900 placeholder-gray-400 font-light resize-none text-base md:text-lg"
                placeholder={t('message')}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="border-2 border-gray-900 text-gray-900 px-8 sm:px-10 md:px-12 py-4 md:py-5 text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Envoi...' : t('send')}
              </button>
            </div>

            {submitSuccess && (
              <div className="text-green-700 font-light text-base md:text-lg">
                {t('success')}
              </div>
            )}

            {submitError && (
              <div className="text-red-700 font-light text-base md:text-lg">
                Une erreur est survenue. Veuillez réessayer ou nous contacter directement à contact@gli-international.com
              </div>
            )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
