import { Skeleton } from '@kit/ui/skeleton';
import { Card, CardContent } from '@kit/ui/card';

export function InvitationLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <Skeleton className="h-96 w-full" />
        </div>
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-64" />
            </div>
          </CardContent>
        </Card>
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    </div>
  );
} 