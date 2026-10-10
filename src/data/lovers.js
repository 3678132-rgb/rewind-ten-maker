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
const LOVER_IDS = Object.keys(LOVERS);

function meetEvent(S, id){
  const lv = LOVERS[id];
  return {id:'meet_' + id, once:true, speaker:lv.name, title:'새로운 인연', place:'campus',
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
  return {id:'confess_' + id, once:true, speaker:lv.name, title:'고백', place:'night',
    text:S => `${lv.name}의 목소리가 평소보다 낮았다. “나, 너 좋아해. 사귀자.”`,
    choices:[
      {label:'받아들인다', sub:'공식 연인이 된다', run(S){ const ch = []; v.stage = 1; v.since2 = S.m; v.lastDate = S.m; S.partner = id; fx(S, {bond:3, stress:-6}, ch); if(id === 'jaewoo' && !v.avoided) push(ch, '※ 서재우의 습관을 지켜볼 것', 0.1); S.album.push(`${josa(lv.name, '과', '와')} 연인이 됨`); for(const o in S.love) if(o !== id && S.love[o].stage === -1) S.love[o].aff = Math.min(S.love[o].aff, 44); return {text:'“…응.” 대답은 짧았지만 가슴은 그렇지 않았다. 마흔의 나는 몰랐던 종류의 두근거림이었다.', chips:ch}; }},
      {label:'아직은 아니라고 한다', sub:'호감 -10', run(S){ const ch = []; addAff(S, id, -10, ch); v.refused = (v.refused || 0) + 1; return {text:'“시간을 조금만 줘.” 그는 고개를 끄덕였다. 기다려 줄 사람인지는 모르겠다.', chips:ch}; }},
    ]};
}

function trialEvent(S, id){
  const lv = LOVERS[id], v = S.love[id], t = lv.trial;
  return {id:'trial_' + id, once:true, speaker:lv.name, title:t.title, place:'night',
    text:S => t.text,
    choices:t.choices.map(c => ({label:c.label, sub:c.sub, run(S){ const ch = []; const text = c.run(S, v, ch); return {text, chips:ch}; }}))};
}

function proposeEvent(S, id){
  const lv = LOVERS[id], v = S.love[id];
  return {id:'propose_' + id, once:true, speaker:lv.name, title:'평생의 약속', place:'night',
    text:S => `${lv.name}${id === 'jaewoo' ? '가' : '이'} 작은 상자를 열었다. “우리, 같이 살자.” 마흔의 나는 이 질문 뒤의 이십 년을 안다. 지금의 나는 어떤 대답을 하고 싶은가.`,
    choices:[
      {label:'응, 약속해', sub:'결혼 약속 · 관계 대폭 상승', run(S){ const ch = []; v.stage = 2; S.engaged = true; fx(S, {bond:7, stress:-8}, ch); S.album.push(`${josa(lv.name, '과', '와')} 결혼을 약속함`); return {text:'반지가 손가락에 들어갔다. 이번에는 도장이 아니라 손을 잡았다.', chips:ch}; }},
      {label:'나를 먼저 세우고 싶어', sub:'관계는 유지 · 나 +4', run(S){ const ch = []; addAff(S, id, -8, ch); fx(S, {self:4}, ch); return {text:'그는 잠시 말이 없다가 상자를 닫았다. “기다릴게.” 그 말이 고마웠고 조금 무거웠다.', chips:ch}; }},
    ]};
}

function breakupEvent(S, id){
  const lv = LOVERS[id], v = S.love[id];
  return {id:'fade_' + id, once:true, speaker:lv.name, title:'멀어지는 마음', place:'night',
    text:S => `${lv.name}와의 연락이 뜸해진 지 오래다. 데이트도 없이 계절이 지나갔다. 오늘 그가 먼저 말했다. “우리, 이제 그만할까?”`,
    choices:[
      {label:'붙잡는다', sub:'노력으로 한 번 더', run(S){ const ch = []; v.aff = 40; v.fading = false; v.lastDate = S.m; fx(S, {stress:6}, ch); return {text:'“한 번만 더 해 보자.” 그는 한참 뒤에야 고개를 끄덕였다.', chips:ch}; }},
      {label:'받아들인다', sub:'이별', run(S){ const ch = []; v.stage = -9; S.partner = null; S.engaged = false; fx(S, {bond:-5, stress:8, self:2}, ch); S.album.push(`${josa(lv.name, '과', '와')} 이별`); return {text:'“그래. 고마웠어.” 마지막 인사는 담담했다. 눈물은 집에 가서야 났다.', chips:ch}; }},
    ]};
}

// 이번 달에 나올 연애 이벤트 하나 (우선순위 순)
function loveEvent(S){
  const L = S.love;
  for(const id of LOVER_IDS){ const lv = LOVERS[id]; if(!L[id] && S.m >= lv.meet && !S.seen['meet_' + id]) return meetEvent(S, id); }
  for(const id of LOVER_IDS){ const v = L[id]; if(!v) continue;
    if(v.stage >= 1 && v.fading && !S.seen['fade_' + id]) return breakupEvent(S, id);
    if(v.stage === -1 && v.aff >= 45 && !S.partner && !S.seen['confess_' + id]) return confessEvent(S, id);
    if(v.stage === 1 && S.m - v.since2 >= 9 && !S.seen['trial_' + id]) return trialEvent(S, id);
    if(v.stage === 1 && S.seen['trial_' + id] && S.m - v.since2 >= 24 && S.m >= 54 && v.aff >= 70 && !S.seen['propose_' + id]) return proposeEvent(S, id);
  }
  return null;
}
