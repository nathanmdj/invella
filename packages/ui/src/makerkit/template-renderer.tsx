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
  
  // Apply template-specific styling with enhanced typography
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
    
    // Enhanced Typography System
    '--template-font': config?.fontFamily || 'sans-serif',
    '--template-font-heading': getHeadingFont(config?.layout as string),
    '--template-font-body': getBodyFont(config?.layout as string),
    '--template-font-accent': getAccentFont(config?.layout as string),
    
    // Typography Scale (dramatic hierarchy)
    '--template-text-xs': '0.75rem',
    '--template-text-sm': '0.875rem', 
    '--template-text-base': '1rem',
    '--template-text-lg': '1.125rem',
    '--template-text-xl': '1.25rem',
    '--template-text-2xl': '1.5rem',
    '--template-text-3xl': '1.875rem',
    '--template-text-4xl': '2.25rem',
    '--template-text-5xl': '3rem',
    '--template-text-6xl': '3.75rem',
    '--template-text-7xl': '4.5rem',
    '--template-text-8xl': '6rem',
    '--template-text-9xl': '8rem',
    
    // Letter spacing for dramatic effect
    '--template-tracking-tighter': '-0.05em',
    '--template-tracking-tight': '-0.025em',
    '--template-tracking-normal': '0em',
    '--template-tracking-wide': '0.025em',
    '--template-tracking-wider': '0.05em',
    '--template-tracking-widest': '0.1em',
    
    // Line heights for perfect typography
    '--template-leading-none': '1',
    '--template-leading-tight': '1.25',
    '--template-leading-snug': '1.375',
    '--template-leading-normal': '1.5',
    '--template-leading-relaxed': '1.625',
    '--template-leading-loose': '2',
    
  } as React.CSSProperties;

  const templateClasses = cn(
    'template-renderer w-full h-full',
    `template-${template.category}`,
    `layout-${config?.layout || 'classic'}`,
    getTypographyClass(config?.layout as string),
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

// Typography helper functions for sophisticated font pairing
function getHeadingFont(layout: string): string {
  switch (layout) {
    case 'luxury':
    case 'romantic':
    case 'rosegold':
      return '"Playfair Display", serif';
    case 'neon':
    case 'matrix':
    case 'retro':
      return '"Orbitron", monospace';
    case 'glassmorphism':
    case 'holographic':
      return '"Inter", sans-serif';
    case 'botanical':
    case 'dreamy':
    case 'aurora':
      return '"Crimson Text", serif';
    case 'ocean':
      return '"Montserrat", sans-serif';
    default:
      return '"Inter", sans-serif';
  }
}

function getBodyFont(layout: string): string {
  switch (layout) {
    case 'luxury':
    case 'romantic':
    case 'rosegold':
      return '"Cormorant Garamond", serif';
    case 'neon':
    case 'matrix':
    case 'retro':
      return '"JetBrains Mono", monospace';
    case 'glassmorphism':
    case 'holographic':
      return '"Inter", sans-serif';
    case 'botanical':
    case 'dreamy':
    case 'aurora':
      return '"Source Sans Pro", sans-serif';
    case 'ocean':
      return '"Open Sans", sans-serif';
    default:
      return '"Inter", sans-serif';
  }
}

function getAccentFont(layout: string): string {
  switch (layout) {
    case 'luxury':
    case 'romantic':
    case 'rosegold':
      return '"Dancing Script", cursive';
    case 'neon':
    case 'matrix':
    case 'retro':
      return '"Rajdhani", sans-serif';
    case 'glassmorphism':
    case 'holographic':
      return '"Poppins", sans-serif';
    case 'botanical':
    case 'dreamy':
    case 'aurora':
      return '"Pacifico", cursive';
    case 'ocean':
      return '"Nunito", sans-serif';
    default:
      return '"Poppins", sans-serif';
  }
}

function getTypographyClass(layout: string): string {
  switch (layout) {
    case 'luxury':
    case 'romantic':
    case 'rosegold':
      return 'typography-luxury-serif';
    case 'neon':
    case 'matrix':
    case 'retro':
      return 'typography-cyberpunk';
    case 'glassmorphism':
    case 'holographic':
      return 'typography-modern-clean';
    case 'botanical':
    case 'dreamy':
    case 'aurora':
      return 'typography-organic';
    case 'ocean':
      return 'typography-fresh';
    default:
      return 'typography-default';
  }
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