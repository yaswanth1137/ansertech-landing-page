'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { agentService } from '@/services/agentService';

export function useAgentMetrics() {
    const { data: session, status } = useSession();
    const isEnabled = status === 'authenticated' && !!session?.accessToken;

    const { data, error, isLoading } = useQuery({
        queryKey: ['agent-metrics', 'capacity'],
        queryFn: () => agentService.getCapacity(),
        refetchInterval: isEnabled ? 60000 : false,
        refetchOnWindowFocus: true,
        enabled: isEnabled,
    });

    return {
        agents: data?.agents || [],
        summary: data?.summary,
        isLoading,
        error: error ? 'Failed to load agent metrics' : null,
    };
}

