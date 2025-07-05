import { z } from 'zod';

// Schema for template design configuration
export const TemplateDesignConfigSchema = z.object({
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  fontFamily: z.string().optional(),
  layout: z.string().optional(),
  // Allow any additional configuration
}).catchall(z.any());

// Schema for creating a new template
export const CreateTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  description: z.string().optional(),
  design_config: TemplateDesignConfigSchema.default({}),
  category: z.string().min(1, 'Category is required').max(100, 'Category is too long'),
  is_public: z.boolean().default(false),
  preview_image: z.string().url().optional().or(z.literal('')),
});

// Schema for updating a template
export const UpdateTemplateSchema = CreateTemplateSchema.partial().extend({
  id: z.string().uuid(),
});

// Schema for template filters/search
export const TemplateFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  is_public: z.boolean().optional(),
  created_by: z.string().uuid().optional(),
  sort_by: z.enum(['created_at', 'name', 'category']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().positive().max(100).default(20),
  offset: z.number().nonnegative().default(0),
});

// Type exports
export type CreateTemplate = z.infer<typeof CreateTemplateSchema>;
export type UpdateTemplate = z.infer<typeof UpdateTemplateSchema>;
export type TemplateFilters = z.infer<typeof TemplateFiltersSchema>;
export type TemplateDesignConfig = z.infer<typeof TemplateDesignConfigSchema>;

// Database types (matches our Supabase schema)
export interface Template {
  id: string;
  name: string;
  description?: string;
  design_config: TemplateDesignConfig;
  category: string;
  is_public: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  preview_image?: string;
}

// Template categories
export const TEMPLATE_CATEGORIES = [
  { value: 'all', label: 'All Templates' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'baby_shower', label: 'Baby Shower' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'other', label: 'Other' },
] as const;

export type TemplateCategory = typeof TEMPLATE_CATEGORIES[number]['value'];