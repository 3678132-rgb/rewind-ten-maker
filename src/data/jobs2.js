// 이직·연봉 협상·새 직업. ENGINE 구간(DOM 금지)
// ── 전환 직업 4종: 처음 구직 때는 못 고르고, 이직으로만 간다 (adv) ──
Object.assign(CAREERS, {
  director:{adv:true, from:['pd'], name:'영화감독', company:'아크 필름', icon:'🎬', desc:'PD의 경험으로 한 편의 영화를 끝까지 책임진다. 입봉까지는 험하다.', key:{neg:.25, dare:.3, sense:.25, ins:.2}, need:60, pay:75, eff:{dare:1.8, sense:1.6, neg:1.4, work:2.8}, stress:9, hp:7, ranks:['연출부', '입봉 감독', '중견 감독', '거장'], gamble:true},
  stylist:{adv:true, from:['designer', 'beauty'], name:'스타일리스트', company:'모드 스튜디오', icon:'💇', desc:'사람의 이미지를 바꾸는 일. 아티스트와 가장 가까운 곳에서 일한다.', key:{sense:.4, charm:.25, neg:.2, skill:.15}, need:50, pay:85, eff:{sense:2.4, charm:1.4, neg:1.0, work:2.5}, stress:8, hp:6, ranks:['어시스턴트', '스타일리스트', '수석 스타일리스트', '스타일 디렉터']},
  brandceo:{adv:true, from:['beauty'], name:'브랜드 대표', company:'내 브랜드', icon:'🏷️', desc:'내 이름을 건 브랜드를 만든다. 성공하면 크지만 매출은 요동친다.', key:{neg:.3, sense:.25, dare:.25, charm:.2}, need:62, pay:60, eff:{neg:1.8, sense:1.6, dare:1.6, work:2.8}, stress:10, hp:6, ranks:['창업 준비', '런칭', '성장기', '브랜드 대표'], gamble:true},
  startup:{adv:true, from:[], name:'스타트업 창업가', company:'내 스타트업', icon:'🚀', desc:'작은 팀과 큰 꿈. 투자와 적자 사이를 걷는다.', key:{dare:.35, skill:.25, neg:.2, ins:.2}, need:58, pay:50, eff:{dare:2.0, skill:1.8, neg:1.2, work:3.0}, stress:11, hp:7, ranks:['공동 창업자', '시드 팀 리더', '시리즈A 대표', '유니콘 창업자'], gamble:true},
});
const ADV_IDS = Object.keys(CAREERS).filter(i => CAREERS[i].adv);
const ALL_JOB_IDS = Object.keys(CAREERS);
// 직업마다 회사 3곳: 대기업 · 중견 · 스타트업 (월급·합격 난이도가 다르다)
const COMPANY_TIERS = [{t:'대기업', pay:1.0, need:6, promo:0}, {t:'중견', pay:0.92, need:0, promo:0}, {t:'스타트업', pay:0.8, need:-8, promo:-3}];
const COMPANY_NAMES = {
  beauty:['루미에르 코스메틱', '벨라시엘 뷰티', '모이 랩'], pd:['아크 스튜디오', '하늘 미디어', '필름모아'], writer:['KBC 방송국', '이야기숲 프로덕션', '대본공방'],
  actor:['스타라이트 엔터테인먼트', '온도 엔터', '무대뒤 컴퍼니'], lawyer:['태성 법무법인', '정담 법률사무소', '바른길 로펌'], dev:['네오플랫', '코드브릿지', '새싹 테크'],
  designer:['메종 오름', '아뜰리에 솔', '실과바늘 스튜디오'], director:['아크 필름', '월광 픽처스', '독립영화 제작소'], stylist:['모드 스튜디오', '라인 스타일', '프리랜서 스타일링'],
  brandceo:['내 브랜드', '공동 브랜드', '온라인 편집숍'], startup:['내 스타트업', '액셀러레이터 입주팀', '공유오피스 1인 창업'],
};
const companyList = id => (COMPANY_NAMES[id] || [CAREERS[id].company]).map((n, i) => Object.assign({name:n, idx:i}, COMPANY_TIERS[i] || COMPANY_TIERS[1]));
const companyOf = S => { const l = companyList(S.track); return l[S.coIdx || 0] || l[0]; };
const coName = S => (S.hired && CAREERS[S.track] ? companyOf(S).name : '');
// 이직 가능한 직업: 지금 직업·로스쿨 제외, 전환 직업은 해당 직업 경력자만
function jobChoices(S){ return ALL_JOB_IDS.filter(i => i !== S.track && i !== 'lawyer' && (!CAREERS[i].adv || (CAREERS[i].from || []).includes(S.track) || (i === 'startup' && S.hired && (S.rank || 0) >= 1))); }
function fitJob(S, id, comp){ let p = fitP(S, id) + (comp ? comp.need / -200 : 0) + (CAREERS[id].from && CAREERS[id].from.includes(S.track) ? 0.1 : 0); if(CAREERS[id].adv) p -= 0.08; return clamp(p, 0.08, 0.92); }
// 이직 시도(이직 활동 한 칸): S.curJob = {id, idx} 로 고른 회사에 지원한다. 합격하면 연봉 협상이 이어진다.
function jobSwitch(S, ch, out){
  const sel = S.curJob, jc = jobChoices(S);
  let id = sel && jc.includes(sel.id) ? sel.id : jc.sort((a, b) => fitP(S, b) - fitP(S, a))[0], idx = sel ? sel.idx : 1;
  const comp = companyList(id)[idx] || companyList(id)[1]; S.tries = (S.tries || 0) + 1;
  const p = fitJob(S, id, comp) * 0.9;
  if(R() < p){ S.pendingNego = {id, idx}; out.note = `${comp.name} 최종 합격! 이제 연봉 협상만 남았다.`; gauge(S, 'work', 2, ch); bump(S, 'stress', 3, ch); }
  else { out.note = `${comp.name} 면접에서 아쉽게 떨어졌다. 현재 직장은 그대로 다닌다.`; }
}
// 합격 후 연봉 협상: 협상·매력·실무 능력치와 현재 직급이 유리하게 작용한다
function negoEvent(S){
  const pn = S.pendingNego; if(!pn) return null;
  const c = CAREERS[pn.id], comp = companyList(pn.id)[pn.idx], from = CAREERS[S.track];
  const base = Math.round(c.pay * comp.pay);
  return {id:`nego_${S.m}`, speaker:'', title:'연봉 협상', place:'cafe', img:'art/bg_office.webp',
    text:S => `${comp.name}에서 최종 합격 연락이 왔다. 인사 담당자가 서류를 펼쳤다. “제시 연봉은 월 ${base}만원 수준입니다. 조정할 부분이 있다면 지금 말씀해 주세요.” 마흔의 나는 이 자리에서 늘 “네, 감사합니다”만 말했다.`,
    choices:[
      {label:'현재 직장의 성과를 근거로 인상을 요구한다', sub:'협상·실무가 높을수록 유리 · 실패하면 제시안 유지', run(S){ const ch = []; const p = clamp(0.35 + ((S.st.neg || 0) * 0.5 + (S.st.skill || 0) * 0.3) / 120 + 0.03 * (S.rank || 0), 0.15, 0.88); let mul = 1, txt;
        if(R() < p){ mul = 1.1 + R() * 0.12; txt = `“현재 맡은 성과와 이직 후 기여를 숫자로 정리했습니다.” 담당자가 잠시 서류를 넘기더니 고개를 끄덕였다. 연봉이 제시안보다 ${Math.round((mul - 1) * 100)}% 높아졌다.`; gauge(S, 'work', 1.5, ch); }
        else { mul = R() < 0.25 ? 0.96 : 1; txt = mul < 1 ? '“이 이상은 어렵습니다.” 분위기가 살짝 식었고 제시안이 조금 낮아졌다. 서둘러 마무리했다.' : '“내부 규정상 어렵습니다.” 담당자는 정중하게 선을 그었다. 제시안 그대로 가기로 했다.'; bump(S, 'stress', 3, ch); }
        return finishSwitch(S, pn, mul, txt, ch); }},
      {label:'제시한 조건을 수락한다', sub:'안정적 · 스트레스 -2', run(S){ const ch = []; bump(S, 'stress', -2, ch); return finishSwitch(S, pn, 1, '“제시해 주신 조건으로 가겠습니다.” 악수가 오갔다. 협상 테이블에서 긴장하지 않은 건 처음이다.', ch); }},
      {label:'연봉 대신 직급·휴가를 협상한다', sub:'직급 보너스(초기 승진 가능성) · 월급 -3%', run(S){ const ch = []; const ok = R() < 0.45 + (S.st.neg || 0) / 260; if(ok){ S.promoAt = (S.m - 8); return finishSwitch(S, pn, 0.97, '“연봉은 그대로 두고 직급 체계와 휴가를 조정해 주세요.” 의외로 담당자가 반색했다. 승진 심사가 빨라지고 휴가가 늘었다.', ch, true); } return finishSwitch(S, pn, 1, '“그건 정해진 체계라서요.” 담당자는 웃으며 거절했다. 조건은 그대로다.', ch); }},
    ]};
}
function finishSwitch(S, pn, mul, txt, ch, fast){
  const c = CAREERS[pn.id], comp = companyList(pn.id)[pn.idx];
  S.track = pn.id; S.coIdx = pn.idx; S.hiredAt = S.m; S.rank = 0; if(!fast) S.promoAt = null; S.salaryMul = mul; S.switched = (S.switched || 0) + 1; S.pendingNego = null;
  S.album.push(`${comp.name}(${c.name})로 이직 — 월급 ${Math.round(c.pay * comp.pay * mul)}만`);
  push(ch, '월급', Math.round(c.pay * comp.pay * mul)); return {text:`${txt}\n\n${comp.name}의 ${c.ranks[0]}로 새 출발한다. 월급은 ${Math.round(c.pay * comp.pay * mul)}만원.`, chips:ch};
}
// 전환 직업의 직장 연인: 원래 직업의 상대와 같은 일터 사람으로 이어진다
LOVERS.dohyun.alt = ['director']; LOVERS.jihu.alt = ['brandceo']; LOVERS.ujin.alt = ['stylist'];
const lvOnTrack = (lv, S) => !!lv.career && (lv.career === S.track || (lv.alt || []).includes(S.track));
