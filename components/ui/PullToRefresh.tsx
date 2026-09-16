'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface PullToRefreshProps {
    children: React.ReactNode;
    onRefresh?: () => Promise<void> | void;
    disabled?: boolean;
}

export default function PullToRefresh({ children, onRefresh, disabled = false }: PullToRefreshProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const touchStartY = useRef(0);
    const isPulling = useRef(false);
    const queryClient = useQueryClient();

    const PULL_THRESHOLD = 70;

    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (disabled || isRefreshing) return;
        const container = containerRef.current;
        if (!container) return;

        // Only start pull-to-refresh if container is at the top (scrollTop <= 0)
        if (container.scrollTop <= 0) {
            touchStartY.current = e.touches[0].clientY;
            isPulling.current = true;
        }
    }, [disabled, isRefreshing]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isPulling.current || disabled || isRefreshing) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - touchStartY.current;

        const container = containerRef.current;
        if (container && container.scrollTop > 0) {
            isPulling.current = false;
            setPullDistance(0);
            return;
        }

        if (diff > 0) {
            // Apply resistance formula for smooth native pull feel
            const distance = Math.min(Math.pow(diff, 0.85), 110);
            setPullDistance(distance);
        } else {
            setPullDistance(0);
        }
    }, [disabled, isRefreshing]);

    const executeRefresh = useCallback(async () => {
        setIsRefreshing(true);
        setPullDistance(PULL_THRESHOLD);

        try {
            if (onRefresh) {
                await onRefresh();
            } else {
                await queryClient.invalidateQueries();
            }
            toast.success('Page data refreshed');
        } catch (err) {
            console.error('Pull-to-refresh failed:', err);
        } finally {
            setTimeout(() => {
                setIsRefreshing(false);
                setPullDistance(0);
            }, 600);
        }
    }, [onRefresh, queryClient]);

    const handleTouchEnd = useCallback(() => {
        if (!isPulling.current) return;
        isPulling.current = false;

        if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
            executeRefresh();
        } else {
            setPullDistance(0);
        }
    }, [pullDistance, isRefreshing, executeRefresh]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: true });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

    return (
        <div ref={containerRef} className="relative flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
            {/* Pull Indicator Badge */}
            <AnimatePresence>
                {(pullDistance > 10 || isRefreshing) && (
                    <motion.div
                        initial={{ opacity: 0, y: -40, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            y: isRefreshing ? 12 : Math.min(pullDistance - 35, 20),
                            scale: isRefreshing ? 1 : Math.min(pullDistance / PULL_THRESHOLD, 1)
                        }}
                        exit={{ opacity: 0, y: -40, scale: 0.8 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                    >
                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/90 backdrop-blur-md border border-primary/30 shadow-xl text-xs font-bold text-foreground">
                            <RefreshCw className={`w-3.5 h-3.5 text-primary ${isRefreshing ? 'animate-spin' : ''}`} style={{ transform: `rotate(${pullDistance * 4}deg)` }} />
                            <span>{isRefreshing ? 'Refreshing...' : pullDistance >= PULL_THRESHOLD ? 'Release to refresh' : 'Pull down to refresh'}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area - Native zero-latency scroll when idle */}
            {pullDistance > 0 || isRefreshing ? (
                <motion.div
                    animate={{ y: isRefreshing ? 40 : Math.min(pullDistance * 0.35, 30) }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="flex-1 flex flex-col min-h-0"
                >
                    {children}
                </motion.div>
            ) : (
                <div className="flex-1 flex flex-col min-h-0">
                    {children}
                </div>
            )}
        </div>
    );
}
