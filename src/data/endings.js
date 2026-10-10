// 엔딩 판정과 텍스트 (ENGINE 구간 안, DOM 금지)
const FREE_MIN = 50, FREE_SUM = 180;

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
    if(S.track === 'startup' && P.work >= 75) return 'free_founder';
    if(S.track === 'freelance' && P.work >= 65 && S.st.sense >= 40) return 'free_creator';
    if(P.work >= 70 && S.track !== 'startup') return 'free_pro';
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
  free_founder: {free:true, icon:'🚀', title:'내 이름의 회사', sub:'자유 시계 · 창업가',
    letter:`서른 살의 ${'{name}'}, 보고 있니?\n\n나는 이 가게에서 수없이 많은 사람에게 모래시계를 건넸지만, 네 번째 시계는 처음 받아 본다. 네가 만든 회사의 첫 직원 얼굴이 어디서 많이 본 것 같더라. 그래, 그날 네가 커피를 건넨 사람이야.\n\n이제 시계는 네 것이다. 어느 나이에서든 살 수 있지만, 아마 너는 지금을 고를 거라고 생각해.`},
  free_pro: {free:true, icon:'🧭', title:'이름으로 불리는 사람', sub:'자유 시계 · 전문가',
    letter:`서른 살의 ${'{name}'}에게.\n\n사원증이 아니라 이름으로 불리는 사람이 되었구나. 마흔의 우리는 한 번도 그런 적이 없었지. 일이 사람을 정의하지 않는다는 걸 알면서도, 내가 쌓은 것이 내 이름으로 남는다는 건 정말 큰 위로야.\n\n시계는 이제 네 것이다.`},
  free_creator: {free:true, icon:'🎨', title:'만드는 사람', sub:'자유 시계 · 창작자',
    letter:`서른 살의 ${'{name}'}에게.\n\n너는 이제 밤새 만든 것으로 밥을 먹는다. 누군가는 네 작업물을 보고 하루를 견뎌 낸대. 마흔의 우리가 한 번도 상상하지 못한 일이지.\n\n시계는 이제 네 것이다. 마음껏 꿈꾸렴.`},
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
