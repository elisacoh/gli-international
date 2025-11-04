'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactSection() {
  const t = useTranslations('home.contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement actual form submission to backend
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({ name: '', email: '', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000);
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
    <section className="min-h-screen snap-start flex items-center py-20 md:py-24" style={{backgroundColor: 'rgb(231, 227, 216)'}}>
      <div className="w-full px-6 md:px-8 lg:px-16">
        {/* Section Header */}
        <div className="mb-14 md:mb-16 lg:mb-20 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight tracking-wide mb-5 md:mb-6">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-light">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-3xl">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-7 md:space-y-8">
            <div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-0 py-4 md:py-5 border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:ring-0 transition-colors bg-transparent text-gray-900 placeholder-gray-400 font-light text-base md:text-lg"
                placeholder="Nom complet"
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
                placeholder="Email"
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
                placeholder="Message"
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
          </form>
        </div>
      </div>
    </section>
  );
}
