'use client';

import { useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { authUrl } from '@/lib/authUrls';

interface AuthGuardProps {
    children: React.ReactNode;
}

/**
 * AuthGuard - Protects routes using NextAuth session
 * Redirects unauthenticated users to login page
 *
 * Only ever mounted inside app/dashboard/layout.tsx (via DashboardLayoutClient) —
 * every page it wraps is inherently protected dashboard content, so there is no
 * "public route" exception here. A previous version carried a PUBLIC_ROUTES
 * allowlist (including '/', meant for the marketing homepage this component
 * never actually wraps) — that was a real security hole: middleware rewrites
 * dashboard.ansertech.com/ internally to /dashboard, but usePathname() reflects
 * the browser-visible URL, which is still "/" — matching the allowlist and
 * skipping the auth check entirely for unauthenticated visitors to that host's
 * root. Removed rather than patched, since nothing reaching this component is
 * ever legitimately public.
 */
export default function AuthGuard({ children }: AuthGuardProps) {
    // Dev mode override for local UI component preview
    if (process.env.NODE_ENV !== 'production') {
        return <>{children}</>;
    }
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const redirectToLogin = useCallback(() => {
        if (typeof window === 'undefined') {
            router.push(authUrl('/login'));
            return;
        }

        const authWindow = window as Window & { _isSigningOut?: boolean };
        if (authWindow._isSigningOut) return;

        authWindow._isSigningOut = true;
        signOut({ redirect: false }).finally(() => {
            // Use window.location.replace so the browser doesn't keep the
            // protected page in history, and so _isSigningOut stays true
            // until the page actually unloads (preventing spurious toasts).
            // authUrl() returns an absolute cross-subdomain URL in production —
            // a relative router.push would 404 on dashboard./partners. hosts
            // (their middleware rewrites unprefixed paths like /login away).
            window.location.replace(authUrl('/login', { redirect: pathname }));
        });
    }, [pathname, router]);

    // Debug logging in development
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('[AuthGuard] Status:', status, 'Path:', pathname);
            console.log('[AuthGuard] Session:', session ? {
                hasAccessToken: !!session.accessToken,
                hasUser: !!session.user,
                userEmail: session.user?.email,
                error: session.error
            } : 'null');
        }
    }, [session, status, pathname]);

    useEffect(() => {
        // Wait for session to be determined
        if (status === 'loading') {
            return;
        }

        const isAuthenticated = status === 'authenticated' && !!session?.accessToken;
        const hasExpiredSession = status === 'authenticated' && (!session?.accessToken || !!session?.error);

        if (hasExpiredSession) {
            console.log('[AuthGuard] Session expired, redirecting to login');
            redirectToLogin();
            return;
        }

        if (!isAuthenticated) {
            console.log('[AuthGuard] Not authenticated, redirecting to login');
            if (typeof window !== 'undefined') {
                window.location.href = authUrl('/login', { redirect: pathname });
            } else {
                router.push(authUrl('/login', { redirect: pathname }));
            }
            return;
        }

        // Check if onboarding is completed — redirect to /onboarding if not
        if (session?.user) {
            const user = session.user;
            if (user.onboarding_completed === false && !pathname.includes('onboarding')) {
                router.push('/onboarding');
            }
        }
    }, [session, status, pathname, router, redirectToLogin]);

    // Show loading state while checking auth
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Only render if authenticated
    const isAuthenticated = status === 'authenticated' && !!session?.accessToken;
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                    <p className="text-gray-400">Redirecting...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
