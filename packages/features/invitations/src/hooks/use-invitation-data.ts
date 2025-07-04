import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import type { 
  CreateInvitation, 
  UpdateInvitation,
  Invitation,
  InvitationWithStats,
  InvitationFilters 
} from '../schema/invitation.schema';

// Query keys for React Query
export const invitationKeys = {
  all: ['invitations'] as const,
  lists: () => [...invitationKeys.all, 'list'] as const,
  list: (filters: InvitationFilters) => [...invitationKeys.lists(), filters] as const,
  details: () => [...invitationKeys.all, 'detail'] as const,
  detail: (id: string) => [...invitationKeys.details(), id] as const,
};

// Hook to fetch user's invitations
export function useInvitations(filters: Partial<InvitationFilters> = {}) {
  const supabase = useSupabase();

  // Apply defaults
  const finalFilters: InvitationFilters = {
    sort_by: 'created_at',
    sort_order: 'desc',
    limit: 20,
    offset: 0,
    ...filters,
  };

  return useQuery({
    queryKey: invitationKeys.list(finalFilters),
    queryFn: async (): Promise<InvitationWithStats[]> => {
      let query = supabase
        .from('invitations')
        .select(`
          *,
          guest_count:guests(count),
          guests(
            rsvp_responses(
              status
            )
          )
        `)
        .order(finalFilters.sort_by, { 
          ascending: finalFilters.sort_order === 'asc' 
        });

      if (finalFilters.search) {
        query = query.ilike('title', `%${finalFilters.search}%`);
      }

      if (finalFilters.limit) {
        query = query.limit(finalFilters.limit);
      }

      if (finalFilters.offset) {
        query = query.range(finalFilters.offset, finalFilters.offset + finalFilters.limit - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      // Process the data to include stats
      return (data || []).map((invitation: any) => {
        // Flatten RSVP responses from nested guests structure
        const rsvpResponses = invitation.guests?.flatMap((guest: any) => 
          guest.rsvp_responses || []
        ) || [];

        return {
          ...invitation,
          guest_count: invitation.guest_count?.[0]?.count || 0,
          rsvp_count: rsvpResponses.length || 0,
          attending_count: rsvpResponses.filter((r: any) => r.status === 'attending').length || 0,
          not_attending_count: rsvpResponses.filter((r: any) => r.status === 'not_attending').length || 0,
        };
      });
    },
  });
}

// Hook to fetch a single invitation by ID
export function useInvitation(id: string) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: invitationKeys.detail(id),
    queryFn: async (): Promise<Invitation> => {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        ...data,
        description: data.description ?? undefined,
        event_date: data.event_date ?? undefined,
        image_url: data.image_url ?? undefined,
        location: data.location ?? undefined,
        updated_by: data.updated_by ?? undefined,
        template_id: data.template_id ?? undefined,
        max_guests: data.max_guests ?? undefined,
        rsvp_deadline: data.rsvp_deadline ?? undefined,
        custom_fields: (data.custom_fields as Record<string, any>) ?? {},
      };
    },
    enabled: !!id,
  });
}

// Hook to create a new invitation
export function useCreateInvitation() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitation: CreateInvitation): Promise<Invitation> => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('invitations')
        .insert([{
          ...invitation,
          creator_id: user.id,
          event_date: invitation.event_date?.toISOString(),
          rsvp_deadline: invitation.rsvp_deadline?.toISOString(),
          is_public: true, // Make invitations public by default for RSVP
        }])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        ...data,
        description: data.description ?? undefined,
        event_date: data.event_date ?? undefined,
        image_url: data.image_url ?? undefined,
        location: data.location ?? undefined,
        updated_by: data.updated_by ?? undefined,
        template_id: data.template_id ?? undefined,
        max_guests: data.max_guests ?? undefined,
        rsvp_deadline: data.rsvp_deadline ?? undefined,
        custom_fields: (data.custom_fields as Record<string, any>) ?? {},
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.lists() });
    },
  });
}

// Hook to update an existing invitation
export function useUpdateInvitation() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateInvitation & { id: string }): Promise<Invitation> => {
      const { data, error } = await supabase
        .from('invitations')
        .update({
          ...updates,
          event_date: updates.event_date?.toISOString(),
          rsvp_deadline: updates.rsvp_deadline?.toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        ...data,
        description: data.description ?? undefined,
        event_date: data.event_date ?? undefined,
        image_url: data.image_url ?? undefined,
        location: data.location ?? undefined,
        updated_by: data.updated_by ?? undefined,
        template_id: data.template_id ?? undefined,
        max_guests: data.max_guests ?? undefined,
        rsvp_deadline: data.rsvp_deadline ?? undefined,
        custom_fields: (data.custom_fields as Record<string, any>) ?? {},
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invitationKeys.detail(data.id) });
    },
  });
}

// Hook to delete an invitation
export function useDeleteInvitation() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.lists() });
    },
  });
}

// Hook to fetch a public invitation with stats (for public invite pages)
export function usePublicInvitation(id: string) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['public-invitation', id],
    queryFn: async (): Promise<InvitationWithStats> => {
      const { data, error } = await supabase
        .from('invitations')
        .select(`
          *,
          guest_count:guests(count),
          guests(
            rsvp_responses(
              status
            )
          )
        `)
        .eq('id', id)
        .eq('is_public', true)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Process the data to include stats
      const rsvpResponses = data.guests?.flatMap((guest: any) => 
        guest.rsvp_responses || []
      ) || [];

      return {
        ...data,
        description: data.description ?? undefined,
        event_date: data.event_date ?? undefined,
        image_url: data.image_url ?? undefined,
        location: data.location ?? undefined,
        updated_by: data.updated_by ?? undefined,
        template_id: data.template_id ?? undefined,
        max_guests: data.max_guests ?? undefined,
        rsvp_deadline: data.rsvp_deadline ?? undefined,
        custom_fields: (data.custom_fields as Record<string, any>) ?? {},
        guest_count: data.guest_count?.[0]?.count || 0,
        rsvp_count: rsvpResponses.length || 0,
        attending_count: rsvpResponses.filter((r: any) => r.status === 'attending').length || 0,
        not_attending_count: rsvpResponses.filter((r: any) => r.status === 'not_attending').length || 0,
      };
    },
    enabled: !!id,
  });
}