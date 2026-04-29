const CACHE_NAME = 'bridaps-pwa-v4';
const API_CACHE_NAME = 'bridaps-api-v1';
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
                .filter((key) => key !== CACHE_NAME && key !== API_CACHE_NAME)
                .map((key) => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    const requestUrl = new URL(event.request.url);

    if (requestUrl.origin === self.location.origin && requestUrl.pathname.startsWith('/news/api/')) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(API_CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
                    }

                    return networkResponse;
                })
                .catch(async () => {
                    const cachedResponse = await caches.match(event.request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return new Response(JSON.stringify([]), {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        status: 200
                    });
                })
        );
        return;
    }

    if (requestUrl.origin === self.location.origin) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
                    }

                    return networkResponse;
                })
                .catch(async () => {
                    const cachedResponse = await caches.match(event.request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }

                    throw new Error(`No cached response for ${event.request.url}`);
                })
        );
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