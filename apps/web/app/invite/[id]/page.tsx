
import { Suspense } from 'react';
import { getPublicInvitation, getTemplateData } from '@kit/invitations/server/actions';
import { getDefaultFrames } from '@kit/invitations/server/utils';
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
  // Fetch invitation data first
  const invitation = await getPublicInvitation(invitationId);

  if (!invitation) {
    return <InvitationError />;
  }

  // Fetch template data using the template ID from the invitation
  const template = await getTemplateData(invitation.template_id);

  // Get frames based on template category using server-side function
  const frames = getDefaultFrames(template.category);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <TemplateRenderer 
        template={template}
        className="w-full h-full"
      >
        {/* Full-Screen Template Gallery Frames */}
        <InvitationFramesWrapper
          invitation={invitation}
          template={template}
          frames={frames}
          className="w-full h-full"
        />

        {/* Interactive Components (Client-side) */}
        {/* <InvitationInteractive 
          invitationId={invitationId} 
          invitationTitle={invitation.title}
        /> */}
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