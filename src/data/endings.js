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
// 엔딩은 30개: 자유 23(연인 12·직업군 5·삶 6) + 회귀 7
const CAREER_END = {pd:'free_creator', writer:'free_creator', director:'free_creator', actor:'free_actor', lawyer:'free_lawyer', dev:'free_tech', startup:'free_tech', beauty:'free_style', designer:'free_style', stylist:'free_style', brandceo:'free_style'};
// 예전 엔딩 이름 → 지금 이름 (도감 기록 이어받기)
const END_ALIAS = {free_beauty:'free_style', free_designer:'free_style', free_stylist:'free_style', free_brandceo:'free_style', free_pd:'free_creator', free_writer:'free_creator', free_director:'free_creator', free_dev:'free_tech', free_startup:'free_tech', free_home:'free_wedding', free_soul:'free_balance', free_hopper:'free_balance', free_scholar:'free_balance', free_charm:'free_balance', free_dare:'free_balance', free_ins:'free_balance', free_many:'free_balance', free_single:'free_balance', ret_cold:'ret_bond', ret_exposed:'ret_bond', ret_divorce:'ret_bond', ret_breakups:'ret_bond', ret_burnout:'ret_self', ret_nojob:'ret_work', ret_hopper:'ret_work', ret_workaholic:'ret_work', ret_bookish:'ret_work'};
// 직업군 엔딩은 플레이어의 실제 직업에 따라 제목·편지·그림이 달라진다(도감에서는 한 칸)
const CAREER_VAR = {
  pd:{icon:"🎥", title:"현장을 움직이는 사람", sub:"자유 시계 · 프로덕션 PD", letter:"서른 살의 {name}에게.\n\n촬영장에서 백 명의 이름을 외우던 그 눈빛이 아직도 선해. 폭우 속에서도 컷을 외치던 너를 보며 생각했어. 마흔의 우리는 이렇게 큰 판을 움직여 본 적이 없었다고.\n\n시계는 이제 네 것이다. 오늘 밤 촬영은 일찍 끝내렴."},
  writer:{icon:"✍️", title:"이야기를 쓰는 사람", sub:"자유 시계 · 드라마 작가", letter:"서른 살의 {name}에게.\n\n네가 쓴 한 줄 때문에 누군가가 밤새 울었대. 마흔의 우리가 쓰고 싶어서 서랍 속에 넣어 두었던 이야기들이 이제 화면 속에 살아 있어. 마감의 밤들이 헛되지 않았구나.\n\n시계는 이제 네 것이다."},
  director:{icon:"🎬", title:"끝까지 책임지는 사람", sub:"자유 시계 · 영화감독", letter:"서른 살의 {name}에게.\n\n레디, 액션. 네 목소리가 현장을 가르던 날 객석 맨 뒤에서 오래 앉아 있었어. 조연출 시절 남의 컷을 메우던 손이 이제는 한 편의 영화를 끝까지 이끄는구나. 마흔의 우리는 한 번도 크레딧 맨 뒤에 이름을 올려 본 적이 없었지.\n\n시계는 이제 네 것이다."},
  actor:{icon:"🌟", title:"스크린 속의 나", sub:"자유 시계 · 연예인", letter:"서른 살의 {name}에게.\n\n카메라 앞에서 눈을 반짝이는 네 모습을 보며 오래 웃었어. 마흔의 우리는 누가 보지 않는 곳에서 늘 숨죽이고 살았잖아. 이제 너는 보이는 사람이 되었구나. 그래도 가끔은 아무도 보지 않는 곳에서 쉬어 가렴.\n\n시계는 이제 네 것이다."},
  lawyer:{icon:"⚖️", title:"원칙을 지키는 사람", sub:"자유 시계 · 로펌 변호사", letter:"서른 살의 {name}에게.\n\n눈을 감으라는 유혹 앞에서 눈을 뜨고 서 있었던 네가 자랑스러워. 누군가의 가장 힘든 날을 함께 견디는 일이 얼마나 무거운지 알면서도, 너는 그 자리에 섰구나.\n\n시계는 이제 네 것이다."},
  dev:{icon:"🖥️", title:"세상을 만드는 사람", sub:"자유 시계 · IT 개발자", letter:"서른 살의 {name}에게.\n\n네가 만든 서비스를 지금 수십만 명이 쓰고 있어. 아는 미래를 따르지 않고 밤새 코드를 쳤던 그 새벽들이 모두 여기에 쌓였구나. 이건 온전히 네 것이다.\n\n시계도 이제 네 것이다."},
  startup:{icon:"🚀", title:"작은 팀의 큰 꿈", sub:"자유 시계 · 스타트업 창업가", letter:"서른 살의 {name}에게.\n\n투자 심사장에서 떨리던 손을 알아. 적자 속에서도 팀원들 월급날을 먼저 챙기던 너를 봤어. 마흔의 우리는 안정이라는 말에 숨었지만, 이제 너는 불확실함 위에 서서 웃는구나.\n\n시계는 이제 네 것이다."},
  beauty:{icon:"💄", title:"브랜드를 만드는 사람", sub:"자유 시계 · 뷰티 마케터", letter:"서른 살의 {name}에게.\n\n루미에르 코스메틱의 신제품 캠페인에서 네 이름이 가장 먼저 불린다는 소식을 들었어. 마흔의 우리는 한 번도 브랜드의 얼굴이 되어 본 적이 없지. 사람의 하루에 작은 설렘을 건네는 일을 네가 해냈구나.\n\n시계는 이제 네 것이다."},
  designer:{icon:"👗", title:"계절을 먼저 말하는 사람", sub:"자유 시계 · 패션 디자이너", letter:"서른 살의 {name}에게.\n\n네 컬렉션이 무대에 오르던 날, 객석에서 숨을 죽이고 있었어. 마흔의 우리는 늘 옷을 고르며 남의 시선을 신경 썼지. 이제 너는 남이 입고 싶은 옷을 만드는구나.\n\n시계는 이제 네 것이다."},
  stylist:{icon:"💇", title:"이미지를 바꾸는 사람", sub:"자유 시계 · 스타일리스트", letter:"서른 살의 {name}에게.\n\n레드카펫 앞에서 마지막 매무새를 만져 주던 네 손을 봤어. 사람들은 옷을 입은 사람만 기억하지만, 그 사람을 빛나게 한 사람이 누구인지 나는 알아. 마흔의 우리는 늘 남의 시선 뒤에 숨었는데, 이제 너는 남이 빛나도록 돕는 사람이 되었구나.\n\n시계는 이제 네 것이다."},
  brandceo:{icon:"🏷️", title:"내 이름을 건 브랜드", sub:"자유 시계 · 브랜드 대표", letter:"서른 살의 {name}에게.\n\n포장 상자에 네 이름이 찍혀 있었어. 남의 브랜드를 키우던 사람이 이제 자기 브랜드의 첫 매장 문을 여는구나. 매출 그래프가 흔들리던 밤마다 네가 되뇌던 말을 기억해. “그래도 이건 내 거야.”\n\n시계는 이제 네 것이다."},
};
// 지금 플레이어의 직업에 맞춘 엔딩 내용(직업군 엔딩이 아니면 그대로)
const endingView = (S, id) => { const e = ENDINGS[id], v = S && S.track && CAREER_END[S.track] === id && S.hired ? CAREER_VAR[S.track] : null; return v ? Object.assign({}, e, v, {track:S.track}) : e; };
function computeEnding(S){
  if(S.ending) return END_ALIAS[S.ending] || S.ending;
  const P = finalPillars(S), raw = {work:S.work, bond:S.bond, self:S.self};
  const lov = loverOf(S), secretNow = Object.keys(S.secret || {}).some(i => S.secret[i] && S.love[i] && S.love[i].stage >= 1);
  if(isFree(P)){
    if(S.divorced && !S.married) return 'free_divorced';
    if(S.married && P.bond >= 62) return 'free_wedding';
    if(lov && P.bond >= 58) return 'free_love_' + lov;
    if(secretNow) return 'free_secret';
    if(S.hired && (S.rank || 0) >= 3 && !inLawSchool(S)) return 'free_exec';
    if(S.cash >= 1500) return 'free_rich';
    if(CAREER_END[S.track] && S.hired && P.work >= 62 && !inLawSchool(S)) return CAREER_END[S.track];
    if((S.engaged || S.married) && P.bond >= 70) return 'free_wedding';
    return 'free_balance';
  }
  if(isFree(raw)) return 'ret_borrowed'; // 겉보기엔 통과했지만 빌린 인생이었다
  const lowest = Object.keys(P).sort((a, b) => P[a] - P[b])[0];
  if(P.work < 35 && P.bond < 35 && P.self < 35) return 'ret_all';
  if((S.lastDisc != null && P.bond < 50) || S.divorced || (exLovers(S) >= 3 && P.bond < 55) || (S.married && P.bond < 50)) return 'ret_bond';
  if(S.stress >= 85) return 'ret_self';
  if(S.cash >= 1500) return 'ret_rich';
  if((!S.hired && S.m >= 60) || (S.switched || 0) >= 2 || (P.work >= 68 && P.bond < 50 && P.self < 50) || S.st.know >= 68) return 'ret_work';
  return 'ret_' + lowest;
}

const ENDINGS = {
  free_actor: {free:true, icon:'🌟', title:'스크린 속의 나', sub:'자유 시계 · 연예인',
    letter:`서른 살의 ${'{name}'}에게.\n\n카메라 앞에서 눈을 반짝이는 네 모습을 보며 오래 웃었어. 마흔의 우리는 누가 보지 않는 곳에서 늘 숨죽이고 살았잖아. 이제 너는 보이는 사람이 되었구나. 그래도 가끔은 아무도 보지 않는 곳에서 쉬어 가렴.\n\n시계는 이제 네 것이다.`},
  free_lawyer: {free:true, icon:'⚖️', title:'원칙을 지키는 사람', sub:'자유 시계 · 로펌 변호사',
    letter:`서른 살의 ${'{name}'}에게.\n\n눈을 감으라는 유혹 앞에서 눈을 뜨고 서 있었던 네가 자랑스러워. 누군가의 가장 힘든 날을 함께 견디는 일이 얼마나 무거운지 알면서도, 너는 그 자리에 섰구나.\n\n시계는 이제 네 것이다.`},
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
  free_creator:{free:true, icon:'🎬', title:'이야기를 만드는 사람', sub:'자유 시계 · PD·감독·작가', letter:L_('', '컷 소리가 울리는 촬영장에서든, 불 꺼진 작업실의 마지막 문장 앞에서든 너는 이야기를 끝까지 책임지는 사람이 되었구나. 마흔의 우리는 서랍 속에 넣어 둔 이야기만 갖고 있었는데, 너는 그것을 세상 밖으로 꺼내 놓았어.\n\n시계는 이제 네 것이다. 오늘 밤 마감은 일찍 끝내렴.')},
  free_style:{free:true, icon:'👗', title:'나만의 스타일을 만드는 사람', sub:'자유 시계 · 뷰티·디자인·스타일링', letter:L_('', '계절을 먼저 읽고, 사람의 분위기를 바꾸고, 마침내 네 이름을 건 브랜드까지. 사람의 하루에 작은 설렘을 건네는 일을 네가 해냈구나. 마흔의 우리는 한 번도 거울 앞에서 이렇게 당당해 본 적이 없었지.\n\n시계는 이제 네 것이다.')},
  free_tech:{free:true, icon:'🖥️', title:'세상을 만드는 사람', sub:'자유 시계 · 개발·창업', letter:L_('', '밤새 짠 코드가 누군가의 하루를 편하게 하고, 작은 팀의 첫 서비스가 세상에 나왔대. 마흔의 우리는 늘 남이 만든 판 위에서만 일했지. 이제는 네가 판을 만드는 쪽에 서 있구나.\n\n시계는 이제 네 것이다. 서버는 잠깐 쉬게 해 줘.')},
  free_divorced:{free:true, icon:'🕊️', title:'두 번째 자유', sub:'자유 시계 · 이혼 후의 서른', letter:L_('', '결혼도, 이혼도 겪은 서른이 되었구나. 마흔의 너는 끝내 도장을 찍지 못했는데, 이번엔 네가 먼저 선택했어. 실패가 아니라 정리였다는 걸 시계가 인정했단다. 이제는 누구의 꿈도 아닌 네 길을 걸어가렴.')},
  free_wedding:{free:true, icon:'💍', title:'함께 맞는 서른', sub:'자유 시계 · 결혼', letter:L_('', '서른의 너는 식탁 위에 두 사람의 달력을 올려놓았더구나. 서로의 꿈을 번갈아 세워 준 결혼이야. 마흔의 너는 희생이 사랑인 줄 알았지만, 이번엔 약속이 선택이었어. 행복하렴.')},
  free_secret:{free:true, icon:'🗝️', title:'비밀을 안은 시계', sub:'자유 시계 · 끝나지 않은 이야기', letter:L_('', '시계는 열렸지만 네 마음 한구석에는 아직 열지 못한 서랍이 있구나. 누군가에게 말하지 못한 관계가 서른의 너를 조금 외롭게 만들었어. 언젠가 그 서랍을 열 용기를 내길 바란다.')},
  free_exec:{free:true, icon:'🏆', title:'정상의 서른', sub:'자유 시계 · 최고 직급', letter:L_('', '십 년 만에 가장 높은 직급의 명찰을 달았구나. 승진 발표 날 떨리던 손을 기억하니. 마흔의 너는 늘 “다음에 하죠”라고 말했는데, 이번엔 “제가 하겠습니다”라고 말했지. 그 한마디가 너를 여기까지 데려왔어.')},
  free_rich:{free:true, icon:'💰', title:'통장보다 시계', sub:'자유 시계 · 넉넉한 서른', letter:L_('', '넉넉한 통장을 가지고도 시간을 더 값지게 쓰는 사람이 되었구나. 돈은 도구일 뿐이라는 걸 아는 서른은 드물어. 이제는 그 풍요를 누군가와 나누는 법을 배우렴.')},
  ret_rich:{free:false, icon:'🏦', title:'가득한 통장, 빈 시계', sub:'회귀 · 돈만 남다', letter:L_('', '통장은 넉넉했지만 시계는 채워지지 않았어. 돈이 모든 걸 해결하지는 못한다는 걸 서른이 되어서야 알았구나. 다음엔 숫자보다 사람과 나를 먼저 채워 보자.')},
};
for(const id in LOVE_END){ const [t, nm, body] = LOVE_END[id]; EXT_ENDINGS['free_love_' + id] = {free:true, icon:'💞', title:t, sub:`자유 시계 · ${nm}와 함께`, letter:L_('', body)}; }
Object.assign(ENDINGS, EXT_ENDINGS);
const ENDING_IDS = Object.keys(ENDINGS);
const endingNorm = id => END_ALIAS[id] || id;
// ==/ENGINE==
