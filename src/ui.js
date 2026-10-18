// ── UI (ENGINE 밖) ─────────────────────────────────────────────
const SAVE_KEY = 'rewind-ten-idol-v3', ENDINGS_KEY = 'rewind-ten-endings-v1', SLOTS_KEY = 'rewind-ten-idol-slots-v3', SLOT_N = 5;
let S = null, setupSel = {major:'biz', origin:'office', regret:'work'};
const $ = id => document.getElementById(id);
// 대본 속 기본 이름 '서윤'을 플레이어가 정한 이름으로(받침에 맞춰 조사도 바꾼다)
const DEF_NAME = '서윤';
const NAME_JOSA = [['이에요', '예요'], ['이었', '였'], ['이야', '야'], ['이나', '나'], ['이랑', '랑'], ['이라', '라'], ['이가', '가'], ['이는', '는'], ['이를', '를'], ['이의', '의'], ['이도', '도'], ['이만', '만'], ['이한테', '한테'], ['이에게', '에게'], ['으로', '로'], ['은', '는'], ['을', '를'], ['과', '와'], ['아', '야'], ['이', '가']];
function heroName(t){
  if(typeof S === 'undefined' || !S || !S.name || S.name === DEF_NAME || t.indexOf(DEF_NAME) < 0) return t;
  const n = S.name, c = n.charCodeAt(n.length - 1), has = c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 !== 0;
  return t.replace(/서윤(이에요|이었|이야|이나|이랑|이라|이가|이는|이를|이의|이도|이만|이한테|이에게|으로|은|을|과|아(?![가-힣])|이(?![가-힣]))?/g, (m, j) => {
    if(!j) return n; const r = NAME_JOSA.find(x => x[0] === j); return n + (has ? j : r[1]); });
}
const esc = s => heroName(String(s)).replace(/[&<>]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;'}[c]));
const PLACE_ICON = {rain:'🌧️', shop:'⏳', night:'🌙', campus:'🎓', city:'🏙️', cafe:'☕', room:'🏠'};
const PLACE_IMG = {shop:'art/bg_shop.webp', rain:'art/bg_alley.webp'}, PLACE_POS = {rain:'50% 50%', shop:'50% 40%'};
const heroKey = S => S.m < 24 ? 'age20' : S.m < 48 ? 'age22' : S.m < 72 ? 'age25' : S.m < 96 ? 'age27' : 'age30';
// 계절마다 옷·머리·배경이 다른 주인공 그림 (봄은 기본 그림). 빌드 때 art/ 에 있는 계절 그림 목록이 들어온다.
const HERO_SEASONAL = new Set(__HERO_SEASONAL__);
const CUT_OUTFIT = new Set(__CUT_OUTFIT__); // art/cut/<인물>_<work|home>_<a|b>.webp: 상황별 옷차림 누끼
// 상황에 맞는 옷: 집이면 홈웨어(home), 졸업 뒤 사무실·카페 같은 일터 장면이면 직업 차림(work), 그 밖엔 평상복
function cutOutfit(ev, id){
  if(ev.outfit !== undefined) return ev.outfit;
  if(!LOVERS[id]) return S && S.m >= 48 && ['soyeon', 'jisu', 'taeyun'].includes(id) ? 'w' : ''; // 친구들도 졸업 뒤엔 서른 안팎의 직장인 모습

  const im0 = Array.isArray(ev.img) ? ev.img[0] : ev.img, im = String(im0 || '');
  if(ev.place === 'room' || /bg_room/.test(im)) return 'home';
  if(S && S.m >= 48 && (/office/.test(im) || (ev.place === 'cafe' && !/\/(lv_|cover)/.test(im)))) return 'work';
  return '';
}
const cutSrc = (ev, id, v) => { const o = cutOutfit(ev, id); return o && CUT_OUTFIT.has(`${id}_${o}_${v}`) ? `art/cut/${id}_${o}_${v}.webp` : `art/cut/${id}_${v}.webp`; };
const END_ART = new Set(__END_ART__); // art/end_<엔딩id>.webp: 엔딩별 일러스트
const endArt = (id, e) => e && e.track && END_ART.has('end_job_' + e.track) ? `art/end_job_${e.track}.webp` : END_ART.has('end_' + id) ? `art/end_${id}.webp` : END_ART.has('end_job_' + ({free_creator:'pd', free_style:'stylist', free_tech:'dev', free_actor:'actor', free_lawyer:'lawyer'}[id])) ? `art/end_job_${{free_creator:'pd', free_style:'stylist', free_tech:'dev', free_actor:'actor', free_lawyer:'lawyer'}[id]}.webp` : `art/${e.free ? 'age30' : 'cover'}.webp`;
const DONE_KEY = 'rewind-ten-complete-v1'; // 시계를 놓아주고 끝낸 엔딩(완결 표시)
const ENDVAR_KEY = 'rewind-ten-endvar-v1'; // 직업군 엔딩에서 마지막으로 본 직업(도감 표시용)
const endVarOf = id => { const m = store(ENDVAR_KEY) || {}; const t = m[id]; return t && CAREER_VAR[t] && CAREER_END[t] === id ? Object.assign({}, ENDINGS[id], CAREER_VAR[t], {track:t}) : ENDINGS[id]; };
const HERO_JOB = new Set(__HERO_JOB__); // art/age<나이>_<직업>.webp: 직업별 차림의 주인공
const HERO_RIPE = new Set(__HERO_RIPE__); // 첫날밤 이후 달라진 분위기(눈빛·화장)의 주인공
const DATE_ART = new Set(__DATE_ART__); // art/dt_<연인>_<번호>.webp (데이트 일러스트)
const ripeNow = S => !!S && Object.values(S.love || {}).some(v => v && v.intimate);
const heroImg = S => { const k = heroKey(S); if(isIdol(S) && HERO_JOB.has(`${k}_actor`)) return `art/${k}_actor.webp`; if(!isIdol(S) && HERO_JOB.has(`${k}_trainee`)) return `art/${k}_trainee.webp`; if(HERO_RIPE.has(k) && ripeNow(S)) return `art/${k}_ripe.webp`; const se = typeof seasonOf === 'function' ? seasonOf(S) : 'spring', f = `${k}_${se}`; return `art/${se !== 'spring' && HERO_SEASONAL.has(f) ? f : k}.webp`; };
// 이벤트 결과의 칩으로 표정을 고른다
function faceFor(ch){ let up = 0, down = 0, tired = false; for(const c of ch || []){ if(c.label === '스트레스' ? c.d > 3 : c.label === '체력' && c.d < -3) tired = true; if(c.label in PILLAR || c.label === '기억 선명도') (c.d > 0 ? up += c.d : down -= c.d); }
  return tired ? 'tired' : down > up + 1 ? 'sad' : up >= 4 ? 'happy' : up > 0 ? 'shy' : 'determined'; }
// 연애 인물의 표정: 이번 선택으로 바뀐 호감도에 따라 (happy·shy·tender·surprised·serious·sad)
function loverFace(id, ch){ const lv = LOVERS[id]; const c = (ch || []).find(x => lv && x.label === lv.name + ' 호감'); const d = c ? c.d : 0;
  return d >= 8 ? 'happy' : d >= 3 ? 'shy' : d > 0 ? 'tender' : d <= -6 ? 'sad' : d < 0 ? 'serious' : 'surprised'; }
const faceImg = (ch, lover) => lover && LOVERS[lover] ? `<img class="face" src="art/face_${lover}_${loverFace(lover, ch)}.webp" alt="" onerror="this.src='art/lv_${lover}.webp'">` : `<img class="face" src="art/face_${faceFor(ch)}.webp" alt="" onerror="this.style.display='none'">`;
function store(k, v){ try{ if(v === undefined) return JSON.parse(localStorage.getItem(k)); if(v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); }catch(e){ return null; } }
function save(){ if(S) store(SAVE_KEY, S); }
// 아이폰은 화면 맨 아래(홈 인디케이터 뒤)를 페이지 배경색으로 칠한다. 화면마다 그 색을 아래쪽 색과 맞춘다
const EDGE = {title:'#f6f8fc', setup:'#e7ecee', game:'#ffffff', card:'#f6f8f9', end:'#f6f8f9'};
function paintEdge(id){ const c = EDGE[id] || '#1d2350'; document.documentElement.style.background = c; document.body.style.background = c; const m = document.querySelector('meta[name=theme-color]'); if(m) m.setAttribute('content', c); }
function show(id){ document.querySelectorAll('.screen').forEach(e => e.classList.toggle('on', e.id === id)); window.scrollTo(0, 0); paintEdge(id); }
function openSheet(html){ $('sheet').innerHTML = html; $('ov').classList.add('on'); $('sheet').scrollTop = 0; }
function closeSheet(){ $('ov').classList.remove('on'); }
const chipHTML = ch => (ch || []).filter(c => Math.abs(c.d) >= 0.05).map(c => `<span class="chip ${c.d > 0 ? (c.label === '스트레스' ? 'down' : 'up') : (c.label === '스트레스' ? 'up' : 'down')}">${esc(c.label)} ${c.d > 0 ? '+' : ''}${c.money ? fmtMoney(c.d) : (Math.abs(c.d) < 1 ? c.d.toFixed(1) : Math.round(c.d))}</span>`).join('');

// ── 타이틀·시작 설정(한 화면에 질문 하나씩) ─────────────────────
const WIZ = [
  {key:'name',   q:'이름을 알려 주세요', p:'스무 살로 돌아가는 사람의 이름이에요.'},
  {key:'major',  q:'어떤 포지션을 꿈꾸나요?', p:'포지션에 따라 시작 능력치가 달라져요.', list:() => MAJORS, cols:2},
  {key:'origin', q:'꿈을 접은 마흔의 나는 무슨 일을 했나요?', p:'되감기 전의 경력이 타고난 강점이 돼요.', list:() => ORIGINS, cols:1},
  {key:'regret', q:'가장 후회하는 건 무엇인가요?', p:'그 후회가 이번 생의 출발점이에요.', list:() => REGRETS, cols:1},
];
let wizStep = 0, wizName = '서윤';
const fxTags = fx => Object.keys(fx).map(k => `<i class="up">${LABEL[k] || k} +${fx[k]}</i>`).join('');
function initTitle(){
  const sv = store(SAVE_KEY); $('b-cont').style.display = sv && !sv.ending ? 'flex' : 'none'; $('b-slots').style.display = getSlots().some(Boolean) ? 'flex' : 'none';
  $('b-slots').onclick = () => showSlots(false);
  $('b-new').onclick = () => { wizStep = 0; renderWiz(); show('setup'); };
  $('b-cont').onclick = () => { S = store(SAVE_KEY); if(S){ show('game'); render(); } };
  $('w-back').onclick = () => { if(wizStep > 0){ wizStep--; renderWiz(); } else show('title'); };
  $('w-next').onclick = () => {
    if(wizStep === 0){ const v = $('in-name') && $('in-name').value.trim(); if(v) wizName = v; }
    if(wizStep < WIZ.length - 1){ wizStep++; renderWiz(); return; }
    S = newGame(wizName || '서윤', setupSel.origin, setupSel.regret, setupSel.major);
    save(); show('game'); render(); startFlow();
  };
}
function renderWiz(){
  const st = WIZ[wizStep];
  $('w-dots').innerHTML = WIZ.map((_, i) => `<i class="${i <= wizStep ? 'on' : ''}"></i>`).join('');
  $('w-q').innerHTML = `<div class="eyebrow">STEP ${wizStep + 1} / ${WIZ.length}</div><h2>${esc(st.q)}</h2><p class="sub">${esc(st.p)}</p>`;
  if(st.key === 'name'){
    $('w-body').innerHTML = `<input type="text" id="in-name" maxlength="6" value="${esc(wizName)}" autocomplete="off" aria-label="이름"><p class="sub" style="text-align:center;margin-top:12px">여섯 글자까지 쓸 수 있어요.</p>`;
  } else {
    const items = st.list();
    $('w-body').innerHTML = `<div class="cards${st.cols}">` + items.map(o => {
      const extra = st.key === 'major' ? `<span class="ds">어울리는 직업 · ${o.fav.map(c => CAREERS[c].name).join(', ')}</span>` : '';
      const body = `<b>${o.name}</b><span class="ds">${o.desc}</span>${extra}<span class="tg">${fxTags(o.fx)}</span>`;
      return `<button class="opt ${setupSel[st.key] === o.id ? 'sel' : ''}" data-id="${o.id}"><span class="ic">${o.icon}</span>${st.cols === 1 ? `<span>${body}</span>` : body}</button>`;
    }).join('') + '</div>';
    document.querySelectorAll('#w-body .opt').forEach(b => b.onclick = () => { setupSel[st.key] = b.dataset.id; document.querySelectorAll('#w-body .opt').forEach(x => x.classList.toggle('sel', x === b)); });
  }
  $('w-next').textContent = wizStep === WIZ.length - 1 ? '약을 마신다 🧪' : '다음';
  $('w-body').scrollTop = 0;
}

// ── 메인 화면 ─────────────────────────────────────────────────
// 활동이 올려 주는 것을 미리 보여 주는 태그 (고르기 전에 알 수 있게)
function actTags(S, id, max){
  const a = ACTS[id]; let eff = a.eff || {}, pay = a.pay, hp = a.hp || 0, st = a.stress || 0;
  if(id === 'job' && S.hired){ const j = jobOf(S); eff = j.eff; pay = payOf(S); hp = -j.hp; st = j.stress; }
  if(id === 'intern' && CAREERS[S.interest]) eff = Object.assign({}, eff, CAREERS[S.interest].eff);
  const out = [], ent = Object.entries(eff).filter(([k, v]) => v > 0 && LABEL[k]).sort((x, y) => y[1] - x[1]);
  for(const [k] of ent.slice(0, 3)) out.push({t:LABEL[k] + '▲', c:'up'});
  if(pay) out.push({t:'수입', c:'pay'});
  if(hp > 0) out.push({t:'체력▲', c:'up'}); else if(hp <= -8) out.push({t:'체력▼', c:'down'});
  if(st < 0) out.push({t:'스트레스▼', c:'up'}); else if(st >= 7) out.push({t:'스트레스▲', c:'down'});
  if(id === 'future') out.push({t:'선명도▼', c:'down'});
  if(a.cost) out.push({t:`-${a.cost}만`, c:'down'});
  return max ? out.slice(0, max) : out;
}
// 부족한 축과 몸 상태를 보고 이번 달 계획을 추천 (고민 줄이기)
function autoPlan(){
  const ok = (id, idx) => { const a = ACTS[id]; return !!a && !(a.req && a.req(S)) && (!a.cost || a.cost <= S.cash) && (a.slots || 1) <= 3 - idx; };
  const P = {work:S.work, bond:S.bond, self:S.self}, low = Object.keys(P).sort((x, y) => P[x] - P[y]);
  const pools = {work:isIdol(S) ? ['musicshow', 'vocal', 'dance', 'variety', 'fansign'] : isOut(S) ? ['reaudition', 'vocal', 'dance'] : ['vocal', 'dance', 'stage', 'vocal', 'dance', 'write'],
    bond:['friends', 'family', 'live', dateTarget(S) ? 'date' : 'friends'], self:['journal', 'exercise', 'hobby', 'style']};
  const picks = [];
  if(S.hp < 30 || S.stress > 75) picks.push('rest');
  if(S.cash < 80) picks.push(ok('cf', 0) ? 'cf' : 'cafe');
  for(let r = 0; r < 3; r++) for(const k of low) picks.push(pools[k][(S.m + r * 2 + low.indexOf(k)) % pools[k].length]);
  const plan = [null, null, null]; let i = 0;
  for(const id of picks){ if(i > 2) break; if(ok(id, i)){ plan[i] = id; const sl = ACTS[id].slots || 1; if(sl === 2) plan[i + 1] = '>'; i += sl; } }
  while(i <= 2){ plan[i++] = 'rest'; }
  return plan;
}
const ICONS = {
  gear:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/></svg>',
  phone:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
  stats:'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 20V12M10 20V6M15 20v-9M20 20V9"/></svg>',
  company:'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M3 21V9l6-3v15M9 21V3l12 4v14M3 21h18"/><path d="M13 9h4M13 13h4M13 17h4"/></svg>',
  dex:'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-3a3 3 0 0 0-3 3"/><path d="M17 4v9l1.5-1.2L20 13V4"/></svg>',
  chat:'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/><circle cx="10" cy="10.5" r="1" fill="currentColor"/><circle cx="10" cy="13.5" r="1" fill="currentColor"/></svg>',
  edu:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/></svg>',
  work:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18"/></svg>',
  home:'<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
  money:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5c0-1.2 1.2-2 2.5-2s2.5.8 2.5 2-1.2 1.7-2.5 2-2.5.8-2.5 2 1.2 2 2.5 2 2.5-.8 2.5-2"/></svg>',
  rest:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>',
  self:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/></svg>',
  shop:'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M5 8h14l-1.2 11H6.2zM9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  heart:'<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.5 1.1 4.3 2.4h2c.8-1.3 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>',
};
function paintIcons(){ document.querySelectorAll('[data-icon]').forEach(el => { if(!el.dataset.painted){ el.innerHTML = ICONS[el.dataset.icon] || ''; el.dataset.painted = '1'; } }); }
function ring(v, color, label){ const r = 17, c = 2 * Math.PI * r, f = clamp(v, 0, 100) / 100; return `<svg viewBox="0 0 46 46" aria-label="${label} ${Math.round(v)}"><circle cx="23" cy="23" r="${r}" fill="none" stroke="#dde3f2" stroke-width="5"/><circle cx="23" cy="23" r="${r}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(c * f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 23 23)"/><text x="23" y="27.5" text-anchor="middle" font-size="12.5" font-weight="800" fill="#14181B">${Math.round(v)}</text></svg>`; }
// 하단 탭 → 활동 분류. 가운데 '홈'은 스케줄 시트를 연다
// 스케줄 분류 이름(화면에 보이는 말). 안쪽 키(공부·일·돈…)는 그대로 두고 보이는 이름만 바꾼다.
const CAT_LABEL = {'연습':'연습', '활동':'활동', '공부':'배움', '일':'커리어', '돈':'머니', '관계':'인연', '나':'셀프케어', '휴식':'휴식', '캠퍼스':'캠퍼스', '홈':'홈'};
const catLabel = c => CAT_LABEL[c] || c;
const TABS = [{cat:'연습', ic:'edu'}, {cat:'활동', ic:'work'}, {cat:'돈', ic:'money'}, {cat:'홈', ic:'home', home:true}, {cat:'휴식', ic:'rest'}, {cat:'나', ic:'self'}, {cat:'관계', ic:'heart'}];
let pickCat = null, activeSlot = 0;
function firstEmpty(){ const i = S.plan.findIndex(x => !x); return i < 0 ? 0 : i; }
function weakest(){ const P = {work:S.work, bond:S.bond, self:S.self}; return Object.keys(P).sort((a, b) => P[a] - P[b])[0]; }
function adviceText(){
  if(S.m === 0 && !S.seen.advice0) return {t:'오늘부터 연습생이야. 한 달에 활동 세 칸, 매달 말엔 월말평가가 있어. 실력·관계·마음, 세 기둥을 모두 50 위로 올려야 \'자유 시계\'가 열려. 아래 탭에서 활동을 골라 봐.'};
  if(S.hp < 30) return {t:'몸이 먼저야. 체력이 바닥이면 번아웃이 와. 이번 달엔 휴식 한 칸을 꼭 넣어.'};
  if(S.stress > 75) return {t:'스트레스가 너무 높아. 쉬거나 취미로 풀지 않으면 한 달을 통째로 날릴 수 있어.'};
  if(S.cash < 60) return {t:isIdol(S) ? '통장이 비어 간다. 데뷔 초엔 정산이 없어. 광고나 화보로 버텨 보자.' : '통장이 비어 간다. 빚이 300만 원을 넘으면 끝이야. 아르바이트로 조금씩 채워 둬.'};
  const w = weakest(), msg = {work:'실력 기둥이 가장 약해. ' + (isIdol(S) ? '음악방송과 예능, 연습에 칸을 더 써 보자.' : isOut(S) ? '오디션 재도전과 연습을 멈추지 마.' : '보컬·댄스 연습으로 월말평가를 준비하자.'), bond:'관계 기둥이 약해. 친구, 가족, 마음에 둔 사람과 시간을 보내 봐. 전화도 좋아.', self:'마음 기둥이 약해. 일기, 취미, 체력 훈련으로 나를 돌보는 시간이 필요해.'};
  return {t:msg[w]};
}
function showDialog(){ const a = adviceText(); $('dlg-head').textContent = '일흔의 나'; $('dlg-body').textContent = a.t; $('dialog').hidden = false; if(S.m === 0) S.seen.advice0 = true; }
function render(){
  if(!S) return;
  const left = TOTAL_MONTHS - S.m, img = heroImg(S);
  $('scene').style.setProperty('--scene-bg', `url(${img})`); $('g-img').src = img;
  $('hud-avatar').style.backgroundImage = `url(${img})`;
  $('tb-date').textContent = `${yearOf(S)}년 ${monthOf(S)}월`;
  $('hud-age').innerHTML = `${ageOf(S)}세${S.round > 1 ? ` · ${S.round}회차` : ''}<br>${left}개월 남음`;
  $('hud-prog').style.width = (100 * S.m / TOTAL_MONTHS) + '%';
  const jobLine = idolStatusLine(S);
  $('tb-sub').textContent = `${S.name} · ${jobLine}`;
  const chip = (i, label, v, warn) => `<div class="res"><i>${i}</i><span>${label}</span><b class="${warn ? 'warn' : ''}">${v}</b></div>`;
  $('hud-res').innerHTML = chip('₩', '자금', fmtMoney(S.cash), S.cash < 60) + chip('◈', '선명도', Math.round(S.clarity), S.clarity < 25) + (S.borrowed ? chip('빌', '빌린 인생', S.borrowed, true) : '') + chip('☎', '통화', callsLeft(S) + '회', false) + chip('⏳', `${chapterOf(S)}장`, `조각 ${SS(S).pieces}/10`, false);
  $('g-hp').innerHTML = ring(S.hp, '#4cc25a', '체력'); $('g-st').innerHTML = ring(S.stress, '#ff6a4d', '스트레스');
  $('call-badge').textContent = callsLeft(S) || '';
  const campusOn = false, fcp = $('fab-cp'); // 재학 중에는 캠퍼스 산책, 졸업하면 도시 산책
  if(fcp){ fcp.dataset.sheet = campusOn ? 'campus' : 'city'; $('fab-cp-lb').textContent = campusOn ? `캠퍼스 ${cpLeft(S)}/${CAMPUS_VISITS}` : `도시 ${cpLeft(S)}/${CAMPUS_VISITS}`; const ic = $('fab-cp-ic'); ic.innerHTML = ICONS[campusOn ? 'edu' : 'home'] || ''; ic.dataset.painted = '1'; }
  const full = !S.plan.some(x => !x);
  $('slots3').innerHTML = [0, 1, 2].map(i => {
    const id = S.plan[i];
    if(id === '>') return `<button class="slot3 cont" disabled><small>${SLOT_NAMES[i]}</small><b>↳ 이어서</b></button>`;
    if(!id) return `<button class="slot3 ${i === activeSlot ? 'active' : ''}" data-i="${i}"><small>${SLOT_NAMES[i]}</small><b>＋ 비어 있음</b></button>`;
    const who = id === 'date' && S.dateTo && S.dateTo[i] && LOVERS[S.dateTo[i]] ? ' · ' + LOVERS[S.dateTo[i]].name : (id === 'jobhunt' && S.hired && S.jobTo && S.jobTo[i] && CAREERS[S.jobTo[i].id] ? ' · ' + CAREERS[S.jobTo[i].id].name : '');
    return `<button class="slot3 filled ${i === activeSlot ? 'active' : ''}" data-i="${i}"><small>${SLOT_NAMES[i]}</small><b>${ACTS[id].icon} ${actName(S, id)}${who}</b></button>`;
  }).join('');
  document.querySelectorAll('.slot3[data-i]').forEach(b => b.onclick = () => openPicker(+b.dataset.i));
  const go = $('btn-go'); go.textContent = full ? '이번 달 시작' : '스케줄 정하기'; go.classList.toggle('ready', full);
  $('tabbar').innerHTML = TABS.map(t => `<button class="tb ${t.home ? 'home' : ''}" data-cat="${t.cat}"><span class="ic" data-icon="${t.ic}"></span><span>${catLabel(t.cat)}</span></button>`).join('');
  document.querySelectorAll('.tb').forEach(b => b.onclick = () => openPicker(firstEmpty(), b.dataset.cat === '홈' ? null : b.dataset.cat));
  paintIcons();
  if($('dialog').dataset.m !== String(S.m)){ $('dialog').dataset.m = S.m; $('dialog').hidden = true; }
}
function setPlan(i, id){
  const p = S.plan; if(S.dateTo) S.dateTo[i] = null; if(S.jobTo) S.jobTo[i] = null;
  const clear = j => { if(p[j] === '>'){ p[j] = null; if(p[j - 1] && ACTS[p[j - 1]] && ACTS[p[j - 1]].slots === 2) p[j - 1] = null; } else if(p[j] && ACTS[p[j]].slots === 2){ p[j] = null; p[j + 1] = null; } else p[j] = null; };
  clear(i); const a = ACTS[id];
  if(a.slots === 2){ clear(i + 1); p[i] = id; p[i + 1] = '>'; } else p[i] = id;
}
const sheetHead = (t, sub) => `<div class="sh-head"><b>${t}</b><button class="sh-x" id="x" aria-label="닫기">×</button></div>${sub ? `<div class="sub" style="margin-bottom:8px">${sub}</div>` : ''}`;
// 데이트 상대 고르기: 여러 명을 동시에 만날 수 있다. 공식 연인이 있는데 다른 사람을 고르면 몰래 만나는 것
function chooseDate(slot, ts, done, back){
  const off = officialOf(S);
  const rows = ts.sort((a, b) => S.love[b].aff - S.love[a].aff).map(id => { const lv = LOVERS[id], v = S.love[id], secret = off && off !== id;
    return `<button class="lcard" data-id="${id}"><img class="av" src="art/face_${id}_happy.webp" alt="" onerror="this.src='art/lv_${id}.webp'"><span><b>${esc(lv.name)}</b><small>${loveStatus(S, id)}${secret ? ' 🤫' : ''} · 호감 ${Math.round(v.aff)}</small><div class="hb"><i style="width:${clamp(v.aff, 0, 100)}%"></i></div></span><span class="cb">💞</span></button>`; }).join('');
  openSheet(sheetHead('누구와 데이트할까요?', `${SLOT_NAMES[slot]} 칸 · 여러 명을 동시에 만날 수도 있어요`) + rows);
  $('x').onclick = () => { back(); };
  document.querySelectorAll('#sheet .lcard').forEach(b => b.onclick = () => done(b.dataset.id));
}
// 이직: 어떤 직업, 어떤 회사에 도전할지 직접 고른다
function chooseJob(slot, done, back){
  const list = jobChoices(S);
  const rows = list.map(id => { const c = CAREERS[id], p = fitJob(S, id, null);
    return `<button class="lcard" data-id="${id}"><span class="av" style="display:grid;place-items:center;font-size:26px;background:var(--paper-2)">${c.icon}</span><span><b>${esc(c.name)}${c.adv ? ' ★' : ''}</b><small>${esc(c.desc)}</small><small class="lk">${fitLabel(p)} · 기본 월급 ${c.pay}만</small></span><span class="cb">›</span></button>`; }).join('');
  openSheet(sheetHead('어디로 이직할까요?', `${SLOT_NAMES[slot]} 칸 · 지금: ${CAREERS[S.track].name} (${coName(S)})`) + rows + `<div class="foot">★ 전환 직업은 관련 경력이 있어야 해요. 회사는 다음 화면에서 골라요.</div>`);
  $('x').onclick = () => back();
  document.querySelectorAll('#sheet .lcard').forEach(b => b.onclick = () => chooseCompany(slot, b.dataset.id, done, () => chooseJob(slot, done, back)));
}
function chooseCompany(slot, id, done, back){
  const c = CAREERS[id], cl = companyList(id);
  const rows = cl.map(co => { const p = fitJob(S, id, co);
    return `<button class="lcard" data-i="${co.idx}"><span class="av" style="display:grid;place-items:center;font-size:12px;font-weight:800;background:var(--paper-2);color:var(--indigo)">${co.t}</span><span><b>${esc(co.name)}</b><small>예상 월급 약 ${Math.round(c.pay * co.pay)}만 · ${co.t === '스타트업' ? '승진이 빠르고 연봉은 낮은 편' : co.t === '대기업' ? '안정적이지만 경쟁이 치열' : '무난한 중간 규모'}</small><small class="lk">${fitLabel(p)}</small></span><span class="cb">›</span></button>`; }).join('');
  openSheet(sheetHead(`${c.icon} ${c.name} · 어느 회사에 지원할까요?`, '합격하면 연봉 협상 자리가 열려요.') + rows);
  $('x').onclick = () => back();
  document.querySelectorAll('#sheet .lcard').forEach(b => b.onclick = () => done({id, idx:+b.dataset.i}));
}
// 캠퍼스 지도: 장소 핀 위치(가로·세로 %)는 art/cp_map.webp 의 구역 배치에 맞춘다
const CP_PIN = {class:[25, 17], library:[76, 17], shop:[30, 46], club:[78, 44], field:[27, 76], garden:[78, 79]};
const cpMapHTML = () => `<div class="cpmap" style="background-image:url(art/cp_map.webp)">${Object.keys(CAMPUS_PLACES).map(k => { const p = CAMPUS_PLACES[k], pos = CP_PIN[k]; return `<button class="cpin" data-pin="${k}" style="left:${pos[0]}%;top:${pos[1]}%"><i>${p.icon}</i><b>${p.name}</b></button>`; }).join('')}</div>`;
// 스케줄을 정하기 전에 교정을 돌아다닌다: 한 달에 3번(스케줄 칸을 쓰지 않는다)
function showCampus(){
  const left = cpLeft(S), dots = Array.from({length:CAMPUS_VISITS}, (_, i) => `<i class="${i < left ? 'on' : ''}"></i>`).join('');
  openSheet(sheetHead('캠퍼스 산책', '스케줄을 하기 전에 장소를 돌아다니며 친구나 마음 가는 사람을 만나요.') + `<div class="cpleft"><span>이번 달 남은 방문</span><span class="dots">${dots}</span><b>${left}/${CAMPUS_VISITS}</b></div>` + cpMapHTML() + `<div class="cphint">${left ? '가고 싶은 장소를 눌러 보세요.' : '이번 달 방문을 모두 썼어요. 다음 달에 다시 돌아다닐 수 있어요.'}</div>`);
  $('x').onclick = () => { closeSheet(); render(); };
  document.querySelectorAll('.cpin').forEach(b => b.onclick = () => visitCampus(b.dataset.pin));
}
let visiting = false;
async function visitCampus(key){
  if(visiting) return; if(cpLeft(S) <= 0){ toast('이번 달 방문을 다 썼어요 (3/3)'); return; }
  visiting = true; closeSheet();
  try{
    const out = campusVisit(S, key); // 팝업 없이 바로 그 장소에서 누굴 만났는지, 대화가 나온다
    if(out.enc && !S.ending){ await playEvent(out.enc); }
    save(); render();
  } finally { visiting = false; }
  showCampus();
}
// ───── 도시 산책(졸업 뒤): 지도에서 장소를 고르면 사람을 만나고, 취업했다면 쇼핑도 한다 ─────
const CT_PIN = {office:[14, 15], cinema:[50, 17], museum:[84, 17], mall:[18, 48], beauty:[80, 47], books:[15, 77], river:[52, 67], night:[86, 85]};
const ctMapHTML = () => `<div class="cpmap ctmap" style="background-image:url(art/ct_map.webp)">${CITY_KEYS.map(k => { const p = CITY_PLACES[k], pos = CT_PIN[k], n = cityRecommend(S, k).length, side = pos[0] < 26 ? ' l' : pos[0] > 74 ? ' r' : ''; return `<button class="cpin${side}" data-pin="${k}" style="left:${pos[0]}%;top:${pos[1]}%"><i>${p.icon}</i><b>${p.name}</b>${n ? `<em>${n}</em>` : ''}</button>`; }).join('')}</div>`;
function showCity(){
  const left = cpLeft(S), dots = Array.from({length:CAMPUS_VISITS}, (_, i) => `<i class="${i < left ? 'on' : ''}"></i>`).join('');
  const rows = CITY_KEYS.map(k => { const p = CITY_PLACES[k], rec = cityRecommend(S, k).slice(0, 3).map(i => LOVERS[i].name).join('·');
    return `<div class="ctrow"><button class="ctgo" data-go="${k}"><i>${p.icon}</i><span><b>${p.name}</b><small>${rec ? `💗 ${rec}` : p.desc}</small></span></button>${S.hired ? `<button class="ctshop" data-shop="${k}">🛒</button>` : ''}</div>`; }).join('');
  openSheet(sheetHead('도시 산책', '졸업한 뒤엔 시내를 돌아다녀요. 💗 표시는 그곳을 좋아하는 사람이에요.') + `<div class="cpleft"><span>이번 달 남은 방문</span><span class="dots">${dots}</span><b>${left}/${CAMPUS_VISITS}</b></div>` + ctMapHTML() + `<div class="ctrows">${rows}</div><button class="act" id="ct-dex" style="margin-top:6px"><span class="top"><span class="ic">📖</span><b>엔딩 도감</b></span></button>`);
  $('x').onclick = () => { closeSheet(); render(); };
  document.querySelectorAll('.cpin').forEach(b => b.onclick = () => visitCity(b.dataset.pin));
  document.querySelectorAll('.ctgo').forEach(b => b.onclick = () => visitCity(b.dataset.go));
  document.querySelectorAll('.ctshop').forEach(b => b.onclick = () => showCityShop(b.dataset.shop));
  $('ct-dex').onclick = showDex;
}
async function visitCity(key){
  if(visiting) return; if(cpLeft(S) <= 0){ toast('이번 달 방문을 다 썼어요 (3/3)'); return; }
  visiting = true; closeSheet();
  try{
    const out = cityVisit(S, key);
    if(out.enc && !S.ending){ await playEvent(out.enc); }
    save(); render();
  } finally { visiting = false; }
  showCity();
}
function showCityShop(place){
  const p = CITY_PLACES[place], comp = cityCompanion(S), items = CITY_SHOP[place] || [];
  const rows = items.map(it => { const poor = S.cash < it.price, full = it.item && owned(S, it.item) >= (ITEMS[it.item].stack || 1), need = it.who && !comp;
    return `<button class="act" data-id="${it.id}" ${poor || full || need ? 'disabled' : ''}><span class="top"><span class="ic">${it.icon}</span><b>${it.name}</b></span><span class="em">${it.price}만원${full ? ' · 보유' : need ? ' · 함께할 사람 없음' : ''}</span><span class="d">${it.desc}</span></button>`; }).join('');
  openSheet(sheetHead(`${p.icon} ${p.name} 쇼핑`, `자금 ${fmtMoney(S.cash)}${comp ? ` · 함께: ${LOVERS[comp].name}` : ''}`) + `<div class="acts">${rows}</div>`);
  $('x').onclick = () => showCity();
  document.querySelectorAll('#sheet .act[data-id]').forEach(b => b.onclick = () => { const r = cityBuy(S, place, b.dataset.id); if(r){ toast(r); return; } save(); toast(S._shopNote || '구입!'); render(); showCityShop(place); });
}
function openPicker(i, cat){
  activeSlot = i;
  if(S.plan[i] === '>') i = activeSlot = i - 1;
  if(cat) pickCat = cat; else if(!pickCat || !cat){ const lowK = weakest(); pickCat = {work:S.m < 48 ? '공부' : '일', bond:'관계', self:'나'}[lowK]; }
  const cats = ACTS_ORDER_CATS.filter(c => Object.values(ACTS).some(a => a.cat === c));
  if(!cats.includes(pickCat)) pickCat = cats[0];
  const draw = () => {
    const ids = Object.keys(ACTS).filter(id => ACTS[id].cat === pickCat).map(id => {
      const a = ACTS[id]; let why = a.req ? a.req(S) : null; if(!why && a.cost && a.cost > S.cash) why = '자금이 모자라요'; if(!why && (a.slots || 1) > 3 - activeSlot) why = '이 칸에서는 못 해요 (2칸 필요)';
      return {id, a, why};
    }).sort((x, y) => (x.why ? 1 : 0) - (y.why ? 1 : 0));
    const spend = S.plan.reduce((t, id) => t + (id && id !== '>' && ACTS[id].cost || 0), 0);
    openSheet(sheetHead(`${yearOf(S)}년 ${monthOf(S)}월 ${SLOT_NAMES[activeSlot]} · ${catLabel(pickCat)}`) + `<div class="tabs">${cats.map(c => `<button class="tab ${c === pickCat ? 'on' : ''}" data-c="${c}">${catLabel(c)}</button>`).join('')}</div><div class="planbar"><button class="btn ghost sm" id="b-auto">✨ 추천 계획</button><button class="btn ghost sm" id="b-prev" ${S.lastPlan ? '' : 'disabled'}>↻ 지난달처럼</button></div><div class="acts">` + ids.map(({id, a, why}) => {
      const pay = id === 'job' && S.hired ? jobOf(S).pay : a.pay;
      const em = [pay ? `+${Math.round(pay * earnedMult(S))}만` : '', a.slots > 1 ? '2칸' : ''].filter(Boolean).join(' · ');
      return `<button class="act ${S.plan[activeSlot] === id ? 'on' : ''}" data-id="${id}" ${why ? 'disabled' : ''}><span class="top"><span class="ic">${a.icon}</span><b>${actName(S, id)}</b></span>${em ? `<span class="em">${em}</span>` : ''}${why ? `<span class="why">${why}</span>` : `<span class="d">${id === 'date' && S.married ? '불 꺼진 침실에서 배우자와 보내는 밤. 키스한다 · 볼을 만진다 · 어루만진다, 원하는 만큼만.' : id === 'club' && grad(S) ? '퇴근 후 와인 모임·러닝 크루·독서 모임. 회사 밖에서 새로운 사람을 만난다.' : a.desc}</span><span class="tg">${actTags(S, id).map(t => `<i class="${t.c}">${t.t}</i>`).join('')}</span>`}</button>`;
    }).join('') + `</div><div class="foot">이번 달 활동비 ${spend}만 · 생활비 ${idolCost(S)}만${momAllowance(S) ? ` (엄마 용돈 +${momAllowance(S)}만)` : ''}${idolIncome(S) ? ` · 정산 +${idolIncome(S)}만` : ''}</div>`);
    $('x').onclick = () => { closeSheet(); render(); };
    $('b-auto').onclick = () => { S.plan = autoPlan(); assignDates(); save(); closeSheet(); render(); };
    $('b-prev').onclick = () => { if(S.lastPlan){ S.plan = S.lastPlan.slice(); save(); closeSheet(); render(); } };
    document.querySelectorAll('.tab').forEach(b => b.onclick = () => { pickCat = b.dataset.c; draw(); });
    { const tb = document.querySelector('.tabs'), on = tb && tb.querySelector('.tab.on'); if(on) tb.scrollLeft = on.offsetLeft - (tb.clientWidth - on.offsetWidth) / 2; }
    const placed = () => { save(); const nx = S.plan.findIndex(x => !x); if(nx < 0){ closeSheet(); render(); } else { activeSlot = nx; render(); draw(); } };
    document.querySelectorAll('.act').forEach(b => b.onclick = () => {
      const id = b.dataset.id, slot = activeSlot, ts = id === 'date' ? dateTargets(S) : [];
      if(ts.length > 1 && !S.married){ chooseDate(slot, ts, who => { setPlan(slot, 'date'); S.dateTo = S.dateTo || []; S.dateTo[slot] = who; placed(); }, draw); return; }
      if(id === 'jobhunt' && S.hired){ chooseJob(slot, pick => { setPlan(slot, 'jobhunt'); S.jobTo = S.jobTo || []; S.jobTo[slot] = pick; placed(); }, draw); return; }
      setPlan(slot, id); placed();
    });
  };
  draw();
}

// ── 저장 슬롯 5개 (자동 저장과 별개로 직접 저장·불러오기) ─────────────
const getSlots = () => { const a = store(SLOTS_KEY); return Array.from({length:SLOT_N}, (_, i) => a && a[i] || null); };
const putSlots = a => store(SLOTS_KEY, a);
function slotSummary(sv){ const job = sv.hired && CAREERS[sv.track] ? CAREERS[sv.track].name : '대학생'; return `${esc(sv.name)} · ${yearOf(sv)}년 ${monthOf(sv)}월 · ${ageOf(sv)}세 · ${job}`; }
function showSlots(canSave){
  const slots = getSlots();
  const rows = slots.map((sl, i) => {
    const when = sl ? new Date(sl.at).toLocaleString('ko-KR', {month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit'}) : '';
    return `<div class="slotrow ${sl ? '' : 'empty'}"><div class="si"><b>슬롯 ${i + 1}</b>${sl ? `<small>${slotSummary(sl.S)}</small><small class="when">${when} 저장</small>` : '<small>비어 있음</small>'}</div><div class="sb">${canSave ? `<button class="mini save" data-i="${i}">저장</button>` : ''}${sl ? `<button class="mini load" data-i="${i}">불러오기</button><button class="mini del" data-i="${i}" aria-label="삭제">🗑</button>` : ''}</div></div>`;
  }).join('');
  openSheet(sheetHead('저장 · 불러오기', canSave ? '지금 상태를 슬롯에 저장하거나, 저장한 곳에서 이어 해요.' : '저장해 둔 슬롯에서 이어 해요.') + `<div class="slotlist">${rows}</div>`);
  $('x').onclick = closeSheet;
  document.querySelectorAll('#sheet .save').forEach(b => b.onclick = () => { const i = +b.dataset.i, a = getSlots(); if(a[i] && !confirm(`슬롯 ${i + 1}에 덮어쓸까요?`)) return; a[i] = {at:Date.now(), S:JSON.parse(JSON.stringify(S))}; putSlots(a); toast(`슬롯 ${i + 1}에 저장했어요`); showSlots(canSave); });
  document.querySelectorAll('#sheet .load').forEach(b => b.onclick = () => { const i = +b.dataset.i, sl = getSlots()[i]; if(!sl) return; if(S && !confirm(`슬롯 ${i + 1}을 불러올까요? 지금 진행 중인 게임은 자동 저장 데이터로 남아요.`)) return; if(S) save(); S = JSON.parse(JSON.stringify(sl.S)); save(); closeSheet(); show('game'); $('dialog').dataset.m = ''; render(); toast(`슬롯 ${i + 1}을 불러왔어요`); });
  document.querySelectorAll('#sheet .del').forEach(b => b.onclick = () => { const i = +b.dataset.i; if(!confirm(`슬롯 ${i + 1}을 지울까요?`)) return; const a = getSlots(); a[i] = null; putSlots(a); showSlots(canSave); });
}
// ── 전화하기: 친구·엄마·썸·연인 (한 달 2회, 활동 칸 소모 없음) ─────────────
function toast(msg){ const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; $('app').appendChild(t); setTimeout(() => t.remove(), 1800); }
function openPhone(){
  const left = callsLeft(S);
  const rows = contactsOf(S).map(c => { const done = calledThisMonth(S, c.id), dis = done || left <= 0;
    return `<button class="contact" data-id="${c.id}" ${dis ? 'disabled' : ''}><img class="av" src="${c.img}" alt="" onerror="this.style.visibility='hidden'"><span class="ci"><b>${esc(c.name)}</b><small>${esc(c.sub)}${done ? ' · 이번 달 통화함' : ''}</small></span><span class="cb">📞</span></button>`; }).join('');
  openSheet(sheetHead('전화하기', `이번 달 통화 ${left}회 남음 · 활동 칸은 쓰지 않아요`) + `<div class="contacts">${rows}</div>`);
  $('x').onclick = closeSheet;
  document.querySelectorAll('.contact').forEach(b => b.onclick = async () => {
    const r = tryCall(S, b.dataset.id); if(typeof r === 'string'){ toast(r); return; }
    closeSheet(); await playEvent(r); save(); render();
  });
}
const meter = (cls, label, v) => `<div class="meter ${cls || ''}"><span>${label}</span><div class="bar"><i style="width:${clamp(v, 0, 100)}%"></i></div><b>${Math.round(v)}</b></div>`;
function showStats(){
  openSheet(sheetHead('능력치', `${S.name} · ${ageOf(S)}세`) + '<h3>컨디션</h3>' + meter('', '체력', S.hp) + meter('', '스트레스', S.stress) + meter('', '선명도', S.clarity) + `<h3>세 기둥 (각 50 이상, 합 190 이상이면 자유)</h3>${(S.borrowed || 0) >= 1 ? `<div class="sub" style="color:#b3541e">⏳ 미래 지식 ${S.borrowed}번 사용 (쓸수록 기억 선명도가 깎여요)</div>` : ''}` + Object.keys(PILLAR).map(k => meter(k, PILLAR[k], S[k])).join('') + '<h3>능력치</h3>' + STAT_KEYS.map(k => meter('', STAT[k], S.st[k])).join('') + `<div class="foot">빌린 인생 ${S.borrowed} · 생활비 월 ${livingCost(S)}만${allowance(S) ? ` (지원 +${allowance(S)}만)` : ''}</div>`);
  $('x').onclick = closeSheet;
}
function showCareer(){
  const I = IDOL(S), ev = I.evals.slice(-8);
  const next = isTrainee(S) ? (S.m < DEBUT_PICK_M ? `데뷔조 발표까지 ${DEBUT_PICK_M - S.m}개월 (연습생 12명 중 최근 6회 평균 점수 5위 안)` : I.debutTeam ? `데뷔까지 ${Math.max(0, DEBUT_M - S.m)}개월` : I.survival ? `서바이벌 「스타 메이커」 ${Math.max(0, SURVIVAL_M[0] - S.m)}개월 뒤` : '') : isIdol(S) ? `다음 컴백까지 ${6 - (sinceDebut(S) % 6 || 6) + (sinceDebut(S) % 6 === 0 ? 6 : 0)}개월 · 12월 연말 시상식` : '오디션 재도전(연습 탭)으로 다시 데뷔를 노릴 수 있어요';
  const bars = ev.length ? `<div class="evbars">${ev.map(e => `<span title="${e.m}"><i style="height:${Math.round((13 - e.rank) / 12 * 100)}%"></i><b>${e.rank}</b></span>`).join('')}</div>` : '<div class="sub">아직 월말평가 기록이 없어요.</div>';
  const kv = (k, v) => `<div class="kv"><span>${k}</span><b>${v}</b></div>`;
  openSheet(sheetHead('데뷔 현황', idolStatusLine(S)) + `<div class="sub">${next}</div>` + (isTrainee(S) || I.evals.length ? '<h3>월말평가 순위 (최근 8회 · 낮을수록 좋음)</h3>' + bars + (I.warn ? `<div class="sub" style="color:#c93a66">하위권 연속 ${I.warn}회 — 4회면 방출</div>` : '') + (isTrainee(S) && !S.seen.debut_pick && I.evals.length ? (st => `<div class="sub" style="color:${st.pos <= 5 ? '#2a8a5b' : '#c93a66'}">데뷔조 경쟁(최근 6회 평균): 지금 ${st.pos}위 · 다섯 자리 안에 들어야 해요 · 발표는 ${DEBUT_PICK_M - S.m > 0 ? DEBUT_PICK_M - S.m + '달 뒤' : '이번 달'}</div>`)(debutStanding(S)) : '') + (I.board ? boardHTML(I.board) : '') : '') +
    '<h3>기록</h3>' + kv('그룹', I.group || (I.debutTeam ? GROUP_NAME + ' (데뷔 예정)' : '—')) + kv('팬', fmtFans(I.fans)) + kv('컴백', I.comebacks + '회') + kv('음악방송 1위', I.wins + '회') + kv('수상', I.awards.length ? I.awards.join(', ') : '—') + kv('자작곡', I.songs + '곡') + kv('스캔들 위험', Math.round(I.scandal)) +
    `<div class="foot">월 생활비 ${idolCost(S)}만${momAllowance(S) ? ` · 엄마 용돈 +${momAllowance(S)}만` : ''}${isIdol(S) ? (sinceDebut(S) < 18 ? ' · 데뷔 후 1년 반은 정산 0' : ` · 정산 +${idolIncome(S)}만`) : ''}</div>`);
  $('x').onclick = closeSheet;
}
function showLove(){
  const ids = Object.keys(LOVERS), met = ids.filter(i => S.love[i]).sort((a, b) => ((S.love[a].stage === -9) - (S.love[b].stage === -9)) || S.love[b].aff - S.love[a].aff); // 호감 높은 순 (끝난 사람은 아래)
  const row = id => { const lv = LOVERS[id], v = S.love[id];
    if(!v) return `<div class="lcard"><img class="av sil" src="art/lv_${id}.webp" alt=""><span><b>???</b><small>${esc(lv.hint || '어딘가에서 만날지도 몰라요')}</small></span><span></span></div>`;
    const callable = contactsOf(S).some(c => c.id === id);
    const tag = (v.stage === 3 ? ' 💍' : '') + (S.secret && S.secret[id] ? ' 🤫' : '') + (S.partner === id && v.stage >= 1 && v.stage < 3 ? ' ❤' : '');
    const dt = dateTargets(S).includes(id);
    return `<div class="lcard ${callable ? '' : 'off'}" data-call="${id}"><img class="av" src="art/face_${id}_happy.webp" alt="" onerror="this.src='art/lv_${id}.webp'"><span><b>${esc(lv.name)}</b><small>${loveStatus(S, id)}${tag} · 호감 ${Math.round(v.aff)}</small>${v.stage === -9 || v.stage === -2 ? '' : `<small class="lk">취향 ${likeNames(id)}</small>`}<div class="hb"><i style="width:${clamp(v.aff, 0, 100)}%"></i></div></span><span class="cbw"><span class="cb">${callable ? '📞' : '·'}</span>${dt ? `<button class="mini dt" data-dt="${id}">💞 데이트</button>` : ''}${[-1, 1, 2].includes(v.stage) ? `<button class="mini bk" data-bk="${id}">${v.stage === -1 ? '연락 끊기' : '헤어지기'}</button>` : ''}</span></div>`; };
  openSheet(sheetHead('연애', met.length ? `만난 사람 ${met.length}명 · 탭하면 전화, 💞 데이트로 이번 달 일정에 넣어요` : '아직 마음에 둔 사람이 없어요.') + met.map(row).join('') + `<div class="foot">${met.length < ids.length ? '캠퍼스와 직장에서 새로운 인연을 더 만날 수 있어요. 만난 사람과는 데이트(인연 탭)로 가까워져요.' : ''}</div>`);
  $('x').onclick = closeSheet;
  document.querySelectorAll('[data-call]').forEach(b => b.onclick = async e => {
    const dtb = e.target.closest && e.target.closest('[data-dt]'); if(dtb){ e.stopPropagation(); return planDateWith(dtb.dataset.dt); }
    const bkb = e.target.closest && e.target.closest('[data-bk]'); if(bkb){ e.stopPropagation(); return confirmBreak(bkb.dataset.bk); }
    if(b.classList.contains('off')) return;
    const r = tryCall(S, b.dataset.call); if(typeof r === 'string'){ toast(r); return; } closeSheet(); await playEvent(r); save(); render(); });
}
// 헤어지자고(연락을 끊겠다고) 말하기: 확인 후 이별. 그 사람은 한참 뒤 미련으로 다시 연락해 올 수 있다
function confirmBreak(id){
  const lv = LOVERS[id], v = S.love[id], first = v.stage === -1;
  openSheet(sheetHead(first ? '연락을 끊을까요?' : '헤어질까요?', `${lv.name} · ${loveStatus(S, id)} · 호감 ${Math.round(v.aff)}`) + `<div class="txt">${first ? '더 이상 그 사람과 이어지지 않아요. 아직 마음이 남았다면 신중하게.' : '“우리, 여기까지 하자.” 이 말을 하면 관계가 끝나요. 시간이 지나면 그가 다시 연락해 올지도 몰라요.'}</div><button class="btn" id="bk-go" style="background:#e5486a;box-shadow:none">${first ? '연락을 끊는다' : '헤어지자고 말한다'}</button><button class="btn ghost sm" id="bk-no" style="margin-top:8px">아니, 그대로 둔다</button>`);
  $('x').onclick = $('bk-no').onclick = () => showLove();
  $('bk-go').onclick = async () => { const ch = []; breakUp(S, id, ch); save(); closeSheet(); await playEvent({id:'bk_' + id + '_' + S.m, speaker:lv.name, title:first ? '끊어진 연락' : '이별', place:'night', img:`art/lv_${id}.webp`, cut:id, text:S => first ? `${lv.name}의 번호를 차단했다. 메신저 목록에서 이름이 사라지자 마음이 조금 비었다.` : `“우리, 여기까지 하자.” ${lv.name}는 한참 말이 없다가 고개를 끄덕였다. “…알겠어. 네가 그렇게 정했다면.” 뒷모습이 멀어질 때까지 나는 서 있었다.`, choices:[{label:'돌아선다', sub:'', run(S){ return {text:'바람이 차가웠다. 이별은 늘 처음처럼 아프다.', chips:ch, mood:'sad'}; }}]}); render(); showLove(); };
}
// 연애 시트에서 곧바로 이번 달 빈 칸에 이 사람과의 데이트를 넣는다
function planDateWith(id){
  const a = ACTS.date, why = a.req ? a.req(S) : null; if(why){ toast(why); return; }
  if(a.cost > S.cash){ toast('자금이 모자라요'); return; }
  const slot = S.plan.findIndex(x => !x); if(slot < 0){ toast('이번 달 칸이 모두 찼어요. 스케줄에서 바꿔 주세요'); return; }
  setPlan(slot, 'date'); S.dateTo = S.dateTo || []; S.dateTo[slot] = id; save(); closeSheet(); render(); toast(`${SLOT_NAMES[slot]}에 ${LOVERS[id].name}와 데이트를 넣었어요`);
}
// 추천 계획이 데이트를 넣을 때는 여러 명 중 호감이 높은 사람부터 돌아가며 정한다
function assignDates(){
  S.dateTo = S.dateTo || [];
  const ts = dateTargets(S).sort((a, b) => S.love[b].aff - S.love[a].aff); if(!ts.length) return;
  let k = 0; S.plan.forEach((id, i) => { if(id === 'date'){ S.dateTo[i] = ts[(S.m + k) % ts.length]; k++; } });
}
function showShop(){
  const rows = Object.keys(ITEMS).map(id => { const it = ITEMS[id], n = owned(S, id), cap = it.stack || 1, full = n >= cap, poor = S.cash < it.price;
    return `<button class="act ${full ? '' : ''}" data-id="${id}" ${full || poor ? 'disabled' : ''}><span class="top"><span class="ic">${it.icon}</span><b>${it.name}</b></span><span class="em">${it.price}만원${it.stack ? ` · ${n}/${cap}` : n ? ' · 보유' : ''}</span><span class="${full || !poor ? 'd' : 'why'}">${full ? (it.stack ? '더 살 수 없어요' : '이미 가지고 있어요') : poor ? '자금이 모자라요' : it.desc}</span></button>`; }).join('');
  openSheet(sheetHead('상점', `자금 ${fmtMoney(S.cash)} · 소지품은 매달 효과가 나타나요`) + `<div class="acts">${rows}</div>`);
  $('x').onclick = () => { closeSheet(); render(); };
  document.querySelectorAll('#sheet .act').forEach(b => b.onclick = () => { const r = buyItem(S, b.dataset.id); if(r){ toast(r); return; } save(); toast(`${ITEMS[b.dataset.id].name} 구입!`); showShop(); });
}
// 본 엔딩 기록: 예전 이름은 지금 이름으로 이어받는다
function seenEndings(){ const raw = store(ENDINGS_KEY) || []; const out = []; raw.forEach(id => { const n = endingNorm(id); if(ENDINGS[n] && !out.includes(n)) out.push(n); }); return out; }
function showDex(){
  const seen = seenEndings();
  openSheet(sheetHead('엔딩 도감', `${seen.length}/${ENDING_IDS.length} 수집 · 본 엔딩을 누르면 크게 보고 공유할 수 있어요`) + ENDING_IDS.map(id => { const e = endVarOf(id), ok = seen.includes(id); return `<div class="dexrow ${ok ? 'ok' : 'lock'}" ${ok ? `data-e="${id}"` : ''}><span class="g ${ok && endArt(id, e).includes('end_') ? 'th' : ''}" ${ok && endArt(id, e).includes('end_') ? `style="background-image:url(${endArt(id, e)})"` : ''}>${ok ? e.icon : '❔'}</span><span><b>${ok ? e.title : '???'}</b><small>${ok ? e.sub + ((store(DONE_KEY) || []).includes(id) ? ' · 🏁 완결' : '') : '아직 보지 못한 엔딩'}</small></span>${ok ? '<span class="dx">⤢</span>' : ''}</div>`; }).join(''));
  $('x').onclick = closeSheet;
  document.querySelectorAll('.dexrow[data-e]').forEach(r => r.onclick = () => showEndingCard(r.dataset.e));
}
// 엔딩 크게 보기 + 공유(이미지로 저장하거나 SNS로 보내기)
function showEndingCard(id){
  const e = endVarOf(id), who = S ? S.name : '나', letter = heroName(e.letter.replace(/\{name\}/g, who));
  let el = document.getElementById('ecard'); if(!el){ el = document.createElement('div'); el.id = 'ecard'; $('app').appendChild(el); }
  const art = endArt(id, e);
  el.innerHTML = `<div class="ecbg" style="background-image:url(${art})"></div><div class="ecshade"></div><div class="ecbody"><button class="ecx" id="ec-x" aria-label="닫기">✕</button><div class="big">${e.icon}</div><span class="tag ${e.free ? '' : 'ret'}">${esc(e.sub)}</span><h1>${esc(e.title)}</h1><div class="letter">${esc(letter)}\n\n— 일흔 살의 나로부터</div><div class="ecbtns"><button class="btn" id="ec-share">공유하기</button><button class="btn ghost" id="ec-save">이미지 저장</button></div></div>`;
  el.classList.add('on');
  $('ec-x').onclick = () => el.classList.remove('on');
  const make = () => new Promise(res => { const img = new Image(); img.onload = () => {
    const W = 1080, H = 1920, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
    const r = Math.max(W / img.width, H / img.height); g.drawImage(img, (W - img.width * r) / 2, 0, img.width * r, img.height * r);
    const gr = g.createLinearGradient(0, H * 0.25, 0, H); gr.addColorStop(0, 'rgba(8,10,32,0)'); gr.addColorStop(0.55, 'rgba(8,10,32,.78)'); gr.addColorStop(1, 'rgba(8,10,32,.96)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.fillStyle = '#ffd98a'; g.textAlign = 'center'; g.font = '700 40px system-ui, sans-serif'; g.fillText('다시, 스무 살 · ' + e.sub, W / 2, 1000);
    g.fillStyle = '#fff'; g.font = '800 92px system-ui, sans-serif'; g.fillText(e.title, W / 2, 1120);
    g.font = '500 38px system-ui, sans-serif'; g.fillStyle = 'rgba(255,255,255,.92)'; let y = 1220;
    for(const para of letter.split('\n')){ let line = ''; for(const ch of para){ if(g.measureText(line + ch).width > W - 220){ g.fillText(line, W / 2, y); y += 58; line = ch; if(y > H - 150) break; } else line += ch; } if(line && y <= H - 150){ g.fillText(line, W / 2, y); } y += 58; if(y > H - 150) break; }
    g.fillStyle = 'rgba(255,255,255,.6)'; g.font = '600 30px system-ui, sans-serif'; g.fillText('3678132-rgb.github.io/rewind-ten-maker', W / 2, H - 70);
    c.toBlob(b => res(b), 'image/png'); }; img.onerror = () => res(null); img.src = art; });
  $('ec-share').onclick = async () => {
    const blob = await make(), text = `「다시, 스무 살」 엔딩 — ${e.title}\n${location.href.split('?')[0]}`;
    try{
      if(blob && navigator.canShare && navigator.canShare({files:[new File([blob], 'ending.png', {type:'image/png'})]})){ await navigator.share({files:[new File([blob], 'ending.png', {type:'image/png'})], text}); return; }
      if(navigator.share){ await navigator.share({title:e.title, text, url:location.href.split('?')[0]}); return; }
      if(navigator.clipboard){ await navigator.clipboard.writeText(text); toast('링크를 복사했어요'); return; }
    }catch(err){}
    toast('공유를 지원하지 않는 환경이에요. 이미지 저장을 눌러 보세요');
  };
  $('ec-save').onclick = async () => { const blob = await make(); if(!blob){ toast('이미지를 만들지 못했어요'); return; } const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `ending_${id}.png`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); };
}

// ── 이벤트 재생 ───────────────────────────────────────────────
// 이벤트는 9:16 풀스크린: 일러스트가 화면을 채우고 글과 선택지는 아래 패널에 얹는다
const PLACE_FULL = {rain:'art/cover.webp', shop:'art/bg_shop.webp'};
const seasonPlace = ev => ev.place === 'campus' ? 'campus' : ev.place === 'room' ? 'room' : null;
function evOpen(ev, inner){
  const el = $('ev'), sp = seasonPlace(ev), img0 = ev.img === 'art/rival_harin.webp' && S ? (S.m >= 96 ? 'art/rival_harin_late.webp' : S.m >= 48 ? 'art/rival_harin_work.webp' : ev.img) : ev.img, img = img0 || (sp && S ? seasonBg(S, sp) : PLACE_FULL[ev.place]);
  el.className = 'evcard on p-' + (ev.place || 'room'); paintEdge('card');
  const imgKey = Array.isArray(img) ? img.join('|') : img; // 그림이 여러 장이면 앞의 것이 없을 때 뒤의 것이 깔린다
  if(imgKey && el.dataset.img && el.dataset.img !== imgKey){ el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; } // 장면이 바뀌면 부드럽게 전환
  el.dataset.img = imgKey || '';
  el.style.backgroundImage = img ? (Array.isArray(img) ? img : [img]).map(u => `url(${u})`).join(', ') : 'none';
  const cutId = id => id === 'harin' && S && S.m >= 48 ? 'harin_w' : id; // 서하린은 직장인 시기에 모습이 바뀐다
  const cut = (ev.cut ? `<img class="evcut ${ev.cut2 ? 'l' : ''}" src="${cutSrc(ev, cutId(ev.cut), ev.cutVar || 'a')}" alt="" onerror="this.remove()">` : '') + (ev.cut2 ? `<img class="evcut r" src="${cutSrc(ev, cutId(ev.cut2), ev.cut2Var || 'a')}" alt="" onerror="this.remove()">` : ''); // 대화 상대: 배경 일러스트 위에 누끼로 선다
  el.innerHTML = `<div class="evshade"></div>${img ? '' : `<div class="evicon">${PLACE_ICON[ev.place] || '🏠'}</div>`}${cut}<div class="evpanel" id="evpanel">${inner}</div>`;
  $('evpanel').scrollTop = 0;
}
function evClose(){ $('ev').classList.remove('on'); paintEdge('game'); }
// ── 리듬 미니게임: 움직이는 막대가 가운데 판정선에 올 때 탭. 결과 0~1 ─────────────
function rhythmGame(ev, head, g, label){
  return new Promise(done => {
    const notes = g.notes || 4, base = 0.75 * (g.speed || 1); let k = 0, hits = [], pos = 0, dir = 1, last = 0, t0 = 0, raf = 0, lock = false;
    evOpen(ev, head + `<div class="rg"><div class="rg-h">${esc(label)}</div><div class="rg-sub">막대가 가운데 빛나는 칸에 들어올 때 탭!</div><div class="rg-dots">${Array.from({length:notes}, (_, i) => `<i data-i="${i}"></i>`).join('')}</div><div class="rg-track" id="rgt"><div class="rg-zone"><b></b></div><div class="rg-cur" id="rgc"></div></div><div class="rg-fb" id="rgf">준비…</div><button class="btn rg-tap" id="rgb">탭!</button></div>`);
    const cur = $('rgc'), fb = $('rgf');
    const startNote = () => { pos = R() < 0.5 ? 0 : 1; dir = pos ? -1 : 1; t0 = last = performance.now(); lock = false; fb.textContent = `${k + 1} / ${notes}`; fb.className = 'rg-fb'; raf = requestAnimationFrame(step); };
    const step = now => { const dt = Math.min(0.05, (now - last) / 1000); last = now; const sp = base * (1 + k * 0.12); pos += dir * sp * dt; if(pos >= 1){ pos = 1; dir = -1; } if(pos <= 0){ pos = 0; dir = 1; }
      cur.style.left = (pos * 100) + '%'; if(now - t0 > 3200 / Math.sqrt(g.speed || 1)) return judge(true); raf = requestAnimationFrame(step); };
    const judge = timeout => { if(lock) return; lock = true; cancelAnimationFrame(raf); const d = Math.abs(pos - 0.5), v = timeout ? 0 : d <= 0.045 ? 1 : d <= 0.11 ? 0.6 : d <= 0.17 ? 0.25 : 0;
      hits.push(v); const w = v >= 1 ? 'PERFECT' : v >= 0.6 ? 'GOOD' : v > 0 ? 'BAD' : 'MISS'; fb.textContent = w; fb.className = 'rg-fb ' + w.toLowerCase();
      const dot = document.querySelector(`.rg-dots i[data-i="${k}"]`); if(dot) dot.className = w.toLowerCase(); k++;
      if(k >= notes){ const score = hits.reduce((a, x) => a + x, 0) / notes; setTimeout(() => { fb.textContent = `${hits.filter(x => x >= 1).length} PERFECT · ${hits.filter(x => x >= 0.6 && x < 1).length} GOOD · ${hits.filter(x => x < 0.6).length} MISS`; fb.className = 'rg-fb sum'; setTimeout(() => done(score), 900); }, 450); }
      else setTimeout(startNote, 550); };
    const tap = e => { if(e) e.preventDefault(); if(!lock) judge(false); };
    $('rgb').addEventListener('pointerdown', tap); $('rgt').addEventListener('pointerdown', tap);
    setTimeout(startNote, 700);
  });
}
// 월말평가 순위표: 위 6명 + 나, 다섯째 아래에 데뷔조 선
function boardHTML(b){
  const top = b.slice(0, 6), me = b.find(x => x.me), rows = top.concat(me && me.r > 6 ? [me] : []), mx = Math.max(...b.map(x => x.sc)), mn = Math.min(...b.map(x => x.sc));
  return `<div class="board"><div class="bd-h">이번 달 순위 · 연습생 ${b.length}명</div>${rows.map(x => `${x.r === 6 ? '<div class="bd-cut">— 데뷔조 다섯 자리 —</div>' : x.me && x.r > 7 ? '<div class="bd-cut" style="color:#9aa3c4">⋯</div>' : ''}<div class="bd-row ${x.me ? 'me' : ''}"><span class="bd-r">${x.r}</span><span class="bd-n">${esc(x.me ? x.name + ' (나)' : x.name)}</span><span class="bd-bar"><i style="width:${Math.round(18 + 82 * (x.sc - mn) / Math.max(1, mx - mn))}%"></i></span></div>`).join('')}</div>`;
}
function playEvent(ev){
  return new Promise(resolve => {
    S.seen[ev.id] = true; S.cd[ev.id] = S.m;
    const head = (ev.speaker ? `<span class="who">${esc(ev.speaker)}</span>` : '') + `<h2>${esc(ev.title)}</h2>`;
    const beats = (ev.beats || []).slice();
    const mc = /^st_(\d+)_1$/.exec(ev.id);
    // 대사마다 일러스트가 바뀌는 이벤트(오프닝 등): beatImgs[i] 가 i번째 대사의 그림, 선택지 화면은 마지막 그림을 이어 쓴다
    const bimgs = ev.beatImgs || null; let bi = 0; if(bimgs) bimgs.forEach(u => [].concat(u).forEach(x => { const im = new Image(); im.src = x; }));
    const nextBeat = () => {
      if(beats.length){ const t = beats.shift(), ev2 = bimgs ? Object.assign({}, ev, {img: bimgs[Math.min(bi, bimgs.length - 1)]}) : ev; bi++; evOpen(ev2, head + `<div class="txt">${esc(t)}</div><button class="btn" id="enx">다음</button>`); $('enx').onclick = nextBeat; return; }
      if(bimgs) ev = Object.assign({}, ev, {img: bimgs[bimgs.length - 1]});
      const cs = ev.choices; evOpen(ev, head + `<div class="txt">${esc(ev.text(S))}</div>` + cs.map((c, k) => `<button class="ch" data-k="${k}"><b>${esc(c.label)}</b><span>${esc(c.sub || '')}</span></button>`).join(''));
      document.querySelectorAll('#ev .ch').forEach(b => b.onclick = async () => {
        if(b.dataset.busy) return; document.querySelectorAll('#ev .ch').forEach(x => x.dataset.busy = '1');
        const c = cs[+b.dataset.k]; if(c.game) S._perf = await rhythmGame(ev, head, c.game, c.label);
        const out = c.run(S); save();
        if(!out.text){ evClose(); render(); return resolve(); }
        evOpen(Object.assign({}, ev, out.mood === 'shy' && ev.cut ? {cutVar:'b'} : {}, ev.resultImgs && ev.resultImgs[+b.dataset.k] ? {img:ev.resultImgs[+b.dataset.k]} : {}), head + (ev.face ? `<img class="face" src="art/face_${ev.face === 'harin' ? (S.m >= 96 ? 'harin_l' : S.m >= 48 ? 'harin_w' : 'harin') : ev.face}_${out.mood || 'serious'}.webp" alt="" onerror="this.style.display='none'">` : ev.cut ? '' : faceImg(out.chips, ev.lover)) + `<div class="txt">${esc(out.text)}</div>${out.board ? boardHTML(out.board) : ''}<div class="chips" style="clear:both">${chipHTML(out.chips)}</div><button class="btn" id="enx" style="margin-top:14px">계속</button>`);
        $('enx').onclick = () => { evClose(); render(); resolve(); };
      });
    };
    if(mc){ const n = +mc[1], el = $('ev'), pc = SS(S).pieces; el.className = 'evcard on chapter'; el.style.backgroundImage = ''; el.dataset.img = '';
      const dots = Array.from({length:10}, (_, i) => `<i class="${i < pc ? 'on' : ''}"></i>`).join('');
      el.innerHTML = `<div class="chapcard" style="background-image:url(art/ch_${n}.webp),radial-gradient(circle at 50% 28%,#2b3a8c,#0c1030 70%)"><div class="chshade"></div><div class="chtxt"><small class="chyear">${yearOf(S)}년 ${monthOf(S)}월</small><div class="chnum">CHAPTER ${String(n).padStart(2, '0')}</div><h1>${esc(CHAPTER_TITLES[n - 1] || '')}</h1><div class="chline"></div><div class="chpieces" aria-label="시계 조각 ${pc} / 10">${dots}</div><button class="btn" id="chgo">시작</button></div></div>`; $('chgo').onclick = nextBeat; }
    else nextBeat();
  });
}
const alertSheet = (title, body, chips, btn) => new Promise(res => { openSheet(`<div class="sh-head"><b>${esc(title)}</b></div><div class="txt">${body}</div><div class="chips">${chipHTML(chips)}</div><button class="btn blue" id="nx" style="margin-top:14px">${btn || '계속'}</button>`); $('nx').onclick = () => { closeSheet(); res(); }; });

// ── 한 달 진행 ────────────────────────────────────────────────
const ACT_ART = new Set(['study','cert','tutor','cafe','intern','project','jobhunt','job','future','exercise','journal','hobby','style','family','friends','club','date','travel','rest']);
// 직업 그림은 나이대별: 25살(기본)·27살·30살 (인턴은 항상 기본)
function jobArtFor(c, intern){ const k = intern ? '' : (S.m >= 96 ? '_30' : S.m >= 72 ? '_27' : ''); return `art/job_${c}${k}.webp`; }
// 계절(3~5 봄, 6~8 여름, 9~11 가을, 12~2 겨울)과 2.5등신 캐릭터 스프라이트(두 장이 번갈아 움직인다)
const seasonOf = S => { const m = monthOf(S); return m >= 3 && m <= 5 ? 'spring' : m >= 6 && m <= 8 ? 'summer' : m >= 9 && m <= 11 ? 'autumn' : 'winter'; };
const SPRITE = {vocal:'hobby', dance:'exercise', stage:'style', write:'journal', reaudition:'job', musicshow:'job', variety:'job', fansign:'friends', cf:'job', live:'hobby', diet:'exercise', study:'study', cert:'study', tutor:'study', cafe:'cafe', intern:'job', project:'job', jobhunt:'job', job:'job', future:'journal', journal:'journal', exercise:'exercise', hobby:'hobby', style:'style', family:'family', friends:'friends', club:'friends', date:'date', travel:'travel', rest:'rest'};
for(const k in CAMPUS_PLACES) SPRITE['cp_' + k] = CAMPUS_PLACES[k].sprite; // 교정 장소별 캐릭터 동작
// 졸업 뒤에는 학교 대신 도시 배경에서 움직인다
const CITY_ACT_BG = {exercise:'ct_river', friends:'ct_mall', club:'ct_night', date:'ct_cinema', travel:'ct_river', cafe:'ct_books', tutor:'ct_office'};
// 아이돌 활동 팝업 배경
const IDOL_ACT_BG = {vocal:'bg_studio', dance:'bg_practice', stage:'bg_practice', write:'bg_studio', reaudition:'bg_eval', musicshow:'bg_stage', variety:'bg_stage', fansign:'bg_stage', cf:'bg_studio', live:'bg_dorm', diet:'bg_dorm'};
const OUTDOOR = new Set(['exercise', 'friends', 'club', 'date', 'travel', 'cafe', 'tutor']);
const seasonBg = (S, place) => `art/bg_${place}_${seasonOf(S)}.webp`;
// 신분별 복장: 직장인(_w) · 인턴(_i) · 대학생(기본). 운동은 운동복, 잠은 잠옷이라 신분과 무관
const OUTFIT_SETS = new Set(['study', 'job', 'journal', 'hobby', 'style', 'family', 'friends', 'travel']);
const outfitSuffix = (S, id) => !OUTFIT_SETS.has(SPRITE[id]) ? '' : isIdol(S) ? '_w' : '';
// 이미지가 없으면 data-fb 의 다음 후보로 바꾼다(a|b|c)
function cfb(img){ const l = (img.dataset.fb || '').split('|').filter(Boolean); const nx = l.shift(); img.dataset.fb = l.join('|'); if(nx) img.src = nx; else img.onerror = null; }
// 스케줄 연출 속도: normal(기본) / fast(짧게, 결과도 자동 진행) / skip(팝업 없이 정산에서 한꺼번에)
const SPEED_KEY = 'rt_speed', SPEED_LB = {normal:'보통', fast:'빠르게', skip:'건너뛰기(정산에서 한 번에)'};
const getSpeed = () => { try{ const v = localStorage.getItem(SPEED_KEY); return SPEED_LB[v] ? v : 'normal'; }catch(e){ return 'normal'; } };
const setSpeed = v => { try{ localStorage.setItem(SPEED_KEY, v); }catch(e){} };
function showAct(slotName, id, out, first = 0, opts = {}){
  // 스테이지 제로 메이커처럼: 홈 화면(상태창·탭)은 그대로 두고, 가운데 팝업 카드에서 2.5등신 장면이 진행된다
  return new Promise(res => {
    const a = ACTS[id], el = $('act');
    const sp = SPRITE[id];
    let inner, cls = 'apf', frameBg = '';
    // 데이트: 연인별 일러스트(음식 장면만 나오지 않게 여러 장 중 하나), 없으면 2.5등신 데이트 세트
    const dtN = sp === 'date' && out.lover ? [1, 2, 3, 4].filter(n => DATE_ART.has(`dt_${out.lover}_${n}`)) : [];
    if(dtN.length){
      const n = dtN[Math.floor(R() * dtN.length)]; cls += ' art';
      inner = `<div class="fart dt" style="background-image:url(art/dt_${out.lover}_${n}.webp)"></div>`;
    } else if(sp){
      // 직업 일: 큰 일러스트 대신 직업별 2.5등신 캐릭터(두 장이 번갈아 움직인다). 직업 세트가 없으면 직장인 → 기본 순서로 대체
      const jobSet = sp === 'job' ? (isIdol(S) ? 'job_actor' : 'job_i') : null;
      const spf = sp === 'date' && out.lover ? `date_${out.lover}` : jobSet || sp + outfitSuffix(S, id);
      const sbg = IDOL_ACT_BG[id] ? `art/${IDOL_ACT_BG[id]}.webp), url(art/bg_office.webp` : sp === 'job' ? 'art/bg_office.webp' : grad(S) && CITY_ACT_BG[id] ? `art/${CITY_ACT_BG[id]}.webp` : seasonBg(S, OUTDOOR.has(id) ? 'campus' : 'room'), bgA = ACTS[id].cp ? `art/cp_${ACTS[id].cp}.webp), url(${sbg}` : sbg;
      const fb = jobSet ? ['job_w', 'job'] : [];
      cls += ' ill'; frameBg = `style="background-image:url(${bgA})"`; // 장소 일러스트를 깔고 그 위에서 캐릭터가 움직인다
      const fbA = (fb.length ? fb : [sp]).map(x => `art/chibi/${x}_a.webp`).join('|'), fbB = (fb.length ? fb : [sp]).map(x => `art/chibi/${x}_b.webp`).join('|');
      inner = `<div class="fsp ${sp === 'friends' || sp === 'date' ? 'wide' : ''}"><img class="fa" src="art/chibi/${spf}_a.webp" alt="" data-fb="${fbA}" onerror="cfb(this)"><img class="fb" src="art/chibi/${spf}_b.webp" alt="" data-fb="${fbB}" onerror="cfb(this)"></div>`;
    } else {
      cls += ' art';
      const bg = ACT_ART.has(id) ? `url(art/act_${id}.webp)` : 'none';
      inner = `<div class="fart" style="background-image:${bg}"></div>`;
    }
    const mo = monthOf(S), d0 = first * 10 + 1, d1 = Math.min(30, (first + a.slots) * 10);
    el.innerHTML = `<div class="apop"><div class="aph"><h2>${a.icon} ${esc(actName(S, id))}</h2><span class="ptag">${slotName}</span></div><div class="${cls}" ${frameBg}>${inner}</div><div id="apx"><div class="apbar"><i></i></div><div class="apfoot"><b id="adate">${opts.noDate ? '교정 산책' : `${mo}월 ${d0}일`}</b><span>탭하면 건너뛰기</span></div></div></div>`;
    el.classList.add('on');
    const bar = el.querySelector('.apbar i'); requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = '100%'; }));
    let done = false, auto = 0, auto2 = 0; const t0 = Date.now(), fastMode = getSpeed() === 'fast', DUR = fastMode ? 700 : 2600;
    const tick = opts.noDate ? 0 : setInterval(() => { const day = Math.min(d1, d0 + Math.floor((Date.now() - t0) / DUR * (d1 - d0 + 1))); const dd = $('adate'); if(dd) dd.textContent = `${mo}월 ${day}일`; }, 120);
    const result = () => {
      if(done) return; done = true; clearInterval(tick); clearTimeout(auto);
      $('apx').innerHTML = `<div class="txt">${esc(out.note || a.desc)}</div><div class="chips">${chipHTML(out.ch)}</div><button class="btn" id="anx">다음</button>`;
      el.querySelector('.apop').onclick = null;
      $('anx').onclick = () => { clearTimeout(auto2); el.classList.remove('on'); res(); };
      if(fastMode) auto2 = setTimeout(() => { if(el.classList.contains('on') && $('anx')) $('anx').click(); }, 1000); // 빠르게: 결과도 잠깐 보여 주고 넘어간다
    };
    auto = setTimeout(result, DUR + 200);
    el.querySelector('.apop').onclick = result;
  });
}
// 부부의 밤: 단계마다 한 번씩 고르고, 멈추면 거기서 끝난다
async function playMarriedNight(id, out){
  const steps = marriedNightSteps(S, id); S._nightGo = true;
  for(const ev of steps){ if(!S._nightGo || S.ending) break; await playEvent(ev); }
  S._nightGo = false;
}
async function runMonth(){
  seedMonth(S); S.lastPlan = S.plan.slice(); const skipLog = [];
  for(let i = 0; i < 3; i++){
    let id = S.plan[i]; if(!id || id === '>') continue; let a = ACTS[id]; const first = i;
    let fell = false; if(a.cost && a.cost > S.cash || (a.req && a.req(S))){ fell = true; id = 'rest'; a = ACTS[id]; }
    S.curDate = S.dateTo && S.dateTo[first] || null; S.curJob = S.jobTo && S.jobTo[first] || null; const out = doAction(S, id); S.curDate = null; S.curJob = null; i += a.slots - 1; if(fell) out.note = '조건이 맞지 않아 계획을 바꿔 쉬었다.';
    if(getSpeed() === 'skip' && !['jobhunt', 'date'].includes(id) && !out.burnout){ skipLog.push({a, out}); }
    else if(id === 'date' && S.married && S.love[S.married] && !fell){ await playMarriedNight(S.married, out); }
    else await showAct(SLOT_NAMES[first], id, out, first);
    if(out.burnout) break;
  }
  const sch = settle(S);
  let body = '생활비·균형을 정산했어요.';
  if(skipLog.length){ // 건너뛰기: 팝업 없이 한 달 치 결과를 정산에서 모아 보여 준다
    const merged = {}; skipLog.forEach(s => (s.out.ch || []).forEach(c => { const m = merged[c.label] || (merged[c.label] = {label:c.label, d:0, money:c.money}); m.d += c.d; }));
    sch.unshift(...Object.values(merged));
    body = skipLog.map(s => `${s.a.icon} ${esc(actName(S, s.a.id))}${s.out.note ? ' — ' + esc(s.out.note) : ''}`).join('<br>') + '<br><br>생활비·균형도 정산했어요.';
  }
  await alertSheet(`${yearOf(S)}년 ${monthOf(S)}월 정산`, body, sch, '계속');
  if(!S.ending){
    const fx_ = fixedEvents(S); for(const f of fx_){ await playEvent(f); if(S.ending) break; }
    if(!S.ending){ const ev = fx_.length >= 2 ? null : (R() < 0.7 ? pickEvent(S) : null); if(ev) await playEvent(ev); }
  }
  if(!S.ending) S.m++;
  S.cpLeft = CAMPUS_VISITS; // 새 달: 교정 방문 3번 충전
  S.plan = [null, null, null];
  if(S.m >= TOTAL_MONTHS || S.ending){ S.ending = S.ending || computeEnding(S); save(); return showEnding(); }
  save(); render();
}
async function startFlow(){ // 새 게임: 프롤로그 먼저
  seedMonth(S); await playEvent(S.round > 1 ? ROUND2_NOW : PROLOGUE_NOW); save(); render();
}

// ── 엔딩 ──────────────────────────────────────────────────────
function showEnding(){
  const id = S.ending || computeEnding(S), e = endingView(S, id); const P = finalPillars(S);
  if(S.story && S.story.f && S.story.f.clockFree){ const d = store(DONE_KEY) || []; if(!d.includes(id)){ d.push(id); store(DONE_KEY, d); } } // 시계를 놓아주고 끝낸 엔딩은 도감에 ‘완결’로 남는다
  if(e.track){ const m = store(ENDVAR_KEY) || {}; m[id] = e.track; store(ENDVAR_KEY, m); }
  const seen = seenEndings(); if(!seen.includes(id)){ seen.push(id); store(ENDINGS_KEY, seen); }
  $('end').innerHTML = `<div class="endbg" style="background-image:url(${endArt(id, e)})"></div><div class="endscroll"><div class="endspacer"></div><div class="endcard ending"><div class="big">${e.icon}</div><span class="tag ${e.free ? '' : 'ret'}">${e.sub}</span><h1>${e.title}</h1>
   <div class="pillars">${Object.keys(PILLAR).map(k => `<div class="pcard ${k}"><div class="pt"><span>${PILLAR[k]}</span><b>${Math.round(P[k])}</b></div><div class="t"><i style="width:${P[k]}%"></i><u></u></div></div>`).join('')}</div>
   
   <div class="letter">${esc(e.letter.replace(/\{name\}/g, S.name))}${S.story && S.story.f && S.story.f.clockFree ? '\n\n마지막 달, 모래시계를 놓아주었다. 되감기는 거기서 끝났고, 이 시간은 온전히 내 것이 되었다.' : S.story && S.story.f && S.story.f.clockKeep ? '\n\n모래시계는 약방 선반 위에 남아 있다. 엔딩 뒤 ‘2회차’ 버튼으로 이어서 걸을 수 있다.' : ''}\n\n— 일흔 살의 나로부터</div>
   <p class="sub">엔딩 ${seen.length}/${ENDING_IDS.length} 수집 · 빌린 인생 ${S.borrowed} · 기억 선명도 ${Math.round(S.clarity)}</p>
   ${S.story && S.story.f && S.story.f.clockKeep ? `<button class="btn" id="b-round2" style="margin-bottom:8px">⏳ ${(S.round || 1) + 1}회차 시작 — 시계를 곁에 둔 채 이어서</button><p class="sub">지난 능력치의 절반과 시계 조각 2개를 가지고 2016년부터 다시 걷는다.</p>` : ''}<button class="btn" id="b-again">${e.free ? '다시 도전하기' : '한 번 더 되감기'}</button></div></div>`;
  $('b-again').onclick = () => { store(SAVE_KEY, null); S = null; initTitle(); show('title'); };
  if($('b-round2')) $('b-round2').onclick = () => { const prev = S; S = nextRound(prev); save(); show('game'); render(); startFlow(); };
  show('end');
}

// ── 메뉴·기록 ─────────────────────────────────────────────────
function initGame(){
  $('btn-go').onclick = () => { if(S.plan.some(x => !x)){ openPicker(firstEmpty()); return; } $('btn-go').disabled = true; $('dialog').hidden = true; runMonth().finally(() => { $('btn-go').disabled = false; }); };
  $('b-call').onclick = openPhone;
  $('btn-advice').onclick = () => { if($('dialog').hidden) showDialog(); else $('dialog').hidden = true; };
  $('dlg-x').onclick = () => { $('dialog').hidden = true; };
  document.querySelectorAll('[data-sheet]').forEach(b => b.onclick = () => ({stat:showStats, career:showCareer, love:showLove, dex:showDex, shop:showShop, campus:showCampus, city:showCity, dex:showDex}[b.dataset.sheet])());
  $('b-menu').onclick = () => { openSheet(sheetHead('메뉴') + `<div class="menu-list"><button class="btn ghost sm" id="m-dex">📖 도감 (엔딩·인물)</button><button class="btn ghost sm" id="m-speed">⏩ 스케줄 연출: ${SPEED_LB[getSpeed()]}</button><button class="btn ghost sm" id="m-update">🔄 새 버전 확인</button><button class="btn ghost sm" id="m-slots">💾 저장 · 불러오기 (슬롯 5개)</button><button class="btn ghost sm" id="m-title">🏠 타이틀로 (자동 저장)</button></div><div class="foot">빌드 __BUILD__<br><span id="diag"></span></div>`);
    $('x').onclick = closeSheet;
    try{ const pr = document.createElement('div'); pr.style.cssText = 'position:fixed;left:0;bottom:0;padding-bottom:env(safe-area-inset-bottom);padding-top:env(safe-area-inset-top);visibility:hidden'; document.body.appendChild(pr); const cs = getComputedStyle(pr), sb = cs.paddingBottom, st = cs.paddingTop; pr.remove(); const sa = window.navigator.standalone === true || matchMedia('(display-mode: standalone)').matches; $('diag').textContent = `화면 ${innerWidth}×${innerHeight} · 기기 ${screen.width}×${screen.height} · 안전영역 위 ${st}/아래 ${sb} · ${sa ? '홈 화면 앱' : '브라우저'}`; }catch(e){}
    $('m-dex').onclick = () => { closeSheet(); showDex(); };
    $('m-speed').onclick = () => { const order = ['normal', 'fast', 'skip'], nx = order[(order.indexOf(getSpeed()) + 1) % 3]; setSpeed(nx); $('m-speed').textContent = '⏩ 스케줄 연출: ' + SPEED_LB[nx]; toast('스케줄 연출: ' + SPEED_LB[nx]); };
    $('m-update').onclick = () => checkUpdate(true);
    $('m-slots').onclick = () => showSlots(true);
    $('m-title').onclick = () => { save(); closeSheet(); initTitle(); show('title'); }; };
  $('ov').addEventListener('click', e => { if(e.target === $('ov') && !document.querySelector('#sheet #nx')){ closeSheet(); if(S) render(); } });
}
// ───── 성인 안내: 만 19세 이상만 이용(연 나이 기준 입력 확인, 이 기기에 저장) ─────
const AGE_KEY = 'rt_adult_ok';
function initAgeGate(){
  const g = $('agegate'); if(!g) return;
  let ok = false; try{ ok = localStorage.getItem(AGE_KEY) === '1'; }catch(e){}
  if(ok){ g.style.display = 'none'; return; }
  const sel = $('ag-year'), yNow = new Date().getFullYear();
  sel.innerHTML = '<option value="">선택</option>' + Array.from({length:90}, (_, i) => yNow - i).map(y => `<option value="${y}">${y}년</option>`).join('');
  $('ag-ok').onclick = () => {
    const y = +sel.value; if(!y){ $('ag-msg').textContent = '태어난 해를 선택해 주세요.'; return; }
    if(yNow - y < 19){ $('ag-msg').textContent = '만 19세 미만은 이용할 수 없어요.'; return; }
    try{ localStorage.setItem(AGE_KEY, '1'); }catch(e){}
    g.style.display = 'none';
  };
  $('ag-no').onclick = () => { try{ window.close(); }catch(e){} $('ag-msg').textContent = '창을 닫아 주세요.'; };
}
initTitle(); initGame(); paintIcons(); paintEdge('title'); initAgeGate();

// 설치형 앱(PWA): 서비스워커로 그림을 기기에 캐시해 두 번째부터는 빠르게, 오프라인에서도 열린다
try{ if('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {}); }catch(e){}

// 아이폰 사파리: 화면 아래에 접힌 하단 바 자리가 따로 생긴다. 그림은 그 자리까지 채우고(앱 높이 = 기기 화면 높이),
// 버튼·탭은 바 위에 오도록 아래 여백(--sb)을 그만큼 준다.
function fitFull(){
  try{
    const root = document.documentElement, app = $('app');
    const ios = /iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    // 가장 큰 화면 높이(하단 바 뒤까지)를 lvh 프로브로 잰다. 안 되면 기기 화면 높이를 쓴다.
    let big = Math.max(screen.height, screen.width);
    try{ const pr = document.createElement('div'); pr.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:100vh;height:100lvh;visibility:hidden;pointer-events:none'; document.body.appendChild(pr); const h = pr.getBoundingClientRect().height; pr.remove(); if(h > 100) big = Math.max(h, big, window.innerHeight); }catch(e){}
    const gap = Math.round(big - window.innerHeight);
    window.__fit = {inner:window.innerHeight, big:Math.round(big), screen:screen.height, gap};
    if(ios && Math.min(screen.width, screen.height) < 600 && gap > 4 && gap < 140 && window.innerHeight > window.innerWidth){
      app.style.bottom = 'auto'; app.style.height = Math.round(big) + 'px'; root.style.setProperty('--sb', gap + 'px');
    } else { app.style.bottom = ''; app.style.height = ''; root.style.removeProperty('--sb'); }
    const d = document.getElementById('fitdiag'); if(d) d.textContent = /[?&](probe|diag)\b/.test(location.search) ? `화면 ${innerWidth}×${innerHeight} · 최대 ${Math.round(big)} · 기기 ${screen.height} · 여백 ${gap}` : '';
    if(/[?&]probe\b/.test(location.search)) probeFit(big);
  }catch(e){}
}
// ?probe 로 열면: 배경을 새빨갛게, 화면 맨 아래(852 기준)에 파란 띠를 깔고 측정값을 크게 보여 준다 — 아래 여백이 '페이지가 못 그리는 곳'인지 가리는 용도
function probeFit(big){
  let b = document.getElementById('probe'); if(!b){ b = document.createElement('div'); b.id = 'probe'; document.body.appendChild(b); document.documentElement.style.background = document.body.style.background = '#ff2a2a'; }
  const mk = (css) => { const e = document.createElement('div'); e.style.cssText = 'position:fixed;left:0;right:0;visibility:hidden;' + css; document.body.appendChild(e); const h = e.getBoundingClientRect().height; e.remove(); return h; };
  const st = (navigator.standalone === true || matchMedia('(display-mode: standalone)').matches) ? '홈화면앱' : '사파리탭';
  const vv = window.visualViewport ? `${Math.round(visualViewport.height)}@${Math.round(visualViewport.offsetTop)}` : '-';
  const top = mk('padding-top:env(safe-area-inset-top,0px)'), bot = mk('padding-top:env(safe-area-inset-bottom,0px)');
  b.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:99999;pointer-events:none;font:700 15px/1.5 system-ui;color:#fff';
  b.innerHTML = `<div style="position:absolute;top:0;left:0;right:0;background:#000c;padding:70px 12px 8px">${st} · inner ${innerWidth}×${innerHeight} · vv ${vv}<br>screen ${screen.width}×${screen.height} · 최대 ${Math.round(big)} · 안전 위${top} 아래${bot}<br>빌드 #${BUILD_NO} — 맨 아래 파란 띠가 보이면 페이지가 그릴 수 있는 영역</div><div style="position:absolute;top:${Math.round(big) - 59}px;height:59px;left:0;right:0;background:#1f4bff;text-align:center;padding-top:16px">▼ 파란 띠 (852 기준 아래 59px)</div>`;
}
fitFull(); addEventListener('resize', fitFull); addEventListener('orientationchange', () => setTimeout(fitFull, 300)); setTimeout(fitFull, 600);

// ── 새 버전 확인: 사파리는 페이지를 몇 분간 기억해 두므로, 서버의 빌드 번호와 비교해 알려 준다 ──
const BUILD_NO = parseInt(('__BUILD__'.match(/#(\d+)/) || [0, 0])[1], 10);
async function checkUpdate(manual){
  try{
    const r = await fetch(location.pathname + '?_=' + Date.now(), {cache:'no-store'}); const txt = await r.text();
    const m = txt.match(/빌드 #(\d+)/), no = m ? parseInt(m[1], 10) : 0;
    if(no > BUILD_NO){ showUpdateBar(no); return true; }
    if(manual) toast('최신 버전이에요 (빌드 #' + BUILD_NO + ')');
  }catch(e){ if(manual) toast('확인하지 못했어요. 인터넷을 확인해 주세요'); }
  return false;
}
function showUpdateBar(no){
  if(document.getElementById('upbar')) return;
  const d = document.createElement('div'); d.id = 'upbar'; d.innerHTML = `새 버전 #${no}이 있어요 <button id="up-go">업데이트</button>`; $('app').appendChild(d);
  $('up-go').onclick = async () => { try{ const rs = await navigator.serviceWorker.getRegistrations(); for(const x of rs) await x.unregister(); const ks = await caches.keys(); for(const k of ks) await caches.delete(k); }catch(e){} location.replace(location.pathname + '?v=' + Date.now()); };
}
setTimeout(() => checkUpdate(false), 1500);
document.addEventListener('visibilitychange', () => { if(!document.hidden) checkUpdate(false); });
