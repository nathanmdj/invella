'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { GuestList } from '@kit/invitations/guest-list';
import { GuestForm } from '@kit/invitations/guest-form';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kit/ui/dialog';
import { 
  Plus, 
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import { useCreateGuest } from '@kit/invitations/hooks/use-guest-data';
import type { CreateGuest } from '@kit/invitations/schema/guest.schema';

export default function GuestManagementPage() {
  const params = useParams();
  const invitationId = params.id as string;
  const [showAddGuest, setShowAddGuest] = useState(false);
  
  const { mutate: createGuest, isPending: isCreating } = useCreateGuest();

  const handleCreateGuest = (data: CreateGuest) => {
    createGuest(data, {
      onSuccess: () => {
        setShowAddGuest(false);
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href={`/dashboard/invitations/${invitationId}`}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Invitation
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Guest Management</h1>
          <p className="text-muted-foreground">
            Add, edit, and manage your invitation guests
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Dialog open={showAddGuest} onOpenChange={setShowAddGuest}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Guest</DialogTitle>
              </DialogHeader>
              <GuestForm 
                invitationId={invitationId}
                onSubmit={handleCreateGuest}
                onCancel={() => setShowAddGuest(false)}
                isLoading={isCreating}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Guest List */}
        <Card>
          <CardHeader>
            <CardTitle>Guest List</CardTitle>
          </CardHeader>
          <CardContent>
            <GuestList 
              invitationId={invitationId}
            />
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Bulk Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                Send Reminders to Pending
              </Button>
              <Button variant="outline" size="sm">
                Export Selected
              </Button>
              <Button variant="outline" size="sm">
                Delete Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}