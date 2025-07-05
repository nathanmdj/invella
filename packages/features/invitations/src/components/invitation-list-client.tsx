'use client';

import { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Input } from '@kit/ui/input';
import { Button } from '@kit/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { Card, CardContent } from '@kit/ui/card';
import Link from 'next/link';

import { InvitationCard } from './invitation-card';
import type { InvitationWithStats } from '../schema/invitation.schema';

interface InvitationListClientProps {
  initialInvitations: InvitationWithStats[];
  onSearch?: (search: string) => void;
  onSort?: (sortBy: string) => void;
}

export function InvitationListClient({
  initialInvitations,
  onSearch,
  onSort,
}: InvitationListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    onSearch?.(search);
  };

  const handleSortChange = (sort_by: string) => {
    setSortBy(sort_by);
    onSort?.(sort_by);
  };

  // Filter invitations based on search term
  const filteredInvitations = initialInvitations.filter(invitation =>
    invitation.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort invitations
  const sortedInvitations = [...filteredInvitations].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'event_date':
        if (!a.event_date || !b.event_date) return 0;
        return new Date(b.event_date).getTime() - new Date(a.event_date).getTime();
      case 'created_at':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">My Invitations</h1>
          <p className="text-muted-foreground">
            Create and manage your digital invitations
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Invitation
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invitations..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Recent</SelectItem>
              <SelectItem value="event_date">Event Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      {sortedInvitations.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <svg
              className="h-8 w-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No invitations yet</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "No invitations match your search criteria"
              : "Get started by creating your first digital invitation"}
          </p>
          {!searchTerm && (
            <Button asChild>
              <Link href="/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Invitation
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedInvitations.map((invitation) => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              onClick={(inv) => window.location.href = `/home/invitations/${inv.id}`}
              onEdit={(inv) => window.location.href = `/home/invitations/${inv.id}`}
              onViewGuests={(inv) => window.location.href = `/home/invitations/${inv.id}/guests`}
              onShare={(inv) => window.location.href = `/home/invitations/${inv.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}