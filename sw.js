const CACHE_NAME = 'forensic-atlas-shell-v20';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './src/components/app-shell.js',
  './src/data/curriculum.js',
  './src/lib/router.js',
  './src/services/repository.js',
  './src/services/auth.js',
  './src/services/ai.js',
  './src/services/mastery.js',
  './src/services/assignment-agent.js',
  './src/services/content-engine.js',
  './src/services/question-engine.js',
  './src/services/lab-engine.js',
  './src/data/lab-simulations.js',
  './src/services/study-coach.js',
  './src/data/content-record.js',
  './src/data/curriculum-catalog.js',
  './src/data/curriculum-research.js',
  './src/data/forensic-biology-flagship.js',
  './src/data/forensic-chemistry.js',
  './src/data/fingerprint-science.js',
  './src/data/forensic-statistics.js',
  './src/data/degree-curriculum.js',
  './src/services/personalization.js',
  './src/services/content-operations.js',
  './src/services/subject-audit.js',
  './src/lib/router.js',
  './src/types/models.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin || event.request.headers.has('authorization')) return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then(async (response) => {
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, response.clone());
      }
      return response;
    }).catch(() => {
      if (event.request.mode === 'navigate') return caches.match('./index.html');
      throw new Error('Offline resource unavailable.');
    }))
  );
});
