'use client';

import { toast } from '../shadcn/sonner';

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

export function useToast() {
  return {
    toast: ({ title, description, variant = 'default' }: ToastOptions) => {
      if (variant === 'destructive') {
        toast.error(title, { description });
      } else if (variant === 'success') {
        toast.success(title, { description });
      } else {
        toast(title, { description });
      }
    },
  };
}