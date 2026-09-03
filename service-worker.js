const CACHE_VERSION = 'mbot-revamp-v14-vault-final64-20260903';
const CORE_FILES = [
  './',
  './index.html',
  './about.html',
  './draw-a-card.html',
  './mighty-365.html',
  './mighty-bible-discovery.html',
  './mighty-hero-matchup.html',
  './mighty-vault.html',
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
  './assets/mighty-vault.css',
  './assets/mighty-vault-final.css',
  './assets/mighty-vault.js',
  './assets/mighty-vault-card-atlas.webp',
  './assets/vault-aquila.webp',
  './assets/vault-lydia.webp',
  './assets/vault-phoebe.webp',
  './assets/mighty-vault-home-entry.webp',
  './assets/discovery-map.js',
  './assets/videos/fighting-jesus-thumbnail.jpg',
  './assets/videos/i-can-see-it-thumbnail.jpg',
  './assets/products/mighty-hero-matchup/complete-game.webp',
  './assets/products/mighty-hero-matchup/approved-product-box.webp',
  './assets/products/mighty-hero-matchup/approved-hero-deck.webp',
  './assets/products/mighty-hero-matchup/command-tokens.webp',
  './assets/products/mighty-hero-matchup/flagship-video-qr-card.webp',
  './assets/products/mighty-bible-discovery/interactive-bible-discovery-map-web-v1.webp',
  './assets/products/mighty-bible-discovery/sample-cards/cards.json',
  './assets/icons/brand-mark.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(async cache => {
      await Promise.allSettled(CORE_FILES.map(file => cache.add(file)));
    })
  );
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
    fetch(request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});