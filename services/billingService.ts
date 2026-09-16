import { api } from './apiClient';
import { validateResponse } from './validation';
import {
    PaymentPlanSchema,
    SubscriptionSchema,
    PaymentSchema,
    InvoiceSchema,
    SubscriptionUsageSchema,
} from '@/lib/validations/billing';
import {
    PaymentPlan,
    Subscription,
    Payment,
    Invoice,
    SubscriptionUsage,
    SubscribeResponse,
} from '@/types/models/billing';

export const billingService = {
    // ── Plans ──────────────────────────────────────────────
    getPlans: async () => {
        const response = await api.get<{ results: PaymentPlan[] } | PaymentPlan[]>('/billing/plans/');
        const data = Array.isArray(response.data) ? response.data : response.data.results;
        return validateResponse(PaymentPlanSchema.array(), data);
    },

    getPublicPlans: async () => {
        const response = await api.get<PaymentPlan[]>('/billing/plans/public/');
        const data = Array.isArray(response.data) ? response.data : (response.data as any).results ?? response.data;
        return validateResponse(PaymentPlanSchema.array(), data);
    },

    // ── Subscription ──────────────────────────────────────
    getCurrentSubscription: async () => {
        const response = await api.get<{ subscription: Subscription | null }>('/billing/subscriptions/current/');
        if (!response.data || !response.data.subscription) return null;
        return validateResponse(SubscriptionSchema, response.data.subscription ?? response.data);
    },

    subscribe: async (planId: string): Promise<SubscribeResponse> => {
        const response = await api.post<SubscribeResponse>('/billing/subscriptions/subscribe/', { plan_id: planId });
        return response.data;
    },

    verifyPayment: async (data: {
        razorpay_payment_id: string;
        razorpay_subscription_id?: string;
        razorpay_order_id?: string;
        razorpay_signature: string;
    }) => {
        const response = await api.post('/billing/subscriptions/verify/', data);
        return response.data;
    },

    cancelSubscription: async (id: string) => {
        const response = await api.post(`/billing/subscriptions/${id}/cancel/`);
        return response.data;
    },

    pauseSubscription: async (id: string) => {
        const response = await api.post(`/billing/subscriptions/${id}/pause/`);
        return response.data;
    },

    resumeSubscription: async (id: string) => {
        const response = await api.post(`/billing/subscriptions/${id}/resume/`);
        return response.data;
    },

    getUsage: async () => {
        const response = await api.get<SubscriptionUsage>('/billing/subscriptions/usage/');
        return validateResponse(SubscriptionUsageSchema, response.data);
    },

    // ── Payments ──────────────────────────────────────────
    getPayments: async () => {
        const response = await api.get<{ results: Payment[] } | Payment[]>('/billing/payments/');
        const data = Array.isArray(response.data) ? response.data : response.data.results;
        return validateResponse(PaymentSchema.array(), data);
    },

    // ── Invoices ──────────────────────────────────────────
    getInvoices: async () => {
        const response = await api.get<{ results: Invoice[] } | Invoice[]>('/billing/invoices/');
        const data = Array.isArray(response.data) ? response.data : response.data.results;
        return validateResponse(InvoiceSchema.array(), data);
    },

    downloadInvoice: async (id: string) => {
        const response = await api.get<{ pdf_url: string }>(`/billing/invoices/${id}/download/`);
        return response.data;
    },

    // ── Postpaid overage ────────────────────────────────────
    togglePostpaid: async (enabled: boolean) => {
        const response = await api.post<{ postpaid_enabled: boolean; postpaid_enabled_at: string | null }>(
            '/billing/subscriptions/postpaid/toggle/',
            { enabled },
        );
        return response.data;
    },
};
