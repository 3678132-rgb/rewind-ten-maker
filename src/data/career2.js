// 승진·연봉·보너스·장학금·상점. ENGINE 구간(DOM 금지)
const RAISE = 0.28; // 승진 한 번당 월급 +28%
const payOf = S => Math.round(jobOf(S).pay * (1 + RAISE * (S.rank || 0)));
const PROMO_NEED = [32, 52, 72], PROMO_GAP = 14;
const canPromote = S => S.hired && CAREERS[S.track] && !inLawSchool(S) && (S.rank || 0) < 3;

// 상점: price(만원). passive는 매달 정산 때 적용, once는 구입 즉시 효과, stack은 여러 번 살 수 있음
const ITEMS = {
  laptop:  {icon:'💻', name:'노트북', price:90, desc:'공부·자격증·프로젝트·인턴에서 능력치가 20% 더 오른다.'},
  suit:    {icon:'👔', name:'면접 정장', price:40, desc:'합격 가능성 +7%p. 이직과 구직에 모두 적용된다.'},
  watch:   {icon:'⌚', name:'명함과 손목시계', price:120, desc:'승진 심사 성공률 +8%p.'},
  perfume: {icon:'🧴', name:'향수·화장품', price:25, desc:'매력이 매달 조금씩 오르고, 데이트 호감이 +1 더 오른다.'},
  shoes:   {icon:'👟', name:'러닝화', price:20, desc:'매달 체력이 +2 더 회복된다.'},
  coffee:  {icon:'☕', name:'커피머신', price:30, desc:'매달 스트레스가 1.5 더 풀린다.'},
  massage: {icon:'💆', name:'안마의자', price:60, desc:'매달 스트레스 -3, 체력 +1.'},
  camera:  {icon:'📷', name:'필름 카메라', price:35, desc:'감각이 매달 조금씩 오른다.'},
  books:   {icon:'📚', name:'전공 서적 세트', price:15, stack:3, desc:'학식 +2.5, 통찰 +1 (최대 3회).'},
  gift:    {icon:'🎁', name:'선물 세트', price:8, stack:9, desc:'다음 데이트 때 호감이 +5 더 오른다. 쓰면 사라진다.'},
  treat:   {icon:'🛍️', name:'나를 위한 선물', price:60, stack:2, desc:'나 +3, 스트레스 -10. 가끔은 나에게도.'},
};
const owned = (S, id) => (S.items && S.items[id]) || 0;
function buyItem(S, id){
  const it = ITEMS[id]; if(!it) return '없는 물건이에요';
  S.items = S.items || {};
  const n = owned(S, id), cap = it.stack || 1;
  if(n >= cap) return it.stack ? '더 살 수 없어요' : '이미 가지고 있어요';
  if(S.cash < it.price) return '자금이 모자라요';
  S.cash -= it.price; S.items[id] = n + 1; const ch = [];
  if(id === 'books') fx(S, {know:2.5, ins:1}, ch);
  if(id === 'treat') fx(S, {self:3, stress:-10}, ch);
  if(id === 'gift') S.gifts = (S.gifts || 0) + 1;
  return null;
}
// 매달 정산에서 부르는 소지품 효과
function itemMonthly(S, ch){
  const o = id => owned(S, id) > 0;
  if(o('perfume')) fx(S, {charm:0.12}, ch);
  if(o('camera')) fx(S, {sense:0.12}, ch);
  if(o('shoes')) bump(S, 'hp', 2, ch);
  if(o('coffee')) bump(S, 'stress', -1.5, ch);
  if(o('massage')){ bump(S, 'stress', -3, ch); bump(S, 'hp', 1, ch); }
}

// ── 승진 심사 ────────────────────────────────────────────────────────
function promotionEvent(S){
  if(!canPromote(S)) return null; const r = S.rank || 0;
  if(S.work < PROMO_NEED[r]) return null;
  if(S.m - (S.promoAt == null ? S.hiredAt || 0 : S.promoAt) < PROMO_GAP) return null;
  if(S.seen['promo_' + r + '_' + S.m]) return null;
  const c = CAREERS[S.track], next = c.ranks[r + 1], cur = c.ranks[r];
  const raise = Math.round(c.pay * (1 + RAISE * (r + 1))) - payOf(S), bonusAmt = Math.round(c.pay * (0.7 + 0.2 * r));
  const win = (S, d, label, ok, no) => { const ch = []; const p = clamp(0.45 + (S.work - PROMO_NEED[r]) / 110 + d + (owned(S, 'watch') ? 0.08 : 0), 0.15, 0.92);
    if(R() < p){ S.rank = r + 1; S.promoAt = S.m; bump(S, 'cash', bonusAmt, ch); gauge(S, 'work', 3, ch); bump(S, 'stress', -4, ch); S.album.push(`${S.name} ${next} 승진 (월급 +${raise}만)`); return {text:`${ok}\n\n직급이 ${cur}에서 ${next}으로 올랐다. 월급이 ${raise}만원 오르고, 승진 축하금 ${bonusAmt}만원이 나왔다.`, chips:ch}; }
    S.promoAt = S.m - 6; bump(S, 'stress', 6, ch); gauge(S, 'work', -1, ch); return {text:`${no}\n\n이번에는 이름이 없었다. 하지만 다음 심사까지 쌓은 경력은 어디 가지 않는다.`, chips:ch}; };
  return {id:`promo_${r}_${S.m}`, speaker:'', title:`${next} 승진 심사`, place:'cafe',
    text:S => `${c.company}에서 ${next} 승진 심사 시즌이 시작됐다. 이번 분기 평가표에는 ${cur} 시절의 이름이 적혀 있다. 마흔의 나는 이 자리에서 늘 “다음에 하죠”라고 말했다. 이번엔 어떻게 할까.`,
    choices:[
      {label:'성과를 앞세워 심사에 임한다', sub:'일 기둥이 높을수록 성공', run(S){ return win(S, 0.05, '', '그동안 쌓아 온 결과물을 하나씩 꺼내 설명했다. 임원들의 고개가 천천히 끄덕여졌다.', '발표는 무난했지만 결정적인 한 방이 부족했다.'); }},
      {label:'협상 테이블에서 직접 요구한다', sub:'협상이 높을수록 유리', run(S){ return win(S, (S.st.neg - 40) / 260, '', '“제 기여도와 책임 범위를 정리했습니다.” 숫자를 근거로 또박또박 말하자 회의실 공기가 달라졌다.', '“시기상조입니다.” 단호한 대답이 돌아왔다. 협상은 나쁘지 않았지만 때가 아니었다.'); }},
      {label:'이번에는 미룬다', sub:'스트레스 -3 · 다음 기회', run(S){ const ch = []; S.promoAt = S.m - 8; bump(S, 'stress', -3, ch); return {text:'조금 더 쌓고 가기로 했다. 서두르지 않아도 되는 날도 있다.', chips:ch}; }},
    ]};
}
// ── 연말 보너스 ──────────────────────────────────────────────────────
function bonusEvent(S){
  if(!S.hired || inLawSchool(S) || monthOf(S) !== 12 || S.m - (S.hiredAt || 0) < 6) return null;
  const key = 'bonus_' + yearOf(S); if(S.seen[key]) return null;
  const amt = Math.round(payOf(S) * (0.8 + 0.25 * (S.rank || 0) + S.work / 140) * (0.9 + R() * 0.3));
  return {id:key, speaker:'', title:'연말 성과급', place:'cafe',
    text:S => `${yearOf(S)}년 연말, 통장에 성과급 ${amt}만원이 찍혔다. 올 한 해 쌓은 평가가 숫자로 돌아온 날이다. 어디에 쓸까.`,
    choices:[
      {label:'통장에 모아 둔다', sub:`자금 +${amt}만`, run(S){ const ch = []; bump(S, 'cash', amt, ch); return {text:'든든한 숫자가 하나 늘었다. 마흔의 나는 이 돈을 아껴 쓰지 못해서 늘 부족했다.', chips:ch}; }},
      {label:'가족과 친구에게 한턱 쏜다', sub:`자금 +${Math.round(amt * 0.55)}만 · 관계 +2`, run(S){ const ch = []; bump(S, 'cash', Math.round(amt * 0.55), ch); gauge(S, 'bond', 2, ch); bump(S, 'stress', -4, ch); return {text:'엄마에게 작은 선물을, 소연에게 맛있는 저녁을 샀다. 돈을 쓰는데 이렇게 마음이 부풀 수 있다니.', chips:ch}; }},
      {label:'나에게 투자한다', sub:`자금 +${Math.round(amt * 0.5)}만 · 나 +2 · 실무 +1`, run(S){ const ch = []; bump(S, 'cash', Math.round(amt * 0.5), ch); gauge(S, 'self', 2, ch); fx(S, {skill:1}, ch); return {text:'강의와 책, 그리고 오래 미뤄 둔 건강검진을 끊었다. 나를 위한 지출은 가장 오래 남는 지출이다.', chips:ch}; }},
    ]};
}
// ── 장학금(학기가 끝나는 달) ────────────────────────────────────────────
function scholarshipEvent(S){
  if(S.m >= 48 || S.m < 4 || S.m % 6 !== 4) return null;
  const key = 'schol_' + S.m; if(S.seen[key]) return null;
  const sem = S.semStudy || 0, score = sem * 11 + S.st.know * 0.65;
  const tier = score >= 72 ? 2 : score >= 48 ? 1 : 0, amt = tier === 2 ? 150 : tier === 1 ? 60 : 0, term = S.m < 24 ? Math.floor(S.m / 6) + 1 : Math.floor(S.m / 6) + 1;
  return {id:key, speaker:'', title:'성적과 장학금', place:'campus',
    text:S => `학기가 끝났다. 성적표가 나오는 날, 학과 게시판 앞에 사람들이 모여 있다. 이번 학기 공부한 횟수는 ${sem}번. ${tier === 2 ? '이름이 성적 우수 장학생 명단에 올라 있었다.' : tier === 1 ? '부분 장학생 명단 끝에 이름이 있었다.' : '장학생 명단에 내 이름은 없었다.'}`,
    choices:[{label:tier ? '장학금을 받는다' : '다음 학기를 다짐한다', sub:tier ? `자금 +${amt}만 · 학식 +${tier}` : '학기 공부 횟수가 쌓여야 해요', run(S){ const ch = []; if(tier){ bump(S, 'cash', amt, ch); fx(S, {know:tier}, ch); gauge(S, 'self', 1, ch); S.album.push(`${term}학기 ${tier === 2 ? '성적 우수' : '부분'} 장학금 ${amt}만`); } else bump(S, 'stress', 2, ch); S.semStudy = 0; return {text:tier === 2 ? '“진짜 받았다!” 엄마에게 가장 먼저 전화했다. 도서관에서 보낸 밤이 숫자가 되어 돌아왔다.' : tier === 1 ? '전액은 아니지만 이번 학기 생활비에 큰 보탬이 됐다. 다음엔 우수 장학생을 노려 보자.' : '아쉬웠다. 이번 학기엔 공부가 조금 모자랐다. 다음 학기엔 시간표를 다시 짜 보자.', chips:ch}; }}]};
}
function careerEvent(S){ return scholarshipEvent(S) || promotionEvent(S) || bonusEvent(S); }
