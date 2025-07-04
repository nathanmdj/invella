'use client';

import { InvitationCard } from '@kit/invitations/invitation-card';
import { ShareInvitation } from '@kit/invitations/share-invitation';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { Skeleton } from '@kit/ui/skeleton';
import { format } from 'date-fns';
import Link from 'next/link';
import { usePublicInvitation } from '@kit/invitations/hooks/use-invitation-data';
import { TemplateRenderer } from '@kit/ui/template-renderer';
import { InvitationFrames, getDefaultFrames } from '@kit/ui/invitation-frames';
import { useRouter } from 'next/navigation';

interface InvitationPageProps {
  params: {
    id: string;
  };
}

export default function InvitationPage({ params }: InvitationPageProps) {
  const invitationId = params.id;
  const router = useRouter();
  const { data: invitation, isLoading, error } = usePublicInvitation(invitationId);

  // Mock template data for now - in production this would come from the database
  const mockTemplate = {
    id: 'template-1',
    name: 'Classic Wedding',
    category: invitation?.template_id ? 'wedding' : 'general',
    design_config: {
      primaryColor: '#3b82f6',
      accentColor: '#f59e0b',
      fontFamily: 'serif',
      layout: 'classic'
    }
  };

  const handleRSVPClick = () => {
    router.push(`/invite/${invitationId}/rsvp`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Invitation Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This invitation doesn&apos;t exist or is not publicly accessible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-8">
            <Skeleton className="h-96 w-full" />
          </div>
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-64" />
              </div>
            </CardContent>
          </Card>
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  // Get frames based on template category
  const frames = getDefaultFrames(mockTemplate.category);

  return (
    <div className="min-h-screen w-full">
             <TemplateRenderer 
         template={mockTemplate}
         invitation={{
           id: invitation.id,
           title: invitation.title,
           description: invitation.description || undefined,
           event_date: invitation.event_date || '',
           location: invitation.location || undefined,
           image_url: invitation.image_url || undefined,
         }}
         className="w-full h-full"
       >
        {/* Full-Screen Template Gallery Frames */}
                 <InvitationFrames
           invitation={{
             ...invitation,
             description: invitation.description || null,
             event_date: invitation.event_date || null,
             location: invitation.location || null,
             image_url: invitation.image_url || null,
             updated_by: invitation.updated_by || null,
             template_id: invitation.template_id || null,
             max_guests: invitation.max_guests || null,
             rsvp_deadline: invitation.rsvp_deadline || null,
           }}
          template={mockTemplate}
          frames={frames}
          onRSVPClick={handleRSVPClick}
          className="w-full"
        />

        {/* Share Section - Fixed at bottom of last frame */}
        <div className="fixed bottom-4 left-4 right-4 z-20">
          <Card className="max-w-sm mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <ShareInvitation 
                invitationId={invitationId} 
                invitationTitle={invitation.title}
              />
            </CardContent>
          </Card>
        </div>
      </TemplateRenderer>
    </div>
  );
}