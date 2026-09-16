import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { customerService } from '@/services';
import { CreateCustomerRequest, UpdateCustomerRequest } from '@/types/models/customer';

// Bookings and calls both change a customer's total_bookings/total_spent/status
// server-side, so anything that mutates them must call this to keep the
// Customers page from going stale.
export function invalidateCustomers(queryClient: QueryClient) {
    queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
}

export const customerKeys = {
    all: ['customers'] as const,
    lists: () => [...customerKeys.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...customerKeys.lists(), { filters }] as const,
    details: () => [...customerKeys.all, 'detail'] as const,
    detail: (id: string) => [...customerKeys.details(), id] as const,
    bookings: (id: string) => [...customerKeys.detail(id), 'bookings'] as const,
    calls: (id: string) => [...customerKeys.detail(id), 'calls'] as const,
    insights: (id: string) => [...customerKeys.detail(id), 'insights'] as const,
    behavior: (id: string) => [...customerKeys.detail(id), 'behavior'] as const,
};

export function useCustomersList(params?: { search?: string; limit?: number }) {
    return useQuery({
        queryKey: customerKeys.list(params || {}),
        queryFn: () => customerService.getAll(params),
        staleTime: 5 * 60 * 1000,
    });
}

export function useCustomer(id: string) {
    return useQuery({
        queryKey: customerKeys.detail(id),
        queryFn: () => customerService.getById(id),
        enabled: !!id,
    });
}

export function useCustomerBookings(id: string) {
    return useQuery({
        queryKey: customerKeys.bookings(id),
        queryFn: () => customerService.getBookings(id),
        enabled: !!id,
    });
}

export function useCustomerCalls(id: string) {
    return useQuery({
        queryKey: customerKeys.calls(id),
        queryFn: () => customerService.getCalls(id),
        enabled: !!id,
    });
}

export function useCustomerInsights(id: string) {
    return useQuery({
        queryKey: customerKeys.insights(id),
        queryFn: () => customerService.getInsights(id),
        enabled: !!id,
        staleTime: 60 * 60 * 1000, // 1 hour
    });
}

export function useCustomerBehavior(id: string) {
    return useQuery({
        queryKey: customerKeys.behavior(id),
        queryFn: () => customerService.getBehavior(id),
        enabled: !!id,
    });
}

export function useCreateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCustomerRequest) => customerService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
        },
    });
}

export function useUpdateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: UpdateCustomerRequest }) =>
            customerService.update(id, updates),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: customerKeys.detail(data.id) });
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
        },
    });
}

export function useDeleteCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => customerService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
        },
    });
}

export function useUpdateCustomerBehavior() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => customerService.updateBehavior(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: customerKeys.behavior(id) });
            queryClient.invalidateQueries({ queryKey: customerKeys.insights(id) });
        },
    });
}

