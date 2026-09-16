/**
 * AnserTech API Client
 * 
 * Centralized API client for all backend communication.
 * Features:
 * - Automatic token refresh
 * - Request/response interceptors
 * - Error handling
 * - Type-safe methods
 */

import { getSession, signOut } from 'next-auth/react';
import { authUrl } from '@/lib/authUrls';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// =============================================================================
// Types
// =============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, any>;

  constructor(message: string, status: number, code?: string, details?: Record<string, any>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// =============================================================================
// API Client Class
// =============================================================================

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get current access token from session
   */
  private async getToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    const session = await getSession();
    return session?.accessToken || null;
  }

  /**
   * Build request headers
   */
  private async getHeaders(includeAuth = true): Promise<HeadersInit> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = await this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    // Handle non-JSON responses
    if (!contentType?.includes('application/json')) {
      if (!response.ok) {
        throw new ApiError(
          `Server error: ${response.status} ${response.statusText}`,
          response.status
        );
      }
      return {} as T;
    }

    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      // Handle 401 - session expired
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          await signOut({ redirect: true, callbackUrl: authUrl('/login') });
        }
        throw new ApiError('Session expired. Please log in again.', 401, 'SESSION_EXPIRED');
      }

      // Handle other errors
      const errorMessage = 
        data.error || 
        data.detail || 
        data.message || 
        Object.values(data).flat().join(', ') ||
        'An error occurred';

      throw new ApiError(
        errorMessage,
        response.status,
        data.code,
        data.details || data
      );
    }

    // Normalize response format
    // Backend may return { success: true, data: {...} } or just {...}
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data;
    }
    return data;
  }

  /**
   * Make API request
   */
  private async request<T>(
    method: string,
    endpoint: string,
    body?: any,
    options: { includeAuth?: boolean; timeout?: number } = {}
  ): Promise<T> {
    const { includeAuth = true, timeout = 30000 } = options;
    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.getHeaders(includeAuth);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      return await this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT');
      }
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error.message || 'Network error',
        0,
        'NETWORK_ERROR'
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // ===========================================================================
  // HTTP Methods
  // ===========================================================================

  async get<T>(endpoint: string, options?: { includeAuth?: boolean }): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  async post<T>(endpoint: string, body?: any, options?: { includeAuth?: boolean }): Promise<T> {
    return this.request<T>('POST', endpoint, body, options);
  }

  async put<T>(endpoint: string, body?: any, options?: { includeAuth?: boolean }): Promise<T> {
    return this.request<T>('PUT', endpoint, body, options);
  }

  async patch<T>(endpoint: string, body?: any, options?: { includeAuth?: boolean }): Promise<T> {
    return this.request<T>('PATCH', endpoint, body, options);
  }

  async delete<T>(endpoint: string, options?: { includeAuth?: boolean }): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  // ===========================================================================
  // Domain-Specific Methods
  // ===========================================================================

  // Agents
  async getAgents() {
    return this.get<any[]>('/agents/');
  }

  async getAgent(id: string) {
    return this.get<any>(`/agents/${id}/`);
  }

  async createAgent(data: any) {
    return this.post<any>('/agents/', data);
  }

  async updateAgent(id: string, data: any) {
    return this.patch<any>(`/agents/${id}/`, data);
  }

  async deleteAgent(id: string) {
    return this.delete(`/agents/${id}/`);
  }

  // Calls
  async getCalls(params?: { page?: number; status?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.status) query.set('status', params.status);
    const queryStr = query.toString() ? `?${query.toString()}` : '';
    return this.get<PaginatedResponse<any>>(`/calls/${queryStr}`);
  }

  async getCall(id: string) {
    return this.get<any>(`/calls/${id}/`);
  }

  // Bookings
  async getBookings(params?: { page?: number; status?: string; date?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.status) query.set('status', params.status);
    if (params?.date) query.set('date', params.date);
    const queryStr = query.toString() ? `?${query.toString()}` : '';
    return this.get<PaginatedResponse<any>>(`/bookings/${queryStr}`);
  }

  async createBooking(data: any) {
    return this.post<any>('/bookings/', data);
  }

  async approveBooking(id: string) {
    return this.post<any>(`/bookings/${id}/approve/`);
  }

  async rejectBooking(id: string, reason?: string) {
    return this.post<any>(`/bookings/${id}/reject/`, { reason });
  }

  // Analytics
  async getDashboardOverview() {
    return this.get<any>('/analytics/dashboard/overview/');
  }

  async getKPIs() {
    return this.get<any>('/analytics/dashboard/kpis/');
  }

  async getAgentPerformance(agentId?: string) {
    const endpoint = agentId 
      ? `/analytics/dashboard/agent-performance/?agent_id=${agentId}`
      : '/analytics/dashboard/agent-performance/';
    return this.get<any>(endpoint);
  }

  async getNocLiveDashboard(lookbackMinutes = 60) {
    return this.get<any>(`/analytics/dashboard/noc-live/?lookback_minutes=${lookbackMinutes}`);
  }

  async getNocAlertPolicies(lookbackMinutes = 60) {
    return this.get<any>(`/analytics/dashboard/alert-policies/?lookback_minutes=${lookbackMinutes}`);
  }

  async getCallTimeline(callId: string) {
    return this.get<any>(`/calls/${callId}/timeline/`);
  }

  async appendCallTimelineEvent(callId: string, payload: any) {
    return this.post<any>(`/calls/${callId}/timeline_event/`, payload);
  }

  async drainWorkers(enabled = true, ttlSeconds = 900, reason = '') {
    return this.post<any>('/calls/support/drain-workers/', {
      enabled,
      ttl_seconds: ttlSeconds,
      reason,
    });
  }

  async safeSessionHandoff(callId: string, payload: { handoff_target?: string; reason?: string; notes?: string }) {
    return this.post<any>(`/calls/${callId}/support/safe-handoff/`, payload);
  }

  // Billing
  async getSubscription() {
    return this.get<any>('/billing/subscriptions/current/');
  }

  async getPlans() {
    return this.get<any[]>('/billing/plans/');
  }

  async getUsage() {
    return this.get<any>('/billing/subscriptions/usage/');
  }

  async getTransactions(page = 1) {
    return this.get<PaginatedResponse<any>>(`/billing/transactions/?page=${page}`);
  }

  // User Profile
  async getProfile() {
    return this.get<any>('/auth/me/');
  }

  async updateProfile(data: any) {
    return this.patch<any>('/auth/me/', data);
  }

  // Notifications
  async getNotifications(page = 1) {
    return this.get<PaginatedResponse<any>>(`/notifications/?page=${page}`);
  }

  async markNotificationRead(id: string) {
    return this.post<any>(`/notifications/${id}/read/`);
  }

  async markAllNotificationsRead() {
    return this.post<any>('/notifications/read-all/');
  }
}

// =============================================================================
// Export Singleton Instance
// =============================================================================

export const api = new ApiClient(API_BASE);

// Also export the class for custom instances
export { ApiClient };

// =============================================================================
// React Query Helpers
// =============================================================================

/**
 * Query keys for React Query
 */
export const queryKeys = {
  agents: ['agents'] as const,
  agent: (id: string) => ['agents', id] as const,
  calls: (params?: any) => ['calls', params] as const,
  call: (id: string) => ['calls', id] as const,
  bookings: (params?: any) => ['bookings', params] as const,
  booking: (id: string) => ['bookings', id] as const,
  dashboard: ['analytics', 'dashboard'] as const,
  kpis: ['analytics', 'kpis'] as const,
  agentPerformance: (agentId?: string) => ['analytics', 'agent-performance', agentId] as const,
  subscription: ['billing', 'subscription'] as const,
  plans: ['billing', 'plans'] as const,
  usage: ['billing', 'usage'] as const,
  transactions: (page: number) => ['billing', 'transactions', page] as const,
  profile: ['auth', 'profile'] as const,
  notifications: (page: number) => ['notifications', page] as const,
};
