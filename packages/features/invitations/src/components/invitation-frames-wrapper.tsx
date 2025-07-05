'use client';

import { useRouter } from 'next/navigation';
import { InvitationFrames } from '@kit/ui/invitation-frames';
import type { InvitationWithStats } from '../schema/invitation.schema';

interface InvitationFramesWrapperProps {
  invitation: InvitationWithStats;
  template: {
    id: string;
    name: string;
    category: string;
    design_config: any;
  };
  frames: Array<{
    id: string;
    type: 'hero' | 'details' | 'rsvp' | 'gallery';
    title?: string;
    showInNavigation?: boolean;
  }>;
  className?: string;
}

export function InvitationFramesWrapper({
  invitation,
  template,
  frames,
  className,
}: InvitationFramesWrapperProps) {
  const router = useRouter();

  const handleRSVPClick = () => {
    router.push(`/invite/${invitation.id}/rsvp`);
  };

  return (
    <InvitationFrames
      invitation={{
        ...invitation,
        description: invitation.description || null,
        event_date: invitation.event_date || null,
        location: invitation.location || null,
        image_url: invitation.image_url || null,
        updated_by: invitation.updated_by || null,
        template_id: invitation.template_id || null,
        max_guests: invitation.max_guests || null,
        rsvp_deadline: invitation.rsvp_deadline || null,
      }}
      template={template}
      frames={frames}
      onRSVPClick={handleRSVPClick}
      className={className}
    />
  );
} 