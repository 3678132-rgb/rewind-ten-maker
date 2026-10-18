// 자동 생성 파일 (build.mjs). 직접 수정하지 마세요.
const CACHE = 'rewind-ten-ea3eef4095';
const CORE = ["./","index.html","manifest.json","icon-192.png","icon-512.png","art/cover.webp","art/age20.webp","art/age22.webp","art/act_study.webp","art/act_cafe.webp","art/act_rest.webp","art/act_friends.webp","art/face_happy.webp","art/face_tired.webp"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('rewind-ten-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if(req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const isPage = req.mode === 'navigate' || req.url.endsWith('/index.html');
  if(isPage){ // 화면 틀은 인터넷이 되면 항상 최신, 안 되면 캐시
    e.respondWith(fetch(req, {cache:'no-store'}).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put('index.html', cp)); return res; }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { if(res.ok){ const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return res; })));
});
