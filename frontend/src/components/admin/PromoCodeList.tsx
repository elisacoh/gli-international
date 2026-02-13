'use client';

import { useState } from 'react';
import type { PromoCode } from '@/../app/[locale]/admin/(protected)/promo-codes/page';

interface PromoCodeListProps {
  promoCodes: PromoCode[];
  onEdit: (code: PromoCode) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export default function PromoCodeList({ promoCodes, onEdit, onDelete, onToggleActive }: PromoCodeListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [ownerFilter, setOwnerFilter] = useState('');

  // Get unique owners for dropdown
  const uniqueOwners = Array.from(
    new Set(promoCodes.map((code) => code.owner).filter((owner) => owner))
  ).sort();

  const filteredCodes = promoCodes.filter((code) => {
    // Filter by status
    if (filter === 'active' && !code.is_active) return false;
    if (filter === 'inactive' && code.is_active) return false;

    // Filter by owner
    if (ownerFilter && code.owner !== ownerFilter) return false;

    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDiscount = (code: PromoCode) => {
    if (code.discount_type === 'percentage') {
      return `${code.discount_value}%`;
    }
    return `${code.discount_value} EUR`;
  };

  const getStatusBadge = (code: PromoCode) => {
    const now = new Date();
    const validFrom = new Date(code.valid_from);
    const validUntil = code.valid_until ? new Date(code.valid_until) : null;

    if (!code.is_active) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">Inactif</span>;
    }

    if (now < validFrom) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">À venir</span>;
    }

    if (validUntil && now > validUntil) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Expiré</span>;
    }

    if (code.max_uses && code.current_uses >= code.max_uses) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Épuisé</span>;
    }

    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Actif</span>;
  };

  return (
    <div className="bg-white overflow-hidden transition-all duration-300">
      <style dangerouslySetInnerHTML={{__html: `
        .promo-codes-scroll::-webkit-scrollbar {
          width: 12px;
        }
        .promo-codes-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-left: 1px solid #e5e7eb;
        }
        .promo-codes-scroll::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 6px;
        }
        .promo-codes-scroll::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .promo-codes-scroll {
          scrollbar-width: thin;
          scrollbar-color: #888 #f1f1f1;
        }
      `}} />
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
            Tous ({promoCodes.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`${
              filter === 'active'
                ? 'border-gray-900 text-gray-900 font-normal'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-light text-sm tracking-wide transition-all duration-300`}
          >
            Actifs ({promoCodes.filter((c) => c.is_active).length})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`${
              filter === 'inactive'
                ? 'border-gray-900 text-gray-900 font-normal'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-light text-sm tracking-wide transition-all duration-300`}
          >
            Inactifs ({promoCodes.filter((c) => !c.is_active).length})
          </button>
        </nav>

        {/* Owner Filter */}
        {uniqueOwners.length > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="owner-filter" className="text-sm font-light text-gray-700 tracking-wide whitespace-nowrap">
              Propriétaire:
            </label>
            <select
              id="owner-filter"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="block w-48 border border-gray-300 py-1.5 pl-3 pr-10 text-sm font-light tracking-wide focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all duration-300"
            >
              <option value="">Tous</option>
              {uniqueOwners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
            {ownerFilter && (
              <button
                onClick={() => setOwnerFilter('')}
                className="text-sm font-light text-gray-600 hover:text-gray-900 tracking-wide transition-colors duration-300"
              >
                ✕ Effacer
              </button>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Table */}
      <div className="promo-codes-scroll overflow-x-auto overflow-y-auto max-h-[500px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{backgroundColor: 'rgb(245, 243, 236)'}}>
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Code
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Propriétaire
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Réduction
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Période
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-light text-gray-600 uppercase tracking-widest">
                Utilisations
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
            {filteredCodes.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm font-light text-gray-600 tracking-wide">
                  Aucun code promo trouvé
                </td>
              </tr>
            ) : (
              filteredCodes.map((code) => (
                <tr key={code.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-normal text-gray-900 tracking-wide">{code.code}</div>
                    {code.description?.fr && (
                      <div className="text-sm font-light text-gray-600 truncate max-w-xs">{code.description.fr}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {code.owner ? (
                      <div className="text-sm font-light text-gray-900 tracking-wide">{code.owner}</div>
                    ) : (
                      <div className="text-sm font-light text-gray-400 italic tracking-wide">Non défini</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-light text-gray-900 tracking-wide">{formatDiscount(code)}</div>
                    {code.min_purchase_amount && (
                      <div className="text-xs font-light text-gray-600">Min: {code.min_purchase_amount} EUR</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-light text-gray-600 tracking-wide">
                    <div>{formatDate(code.valid_from)}</div>
                    {code.valid_until && <div>au {formatDate(code.valid_until)}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-light text-gray-900 tracking-wide">
                      {code.current_uses}
                      {code.max_uses ? ` / ${code.max_uses}` : ' / ∞'}
                    </div>
                    <div className="text-xs font-light text-gray-600">Max par user: {code.max_uses_per_user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(code)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-light">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onToggleActive(code.id, code.is_active)}
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                        title={code.is_active ? 'Désactiver' : 'Activer'}
                      >
                        {code.is_active ? (
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
                        onClick={() => onEdit(code)}
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
                        onClick={() => onDelete(code.id)}
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
