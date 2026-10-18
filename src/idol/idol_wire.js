// 아이돌 모드 연결: 이벤트 풀 교체, 이번 달 고정 이벤트 순서. ENGINE 구간(DOM 금지). ui.js 바로 앞에서 불린다.
// 일상 이벤트 풀: 아이돌 이벤트 + 라이벌 + 위기 (대학·회사 시절 이벤트는 쓰지 않는다)
EVENTS.length = 0;
EVENTS.push(...(typeof IDOL_EVENTS !== 'undefined' ? IDOL_EVENTS : []), ...(typeof RIVAL_EVENTS !== 'undefined' ? RIVAL_EVENTS : []), ...(typeof CRISIS_EVENTS !== 'undefined' ? CRISIS_EVENTS : []));
const PROLOGUE_NOW = typeof IDOL_PROLOGUE !== 'undefined' ? IDOL_PROLOGUE : PROLOGUE;
const FINALE_NOW = typeof IDOL_FINALE !== 'undefined' ? IDOL_FINALE : FINALE;
const ROUND2_NOW = typeof IDOL_ROUND2 !== 'undefined' ? IDOL_ROUND2 : ROUND2;
const ERA_NOW = typeof IDOL_ERA !== 'undefined' ? IDOL_ERA : ERA;
fixedEvents = function(S){
  const out = [];
  if(S.collapse) out.push(collapseEvent(S));
  if(S.m === 0 && !S.seen.prologue && !(S.round > 1)) out.push(PROLOGUE_NOW);
  if(S.m === 0 && S.round > 1 && !S.seen.round2) out.push(ROUND2_NOW);
  for(const e of ERA_NOW) if(S.m === e.m && !S.seen[e.id] && (!e.cond || e.cond(S))) out.push(Object.assign({once:true, speaker:''}, e));
  const ie = idolEvent(S); if(ie) out.push(ie);
  const se = storyDue(S); if(se) out.push(se);
  if(out.length < 3){ const le = loveEvent(S); if(le) out.push(le); }
  if(S.m === TOTAL_MONTHS - 1) out.push(FINALE_NOW);
  return out;
};
