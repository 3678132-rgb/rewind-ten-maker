// 도시 산책: 졸업 뒤에는 학교 대신 시내 8곳을 돌아다닌다(스케줄 칸을 쓰지 않고 한 달 3번). 장소에서 쇼핑도 한다. ENGINE 구간(DOM 금지)
// 장면 글은 city_friends.js (CT_FRIEND[장소]), city_lovers_a/b/c.js (CT_LOVER_A/B/C[인물][장소] = {pre, love})
const CITY_PLACES = {
  office: {name:'회사 근처', icon:'🏢', cost:0, hp:-2, stress:-1, eff:{work:1.4, bond:0.6},            desc:'점심 골목과 퇴근길 횡단보도. 동료나 아는 얼굴을 마주치기 쉬워요.'},
  cinema: {name:'영화관',   icon:'🎬', cost:0, hp:0,  stress:-5, eff:{sense:1.2, self:0.8},            desc:'팝콘 냄새와 어두운 객석. 혼자도, 둘이도 좋은 곳.'},
  museum: {name:'미술관',   icon:'🖼️', cost:0, hp:1,  stress:-6, eff:{sense:1.4, know:0.8},            desc:'조용한 전시실. 마음이 느려지는 곳이에요.'},
  mall:   {name:'백화점',   icon:'🛍️', cost:0, hp:-1, stress:-4, eff:{charm:1.2, sense:0.6},           desc:'쇼윈도와 에스컬레이터. 구경만 해도 기분이 풀려요.'},
  beauty: {name:'뷰티 스토어', icon:'💄', cost:0, hp:0,  stress:-4, eff:{charm:1.5, sense:0.5},           desc:'샘플을 발라 보고 수다를 떠는 곳. 요즘 유행이 다 모여 있어요.'},
  books:  {name:'서점',     icon:'📖', cost:0, hp:1,  stress:-4, eff:{know:1.6, ins:0.8},              desc:'책 냄새가 나는 서가. 의외의 사람을 만나기도 해요.'},
  river:  {name:'한강공원', icon:'🌉', cost:0, hp:3,  stress:-8, eff:{self:1.4, dare:0.5},             desc:'강바람과 돗자리. 걷기만 해도 숨이 트여요.'},
  night:  {name:'야식 거리', icon:'🌃', cost:0, hp:-1, stress:-6, eff:{bond:1.4, neg:0.6},              desc:'불 켜진 포장마차와 골목. 밤에 마음이 풀리는 사람들이 모여요.'},
};
const CITY_KEYS = Object.keys(CITY_PLACES);
const cityOn = S => S.m >= CAMPUS_END;                      // 졸업하면 캠퍼스 대신 도시
const CT_LOVER_ALL = () => Object.assign({}, typeof CT_LOVER_A !== 'undefined' ? CT_LOVER_A : {}, typeof CT_LOVER_B !== 'undefined' ? CT_LOVER_B : {}, typeof CT_LOVER_C !== 'undefined' ? CT_LOVER_C : {});
for(const key of CITY_KEYS){ const p = CITY_PLACES[key], id = 'ct_' + key; ACTS[id] = {id, ct:key, slots:1, cat:'캠퍼스', icon:p.icon, name:p.name, desc:p.desc, cost:0, eff:{}}; }

// 이 장소를 추천할 만한 사람들: 이미 알고 있고, 이 장소를 단골로 하는 남자 주인공
function cityRecommend(S, place){
  const LV = CT_LOVER_ALL(), out = [];
  for(const id of Object.keys(LV)){
    const set = LV[id][place], v = S.love[id]; if(!set || !LOVERS[id] || !v) continue;
    if(v.stage === -9 || v.stage === -2 || v.stage > 2) continue; out.push(id);
  }
  return out.sort((a, b) => S.love[b].aff - S.love[a].aff);
}

function cityVisit(S, key){
  const p = CITY_PLACES[key], ch = [], out = {id:'ct_' + key, ch, note:'', place:key};
  S.cpLeft = Math.max(0, cpLeft(S) - 1);
  if(p.hp) bump(S, 'hp', Math.round(p.hp / 2), ch);
  if(p.stress) bump(S, 'stress', Math.round(p.stress / 2), ch);
  const e = {}; for(const k in p.eff) e[k] = p.eff[k] * 0.5; fx(S, e, ch);
  out.enc = cityEncounter(S, key, ch) || cityQuiet(S, key, ch); out.note = p.desc;
  return out;
}
function cityQuiet(S, place, visitCh){
  const p = CITY_PLACES[place], line = pick(['오늘은 아는 얼굴이 보이지 않았다. 그래도 도시의 소음이 오히려 편했다.', '한참을 걸었지만 마주친 사람은 없었다. 혼자 걷는 퇴근길도 나쁘지 않다.', '아무도 마주치지 않았다. 대신 쇼윈도에 비친 내 모습이 생각보다 괜찮아 보였다.']);
  return {id:`ct_q_${place}_${S.m}_${Math.floor(R() * 1e4)}`, speaker:'', title:p.name, place:'city', img:`art/ct_${place}.webp`, text:S => `${p.desc}\n\n${line}`,
    choices:[{label:'다음에 또 와야지', sub:'', run(S){ return {text:'한 바퀴 돌고 나니 머리가 한결 가벼워졌다.', chips:(visitCh || []).slice()}; }}]};
}
function cityEncounter(S, place, visitCh){
  const LV = CT_LOVER_ALL(), FR = typeof CT_FRIEND !== 'undefined' ? CT_FRIEND : {};
  if(R() < 0.15) return null;
  const cands = [];
  for(const id of Object.keys(LV)){
    const set = LV[id][place], v = S.love[id]; if(!set || !LOVERS[id] || !v) continue;
    if(v.stage === -9 || v.stage === -2 || v.stage > 2 || v.cpAt === S.m) continue;
    const sc = v.stage >= 1 ? set.love : set.pre; if(sc) cands.push({w:3.2 + v.aff / 20, kind:'lover', id, sc});
  }
  // 친구·동료 장면: 최근에 본 장면과 같은 사람은 덜 나오고, 같은 장면은 18개월 안에는 거의 나오지 않는다
  S.ctSeen = S.ctSeen || {};
  (FR[place] || []).forEach(sc => { let ok = true; try{ ok = !sc.cond || sc.cond(S); }catch(e){ ok = false; } if(!ok) return;
    const seenAt = S.ctSeen[place + '|' + sc.title]; let w = 2.2; if(seenAt != null && S.m - seenAt < 18) w *= 0.06; if(S.ctLastWho === sc.who) w *= 0.45; cands.push({w, kind:'friend', sc}); });
  if(!cands.length) return null;
  const c = weightedPick(cands), pl = CITY_PLACES[place];
  if(c.kind === 'lover' && typeof loverStoryFor === 'function' && R() < 0.6 && S.m - (S.lsAt == null ? -9 : S.lsAt) >= 1){ const st = loverStoryFor(S, c.id); if(st){ S.lsAt = S.m; S.love[c.id].cpAt = S.m; return st; } }
  const sc = c.sc;
  if(c.kind === 'friend'){ S.ctSeen[place + '|' + sc.title] = S.m; S.ctLastWho = sc.who; }
  if(c.kind === 'friend') return {id:`ct_f_${place}_${S.m}`, speaker:sc.who, title:`${pl.name} · ${sc.title}`, place:'city', img:`art/ct_${place}.webp`, cut:CP_CUT[sc.who] || null, text:S => sc.text,
    choices:[
      {label:sc.yes[0], sub:'함께한다 · 관계↑ 스트레스↓', run(S){ const ch = (visitCh || []).slice(); fx(S, {bond:1.2, stress:-2}, ch); return {text:sc.yes[1], chips:ch}; }},
      {label:sc.no[0], sub:'거리를 둔다 · 나↑', run(S){ const ch = (visitCh || []).slice(); fx(S, {bond:0.5, self:1.0}, ch); return {text:sc.no[1], chips:ch, mood:'shy'}; }},
    ]};
  const id = c.id, lv = LOVERS[id];
  return {id:`ct_${id}_${place}_${S.m}`, lover:id, speaker:lv.name, title:`${pl.name} · ${sc.title}`, place:'city', img:`art/ct_${place}.webp`, cut:id, text:S => sc.text,
    choices:[
      {label:sc.yes[0], sub:'다가간다 · 호감 크게 ↑', run(S){ const ch = (visitCh || []).slice(); S.love[id].cpAt = S.m; addAff(S, id, 3.5 + (S.st[lv.like] || 0) / 40, ch); fx(S, {bond:0.6, stress:-2}, ch); return {text:sc.yes[1], chips:ch}; }},
      {label:sc.no[0], sub:'조심스럽게 · 호감 ↑', run(S){ const ch = (visitCh || []).slice(); S.love[id].cpAt = S.m; addAff(S, id, 1.6, ch); fx(S, {self:1.0}, ch); return {text:sc.no[1], chips:ch, mood:'shy'}; }},
    ]};
}

// ───── 쇼핑: 장소별로 사고 싶은 것이 다르다. price 는 만원. who:true 면 함께 갈 사람(썸·연인)이 있을 때 그 사람 호감도 오른다 ─────
const CITY_SHOP = {
  office: [
    {id:'lunch',   icon:'🍱', name:'동료와 점심 한 끼',  price:2,  desc:'관계 +1.2, 스트레스 -2.',                         fx:{bond:1.2, stress:-2}},
    {id:'coffeeset', icon:'☕', name:'팀 커피 돌리기',   price:3,  desc:'관계 +1.5, 협상 +0.6.',                           fx:{bond:1.5, neg:0.6}},
  ],
  cinema: [
    {id:'ticket1', icon:'🎟️', name:'영화표 한 장',      price:2,  desc:'혼자 보는 영화. 감각 +1.2, 스트레스 -8.',          fx:{sense:1.2, stress:-8}},
    {id:'ticket2', icon:'🎫', name:'영화표 두 장',      price:4,  desc:'함께 볼 사람과. 호감 +3, 스트레스 -6.',            fx:{sense:0.8, stress:-6}, who:3},
    {id:'popcorn', icon:'🍿', name:'팝콘 세트',         price:1,  desc:'스트레스 -2.',                                    fx:{stress:-2}},
  ],
  museum: [
    {id:'exh1',    icon:'🖼️', name:'전시 관람권',       price:2,  desc:'감각 +1.6, 학식 +0.6.',                           fx:{sense:1.6, know:0.6}},
    {id:'exh2',    icon:'🎨', name:'전시 관람권 두 장',  price:4,  desc:'함께 감상. 호감 +3, 감각 +1.',                     fx:{sense:1.0}, who:3},
    {id:'catalog', icon:'📔', name:'전시 도록',         price:5,  desc:'학식 +1.5, 감각 +1.',                             fx:{know:1.5, sense:1}},
  ],
  mall: [
    {id:'outfit',  icon:'👗', name:'새 옷 한 벌',       price:15, desc:'매력 +1.6, 나 +1.',                               fx:{charm:1.6, self:1}},
    {id:'bag',     icon:'👜', name:'가죽 가방',         price:40, desc:'매력 +2.4, 나 +2.',                               fx:{charm:2.4, self:2}},
    {id:'giftbox', icon:'🎁', name:'선물 세트',         price:8,  desc:'다음 데이트에서 호감 +5. 쓰면 사라져요.',          item:'gift'},
  ],
  beauty: [
    {id:'skincare',icon:'🧴', name:'스킨케어 세트',     price:6,  desc:'매력 +1.2, 스트레스 -2.',                         fx:{charm:1.2, stress:-2}},
    {id:'lip',     icon:'💄', name:'립 틴트',           price:2,  desc:'매력 +0.6, 나 +0.4.',                             fx:{charm:0.6, self:0.4}},
    {id:'perfume', icon:'🌸', name:'향수',              price:25, desc:'매달 매력이 오르고 데이트 호감이 +1 더 오른다.',     item:'perfume'},
  ],
  books: [
    {id:'novel',   icon:'📕', name:'소설책 한 권',      price:1,  desc:'감각 +0.6, 스트레스 -3.',                         fx:{sense:0.6, stress:-3}},
    {id:'bookset', icon:'📚', name:'전공 서적 세트',    price:15, desc:'학식 +2.5, 통찰 +1 (최대 3회).',                   item:'books'},
    {id:'notebook',icon:'📓', name:'다이어리와 펜',     price:2,  desc:'나 +1, 실무 +0.6.',                               fx:{self:1, work:0.6}},
  ],
  river: [
    {id:'ramen',   icon:'🍜', name:'한강 라면',         price:1,  desc:'체력 +3, 스트레스 -4.',                           fx:{stress:-4}, hp:3},
    {id:'bike',    icon:'🚲', name:'자전거 대여',       price:1,  desc:'함께 타요. 호감 +3, 체력 +2.',                     fx:{dare:0.5}, hp:2, who:3},
    {id:'mat',     icon:'🧺', name:'돗자리와 간식',     price:3,  desc:'스트레스 -6, 나 +0.6.',                           fx:{stress:-6, self:0.6}},
  ],
  night: [
    {id:'late',    icon:'🍢', name:'야식 한 상',        price:3,  desc:'체력 +3, 스트레스 -6.',                           fx:{stress:-6}, hp:3},
    {id:'dinner2', icon:'🍻', name:'둘이 한잔',         price:6,  desc:'함께한 사람과 호감 +3, 스트레스 -5.',               fx:{stress:-5}, who:3},
    {id:'taxi',    icon:'🚕', name:'택시로 귀가',       price:2,  desc:'체력 +2. 집에 편하게 간다.',                       fx:{}, hp:2},
  ],
};
// 같이 간 사람: 공식 연인이 있으면 그 사람, 없으면 호감이 가장 높은 썸·연인
function cityCompanion(S){
  const off = typeof officialOf === 'function' ? officialOf(S) : null; if(off && S.love[off] && S.love[off].stage >= 1) return off;
  const c = Object.keys(S.love).filter(i => { const v = S.love[i]; return v && v.stage !== -9 && v.stage !== -2 && v.stage >= -1 && v.stage <= 2; }).sort((a, b) => S.love[b].aff - S.love[a].aff);
  return c[0] || null;
}
// 구입: 실패하면 안내 문구, 성공하면 null (결과 문장은 S._shopNote)
function cityBuy(S, place, id){
  const it = (CITY_SHOP[place] || []).find(x => x.id === id); if(!it) return '없는 물건이에요';
  if(!S.hired) return '취업한 뒤에 쇼핑할 수 있어요';
  if(S.cash < it.price) return '자금이 모자라요';
  if(it.item){ const r = buyItem(S, it.item); if(r) return r; S._shopNote = `${ITEMS[it.item].name}을(를) 샀다.`; return null; }
  let who = null; if(it.who){ who = cityCompanion(S); if(!who) return '함께할 사람이 아직 없어요'; }
  S.cash -= it.price; const ch = [];
  if(it.fx && Object.keys(it.fx).length) fx(S, it.fx, ch);
  if(it.hp) bump(S, 'hp', it.hp, ch);
  if(who) addAff(S, who, it.who + (owned(S, 'perfume') ? 1 : 0), ch);
  S._shopNote = `${it.name}을(를) 샀다.` + (who ? ` ${LOVERS[who].name}와(과) 함께였다.` : '');
  return null;
}
