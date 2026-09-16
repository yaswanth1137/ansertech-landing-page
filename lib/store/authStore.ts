import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    business_name?: string;
    business_type?: string;
    subscription_plan?: string;
    onboarding_completed?: boolean;
    // Team (populated from /users/me/ or team hooks)
    active_team_id?: string;
    active_team_role?: 'owner' | 'admin' | 'manager' | 'viewer';
}

interface AuthState {
    // User data (in-memory only — NOT persisted to sessionStorage to avoid XSS exposure)
    user: User | null;
    
    // State
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setUserInfo: (user: User) => void;
    updateUser: (user: Partial<User>) => void;
    setLoading: (loading: boolean) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            setUserInfo: (user) => {
                set({
                    user,
                    isAuthenticated: true,
                    isLoading: false
                });
            },

            updateUser: (userData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null
                })),

            setLoading: (loading) => set({ isLoading: loading }),

            clearAuth: () =>
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false
                }),
        }),
        {
            name: 'ansertech-auth-storage',
            // Only persist auth flag — user PII stays in-memory only
            // (AuthSync re-populates user from NextAuth session on page load)
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
            }),
            storage: createJSONStorage(() => {
                if (typeof window !== 'undefined') {
                    return sessionStorage;
                }
                return {
                    getItem: () => null,
                    setItem: () => {},
                    removeItem: () => {},
                };
            }),
        }
    )
);

// Selector hooks for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
