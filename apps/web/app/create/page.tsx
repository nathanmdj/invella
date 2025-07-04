'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InvitationForm } from '@kit/invitations/invitation-form';
import { TemplateSelector } from '@kit/invitations/template-selector';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { useCreateInvitation } from '@kit/invitations/hooks/use-invitation-data';
import type { CreateInvitation } from '@kit/invitations/schema/invitation.schema';

export default function CreateInvitationPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const router = useRouter();
  const { mutate: createInvitation, isPending } = useCreateInvitation();

  const handleSubmit = (data: CreateInvitation) => {
    // Validate template_id is a proper UUID or set to undefined
    const isValidUUID = selectedTemplate && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(selectedTemplate);
    
    createInvitation({
      ...data,
      template_id: isValidUUID ? selectedTemplate : undefined,
    }, {
      onSuccess: (invitation) => {
        router.push(`/dashboard/invitations/${invitation.id}`);
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Invitation</h1>
        <p className="text-muted-foreground">
          Design a beautiful invitation for your special event
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Template</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateSelector 
              onSelectTemplate={setSelectedTemplate}
              selectedTemplate={selectedTemplate}
            />
          </CardContent>
        </Card>

        {/* Invitation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <InvitationForm 
              onSubmit={handleSubmit}
              isLoading={isPending}
              onCancel={() => router.push('/dashboard')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}