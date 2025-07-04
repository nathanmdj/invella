const CACHE_NAME = 'invella-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/create',
  '/dashboard',
  '/offline',
  '/images/favicon/android-chrome-192x192.png',
  '/images/favicon/android-chrome-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Claim all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip requests to external domains
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();

            // Cache the response for future use
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Only cache same-origin requests
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests when offline
            if (event.request.mode === 'navigate') {
              return caches.match('/offline');
            }
            
            // For other requests, try to return a cached version
            return caches.match(event.request);
          });
      })
  );
});

// Background sync for offline RSVP submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'rsvp-sync') {
    event.waitUntil(syncRSVPData());
  }
});

// Function to sync RSVP data when back online
async function syncRSVPData() {
  try {
    // Get pending RSVP data from IndexedDB
    const pendingRSVPs = await getPendingRSVPs();
    
    for (const rsvp of pendingRSVPs) {
      try {
        // Submit the RSVP
        await fetch('/api/rsvp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rsvp.data)
        });
        
        // Remove from pending list on success
        await removePendingRSVP(rsvp.id);
      } catch (error) {
        console.error('Failed to sync RSVP:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// IndexedDB helpers (simplified for now)
async function getPendingRSVPs() {
  // TODO: Implement IndexedDB storage for offline RSVP data
  return [];
}

async function removePendingRSVP(id) {
  // TODO: Implement removal from IndexedDB
  return Promise.resolve();
}

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/images/favicon/android-chrome-192x192.png',
    badge: '/images/favicon/android-chrome-192x192.png',
    tag: 'invella-notification',
    data: data.url
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});