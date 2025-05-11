import { config } from '@/config/environment';

// API base URL from environment config
const API_BASE_URL = config.apiBaseUrl;

export const scope = {
  longterm: 'longterm',
  daily: 'daily',
} as const;
export type ScopeEnum = (typeof scope)[keyof typeof scope];

export interface ChecklistItem {
  id: string;
  description: string;
  done: boolean;
  scheduledTime?: string; // ISO date string for scheduled items
  scope?: ScopeEnum;
}

export interface ChecklistResponse {
  result: ChecklistItem[];
}

export interface ChecklistCreateRequest {
  description: string;
}

export interface UpdateChecklistItemRequest {
  description?: string;
  done?: boolean;
  scope?: ScopeEnum;
}

export interface DeleteChecklistItemResponse {
  result: 'success' | 'failure';
}

export interface UpdateChecklistItemResponse {
  result: 'success' | 'failure';
  item?: ChecklistItem;
}

export interface ChecklistSuggestionResponse {
  message: string;
  result: string;
  statusCode: number;
}

/**
 * Fetch all checklist items for the specified plan
 */
export const fetchChecklist = async (
  planId: string,
  scope: 'daily' | 'longterm' = 'daily'
): Promise<ChecklistResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/plans/${planId}/checklists?scope=${scope}`
  );

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
  planId: string,
  scope: 'daily' | 'longterm' = 'daily'
): Promise<ChecklistItem> => {
  const response = await fetch(
    `${API_BASE_URL}/api/plans/${planId}/checklists`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description, scope }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create checklist item: ${response.statusText}`);
  }

  const jsonRes = await response.json();

  return await jsonRes.result;
};

/**
 * Update a checklist item (description and/or done status)
 */
export const updateChecklistItem = async (
  id: string,
  updates: UpdateChecklistItemRequest,
  planId: string,
  scope: 'daily' | 'longterm' = 'daily'
): Promise<UpdateChecklistItemResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/plans/${planId}/checklists/${id}?scope=${scope}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update checklist item: ${response.statusText}`
      );
    }

    const data = await response.json();
    return { result: 'success', item: data };
  } catch (err) {
    console.error('Failed to update checklist item:', err);
    return { result: 'failure' };
  }
};

/**
 * Delete a checklist item
 */
export const deleteChecklistItem = async (
  id: string,
  planId: string,
  scope: 'daily' | 'longterm' = 'daily'
): Promise<DeleteChecklistItemResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/plans/${planId}/checklists/${id}?scope=${scope}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return await response.json();
  } catch (err) {
    console.log('Failed to delete checklist item, error:', err);
    return { result: 'failure' };
  }
};

/**
 * Get an AI-generated checklist item suggestion
 */
export const getChecklistSuggestion = async (
  planId: string,
  scope: 'daily' | 'longterm' = 'daily'
): Promise<ChecklistSuggestionResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/insights/checklist-suggestion?plan_id=${planId}&scope=${scope}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to get checklist suggestion: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (err) {
    console.error('Failed to get checklist suggestion:', err);
    // Return a fallback suggestion if the API fails
    return {
      message: 'Failed to generate suggestion',
      result: 'Review your current project priorities',
      statusCode: 200,
    };
  }
};

/**
 * Schedule a checklist item
 */
export const scheduleChecklistItem = async (
  id: string,
  planId: string,
  scheduleTime: Date,
  scope: 'daily' | 'longterm' = 'daily'
): Promise<UpdateChecklistItemResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/plans/${planId}/checklists/${id}/schedule?scope=${scope}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduledTime: scheduleTime.toISOString() }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to schedule checklist item: ${response.statusText}`
      );
    }

    const data = await response.json();
    return { result: 'success', item: data };
  } catch (err) {
    console.error('Failed to schedule checklist item:', err);
    return { result: 'failure' };
  }
};
