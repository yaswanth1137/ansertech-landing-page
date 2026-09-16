export interface Customer {
    id: string;
    name: string;
    phone_number: string;
    email?: string | null;
    alternate_phone?: string | null;
    avatar?: string | null;
    language_preference?: string | null;
    special_requests?: string | null;
    dietary_restrictions?: any[] | null;
    total_bookings: number;
    completed_bookings: number;
    cancelled_bookings: number;
    no_shows: number;
    total_calls: number;
    total_spent: number | string;
    lifetime_value: number | string;
    average_party_size: number;
    first_visit_date?: string | null;
    last_visit_date?: string | null;
    is_vip: boolean;
    is_blacklisted: boolean;
    blacklist_reason?: string | null;
    is_repeat_customer?: boolean | null;
    status?: 'active' | 'new' | 'vip' | 'inactive' | null;
    satisfaction?: number | null;
    preferred_time?: string | null;
    favorite_service?: string | null;
    ai_summary?: string | null;
    insights?: string[] | null;
    notes?: string | null;
    tags?: string[] | null;
    preferences?: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

export interface CustomerBehavior {
    conversion_rate: number;
    cancellation_rate: number;
    no_show_rate: number;
    preferred_time: string | null;
    preferred_language?: string | null;
    sentiment_trend: 'improving' | 'stable' | 'declining' | null;
    avg_sentiment?: number | null;
    requires_strict_confirmation: boolean;
    prefers_fast_flow: boolean;
    has_price_sensitivity?: boolean | null;
    ai_notes?: string | null;
    last_analyzed?: string | null;
}

export interface CustomerInsights {
    customer: {
        id: string;
        name: string;
        phone: string;
        email?: string | null;
        is_vip: boolean;
        is_repeat: boolean;
        lifetime_value: number;
        first_visit?: string | null;
        last_visit?: string | null;
    };
    behavior?: CustomerBehavior;
    call_summary?: {
        total_calls: number;
        positive_calls: number;
        neutral_calls: number;
        negative_calls: number;
        avg_duration: number;
        most_common_intent?: string | null;
    };
    booking_patterns?: {
        by_day?: Record<string, number>;
        by_hour?: Record<string, number>;
        avg_party_size: number;
        most_booked_service?: string | null;
    };
    risk_assessment?: {
        level: 'low' | 'medium' | 'high';
        factors: string[];
    };
    recommendations: {
        type: string;
        title: string;
        description: string;
    }[];
}

export interface CreateCustomerRequest {
    name: string;
    phone: string;
    email?: string | null;
    notes?: string | null;
    tags?: string[] | null;
    preferences?: Record<string, any> | null;
}

export interface UpdateCustomerRequest {
    name?: string;
    phone?: string;
    email?: string | null;
    notes?: string | null;
    tags?: string[] | null;
    preferences?: Record<string, any> | null;
}
