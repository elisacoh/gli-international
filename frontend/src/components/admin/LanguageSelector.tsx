'use client';

import { useState } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  // { code: 'ka', name: 'ქართული', flag: '🇬🇪' },
  // { code: 'es', name: 'Español', flag: '🇪🇸' },
  // { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  // { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onLanguagesChange: (languages: string[]) => void;
  disabled?: boolean;
}

export default function LanguageSelector({ selectedLanguages, onLanguagesChange, disabled }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleLanguage = (code: string) => {
    if (code === 'fr') return; // French is always required

    if (selectedLanguages.includes(code)) {
      onLanguagesChange(selectedLanguages.filter(lang => lang !== code));
    } else {
      onLanguagesChange([...selectedLanguages, code]);
    }
  };

  return (
    <div className="border-b border-gray-200 pb-8 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-light text-gray-900 tracking-wide">Langues disponibles</h3>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="text-sm font-light text-gray-600 hover:text-gray-900 tracking-wide transition-colors duration-300"
        >
          {isOpen ? 'Fermer' : 'Gérer les langues'}
        </button>
      </div>

      {isOpen && (
        <div className="bg-gray-50 p-4 space-y-3">
          {AVAILABLE_LANGUAGES.map((lang) => (
            <label
              key={lang.code}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedLanguages.includes(lang.code)}
                onChange={() => handleToggleLanguage(lang.code)}
                disabled={disabled || lang.code === 'fr'}
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
              />
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm font-light text-gray-900 tracking-wide group-hover:text-gray-700 transition-colors">
                {lang.name}
              </span>
              {lang.code === 'fr' && (
                <span className="text-xs font-light text-gray-500">(obligatoire)</span>
              )}
            </label>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {selectedLanguages.map((code) => {
          const lang = AVAILABLE_LANGUAGES.find(l => l.code === code);
          if (!lang) return null;
          return (
            <span
              key={code}
              className="inline-flex items-center px-3 py-1 bg-white border border-gray-300 text-sm font-light tracking-wide"
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export { AVAILABLE_LANGUAGES };
export type { Language };
