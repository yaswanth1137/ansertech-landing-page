import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '@/services/campaignService';
import { CampaignContactInput, OutboundCallInput } from '@/types/models/campaign';

export const campaignKeys = {
    all: ['campaigns'] as const,
    detail: (id: string) => [...campaignKeys.all, 'detail', id] as const,
};

export function usePlaceOutboundCall() {
    return useMutation({
        mutationFn: (data: OutboundCallInput) => campaignService.placeOutboundCall(data),
    });
}

export function useCreateCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ agentId, contacts }: { agentId: string; contacts: CampaignContactInput[] }) =>
            campaignService.createCampaign(agentId, contacts),
        onSuccess: (campaign) => {
            queryClient.setQueryData(campaignKeys.detail(campaign.id), campaign);
        },
    });
}

export function useCampaign(id: string | undefined, options?: { poll?: boolean }) {
    return useQuery({
        queryKey: campaignKeys.detail(id || ''),
        queryFn: () => campaignService.getCampaign(id as string),
        enabled: !!id,
        refetchInterval: (query) => {
            if (!options?.poll) return false;
            const status = query.state.data?.status;
            return status === 'completed' || status === 'failed' ? false : 3000;
        },
    });
}
