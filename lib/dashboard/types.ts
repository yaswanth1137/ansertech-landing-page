// TypeScript types for dashboard data structures

export type AgentType = 'VOICEPIXEL' | 'BOOKPIXEL' | 'INSIGHTPIXEL' | 'CONTEXIA';
export type AgentStatus = 'active' | 'paused' | 'offline' | 'error';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type ActivityType = 'call' | 'booking' | 'agent_status' | 'system' | 'insight';

export interface Agent {
    id: string;
    name: string;
    type: AgentType;
    status: AgentStatus;
    description: string;
    createdAt: Date;
    lastActive: Date;
    metrics: {
        totalCalls?: number;
        successRate?: number;
        totalBookings?: number;
        avgResponseTime?: number;
        activeCampaigns?: number;
        insights?: number;
    };
    settings: {
        schedule: {
            enabled: boolean;
            timezone: string;
            hours: string;
        };
        integrations: string[];
        autoRespond: boolean;
    };
}

export interface Booking {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceType: string;
    appointmentDate: Date;
    duration: number; // in minutes
    status: BookingStatus;
    notes?: string;
    agentId: string;
    createdAt: Date;
    updatedAt: Date;
    specialRequests?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    businessName: string;
    businessType: string;
    avatar?: string;
    role: 'owner' | 'admin' | 'manager';
    joinedAt: Date;
    subscription: {
        plan: 'free' | 'starter' | 'professional' | 'enterprise';
        status: 'active' | 'trial' | 'expired';
        expiresAt?: Date;
    };
}

export interface AnalyticsMetrics {
    totalCalls: number;
    totalCallsTrend: number; // percentage change
    bookingsThisMonth: number;
    bookingsTrend: number;
    activeAgents: number;
    satisfactionRate: number;
    satisfactionTrend: number;
    conversionRate: number;
    conversionTrend: number;
}

export interface ActivityItem {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    timestamp: Date;
    icon?: string;
    metadata?: Record<string, unknown>;
}

export interface ChartDataPoint {
    label: string;
    value: number;
    color?: string;
}
