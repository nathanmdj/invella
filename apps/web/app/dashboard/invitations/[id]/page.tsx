'use client';

import { useParams } from 'next/navigation';
import { InvitationCard } from '@kit/invitations/invitation-card';
import { GuestList } from '@kit/invitations/guest-list';
import { ShareInvitation } from '@kit/invitations/share-invitation';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
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

  // Mock data - in real app, this would come from useInvitationData hook
  const invitation = {
    id: invitationId,
    title: "Sarah & John's Wedding",
    description: "Join us for our special day as we celebrate our love and commitment to each other.",
    event_date: "2024-08-15T16:00:00Z",
    location: "Garden Rose Venue, 123 Wedding Lane, San Francisco, CA",
    image_url: "/images/wedding-template.jpg",
    template_id: "elegant-wedding",
    rsvp_deadline: "2024-08-01T23:59:59Z",
    is_public: true,
    max_guests: 100,
  };

  // Mock RSVP stats
  const rsvpStats = {
    total: 85,
    attending: 68,
    notAttending: 12,
    pending: 5,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{invitation.title}</h1>
          <p className="text-muted-foreground">
            Manage your invitation and track RSVPs
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href={`/invite/${invitationId}`} target="_blank">
              Preview Invitation
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/invitations/${invitationId}/edit`}>
              Edit Invitation
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Invitation Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* RSVP Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>RSVP Summary</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
                    August 15, 2024 at 4:00 PM
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {invitation.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Maximum Guests</p>
                  <p className="text-sm text-muted-foreground">
                    {invitation.max_guests || 'No limit'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">RSVP Deadline</p>
                  <p className="text-sm text-muted-foreground">
                    August 1, 2024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guest List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Guest List
                <Button size="sm" asChild>
                  <Link href={`/dashboard/invitations/${invitationId}/guests`}>
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
                <InvitationCard invitation={invitation} />
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
                title={invitation.title}
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
                <Link href={`/dashboard/invitations/${invitationId}/guests/add`}>
                  Add Guests
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/dashboard/invitations/${invitationId}/reminders`}>
                  Send Reminders
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/dashboard/invitations/${invitationId}/export`}>
                  Export Guest List
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}