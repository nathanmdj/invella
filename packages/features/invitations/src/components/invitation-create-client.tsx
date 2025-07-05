'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InvitationForm } from './invitation-form';
import { TemplateSelector } from './template-selector';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { createInvitation } from '../server/actions';
import type { CreateInvitation } from '../schema/invitation.schema';

export function InvitationCreateClient() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: CreateInvitation) => {
    setIsLoading(true);
    try {
      // Validate template_id is a proper UUID or set to undefined
      const isValidUUID = selectedTemplate && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(selectedTemplate);
      
      const result = await createInvitation({
        ...data,
        template_id: isValidUUID ? selectedTemplate : undefined,
      });

      if (result.success && result.invitation) {
        router.push(`/home/invitations/${result.invitation.id}`);
      } else {
        console.error('Failed to create invitation:', result.error);
      }
    } catch (error) {
      console.error('Error creating invitation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Invitation</h1>
        <p className="text-muted-foreground">
          Design a beautiful invitation for your special event
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8 xl:gap-x-16 items-start">
        {/* Template Selection */}
        <Card className="h-full flex flex-col min-h-[500px]">
          <CardHeader>
            <CardTitle>Choose Template</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <TemplateSelector 
              onSelectTemplate={setSelectedTemplate}
              selectedTemplate={selectedTemplate}
            />
          </CardContent>
        </Card>

        {/* Invitation Form */}
        <Card className="h-full flex flex-col min-h-[500px]">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <InvitationForm 
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onCancel={() => router.push('/home')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}