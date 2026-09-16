'use client';

/**
 * AuthSync - Global component that syncs NextAuth session token to API clients
 * 
 * This component ensures that whenever the NextAuth session changes,
 * the access token is propagated to:
 * 1. Axios API client (for legacy API calls)
 * 2. Sets up a global getter for RTK Query
 * 
 * Must be placed inside SessionProvider
 */

import { useCallback, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { setApiToken, setTokenGetter } from '@/services/apiClient';
import { useAuthStore } from '@/lib/store/authStore';
import { authUrl } from '@/lib/authUrls';

// Global token storage for API clients to access
let currentAccessToken: string | null = null;

/**
 * Get the current access token
 */
export function getAccessToken(): string | null {
    return currentAccessToken;
}

export default function AuthSync() {
    const { data: session, status } = useSession();
    const { setUserInfo, clearAuth } = useAuthStore();
    const previousToken = useRef<string | null>(null);
    const isInitialized = useRef(false);

    const redirectToLogin = useCallback(() => {
        if (typeof window === 'undefined') return;
        const authWindow = window as Window & { _isSigningOut?: boolean };
        if (authWindow._isSigningOut) return;

        authWindow._isSigningOut = true;
        // Clear the token immediately so the axios request interceptor cannot
        // read a stale value and accidentally unblock the _isSigningOut guard.
        currentAccessToken = null;
        setApiToken(null);
        // Use redirect: false + window.location.replace to avoid NextAuth's
        // default hard redirect (window.location.href) which would abort
        // in-flight XHR requests before they can check _isSigningOut.
        signOut({ redirect: false }).then(() => {
            window.location.replace(authUrl('/login'));
        }).catch(() => {
            window.location.replace(authUrl('/login'));
        });
    }, []);

    // Set up the token getter immediately on mount
    useEffect(() => {
        if (!isInitialized.current) {
            const tokenGetter = () => currentAccessToken;
            setTokenGetter(tokenGetter);
            isInitialized.current = true;
        }
    }, []);

    // Synchronize token and user whenever session changes
    useEffect(() => {
        const newToken = session?.accessToken || null;

        // Only update if token actually changed
        if (newToken !== previousToken.current) {
            previousToken.current = newToken;
            currentAccessToken = newToken;

            // Update API client immediately
            setApiToken(newToken);

            // Synchronize user data to Zustand for easy access
            if (session?.user) {
                setUserInfo({
                    id: session.user.id,
                    email: session.user.email,
                    first_name: session.user.first_name || '',
                    last_name: session.user.last_name || '',
                    business_name: session.user.business_name,
                    business_type: session.user.business_type,
                    subscription_plan: session.user.subscription_plan,
                    onboarding_completed: session.user.onboarding_completed,
                    active_team_id: session.user.active_team_id,
                    active_team_role: session.user.active_team_role,
                });
            } else if (status === 'unauthenticated') {
                clearAuth();
            }

            if (process.env.NODE_ENV === 'development') {
                console.log('[AuthSync] Session updated:', newToken ? '✓ Authenticated' : '✗ Unauthenticated', '| Status:', status);
            }
        }
    }, [session, status, setUserInfo, clearAuth]);

    // Handle session errors
    useEffect(() => {
        if (process.env.NODE_ENV !== 'production') return;

        const authBroken =
            status === 'authenticated' &&
            (!session?.accessToken || !!session?.error);

        if (!authBroken) {
            return;
        }

        console.warn('[AuthSync] Invalid or expired session detected - redirecting to login');
        currentAccessToken = null;
        previousToken.current = null;
        setApiToken(null);
        clearAuth();
        redirectToLogin();
    }, [status, session?.accessToken, session?.error, clearAuth, redirectToLogin]);

    // This component doesn't render anything
    return null;
}
