import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templateService } from '@/services';

export const templateKeys = {
    all: ['templates'] as const,
    industries: () => [...templateKeys.all, 'industries'] as const,
    voices: (industry?: string) => [...templateKeys.all, 'voices', industry] as const,
    questions: (industry: string) => [...templateKeys.all, 'questions', industry] as const,
};

export function useIndustryTemplates() {
    return useQuery({
        queryKey: templateKeys.industries(),
        queryFn: () => templateService.listIndustries(),
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
    });
}

export function useVoices(industry?: string) {
    return useQuery({
        queryKey: templateKeys.voices(industry),
        queryFn: () => templateService.getVoices(industry),
        staleTime: 60 * 60 * 1000, // 1 hour
    });
}

export function useConfigQuestions(industry: string) {
    return useQuery({
        queryKey: templateKeys.questions(industry),
        queryFn: () => templateService.getConfigQuestions(industry),
        enabled: !!industry,
        staleTime: 60 * 60 * 1000, // 1 hour
    });
}

export function useCreateFromIndustry() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            industry: string;
            name: string;
            phone_number?: string;
            language?: string;
        }) => templateService.createFromIndustry(data),
        onSuccess: () => {
            // Invalidate agents list
            queryClient.invalidateQueries({ queryKey: ['agents'] });
        },
    });
}

export function useCreateWithConfig() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            industry: string;
            name: string;
            answers: Record<string, any>;
            language?: string;
        }) => templateService.createWithConfig(data),
        onSuccess: () => {
            // Invalidate agents list
            queryClient.invalidateQueries({ queryKey: ['agents'] });
        },
    });
}
