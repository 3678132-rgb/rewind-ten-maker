// ── UI (ENGINE 밖) ─────────────────────────────────────────────
const SAVE_KEY = 'rewind-ten-v1', ENDINGS_KEY = 'rewind-ten-endings-v1';
let S = null, setupSel = {major:'biz', origin:'office', regret:'work'};
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;'}[c]));
const PLACE_ICON = {rain:'🌧️', shop:'⏳', night:'🌙', campus:'🎓', cafe:'☕', room:'🏠'};
const PLACE_IMG = {shop:'art/bg_shop.webp', rain:'art/bg_alley.webp'}, PLACE_POS = {rain:'50% 50%', shop:'50% 40%'};
const heroKey = S => S.m < 24 ? 'age20' : S.m < 48 ? 'age22' : S.m < 72 ? 'age25' : S.m < 96 ? 'age27' : 'age30';
// 이벤트 결과의 칩으로 표정을 고른다
function faceFor(ch){ let up = 0, down = 0, tired = false; for(const c of ch || []){ if(c.label === '스트레스' ? c.d > 3 : c.label === '체력' && c.d < -3) tired = true; if(c.label in PILLAR || c.label === '기억 선명도') (c.d > 0 ? up += c.d : down -= c.d); }
  return tired ? 'tired' : down > up + 1 ? 'sad' : up >= 4 ? 'happy' : up > 0 ? 'shy' : 'determined'; }
// 연애 인물의 표정: 이번 선택으로 바뀐 호감도에 따라 (happy·shy·tender·surprised·serious·sad)
function loverFace(id, ch){ const lv = LOVERS[id]; const c = (ch || []).find(x => lv && x.label === lv.name + ' 호감'); const d = c ? c.d : 0;
  return d >= 8 ? 'happy' : d >= 3 ? 'shy' : d > 0 ? 'tender' : d <= -6 ? 'sad' : d < 0 ? 'serious' : 'surprised'; }
const faceImg = (ch, lover) => lover && LOVERS[lover] ? `<img class="face" src="art/face_${lover}_${loverFace(lover, ch)}.webp" alt="" onerror="this.src='art/lv_${lover}.webp'">` : `<img class="face" src="art/face_${faceFor(ch)}.webp" alt="" onerror="this.style.display='none'">`;
function store(k, v){ try{ if(v === undefined) return JSON.parse(localStorage.getItem(k)); if(v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); }catch(e){ return null; } }
function save(){ if(S) store(SAVE_KEY, S); }
function show(id){ document.querySelectorAll('.screen').forEach(e => e.classList.toggle('on', e.id === id)); window.scrollTo(0, 0); }
function openSheet(html){ $('sheet').innerHTML = html; $('ov').classList.add('on'); $('sheet').scrollTop = 0; }
function closeSheet(){ $('ov').classList.remove('on'); }
const chipHTML = ch => (ch || []).filter(c => Math.abs(c.d) >= 0.05).map(c => `<span class="chip ${c.d > 0 ? (c.label === '스트레스' ? 'down' : 'up') : (c.label === '스트레스' ? 'up' : 'down')}">${esc(c.label)} ${c.d > 0 ? '+' : ''}${c.money ? fmtMoney(c.d) : (Math.abs(c.d) < 1 ? c.d.toFixed(1) : Math.round(c.d))}</span>`).join('');

// ── 타이틀·시작 설정(한 화면에 질문 하나씩) ─────────────────────
const WIZ = [
  {key:'name',   q:'이름을 알려 주세요', p:'스무 살로 돌아가는 사람의 이름이에요.'},
  {key:'major',  q:`${UNIVERSITY}, 어느 학과로 갈까요?`, p:'학과에 따라 시작 능력치와 어울리는 직업이 달라져요.', list:() => MAJORS, cols:2},
  {key:'origin', q:'마흔의 나는 어떤 일을 했었나요?', p:'되감기 전의 경력이 타고난 강점이 돼요.', list:() => ORIGINS, cols:1},
  {key:'regret', q:'가장 후회하는 건 무엇인가요?', p:'그 후회가 이번 생의 출발점이에요.', list:() => REGRETS, cols:1},
];
let wizStep = 0, wizName = '서윤';
const fxTags = fx => Object.keys(fx).map(k => `<i class="up">${LABEL[k] || k} +${fx[k]}</i>`).join('');
function initTitle(){
  const sv = store(SAVE_KEY); $('b-cont').style.display = sv && !sv.ending ? 'flex' : 'none';
  $('b-new').onclick = () => { wizStep = 0; renderWiz(); show('setup'); };
  $('b-cont').onclick = () => { S = store(SAVE_KEY); if(S){ show('game'); render(); } };
  $('w-back').onclick = () => { if(wizStep > 0){ wizStep--; renderWiz(); } else show('title'); };
  $('w-next').onclick = () => {
    if(wizStep === 0){ const v = $('in-name') && $('in-name').value.trim(); if(v) wizName = v; }
    if(wizStep < WIZ.length - 1){ wizStep++; renderWiz(); return; }
    S = newGame(wizName || '서윤', setupSel.origin, setupSel.regret, setupSel.major); save(); show('game'); render(); startFlow();
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
  if(id === 'job' && S.hired){ const j = jobOf(S); eff = j.eff; pay = j.pay; hp = -j.hp; st = j.stress; }
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
  const pools = {work:S.hired ? ['job', 'project', 'cert', 'job'] : (S.m < 48 ? ['study', 'intern', 'project', 'cert'] : ['jobhunt', 'project']),
    bond:['friends', 'family', 'club', dateTarget(S) ? 'date' : 'friends'], self:['journal', 'exercise', 'hobby', 'style']};
  const picks = [];
  if(S.hp < 30 || S.stress > 75) picks.push('rest');
  if(S.cash < 80) picks.push(S.hired && !inLawSchool(S) ? 'job' : (ok('tutor', 0) ? 'tutor' : 'cafe'));
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
  heart:'<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.5 1.1 4.3 2.4h2c.8-1.3 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>',
};
function paintIcons(){ document.querySelectorAll('[data-icon]').forEach(el => { if(!el.dataset.painted){ el.innerHTML = ICONS[el.dataset.icon] || ''; el.dataset.painted = '1'; } }); }
function ring(v, color, label){ const r = 17, c = 2 * Math.PI * r, f = clamp(v, 0, 100) / 100; return `<svg viewBox="0 0 46 46" aria-label="${label} ${Math.round(v)}"><circle cx="23" cy="23" r="${r}" fill="none" stroke="#dde3f2" stroke-width="5"/><circle cx="23" cy="23" r="${r}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(c * f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 23 23)"/><text x="23" y="27.5" text-anchor="middle" font-size="12.5" font-weight="800" fill="#14181B">${Math.round(v)}</text></svg>`; }
// 하단 탭 → 활동 분류. 가운데 '홈'은 스케줄 시트를 연다
const TABS = [{cat:'공부', ic:'edu'}, {cat:'일', ic:'work'}, {cat:'돈', ic:'money'}, {cat:'홈', ic:'home', home:true}, {cat:'휴식', ic:'rest'}, {cat:'나', ic:'self'}, {cat:'관계', ic:'heart'}];
let pickCat = null, activeSlot = 0;
function firstEmpty(){ const i = S.plan.findIndex(x => !x); return i < 0 ? 0 : i; }
function weakest(){ const P = {work:S.work, bond:S.bond, self:S.self}; return Object.keys(P).sort((a, b) => P[a] - P[b])[0]; }
function adviceText(){
  if(S.m === 0 && !S.seen.advice0) return {t:'스무 살의 3월이야. 한 달에 활동 세 칸. 일·관계·나, 세 기둥을 모두 50 위로 올려야 \'자유 시계\'가 열려. 아래 탭에서 활동을 골라 봐.'};
  if(S.hp < 30) return {t:'몸이 먼저야. 체력이 바닥이면 번아웃이 와. 이번 달엔 휴식 한 칸을 꼭 넣어.'};
  if(S.stress > 75) return {t:'스트레스가 너무 높아. 쉬거나 취미로 풀지 않으면 한 달을 통째로 날릴 수 있어.'};
  if(S.cash < 60) return {t:'통장이 비어 간다. 알바나 일로 자금을 먼저 채워 둬.'};
  const w = weakest(), msg = {work:'일 기둥이 가장 약해. ' + (S.hired ? '회사 업무와 프로젝트에 칸을 더 써 보자.' : S.m < 48 ? '공부와 인턴으로 진로를 준비하자.' : '구직 활동을 서두르자.'), bond:'관계 기둥이 약해. 친구, 가족, 마음에 둔 사람과 시간을 보내 봐. 전화도 좋아.', self:'나 기둥이 약해. 운동, 일기, 취미로 나를 돌보는 시간이 필요해.'};
  return {t:msg[w]};
}
function showDialog(){ const a = adviceText(); $('dlg-head').textContent = '일흔의 나'; $('dlg-body').textContent = a.t; $('dialog').hidden = false; if(S.m === 0) S.seen.advice0 = true; }
function render(){
  if(!S) return;
  const left = TOTAL_MONTHS - S.m, img = `art/${heroKey(S)}.webp`;
  $('scene').style.setProperty('--scene-bg', `url(${img})`); $('g-img').src = img;
  $('hud-avatar').style.backgroundImage = `url(art/${heroKey(S)}.webp)`;
  $('tb-date').textContent = `${yearOf(S)}년 ${monthOf(S)}월`;
  $('hud-age').textContent = `${ageOf(S)}세 · ${left}개월 남음`;
  $('hud-prog').style.width = (100 * S.m / TOTAL_MONTHS) + '%';
  const jobLine = S.hired && CAREERS[S.track] ? (inLawSchool(S) ? `${UNIVERSITY} 로스쿨` : `${CAREERS[S.track].company} · ${rankName(S)}`) : (S.track ? `${UNIVERSITY} ${majorOf(S).name} · 구직 중` : `${UNIVERSITY} ${majorOf(S).name}`);
  $('tb-sub').textContent = `${S.name} · ${jobLine}`;
  const chip = (i, label, v, warn) => `<div class="res"><i>${i}</i><span>${label}</span><b class="${warn ? 'warn' : ''}">${v}</b></div>`;
  $('hud-res').innerHTML = chip('₩', '자금', fmtMoney(S.cash), S.cash < 60) + chip('◈', '선명도', Math.round(S.clarity), S.clarity < 25) + (S.borrowed ? chip('빌', '빌린 인생', S.borrowed, true) : '') + chip('☎', '통화', callsLeft(S) + '회', false);
  $('g-hp').innerHTML = ring(S.hp, '#4cc25a', '체력'); $('g-st').innerHTML = ring(S.stress, '#ff6a4d', '스트레스');
  $('call-badge').textContent = callsLeft(S) || '';
  const full = !S.plan.some(x => !x);
  $('slots3').innerHTML = [0, 1, 2].map(i => {
    const id = S.plan[i];
    if(id === '>') return `<button class="slot3 cont" disabled><small>${SLOT_NAMES[i]}</small><b>↳ 이어서</b></button>`;
    if(!id) return `<button class="slot3 ${i === activeSlot ? 'active' : ''}" data-i="${i}"><small>${SLOT_NAMES[i]}</small><b>＋ 비어 있음</b></button>`;
    return `<button class="slot3 filled ${i === activeSlot ? 'active' : ''}" data-i="${i}"><small>${SLOT_NAMES[i]}</small><b>${ACTS[id].icon} ${actName(S, id)}</b></button>`;
  }).join('');
  document.querySelectorAll('.slot3[data-i]').forEach(b => b.onclick = () => openPicker(+b.dataset.i));
  const go = $('btn-go'); go.textContent = full ? '이번 달 시작' : '스케줄 정하기'; go.classList.toggle('ready', full);
  $('tabbar').innerHTML = TABS.map(t => `<button class="tb ${t.home ? 'home' : ''}" data-cat="${t.cat}"><span class="ic" data-icon="${t.ic}"></span><span>${t.cat}</span></button>`).join('');
  document.querySelectorAll('.tb').forEach(b => b.onclick = () => openPicker(firstEmpty(), b.dataset.cat === '홈' ? null : b.dataset.cat));
  paintIcons();
  if($('dialog').dataset.m !== String(S.m)){ $('dialog').dataset.m = S.m; showDialog(); }
}
function setPlan(i, id){
  const p = S.plan;
  const clear = j => { if(p[j] === '>'){ p[j] = null; if(p[j - 1] && ACTS[p[j - 1]] && ACTS[p[j - 1]].slots === 2) p[j - 1] = null; } else if(p[j] && ACTS[p[j]].slots === 2){ p[j] = null; p[j + 1] = null; } else p[j] = null; };
  clear(i); const a = ACTS[id];
  if(a.slots === 2){ clear(i + 1); p[i] = id; p[i + 1] = '>'; } else p[i] = id;
}
const sheetHead = (t, sub) => `<div class="sh-head"><b>${t}</b><button class="sh-x" id="x" aria-label="닫기">×</button></div>${sub ? `<div class="sub" style="margin-bottom:8px">${sub}</div>` : ''}`;
function openPicker(i, cat){
  activeSlot = i;
  if(S.plan[i] === '>') i = activeSlot = i - 1;
  if(cat) pickCat = cat; else if(!pickCat || !cat){ const lowK = weakest(); pickCat = {work:S.m < 48 ? '공부' : '일', bond:'관계', self:'나'}[lowK]; }
  const cats = ACTS_ORDER_CATS.filter(c => Object.values(ACTS).some(a => a.cat === c));
  const draw = () => {
    const ids = Object.keys(ACTS).filter(id => ACTS[id].cat === pickCat).map(id => {
      const a = ACTS[id]; let why = a.req ? a.req(S) : null; if(!why && a.cost && a.cost > S.cash) why = '자금이 모자라요'; if(!why && (a.slots || 1) > 3 - activeSlot) why = '이 칸에서는 못 해요 (2칸 필요)';
      return {id, a, why};
    }).sort((x, y) => (x.why ? 1 : 0) - (y.why ? 1 : 0));
    const spend = S.plan.reduce((t, id) => t + (id && id !== '>' && ACTS[id].cost || 0), 0);
    openSheet(sheetHead(`${yearOf(S)}년 ${monthOf(S)}월 ${SLOT_NAMES[activeSlot]} · ${pickCat}`) + `<div class="tabs">${cats.map(c => `<button class="tab ${c === pickCat ? 'on' : ''}" data-c="${c}">${c}</button>`).join('')}</div><div class="planbar"><button class="btn ghost sm" id="b-auto">✨ 추천 계획</button><button class="btn ghost sm" id="b-prev" ${S.lastPlan ? '' : 'disabled'}>↻ 지난달처럼</button></div><div class="acts">` + ids.map(({id, a, why}) => {
      const pay = id === 'job' && S.hired ? jobOf(S).pay : a.pay;
      const em = [pay ? `+${Math.round(pay * earnedMult(S))}만` : '', a.slots > 1 ? '2칸' : ''].filter(Boolean).join(' · ');
      return `<button class="act ${S.plan[activeSlot] === id ? 'on' : ''}" data-id="${id}" ${why ? 'disabled' : ''}><span class="top"><span class="ic">${a.icon}</span><b>${actName(S, id)}</b></span>${em ? `<span class="em">${em}</span>` : ''}${why ? `<span class="why">${why}</span>` : `<span class="d">${a.desc}</span><span class="tg">${actTags(S, id).map(t => `<i class="${t.c}">${t.t}</i>`).join('')}</span>`}</button>`;
    }).join('') + `</div><div class="foot">이번 달 활동비 ${spend}만 · 생활비 ${livingCost(S)}만${allowance(S) ? ` (지원 +${allowance(S)}만)` : ''}</div>`);
    $('x').onclick = () => { closeSheet(); render(); };
    $('b-auto').onclick = () => { S.plan = autoPlan(); save(); closeSheet(); render(); };
    $('b-prev').onclick = () => { if(S.lastPlan){ S.plan = S.lastPlan.slice(); save(); closeSheet(); render(); } };
    document.querySelectorAll('.tab').forEach(b => b.onclick = () => { pickCat = b.dataset.c; draw(); });
    document.querySelectorAll('.act').forEach(b => b.onclick = () => {
      setPlan(activeSlot, b.dataset.id); save();
      const nx = S.plan.findIndex(x => !x);
      if(nx < 0){ closeSheet(); render(); } else { activeSlot = nx; render(); draw(); }
    });
  };
  draw();
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
  openSheet(sheetHead('능력치', `${S.name} · ${ageOf(S)}세`) + '<h3>컨디션</h3>' + meter('', '체력', S.hp) + meter('', '스트레스', S.stress) + meter('', '선명도', S.clarity) + '<h3>세 기둥 (각 50 이상, 합 190 이상이면 자유)</h3>' + Object.keys(PILLAR).map(k => meter(k, PILLAR[k], S[k])).join('') + '<h3>능력치</h3>' + STAT_KEYS.map(k => meter('', STAT[k], S.st[k])).join('') + `<div class="foot">빌린 인생 ${S.borrowed} · 생활비 월 ${livingCost(S)}만${allowance(S) ? ` (지원 +${allowance(S)}만)` : ''}</div>`);
  $('x').onclick = closeSheet;
}
function showCareer(){
  const m = majorOf(S);
  const list = CAREER_IDS.map(id => { const c = CAREERS[id], p = fitP(S, id), cur = S.track === id;
    return `<div class="kv"><span>${c.icon} ${c.name}${cur ? ' ✔' : ''}${m.fav.includes(id) ? ' ★' : ''}<br><small class="sub">${c.company}</small></span><b>${cur && S.hired ? rankName(S) : fitLabel(p)}</b></div>`; }).join('');
  openSheet(sheetHead('진로', `${UNIVERSITY} ${m.name}${S.interest && CAREERS[S.interest] ? ' · 관심 ' + CAREERS[S.interest].name : ''}`) + `<div class="sub">★ 학과와 어울리는 직업 · 능력치가 높을수록 합격률이 올라가요.</div>` + list + (S.hired && CAREERS[S.track] ? `<div class="foot">현재 ${inLawSchool(S) ? '로스쿨 재학' : CAREERS[S.track].company + ' ' + rankName(S)} · 월급 ${jobOf(S).pay}만</div>` : '<div class="foot">3~4학년에 진로를 정하고 구직 활동을 하면 입사할 수 있어요.</div>'));
  $('x').onclick = closeSheet;
}
function showLove(){
  const ids = Object.keys(LOVERS), met = ids.filter(i => S.love[i]);
  const row = id => { const lv = LOVERS[id], v = S.love[id];
    if(!v) return `<div class="lcard"><img class="av sil" src="art/lv_${id}.webp" alt=""><span><b>???</b><small>${lv.career ? '직장에서 만날지도 몰라요' : '캠퍼스 어딘가에서 만날지도 몰라요'}</small></span><span></span></div>`;
    const callable = contactsOf(S).some(c => c.id === id);
    return `<button class="lcard" data-call="${id}" ${callable ? '' : 'disabled'}><img class="av" src="art/face_${id}_happy.webp" alt="" onerror="this.src='art/lv_${id}.webp'"><span><b>${esc(lv.name)} · ${LOVE_STAGE[v.stage] || '지인'}</b><small>${esc(lv.job || '')}</small><div class="hb"><i style="width:${clamp(v.aff, 0, 100)}%"></i></div></span><span class="cb">${callable ? '📞' : '·'}</span></button>`; };
  openSheet(sheetHead('연애', met.length ? `만난 사람 ${met.length}명 · 탭하면 전화해요` : '아직 마음에 둔 사람이 없어요.') + met.map(row).join('') + `<div class="foot">${met.length < ids.length ? '캠퍼스와 직장에서 새로운 인연을 더 만날 수 있어요. 만난 사람과는 데이트(관계 탭)로 가까워져요.' : ''}</div>`);
  $('x').onclick = closeSheet;
  document.querySelectorAll('[data-call]').forEach(b => b.onclick = async () => { const r = tryCall(S, b.dataset.call); if(typeof r === 'string'){ toast(r); return; } closeSheet(); await playEvent(r); save(); render(); });
}
function showDex(){
  const seen = store(ENDINGS_KEY) || [];
  openSheet(sheetHead('엔딩 도감', `${seen.length}/${ENDING_IDS.length} 수집`) + ENDING_IDS.map(id => { const e = ENDINGS[id], ok = seen.includes(id); return `<div class="dexrow ${ok ? '' : 'lock'}"><span class="g">${ok ? e.icon : '❔'}</span><span><b>${ok ? e.title : '???'}</b><small>${ok ? e.sub : '아직 보지 못한 엔딩'}</small></span></div>`; }).join('') + `<h3>이번 생의 기록</h3><div class="txt" style="font-size:13px">${S.album.length ? S.album.map(esc).join('\n') : '아직 기록이 없어요.'}</div>`);
  $('x').onclick = closeSheet;
}

// ── 이벤트 재생 ───────────────────────────────────────────────
// 이벤트는 9:16 풀스크린: 일러스트가 화면을 채우고 글과 선택지는 아래 패널에 얹는다
const PLACE_FULL = {rain:'art/cover.webp', shop:'art/bg_shop.webp'};
function evOpen(ev, inner){
  const el = $('ev'), img = ev.img || PLACE_FULL[ev.place];
  el.className = 'evcard on p-' + (ev.place || 'room');
  el.style.backgroundImage = img ? `url(${img})` : 'none';
  el.innerHTML = `<div class="evshade"></div>${img ? '' : `<div class="evicon">${PLACE_ICON[ev.place] || '🏠'}</div>`}<div class="evpanel" id="evpanel">${inner}</div>`;
  $('evpanel').scrollTop = 0;
}
function evClose(){ $('ev').classList.remove('on'); }
function playEvent(ev){
  return new Promise(resolve => {
    S.seen[ev.id] = true; S.cd[ev.id] = S.m;
    const head = (ev.speaker ? `<span class="who">${esc(ev.speaker)}</span>` : '') + `<h2>${esc(ev.title)}</h2>`;
    const beats = (ev.beats || []).slice();
    const nextBeat = () => {
      if(beats.length){ const t = beats.shift(); evOpen(ev, head + `<div class="txt">${esc(t)}</div><button class="btn" id="enx">다음</button>`); $('enx').onclick = nextBeat; return; }
      const cs = ev.choices; evOpen(ev, head + `<div class="txt">${esc(ev.text(S))}</div>` + cs.map((c, k) => `<button class="ch" data-k="${k}"><b>${esc(c.label)}</b><span>${esc(c.sub || '')}</span></button>`).join(''));
      document.querySelectorAll('#ev .ch').forEach(b => b.onclick = () => {
        const out = cs[+b.dataset.k].run(S); save();
        if(!out.text){ evClose(); render(); return resolve(); }
        evOpen(ev, head + faceImg(out.chips, ev.lover) + `<div class="txt">${esc(out.text)}</div><div class="chips" style="clear:both">${chipHTML(out.chips)}</div><button class="btn" id="enx" style="margin-top:14px">계속</button>`);
        $('enx').onclick = () => { evClose(); render(); resolve(); };
      });
    };
    nextBeat();
  });
}
const alertSheet = (title, body, chips, btn) => new Promise(res => { openSheet(`<div class="sh-head"><b>${esc(title)}</b></div><div class="txt">${body}</div><div class="chips">${chipHTML(chips)}</div><button class="btn blue" id="nx" style="margin-top:14px">${btn || '계속'}</button>`); $('nx').onclick = () => { closeSheet(); res(); }; });

// ── 한 달 진행 ────────────────────────────────────────────────
const ACT_ART = new Set(['study','cert','tutor','cafe','intern','project','jobhunt','job','future','exercise','journal','hobby','style','family','friends','club','date','travel','rest']);
// 직업 그림은 나이대별: 25살(기본)·27살·30살 (인턴은 항상 기본)
function jobArtFor(c, intern){ const k = intern ? '' : (S.m >= 96 ? '_30' : S.m >= 72 ? '_27' : ''); return `art/job_${c}${k}.webp`; }
function showAct(slotName, id, out){
  return new Promise(res => {
    const a = ACTS[id], el = $('act');
    const jobArt = id === 'job' ? (inLawSchool(S) ? 'art/job_lawschool.webp' : (CAREERS[S.track] ? jobArtFor(S.track) : null)) : null;
    const internArt = id === 'intern' && CAREERS[S.interest] ? jobArtFor(S.interest, true) : null;
    const duoArt = id === 'job' && out.duo ? `art/duo_${out.duo}.webp` : null;
    el.style.backgroundImage = duoArt ? `url(${duoArt}), url(${jobArt || 'art/act_job.webp'}), url(art/act_job.webp)` : jobArt ? `url(${jobArt}), url(art/act_job.webp)` : internArt ? `url(${internArt}), url(art/act_intern.webp)` : ACT_ART.has(id) ? `url(art/act_${id}.webp)` : 'none';
    el.innerHTML = `<div class="ashade"></div><div class="atop"><span class="who">${slotName}</span></div><div class="abot"><h2>${a.icon} ${esc(actName(S, id))}</h2>${out.note ? `<div class="txt" style="margin:4px 0 8px">${esc(out.note)}</div>` : `<div class="txt" style="margin:4px 0 8px;opacity:.85">${esc(a.desc)}</div>`}<div class="chips">${chipHTML(out.ch)}</div><button class="btn" id="anx" style="margin-top:14px">다음</button></div>`;
    el.classList.add('on'); $('anx').onclick = () => { el.classList.remove('on'); res(); };
  });
}
async function runMonth(){
  seedMonth(S); S.lastPlan = S.plan.slice();
  for(let i = 0; i < 3; i++){
    let id = S.plan[i]; if(!id || id === '>') continue; let a = ACTS[id]; const first = i;
    let fell = false; if(a.cost && a.cost > S.cash || (a.req && a.req(S))){ fell = true; id = 'rest'; a = ACTS[id]; }
    const out = doAction(S, id); i += a.slots - 1; if(fell) out.note = '조건이 맞지 않아 계획을 바꿔 쉬었다.';
    await showAct(SLOT_NAMES[first], id, out);
    if(out.burnout) break;
  }
  const sch = settle(S);
  await alertSheet(`${yearOf(S)}년 ${monthOf(S)}월 정산`, '생활비·균형을 정산했어요.', sch, '계속');
  if(!S.ending){
    const fx_ = fixedEvents(S); for(const f of fx_){ await playEvent(f); if(S.ending) break; }
    if(!S.ending){ const ev = fx_.length >= 2 ? null : (R() < 0.7 ? pickEvent(S) : null); if(ev) await playEvent(ev); }
  }
  if(!S.ending) S.m++;
  S.plan = [null, null, null];
  if(S.m >= TOTAL_MONTHS || S.ending){ S.ending = S.ending || computeEnding(S); save(); return showEnding(); }
  save(); render();
}
async function startFlow(){ // 새 게임: 프롤로그 먼저
  seedMonth(S); await playEvent(PROLOGUE); save(); render();
}

// ── 엔딩 ──────────────────────────────────────────────────────
function showEnding(){
  const id = S.ending || computeEnding(S), e = ENDINGS[id]; const P = finalPillars(S);
  const seen = store(ENDINGS_KEY) || []; if(!seen.includes(id)){ seen.push(id); store(ENDINGS_KEY, seen); }
  $('end').innerHTML = `<div class="endbg" style="background-image:url(art/${e.free ? 'age30' : 'cover'}.webp)"></div><div class="endscroll"><div class="endspacer"></div><div class="endcard ending"><div class="big">${e.icon}</div><span class="tag ${e.free ? '' : 'ret'}">${e.sub}</span><h1>${e.title}</h1>
   <div class="pillars">${Object.keys(PILLAR).map(k => `<div class="pcard ${k}"><div class="pt"><span>${PILLAR[k]}</span><b>${Math.round(P[k])}</b></div><div class="t"><i style="width:${P[k]}%"></i><u></u></div></div>`).join('')}</div>
   <div class="letter">${esc(e.letter.replace(/\{name\}/g, S.name))}\n\n— 일흔 살의 나로부터</div>
   <p class="sub">엔딩 ${seen.length}/${ENDING_IDS.length} 수집 · 빌린 인생 ${S.borrowed} · 기억 선명도 ${Math.round(S.clarity)}</p>
   <button class="btn" id="b-again">${e.free ? '다시 도전하기' : '한 번 더 되감기'}</button></div></div>`;
  $('b-again').onclick = () => { store(SAVE_KEY, null); S = null; initTitle(); show('title'); };
  show('end');
}

// ── 메뉴·기록 ─────────────────────────────────────────────────
function initGame(){
  $('btn-go').onclick = () => { if(S.plan.some(x => !x)){ openPicker(firstEmpty()); return; } $('btn-go').disabled = true; $('dialog').hidden = true; runMonth().finally(() => { $('btn-go').disabled = false; }); };
  $('b-call').onclick = openPhone;
  $('btn-advice').onclick = () => { if($('dialog').hidden) showDialog(); else $('dialog').hidden = true; };
  $('dlg-x').onclick = () => { $('dialog').hidden = true; };
  document.querySelectorAll('[data-sheet]').forEach(b => b.onclick = () => ({stat:showStats, career:showCareer, love:showLove, dex:showDex}[b.dataset.sheet])());
  $('b-menu').onclick = () => { openSheet(sheetHead('메뉴') + `<div class="menu-list"><button class="btn ghost sm" id="m-title">🏠 타이틀로 (자동 저장)</button></div>`);
    $('x').onclick = closeSheet;
    $('m-title').onclick = () => { save(); closeSheet(); initTitle(); show('title'); }; };
  $('ov').addEventListener('click', e => { if(e.target === $('ov') && !document.querySelector('#sheet #nx')){ closeSheet(); if(S) render(); } });
}
initTitle(); initGame(); paintIcons();

// 설치형 앱(PWA): 서비스워커로 그림을 기기에 캐시해 두 번째부터는 빠르게, 오프라인에서도 열린다
try{ if('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {}); }catch(e){}
