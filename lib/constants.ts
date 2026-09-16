/**
 * Application Constants
 * 
 * Centralized configuration values to avoid magic numbers throughout the codebase.
 */

// ============================================================================
// API & Network
// ============================================================================

export const API_CONSTANTS = {
    /** Default timeout for API requests in milliseconds */
    DEFAULT_TIMEOUT: 30000,
    /** Timeout for AI service requests */
    AI_SERVICE_TIMEOUT: 60000,
    /** Max retries for failed requests */
    MAX_RETRIES: 3,
    /** Base retry delay in milliseconds */
    RETRY_DELAY_BASE: 1000,
} as const;

// ============================================================================
// Pagination
// ============================================================================

export const PAGINATION = {
    /** Default page size for lists */
    DEFAULT_PAGE_SIZE: 10,
    /** Page size for activity feed */
    ACTIVITY_FEED_SIZE: 20,
    /** Max items per page */
    MAX_PAGE_SIZE: 100,
} as const;

// ============================================================================
// Cache & Performance
// ============================================================================

export const CACHE = {
    /** Default cache TTL in seconds */
    DEFAULT_TTL: 300, // 5 minutes
    /** Dashboard cache TTL */
    DASHBOARD_TTL: 60, // 1 minute
    /** Embedding cache TTL */
    EMBEDDING_TTL: 3600, // 1 hour
    /** Session cache TTL */
    SESSION_TTL: 86400, // 24 hours
} as const;

// ============================================================================
// AI & Embeddings
// ============================================================================

export const AI = {
    /** Local embedding model dimensions (MiniLM-L6-v2) */
    EMBEDDING_DIMENSIONS: 384,
    /** Max tokens for text before truncation */
    MAX_TEXT_LENGTH: 2000,
    /** Default temperature for AI responses */
    DEFAULT_TEMPERATURE: 0.7,
    /** Max tokens for AI generation */
    DEFAULT_MAX_TOKENS: 500,
} as const;

// ============================================================================
// Agent Configuration
// ============================================================================

export const AGENT = {
    /** Max length for agent name */
    NAME_MAX_LENGTH: 100,
    /** Max length for system prompt */
    SYSTEM_PROMPT_MAX_LENGTH: 10000,
    /** Max length for description */
    DESCRIPTION_MAX_LENGTH: 500,
    /** Default voice ID */
    DEFAULT_VOICE_ID: 'eleven_multilingual_v2',
    /** Default language */
    DEFAULT_LANGUAGE: 'en',
} as const;

// ============================================================================
// Booking Configuration
// ============================================================================

export const BOOKING = {
    /** Minimum party size */
    MIN_PARTY_SIZE: 1,
    /** Maximum party size */
    MAX_PARTY_SIZE: 50,
    /** Advance booking days limit */
    MAX_ADVANCE_DAYS: 90,
    /** Minimum advance booking hours */
    MIN_ADVANCE_HOURS: 1,
} as const;

// ============================================================================
// Subscription Limits
// ============================================================================

export const SUBSCRIPTION_LIMITS = {
    free: {
        agents: 1,
        calls_per_month: 50,
        minutes_per_month: 30,
        bookings_per_month: 20,
    },
    starter: {
        agents: 3,
        calls_per_month: 500,
        minutes_per_month: 300,
        bookings_per_month: 200,
    },
    professional: {
        agents: 10,
        calls_per_month: 2000,
        minutes_per_month: 1500,
        bookings_per_month: 1000,
    },
    enterprise: {
        agents: -1, // Unlimited
        calls_per_month: -1,
        minutes_per_month: -1,
        bookings_per_month: -1,
    },
} as const;

// ============================================================================
// UI Constants
// ============================================================================

export const UI = {
    /** Animation duration in ms */
    ANIMATION_DURATION: 200,
    /** Debounce delay for search */
    SEARCH_DEBOUNCE: 300,
    /** Toast display duration */
    TOAST_DURATION: 5000,
    /** Dashboard sidebar width, expanded, in pixels */
    SIDEBAR_WIDTH: 240,
    /** Dashboard sidebar width, collapsed, in pixels */
    SIDEBAR_WIDTH_COLLAPSED: 72,
} as const;

// ============================================================================
// Date & Time Formats
// ============================================================================

export const DATE_FORMATS = {
    /** Standard date display */
    DATE_DISPLAY: 'MMM dd, yyyy',
    /** Time display */
    TIME_DISPLAY: 'h:mm a',
    /** Full datetime */
    DATETIME_DISPLAY: 'MMM dd, yyyy h:mm a',
    /** API date format */
    API_DATE: 'yyyy-MM-dd',
    /** API datetime format */
    API_DATETIME: "yyyy-MM-dd'T'HH:mm:ss'Z'",
} as const;

// ============================================================================
// Validation Patterns
// ============================================================================

export const VALIDATION = {
    /** Email regex pattern */
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    /** Phone regex pattern (international) */
    PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
    /** UUID regex pattern */
    UUID_REGEX: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
} as const;

export default {
    API_CONSTANTS,
    PAGINATION,
    CACHE,
    AI,
    AGENT,
    BOOKING,
    SUBSCRIPTION_LIMITS,
    UI,
    DATE_FORMATS,
    VALIDATION,
};
