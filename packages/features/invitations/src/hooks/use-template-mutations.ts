import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import type { CreateTemplate, UpdateTemplate, Template } from '../schema/template.schema';
import { templateKeys } from './use-template-data';

// Hook to create a new template
export function useCreateTemplate() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: CreateTemplate): Promise<Template> => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('invitation_templates')
        .insert([{
          ...template,
          created_by: user.id,
        }])
        .select()
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: templateKeys.categories() });
    },
  });
}

// Hook to update an existing template
export function useUpdateTemplate() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTemplate & { id: string }): Promise<Template> => {
      const { data, error } = await supabase
        .from('invitation_templates')
        .update(updates)
        .eq('id', id)
        .select()
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: templateKeys.categories() });
    },
  });
}

// Hook to delete a template
export function useDeleteTemplate() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('invitation_templates')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: templateKeys.categories() });
    },
  });
}

// Hook to duplicate a template
export function useDuplicateTemplate() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: string): Promise<Template> => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First, fetch the template to duplicate
      const { data: originalTemplate, error: fetchError } = await supabase
        .from('invitation_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // Create a new template with the same data but different name
      const { data, error } = await supabase
        .from('invitation_templates')
        .insert([{
          name: `${originalTemplate.name} (Copy)`,
          description: originalTemplate.description,
          design_config: originalTemplate.design_config,
          category: originalTemplate.category,
          is_public: false, // Duplicates are private by default
          preview_image: originalTemplate.preview_image,
          created_by: user.id,
        }])
        .select()
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: templateKeys.categories() });
    },
  });
}

// Hook to publish/unpublish a template
export function useToggleTemplateVisibility() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_public }: { id: string; is_public: boolean }): Promise<Template> => {
      const { data, error } = await supabase
        .from('invitation_templates')
        .update({ is_public })
        .eq('id', id)
        .select()
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: templateKeys.categories() });
    },
  });
}

// Hook to bulk update templates
export function useBulkUpdateTemplates() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Array<{ id: string; updates: Partial<UpdateTemplate> }>): Promise<Template[]> => {
      const results = await Promise.all(
        updates.map(async ({ id, updates: templateUpdates }) => {
          const { data, error } = await supabase
            .from('invitation_templates')
            .update(templateUpdates)
            .eq('id', id)
            .select()
            .single();

          if (error) {
            throw new Error(`Failed to update template ${id}: ${error.message}`);
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
        })
      );

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: templateKeys.categories() });
    },
  });
}

// Hook to bulk delete templates
export function useBulkDeleteTemplates() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]): Promise<void> => {
      const { error } = await supabase
        .from('invitation_templates')
        .delete()
        .in('id', ids);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: templateKeys.categories() });
    },
  });
}