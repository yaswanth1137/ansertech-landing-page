'use client';

/**
 * API Hook wrapper - Sets up auth token for API calls using NextAuth session
 * Wrap API calls with this to ensure authentication is properly handled
 */

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { setApiToken } from '../services/apiClient';

/**
 * Hook to setup API authentication from NextAuth session
 * Should be called in components that make API calls
 */
export function useApiAuth() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated' && session?.accessToken) {
            setApiToken(session.accessToken);
        } else if (status === 'unauthenticated') {
            setApiToken(null);
        }
    }, [session, status]);

    return {
        isReady: status !== 'loading',
        isAuthenticated: status === 'authenticated',
        accessToken: session?.accessToken || null,
    };
}

export default useApiAuth;
