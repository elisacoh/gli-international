'use client';

import { useState } from 'react';

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

interface DestinationListProps {
  destinations: Destination[];
  seminars: { id: string; title: { fr?: string; en?: string } }[];
  onEdit: (destination: Destination) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export default function DestinationList({ destinations, seminars, onEdit, onDelete, onToggleActive }: DestinationListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredDestinations = destinations.filter((destination) => {
    if (filter === 'active' && !destination.is_active) return false;
    if (filter === 'inactive' && destination.is_active) return false;
    return true;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSeminarTitle = (seminarId: string) => {
    const seminar = seminars.find(s => s.id === seminarId);
    return seminar?.title.fr || seminar?.title.en || 'N/A';
  };

  const getStatusBadge = (destination: Destination) => {
    if (!destination.is_active) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">Inactif</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Actif</span>;
  };

  return (
    <div className="bg-white overflow-hidden transition-all duration-300">
      {/* Filters */}
      <div className="border-b border-gray-200 px-6 py-4" style={{backgroundColor: 'rgb(251, 249, 244)'}}>
        <div className="flex items-center justify-between gap-4">
          {/* Status Filter Tabs */}
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setFilter('all')}
              className={`${
                filter === 'all'
                  ? 'border-gray-900 text-gray-900 font-normal'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-light text-sm tracking-wide transition-all duration-300`}
            >
              Tous ({destinations.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`${
                filter === 'active'
                  ? 'border-gray-900 text-gray-900 font-normal'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-light text-sm tracking-wide transition-all duration-300`}
            >
              Actifs ({destinations.filter((d) => d.is_active).length})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`${
                filter === 'inactive'
                  ? 'border-gray-900 text-gray-900 font-normal'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-light text-sm tracking-wide transition-all duration-300`}
            >
              Inactifs ({destinations.filter((d) => !d.is_active).length})
            </button>
          </nav>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-400px)]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{backgroundColor: 'rgb(245, 243, 236)'}}>
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Séminaire
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Destination
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Dates
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Prix
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Places
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Statut
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-light text-gray-600 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDestinations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm font-light text-gray-600 tracking-wide">
                  Aucune destination trouvée
                </td>
              </tr>
            ) : (
              filteredDestinations.map((destination) => (
                <tr key={destination.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="text-sm font-light text-gray-900 tracking-wide">
                      {getSeminarTitle(destination.seminar_id)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {destination.image_url && (
                        <img
                          src={destination.image_url}
                          alt={destination.city.fr || destination.city.en || ''}
                          className="w-12 h-12 object-cover"
                        />
                      )}
                      <div>
                        <div className="text-sm font-normal text-gray-900 tracking-wide flex items-center gap-2">
                          {destination.city.fr || destination.city.en}
                          {destination.is_coup_de_coeur && (
                            <span className="text-yellow-500" title="Coup de coeur - affiché sur la page d'accueil">⭐</span>
                          )}
                        </div>
                        <div className="text-xs font-light text-gray-600">
                          {destination.country.fr || destination.country.en}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-600 tracking-wide">
                    <div>{formatDate(destination.start_date)}</div>
                    {destination.end_date && <div>au {formatDate(destination.end_date)}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-light text-gray-900 tracking-wide">
                      {destination.price} {destination.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-light text-gray-900 tracking-wide">
                      {destination.available_spots !== undefined ? destination.available_spots : '∞'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(destination)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-light">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onToggleActive(destination.id, destination.is_active)}
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                        title={destination.is_active ? 'Désactiver' : 'Activer'}
                      >
                        {destination.is_active ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => onEdit(destination)}
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                        title="Modifier"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(destination.id)}
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                        title="Supprimer"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
