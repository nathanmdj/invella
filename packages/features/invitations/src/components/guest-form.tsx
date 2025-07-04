'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserIcon, MailIcon, PhoneIcon } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Switch } from '@kit/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@kit/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';

import { CreateGuestSchema, type CreateGuest } from '../schema/guest.schema';

interface GuestFormProps {
  invitationId: string;
  onSubmit: (data: CreateGuest) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreateGuest>;
}

export function GuestForm({
  invitationId,
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: GuestFormProps) {
  const form = useForm<CreateGuest>({
    resolver: zodResolver(CreateGuestSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      invitation_id: invitationId,
      plus_one_allowed: initialData?.plus_one_allowed || false,
    },
  });

  const handleSubmit = (data: CreateGuest) => {
    onSubmit({
      ...data,
      invitation_id: invitationId,
    });
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Guest' : 'Add New Guest'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="e.g., John Smith" 
                        className="pl-10"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="email"
                        placeholder="e.g., john@example.com" 
                        className="pl-10"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Email is optional but recommended for sending invitations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="tel"
                        placeholder="e.g., +1 (555) 123-4567" 
                        className="pl-10"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Phone number is optional
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plus_one_allowed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Allow Plus One
                    </FormLabel>
                    <FormDescription>
                      This guest can bring an additional person
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : (initialData ? 'Update Guest' : 'Add Guest')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}