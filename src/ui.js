// ── UI (ENGINE 밖) ─────────────────────────────────────────────
const SAVE_KEY = 'rewind-ten-v1', ENDINGS_KEY = 'rewind-ten-endings-v1';
let S = null, setupSel = {origin:'office', regret:'work'};
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;'}[c]));
const PLACE_ICON = {rain:'🌧️', shop:'⏳', night:'🌙', campus:'🎓', cafe:'☕', room:'🏠'};
const PLACE_IMG = {shop:'art/bg_shop.jpg', rain:'art/bg_alley.jpg'}, PLACE_POS = {rain:'50% 50%', shop:'50% 40%'};
const heroKey = S => S.m < 24 ? 'age20' : S.m < 48 ? 'age22' : S.m < 72 ? 'age25' : S.m < 96 ? 'age27' : 'age30';
// 이벤트 결과의 칩으로 표정을 고른다
function faceFor(ch){ let up = 0, down = 0, tired = false; for(const c of ch || []){ if(c.label === '스트레스' ? c.d > 3 : c.label === '체력' && c.d < -3) tired = true; if(c.label in PILLAR || c.label === '기억 선명도') (c.d > 0 ? up += c.d : down -= c.d); }
  return tired ? 'tired' : down > up + 1 ? 'sad' : up >= 4 ? 'happy' : up > 0 ? 'shy' : 'determined'; }
const faceImg = ch => `<img class="face" src="art/face_${faceFor(ch)}.jpg" alt="" onerror="this.style.display='none'">`;
function store(k, v){ try{ if(v === undefined) return JSON.parse(localStorage.getItem(k)); if(v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); }catch(e){ return null; } }
function save(){ if(S) store(SAVE_KEY, S); }
function show(id){ document.querySelectorAll('.screen').forEach(e => e.classList.toggle('on', e.id === id)); window.scrollTo(0, 0); }
function openSheet(html){ $('sheet').innerHTML = html; $('ov').classList.add('on'); $('sheet').scrollTop = 0; }
function closeSheet(){ $('ov').classList.remove('on'); }
const chipHTML = ch => (ch || []).filter(c => Math.abs(c.d) >= 0.05).map(c => `<span class="chip ${c.d > 0 ? (c.label === '스트레스' ? 'down' : 'up') : (c.label === '스트레스' ? 'up' : 'down')}">${esc(c.label)} ${c.d > 0 ? '+' : ''}${c.money ? fmtMoney(c.d) : (Math.abs(c.d) < 1 ? c.d.toFixed(1) : Math.round(c.d))}</span>`).join('');

// ── 타이틀·셋업 ───────────────────────────────────────────────
function initTitle(){
  const sv = store(SAVE_KEY); $('b-cont').style.display = sv && !sv.ending ? 'block' : 'none';
  $('b-new').onclick = () => { renderSetup(); show('setup'); };
  $('b-cont').onclick = () => { S = store(SAVE_KEY); if(S){ show('game'); render(); } };
  $('b-go').onclick = () => { S = newGame($('in-name').value.trim() || '서윤', setupSel.origin, setupSel.regret); save(); show('game'); render(); startFlow(); };
}
function renderSetup(){
  const mk = (arr, key, fn) => arr.map(o => `<button class="opt ${setupSel[key] === o.id ? 'sel' : ''}" data-k="${key}" data-id="${o.id}"><span class="ic">${o.icon}</span><span><b>${o.name}</b><br><span class="sub">${o.desc}</span></span></button>`).join('');
  $('o-origin').innerHTML = mk(ORIGINS, 'origin'); $('o-regret').innerHTML = mk(REGRETS, 'regret');
  document.querySelectorAll('.opt').forEach(b => b.onclick = () => { setupSel[b.dataset.k] = b.dataset.id; renderSetup(); });
}

// ── 메인 화면 ─────────────────────────────────────────────────
function render(){
  if(!S) return;
  const left = TOTAL_MONTHS - S.m;
  $('h-date').textContent = `${yearOf(S)}년 ${monthOf(S)}월 · ${S.name} ${ageOf(S)}세`;
  $('h-left').textContent = `남은 시간 ${left}개월`;
  $('hero-img').style.display = ''; $('hero-img').src = `art/${heroKey(S)}.jpg`;
  $('h-sand').style.width = (100 * S.m / TOTAL_MONTHS) + '%';
  $('h-chips').innerHTML = [`💰 ${fmtMoney(S.cash)}`, `❤️ ${Math.round(S.hp)}`, `😮‍💨 ${Math.round(S.stress)}`, `🔮 ${Math.round(S.clarity)}`].map(t => `<span class="chip">${t}</span>`).join('');
  $('pillars').innerHTML = Object.keys(PILLAR).map(k => `<div class="bar ${k}"><span>${PILLAR[k]}</span><div class="t"><i style="width:${S[k]}%"></i><u></u></div><b>${Math.round(S[k])}</b></div>`).join('');
  $('stats').innerHTML = STAT_KEYS.map(k => `<div>${STAT[k]}<b>${Math.round(S.st[k])}</b></div>`).join('') + `<div>빌린 인생<b>${S.borrowed}</b></div>`;
  $('slots').innerHTML = [0, 1, 2].map(i => {
    const id = S.plan[i];
    if(id === '>') return `<button class="slot cont" disabled><span class="lb">${SLOT_NAMES[i]}</span><span class="ds">↑ 이어지는 칸</span></button>`;
    if(!id) return `<button class="slot" data-i="${i}"><span class="lb">${SLOT_NAMES[i]}</span><span class="ds">＋ 활동을 고르세요</span></button>`;
    const a = ACTS[id]; return `<button class="slot" data-i="${i}"><span class="lb">${SLOT_NAMES[i]}</span><span style="font-size:22px">${a.icon}</span><span><span class="nm">${actName(S, id)}</span><br><span class="ds">${a.desc}</span></span></button>`;
  }).join('');
  document.querySelectorAll('.slot[data-i]').forEach(b => b.onclick = () => openPicker(+b.dataset.i));
  $('b-run').disabled = S.plan.some(x => !x);
}
function setPlan(i, id){
  const p = S.plan;
  const clear = j => { if(p[j] === '>'){ p[j] = null; if(p[j - 1] && ACTS[p[j - 1]] && ACTS[p[j - 1]].slots === 2) p[j - 1] = null; } else if(p[j] && ACTS[p[j]].slots === 2){ p[j] = null; p[j + 1] = null; } else p[j] = null; };
  clear(i); const a = ACTS[id];
  if(a.slots === 2){ clear(i + 1); p[i] = id; p[i + 1] = '>'; } else p[i] = id;
}
function openPicker(i){
  let html = `<h2>${SLOT_NAMES[i]}에 무엇을 할까요?</h2>`;
  for(const cat of ACTS_ORDER_CATS){
    const ids = Object.keys(ACTS).filter(id => ACTS[id].cat === cat); if(!ids.length) continue;
    html += `<div class="cat">${cat}</div><div class="acts">` + ids.map(id => {
      const a = ACTS[id]; let why = a.req ? a.req(S) : null; if(!why && a.cost && a.cost > S.cash) why = '자금 부족'; if(!why && a.slots > 3 - i) why = '칸이 모자라요';
      const meta = [a.cost ? `-${a.cost}만` : '', a.pay ? `+${Math.round(a.pay * earnedMult(S))}만` : '', a.slots > 1 ? '2칸' : ''].filter(Boolean).join(' · ');
      return `<button class="act" data-id="${id}" ${why ? 'disabled' : ''}><span class="ic">${a.icon}</span><span><b>${actName(S, id)}</b> <span class="sub">${meta}</span><small>${why || a.desc}</small></span></button>`;
    }).join('') + `</div>`;
  }
  openSheet(html + `<button class="btn ghost" style="margin-top:14px" id="x">닫기</button>`);
  $('x').onclick = closeSheet;
  document.querySelectorAll('.act').forEach(b => b.onclick = () => { setPlan(i, b.dataset.id); closeSheet(); render(); save(); });
}

// ── 이벤트 재생 ───────────────────────────────────────────────
function playEvent(ev){
  return new Promise(resolve => {
    S.seen[ev.id] = true; S.cd[ev.id] = S.m;
    const pimg = ev.img || PLACE_IMG[ev.place]; const head = (pimg ? `<div class="place img" style="background-image:url(${pimg});background-position:${ev.img ? '50% 2%' : (PLACE_POS[ev.place] || '50% 50%')}"></div>` : `<div class="place ${ev.place || 'room'}">${PLACE_ICON[ev.place] || '🏠'}</div>`) + (ev.speaker ? `<span class="who">${esc(ev.speaker)}</span>` : '') + `<h2>${esc(ev.title)}</h2>`;
    const beats = (ev.beats || []).slice();
    const nextBeat = () => {
      if(beats.length){ const t = beats.shift(); openSheet(head + `<div class="txt">${esc(t)}</div><button class="btn" id="nx">다음</button>`); $('nx').onclick = nextBeat; return; }
      const cs = ev.choices; openSheet(head + `<div class="txt">${esc(ev.text(S))}</div>` + cs.map((c, k) => `<button class="ch" data-k="${k}"><b>${esc(c.label)}</b><span>${esc(c.sub || '')}</span></button>`).join(''));
      document.querySelectorAll('.ch').forEach(b => b.onclick = () => {
        const out = cs[+b.dataset.k].run(S); save();
        if(!out.text){ closeSheet(); render(); return resolve(); }
        openSheet(head + faceImg(out.chips) + `<div class="txt">${esc(out.text)}</div><div class="chips" style="clear:both">${chipHTML(out.chips)}</div><button class="btn" id="nx" style="margin-top:14px">계속</button>`);
        $('nx').onclick = () => { closeSheet(); render(); resolve(); };
      });
    };
    nextBeat();
  });
}
const alertSheet = (title, body, chips, btn) => new Promise(res => { openSheet(`<h2>${esc(title)}</h2><div class="txt">${body}</div><div class="chips">${chipHTML(chips)}</div><button class="btn" id="nx" style="margin-top:14px">${btn || '계속'}</button>`); $('nx').onclick = () => { closeSheet(); res(); }; });

// ── 한 달 진행 ────────────────────────────────────────────────
async function runMonth(){
  seedMonth(S); const lines = []; S.lastPlan = S.plan.slice();
  for(let i = 0; i < 3; i++){
    let id = S.plan[i]; if(!id || id === '>') continue; let a = ACTS[id];
    if(a.cost && a.cost > S.cash || (a.req && a.req(S))){ lines.push(`<div class="card"><b>${SLOT_NAMES[i]} · 계획 변경</b><div class="sub">조건이 맞지 않아 쉬었어요.</div></div>`); id = 'rest'; a = ACTS[id]; }
    const out = doAction(S, id); i += a.slots - 1;
    lines.push(`<div class="card"><b>${SLOT_NAMES[i - a.slots + 1]} · ${a.icon} ${actName(S, id)}</b>${out.note ? `<div class="txt" style="margin:4px 0">${esc(out.note)}</div>` : ''}<div class="chips" style="margin-top:6px">${chipHTML(out.ch)}</div></div>`);
    if(out.burnout) break;
  }
  const sch = settle(S);
  lines.push(`<div class="card"><b>월말 정산</b> <span class="sub">생활비·균형</span><div class="chips" style="margin-top:6px">${chipHTML(sch)}</div></div>`);
  await new Promise(res => { openSheet(`<h2>${yearOf(S)}년 ${monthOf(S)}월 결과</h2>${lines.join('')}<button class="btn" id="nx" style="margin-top:14px">계속</button>`); $('nx').onclick = () => { closeSheet(); res(); }; });
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
  $('end').innerHTML = `<div class="ending" style="padding-top:4vh"><img class="endimg" src="art/${e.free ? 'age30' : 'cover'}.jpg" alt="" onerror="this.style.display='none'"><div class="big">${e.icon}</div><span class="tag ${e.free ? '' : 'ret'}">${e.sub}</span><h1>${e.title}</h1>
   <div class="pillars" style="text-align:left">${Object.keys(PILLAR).map(k => `<div class="bar ${k}"><span>${PILLAR[k]}</span><div class="t"><i style="width:${P[k]}%"></i><u></u></div><b>${Math.round(P[k])}</b></div>`).join('')}</div>
   <div class="letter">${esc(e.letter.replace(/\{name\}/g, S.name))}\n\n— 일흔 살의 나로부터</div>
   <p class="sub">엔딩 ${seen.length}/${ENDING_IDS.length} 수집 · 빌린 인생 ${S.borrowed} · 기억 선명도 ${Math.round(S.clarity)}</p>
   <button class="btn" id="b-again">${e.free ? '다시 도전하기' : '한 번 더 되감기'}</button></div>`;
  $('b-again').onclick = () => { store(SAVE_KEY, null); S = null; initTitle(); show('title'); };
  show('end');
}

// ── 메뉴·기록 ─────────────────────────────────────────────────
function initGame(){
  $('b-run').onclick = () => { $('b-run').disabled = true; runMonth(); };
  $('b-log').onclick = () => { openSheet(`<h2>기록</h2><div class="txt">${S.album.length ? S.album.map(esc).join('\n') : '아직 기록이 없어요.'}</div><div class="sub">연애: ${Object.keys(S.love).map(i => `${LOVERS[i].name} ${LOVE_STAGE[S.love[i].stage] || ''} ${Math.round(S.love[i].aff)}`).join(' / ') || '없음'}</div><button class="btn ghost" id="x" style="margin-top:14px">닫기</button>`); $('x').onclick = closeSheet; };
  $('b-menu').onclick = () => { openSheet(`<h2>메뉴</h2><button class="btn ghost" id="m-prev">지난달 계획 반복</button><button class="btn ghost" id="m-theme" style="margin-top:8px">밝은/어두운 화면</button><button class="btn ghost" id="m-title" style="margin-top:8px">타이틀로 (자동 저장)</button><button class="btn ghost" id="x" style="margin-top:8px">닫기</button>`);
    $('x').onclick = closeSheet;
    $('m-prev').onclick = () => { if(S.lastPlan) S.plan = S.lastPlan.slice(); closeSheet(); render(); };
    $('m-theme').onclick = () => { const d = document.documentElement; d.dataset.theme = d.dataset.theme === 'light' ? 'dark' : 'light'; try{ localStorage.setItem('rewind-ten-theme', d.dataset.theme); }catch(e){} closeSheet(); };
    $('m-title').onclick = () => { save(); closeSheet(); initTitle(); show('title'); }; };
  $('ov').addEventListener('click', e => { if(e.target === $('ov') && !document.querySelector('#sheet .ch, #sheet #nx')) closeSheet(); });
}
try{ const t = localStorage.getItem('rewind-ten-theme'); if(t) document.documentElement.dataset.theme = t; }catch(e){}
initTitle(); initGame();
