'use client';

import { useRouter } from 'next/navigation';
import { InvitationList } from '@kit/invitations/invitation-list';
import { useInvitations } from '@kit/invitations/hooks/use-invitation-data';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { InvitationWithStats } from '@kit/invitations/schema/invitation.schema';

export default function HomePage() {
  const router = useRouter();
  const { data: invitations } = useInvitations({ limit: 10 });

  const handleCreateNew = () => {
    router.push('/create');
  };

  const handleClick = (invitation: InvitationWithStats) => {
    router.push(`/home/invitations/${invitation.id}`);
  };

  const handleEdit = (invitation: InvitationWithStats) => {
    router.push(`/home/invitations/${invitation.id}`);
  };

  const handleViewGuests = (invitation: InvitationWithStats) => {
    router.push(`/home/invitations/${invitation.id}/guests`);
  };

  const handleShare = (invitation: InvitationWithStats) => {
    // For now, just navigate to the invitation details
    router.push(`/home/invitations/${invitation.id}`);
  };

  // Calculate stats from real data
  const totalInvitations = invitations?.length || 0;
  const pendingRSVPs = invitations?.reduce((sum, inv) => sum + (inv.guest_count - inv.rsvp_count), 0) || 0;
  const confirmedGuests = invitations?.reduce((sum, inv) => sum + inv.attending_count, 0) || 0;

  return (
    <PageBody>
      <PageHeader
        title="Your Invitations"
        description="Manage your events and track RSVPs"
      >
        <Button asChild size="lg">
          <Link href="/create">
            <Plus className="h-5 w-5 mr-2" />
            Create Invitation
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-6 px-4">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvitations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending RSVPs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRSVPs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Confirmed Guests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedGuests}</div>
            </CardContent>
          </Card>
        </div>

        {/* Invitation List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <InvitationList 
              onCreateNew={handleCreateNew}
              onClick={handleClick}
              onEdit={handleEdit}
              onViewGuests={handleViewGuests}
              onShare={handleShare}
            />
          </CardContent>
        </Card>
      </div>
    </PageBody>
  );
}
