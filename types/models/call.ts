export interface CallSegment {
    speaker: 'agent' | 'customer';
    text: string;
    timestamp: number;
}

export interface Call {
    id: string;
    call_id?: string | null;
    direction?: 'inbound' | 'outbound' | 'web' | 'missed' | null;
    agent?: string | null;
    agent_name?: string | null;
    business?: string | null;
    business_name?: string | null;
    from_number?: string | null;
    to_number?: string | null;
    status?: string | null;
    outcome?: string | null;
    duration?: number | null;
    duration_formatted?: string | null;
    customer_name?: string | null;
    customer_phone?: string | null;
    customer_email?: string | null;
    sentiment?: 'positive' | 'neutral' | 'negative' | null;
    sentiment_score?: number | null;
    intent?: string | null;
    recording_url?: string | null;
    transcript?: string | null;
    summary?: string | null;
    action_items?: string[] | null;
    segments?: CallSegment[] | null;
    metadata?: Record<string, any> | null;
    tags?: string[] | null;
    started_at?: string | null;
    ended_at?: string | null;
    answered_at?: string | null;
    ai_response_time?: number | null;
    escalated_to_human?: boolean | null;
    escalation_reason?: string | null;
    created_at?: string;
    updated_at?: string | null;
}

export interface CallsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Call[];
    avg_duration?: number;
    positive_rate?: number;
    completed_count?: number;
}

export interface CallsQueryParams {
    search?: string;
    date_range?: 'today' | 'week' | 'month' | 'all';
    direction?: 'inbound' | 'outbound' | 'missed';
    agent?: string;
    business?: string;
    page?: number;
    page_size?: number;
}

export interface CallAnalytics {
    total_calls: number;
    total_duration: number;
    avg_duration: number;
    call_volume_by_day: Array<{
        date: string;
        count: number;
    }>;
    call_volume_by_hour: Array<{
        hour: number;
        count: number;
    }>;
    sentiment_distribution: {
        positive: number;
        neutral: number;
        negative: number;
    };
    outcome_distribution: Record<string, number>;
    top_agents: Array<{
        agent_id: string;
        agent_name: string;
        call_count: number;
        avg_duration: number;
        positive_rate: number;
    }>;
}

export interface AIAnalysisRequest {
    call_ids: string[];
    analysis_type: 'summary' | 'trends' | 'recommendations' | 'full';
}

export interface AIAnalysisResponse {
    analysis: string;
    key_insights: string[];
    recommendations: string[];
    sentiment_analysis: {
        overall: string;
        trends: string;
    };
}

export interface CallStats {
    today_calls: number;
    week_calls: number;
    month_calls: number;
    avg_duration: number;
    satisfaction_rate: number;
    conversion_rate: number;
}
