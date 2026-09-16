import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { callService } from '@/services';
import { CallsQueryParams, AIAnalysisRequest } from '@/types/models/call';
import { invalidateCustomers } from './useCustomers';

export const callKeys = {
    all: ['calls'] as const,
    lists: () => [...callKeys.all, 'list'] as const,
    list: (params: Record<string, any>) => [...callKeys.lists(), { params }] as const,
    details: () => [...callKeys.all, 'detail'] as const,
    detail: (id: string) => [...callKeys.details(), id] as const,
    analytics: (params: Record<string, any>) => [...callKeys.all, 'analytics', params] as const,
    stats: () => [...callKeys.all, 'stats'] as const,
    recording: (id: string) => [...callKeys.detail(id), 'recording'] as const,
    transcript: (id: string) => [...callKeys.detail(id), 'transcript'] as const,
};

export function useCallsList(params?: CallsQueryParams) {
    return useQuery({
        queryKey: callKeys.list(params || {}),
        queryFn: () => callService.getAll(params),
        staleTime: 60 * 1000,
    });
}

export function useCall(id: string) {
    return useQuery({
        queryKey: callKeys.detail(id),
        queryFn: () => callService.getById(id),
        enabled: !!id,
    });
}

export function useCallAnalytics(params?: { date_range?: string; agent?: string; business?: string }, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: callKeys.analytics(params || {}),
        queryFn: () => callService.getAnalytics(params),
        staleTime: 5 * 60 * 1000,
        enabled: options?.enabled ?? true,
    });
}

export function useCallStats() {
    return useQuery({
        queryKey: callKeys.stats(),
        queryFn: () => callService.getStats(),
        staleTime: 5 * 60 * 1000,
    });
}

export function useCallRecording(id: string) {
    return useQuery({
        queryKey: callKeys.recording(id),
        queryFn: () => callService.getRecording(id),
        enabled: !!id,
    });
}

export function useCallTranscript(id: string) {
    return useQuery({
        queryKey: callKeys.transcript(id),
        queryFn: () => callService.getTranscript(id),
        enabled: !!id,
    });
}

export function useSyncCalls() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => callService.sync(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: callKeys.lists() });
            invalidateCustomers(queryClient);
        },
    });
}

export function useAnalyzeCallsWithAI() {
    return useMutation({
        mutationFn: (data: AIAnalysisRequest) => callService.analyzeAI(data),
    });
}

export function useExportCalls() {
    return useMutation({
        mutationFn: callService.export,
    });
}

export function useAddCallNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, note }: { id: string; note: string }) =>
            callService.addNote(id, note),
        onSuccess: (data, { id }) => {
            queryClient.invalidateQueries({ queryKey: callKeys.detail(id) });
        },
    });
}

