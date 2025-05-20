// sw.js - basic offline support for PWA
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('skate-pwa').then(cache =>
      cache.match(event.request).then(resp =>
        resp || fetch(event.request).then(response => {
          cache.put(event.request, response.clone());
          return response;
        })
      )
    )
  );
});
