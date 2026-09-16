"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface GoogleAuthStatus {
    connected: boolean;
    gmail_connected: boolean;
    calendar_connected: boolean;
    email: string | null;
}

interface UseGoogleAuthReturn {
    status: GoogleAuthStatus | null;
    isLoading: boolean;
    error: string | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    refreshStatus: () => Promise<void>;
}

export function useGoogleAuth(): UseGoogleAuthReturn {
    const [status, setStatus] = useState<GoogleAuthStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();

    // Fetch current connection status
    const fetchStatus = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Check if user is authenticated via NextAuth
            if (sessionStatus === 'loading') {
                return;
            }

            if (!session?.accessToken) {
                // User not logged in - set default disconnected status
                setStatus({
                    connected: false,
                    gmail_connected: false,
                    calendar_connected: false,
                    email: null
                });
                setIsLoading(false);
                return;
            }

            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            const response = await fetch(`${apiBase}/auth/google_status/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Google connection status');
            }

            const data = await response.json();
            setStatus(data);
        } catch (err) {
            // Don't show error for authentication issues - just log it
            if (process.env.NODE_ENV === 'development') console.log('Google Auth status check:', err instanceof Error ? err.message : 'Unknown error');
            // Set disconnected status on error
            setStatus({
                connected: false,
                gmail_connected: false,
                calendar_connected: false,
                email: null
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Initiate OAuth connection
    const connect = async () => {
        try {
            setIsLoading(true);
            setError(null);

            if (!session?.accessToken) {
                setError('Please log in to connect your Google account');
                setIsLoading(false);
                return;
            }

            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            const response = await fetch(`${apiBase}/auth/google_connect/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to initiate Google connection');
            }

            const data = await response.json();

            // Redirect to Google OAuth consent screen
            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to connect');
            console.error('Error connecting to Google:', err);
            setIsLoading(false);
        }
    };

    // Disconnect Google account
    const disconnect = async () => {
        try {
            setIsLoading(true);
            setError(null);

            if (!session?.accessToken) {
                setError('Please log in to disconnect your Google account');
                setIsLoading(false);
                return;
            }

            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            const response = await fetch(`${apiBase}/auth/google_disconnect/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to disconnect Google account');
            }

            // Refresh status after disconnect
            await fetchStatus();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to disconnect');
            console.error('Error disconnecting Google:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch on mount and when session changes
    useEffect(() => {
        if (sessionStatus !== 'loading') {
            fetchStatus();
        }
    }, [sessionStatus, session?.accessToken]);

    return {
        status,
        isLoading,
        error,
        connect,
        disconnect,
        refreshStatus: fetchStatus,
    };
}
