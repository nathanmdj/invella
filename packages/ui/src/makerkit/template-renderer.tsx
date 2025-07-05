'use client';

import { motion } from 'framer-motion';
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
  children: React.ReactNode;
  className?: string;
}

export function TemplateRenderer({ 
  template, 
  children, 
  className 
}: TemplateRendererProps) {
  const config = template.design_config as Record<string, unknown>;
  
  // Apply template-specific styling
  const templateStyles = {
    // Core brand colors
    '--template-primary': config?.primaryColor || '#3b82f6',
    '--template-accent': config?.accentColor || '#f59e0b',
    
    // Comprehensive color palette
    '--template-background': config?.backgroundColor || '#ffffff',
    '--template-surface': config?.surfaceColor || '#f8fafc',
    '--template-text': config?.textColor || '#1f2937',
    '--template-text-secondary': config?.textSecondaryColor || '#6b7280',
    '--template-border': config?.borderColor || '#e5e7eb',
    '--template-overlay': config?.overlayColor || 'rgba(0, 0, 0, 0.5)',
    
    // Typography
    '--template-font': config?.fontFamily || 'sans-serif',
  } as React.CSSProperties;

  const templateClasses = cn(
    'template-renderer w-full h-full',
    `template-${template.category}`,
    `layout-${config?.layout || 'classic'}`,
    config?.fontFamily === 'serif' ? 'font-serif' : 'font-sans',
    className
  );

  return (
    <motion.div 
      className={templateClasses}
      style={templateStyles}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// Template-specific layout components
export function ClassicTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      className="classic-template space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' as const }}
    >
      {children}
    </motion.div>
  );
}

export function ModernTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      className="modern-template space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' as const }}
    >
      {children}
    </motion.div>
  );
}

export function MinimalTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      className="minimal-template space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' as const }}
    >
      {children}
    </motion.div>
  );
}

export function GardenTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      className="garden-template space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' as const }}
    >
      {children}
    </motion.div>
  );
}

export function LuxuryTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      className="luxury-template space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' as const }}
    >
      {children}
    </motion.div>
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