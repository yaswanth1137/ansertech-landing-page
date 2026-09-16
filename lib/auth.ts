/**
 * NextAuth configuration — extracted to a separate file to fix
 * next-auth v4 + Turbopack compilation issues in Next.js 15.
 *
 * Keeping authOptions in the route.ts directly causes Turbopack to
 * fail compiling the large module, returning an HTML error page
 * instead of JSON → CLIENT_FETCH_ERROR "Unexpected token '<'".
 */
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const BACKEND_URL = process.env.NEXTAUTH_BACKEND_URL || API_URL;
const API_BASE = BACKEND_URL.replace(/\/v\d+\/?$/, '');

const ACCESS_TOKEN_LIFETIME_MS = 60 * 60 * 1000; // 1 hour
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000;       // 5 min early refresh

// Simple in-memory lock to prevent concurrent refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

async function fetchPrimaryTeam(accessToken: string): Promise<{ id: string; role: string } | null> {
    try {
        const res = await fetch(`${BACKEND_URL}/teams/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) return null;
        const contentType = res.headers.get('content-type');
        if (!contentType?.includes('application/json')) return null;
        const body = await res.json();
        const teams = body?.data ?? body?.results ?? body;
        const primary = Array.isArray(teams) ? teams[0] : null;
        if (!primary) return null;
        return { id: primary.id, role: primary.my_role || 'viewer' };
    } catch {
        return null;
    }
}

async function refreshAccessToken(token: any) {
    if (isRefreshing && refreshPromise) {
        try { return await refreshPromise; } catch { /* fall through */ }
    }
    isRefreshing = true;
    refreshPromise = doRefreshToken(token);
    try {
        return await refreshPromise;
    } finally {
        isRefreshing = false;
        refreshPromise = null;
    }
}

async function doRefreshToken(token: any) {
    try {
        const response = await fetch(`${API_BASE}/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: token.refreshToken }),
        });

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            const text = await response.text();
            console.error('Token refresh: non-JSON response:', text.substring(0, 100));
            throw new Error('Server error during token refresh');
        }

        const data = await response.json();

        if (!response.ok) {
            const detail = data.detail || data.code || data?.error?.detail || JSON.stringify(data);
            throw new Error(typeof detail === 'string' ? detail : 'Token refresh failed');
        }

        const tokenData = (data && 'success' in data && data.success && data.data) ? data.data : data;
        const accessTokenExpires = Date.now() + ACCESS_TOKEN_LIFETIME_MS;

        return {
            ...token,
            accessToken: tokenData.access,
            accessTokenExpires,
            refreshToken: tokenData.refresh || token.refreshToken,
            error: undefined,
        };
    } catch (error: any) {
        console.error('Token refresh error:', error.message);
        if (error.message?.includes('blacklist') || error.message?.includes('invalid')) {
            return { ...token, accessToken: null, refreshToken: null, error: 'RefreshAccessTokenError' };
        }
        return { ...token, error: 'RefreshAccessTokenError' };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: { prompt: 'consent', access_type: 'offline', response_type: 'code' },
            },
        }),
        CredentialsProvider({
            id: 'google-credential',
            name: 'Google Token',
            credentials: { credential: { label: 'Google ID Token', type: 'text' } },
            async authorize(credentials) {
                if (!credentials?.credential) throw new Error('Google credential is required');
                try {
                    const res = await fetch(`${BACKEND_URL}/auth/google_login/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ credential: credentials.credential }),
                    });
                    const contentType = res.headers.get('content-type');
                    if (!contentType?.includes('application/json')) {
                        const text = await res.text();
                        console.error('Google auth: non-JSON:', text.substring(0, 200));
                        throw new Error('Server error during Google authentication');
                    }
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || data.detail || 'Google authentication failed');
                    if (!data.user || !data.access || !data.refresh) throw new Error('Invalid server response from Google login');
                    const accessTokenExpires = Date.now() + ACCESS_TOKEN_LIFETIME_MS;
                    return {
                        id: data.user.id, email: data.user.email,
                        name: `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim() || data.user.email,
                        first_name: data.user.first_name, last_name: data.user.last_name,
                        business_name: data.user.business_name, business_type: data.user.business_type,
                        subscription_plan: data.user.subscription_plan,
                        onboarding_completed: data.user.onboarding_completed,
                        accessToken: data.access, refreshToken: data.refresh, accessTokenExpires,
                        user: data.user,
                    };
                } catch (error: any) {
                    throw new Error(error.message || 'Google authentication failed');
                }
            },
        }),
        CredentialsProvider({
            id: 'credentials',
            name: 'Email & Password',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }
                try {
                    const res = await fetch(`${BACKEND_URL}/auth/login/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
                    });
                    const contentType = res.headers.get('content-type');
                    if (!contentType?.includes('application/json')) {
                        const text = await res.text();
                        console.error('Auth: non-JSON:', text.substring(0, 200));
                        throw new Error('Server error - please ensure Django is running');
                    }
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || data.detail || 'Invalid credentials');
                    if (!data.user) throw new Error('Invalid server response: missing user data');
                    if (!data.access || !data.refresh) throw new Error('Invalid server response: missing tokens');
                    const accessTokenExpires = Date.now() + ACCESS_TOKEN_LIFETIME_MS;
                    return {
                        id: data.user.id, email: data.user.email,
                        name: `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim() || data.user.email,
                        first_name: data.user.first_name, last_name: data.user.last_name,
                        business_name: data.user.business_name, business_type: data.user.business_type,
                        subscription_plan: data.user.subscription_plan,
                        onboarding_completed: data.user.onboarding_completed,
                        accessToken: data.access, refreshToken: data.refresh, accessTokenExpires,
                        user: data.user,
                    };
                } catch (error: any) {
                    throw new Error(error.message || 'Authentication failed');
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, trigger, session }) {
            if (account?.provider === 'google' && account.id_token) {
                try {
                    const res = await fetch(`${BACKEND_URL}/auth/google_login/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ credential: account.id_token }),
                    });
                    const contentType = res.headers.get('content-type');
                    let data: any = {};
                    if (contentType?.includes('application/json')) data = await res.json();
                    if (!res.ok) return { ...token, error: 'GoogleLoginError' };
                    const accessTokenExpires = Date.now() + ACCESS_TOKEN_LIFETIME_MS;
                    const primaryTeam = await fetchPrimaryTeam(data.access);
                    return {
                        ...token,
                        accessToken: data.access, refreshToken: data.refresh, accessTokenExpires,
                        user: { ...data.user, active_team_id: primaryTeam?.id, active_team_role: primaryTeam?.role },
                    };
                } catch {
                    return { ...token, error: 'GoogleLoginError' };
                }
            }

            if (user) {
                const primaryTeam = await fetchPrimaryTeam(user.accessToken as string);
                return {
                    ...token,
                    accessToken: user.accessToken, refreshToken: user.refreshToken,
                    accessTokenExpires: user.accessTokenExpires,
                    user: { ...(user.user as any), active_team_id: primaryTeam?.id, active_team_role: primaryTeam?.role },
                };
            }

            if (trigger === 'update' && session && token.user) {
                token.user = { ...(token.user as any), ...session };
                return token;
            }

            const now = Date.now();
            const expiresAt = (token.accessTokenExpires as number) || 0;
            if (now < expiresAt - TOKEN_EXPIRY_BUFFER) return token;
            return await refreshAccessToken(token);
        },
        async session({ session, token }) {
            // SECURITY: Only expose access token to client, never the refresh token
            // Refresh tokens are kept server-side only to prevent theft via XSS
            session.accessToken = token.accessToken as string;
            // session.refreshToken intentionally omitted - kept server-side only
            session.accessTokenExpires = token.accessTokenExpires as number;
            session.error = token.error as string | undefined;
            if (token.user) session.user = { ...session.user, ...(token.user as any) };
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60,
    },
    // Shared across ansertech.com, dashboard.ansertech.com and partners.ansertech.com
    // so a session started on one host is recognized on the others. Left as default
    // (host-only, no `secure`) outside production so localhost dev logins still work.
    // csrfToken keeps its default __Host- prefixed cookie (host-scoped only —
    // the __Host- spec forbids a `domain` attribute).
    ...((process.env.NODE_ENV === 'production' || process.env.NEXTAUTH_COOKIE_DOMAIN) ? {
        cookies: {
            sessionToken: {
                name: process.env.NODE_ENV === 'production' ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
                options: {
                    httpOnly: true,
                    sameSite: 'lax',
                    path: '/',
                    secure: process.env.NODE_ENV === 'production',
                    domain: process.env.NEXTAUTH_COOKIE_DOMAIN || '.ansertech.com'
                },
            },
            callbackUrl: {
                name: process.env.NODE_ENV === 'production' ? `__Secure-next-auth.callback-url` : `next-auth.callback-url`,
                options: {
                    sameSite: 'lax',
                    path: '/',
                    secure: process.env.NODE_ENV === 'production',
                    domain: process.env.NEXTAUTH_COOKIE_DOMAIN || '.ansertech.com'
                },
            },
        },
    } : {}),
    debug: process.env.NODE_ENV === 'development',
};
