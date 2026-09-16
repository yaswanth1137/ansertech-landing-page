// Optimized animation configurations for smooth, performant transitions
// Uses CSS transform and opacity for GPU-accelerated animations

import { Variants, Transition } from 'framer-motion';

// ─── Transition Presets ─────────────────────────────────────────────

export const smoothSpring: Transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 0.8,
};

export const microTransition: Transition = {
    duration: 0.15,
    ease: [0.4, 0, 0.2, 1],
};

export const fadeTransition: Transition = {
    duration: 0.2,
    ease: 'easeOut',
};

export const gentleSpring: Transition = {
    type: 'spring',
    stiffness: 200,
    damping: 25,
    mass: 1,
};

// ─── Container Stagger ──────────────────────────────────────────────

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.08,
        },
    },
};

export const staggerItem: Variants = {
    hidden: {
        opacity: 0,
        y: 12,
        scale: 0.98,
    },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: microTransition,
    },
};

// Quick stagger for table rows
export const staggerFast: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
            delayChildren: 0.05,
        },
    },
};

export const staggerFastItem: Variants = {
    hidden: { opacity: 0, y: 6 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.12, ease: [0.4, 0, 0.2, 1] },
    },
};

// ─── Card & Surface Animations ──────────────────────────────────────

export const cardHover: Variants = {
    rest: {
        y: 0,
        boxShadow: 'var(--shadow-card)',
    },
    hover: {
        y: -3,
        boxShadow: 'var(--shadow-lg)',
        transition: smoothSpring,
    },
};

export const cardEnter: Variants = {
    hidden: {
        opacity: 0,
        y: 16,
        scale: 0.97,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

// ─── Fade Variants ──────────────────────────────────────────────────

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: fadeTransition,
    },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: smoothSpring,
    },
};

// ─── Sidebar ────────────────────────────────────────────────────────

export const slideInLeft: Variants = {
    hidden: { x: -280, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    },
};

// ─── Interactive ────────────────────────────────────────────────────

export const buttonPress: Variants = {
    rest: { scale: 1 },
    pressed: { scale: 0.97, transition: { duration: 0.1 } },
    hover: { scale: 1.02, transition: smoothSpring },
};

export const pulseAnimation = {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
};

export const hoverGlow = {
    rest: { boxShadow: '0 0 0px rgba(245,202,60,0)' },
    hover: {
        boxShadow: '0 0 20px -5px rgba(245,202,60,0.15)',
        transition: { duration: 0.3 },
    },
};

// ─── Page Transitions ───────────────────────────────────────────────

export const pageTransition: Variants = {
    initial: { opacity: 0, y: 8 },
    enter: {
        opacity: 1, y: 0,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
        opacity: 0, y: -8,
        transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
    },
};

// ─── Dialog / Modal ─────────────────────────────────────────────────

export const dialogOverlay: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const dialogContent: Variants = {
    hidden: { opacity: 0, scale: 0.96, y: 8 },
    visible: {
        opacity: 1, scale: 1, y: 0,
        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
        opacity: 0, scale: 0.97, y: 4,
        transition: { duration: 0.15 },
    },
};

// ─── Tooltip ────────────────────────────────────────────────────────

export const tooltipAnimation: Variants = {
    hidden: { opacity: 0, y: -4, scale: 0.95 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.15, ease: 'easeOut' },
    },
};

// ─── Number CountUp ─────────────────────────────────────────────────

export const countUpConfig = {
    duration: 1.2,
    useEasing: true,
    useGrouping: true,
    easingFn: (t: number, b: number, c: number, d: number) => {
        t /= d;
        return c * t * t * t + b;
    },
};

// ─── Skeleton shimmer ───────────────────────────────────────────────

export const shimmerAnimation = {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
};
