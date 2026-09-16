/* ── Team Types ───────────────────────────────────────────── */

export type TeamRole = 'owner' | 'admin' | 'manager' | 'viewer';

export interface TeamMember {
    id: string;
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    role: TeamRole;
    joined_at: string;
}

export interface Team {
    id: string;
    name: string;
    slug: string;
    description: string;
    owner_email: string;
    max_members: number;
    max_agents: number;
    member_count: number;
    my_role: TeamRole | null;
    members: TeamMember[];
    created_at: string;
    updated_at: string;
}

export interface CreateTeamRequest {
    name: string;
    description?: string;
    max_members?: number;
    max_agents?: number;
}

export interface TeamInvitation {
    id: string;
    team: string;
    team_name: string;
    email: string;
    role: TeamRole;
    invited_by_email: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired';
    message: string;
    created_at: string;
    expires_at: string;
}

export interface CreateInvitationRequest {
    email: string;
    role: Exclude<TeamRole, 'owner'>;
    message?: string;
}

export interface InvitationInfo {
    id: string;
    team_name: string;
    role: TeamRole;
    invited_by: string;
    email: string;
    status: string;
    expires_at: string;
}

export interface AcceptInvitationResponse {
    message: string;
    team_id: string;
    role: TeamRole;
}

/* ── AI Model Types ──────────────────────────────────────── */

export type AIModelTier = 'standard' | 'premium';

export interface AIModel {
    id: string;
    name: string;
    provider: 'google' | 'groq' | 'nvidia';
    description: string;
    capabilities: string[];
    max_tokens: number;
    default_temperature: number;
    is_default: boolean;
    tier: AIModelTier;
}

export interface AIModelsResponse {
    models: AIModel[];
    default_model: string;
    fallback_model: string;
}

/* ── Role Helpers ────────────────────────────────────────── */

const ROLE_HIERARCHY: Record<TeamRole, number> = {
    owner: 4,
    admin: 3,
    manager: 2,
    viewer: 1,
};

export function hasRole(userRole: TeamRole | null, requiredRole: TeamRole): boolean {
    if (!userRole) return false;
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canManageTeam(role: TeamRole | null): boolean {
    return hasRole(role, 'admin');
}

export function canManageAgents(role: TeamRole | null): boolean {
    return hasRole(role, 'manager');
}

export const ROLE_LABELS: Record<TeamRole, string> = {
    owner: 'Owner',
    admin: 'Admin',
    manager: 'Manager',
    viewer: 'Viewer',
};

export const ROLE_COLORS: Record<TeamRole, string> = {
    owner: 'text-amber-400',
    admin: 'text-purple-400',
    manager: 'text-blue-400',
    viewer: 'text-zinc-400',
};
