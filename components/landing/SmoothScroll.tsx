"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const shouldUseNativeScroll = pathname?.startsWith('/dashboard');

    useEffect(() => {
        // Skip Lenis smooth scroll on mobile touch devices or dashboard for maximum native 120Hz performance
        const isMobileTouch = typeof window !== 'undefined' && (window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches);
        if (shouldUseNativeScroll || isMobileTouch) return;

        const lenis = new Lenis({
            duration: 0.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            wheelMultiplier: 1,
            touchMultiplier: 1,
            smoothWheel: true,
            syncTouch: false,
            prevent: (node) => {
                if (!(node instanceof Element)) return false;

                return Boolean(
                    node.closest(
                        [
                            "[data-lenis-prevent]",
                            "[role='dialog']",
                            ".overflow-y-auto",
                            ".overflow-auto",
                            ".scroll-container",
                            ".custom-scrollbar",
                        ].join(", ")
                    )
                );
            },
        });

        let frameId = 0;
        function raf(time: number) {
            lenis.raf(time);
            frameId = requestAnimationFrame(raf);
        }

        frameId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(frameId);
            lenis.destroy();
        };
    }, [shouldUseNativeScroll]);

    return <>{children}</>;
}
