export interface PaymentPlan {
    id: string;
    name: string;
    description?: string;
    amount: number;
    currency: string;
    billing_cycle: 'monthly' | 'quarterly' | 'yearly' | 'one_time';
    included_minutes: number;
    included_agents: number;
    included_bookings: number;
    features: Record<string, any>;
    is_custom: boolean;
    customer_email?: string | null;
    is_active: boolean;
    created_at: string;
}

export interface Subscription {
    id: string;
    plan: string;
    plan_name: string;
    plan_amount: number;
    plan_features?: Record<string, any>;
    status: 'created' | 'authenticated' | 'active' | 'pending' | 'halted' | 'cancelled' | 'completed' | 'expired';
    start_date?: string | null;
    end_date?: string | null;
    current_period_start?: string | null;
    current_period_end?: string | null;
    minutes_used: number;
    bookings_used: number;
    minutes_remaining: number;
    bookings_remaining: number;
    calls_used_this_period?: number;
    calls_remaining?: number;
    total_calls_remaining?: number;
    estimated_cost_this_period?: number;
    postpaid_enabled?: boolean;
    postpaid_enabled_at?: string | null;
    overage_calls_count?: number;
    overage_amount_this_period?: number;
    total_count: number;
    paid_count: number;
    created_at: string;
    is_cancel_scheduled?: boolean;
    cancel_at_period_end?: boolean;
    scheduled_cancel_at?: string | null;
    allowed_languages?: string[];
}

export interface Payment {
    id: string;
    razorpay_payment_id: string;
    amount: number;
    currency: string;
    status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
    method: string;
    description: string;
    created_at: string;
}

export interface Invoice {
    id: string;
    invoice_number: string;
    payment_id: string;
    subtotal: number;
    tax_amount: number;
    total: number;
    gst_number: string;
    pdf_url: string;
    billing_name: string;
    billing_address: string;
    created_at: string;
}

export interface SubscriptionUsage {
    plan: string;
    minutes: {
        used: number;
        included: number;
        remaining: number;
    };
    calls?: {
        used: number;
        remaining: number;
        usage_percentage: number;
        alert: boolean;
    };
    bookings: {
        used: number;
        included: number;
        remaining: number;
    };
    agents: {
        used: number;
        included: number;
    };
    languages: {
        allowed: string[];
    };
    postpaid_enabled: boolean;
    overage_calls_count: number;
    overage_amount_this_period: number;
    cost?: {
        estimated_this_period: number;
        plan_amount: number;
        cost_breakdown: Record<string, any>;
    };
    billing_cycle: {
        start: string | null;
        end: string | null;
    };
}

export interface SubscribeResponse {
    subscription: Subscription;
    /** null for zero-cost plans (e.g. Free Trial) — no payment required */
    razorpay: {
        subscription_id: string;
        short_url?: string;
        key_id: string;
    } | null;
}
