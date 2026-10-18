// 자동 플레이 테스트: node sim.mjs  → errors {} 이어야 한다
import fs from 'fs'; import vm from 'vm';
const files = ['src/engine.js', 'src/idol/idol_core.js', 'src/data/lovers.js', 'src/data/romance.js', 'src/data/romance2.js', 'src/data/romance3.js', 'src/data/intimacy_a.js', 'src/data/intimacy_b.js', 'src/data/intimacy_c.js', 'src/data/intimacy2_a.js', 'src/data/intimacy2_b.js', 'src/data/intimacy2_c.js', 'src/data/intimacy.js', 'src/data/regret.js', 'src/data/lstory_core.js', 'src/data/lstory_a.js', 'src/data/lstory_b.js', 'src/data/lstory_c.js', 'src/data/lstory_d.js', 'src/data/campus_scenes.js', 'src/data/campus.js', 'src/data/city_friends.js', 'src/data/city_lovers_a.js', 'src/data/city_lovers_b.js', 'src/data/city_lovers_c.js', 'src/data/city.js', 'src/data/city_npc.js', 'src/data/career2.js', 'src/data/jobs2.js', 'src/data/events.js', 'src/idol/events_a.js', 'src/idol/events_b.js', 'src/data/story_core.js', 'src/data/special_a.js', 'src/data/special_b.js', 'src/data/special_c.js', 'src/idol/story_a.js', 'src/idol/story_b.js', 'src/idol/story_c.js', 'src/data/story.js', 'src/data/calls.js', 'src/idol/endings.js', 'src/idol/idol_wire.js'];
const src = files.filter(f => fs.existsSync(f)).map(f => fs.readFileSync(f, 'utf8')).join('\n');
const ctx = {console, Math}; vm.createContext(ctx);
vm.runInContext(src + '\n;globalThis.E={isIdol,isOut,isTrainee,IDOL,newGame,doAction,settle,fixedEvents,pickEvent,computeEnding,ACTS,ENDINGS,ORIGINS,REGRETS,MAJORS,CAREERS,inLawSchool,LOVERS,contactsOf,callEvent,tryCall,callsLeft,EVENTS,ENDING_IDS,finalPillars,dateTarget,TOTAL_MONTHS,actName};', ctx);
const E = ctx.E;
const games = +process.argv[2] || 1500, strat = process.argv[3] || 'mix';
const errs = {}, ends = {}, seenEv = {}; let bad = 0;
const rnd = a => a[Math.floor(Math.random() * a.length)];
function play(S, ev, mode){
  if(typeof ev.text !== 'function') throw new Error('text ' + ev.id); const t = ev.text(S); if(typeof t !== 'string') throw new Error('text-out ' + ev.id);
  S.seen[ev.id] = true; S.cd[ev.id] = S.m; seenEv[ev.id.replace(/_\d+$/, '')] = (seenEv[ev.id.replace(/_\d+$/, '')] || 0) + 1;
  let cs = ev.choices; if(mode === 'smart' || mode === 'grind' || mode === 'plan'){ const f = cs.filter(c => !/선명도 -|미래/.test(c.sub || '')); if(f.length) cs = f; } const c = rnd(cs); const out = c.run(S);
  if(!out || typeof out.text !== 'string') throw new Error('out ' + ev.id);
}
function chooseAct(S, i, mode){
  const ok = id => { const a = E.ACTS[id]; return a && !(a.req && a.req(S)) && (!a.cost || a.cost <= S.cash) && (a.slots || 1) <= 3 - i; };
  if(mode === 'random'){ const ids = Object.keys(E.ACTS).filter(ok); return rnd(ids); }
  if(mode === 'plan'){ if(E.isIdol(S) || i === 2) mode = 'smart'; else mode = 'grind'; }
  if(mode === 'grind'){ if(S.hp < 30 || S.stress > 75) return 'rest'; if(S.cash < 20 && ok('cafe')) return 'cafe'; if(S.cash < 20 && ok('cf')) return 'cf';
    const pool = (E.isIdol(S) ? ['musicshow', 'vocal', 'dance', 'variety', 'fansign', 'friends', 'journal'] : E.isOut(S) ? ['reaudition', 'vocal', 'dance'] : ['vocal', 'dance', 'stage', 'vocal', 'dance', 'stage', 'style']).filter(ok); return pool.length ? rnd(pool) : 'rest'; }
  // smart: 가장 낮은 축을 올리되, 체력·돈을 챙긴다
  if(S.hp < 30 || S.stress > 75) return 'rest';
  if(S.cash < 80 && ok('cf')) return 'cf';
  if(S.cash < 80) return ok('cafe') ? 'cafe' : 'rest';
  
  const P = {work:S.work, bond:S.bond, self:S.self}; const low = Object.keys(P).sort((a, b) => P[a] - P[b])[0];
  const pools = {
    work: E.isIdol(S) ? ['musicshow', 'vocal', 'dance', 'variety', 'fansign'] : E.isOut(S) ? ['reaudition', 'vocal', 'dance'] : ['vocal', 'dance', 'stage', 'vocal', 'dance', 'write'],
    bond: ['friends', 'family', 'date', 'live'],
    self: ['journal', 'exercise', 'hobby', 'style', 'travel'],
  };
  const pool = pools[low].filter(ok); return pool.length ? rnd(pool) : (ok('rest') ? 'rest' : 'rest');
}
for(let g = 0; g < games; g++){
  const S = E.newGame('테스트', rnd(E.ORIGINS).id, rnd(E.REGRETS).id, rnd(E.MAJORS).id); const mode = strat === 'mix' ? (g % 3 === 0 ? 'random' : 'smart') : strat; S._mode = mode;
  try{
    while(S.m < E.TOTAL_MONTHS && !S.ending){
      for(let i = 0; i < 3; i++){ const id = chooseAct(S, i, mode); if(!id || !E.ACTS[id]) throw new Error("noact cash=" + S.cash + " hp=" + S.hp + " mode=" + mode + " i=" + i); const a = E.ACTS[id]; const res = E.doAction(S, id); i += a.slots - 1; if(res.burnout) break; }
      E.settle(S); if(S.ending) break;
      const fx_ = E.fixedEvents(S); for(const f of fx_) play(S, f, mode); if(S.ending) break;
      const ev = fx_.length >= 2 ? null : E.pickEvent(S); if(ev && Math.random() < 0.7) play(S, ev, mode);
      for(const k of ['hp', 'stress', 'clarity', 'work', 'bond', 'self']) if(!(S[k] >= 0 && S[k] <= 100)){ bad++; throw new Error('range ' + k + '=' + S[k]); }
      S.m++;
    }
    { const I = E.IDOL(S); const o = (globalThis.dstat ||= {})[mode] ||= {n:0, team:0, surv:0, reaud:0, never:0, debutM:0, fans:0, wins:0, daesang:0, bonsang:0, rank18:0}; o.n++; (o.sc ||= []).push(I.evals.filter(e => e.m >= 13 && e.m <= 18).reduce((a, e, _, arr) => a + e.score / arr.length, 0)); const r6 = I.evals.filter(e => e.m <= 18).slice(-6); o.rank18 += r6.length ? r6.reduce((a, e) => a + e.rank, 0) / r6.length : 12;
      if(I.debutAt == null) o.never++; else { o.debutM += I.debutAt; if(I.group === '루미너스') o.team++; else if(I.group === '프리즘') o.surv++; else o.reaud++; } o.fans += I.fans; o.wins += I.wins; o.daesang += I.awards.filter(a => a.includes('대상')).length; o.bonsang += I.awards.filter(a => a.includes('본상')).length; }
    const e = E.computeEnding(S); if(!E.ENDINGS[e]) throw new Error('ending ' + e);
    (globalThis.byTrack ||= {}); if(mode==='smart'){ const k=(S.track||'none'); const o=globalThis.byTrack[k] ||= {n:0,free:0,debt:0,cash:0,work:0}; o.n++; if(e.startsWith('free_')) o.free++; if(e==='ret_debt') o.debt++; o.cash+=S.cash; o.work+=S.work; } if(mode==='smart' && S.track==='lawyer'){ (globalThis.lawEnds ||= {})[e]=(globalThis.lawEnds[e]||0)+1; (globalThis.lawStat ||= []).push([Math.round(S.work),Math.round(S.bond),Math.round(S.self),Math.round(S.cash),S.borrowed]); } const key = mode + ':' + e; (globalThis.stat ||= {})[mode] ||= {n:0,w:0,b:0,s:0,cash:0,clar:0}; const st_=globalThis.stat[mode]; st_.n++; st_.w+=S.work; st_.b+=S.bond; st_.s+=S.self; st_.cash+=S.cash; st_.clar+=S.clarity; ends[key] = (ends[key] || 0) + 1;
  }catch(e){ const k = e.message.split('\n')[0]; errs[k] = (errs[k] || 0) + 1; if(errs[k] === 1) console.log('ERR', e.stack.split('\n').slice(0, 3).join(' | ')); }
}
const free = {}; for(const k in ends){ const [m, e] = k.split(':'); free[m] = free[m] || {t: 0, f: 0}; free[m].t += ends[k]; if(e.startsWith('free_')) free[m].f += ends[k]; }
console.log('errors', JSON.stringify(errs)); console.log('freedom rate', JSON.stringify(Object.fromEntries(Object.entries(free).map(([m, v]) => [m, (100 * v.f / v.t).toFixed(1) + '% of ' + v.t]))));
console.log('endings', JSON.stringify(ends, null, 0)); for(const m in globalThis.stat||{}){ const t=globalThis.stat[m]; console.log(m,'avg work',(t.w/t.n).toFixed(0),'bond',(t.b/t.n).toFixed(0),'self',(t.s/t.n).toFixed(0),'cash',(t.cash/t.n).toFixed(0),'clarity',(t.clar/t.n).toFixed(0)); }
for(const [k,o] of Object.entries(globalThis.byTrack||{})) console.log('track',k.padEnd(9),'n',o.n,'free%',(100*o.free/o.n).toFixed(0),'debt%',(100*o.debt/o.n).toFixed(0),'avgCash',(o.cash/o.n).toFixed(0),'avgWork',(o.work/o.n).toFixed(0));
if(globalThis.lawEnds){ console.log('lawyer endings',JSON.stringify(globalThis.lawEnds)); const a=globalThis.lawStat; const m=i=>Math.round(a.reduce((x,y)=>x+y[i],0)/a.length); console.log('lawyer avg work/bond/self/cash/borrowed',m(0),m(1),m(2),m(3),m(4)); }
console.log('events', JSON.stringify(seenEv));

if(globalThis.dstat) for(const m in globalThis.dstat){ const o = globalThis.dstat[m], d = o.n - o.never; { const a = o.sc.sort((x, y) => x - y); console.log('SCORE13-18', m, 'p25', a[Math.floor(a.length*.25)].toFixed(1), 'p50', a[Math.floor(a.length*.5)].toFixed(1), 'p75', a[Math.floor(a.length*.75)].toFixed(1), 'p90', a[Math.floor(a.length*.9)].toFixed(1)); } console.log('DEBUT', m, 'n', o.n, 'team', (100*o.team/o.n).toFixed(0)+'%', 'survival', (100*o.surv/o.n).toFixed(0)+'%', 'reaudition', (100*o.reaud/o.n).toFixed(0)+'%', 'never', (100*o.never/o.n).toFixed(0)+'%', 'avgDebutM', d ? (o.debutM/d).toFixed(0) : '-', 'rank18', (o.rank18/o.n).toFixed(1), 'fans', (o.fans/o.n).toFixed(0), 'wins', (o.wins/o.n).toFixed(1), 'daesang', (o.daesang/o.n).toFixed(2), 'bonsang', (o.bonsang/o.n).toFixed(2)); }
