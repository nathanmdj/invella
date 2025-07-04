import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import type { 
  GuestWithInvitation,
  RSVPResponse,
  RSVPResponseRecord,
  UpdateRSVPResponse
} from '../schema/rsvp.schema';

// Query keys
export const rsvpKeys = {
  all: ['rsvp'] as const,
  guest: (guestCode: string) => [...rsvpKeys.all, 'guest', guestCode] as const,
  response: (responseId: string) => [...rsvpKeys.all, 'response', responseId] as const,
};

// Hook to lookup guest by code
export function useGuestLookup(guestCode: string) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: rsvpKeys.guest(guestCode),
    queryFn: async (): Promise<GuestWithInvitation> => {
      const { data, error } = await supabase
        .from('guests')
        .select(`
          *,
          invitation:invitations(
            id,
            title,
            description,
            event_date,
            location,
            image_url,
            rsvp_deadline
          ),
          rsvp_response:rsvp_responses(*)
        `)
        .eq('guest_code', guestCode.toUpperCase())
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        ...data,
        rsvp_response: data.rsvp_response?.[0] || null,
      } as GuestWithInvitation;
    },
    enabled: !!guestCode && guestCode.length >= 3,
    retry: false, // Don't retry guest lookup to avoid hammering the API
  });
}

// Hook to submit RSVP response
export function useSubmitRSVP() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rsvpData: RSVPResponse): Promise<RSVPResponseRecord> => {
      // Check if RSVP already exists
      const { data: existingRSVP } = await supabase
        .from('rsvp_responses')
        .select('id')
        .eq('guest_id', rsvpData.guest_id)
        .single();

      let result;

      if (existingRSVP) {
        // Update existing RSVP
        const { data, error } = await supabase
          .from('rsvp_responses')
          .update({
            status: rsvpData.status,
            dietary_restrictions: rsvpData.dietary_restrictions,
            plus_one_count: rsvpData.plus_one_count,
            plus_one_names: rsvpData.plus_one_names,
            message: rsvpData.message,
            response_date: new Date().toISOString(),
          })
          .eq('id', existingRSVP.id)
          .select()
          .single();

        if (error) throw new Error(error.message);
        result = data as RSVPResponseRecord;
      } else {
        // Create new RSVP
        const { data, error } = await supabase
          .from('rsvp_responses')
          .insert([{
            ...rsvpData,
            response_date: new Date().toISOString(),
          }])
          .select()
          .single();

        if (error) throw new Error(error.message);
        result = data as RSVPResponseRecord;
      }

      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidate guest data to refresh RSVP status
      queryClient.invalidateQueries({ 
        queryKey: rsvpKeys.all 
      });
    },
  });
}

// Hook to update RSVP response
export function useUpdateRSVP() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateRSVPResponse): Promise<RSVPResponseRecord> => {
      const { data, error } = await supabase
        .from('rsvp_responses')
        .update({
          ...updates,
          response_date: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as RSVPResponseRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rsvpKeys.all });
    },
  });
}

// Hook for anonymous guest lookup (for public RSVP pages)
export function usePublicGuestLookup(guestCode: string) {
  // Create anonymous supabase client
  const supabase = useSupabase();

  return useQuery({
    queryKey: rsvpKeys.guest(guestCode),
    queryFn: async (): Promise<GuestWithInvitation> => {
      const { data, error } = await supabase
        .from('guests')
        .select(`
          *,
          invitation:invitations!inner(
            id,
            title,
            description,
            event_date,
            location,
            image_url,
            rsvp_deadline,
            is_public
          ),
          rsvp_response:rsvp_responses(*)
        `)
        .eq('guest_code', guestCode.toUpperCase())
        .eq('invitation.is_public', true) // Only allow public invitations
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        ...data,
        rsvp_response: data.rsvp_response?.[0] || null,
      } as GuestWithInvitation;
    },
    enabled: !!guestCode && guestCode.length >= 3,
    retry: false,
  });
}

// Hook to check if RSVP deadline has passed
export function useRSVPDeadlineStatus(deadline?: string) {
  if (!deadline) return { isPastDeadline: false, daysUntilDeadline: null };

  const deadlineDate = new Date(deadline);
  const now = new Date();
  const isPastDeadline = deadlineDate < now;
  const diffTime = deadlineDate.getTime() - now.getTime();
  const daysUntilDeadline = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    isPastDeadline,
    daysUntilDeadline: isPastDeadline ? 0 : daysUntilDeadline,
  };
}