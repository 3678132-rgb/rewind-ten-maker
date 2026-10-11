// 캠퍼스 산책: 교내 장소를 골라 시간을 보내면 친구나 남자 주인공을 우연히 만난다. ENGINE 구간(DOM 금지)
// 장면 글은 campus_scenes.js (CP_FRIEND[장소] = 친구 장면들, CP_LOVER[인물][장소] = {pre, love})
const CAMPUS_PLACES = {
  class:  {name:'강의실',      icon:'🏫', sprite:'study',    cost:0, hp:-4, stress:3,  eff:{know:3.4, work:1.2},            desc:'빈 강의실에 먼저 와 앉는다. 아는 얼굴이 들어올지도 몰라요.'},
  library:{name:'도서관',      icon:'📚', sprite:'study',    cost:0, hp:-3, stress:2,  eff:{know:3.8, skill:1.0, work:1.0}, desc:'조용한 열람실. 집중이 잘 되고, 의외의 사람을 만나기도 해요.'},
  shop:   {name:'매점·학생식당', icon:'🍙', sprite:'friends',  cost:3, hp:2,  stress:-6, eff:{bond:1.6, charm:0.5},           desc:'삼각김밥과 수다. 친구들이 제일 많이 모이는 곳.'},
  club:   {name:'동아리실',    icon:'🎸', sprite:'friends',  cost:0, hp:-1, stress:-3, eff:{charm:1.3, neg:0.8, bond:1.2},  desc:'소파와 기타와 라면 냄새. 선배들이 죽치고 있어요.'},
  field:  {name:'운동장',      icon:'⚽', sprite:'exercise', cost:0, hp:4,  stress:-6, eff:{dare:0.8, charm:0.6, self:0.8}, desc:'트랙을 돌고 벤치에 앉는다. 땀과 바람이 개운해요.'},
  garden: {name:'정원·벤치',   icon:'🌿', sprite:'journal',  cost:0, hp:2,  stress:-8, eff:{self:1.6, ins:0.7},             desc:'연못 옆 벤치. 생각을 정리하기 좋은 학교 뒤뜰.'},
};
const CAMPUS_END = 48; // 졸업(2020.3) 전까지만 교정을 돌아다닌다
const CAMPUS_VISITS = 3; // 한 달에 교정을 돌아다닐 수 있는 횟수(스케줄 칸을 쓰지 않는다)
const cpLeft = S => S.cpLeft == null ? CAMPUS_VISITS : S.cpLeft;
// 팝업 연출용 활동 정보(스케줄 목록에는 나오지 않는다)
for(const key in CAMPUS_PLACES){ const p = CAMPUS_PLACES[key], id = 'cp_' + key; ACTS[id] = {id, cp:key, slots:1, cat:'캠퍼스', icon:p.icon, name:p.name, desc:p.desc, cost:0, eff:{}}; }
// 장소를 한 번 방문한다: 작은 효과 + 우연한 만남. 방문 횟수 1 소모
function campusVisit(S, key){
  const p = CAMPUS_PLACES[key], ch = [], out = {id:'cp_' + key, ch, note:'', place:key};
  S.cpLeft = Math.max(0, cpLeft(S) - 1);
  if(p.cost && S.cash >= p.cost) bump(S, 'cash', -p.cost, ch);
  if(p.hp) bump(S, 'hp', Math.round(p.hp / 2), ch);
  if(p.stress) bump(S, 'stress', Math.round(p.stress / 2), ch);
  const e = {}; for(const k in p.eff) e[k] = p.eff[k] * 0.5; fx(S, e, ch);
  out.enc = campusEncounter(S, key, ch) || campusQuiet(S, key, ch); out.note = p.desc;
  return out;
}
const CP_CUT = {'소연':'soyeon', '지수':'jisu', '태윤':'taeyun'};
function weightedPick(list){ const tot = list.reduce((a, c) => a + c.w, 0); let r = R() * tot; for(const c of list){ r -= c.w; if(r <= 0) return c; } return list[list.length - 1]; }
// 아무도 마주치지 않은 날: 효과만 보여 주는 짧은 장면
function campusQuiet(S, place, visitCh){
  const p = CAMPUS_PLACES[place], line = pick(['오늘은 아는 얼굴이 보이지 않았다. 그래도 바람이 좋았다.', '한참을 어슬렁거렸지만 마주친 사람은 없었다. 혼자만의 시간도 나쁘지 않다.', '아무도 마주치지 않은 평온한 한때. 머릿속이 조금 정리됐다.']);
  return {id:`cp_q_${place}_${S.m}_${Math.floor(R() * 1e4)}`, speaker:'', title:p.name, place:'campus', img:`art/cp_${place}.webp`, text:S => `${p.desc}\n\n${line}`,
    choices:[{label:'다음에 또 와야지', sub:'', run(S){ return {text:'교정을 한 바퀴 돌고 나니 기분이 한결 가벼워졌다.', chips:(visitCh || []).slice()}; }}]};
}
function campusEncounter(S, place, visitCh){
  const LV = typeof CP_LOVER !== 'undefined' ? CP_LOVER : {}, FR = typeof CP_FRIEND !== 'undefined' ? CP_FRIEND : {};
  if(R() < 0.15) return null; // 가끔은 아무도 마주치지 않는다
  const cands = [];
  for(const id of Object.keys(LV)){
    const set = LV[id][place]; if(!set || !LOVERS[id]) continue; const v = S.love[id], lv = LOVERS[id];
    if(v){ if(v.stage === -9 || v.stage === -2 || v.stage > 2 || v.cpAt === S.m) continue; const sc = v.stage >= 1 ? set.love : set.pre; if(sc) cands.push({w:3 + v.aff / 22, kind:'lover', id, sc}); }
    else if(!S.seen['meet_' + id] && !lv.career && S.m >= lv.meet - 8 && S.m < CAMPUS_END) cands.push({w:4.5, kind:'meet', id}); // 첫 만남이 이 장소에서 앞당겨진다
  }
  (FR[place] || []).forEach((sc, idx) => cands.push({w:2.2, kind:'friend', sc, idx}));
  if(!cands.length) return null;
  const c = weightedPick(cands);
  if(c.kind === 'meet') return meetEvent(S, c.id);
  if(c.kind === 'lover' && typeof loverStoryFor === 'function' && R() < 0.65 && S.m - (S.lsAt == null ? -9 : S.lsAt) >= 1){ const st = loverStoryFor(S, c.id); if(st){ S.lsAt = S.m; S.love[c.id].cpAt = S.m; return st; } } // 관계가 깊어지면 그 장소에서 이야기 이벤트가 이어진다
  const sc = c.sc, pl = CAMPUS_PLACES[place];
  if(c.kind === 'friend') return {id:`cp_f_${place}_${S.m}`, speaker:sc.who, title:`${pl.name} · ${sc.title}`, place:'campus', img:`art/cp_${place}.webp`, cut:CP_CUT[sc.who] || null, text:S => sc.text,
    choices:[
      {label:sc.yes[0], sub:'함께한다 · 관계↑ 스트레스↓', run(S){ const ch = (visitCh || []).slice(); fx(S, {bond:1.2, stress:-2}, ch); return {text:sc.yes[1], chips:ch}; }},
      {label:sc.no[0], sub:'거리를 둔다 · 나↑', run(S){ const ch = (visitCh || []).slice(); fx(S, {bond:0.5, self:1.0}, ch); return {text:sc.no[1], chips:ch, mood:'shy'}; }},
    ]};
  const id = c.id, lv = LOVERS[id];
  return {id:`cp_${id}_${place}_${S.m}`, lover:id, speaker:lv.name, title:`${pl.name} · ${sc.title}`, place:'campus', img:`art/cp_${place}.webp`, cut:id, text:S => sc.text,
    choices:[
      {label:sc.yes[0], sub:'다가간다 · 호감 크게 ↑', run(S){ const ch = (visitCh || []).slice(); S.love[id].cpAt = S.m; addAff(S, id, 3.5 + (S.st[lv.like] || 0) / 40, ch); fx(S, {bond:0.6, stress:-2}, ch); return {text:sc.yes[1], chips:ch}; }},
      {label:sc.no[0], sub:'조심스럽게 · 호감 ↑', run(S){ const ch = (visitCh || []).slice(); S.love[id].cpAt = S.m; addAff(S, id, 1.6, ch); fx(S, {self:1.0}, ch); return {text:sc.no[1], chips:ch, mood:'shy'}; }},
    ]};
}
