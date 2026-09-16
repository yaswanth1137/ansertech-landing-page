export interface BusinessCategory {
    id: string;
    name: string;
    slug: string;
    icon: string;
    description: string;
    default_agent_prompt_template: string;
    recommended_voice_ids: string[];
    suggested_tools: string[];
    required_data_fields: string[];
    business_count: number;
}

export interface BusinessDocument {
    id: string;
    name: string;
    document_type: 'menu' | 'price_list' | 'service_catalog' | 'brochure' | 'faq' | 'policy' | 'other';
    file: string | null;
    file_url: string;
    extracted_text: string;
    extracted_data: Record<string, unknown>;
    is_processed: boolean;
    processing_error: string;
    created_at: string;
}

export interface DataCollectionQuestion {
    id: string;
    field_name: string;
    question: string;
    question_type: 'text' | 'textarea' | 'select' | 'multiselect' | 'number' | 'time' | 'file';
    options: string[];
    answer: string;
    is_answered: boolean;
    is_required: boolean;
    order: number;
    created_at: string;
    answered_at: string | null;
}

export interface AgentPromptSuggestion {
    name: string;
    system_prompt: string;
    begin_message: string;
    tone: string;
}

export interface Business {
    id: string;
    name: string;
    slug: string;
    description: string;
    tagline: string;
    category: string | null;
    category_data?: BusinessCategory;
    custom_category: string;
    logo: string | null;
    logo_url: string;
    cover_image: string | null;
    primary_color: string;
    secondary_color: string;
    email: string;
    phone: string;
    whatsapp: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    website: string;
    google_maps_url: string;
    social_links: Record<string, string>;
    customer_volume: string;
    employee_count: string;
    founded_year: number | null;
    operating_hours: Record<string, { open: string; close: string }>;
    timezone: string;
    services: string[];
    products: string[];
    pricing_info: Record<string, unknown>;
    documents?: BusinessDocument[];
    scraped_data: Record<string, unknown>;
    data_completeness_score: number;
    last_scraped_at: string | null;
    scraping_status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'needs_review';
    ai_generated_description: string;
    ai_suggested_prompts: AgentPromptSuggestion[];
    ai_analysis: Record<string, unknown>;
    google_calendar_id: string;
    google_calendar_connected: boolean;
    is_active: boolean;
    is_verified: boolean;
    verification_notes: string;
    pending_questions?: DataCollectionQuestion[];
    missing_fields?: string[];
    created_at: string;
    updated_at: string;
}

export interface BusinessListItem {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    category: string | null;
    category_name: string | null;
    logo: string | null;
    logo_url: string;
    email?: string;
    phone?: string;
    website?: string;
    address_line1?: string;
    description?: string;
    city: string;
    is_active: boolean;
    is_verified: boolean;
    data_completeness_score: number;
    agent_count: number;
    created_at: string;
}

export interface AgentRecommendations {
    category_suggestions: {
        recommended_voices: string[];
        suggested_tools: string[];
        prompt_template: string;
    };
    ai_suggestions: AgentPromptSuggestion[];
    ai_analysis: Record<string, unknown>;
    recommended_agent_name: string;
    data_completeness: number;
}

export interface BusinessStats {
    total: number;
    active: number;
    verified: number;
    pending_scraping: number;
    low_completeness: number;
    by_category: Array<{ category__name: string | null; count: number }>;
}

export interface CreateBusinessRequest {
    name: string;
    description?: string;
    category?: string;
    custom_category?: string;
    email?: string;
    phone?: string;
    website?: string;
    website_to_scrape?: string;
    customer_volume?: string;
    logo?: File;
    logo_url?: string;
}

export interface UpdateBusinessRequest extends Partial<CreateBusinessRequest> {
    id: string;
    tagline?: string;
    address_line1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    services?: string[];
    products?: string[];
    operating_hours?: Record<string, { open: string; close: string }>;
    social_links?: Record<string, string>;
}
