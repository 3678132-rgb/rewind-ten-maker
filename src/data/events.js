// 이벤트 데이터 (ENGINE 구간 안, DOM 금지)
// 스키마: {id, once, w, cd, cond(S), speaker, title, place, beats?:[문장], text(S), choices:[{label, sub, run(S)→{text, chips}}]}
const R_ = (S, o, text) => { const ch = []; fx(S, o, ch); return {text, chips:ch}; };
const GRANDMA = '시간 약방 할머니';

// ── 고정 스토리 ────────────────────────────────────────────────
const PROLOGUE = {id:'prologue', once:true, speaker:'', title:'마흔 살, 비 오는 날', place:'rain',
  beatImgs:[1, 2, 3, 4, 5, 6, 7, 8].map(n => `art/op_${n}.webp`), // 대사 8개에 맞춘 일러스트 (art/op_1~8)
  beats:[
    '마흔 살. 이혼 서류에 도장을 찍은 지 이틀 만에, 회사에서 정리해고 통보가 왔다.',
    '십오 년을 다닌 회사였다. 사원증이 반납함에 떨어지는 소리가 이상하게 가벼웠다.',
    '비를 맞으며 걷다가 처음 보는 골목에 들어섰다. 간판 없는 낡은 가게에 불이 켜져 있었다. 「시간 약방」.',
    `“들어와요. 오래 기다렸어요.” 카운터의 ${GRANDMA}가 작은 병 하나를 내밀었다. 병 속에서는 호박색 모래가 느리게 가라앉고 있었다.`,
    '“스무 살로 되감아 줄게요. 대신 시간은 딱 십 년. 서른 살이 되던 날, 그동안 새 인생을 만들어 냈다면 시계는 온전히 당신 것이 됩니다. 어느 나이에서든 살 수 있어요.”',
    '“못 만들었다면요?” “오늘의 이 골목으로 돌아와야죠. 마흔 살의 그 인생으로.”',
    '나는 병을 땄다. 목이 타서였는지, 더 잃을 게 없어서였는지는 지금도 모르겠다.',
    '눈을 뜨자 천장의 얼룩이 낯익었다. 신입생 환영회 현수막, 삐걱대는 자취방 침대, 2016년 3월. 거울 속에는 스무 살의 내가 있었다.',
  ],
  text:S => `${S.name}, 스무 살. ${UNIVERSITY} ${majorOf(S).name} 신입생. 몸은 가볍고 머릿속은 마흔의 기억으로 가득하다. 이번에는 다르게 살 수 있다. 가장 먼저 무엇을 할까?`,
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
  return {id:c.id, once:true, speaker:GRANDMA, title:c.title, place:'shop', img:'art/grandma.webp',
    beats:[c.hint, c.line, `“지금의 당신은 이래요. ${bar('work')} · ${bar('bond')} · ${bar('self')}. 새 인생이 되려면 셋 다 50을 넘어야 해요.”`],
    text:S => `가장 부족한 것은 「${PILLAR[weakest]}」다. 할머니가 모래시계를 한 번 뒤집었다. 그래서 어떻게 할까?`,
    choices:[
      {label:'부족한 쪽에 집중하겠다', sub:'각오 · 해당 항목 +4', run:S => R_(S, {[weakest]:4}, '“좋은 마음가짐이에요.” 할머니가 희미하게 웃었다.')},
      {label:'할머니의 정체를 묻는다', sub:'나 +2', run:S => R_(S, {self:2, ins:1}, '“언젠가 알게 돼요. 그날이 오면 놀라지 말고.” 할머니는 대답 대신 차를 따라 주었다.')},
    ]};
}

const FINALE = {id:'finale', once:true, speaker:GRANDMA, title:'서른 살, 약방', place:'shop', img:'art/grandma.webp',
  beats:[
    '2026년 2월. 십 년의 마지막 날, 나는 처음 이 시간으로 돌아왔던 그 골목의 약방 앞에 서 있었다.',
    '카운터의 할머니가 모래시계를 쓰다듬는다. 마지막 모래알이 떨어졌다.',
    '“이제 다 말할게요. 나는 일흔 살의 서윤이에요. 나도 마흔에 모든 걸 잃었고, 이 약으로 스무 살로 돌아갔어요.”',
    '“그때 나는 미래를 아는 힘으로 일도 돈도 전부 이겼어요. 그런데 사람과 나 자신을 놓쳤고, 서른에 혼자가 됐죠. 같은 약을 다시 구하려다 남은 시간도 다 써 버렸어요.”',
    '“그래서 이 약방을 열었어요. 같은 후회를 가진 사람에게 시계를 건네고, 십 년 뒤 어떻게 살았는지 지켜보려고요.”',
    '“오늘이 그 결과예요. 일과 사람과 나, 세 가지가 모두 단단하고 미래를 빌려 쓴 몫이 적을수록 자유가 돼요. 이제 당신의 서른 살을 보여 줘요.”',
  ],
  text:S => '모래시계가 마지막으로 뒤집혔다. 결과가 정해질 시간이다.',
  choices:[{label:'내 서른 살의 결과를 본다', sub:'엔딩', run:S => ({text:'', chips:[]})}]};

// ── 시대 이벤트 (실제 연·월 기준) ───────────────────────────────
const ERA = [
  {m:monthIndex(2017, 12), id:'era_crypto', title:'2017년 12월, 코인 광풍', place:'cafe',
   text:S => '카페마다 비트코인 이야기뿐이다. 하루에도 몇 배가 오르내리는 화면을 사람들이 홀린 듯 본다. 이 열기가 어떻게 식는지, 나는 알고 있다.',
   choices:[
     {label:'기억을 이용해 베팅한다', sub:'자금 대폭 + · 선명도 -10', run:S => { S.borrowed++; return R_(S, {cash:380, clarity:-10, stress:5}, '손이 떨렸지만 망설임은 없었다. 가장 높을 때 빠져나왔고 통장은 불어났다. 이상하게 하나도 기쁘지 않았다.'); }},
     {label:'휩쓸리지 않고 버틴다', sub:'안정 · 통찰 +2', run:S => R_(S, {ins:2, stress:-3, cash:30}, '주변이 들뜰 때 나는 월급 통장만 들여다보았다. 큰돈은 못 벌었지만 흔들리지도 않았다.')},
     {label:'친구들에게 미리 조심하라고 알려 준다', sub:'관계 +4 · 선명도 -4', run:S => R_(S, {bond:4, clarity:-4, stress:3}, '“무슨 소리야?” 의아해하던 친구들은 몇 달 뒤 전화를 걸어 왔다. “너 어떻게 알았어?” 나는 웃어넘겼다.')},
   ]},
  {m:monthIndex(2020, 3), id:'era_covid', title:'2020년 3월, 마스크와 거리두기', place:'room',
   text:S => '졸업식도, 입학식도 사라졌다. 마스크 가게 앞에는 긴 줄이 늘어서 있다. 이 시간이 얼마나 길어질지 나는 알고 있다. 사람들은 앞으로 몇 해를 화면 너머로 만나게 될 것이다.',
   choices:[
     {label:'집에서 새로운 기술을 배운다', sub:'실무·학식 + · 일 +2', run:S => R_(S, {skill:3, know:2, work:2, stress:4}, '강의와 영상으로 낮밤을 채웠다. 사람을 못 만나는 시간이 나를 한 겹 두껍게 만들었다.')},
     {label:'친구·가족에게 영상통화로 안부를 묻는다', sub:'관계 +4', run:S => R_(S, {bond:4, stress:-4}, '화면 속 엄마는 마스크를 벗고 오래 웃었다. 멀어진 시간을 메우는 데 화면은 의외로 충분했다.')},
   ]},
  {m:monthIndex(2021, 9), id:'era_squid', title:'2021년 9월, 모두가 같은 드라마', place:'cafe',
   text:S => '어디를 가도 같은 드라마 이야기다. 초록 체육복이 핼러윈 의상이 되고, 달고나를 뽑는 영상이 세계로 퍼진다. 사람들이 웃는 걸 보니 마음이 풀렸다.',
   choices:[
     {label:'친구들과 밤새 정주행한다', sub:'관계 +3 · 스트레스 -10', run:S => R_(S, {bond:3, stress:-10, cash:-8}, '오랜만에 아무 계산 없이 웃었다. 이런 밤이 인생을 지탱한다.')},
     {label:'일을 한다', sub:'일 +2', run:S => R_(S, {work:2, stress:5}, '모두가 열광할 때 책상 앞에 앉았다. 뭔가를 얻었고 뭔가를 놓쳤다.')},
   ]},
  {m:monthIndex(2022, 12), id:'era_ai', title:'2022년 12월, 대화하는 인공지능', place:'cafe',
   text:S => '대화하는 인공지능이 공개됐다. 질문하면 문장으로 답하고, 코드도 쓰고, 이력서도 고친다. 이 작은 창이 앞으로의 십 년을 통째로 바꿀 것이다. 나는 그 변화의 어디에 서 있을까.',
   choices:[
     {label:'적극적으로 배워 일에 써 본다', sub:'실무·도전 + · 일 +3', run:S => R_(S, {skill:5, dare:3, work:3, stress:6}, '밤새 질문을 던지고 결과를 고쳤다. 마흔의 나는 새로운 도구가 나올 때마다 늘 한 박자 늦었다. 이번엔 먼저 올라탔다.')},
     {label:'가볍게 구경만 한다', sub:'감각 +2', run:S => R_(S, {sense:2, stress:-2}, '신기해서 몇 번 말을 걸어 보았다. 그뿐이었다. 기회는 어떤 날은 그냥 지나간다.')},
   ]},
];

// ── 진로 탐색(3학년 봄)과 졸업 취업(2020년 2월) ─────────────────
const INTEREST_M = monthIndex(2018, 3);
const GRAD_M = monthIndex(2020, 2);
const careerSub = (S, id) => `${CAREERS[id].company} · ${fitLabel(fitP(S, id))}`;
function interestEvent(S){
  return {id:'interest', once:true, speaker:'', title:'3학년, 진로 탐색', place:'campus',
    beats:['학교 게시판에 기업 인턴 공고가 한가득 붙었다. 마흔의 나는 이 시기에 아무 생각 없이 이름 있는 곳에만 원서를 넣었다.', '이번에는 내가 무엇을 하고 싶은지부터 묻기로 했다. 어느 쪽에 마음이 끌리는가?'],
    text:S => `${UNIVERSITY} ${majorOf(S).name} 3학년. 관심 있는 직업을 하나 고르면 그 회사에서 인턴 기회를 얻을 수 있다. 졸업 때 최종 선택은 다시 할 수 있다.`,
    choices:CAREER_IDS.map(id => ({label:`${CAREERS[id].icon} ${CAREERS[id].name}`, sub:`${CAREERS[id].company} · ${fitLabel(fitP(S, id))}`, run(S){ const c = CAREERS[id], ch = []; S.interest = id; fx(S, {[Object.keys(c.key)[0]]:2, work:2}, ch); S.album.push(`${c.name}에 관심을 갖게 됨`); return {text:`${c.company}의 인턴 공고를 저장했다. ${majorOf(S).fav.includes(id) ? `${majorOf(S).name}라서 유리한 길이다.` : `${majorOf(S).name}에서 가기엔 조금 돌아가는 길이지만, 그래서 더 재미있을지도 모른다.`} (${fitLabel(fitP(S, id))})`, chips:ch}; }}))};
}
function graduationEvent(S){
  return {id:'graduation', once:true, speaker:'', title:'졸업, 그리고 진로', place:'campus',
    text:S => `${UNIVERSITY} 졸업. 마흔의 나는 이때 아무 생각 없이 큰 회사에 들어갔다. 이번에는 내가 고른 길로 간다. ${S.interest ? `(인턴으로 관심을 보인 곳: ${CAREERS[S.interest].company})` : ''}`,
    choices:CAREER_IDS.map(id => ({label:`${CAREERS[id].icon} ${CAREERS[id].name}`, sub:careerSub(S, id), run(S){
      const c = CAREERS[id], ch = []; S.track = id; S.tries = 0; const p = fitP(S, id);
      if(R() < p){ S.hired = true; S.rank = 0; S.promoAt = null; S.hiredAt = c.school || S.m; gauge(S, 'work', 6, ch);
        const t = {beauty:'최종 합격. 사원증을 목에 거는 순간 마흔의 기억이 스쳤다. 이번엔 다르게 다닐 것이다.', pd:'“내일부터 조연출로 출근하세요.” 촬영장의 무전기 소리가 벌써부터 귀에 선하다.', writer:'공모전 당선 끝에 방송국 작가실의 막내 자리를 얻었다. 노트북 하나와 마감일이 내 세계다.', actor:'오디션 합격. 연습생 계약서에 이름을 쓰는 손이 떨렸다. 마흔의 나에게는 없던 종류의 용기였다.', lawyer:'로스쿨에 합격했다. 앞으로 삼 년, 도서관과 판례가 나의 일상이다. 변호사시험은 2013년 2월이다.', dev:'코딩 테스트와 면접을 통과했다. 네오플랫의 첫 출근날, 책상에는 모니터 두 대가 놓여 있었다.', designer:'포트폴리오가 통했다. 메종 오름의 작업실에는 원단 냄새와 연필 소리가 가득했다.'}[id];
        return {text:t, chips:ch}; }
      S.hired = false; fx(S, {stress:8}, ch); return {text:`${c.company}에서 아쉬운 소식이 왔다. 구직 활동을 이어 가며 다시 도전해야 한다.`, chips:ch}; }}))};
}
const BAR_EXAM = {id:'bar_exam', once:true, speaker:'', title:'변호사시험', place:'campus',
  cond:S => S.track === 'lawyer' && S.hired,
  text:S => '2023년 2월, 로스쿨 3년의 마지막 관문인 변호사시험이다. 마흔의 나는 이 시험장 앞에 서 본 적이 없다.',
  choices:[{label:'온 힘을 다해 본다', sub:'학식과 협상이 높을수록 합격', run(S){ const ch = []; const p = clamp(0.35 + (S.st.know + S.st.neg) / 190, 0.3, 0.93); if(R() < p){ S.hiredAt = S.m; gauge(S, 'work', 8, ch); fx(S, {stress:-6}, ch); return {text:'합격자 명단에서 내 수험번호를 찾았다. 태성 법무법인에서 첫 출근이다.', chips:ch}; } S.hiredAt = S.m + 8; fx(S, {stress:10, work:-3}, ch); return {text:'불합격. 마흔의 내가 포기했던 순간들이 스쳤지만 이번엔 주저앉지 않았다. 일 년 뒤 재시험에서 합격해, 한 해 늦게 법무법인에 출근한다.', chips:ch}; }}]};

// ── 랜덤 이벤트 ───────────────────────────────────────────────
const EVENTS = [
  {id:'mom_call', w:5, cd:5, speaker:'엄마', title:'엄마의 전화', place:'room', img:'art/mom.webp', text:S => '“밥은 먹고 다니니? 이번 주말에 내려올 수 있어?” 엄마의 전화다. 마흔의 나는 이 전화를 자주 흘려 넘겼다.',
   choices:[
     {label:'주말에 내려간다', sub:'관계 +4 · 스트레스 -6 · 체력 -4 · 자금 -12', run:S => { S.mom = clamp((S.mom || 40) + 8, 0, 100); return R_(S, {bond:4, cash:-12, stress:-6, hp:-4}, '엄마는 나를 보자마자 부엌으로 달려갔다. 상 위에 반찬이 가득 올라왔다. 그 위로 오래 눈물을 삼켰다. 돌아오는 버스에서는 내내 졸았다.'); }},
     {label:'바쁘다고 끊는다', sub:'일 +1.5 · 체력 +3 · 관계 -2', run:S => R_(S, {work:1.5, hp:3, bond:-2, stress:-2}, '“그래, 바쁘면 어쩔 수 없지.” 엄마의 목소리가 작아졌다. 그 주말에 밀린 일을 끝냈고 잠도 푹 잤다. 마흔의 나와 똑같은 선택이었다.')},
     {label:'영상통화로 길게 안부를 나눈다', sub:'관계 +2 · 스트레스 -3', run:S => { S.mom = clamp((S.mom || 40) + 3, 0, 100); return R_(S, {bond:2, stress:-3}, '“얼굴 좀 보여 봐.” 엄마는 화면 속 내 얼굴을 한참 들여다보았다. 만나는 것만은 못해도 목소리는 오래 남았다.'); }},
   ]},
  {id:'old_memory', w:4, cd:8, cond:S => S.stress >= 50, title:'그날의 꿈', place:'room', text:S => '꿈속에서 사원증이 반납함에 떨어졌다. 도장이 찍힌 이혼 서류, 비 오는 골목. 깨어나니 식은땀이 흘렀다.',
   choices:[
     {label:'일기를 쓴다', sub:'나 +3 · 스트레스 -8', run:S => R_(S, {self:3, stress:-8, ins:1}, '마흔의 나에게 편지를 썼다. “잘 버텼어. 이제 내가 대신 살아 볼게.” 글자가 번졌다.')},
     {label:'술로 달랜다', sub:'스트레스 -12 · 체력 -10', run:S => R_(S, {stress:-12, hp:-10, cash:-10}, '그날 밤은 짧았고 다음 날은 길었다.')},
   ]},
  {id:'lotto', w:3, cd:24, cond:S => S.clarity >= 35 && S.m >= 6, title:'그 번호', place:'cafe', text:S => '머릿속에 선명한 숫자가 떠올랐다. 십 년 뒤 어느 주의 당첨 번호는 아니지만, 올해 인기 상품과 이슈 정도는 안다. 지금 손을 대면 확실한 수익이다.',
   choices:[
     {label:'이용한다', sub:'자금 + · 체력 +4 · 선명도 -6', run:S => { S.borrowed++; return R_(S, {cash:Math.round(rand(100, 260)), hp:4, clarity:-6, stress:2}, '쉽게 번 돈 덕에 한동안 알바를 줄이고 푹 잤다. 지갑은 두둑하고 마음은 허전했다.'); }},
     {label:'모른 척한다', sub:'통찰 +2 · 나 +2', run:S => R_(S, {ins:2, self:2}, '이 인생의 몫은 내 손으로 만들겠다고 다짐했다.')},
     {label:'아주 조금만 쓴다', sub:'자금 +40 · 선명도 -2', run:S => { S.borrowed++; return R_(S, {cash:40, clarity:-2, stress:-1}, '“딱 이번 달 생활비만큼만.” 작게 걸고 작게 땄다. 죄책감도 작게 남았다.'); }},
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
  {id:'friend_trouble', w:4, cd:8, cond:S => S.m >= 6, speaker:'소연', title:'소연의 고민', place:'cafe', img:'art/soyeon.webp', text:S => '단짝 소연이 울먹이며 전화했다. 남자친구가 바람을 피운 것 같다고. 마흔의 나는 이런 때 “네가 알아서 해”라고 말했었다.',
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
     {label:'밥을 챙겨 준다', sub:'나 +3 · 스트레스 -6 · 자금 -8', run:S => R_(S, {self:3, stress:-6, cash:-8}, '고양이는 매일 같은 시간에 창문 앞에 앉았다. 하루에 기다릴 존재가 하나 생겼다.')},
     {label:'지나친다', sub:'일 +1.5 · 체력 +2', run:S => R_(S, {work:1.5, hp:2}, '발걸음을 서둘렀다. 덕분에 약속에는 제시간에 도착했다. 어쩐지 오래 마음에 남았다.')},
     {label:'간식만 놓아 두고 서둘러 간다', sub:'나 +1 · 스트레스 -2 · 자금 -3', run:S => R_(S, {self:1, stress:-2, cash:-3}, '주머니 속 소시지를 까서 바닥에 두고 뛰었다. 돌아보니 고양이가 천천히 다가오고 있었다.')},
   ]},
  {id:'senior_ask', w:3, cd:10, cond:S => S.m >= 12, title:'후배의 질문', place:'campus', text:S => '낯선 후배가 찾아와 진로 상담을 청했다. 마흔 해의 시행착오를 한 줄로 요약해 줄 수 있을까.',
   choices:[
     {label:'진심으로 조언한다', sub:'관계 +2.5 · 통찰 +1.5 · 일 -1 · 스트레스 +3', run:S => R_(S, {bond:2.5, ins:1.5, stress:3, work:-1}, '“한 번에 다 하려고 하지 마. 버티는 사람이 이겨.” 후배의 눈이 반짝였다. 한 시간 넘게 쏟은 탓에 내 일은 조금 밀렸다.')},
     {label:'바쁘다고 거절하고 일을 끝낸다', sub:'일 +2.5 · 스트레스 -2', run:S => R_(S, {work:2.5, stress:-2}, '후배는 아쉬운 표정으로 돌아갔다. 덕분에 미뤄 둔 일은 오늘 안에 끝났다.')},
     {label:'밥 한 끼 사 주며 편하게 이야기한다', sub:'관계 +2 · 통찰 +1 · 스트레스 -2 · 자금 -12', run:S => R_(S, {bond:2, ins:1, cash:-12, stress:-2}, '“일단 먹자. 얘기는 그다음에.” 국밥 앞에서 후배는 한결 편해진 얼굴로 속내를 꺼냈다.')},
   ]},
  {id:'new_year', w:6, cd:12, cond:S => monthOf(S) === 1, title:'새해 다짐', place:'room', text:S => '창밖에서 제야의 종소리가 들린다. 이번에는 어떤 한 해를 보내고 싶은가.',
   choices:[
     {label:'일에 집중하는 해', sub:'일 +3 · 자금 +30 · 스트레스 +4', run:S => R_(S, {work:3, cash:30, stress:4}, '노트 첫 장에 목표를 적었다. 한 해가 숫자로 가득 찰 것이다.')},
     {label:'사람에 집중하는 해', sub:'관계 +3 · 스트레스 -3 · 자금 -15', run:S => R_(S, {bond:3, stress:-3, cash:-15}, '연락처를 열고 안부를 묻고 싶은 이름들을 표시했다. 올해는 밥값이 좀 들겠지만 괜찮다.')},
     {label:'나에 집중하는 해', sub:'나 +3 · 체력 +5 · 일 -1', run:S => R_(S, {self:3, hp:5, work:-1}, '“올해는 나를 먼저.” 낯설지만 좋은 문장이었다. 일찍 자고 운동화를 새로 샀다.')},
   ]},
  {id:'cafe_regular', w:3, cd:12, cond:S => (S.uses.cafe || 0) >= 4, title:'단골 손님', place:'cafe', text:S => '단골 할아버지가 말했다. “자네 일하는 거 보면 기분이 좋아. 우리 손주 가게에서 일해 볼 생각 없나?”',
   choices:[
     {label:'소개를 받는다', sub:'자금 +60 · 일 +2 · 협상 +1 · 체력 -3 · 스트레스 +4', run:S => R_(S, {cash:60, work:2, neg:1, hp:-3, stress:4}, '작은 인연이 이력의 한 줄이 되었다. 쉬는 날이 하나 줄었다.')},
     {label:'사양한다', sub:'나 +1.5 · 체력 +3 · 스트레스 -4', run:S => R_(S, {self:1.5, hp:3, stress:-4}, '“고맙지만 저는 제 길을 가 보려고요.” 퇴근길을 천천히 걸었다. 여유가 생긴 저녁이었다.')},
     {label:'주말에만 돕겠다고 조건을 건다', sub:'자금 +30 · 협상 +1.5 · 체력 -1', run:S => R_(S, {cash:30, neg:1.5, hp:-1}, '“주말에 몇 시간이면 어떻겠습니까?” 할아버지가 흔쾌히 웃었다. 조건을 말하는 일이 생각보다 어렵지 않았다.')},
   ]},
  {id:'prefuture', w:3, cd:15, cond:S => S.borrowed >= 2, speaker:GRANDMA, title:'꿈속의 약방', place:'shop', img:'art/grandma.webp', text:S => '꿈에 약방이 나왔다. 모래시계 한쪽이 유난히 어둡다. 할머니가 말했다. “쉽게 얻은 건 쉽게 사라져요. 그걸 손에 쥐고 서른이 되면, 그건 당신의 인생이 아니에요.”',
   choices:[
     {label:'미래 지식 사용을 줄인다', sub:'나 +3 · 통찰 +2 · 자금 -20 · 스트레스 +2', run:S => R_(S, {self:3, ins:2, cash:-20, stress:2}, '잠에서 깨어 한참 천장을 보았다. 쉬운 길을 접으니 한동안 통장이 빠듯했다. 하지만 이제부터는 내 손으로 한다.')},
     {label:'모른 척한다', sub:'일 +1.5 · 자금 +30 · 선명도 -3 · 스트레스 +3', run:S => R_(S, {work:1.5, cash:30, clarity:-3, stress:3}, '그냥 꿈이라고 생각하기로 했다. 다음 날도 쉬운 길로 걸었고 일은 순조로웠다. 어쩐지 손이 시렸다.')},
     {label:'꼭 필요한 순간에만 쓰기로 한다', sub:'나 +1.5 · 일 +0.8 · 자금 +10 · 선명도 -1.5', run:S => R_(S, {self:1.5, work:0.8, cash:10, clarity:-1.5, stress:1}, '“정말 필요한 순간에만.” 스스로 선을 긋고 나니 꿈속의 모래시계가 조금 밝아진 것 같았다.')},
   ]},
  {id:'dare_chance', w:3, cd:12, cond:S => S.st.dare >= 25 && S.m >= 18, title:'뜻밖의 제안', place:'cafe', text:S => '“자네, 이 프로젝트 같이 해 볼 생각 있어?” 처음 보는 사람이 던진 제안이다. 위험하지만 기회일 수도 있다.',
   choices:[
     {label:'도전한다', sub:'일·도전 + · 스트레스 +', run:S => R_(S, {work:3, dare:2.5, stress:8, cash:-10}, '결과는 절반의 성공이었다. 하지만 배운 게 많았다.')},
     {label:'안전하게 거절한다', sub:'스트레스 -2', run:S => R_(S, {stress:-2}, '아직 때가 아니라고 생각했다.')},
   ]},
  {id:'mom_sick', w:2, cd:36, cond:S => S.m >= 30 && (S.mom || 0) < 70, speaker:'엄마', title:'엄마의 건강검진', place:'room', img:'art/mom.webp', text:S => '엄마가 검진 결과를 숨기고 있었다. 큰 이상은 아니라지만 목소리가 달랐다. 마흔의 나는 이런 걸 나중에야 알았다.',
   choices:[
     {label:'당장 내려가 곁을 지킨다', sub:'관계 +5 · 일 -2', run:S => { S.mom = clamp((S.mom || 40) + 12, 0, 100); return R_(S, {bond:5, work:-2, stress:6, hp:-4}, '엄마 곁에서 이틀을 보냈다. “바쁜데 뭘 와.” 말과 달리 엄마의 손이 내 손을 꼭 쥐었다.'); }},
     {label:'전화로 안부만 전한다', sub:'일 +1', run:S => R_(S, {work:1, bond:-2}, '마음 한쪽이 계속 무거웠다.')},
   ]},
  {id:'burnout_colleague', w:3, cd:12, cond:S => S.hired, title:'지친 동료', place:'cafe', text:S => '옆 팀 동료가 점심시간에 울고 있었다. 마흔의 나였을지도 모른다. 나는 어떻게 할까.',
   choices:[
     {label:'말없이 커피를 건넨다', sub:'관계 +3 · 통찰 +1.2 · 스트레스 +3', run:S => R_(S, {bond:3, ins:1.2, stress:3}, '“…고마워요.” 그는 한참 뒤에 웃었다. 나도 그날 누군가에게 이런 커피를 받고 싶었다. 점심시간이 다 가도록 곁에 앉아 있었다.')},
     {label:'내 일에 집중한다', sub:'일 +2.5 · 스트레스 -2 · 나 -1', run:S => R_(S, {work:2.5, stress:-2, self:-1}, '모른 척한 것이 마음에 걸렸지만, 보고서는 시간에 끝났다.')},
     {label:'팀장에게 업무 조정을 조심스럽게 건의한다', sub:'일 +1.5 · 관계 +1.5 · 협상 +1.5 · 스트레스 +4', run:S => R_(S, {work:1.5, bond:1.5, neg:1.5, stress:4}, '“그 팀 일손이 모자란 것 같아요.” 팀장은 한참 생각하더니 일정을 조정해 주었다. 이름은 밝히지 않았지만 동료는 눈치를 챘다.')},
   ]},
  {id:'headhunt', w:3, cd:24, cond:S => S.hired && S.m >= 60 && S.st.skill >= 40, title:'이직 제안', place:'cafe', text:S => '헤드헌터에게서 연락이 왔다. 지금보다 연봉이 높은 곳이다. 하지만 새 조직에서 또 처음부터 시작해야 한다.',
   choices:[
     {label:'옮긴다', sub:'자금·일 + · 스트레스 +', run:S => R_(S, {cash:120, work:3, stress:8, neg:1.5}, '새 직장에서 나는 첫날부터 일머리가 있다는 소리를 들었다. 마흔의 경력이 이렇게 쓰인다.')},
     {label:'남는다', sub:'안정 · 나 +2', run:S => R_(S, {self:2, stress:-3}, '지금 자리에서 더 단단히 서 보기로 했다.')},
   ]},
  {id:'mirror', w:3, cd:18, cond:S => S.m >= 12, title:'거울 속의 나', place:'room', text:S => '샤워 후 거울을 봤다. 마흔의 눈빛이 스무 살 얼굴에 겹쳐 보였다. 이 인생은 누구의 것일까.',
   choices:[
     {label:'오래 마주 본다', sub:'나 +3 · 통찰 +1 · 스트레스 +3', run:S => R_(S, {self:3, ins:1, stress:3}, '“고마워. 네가 있어서 내가 있어.” 거울 속의 내가 처음으로 웃었다. 눈가가 뜨거워져 한참을 그대로 서 있었다.')},
     {label:'외면하고 밀린 일을 한다', sub:'일 +2 · 체력 +3', run:S => R_(S, {work:2, hp:3}, '불을 끄고 책상 앞에 앉아 밀린 일을 처리한 뒤 일찍 누웠다. 아직은 어려운 질문이다.')},
     {label:'눈만 맞추고 웃어 본다', sub:'나 +1.5 · 스트레스 -3', run:S => R_(S, {self:1.5, stress:-3}, '거울 속의 나에게 어색하게 웃어 보였다. 깊이 묻지는 않기로 했다. 그래도 조금은 가벼워졌다.')},
   ]},
];

const onJob = id => S => S.hired && S.track === id && !inLawSchool(S);
EVENTS.push(
  {id:'beauty_pt', w:4, cd:12, cond:onJob('beauty'), speaker:'한지후', title:'신제품 캠페인 PT', place:'room', text:S => '루미에르 코스메틱의 신제품 론칭 회의. 내 기획안으로 임원진 앞에서 발표해야 한다. 어떤 방식으로 설득할까?',
   choices:[
     {label:'데이터와 수치로 설득한다', sub:'협상 · 일 +', run:S => R_(S, {neg:2, work:2.5, stress:5}, '표와 그래프로 빈틈없이 말했다. 임원진은 고개를 끄덕였고, 기획안은 통과됐다.')},
     {label:'감성 스토리로 설득한다', sub:'감각 · 일 +', run:S => R_(S, {sense:2.5, work:2.2, stress:4}, '제품이 아닌 한 사람의 아침을 이야기했다. 회의실이 조용해졌고, 그 침묵이 합격이었다.')},
     {label:'미래 트렌드를 아는 척한다', sub:'일 ++ · 선명도 -6', run:S => { S.borrowed++; return R_(S, {work:4, clarity:-6}, '앞으로 유행할 성분과 색을 척척 짚었다. 성공했지만, 이건 내 감각이 아니라 기억이었다.'); }},
   ]},
  {id:'beauty_review', w:3, cd:15, cond:onJob('beauty'), title:'리뷰 위기', place:'room', text:S => '온라인에 우리 제품 부작용 후기가 퍼졌다. 사실 여부는 불분명하지만 불길이 커지고 있다. 대응 방식은?',
   choices:[
     {label:'즉시 사과하고 원인을 공개한다', sub:'통찰 · 일 +', run:S => R_(S, {ins:2, work:2, stress:7}, '투명한 대응이 오히려 신뢰를 얻었다. 밤은 길었지만 아침은 차분했다.')},
     {label:'법무팀에 맡기고 침묵한다', sub:'스트레스 + · 일 -', run:S => R_(S, {work:-2, stress:6}, '침묵은 의혹을 키웠다. 매출이 한 달간 흔들렸다.')},
   ]},
  {id:'pd_rain', w:4, cd:12, cond:onJob('pd'), speaker:'차도현', title:'우천 촬영', place:'night', text:S => '야외 촬영 당일, 폭우가 쏟아진다. 예산은 한계, 배우와 스태프 백여 명이 대기 중이다.',
   choices:[
     {label:'강행한다', sub:'일 + · 체력 -', run:S => R_(S, {work:3, dare:2, hp:-10, stress:6}, '모두가 비를 맞으며 찍었다. 그 컷은 방송에서 가장 아름다운 장면이 되었다.')},
     {label:'취소하고 일정을 다시 짠다', sub:'협상 · 스트레스 +', run:S => R_(S, {neg:2.5, work:1, stress:4, cash:-20}, '위약금을 협상하고 일정을 다시 짰다. 스태프들이 고마워했다.')},
   ]},
  {id:'pd_cast', w:3, cd:15, cond:onJob('pd'), title:'캐스팅 갈등', place:'cafe', text:S => '메인 배역을 두고 방송국과 제작사의 의견이 갈렸다. 내가 밀던 신인이 위태롭다.',
   choices:[
     {label:'신인을 끝까지 밀어붙인다', sub:'도전 · 일 +', run:S => R_(S, {dare:2.5, work:2.5, stress:7}, '밀어붙인 끝에 신인이 캐스팅됐다. 첫 방송 후 반응이 터졌다.')},
     {label:'안전한 스타 배우로 간다', sub:'일 + · 나 -', run:S => R_(S, {work:1.5, self:-2, stress:2}, '시청률은 안정적이었지만 마음 한구석이 비었다.')},
   ]},
  {id:'writer_slump', w:4, cd:12, cond:onJob('writer'), title:'대본 슬럼프', place:'room', text:S => '마감 사흘 전인데 한 줄도 나오지 않는다. 커서만 깜박이는 화면. 마흔의 나는 이런 날 포기했다.',
   choices:[
     {label:'산책을 나가 사람을 관찰한다', sub:'감각 · 스트레스 -', run:S => R_(S, {sense:2, ins:1.5, stress:-5, work:1.5}, '버스 안 사람들의 대화를 훔쳐 들었다. 그 대사가 오늘 밤 대본이 되었다.')},
     {label:'밤새 앉아 억지로 쓴다', sub:'일 + · 체력 --', run:S => R_(S, {work:2.5, hp:-12, stress:8}, '마감은 지켰지만 대본의 온도는 식어 있었다.')},
   ]},
  {id:'writer_rating', w:3, cd:15, cond:onJob('writer'), title:'시청률 발표', place:'room', text:S => '어젯밤 방영분 시청률이 나왔다. 방송국 복도가 술렁인다.',
   choices:[
     {label:'결과를 겸허히 받아들이고 다음 회를 쓴다', sub:'통찰 · 일 + · 체력 -2', run:S => { const up = S.st.sense + R() * 40 > 55; return R_(S, up ? {work:3, sense:1.5, stress:-4, hp:-2} : {work:1, ins:2, stress:4, hp:-2}, up ? '두 자릿수 시청률! 작가실이 환호했다. 칭찬보다 다음 회가 더 걱정이었다.' : '아쉬운 숫자였다. 시청자의 댓글을 읽으며 밤새 다음 회를 고쳐 썼다.'); }},
     {label:'그 숫자는 보지 않고 산책한다', sub:'스트레스 -5 · 체력 +3 · 일 -1', run:S => R_(S, {stress:-5, hp:3, work:-1}, '모르는 편이 낫다고 생각하고 한강 변을 걸었다. 하지만 숫자는 나 없이도 움직였다.')},
     {label:'작가실 사람들과 술 한잔하며 잊는다', sub:'관계 +2 · 스트레스 -6 · 체력 -4 · 자금 -8', run:S => R_(S, {bond:2, stress:-6, hp:-4, cash:-8}, '“다음 회가 있잖아요.” 선배 작가가 건배를 청했다. 숫자는 잔 속에서 잠시 잊혔다.')},
   ]},
  {id:'actor_audition', w:4, cd:12, cond:onJob('actor'), speaker:'백승현', title:'오디션', place:'night', text:S => '대형 드라마의 조연 오디션 기회가 왔다. 심사위원 앞에서 단 오 분. 마흔의 나는 한 번도 서 보지 못한 자리다.',
   choices:[
     {label:'준비한 대사를 완벽하게 한다', sub:'매력 · 일 +', run:S => { const ok = S.st.charm + S.st.sense + R() * 60 > 95; return R_(S, ok ? {charm:2.5, work:4, stress:-2} : {charm:1, work:1, stress:6}, ok ? '대사가 끝나자 심사위원이 박수를 쳤다. 합격 문자가 오후에 왔다.' : '아깝게 떨어졌다. 하지만 심사위원이 이름은 기억해 주었다.'); }},
     {label:'즉흥 연기로 승부한다', sub:'도전 · 위험', run:S => { const ok = R() < 0.5; return R_(S, ok ? {dare:3, work:4, charm:1.5} : {dare:1.5, stress:7}, ok ? '즉흥 연기가 대박이었다. 그 장면이 지금도 회자된다.' : '대사가 꼬였고 침묵이 이어졌다. 그래도 도전은 도전이다.'); }},
   ]},
  {id:'actor_hate', w:3, cd:15, cond:onJob('actor'), title:'악플', place:'room', text:S => '새로 올라온 기사 밑에 악의적인 댓글이 쏟아졌다. 마흔의 내 마음을 닮은 문장들이 화면을 가득 채웠다.',
   choices:[
     {label:'소속사와 법적 대응한다', sub:'일 + · 스트레스 +', run:S => R_(S, {work:1.5, stress:5, ins:1.5}, '법무팀과 함께 대응했다. 마음이 한 겹 단단해졌다.')},
     {label:'친구들과 만나 털어놓는다', sub:'관계 + · 스트레스 --', run:S => R_(S, {bond:3, stress:-9, self:1.5}, '“그 사람들은 널 몰라.” 소연이 말했다. 오랜만에 소리 내어 울었다.')},
   ]},
  {id:'lawyer_case', w:4, cd:12, cond:onJob('lawyer'), speaker:'최건우', title:'밤샘 사건', place:'night', text:S => '내일 아침 서면 제출인데 핵심 증거 한 줄이 모자란다. 사무실에는 나와 불 켜진 창문들뿐이다.',
   choices:[
     {label:'끝까지 파고든다', sub:'학식 · 일 + · 체력 --', run:S => R_(S, {know:2.5, work:3, hp:-12, stress:7}, '새벽 네 시, 숨은 판례를 찾아냈다. 서면은 완벽했다.')},
     {label:'기한 연장을 신청한다', sub:'협상 · 일 -', run:S => R_(S, {neg:2, work:-1, stress:-2}, '재판부는 기한을 하루 늦춰 주었다. 몸은 살았지만 마음은 아쉬웠다.')},
   ]},
  {id:'lawyer_lie', w:3, cd:15, cond:onJob('lawyer'), title:'의뢰인의 거짓말', place:'room', text:S => '의뢰인이 사실과 다른 진술을 부탁했다. 승소 가능성은 오히려 높아진다. 마흔의 나는 이런 때 눈을 감았다.',
   choices:[
     {label:'원칙대로 거절한다', sub:'나 + · 일 -', run:S => R_(S, {self:3, work:-1, ins:2}, '의뢰인은 화를 냈지만 나는 거울 앞에서 부끄럽지 않았다.')},
     {label:'눈을 감는다', sub:'일 + · 나 -- · 빌린 인생', run:S => { S.borrowed++; return R_(S, {work:2, self:-4, stress:6}, '이겼다. 하지만 서류에 적힌 문장이 오래 마음에 걸렸다.'); }},
   ]},
  {id:'dev_outage', w:4, cd:12, cond:onJob('dev'), speaker:'안유찬', title:'새벽 장애', place:'night', text:S => '새벽 세 시, 서비스가 다운됐다. 사용자 문의가 폭주하고 슬랙 알림이 멈추질 않는다.',
   choices:[
     {label:'로그를 뒤져 직접 복구한다', sub:'실무 · 일 + · 체력 -', run:S => R_(S, {skill:3, work:3, hp:-10, stress:6}, '원인은 한 줄의 설정 오류였다. 복구 후 동이 트는 창밖을 멍하니 봤다.')},
     {label:'팀을 소집해 역할을 나눈다', sub:'협상 · 일 +', run:S => R_(S, {neg:2, work:2.5, stress:4}, '복구는 빠르게 끝났다. 사후 보고서에 팀원들 이름을 먼저 적었다.')},
   ]},
  {id:'dev_side', w:3, cd:18, cond:onJob('dev'), title:'사이드 서비스 제안', place:'cafe', text:S => '새 서비스 시장이 열리던 때를 나는 안다. 이번에 만들 서비스의 이름도 기억한다. 지금 만들면 선점할 수 있다.',
   choices:[
     {label:'미래 지식으로 선점한다', sub:'자금 ++ · 선명도 -8', run:S => { S.borrowed++; return R_(S, {cash:260, clarity:-8, work:1}, '빠르게 만들어 시장에 냈다. 순식간에 이용자가 모였다. 이상하게 뿌듯하지 않았다.'); }},
     {label:'내 아이디어로 처음부터 만든다', sub:'실무 · 도전 · 일 +', run:S => R_(S, {skill:3, dare:2.5, work:3, stress:8, cash:-30}, '느리고 서툴렀지만 이건 온전히 내 것이었다. 첫 사용자 한 명의 후기가 눈물이 났다.')},
   ]},
  {id:'designer_collection', w:4, cd:12, cond:onJob('designer'), speaker:'신우진', title:'컬렉션 마감', place:'night', text:S => '패션위크 일주일 전, 메인 룩의 원단이 입고되지 않았다. 대체 원단을 찾느냐, 디자인을 바꾸느냐.',
   choices:[
     {label:'직접 시장을 돌아 원단을 찾는다', sub:'감각 · 일 + · 체력 -', run:S => R_(S, {sense:3, work:3, hp:-8, stress:6}, '동대문 새벽 시장을 누비다 완벽한 원단을 찾았다. 우진이 처음으로 엄지를 들어 줬다.')},
     {label:'디자인을 단순하게 바꾼다', sub:'실무 + · 일 +', run:S => R_(S, {skill:2.5, work:1.5, stress:3}, '선을 덜어내니 오히려 세련됐다. 간결함도 용기다.')},
   ]},
  {id:'designer_copy', w:3, cd:15, cond:onJob('designer'), title:'표절 의혹', place:'room', text:S => '해외 브랜드의 신상품과 우리 시안이 비슷하다는 글이 올라왔다. 나는 안다. 이건 우연이다.',
   choices:[
     {label:'스케치와 날짜로 증명한다', sub:'일 +2.5 · 통찰 +1.5 · 체력 -3 · 스트레스 +6', run:S => R_(S, {work:2.5, ins:1.5, stress:6, hp:-3}, '작업 노트와 날짜가 증거가 되었다. 밤새 자료를 정리했지만 논란은 하루 만에 가라앉았다.')},
     {label:'조용히 넘어가고 다음 작업에 몰두한다', sub:'실무 +1.5 · 체력 +2 · 일 -1 · 스트레스 +2', run:S => R_(S, {skill:1.5, hp:2, work:-1, stress:2}, '해명하는 대신 다음 시안을 그렸다. 오해는 오래 떠돌았지만 손은 쉬지 않았다.')},
     {label:'동료 디자이너에게 먼저 공유하고 증언을 받는다', sub:'관계 +2 · 일 +1.5 · 통찰 +1 · 스트레스 +3', run:S => R_(S, {bond:2, work:1.5, ins:1, stress:3}, '“그 시안, 내가 지난달에 이미 봤어.” 동료의 한마디가 가장 든든한 증거가 되었다.')},
   ]},
  {id:'office_rumor', w:5, cd:10, cond:S => { const p = S.partner; return !!p && !!LOVERS[p] && !!LOVERS[p].career && S.hired && lvOnTrack(LOVERS[p], S); }, title:'사내 소문', place:'cafe', text:S => `${LOVERS[S.partner].name}와의 사이가 회사에 소문이 났다. 복도에서 시선이 따갑다. 어떻게 할까?`,
   choices:[
     {label:'당당하게 공개한다', sub:'관계 + · 일 -1', run:S => R_(S, {bond:3, work:-1, self:2}, '“네, 만나고 있어요.” 짧은 한마디에 수군거림은 오히려 잦아들었다.')},
     {label:'일에 집중해 증명한다', sub:'일 +2 · 스트레스 +', run:S => R_(S, {work:2.5, stress:6}, '소문보다 성과가 더 크게 말했다. 대신 퇴근 후엔 기운이 없었다.')},
     {label:'거리를 두고 지켜본다', sub:'호감 -3', run:S => { addAff(S, S.partner, -3); return R_(S, {stress:3}, '조심스러운 거리가 서로를 오히려 외롭게 했다.'); }},
   ]},
);
// ── 이벤트 선택 ───────────────────────────────────────────────
function fixedEvents(S){
  const out = [];
  if(S.collapse){ out.push(collapseEvent(S)); }
  if(S.m === 0 && !S.seen.prologue) out.push(PROLOGUE);
  for(const c of CHECKS) if(S.m === c.m && !S.seen[c.id]) out.push(checkEvent(S, c));
  for(const e of ERA) if(S.m === e.m && !S.seen[e.id]) out.push(Object.assign({once:true, speaker:''}, e));
  if(S.m === INTEREST_M && !S.seen.interest) out.push(interestEvent(S));
  if(S.m === GRAD_M && !S.seen.graduation) out.push(graduationEvent(S));
  if(S.m === CAREERS.lawyer.school - 1 && !S.seen.bar_exam && BAR_EXAM.cond(S)) out.push(BAR_EXAM);
  const se = storyDue(S); if(se) out.push(se);
  const ne = typeof negoEvent === 'function' ? negoEvent(S) : null; if(ne) out.push(ne); // 이직 합격 직후 연봉 협상
  const ce = careerEvent(S); if(ce) out.push(ce);
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
