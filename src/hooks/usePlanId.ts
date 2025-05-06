'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { config } from '@/config/environment';

/**
 * Custom hook to get and watch the current plan ID from URL query parameters
 * Returns the current plan ID and a function to change it
 */
export function usePlanId() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get plan ID from query params or fallback to default
  const currentPlanId = searchParams.get('plan_id') || config.testPlanId;

  // Function to change the plan ID
  const setPlanId = (newPlanId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newPlanId && newPlanId !== config.testPlanId) {
      params.set('plan_id', newPlanId);
    } else {
      params.delete('plan_id');
    }

    // Create new URL with updated params
    const newUrl =
      pathname + (params.toString() ? `?${params.toString()}` : '');

    // Update URL without refreshing page
    router.push(newUrl);
  };

  return { planId: currentPlanId, setPlanId };
}
