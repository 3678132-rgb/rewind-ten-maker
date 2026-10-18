// 여러 명과의 연애: 몰래 데이트(비밀 연애) · 들통 · 상대의 바람 · 결혼 · 결혼 생활 · 이혼. ENGINE 구간(DOM 금지)
// 상태: S.partner(공식 연인) · S.secret{id:true}(공식 몰래 만나는 사람) · S.susp(의심 0~100) · S.married(결혼한 상대) · v.stage 3 = 결혼
LOVE_STAGE['3'] = '결혼';
// 화면에 보이는 관계 상태: 썸 · 연애 · 연애(비밀) · 결혼 약속 · 결혼 · 이혼 · 이별
function loveStatus(S, id){
  const v = S.love[id]; if(!v) return '';
  if(v.stage === 3) return '결혼';
  if(v.stage === -2) return '거절함';
  if(v.stage === -9) return v.marriedAt != null ? '이혼' : '이별';
  if(v.stage === 2) return '결혼 약속';
  if(v.stage === 1) return S.secret && S.secret[id] ? '연애 · 비밀' : '연애';
  return '썸';
}
const V3 = {warm:'“네가 있어서 힘이 나.”', sorry:'“…미안해.”'};
const voiceOf = id => (typeof LOVE_VOICE !== 'undefined' && LOVE_VOICE[id]) || V3;
const officialOf = S => S.partner && S.love[S.partner] && S.love[S.partner].stage >= 1 ? S.partner : null;
const secretIds = S => Object.keys(S.secret || {}).filter(id => S.love[id] && S.love[id].stage >= 1 && S.secret[id] && id !== S.partner);
// 이 사람과의 관계 표현: 결혼했으면 남편, 아니면 애인
const callOf = (S, id) => S.married === id ? '남편' : '애인';
function endRelation(S, id, ch){ const v = S.love[id]; if(!v) return; v.stage = -9; v.fading = false; if(S.secret) delete S.secret[id]; if(S.partner === id){ S.partner = null; S.engaged = false; } if(S.married === id) S.married = null; }
// 공식 연인이 없어졌을 때: 몰래 만나던 사람이 있으면 가장 마음이 큰 사람이 공식 연인이 된다
function promoteSecret(S){ if(officialOf(S)) return null; const c = secretIds(S).sort((a, b) => S.love[b].aff - S.love[a].aff)[0]; if(!c) return null; S.partner = c; delete S.secret[c]; S.love[c].since2 = S.love[c].since2 == null ? S.m : S.love[c].since2; return c; }
function addSusp(S, d){ S.susp = clamp((S.susp || 0) + d, 0, 100); }

// ── 1) 이미 연인이 있는데 다른 사람이 고백한다 ────────────────────────
function secretConfessEvent(S, id){
  const lv = LOVERS[id], v = S.love[id], P = LOVERS[S.partner];
  return {id:'confess_' + id, lover:id, once:true, speaker:lv.name, title:'흔들리는 마음', place:'night', img:'art/lv_' + id + '.webp',
    text:S => `${lv.name}의 목소리가 평소보다 낮았다. “너한테 이미 소중한 사람이 있다는 거 알아. 그래도, 나 너 좋아해.” 머릿속에 ${P.name}의 얼굴이 스쳤다. 마흔의 나는 한 번도 이런 갈림길 앞에 서 본 적이 없다.`,
    choices:[
      {label:'정중히 거절한다', sub:`${P.name}에게 충실 · 호감 -8`, run(S){ const ch = []; addAff(S, id, -8, ch); v.stage = -2; v.rejectedAt = S.m; fx(S, {self:2, bond:1}, ch); return {text:'“미안해요. 마음만 고맙게 받을게요.” 그는 잠시 말이 없다가 고개를 끄덕였다. 돌아서는 뒷모습이 오래 남았다.', chips:ch}; }},
      {label:'아무에게도 말하지 않고 만난다', sub:'비밀 연애 · 들킬 위험↑', run(S){ const ch = []; v.stage = 1; v.since2 = S.m; v.lastDate = S.m; v.secret = true; S.secret = S.secret || {}; S.secret[id] = true; addSusp(S, 10); fx(S, {bond:2, stress:6, self:-2}, ch); S.album.push(`${josa(lv.name, '과', '와')} 비밀 연애를 시작함`); return {text:`나는 고개를 끄덕였다. 설렘과 죄책감이 동시에 밀려왔다. ${lv.name}의 손을 잡은 순간, 이건 비밀이 되어야 한다는 걸 알았다.`, chips:ch}; }},
      {label:`${P.name}와의 관계부터 정리한다`, sub:'이별 후 새로 시작', run(S){ const ch = []; const pid = S.partner; endRelation(S, pid, ch); v.stage = 1; v.since2 = S.m; v.lastDate = S.m; S.partner = id; fx(S, {bond:-3, stress:8, self:1}, ch); S.album.push(`${josa(P.name, '과', '와')} 이별하고 ${josa(lv.name, '과', '와')} 연인이 됨`); return {text:`${P.name}에게 먼저 이별을 말했다. 아프지만 거짓으로 두 사람을 만나는 것보다는 나았다. 그런 뒤 ${lv.name}에게 대답했다.`, chips:ch}; }},
    ]};
}

// ── 2) 비밀 연애 일상(몰래 데이트) ───────────────────────────────────────
const SECRET_SCENES = [
  {t:'몰래 만나는 밤', x:(S, lv, c) => `${c}에게는 밤 연습이라고 말했다. 약속 장소는 아무도 아는 사람이 없는 한적한 골목 카페. ${lv.name}가 먼저 와서 나를 기다리고 있었다. 거짓말이 늘 때마다 설렘도 커진다.`, a:['오늘은 시간을 마음껏 쓴다', '시간이 어떻게 갔는지 몰랐다. 막차를 놓칠 뻔했고, 집에 돌아오는 길엔 휴대폰을 몇 번이나 확인했다.', {bond:1.5, stress:3, self:-1}, 8], b:['짧게 만나고 일찍 돌아간다', '삼십 분만 만나고 일어섰다. 그는 아쉬워했지만 이해해 주었다. 마음이 조금 덜 무거웠다.', {stress:1}, 3]},
  {t:'알리바이', x:(S, lv, c) => `${c}가 갑자기 전화를 했다. “지금 어디야?” 옆엔 ${lv.name}가 있다. 심장이 쿵 내려앉았다. 거짓말을 해야 하는 순간이다.`, a:['자연스럽게 둘러댄다', '“연습실 근처 카페야, 곧 들어갈게.” 목소리가 떨리지 않았다는 사실이 오히려 무서웠다.', {charm:0.4, stress:5, self:-2}, 4], b:['전화를 받지 않는다', '벨 소리가 끊어질 때까지 화면만 봤다. 나중에 배터리가 나갔다고 했지만 마음엔 가시가 남았다.', {stress:6}, 2]},
  {t:'흔들리는 선택', x:(S, lv, c) => `${lv.name}가 조심스럽게 물었다. “우린 언제까지 이렇게 숨어야 해?” 맞는 말이다. ${c}와 ${lv.name} 사이에서 나는 어느 쪽도 놓지 못하고 있었다.`, a:['“조금만 더 시간을 줘”', '그는 한숨을 쉬었지만 고개를 끄덕였다. 시간을 번 건지, 문제를 미룬 건지는 나도 몰랐다.', {stress:5, self:-1}, 3], b:['“곧 정리할게”', '말은 했지만 어떻게 정리해야 할지는 몰랐다. 그의 눈에 기대가 번졌다. 그 기대가 무거웠다.', {stress:7, self:1}, 5]},
  {t:'들킬 뻔한 하루', x:(S, lv, c) => `${lv.name}와 있는데 멀리서 ${c}의 친구가 지나가는 게 보였다. 순간 모자를 눌러쓰고 몸을 돌렸다. 가슴이 터질 것 같았다. 이런 건 마흔의 내가 가장 싫어하던 거짓말의 모양이다.`, a:['이대로는 안 된다고 생각한다', '심장이 진정될 때까지 한참을 앉아 있었다. 이 관계의 끝을 생각하게 되었다.', {self:2, stress:4}, 0], b:['더 조심하기로 한다', '그와 약속을 하나 정했다. 서로 연락은 이 시간에만. 규칙이 늘어날수록 마음은 오히려 외로워졌다.', {stress:5}, 3]},
];
function secretEvent(S){
  const ids = secretIds(S).filter(id => S.m - (S.love[id].lastSecret == null ? -9 : S.love[id].lastSecret) >= 3 && S.m >= (S.love[id].since2 || 0) + 1);
  if(!ids.length) return null;
  const id = ids.sort((a, b) => S.love[b].aff - S.love[a].aff)[0], v = S.love[id], lv = LOVERS[id], n = v.secretN || 0, sc = SECRET_SCENES[n % SECRET_SCENES.length], c = callOf(S, S.partner || S.married || '');
  const who = S.partner ? LOVERS[S.partner].name : '그 사람';
  const mk = (cfg, up) => ({label:cfg[0], sub:(up ? '들킬 위험↑ · 호감↑' : '위험은 낮게 · 호감 소폭') + (isIdol(S) ? ' · 스캔들 위험' : ''), run(S){ const ch = []; v.lastSecret = S.m; v.secretN = n + 1; addAff(S, id, cfg[3], ch); fx(S, cfg[2], ch); addSusp(S, up ? 9 : 4); if(isIdol(S)) addScandal(S, up ? 5 : 2, ch); v.lastDate = S.m; return {text:cfg[1], chips:ch}; }});
  return {id:`secret_${id}_${n}`, lover:id, speaker:lv.name, title:sc.t, place:'night', img:'art/lv_' + id + '.webp',
    text:S => sc.x(S, lv, who),
    choices:[mk(sc.a, true), mk(sc.b, false), {label:'이 관계를 끝낸다', sub:'비밀 연애를 정리한다', run(S){ const ch = []; endRelation(S, id, ch); addSusp(S, -20); fx(S, {self:3, stress:-3, bond:-1}, ch); S.album.push(`${josa(lv.name, '과', '와')} 비밀 연애를 정리함`); return {text:`나는 ${lv.name}에게 이별을 말했다. 그는 이유를 묻지 않았다. 다만 “고마웠어” 한마디를 남기고 돌아섰다. 숨이 한결 쉬워졌다.`, chips:ch}; }}]};
}

// ── 3) 들통: 공식 연인이 비밀을 알게 되다 ────────────────────────────────
function discoveryEvent(S){
  const pid = officialOf(S); if(!pid) return null;
  const hid = secretIds(S).sort((a, b) => S.love[b].aff - S.love[a].aff)[0];
  const date2 = !hid && S.dateOther && S.m - S.dateOther.m <= 2 ? S.dateOther.id : null;
  const oid = hid || date2; if(!oid || (S.susp || 0) < 38) return null;
  if(S.seen['disc_' + pid + '_' + S.m] || S.m - (S.lastDisc == null ? -99 : S.lastDisc) < 6) return null;
  if(R() > (S.susp - 25) / 120) return null;
  const pv = S.love[pid], p = LOVERS[pid], o = LOVERS[oid], c = callOf(S, pid), married = S.married === pid; S.discPair = {a:pid, b:oid, m:S.m};
  return {id:`disc_${pid}_${S.m}`, lover:pid, speaker:p.name, title:married ? '식탁 위의 휴대폰' : '밝혀진 비밀', place:'night', img:'art/lv_' + pid + '.webp',
    text:S => `${p.name}${married ? '가 식탁에 내 휴대폰을 올려놓고 말했다.' : '가 약속 장소에 먼저 와 있었다. 손에는 내 사진첩이 아닌, 누군가와 찍힌 사진이 들려 있었다.'} “${o.name}, 누구야?” 목소리가 낮고 흔들렸다. 변명이 입술 끝까지 올라왔다.`,
    choices:[
      {label:'모두 사실대로 말하고 사과한다', sub:'신뢰 회복 가능성 · 호감 -12', run(S){ const ch = []; S.lastDisc = S.m; addAff(S, pid, -12, ch); const forgive = pv.aff >= 45 && R() < 0.55; for(const i of secretIds(S)) { endRelation(S, i, ch); } S.susp = 0; if(forgive){ fx(S, {bond:-2, stress:8, self:2}, ch); S.album.push(`${p.name}에게 비밀을 고백하고 용서받음`); return {text:`한참 침묵하던 ${p.name}가 숨을 내쉬었다. “…다시는 이러지 마.” 용서받았다는 사실이 안도가 아니라 무게로 얹혔다. 나는 모든 관계를 정리했다.`, chips:ch}; } endRelation(S, pid, ch); fx(S, {bond:-6, stress:10, self:2}, ch); S.album.push(`${josa(p.name, '과', '와')} 이별(비밀이 들통남)`); if(married){ S.divorced = true; S.album.push('이혼'); } const np = promoteSecret(S); return {text:`${p.name}는 오래 나를 쳐다보다가 일어섰다. “솔직해서 고마워. 그래도 못 믿겠어.” ${married ? '결혼반지가 식탁 위에 놓였다.' : '문이 닫히는 소리가 오래 울렸다.'}`, chips:ch}; }},
      {label:'거짓말로 둘러댄다', sub:'성공하면 위기 모면 · 실패하면 최악', run(S){ const ch = []; S.lastDisc = S.m; const ok = R() < 0.3 + (S.st.charm + S.st.neg) / 260; if(ok){ S.susp = 18; addAff(S, pid, -4, ch); fx(S, {stress:9, self:-3}, ch); return {text:'“그냥 아는 사람이야. 오해야.” 너무 담담하게 말해서 내가 놀랐다. 그는 의심을 완전히 거두지 못했지만 더 묻지 않았다.', chips:ch}; } for(const i of secretIds(S)) endRelation(S, i, ch); endRelation(S, pid, ch); S.susp = 0; fx(S, {bond:-8, stress:12, self:-3}, ch); S.album.push(`${josa(p.name, '과', '와')} 이별(거짓말이 들통남)`); if(married){ S.divorced = true; S.album.push('이혼'); } return {text:`${p.name}가 휴대폰을 내 앞에 내밀었다. 거짓말의 증거가 더 있었다. “사실대로 말해 줬으면 이렇게까진 아니었을 거야.” 그는 돌아서서 나갔다.`, chips:ch}; }},
      {label:`${o.name}를 택하고 이별을 받아들인다`, sub:`${o.name}와 공식 연인으로`, run(S){ const ch = []; S.lastDisc = S.m; endRelation(S, pid, ch); if(S.love[oid] && S.love[oid].stage >= 1){ S.partner = oid; delete S.secret[oid]; } else if(S.love[oid]){ S.love[oid].stage = 1; S.love[oid].since2 = S.m; S.partner = oid; } S.susp = 0; fx(S, {bond:-4, stress:9, self:2}, ch); S.album.push(`${josa(p.name, '과', '와')} 헤어지고 ${josa(o.name, '과', '와')} 공개 연애`); if(married){ S.divorced = true; S.album.push('이혼'); } return {text:`“마음이 이미 그쪽에 있었던 거네.” ${p.name}는 쓴웃음을 지었다. 나는 부정하지 못했다. 아프지만, 더는 숨기지 않아도 된다는 게 이상하게 가벼웠다.`, chips:ch}; }},
    ]};
}

// ── 4) 상대의 바람: 내 공식 연인이 몰래 다른 사람을 만나고 있다 ───────────
function cheatedOnEvent(S){
  const pid = officialOf(S); if(!pid || S.married === pid) return null;
  const v = S.love[pid], p = LOVERS[pid]; if(v.cheated || S.m < 20) return null;
  const gap = S.m - (v.lastDate == null ? v.since2 : v.lastDate);
  if(gap < 4 || v.aff > 52) return null; if(R() > 0.22) return null;
  return {id:'cheated_' + pid, lover:pid, once:true, speaker:p.name, title:'낯선 메시지', place:'night', img:'art/lv_' + pid + '.webp',
    text:S => `${p.name}의 휴대폰이 테이블 위에서 울렸다. 화면에 뜬 이름은 처음 보는 사람. 미리 보기에는 “어제 즐거웠어. 오늘도 볼 수 있어?”라고 쓰여 있었다. 한동안 서로 만나지 못한 건 사실이지만… 숨이 막혔다.`,
    choices:[
      {label:'바로 따져 묻는다', sub:'진실이 드러난다', run(S){ const ch = []; v.cheated = true; if(R() < 0.5){ addAff(S, pid, 3, ch); fx(S, {stress:7, self:1}, ch); return {text:`${p.name}는 당황하더니 이내 인정했다. “외로웠어. 네가 너무 바빠서.” 변명은 아니지만 이유가 되기엔 부족했다. 우린 오래 이야기했고, 한 번은 믿어 보기로 했다.`, chips:ch}; } endRelation(S, pid, ch); fx(S, {bond:-5, stress:10, self:3}, ch); S.album.push(`${josa(p.name, '과', '와')} 이별(상대의 바람)`); promoteSecret(S); return {text:`“이미 끝난 사이야.” ${p.name}의 대답이 칼 같았다. 나는 울지 않으려고 이를 악물었다. 마흔의 나는 이런 순간에도 침묵했다. 이번엔 끝까지 말했다.`, chips:ch}; }},
      {label:'모른 척하고 지켜본다', sub:'스트레스↑ · 증거를 더 모은다', run(S){ const ch = []; v.cheated = true; v.suspicious = true; fx(S, {stress:8, ins:1}, ch); addAff(S, pid, -6, ch); return {text:'아무 일도 없다는 듯 웃었다. 하지만 그 웃음 뒤로 매일 밤 한 가지 질문이 맴돌았다. 알면서 모른 척하는 건 용서일까, 비겁일까.', chips:ch}; }},
      {label:'조용히 이별을 말한다', sub:'실력 +, 마음 +', run(S){ const ch = []; v.cheated = true; endRelation(S, pid, ch); fx(S, {self:4, work:1, bond:-4, stress:6}, ch); S.album.push(`${josa(p.name, '과', '와')} 이별`); promoteSecret(S); return {text:`“이제 그만하자.” 이유는 말하지 않았다. 그는 변명하려다 멈췄다. 나는 먼저 일어나 걸어 나왔다. 뒤돌아보지 않았다.`, chips:ch}; }},
    ]};
}

// ── 5) 결혼과 결혼 생활, 그리고 이혼 ───────────────────────────────────────
function weddingEvent(S){
  const id = S.engaged && S.partner; const v = id && S.love[id];
  if(!v || v.stage !== 2 || S.married || S.m < 58) return null;
  if(S.m - (v.engagedAt == null ? S.m : v.engagedAt) < 5) return null;
  const lv = LOVERS[id];
  const ev = {id:'wedding_' + id, lover:id, once:true, speaker:lv.name, title:'결혼식', place:'city', img:`art/wd_${id}.webp`,
    text:S => `하얀 드레스와 환한 햇빛. ${lv.name}가 입장하는 나를 보며 눈시울을 붉혔다. 마흔의 내가 이혼 서류에 도장을 찍던 날과 같은 달력 위에 서 있는데, 오늘은 전혀 다른 날이다. 그래도 문득 두려움이 스쳤다. 이 사람과 십 년, 이십 년을 살 수 있을까.`,
    choices:[
      {label:'두려움까지 안고 약속한다', sub:'결혼 · 관계 대폭 상승', run(S){ const ch = []; v.stage = 3; v.marriedAt = S.m; S.married = id; fx(S, {bond:8, stress:-6, self:1}, ch); addAff(S, id, 8, ch); S.album.push(`${josa(lv.name, '과', '와')} 결혼`); return {text:`“네, 평생 함께하겠습니다.” 하객들의 박수 속에서 나는 처음으로 서약이 아닌 선택이라는 단어를 떠올렸다. ${lv.name}의 손은 따뜻했다.`, chips:ch}; }},
      {label:'혼인신고는 조금 더 미룬다', sub:'동거 상태 · 관계 소폭', run(S){ const ch = []; v.stage = 3; v.marriedAt = S.m; v.pending = true; S.married = id; fx(S, {bond:5, self:2, stress:-3}, ch); S.album.push(`${josa(lv.name, '과', '와')} 결혼(혼인신고는 나중에)`); return {text:'“식은 올리되, 서류는 우리가 준비되었을 때.” 그는 잠깐 놀랐지만 웃으며 고개를 끄덕였다. 조금 느슨한 약속이 오히려 숨 쉴 틈이 되었다.', chips:ch}; }},
    ]};
  // 신부 대기실 → 입장 → 서약: 그림이 바뀌며 이어진다
  const vow = [`art/wd_${id}.webp`, `art/lv_${id}.webp`];
  ev.beats = [
    `신부 대기실. 거울 속에 하얀 웨딩드레스를 입은 내가 서 있다. 소연이 베일을 매만지다가 훌쩍였다. “야, 울지 마. 나 화장 번지잖아.” 정작 우는 건 소연이다. 마흔의 나는 이 방에 서 본 적이 없다. 손끝에 닿는 레이스가 낯설게 따뜻하다.`,
    `문이 열리고 버진로드 끝의 빛이 쏟아졌다. 꽃잎이 깔린 길 위로 한 걸음씩. 하객석에서 엄마가 손수건으로 입을 가리는 게 보인다. 그 끝에서 ${lv.name}${id === 'jaewoo' ? '가' : '이'} 숨을 삼키고 서 있다. 눈이 마주치자 그가 입 모양으로 말했다. “예뻐.”`,
  ];
  ev.beatImgs = [[`art/wd_dress.webp`, `art/lv_${id}.webp`], [`art/wd_aisle.webp`, `art/lv_${id}.webp`], vow];
  return ev;
}
const MARRIED_SCENES = [
  {t:'신혼의 아침', x:lv => `${lv.name}가 서툰 솜씨로 아침을 차려 놓았다. 계란은 탔고 국은 짰다. 그런데 이상하게 웃음이 났다. 같은 집에서 눈을 뜬다는 일이 이렇게 낯설고 따뜻하다.`, a:['“맛있어, 내일은 내가 할게”', '그는 안심한 듯 웃었다. 서로 번갈아 아침을 차리기로 약속했다.', {bond:2, stress:-3}, 5], b:['웃으며 먹되 레시피를 알려 준다', '그는 투덜대면서도 메모를 했다. 부엌에서 오래 웃었다.', {bond:1.2, self:1}, 3]},
  {t:'집안일 전쟁', x:lv => `설거지 문제로 시작한 말다툼이 점점 커졌다. “넌 왜 항상 내가 먼저 해 주길 바라?” ${lv.name}의 목소리가 높아졌다. 마흔의 나도 이런 식으로 지쳐 갔었다.`, a:['감정을 가라앉히고 규칙을 정한다', '둘이 식탁에 앉아 해야 할 일을 하나씩 적었다. 종이 한 장이 의외로 많은 걸 풀어 주었다.', {bond:1.5, stress:2, ins:1}, 4], b:['말없이 방에 들어간다', '문이 닫히는 소리만 크게 울렸다. 밤늦게야 서로 사과했지만 앙금은 남았다.', {stress:6, bond:-1}, -3]},
  {t:'시댁(처가) 식사', x:lv => `주말에 ${lv.name}의 부모님 댁에 갔다. 상 위에 반찬이 가득했고, 질문도 가득했다. “아이는 언제쯤 생각하니?” 분위기가 순식간에 조용해졌다.`, a:['“아직은 우리 둘이 먼저예요”', '부모님은 아쉬운 표정이었지만 이해해 주셨다. 돌아오는 길에 그가 내 손을 꼭 잡았다.', {bond:1.5, self:2, stress:4}, 4], b:['웃으며 화제를 돌린다', '그는 눈치껏 도와주었지만 집으로 돌아오는 차 안은 조금 어색했다.', {stress:5}, 1]},
  {t:'함께 세우는 계획', x:lv => `${lv.name}가 가계부와 달력을 식탁 위에 펼쳤다. “올해는 뭘 하고 싶어? 네 꿈부터 말해 봐.” 마흔의 나는 이런 질문을 받아 본 적이 없다.`, a:['진심으로 내 꿈을 말한다', '그는 끝까지 들어 주고 메모했다. “그럼 내 계획에 네 꿈의 자리를 만들게.” 눈물이 날 뻔했다.', {self:3, bond:2, stress:-2}, 6], b:['“당신 꿈부터 말해 봐”라고 돌려준다', '그는 신나게 계획을 늘어놓았다. 나는 웃으며 들었다. 어딘가 내가 지워지는 느낌이 스쳤다.', {self:-1, stress:2}, 2]},
];
// ── 결혼 뒤 '부부의 밤'(데이트 대신): 키스한다 → 볼을 만진다 → 어루만진다, 한 단계씩 고르고 언제든 멈출 수 있다 ──
const NIGHT_STEPS = [
  {t:'키스한다', stop:'오늘은 안아 주기만 한다', img:'n1', res:'kiss',
   x:(n, j) => `불 꺼진 침실. ${n}${j('이', '가')} 침대 맡에 앉아 내 얼굴을 가만히 본다. 하루의 피로가 천천히 가라앉는다.`,
   go:(n) => `${n}의 입술이 내 입술에 가볍게 닿았다가 떨어진다. 짧은데도 심장이 오래 뛴다.`,
   no:(n) => `${n}의 품에 얼굴을 묻었다. 아무 말도 하지 않았는데, 오늘 하루가 전부 괜찮아졌다.`},
  {t:'볼을 만진다', stop:'여기까지 — 손을 잡고 눕는다', img:'n3', res:'n3',
   x:(n, j) => `${n}${j('이', '가')} 내 눈을 바라본다. 서로의 숨이 닿는 거리에서 말이 필요 없어진다.`,
   go:(n) => `손끝으로 ${n}의 볼을 쓸어 보았다. 그가 눈을 감고 내 손에 얼굴을 기댄다. “…좋다.” 낮은 속삭임.`,
   no:(n) => `${n}의 손을 잡고 나란히 누웠다. 천장의 작은 불빛이 별처럼 번진다.`},
  {t:'어루만진다', stop:'여기까지 — 이마를 맞대고 잠든다', img:'n4', res:'n4',
   x:(n, j) => `${n}${j('이', '가')} 이마를 맞대고 나직이 웃는다. 이 사람과 같은 집에서 눈을 뜬다는 게 아직도 신기하다.`,
   go:(n) => `${n}의 머리와 등을 천천히 쓸어내렸다. 그가 한숨처럼 웃으며 나를 더 가까이 안는다. 램프가 꺼지고, 서로의 온기만 남는다.`,
   no:(n) => `이마를 맞댄 채 잠이 들었다. 내일 아침에도 이 사람 옆에서 눈을 뜰 것이다.`},
];
function marriedNightSteps(S, id){
  const lv = LOVERS[id], v = S.love[id], j = (a, b) => (/[가-힣]$/.test(lv.name) && ((lv.name.charCodeAt(lv.name.length - 1) - 0xAC00) % 28 === 0) ? b : a);
  // 부부의 밤 전용 그림 mn_<id>_1~4 (없으면 첫날밤 그림으로 대신)
  const OLD = {1:'n1', 2:'kiss', 3:'n3', 4:'n4'};
  const img = k => [`art/mn_${id}_${k}.webp`, `art/ms_${id}_${OLD[k]}.webp`, `art/ms_${id}_night2.webp`];
  return NIGHT_STEPS.map((st, i) => {
    const last = i === NIGHT_STEPS.length - 1;
    return {id:`mnight_${id}_${S.m}_${i}`, lover:id, speaker:lv.name, title:'부부의 밤', place:'night', img:img(i + 1), text:S => st.x(lv.name, j), resultImgs:[img(i + 2), img(i + 1)],
      choices:[
        {label:st.t, sub:last ? '호감 ↑↑ · 스트레스 ↓↓' : '다음 단계로 · 호감↑ · 스트레스↓', run(S){ const ch = []; S._nightGo = !last; v.nights = (v.nights || 0) + 1; addAff(S, id, 2 + i, ch); fx(S, {stress:-(3 + i), bond:0.6}, ch); return {text:st.go(lv.name), chips:ch, mood:'shy'}; }},
        {label:st.stop, sub:'호감 ↑ · 스트레스 ↓ · 체력 ↑', run(S){ const ch = []; S._nightGo = false; addAff(S, id, 1.5, ch); fx(S, {stress:-5, hp:2}, ch); return {text:st.no(lv.name), chips:ch}; }},
      ]};
  });
}
function marriedEvent(S){
  const id = S.married; if(!id) return null; const v = S.love[id]; if(!v || v.stage !== 3) return null;
  const n = v.mlife || 0; if(n >= MARRIED_SCENES.length) return null;
  if(S.m - Math.max(v.marriedAt || 0, v.lastMlife == null ? -9 : v.lastMlife) < 4) return null;
  const lv = LOVERS[id], sc = MARRIED_SCENES[n];
  const run = cfg => ({label:cfg[0], sub:cfg[3] > 0 ? '호감↑' : '호감↓', run(S){ const ch = []; v.mlife = n + 1; v.lastMlife = S.m; addAff(S, id, cfg[3], ch); fx(S, cfg[2], ch); v.lastDate = S.m; return {text:cfg[1], chips:ch}; }});
  return {id:`married_${id}_${n}`, lover:id, speaker:lv.name, title:sc.t, place:'room', img:'art/lv_' + id + '.webp', text:S => sc.x(lv), choices:[run(sc.a), run(sc.b)]};
}
function divorceEvent(S){
  const id = S.married; if(!id) return null; const v = S.love[id]; if(!v || v.stage !== 3 || S.seen['divorce_' + id]) return null;
  const jw = id === 'jaewoo'; if(!(v.aff < 28 || (jw && S.m >= 84 && v.aff < 55 && R() < 0.35))) return null;
  const lv = LOVERS[id];
  return {id:'divorce_' + id, lover:id, once:true, speaker:lv.name, title:jw ? '다시 같은 이야기' : '식어 버린 식탁', place:'room', img:'art/lv_' + id + '.webp',
    text:S => jw ? '“이번 앨범만 지나면 네가 하고 싶은 걸 하게 해 줄게.” 재우가 같은 말을 또 했다. 마흔의 나는 이 문장을 십 년 들었다. 자신의 꿈을 위해 내 희생을 당연하게 여기던 사람. 이번에도 같은 길이다.' : `${lv.name}와 같은 집에 사는데 말을 하지 않은 지 한 달이 넘었다. 식탁 위의 반찬은 줄었고, 서로의 이름을 부르는 횟수도 줄었다. 결국 그가 먼저 말했다. “우리, 이대로 괜찮은 걸까.”`,
    choices:[
      {label:'이혼한다', sub:'새로 시작 · 마음↑ 스트레스↑', run(S){ const ch = []; endRelation(S, id, ch); S.divorced = true; fx(S, {self:5, bond:-6, stress:10}, ch); S.album.push(`${josa(lv.name, '과', '와')} 이혼`); const np = promoteSecret(S); return {text:jw ? '“이번엔 내가 서류에 먼저 도장을 찍을게.” 마흔에 겪은 일을 서른도 되기 전에 끝냈다. 눈물이 났지만 숨이 트였다. 이번엔 내 선택이었다.' : '“우리 여기까지 하자.” 그는 오래 말이 없다가 고개를 끄덕였다. 서류 한 장으로 끝나는 일이 이렇게 길게 아팠다.', chips:ch}; }},
      {label:'마지막으로 노력해 본다', sub:'호감 +10 · 시간이 필요', run(S){ const ch = []; v.aff = Math.max(v.aff, 36); addAff(S, id, 10, ch); fx(S, {stress:6, bond:1}, ch); S.seen['divorce_' + id] = false; v.mlife = (v.mlife || 0); v.tried = (v.tried || 0) + 1; if(v.tried >= 2) S.seen['divorce_' + id] = true; return {text:'“우리 상담이라도 받아 볼까.” 먼저 손을 내밀었다. 그는 놀란 얼굴로 내 손을 마주 잡았다. 달라질지는 모른다. 그래도 이번엔 말을 해 보기로 했다.', chips:ch}; }},
    ]};
}

// ── 연애 이벤트 진입점 ───────────────────────────────────────────────
function romance3Event(S){
  return discoveryEvent(S) || divorceEvent(S) || weddingEvent(S) || cheatedOnEvent(S) || secretEvent(S) || marriedEvent(S);
}
