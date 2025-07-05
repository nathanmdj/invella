import { useQuery } from '@tanstack/react-query';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import type { Template, TemplateFilters } from '../schema/template.schema';

// Query keys for React Query
export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (filters: TemplateFilters) => [...templateKeys.lists(), filters] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
  categories: () => [...templateKeys.all, 'categories'] as const,
  public: () => [...templateKeys.all, 'public'] as const,
};

// Hook to fetch templates
export function useTemplates(filters: Partial<TemplateFilters> = {}) {
  const supabase = useSupabase();

  // Apply defaults
  const finalFilters: TemplateFilters = {
    sort_by: 'created_at',
    sort_order: 'desc',
    limit: 20,
    offset: 0,
    ...filters,
  };

  return useQuery({
    queryKey: templateKeys.list(finalFilters),
    queryFn: async (): Promise<Template[]> => {
      let query = supabase
        .from('invitation_templates')
        .select('*')
        .order(finalFilters.sort_by, { 
          ascending: finalFilters.sort_order === 'asc' 
        });

      // Apply filters
      if (finalFilters.search) {
        query = query.or(`name.ilike.%${finalFilters.search}%,description.ilike.%${finalFilters.search}%`);
      }

      if (finalFilters.category) {
        query = query.eq('category', finalFilters.category);
      }

      if (finalFilters.is_public !== undefined) {
        query = query.eq('is_public', finalFilters.is_public);
      }

      if (finalFilters.created_by) {
        query = query.eq('created_by', finalFilters.created_by);
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

      return (data || []).map((template: any) => ({
        ...template,
        description: template.description ?? undefined,
        created_by: template.created_by ?? undefined,
        preview_image: template.preview_image ?? undefined,
        design_config: (typeof template.design_config === 'object' && template.design_config !== null) 
          ? template.design_config 
          : {},
      }));
    },
  });
}

// Hook to fetch public templates only
export function usePublicTemplates(filters: Partial<TemplateFilters> = {}) {
  return useTemplates({ ...filters, is_public: true });
}

// Hook to fetch a single template by ID
export function useTemplate(id: string) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: async (): Promise<Template> => {
      const { data, error } = await supabase
        .from('invitation_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        ...data,
        description: data.description ?? undefined,
        created_by: data.created_by ?? undefined,
        preview_image: data.preview_image ?? undefined,
        design_config: (typeof data.design_config === 'object' && data.design_config !== null) 
          ? data.design_config 
          : {},
      };
    },
    enabled: !!id,
  });
}

// Hook to fetch template categories with counts
export function useTemplateCategories() {
  const supabase = useSupabase();

  return useQuery({
    queryKey: templateKeys.categories(),
    queryFn: async (): Promise<Array<{ category: string; count: number }>> => {
      const { data, error } = await supabase
        .from('invitation_templates')
        .select('category')
        .eq('is_public', true);

      if (error) {
        throw new Error(error.message);
      }

      // Count templates by category
      const categoryCount = (data || []).reduce((acc, template) => {
        acc[template.category] = (acc[template.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(categoryCount).map(([category, count]) => ({
        category,
        count,
      }));
    },
  });
}

// Hook to fetch user's own templates
export function useMyTemplates(filters: Partial<TemplateFilters> = {}) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: [...templateKeys.lists(), 'my-templates', filters],
    queryFn: async (): Promise<Template[]> => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const finalFilters: TemplateFilters = {
        sort_by: 'created_at',
        sort_order: 'desc',
        limit: 20,
        offset: 0,
        ...filters,
        created_by: user.id,
      };

      let query = supabase
        .from('invitation_templates')
        .select('*')
        .eq('created_by', user.id)
        .order(finalFilters.sort_by, { 
          ascending: finalFilters.sort_order === 'asc' 
        });

      if (finalFilters.search) {
        query = query.or(`name.ilike.%${finalFilters.search}%,description.ilike.%${finalFilters.search}%`);
      }

      if (finalFilters.category) {
        query = query.eq('category', finalFilters.category);
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

      return (data || []).map((template: any) => ({
        ...template,
        description: template.description ?? undefined,
        created_by: template.created_by ?? undefined,
        preview_image: template.preview_image ?? undefined,
        design_config: (typeof template.design_config === 'object' && template.design_config !== null) 
          ? template.design_config 
          : {},
      }));
    },
  });
}