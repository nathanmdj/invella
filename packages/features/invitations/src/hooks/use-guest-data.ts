import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import type { 
  Guest, 
  GuestWithRSVP, 
  CreateGuest, 
  UpdateGuest,
  BulkGuestImport 
} from '../schema/guest.schema';

// Query keys
export const guestKeys = {
  all: ['guests'] as const,
  lists: () => [...guestKeys.all, 'list'] as const,
  list: (invitationId: string) => [...guestKeys.lists(), invitationId] as const,
  details: () => [...guestKeys.all, 'detail'] as const,
  detail: (id: string) => [...guestKeys.details(), id] as const,
};

// Hook to fetch guests for an invitation
export function useGuests(invitationId: string) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: guestKeys.list(invitationId),
    queryFn: async (): Promise<GuestWithRSVP[]> => {
      const { data, error } = await supabase
        .from('guests')
        .select(`
          *,
          rsvp_response:rsvp_responses(*)
        `)
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return (data || []).map((guest: any) => ({
        ...guest,
        rsvp_response: guest.rsvp_response?.[0] || null,
      }));
    },
    enabled: !!invitationId,
  });
}

// Hook to fetch a single guest
export function useGuest(id: string) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: guestKeys.detail(id),
    queryFn: async (): Promise<Guest> => {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!id,
  });
}

// Hook to find guest by code (for RSVP lookup)
export function useGuestByCode(code: string) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['guest-by-code', code],
    queryFn: async (): Promise<GuestWithRSVP> => {
      const { data, error } = await supabase
        .from('guests')
        .select(`
          *,
          invitation:invitations(*),
          rsvp_response:rsvp_responses(*)
        `)
        .eq('guest_code', code)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        ...data,
        rsvp_response: data.rsvp_response?.[0] || null,
      };
    },
    enabled: !!code,
  });
}

// Hook to create a new guest
export function useCreateGuest() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (guest: CreateGuest): Promise<Guest> => {
      const { data, error } = await supabase
        .from('guests')
        .insert([guest])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: guestKeys.list(data.invitation_id) 
      });
    },
  });
}

// Hook to bulk import guests
export function useBulkImportGuests() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ guests, invitation_id }: BulkGuestImport): Promise<Guest[]> => {
      const guestsWithInvitationId = guests.map(guest => ({
        ...guest,
        invitation_id,
      }));

      const { data, error } = await supabase
        .from('guests')
        .insert(guestsWithInvitationId)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: guestKeys.list(variables.invitation_id) 
      });
    },
  });
}

// Hook to update a guest
export function useUpdateGuest() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateGuest): Promise<Guest> => {
      const { data, error } = await supabase
        .from('guests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: guestKeys.list(data.invitation_id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: guestKeys.detail(data.id) 
      });
    },
  });
}

// Hook to delete a guest
export function useDeleteGuest() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guestKeys.lists() });
    },
  });
}