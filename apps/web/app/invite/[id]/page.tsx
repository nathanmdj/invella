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

interface InvitationPageProps {
  params: {
    id: string;
  };
}

export default function InvitationPage({ params }: InvitationPageProps) {
  const invitationId = params.id;
  const { data: invitation, isLoading, error } = usePublicInvitation(invitationId);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Invitation Card */}
        <div className="mb-8">
          <InvitationCard invitation={invitation} />
        </div>

        {/* Event Details */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {invitation.event_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(invitation.event_date), 'PPP')} at {format(new Date(invitation.event_date), 'p')}
                    </p>
                  </div>
                </div>
              )}
              
              {invitation.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {invitation.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* RSVP Button */}
        <div className="flex flex-col gap-4 mb-8">
          <Button asChild size="lg" className="w-full">
            <Link href={`/invite/${invitationId}/rsvp`}>
              RSVP Now
            </Link>
          </Button>
          
          {invitation.rsvp_deadline && (
            <p className="text-sm text-center text-muted-foreground">
              Please respond by {format(new Date(invitation.rsvp_deadline), 'PPP')}
            </p>
          )}
        </div>

        {/* Share Invitation */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Share This Invitation</h3>
            <ShareInvitation 
              invitationId={invitationId} 
              invitationTitle={invitation.title}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}