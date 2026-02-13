'use client';

import type { PromoCode } from '@/../app/[locale]/admin/(protected)/promo-codes/page';

interface PromoCodeStatsProps {
  promoCodes: PromoCode[];
}

export default function PromoCodeStats({ promoCodes }: PromoCodeStatsProps) {
  const now = new Date();

  const stats = {
    total: promoCodes.length,
    active: promoCodes.filter((c) => {
      if (!c.is_active) return false;
      const validFrom = new Date(c.valid_from);
      const validUntil = c.valid_until ? new Date(c.valid_until) : null;
      if (now < validFrom) return false;
      if (validUntil && now > validUntil) return false;
      if (c.max_uses && c.current_uses >= c.max_uses) return false;
      return true;
    }).length,
    totalUsages: promoCodes.reduce((sum, code) => sum + code.current_uses, 0),
    totalDiscount: promoCodes.reduce((sum, code) => {
      if (code.discount_type === 'fixed') {
        return sum + code.discount_value * code.current_uses;
      }
      // For percentage, we can't calculate exact discount without knowing order amounts
      return sum;
    }, 0),
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 mb-10">
      <div className="bg-white overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-light text-gray-600 tracking-wide truncate">Total codes</dt>
                <dd className="text-2xl font-light text-gray-900 tracking-wide">{stats.total}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-light text-gray-600 tracking-wide truncate">Actifs</dt>
                <dd className="text-2xl font-light text-gray-900 tracking-wide">{stats.active}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-light text-gray-600 tracking-wide truncate">Total utilisations</dt>
                <dd className="text-2xl font-light text-gray-900 tracking-wide">{stats.totalUsages}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-light text-gray-600 tracking-wide truncate">Économies (fixe)</dt>
                <dd className="text-2xl font-light text-gray-900 tracking-wide">
                  {stats.totalDiscount.toFixed(2)} EUR
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
