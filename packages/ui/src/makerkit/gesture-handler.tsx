'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '../lib/utils';

interface SwipeGestureProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  className?: string;
  disabled?: boolean;
}

export function SwipeGesture({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className,
  disabled = false
}: SwipeGestureProps) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleDragStart = () => {
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (disabled) return;
    
    setIsDragging(false);
    
    const { offset } = info;
    
    // Reset position
    x.set(0);
    y.set(0);
    
    // Check for swipe gestures
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (offset.x > threshold && onSwipeRight) {
        onSwipeRight();
      } else if (offset.x < -threshold && onSwipeLeft) {
        onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (offset.y > threshold && onSwipeDown) {
        onSwipeDown();
      } else if (offset.y < -threshold && onSwipeUp) {
        onSwipeUp();
      }
    }
  };

  const handleDrag = (_event: unknown, info: PanInfo) => {
    if (disabled) return;
    
    x.set(info.offset.x);
    y.set(info.offset.y);
  };

  return (
    <motion.div
      className={cn(
        "swipe-card touch-manipulation",
        isDragging && "swiping",
        className
      )}
      style={{ x, y, rotateX, rotateY }}
      drag={!disabled}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

interface PinchZoomProps {
  children: ReactNode;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
  disabled?: boolean;
}

export function PinchZoom({
  children,
  minZoom = 0.5,
  maxZoom = 3,
  className,
  disabled = false
}: PinchZoomProps) {
  const [scale, setScale] = useState(1);
  const [_lastScale, setLastScale] = useState(1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || !ref.current) return;

    const element = ref.current;
    let initialDistance = 0;
    let initialScale = 1;

    const getDistance = (touches: TouchList) => {
      const [touch1, touch2] = Array.from(touches);
      return Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        initialDistance = getDistance(e.touches);
        initialScale = scale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        const scaleChange = currentDistance / initialDistance;
        const newScale = Math.min(Math.max(initialScale * scaleChange, minZoom), maxZoom);
        setScale(newScale);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        setLastScale(scale);
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scale, minZoom, maxZoom, disabled]);

  return (
    <div
      ref={ref}
      className={cn("overflow-hidden touch-manipulation", className)}
    >
      <motion.div
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ transformOrigin: "center center" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface LongPressProps {
  children: ReactNode;
  onLongPress: () => void;
  delay?: number;
  className?: string;
  disabled?: boolean;
}

export function LongPress({
  children,
  onLongPress,
  delay = 500,
  className,
  disabled = false
}: LongPressProps) {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleStart = () => {
    if (disabled) return;
    
    setIsPressed(true);
    timeoutRef.current = setTimeout(() => {
      onLongPress();
      setIsPressed(false);
    }, delay);
  };

  const handleEnd = () => {
    setIsPressed(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className={cn("touch-manipulation", className)}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      animate={isPressed ? { scale: 0.95 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {children}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
}

// Haptic Feedback Hook
export function useHapticFeedback() {
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    // Try to use native haptic feedback on supported devices
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      };
      navigator.vibrate(patterns[type]);
    }
    
    // Fallback to CSS animation for visual feedback
    const element = document.activeElement as HTMLElement;
    if (element) {
      element.classList.add(`haptic-${type}`);
      setTimeout(() => {
        element.classList.remove(`haptic-${type}`);
      }, type === 'heavy' ? 300 : type === 'medium' ? 200 : 100);
    }
  };

  return { triggerHaptic };
}

// Sound Effects Hook
export function useSoundEffects() {
  const playSound = (type: 'click' | 'success' | 'error' | 'notification') => {
    // Create audio context for web audio API
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      const sounds = {
        click: { frequency: 800, duration: 50 },
        success: { frequency: 900, duration: 200 },
        error: { frequency: 400, duration: 300 },
        notification: { frequency: 600, duration: 150 }
      };
      
      const sound = sounds[type];
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + sound.duration / 1000);
    } catch {
      // Fallback: use a simple beep sound or silent operation
      console.log(`Sound effect: ${type}`);
    }
  };

  return { playSound };
}