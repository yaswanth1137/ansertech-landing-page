import { api } from './apiClient';

export const copilotService = {
    query: async (data: { query: string; conversation_id?: string | null; channel?: string }) => {
        const response = await api.post('/copilot/query/', data);
        return response.data;
    },

    getConversations: async () => {
        const response = await api.get('/copilot/conversations/');
        return response.data;
    },

    getPreferences: async () => {
        const response = await api.get('/copilot/preferences/');
        return response.data;
    },

    updatePreferences: async (data: any) => {
        const response = await api.post('/copilot/preferences/', data);
        return response.data;
    },

    getInsights: async () => {
        const response = await api.get('/copilot/insights/');
        return response.data;
    }
};
