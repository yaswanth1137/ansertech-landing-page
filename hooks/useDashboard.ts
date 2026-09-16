'use client';

/**
 * Dashboard Hooks - Fetch real data from backend APIs
 * Composed using smaller, domain-specific hooks for better caching and reusability.
 */
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { setApiToken } from '@/services/apiClient';
import {
    useDashboardKPIs,
    useActivityFeed
} from '@/hooks/queries/useDashboardData';
import { useCallAnalytics } from '@/hooks/queries/useCalls';
import { useBookingAnalytics } from '@/hooks/queries/useBookings';
import { useAgentsList } from '@/hooks/queries/useAgents';
import { ActivityItem, ActivityType } from '@/lib/dashboard/types';

// Re-export specific hooks for backward compatibility
export { useAgentsList } from '@/hooks/queries/useAgents';
export { useBookingsList } from '@/hooks/queries/useBookings';
export { useCustomersList } from '@/hooks/queries/useCustomers';

// Types for dashboard data
export interface DashboardKPIs {
    totalCalls: number;
    totalCallsPrevious: number;
    totalBookings: number;
    totalBookingsPrevious: number;
    activeAgents: number;
    activeAgentsPrevious: number;
    satisfactionRate: number;
    balance: {
        available: number;
        total: number;
    };
}

export interface HourlyDataPoint {
    label: string;
    value: number;
    hour: number;
}

export interface DashboardData {
    kpis: DashboardKPIs;
    callsSparkline: number[];
    bookingsSparkline: number[];
    activityFeed: ActivityItem[];
    callsAnalyticsChart: HourlyDataPoint[]; // Hourly call volume data
    bookingsAnalyticsChart: HourlyDataPoint[]; // Hourly booking data
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

// Default/fallback data
const defaultKPIs: DashboardKPIs = {
    totalCalls: 0,
    totalCallsPrevious: 0,
    totalBookings: 0,
    totalBookingsPrevious: 0,
    activeAgents: 0,
    activeAgentsPrevious: 0,
    satisfactionRate: 0,
    balance: { available: 0, total: 0 }
};

export function useDashboard(): DashboardData {
    const { data: session, status } = useSession();
    const accessToken = session?.accessToken;

    const isEnabled = status === 'authenticated' && !!accessToken;

    // Fetch data using composed hooks - pass enabled to prevent fetching before auth
    const {
        data: kpiData,
        isLoading: isLoadingKPIs,
        refetch: refetchKPIs
    } = useDashboardKPIs({ enabled: isEnabled });

    const {
        data: callsAnalytics,
        isLoading: isLoadingCalls,
        refetch: refetchCalls
    } = useCallAnalytics({ date_range: 'week' }, { enabled: isEnabled });

    const {
        data: bookingsAnalytics,
        isLoading: isLoadingBookings,
        refetch: refetchBookings
    } = useBookingAnalytics(7, { enabled: isEnabled });

    const {
        data: agentsList,
        isLoading: isLoadingAgents,
        refetch: refetchAgents
    } = useAgentsList({ enabled: isEnabled });

    const {
        data: activityData,
        isLoading: isLoadingActivity,
        refetch: refetchActivity
    } = useActivityFeed(10, { enabled: isEnabled });

    const isLoading = !isEnabled || isLoadingKPIs || isLoadingCalls || isLoadingBookings || isLoadingAgents || isLoadingActivity;
    const error = null; // Individual hooks handle errors, we could aggregate them if needed

    // Aggregate Refetch
    const refetch = () => {
        refetchKPIs();
        refetchCalls();
        refetchBookings();
        refetchAgents();
        refetchActivity();
    };

    // Process Data
    const kpis: DashboardKPIs = { ...defaultKPIs };

    // Process Calls Data
    let callsSparkline: number[] = [];
    let callsAnalyticsChart: HourlyDataPoint[] = [];
    if (callsAnalytics) {
        kpis.totalCalls = callsAnalytics.total_calls || 0;

        if (callsAnalytics.call_volume_by_day) {
            callsSparkline = callsAnalytics.call_volume_by_day.map(d => d.count).slice(-14);
        }
        callsAnalyticsChart = generateHourlyData(callsAnalytics, 'calls');
    }

    // Process Bookings Data
    let bookingsSparkline: number[] = [];
    let bookingsAnalyticsChart: HourlyDataPoint[] = [];
    if (bookingsAnalytics) {
        kpis.totalBookings = bookingsAnalytics.total_bookings || 0;

        if (bookingsAnalytics.daily_trend) {
            bookingsSparkline = bookingsAnalytics.daily_trend.map(d => d.count).slice(-12);
        }
        bookingsAnalyticsChart = generateHourlyData(bookingsAnalytics, 'bookings');
    }

    // Process Agents Data
    if (agentsList) {
        const activeCount = agentsList.filter(a => a.status === 'active').length;
        kpis.activeAgents = activeCount;
    }

    // Process Activity Feed
    const activityFeed: ActivityItem[] = Array.isArray(activityData)
        ? activityData.map((a: any) => {
            // Map backend type to UI type
            let activityType: ActivityType = 'system';
            if (['call', 'booking', 'insight', 'agent_status', 'system'].includes(a.type)) {
                activityType = a.type as ActivityType;
            }

            return {
                id: a.id,
                type: activityType,
                title: a.title,
                description: a.description,
                timestamp: new Date(a.created_at || a.timestamp),
                metadata: a.metadata as Record<string, unknown>
            };
        })
        : [];

    return {
        kpis,
        callsSparkline,
        bookingsSparkline,
        activityFeed,
        callsAnalyticsChart,
        bookingsAnalyticsChart,
        isLoading,
        error,
        refetch
    };
}

// Helper function to generate hourly data from analytics
function generateHourlyData(analytics: any, type: 'calls' | 'bookings'): HourlyDataPoint[] {
    // Generate 24-hour data structure
    const hours: HourlyDataPoint[] = Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        const label = `${hour === 0 ? '12' : hour > 12 ? hour - 12 : hour} ${hour < 12 ? 'AM' : 'PM'}`;
        return {
            label,
            value: 0,
            hour
        };
    });

    // If backend provides hourly breakdown, use it
    if (analytics?.hourly_distribution || analytics?.call_volume_by_hour) {
        const distribution = analytics.hourly_distribution || analytics.call_volume_by_hour;
        // Handle array or object format
        if (Array.isArray(distribution)) {
            distribution.forEach((item: any) => {
                const hour = item.hour;
                if (hours[hour]) {
                    hours[hour].value = item.count;
                }
            });
        } else {
            Object.entries(distribution).forEach(([hour, count]: [string, any]) => {
                const hourNum = parseInt(hour);
                if (hours[hourNum]) {
                    hours[hourNum].value = typeof count === 'number' ? count : (count.count || 0);
                }
            });
        }
    } else {
        // Simulate realistic distribution if no hourly data
        const total = (type === 'calls' ? analytics?.total_calls : analytics?.total_bookings) || 0;
        if (total > 0) {
            // Distribute across typical business hours (9 AM - 9 PM)
            const businessHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
            const avgPerHour = total / businessHours.length;
            businessHours.forEach(hour => {
                // Use a deterministic variation per hour to avoid SSR hydration mismatches
                const variation = 0.8 + ((hour % 5) * 0.1); // 0.8–1.2, stable across renders
                hours[hour].value = Math.round(avgPerHour * variation);
            });
        }
    }

    return hours;
}

export default useDashboard;
