'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';

// Interface for navigation items
interface NavItem {
  name: string;
  href: string;
  isActive?: boolean;
}

// Interface for navigation sections
interface NavSection {
  title: string;
  items: NavItem[];
}

export default function Sidebar() {
  // State to track dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Listen for system dark mode changes
  useEffect(() => {
    // Check initial dark mode preference
    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );
    setIsDarkMode(darkModeMediaQuery.matches);

    // Add listener for changes
    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);

    // Clean up listener
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, []);

  // Define navigation structure
  const [navSections] = useState<NavSection[]>([
    {
      title: 'Learning',
      items: [
        { name: 'Microservices', href: '/learning/microservices' },
        { name: 'GenAI', href: '/learning/genai' },
      ],
    },
    {
      title: 'Projects',
      items: [{ name: 'Fireplace Project', href: '/', isActive: true }],
    },
  ]);

  return (
    <aside
      className="w-64 h-screen fixed left-0 top-0 pt-8 px-4 overflow-y-auto transition-colors"
      style={{
        backgroundColor: isDarkMode
          ? '#171717' // Darker than #1f1f1f main dark background
          : 'rgb(232, 230, 217)', // Slightly darker than light mode background
      }}
    >
      <nav className="space-y-6">
        {/* Title with Logo */}
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="text-3xl font-bold">Fireplace</h1>
        </div>

        {/* Core List */}
        <div className="py-4">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-2 pb-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider opacity-70">
                {section.title}
              </h3>

              <ul className="space-y-1 pl-2">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex px-3 py-2 text-sm rounded-md ${
                        item.isActive
                          ? 'bg-opacity-30 font-medium'
                          : 'hover:bg-opacity-20'
                      } transition-colors`}
                      style={{
                        backgroundColor: item.isActive
                          ? 'rgba(247, 111, 83, 0.1)'
                          : 'transparent',
                        color: item.isActive ? 'rgb(247, 111, 83)' : 'inherit',
                      }}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Plan Button */}
        <button
          className="w-full py-2 px-4 rounded-md text-sm font-medium transition-all hover:bg-opacity-10"
          style={{
            border: '1px solid rgb(247, 111, 83)',
            color: 'rgb(247, 111, 83)',
            backgroundColor: isDarkMode
              ? 'rgba(247, 111, 83, 0.05)'
              : 'rgba(247, 111, 83, 0.02)',
          }}
        >
          Create New Plan
        </button>
      </nav>
    </aside>
  );
}
