export interface DashboardKPI {
    title: string;
    value: number;
    previous_value: number;
    change_percentage: number;
    trend: 'up' | 'down' | 'stable';
    sparkline: number[];
}

export interface ActivityItem {
    id: string;
    type?: string | null;
    activity_type?: string | null;
    title: string;
    description?: string | null;
    timestamp?: string | null;
    created_at?: string | null;
    metadata?: Record<string, any> | null;
    icon?: string | null;
    color?: string | null;
}

export interface RevenueData {
    total?: number | null;
    total_revenue?: number | null;
    currency: string;
    by_day?: Record<string, any> | null;
    growth_percentage?: number | null;
    profit_margin?: number | null;
}

export interface DashboardMetrics {
    total_calls: number;
    total_bookings: number;
    total_revenue: number;
    avg_call_duration: number;
    success_rate?: number | null;
    call_conversion_rate?: number | null;
    booking_conversion_rate?: number | null;
}

export interface SLAMetric {
    id: string;
    metric_type: 'response_time' | 'satisfaction' | 'conversion' | 'uptime';
    actual_value: number;
    target_value: number;
    unit: string;
    status?: 'healthy' | 'warning' | 'critical' | null;
    previous_value: number;
    trend_percentage?: number | null;
    impact_description?: string | null;
    data_points_count: number;
    date: string;
}

export interface Insight {
    id: string;
    type: 'performance' | 'revenue' | 'customer' | 'agent' | 'growth' | 'warning' | 'opportunity' | 'trend' | 'recommendation' | 'anomaly';
    priority: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    suggested_action?: string | null;
    suggested_actions?: string[] | null;
    metrics?: {
        calls?: string;
        bookings?: string;
        revenue?: string;
    };
    is_read: boolean;
    is_actioned: boolean;
    created_at: string;
}

export interface NotificationItem {
    id: string;
    type: 'call' | 'booking' | 'cancellation' | 'insight' | 'alert' | 'milestone' | 'agent_update' | 'system' | 'agent';
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    action_url?: string | null;
    action_label?: string | null;
    icon?: string | null;
    group_key?: string | null;
    is_read: boolean;
    is_dismissed: boolean;
    created_at: string;
}

export interface UserProfile {
    id: string;
    email: string;
    first_name?: string | null;
    last_name?: string | null;
    business_name?: string | null;
    business_type?: string | null;
    phone_number?: string | null;
}

export interface DashboardOverview {
    metrics: DashboardMetrics;
    insights?: Insight[] | null;
    recent_insights?: Insight[] | null;
    activity?: ActivityItem[] | null;
    recent_activity?: ActivityItem[] | null;
    revenue: RevenueData;
}
