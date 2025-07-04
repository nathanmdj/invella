import { z } from 'zod';

// Schema for adding a guest
export const CreateGuestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().max(50, 'Phone number is too long').optional().or(z.literal('')),
  invitation_id: z.string().uuid(),
  plus_one_allowed: z.boolean().default(false),
});

// Schema for bulk guest import
export const BulkGuestImportSchema = z.object({
  guests: z.array(CreateGuestSchema.omit({ invitation_id: true })),
  invitation_id: z.string().uuid(),
});

// Schema for updating a guest
export const UpdateGuestSchema = CreateGuestSchema.partial().extend({
  id: z.string().uuid(),
});

// Type exports
export type CreateGuest = z.infer<typeof CreateGuestSchema>;
export type UpdateGuest = z.infer<typeof UpdateGuestSchema>;
export type BulkGuestImport = z.infer<typeof BulkGuestImportSchema>;

// Database types
export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  invitation_id: string;
  created_at: string;
  updated_at: string;
  guest_code: string;
  plus_one_allowed: boolean;
}

export interface GuestWithRSVP extends Guest {
  rsvp_response?: {
    id: string;
    status: 'pending' | 'attending' | 'not_attending';
    dietary_restrictions?: string;
    plus_one_count: number;
    plus_one_names?: string[];
    response_date: string;
    message?: string;
  };
}