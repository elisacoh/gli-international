'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import LanguageSelector, { AVAILABLE_LANGUAGES } from './LanguageSelector';

interface Destination {
  id: string;
  seminar_id: string;
  image_url: string;
  country: Record<string, string>;
  city: Record<string, string>;
  price: number;
  currency: string;
  start_date?: string;
  end_date?: string;
  available_spots?: number;
  is_active: boolean;
  is_coup_de_coeur?: boolean;
}

interface DestinationFormProps {
  destination?: Destination | null;
  seminars: { id: string; title: Record<string, string> }[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DestinationForm({ destination, seminars, onSuccess, onCancel }: DestinationFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['fr']);
  const [formData, setFormData] = useState<{
    seminar_id: string;
    image_url: string;
    imageFile: File | null;
    country: Record<string, string>;
    city: Record<string, string>;
    price: string;
    currency: string;
    start_date: string;
    end_date: string;
    available_spots: string;
    is_active: boolean;
    is_coup_de_coeur: boolean;
  }>({
    seminar_id: '',
    image_url: '',
    imageFile: null,
    country: { fr: '' },
    city: { fr: '' },
    price: '',
    currency: 'EUR',
    start_date: '',
    end_date: '',
    available_spots: '',
    is_active: true,
    is_coup_de_coeur: false,
  });

  useEffect(() => {
    if (destination) {
      const langs = Object.keys(destination.country || {}).filter(key => destination.country[key]);
      setSelectedLanguages(langs.length > 0 ? langs : ['fr']);

      setFormData({
        seminar_id: destination.seminar_id,
        image_url: destination.image_url,
        imageFile: null,
        country: destination.country || { fr: '' },
        city: destination.city || { fr: '' },
        price: destination.price.toString(),
        currency: destination.currency,
        start_date: destination.start_date?.split('T')[0] || '',
        end_date: destination.end_date?.split('T')[0] || '',
        available_spots: destination.available_spots?.toString() || '',
        is_active: destination.is_active,
        is_coup_de_coeur: destination.is_coup_de_coeur || false,
      });
    }
  }, [destination]);

  const handleLanguagesChange = (languages: string[]) => {
    setSelectedLanguages(languages);

    const newCountry = { ...formData.country };
    const newCity = { ...formData.city };

    languages.forEach(lang => {
      if (!newCountry[lang]) newCountry[lang] = '';
      if (!newCity[lang]) newCity[lang] = '';
    });

    setFormData({
      ...formData,
      country: newCountry,
      city: newCity,
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }

      setFormData({ ...formData, imageFile: file, image_url: URL.createObjectURL(file) });
      setError('');
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `destinations/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('destination-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('destination-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload new image if selected
      if (formData.imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(formData.imageFile);
        setUploading(false);
      }

      if (!imageUrl) {
        throw new Error('Une image est requise');
      }

      // Clean up empty language entries
      const cleanCountry: Record<string, string> = {};
      const cleanCity: Record<string, string> = {};

      selectedLanguages.forEach(lang => {
        if (formData.country[lang]?.trim()) {
          cleanCountry[lang] = formData.country[lang].trim();
        }
        if (formData.city[lang]?.trim()) {
          cleanCity[lang] = formData.city[lang].trim();
        }
      });

      const data: any = {
        seminar_id: formData.seminar_id,
        image_url: imageUrl,
        country: cleanCountry,
        city: cleanCity,
        price: parseFloat(formData.price),
        currency: formData.currency,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        available_spots: formData.available_spots ? parseInt(formData.available_spots) : null,
        is_active: formData.is_active,
        is_coup_de_coeur: formData.is_coup_de_coeur,
      };

      if (destination) {
        // Update existing
        const { error } = await supabase
          .from('destinations')
          .update(data)
          .eq('id', destination.id);

        if (error) throw error;
      } else {
        // Create new
        const { data: userData } = await supabase.auth.getUser();
        data.created_by = userData.user?.id;

        const { error } = await supabase
          .from('destinations')
          .insert(data);

        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
      console.error('Error saving destination:', err);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const getLanguageName = (code: string) => {
    return AVAILABLE_LANGUAGES.find(l => l.code === code)?.name || code;
  };

  return (
    <div className="bg-white p-8 transition-all duration-300 max-h-[calc(100vh-200px)] overflow-y-auto">
      <h2 className="text-2xl font-light text-gray-900 tracking-wide mb-8">
        {destination ? 'Modifier la destination' : 'Nouvelle destination'}
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

        {/* Seminar Selection */}
        <div>
          <label htmlFor="seminar_id" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
            Séminaire <span className="text-red-500">*</span>
          </label>
          <select
            id="seminar_id"
            required
            className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
            value={formData.seminar_id}
            onChange={(e) => setFormData({ ...formData, seminar_id: e.target.value })}
            disabled={loading}
          >
            <option value="">Sélectionner un séminaire</option>
            {seminars.map((seminar) => (
              <option key={seminar.id} value={seminar.id}>
                {seminar.title.fr || seminar.title.en || Object.values(seminar.title)[0]}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="border-b border-gray-200 pb-8">
          <label className="block text-sm font-light text-gray-700 tracking-wide mb-2">
            Image de la destination <span className="text-red-500">*</span>
          </label>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || uploading}
                className="inline-flex items-center px-6 py-2.5 border border-gray-900 text-sm font-light tracking-wide text-gray-900 hover:bg-gray-50 focus:outline-none transition-all duration-300 disabled:opacity-50"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {uploading ? 'Upload en cours...' : 'Choisir une image'}
              </button>
              <span className="text-sm font-light text-gray-600 tracking-wide">
                {formData.imageFile ? formData.imageFile.name : 'Max 5MB - JPG, PNG, WebP'}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={loading || uploading}
            />
            {formData.image_url && (
              <div className="mt-4">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full max-w-md h-64 object-cover border border-gray-300"
                />
              </div>
            )}
          </div>
        </div>

        {/* Country */}
        <div className="border-b border-gray-200 pb-8">
          <h3 className="text-lg font-light text-gray-900 tracking-wide mb-6">Pays</h3>
          <div className="space-y-6">
            {selectedLanguages.map((lang) => (
              <div key={lang}>
                <label className="block text-sm font-light text-gray-700 tracking-wide mb-2">
                  Pays ({getLanguageName(lang)}) {lang === 'fr' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  required={lang === 'fr'}
                  className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
                  value={formData.country[lang] || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    country: { ...formData.country, [lang]: e.target.value }
                  })}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </div>

        {/* City */}
        <div className="border-b border-gray-200 pb-8">
          <h3 className="text-lg font-light text-gray-900 tracking-wide mb-6">Ville</h3>
          <div className="space-y-6">
            {selectedLanguages.map((lang) => (
              <div key={lang}>
                <label className="block text-sm font-light text-gray-700 tracking-wide mb-2">
                  Ville ({getLanguageName(lang)}) {lang === 'fr' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  required={lang === 'fr'}
                  className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
                  value={formData.city[lang] || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    city: { ...formData.city, [lang]: e.target.value }
                  })}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Price & Currency */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label htmlFor="price" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
              Prix <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              required
              min="0"
              step="0.01"
              className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
              Devise
            </label>
            <select
              id="currency"
              className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              disabled={loading}
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="GEL">GEL (₾)</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="start_date" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
              Date de début
            </label>
            <input
              type="date"
              id="start_date"
              className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
              Date de fin
            </label>
            <input
              type="date"
              id="end_date"
              className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              disabled={loading}
            />
          </div>
        </div>

        {/* Available Spots */}
        <div>
          <label htmlFor="available_spots" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
            Places disponibles
          </label>
          <input
            type="number"
            id="available_spots"
            min="0"
            className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
            value={formData.available_spots}
            onChange={(e) => setFormData({ ...formData, available_spots: e.target.value })}
            disabled={loading}
            placeholder="Illimité"
          />
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
            Destination active
          </label>
        </div>

        {/* Coup de coeur */}
        <div className="flex items-center">
          <input
            id="is_coup_de_coeur"
            type="checkbox"
            className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
            checked={formData.is_coup_de_coeur}
            onChange={(e) => setFormData({ ...formData, is_coup_de_coeur: e.target.checked })}
            disabled={loading}
          />
          <label htmlFor="is_coup_de_coeur" className="ml-3 block text-sm font-light text-gray-900 tracking-wide">
            Coup de coeur (affiché sur la page d&apos;accueil)
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading || uploading}
            className="px-8 py-2.5 border border-gray-900 text-sm font-light tracking-wide text-gray-900 hover:bg-gray-50 focus:outline-none transition-all duration-300 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-8 py-2.5 border border-gray-900 text-sm font-light tracking-wide text-white bg-gray-900 hover:bg-gray-800 focus:outline-none transition-all duration-300 disabled:opacity-50"
          >
            {uploading ? 'Upload...' : loading ? 'Sauvegarde...' : destination ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}
