// 엔딩 판정과 텍스트 (ENGINE 구간 안, DOM 금지)
const FREE_MIN = 50, FREE_SUM = 184;

// 빌린 인생 / 되풀이된 결혼 같은 보정을 반영한 최종 3축
function finalPillars(S){
  const w = S.work - Math.min(32, S.borrowed * 2.8);
  let b = S.bond; const j = S.love.jaewoo;
  if(S.partner === 'jaewoo' && j && !j.fixed) b -= 18;
  return {work:clamp(w, 0, 100), bond:clamp(b, 0, 100), self:S.self};
}
function isFree(P){ return P.work >= FREE_MIN && P.bond >= FREE_MIN && P.self >= FREE_MIN && (P.work + P.bond + P.self) >= FREE_SUM; }

function computeEnding(S){
  if(S.ending) return S.ending;
  const P = finalPillars(S), raw = {work:S.work, bond:S.bond, self:S.self};
  if(isFree(P)){
    if(CAREERS[S.track] && S.hired && P.work >= 62 && !inLawSchool(S)) return 'free_' + S.track;
    if(S.engaged && P.bond >= 70) return 'free_home';
    if(P.self >= 75) return 'free_soul';
    return 'free_balance';
  }
  if(isFree(raw)) return 'ret_borrowed'; // 겉보기엔 통과했지만 빌린 인생이었다
  const lowest = Object.keys(P).sort((a, b) => P[a] - P[b])[0];
  if(P.work < 35 && P.bond < 35 && P.self < 35) return 'ret_all';
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
const ENDING_IDS = Object.keys(ENDINGS);
// ==/ENGINE==
