'use client';

import { useState, useEffect, useRef } from 'react';
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
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    frameRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setIsIntersecting(prev => {
                  const newState = [...prev];
                  newState[index] = true;
                  return newState;
                });
                setCurrentFrame(index);
              }
            });
          },
          { threshold: 0.5 } // Trigger when 50% of frame is visible
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
      frameRefs.current[index]?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className={cn('invitation-frames relative w-full h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth', className)}>
      {/* Full-Screen Frame Container */}
      <div className="w-full">
        {frames.map((frame, index) => (
          <div 
            key={frame.id}
            ref={(el) => { frameRefs.current[index] = el; }}
            className="min-h-screen w-full snap-start snap-always"
          >
            <InvitationFrame 
              frame={frame}
              invitation={invitation}
              template={template}
              isActive={isIntersecting[index] || false}
              onRSVPClick={onRSVPClick}
            />
          </div>
        ))}
      </div>

      {/* Navigation Dots - Fixed Position */}
      {frames.length > 1 && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col space-y-3 z-10">
          {frames.map((frame, index) => (
            <button
              key={frame.id}
              onClick={() => scrollToFrame(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-300',
                index === currentFrame 
                  ? 'bg-[var(--template-primary)] scale-125 shadow-lg' 
                  : 'bg-white/60 hover:bg-white/80 backdrop-blur-sm'
              )}
              aria-label={`Go to frame ${index + 1}: ${frame.title}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      {frames.length > 1 && currentFrame < frames.length - 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <ChevronRight className="w-5 h-5 text-gray-600 rotate-90" />
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
  onRSVPClick?: () => void;
}

function InvitationFrame({ 
  frame, 
  invitation, 
  template, 
  isActive,
  onRSVPClick 
}: InvitationFrameProps) {
  const animationClasses = cn(
    'transition-all duration-1000 ease-out',
    isActive 
      ? 'animate-in fade-in slide-in-from-bottom-8 duration-1000' 
      : 'opacity-50 translate-y-8'
  );

  switch (frame.type) {
    case 'hero':
      return (
        <HeroFrame 
          invitation={invitation}
          template={template}
          className={animationClasses}
        />
      );
    case 'details':
      return (
        <DetailsFrame 
          invitation={invitation}
          template={template}
          className={animationClasses}
        />
      );
    case 'rsvp':
      return (
        <RSVPFrame 
          invitation={invitation}
          template={template}
          onRSVPClick={onRSVPClick}
          className={animationClasses}
        />
      );
    case 'gallery':
      return (
        <GalleryFrame 
          invitation={invitation}
          template={template}
          className={animationClasses}
        />
      );
    default:
      return null;
  }
}

// Individual Frame Components
function HeroFrame({ invitation, template, className }: { 
  invitation: Invitation; 
  template: any; 
  className?: string;
}) {
  return (
    <div className={cn('hero-frame min-h-screen w-full flex items-center justify-center relative overflow-hidden', className)}>
      {/* Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50"
        style={{
          background: `linear-gradient(135deg, var(--template-primary)15, var(--template-accent)15)`
        }}
      />
      
      {/* Background Image if available */}
      {invitation.image_url && (
        <div className="absolute inset-0 opacity-20">
          <img 
            src={invitation.image_url} 
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="space-y-8">
          <Badge 
            variant="outline" 
            className="text-sm px-6 py-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
            style={{ color: 'var(--template-primary)' }}
          >
            {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
          </Badge>
          
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-white drop-shadow-2xl"
          >
            {invitation.title}
          </h1>
          
          {invitation.description && (
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
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
  return (
    <div className={cn('details-frame min-h-screen w-full flex items-center justify-center relative', className)}>
      {/* Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100"
        style={{
          background: `linear-gradient(135deg, var(--template-primary)05, var(--template-accent)05)`
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
  return (
    <div className={cn('rsvp-frame min-h-screen w-full flex items-center justify-center relative overflow-hidden', className)}>
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, var(--template-primary)20, var(--template-accent)20)`
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
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl">
              Join Us!
            </h2>
            <div className="w-32 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--template-accent)' }} />
          </div>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
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
  return (
    <div className={cn('gallery-frame min-h-screen w-full flex items-center justify-center relative', className)}>
      {/* Background */}
      <div 
        className="absolute inset-0 bg-black"
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
              <p className="text-xl text-gray-400">
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