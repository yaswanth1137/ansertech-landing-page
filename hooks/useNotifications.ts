'use client';

import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { dashboardService } from '@/services/dashboardService';
import { createNotificationWebSocket } from '@/services/apiClient';
import { NotificationItem } from '@/types/models/dashboard';

export type Notification = NotificationItem;

/**
 * useNotifications — primary hook for the notification system.
 *
 * Strategy:
 *  1. Fetch existing notifications via REST on mount.
 *  2. Open a WebSocket to `ws/notifications/` for real-time push.
 *  3. When a WS message arrives, invalidate the query so React-Query
 *     refetches the latest list (single source of truth = DB).
 *  4. Falls back to 30-second REST polling if WebSocket is unavailable.
 */
export function useNotifications(includeRead = false) {
    const { data: session, status } = useSession();
    const isEnabled = status === 'authenticated' && !!session?.accessToken;
    const queryClient = useQueryClient();

    // Track WS connection status to toggle REST fallback polling
    const wsConnectedRef = useRef(false);

    // ── Queries ────────────────────────────────────────────
    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['notifications', { includeRead }],
        queryFn: () => dashboardService.getNotifications(!includeRead),
        // Only poll when WS is disconnected (fallback)
        refetchInterval: isEnabled
            ? () => (wsConnectedRef.current ? false : 30_000)
            : false,
        refetchOnWindowFocus: true,
        enabled: isEnabled,
    });

    // Derive unread count from the fetched list — eliminates a second network call
    const unreadCount = (data?.results as Notification[] | undefined)?.filter(
        (n) => !n.is_read
    ).length ?? 0;

    // ── WebSocket real-time push ───────────────────────────
    useEffect(() => {
        if (!isEnabled || !session?.accessToken) return;

        const ws = createNotificationWebSocket();
        ws.connect(session.accessToken);

        const handleConnected = () => {
            wsConnectedRef.current = true;
        };
        const handleDisconnected = () => {
            wsConnectedRef.current = false;
        };
        const handleNewNotification = () => {
            // Invalidate the query so React-Query refetches from the DB
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        };
        const handleNotificationRead = () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        };

        ws.on('connected', handleConnected);
        ws.on('disconnected', handleDisconnected);
        ws.on('notification', handleNewNotification);
        ws.on('notification_read', handleNotificationRead);

        return () => {
            ws.off('connected', handleConnected);
            ws.off('disconnected', handleDisconnected);
            ws.off('notification', handleNewNotification);
            ws.off('notification_read', handleNotificationRead);
            ws.disconnect();
            wsConnectedRef.current = false;
        };
    }, [isEnabled, session?.accessToken, queryClient]);

    // ── Mutations ──────────────────────────────────────────
    const markReadMutation = useMutation({
        mutationFn: (id: string) => dashboardService.markNotificationRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const markAllReadMutation = useMutation({
        mutationFn: () => dashboardService.markAllNotificationsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const dismissMutation = useMutation({
        mutationFn: (id: string) => dashboardService.dismissNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const markAsRead = async (notificationId: string) => {
        await markReadMutation.mutateAsync(notificationId);
    };

    const markAllAsRead = async () => {
        await markAllReadMutation.mutateAsync();
    };

    const dismiss = async (notificationId: string) => {
        await dismissMutation.mutateAsync(notificationId);
    };

    return {
        notifications: data?.results || [],
        unreadCount,
        isLoading,
        error: error ? 'Failed to load notifications' : null,
        refresh: refetch,
        markAsRead,
        markAllAsRead,
        dismiss,
    };
}

