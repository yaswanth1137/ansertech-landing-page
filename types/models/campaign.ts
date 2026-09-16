export interface CampaignContactInput {
    phone: string;
    name?: string;
    context?: Record<string, any>;
}

export interface CampaignContact {
    id: string;
    phone: string;
    name?: string | null;
    status: 'pending' | 'calling' | 'initiated' | 'failed';
    call?: string | null;
    error?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Campaign {
    id: string;
    agent: string;
    status: 'queued' | 'running' | 'completed' | 'failed';
    total_contacts: number;
    completed_contacts: number;
    failed_contacts: number;
    progress_pct: number;
    contacts: CampaignContact[];
    created_at: string;
    started_at: string | null;
    finished_at: string | null;
}

export interface OutboundCallInput {
    agent_id: string;
    phone_number: string;
    purpose?: string;
    context?: Record<string, any>;
}

export interface OutboundCallResult {
    call_id: string;
    status: string;
    message: string;
}
