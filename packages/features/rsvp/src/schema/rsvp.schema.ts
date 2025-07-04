import { z } from 'zod';

// Schema for guest lookup
export const GuestLookupSchema = z.object({
  guest_code: z.string().min(1, 'Guest code is required').max(10),
});

// Schema for RSVP response
export const RSVPResponseSchema = z.object({
  guest_id: z.string().uuid(),
  status: z.enum(['attending', 'not_attending'], {
    required_error: 'Please select your attendance status',
  }),
  dietary_restrictions: z.string().optional(),
  plus_one_count: z.number().min(0).max(5).default(0),
  plus_one_names: z.array(z.string().min(1)).optional(),
  message: z.string().max(500).optional(),
});

// Schema for updating RSVP response
export const UpdateRSVPResponseSchema = RSVPResponseSchema.partial().extend({
  id: z.string().uuid(),
});

// Type exports
export type GuestLookup = z.infer<typeof GuestLookupSchema>;
export type RSVPResponse = z.infer<typeof RSVPResponseSchema>;
export type UpdateRSVPResponse = z.infer<typeof UpdateRSVPResponseSchema>;

// Database types
export interface RSVPResponseRecord {
  id: string;
  guest_id: string;
  status: 'pending' | 'attending' | 'not_attending';
  dietary_restrictions?: string;
  plus_one_count: number;
  plus_one_names?: string[];
  response_date: string;
  message?: string;
}

export interface GuestWithInvitation {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  invitation_id: string;
  guest_code: string;
  plus_one_allowed: boolean;
  invitation: {
    id: string;
    title: string;
    description?: string;
    event_date?: string;
    location?: string;
    image_url?: string;
    rsvp_deadline?: string;
  };
  rsvp_response?: RSVPResponseRecord;
}