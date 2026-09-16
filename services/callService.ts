import { api } from './apiClient';
import { validateResponse } from './validation';
import { CallSchema, CallsResponseSchema, CallAnalyticsSchema } from '@/lib/validations/call';
import {
    Call,
    CallsResponse,
    CallsQueryParams,
    CallAnalytics,
    AIAnalysisRequest,
    AIAnalysisResponse,
    CallStats
} from '@/types/models/call';

export const callService = {
    getAll: async (params?: CallsQueryParams) => {
        const response = await api.get<CallsResponse>('/call-logs/', { params });
        return validateResponse(CallsResponseSchema, response.data);
    },

    getById: async (id: string) => {
        const response = await api.get<Call>(`/call-logs/${id}/`);
        return validateResponse(CallSchema, response.data);
    },

    sync: async () => {
        const response = await api.post<{ synced: number; message: string }>('/call-logs/sync/');
        return response.data;
    },

    getAnalytics: async (params?: { date_range?: string; agent?: string; business?: string }) => {
        const response = await api.get<CallAnalytics>('/call-logs/analytics/', { params });
        return validateResponse(CallAnalyticsSchema, response.data);
    },

    analyzeAI: async (data: AIAnalysisRequest) => {
        const response = await api.post<AIAnalysisResponse>('/call-logs/ai_analysis/', data);
        return response.data;
    },

    getRecording: async (id: string) => {
        const response = await api.get<{ url: string; expires_at: string }>(`/call-logs/${id}/recording/`);
        return response.data;
    },

    getTranscript: async (id: string) => {
        const response = await api.get<{ transcript: string; segments: Call['segments'] }>(`/call-logs/${id}/transcript/`);
        return response.data;
    },

    export: async (data: { format: 'csv' | 'pdf' | 'json'; date_range?: string; call_ids?: string[] }) => {
        const response = await api.post<Blob>('/call-logs/export/', data, { responseType: 'blob' });
        return response.data;
    },

    addNote: async (id: string, note: string) => {
        const response = await api.post<Call>(`/call-logs/${id}/notes/`, { note });
        return validateResponse(CallSchema, response.data);
    },

    getStats: async () => {
        const response = await api.get<CallStats>('/call-logs/stats/');
        return response.data;
    }
};
