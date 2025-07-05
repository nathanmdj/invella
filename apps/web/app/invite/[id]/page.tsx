
import { Suspense } from 'react';
import { getPublicInvitation, getTemplateData } from '@kit/invitations/server/actions';
import { getDefaultFrames } from '@kit/invitations/server/utils';
import { InvitationInteractive } from '@kit/invitations/invitation-interactive';
import { InvitationLoading } from '@kit/invitations/invitation-loading';
import { InvitationError } from '@kit/invitations/invitation-error';
import { InvitationFramesWrapper } from '@kit/invitations/invitation-frames-wrapper';
import { TemplateRenderer } from '@kit/ui/template-renderer';

interface InvitationPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function InvitationContent({ invitationId }: { invitationId: string }) {
  // Fetch data using server actions
  const [invitation, template] = await Promise.all([
    getPublicInvitation(invitationId),
    getTemplateData()
  ]);

  if (!invitation) {
    return <InvitationError />;
  }

  // Get frames based on template category using server-side function
  const frames = getDefaultFrames(template.category);

  return (
    <div className="min-h-screen w-full">
      <TemplateRenderer 
        template={template}
        invitation={{
          id: invitation.id,
          title: invitation.title,
          description: invitation.description || undefined,
          event_date: invitation.event_date || '',
          location: invitation.location || undefined,
          image_url: invitation.image_url || undefined,
        }}
        className="w-full h-full"
      >
        {/* Full-Screen Template Gallery Frames */}
        <InvitationFramesWrapper
          invitation={invitation}
          template={template}
          frames={frames}
          className="w-full"
        />

        {/* Interactive Components (Client-side) */}
        <InvitationInteractive 
          invitationId={invitationId} 
          invitationTitle={invitation.title}
        />
      </TemplateRenderer>
    </div>
  );
}

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { id: invitationId } = await params;

  return (
    <Suspense fallback={<InvitationLoading />}>
      <InvitationContent invitationId={invitationId} />
    </Suspense>
  );
}