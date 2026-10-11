// 주 스토리 모음: STORY_A/B/C와 랜덤 이벤트를 합친다 (헬퍼는 story_core.js)
// 장별 이벤트는 STORY_A/B/C 파일에서 정의한다. 한 달에 하나씩, 가장 이른 것부터 나온다.
// 각 이벤트: {id:'st_<장>_<번호>', m:나오기 시작하는 달, exp:이 달수가 지나면 건너뜀(기본 8), cond?(S), ...일반 이벤트 필드}
const STORY = [].concat(typeof STORY_A !== 'undefined' ? STORY_A : [], typeof STORY_B !== 'undefined' ? STORY_B : [], typeof STORY_C !== 'undefined' ? STORY_C : []).sort((a, b) => a.m - b.m);
function storyDue(S){
  for(const e of STORY){
    if(S.seen[e.id]) continue; if(S.m < e.m) continue;
    if(S.m > e.m + (e.exp == null ? 8 : e.exp)) continue;
    if(e.cond && !e.cond(S)) continue;
    return Object.assign({once:true}, e);
  }
  return null;
}
// 랜덤으로 나오는 라이벌·위기 이벤트를 일반 이벤트 풀에 합친다
if(typeof RIVAL_EVENTS !== 'undefined') EVENTS.push(...RIVAL_EVENTS);
if(typeof CRISIS_EVENTS !== 'undefined') EVENTS.push(...CRISIS_EVENTS);

// 주요 장면 일러스트(art/sc_<이벤트id>.webp): 메인 스토리 40장면 + 위기 10장면. 인물 초상 대신 그 장면의 한 컷이 풀스크린으로 깔린다.
const SCENE_ART = new Set(['cr_friend_loan', 'cr_layoff_rumor', 'cr_mom_fall', 'cr_overwork_collapse', 'cr_phishing_mom', 'cr_rent_hike', 'cr_robbery', 'cr_rumor', 'cr_secret_leak', 'cr_work_mistake', 'st_10_1', 'st_10_2', 'st_10_3', 'st_10_4', 'st_1_1', 'st_1_2', 'st_1_3', 'st_1_4', 'st_2_1', 'st_2_2', 'st_2_3', 'st_2_4', 'st_3_1', 'st_3_2', 'st_3_3', 'st_3_4', 'st_4_1', 'st_4_2', 'st_4_3', 'st_4_4', 'st_5_1', 'st_5_2', 'st_5_3', 'st_5_4', 'st_6_1', 'st_6_2', 'st_6_3', 'st_6_4', 'st_7_1', 'st_7_2', 'st_7_3', 'st_7_4', 'st_8_1', 'st_8_2', 'st_8_3', 'st_8_4', 'st_9_1', 'st_9_2', 'st_9_3', 'st_9_4']);
for(const e of [].concat(STORY, typeof CRISIS_EVENTS !== 'undefined' ? CRISIS_EVENTS : [])) if(SCENE_ART.has(e.id)) e.img = 'art/sc_' + e.id + '.webp';
