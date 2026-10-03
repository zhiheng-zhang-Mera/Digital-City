// RS-290 REPAIR-VERIFICATION GATE (Mech).
//
// This is the re-review, made mechanical and repair-direction-agnostic. It does not care HOW the
// defects are fixed; it asserts the PROPERTY each finding is about, so any sound repair passes and
// every unsound one fails.
//
//   UTOPIA_ROOT=/path/to/utopia node PROBE_repair_verification.mjs
//
// At the reviewed head 2a3ae30 this reports F1 FAIL, F2 FAIL, F3 FAIL and exits 1. After a correct
// repair it reports all three PASS while the REGRESSION section still passes, which is the evidence a
// re-review needs: each finding fails before and passes after, with nothing sound broken in between.
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

const ROOT = process.env.UTOPIA_ROOT ?? 'D:/A-utopia/.runtime/worktrees/RS-290-review';
const load = (rel) => import(pathToFileURL(join(ROOT, rel)).href);

const results = [];
const check = (id, ok, detail) => { results.push({id, ok}); console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${id}${detail ? ' - ' + detail : ''}`); };
const h = (t) => console.log('\n=== ' + t + ' ===');

const registry = await load('contracts/general-ai-registry-v1/records.mjs');
const availability = await load('contracts/general-ai-registry-v1/availability.mjs');
const pressure = await load('city/00-foundation/01-city-core/fleet-routing/pressure.mjs');
const routing = await load('city/00-foundation/01-city-core/fleet-routing/routing-sequence.mjs');
const bridge = await load('contracts/rs-cross-device-return-v1/return-bridge.mjs');
const P = await load('contracts/rs-presentation-contract-v1/presentation.mjs');
const {TERMS, TERM_CLASS, PRESENTATION_STATES, ALLOWED_ACTIONS, TERM_OF, presentTerm, presentState, projectStatus} = P;

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

console.log('RS-290 repair-verification gate against', ROOT);

/* ------------------------------------------------------------------ F1 */
h('F1: a raw source word must never silently yield a term other than its prescribed mapping');
{
  const termSet = new Set(TERMS);
  const violations = [];
  for (const [src, words] of Object.entries(SOURCES)) {
    for (const w of words) {
      if (!termSet.has(w)) continue;                       // no collision: the guard already refuses it
      const prescribed = presentTerm(src, w);
      try {
        const dto = projectStatus({providerTerms: [w]});
        // Accepted. Sound only if accepting it lands on the SAME term the mapping prescribes.
        if (dto.providers[0].term !== prescribed) violations.push(`${src}.${w}: prescribed ${prescribed}, accepted as ${dto.providers[0].term}`);
      } catch { /* refused: correct, and the strongest possible outcome */ }
    }
  }
  check('F1 no raw word is accepted as a different term than prescribed', violations.length === 0, violations.join(' | ') || 'all colliding words refused or identity-mapped');
}

/* ------------------------------------------------------------------ F2 */
h('F2: a terminal outcome must not be reported as WAITING_USER, and a failure must offer RETRY');
{
  const combos = [
    {terminal: true, failed: true, waitingUser: true},
    {terminal: true, waitingUser: true},
    {terminal: true, cancelled: true, waitingUser: true},
  ];
  const bad = [];
  for (const c of combos) {
    let dto;
    try { dto = projectStatus(c); } catch { continue; }    // throwing on the combination is a sound repair
    if (dto.state === 'WAITING_USER') bad.push(`masked: ${JSON.stringify(c)} -> ${dto.state}`);
    if (c.failed && !dto.actions.includes('RETRY')) bad.push(`no RETRY: ${JSON.stringify(c)} -> ${JSON.stringify(dto.actions)}`);
  }
  check('F2 terminal outcomes win over waitingUser, and failures offer RETRY', bad.length === 0, bad.join(' | ') || 'terminal precedence or rejection in place');
}

/* ------------------------------------------------------------------ F3 */
h('F3: the FRESHNESS collapse must be split, or explicitly declared');
{
  // SCOPED DELIBERATELY, and the first draft of this gate got it wrong in the same way my first probe
  // did: it flagged ALL 13 same-vocabulary shared targets, which would have demanded that Alien either
  // remove intended category merges or declare them, i.e. widen the repair beyond the observed defect
  // that section 8 forbids. Most of the 13 are intended: ABSENCE_CODES -> ABSENT/REMOVED preserves
  // exactly the distinction the module says RS-201's tombstone design needs, and FRESH_PROBE /
  // CACHED_WITHIN_TTL -> SELECTABLE is one meaning, "data current enough". Only the FRESHNESS pair
  // loses a distinction the module argues for elsewhere, so only that pair is asserted.
  const decl = P.INTRA_VOCABULARY_COLLAPSES ?? P.DECLARED_COLLAPSES ?? null;
  const stale = presentTerm('RS-201.FRESHNESS', 'STALE');
  const unknown = presentTerm('RS-201.FRESHNESS', 'UNKNOWN');
  const split = stale !== unknown;
  const declared = !!decl && decl.some((d) => String(d.source ?? d).includes('FRESHNESS'));
  console.log(`  STALE -> ${stale}   UNKNOWN -> ${unknown}   split=${split}   declared=${declared}`);
  check('F3 FRESHNESS.STALE is distinguishable from FRESHNESS.UNKNOWN, or the collapse is declared',
    split || declared,
    split ? 'split into distinct terms' : (declared ? 'collapse declared' : 'still collapsed and undeclared'));

  // Informational only: a reader can judge these rather than take the gate's word for them.
  const others = [];
  for (const [src, words] of Object.entries(SOURCES)) {
    if (src === 'RS-201.FRESHNESS') continue;
    const seen = new Map();
    for (const w of words) {
      const t = TERM_OF[src][w];
      if (seen.has(t) && seen.get(t) !== w) others.push(`${src}: ${seen.get(t)}/${w} -> ${t}`);
      else seen.set(t, w);
    }
  }
  console.log(`  INFO: ${others.length} further same-vocabulary shared targets, NOT asserted as defects`);
  console.log('        (intended category merges - listed so a reader can disagree):');
  for (const o of others) console.log('          ' + o);
}

/* ------------------------------------------------------- REGRESSION (was sound, must stay sound) */
h('REGRESSION: properties independently verified as sound at 2a3ae30 must still hold');
{
  let bad = 0;
  for (const t of TERMS) {
    const dto = projectStatus({providerTerms: [t], terms: [t]});
    if (!PRESENTATION_STATES.includes(dto.state)) bad++;
    if (dto.actions.some((a) => !ALLOWED_ACTIONS.includes(a))) bad++;
    if (dto.provider_choice_taken !== false) bad++;
  }
  check('output totality over all declared terms', bad === 0, `${TERMS.length} terms swept, ${bad} violations`);

  check('every declared term is classed', TERMS.every((t) => TERM_CLASS[t]));
  check('TERM_CLASS has no keys outside TERMS', Object.keys(TERM_CLASS).every((k) => TERMS.includes(k)));
  const produced = new Set(Object.values(TERM_OF).flatMap((x) => Object.values(x)));
  check('every declared term is reachable from a mapping', TERMS.every((t) => produced.has(t)),
    TERMS.filter((t) => !produced.has(t)).join(',') || 'none unproduced');

  let fab = 0;
  for (const a of [{}, {terms: []}, {providerTerms: ['SELECTABLE']}, {terms: ['SELECTABLE', 'REMOTE_ONLINE']}, {terminal: false}, {waitingUser: false}]) {
    if (projectStatus(a).state === 'COMPLETED') fab++;
  }
  check('no input fabricates COMPLETED without terminal:true', fab === 0, `${fab} fabrications`);

  check('presentState always yields a declared state',
    [[], ['SELECTABLE'], ['AT_CAPACITY'], ['FRESHNESS_UNKNOWN'], ['REMOTE_STATE_UNKNOWN']]
      .every((terms) => PRESENTATION_STATES.includes(presentState({terms}))));
}

const failed = results.filter((r) => !r.ok);
console.log(`\n=== VERDICT: ${results.length - failed.length}/${results.length} checks pass ===`);
if (failed.length) {
  console.log('FAILING: ' + failed.map((f) => f.id).join(', '));
  console.log('RS-290 repair is NOT verified. review_complete stays false.');
  process.exitCode = 1;
} else {
  console.log('All repair checks pass. Mech can re-review and, if the diff is sound, issue the verdict.');
}
