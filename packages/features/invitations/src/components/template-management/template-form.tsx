'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { Switch } from '@kit/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { useToast } from '@kit/ui/use-toast';
import { Loader2, Save } from 'lucide-react';
import { 
  CreateTemplateSchema, 
  type CreateTemplate,
  TEMPLATE_CATEGORIES 
} from '../../schema/template.schema';
import { useTemplate } from '../../hooks/use-template-data';
import { useCreateTemplate, useUpdateTemplate } from '../../hooks/use-template-mutations';

interface TemplateFormProps {
  templateId?: string;
}

export function TemplateForm({ templateId }: TemplateFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing template if editing
  const { data: existingTemplate, isLoading: isLoadingTemplate } = useTemplate(templateId || '');
  
  const createTemplateMutation = useCreateTemplate();
  const updateTemplateMutation = useUpdateTemplate();

  const form = useForm({
    resolver: zodResolver(CreateTemplateSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'other',
      is_public: false,
      preview_image: '',
      design_config: {
        primaryColor: '#ffffff',
        accentColor: '#000000',
        fontFamily: 'sans-serif',
        layout: 'default',
      },
    },
  });

  // Populate form with existing template data when editing
  useEffect(() => {
    if (existingTemplate && templateId) {
      form.reset({
        name: existingTemplate.name,
        description: existingTemplate.description || '',
        category: existingTemplate.category,
        is_public: existingTemplate.is_public,
        preview_image: existingTemplate.preview_image || '',
        design_config: {
          primaryColor: existingTemplate.design_config.primaryColor || '#ffffff',
          accentColor: existingTemplate.design_config.accentColor || '#000000',
          fontFamily: existingTemplate.design_config.fontFamily || 'sans-serif',
          layout: existingTemplate.design_config.layout || 'default',
          ...existingTemplate.design_config,
        },
      });
    }
  }, [existingTemplate, templateId, form]);

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      if (templateId) {
        // Update existing template
        await updateTemplateMutation.mutateAsync({
          id: templateId,
          ...values,
        });
        toast({
          title: 'Template updated',
          description: 'Your template has been updated successfully.',
        });
      } else {
        // Create new template
        await createTemplateMutation.mutateAsync(values);
        toast({
          title: 'Template created',
          description: 'Your template has been created successfully.',
        });
      }
      router.push('/home/admin/templates');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${templateId ? 'update' : 'create'} template. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (templateId && isLoadingTemplate) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading template...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter template name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Describe your template" rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TEMPLATE_CATEGORIES.filter(cat => cat.value !== 'all').map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preview_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preview Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormDescription>
                      URL to a preview image for this template
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_public"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Public Template</FormLabel>
                      <FormDescription>
                        Make this template available to all users
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Design Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Design Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="design_config.primaryColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Color</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input {...field} placeholder="#ffffff" />
                      </FormControl>
                      <div 
                        className="w-10 h-10 rounded border border-gray-200"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="design_config.accentColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accent Color</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input {...field} placeholder="#000000" />
                      </FormControl>
                      <div 
                        className="w-10 h-10 rounded border border-gray-200"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="design_config.fontFamily"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font Family</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sans-serif">Sans Serif</SelectItem>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="monospace">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="design_config.layout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Layout Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a layout" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="elegant">Elegant</SelectItem>
                        <SelectItem value="vintage">Vintage</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {templateId ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </form>
    </Form>
  );
}