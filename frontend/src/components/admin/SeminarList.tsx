'use client';

import { useState } from 'react';

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

interface SeminarListProps {
  seminars: Seminar[];
  onEdit: (seminar: Seminar) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export default function SeminarList({ seminars, onEdit, onDelete, onToggleActive }: SeminarListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredSeminars = seminars.filter((seminar) => {
    if (filter === 'active' && !seminar.is_active) return false;
    if (filter === 'inactive' && seminar.is_active) return false;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (seminar: Seminar) => {
    if (!seminar.is_active) {
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
              Tous ({seminars.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`${
                filter === 'active'
                  ? 'border-gray-900 text-gray-900 font-normal'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-light text-sm tracking-wide transition-all duration-300`}
            >
              Actifs ({seminars.filter((s) => s.is_active).length})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`${
                filter === 'inactive'
                  ? 'border-gray-900 text-gray-900 font-normal'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-light text-sm tracking-wide transition-all duration-300`}
            >
              Inactifs ({seminars.filter((s) => !s.is_active).length})
            </button>
          </nav>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{backgroundColor: 'rgb(245, 243, 236)'}}>
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Titre
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Description courte
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Inclus
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Date de création
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
            {filteredSeminars.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm font-light text-gray-600 tracking-wide">
                  Aucun séminaire trouvé
                </td>
              </tr>
            ) : (
              filteredSeminars.map((seminar) => (
                <tr key={seminar.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="text-sm font-normal text-gray-900 tracking-wide">
                      {seminar.title.fr || seminar.title.en || 'Sans titre'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {seminar.short_description?.fr || seminar.short_description?.en ? (
                      <div className="text-sm font-light text-gray-600 truncate max-w-md">
                        {seminar.short_description.fr || seminar.short_description.en}
                      </div>
                    ) : (
                      <div className="text-sm font-light text-gray-400 italic">Non défini</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-light text-gray-900 tracking-wide">
                      {seminar.included.length} éléments
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-600 tracking-wide">
                    {formatDate(seminar.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(seminar)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-light">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onToggleActive(seminar.id, seminar.is_active)}
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                        title={seminar.is_active ? 'Désactiver' : 'Activer'}
                      >
                        {seminar.is_active ? (
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
                        onClick={() => onEdit(seminar)}
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
                        onClick={() => onDelete(seminar.id)}
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
