import { Suspense } from 'react';
import { Metadata } from 'next';
import { TemplateAdminList } from '@kit/invitations';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Template Management',
  description: 'Manage invitation templates',
};

export default function TemplateAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Template Management</h1>
          <p className="text-muted-foreground">
            Create and manage invitation templates
          </p>
        </div>
        <Button asChild>
          <Link href="/home/admin/templates/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading templates...</div>
              </div>
            }
          >
            <TemplateAdminList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}