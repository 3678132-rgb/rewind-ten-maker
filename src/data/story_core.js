// 주 스토리(10장, 한 해에 한 장) + 라이벌 + 위기. ENGINE 구간(DOM 금지)
// S.story = {pieces:시계 조각(0~10), rival:-10~10(+면 우호), momStage:엄마 건강 단계, truth:알아낸 비밀(0~10), f:{플래그}}
const CHAPTER_TITLES = ['되감기', '시험대', '빌린 인생', '병원 문턱', '마스크 너머', '진단서', '두 개의 약속', '같은 약, 다른 사람', '정산', '서른의 시계'];
const chapterOf = S => Math.min(10, Math.floor(S.m / 12) + 1);
const STORY_BASE = () => ({pieces:0, rival:0, momStage:0, truth:0, f:{}});
const SS = S => (S.story = S.story || STORY_BASE());
const SF = S => SS(S).f;
const RIVAL = '서하린';
// 시계 조각을 하나 얻는다(장마다 한 번). 칩에 표시한다.
function givePiece(S, ch){ const st = SS(S); st.pieces = Math.min(10, st.pieces + 1); push(ch, '시계 조각', 1); S.album.push(`시계 조각 ${st.pieces}개째를 얻음`); }
// 라이벌과의 관계를 바꾼다(+우호 / -적대). 칩에 표시한다.
function rivalMood(S, d, ch){ const st = SS(S); const b = st.rival; st.rival = clamp(st.rival + d, -10, 10); if(ch) push(ch, `${RIVAL} 관계`, st.rival - b); }
const rivalState = S => { const r = SS(S).rival; return r >= 4 ? 'ally' : r <= -4 ? 'enemy' : 'neutral'; };

