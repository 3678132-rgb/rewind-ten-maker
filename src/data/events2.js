// 이벤트 확장판 (ENGINE 구간 안, DOM 금지). events.js의 EVENTS에 이어 붙인다.
// ── 연애 인물별 말투: 연애 사건 템플릿에서 인물마다 다른 대사가 나오도록 ─────────────
const LOVE_VOICE = {
  jaewoo:   {warm:'“네가 있어서 힘이 나.”', tease:'“또 네가 이겼네.”', sorry:'“…미안, 내가 또 내 얘기만 했지.”'},
  minjun:   {warm:'“네 옆이 제일 편해.”', tease:'“너 웃을 때 코 찡긋하는 거 알아?”', sorry:'“말을 잘 못해서 미안.”'},
  hajin:    {warm:'“너랑 있으면 꿈이 더 선명해져.”', tease:'“대표님 허락 없이 퇴근하시나요?”', sorry:'“또 일 얘기만 했네. 미안.”'},
  taeoh:    {warm:'“서두르지 않아도 돼. 난 여기 있을게.”', tease:'“오늘은 어느 쪽 길로 같이 헤맬까?”', sorry:'“연락 못 해서 미안해요.”'},
  jihu:     {warm:'“오늘도 수고했어요.”', tease:'“회의 때처럼 단호하게 말해 볼래요?”', sorry:'“제가 말이 짧았죠.”'},
  dohyun:   {warm:'“너 있으면 현장이 덜 외로워.”', tease:'“컷! 이건 NG, 다시 가자.”', sorry:'“내가 또 촬영에 취했어.”'},
  sian:     {warm:'“네 문장 옆에 내가 있고 싶어요.”', tease:'“이 대사, 너무 낯간지러운데요?”', sorry:'“내 고집이 과했어요.”'},
  seunghyun:{warm:'“카메라 밖의 네가 제일 좋아요.”', tease:'“이번엔 내가 대본 없이 말해 볼게요.”', sorry:'“괜히 불안하게 했죠.”'},
  geonwoo:  {warm:'“오늘 하루의 마지막이 너라서 좋다.”', tease:'“이의 있습니다. 반론은 저녁 먹고.”', sorry:'“내가 너무 원칙만 따졌네요.”'},
  yuchan:   {warm:'“네가 있으면 에러도 귀여워.”', tease:'“재부팅하면 기분이 풀릴까?”', sorry:'“알림 꺼 놓고 있었네. 미안.”'},
  raon:     {warm:'“무대 위에서도, 밖에서도 네가 제일 먼저 떠올라요.”', tease:'“사인해 드릴까요? 오늘만 특별히 공짜예요.”', sorry:'“스케줄 때문에 또 늦었어요. 미안해요.”'},
  ujin:     {warm:'“네 손끝의 색이 좋아요.”', tease:'“이 천은 안 어울리는데, 너는 어울려요.”', sorry:'“또 작업에만 빠졌어요.”'},
};
const hasP = S => !!S.partner && !!S.love[S.partner] && S.love[S.partner].stage >= 1;
const PN = S => LOVERS[S.partner].name;
const PV = S => LOVE_VOICE[S.partner] || LOVE_VOICE.minjun;
const LV = (S, d, o, text) => { const ch = []; addAff(S, S.partner, d, ch); fx(S, o, ch); return {text, chips:ch}; };
const seenKey = (S, k) => !!S.seen[k + '_' + S.partner];
const markKey = (S, k) => { S.seen[k + '_' + S.partner] = true; };
const sinceMonths = S => S.m - (S.love[S.partner].since2 != null ? S.love[S.partner].since2 : S.love[S.partner].since);

EVENTS.push(
  // ── 연애 일상 (공식 연인이 있을 때, 상대마다 말투가 다르다) ────────────────
  {id:'love_100', w:30, cd:1, cond:S => hasP(S) && sinceMonths(S) >= 3 && !seenKey(S, 'love100'), place:'night', title:'100일', speaker:'', img:null,
   text:S => `${PN(S)}와 사귄 지 벌써 100일이 되었다. ${PN(S)}가 작은 상자를 내밀었다. ${PV(S).warm}`,
   choices:[
     {label:'직접 쓴 편지를 건넨다', sub:'호감 +8 · 나 +1', run(S){ markKey(S, 'love100'); return LV(S, 8, {self:1, bond:1.5}, '밤새 쓴 편지를 건네자 그가 한 줄씩 소리 내어 읽었다. 읽는 목소리가 조금 떨렸다.'); }},
     {label:'서로 좋아하는 음식을 만들어 먹는다', sub:'호감 +6 · 스트레스 -5', run(S){ markKey(S, 'love100'); return LV(S, 6, {stress:-5, bond:1.5}, '서툰 솜씨로 만든 음식이 하나도 맞지 않았는데, 이상하게 가장 맛있는 저녁이었다.'); }},
     {label:'바빠서 문자로만 축하한다', sub:'호감 -4', run(S){ markKey(S, 'love100'); return LV(S, -4, {stress:3}, `“…그래, 바쁘면 어쩔 수 없지.” ${PV(S).sorry.replace(/^“…?/, '“')}이라고 답했지만 목소리가 가라앉아 있었다.`); }},
   ]},
  {id:'love_jealous', w:5, cd:14, cond:S => hasP(S) && sinceMonths(S) >= 5, place:'cafe', title:'작은 질투', speaker:'',
   text:S => `${PN(S)}의 휴대폰 화면에 낯선 이름의 메시지가 떴다. 별것 아닐 수도 있지만 마음이 따끔했다. 마흔의 나는 이런 순간을 그냥 삼켰다.`,
   choices:[
     {label:'솔직하게 물어본다', sub:'협상이 높을수록 좋다', run(S){ const ok = S.st.neg + rand(-12, 14) >= 40; return ok ? LV(S, 6, {self:2, ins:1}, `“누구야?” 묻자 그가 웃으며 설명해 주었다. ${PV(S).tease} 오해가 풀리자 마음이 가벼워졌다.`) : LV(S, -4, {stress:6}, '질문이 추궁처럼 들렸는지 그가 얼굴을 굳혔다. 괜히 서로 기분만 상했다.'); }},
     {label:'모른 척 넘어간다', sub:'스트레스 +4', run:S => LV(S, 0, {stress:4}, '아무 일도 없다는 얼굴을 했지만 집에 와서도 한참 그 이름이 머리에서 떠나지 않았다.')},
     {label:'나도 질투한다고 가볍게 말한다', sub:'호감 +3', run:S => LV(S, 3, {self:1.5}, `“나 지금 조금 질투 나.” 말하자 그가 놀란 얼굴로 웃었다. ${PV(S).warm}`)},
   ]},
  {id:'love_sick', w:4, cd:18, cond:S => hasP(S) && sinceMonths(S) >= 4, place:'room', title:'아픈 날', speaker:'',
   text:S => `${PN(S)}가 독감에 걸려 연락이 끊겼다. 혼자 앓고 있을 모습이 걱정된다. 마흔의 나는 이런 때 “푹 쉬어”라고만 말했다.`,
   choices:[
     {label:'죽과 약을 사 들고 찾아간다', sub:'호감 +8 · 체력 -5', run:S => LV(S, 8, {hp:-5, bond:2}, '현관에서 마스크를 쓴 그가 놀란 눈을 했다. 죽을 먹는 모습을 지켜보다 나도 모르게 웃음이 났다.')},
     {label:'문자와 배달 앱으로 챙긴다', sub:'호감 +3', run:S => LV(S, 3, {cash:-8}, '문 앞에 죽을 두고 가겠다고 문자를 보냈다. 한 시간 뒤 “고마워”라는 답이 왔다.')},
     {label:'옮을까 봐 연락만 한다', sub:'호감 -3', run:S => LV(S, -3, {stress:2}, '그는 알겠다고 했지만 한동안 답이 짧았다.')},
   ]},
  {id:'love_surprise', w:4, cd:16, cond:S => hasP(S) && sinceMonths(S) >= 6, place:'night', title:'서프라이즈', speaker:'',
   text:S => `퇴근길에 ${PN(S)}가 갑자기 앞에 나타났다. 손에는 꽃 한 송이. “오늘 별일 없는데, 그냥 보고 싶어서.” ${PV(S).warm}`,
   choices:[
     {label:'환하게 웃으며 안긴다', sub:'호감 +7 · 스트레스 -8', run:S => LV(S, 7, {stress:-8, bond:2}, '피곤이 한꺼번에 녹았다. 아무 이유 없는 날이 이렇게 특별해질 수 있다는 걸 몰랐다.')},
     {label:'“연락 없이 오면 놀라잖아”라고 말한다', sub:'호감 -3', run:S => LV(S, -3, {stress:2}, '말이 먼저 나가 버렸다. 그의 얼굴에서 빛이 한 겹 사라졌다.')},
   ]},
  {id:'love_parents', w:4, cd:36, once:true, cond:S => hasP(S) && sinceMonths(S) >= 8 && S.m >= 40, speaker:'엄마', place:'room', img:'art/mom.webp', title:'엄마에게 소개하다',
   text:S => `엄마가 눈치를 챈 듯 전화에서 슬쩍 물었다. “요즘 만나는 사람 있니?” 마흔의 나는 이 질문에 늘 얼버무렸다. 이번엔 ${PN(S)}를 소개해도 좋을까?`,
   choices:[
     {label:'주말에 함께 내려간다', sub:'호감 +6 · 관계 +4', run(S){ S.mom = clamp((S.mom || 40) + 6, 0, 100); return LV(S, 6, {bond:4, stress:3}, `엄마는 ${PN(S)}에게 계속 밥을 권했다. 현관에서 엄마가 내 귀에 속삭였다. “사람 참 괜찮다. 눈이 좋아.”`); }},
     {label:'아직은 말하지 않는다', sub:'스트레스 +2', run:S => LV(S, -1, {stress:2}, '“아직은 친구예요.” 전화를 끊고 나서 괜히 마음이 무거웠다.')},
   ]},
  {id:'love_trip', w:4, cd:20, cond:S => hasP(S) && sinceMonths(S) >= 6 && S.cash >= 80, place:'night', title:'둘만의 여행', speaker:'',
   text:S => `${PN(S)}가 짧은 여행을 제안했다. 바다가 보이는 작은 마을, 1박 2일. ${PV(S).tease}`,
   choices:[
     {label:'좋아, 가자', sub:'자금 -60 · 호감 +8 · 스트레스 -15', run:S => LV(S, 8, {cash:-60, stress:-15, self:2, bond:2}, '밤바다 앞에 나란히 앉아 아무 말도 하지 않았다. 그 침묵이 이상하게 가득 차 있었다.')},
     {label:'일정이 걱정돼서 미룬다', sub:'일 +1 · 호감 -3', run:S => LV(S, -3, {work:1.5, stress:3}, '“다음에 가자.” 그는 고개를 끄덕였지만 그 다음은 한참 오지 않았다.')},
   ]},
  {id:'love_busy', w:5, cd:12, cond:S => hasP(S) && S.hired, place:'cafe', title:'서로 바쁜 계절', speaker:'',
   text:S => `두 주째 ${PN(S)}와 데이트를 못 하고 있다. 서로 일이 바쁘다. 통화도 점점 짧아진다. 이대로 괜찮을까?`,
   choices:[
     {label:'일정을 조정해 반나절이라도 만난다', sub:'일 -1 · 호감 +6', run:S => LV(S, 6, {work:-1, stress:-4, bond:2}, '반나절의 커피 한 잔이 두 주의 공백을 채웠다. 서로 조금 더 일찍 말하기로 약속했다.')},
     {label:'지금은 일이 우선이라고 이해를 구한다', sub:'일 +2 · 호감 -4', run:S => LV(S, -4, {work:2, stress:4}, '그는 이해한다고 했지만, 이해와 서운함이 다른 곳에 있다는 걸 나는 안다.')},
     {label:'함께 일하는 시간을 만든다', sub:'호감 +3 · 일 +1', run:S => LV(S, 3, {work:1, bond:1}, '서로의 일을 도우며 보내는 저녁. 그것도 데이트가 될 수 있다는 걸 처음 알았다.')},
   ]},
  {id:'love_future', w:3, cd:24, once:true, cond:S => hasP(S) && sinceMonths(S) >= 12, place:'night', title:'우리의 미래', speaker:'',
   text:S => `${PN(S)}와 한강 둔치에 앉았다. 문득 그가 물었다. “우리, 오 년 뒤엔 뭘 하고 있을까?” 마흔의 나는 이 질문의 답을 알고 있다. 하지만 이번엔 아직 모른다.`,
   choices:[
     {label:'서로의 꿈을 번갈아 응원하자고 말한다', sub:'호감 +7 · 통찰 +1.5', run:S => LV(S, 7, {ins:1.5, self:2}, `“네 꿈도 내 꿈만큼 크게 적자.” ${PV(S).warm} 둘은 서로의 수첩에 꿈 하나씩을 적어 주었다.`)},
     {label:'“그냥 지금처럼만 있자”고 말한다', sub:'스트레스 -3', run:S => LV(S, 2, {stress:-3}, '답은 미뤄졌지만 손은 놓지 않았다. 천천히 가는 사랑도 사랑이다.')},
   ]},
  {id:'love_year', w:30, cd:1, once:false, cond:S => hasP(S) && sinceMonths(S) >= 12 && !seenKey(S, 'loveyear'), place:'night', title:'1주년', speaker:'',
   text:S => `${PN(S)}와 사귄 지 어느덧 1년. 처음 만난 날부터 오늘까지가 한 편의 영화처럼 스쳤다. ${PV(S).warm}`,
   choices:[
     {label:'처음 만난 장소로 돌아가 본다', sub:'호감 +8 · 나 +1', run(S){ markKey(S, 'loveyear'); return LV(S, 8, {self:1, bond:2}, '그곳엔 우리만 아는 풍경이 남아 있었다. “그때 우린 어떤 표정이었을까.” 둘이 동시에 같은 말을 했다.'); }},
     {label:'작은 선물을 서로 교환한다', sub:'자금 -15 · 호감 +6', run(S){ markKey(S, 'loveyear'); return LV(S, 6, {cash:-15, bond:1.5}, '서로의 선물을 열어 보며 같은 곳에서 웃음이 터졌다. 취향이 닮아 가고 있었다.'); }},
   ]},
  {id:'love_fight', w:4, cd:16, cond:S => hasP(S) && sinceMonths(S) >= 7, place:'night', title:'작은 다툼', speaker:'',
   text:S => `사소한 일로 ${PN(S)}와 말다툼이 시작됐다. 서로 한마디씩 날이 서 있다. 이 장면을 어디서 끊어야 할까.`,
   choices:[
     {label:'먼저 사과한다', sub:'호감 +4 · 스트레스 -3', run:S => LV(S, 4, {stress:-3, ins:1}, `“내가 말이 심했어.” 그가 눈을 크게 뜨더니 ${PV(S).sorry}`)},
     {label:'감정이 가라앉을 때까지 시간을 둔다', sub:'통찰 +1.5 · 호감 ±', run(S){ const ok = S.st.ins + rand(-10, 14) >= 42; return ok ? LV(S, 3, {ins:1.5}, '하룻밤 뒤 전화를 걸자 그도 똑같이 전화를 걸려던 참이었다고 했다.') : LV(S, -4, {stress:5}, '시간은 두었는데 연락은 끊겨 버렸다. 침묵이 사과보다 길어졌다.'); }},
     {label:'끝까지 따지고 든다', sub:'호감 -8', run:S => LV(S, -8, {stress:7}, '이긴 것 같았지만 그의 눈에는 아무 감정도 남아 있지 않았다. 이겨서 진 싸움이었다.')},
   ]},
  {id:'love_holiday', w:6, cd:12, cond:S => hasP(S) && monthOf(S) === 12, place:'night', title:'크리스마스 이브', speaker:'',
   text:S => `눈이 내리는 크리스마스 이브. ${PN(S)}와의 약속 장소에 도착하니 그가 먼저 와서 두 손을 호호 불고 있었다. ${PV(S).tease}`,
   choices:[
     {label:'장갑을 한쪽씩 나눠 낀다', sub:'호감 +8 · 스트레스 -6', run:S => LV(S, 8, {stress:-6, bond:2}, '한 손은 장갑, 한 손은 서로의 주머니. 올해의 눈은 유난히 따뜻했다.')},
     {label:'레스토랑에서 근사하게 보낸다', sub:'자금 -30 · 호감 +6', run:S => LV(S, 6, {cash:-30, bond:1.5}, '창가 자리에서 보이는 거리의 불빛이 반짝였다. 마흔의 크리스마스는 대부분 야근이었다.')},
   ]},
  {id:'love_birthday', w:30, cd:12, cond:S => hasP(S) && monthOf(S) === 3 && S.m >= 12, place:'night', title:'내 생일', speaker:'',
   text:S => `3월, 내 생일. 자정이 되자마자 ${PN(S)}의 전화가 울렸다. ${PV(S).warm} 마흔의 나는 생일을 혼자 보낸 해가 더 많았다.`,
   choices:[
     {label:'자정 통화를 오래 이어 간다', sub:'호감 +6 · 스트레스 -5', run:S => LV(S, 6, {stress:-5, self:1.5}, '“생일 축하해.” 목소리가 귓가에 오래 남았다. 잠들기 아쉬운 밤이었다.')},
     {label:'친구들, 엄마까지 함께 모인다', sub:'관계 +4 · 호감 +3', run:S => LV(S, 3, {bond:4, stress:-4}, '엄마의 미역국, 소연의 서툰 케이크, 그리고 ' + PN(S) + '의 선물. 어느 해보다 풍성한 생일이었다.')},
   ]},
);

// ═════════ 캠퍼스 생활 (대학 시절, 입학~졸업) ═════════
const campus = S => S.m < 48;
const MAJOR_PROF = {
  biz:'경영학과 교수님이 연구실로 불렀다. “자네는 숫자보다 사람을 먼저 보는군. 경영은 결국 사람이야.” 마흔의 내가 이십 년 뒤에야 알게 된 문장이었다.',
  media:'미디어학과 교수님이 과제물을 두드리며 말했다. “콘텐츠는 기술이 아니라 시선이에요. 당신의 시선은 이미 어른스럽네요.”',
  korean:'국문학과 교수님이 내 리포트를 한참 보시더니 말했다. “문장에 상처가 있어요. 그런데 그 상처가 문장을 살리고 있네요.”',
  cs:'컴퓨터공학과 교수님이 내 코드를 빤히 봤다. “이 설계… 학부생이 한 게 맞나? 어디서 배웠어요?” 마흔의 경력이 새어 나간 모양이다.',
  law:'법학과 교수님이 질문을 던졌다. “정의와 법이 충돌할 때 자네는 어느 쪽에 서겠나?” 마흔의 나는 늘 법의 편에 숨어 있었다.',
  vdesign:'시각디자인 교수님이 시안을 내려다보며 말했다. “기술은 늘 거라 걱정 없어요. 이 색들은 어디서 온 겁니까?” 대답하기 어려운 질문이었다.',
  theater:'연극영화과 교수님이 연습실에서 말했다. “연기는 거짓말이 아니라 진실을 빌려 오는 일이에요. 당신은 이미 아픈 진실을 아는 것 같네요.”',
  psych:'심리학과 교수님이 상담 후 조용히 말했다. “사람의 마음을 읽는 눈이 있어요. 그런데 본인의 마음은 잘 안 읽죠?” 정곡이었다.',
  fashion:'의류학과 교수님이 내 스케치를 들어 보였다. “옷은 몸이 아니라 시간을 입히는 일이에요. 계절을 아는 눈이네요.”',
  polisci:'정치외교학과 교수님이 토론 후 말했다. “논리는 있는데 공감이 따라오네요. 흔치 않은 조합입니다.”',
};
const MAJOR_THESIS = {
  biz:'졸업 프로젝트로 가상 기업의 사업 계획서를 쓴다.', media:'졸업 작품으로 짧은 다큐멘터리를 찍는다.', korean:'졸업 논문으로 한 작가의 문체를 파고든다.',
  cs:'졸업 작품으로 직접 서비스를 만들어 발표한다.', law:'졸업 논문으로 판례 하나를 깊이 분석한다.', vdesign:'졸업 전시회에 작품을 건다.',
  theater:'졸업 공연에서 주연을 맡는다.', psych:'졸업 논문으로 직접 실험을 설계한다.', fashion:'졸업 패션쇼에 내 컬렉션을 올린다.', polisci:'졸업 논문으로 국제 정세를 분석한다.',
};
EVENTS.push(
  {id:'c_orient', once:true, w:100, cond:S => S.m <= 2, place:'campus', title:'신입생 환영회',
   beats:['첫 학기, 3월. 학과 신입생 환영회 현수막 아래에서 낯선 얼굴들이 어색하게 인사를 나눈다.', '마흔의 나는 이 자리를 이십 년 동안 한 번도 제대로 떠올려 본 적이 없다. 오늘은 달라지고 싶다.'],
   text:S => `${UNIVERSITY} ${majorOf(S).name} 신입생 환영회. 선배들이 술잔을 돌리고, 동기들이 서로 눈치를 본다.`,
   choices:[
     {label:'먼저 말을 걸며 분위기를 띄운다', sub:'매력·관계 + · 체력 -', run:S => R_(S, {charm:2, bond:3, hp:-6, neg:1}, '“저 먼저 인사할게요!” 한마디에 둘러앉은 동기들이 웃기 시작했다. 그날 번호를 교환한 사람이 열 명이었다.')},
     {label:'구석에서 조용히 사람들을 관찰한다', sub:'통찰 +2', run:S => R_(S, {ins:2, stress:2}, '떠들썩한 소리 사이에서 누가 외로운지, 누가 허세인지가 보였다. 마흔의 눈은 이런 곳에서 쓸모가 있다.')},
     {label:'일찍 나와 자취방에서 쉰다', sub:'체력 + · 관계 -', run:S => R_(S, {hp:5, stress:-3, bond:-1}, '불 꺼진 방에서 이불을 덮고 생각했다. 내일부터는 정말 다르게 살아야지.')},
   ]},
  {id:'c_mt', w:4, cd:12, cond:S => campus(S) && S.m >= 6 && [4, 5, 9, 10].includes(monthOf(S)), place:'campus', title:'학과 MT',
   text:S => '1박 2일 학과 MT. 펜션 마당에서 숯불이 피어오르고, 게임이 시작되려 한다. 마흔의 나는 이런 자리를 늘 피했다.',
   choices:[
     {label:'게임 진행을 맡아 분위기를 이끈다', sub:'매력 + · 체력 -', run:S => R_(S, {charm:2.5, bond:3, hp:-7}, '“자, 지금부터 시작합니다!” 목이 쉬도록 웃고 떠들었다. 마흔의 나에게는 없던 종류의 밤이었다.')},
     {label:'요리와 뒷정리를 도맡는다', sub:'실무 + · 관계 +', run:S => R_(S, {skill:1.5, bond:2, hp:-4}, '불판 앞에 서서 고기를 구웠다. 누군가 “오늘 MVP는 쟤야”라고 말했다.')},
     {label:'일찍 자러 들어간다', sub:'체력 +', run:S => R_(S, {hp:6, bond:-2}, '아침에 일어나 보니 새벽까지 이어진 이야기들을 하나도 못 들었다.')},
   ]},
  {id:'c_midterm', w:5, cd:6, cond:S => campus(S) && S.m >= 3 && [4, 10].includes(monthOf(S)), place:'room', title:'중간고사',
   text:S => '중간고사 주간. 도서관 자리는 일찌감치 만석이고, 학과 단톡방에는 족보 이야기가 오가고 있다.',
   choices:[
     {label:'차분히 계획을 세워 공부한다', sub:'학식 + · 스트레스 +', run:S => R_(S, {know:3.5, work:1.5, stress:6, hp:-4}, '마흔의 요령은 “전부 하지 말고 핵심만 반복하기”였다. 시험지를 받아 들었을 때 낯익은 문제들이 보였다.')},
     {label:'벼락치기로 밤을 샌다', sub:'학식 + · 체력 --', run:S => R_(S, {know:2, hp:-14, stress:8}, '커피 네 잔과 함께 새벽을 건넜다. 시험 중에 졸음이 밀려와 반은 찍었다.')},
     {label:'스터디 그룹과 함께한다', sub:'학식 · 관계 +', run:S => R_(S, {know:2.5, bond:2, stress:3}, '서로 모르는 부분을 설명해 주며 공부했다. 가르치는 만큼 내 머릿속도 정리되었다.')},
   ]},
  {id:'c_scholar', once:true, w:6, cond:S => S.m >= 12 && S.m < 48, place:'campus', title:'장학금 신청',
   text:S => '학과 사무실 게시판에 성적 우수 장학금 공고가 붙었다. 지금까지의 학점과 활동을 서류로 내야 한다.',
   choices:[
     {label:'서류를 정성껏 준비해 신청한다', sub:'학식이 높을수록 합격', run(S){ const ok = S.st.know + rand(-10, 18) >= 40; return ok ? R_(S, {cash:120, know:1.5, self:2}, '장학금 선정 문자가 왔다. 통장에 찍힌 숫자를 몇 번이나 다시 봤다.') : R_(S, {stress:4, know:0.5}, '아쉽게 탈락했다. 하지만 서류를 쓰며 정리한 지난 시간은 내게 남았다.'); }},
     {label:'지금은 신청하지 않는다', sub:'변화 없음', run:S => R_(S, {}, '굳이 나설 필요는 없다고 생각했다. 나중에 조금 후회할지도 모른다.')},
   ]},
  {id:'c_prof', w:3, cd:18, cond:S => campus(S) && S.m >= 12, speaker:'교수님', place:'campus', title:'교수님과의 면담', text:S => MAJOR_PROF[S.major] || MAJOR_PROF.biz,
   choices:[
     {label:'진로에 대해 조언을 구한다', sub:'통찰 +2 · 학식 +1', run:S => R_(S, {ins:2, know:1, work:1}, '한 시간 넘게 이어진 면담에서 낯선 길 하나가 보이기 시작했다. 교수님이 마지막에 덧붙였다. “고민하는 만큼 길이 생겨요.”')},
     {label:'연구실 조교 제안을 받아들인다', sub:'학식 · 자금 +', run:S => R_(S, {know:2.5, cash:40, stress:5, hp:-4}, '연구실 책상 한 자리가 내 몫이 되었다. 월급은 적었지만 서류와 책 사이에서 시간이 빨리 갔다.')},
     {label:'정중하게 고사한다', sub:'나 +1', run:S => R_(S, {self:1}, '“아직은 제 시간으로 해 보고 싶어요.” 교수님은 웃으며 고개를 끄덕였다.')},
   ]},
  {id:'c_summer', w:5, cd:12, cond:S => campus(S) && S.m >= 4 && [7, 8].includes(monthOf(S)), place:'cafe', title:'방학이 시작됐다',
   text:S => '긴 여름 방학. 소연이 배낭여행을 가자고 하고, 알바 자리도 몇 군데 들어와 있다. 마흔의 나는 이 방학을 대부분 집에서 보냈다.',
   choices:[
     {label:'소연과 배낭여행을 떠난다', sub:'자금 -70 · 관계 +4 · 나 +3', run:S => R_(S, {cash:-70, bond:4, self:3, sense:1.5, stress:-12}, '기차 창밖으로 지나가는 풍경이 마음을 씻어 주었다. 소연과 밤새 이야기하며 처음으로 미래를 같이 그려 보았다.')},
     {label:'방학 내내 알바를 한다', sub:'자금 + · 체력 -', run:S => R_(S, {cash:90, skill:1.5, hp:-10, stress:4}, '땀 흘린 만큼 돈이 쌓였다. 개학할 때쯤엔 통장이 조금 든든해졌다.')},
     {label:'집에서 푹 쉬며 책을 읽는다', sub:'나 + · 스트레스 --', run:S => R_(S, {self:2.5, ins:1.5, stress:-14}, '오랜만에 아무 계획 없는 여름. 읽다 만 책들이 하나둘 제자리를 찾았다.')},
   ]},
  {id:'c_festival', w:5, cd:12, cond:S => campus(S) && S.m >= 3 && [5, 9].includes(monthOf(S)), place:'campus', title:'대학 축제',
   text:S => '캠퍼스 곳곳이 천막과 조명으로 가득하다. 동아리 부스에서는 파전 냄새가 나고, 무대 위에서는 밴드가 연주를 하고 있다.',
   choices:[
     {label:'동아리 부스를 맡아 손님을 끈다', sub:'협상·매력 + · 자금 +', run:S => R_(S, {neg:1.5, charm:2, cash:30, hp:-6, bond:2}, '목이 쉬도록 호객을 했다. 밤에는 부스 매출이 의외로 높아서 모두가 환호했다.')},
     {label:'친구들과 공연을 보러 다닌다', sub:'스트레스 -- · 관계 +', run:S => R_(S, {stress:-10, bond:3, sense:1.5, cash:-10}, '손에 든 솜사탕이 녹아 가는 줄도 모르고 노래를 따라 불렀다. 이런 날이 이렇게 사랑스러웠다니.')},
     {label:'조용한 구석에서 혼자 시간을 보낸다', sub:'나 +2', run:S => R_(S, {self:2, stress:-5}, '왁자지껄한 소리가 멀어진 벤치에 앉아 노을을 봤다. 혼자도 괜찮은 사람이 되어 있었다.')},
   ]},
  {id:'c_exchange', once:true, w:6, cond:S => S.m >= 24 && S.m < 40, place:'campus', title:'교환학생 제안',
   text:S => '학교 국제처에서 교환학생 모집 공고가 났다. 한 학기 동안 해외 대학에서 공부할 기회다. 마흔의 나는 이 공고를 보고도 지원하지 않았다.',
   choices:[
     {label:'지원해서 다녀온다', sub:'자금 -150 · 도전 + · 관계 -', run:S => R_(S, {cash:-150, dare:3, sense:2, ins:2, bond:-3, self:3, stress:-6}, '낯선 도시, 낯선 언어, 낯선 얼굴. 처음 한 달은 외로웠지만 돌아올 땐 다른 사람이 되어 있었다.')},
     {label:'지금 생활을 지키기로 한다', sub:'안정 · 관계 +', run:S => R_(S, {bond:2, stress:-2}, '친구들과 남는 학기를 선택했다. 가끔 사진으로 보는 먼 도시가 궁금했다.')},
   ]},
  {id:'c_allnight', w:4, cd:8, cond:S => campus(S) && S.m >= 3 && [6, 12].includes(monthOf(S)), place:'room', title:'기말고사 밤샘',
   text:S => '기말고사 전날 밤. 도서관 불은 아직 꺼지지 않았고, 편의점 컵라면은 벌써 동이 났다.',
   choices:[
     {label:'끝까지 앉아 마지막 한 문제까지 푼다', sub:'학식 ++ · 체력 --', run:S => R_(S, {know:4, hp:-14, stress:8}, '새벽 네 시, 눈이 감기는 와중에 마지막 개념이 이해되었다. 시험은 생각보다 쉬웠다.')},
     {label:'적당히 하고 잠을 챙긴다', sub:'체력 + · 학식 +', run:S => R_(S, {know:1.5, hp:6, stress:-2}, '잘 자는 것도 실력이라고 마흔의 몸이 알려 주었다. 시험장에 가서도 머리가 맑았다.')},
   ]},
  {id:'c_umbrella', w:3, cd:14, cond:S => campus(S) && S.m >= 6 && [6, 7].includes(monthOf(S)) && Object.keys(S.love).some(i => S.love[i].stage === -1 && LOVERS[i]), place:'campus', title:'소나기',
   text:S => { const id = Object.keys(S.love).filter(i => S.love[i].stage === -1 && LOVERS[i]).sort((a, b) => S.love[b].aff - S.love[a].aff)[0]; return `갑작스러운 소나기. 정문 앞에서 우산 없이 서 있는데, ${LOVERS[id].name}가 우산을 들고 걸어오고 있다. 마치 영화의 한 장면 같다.`; },
   choices:[
     {label:'우산을 같이 쓰자고 한다', sub:'호감 +6', run(S){ const id = Object.keys(S.love).filter(i => S.love[i].stage === -1 && LOVERS[i]).sort((a, b) => S.love[b].aff - S.love[a].aff)[0]; const ch = []; addAff(S, id, 6, ch); fx(S, {stress:-4}, ch); return {text:'한 우산 아래 어깨가 닿을 듯 말 듯. 빗소리가 그의 숨소리를 덮었다. 집에 도착해서도 한참 젖은 소매를 쥐고 있었다.', chips:ch}; }},
     {label:'괜찮다며 비를 맞고 뛰어간다', sub:'체력 -3 · 호감 +2', run(S){ const id = Object.keys(S.love).filter(i => S.love[i].stage === -1 && LOVERS[i]).sort((a, b) => S.love[b].aff - S.love[a].aff)[0]; const ch = []; addAff(S, id, 2, ch); fx(S, {hp:-3, stress:2}, ch); return {text:'“잠깐만요!” 뒤에서 부르는 소리를 모른 척하고 달렸다. 심장이 뛰는 건 빗길 때문만은 아니었다.', chips:ch}; }},
   ]},
  {id:'c_army', once:true, w:5, cond:S => S.m >= 6 && S.m < 24, place:'campus', title:'입대하는 친구', text:S => '동기 동혁이 다음 주에 입대한다고 했다. 같은 과 친구들이 작은 송별회를 준비하고 있다. 마흔의 나는 군대 가는 친구와는 연락이 자연히 끊겼다.',
   choices:[
     {label:'송별회에 참석해 편지를 쓴다', sub:'관계 +4 · 나 +1', run:S => R_(S, {bond:4, self:1, cash:-10}, '동혁은 편지를 받고 말없이 코를 훔쳤다. 이십 년 뒤에도 가끔 연락하자던 약속을, 이번엔 지키기로 했다.')},
     {label:'바쁘다며 인사만 남긴다', sub:'관계 -1', run:S => R_(S, {bond:-1}, '“몸 건강히 다녀와.” 한 줄 문자를 보내고 나서도 마음이 개운치 않았다.')},
   ]},
  {id:'c_rent', w:3, cd:18, cond:S => campus(S) && S.m >= 8, place:'room', title:'월세 인상', text:S => '집주인이 갑자기 월세를 올리겠다고 통보했다. 계약 갱신이 코앞인데, 근처에는 더 싼 방이 없다.',
   choices:[
     {label:'협상해서 인상 폭을 줄인다', sub:'협상 + · 자금 -10', run:S => R_(S, {neg:2.5, cash:-10, stress:3}, '“이 정도면 저도 나가야 하는데요.” 마흔의 협상 감각으로 절반으로 줄였다. 집주인이 어이없다는 듯 웃었다.')},
     {label:'그냥 올려 주고 알바를 늘린다', sub:'자금 -25 · 체력 -', run:S => R_(S, {cash:-25, hp:-4, stress:5}, '실랑이할 힘도 없어 월세를 올려 줬다. 대신 주말 알바를 하나 더 잡았다.')},
   ]},
  {id:'c_toeic', w:3, cd:24, cond:S => S.m >= 18 && S.m < 46, place:'room', title:'어학 시험', text:S => '졸업을 앞두고 어학 점수가 필요해졌다. 학원 전단지가 가방마다 꽂혀 있다. 마흔의 나는 이 점수를 한 번도 제대로 써 본 적이 없다.',
   choices:[
     {label:'학원에 등록해 집중적으로 한다', sub:'자금 -40 · 학식 +', run:S => R_(S, {cash:-40, know:3, skill:1, stress:5, hp:-4}, '두 달 만에 점수가 눈에 띄게 올랐다. 이력서 한 줄이 든든하다.')},
     {label:'독학으로 천천히 한다', sub:'학식 + · 스트레스 +', run:S => R_(S, {know:2, stress:3}, '지하철 안에서 단어를 외우며 한 달을 보냈다. 점수는 평범했지만 습관이 남았다.')},
   ]},
  {id:'c_thesis', once:true, w:8, cond:S => S.m >= 40 && S.m <= 46, place:'campus', title:'졸업 작품', text:S => `졸업을 앞두고 마지막 과제가 다가왔다. ${MAJOR_THESIS[S.major] || '졸업 과제를 낸다.'} 마흔의 나는 이런 결과물을 하나도 남기지 못했다.`,
   choices:[
     {label:'온 힘을 쏟아 완성도를 높인다', sub:'일·학식 + · 체력 --', run:S => R_(S, {work:3, know:2.5, skill:2, hp:-12, stress:8}, '마지막 밤까지 손을 놓지 못했다. 발표가 끝나고 박수가 터졌을 때 눈물이 날 뻔했다.')},
     {label:'적당한 선에서 마무리한다', sub:'체력 + · 일 +', run:S => R_(S, {work:1, hp:3, stress:-2}, '완벽하진 않아도 무리하지 않았다. 졸업 사진 속 표정이 편안했다.')},
     {label:'친구들과 함께 서로 도와 완성한다', sub:'관계 +3 · 일 +1.5', run:S => R_(S, {bond:3, work:1.5, ins:1}, '밤샘 작업실에서 서로의 작품을 봐 주며 라면을 나눠 먹었다. 완성품보다 그 밤이 기억에 남았다.')},
   ]},
);

// ═════════ 계절·명절·시대 ═════════
const bestCrush = S => Object.keys(S.love).filter(i => S.love[i].stage === -1 && LOVERS[i]).sort((a, b) => S.love[b].aff - S.love[a].aff)[0] || null;
EVENTS.push(
  {id:'s_seollal', w:7, cd:12, cond:S => [1, 2].includes(monthOf(S)) && S.m >= 8, speaker:'엄마', img:'art/mom.webp', place:'room', title:'설날',
   text:S => '설날 연휴. 엄마가 아침부터 전을 부치고, 친척들이 한자리에 모였다. “올해는 취업하니? 결혼은 언제 하니?” 정해진 질문들이 줄을 서 있다.',
   choices:[
     {label:'웃으며 받아넘기고 엄마 곁에서 거든다', sub:'관계 +3 · 스트레스 +3', run(S){ S.mom = clamp((S.mom || 40) + 5, 0, 100); return R_(S, {bond:3, stress:3, self:1}, '전을 뒤집는 엄마 옆에서 이런저런 이야기를 나눴다. 질문은 따가웠지만 부엌은 따뜻했다.'); }},
     {label:'세뱃돈을 넉넉히 챙겨 조카들에게 나눠 준다', sub:'자금 -15 · 관계 +2', run:S => R_(S, {cash:-15, bond:2, stress:-3}, '아이들이 환호성을 질렀다. 이런 작은 행복이 명절의 값이 된다.')},
     {label:'질문이 많아 일찍 방으로 피한다', sub:'스트레스 -2 · 관계 -2', run:S => R_(S, {stress:-2, bond:-2}, '문을 닫고 누웠지만 거실의 웃음소리가 들렸다. 어느 쪽에도 속하지 못한 기분이었다.')},
   ]},
  {id:'s_chuseok', w:6, cd:12, cond:S => monthOf(S) === 9 && S.m >= 6, place:'room', title:'추석 보름달',
   text:S => '추석 연휴, 고향 집 마당에서 둥근 보름달이 떴다. 송편을 빚다 보면 마흔의 기억이 자꾸 겹친다. 이 달을 누구와 같이 볼 수 있을까.',
   choices:[
     {label:'가족과 둘러앉아 송편을 빚는다', sub:'관계 +3 · 나 +1', run:S => R_(S, {bond:3, self:1, stress:-5}, '삐뚤빼뚤한 송편을 보며 엄마가 크게 웃었다. 오래 간직할 장면이었다.')},
     {label:'친구들을 불러 달맞이를 한다', sub:'관계 +3 · 스트레스 -5', run:S => R_(S, {bond:3, stress:-5, cash:-8}, '옥상에서 맥주 한 캔씩 들고 달을 올려다봤다. 아무 말 없이 있어도 좋은 사람들이 곁에 있었다.')},
   ]},
  {id:'s_valentine', w:6, cd:12, cond:S => monthOf(S) === 2 && S.m >= 8, place:'cafe', title:'밸런타인데이',
   text:S => '2월 14일. 편의점마다 초콜릿이 가득하다. 마흔의 나는 이 날을 챙기는 사람이 아니었다. 올해는 누구에게 마음을 전하고 싶다.',
   choices:[
     {label:'직접 만든 초콜릿을 건넨다', sub:'호감 + · 자금 -8', run(S){ if(hasP(S)) return LV(S, 7, {cash:-8, bond:1.5}, `서툴게 만든 초콜릿을 건네자 ${PN(S)}가 한참 바라보다 한 입 먹었다. “…진짜 맛있어요.” 거짓말인 걸 알아서 더 웃겼다.`); const id = bestCrush(S); if(id){ const ch = []; addAff(S, id, 5, ch); fx(S, {cash:-8}, ch); return {text:`${LOVERS[id].name}에게 초콜릿을 내밀었다. “이건… 그냥 의리예요!” 변명하는 내 얼굴이 빨개졌을 것이다.`, chips:ch}; } return R_(S, {cash:-8, bond:2}, '친구들과 초콜릿을 나눠 먹으며 놀았다. 사랑이 아니어도 달콤한 날이었다.'); }},
     {label:'친구들과 초콜릿 파티를 한다', sub:'관계 +3 · 스트레스 -4', run:S => R_(S, {bond:3, stress:-4, cash:-6}, '서로 만든 초콜릿을 평가하며 깔깔댔다. 가장 못생긴 게 가장 인기였다.')},
     {label:'오늘은 신경 쓰지 않는다', sub:'변화 없음', run:S => R_(S, {}, '조용히 하루가 지나갔다. 편의점 앞을 지날 때만 조금 쓸쓸했다.')},
   ]},
  {id:'s_whiteday', w:6, cd:12, cond:S => monthOf(S) === 3 && S.m >= 12 && hasP(S), place:'night', title:'화이트데이',
   text:S => `화이트데이 저녁, ${PN(S)}가 작은 사탕 바구니를 들고 나타났다. ${PV(S).tease}`,
   choices:[
     {label:'바구니보다 그의 얼굴이 더 달콤하다고 말한다', sub:'호감 +6', run:S => LV(S, 6, {charm:0.5}, '그가 얼굴을 붉히며 시선을 피했다. 평소의 여유가 사라진 모습이 귀여웠다.')},
     {label:'함께 사탕을 하나씩 까먹으며 걷는다', sub:'호감 +5 · 스트레스 -5', run:S => LV(S, 5, {stress:-5}, '봄밤의 공기 속에서 말없이 사탕만 까먹었다. 단맛이 입안에서 오래 녹았다.')},
   ]},
  {id:'s_blossom', w:6, cd:12, cond:S => monthOf(S) === 4 && S.m >= 12, place:'campus', title:'벚꽃 놀이',
   text:S => '벚꽃이 한꺼번에 피었다. 마흔의 나는 이 계절에 꽃구경 한 번 못 갔다는 사실이 갑자기 생각났다.',
   choices:[
     {label:'소중한 사람과 꽃길을 걷는다', sub:'관계 +3 · 스트레스 -8', run(S){ if(hasP(S)) return LV(S, 7, {stress:-8, bond:1.5}, `${PN(S)}와 분홍빛 길을 걸었다. 머리 위로 꽃잎이 흩날릴 때 그가 내 머리를 가볍게 털어 주었다.`); return R_(S, {bond:3, stress:-8}, '소연과 돗자리를 펴고 앉아 꽃잎이 떨어지는 걸 하염없이 봤다. 이런 날이 인생에 몇 번이나 될까.'); }},
     {label:'혼자 천천히 걸으며 사진을 찍는다', sub:'감각 +2 · 나 +2', run:S => R_(S, {sense:2, self:2, stress:-6}, '필름 한 롤을 꽃으로 채웠다. 현상된 사진 속 계절은 오래 남을 것 같았다.')},
   ]},
  {id:'s_rain', w:5, cd:12, cond:S => monthOf(S) === 7 && S.m >= 6, place:'room', title:'긴 장마', text:S => '며칠째 장대비가 이어진다. 창문 너머로 빗소리만 들리고 방 안엔 눅눅한 공기가 가득하다.',
   choices:[
     {label:'비 오는 날의 음악을 틀어 놓고 쉰다', sub:'스트레스 -- · 나 +1', run:S => R_(S, {stress:-10, self:1, hp:3}, '창가에 앉아 따뜻한 차를 마셨다. 비는 사람을 가라앉히기도 하고 고요하게도 한다.')},
     {label:'우산을 쓰고 일부러 걸어 나간다', sub:'감각 + · 체력 -', run:S => R_(S, {sense:1.5, self:1.5, hp:-3}, '빗속을 걷다 보니 젖은 거리의 불빛이 번져 아름다웠다. 감기 걸릴 각오가 아깝지 않았다.')},
   ]},
  {id:'s_snow', w:5, cd:12, cond:S => [12, 1].includes(monthOf(S)) && S.m >= 8, place:'night', title:'첫눈', text:S => '창밖으로 첫눈이 내리기 시작했다. 거리의 사람들이 하나둘 고개를 들고 하늘을 본다.',
   choices:[
     {label:'소중한 사람에게 전화를 건다', sub:'관계/호감 +', run(S){ if(hasP(S)) return LV(S, 5, {stress:-5, bond:1.5}, `“첫눈 와요.” ${PV(S).warm} 전화기 너머 그의 창밖에도 눈이 내리고 있었다.`); return R_(S, {bond:3, stress:-4}, '소연에게 전화를 걸자 소연이 소리를 질렀다. “나도 지금 창밖 보고 있었어!”'); }},
     {label:'혼자 나가 눈을 맞으며 걷는다', sub:'나 +2 · 스트레스 -6', run:S => R_(S, {self:2, stress:-6, sense:1}, '눈송이가 속눈썹에 앉았다. 혼자여도 괜찮은 사람이 되었다는 걸 알았다.')},
   ]},
  {id:'s_yearend', w:5, cd:12, cond:S => monthOf(S) === 12 && S.m >= 8, place:'cafe', title:'송년회', text:S => '한 해의 끝, 송년회 약속이 연달아 잡혔다. 사람들이 올해의 이야기를 서로 꺼내 놓는다.',
   choices:[
     {label:'올해 가장 좋았던 순간을 이야기한다', sub:'관계 +3 · 나 +1.5', run:S => R_(S, {bond:3, self:1.5, stress:-5}, '이야기를 꺼내다 보니 올해가 생각보다 괜찮았다는 걸 알았다. 마흔의 연말과는 전혀 다른 기분이었다.')},
     {label:'내년의 목표를 적어 보는 시간을 갖는다', sub:'일 +2 · 통찰 +1', run:S => R_(S, {work:2, ins:1, stress:1}, '수첩 첫 장에 내년의 목표를 적었다. 몇 개는 실현될 것이고 몇 개는 바뀔 것이다.')},
   ]},
  {id:'era_pokemon', once:true, w:100, cond:S => S.m >= 3 && S.m <= 6, place:'campus', title:'2016년 여름, 포켓몬을 잡으러', text:S => '캠퍼스 곳곳에서 휴대폰을 든 사람들이 서성인다. 전국의 공원이 한꺼번에 북적이고, 모르는 사람끼리 “거기 뭐 나왔어요?” 하고 말을 건다. 마흔의 나는 이런 들뜬 여름을 거의 기억하지 못한다.',
   choices:[
     {label:'친구들과 밤새 돌아다닌다', sub:'관계 +4 · 체력 -5', run:S => R_(S, {bond:4, stress:-8, hp:-5, charm:1}, '새벽 두 시, 공원 한복판에서 모르는 사람과 하이파이브를 했다. 이기든 지든 상관없이 모두가 웃었다.')},
     {label:'방에서 조용히 공부한다', sub:'학식 +1', run:S => R_(S, {know:1, stress:-1}, '창밖에서 환호가 터지는 걸 들으며 공부를 이어 갔다. 이번 여름의 기억에는 환호가 소리로만 남았다.')},
   ]},
  {id:'era_pyeongchang', once:true, w:100, cond:S => S.m >= 22 && S.m <= 24, place:'night', title:'2018년 2월, 겨울 올림픽', text:S => '전국이 같은 경기를 보고 있다. 캠퍼스 식당 TV 앞에도, 과방 노트북 앞에도 사람들이 모여 있다. 응원 구호가 복도에서 들린다.',
   choices:[
     {label:'친구들과 응원전에 참가한다', sub:'관계 +3 · 스트레스 -8', run:S => R_(S, {bond:3, stress:-8, charm:1.5}, '쑥스러움도 잠깐, 어느새 두 손을 흔들고 있었다. 마흔의 나는 이런 순간을 일부러 외면해 왔다.')},
     {label:'멀찍이서 웃으며 구경한다', sub:'스트레스 -3', run:S => R_(S, {stress:-3, bond:1}, '박수를 치며 구경했다. 구경하는 것도 즐거운 일이다.')},
   ]},
  {id:'era_worldcup', once:true, w:80, cond:S => S.m >= 80 && S.m <= 82, place:'night', title:'2022년 겨울, 새벽 월드컵', text:S => '새벽 경기가 중계되고 있다. 회사 동료들, 친구들, 온 나라가 같은 화면을 보고 있다.',
   choices:[
     {label:'새벽까지 친구들과 응원한다', sub:'관계 +3 · 체력 -6', run:S => R_(S, {bond:3, stress:-8, hp:-6}, '결승골이 터지던 순간, 거실이 환호로 터져 나갔다. 이런 순간이 일상을 버티게 한다.')},
     {label:'결과만 확인하고 일찍 잔다', sub:'체력 +', run:S => R_(S, {hp:5, stress:-2}, '아침에 일어나 뉴스를 보며 어젯밤의 열기를 확인했다. 잠이 최고의 응원이었다.')},
   ]},
  {id:'era_paris', once:true, w:80, cond:S => S.m >= 100 && S.m <= 102, place:'night', title:'2024년 여름, 새벽 올림픽 응원', text:S => '한여름 밤, 올림픽 중계를 보며 치킨을 시켜 먹는 사람들. 마흔의 나는 이런 한여름을 혼자 사무실에서 보냈던 것 같다.',
   choices:[
     {label:'소중한 사람과 함께 응원한다', sub:'관계/호감 +', run(S){ if(hasP(S)) return LV(S, 6, {stress:-6}, `${PN(S)}와 나란히 앉아 경기를 봤다. 마지막 순간에 그가 몰래 내 손을 잡았다.`); return R_(S, {bond:3, stress:-6}, '소연과 치킨을 시켜 먹으며 응원했다. 결정적인 장면에서 둘이 동시에 소리를 질렀다.'); }},
     {label:'혼자 조용히 본다', sub:'나 +2 · 스트레스 -5', run:S => R_(S, {self:2, stress:-5}, '불 끄고 혼자 경기를 봤다. 오래 눌러 둔 감정이 한 줄 흘러나왔다.')},
   ]},
);

// ═════════ 가족과 친구 ═════════
EVENTS.push(
  {id:'f_mom_birthday', w:30, cd:12, cond:S => monthOf(S) === 6 && S.m >= 3, speaker:'엄마', img:'art/mom.webp', place:'room', title:'엄마의 생신',
   text:S => `6월은 엄마의 생신이 있는 달이다. 올해 엄마는 몇 번째 생일을 맞이하는 걸까. 마흔의 나는 생일 케이크를 한 번도 먼저 준비한 적이 없다.`,
   choices:[
     {label:'직접 내려가 미역국을 끓인다', sub:'관계 ++ · 자금 -10', run(S){ S.mom = clamp((S.mom || 40) + 10, 0, 100); return R_(S, {bond:5, cash:-10, self:2, stress:-6}, '서툰 솜씨의 미역국을 엄마가 두 그릇 비웠다. “우리 딸이 이런 날도 다 있네.” 엄마의 눈가가 젖었다.'); }},
     {label:'선물과 편지를 택배로 보낸다', sub:'관계 +2 · 자금 -25', run(S){ S.mom = clamp((S.mom || 40) + 4, 0, 100); return R_(S, {bond:2, cash:-25}, '엄마는 전화로 “뭘 이렇게까지”라고 하면서도 편지를 세 번 읽었다고 했다.'); }},
     {label:'바빠서 전화로만 축하한다', sub:'관계 -1', run:S => R_(S, {bond:-1}, '“생신 축하해요.” 짧은 통화였다. 수화기 너머 엄마의 대답이 한 박자 늦게 왔다.')},
   ]},
  {id:'f_mom_match', once:true, w:5, cond:S => S.m >= 60 && !S.partner, speaker:'엄마', img:'art/mom.webp', place:'room', title:'엄마의 소개팅 제안',
   text:S => '“옆집 아주머니 아들이 있는데, 사람이 참 착하대.” 엄마가 조심스럽게 소개팅을 제안했다. 마흔의 나는 이 얘기를 짜증으로 받아쳤었다.',
   choices:[
     {label:'한 번 만나 본다', sub:'관계 +2 · 스트레스 +4', run(S){ S.mom = clamp((S.mom || 40) + 3, 0, 100); return R_(S, {bond:2, stress:4, charm:0.5}, '어색한 카페, 예의 바른 이야기. 설레지는 않았지만 엄마의 기대에 보답한 기분이었다.'); }},
     {label:'지금은 일이 중요하다고 정중히 거절한다', sub:'일 +1 · 관계 -1', run:S => R_(S, {work:1, bond:-1}, '“엄마, 제 때가 오면 직접 소개할게요.” 엄마는 한숨을 쉬면서도 웃었다.')},
   ]},
  {id:'f_soyeon_job', once:true, w:6, cond:S => S.m >= 40 && S.m <= 62, speaker:'소연', img:'art/soyeon.webp', place:'cafe', title:'소연의 취업 고민',
   text:S => '소연이 면접 세 군데에서 연달아 떨어졌다며 풀이 죽어 왔다. “내가 부족한 걸까?” 마흔의 나는 그때 어떤 말을 해 주지 못했다.',
   choices:[
     {label:'면접 연습을 같이 해 준다', sub:'관계 +4 · 협상 +1', run:S => R_(S, {bond:4, neg:1, stress:3}, '밤새 예상 질문을 같이 만들어 봤다. 다음 면접에서 소연이 합격했다는 문자를 받았을 때 나도 소리를 질렀다.')},
     {label:'맛있는 걸 사 주며 위로한다', sub:'자금 -15 · 관계 +3', run:S => R_(S, {cash:-15, bond:3, stress:-3}, '삼겹살에 소주 한 잔. 소연이 울다가 웃다가 결국 고기를 세 판이나 먹었다.')},
   ]},
  {id:'f_soyeon_fight', once:true, w:5, cond:S => S.m >= 30 && S.m <= 90, speaker:'소연', img:'art/soyeon.webp', place:'cafe', title:'소연과의 오해',
   text:S => '약속 시간에 내가 늦었다는 사소한 일로 소연과 말다툼이 났다. 소연이 “넌 요즘 너무 바쁜 척해”라고 말했다. 정곡을 찔린 기분이었다.',
   choices:[
     {label:'먼저 진심으로 사과한다', sub:'관계 +3 · 스트레스 -3', run:S => R_(S, {bond:3, stress:-3, ins:1}, '“미안해, 네 말이 맞았어. 요즘 너한테 소홀했어.” 소연이 입술을 깨물다가 먼저 안아 줬다.')},
     {label:'바빴던 이유를 설명하며 맞선다', sub:'관계 -3 · 스트레스 +4', run:S => R_(S, {bond:-3, stress:4}, '논리로 이겼지만 아무도 이기지 못한 대화였다. 소연은 한동안 연락이 없었다.')},
     {label:'시간을 두고 편지를 쓴다', sub:'관계 +2 · 나 +1', run:S => R_(S, {bond:2, self:1}, '말로는 어려운 마음을 편지에 썼다. 다음 날 소연에게서 “…고마워”라는 문자가 왔다.')},
   ]},
  {id:'f_soyeon_love', once:true, w:5, cond:S => S.m >= 60 && S.m <= 90, speaker:'소연', img:'art/soyeon.webp', place:'cafe', title:'소연의 연애',
   text:S => '소연이 얼굴을 붉히며 새 남자친구 이야기를 꺼냈다. “사람이 좀… 괜찮은 것 같아.” 마흔의 나는 소연이 나중에 그 사람과 결혼한다는 걸 안다.',
   choices:[
     {label:'미소로 응원하며 이야기를 들어 준다', sub:'관계 +3', run:S => R_(S, {bond:3, stress:-2}, '소연의 이야기를 들으며 따뜻함이 번졌다. 누군가의 시작을 지켜보는 건 이렇게 좋은 일이다.')},
     {label:'아는 미래를 은근히 귀띔한다', sub:'선명도 -4 · 관계 +2', run:S => { S.borrowed++; return R_(S, {clarity:-4, bond:2}, '“그 사람, 분명 좋은 사람일 거야.” 말해 놓고 입을 다물었다. 소연은 의아한 듯 웃었다.'); }},
   ]},
  {id:'f_soyeon_wedding', once:true, w:60, cond:S => S.m >= 98, speaker:'소연', img:'art/soyeon.webp', place:'night', title:'소연의 결혼',
   beats:['소연이 결혼한다. 청첩장을 건네는 소연의 손이 조금 떨렸다.', '“네가 제일 먼저 와 줬으면 좋겠어. 부케도 받아 줘.” 마흔의 나는 이 결혼식에서 혼자 앉아 있었다는 기억이 있다.'],
   text:S => '소연의 결혼식 날. 신부 대기실 문 앞에서 숨을 한 번 들이쉬었다.',
   choices:[
     {label:'울면서 소연을 꼭 안아 준다', sub:'관계 +5 · 나 +2', run:S => R_(S, {bond:5, self:2, stress:-8}, '“행복해야 해.” 목이 메어 한마디밖에 못 했다. 소연이 화장이 번지는 줄도 모르고 울었다.')},
     {label:'축사를 맡아 소연과의 이야기를 전한다', sub:'관계 +5 · 매력 +1 · 협상 +1', run:S => R_(S, {bond:5, charm:1, neg:1, stress:2}, '고1 때 도시락 이야기를 꺼냈을 때 하객들이 웃고 소연이 울었다. 마흔의 나는 한 번도 하지 못한 말들을 오늘 다 했다.')},
     {label:'축의금만 전하고 일찍 자리를 뜬다', sub:'관계 -3', run:S => R_(S, {bond:-3, stress:2}, '식장을 나서는데 소연에게서 문자가 왔다. “일찍 갔네. 보고 싶었는데.” 후회가 뒤늦게 올라왔다.')},
   ]},
  {id:'f_mom_letter', once:true, w:70, cond:S => S.m >= 100, speaker:'엄마', img:'art/mom.webp', place:'room', title:'엄마의 편지',
   beats:['택배 상자에 반찬 사이로 손편지 한 장이 끼어 있었다.', '“우리 딸에게. 이 편지를 쓰는 동안 네 어릴 적 얼굴이 자꾸 떠올라서 몇 번이나 펜을 놓았단다.”'],
   text:S => '편지는 서투른 글씨로 이렇게 끝났다. “잘 살고 있어서 고맙다. 그것만으로도 엄마는 충분히 행복하다.” 마흔의 나는 엄마의 마지막 편지를 받지 못했다.',
   choices:[
     {label:'답장을 길게 써서 보낸다', sub:'관계 +4 · 나 +2', run(S){ S.mom = clamp((S.mom || 40) + 8, 0, 100); return R_(S, {bond:4, self:2, stress:-8}, '밤새 쓴 답장은 세 장이 되었다. 마지막 줄에 “사랑해요”라고 적었다. 우체통 앞에서 오래 서 있었다.'); }},
     {label:'당장 전화를 걸어 “고마워”라고 말한다', sub:'관계 +4', run(S){ S.mom = clamp((S.mom || 40) + 8, 0, 100); return R_(S, {bond:4, self:1.5, stress:-6}, '엄마가 전화를 받자마자 “무슨 일 있니?”라고 놀랐다. “아무 일도 없어요. 그냥 고마워서요.” 수화기 너머가 한참 조용했다.'); }},
   ]},
);

// ═════════ 되감기 테마: 아는 미래, 흐려지는 기억, 약방 ═════════
const GRANDMA_QUOTES = [
  '“시간은 쓰는 사람에게만 흘러가요. 가진 사람에게는 고여 있죠.”',
  '“두려움은 늘 같은 얼굴로 와요. 처음 보는 척하지 말아요.”',
  '“사람은 후회로 늙고 용기로 젊어져요.”',
  '“누가 대신 살아 줄 수 있는 인생은 없어요. 약으로도.”',
  '“하루를 이기려 하지 말고 하루와 같이 걸어요.”',
  '“마흔의 당신이 스무 살의 당신에게 건넬 말이 있다면 무엇일까요?”',
];
EVENTS.push(
  {id:'t_grandma', w:3, cd:14, cond:S => S.m >= 10, speaker:GRANDMA, img:'art/grandma.webp', place:'shop', title:'꿈속의 약방',
   text:S => `꿈에 다시 약방이 나왔다. 모래시계가 천천히 흐르고, 할머니가 차를 따르며 말했다. ${GRANDMA_QUOTES[(S.m * 7) % GRANDMA_QUOTES.length]}`,
   choices:[
     {label:'그 말을 마음에 새긴다', sub:'나 +2 · 통찰 +1', run:S => R_(S, {self:2, ins:1, stress:-4}, '잠에서 깨어 한참 그 말을 되새겼다. 마음 한쪽이 조금 가벼워졌다.')},
     {label:'“할머니는 누구세요?”라고 다시 묻는다', sub:'통찰 +1.5', run:S => R_(S, {ins:1.5, stress:2}, '“언젠가 알게 돼요.” 할머니는 늘 같은 대답을 하지만 오늘은 눈빛이 조금 더 젖어 있었다.')},
   ]},
  {id:'t_friend_news', once:true, w:6, cond:S => S.m >= 30 && S.clarity >= 20, speaker:'', place:'cafe', title:'알고 있는 불행',
   text:S => '소연의 아버지가 내년에 다니던 회사에서 정리해고를 당한다는 걸 나는 안다. 지금은 아무도 모른다. 이 사실을 말해야 할까, 말아야 할까.',
   choices:[
     {label:'넌지시 저축을 권유하며 대비하게 한다', sub:'선명도 -5 · 관계 +3', run:S => { S.borrowed++; return R_(S, {clarity:-5, bond:3, ins:1}, '“요즘 불황이라는데, 비상금 좀 모아 두면 어때?” 소연이 의아한 얼굴로 끄덕였다. 내년에 큰 도움이 되었다.'); }},
     {label:'아는 척하지 않고 평소처럼 대한다', sub:'스트레스 +3', run:S => R_(S, {stress:3, ins:1}, '모른 척하는 건 쉽지 않았다. 마음 한쪽이 계속 무거웠다.')},
     {label:'소연에게 솔직하게 사정을 털어놓는다', sub:'선명도 -8 · 관계 ±', run:S => { S.borrowed++; return R_(S, {clarity:-8, bond:-1, stress:4}, '“미래를 알고 있어.” 말했지만 소연은 농담인 줄 알았다. 한동안 어색한 웃음만 오갔다.'); }},
   ]},
  {id:'t_album', once:true, w:5, cond:S => S.m >= 36, place:'room', title:'마흔의 앨범',
   text:S => '책장 깊은 곳에서 스무 살 때 찍은 사진이 담긴 앨범을 찾았다. 마흔의 나는 이 앨범을 버렸었다. 사진 속 나는 환하게 웃고 있다.',
   choices:[
     {label:'사진 속 나에게 편지를 써 둔다', sub:'나 +3 · 스트레스 -6', run:S => R_(S, {self:3, stress:-6, ins:1}, '“고마워. 넌 지금도 이렇게 잘 웃고 있어.” 쓰면서 눈물이 났다.')},
     {label:'소중한 사진 몇 장을 액자에 넣는다', sub:'나 +1.5 · 자금 -5', run:S => R_(S, {self:1.5, cash:-5, stress:-3}, '책상 위에 새 액자가 놓였다. 방이 조금 더 내 방다워졌다.')},
   ]},
  {id:'t_book', w:3, cd:24, cond:S => S.m >= 12, place:'room', title:'낯익은 책', text:S => '서점에서 낯익은 표지의 책을 발견했다. 마흔의 내가 힘들 때마다 펼쳐 보던 책이다. 지금의 나는 아직 이 책을 읽은 적이 없다.',
   choices:[
     {label:'사서 처음부터 천천히 읽는다', sub:'통찰 +2 · 나 +1.5', run:S => R_(S, {ins:2, self:1.5, cash:-2, stress:-4}, '밑줄 그을 문장이 아직 하나도 없어서, 처음 보는 길을 걷는 기분이었다. 오래 같은 책을 읽을 수 있다는 게 이런 기분이었구나.')},
     {label:'친구에게 선물한다', sub:'관계 +2', run:S => R_(S, {bond:2, cash:-2}, '“이거 읽어 봐. 힘들 때 도움이 될지도 몰라.” 친구가 이상하다는 듯 웃으며 책을 받았다.')},
   ]},
  {id:'t_clarity', once:true, w:30, cond:S => S.clarity < 30 && S.m >= 24, place:'room', title:'기억이 흐려지다',
   text:S => '엄마의 마흔 살 얼굴이 떠오르지 않는다. 이십 년 뒤의 일들이 안개처럼 번진다. 미래를 안다는 것이 이렇게 사라지는 것일 줄은 몰랐다.',
   choices:[
     {label:'남은 기억을 일기에 기록해 둔다', sub:'나 +3 · 통찰 +1', run:S => R_(S, {self:3, ins:1, stress:3}, '떠오르는 장면들을 하나씩 적었다. 완전히 사라지기 전에, 내 안에 남기고 싶은 것만 골랐다.')},
     {label:'차라리 잊히는 게 낫다고 받아들인다', sub:'스트레스 -5 · 나 +2', run:S => R_(S, {stress:-5, self:2}, '“이제 정말 지금의 인생이구나.” 가벼운 슬픔과 가벼운 자유가 동시에 왔다.')},
   ]},
  {id:'t_news', w:3, cd:24, cond:S => S.clarity >= 40 && S.m >= 18, place:'cafe', title:'어디선가 본 뉴스', text:S => '신문 한 귀퉁이의 기사에 시선이 멈췄다. 이 사고를 나는 알고 있다. 내일 어느 지하철역에서 일어날 일이다. 신고해도 믿어 줄까.',
   choices:[
     {label:'익명으로 신고한다', sub:'선명도 -4 · 나 +2', run:S => { S.borrowed++; return R_(S, {clarity:-4, self:2, stress:4}, '짧은 전화 한 통이 어떤 결과를 만들지는 알 수 없었다. 다음 날 뉴스에는 아무 일도 없었다는 짧은 보도가 나왔다.'); }},
     {label:'아무것도 하지 않는다', sub:'스트레스 +5 · 나 -1', run:S => R_(S, {stress:5, self:-1}, '다음 날 뉴스에서 같은 사고 기사를 읽었다. 모르는 척한 것이 계속 마음에 걸렸다.')},
   ]},
  {id:'t_choice', once:true, w:5, cond:S => S.m >= 48, place:'night', title:'다른 선택을 했다면', text:S => '밤에 문득 이런 생각이 들었다. 마흔의 나와 지금의 내가 선택한 것들이 얼마나 달라졌을까. 이번 생에서 가장 큰 변화는 무엇이었을까.',
   choices:[
     {label:'일을 대하는 태도라고 생각한다', sub:'일 +2', run:S => R_(S, {work:2, ins:1}, '이번엔 숫자보다 사람을 먼저 봤다. 그 차이가 일의 결을 바꿨다.')},
     {label:'사람을 대하는 태도라고 생각한다', sub:'관계 +2', run:S => R_(S, {bond:2, ins:1}, '이번엔 먼저 말을 건넸다. 그 한마디가 많은 걸 바꿨다.')},
     {label:'나를 대하는 태도라고 생각한다', sub:'나 +2', run:S => R_(S, {self:2, ins:1}, '이번엔 나를 먼저 살폈다. 그것만으로도 삶이 가벼워졌다.')},
   ]},
);

// ═════════ 직업별 추가 이벤트 ═════════
EVENTS.push(
  {id:'bty_influencer', w:3, cd:15, cond:onJob('beauty'), speaker:'한지후', place:'cafe', title:'인플루언서 협업', text:S => '유명 인플루언서와의 협업 제안이 들어왔다. 팔로워는 많지만 평판이 갈리는 인물이다. 브랜드 이미지와 노출 사이에서 고민이 된다.',
   choices:[
     {label:'과감하게 협업을 진행한다', sub:'매력·일 + · 스트레스 +', run:S => R_(S, {charm:1.5, work:2.5, cash:40, stress:5}, '캠페인은 폭발적인 반응을 얻었다. 하지만 댓글 창에는 호불호가 함께 쌓였다.')},
     {label:'브랜드 가치에 맞는 다른 인물을 찾는다', sub:'감각·일 +', run:S => R_(S, {sense:2, work:1.5, stress:3}, '조금 돌아가더라도 우리 제품에 어울리는 얼굴을 찾았다. 조용하지만 오래 가는 반응이 왔다.')},
   ]},
  {id:'bty_rival', w:3, cd:18, cond:onJob('beauty'), place:'room', title:'경쟁사의 신제품', text:S => '경쟁사가 우리와 비슷한 콘셉트의 신제품을 먼저 내놓았다. 팀 분위기가 가라앉고 있다. 내가 기획한 제품의 출시일이 코앞이다.',
   choices:[
     {label:'차별화 포인트를 빠르게 재정리한다', sub:'협상·일 + · 스트레스 +', run:S => R_(S, {neg:2, work:2.5, stress:6, hp:-5}, '밤새 자료를 고쳤다. 새로운 슬로건 하나가 팀을 다시 일으켜 세웠다.')},
     {label:'오히려 출시일을 앞당긴다', sub:'도전 + · 위험', run:S => { const ok = R() < 0.55; return R_(S, ok ? {dare:2.5, work:3, stress:5} : {dare:1.5, work:-1, stress:8}, ok ? '선점 효과가 통했다. 매출이 예상보다 높았다.' : '서두른 탓에 실수가 나왔다. 수습하느라 한 달을 보냈다.'); }},
   ]},
  {id:'pd_late', w:3, cd:15, cond:onJob('pd'), speaker:'차도현', place:'night', title:'배우의 지각', text:S => '촬영 당일, 주연 배우가 두 시간째 나타나지 않았다. 스태프들이 대기 중이고 장소 대여 시간이 줄어든다. 매니저는 계속 사과만 한다.',
   choices:[
     {label:'일정을 재배치해 대체 장면부터 찍는다', sub:'협상·일 +', run:S => R_(S, {neg:2, work:2.5, stress:5}, '순서를 바꿔 다른 장면부터 촬영했다. 배우가 도착했을 때는 오히려 분위기가 좋아졌다.')},
     {label:'배우를 불러 조용히 이유를 묻는다', sub:'통찰 + · 관계 +', run:S => R_(S, {ins:2, bond:1.5, work:1, stress:3}, '사정이 있었다. 이야기를 듣고 나니 화가 풀렸다. 이후 촬영장에서 그가 누구보다 열심히 했다.')},
   ]},
  {id:'pd_rating', w:3, cd:15, cond:onJob('pd'), place:'room', title:'시청률 회의', text:S => '방송국 임원이 시청률 하락을 이유로 구성 변경을 압박한다. 내가 지켜 온 연출 방향이 흔들리고 있다.',
   choices:[
     {label:'수치와 시청자 반응을 근거로 설득한다', sub:'협상 ++ · 일 +', run:S => R_(S, {neg:3, work:2, stress:6}, '자료를 펼치고 한 시간 동안 설명했다. 임원이 “한 번 더 믿어 보지”라고 했다.')},
     {label:'일부를 수용해 타협한다', sub:'일 + · 스트레스 -', run:S => R_(S, {work:1.5, stress:-2, ins:1}, '한 발 물러서자 오히려 새로운 아이디어가 나왔다. 타협도 연출이다.')},
   ]},
  {id:'wr_note', w:3, cd:15, cond:onJob('writer'), place:'room', title:'수정 요청', text:S => '메인 연출과 방송국에서 대본 전면 수정을 요구했다. 가장 아끼던 캐릭터의 서사가 통째로 바뀌어야 한다.',
   choices:[
     {label:'수정 방향을 받아들이되 핵심은 지킨다', sub:'통찰·일 +', run:S => R_(S, {ins:2, work:2.5, stress:5}, '이야기의 뼈대를 지키면서 새 장면을 이어 붙였다. 결과물은 의외로 더 단단했다.')},
     {label:'끝까지 원안을 고집한다', sub:'도전 + · 스트레스 ++', run:S => R_(S, {dare:2, work:0.5, stress:10}, '회의는 길어졌고 분위기는 얼어붙었다. 결국 원안이 일부 반영되었지만 팀과의 거리가 조금 생겼다.')},
   ]},
  {id:'wr_letter', w:3, cd:18, cond:onJob('writer'), place:'room', title:'시청자의 편지', text:S => '방송국 우편함에 시청자의 손편지가 도착했다. “이 드라마 덕분에 오랜만에 엄마에게 전화를 했어요.” 마흔의 내가 바라던 말이었다.',
   choices:[
     {label:'편지를 책상 앞에 붙이고 다시 쓴다', sub:'일 +2 · 나 +2', run:S => R_(S, {work:2, self:2, stress:-6, sense:1}, '피곤이 한꺼번에 사라졌다. 쓰는 사람이 되어 정말 다행이었다.')},
     {label:'답장을 정성껏 써서 보낸다', sub:'관계 +2 · 나 +1.5', run:S => R_(S, {bond:2, self:1.5, stress:-4}, '낯선 시청자에게 짧은 답장을 썼다. 며칠 뒤 감사의 인사가 다시 왔다.')},
   ]},
  {id:'ac_fanmeet', w:3, cd:15, cond:onJob('actor'), speaker:'백승현', place:'night', title:'첫 팬미팅', text:S => '소규모 팬미팅 날이 되었다. 객석에는 응원 문구를 든 열 몇 명의 팬들이 앉아 있다. 마흔의 나는 누군가에게 이런 응원을 받아 본 적이 없다.',
   choices:[
     {label:'진심 어린 이야기를 건넨다', sub:'매력 + · 일 +', run:S => R_(S, {charm:2.5, work:2, stress:-3, self:1.5}, '마이크를 잡은 손이 떨렸지만 진심은 전해졌다. 한 팬이 “언니 연기에서 위로받았어요”라며 울었다.')},
     {label:'준비한 퍼포먼스에 집중한다', sub:'감각 + · 도전 +', run:S => R_(S, {sense:2, dare:1.5, work:1.5, hp:-4}, '연습한 무대는 완벽했다. 박수 소리가 귓가에 오래 남았다.')},
   ]},
  {id:'ac_script', w:3, cd:15, cond:onJob('actor'), place:'room', title:'새 대본', text:S => '새 작품의 대본이 도착했다. 배역은 내가 가장 어려워하는 감정의 인물이다. 마흔의 상처가 자꾸 그 인물과 겹친다.',
   choices:[
     {label:'내 상처를 꺼내 연기에 녹인다', sub:'감각·일 ++ · 스트레스 +', run:S => R_(S, {sense:3, work:3, stress:7, self:1}, '리허설에서 감독이 말을 잃었다. “…지금 거 그대로 가요.” 연기가 끝나자 눈물이 멎지 않았다.')},
     {label:'기교와 연습으로 안정적으로 접근한다', sub:'일 + · 스트레스 -', run:S => R_(S, {work:2, skill:1.5, stress:-2}, '정확하고 깔끔한 연기였다. 감동은 약했지만 실수는 없었다.')},
   ]},
  {id:'lw_court', w:3, cd:15, cond:onJob('lawyer'), speaker:'최건우', place:'night', title:'첫 변론', text:S => '처음으로 법정에서 변론하는 날이다. 방청석에 의뢰인이 앉아 있다. 마흔의 나는 법정에 서 본 적이 없다.',
   choices:[
     {label:'준비한 논리를 차분히 전개한다', sub:'학식·협상 + · 일 +', run:S => R_(S, {know:2.5, neg:2, work:2.5, stress:6}, '심장이 목까지 뛰었지만 입은 차분했다. 재판장이 고개를 끄덕이는 순간 눈앞이 환해졌다.')},
     {label:'의뢰인의 사연을 중심에 놓고 호소한다', sub:'매력·통찰 + · 일 +', run:S => R_(S, {charm:1.5, ins:2, work:2, stress:5}, '논리가 아니라 사람의 이야기가 법정을 움직였다. 판결문에는 내 말의 몇 줄이 그대로 인용되었다.')},
   ]},
  {id:'lw_probono', w:3, cd:18, cond:onJob('lawyer'), place:'cafe', title:'무료 법률 상담', text:S => '법무법인 무료 상담 봉사 시간. 한 노인이 서류를 쥐고 앉았다. 큰돈이 되는 사건은 아니지만 이분에게는 인생이 걸린 일이다.',
   choices:[
     {label:'끝까지 맡아서 해결해 준다', sub:'나 + · 일 + · 체력 -', run:S => R_(S, {self:3, work:1.5, hp:-6, stress:3}, '몇 달 뒤 노인이 직접 만든 김치를 들고 찾아왔다. 돈으로는 계산할 수 없는 보상이었다.')},
     {label:'기초 상담만 해 드리고 다른 기관을 연결한다', sub:'일 + · 스트레스 -', run:S => R_(S, {work:1, ins:1, stress:-2}, '도움이 될 곳을 연결해 드렸다. 최선이었지만 마음 한쪽이 조금 남았다.')},
   ]},
  {id:'dv_review', w:3, cd:15, cond:onJob('dev'), speaker:'안유찬', place:'room', title:'코드 리뷰 충돌', text:S => '내 코드에 선배 개발자가 날카로운 리뷰를 남겼다. 지적이 틀린 부분도 있지만 말투가 거칠다. 팀 분위기가 팽팽해졌다.',
   choices:[
     {label:'근거를 들어 정중하게 반박한다', sub:'협상·실무 +', run:S => R_(S, {neg:2, skill:2, work:1.5, stress:3}, '벤치마크 결과를 첨부하며 설명하자 선배도 인정했다. 그날 이후 리뷰가 훨씬 부드러워졌다.')},
     {label:'일단 수용하고 고쳐 본다', sub:'실무 + · 스트레스 +', run:S => R_(S, {skill:2.5, work:1, stress:5}, '고치고 보니 더 좋은 코드가 되었다. 자존심은 상했지만 실력은 늘었다.')},
   ]},
  {id:'dv_hack', w:3, cd:18, cond:onJob('dev'), place:'night', title:'해커톤', text:S => '사내 해커톤이 열렸다. 이틀 동안 팀을 꾸려 서비스 하나를 만들어야 한다. 마흔의 나는 이런 놀이터에 한 번도 참여한 적이 없다.',
   choices:[
     {label:'팀을 이끌며 처음부터 끝까지 달린다', sub:'실무·도전 + · 체력 --', run:S => R_(S, {skill:3, dare:2, work:2.5, hp:-12, stress:5}, '이틀 밤을 새우고 시연한 순간 박수가 터졌다. 상금보다 그 밤이 더 값졌다.')},
     {label:'아이디어만 내고 팀원이 구현하도록 돕는다', sub:'협상·관계 +', run:S => R_(S, {neg:1.5, bond:2, work:1.5, stress:2}, '함께 만든 결과물이 의외로 완성도가 높았다. 팀이 함께 성장하는 기쁨을 알았다.')},
   ]},
  {id:'ds_fabric', w:3, cd:15, cond:onJob('designer'), speaker:'신우진', place:'night', title:'원단 협상', text:S => '거래처에서 갑자기 원단 가격을 올리겠다고 통보했다. 이대로면 컬렉션 예산이 부족해진다. 대체 원단을 찾을 시간은 빠듯하다.',
   choices:[
     {label:'장기 거래를 조건으로 가격을 협상한다', sub:'협상·일 +', run:S => R_(S, {neg:2.5, work:2, stress:4}, '“올해 물량 전부를 약속드립니다.” 거래처가 한 발 물러섰다. 예산이 지켜졌다.')},
     {label:'다른 소재로 디자인을 바꿔 본다', sub:'감각·실무 +', run:S => R_(S, {sense:2.5, skill:2, work:1.5, stress:5}, '비슷한 느낌의 소재로 시안을 다시 짰다. 새 질감이 오히려 컬렉션에 생동감을 더했다.')},
   ]},
  {id:'ds_backstage', w:3, cd:18, cond:onJob('designer'), place:'night', title:'패션쇼 백스테이지', text:S => '패션쇼 십 분 전, 모델의 드레스 지퍼가 고장 났다. 스태프들이 우왕좌왕한다. 이 순간을 위해 몇 달을 준비했다.',
   choices:[
     {label:'침착하게 직접 손바느질로 수선한다', sub:'실무 ++ · 일 +', run:S => R_(S, {skill:3, work:2.5, stress:6}, '바늘이 떨리는 손을 따라 움직였다. 무대에 오른 모델의 드레스는 흠 하나 없었다.')},
     {label:'다른 의상으로 즉시 교체하고 연출을 바꾼다', sub:'감각·협상 +', run:S => R_(S, {sense:2, neg:1.5, work:2, stress:5}, '즉흥으로 바꾼 룩이 오히려 쇼의 하이라이트가 되었다. 사람들은 의도된 연출인 줄 알았다.')},
   ]},
);

// ═════════ 직장 공통 ═════════
const worker = S => S.hired && !inLawSchool(S);
EVENTS.push(
  {id:'g_firstday', once:true, w:100, cond:S => worker(S) && S.hiredAt != null && S.m - S.hiredAt <= 3 && S.m >= S.hiredAt, place:'cafe', title:'첫 출근',
   text:S => `${CAREERS[S.track].company} 첫 출근. 낯선 사원증, 낯선 얼굴들, 낯선 책상. 마흔의 나는 이 순간을 이십 년 동안 가끔 떠올렸다.`,
   choices:[
     {label:'적극적으로 먼저 인사하고 이름을 외운다', sub:'관계·협상 +', run:S => R_(S, {bond:2, neg:1.5, work:1.5, hp:-4}, '첫날 하루 동안 서른 명의 이름을 외웠다. 퇴근길에 한 선배가 “넌 오래 갈 사람이네”라고 말했다.')},
     {label:'조용히 일을 익히며 관찰한다', sub:'통찰·일 +', run:S => R_(S, {ins:2, work:2, stress:-2}, '아무도 신경 쓰지 않는 곳에서 흐름을 파악했다. 둘째 주부터 일이 손에 붙었다.')},
   ]},
  {id:'g_dinner', w:5, cd:10, cond:S => worker(S), place:'night', title:'회식', text:S => '오늘은 팀 회식. 부장님이 건배사를 하고, 분위기는 점점 무르익는다. 마흔의 나는 이런 자리가 가장 힘들었다.',
   choices:[
     {label:'분위기를 맞추며 적당히 어울린다', sub:'관계 + · 체력 -', run:S => R_(S, {bond:2, neg:1, hp:-7, stress:-2}, '건배사를 하고 박수를 받았다. 다음 날 숙취가 있었지만 팀과 조금 더 가까워졌다.')},
     {label:'일찍 자리를 정리하고 귀가한다', sub:'체력 + · 관계 -', run:S => R_(S, {hp:4, bond:-1.5, stress:-2}, '“내일 일정이 있어서요.” 정중히 인사하고 나왔다. 몇몇은 서운해했지만 몸은 가벼웠다.')},
     {label:'술은 사양하고 진솔한 대화를 나눈다', sub:'통찰·관계 +', run:S => R_(S, {ins:2, bond:2, stress:-3}, '술잔 대신 이야기를 건넸다. 선배의 속마음을 처음 들었다.')},
   ]},
  {id:'g_review', w:4, cd:12, cond:S => worker(S) && S.hiredAt != null && S.m - S.hiredAt >= 6, place:'room', title:'인사평가', text:S => '반기 인사평가 시즌. 팀장과의 개별 면담이 잡혔다. 지난 몇 달의 성과를 정리해 말해야 한다.',
   choices:[
     {label:'성과를 수치로 정리해 당당히 어필한다', sub:'협상·일 +', run:S => R_(S, {neg:2, work:2.5, stress:4}, '표 한 장으로 정리한 성과가 팀장의 눈을 사로잡았다. 평가는 기대 이상이었다.')},
     {label:'동료와의 협업과 성장을 중심으로 이야기한다', sub:'관계·통찰 +', run:S => R_(S, {bond:2, ins:1.5, work:1.5, stress:2}, '팀장이 한참 고개를 끄덕이며 말했다. “같이 일하기 좋은 사람이라고 다들 말하더라.”')},
   ]},
  {id:'g_latewalk', w:4, cd:10, cond:S => worker(S) && S.stress >= 40, place:'night', title:'야근 후 퇴근길', text:S => '밤 열한 시, 텅 빈 사무실을 나서는 길. 지하철 유리창에 비친 얼굴이 마흔의 내 얼굴과 겹쳐 보였다.',
   choices:[
     {label:'걸어서 집까지 가며 마음을 정리한다', sub:'스트레스 -- · 나 +1', run:S => R_(S, {stress:-8, self:1, hp:-2}, '강변을 따라 한 정거장을 걸었다. 도시의 불빛 속에서 숨이 트였다.')},
     {label:'친구에게 전화를 걸어 하소연한다', sub:'관계 +2 · 스트레스 -5', run:S => R_(S, {bond:2, stress:-5}, '“야, 나 오늘 진짜 힘들었어.” 소연이 소리를 지르며 같이 욕해 줬다. 웃음이 났다.')},
   ]},
  {id:'g_junior', w:4, cd:12, cond:S => worker(S) && S.hiredAt != null && S.m - S.hiredAt >= 8, place:'cafe', title:'신입 후배', text:S => '신입 후배가 첫 보고서를 들고 와서 눈치를 보며 서 있다. 마흔의 내가 그때 이런 후배에게 따뜻한 말을 해 주었던가.',
   choices:[
     {label:'차근차근 가르쳐 주며 격려한다', sub:'관계·통찰 +', run:S => R_(S, {bond:2.5, ins:1.5, work:1, stress:2}, '“처음엔 다 그래요.” 후배가 눈시울을 붉히며 고맙다고 했다. 한 사람의 시작을 도왔다는 사실이 마음에 남았다.')},
     {label:'스스로 해 보도록 두고 지켜본다', sub:'일 + · 관계 +', run:S => R_(S, {work:1.5, bond:1, ins:1}, '스스로 헤매며 해내는 걸 지켜봤다. 다음 날 후배의 결과물이 놀라울 정도로 좋아졌다.')},
   ]},
  {id:'g_mentor', w:3, cd:18, cond:S => worker(S) && S.hiredAt != null && S.m - S.hiredAt >= 6, place:'cafe', title:'멘토를 만나다', text:S => '사내 식당에서 오래 일한 선배가 말을 걸어 왔다. “일은 해 보니까 어때? 힘들면 언제든 말해.” 마흔의 나는 이런 어른을 한 번도 곁에 두지 못했다.',
   choices:[
     {label:'조언을 구하고 정기적으로 만나기로 한다', sub:'통찰·일 ++', run:S => R_(S, {ins:2.5, work:2.5, bond:1.5, stress:-3}, '한 달에 한 번, 점심을 같이 먹으며 선배의 이야기를 들었다. 한 줄의 조언이 몇 년을 아껴 주었다.')},
     {label:'감사만 전하고 스스로 길을 찾는다', sub:'나 + · 일 +', run:S => R_(S, {self:1.5, work:1}, '“감사합니다. 힘들 땐 꼭 찾아뵐게요.” 선배가 환하게 웃었다. 언제든 기댈 수 있다는 사실만으로 든든했다.')},
   ]},
  {id:'g_payday', w:4, cd:6, cond:S => worker(S) && !inLawSchool(S), place:'cafe', title:'월급날', text:S => '월급날. 통장에 찍힌 숫자를 확인하는 순간만큼은 마흔의 나도 늘 기뻤다. 이번 달은 무엇에 쓸까.',
   choices:[
     {label:'적금에 넣고 생활비만 쓴다', sub:'자금 + · 스트레스 -', run:S => R_(S, {cash:30, stress:-2}, '통장의 숫자가 조금씩 쌓이는 걸 보는 것도 즐거웠다. 마음의 안전망이 하나 늘었다.')},
     {label:'친구들과 가족에게 한턱낸다', sub:'자금 -25 · 관계 +3', run:S => R_(S, {cash:-25, bond:3, stress:-4}, '“오늘은 내가 쏜다!” 식탁 위로 웃음이 번졌다. 돈으로 사는 가장 좋은 것 중 하나였다.')},
     {label:'나를 위한 선물을 산다', sub:'자금 -20 · 나 +2', run:S => R_(S, {cash:-20, self:2, stress:-5}, '오래 갖고 싶던 물건을 샀다. 이십 대의 나에게 처음으로 해 주는 선물이었다.')},
   ]},
  {id:'g_burnwarn', w:5, cd:12, cond:S => worker(S) && S.stress >= 70, place:'room', title:'번아웃의 경고', text:S => '아침에 일어나는 것조차 힘들다. 출근길에 갑자기 눈물이 났다. 마흔의 해고 직전 몇 달과 같은 느낌이다. 몸이 보내는 경고를 무시해도 될까.',
   choices:[
     {label:'연차를 내고 며칠 푹 쉰다', sub:'스트레스 --- · 일 -1', run:S => R_(S, {stress:-20, hp:10, work:-1, self:2}, '휴대폰을 끄고 이불 속에서 이틀을 보냈다. 몸이 가장 먼저 “고마워”라고 말하는 것 같았다.')},
     {label:'상담 센터를 찾아 이야기를 나눈다', sub:'스트레스 -- · 통찰 +2', run:S => R_(S, {stress:-14, ins:2, self:2, cash:-8}, '“많이 지치셨네요.” 상담사의 한마디에 눈물이 터졌다. 오랜만에 속이 시원해졌다.')},
     {label:'이를 악물고 버틴다', sub:'일 + · 체력 --', run:S => R_(S, {work:1, hp:-14, stress:6}, '버틴 대가는 몸이 치렀다. 마흔의 나와 같은 길로 가고 있다는 두려움이 스쳤다.')},
   ]},
);

// ═════════ 로스쿨 (법률가 트랙) ═════════
const inLS = S => inLawSchool(S);
EVENTS.push(
  {id:'ls_moot', w:5, cd:10, cond:inLS, place:'campus', title:'모의재판', text:S => '로스쿨 모의재판 시간. 교수님이 갑자기 나를 검사 역으로 지명했다. 법정 한가운데서 반대 신문을 해야 한다.',
   choices:[
     {label:'차분히 논리를 쌓아 신문한다', sub:'학식·협상 +', run:S => R_(S, {know:2.5, neg:2, work:2, stress:6}, '교수님이 “훌륭한 신문이었습니다”라고 평가했다. 처음으로 변호사가 되는 길이 구체적으로 느껴졌다.')},
     {label:'긴장해 말이 꼬이지만 끝까지 해낸다', sub:'도전 + · 스트레스 +', run:S => R_(S, {dare:2, know:1, stress:8}, '횡설수설했지만 끝까지 섰다. 교수님이 “다음엔 더 잘할 겁니다”라고 격려했다.')},
   ]},
  {id:'ls_study', w:5, cd:8, cond:inLS, place:'room', title:'스터디 그룹', text:S => '법전과 판례집이 책상 가득 쌓여 있다. 로스쿨 스터디 그룹 동기들과 변호사시험 대비 계획을 세우는 중이다.',
   choices:[
     {label:'동기들과 매일 토론하며 공부한다', sub:'학식 ++ · 관계 +', run:S => R_(S, {know:3.5, bond:2, stress:5, hp:-5}, '서로 틀린 부분을 지적해 주며 한 달을 보냈다. 혼자였다면 놓쳤을 쟁점이 보였다.')},
     {label:'혼자 조용히 집중해서 공부한다', sub:'학식 + · 나 -', run:S => R_(S, {know:3, self:-1, stress:6, hp:-4}, '효율은 높았지만 점점 말수가 줄어들었다. 사람이 그립다는 생각이 들었다.')},
   ]},
  {id:'ls_stress', w:5, cd:10, cond:S => inLS(S) && S.stress >= 50, place:'night', title:'로스쿨의 밤', text:S => '도서관에서 새벽을 맞았다. 옆자리의 동기가 조용히 울고 있다. 마흔의 나는 이 시험 앞에서 포기한 사람들 사이에 있었다.',
   choices:[
     {label:'동기에게 따뜻한 커피를 건넨다', sub:'관계 +3 · 스트레스 -3', run:S => R_(S, {bond:3, stress:-3, ins:1}, '“힘들지? 나도 그래.” 서로 말없이 앉아 아침을 맞았다. 함께 버틴다는 건 이렇게 큰 힘이다.')},
     {label:'잠깐 나가 바람을 쐬며 마음을 가다듬는다', sub:'스트레스 -- · 체력 +', run:S => R_(S, {stress:-8, hp:4, self:1.5}, '새벽 공기가 폐 깊숙이 들어왔다. 다시 도서관으로 돌아갈 용기가 났다.')},
   ]},
);
