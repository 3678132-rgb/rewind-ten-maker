// 아이돌 메인 스토리 6~10장 (2021~2026) + 피날레·2회차 + 위기 랜덤 이벤트. ENGINE 구간(DOM 금지)
// 로컬 헬퍼는 _ic 접두어. 효과 → 칩 순으로 결과를 만든다.
const _ic = (S, o, text, mood, ch) => { ch = ch || []; fx(S, o, ch); const out = {text, chips:ch}; if(mood) out.mood = mood; return out; };
const _icMom = (S, d, ch) => { const b = S.mom || 0; S.mom = clamp(b + d, 0, 100); push(ch, '엄마 마음', S.mom - b); };
const _icLv = S => { const id = S.partner; return id && S.love && S.love[id] && S.love[id].stage >= 1 && LOVERS[id] ? id : null; };
const _icLvName = S => { const id = _icLv(S); return id ? LOVERS[id].name : ''; };
const _icGroup = S => IDOL(S).group || GROUP_NAME;
const _icTeam = S => isIdol(S) && _icGroup(S) === GROUP_NAME; // 하린과 같은 팀(루미너스)
const _icMeet = (S, id, d, ch) => { if(!LOVERS[id]) return; if(!S.love[id]){ S.love[id] = {aff:d, stage:-1, since:S.m}; push(ch, LOVERS[id].name + ' 호감', d); } else if(S.love[id].stage !== -9) addAff(S, id, d, ch); };
const _icTruth = (S, d) => { const st = SS(S); st.truth = Math.min(10, (st.truth || 0) + d); };
const _icWeak = S => ['work', 'bond', 'self'].sort((a, b) => S[a] - S[b])[0];
const _icFans = (S, n, ch) => { if(isIdol(S)) addFans(S, n, ch); };
const _icScan = (S, d, ch) => { if(isIdol(S)) addScandal(S, d, ch); };
const _icHarin = {speaker:RIVAL, cut:'harin'};

const STORY_C = [
// ════════ 6장 열애설 (2021) ════════
{id:'st_6_1', m:61, exp:5, speaker:'', place:'night', img:'art/bg_dorm.webp', title:'새벽 두 시의 사진',
  beats:[
    '2021년 봄, 새벽 두 시. 휴대폰이 쉬지 않고 울렸다.',
    '사진 한 장이 돌고 있었다. 모자를 눌러쓴 여자가 차에서 내리는 흐린 사진. 사람들은 그게 나라고 했다.',
    '아침 여덟 시, 문자가 한 통 더 왔다. “오늘 오전 중으로 어떻게 할지 정하자.”',
  ],
  text:S => { const id = _icLv(S), n = _icLvName(S);
    if(id && isIdol(S)) return `사진 속 차는 ${n}의 차가 맞다. 기사 제목은 「${_icGroup(S)} 서윤, 심야 데이트」. 회사는 부인하자고 한다. ${josa(n, '은', '는')} “네가 정하는 대로 할게.”라고 문자를 보냈다. 어떻게 할까?`;
    if(id) return `사진 속 사람은 정말 ${josa(n, '과', '와')} 나였다. 커뮤니티에 ‘데뷔도 못 한 연습생 출신이 연애나 한다’는 글이 올라왔다. 다음 주에 중요한 무대가 있다. 어떻게 할까?`;
    if(isIdol(S)) return '사진 속 사람은 내가 아니다. 그날 나는 숙소에서 자고 있었다. 그런데 기사는 벌써 서른 개가 넘었고, 댓글은 이미 나를 거짓말쟁이로 정했다. 어떻게 할까?';
    return `사진 속 사람은 내가 아니다. 그래도 커뮤니티에 ‘전 ${AGENCY} 연습생이 방출된 진짜 이유’라는 글이 올라왔다. 다음 주에 중요한 무대가 있다. 어떻게 할까?`; },
  choices:[
    {label:'정면으로 사실을 밝힌다', sub:'연애 중이면 공개 · 팬 - · 스캔들 위험 - · 마음 +', run(S){ const ch = [], id = _icLv(S), n = _icLvName(S);
      if(id){ SF(S).datingPublic = id; addAff(S, id, 8, ch); _icFans(S, -fansOf(S) * 0.08, ch); _icScan(S, -15, ch);
        return _ic(S, {self:3, stress:4}, `“네, 만나고 있습니다.” 입장이 나간 뒤 팬 카페에 탈퇴 글이 줄을 이었다. 그래도 그 주말, ${josa(n, '과', '와')} 처음으로 낮에 같은 길을 걸었다.`, 'tender', ch); }
      _icScan(S, -10, ch);
      return _ic(S, {self:2, stress:3, neg:1}, '“사진 속 사람은 제가 아닙니다. 그날 밤 숙소 CCTV도 있습니다.” 직접 쓴 글에 사람들이 조금씩 돌아섰다. 사과하는 기사는 하나도 없었다.', 'serious', ch); }},
    {label:'회사 뜻대로 부인하고 조용히 넘긴다', sub:'팬은 지킨다 · 스캔들 위험 + · 마음 -', run(S){ const ch = [], id = _icLv(S), n = _icLvName(S);
      if(id){ addAff(S, id, -5, ch); _icScan(S, 8, ch);
        return _ic(S, {self:-2, stress:3}, `「사실무근」 네 글자짜리 입장문이 나갔다. ${josa(n, '은', '는')} “괜찮아.”라고만 답했다. 그 뒤로 답장이 조금씩 짧아졌다.`, 'sad', ch); }
      _icScan(S, 4, ch);
      return _ic(S, {self:-1, stress:-2}, isIdol(S) ? '짧은 부인 기사 하나로 일은 덮였다. 다만 댓글창의 “그래도 뭔가 있겠지”는 지워지지 않았다.' : '아무 말도 하지 않았다. 소문은 한 달쯤 따라다니다 사라졌다. 그 한 달 동안 무대 두 개를 망쳤다.', undefined, ch); }},
    {label:'당분간 모든 연락을 끊고 연습만 한다', sub:'연애 중이면 이별 · 실력 + · 관계 -', run(S){ const ch = [], id = _icLv(S), n = _icLvName(S);
      if(id && !S.married){ S.love[id].stage = -9; S.partner = null; _icScan(S, -12, ch);
        return _ic(S, {work:3, bond:-4, stress:6}, `“우리 잠깐 멈추자.” 내가 먼저 말했다. ${josa(n, '은', '는')} 오래 대답이 없다가 “알았어.” 한마디를 보냈다. 그날 밤 연습실 거울 속 내 얼굴이 낯설었다.`, 'sad', ch); }
      if(id){ addAff(S, id, -6, ch); _icScan(S, -6, ch); return _ic(S, {work:2, bond:-2, stress:4}, '한 달 동안 따로 지냈다. 소문은 식었다. 다시 만난 날, 서로 조금 어색하게 웃었다.', undefined, ch); }
      return _ic(S, {work:3, skill:1.5, bond:-2, stress:3}, '휴대폰을 서랍에 넣고 한 달 동안 연습실에서 살았다. 소문은 저절로 식었다. 동기들 생일은 전부 놓쳤다.', undefined, ch); }},
  ]},

{id:'st_6_2', m:64, exp:5, speaker:'오 실장', cut:'teamlead', place:'cafe', img:'art/bg_office.webp', title:'서류 두 장',
  beats:[
    '7월, 스타라이트 엔터 회의실. 오랜만에 오 실장이 나를 불렀다.',
    '테이블 위에 서류 두 장이 놓여 있다. 한 장은 일정표, 한 장은 서약서.',
    '“회사도 투자한 만큼 돌려받아야 해. 서명하면 기회를 줄게. 대신 조건이 있어.”',
  ],
  text:S => isIdol(S)
    ? '일정표에는 하반기 쉬는 날이 하루도 없다. 서약서에는 연애, 개인 SNS, 밤 외출 금지. 서명하면 다음 앨범 센터를 주겠다고 한다.'
    : '오 실장은 회사 신인 연습생들의 보컬 트레이너 자리를 제안했다. 월급은 적지만 고정이다. 조건은 2년 동안 다른 오디션을 보지 않는 것.',
  choices:[
    {label:'서명한다', sub:'실력 + · 기회(센터·고정 수입) · 마음 - · 스트레스 +', run(S){ const ch = [];
      if(isIdol(S)){ SF(S).center = true; _icFans(S, 1.5, ch); _icScan(S, -8, ch); return _ic(S, {work:4, self:-3, stress:8}, '펜이 생각보다 가볍게 움직였다. 다음 앨범 티저에서 내 얼굴이 맨 가운데 있었다. 대신 그해 가을, 하늘을 본 기억이 없다.', undefined, ch); }
      SF(S).trainerJob = true; _icMom(S, 3, ch); return _ic(S, {cash:60, work:2, know:2, self:-2}, '첫 월급 명세서를 사진 찍어 엄마에게 보냈다. 연습생들 노래를 고쳐 주는 동안 내 노래는 조금씩 멀어졌다.', undefined, ch); }},
    {label:'조건을 바꾸자고 협상한다', sub:'예능감 + · 반은 얻고 반은 잃는다', run(S){ const ch = [];
      if(isIdol(S)){ _icFans(S, 0.5, ch); return _ic(S, {dare:2, neg:1, work:2, stress:3}, '“한 달에 이틀은 쉬게 해 주세요. 그럼 서명할게요.” 오 실장이 한참 보다가 펜으로 두 줄을 그었다. 센터는 다음 기회로 밀렸다.', undefined, ch); }
      return _ic(S, {dare:2, neg:1, cash:30, stress:3}, '“오디션 금지는 빼 주세요.” 오 실장이 웃었다. “그럼 월급은 반.” 그래도 문은 열어 둔 채로 일을 시작했다.', undefined, ch); }},
    {label:'서명하지 않는다', sub:'마음 + · 스트레스 - · 기회 -', run(S){ const ch = [];
      if(isIdol(S)){ SF(S).refusedPledge = true; _icFans(S, -0.5, ch); return _ic(S, {self:4, stress:-3, work:-1}, '“제 시간은 제가 지킬게요.” 오 실장은 서류를 접었다. 다음 앨범에서 내 파트는 여덟 마디가 줄었다.', undefined, ch); }
      return _ic(S, {self:4, stress:-3, work:-1}, '“아직은 제 노래를 하고 싶어요.” 오 실장은 명함만 남기고 갔다. 그날 밤 버스킹 무대 앞 관객은 일곱 명이었다.', undefined, ch); }},
  ]},

Object.assign({}, _icHarin, {id:'st_6_3', m:67, exp:5, place:'night', img:'art/bg_practice.webp', title:'하린의 계약서',
  beats:[
    '10월, 밤 열한 시의 연습실. 불 꺼진 거울 앞에 하린이 혼자 앉아 있었다.',
    '손에 든 건 다른 회사의 계약서였다. 계약금 칸의 숫자가 컸다.',
    '“아빠 빚, 아직 다 못 갚았어요. 이걸로 끝낼 수 있어요. 대신 지금 회사를 떠나야 해요.”',
  ],
  text:S => {
    const head = _icTeam(S) ? `하린이 빠지면 ${GROUP_NAME}는 노래 절반을 다시 나눠야 한다.` : isIdol(S) ? '우리는 다른 무대에 서는 사이다. 그런데도 하린은 이 얘기를 나에게 제일 먼저 했다.' : `데뷔도 못 한 나에게 ${GROUP_NAME}의 서하린이 이걸 털어놓는다.`;
    const mood = rivalState(S) === 'ally' ? '하린의 목소리가 떨렸다.' : rivalState(S) === 'enemy' ? '자존심 센 하린이 나에게 이런 말을 한다는 것 자체가 이상했다.' : '하린은 내 눈을 보지 않았다.';
    return `${head} ${mood} “서윤 씨라면 어떻게 할래요?”`; },
  choices:[
    {label:'빚을 같이 갚을 방법을 찾자고 한다', sub:'하린 관계 +3 · 관계 + · 자금 -40', run(S){ const ch = []; SF(S).harinDebtHelp = true; rivalMood(S, 3, ch);
      return _ic(S, {cash:-40, bond:2, stress:2}, '둘이 밤새 빚 명세서와 계약서를 나란히 놓고 계산했다. 회사에 선급금을 요청하는 편지도 같이 썼다. 하린은 남았고, 내 통장은 조금 가벼워졌다.', 'tender', ch); }},
    {label:'“하린 씨 인생이에요. 원하는 쪽으로 가요.”', sub:'하린 관계 +2 · 마음 +', run(S){ const ch = []; rivalMood(S, 2, ch);
      return _ic(S, {self:2, ins:1}, '하린은 그 계약서를 들고 대표실에 들어갔다. 한 시간 뒤 나와서 말했다. “선급금 받았어요. 대신 3년 더 묶였어요.” 웃는 얼굴이 조금 지쳐 보였다.', undefined, ch); }},
    {label:'“지금 떠나면 안 돼요.”라고 막는다', sub:'하린 관계 -3 · 실력 + · 팀은 지킨다', run(S){ const ch = []; rivalMood(S, -3, ch);
      return _ic(S, {work:2, bond:_icTeam(S) ? 1 : -1, stress:3}, '“쉽게 말하네요.” 하린은 계약서를 반으로 찢었다. 회사에는 남았지만, 다음 날부터 연습실에서 나와 눈을 마주치지 않았다.', 'serious', ch); }},
  ]}),

{id:'st_6_4', m:70, exp:5, speaker:'엄마', img:'art/mom.webp', place:'room', title:'엄마의 스크랩북',
  beats:[
    '2022년 1월, 오랜만에 엄마 집에 갔다. 엄마는 시장에 가고 없었다.',
    '안방 서랍을 열었다가 손이 멈췄다. 두꺼운 스크랩북. 내 이름이 나온 종이란 종이는 다 붙어 있었다. 나쁜 댓글을 인쇄한 장도 있었다.',
    '마지막 장 사이에 작은 유리 조각이 끼워져 있었다. 안에서 호박색 모래가 반짝였다. 시계 조각이었다.',
    '현관문이 열렸다. “어, 왔어?” 엄마가 장바구니를 내려놓다가 내 손의 스크랩북을 봤다.',
  ],
  text:S => {
    const m = S.mom || 0;
    const t = m >= 60 ? '엄마가 쑥스럽게 웃었다. “나쁜 말 쓴 사람들 아이디 다 적어 놨어. 언젠가 혼내 주려고.” 나를 반대하던 엄마가 이제 제일 먼저 내 편을 든다.'
      : m >= 35 ? '엄마가 스크랩북을 빼앗듯 덮었다. “그냥… 신경 쓰여서.” 응원한다는 말은 아직 못 하지만, 엄마는 다 보고 있었다.'
      : '“그래서 내가 하지 말랬잖아.” 엄마 목소리가 떨렸다. 화가 난 게 아니었다. 무서웠던 거다.';
    return `${t} 유리 조각은 엄마도 처음 보는 거라고 했다.`; },
  choices:[
    {label:'엄마를 꼭 안는다', sub:'시계 조각 · 엄마 마음 + · 관계 +', run(S){ const ch = []; givePiece(S, ch); _icMom(S, 8, ch); return _ic(S, {bond:3, stress:-4}, '엄마 등이 생각보다 작았다. “밥 먹고 가.” 엄마가 내 등을 두 번 두드렸다.', 'happy', ch); }},
    {label:'나쁜 댓글 종이를 같이 버리자고 한다', sub:'시계 조각 · 마음 + · 스트레스 -', run(S){ const ch = []; givePiece(S, ch); _icMom(S, 4, ch); return _ic(S, {self:3, stress:-6}, '둘이 마당에서 종이를 찢어 버렸다. 엄마가 처음으로 소리 내어 웃었다. “속이 다 시원하네.”', 'happy', ch); }},
    {label:'“이제 이런 거 보지 마.”라고 화를 낸다', sub:'시계 조각 · 엄마 마음 - · 멘탈 +', run(S){ const ch = []; givePiece(S, ch); _icMom(S, -4, ch); return _ic(S, {ins:2, self:1, stress:2}, '“엄마 마음 다쳐.” 말은 맞았는데 말투가 틀렸다. 엄마는 스크랩북을 다시 서랍에 넣었다. 버리지는 않았다.', 'sad', ch); }},
  ]},

// ════════ 7장 월드투어 (2022) ════════
{id:'st_7_1', m:73, exp:5, speaker:'', place:'stage', img:'art/bg_stage.webp', title:'첫 해외 무대',
  beats:[
    '2022년 4월, 인천공항. 여권 사진 속 나는 스물여섯이다.',
    '비행기 창밖으로 구름이 지나갔다. 마흔의 나는 해외에 딱 한 번 가 봤다. 그것도 회사 워크숍이었다.',
    '도착한 공연장 앞에 낯선 글자로 쓴 플래카드가 걸려 있었다. 그 사이에 한글로 쓴 내 이름이 있었다.',
  ],
  text:S => { const f = fansOf(S), g = _icGroup(S);
    if(isIdol(S) && f >= 30) return `${g} 첫 월드투어. 열두 개 도시, 두 달. 첫 공연장 만 석이 매진됐다. 리허설까지 여섯 시간 남았다. 그 시간을 어떻게 쓸까?`;
    if(isIdol(S) && f >= 8) return `${g} 첫 아시아 쇼케이스. 세 개 도시, 공연장마다 이천 석. 표가 반쯤 팔렸다는 소식에 다들 말이 없어졌다. 리허설까지 여섯 시간. 어떻게 쓸까?`;
    if(isIdol(S)) return `${g}의 첫 해외 무대는 한국 문화 축제의 낮 공연이다. 관객은 수백 명. 그래도 해외 무대다. 리허설까지 여섯 시간. 어떻게 쓸까?`;
    return '무소속인 내가 해외에 온 건 작은 음악 축제의 거리 공연 때문이다. 비행기 값은 알바비로 냈다. 무대는 길거리지만 관객은 진짜다. 어떻게 준비할까?'; },
  choices:[
    {label:'현지 말로 인사를 외운다', sub:'팬소통 + · 팬 + · 체력 -', run(S){ const ch = []; addFans(S, isIdol(S) ? 1 + fansOf(S) * 0.04 : 0.3, ch);
      return _ic(S, {neg:3, hp:-5, stress:2}, isIdol(S) ? '밤새 외운 인사 세 줄. 첫마디를 하자 객석이 함성으로 뒤집혔다. 발음이 틀린 단어까지 따라 외쳐 주었다.' : '서툰 현지 말 인사에 지나가던 사람들이 걸음을 멈췄다. 그날 찍힌 영상이 그 나라 SNS에서 조금 돌았다.', 'happy', ch); }},
    {label:'고난도 안무를 하나 더 넣는다', sub:'댄스·실력 + · 부상 위험', run(S){ const ch = [];
      if(R() < 0.35 - S.hp / 400) return _ic(S, {skill:1, hp:-12, stress:6}, '마지막 점프에서 발목이 꺾였다. 끝까지 웃으며 췄고, 숙소에 와서야 얼음을 댔다.', 'sad', ch);
      _icFans(S, 0.8 + fansOf(S) * 0.02, ch); return _ic(S, {skill:3, work:3, hp:-6}, '안무가 끝나자 객석이 몇 초 동안 조용했다. 그다음에 박수가 쏟아졌다.', 'happy', ch); }},
    {label:'하루쯤 같이 온 사람들과 도시를 걷는다', sub:'관계 + · 마음 + · 연습 -', run(S){ const ch = [];
      if(_icTeam(S)){ rivalMood(S, 1, ch); return _ic(S, {bond:4, self:2, stress:-6, work:-1}, '새벽 시장에서 다섯 명이 같은 국수를 먹었다. 하린이 처음으로 사진을 같이 찍자고 했다.', 'happy', ch); }
      return _ic(S, {bond:4, self:2, stress:-6, work:-1}, '같이 온 사람들과 낯선 골목을 걸었다. 그날 찍은 사진이 그해 가장 좋아하는 사진이 됐다.', 'happy', ch); }},
  ]},

{id:'st_7_2', m:76, exp:5, speaker:'지석 매니저', cut:'jiseok', place:'night', img:'art/bg_dorm.webp', title:'욕실 바닥',
  beats:[
    '7월. 쉬는 날 없이 달린 지 마흔 날째. 오늘이 무슨 요일인지 헷갈리기 시작했다.',
    '샤워를 하다가 그냥 바닥에 주저앉았다. 물이 계속 떨어지는데 일어날 힘이 없었다.',
    '문 밖에서 누가 두드렸다. 지석 매니저 오빠였다. “서윤아, 괜찮아? 삼십 분째 물소리만 나.”',
  ],
  text:S => { const bad = S.stress >= 60 || S.hp < 40;
    const t = bad ? '요즘 무대에서 웃는 게 일처럼 느껴진다. 가사가 머릿속에서 하얗게 지워진 적도 두 번 있었다.' : '아직은 버틸 만하다. 그래도 몸이 먼저 신호를 보내고 있다.';
    return `${t} ${isIdol(S) ? '남은 투어 일정이 아직 많다.' : '다음 주에도 알바와 공연이 꽉 차 있다.'} 지석 오빠가 조심스럽게 물었다. “일정, 조금 뺄까?”`; },
  choices:[
    {label:'활동을 잠시 멈추고 쉰다', sub:'마음 + · 스트레스 -- · 체력 + · 팬 -', run(S){ const ch = [];
      if(isIdol(S)){ _icFans(S, -fansOf(S) * 0.05, ch); return _ic(S, {self:5, stress:-20, hp:15, work:-2}, '회사가 「건강상의 이유로 일부 일정 불참」 공지를 냈다. 두 주 동안 엄마 집에서 잠만 잤다. 돌아오니 응원봉 불빛이 그대로 있었다.', 'tender', ch); }
      return _ic(S, {self:5, stress:-20, hp:15, work:-2, cash:-20}, '알바도 공연도 두 주 쉬었다. 통장은 비었지만 다시 노래가 하고 싶어졌다.', 'tender', ch); }},
    {label:'버틴다. 일정은 끝까지', sub:'실력 + · 팬 + · 체력 -- · 스트레스 ++', run(S){ const ch = []; SF(S).pushedThrough = true; _icFans(S, 1.5, ch);
      return _ic(S, {work:4, hp:-12, stress:12, self:-2}, '“괜찮아요. 내일 무대 있잖아요.” 물을 끄고 일어났다. 다음 날 무대는 완벽했다. 내려오자마자 아무것도 기억나지 않았다.', 'serious', ch); }},
    {label:'상담을 받으며 일정을 줄인다', sub:'자금 - · 멘탈 + · 스트레스 -', run(S){ const ch = []; _icFans(S, -0.3, ch);
      return _ic(S, {cash:-25, ins:3, stress:-10, self:2, work:-1}, '상담 선생님이 말했다. “쉬는 것도 일정이에요. 달력에 적어요.” 일주일에 하루, 달력에 빨간 동그라미를 그렸다.', undefined, ch); }},
  ]},

{id:'st_7_3', m:79, exp:5, speaker:'엄마', place:'room', img:'art/bg_hospital.webp', title:'엄마의 입원',
  beats:[
    '10월, 리허설 중에 모르는 번호로 전화가 왔다. 병원이었다.',
    '“어머님이 시장에서 쓰러지셔서 응급실에 오셨어요. 지금은 의식이 있으세요. 수술이 필요할 수 있습니다.”',
    '마흔의 나는 엄마가 처음 입원했을 때 일 때문에 하루 늦게 갔다. 그 하루를 오래 후회했다.',
  ],
  text:S => { const head = isIdol(S) ? `오늘 저녁엔 ${_icGroup(S)} 공연이 있다. 관객은 이미 입장 줄을 서 있다. 병원까지는 차로 두 시간.` : '오늘 저녁엔 내가 처음으로 메인을 맡은 소극장 공연이 있다. 병원까지는 차로 두 시간.';
    return `${head} ${(S.mom || 0) >= 50 ? '간호사 휴대폰으로 엄마 문자가 왔다. “엄마 괜찮아. 공연 해.”' : '엄마에게선 연락이 없다. 아직도 내 일을 반대하는 엄마가 혼자 누워 있다.'}`; },
  choices:[
    {label:'공연을 취소하고 병원으로 간다', sub:'엄마 마음 ++ · 관계 + · 팬 - · 위약금', run(S){ const ch = []; SS(S).momStage = Math.max(SS(S).momStage || 0, 1); _icMom(S, 12, ch); _icFans(S, -fansOf(S) * 0.04, ch);
      return _ic(S, {bond:4, self:2, cash:-30, work:-1}, '수술실 앞 의자에서 밤을 새웠다. 마취에서 깬 엄마가 처음 한 말은 “공연은?”이었다. 나는 웃으면서 울었다.', 'sad', ch); }},
    {label:'공연을 하고 새벽에 달려간다', sub:'엄마 마음 + · 실력 + · 체력 --', run(S){ const ch = []; SS(S).momStage = Math.max(SS(S).momStage || 0, 1); _icMom(S, 5, ch); _icFans(S, 0.5, ch);
      return _ic(S, {work:2, hp:-12, stress:6}, '앵콜이 끝나자마자 무대 옷 그대로 차에 탔다. 새벽 세 시 병실, 자는 엄마 손을 잡자 엄마가 눈을 감은 채 꽉 쥐었다.', 'tender', ch); }},
    {label:'영상통화로 엄마에게 무대를 보여 준다', sub:'엄마 마음 ± · 팬 + · 스트레스 +', run(S){ const ch = []; SS(S).momStage = Math.max(SS(S).momStage || 0, 1); const ok = (S.mom || 0) >= 50; _icMom(S, ok ? 3 : -3, ch); _icFans(S, 1, ch);
      return _ic(S, {stress:8, sense:2}, ok ? '간호사가 엄마 침대 위에 휴대폰을 세워 주었다. 화면 속 엄마가 링거 꽂은 손으로 작게 박수를 쳤다.' : '엄마는 영상통화를 받지 않았다. 다음 날 병실에 가자 엄마가 말했다. “바쁜 사람이 뭘 와.” 그 말이 오래 걸렸다.', ok ? 'tender' : 'sad', ch); }},
  ]},

{id:'st_7_4', m:82, exp:5, speaker:GRANDMA, img:'art/grandma.webp', place:'shop', title:'무대에서 쓰러진 사람',
  beats:[
    '2023년 1월, 바쁜 한 해가 끝난 밤. 비가 오지 않았는데도 그 골목이 나타났다.',
    '약방 안은 따뜻했다. 할머니가 귤 하나를 까서 내밀었다.',
    '“요즘 많이 바빴죠. 몸은 괜찮아요? 나는 무대 위에서 쓰러진 사람을 알아요. 그 사람은 그날 뒤로 다시 무대에 서지 못했어요.”',
    '“그 사람은 일정표만 보고 살았어요. 밥 먹는 시간, 엄마한테 전화하는 시간은 표에 없었거든요.”',
  ],
  text:S => `할머니가 내 손바닥에 시계 조각 하나를 올려놓았다. “지금까지 ${SS(S).pieces}개 모았죠. 이것도 가져가요.” 그리고 내 얼굴을 보며 말했다. “요즘 제일 부족한 건 「${PILLAR[_icWeak(S)]}」이네요.” 무엇을 할까?`,
  choices:[
    {label:'“그 사람이 누구예요?”라고 묻는다', sub:'시계 조각 · 진실 + · 멘탈 +', run(S){ const ch = []; givePiece(S, ch); _icTruth(S, 1); return _ic(S, {ins:2}, '할머니는 대답 대신 귤껍질을 접었다. “언젠가 말할게요. 그 사람 얘기는 길거든요.” 할머니 손등의 작은 흉터가 내 것과 같은 자리에 있었다.', 'surprised', ch); }},
    {label:'새 달력에 쉬는 날부터 적는다', sub:'시계 조각 · 마음 + · 스트레스 -', run(S){ const ch = []; givePiece(S, ch); return _ic(S, {self:3, stress:-6}, '할머니가 볼펜을 빌려주었다. 새 달력에 쉬는 날을 먼저 칠하자 이상하게 숨이 쉬어졌다.', 'tender', ch); }},
    {label:'엄마에게 전화할 시간을 정한다', sub:'시계 조각 · 엄마 마음 + · 관계 +', run(S){ const ch = []; givePiece(S, ch); _icMom(S, 5, ch); return _ic(S, {bond:3}, '“매주 일요일 밤 아홉 시.” 할머니가 고개를 끄덕였다. “그 시간은 꼭 지켜요. 나중엔 그게 제일 남아요.”', 'tender', ch); }},
  ]},

// ════════ 8장 각자의 길 (2023) ════════
{id:'st_8_1', m:85, exp:5, speaker:'오 실장', cut:'teamlead', place:'cafe', img:'art/bg_office.webp', title:'봉투 두 개',
  beats:[
    '2023년 4월. 오 실장이 서류 봉투 두 개를 내밀었다.',
    '“하나는 솔로 앨범. 하나는 드라마 조연. 둘 다 하면 몸이 남아나지 않을 거야.”',
    '“그리고 이건 내 생각인데, 지금 하는 일도 지금이 제일 중요한 때야.”',
  ],
  text:S => isIdol(S)
    ? `솔로는 내 이름 하나로 서는 무대고, 드라마는 노래 없이 우는 연기다. 하나를 고르면 ${_icGroup(S)} 활동 일정이 그만큼 빠진다. 어떻게 할까?`
    : `무소속인 나에게 온 제안이다. 솔로 쪽은 ${INDIE_AGENCY}의 디지털 싱글, 드라마 쪽은 웹드라마 조연. 오 실장이 다리를 놓아 주었다. 어떻게 할까?`,
  choices:[
    {label:'솔로 앨범을 낸다', sub:'솔로 · 보컬 + · 실력 + · 관계 -', run(S){ const ch = []; IDOL(S).solo = true; addFans(S, isIdol(S) ? 1 + fansOf(S) * 0.05 : 0.4, ch);
      return _ic(S, {know:2, work:3, bond:-2, stress:5}, '녹음 첫날, 부스 안에 나 혼자였다. 늘 들리던 다른 목소리가 없어서 헤드폰이 이상하게 조용했다.', undefined, ch); }},
    {label:'드라마에 도전한다', sub:'배우 · 표현력 + · 체력 -', run(S){ const ch = []; IDOL(S).actor = true; addFans(S, isIdol(S) ? 0.8 : 0.3, ch);
      return _ic(S, {sense:3, ins:1, hp:-6, stress:4}, '첫 대본 리딩. 대사 한 줄에 감독이 다섯 번 컷을 외쳤다. 여섯 번째에 눈물이 진짜로 났다.', undefined, ch); }},
    {label:'지금 하는 일에 집중한다', sub:'관계 + · 마음 + · 기회는 다음으로', run(S){ const ch = []; if(_icTeam(S)) rivalMood(S, 1, ch);
      return _ic(S, {bond:4, self:2, work:1}, isIdol(S) ? '봉투 두 개를 돌려드렸다. “지금은 우리 노래가 먼저예요.” 오 실장이 오래 웃었다. 그날 밤 연습실에 다 같이 모였다.' : '“지금 하는 걸 끝까지 해 볼게요.” 봉투를 돌려드리고 연습실로 돌아갔다. 아깝다는 생각은 생각보다 오래 갔다.', undefined, ch); }},
  ]},

{id:'st_8_2', m:88, exp:5, speaker:'소연', cut:'soyeon', place:'night', img:'art/bg_practice.webp', title:'소연의 목',
  beats:[
    '7월, 연습이 끝난 밤. 소연이 물병을 내려놓고 말했다.',
    '“나 그만둘까 봐. 목이 예전 같지 않아. 병원에서 결절이래. 수술하면 반년은 노래 못 해.”',
    '분위기 메이커 소연. 연습생 첫날부터 나보다 먼저 웃던 애였다.',
  ],
  text:S => _icTeam(S) ? `소연이 빠지면 ${GROUP_NAME}는 네 명이 된다. 회사는 아직 모른다. 소연은 이 말을 나에게 제일 먼저 했다. 뭐라고 할까?`
    : isIdol(S) ? `우리는 이제 다른 무대에 서지만 소연은 여전히 나에게 먼저 전화한다. ${GROUP_NAME}에서 빠지겠다는 말도 회사보다 나에게 먼저 했다. 뭐라고 할까?`
    : '데뷔조였던 소연이 이제 그만두겠다고 한다. 데뷔를 못 한 나에게 이 말을 하는 소연의 눈이 미안해 보였다. 뭐라고 할까?',
  choices:[
    {label:'수술하고 돌아오라고, 기다리겠다고 한다', sub:'관계 ++ · 스트레스 + · 내 일정 -', run(S){ const ch = []; SF(S).soyeonBack = true;
      return _ic(S, {bond:4, stress:5, work:-1}, _icTeam(S) ? '소연 파트를 내가 나눠 불렀다. 반년 동안 목이 두 배로 피곤했다. 소연이 돌아온 날, 우리는 녹음실에서 아무 말 없이 서로를 안았다.' : '병원에 갈 때마다 같이 갔다. 반년 뒤 소연이 다시 노래했을 때, 첫 소절에서 내가 먼저 울었다.', 'tender', ch); }},
    {label:'소연이 원하는 길을 응원한다', sub:'마음 + · 관계 + · 같은 팀이면 팬 -', run(S){ const ch = []; SF(S).soyeonLeft = true; if(_icTeam(S)) _icFans(S, -fansOf(S) * 0.04, ch);
      return _ic(S, {self:2, bond:2}, '소연은 노래 대신 뮤지컬 연기를 배우기로 했다. “다른 방법으로 무대에 설래.” 마지막 날, 연습실 거울에 소연이 립스틱으로 하트를 그렸다.', 'sad', ch); }},
    {label:'지금 그만두면 후회한다고 말린다', sub:'실력 + · 소연의 마음은 알 수 없다', run(S){ const ch = [];
      if(R() < 0.5) return _ic(S, {work:2, stress:3}, '소연은 수술을 미루고 무대에 섰다. 무대는 무사히 끝났다. 대기실에서 소연이 목을 감싸고 한참 앉아 있었다.', 'serious', ch);
      SF(S).soyeonLeft = true; return _ic(S, {work:2, stress:3, bond:-2}, '“너는 내 목 상태 몰라.” 소연이 처음으로 화를 냈다. 다음 날 소연은 혼자 회사에 탈퇴하겠다고 말했다.', 'sad', ch); }},
  ]},

Object.assign({}, _icHarin, {id:'st_8_3', m:91, exp:5, place:'stage', img:'art/bg_stage.webp', title:'하린과의 마지막 승부',
  beats:[
    '10월. 하린이 먼저 나를 불렀다. 텅 빈 무대 위에 조명 하나만 켜져 있었다.',
    '“처음 만난 날 기억나요? 나는 서윤 씨를 이기는 것만 생각했어요.”',
    '“칠 년 동안 이기고 지고를 몇 번이나 했는지 몰라요. 이제 끝을 내고 싶어요. 어떤 식으로든.”',
  ],
  text:S => {
    const head = _icTeam(S) ? '다음 타이틀곡 센터를 두고 회사가 마지막 평가를 하겠다고 했다. 하린은 같이 서든지, 끝까지 붙든지 정하자고 한다.'
      : isIdol(S) ? '연말 무대에서 두 그룹이 한 곡을 같이 하게 됐다. 하린은 듀엣으로 서든지, 각자 무대로 정면 승부를 하든지 정하자고 한다.'
      : '하린은 내 작은 공연에 게스트로 서 주겠다고 했다. 받아들이면 사람들은 하린을 보러 올 것이다.';
    const r = rivalState(S) === 'ally' ? '하린의 눈이 웃고 있었다.' : rivalState(S) === 'enemy' ? '하린의 눈은 여전히 차가웠다.' : '하린의 표정은 읽을 수 없었다.';
    return `${head} ${r}`; },
  choices:[
    {label:'손을 내민다. “같이 해요.”', sub:'하린 관계 +3 · 관계 + · 마음 +', run(S){ const ch = []; SF(S).harinEnd = 'ally'; rivalMood(S, 3, ch); _icFans(S, 1, ch);
      const t = _icTeam(S) ? '센터 자리는 둘이 반씩 나눴다. 1절은 하린, 2절은 나. 엔딩 포즈에서 하린이 내 손을 잡아 올렸다.' : isIdol(S) ? '둘의 듀엣 영상이 그 주 가장 많이 본 무대가 됐다. 무대 뒤에서 하린이 말했다. “이제 라이벌 말고 동료라고 불러도 돼요.”' : '하린이 게스트로 선 날, 작은 공연장이 처음으로 꽉 찼다. 하린은 자기 노래 대신 내 노래에 화음을 넣었다.';
      return _ic(S, {bond:3, self:2}, t, 'happy', ch); }},
    {label:'끝까지 겨룬다', sub:'하린 관계 -2 · 실력 ++ · 스트레스 +', run(S){ const ch = []; SF(S).harinEnd = 'rival'; rivalMood(S, -2, ch);
      const win = (S.st.know + S.st.skill + S.st.sense) / 3 + rand(-15, 15) > 55;
      const t = !isIdol(S) ? (win ? '하린 없이 내 힘으로 객석을 채웠다. 공연이 끝나자 하린에게서 짧은 문자가 왔다. “인정.”' : '하린의 도움을 거절한 공연은 반쯤 비었다. 그래도 끝까지 내 노래로 채웠다.')
        : win ? '결과는 내 쪽이었다. 하린은 박수를 쳤지만 손이 떨렸다. “다음엔 내가 이겨요.” 그 말이 이상하게 반가웠다.' : '결과는 하린 쪽이었다. 분했지만 하린의 무대는 정말 좋았다. 그날 밤 연습실 불을 끄지 못했다.';
      return _ic(S, {work:4, skill:2, know:1, stress:6}, t, 'serious', ch); }},
    {label:'대답하지 않고 내 길을 간다', sub:'마음 + · 멘탈 + · 하린과는 거리', run(S){ const ch = []; SF(S).harinEnd = 'apart';
      return _ic(S, {self:3, ins:2, bond:-1}, '“이기고 지는 건 이제 하린 씨랑 안 할래요. 나랑 할래요.” 하린은 한참 나를 보다가 고개를 끄덕였다. 그 뒤로 우리는 서로를 덜 봤고, 덜 아팠다.', undefined, ch); }},
  ]}),

{id:'st_8_4', m:94, exp:5, speaker:'엄마', img:'art/mom.webp', place:'room', title:'엄마의 택배 상자',
  beats:[
    '2024년 1월, 엄마가 퇴원하고 처음 맞는 설. 엄마 집 현관에 택배 상자가 있었다.',
    '상자 안에는 엄마가 직접 주문한 물건이 들어 있었다.',
    '상자 바닥에서 작은 유리 조각이 굴러 나왔다. 호박색 모래가 반짝였다. 엄마는 “사은품인가?” 하며 웃었다.',
  ],
  text:S => { const m = S.mom || 0;
    const head = isIdol(S) ? `${_icGroup(S)} 공식 응원봉이다. “불 켜는 법을 모르겠어. 이거 어떻게 하는 거니?”` : '작은 휴대용 스피커다. “길에서 노래한다며. 소리가 작으면 안 되잖아.”';
    const tail = m >= 60 ? '엄마는 다음 공연 표도 벌써 샀다고 했다.' : m >= 35 ? '엄마는 쑥스러운지 그걸 등 뒤로 숨겼다.' : '“그냥 궁금해서 산 거야.” 엄마는 끝까지 응원한다는 말은 하지 않았다.';
    return `${head} ${tail}`; },
  choices:[
    {label:'엄마 옆에 앉아 사용법을 알려 준다', sub:'시계 조각 · 엄마 마음 + · 관계 +', run(S){ const ch = []; givePiece(S, ch); _icMom(S, 6, ch); return _ic(S, {bond:3, stress:-3}, '엄마가 버튼을 몇 번이고 다시 눌렀다. “이거 맞지? 이렇게 하는 거지?” 설 연휴 내내 그게 엄마 손에서 떨어지지 않았다.', 'happy', ch); }},
    {label:'꿈을 포기할 뻔했던 이야기를 조금 꺼낸다', sub:'시계 조각 · 마음 + · 엄마 마음 +', run(S){ const ch = []; givePiece(S, ch); _icMom(S, 3, ch); return _ic(S, {self:3, ins:1}, '“엄마가 반대해서 내가 그만뒀으면 어땠을까?” 엄마가 한참 생각하다 말했다. “그럼 엄마가 평생 미안했겠지.”', 'tender', ch); }},
    {label:'바빠서 하룻밤만 자고 돌아간다', sub:'시계 조각 · 실력 + · 엄마 마음 -', run(S){ const ch = []; givePiece(S, ch); _icMom(S, -3, ch); return _ic(S, {work:2, bond:-1}, '새벽 기차를 탔다. 엄마는 역까지 따라 나와 귤 봉지를 쥐여 주었다. 창밖에서 엄마가 계속 손을 흔들었다.', 'sad', ch); }},
  ]},

// ════════ 9장 할머니의 진실 (2024) ════════
{id:'st_9_1', m:97, exp:5, speaker:GRANDMA, img:'art/grandma.webp', place:'stage', title:'맨 앞줄의 할머니',
  beats:[
    '2024년 4월. 무대 위에서 객석을 보다가 숨이 멎었다.',
    '맨 앞줄에 할머니가 앉아 있었다. 약방 밖에서 할머니를 본 건 처음이었다.',
    '할머니는 노래를 따라 불렀다. 내가 아직 한 번도 공개하지 않은 노래의 가사까지.',
    '무대가 끝나고 객석으로 달려갔을 때, 의자 위에는 낡은 CD 한 장만 남아 있었다.',
  ],
  text:S => `CD 표지 속 무대 위 여자는 나와 같은 얼굴이다. 뒷면에는 「작사 서윤」이라고 적혀 있고, 표지 사인은 내 글씨체다. 나는 이 노래를 쓴 적이 없다. 아직은.${isIdol(S) ? '' : ' 그리고 이 CD 속의 나는 데뷔한 가수다.'} 어떻게 할까?`,
  choices:[
    {label:'약방으로 달려가 묻는다', sub:'진실 + · 멘탈 + · 스트레스 +', run(S){ const ch = []; SF(S).grandmaClue = true; _icTruth(S, 2); return _ic(S, {ins:2, stress:4}, '약방 문은 잠겨 있었다. 문틈에 쪽지가 끼워져 있었다. 「여름에 다 말해 줄게요. 조금만 기다려요.」', 'surprised', ch); }},
    {label:'CD를 들어 본다', sub:'진실 + · 표현력 + · 마음 -', run(S){ const ch = []; _icTruth(S, 1); return _ic(S, {sense:3, self:-1, stress:2}, '노래는 좋았다. 너무 좋아서 무서웠다. 마지막 트랙은 아무 소리 없이 끝까지 비어 있었다.', 'serious', ch); }},
    {label:'서랍에 넣고 모르는 척한다', sub:'스트레스 - · 마음 + · 진실은 나중에', run(S){ const ch = []; return _ic(S, {stress:-4, self:1}, '서랍을 닫았다. 지금은 내 무대가 먼저다. 그래도 밤마다 그 서랍이 신경 쓰였다.', undefined, ch); }},
  ]},

{id:'st_9_2', m:100, exp:5, speaker:GRANDMA, img:'art/grandma.webp', place:'shop', title:'일흔 살의 서윤',
  beats:[
    '7월. 약방 문이 열려 있었다. 할머니가 차 두 잔을 내려놓았다.',
    '“이제 말할게요. 나는 일흔 살의 서윤이에요. 당신이에요.”',
    '“첫 번째 인생에서 나는 오디션에 붙고도 포기했어요. 엄마가 반대했고, 나는 무서웠어요. 그리고 마흔 살에 비 오는 골목에서 이 약방을 만났어요. 당신이 걸어온 그 길이에요.”',
    '“두 번째 인생에서 나는 데뷔했어요. 미래를 아니까 쉬웠어요. 1위도 하고 대상도 받았어요.”',
    '“그런데 서른이 되기 전에 무대에서 쓰러졌어요. 다시는 무대에 서지 못했어요. 돌아보니 곁에 아무도 없었어요.”',
  ],
  text:S => { const who = [];
    if((S.mom || 0) >= 55) who.push('엄마'); if(rivalState(S) === 'ally') who.push('하린'); if(S.bond >= 50) who.push('소연과 동기들'); if(_icLv(S)) who.push(_icLvName(S));
    return `할머니가 내 얼굴을 오래 봤다. “지금 당신 곁에는 누가 있어요?” ${who.length ? `머릿속에 ${who.join(', ')}의 얼굴이 떠올랐다.` : '바로 떠오르는 얼굴이 없었다. 그게 무서웠다.'}`; },
  choices:[
    {label:'“왜 저한테 시계를 줬어요?”라고 묻는다', sub:'진실 + · 멘탈 +', run(S){ const ch = []; SF(S).grandmaTruth = true; _icTruth(S, 2); return _ic(S, {ins:3}, '“다른 결말을 보고 싶었어요. 나 혼자서는 못 만든 결말.” 할머니가 찻잔을 두 손으로 감쌌다.', 'serious', ch); }},
    {label:'할머니 손을 잡는다', sub:'진실 + · 마음 + · 관계 +', run(S){ const ch = []; SF(S).grandmaTruth = true; _icTruth(S, 1); return _ic(S, {self:3, bond:2, stress:-5}, '할머니 손은 차가웠고, 손등의 흉터가 내 것과 같았다. “이번엔 같이 해요.” 할머니가 처음으로 울었다.', 'tender', ch); }},
    {label:'“그럼 제 미래도 정해진 거예요?”라고 따진다', sub:'진실 + · 마음 + · 스트레스 +', run(S){ const ch = []; SF(S).grandmaTruth = true; _icTruth(S, 1); return _ic(S, {stress:5, self:2, dare:1}, '“아니요. 그래서 당신한테 준 거예요.” 할머니가 단호하게 말했다. “내 인생은 끝났지만, 당신 인생은 아직 안 정해졌어요.”', 'surprised', ch); }},
  ]},

{id:'st_9_3', m:103, exp:5, speaker:'', place:'room', img:'art/bg_room_autumn.webp', title:'할머니가 놓친 것들',
  beats:[
    '10월. 할머니가 손글씨 메모 한 장을 건넸다. 집에 돌아와서야 펼쳐 봤다. 맨 위에 「내가 놓친 것들」이라고 적혀 있었다.',
    '「엄마의 마지막 생일. 투어 중이라 영상 편지 하나만 보냈다. 그게 마지막이었다.」',
    '「소연이 결혼식. 스케줄 때문에 못 갔다. 소연은 그 뒤로 연락하지 않았다.」',
    '「하린. 대상 받던 날 무대 뒤에서 크게 싸웠다. 사과는 끝내 못 했다.」',
  ],
  text:S => {
    const a = (S.mom || 0) >= 55 ? '지금의 엄마는 일요일마다 내 전화를 기다린다.' : '지금의 나도 엄마에게 전화한 지 오래됐다.';
    const b = S.bond >= 50 ? '소연과는 어제도 문자를 주고받았다.' : '소연과는 요즘 연락이 뜸하다.';
    const c = rivalState(S) === 'ally' ? '하린과는 이제 같이 밥을 먹는 사이다.' : rivalState(S) === 'enemy' ? '하린과는 아직도 눈을 잘 마주치지 않는다.' : '하린과는 아직 애매한 사이다.';
    return `${a} ${b} ${c} 지금 무엇부터 할까?`; },
  choices:[
    {label:'지금 바로 엄마에게 전화한다', sub:'엄마 마음 + · 관계 +', run(S){ const ch = []; _icMom(S, 7, ch); return _ic(S, {bond:3, stress:-3}, '“이 시간에 웬일이야?” 엄마 목소리가 졸렸다. “그냥. 엄마 목소리 듣고 싶어서.” 엄마가 한참 웃었다.', 'tender', ch); }},
    {label:'소연에게 밥 먹자고 연락한다', sub:'관계 + · 마음 + · 체력 -', run(S){ const ch = []; return _ic(S, {bond:4, self:1, hp:-2}, '“갑자기 왜?” 소연이 물었지만 다음 날 분식집에 제일 먼저 와 있었다. 사장님이 순대를 서비스로 줬다.', 'happy', ch); }},
    {label:'하린에게 미안했던 걸 말한다', sub:'하린 관계 +3 · 마음 + · 스트레스 +', run(S){ const ch = []; rivalMood(S, 3, ch); return _ic(S, {stress:3, self:2}, '“갑자기 왜 이래요.” 하린의 답장이 바로 왔다. 그리고 한 줄이 더 왔다. “…나도 미안해요. 많이.”', 'tender', ch); }},
  ]},

{id:'st_9_4', m:106, exp:5, speaker:GRANDMA, img:'art/grandma.webp', place:'shop', title:'세 가지를 지킨다는 것',
  beats:[
    '2025년 1월. 할머니 머리가 지난번보다 더 하얘졌다.',
    '“내 시간이 얼마 안 남았어요. 그래서 마지막으로 쉽게 말해 줄게요.”',
    '“실력은 무대에 서게 해 줘요. 사람은 무대에서 내려왔을 때 기다려 줘요. 마음은 다음 날 다시 무대에 오르게 해 줘요. 나는 첫 번째만 가졌어요.”',
    '할머니가 시계 조각 하나를 내 손에 쥐여 주었다. “이제 거의 다 모았네요.”',
  ],
  text:S => { const w = PILLAR[_icWeak(S)];
    return `지금 나는 실력 ${Math.round(S.work)}, 관계 ${Math.round(S.bond)}, 마음 ${Math.round(S.self)}. 할머니가 셋 중 가장 낮은 「${w}」${josa(w, '을', '를').slice(-1)} 손가락으로 짚었다. “남은 일 년은 이걸 챙겨요.” 뭐라고 할까?`; },
  choices:[
    {label:'“할머니도 이번엔 혼자 아니에요.”', sub:'시계 조각 · 관계 + · 마음 +', run(S){ const ch = []; givePiece(S, ch); return _ic(S, {bond:2, self:2}, '할머니가 내 손을 오래 잡고 있었다. 약방 안에는 모래 떨어지는 소리만 들렸다.', 'tender', ch); }},
    {label:'가장 낮은 것부터 채우겠다고 약속한다', sub:'시계 조각 · 가장 부족한 기둥 +4', run(S){ const ch = []; givePiece(S, ch); return _ic(S, {[_icWeak(S)]:4}, '“좋아요. 그게 제일 어려운 거예요.” 할머니가 작은 수첩에 내 약속을 적었다.', undefined, ch); }},
    {label:'“할머니는 행복했어요?”라고 묻는다', sub:'시계 조각 · 멘탈 + · 스트레스 +', run(S){ const ch = []; givePiece(S, ch); return _ic(S, {ins:3, stress:2}, '“무대 위에서는요. 무대 밑에서는 아니었어요.” 할머니가 웃었다. “그러니까 당신은 둘 다 해요.”', 'serious', ch); }},
  ]},

// ════════ 10장 마지막 무대 (2025) ════════
{id:'st_10_1', m:109, exp:5, speaker:'오 실장', cut:'teamlead', place:'cafe', img:'art/bg_office.webp', title:'마지막 무대 회의',
  beats:[
    '2025년 4월. 재계약 시즌이 지나갔다. 누군가는 남았고, 누군가는 떠났다.',
    '오 실장이 화이트보드에 날짜 하나를 적었다. 「2026년 1월」.',
    '“서른이 되기 전 마지막 무대야. 어떤 무대로 할지 네가 정해.”',
  ],
  text:S => { const I = IDOL(S);
    const head = !isIdol(S) ? '데뷔는 못 했지만 오 실장이 회사 공연장을 하루 빌려주겠다고 했다. 이백 석짜리 작은 홀. 내 이름으로 서는 첫 단독 공연이다.'
      : I.solo ? `내 이름을 건 단독 콘서트. 객석은 ${fansOf(S) >= 50 ? '체조경기장' : '삼천 석 공연장'}이다.`
      : _icTeam(S) ? `${GROUP_NAME} 전원이 서는 앙코르 콘서트. 하린이 회의실 구석에서 팔짱을 끼고 서 있다.` : `${_icGroup(S)}의 마지막 콘서트다.`;
    return `${head} 무대의 중심을 무엇으로 할까?`; },
  choices:[
    {label:'내가 쓴 노래로 채운다', sub:'표현력 + · 마음 + · 흥행은 모험', run(S){ const ch = [], I = IDOL(S); SF(S).lastSet = 'own';
      if(I.songs >= 2){ if(I.songs >= 3) I.producer = true; return _ic(S, {sense:2, self:3, stress:4}, `지금까지 쓴 노래 ${I.songs}곡을 다 꺼냈다. 회사는 걱정했지만, 연습실에서 처음 불렀을 때 스태프들이 박수를 쳤다.`, 'happy', ch); }
      if(R() < 0.5) I.songs++;
      return _ic(S, {sense:2, self:3, stress:6}, '아직 완성한 노래가 부족했다. 남은 아홉 달 동안 매일 밤 한 곡씩 붙들었다.', undefined, ch); }},
    {label:'팬 투표로 노래를 정한다', sub:'팬소통 + · 팬 + · 내 색은 줄어든다', run(S){ const ch = []; SF(S).lastSet = 'fans'; addFans(S, isIdol(S) ? 1 + fansOf(S) * 0.03 : 0.3, ch);
      return _ic(S, {neg:3, self:-1}, '1위는 첫 무대에서 불렀던 노래였다. 그 노래를 다시 연습하다가 스무 살의 내가 떠올라 웃었다.', 'happy', ch); }},
    {label:'함께한 사람들의 무대로 꾸민다', sub:'관계 ++ · 하린 관계 + · 연습 시간 -', run(S){ const ch = []; SF(S).lastSet = 'people'; rivalMood(S, 1, ch);
      return _ic(S, {bond:4, work:-1}, '동기들, 하린, 지석 매니저까지 한 무대씩 나눴다. 맞춰야 할 일정이 두 배가 됐다. 그래도 회의 내내 웃음이 끊이지 않았다.', 'happy', ch); }},
  ]},

{id:'st_10_2', m:112, exp:5, speaker:'엄마', img:'art/mom.webp', place:'room', title:'초대권 두 장',
  beats:[
    '7월. 마지막 무대 초대권이 나왔다. 맨 앞줄 가운데 자리 두 장.',
    '한 장은 엄마 몫이다. 마흔의 나는 엄마를 객석에 앉혀 본 적이 없다.',
    '나머지 한 장을 누구에게 줄지는 아직 정하지 못했다.',
  ],
  text:S => { const m = S.mom || 0, n = _icLvName(S);
    const a = m >= 60 ? '엄마는 벌써 달력에 동그라미를 쳐 놓았다고 했다. “옷은 뭘 입고 가야 하니?”' : m >= 35 ? '엄마는 아직 간다고도, 안 간다고도 하지 않았다. “그날 봐서.”' : '“엄마는 그런 데 안 가.” 전화 너머 엄마 목소리가 딱딱했다. 그래도 표는 받아 두겠다고 했다.';
    const b = n ? ` 남은 한 장은 ${n}에게 줄 수도 있다.${isIdol(S) ? ' 맨 앞줄이면 사람들 눈에 띌 것이다.' : ''}` : ' 남은 한 장은 약방 할머니에게 줄 수도 있다.';
    return a + b; },
  choices:[
    {label:'엄마를 직접 찾아가 표를 건넨다', sub:'엄마 마음 ++ · 관계 + · 체력 - · 연습 -', run(S){ const ch = []; SF(S).momComes = true; _icMom(S, 10, ch);
      return _ic(S, {bond:3, hp:-4, work:-1}, '엄마가 표를 지갑 맨 안쪽에 넣었다. “잃어버리면 안 되니까.” 지갑을 닫고도 두 번이나 다시 열어 봤다.', 'tender', ch); }},
    {label:'남은 한 장을 마음 가는 사람에게 준다', sub:'연인이 있으면 호감 + · 스캔들 위험 + · 없으면 마음 +', run(S){ const ch = [], id = _icLv(S), n = _icLvName(S); SF(S).momComes = (S.mom || 0) >= 45;
      if(id){ addAff(S, id, 8, ch); _icScan(S, 8, ch); return _ic(S, {self:1}, `${josa(n, '이', '가')} 표를 받고 한참 웃었다. “맨 앞이면 너무 티 나는데.” 그래도 그날 꼭 오겠다고 했다.`, 'shy', ch); }
      SF(S).grandmaSeat = true; return _ic(S, {self:3}, '두 번째 표는 할머니 몫으로 남겨 두었다. 정말 올지는 모르겠다. 그래도 빈자리로 두고 싶지 않았다.', 'tender', ch); }},
    {label:'엄마에게 표를 우편으로 보낸다', sub:'연습 시간은 지킨다 · 엄마 마음은 엄마에게 맡긴다', run(S){ const ch = []; _icMom(S, 2, ch); SF(S).momComes = (S.mom || 0) >= 50;
      return _ic(S, {work:2, stress:-2}, '표와 함께 짧은 편지를 넣었다. 「엄마, 와 줘. 이번엔 꼭.」 답장은 오지 않았다. 대신 엄마가 전화로 날씨를 물었다.', undefined, ch); }},
  ]},

Object.assign({}, _icHarin, {id:'st_10_3', m:115, exp:5, cut2:'soyeon', place:'night', img:'art/bg_practice.webp', title:'마지막 리허설',
  beats:[
    '10월. 공연까지 석 달. 리허설이 끝난 연습실 바닥에 다 같이 누웠다.',
    '하린이 천장을 보며 말했다. “서른이 되면 뭐 하고 있을까요, 우리.”',
    '소연이 웃었다. “난 그냥 오늘처럼 이렇게 누워 있고 싶어.”',
  ],
  text:S => {
    const r = rivalState(S) === 'ally' ? '하린이 내 쪽으로 고개를 돌렸다. “앵콜 곡, 같이 정해요.”' : rivalState(S) === 'enemy' ? '하린은 끝까지 다른 쪽을 보고 누워 있었다. 그래도 같은 연습실에 있었다.' : '하린이 조용히 숨을 골랐다.';
    return `${r}${S.hp < 35 ? ' 요즘 목이 자주 잠긴다. 무리하면 안 된다는 걸 알지만 시간이 없다.' : ''} 마지막 앵콜 곡은 누구에게 바칠까?`; },
  choices:[
    {label:'엄마에게 바치는 노래로 한다', sub:'엄마 마음 + · 마음 + · 표현력 +', run(S){ const ch = []; SF(S).lastSong = 'mom'; _icMom(S, 5, ch);
      return _ic(S, {self:3, sense:1}, '가사를 고치다가 몇 번이나 펜을 놓았다. 「엄마, 그때 반대해 줘서 고마워. 덕분에 더 단단하게 왔어.」', 'tender', ch); }},
    {label:'팬들에게 바치는 노래로 한다', sub:'팬소통 + · 팬 +', run(S){ const ch = []; SF(S).lastSong = 'fans'; addFans(S, isIdol(S) ? 1 + fansOf(S) * 0.02 : 0.2, ch);
      return _ic(S, {neg:3}, '앵콜 곡 제목은 팬들이 붙여 준 별명으로 했다. 리허설에서 첫 소절만 불렀는데 스태프 몇 명이 울었다.', 'happy', ch); }},
    {label:'함께 버틴 사람들에게 바치는 노래로 한다', sub:'관계 + · 하린 관계 +2', run(S){ const ch = []; SF(S).lastSong = 'us'; rivalMood(S, 2, ch);
      return _ic(S, {bond:3}, '파트를 사람 수만큼 나눴다. 하린이 제일 높은 음을 나에게 넘겼다. “마지막은 서윤 씨가 해요.”', 'happy', ch); }},
  ]}),

{id:'st_10_4', m:118, exp:1, speaker:GRANDMA, img:'art/grandma.webp', place:'shop', title:'시계의 마지막 쓰임',
  beats:[
    '2026년 1월. 마지막 무대가 끝났다. 앵콜까지 다 부르고 나니 목소리가 거의 남지 않았다.',
    '객석의 불이 하나씩 꺼질 때까지 무대 위에 서 있었다.',
    '그날 밤, 비가 오지 않았는데도 그 골목이 나타났다. 약방 모래시계의 모래가 거의 다 떨어져 있었다.',
    '“수고했어요. 이제 이 시계를 어떻게 할지 정해요.” 할머니가 천천히 설명했다.',
    '“놓아주면 되감기는 여기서 끝나요. 이번 인생이 당신의 진짜 인생이 돼요. 곁에 두면, 엔딩을 본 뒤에 2016년으로 한 번 더 돌아갈 수 있어요. 지금 배운 것의 절반을 가지고요.”',
  ],
  text:S => { const momIn = SF(S).momComes || (S.mom || 0) >= 60;
    const a = momIn ? (isIdol(S) ? `오늘 객석 맨 앞줄에서 엄마가 ${_icGroup(S)} 응원봉을 흔들고 있었다. 엄마 입 모양이 보였다. “잘했어.”` : '오늘 작은 홀 맨 앞줄에서 엄마가 손뼉을 쳤다. 엄마 입 모양이 보였다. “잘했어.”')
      : '오늘 맨 앞줄 가운데 한 자리가 비어 있었다. 공연이 끝나고 엄마에게서 문자가 왔다. 「밖에서 들었어. 잘하더라.」';
    return `${a} 손바닥 위에 시계 조각 ${SS(S).pieces}개가 따뜻하다. 마지막 조각을 받으면 시계가 완성된다. 시계를 놓아줄까, 곁에 둘까?`; },
  choices:[
    {label:'시계를 놓아준다 — 되감기를 여기서 끝낸다', sub:'시계 조각 · 마음 + · 스트레스 - · 2회차 없음 · 도감에 ‘완결’ 표시', run(S){ const ch = []; givePiece(S, ch); SF(S).clockFree = true; delete SF(S).clockKeep;
      return _ic(S, {self:4, stress:-8, bond:2, hp:3}, '모래시계를 할머니 손에 돌려드렸다. 마지막 모래가 떨어지는 걸 끝까지 봤다. 이제부터의 시간은 되감을 수 없다. 그래서 전부 내 것이다.', 'tender', ch); }},
    {label:'시계를 곁에 둔다 — 엔딩 뒤 2회차로 이어 간다', sub:'시계 조각 · 멘탈 + · 이번 엔딩은 그대로 · 엔딩 뒤 ‘2회차’(능력치 절반·시계 조각 2개)', run(S){ const ch = []; givePiece(S, ch); SF(S).clockKeep = true; delete SF(S).clockFree;
      return _ic(S, {ins:3, self:2, stress:2, bond:1}, '시계를 주머니에 넣었다. 조금 무거웠다. “한 번 더 걸어 보고 싶어요. 이번에 놓친 걸 챙기러요.” 할머니가 고개를 끄덕였다.', 'serious', ch); }},
  ]},
];

// ── 피날레(m119)와 2회차 시작 ───────────────────────────────────
const IDOL_FINALE = {id:'finale', once:true, speaker:GRANDMA, title:'서른 살, 약방', place:'shop', img:'art/grandma.webp',
  beats:[
    '2026년 2월. 십 년의 마지막 날. 처음 이 시간으로 돌아왔던 비 오는 골목, 그 약방 앞에 다시 섰다.',
    '할머니가 모래시계를 쓰다듬었다. 마지막 모래알이 떨어졌다.',
    '“정리해서 말할게요. 나는 일흔 살의 서윤이에요. 첫 번째 인생에서는 오디션에 붙고도 포기했어요. 당신이 마흔 살까지 산 바로 그 인생이에요.”',
    '“두 번째 인생에서는 데뷔해서 정상까지 갔어요. 하지만 엄마도, 멤버들도, 내 마음도 다 놓쳤어요. 서른이 되기 전에 무대에서 쓰러졌고, 그 뒤로 다시는 노래하지 못했어요.”',
    '“그래서 당신에게 시계를 줬어요. 실력, 사람, 마음. 셋 다 지킨 서른 살을 보고 싶었어요.”',
    '“셋이 모두 단단하면, 당신은 이제 어느 나이에서든 자유롭게 살 수 있어요. 이제 당신의 서른 살을 보여 줘요.”',
  ],
  text:S => '모래시계가 마지막으로 뒤집혔다. 무대 위의 십 년이 결과가 될 시간이다.',
  choices:[{label:'내 서른 살의 결과를 본다', sub:'엔딩', run:S => ({text:'', chips:[]})}]};

const IDOL_ROUND2 = {id:'round2', once:true, speaker:GRANDMA, title:'다시, 오디션 날', place:'shop', img:'art/grandma.webp',
  beats:[
    '또다시 2016년 3월. 스타라이트 엔터테인먼트 오디션 날 아침이다.',
    '눈을 뜨자 머리맡에 오디션 번호표가 있었다. 지난번과 같은 번호였다.',
    '그런데 이번엔 다르다. 지난 십 년의 기억이 절반쯤 몸에 남아 있다. 발성, 안무, 그리고 사람들의 얼굴.',
    '주머니 속에서 시계 조각 두 개가 따뜻했다. 할머니 목소리가 귓가에 남아 있었다. “지난번에 놓친 걸 이번엔 챙겨요.”',
  ],
  text:S => `${S.round || 2}회차가 시작된다. 지난 회차 능력치의 절반과 시계 조각 2개를 가지고 다시 오디션장으로 간다. 이번엔 무엇을 먼저 챙길까?`,
  choices:[
    {label:'엄마에게 먼저 오디션 이야기를 한다', sub:'엄마 마음 + · 관계 +', run(S){ const ch = []; _icMom(S, 8, ch); return _ic(S, {bond:2, stress:2}, '“엄마, 나 오늘 오디션 봐.” 엄마가 숟가락을 내려놓았다. 화내기 전에 내가 먼저 말했다. “붙으면 그때 같이 얘기하자.”', 'tender', ch); }},
    {label:'곧장 오디션장으로 간다', sub:'실력 + · 보컬 +', run(S){ const ch = []; return _ic(S, {work:2, know:1.5}, '대기실에서 지난번엔 떨리던 손이 이번엔 가만히 있었다. 첫 소절이 끝나기도 전에 심사위원이 펜을 내려놓았다.', 'happy', ch); }},
  ]};

// ── 위기 랜덤 이벤트 (한 번씩) ─────────────────────────────────
const CRISIS_EVENTS = [
  {id:'cr_1', once:true, w:4, cond:S => (isTrainee(S) || isIdol(S)) && S.m >= 5 && S.hp < 75, speaker:'', place:'stage', img:'art/bg_practice.webp', title:'발목에서 난 소리',
   text:S => isIdol(S) ? `${_icGroup(S)} 컴백 2주 전. 턴을 돌다가 발목에서 ‘뚝’ 소리가 났다. 인대가 늘어났으니 3주는 쉬라고 한다. 안무 한가운데 내 자리가 있다.` : '월말평가 일주일 전. 턴을 돌다가 발목에서 ‘뚝’ 소리가 났다. 병원에서는 인대가 늘어났으니 3주는 쉬라고 했다.',
   choices:[
    {label:'진통제를 먹고 그대로 연습한다', sub:'실력 + · 체력 -- · 재발 위험', run(S){ const ch = []; _icFans(S, 0.3, ch);
      if(R() < 0.3){ SF(S).ankle = true; return _ic(S, {work:3, skill:1, hp:-15, stress:6}, '무대는 끝까지 해냈다. 그 뒤로 겨울마다 발목이 시큰거리기 시작했다.', 'sad', ch); }
      return _ic(S, {work:3, skill:1, hp:-12, stress:6}, '테이핑을 세 겹 감고 끝까지 췄다. 아무도 눈치채지 못했다. 밤마다 얼음찜질을 하며 혼자 울었다.', 'serious', ch); }},
    {label:'3주 동안 쉬면서 재활한다', sub:'체력 + · 마음 + · 실력 - · 팬 -', run(S){ const ch = []; _icFans(S, -0.5, ch);
      return _ic(S, {hp:12, self:2, stress:-4, work:-2}, isIdol(S) ? '이번 활동은 의자에 앉아서 노래만 했다. 팬들이 그 무대에 ‘의자 버전’이라는 이름을 붙여 줬다.' : '깁스를 하고 연습실 구석에서 노래만 했다. 다른 연습생들이 내 자리에서 춤을 췄다. 대신 발목은 깨끗하게 나았다.', undefined, ch); }},
    {label:'안무를 바꿔 달라고 부탁한다', sub:'예능감 + · 실력 + · 눈치가 보인다', run(S){ const ch = []; return _ic(S, {dare:2, work:1, bond:-1, hp:-4}, '어려운 턴 두 개를 빼고 손동작을 넣었다. 생각보다 괜찮았다. 다만 누군가 연습실에서 “특혜”라고 중얼거렸다.', undefined, ch); }},
   ]},

  {id:'cr_2', once:true, w:4, cond:S => isIdol(S) && sinceDebut(S) >= 4 && fansOf(S) >= 3, speaker:'', place:'night', img:'art/bg_dorm.webp', title:'숙소 앞의 택시',
   text:S => `새벽 세 시. 숙소 창밖에 택시 한 대가 한 시간째 서 있다. 지난주엔 내 개인 번호로 문자가 왔다. 「오늘 입은 옷 예쁘더라.」 댓글창에는 같은 아이디가 매일 악플을 단다.${S.love.yuchan && S.love.yuchan.stage !== -9 ? ' 유찬에게서 메시지가 와 있다. “그 계정, 추적해 볼 수 있어요.”' : ''}`,
   choices:[
    {label:'회사와 함께 고소한다', sub:'자금 - · 스트레스 + · 멘탈 + · 스캔들 위험 -', run(S){ const ch = []; addScandal(S, -6, ch);
      return _ic(S, {cash:-30, stress:6, ins:2}, '고소장을 내던 날 손이 떨렸다. 석 달 뒤 연락이 왔다. 계정 주인은 같은 동네 사람이었다. 합의는 하지 않았다.', 'serious', ch); }},
    {label:'라이브 방송에서 직접 말한다', sub:'팬소통 + · 팬 ± · 화제가 된다', run(S){ const ch = [];
      if(R() < 0.5 + S.st.neg / 300){ addFans(S, 1.5, ch); return _ic(S, {neg:3, stress:4}, '“저도 사람이에요. 집 앞엔 오지 말아 주세요.” 팬들이 해시태그를 만들어 지켜 주기 시작했다.', 'happy', ch); }
      addFans(S, -0.5, ch); addScandal(S, 4, ch); return _ic(S, {neg:3, stress:6}, '진심으로 말했는데, 몇몇 기사가 ‘팬 저격’이라고 제목을 달았다.', 'sad', ch); }},
    {label:'아무 일 없는 척 넘긴다', sub:'일은 커지지 않는다 · 스트레스 ++ · 마음 -', run(S){ const ch = []; return _ic(S, {stress:10, self:-2}, '번호를 바꾸고 커튼을 쳤다. 아무에게도 말하지 않았다. 작은 소리에도 깨는 밤이 늘었다.', 'sad', ch); }},
   ]},

  {id:'cr_3', once:true, w:4, cond:S => (isOut(S) && S.m < 84) || (isTrainee(S) && S.m >= 10 && (lastRank(S) || 12) >= 7), speaker:'낯선 대표', place:'cafe', img:'art/bg_office.webp', title:'데뷔 보장 계약서',
   text:S => `카페에서 만난 남자가 명함을 내밀었다. 「골든트리 엔터 대표」. 처음 듣는 회사다. “6개월 안에 데뷔 보장. 대신 트레이닝비 500만 원 먼저, 계약은 10년.” ${isOut(S) ? '무소속으로 보낸 시간이 길다. 이게 마지막 기회처럼 보인다.' : '지금 회사에선 계속 하위권이다. 이게 지름길처럼 보인다.'}`,
   choices:[
    {label:'계약서에 서명한다', sub:'자금 -100 · 기회일 수도, 함정일 수도', run(S){ const ch = [];
      if(R() < 0.3) return _ic(S, {cash:-100, skill:2, know:2, stress:6}, '트레이닝은 진짜였다. 그런데 계약서 마지막 장에 ‘수익의 9할은 회사가 가진다’고 적혀 있었다. 다시 빠져나올 방법을 찾아야 했다.', 'serious', ch);
      return _ic(S, {cash:-100, self:-3, stress:8}, '두 달 뒤 사무실 문이 잠겨 있었다. 같은 계약을 한 연습생이 열한 명이었다. 500만 원은 돌아오지 않았다.', 'sad', ch); }},
    {label:'변호사에게 계약서를 보여 준다', sub:'자금 -15 · 멘탈 + · 최건우를 만날 수도', run(S){ const ch = []; _icMeet(S, 'geonwoo', 6, ch);
      return _ic(S, {cash:-15, ins:2, stress:-2}, '“이건 계약서가 아니라 함정이에요.” 엔터 전문 변호사 최건우가 빨간 펜으로 일곱 군데에 줄을 그었다. 상담료는 아까웠지만 500만 원을 지켰다.', undefined, ch); }},
    {label:'그 자리에서 거절한다', sub:'돈은 지킨다 · 스트레스 + · 기회 하나를 버린다', run(S){ const ch = []; return _ic(S, {stress:4, self:1}, '“생각해 볼게요.” 하고 나왔다. 집에 오는 길 내내, 혹시 진짜 기회였으면 어쩌나 하는 생각이 떠나지 않았다.', undefined, ch); }},
   ]},

  {id:'cr_4', once:true, w:3, cond:S => S.m >= 20 && S.m <= 74, speaker:'엄마', img:'art/mom.webp', place:'room', title:'재검 통보',
   text:S => `엄마 집 냉장고에 종이가 붙어 있었다. 「건강검진 결과: 재검 필요」. 날짜는 두 달 전이다. 엄마는 별거 아니라며 종이를 떼어 냈다. ${(S.mom || 0) >= 50 ? '“바쁜 애한테 말해서 뭐 해.”' : '“너는 네 일이나 해.”'}`,
   choices:[
    {label:'일정을 빼고 같이 병원에 간다', sub:'엄마 마음 + · 관계 + · 실력 -', run(S){ const ch = []; _icMom(S, 8, ch); _icFans(S, -0.2, ch);
      return _ic(S, {bond:3, work:-2, stress:2}, '대기실에서 엄마가 내 손을 잡고 있었다. 일찍 발견해서 약으로 충분하다고 했다. “네가 와서 의사 말이 다 들리더라.”', 'tender', ch); }},
    {label:'병원 예약만 잡아 드리고 연습하러 간다', sub:'실력 + · 엄마 마음 조금 + · 스트레스 +', run(S){ const ch = []; _icMom(S, 2, ch);
      return _ic(S, {work:2, stress:3}, '예약 문자를 보내 드렸다. 엄마는 혼자 다녀왔다. “괜찮대.” 짧은 답장 하나에 하루 종일 마음이 쓰였다.', undefined, ch); }},
    {label:'검사 비용을 보내 드린다', sub:'자금 -40 · 엄마 마음 + · 시간은 지킨다', run(S){ const ch = []; _icMom(S, 4, ch);
      return _ic(S, {cash:-40, bond:1}, '“돈 보낼 시간 있으면 밥이나 먹어.” 엄마는 그렇게 말하고도 더 큰 병원에서 검사를 받았다.', undefined, ch); }},
   ]},

  {id:'cr_5', once:true, w:3, cond:S => _icTeam(S) && sinceDebut(S) >= 18, speaker:'하은', cut:'haeun', place:'night', img:'art/bg_dorm.webp', title:'하은의 캐리어',
   text:S => '숙소 현관에 하은의 캐리어가 서 있었다. 막내 하은이 고개를 숙였다. “언니, 나 회사에 탈퇴하겠다고 말했어요. 무대에 서면 숨이 안 쉬어져요.” 다음 주가 컴백이다.',
   choices:[
    {label:'붙잡는다. 같이 버티자고 한다', sub:'관계 + · 스트레스 + · 하은의 마음은 알 수 없다', run(S){ const ch = [];
      if(R() < 0.5) return _ic(S, {bond:3, stress:5}, '하은은 캐리어를 다시 방에 넣었다. 대신 무대 직전마다 내 손을 잡았다. 그 손이 늘 차가웠다.', 'tender', ch);
      SF(S).haeunLeft = true; return _ic(S, {bond:1, stress:7, self:-1}, '하은은 끝내 떠났다. “언니 말 고마웠어요. 그래도 나는 숨을 쉬고 싶어요.”', 'sad', ch); }},
    {label:'하은의 결정을 존중하고 보내 준다', sub:'마음 + · 팬 - · 네 명으로 활동', run(S){ const ch = []; SF(S).haeunLeft = true; addFans(S, -fansOf(S) * 0.05, ch);
      return _ic(S, {self:2, bond:1}, '역까지 데려다줬다. “언니, 나중에 꼭 공연 보러 갈게요.” 컴백 무대는 네 명이었다. 하은 자리가 크게 비어 보였다.', 'sad', ch); }},
    {label:'회사와 휴식기를 협상해 준다', sub:'예능감 + · 팬소통 + · 스트레스 + · 체력 -', run(S){ const ch = [];
      return _ic(S, {dare:2, neg:2, stress:5, hp:-4}, '오 실장과 세 시간을 이야기했다. 하은은 이번 활동만 쉬기로 했다. 하은의 파트는 내가 불렀다.', undefined, ch); }},
   ]},

  {id:'cr_6', once:true, w:4, cond:S => isIdol(S) && sinceDebut(S) >= 2, speaker:'', place:'stage', img:'art/bg_stage.webp', title:'끊긴 반주',
   text:S => '뮤직 스테이지 생방송, 2절. 갑자기 반주가 끊겼다. 이어모니터에서도 아무 소리가 안 난다. 객석은 조용해졌고, 카메라 빨간 불은 그대로 켜져 있다.',
   choices:[
    {label:'반주 없이 끝까지 부른다', sub:'보컬이 높으면 화제 · 낮으면 실수가 남는다', run(S){ const ch = [];
      if(S.st.know + rand(-15, 15) > 50){ addFans(S, 1 + fansOf(S) * 0.05, ch); return _ic(S, {work:3, self:2}, '무반주로 후렴을 불렀다. 객석이 박자를 맞춰 손뼉을 쳤다. 그 영상이 그 주 조회수 1위가 됐다.', 'happy', ch); }
      addFans(S, -0.3, ch); addScandal(S, 3, ch); return _ic(S, {stress:8}, '음이 흔들렸다. 그 3초가 짧은 영상으로 한 달 내내 돌았다.', 'sad', ch); }},
    {label:'멈추고 관객에게 상황을 말한다', sub:'팬소통 + · 안전 · 무대는 미완성', run(S){ const ch = [];
      return _ic(S, {neg:3, stress:2}, '“잠시만요, 기계가 쉬고 싶나 봐요.” 객석이 웃었다. 무대는 처음부터 다시 했고, 방송에는 편집된 무대가 나갔다.', undefined, ch); }},
    {label:'춤으로만 끝까지 간다', sub:'댄스 + · 팬 + · 체력 -', run(S){ const ch = []; addFans(S, 0.5, ch);
      return _ic(S, {skill:2, work:1, hp:-6}, '음악 없이 속으로 박자를 세며 끝까지 췄다. 반 박자 밀렸지만 엔딩 포즈는 정확했다.', undefined, ch); }},
   ]},

  {id:'cr_7', once:true, w:4, cond:S => isIdol(S) && sinceDebut(S) >= 20 && S.m <= 112, speaker:'최건우', cut:'geonwoo', place:'cafe', img:'art/bg_office.webp', title:'0원짜리 정산서',
   text:S => `데뷔 ${Math.max(1, Math.floor(sinceDebut(S) / 12))}년 차. 이번 달 정산서에도 0원이 찍혔다. 항목에는 숙소 관리비, 의상 제작비, 그리고 처음 보는 ‘기타 비용’ 3억. ${S.love.geonwoo ? '건우가 정산서를 넘기며 눈썹을 찌푸렸다. “이 항목, 근거가 없어요.”' : '지석 매니저가 조용히 명함 한 장을 건넸다. 엔터 전문 변호사 최건우. “나한테 들은 거 아니다.”'}`,
   choices:[
    {label:'변호사와 함께 정식으로 문제를 제기한다', sub:'자금 + 가능 · 회사와 긴장 · 스트레스 +', run(S){ const ch = []; _icMeet(S, 'geonwoo', 6, ch);
      if(R() < 0.6) return _ic(S, {cash:120, stress:7, dare:1}, '석 달을 싸웠다. 회사는 ‘기타 비용’ 절반을 지웠다. 첫 정산금이 통장에 찍혔다. 대신 회의실 공기가 차가워졌다.', 'happy', ch);
      return _ic(S, {cash:-20, stress:8, work:-1}, '회사는 서류를 더 가져왔다. 싸움은 길어졌고 다음 앨범 일정이 밀렸다.', 'serious', ch); }},
    {label:'같이 일하는 사람들과 회사에 직접 말한다', sub:'관계 + · 자금 조금 + · 스트레스 +', run(S){ const ch = [];
      return _ic(S, {bond:3, neg:2, stress:3, cash:40}, '같은 처지의 사람들이 같은 날 대표실 문을 두드렸다. 전부는 아니어도, 숙소 관리비는 회사가 내기로 했다.', undefined, ch); }},
    {label:'재계약 때까지 참는다', sub:'일정은 지킨다 · 스트레스 + · 마음 -', run(S){ const ch = [];
      return _ic(S, {stress:6, self:-2, work:1}, '“지금 싸우면 활동이 끊겨.” 정산서를 서랍에 넣었다. 서랍이 점점 무거워졌다.', 'sad', ch); }},
   ]},

  {id:'cr_8', once:true, w:3, cond:S => isIdol(S) && IDOL(S).wins >= 1, speaker:'', place:'city', img:'art/ct_night.webp', title:'1위 다음 날',
   text:S => '1위를 한 다음 날 아침, 커뮤니티에 글이 올라왔다. 「새벽 시간 음원 순위가 이상하다. 사재기 아니냐」. 그래프 캡처가 수십 장 돌고 있다. 회사는 아무것도 안 했다고 한다.',
   choices:[
    {label:'회사에 기록 공개와 조사 의뢰를 요구한다', sub:'스캔들 위험 - · 마음 + · 회사와 긴장', run(S){ const ch = []; addScandal(S, -8, ch);
      return _ic(S, {stress:6, self:2}, '회사가 스트리밍 기록을 공개했다. 의혹은 대부분 가라앉았다. 다만 대표는 한동안 내 인사를 받지 않았다.', 'serious', ch); }},
    {label:'팬들에게 무리하지 말라고 부탁한다', sub:'팬소통 + · 순위 - · 스캔들 위험 -', run(S){ const ch = []; addFans(S, -0.3, ch); addScandal(S, -4, ch);
      return _ic(S, {neg:3}, '“순위보다 여러분 잠이 더 중요해요.” 다음 주 순위는 떨어졌다. 팬 카페에는 “우리 가수 멋있다”는 글이 올라왔다.', 'tender', ch); }},
    {label:'무대로만 증명한다', sub:'실력 + · 의혹은 남는다', run(S){ const ch = []; addScandal(S, 5, ch);
      return _ic(S, {work:3, skill:1, stress:4}, '라이브 무대 영상을 매주 올렸다. 실력은 인정받았지만 검색창에는 여전히 ‘사재기’가 따라붙었다.', undefined, ch); }},
   ]},

  {id:'cr_9', once:true, w:3, cond:S => isIdol(S) && sinceDebut(S) >= 6, speaker:'안유찬', cut:'yuchan', place:'night', img:'art/bg_dorm.webp', title:'잠긴 사진첩',
   text:S => { const n = _icLvName(S);
     return `모르는 주소로 메일이 왔다. 내 사진첩 캡처 다섯 장. 「24시간 안에 2천만 원. 아니면 전부 푼다.」 사진 저장 계정이 해킹됐다.${n ? ` ${josa(n, '과', '와')} 찍은 사진도 들어 있다.` : ''} ${S.love.yuchan ? '유찬에게 연락하자 그가 노트북을 들고 바로 왔다.' : '팬 소통 앱을 만든 개발자 안유찬이 회사를 통해 연락해 왔다. “보안 쪽은 제가 좀 알아요.”'}`; },
   choices:[
    {label:'유찬과 함께 추적하고 경찰에 신고한다', sub:'멘탈 + · 스트레스 + · 유찬 호감 +', run(S){ const ch = []; _icMeet(S, 'yuchan', 8, ch); addScandal(S, _icLv(S) ? 4 : 1, ch);
      return _ic(S, {ins:2, stress:6}, '유찬이 밤새 접속 기록을 뒤졌다. 범인은 해외 서버 뒤에 숨어 있었지만 경찰이 계정을 막았다. 사진은 몇 장만 퍼지고 멈췄다.', 'serious', ch); }},
    {label:'먼저 공개적으로 알린다', sub:'팬 신뢰 + · 마음 + · 스캔들 위험 +', run(S){ const ch = []; addFans(S, 0.5, ch); addScandal(S, _icLv(S) ? 10 : 3, ch);
      return _ic(S, {self:2, stress:5}, '“협박에 응하지 않겠습니다.” 입장이 나가자 팬들이 사진 신고 운동을 했다. 그래도 몇 장은 끝내 지워지지 않았다.', undefined, ch); }},
    {label:'돈을 보내고 조용히 막는다', sub:'자금 -120 · 다시 올 수도 있다', run(S){ const ch = [];
      if(R() < 0.4){ addScandal(S, 8, ch); return _ic(S, {cash:-120, stress:10}, '돈을 보냈다. 한 달 뒤 같은 주소에서 메일이 또 왔다. 금액이 두 배였다.', 'sad', ch); }
      return _ic(S, {cash:-120, stress:8}, '돈을 보냈고, 메일은 더 오지 않았다. 그래도 휴대폰 알림이 울릴 때마다 심장이 내려앉았다.', 'serious', ch); }},
   ]},

  {id:'cr_10', once:true, w:3, cond:S => isIdol(S) && sinceDebut(S) >= 3, speaker:'지석 매니저', cut:'jiseok', place:'rain', img:'art/bg_alley.webp', title:'빗길의 밴',
   text:S => '새벽 네 시, 지방 행사에서 돌아오는 길. 빗길에서 밴이 미끄러져 가드레일을 들이받았다. 다친 사람은 없었다. 운전석의 지석 매니저는 사흘째 거의 못 잤다.',
   choices:[
    {label:'지석 매니저를 감싸고 일정 조정을 요구한다', sub:'관계 + · 회사와 긴장 · 팬 조금 -', run(S){ const ch = []; addFans(S, -0.2, ch);
      return _ic(S, {bond:3, dare:1, stress:3}, '“매니저 잘못 아니에요. 일정이 잘못된 거예요.” 그 뒤로 새벽 이동엔 운전기사가 한 명 더 붙었다. 대신 행사 두 개가 취소됐다.', 'serious', ch); }},
    {label:'아무 일 없던 것처럼 다음 일정에 간다', sub:'실력 + · 체력 - · 스트레스 +', run(S){ const ch = [];
      return _ic(S, {work:2, hp:-8, stress:7}, '목이 뻐근한 채로 아침 라디오에 나갔다. 웃으며 이야기했지만 손이 계속 떨렸다.', undefined, ch); }},
    {label:'병원에서 검사를 받고 하루 쉰다', sub:'체력 + · 마음 + · 팬 -', run(S){ const ch = []; addFans(S, -0.3, ch);
      return _ic(S, {hp:8, self:2, stress:-4}, '목 근육이 놀랐다고 했다. 하루를 쉬었다. 지석 매니저가 병원 앞에서 꾸벅 고개를 숙였다. “미안하다.”', 'tender', ch); }},
   ]},
];
