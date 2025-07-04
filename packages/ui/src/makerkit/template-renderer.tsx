'use client';

import { cn } from '../lib/utils';
import type { Database } from '@kit/supabase/database';

type TemplateDesignConfig = Database['public']['Tables']['invitation_templates']['Row']['design_config'];

interface TemplateRendererProps {
  template: {
    id: string;
    name: string;
    category: string;
    design_config: TemplateDesignConfig;
  };
  invitation: {
    id: string;
    title: string;
    description?: string;
    event_date: string;
    location?: string;
    image_url?: string;
  };
  children: React.ReactNode;
  className?: string;
}

export function TemplateRenderer({ 
  template, 
  invitation, 
  children, 
  className 
}: TemplateRendererProps) {
  const config = template.design_config as any;
  
  // Apply template-specific styling
  const templateStyles = {
    '--template-primary': config?.primaryColor || '#3b82f6',
    '--template-accent': config?.accentColor || '#f59e0b',
    '--template-font': config?.fontFamily || 'sans-serif',
  } as React.CSSProperties;

  const templateClasses = cn(
    'template-renderer',
    `template-${template.category}`,
    `layout-${config?.layout || 'classic'}`,
    config?.fontFamily === 'serif' ? 'font-serif' : 'font-sans',
    className
  );

  return (
    <div 
      className={templateClasses}
      style={templateStyles}
    >
      {children}
    </div>
  );
}

// Template-specific layout components
export function ClassicTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="classic-template space-y-8">
      {children}
    </div>
  );
}

export function ModernTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="modern-template space-y-6">
      {children}
    </div>
  );
}

export function MinimalTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="minimal-template space-y-4">
      {children}
    </div>
  );
}

export function GardenTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="garden-template space-y-6">
      {children}
    </div>
  );
}

export function LuxuryTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="luxury-template space-y-8">
      {children}
    </div>
  );
}

// Template selector utility
export function getTemplateComponent(layout: string) {
  switch (layout) {
    case 'classic':
      return ClassicTemplate;
    case 'modern':
      return ModernTemplate;
    case 'minimal':
      return MinimalTemplate;
    case 'garden':
      return GardenTemplate;
    case 'luxury':
      return LuxuryTemplate;
    default:
      return ClassicTemplate;
  }
}