/**
 * AI Agent Creation Engine — API Service
 * Three creation methods: Website Scraper, Template Enhanced, Static.
 */
import { api } from './apiClient';
import type {
  GenerateQuestionnaireResponse,
  SubmitQuestionnaireResponse,
  CreateAgentResponse,
  AgentConfigSchema,
  ConfigValidationResult,
} from '@/types/agentConfig';

const BASE_PATH = '/agents/ai';

export interface AgentVoiceOption {
  id: string;
  name: string;
  gender?: string;
  accent?: string;
  description?: string;
  recommended?: boolean;
  preview_audio_url?: string;
  language?: string;
}

export const agentCreationService = {
  // ─── Method 1: Website Scraper ──────────────────────────────────

  /** Kick off an async website scrape. Returns a Celery task_id. */
  async scrapeWebsite(params: {
    url: string;
    selected_voice_id?: string;
    language_mode?: string;
    primary_language?: string;
    secondary_languages?: string[];
  }): Promise<{ task_id: string; status: string }> {
    const { data } = await api.post(`${BASE_PATH}/scrape-website/`, params);
    return data;
  },

  /** Poll for scrape status. Returns "pending" until the Celery task finishes. */
  async scrapeStatus(taskId: string): Promise<{
    status: 'pending' | 'done' | 'failed';
    config?: AgentConfigSchema;
    business_name?: string;
    pages_scraped?: number;
    scrape_status?: 'success' | 'partial';
    error?: string;
  }> {
    const { data } = await api.get(`${BASE_PATH}/scrape-status/${taskId}/`);
    return data;
  },

  /** Detect fields missing/needing confirmation in a scraped config. */
  async scrapeGaps(params: {
    config: AgentConfigSchema;
    scrape_status?: string;
  }): Promise<{
    has_gaps: boolean;
    gaps: Array<{
      field: string;
      label: string;
      type: string;
      current: string;
      required: boolean;
      hint: string;
    }>;
  }> {
    const { data } = await api.post(`${BASE_PATH}/scrape-gaps/`, params);
    return data;
  },

  /** Merge user-confirmed gap answers and create the agent. Returns { agent }. */
  async scrapeCreate(params: {
    config: AgentConfigSchema;
    gap_answers?: Record<string, string>;
    selected_voice_id?: string;
    language_mode?: string;
    primary_language?: string;
  }): Promise<CreateAgentResponse> {
    const { data } = await api.post(`${BASE_PATH}/scrape-create/`, params);
    return data;
  },

  // ─── Method 2: Template Enhanced ───────────────────────────────

  /** Get list of available industry templates. */
  async getTemplates(): Promise<{ templates: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    tools_count: number;
    required_slots: string[];
    has_booking: boolean;
  }> }> {
    const { data } = await api.get(`${BASE_PATH}/templates/`);
    return data;
  },

  /** Apply an industry template to generate a full agent config. */
  async applyTemplate(params: {
    template_id: string;
    business_name: string;
    customizations?: Record<string, unknown>;
    selected_voice_id: string;
  }): Promise<{
    config: AgentConfigSchema;
    validation: ConfigValidationResult;
    questionnaire?: unknown;
    requires_questionnaire?: boolean;
  }> {
    const { data } = await api.post(`${BASE_PATH}/apply-template/`, params);
    return data;
  },

  /** Generate a tailored questionnaire for a template/industry. */
  async generateQuestionnaire(params: {
    description?: string;
    industry?: string;
    sub_industry?: string;
  }): Promise<GenerateQuestionnaireResponse> {
    const { data } = await api.post(`${BASE_PATH}/generate-questionnaire/`, params);
    return data;
  },

  /** Submit questionnaire answers and generate agent config. */
  async submitQuestionnaire(params: {
    industry: string;
    sub_industry?: string;
    answers: Record<string, unknown>;
    create_agent?: boolean;
    selected_voice_id?: string;
    language_mode?: string;
    primary_language?: string;
    secondary_languages?: string[];
  }): Promise<SubmitQuestionnaireResponse> {
    const { data } = await api.post(`${BASE_PATH}/submit-questionnaire/`, params);
    return data;
  },

  // ─── Method 3: Static ───────────────────────────────────────────

  /**
   * Text tab — wrap a free-text system prompt into a minimal config and create
   * the agent immediately. Returns { agent, message }.
   */
  async staticText(params: {
    name?: string;
    prompt: string;
    voice_id?: string;
    language?: string;
  }): Promise<CreateAgentResponse> {
    const { data } = await api.post(`${BASE_PATH}/static/text/`, params);
    return data;
  },

  /**
   * Business-context JSON tab — accepts structured business facts (name, hours,
   * services, faqs, pricing, policies…) and creates the agent immediately.
   * Returns { agent, message }.
   */
  async staticJson(params: {
    business_name?: string;
    agent_name?: string;
    industry?: string;
    description?: string;
    hours?: string;
    contact_phone?: string;
    contact_email?: string;
    address?: string;
    services?: string[];
    faqs?: Array<{ question: string; answer: string }>;
    pricing?: string;
    policies?: string;
    voice_id?: string;
    language?: string;
  }): Promise<CreateAgentResponse> {
    const { data } = await api.post(`${BASE_PATH}/static/json/`, params);
    return data;
  },

  // ─── Shared: create agent from a config object ──────────────────

  /** Create an Agent record from a finalized AgentConfigSchema. */
  async createAgentFromConfig(params: {
    config: AgentConfigSchema;
  }): Promise<CreateAgentResponse> {
    const { data } = await api.post(`${BASE_PATH}/create-agent/`, params);
    return data;
  },

  // ─── KB Enrichment ──────────────────────────────────────────────

  /**
   * Upload a document to enrich an existing agent's knowledge base.
   * Fire-and-forget: server returns 202 Accepted and processes in the background.
   */
  async enrichAgent(agentId: string, formData: FormData): Promise<{ message: string; document_id?: string }> {
    const { data } = await api.post(`${BASE_PATH}/enrich-agent/${agentId}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Upload a document and generate an agent config from its content (in-flow).
   * Legacy — kept for backwards compatibility.
   */
  async uploadDocument(formData: FormData): Promise<{
    config: AgentConfigSchema;
    validation: ConfigValidationResult;
    filename: string;
    text_length: number;
  }> {
    const { data } = await api.post(`${BASE_PATH}/upload-document/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // ─── Voices ─────────────────────────────────────────────────────

  /** Fetch available voice options. */
  async getVoices(): Promise<AgentVoiceOption[]> {
    const { data } = await api.get(`/agents/voices/`);
    return data.voices || [];
  },
};
