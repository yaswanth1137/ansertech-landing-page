import { z } from 'zod';

export const PaymentPlanSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional().or(z.literal('')),
    amount: z.union([z.number(), z.string()]).transform(v => typeof v === 'string' ? parseFloat(v) || 0 : v),
    currency: z.string().default('INR'),
    billing_cycle: z.enum(['monthly', 'quarterly', 'yearly', 'one_time']),
    included_minutes: z.number(),
    included_agents: z.number(),
    included_bookings: z.number(),
    features: z.record(z.string(), z.any()).default({}),
    is_custom: z.boolean(),
    customer_email: z.string().nullable().optional(),
    is_active: z.boolean(),
    created_at: z.string(),
});

export const SubscriptionSchema = z.object({
    id: z.string(),
    plan: z.string(),
    plan_name: z.string(),
    plan_amount: z.union([z.number(), z.string()]).transform(v => typeof v === 'string' ? parseFloat(v) || 0 : v),
    plan_features: z.record(z.string(), z.any()).optional().default({}),
    status: z.enum(['created', 'authenticated', 'active', 'pending', 'halted', 'cancelled', 'completed', 'expired']),
    start_date: z.string().nullable().optional(),
    end_date: z.string().nullable().optional(),
    current_period_start: z.string().nullable().optional(),
    current_period_end: z.string().nullable().optional(),
    minutes_used: z.number(),
    bookings_used: z.number(),
    minutes_remaining: z.number(),
    bookings_remaining: z.number(),
    calls_used_this_period: z.number().optional().default(0),
    calls_remaining: z.number().optional().default(0),
    total_calls_remaining: z.number().optional().default(0),
    estimated_cost_this_period: z.union([z.number(), z.string()]).transform(v => typeof v === 'string' ? parseFloat(v) || 0 : v).optional().default(0),
    postpaid_enabled: z.boolean().optional().default(false),
    postpaid_enabled_at: z.string().nullable().optional(),
    overage_calls_count: z.number().optional().default(0),
    overage_amount_this_period: z.number().optional().default(0),
    total_count: z.number(),
    paid_count: z.number(),
    created_at: z.string(),
    is_cancel_scheduled: z.boolean().optional().default(false),
    cancel_at_period_end: z.boolean().optional().default(false),
    scheduled_cancel_at: z.string().nullable().optional(),
    allowed_languages: z.array(z.string()).optional().default([]),
});

export const PaymentSchema = z.object({
    id: z.string(),
    razorpay_payment_id: z.string(),
    amount: z.union([z.number(), z.string()]).transform(v => typeof v === 'string' ? parseFloat(v) || 0 : v),
    currency: z.string().default('INR'),
    status: z.enum(['created', 'authorized', 'captured', 'refunded', 'failed']),
    method: z.string().optional().or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
    created_at: z.string(),
});

export const InvoiceSchema = z.object({
    id: z.string(),
    invoice_number: z.string(),
    payment_id: z.string(),
    subtotal: z.union([z.number(), z.string()]).transform(v => typeof v === 'string' ? parseFloat(v) || 0 : v),
    tax_amount: z.union([z.number(), z.string()]).transform(v => typeof v === 'string' ? parseFloat(v) || 0 : v),
    total: z.union([z.number(), z.string()]).transform(v => typeof v === 'string' ? parseFloat(v) || 0 : v),
    gst_number: z.string().optional().or(z.literal('')),
    pdf_url: z.string().optional().or(z.literal('')),
    billing_name: z.string().optional().or(z.literal('')),
    billing_address: z.string().optional().or(z.literal('')),
    created_at: z.string(),
});

export const SubscriptionUsageSchema = z.object({
    plan: z.string(),
    minutes: z.object({
        used: z.number(),
        included: z.number(),
        remaining: z.number(),
    }),
    calls: z.object({
        used: z.number(),
        remaining: z.number(),
        usage_percentage: z.number(),
        alert: z.boolean(),
    }).optional(),
    bookings: z.object({
        used: z.number(),
        included: z.number(),
        remaining: z.number(),
    }),
    agents: z.object({
        used: z.number(),
        included: z.number(),
    }),
    languages: z.object({
        allowed: z.array(z.string()),
    }).optional().default({ allowed: [] }),
    postpaid_enabled: z.boolean().optional().default(false),
    overage_calls_count: z.number().optional().default(0),
    overage_amount_this_period: z.number().optional().default(0),
    cost: z.object({
        estimated_this_period: z.number(),
        plan_amount: z.number(),
        cost_breakdown: z.record(z.string(), z.any()),
    }).optional(),
    billing_cycle: z.object({
        start: z.string().nullable(),
        end: z.string().nullable(),
    }),
});
