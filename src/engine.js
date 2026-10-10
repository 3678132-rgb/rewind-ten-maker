// ==ENGINE== 순수 게임 로직 (DOM 금지: sim.mjs가 이 파일들을 그대로 실행한다)
const TOTAL_MONTHS = 120, START_YEAR = 2006, START_MONTH = 3; // 2006년 3월 입학 → 2016년 2월
const STAT = {know:'학식', skill:'실무', neg:'협상', ins:'통찰', sense:'감각', dare:'도전', charm:'매력'};
const STAT_KEYS = Object.keys(STAT);
const PILLAR = {work:'일', bond:'관계', self:'나'};
const LABEL = Object.assign({hp:'체력', stress:'스트레스', cash:'자금', clarity:'기억 선명도'}, STAT, PILLAR);

let R = Math.random;
function seededRand(seed){ let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function seedMonth(S){ if(!S.seed) S.seed = (Math.random() * 4294967295) >>> 0 || 1; R = seededRand((S.seed ^ Math.imul(S.m + 1, 2654435761)) >>> 0); }
const rand = (a, b) => a + R() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = arr => arr[Math.floor(R() * arr.length)];
function josa(w, a, b){ const c = w.charCodeAt(w.length - 1); const has = c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 !== 0; return w + (has ? a : b); }
const fmtMoney = v => { const n = Math.round(v); const s = n < 0 ? '-' : ''; const a = Math.abs(n); return s + (a >= 10000 ? (a / 10000).toFixed(a % 10000 ? 1 : 0) + '억' : a.toLocaleString('ko-KR') + '만원'); };

const monthOf = S => (S.m + START_MONTH - 1) % 12 + 1;
const yearOf = S => START_YEAR + Math.floor((S.m + START_MONTH - 1) / 12);
const ageOf = S => 20 + Math.floor(S.m / 12);
const monthIndex = (y, mo) => (y - START_YEAR) * 12 + (mo - START_MONTH); // 실제 연·월 → S.m
const SLOT_NAMES = ['상순', '중순', '하순'];

// ── 되감기 전의 나 / 가장 후회하는 것 ──────────────────────────────
const ORIGINS = [
  {id:'office',  name:'사무직',     icon:'🗂️', desc:'경리·총무로 15년. 서류와 숫자엔 자신 있었다.',   fx:{skill:12, know:5, neg:4}},
  {id:'sales',   name:'영업직',     icon:'📞', desc:'사람 상대로 먹고살았다. 거절엔 이골이 났다.',     fx:{neg:14, charm:8}},
  {id:'design',  name:'디자이너',   icon:'🎨', desc:'야근과 시안 수정 속에서 감각만은 지켰다.',       fx:{sense:14, skill:6}},
  {id:'teacher', name:'학원 강사',  icon:'📚', desc:'남의 아이들을 가르치며 내 인생은 못 가르쳤다.',   fx:{know:12, ins:8}},
  {id:'service', name:'서비스직',   icon:'☕', desc:'웃는 얼굴 뒤로 속이 닳았다. 사람 마음은 잘 읽는다.', fx:{charm:8, ins:10}},
];
const REGRETS = [
  {id:'work', name:'일', icon:'💼', desc:'그렇게 일했는데 해고 한 장이었다.',        fx:{work:10, skill:4}},
  {id:'bond', name:'사람', icon:'🫂', desc:'곁에 있던 사람들을 제대로 붙잡지 못했다.',   fx:{bond:10, charm:4}},
  {id:'self', name:'나', icon:'🪞', desc:'나를 돌본 기억이 하나도 없다.',             fx:{self:10, ins:4}},
];
const ACTS_ORDER_CATS = ['공부', '일', '돈', '관계', '나', '휴식'];

function newGame(name, originId, regretId){
  const o = ORIGINS.find(x => x.id === originId) || ORIGINS[0], rg = REGRETS.find(x => x.id === regretId) || REGRETS[0];
  const S = {v:1, name:name || '서윤', origin:o.id, regret:rg.id, m:0, phase:'plan', plan:[null, null, null],
    hp:80, stress:30, cash:200, clarity:100, borrowed:0,
    st:{know:20, skill:8, neg:30, ins:40, sense:15, dare:10, charm:22},
    work:5, bond:10, self:15,
    track:null, hired:false, love:{}, partner:null, engaged:false,
    seen:{}, cd:{}, uses:{}, last:{work:0, bond:0, self:0}, album:[], ending:null, seed:null, collapse:false, picks:{}};
  for(const k in o.fx) S.st[k] += o.fx[k];
  for(const k in rg.fx){ if(S[k] != null && typeof S[k] === 'number') S[k] += rg.fx[k]; else if(S.st[k] != null) S.st[k] += rg.fx[k]; }
  return S;
}

// ── 수치 변경 헬퍼 ─────────────────────────────────────────────
function push(ch, label, d, money){ if(!ch) return; if(Math.abs(d) < 0.05) return; ch.push({label, d, money:!!money}); }
function grow(S, k, base, ch){ const cur = S.st[k]; const nv = clamp(cur + base * 0.6 * Math.max(0.1, 1 - cur / 115), 0, 100); push(ch, STAT[k], nv - cur); S.st[k] = nv; }
const GAUGE_SCALE = 0.34; // 3축 증가량 배율 (밸런스 조절용)
function gauge(S, k, d, ch){ const cur = S[k]; const nv = clamp(d > 0 ? cur + d * GAUGE_SCALE * Math.max(0.15, 1 - cur / 95) : cur + d, 0, 100); push(ch, PILLAR[k], nv - cur); S[k] = nv; if(d > 0 && k !== 'self' && k !== 'bond') S.last.work = S.m; if(d > 0 && k === 'bond') S.last.bond = S.m; if(d > 0 && k === 'self') S.last.self = S.m; }
function bump(S, key, d, ch){
  if(key === 'cash'){ S.cash += d; push(ch, LABEL.cash, d, true); return; }
  if(key === 'clarity'){ const b = S.clarity; S.clarity = clamp(b + d, 0, 100); push(ch, LABEL.clarity, S.clarity - b); return; }
  if(key === 'hp' || key === 'stress'){ const b = S[key]; S[key] = clamp(b + d, 0, 100); push(ch, LABEL[key], S[key] - b); return; }
  if(PILLAR[key]) return gauge(S, key, d, ch);
  if(STAT[key]) return grow(S, key, d, ch);
}
function fx(S, o, ch){ for(const k in o) bump(S, k, o[k], ch); return ch; }

// ── 연애(규칙은 1편과 같다: 공식 연인은 한 명) ──────────────────
const LOVE_STAGE = {'-9':'끝', '-1':'썸', '1':'연인', '2':'결혼 약속'};
const loveOf = S => S.love;
function addAff(S, id, d, ch){
  const v = S.love[id]; if(!v) return; const lv = LOVERS[id];
  if(d > 0 && S.partner && S.partner !== id) d = Math.min(d, Math.max(0, 44 - v.aff)); // 마음은 있어도 선을 지킨다
  const b = v.aff; v.aff = clamp(v.aff + d, 0, 100); push(ch, lv.name + ' 호감', v.aff - b);
}
function dateTarget(S){
  if(S.partner) return S.partner;
  const c = Object.keys(S.love).filter(i => S.love[i].stage === -1 && S.love[i].aff >= 18).sort((a, b) => S.love[b].aff - S.love[a].aff);
  return c[0] || null;
}

// ── 활동 ──────────────────────────────────────────────────────
// {cat,name,icon,desc,cost,slots,hp,stress,eff:{통계/게이지}, pay, req(S)→이유문자열|null, run(S,ch,out)}
const JOBS = { // 졸업 후 직장 트랙
  corp:     {name:'회사 근무',   pay:105, pwr:1.3, eff:{skill:2.6, neg:1.0, work:2.2}, stress:8,  hp:7},
  startup:  {name:'스타트업 근무', pay:70,  pwr:0.9, eff:{skill:3.0, dare:1.6, work:3.0}, stress:9,  hp:9},
  freelance:{name:'프리랜서 작업', pay:80,  pwr:1.1, eff:{skill:2.4, sense:1.6, work:2.4}, stress:6,  hp:6},
  grad:     {name:'연구실 생활',  pay:40,  pwr:0.4, eff:{know:3.0, ins:1.0, work:2.2}, stress:7,  hp:6},
};
const jobOf = S => JOBS[S.track] || JOBS.corp;
const earnedMult = S => 1 + (S.st.skill + S.st.neg) / 220;

const ACTS = {
  study:   {cat:'공부', icon:'📖', name:'수업·공부', desc:'학점과 기초 체력. 몸은 20살, 머리는 40살이라 이해가 빠르다.', cost:0, hp:-5, stress:4, eff:{know:5, work:1.2}, req:S => S.m >= 48 && S.track !== 'grad' ? '졸업했어요' : null},
  cert:    {cat:'공부', icon:'🏷️', name:'자격증·어학', desc:'눈에 보이는 이력 한 줄.', cost:15, hp:-4, stress:5, eff:{know:3, skill:2.5, work:1.6}},
  tutor:   {cat:'돈',   icon:'✏️', name:'과외',    desc:'아는 걸 가르쳐 돈을 번다. 가르치다 보면 내가 정리된다.', cost:0, hp:-5, stress:3, pay:100, eff:{know:1, neg:0.8, work:0.8}, req:S => S.st.know < 30 ? '학식 30 필요' : null},
  cafe:    {cat:'돈',   icon:'☕', name:'카페 알바', desc:'시급은 낮아도 사람과 부딪히며 감각이 돌아온다.', cost:0, hp:-8, stress:5, pay:70, eff:{skill:1.2, neg:1.2, charm:0.8, work:0.5}},
  intern:  {cat:'일',   icon:'🧑‍💼', name:'인턴·현장 경험', desc:'이력서에 쓸 경험. 2학년부터 지원할 수 있다.', cost:0, hp:-8, stress:7, pay:55, eff:{skill:4, neg:2, work:2.2}, req:S => S.m < 12 ? '2학년부터 가능' : (S.m >= 48 && S.hired ? '이미 취업했어요' : null)},
  project: {cat:'일',   icon:'🛠️', name:'사이드 프로젝트', desc:'블로그·창작·서비스 만들기. 대박은 드물고 경험은 확실하다.', cost:10, hp:-6, stress:5, eff:{skill:3, sense:2, dare:2.2, work:2.4}, run(S, ch, out){ S.projects = (S.projects || 0) + 1; if(R() < 0.07 + S.st.dare / 900){ const g = Math.round(rand(80, 220)); bump(S, 'cash', g, ch); out.note = '올려둔 작업물이 입소문을 탔다.'; gauge(S, 'work', 2, ch); } }},
  jobhunt: {cat:'일',   icon:'📮', name:'구직 활동', desc:'자소서, 포트폴리오, 면접. 졸업 후에도 일이 없다면 이것부터.', cost:10, hp:-5, stress:8, eff:{neg:1.5, work:0.8}, req:S => (S.m < 36 || S.hired) ? '구직 대상이 아니에요' : null, run(S, ch, out){
    const p = clamp(0.18 + (S.st.skill + S.st.know + S.st.neg) / 330, 0.15, 0.75); if(R() < p){ S.hired = true; S.track = S.track || 'corp'; out.note = '합격 통보! 출근할 곳이 생겼다.'; gauge(S, 'work', 4, ch); } else out.note = '이번에도 불합격 메일이 왔다.'; }},
  job:     {cat:'일',   icon:'🏢', name:'직장 근무', desc:'정식 직장. 월급과 경력이 쌓인다.', cost:0, hp:-7, stress:8, req:S => S.hired ? null : '취업 후 가능', run(S, ch, out){ const j = jobOf(S); const pay = Math.round(j.pay * earnedMult(S) * (0.85 + S.work / 300)); bump(S, 'cash', pay, ch); fx(S, j.eff, ch); bump(S, 'hp', -j.hp, ch); bump(S, 'stress', j.stress, ch); out.skipBase = true; }},
  future:  {cat:'돈',   icon:'🔮', name:'미래 지식 활용', desc:'20년 뒤를 아는 사람의 반칙. 큰돈이 되지만 기억이 닳고, 이 돈은 내 것이 아니다.', cost:0, hp:-2, stress:3, req:S => S.clarity < 12 ? '기억이 너무 흐려요' : null, run(S, ch, out){
    const g = Math.round(rand(120, 380) * (0.35 + S.clarity / 130)); bump(S, 'cash', g, ch); bump(S, 'clarity', -(5 + R() * 3), ch); S.borrowed++; out.note = '아는 대로 움직였을 뿐인데 통장이 불어난다. 어쩐지 손이 시리다.'; }},
  exercise:{cat:'나',   icon:'🏃', name:'운동', desc:'스무 살의 몸은 쓰면 쓸수록 돌아온다.', cost:5, hp:5, stress:-6, eff:{dare:1.2, self:1.6}},
  journal: {cat:'나',   icon:'📓', name:'일기·상담', desc:'마흔의 내가 못 해 준 일. 마음을 말로 꺼내 놓는다.', cost:5, hp:0, stress:-10, eff:{ins:1.8, self:2.8}},
  hobby:   {cat:'나',   icon:'🎧', name:'취미·문화생활', desc:'영화, 전시, 음악. 쓸모없는 시간이 사람을 만든다.', cost:12, hp:1, stress:-8, eff:{sense:2.2, self:1.8}},
  style:   {cat:'나',   icon:'💄', name:'스타일링', desc:'거울 속 스무 살을 제대로 가꿔 본다.', cost:15, hp:0, stress:-3, eff:{charm:3, sense:1.2, self:0.8}},
  family:  {cat:'관계', icon:'🏠', name:'엄마와 시간', desc:'마흔의 나는 엄마에게 늘 바빴다. 이번엔 다르게.', cost:5, hp:1, stress:-7, eff:{bond:2.6, self:0.9}, run(S, ch){ S.mom = clamp((S.mom || 40) + 5, 0, 100); }},
  friends: {cat:'관계', icon:'🥂', name:'친구 만나기', desc:'수다 한 번이 이렇게 비싼 시간이었다니.', cost:8, hp:0, stress:-7, eff:{bond:2.4, charm:0.7}},
  club:    {cat:'관계', icon:'🎪', name:'동아리·모임', desc:'새로운 얼굴들. 인연은 여기서 시작되기도 한다.', cost:5, hp:-3, stress:-2, eff:{charm:1.6, neg:1.0, dare:0.6, bond:1.4}},
  date:    {cat:'관계', icon:'💞', name:'데이트', desc:'마음 가는 사람과 보내는 시간.', cost:12, hp:-1, stress:-6, eff:{bond:2.2}, req:S => dateTarget(S) ? null : '호감 가는 사람이 아직 없어요', run(S, ch, out){
    const id = dateTarget(S), lv = LOVERS[id], v = S.love[id]; out.lover = id; v.lastDate = S.m; v.dates = (v.dates || 0) + 1; addAff(S, id, 5 + (S.st[lv.like] || 0) / 28 + (S.st.charm / 60), ch); out.note = pick(lv.dateLines); }},
  travel:  {cat:'휴식', icon:'🧳', name:'여행', desc:'두 칸을 쓰는 긴 호흡. 낯선 곳에서 나를 만난다.', cost:60, slots:2, hp:6, stress:-24, eff:{self:3.2, sense:1.6, ins:1.2, dare:0.8}},
  rest:    {cat:'휴식', icon:'🛌', name:'휴식', desc:'아무것도 하지 않을 권리.', cost:0, hp:18, stress:-12, eff:{}},
};
for(const id in ACTS){ ACTS[id].id = id; ACTS[id].slots = ACTS[id].slots || 1; }
const actName = (S, id) => id === 'job' && S.hired ? jobOf(S).name : ACTS[id].name;

function doAction(S, id){
  const a = ACTS[id], ch = [], out = {id, ch, note:''};
  if(a.cost) bump(S, 'cash', -a.cost, ch);
  if(a.pay){ const pay = Math.round(a.pay * earnedMult(S) * (id === 'cafe' ? 1 : 1)); bump(S, 'cash', pay, ch); }
  if(a.run) a.run(S, ch, out);
  if(!out.skipBase){
    if(a.hp) bump(S, 'hp', a.hp, ch);
    if(a.stress) bump(S, 'stress', a.stress, ch);
    if(a.eff) fx(S, a.eff, ch);
  }
  S.uses[id] = (S.uses[id] || 0) + 1;
  if(S.hp <= 0){ S.hp = 0; S.collapse = true; out.burnout = true; }
  return out;
}

// ── 한 달 정산 ────────────────────────────────────────────────
const livingCost = S => S.m < 48 ? 55 : 95;
const allowance = S => S.m < 48 ? 45 : 0;
function settle(S){
  const ch = [];
  bump(S, 'cash', -livingCost(S), ch); if(allowance(S)) bump(S, 'cash', allowance(S), ch);
  if(S.stress >= 75){ bump(S, 'self', -1.2, ch); }
  if(S.stress >= 100 || S.hp <= 0) S.collapse = true;
  // 균형: 한쪽만 하면 다른 쪽이 마른다
  if(S.m - S.last.bond > 3) gauge(S, 'bond', -0.7, ch);
  if(S.m - S.last.work > 4) gauge(S, 'work', -0.5, ch);
  if(S.m - S.last.self > 4) gauge(S, 'self', -0.5, ch);
  S.clarity = clamp(S.clarity - 0.25, 0, 100);
  for(const id in S.love){ const v = S.love[id]; if(v.stage === -9) continue; if(S.m - (v.lastDate == null ? v.since : v.lastDate) > 3){ const b = v.aff; v.aff = clamp(v.aff - (v.stage >= 1 ? 1.4 : 0.8), 0, 100); if(v.stage >= 1 && v.aff < 14) v.fading = true; } }
  S.hp = clamp(S.hp + 3, 0, 100);
  S.stress = clamp(S.stress - 2, 0, 100);
  if(S.cash < -300 && !S.ending) S.ending = 'ret_debt';
  return ch;
}
