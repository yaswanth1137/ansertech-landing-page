import { api } from './apiClient';
import { validateResponse } from './validation';
import {
    AgentSchema,
    AgentStatsSchema,
    AgentCapacityResponseSchema,
    AgentVersionsResponseSchema,
    RollbackResponseSchema,
    KnowledgeDocumentSchema,
    KnowledgeSearchResponseSchema,
} from '@/lib/validations/agent';
import {
    Agent,
    CreateAgentRequest,
    UpdateAgentRequest,
    AgentStats,
    AgentCapacityResponse,
    CloneAgentRequest,
    AgentVersionsResponse,
    RollbackRequest,
    RollbackResponse,
    KnowledgeDocument,
    KnowledgeSearchResponse,
    AgentTypesResponse,
    AgentAIModelsResponse,
} from '@/types/models/agent';

export const agentService = {
    getAll: async () => {
        const response = await api.get<{ results: Agent[] } | Agent[]>('/agents/');
        const data = 'results' in response.data ? response.data.results : response.data;
        return validateResponse(AgentSchema.array(), data);
    },

    getById: async (id: string) => {
        const response = await api.get<Agent>(`/agents/${id}/`);
        return validateResponse(AgentSchema, response.data);
    },

    create: async (data: CreateAgentRequest) => {
        const response = await api.post<Agent>('/agents/', data);
        return validateResponse(AgentSchema, response.data);
    },

    update: async (id: string, updates: UpdateAgentRequest) => {
        const response = await api.patch<Agent>(`/agents/${id}/`, updates);
        return validateResponse(AgentSchema, response.data);
    },

    delete: async (id: string) => {
        await api.delete(`/agents/${id}/`);
    },

    updateStatus: async (id: string, status: 'active' | 'paused' | 'inactive') => {
        const response = await api.patch<Agent>(`/agents/${id}/update_status/`, { status });
        return validateResponse(AgentSchema, response.data);
    },

    syncCalls: async (id: string, hours_back: number = 24) => {
        const response = await api.post<{ message: string; synced: number }>(`/agents/${id}/sync_calls/`, { hours_back });
        return response.data;
    },

    getStats: async () => {
        const response = await api.get<AgentStats>('/agents/stats/');
        return validateResponse(AgentStatsSchema, response.data);
    },

    getCapacity: async () => {
        const response = await api.get<AgentCapacityResponse>('/agents/capacity/');
        return validateResponse(AgentCapacityResponseSchema, response.data);
    },

    /* ── Versioning & Cloning ─────────────────────────────── */

    /** Clone an existing agent. POST /agents/{id}/clone/ */
    clone: async (id: string, data?: CloneAgentRequest): Promise<Agent> => {
        const response = await api.post<Agent>(`/agents/${id}/clone/`, data ?? {});
        return validateResponse(AgentSchema, response.data);
    },

    /** Get version history. GET /agents/{id}/versions/ */
    getVersions: async (id: string): Promise<AgentVersionsResponse> => {
        const response = await api.get<AgentVersionsResponse>(`/agents/${id}/versions/`);
        return validateResponse(AgentVersionsResponseSchema, response.data);
    },

    /** Rollback to a previous config version. POST /agents/{id}/rollback/ */
    rollback: async (id: string, data: RollbackRequest): Promise<RollbackResponse> => {
        const response = await api.post<RollbackResponse>(`/agents/${id}/rollback/`, data);
        return validateResponse(RollbackResponseSchema, response.data);
    },

    /* ── Knowledge Base ───────────────────────────────────── */

    /** List knowledge documents. GET /agents/{id}/knowledge/ */
    getKnowledgeDocs: async (id: string): Promise<KnowledgeDocument[]> => {
        const response = await api.get<KnowledgeDocument[]>(`/agents/${id}/knowledge/`);
        return validateResponse(KnowledgeDocumentSchema.array(), response.data);
    },

    /** Upload a knowledge document. POST /agents/{id}/knowledge/upload/ */
    uploadKnowledgeDoc: async (id: string, file: File, documentType?: string, name?: string): Promise<KnowledgeDocument> => {
        const formData = new FormData();
        formData.append('file', file);
        if (documentType) formData.append('document_type', documentType);
        if (name) formData.append('name', name);
        const response = await api.post<KnowledgeDocument>(
            `/agents/${id}/knowledge/upload/`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        return validateResponse(KnowledgeDocumentSchema, response.data);
    },

    /** Delete a knowledge document. DELETE /agents/{id}/knowledge/{docId}/ */
    deleteKnowledgeDoc: async (id: string, docId: string): Promise<void> => {
        await api.delete(`/agents/${id}/knowledge/${docId}/`);
    },

    /** Semantic search across knowledge base. POST /agents/{id}/knowledge/search/ */
    searchKnowledge: async (id: string, query: string, topK = 5): Promise<KnowledgeSearchResponse> => {
        const response = await api.post<KnowledgeSearchResponse>(
            `/agents/${id}/knowledge/search/`,
            { query, top_k: topK },
        );
        return validateResponse(KnowledgeSearchResponseSchema, response.data);
    },

    /* ── Agent Types ──────────────────────────────────────── */

    /** Get all agent types with metadata and mappings. GET /agents/types/ */
    getTypes: async (): Promise<AgentTypesResponse> => {
        const response = await api.get<AgentTypesResponse>('/agents/types/');
        return response.data;
    },

    /** Get available LLM models and defaults. GET /agents/ai-models/ */
    getAIModels: async (): Promise<AgentAIModelsResponse> => {
        const response = await api.get<AgentAIModelsResponse>('/agents/ai-models/');
        return response.data;
    },
};
