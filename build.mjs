// 빌드: src/* → 저장소 루트 index.html (단일 파일) + sw.js(서비스워커, 그림 목록·캐시 버전 자동 생성)
import fs from 'fs'; import crypto from 'crypto'; import { execSync } from 'child_process';
// 빌드 번호: 커밋 횟수 + 1 (이 빌드가 올라가는 다음 커밋 번호). 오늘 날짜도 같이 표시한다.
let commits = 0; try{ commits = parseInt(execSync('git rev-list --count HEAD', {stdio:['ignore', 'pipe', 'ignore']}).toString().trim(), 10) || 0; }catch(e){}
const d = new Date(Date.now() + 9 * 3600 * 1000), BUILD = `#${commits + 1} · ${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${String(d.getUTCDate()).padStart(2, '0')}`;
const r = f => fs.readFileSync(f, 'utf8');
const js = ['src/engine.js', 'src/data/lovers.js', 'src/data/romance.js', 'src/data/romance2.js', 'src/data/romance3.js', 'src/data/career2.js', 'src/data/events.js', 'src/data/events2.js', 'src/data/calls.js', 'src/data/endings.js', 'src/ui.js'].map(r).join('\n');
const html = r('src/shell.html').replace('/*CSS*/', () => r('src/style.css')).replace('/*JS*/', () => js).replace(/__BUILD__/g, BUILD);
fs.writeFileSync('index.html', html);
const art = fs.readdirSync('art').filter(f => /\.(webp|png|jpg)$/.test(f)).sort();
// 처음 설치할 때 미리 받아 둘 것: 화면 틀 + 타이틀·주인공·기본 활동 그림. 나머지 그림은 쓰이는 순간 캐시된다.
const core = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'art/cover.webp', 'art/age20.webp', 'art/age22.webp', 'art/act_study.webp', 'art/act_cafe.webp', 'art/act_rest.webp', 'art/act_friends.webp', 'art/face_happy.webp', 'art/face_tired.webp'].filter(f => f === './' || fs.existsSync(f));
const ver = crypto.createHash('md5').update(html + art.map(f => f + fs.statSync('art/' + f).size).join()).digest('hex').slice(0, 10);
fs.writeFileSync('sw.js', `// 자동 생성 파일 (build.mjs). 직접 수정하지 마세요.
const CACHE = 'rewind-ten-${ver}';
const CORE = ${JSON.stringify(core)};
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
`);
console.log('build', BUILD, '· index.html', (html.length / 1024).toFixed(0) + 'KB', '· sw.js cache', ver, '· art', art.length);
