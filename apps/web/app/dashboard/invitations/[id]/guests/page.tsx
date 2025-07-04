'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { GuestList } from '@kit/invitations/components/guest-list';
import { GuestForm } from '@kit/invitations/components/guest-form';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
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
  Filter,
  Search 
} from 'lucide-react';
import Link from 'next/link';

export default function GuestManagementPage() {
  const params = useParams();
  const invitationId = params.id as string;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddGuest, setShowAddGuest] = useState(false);

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
                onSuccess={() => setShowAddGuest(false)}
                onCancel={() => setShowAddGuest(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guests by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'attending' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('attending')}
                  size="sm"
                >
                  Attending
                </Button>
                <Button
                  variant={filterStatus === 'not_attending' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('not_attending')}
                  size="sm"
                >
                  Not Attending
                </Button>
                <Button
                  variant={filterStatus === 'pending' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('pending')}
                  size="sm"
                >
                  Pending
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest List */}
        <Card>
          <CardHeader>
            <CardTitle>Guest List</CardTitle>
          </CardHeader>
          <CardContent>
            <GuestList 
              invitationId={invitationId}
              searchTerm={searchTerm}
              filterStatus={filterStatus}
              showActions={true}
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