'use client';

/**
 * Unified Auth Hook - Uses NextAuth for session management
 * No external data-fetching library — just React state + NextAuth
 * Force recompile
 */

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../services/apiClient';
import { useAuthStore } from '@/lib/store/authStore';
import { authUrl, dashboardUrl, resolveDestUrl } from '@/lib/authUrls';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    username: string;
    password: string;
    password2: string;
    business_name?: string;
    business_type?: string;
    phone_number?: string;
}

interface AuthResponse {
    user: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        business_name?: string;
        business_type?: string;
        subscription_plan?: string;
        onboarding_completed?: boolean;
    };
    access: string;
    refresh: string;
}

/**
 * Lightweight mutation hook — since we removed Tanstack useMutation for auth to avoid circular deps or complex setup
 * But actually, effectively this IS a custom mutation hook.
 */
function useMutationFn<TData, TVariables>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: {
        onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
        onSettled?: () => void | Promise<void>;
    }
) {
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = useCallback(
        async (variables: TVariables, overrides?: { onSuccess?: (data: TData) => void }) => {
            setIsPending(true);
            setIsError(false);
            setError(null);
            try {
                const data = await mutationFn(variables);
                await options?.onSuccess?.(data, variables);
                overrides?.onSuccess?.(data);
                return data;
            } catch (err) {
                const e = err instanceof Error ? err : new Error(String(err));
                setIsError(true);
                setError(e);
                throw e;
            } finally {
                setIsPending(false);
                await options?.onSettled?.();
            }
        },
        [mutationFn, options]
    );

    return { mutate, isPending, isError, error };
}

/**
 * Main auth hook - provides session data and auth state
 */
export function useAuth() {
    const { data: session, status, update } = useSession();

    return {
        user: session?.user || null,
        accessToken: session?.accessToken || null,
        isAuthenticated: status === 'authenticated' && !!session,
        isLoading: status === 'loading',
        session,
        updateSession: update,
    };
}

/**
 * Login hook - uses NextAuth signIn
 */
export const useLogin = () => {
    const queryClient = useQueryClient();
    const { update } = useSession();

    return useMutationFn(
        async (credentials: LoginCredentials) => {
            const result = await signIn('credentials', {
                email: credentials.email,
                password: credentials.password,
                redirect: false,
            });

            // IMPORTANT: Check result.ok FIRST.
            // NextAuth v4 extracts `error` from the `url` field of the callback response.
            // If the browser URL had ?error=session_expired (from a stale redirect),
            // NextAuth uses that as the callbackUrl, so the returned url still carries
            // ?error=session_expired — even when authorize() succeeded and result.ok=true.
            // Trusting result.ok prevents a successful login from showing a stale error.
            if (result?.ok) {
                return result;
            }

            if (result?.error) {
                // NextAuth returns 'CredentialsSignin' as a generic code in production;
                // in dev mode it returns the actual thrown error message.
                const msg = result.error === 'CredentialsSignin'
                    ? 'Invalid email or password. Please check your credentials.'
                    : result.error === 'session_expired'
                    ? 'Your session expired. Please sign in again.'
                    : result.error;
                throw new Error(msg);
            }

            throw new Error('Login failed');
        },
        {
            onSuccess: async () => {
                // Clear React Query cache for fresh data
                queryClient.clear();
                await update();
                // Short delay to ensure session is updated
                await new Promise(resolve => setTimeout(resolve, 100));
                // Navigation is handled by the caller's onSuccess override (e.g.
                // app/login/page.tsx), which knows the ?redirect= target and does
                // a full cross-origin navigation to dashboard.ansertech.com —
                // this hook doesn't own navigation itself, only session setup.
            },
        }
    );
};

/**
 * Register hook - creates account then logs in via NextAuth
 */
export const useRegister = () => {
    return useMutationFn(
        async (userData: RegisterData): Promise<AuthResponse> => {
            const { data } = await api.post('/auth/register/', userData);
            return data;
        },
        {
            onSuccess: async (_data, variables) => {
                await signIn('credentials', {
                    email: variables.email,
                    password: variables.password,
                    redirect: false,
                });
                // Full navigation, not router.push — register/login run on
                // auth.ansertech.com, a different origin than dashboard.ansertech.com.
                window.location.href = dashboardUrl();
            },
        }
    );
};

/**
 * Logout hook - uses NextAuth signOut
 */
export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutationFn(
        async () => {
            return;
        },
        {
            onSettled: async () => {
                queryClient.clear();
                useAuthStore.getState().clearAuth();
                await signOut({ redirect: false });
                if (typeof window !== 'undefined') {
                    window.location.href = authUrl('/login');
                } else {
                    router.push(authUrl('/login'));
                }
            },
        }
    );
};

/**
 * Google Login hook - uses NextAuth signIn with google-credential provider
 * The token exchange with Django happens server-side in NextAuth's authorize()
 */
export const useGoogleLogin = () => {
    const queryClient = useQueryClient();
    const { update } = useSession();

    return useMutationFn(
        async (credential: string) => {
            const result = await signIn('google-credential', {
                credential,
                redirect: false,
            });

            if (result?.error) {
                // Log the full error for debugging
                console.error('Google sign-in error:', result.error);

                if (result.error.includes('Backend request failed')) {
                    throw new Error('Google sign-in is unavailable because the backend auth server is unreachable.');
                }
                if (result.error.includes('Missing Google Auth')) {
                    throw new Error('Server configuration error. Please contact support.');
                }
                if (result.error.includes('backend')) {
                    throw new Error(result.error);
                }
                throw new Error(result.error || 'Google sign-in failed');
            }

            if (!result?.ok) {
                throw new Error('Google sign-in failed');
            }

            return result;
        },
        {
            onSuccess: async () => {
                queryClient.clear();
                // Force session re-fetch so useSession() has the fresh Django JWT
                // before we navigate. Without this, AuthSync may not have updated
                // currentAccessToken yet and the first API calls after push() would
                // fire with a stale/missing token.
                await update();
                // Full navigation, not router.push — the Google button renders on
                // auth.ansertech.com, a different origin than dashboard.ansertech.com/
                // partners.ansertech.com. resolveDestUrl() honors ?dest= so a
                // partners-originated login lands back on partners, not dashboard.
                window.location.href = resolveDestUrl(new URLSearchParams(window.location.search));
            },
        }
    );
};

export default useAuth;
