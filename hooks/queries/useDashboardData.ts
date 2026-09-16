import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { dashboardService } from '@/services';

export const dashboardKeys = {
    all: ['dashboard'] as const,
    overview: (period?: string) => [...dashboardKeys.all, 'overview', period] as const,
    kpis: () => [...dashboardKeys.all, 'kpis'] as const,
    activity: (limit: number) => [...dashboardKeys.all, 'activity', limit] as const,
    insights: (params?: Record<string, any>) => [...dashboardKeys.all, 'insights', params] as const,
    sla: () => [...dashboardKeys.all, 'sla'] as const,
    notifications: (unread?: boolean) => [...dashboardKeys.all, 'notifications', unread] as const,
    unreadCount: () => [...dashboardKeys.all, 'notifications', 'count'] as const,
    user: () => ['user', 'profile'] as const,
};

export function useDashboardOverview(period?: string) {
    const { status, data: session } = useSession();
    const isEnabled = status === 'authenticated' && !!session?.accessToken;
    return useQuery({
        queryKey: dashboardKeys.overview(period),
        queryFn: () => dashboardService.getOverview(period),
        staleTime: 5 * 60 * 1000,
        enabled: isEnabled,
    });
}

export function useDashboardKPIs(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: dashboardKeys.kpis(),
        queryFn: () => dashboardService.getKPIs(),
        staleTime: 5 * 60 * 1000,
        enabled: options?.enabled ?? true,
    });
}

export function useActivityFeed(limit: number = 10, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: dashboardKeys.activity(limit),
        queryFn: () => dashboardService.getActivityFeed(limit),
        staleTime: 60 * 1000,
        enabled: options?.enabled ?? true,
    });
}

export function useInsights(params?: { priority?: string; unread?: boolean }) {
    const { status, data: session } = useSession();
    const isEnabled = status === 'authenticated' && !!session?.accessToken;
    return useQuery({
        queryKey: dashboardKeys.insights(params),
        queryFn: () => dashboardService.getInsights(params),
        staleTime: 5 * 60 * 1000,
        enabled: isEnabled,
    });
}

export function useMarkInsightRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => dashboardService.markInsightRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    });
}

export function useSLAMetrics() {
    const { status, data: session } = useSession();
    const isEnabled = status === 'authenticated' && !!session?.accessToken;
    return useQuery({
        queryKey: dashboardKeys.sla(),
        queryFn: () => dashboardService.getSLAMetrics(),
        staleTime: 10 * 60 * 1000,
        refetchInterval: isEnabled ? 30 * 1000 : false,
        refetchIntervalInBackground: false,
        enabled: isEnabled,
    });
}

export function useRefreshDashboard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => dashboardService.refreshDashboard(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    });
}

export function useUnreadNotificationsCount() {
    const { status, data: session } = useSession();
    const isEnabled = status === 'authenticated' && !!session?.accessToken;
    return useQuery({
        queryKey: dashboardKeys.unreadCount(),
        queryFn: () => dashboardService.getUnreadNotificationsCount(),
        refetchInterval: isEnabled ? 60 * 1000 : false,
        refetchIntervalInBackground: false,
        enabled: isEnabled,
    });
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => dashboardService.markNotificationRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dashboardKeys.notifications() });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.unreadCount() });
        },
    });
}

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => dashboardService.markAllNotificationsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dashboardKeys.notifications() });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.unreadCount() });
        },
    });
}

export function useDismissNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => dashboardService.dismissNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dashboardKeys.notifications() });
        },
    });
}

export function useUserProfile(options?: { enabled?: boolean }) {
    const { status, data: session } = useSession();
    const isAuthenticated = status === 'authenticated' && !!session?.accessToken;
    return useQuery({
        queryKey: dashboardKeys.user(),
        queryFn: () => dashboardService.getUserProfile(),
        staleTime: 60 * 60 * 1000, // 1 hour
        enabled: isAuthenticated && (options?.enabled ?? true),
    });
}

