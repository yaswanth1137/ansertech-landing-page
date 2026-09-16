import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services';
import { CreateBookingRequest, UpdateBookingRequest } from '@/types/models/booking';
import { invalidateCustomers } from './useCustomers';

export const bookingKeys = {
    all: ['bookings'] as const,
    lists: () => [...bookingKeys.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...bookingKeys.lists(), { filters }] as const,
    details: () => [...bookingKeys.all, 'detail'] as const,
    detail: (id: string) => [...bookingKeys.details(), id] as const,
    analytics: (days: number) => [...bookingKeys.all, 'analytics', days] as const,
    pending: () => [...bookingKeys.all, 'pending'] as const,
};

export function useBookingsList(params?: { start_date?: string; end_date?: string; status?: string }) {
    return useQuery({
        queryKey: bookingKeys.list(params || {}),
        queryFn: () => bookingService.getAll(params),
        staleTime: 5 * 60 * 1000,
    });
}

export function useBooking(id: string) {
    return useQuery({
        queryKey: bookingKeys.detail(id),
        queryFn: () => bookingService.getById(id),
        enabled: !!id,
    });
}

export function usePendingBookings() {
    return useQuery({
        queryKey: bookingKeys.pending(),
        queryFn: () => bookingService.getPending(),
        refetchInterval: 30 * 1000, // Check for pending bookings often
        refetchIntervalInBackground: false,
    });
}

export function useBookingAnalytics(days: number = 30, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: bookingKeys.analytics(days),
        queryFn: () => bookingService.getAnalytics(days),
        staleTime: 60 * 60 * 1000, // 1 hour
        enabled: options?.enabled ?? true,
    });
}

export function useCreateBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBookingRequest) => bookingService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.analytics(30) });
            invalidateCustomers(queryClient);
        },
    });
}

export function useUpdateBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: UpdateBookingRequest }) =>
            bookingService.update(id, updates),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.detail(data.id) });
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            invalidateCustomers(queryClient);
        },
    });
}

export function useDeleteBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => bookingService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.analytics(30) });
            invalidateCustomers(queryClient);
        },
    });
}

export function useConfirmBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => bookingService.confirm(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: bookingKeys.all });
            const previousBookings = queryClient.getQueryData(bookingKeys.lists());
            return { previousBookings };
        },
        onError: (err, id, context) => {
            if (context?.previousBookings) {
                queryClient.setQueryData(bookingKeys.lists(), context.previousBookings);
            }
        },
        onSettled: (data) => {
            if (data) queryClient.invalidateQueries({ queryKey: bookingKeys.detail(data.id) });
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.pending() });
            invalidateCustomers(queryClient);
        },
    });
}

export function useCancelBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => bookingService.cancel(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: bookingKeys.all });
            const previousBookings = queryClient.getQueryData(bookingKeys.lists());
            return { previousBookings };
        },
        onError: (err, id, context) => {
            if (context?.previousBookings) {
                queryClient.setQueryData(bookingKeys.lists(), context.previousBookings);
            }
        },
        onSettled: (data) => {
            if (data) queryClient.invalidateQueries({ queryKey: bookingKeys.detail(data.id) });
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            invalidateCustomers(queryClient);
        },
    });
}

export function useApproveBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => bookingService.approve(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: bookingKeys.all });
            const previousBookings = queryClient.getQueryData(bookingKeys.lists());
            const previousPending = queryClient.getQueryData(bookingKeys.pending());
            return { previousBookings, previousPending };
        },
        onError: (err, id, context) => {
            if (context?.previousBookings) {
                queryClient.setQueryData(bookingKeys.lists(), context.previousBookings);
            }
            if (context?.previousPending) {
                queryClient.setQueryData(bookingKeys.pending(), context.previousPending);
            }
        },
        onSettled: (data, error, id) => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.pending() });
            invalidateCustomers(queryClient);
        },
    });
}

export function useRejectBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
            bookingService.reject(id, reason),
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: bookingKeys.all });
            const previousBookings = queryClient.getQueryData(bookingKeys.lists());
            const previousPending = queryClient.getQueryData(bookingKeys.pending());
            return { previousBookings, previousPending };
        },
        onError: (err, { id }, context) => {
            if (context?.previousBookings) {
                queryClient.setQueryData(bookingKeys.lists(), context.previousBookings);
            }
            if (context?.previousPending) {
                queryClient.setQueryData(bookingKeys.pending(), context.previousPending);
            }
        },
        onSettled: (data, error, { id }) => {
            queryClient.invalidateQueries({ queryKey: bookingKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: bookingKeys.pending() });
            invalidateCustomers(queryClient);
        },
    });
}

