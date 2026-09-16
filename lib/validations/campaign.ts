import { z } from 'zod';

export const CampaignContactSchema = z.object({
    id: z.string(),
    phone: z.string(),
    name: z.string().nullable().optional(),
    status: z.enum(['pending', 'calling', 'initiated', 'failed']),
    call: z.string().nullable().optional(),
    error: z.string().nullable().optional(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const CampaignSchema = z.object({
    id: z.string(),
    agent: z.string(),
    status: z.enum(['queued', 'running', 'completed', 'failed']),
    total_contacts: z.number(),
    completed_contacts: z.number(),
    failed_contacts: z.number(),
    progress_pct: z.number(),
    contacts: z.array(CampaignContactSchema),
    created_at: z.string(),
    started_at: z.string().nullable(),
    finished_at: z.string().nullable(),
});

export const OutboundCallResultSchema = z.object({
    call_id: z.string(),
    status: z.string(),
    message: z.string(),
});
