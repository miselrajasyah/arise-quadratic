const VERSI = 'arise-v24-7';
const FILES = [
  './',
  'index.html',
  'css/style.css',
  'css/v11.css',
  'css/v2.css',
  'css/v20.css',
  'css/forge20.css',
  'css/mobile20.css',
  'css/ice21.css',
  'css/practice21.css',
  'css/v22.css',
  'css/v23.css',
  'css/v24.css',
  'css/v247.css',
  '404.html',
  'js/icons.js',
  'js/content.js',
  'js/team.js',
  'js/characters.js',
  'js/extras.js',
  'js/materi.js',
  'js/glossary.js',
  'js/avatar.js',
  'js/sync.js',
  'js/lang.js',
  'js/lang2.js',
  'js/lang3.js',
  'js/lang4.js',
  'js/lang5.js',
  'js/lang6.js',
  'js/lang6b.js',
  'js/bank21.js',
  'js/bank21a.js',
  'js/bank21b.js',
  'js/bank21c.js',
  'js/bank21d.js',
  'js/bank21e.js',
  'js/lang7.js',
  'js/lang22.js',
  'js/lang23.js',
  'js/lang24.js',
  'js/lang247.js',
  'js/iceberg21.js',
  'js/i18n.js',
  'js/app.js',
  'js/class20.js',
  'js/audio3.js',
  'js/monsters.js',
  'js/sfx11.js',
  'js/battle11.js',
  'js/gatemap.js',
  'js/menus11.js',
  'js/ui11.js',
  'js/mentor12.js',
  'js/practice21.js',
  'js/redgate12.js',
  'js/gates12.js',
  'js/worldboss20.js',
  'js/lens20.js',
  'js/forge20.js',
  'js/mathpad22.js',
  'js/cinema23.js',
  'js/fx24.js',
  'js/cutscene24.js',
  'js/gatebrief24.js',
  'js/ui24.js',
  'js/guild247.js',
  'js/transcript23.js',
  'js/mobile20.js',
  'js/boot11.js',
  'js/math.js',
  'js/cloud.js',
  'js/firebase.js',
  'icons/logo.svg',
  'icons/icon-192.png',
  'manifest.webmanifest',
];
self.addEventListener('install', (e) =>
  e.waitUntil(
    caches
      .open(VERSI)
      .then((c) => c.addAll(FILES))
      .then(() => self.skipWaiting()),
  ),
);
self.addEventListener('activate', (e) =>
  e.waitUntil(
    caches
      .keys()
      .then((k) => Promise.all(k.filter((x) => x !== VERSI).map((x) => caches.delete(x))))
      .then(() => self.clients.claim()),
  ),
);
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);

  if (e.request.method === 'GET' && u.hostname === 'cdn.jsdelivr.net' && u.pathname.includes('/katex@')) {
    e.respondWith(
      caches.open(VERSI).then((c) =>
        c.match(e.request).then(
          (m) =>
            m ||
            fetch(e.request).then((r) => {
              if (r.ok || r.type === 'opaque') c.put(e.request, r.clone());
              return r;
            }),
        ),
      ),
    );
    return;
  }
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        const cp = r.clone();
        caches.open(VERSI).then((c) => c.put(e.request, cp));
        return r;
      })
      .catch(() => caches.match(e.request).then((m) => m || caches.match('index.html'))),
  );
});
