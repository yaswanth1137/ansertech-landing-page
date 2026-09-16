import { api } from './apiClient';
import { validateResponse } from './validation';
import { BookingSchema, BookingAnalyticsSchema } from '@/lib/validations/booking';
import {
    Booking,
    CreateBookingRequest,
    UpdateBookingRequest,
    BookingAnalytics
} from '@/types/models/booking';

export const bookingService = {
    getAll: async (params?: { start_date?: string; end_date?: string; status?: string }) => {
        // Follow pagination so callers (e.g. the calendar view) see every booking
        // in range, not just the first page (DRF PAGE_SIZE=20).
        const results: Booking[] = [];
        let url: string | null = '/bookings/';
        let requestParams: typeof params | undefined = params;
        let guard = 0;
        type BookingPage = { results?: Booking[]; next?: string | null } | Booking[];
        while (url && guard < 50) {
            const response: { data: BookingPage } = await api.get<BookingPage>(
                url,
                requestParams ? { params: requestParams } : undefined
            );
            const body: BookingPage = response.data;
            const pageResults: Booking[] = Array.isArray(body) ? body : (body.results || []);
            results.push(...pageResults);
            url = Array.isArray(body) ? null : (body.next || null);
            requestParams = undefined; // `next` already has query params embedded
            guard++;
        }
        return validateResponse(BookingSchema.array(), results);
    },

    getById: async (id: string) => {
        const response = await api.get<Booking>(`/bookings/${id}/`);
        return validateResponse(BookingSchema, response.data);
    },

    create: async (data: CreateBookingRequest) => {
        const response = await api.post<Booking>('/bookings/', data);
        return validateResponse(BookingSchema, response.data);
    },

    update: async (id: string, updates: UpdateBookingRequest) => {
        const response = await api.patch<Booking>(`/bookings/${id}/`, updates);
        return validateResponse(BookingSchema, response.data);
    },

    delete: async (id: string) => {
        await api.delete(`/bookings/${id}/`);
    },

    confirm: async (id: string) => {
        const response = await api.post<Booking>(`/bookings/${id}/confirm/`);
        return validateResponse(BookingSchema, response.data);
    },

    cancel: async (id: string) => {
        const response = await api.post<Booking>(`/bookings/${id}/cancel/`);
        return validateResponse(BookingSchema, response.data);
    },

    getPending: async () => {
        const response = await api.get<{ results: Booking[] } | Booking[]>('/bookings/pending/');
        const data = 'results' in response.data ? response.data.results : response.data;
        return validateResponse(BookingSchema.array(), data);
    },

    approve: async (id: string) => {
        const response = await api.post<{ status: string; confirmation_code: string }>(`/bookings/${id}/approve/`);
        return response.data;
    },

    reject: async (id: string, reason?: string) => {
        const response = await api.post<{ status: string }>(`/bookings/${id}/reject/`, { reason });
        return response.data;
    },

    getAnalytics: async (days: number = 30) => {
        const response = await api.get<BookingAnalytics>('/bookings/analytics/', { params: { days } });
        return validateResponse(BookingAnalyticsSchema, response.data);
    }
};
