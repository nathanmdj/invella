import { InvitationCard } from '@kit/invitations/components/invitation-card';
import { ShareInvitation } from '@kit/invitations/components/share-invitation';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';

interface InvitationPageProps {
  params: {
    id: string;
  };
}

export default function InvitationPage({ params }: InvitationPageProps) {
  const invitationId = params.id;

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
  };

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
          
          <p className="text-sm text-center text-muted-foreground">
            Please respond by August 1, 2024
          </p>
        </div>

        {/* Share Invitation */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Share This Invitation</h3>
            <ShareInvitation 
              invitationId={invitationId} 
              title={invitation.title}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}