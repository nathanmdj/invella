'use client';

import { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Check, 
  X, 
  Clock,
  MoreHorizontal,
  Trash2,
  Edit
} from 'lucide-react';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { Input } from '@kit/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Skeleton } from '@kit/ui/skeleton';
import { EmptyState, EmptyStateHeading, EmptyStateText, EmptyStateButton } from '@kit/ui/empty-state';

import { useGuests } from '../hooks/use-guest-data';
import type { GuestWithRSVP } from '../schema/guest.schema';

interface GuestListProps {
  invitationId: string;
  onAddGuest?: () => void;
  onEditGuest?: (guest: GuestWithRSVP) => void;
  onDeleteGuest?: (guest: GuestWithRSVP) => void;
}

export function GuestList({
  invitationId,
  onAddGuest,
  onEditGuest,
  onDeleteGuest,
}: GuestListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: guests, isLoading, error } = useGuests(invitationId);

  const filteredGuests = guests?.filter(guest =>
    guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = guests ? {
    total: guests.length,
    attending: guests.filter(g => g.rsvp_response?.status === 'attending').length,
    notAttending: guests.filter(g => g.rsvp_response?.status === 'not_attending').length,
    pending: guests.filter(g => !g.rsvp_response || g.rsvp_response.status === 'pending').length,
  } : null;

  const getStatusBadge = (guest: GuestWithRSVP) => {
    const status = guest.rsvp_response?.status || 'pending';
    
    switch (status) {
      case 'attending':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <Check className="mr-1 h-3 w-3" />
            Attending
          </Badge>
        );
      case 'not_attending':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <X className="mr-1 h-3 w-3" />
            Not Attending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load guests</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Guests</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Attending</p>
                  <p className="text-2xl font-bold text-green-600">{stats.attending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <X className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium">Not Attending</p>
                  <p className="text-2xl font-bold text-red-600">{stats.notAttending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">Guest List</h2>
          <p className="text-sm text-muted-foreground">
            Manage your guests and track their RSVPs
          </p>
        </div>
        {onAddGuest && (
          <Button onClick={onAddGuest}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Guest
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Search guests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Guest Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !filteredGuests || filteredGuests.length === 0 ? (
        <EmptyState>
          <div className="flex justify-center mb-4">
            <Users className="h-12 w-12 text-muted-foreground" />
          </div>
          <EmptyStateHeading>
            {searchQuery ? "No guests found" : "No guests yet"}
          </EmptyStateHeading>
          <EmptyStateText>
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Add guests to start collecting RSVPs"}
          </EmptyStateText>
          {onAddGuest && !searchQuery && (
            <EmptyStateButton onClick={onAddGuest}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Your First Guest
            </EmptyStateButton>
          )}
        </EmptyState>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>RSVP Status</TableHead>
                <TableHead>Guest Code</TableHead>
                <TableHead>Plus One</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>
                    <div className="font-medium">{guest.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {guest.email && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="mr-1 h-3 w-3" />
                          {guest.email}
                        </div>
                      )}
                      {guest.phone && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="mr-1 h-3 w-3" />
                          {guest.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(guest)}
                    {guest.rsvp_response?.plus_one_count && guest.rsvp_response.plus_one_count > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        +{guest.rsvp_response.plus_one_count} guest{guest.rsvp_response.plus_one_count > 1 ? 's' : ''}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {guest.guest_code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={guest.plus_one_allowed ? "default" : "outline"}>
                      {guest.plus_one_allowed ? "Allowed" : "Not Allowed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(onEditGuest || onDeleteGuest) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onEditGuest && (
                            <DropdownMenuItem onClick={() => onEditGuest(guest)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDeleteGuest && (
                            <DropdownMenuItem 
                              onClick={() => onDeleteGuest(guest)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}