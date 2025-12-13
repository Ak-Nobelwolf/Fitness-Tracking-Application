import { OwnerProfile, ActivityType, Activity, DailyAggregate, WeeklyAggregate, MonthlyAggregate, ActivityTypeMix } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getHeaders(ownerId?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (ownerId) {
    headers['x-owner-id'] = ownerId;
  }
  
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export const api = {
  profile: {
    get: async (ownerId: string): Promise<OwnerProfile> => {
      const response = await fetch(`${API_BASE}/api/v1/owners/profile`, {
        headers: getHeaders(ownerId),
      });
      return handleResponse<OwnerProfile>(response);
    },
    upsert: async (ownerId: string, data: Record<string, unknown>): Promise<OwnerProfile> => {
      const response = await fetch(`${API_BASE}/api/v1/owners/profile`, {
        method: 'POST',
        headers: getHeaders(ownerId),
        body: JSON.stringify(data),
      });
      return handleResponse<OwnerProfile>(response);
    },
  },
  activityTypes: {
    list: async (ownerId: string): Promise<ActivityType[]> => {
      const response = await fetch(`${API_BASE}/api/v1/activity-types`, {
        headers: getHeaders(ownerId),
      });
      return handleResponse<ActivityType[]>(response);
    },
    create: async (ownerId: string, data: Record<string, unknown>): Promise<ActivityType> => {
      const response = await fetch(`${API_BASE}/api/v1/activity-types`, {
        method: 'POST',
        headers: getHeaders(ownerId),
        body: JSON.stringify(data),
      });
      return handleResponse<ActivityType>(response);
    },
  },
  activities: {
    list: async (ownerId: string): Promise<Activity[]> => {
      const response = await fetch(`${API_BASE}/api/v1/activities`, {
        headers: getHeaders(ownerId),
      });
      return handleResponse<Activity[]>(response);
    },
    get: async (ownerId: string, activityId: string): Promise<Activity> => {
      const response = await fetch(`${API_BASE}/api/v1/activities/${activityId}`, {
        headers: getHeaders(ownerId),
      });
      return handleResponse<Activity>(response);
    },
    create: async (ownerId: string, data: Record<string, unknown>): Promise<Activity> => {
      const response = await fetch(`${API_BASE}/api/v1/activities`, {
        method: 'POST',
        headers: getHeaders(ownerId),
        body: JSON.stringify(data),
      });
      return handleResponse<Activity>(response);
    },
    update: async (ownerId: string, activityId: string, data: Record<string, unknown>): Promise<Activity> => {
      const response = await fetch(`${API_BASE}/api/v1/activities/${activityId}`, {
        method: 'PUT',
        headers: getHeaders(ownerId),
        body: JSON.stringify(data),
      });
      return handleResponse<Activity>(response);
    },
    delete: async (ownerId: string, activityId: string): Promise<void> => {
      const response = await fetch(`${API_BASE}/api/v1/activities/${activityId}`, {
        method: 'DELETE',
        headers: getHeaders(ownerId),
      });
      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }
    },
  },
  dashboard: {
    daily: async (ownerId: string): Promise<DailyAggregate[]> => {
      const response = await fetch(`${API_BASE}/api/v1/dashboard/daily`, {
        headers: getHeaders(ownerId),
      });
      return handleResponse<DailyAggregate[]>(response);
    },
    weekly: async (ownerId: string): Promise<WeeklyAggregate[]> => {
      const response = await fetch(`${API_BASE}/api/v1/dashboard/weekly`, {
        headers: getHeaders(ownerId),
      });
      return handleResponse<WeeklyAggregate[]>(response);
    },
    monthly: async (ownerId: string): Promise<MonthlyAggregate[]> => {
      const response = await fetch(`${API_BASE}/api/v1/dashboard/monthly`, {
        headers: getHeaders(ownerId),
      });
      return handleResponse<MonthlyAggregate[]>(response);
    },
    activityTypeMix: async (ownerId: string): Promise<ActivityTypeMix[]> => {
      const response = await fetch(`${API_BASE}/api/v1/dashboard/activity-type-mix`, {
        headers: getHeaders(ownerId),
      });
      return handleResponse<ActivityTypeMix[]>(response);
    },
  },
};
