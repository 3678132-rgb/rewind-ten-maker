// ── UI (ENGINE 밖) ─────────────────────────────────────────────
const SAVE_KEY = 'rewind-ten-v1', ENDINGS_KEY = 'rewind-ten-endings-v1';
let S = null, setupSel = {major:'biz', origin:'office', regret:'work'};
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;'}[c]));
const PLACE_ICON = {rain:'🌧️', shop:'⏳', night:'🌙', campus:'🎓', cafe:'☕', room:'🏠'};
const PLACE_IMG = {shop:'art/bg_shop.jpg', rain:'art/bg_alley.jpg'}, PLACE_POS = {rain:'50% 50%', shop:'50% 40%'};
const heroKey = S => S.m < 24 ? 'age20' : S.m < 48 ? 'age22' : S.m < 72 ? 'age25' : S.m < 96 ? 'age27' : 'age30';
// 이벤트 결과의 칩으로 표정을 고른다
function faceFor(ch){ let up = 0, down = 0, tired = false; for(const c of ch || []){ if(c.label === '스트레스' ? c.d > 3 : c.label === '체력' && c.d < -3) tired = true; if(c.label in PILLAR || c.label === '기억 선명도') (c.d > 0 ? up += c.d : down -= c.d); }
  return tired ? 'tired' : down > up + 1 ? 'sad' : up >= 4 ? 'happy' : up > 0 ? 'shy' : 'determined'; }
// 연애 인물의 표정: 이번 선택으로 바뀐 호감도에 따라 (happy·shy·tender·surprised·serious·sad)
function loverFace(id, ch){ const lv = LOVERS[id]; const c = (ch || []).find(x => lv && x.label === lv.name + ' 호감'); const d = c ? c.d : 0;
  return d >= 8 ? 'happy' : d >= 3 ? 'shy' : d > 0 ? 'tender' : d <= -6 ? 'sad' : d < 0 ? 'serious' : 'surprised'; }
const faceImg = (ch, lover) => lover && LOVERS[lover] ? `<img class="face" src="art/face_${lover}_${loverFace(lover, ch)}.jpg" alt="" onerror="this.src='art/lv_${lover}.jpg'">` : `<img class="face" src="art/face_${faceFor(ch)}.jpg" alt="" onerror="this.style.display='none'">`;
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
  $('b-go').onclick = () => { S = newGame($('in-name').value.trim() || '서윤', setupSel.origin, setupSel.regret, setupSel.major); save(); show('game'); render(); startFlow(); };
}
function renderSetup(){
  const mk = (arr, key, fn) => arr.map(o => `<button class="opt ${setupSel[key] === o.id ? 'sel' : ''}" data-k="${key}" data-id="${o.id}"><span class="ic">${o.icon}</span><span><b>${o.name}</b><br><span class="sub">${o.desc}</span></span></button>`).join('');
  $('o-major').innerHTML = mk(MAJORS, 'major'); $('o-origin').innerHTML = mk(ORIGINS, 'origin'); $('o-regret').innerHTML = mk(REGRETS, 'regret');
  document.querySelectorAll('.opt').forEach(b => b.onclick = () => { setupSel[b.dataset.k] = b.dataset.id; renderSetup(); });
}

// ── 메인 화면 ─────────────────────────────────────────────────
function render(){
  if(!S) return;
  const left = TOTAL_MONTHS - S.m;
  $('h-date').textContent = `${yearOf(S)}년 ${monthOf(S)}월 · ${S.name} ${ageOf(S)}세`;
  $('h-left').textContent = `남은 시간 ${left}개월`;
  $('h-job').textContent = S.hired && CAREERS[S.track] ? (inLawSchool(S) ? `${UNIVERSITY} 로스쿨 · 법학전문대학원생` : `${CAREERS[S.track].company} · ${rankName(S)} (${CAREERS[S.track].name})`) : (S.track ? `${UNIVERSITY} ${majorOf(S).name} · 구직 중 (${CAREERS[S.track].name})` : `${UNIVERSITY} ${majorOf(S).name}${S.interest ? ` · 관심: ${CAREERS[S.interest].name}` : ''}`);
  $('g-bg').style.backgroundImage = `url(art/${heroKey(S)}.jpg)`;
  $('h-sand').style.width = (100 * S.m / TOTAL_MONTHS) + '%';
  $('h-chips').innerHTML = [`💰 ${fmtMoney(S.cash)}`, `❤️ ${Math.round(S.hp)}`, `😮‍💨 ${Math.round(S.stress)}`, `🔮 ${Math.round(S.clarity)}`].map(t => `<span class="chip">${t}</span>`).join('');
  $('pillars').innerHTML = Object.keys(PILLAR).map(k => `<div class="bar ${k}"><span>${PILLAR[k]}</span><div class="t"><i style="width:${S[k]}%"></i><u></u></div><b>${Math.round(S[k])}</b></div>`).join('');
  $('slots').innerHTML = [0, 1, 2].map(i => {
    const id = S.plan[i];
    if(id === '>') return `<button class="slot cont" disabled><span class="lb">${SLOT_NAMES[i]}</span><span class="ic">⏩</span><span class="ds">이어지는 칸</span></button>`;
    if(!id) return `<button class="slot" data-i="${i}"><span class="lb">${SLOT_NAMES[i]}</span><span class="ic">＋</span><span class="ds">활동 고르기</span></button>`;
    const a = ACTS[id]; return `<button class="slot" data-i="${i}"><span class="lb">${SLOT_NAMES[i]}</span><span class="ic">${a.icon}</span><span class="nm">${actName(S, id)}</span></button>`;
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
// 이벤트는 9:16 풀스크린: 일러스트가 화면을 채우고 글과 선택지는 아래 패널에 얹는다
const PLACE_FULL = {rain:'art/cover.jpg', shop:'art/bg_shop.jpg'};
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
function jobArtFor(c, intern){ const k = intern ? '' : (S.m >= 96 ? '_30' : S.m >= 72 ? '_27' : ''); return `art/job_${c}${k}.jpg`; }
function showAct(slotName, id, out){
  return new Promise(res => {
    const a = ACTS[id], el = $('act');
    const jobArt = id === 'job' ? (inLawSchool(S) ? 'art/job_lawschool.jpg' : (CAREERS[S.track] ? jobArtFor(S.track) : null)) : null;
    const internArt = id === 'intern' && CAREERS[S.interest] ? jobArtFor(S.interest, true) : null;
    const duoArt = id === 'job' && out.duo ? `art/duo_${out.duo}.jpg` : null;
    el.style.backgroundImage = duoArt ? `url(${duoArt}), url(${jobArt || 'art/act_job.jpg'}), url(art/act_job.jpg)` : jobArt ? `url(${jobArt}), url(art/act_job.jpg)` : internArt ? `url(${internArt}), url(art/act_intern.jpg)` : ACT_ART.has(id) ? `url(art/act_${id}.jpg)` : 'none';
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
  $('end').innerHTML = `<div class="endbg" style="background-image:url(art/${e.free ? 'age30' : 'cover'}.jpg)"></div><div class="endscroll"><div class="endspacer"></div><div class="endcard ending"><div class="big">${e.icon}</div><span class="tag ${e.free ? '' : 'ret'}">${e.sub}</span><h1>${e.title}</h1>
   <div class="pillars" style="text-align:left">${Object.keys(PILLAR).map(k => `<div class="bar ${k}"><span>${PILLAR[k]}</span><div class="t"><i style="width:${P[k]}%"></i><u></u></div><b>${Math.round(P[k])}</b></div>`).join('')}</div>
   <div class="letter">${esc(e.letter.replace(/\{name\}/g, S.name))}\n\n— 일흔 살의 나로부터</div>
   <p class="sub">엔딩 ${seen.length}/${ENDING_IDS.length} 수집 · 빌린 인생 ${S.borrowed} · 기억 선명도 ${Math.round(S.clarity)}</p>
   <button class="btn" id="b-again">${e.free ? '다시 도전하기' : '한 번 더 되감기'}</button></div></div>`;
  $('b-again').onclick = () => { store(SAVE_KEY, null); S = null; initTitle(); show('title'); };
  show('end');
}

// ── 메뉴·기록 ─────────────────────────────────────────────────
function initGame(){
  $('b-run').onclick = () => { $('b-run').disabled = true; runMonth(); };
  $('b-stat').onclick = () => { openSheet(`<h2>능력치</h2><p class=\"sub\">${UNIVERSITY} ${majorOf(S).name}${S.hired && CAREERS[S.track] ? ' · ' + CAREERS[S.track].company + ' ' + rankName(S) : ''}</p><div class="stats sheetstats">${STAT_KEYS.map(k => `<div>${STAT[k]}<b>${Math.round(S.st[k])}</b></div>`).join('')}<div>빌린 인생<b>${S.borrowed}</b></div></div><p class="sub" style="margin-top:10px">생활비 월 ${livingCost(S)}만 · 지원 ${allowance(S)}만 · 기억 선명도 ${Math.round(S.clarity)}</p><button class="btn ghost" id="x" style="margin-top:14px">닫기</button>`); $('x').onclick = closeSheet; };
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
