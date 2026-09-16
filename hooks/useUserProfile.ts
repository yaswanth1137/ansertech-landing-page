'use client';

/**
 * User Profile Hook - Uses React Query for data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';
import { useSession } from 'next-auth/react';

/**
 * Hook to fetch user profile data
 */
export const useUserProfile = () => {
    const { status } = useSession();
    const isAuthenticated = status === 'authenticated';

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['user-profile'],
        queryFn: () => dashboardService.getUserProfile(),
        enabled: isAuthenticated,
    });

    return {
        data: data || null,
        isLoading: isLoading || status === 'loading',
        error: error ? 'Failed to load profile' : null,
        refetch,
    };
};

