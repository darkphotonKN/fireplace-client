'use client';

import { useState } from 'react';

export default function Home() {
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Welcome Section */}
        <div className="backdrop-blur-sm rounded-2xl p-8 shadow-lg bg-white/5 dark:bg-gray-900/10">
          <h1 className="text-4xl font-bold mb-2">Welcome back, Kranti.</h1>
          <p className="opacity-80">
            Let&apos;s continue your development journey.
          </p>
        </div>

        {/* Focus Selection Section */}
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-3xl font-medium text-center mb-8">
            What will be your focus of the day?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            <button
              onClick={() => setSelectedFocus('development')}
              className={`p-6 rounded-xl backdrop-blur-sm transition-all ${
                selectedFocus === 'development'
                  ? 'bg-white/10 shadow-lg scale-105'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <h3 className="text-xl font-medium mb-2">Development</h3>
              <p className="text-sm opacity-80">
                Focus on building and improving your projects
              </p>
            </button>
            <button
              onClick={() => setSelectedFocus('learning')}
              className={`p-6 rounded-xl backdrop-blur-sm transition-all ${
                selectedFocus === 'learning'
                  ? 'bg-white/10 shadow-lg scale-105'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <h3 className="text-xl font-medium mb-2">Learning</h3>
              <p className="text-sm opacity-80">
                Focus on acquiring new skills and knowledge
              </p>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
