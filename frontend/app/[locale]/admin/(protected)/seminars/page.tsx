'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import SeminarForm from '@/components/admin/SeminarForm';
import SeminarList from '@/components/admin/SeminarList';

interface Seminar {
  id: string;
  title: {
    fr?: string;
    en?: string;
  };
  description: {
    fr?: string;
    en?: string;
  };
  short_description?: {
    fr?: string;
    en?: string;
  } | null;
  included: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function SeminarsPage() {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSeminar, setEditingSeminar] = useState<Seminar | null>(null);
  const [error, setError] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadSeminars();
  }, []);

  const loadSeminars = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('seminars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSeminars(data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des séminaires');
      console.error('Error loading seminars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSeminar(null);
    setShowForm(true);
  };

  const handleEdit = (seminar: Seminar) => {
    setEditingSeminar(seminar);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce séminaire ? Toutes les destinations associées seront également supprimées.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('seminars')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadSeminars();
    } catch (err: any) {
      alert('Erreur lors de la suppression: ' + err.message);
      console.error('Error deleting seminar:', err);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('seminars')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      await loadSeminars();
    } catch (err: any) {
      alert('Erreur lors de la mise à jour: ' + err.message);
      console.error('Error toggling seminar:', err);
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingSeminar(null);
    await loadSeminars();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSeminar(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{backgroundColor: 'rgb(231, 227, 216)'}}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto" style={{backgroundColor: 'rgb(231, 227, 216)'}}>
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-light text-gray-900 tracking-wide">Séminaires</h1>
            <p className="mt-3 text-sm font-light text-gray-600 tracking-wide">
              Gérez tous les séminaires
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
              Nouveau séminaire
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 text-red-700 px-6 py-4 font-light tracking-wide">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-10">
            <SeminarForm
              seminar={editingSeminar}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {/* List */}
        {!showForm && (
          <SeminarList
            seminars={seminars}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        )}
      </div>
    </div>
  );
}
