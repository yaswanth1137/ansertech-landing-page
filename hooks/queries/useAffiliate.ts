import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateService, AffiliateBankAccount } from '@/services/affiliateService';

export const affiliateKeys = {
    all: ['affiliate'] as const,
    me: () => [...affiliateKeys.all, 'me'] as const,
    overview: () => [...affiliateKeys.all, 'overview'] as const,
    referrals: () => [...affiliateKeys.all, 'referrals'] as const,
    customers: () => [...affiliateKeys.all, 'customers'] as const,
    commissions: () => [...affiliateKeys.all, 'commissions'] as const,
    payouts: () => [...affiliateKeys.all, 'payouts'] as const,
    billingSummary: () => [...affiliateKeys.all, 'billing-summary'] as const,
    bankAccount: () => [...affiliateKeys.all, 'bank-account'] as const,
};

export function useAffiliateMe() {
    return useQuery({ queryKey: affiliateKeys.me(), queryFn: affiliateService.getMe, staleTime: 2 * 60 * 1000 });
}

export function useAffiliateOverview(enabled: boolean) {
    return useQuery({ queryKey: affiliateKeys.overview(), queryFn: affiliateService.getOverview, enabled, staleTime: 60 * 1000 });
}

export function useAffiliateReferrals(enabled: boolean) {
    return useQuery({ queryKey: affiliateKeys.referrals(), queryFn: affiliateService.getReferrals, enabled, staleTime: 60 * 1000 });
}

export function useAffiliateCustomers(enabled: boolean) {
    return useQuery({ queryKey: affiliateKeys.customers(), queryFn: affiliateService.getCustomers, enabled, staleTime: 60 * 1000 });
}

export function useAffiliateCommissions(enabled: boolean) {
    return useQuery({ queryKey: affiliateKeys.commissions(), queryFn: affiliateService.getCommissions, enabled, staleTime: 60 * 1000 });
}

export function useAffiliatePayouts(enabled: boolean) {
    return useQuery({ queryKey: affiliateKeys.payouts(), queryFn: affiliateService.getPayouts, enabled, staleTime: 60 * 1000 });
}

export function useAffiliateBillingSummary(enabled: boolean) {
    return useQuery({ queryKey: affiliateKeys.billingSummary(), queryFn: affiliateService.getBillingSummary, enabled, staleTime: 60 * 1000 });
}

export function useAffiliateBankAccount(enabled: boolean) {
    return useQuery({ queryKey: affiliateKeys.bankAccount(), queryFn: affiliateService.getBankAccount, enabled, staleTime: 60 * 1000 });
}

export function useJoinAffiliate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: affiliateService.join,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: affiliateKeys.me() }),
    });
}

export function useSaveBankAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Omit<AffiliateBankAccount, 'updated_at'>) => affiliateService.saveBankAccount(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: affiliateKeys.bankAccount() }),
    });
}

export function useRequestWithdrawal() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (amount: number) => affiliateService.requestWithdrawal(amount),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: affiliateKeys.billingSummary() });
            queryClient.invalidateQueries({ queryKey: affiliateKeys.overview() });
        },
    });
}
