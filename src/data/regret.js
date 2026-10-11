// 연애 보강: 고백을 거절한 상대 · 이별한 상대의 미련 연락, 직접 이별하기, 남주별 취향 능력치. ENGINE 구간(DOM 금지)
LOVE_STAGE['-2'] = '거절';
// ── 남주별로 좋아하는 능력치 2개: 주인공의 능력치가 높을수록 호감이 빨리 오른다 ──
const LOVE_LIKES = {
  jaewoo:['neg', 'dare'], minjun:['sense', 'ins'], hajin:['dare', 'skill'], taeoh:['sense', 'ins'], raon:['know', 'ins'],
  jihu:['neg', 'know'], dohyun:['dare', 'skill'], sian:['sense', 'ins'], seunghyun:['charm', 'dare'], geonwoo:['know', 'ins'], yuchan:['skill', 'know'], ujin:['sense', 'charm'],
};
const likeNames = id => (LOVE_LIKES[id] || []).map(k => STAT[k]).join(' · ');
function likeFit(S, id){ const ks = LOVE_LIKES[id]; if(!ks) return 0.5; const avg = ks.reduce((t, k) => t + (S.st[k] || 0), 0) / ks.length; return clamp(avg / 65, 0, 1); }
// ── 이별 ──
function breakUp(S, id, ch){
  const v = S.love[id], lv = LOVERS[id]; if(!v) return;
  const was = v.stage;
  endRelation(S, id, ch); v.stage = -9; v.endedBy = 'me'; v.endedAt = S.m; v.regretN = 0;
  fx(S, was === -1 ? {self:1, stress:2} : {bond:-3, stress:6, self:1.5}, ch);
  S.album.push(was === -1 ? `${lv.name}에게 연락을 끊음` : `${josa(lv.name, '과', '와')} 헤어짐`);
  promoteSecret(S);
}
// ── 미련: 거절당한/이별한 상대가 다시 연락해 온다 (가끔) ──
function regretCandidate(S){
  for(const id of LOVER_IDS){ const v = S.love[id]; if(!v) continue;
    const since = v.stage === -2 ? v.rejectedAt : (v.stage === -9 && v.endedBy === 'me' && v.marriedAt == null ? v.endedAt : null);
    if(since == null || v.regretDone) continue;
    if(S.m - since < 6 || S.m - (v.regretAt == null ? -99 : v.regretAt) < 8) continue;
    return id; }
  return null;
}
function regretEvent(S){
  const id = regretCandidate(S); if(!id || R() > 0.4) return null;
  const v = S.love[id], lv = LOVERS[id], rej = v.stage === -2, off = officialOf(S), taken = off && off !== id;
  return {id:`regret_${id}_${S.m}`, lover:id, speaker:lv.name, title:'다시 온 연락', place:'night', img:`art/lv_${id}.webp`, cut:id,
    text:S => rej
      ? `${lv.name}에게서 문자가 왔다. “…잘 지내? 그때 네 대답을 듣고도 계속 생각이 나. 한 번만 만나 줄 수 있어?” 거절했던 사람이다. 마음은 어떨까.`
      : `${lv.name}에게서 오랜만에 연락이 왔다. “…내가 많이 부족했어. 헤어지고 나서야 알겠더라. 다시 얘기해 볼 수 있을까?” 내가 먼저 끊었던 사람이다.`,
    choices:[
      {label:'한 번 만나 본다', sub:'다시 썸 · 호감↑', run(S){ const ch = []; v.regretAt = S.m; v.stage = -1; v.since = S.m; v.aff = Math.max(v.aff, 28); v.rom = Math.min(v.rom || 0, 2); v.rejectedAt = null; addAff(S, id, 4, ch); fx(S, {stress:2}, ch); return {text:`${lv.name}는 약속 장소에 먼저 와 있었다. 어색한 인사 뒤에 한참 말이 없었다. 시간은 많은 걸 바꾸기도, 아무것도 바꾸지 못하기도 한다.`, chips:ch, mood:'shy'}; }},
      taken ? {label:'아무도 모르게 만난다', sub:`${LOVERS[off].name} 몰래 · 들킬 위험↑`, run(S){ const ch = []; v.regretAt = S.m; v.stage = 1; v.since2 = S.m; v.lastDate = S.m; v.aff = Math.max(v.aff, 45); v.secret = true; v.rejectedAt = null; S.secret = S.secret || {}; S.secret[id] = true; addSusp(S, 10); fx(S, {stress:6, self:-2, bond:1}, ch); S.album.push(`${josa(lv.name, '과', '와')} 몰래 다시 만나기 시작함`); return {text:'“아무한테도 말하지 마.” 우리는 같은 말을 동시에 꺼냈다. 설렘 뒤로 죄책감이 따라붙었다.', chips:ch}; }} : null,
      {label:'이제 정리한다', sub:'더 이상 연락하지 않는다', run(S){ const ch = []; v.regretDone = true; v.stage = -9; v.endedBy = 'me'; v.endedAt = S.m; fx(S, {self:2}, ch); return {text:'“…미안해요. 이제 정말 끝이에요.” 답장은 오지 않았다. 번호를 지우고 나니 마음이 가벼워졌다.', chips:ch, mood:'serious'}; }},
    ].filter(Boolean)};
}
// ── 두 남자가 맞붙는다: 바람이 들통난 뒤 두 사람이 마주친다 (누끼 두 명이 마주 서는 장면) ──
function menFightEvent(S){
  const d = S.discPair; if(!d || S.m - d.m < 1 || S.m - d.m > 4) return null;
  const key = `mf_${d.a}_${d.b}_${d.m}`; if(S.seen[key]) return null;
  const A = LOVERS[d.a], B = LOVERS[d.b], va = S.love[d.a], vb = S.love[d.b]; if(!va || !vb) return null;
  return {id:key, speaker:'', title:'마주친 두 사람', place:'night', img:'art/ct_night.webp', cut:d.a, cut2:d.b, cutVar:'b', cut2Var:'b',
    text:S => `${A.name}와 ${B.name}가 한 골목에서 마주쳤다. 서로를 알아보는 데는 일 초도 걸리지 않았다. “…네가 걔구나.” 공기가 팽팽하게 당겨졌다. 내 이름이 두 사람 사이에서 칼날처럼 오갔다. 어떻게 할까.`,
    choices:[
      {label:'둘 사이에 서서 말린다', sub:'호감 -3 · 스트레스↑ · 협상 +', run(S){ const ch = []; addAff(S, d.a, -3, ch); addAff(S, d.b, -3, ch); fx(S, {stress:7, neg:1.2, self:1}, ch); return {text:'“그만해요. 둘 다.” 목소리가 떨렸지만 두 사람이 동시에 입을 닫았다. 멱살을 잡던 손이 천천히 풀렸다. 그날 밤은 아무도 웃지 않았다.', chips:ch, mood:'sad'}; }},
      {label:`${A.name}의 곁에 선다`, sub:`${B.name} 호감 -14`, run(S){ const ch = []; addAff(S, d.a, 5, ch); addAff(S, d.b, -14, ch); fx(S, {stress:5, bond:-1}, ch); return {text:`${B.name}는 말없이 나를 보다가 주먹을 풀고 돌아섰다. “…그래. 알겠어.” 뒷모습이 오래 남았다. ${A.name}의 손은 여전히 떨리고 있었다.`, chips:ch, mood:'serious'}; }},
      {label:`${B.name}의 곁에 선다`, sub:`${A.name} 호감 -14`, run(S){ const ch = []; addAff(S, d.b, 5, ch); addAff(S, d.a, -14, ch); fx(S, {stress:5, bond:-1}, ch); return {text:`${A.name}는 숨을 한 번 삼키고 고개를 돌렸다. “…그게 네 대답이구나.” 먼저 자리를 떠난 건 그였다.`, chips:ch, mood:'serious'}; }},
      {label:'아무 말도 못 하고 도망친다', sub:'스트레스↑↑ · 둘 다 호감 -6', run(S){ const ch = []; addAff(S, d.a, -6, ch); addAff(S, d.b, -6, ch); fx(S, {stress:10, self:-2}, ch); return {text:'숨이 막혀서 뒤돌아 뛰었다. 등 뒤로 두 사람의 목소리가 엉켜 따라왔다. 이틀 동안 휴대폰을 꺼 두었다.', chips:ch, mood:'sad'}; }},
    ]};
}
