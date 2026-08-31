const CACHE_VERSION = 'mbot-revamp-v3';
const CORE_FILES = [
  './',
  './index.html',
  './about.html',
  './draw-a-card.html',
  './hero-matchup-demo.html',
  './mighty-365.html',
  './mighty-bible-discovery.html',
  './mighty-hero-matchup.html',
  './mighty-bible-battle.html',
  './for-families.html',
  './for-churches-schools.html',
  './for-retailers-partners.html',
  './contact.html',
  './privacy.html',
  './card-companion.html',
  './offline.html',
  './assets/site.css',
  './assets/site.js',
  './assets/discovery-map.js',
  './assets/products/mighty-bible-discovery/interactive-bible-discovery-map-web-v1.webp',
  './assets/products/mighty-bible-discovery/sample-cards/cards.json',
  './assets/icons/brand-mark.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(CORE_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(response => response || caches.match('./offline.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
      }
      return response;
    }))
  );
});
