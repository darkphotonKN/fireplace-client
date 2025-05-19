"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Todo from "@/components/Todo";
import GitHub from "@/components/GitHub";
import { useEffect, useState, use } from "react";
import { fetchPlan, PlanDetailData } from "@/services/api";

export default function PlanDetail({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = use(params);
  const [plan, setPlan] = useState<PlanDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlanData() {
      if (!planId) return;

      setIsLoading(true);
      setError("");

      try {
        const response = await fetchPlan(planId);

        if (response.result) {
          setPlan(response.result);
        } else {
          setError(response.message || "Failed to load plan");
        }
      } catch (error) {
        console.error("Error loading plan:", error);
        setError("Failed to load plan data");
      } finally {
        setIsLoading(false);
      }
    }

    loadPlanData();
  }, [planId]);

  return (
    <main className="min-h-screen p-8">
      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Title Section */}
        <div className="backdrop-blur-sm rounded-2xl p-8 shadow-lg bg-white/5 dark:bg-gray-900/10">
          <h1 className="text-4xl font-bold mb-2">
            {isLoading ? "Loading..." : error ? "Plan Details" : plan?.name}
          </h1>
          <p className="opacity-80">
            {isLoading
              ? "..."
              : error
                ? error
                : plan?.description ||
                "Let's continue your development journey."}
          </p>

          <div className="absolute bottom-[20px] right-[20px] z-10">
            <div className="relative group">
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Information about daily suggestions"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-lg">
                  <p className="text-sm text-white mb-1">{plan?.focus}</p>
                  <p className="text-xs text-gray-400">
                    Your focus is one of the primary components that drive the
                    insights and suggestions provided for your plan.
                  </p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-white/5 border-l border-t border-white/10 transform -rotate-45"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid - Flexible Layout */}
        <div className="grid grid-cols-1 gap-6">
          {/* Top Row - Today's Tasks and Quick Notes (stacked below 1280px, side by side above) */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="backdrop-blur-sm shadow-sm border-0">
              <h2 className="text-xl font-semibold p-6 pb-4">Tasks</h2>
              <div className="p-6 pt-0">
                <Todo />
              </div>
            </Card>

            <Card className="backdrop-blur-sm shadow-sm border-0">
              <h2 className="text-xl font-semibold p-6 pb-4">Notes</h2>
              <div className="space-y-3 p-6 pt-0">
                <div className="p-3 bg-amber-500/5 dark:bg-amber-500/10 rounded-lg">
                  <p className="text-sm">
                    Remember to implement custom hooks for form validation
                  </p>
                </div>
                <div className="p-3 bg-amber-500/5 dark:bg-amber-500/10 rounded-lg">
                  <p className="text-sm">Review TypeScript utility types</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Second Row - Learning Progress and GitHub Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="backdrop-blur-sm shadow-sm border-0">
              <h2 className="text-xl font-semibold p-6 pb-4">
                Learning Progress
              </h2>
              <div className="space-y-4 p-6 pt-0">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm opacity-80">
                      React Masterclass
                    </span>
                    <span className="text-sm opacity-80">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm opacity-80">
                      TypeScript Fundamentals
                    </span>
                    <span className="text-sm opacity-80">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </div>
            </Card>

            <Card className="backdrop-blur-sm shadow-sm border-0">
              <h2 className="text-xl font-semibold p-6 pb-4">
                GitHub Activity
              </h2>
              <div className="p-6 pt-0">
                <GitHub />
              </div>
            </Card>
          </div>

          {/* Third Row - Next Learning Session (Full Width) */}
          <Card className="backdrop-blur-sm shadow-sm border-0">
            <h2 className="text-xl font-semibold p-6 pb-4">
              Next Learning Session
            </h2>
            <div className="space-y-4 p-6 pt-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-300"
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
                  <p className="font-medium">React Performance</p>
                  <p className="text-sm opacity-70">Tomorrow, 10:00 AM</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Fourth Row - Recent Videos only */}
          <Card className="backdrop-blur-sm shadow-sm border-0">
            <h2 className="text-xl font-semibold p-6 pb-4">Recent Videos</h2>
            <div className="space-y-4 p-6 pt-0">
              <div className="flex space-x-4">
                <div className="w-32 h-20 bg-gray-500/10 rounded-lg flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Advanced React Patterns</p>
                  <p className="text-sm opacity-70">YouTube • 45 min</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-32 h-20 bg-gray-500/10 rounded-lg flex-shrink-0"></div>
                <div>
                  <p className="font-medium">TypeScript Best Practices</p>
                  <p className="text-sm opacity-70">Udemy • 30 min</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
