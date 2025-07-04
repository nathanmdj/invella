'use client';

import { format } from 'date-fns';
import { Calendar, MapPin, Users, Share2, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@kit/ui/dropdown-menu';
import type { InvitationWithStats } from '../schema/invitation.schema';

interface InvitationCardProps {
  invitation: InvitationWithStats;
  onEdit?: (invitation: InvitationWithStats) => void;
  onDelete?: (invitation: InvitationWithStats) => void;
  onShare?: (invitation: InvitationWithStats) => void;
  onViewGuests?: (invitation: InvitationWithStats) => void;
}

export function InvitationCard({
  invitation,
  onEdit,
  onDelete,
  onShare,
  onViewGuests,
}: InvitationCardProps) {
  const eventDate = invitation.event_date ? new Date(invitation.event_date) : null;
  const isUpcoming = eventDate && eventDate > new Date();
  const isPast = eventDate && eventDate < new Date();

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {invitation.title}
            </CardTitle>
            {invitation.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {invitation.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                <span className="sr-only">Open menu</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M3 6.5C3.825 6.5 4.5 7.175 4.5 8C4.5 8.825 3.825 9.5 3 9.5C2.175 9.5 1.5 8.825 1.5 8C1.5 7.175 2.175 6.5 3 6.5ZM7.5 6.5C8.325 6.5 9 7.175 9 8C9 8.825 8.325 9.5 7.5 9.5C6.675 9.5 6 8.825 6 8C6 7.175 6.675 6.5 7.5 6.5ZM12 6.5C12.825 6.5 13.5 7.175 13.5 8C13.5 8.825 12.825 9.5 12 9.5C11.175 9.5 10.5 8.825 10.5 8C10.5 7.175 11.175 6.5 12 6.5Z"
                    fill="currentColor"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(invitation)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onShare && (
                <DropdownMenuItem onClick={() => onShare(invitation)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
              )}
              {onViewGuests && (
                <DropdownMenuItem onClick={() => onViewGuests(invitation)}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Guests
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(invitation)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          {isUpcoming && <Badge variant="default">Upcoming</Badge>}
          {isPast && <Badge variant="secondary">Past</Badge>}
          {invitation.is_public && <Badge variant="outline">Public</Badge>}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {eventDate && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {format(eventDate, 'PPP')} at {format(eventDate, 'p')}
          </div>
        )}

        {invitation.location && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="truncate">{invitation.location}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            <span>
              {invitation.attending_count} attending
              {invitation.guest_count > 0 && ` / ${invitation.guest_count} invited`}
            </span>
          </div>

          <div className="text-xs text-muted-foreground">
            Created {format(new Date(invitation.created_at), 'MMM d')}
          </div>
        </div>

        {invitation.rsvp_deadline && (
          <div className="text-xs text-amber-600 dark:text-amber-400">
            RSVP by {format(new Date(invitation.rsvp_deadline), 'PPP')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}