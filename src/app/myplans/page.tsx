'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

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

export default function MyPlans() {
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

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="backdrop-blur-sm rounded-2xl p-8 shadow-lg bg-white/5 dark:bg-gray-900/10">
          <h1 className="text-4xl font-bold mb-2">My Plans</h1>
          <p className="opacity-80">
            Manage and track your development and learning plans.
          </p>
        </div>

        {/* Plans Section */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              <p className="mt-2 text-gray-500">Loading plans...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No plans found. Create your first plan!
              </p>
              <Link
                href="/create-plan"
                className="inline-block mt-4 px-6 py-2 rounded-md text-white font-medium transition-colors"
                style={{ backgroundColor: 'rgb(247, 111, 83)' }}
              >
                Create New Plan
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Link key={plan.id} href={`/plan/${plan.id}`}>
                  <Card className="backdrop-blur-sm shadow-sm border-0 bg-white/5 dark:bg-gray-900/10 h-full transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="p-6">
                      <h3
                        className="text-xl font-semibold mb-2"
                        style={{ color: 'rgb(247, 111, 83)' }}
                      >
                        {plan.name}
                      </h3>
                      <div className="text-sm font-medium mb-3 opacity-70">
                        {plan.planType === 'development'
                          ? 'Development'
                          : 'Learning'}
                      </div>
                      <p className="opacity-80 line-clamp-3">
                        {plan.description || 'No description available'}
                      </p>
                      {plan.focus && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <h4 className="text-sm font-medium opacity-70 mb-1">
                            Focus
                          </h4>
                          <p className="text-sm opacity-80 line-clamp-2">
                            {plan.focus}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
