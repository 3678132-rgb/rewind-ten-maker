// 남주 이야기 이벤트 A: 서재우(jaewoo) · 한민준(minjun) · 윤하진(hajin) 각 6개. ENGINE 구간(DOM 금지)
// 로컬 헬퍼는 _lsa 접두어. 호감 → 능력치 → 칩 순으로 만든다.
const _lsa = (S, id, d, o, text, mood) => { const ch = []; if(d) addAff(S, id, d, ch); if(o) fx(S, o, ch); const r = {text, chips:ch}; if(mood) r.mood = mood; return r; };
const _lsaJwDone = (S, line) => { lvSet(S, 'jaewoo', 'arc_done'); S.album.push(line); };
const _lsaMjDone = (S, line) => { lvSet(S, 'minjun', 'arc_done'); S.album.push(line); };
const _lsaHjDone = (S, line) => { lvSet(S, 'hajin', 'arc_done'); S.album.push(line); };

const LSTORY_A = [
// ════════ 서재우 (동아리 선배 · 야망) — 협상·도전을 좋아한다 ════════
{id:'ls_jaewoo_1', lover:'jaewoo', cond:S => isMet(S, 'jaewoo') && !(S.love.jaewoo && S.love.jaewoo.avoided) && S.m >= 14 && S.m < 70,
 speaker:'서재우', title:'첫 번째 독자', place:'campus', img:'art/cp_club.webp', cut:'jaewoo', cutVar:'a',
 beats:[
  '동아리방 책상 위에 스테이플러로 찍은 서류 뭉치가 놓여 있다. 표지에는 굵은 글씨로 「서재우 무역(가칭) 사업 계획서」.',
  '“창업 경진대회 서류 마감이 열흘 남았어. 아무한테나 보여 줄 수는 없고, 너한테만 보여 주는 거야.” 재우 선배의 눈이 또 사라지도록 웃는다.',
  '마흔의 나는 이 서류를 본 적이 없다. 그때의 그는 이미 이 계획서를 잊은 사람이었으니까.',
 ],
 text:S => `선배가 펜을 쥐여 주며 말한다. “솔직하게 써 줘, ${S.name}. 칭찬만 있는 피드백은 필요 없어.” 숫자는 낙관적이고 문장은 뜨겁다.`,
 choices:[
  {label:'숫자의 약한 곳을 짚는다', sub:'협상이 높을수록 그가 감탄한다', run(S){ lvSet(S, 'jaewoo', 'k1', 'honest');
    if(S.st.neg >= 50) return _lsa(S, 'jaewoo', 7, {neg:1, ins:0.5}, '“매출 추정이 2년 차부터 직선이에요. 여기서 거래처 한 곳만 빠져도 무너져요.” 선배의 펜이 멈췄다가 천천히 그 칸에 동그라미를 쳤다. “너 협상 테이블에 앉으면 무서운 사람이겠다. 앞으로도 내 첫 독자 해라.”', 'surprised');
    return _lsa(S, 'jaewoo', 1, {neg:0.5, stress:3}, '더듬더듬 지적을 이어 가자 선배의 웃음이 점점 굳었다. “아, 응… 그럴 수도 있겠네.” 말은 순했지만 서류를 가져가는 손이 조금 빨랐다. 틀린 말은 아닌데 전하는 법이 서툴렀다.', 'sad'); }},
  {label:'가능성부터 크게 칭찬한다', sub:'호감↑ · 매력 +1', run(S){ lvSet(S, 'jaewoo', 'k1', 'praise'); return _lsa(S, 'jaewoo', 4, {charm:1}, '“선배 아이디어 진짜 되겠다 싶어요.” 그는 서류를 가슴에 안고 한참 웃었다. 기분이 좋아진 그가 자판기 커피를 사 왔지만, 나는 마흔의 기억 때문에 그 웃음이 반만 마음에 들어왔다.'); }},
  {label:'“선배 꿈이 뭔지부터 듣고 싶어요”', sub:'통찰 +1 · 호감↑', run(S){ lvSet(S, 'jaewoo', 'k1', 'dream'); return _lsa(S, 'jaewoo', 5, {ins:1}, '그는 펜을 놓고 잠시 창밖을 봤다. “…번듯한 간판 하나. 우리 아버지가 한 번도 못 걸어 본 거.” 처음 듣는 이야기였다. 계획서보다 그 한 줄이 더 오래 남았다.', 'tender'); }},
 ]},

{id:'ls_jaewoo_2', lover:'jaewoo', cond:S => isMet(S, 'jaewoo') && afterEv(S, 'ls_jaewoo_1', 2) && S.m < 80,
 speaker:'서재우', title:'팀 이름 맨 위에', place:'campus', img:'art/cp_library.webp', cut:'jaewoo', cutVar:'a',
 beats:[
  '경진대회 팀은 세 명. 재우 선배가 도서관 스터디룸 화이트보드에 팀원 이름을 적고 있다.',
  '마지막 칸에서 그의 마커가 멈춘다. “네 이름, 어디에 올릴까. 맨 위에 올려도 돼?” 농담처럼 웃지만 눈은 진지하다.',
  '내 이름이 화이트보드 맨 위에서 반짝인다. 마흔의 나는 한 번도 누군가의 첫 줄에 적힌 적이 없었다.',
 ],
 text:S => `선배가 마커 뚜껑을 닫으며 묻는다. “발표 파트 정해야 하는데, 넌 어디를 맡고 싶어?” 도전을 좋아하는 사람 앞에서는 나도 한 발 더 나가고 싶어진다.`,
 choices:[
  {label:'발표 파트를 자원한다', sub:'도전이 높을수록 그가 기뻐한다', run(S){ lvSet(S, 'jaewoo', 'role', 'present');
    if(S.st.dare >= 45) return _lsa(S, 'jaewoo', 7, {dare:1, charm:0.5, bond:1}, '“오, 겁 없네!” 선배가 마커를 허공에 던졌다 받았다. 리허설 때 내 첫 문장이 끝나자 그가 말없이 박수를 쳤다. “나 지금 좀 설레. 같이 이기자.”', 'happy');
    return _lsa(S, 'jaewoo', 3, {dare:0.5, stress:4}, '막상 서자 목소리가 떨렸다. 선배는 놀리지 않고 내 원고 여백에 “숨 쉬고 천천히!”라고 적어 주었다. 무모했지만, 그가 한 번도 한숨을 쉬지 않은 게 고마웠다.', 'shy'); }},
  {label:'자료 조사와 숫자를 맡는다', sub:'실무 +1 · 호감↑', run(S){ lvSet(S, 'jaewoo', 'role', 'data'); return _lsa(S, 'jaewoo', 4, {skill:1, work:1}, '“그럼 숫자는 네가 지켜 줘. 난 앞에서 떠들 테니까.” 역할이 정해지자 그가 후련하게 웃었다. 이 사람은 뒤에서 일하는 사람의 몫을 알고 있을까, 문득 궁금해졌다.'); }},
  {label:'“이름 순서는 가나다순으로 해요”', sub:'협상이 높을수록 공정한 팀이 된다', run(S){ lvSet(S, 'jaewoo', 'role', 'fair');
    if(S.st.neg >= 50) return _lsa(S, 'jaewoo', 5, {neg:1, bond:1}, '“팀은 같이 서는 거니까요.” 선배는 잠깐 놀란 얼굴이더니 이름들을 순서대로 다시 적었다. “맞네. 내가 또 내 위주로 갔다.” 스스로 고치는 모습이 낯설고 믿음직했다.', 'surprised');
    return _lsa(S, 'jaewoo', 1, {neg:0.5}, '“그, 그래?” 선배는 어색하게 웃으며 지우개를 들었다. 틀린 제안은 아니었지만 말에 힘이 없어서 흐지부지 넘어갔다. 맨 위 이름은 결국 그의 것이었다.'); }},
 ]},

{id:'ls_jaewoo_3', lover:'jaewoo', cond:S => isMet(S, 'jaewoo') && afterEv(S, 'ls_jaewoo_2', 2) && affOf(S, 'jaewoo') >= 30 && S.m < 90,
 speaker:'서재우', title:'불 꺼진 셔터', place:'rain', img:'art/cover.webp', cut:'jaewoo', cutVar:'b',
 beats:[
  '약속 시간이 지나도 선배가 오지 않는다. 비가 쏟아지는 밤, 나는 그가 말했던 도매 시장 골목까지 걸어간다.',
  '문 닫힌 작은 무역 사무실. 셔터에는 빨간 딱지가 붙어 있고 그 앞에 재우 선배가 우산도 없이 서 있다.',
  '“…왔어? 아, 약속 늦어서 미안. 별일 아니야. 아버지 가게 정리하는 날이라서.” 그는 평소처럼 웃으려 하지만 눈이 웃지 않는다.',
 ],
 text:S => `그가 서류 봉투를 등 뒤로 감춘다. 이 사람이 그렇게 서둘러 번듯한 간판을 갖고 싶어 하는 이유를 알 것 같다. ${S.name}, 지금 뭐라고 할까?`,
 choices:[
  {label:'말없이 우산을 씌워 주고 곁에 선다', sub:'호감↑↑ · 아무것도 묻지 않는다', run(S){ lvSet(S, 'jaewoo', 'secret_known', 'quiet'); return _lsa(S, 'jaewoo', 8, {bond:2, stress:-2}, '우산 아래에서 한동안 빗소리만 났다. “…묻지 않아 줘서 고맙다.” 그가 낮게 말하고 소매로 얼굴을 훔쳤다. 그날 밤 그는 처음으로 자기 이야기를 나보다 먼저 꺼내지 않았다.', 'tender'); }},
  {label:'“말해 줘요. 같이 계산해 봐요”', sub:'협상이 높을수록 그가 마음을 연다', run(S){ lvSet(S, 'jaewoo', 'secret_known', 'asked');
    if(S.st.neg >= 50) return _lsa(S, 'jaewoo', 9, {neg:1.5, bond:2}, '나는 그를 가게 처마 아래로 끌고 가 남은 빚과 가능한 방법을 하나씩 적었다. 그는 처음엔 퉁명스럽다가 곧 펜을 빼앗아 같이 적었다. “…나는 이걸 혼자 감당하는 게 맞다고 생각했는데.” 숫자 앞에서 둘은 같은 편이었다.', 'surprised');
    return _lsa(S, 'jaewoo', 2, {stress:4}, '“계산? 지금 그게 중요해?” 그의 목소리가 날카로워졌다가 곧 가라앉았다. “미안, 네 잘못 아니야. 오늘은 그냥 가자.” 나는 때를 잘못 골랐다. 우산 아래 거리가 반 뼘 멀어졌다.', 'sad'); }},
  {label:'도움이 될 돈을 건넨다', sub:'돈 -40 · 그의 자존심이 걸린다', run(S){ const ch = []; bump(S, 'cash', -40, ch); lvSet(S, 'jaewoo', 'secret_known', 'money');
    if(S.st.dare >= 50){ addAff(S, 'jaewoo', 4, ch); fx(S, {dare:1}, ch); return {text:'“빌려 주는 거예요. 이자는 선배 첫 간판 앞에서 사진 한 장으로.” 그는 놀라다가 웃음이 터졌다. “협박범이네.” 봉투를 받는 손이 떨렸지만, 끝내 받아 주었다.', chips:ch, mood:'happy'}; }
    addAff(S, 'jaewoo', -7, ch); return {text:'“나를 불쌍하게 보는 거야?” 그가 봉투를 밀어냈다. 얼굴이 하얗게 질려 있었다. 마음이 틀린 건 아닌데 자존심을 먼저 밟았다. 돈은 돌아왔지만 그의 눈은 한동안 돌아오지 않았다.', chips:ch, mood:'sad'}; }},
 ]},

{id:'ls_jaewoo_4', lover:'jaewoo', cond:S => isMet(S, 'jaewoo') && afterEv(S, 'ls_jaewoo_3', 2) && affOf(S, 'jaewoo') >= 30 && S.m < 96,
 speaker:'서재우', title:'발표자의 이름', place:'campus', img:'art/cp_class.webp', cut:'jaewoo', cutVar:'a',
 beats:[
  '경진대회 본선 무대. 조명 아래에서 재우 선배가 마이크를 쥐고 거침없이 말한다.',
  '심사위원이 묻는다. “이 시장 분석은 누가 설계했습니까?” 객석 뒤에서 내 자료가 화면에 떠 있다.',
  '“제가 직접 설계했습니다.” 선배가 한 치의 망설임도 없이 대답한다. 그 순간 이혼 서류 위에서 들었던 어떤 문장이 겹친다.',
 ],
 text:S => `무대 아래에서 나는 손바닥에 손톱 자국이 날 만큼 주먹을 쥐고 있다. 그는 내가 모은 자료를 자기 이름으로 말했다. 지금 어떻게 할까?`,
 choices:[
  {label:'질의 시간에 손을 들어 바로잡는다', sub:'도전이 높을수록 무대가 내 편이 된다', run(S){ lvSet(S, 'jaewoo', 'k4', 'public');
    if(S.st.dare >= 50){ const r = _lsa(S, 'jaewoo', 5, {dare:1.5, charm:1, work:1}, '“그 지표는 제가 두 달 동안 직접 모았습니다.” 객석이 술렁였지만 목소리는 떨리지 않았다. 심사위원이 웃으며 나를 가리켰다. 무대 위의 재우 선배는 얼굴이 붉어졌다가 천천히 고개를 숙였다. “…맞습니다. 이 사람 몫입니다.”'); r.mood = 'serious'; return r; }
    return _lsa(S, 'jaewoo', -5, {stress:8, charm:-0.5}, '일어서서 입을 열었지만 문장이 엉켜 버렸다. “그러니까, 저도 같이…” 심사위원은 어색하게 고개만 끄덕였고, 재우 선배의 표정이 차갑게 굳었다. 용기는 있었는데 준비가 없었다.', 'sad'); }},
  {label:'내려온 뒤 단둘이 이야기한다', sub:'협상이 높을수록 그가 인정한다', run(S){ lvSet(S, 'jaewoo', 'k4', 'private');
    if(S.st.neg >= 50) return _lsa(S, 'jaewoo', 8, {neg:1.5, self:2}, '대기실 문을 닫고 차분히 말했다. “발표는 선배 몫이에요. 하지만 자료를 내 이름 없이 말하는 건 앞으로 안 돼요.” 그는 변명하려다 입을 다물었다. “…알겠다. 그런 줄도 모르고 말했어. 내가 미안.” 사과가 서툴러서 오히려 진짜 같았다.', 'tender');
    return _lsa(S, 'jaewoo', -6, {stress:7}, '“왜 그렇게 따져? 팀 이름으로 나간 건데!” 그가 목소리를 높였고 나도 지지 않았다. 결국 둘 다 말을 마치지 못하고 문을 열었다. 서로의 말을 한 줄도 못 들었다.', 'serious'); }},
  {label:'웃으며 삼킨다', sub:'호감 소폭↑ · 나 -3 · 스트레스 +6', run(S){ lvSet(S, 'jaewoo', 'k4', 'swallow'); return _lsa(S, 'jaewoo', 2, {self:-3, stress:6}, '“잘했어요, 선배.” 나는 박수를 쳤다. 그는 활짝 웃으며 내 어깨를 두드렸다. 이 장면을 안다. 마흔의 내가 이십 년 동안 반복했던 웃음이라서, 박수 소리가 점점 멀어졌다.', 'sad'); }},
 ]},

{id:'ls_jaewoo_5', lover:'jaewoo', cond:S => isMet(S, 'jaewoo') && afterEv(S, 'ls_jaewoo_4', 3) && (affOf(S, 'jaewoo') >= 55 || isCouple(S, 'jaewoo')) && S.m < 112,
 speaker:'서재우', title:'아버지의 간판', place:'night', img:'art/ct_night.webp', cut:'jaewoo', cutVar:'b',
 beats:[
  '선배가 밤늦게 나를 도매 시장 골목으로 데려간다. 그 불 꺼진 셔터 앞이다.',
  '그가 열쇠를 꺼내 자물쇠를 열자 먼지 낀 간판이 바닥에 세워져 있다. 「서씨무역」 네 글자가 반쯤 벗겨져 있다.',
  '“아버지는 이걸 한 번도 못 걸어 봤어. 나는 그걸 걸려고 달렸는데, 달리다 보니 옆에 누가 있는지 못 봤더라.”',
 ],
 text:S => `선배가 먼지 낀 간판을 쓰다듬다 나를 본다. ${isCouple(S, 'jaewoo') ? '그의 손이 내 손을 놓지 않는다.' : '그가 손을 뻗으려다 멈추고 주먹을 쥔다.'} “옆에 있어 줘서 고맙다는 말, 이제야 한다.”`,
 choices:[
  {label:'“내 일부를 말하지 못해도 믿어 줄래요?”', sub:'통찰 +1 · 마흔의 비밀을 슬쩍 건넨다', run(S){ lvSet(S, 'jaewoo', 'k5', 'secret'); const ch = []; addAff(S, 'jaewoo', 6, ch); fx(S, {ins:1, self:1}, ch);
    const extra = lvFlag(S, 'jaewoo', 'secret_known') ? ' 그는 아버지 가게 이야기를 꺼냈던 날을 떠올리듯 천천히 말했다.' : '';
    return {text:`“나도 네가 다 말하길 바라는 거 아니야. 거짓말만 하지 마.”${extra} 그 한마디에 이십 년 묵은 무언가가 조용히 풀렸다. 지금의 그는 마흔의 그와 다른 사람 같았다.`, chips:ch, mood:'tender'}; }},
  {label:'그의 어깨에 말없이 기댄다', sub:'호감↑ · 스트레스 -4', run(S){ lvSet(S, 'jaewoo', 'k5', 'lean'); return _lsa(S, 'jaewoo', 7, {stress:-4, bond:1}, `기대자 그의 숨이 순간 멎었다가 천천히 풀렸다. ${isCouple(S, 'jaewoo') ? '그는 내 머리 위에 턱을 가볍게 올렸다.' : '그는 움직이지 못한 채 가만히 어깨를 내주었다.'} 간판 위로 가로등 불빛이 내려앉았다.`, 'shy'); }},
  {label:'“앞으로 중요한 결정은 나한테 먼저 물어봐요”', sub:'협상이 높을수록 약속이 단단하다', run(S){ lvSet(S, 'jaewoo', 'k5', 'ask');
    if(S.st.neg >= 50){ lvSet(S, 'jaewoo', 'ask_first'); return _lsa(S, 'jaewoo', 8, {neg:1.5, self:2}, '“…약속할게. 결정하기 전에 먼저 물어보는 것. 지키기 어려우면 어렵다고 말하는 것.” 그가 새끼손가락을 내밀었다. 이 사람이 처음으로 지킬 수 있는 약속의 크기를 스스로 정했다.', 'happy'); }
    return _lsa(S, 'jaewoo', 3, {self:1}, '“어, 응, 노력할게.” 그는 진심으로 대답했지만 확신은 없어 보였다. 약속이라기보다 다짐에 가까웠다. 그래도 그의 눈은 도망치지 않았다.'); }},
 ]},

{id:'ls_jaewoo_6', lover:'jaewoo', cond:S => isMet(S, 'jaewoo') && afterEv(S, 'ls_jaewoo_5', 3) && (affOf(S, 'jaewoo') >= 55 || isCouple(S, 'jaewoo')) && S.m < 118,
 speaker:'서재우', title:'네 꿈의 첫 번째 투자자', place:'campus', img:'art/cp_field.webp', cut:'jaewoo', cutVar:'a',
 beats:[
  '도서관 옥상, 노을이 한가득 번진다. 재우 선배가 포스트잇 두 장을 손끝에 들고 서 있다.',
  '“사업자등록증 초안 나왔어. 근데 회사 이름보다 먼저 정하고 싶은 게 있어서.”',
  '그가 평소와 달리 말을 고르며 천천히 이어 간다. “회사가 처음 돈을 버는 날, 네 꿈의 첫 투자자는 내가 될게.”',
 ],
 text:S => `${lvFlag(S, 'jaewoo', 'ask_first') ? '그는 지난번 약속을 기억한다는 듯 먼저 말을 꺼냈다. ' : ''}${isCouple(S, 'jaewoo') ? '연인의 약속은 가볍지 않다. ' : '이 말은 고백보다 무겁다. '}포스트잇 한 장에는 그의 꿈이, 다른 한 장에는 비어 있는 칸이 있다. 그 칸에 내 꿈을 써 달라고 한다.`,
 choices:[
  {label:'“그럼 나는 선배 회사의 첫 번째 반대자가 될게요”', sub:'협상·도전이 높을수록 그가 반한다', run(S){ lvSet(S, 'jaewoo', 'k6', 'opponent'); _lsaJwDone(S, '서재우와 서로의 꿈을 번갈아 응원하기로 약속함');
    if((S.st.neg + S.st.dare) / 2 >= 50) return _lsa(S, 'jaewoo', 10, {neg:1, dare:1, self:3, bond:2}, '그는 한참 웃다가 눈가를 훔쳤다. “반대하는 사람이 있어야 회사가 안 망하지.” 두 장의 포스트잇이 한 장씩 서로의 가슴 위에 붙었다. 노을이 질 때까지 우리는 이 약속의 규칙을 하나씩 적었다.', 'happy');
    return _lsa(S, 'jaewoo', 5, {self:3, bond:1}, '“반대자?” 그가 웃다가 진지해졌다. “좋아. 그게 필요한 날이 올 거야.” 말은 단단했는데 내 목소리가 조금 떨려서 서로 얼굴을 보지 못했다. 그래도 포스트잇은 내 가슴에 붙었다.', 'shy'); }},
  {label:'“약속해요. 대신 내 꿈도 달력에 먼저 적어요”', sub:'나 +3 · 호감↑', run(S){ lvSet(S, 'jaewoo', 'k6', 'calendar'); _lsaJwDone(S, '서재우가 내 꿈을 달력에 먼저 적어 주기로 약속함'); return _lsa(S, 'jaewoo', 8, {self:3, bond:1}, `그는 펜을 꺼내 포스트잇에 내 이름을 크게 적더니 자기 일정 맨 위에 붙였다. “알겠어. 네 꿈이 내 일정보다 앞.” ${isCouple(S, 'jaewoo') ? '그의 입술이 내 이마에 가볍게 닿았다 떨어졌다.' : '그가 용기를 낸 듯 내 손등을 아주 잠깐 잡았다 놓았다.'}`, 'tender'); }},
  {label:'웃으며 새끼손가락을 건다', sub:'호감↑ · 스트레스 -5', run(S){ lvSet(S, 'jaewoo', 'k6', 'pinky'); _lsaJwDone(S, '서재우와 노을 아래에서 새끼손가락을 걸었음'); return _lsa(S, 'jaewoo', 6, {stress:-5, bond:1}, '새끼손가락이 걸리자 그가 눈이 사라지도록 웃었다. “이거 도장 찍은 거다. 나중에 딴소리하기 없기.” 마흔의 내가 끝내 받지 못했던 약속이 오늘은 마음 한가운데 단단히 놓였다.', 'shy'); }},
 ]},

// ════════ 한민준 (건축과 고향 친구 · 서툴고 다정) — 감각·통찰을 좋아한다 ════════
{id:'ls_minjun_1', lover:'minjun', cond:S => isMet(S, 'minjun') && S.m >= 4 && S.m < 40,
 speaker:'한민준', title:'모형 속 작은 창', place:'campus', img:'art/cp_library.webp', cut:'minjun', cutVar:'b',
 beats:[
  '열람실 구석, 민준이 종이 뭉치를 들고 벽을 보며 중얼거리고 있다. 내일이 설계 과제 발표다.',
  '“그, 그러니까 이 건물은 사람이 머무는 속도를… 아니, 이게 아닌데.” 그가 나를 발견하고 허둥지둥 종이를 감춘다.',
  '“들었어? 아니, 들었겠지. 나 발표가 제일 무서워. 도면은 그릴 수 있는데 말이 안 나와.”',
 ],
 text:S => `그가 구겨진 원고 위에 스케치 한 장을 올려놓는다. 작은 창이 하나 뚫린 방이다. ${S.name}, 이 서툰 친구에게 어떤 말이 필요할까?`,
 choices:[
  {label:'원고 말고 도면부터 보여 주라고 한다', sub:'통찰이 높을수록 그가 힘을 얻는다', run(S){ lvSet(S, 'minjun', 'k1', 'drawing');
    if(S.st.ins >= 45) return _lsa(S, 'minjun', 7, {ins:1, bond:1}, '“말은 도면을 설명하는 도구일 뿐이야. 너는 이미 이 그림으로 다 말했어.” 민준은 한동안 멍하게 나를 보다가 스케치를 책상 한가운데에 폈다. “…네가 그렇게 말하니까 되는 것 같아.” 귀 끝이 빨갰다.', 'surprised');
    return _lsa(S, 'minjun', 3, {bond:0.5}, '“도면부터 보여 줘.” 그는 고개를 끄덕이며 스케치를 폈지만 설명하는 목소리는 여전히 떨렸다. 방향은 맞았는데 이유까지 건네지는 못했다. 그래도 한 번 웃었다.'); }},
  {label:'말할 때 눈이 반짝인 부분을 짚어 준다', sub:'감각이 높을수록 정확하다', run(S){ lvSet(S, 'minjun', 'k1', 'eyes');
    if(S.st.sense >= 45) return _lsa(S, 'minjun', 7, {sense:1, charm:0.5}, '“창 얘기할 때만 목소리가 달라졌어. 거기서부터 시작해.” 민준은 놀란 듯 입을 벌렸다. “내가 그랬어?” 그가 작은 창을 손가락으로 짚었고, 그 순간 눈에 빛이 번졌다. 나는 그 얼굴을 오래 기억하고 싶었다.', 'tender');
    return _lsa(S, 'minjun', 3, {sense:0.5}, '“어디서 눈이 반짝였는지는… 잘 모르겠지만.” 나는 흐지부지 웃었다. 민준도 따라 웃었다. 정확하진 않았어도, 누군가 지켜봐 준다는 사실만으로 그는 조금 편해진 얼굴이었다.'); }},
  {label:'“그냥 떨지 말고 해. 응원할게”', sub:'호감 소폭↑ · 스트레스 -2', run(S){ lvSet(S, 'minjun', 'k1', 'cheer'); return _lsa(S, 'minjun', 3, {stress:-2}, '“으, 응. 열심히 해 볼게.” 민준이 주먹을 쥐고 파이팅 자세를 했다. 어색하고 귀여운 몸짓이었다. 내일 발표를 어떻게 할지는 나도 모르지만, 오늘 밤만큼은 그의 어깨가 조금 내려갔다.', 'shy'); }},
 ]},

{id:'ls_minjun_2', lover:'minjun', cond:S => isMet(S, 'minjun') && afterEv(S, 'ls_minjun_1', 2) && S.m < 60,
 speaker:'한민준', title:'고향 골목의 마지막 봄', place:'campus', img:'art/ct_river.webp', cut:'minjun', cutVar:'a',
 beats:[
  '주말 기차를 타고 고향에 내려왔다. 민준이 가방에서 필름 카메라와 줄자를 꺼낸다.',
  '“재개발 구역에 들어간대. 우리 동네 골목이 반년 뒤에 없어진다는데… 그 전에 다 재 놓고 싶어서.”',
  '낡은 철물점, 만화방, 담벼락의 키 눈금. 마흔의 나는 이 골목이 사라진 뒤에야 그리워했다는 걸 기억한다.',
 ],
 text:S => `민준이 골목 어귀에서 줄자를 내민다. “같이 해 줄래? 나 혼자서는 끝까지 못 잴 것 같아서.” 사라질 풍경 앞에서 나는 어떤 마음을 꺼낼까.`,
 choices:[
  {label:'사진과 소리까지 기록해 두자고 한다', sub:'감각이 높을수록 둘의 기록이 깊어진다', run(S){ lvSet(S, 'minjun', 'k2', 'archive');
    if(S.st.sense >= 45) return _lsa(S, 'minjun', 7, {sense:1, bond:1}, '철물점 셔터 소리, 만화방 형광등 소리, 담벼락 눈금 앞의 웃음소리. 민준이 녹음 앱을 켜고 골목마다 둘의 목소리를 넣었다. “사라져도 이건 남겠다.” 그의 말이 석양에 오래 번졌다.', 'tender');
    return _lsa(S, 'minjun', 3, {sense:0.5}, '사진은 몇 장 잘 찍혔지만 소리는 바람에 묻혔다. 민준은 “다음에 다시 오면 되지”라고 말했지만, 다음이 없다는 걸 우리 둘 다 알았다. 그래도 같이 있던 시간은 남았다.'); }},
  {label:'“여긴 꼭 지켜야 해”라고 마흔의 기억을 꺼낸다', sub:'통찰 +1 · 선명도 -2', run(S){ lvSet(S, 'minjun', 'k2', 'foretold'); lvSet(S, 'minjun', 'knew_demolish'); return _lsa(S, 'minjun', 5, {ins:1, clarity:-2}, '“여기 없어지면 정말 후회할 거야. 몇 년 뒤에 그 자리에 뭐가 서는지까지 알아.” 민준이 이상하다는 듯 나를 봤지만, 이내 줄자를 내려놓고 고개를 끄덕였다. “…그럼 더 열심히 재 놔야겠다.” 그가 조금 겁먹은 얼굴로 웃었다.', 'surprised'); }},
  {label:'그냥 나란히 걷는다', sub:'호감↑ · 스트레스 -3', run(S){ lvSet(S, 'minjun', 'k2', 'walk'); return _lsa(S, 'minjun', 4, {stress:-3}, '아무것도 재지 않고 한 바퀴를 천천히 돌았다. 민준은 말없이 내 보폭에 맞췄다. 골목 끝에서 그가 불쑥 말했다. “너랑 있으면 사라지는 것들이 그렇게 무섭지만은 않아.”', 'shy'); }},
 ]},

{id:'ls_minjun_3', lover:'minjun', cond:S => isMet(S, 'minjun') && afterEv(S, 'ls_minjun_2', 2) && affOf(S, 'minjun') >= 30 && S.m < 80,
 speaker:'한민준', title:'떨어진 공모전', place:'night', img:'art/ct_night.webp', cut:'minjun', cutVar:'b',
 beats:[
  '민준이 사흘째 연락이 없다. 학과 게시판에는 공모전 결과가 붙어 있고 그의 이름은 없다.',
  '작업실도, 기숙사도 비어 있다. 한참을 찾다가 한강 다리 아래 계단에서 스케치북을 안고 앉은 그를 발견한다.',
  '“심사평이 이랬어. 선이 정확하지만 자기 목소리가 없다고. …나는 그게 뭔지 모르겠어.”',
 ],
 text:S => `그가 고개를 숙인 채 연필을 만지작거린다. 그에게 필요한 건 위로일까, 방향일까, 침묵일까. ${S.name}, 어떻게 할까?`,
 choices:[
  {label:'말없이 옆에 앉아 도시락을 내민다', sub:'감각이 높을수록 그가 마음을 연다', run(S){ lvSet(S, 'minjun', 'k3', 'sit');
    if(S.st.sense >= 50) return _lsa(S, 'minjun', 8, {sense:1, stress:-3}, '십 분쯤 지나서야 그가 도시락 뚜껑을 열었다. 한 숟갈 먹더니 눈가가 붉어졌다. “…배고픈 줄도 몰랐어.” 그가 이야기를 꺼내기 시작할 때까지 나는 한 번도 재촉하지 않았다. 강 위로 불빛이 번졌다.', 'tender');
    return _lsa(S, 'minjun', 4, {stress:-1}, '도시락은 받았지만 그는 거의 먹지 못했다. 나는 아무 말도 하지 못한 채 같이 어둠을 보았다. 그래도 헤어질 때 그가 작게 말했다. “와 줘서 다행이야.”'); }},
  {label:'“네 선이 틀린 게 아니라 아직 말을 안 한 거야”', sub:'통찰이 높을수록 그의 마음에 닿는다', run(S){ lvSet(S, 'minjun', 'k3', 'voice');
    if(S.st.ins >= 50) return _lsa(S, 'minjun', 9, {ins:1.5, bond:1}, '“네가 그린 창은 항상 한 사람을 향해 있어. 누구를 위한 방인지 한 번만 적어 봐.” 민준은 스케치북을 한참 넘기다가 숨을 멈췄다. “…이 방들, 다 같은 사람 얼굴을 하고 있었네.” 그 사람이 누구인지는 서로 묻지 못했다.', 'surprised');
    return _lsa(S, 'minjun', 1, {stress:3}, '말을 하고 보니 어디서 읽은 위로처럼 허공에 떴다. 민준은 “고마워”라고 했지만 눈은 여전히 스케치북에 머물러 있었다. 내 말이 닿지 않았다는 걸 알아서 더 쓸쓸했다.', 'sad'); }},
  {label:'“그만 징징대. 다시 그리면 되잖아”', sub:'호감↓ · 스트레스 +4', run(S){ lvSet(S, 'minjun', 'k3', 'blunt'); return _lsa(S, 'minjun', -6, {stress:4}, '말이 입 밖으로 나오자마자 후회했다. 민준의 어깨가 움찔했고, 그는 “…그래. 맞는 말이야”라고 작게 답했다. 그 대답이 더 아팠다. 서툰 사람은 상처를 받아도 따지지 않는다.', 'serious'); }},
 ]},

{id:'ls_minjun_4', lover:'minjun', cond:S => isMet(S, 'minjun') && afterEv(S, 'ls_minjun_3', 2) && affOf(S, 'minjun') >= 30 && S.m < 96,
 speaker:'한민준', title:'누구한테 들었어?', place:'campus', img:'art/cp_shop.webp', cut:'minjun', cutVar:'b',
 beats:[
  `학교 앞 작은 분식집. 민준과 마주 앉아 떡볶이를 먹다가 ${'나는 무심코 입을 열고 만다.'}`,
  '“아버님 허리는 좀 괜찮으셔? 수술 날짜 잡았다고 들었는데…” 말이 끝나기도 전에 민준의 젓가락이 멈춘다.',
  '“…그건 가족 말고는 아무도 몰라. 내가 너한테 말한 적 없는데, 누구한테 들었어?”',
 ],
 text:S => `${lvFlag(S, 'minjun', 'knew_demolish') ? '고향 골목 때처럼 또 내가 먼저 알고 있었다. ' : ''}민준의 목소리가 처음으로 차갑다. “가끔 넌 나보다 내 미래를 먼저 아는 사람 같아.” 마흔의 비밀이 입 밖으로 새어 나왔다. 어떻게 수습할까?`,
 choices:[
  {label:'“설명할 수 없지만 해칠 마음은 없어”라고 말한다', sub:'협상이 높을수록 그가 받아들인다', run(S){ lvSet(S, 'minjun', 'k4', 'honest');
    if(S.st.neg >= 50) return _lsa(S, 'minjun', 6, {neg:1.5, self:2}, '“못 말하는 이유가 있어. 대신 너한테 해가 되는 일은 절대 안 할게.” 민준은 한참 침묵하다 젓가락을 내려놓았다. “…말 못 하는 게 있어도 돼. 거짓말만 하지 마.” 눈빛은 아직 흔들렸지만 손은 도로 내 쪽으로 왔다.', 'tender');
    return _lsa(S, 'minjun', -2, {stress:5}, '말을 꺼냈지만 변명처럼 들렸다. “이유를 말 못 한다는 게 제일 이상해.” 민준이 고개를 저었다. 믿고 싶은데 믿을 수 없다는 눈이었다. 분식집의 소음이 먼 곳 소리처럼 들렸다.', 'sad'); }},
  {label:'“우연히 들었어”라고 둘러댄다', sub:'호감↓↓ · 스트레스 +5', run(S){ lvSet(S, 'minjun', 'k4', 'lied'); return _lsa(S, 'minjun', -8, {stress:5, self:-2}, '“…그래?” 민준은 더 묻지 않았다. 그게 오히려 최악이었다. 그는 계산서를 먼저 들고 일어났고, 거짓말을 알아챈 사람의 침묵이 오래 남았다. 마흔의 내가 잃은 친구가 이렇게 시작됐을지도 모른다는 생각이 스쳤다.', 'sad'); }},
  {label:'병원에 같이 가자고 한다 (돈 -20)', sub:'실무 +1 · 호감↑ · 돈 -20', run(S){ const ch = []; lvSet(S, 'minjun', 'k4', 'help'); bump(S, 'cash', -20, ch); addAff(S, 'minjun', 5, ch); fx(S, {skill:1, bond:1}, ch);
    return {text:'“어떻게 알았는지는 묻지 말고, 수술 전날엔 같이 있고 싶어. 간병용품도 내가 챙길게.” 민준은 입술을 깨물다가 천천히 고개를 끄덕였다. “…고마워. 나 혼자서는 뭘 챙겨야 하는지도 몰랐거든.” 의심이 완전히 풀리진 않았지만, 마음이 풀리는 쪽으로 흘렀다.', chips:ch, mood:'shy'}; }},
 ]},

{id:'ls_minjun_5', lover:'minjun', cond:S => isMet(S, 'minjun') && afterEv(S, 'ls_minjun_4', 3) && (affOf(S, 'minjun') >= 55 || isCouple(S, 'minjun')) && S.m < 110,
 speaker:'한민준', title:'수술실 앞 의자', place:'night', img:'art/bg_hospital.webp', cut:'minjun', cutVar:'b',
 beats:[
  '수술실 앞 복도, 민준이 빈 의자에 앉아 두 손을 모으고 있다. 시계는 한 시간째 같은 자리에 걸려 있는 듯하다.',
  '“엄마는 점심 사러 갔어. 나는… 여기 앉아 있는 것밖에 할 수 있는 게 없어.”',
  '그가 나를 올려다본다. 눈가가 젖어 있다. “무서워. 무섭다는 말, 너 말고는 어디에도 못 해.”',
 ],
 text:S => `${isCouple(S, 'minjun') ? '내가 그의 연인이라는 사실이 병원 복도에서 처음으로 무겁게 닿는다.' : '내가 그에게 무엇인지 이름 붙일 수 없지만, 이 자리가 맞다는 건 안다.'} 그가 내 대답을 기다린다.`,
 choices:[
  {label:'손을 잡고 곁에 앉는다', sub:'감각이 높을수록 위로가 닿는다', run(S){ lvSet(S, 'minjun', 'k5', 'hand');
    if(S.st.sense >= 50) return _lsa(S, 'minjun', 8, {sense:1, bond:2, stress:-3}, `손을 잡자 차가운 손가락이 가늘게 떨렸다. 나는 아무 말 없이 그의 호흡에 내 호흡을 맞췄다. ${isCouple(S, 'minjun') ? '그가 내 손등에 이마를 기댔다.' : '그는 손을 놓지 않은 채 조용히 고개를 끄덕였다.'} 한 시간이 십 분처럼 지나갔다.`, 'tender');
    return _lsa(S, 'minjun', 5, {bond:1}, '손을 잡았지만 어떤 말을 보태야 할지 몰라 가만히 있었다. 그래도 그는 놓지 않았다. 말보다 온기가 먼저 닿았다는 걸 나중에 그가 알려 주었다.'); }},
  {label:'보호자 서류와 대기 안내를 대신 챙긴다', sub:'실무 +1 · 호감↑', run(S){ lvSet(S, 'minjun', 'k5', 'paper'); return _lsa(S, 'minjun', 6, {skill:1, work:1}, '접수 창구, 동의서, 간호사실 호출 번호. 마흔의 내가 병원에서 배운 일들이 이번엔 누군가를 지켜 주었다. 민준이 멍하게 보다가 말했다. “넌 나보다 어른 같다. …고마워, 정말.”'); }},
  {label:'“울어도 돼. 내가 들었다고 아무한테도 안 말해”', sub:'통찰 +1 · 호감↑↑', run(S){ lvSet(S, 'minjun', 'k5', 'cry'); const ch = []; addAff(S, 'minjun', 8, ch); fx(S, {ins:1, stress:-4}, ch);
    return {text:'그는 처음엔 이를 악물었다. 그러다 어깨가 무너지듯 내려앉았다. 아주 오래 소리 없이 울었고, 나는 그의 등을 천천히 쓸었다. 울음이 그치자 그가 휴지로 코를 풀며 쑥스럽게 웃었다. “이거, 비밀이다.”', chips:ch, mood:'shy'}; }},
 ]},

{id:'ls_minjun_6', lover:'minjun', cond:S => isMet(S, 'minjun') && afterEv(S, 'ls_minjun_5', 3) && (affOf(S, 'minjun') >= 55 || isCouple(S, 'minjun')) && S.m < 118,
 speaker:'한민준', title:'작은 창이 있는 방', place:'campus', img:'art/cp_class.webp', cut:'minjun', cutVar:'a',
 beats:[
  '작업실 책상 위에 새 모형이 놓여 있다. 첫 장면에서 보았던 스케치를 그대로 세운, 작은 창이 하나 뚫린 방이다.',
  '“심사평에서 말한 자기 목소리가 뭔지 이제 알았어. 이 방은 처음부터 한 사람을 위해 그리고 있었어.”',
  `모형 안쪽 벽에 연필 글씨가 보인다. 「${'창가 책상: 그 사람 자리'}」.`,
 ],
 text:S => `${isCouple(S, 'minjun') ? '그가 내 손을 모형 앞으로 조심스레 이끈다.' : '그가 모형 앞에서 쭈뼛거리며 나를 부른다.'} “어디에 있든, 이 방은 돌아오면 네가 제일 먼저 들어와야 완성돼. …약속해 줄래?”`,
 choices:[
  {label:'“창가 책상에는 내가 앉을게. 대신 불은 네가 켜 놔”', sub:'감각이 높을수록 약속이 낭만이 된다', run(S){ lvSet(S, 'minjun', 'k6', 'window'); _lsaMjDone(S, '한민준의 작은 창이 있는 방, 창가 자리를 약속받음');
    if(S.st.sense >= 50) return _lsa(S, 'minjun', 10, {sense:1.5, self:2, bond:2}, '“…불은 내가 켜 놓을게. 매일.” 민준이 모형 속 작은 전구에 스위치를 누르자 창 안쪽이 노랗게 번졌다. 서툰 사람이 평생 한 번 낼 만한 용기로, 그가 내 이름을 처음으로 길게 불렀다.', 'tender');
    return _lsa(S, 'minjun', 6, {self:2, bond:1}, '“응, 약속.” 그가 환하게 웃으며 전구를 켰다. 말은 서툴렀지만 모형 안의 불빛은 정확했다. 오래 기억할 한 장면이 하나 늘었다.', 'shy'); }},
  {label:'“멀리 가도 네 방 이야기는 내가 먼저 들을게”', sub:'통찰 +1 · 호감↑', run(S){ lvSet(S, 'minjun', 'k6', 'listen'); _lsaMjDone(S, '한민준의 첫 번째 독자가 되기로 약속함'); return _lsa(S, 'minjun', 8, {ins:1, self:2}, '“편지든 사진이든 도면이든 네가 보내는 건 내가 제일 먼저 열어 볼게.” 민준이 입술을 꼭 깨물다 웃었다. “그럼 나, 안 외롭겠다.” 헤어질 때 그가 모형을 내 쪽으로 반 뼘 밀어 주었다.', 'tender'); }},
  {label:'장난스럽게 모형 창문에 내 이름을 쓴다', sub:'호감↑ · 스트레스 -4', run(S){ lvSet(S, 'minjun', 'k6', 'name'); _lsaMjDone(S, '한민준의 모형 창문에 내 이름을 적음'); return _lsa(S, 'minjun', 7, {stress:-4, charm:0.5}, '연필로 아주 작게 이름을 적자 민준이 소리 없이 웃었다. “지우지 마, 완공될 때까지.” 그가 모형을 두 손으로 가만히 감쌌다. 작은 방 안에 우리 둘의 약속이 처음으로 살게 되었다.', 'shy'); }},
 ]},

// ════════ 윤하진 (스타트업 대표 · 직설) — 도전·실무를 좋아한다 ════════
{id:'ls_hajin_1', lover:'hajin', cond:S => isMet(S, 'hajin') && S.m >= 30 && S.m < 70,
 speaker:'윤하진', title:'그래서 누가 돈을 내죠?', place:'campus', img:'art/cp_class.webp', cut:'hajin', cutVar:'a',
 beats:[
  '하진 선배의 멘토링 시간. 내가 낸 사업 아이디어 한 장이 책상 한가운데 펼쳐져 있다.',
  '그가 빨간 펜을 들고 한참을 읽더니 맨 아래에 딱 한 줄을 적는다. 「그래서 누가 돈을 내죠?」',
  '직설적인 눈빛이 정면으로 닿는다. “좋은 아이디어는 많아요. 근데 돈을 내는 사람이 없으면 취미죠.”',
 ],
 text:S => `마흔의 나는 이 질문에 답하지 못해서 회사를 떠났다. 이번에는 대답할 수 있을지도 모른다. ${S.name}, 어떻게 응수할까?`,
 choices:[
  {label:'바로 반박하고 근거를 댄다', sub:'도전이 높을수록 그가 흥미를 보인다', run(S){ lvSet(S, 'hajin', 'k1', 'argue');
    if(S.st.dare >= 50) return _lsa(S, 'hajin', 7, {dare:1, neg:0.5}, '“지금은 학생이지만 구독료를 낼 사람은 이미 있어요. 이 인터뷰 세 건이 근거예요.” 하진이 빨간 펜을 내려놓고 처음으로 소리 내어 웃었다. “아이디어보다 겁 없는 게 마음에 들어요. 다음 주에 사무실로 와요.”', 'surprised');
    return _lsa(S, 'hajin', 1, {dare:0.5, stress:4}, '반박을 시작했지만 근거가 얇았다. 하진은 팔짱을 낀 채 끝까지 듣고 말했다. “용기는 보였어요. 숫자는 다음에.” 냉정하지만 문을 닫지는 않았다.', 'serious'); }},
  {label:'메모하고 일주일 안에 고쳐 온다', sub:'실무가 높을수록 그가 인정한다', run(S){ lvSet(S, 'hajin', 'k1', 'revise');
    if(S.st.skill >= 45) return _lsa(S, 'hajin', 7, {skill:1.5, work:1}, '일주일 뒤 나는 고객 인터뷰, 가격표, 손익 시뮬레이션이 담긴 세 장을 내밀었다. 하진은 말없이 끝까지 읽더니 한 줄을 적었다. 「이제 누가 돈을 내는지 보이네요.」 작은 칭찬이 훈장처럼 느껴졌다.', 'happy');
    return _lsa(S, 'hajin', 3, {skill:0.5}, '밤새 고쳐서 가져갔지만 군데군데 허점이 남았다. “노력은 보이네요. 근데 이건 아직 숙제 같아요.” 부정은 아닌데 마음이 조금 쓰렸다. 그래도 다시 올 이유가 생겼다.'); }},
  {label:'상처받은 표정을 숨기지 못한다', sub:'호감↑ · 스트레스 +3', run(S){ lvSet(S, 'hajin', 'k1', 'hurt'); return _lsa(S, 'hajin', 3, {stress:3}, '입술을 깨물고 종이를 접으려는데 하진이 펜을 내려놓았다. “…말이 센가요. 미안해요. 저는 좋은 아이디어가 아까워서 이러는 거예요.” 변명처럼 들리지 않는 목소리였다. 직설적인 사람의 서툰 사과가 오래 남았다.', 'shy'); }},
 ]},

{id:'ls_hajin_2', lover:'hajin', cond:S => isMet(S, 'hajin') && afterEv(S, 'ls_hajin_1', 2) && S.m < 80,
 speaker:'윤하진', title:'먹통이 된 첫 시연', place:'campus', img:'art/bg_shop.webp', cut:'hajin', cutVar:'a',
 beats:[
  '하진의 첫 고객이 될지도 모르는 동네 가게. 그가 노트북을 열고 서비스 시연을 시작한다.',
  '화면이 멈춘다. 서버 오류. 가게 사장님의 눈빛이 식어 가고, 하진의 이마에서 땀이 흐른다.',
  '그가 나를 힐끗 본다. 직설적인 그가 처음으로 SOS를 보낸다. “…미안, 도와줄 수 있어요?”',
 ],
 text:S => `사장님은 시계를 보고 있다. 시연이 망하면 이 계약도, 하진의 석 달도 날아간다. ${S.name}, 어떻게 이 자리를 살릴까?`,
 choices:[
  {label:'화면 없이 말로 즉석 설명을 이어 간다', sub:'도전이 높을수록 판을 뒤집는다', run(S){ lvSet(S, 'hajin', 'k2', 'speak');
    if(S.st.dare >= 50) return _lsa(S, 'hajin', 8, {dare:1.5, charm:1}, '“사장님, 이 서비스는 화면이 아니라 하루에 한 시간을 돌려드리는 겁니다.” 나는 마흔의 가게 사장님들이 하던 하소연을 그대로 풀었다. 사장님이 고개를 끄덕이기 시작했다. 하진이 뒤에서 작게 속삭였다. “…당신, 대체 정체가 뭐예요.”', 'happy');
    return _lsa(S, 'hajin', 3, {dare:0.5, stress:5}, '말은 시작했지만 사장님의 질문에 막혔다. 하진이 이어받아 겨우 마무리했고, “다음에 연락드릴게요”라는 대답을 받았다. 실패는 아니었지만 성공도 아니었다. 계단에서 그가 말했다. “그래도 나서 준 건 고마워요.”', 'sad'); }},
  {label:'종이에 사용 흐름을 그려서 보여 준다', sub:'실무가 높을수록 설득력이 있다', run(S){ lvSet(S, 'hajin', 'k2', 'paper');
    if(S.st.skill >= 50) return _lsa(S, 'hajin', 8, {skill:1.5, work:1}, '가게 계산대 영수증 뒷면에 주문부터 정산까지 흐름을 네 칸으로 그렸다. 사장님이 연필을 빼앗아 중간에 동그라미를 쳤다. “이 단계가 제일 번거로워요.” 그 한마디로 시연은 상담이 되었고 두 번째 약속이 잡혔다.', 'surprised');
    return _lsa(S, 'hajin', 3, {skill:0.5}, '종이에 그려 보였지만 순서가 복잡해서 사장님이 고개를 갸웃했다. 하진은 한숨을 눌러 참으며 “괜찮아요, 다음에 보완할게요”라고 했다. 미안한 마음이 오래 갔다.'); }},
  {label:'조용히 서 있으며 하진을 기다려 준다', sub:'호감 소폭↑ · 스트레스 -1', run(S){ lvSet(S, 'hajin', 'k2', 'wait'); return _lsa(S, 'hajin', 4, {stress:-1}, '하진은 다섯 번째 재부팅 끝에 서버를 되살렸다. 시연은 짧았고 흠집이 남았지만 사장님은 “고생하셨어요” 하며 명함을 받았다. 가게 문을 나서자 그가 길게 숨을 내쉬었다. “내가 혼자 하는 줄 알았는데, 옆에 누가 있었네요.”'); }},
 ]},

{id:'ls_hajin_3', lover:'hajin', cond:S => isMet(S, 'hajin') && afterEv(S, 'ls_hajin_2', 2) && affOf(S, 'hajin') >= 30 && S.m < 92,
 speaker:'윤하진', title:'런웨이 석 달', place:'night', img:'art/bg_office.webp', cut:'hajin', cutVar:'b',
 beats:[
  '밤 열 시, 사무실 불이 켜져 있다. 하진이 모니터 앞에서 엑셀 파일 하나를 보고 얼어붙어 있다.',
  '내가 들어서자 그가 황급히 창을 닫는다. 하지만 이미 보았다. 통장 잔고와 석 달 뒤 날짜에 붉은 줄이 그어진 표.',
  '“팀원들은 몰라요. 알면 다 불안해할 테니까.” 직설적인 사람이 처음으로 목소리를 낮춘다. “비밀로 해 줄 수 있어요?”',
 ],
 text:S => `마흔의 나는 이 회사의 이름이 큰 성공을 한다고 기억한다. 하지만 지금 눈앞의 그는 석 달 뒤를 장담하지 못하는 청년이다. ${S.name}, 어떻게 할까?`,
 choices:[
  {label:'비밀을 지키며 비용 절감안을 같이 짠다', sub:'실무가 높을수록 해법이 나온다', run(S){ lvSet(S, 'hajin', 'k3', 'secret'); lvSet(S, 'hajin', 'runway', 'kept');
    if(S.st.skill >= 45) return _lsa(S, 'hajin', 7, {skill:1.5, work:1, stress:3}, '새벽 두 시까지 지출 항목을 하나씩 지우고 합쳤다. 서버 비용을 절반으로 줄이는 방법을 찾아냈을 때 하진이 의자를 뒤로 젖히고 웃었다. “이걸 석 달이 아니라 여섯 달로 만들었네요. …고마워요, 진짜.”', 'happy');
    return _lsa(S, 'hajin', 3, {stress:4}, '새벽까지 같이 표를 붙잡았지만 속 시원한 답은 없었다. 그래도 하진은 노트북을 덮으며 말했다. “혼자 보던 숫자를 둘이서 보니 덜 무섭네요.” 비밀을 나눈 무게가 둘 사이에 단단히 얹혔다.'); }},
  {label:'팀원들에게도 알리자고 설득한다', sub:'도전이 높을수록 그가 결국 받아들인다', run(S){ lvSet(S, 'hajin', 'k3', 'tell'); lvSet(S, 'hajin', 'runway', 'told');
    if(S.st.dare >= 45) return _lsa(S, 'hajin', 8, {dare:1.5, bond:1}, '“숨기면 아는 사람은 불안하고, 모르는 사람은 억울해요. 같은 배면 같이 타야죠.” 하진이 화를 낼 줄 알았는데, 한참 후에 고개를 끄덕였다. “…다음 주 전체 미팅에서 말할게요.” 말하던 날 팀원들은 놀랐지만 아무도 떠나지 않았다.', 'serious');
    return _lsa(S, 'hajin', -3, {stress:6}, '“그걸 지금 말하라고요?” 하진이 날카롭게 받아쳤다. 설득하려 했지만 목소리에 힘이 없었다. 그는 한동안 말을 하지 않다가 “생각해 볼게요”라고만 답했다. 서로의 의도는 같았는데 온도가 달랐다.', 'sad'); }},
  {label:'아는 미래를 힌트로 흘린다', sub:'호감↑ · 선명도 -6', run(S){ lvSet(S, 'hajin', 'k3', 'hint'); lvSet(S, 'hajin', 'runway', 'hinted'); S.borrowed++; return _lsa(S, 'hajin', 4, {clarity:-6}, '“지금 만드는 이 기능 말고, 반년 뒤에 모두가 찾게 될 쪽으로 방향을 틀어 봐요.” 하진의 눈이 번뜩였다. 그는 노트에 쓰다 말고 물었다. “이걸 어떻게 알아요?” 나는 웃으며 얼버무렸다. 기억의 한 조각이 닳아 없어진 느낌이 남았다.', 'surprised'); }},
 ]},

{id:'ls_hajin_4', lover:'hajin', cond:S => isMet(S, 'hajin') && afterEv(S, 'ls_hajin_3', 2) && affOf(S, 'hajin') >= 30 && S.m < 100,
 speaker:'윤하진', title:'구경이 아니라 같이 틀리는 일', place:'night', img:'art/bg_office.webp', cut:'hajin', cutVar:'b',
 beats:[
  '데모데이 전날 새벽. 핵심 개발자가 퇴사 통보를 남기고 떠났고, 투자자는 불리한 조항이 가득한 계약서를 보냈다.',
  '하진이 계약서를 쥔 채 서성인다. “이거라도 받아야 해요. 안 받으면 다음은 없어요.”',
  `내가 조항 하나를 짚으려 하자 그가 소리를 높인다. “넌 항상 답을 아는 사람처럼 말하지. 내가 틀리는 걸 구경하는 거예요?”`,
 ],
 text:S => `사무실이 조용해진다. 하진도 말을 뱉고는 숨을 삼킨다. 극한의 피로가 만든 말이라는 걸 알지만, 상처는 상처다. ${S.name}, 어떻게 할까?`,
 choices:[
  {label:'“구경이 아니라 같이 틀리려고 여기 있는 거예요”', sub:'도전이 높을수록 그의 날을 무디게 한다', run(S){ lvSet(S, 'hajin', 'k4', 'together');
    if(S.st.dare >= 50) return _lsa(S, 'hajin', 8, {dare:1.5, bond:2}, '나는 눈을 피하지 않고 말했다. 하진이 계약서를 책상에 내려놓고 얼굴을 손바닥으로 문질렀다. “…미안. 내가 제일 무서운 건 틀리는 게 아니라 혼자 틀리는 거였어요.” 그의 목소리가 처음으로 갈라졌다.', 'tender');
    return _lsa(S, 'hajin', 1, {stress:5}, '말은 했지만 목소리가 떨려서 힘이 실리지 않았다. 하진은 “알아요. 알지만 지금은 못 들어요”라고 말하고 창가로 돌아섰다. 마음은 닿았지만 때가 맞지 않았다.', 'sad'); }},
  {label:'조항을 하나하나 읽고 대안을 표로 만든다', sub:'실무가 높을수록 협상판이 바뀐다', run(S){ lvSet(S, 'hajin', 'k4', 'termsheet');
    if(S.st.skill >= 50){ lvSet(S, 'hajin', 'term_sheet'); return _lsa(S, 'hajin', 9, {skill:2, work:1.5, neg:0.5}, '나는 불리한 조항 네 개에 형광펜을 긋고 각각 수정안과 양보 가능한 선을 표로 정리했다. 하진은 말없이 읽다가 투자자에게 보낼 메일 초안을 쓰기 시작했다. 새벽 다섯 시, 협상은 우리 쪽으로 반 뼘 기울었다.', 'happy'); }
    return _lsa(S, 'hajin', 3, {skill:1, stress:5}, '표를 만들었지만 법률 용어에서 몇 번 막혔다. 하진은 “그래도 어디가 문제인지 알겠어요. 이 정도면 충분해요”라고 했다. 완벽하진 않았어도 그는 계약서를 덜 무서워했다.'); }},
  {label:'“말이 심해요”라고 하고 자리를 뜬다', sub:'호감↓ · 나 +2', run(S){ lvSet(S, 'hajin', 'k4', 'walked'); return _lsa(S, 'hajin', -7, {self:2, stress:5}, '문을 닫고 나오는 복도에서 다리가 후들거렸다. 그의 말이 아팠지만 내가 선을 지킨 것도 사실이다. 한참 뒤 문자가 하나 왔다. 「…방금 건 내가 틀렸어요.」 아직 답장은 하지 못했다.', 'serious'); }},
 ]},

{id:'ls_hajin_5', lover:'hajin', cond:S => isMet(S, 'hajin') && afterEv(S, 'ls_hajin_4', 3) && (affOf(S, 'hajin') >= 55 || isCouple(S, 'hajin')) && S.m < 112,
 speaker:'윤하진', title:'사무실에서 맞은 새벽', place:'night', img:'art/bg_office.webp', cut:'hajin', cutVar:'b',
 beats:[
  '데모데이가 끝난 다음 날 새벽. 불 꺼진 사무실 바닥에 하진이 노트북을 안은 채 잠들어 있다.',
  '나는 죽이 든 봉지를 책상에 놓는다. 그가 눈을 뜨고 한참 천장을 보다가 말한다. “꿈에서도 서버가 죽더라고요.”',
  '숨을 고르듯 그가 낮게 덧붙인다. “아버지가 사업하다 망했어요. 나는 그걸 보고 자랐고, 똑같이 될까 봐 매일 도망치듯 일했어요.”',
 ],
 text:S => `${lvFlag(S, 'hajin', 'term_sheet') ? '조항을 정리해 주던 그 새벽을 기억하는 눈이다. ' : ''}${isCouple(S, 'hajin') ? '그의 손이 내 손목을 조용히 붙잡는다.' : '그가 처음으로 시선을 피하지 않고 나를 본다.'} 직설적인 사람이 약한 소리를 꺼내는 순간이다. ${S.name}, 어떤 말을 건넬까?`,
 choices:[
  {label:'“오늘은 일하지 말고 쉬어요”라고 단호하게 말한다', sub:'도전이 높을수록 그가 따라 준다', run(S){ lvSet(S, 'hajin', 'k5', 'rest');
    if(S.st.dare >= 50) return _lsa(S, 'hajin', 8, {dare:1, charm:1, stress:-4}, `“회사는 하루쯤 내가 지킬게요. 하진 선배는 오늘만 선배 말고 사람 해요.” 그가 웃음을 터뜨리다 조용해졌다. “…지시받는 거 오랜만이네.” ${isCouple(S, 'hajin') ? '그는 내 어깨에 이마를 기댄 채 한참 쉬었다.' : '그는 내 어깨 옆에 이마를 가까이 기댄 채 한참 쉬었다.'}`, 'tender');
    return _lsa(S, 'hajin', 4, {stress:-2}, '말은 단호하게 했지만 그는 결국 서너 번 시계를 확인하고 일어섰다. “고마워요. 근데 이건 마저 해야 해서.” 쉬게 하지는 못했지만 그의 마음에 닿은 건 분명했다.'); }},
  {label:'같이 밤새 서버를 붙잡았던 날을 이야기한다', sub:'실무 +1 · 호감↑', run(S){ lvSet(S, 'hajin', 'k5', 'server'); return _lsa(S, 'hajin', 6, {skill:1, bond:1}, '“그날 새벽에 서버가 되살아나는 순간, 우리 둘 다 소리를 질렀잖아요. 이 회사가 사라져도 그 순간은 내 거예요.” 하진이 눈을 감고 웃었다. “그럼 괜찮겠네. 어떻게 되든.”', 'happy'); }},
  {label:'“무서워도 돼요. 대신 혼자 무서워하지는 말아요”', sub:'호감↑↑ · 나 +2', run(S){ lvSet(S, 'hajin', 'k5', 'fear'); return _lsa(S, 'hajin', 9, {self:2, bond:2, stress:-3}, `하진이 한참 말을 고르다 낮게 내뱉었다. “나 그 말, 평생 처음 듣는 것 같아요.” ${isCouple(S, 'hajin') ? '그가 내 손가락 사이에 천천히 깍지를 꼈다.' : '그가 내 손끝에 자기 손끝을 아주 살짝 댔다.'} 죽은 식어 갔지만 아무도 일어나지 않았다.`, 'shy'); }},
 ]},

{id:'ls_hajin_6', lover:'hajin', cond:S => isMet(S, 'hajin') && afterEv(S, 'ls_hajin_5', 3) && (affOf(S, 'hajin') >= 55 || isCouple(S, 'hajin')) && S.m < 118,
 speaker:'윤하진', title:'빈 의자 하나', place:'campus', img:'art/bg_office.webp', cut:'hajin', cutVar:'a',
 beats:[
  '사무실 화이트보드에 새 문장이 적혀 있다. 「안 되면 같이 라면 먹기」. 옆에는 빨간 펜으로 그린 동그라미 하나.',
  '새로 들인 책상들 사이로 하진이 의자 하나를 끌어다 창가에 놓는다. 이름표도 서류도 없는 빈 의자다.',
  '“정식으로 입사하라는 얘기 아니에요. 그냥… 이 자리는 비워 둘게요. 당신이 언제든 앉을 수 있게.”',
 ],
 text:S => `${isCouple(S, 'hajin') ? '연인이 내미는 빈 의자는 계약서보다 무겁다.' : '고백도 청혼도 아닌 그의 방식의 약속이다.'} 하진이 직설적인 눈빛으로 나를 본다. “내 회사가 망해도 이 의자는 남겨 둘게요. …약속할래요?”`,
 choices:[
  {label:'“좋아요. 그 의자에는 가장 먼저 쓴소리하러 앉을게요”', sub:'도전·실무가 높을수록 그가 반한다', run(S){ lvSet(S, 'hajin', 'k6', 'critic'); _lsaHjDone(S, '윤하진의 사무실에 내 이름 없는 빈 의자가 생김');
    if((S.st.dare + S.st.skill) / 2 >= 50) return _lsa(S, 'hajin', 10, {dare:1, skill:1, self:3, bond:2}, '“쓴소리 대환영이에요.” 하진이 웃으며 라면 한 봉지를 책상 위에 올렸다. “첫 번째 안건, 이 회사 사훈이 너무 유치하다.” 우리는 라면 물이 끓을 때까지 사훈을 새로 썼다. 의자에 앉은 내 그림자가 길게 늘어졌다.', 'happy');
    return _lsa(S, 'hajin', 5, {self:2, bond:1}, '“그럼 그렇게 해요.” 하진이 어색하게 웃었다. 우리는 의자 둘을 마주 놓고 아무 말 없이 창밖을 보았다. 말보다 빈자리가 더 많은 말을 했다.', 'shy'); }},
  {label:'“의자보다 먼저, 이번 달 월급부터 챙겨요”', sub:'실무 +1 · 호감↑', run(S){ lvSet(S, 'hajin', 'k6', 'salary'); _lsaHjDone(S, '윤하진에게 직원 월급부터 챙기라고 잔소리하고 빈 의자를 약속받음'); return _lsa(S, 'hajin', 7, {skill:1, work:1}, '“…하, 정곡이네.” 하진이 이마를 짚고 웃다가 화이트보드 구석에 「월급 먼저」라고 적었다. 그리고 의자 등받이에 손을 얹었다. “그래도 이 자리는 비워 둘 거예요. 월급 다음으로.”', 'happy'); }},
  {label:'아무 말 없이 의자에 앉아 본다', sub:'호감↑ · 스트레스 -5', run(S){ lvSet(S, 'hajin', 'k6', 'sit'); _lsaHjDone(S, '윤하진의 빈 의자에 처음 앉아 봄'); return _lsa(S, 'hajin', 8, {stress:-5, self:2}, `의자에 앉자 창으로 해가 쏟아졌다. 하진이 한참 서서 나를 바라보다 낮게 말했다. “이 그림이 계속 보이면 좋겠다.” ${isCouple(S, 'hajin') ? '그가 허리를 숙여 내 이마에 짧게 입을 맞췄다.' : '그가 손을 들어 내 머리카락에 닿으려다 멈추고 어색하게 헛기침을 했다.'}`, 'shy'); }},
 ]},
];
LSTORY.push(...LSTORY_A)
