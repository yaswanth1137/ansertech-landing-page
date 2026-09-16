import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessService } from '@/services';
import { CreateBusinessRequest, UpdateBusinessRequest } from '@/types/models/business';

export const businessKeys = {
    all: ['businesses'] as const,
    lists: () => [...businessKeys.all, 'list'] as const,
    list: (params: Record<string, any>) => [...businessKeys.lists(), { params }] as const,
    details: () => [...businessKeys.all, 'detail'] as const,
    detail: (id: string) => [...businessKeys.details(), id] as const,
    categories: () => [...businessKeys.all, 'categories'] as const,
    stats: () => [...businessKeys.all, 'stats'] as const,
    documents: (id: string) => [...businessKeys.detail(id), 'documents'] as const,
    questions: (id: string) => [...businessKeys.detail(id), 'questions'] as const,
    scrapingState: (id: string) => [...businessKeys.detail(id), 'scraping'] as const,
    recommendations: (id: string) => [...businessKeys.detail(id), 'recommendations'] as const,
};

export function useBusinessCategories() {
    return useQuery({
        queryKey: businessKeys.categories(),
        queryFn: () => businessService.getCategories(),
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
    });
}

export function useBusinessesList(params?: { category?: string; is_active?: boolean; search?: string }) {
    return useQuery({
        queryKey: businessKeys.list(params || {}),
        queryFn: () => businessService.getAll(params),
    });
}

export function useBusiness(id: string) {
    return useQuery({
        queryKey: businessKeys.detail(id),
        queryFn: () => businessService.getById(id),
        enabled: !!id,
    });
}

export function useBusinessStats() {
    return useQuery({
        queryKey: businessKeys.stats(),
        queryFn: () => businessService.getStats(),
    });
}

export function useBusinessDocuments(id: string) {
    return useQuery({
        queryKey: businessKeys.documents(id),
        queryFn: () => businessService.getDocuments(id),
        enabled: !!id,
    });
}

export function useBusinessQuestions(id: string) {
    return useQuery({
        queryKey: businessKeys.questions(id),
        queryFn: () => businessService.getQuestions(id),
        enabled: !!id,
    });
}

export function useBusinessScrapingStatus(id: string) {
    return useQuery({
        queryKey: businessKeys.scrapingState(id),
        queryFn: () => businessService.getScrapingStatus(id),
        enabled: !!id,
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            return status === 'pending' || status === 'in_progress' ? 5000 : false;
        },
    });
}

export function useBusinessAgentRecommendations(id: string) {
    return useQuery({
        queryKey: businessKeys.recommendations(id),
        queryFn: () => businessService.getAgentRecommendations(id),
        enabled: !!id,
    });
}

export function useCreateBusiness() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBusinessRequest) => businessService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
            queryClient.invalidateQueries({ queryKey: businessKeys.stats() });
        },
    });
}

export function useUpdateBusiness() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<UpdateBusinessRequest> }) =>
            businessService.update(id, updates),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: businessKeys.detail(data.id) });
            queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
        },
    });
}

export function useDeleteBusiness() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => businessService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
            queryClient.invalidateQueries({ queryKey: businessKeys.stats() });
        },
    });
}

export function useTriggerBusinessScraping() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, website }: { id: string; website?: string }) =>
            businessService.triggerScraping(id, website),
        onSuccess: (data, { id }) => {
            queryClient.invalidateQueries({ queryKey: businessKeys.scrapingState(id) });
            queryClient.invalidateQueries({ queryKey: businessKeys.detail(id) });
        },
    });
}

export function useAnswerBusinessQuestion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ businessId, questionId, answer }: { businessId: string; questionId: string; answer: string }) =>
            businessService.answerQuestion(businessId, questionId, answer),
        onSuccess: (data, { businessId }) => {
            queryClient.invalidateQueries({ queryKey: businessKeys.questions(businessId) });
            queryClient.invalidateQueries({ queryKey: businessKeys.detail(businessId) });
        },
    });
}

export function useUploadBusinessDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ businessId, file, name, document_type }: { businessId: string; file: File; name: string; document_type: string }) =>
            businessService.uploadDocument(businessId, file, name, document_type),
        onSuccess: (data, { businessId }) => {
            queryClient.invalidateQueries({ queryKey: businessKeys.documents(businessId) });
        },
    });
}

export function useGenerateBusinessAgentSuggestions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => businessService.generateAgentSuggestions(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: businessKeys.recommendations(id) });
        },
    });
}

