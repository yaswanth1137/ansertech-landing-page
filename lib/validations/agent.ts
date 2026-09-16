import { z } from 'zod';

export const KnowledgeBaseItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    type: z.enum(['faq', 'document', 'url']),
    created_at: z.string(),
});

export const AgentKnowledgeBaseSchema = z.object({
    items: z.array(KnowledgeBaseItemSchema),
    last_updated: z.string().nullable().optional(),
});

export const AgentSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string().nullable().optional().default('general'),
    status: z.enum(['active', 'paused', 'inactive', 'training']).nullable().optional().default('inactive'),
    description: z.string().nullable().optional(),
    voice_id: z.string().nullable().optional(),
    voice_temperature: z.number().nullable().optional(),
    voice_speed: z.number().nullable().optional(),
    language: z.string().nullable().optional().default('en-IN'),
    phone_number: z.string().nullable().optional(),
    industry_template: z.string().nullable().optional(),
    config_answers: z.record(z.string(), z.unknown()).nullable().optional(),
    full_config: z.record(z.string(), z.unknown()).nullable().optional(),
    begin_message_variant: z.string().nullable().optional(),
    system_prompt: z.string().nullable().optional(),
    knowledge_base: z.any().nullable().optional(),
    temperature: z.number().nullable().optional().default(0.7),
    max_tokens: z.number().nullable().optional().default(1000),
    ai_model: z.string().nullable().optional(),
    schedule_enabled: z.boolean().nullable().optional(),
    schedule_timezone: z.string().nullable().optional(),
    schedule_hours: z.string().nullable().optional(),
    auto_respond: z.boolean().nullable().optional(),
    booking_enabled: z.boolean().nullable().optional(),
    escalation_enabled: z.boolean().nullable().optional(),
    escalation_phone: z.string().nullable().optional(),
    integrations: z.record(z.string(), z.unknown()).nullable().optional(),
    sync_status: z.enum(['pending','syncing','synced','failed','not_synced']).nullable().optional(),
    sync_error: z.string().nullable().optional(),
    ai_enhanced: z.boolean().nullable().optional(),
    enhancement_provider: z.string().nullable().optional(),
    effective_config: z.record(z.string(), z.unknown()).optional(),
    total_calls: z.number().nullable().optional().default(0),
    total_bookings: z.number().nullable().optional().default(0),
    success_rate: z.number().nullable().optional().default(0),
    avg_call_duration: z.number().nullable().optional().default(0),
    avg_response_time: z.number().nullable().optional().default(0),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
    last_active: z.string().nullable().optional(),
});

export const AgentStatsSchema = z.object({
    total_agents: z.number().default(0),
    active_agents: z.number().default(0),
    total_calls: z.number().default(0),
    total_bookings: z.number().default(0),
    avg_success_rate: z.number().default(0),
});

export const AgentCapacityItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    capacity_percentage: z.number().default(0),
    total_calls: z.number().default(0),
    success_rate: z.number().default(0),
    wait_time: z.string().nullable().optional(),
    performance: z.enum(['optimal', 'good', 'needs-attention']).nullable().optional(),
});

export const AgentCapacityResponseSchema = z.object({
    agents: z.array(AgentCapacityItemSchema).default([]),
    summary: z.object({
        total_agents: z.number().default(0),
        active_agents: z.number().default(0),
        avg_capacity: z.number().default(0),
    }).optional(),
});

/* ── Versioning & Cloning ─────────────────────────────────── */

export const AgentConfigVersionSchema = z.object({
    version_number: z.number(),
    change_summary: z.string(),
    created_by: z.string(),
    created_at: z.string(),
});

export const AgentVersionsResponseSchema = z.object({
    versions: z.array(AgentConfigVersionSchema).default([]),
    total: z.number().default(0),
});

export const RollbackResponseSchema = z.object({
    message: z.string(),
    config: z.record(z.string(), z.unknown()),
    agent: AgentSchema,
});

/* ── Knowledge Base Documents ─────────────────────────────── */

export const KnowledgeDocumentSchema = z.object({
    id: z.string(),
    name: z.string(),
    document_type: z.enum(['faq', 'menu', 'policy', 'brochure', 'guide', 'transcript', 'other']),
    file: z.string().nullable().optional(),
    file_size: z.number().default(0),
    mime_type: z.string().default(''),
    status: z.enum(['pending', 'processing', 'completed', 'failed']).default('pending'),
    processing_error: z.string().default(''),
    chunk_count: z.number().default(0),
    created_at: z.string(),
    updated_at: z.string(),
});

export const KnowledgeSearchResultSchema = z.object({
    id: z.string(),
    content: z.string(),
    chunk_index: z.number(),
    document_name: z.string(),
    document_id: z.string(),
    score: z.number(),
});

export const KnowledgeSearchResponseSchema = z.object({
    results: z.array(KnowledgeSearchResultSchema).default([]),
    query: z.string(),
    count: z.number().default(0),
});
