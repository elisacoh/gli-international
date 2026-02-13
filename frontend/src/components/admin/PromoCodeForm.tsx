'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PromoCode } from '@/../app/[locale]/admin/(protected)/promo-codes/page';

interface PromoCodeFormProps {
  promoCode?: PromoCode | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PromoCodeForm({ promoCode, onSuccess, onCancel }: PromoCodeFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const [formData, setFormData] = useState({
    code: '',
    description_fr: '',
    description_en: '',
    description_ka: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    valid_from: '',
    valid_until: '',
    max_uses: '',
    max_uses_per_user: '1',
    min_purchase_amount: '',
    owner: '',
    is_active: true,
  });

  useEffect(() => {
    if (promoCode) {
      setFormData({
        code: promoCode.code,
        description_fr: promoCode.description?.fr || '',
        description_en: promoCode.description?.en || '',
        description_ka: promoCode.description?.ka || '',
        discount_type: promoCode.discount_type,
        discount_value: promoCode.discount_value.toString(),
        valid_from: promoCode.valid_from.split('T')[0],
        valid_until: promoCode.valid_until?.split('T')[0] || '',
        max_uses: promoCode.max_uses?.toString() || '',
        max_uses_per_user: promoCode.max_uses_per_user.toString(),
        min_purchase_amount: promoCode.min_purchase_amount?.toString() || '',
        owner: promoCode.owner || '',
        is_active: promoCode.is_active,
      });
    }
  }, [promoCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data: any = {
        code: formData.code.toUpperCase(),
        description: {
          fr: formData.description_fr || null,
          en: formData.description_en || null,
          ka: formData.description_ka || null,
        },
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        max_uses_per_user: parseInt(formData.max_uses_per_user),
        min_purchase_amount: formData.min_purchase_amount ? parseFloat(formData.min_purchase_amount) : null,
        owner: formData.owner || null,
        is_active: formData.is_active,
      };

      if (promoCode) {
        // Update existing
        const { error } = await supabase
          .from('promo_codes')
          .update(data)
          .eq('id', promoCode.id);

        if (error) throw error;
      } else {
        // Create new
        const { data: userData } = await supabase.auth.getUser();
        data.created_by = userData.user?.id;

        const { error } = await supabase
          .from('promo_codes')
          .insert(data);

        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
      console.error('Error saving promo code:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 transition-all duration-300">
      <h2 className="text-2xl font-light text-gray-900 tracking-wide mb-8">
        {promoCode ? 'Modifier le code promo' : 'Nouveau code promo'}
      </h2>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-300 text-red-700 px-4 py-3 font-light tracking-wide">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="code"
              required
              className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide uppercase transition-all duration-300"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              disabled={loading}
            />
          </div>

          {/* Discount Type */}
          <div>
            <label htmlFor="discount_type" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
              Type de réduction <span className="text-red-500">*</span>
            </label>
            <select
              id="discount_type"
              required
              className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
              value={formData.discount_type}
              onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
              disabled={loading}
            >
              <option value="percentage">Pourcentage (%)</option>
              <option value="fixed">Montant fixe (EUR)</option>
            </select>
          </div>

          {/* Discount Value */}
          <div>
            <label htmlFor="discount_value" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
              Valeur de la réduction <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="discount_value"
              required
              min="0"
              step="0.01"
              className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
              value={formData.discount_value}
              onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
              disabled={loading}
            />
            <p className="mt-2 text-xs font-light text-gray-600">
              {formData.discount_type === 'percentage' ? 'Pourcentage (ex: 10 pour 10%)' : 'Montant en EUR'}
            </p>
          </div>

          {/* Valid From */}
          <div>
            <label htmlFor="valid_from" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
              Valide à partir du <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="valid_from"
              required
              className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
              value={formData.valid_from}
              onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Valid Until */}
          <div>
            <label htmlFor="valid_until" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
              Valide jusqu'au
            </label>
            <input
              type="date"
              id="valid_until"
              className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
              value={formData.valid_until}
              onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Max Uses */}
          <div>
            <label htmlFor="max_uses" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
              Utilisations maximales
            </label>
            <input
              type="number"
              id="max_uses"
              min="1"
              className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
              value={formData.max_uses}
              onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
              disabled={loading}
              placeholder="Illimité"
            />
          </div>

          {/* Max Uses Per User */}
          <div>
            <label htmlFor="max_uses_per_user" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
              Utilisations max par utilisateur <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="max_uses_per_user"
              required
              min="1"
              className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
              value={formData.max_uses_per_user}
              onChange={(e) => setFormData({ ...formData, max_uses_per_user: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Min Purchase Amount */}
          <div>
            <label htmlFor="min_purchase_amount" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
              Montant minimum d'achat (EUR)
            </label>
            <input
              type="number"
              id="min_purchase_amount"
              min="0"
              step="0.01"
              className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
              value={formData.min_purchase_amount}
              onChange={(e) => setFormData({ ...formData, min_purchase_amount: e.target.value })}
              disabled={loading}
              placeholder="Aucun minimum"
            />
          </div>

          {/* Owner */}
          <div>
            <label htmlFor="owner" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
              Propriétaire / Donneur du code
            </label>
            <input
              type="text"
              id="owner"
              maxLength={200}
              className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              disabled={loading}
              placeholder="Ex: Client ABC, Partenaire XYZ..."
            />
            <p className="mt-2 text-xs font-light text-gray-600">
              Nom du client, partenaire ou personne qui a fourni ce code promo
            </p>
          </div>
        </div>

        {/* Descriptions */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-light text-gray-900 tracking-wide mb-6">Descriptions</h3>

          <div className="space-y-6">
            <div>
              <label htmlFor="description_fr" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
                Description (Français)
              </label>
              <textarea
                id="description_fr"
                rows={2}
                className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
                value={formData.description_fr}
                onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="description_en" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
                Description (English)
              </label>
              <textarea
                id="description_en"
                rows={2}
                className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="description_ka" className="block text-sm font-light text-gray-700 tracking-wide mb-2">
                Description (ქართული)
              </label>
              <textarea
                id="description_ka"
                rows={2}
                className="block w-full border border-gray-300 py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm font-light tracking-wide transition-all duration-300"
                value={formData.description_ka}
                onChange={(e) => setFormData({ ...formData, description_ka: e.target.value })}
                disabled={loading}
              />
            </div>
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
            Code actif
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
            {loading ? 'Sauvegarde...' : promoCode ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}
