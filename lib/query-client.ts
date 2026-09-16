import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';
import { cache } from 'react';

/**
 * Get a stable QueryClient instance for the current request context (server-side)
 */
export const getQueryClient = cache(
    () =>
        new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 5 * 60 * 1000,
                },
                dehydrate: {
                    // Per-query dehydration logic if needed
                    shouldDehydrateQuery: (query) =>
                        defaultShouldDehydrateQuery(query) ||
                        query.state.status === 'pending',
                },
            },
        })
);
