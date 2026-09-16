import { api } from './apiClient';

export const adminService = {
    voip: {
        getStats: async () => {
            const response = await api.get('/admin/voip/stats/');
            return response.data;
        },

        getRequests: async (params?: Record<string, any>) => {
            const response = await api.get('/admin/voip/requests/', { params });
            return response.data;
        },

        getNumbers: async () => {
            const response = await api.get('/admin/voip/numbers/');
            return response.data;
        },

        approveRequest: async (id: string) => {
            const response = await api.post(`/admin/voip/requests/${id}/approve/`);
            return response.data;
        },

        rejectRequest: async (id: string, reason: string) => {
            const response = await api.post(`/admin/voip/requests/${id}/reject/`, { reason });
            return response.data;
        },

        assignNumber: async (id: string, phoneNumberId: string) => {
            const response = await api.post(`/admin/voip/requests/${id}/assign_number/`, {
                phone_number_id: phoneNumberId
            });
            return response.data;
        },

        unassignNumber: async (id: string) => {
            const response = await api.post(`/admin/voip/numbers/${id}/unassign/`);
            return response.data;
        }
    }
};
