'use client';

import { useCurrentSubscription } from '@/hooks/queries/useBilling';

export interface PlanFeatures {
    plan_key: string | null;       // 'free' | 'base' | 'standard' | 'pro' | null (no subscription)
    calls_included: number;
    ai_insights: boolean;          // Analytics AI summaries
    whatsapp: boolean;             // WhatsApp bot & notifications
    copilot: boolean;              // In-dashboard AI Copilot chat
    is_active: boolean;            // subscription is currently active
    is_loading: boolean;
}

// Fallback when no active subscription is found
const NO_SUBSCRIPTION: PlanFeatures = {
    plan_key: null,
    calls_included: 0,
    ai_insights: false,
    whatsapp: false,
    copilot: false,
    is_active: false,
    is_loading: false,
};

/**
 * Returns the feature set available to the current user based on their
 * active subscription plan.
 *
 * Feature matrix:
 *   free     → dashboard only (10 test calls, no insights/whatsapp/copilot)
 *   base     → dashboard + bookings (60 calls, no insights/whatsapp/copilot)
 *   standard → + WhatsApp Integration (200 calls, no insights/copilot)
 *   pro      → everything (400 calls, all features)
 */
export function useSubscriptionFeatures(): PlanFeatures {
    const { data: subscription, isLoading } = useCurrentSubscription();

    if (isLoading) {
        return { ...NO_SUBSCRIPTION, is_loading: true };
    }

    // Backend returns null/undefined when no active subscription
    if (!subscription || !subscription.plan) {
        return NO_SUBSCRIPTION;
    }

    // Backend: SubscriptionSerializer exposes plan_name + plan_features
    const planFeatures = (subscription as any).plan_features ?? {};
    const planKey: string = planFeatures.key ?? (subscription as any).plan_name?.toLowerCase() ?? '';

    return {
        plan_key: planKey || null,
        calls_included: planFeatures.calls_included ?? 0,
        ai_insights:    !!planFeatures.ai_insights,
        whatsapp:       !!planFeatures.whatsapp,
        copilot:        !!planFeatures.copilot,
        is_active:      (subscription as any).status === 'active',
        is_loading:     false,
    };
}
