'use client';

import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { InvitationCard } from '@kit/invitations/invitation-card';
import { GuestList } from '@kit/invitations/guest-list';
import { ShareInvitation } from '@kit/invitations/share-invitation';
import { useInvitation } from '@kit/invitations/hooks/use-invitation-data';
import { useGuestData } from '@kit/invitations/hooks/use-guest-data';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Skeleton } from '@kit/ui/skeleton';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export default function InvitationDetailsPage() {
  const params = useParams();
  const invitationId = params.id as string;

  const { data: invitation, isLoading: invitationLoading, error: invitationError } = useInvitation(invitationId);
  const { rsvpStats, isLoading: guestsLoading } = useGuestData(invitationId);

  if (invitationError) {
    return (
      <PageBody>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Invitation Not Found</h2>
          <p className="text-muted-foreground mb-4">
            This invitation doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
          <Button asChild>
            <Link href="/home">Back to Dashboard</Link>
          </Button>
        </div>
      </PageBody>
    );
  }

  if (invitationLoading) {
    return (
      <PageBody>
        <PageHeader title={<Skeleton className="h-8 w-64" />} description={<Skeleton className="h-4 w-96" />}>
          <Skeleton className="h-10 w-32" />
        </PageHeader>
        <div className="grid gap-8 lg:grid-cols-3 px-4">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </PageBody>
    );
  }

  if (!invitation) {
    return (
      <PageBody>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Invitation Not Found</h2>
          <p className="text-muted-foreground mb-4">
            This invitation doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
          <Button asChild>
            <Link href="/home">Back to Dashboard</Link>
          </Button>
        </div>
      </PageBody>
    );
  }

  const eventDate = invitation.event_date ? new Date(invitation.event_date) : null;
  const rsvpDeadline = invitation.rsvp_deadline ? new Date(invitation.rsvp_deadline) : null;

  return (
    <PageBody>
      <PageHeader
        title={invitation.title}
        description="Manage your invitation and track RSVPs"
      >
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href={`/invite/${invitationId}`} target="_blank">
              Preview Invitation
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/home/invitations/${invitationId}/edit`}>
              Edit Invitation
            </Link>
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-3 px-4">
        {/* Left Column - Invitation Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* RSVP Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>RSVP Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {guestsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="h-8 w-16 mx-auto mb-2" />
                      <Skeleton className="h-4 w-20 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{rsvpStats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Invited</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{rsvpStats.attending}</div>
                    <div className="text-sm text-muted-foreground">Attending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{rsvpStats.notAttending}</div>
                    <div className="text-sm text-muted-foreground">Not Attending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{rsvpStats.pending}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {format(eventDate, 'PPP')} at {format(eventDate, 'p')}
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

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Maximum Guests</p>
                  <p className="text-sm text-muted-foreground">
                    {invitation.max_guests || 'No limit'}
                  </p>
                </div>
              </div>

              {rsvpDeadline && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">RSVP Deadline</p>
                    <p className="text-sm text-muted-foreground">
                      {format(rsvpDeadline, 'PPP')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guest List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Guest List
                <Button size="sm" asChild>
                  <Link href={`/home/invitations/${invitationId}/guests`}>
                    Manage Guests
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GuestList invitationId={invitationId} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions & Preview */}
        <div className="space-y-6">
          {/* Invitation Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Invitation Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="scale-75 origin-top">
                <InvitationCard invitation={{
                  ...invitation,
                  guest_count: rsvpStats.total,
                  rsvp_count: rsvpStats.attending + rsvpStats.notAttending,
                  attending_count: rsvpStats.attending,
                  not_attending_count: rsvpStats.notAttending,
                }} />
              </div>
            </CardContent>
          </Card>

          {/* Share Options */}
          <Card>
            <CardHeader>
              <CardTitle>Share Invitation</CardTitle>
            </CardHeader>
            <CardContent>
              <ShareInvitation 
                invitationId={invitationId} 
                invitationTitle={invitation.title}
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/home/invitations/${invitationId}/guests/add`}>
                  Add Guests
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/home/invitations/${invitationId}/reminders`}>
                  Send Reminders
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/home/invitations/${invitationId}/export`}>
                  Export Guest List
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageBody>
  );
}