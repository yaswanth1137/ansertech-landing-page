import { api } from './apiClient';
import { validateResponse } from './validation';
import { CustomerSchema, CustomerInsightsSchema, CustomerBehaviorSchema } from '@/lib/validations/customer';
import {
    Customer,
    CreateCustomerRequest,
    UpdateCustomerRequest,
    CustomerInsights,
    CustomerBehavior
} from '@/types/models/customer';

import { BookingSchema } from '@/lib/validations/booking';
import { CallSchema } from '@/lib/validations/call';

export const customerService = {
    getAll: async (params?: { search?: string; limit?: number }) => {
        // Follow pagination so the Customers page sees everyone, not just the
        // first 20 (DRF PAGE_SIZE=20) — otherwise stats/counts silently cap out.
        type CustomerPage = { results?: Customer[]; next?: string | null } | Customer[];
        const results: Customer[] = [];
        let url: string | null = '/customers/';
        let requestParams: typeof params | undefined = params;
        let guard = 0;
        while (url && guard < 50) {
            const response: { data: CustomerPage } = await api.get<CustomerPage>(
                url,
                requestParams ? { params: requestParams } : undefined
            );
            const body: CustomerPage = response.data;
            const pageResults: Customer[] = Array.isArray(body) ? body : (body.results || []);
            results.push(...pageResults);
            url = Array.isArray(body) ? null : (body.next || null);
            requestParams = undefined; // `next` already has query params embedded
            guard++;
        }
        return validateResponse(CustomerSchema.array(), results);
    },

    getById: async (id: string) => {
        const response = await api.get<Customer>(`/customers/${id}/`);
        return validateResponse(CustomerSchema, response.data);
    },

    create: async (data: CreateCustomerRequest) => {
        const response = await api.post<Customer>('/customers/', data);
        return validateResponse(CustomerSchema, response.data);
    },

    update: async (id: string, updates: UpdateCustomerRequest) => {
        const response = await api.patch<Customer>(`/customers/${id}/`, updates);
        return validateResponse(CustomerSchema, response.data);
    },

    delete: async (id: string) => {
        await api.delete(`/customers/${id}/`);
    },

    getBookings: async (id: string) => {
        const response = await api.get<any[] | { results: any[] }>(`/customers/${id}/bookings/`);
        const data = Array.isArray(response.data) ? response.data : response.data.results;
        return validateResponse(BookingSchema.array(), data);
    },

    getCalls: async (id: string) => {
        const response = await api.get<any[] | { results: any[] }>(`/customers/${id}/calls/`);
        const data = Array.isArray(response.data) ? response.data : response.data.results;
        return validateResponse(CallSchema.array(), data);
    },

    getInsights: async (id: string) => {
        const response = await api.get<CustomerInsights>(`/customers/${id}/insights/`);
        return validateResponse(CustomerInsightsSchema, response.data);
    },

    getBehavior: async (id: string) => {
        const response = await api.get<CustomerBehavior>(`/customers/${id}/behavior/`);
        return validateResponse(CustomerBehaviorSchema, response.data);
    },

    updateBehavior: async (id: string) => {
        const response = await api.post<CustomerBehavior>(`/customers/${id}/behavior/`);
        return validateResponse(CustomerBehaviorSchema, response.data);
    }
};
