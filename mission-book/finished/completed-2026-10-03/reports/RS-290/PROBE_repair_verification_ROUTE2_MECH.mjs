// RS-290 REPAIR-VERIFICATION GATE — ROUTE 2 (Mech, extended after the repair).
//
// Alien took route 2: provenance decides meaning, so `projectStatus` now takes REFS
// (`termRef(source, word)`) and REFUSES the removed bare-word parameters rather than ignoring them.
// I pre-committed to extending this gate if route 2 were taken, so this is my own instrument rather
// than a copy of Alien's adaptation - two independent instruments that agree are worth more than one.
//
// A flaw Alien found in my FIRST gate is fixed here, and it deserves naming because it was a real
// weakness in my instrument: my F1 accepted "the bare word was refused" as a PASS, and under a
// provenance API refusing a bare word is trivially true and never exercises the mapping - a vacuous
// pass. F1 below therefore requires the REF to map to the term its vocabulary prescribes.
//
//   UTOPIA_ROOT=/path/to/utopia node PROBE_repair_verification_ROUTE2_MECH.mjs
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

const ROOT = process.env.UTOPIA_ROOT ?? 'D:/A-utopia/.runtime/worktrees/RS-290-review';
const load = (rel) => import(pathToFileURL(join(ROOT, rel)).href);

const results = [];
const check = (id, ok, detail) => { results.push({id, ok}); console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${id}${detail ? ' - ' + detail : ''}`); };
const h = (t) => console.log('\n=== ' + t + ' ===');
const threw = (fn) => { try { fn(); return false; } catch { return true; } };

const registry = await load('contracts/general-ai-registry-v1/records.mjs');
const availability = await load('contracts/general-ai-registry-v1/availability.mjs');
const pressure = await load('city/00-foundation/01-city-core/fleet-routing/pressure.mjs');
const routing = await load('city/00-foundation/01-city-core/fleet-routing/routing-sequence.mjs');
const bridge = await load('contracts/rs-cross-device-return-v1/return-bridge.mjs');
const P = await load('contracts/rs-presentation-contract-v1/presentation.mjs');
const {TERMS, TERM_CLASS, PRESENTATION_STATES, ALLOWED_ACTIONS, TERM_OF, INTENDED_COLLAPSES,
  presentTerm, termRef, presentState, projectStatus} = P;

const SOURCES = {
  'RS-201.AVAILABILITY_REASONS': registry.AVAILABILITY_REASONS,
  'RS-201.CHANNEL_READINESS': registry.CHANNEL_READINESS,
  'RS-201.FRESHNESS': registry.FRESHNESS,
  'RS-201.ENABLEMENT': registry.ENABLEMENT,
  'RS-201.PROBE_OUTCOMES': availability.PROBE_OUTCOMES,
  'RS-202.ELIGIBILITY_REASONS': pressure.ELIGIBILITY_REASONS,
  'RS-202.REACHABLE_STATES': pressure.REACHABLE_STATES,
  'RS-202.REFUSING_STATES': pressure.REFUSING_STATES,
  'RS-202.ROUTE_STAGES': routing.ROUTE_STAGES,
  'RS-203.REMOTE_STATES': bridge.REMOTE_STATES,
  'RS-203.UNAVAILABILITY_DOMAINS': bridge.UNAVAILABILITY_DOMAINS,
  'RS-201.ABSENCE_CODES': registry.ABSENCE_CODES,
};

console.log('RS-290 route-2 repair gate (Mech) against', ROOT);

/* ------------------------------------------------------------------ F1 */
h('F1: provenance decides - the REF must map to the term its vocabulary prescribes');
{
  const termSet = new Set(TERMS);
  const wrong = [];
  let exercised = 0;
  for (const [src, words] of Object.entries(SOURCES)) {
    for (const w of words) {
      // EVERY word, not only colliding ones: the mapping is exercised for all of them.
      const prescribed = presentTerm(src, w);
      const dto = projectStatus({providerRefs: [termRef(src, w)]});
      exercised++;
      const got = dto?.providers?.[0]?.term;
      if (got !== prescribed) wrong.push(`${src}.${w}: prescribed ${prescribed}, got ${got}`);
      // The defect's exact shape: a raw word colliding with a term name must NOT be able to defeat
      // the mapping. Highlighted separately so the original finding stays visible.
      if (termSet.has(w) && got !== prescribed) wrong.push(`COLLISION ${src}.${w}: prescribed ${prescribed}, got ${got}`);
    }
  }
  check('F1 every (source,word) ref maps to its prescribed term', wrong.length === 0,
    wrong.join(' | ') || `${exercised} refs exercised across ${Object.keys(SOURCES).length} vocabularies`);

  // The old API must be REFUSED, not silently ignored - otherwise a caller receives a DTO computed
  // from nothing, which is how the original hole would return through a different door.
  check('F1 removed bare-word parameters are refused, not ignored',
    threw(() => projectStatus({providerTerms: ['SELECTABLE']}))
    && threw(() => projectStatus({terms: ['SELECTABLE']}))
    && threw(() => projectStatus({routeStage: 'QUEUED'})));
  check('F1 a bare string is refused where a ref is required',
    threw(() => projectStatus({providerRefs: ['DEGRADED']}))
    && threw(() => projectStatus({termRefs: ['SELECTABLE']})));
  check('F1 an unknown source/word is still refused', threw(() => termRef('RS-999.NOPE', 'X')));
}

/* ------------------------------------------------------------------ F2 */
h('F2: a terminal outcome is never reported as WAITING_USER, and a failure offers RETRY');
{
  const bad = [];
  for (const c of [{terminal: true, failed: true, waitingUser: true}, {terminal: true, waitingUser: true},
    {terminal: true, cancelled: true, waitingUser: true}, {terminal: true, failed: true}]) {
    let dto;
    try { dto = projectStatus(c); } catch { continue; }   // rejecting the combination is also sound
    if (dto.state === 'WAITING_USER') bad.push(`masked ${JSON.stringify(c)} -> ${dto.state}`);
    if (c.failed && !dto.actions.includes('RETRY')) bad.push(`no RETRY for ${JSON.stringify(c)}`);
  }
  check('F2 terminal wins over waitingUser and failures keep RETRY', bad.length === 0, bad.join(' | ') || 'terminal precedence in place');
  // Regression: the legitimate waiting case must still work, or the fix over-corrected.
  check('F2 a genuinely waiting non-terminal run still renders WAITING_USER',
    projectStatus({waitingUser: true}).state === 'WAITING_USER');
  check('F2 a genuine failure still renders FAILED with RETRY',
    projectStatus({terminal: true, failed: true}).state === 'FAILED'
    && projectStatus({terminal: true, failed: true}).actions.includes('RETRY'));
}

/* ------------------------------------------------------------------ F3 */
h('F3: STALE split, and the header property actually ASSERTED in both directions');
{
  const stale = presentTerm('RS-201.FRESHNESS', 'STALE');
  const unknown = presentTerm('RS-201.FRESHNESS', 'UNKNOWN');
  check('F3 FRESHNESS.STALE and FRESHNESS.UNKNOWN are distinguishable', stale !== unknown, `STALE -> ${stale}, UNKNOWN -> ${unknown}`);
  check('F3 the split term is declared and classed',
    TERMS.includes(stale) && !!TERM_CLASS[stale], `${stale} class=${TERM_CLASS[stale]}`);

  // Direction 1: every real same-vocabulary collapse must be DECLARED. This is the header's property,
  // quantified over the whole table rather than spot-checked.
  const undeclared = [];
  const realCollapses = new Set();
  for (const [src, words] of Object.entries(SOURCES)) {
    const seen = new Map();
    for (const w of words) {
      const t = TERM_OF[src][w];
      if (seen.has(t) && seen.get(t) !== w) { undeclared.push(`${src}: ${seen.get(t)}/${w} -> ${t}`); realCollapses.add(`${src}|${t}`); }
      else seen.set(t, w);
    }
  }
  const declaredKeys = new Set(Object.entries(INTENDED_COLLAPSES ?? {}).flatMap(([src, m]) => Object.keys(m).map((t) => `${src}|${t}`)));
  const missing = [...realCollapses].filter((k) => !declaredKeys.has(k));
  check('F3 every real same-vocabulary collapse is declared', missing.length === 0 && undeclared.every((u) => declaredKeys.has(u.split(': ')[0] + '|' + u.split('-> ')[1])),
    missing.join(', ') || `${realCollapses.size} collapses, ${declaredKeys.size} declared`);
  console.log(`  INFO: ${realCollapses.size} same-vocabulary collapses exist and each is declared with a reason`);

  // Direction 2: every DECLARED collapse must be REAL - a stale declaration is a claim about the table
  // that is no longer true, which is how a declaration mechanism rots into decoration.
  const stale_ = [...declaredKeys].filter((k) => !realCollapses.has(k));
  check('F3 no declaration is stale (every declared collapse actually exists)', stale_.length === 0, stale_.join(', ') || 'all declarations correspond to a real collapse');
}

/* ------------------------------------------------------- REGRESSION */
h('REGRESSION: properties independently verified as sound must still hold');
{
  // Totality swept through a REAL ref for each declared term, so the check exercises the mapping
  // rather than merely calling the projection with nothing.
  const refForTerm = new Map();
  for (const [src, table] of Object.entries(TERM_OF)) for (const [w, t] of Object.entries(table)) if (!refForTerm.has(t)) refForTerm.set(t, termRef(src, w));
  let tot = 0;
  const unreachable = [];
  for (const t of TERMS) {
    const ref = refForTerm.get(t);
    if (!ref) { tot++; unreachable.push(t); continue; }
    const dto = projectStatus({providerRefs: [ref], termRefs: [ref]});
    if (!PRESENTATION_STATES.includes(dto.state)) tot++;
    if (dto.actions.some((a) => !ALLOWED_ACTIONS.includes(a))) tot++;
    if (dto.provider_choice_taken !== false) tot++;
  }
  check('output totality over every declared term', tot === 0, `${TERMS.length} terms swept, ${tot} violations${unreachable.length ? ' unreachable: ' + unreachable.join(',') : ''}`);
  check('every declared term is classed', TERMS.every((t) => TERM_CLASS[t]));
  check('TERM_CLASS has no keys outside TERMS', Object.keys(TERM_CLASS).every((k) => TERMS.includes(k)));
  const produced = new Set(Object.values(TERM_OF).flatMap((x) => Object.values(x)));
  check('every declared term is reachable from a mapping', TERMS.every((t) => produced.has(t)),
    TERMS.filter((t) => !produced.has(t)).join(',') || 'none unproduced');

  let fab = 0;
  for (const a of [{}, {terminal: false}, {waitingUser: false}]) if (projectStatus(a).state === 'COMPLETED') fab++;
  check('no input fabricates COMPLETED without terminal:true', fab === 0, `${fab} fabrications`);
  const knowledgeTerm = TERMS.find((t) => TERM_CLASS[t] === 'KNOWLEDGE');
  check('presentState always yields a declared state',
    [[], ['SELECTABLE'], ['AT_CAPACITY'], [knowledgeTerm]].every((terms) => PRESENTATION_STATES.includes(presentState({terms}))));
}

const failed = results.filter((r) => !r.ok);
console.log(`\n=== VERDICT: ${results.length - failed.length}/${results.length} checks pass ===`);
if (failed.length) { console.log('FAILING: ' + failed.map((f) => f.id).join(', ')); process.exitCode = 1; }
else console.log('All repair checks pass on route 2. Mech can issue the verdict if the diff is sound.');
