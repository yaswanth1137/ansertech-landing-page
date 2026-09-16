export interface Booking {
    id: string;
    customer_name: string;
    customer_phone: string;
    customer_email?: string | null;
    booking_date: string;
    booking_time: string;
    party_size: number;
    status: 'requested' | 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled' | 'no_show';
    special_requests?: string | null;
    occasion?: string | null;
    dietary_requirements?: string | null;
    duration_minutes?: number | null;
    notes?: string | null;
    source?: string | null;
    confirmation_code?: string | null;
    confirmed_at?: string | null;
    cancelled_at?: string | null;
    cancellation_reason?: string | null;
    checked_in_at?: string | null;
    completed_at?: string | null;
    google_calendar_event_id?: string | null;
    confirmation_sent?: boolean | null;
    reminder_sent?: boolean | null;
    estimated_revenue?: number | string | null;
    actual_revenue?: number | string | null;
    metadata?: Record<string, unknown> | null;
    agent?: string | null;
    customer?: string | null;
    customer_name_display?: string | null;
    is_upcoming?: boolean | null;
    created_at?: string;
    updated_at?: string;
}

export interface BookingAnalytics {
    total_bookings: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    no_shows: number;
    pending: number;
    avg_party_size: number;
    total_revenue: number;
    by_source: Record<string, number>;
    daily_trend?: { date: string; count: number }[];
    hourly_distribution?: Record<string, number>;
    conversion_rate?: number;
}

export interface CreateBookingRequest {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    booking_date: string;
    booking_time: string;
    party_size: number;
    special_requests?: string;
    notes?: string;
}

export interface UpdateBookingRequest {
    customer_name?: string;
    customer_phone?: string;
    booking_date?: string;
    booking_time?: string;
    party_size?: number;
    status?: Booking['status'];
    special_requests?: string;
    notes?: string;
}
