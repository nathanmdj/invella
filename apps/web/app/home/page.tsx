import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { PageBody, PageHeader } from '@kit/ui/page';
import { getUserInvitations } from '@kit/invitations/server/actions';
import { InvitationListClient } from '@kit/invitations/invitation-list-client';

export default async function HomePage() {
  const invitations = await getUserInvitations({ limit: 10 });

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
            <InvitationListClient 
              initialInvitations={invitations}
            />
          </CardContent>
        </Card>
      </div>
    </PageBody>
  );
}
