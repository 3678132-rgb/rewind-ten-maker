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
const SCENE_ART = new Set(typeof IDOL_SCENE_ART !== 'undefined' ? IDOL_SCENE_ART : []); // 아이돌 스토리 장면 그림(art/sc_<id>.webp)이 생기면 등록
for(const e of [].concat(STORY, typeof CRISIS_EVENTS !== 'undefined' ? CRISIS_EVENTS : [])) if(SCENE_ART.has(e.id)) e.img = 'art/sc_' + e.id + '.webp';
