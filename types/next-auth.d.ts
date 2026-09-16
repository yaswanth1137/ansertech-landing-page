import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        accessToken: string;
        // SECURITY: refreshToken intentionally removed from Session
        // Refresh tokens are kept server-side only to prevent theft via XSS
        accessTokenExpires?: number;
        error?: string;
        user: {
            id: string;
            email: string;
            name: string;
            first_name?: string;
            last_name?: string;
            business_name?: string;
            business_type?: string;
            subscription_plan?: string;
            onboarding_completed?: boolean;
            is_admin_team?: boolean;
            admin_team_role?: 'admin-team' | '';
            // Team info (populated from /users/me/)
            active_team_id?: string;
            active_team_role?: 'owner' | 'admin' | 'manager' | 'viewer';
        };
    }

    interface User {
        id: string;
        email: string;
        name: string;
        accessToken: string;
        refreshToken: string;  // Kept here for internal NextAuth use only
        accessTokenExpires?: number;
        user: Session['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string;
        refreshToken: string;  // Server-side only - never exposed to browser
        accessTokenExpires?: number;
        error?: string;
        user: {
            id: string;
            email: string;
            first_name?: string;
            last_name?: string;
            business_name?: string;
            business_type?: string;
            subscription_plan?: string;
            onboarding_completed?: boolean;
            is_admin_team?: boolean;
            admin_team_role?: 'admin-team' | '';
            active_team_id?: string;
            active_team_role?: 'owner' | 'admin' | 'manager' | 'viewer';
        };
    }
}
