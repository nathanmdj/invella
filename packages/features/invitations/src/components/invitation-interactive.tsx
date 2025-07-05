'use client';

import { Card, CardContent } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { ShareInvitation } from './share-invitation';
import { useRouter } from 'next/navigation';

interface InvitationInteractiveProps {
  invitationId: string;
  invitationTitle: string;
}

export function InvitationInteractive({ 
  invitationId, 
  invitationTitle 
}: InvitationInteractiveProps) {
  const router = useRouter();

  const handleRSVPClick = () => {
    router.push(`/invite/${invitationId}/rsvp`);
  };

  return (
    <>
      {/* RSVP Button - Fixed at top */}
      <div className="fixed top-4 right-4 z-20">
        <Button 
          onClick={handleRSVPClick}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg"
        >
          RSVP Now
        </Button>
      </div>

      {/* Share Section - Fixed at bottom */}
      <div className="fixed bottom-4 left-4 right-4 z-20">
        <Card className="max-w-sm mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <ShareInvitation 
              invitationId={invitationId} 
              invitationTitle={invitationTitle}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
} 