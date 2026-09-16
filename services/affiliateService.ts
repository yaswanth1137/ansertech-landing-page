import { api } from './apiClient';

export interface AffiliateProfile {
    id: string;
    referral_code: string;
    referral_link: string;
    status: 'active' | 'suspended';
    tier?: 'Standard' | 'Business' | 'Pro';
    commission_rate_percent?: number;
    total_referrals_count?: number;
    created_at: string;
}

export interface Referral {
    id: string;
    referred_user_email: string;
    created_at: string;
}

export interface CommissionEntry {
    id: string;
    amount: string;
    rate: string;
    status: 'pending' | 'approved' | 'paid' | 'voided';
    created_at: string;
}

export interface CommissionsResponse {
    entries: CommissionEntry[];
    totals: { pending: number; approved: number; paid: number };
}

export interface AffiliatePayout {
    id: string;
    total_amount: string;
    reference: string;
    status?: string;
    paid_at: string | null;
    created_at: string;
}

export interface AffiliateBankAccount {
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    upi_id?: string;
    updated_at?: string;
}

export interface AffiliateOverviewData {
    referral_code: string;
    referral_link: string;
    customer_count: number;
    month_revenue: number;
    activity: Array<{ detail: string; created_at: string }>;
}

export interface AffiliateCustomer {
    referral_id: string;
    email: string;
    signed_up_at: string;
    plan_name?: string;
    subscription_status?: string;
    lifetime_revenue: string;
    last_payment_at?: string;
}

export interface AffiliateBillingSummaryData {
    total_revenue_generated: string;
    available_balance: string;
    payouts: AffiliatePayout[];
}

export const affiliateService = {
    join: async () => (await api.post<AffiliateProfile>('/affiliates/join/')).data,

    getMe: async () => {
        try {
            return (await api.get<AffiliateProfile>('/affiliates/me/')).data;
        } catch (err: any) {
            if (err?.response?.status === 404) return null;
            if (process.env.NODE_ENV !== 'production') {
                return {
                    id: 'aff-dev-123',
                    referral_code: 'ANSER-PARTNER-2026',
                    referral_link: 'http://localhost:3000/register?ref=ANSER-PARTNER-2026',
                    status: 'active',
                    tier: 'Pro',
                    commission_rate_percent: 20,
                    total_referrals_count: 18,
                    created_at: new Date().toISOString(),
                };
            }
            throw err;
        }
    },

    getReferrals: async () => {
        try {
            return (await api.get<Referral[]>('/affiliates/referrals/')).data;
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') return [];
            throw err;
        }
    },

    getCommissions: async () => {
        try {
            return (await api.get<CommissionsResponse>('/affiliates/commissions/')).data;
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                return { entries: [], totals: { pending: 0, approved: 0, paid: 0 } };
            }
            throw err;
        }
    },

    getPayouts: async () => {
        try {
            return (await api.get<AffiliatePayout[]>('/affiliates/payouts/')).data;
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') return [];
            throw err;
        }
    },

    getOverview: async (): Promise<AffiliateOverviewData> => {
        try {
            return (await api.get<AffiliateOverviewData>('/affiliates/overview/')).data;
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                return {
                    referral_code: 'ANSER-PARTNER-2026',
                    referral_link: 'http://localhost:3000/register?ref=ANSER-PARTNER-2026',
                    customer_count: 18,
                    month_revenue: 124500,
                    activity: [
                        { detail: 'Referred Horizon Logistics (Enterprise Plan)', created_at: '2026-08-17T11:20:00Z' },
                        { detail: 'Commission payout of ₹12,450 approved', created_at: '2026-08-12T15:30:00Z' },
                        { detail: 'Referred CityCare Dental (Starter Plan)', created_at: '2026-08-05T09:10:00Z' },
                        { detail: 'Referred Apex AI Corp (Pro Plan)', created_at: '2026-07-29T14:00:00Z' },
                    ],
                };
            }
            throw err;
        }
    },

    getCustomers: async (): Promise<AffiliateCustomer[]> => {
        try {
            return (await api.get<AffiliateCustomer[]>('/affiliates/customers/')).data;
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                return [
                    {
                        referral_id: 'ref-1',
                        email: 'founder@horizonlogistics.io',
                        signed_up_at: '2026-08-17T11:20:00Z',
                        plan_name: 'Enterprise Pro',
                        subscription_status: 'Active',
                        lifetime_revenue: '45,000',
                        last_payment_at: '2026-08-17T11:20:00Z',
                    },
                    {
                        referral_id: 'ref-2',
                        email: 'support@citycaredental.com',
                        signed_up_at: '2026-08-05T09:10:00Z',
                        plan_name: 'Starter Business',
                        subscription_status: 'Active',
                        lifetime_revenue: '18,500',
                        last_payment_at: '2026-08-05T09:10:00Z',
                    },
                    {
                        referral_id: 'ref-3',
                        email: 'ceo@apexaicorp.com',
                        signed_up_at: '2026-07-29T14:00:00Z',
                        plan_name: 'Pro Receptionist',
                        subscription_status: 'Active',
                        lifetime_revenue: '61,000',
                        last_payment_at: '2026-08-01T10:00:00Z',
                    },
                ];
            }
            throw err;
        }
    },

    getBillingSummary: async (): Promise<AffiliateBillingSummaryData> => {
        try {
            return (await api.get<AffiliateBillingSummaryData>('/affiliates/billing-summary/')).data;
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                return {
                    total_revenue_generated: '1,24,500',
                    available_balance: '24,900',
                    payouts: [
                        { id: 'payout-1', total_amount: '12,450', reference: 'REF-BANK-9981', status: 'Completed', paid_at: '2026-08-12T15:30:00Z', created_at: '2026-08-10T10:00:00Z' },
                        { id: 'payout-2', total_amount: '12,450', reference: 'REF-BANK-8824', status: 'Completed', paid_at: '2026-07-12T14:20:00Z', created_at: '2026-07-10T09:00:00Z' },
                    ],
                };
            }
            throw err;
        }
    },

    getBankAccount: async (): Promise<AffiliateBankAccount | null> => {
        try {
            return (await api.get<AffiliateBankAccount>('/affiliates/bank-account/')).data;
        } catch (err: any) {
            if (err?.response?.status === 404 || process.env.NODE_ENV !== 'production') {
                return {
                    account_holder_name: 'Dev Partner Ltd',
                    account_number: 'XXXX-XXXX-8821',
                    ifsc_code: 'HDFC0001234',
                    upi_id: 'devpartner@upi',
                    updated_at: new Date().toISOString(),
                };
            }
            throw err;
        }
    },

    saveBankAccount: async (payload: Omit<AffiliateBankAccount, 'updated_at'>) => {
        try {
            return (await api.post<AffiliateBankAccount>('/affiliates/bank-account/', payload)).data;
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') return { ...payload, updated_at: new Date().toISOString() };
            throw err;
        }
    },

    requestWithdrawal: async (amount: number) => {
        try {
            return (await api.post('/affiliates/withdraw/', { amount })).data;
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') return { status: 'requested', amount };
            throw err;
        }
    },

    downloadStatement: async (): Promise<Blob> => {
        try {
            const res = await api.get('/affiliates/statement/', { responseType: 'blob' });
            return res.data;
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                const csvData = `Date,Type,Amount,Status\n2026-08-12,Payout,12450,Completed\n2026-07-12,Payout,12450,Completed`;
                return new Blob([csvData], { type: 'text/csv' });
            }
            throw err;
        }
    },
};
