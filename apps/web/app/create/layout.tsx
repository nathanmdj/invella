
import { requireUserInServerComponent } from '~/lib/server/require-user-in-server-component';

export default async function CreateInvitationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require authenticated user
  await requireUserInServerComponent();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}