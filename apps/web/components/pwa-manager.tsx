'use client';

import { useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAManager() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New update available
                  console.log('New content available, please refresh.');
                  // You could show a toast notification here
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Handle app install prompt
    let _deferredPrompt: BeforeInstallPromptEvent | null = null;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      _deferredPrompt = e as BeforeInstallPromptEvent;
      
      // Show install button/banner
      console.log('PWA install prompt available');
      // You could show an install button here
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      deferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Register background sync for offline RSVP submissions
  useEffect(() => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        // Register for background sync
        return registration.sync.register('rsvp-sync');
      }).catch((error) => {
        console.error('Background sync registration failed:', error);
      });
    }
  }, []);

  return null; // This component doesn't render anything
}

// Hook to trigger PWA install prompt
export function usePWAInstall() {
  const promptInstall = () => {
    // This would trigger the install prompt if available
    // Implementation would depend on storing deferredPrompt in context
    console.log('Install prompt triggered');
  };

  return { promptInstall };
}