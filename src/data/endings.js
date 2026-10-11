// 엔딩 판정과 텍스트 (ENGINE 구간 안, DOM 금지)
const FREE_MIN = 50, FREE_SUM = 192;

// 빌린 인생 / 되풀이된 결혼 같은 보정을 반영한 최종 3축
function finalPillars(S){
  const w = S.work - Math.min(32, S.borrowed * 2.8);
  let b = S.bond; const j = S.love.jaewoo;
  if(S.partner === 'jaewoo' && j && !j.fixed) b -= 18;
  return {work:clamp(w, 0, 100), bond:clamp(b, 0, 100), self:S.self};
}
function isFree(P){ return P.work >= FREE_MIN && P.bond >= FREE_MIN && P.self >= FREE_MIN && (P.work + P.bond + P.self) >= FREE_SUM; }

const loverOf = S => S.partner && S.love[S.partner] && S.love[S.partner].stage >= 1 && !(S.secret && S.secret[S.partner]) ? S.partner : null;
const exLovers = S => Object.keys(S.love).filter(i => S.love[i].stage === -9).length;
function computeEnding(S){
  if(S.ending) return S.ending;
  const P = finalPillars(S), raw = {work:S.work, bond:S.bond, self:S.self};
  const lov = loverOf(S), secretNow = Object.keys(S.secret || {}).some(i => S.secret[i] && S.love[i] && S.love[i].stage >= 1);
  if(isFree(P)){
    if(S.divorced && !S.married) return 'free_divorced';
    if(S.married && P.bond >= 62) return 'free_wedding';
    if(lov && P.bond >= 58) return 'free_love_' + lov;
    if(secretNow) return 'free_secret';
    if(S.hired && (S.rank || 0) >= 3 && !inLawSchool(S)) return 'free_exec';
    if((S.switched || 0) >= 1 && S.hired) return 'free_hopper';
    if(S.cash >= 1500) return 'free_rich';
    if(CAREERS[S.track] && S.hired && P.work >= 62 && !inLawSchool(S)) return 'free_' + S.track;
    if((S.engaged || S.married) && P.bond >= 70) return 'free_home';
    if(Object.keys(S.love).filter(i => S.love[i].aff >= 40 && S.love[i].stage !== -9).length >= 3) return 'free_many';
    if(!S.partner && !S.married && P.self >= 60) return 'free_single';
    if(S.st.know >= 68) return 'free_scholar';
    if(S.st.charm >= 62) return 'free_charm';
    if(S.st.dare >= 55) return 'free_dare';
    if(S.st.ins >= 62) return 'free_ins';
    if(P.self >= 75) return 'free_soul';
    return 'free_balance';
  }
  if(isFree(raw)) return 'ret_borrowed'; // 겉보기엔 통과했지만 빌린 인생이었다
  const lowest = Object.keys(P).sort((a, b) => P[a] - P[b])[0];
  if(P.work < 35 && P.bond < 35 && P.self < 35) return 'ret_all';
  if(S.lastDisc != null && P.bond < 50) return 'ret_exposed';
  if(S.divorced) return 'ret_divorce';
  if(exLovers(S) >= 3 && P.bond < 55) return 'ret_breakups';
  if(S.married && P.bond < 50) return 'ret_cold';
  if(S.stress >= 85) return 'ret_burnout';
  if(S.cash >= 1500) return 'ret_rich';
  if(!S.hired && S.m >= 60) return 'ret_nojob';
  if((S.switched || 0) >= 2) return 'ret_hopper';
  if(P.work >= 68 && P.bond < 50 && P.self < 50) return 'ret_workaholic';
  if(S.st.know >= 68) return 'ret_bookish';
  return 'ret_' + lowest;
}

const ENDINGS = {
  free_beauty: {free:true, icon:'💄', title:'브랜드를 만드는 사람', sub:'자유 시계 · 뷰티 마케터',
    letter:`서른 살의 ${'{name}'}에게.\n\n루미에르 코스메틱의 신제품 캠페인에서 네 이름이 가장 먼저 불린다는 소식을 들었어. 마흔의 우리는 한 번도 브랜드의 얼굴이 되어 본 적이 없지. 사람의 하루에 작은 설렘을 건네는 일을 네가 해냈구나.\n\n시계는 이제 네 것이다.`},
  free_pd: {free:true, icon:'🎥', title:'현장을 움직이는 사람', sub:'자유 시계 · 프로덕션 PD',
    letter:`서른 살의 ${'{name}'}에게.\n\n촬영장에서 백 명의 이름을 외우던 그 눈빛이 아직도 선해. 폭우 속에서도 컷을 외치던 너를 보며 생각했어. 마흔의 우리는 이렇게 큰 판을 움직여 본 적이 없었다고.\n\n시계는 이제 네 것이다. 오늘 밤 촬영은 일찍 끝내렴.`},
  free_writer: {free:true, icon:'✍️', title:'이야기를 쓰는 사람', sub:'자유 시계 · 드라마 작가',
    letter:`서른 살의 ${'{name}'}에게.\n\n네가 쓴 한 줄 때문에 누군가가 밤새 울었대. 마흔의 우리가 쓰고 싶어서 서랍 속에 넣어 두었던 이야기들이 이제 화면 속에 살아 있어. 마감의 밤들이 헛되지 않았구나.\n\n시계는 이제 네 것이다.`},
  free_actor: {free:true, icon:'🌟', title:'스크린 속의 나', sub:'자유 시계 · 연예인',
    letter:`서른 살의 ${'{name}'}에게.\n\n카메라 앞에서 눈을 반짝이는 네 모습을 보며 오래 웃었어. 마흔의 우리는 누가 보지 않는 곳에서 늘 숨죽이고 살았잖아. 이제 너는 보이는 사람이 되었구나. 그래도 가끔은 아무도 보지 않는 곳에서 쉬어 가렴.\n\n시계는 이제 네 것이다.`},
  free_lawyer: {free:true, icon:'⚖️', title:'원칙을 지키는 사람', sub:'자유 시계 · 로펌 변호사',
    letter:`서른 살의 ${'{name}'}에게.\n\n눈을 감으라는 유혹 앞에서 눈을 뜨고 서 있었던 네가 자랑스러워. 누군가의 가장 힘든 날을 함께 견디는 일이 얼마나 무거운지 알면서도, 너는 그 자리에 섰구나.\n\n시계는 이제 네 것이다.`},
  free_dev: {free:true, icon:'🖥️', title:'세상을 만드는 사람', sub:'자유 시계 · IT 개발자',
    letter:`서른 살의 ${'{name}'}에게.\n\n네가 만든 서비스를 지금 수십만 명이 쓰고 있어. 아는 미래를 따르지 않고 밤새 코드를 쳤던 그 새벽들이 모두 여기에 쌓였구나. 이건 온전히 네 것이다.\n\n시계도 이제 네 것이다.`},
  free_designer: {free:true, icon:'👗', title:'계절을 먼저 말하는 사람', sub:'자유 시계 · 패션 디자이너',
    letter:`서른 살의 ${'{name}'}에게.\n\n네 컬렉션이 무대에 오르던 날, 객석에서 숨을 죽이고 있었어. 마흔의 우리는 늘 옷을 고르며 남의 시선을 신경 썼지. 이제 너는 남이 입고 싶은 옷을 만드는구나.\n\n시계는 이제 네 것이다.`},
  free_director: {free:true, icon:'🎬', title:'끝까지 책임지는 사람', sub:'자유 시계 · 영화감독',
    letter:`서른 살의 ${'{name}'}에게.\n\n레디, 액션. 네 목소리가 현장을 가르던 날 객석 맨 뒤에서 오래 앉아 있었어. 조연출 시절 남의 컷을 메우던 손이 이제는 한 편의 영화를 끝까지 이끄는구나. 마흔의 우리는 한 번도 크레딧 맨 뒤에 이름을 올려 본 적이 없었지.\n\n시계는 이제 네 것이다.`},
  free_stylist: {free:true, icon:'💇', title:'이미지를 바꾸는 사람', sub:'자유 시계 · 스타일리스트',
    letter:`서른 살의 ${'{name}'}에게.\n\n레드카펫 앞에서 마지막 매무새를 만져 주던 네 손을 봤어. 사람들은 옷을 입은 사람만 기억하지만, 그 사람을 빛나게 한 사람이 누구인지 나는 알아. 마흔의 우리는 늘 남의 시선 뒤에 숨었는데, 이제 너는 남이 빛나도록 돕는 사람이 되었구나.\n\n시계는 이제 네 것이다.`},
  free_brandceo: {free:true, icon:'🏷️', title:'내 이름을 건 브랜드', sub:'자유 시계 · 브랜드 대표',
    letter:`서른 살의 ${'{name}'}에게.\n\n포장 상자에 네 이름이 찍혀 있었어. 남의 브랜드를 키우던 사람이 이제 자기 브랜드의 첫 매장 문을 여는구나. 매출 그래프가 흔들리던 밤마다 네가 되뇌던 말을 기억해. “그래도 이건 내 거야.”\n\n시계는 이제 네 것이다.`},
  free_startup: {free:true, icon:'🚀', title:'작은 팀의 큰 꿈', sub:'자유 시계 · 스타트업 창업가',
    letter:`서른 살의 ${'{name}'}에게.\n\n투자 심사장에서 떨리던 손을 알아. 적자 속에서도 팀원들 월급날을 먼저 챙기던 너를 봤어. 마흔의 우리는 안정이라는 말에 숨었지만, 이제 너는 불확실함 위에 서서 웃는구나.\n\n시계는 이제 네 것이다.`},
  free_home: {free:true, icon:'💍', title:'함께 사는 사람', sub:'자유 시계 · 가정',
    letter:`서른 살의 ${'{name}'}에게.\n\n이번에는 도장이 아니라 손을 잡았구나. 같은 사람이든 다른 사람이든 중요하지 않아. 네가 이번엔 끝까지 서로를 보려 했다는 것이 중요해.\n\n시계는 이제 네 것이다. 오늘 저녁 메뉴 정도는 마음대로 골라도 좋아.`},
  free_soul: {free:true, icon:'🌿', title:'나를 아는 사람', sub:'자유 시계 · 내면',
    letter:`서른 살의 ${'{name}'}에게.\n\n화려하진 않아도, 너는 너를 가장 잘 아는 사람이 되었구나. 마흔의 우리가 가장 갖고 싶었던 것이 바로 그거였어. 이제 어떤 바람이 불어도 너는 돌아올 곳을 안다.\n\n시계는 네 것이다.`},
  free_balance: {free:true, icon:'⚖️', title:'균형 잡힌 삶', sub:'자유 시계 · 균형',
    letter:`서른 살의 ${'{name}'}에게.\n\n일도, 사람도, 너 자신도 한쪽으로 쏠리지 않은 채 여기까지 왔구나. 대단하지 않다고 할 수도 있지만, 마흔의 우리는 그걸 해내지 못했어. 평범함은 때로 가장 어려운 선물이야.\n\n시계는 이제 네 것이다.`},
  ret_work: {free:false, icon:'📉', title:'다시 사원증 앞에서', sub:'회귀 · 일의 실패',
    letter:`돌아온 ${'{name}'}에게.\n\n일은 쌓이지 않았고, 사람과 마음은 어느 정도 지켰지만 이력서는 여전히 비어 있었어. 마흔의 그 골목으로 돌아가야 하지만, 너는 이제 안다. 일이 전부는 아니라는 것과, 일도 나를 지켜 주진 않는다는 것을.\n\n한 번 더 해 볼래?`},
  ret_bond: {free:false, icon:'🥀', title:'혼자 남은 사람', sub:'회귀 · 관계의 실패',
    letter:`돌아온 ${'{name}'}에게.\n\n일에도 마음에도 충실했지만, 곁에 사람을 두는 법은 다시 배우지 못했구나. 마흔의 이혼 서류 앞에서 느꼈던 그 외로움이 똑같이 찾아왔지. 이번엔 이유를 알 거야.\n\n한 번 더 해 볼래?`},
  ret_self: {free:false, icon:'🌫️', title:'무너진 사람', sub:'회귀 · 마음의 실패',
    letter:`돌아온 ${'{name}'}에게.\n\n성과도 관계도 있었지만, 너는 끝내 너를 돌보지 못했어. 마흔의 우리가 무너졌던 이유가 일도 사람도 아니었다는 걸 이제 알겠지. 가장 늦게 챙긴 것이 가장 먼저 챙겼어야 할 것이었어.\n\n한 번 더 해 볼래?`},
  ret_borrowed: {free:false, icon:'⏳', title:'빌린 인생', sub:'회귀 · 미래 지식의 대가',
    letter:`돌아온 ${'{name}'}에게.\n\n숫자는 합격이었지만, 그 안의 많은 부분이 네가 만든 것이 아니었어. 미래를 알고 쌓은 것은 시계가 인정하지 않아. 아는 대로 움직이는 건 인생이 아니라 복사였으니까.\n\n이번엔 네 손으로 해 볼래?`},
  ret_debt: {free:false, icon:'💸', title:'멈춘 시계', sub:'회귀 · 파산',
    letter:`돌아온 ${'{name}'}에게.\n\n빚이 모든 걸 삼켰어. 시간을 되돌려도 돈 앞에서는 속수무책일 때가 있지. 다음엔 생활의 바닥을 먼저 단단히 다져 보자.\n\n한 번 더 해 볼래?`},
  ret_all: {free:false, icon:'🌧️', title:'다시, 비 오는 골목', sub:'회귀 · 모든 것의 부족',
    letter:`돌아온 ${'{name}'}에게.\n\n십 년은 짧고, 나는 너무 많이 헤맸지. 그래도 괜찮아. 스무 살로 돌아간 용기를 가진 사람은 한 번 더 돌아갈 용기도 있으니까.\n\n한 번 더 해 볼래?`},
};
// ── 확장 엔딩 ─────────────────────────────────────────────────
const L_ = (name, body) => `${'{name}'}에게.\n\n${body}`;
const LOVE_END = {
  jaewoo:   ['변한 사람 옆에서', '서재우', '“네 꿈도 내 꿈만큼 소중해.” 그가 이 문장을 입 밖에 내기까지 오래 걸렸지. 마흔의 우리가 끝내 하지 못한 말을 서른의 너희는 해냈어. 사람은 바뀔 수 있다는 걸, 너는 증명했단다.'],
  minjun:   ['오래된 친구의 어깨', '한민준', '입대하던 날 그가 쥐여 준 도시락이 서른의 식탁까지 이어졌구나. 말이 서툴러도 마음은 가장 먼저 도착하는 사람. 천천히 쌓인 믿음이 얼마나 단단한지 너희가 보여 줬어.'],
  hajin:    ['꿈이 소리 나는 사람과', '윤하진', '라면으로 끼니를 때우던 그가 이제 투자자 앞에서 네 이름을 먼저 말하는구나. 큰 꿈을 가진 사람 곁에서도 네 꿈이 지워지지 않았다는 게 가장 큰 성공이야.'],
  taeoh:    ['셔터 소리가 닿은 곳', '은태오', '길을 잃은 골목에서 시작된 인연이 서른의 전시장까지 이어졌네. 누군가 너를 가장 아름답게 기억해 준다는 건 꽤 오래 버티게 하는 힘이야.'],
  jihu:     ['엘리베이터 속 비밀이 공식이 되다', '한지후', '일 얘기를 안 하겠다던 약속은 어느새 퇴근 후의 식탁이 되었구나. 차분한 사람의 다정함은 오래 남아. 서로의 속도를 존중하는 연애를 해낸 걸 축하해.'],
  dohyun:   ['컷 소리 없는 일상', '차도현', '현장의 불이 꺼져도 둘이 나란히 걷는 길이 환하구나. 일과 사랑을 같은 속도로 달리는 법을 너희는 배웠어. 가끔은 NG가 나도 괜찮다는 것도.'],
  sian:     ['함께 쓰는 결말', '유시안', '그가 첫 줄을 쓰면 네가 마지막 줄을 완성하는 날들이네. 마흔의 너는 네 이야기를 쓸 사람이 없다고 믿었지만, 이제 이야기의 공동 저자가 생겼구나.'],
  seunghyun:['카메라 밖의 사람', '백승현', '스포트라이트가 꺼진 뒤에도 곁에 남는 사람. 연예계의 소란 속에서 서로를 지켜 낸 너희가 자랑스러워. 대본에 없는 해피엔딩이야.'],
  geonwoo:  ['이의 없음, 평생 약속', '최건우', '원칙만 따지던 사람이 네 앞에서만은 한 번도 반론하지 않는구나. 단단한 사람의 다정함은 한 번 믿으면 끝까지 가. 서른에 얻은 단단한 편이야.'],
  yuchan:   ['에러도 귀여운 사람', '이유찬', '서비스가 멈춰도, 마음이 멈춰도 같이 로그를 읽어 주는 사람이네. 밤샘 코드 사이로 네가 건넨 따뜻한 차가 그의 가장 좋은 업데이트였을 거야.'],
  ujin:     ['한 벌의 옷처럼 맞는 사람', '정우진', '네 손끝의 색이 좋다고 말하던 그가 서른의 네 옆에서 새 컬렉션을 준비하는구나. 서로의 취향을 존중하며 짜낸 시간이 가장 오래가는 옷이 되었어.'],
  raon:     ['무대 밖의 별', '강라온', '세상은 그를 아이돌이라 부르지만 너만은 라일락빛 머리의 청년으로 기억하지. 숨어서 만나던 시간이 공개된 날, 네가 얼마나 용기를 냈는지 알아. 별은 곁에 있을 때 가장 환해.'],
};
const EXT_ENDINGS = {
  free_divorced:{free:true, icon:'🕊️', title:'두 번째 자유', sub:'자유 시계 · 이혼 후의 서른', letter:L_('', '결혼도, 이혼도 겪은 서른이 되었구나. 마흔의 너는 끝내 도장을 찍지 못했는데, 이번엔 네가 먼저 선택했어. 실패가 아니라 정리였다는 걸 시계가 인정했단다. 이제는 누구의 꿈도 아닌 네 길을 걸어가렴.')},
  free_wedding:{free:true, icon:'💍', title:'함께 맞는 서른', sub:'자유 시계 · 결혼', letter:L_('', '서른의 너는 식탁 위에 두 사람의 달력을 올려놓았더구나. 서로의 꿈을 번갈아 세워 준 결혼이야. 마흔의 너는 희생이 사랑인 줄 알았지만, 이번엔 약속이 선택이었어. 행복하렴.')},
  free_secret:{free:true, icon:'🗝️', title:'비밀을 안은 시계', sub:'자유 시계 · 끝나지 않은 이야기', letter:L_('', '시계는 열렸지만 네 마음 한구석에는 아직 열지 못한 서랍이 있구나. 누군가에게 말하지 못한 관계가 서른의 너를 조금 외롭게 만들었어. 언젠가 그 서랍을 열 용기를 내길 바란다.')},
  free_exec:{free:true, icon:'🏆', title:'정상의 서른', sub:'자유 시계 · 최고 직급', letter:L_('', '십 년 만에 가장 높은 직급의 명찰을 달았구나. 승진 발표 날 떨리던 손을 기억하니. 마흔의 너는 늘 “다음에 하죠”라고 말했는데, 이번엔 “제가 하겠습니다”라고 말했지. 그 한마디가 너를 여기까지 데려왔어.')},
  free_hopper:{free:true, icon:'🧭', title:'내가 고른 두 번째 길', sub:'자유 시계 · 이직', letter:L_('', '첫 직장에서 멈추지 않고 다른 길로 걸어간 용기를 칭찬한다. 한 번의 선택이 평생을 결정하지 않는다는 걸 몸으로 배웠구나. 서른의 이름표는 네가 직접 고른 것이야.')},
  free_rich:{free:true, icon:'💰', title:'통장보다 시계', sub:'자유 시계 · 넉넉한 서른', letter:L_('', '넉넉한 통장을 가지고도 시간을 더 값지게 쓰는 사람이 되었구나. 돈은 도구일 뿐이라는 걸 아는 서른은 드물어. 이제는 그 풍요를 누군가와 나누는 법을 배우렴.')},
  free_scholar:{free:true, icon:'📚', title:'끝나지 않는 공부', sub:'자유 시계 · 학식의 서른', letter:L_('', '장학금을 받던 도서관의 밤이 서른의 단단한 지식이 되었구나. 아는 것이 많다는 건 선택지가 많다는 뜻이야. 마흔의 너는 늘 아는 것이 부족해서 겁냈는데, 이제는 아는 것으로 두려움을 넘는구나.')},
  free_charm:{free:true, icon:'✨', title:'모두가 건네는 인사', sub:'자유 시계 · 매력의 서른', letter:L_('', '사람들이 먼저 인사를 건네는 서른이 되었구나. 웃음과 말투가 어느새 너의 자산이 되었어. 매력은 만들어지는 것이 아니라 쌓이는 것이라는 걸 너는 알게 되었단다.')},
  free_dare:{free:true, icon:'🔥', title:'망설임을 이긴 사람', sub:'자유 시계 · 도전의 서른', letter:L_('', '망설이다 놓친 기회들을 마흔의 너는 얼마나 후회했니. 이번에는 먼저 손을 들었어. 실패한 도전도 많았지만 도전하지 않은 후회보다는 훨씬 가벼웠지. 앞으로도 계속 뛰어들렴.')},
  free_ins:{free:true, icon:'🔭', title:'먼저 보는 눈', sub:'자유 시계 · 통찰의 서른', letter:L_('', '남보다 멀리 보는 눈이 생겼구나. 미래를 알고 있어서가 아니라 사람과 일을 깊이 들여다본 덕분이야. 마흔의 너가 갖지 못한 단단한 시선이란다.')},
  free_many:{free:true, icon:'🎠', title:'여러 갈래의 마음', sub:'자유 시계 · 많은 인연', letter:L_('', '서른의 너는 여러 사람의 마음에 닿아 본 사람이 되었구나. 누구에게도 성급하게 선을 긋지 않고 각자의 속도를 존중했어. 그 마음의 지도가 네 인생의 폭이 되었단다.')},
  free_single:{free:true, icon:'🌙', title:'혼자서도 온전한', sub:'자유 시계 · 나를 먼저', letter:L_('', '곁에 누구도 없어도 네 시계는 정확하게 흘렀구나. 사랑이 필요 없다는 뜻이 아니라, 사랑이 오기 전에 이미 충분했다는 뜻이야. 이제 누가 오든 천천히 맞이해도 돼.')},
  ret_cold:{free:false, icon:'🍽️', title:'식어 가는 식탁', sub:'회귀 · 결혼은 했지만', letter:L_('', '결혼은 했지만 서로의 이야기가 점점 줄었구나. 같은 집, 다른 방. 마흔의 그 밤과 겹쳐 보였겠지. 약속보다 대화가 먼저라는 걸 다음엔 잊지 말자.')},
  ret_bookish:{free:false, icon:'📖', title:'책 속에 머문 서른', sub:'회귀 · 아는 것만 많은', letter:L_('', '아는 것은 누구보다 많았지만 그것을 쓸 사람과 장소가 부족했구나. 지식은 나누어야 힘이 된단다. 다음 생에는 책을 덮고 사람을 먼저 만나 보렴.')},
  ret_exposed:{free:false, icon:'📱', title:'열려 버린 휴대폰', sub:'회귀 · 들통난 비밀', letter:L_('', '들킨 비밀 하나가 많은 것을 무너뜨렸구나. 거짓말은 늘 이자를 붙여 돌아와. 다음에는 숨기는 법보다 솔직하게 선택하는 법을 먼저 연습해 보렴.')},
  ret_divorce:{free:false, icon:'📄', title:'다시 한 장의 서류', sub:'회귀 · 이혼', letter:L_('', '또 한 번 서류 앞에 서게 되었구나. 마흔의 그날과 닮아서 숨이 막혔을 거야. 그래도 이번엔 이유를 알고 걸어 나왔다는 게 달라. 다음 생에서는 서로의 꿈이 같은 식탁에 오르길.')},
  ret_breakups:{free:false, icon:'💔', title:'이별을 수집한 시계', sub:'회귀 · 반복된 이별', letter:L_('', '여러 번의 이별이 너를 지치게 했구나. 사람을 믿는 법을 배우기 전에 사람을 떠나는 법을 먼저 배웠어. 천천히, 한 사람에게 오래 머무는 연습부터 해 보자.')},
  ret_burnout:{free:false, icon:'🪫', title:'꺼진 배터리', sub:'회귀 · 번아웃', letter:L_('', '끝까지 달렸지만 너 자신이 먼저 방전되었구나. 쉬는 것도 계획의 일부라는 걸 잊었어. 다음에는 한 달에 한 번은 아무것도 하지 않는 날을 꼭 넣으렴.')},
  ret_rich:{free:false, icon:'🏦', title:'가득한 통장, 빈 시계', sub:'회귀 · 돈만 남다', letter:L_('', '통장은 넉넉했지만 시계는 채워지지 않았어. 돈이 모든 걸 해결하지는 못한다는 걸 서른이 되어서야 알았구나. 다음엔 숫자보다 사람과 나를 먼저 채워 보자.')},
  ret_nojob:{free:false, icon:'📮', title:'아직 답 없는 이력서', sub:'회귀 · 구직 중인 서른', letter:L_('', '서른이 되도록 출근할 곳을 찾지 못했구나. 면접에서 떨어진 날들이 쌓여 너를 흔들었겠지. 하지만 끝까지 지원서를 낸 용기는 사라지지 않아. 다음 생에서는 더 일찍 시작해 보자.')},
  ret_hopper:{free:false, icon:'🧳', title:'짐을 풀지 못한 책상', sub:'회귀 · 잦은 이직', letter:L_('', '여러 회사를 거치며 짐을 풀 틈이 없었구나. 옮겨 다니는 게 용기일 때도 있지만 한곳에서 뿌리내리는 것도 용기야. 다음에는 한 번쯤 오래 머물러 보렴.')},
  ret_workaholic:{free:false, icon:'🏢', title:'일만 남은 서른', sub:'회귀 · 일 중독', letter:L_('', '일은 눈부셨지만 곁에는 아무도 없고 네 마음은 비어 있었구나. 성공한 사무실 불빛이 외로울 수 있다는 걸 이제는 알지. 다음엔 퇴근 후의 삶도 같이 키워 보자.')},
};
for(const id in LOVE_END){ const [t, nm, body] = LOVE_END[id]; EXT_ENDINGS['free_love_' + id] = {free:true, icon:'💞', title:t, sub:`자유 시계 · ${nm}와 함께`, letter:L_('', body)}; }
Object.assign(ENDINGS, EXT_ENDINGS);
const ENDING_IDS = Object.keys(ENDINGS);
// ==/ENGINE==
