'use client';

import { useEffect, useState } from 'react';

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide indicator when near bottom of page
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      setIsVisible(!scrolledToBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNext = () => {
    const sections = document.querySelectorAll('section');
    const currentScroll = window.scrollY;

    // Find the next section
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.offsetTop;

      if (sectionTop > currentScroll + 50) {
        section.scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToNext}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-300 animate-bounce cursor-pointer group"
      aria-label="Scroll to next section"
    >
      <svg
        className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </button>
  );
}