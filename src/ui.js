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
  $('w-q').innerHTML = `<h2>${esc(st.q)}</h2><p class="sub">${esc(st.p)}</p>`;
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
function resCard(label, v, bad){ return `<div class="rc ${bad ? 'warn' : ''}"><small>${label}</small><b>${Math.round(v)}</b><div class="mini"><i style="width:${clamp(v, 0, 100)}%"></i></div></div>`; }
function render(){
  if(!S) return;
  const left = TOTAL_MONTHS - S.m;
  $('h-date').textContent = `${yearOf(S)}년 ${monthOf(S)}월`;
  const jobLine = S.hired && CAREERS[S.track] ? (inLawSchool(S) ? `${UNIVERSITY} 로스쿨` : `${CAREERS[S.track].company} · ${rankName(S)}`) : (S.track ? `${UNIVERSITY} ${majorOf(S).name} · 구직 중` : `${UNIVERSITY} ${majorOf(S).name}`);
  $('h-job').textContent = `${S.name} ${ageOf(S)}세 · ${jobLine}`;
  $('h-left').textContent = `${left}개월 남음`;
  $('g-bg').style.backgroundImage = `url(art/${heroKey(S)}.webp)`;
  $('h-sand').style.width = (100 * S.m / TOTAL_MONTHS) + '%';
  $('h-res').innerHTML = `<div class="rc"><small>💰 자금</small><b>${fmtMoney(S.cash)}</b></div>` + resCard('❤️ 체력', S.hp, S.hp < 30) + resCard('😮‍💨 스트레스', S.stress, S.stress > 70) + resCard('🔮 선명도', S.clarity, false);
  $('pillars').innerHTML = Object.keys(PILLAR).map(k => `<div class="pcard ${k} ${S[k] < 30 ? 'low' : ''}"><div class="pt"><span>${PILLAR[k]}</span><b>${Math.round(S[k])}</b></div><div class="t"><i style="width:${S[k]}%"></i><u></u></div></div>`).join('');
  $('slots').innerHTML = [0, 1, 2].map(i => {
    const id = S.plan[i];
    if(id === '>') return `<button class="slot cont" disabled><span class="lb">${SLOT_NAMES[i]}</span><span class="ic">⏩</span><span class="ds">이어지는 칸</span></button>`;
    if(!id) return `<button class="slot" data-i="${i}"><span class="lb">${SLOT_NAMES[i]}</span><span class="ic">＋</span><span class="ds">활동 고르기</span></button>`;
    const a = ACTS[id];
    return `<button class="slot filled" data-i="${i}"><span class="lb">${SLOT_NAMES[i]}</span><span class="ic">${a.icon}</span><span class="nm">${actName(S, id)}</span><span class="tg">${actTags(S, id, 2).map(t => `<i class="${t.c}">${t.t}</i>`).join('')}</span></button>`;
  }).join('');
  document.querySelectorAll('.slot[data-i]').forEach(b => b.onclick = () => openPicker(+b.dataset.i));
  $('b-run').disabled = S.plan.some(x => !x);
  $('b-prev').disabled = !S.lastPlan;
  $('call-badge').textContent = callsLeft(S) || '';
}
function setPlan(i, id){
  const p = S.plan;
  const clear = j => { if(p[j] === '>'){ p[j] = null; if(p[j - 1] && ACTS[p[j - 1]] && ACTS[p[j - 1]].slots === 2) p[j - 1] = null; } else if(p[j] && ACTS[p[j]].slots === 2){ p[j] = null; p[j + 1] = null; } else p[j] = null; };
  clear(i); const a = ACTS[id];
  if(a.slots === 2){ clear(i + 1); p[i] = id; p[i + 1] = '>'; } else p[i] = id;
}
const CAT_ICON = {'공부':'📖', '일':'💼', '돈':'💰', '관계':'💞', '나':'🌿', '휴식':'🛌'};
let pickCat = null;
function openPicker(i){
  const P = {work:S.work, bond:S.bond, self:S.self}, lowK = Object.keys(P).sort((a, b) => P[a] - P[b])[0];
  if(!pickCat) pickCat = {work:S.m < 48 ? '공부' : '일', bond:'관계', self:'나'}[lowK];
  const cats = ACTS_ORDER_CATS.filter(c => Object.values(ACTS).some(a => a.cat === c));
  const draw = () => {
    const ids = Object.keys(ACTS).filter(id => ACTS[id].cat === pickCat).map(id => {
      const a = ACTS[id]; let why = a.req ? a.req(S) : null; if(!why && a.cost && a.cost > S.cash) why = '자금이 모자라요'; if(!why && (a.slots || 1) > 3 - i) why = '이 칸에서는 못 해요 (2칸 필요)';
      return {id, a, why};
    }).sort((x, y) => (x.why ? 1 : 0) - (y.why ? 1 : 0));
    openSheet(`<div class="picker"><div class="phead"><h2>${SLOT_NAMES[i]}에 무엇을 할까요?</h2><div class="tabs">${cats.map(c => `<button class="tab ${c === pickCat ? 'on' : ''}" data-c="${c}"><span>${CAT_ICON[c] || ''}</span>${c}</button>`).join('')}</div></div><div class="acts">` + ids.map(({id, a, why}) => {
      const pay = id === 'job' && S.hired ? jobOf(S).pay : a.pay;
      const em = [pay ? `+${Math.round(pay * earnedMult(S))}만` : '', a.slots > 1 ? '2칸' : ''].filter(Boolean).join(' · ');
      return `<button class="act" data-id="${id}" ${why ? 'disabled' : ''}><span class="ic">${a.icon}</span><span><span class="top"><b>${actName(S, id)}</b><em>${em}</em></span><small>${why || a.desc}</small>${why ? '' : `<span class="tg">${actTags(S, id).map(t => `<i class="${t.c}">${t.t}</i>`).join('')}</span>`}</span></button>`;
    }).join('') + `</div><button class="btn ghost sm" style="margin-top:14px" id="x">닫기</button></div>`);
    $('x').onclick = closeSheet;
    document.querySelectorAll('.tab').forEach(b => b.onclick = () => { pickCat = b.dataset.c; draw(); });
    document.querySelectorAll('.act').forEach(b => b.onclick = () => { setPlan(i, b.dataset.id); closeSheet(); render(); save(); });
  };
  draw();
}

// ── 전화하기: 친구·엄마·썸·연인 (한 달 2회, 활동 칸 소모 없음) ─────────────
function toast(msg){ const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; $('app').appendChild(t); setTimeout(() => t.remove(), 1800); }
function openPhone(){
  const left = callsLeft(S);
  const rows = contactsOf(S).map(c => { const done = calledThisMonth(S, c.id), dis = done || left <= 0;
    return `<button class="contact" data-id="${c.id}" ${dis ? 'disabled' : ''}><img class="av" src="${c.img}" alt="" onerror="this.style.visibility='hidden'"><span class="ci"><b>${esc(c.name)}</b><small>${esc(c.sub)}${done ? ' · 이번 달 통화함' : ''}</small></span><span class="cb">📞</span></button>`; }).join('');
  openSheet(`<h2>전화하기</h2><p class="sub">이번 달 통화 ${left}회 남음 · 활동 칸은 쓰지 않아요</p><div class="contacts">${rows}</div><button class="btn ghost sm" id="x" style="margin-top:12px">닫기</button>`);
  $('x').onclick = closeSheet;
  document.querySelectorAll('.contact').forEach(b => b.onclick = async () => {
    const r = tryCall(S, b.dataset.id); if(typeof r === 'string'){ toast(r); return; }
    closeSheet(); await playEvent(r); save(); render();
  });
}
function showStats(){
  const rows = STAT_KEYS.map(k => `<div class="srow"><span>${STAT[k]}</span><div class="t"><i style="width:${S.st[k]}%"></i></div><b>${Math.round(S.st[k])}</b></div>`).join('');
  openSheet(`<h2>능력치</h2><p class="sub">${UNIVERSITY} ${majorOf(S).name}${S.hired && CAREERS[S.track] ? ' · ' + CAREERS[S.track].company + ' ' + rankName(S) : ''}</p><div class="statrows">${rows}</div><p class="sub" style="margin-top:12px">빌린 인생 ${S.borrowed} · 생활비 월 ${livingCost(S)}만${allowance(S) ? ` (지원 +${allowance(S)}만)` : ''}</p><button class="btn ghost sm" id="x" style="margin-top:14px">닫기</button>`);
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
const alertSheet = (title, body, chips, btn) => new Promise(res => { openSheet(`<h2>${esc(title)}</h2><div class="txt">${body}</div><div class="chips">${chipHTML(chips)}</div><button class="btn" id="nx" style="margin-top:14px">${btn || '계속'}</button>`); $('nx').onclick = () => { closeSheet(); res(); }; });

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
  $('b-run').onclick = () => { $('b-run').disabled = true; runMonth(); };
  $('b-auto').onclick = () => { S.plan = autoPlan(); render(); save(); };
  $('b-prev').onclick = () => { if(S.lastPlan){ S.plan = S.lastPlan.slice(); render(); save(); } };
  $('b-call').onclick = openPhone;
  $('b-stat').onclick = showStats;
  $('b-log').onclick = () => { openSheet(`<h2>기록</h2><div class="txt">${S.album.length ? S.album.map(esc).join('\n') : '아직 기록이 없어요.'}</div><p class="sub">연애: ${Object.keys(S.love).map(i => `${LOVERS[i].name} ${LOVE_STAGE[S.love[i].stage] || ''} ${Math.round(S.love[i].aff)}`).join(' / ') || '없음'}</p><button class="btn ghost sm" id="x" style="margin-top:14px">닫기</button>`); $('x').onclick = closeSheet; };
  $('b-menu').onclick = () => { openSheet(`<h2>메뉴</h2><div style="display:grid;gap:10px"><button class="btn ghost sm" id="m-theme">🌗 밝은/어두운 화면</button><button class="btn ghost sm" id="m-title">🏠 타이틀로 (자동 저장)</button><button class="btn ghost sm" id="x">닫기</button></div>`);
    $('x').onclick = closeSheet;
    $('m-theme').onclick = () => { const d = document.documentElement; d.dataset.theme = d.dataset.theme === 'light' ? 'dark' : 'light'; try{ localStorage.setItem('rewind-ten-theme', d.dataset.theme); }catch(e){} closeSheet(); };
    $('m-title').onclick = () => { save(); closeSheet(); initTitle(); show('title'); }; };
  $('ov').addEventListener('click', e => { if(e.target === $('ov') && !document.querySelector('#sheet #nx')) closeSheet(); });
}
try{ const t = localStorage.getItem('rewind-ten-theme'); if(t) document.documentElement.dataset.theme = t; }catch(e){}
initTitle(); initGame();

// 설치형 앱(PWA): 서비스워커로 그림을 기기에 캐시해 두 번째부터는 빠르게, 오프라인에서도 열린다
try{ if('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {}); }catch(e){}
