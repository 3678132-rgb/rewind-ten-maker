// 연인 마일스톤: 손 잡기 → 첫 키스 → 둘만의 여행 → 첫날밤(성인 이벤트, 암시 묘사). ENGINE 구간(DOM 금지)
// 장면 글은 intimacy_a/b/c.js (MILE_A/B/C: 인물별 {hand,kiss,trip,night:{title,text,yes:[라벨,결과],wait:[라벨,결과]}})
const MILE = Object.assign({}, typeof MILE_A !== 'undefined' ? MILE_A : {}, typeof MILE_B !== 'undefined' ? MILE_B : {}, typeof MILE_C !== 'undefined' ? MILE_C : {});
// 추가편(성인 연인의 일상): intimacy2_a/b/c.js (MILE2_A/B/C: 인물별 {live, deep})
for(const M2 of [typeof MILE2_A !== 'undefined' ? MILE2_A : {}, typeof MILE2_B !== 'undefined' ? MILE2_B : {}, typeof MILE2_C !== 'undefined' ? MILE2_C : {}]) for(const id in M2) MILE[id] = Object.assign({}, MILE[id], M2[id]);
const MILE_ORDER = ['hand', 'kiss', 'trip', 'night', 'live', 'deep'];
const MILE_NAME = {hand:'손 잡기', kiss:'첫 키스', trip:'둘만의 여행', night:'첫날밤', live:'동거 시작', deep:'함께하는 밤'};
const MILE_PLACE = {hand:'night', kiss:'night', trip:'campus', night:'night', live:'room', deep:'night'};
const MILE_SUB = {hand:'다가간다 · 호감 크게 ↑', kiss:'받아들인다 · 호감↑ 관계↑', trip:'떠난다 · 자금 -30 · 스트레스 -10', night:'함께한다 · 호감↑ 관계↑ · 성인 이벤트(암시 묘사)', live:'함께 산다 · 호감↑ 관계↑ 스트레스↓', deep:'함께한다 · 호감↑ 관계↑ · 성인 이벤트(암시 묘사)'};
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
  if(key === 'live') return v.aff >= 80 && since >= 10 && !v.fading && S.m - (v.lastMile == null ? -9 : v.lastMile) >= 4 ? key : null;
  if(key === 'deep') return v.aff >= 86 && since >= 14 && !v.fading && S.m - (v.lastMile == null ? -9 : v.lastMile) >= 4 ? key : null;
  return null;
}
function milestoneEvent(S){
  let best = null;
  for(const id of Object.keys(S.love)){ const key = mileDue(S, id); if(!key) continue; const sc = S.love[id].aff + (S.partner === id ? 6 : 0); if(!best || sc > best.sc) best = {id, key, sc}; }
  if(!best) return null;
  const {id, key} = best, lv = LOVERS[id], sc = MILE[id][key];
  const ev = {id:`mile_${id}_${key}`, lover:id, speaker:lv.name, title:`${MILE_NAME[key]} · ${sc.title}`, place:MILE_PLACE[key], img:`art/ms_${id}_${key}.webp`,
    text:S => sc.text,
    choices:[
      {label:sc.yes[0], sub:MILE_SUB[key], run(S){
        const v = S.love[id], ch = []; v.mile = MILE_ORDER.indexOf(key) + 1; v.lastMile = S.m; v.mileWait = 0;
        if(key === 'hand'){ addAff(S, id, 8, ch); fx(S, {bond:1.5, stress:-2}, ch); }
        else if(key === 'kiss'){ addAff(S, id, 10, ch); fx(S, {bond:2, stress:-3, self:1}, ch); }
        else if(key === 'trip'){ v.tripAt = S.m; addAff(S, id, 12, ch); fx(S, {cash:-30, bond:3, stress:-10, hp:5}, ch); if(S.secret && S.secret[id]) S.susp = Math.min(100, (S.susp || 0) + 8); }
        else if(key === 'night'){ v.intimate = true; v.intimateAt = S.m; addAff(S, id, 10, ch); fx(S, {bond:4, stress:-6, self:1}, ch); }
        else if(key === 'live'){ v.cohab = true; addAff(S, id, 8, ch); fx(S, {bond:4, stress:-5, self:1}, ch); }
        else { addAff(S, id, 6, ch); fx(S, {bond:3, stress:-6}, ch); }
        return {text:sc.yes[1], chips:ch, mood:'tender'}; }},
      {label:sc.wait[0], sub:'조금 더 천천히 · 3개월 뒤 다시', run(S){
        const v = S.love[id], ch = []; v.lastMile = S.m; v.mileWait = S.m + 3; addAff(S, id, 3, ch); fx(S, {self:1.5}, ch);
        return {text:sc.wait[1], chips:ch, mood:'shy'}; }},
    ]};
  // 키스는 바로 하지 않는다: 먼저 눈이 마주치는 장면(눈맞춤 그림·한 줄)에서 한 번 눌러야 키스 그림이 나온다
  if(key === 'kiss'){ ev.beats = [(GAZE_LINES[id] || GAZE_LINES._)(lv.name)]; ev.beatImgs = [[`art/ms_${id}_gaze.webp`, `art/ms_${id}_kiss.webp`], `art/ms_${id}_kiss.webp`]; }
  return ev;
}
const GAZE_LINES = {
  _:n => `${n}와 눈이 마주쳤다. 말이 끊기고, 시간이 느려진다. 그의 시선이 내 눈에서 입술로 천천히 내려갔다가 다시 올라온다. 숨소리만 들리는 거리.`,
  jaewoo:n => `재우가 말을 멈췄다. 평소처럼 쏟아내던 계획 이야기가 한순간에 사라졌다. 눈이 사라지도록 웃던 얼굴이 처음으로 진지해진다. “…지금, 가만히 있어 줘.”`,
  minjun:n => `민준이 고개를 숙이고 신발 끝만 보다가, 천천히 눈을 든다. 귀 끝이 새빨갛다. 떨리는 숨. 그가 나를 보고, 나는 눈을 피하지 못한다.`,
  hajin:n => `하진이 노트북을 덮었다. 늘 일 얘기를 하던 입이 닫히고, 직설적이던 눈빛이 조용히 나를 붙잡는다. “…지금 이 순간은 일정에 없는데.” 그가 낮게 웃는다.`,
  taeoh:n => `태오가 카메라를 내려놓았다. 렌즈 대신 나를 보는 눈. 느린 호흡 사이로 시간이 멈춘 것처럼 조용하다. “…지금 이 표정, 사진으로 못 남기겠다.”`,
  raon:n => `라온이 모자를 벗고 마스크를 내렸다. 무대 위가 아닌, 아무도 모르는 얼굴로 나를 본다. 장난기가 사라진 눈이 떨린다. “…지금은 아이돌 아니니까.”`,
  jihu:n => `지후가 서류에서 눈을 뗀다. 건조하던 얼굴이 조금씩 풀리고, 시선이 오래 머문다. “…집중이 안 되네요.” 그의 목소리가 평소보다 낮다.`,
  dohyun:n => `도현이 컷 사인을 보내듯 손을 멈췄다. 거칠던 눈이 가라앉아 나를 오래 본다. “…이 장면은 NG 안 내고 싶다.”`,
  sian:n => `시안이 펜을 내려놓았다. 문장으로 말하던 사람이 말을 잃고 눈만으로 말한다. 한 줄도 쓰지 않은 정적이 가장 긴 대사 같다.`,
  seunghyun:n => `승현이 마스크를 천천히 내렸다. 카메라 앞에서 완벽하던 얼굴이 처음으로 서툴게 떨린다. “…연기 아니에요. 이건.”`,
  geonwoo:n => `건우가 말을 멈추고 넥타이를 만지작거린다. 딱딱하던 눈매가 흔들리다가 나를 똑바로 본다. “…허락을 구해도 되겠습니까.”`,
  yuchan:n => `유찬이 헤드폰을 내렸다. 코드 얘기를 하던 입이 멈추고, 화면 불빛 대신 내 얼굴이 그의 눈에 비친다. “…예외 처리가 안 되네요, 이거.”`,
  ujin:n => `우진이 손에 든 원단을 내려놓았다. 색을 고르던 눈이 나만 비춘다. 가까워진 거리에서 숨이 섞인다. “…이 색이 제일 어울려요. 지금.”`,
};
