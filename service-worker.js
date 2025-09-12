const CACHE_NAME = 'percorsi-math-v6-1';
const ASSETS_TO_CACHE = [
  'index.html','style.css','app.js','readme.html','manifest.json',
  'icons/icon-192.png','icons/icon-512.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS_TO_CACHE))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME) && caches.delete(k)))
    ).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => {
      if (e.request.mode === 'navigate') return caches.match('index.html');
    }))
  );
});

self.addEventListener('message', e=>{
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});