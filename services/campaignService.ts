import { api } from './apiClient';
import { validateResponse } from './validation';
import { CampaignSchema, OutboundCallResultSchema } from '@/lib/validations/campaign';
import { Campaign, CampaignContactInput, OutboundCallInput, OutboundCallResult } from '@/types/models/campaign';

export const campaignService = {
    placeOutboundCall: async (data: OutboundCallInput): Promise<OutboundCallResult> => {
        const response = await api.post<OutboundCallResult>('/call-logs/outbound/', data);
        return validateResponse(OutboundCallResultSchema, response.data);
    },

    createCampaign: async (agentId: string, contacts: CampaignContactInput[]): Promise<Campaign> => {
        const response = await api.post<Campaign>('/call-logs/campaigns/', {
            agent_id: agentId,
            contacts,
        });
        return validateResponse(CampaignSchema, response.data);
    },

    getCampaign: async (id: string): Promise<Campaign> => {
        const response = await api.get<Campaign>(`/call-logs/campaigns/${id}/`);
        return validateResponse(CampaignSchema, response.data);
    },
};
