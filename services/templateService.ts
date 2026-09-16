import { api } from './apiClient';

export const templateService = {
    listPurposes: async () => {
        const response = await api.get('/agents/simplified/purposes/');
        const data = response.data;
        return data.success ? data.data : data;
    },

    listIndustries: async () => {
        const response = await api.get('/agents/simplified/industries/');
        return response.data;
    },

    createFromIndustry: async (data: {
        industry: string;
        name: string;
        phone_number?: string;
        language?: string;
    }) => {
        const response = await api.post('/agents/simplified/create_from_industry/', data);
        return response.data;
    },

    createWithConfig: async (data: {
        industry: string;
        name: string;
        answers: Record<string, any>;
        language?: string;
    }) => {
        const response = await api.post('/agents/simplified/create_configured_agent/', {
            industry: data.industry,
            use_ai_enhancement: true,
            enable_calendar: true,
            language: data.language || 'multi',
            configuration: data.answers,
        });
        return response.data;
    },

    getVoices: async (industry?: string) => {
        const response = await api.get('/agents/simplified/voices/', { params: { industry } });
        return response.data;
    },

    getConfigQuestions: async (industry: string) => {
        const response = await api.get('/agents/simplified/industry_questions/', { params: { industry } });
        return response.data;
    }
};
