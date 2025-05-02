import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-gray-600">Let's continue your learning journey</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Learning Progress Card */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Learning Progress
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    React Masterclass
                  </span>
                  <span className="text-sm text-gray-600">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    TypeScript Fundamentals
                  </span>
                  <span className="text-sm text-gray-600">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>
          </Card>

          {/* GitHub Integration Card */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              GitHub Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">flow-client</p>
                  <p className="text-sm text-gray-600">
                    Last commit: 2 hours ago
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Todo List Card */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Today's Tasks
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox id="task1" />
                <label htmlFor="task1" className="text-sm text-gray-700">
                  Complete React hooks tutorial
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="task2" />
                <label htmlFor="task2" className="text-sm text-gray-700">
                  Review TypeScript types
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="task3" />
                <label htmlFor="task3" className="text-sm text-gray-700">
                  Practice with Tailwind CSS
                </label>
              </div>
            </div>
          </Card>

          {/* Recent Videos Card */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Videos
            </h2>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="w-32 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-800">
                    Advanced React Patterns
                  </p>
                  <p className="text-sm text-gray-600">YouTube • 45 min</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-32 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-800">
                    TypeScript Best Practices
                  </p>
                  <p className="text-sm text-gray-600">Udemy • 30 min</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Notes Card */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Notes
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  Remember to implement custom hooks for form validation
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  Review TypeScript utility types
                </p>
              </div>
            </div>
          </Card>

          {/* Next Session Card */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Next Learning Session
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">React Performance</p>
                  <p className="text-sm text-gray-600">Tomorrow, 10:00 AM</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
