import { api } from './apiClient';
import { validateResponse } from './validation';
import {
    DashboardOverviewSchema,
    DashboardKPISchema,
    ActivityItemSchema,
    InsightSchema,
    SLAMetricSchema,
    NotificationItemSchema,
    UserProfileSchema
} from '@/lib/validations/dashboard';
import {
    DashboardKPI,
    ActivityItem,
    Insight,
    SLAMetric,
    NotificationItem,
    UserProfile,
    DashboardOverview
} from '@/types/models/dashboard';

export const dashboardService = {
    getOverview: async (period?: string) => {
        const response = await api.get<DashboardOverview>('/analytics/dashboard/overview/', { params: { period } });
        return validateResponse(DashboardOverviewSchema, response.data);
    },

    getKPIs: async () => {
        const response = await api.get<DashboardKPI[] | { results: DashboardKPI[] }>('/analytics/dashboard/kpis/');
        const data = Array.isArray(response.data) ? response.data : response.data.results;
        return validateResponse(DashboardKPISchema.array(), data);
    },

    getActivityFeed: async (limit: number = 10) => {
        const response = await api.get<{ results: ActivityItem[] } | ActivityItem[]>('/analytics/activity/', { params: { limit } });
        const data = 'results' in response.data ? response.data.results : response.data;
        return validateResponse(ActivityItemSchema.array(), data);
    },

    getInsights: async (params?: { priority?: string; unread?: boolean }) => {
        const response = await api.get<{ results: Insight[] } | Insight[]>('/analytics/insights/', { params });
        const data = 'results' in response.data ? response.data.results : response.data;
        return validateResponse(InsightSchema.array(), data);
    },

    markInsightRead: async (id: string) => {
        await api.post(`/analytics/insights/${id}/mark_read/`);
    },

    getSLAMetrics: async () => {
        const response = await api.get<{
            response_time: SLAMetric;
            satisfaction: SLAMetric;
            conversion: SLAMetric;
            uptime: SLAMetric;
        }>('/analytics/sla-metrics/');
        
        // Validate individual metrics if schema matches
        const res = response.data;
        return {
            response_time: validateResponse(SLAMetricSchema, res.response_time),
            satisfaction: validateResponse(SLAMetricSchema, res.satisfaction),
            conversion: validateResponse(SLAMetricSchema, res.conversion),
            uptime: validateResponse(SLAMetricSchema, res.uptime),
        };
    },

    refreshDashboard: async () => {
        const response = await api.post<{ status: string }>('/analytics/dashboard/refresh/');
        return response.data;
    },

    getNotifications: async (unread?: boolean) => {
        const response = await api.get<{ results: NotificationItem[]; count: number } | NotificationItem[]>('/notifications/', { params: { unread } });
        const data = Array.isArray(response.data) ? response.data : response.data.results;
        const count = Array.isArray(response.data) ? response.data.length : response.data.count;

        return {
            results: validateResponse(NotificationItemSchema.array(), data),
            count: count
        };
    },

    getUnreadNotificationsCount: async () => {
        const response = await api.get<{ unread_count: number }>('/notifications/unread_count/');
        return response.data;
    },

    markNotificationRead: async (id: string) => {
        await api.post(`/notifications/${id}/mark_read/`);
    },

    markAllNotificationsRead: async () => {
        await api.post('/notifications/mark_all_read/');
    },

    dismissNotification: async (id: string) => {
        await api.post(`/notifications/${id}/dismiss/`);
    },

    getUserProfile: async () => {
        const response = await api.get<UserProfile>('/users/me/');
        return validateResponse(UserProfileSchema, response.data);
    },
};
