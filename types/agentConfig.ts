/**
 * AnserTech Agent Configuration Schema v1
 * TypeScript types mirroring the backend Pydantic schema.
 * Used by all three creation modes: Smart Builder, JSON Import, Chat Builder.
 */

// ─── Enums ──────────────────────────────────────────────────────────────────

export type VoiceGender = 'male' | 'female' | 'neutral';

export type PersonalityTrait =
  | 'professional' | 'friendly' | 'empathetic' | 'authoritative'
  | 'casual' | 'enthusiastic' | 'calm' | 'warm' | 'assertive' | 'playful';

export type EscalationPriority = 'low' | 'medium' | 'high' | 'critical';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// ─── Sub-schemas ────────────────────────────────────────────────────────────

export interface IdentityConfig {
  agent_name: string;
  agent_role: string;
  persona_name?: string | null;
  company_name?: string | null;
  tagline?: string | null;
}

export interface VoiceConfig {
  voice_id: string;
  voice_provider: string;
  gender: VoiceGender;
  language: string;
  language_mode?: 'multi' | 'single';
  secondary_languages: string[];
  speed: number;
  pitch: number;
  temperature: number;
  stability: number;
  filler_words_enabled: boolean;
  backchannel_enabled: boolean;
}

export interface PersonalityConfig {
  traits: PersonalityTrait[];
  communication_style: string;
  tone_description?: string | null;
  humor_level: 'none' | 'light' | 'moderate';
  formality_level: 'casual' | 'balanced' | 'formal' | 'very_formal';
  empathy_level: 'low' | 'moderate' | 'high';
  response_length: 'brief' | 'moderate' | 'detailed';
  custom_instructions?: string | null;
}

export interface BusinessHours {
  day: DayOfWeek;
  is_open: boolean;
  open_time?: string | null;
  close_time?: string | null;
  break_start?: string | null;
  break_end?: string | null;
}

export interface BusinessConfig {
  industry: string;
  sub_industry?: string | null;
  business_description?: string | null;
  target_audience?: string | null;
  unique_selling_points: string[];
  services_offered: string[];
  location?: string | null;
  timezone: string;
  currency: string;
  business_hours: BusinessHours[];
  holiday_message?: string | null;
}

export interface KnowledgeItem {
  category: string;
  question?: string | null;
  answer: string;
  keywords: string[];
  priority: number;
}

export interface KnowledgeBaseConfig {
  items: KnowledgeItem[];
  external_sources: Array<{ type: string; value: string }>;
  auto_learn: boolean;
  fallback_response: string;
}

export interface GreetingConfig {
  default_greeting: string;
  returning_customer_greeting?: string | null;
  after_hours_greeting?: string | null;
  holiday_greeting?: string | null;
  max_wait_message?: string | null;
}

export interface ConversationConfig {
  greeting: GreetingConfig;
  max_turns: number;
  silence_timeout_seconds: number;
  silence_prompt: string;
  end_call_phrases: string[];
  closing_message: string;
  transfer_message?: string | null;
  collect_feedback: boolean;
  feedback_prompt?: string | null;
  interruption_handling: 'wait' | 'acknowledge' | 'priority';
}

export interface WorkflowStep {
  step_id: string;
  description: string;
  action: string;
  parameters: Record<string, unknown>;
  next_step?: string | null;
  conditions: Array<Record<string, unknown>>;
}

export interface Workflow {
  workflow_id: string;
  name: string;
  description: string;
  trigger_phrases: string[];
  steps: WorkflowStep[];
  priority: number;
}

export interface WorkflowsConfig {
  workflows: Workflow[];
  default_workflow?: string | null;
}

export interface ToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: unknown;
}

export interface AgentTool {
  tool_id: string;
  name: string;
  description: string;
  endpoint?: string | null;
  method: string;
  parameters: ToolParameter[];
  requires_confirmation: boolean;
  timeout_seconds: number;
}

export interface ToolsConfig {
  tools: AgentTool[];
  calendar_integration?: Record<string, unknown> | null;
  crm_integration?: Record<string, unknown> | null;
  webhook_url?: string | null;
}

export interface LLMConfig {
  model: string;
  fallback_model?: string | null;
  provider: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  system_prompt?: string | null;
  context_window: number;
  response_format: 'text' | 'json' | 'structured';
}

export interface ScheduleConfig {
  enabled: boolean;
  timezone: string;
  mode: '24/7' | 'business_hours' | 'custom';
  after_hours_behavior: 'voicemail' | 'message' | 'transfer' | 'off';
  after_hours_message?: string | null;
}

export interface CallFlowConfig {
  max_call_duration_seconds: number;
  ring_timeout_seconds: number;
  recording_enabled: boolean;
  transcription_enabled: boolean;
  voicemail_enabled: boolean;
  voicemail_max_seconds: number;
  dtmf_enabled: boolean;
  concurrent_call_limit: number;
  warm_transfer_enabled: boolean;
}

export interface EscalationRule {
  trigger: string;
  condition?: string | null;
  action: string;
  priority: EscalationPriority;
  target_phone?: string | null;
  notification_channels: string[];
  message_template?: string | null;
}

export interface EscalationConfig {
  enabled: boolean;
  rules: EscalationRule[];
  default_transfer_number?: string | null;
  max_failed_attempts: number;
  escalation_message: string;
}

export interface ComplianceConfig {
  gdpr_enabled: boolean;
  hipaa_enabled: boolean;
  data_retention_days: number;
  pii_redaction: boolean;
  consent_required: boolean;
  consent_message?: string | null;
  restricted_topics: string[];
  restricted_topic_response: string;
}

// ─── Main Schema ────────────────────────────────────────────────────────────

export interface AgentConfigSchema {
  schema_version: string;
  identity: IdentityConfig;
  voice: VoiceConfig;
  personality: PersonalityConfig;
  business: BusinessConfig;
  knowledge_base: KnowledgeBaseConfig;
  conversation: ConversationConfig;
  workflows: WorkflowsConfig;
  tools: ToolsConfig;
  llm: LLMConfig;
  schedule: ScheduleConfig;
  call_flow: CallFlowConfig;
  escalation: EscalationConfig;
  compliance: ComplianceConfig;
  metadata: Record<string, unknown>;
}

// ─── Questionnaire Types ────────────────────────────────────────────────────

export interface QuestionOption {
  value: string;
  label: string;
  description?: string | null;
}

export type QuestionType = 'text' | 'textarea' | 'select' | 'multiselect' | 'number' | 'boolean' | 'time_range' | 'phone';

export interface DynamicQuestion {
  question_id: string;
  question_text: string;
  question_type: QuestionType;
  section: string;
  field_path: string;
  options: QuestionOption[];
  placeholder?: string | null;
  help_text?: string | null;
  required: boolean;
  validation?: Record<string, unknown> | null;
  depends_on?: { question_id: string; value: string | string[] } | null;
  order: number;
}

export interface QuestionnaireSection {
  section_id: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  questions: DynamicQuestion[];
  order: number;
}

export interface GeneratedQuestionnaire {
  niche: string;
  niche_confidence: number;
  sections: QuestionnaireSection[];
  estimated_completion_minutes: number;
  total_questions: number;
  pre_filled_answers?: Record<string, unknown>; // Extracted from user description
}

// ─── Chat Builder Types ─────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface ChatSession {
  session_id: string;
  messages: ChatMessage[];
  gathered_config: Record<string, unknown>;
  completion_percentage: number;
  missing_sections: string[];
  is_complete: boolean;
}

// ─── Validation Types ───────────────────────────────────────────────────────

export interface ConfigValidationResult {
  is_valid: boolean;
  errors: Array<{ field: string; error: string }>;
  warnings: Array<{ field: string; error: string }>;
  completeness_score: number;
  missing_required: string[];
  suggestions: string[];
}

// ─── API Response Types ─────────────────────────────────────────────────────

export interface NicheDetectionResult {
  industry: string;
  sub_industry?: string | null;
  confidence: number;
  detected_services?: string[];
  suggested_agent_name?: string;
  ai_service?: string;
}

export interface GenerateQuestionnaireResponse {
  niche: NicheDetectionResult;
  questionnaire: GeneratedQuestionnaire;
  pre_filled_answers?: Record<string, unknown>; // Also hoisted to top level for convenience
}

export interface SubmitQuestionnaireResponse {
  config: AgentConfigSchema;
  validation: ConfigValidationResult;
  agent?: Record<string, unknown>;
}

export interface ValidateConfigResponse {
  validation: ConfigValidationResult;
  config: AgentConfigSchema;
}

export interface CompleteConfigResponse {
  config: AgentConfigSchema;
  validation: ConfigValidationResult;
  sections_added: string[];
}

export interface ImportConfigResponse {
  agent: Record<string, unknown>;
  config: AgentConfigSchema;
  validation: ConfigValidationResult;
}

export interface ChatStartResponse {
  session: ChatSession;
}

export interface ChatMessageResponse {
  session: ChatSession;
}

export interface ChatFinalizeResponse {
  config: AgentConfigSchema;
  validation: ConfigValidationResult;
  agent?: Record<string, unknown>;
}

export interface CreateAgentResponse {
  agent: Record<string, unknown>;
  message: string;
}

// ─── Creation Mode ──────────────────────────────────────────────────────────

export type CreationMode = 'smart_builder' | 'json_import' | 'chat_builder' | 'website_import' | 'file_upload' | 'template';
