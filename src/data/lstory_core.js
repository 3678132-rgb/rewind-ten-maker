// 남주 스토리 이벤트·특별 이벤트 공통 도구. ENGINE 구간(DOM 금지)
// LSTORY: 인물별 이야기 이벤트(순서대로 진행), SPECIAL: 때가 정해진 특별 이벤트(MT·삼각관계·혐관 등). 각 파일이 뒤에서 push 한다.
const LSTORY = [], SPECIAL = [];
// 사랑 관계 도우미 — 이벤트의 cond 안에서 쓴다
const lvOf = (S, id) => S.love[id] || null;
const lvf = (S, id) => { const v = S.love[id]; if(!v) return {}; return (v.f = v.f || {}); };      // 인물별 플래그 {키:값}
const lvSet = (S, id, k, val = 1) => { const v = S.love[id]; if(v){ (v.f = v.f || {})[k] = val; } };
const lvFlag = (S, id, k) => !!(S.love[id] && S.love[id].f && S.love[id].f[k]);
const isPre = (S, id) => !!S.love[id] && S.love[id].stage === -1;                               // 썸(사귀기 전)
const isCouple = (S, id) => !!S.love[id] && (S.love[id].stage === 1 || S.love[id].stage === 2);  // 연인(공식·비밀 모두)
const isMet = (S, id) => !!S.love[id] && S.love[id].stage !== -9 && S.love[id].stage !== -2;
const affOf = (S, id) => (S.love[id] ? S.love[id].aff : 0);
const monthsSince = (S, id, key) => (S.love[id] && S.love[id].f && S.love[id].f[key] != null ? S.m - S.love[id].f[key] : 999);
const seen = (S, id) => !!S.seen[id];
const afterEv = (S, id, gap = 2) => seen(S, id) && S.m - (S.cd[id] == null ? -99 : S.cd[id]) >= gap; // 앞 이벤트를 본 지 gap 개월 뒤
const inCareer = (S, ...ids) => S.hired && ids.includes(S.track);
// 한 달에 하나, 인물 이야기 이벤트를 고른다 (호감이 높고 순서가 빠른 것부터)
function loverStoryEvent(S){
  if(S.m - (S.lsAt == null ? -9 : S.lsAt) < 2) return null;
  let best = null;
  for(const e of LSTORY){
    if(S.seen[e.id]) continue; let ok = false; try{ ok = !e.cond || e.cond(S); }catch(err){ ok = false; }
    if(!ok) continue; const sc = (e.lover ? affOf(S, e.lover) : 30) + (e.pri || 0); if(!best || sc > best.sc) best = {e, sc};
  }
  if(!best) return null; S.lsAt = S.m; return best.e;
}
// 때가 정해진 특별 이벤트: 조건이 맞는 첫 번째
function specialDue(S){
  for(const e of SPECIAL){ if(S.seen[e.id]) continue; let ok = false; try{ ok = !e.cond || e.cond(S); }catch(err){ ok = false; } if(ok) return e; }
  return null;
}
