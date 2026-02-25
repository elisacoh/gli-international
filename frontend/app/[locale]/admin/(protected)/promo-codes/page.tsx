'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import PromoCodeForm from '@/components/admin/PromoCodeForm';
import PromoCodeList from '@/components/admin/PromoCodeList';
import PromoCodeStats from '@/components/admin/PromoCodeStats';

export interface PromoCode {
  id: string;
  code: string;
  description?: {
    fr?: string;
    en?: string;
    ka?: string;
  };
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  valid_from: string;
  valid_until?: string;
  max_uses?: number;
  max_uses_per_user: number;
  min_purchase_amount?: number;
  applicable_formations?: string[];
  is_active: boolean;
  current_uses: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  owner?: string;
}

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [error, setError] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des codes promo');
      console.error('Error loading promo codes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCode(null);
    setShowForm(true);
  };

  const handleEdit = (code: PromoCode) => {
    setEditingCode(code);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce code promo ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadPromoCodes();
    } catch (err: any) {
      alert('Erreur lors de la suppression: ' + err.message);
      console.error('Error deleting promo code:', err);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      await loadPromoCodes();
    } catch (err: any) {
      alert('Erreur lors de la mise à jour: ' + err.message);
      console.error('Error toggling promo code:', err);
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingCode(null);
    await loadPromoCodes();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCode(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: 'rgb(231, 227, 216)'}}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: 'rgb(231, 227, 216)'}}>
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-light text-gray-900 tracking-wide">Codes Promo</h1>
            <p className="mt-3 text-sm font-light text-gray-600 tracking-wide">
              Gérez tous les codes promotionnels
            </p>
          </div>
          {!showForm && (
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-8 py-3 border border-gray-900 text-sm font-light tracking-wide text-white bg-gray-900 hover:bg-gray-800 focus:outline-none transition-all duration-300"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Nouveau code promo
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 text-red-700 px-6 py-4 font-light tracking-wide">
            {error}
          </div>
        )}

        {/* Statistics */}
        <PromoCodeStats promoCodes={promoCodes} />

        {/* Form */}
        {showForm && (
          <div className="mb-10">
            <PromoCodeForm
              promoCode={editingCode}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {/* List */}
        {!showForm && (
          <PromoCodeList
            promoCodes={promoCodes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        )}
      </div>
    </div>
  );
}
