export function InvitationError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Invitation Not Found</h2>
          <p className="text-muted-foreground mb-4">
            This invitation doesn&apos;t exist or is not publicly accessible.
          </p>
        </div>
      </div>
    </div>
  );
} 