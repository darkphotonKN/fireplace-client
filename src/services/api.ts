import { config } from "@/config/environment";

// API base URL from environment config
const API_BASE_URL = config.apiBaseUrl;

// Fixed plan ID for testing
const PLAN_ID = config.testPlanId;

export interface ChecklistItem {
  id: string;
  description: string;
  done: boolean;
}

export interface ChecklistResponse {
  result: ChecklistItem[];
}

export interface ChecklistCreateRequest {
  description: string;
}

/**
 * Fetch all checklist items for the current plan
 */
export const fetchChecklist = async (): Promise<ChecklistResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/plan/${PLAN_ID}/checklist`);

  if (!response.ok) {
    throw new Error(`Failed to fetch checklist: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Create a new checklist item
 */
export const createChecklistItem = async (
  description: string,
): Promise<ChecklistItem> => {
  const response = await fetch(
    `${API_BASE_URL}/api/plan/${PLAN_ID}/checklist`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to create checklist item: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Toggle the completion status of a checklist item
 * Note: This is a placeholder for future implementation
 */
export const toggleChecklistItem = async (
  id: string,
  completed: boolean,
): Promise<ChecklistItem> => {
  // This is a placeholder - we acknowledge the parameters but don't use them yet
  console.log(
    `Would toggle item ${id} to ${completed ? "completed" : "not completed"}`,
  );
  throw new Error("API endpoint not implemented");
};

/**
 * Delete a checklist item
 * Note: This is a placeholder for future implementation
 */
export const deleteChecklistItem = async (id: string): Promise<void> => {
  // This is a placeholder - we acknowledge the parameter but don't use it yet
  console.log(`Would delete item ${id}`);
  throw new Error("API endpoint not implemented");
};
