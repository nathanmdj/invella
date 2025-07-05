'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView, Variants } from 'framer-motion';
import { cn } from '../lib/utils';
import { Badge } from '../shadcn/badge';
import { Calendar, MapPin, Users, Heart } from 'lucide-react';
import { InteractiveButton } from './interactive-button';
import type { Database } from '@kit/supabase/database';

type Invitation = Database['public']['Tables']['invitations']['Row'];

interface FrameConfig {
  id: string;
  type: 'hero' | 'details' | 'rsvp' | 'gallery';
  title?: string;
  showInNavigation?: boolean;
}

interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  design_config: Record<string, unknown>;
}

interface InvitationFramesProps {
  invitation: Invitation;
  template: TemplateConfig;
  frames: FrameConfig[];
  onRSVPClick?: () => void;
  className?: string;
}

export function InvitationFrames({ 
  invitation, 
  template, 
  frames, 
  onRSVPClick,
  className 
}: InvitationFramesProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Ensure client-side only rendering for hydration safety
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Framer Motion scroll tracking - only on client
  const { scrollY } = useScroll({ container: containerRef });
  useSpring(scrollY, { stiffness: 100, damping: 30 });

  // Smooth scroll to frame with Framer Motion
  const scrollToFrame = useCallback((index: number) => {
    if (containerRef.current && isClient) {
      const frameHeight = window.innerHeight;
      const targetY = index * frameHeight;
      
      // Smooth scroll with requestAnimationFrame
      const startScrollTop = containerRef.current.scrollTop;
      const distance = targetY - startScrollTop;
      const duration = 1200; // 1.2 seconds
      const startTime = performance.now();
      
      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        if (containerRef.current) {
          containerRef.current.scrollTop = startScrollTop + distance * easeOut;
        }
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
      
      setCurrentFrame(index);
    }
  }, [isClient]);

  // Throttle function to limit scroll event frequency
  const throttledScrollHandler = useMemo(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    return () => {
      if (timeoutId) return;
      
      timeoutId = setTimeout(() => {
        if (containerRef.current && isClient) {
          const scrollTop = containerRef.current.scrollTop;
          const frameHeight = window.innerHeight;
          const newCurrentFrame = Math.round(scrollTop / frameHeight);
          
          // Use functional update to avoid dependency on currentFrame
          setCurrentFrame(prevFrame => {
            if (newCurrentFrame !== prevFrame && newCurrentFrame >= 0 && newCurrentFrame < frames.length) {
              return newCurrentFrame;
            }
            return prevFrame;
          });
        }
        timeoutId = null;
      }, 50); // Throttle to 20fps for smooth performance
    };
  }, [frames.length, isClient]);

  // Update current frame based on scroll position
  const handleScroll = useCallback(throttledScrollHandler, [throttledScrollHandler]);

  return (
    <motion.div 
      ref={containerRef}
      className={cn('invitation-frames fixed inset-0 w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide', className)}
      style={{ 
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth'
      }}
      onScroll={isClient ? handleScroll : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Frame Container */}
      <div className="w-full">
        {frames.map((frame, index) => (
          <motion.div 
            key={frame.id}
            className="min-h-screen w-full relative overflow-hidden"
            style={{ 
              height: '100vh',
              minHeight: '100vh',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always'
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.1,
              ease: 'easeOut' as const
            }}
          >
            <InvitationFrame 
              frame={frame}
              invitation={invitation}
              template={template}
              index={index}
              isActive={currentFrame === index}
              onRSVPClick={onRSVPClick}
            />
          </motion.div>
        ))}
      </div>

      {/* Enhanced Navigation Dots */}
      <AnimatePresence>
        {frames.length > 1 && isClient && (
          <motion.div 
            className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col space-y-3 z-50"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {frames.map((frame, index) => (
              <motion.button
                key={frame.id}
                onClick={() => scrollToFrame(index)}
                className={cn(
                  'relative w-3 h-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 group',
                  'backdrop-blur-sm border border-white/20',
                  index === currentFrame 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white/30 hover:bg-white/50'
                )}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                aria-label={`Go to frame ${index + 1}: ${frame.title}`}
              >
                {/* Active indicator */}
                <AnimatePresence>
                  {index === currentFrame && (
                    <motion.div 
                      className="absolute inset-0 rounded-full"
                      style={{ 
                        background: 'var(--template-primary)',
                        boxShadow: '0 0 20px var(--template-primary)50'
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
                
                {/* Tooltip */}
                <motion.div 
                  className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 min-w-max"
                >
                  {frame.title || `Frame ${index + 1}`}
                </motion.div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>


    </motion.div>
  );
}

interface InvitationFrameProps {
  frame: FrameConfig;
  invitation: Invitation;
  template: TemplateConfig;
  index: number;
  isActive: boolean;
  onRSVPClick?: () => void;
}

function InvitationFrame({ 
  frame, 
  invitation, 
  template, 
  onRSVPClick 
}: InvitationFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const isInView = useInView(ref, { amount: 0.3 });

  // Ensure client-side only rendering for hydration safety
  useEffect(() => {
    setIsClient(true);
  }, []);

  const frameVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const
      }
    }
  };

  switch (frame.type) {
    case 'hero':
      return (
        <motion.div 
          ref={ref}
          className="relative isolate w-full h-full min-h-screen"
          variants={frameVariants}
          initial={isClient ? "hidden" : "visible"}
          animate={isClient && isInView ? "visible" : "visible"}
        >
          <HeroFrame 
            invitation={invitation}
            template={template}
            childVariants={childVariants}
            className="w-full h-full"
          />
        </motion.div>
      );
    case 'details':
      return (
        <motion.div 
          ref={ref}
          className="relative isolate w-full h-full min-h-screen"
          variants={frameVariants}
          initial={isClient ? "hidden" : "visible"}
          animate={isClient && isInView ? "visible" : "visible"}
        >
          <DetailsFrame 
            invitation={invitation}
            template={template}
            childVariants={childVariants}
            className="w-full h-full"
          />
        </motion.div>
      );
    case 'rsvp':
      return (
        <motion.div 
          ref={ref}
          className="relative isolate w-full h-full min-h-screen"
          variants={frameVariants}
          initial={isClient ? "hidden" : "visible"}
          animate={isClient && isInView ? "visible" : "visible"}
        >
          <RSVPFrame 
            invitation={invitation}
            template={template}
            childVariants={childVariants}
            onRSVPClick={onRSVPClick}
            className="w-full h-full"
          />
        </motion.div>
      );
    case 'gallery':
      return (
        <motion.div 
          ref={ref}
          className="relative isolate w-full h-full min-h-screen"
          variants={frameVariants}
          initial={isClient ? "hidden" : "visible"}
          animate={isClient && isInView ? "visible" : "visible"}
        >
          <GalleryFrame 
            invitation={invitation}
            template={template}
            childVariants={childVariants}
            className="w-full h-full"
          />
        </motion.div>
      );
    default:
      return null;
  }
}

// Helper function to get default background using CSS variables
function getDefaultBackground() {
  return 'var(--template-background)';
}

// Particle system component for enhanced visual effects
function ParticleSystem({ count = 20, template: _template }: { count?: number; template: TemplateConfig }) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    size: number;
    x: number;
    y: number;
    delay: number;
    duration: number;
  }>>([]);

  // Generate particles only on client side to avoid hydration mismatch
  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 12,
      duration: Math.random() * 8 + 8,
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full particle"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: 'var(--template-primary)',
            opacity: 0.3,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6] }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Enhanced floating decoration component
function FloatingDecorations({ template: _template }: { template: TemplateConfig }) {
  return (
    <>
      {/* Luxury floating elements */}
      <motion.div 
        className="absolute top-10 right-10 w-32 h-32 rounded-full floating-element opacity-20"
        style={{ 
          background: `linear-gradient(135deg, var(--template-primary), var(--template-accent))`,
          filter: 'blur(20px)'
        }}
      />
      <motion.div 
        className="absolute bottom-20 left-10 w-24 h-24 rounded-full floating-element-reverse opacity-30"
        style={{ 
          background: `linear-gradient(45deg, var(--template-accent), var(--template-primary))`,
          filter: 'blur(15px)'
        }}
      />
      
      {/* Morphing shapes */}
      <motion.div 
        className="absolute top-1/4 left-5 w-20 h-20 morphing-shape opacity-10"
        style={{ 
          background: 'var(--template-primary)',
          filter: 'blur(25px)'
        }}
        animate={{
          scale: [1, 1.2],
          rotate: [0, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: 'easeInOut',
        }}
      />
      
      {/* Geometric accents */}
      <motion.div 
        className="absolute bottom-1/3 right-8 w-16 h-16 opacity-15"
        style={{ 
          background: `conic-gradient(from 0deg, var(--template-primary), var(--template-accent), var(--template-primary))`,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          filter: 'blur(10px)'
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.5],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: 'linear',
        }}
      />
    </>
  );
}

// Individual Frame Components with Framer Motion
function HeroFrame({ 
  invitation, 
  template,
  childVariants,
  className 
}: { 
  invitation: Invitation; 
  template: TemplateConfig;
  childVariants: Variants;
  className?: string;
}) {
  const defaultBackground = getDefaultBackground();

  return (
    <div 
      className={cn('hero-frame min-h-screen w-full flex items-center justify-center relative dynamic-background', className)}
      style={{ background: defaultBackground }}
    >
      {/* Particle System */}
      <ParticleSystem template={template} count={15} />
      
      {/* Enhanced Floating Decorations */}
      <FloatingDecorations template={template} />
      
      {/* Content with glassmorphism effect */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full">
        <motion.div className="space-y-8" variants={childVariants}>
          <motion.div variants={childVariants}>
            <Badge 
              variant="outline" 
              className={cn(
                "text-sm px-6 py-3 border-0 shadow-lg glass-effect hover-lift transition-all duration-300",
                invitation.image_url ? "glass-effect-dark" : "glass-effect"
              )}
              style={{ 
                color: 'var(--template-primary)',
              }}
            >
              {template.category.charAt(0).toUpperCase() + template.category.slice(1).replace('_', ' ')}
            </Badge>
          </motion.div>
          
          <motion.h1 
            className={cn(
              "text-5xl md:text-7xl lg:text-9xl font-bold leading-tight break-words typography-luxury",
              invitation.image_url ? "text-white drop-shadow-2xl" : "",
              "hover:scale-105 transition-transform duration-500"
            )}
            style={{ 
              color: invitation.image_url ? 'white' : 'var(--template-text)',
              textShadow: invitation.image_url ? '0 4px 20px rgba(0,0,0,0.5)' : 'none'
            }}
            variants={childVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {invitation.title}
          </motion.h1>
          
          <AnimatePresence>
            {invitation.description && (
              <motion.div
                className="relative"
                variants={childVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <motion.p 
                  className={cn(
                    "text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed premium-card p-6",
                    invitation.image_url ? "glass-effect-dark text-white/90" : "glass-effect"
                  )}
                  style={{ 
                    color: invitation.image_url ? 'rgba(255, 255, 255, 0.9)' : 'var(--template-text-secondary)'
                  }}
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {invitation.description}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Call to Action Enhancement */}
          <motion.div 
            className="pt-4"
            variants={childVariants}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div
              className="inline-flex items-center space-x-3 px-8 py-4 glass-effect rounded-full cursor-pointer hover-lift"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: 'var(--template-primary)' }}
                animate={{ 
                  scale: [1, 1.5],
                  opacity: [0.7, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: 'easeInOut'
                }}
              />
              <span 
                className="text-lg font-medium"
                style={{ color: 'var(--template-text)' }}
              >
                Scroll to explore
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Enhanced Background Elements */}
      <motion.div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 30%, var(--template-primary)20, transparent 70%),
                       radial-gradient(circle at 80% 70%, var(--template-accent)15, transparent 60%)`
        }}
        animate={{
          scale: [1, 1.1],
          opacity: [0.3, 0.5],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

function DetailsFrame({ 
  invitation, 
  template,
  childVariants,
  className 
}: { 
  invitation: Invitation; 
  template: TemplateConfig;
  childVariants: Variants;
  className?: string;
}) {
  const defaultBackground = getDefaultBackground();

  return (
    <div 
      className={cn('details-frame min-h-screen w-full flex items-center justify-center relative dynamic-background', className)}
      style={{ background: defaultBackground }}
    >
      {/* Enhanced Particle System */}
      <ParticleSystem template={template} count={12} />
      
      {/* Floating Decorations */}
      <FloatingDecorations template={template} />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
        <motion.div className="text-center mb-16" variants={childVariants}>
          <motion.h2 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 typography-luxury" 
            style={{ color: 'var(--template-primary)' }}
            variants={childVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            Event Details
          </motion.h2>
          <motion.div 
            className="w-32 h-2 mx-auto rounded-full shadow-lg" 
            style={{ backgroundColor: 'var(--template-accent)' }}
            variants={childVariants}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 128, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>
        
        <motion.div className="grid gap-8 md:gap-12" variants={childVariants}>
          <AnimatePresence>
            {invitation.event_date && (
              <motion.div 
                className="premium-card hover-lift p-8 md:p-12"
                variants={childVariants}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="flex items-start space-x-6">
                  <motion.div 
                    className="p-5 rounded-3xl glass-effect"
                    style={{ backgroundColor: 'var(--template-primary)20' }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Calendar className="w-10 h-10" style={{ color: 'var(--template-primary)' }} />
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3 
                      className="text-3xl font-bold mb-4 typography-modern" 
                      style={{ color: 'var(--template-text)' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      Date & Time
                    </motion.h3>
                    <motion.p 
                      className="text-xl md:text-2xl leading-relaxed" 
                      style={{ color: 'var(--template-text-secondary)' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                    >
                      {new Date(invitation.event_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {invitation.location && (
              <motion.div 
                className="premium-card hover-lift p-8 md:p-12"
                variants={childVariants}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="flex items-start space-x-6">
                  <motion.div 
                    className="p-5 rounded-3xl glass-effect"
                    style={{ backgroundColor: 'var(--template-accent)20' }}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <MapPin className="w-10 h-10" style={{ color: 'var(--template-accent)' }} />
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3 
                      className="text-3xl font-bold mb-4 typography-modern" 
                      style={{ color: 'var(--template-text)' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                    >
                      Location
                    </motion.h3>
                    <motion.p 
                      className="text-xl md:text-2xl leading-relaxed" 
                      style={{ color: 'var(--template-text-secondary)' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 }}
                    >
                      {invitation.location}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Enhanced Background Elements */}
      <motion.div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `conic-gradient(from 180deg at 30% 20%, var(--template-primary)10, transparent 50%),
                       conic-gradient(from 0deg at 70% 80%, var(--template-accent)10, transparent 50%)`
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

function RSVPFrame({ 
  invitation: _invitation,
  template,
  childVariants,
  onRSVPClick, 
  className 
}: { 
  invitation: Invitation;
  template: TemplateConfig;
  childVariants: Variants;
  onRSVPClick?: () => void;
  className?: string;
}) {
  const defaultBackground = getDefaultBackground();

  return (
    <div 
      className={cn('rsvp-frame min-h-screen w-full flex items-center justify-center relative dynamic-background', className)}
      style={{ background: defaultBackground }}
    >
      {/* Enhanced Particle System */}
      <ParticleSystem template={template} count={25} />
      
      {/* Floating Decorations */}
      <FloatingDecorations template={template} />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full">
        <motion.div className="space-y-12" variants={childVariants}>
          {/* Enhanced Icon with Glassmorphism */}
          <motion.div 
            className="relative"
            variants={childVariants}
          >
            <motion.div 
              className="w-40 h-40 mx-auto rounded-full flex items-center justify-center glass-effect shadow-2xl"
              style={{ 
                background: `linear-gradient(135deg, var(--template-primary), var(--template-accent))`,
                boxShadow: `0 20px 60px var(--template-primary)30`
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              animate={{
                boxShadow: [
                  `0 20px 60px var(--template-primary)30`,
                  `0 25px 80px var(--template-primary)40`
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <Heart className="w-20 h-20 text-white drop-shadow-lg" />
            </motion.div>
            
            {/* Floating accent elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-12 h-12 glass-effect rounded-full flex items-center justify-center"
              animate={{ 
                scale: [1, 1.3],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: 'easeInOut'
              }}
            >
              <motion.div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: 'var(--template-accent)' }}
                animate={{ 
                  opacity: [0.7, 1],
                  scale: [0.8, 1.2]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: 'easeInOut'
                }}
              />
            </motion.div>
            
            {/* Pulsing rings */}
            <motion.div 
              className="absolute inset-0 w-40 h-40 mx-auto rounded-full border-4 opacity-30"
              style={{ borderColor: 'var(--template-primary)' }}
              animate={{ 
                scale: [1, 1.5],
                opacity: [0.3, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: 'easeInOut'
              }}
            />
          </motion.div>
          
          {/* Enhanced Title */}
          <motion.div variants={childVariants}>
            <motion.h2 
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 typography-luxury"
              style={{ 
                color: 'var(--template-text)',
                textShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
              variants={childVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              Join Us!
            </motion.h2>
            <motion.div 
              className="w-40 h-2 mx-auto rounded-full shadow-lg" 
              style={{ backgroundColor: 'var(--template-accent)' }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 160, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>
          
          {/* Enhanced Description */}
          <motion.div
            className="premium-card p-8 max-w-3xl mx-auto"
            variants={childVariants}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <motion.p 
              className="text-xl md:text-2xl leading-relaxed typography-modern"
              style={{ color: 'var(--template-text-secondary)' }}
              variants={childVariants}
            >
              We can&apos;t wait to celebrate with you. Please let us know if you&apos;ll be joining us for this special moment.
            </motion.p>
          </motion.div>
          
          {/* Enhanced CTA Button */}
          <motion.div 
            className="pt-8"
            variants={childVariants}
          >
            <InteractiveButton
              onClick={onRSVPClick}
              variant="liquid"
              size="xl"
              hapticFeedback="medium"
              soundEffect="success"
              rippleEffect={true}
              className="px-16 py-8 text-2xl font-bold shadow-2xl rounded-3xl premium-card typography-modern morph-hover"
              style={{
                background: `linear-gradient(135deg, var(--template-primary), var(--template-accent))`,
                color: 'white',
                border: 'none'
              }}
            >
              <motion.span
                animate={{ 
                  textShadow: [
                    '0 0 0 rgba(255,255,255,0)',
                    '0 0 20px rgba(255,255,255,0.5)',
                    '0 0 0 rgba(255,255,255,0)'
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                RSVP Now
              </motion.span>
              <motion.div
                animate={{ x: [0, 8] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                    ease: 'easeInOut'
                  }}
                >
                  <Heart className="w-8 h-8 ml-4 drop-shadow-lg" />
                </motion.div>
            </InteractiveButton>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Enhanced Background Effects */}
      <motion.div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 10% 20%, var(--template-primary)25, transparent 60%),
                       radial-gradient(circle at 90% 80%, var(--template-accent)20, transparent 50%),
                       radial-gradient(circle at 50% 50%, var(--template-primary)10, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.2],
          opacity: [0.15, 0.25],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

function GalleryFrame({ 
  invitation, 
  template: _template,
  childVariants: _childVariants,
  className 
}: { 
  invitation: Invitation; 
  template: TemplateConfig;
  childVariants: Variants;
  className?: string;
}) {
  const defaultBackground = getDefaultBackground();

  return (
    <div 
      className={cn('gallery-frame min-h-screen w-full flex items-center justify-center relative', className)}
      style={{ background: invitation.image_url ? 'black' : defaultBackground }}
    >
      
      {/* Content */}
      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          {invitation.image_url ? (
            <motion.div
              key="with-image"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Main Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.img 
                  src={invitation.image_url} 
                  alt={invitation.title}
                  className="max-w-full max-h-full object-contain"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
                
                {/* Image Overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              
              {/* Title Overlay */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    Gallery
                  </h2>
                  <motion.div 
                    className="w-24 h-1 mx-auto rounded-full" 
                    style={{ backgroundColor: 'var(--template-accent)' }}
                    initial={{ width: 0 }}
                    animate={{ width: 96 }}
                    transition={{ duration: 0.8, delay: 1 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="no-image"
              className="w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="text-center">
                <motion.div 
                  className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8"
                  style={{ backgroundColor: 'var(--template-primary)20' }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <Users className="w-16 h-16" style={{ color: 'var(--template-primary)' }} />
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--template-primary)' }}>
                  Gallery
                </h2>
                <p className="text-xl" style={{ color: 'var(--template-text-secondary)' }}>
                  Memories to be made...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Animated decorative corner elements */}
      <motion.div 
        className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-white/30 rounded-tl-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      />
      <motion.div 
        className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-white/30 rounded-tr-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      />
      <motion.div 
        className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-white/30 rounded-bl-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      />
      <motion.div 
        className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-white/30 rounded-br-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      />
    </div>
  );
}

// Helper function to get default frames for template categories
export function getDefaultFrames(category: string): FrameConfig[] {
  switch (category) {
    case 'wedding':
      return [
        { id: 'hero', type: 'hero', title: 'Welcome', showInNavigation: true },
        { id: 'details', type: 'details', title: 'Details', showInNavigation: true },
        { id: 'rsvp', type: 'rsvp', title: 'RSVP', showInNavigation: true },
      ];
    case 'birthday':
      return [
        { id: 'hero', type: 'hero', title: 'Celebration', showInNavigation: true },
        { id: 'gallery', type: 'gallery', title: 'Gallery', showInNavigation: true },
        { id: 'rsvp', type: 'rsvp', title: 'RSVP', showInNavigation: true },
      ];
    case 'corporate':
      return [
        { id: 'hero', type: 'hero', title: 'Event', showInNavigation: true },
        { id: 'details', type: 'details', title: 'Details', showInNavigation: true },
      ];
    case 'anniversary':
      return [
        { id: 'hero', type: 'hero', title: 'Anniversary', showInNavigation: true },
        { id: 'details', type: 'details', title: 'Details', showInNavigation: true },
        { id: 'rsvp', type: 'rsvp', title: 'RSVP', showInNavigation: true },
      ];
    default:
      return [
        { id: 'hero', type: 'hero', title: 'Welcome', showInNavigation: true },
        { id: 'details', type: 'details', title: 'Details', showInNavigation: true },
        { id: 'rsvp', type: 'rsvp', title: 'RSVP', showInNavigation: true },
      ];
  }
}