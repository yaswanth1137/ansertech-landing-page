'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import QueryProvider from '@/lib/providers/QueryProvider';
import { ThemeProvider } from '@/lib/providers/ThemeProvider';
import AuthSync from '@/components/auth/AuthSync';

/**
 * Root Providers - wraps app with NextAuth, React Query, and Toast
 *
 * Provider Order (inside-out):
 * 1. SessionProvider - NextAuth session management
 * 2. AuthSync - Syncs session token to API clients
 * 3. QueryProvider - React Query for data fetching
 * 4. Toaster - Toast notifications
 */
export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider
            refetchInterval={4 * 60}
            refetchOnWindowFocus={true}
        >
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                <AuthSync />
                <QueryProvider>
                    {children}
                    <Toaster position="top-right" richColors />
                </QueryProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
