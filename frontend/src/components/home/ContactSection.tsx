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
    <section className="min-h-screen snap-start flex items-center py-16 md:py-24" style={{backgroundColor: 'rgb(231, 227, 216)'}}>
      <div className="w-full px-4 md:px-8 lg:px-16">
        {/* Section Header */}
        <div className="mb-12 md:mb-16 lg:mb-20 max-w-3xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-tight tracking-wide mb-4 md:mb-6">
            {t('title')}
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 font-light">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-2xl">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-0 py-3 md:py-4 border-0 border-b border-gray-300 focus:border-gray-900 focus:ring-0 transition-colors bg-transparent text-gray-900 placeholder-gray-400 font-light text-sm md:text-base"
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
                className="w-full px-0 py-3 md:py-4 border-0 border-b border-gray-300 focus:border-gray-900 focus:ring-0 transition-colors bg-transparent text-gray-900 placeholder-gray-400 font-light text-sm md:text-base"
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
                className="w-full px-0 py-3 md:py-4 border-0 border-b border-gray-300 focus:border-gray-900 focus:ring-0 transition-colors bg-transparent text-gray-900 placeholder-gray-400 font-light resize-none text-sm md:text-base"
                placeholder="Message"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="border border-gray-900 text-gray-900 px-8 md:px-10 py-3 md:py-4 text-xs md:text-sm font-light tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Envoi...' : t('send')}
            </button>

            {submitSuccess && (
              <div className="text-green-700 font-light text-sm md:text-base">
                {t('success')}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
