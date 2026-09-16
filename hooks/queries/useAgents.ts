import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agentService } from '@/services';
import { CreateAgentRequest, UpdateAgentRequest, CloneAgentRequest, RollbackRequest } from '@/types/models/agent';

export const agentKeys = {
    all: ['agents'] as const,
    lists: () => [...agentKeys.all, 'list'] as const,
    list: (filters: string) => [...agentKeys.lists(), { filters }] as const,
    details: () => [...agentKeys.all, 'detail'] as const,
    detail: (id: string) => [...agentKeys.details(), id] as const,
    stats: () => [...agentKeys.all, 'stats'] as const,
    capacity: () => [...agentKeys.all, 'capacity'] as const,
    versions: (id: string) => [...agentKeys.detail(id), 'versions'] as const,
    types: () => [...agentKeys.all, 'types'] as const,
};

export function useAgentsList(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: agentKeys.lists(),
        queryFn: () => agentService.getAll(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: options?.enabled ?? true,
    });
}

export function useAgent(id: string) {
    return useQuery({
        queryKey: agentKeys.detail(id),
        queryFn: () => agentService.getById(id),
        enabled: !!id,
    });
}

export function useAgentStats() {
    return useQuery({
        queryKey: agentKeys.stats(),
        queryFn: () => agentService.getStats(),
        staleTime: 10 * 60 * 1000,
    });
}

export function useAgentCapacity() {
    return useQuery({
        queryKey: agentKeys.capacity(),
        queryFn: () => agentService.getCapacity(),
        // Refetch often as capacity changes frequently
        refetchInterval: 60 * 1000,
        refetchIntervalInBackground: false,
    });
}

export function useCreateAgent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAgentRequest) => agentService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: agentKeys.stats() });
        },
    });
}

export function useUpdateAgent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: UpdateAgentRequest }) =>
            agentService.update(id, updates),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: agentKeys.detail(data.id) });
            queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
        },
    });
}

export function useDeleteAgent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => agentService.delete(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: agentKeys.lists() });
            const previousAgents = queryClient.getQueryData<any[]>(agentKeys.lists());

            if (previousAgents) {
                queryClient.setQueryData(agentKeys.lists(), (old: any) => {
                    if (!old) return old;
                    if (Array.isArray(old)) return old.filter((a: any) => a.id !== id);
                    if (old.results) return { ...old, results: old.results.filter((a: any) => a.id !== id) };
                    return old;
                });
            }

            return { previousAgents };
        },
        onError: (err, id, context) => {
            if (context?.previousAgents) {
                queryClient.setQueryData(agentKeys.lists(), context.previousAgents);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: agentKeys.stats() });
        },
    });
}

export function useUpdateAgentStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'active' | 'paused' | 'inactive' }) =>
            agentService.updateStatus(id, status),
        onMutate: async ({ id, status }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: agentKeys.lists() });
            await queryClient.cancelQueries({ queryKey: agentKeys.detail(id) });

            // Snapshot previous values
            const previousAgents = queryClient.getQueryData<any[]>(agentKeys.lists());
            const previousAgent = queryClient.getQueryData<any>(agentKeys.detail(id));

            // Optimistically update lists
            if (previousAgents) {
                queryClient.setQueryData(agentKeys.lists(), (old: any) => {
                    if (!old) return old;
                    
                    // Handle paginated response ({ count, next, previous, results: [...] })
                    if (old.results && Array.isArray(old.results)) {
                        return {
                            ...old,
                            results: old.results.map((agent: any) =>
                                agent.id === id ? { ...agent, status } : agent
                            ),
                        };
                    }
                    
                    // Handle direct array response
                    if (Array.isArray(old)) {
                        return old.map((agent: any) =>
                            agent.id === id ? { ...agent, status } : agent
                        );
                    }
                    
                    return old;
                });
            }

            // Optimistically update detail
            if (previousAgent) {
                queryClient.setQueryData(agentKeys.detail(id), (old: any) => ({
                    ...old,
                    status
                }));
            }

            return { previousAgents, previousAgent };
        },
        onError: (err, { id }, context) => {
            if (context?.previousAgents) {
                queryClient.setQueryData(agentKeys.lists(), context.previousAgents);
            }
            if (context?.previousAgent) {
                queryClient.setQueryData(agentKeys.detail(id), context.previousAgent);
            }
        },
        onSettled: (data, error, { id }) => {
            queryClient.invalidateQueries({ queryKey: agentKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: agentKeys.stats() });
        },
    });
}

export function useSyncAgentCalls() {
    return useMutation({
        mutationFn: ({ id, hours_back }: { id: string; hours_back?: number }) =>
            agentService.syncCalls(id, hours_back),
    });
}

/* ── Versioning & Cloning ─────────────────────────────────── */

/** Clone an agent. On success, refetch the agents list. */
export function useCloneAgent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data?: CloneAgentRequest }) =>
            agentService.clone(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: agentKeys.stats() });
        },
    });
}

/** Fetch version history for a single agent. */
export function useAgentVersions(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: agentKeys.versions(id),
        queryFn: () => agentService.getVersions(id),
        enabled: (options?.enabled ?? true) && !!id,
        staleTime: 2 * 60 * 1000, // 2 min
    });
}

/** Rollback an agent's config to a previous version. */
export function useRollbackAgent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: RollbackRequest }) =>
            agentService.rollback(id, data),
        onSuccess: (_res, { id }) => {
            queryClient.invalidateQueries({ queryKey: agentKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: agentKeys.versions(id) });
            queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
        },
    });
}


/* ── Knowledge Base ───────────────────────────────────────── */

/** List knowledge documents for an agent. */
export function useKnowledgeDocs(agentId: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: [...agentKeys.detail(agentId), 'knowledge'] as const,
        queryFn: () => agentService.getKnowledgeDocs(agentId),
        enabled: (options?.enabled ?? true) && !!agentId,
        staleTime: 60_000,
    });
}

/** Upload a knowledge document. */
export function useUploadKnowledgeDoc() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ agentId, file, documentType, name }: {
            agentId: string; file: File; documentType?: string; name?: string;
        }) => agentService.uploadKnowledgeDoc(agentId, file, documentType, name),
        onSuccess: (_res, { agentId }) => {
            queryClient.invalidateQueries({ queryKey: [...agentKeys.detail(agentId), 'knowledge'] });
        },
    });
}

/** Delete a knowledge document. */
export function useDeleteKnowledgeDoc() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ agentId, docId }: { agentId: string; docId: string }) =>
            agentService.deleteKnowledgeDoc(agentId, docId),
        onSuccess: (_res, { agentId }) => {
            queryClient.invalidateQueries({ queryKey: [...agentKeys.detail(agentId), 'knowledge'] });
        },
    });
}

/** Semantic search across an agent's knowledge base. */
export function useSearchKnowledge() {
    return useMutation({
        mutationFn: ({ agentId, query, topK }: { agentId: string; query: string; topK?: number }) =>
            agentService.searchKnowledge(agentId, query, topK),
    });
}

/* ── Agent Types ──────────────────────────────────────────── */

/** Fetch agent type definitions, mappings, and defaults. Cached for 30 min. */
export function useAgentTypes(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: agentKeys.types(),
        queryFn: () => agentService.getTypes(),
        staleTime: 30 * 60 * 1000,
        enabled: options?.enabled ?? true,
    });
}
