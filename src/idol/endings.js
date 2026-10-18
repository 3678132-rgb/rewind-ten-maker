// 엔딩 판정과 텍스트 — 아이돌 판 (ENGINE 구간 안, DOM 금지). src/data/endings.js 를 통째로 대체한다.
const FREE_MIN = 50, FREE_SUM = 190;

// 빌린 인생 / 되풀이된 연애 같은 보정을 반영한 최종 3축(실력·관계·마음)
function finalPillars(S){
  const w = S.work;
  let b = S.bond; const j = S.love.jaewoo;
  if(S.partner === 'jaewoo' && j && !j.fixed) b -= 18;
  return {work:clamp(w, 0, 100), bond:clamp(b, 0, 100), self:S.self};
}
function isFree(P){ return P.work >= FREE_MIN && P.bond >= FREE_MIN && P.self >= FREE_MIN && (P.work + P.bond + P.self) >= FREE_SUM; }

const loverOf = S => S.partner && S.love[S.partner] && S.love[S.partner].stage >= 1 && !(S.secret && S.secret[S.partner]) ? S.partner : null;
const exLovers = S => Object.keys(S.love).filter(i => S.love[i].stage === -9).length;
// 아이돌 판에는 직업군 엔딩 변형이 없다(ui.js 가 참조하므로 빈 객체로 둔다)
const CAREER_END = {};
const CAREER_VAR = {};
// 예전 엔딩 이름 → 지금 이름 (도감 기록 이어받기)
const END_ALIAS = {
  free_creator:'free_producer', free_pd:'free_variety', free_writer:'free_producer', free_director:'free_actor',
  free_style:'free_solo', free_beauty:'free_solo', free_designer:'free_solo', free_stylist:'free_solo', free_brandceo:'free_solo',
  free_tech:'free_producer', free_dev:'free_producer', free_startup:'free_producer',
  free_lawyer:'free_balance', free_exec:'free_daesang', free_rich:'free_worldtour', free_divorced:'free_balance', free_home:'free_wedding',
  free_borrowed:'free_balance', free_soul:'free_balance', free_hopper:'free_balance', free_scholar:'free_balance', free_charm:'free_balance',
  free_dare:'free_variety', free_ins:'free_balance', free_many:'free_balance', free_single:'free_balance',
  ret_borrowed:'free_balance', ret_work:'ret_trainee', ret_nojob:'ret_trainee', ret_hopper:'ret_trainee', ret_bookish:'ret_trainee',
  ret_workaholic:'ret_alone', ret_bond:'ret_alone', ret_cold:'ret_alone', ret_divorce:'ret_alone', ret_breakups:'ret_alone', ret_rich:'ret_alone',
  ret_exposed:'ret_scandal', ret_self:'ret_burnout',
};
const endingNorm = id => END_ALIAS[id] || id;
// 엔딩 내용(예전 id 가 들어와도 지금 엔딩으로)
const endingView = (S, id) => ENDINGS[endingNorm(id)] || ENDINGS[id];
const hasDaesang = I => (I.awards || []).some(a => String(a).includes('대상'));
function computeEnding(S){
  if(S.ending) return endingNorm(S.ending);
  const P = finalPillars(S), I = IDOL(S), fans = I.fans || 0;
  const lov = loverOf(S), secretNow = Object.keys(S.secret || {}).some(i => S.secret[i] && S.love[i] && S.love[i].stage >= 1);
  if(isFree(P)){
    if(S.married && P.bond >= 62) return 'free_wedding';
    if(hasDaesang(I)) return 'free_daesang';
    if(lov && P.bond >= 58 && ENDINGS['free_love_' + lov]) return 'free_love_' + lov;
    if(secretNow) return 'free_secret';
    if(fans >= 300) return 'free_worldtour';
    if(I.solo) return 'free_solo';
    if(I.actor) return 'free_actor';
    if(I.producer) return 'free_producer';
    if(I.variety) return 'free_variety';
    if((I.wins || 0) >= 1) return 'free_number1';
    if(!isIdol(S)) return 'free_trainer';
    return 'free_balance';
  }
  if(P.work < 35 && P.bond < 35 && P.self < 35) return 'ret_all';
  if((I.scandal || 0) >= 70) return 'ret_scandal';
  if(S.stress >= 85 || P.self < 35) return 'ret_burnout';
  if(!isIdol(S)) return 'ret_trainee';
  if(fans < 3) return 'ret_flop';
  if(P.bond < 40) return 'ret_alone';
  return 'ret_burnout';
}

const FREE_L = body => `서른 살의 ${'{name}'}에게.\n\n${body}\n\n시계는 이제 네 것이다.`;
const RET_L = body => `돌아온 ${'{name}'}에게.\n\n${body}\n\n한 번 더 해 볼래?`;
const ENDINGS = {
  free_daesang: {free:true, icon:'🏆', title:'대상 받은 서른', sub:'자유 시계 · 골든 스테이지 어워즈 대상',
    letter:FREE_L('골든 스테이지 어워즈에서 사회자가 루미너스를 불렀을 때, 너는 제일 먼저 멤버들 손을 찾았지. 월말평가에서 11등을 받고 연습실 바닥에 누워 울던 스무 살이 그 무대에 서 있었어. 나는 첫 번째 인생에서 오디션장 문 앞까지만 갔던 사람이라, 그 트로피가 얼마나 무거운지 잘 알아. 상보다 대기실에서 같이 울어 준 다섯 명을 오래 기억하렴.')},
  free_worldtour: {free:true, icon:'✈️', title:'월드투어 아이돌', sub:'자유 시계 · 팬 300만',
    letter:FREE_L('처음 팬사인회에 온 사람은 열두 명이었어. 그런데 서른의 너는 낯선 나라 공연장에서 우리말로 떼창을 듣고 있더구나. 시차 때문에 잠을 못 자도 엄마한테 영상통화는 꼭 걸었지. 비행기에서 내리면 무대보다 먼저 네 몸을 챙기렴.')},
  free_number1: {free:true, icon:'🥇', title:'음방 1위의 기억', sub:'자유 시계 · 뮤직 스테이지 1위',
    letter:FREE_L('뮤직 스테이지 1위 발표 때 너는 너무 놀라서 앵콜 노래 가사를 다 까먹었지. 지석 오빠가 대기실에서 그 영상을 열 번도 넘게 돌려 봤대. 대상은 없어도 괜찮아. 한 번 1위를 해 본 사람은 다음 무대도 끝까지 할 줄 아니까.')},
  free_solo: {free:true, icon:'🎤', title:'솔로 아티스트', sub:'자유 시계 · 혼자 서는 무대',
    letter:FREE_L('재계약 날 너는 혼자 서는 길을 골랐지. 첫 솔로 콘서트 날 객석 맨 앞줄에 루미너스 멤버 넷이 응원봉을 들고 앉아 있었어. 혼자 서는 것과 혼자가 되는 건 다르다는 걸 너는 알고 있었구나. 이제 네 노래를 네 목소리로 끝까지 불러.')},
  free_actor: {free:true, icon:'🎬', title:'배우로 전향', sub:'자유 시계 · 무대에서 화면으로',
    letter:FREE_L('첫 대본 리딩 날 너는 노래 대신 대사로 울어야 해서 많이 떨었지. 춤 연습하던 밤처럼 대사를 백 번씩 소리 내어 읽더구나. 이제 사람들은 너를 아이돌이 아니라 배우라고 불러. 그래도 가끔 노래방에서 데뷔곡을 부르는 너를 나는 좋아해.')},
  free_producer: {free:true, icon:'🎹', title:'작곡가·프로듀서', sub:'자유 시계 · 내가 쓴 노래',
    letter:FREE_L('연습실 구석에서 휴대폰에 흥얼거림을 녹음하던 스무 살을 기억해. 그 노래가 타이틀곡이 되던 날, 오 실장님이 처음으로 너한테 고맙다고 했지. 이제 후배들이 네 곡으로 월말평가를 본대. 마감 전날엔 꼭 잠을 자렴.')},
  free_variety: {free:true, icon:'📺', title:'예능 스타', sub:'자유 시계 · 웃음을 주는 사람',
    letter:FREE_L('첫 예능에서 너는 너무 긴장해서 엉뚱한 말을 했고, 그게 그 주 가장 많이 본 장면이 됐지. 사람들은 네가 웃기다고 하지만, 나는 촬영 끝나고 막내 스태프 이름까지 외우던 너를 알아. 웃음을 주는 일도 무대만큼 어려운 일이야. 카메라 꺼진 뒤에는 너도 실컷 웃어.')},
  free_trainer: {free:true, icon:'🎙️', title:'데뷔는 못 했지만', sub:'자유 시계 · 보컬 트레이너',
    letter:FREE_L('데뷔조 명단에 네 이름은 없었어. 그날 분식집 사장님이 말없이 떡볶이를 한 그릇 더 주셨지. 그런데 서른의 너는 연습생들 앞에서 호흡법을 가르치고 있더구나. 네가 가르친 아이가 무대에 서는 날, 그 무대의 절반은 네 거야.')},
  free_wedding: {free:true, icon:'💍', title:'함께 맞는 서른', sub:'자유 시계 · 결혼',
    letter:FREE_L('바쁜 스케줄 사이에 두 사람이 같은 달력을 펼쳐 놓고 날을 고르더구나. 결혼식 축가는 루미너스 멤버들이 불렀고, 엄마는 맨 앞에서 제일 크게 울었지. 마흔의 나는 사랑하면 내 꿈을 내려놔야 하는 줄 알았어. 너는 둘 다 지켰구나.')},
  free_balance: {free:true, icon:'⚖️', title:'무대 밖에서도 단단한 서른', sub:'자유 시계 · 균형',
    letter:FREE_L('대상도 월드투어도 없었지만, 너는 무대도 사람도 너 자신도 놓지 않았어. 컴백 전날에도 엄마랑 저녁을 먹었고, 힘든 날엔 연습을 멈출 줄 알았지. 두 번째 인생의 나는 정상까지 갔다가 다 잃었어. 그래서 이 평범한 서른이 얼마나 어려운지 잘 안단다.')},
  free_secret: {free:true, icon:'🗝️', title:'비밀을 안은 시계', sub:'자유 시계 · 말하지 못한 사람',
    letter:FREE_L('시계는 열렸지만 네 휴대폰에는 아직 이름 대신 이모티콘으로 저장된 사람이 있구나. 사진 한 장 같이 못 찍고, 기념일엔 모자를 눌러쓰고 만났지. 그 사람을 지키려고 숨긴 것도 알아. 언젠가 둘 다 숨지 않아도 되는 날이 오길 바란다.')},
  ret_burnout: {free:false, icon:'🌫️', title:'번아웃 은퇴', sub:'회귀 · 마음의 실패',
    letter:RET_L('너는 무대에서 한 번도 실수하지 않았어. 그런데 어느 날 숙소 침대에서 일어날 수가 없었지. 두 번째 인생의 나도 똑같이 그렇게 무대를 떠났단다. 다음엔 아프다고 먼저 말하는 연습부터 하자.')},
  ret_scandal: {free:false, icon:'📰', title:'스캔들로 추락', sub:'회귀 · 열애설과 논란',
    letter:RET_L('기사 한 줄이 나가고 하루 만에 팬카페 글이 다 바뀌었지. 회사는 활동을 멈추라고 했고, 멤버들은 너와 눈을 잘 마주치지 않았어. 숨긴 게 잘못이었는지 들킨 게 잘못이었는지 너도 헷갈렸을 거야. 다음엔 지킬 것과 말할 것을 미리 정해 두자.')},
  ret_flop: {free:false, icon:'📉', title:'데뷔했지만 사라진 그룹', sub:'회귀 · 아무도 모르는 이름',
    letter:RET_L('데뷔 무대는 분명히 있었어. 그런데 컴백할 때마다 음원 순위에서 이름을 찾기가 어려웠지. 팬사인회 의자가 반쯤 비어도 너는 끝까지 웃었구나. 다음엔 실력만큼 팬들 곁에 가는 일도 챙겨 보자.')},
  ret_trainee: {free:false, icon:'🚪', title:'연습생으로 끝난 꿈', sub:'회귀 · 데뷔하지 못함',
    letter:RET_L('월말평가 순위표를 몇 번이나 다시 봤는지 기억나니. 데뷔조 발표 날에도, 스타 메이커 마지막 회에도 네 이름은 불리지 않았어. 첫 번째 인생의 나는 오디션조차 안 봤으니, 너는 그래도 한 발 더 갔단다. 다음엔 그 한 발을 더 일찍 떼 보자.')},
  ret_alone: {free:false, icon:'🥀', title:'정상에 혼자 남은 사람', sub:'회귀 · 관계의 실패',
    letter:RET_L('무대는 잘해냈어. 그런데 대기실에서 너한테 말을 거는 멤버가 점점 줄었지. 엄마 전화도, 소연이 문자도 나중에 답해야지 하다가 그냥 지나갔어. 두 번째 인생의 나도 그렇게 혼자 정상에 남았단다.')},
  ret_debt: {free:false, icon:'💸', title:'멈춘 시계', sub:'회귀 · 빚',
    letter:RET_L('정산은 늦게 들어왔고 레슨비와 월세는 매달 빠져나갔지. 결국 빚이 연습할 시간까지 먹어 버렸어. 꿈을 지키려면 생활도 같이 지켜야 한단다. 다음엔 통장부터 들여다보자.')},
  ret_all: {free:false, icon:'🌧️', title:'다시, 비 오는 골목', sub:'회귀 · 모든 것의 부족',
    letter:RET_L('실력도, 사람도, 마음도 다 조금씩 모자랐어. 십 년은 생각보다 짧았지. 그래도 오디션 전날로 돌아갈 용기를 낸 사람이니까, 한 번 더 돌아갈 수도 있어. 이번엔 하나씩 천천히 하자.')},
};
// 연인 엔딩 12개
const LOVE_END = {
  raon:     ['무대 밖의 별', '강라온', '처음 연습실에서 그는 “그 정도로 데뷔하겠다고?”라고 했지. 그 선배가 열애 기사가 나던 날 제일 먼저 기자회견장에 나와 “제가 먼저 좋아했습니다”라고 말했어. 둘 다 무대를 잃을까 봐 무서웠을 텐데, 너희는 손을 놓지 않았구나.'],
  minjun:   ['고향 친구의 어깨', '한민준', '컴백 전날 밤에도 그는 연예인 얘기는 하나도 안 하고 학교 설계 과제 얘기만 했지. 그래서 네가 그 사람 앞에선 그냥 서윤일 수 있었어. 그가 그린 첫 집 도면에 네 연습실 자리가 있었다며. 무대에서 내려와 돌아갈 곳이 있다는 건 큰 힘이야.'],
  jaewoo:   ['둘이 만든 첫 노래', '서재우', '홍대 지하 연습실에서 기타 하나로 만든 그 노래 기억나니. 그 곡이 서른의 네 콘서트 마지막 곡이 됐더구나. 그는 끝까지 무대 뒤에서 기타를 쳤고, 네 꿈을 자기 꿈보다 앞에 두지도 뒤에 두지도 않았어.'],
  hajin:    ['이적 제안을 넘어서', '윤하진', '처음 그는 너를 데려가려고 명함을 내밀었지. 너는 거절했고, 그는 그 뒤로 한 번도 회사 얘기를 꺼내지 않았어. 서로의 회사를 응원하면서도 같은 식탁에 앉는 법을 너희는 찾았구나.'],
  taeoh:    ['셔터 소리가 닿은 곳', '은태오', '데뷔 앨범 재킷 촬영 날, 그는 긴장한 너한테 웃으라는 말 대신 숨을 쉬라고 했지. 서른의 그의 전시회에는 무대 위가 아니라 대기실에서 졸던 네 사진이 걸렸더구나. 꾸미지 않은 너를 제일 예쁘게 봐 준 사람이야.'],
  dohyun:   ['리허설이 끝난 뒤', '차도현', '음악방송 리허설에서 그는 네 동선 실수를 한 번도 그냥 넘어가지 않았지. 그런데 생방송 사고가 났던 날, 제일 먼저 너를 감싼 사람도 그였어. 무대 뒤의 현실을 다 아는 사람과 같이 걷는 건 든든한 일이야.'],
  sian:     ['함께 쓰는 결말', '유시안', '첫 드라마 오디션에서 그는 너한테 노래 말고 네 이야기를 해 보라고 했지. 그 뒤로 너는 대본 속 인물들을 진짜 사람처럼 이해하게 됐어. 이제 그가 쓰는 장면마다 네 목소리가 들린대. 둘이 같이 쓰는 이야기는 아직 1화래.'],
  seunghyun:['카메라 밖의 사람', '백승현', '그는 비밀 연애가 익숙한 사람이었지. 그런데 너한테는 처음으로 숨지 말자고 했어. 시상식 레드카펫에서 서로 모르는 척 지나가던 두 사람이 이제는 같은 차에서 내리더구나.'],
  jihu:     ['광고 촬영장에서 시작된', '한지후', '첫 광고 계약서에 사인하던 날, 그는 조건보다 네 피부가 상하지 않는지를 먼저 물었지. 일 얘기는 회사에서만 하자던 약속을 너희는 십 년째 지키고 있구나. 차분한 사람의 다정함은 오래 남아.'],
  geonwoo:  ['이의 없음, 평생 약속', '최건우', '정산 서류를 한 장씩 같이 읽어 주던 밤을 기억해. 재계약 분쟁 때 그는 네 편이었지만, 네가 틀린 조항을 말하면 똑바로 고쳐 줬어. 그렇게 단단한 사람이 너한테만은 늘 져 주더구나.'],
  yuchan:   ['악플보다 긴 답장', '안유찬', '악플 때문에 잠을 못 자던 밤, 그는 신고 기능을 새벽까지 고쳐서 보여 줬지. 사생 팬이 숙소 앞까지 왔을 때도 제일 먼저 달려온 사람이었어. 화면 속 수많은 말보다 그의 짧은 문자 한 줄이 너를 지켰구나.'],
  ujin:     ['한 벌의 옷처럼 맞는 사람', '신우진', '데뷔 무대 의상을 입던 날, 그는 네 어깨에 맞게 바늘을 세 번이나 다시 꽂았지. 그 뒤로 네 무대 의상에는 늘 안쪽에 작은 별이 하나 수놓아져 있었어. 서른의 너는 그 사람이 만든 드레스를 입고 웃고 있더구나.'],
};
for(const id in LOVE_END){ const [t, nm, body] = LOVE_END[id]; ENDINGS['free_love_' + id] = {free:true, icon:'💞', title:t, sub:`자유 시계 · ${josa(nm, '과', '와')} 함께`, letter:FREE_L(body)}; }
const ENDING_IDS = Object.keys(ENDINGS);
// 2회차: 마지막 달에 시계를 곁에 둔 사람만 이어갈 수 있다. 지난 회차 최종 능력치와 시작 능력치의 중간에서 다시 시작하고, 시계 조각 2개를 갖는다
// (S.idol 은 newGame 이 만드는 새 게임 기본값 그대로 — 연습생부터 다시)
function nextRound(prev){
  const S = newGame(prev.name, prev.origin, prev.regret, prev.major);
  S.round = (prev.round || 1) + 1;
  for(const k in S.st) S.st[k] = Math.min(100, Math.round((S.st[k] + (prev.st[k] || S.st[k])) / 2));
  S.story.pieces = 2; S.seen.prologue = true;
  return S;
}
