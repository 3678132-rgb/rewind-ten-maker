// 주 스토리 8~10장 (2023~2026) + 위기 랜덤 이벤트. ENGINE 구간(DOM 금지)
const STORY_C = (() => {
  // 하린 얼굴 표정이 붙는 결과
  const H = (S, o, text, mood) => Object.assign(R_(S, o, text), {mood});
  const hm = S => SS(S).momStage;
  return [

  // ───────── 8장 : 같은 약, 다른 사람 (2023) ─────────
  {id:'st_8_1', m:84, exp:6, speaker:RIVAL, img:'art/rival_harin.webp', face:'harin', place:'rain', title:'골목 끝의 우산',
   beats:[
    '야근을 마치고 나온 밤, 비가 쏟아졌다. 지름길로 들어선 골목은 이상하게 낯익었다. 마흔의 그날 내가 걸었던 그 골목이었다.',
    `우산도 없이 벽에 기대어 선 사람이 있었다. ${RIVAL}. 손에는 호박색 모래가 느리게 가라앉는 작은 병이 들려 있었다.`,
    '“놀라지 마요. 나도 알아요. 이 모래가 어떤 맛인지.” 그녀의 목소리가 빗소리에 반쯤 묻혔다.',
    '“스무 살에 눈을 떴을 때, 제일 먼저 한 일이 뭔 줄 알아요? 수석 입학 명단에서 내 이름을 찾은 거예요. 두 번째로는 당신 이름을 찾았고요.”',
   ],
   text:S => `${RIVAL}도 같은 약을 먹었다. 7년 동안 나를 이상하게 정확히 겨눴던 시선의 이유가 비로소 풀렸다. 젖은 어깨 너머로 그녀가 묻는다. “이제 어떻게 할 거예요, ${S.name}?”`,
   choices:[
    {label:'“나도 마셨어요.”라고 먼저 털어놓는다', sub:'진실 · 하린 관계 +1 · 스트레스 -3', run:S => { SF(S).harinTruth = true; SS(S).truth = Math.min(10, SS(S).truth + 2); const ch = []; rivalMood(S, 1, ch); fx(S, {stress:-3, self:1.5, ins:1.5}, ch); return {text:'하린의 어깨가 처음으로 내려앉았다. “…역시.” 비 사이로 둘이 한참 말없이 서 있었다. 이 세상에서 서로만 알아볼 수 있는 사람이 하나 더 있다는 사실이 이상하게 서늘하고 따뜻했다.', chips:ch, mood:'surprised'}; }},
    {label:'아무것도 모르는 척, 무슨 말이냐고 되묻는다', sub:'진실 · 통찰 +1 · 스트레스 +4', run:S => { SF(S).harinTruth = true; SS(S).truth = Math.min(10, SS(S).truth + 1); const ch = []; rivalMood(S, -1, ch); fx(S, {stress:4, ins:1.5, neg:1}, ch); return {text:'“그 표정, 알아요. 거짓말할 때 입꼬리가 먼저 내려가죠.” 하린이 씁쓸하게 웃었다. 들킨 건 나인데 이상하게 그녀가 더 아파 보였다. 비는 계속 내렸다.', chips:ch, mood:'serious'}; }},
    {label:'병을 쥔 그녀의 손이 떨리는 것을 말없이 본다', sub:'진실 · 하린 관계 +2 · 나 +1', run:S => { SF(S).harinTruth = true; SS(S).truth = Math.min(10, SS(S).truth + 2); const ch = []; rivalMood(S, 2, ch); fx(S, {self:1, ins:2}, ch); return {text:'나는 우산을 반쯤 기울였다. 하린은 거절하지 않았다. “…빗소리 때문에 말하기 편하네요.” 그날 밤 처음으로, 나는 그녀를 라이벌이 아닌 사람으로 보았다.', chips:ch, mood:'tender'}; }},
   ]},

  {id:'st_8_2', m:87, exp:6, speaker:RIVAL, img:'art/rival_harin.webp', face:'harin', place:'cafe', title:'사원증을 반납하던 날',
   beats:[
    '약속한 카페. 하린은 먼저 와 있었다. 식은 커피 앞에서 한 번도 입을 대지 않은 채로.',
    '“마흔의 나는 인사팀장이었어요. 그 해 상반기에 정리해고 명단 서른여섯 명, 내가 직접 면담했고요.”',
    '“서른한 번째 면담이 당신이었어요. 십오 년 근속, 이혼 이틀 뒤. 서류를 내미는 내 손이 안 떨리더라고요. 그게 제일 무서웠어요.”',
    '심장이 한 박자 늦게 뛰었다. 사원증이 반납함에 떨어지던 그 가벼운 소리, 마주 앉아 있던 단정한 단발의 여자. 얼굴을 보지 않으려 했던 그 얼굴.',
    '“변명은 안 할게요. 다만 하나만 말할게요. 그날 퇴근길에, 나는 처음으로 내 서명이 무서워서 울었어요. 이 약을 마신 건 그 다음 주예요.”',
   ],
   text:S => `마흔의 나를 잘랐던 사람이 지금, 스물여섯의 얼굴로 눈을 피하지 않고 앉아 있다. 그녀는 답을 기다리지 않는다는 듯 컵만 만지작거린다. 이 사실을 어떻게 할까?`,
   choices:[
    {label:'“그날 그 서류, 나도 아직 가지고 있어요.”라고 말하고 용서를 시작한다', sub:'하린 관계 +3 · 스트레스 -5 · 나 +2', run:S => { const ch = []; rivalMood(S, 3, ch); fx(S, {stress:-5, self:2, bond:1.5}, ch); return {text:'하린은 고개를 숙였고, 어깨가 오래 들썩였다. 용서가 한 번에 끝나는 건 아니었다. 그래도 마흔의 그날 이후 처음으로, 그 서류가 조금 가벼워진 것 같았다.', chips:ch, mood:'sad'}; }},
    {label:'용서하지 않는다고 분명히 말한다', sub:'하린 관계 -2 · 나 +2 · 스트레스 +3', run:S => { const ch = []; rivalMood(S, -2, ch); fx(S, {self:2, stress:3, neg:1}, ch); return {text:'“이해해요.”라고 하린은 말했다. 그 말이 오히려 더 아팠다. 용서하지 않을 권리가 내게 있다는 걸 확인하고 나니, 후련함과 허전함이 같이 왔다.', chips:ch, mood:'serious'}; }},
    {label:'아직은 아무것도 대답하지 못한다고 한다', sub:'스트레스 +2 · 통찰 +2', run:S => { const ch = []; rivalMood(S, 1, ch); fx(S, {stress:2, ins:2, self:1}, ch); return {text:'“시간이 필요해요. 그리고 하린 씨도.” 하린은 천천히 고개를 끄덕였다. 식은 커피 두 잔이 테이블 위에서 같은 온도가 되어 가고 있었다.', chips:ch, mood:'tender'}; }},
   ]},

  {id:'st_8_3', m:91, exp:5, speaker:RIVAL, img:'art/rival_harin.webp', face:'harin', place:'campus', title:'빌린 인생의 충돌',
   beats:[
    '업계 컨퍼런스. 하린이 무대에서 완벽한 발표를 마쳤다. 투자 흐름을 거의 예언하듯 짚어 낸 자료에 객석이 술렁였다.',
    '“저건 예측이 아니라 기억이에요.” 나는 속으로 중얼거렸다. 그녀는 미래를 아낌없이 쓰고 있었다.',
    '쉬는 시간, 복도에서 마주쳤다. “같이 갈 수도 있어요, 우린. 수익도 나눠요.” 그녀의 눈은 이미 다음 판을 보고 있었다.',
    '“그런데 이대로면 소연 씨 회사는 내년에 정리돼요. 알죠? 나도 기억해요. 근데 내 계획엔 그게 필요해요.”',
   ],
   text:S => `하린의 방식은 효율적이지만, 누군가의 자리가 계획에서 지워진다. 나는 같은 기억을 가진 유일한 사람 앞에서 선택해야 한다.`,
   choices:[
    {label:'정면으로 반대한다. “그렇게 이긴 인생은 남의 것이에요.”', sub:'하린 관계 -2 · 나 +3 · 일 -1', run:S => { const ch = []; rivalMood(S, -2, ch); fx(S, {self:3, work:-1, neg:1.5}, ch); return {text:'하린의 눈빛이 얼음처럼 가라앉았다. “이상주의는 늘 비싸요.” 그녀는 돌아섰다. 복도 끝에서 구두 소리가 또렷이 멀어졌다. 나는 처음으로, 내 선택에 값을 치를 각오가 섰다.', chips:ch, mood:'serious'}; }},
    {label:'일단 협상한다. 소연의 회사를 건드리지 않는 조건으로', sub:'협상 +2 · 하린 관계 +1 · 선명도 -3', run:S => { S.borrowed = (S.borrowed || 0) + 1; const ch = []; rivalMood(S, 1, ch); fx(S, {neg:2, clarity:-3, ins:1}, ch); return {text:'“조건부 동맹, 나쁘지 않네요.” 하린이 처음으로 웃었다. 하지만 서명하는 순간 알았다. 나도 이제 미래를 거래의 도구로 쓰고 있다는 것을.', chips:ch, mood:'happy'}; }},
    {label:'아무 대답도 하지 않고 그 자리를 떠난다', sub:'스트레스 -2 · 자금 +0', run:S => { const ch = []; fx(S, {stress:-2, self:1, ins:1.5}, ch); return {text:'복도의 형광등이 눈부셨다. 나는 대답 대신 걸었다. 도망일 수도 있고 숨 고르기일 수도 있다. 어쨌든 올해 안에는 답을 내야 한다는 것만은 분명했다.', chips:ch, mood:'sad'}; }},
   ]},

  {id:'st_8_4', m:94, exp:3, speaker:GRANDMA, img:'art/grandma.webp', place:'shop', title:'여덟 번째 조각',
   beats:[
    '꿈속의 약방. 모래시계는 어느새 윗칸이 절반 이하로 줄어 있었다.',
    '“하린이도 왔다 갔어요.” 할머니가 찻잔을 내려놓았다. “이 약은 한 번에 한 사람에게만 주는 게 아니에요. 같은 후회를 가진 사람이 여럿일 뿐.”',
    '“그 아이를 미워하지는 않아요?” 할머니의 눈이 나를 보았다. 대답하기 전에 나는 할머니 손등의 흉터를 보았다. 내 것과 똑같은 모양이었다.',
    '“미움은 시계를 빨리 돌려요. 조각 하나 줄게요. 필요한 만큼만 쓰세요.”',
   ],
   text:S => '할머니가 모래시계 아래에서 반짝이는 조각 하나를 건넸다. 나는 무엇을 먼저 말할까?',
   choices:[
    {label:'“하린 씨도 구해 줄 수 있나요?”', sub:'나 +2 · 하린 관계 +1', run:S => { const ch = []; givePiece(S, ch); rivalMood(S, 1, ch); fx(S, {self:2, ins:1.5, stress:-3}, ch); return {text:'“구해 주는 건 내 일이 아니에요. 곁에 서 주는 건 당신 일이고.” 할머니는 웃었다. 조각을 쥔 손바닥에 따뜻한 모래알이 박히는 것 같았다.', chips:ch}; }},
    {label:'“할머니도 누군가를 미워한 적 있죠?”', sub:'통찰 +2 · 진실 +1', run:S => { const ch = []; givePiece(S, ch); SS(S).truth = Math.min(10, SS(S).truth + 1); fx(S, {ins:2, stress:-2}, ch); return {text:'“가장 오래 미워한 건 나 자신이었어요.” 그 말은 대답이라기보다 고백 같았다. 눈을 뜨자 베갯잇이 젖어 있었다.', chips:ch}; }},
   ]},

  // ───────── 9장 : 정산 (2024) ─────────
  {id:'st_9_1', m:96, exp:6, speaker:RIVAL, img:'art/rival_harin.webp', face:'harin', place:'night', title:'하린의 제안',
   beats:[
    '새해 첫 달, 하린이 밤늦게 연락해 왔다. 사무실 불이 꺼진 빌딩 옥상. 도시 불빛이 모래시계 속 모래처럼 흩어져 있었다.',
    '“남은 시간은 이 년이 안 돼요. 서른 되는 날, 시계가 정말 누구 건지 정해진다고 들었어요. 나는 이기고 싶어요.”',
    '“같이 하거나, 막거나. 중간은 없어요. 이 년 동안 서로를 모른 척하는 건 우리 둘 다 못 해요.”',
    '그녀는 내 눈을 똑바로 보았다. 마흔의 그날, 차갑게 서류를 밀던 눈. 지금은 어딘가 불안하게 흔들린다.',
   ],
   text:S => rivalState(S) === 'ally' ? '지난 시간 동안 쌓인 신뢰가 손끝에 느껴진다. 그래도 한 번 더 확인해야 한다. 정말 같이 가는가.' : rivalState(S) === 'enemy' ? '쌓인 앙금이 목구멍까지 올라온다. 하지만 그녀는 지금 손을 내밀고 있다.' : '관계는 아직 어느 쪽으로도 기울지 않았다. 지금 내 한마디가 방향을 정한다.',
   choices:[
    {label:'손을 잡는다. 같이 시계의 끝을 보자', sub:'동맹 · 하린 관계 +3 · 스트레스 -4', run:S => { SF(S).harinAlly = true; delete SF(S).harinEnemy; const ch = []; rivalMood(S, 3, ch); fx(S, {bond:3, stress:-4, self:1.5}, ch); return {text:'하린의 손은 차가웠고 조금 떨렸다. “후회하게 만들지 않을게요.” “나도요.” 도시 불빛 아래에서 두 사람이 같은 약을 먹은 이유가 처음으로 같은 방향을 향했다.', chips:ch, mood:'happy'}; }},
    {label:'그 손을 거절한다. 나는 내 방식대로 간다', sub:'적대 · 하린 관계 -4 · 나 +3', run:S => { SF(S).harinEnemy = true; delete SF(S).harinAlly; const ch = []; rivalMood(S, -4, ch); fx(S, {self:3, stress:3, neg:1}, ch); return {text:'하린의 입술이 떨렸다가 곧 단단해졌다. “좋아요. 그럼 마지막 날 이 옥상에서 봐요.” 라이벌이라는 단어가 이번에는 진짜 칼날 같은 무게로 남았다.', chips:ch, mood:'serious'}; }},
    {label:'답을 보류한다. 둘 중 어느 것도 아닌 길을 찾는다', sub:'중립 · 통찰 +2 · 스트레스 +2', run:S => { const ch = []; fx(S, {ins:2, stress:2, sense:1}, ch); return {text:'“겁쟁이.” 하린이 그렇게 말했지만 목소리는 이상하게 부드러웠다. “사흘 줄게요.” 나는 도시 불빛을 한참 보다가, 사흘이 아니라 이 년이 걸릴 질문이라는 것을 알았다.', chips:ch, mood:'surprised'}; }},
   ]},

  {id:'st_9_2', m:99, exp:6, speaker:'', img:'art/bg_office.webp', place:'room', title:'빌린 인생의 청구서',
   beats:[
    '책상 위에 노트가 펼쳐져 있다. 그동안 미래 지식으로 얻은 것들의 목록. 주식 흐름, 사건, 사람들의 불행, 면접 질문.',
    '글자 하나하나가 영수증처럼 보였다. 그 대가를 치른 사람은 누구인가.',
    '노트 맨 아래에 할머니의 필체로 한 줄이 적혀 있었다. 「빌린 건 갚아야 시계가 가벼워진다.」',
   ],
   text:S => { const b = S.borrowed || 0; return b >= 3 ? `빌린 인생이 ${b}번. 깨끗하다고 말하기엔 많이 썼다. 선명도는 ${Math.round(S.clarity)}. 갚으려면 무엇인가를 내놓아야 한다.` : b >= 1 ? `빌린 인생이 ${b}번. 많지 않지만 분명 있었다. 지금이라도 정리할 수 있다.` : '거의 빌린 적이 없다. 그래도 마음 한구석의 장부는 가볍지 않다.'; },
   choices:[
    {label:'갚는다. 이익의 일부를 기부하고 관련된 사람들에게 사과한다', sub:'자금 -40 · 학식·스킬 -1 · 마음의 빚 청산', run:S => { SF(S).borrowedPaid = true; const ch = []; fx(S, {cash:-40, know:-1, skill:-1, self:4, stress:-6, clarity:6}, ch); return {text:'사과를 받은 사람들은 대체로 어리둥절해했다. 한 사람은 화를 냈고 한 사람은 울었다. 통장은 가벼워졌지만 오랜만에 뒤통수의 서늘함이 사라졌다. 모래시계 아랫칸이 한 칸 더 깨끗해진 기분이었다.', chips:ch}; }},
    {label:'일부만 갚는다. 직접 피해를 본 사람에게만', sub:'자금 -15 · 나 +2 · 선명도 +2', run:S => { const ch = []; fx(S, {cash:-15, self:2, stress:-2, clarity:2, bond:1}, ch); return {text:'가장 아팠던 이름 둘에게만 찾아갔다. 변명 같은 말이 입 안에서 맴돌았지만 결국 “미안해요.” 한마디만 했다. 장부의 절반은 닫혔고 절반은 열려 있다.', chips:ch}; }},
    {label:'갚지 않는다. 이긴 사람이 쓴 것이라고 정리한다', sub:'스트레스 +5 · 일 +2 · 선명도 -3', run:S => { S.borrowed = (S.borrowed || 0) + 1; const ch = []; fx(S, {work:2, stress:5, clarity:-3, dare:1}, ch); return {text:'노트를 덮었다. 이긴 사람이 쓴 것이다. 그렇게 정리했지만 그날 밤 꿈에는 이름 모를 사람들이 줄지어 서 있었다. 이 선택의 값은 서른이 가까워질수록 더 선명해질 것이다.', chips:ch}; }},
   ]},

  {id:'st_9_3', m:102, exp:5, speaker:RIVAL, img:'art/rival_harin.webp', face:'harin', place:'night', title:'마감 전의 밤',
   beats:[
    '같은 프로젝트의 마감 전날, 하린과 나는 같은 층에 남아 있었다.',
    '사무실의 불은 우리 두 자리만 켜져 있었다. 캔커피가 식는 소리까지 들릴 만큼 조용했다.',
    '유리 벽 너머의 그녀는 오늘도 아무것도 먹지 않았다. 모니터의 불빛만이 그녀의 뺨을 푸르게 물들였다.',
    '내가 가진 마지막 선택은 하나였다. 이 자료를 보여 줄 것인가.',
   ],
   text:S => SF(S).harinAlly ? '하린은 동맹으로서 옆에 있다. 오늘 밤 자료를 열어 보여 주면 우리는 함께 이긴다. 다만 내 몫은 줄어든다.' : SF(S).harinEnemy ? '하린은 경쟁자로서 맞은편에 있다. 그녀의 실수를 알려 주지 않으면 내가 앞선다. 알려 주면 그녀는 구제된다.' : '하린과의 관계는 아직 정해지지 않았다. 오늘 밤 한 줄의 자료가 방향을 정한다.',
   choices:[
    {label:'자료를 공유한다. 함께 마감한다', sub:'일 +1 · 하린 관계 +2 · 자금 -5', run:S => { const ch = []; rivalMood(S, 2, ch); fx(S, {work:1, cash:-5, bond:2.5, stress:-2}, ch); return {text:'새벽 네 시, 편의점 삼각김밥 두 개를 나눠 먹었다. 하린이 “맛없다”라고 말하면서 하나를 더 집었다. 성과는 반반이었지만 그 밤의 기억은 훨씬 더 오래갈 것이다.', chips:ch, mood:'happy'}; }},
    {label:'조용히 내 몫만 챙기고 먼저 제출한다', sub:'일 +3 · 하린 관계 -2 · 스트레스 +3', run:S => { const ch = []; rivalMood(S, -2, ch); fx(S, {work:3, stress:3, neg:1}, ch); return {text:'1등이었다. 상사의 칭찬은 달았고, 퇴근길 엘리베이터는 말이 없었다. 하린은 내 이름 옆에서 아무 표정도 짓지 않았다. 이긴 기분이 이렇게 짠 적은 처음이다.', chips:ch, mood:'sad'}; }},
    {label:'일부러 한 줄을 흘려 하린이 스스로 찾게 한다', sub:'통찰 +1.5 · 하린 관계 +1', run:S => { const ch = []; rivalMood(S, 1, ch); fx(S, {ins:1.5, work:1.5, stress:1}, ch); return {text:'모니터를 닦는 척하며 오류 표시 한 칸을 가린 손수건을 치웠다. 하린이 흘끗 보고 아무 말 없이 고쳤다. 눈이 마주쳤고, 둘 다 모른 척했다. 이런 식의 호의가 서로에게는 제일 편했다.', chips:ch, mood:'shy'}; }},
   ]},

  {id:'st_9_4', m:106, exp:1, speaker:GRANDMA, img:'art/grandma.webp', place:'shop', title:'할머니의 진짜 이야기',
   beats:[
    '약방의 모래시계는 거의 바닥을 보이고 있었다. 할머니는 오늘따라 차를 따르지 않았다.',
    '“오늘은 옛날이야기를 하나 할게요. 어떤 여자가 있었어요. 마흔에 모든 걸 잃었고, 스무 살로 돌아가는 약을 얻었죠.”',
    '“그 여자는 십 년 동안 완벽하게 이겼어요. 일도, 돈도, 이름도. 그런데 서른이 되던 날 문득 알았어요. 그 십 년 동안 한 번도 제대로 웃은 적이 없다는 걸.”',
    '“그 여자는 소중한 사람을 잃었고, 약을 다시 구하려다 시간을 다 써 버렸어요. 그리고 일흔이 되어서야 이 약방에 앉아 같은 후회를 가진 누군가를 기다리게 됐죠.”',
    '할머니의 손등에서 오래된 흉터가 희미하게 빛났다. 나는 그 흉터를 알고 있었다. 내 손등에도 있는 것이다.',
   ],
   text:S => '이야기를 끝낸 할머니는 모래시계를 한 번 뒤집었다. 질문은 이미 정해져 있었다. 나는 무엇이라고 말할까?',
   choices:[
    {label:'“그 여자는 지금 어디 있나요?”라고 조용히 묻는다', sub:'진실 · 시계 조각 · 나 +2', run:S => { SF(S).grannyTruth = true; SS(S).truth = Math.min(10, SS(S).truth + 3); const ch = []; givePiece(S, ch); fx(S, {self:2, ins:2, stress:-3}, ch); return {text:'할머니는 대답 없이 찻잔을 건넸다. 잔 가장자리의 금이 내 컵의 금과 똑같았다. “다음에 오면 알려 줄게요. 오늘은 조각만.” 눈을 떴을 때 심장이 천천히, 아주 크게 뛰고 있었다.', chips:ch}; }},
    {label:'“그 여자가 후회한 것을 저는 하지 않을게요.”라고 말한다', sub:'진실 · 시계 조각 · 일 +1 · 관계 +1', run:S => { SF(S).grannyTruth = true; SS(S).truth = Math.min(10, SS(S).truth + 3); const ch = []; givePiece(S, ch); fx(S, {work:1, bond:1.5, self:1.5, stress:-2}, ch); return {text:'“그 약속은 지키기 어려워요.” 할머니는 눈가가 젖은 채로 웃었다. “그래서 고맙고요.” 다음 날 아침, 나는 일부러 느리게 아침을 먹었다.', chips:ch}; }},
    {label:'아무 말 없이 할머니의 손을 잡는다', sub:'진실 · 시계 조각 · 스트레스 -6', run:S => { SF(S).grannyTruth = true; SS(S).truth = Math.min(10, SS(S).truth + 3); const ch = []; givePiece(S, ch); fx(S, {stress:-6, self:3, hp:2}, ch); return {text:'할머니의 손은 가늘고 따뜻했다. 마흔의 어느 날 엄마가 쥐어 주던 손과 같은 온도였다. 모래시계는 아무 소리도 내지 않고 흘러내렸다.', chips:ch}; }},
   ]},

  // ───────── 10장 : 서른의 시계 (2025.3 ~ 2026.2) ─────────
  {id:'st_10_1', m:108, exp:6, speaker:'엄마', img:'art/mom.webp', place:'room', title:'엄마의 마지막 계절',
   beats:[
    '엄마와 마주 앉은 저녁. 식탁 위의 반찬이 예전보다 훨씬 간소했다.',
    '엄마의 손목은 여위었지만 웃음은 오히려 가벼웠다. 달력에는 내 서른 번째 생일에 동그라미가 쳐져 있었다.',
    '“너 서른 되기 전에 엄마한테 말 못 한 거 있지?” 엄마는 웃으며 밥을 한 숟갈 떠 주었다.',
    '마흔의 나는 엄마의 서른넷을 지키지 못했다. 지금의 나는 그 시간 앞에 서 있다.',
   ],
   text:S => {
     const st = hm(S), good = st >= 4 || SF(S).momEarly || SF(S).momLeave || st <= 1;
     return good ? '엄마는 이제 많이 회복되었다. 시간은 선물처럼 남아 있다. 이 마지막 해를 어떻게 쓸까?' : '엄마의 병세가 가볍지 않다. 의사의 말은 신중했다. 지금 내가 할 수 있는 일은 많지 않다. 그러나 없는 것은 아니다.';
   },
   choices:[
    {label:'일주일을 비워 엄마와 여행을 떠난다', sub:'엄마와 마지막 시간 · 자금 -30 · 일 -1', run:S => {
      SF(S).momLastTime = true;
      const good = hm(S) >= 4 || SF(S).momEarly || SF(S).momLeave || hm(S) <= 1;
      const ch = []; fx(S, {cash:-30, work:-1, bond:4, stress:-8, hp:2, self:2}, ch);
      if(good){ if(hm(S) >= 2) SS(S).momStage = 4; return {text:'바다를 보러 갔다. 엄마는 모래사장에서 신발을 벗고 조개껍데기를 줍다가 갑자기 나를 보며 말했다. “이번엔 네가 곁에 있구나.” 기억 속의 엄마는 늘 병원 침대 위였는데, 오늘은 바람에 머리카락을 날리고 있었다.', chips:ch}; }
      SS(S).momStage = 5;
      return {text:'바다를 보러 갔다. 엄마는 오래 걷지 못하고 의자에 앉아 한참 파도를 보았다. “좋다. 이만하면 됐다.” 나는 괜찮다는 말도, 아니라는 말도 하지 못하고 엄마의 손을 놓지 않았다. 이 시간은 끝나더라도 지워지지 않을 것이다.', chips:ch}; }},
    {label:'최선의 치료를 위해 큰 비용을 쓴다', sub:'자금 -80 · 스트레스 +3 · 엄마 단계 변화', run:S => {
      const ch = []; const enough = S.cash >= 80;
      fx(S, {cash:-80, stress:3, bond:2}, ch);
      if(hm(S) >= 2 && hm(S) < 4 && enough) SS(S).momStage = 4;
      else if(hm(S) >= 2 && hm(S) < 4) SS(S).momStage = 5;
      return {text:enough ? '추가 치료는 길었고 비용은 만만치 않았다. 하지만 어느 날 의사가 차트를 덮으며 말했다. “경과가 좋습니다.” 엄마는 병실 창문에 이마를 대고 한참 웃었다.' : '비용이 모자라 치료를 이어 가기 어려웠다. 병원 복도에서 한참 전화기를 쥐고 있었다. 이번에도 돈보다 시간이 더 부족했다.', chips:ch}; }},
    {label:'일상을 지키며 평소처럼 곁에 있는다', sub:'엄마와 평온한 시간 · 스트레스 -4', run:S => { const ch = []; fx(S, {bond:2.5, stress:-4, self:1.5}, ch); if(hm(S) >= 2 && hm(S) < 4 && (SF(S).momEarly || SF(S).momLeave)) SS(S).momStage = 4; return {text:'특별한 일 없이 저녁을 먹고 같이 드라마를 보았다. 엄마가 졸다가 내 어깨에 기댔다. 마흔의 나는 이런 평범한 시간이 가장 비싸다는 것을 몰랐다.', chips:ch}; }},
   ]},

  {id:'st_10_2', m:112, exp:5, speaker:RIVAL, img:'art/rival_harin.webp', face:'harin', place:'rain', title:'하린의 마지막 선택',
   beats:[
    '다시 비가 내리는 날, 하린이 나를 불러냈다. 그 골목 끝, 간판 없는 가게 앞이었다.',
    '약방은 닫혀 있었다. 대신 문틈으로 호박색 빛이 가늘게 새어 나왔다. 하린은 우산을 쓰지 않았다.',
    '“어젯밤에 조각을 세어 봤어요. 하나가 모자라요. 아니, 하나가 남는 건지도 모르겠고요.” 그녀의 목소리는 빗소리에 젖어 있었다.',
    '“나는 이 시계를 갖고 싶어요. 그런데 가지려면 누군가의 몫을 빼앗아야 하는 건가요?”',
   ],
   text:S => rivalState(S) === 'ally' || SF(S).harinAlly ? '동맹이었던 하린이 흔들리고 있다. 시계의 끝에서 그녀는 홀로 서 있다. 나는 곁에 설 수 있을까.' : rivalState(S) === 'enemy' || SF(S).harinEnemy ? '적이었던 하린이 처음으로 내게 도움을 청하고 있다. 이 순간을 어떻게 쓸 것인가.' : '어느 쪽에도 속하지 않았던 하린이 기댈 곳을 찾고 있다. 나는 한 걸음 내디딜 수 있다.',
   choices:[
    {label:'“같이 쓰자. 시계를 나눌 수 있을 거야.”', sub:'하린 관계 +3 · 나 +2 · 일 -1', run:S => { const ch = []; rivalMood(S, 3, ch); fx(S, {bond:3, self:2, work:-1, stress:-3}, ch); return {text:'하린은 한참 숨을 고르다 웃었다. “멍청한 소리네요. 그런데 마흔 이후로 제일 듣고 싶던 소리예요.” 빗물 때문인지 눈물 때문인지, 그녀의 뺨이 젖어 있었다.', chips:ch, mood:'tender'}; }},
    {label:'“선택은 각자 하는 거야. 나는 내 것을 가질게.”', sub:'나 +3 · 하린 관계 -1', run:S => { const ch = []; rivalMood(S, -1, ch); fx(S, {self:3, work:1, stress:1}, ch); return {text:'“…알았어요.” 하린은 우산을 펴고 돌아섰다. 걸음이 조금 느렸다. 서로의 길이 다름을 인정하는 건 외롭지만 정직했다.', chips:ch, mood:'serious'}; }},
    {label:'아무 말 없이 우산을 씌워 준다', sub:'하린 관계 +2 · 스트레스 -2', run:S => { const ch = []; rivalMood(S, 2, ch); fx(S, {bond:1.5, stress:-2, self:1}, ch); return {text:'우산 하나 아래서 둘은 한 걸음씩 걸었다. 하린이 낮게 말했다. “마흔의 나는 이렇게 걸어 본 적이 없어요.” 나는 대답 대신 우산을 조금 더 기울였다.', chips:ch, mood:'shy'}; }},
   ]},

  {id:'st_10_3', m:116, exp:2, speaker:GRANDMA, img:'art/grandma.webp', place:'shop', title:'서른 전날의 약방',
   beats:[
    '꿈이 아닌 듯 선명한 약방. 모래시계의 마지막 모래알이 천천히 떨어지고 있었다.',
    '“이제 내일이에요. 서른이 되는 날.” 할머니는 오늘 처음으로 서 있었다. 허리는 곧고, 눈은 맑았다.',
    '“조각이 몇 개인지는 중요하지 않아요. 몇 개를 제대로 쥐고 왔는지가 중요하죠.” 할머니가 내 손바닥을 펼쳐 보았다.',
   ],
   text:S => { const p = SS(S).pieces; return p >= 8 ? '시계 조각이 거의 다 모였다. 할머니는 오래 숨겨 온 이야기를 꺼내려 한다.' : p >= 5 ? '조각은 절반 이상 모였다. 할머니는 아직 말을 고르고 있다.' : '조각이 많지 않다. 할머니의 시선이 조금 안타깝다.'; },
   choices:[
    {label:'조용히 듣는다. 할머니가 말하는 만큼만', sub:'진실 · 시계 조각', run:S => {
      const ch = []; const p = SS(S).pieces; givePiece(S, ch);
      if(p >= 8){ SF(S).grannyTruth = true; SS(S).truth = 10; fx(S, {self:4, stress:-6, ins:2}, ch); return {text:'“나는 일흔의 서윤이에요. 당신이 지금 걷는 이 길을 한 번 걸었고, 실패했어요. 이 시계는 내 마지막 시계고, 당신은 내 마지막 기회예요.” 할머니의 목소리는 내 목소리와 똑같았다. 나는 울지 않으려 했지만, 그건 불가능했다.', chips:ch}; }
      if(p >= 5){ SS(S).truth = Math.max(SS(S).truth, 6); fx(S, {self:2, stress:-3, ins:1.5}, ch); return {text:'“나도 한때 실패했어요. 이 시계는 그 실패 끝에서 모은 것이에요.” 할머니는 거기까지만 말했다. 나머지는 내일의 내가 스스로 알아낼 것이라는 듯이. 그것으로 충분하다고 생각했다.', chips:ch}; }
      fx(S, {self:1, stress:-2}, ch); return {text:'“이 모래가 흐르는 동안 당신이 보낸 시간은 모두 소중했어요.” 할머니는 더 말하지 않았다. 아직 다 듣지 못한 이야기가 남았다는 감각만이 오래 남았다.', chips:ch}; }},
    {label:'“할머니가 누구인지, 이제 알 것 같아요.”', sub:'통찰 · 시계 조각 · 나 +3', run:S => {
      const ch = []; const p = SS(S).pieces; givePiece(S, ch);
      if(p >= 8){ SF(S).grannyTruth = true; SS(S).truth = 10; fx(S, {self:4, bond:2, stress:-6}, ch); return {text:'“그럼 말 안 해도 되겠네요.” 할머니가 웃었다. 우리는 한 개의 거울처럼 서로를 바라보았다. “고마워요. 내 마지막 십 년을 이렇게 살아 줘서.”', chips:ch}; }
      fx(S, {self:2, ins:2, stress:1}, ch); return {text:'할머니는 대답 대신 어깨를 으쓱했다. “아직은 몰라도 돼요.” 하지만 눈동자가 아주 조금 떨렸다. 알아 가는 중이라는 걸 서로가 알고 있었다.', chips:ch}; }},
    {label:'“할머니, 저 무서워요.”라고 솔직하게 말한다', sub:'스트레스 -6 · 나 +2', run:S => {
      const ch = []; givePiece(S, ch); fx(S, {stress:-6, self:2, hp:2}, ch);
      return {text:'“무서워도 되는 거예요. 무서운 사람만이 시계를 조심히 쓰거든요.” 할머니는 내 어깨를 감싸 안았다. 모래시계의 마지막 모래가 아주 천천히, 아주 조심스럽게 떨어졌다.', chips:ch}; }},
   ]},

  {id:'st_10_4', m:118, exp:1, speaker:GRANDMA, img:'art/grandma.webp', place:'shop', title:'시계의 마지막 쓰임',
   beats:[
    '서른 생일을 앞둔 마지막 달. 약방의 모래시계가 내 손바닥 위에서 따뜻하게 맥박 쳤다.',
    '“이제 정해야 해요. 이 시계를 어떻게 쓸지.” 할머니의 목소리가 모래알처럼 부드럽게 흩어졌다.',
    '“자유롭게 보내 줄 수도 있고, 곁에 둘 수도 있어요. 어느 쪽이든 후회는 있어요. 다만 후회의 모양이 달라질 뿐.”',
   ],
   text:S => { const p = SS(S).pieces; return `시계 조각 ${p}개가 손에서 반짝인다. 마지막 선택을 한다. 이 시계는 누구의 것이어야 할까?`; },
   choices:[
    {label:'시계를 놓아준다. 나는 지금의 삶을 믿는다', sub:'자유 · 스트레스 -8 · 나 +4', run:S => { SF(S).clockFree = true; delete SF(S).clockKeep; const ch = []; fx(S, {self:4, stress:-8, bond:2, hp:3}, ch); return {text:'모래시계를 창가에 놓았다. 모래가 조용히 사라지는 동안 나는 눈을 감지 않았다. 앞으로의 시간이 길게도, 짧게도 느껴졌다. 어느 쪽이든 이제 내 것이었다.', chips:ch}; }},
    {label:'시계를 곁에 둔다. 다음 사람을 위해 남겨 둔다', sub:'보존 · 통찰 +3 · 스트레스 +2', run:S => { SF(S).clockKeep = true; delete SF(S).clockFree; const ch = []; fx(S, {ins:3, self:2, stress:2, bond:1}, ch); return {text:'시계는 따뜻하고 조금 무거웠다. 누군가에게 이 시계가 필요한 날이 올 것이다. 어쩌면 그것이 할머니가 나에게 기다림으로 보여 준 마음이었을 것이다.', chips:ch}; }},
   ]},
  ];
})();

const CRISIS_EVENTS = [];
