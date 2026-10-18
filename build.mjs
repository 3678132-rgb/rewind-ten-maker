// 빌드: src/* → 저장소 루트 index.html (단일 파일) + sw.js(서비스워커, 그림 목록·캐시 버전 자동 생성)
import fs from 'fs'; import crypto from 'crypto'; import { execSync } from 'child_process';
// 빌드 번호: 커밋 횟수 + 1 (이 빌드가 올라가는 다음 커밋 번호). 오늘 날짜도 같이 표시한다.
let commits = 0; try{ commits = parseInt(execSync('git rev-list --count HEAD', {stdio:['ignore', 'pipe', 'ignore']}).toString().trim(), 10) || 0; }catch(e){}
const d = new Date(Date.now() + 9 * 3600 * 1000), BUILD = `#${commits + 1} · ${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${String(d.getUTCDate()).padStart(2, '0')}`;
const r = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
const js = ['src/engine.js', 'src/idol/idol_core.js', 'src/data/lovers.js', 'src/data/romance.js', 'src/data/romance2.js', 'src/data/romance3.js', 'src/data/intimacy_a.js', 'src/data/intimacy_b.js', 'src/data/intimacy_c.js', 'src/data/intimacy2_a.js', 'src/data/intimacy2_b.js', 'src/data/intimacy2_c.js', 'src/data/intimacy.js', 'src/data/regret.js', 'src/data/lstory_core.js', 'src/data/lstory_a.js', 'src/data/lstory_b.js', 'src/data/lstory_c.js', 'src/data/lstory_d.js', 'src/data/campus_scenes.js', 'src/data/campus.js', 'src/data/city_friends.js', 'src/data/city_lovers_a.js', 'src/data/city_lovers_b.js', 'src/data/city_lovers_c.js', 'src/data/city.js', 'src/data/city_npc.js', 'src/data/career2.js', 'src/data/jobs2.js', 'src/data/events.js', 'src/idol/events_a.js', 'src/idol/events_b.js', 'src/data/story_core.js', 'src/data/special_a.js', 'src/data/special_b.js', 'src/data/special_c.js', 'src/idol/story_a.js', 'src/idol/story_b.js', 'src/idol/story_c.js', 'src/data/story.js', 'src/data/calls.js', 'src/idol/endings.js', 'src/idol/idol_wire.js', 'src/ui.js'].map(r).join('\n');
const html = r('src/shell.html').replace('/*CSS*/', () => r('src/style.css')).replace('/*JS*/', () => js).replace(/__BUILD__/g, BUILD).replace('__DATE_ART__', () => JSON.stringify(fs.readdirSync('art').filter(f => /^dt_[a-z]+_\d+\.webp$/.test(f)).map(f => f.replace('.webp', '')))).replace('__CUT_OUTFIT__', () => JSON.stringify(fs.readdirSync('art/cut').filter(f => /^[a-z]+_(work|home|w)_[ab]\.webp$/.test(f)).map(f => f.replace('.webp', '')))).replace('__END_ART__', () => JSON.stringify(fs.readdirSync('art').filter(f => /^end_[a-z_]+\.webp$/.test(f)).map(f => f.replace('.webp', '')))).replace('__HERO_JOB__', () => JSON.stringify(fs.readdirSync('art').filter(f => /^age\d+_[a-z]+\.webp$/.test(f) && !/_(ripe|summer|autumn|winter)\.webp$/.test(f)).map(f => f.replace('.webp', '')))).replace('__HERO_RIPE__', () => JSON.stringify(fs.readdirSync('art').filter(f => /^age\d+_ripe\.webp$/.test(f)).map(f => f.replace('_ripe.webp', '')))).replace('__HERO_SEASONAL__', () => JSON.stringify(fs.readdirSync('art').filter(f => /^age\d+_(summer|autumn|winter)\.webp$/.test(f)).map(f => f.replace('.webp', ''))));
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
