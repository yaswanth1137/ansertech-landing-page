'use client';

import { useQueryClient } from '@tanstack/react-query';
import { billingService } from '@/services/billingService';
import { billingKeys } from '@/hooks/queries/useBilling';

function loadRazorpayScript(): Promise<void> {
    if ((window as any).Razorpay) return Promise.resolve();
    return new Promise((resolve, reject) => {
        if (document.querySelector('script[src*="checkout.razorpay.com"]')) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Razorpay script failed to load'));
        document.body.appendChild(script);
    });
}

/**
 * Shared Razorpay checkout flow for both the dashboard billing page and the
 * marketing pricing page — one place for script loading + payment verification.
 */
export function useRazorpayCheckout() {
    const queryClient = useQueryClient();

    async function openSubscriptionCheckout(
        rzPayload: { subscription_id: string; key_id: string },
        onVerifySuccess: () => void,
        onError: (msg: string) => void,
    ) {
        try {
            await loadRazorpayScript();

            const rzp = new (window as any).Razorpay({
                key: rzPayload.key_id,
                subscription_id: rzPayload.subscription_id,
                name: 'AnserTech',
                description: 'AI Voice Agent Platform',
                handler: async (response: {
                    razorpay_payment_id: string;
                    razorpay_subscription_id: string;
                    razorpay_signature: string;
                }) => {
                    try {
                        await billingService.verifyPayment({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        queryClient.invalidateQueries({ queryKey: billingKeys.subscription() });
                        queryClient.invalidateQueries({ queryKey: billingKeys.payments() });
                        queryClient.invalidateQueries({ queryKey: billingKeys.invoices() });
                        onVerifySuccess();
                    } catch {
                        onError('Payment verification failed. Please contact support.');
                    }
                },
            });
            rzp.open();
        } catch {
            onError('Could not load payment gateway. Please try again.');
        }
    }

    return { openSubscriptionCheckout };
}
