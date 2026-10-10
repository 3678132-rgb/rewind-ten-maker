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
