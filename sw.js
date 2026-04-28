const CACHE_NAME = 'bridaps-pwa-v2';
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/about.html',
    '/administrators.html',
    '/teaching-staffs.html',
    '/graduates.html',
    '/news.html',
    '/contact.html',
    '/css/style.css',
    '/js/script.js',
    '/assets/icons/app-icon-192.png',
    '/assets/icons/app-icon-512.png',
    '/assets/icons/apple-touch-icon.png',
    '/assets/icons/favicon-32.png',
    '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys
                .filter((key) => key !== CACHE_NAME)
                .map((key) => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request)
                .then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
                    return networkResponse;
                })
                .catch(() => caches.match('/index.html'));
        })
    );
});