'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import DestinationForm from '@/components/admin/DestinationForm';
import DestinationList from '@/components/admin/DestinationList';

interface Destination {
  id: string;
  seminar_id: string;
  image_url: string;
  country: {
    fr?: string;
    en?: string;
  };
  city: {
    fr?: string;
    en?: string;
  };
  price: number;
  currency: string;
  start_date?: string;
  end_date?: string;
  available_spots?: number;
  is_active: boolean;
  is_coup_de_coeur?: boolean;
  created_at: string;
}

interface Seminar {
  id: string;
  title: {
    fr?: string;
    en?: string;
  };
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [error, setError] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load seminars first
      const { data: seminarsData, error: seminarsError } = await supabase
        .from('seminars')
        .select('id, title')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (seminarsError) throw seminarsError;
      setSeminars(seminarsData || []);

      // Load destinations
      const { data: destinationsData, error: destinationsError } = await supabase
        .from('destinations')
        .select('*')
        .order('created_at', { ascending: false });

      if (destinationsError) throw destinationsError;
      setDestinations(destinationsData || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des données');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingDestination(null);
    setShowForm(true);
  };

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette destination ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('destinations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadData();
    } catch (err: any) {
      alert('Erreur lors de la suppression: ' + err.message);
      console.error('Error deleting destination:', err);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('destinations')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      await loadData();
    } catch (err: any) {
      alert('Erreur lors de la mise à jour: ' + err.message);
      console.error('Error toggling destination:', err);
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingDestination(null);
    await loadData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingDestination(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 pt-0 pb-6" style={{backgroundColor: 'rgb(231, 227, 216)'}}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto" style={{backgroundColor: 'rgb(231, 227, 216)'}}>
      <div className="max-w-7xl mx-auto px-8 pt-0 pb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-light text-gray-900 tracking-wide">Destinations</h1>
            <p className="mt-3 text-sm font-light text-gray-600 tracking-wide">
              Gérez toutes les destinations
            </p>
          </div>
          {!showForm && (
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-8 py-3 border border-gray-900 text-sm font-light tracking-wide text-white bg-gray-900 hover:bg-gray-800 focus:outline-none transition-all duration-300"
              disabled={seminars.length === 0}
              title={seminars.length === 0 ? 'Créez d\'abord un séminaire' : ''}
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
              Nouvelle destination
            </button>
          )}
        </div>

        {seminars.length === 0 && !showForm && (
          <div className="mb-6 bg-yellow-50 border border-yellow-300 text-yellow-700 px-6 py-4 font-light tracking-wide">
            Vous devez d'abord créer un séminaire avant de pouvoir ajouter des destinations.
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 text-red-700 px-6 py-4 font-light tracking-wide">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-10">
            <DestinationForm
              destination={editingDestination}
              seminars={seminars}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {/* List */}
        {!showForm && (
          <DestinationList
            destinations={destinations}
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
