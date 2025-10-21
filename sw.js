// Service Worker for Goura Hari Patel Portfolio PWA
// Version 1.0.0

const CACHE_NAME = 'ghp-portfolio-v1.0.0';
const CACHE_VERSION = '1.0.0';

// Files to cache for offline functionality
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/particles.js',
  '/assets/resume.html',
  '/manifest.json',
  // External CDN resources
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

// Images and other assets that can be cached on demand
const DYNAMIC_CACHE_URLS = [
  '/assets/images/',
  'https://github-readme-stats.vercel.app/',
  'https://github-readme-streak-stats.herokuapp.com/'
];

// Runtime cache configurations
const RUNTIME_CACHE_CONFIG = {
  images: {
    cacheName: 'ghp-images-cache',
    maxEntries: 50,
    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
  },
  api: {
    cacheName: 'ghp-api-cache',
    maxEntries: 20,
    maxAgeSeconds: 5 * 60 // 5 minutes
  },
  external: {
    cacheName: 'ghp-external-cache',
    maxEntries: 30,
    maxAgeSeconds: 24 * 60 * 60 // 1 day
  }
};

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('[SW] Caching static resources...');
        
        // Cache essential files first
        const essentialFiles = [
          '/',
          '/index.html',
          '/css/style.css',
          '/js/main.js',
          '/js/particles.js'
        ];
        
        await cache.addAll(essentialFiles);
        console.log('[SW] Essential files cached successfully');
        
        // Cache additional files with error handling
        for (const url of STATIC_CACHE_URLS) {
          if (!essentialFiles.includes(url)) {
            try {
              await cache.add(url);
            } catch (error) {
              console.warn(`[SW] Failed to cache ${url}:`, error);
            }
          }
        }
        
        console.log('[SW] Service worker installed successfully');
        
        // Skip waiting to activate immediately
        self.skipWaiting();
      } catch (error) {
        console.error('[SW] Installation failed:', error);
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
          name.startsWith('ghp-') && name !== CACHE_NAME
        );
        
        await Promise.all(
          oldCaches.map(cacheName => {
            console.log(`[SW] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          })
        );
        
        // Claim all clients
        await self.clients.claim();
        
        console.log('[SW] Service worker activated successfully');
      } catch (error) {
        console.error('[SW] Activation failed:', error);
      }
    })()
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(handleFetch(request));
});

// Main fetch handler
async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Handle different types of requests
    if (isStaticAsset(url)) {
      return await handleStaticAsset(request);
    } else if (isImage(url)) {
      return await handleImage(request);
    } else if (isApiRequest(url)) {
      return await handleApiRequest(request);
    } else if (isExternalResource(url)) {
      return await handleExternalResource(request);
    } else {
      return await handleDefault(request);
    }
  } catch (error) {
    console.error('[SW] Fetch error:', error);
    return await handleFallback(request);
  }
}

// Check if URL is a static asset
function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.html', '.json'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
         STATIC_CACHE_URLS.some(cached => url.href.includes(cached));
}

// Check if URL is an image
function isImage(url) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];
  return imageExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext)) ||
         url.pathname.includes('/images/');
}

// Check if URL is an API request
function isApiRequest(url) {
  return url.pathname.includes('/api/') ||
         url.hostname.includes('github.com') ||
         url.hostname.includes('vercel.app') ||
         url.hostname.includes('herokuapp.com');
}

// Check if URL is an external resource
function isExternalResource(url) {
  return url.hostname !== self.location.hostname &&
         (url.hostname.includes('fonts.googleapis.com') ||
          url.hostname.includes('cdnjs.cloudflare.com') ||
          url.hostname.includes('unpkg.com'));
}

// Handle static assets (cache first strategy)
async function handleStaticAsset(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Handle images (cache first with expiration)
async function handleImage(request) {
  const cache = await caches.open(RUNTIME_CACHE_CONFIG.images.cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Check if cache is still valid
    const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date') || 0);
    const now = new Date();
    const maxAge = RUNTIME_CACHE_CONFIG.images.maxAgeSeconds * 1000;
    
    if (now - cacheDate < maxAge) {
      return cachedResponse;
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cache-date', new Date().toISOString());
      
      const modifiedResponse = new Response(await responseClone.blob(), {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: headers
      });
      
      cache.put(request, modifiedResponse.clone());
      
      // Clean up old entries
      await cleanupCache(cache, RUNTIME_CACHE_CONFIG.images.maxEntries);
    }
    
    return networkResponse;
  } catch (error) {
    // Return cached version if network fails
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Handle API requests (network first with cache fallback)
async function handleApiRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE_CONFIG.api.cacheName);
  
  try {
    const networkResponse = await fetch(request, {
      timeout: 5000 // 5 second timeout
    });
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      await cleanupCache(cache, RUNTIME_CACHE_CONFIG.api.maxEntries);
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Network request failed, trying cache:', error);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Handle external resources (cache first with network fallback)
async function handleExternalResource(request) {
  const cache = await caches.open(RUNTIME_CACHE_CONFIG.external.cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      await cleanupCache(cache, RUNTIME_CACHE_CONFIG.external.maxEntries);
    }
    
    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Default handler (network first)
async function handleDefault(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Fallback handler for failed requests
async function handleFallback(request) {
  const url = new URL(request.url);
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    const cache = await caches.open(CACHE_NAME);
    const offlinePage = await cache.match('/index.html');
    return offlinePage || new Response('Offline', { status: 200 });
  }
  
  // Return placeholder for images
  if (isImage(url)) {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#6b7280">Image Offline</text></svg>',
      {
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    );
  }
  
  // Return generic error for other requests
  return new Response('Network Error', {
    status: 408,
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Clean up cache entries to stay within limits
async function cleanupCache(cache, maxEntries) {
  try {
    const keys = await cache.keys();
    
    if (keys.length > maxEntries) {
      const entriesToDelete = keys.slice(0, keys.length - maxEntries);
      await Promise.all(entriesToDelete.map(key => cache.delete(key)));
    }
  } catch (error) {
    console.warn('[SW] Cache cleanup failed:', error);
  }
}

// Handle background sync (if supported)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'portfolio-sync') {
    event.waitUntil(syncPortfolioData());
  }
});

// Background sync handler
async function syncPortfolioData() {
  try {
    // Implement any background sync logic here
    // For example, updating GitHub stats, form submissions, etc.
    console.log('[SW] Portfolio data synced successfully');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Handle push notifications (if implemented)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/assets/images/icon-192x192.png',
    badge: '/assets/images/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'view',
        title: 'View Portfolio'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Portfolio Update', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      self.clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    event.waitUntil(updateCache());
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

// Update cache manually
async function updateCache() {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(STATIC_CACHE_URLS);
    console.log('[SW] Cache updated successfully');
  } catch (error) {
    console.error('[SW] Cache update failed:', error);
  }
}

// Log service worker registration
console.log('[SW] Service worker script loaded successfully');
console.log('[SW] Cache name:', CACHE_NAME);
console.log('[SW] Version:', CACHE_VERSION);