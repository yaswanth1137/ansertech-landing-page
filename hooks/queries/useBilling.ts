import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingService } from '@/services/billingService';

export const billingKeys = {
    all: ['billing'] as const,
    plans: () => [...billingKeys.all, 'plans'] as const,
    publicPlans: () => [...billingKeys.all, 'plans', 'public'] as const,
    subscription: () => [...billingKeys.all, 'subscription'] as const,
    usage: () => [...billingKeys.all, 'usage'] as const,
    payments: () => [...billingKeys.all, 'payments'] as const,
    invoices: () => [...billingKeys.all, 'invoices'] as const,
};

export function usePlans() {
    return useQuery({
        queryKey: billingKeys.plans(),
        queryFn: billingService.getPlans,
        staleTime: 10 * 60 * 1000, // plans rarely change
    });
}

export function usePublicPlans() {
    return useQuery({
        queryKey: billingKeys.publicPlans(),
        queryFn: billingService.getPublicPlans,
        staleTime: 10 * 60 * 1000,
    });
}

export function useCurrentSubscription() {
    return useQuery({
        queryKey: billingKeys.subscription(),
        queryFn: billingService.getCurrentSubscription,
        staleTime: 2 * 60 * 1000,
    });
}

export function useSubscriptionUsage(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: billingKeys.usage(),
        queryFn: billingService.getUsage,
        staleTime: 60 * 1000,
        enabled: options?.enabled,
    });
}

export function usePayments() {
    return useQuery({
        queryKey: billingKeys.payments(),
        queryFn: billingService.getPayments,
        staleTime: 2 * 60 * 1000,
    });
}

export function useInvoices() {
    return useQuery({
        queryKey: billingKeys.invoices(),
        queryFn: billingService.getInvoices,
        staleTime: 2 * 60 * 1000,
    });
}

export function useSubscribe() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (planId: string) => billingService.subscribe(planId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billingKeys.subscription() });
            queryClient.invalidateQueries({ queryKey: billingKeys.usage() });
        },
    });
}

export function useVerifyPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: billingService.verifyPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billingKeys.subscription() });
            queryClient.invalidateQueries({ queryKey: billingKeys.usage() });
            queryClient.invalidateQueries({ queryKey: billingKeys.payments() });
        },
    });
}

export function useCancelSubscription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => billingService.cancelSubscription(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billingKeys.subscription() });
        },
    });
}

export function usePauseSubscription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => billingService.pauseSubscription(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billingKeys.subscription() });
        },
    });
}

export function useResumeSubscription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => billingService.resumeSubscription(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billingKeys.subscription() });
        },
    });
}

export function useDownloadInvoice() {
    return useMutation({
        mutationFn: (id: string) => billingService.downloadInvoice(id),
        onSuccess: (data) => {
            if (data.pdf_url) {
                window.open(data.pdf_url, '_blank');
            }
        },
    });
}

export function usePostpaidToggle() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (enabled: boolean) => billingService.togglePostpaid(enabled),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billingKeys.subscription() });
            queryClient.invalidateQueries({ queryKey: billingKeys.usage() });
        },
    });
}

export function useTopUpPacks() {
    return useQuery({
        queryKey: [...billingKeys.all, 'topUpPacks'],
        queryFn: async () => [],
        staleTime: 10 * 60 * 1000,
    });
}

export function usePurchaseTopUp() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (packId: string) => ({ subscription_id: '', key_id: '' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billingKeys.subscription() });
        },
    });
}

export function useVerifyTopUp() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => ({ success: true }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billingKeys.subscription() });
            queryClient.invalidateQueries({ queryKey: billingKeys.usage() });
        },
    });
}
