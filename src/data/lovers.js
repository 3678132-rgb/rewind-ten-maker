// 연애 인물과 이벤트 생성 (ENGINE 구간 안, DOM 금지)
const LOVERS = {
  jaewoo: {id:'jaewoo', name:'서재우', age:'22', job:'동아리 선배 · 경영학과', like:'neg', meet:14,
    intro:'마흔의 나와 이혼 서류에 도장을 찍었던 사람. 그런데 눈앞의 그는 아직 아무 잘못도 하지 않은, 웃을 때 눈이 사라지는 스물두 살이다.',
    dateLines:['학교 앞 분식집. 그가 내 접시에 계란말이를 슬쩍 올려 준다. 똑같은 버릇이다.', '도서관 옥상에서 노을을 봤다. 이 사람은 원래 이렇게 다정했었다.', '“넌 가끔 나보다 어른 같아.” 그가 웃었다. 나는 대답 대신 웃었다.'],
    trial:{title:'같은 말투', text:'그가 약속을 잊고는 “그럴 수도 있지, 뭘 그렇게 따져?”라고 말했다. 이혼 서류 앞에서 들었던 바로 그 문장이다.',
      choices:[
        {label:'이번엔 제대로 말한다', sub:'협상·통찰이 높을수록 그가 바뀐다', run(S, v, ch){ const ok = (S.st.neg + S.st.ins) / 2 + rand(-10, 15) >= 50; if(ok){ v.fixed = true; addAff(S, 'jaewoo', 6, ch); fx(S, {self:3, bond:2}, ch); return '“…네 말이 맞아. 미안해.” 그는 처음으로 변명 없이 사과했다. 같은 길이 아니라는 확신이 들었다.'; } addAff(S, 'jaewoo', -8, ch); fx(S, {stress:10}, ch); return '말은 했지만 그는 고개를 끄덕일 뿐이었다. 알겠다. 이 사람은 아직 모르는 거다.'; }},
        {label:'참고 넘어간다', sub:'결국 같은 결말로 갈 수 있다', run(S, v, ch){ addAff(S, 'jaewoo', 2, ch); fx(S, {self:-3, stress:5}, ch); return '나는 또 웃으며 넘겼다. 이 장면을 안다. 그래서 더 무서웠다.'; }},
        {label:'이별을 말한다', sub:'아프지만 다른 길을 연다', run(S, v, ch){ v.stage = -9; S.partner = null; fx(S, {self:4, bond:-4, stress:8}, ch); return '“미안해. 우린 여기까지야.” 그는 이유를 몰랐고, 나는 말해 줄 수 없었다. 대신 이번엔 내가 먼저 걸어 나왔다.'; }},
      ]},
  },
  minjun: {id:'minjun', name:'한민준', age:'20', job:'고향 친구 · 건축학과', like:'ins', meet:2,
    intro:'마흔의 나는 어느새 연락이 끊겼던 오랜 친구. 군대 가기 전 마지막 학기, 그는 여전히 서툰 손으로 도시락을 내민다.',
    dateLines:['그가 도면 그리는 걸 구경했다. 선 하나에도 고집이 보였다.', '한강에서 자전거를 탔다. 그는 넘어질 때까지 앞서가려 했다.', '“너 요즘 좀 달라졌어.” “좋은 쪽으로?” “…응.”'],
    trial:{title:'입대 통지서', text:'민준에게 입영 통지서가 나왔다. 기다려 달라는 말은 끝내 못 하고, 그는 도시락 가방만 만지작거렸다.',
      choices:[
        {label:'기다리겠다고 말한다', sub:'기다림이 관계를 단단하게 한다', run(S, v, ch){ addAff(S, 'minjun', 8, ch); fx(S, {bond:3, stress:5}, ch); return '“편지 쓸게. 답장 안 해도 돼.” 그가 처음으로 환하게 웃었다.'; }},
        {label:'각자 길을 가자고 한다', sub:'마음이 식는다', run(S, v, ch){ v.stage = -9; S.partner = null; fx(S, {bond:-4, self:2}, ch); return '그는 이해한다고 말했지만, 도시락 가방은 끝내 돌아오지 않았다.'; }},
      ]},
  },
  hajin: {id:'hajin', name:'윤하진', age:'27', job:'스타트업 대표 · 선배', like:'dare', meet:30,
    intro:'학교 특강에 온 젊은 창업가. 내가 아는 미래에서 그의 회사는 큰 성공을 한다. 하지만 지금 그는 라면으로 끼니를 때우는 사람일 뿐이다.',
    dateLines:['야근하는 사무실에서 같이 배달 음식을 먹었다. 이 사람의 꿈은 소리가 크다.', '“넌 왜 항상 답을 아는 사람처럼 말해?” 나는 웃으며 얼버무렸다.', '그의 노트북엔 내가 아는 이름의 서비스가 막 태어나고 있었다.'],
    trial:{title:'투자와 진심', text:'하진이 투자 유치 직전 위기에 빠졌다. 나는 이 회사가 어떻게 될지 알고 있다. 미래를 말해 줄까, 말아야 할까.',
      choices:[
        {label:'아는 걸 힌트로 흘린다', sub:'도움이 되지만 기억이 닳는다', run(S, v, ch){ addAff(S, 'hajin', 8, ch); fx(S, {clarity:-8}, ch); S.borrowed++; return '그는 눈을 빛내며 방향을 틀었다. 회사는 살아났다. 내 기억은 흐려졌다.'; }},
        {label:'미래는 숨기고 옆에서 응원한다', sub:'진짜 신뢰가 쌓인다', run(S, v, ch){ addAff(S, 'hajin', 6, ch); fx(S, {self:3, bond:2, stress:4}, ch); return '“안 되면 같이 라면 먹자.” 그는 웃다가 조용히 내 손을 잡았다.'; }},
      ]},
  },
  taeoh: {id:'taeoh', name:'은태오', age:'28', job:'사진작가 · 여행길에서 만남', like:'sense', meet:44,
    intro:'모든 걸 천천히 보는 사람. 마흔의 내가 한 번도 가져 본 적 없는 속도로 사는 사람이 카메라를 들고 서 있다.',
    dateLines:['필름 카메라로 내 뒷모습을 찍었다. 어떻게 나왔는지는 비밀이란다.', '아무 계획 없이 기차를 탔다. 계획이 없는 하루가 이렇게 긴 줄 몰랐다.', '“서두르지 않아도 늦지 않아요.” 그의 말이 오래 남았다.'],
    trial:{title:'떠나는 사람', text:'태오가 해외 프로젝트 제안을 받았다고 했다. 반년이 될지 몇 년이 될지 모른다. 그는 내 대답을 기다린다.',
      choices:[
        {label:'다녀오라고 등을 민다', sub:'서로를 더 단단하게', run(S, v, ch){ addAff(S, 'taeoh', 7, ch); fx(S, {self:4, stress:4}, ch); return '“돌아오면 제일 먼저 찍어 줄게.” 그는 공항에서 오래 손을 흔들었다.'; }},
        {label:'같이 가고 싶다고 말한다', sub:'일과 시간이 흔들린다', run(S, v, ch){ addAff(S, 'taeoh', 10, ch); fx(S, {work:-3, bond:3, dare:1}, ch); return '“진심이에요?” 그는 놀란 얼굴로 웃었다. 우리의 속도가 조금씩 맞춰졌다.'; }},
        {label:'헤어지는 편이 낫다고 말한다', sub:'아프지만 깔끔하게', run(S, v, ch){ v.stage = -9; S.partner = null; fx(S, {bond:-4, self:2}, ch); return '“그렇게 말할 줄 알았어요.” 그는 쓸쓸히 웃고 돌아섰다.'; }},
      ]},
  },
};

// ── 직장 연애: 직업마다 같은 일터의 상대가 1명 (직업 확정 2개월 뒤에 만난다) ──
LOVERS.jihu = {id:'jihu', career:'beauty', name:'한지후', age:'31', job:'루미에르 코스메틱 · 브랜드 매니저', like:'neg',
  intro:'신제품 론칭팀의 팀장. 회의실에서는 말수가 적은데, 숫자와 사람을 동시에 정확히 읽는 사람이다. 첫 회의에서 내 기획안에 딱 한 줄만 적었다. “이 방향, 좋습니다.”',
  dateLines:['성수동 카페에서 캠페인 아이디어를 주고받았다. 일 얘기인데 이상하게 설렜다.', '야근 후 편의점 앞에서 맥주 한 캔. “오늘 PT, 멋있었어요.” 그가 처음으로 웃었다.', '신제품 샘플 향을 번갈아 맡으며 웃었다. 이 사람 앞에서는 일이 놀이가 된다.'],
  trial:{title:'사내 연애 방침', text:'회사 규정상 같은 팀 연애는 인사팀에 보고해야 하고, 한 사람은 다른 부서로 옮겨야 한다. 지후가 조용히 말했다. “네가 정해. 난 어느 쪽이든 따를게.”',
    choices:[
      {label:'내가 다른 부서로 옮긴다', sub:'일 -3 · 호감 +8 · 관계 +3', run(S, v, ch){ addAff(S, 'jihu', 8, ch); fx(S, {work:-3, bond:3}, ch); return '새 부서는 낯설었지만 퇴근 시간은 같았다. 일은 조금 늦춰졌고, 사람은 곁에 남았다.'; }},
      {label:'비밀로 이어 간다', sub:'스트레스 +8 · 호감 +4', run(S, v, ch){ addAff(S, 'jihu', 4, ch); fx(S, {stress:8, bond:1}, ch); return '복도에서 마주칠 때마다 모르는 척했다. 들킬까 봐 두근거리는 마음이 반은 설렘, 반은 불안이었다.'; }},
      {label:'일을 위해 정리한다', sub:'일 +2 · 이별', run(S, v, ch){ v.stage = -9; S.partner = null; fx(S, {work:2, bond:-4, stress:6}, ch); return '“…그래, 우린 좋은 동료로 남자.” 지후는 고개를 끄덕였지만 한동안 눈을 마주치지 못했다.'; }},
    ]}};
LOVERS.dohyun = {id:'dohyun', career:'pd', name:'차도현', age:'33', job:'아크 스튜디오 · 메인 PD', like:'dare',
  intro:'새벽 세 시에도 모니터 앞에서 컷을 고르는 메인 PD. 말은 거칠지만 스태프 이름을 전부 외우는 사람. 첫 촬영 날 내가 놓친 컷을 대신 메워 주었다.',
  dateLines:['촬영 끝난 새벽, 분식집에서 떡볶이를 먹었다. “이 시간이 제일 맛있어.” 그가 웃었다.', '편집실에서 같은 화면을 한참 봤다. 그는 어깨를 가까이 대고도 모른 척했다.', '비 오는 촬영장 구석, 그의 재킷이 내 머리 위로 올라왔다.'],
  trial:{title:'편성과 약속', text:'우리 프로그램이 폐지 위기다. 도현은 밤샘 촬영 때문에 중요한 기념일을 또 잊었다. 그는 미안한 눈으로 말했다. “이번 주만 더 하면 돼.”',
    choices:[
      {label:'도시락을 들고 촬영장에 간다', sub:'호감 +8 · 일 +2', run(S, v, ch){ addAff(S, 'dohyun', 8, ch); fx(S, {work:2, stress:3}, ch); return '스태프들 앞에서 도시락을 내밀자 그가 처음으로 얼굴이 빨개졌다. 그날 촬영은 유난히 순조로웠다.'; }},
      {label:'서운함을 솔직히 말한다', sub:'협상·통찰이 높을수록 좋다', run(S, v, ch){ const ok = (S.st.neg + S.st.ins) / 2 + rand(-10, 15) >= 48; if(ok){ addAff(S, 'dohyun', 6, ch); fx(S, {self:3}, ch); return '“미안. 내가 일에 취해서…” 그는 휴대폰 캘린더에 기념일을 적었다. 처음 보는 모습이었다.'; } addAff(S, 'dohyun', -6, ch); fx(S, {stress:7}, ch); return '“지금 그 얘기를 해야겠어?” 말이 어긋나 버렸다. 서로 식은 커피만 바라봤다.'; }},
      {label:'당분간 쉬자고 한다', sub:'이별', run(S, v, ch){ v.stage = -9; S.partner = null; fx(S, {bond:-4, self:2}, ch); return '“일이 끝나면 다시 얘기하자.” 그는 대답하지 못했고, 촬영 종료 후에도 연락은 오지 않았다.'; }},
    ]}};
LOVERS.sian = {id:'sian', career:'writer', name:'유시안', age:'32', job:'KBC 방송국 · 드라마 감독', like:'sense',
  intro:'내 대본을 연출하게 될 감독. 대본 리딩 날, 첫 줄을 읽고는 한참 말이 없더니 “이 대사, 누가 쓴 거예요?”라고 물었다. 손을 든 건 나였다.',
  dateLines:['한강 둔치에서 대본을 소리 내어 읽었다. 그의 목소리가 대사에 입혀지자 소름이 돋았다.', '새벽 편집실, 그는 내 대사 한 줄을 일곱 번 다르게 연출했다. 모두 아름다웠다.', '“작가님 덕분에 이 드라마가 좋아요.” 그의 말에 오래 가슴이 따뜻했다.'],
  trial:{title:'내 대본, 그의 연출', text:'8회 대본을 두고 시안이 결말을 바꾸자고 했다. 내가 가장 아끼는 장면이다. 방송 일정은 촉박하고, 우리는 연인이다.',
    choices:[
      {label:'내 대본을 고집한다', sub:'일 +3 · 호감 -4', run(S, v, ch){ addAff(S, 'sian', -4, ch); fx(S, {work:3, sense:1, stress:5}, ch); return '“작가는 나예요.” 단호한 말에 회의실이 조용해졌다. 결말은 지켰지만 그의 얼굴이 굳었다.'; }},
      {label:'그의 안을 받아들인다', sub:'호감 +6 · 일 -1', run(S, v, ch){ addAff(S, 'sian', 6, ch); fx(S, {work:-1, bond:2}, ch); return '새 결말은 낯설었지만 화면에서는 이상하게 더 울림이 있었다. 시안이 조용히 내 손을 잡았다.'; }},
      {label:'함께 절충안을 만든다', sub:'통찰이 높을수록 좋다', run(S, v, ch){ const ok = S.st.ins + rand(-12, 14) >= 48; if(ok){ addAff(S, 'sian', 8, ch); fx(S, {work:2.5, ins:1.5, self:2}, ch); return '밤새 둘이 대사를 고쳤다. 새벽 다섯 시, 마침내 둘 다 고개를 끄덕이는 결말이 나왔다.'; } addAff(S, 'sian', -2, ch); fx(S, {stress:6}, ch); return '밤새 이야기했지만 서로의 말이 엇갈렸다. 결국 반쯤 어정쩡한 결말이 되었다.'; }},
    ]}};
LOVERS.seunghyun = {id:'seunghyun', career:'actor', name:'백승현', age:'28', job:'스타라이트 엔터 · 같은 소속 배우', like:'charm',
  intro:'같은 소속의 인기 배우. 연습실에서 늦게까지 남아 있는 나를 보고 이어폰 한쪽을 건넸다. “이 노래 들으면서 하면 덜 외로워요.”',
  dateLines:['연습실 불을 끄고 둘이 바닥에 앉아 대본을 맞췄다. 그의 대사가 내게 건네질 때마다 심장이 뛰었다.', '촬영 후 야식. 모자를 눌러쓴 그가 속삭였다. “우리 이렇게 만나는 거, 비밀이에요.”', '그가 내 어깨에 기대 잠깐 졸았다. 카메라 밖의 그는 의외로 평범했다.'],
  trial:{title:'열애설', text:'새벽, 매니저가 급하게 전화했다. 우리 사진이 인터넷에 올라왔다. 소속사 대표가 둘 다 부르고 있다.',
    choices:[
      {label:'당당히 인정한다', sub:'관계 +4 · 일 -2 · 호감 +6', run(S, v, ch){ addAff(S, 'seunghyun', 6, ch); fx(S, {bond:4, work:-2, stress:6, charm:1}, ch); return '“네, 만나고 있습니다.” 짧은 입장문이 나갔다. 한동안 악플에 시달렸지만 그의 손이 내내 곁에 있었다.'; }},
      {label:'친한 선후배라고 부인한다', sub:'호감 -6 · 스트레스 +', run(S, v, ch){ addAff(S, 'seunghyun', -6, ch); fx(S, {stress:8, work:1}, ch); return '“사실무근입니다.” 말은 간단했지만, 그의 표정이 오래 어두웠다.'; }},
      {label:'침묵하며 시간을 번다', sub:'스트레스 +5', run(S, v, ch){ fx(S, {stress:5}, ch); return '며칠 동안 아무 말도 하지 않았다. 기사는 조금씩 사그라들었지만 서로 말이 줄었다.'; }},
    ]}};
LOVERS.geonwoo = {id:'geonwoo', career:'lawyer', name:'최건우', age:'35', job:'태성 법무법인 · 파트너 변호사', like:'know',
  intro:'로펌의 젊은 파트너 변호사. 서면 한 줄의 조사를 틀리면 자리에서 지적하는 엄격한 사람. 그런데 야근하는 나에게 말없이 따뜻한 차를 두고 갔다.',
  dateLines:['판례를 같이 읽다가 서로 다른 해석에 논쟁하고, 웃으며 화해했다. 이 사람과는 싸움도 대화다.', '야경이 보이는 사무실 옥상, 그가 처음으로 넥타이를 풀었다.', '“변호사는 늘 누군가의 최악의 날에 만나잖아요.” 그의 말에 오래 생각했다.'],
  trial:{title:'이해충돌', text:'공교롭게도 건우의 사건 상대편을 내가 맡게 되었다. 이대로면 둘 중 한 사람은 윤리 문제에 걸린다.',
    choices:[
      {label:'원칙대로 정면으로 맞선다', sub:'일 +4 · 호감 -5', run(S, v, ch){ addAff(S, 'geonwoo', -5, ch); fx(S, {work:4, know:1.5, stress:6}, ch); return '법정에서 우리는 서로를 한 치도 봐주지 않았다. 결과는 내 쪽의 승리였지만 퇴근길은 길게 느껴졌다.'; }},
      {label:'사건을 다른 변호사에게 넘긴다', sub:'일 -2 · 호감 +4', run(S, v, ch){ addAff(S, 'geonwoo', 4, ch); fx(S, {work:-2, bond:2}, ch); return '“현명한 판단이에요.” 그는 짧게 말하며 안도한 듯 웃었다. 나는 조금 아쉬웠다.'; }},
      {label:'몰래 조율해 보려 한다', sub:'윤리 문제 · 스트레스 +', run(S, v, ch){ S.borrowed++; fx(S, {stress:9, self:-3}, ch); return '비밀리에 사건 얘기를 주고받았다. 마음은 편하지 않았다. 이건 내가 원했던 변호사의 모습이 아니다.'; }},
    ]}};
LOVERS.yuchan = {id:'yuchan', career:'dev', name:'안유찬', age:'29', job:'네오플랫 · 팀 리드 개발자', like:'skill',
  intro:'장애가 터진 새벽 세 시에도 평온하게 키보드를 두드리는 팀 리드. 내 코드에 단 한 줄 리뷰를 남겼다. “여기, 좋은 아이디어네요.” 그게 칭찬의 전부였는데 하루 종일 기뻤다.',
  dateLines:['서버실 앞 계단에서 같이 컵라면을 먹었다. 이 사람은 말보다 코드가 다정하다.', '퇴근 후 보드게임 카페. 그가 의외로 승부욕이 강하다는 걸 알았다.', '“이 버그, 같이 잡자.” 그의 말이 어쩐지 고백처럼 들렸다.'],
  trial:{title:'장애와 이직 제안', text:'밤새 서비스 장애를 복구한 아침, 유찬이 말했다. “나 새 스타트업에서 같이 하자는 제안 받았어. 너도 같이 가자.”',
    choices:[
      {label:'같이 가겠다고 한다', sub:'도전 + · 일 +3 · 호감 +8', run(S, v, ch){ addAff(S, 'yuchan', 8, ch); fx(S, {work:3, dare:2, stress:5}, ch); return '“진짜?” 그는 처음으로 키보드를 멈추고 나를 바라봤다. 불안했지만 그의 눈이 믿음직했다.'; }},
      {label:'지금 회사에 남는다', sub:'호감 -3 · 안정', run(S, v, ch){ addAff(S, 'yuchan', -3, ch); fx(S, {self:2, stress:-2}, ch); return '“그렇구나.” 그는 웃으며 고개를 끄덕였지만 사무실이 갑자기 조용해진 것 같았다.'; }},
      {label:'아는 미래로 설득한다', sub:'선명도 -8 · 호감 +6', run(S, v, ch){ S.borrowed++; addAff(S, 'yuchan', 6, ch); fx(S, {clarity:-8}, ch); return '그가 모를 일들을 근거처럼 말했다. 설득은 먹혔지만 그는 가끔 나를 이상하다는 듯 바라본다.'; }},
    ]}};
LOVERS.ujin = {id:'ujin', career:'designer', name:'신우진', age:'31', job:'메종 오름 · 수석 디자이너', like:'sense',
  intro:'원단을 손으로 먼저 읽는 수석 디자이너. 내 스케치를 보고 한참 말없이 있다가 “색이 거짓말을 안 하네요”라고 했다. 그 한마디가 일주일 동안 가시지 않았다.',
  dateLines:['원단 시장을 같이 돌았다. 그는 손끝으로 사람을 읽듯 천을 읽었다.', '밤새 피팅룸에서 핀을 꽂다가 손이 스쳤다. 둘 다 못 본 척했다.', '“계절은 늘 옷이 먼저 알아요.” 그의 말이 시처럼 들렸다.'],
  trial:{title:'표절 논란', text:'컬렉션 발표 직후 온라인에 우리 도안이 다른 브랜드와 닮았다는 글이 올라왔다. 하필 그 도안은 우진과 내가 함께 만든 것이다.',
    choices:[
      {label:'작업 과정을 공개해 해명한다', sub:'일 +3 · 호감 -4', run(S, v, ch){ addAff(S, 'ujin', -4, ch); fx(S, {work:3, stress:6}, ch); return '스케치와 날짜가 담긴 자료를 공개했다. 논란은 가라앉았지만 우진은 “꼭 그렇게 해야 했어?”라고 물었다.'; }},
      {label:'함께 입장문을 낸다', sub:'호감 +6 · 관계 +2', run(S, v, ch){ addAff(S, 'ujin', 6, ch); fx(S, {bond:2, stress:4}, ch); return '둘의 이름이 나란히 적힌 입장문이 나갔다. 비난 속에서도 그의 손이 내 손을 놓지 않았다.'; }},
      {label:'내가 책임지고 도안을 내린다', sub:'일 -3 · 호감 +4', run(S, v, ch){ addAff(S, 'ujin', 4, ch); fx(S, {work:-3, self:2}, ch); return '“내가 할게.” 도안은 내려갔고 평판은 조금 흔들렸다. 우진은 말없이 내 어깨를 오래 안았다.'; }},
    ]}};
const LOVER_IDS = Object.keys(LOVERS);

function meetEvent(S, id){
  const lv = LOVERS[id];
  return {id:'meet_' + id, once:true, speaker:lv.name, title:'새로운 인연', place:'campus', img:'art/lv_' + id + '.jpg',
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
  return {id:'confess_' + id, once:true, speaker:lv.name, title:'고백', place:'night', img:'art/lv_' + id + '.jpg',
    text:S => `${lv.name}의 목소리가 평소보다 낮았다. “나, 너 좋아해. 사귀자.”`,
    choices:[
      {label:'받아들인다', sub:'공식 연인이 된다', run(S){ const ch = []; v.stage = 1; v.since2 = S.m; v.lastDate = S.m; S.partner = id; fx(S, {bond:3, stress:-6}, ch); if(id === 'jaewoo' && !v.avoided) push(ch, '※ 서재우의 습관을 지켜볼 것', 0.1); S.album.push(`${josa(lv.name, '과', '와')} 연인이 됨`); for(const o in S.love) if(o !== id && S.love[o].stage === -1) S.love[o].aff = Math.min(S.love[o].aff, 44); return {text:'“…응.” 대답은 짧았지만 가슴은 그렇지 않았다. 마흔의 나는 몰랐던 종류의 두근거림이었다.', chips:ch}; }},
      {label:'아직은 아니라고 한다', sub:'호감 -10', run(S){ const ch = []; addAff(S, id, -10, ch); v.refused = (v.refused || 0) + 1; return {text:'“시간을 조금만 줘.” 그는 고개를 끄덕였다. 기다려 줄 사람인지는 모르겠다.', chips:ch}; }},
    ]};
}

function trialEvent(S, id){
  const lv = LOVERS[id], v = S.love[id], t = lv.trial;
  return {id:'trial_' + id, once:true, speaker:lv.name, title:t.title, place:'night', img:'art/lv_' + id + '.jpg',
    text:S => t.text,
    choices:t.choices.map(c => ({label:c.label, sub:c.sub, run(S){ const ch = []; const text = c.run(S, v, ch); return {text, chips:ch}; }}))};
}

function proposeEvent(S, id){
  const lv = LOVERS[id], v = S.love[id];
  return {id:'propose_' + id, once:true, speaker:lv.name, title:'평생의 약속', place:'night', img:'art/lv_' + id + '.jpg',
    text:S => `${lv.name}${id === 'jaewoo' ? '가' : '이'} 작은 상자를 열었다. “우리, 같이 살자.” 마흔의 나는 이 질문 뒤의 이십 년을 안다. 지금의 나는 어떤 대답을 하고 싶은가.`,
    choices:[
      {label:'응, 약속해', sub:'결혼 약속 · 관계 대폭 상승', run(S){ const ch = []; v.stage = 2; S.engaged = true; fx(S, {bond:7, stress:-8}, ch); S.album.push(`${josa(lv.name, '과', '와')} 결혼을 약속함`); return {text:'반지가 손가락에 들어갔다. 이번에는 도장이 아니라 손을 잡았다.', chips:ch}; }},
      {label:'나를 먼저 세우고 싶어', sub:'관계는 유지 · 나 +4', run(S){ const ch = []; addAff(S, id, -8, ch); fx(S, {self:4}, ch); return {text:'그는 잠시 말이 없다가 상자를 닫았다. “기다릴게.” 그 말이 고마웠고 조금 무거웠다.', chips:ch}; }},
    ]};
}

function breakupEvent(S, id){
  const lv = LOVERS[id], v = S.love[id];
  return {id:'fade_' + id, once:true, speaker:lv.name, title:'멀어지는 마음', place:'night', img:'art/lv_' + id + '.jpg',
    text:S => `${lv.name}와의 연락이 뜸해진 지 오래다. 데이트도 없이 계절이 지나갔다. 오늘 그가 먼저 말했다. “우리, 이제 그만할까?”`,
    choices:[
      {label:'붙잡는다', sub:'노력으로 한 번 더', run(S){ const ch = []; v.aff = 40; v.fading = false; v.lastDate = S.m; fx(S, {stress:6}, ch); return {text:'“한 번만 더 해 보자.” 그는 한참 뒤에야 고개를 끄덕였다.', chips:ch}; }},
      {label:'받아들인다', sub:'이별', run(S){ const ch = []; v.stage = -9; S.partner = null; S.engaged = false; fx(S, {bond:-5, stress:8, self:2}, ch); S.album.push(`${josa(lv.name, '과', '와')} 이별`); return {text:'“그래. 고마웠어.” 마지막 인사는 담담했다. 눈물은 집에 가서야 났다.', chips:ch}; }},
    ]};
}

// 이번 달에 나올 연애 이벤트 하나 (우선순위 순)
function loveEvent(S){
  const L = S.love;
  for(const id of LOVER_IDS){ const lv = LOVERS[id]; if(L[id] || S.seen['meet_' + id]) continue; const ok = lv.career ? (S.track === lv.career && S.hired && S.hiredAt != null && S.m >= S.hiredAt + 2) : S.m >= lv.meet; if(ok) return meetEvent(S, id); }
  for(const id of LOVER_IDS){ const v = L[id]; if(!v) continue;
    if(v.stage >= 1 && v.fading && !S.seen['fade_' + id]) return breakupEvent(S, id);
    if(v.stage === -1 && v.aff >= 45 && !S.partner && !S.seen['confess_' + id]) return confessEvent(S, id);
    if(v.stage === 1 && S.m - v.since2 >= 9 && !S.seen['trial_' + id]) return trialEvent(S, id);
    if(v.stage === 1 && S.seen['trial_' + id] && S.m - v.since2 >= 24 && S.m >= 54 && v.aff >= 70 && !S.seen['propose_' + id]) return proposeEvent(S, id);
  }
  return null;
}
