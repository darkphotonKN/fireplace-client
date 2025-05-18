'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

// Interface for plan data from API
interface Plan {
  id: string;
  name: string;
  planType: string;
  focus?: string;
  description?: string;
}

// Interface for API response
interface ApiResponse {
  statusCode: number;
  message: string;
  result: Plan[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const planId = pathname?.split('/plan/')?.[1] || '';

  // State to track dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // State for plans
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:6060/api/plans');

        if (!response.ok) {
          throw new Error(`Failed to fetch plans: ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();
        console.log('Plans:', data);
        setPlans(data.result || []);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load plans');
        // Set empty plans array as fallback
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

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

  // Create nav sections based on plans
  const navSections: NavSection[] = [
    {
      title: 'Learning',
      items: plans
        .filter((plan) => plan.planType === 'learning')
        .map((plan) => ({
          name: plan.name,
          href: `/plan/${plan.id}`,
          isActive: plan.id === planId,
        })),
    },
    {
      title: 'Projects',
      items: plans
        .filter((plan) => plan.planType === 'development')
        .map((plan) => ({
          name: plan.name,
          href: `/plan/${plan.id}`,
          isActive: plan.id === planId,
        })),
    },
  ];

  return (
    <div
      className="fixed left-0 top-0 h-screen z-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 50px trigger area */}
      <div className="absolute left-0 top-0 h-full w-[50px]" />

      <aside
        className={`h-screen pt-8 px-4 overflow-y-auto transition-all duration-300 ${
          isHovered
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0'
        }`}
        style={{
          backgroundColor: isDarkMode
            ? '#171717' // Darker than #1f1f1f main dark background
            : 'rgb(232, 230, 217)', // Slightly darker than light mode background
          width: '16rem', // Fixed width of 16rem (256px)
        }}
      >
        <nav className="space-y-6">
          {/* Core List */}
          <div className="py-4">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-2 pb-4">
                <h3 className="font-semibold text-sm uppercase tracking-wider opacity-70">
                  {section.title}
                </h3>

                <ul className="space-y-1 pl-2">
                  {isLoading ? (
                    <li className="text-sm opacity-70 px-3 py-2">Loading...</li>
                  ) : error ? (
                    <li className="text-sm opacity-70 px-3 py-2">{error}</li>
                  ) : section.items.length === 0 ? (
                    <li className="text-sm opacity-70 px-3 py-2">
                      No {section.title.toLowerCase()} found
                    </li>
                  ) : (
                    section.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`flex px-3 py-2 text-sm rounded-md ${
                            item.isActive
                              ? 'bg-opacity-30 font-medium'
                              : 'hover:bg-opacity-20'
                          } transition-colors cursor-pointer`}
                          style={{
                            backgroundColor: item.isActive
                              ? 'rgba(247, 111, 83, 0.1)'
                              : 'transparent',
                            color: item.isActive
                              ? 'rgb(247, 111, 83)'
                              : 'inherit',
                          }}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>

          {/* Plan Button */}
          <Link
            href="/create-plan"
            className="block w-full py-2 px-4 rounded-md text-sm font-medium text-center transition-all hover:bg-opacity-10"
            style={{
              border: '1px solid rgb(247, 111, 83)',
              color: 'rgb(247, 111, 83)',
              backgroundColor: isDarkMode
                ? 'rgba(247, 111, 83, 0.05)'
                : 'rgba(247, 111, 83, 0.02)',
            }}
          >
            Create New Plan
          </Link>
        </nav>
      </aside>
    </div>
  );
}
