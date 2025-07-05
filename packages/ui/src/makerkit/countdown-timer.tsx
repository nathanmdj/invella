'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
  onComplete?: () => void;
  variant?: 'default' | 'neon' | 'elegant' | 'minimal';
  showLabels?: boolean;
}

interface TimeUnit {
  value: number;
  label: string;
  previousValue?: number;
}

export function CountdownTimer({ 
  targetDate, 
  className,
  onComplete,
  variant = 'default',
  showLabels = true
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsComplete(true);
        onComplete?.();
        return [];
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return [
        { value: days, label: 'Days' },
        { value: hours, label: 'Hours' },
        { value: minutes, label: 'Minutes' },
        { value: seconds, label: 'Seconds' }
      ];
    };

    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(prev => {
        return newTimeLeft.map((unit, _index) => ({
          ...unit,
          previousValue: prev[_index]?.value
        }));
      });
    };

    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetDate, onComplete]);

  if (isComplete) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn("text-center", className)}
      >
        <div className="text-2xl font-bold text-green-500">
          🎉 Event Started!
        </div>
      </motion.div>
    );
  }

  const variantStyles = {
    default: "bg-white border border-gray-200 text-gray-900",
    neon: "bg-black border border-pink-500 text-pink-500 shadow-lg shadow-pink-500/20",
    elegant: "bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 text-purple-900",
    minimal: "bg-gray-50 border border-gray-100 text-gray-800"
  };

  const digitStyles = {
    default: "bg-gray-100",
    neon: "bg-pink-900/20 text-pink-400 shadow-inner",
    elegant: "bg-white/80 backdrop-blur-sm",
    minimal: "bg-white"
  };

  return (
    <div className={cn(
      "p-6 rounded-2xl",
      variantStyles[variant],
      className
    )}>
      <div className="flex justify-center items-center gap-4 md:gap-6">
        {timeLeft.map((unit, _index) => (
          <div key={unit.label} className="text-center">
            <div className={cn(
              "relative w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold font-mono overflow-hidden",
              digitStyles[variant]
            )}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={unit.value}
                  initial={{ y: unit.previousValue !== undefined && unit.previousValue !== unit.value ? 20 : 0, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {unit.value.toString().padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
              
              {/* Flip animation overlay */}
              {unit.previousValue !== undefined && unit.previousValue !== unit.value && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-current opacity-10 origin-top"
                />
              )}
            </div>
            
            {showLabels && (
              <motion.div 
                className="mt-2 text-xs md:text-sm font-medium opacity-70"
                animate={{ 
                  scale: unit.previousValue !== undefined && unit.previousValue !== unit.value ? [1, 1.1, 1] : 1 
                }}
                transition={{ duration: 0.3 }}
              >
                {unit.label}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Progress Ring Component
interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'gradient' | 'neon';
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  showPercentage = true,
  variant = 'default'
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const variantStyles = {
    default: "stroke-blue-500",
    gradient: "stroke-purple-500",
    neon: "stroke-pink-500"
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          className={cn(
            "progress-ring transition-all duration-300",
            variantStyles[variant],
            variant === 'neon' && "progress-glow"
          )}
          initial={{ strokeDasharray, strokeDashoffset: circumference }}
          animate={{ strokeDasharray, strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {variant === 'gradient' && (
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
        )}
      </svg>
      
      {showPercentage && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-lg font-bold"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {Math.round(progress)}%
        </motion.div>
      )}
    </div>
  );
}

// Animated Progress Bar
interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'gradient' | 'striped';
  height?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  progress,
  className,
  showPercentage = true,
  variant = 'default',
  height = 'md'
}: ProgressBarProps) {
  const heightStyles = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  };

  const variantStyles = {
    default: 'bg-blue-500',
    gradient: 'bg-gradient-to-r from-purple-500 to-blue-500',
    striped: 'bg-blue-500 relative overflow-hidden'
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "w-full bg-gray-200 rounded-full overflow-hidden",
        heightStyles[height]
      )}>
        <motion.div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            variantStyles[variant]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {variant === 'striped' && (
            <div 
              className="absolute inset-0 bg-white/20 bg-opacity-25"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)',
                animation: 'progress-stripes 1s linear infinite'
              }}
            />
          )}
        </motion.div>
      </div>
      
      {showPercentage && (
        <motion.div
          className="mt-2 text-sm font-medium text-center"
          animate={{ opacity: [0, 1] }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(progress)}%
        </motion.div>
      )}
      
      <style jsx>{`
        @keyframes progress-stripes {
          0% { background-position: 0 0; }
          100% { background-position: 40px 0; }
        }
      `}</style>
    </div>
  );
}