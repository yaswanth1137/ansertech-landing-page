'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as Sentry from '@sentry/nextjs';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        this.setState({ errorInfo });
        
        // Log error to console in development
        if (process.env.NODE_ENV !== 'production') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }
        
        // Call optional error handler
        this.props.onError?.(error, errorInfo);
        
        // Report to Sentry (no-op if DSN is not configured)
        Sentry.captureException(error, {
            extra: { componentStack: errorInfo.componentStack },
        });
    }

    handleRetry = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleGoHome = (): void => {
        window.location.href = '/dashboard';
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-[300px] sm:min-h-[400px] flex items-center justify-center p-3.5 sm:p-8 w-full">
                    <div className="max-w-md w-full bg-card rounded-2xl p-5 sm:p-8 text-center border border-border shadow-xl">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-500/10 mb-4 sm:mb-6">
                            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                        </div>
                        
                        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                            Dashboard Module Error
                        </h2>
                        
                        <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                            An unexpected error occurred while loading this dashboard view.
                        </p>

                        {process.env.NODE_ENV !== 'production' && this.state.error && (
                            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-muted/60 rounded-xl text-left overflow-auto max-h-32 border border-border">
                                <p className="text-red-400 text-xs font-mono break-all leading-normal">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center w-full">
                            <Button
                                onClick={this.handleRetry}
                                variant="outline"
                                className="w-full sm:w-auto gap-2 text-xs sm:text-sm font-semibold"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </Button>
                            <Button
                                onClick={this.handleGoHome}
                                className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-semibold"
                            >
                                <Home className="w-4 h-4" />
                                Go to Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Higher-order component to wrap any component with error boundary
 */
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallback?: ReactNode
): React.FC<P> {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    
    const ComponentWithErrorBoundary: React.FC<P> = (props) => (
        <ErrorBoundary fallback={fallback}>
            <WrappedComponent {...props} />
        </ErrorBoundary>
    );
    
    ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
    
    return ComponentWithErrorBoundary;
}

export default ErrorBoundary;
