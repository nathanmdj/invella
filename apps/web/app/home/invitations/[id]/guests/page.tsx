'use client';

import { useParams } from 'next/navigation';
import { GuestList } from '@kit/invitations/guest-list';
import { GuestForm } from '@kit/invitations/guest-form';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { PageBody, PageHeader } from '@kit/ui/page';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function InvitationGuestsPage() {
  const params = useParams();
  const invitationId = params.id as string;

  return (
    <PageBody>
      <PageHeader
        title="Manage Guests"
        description="Add, edit, and manage your guest list"
      >
        <Button variant="outline" size="sm" asChild>
          <Link href={`/home/invitations/${invitationId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invitation
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-3 px-4">
        {/* Left Column - Guest List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Guest List</CardTitle>
            </CardHeader>
            <CardContent>
              <GuestList invitationId={invitationId} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Add Guest Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New Guest
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GuestForm invitationId={invitationId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageBody>
  );
}