import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamService } from '@/services/teamService';
import { CreateTeamRequest, CreateInvitationRequest } from '@/types/models/team';
import { toast } from 'sonner';

/* ── Query Keys ──────────────────────────────────────────── */

export const teamKeys = {
    all: ['teams'] as const,
    lists: () => [...teamKeys.all, 'list'] as const,
    detail: (id: string) => [...teamKeys.all, 'detail', id] as const,
    members: (id: string) => [...teamKeys.all, 'members', id] as const,
    invitations: (id: string) => [...teamKeys.all, 'invitations', id] as const,
    aiModels: () => ['ai-models'] as const,
};

/* ── Queries ─────────────────────────────────────────────── */

export function useTeams() {
    return useQuery({
        queryKey: teamKeys.lists(),
        queryFn: teamService.getAll,
    });
}

export function useTeam(teamId: string | undefined) {
    return useQuery({
        queryKey: teamKeys.detail(teamId!),
        queryFn: () => teamService.getById(teamId!),
        enabled: !!teamId,
    });
}

export function useTeamMembers(teamId: string | undefined) {
    return useQuery({
        queryKey: teamKeys.members(teamId!),
        queryFn: () => teamService.getMembers(teamId!),
        enabled: !!teamId,
    });
}

export function useTeamInvitations(teamId: string | undefined) {
    return useQuery({
        queryKey: teamKeys.invitations(teamId!),
        queryFn: () => teamService.getInvitations(teamId!),
        enabled: !!teamId,
    });
}

export function useAIModels() {
    return useQuery({
        queryKey: teamKeys.aiModels(),
        queryFn: teamService.getAIModels,
        staleTime: 30 * 60 * 1000, // 30 min — models rarely change
    });
}

/* ── Mutations ───────────────────────────────────────────── */

export function useCreateTeam() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateTeamRequest) => teamService.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: teamKeys.lists() });
            toast.success('Team created');
        },
        onError: () => toast.error('Failed to create team'),
    });
}

export function useUpdateTeam() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ teamId, data }: { teamId: string; data: Partial<CreateTeamRequest> }) =>
            teamService.update(teamId, data),
        onSuccess: (_, { teamId }) => {
            qc.invalidateQueries({ queryKey: teamKeys.detail(teamId) });
            qc.invalidateQueries({ queryKey: teamKeys.lists() });
            toast.success('Team updated');
        },
        onError: () => toast.error('Failed to update team'),
    });
}

export function useDeleteTeam() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (teamId: string) => teamService.delete(teamId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: teamKeys.lists() });
            toast.success('Team deleted');
        },
        onError: () => toast.error('Failed to delete team'),
    });
}

export function useUpdateMemberRole() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ teamId, membershipId, role }: { teamId: string; membershipId: string; role: string }) =>
            teamService.updateMemberRole(teamId, membershipId, role),
        onSuccess: (_, { teamId }) => {
            qc.invalidateQueries({ queryKey: teamKeys.members(teamId) });
            qc.invalidateQueries({ queryKey: teamKeys.detail(teamId) });
            toast.success('Role updated');
        },
        onError: () => toast.error('Failed to update role'),
    });
}

export function useRemoveMember() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ teamId, membershipId }: { teamId: string; membershipId: string }) =>
            teamService.removeMember(teamId, membershipId),
        onSuccess: (_, { teamId }) => {
            qc.invalidateQueries({ queryKey: teamKeys.members(teamId) });
            qc.invalidateQueries({ queryKey: teamKeys.detail(teamId) });
            toast.success('Member removed');
        },
        onError: () => toast.error('Failed to remove member'),
    });
}

export function useCreateInvitation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ teamId, data }: { teamId: string; data: CreateInvitationRequest }) =>
            teamService.createInvitation(teamId, data),
        onSuccess: (_, { teamId }) => {
            qc.invalidateQueries({ queryKey: teamKeys.invitations(teamId) });
            toast.success('Invitation sent');
        },
        onError: () => toast.error('Failed to send invitation'),
    });
}

export function useRevokeInvitation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ teamId, invitationId }: { teamId: string; invitationId: string }) =>
            teamService.revokeInvitation(teamId, invitationId),
        onSuccess: (_, { teamId }) => {
            qc.invalidateQueries({ queryKey: teamKeys.invitations(teamId) });
            toast.success('Invitation revoked');
        },
        onError: () => toast.error('Failed to revoke invitation'),
    });
}

export function useAcceptInvitation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (token: string) => teamService.acceptInvitation(token),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: teamKeys.lists() });
            toast.success('Invitation accepted!');
        },
        onError: () => toast.error('Failed to accept invitation'),
    });
}

export function useDeclineInvitation() {
    return useMutation({
        mutationFn: (token: string) => teamService.declineInvitation(token),
        onSuccess: () => toast.success('Invitation declined'),
        onError: () => toast.error('Failed to decline invitation'),
    });
}
