import { z } from 'zod';

export const CallSegmentSchema = z.object({
    speaker: z.enum(['agent', 'customer']),
    text: z.string(),
    timestamp: z.number(),
});

export const CallSchema = z.object({
    id: z.string(),
    direction: z.enum(['inbound', 'outbound', 'web']).nullable().optional(),
    agent: z.string().nullable().optional(),
    agent_name: z.string().nullable().optional(),
    business: z.string().nullable().optional(),
    business_name: z.string().nullable().optional(),
    from_number: z.string().nullable().optional(),
    to_number: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    outcome: z.string().nullable().optional(),
    duration: z.number().nullable().optional(),
    duration_formatted: z.string().nullable().optional(),
    customer_name: z.string().nullable().optional(),
    customer_phone: z.string().nullable().optional(),
    customer_email: z.string().nullable().optional(),
    sentiment: z.enum(['positive', 'neutral', 'negative']).nullable().optional(),
    sentiment_score: z.number().nullable().optional(),
    intent: z.string().nullable().optional(),
    recording_url: z.string().nullable().optional().or(z.literal('')),
    transcript: z.string().nullable().optional(),
    summary: z.string().nullable().optional(),
    action_items: z.array(z.string()).nullable().optional(),
    segments: z.array(CallSegmentSchema).nullable().optional(),
    metadata: z.record(z.string(), z.any()).nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
    started_at: z.string().nullable().optional(),
    ended_at: z.string().nullable().optional(),
    answered_at: z.string().nullable().optional(),
    ai_response_time: z.number().nullable().optional(),
    escalated_to_human: z.boolean().nullable().optional(),
    escalation_reason: z.string().nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().nullable().optional(),
});

export const CallsResponseSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(CallSchema),
    avg_duration: z.number().optional(),
    positive_rate: z.number().optional(),
    completed_count: z.number().optional(),
});

export const CallAnalyticsSchema = z.object({
    total_calls: z.number(),
    total_duration: z.number(),
    avg_duration: z.number(),
    call_volume_by_day: z.array(z.object({
        date: z.string(),
        count: z.number(),
    })),
    call_volume_by_hour: z.array(z.object({
        hour: z.number(),
        count: z.number(),
    })),
    sentiment_distribution: z.object({
        positive: z.number(),
        neutral: z.number(),
        negative: z.number(),
    }),
    outcome_distribution: z.record(z.string(), z.number()),
    top_agents: z.array(z.object({
        agent_id: z.string(),
        agent_name: z.string(),
        call_count: z.number(),
        avg_duration: z.number(),
        positive_rate: z.number(),
    })),
});
