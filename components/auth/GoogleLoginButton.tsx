"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import { useGoogleLogin } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

declare global {
    interface Window {
        google: any;
    }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface GoogleLoginButtonProps {
    mode?: 'signin' | 'signup';
    text?: string;
}

export default function GoogleLoginButton({ mode = 'signin', text }: GoogleLoginButtonProps) {
    const googleLoginMutation = useGoogleLogin();
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);

    // Stable ref to avoid re-creating the GIS callback on every render
    const mutationRef = useRef(googleLoginMutation);
    mutationRef.current = googleLoginMutation;

    const handleCredentialResponse = useCallback(async (response: any) => {
        if (!response?.credential) {
            toast.error('No credential received from Google');
            return;
        }
        try {
            await mutationRef.current.mutate(response.credential);
        } catch (error: any) {
            console.error('Google login error:', error);
            toast.error(
                error?.message || 'Failed to sign in with Google'
            );
        }
    }, []);

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.startsWith('your-')) {
            console.error('Google OAuth: NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.');
            return;
        }

        // If GIS script is already loaded globally, just initialize
        if (window.google?.accounts?.id) {
            setIsScriptLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => setIsScriptLoaded(true);
        script.onerror = () => {
            console.error('Failed to load Google Identity Services script');
            toast.error('Could not load Google Sign-In. Please try again later.');
        };
        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    // Initialize GIS + render button once script is loaded
    useEffect(() => {
        if (!isScriptLoaded || !window.google?.accounts?.id || !buttonRef.current) return;
        if (!GOOGLE_CLIENT_ID) return;

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            ux_mode: 'popup',
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
            theme: 'outline',
            size: 'large',
            width: buttonRef.current.offsetWidth || 352,
            text: mode === 'signup' ? 'signup_with' : 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
        });
    }, [isScriptLoaded, handleCredentialResponse, mode]);

    const isPending = googleLoginMutation.isPending;
    const label = text || (mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google');

    const handleCustomClick = () => {
        // If GIS button is present inside buttonRef, trigger click on GIS iframe/button
        const gisButton = buttonRef.current?.querySelector('div[role="button"]') as HTMLElement | null;
        if (gisButton) {
            gisButton.click();
            return;
        }
        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.startsWith('your-')) {
            toast.info(`Google Auth plugin enabled on frontend. Configure GOOGLE_CLIENT_ID in .env to connect live backend.`);
            return;
        }
    };

    return (
        <div className="w-full relative">
            {/* Hidden container for GIS script button rendering */}
            <div
                ref={buttonRef}
                className="hidden"
            />

            {/* Custom High-Fidelity Branded Google Sign-In / Sign-Up Button */}
            <button
                type="button"
                onClick={handleCustomClick}
                disabled={isPending}
                className="w-full h-10 sm:h-11 rounded-xl border border-border/80 bg-background hover:bg-muted/60 transition-all duration-300 flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium text-foreground shadow-sm hover:shadow-md disabled:opacity-50 group"
            >
                {isPending ? (
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Loader2 className="w-4 h-4 animate-spin text-yellow" />
                        <span>Connecting to Google...</span>
                    </div>
                ) : (
                    <>
                        {/* Official Google Multi-Color G Logo SVG */}
                        <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span className="tracking-tight">{label}</span>
                    </>
                )}
            </button>
        </div>
    );
}
