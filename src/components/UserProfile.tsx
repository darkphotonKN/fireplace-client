'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
      >
        <span className="text-sm">Kranti</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-3 h-3 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white/5 backdrop-blur-sm">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
              role="menuitem"
            >
              Profile Settings
            </Link>
            <Link
              href="/myplans"
              className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10"
              role="menuitem"
            >
              My Plans
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
