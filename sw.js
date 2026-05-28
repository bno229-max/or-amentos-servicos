const CACHE_NAME = 'orcapro-v1';
// Substitua 'index.html' pelo nome exato do seu arquivo HTML principal, se for diferente.
const urlsToCache = [
  './',
  './index.html' 
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});