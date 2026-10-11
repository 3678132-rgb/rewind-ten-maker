// 전화하기 (ENGINE 구간 안, DOM 금지): 친구·엄마·썸·연인에게 짧은 통화. 활동 칸은 쓰지 않고 한 달에 2번까지, 같은 사람은 달마다 한 번.
const CALLS_PER_MONTH = 2;
const callsLeft = S => (S.calls && S.calls.m === S.m) ? Math.max(0, CALLS_PER_MONTH - S.calls.n) : CALLS_PER_MONTH;
const calledThisMonth = (S, id) => !!(S.callAt && S.callAt[id] === S.m);
const CALL_WORK = {beauty:'캠페인 자료', pd:'촬영 일정', writer:'대본', actor:'연기 연습', lawyer:'사건 기록', dev:'배포 일정', designer:'컬렉션 도안'};

function contactsOf(S){
  const out = [
    {id:'soyeon', kind:'friend', name:'소연', sub:'단짝 친구', img:'art/soyeon.webp'},
    {id:'mom', kind:'mom', name:'엄마', sub:'엄마', img:'art/mom.webp'},
  ];
  for(const id of LOVER_IDS){ const v = S.love[id], lv = LOVERS[id]; if(!v || v.stage === -9 || v.stage === -2) continue;
    const partner = v.stage >= 1;
    out.push({id, kind:partner ? 'partner' : 'crush', name:lv.name, sub:`${loveStatus(S, id)} · 호감 ${Math.round(v.aff)}`, img:`art/face_${id}_happy.webp`}); }
  const lov = out.filter(o => o.kind === 'partner' || o.kind === 'crush').sort((a, b) => S.love[b.id].aff - S.love[a.id].aff); // 호감 높은 순
  return out.filter(o => o.kind !== 'partner' && o.kind !== 'crush').concat(lov);
}
const hashM = (S, id) => { let h = S.m * 7; for(const c of id) h += c.charCodeAt(0); return h; };

function callEvent(S, id){
  const c = contactsOf(S).find(x => x.id === id); if(!c) return null;
  const mk = o => Object.assign({id:`call_${id}_${S.m}`, once:false, place:'room', speaker:c.name, title:`${c.name}와 통화`, beats:[`📞 ${c.name}에게 전화를 걸었다. 신호음이 간다…`], img:c.kind === 'friend' || c.kind === 'mom' ? c.img : `art/lv_${id}.webp`, lover:LOVERS[id] ? id : null}, o);
  const v = S.love[id], lv = LOVERS[id], k = hashM(S, id);

  // ── 친구 소연 ──
  if(c.kind === 'friend'){
    const V = [
      {text:'“어머, 웬일이야! 나 지금 너한테 전화하려던 참이었는데!” 소연의 목소리가 수화기 너머로 쏟아졌다. 오늘 있었던 일을 한꺼번에 털어놓고 싶은 모양이다.',
       choices:[{label:'끝까지 들어 준다', sub:'관계 +3 · 스트레스 -4', run:S => R_(S, {bond:3, stress:-4}, '한 시간 가까이 소연의 이야기를 들었다. 별것 아닌 이야기인데 이상하게 마음이 따뜻해졌다.')},
                {label:'내 이야기도 꺼낸다', sub:'관계 +2 · 나 +1', run:S => R_(S, {bond:2, self:1, stress:-3}, '“사실 나도 말이야…” 말하다 보니 속에 있던 게 풀렸다. 소연이 한참 내 편을 들어 주었다.')},
                {label:'바쁘다며 짧게 끊는다', sub:'관계 -1', run:S => R_(S, {bond:-1}, '“미안, 나중에 다시 얘기하자.” 소연은 괜찮다고 했지만 목소리가 한 톤 낮아졌다.')}]},
      {text:S => S.m < 48 ? '“학점이 너무 걱정돼서 잠이 안 와…” 소연이 울먹이며 말했다. 마흔의 나는 이런 때 “다들 그래”라고만 말했다.' : '“회사에서 또 한소리 들었어. 그만두고 싶다.” 소연이 지친 목소리로 말했다. 마흔의 나도 같은 말을 입에 달고 살았다.',
       choices:[{label:'공감해 주며 같이 욕해 준다', sub:'관계 +3 · 스트레스 -3', run:S => R_(S, {bond:3, stress:-3}, '“그 사람 진짜 너무하다.” 같이 흥분해 주자 소연이 웃음을 터뜨렸다. 웃고 나니 둘 다 가벼워졌다.')},
                {label:'현실적인 조언을 한다', sub:'통찰 +1.5 · 관계 +1', run:S => R_(S, {ins:1.5, bond:1}, '“일단 이번 학기만 버텨 보자.” 마흔의 경험이 입에서 흘러나왔다. 소연은 조용히 고개를 끄덕이는 소리를 냈다.')},
                {label:'맛있는 거 먹으러 가자고 한다', sub:'자금 -10 · 관계 +3', run:S => R_(S, {cash:-10, bond:3, stress:-4}, '“이번 주말에 떡볶이 먹으러 가자.” 소연이 환호했다. 작은 약속 하나가 한 주를 지탱해 준다.')}]},
      {text:'“우리 요즘 너무 못 본 것 같지 않아?” 소연이 전화를 받자마자 말했다. “이번 주에 시간 돼?”',
       choices:[{label:'이번 주말에 만나자', sub:'자금 -8 · 관계 +3 · 스트레스 -3', run:S => R_(S, {cash:-8, bond:3, stress:-3}, '약속을 잡고 전화를 끊자 이상하게 기운이 났다. 사람은 이런 약속으로 사나 보다.')},
                {label:'일정이 안 돼서 미룬다', sub:'일 +1 · 관계 -1', run:S => R_(S, {work:1, bond:-1}, '“다음에 꼭!” 소연이 씩씩하게 말했지만 마음이 조금 걸렸다.')}]},
      {text:'“야, 우리 고1 때 기억나? 네가 도시락 바꿔 먹자고 했던 거.” 소연이 갑자기 옛날 이야기를 꺼냈다.',
       choices:[{label:'기억나는 척 맞장구친다', sub:'관계 +2', run:S => R_(S, {bond:2, stress:-2}, '마흔의 기억은 이미 흐려졌지만 소연의 이야기 속에서 그날이 다시 살아났다. 웃음이 났다.')},
                {label:'그때를 떠올리며 솔직하게 고마웠다고 말한다', sub:'관계 +4 · 나 +1.5', run:S => R_(S, {bond:4, self:1.5}, '“그때 네가 있어서 힘이 났어.” 소연이 갑자기 말이 없어졌다가 훌쩍였다. “…나도.”')}]},
    ];
    const t = V[k % V.length]; return mk({text:typeof t.text === 'function' ? t.text : () => t.text, choices:t.choices});
  }
  // ── 엄마 ──
  if(c.kind === 'mom'){
    const V = [
      {text:'“밥은 먹었니? 요즘 얼굴이 많이 상했을 것 같아서.” 엄마의 목소리가 평소보다 조금 이르게 걱정으로 시작했다.',
       choices:[{label:'“엄마, 사랑해”라고 말한다', sub:'관계 +4 · 나 +2', run(S){ S.mom = clamp((S.mom || 40) + 6, 0, 100); return R_(S, {bond:4, self:2, stress:-5}, '엄마가 한참 말을 잇지 못했다. “…이 아이가 오늘 왜 이래.” 목소리가 떨렸다. 마흔의 나는 한 번도 하지 못한 말이었다.'); }},
                {label:'잔소리를 끝까지 듣는다', sub:'관계 +2 · 스트레스 -2', run(S){ S.mom = clamp((S.mom || 40) + 3, 0, 100); return R_(S, {bond:2, stress:-2}, '“김치 보내 줄게, 냉동실에 넣어 놓고 먹어.” 잔소리인데 사랑이었다. 이제야 알겠다.'); }},
                {label:'바쁘다며 서둘러 끊는다', sub:'관계 -2', run:S => R_(S, {bond:-2, stress:1}, '“그래, 바쁘면 어쩔 수 없지.” 끊고 나서 오래 휴대폰을 쥐고 있었다.')}]},
      {text:'“반찬 좀 보냈어. 택배 오면 상하기 전에 냉장고에 넣어.” 엄마는 이렇게 시작해서 한참을 이어 갔다. 마흔의 나는 이 전화를 늘 귀찮아했다.',
       choices:[{label:'“엄마 반찬이 제일 맛있어”라고 말한다', sub:'관계 +3', run(S){ S.mom = clamp((S.mom || 40) + 4, 0, 100); return R_(S, {bond:3, stress:-3}, '“그럼, 엄마가 누구니.” 엄마가 목소리를 높이며 웃었다. 수화기 너머로 부엌 소리가 들렸다.'); }},
                {label:'“저도 돈 벌면 맛있는 거 사 드릴게요”라고 말한다', sub:'관계 +3 · 나 +1', run:S => R_(S, {bond:3, self:1}, '“내 걱정 말고 네 건강이나 챙겨.” 엄마는 그렇게 말하면서도 목소리가 달아 있었다.')}]},
      {text:S => S.hired ? '“회사는 다닐 만하니? 사람들이 너한테 잘해 주니?” 엄마가 조심스럽게 물었다.' : '“요즘 공부는 잘 돼 가니? 힘들면 언제든 내려와.” 엄마가 조심스럽게 말했다.',
       choices:[{label:'힘들었던 걸 솔직히 털어놓는다', sub:'관계 +3 · 스트레스 -6', run(S){ S.mom = clamp((S.mom || 40) + 5, 0, 100); return R_(S, {bond:3, stress:-6, self:1.5}, '“많이 힘들었구나. 내 딸이 혼자서.” 엄마가 울먹였다. 말하고 나니 짐이 반쯤 내려갔다.'); }},
                {label:'“괜찮아, 잘하고 있어”라고 말한다', sub:'관계 +1 · 스트레스 +2', run:S => R_(S, {bond:1, stress:2}, '엄마는 안심한 듯했지만 나는 전화를 끊고 한참 멍하니 있었다.')}]},
    ];
    const t = V[k % V.length]; return mk({text:typeof t.text === 'function' ? t.text : () => t.text, choices:t.choices});
  }
  // ── 썸·연인: 인물별 말투, 직장 상대는 일 얘기 ──
  const V = LOVE_VOICE[id] || LOVE_VOICE.minjun, topic = lv.career ? CALL_WORK[lv.career] : null;
  const fxC = (S, d, o, text) => { const ch = []; addAff(S, id, d, ch); fx(S, o, ch); v.lastDate = S.m; return {text, chips:ch}; };
  // 호감이 낮은 썸은 전화를 못 받을 수 있다
  if(c.kind === 'crush' && v.aff < 15 && ((hashM(S, id) + S.m) % 3 === 0)){
    return mk({beats:[`📞 ${c.name}에게 전화를 걸었다. 신호음이 간다…`, '신호음이 끊겼다. “지금은 전화를 받을 수 없습니다.”'], text:() => '받지 않았다. 부재중 화면을 한참 보다가 휴대폰을 내려놓았다. 용기를 낸 만큼 허전했다.',
      choices:[{label:'문자를 남긴다', sub:'호감 +1', run:S => fxC(S, 1, {}, '“전화했었어요. 시간 되면 연락 줘요.” 문자를 보내고 나서야 숨을 쉬었다.')},
               {label:'그냥 둔다', sub:'스트레스 +2', run:S => fxC(S, 0, {stress:2}, '답은 오지 않았다. 마음이 조금 쓸쓸해졌다.')}]});
  }
  if(c.kind === 'crush'){
    const lowA = v.aff < 30;
    const choices = lowA ? [
      {label:topic ? `${topic} 핑계로 말을 건다` : '가볍게 안부를 묻는다', sub:'호감 +3', run:S => fxC(S, 3, {}, topic ? `“${topic} 때문에 잠깐 여쭤볼 게 있어서요.” 어색한 통화였지만 끝날 즈음엔 서로 웃고 있었다.` : '“그냥 안부 전화예요.” 어색함 속에서도 그가 천천히 대답해 주었다.')},
      {label:'용건 없이 목소리만 듣고 끊는다', sub:'호감 +1', run:S => fxC(S, 1, {stress:-2}, '“무슨 일 있어요?” 걱정스러운 목소리에 “아니에요”라고만 답했다. 그 목소리가 오래 귓가에 남았다.')},
    ] : [
      {label:'장난스럽게 말을 받아친다', sub:'호감 +4 · 매력 +0.5', run:S => fxC(S, 4, {charm:0.5, stress:-3}, `${V.tease} 우리는 별것 아닌 얘기로 한참 웃었다. 전화를 끊고 나서도 입꼬리가 내려가지 않았다.`)},
      {label:'보고 싶다고 솔직히 말한다', sub:v.aff >= 45 ? '호감 +6' : '호감 ±', run:S => v.aff >= 45 ? fxC(S, 6, {stress:-3}, `잠깐의 침묵 뒤에 그가 말했다. ${V.warm} 심장이 귀까지 올라온 것 같았다.`) : fxC(S, -2, {stress:3}, '너무 이른 말이었는지 그가 어색하게 웃었다. “…어, 고마워요.” 대화가 조금 식었다.')},
      {label:'다음 주 약속을 잡는다', sub:'호감 +3', run:S => fxC(S, 3, {}, '“그럼 이번 주 토요일 어때요?” 약속을 잡고 나자 하루 종일 달력이 환해 보였다.')},
    ];
    return mk({text:() => lowA ? `${c.name}가 세 번째 신호음에 전화를 받았다. “여보세요? …아, ${S.name}씨.” 낮은 목소리가 의외로 반가웠다.` : `${c.name}가 두 번째 신호음에 전화를 받았다. “어, 마침 생각하고 있었는데.” 목소리가 웃고 있었다.`, choices});
  }
  // 공식 연인
  const night = (S.m + k) % 2 === 0;
  return mk({text:() => night ? `자기 전에 ${c.name}에게 전화를 걸었다. “아직 안 잤어요?” 낮고 조용한 목소리가 귀에 닿았다. ${V.warm}` : `${c.name}가 전화를 받자마자 웃었다. “어, 마침 전화하려던 참이었어요.” ${V.tease}`,
    choices:[
      {label:'오늘 힘들었던 일을 털어놓는다', sub:'호감 +4 · 스트레스 -7', run:S => fxC(S, 4, {stress:-7, self:1}, '말하다가 목이 메었다. 그는 끊지 않고 끝까지 들어 주었다. “고생 많았어요.” 그 한마디에 마음이 풀렸다.')},
      {label:'아무 말 없이 서로 숨소리만 듣는다', sub:'호감 +5 · 스트레스 -5', run:S => fxC(S, 5, {stress:-5, bond:1.5}, '한참 말이 없었다. 그런데 이상하게 불편하지 않았다. “…끊지 마요.” 그가 작게 말했다.')},
      {label:'주말 데이트를 약속한다', sub:'호감 +4 · 관계 +1.5', run:S => fxC(S, 4, {bond:1.5}, '“이번 주엔 어디 갈까요?” 둘이 번갈아 장소를 대다가 결국 웃으며 정하지 못했다.')},
      {label:'사과하고 싶은 일이 있다고 말한다', sub:'호감 +3 · 통찰 +1', run:S => fxC(S, 3, {ins:1}, `${V.sorry} 서로 같은 말을 먼저 하려다 동시에 웃었다.`)},
    ]});
}

// 전화 걸기: 성공하면 이벤트를 돌려주고, 횟수·달 제한은 여기서 처리한다. 걸 수 없으면 사유 문자열.
function tryCall(S, id){
  if(callsLeft(S) <= 0) return '이번 달 통화는 모두 사용했어요';
  if(calledThisMonth(S, id)) return '이번 달에 이미 통화했어요';
  const ev = callEvent(S, id); if(!ev) return '연락할 수 없어요';
  if(!S.calls || S.calls.m !== S.m) S.calls = {m:S.m, n:0};
  S.calls.n++; (S.callAt || (S.callAt = {}))[id] = S.m;
  return ev;
}
