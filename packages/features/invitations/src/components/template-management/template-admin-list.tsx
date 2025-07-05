'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Copy, MoreHorizontal } from 'lucide-react';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { Card, CardContent } from '@kit/ui/card';
import { Input } from '@kit/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@kit/ui/alert-dialog';
import { useToast } from '@kit/ui/use-toast';
import { cn } from '@kit/ui/utils';
import { useMyTemplates } from '../../hooks/use-template-data';
import { 
  useDeleteTemplate, 
  useDuplicateTemplate, 
  useToggleTemplateVisibility 
} from '../../hooks/use-template-mutations';
import { TEMPLATE_CATEGORIES } from '../../schema/template.schema';
import Link from 'next/link';

export function TemplateAdminList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: templates, isLoading, error } = useMyTemplates({
    search: searchTerm || undefined,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  const deleteTemplateMutation = useDeleteTemplate();
  const duplicateTemplateMutation = useDuplicateTemplate();
  const toggleVisibilityMutation = useToggleTemplateVisibility();

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteTemplateMutation.mutateAsync(templateId);
      toast({
        title: 'Template deleted',
        description: 'The template has been deleted successfully.',
      });
      setDeleteTemplateId(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete template. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicateTemplate = async (templateId: string) => {
    try {
      await duplicateTemplateMutation.mutateAsync(templateId);
      toast({
        title: 'Template duplicated',
        description: 'The template has been duplicated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate template. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleVisibility = async (templateId: string, isPublic: boolean) => {
    try {
      await toggleVisibilityMutation.mutateAsync({ id: templateId, is_public: !isPublic });
      toast({
        title: 'Template updated',
        description: `Template is now ${!isPublic ? 'public' : 'private'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update template visibility. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading templates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-destructive">Failed to load templates</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATE_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates?.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Template Preview */}
              <div className="relative aspect-[3/4] overflow-hidden">
                {template.preview_image ? (
                  <img
                    src={template.preview_image}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <svg className="h-12 w-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">No preview</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    {template.category.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant={template.is_public ? 'default' : 'secondary'} className="text-xs">
                    {template.is_public ? 'Public' : 'Private'}
                  </Badge>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description || 'No description'}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/home/admin/templates/${template.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicateTemplate(template.id)}
                        disabled={duplicateTemplateMutation.isPending}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleVisibility(template.id, template.is_public)}
                        disabled={toggleVisibilityMutation.isPending}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {template.is_public ? 'Make Private' : 'Make Public'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteTemplateId(template.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {templates && templates.length === 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            {searchTerm || selectedCategory !== 'all' 
              ? 'No templates match your search criteria' 
              : 'No templates found'
            }
          </div>
          <Button asChild className="mt-4">
            <Link href="/home/admin/templates/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Template
            </Link>
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTemplateId} onOpenChange={() => setDeleteTemplateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the template
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTemplateId && handleDeleteTemplate(deleteTemplateId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}