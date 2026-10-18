// 아이돌 메인 스토리 4~5장 (2019~2020) + 라이벌(서하린) 랜덤 이벤트. ENGINE 구간(DOM 금지)
// 헬퍼(_ia, _iaMom, _iaHarin, _iaSame, _iaTeam)는 story_a.js 에 있다.
const _iaMate = S => _iaSame(S) ? '소연' : isIdol(S) && IDOL(S).solo ? '댄서 팀 막내' : isIdol(S) ? `${_iaTeam(S)} 막내` : '커버팀 동생';
const _iaFanLine = S => { const f = fansOf(S); return f >= 50 ? '이제 공항에 팬 수백 명이 나온다.' : f >= 10 ? '팬카페 회원 수가 처음으로 십만을 넘었다.' : f >= 1 ? '응원하는 사람이 만 명쯤 생겼다.' : '아직 나를 아는 사람은 많지 않다.'; };

const STORY_B = [
// ════════ 4장 2년 차 징크스 (2019) ════════
{id:'st_4_1', m:37, exp:4, speaker:'', place:'night', img:'art/bg_dorm.webp', title:'댓글 1,204개',
  text:S => isIdol(S) ? `새벽 세 시, 커뮤니티에 내 이름이 올라왔다. ‘연습생 시절 동료를 괴롭혔다’는 글. 사진 한 장 없는데 댓글이 1,204개. 다들 믿고 있었다. ${_iaSame(S) && rivalState(S) === 'ally' ? '하린에게서 메시지가 왔다. “나 아니에요. 그리고 그거 거짓말인 거 내가 제일 잘 알아요.”' : _iaSame(S) && rivalState(S) === 'enemy' ? '글 속 ‘피해자’가 하린이라는 추측이 돌았다. 하린은 아무 말도 하지 않았다.' : ''}` : '오디션 영상 댓글창. ‘나이 먹고 아직도 연습생?’ ‘얼굴로는 안 될 듯.’ 모르는 사람들이 내 스물세 살을 채점하고 있었다. 새벽 세 시, 휴대폰을 내려놓지 못한다.',
  choices:[
    {label:'캡처를 모아 법적으로 대응한다', sub:'스캔들 위험 -10 · 스트레스 +6 · 멘탈 +1 · 오래 걸린다', run(S){ const ch = []; fx(S, {stress:6, ins:1}, ch); if(isIdol(S)) addScandal(S, -10, ch); else fx(S, {self:1}, ch); return {text:isIdol(S) ? '회사 법무팀에 캡처 삼백 장을 넘겼다. 석 달 뒤 글쓴이가 사과문을 올렸다. 연습생 때 나를 한 번도 본 적 없는 사람이었다.' : '악플 계정을 하나하나 신고했다. 세 개가 사라졌다. 나머지는 그대로였다. 그래도 가만히 있지 않았다는 게 조금은 힘이 됐다.', chips:ch, mood:'serious'}; }},
    {label:'라이브 방송에서 담담하게 말한다', sub:'팬소통이 높을수록 + · 실패하면 불씨가 커진다', run(S){ const ch = []; const ok = S.st.neg + rand(-12, 12) > 45; if(ok){ fx(S, {neg:2, self:2}, ch); if(isIdol(S)){ addScandal(S, -8, ch); addFans(S, 1, ch); } return {text:'“저 그런 사람 아니에요. 그래도 상처받은 분이 있다면 직접 듣고 싶어요.” 울지 않고 말했다. 다음 날 연습생 동기들이 차례로 글을 올렸다. 소연의 글이 제일 길었다.', chips:ch, mood:'happy'}; } fx(S, {stress:8, neg:1}, ch); if(isIdol(S)) addScandal(S, 6, ch); return {text:'말을 하다 목이 메었다. ‘우는 척’이라는 캡처가 돌았다. 해명이 또 다른 떡밥이 됐다. 그날 밤은 한숨도 못 잤다.', chips:ch, mood:'sad'}; }},
    {label:'휴대폰을 끄고 연습만 한다', sub:'멘탈 +2 · 실력 +2 · 루머는 그대로 남는다', run(S){ const ch = []; fx(S, {ins:2, work:2}, ch); if(isIdol(S)) addScandal(S, 2, ch); return {text:'휴대폰을 지석 매니저에게 맡겼다. 일주일 동안 거울과 음악만 봤다. 루머는 사라지지 않았지만, 내가 그 안에서 살지는 않았다.', chips:ch}; }},
  ]},

{id:'st_4_2', m:40, exp:4, speaker:'', place:'stage', img:'art/bg_stage.webp', title:'1위 발표 3초 전',
  text:S => isIdol(S) ? `이번 주 뮤직 스테이지 1위 후보. 상대는 ${_iaSame(S) ? '데뷔 10년 차 선배 그룹' : `하린이 있는 ${GROUP_NAME}`}. ${IDOL(S).wins ? `1위는 해 본 적 있다. 그래도 매번 처음처럼 손이 떨린다.` : '아직 한 번도 1위를 해 본 적이 없다.'} ${_iaFanLine(S)} 발표까지 3초. 무대 위에서 무엇을 할까?` : `세 번째 기획사 최종 오디션. 마지막 둘, 나와 열여덟 살 연습생. 심사위원이 말했다. “둘 다 좋아요. 그래서 하나만 더 볼게요.” 마지막으로 무엇을 보여 줄까?`,
  choices:[
    {label:'옆 사람 손을 꼭 잡는다', sub:'관계 +2 · 결과는 운과 팬 수에 달렸다', run(S){ return _iaWinLose(S, {bond:2}, '손이 땀으로 젖어 있었다. 누구 손인지 모를 만큼 꽉 잡았다.'); }},
    {label:'떨어져도 웃을 준비를 한다', sub:'멘탈 +2 · 마음 +1 · 결과는 운과 팬 수에 달렸다', run(S){ return _iaWinLose(S, {ins:2, self:1}, '입꼬리를 미리 올려 두었다. 어느 쪽이든 카메라는 내 얼굴을 잡을 거니까.'); }},
    {label:'마흔의 기억으로 다음 주 차트를 떠올린다', sub:'미래 지식 · 기억 선명도 -6 · 1위 확률 +', run(S){ S.borrowed++; return _iaWinLose(S, {clarity:-6}, '이 노래는 다음 주에 역주행한다. 그 기억이 맞기를 바랐다. 대신 마흔 살 그해 겨울이 조금 흐려졌다.', 0.25); }},
  ]},

{id:'st_4_3', m:43, exp:4, speaker:'', place:'room', img:'art/bg_practice.webp', title:'파트 분배표',
  text:S => `신곡 파트 분배표가 단톡방에 올라왔다. ${isIdol(S) && !IDOL(S).solo ? `내 파트 22초, ${_iaMate(S)} 파트 4초. ${_iaSame(S) ? `하린은 18초. 소연이 아무 말 없이 단톡방을 나갔다가 다시 들어왔다.` : '막내가 연습실 구석에서 이어폰을 끼고 울고 있었다.'}` : isIdol(S) ? '솔로 앨범이라 파트는 내 것뿐이다. 대신 댄서 팀 크레딧 문제로 막내 댄서가 울고 있었다. 안무를 같이 짰는데 이름이 빠졌다.' : `오디션 준비 동료들과 만든 커버팀. 영상 하나에 파트를 나누다 말다툼이 났다. ${_iaMate(S)}가 “언니만 계속 가운데 서잖아요”라고 했다.`} 어떻게 할까?`,
  choices:[
    {label:`내 파트를 줄여 나눠 준다`, sub:'관계 +4 · 실력 -1 · 나의 노출은 줄어든다', run(S){ const ch = []; fx(S, {bond:4, work:-1, self:1}, ch); if(isIdol(S)) addFans(S, -0.3, ch); if(_iaSame(S)) rivalMood(S, 1, ch); return {text:_iaSame(S) ? '“제 파트 8초, 소연이 줘요.” 프로듀서가 눈썹을 올렸다. 하린이 덧붙였다. “그럼 저도 4초 줄게요.” 소연이 처음으로 녹음실에서 울지 않았다.' : '내 몫을 덜어냈다. 화면에 나오는 시간은 줄었다. 대신 그 주 내내 연습실 공기가 가벼웠다.', chips:ch, mood:'tender'}; }},
    {label:'“실력대로 나누는 게 맞아.” 원칙을 말한다', sub:'실력 +2 · 관계 -3 · 하린 관계 +1(같은 팀일 때)', run(S){ const ch = []; fx(S, {work:2, bond:-3}, ch); if(_iaSame(S)) rivalMood(S, 1, ch); return {text:_iaSame(S) ? '하린이 내 편을 들었다. “맞아요. 무대는 냉정해야 돼요.” 처음으로 하린과 의견이 같았다. 소연은 그 주 내내 나와 눈을 마주치지 않았다.' : '틀린 말은 아니었다. 그래서 더 아팠다. 막내는 고개를 끄덕였지만 다음 날 연습에 늦게 왔다.', chips:ch, mood:'serious'}; }},
    {label:'회사(리더)에게 맡기고 빠진다', sub:'스트레스 -3 · 마음 -2 · 갈등은 남는다', run(S){ const ch = []; fx(S, {stress:-3, self:-2}, ch); return {text:'“위에서 정한 거니까.” 그 말 뒤에 숨었다. 편했다. 그리고 그 편함이 마흔의 나와 닮았다는 걸 알았다.', chips:ch}; }},
  ]},

{id:'st_4_4', m:46, exp:4, speaker:'엄마', img:'art/mom.webp', place:'room', title:'설날의 잡채',
  beats:[
    '설 연휴 마지막 날 밤, 겨우 시간을 내 엄마 집에 갔다. 식탁에는 내가 어릴 때 좋아하던 잡채가 있었다.',
    '엄마는 반찬통 열두 개를 꺼내 놓고 하나하나 이름표를 붙였다. 숙소 냉장고 칸이 몇 개인지까지 물어봤다.',
    '현관 신발장 위에 낯선 물건이 있었다. 내 사진이 들어간 응원봉. 엄마는 그걸 못 본 척하라는 듯 수건으로 덮어 두었다.',
  ],
  text:S => `${SF(S).momDeal ? '2년만 지켜봐 달라던 약속은 이미 지났다. 엄마는 그 얘기를 다시 꺼내지 않았다.' : SF(S).momCold ? '짐을 싸서 나간 그날 이후, 엄마와 둘이 밥을 먹는 건 처음이다.' : '엄마와 마주 앉은 게 몇 달 만이다.'} ${S.mom >= 55 ? '엄마가 먼저 웃었다.' : S.mom < 30 ? '엄마는 내 눈을 잘 보지 않았다.' : '엄마는 반찬 얘기만 했다.'} 뭐라고 말할까?`,
  choices:[
    {label:'“엄마, 그때 반대한 거 이제 이해해.”', sub:'조각 1 · 엄마 관계 +10 · 관계 +2', run(S){ const ch = []; _iaMom(S, 10, ch); fx(S, {bond:2}, ch); givePiece(S, ch); return {text:'엄마의 젓가락이 멈췄다. “…엄마는 네가 다칠까 봐 그랬지. 근데 너 안 다치더라. 다쳐도 일어나더라.” 반찬통 사이에 호박색 조각이 하나 끼어 있었다. 언제 거기 있었는지 모르겠다.', chips:ch, mood:'tender'}; }},
    {label:'“이제 내 일은 내가 정할게.” 선을 긋는다', sub:'조각 1 · 마음 +4 · 엄마 관계 -4', run(S){ const ch = []; _iaMom(S, -4, ch); fx(S, {self:4}, ch); givePiece(S, ch); return {text:'엄마가 서운한 얼굴로 고개를 끄덕였다. “그래. 넌 이제 어른이니까.” 돌아오는 택시에서 주머니에 손을 넣자 호박색 조각이 만져졌다. 거리를 두는 것도 나를 지키는 방법이었다.', chips:ch, mood:'serious'}; }},
    {label:'아무 말 없이 설거지를 같이 한다', sub:'조각 1 · 엄마 관계 +5 · 스트레스 -5', run(S){ const ch = []; _iaMom(S, 5, ch); fx(S, {stress:-5, self:1}, ch); givePiece(S, ch); return {text:'엄마가 씻고 내가 헹궜다. 말은 없었는데 손발이 맞았다. 마지막 그릇을 건네며 엄마가 말했다. “다음 설에도 와.” 개수대 거름망에 호박색 조각이 반짝였다.', chips:ch}; }},
  ]},

// ════════ 5장 텅 빈 객석 (2020) ════════
{id:'st_5_1', m:49, exp:4, speaker:'', place:'stage', img:'art/bg_stage.webp', title:'관객 0명의 콘서트',
  text:S => isIdol(S) ? `준비하던 ${_iaTeam(S) === '솔로' ? '첫 솔로' : '첫 단독'} 콘서트가 취소됐다. 대신 온라인 콘서트. 객석 대신 카메라 아홉 대, 함성 대신 모니터 위로 흘러가는 채팅. 리허설에서 노래가 끝나도 아무 소리가 들리지 않았다.` : '봄이 통째로 멈췄다. 잡혀 있던 오디션 세 개가 모두 취소됐고, 보컬 학원 알바도 끊겼다. 방에서 휴대폰 카메라를 켜 본다. 지금 나를 볼 수 있는 곳은 화면뿐이다.',
  choices:[
    {label:'빈 객석을 향해 평소처럼 노래한다', sub:'표현력 +3 · 팬 + · 체력 -8', run(S){ const ch = []; fx(S, {sense:3, hp:-8, work:1}, ch); addFans(S, isIdol(S) ? 1.2 : 0.2, ch); return {text:isIdol(S) ? '아무도 없는 객석 끝에 팬이 있다고 생각하고 손을 흔들었다. 공연이 끝나고 채팅창에 같은 말이 수천 번 올라왔다. ‘보였어요.’' : '방 안에서 혼자 콘서트를 했다. 영상 조회수는 300회. 그중 한 댓글: ‘누나 노래 들으면서 재택근무해요.’', chips:ch, mood:'happy'}; }},
    {label:'채팅을 하나하나 읽어 주며 이야기한다', sub:'팬소통 +3 · 마음 +1 · 공연 완성도는 떨어진다', run(S){ const ch = []; fx(S, {neg:3, self:1, work:-1}, ch); addFans(S, isIdol(S) ? 0.6 : 0.15, ch); return {text:'노래 사이마다 이름을 불렀다. ‘수원 사는 고3 지은이’, ‘병원 야간 근무 중인 간호사님’. 세트리스트 두 곡이 잘렸다. 아무도 아쉬워하지 않았다.', chips:ch, mood:'tender'}; }},
    {label:'회사 몰래 새벽에 무반주 라이브를 켠다', sub:'마음 +3 · 팬 + · 스캔들 위험 +3', run(S){ const ch = []; fx(S, {self:3, stress:-3}, ch); addFans(S, isIdol(S) ? 0.9 : 0.2, ch); addScandal(S, 3, ch); return {text:'새벽 두 시, 이불 속에서 휴대폰을 켜고 작게 노래했다. 들어온 사람 2,000명. 다음 날 오 실장의 전화가 왔다. “한 번만 더 그러면 혼난다.” 웃음이 나왔다.', chips:ch}; }},
  ]},

{id:'st_5_2', m:52, exp:4, speaker:'', place:'cafe', img:'art/bg_office.webp', title:'정산서 0원',
  text:S => isIdol(S) ? (sinceDebut(S) < 18 ? '첫 정산서가 나왔다. 숫자는 0원. 데뷔 앨범 제작비, 의상비, 숙소비를 다 갚을 때까지는 0원이라고 했다. 통장 잔고로는 두 달을 버틴다.' : `정산서가 나왔다. 숫자는 생각보다 작았다. 공연이 다 취소된 해였다. ${_iaSame(S) && SF(S).harinSecret ? '하린이 정산서를 접어 주머니에 넣는 손이 떨렸다.' : ''}`) : '코로나로 알바가 끊긴 지 넉 달. 통장에 남은 돈은 월세 한 번 치를 만큼이었다. 오디션 준비를 그만둘지 고민하는 밤이 길어졌다.',
  choices:[
    {label:'서류를 꼼꼼히 챙겨 받을 돈을 받는다', sub:'자금 +30 · 멘탈 +1 · 스트레스 +4 · 회사와 서먹', run(S){ const ch = []; fx(S, {cash:30, ins:1, stress:4}, ch); return {text:isIdol(S) ? '정산 세부 내역을 요청했다. 의상비 항목에 두 번 잡힌 금액이 있었다. 30만 원이 돌아왔다. 대신 회사 복도 공기가 조금 차가워졌다.' : '청년 지원금 서류를 밤새 준비했다. 30만 원이 들어왔다. 큰돈은 아니지만 한 달은 더 버틸 수 있다.', chips:ch}; }},
    {label:'개인 채널에 커버 영상을 올린다', sub:'팬 + · 보컬 +1 · 체력 -6 · 스캔들 위험 +3', run(S){ const ch = []; fx(S, {know:1, hp:-6, cash:10}, ch); addFans(S, isIdol(S) ? 0.8 : 0.3, ch); addScandal(S, 3, ch); return {text:isIdol(S) ? '숙소 옷장 안에서 녹음한 커버가 조회수 50만을 넘었다. 회사는 계약서 조항을 내밀었다. 다음부터는 미리 말하라고.' : '편의점 알바 끝나고 녹음한 커버 영상. 광고 수익 10만 원이 들어왔다. 처음으로 노래로 번 돈이었다.', chips:ch}; }},
    {label:'엄마에게 돈을 빌린다', sub:'자금 +80 · 마음 -2 · 엄마 관계는 지금 사이에 달렸다', run(S){ const ch = []; fx(S, {cash:80, self:-2}, ch); if(S.mom >= 50){ _iaMom(S, 3, ch); return {text:'엄마는 묻지도 않고 보냈다. 「갚지 마. 대신 밥 굶지 마.」 송금 메모에 그렇게 적혀 있었다. 고마워서 더 미안했다.', chips:ch, mood:'tender'}; } _iaMom(S, -4, ch); return {text:'“그러니까 엄마가 하지 말랬잖아.” 그래도 엄마는 돈을 보냈다. 그 한마디가 돈보다 오래 남았다.', chips:ch, mood:'sad'}; }},
  ]},

{id:'st_5_3', m:55, exp:4, speaker:'', place:'night', img:'art/bg_dorm.webp', title:'화면 너머의 팬',
  text:S => isIdol(S) ? `영상통화 팬사인회. 2분씩, 화면 속 얼굴이 바뀐다. 마지막 팬이 말했다. “언니, 요즘 안 웃어요. 괜찮아요?” 대답하려는데 시간이 끝났다. ${_iaFanLine(S)}` : '커버 영상 댓글에 매번 같은 아이디가 있다. 오늘은 긴 메시지가 왔다. ‘누나 노래 덕분에 버텨요. 누나도 버텨 줘요.’ 답장 칸에서 커서가 깜빡인다.',
  choices:[
    {label:'팬과 만나는 시간을 더 늘린다', sub:'팬소통 +3 · 팬 + · 체력 -8', run(S){ const ch = []; fx(S, {neg:3, hp:-8}, ch); addFans(S, isIdol(S) ? 0.8 : 0.2, ch); return {text:isIdol(S) ? '회사에 영상통화 시간을 30분 늘려 달라고 했다. 그 30분 동안 같은 질문을 스무 번 들었다. “밥 먹었어요?” 스무 번 다 대답했다.' : '답장을 했다. 그다음엔 라이브 방송을 켰다. 그 아이디가 제일 먼저 들어왔다.', chips:ch, mood:'happy'}; }},
    {label:'“사실 요즘 좀 힘들어요.” 솔직하게 말한다', sub:'마음 +3 · 팬 결속 + · 스캔들 위험 +4', run(S){ const ch = []; fx(S, {self:3, stress:-4}, ch); addFans(S, isIdol(S) ? 0.5 : 0.1, ch); addScandal(S, 4, ch); return {text:'솔직한 말 한마디가 기사 제목이 됐다. ‘아이돌의 투정?’ 댓글이 갈렸다. 그런데 그 주 팬레터 상자는 평소의 세 배였다. 대부분 같은 말이었다. ‘힘들다고 말해 줘서 고마워요.’', chips:ch, mood:'tender'}; }},
    {label:'팬과 나 사이에 선을 정해 둔다', sub:'멘탈 +3 · 스트레스 -4 · 팬 조금 -', run(S){ const ch = []; fx(S, {ins:3, stress:-4}, ch); addFans(S, -0.3, ch); return {text:'개인 메시지는 읽지 않기로 했다. 쉬는 날엔 휴대폰도 끄기로 했다. 서운하다는 글이 몇 개 올라왔다. 대신 밤에 잠이 왔다.', chips:ch}; }},
  ]},

{id:'st_5_4', m:58, exp:4, speaker:GRANDMA, img:'art/grandma.webp', place:'shop', title:'무대가 없던 해',
  beats:[
    '겨울. 마스크를 쓴 채 잠들었는데, 약방 안에서는 마스크가 없었다.',
    `${GRANDMA}가 모래시계를 가리켰다. “벌써 절반 가까이 왔어요. 오늘은 숙제 검사를 할게요.”`,
    '“무대가 없던 일 년 동안 뭘 했는지 하나만 말해 봐요. 크든 작든 상관없어요.”',
  ],
  text:S => `할머니가 종이에 숫자 세 개를 적었다. “실력 ${Math.round(S.work)}, 사람 ${Math.round(S.bond)}, 마음 ${Math.round(S.self)}. 서른 살엔 셋 다 50은 넘어야 해요. 제일 낮은 것 하나만 올해 챙겨요.” 그리고 다섯 번째 조각을 꺼냈다.`,
  choices:[
    {label:'“노래를 썼어요. 아직 아무도 안 들은 노래요.”', sub:'조각 1 · 표현력 +2 · 마음 +2', run(S){ const ch = []; fx(S, {sense:2, self:2}, ch); givePiece(S, ch); return {text:IDOL(S).songs > 0 ? `“${IDOL(S).songs}곡이나요? 그거 버리지 말아요. 언젠가 꼭 필요할 때가 와요.” 할머니가 처음으로 활짝 웃었다.` : '“한 곡도 다 못 끝냈어도 괜찮아요. 쓰다 만 노래도 노래예요. 매일 네 줄씩만 써요.” 할머니가 조각을 건넸다.', chips:ch, mood:'happy'}; }},
    {label:'“사람들한테 자주 연락했어요.”', sub:'조각 1 · 관계 +3', run(S){ const ch = []; fx(S, {bond:3}, ch); givePiece(S, ch); return {text:'“잘했어요. 이런 해에 연락이 끊긴 사람은 다시 잘 안 돌아와요. 매주 한 명씩, 먼저 안부를 물어요. 그것만 계속해요.”', chips:ch, mood:'tender'}; }},
    {label:'“아무것도 못 했어요. 그냥 버텼어요.”', sub:'조각 1 · 마음 +1 · 스트레스 -8', run(S){ const ch = []; fx(S, {self:1, stress:-8}, ch); givePiece(S, ch); return {text:'“버틴 것도 한 거예요. 그 해에 그만둔 사람이 정말 많았어요. 당신은 아직 여기 있잖아요.” 할머니가 조각을 손바닥에 꼭 쥐여 주었다.', chips:ch, mood:'tender'}; }},
  ]},
];

// 1위 발표 결과(4장 2번). bonus 는 미래 지식으로 올리는 확률.
function _iaWinLose(S, eff, lead, bonus){
  const ch = [], I = IDOL(S); fx(S, eff, ch); bonus = bonus || 0;
  if(isIdol(S)){
    const win = R() < clamp(0.2 + fansOf(S) / 80 + bonus, 0.15, 0.85);
    if(win){ I.wins++; addFans(S, 1 + fansOf(S) * 0.04, ch); fx(S, {self:3, work:2}, ch); S.album.push(`${_iaTeam(S)} 음악방송 1위`); return {text:`${lead} “이번 주 1위는… ${_iaTeam(S)}!” 앵콜 무대에서 노래를 한 소절도 못 불렀다. ${I.wins === 1 ? '첫 1위였다.' : `통산 ${I.wins}번째 1위.`}`, chips:ch, mood:'happy'}; }
    fx(S, {stress:5}, ch); if(!_iaSame(S)) rivalMood(S, -1, ch);
    return {text:`${lead} 다른 이름이 불렸다. ${_iaSame(S) ? '선배 그룹에게 박수를 쳤다. 손바닥이 아팠다.' : '하린이 트로피를 들었다. 눈이 마주쳤다. 하린이 먼저 고개를 돌렸다.'} 대기실로 돌아오는 복도가 길었다.`, chips:ch, mood:'sad'};
  }
  const pass = R() < 0.1 + bonus;
  if(pass){ fx(S, {self:3, dare:1}, ch); addFans(S, 0.2, ch); return {text:`${lead} 결과는 나였다. 다만 회사 사정으로 데뷔는 미정이라고 했다. 그래도 처음으로 ‘합격’이라는 말을 다시 들었다.`, chips:ch, mood:'happy'}; }
  fx(S, {stress:6, ins:1}, ch);
  return {text:`${lead} 열여덟 살 연습생의 이름이 불렸다. 그 아이에게 먼저 축하한다고 말했다. 엘리베이터 문이 닫히고 나서야 다리가 풀렸다.`, chips:ch, mood:'sad'};
}

// ════════ 라이벌(서하린) 랜덤 이벤트 ════════
const RIVAL_EVENTS = [
// ── 연습생 시절 ──
Object.assign({}, _iaHarin, {id:'rv_1', w:4, cd:10, cond:S => isTrainee(S) && S.m >= 2 && S.m <= 21, place:'night', img:'art/bg_practice.webp', title:'B연습실 쟁탈전',
  text:S => `새벽 여섯 시, 거울이 제일 큰 B연습실. 문을 열자 하린이 먼저 와 있었다. ${rivalState(S) === 'ally' ? '“왔어요? 반 나눠 써요. 오른쪽이 거울 덜 휘었어요.”' : rivalState(S) === 'enemy' ? '“예약은 내가 먼저 했어요.” 문을 닫으라는 눈빛이었다.' : '“여기 내가 매일 쓰는 데예요.” 하린이 이어폰 한쪽만 뺐다.'}`,
  choices:[
    {label:'“그럼 반씩 나눠 써요.”', sub:'댄스 +2 · 하린 관계 +1 · 거울이 반뿐', run:S => _ia(S, {skill:2, stress:1}, 1, '거울 한가운데에 테이프로 선을 그었다. 두 시간 동안 서로의 음악이 섞였다. 끝날 무렵 하린이 말했다. “당신 노래 박자, 생각보다 괜찮네요.”', 'serious')},
    {label:'옥상에 가서 혼자 연습한다', sub:'보컬 +2 · 체력 -4 · 하린 관계 변화 없음', run:S => _ia(S, {know:2, hp:-4}, 0, '옥상 바람 속에서 발성만 했다. 거울은 없었지만 내 목소리는 잘 들렸다. 내려오는 계단에서 하린과 마주쳤다. 하린이 내 목을 보고 말했다. “목도리 해요.”')},
    {label:'내일은 다섯 시에 오겠다고 선언한다', sub:'실력 +2 · 체력 -6 · 하린 관계 -1', run:S => _ia(S, {work:2, hp:-6, stress:3}, -1, '다음 날 다섯 시. 하린은 네 시 반에 와 있었다. 둘 다 웃지 않았다. 둘 다 그 주 평가에서 순위가 올랐다.', 'surprised')},
  ]}),

Object.assign({}, _iaHarin, {id:'rv_2', w:3, cd:14, cond:S => isTrainee(S) && S.m >= 3 && S.m <= 21, place:'room', img:'art/bg_dorm.webp', title:'떨어진 보컬 노트',
  text:S => '숙소 복도에 낡은 노트 한 권이 떨어져 있었다. 표지에 ‘H’. 펼쳐 보니 날짜별 발성 기록과 체중, 그리고 매 장 맨 아래 같은 문장. ‘오늘도 1등. 내일도 1등.’',
  choices:[
    {label:'읽지 않고 바로 돌려준다', sub:'하린 관계 +2 · 관계 +1', run:S => _ia(S, {bond:1}, 2, '“복도에 떨어져 있었어요. 안 봤어요.” 하린이 노트를 받아 가슴에 안았다. “…봤어도 괜찮아요. 별거 없으니까.” 목소리가 평소보다 작았다.', 'tender')},
    {label:'발성 기록만 몇 장 사진 찍고 돌려준다', sub:'보컬 +3 · 멘탈 -1 · 들키면 하린 관계 -3', run(S){ if(R() < 0.4) return _ia(S, {know:3, ins:-1, stress:4}, -3, '돌려주는데 하린이 내 휴대폰 화면을 봤다. 아무 말 없이 노트를 받아 갔다. 그 주 내내 하린은 나를 투명인간처럼 대했다.', 'serious'); return _ia(S, {know:3, ins:-1}, 0, '하린의 호흡 연습법은 생각보다 단순했다. 매일 같은 시간, 같은 순서. 따라 해 보니 일주일 만에 고음이 편해졌다. 조금 찜찜했다.'); }},
    {label:'맨 아래 문장 밑에 한 줄 적어 돌려준다', sub:'하린 관계는 상황에 따라 · 마음 +1', run(S){ return rivalState(S) === 'enemy' ? _ia(S, {self:1, stress:2}, -1, '‘가끔은 2등도 괜찮아요.’ 다음 날 그 페이지는 찢겨 나가 있었다. 대신 새 페이지에 더 큰 글씨로 적혀 있었다. ‘오늘도 1등.’', 'serious') : _ia(S, {self:1, bond:1}, 2, '‘가끔은 2등도 괜찮아요.’ 며칠 뒤 내 사물함에 포스트잇이 붙어 있었다. ‘당신한텐 안 져요. 그래도 고마워요.’', 'surprised'); }},
  ]}),

Object.assign({}, _iaHarin, {id:'rv_3', w:5, cd:12, cond:S => isTrainee(S) && lastRank(S) != null && lastRank(S) <= 3 && S.m >= 4, place:'stage', img:'art/bg_eval.webp', title:'1위 바로 아래',
  text:S => `월말평가 결과표. ${lastRank(S) === 1 ? '1위 칸에 내 이름이 있었다. 하린은 2위. 입소 이후 처음 있는 일이었다.' : `하린 바로 아래, ${lastRank(S)}위에 내 이름. 점수 차는 2점.`} 탈의실에서 하린이 다가왔다. ${rivalState(S) === 'ally' ? '“축하해요. 진심이에요. 근데 다음 달엔 내가 다시 가져갈 거예요.”' : '“운이 좋았네요.” 목소리가 낮았다.'}`,
  choices:[
    {label:'“운 아니에요. 다음 달에 증명할게요.”', sub:'실력 +2 · 스트레스 +4 · 하린 관계 -1', run:S => _ia(S, {work:2, stress:4}, -1, '하린이 처음으로 웃었다. 비웃음이 아니었다. “좋아요. 그 말 기억할게요.” 그날부터 연습실 불을 끄는 사람은 늘 우리 둘 중 하나였다.', 'serious')},
    {label:'“같이 연습할래요? 서로 약점 봐 주기.”', sub:'보컬 +1 · 댄스 +1 · 하린 관계 +2', run(S){ return rivalState(S) === 'enemy' ? _ia(S, {stress:2}, 0, '“경쟁자한테 약점을 보여 주라고요?” 하린이 고개를 저었다. 그런데 문을 나가다 멈췄다. “…당신 왼쪽 턴, 축이 흔들려요. 그거 하나만 알려 줄게요.”', 'surprised') : _ia(S, {know:1, skill:1, bond:1}, 2, '“딱 한 시간만.” 그 한 시간이 세 시간이 됐다. 하린은 내 왼쪽 턴을, 나는 하린의 고음 끝처리를 고쳤다. 둘 다 투덜대면서 끝까지 했다.', 'tender'); }},
    {label:'결과표를 사진 찍어 엄마에게 보낸다', sub:'엄마 관계 +4 · 마음 +2 · 하린 관계 변화 없음', run(S){ const ch = []; _iaMom(S, 4, ch); fx(S, {self:2}, ch); return {text:'엄마는 답장 대신 전화를 걸었다. “이거 잘한 거지? 몇 등 중에?” 열두 명 중이라고 하자 엄마가 그걸 또 동네에 자랑했다고 한다.', chips:ch, mood:'happy'}; }},
  ]}),

Object.assign({}, _iaHarin, {id:'rv_4', w:3, cd:16, cond:S => isTrainee(S) && S.m >= 5 && SS(S).rival <= -2, place:'night', img:'art/bg_practice.webp', title:'사라진 MR 파일',
  text:S => '평가 하루 전, 연습실 컴퓨터에서 내 평가곡 MR 파일이 사라졌다. 마지막으로 그 컴퓨터를 쓴 사람은 하린이었다. 동기들이 수군거렸다. 하린은 이어폰을 낀 채 아무 말도 하지 않았다.',
  choices:[
    {label:'하린에게 직접 묻는다', sub:'하린 관계는 진실에 따라 · 스트레스 +4', run(S){ return R() < 0.7 ? _ia(S, {stress:4, ins:1}, 2, '“내가 그런 짓 할 사람으로 보여요?” 하린이 컴퓨터를 켜 휴지통을 열었다. 파일은 거기 있었다. 청소하던 트레이너가 실수로 지운 거였다. 하린이 덧붙였다. “물어봐 줘서 고마워요. 다들 그냥 나라고 믿던데.”', 'surprised') : _ia(S, {stress:6}, -2, '“내가 지웠어요. 실수로.” 하린의 목소리에 미안함은 없었다. 진짜 실수인지 알 수 없었다. 그날 밤 MR을 새로 따느라 잠을 못 잤다.', 'serious'); }},
    {label:'아무 말 없이 무반주로 준비한다', sub:'보컬 +3 · 멘탈 +2 · 체력 -6', run:S => _ia(S, {know:3, ins:2, hp:-6}, 1, '반주 없이 밤새 불렀다. 평가 날, 무반주 무대에 심사위원들이 고개를 들었다. 끝나고 하린이 지나가며 말했다. “나 아니에요. …근데 그 무대는 좋았어요.”', 'serious')},
    {label:'오 실장에게 알린다', sub:'스트레스 -2 · 하린 관계 -3 · 동기들 사이가 시끄러워진다', run:S => _ia(S, {stress:-2, bond:-1}, -3, '오 실장이 CCTV를 확인했다. 하린이 아니었다. 실수로 지운 트레이너가 사과했다. 일은 끝났지만, 하린은 그 뒤로 나와 같은 엘리베이터를 타지 않았다.', 'sad')},
  ]}),

Object.assign({}, _iaHarin, {id:'rv_5', w:4, cd:14, cond:S => isTrainee(S) && S.m >= 6 && SS(S).rival >= 2, place:'night', img:'art/bg_dorm.webp', title:'옥상의 컵라면',
  text:S => '체중 측정 전날 밤 열한 시, 숙소 옥상. 하린이 컵라면 두 개를 들고 서 있었다. “반씩 먹어요. 혼자 먹으면 죄책감이 두 배라서.” 하린이 이런 농담을 할 줄은 몰랐다.',
  choices:[
    {label:'반 나눠 먹으며 이야기한다', sub:'관계 +2 · 마음 +2 · 하린 관계 +2 · 비주얼 평가 불리', run:S => _ia(S, {bond:2, self:2, charm:-0.5}, 2, '라면 국물이 식을 때까지 이야기했다. 하린은 열여섯 살에 입소했다고 했다. 친구들 졸업 사진에 자기만 없다고. 그날 처음으로 하린을 ‘언니’가 아니라 이름으로 불렀다.', 'tender')},
    {label:'“내일 측정이잖아요.” 국물만 한 입 먹는다', sub:'비주얼 +1 · 하린 관계 +1 · 스트레스 +2', run:S => _ia(S, {charm:1, stress:2}, 1, '하린이 웃었다. “그 말 할 줄 알았어요.” 하린은 남은 라면을 다 먹고 다음 날 체중계 앞에서 아무렇지 않은 얼굴을 했다. 숫자는 그대로였다. 비결은 끝내 안 알려 줬다.')},
    {label:'라면 대신 편의점 샐러드를 사 온다', sub:'자금 -6 · 체력 +4 · 하린 관계 +1', run:S => _ia(S, {cash:-6, hp:4}, 1, '“이게 뭐예요.” “우리 둘 다 내일 살아남자고요.” 하린이 포크로 방울토마토를 찔렀다. “…당신 진짜 이상해요.” 그래도 끝까지 먹었다.', 'surprised')},
  ]}),

// ── 데뷔 후 ──
Object.assign({}, _iaHarin, {id:'rv_6', w:4, cd:12, cond:S => _iaSame(S) && sinceDebut(S) >= 3, place:'room', img:'art/bg_studio.webp', title:'이번 활동의 센터',
  text:S => `컴백 회의. 프로듀서가 말했다. “이번엔 센터를 바꿔 볼까 해. 서윤이나 하린.” ${rivalState(S) === 'ally' ? '하린이 테이블 아래로 내 발을 툭 쳤다. 네가 하라는 건지, 붙어 보자는 건지 알 수 없었다.' : rivalState(S) === 'enemy' ? '하린이 먼저 말했다. “전 지금까지 센터였고, 성적도 나쁘지 않았어요.”' : '하린도 나도 대답하지 않았다. 회의실이 조용해졌다.'}`,
  choices:[
    {label:'“제가 할게요.” 센터를 맡는다', sub:'팬 + · 실력 +2 · 스트레스 +5 · 하린 관계 -2', run(S){ const ch = []; fx(S, {work:2, stress:5}, ch); addFans(S, 1 + fansOf(S) * 0.03, ch); rivalMood(S, -2, ch); return {text:'뮤직비디오 첫 장면이 내 얼굴이 됐다. 직캠 조회수도 올랐다. 대기실 거울 앞에서 하린이 말했다. “센터는 실수하면 다 센터 탓이에요. 알죠?”', chips:ch}; }},
    {label:'“하린이 하는 게 맞아요.” 양보한다', sub:'관계 +3 · 하린 관계 +3 · 팬 조금', run(S){ const ch = []; fx(S, {bond:3, self:-1}, ch); addFans(S, 0.3, ch); rivalMood(S, 3, ch); return {text:'하린이 회의가 끝나고 따라 나왔다. “왜 양보해요? 나 불쌍해서?” “아니. 이번 곡은 네 목소리가 맞아서.” 하린이 한참 나를 보다가 고개를 끄덕였다.', chips:ch, mood:'tender'}; }},
    {label:'“둘이 파트를 나눠 더블 센터로 가요.”', sub:'예능감 +2 · 하린 관계 +1 · 프로듀서 설득은 표현력에 달렸다', run(S){ const ch = []; fx(S, {dare:2}, ch); if(S.st.sense + rand(-10, 10) > 42){ addFans(S, 0.8, ch); rivalMood(S, 2, ch); return {text:'1절은 하린, 2절은 나. 마지막 후렴에서 둘이 마주 보는 안무가 생겼다. 그 장면이 활동 내내 가장 많이 돌았다.', chips:ch, mood:'happy'}; } rivalMood(S, 1, ch); fx(S, {stress:3}, ch); return {text:'프로듀서가 고개를 저었다. “어정쩡해.” 센터는 하린이 됐다. 하린이 작게 말했다. “그래도 그 아이디어는 좋았어요.”', chips:ch}; }},
  ]}),

Object.assign({}, _iaHarin, {id:'rv_7', w:3, cd:16, cond:S => _iaSame(S) && sinceDebut(S) >= 1, place:'room', img:'art/bg_dorm.webp', title:'같은 방, 다른 알람',
  text:S => `숙소 방 배정이 바뀌었다. 하린과 같은 방. 하린의 알람은 다섯 시, 내 알람은 일곱 시. ${rivalState(S) === 'enemy' ? '사흘째 둘 다 서로의 알람에 깨고 있다. 공기가 냉랭하다.' : '하린은 알람이 울리기 전에 일어나 조용히 끈다. 그래도 나는 깬다.'}`,
  choices:[
    {label:'나도 다섯 시에 일어난다', sub:'실력 +2 · 체력 -8 · 하린 관계 +1', run:S => _ia(S, {work:2, hp:-8}, 1, '다섯 시, 둘이 나란히 스트레칭을 했다. 하린이 말했다. “억지로 맞출 필요 없어요.” “억지 아닌데.” 거짓말이었다. 그래도 일주일 뒤엔 정말 몸이 맞춰졌다.', 'serious')},
    {label:'“방 바꿔 달라고 할까?” 솔직하게 말한다', sub:'스트레스 -4 · 하린 관계는 지금 사이에 달렸다', run(S){ return rivalState(S) === 'enemy' ? _ia(S, {stress:-4}, -1, '“그래요. 나도 그게 편해요.” 다음 날 하린의 짐이 옆방으로 옮겨졌다. 잠은 잘 왔다. 거실에서 마주칠 때마다 조금 어색했다.') : _ia(S, {stress:-4, bond:1}, 1, '하린이 웃었다. “그냥 내가 진동으로 바꿀게요.” 그날 밤 하린이 이불 속에서 말했다. “사실 혼자 자면 무서워서 일찍 일어나는 거예요.”', 'surprised'); }},
    {label:'귀마개를 사서 아무 말 없이 버틴다', sub:'자금 -3 · 멘탈 +1 · 관계 -1', run:S => _ia(S, {cash:-3, ins:1, bond:-1}, 0, '귀마개는 효과가 있었다. 대신 아침마다 하린이 나간 줄도 모르고 혼자 일어났다. 같은 방인데 한 마디도 안 한 날이 늘었다.')},
  ]}),

Object.assign({}, _iaHarin, {id:'rv_8', w:4, cd:12, cond:S => isIdol(S) && !_iaSame(S), place:'stage', img:'art/bg_stage.webp', title:'같은 주 컴백',
  text:S => `${GROUP_NAME}와 같은 주에 컴백한다. 기사 제목은 ‘같은 소속사 출신 라이벌 대결’. 음방 대기실 복도에서 하린과 마주쳤다. ${rivalState(S) === 'ally' ? '하린이 먼저 웃었다. “잘해요. 근데 1위는 우리가 해요.”' : rivalState(S) === 'enemy' ? '하린은 인사도 없이 지나갔다. 하린의 매니저가 대신 고개를 숙였다.' : '하린이 고개만 까딱했다. 둘 다 무대 의상 차림이었다.'}`,
  choices:[
    {label:'먼저 음료를 사서 하린 대기실에 넣는다', sub:'하린 관계 +2 · 팬소통 +1 · 팬들 사이 훈훈', run(S){ const ch = []; fx(S, {neg:1, bond:1}, ch); addFans(S, 0.4, ch); rivalMood(S, 2, ch); return {text:'‘같이 잘해요.’ 쪽지를 붙였다. 다음 날 하린의 개인 채널에 그 음료 사진이 올라왔다. 두 팬덤이 처음으로 서로를 칭찬하는 글을 썼다.', chips:ch, mood:'tender'}; }},
    {label:'무대로만 말한다', sub:'표현력 +2 · 실력 +2 · 체력 -6 · 하린 관계 -1', run(S){ const ch = []; fx(S, {sense:2, work:2, hp:-6}, ch); addFans(S, 0.8, ch); rivalMood(S, -1, ch); return {text:'리허설부터 전력을 다했다. 무대가 끝나고 모니터 앞에 하린이 서 있었다. 내 무대를 끝까지 보고 있었다. 눈이 마주치자 돌아섰다.', chips:ch, mood:'serious'}; }},
    {label:'예능에서 라이벌 구도를 웃음으로 받아친다', sub:'예능감 +2 · 팬 + · 스캔들 위험 +3', run(S){ const ch = []; fx(S, {dare:2}, ch); addFans(S, 0.9, ch); addScandal(S, 3, ch); return {text:'“하린이요? 연습생 때 제 라면 뺏어 먹은 사람이에요.” 스튜디오가 터졌다. 클립이 돌았다. 하린 팬 일부는 화를 냈다. 하린은 그 클립에 웃는 이모티콘 하나를 달았다.', chips:ch, mood:'surprised'}; }},
  ]}),

Object.assign({}, _iaHarin, {id:'rv_9', w:4, cd:14, cond:S => isOut(S) && S.m >= 22, place:'night', img:'art/bg_room_winter.webp', title:'화면 속의 하린',
  text:S => `편의점 야간 알바. 계산대 옆 작은 텔레비전에 ${GROUP_NAME}가 나왔다. 센터에서 웃는 하린. 그때 휴대폰이 울렸다. 하린이었다. ${rivalState(S) === 'enemy' ? '「잘 지내요? 그냥, 생각나서요.」 연락처를 지우지 않았던 게 생각났다.' : '「요즘 뭐 해요? 연습은 하죠?」'}`,
  choices:[
    {label:'“아직 포기 안 했어.” 답장한다', sub:'마음 +2 · 하린 관계 +2 · 스트레스 +2', run:S => _ia(S, {self:2, stress:2}, 2, '답장이 바로 왔다. 「알아요. 당신은 그런 사람이니까. 오디션 정보 있으면 보낼게요.」 다음 날 정말로 링크 세 개가 왔다.', 'tender')},
    {label:'답장하지 않고 텔레비전을 끈다', sub:'멘탈 +1 · 스트레스 -2 · 하린 관계 -1', run:S => _ia(S, {ins:1, stress:-2}, -1, '리모컨을 내려놓았다. 부러운 건지 미운 건지 나도 몰랐다. 메시지는 읽지 않은 채로 남았다.', 'sad')},
    {label:'“연습 영상 하나만 봐 줄래?” 부탁한다', sub:'보컬 +1 · 댄스 +1 · 하린 관계는 지금 사이에 달렸다', run(S){ return rivalState(S) === 'enemy' ? _ia(S, {know:1, skill:1, stress:3}, 0, '하린의 피드백은 열두 줄이었다. 칭찬은 한 줄도 없었다. 마지막 줄만 달랐다. 「이 정도면 붙어요. 대충 하지만 않으면.」', 'serious') : _ia(S, {know:1, skill:1, bond:1}, 2, '하린이 쉬는 날 영상통화를 걸어 왔다. 두 시간 동안 내 안무를 한 동작씩 짚었다. 끝나고 하린이 말했다. “빨리 올라와요. 붙어 볼 사람이 없어서 심심해요.”', 'tender'); }},
  ]}),

Object.assign({}, _iaHarin, {id:'rv_10', w:3, cd:20, cond:S => isIdol(S) && S.m >= 36, place:'night', img:'art/bg_hospital.webp', title:'하린의 발목',
  text:S => `${_iaSame(S) ? '콘서트 리허설에서 하린이 계단을 헛디뎠다. 발목 인대 손상, 전치 3주. 하린의 파트와 센터 동선을 누가 대신할지 회의가 열렸다.' : `기사 속보. ‘${GROUP_NAME} 서하린, 무대 중 부상.’ 하린은 내일 우리와 같은 음악방송에 나올 예정이었다.`} ${rivalState(S) === 'enemy' ? '솔직히 마음 한구석이 복잡했다.' : '휴대폰을 든 손이 먼저 움직였다.'}`,
  choices:[
    {label:'병원에 찾아간다', sub:'관계 +2 · 하린 관계 +3 · 체력 -4', run:S => _ia(S, {bond:2, hp:-4}, 3, '병실 문을 열자 하린이 이불을 끌어 올렸다. “뭐 하러 와요.” 깁스 위에 매직으로 적어 줬다. ‘빨리 와. 혼자 1등 하면 재미없어.’ 하린이 그걸 보고 한참 웃었다.', 'tender')},
    {label:'그 빈자리만큼 무대에 더 힘을 준다', sub:'실력 +2 · 팬 + · 체력 -10 · 하린 관계는 방식에 따라', run(S){ const ch = []; fx(S, {work:2, hp:-10}, ch); addFans(S, 0.8, ch); if(_iaSame(S)){ rivalMood(S, rivalState(S) === 'enemy' ? -1 : 1, ch); return {text:'하린의 파트를 밤새 외웠다. 무대 위에서 하린의 동선을 그대로 따라 했다. 끝나고 하린의 메시지. 「내 자리 오래 있지 마요.」 웃는 이모티콘이 붙어 있었다.', chips:ch}; } rivalMood(S, -1, ch); return {text:'하린이 빠진 그 주, 우리 무대가 1위 후보에 올랐다. 기사에는 ‘라이벌 공백의 수혜’라고 적혔다. 기쁘면서도 이상하게 씁쓸했다.', chips:ch}; }},
    {label:'짧은 메시지만 보내고 내 일을 한다', sub:'멘탈 +1 · 실력 +1 · 하린 관계 변화 없음', run:S => _ia(S, {ins:1, work:1}, 0, '「푹 쉬어요.」 네 글자를 보냈다. 하린의 답도 네 글자였다. 「고마워요.」 우리 사이는 딱 그 정도였다. 그 정도도 나쁘지 않았다.')},
  ]}),
];
