import { api } from './apiClient';
import {
    Business,
    BusinessListItem,
    CreateBusinessRequest,
    UpdateBusinessRequest,
    BusinessCategory,
    BusinessStats,
    DataCollectionQuestion,
    BusinessDocument,
    AgentRecommendations
} from '@/types/models/business';

export const businessService = {
    getCategories: async () => {
        const response = await api.get<BusinessCategory[]>('/business-categories/');
        return response.data;
    },

    getCategoryTemplate: async (id: string) => {
        const response = await api.get<any>(`/business-categories/${id}/template/`);
        return response.data;
    },

    getAll: async (params?: { category?: string; is_active?: boolean; search?: string }) => {
        const response = await api.get<{ count: number; results: BusinessListItem[] }>('/businesses/', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Business>(`/businesses/${id}/`);
        return response.data;
    },

    create: async (data: CreateBusinessRequest) => {
        let config = {};
        let body: any = data;

        if (data.logo instanceof File) {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value as string | Blob);
                }
            });
            body = formData;
            config = { headers: { 'Content-Type': 'multipart/form-data' } };
        }

        const response = await api.post<Business>('/businesses/', body, config);
        return response.data;
    },

    update: async (id: string, data: Partial<UpdateBusinessRequest>) => {
        const response = await api.patch<Business>(`/businesses/${id}/`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/businesses/${id}/`);
    },

    triggerScraping: async (id: string, website?: string) => {
        const response = await api.post<{ message: string; status: string }>(`/businesses/${id}/scrape_website/`, { website });
        return response.data;
    },

    getScrapingStatus: async (id: string) => {
        const response = await api.get<any>(`/businesses/${id}/scraping_status/`);
        return response.data;
    },

    getQuestions: async (id: string) => {
        const response = await api.get<DataCollectionQuestion[]>(`/businesses/${id}/questions/`);
        return response.data;
    },

    answerQuestion: async (businessId: string, questionId: string, answer: string) => {
        const response = await api.post<{ message: string; completeness_score: number }>(`/businesses/${businessId}/questions/`, {
            question_id: questionId,
            answer
        });
        return response.data;
    },

    uploadDocument: async (businessId: string, file: File, name: string, document_type: string) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('document_type', document_type);

        const response = await api.post<BusinessDocument>(`/businesses/${businessId}/upload_document/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getDocuments: async (id: string) => {
        const response = await api.get<BusinessDocument[]>(`/businesses/${id}/documents/`);
        return response.data;
    },

    getAgentRecommendations: async (id: string) => {
        const response = await api.get<AgentRecommendations>(`/businesses/${id}/agent_recommendations/`);
        return response.data;
    },

    generateAgentSuggestions: async (id: string) => {
        const response = await api.post<{ message: string }>(`/businesses/${id}/generate_agent_suggestions/`);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get<BusinessStats>('/businesses/stats/');
        return response.data;
    }
};
