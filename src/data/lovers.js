// 연애 인물과 이벤트 생성 (ENGINE 구간 안, DOM 금지)
// 아이돌 세계: 첫 만남은 달(meet) 또는 아이돌 상태(meetOk)로 정한다. hint 는 아직 못 만난 사람 카드에 보일 한 줄.
const LOVERS = {
  jaewoo: {id:'jaewoo', name:'서재우', age:'22', job:'홍대 인디밴드 기타리스트 · 작곡가 지망생', like:'neg', meet:6, hint:'연습실 밖, 홍대 어딘가에서 만날지도 몰라요',
    intro:'마흔의 나와 이혼 서류에 도장을 찍었던 사람. 그는 늘 자기 꿈을 위해 내가 양보하기를 당연하게 여겼다. 그런데 눈앞의 그는 아직 아무 잘못도 하지 않은, 홍대 지하 클럽에서 기타를 메고 언젠가 자기 노래로 큰 무대에 서겠다고 눈을 빛내는, 웃을 때 눈이 사라지는 스물두 살이다.',
    dateLines:['합주실 앞 분식집. 그가 내 접시에 계란말이를 슬쩍 올려 준다. 똑같은 버릇이다.', '클럽 공연이 끝난 새벽, 건물 옥상에서 가로등 불빛을 봤다. 이 사람은 원래 이렇게 다정했었다.', '“넌 가끔 나보다 어른 같아.” 그가 기타 줄을 갈다 말고 웃었다. 나는 대답 대신 웃었다.'],
    trial:{title:'네 건 다음에 해도 되잖아', text:'재우가 밴드 경연 결선 준비로 내 일정을 통째로 비워 달라고 했다. 하필 내 평가와 무대 연습이 몰린 주다. “이건 내 꿈이잖아. 네 건 다음에 해도 되잖아.” 이혼 서류 앞에서 들었던 바로 그 문장이다.',
    choices:[
      {label:'“네 꿈만큼 내 꿈도 소중해”라고 말한다', sub:'팬소통·멘탈이 높을수록 그가 바뀐다', run(S, v, ch){ const ok = (S.st.neg + S.st.ins) / 2 + rand(-10, 15) >= 50; if(ok){ v.fixed = true; addAff(S, 'jaewoo', 6, ch); fx(S, {self:3, bond:2}, ch); return '그는 한참 말이 없다가 고개를 숙였다. “…내가 네 꿈은 한 번도 안 물어봤네. 미안.” 처음으로 그가 내 연습 일정부터 달력에 적었다. 같은 길이 아니라는 확신이 들었다.'; } addAff(S, 'jaewoo', -8, ch); fx(S, {stress:10}, ch); return '“왜 그렇게 이기적이야?” 그가 되물었다. 알겠다. 이 사람은 아직 모르는 거다. 내가 무엇을 잃어 왔는지.'; }},
      {label:'또 내가 양보한다', sub:'실력 -3 · 마음 -3 · 결국 같은 결말로', run(S, v, ch){ addAff(S, 'jaewoo', 3, ch); fx(S, {work:-3, self:-3, stress:5}, ch); return '나는 또 웃으며 연습을 빠졌다. 이 장면을 안다. 마흔의 내가 이십 년 동안 반복했던 선택이라서 더 무서웠다.'; }},
      {label:'이별을 말한다', sub:'아프지만 다른 길을 연다', run(S, v, ch){ v.stage = -9; S.partner = null; fx(S, {self:4, bond:-4, stress:8}, ch); return '“미안해. 우린 여기까지야.” 그는 이유를 몰랐고, 나는 말해 줄 수 없었다. 대신 이번엔 내가 먼저 걸어 나왔다.'; }},
    ]},
  },
  minjun: {id:'minjun', name:'한민준', age:'20', job:'고향 친구 · 건축학도', like:'ins', meet:2, hint:'고향 쪽에서 연락이 올지도 몰라요',
    intro:'마흔의 나는 어느새 연락이 끊겼던 오랜 친구. 서울에서 건축학과를 다니는 그가 연습생 숙소 앞까지 찾아와 서툰 손으로 도시락을 내민다. “연예인 한다며. 밥은 먹고 해.” 연예계 밖에서 나를 그냥 나로 보는 유일한 사람이다.',
    dateLines:['그가 도면 그리는 걸 구경했다. 선 하나에도 고집이 보였다.', '한강에서 자전거를 탔다. 모자를 눌러쓴 나보다 그가 더 주위를 살폈다.', '“너 요즘 좀 달라졌어.” “좋은 쪽으로?” “…응. 근데 너무 무리하지는 마.”'],
    trial:{title:'입대 통지서', text:'민준에게 입영 통지서가 나왔다. 기다려 달라는 말은 끝내 못 하고, 그는 도시락 가방만 만지작거렸다. 내 스케줄 표에는 빈칸이 거의 없다.',
      choices:[
        {label:'기다리겠다고 말한다', sub:'기다림이 관계를 단단하게 한다', run(S, v, ch){ addAff(S, 'minjun', 8, ch); fx(S, {bond:3, stress:5}, ch); return '“편지 쓸게. 답장 안 해도 돼. 너 바쁜 거 아니까.” 그가 처음으로 환하게 웃었다.'; }},
        {label:'각자 길을 가자고 한다', sub:'마음이 식는다', run(S, v, ch){ v.stage = -9; S.partner = null; fx(S, {bond:-4, self:2}, ch); return '그는 이해한다고 말했지만, 도시락 가방은 끝내 돌아오지 않았다.'; }},
      ]},
  },
  hajin: {id:'hajin', name:'윤하진', age:'28', job:'신생 엔터 스타트업 대표', like:'dare', meet:14, hint:'연습실 앞에서 누군가 명함을 내밀지도 몰라요',
    intro:'연습실 건물 앞에서 명함을 내민 젊은 대표. 직원 네 명짜리 신생 기획사다. “지금 회사에서 몇 년 더 기다릴 거예요? 우리랑 하면 바로 데뷔예요.” 내가 아는 미래에서 그의 회사는 크게 성공한다. 하지만 지금 그는 라면으로 끼니를 때우는 사람일 뿐이다.',
    dateLines:['밤늦은 그의 사무실에서 같이 배달 음식을 먹었다. 이 사람의 꿈은 소리가 크다.', '“넌 왜 항상 답을 아는 사람처럼 말해?” 나는 웃으며 얼버무렸다.', '그의 화이트보드엔 내가 아는 이름의 그룹이 막 태어나고 있었다.'],
    trial:{title:'투자와 진심', text:'하진의 회사가 투자 유치 직전 위기에 빠졌다. 첫 그룹의 데뷔가 걸려 있다. 나는 이 회사가 어떻게 될지 알고 있다. 미래를 말해 줄까, 말아야 할까.',
      choices:[
        {label:'아는 걸 힌트로 흘린다', sub:'도움이 되지만 기억이 닳는다', run(S, v, ch){ addAff(S, 'hajin', 8, ch); fx(S, {clarity:-8}, ch); S.borrowed++; return '그는 눈을 빛내며 방향을 틀었다. 회사는 살아났다. 내 기억은 흐려졌다.'; }},
        {label:'미래는 숨기고 옆에서 응원한다', sub:'진짜 신뢰가 쌓인다', run(S, v, ch){ addAff(S, 'hajin', 6, ch); fx(S, {self:3, bond:2, stress:4}, ch); return '“안 되면 같이 라면 먹자.” 그는 웃다가 조용히 내 손을 잡았다.'; }},
      ]},
  },
  taeoh: {id:'taeoh', name:'은태오', age:'28', job:'화보 사진작가', like:'sense', meet:99999, hint:'데뷔하고 나면 첫 앨범 재킷 촬영장에서 만날지도 몰라요',
    meetOk:S => isIdol(S) && sinceDebut(S) >= 1,
    intro:'데뷔 후 첫 앨범 재킷을 찍게 된 사진작가. 모든 걸 천천히 보는 사람이다. 카메라 앞에서 굳어 버린 나를 두고 그는 셔터를 누르지 않은 채 십 분을 기다렸다. “서두르지 않아도 늦지 않아요. 빛이 올 때 찍죠.”',
    dateLines:['필름 카메라로 내 뒷모습을 찍었다. 어떻게 나왔는지는 비밀이란다.', '스케줄 없는 날, 아무 계획 없이 기차를 탔다. 계획이 없는 하루가 이렇게 긴 줄 몰랐다.', '“서두르지 않아도 늦지 않아요.” 그의 말이 오래 남았다.'],
    trial:{title:'떠나는 사람', text:'태오가 해외 작업 제안을 받았다고 했다. 반년이 될지 몇 년이 될지 모른다. 그는 내 대답을 기다린다.',
      choices:[
        {label:'다녀오라고 등을 민다', sub:'서로를 더 단단하게', run(S, v, ch){ addAff(S, 'taeoh', 7, ch); fx(S, {self:4, stress:4}, ch); return '“돌아오면 제일 먼저 찍어 줄게.” 그는 공항에서 오래 손을 흔들었다.'; }},
        {label:'같이 가고 싶다고 말한다', sub:'실력과 시간이 흔들린다', run(S, v, ch){ addAff(S, 'taeoh', 10, ch); fx(S, {work:-3, bond:3, dare:1}, ch); return '“진심이에요?” 그는 놀란 얼굴로 웃었다. 스케줄 틈마다 그를 보러 갔다. 우리의 속도가 조금씩 맞춰졌다.'; }},
        {label:'헤어지는 편이 낫다고 말한다', sub:'아프지만 깔끔하게', run(S, v, ch){ v.stage = -9; S.partner = null; fx(S, {bond:-4, self:2}, ch); return '“그렇게 말할 줄 알았어요.” 그는 쓸쓸히 웃고 돌아섰다.'; }},
      ]},
  },
};

// ── 연예계 사람들: 아이돌 상태가 되어야 만나는 사람이 많다 ──
LOVERS.jihu = {id:'jihu', name:'한지후', age:'30', job:'루미에르 코스메틱 · 브랜드 매니저', like:'neg', meet:99999, hint:'데뷔하고 팬이 5만 명을 넘으면 광고 미팅에서 만날지도 몰라요',
  meetOk:S => isIdol(S) && fansOf(S) >= 5,
  intro:'첫 광고 모델 미팅. 임원들이 “아직 신인이라 불안하다”고 말할 때, 브랜드 매니저인 그는 말없이 내 프로필에 딱 한 줄을 적었다. “이 얼굴, 좋습니다.” 회의실에서는 말수가 적은데, 숫자와 사람을 동시에 정확히 읽는 사람이다.',
  dateLines:['성수동 카페에서 캠페인 아이디어를 주고받았다. 일 얘기인데 이상하게 설렜다.', '촬영이 끝난 밤 편의점 앞에서 음료 한 캔. “오늘 컷, 멋있었어요.” 그가 처음으로 웃었다.', '신제품 샘플 향을 번갈아 맡으며 웃었다. 이 사람 앞에서는 일이 놀이가 된다.'],
  trial:{title:'계약서의 한 줄', text:'재계약 서류에 새 조항이 붙었다. 「모델은 브랜드 관계자와 사적인 관계를 맺지 않는다.」 들키면 계약 위반이고, 열애설까지 겹치면 위약금이다. 지후가 조용히 말했다. “네가 정해. 난 어느 쪽이든 따를게.”',
    choices:[
      {label:'광고 재계약을 포기한다', sub:'돈 -40 · 실력 -2 · 호감 +8 · 관계 +3', run(S, v, ch){ addAff(S, 'jihu', 8, ch); bump(S, 'cash', -40, ch); fx(S, {work:-2, bond:3}, ch); return '계약서 대신 그의 손을 잡았다. 광고판에서 내 얼굴은 내려갔지만, 퇴근길의 그는 곁에 남았다.'; }},
      {label:'비밀로 이어 간다', sub:'스트레스 +8 · 호감 +4 · 스캔들 위험', run(S, v, ch){ addAff(S, 'jihu', 4, ch); fx(S, {stress:8, bond:1}, ch); if(isIdol(S)) addScandal(S, 6, ch); return '촬영장에서 마주칠 때마다 모르는 척했다. 들킬까 봐 두근거리는 마음이 반은 설렘, 반은 불안이었다.'; }},
      {label:'일을 위해 정리한다', sub:'실력 +2 · 이별', run(S, v, ch){ v.stage = -9; S.partner = null; fx(S, {work:2, bond:-4, stress:6}, ch); return '“…그래, 우린 좋은 파트너로 남자.” 지후는 고개를 끄덕였지만 한동안 눈을 마주치지 못했다.'; }},
    ]}};
LOVERS.dohyun = {id:'dohyun', name:'차도현', age:'32', job:'음악방송 「뮤직 스테이지」 메인 PD', like:'dare', meet:99999, hint:'데뷔하면 음악방송 현장에서 만날지도 몰라요',
  meetOk:S => isIdol(S) && sinceDebut(S) >= 1,
  intro:'음악방송 「뮤직 스테이지」의 메인 PD. 새벽 다섯 시 사전녹화에도 모니터 앞에서 컷을 고르는 사람. 말은 거칠지만 스태프와 신인 이름을 전부 외운다. 첫 음방 날, 내가 동선을 놓친 순간을 그가 카메라로 대신 메워 주었다.',
  dateLines:['사전녹화가 끝난 새벽, 방송국 앞 분식집에서 떡볶이를 먹었다. “이 시간이 제일 맛있어.” 그가 웃었다.', '편집실에서 같은 화면을 한참 봤다. 그는 어깨를 가까이 대고도 모른 척했다.', '비 오는 야외 공개방송 구석, 그의 재킷이 내 머리 위로 올라왔다.'],
  trial:{title:'편성과 약속', text:'「뮤직 스테이지」가 폐지 위기다. 도현은 밤샘 회의 때문에 중요한 기념일을 또 잊었다. 그는 미안한 눈으로 말했다. “이번 주만 더 하면 돼.”',
    choices:[
      {label:'도시락을 들고 방송국에 간다', sub:'호감 +8 · 실력 +2 · 스캔들 위험', run(S, v, ch){ addAff(S, 'dohyun', 8, ch); fx(S, {work:2, stress:3}, ch); if(isIdol(S)) addScandal(S, 3, ch); return '스태프들 앞에서 도시락을 내밀자 그가 처음으로 얼굴이 빨개졌다. 그날 녹화는 유난히 순조로웠다.'; }},
      {label:'서운함을 솔직히 말한다', sub:'팬소통·멘탈이 높을수록 좋다', run(S, v, ch){ const ok = (S.st.neg + S.st.ins) / 2 + rand(-10, 15) >= 48; if(ok){ addAff(S, 'dohyun', 6, ch); fx(S, {self:3}, ch); return '“미안. 내가 일에 취해서…” 그는 휴대폰 캘린더에 기념일을 적었다. 처음 보는 모습이었다.'; } addAff(S, 'dohyun', -6, ch); fx(S, {stress:7}, ch); return '“지금 그 얘기를 해야겠어?” 말이 어긋나 버렸다. 서로 식은 커피만 바라봤다.'; }},
      {label:'당분간 쉬자고 한다', sub:'이별', run(S, v, ch){ v.stage = -9; S.partner = null; fx(S, {bond:-4, self:2}, ch); return '“일이 끝나면 다시 얘기하자.” 그는 대답하지 못했고, 프로그램이 살아난 뒤에도 연락은 오지 않았다.'; }},
    ]}};
LOVERS.sian = {id:'sian', name:'유시안', age:'34', job:'한빛방송 드라마 감독', like:'sense', meet:99999, hint:'데뷔하고 몇 년 지나면 연기 제안과 함께 만날지도 몰라요',
  meetOk:S => S.m >= 40 && (isIdol(S) || (isOut(S) && S.m >= 48)),
  intro:'연기 제안을 받고 간 첫 대본 리딩. 드라마 감독인 그가 내 첫 대사를 듣고 한참 말이 없더니 물었다. “그 대사, 어디서 배운 말투예요? 연기한 사람이 아니라 겪은 사람 같아서요.” 대답할 수 없었다. 마흔의 내가 실제로 했던 말이었으니까.',
  dateLines:['한강 둔치에서 대본을 소리 내어 맞췄다. 그의 디렉션이 대사에 입혀지자 소름이 돋았다.', '새벽 편집실, 그는 내 대사 한 줄을 일곱 번 다르게 보여 주었다. 모두 아름다웠다.', '“배우님 덕분에 이 드라마가 좋아요.” 그의 말에 오래 가슴이 따뜻했다.'],
  trial:{title:'내 연기, 그의 연출', text:'8회 대본을 두고 시안이 내 인물의 결말을 바꾸자고 했다. 내가 가장 아끼는 장면이다. 방송 일정은 촉박하고, 우리는 연인이다.',
    choices:[
      {label:'내 해석을 고집한다', sub:'실력 +3 · 호감 -4', run(S, v, ch){ addAff(S, 'sian', -4, ch); fx(S, {work:3, sense:1, stress:5}, ch); return '“이 인물은 제가 제일 잘 알아요.” 단호한 말에 회의실이 조용해졌다. 장면은 지켰지만 그의 얼굴이 굳었다.'; }},
      {label:'그의 안을 받아들인다', sub:'호감 +6 · 실력 -1', run(S, v, ch){ addAff(S, 'sian', 6, ch); fx(S, {work:-1, bond:2}, ch); return '새 결말은 낯설었지만 화면에서는 이상하게 더 울림이 있었다. 시안이 조용히 내 손을 잡았다.'; }},
      {label:'함께 절충안을 만든다', sub:'멘탈이 높을수록 좋다', run(S, v, ch){ const ok = S.st.ins + rand(-12, 14) >= 48; if(ok){ addAff(S, 'sian', 8, ch); fx(S, {work:2.5, ins:1.5, self:2}, ch); return '밤새 둘이 대사를 고쳤다. 새벽 다섯 시, 마침내 둘 다 고개를 끄덕이는 결말이 나왔다.'; } addAff(S, 'sian', -2, ch); fx(S, {stress:6}, ch); return '밤새 이야기했지만 서로의 말이 엇갈렸다. 결국 반쯤 어정쩡한 결말이 되었다.'; }},
    ]}};
LOVERS.seunghyun = {id:'seunghyun', name:'백승현', age:'26', job:'스타라이트 엔터 · 같은 소속사 배우 선배', like:'charm', meet:10, hint:'같은 소속사 어딘가에서 만날지도 몰라요',
  meetOk:S => S.m >= 10 && !isOut(S),
  intro:'같은 소속사의 인기 배우. 밤 열한 시, 연습실에 혼자 남은 나를 보고 이어폰 한쪽을 건넸다. “이 노래 들으면서 하면 덜 외로워요.” 소속사 사람들은 그를 두고 말한다. 비밀이 많은 사람이라고.',
  dateLines:['연습실 불을 끄고 둘이 바닥에 앉아 대본을 맞췄다. 그의 대사가 내게 건네질 때마다 심장이 뛰었다.', '촬영 후 야식. 모자를 눌러쓴 그가 속삭였다. “우리 이렇게 만나는 거, 비밀이에요.”', '그가 내 어깨에 기대 잠깐 졸았다. 카메라 밖의 그는 의외로 평범했다.'],
  trial:{title:'열애설', text:'새벽, 지석 매니저가 급하게 전화했다. 우리 사진이 인터넷에 올라왔다. 같은 소속사라 대표가 둘 다 부르고 있다.',
    choices:[
      {label:'당당히 인정한다', sub:'관계 +4 · 실력 -2 · 호감 +6 · 스캔들 위험↑', run(S, v, ch){ addAff(S, 'seunghyun', 6, ch); fx(S, {bond:4, work:-2, stress:6, charm:1}, ch); if(isIdol(S)) addScandal(S, 15, ch); return '“네, 만나고 있습니다.” 짧은 입장문이 나갔다. 한동안 악플에 시달렸지만 그의 손이 내내 곁에 있었다.'; }},
      {label:'친한 선후배라고 부인한다', sub:'호감 -6 · 스트레스 +', run(S, v, ch){ addAff(S, 'seunghyun', -6, ch); fx(S, {stress:8, work:1}, ch); if(isIdol(S)) addScandal(S, 4, ch); return '“사실무근입니다.” 말은 간단했지만, 그의 표정이 오래 어두웠다.'; }},
      {label:'침묵하며 시간을 번다', sub:'스트레스 +5', run(S, v, ch){ fx(S, {stress:5}, ch); if(isIdol(S)) addScandal(S, 8, ch); return '며칠 동안 아무 말도 하지 않았다. 기사는 조금씩 사그라들었지만 서로 말이 줄었다.'; }},
    ]}};
LOVERS.geonwoo = {id:'geonwoo', name:'최건우', age:'34', job:'엔터 전문 법무법인 · 파트너 변호사', like:'know', meet:99999, hint:'정산이나 계약 문제가 생길 무렵 만날지도 몰라요',
  meetOk:S => S.m >= 30 && (!isIdol(S) || sinceDebut(S) >= 6),
  intro:'정산서와 계약서를 들고 찾아간 엔터 전문 법무법인. 파트너 변호사인 그는 조항 하나의 조사를 펜으로 짚었다. “이 한 글자 때문에 7년을 더 묶일 수 있습니다.” 엄격한 사람인데, 상담이 끝나자 말없이 따뜻한 차를 두고 갔다.',
  dateLines:['계약서를 같이 읽다가 서로 다른 해석에 논쟁하고, 웃으며 화해했다. 이 사람과는 싸움도 대화다.', '야경이 보이는 사무실 옥상, 그가 처음으로 넥타이를 풀었다.', '“변호사는 늘 누군가의 최악의 날에 만나잖아요.” 그의 말에 오래 생각했다.'],
  trial:{title:'이해충돌', text:'공교롭게도 건우의 법무법인이 우리 소속사의 자문을 맡게 되었다. 내 계약 문제의 상대편이 그의 의뢰인이 된 것이다. 이대로면 둘 중 한 사람은 윤리 문제에 걸린다.',
    choices:[
      {label:'다른 변호사를 세워 정면으로 다툰다', sub:'실력 +4 · 호감 -5', run(S, v, ch){ addAff(S, 'geonwoo', -5, ch); fx(S, {work:4, know:1.5, stress:6}, ch); return '협상 테이블에서 우리는 서로를 한 치도 봐주지 않았다. 조건은 내 쪽으로 기울었지만 돌아오는 길은 길게 느껴졌다.'; }},
      {label:'그에게 이 사건에서 빠져 달라고 부탁한다', sub:'실력 -2 · 호감 +4', run(S, v, ch){ addAff(S, 'geonwoo', 4, ch); fx(S, {work:-2, bond:2}, ch); return '“현명한 판단이에요.” 그는 짧게 말하며 안도한 듯 웃었다. 나는 조금 아쉬웠다.'; }},
      {label:'몰래 조율해 보려 한다', sub:'윤리 문제 · 스트레스 +', run(S, v, ch){ S.borrowed++; fx(S, {stress:9, self:-3}, ch); return '비밀리에 계약 얘기를 주고받았다. 마음은 편하지 않았다. 이건 내가 바랐던 우리의 모습이 아니다.'; }},
    ]}};
LOVERS.yuchan = {id:'yuchan', name:'안유찬', age:'28', job:'팬 소통 앱 「별빛」 개발 리드', like:'skill', meet:99999, hint:'데뷔하면 팬 앱을 통해 만날지도 몰라요',
  meetOk:S => isIdol(S) && sinceDebut(S) >= 2,
  intro:'우리 그룹 팬 소통 앱 「별빛」의 개발 리드. 라이브 채팅창이 악플로 뒤덮인 밤, 새벽까지 필터를 고쳐 준 사람이다. 다음 날 그가 보낸 메시지는 한 줄뿐이었다. “이제 괜찮아요. 나쁜 말은 제가 막을게요.” 그 한 줄이 하루 종일 기뻤다.',
  dateLines:['사옥 앞 계단에서 같이 컵라면을 먹었다. 이 사람은 말보다 코드가 다정하다.', '스케줄 없는 밤 보드게임 카페. 그가 의외로 승부욕이 강하다는 걸 알았다.', '“이 버그, 같이 잡자.” 그의 말이 어쩐지 고백처럼 들렸다.'],
  trial:{title:'새 앱과 같이 가자는 말', text:'밤새 앱 장애를 복구한 아침, 유찬이 말했다. “회사를 나와서 아이돌을 지키는 앱을 직접 만들고 싶어. 악플이랑 사생을 막는 거. 첫 번째 아티스트가 너였으면 해.”',
    choices:[
      {label:'함께하겠다고 한다', sub:'예능감 + · 실력 +3 · 호감 +8', run(S, v, ch){ addAff(S, 'yuchan', 8, ch); fx(S, {work:3, dare:2, stress:5}, ch); return '“진짜?” 그는 처음으로 키보드를 멈추고 나를 바라봤다. 회사 허락을 받는 일은 막막했지만 그의 눈이 믿음직했다.'; }},
      {label:'지금 앱에서 같이 버티자고 한다', sub:'호감 -3 · 안정', run(S, v, ch){ addAff(S, 'yuchan', -3, ch); fx(S, {self:2, stress:-2}, ch); return '“그렇구나.” 그는 웃으며 고개를 끄덕였지만 메신저 창이 갑자기 조용해진 것 같았다.'; }},
      {label:'아는 미래로 설득한다', sub:'선명도 -8 · 호감 +6', run(S, v, ch){ S.borrowed++; addAff(S, 'yuchan', 6, ch); fx(S, {clarity:-8}, ch); return '그가 모를 일들을 근거처럼 말했다. 설득은 먹혔지만 그는 가끔 나를 이상하다는 듯 바라본다.'; }},
    ]}};
LOVERS.ujin = {id:'ujin', name:'신우진', age:'27', job:'무대 의상 디자이너', like:'sense', meet:20, hint:'데뷔 무대를 준비할 무렵 의상실에서 만날지도 몰라요',
  meetOk:S => S.m >= 20 && (isIdol(S) || (isTrainee(S) && (IDOL(S).debutTeam || !!IDOL(S).survival)) || S.m >= 30),
  intro:'데뷔 무대 의상 피팅 날. 원단을 손으로 먼저 읽는 무대 의상 디자이너가 내가 그려 간 낙서 같은 의상 스케치를 한참 말없이 보다가 말했다. “색이 거짓말을 안 하네요.” 그 한마디가 일주일 동안 가시지 않았다.',
  dateLines:['동대문 원단 시장을 같이 돌았다. 그는 손끝으로 사람을 읽듯 천을 읽었다.', '밤새 피팅룸에서 핀을 꽂다가 손이 스쳤다. 둘 다 못 본 척했다.', '“계절은 늘 옷이 먼저 알아요.” 그의 말이 시처럼 들렸다.'],
  trial:{title:'표절 논란', text:'컴백 무대 직후 온라인에 우리 무대 의상이 해외 브랜드 옷과 닮았다는 글이 올라왔다. 하필 그 도안은 우진과 내가 함께 고른 것이다.',
    choices:[
      {label:'작업 과정을 공개해 해명한다', sub:'실력 +3 · 호감 -4', run(S, v, ch){ addAff(S, 'ujin', -4, ch); fx(S, {work:3, stress:6}, ch); return '스케치와 날짜가 담긴 자료를 공개했다. 논란은 가라앉았지만 우진은 “꼭 그렇게 해야 했어?”라고 물었다.'; }},
      {label:'함께 입장문을 낸다', sub:'호감 +6 · 관계 +2 · 스캔들 위험', run(S, v, ch){ addAff(S, 'ujin', 6, ch); fx(S, {bond:2, stress:4}, ch); if(isIdol(S)) addScandal(S, 4, ch); return '둘의 이름이 나란히 적힌 입장문이 나갔다. 비난 속에서도 그의 손이 내 손을 놓지 않았다.'; }},
      {label:'내가 책임지고 의상을 내린다', sub:'실력 -3 · 호감 +4', run(S, v, ch){ addAff(S, 'ujin', 4, ch); fx(S, {work:-3, self:2}, ch); return '“내가 할게.” 의상은 바뀌었고 평판은 조금 흔들렸다. 우진은 말없이 내 어깨를 오래 안았다.'; }},
    ]}};
LOVERS.raon = {id:'raon', name:'강라온', age:'23', job:'스타라이트 엔터 선배 보이그룹 「노바」 센터', like:'charm', meet:99999, hint:'같은 소속사 선배 그룹에 있어요. 연습생이 되자마자 부딪힐지도 몰라요',
  // 연습생 초기(m1~6)에는 혐관 이벤트(special_b.js)로 만난다. 그때를 놓쳤으면 나중에 평범하게 만난다.
  meetOk:S => S.m >= 8 && !S.seen.sp_raon_1,
  intro:'소속사 복도 모퉁이에서 마스크를 쓴 청년과 부딪혔다. 모자 아래로 보이는 라일락빛 머리카락. 같은 소속사 선배 그룹 노바의 센터, 라온이었다. “죄송해요… 혹시 지금 본 거, 비밀로 해 줄래요?”',
  dateLines:['마스크와 모자로 꽁꽁 싸맨 그가 포장마차 구석에 앉아 어묵을 호호 불었다. “이렇게 평범하게 먹는 거 오랜만이에요.”', '심야 편의점 앞 벤치. 그가 이어폰 한쪽을 내 귀에 꽂아 주었다. 아직 발매 전인 노래가 흘러나왔다.', '연습실 뒤편에서 몰래 만났다. 화려한 조명 아래의 그가 아니라, 땀에 젖은 머리를 쓸어 올리는 평범한 청년의 얼굴이었다.'],
  trial:{title:'열애 의혹', text:'새벽, 오 실장이 급하게 전화를 걸었다. 우리가 함께 있는 사진이 커뮤니티에 올라왔다. 노바의 컴백을 앞둔 시기다. 팬들의 댓글이 불길처럼 번지고 있다.',
    choices:[
      {label:'그의 곁에서 함께 견딘다', sub:'관계 +4 · 스트레스 + · 호감 +6 · 스캔들 위험↑', run(S, v, ch){ addAff(S, 'raon', 6, ch); fx(S, {bond:4, stress:9, self:1}, ch); addScandal(S, isIdol(S) ? 18 : 6, ch); return '“저는 이 사람을 좋아합니다.” 라온이 직접 올린 짧은 글이 화제가 되었다. 한동안 악플이 이어졌지만 그의 손은 한 번도 놓이지 않았다.'; }},
      {label:'잠시 거리를 두자고 한다', sub:'호감 -6 · 스트레스 +4', run(S, v, ch){ addAff(S, 'raon', -6, ch); fx(S, {stress:4, self:2}, ch); return '“컴백 끝날 때까지만.” 그는 입술을 깨물며 고개를 끄덕였다. 약속은 지켜질까. 휴대폰 속 마지막 메시지가 오래 마음에 남았다.'; }},
      {label:'조용히 사진을 내려 달라고 부탁한다', sub:'스트레스 +3 · 스캔들 위험', run(S, v, ch){ fx(S, {stress:3, work:1}, ch); if(isIdol(S)) addScandal(S, 5, ch); return '소속사 쪽에서 신속하게 정리해 주었다. 해결은 되었지만 우리 사이엔 보이지 않는 선이 하나 더 생겼다.'; }},
    ]}};
const LOVER_IDS = Object.keys(LOVERS);
// 첫 만남 조건: meetOk 가 있으면 그것을, 없으면 달(meet)을 본다
const lvCanMeet = (lv, S) => { try{ return lv.meetOk ? !!lv.meetOk(S) : S.m >= lv.meet; }catch(e){ return false; } };

function meetEvent(S, id){
  const lv = LOVERS[id];
  return {id:'meet_' + id, lover:id, once:true, speaker:lv.name, title:'새로운 인연', place:'city', img:'art/lv_' + id + '.webp',
    text:S => lv.intro,
    choices:[
      {label:'말을 걸어 본다', sub:'호감 +12', run(S){ const ch = []; S.love[id] = {aff:12, stage:-1, since:S.m}; S.last.bond = S.m; if(id === 'jaewoo') bump(S, 'clarity', -3, ch); push(ch, lv.name + ' 호감', 12); return {text:`${josa(lv.name, '과', '와')} 처음으로 길게 이야기했다. 어색한 인사가 어느새 웃음이 되었다.`, chips:ch}; }},
      {label:'멀리서 지켜본다', sub:'아직은 거리를 둔다', run(S){ const ch = []; S.love[id] = {aff:4, stage:-1, since:S.m}; fx(S, {self:1.5}, ch); return {text:'아직은 마음의 준비가 되지 않았다. 하지만 시선은 한참 그를 따라갔다.', chips:ch}; }},
      id === 'jaewoo' ? {label:'일부러 피한다', sub:'같은 실수는 안 한다 · 선명도 -5', run(S){ const ch = []; S.love[id] = {aff:0, stage:-1, since:S.m, avoided:true}; fx(S, {clarity:-5, self:2}, ch); return {text:'나는 길을 돌아갔다. 마흔의 상처가 스물의 나를 먼저 움직였다.', chips:ch}; }}
        : {label:'지나친다', sub:'인연이 아닐지도', run(S){ const ch = []; S.love[id] = {aff:0, stage:-1, since:S.m}; return {text:'고개를 숙이고 지나쳤다. 그래도 어디선가 다시 마주칠 것 같았다.', chips:ch}; }},
    ]};
}

function confessEvent(S, id){
  const lv = LOVERS[id], v = S.love[id];
  return {id:'confess_' + id, lover:id, once:true, speaker:lv.name, title:'고백', place:'night', img:'art/lv_' + id + '.webp',
    text:S => `${lv.name}의 목소리가 평소보다 낮았다. “나, 너 좋아해. 사귀자.”${isIdol(S) ? ' 데뷔한 몸이라는 사실이 머릿속을 스쳤다. 들키면 열애설이다.' : isTrainee(S) ? ' 연습생 계약서의 연애 금지 조항이 머릿속을 스쳤다.' : ''}`,
    choices:[
      {label:'받아들인다', sub:isIdol(S) ? '공식 연인이 된다 · 스캔들 위험' : '공식 연인이 된다', run(S){ const ch = []; v.stage = 1; v.since2 = S.m; v.lastDate = S.m; S.partner = id; fx(S, {bond:3, stress:-6}, ch); if(isIdol(S)) addScandal(S, id === 'raon' ? 6 : 3, ch); if(id === 'jaewoo' && !v.avoided) push(ch, '※ 서재우의 습관을 지켜볼 것', 0.1); S.album.push(`${josa(lv.name, '과', '와')} 연인이 됨`); for(const o in S.love) if(o !== id && S.love[o].stage === -1) S.love[o].aff = Math.min(S.love[o].aff, 44); return {text:'“…응.” 대답은 짧았지만 가슴은 그렇지 않았다. 마흔의 나는 몰랐던 종류의 두근거림이었다.', chips:ch}; }},
      {label:'아직은 아니라고 한다', sub:'호감 -10 · 한동안 연락이 끊긴다', run(S){ const ch = []; addAff(S, id, -10, ch); v.refused = (v.refused || 0) + 1; v.stage = -2; v.rejectedAt = S.m; return {text:'“시간을 조금만 줘.” 그는 고개를 끄덕였다. 기다려 줄 사람인지는 모르겠다.', chips:ch}; }},
    ]};
}

function trialEvent(S, id){
  const lv = LOVERS[id], v = S.love[id], t = lv.trial;
  return {id:'trial_' + id, lover:id, once:true, speaker:lv.name, title:t.title, place:'night', img:'art/lv_' + id + '.webp',
    text:S => t.text,
    choices:t.choices.map(c => ({label:c.label, sub:c.sub, run(S){ const ch = []; const text = c.run(S, v, ch); return {text, chips:ch}; }}))};
}

// 프로포즈 장면 도입(그림 한 장 + 한 줄): 인물마다 장소와 방식이 다르다
const PROPOSE_LINES = {
  _:n => `${n}가 걸음을 멈추고 주머니에서 작은 상자를 꺼냈다. 손이 떨리고 있다. “오래 연습했는데, 하나도 생각이 안 나.” 뚜껑이 열리자 작은 반지가 불빛을 받아 반짝였다.`,
  jaewoo:n => `공연이 끝난 밤 한강 다리 위, 재우가 기타 케이스를 내려놓고 갑자기 무릎을 꿇는다. “나 지금 셋리스트에도 없는 짓 하는 거 알지?” 눈이 사라지도록 웃던 얼굴이 처음으로 울 것 같다. 열린 상자 안에서 반지가 야경을 받아 반짝인다.`,
  minjun:n => `민준이 책상 위 작은 건축 모형을 내 앞으로 밀었다. “지붕, 열어 봐요.” 조심스레 지붕을 들어 올리자 모형 안방에 반지가 놓여 있었다. 그가 귀 끝까지 빨개져서 말했다. “이 집에서, 같이 살아 줄래요?”`,
  hajin:n => `노을이 번지는 옥상. 하진이 노트북을 덮고 대신 작은 상자를 열었다. “계획표에 없던 일정이 하나 생겼어. 평생짜리.” 평소처럼 직설적인 말투인데 손끝이 떨리고 있다.`,
  taeoh:n => `새벽 바닷가, 푸른 빛이 막 번지는 시간. 태오가 카메라를 내려놓고 모래 위에 무릎을 꿇었다. “이건 사진으로 못 남겨요. 그래서 직접 물어보는 거예요.” 상자 속 반지가 첫 햇살을 받았다.`,
  raon:n => `불 꺼진 공연장, 객석 한가운데로 조명 한 줄기가 내려온다. 라온이 마스크를 내리고 작은 상자를 내밀었다. “무대 위에선 한 번도 안 떨었는데. 오늘은 존댓말도 안 나와. 나랑 결혼해 줄래?”`,
  jihu:n => `고층 레스토랑의 창가 자리, 야경 위로 지후가 반지 케이스를 조용히 열었다. “제가 할 수 있는 가장 정확한 말을 준비했습니다. 저와 결혼해 주시겠습니까.” 단정한 목소리가 끝에서 흔들렸다.`,
  dohyun:n => `녹화가 끝나 텅 빈 방송국 스튜디오, 조명 한 줄만 무대를 비춘다. 도현이 무대 한가운데서 작은 상자를 열었다. “이 장면은 NG 안 내고 싶다. …내 다음 시즌에도 네가 주인공이었으면 해.”`,
  sian:n => `늦은 밤 서재, 대본 위에 반지 상자가 놓여 있다. 시안이 펜을 내려놓고 말했다. “마지막 장면을 찍으려는데, 혼자서는 안 찍히더라고요. 같이 가 줄래요, 이 이야기의 끝까지.”`,
  seunghyun:n => `별장 정원에 작은 전구들이 켜져 있다. 승현이 마스크를 벗고 한쪽 무릎을 꿇었다. “대본에 없는 대사를 할게요. 연기가 아니에요. …저와 결혼해 줄래요?”`,
  geonwoo:n => `한옥 마당, 등롱 아래에서 건우가 정장을 단정히 하고 무릎을 꿇었다. “계약서처럼 정확하게 말씀드리겠습니다. 조건은 하나, 평생입니다. …승낙해 주시겠습니까.” 말끝이 서툴게 흔들렸다.`,
  yuchan:n => `밤의 거실, 모니터 불빛 속에서 유찬이 키보드 옆에 작은 상자를 올려놓았다. “…저 지금 예외 처리가 하나도 안 돼요. 그냥 말할게요. 같이 살아요, 우리.” 귀가 새빨갛다.`,
  ujin:n => `아틀리에, 직접 지은 하얀 드레스가 걸린 앞에서 우진이 상자를 열었다. “이 옷을 입을 사람이 한 명밖에 안 떠올랐어요. 반지는 맞는 치수로 골랐고요.” 그의 눈이 색을 고를 때처럼 조용히 빛난다.`,
};
function proposeEvent(S, id){
  const lv = LOVERS[id], v = S.love[id];
  const ev = {id:'propose_' + id, lover:id, once:true, speaker:lv.name, title:'평생의 약속', place:'night', img:'art/lv_' + id + '.webp',
    text:S => `“우리, 같이 살자.” 마흔의 나는 이 질문 뒤의 이십 년을 안다.${isIdol(S) ? ' 그리고 지금의 나는 팬들 앞에 서는 사람이다.' : ''} 지금의 나는 어떤 대답을 하고 싶은가.`,
    choices:[
      {label:'응, 약속해', sub:'결혼 약속 · 관계 대폭 상승', run(S){ const ch = []; v.stage = 2; S.engaged = true; v.engagedAt = S.m; fx(S, {bond:7, stress:-8}, ch); S.album.push(`${josa(lv.name, '과', '와')} 결혼을 약속함`); return {text:'반지가 손가락에 들어갔다. 이번에는 도장이 아니라 손을 잡았다.', chips:ch}; }},
      {label:'나를 먼저 세우고 싶어', sub:'관계는 유지 · 마음 +4', run(S){ const ch = []; addAff(S, id, -8, ch); fx(S, {self:4}, ch); return {text:'그는 잠시 말이 없다가 상자를 닫았다. “기다릴게.” 그 말이 고마웠고 조금 무거웠다.', chips:ch}; }},
    ]};
  const pimg = [`art/pr_${id}.webp`, `art/lv_${id}.webp`]; ev.img = pimg; ev.beats = [(PROPOSE_LINES[id] || PROPOSE_LINES._)(lv.name)]; ev.beatImgs = [pimg, pimg];
  return ev;
}

function breakupEvent(S, id){
  const lv = LOVERS[id], v = S.love[id];
  return {id:'fade_' + id, lover:id, once:true, speaker:lv.name, title:'멀어지는 마음', place:'night', img:'art/lv_' + id + '.webp',
    text:S => `${lv.name}와의 연락이 뜸해진 지 오래다. 스케줄에 밀려 데이트도 없이 계절이 지나갔다. 오늘 그가 먼저 말했다. “우리, 이제 그만할까?”`,
    choices:[
      {label:'붙잡는다', sub:'노력으로 한 번 더', run(S){ const ch = []; v.aff = 40; v.fading = false; v.lastDate = S.m; fx(S, {stress:6}, ch); return {text:'“한 번만 더 해 보자.” 그는 한참 뒤에야 고개를 끄덕였다.', chips:ch}; }},
      {label:'받아들인다', sub:'이별', run(S){ const ch = []; v.stage = -9; S.partner = null; S.engaged = false; fx(S, {bond:-5, stress:8, self:2}, ch); S.album.push(`${josa(lv.name, '과', '와')} 이별`); return {text:'“그래. 고마웠어.” 마지막 인사는 담담했다. 눈물은 숙소에 가서야 났다.', chips:ch}; }},
    ]};
}


// ── 서재우: 인디밴드 기타리스트. 레이블 계약 → 합주와 뒤풀이 → 일본 진출 제안 ───────
// 내가 지금 붙들고 있는 일: 데뷔했으면 활동, 연습생이면 연습, 무소속이면 오디션 준비
const _jwMine = S => isIdol(S) ? '활동' : isTrainee(S) ? '연습' : '오디션 준비';
function jaewooEvent(S){
  const v = S.love.jaewoo; if(!v || v.stage === -9) return null;
  const lv = LOVERS.jaewoo, img = 'art/lv_jaewoo.webp';
  // 1) 레이블 계약 소식 (2018년 3월)
  if(S.m >= 24 && !S.seen.jaewoo_hire) return {id:'jaewoo_hire', lover:'jaewoo', once:true, speaker:lv.name, title:'레이블 계약', place:'cafe', img,
    text:S => `${lv.name}의 밴드가 작은 인디 레이블과 계약했다. 마흔의 내가 기억하는 그해의 그 계약이다. “여기서 이름 알려서 언젠가 내 노래로 큰 무대에 설 거야. 그때까지만 네가 좀 도와줘.” 그가 새 기타 스트랩을 만지며 웃었다. ‘그때까지만’이라는 말을 나는 이십 년 동안 들었다.`,
    choices:[
      {label:'진심으로 축하한다', sub:'호감 +6', run(S){ const ch = []; addAff(S, 'jaewoo', 6, ch); return {text:'“고마워. 네가 제일 먼저 말해 줘서 기뻐.” 그의 눈이 초승달처럼 접혔다. 그 웃음을 오래 보고 싶었다.', chips:ch}; }},
      {label:'“내 꿈도 같이 얘기하자”고 말한다', sub:'멘탈 +1 · 호감 -2', run(S){ const ch = []; addAff(S, 'jaewoo', -2, ch); fx(S, {ins:1, self:1}, ch); return {text:'“그럼, 그럼.” 그는 건성으로 웃어넘겼다. 나는 이 대화의 끝을 알고 있어서 더 말하지 못했다.', chips:ch}; }},
    ]};
  // 2) 합주와 뒤풀이 (계약 3년 차, 연인일 때)
  if(v.stage >= 1 && S.seen.trial_jaewoo && S.m >= 54 && !S.seen.jaewoo_overwork) return {id:'jaewoo_overwork', lover:'jaewoo', once:true, speaker:lv.name, title:'합주와 뒤풀이', place:'night', img,
    text:S => v.fixed
      ? `${lv.name}가 공연 뒤풀이에서 늦게 돌아와 비틀거리며 말했다. “미안, 내 노래에 매달리느라… 네 얘기를 듣는다고 해 놓고 못 들었네. 오늘은 네 얘기부터 해 줘.” 그는 예전과 달리 먼저 사과를 시작한다.`
      : `${lv.name}가 새벽 두 시에 들어와 기타 케이스를 내려놓으며 말했다. “이게 다 우리 미래를 위한 거야. 내 노래가 뜨면 너도 행복해질 거고. 그러니까 네가 좀 참아 줘.” 마흔의 이혼 서류 앞에서 들었던 그 목소리와 똑같다.`,
    choices: v.fixed ? [
      {label:'따뜻한 국을 끓여 둔다', sub:'호감 +6 · 관계 +2', run(S){ const ch = []; addAff(S, 'jaewoo', 6, ch); fx(S, {bond:2, stress:-3}, ch); return {text:'“이거… 네가 한 거야?” 그가 국을 한 숟갈 뜨고는 한참 말이 없었다. “다음엔 나도 일찍 올게.”', chips:ch}; }},
      {label:'서로의 꿈을 번갈아 응원하기로 정한다', sub:'멘탈 +2 · 호감 +4', run(S){ const ch = []; addAff(S, 'jaewoo', 4, ch); fx(S, {ins:2, self:2}, ch); return {text:'둘이 달력을 펴 놓고 이번 달은 그의 공연, 다음 달은 내 무대라고 적었다. 이런 대화가 가능한 사람이 되었다는 사실이 나를 울컥하게 했다.', chips:ch}; }},
    ] : [
      {label:'오늘도 내가 참는다', sub:'마음 -2 · 스트레스 +5 · 호감 -2', run(S){ const ch = []; addAff(S, 'jaewoo', -2, ch); fx(S, {self:-2, stress:5}, ch); return {text:'나는 또 삼켰다. 아침에 그는 이미 합주실로 나간 뒤였고, 식은 커피 잔만 식탁 위에 놓여 있었다.', chips:ch}; }},
      {label:'“내 인생은 네 꿈의 부속품이 아니야”라고 말한다', sub:'팬소통이 높을수록 좋다', run(S){ const ch = []; const ok = S.st.neg + rand(-12, 16) >= 50; if(ok){ v.fixed = true; addAff(S, 'jaewoo', 6, ch); fx(S, {self:3, neg:1.5}, ch); return {text:'“내가 서운한 건 공연이 아니라, 내 인생을 네 꿈 뒤에 두라고 하는 거야.” 그는 한참 뒤에 고개를 숙였다. “…내가 또 그랬구나.” 이번에는 변할 수 있을 것 같았다.', chips:ch}; } addAff(S, 'jaewoo', -7, ch); fx(S, {stress:8}, ch); return {text:'“네가 날 응원 안 해 주면 누가 해?” 그는 방을 나가 버렸다. 문 닫히는 소리가 마흔의 그날과 겹쳤다.', chips:ch}; }},
    ]};
  // 3) 일본 레이블 제안 (계약 5~6년 차, 연인일 때)
  if(v.stage >= 1 && S.m >= 84 && !S.seen.jaewoo_posting){
    const T = _jwMine(S), penalty = isIdol(S) ? -6 : -3;
    return {id:'jaewoo_posting', lover:'jaewoo', once:true, speaker:lv.name, title:'도쿄에서 온 제안', place:'night', img,
      text:S => v.fixed
        ? `${lv.name}가 메일 한 통을 들고 와서 먼저 나를 앉혔다. “도쿄 레이블이야. 3년. 내 노래에 한 걸음 가까워지는 자리지만, 결정하기 전에 너한테 먼저 말하고 싶었어. 네 ${T}도 네 꿈이잖아. 같이 방법을 찾자.”`
        : `${lv.name}가 들뜬 표정으로 말했다. “도쿄 레이블이랑 계약했어! 내 꿈의 첫걸음이야. 당연히 같이 가는 거지? 네 일은 어디서든 할 수 있잖아.” 내 ${T}에 대해서는 한마디도 묻지 않았다. 마흔의 그때와 똑같은 말이다.`,
      choices: v.fixed ? [
        {label:'같이 가서 방법을 찾는다', sub:`실력 ${penalty} · 관계 +6 · 호감 +8`, run(S){ const ch = []; addAff(S, 'jaewoo', 8, ch); fx(S, {work:penalty, bond:6, dare:1.5}, ch); S.album.push('서재우를 따라 도쿄로 감'); return {text:`${isIdol(S) ? '활동은 잠시 멈추고 휴식기를 선언했다.' : '연습은 도쿄의 작은 연습실에서 이어 가기로 했다.'} 이번엔 우리가 같이 정한 결정이었다. 공항에서 그가 내 손을 꼭 잡았다.`, chips:ch}; }},
        {label:'장거리 연애로 이어 간다', sub:'호감 -4 · 마음 +2', run(S){ const ch = []; addAff(S, 'jaewoo', -4, ch); fx(S, {self:2, stress:4}, ch); return {text:'“3년, 기다려 줄 수 있어?” “네가 돌아오는 날을 세어 볼게.” 우리는 시차 없는 같은 달을 보기로 했다.', chips:ch}; }},
        {label:'내 길을 택하고 헤어진다', sub:'실력 +2 · 이별', run(S){ const ch = []; v.stage = -9; S.partner = null; S.engaged = false; fx(S, {work:2, self:3, bond:-5}, ch); return {text:'“고마워. 먼저 물어 봐 줘서.” 그는 울면서 웃었다. 우리는 서로를 위해 갈라서는 방법을 처음으로 배웠다.', chips:ch}; }},
      ] : [
        {label:'“내 꿈은 어떡하고?”라고 되묻는다', sub:'멘탈이 높을수록 그가 바뀐다', run(S){ const ch = []; const ok = S.st.ins + rand(-10, 16) >= 52; if(ok){ v.fixed = true; addAff(S, 'jaewoo', 5, ch); fx(S, {self:4, work:1}, ch); return {text:'그가 처음으로 말을 멈췄다. “…내가 네 꿈은 생각 못 했네. 미안.” 우리는 밤새 방법을 의논했다.', chips:ch}; } addAff(S, 'jaewoo', -9, ch); fx(S, {stress:9}, ch); return {text:'“네 일은 어디서든 할 수 있잖아.” 그가 무심히 말했다. 같은 말을 이십 년 뒤에도 들을 것 같았다.', chips:ch}; }},
        {label:'따라간다', sub:`실력 ${penalty - 1} · 마음 -4 · 호감 +4`, run(S){ const ch = []; addAff(S, 'jaewoo', 4, ch); fx(S, {work:penalty - 1, self:-4, stress:6}, ch); S.album.push('서재우를 따라 도쿄로 감'); return {text:'나는 또 내 꿈을 접고 짐을 쌌다. 마흔의 나와 다른 점은 이 선택을 알고 있다는 것뿐이었다.', chips:ch}; }},
        {label:'헤어진다', sub:'실력 +2 · 이별', run(S){ const ch = []; v.stage = -9; S.partner = null; S.engaged = false; fx(S, {work:2, self:4, bond:-5, stress:6}, ch); return {text:'“이번에는 내 꿈을 포기하지 않을 거야.” 그는 이해하지 못했지만 나는 처음으로 이 장면의 끝을 내 손으로 바꿨다.', chips:ch}; }},
      ]};
  }
  // 4) 우연한 재회 (연인이 아닐 때)
  if(v.stage === -1 && !S.partner && S.m >= 60 && !S.seen.jaewoo_reunion) return {id:'jaewoo_reunion', lover:'jaewoo', once:true, speaker:lv.name, title:'우연한 재회', place:'cafe', img,
    text:S => `${isIdol(S) ? '스케줄을 마치고 모자를 눌러쓴 채 걷던 합정역 근처' : '합정역 근처'}에서 기타 케이스를 멘 ${lv.name}와 마주쳤다. 레이블 명함을 내미는 그는 클럽에서 노래하던 때보다 조금 지쳐 보였다. “오랜만이다. 시간 되면 커피 한 잔 할래?”`,
    choices:[
      {label:'커피를 마신다', sub:isIdol(S) ? '호감 +8 · 스캔들 위험' : '호감 +8', run(S){ const ch = []; addAff(S, 'jaewoo', 8, ch); fx(S, {stress:-3}, ch); if(isIdol(S)) addScandal(S, 2, ch); return {text:'음악 얘기, 사는 얘기. 그는 이야기를 끊지 않고 끝까지 들었다. 마흔의 그와 다른 사람 같아서 조금 놀랐다.', chips:ch}; }},
      {label:'인사만 하고 헤어진다', sub:'변화 없음', run(S){ return {text:'명함을 받고 바쁜 걸음으로 지나쳤다. 뒤돌아봤을 때 그는 아직 그 자리에 서 있었다.', chips:[]}; }},
    ]};
  return null;
}

// 이번 달에 나올 연애 이벤트 하나 (우선순위 순)
function loveEvent(S){
  const L = S.love;
  const jw = jaewooEvent(S); if(jw) return jw;
  for(const id of LOVER_IDS){ const lv = LOVERS[id]; if(L[id] || S.seen['meet_' + id]) continue; if(lvCanMeet(lv, S)) return meetEvent(S, id); }
  for(const id of LOVER_IDS){ const v = L[id]; if(!v) continue;
    const sec = S.secret && S.secret[id];
    if(v.stage >= 1 && v.stage <= 2 && v.fading && !sec && !S.seen['fade_' + id]) return breakupEvent(S, id);
    if(v.stage === -1 && v.aff >= 40 && !S.seen['confess_' + id]) return officialOf(S) ? secretConfessEvent(S, id) : confessEvent(S, id);
    if(v.stage === 1 && !sec && S.m - v.since2 >= 9 && !S.seen['trial_' + id]) return trialEvent(S, id);
    if(v.stage === 1 && !sec && S.seen['trial_' + id] && S.m - v.since2 >= 24 && S.m >= 54 && v.aff >= 70 && !S.seen['propose_' + id]) return proposeEvent(S, id);
  }
  return (typeof regretEvent !== 'undefined' && regretEvent(S)) || (typeof menFightEvent !== 'undefined' && menFightEvent(S)) || romance3Event(S) || (typeof specialDue !== 'undefined' && specialDue(S)) || (typeof loverStoryEvent !== 'undefined' && loverStoryEvent(S)) || (typeof milestoneEvent !== 'undefined' && milestoneEvent(S)) || romEvent(S) || rom2Event(S);
}
