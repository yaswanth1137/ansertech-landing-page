import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/apiClient';

export interface PhoneNumber {
    id: string;
    phone_number: string;
    formatted_number: string;
    status: 'active' | 'inactive' | 'pending';
    agent?: string;
    agent_name?: string;
}

export interface VoIPRequest {
    id: string;
    status: 'pending' | 'approved' | 'rejected' | 'assigned' | 'cancelled';
    preferred_region: string;
    created_at: string;
}

export const voipKeys = {
    all: ['voip'] as const,
    numbers: () => [...voipKeys.all, 'numbers'] as const,
    requests: () => [...voipKeys.all, 'requests'] as const,
};

export function usePhoneNumbers() {
    return useQuery({
        queryKey: voipKeys.numbers(),
        queryFn: async () => {
            const response = await api.get('/phone-numbers/');
            return (response.data.results || response.data) as PhoneNumber[];
        },
    });
}

export function useVoIPRequests() {
    return useQuery({
        queryKey: voipKeys.requests(),
        queryFn: async () => {
            const response = await api.get('/voip/requests/');
            return (response.data.results || response.data) as VoIPRequest[];
        },
    });
}

export function useRequestNumber() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { preferred_region: string; business_justification: string }) => {
            const response = await api.post('/voip/requests/', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: voipKeys.requests() });
        },
    });
}

export function useAssignAgent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ phoneNumberId, agentId }: { phoneNumberId: string; agentId: string }) => {
            const response = await api.post(`/phone-numbers/${phoneNumberId}/assign_agent/`, { agent_id: agentId });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: voipKeys.numbers() });
        },
    });
}
