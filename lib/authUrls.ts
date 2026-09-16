const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.ansertech.com';
const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://dashboard.ansertech.com';
const PARTNERS_URL = process.env.NEXT_PUBLIC_PARTNERS_URL || 'https://partners.ansertech.com';

export type AuthPath = '/login' | '/register' | '/forgot-password' | '/reset-password';
export type AuthDest = 'dashboard' | 'partners';

/**
 * Single choke point for "where is the login page" — auth.ansertech.com in
 * production, relative paths in dev (where there's no subdomain routing).
 * Every hardcoded /login, /register, /forgot-password, /reset-password
 * reference should go through this instead of a literal string, so moving
 * auth to its own subdomain again someday only requires touching this file.
 */
export function authUrl(path: AuthPath, params?: Record<string, string>): string {
    if (process.env.NODE_ENV !== 'production') {
        const qs = params ? `?${new URLSearchParams(params)}` : '';
        return `${path}${qs}`;
    }
    const url = new URL(path, AUTH_URL);
    Object.entries(params || {}).forEach(([k, v]) => url.searchParams.set(k, v));
    return url.toString();
}

/**
 * Single choke point for "where is the dashboard" — post-login/register/
 * Google-auth flows call this instead of a relative router.push('/dashboard'),
 * since those flows can now be initiated from auth.ansertech.com (a different
 * origin than dashboard.ansertech.com) — a relative client-side navigation
 * would stay on the auth host instead of crossing over to the real dashboard.
 *
 * `dest` picks which app to land on — auth.ansertech.com is a shared gateway
 * for both dashboard.ansertech.com and partners.ansertech.com, so the
 * post-login destination can't be hardcoded to dashboard.
 */
export function dashboardUrl(path: string = '/', dest?: AuthDest): string {
    if (process.env.NODE_ENV !== 'production') {
        return path;
    }
    const base = dest === 'partners' ? PARTNERS_URL : DASHBOARD_URL;
    return new URL(path, base).toString();
}

/**
 * Reads the `?redirect=` (relative path, open-redirect-safe) and `?dest=`
 * (whitelisted app name) query params set by authUrl() and resolves them
 * back to the correct app's absolute URL. Centralizes the redirect-target
 * logic so login/register/Google-auth flows don't each re-derive it.
 */
export function resolveDestUrl(searchParams: URLSearchParams): string {
    const dest: AuthDest | undefined = searchParams.get('dest') === 'partners' ? 'partners' : undefined;
    const redirect = searchParams.get('redirect');
    const safe = redirect && !redirect.startsWith('http') && !redirect.startsWith('//') ? redirect : '/';
    return dashboardUrl(safe, dest);
}
