'use client';

import { useState } from 'react';
import { Check, Heart, Briefcase, PartyPopper, Star, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { cn } from '@kit/ui/utils';
import { usePublicTemplates } from '../hooks/use-template-data';
import { TEMPLATE_CATEGORIES } from '../schema/template.schema';

// Icon mapping for categories
const CATEGORY_ICONS = {
  wedding: Heart,
  birthday: PartyPopper,
  corporate: Briefcase,
  anniversary: Star,
  baby_shower: Heart,
  graduation: Star,
  holiday: PartyPopper,
  other: Briefcase,
} as const;

interface TemplateSelectorProps {
  selectedTemplate?: string | null;
  onSelectTemplate: (templateId: string | null) => void;
  onCustomDesign?: () => void;
}

export function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
  onCustomDesign,
}: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Fetch templates from the database
  const { data: templates, isLoading, error } = usePublicTemplates({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    limit: 50, // Show more templates
  });

  const getCategoryIcon = (category: string) => {
    const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Template</h2>
        <p className="text-muted-foreground">
          Select a beautiful template to get started, or create a custom design
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATE_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(category.value)}
                  <span>{category.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading templates...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <span className="ml-2 text-destructive">Failed to load templates. Please try again.</span>
        </div>
      )}

      {/* Templates Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {/* Custom Design Option */}
          {onCustomDesign && (
            <Card 
              className={cn(
                "cursor-pointer transition-all hover:shadow-md border-2 border-dashed",
                "hover:border-primary"
              )}
              onClick={onCustomDesign}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Custom Design</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start from scratch with a blank canvas
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Template Cards */}
          {templates?.map((template) => (
            <Card
              key={template.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md border-2",
                selectedTemplate === template.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onSelectTemplate(template.id)}
            >
              <CardContent className="p-0">
                {/* Template Preview */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
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
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryIcon(template.category)}
                      <span className="ml-1 capitalize">{template.category.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description || 'No description available'}
                  </p>
                  
                  {/* Color Palette */}
                  {template.design_config && (template.design_config.primaryColor || template.design_config.accentColor) && (
                    <div className="flex items-center space-x-2 pt-2">
                      <span className="text-xs text-muted-foreground">Colors:</span>
                      <div className="flex space-x-1">
                        {template.design_config.primaryColor && (
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: template.design_config.primaryColor }}
                            title={`Primary: ${template.design_config.primaryColor}`}
                          />
                        )}
                        {template.design_config.accentColor && (
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: template.design_config.accentColor }}
                            title={`Accent: ${template.design_config.accentColor}`}
                          />
                        )}
                        {template.design_config.backgroundColor && (
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: template.design_config.backgroundColor }}
                            title={`Background: ${template.design_config.backgroundColor}`}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Template Info */}
      {selectedTemplate && templates && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">
              Template selected: {templates.find(t => t.id === selectedTemplate)?.name}
            </span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && templates && templates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No templates found for this category
          </p>
        </div>
      )}
    </div>
  );
}