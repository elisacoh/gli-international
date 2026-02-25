'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import LanguageSelector, { AVAILABLE_LANGUAGES } from './LanguageSelector';

interface Seminar {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  short_description?: Record<string, string> | null;
  included: string[];
  is_active: boolean;
}

interface SeminarFormProps {
  seminar?: Seminar | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SeminarForm({ seminar, onSuccess, onCancel }: SeminarFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['fr']);
  const [formData, setFormData] = useState<{
    title: Record<string, string>;
    description: Record<string, string>;
    short_description: Record<string, string>;
    included: string[];
    includedInput: string;
    is_active: boolean;
  }>({
    title: { fr: '' },
    description: { fr: '' },
    short_description: {},
    included: [],
    includedInput: '',
    is_active: true,
  });

  useEffect(() => {
    if (seminar) {
      const langs = Object.keys(seminar.title || {}).filter(key => seminar.title[key]);
      setSelectedLanguages(langs.length > 0 ? langs : ['fr']);

      setFormData({
        title: seminar.title || { fr: '' },
        description: seminar.description || { fr: '' },
        short_description: seminar.short_description || {},
        included: seminar.included || [],
        includedInput: '',
        is_active: seminar.is_active,
      });
    }
  }, [seminar]);

  const handleLanguagesChange = (languages: string[]) => {
    setSelectedLanguages(languages);

    // Add empty strings for new languages
    const newTitle = { ...formData.title };
    const newDescription = { ...formData.description };
    const newShortDescription = { ...formData.short_description };

    languages.forEach(lang => {
      if (!newTitle[lang]) newTitle[lang] = '';
      if (!newDescription[lang]) newDescription[lang] = '';
    });

    setFormData({
      ...formData,
      title: newTitle,
      description: newDescription,
      short_description: newShortDescription,
    });
  };

  const handleAddIncluded = () => {
    if (formData.includedInput.trim()) {
      setFormData({
        ...formData,
        included: [...formData.included, formData.includedInput.trim()],
        includedInput: '',
      });
    }
  };

  const handleRemoveIncluded = (index: number) => {
    setFormData({
      ...formData,
      included: formData.included.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Clean up empty language entries
      const cleanTitle: Record<string, string> = {};
      const cleanDescription: Record<string, string> = {};
      const cleanShortDescription: Record<string, string> = {};

      selectedLanguages.forEach(lang => {
        if (formData.title[lang]?.trim()) {
          cleanTitle[lang] = formData.title[lang].trim();
        }
        if (formData.description[lang]?.trim()) {
          cleanDescription[lang] = formData.description[lang].trim();
        }
        if (formData.short_description[lang]?.trim()) {
          cleanShortDescription[lang] = formData.short_description[lang].trim();
        }
      });

      const data: any = {
        title: cleanTitle,
        description: cleanDescription,
        short_description: Object.keys(cleanShortDescription).length > 0 ? cleanShortDescription : null,
        included: formData.included,
        is_active: formData.is_active,
      };

      if (seminar) {
        // Update existing
        const { error } = await supabase
          .from('seminars')
          .update(data)
          .eq('id', seminar.id);

        if (error) throw error;
      } else {
        // Create new
        const { data: userData } = await supabase.auth.getUser();
        data.created_by = userData.user?.id;

        const { error } = await supabase
          .from('seminars')
          .insert(data);

        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
      console.error('Error saving seminar:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageName = (code: string) => {
    return AVAILABLE_LANGUAGES.find(l => l.code === code)?.name || code;
  };

  return (
    <div className="bg-white p-8 transition-all duration-300 max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-light text-gray-900 tracking-wide mb-8">
        {seminar ? 'Modifier le séminaire' : 'Nouveau séminaire'}
      </h2>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-300 text-red-700 px-4 py-3 font-light tracking-wide">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Language Selector */}
        <LanguageSelector
          selectedLanguages={selectedLanguages}
          onLanguagesChange={handleLanguagesChange}
          disabled={loading}
        />

        {/* Title */}
        <div className="border-b border-gray-200 pb-8">
          <h3 className="text-lg font-light text-gray-900 tracking-wide mb-6">Titre</h3>
          <div className="space-y-6">
            {selectedLanguages.map((lang) => (
              <div key={lang}>
                <label className="block text-sm font-light text-gray-700 tracking-wide mb-2">
                  Titre ({getLanguageName(lang)}) {lang === 'fr' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  required={lang === 'fr'}
                  className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
                  value={formData.title[lang] || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: { ...formData.title, [lang]: e.target.value }
                  })}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Short Description */}
        <div className="border-b border-gray-200 pb-8">
          <h3 className="text-lg font-light text-gray-900 tracking-wide mb-6">Description courte</h3>
          <div className="space-y-6">
            {selectedLanguages.map((lang) => (
              <div key={lang}>
                <label className="block text-sm font-light text-gray-700 tracking-wide mb-2">
                  Description courte ({getLanguageName(lang)})
                </label>
                <textarea
                  rows={2}
                  className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
                  value={formData.short_description[lang] || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    short_description: { ...formData.short_description, [lang]: e.target.value }
                  })}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="border-b border-gray-200 pb-8">
          <h3 className="text-lg font-light text-gray-900 tracking-wide mb-6">Description complète</h3>
          <div className="space-y-6">
            {selectedLanguages.map((lang) => (
              <div key={lang}>
                <label className="block text-sm font-light text-gray-700 tracking-wide mb-2">
                  Description ({getLanguageName(lang)}) {lang === 'fr' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  rows={6}
                  required={lang === 'fr'}
                  className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
                  value={formData.description[lang] || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    description: { ...formData.description, [lang]: e.target.value }
                  })}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Included */}
        <div className="border-b border-gray-200 pb-8">
          <h3 className="text-lg font-light text-gray-900 tracking-wide mb-6">Inclus dans le séminaire</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ajouter un élément..."
                className="flex-1 block border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
                value={formData.includedInput}
                onChange={(e) => setFormData({ ...formData, includedInput: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIncluded())}
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleAddIncluded}
                className="px-6 py-2.5 border border-gray-900 text-sm font-light tracking-wide text-white bg-gray-900 hover:bg-gray-800 focus:outline-none transition-all duration-300"
                disabled={loading}
              >
                Ajouter
              </button>
            </div>
            {formData.included.length > 0 && (
              <ul className="space-y-2">
                {formData.included.map((item, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2">
                    <span className="text-sm font-light text-gray-900 tracking-wide">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIncluded(index)}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                      disabled={loading}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Is Active */}
        <div className="flex items-center">
          <input
            id="is_active"
            type="checkbox"
            className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            disabled={loading}
          />
          <label htmlFor="is_active" className="ml-3 block text-sm font-light text-gray-900 tracking-wide">
            Séminaire actif
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-8 py-2.5 border border-gray-900 text-sm font-light tracking-wide text-gray-900 hover:bg-gray-50 focus:outline-none transition-all duration-300 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 border border-gray-900 text-sm font-light tracking-wide text-white bg-gray-900 hover:bg-gray-800 focus:outline-none transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Sauvegarde...' : seminar ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}
