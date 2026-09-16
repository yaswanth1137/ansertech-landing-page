import { api } from './apiClient';
import {
    Team,
    CreateTeamRequest,
    TeamMember,
    TeamInvitation,
    CreateInvitationRequest,
    InvitationInfo,
    AcceptInvitationResponse,
    AIModelsResponse,
} from '@/types/models/team';

export const teamService = {
    // ── Teams ───────────────────────────────────────────────

    /** List teams the current user belongs to */
    getAll: async (): Promise<Team[]> => {
        const response = await api.get<{ results: Team[] } | Team[]>('/teams/');
        const data = response.data;
        return Array.isArray(data) ? data : data.results;
    },

    /** Get team by ID */
    getById: async (teamId: string): Promise<Team> => {
        const response = await api.get<Team>(`/teams/${teamId}/`);
        return response.data;
    },

    /** Create a new team */
    create: async (data: CreateTeamRequest): Promise<Team> => {
        const response = await api.post<Team>('/teams/', data);
        return response.data;
    },

    /** Update team details */
    update: async (teamId: string, data: Partial<CreateTeamRequest>): Promise<Team> => {
        const response = await api.patch<Team>(`/teams/${teamId}/`, data);
        return response.data;
    },

    /** Delete team (owner only) */
    delete: async (teamId: string): Promise<void> => {
        await api.delete(`/teams/${teamId}/`);
    },

    // ── Members ─────────────────────────────────────────────

    /** List members of a team */
    getMembers: async (teamId: string): Promise<TeamMember[]> => {
        const response = await api.get<TeamMember[]>(`/teams/${teamId}/members/`);
        return response.data;
    },

    /** Update a member's role */
    updateMemberRole: async (teamId: string, membershipId: string, role: string): Promise<TeamMember> => {
        const response = await api.patch<TeamMember>(
            `/teams/${teamId}/members/${membershipId}/role/`,
            { role }
        );
        return response.data;
    },

    /** Remove member from team */
    removeMember: async (teamId: string, membershipId: string): Promise<void> => {
        await api.delete(`/teams/${teamId}/members/${membershipId}/`);
    },

    // ── Invitations ─────────────────────────────────────────

    /** Send an invitation */
    createInvitation: async (teamId: string, data: CreateInvitationRequest): Promise<TeamInvitation> => {
        const response = await api.post<TeamInvitation>(
            `/teams/${teamId}/invitations/`,
            data
        );
        return response.data;
    },

    /** List pending invitations */
    getInvitations: async (teamId: string): Promise<TeamInvitation[]> => {
        const response = await api.get<TeamInvitation[]>(`/teams/${teamId}/invitations/list/`);
        return response.data;
    },

    /** Revoke a pending invitation */
    revokeInvitation: async (teamId: string, invitationId: string): Promise<void> => {
        await api.delete(`/teams/${teamId}/invitations/${invitationId}/`);
    },

    /** Get invitation info by token (public) */
    getInvitationInfo: async (token: string): Promise<InvitationInfo> => {
        const response = await api.get<InvitationInfo>('/invitations/info/', {
            params: { token },
        });
        return response.data;
    },

    /** Accept invitation */
    acceptInvitation: async (token: string): Promise<AcceptInvitationResponse> => {
        const response = await api.post<AcceptInvitationResponse>('/invitations/accept/', { token });
        return response.data;
    },

    /** Decline invitation */
    declineInvitation: async (token: string): Promise<void> => {
        await api.post('/invitations/decline/', { token });
    },

    // ── AI Models ───────────────────────────────────────────

    /** Get available AI models */
    getAIModels: async (): Promise<AIModelsResponse> => {
        const response = await api.get<AIModelsResponse>('/agents/ai-models/');
        return response.data;
    },
};
