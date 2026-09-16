import { z } from 'zod';

export const DashboardKPISchema = z.object({
    title: z.string(),
    value: z.number(),
    previous_value: z.number(),
    change_percentage: z.number(),
    trend: z.enum(['up', 'down', 'stable']),
    sparkline: z.array(z.number()),
});

export const ActivityItemSchema = z.object({
    id: z.string(),
    type: z.string().optional(),
    activity_type: z.string().optional(),
    title: z.string(),
    description: z.string().optional().or(z.literal('')),
    timestamp: z.string().optional(),
    created_at: z.string().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
});

export const RevenueDataSchema = z.object({
    total: z.union([z.number(), z.string()]).transform(v => typeof v === 'string' ? parseFloat(v) || 0 : v).optional(),
    total_revenue: z.union([z.number(), z.string()]).transform(v => typeof v === 'string' ? parseFloat(v) || 0 : v).optional(),
    currency: z.string().default('USD'),
    by_day: z.record(z.string(), z.any()).optional(),
    growth_percentage: z.union([z.number(), z.string()]).transform(v => typeof v === 'string' ? parseFloat(v) || 0 : v).optional(),
    profit_margin: z.union([z.number(), z.string()]).transform(v => typeof v === 'string' ? parseFloat(v) || 0 : v).optional(),
});

export const DashboardMetricsSchema = z.object({
    total_calls: z.number(),
    total_bookings: z.number(),
    total_revenue: z.union([z.number(), z.string()]).transform(v => typeof v === 'string' ? parseFloat(v) : v),
    avg_call_duration: z.number(),
    success_rate: z.number().optional(),
    call_conversion_rate: z.number().optional(),
    booking_conversion_rate: z.number().optional(),
});

export const SLAMetricSchema = z.object({
    id: z.string(),
    metric_type: z.enum(['response_time', 'satisfaction', 'conversion', 'uptime']),
    actual_value: z.number(),
    target_value: z.number(),
    unit: z.string(),
    status: z.enum(['healthy', 'warning', 'critical']).optional(),
    previous_value: z.number(),
    trend_percentage: z.number().optional(),
    impact_description: z.string().nullable().optional().or(z.literal('')),
    data_points_count: z.number(),
    date: z.string(),
});

export const InsightSchema = z.object({
    id: z.string(),
    type: z.enum(['performance', 'revenue', 'customer', 'agent', 'growth', 'warning', 'opportunity', 'trend', 'recommendation', 'anomaly']),
    priority: z.enum(['critical', 'high', 'medium', 'low']),
    title: z.string(),
    description: z.string(),
    suggested_action: z.string().optional().or(z.literal('')),
    suggested_actions: z.array(z.string()).optional(),
    metrics: z.object({
        calls: z.string().optional(),
        bookings: z.string().optional(),
        revenue: z.string().optional(),
    }).optional(),
    is_read: z.boolean(),
    is_actioned: z.boolean(),
    created_at: z.string(),
});

export const NotificationItemSchema = z.object({
    id: z.string(),
    type: z.enum(['call', 'booking', 'cancellation', 'insight', 'alert', 'milestone', 'agent_update', 'system', 'agent']),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    title: z.string(),
    message: z.string(),
    action_url: z.string().nullable().optional().or(z.literal('')),
    action_label: z.string().nullable().optional().or(z.literal('')),
    icon: z.string().nullable().optional().or(z.literal('')),
    is_read: z.boolean(),
    is_dismissed: z.boolean(),
    created_at: z.string(),
});

export const UserProfileSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    first_name: z.string().optional().or(z.literal('')),
    last_name: z.string().optional().or(z.literal('')),
    business_name: z.string().optional().or(z.literal('')),
    business_type: z.string().optional().or(z.literal('')),
    phone_number: z.string().optional().or(z.literal('')),
});

export const DashboardOverviewSchema = z.object({
    metrics: DashboardMetricsSchema,
    insights: z.array(InsightSchema).optional(),
    recent_insights: z.array(InsightSchema).optional(),
    activity: z.array(ActivityItemSchema).optional(),
    recent_activity: z.array(ActivityItemSchema).optional(),
    revenue: RevenueDataSchema,
});
