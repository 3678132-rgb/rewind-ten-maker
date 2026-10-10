// 이벤트 데이터 (ENGINE 구간 안, DOM 금지)
// 스키마: {id, once, w, cd, cond(S), speaker, title, place, beats?:[문장], text(S), choices:[{label, sub, run(S)→{text, chips}}]}
const R_ = (S, o, text) => { const ch = []; fx(S, o, ch); return {text, chips:ch}; };
const GRANDMA = '시간 약방 할머니';

// ── 고정 스토리 ────────────────────────────────────────────────
const PROLOGUE = {id:'prologue', once:true, speaker:'', title:'마흔 살, 비 오는 날', place:'rain',
  beats:[
    '마흔 살. 이혼 서류에 도장을 찍은 지 이틀 만에, 회사에서 정리해고 통보가 왔다.',
    '십오 년을 다닌 회사였다. 사원증이 반납함에 떨어지는 소리가 이상하게 가벼웠다.',
    '비를 맞으며 걷다가 처음 보는 골목에 들어섰다. 간판 없는 낡은 가게에 불이 켜져 있었다. 「시간 약방」.',
    `“들어와요. 오래 기다렸어요.” 카운터의 ${GRANDMA}가 작은 병 하나를 내밀었다. 병 속에서는 호박색 모래가 느리게 가라앉고 있었다.`,
    '“스무 살로 되감아 줄게요. 대신 시간은 딱 십 년. 서른 살이 되던 날, 그동안 새 인생을 만들어 냈다면 시계는 온전히 당신 것이 됩니다. 어느 나이에서든 살 수 있어요.”',
    '“못 만들었다면요?” “오늘의 이 골목으로 돌아와야죠. 마흔 살의 그 인생으로.”',
    '나는 병을 땄다. 목이 타서였는지, 더 잃을 게 없어서였는지는 지금도 모르겠다.',
    '눈을 뜨자 천장의 얼룩이 낯익었다. 신입생 환영회 현수막, 삐걱대는 자취방 침대, 2006년 3월. 거울 속에는 스무 살의 내가 있었다.',
  ],
  text:S => `${S.name}, 스무 살. 몸은 가볍고 머릿속은 마흔의 기억으로 가득하다. 이번에는 다르게 살 수 있다. 가장 먼저 무엇을 할까?`,
  choices:[
    {label:'엄마에게 전화한다', sub:'관계 +3', run:S => R_(S, {bond:3, stress:-4}, '“웬일로 전화를 다 하고. 밥은 먹었니?” 수화기 너머 엄마의 목소리가 이렇게 젊었다. 나는 한참 아무 말도 못 했다.')},
    {label:'거울을 오래 본다', sub:'나 +3', run:S => R_(S, {self:3, ins:2}, '스무 살의 얼굴을 오래 들여다봤다. 이 얼굴에게 미안했고, 이 얼굴에게 약속했다. 이번엔 너를 먼저 챙기겠다고.')},
    {label:'일단 수업에 간다', sub:'학식 +2 · 일 +2', run:S => R_(S, {know:2, work:2}, '1교시 강의실. 교수님이 칠판에 쓰는 내용을 하나도 모르는 척 받아 적었다. 몇 문제는 이미 답을 알고 있었다. 이건 반칙일까, 기회일까.')},
  ]};

const CHECKS = [
  {m:35, id:'check1', title:'첫 번째 점검', hint:'약방 문이 꿈속에 열린다. 할머니의 손등에는 내 것과 똑같은 흉터가 있다.', line:'“십 년 중 삼 년이 지났어요. 모래는 거짓말을 안 해요.”'},
  {m:71, id:'check2', title:'두 번째 점검', hint:'할머니의 손가락에는 낯익은 반지가 끼워져 있다. 엄마의 것이다.', line:'“절반이 지났네요. 서두르지 말아요. 다만 멈추지도 말고.”'},
  {m:107, id:'check3', title:'마지막 해', hint:'할머니의 말투가 어느새 내 입버릇과 똑같다는 걸 깨달았다.', line:'“이제 일 년이에요. 이 모래가 다 떨어지면 선택은 끝나요.”'},
];
function checkEvent(S, c){
  const P = {work:S.work, bond:S.bond, self:S.self};
  const bar = k => `${PILLAR[k]} ${Math.round(P[k])}/50`;
  const weakest = Object.keys(P).sort((a, b) => P[a] - P[b])[0];
  return {id:c.id, once:true, speaker:GRANDMA, title:c.title, place:'shop',
    beats:[c.hint, c.line, `“지금의 당신은 이래요. ${bar('work')} · ${bar('bond')} · ${bar('self')}. 새 인생이 되려면 셋 다 50을 넘어야 해요.”`],
    text:S => `가장 부족한 것은 「${PILLAR[weakest]}」다. 할머니가 모래시계를 한 번 뒤집었다. 그래서 어떻게 할까?`,
    choices:[
      {label:'부족한 쪽에 집중하겠다', sub:'각오 · 해당 항목 +4', run:S => R_(S, {[weakest]:4}, '“좋은 마음가짐이에요.” 할머니가 희미하게 웃었다.')},
      {label:'할머니의 정체를 묻는다', sub:'나 +2', run:S => R_(S, {self:2, ins:1}, '“언젠가 알게 돼요. 그날이 오면 놀라지 말고.” 할머니는 대답 대신 차를 따라 주었다.')},
    ]};
}

const FINALE = {id:'finale', once:true, speaker:GRANDMA, title:'서른 살, 약방', place:'shop',
  beats:[
    '2016년 2월. 십 년의 마지막 날, 나는 다시 그 골목에 서 있었다.',
    '약방의 문은 처음처럼 열려 있었다. 카운터의 할머니는 모래시계를 쓰다듬고 있었다.',
    '“마지막 모래가 떨어졌어요.” 할머니가 천천히 안경을 벗었다. 눈가의 주름 사이로 내 눈이 보였다.',
    '“…나는 일흔 살의 당신이에요. 먼저 십 년을 살아 봤고, 한 가지를 놓쳤어요. 그래서 이 가게를 열었죠. 같은 후회를 가진 사람에게 기회를 건네려고.”',
    '“이제 보여 줘요. 당신이 만든 서른 살을.”',
  ],
  text:S => '모래시계가 마지막으로 뒤집혔다. 결과가 정해질 시간이다.',
  choices:[{label:'결과를 맞이한다', sub:'엔딩', run:S => ({text:'', chips:[]})}]};

// ── 시대 이벤트 (실제 연·월 기준) ───────────────────────────────
const ERA = [
  {m:monthIndex(2008, 9), id:'era_crisis', title:'2008년 9월, 리먼 브라더스', place:'cafe',
   text:S => '뉴스 속보가 나왔다. 미국의 투자은행이 무너졌다. 앞으로 몇 달 동안 세상이 어떻게 흔들릴지 나는 알고 있다.',
   choices:[
     {label:'기억을 이용해 베팅한다', sub:'자금 대폭 + · 선명도 -10', run:S => { S.borrowed++; return R_(S, {cash:380, clarity:-10, stress:5}, '손이 떨렸지만 망설임은 없었다. 시장이 곤두박질칠 때 통장은 불어났다. 이상하게 하나도 기쁘지 않았다.'); }},
     {label:'현금을 지키며 버틴다', sub:'안정 · 통찰 +2', run:S => R_(S, {ins:2, stress:-3, cash:30}, '나는 불안한 친구들에게 생활비를 아끼라고만 말했다. 큰돈은 못 벌었지만 흔들리지도 않았다.')},
     {label:'친구들에게 미리 알려 준다', sub:'관계 +4 · 선명도 -4', run:S => R_(S, {bond:4, clarity:-4, stress:3}, '“무슨 소리야?” 의아해하던 친구들은 몇 주 뒤 전화를 걸어 왔다. “너 어떻게 알았어?” 나는 웃어넘겼다.')},
   ]},
  {m:monthIndex(2009, 11), id:'era_iphone', title:'2009년 11월, 아이폰', place:'cafe',
   text:S => '아이폰이 한국에 들어왔다. 이 작은 기계가 앞으로의 십 년을 통째로 바꿀 것이다. 나는 그 변화의 중심에서 어디에 서 있을까.',
   choices:[
     {label:'앱 개발 공부에 뛰어든다', sub:'실무·도전 + · 일 +3', run:S => R_(S, {skill:5, dare:3, work:3, stress:6}, '밤새 코드를 쳤다. 마흔의 나는 한 번도 직접 만들어 보지 못한 사람이었다. 이번엔 만드는 쪽이다.')},
     {label:'가볍게 구경만 한다', sub:'감각 +2', run:S => R_(S, {sense:2, stress:-2}, '신기해서 만져 보았다. 그뿐이었다. 기회는 어떤 날은 그냥 지나간다.')},
   ]},
  {m:monthIndex(2010, 3), id:'era_kakao', title:'2010년 3월, 카카오톡', place:'cafe',
   text:S => '친구들이 하나둘 새 메신저를 깔고 있다. 곧 문자 요금이라는 말이 사라질 것이다. 사람들은 이제 더 쉽게 연결되고, 더 쉽게 외로워진다.',
   choices:[
     {label:'오래 연락 못 한 사람들에게 먼저 말을 건다', sub:'관계 +4', run:S => R_(S, {bond:4, charm:1}, '“야, 나 기억나?” 몇 년 만의 메시지에 답이 쏟아졌다. 마흔의 나는 이 한 줄을 못 보냈다.')},
     {label:'무시한다', sub:'변화 없음', run:S => R_(S, {}, '아직은 문자로 충분하다고 생각했다.')},
   ]},
  {m:monthIndex(2012, 7), id:'era_psy', title:'2012년 여름', place:'cafe',
   text:S => '어디를 가도 말춤 노래가 나온다. 나는 이 노래가 세계로 퍼지는 걸 알고 있었다. 사람들이 웃는 걸 보니 마음이 풀렸다.',
   choices:[
     {label:'친구들과 신나게 논다', sub:'관계 +3 · 스트레스 -10', run:S => R_(S, {bond:3, stress:-10, cash:-8}, '오랜만에 아무 계산 없이 웃었다. 이런 날이 인생을 지탱한다.')},
     {label:'일을 한다', sub:'일 +2', run:S => R_(S, {work:2, stress:5}, '모두가 놀 때 책상 앞에 앉았다. 뭔가를 얻었고 뭔가를 놓쳤다.')},
   ]},
];

// ── 졸업과 진로 (2010년 2월) ───────────────────────────────────
const GRAD_M = monthIndex(2010, 2);
const GRADUATION = {id:'graduation', once:true, speaker:'', title:'졸업, 그리고 진로', place:'campus',
  text:S => `${S.name}, 졸업이다. 마흔의 나는 이때 아무 생각 없이 큰 회사에 들어갔다. 이번에는 어떤 길로 갈까?`,
  choices:[
    {label:'대기업·중견기업 공채', sub:'안정적 · 학식/실무/협상 필요', run(S){ const ch = []; S.track = 'corp'; const p = clamp(0.25 + (S.st.know + S.st.skill + S.st.neg) / 280, 0.2, 0.9); if(R() < p){ S.hired = true; gauge(S, 'work', 8, ch); return {text:'최종 합격. 사원증을 목에 거는 순간 마흔의 기억이 스쳤다. 이번엔 다르게 다닐 것이다.', chips:ch}; } fx(S, {stress:8}, ch); return {text:'서류부터 줄줄이 떨어졌다. 구직 활동을 이어 가야 한다.', chips:ch}; }},
    {label:'스타트업에 합류', sub:'불안하지만 성장 · 도전 필요', run(S){ const ch = []; S.track = 'startup'; const p = clamp(0.35 + (S.st.dare + S.st.skill) / 220, 0.25, 0.9); if(R() < p){ S.hired = true; gauge(S, 'work', 7, ch); fx(S, {dare:2}, ch); return {text:'“월급은 적지만 지분은 줄게.” 작은 사무실에서 나는 처음으로 설레는 출근을 했다.', chips:ch}; } fx(S, {stress:6}, ch); return {text:'면접에서 현실적인 질문에 막혔다. 다시 도전해야 한다.', chips:ch}; }},
    {label:'프리랜서로 독립', sub:'자유롭지만 불안 · 감각 필요', run(S){ const ch = []; S.track = 'freelance'; const p = clamp(0.3 + (S.st.sense + S.st.skill) / 220, 0.25, 0.9); if(R() < p){ S.hired = true; gauge(S, 'work', 6, ch); return {text:'첫 거래처가 생겼다. 계약서에 내 이름 석 자가 적혔다.', chips:ch}; } fx(S, {stress:8}, ch); return {text:'일감이 들어오지 않는다. 포트폴리오와 구직을 병행해야 한다.', chips:ch}; }},
    {label:'대학원 진학', sub:'학식 +, 수입 없음', run(S){ const ch = []; S.track = 'grad'; S.hired = true; fx(S, {know:4, work:4, ins:2}, ch); return {text:'장학금 한도만큼만 생활하며 연구실에 들어갔다. 천천히, 깊게 가는 길이다.', chips:ch}; }},
  ]};

// ── 랜덤 이벤트 ───────────────────────────────────────────────
const EVENTS = [
  {id:'mom_call', w:5, cd:5, speaker:'엄마', title:'엄마의 전화', place:'room', text:S => '“밥은 먹고 다니니? 이번 주말에 내려올 수 있어?” 엄마의 전화다. 마흔의 나는 이 전화를 자주 흘려 넘겼다.',
   choices:[
     {label:'주말에 내려간다', sub:'관계 +4 · 자금 -10', run:S => { S.mom = clamp((S.mom || 40) + 8, 0, 100); return R_(S, {bond:4, cash:-10, stress:-6}, '엄마는 나를 보자마자 부엌으로 달려갔다. 상 위에 반찬이 가득 올라왔다. 그 위로 오래 눈물을 삼켰다.'); }},
     {label:'바쁘다고 끊는다', sub:'스트레스 -2 · 관계 -2', run:S => R_(S, {bond:-2, stress:-2}, '“그래, 바쁘면 어쩔 수 없지.” 엄마의 목소리가 작아졌다. 마흔의 나와 똑같은 선택이었다.')},
   ]},
  {id:'old_memory', w:4, cd:8, cond:S => S.stress >= 50, title:'그날의 꿈', place:'room', text:S => '꿈속에서 사원증이 반납함에 떨어졌다. 도장이 찍힌 이혼 서류, 비 오는 골목. 깨어나니 식은땀이 흘렀다.',
   choices:[
     {label:'일기를 쓴다', sub:'나 +3 · 스트레스 -8', run:S => R_(S, {self:3, stress:-8, ins:1}, '마흔의 나에게 편지를 썼다. “잘 버텼어. 이제 내가 대신 살아 볼게.” 글자가 번졌다.')},
     {label:'술로 달랜다', sub:'스트레스 -12 · 체력 -10', run:S => R_(S, {stress:-12, hp:-10, cash:-10}, '그날 밤은 짧았고 다음 날은 길었다.')},
   ]},
  {id:'lotto', w:3, cd:24, cond:S => S.clarity >= 35 && S.m >= 6, title:'그 번호', place:'cafe', text:S => '머릿속에 선명한 숫자가 떠올랐다. 십 년 뒤 어느 주의 당첨 번호는 아니지만, 올해 인기 상품과 이슈 정도는 안다. 지금 손을 대면 확실한 수익이다.',
   choices:[
     {label:'이용한다', sub:'자금 + · 선명도 -6', run:S => { S.borrowed++; return R_(S, {cash:Math.round(rand(100, 260)), clarity:-6, stress:2}, '쉽게 번 돈은 쉽게 느껴지지 않았다. 지갑에는 두둑하고 마음은 허전했다.'); }},
     {label:'모른 척한다', sub:'통찰 +2 · 나 +2', run:S => R_(S, {ins:2, self:2}, '이 인생의 몫은 내 손으로 만들겠다고 다짐했다.')},
   ]},
  {id:'group_project', w:4, cd:6, cond:S => S.m < 48 && S.m >= 3, title:'조별 과제', place:'campus', text:S => '조원 한 명이 연락이 안 된다. 다른 조원은 대충 하자고 한다. 발표는 사흘 뒤다.',
   choices:[
     {label:'내가 이끈다', sub:'협상·일 + · 스트레스 +', run:S => R_(S, {neg:2.5, work:1.8, stress:7}, '역할을 나누고 일정을 짰다. 마흔 해의 회사 생활이 처음으로 쓸모 있었다. 발표는 성공적이었다.')},
     {label:'혼자 다 해 버린다', sub:'학식 + · 체력 -', run:S => R_(S, {know:3, hp:-10, stress:6}, '밤새 PPT를 만들었다. 학점은 좋았지만 몸이 비명을 질렀다.')},
   ]},
  {id:'job_fair', w:3, cd:12, cond:S => S.m >= 24 && S.m < 48, title:'취업 박람회', place:'campus', text:S => '캠퍼스에 기업 부스가 줄지어 섰다. 어느 곳에서 마흔의 내가 일했는지 알아본다. 이번엔 다른 길도 보인다.',
   choices:[
     {label:'적극적으로 상담한다', sub:'일 + · 협상 +', run:S => R_(S, {work:2.5, neg:1.5, stress:4}, '명함을 열 장 받았다. 그중 한 장이 이후 큰 도움이 되었다.')},
     {label:'구경만 하고 나온다', sub:'스트레스 -', run:S => R_(S, {stress:-3}, '아직은 마음이 움직이지 않았다.')},
   ]},
  {id:'friend_trouble', w:4, cd:8, cond:S => S.m >= 6, speaker:'소연', title:'소연의 고민', place:'cafe', text:S => '단짝 소연이 울먹이며 전화했다. 남자친구가 바람을 피운 것 같다고. 마흔의 나는 이런 때 “네가 알아서 해”라고 말했었다.',
   choices:[
     {label:'밤새 곁에 있어 준다', sub:'관계 +4 · 체력 -5', run:S => R_(S, {bond:4, ins:1.5, hp:-5, stress:2}, '소연은 새벽에야 잠들었다. “너 언제 이렇게 어른이 됐어?” 나는 웃었다.')},
     {label:'스스로 결정하라고 한다', sub:'관계 -2', run:S => R_(S, {bond:-2, ins:0.5}, '“네 인생이니까.” 말은 맞았지만, 소연의 표정은 한동안 잊히지 않았다.')},
   ]},
  {id:'sick', w:3, cd:10, cond:S => S.hp < 40, title:'몸살', place:'room', text:S => '아침에 일어나니 열이 펄펄 끓는다. 몸은 스무 살이어도 쌓인 피로는 어쩔 수 없다.',
   choices:[
     {label:'병원에 가서 푹 쉰다', sub:'체력 + · 자금 -', run:S => R_(S, {hp:15, cash:-15, stress:-4}, '링거를 맞고 이틀을 쉬었다. 몸이 가장 솔직한 신호등이다.')},
     {label:'참고 버틴다', sub:'일 + · 체력 --', run:S => R_(S, {work:1, hp:-12, stress:5}, '결국 일주일을 앓았다. 참는 건 마흔의 나쁜 버릇이다.')},
   ]},
  {id:'cat', w:3, cd:36, cond:S => S.m >= 4, title:'길고양이', place:'room', text:S => '자취방 앞에서 마른 길고양이가 야옹거린다. 마흔의 나는 늘 “키울 형편이 안 돼서”라고 지나쳤다.',
   choices:[
     {label:'밥을 챙겨 준다', sub:'나 +3 · 스트레스 -6', run:S => R_(S, {self:3, stress:-6, cash:-6}, '고양이는 매일 같은 시간에 창문 앞에 앉았다. 하루에 기다릴 존재가 하나 생겼다.')},
     {label:'지나친다', sub:'변화 없음', run:S => R_(S, {}, '발걸음을 서둘렀다. 어쩐지 오래 마음에 남았다.')},
   ]},
  {id:'senior_ask', w:3, cd:10, cond:S => S.m >= 12, title:'후배의 질문', place:'campus', text:S => '낯선 후배가 찾아와 진로 상담을 청했다. 마흔 해의 시행착오를 한 줄로 요약해 줄 수 있을까.',
   choices:[
     {label:'진심으로 조언한다', sub:'관계·통찰 +', run:S => R_(S, {bond:2.5, ins:1.5}, '“한 번에 다 하려고 하지 마. 버티는 사람이 이겨.” 후배의 눈이 반짝였다.')},
     {label:'바쁘다고 거절한다', sub:'일 +1', run:S => R_(S, {work:1}, '후배는 아쉬운 표정으로 돌아갔다.')},
   ]},
  {id:'new_year', w:6, cd:12, cond:S => monthOf(S) === 1, title:'새해 다짐', place:'room', text:S => '창밖에서 제야의 종소리가 들린다. 이번에는 어떤 한 해를 보내고 싶은가.',
   choices:[
     {label:'일에 집중하는 해', sub:'일 +3', run:S => R_(S, {work:3}, '노트 첫 장에 목표를 적었다.')},
     {label:'사람에 집중하는 해', sub:'관계 +3', run:S => R_(S, {bond:3}, '연락처를 열고 안부를 묻고 싶은 이름들을 표시했다.')},
     {label:'나에 집중하는 해', sub:'나 +3', run:S => R_(S, {self:3}, '“올해는 나를 먼저.” 낯설지만 좋은 문장이었다.')},
   ]},
  {id:'cafe_regular', w:3, cd:12, cond:S => (S.uses.cafe || 0) >= 4, title:'단골 손님', place:'cafe', text:S => '단골 할아버지가 말했다. “자네 일하는 거 보면 기분이 좋아. 우리 손주 가게에서 일해 볼 생각 없나?”',
   choices:[
     {label:'소개를 받는다', sub:'자금·일 +', run:S => R_(S, {cash:60, work:2, neg:1}, '작은 인연이 이력의 한 줄이 되었다.')},
     {label:'사양한다', sub:'나 +1', run:S => R_(S, {self:1}, '“고맙지만 저는 제 길을 가 보려고요.”')},
   ]},
  {id:'prefuture', w:3, cd:15, cond:S => S.borrowed >= 2, speaker:GRANDMA, title:'꿈속의 약방', place:'shop', text:S => '꿈에 약방이 나왔다. 모래시계 한쪽이 유난히 어둡다. 할머니가 말했다. “쉽게 얻은 건 쉽게 사라져요. 그걸 손에 쥐고 서른이 되면, 그건 당신의 인생이 아니에요.”',
   choices:[
     {label:'미래 지식 사용을 줄인다', sub:'나 +3 · 통찰 +2', run:S => R_(S, {self:3, ins:2}, '잠에서 깨어 한참 천장을 보았다. 이제부터는 내 손으로 한다.')},
     {label:'모른 척한다', sub:'스트레스 +3', run:S => R_(S, {stress:3}, '그냥 꿈이라고 생각하기로 했다. 어쩐지 손이 시렸다.')},
   ]},
  {id:'dare_chance', w:3, cd:12, cond:S => S.st.dare >= 25 && S.m >= 18, title:'뜻밖의 제안', place:'cafe', text:S => '“자네, 이 프로젝트 같이 해 볼 생각 있어?” 처음 보는 사람이 던진 제안이다. 위험하지만 기회일 수도 있다.',
   choices:[
     {label:'도전한다', sub:'일·도전 + · 스트레스 +', run:S => R_(S, {work:3, dare:2.5, stress:8, cash:-10}, '결과는 절반의 성공이었다. 하지만 배운 게 많았다.')},
     {label:'안전하게 거절한다', sub:'스트레스 -2', run:S => R_(S, {stress:-2}, '아직 때가 아니라고 생각했다.')},
   ]},
  {id:'mom_sick', w:2, cd:36, cond:S => S.m >= 30 && (S.mom || 0) < 70, speaker:'엄마', title:'엄마의 건강검진', place:'room', text:S => '엄마가 검진 결과를 숨기고 있었다. 큰 이상은 아니라지만 목소리가 달랐다. 마흔의 나는 이런 걸 나중에야 알았다.',
   choices:[
     {label:'당장 내려가 곁을 지킨다', sub:'관계 +5 · 일 -2', run:S => { S.mom = clamp((S.mom || 40) + 12, 0, 100); return R_(S, {bond:5, work:-2, stress:6, hp:-4}, '엄마 곁에서 이틀을 보냈다. “바쁜데 뭘 와.” 말과 달리 엄마의 손이 내 손을 꼭 쥐었다.'); }},
     {label:'전화로 안부만 전한다', sub:'일 +1', run:S => R_(S, {work:1, bond:-2}, '마음 한쪽이 계속 무거웠다.')},
   ]},
  {id:'burnout_colleague', w:3, cd:12, cond:S => S.hired, title:'지친 동료', place:'cafe', text:S => '옆 팀 동료가 점심시간에 울고 있었다. 마흔의 나였을지도 모른다. 나는 어떻게 할까.',
   choices:[
     {label:'말없이 커피를 건넨다', sub:'관계 +3', run:S => R_(S, {bond:3, ins:1.2}, '“…고마워요.” 그는 한참 뒤에 웃었다. 나도 그날 누군가에게 이런 커피를 받고 싶었다.')},
     {label:'내 일에 집중한다', sub:'일 +2', run:S => R_(S, {work:2}, '모른 척한 것이 마음에 걸렸지만, 보고서는 시간에 끝났다.')},
   ]},
  {id:'headhunt', w:3, cd:24, cond:S => S.hired && S.m >= 60 && S.st.skill >= 40, title:'이직 제안', place:'cafe', text:S => '헤드헌터에게서 연락이 왔다. 지금보다 연봉이 높은 곳이다. 하지만 새 조직에서 또 처음부터 시작해야 한다.',
   choices:[
     {label:'옮긴다', sub:'자금·일 + · 스트레스 +', run:S => R_(S, {cash:120, work:3, stress:8, neg:1.5}, '새 직장에서 나는 첫날부터 일머리가 있다는 소리를 들었다. 마흔의 경력이 이렇게 쓰인다.')},
     {label:'남는다', sub:'안정 · 나 +2', run:S => R_(S, {self:2, stress:-3}, '지금 자리에서 더 단단히 서 보기로 했다.')},
   ]},
  {id:'mirror', w:3, cd:18, cond:S => S.m >= 12, title:'거울 속의 나', place:'room', text:S => '샤워 후 거울을 봤다. 마흔의 눈빛이 스무 살 얼굴에 겹쳐 보였다. 이 인생은 누구의 것일까.',
   choices:[
     {label:'오래 마주 본다', sub:'나 +3', run:S => R_(S, {self:3, ins:1}, '“고마워. 네가 있어서 내가 있어.” 거울 속의 내가 처음으로 웃었다.')},
     {label:'외면한다', sub:'스트레스 +3', run:S => R_(S, {stress:3}, '불을 끄고 침대에 누웠다. 아직은 어려운 질문이다.')},
   ]},
];

// ── 이벤트 선택 ───────────────────────────────────────────────
function fixedEvents(S){
  const out = [];
  if(S.collapse){ out.push(collapseEvent(S)); }
  if(S.m === 0) out.push(PROLOGUE);
  for(const c of CHECKS) if(S.m === c.m && !S.seen[c.id]) out.push(checkEvent(S, c));
  for(const e of ERA) if(S.m === e.m && !S.seen[e.id]) out.push(Object.assign({once:true, speaker:''}, e));
  if(S.m === GRAD_M && !S.seen.graduation) out.push(GRADUATION);
  const le = loveEvent(S); if(le) out.push(le);
  if(S.m === TOTAL_MONTHS - 1) out.push(FINALE);
  return out;
}
function collapseEvent(S){
  return {id:'collapse_' + S.m, speaker:'', title:'쓰러지다', place:'room',
    text:S => '버티다 못한 몸이 먼저 신호를 보냈다. 눈을 떠 보니 병원 천장이었다. 의사가 한마디 했다. “이렇게 사시면 안 됩니다.”',
    choices:[{label:'정말 쉬기로 한다', sub:'체력 회복 · 자금 -30', run(S){ const ch = []; S.collapse = false; S.hp = 50; S.stress = 45; fx(S, {cash:-30, self:-2, ins:1}, ch); return {text:'일주일을 입원해 있었다. 마흔의 몸은 이렇게 무너졌을 것이다. 이번에는 늦지 않게 멈췄다.', chips:ch}; }}]};
}
function pickEvent(S){
  const pool = EVENTS.filter(e => (!e.once || !S.seen[e.id]) && (!e.cd || (S.cd[e.id] == null) || S.m - S.cd[e.id] >= e.cd) && (!e.cond || e.cond(S)));
  if(!pool.length) return null;
  const tot = pool.reduce((a, e) => a + (e.w || 1), 0); let r = R() * tot;
  for(const e of pool){ r -= (e.w || 1); if(r <= 0) return e; }
  return pool[pool.length - 1];
}
