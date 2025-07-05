'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView, Variants } from 'framer-motion';
import { cn } from '../lib/utils';
import { Button } from '../shadcn/button';
import { Badge } from '../shadcn/badge';
import { Calendar, MapPin, Users, Heart } from 'lucide-react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Framer Motion scroll tracking
  const { scrollY } = useScroll({ container: containerRef });
  useSpring(scrollY, { stiffness: 100, damping: 30 });

  // Smooth scroll to frame with Framer Motion
  const scrollToFrame = useCallback((index: number) => {
    if (containerRef.current) {
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
  }, []);

  // Update current frame based on scroll position
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const frameHeight = window.innerHeight;
      const newCurrentFrame = Math.round(scrollTop / frameHeight);
      
      if (newCurrentFrame !== currentFrame && newCurrentFrame >= 0 && newCurrentFrame < frames.length) {
        setCurrentFrame(newCurrentFrame);
      }
    }
  }, [currentFrame, frames.length]);

  return (
    <motion.div 
      ref={containerRef}
      className={cn('invitation-frames fixed inset-0 w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide', className)}
      style={{ 
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth'
      }}
      onScroll={handleScroll}
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
        {frames.length > 1 && (
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
  const isInView = useInView(ref, { amount: 0.3 });

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
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
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
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
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
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
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
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
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
      className={cn('hero-frame min-h-screen w-full flex items-center justify-center relative', className)}
      style={{ background: defaultBackground }}
    >
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full">
        <motion.div className="space-y-8" variants={childVariants}>
          <motion.div variants={childVariants}>
            <Badge 
              variant="outline" 
              className={cn(
                "text-sm px-6 py-2 border-0 shadow-lg backdrop-blur-sm",
                invitation.image_url ? "bg-white/80" : ""
              )}
              style={{ 
                color: 'var(--template-primary)',
                backgroundColor: invitation.image_url ? 'rgba(255, 255, 255, 0.8)' : 'var(--template-surface)'
              }}
            >
              {template.category.charAt(0).toUpperCase() + template.category.slice(1).replace('_', ' ')}
            </Badge>
          </motion.div>
          
          <motion.h1 
            className={cn(
              "text-5xl md:text-7xl lg:text-8xl font-bold leading-tight break-words",
              invitation.image_url ? "text-white drop-shadow-2xl" : ""
            )}
            style={{ 
              color: invitation.image_url ? 'white' : 'var(--template-text)'
            }}
            variants={childVariants}
          >
            {invitation.title}
          </motion.h1>
          
          <AnimatePresence>
            {invitation.description && (
              <motion.p 
                className={cn(
                  "text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed",
                  invitation.image_url ? "text-white/90 drop-shadow-lg" : ""
                )}
                style={{ 
                  color: invitation.image_url ? 'rgba(255, 255, 255, 0.9)' : 'var(--template-text-secondary)'
                }}
                variants={childVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {invitation.description}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Floating Decorative Elements */}
      <motion.div 
        className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
        animate={{ 
          y: [0, -20, 0],
          x: [0, 10, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <motion.div 
        className="absolute bottom-20 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"
        animate={{ 
          y: [0, 15, 0],
          x: [0, -8, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
      />
    </div>
  );
}

function DetailsFrame({ 
  invitation, 
  template: _template,
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
      className={cn('details-frame min-h-screen w-full flex items-center justify-center relative', className)}
      style={{ background: defaultBackground }}
    >
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
        <motion.div className="text-center mb-16" variants={childVariants}>
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-6" 
            style={{ color: 'var(--template-primary)' }}
            variants={childVariants}
          >
            Event Details
          </motion.h2>
          <motion.div 
            className="w-24 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: 'var(--template-accent)' }}
            variants={childVariants}
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </motion.div>
        
        <motion.div className="grid gap-8 md:gap-12" variants={childVariants}>
          <AnimatePresence>
            {invitation.event_date && (
              <motion.div 
                className="backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl"
                style={{
                  backgroundColor: 'var(--template-surface)',
                  borderColor: 'var(--template-border)',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
                variants={childVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="flex items-start space-x-6">
                  <motion.div 
                    className="p-4 rounded-2xl"
                    style={{ backgroundColor: 'var(--template-primary)15' }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Calendar className="w-8 h-8" style={{ color: 'var(--template-primary)' }} />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--template-text)' }}>Date & Time</h3>
                    <p className="text-xl leading-relaxed" style={{ color: 'var(--template-text-secondary)' }}>
                      {new Date(invitation.event_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {invitation.location && (
              <motion.div 
                className="backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl"
                style={{
                  backgroundColor: 'var(--template-surface)',
                  borderColor: 'var(--template-border)',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
                variants={childVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="flex items-start space-x-6">
                  <motion.div 
                    className="p-4 rounded-2xl"
                    style={{ backgroundColor: 'var(--template-accent)15' }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <MapPin className="w-8 h-8" style={{ color: 'var(--template-accent)' }} />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--template-text)' }}>Location</h3>
                    <p className="text-xl leading-relaxed" style={{ color: 'var(--template-text-secondary)' }}>{invitation.location}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Floating Background Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-2xl"
        animate={{ 
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-2xl"
        animate={{ 
          y: [0, 25, 0],
          x: [0, -15, 0],
          rotate: [0, -180, -360]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
      />
    </div>
  );
}

function RSVPFrame({ 
  invitation: _invitation,
  template: _template,
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
      className={cn('rsvp-frame min-h-screen w-full flex items-center justify-center relative', className)}
      style={{ background: defaultBackground }}
    >
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full">
        <motion.div className="space-y-12" variants={childVariants}>
          {/* Icon */}
          <motion.div 
            className="relative"
            variants={childVariants}
          >
            <motion.div 
              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--template-primary)' }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Heart className="w-16 h-16 text-white" />
            </motion.div>
            <motion.div 
              className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <motion.div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: 'var(--template-accent)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>
          </motion.div>
          
          {/* Title */}
          <motion.div variants={childVariants}>
            <motion.h2 
              className="text-5xl md:text-7xl font-bold mb-6"
              style={{ color: 'var(--template-text)' }}
              variants={childVariants}
            >
              Join Us!
            </motion.h2>
            <motion.div 
              className="w-32 h-1 mx-auto rounded-full" 
              style={{ backgroundColor: 'var(--template-accent)' }}
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.div>
          
          {/* Description */}
          <motion.p 
            className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--template-text-secondary)' }}
            variants={childVariants}
          >
            We can&apos;t wait to celebrate with you. Please let us know if you&apos;ll be joining us.
          </motion.p>
          
          {/* CTA Button */}
          <motion.div 
            className="pt-8"
            variants={childVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Button 
                onClick={onRSVPClick}
                size="lg"
                className="px-12 py-6 text-xl font-bold shadow-2xl rounded-2xl"
                style={{
                  backgroundColor: 'var(--template-surface)',
                  color: 'var(--template-text)',
                  borderColor: 'var(--template-border)',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                RSVP Now
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <Heart className="w-6 h-6 ml-3" style={{ color: 'var(--template-primary)' }} />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
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