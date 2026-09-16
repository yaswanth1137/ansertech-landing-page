export interface KnowledgeBaseItem {
    id: string;
    title: string;
    content: string;
    type: 'faq' | 'document' | 'url';
    created_at: string;
}

export interface AgentKnowledgeBase {
    items: KnowledgeBaseItem[];
    last_updated?: string | null;
}

/* ── Agent Type System ────────────────────────────────────── */

/** Backend agent type codes */
export type AgentTypeCode = 'VOICEPIXEL' | 'BOOKPIXEL' | 'INSIGHTPIXEL' | 'CONTEXIA';

/** Frontend display type keys (used in AgentCard) */
export type AgentDisplayType = 'voice' | 'booking' | 'insights' | 'marketing';

/** Maps backend codes to frontend display keys */
export const AGENT_TYPE_MAP: Record<AgentTypeCode, AgentDisplayType> = {
    VOICEPIXEL:   'voice',
    BOOKPIXEL:    'booking',
    INSIGHTPIXEL: 'insights',
    CONTEXIA:     'marketing',
} as const;

/** Maps frontend display keys back to backend codes */
export const AGENT_TYPE_REVERSE_MAP: Record<AgentDisplayType, AgentTypeCode> = {
    voice:     'VOICEPIXEL',
    booking:   'BOOKPIXEL',
    insights:  'INSIGHTPIXEL',
    marketing: 'CONTEXIA',
} as const;

/** Convert backend type code to frontend display type */
export function toDisplayType(backendType: string | null | undefined): AgentDisplayType {
    if (!backendType) return 'voice';
    return AGENT_TYPE_MAP[backendType.toUpperCase() as AgentTypeCode] ?? 'voice';
}

/** Convert frontend display type to backend type code */
export function toBackendType(displayType: AgentDisplayType): AgentTypeCode {
    return AGENT_TYPE_REVERSE_MAP[displayType] ?? 'VOICEPIXEL';
}

/** Agent type spec from /api/agents/types/ */
export interface AgentTypeSpec {
    code: AgentTypeCode;
    label: string;
    description: string;
    icon: string;
    color: string;
    defaults: {
        booking_enabled: boolean;
        escalation_enabled: boolean;
        auto_respond: boolean;
    };
    default_tool_categories: string[];
}

export interface AgentTypesResponse {
    types: AgentTypeSpec[];
    industry_type_map: Record<string, AgentTypeCode>;
    purpose_type_map: Record<string, AgentTypeCode>;
}

/* ── Agent Model ──────────────────────────────────────────── */

export interface Agent {
    id: string;
    name: string;
    type?: AgentTypeCode | string | null;
    status?: 'active' | 'paused' | 'inactive' | 'training' | null;
    description?: string | null;
    voice_id?: string | null;
    voice_temperature?: number | null;
    voice_speed?: number | null;
    language?: string | null;
    phone_number?: string | null;
    // Industry & config
    industry_template?: string | null;
    config_answers?: Record<string, unknown> | null;
    full_config?: Record<string, unknown> | null;
    begin_message_variant?: string | null;
    // AI
    ai_model?: string | null;
    system_prompt?: string | null;
    temperature?: number | null;
    max_tokens?: number | null;
    // Knowledge
    knowledge_base?: AgentKnowledgeBase | null;
    // Schedule
    schedule_enabled?: boolean | null;
    schedule_timezone?: string | null;
    schedule_hours?: string | null;
    // Behavior
    auto_respond?: boolean | null;
    escalation_enabled?: boolean | null;
    escalation_phone?: string | null;
    booking_enabled?: boolean | null;
    // Integrations
    integrations?: Record<string, unknown> | null;
    // Sync
    sync_status?: 'pending' | 'syncing' | 'synced' | 'failed' | 'not_synced' | null;
    sync_error?: string | null;
    // Computed
    ai_enhanced?: boolean | null;
    enhancement_provider?: string | null;
    // Metrics
    total_calls?: number | null;
    total_bookings?: number | null;
    success_rate?: number | null;
    avg_call_duration?: number | null;
    avg_response_time?: number | null;
    // Timestamps
    created_at?: string | null;
    updated_at?: string | null;
    last_active?: string | null;
}

export interface CreateAgentRequest {
    name: string;
    type: string;
    description?: string;
    voice_id: string;
    language?: string;
    system_prompt?: string;
}

export interface UpdateAgentRequest {
    name?: string;
    description?: string;
    status?: 'active' | 'paused' | 'inactive';
    voice_id?: string;
    voice_temperature?: number;
    voice_speed?: number;
    language?: string;
    system_prompt?: string;
    ai_model?: string;
    temperature?: number;
    max_tokens?: number;
    schedule_enabled?: boolean;
    schedule_timezone?: string;
    schedule_hours?: string;
    escalation_phone?: string;
    begin_message_variant?: string;
    greeting_template?: string;
    max_call_duration?: number;
    team?: string | null;
    auto_respond?: boolean;
    booking_enabled?: boolean;
    escalation_enabled?: boolean;
    full_config?: Record<string, unknown>;
    knowledge_base?: Record<string, unknown>;
}

export interface AgentAIModelSpec {
    id: string;
    name: string;
    provider: string;
    description: string;
    capabilities: string[];
    max_tokens: number;
    default_temperature: number;
    is_default: boolean;
    tier: string;
}

export interface AgentAIModelsResponse {
    models: AgentAIModelSpec[];
    default_model?: string;
    fallback_model?: string;
}

export interface AgentStats {
    total_agents: number;
    active_agents: number;
    total_calls: number;
    total_bookings: number;
    avg_success_rate: number;
}

export interface AgentCapacityItem {
    id: string;
    name: string;
    type?: string | null;
    status?: string | null;
    capacity_percentage: number;
    total_calls: number;
    success_rate: number;
    wait_time?: string | null;
    performance?: 'optimal' | 'good' | 'needs-attention' | null;
}

export interface AgentCapacityResponse {
    agents: AgentCapacityItem[];
    summary?: {
        total_agents: number;
        active_agents: number;
        avg_capacity: number;
    };
}

/* ── Versioning & Cloning ─────────────────────────────────── */

export interface AgentConfigVersion {
    version_number: number;
    change_summary: string;
    created_by: string;
    created_at: string;
}

export interface AgentVersionsResponse {
    versions: AgentConfigVersion[];
    total: number;
}

export interface CloneAgentRequest {
    new_name?: string;
}

export interface RollbackRequest {
    version_number: number;
}

export interface RollbackResponse {
    message: string;
    config: Record<string, unknown>;
    agent: Agent;
}

/* ── Knowledge Base Documents ─────────────────────────────── */

export type KnowledgeDocumentType =
    | 'faq' | 'menu' | 'policy' | 'brochure'
    | 'guide' | 'transcript' | 'other';

export type KnowledgeDocumentStatus =
    | 'pending' | 'processing' | 'completed' | 'failed';

export interface KnowledgeDocument {
    id: string;
    name: string;
    document_type: KnowledgeDocumentType;
    file?: string | null;
    file_size: number;
    mime_type: string;
    status: KnowledgeDocumentStatus;
    processing_error: string;
    chunk_count: number;
    created_at: string;
    updated_at: string;
}

export interface KnowledgeSearchResult {
    id: string;
    content: string;
    chunk_index: number;
    document_name: string;
    document_id: string;
    score: number;
}

export interface KnowledgeSearchResponse {
    results: KnowledgeSearchResult[];
    query: string;
    count: number;
}
