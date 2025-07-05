'use server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { InvitationWithStats } from '../schema/invitation.schema';

/**
 * Fetch a public invitation by ID with stats
 */
export async function getPublicInvitation(id: string): Promise<InvitationWithStats | null> {
  try {
    const supabase = getSupabaseServerClient();

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
      console.error('Error fetching public invitation:', error);
      return null;
    }

    if (!data) {
      return null;
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
  } catch (error) {
    console.error('Error in getPublicInvitation:', error);
    return null;
  }
}

/**
 * Get template data by ID (mock implementation for now)
 */
export async function getTemplateData(templateId?: string): Promise<any> {
  // Mock template data - in production this would come from the database
  return {
    id: templateId || 'template-1',
    name: 'Classic Wedding',
    category: templateId ? 'wedding' : 'general',
    design_config: {
      primaryColor: '#3b82f6',
      accentColor: '#f59e0b',
      fontFamily: 'serif',
      layout: 'classic'
    }
  };
} 