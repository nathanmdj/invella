'use client';

import { useState } from 'react';
import { Check, Heart, Briefcase, PartyPopper, Star } from 'lucide-react';
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

// Template categories and mock templates
const TEMPLATE_CATEGORIES = [
  { value: 'all', label: 'All Templates' },
  { value: 'wedding', label: 'Wedding', icon: Heart },
  { value: 'birthday', label: 'Birthday', icon: PartyPopper },
  { value: 'corporate', label: 'Corporate', icon: Briefcase },
  { value: 'anniversary', label: 'Anniversary', icon: Star },
];

const MOCK_TEMPLATES = [
  {
    id: 'a0b1c2d3-e4f5-6789-abcd-ef0123456789',
    name: 'Elegant Wedding',
    category: 'wedding',
    description: 'Beautiful floral design perfect for weddings',
    preview_image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400',
    design_config: {
      primaryColor: '#f8fafc',
      accentColor: '#e11d48',
      fontFamily: 'serif',
      layout: 'classic'
    },
    is_public: true,
  },
  {
    id: 'b1c2d3e4-f5a6-789b-cdef-012345678901',
    name: 'Modern Birthday',
    category: 'birthday',
    description: 'Vibrant and fun design for birthday celebrations',
    preview_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    design_config: {
      primaryColor: '#fbbf24',
      accentColor: '#7c3aed',
      fontFamily: 'sans-serif',
      layout: 'modern'
    },
    is_public: true,
  },
  {
    id: 'c2d3e4f5-a6b7-89cd-ef01-23456789abcd',
    name: 'Corporate Event',
    category: 'corporate',
    description: 'Professional and clean design for business events',
    preview_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
    design_config: {
      primaryColor: '#1f2937',
      accentColor: '#3b82f6',
      fontFamily: 'sans-serif',
      layout: 'minimal'
    },
    is_public: true,
  },
  {
    id: 'd3e4f5a6-b789-cdef-0123-456789abcdef',
    name: 'Garden Party',
    category: 'birthday',
    description: 'Natural and fresh design with botanical elements',
    preview_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    design_config: {
      primaryColor: '#ecfdf5',
      accentColor: '#059669',
      fontFamily: 'serif',
      layout: 'garden'
    },
    is_public: true,
  },
  {
    id: 'e4f5a6b7-89cd-ef01-2345-6789abcdef01',
    name: 'Golden Anniversary',
    category: 'anniversary',
    description: 'Luxurious gold-themed design for special anniversaries',
    preview_image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
    design_config: {
      primaryColor: '#fffbeb',
      accentColor: '#d97706',
      fontFamily: 'serif',
      layout: 'luxury'
    },
    is_public: true,
  },
  {
    id: 'f5a6b789-cdef-0123-4567-89abcdef0123',
    name: 'Minimalist',
    category: 'corporate',
    description: 'Clean and simple design that works for any event',
    preview_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    design_config: {
      primaryColor: '#ffffff',
      accentColor: '#1f2937',
      fontFamily: 'sans-serif',
      layout: 'minimal'
    },
    is_public: true,
  },
];

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
  
  const filteredTemplates = MOCK_TEMPLATES.filter(
    template => selectedCategory === 'all' || template.category === selectedCategory
  );

  const getCategoryIcon = (category: string) => {
    const categoryData = TEMPLATE_CATEGORIES.find(c => c.value === category);
    if (!categoryData?.icon) return null;
    const Icon = categoryData.icon;
    return <Icon className="h-4 w-4" />;
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
                  {category.icon && <category.icon className="h-4 w-4" />}
                  <span>{category.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        {filteredTemplates.map((template) => (
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
                <img
                  src={template.preview_image}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    {getCategoryIcon(template.category)}
                    <span className="ml-1 capitalize">{template.category}</span>
                  </Badge>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
                
                {/* Color Palette */}
                <div className="flex items-center space-x-2 pt-2">
                  <span className="text-xs text-muted-foreground">Colors:</span>
                  <div className="flex space-x-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: template.design_config.primaryColor }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: template.design_config.accentColor }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Template Info */}
      {selectedTemplate && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">
              Template selected: {MOCK_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
            </span>
          </div>
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No templates found for this category
          </p>
        </div>
      )}
    </div>
  );
}