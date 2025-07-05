import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CreateInvitation } from '../schema/invitation.schema';

export interface InvitationCreateState {
  // Current step in the form
  currentStep: number;
  
  // Template selection
  selectedTemplate: string | null;
  
  // Form data
  formData: Partial<CreateInvitation>;
  
  // UI state
  isLoading: boolean;
  errors: Record<string, string>;
  
  // Actions
  setCurrentStep: (step: number) => void;
  setSelectedTemplate: (templateId: string | null) => void;
  updateFormData: (data: Partial<CreateInvitation>) => void;
  setLoading: (loading: boolean) => void;
  setErrors: (errors: Record<string, string>) => void;
  resetForm: () => void;
}

const initialState = {
  currentStep: 0,
  selectedTemplate: null,
  formData: {
    title: '',
    description: '',
    location: '',
    image_url: '',
    max_guests: undefined,
    custom_fields: undefined,
    event_date: undefined,
    rsvp_deadline: undefined,
  },
  isLoading: false,
  errors: {},
};

export const useInvitationCreateStore = create<InvitationCreateState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      setSelectedTemplate: (templateId) => set({ selectedTemplate: templateId }),
      
      updateFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
      })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setErrors: (errors) => set({ errors }),
      
      resetForm: () => set(initialState),
    }),
    {
      name: 'invitation-create-store',
    }
  )
);