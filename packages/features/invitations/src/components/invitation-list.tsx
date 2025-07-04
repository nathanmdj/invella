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

import { InvitationCard } from './invitation-card';
import { useInvitations } from '../hooks/use-invitation-data';
import type { InvitationWithStats, InvitationFilters } from '../schema/invitation.schema';

interface InvitationListProps {
  onCreateNew?: () => void;
  onClick?: (invitation: InvitationWithStats) => void;
  onEdit?: (invitation: InvitationWithStats) => void;
  onDelete?: (invitation: InvitationWithStats) => void;
  onShare?: (invitation: InvitationWithStats) => void;
  onViewGuests?: (invitation: InvitationWithStats) => void;
}

export function InvitationList({
  onCreateNew,
  onClick,
  onEdit,
  onDelete,
  onShare,
  onViewGuests,
}: InvitationListProps) {
  const [filters, setFilters] = useState<InvitationFilters>({
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    limit: 20,
    offset: 0,
  });

  const { data: invitations, isLoading, error } = useInvitations(filters);

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search, offset: 0 }));
  };

  const handleSortChange = (sort_by: string) => {
    setFilters(prev => ({ 
      ...prev, 
      sort_by: sort_by as 'created_at' | 'event_date' | 'title',
      offset: 0 
    }));
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load invitations</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

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
        {onCreateNew && (
          <Button onClick={onCreateNew} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Create Invitation
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invitations..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filters.sort_by} onValueChange={handleSortChange}>
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
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-48 w-full bg-muted rounded-lg animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !invitations || invitations.length === 0 ? (
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
            {filters.search
              ? "No invitations match your search criteria"
              : "Get started by creating your first digital invitation"}
          </p>
          {onCreateNew && !filters.search && (
            <Button onClick={onCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Invitation
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((invitation) => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              onClick={onClick}
              onEdit={onEdit}
              onDelete={onDelete}
              onShare={onShare}
              onViewGuests={onViewGuests}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {invitations && invitations.length >= (filters.limit || 20) && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            onClick={() => setFilters(prev => ({ 
              ...prev, 
              offset: (prev.offset || 0) + (prev.limit || 20) 
            }))}
            disabled={isLoading}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}