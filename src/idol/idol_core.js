// 아이돌 모드 핵심: 이름·활동·상태·월말평가·데뷔·컴백·시상식·정산. ENGINE 구간(DOM 금지)
// engine.js 바로 뒤에서 불린다. 기존 키(know, skill …)는 그대로 두고 이름과 규칙만 바꾼다.
const AGENCY = '스타라이트 엔터테인먼트', GROUP_NAME = '루미너스', PROJECT_GROUP = '프리즘', INDIE_AGENCY = '문라이트 엔터';
Object.assign(STAT, {know:'보컬', skill:'댄스', sense:'표현력', charm:'비주얼', dare:'예능감', neg:'팬소통', ins:'멘탈'});
Object.assign(PILLAR, {work:'실력', bond:'관계', self:'마음'});
Object.assign(LABEL, STAT, PILLAR);

// ── 시작 선택: 포지션(학과 자리) · 마흔의 나 · 후회 ─────────────────
MAJORS.splice(0, MAJORS.length,
  {id:'vocal',    name:'메인보컬 지망', icon:'🎤', desc:'노래 하나로 무대를 채우고 싶다. 보컬이 높게 시작한다.', fx:{know:12, ins:3}, fav:[]},
  {id:'dance',    name:'메인댄서 지망', icon:'💃', desc:'몸이 먼저 음악을 듣는다. 댄스가 높게 시작한다.', fx:{skill:14, dare:3}, fav:[]},
  {id:'visual',   name:'센터·비주얼 지망', icon:'✨', desc:'카메라가 먼저 찾는 얼굴. 비주얼이 높게 시작한다.', fx:{charm:12, sense:3}, fav:[]},
  {id:'rap',      name:'래퍼·작사 지망', icon:'🎧', desc:'내 말로 쓴 가사를 무대에서. 표현력과 멘탈이 높다.', fx:{sense:8, ins:5, dare:3}, fav:[]},
  {id:'allround', name:'올라운더', icon:'🌟', desc:'뭐든 평균 이상. 대신 확실한 무기가 없다.', fx:{know:5, skill:6, charm:5}, fav:[]});
ORIGINS.splice(0, ORIGINS.length,
  {id:'office',  name:'회사원',       icon:'🗂️', desc:'꿈을 접고 경리로 15년. 회식 노래방에서만 노래했다.', fx:{neg:8, ins:8}},
  {id:'teacher', name:'보컬 학원 강사', icon:'🎼', desc:'남의 데뷔만 도왔다. 발성 하나는 자신 있다.', fx:{know:12, ins:4}},
  {id:'dancer',  name:'방송댄스 강사', icon:'🩰', desc:'동네 문화센터 강사. 안무는 몸이 기억한다.', fx:{skill:12, dare:4}},
  {id:'model',   name:'쇼핑몰 모델',  icon:'📷', desc:'카메라 앞에서 표정 짓는 법은 안다.', fx:{charm:9, sense:7}},
  {id:'service', name:'서비스직',     icon:'☕', desc:'웃는 얼굴 뒤로 속이 닳았다. 사람 마음은 잘 읽는다.', fx:{neg:10, charm:4}});
REGRETS.splice(0, REGRETS.length,
  {id:'work', name:'꿈',   icon:'🎤', desc:'오디션에 붙고도 무대를 포기했다.', fx:{work:10, know:3}},
  {id:'bond', name:'사람', icon:'🫂', desc:'곁에 있던 사람들을 제대로 붙잡지 못했다.', fx:{bond:10, neg:3}},
  {id:'self', name:'나',   icon:'🪞', desc:'남의 기대만 따라 살았다.', fx:{self:10, ins:3}});

// ── 상태 ──────────────────────────────────────────────────────
const idolBase = () => ({stage:'trainee', debutAt:null, group:null, evals:[], lastRank:null, warn:0, debutTeam:false, survival:null, fans:0, comebacks:0, wins:0, awards:[], solo:false, actor:false, producer:false, variety:false, scandal:0, songs:0, contract:null});
const IDOL = S => (S.idol = S.idol || idolBase());
const isTrainee = S => IDOL(S).stage === 'trainee';
const isIdol = S => IDOL(S).stage === 'idol';
const isOut = S => IDOL(S).stage === 'out';
const sinceDebut = S => IDOL(S).debutAt == null ? -1 : S.m - IDOL(S).debutAt;
const fansOf = S => IDOL(S).fans;
const lastRank = S => IDOL(S).lastRank;
function addFans(S, n, ch){ const I = IDOL(S), b = I.fans; I.fans = Math.max(0, Math.round((I.fans + n) * 10) / 10); push(ch, '팬(만 명)', I.fans - b); }
function addScandal(S, d, ch){ const I = IDOL(S), b = I.scandal; I.scandal = clamp(I.scandal + d, 0, 100); push(ch, '스캔들 위험', I.scandal - b); }
const fmtFans = n => n >= 100 ? `${Math.round(n)}만` : n >= 1 ? `${n.toFixed(1).replace(/\.0$/, '')}만` : `${Math.round(n * 10000).toLocaleString('ko-KR')}명`;
const idolStatusLine = S => { const I = IDOL(S);
  if(isIdol(S)) return `${I.group || GROUP_NAME} · 데뷔 ${sinceDebut(S) < 12 ? sinceDebut(S) + '개월' : Math.floor(sinceDebut(S) / 12) + '년 차'} · 팬 ${fmtFans(I.fans)}`;
  if(isOut(S)) return '데뷔 준비 중(무소속)';
  return `${AGENCY.replace('테인먼트', '')} 연습생${I.lastRank ? ` · 월말평가 ${I.lastRank}위` : ''}${I.debutTeam ? ' · 데뷔조' : ''}`; };
// 새 게임: 아이돌 상태를 붙인다
const _newGameBase = newGame;
newGame = function(name, originId, regretId, majorId){ const S = _newGameBase(name, originId, regretId, majorId); S.v = 3; S.idol = idolBase(); S.cash = 120; S.mom = 30; return S; };

// ── 활동 교체 ─────────────────────────────────────────────────
for(const id of ['study', 'cert', 'tutor', 'intern', 'project', 'jobhunt', 'job', 'club']) delete ACTS[id];
ACTS_ORDER_CATS.splice(0, ACTS_ORDER_CATS.length, '연습', '활동', '돈', '관계', '나', '휴식');
const needIdol = S => isIdol(S) ? null : '데뷔 후 가능';
Object.assign(ACTS, {
  vocal:  {cat:'연습', icon:'🎤', name:'보컬 레슨', desc:'호흡, 발성, 음정. 마흔의 귀가 스무 살의 목을 가르친다.', cost:0, hp:-4, stress:5, eff:{know:5, work:1.4}},
  dance:  {cat:'연습', icon:'💃', name:'댄스 연습', desc:'거울 앞에서 같은 동작을 백 번. 땀이 실력이 된다.', cost:0, hp:-8, stress:4, eff:{skill:5, dare:0.6, work:1.4}},
  stage:  {cat:'연습', icon:'🎬', name:'무대·표정 연습', desc:'카메라를 찾는 눈, 엔딩 포즈, 무대 위의 3초.', cost:0, hp:-5, stress:3, eff:{sense:3.4, charm:1.4, work:1.0}},
  write:  {cat:'연습', icon:'📝', name:'작사·작곡 공부', desc:'남의 노래가 아니라 내 노래를. 오래 걸리지만 남는다.', cost:5, hp:-3, stress:4, eff:{sense:2.0, ins:1.6, know:1.0, work:0.8}, run(S, ch, out){ const I = IDOL(S); if(R() < (0.12 + S.st.sense / 400) * (S._gameMul || 1)){ I.songs++; out.note = `곡 하나를 끝까지 완성했다. 지금까지 쓴 노래 ${I.songs}곡.`; fx(S, {self:1}, ch); } }},
  reaudition: {cat:'연습', icon:'🚪', name:'오디션 재도전', desc:'다른 기획사의 문을 두드린다. 떨어져도 다시.', cost:10, hp:-5, stress:9, eff:{dare:1.2}, req:S => isOut(S) ? (S.m >= 72 ? '이제 오디션 나이가 지났다' : null) : '연습생·데뷔 후에는 필요 없어요', run(S, ch, out){
    const p = clamp(0.005 + (S.st.know + S.st.skill + S.st.charm - 180) / 1000, 0.005, 0.06); if(R() < p){ const I = IDOL(S); I.stage = 'idol'; I.debutAt = S.m; I.group = `${INDIE_AGENCY.split(' ')[0]} 솔로`; I.solo = true; S.track = 'actor'; addFans(S, 0.5, ch); gauge(S, 'work', 4, ch); out.note = `${INDIE_AGENCY}에서 연락이 왔다. 작은 회사지만, 솔로로 데뷔하자고.`; } else out.note = '“다음 기회에.” 같은 말을 또 들었다. 그래도 문은 하나 더 남아 있다.'; }},
  musicshow: {cat:'활동', icon:'📺', name:'음악방송', desc:'매주 무대. 사전녹화는 새벽 다섯 시.', cost:0, hp:-9, stress:6, eff:{sense:1.6, work:1.2}, req:needIdol, run(S, ch, out){ addFans(S, (0.15 + (S.st.sense + S.st.charm) / 400 * (1 + Math.min(fansOf(S), 60) / 60)) * (S._gameMul || 1), ch); out.note = pick(['새벽 사전녹화, 대기실 쪽잠, 3분의 무대. 엔딩 포즈 때 카메라 빨간 불이 나를 찾았다.', '리허설에서 이어모니터가 나갔다. 본방에선 손짓 하나로 넘겼다. 대기실에서 다리가 풀렸다.', '응원법이 처음으로 크게 들렸다. 무대 아래 형광봉이 우리 색이었다.']); }},
  variety: {cat:'활동', icon:'🎙️', name:'예능 출연', desc:'웃기면 뜨고, 실수하면 박제된다.', cost:0, hp:-5, stress:5, eff:{dare:2.4, charm:0.8}, req:needIdol, run(S, ch, out){ const hit = R() < 0.25 + S.st.dare / 220; addFans(S, hit ? 0.5 + Math.min(fansOf(S), 80) / 50 : 0.1, ch); if(!hit && R() < 0.15){ addScandal(S, 6, ch); out.note = '긴장해서 던진 말 한마디가 짤로 돌았다. 해명할 수도 없는 애매한 말.'; } else out.note = hit ? '아무 생각 없이 한 리액션이 터졌다. 다음 날 실시간 검색어에 내 이름이 있었다.' : '편집에서 거의 잘렸다. 분량은 3초. 그래도 얼굴은 남았다.'; if(hit && S.st.dare > 55) IDOL(S).variety = true; }},
  fansign: {cat:'활동', icon:'✍️', name:'팬사인회', desc:'한 사람 한 사람과 눈을 맞추는 시간.', cost:0, hp:-4, stress:-2, eff:{neg:2.4, self:1.0}, req:needIdol, run(S, ch, out){ addFans(S, 0.15 + S.st.neg / 300, ch); out.note = pick(['“언니 노래 듣고 수능 버텼어요.” 펜을 쥔 손이 잠깐 멈췄다.', '포스트잇에 적힌 질문 서른 개. 하나하나 대답하다 시간이 다 갔다.', '같은 얼굴을 세 번째 봤다. 이름을 불러 주자 그 팬이 울었다.']); }},
  cf:     {cat:'돈', icon:'📸', name:'광고·화보 촬영', desc:'얼굴이 곧 계약서. 인기만큼 들어온다.', cost:0, hp:-4, stress:3, eff:{charm:1.2}, req:S => !isIdol(S) ? '데뷔 후 가능' : fansOf(S) < 5 ? '팬 5만 명부터 들어와요' : null, run(S, ch, out){ bump(S, 'cash', Math.round(20 + fansOf(S) * 2.2), ch); out.note = '하루 종일 같은 미소를 지었다. 광고판 속 나는 피곤해 보이지 않았다.'; }},
  live:   {cat:'활동', icon:'📱', name:'SNS·라이브 방송', desc:'브이로그와 팬 라이브. 관심은 양날의 검.', cost:0, hp:-1, stress:2, eff:{neg:2.0, dare:1.0}, run(S, ch, out){ if(isIdol(S)){ addFans(S, 0.1 + S.st.neg / 400, ch); if(R() < 0.06){ addScandal(S, 5, ch); out.note = '라이브 중에 뒤로 비친 무언가 때문에 커뮤니티가 시끄러워졌다.'; } } else { addFans(S, 0.02 + S.st.charm / 2000, ch); out.note = '연습생 브이로그 조회수가 조금씩 오른다. 아직은 예비 팬들.'; } }},
  diet:   {cat:'나', icon:'🥗', name:'관리·다이어트', desc:'체중계와 거울 사이. 비주얼은 오르지만 마음이 깎인다.', cost:8, hp:-4, stress:6, eff:{charm:3.0, self:-0.6}},
});
// 연습생·무소속·팬 적은 신인이 할 수 있는 부업(미니게임을 잘하면 수입이 더 붙는다)
const sideOk = S => isIdol(S) && fansOf(S) >= 5 ? '팬 5만 명이 넘으면 이런 일은 안 들어와요' : null;
const gameBonus = (S, ch, pay) => { const m = S._gameMul; if(m == null || Math.abs(m - 1) < 0.05) return ''; const d = Math.round(pay * (m - 1)); bump(S, 'cash', d, ch); return d > 0 ? ` 반응이 좋아서 ${d}만 원을 더 받았다.` : ` 실수가 잦아서 ${-d}만 원이 깎였다.`; };
Object.assign(ACTS, {
  shopmodel: {cat:'돈', icon:'👗', name:'쇼핑몰 피팅 모델', desc:'온라인 쇼핑몰 신상 촬영. 하루 종일 옷을 갈아입고 같은 미소를 짓는다.', cost:0, hp:-6, stress:4, pay:55, eff:{charm:1.6, sense:0.8},
    req:S => sideOk(S) || (S.st.charm < 25 ? '비주얼 25 필요' : null), run(S, ch, out){
      out.note = pick(['봄 신상 서른 벌. 갈아입을 때마다 실장님이 “턱 살짝, 좋아!”를 외쳤다.', '스튜디오 조명 아래 원피스만 열두 벌. 거울 속 나는 점점 모델 같아졌다.', '길거리 촬영이라 지나가던 사람들이 힐끔힐끔 봤다. 그래도 표정은 무너지지 않았다.']);
      if(R() < 0.12){ bump(S, 'cash', 20, ch); addFans(S, isIdol(S) ? 0.15 : 0.03, ch); out.note += ' 내 착용 사진이 쇼핑몰 메인에 걸렸다. “이 모델 누구예요?” 댓글이 달렸다.'; }
      else if(isTrainee(S) && R() < 0.1){ bump(S, 'stress', 4, ch); out.note += ' 회사에 들킬까 봐 마스크를 쓰고 출근했다.'; }
      out.note += gameBonus(S, ch, 55); }},
  cosmetic:  {cat:'돈', icon:'💄', name:'화장품 모델(신인)', desc:'로드숍 브랜드 SNS 광고 촬영. 클로즈업 하나에 피부 컨디션이 다 보인다.', cost:0, hp:-5, stress:5, pay:80, eff:{charm:2.2, neg:0.6},
    req:S => sideOk(S) || (S.st.charm < 40 ? '비주얼 40 필요' : null), run(S, ch, out){
      out.note = pick(['립 틴트 하나를 스무 번 발랐다 지웠다. 입술이 얼얼하다.', '“눈으로만 웃어 주세요.” 감독님 말에 거울 앞에서 한참 연습했다.', '쿠션 팩트를 톡톡 두드리는 손등 컷만 오십 번 찍었다.']);
      if(R() < 0.1){ bump(S, 'cash', 30, ch); addFans(S, isIdol(S) ? 0.3 : 0.05, ch); out.note += ' 광고 영상이 SNS에서 퍼졌다. 브랜드가 다음 시즌도 같이 하자고 했다.'; }
      out.note += gameBonus(S, ch, 80); }},
  eventstage:{cat:'돈', icon:'🎪', name:'지방 행사 무대', desc:'지역 축제, 개업식, 대학 축제 오프닝. 관객이 열 명이어도 무대는 무대.', cost:0, hp:-9, stress:5, pay:65, eff:{know:1.2, skill:1.2, dare:1.2},
    req:S => sideOk(S) || ((S.st.know + S.st.skill) / 2 < 35 ? '보컬·댄스 평균 35 필요' : null), run(S, ch, out){
      out.note = pick(['군청 앞 특설 무대. 앞줄 어르신들이 박수를 박자보다 빨리 쳤다.', '휴대폰 매장 개업식. 풍선 인형 옆에서 두 곡을 불렀다.', '대학 축제 오프닝. 다들 메인 가수를 기다렸지만, 몇 명은 끝까지 내 이름을 물어봤다.', '비 오는 수산 축제 무대. 우비를 입은 관객 스무 명이 끝까지 자리를 지켰다.']);
      addFans(S, isIdol(S) ? 0.08 : 0.02, ch); if(R() < 0.08){ fx(S, {self:1.5}, ch); out.note += ' 무대가 끝나고 꼬마 하나가 사인을 해 달라며 공책을 내밀었다.'; }
      out.note += gameBonus(S, ch, 65); }},
});
// 기존 활동을 아이돌 생활에 맞게
Object.assign(ACTS.exercise, {cat:'나', name:'체력 훈련', desc:'세 시간짜리 무대를 버틸 몸. 체력이 곧 실력이다.'});
Object.assign(ACTS.style, {cat:'나', name:'스타일링·피부 관리', desc:'카메라는 모공까지 본다.'});
Object.assign(ACTS.cafe, {name:'아르바이트', desc:'연습생은 월급이 없다. 편의점 야간 알바.', req:S => isIdol(S) ? '데뷔 후엔 알바를 못 해요' : null});
Object.assign(ACTS.friends, {name:'동기들과 시간', desc:'같은 꿈을 꾸는 사람들. 경쟁자이자 유일한 내 편.'});
Object.assign(ACTS.family, {name:'엄마와 시간', desc:'마흔의 나는 엄마 반대에 꿈을 접었다. 이번엔 설득해 본다.'});
Object.assign(ACTS.hobby, {name:'음악 감상·공연 보기', desc:'좋은 무대를 보는 것도 연습이다.', eff:{sense:2.4, self:1.6}});
Object.assign(ACTS.journal, {name:'일기·상담', desc:'흔들리는 마음을 말로 꺼내 놓는다. 멘탈이 버틴다.'});
const _dateRun = ACTS.date.run;
ACTS.date.run = function(S, ch, out){ _dateRun.call(this, S, ch, out); if(isIdol(S) && !S.married) addScandal(S, 3 + (S.partner === 'raon' ? 4 : 0), ch); };
ACTS.date.desc = '마음 가는 사람과 보내는 시간. 데뷔 후엔 들키면 열애설.';
for(const id in ACTS){ ACTS[id].id = id; ACTS[id].slots = ACTS[id].slots || 1; }

// ── 스케줄 미니게임: 화면에서 게임을 하면 S._actMul(0.6~1.4)이 채워지고, 그 칸의 능력치 상승에 곱해진다 ─────
const ACT_GAME = {vocal:'pitch', dance:'moves', write:'melody', stage:'pose', musicshow:'pose', shopmodel:'pose', cosmetic:'pose', eventstage:'pitch'};
const _doActionBase = doAction;
doAction = function(S, id){
  const mul = S._actMul; S._actMul = null; const a = ACTS[id];
  if(mul == null || !a) return _doActionBase(S, id);
  const orig = a.eff; if(orig){ const e = {}; for(const k in orig) e[k] = STAT[k] && orig[k] > 0 ? orig[k] * mul : orig[k]; a.eff = e; }
  S._gameMul = mul; try{ const out = _doActionBase(S, id); out.game = mul; return out; } finally{ a.eff = orig; S._gameMul = null; }
};
// ── 정산: 연습생은 숙소 제공·용돈, 데뷔 후 1년 반은 정산 0, 그 뒤 팬 수에 비례 ─────
const idolIncome = S => { if(!isIdol(S)) return 0; if(sinceDebut(S) < 18) return 0; return Math.round(20 + Math.min(fansOf(S), 150) * 0.55 + IDOL(S).wins * 2); };
const idolCost = S => isIdol(S) ? (sinceDebut(S) < 18 ? 0 : 30) : isOut(S) ? 20 : 10; // 연습생·신인은 숙소·식비를 회사가 댄다
const momAllowance = S => isTrainee(S) || isOut(S) ? ((S.mom || 0) >= 55 ? 30 : (S.mom || 0) >= 35 ? 15 : 5) : 0;
settle = function(S){
  const ch = [];
  bump(S, 'cash', -idolCost(S), ch); const al = momAllowance(S); if(al) bump(S, 'cash', al, ch); const inc = idolIncome(S); if(inc) bump(S, 'cash', inc, ch);
  if(S.stress >= 75) bump(S, 'self', -1.2, ch);
  if(S.stress >= 100 || S.hp <= 0) S.collapse = true;
  if(S.m - S.last.bond > 3) gauge(S, 'bond', -0.7, ch);
  if(S.m - S.last.work > 3) gauge(S, 'work', -0.6, ch);
  if(S.m - S.last.self > 4) gauge(S, 'self', -0.5, ch);
  for(const id in S.love){ const v = S.love[id]; if(v.stage === -9) continue; if(S.m - (v.lastDate == null ? v.since : v.lastDate) > 3){ v.aff = clamp(v.aff - (v.stage >= 1 ? 1.4 : 0.8), 0, 100); if(v.stage >= 1 && v.aff < 14) v.fading = true; } }
  if(typeof itemMonthly === 'function') itemMonthly(S, ch);
  if(isIdol(S)){ const I = IDOL(S); I.scandal = clamp(I.scandal - 1.5, 0, 100); if(sinceDebut(S) > 0) addFans(S, -fansOf(S) * 0.01, ch); }
  S.hp = clamp(S.hp + 3, 0, 100); S.stress = clamp(S.stress - 2, 0, 100);
  if(S.cash < -300 && !S.ending) S.ending = 'ret_debt';
  return ch;
};

// ── 월말평가 ─────────────────────────────────────────────────
const EVAL_SONGS = ['걸그룹 커버 메들리', '발라드 한 곡 + 프리스타일', '팀 퍼포먼스', '자작 랩 32마디', '선배 그룹 타이틀곡', '라이브 보컬 테스트', '카메라 테스트', '무반주 아카펠라'];
// 함께 경쟁하는 연습생 11명: 시작 점수 s0, 한 달 성장 g. 30개월 뒤엔 성장이 느려진다
const PEERS = [
  {name:'서하린', s0:44, g:1.25, ace:true}, {name:'지수', s0:36, g:1.1}, {name:'소연', s0:35, g:1.05}, {name:'하은', s0:24.5, g:1.4},
  {name:'태윤', s0:29.5, g:1.05}, {name:'민서', s0:28, g:1.1}, {name:'유나', s0:30, g:0.95}, {name:'채린', s0:25, g:1.15},
  {name:'다은', s0:28, g:0.9}, {name:'예진', s0:23, g:1.0}, {name:'수아', s0:21, g:0.95}];
const peerScore = (p, m) => p.s0 + p.g * Math.min(m, 30) + p.g * 0.35 * Math.max(0, Math.min(m, 60) - 30);
// 이번 달 순위표: 연습생 전원 점수(조금씩 흔들린다). me 는 내 점수
function evalBoard(S, me){ const b = PEERS.map(p => ({name:p.name, sc:peerScore(p, S.m) + rand(-6, 6)})); b.push({name:S.name, sc:me, me:true}); b.sort((x, y) => y.sc - x.sc); return b; }
const boardLine = b => b.map((x, i) => ({r:i + 1, name:x.name, me:!!x.me, sc:Math.round(x.sc)}));
// 미니게임 결과(0~1). 화면에서 리듬 게임을 하면 S._perf 가 채워지고, 없으면(시뮬레이션) 보통 실력으로 친다
const takePerf = S => { const v = S._perf; S._perf = null; return v == null ? 0.3 + R() * 0.45 : v; };
const perfWord = v => v >= 0.85 ? '완벽한 무대' : v >= 0.6 ? '깔끔한 무대' : v >= 0.35 ? '몇 번 박자를 놓쳤다' : '실수가 많았다';
function evalBase(S){ return S.st.know * 0.32 + S.st.skill * 0.32 + S.st.sense * 0.18 + S.st.charm * 0.18 - (S.hp < 30 ? 6 : 0) - (S.stress > 75 ? 6 : 0); }
function evalEvent(S){
  const song = EVAL_SONGS[S.m % EVAL_SONGS.length], mo = monthOf(S);
  const finish = (S, bonus, extra, hard) => { const I = IDOL(S), ch = []; const perf = takePerf(S); const score = evalBase(S) + bonus + (perf - 0.5) * (hard ? 18 : 12) + rand(-4, 4);
    const board = evalBoard(S, score), rank = board.findIndex(x => x.me) + 1; I.lastRank = rank; I.evals.push({m:S.m, rank, score:Math.round(score)}); I.board = boardLine(board);
    extra = `${perfWord(perf)}.` + (extra ? ' ' + extra : '');
    gauge(S, 'work', rank <= 3 ? 3 : rank <= 6 ? 1.5 : 0.5, ch); bump(S, 'stress', rank >= 9 ? 8 : 2, ch); if(rank <= 3) gauge(S, 'self', 1.5, ch);
    if(rank >= 10){ I.warn++; } else I.warn = 0;
    const comment = rank === 1 ? '오 실장이 처음으로 박수를 쳤다. “이번 달 1위, 서윤.” 하린의 표정이 굳었다.' : rank <= 3 ? `상위권 ${rank}위. “좋아. 이 감이면 데뷔조 얘기가 나올 거야.”` : rank <= 6 ? `중간, ${rank}위. “나쁘진 않은데, 기억에 남진 않아.”` : rank <= 9 ? `${rank}위. 오 실장이 펜으로 이름 옆에 작은 점을 찍었다.` : `${rank}위, 하위권. “다음 달도 이러면 면담이야.”`;
    return {board:I.board, text:(extra ? extra + ' ' : '') + comment + (I.warn >= 3 ? ' 하위권이 세 번째다. 방출 경고를 받았다.' : ''), chips:ch, mood:rank <= 3 ? 'happy' : rank >= 9 ? 'sad' : undefined}; };
  const ch3 = S.clarity >= 20 && S.m >= 3 ? [{label:'아직 나오지 않은 히트곡을 먼저 부른다', sub:'미래 지식 · 점수 크게 + · 선명도 -8', run(S){ S.borrowed++; bump(S, 'clarity', -8); S._perf = 0.75; return finish(S, 10, '심사위원들이 처음 듣는 멜로디에 고개를 들었다. 2년 뒤에나 나올 노래였다.'); }}] : [];
  return {id:`eval_${S.m}`, once:true, speaker:'오 실장', cut:'teamlead', title:`${mo}월 월말평가 · ${song}`, place:'stage', img:'art/bg_eval.webp',
    text:S => `연습실 거울 앞, 심사위원석에 오 실장과 트레이너들이 앉았다. 연습생 열두 명 중 데뷔조는 다섯 자리. 이번 달 과제는 「${song}」. 지난달 순위: ${lastRank(S) ? lastRank(S) + '위' : '첫 평가'}. 어떻게 할까?`,
    choices:[
      {label:'연습한 그대로, 실수 없이', sub:'리듬 게임 · 느린 박자 · 기본 점수', game:{speed:1, notes:4}, run(S){ return finish(S, 2); }},
      {label:'고난도 동작으로 승부를 건다', sub:'리듬 게임 · 빠른 박자 · 잘하면 대박, 놓치면 크게 깎인다', game:{speed:1.5, notes:5}, run(S){ const b = (S.st.dare + S.st.skill) / 2 > 45 ? rand(2, 9) : rand(-6, 3); return finish(S, b, b > 0 ? '마지막 턴이 깔끔하게 떨어졌다.' : '착지에서 발이 흔들렸다.', true); }},
      {label:'내 목소리를 살린 편곡으로', sub:'리듬 게임 · 보통 박자 · 표현력·멘탈이 높을수록 +', game:{speed:1.2, notes:4}, run(S){ return finish(S, (S.st.sense + S.st.ins) / 12 - 4, '익숙한 노래가 낯설게 들렸다. 심사위원 하나가 펜을 내려놓았다.'); }},
      ...ch3,
    ]};
}
// ── 방출·데뷔조·서바이벌·데뷔 ───────────────────────────────────
const DEBUT_PICK_M = 18, DEBUT_M = 22, SURVIVAL_M = [27, 28, 30];
const avgRecentRank = (S, n = 6) => { const e = IDOL(S).evals.slice(-n); return e.length ? e.reduce((a, x) => a + x.rank, 0) / e.length : 12; };
function cutEvent(S){
  return {id:`cut_${S.m}`, once:true, speaker:'오 실장', cut:'teamlead', title:'방출 통보', place:'room', img:'art/bg_eval.webp',
    text:S => '네 번 연속 하위권. 오 실장이 서류를 덮었다. “계약 해지야. 미안하다.” 숙소 짐을 싸는 손이 떨린다. 마흔의 나도 여기서 멈췄었다.',
    choices:[
      {label:'다른 기획사 오디션을 다시 본다', sub:'무소속 · 오디션 재도전 활동이 열린다', run(S){ const I = IDOL(S), ch = []; I.stage = 'out'; fx(S, {self:-3, stress:10, dare:2}, ch); return {text:'캐리어 하나를 끌고 숙소를 나왔다. 휴대폰 메모장에 기획사 이름 열두 개를 적었다.', chips:ch, mood:'sad'}; }},
      {label:'엄마 집으로 돌아가 쉰다', sub:'무소속 · 마음 회복', run(S){ const I = IDOL(S), ch = []; I.stage = 'out'; S.mom = clamp((S.mom || 30) + 10, 0, 100); fx(S, {self:3, stress:-15, bond:2}, ch); return {text:'엄마는 아무것도 묻지 않고 밥을 차렸다. “그래도 해 봤잖아.” 그 말이 오래 남았다.', chips:ch, mood:'sad'}; }},
    ]};
}
// 데뷔조: 최근 6번 평가 평균 점수로 연습생 열두 명 중 5위 안
function debutStanding(S){ const e = IDOL(S).evals.slice(-6); if(!e.length) return {pos:12, rival:PEERS[4]}; const my = e.reduce((a, x) => a + x.score, 0) / e.length;
  const avg = p => e.reduce((a, x) => a + peerScore(p, x.m), 0) / e.length; const ps = PEERS.map(p => ({p, v:avg(p)})).sort((a, b) => b.v - a.v);
  const pos = 1 + ps.filter(x => x.v > my).length; const fifth = ps.filter(x => !['서하린', '지수', '소연', '하은'].includes(x.p.name))[0]; return {pos, rival:fifth.p, gap:Math.round(my - fifth.v)}; }
function debutPickEvent(S){
  const st = debutStanding(S), ok = st.pos <= 5;
  return {id:'debut_pick', once:true, speaker:'오 실장', cut:'teamlead', title:'데뷔조 발표', place:'stage', img:'art/bg_eval.webp',
    text:S => `연습생 전원이 연습실에 모였다. 오 실장이 종이 한 장을 펼쳤다. “${GROUP_NAME} 데뷔 멤버를 발표한다. 서하린, 지수, 소연, 하은…” 최근 반년 평균 점수 ${st.pos}위(다섯 자리). ${ok ? `마지막 자리를 두고 ${josa(st.rival.name, '과', '와')} 나만 남았다. 마지막 이름이 불렸다. “…${S.name}.”` : `마지막 이름이 불렸다. “…${st.rival.name}.” ${josa(st.rival.name, '이', '가')} 울면서 나를 끌어안았다. ${st.gap > -4 ? '정말 한 끗 차이였다.' : '차이는 생각보다 컸다.'}`}`,
    choices: ok ? [
      {label:'눈물을 참고 고개를 숙인다', sub:'데뷔조 확정 · 마음 +3', run(S){ const ch = []; IDOL(S).debutTeam = true; fx(S, {self:3, work:2, stress:-5}, ch); S.album.push(`${GROUP_NAME} 데뷔조 합류`); return {text:'하린이 처음으로 내 쪽을 돌아봤다. “이제 같은 팀이네요. 발목 잡지 마요.”', chips:ch, mood:'happy'}; }},
      {label:'센터 자리를 원한다고 말한다', sub:'데뷔조 확정 · 하린 관계 -2 · 도전', run(S){ const ch = []; IDOL(S).debutTeam = true; fx(S, {dare:2, work:2}, ch); rivalMood(S, -2, ch); SF(S).wantCenter = true; return {text:'연습실이 조용해졌다. 오 실장이 웃었다. “센터는 평가로 정한다. 하린이랑 붙어 봐.”', chips:ch}; }},
    ] : [
      {label:'서바이벌 오디션에 도전하기로 한다', sub:'석 달 뒤 「스타 메이커」 출연', run(S){ const ch = []; IDOL(S).survival = {votes:0}; fx(S, {dare:2, stress:6}, ch); return {text:'“방송국에서 서바이벌 프로그램 출연자를 찾는대.” 지석 매니저가 조용히 전단을 건넸다.', chips:ch, mood:'sad'}; }},
      {label:'연습생으로 1년 더 버틴다', sub:'다음 기회를 기다린다 · 마음 -2', run(S){ const ch = []; IDOL(S).survival = {votes:0}; fx(S, {self:-2, work:1}, ch); return {text:'숙소 침대 위에서 천장을 오래 봤다. 그래도 아침 6시에 연습실 불을 켰다.', chips:ch, mood:'sad'}; }},
    ]};
}
function debutEvent(S, group, via){
  return {id:'debut_' + via, once:true, speaker:'', title:`데뷔 쇼케이스 · ${group}`, place:'stage', img:'art/bg_stage.webp',
    text:S => `${yearOf(S)}년 ${monthOf(S)}월. 쇼케이스 무대 뒤, 인이어를 끼는 손이 떨린다. 마흔의 나는 이 무대에 서 본 적이 없다. 막이 오르기 10초 전.`,
    choices:[
      {label:'카메라를 똑바로 보고 웃는다', sub:'리듬 게임 · 데뷔 무대 · 비주얼 + · 잘할수록 첫 팬 +', game:{speed:1.25, notes:5}, run(S){ return debutDone(S, group, {charm:2}); }},
      {label:'첫 소절에 모든 걸 건다', sub:'리듬 게임 · 데뷔 무대 · 보컬 + · 잘할수록 첫 팬 +', game:{speed:1.25, notes:5}, run(S){ return debutDone(S, group, {know:2}); }},
    ]};
}
function debutDone(S, group, eff){ const I = IDOL(S), ch = []; I.stage = 'idol'; I.debutAt = S.m; I.group = group; I.contract = S.m + 84; S.track = 'actor'; fx(S, Object.assign({work:4, self:3, stress:-5}, eff), ch); addFans(S, 1.5 + (S.st.charm + S.st.know) / 50 + takePerf(S) * 3, ch); S.album.push(`${group} 데뷔`); return {text:'막이 올랐다. 조명이 너무 밝아서 객석이 보이지 않았다. 대신 응원 소리가 들렸다. 3분 30초가 3초처럼 지나갔다.', chips:ch, mood:'happy'}; }
function survivalEvent(S, ep){
  const titles = ['1화 · 등급 평가', '3화 · 팀 배틀', '최종화 · 생방송 데뷔 평가'];
  const finish = (S, mul, text) => { const I = IDOL(S), ch = []; const perf = takePerf(S); const v = (S.st.charm * 0.35 + S.st.dare * 0.25 + S.st.know * 0.2 + S.st.skill * 0.2 + (perf - 0.5) * 30 + rand(-8, 8)) * mul; I.survival.votes = (I.survival.votes || 0) + v; addFans(S, v / 60, ch); fx(S, {stress:5}, ch);
    if(ep < 2) return {text:`${text} 이번 화 순위: ${Math.max(1, Math.round(30 - v / 3))}위.`, chips:ch};
    const ok = I.survival.votes >= 150; if(ok){ const r = debutDone(S, PROJECT_GROUP, {}); r.text = `${text} 마지막 호명. “데뷔 멤버 7위… 서윤!” ` + r.text; r.chips = ch.concat(r.chips); return r; }
    I.stage = 'out'; return {text:`${text} 7위 안에 내 이름은 없었다. 무대 위에서 끝까지 웃었다.`, chips:ch, mood:'sad'}; };
  return {id:'survival_' + ep, once:true, speaker:'', title:`스타 메이커 ${titles[ep]}`, place:'stage', img:'art/bg_stage.webp',
    text:S => ep === 0 ? '방송국 세트장, 백 명의 연습생이 피라미드 의자에 앉았다. 내 이름표 옆에는 소속사 대신 ‘개인 연습생’이라고 적혀 있다.' : ep === 1 ? '팀 배틀. 같은 팀 연습생이 파트 분배로 울고 있다. 센터를 맡으면 표가 몰리지만, 실수하면 다 내 탓이다.' : '생방송 최종화. 실시간 문자 투표가 화면 아래로 흐른다. 마지막 무대다.',
    choices:[
      {label:'센터를 맡는다', sub:'리듬 게임 · 빠른 박자 · 표 많이, 실수 위험', game:{speed:1.5, notes:5}, run(S){ return finish(S, R() < 0.25 + S.st.dare / 200 ? 1.3 : 0.8, '센터에 섰다.'); }},
      {label:'팀원을 살리는 파트를 맡는다', sub:'리듬 게임 · 보통 박자 · 관계 +', game:{speed:1.15, notes:4}, run(S){ fx(S, {bond:2}); return finish(S, 1.0, '팀원들이 나를 끌어안았다.'); }},
      {label:'카메라에 진심을 말한다', sub:'팬소통이 높을수록 +', run(S){ return finish(S, 0.8 + S.st.neg / 150, '“한 번만 더 기회를 주세요.” 진심이었다.'); }},
    ]};
}
// ── 컴백·음방 1위·연말 시상식·재계약 ───────────────────────────
function comebackEvent(S){
  const n = IDOL(S).comebacks + 1;
  const finish = (S, fit, concept) => { const I = IDOL(S), ch = []; I.comebacks = n; I.lastComeback = S.m;
    const power = 24 * Math.log10(1 + fansOf(S)) + (S.st.know + S.st.skill + S.st.sense + S.st.charm) / 4 * fit * 0.55 + rand(-14, 14) + (S.work - 50) / 4 - Math.min(20, IDOL(S).comebacks * 1.5); // 해마다 경쟁 그룹도 강해진다
    const chart = clamp(Math.round(100 - power), 1, 100); addFans(S, Math.max(0.3, (100 - chart) / 18), ch); gauge(S, 'work', 2, ch);
    let txt = `${concept} 콘셉트로 ${n}번째 컴백. 음원 차트 최고 ${chart}위.`;
    if(chart <= 3 || (chart <= 12 && R() < 0.3)){ I.wins++; addFans(S, 1 + Math.min(fansOf(S), 100) * 0.03, ch); fx(S, {self:4, stress:-6}, ch); txt += ` 그리고 음악방송 1위! 앵콜 무대에서 노래를 다 못 불렀다. (통산 ${I.wins}번째 1위)`; S.album.push(`${I.group} ${n}번째 컴백 · 1위`); }
    else txt += chart <= 40 ? ' 1위 후보에 올랐지만 아쉽게 2위.' : ' 성적은 아쉬웠다. 그래도 팬들은 더 단단해졌다.';
    return {text:txt, chips:ch, mood:chart <= 25 ? 'happy' : undefined}; };
  return {id:`comeback_${n}`, once:true, speaker:'', title:`${IDOL(S).group || GROUP_NAME} ${n}번째 컴백`, place:'stage', img:'art/bg_stage.webp',
    text:S => `컴백까지 한 달. 회의실 화이트보드에 콘셉트 시안 세 개가 붙어 있다. 마흔의 나는 그해 어떤 노래가 유행했는지 기억한다.`,
    choices:[
      {label:'청량 콘셉트', sub:'비주얼·표현력 위주', run(S){ return finish(S, 0.9 + (S.st.charm + S.st.sense) / 300, '청량'); }},
      {label:'걸크러시 콘셉트', sub:'댄스·예능감 위주', run(S){ return finish(S, 0.9 + (S.st.skill + S.st.dare) / 300, '걸크러시'); }},
      {label:'서정 발라드 콘셉트', sub:'보컬·멘탈 위주', run(S){ return finish(S, 0.9 + (S.st.know + S.st.ins) / 300, '서정'); }},
      ...(IDOL(S).songs >= 2 ? [{label:'내가 쓴 곡을 타이틀로 밀어붙인다', sub:'자작곡 · 성공하면 크게', run(S){ IDOL(S).producer = IDOL(S).songs >= 4 || IDOL(S).producer; return finish(S, 0.8 + S.st.sense / 120 + IDOL(S).songs * 0.05, '자작곡'); }}] : []),
    ]};
}
function awardsEvent(S){
  const I = IDOL(S), y = yearOf(S), rookie = sinceDebut(S) < 12;
  const prize = rookie ? (fansOf(S) >= 6 || R() < 0.3 ? '신인상' : null) : (fansOf(S) >= 110 && I.wins >= 4 && S.work >= 62 && R() < 0.5 ? '대상' : (fansOf(S) >= 60 || I.wins >= 3) && R() < 0.6 ? '본상' : null);
  return {id:`awards_${y}`, once:true, speaker:'', title:`${y} 골든 스테이지 어워즈`, place:'stage', img:'art/bg_awards.webp',
    text:S => `연말 시상식. 레드카펫 플래시가 터진다. ${prize ? `사회자가 봉투를 열었다. “${prize}… ${I.group}!”` : '이번 해 우리 이름은 불리지 않았다. 박수를 치는 손바닥이 뜨겁다.'}`,
    choices: prize ? [
      {label:'멤버들 이름을 하나씩 부르며 소감을 말한다', sub:`${prize} · 관계 +`, run(S){ const ch = []; I.awards.push(`${y} ${prize}`); fx(S, {bond:3, self:2}, ch); addFans(S, prize === '대상' ? 15 : prize === '본상' ? 4 : 1.5, ch); S.album.push(`${y} ${prize}`); return {text:'마이크 앞에서 엄마 이름을 말하려다 목이 메었다. 하린이 내 등을 툭 쳤다.', chips:ch, mood:'happy'}; }},
      {label:'팬들에게 감사 인사를 한다', sub:`${prize} · 팬 +`, run(S){ const ch = []; I.awards.push(`${y} ${prize}`); addFans(S, prize === '대상' ? 20 : prize === '본상' ? 6 : 2, ch); S.album.push(`${y} ${prize}`); return {text:'“이 상은 응원봉 하나하나의 것입니다.” 객석의 불빛이 파도처럼 흔들렸다.', chips:ch, mood:'happy'}; }},
    ] : [
      {label:'내년엔 반드시, 라고 다짐한다', sub:'실력 + · 스트레스 +', run(S){ const ch = []; fx(S, {work:2, stress:5}, ch); return {text:'돌아오는 차 안에서 다음 앨범 안무를 머릿속으로 돌렸다.', chips:ch}; }},
      {label:'오늘은 그냥 축하해 준다', sub:'마음 + · 관계 +', run(S){ const ch = []; fx(S, {self:2, bond:2, stress:-4}, ch); return {text:'수상한 선배 그룹에게 진심으로 박수를 쳤다. 이상하게 마음이 가벼웠다.', chips:ch}; }},
    ]};
}
function contractEvent(S){
  return {id:'contract', once:true, speaker:'오 실장', cut:'teamlead', title:'재계약 시즌', place:'cafe', img:'art/bg_office.webp',
    text:S => `${IDOL(S).group}의 7년 계약이 끝나 간다. 회사는 재계약 서류를, 다른 곳은 더 좋은 조건을 내밀었다. 멤버들의 선택도 제각각이다.`,
    choices:[
      {label:'팀과 함께 재계약한다', sub:'관계 + · 안정', run(S){ const ch = []; fx(S, {bond:4, self:1}, ch); return {text:'다섯 명이 같은 날 같은 펜으로 서명했다. 하린이 제일 마지막에 웃었다.', chips:ch, mood:'happy'}; }},
      {label:'솔로 아티스트로 독립한다', sub:'솔로 · 실력 + · 관계 -', run(S){ const ch = []; IDOL(S).solo = true; fx(S, {work:3, bond:-2, dare:2}, ch); addFans(S, 2, ch); return {text:'혼자 서는 무대는 넓고 조용했다. 그래도 내 노래만 부를 수 있다.', chips:ch}; }},
      {label:'배우 활동을 늘린다', sub:'연기 · 표현력 +', run(S){ const ch = []; IDOL(S).actor = true; fx(S, {sense:3, ins:1}, ch); return {text:'첫 대본 리딩. 노래 대신 대사로 울어야 했다.', chips:ch}; }},
    ]};
}
// 이번 달 아이돌 고정 이벤트(하나만)
function idolEvent(S){
  const I = IDOL(S);
  if(isTrainee(S)){
    if(I.warn >= 4 && !S.seen['cut_' + S.m]) return cutEvent(S);
    if(S.m === DEBUT_PICK_M && !S.seen.debut_pick) return debutPickEvent(S);
    if(S.m === DEBUT_M && I.debutTeam && !S.seen.debut_team) return debutEvent(S, GROUP_NAME, 'team');
    if(I.survival){ const ep = SURVIVAL_M.indexOf(S.m); if(ep >= 0 && !S.seen['survival_' + ep]) return survivalEvent(S, ep); if(S.m > SURVIVAL_M[2] && isTrainee(S)) I.stage = 'out'; }
    if(S.m >= 1 && !I.survival && !S.seen['eval_' + S.m]) return evalEvent(S);
    return null;
  }
  if(isIdol(S)){
    if(monthOf(S) === 12 && !S.seen['awards_' + yearOf(S)]) return awardsEvent(S);
    if(I.contract != null && S.m === Math.min(I.contract, 108) && !S.seen.contract) return contractEvent(S);
    const sd = sinceDebut(S); if(sd > 0 && sd % 6 === 0 && !S.seen['comeback_' + (I.comebacks + 1)]) return comebackEvent(S);
  }
  return null;
}
