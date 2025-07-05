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
 * Fetch user's invitations with stats
 */
export async function getUserInvitations(filters: {
  limit?: number;
  offset?: number;
  search?: string;
  sort_by?: 'created_at' | 'event_date' | 'title';
  sort_order?: 'asc' | 'desc';
} = {}): Promise<InvitationWithStats[]> {
  try {
    const supabase = getSupabaseServerClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Apply defaults
    const finalFilters = {
      sort_by: 'created_at',
      sort_order: 'desc',
      limit: 20,
      offset: 0,
      ...filters,
    };

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
      .eq('creator_id', user.id)
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
      console.error('Error fetching user invitations:', error);
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
        description: invitation.description ?? undefined,
        event_date: invitation.event_date ?? undefined,
        image_url: invitation.image_url ?? undefined,
        location: invitation.location ?? undefined,
        updated_by: invitation.updated_by ?? undefined,
        template_id: invitation.template_id ?? undefined,
        max_guests: invitation.max_guests ?? undefined,
        rsvp_deadline: invitation.rsvp_deadline ?? undefined,
        custom_fields: (invitation.custom_fields as Record<string, any>) ?? {},
        guest_count: invitation.guest_count?.[0]?.count || 0,
        rsvp_count: rsvpResponses.length || 0,
        attending_count: rsvpResponses.filter((r: any) => r.status === 'attending').length || 0,
        not_attending_count: rsvpResponses.filter((r: any) => r.status === 'not_attending').length || 0,
      };
    });
  } catch (error) {
    console.error('Error in getUserInvitations:', error);
    return [];
  }
}

/**
 * Get a single invitation by ID for the current user
 */
export async function getUserInvitation(id: string): Promise<InvitationWithStats | null> {
  try {
    const supabase = getSupabaseServerClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

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
      .eq('creator_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user invitation:', error);
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
    console.error('Error in getUserInvitation:', error);
    return null;
  }
}

/**
 * Create a new invitation
 */
export async function createInvitation(data: {
  title: string;
  description?: string;
  location?: string;
  image_url?: string;
  max_guests?: number;
  event_date?: Date;
  rsvp_deadline?: Date;
  template_id?: string;
  custom_fields?: Record<string, any>;
}): Promise<{ success: boolean; invitation?: any; error?: string }> {
  try {
    const supabase = getSupabaseServerClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data: invitation, error } = await supabase
      .from('invitations')
      .insert([{
        ...data,
        creator_id: user.id,
        event_date: data.event_date?.toISOString(),
        rsvp_deadline: data.rsvp_deadline?.toISOString(),
        is_public: true, // Make invitations public by default for RSVP
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating invitation:', error);
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      invitation: {
        ...invitation,
        description: invitation.description ?? undefined,
        event_date: invitation.event_date ?? undefined,
        image_url: invitation.image_url ?? undefined,
        location: invitation.location ?? undefined,
        updated_by: invitation.updated_by ?? undefined,
        template_id: invitation.template_id ?? undefined,
        max_guests: invitation.max_guests ?? undefined,
        rsvp_deadline: invitation.rsvp_deadline ?? undefined,
        custom_fields: (invitation.custom_fields as Record<string, any>) ?? {},
      }
    };
  } catch (error) {
    console.error('Error in createInvitation:', error);
    return { success: false, error: 'Failed to create invitation' };
  }
}

/**
 * Get guest data and RSVP stats for an invitation
 */
export async function getGuestData(invitationId: string): Promise<{
  guests: any[];
  rsvpStats: {
    total: number;
    attending: number;
    notAttending: number;
    pending: number;
  };
}> {
  try {
    const supabase = getSupabaseServerClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        guests: [],
        rsvpStats: { total: 0, attending: 0, notAttending: 0, pending: 0 }
      };
    }

    // First verify the invitation belongs to the user
    const { data: invitation } = await supabase
      .from('invitations')
      .select('id')
      .eq('id', invitationId)
      .eq('creator_id', user.id)
      .single();

    if (!invitation) {
      return {
        guests: [],
        rsvpStats: { total: 0, attending: 0, notAttending: 0, pending: 0 }
      };
    }

    const { data: guests, error } = await supabase
      .from('guests')
      .select(`
        *,
        rsvp_response:rsvp_responses(*)
      `)
      .eq('invitation_id', invitationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching guests:', error);
      return {
        guests: [],
        rsvpStats: { total: 0, attending: 0, notAttending: 0, pending: 0 }
      };
    }

    const processedGuests = (guests || []).map((guest: any) => ({
      ...guest,
      email: guest.email || undefined,
      phone: guest.phone || undefined,
      guest_code: guest.guest_code || '',
      rsvp_response: guest.rsvp_response?.[0] || undefined,
    }));

    const rsvpStats = {
      total: processedGuests.length,
      attending: processedGuests.filter(g => g.rsvp_response?.status === 'attending').length,
      notAttending: processedGuests.filter(g => g.rsvp_response?.status === 'not_attending').length,
      pending: processedGuests.filter(g => !g.rsvp_response || g.rsvp_response.status === 'pending').length,
    };

    return {
      guests: processedGuests,
      rsvpStats,
    };
  } catch (error) {
    console.error('Error in getGuestData:', error);
    return {
      guests: [],
      rsvpStats: { total: 0, attending: 0, notAttending: 0, pending: 0 }
    };
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