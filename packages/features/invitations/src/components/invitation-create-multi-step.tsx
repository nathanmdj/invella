'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Stepper } from '@kit/ui/stepper';
import { cn } from '@kit/ui/utils';

import { CreateInvitationSchema, type CreateInvitation } from '../schema/invitation.schema';
import { createInvitation } from '../server/actions';
import { useInvitationCreateStore } from '../store/invitation-create-store';
import { usePublicTemplates } from '../hooks/use-template-data';
import { TemplateSelector } from './template-selector';
import { InvitationForm } from './invitation-form';

const STEPS = ['Template', 'Details', 'Review'];

export function InvitationCreateMultiStep() {
  const router = useRouter();
  const {
    currentStep,
    selectedTemplate,
    formData,
    isLoading,
    setCurrentStep,
    setSelectedTemplate,
    updateFormData,
    setLoading,
    resetForm,
  } = useInvitationCreateStore();

  const form = useForm({
    resolver: zodResolver(CreateInvitationSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      image_url: '',
      max_guests: undefined,
      custom_fields: {},
      event_date: undefined,
      rsvp_deadline: undefined,
      ...formData,
    },
  });

  // Fetch templates for display
  const { data: templates } = usePublicTemplates({
    limit: 50,
  });

  // Sync form with store when store updates
  useEffect(() => {
    form.reset({
      title: formData.title || '',
      description: formData.description || '',
      location: formData.location || '',
      image_url: formData.image_url || '',
      max_guests: formData.max_guests || undefined,
      custom_fields: formData.custom_fields || {},
      event_date: formData.event_date || undefined,
      rsvp_deadline: formData.rsvp_deadline || undefined,
    });
  }, [formData, form]);

  // Watch form changes and update store with debouncing
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change' && value) {
        // Only update store when user actually changes values
        updateFormData(value as Partial<CreateInvitation>);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormData]);

  // Ensure store is updated when step changes
  useEffect(() => {
    const currentValues = form.getValues();
    if (Object.keys(currentValues).some(key => currentValues[key as keyof CreateInvitation])) {
      updateFormData(currentValues);
    }
  }, [currentStep, form, updateFormData]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      // Explicitly save current form values to store
      const currentValues = form.getValues();
      updateFormData(currentValues);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      // Save current form values before going back
      const currentValues = form.getValues();
      updateFormData(currentValues);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: CreateInvitation) => {
    setLoading(true);
    try {
      const isValidUUID = selectedTemplate && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(selectedTemplate);
      
      const result = await createInvitation({
        ...data,
        template_id: isValidUUID ? selectedTemplate : undefined,
      });

      if (result.success && result.invitation) {
        resetForm();
        router.push(`/home/invitations/${result.invitation.id}`);
      } else {
        console.error('Failed to create invitation:', result.error);
      }
    } catch (error) {
      console.error('Error creating invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return selectedTemplate !== null;
    }
    if (currentStep === 1) {
      const values = form.getValues();
      return values.title && values.title.trim().length > 0;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Create New Invitation</h1>
            <p className="text-muted-foreground text-lg">
              Design a beautiful invitation for your special event
            </p>
          </div>

          {/* Progress Stepper */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <Stepper
                steps={STEPS}
                currentStep={currentStep}
                variant="numbers"
              />
            </div>
          </div>

          <Card className="min-h-[600px] shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-center">
                {currentStep === 0 && 'Choose Template'}
                {currentStep === 1 && 'Event Details'}
                {currentStep === 2 && 'Review & Create'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-6 lg:px-8">
          {/* Step 1: Template Selection */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />
            </div>
          )}

          {/* Step 2: Event Details */}
          {currentStep === 1 && (
            <div className="max-w-3xl mx-auto">
              <InvitationForm
                onSubmit={(data) => {
                  updateFormData(data);
                  form.reset(data); // Update the main form with submitted data
                  handleNext();
                }}
                isLoading={false}
                initialData={{
                  ...formData,
                  ...form.getValues() // Use current form values as initial data
                }}
              />
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 2 && (() => {
            const selectedTemplateData = templates?.find(t => t.id === selectedTemplate);
            const currentFormData = form.getValues();
            
            return (
              <div className="space-y-8 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">1</span>
                      </div>
                      Selected Template
                    </h3>
                    <div className="p-6 bg-muted/50 rounded-xl border">
                      {selectedTemplateData ? (
                        <div className="space-y-4">
                          {/* Template Image */}
                          {selectedTemplateData.preview_image ? (
                            <div className="aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-lg border">
                              <img
                                src={selectedTemplateData.preview_image}
                                alt={selectedTemplateData.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="aspect-[3/4] w-full max-w-[200px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border flex items-center justify-center">
                              <div className="text-gray-400 text-center">
                                <svg className="h-8 w-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-xs">No preview</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Template Details */}
                          <div className="space-y-2">
                            <p className="text-sm font-medium">{selectedTemplateData.name}</p>
                            <p className="text-xs text-muted-foreground">{selectedTemplateData.description || 'No description'}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span className="capitalize">{selectedTemplateData.category.replace('_', ' ')}</span>
                            </div>
                            
                            {/* Template Colors */}
                            {selectedTemplateData.design_config && (selectedTemplateData.design_config.primaryColor || selectedTemplateData.design_config.accentColor) && (
                              <div className="flex items-center space-x-2 pt-1">
                                <span className="text-xs text-muted-foreground">Colors:</span>
                                <div className="flex space-x-1">
                                  {selectedTemplateData.design_config.primaryColor && (
                                    <div 
                                      className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                                      style={{ backgroundColor: selectedTemplateData.design_config.primaryColor }}
                                    />
                                  )}
                                  {selectedTemplateData.design_config.accentColor && (
                                    <div 
                                      className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                                      style={{ backgroundColor: selectedTemplateData.design_config.accentColor }}
                                    />
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : selectedTemplate ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Template Selected</p>
                          <p className="text-xs text-muted-foreground">ID: {selectedTemplate}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No template selected</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">2</span>
                      </div>
                      Event Details
                    </h3>
                    <div className="p-6 bg-muted/50 rounded-xl border space-y-3">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Title</span>
                          <p className="text-sm">{currentFormData.title || formData.title || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Description</span>
                          <p className="text-sm">{currentFormData.description || formData.description || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Location</span>
                          <p className="text-sm">{currentFormData.location || formData.location || 'Not specified'}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Event Date</span>
                            <p className="text-sm">
                              {(currentFormData.event_date || formData.event_date) 
                                ? new Date(currentFormData.event_date || formData.event_date!).toLocaleDateString() 
                                : 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">RSVP Deadline</span>
                            <p className="text-sm">
                              {(currentFormData.rsvp_deadline || formData.rsvp_deadline) 
                                ? new Date(currentFormData.rsvp_deadline || formData.rsvp_deadline!).toLocaleDateString() 
                                : 'Not specified'}
                            </p>
                          </div>
                        </div>
                        {(currentFormData.max_guests || formData.max_guests) && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Maximum Guests</span>
                            <p className="text-sm">{currentFormData.max_guests || formData.max_guests}</p>
                          </div>
                        )}
                        {(currentFormData.image_url || formData.image_url) && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Background Image</span>
                            <p className="text-sm break-all">{currentFormData.image_url || formData.image_url}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto min-w-[200px]"
                      size="lg"
                    >
                      {isLoading ? 'Creating Invitation...' : 'Create Invitation'}
                    </Button>
                  </form>
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 px-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {currentStep < STEPS.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => router.push('/home')}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}