'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Data is fresh for 5 minutes
                        staleTime: 5 * 60 * 1000,
                        // Keep unused data in cache for 24 hours (offline support)
                        gcTime: 24 * 60 * 60 * 1000,
                        // Avoid refetching when window gains focus to prevent UI jumps
                        refetchOnWindowFocus: false,
                        // Retry failed requests 3 times with exponential backoff
                        retry: (failureCount, error) => {
                            // Don't retry on 401/403 (auth errors) - let auth flow handle it
                            const status = (error as any)?.response?.status;
                            if (status === 401 || status === 403) return false;
                            return failureCount < 3;
                        },
                        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
