// 연인 마일스톤: 손 잡기 → 첫 키스 → 둘만의 여행 → 첫날밤(성인 이벤트, 암시 묘사). ENGINE 구간(DOM 금지)
// 장면 글은 intimacy_a/b/c.js (MILE_A/B/C: 인물별 {hand,kiss,trip,night:{title,text,yes:[라벨,결과],wait:[라벨,결과]}})
const MILE = Object.assign({}, typeof MILE_A !== 'undefined' ? MILE_A : {}, typeof MILE_B !== 'undefined' ? MILE_B : {}, typeof MILE_C !== 'undefined' ? MILE_C : {});
const MILE_ORDER = ['hand', 'kiss', 'trip', 'night'];
const MILE_NAME = {hand:'손 잡기', kiss:'첫 키스', trip:'둘만의 여행', night:'첫날밤'};
const MILE_PLACE = {hand:'night', kiss:'night', trip:'campus', night:'night'};
const MILE_SUB = {hand:'다가간다 · 호감 크게 ↑', kiss:'받아들인다 · 호감↑ 관계↑', trip:'떠난다 · 자금 -30 · 스트레스 -10', night:'함께한다 · 호감↑ 관계↑ · 성인 이벤트(암시 묘사)'};
function mileDue(S, id){
  const v = S.love[id], M = MILE[id]; if(!v || !M) return null;
  if(v.stage !== -1 && v.stage !== 1 && v.stage !== 2) return null;
  const n = v.mile || 0; if(n >= MILE_ORDER.length) return null;
  const key = MILE_ORDER[n]; if(!M[key]) return null;
  if(S.m < (v.mileWait || 0)) return null;
  if(S.m - (v.lastMile == null ? -9 : v.lastMile) < 2) return null;
  if(key === 'hand') return v.stage === -1 ? ((v.rom || 0) >= 2 && v.aff >= 24 ? key : null) : key;
  if(v.stage < 1) return null;
  const since = S.m - (v.since2 || 0);
  if(key === 'kiss') return v.aff >= 45 && since >= 1 ? key : null;
  if(key === 'trip') return v.aff >= 58 && since >= 3 && S.cash >= 30 ? key : null;
  if(key === 'night') return v.aff >= 72 && since >= 6 && !v.fading ? key : null;
  return null;
}
function milestoneEvent(S){
  let best = null;
  for(const id of Object.keys(S.love)){ const key = mileDue(S, id); if(!key) continue; const sc = S.love[id].aff + (S.partner === id ? 6 : 0); if(!best || sc > best.sc) best = {id, key, sc}; }
  if(!best) return null;
  const {id, key} = best, lv = LOVERS[id], sc = MILE[id][key];
  return {id:`mile_${id}_${key}`, lover:id, speaker:lv.name, title:`${MILE_NAME[key]} · ${sc.title}`, place:MILE_PLACE[key], img:`art/ms_${id}_${key}.webp`,
    text:S => sc.text,
    choices:[
      {label:sc.yes[0], sub:MILE_SUB[key], run(S){
        const v = S.love[id], ch = []; v.mile = MILE_ORDER.indexOf(key) + 1; v.lastMile = S.m; v.mileWait = 0;
        if(key === 'hand'){ addAff(S, id, 8, ch); fx(S, {bond:1.5, stress:-2}, ch); }
        else if(key === 'kiss'){ addAff(S, id, 10, ch); fx(S, {bond:2, stress:-3, self:1}, ch); }
        else if(key === 'trip'){ v.tripAt = S.m; addAff(S, id, 12, ch); fx(S, {cash:-30, bond:3, stress:-10, hp:5}, ch); if(S.secret && S.secret[id]) S.susp = Math.min(100, (S.susp || 0) + 8); }
        else { v.intimate = true; addAff(S, id, 10, ch); fx(S, {bond:4, stress:-6, self:1}, ch); }
        return {text:sc.yes[1], chips:ch, mood:'tender'}; }},
      {label:sc.wait[0], sub:'조금 더 천천히 · 3개월 뒤 다시', run(S){
        const v = S.love[id], ch = []; v.lastMile = S.m; v.mileWait = S.m + 3; addAff(S, id, 3, ch); fx(S, {self:1.5}, ch);
        return {text:sc.wait[1], chips:ch, mood:'shy'}; }},
    ]};
}
