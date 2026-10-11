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
  // 첫날밤: 수줍은 순간(칭찬·입맞춤·닿는 손끝)을 한 번 거친 뒤 선택한다
  if(key === 'night'){ ev.beats = [(NIGHT_LINES[id] || NIGHT_LINES._)(lv.name)]; ev.beatImgs = [[`art/ms_${id}_night2.webp`, `art/ms_${id}_night.webp`], `art/ms_${id}_night.webp`]; }
  return ev;
}
// 첫날밤 직전: 수줍은 순간. 칭찬과 입맞춤, 닿는 손끝까지만 — 불이 꺼지는 데서 끊는다
const NIGHT_LINES = {
  _:n => `얇은 잠옷 위에 가디건을 걸친 채 침대 끝에 앉았다. 볼이 뜨겁다. ${n}가 한참 말없이 나를 보다가 낮게 말했다. “예뻐. 진짜… 어떻게 말해야 할지 모르겠을 만큼.” 고개를 숙이자 그의 손끝이 내 머리카락을 귀 뒤로 넘기고, 뺨을 아주 천천히 쓸었다. 숨을 고르는 사이, 입술이 이마에 닿았다가 눈가로, 그리고 입술로 내려온다. 그의 손이 내 손등을 감싸 쥐었다. “무서우면 바로 말해.”`,
  jaewoo:n => `담요를 벗어 놓은 재우가 내 앞에 무릎을 굽히고 앉는다. “…예쁘다. 와, 나 지금 말이 안 나온다.” 평소 그렇게 말이 많던 사람이 웃다가 말을 잃는다. 부끄러워 눈을 내리깔자 그의 손가락이 턱끝을 살짝 들어 올렸다. “보여 줘, 얼굴. 나 이거 오래 보고 싶어.” 이마, 눈가, 입술 위로 숨결이 내려앉고, 그의 손이 내 어깨의 가디건을 조심스럽게 바로잡아 준다. “…진짜 괜찮아? 안 괜찮으면 지금 말해.”`,
  minjun:n => `민준이 눈을 몇 번이나 깜박이다가, 귀 끝까지 빨개져서 겨우 입을 연다. “…예뻐요. 정말로. 도면에도 못 그릴 만큼.” 내가 먼저 웃음을 터뜨리자 그도 어쩔 줄 몰라 따라 웃는다. 떨리는 손끝이 내 손을 감싸고, 조심조심 뺨에 닿는다. “만져도… 돼요?” 고개를 끄덕이자 그의 입술이 이마에 닿았다가 천천히 내려온다. 아주 서툴고 아주 다정하게.`,
  hajin:n => `하진이 시계를 풀어 탁자에 내려놓는다. 그 소리가 유난히 크게 들린다. “…이런 건 계획에 넣은 적이 없는데, 지금 이 순간은 전부 기억하고 싶다.” 낮은 목소리로 그가 말했다. “예쁘네. 숨을 쉬는 걸 잊을 정도로.” 내가 눈을 못 마주치자 그가 웃으며 내 손가락 끝에 입을 맞춘다. 손등, 손목, 그리고 이마. 평소처럼 직설적이지만 손길은 놀랄 만큼 조심스럽다. “거절은 언제든 가능해. 지금도.”`,
  taeoh:n => `태오가 카메라를 끝내 가방 안에 넣어 둔다. “오늘은 못 찍을 것 같아. 눈에 담아 두는 게 더 아까워서.” 램프 불빛이 내 어깨 위로 번진다. 그가 숨을 삼키고 말했다. “…예뻐. 그 말밖에 안 나와.” 그의 손가락이 내 머리카락 끝을 천천히 쓸어 넘긴다. 사진을 찍던 그 눈길로, 이번에는 아무것도 남기지 않고 그냥 나를 본다. 이마에, 뺨에, 그리고 입술에 닿는 입맞춤이 느리다.`,
  raon:n => `라온이 모자와 마스크를 침대 모서리에 던져 놓고, 평소의 장난기를 어디다 두고 왔는지 조용하다. “…나 오늘 팬들한테 한 번도 못 보여 준 얼굴인 거 알지?” 그가 쑥스럽게 웃다가 내 얼굴을 보고 말을 잃는다. “예뻐요. 아니, 예뻐. 존댓말 못 하겠어.” 귀가 새빨갛다. 손끝이 내 뺨에 닿았다가 머뭇거리며 떨어지고, 다시 닿는다. “…한 번만, 안아도 돼?”`,
  jihu:n => `지후가 넥타이를 느슨하게 풀어 놓고, 평소의 건조한 목소리로 말하려다 실패한다. “…예쁘네요. 제 어휘가 이렇게 부족한 줄 오늘 알았습니다.” 얼굴이 달아오른 내가 웃자 그의 표정이 풀린다. “웃지 마요, 집중이 안 됩니다.” 그가 내 손을 가만히 잡아 자기 가슴 위에 올린다. 심장이 엄청나게 빨리 뛰고 있다. 이마와 눈가에 닿는 입맞춤이 서두르지 않는다.`,
  dohyun:n => `도현이 불을 반쯤 줄이고 돌아서서 나를 본다. 늘 큰소리 내던 사람이 한참 말이 없다. “…컷. 아니, 지금 이건 컷 못 하겠다.” 어색하게 웃고는 낮게 덧붙였다. “예뻐. 카메라로는 이 느낌 못 담아.” 거친 손이 내 뺨을 의외로 가볍게 감싼다. 이마, 코끝, 그리고 입술. 숨이 섞이는 거리에서 그가 속삭인다. “싫으면 바로 말해. 난 NG라고 해도 괜찮아.”`,
  sian:n => `시안이 말을 고르다가 고르지 못하고, 처음으로 있는 그대로 말한다. “…예뻐요. 형용사를 쓰면 거짓말 같아서, 그냥 이 말만 할게요.” 펜 대신 내 손가락을 한 마디씩 만지작거린다. 내가 얼굴을 숙이자 그가 숨을 내쉬며 이마를 맞댄다. “이 장면은 어떤 문장으로도 안 옮겨질 것 같아요.” 입술이 이마에, 눈가에, 그리고 아주 조용히 입술 위에 닿는다.`,
  seunghyun:n => `승현이 마스크도 모자도 벗고, 카메라 앞에서는 한 번도 보인 적 없는 얼굴로 앉아 있다. “…연기가 아니라서 대사를 못 외우겠어요.” 그가 쑥스럽게 웃는다. “예뻐요. 진짜로. 이 말은 NG 없이 한 번에 하고 싶었는데, 떨리네요.” 내 손을 두 손으로 감싸 쥐고 이마에 가져다 댄다. 입술이 손등에, 뺨에, 입가에 닿는다. “…천천히 해요. 나, 서두르는 사람 아니에요.”`,
  geonwoo:n => `건우가 정장 재킷을 의자에 걸고, 넥타이를 한참 만지작거리다가 내려놓는다. “…진지하게 말씀드립니다. 예쁘십니다.” 그러고는 스스로도 웃음이 터진다. “죄송합니다, 지금 이 말투가 맞는지 모르겠습니다.” 굳은 어깨가 풀린 그가 조용히 손을 내밀어 내 뺨에 닿는다. “동의 없이는 아무것도 하지 않겠습니다. 허락해 주시겠습니까?” 고개를 끄덕이자 입맞춤이 이마에서 시작한다.`,
  yuchan:n => `유찬이 노트북을 덮고, 방 불빛을 직접 낮춘다. “…예뻐요. 아, 이건 예외 처리가 안 되네요. 평소 말투가 안 나와요.” 귀까지 빨간 그가 쑥스럽게 웃는다. 서툰 손끝이 내 머리카락을 쓸어 넘기고, 뺨을 지나, 손등에서 멈춘다. “…저 지금 심장이 서버 터지는 소리 나요.” 웃음이 터진 사이 이마에, 입술에 따뜻한 입맞춤이 내려앉는다.`,
  ujin:n => `우진이 내 어깨 위로 흘러내린 가디건을 아주 조심스럽게 다시 걸쳐 준다. “…이 색이 이렇게 잘 어울릴 줄 몰랐어요. 예뻐요. 정말로.” 색을 고르던 눈빛으로 그가 나를 오래 본다. “어떤 원단도 이 느낌은 못 내요.” 손끝이 내 뺨의 홍조를 따라 천천히 움직이고, 머리카락 한 가닥을 귀 뒤로 넘긴다. 그의 입술이 이마에, 눈꺼풀에, 입술에 차례로 닿는다.`,
};
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
