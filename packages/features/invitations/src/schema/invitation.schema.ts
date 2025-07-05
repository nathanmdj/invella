import { z } from 'zod';

// Schema for creating a new invitation
export const CreateInvitationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().optional(),
  event_date: z.date().optional(),
  location: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  template_id: z.string().uuid().optional(),
  custom_fields: z.record(z.any()).optional().default({}),
  max_guests: z.number().positive().optional(),
  rsvp_deadline: z.date().optional(),
});

// Schema for updating an invitation
export const UpdateInvitationSchema = CreateInvitationSchema.partial().extend({
  id: z.string().uuid(),
});

// Schema for invitation filters/search
export const InvitationFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['draft', 'published', 'ended']).optional(),
  sort_by: z.enum(['created_at', 'event_date', 'title']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().positive().max(100).default(20),
  offset: z.number().nonnegative().default(0),
});

// Type exports
export type CreateInvitation = z.infer<typeof CreateInvitationSchema>;
export type UpdateInvitation = z.infer<typeof UpdateInvitationSchema>;
export type InvitationFilters = z.infer<typeof InvitationFiltersSchema>;

// Database types (matches our Supabase schema)
export interface Invitation {
  id: string;
  title: string;
  description?: string;
  event_date?: string;
  location?: string;
  image_url?: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  updated_by?: string;
  template_id?: string;
  custom_fields: Record<string, any>;
  is_public: boolean;
  max_guests?: number;
  rsvp_deadline?: string;
}

export interface InvitationWithStats extends Invitation {
  guest_count: number;
  rsvp_count: number;
  attending_count: number;
  not_attending_count: number;
}