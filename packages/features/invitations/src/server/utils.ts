interface FrameConfig {
  id: string;
  type: 'hero' | 'details' | 'rsvp' | 'gallery';
  title?: string;
  showInNavigation?: boolean;
}

/**
 * Server-side function to get default frames for template categories
 */
export function getDefaultFrames(category: string): FrameConfig[] {
  switch (category) {
    case 'wedding':
      return [
        { id: 'hero', type: 'hero', title: 'Welcome', showInNavigation: true },
        { id: 'details', type: 'details', title: 'Details', showInNavigation: true },
        { id: 'rsvp', type: 'rsvp', title: 'RSVP', showInNavigation: true },
      ];
    case 'birthday':
      return [
        { id: 'hero', type: 'hero', title: 'Celebration', showInNavigation: true },
        { id: 'gallery', type: 'gallery', title: 'Gallery', showInNavigation: true },
        { id: 'rsvp', type: 'rsvp', title: 'RSVP', showInNavigation: true },
      ];
    case 'corporate':
      return [
        { id: 'hero', type: 'hero', title: 'Event', showInNavigation: true },
        { id: 'details', type: 'details', title: 'Details', showInNavigation: true },
      ];
    case 'anniversary':
      return [
        { id: 'hero', type: 'hero', title: 'Anniversary', showInNavigation: true },
        { id: 'details', type: 'details', title: 'Details', showInNavigation: true },
        { id: 'rsvp', type: 'rsvp', title: 'RSVP', showInNavigation: true },
      ];
    default:
      return [
        { id: 'hero', type: 'hero', title: 'Welcome', showInNavigation: true },
        { id: 'details', type: 'details', title: 'Details', showInNavigation: true },
        { id: 'rsvp', type: 'rsvp', title: 'RSVP', showInNavigation: true },
      ];
  }
} 