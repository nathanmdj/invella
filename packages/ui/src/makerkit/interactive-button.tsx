'use client';

import { forwardRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useHapticFeedback, useSoundEffects } from './gesture-handler';

interface InteractiveButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'liquid' | 'magnetic' | 'morph' | 'neon' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  hapticFeedback?: 'light' | 'medium' | 'heavy' | false;
  soundEffect?: 'click' | 'success' | 'error' | 'notification' | false;
  rippleEffect?: boolean;
}

export const InteractiveButton = forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({
    children,
    onClick,
    variant = 'default',
    size = 'md',
    className,
    disabled = false,
    loading = false,
    hapticFeedback = 'light',
    soundEffect = 'click',
    rippleEffect = true,
    ...props
  }, ref) => {
    const { triggerHaptic } = useHapticFeedback();
    const { playSound } = useSoundEffects();

    const handleClick = () => {
      if (disabled || loading) return;

      // Trigger haptic feedback
      if (hapticFeedback) {
        triggerHaptic(hapticFeedback);
      }

      // Play sound effect
      if (soundEffect) {
        playSound(soundEffect);
      }

      onClick?.();
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl'
    };

    const variantStyles = {
      default: 'bg-blue-500 hover:bg-blue-600 text-white button-bounce',
      liquid: 'liquid-button text-white',
      magnetic: 'bg-purple-500 hover:bg-purple-600 text-white magnetic-hover',
      morph: 'bg-gradient-to-r from-pink-500 to-violet-500 text-white morph-hover',
      neon: 'bg-black border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black neon-glow',
      minimal: 'bg-gray-100 hover:bg-gray-200 text-gray-900 hover-lift'
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden',
          sizeStyles[size],
          variantStyles[variant],
          rippleEffect && 'ripple-effect',
          disabled && 'opacity-50 cursor-not-allowed',
          loading && 'cursor-wait',
          className
        )}
        onClick={handleClick}
        disabled={disabled || loading}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        whileHover={{ y: disabled || loading ? 0 : -2 }}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="ml-2 loading-dots">Loading</span>
          </div>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

InteractiveButton.displayName = 'InteractiveButton';

// Floating Action Button
interface FloatingActionButtonProps {
  onClick: () => void;
  icon: ReactNode;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export function FloatingActionButton({
  onClick,
  icon,
  label,
  variant = 'default',
  position = 'bottom-right',
  className
}: FloatingActionButtonProps) {
  const { triggerHaptic } = useHapticFeedback();
  const { playSound } = useSoundEffects();

  const handleClick = () => {
    triggerHaptic('medium');
    playSound('click');
    onClick();
  };

  const variantStyles = {
    default: 'bg-blue-500 hover:bg-blue-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  const positionStyles = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <motion.button
      className={cn(
        'fixed z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl group',
        variantStyles[variant],
        positionStyles[position],
        'magnetic-hover ripple-effect',
        className
      )}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="flex items-center justify-center">
        {icon}
      </div>
      
      {label && (
        <motion.div
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          initial={{ x: 10, opacity: 0 }}
          whileHover={{ x: 0, opacity: 1 }}
        >
          {label}
          <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-y-4 border-y-transparent" />
        </motion.div>
      )}
    </motion.button>
  );
}

// Animated Loading Button
interface LoadingButtonProps {
  children: ReactNode;
  isLoading: boolean;
  onClick?: () => void;
  loadingText?: string;
  className?: string;
  variant?: 'default' | 'success' | 'danger';
}

export function LoadingButton({
  children,
  isLoading,
  onClick,
  loadingText = 'Loading...',
  className,
  variant = 'default'
}: LoadingButtonProps) {
  const variantStyles = {
    default: 'bg-blue-500 hover:bg-blue-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  return (
    <motion.button
      className={cn(
        'relative px-6 py-3 rounded-lg font-medium transition-all duration-200 overflow-hidden button-bounce',
        variantStyles[variant],
        isLoading && 'cursor-wait',
        className
      )}
      onClick={onClick}
      disabled={isLoading}
      whileHover={!isLoading ? { y: -2 } : {}}
      whileTap={!isLoading ? { scale: 0.98 } : {}}
    >
      <motion.div
        className="flex items-center justify-center"
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: isLoading ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center">
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          {loadingText}
        </div>
      </motion.div>
      
      {/* Progress bar */}
      {isLoading && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-white/30"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: "linear" }}
        />
      )}
    </motion.button>
  );
}