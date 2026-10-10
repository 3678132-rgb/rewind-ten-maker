// 자동 플레이 테스트: node sim.mjs  → errors {} 이어야 한다
import fs from 'fs'; import vm from 'vm';
const files = ['src/engine.js', 'src/data/lovers.js', 'src/data/events.js', 'src/data/endings.js'];
const src = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');
const ctx = {console, Math}; vm.createContext(ctx);
vm.runInContext(src + '\n;globalThis.E={newGame,doAction,settle,fixedEvents,pickEvent,computeEnding,ACTS,ENDINGS,ORIGINS,REGRETS,LOVERS,ENDING_IDS,finalPillars,dateTarget,TOTAL_MONTHS,actName};', ctx);
const E = ctx.E;
const games = +process.argv[2] || 1500, strat = process.argv[3] || 'mix';
const errs = {}, ends = {}, seenEv = {}; let bad = 0;
const rnd = a => a[Math.floor(Math.random() * a.length)];
function play(S, ev, mode){
  if(typeof ev.text !== 'function') throw new Error('text ' + ev.id); const t = ev.text(S); if(typeof t !== 'string') throw new Error('text-out ' + ev.id);
  S.seen[ev.id] = true; S.cd[ev.id] = S.m; seenEv[ev.id.replace(/_\d+$/, '')] = (seenEv[ev.id.replace(/_\d+$/, '')] || 0) + 1;
  let cs = ev.choices; if(mode === 'smart'){ const f = cs.filter(c => !/선명도 -|미래/.test(c.sub || '')); if(f.length) cs = f; } const c = rnd(cs); const out = c.run(S);
  if(!out || typeof out.text !== 'string') throw new Error('out ' + ev.id);
}
function chooseAct(S, i, mode){
  const ok = id => { const a = E.ACTS[id]; return a && !(a.req && a.req(S)) && (!a.cost || a.cost <= S.cash) && (a.slots || 1) <= 3 - i; };
  if(mode === 'random'){ const ids = Object.keys(E.ACTS).filter(ok); return rnd(ids); }
  // smart: 가장 낮은 축을 올리되, 체력·돈을 챙긴다
  if(S.hp < 30 || S.stress > 75) return 'rest';
  if(S.cash < 80 && ok('job') && S.hired) return 'job';
  if(S.cash < 80) return ok('tutor') ? 'tutor' : 'cafe';
  if(!S.hired && S.m >= 36 && ok('jobhunt') && Math.random() < 0.6) return 'jobhunt';
  const P = {work:S.work, bond:S.bond, self:S.self}; const low = Object.keys(P).sort((a, b) => P[a] - P[b])[0];
  const pools = {
    work: S.hired ? ['job', 'job', 'cert', 'project'] : S.m < 48 ? ['study', 'intern', 'project', 'cert'] : ['jobhunt', 'project'],
    bond: ['friends', 'family', 'club', 'date', 'date'],
    self: ['journal', 'exercise', 'hobby', 'style', 'travel'],
  };
  const pool = pools[low].filter(ok); return pool.length ? rnd(pool) : (ok('rest') ? 'rest' : 'rest');
}
for(let g = 0; g < games; g++){
  const S = E.newGame('테스트', rnd(E.ORIGINS).id, rnd(E.REGRETS).id); const mode = strat === 'mix' ? (g % 3 === 0 ? 'random' : 'smart') : strat;
  try{
    while(S.m < E.TOTAL_MONTHS && !S.ending){
      for(let i = 0; i < 3; i++){ const id = chooseAct(S, i, mode); if(!id || !E.ACTS[id]) throw new Error("noact cash=" + S.cash + " hp=" + S.hp + " mode=" + mode + " i=" + i); const a = E.ACTS[id]; const res = E.doAction(S, id); i += a.slots - 1; if(res.burnout) break; }
      E.settle(S); if(S.ending) break;
      const fx_ = E.fixedEvents(S); for(const f of fx_) play(S, f, mode); if(S.ending) break;
      const ev = fx_.length >= 2 ? null : E.pickEvent(S); if(ev && Math.random() < 0.7) play(S, ev, mode);
      for(const k of ['hp', 'stress', 'clarity', 'work', 'bond', 'self']) if(!(S[k] >= 0 && S[k] <= 100)){ bad++; throw new Error('range ' + k + '=' + S[k]); }
      S.m++;
    }
    const e = E.computeEnding(S); if(!E.ENDINGS[e]) throw new Error('ending ' + e);
    const key = mode + ':' + e; (globalThis.stat ||= {})[mode] ||= {n:0,w:0,b:0,s:0,cash:0,clar:0}; const st_=globalThis.stat[mode]; st_.n++; st_.w+=S.work; st_.b+=S.bond; st_.s+=S.self; st_.cash+=S.cash; st_.clar+=S.clarity; ends[key] = (ends[key] || 0) + 1;
  }catch(e){ const k = e.message.split('\n')[0]; errs[k] = (errs[k] || 0) + 1; if(errs[k] === 1) console.log('ERR', e.stack.split('\n').slice(0, 3).join(' | ')); }
}
const free = {}; for(const k in ends){ const [m, e] = k.split(':'); free[m] = free[m] || {t: 0, f: 0}; free[m].t += ends[k]; if(e.startsWith('free_')) free[m].f += ends[k]; }
console.log('errors', JSON.stringify(errs)); console.log('freedom rate', JSON.stringify(Object.fromEntries(Object.entries(free).map(([m, v]) => [m, (100 * v.f / v.t).toFixed(1) + '% of ' + v.t]))));
console.log('endings', JSON.stringify(ends, null, 0)); for(const m in globalThis.stat||{}){ const t=globalThis.stat[m]; console.log(m,'avg work',(t.w/t.n).toFixed(0),'bond',(t.b/t.n).toFixed(0),'self',(t.s/t.n).toFixed(0),'cash',(t.cash/t.n).toFixed(0),'clarity',(t.clar/t.n).toFixed(0)); }
console.log('events', JSON.stringify(seenEv));
