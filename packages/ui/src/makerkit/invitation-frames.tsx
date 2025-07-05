'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../lib/utils';
import { Button } from '../shadcn/button';
import { Badge } from '../shadcn/badge';
import { Card } from '../shadcn/card';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users, Heart } from 'lucide-react';
import type { Database } from '@kit/supabase/database';

type Invitation = Database['public']['Tables']['invitations']['Row'];

interface FrameConfig {
  id: string;
  type: 'hero' | 'details' | 'rsvp' | 'gallery';
  title?: string;
  showInNavigation?: boolean;
}

interface InvitationFramesProps {
  invitation: Invitation;
  template: {
    id: string;
    name: string;
    category: string;
    design_config: any;
  };
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
  const [isIntersecting, setIsIntersecting] = useState<boolean[]>(new Array(frames.length).fill(false));
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState<number[]>(new Array(frames.length).fill(0));
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll for progressive transitions
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      setScrollY(scrollTop);
      
      // Calculate progress for each frame
      const newProgress = frames.map((_, index) => {
        const frameElement = frameRefs.current[index];
        if (!frameElement) return 0;
        
        const frameTop = frameElement.offsetTop;
        const frameHeight = frameElement.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the frame is visible
        const frameBottom = frameTop + frameHeight;
        const viewportBottom = scrollTop + viewportHeight;
        
        if (scrollTop >= frameBottom) {
          // Frame is completely above viewport
          return 0;
        } else if (viewportBottom <= frameTop) {
          // Frame is completely below viewport
          return 0;
        } else {
          // Frame is partially or fully visible
          const visibleTop = Math.max(scrollTop, frameTop);
          const visibleBottom = Math.min(viewportBottom, frameBottom);
          const visibleHeight = visibleBottom - visibleTop;
          const progress = Math.min(visibleHeight / viewportHeight, 1);
          return Math.max(0, progress);
        }
      });
      
      setScrollProgress(newProgress);
      
      // Update current frame based on which has highest progress
      const maxProgressIndex = newProgress.indexOf(Math.max(...newProgress));
      if (maxProgressIndex !== -1 && newProgress[maxProgressIndex] > 0.3) {
        setCurrentFrame(maxProgressIndex);
      }
    }
  }, [frames.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    frameRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const ratio = entry.intersectionRatio;
              
              setIsIntersecting(prev => {
                const newState = [...prev];
                newState[index] = ratio > 0.1;
                return newState;
              });
            });
          },
          { 
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            rootMargin: '0px 0px 0px 0px'
          }
        );
        
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [frames.length]);

  const scrollToFrame = (index: number) => {
    if (frameRefs.current[index]) {
      const targetElement = frameRefs.current[index];
      if (targetElement) {
        const container = targetElement.closest('.invitation-frames');
        if (container) {
          const targetTop = targetElement.offsetTop;
          
          // Enhanced smooth scrolling with custom easing
          const startTime = performance.now();
          const startScrollTop = container.scrollTop;
          const distance = targetTop - startScrollTop;
          const duration = 4000; // Ultra-long duration for very slow, smooth snapping
          
          const easeInOutQuint = (t: number): number => {
            return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
          };
          
          const animateScroll = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutQuint(progress);
            
            container.scrollTo({
              top: startScrollTop + distance * easedProgress,
              behavior: 'auto' // Use auto to avoid conflicts with CSS smooth scroll
            });
            
            if (progress < 1) {
              requestAnimationFrame(animateScroll);
            }
          };
          
          requestAnimationFrame(animateScroll);
        } else {
          // Fallback to standard scrollIntoView
          targetElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn('invitation-frames relative w-full h-screen overflow-y-auto scroll-smooth-enhanced', className)} 
      style={{ 
        scrollBehavior: 'smooth',
        height: '100vh',
        maxHeight: '100vh',
        scrollSnapType: 'y mandatory'
      }}
    >
      {/* Full-Screen Frame Container */}
      <div className="w-full">
        {frames.map((frame, index) => (
          <div 
            key={frame.id}
            ref={(el) => { frameRefs.current[index] = el; }}
            className="min-h-screen w-full relative isolate"
            style={{ 
              zIndex: frames.length - index, // Higher z-index for frames that come first
              height: '100vh', // Ensure exact viewport height
              minHeight: '100vh',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always'
            }}
          >
            <InvitationFrame 
              frame={frame}
              invitation={invitation}
              template={template}
              isActive={isIntersecting[index] || false}
              scrollProgress={scrollProgress[index] || 0}
              onRSVPClick={onRSVPClick}
            />
          </div>
        ))}
      </div>

      {/* Navigation Dots - Fixed Position */}
      {frames.length > 1 && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col space-y-4 z-10">
          {frames.map((frame, index) => (
            <button
              key={frame.id}
              onClick={() => scrollToFrame(index)}
              className={cn(
                'relative w-4 h-4 rounded-full transition-all duration-1000 ease-out group',
                'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50',
                index === currentFrame 
                  ? 'bg-[var(--template-primary)] scale-125 shadow-lg shadow-[var(--template-primary)]/30' 
                  : 'bg-white/50 hover:bg-white/70 backdrop-blur-sm'
              )}
              aria-label={`Go to frame ${index + 1}: ${frame.title}`}
            >
              {/* Active indicator ring */}
              {index === currentFrame && (
                <div 
                  className="absolute inset-0 rounded-full border-2 border-white/70 scale-150 animate-pulse"
                  style={{ borderColor: 'var(--template-primary)' }}
                />
              )}
              
              {/* Tooltip */}
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                {frame.title || `Frame ${index + 1}`}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Scroll Indicator - Simple Down Arrow */}
      {frames.length > 1 && currentFrame < frames.length - 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white/90 transition-colors duration-200">
              <ChevronRight className="w-5 h-5 text-gray-600 rotate-90" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface InvitationFrameProps {
  frame: FrameConfig;
  invitation: Invitation;
  template: {
    id: string;
    name: string;
    category: string;
    design_config: any;
  };
  isActive: boolean;
  scrollProgress: number;
  onRSVPClick?: () => void;
}

function InvitationFrame({ 
  frame, 
  invitation, 
  template, 
  isActive,
  scrollProgress,
  onRSVPClick 
}: InvitationFrameProps) {
  // Calculate smooth opacity and transform based on scroll progress
  const opacity = Math.min(scrollProgress * 1.2, 1); // Slightly faster opacity change
  const translateY = (1 - scrollProgress) * 20; // Gentler slide up
  const scale = 0.98 + (scrollProgress * 0.02); // Subtler scale transition
  
  const frameStyle = {
    opacity,
    transform: `translateY(${translateY}px) scale(${scale})`,
    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)' // Slower, smoother transitions
  };
  
  const animationClasses = cn(
    'relative isolate w-full h-full min-h-screen'
  );

  switch (frame.type) {
    case 'hero':
      return (
        <div style={frameStyle} className={animationClasses}>
          <HeroFrame 
            invitation={invitation}
            template={template}
            className="w-full h-full"
          />
        </div>
      );
    case 'details':
      return (
        <div style={frameStyle} className={animationClasses}>
          <DetailsFrame 
            invitation={invitation}
            template={template}
            className="w-full h-full"
          />
        </div>
      );
    case 'rsvp':
      return (
        <div style={frameStyle} className={animationClasses}>
          <RSVPFrame 
            invitation={invitation}
            template={template}
            onRSVPClick={onRSVPClick}
            className="w-full h-full"
          />
        </div>
      );
    case 'gallery':
      return (
        <div style={frameStyle} className={animationClasses}>
          <GalleryFrame 
            invitation={invitation}
            template={template}
            className="w-full h-full"
          />
        </div>
      );
    default:
      return null;
  }
}

// Helper function to get default background based on template category
function getDefaultBackground(category: string, primaryColor: string, accentColor: string) {
  const backgrounds = {
    wedding: `linear-gradient(135deg, ${primaryColor}10, ${accentColor}10, #fdf2f8 30%, #f8fafc 70%)`,
    birthday: `linear-gradient(135deg, ${primaryColor}15, ${accentColor}15, #fef3c7 30%, #dbeafe 70%)`,
    corporate: `linear-gradient(135deg, ${primaryColor}12, ${accentColor}12, #f1f5f9 30%, #f8fafc 70%)`,
    anniversary: `linear-gradient(135deg, ${primaryColor}12, ${accentColor}12, #fdf2f8 30%, #fffbeb 70%)`,
    graduation: `linear-gradient(135deg, ${primaryColor}15, ${accentColor}15, #dbeafe 30%, #f0f9ff 70%)`,
    baby_shower: `linear-gradient(135deg, ${primaryColor}10, ${accentColor}10, #fef3c7 30%, #ecfdf5 70%)`,
    holiday: `linear-gradient(135deg, ${primaryColor}15, ${accentColor}15, #fef2f2 30%, #f0fdf4 70%)`,
    other: `linear-gradient(135deg, ${primaryColor}12, ${accentColor}12, #f8fafc 30%, #f1f5f9 70%)`
  };
  return backgrounds[category as keyof typeof backgrounds] || backgrounds.other;
}

// Individual Frame Components
function HeroFrame({ invitation, template, className }: { 
  invitation: Invitation; 
  template: any; 
  className?: string;
}) {
  const defaultBackground = getDefaultBackground(
    template.category,
    template.design_config?.primaryColor || '#3b82f6',
    template.design_config?.accentColor || '#f59e0b'
  );

  return (
    <div className={cn('hero-frame min-h-screen w-full flex items-center justify-center relative overflow-hidden isolate bg-white', className)}>
      {/* Default Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: defaultBackground
        }}
      />
      
      {/* Background Image if available */}
      {invitation.image_url && (
        <div className="absolute inset-0">
          <img 
            src={invitation.image_url} 
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
        </div>
      )}
      
      {/* Enhanced text visibility overlay when no image */}
      {!invitation.image_url && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10" />
      )}
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="space-y-8">
          <Badge 
            variant="outline" 
            className={cn(
              "text-sm px-6 py-2 border-0 shadow-lg",
              invitation.image_url ? "bg-white/80 backdrop-blur-sm" : "bg-white/90"
            )}
            style={{ color: 'var(--template-primary)' }}
          >
            {template.category.charAt(0).toUpperCase() + template.category.slice(1).replace('_', ' ')}
          </Badge>
          
          <h1 
            className={cn(
              "text-5xl md:text-7xl lg:text-8xl font-bold leading-tight drop-shadow-2xl",
              invitation.image_url ? "text-white" : "text-gray-900"
            )}
          >
            {invitation.title}
          </h1>
          
          {invitation.description && (
            <p className={cn(
              "text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed drop-shadow-lg",
              invitation.image_url ? "text-white/90" : "text-gray-700"
            )}>
              {invitation.description}
            </p>
          )}
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />
    </div>
  );
}

function DetailsFrame({ invitation, template, className }: { 
  invitation: Invitation; 
  template: any; 
  className?: string;
}) {
  const defaultBackground = getDefaultBackground(
    template.category,
    template.design_config?.primaryColor || '#3b82f6',
    template.design_config?.accentColor || '#f59e0b'
  );

  return (
    <div className={cn('details-frame min-h-screen w-full flex items-center justify-center relative overflow-hidden isolate bg-white', className)}>
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: defaultBackground
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--template-primary)' }}>
            Event Details
          </h2>
          <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--template-accent)' }} />
        </div>
        
        <div className="grid gap-8 md:gap-12">
          {invitation.event_date && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-white/20">
              <div className="flex items-start space-x-6">
                <div 
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: 'var(--template-primary)15' }}
                >
                  <Calendar className="w-8 h-8" style={{ color: 'var(--template-primary)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Date & Time</h3>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    {new Date(invitation.event_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {invitation.location && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-white/20">
              <div className="flex items-start space-x-6">
                <div 
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: 'var(--template-accent)15' }}
                >
                  <MapPin className="w-8 h-8" style={{ color: 'var(--template-accent)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Location</h3>
                  <p className="text-xl text-gray-700 leading-relaxed">{invitation.location}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-2xl" />
    </div>
  );
}

function RSVPFrame({ invitation, template, onRSVPClick, className }: { 
  invitation: Invitation; 
  template: any; 
  onRSVPClick?: () => void;
  className?: string;
}) {
  const defaultBackground = getDefaultBackground(
    template.category,
    template.design_config?.primaryColor || '#3b82f6',
    template.design_config?.accentColor || '#f59e0b'
  );

  return (
    <div className={cn('rsvp-frame min-h-screen w-full flex items-center justify-center relative overflow-hidden isolate bg-white', className)}>
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: defaultBackground
        }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="space-y-12">
          {/* Icon */}
          <div className="relative">
            <div 
              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--template-primary)' }}
            >
              <Heart className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div 
                className="w-4 h-4 rounded-full animate-ping"
                style={{ backgroundColor: 'var(--template-accent)' }}
              />
            </div>
          </div>
          
          {/* Title */}
          <div>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 drop-shadow-xl">
              Join Us!
            </h2>
            <div className="w-32 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--template-accent)' }} />
          </div>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            We can't wait to celebrate with you. Please let us know if you'll be joining us.
          </p>
          
          {/* CTA Button */}
          <div className="pt-8">
            <Button 
              onClick={onRSVPClick}
              size="lg"
              className="px-12 py-6 text-xl font-bold bg-white text-gray-900 hover:bg-gray-50 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-2xl"
            >
              RSVP Now
              <Heart className="w-6 h-6 ml-3" style={{ color: 'var(--template-primary)' }} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryFrame({ invitation, template, className }: { 
  invitation: Invitation; 
  template: any; 
  className?: string;
}) {
  const defaultBackground = getDefaultBackground(
    template.category,
    template.design_config?.primaryColor || '#3b82f6',
    template.design_config?.accentColor || '#f59e0b'
  );

  return (
    <div className={cn('gallery-frame min-h-screen w-full flex items-center justify-center relative overflow-hidden isolate bg-white', className)}>
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: invitation.image_url ? 'black' : defaultBackground
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {invitation.image_url ? (
          <>
            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={invitation.image_url} 
                alt={invitation.title}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
            </div>
            
            {/* Title Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8">
                <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl mb-4">
                  Gallery
                </h2>
                <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--template-accent)' }} />
              </div>
            </div>
          </>
        ) : (
          // No Image Placeholder
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div 
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8"
                style={{ backgroundColor: 'var(--template-primary)20' }}
              >
                <Users className="w-16 h-16" style={{ color: 'var(--template-primary)' }} />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--template-primary)' }}>
                Gallery
              </h2>
              <p className="text-xl text-gray-600">
                Memories to be made...
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-white/30 rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-white/30 rounded-tr-lg" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-white/30 rounded-bl-lg" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-white/30 rounded-br-lg" />
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