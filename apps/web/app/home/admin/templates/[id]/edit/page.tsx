import { Metadata } from 'next';
import { TemplateForm } from '@kit/invitations/template-form';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Edit Template',
  description: 'Edit invitation template',
};

interface EditTemplatePageProps {
  params: {
    id: string;
  };
}

export default function EditTemplatePage({ params }: EditTemplatePageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/home/admin/templates">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Template</h1>
          <p className="text-muted-foreground">
            Edit invitation template
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateForm templateId={params.id} />
        </CardContent>
      </Card>
    </div>
  );
}