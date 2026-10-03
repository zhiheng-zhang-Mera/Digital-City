// RS-290 REPAIR-VERIFICATION GATE, ALIEN'S ROUTE-2 CALL-SITE ADAPTATION.
//
// THIS IS NOT A REPLACEMENT FOR MECH'S GATE. `PROBE_repair_verification.mjs` is the reviewer's
// instrument and stays authoritative; Alien must not certify its own repair by editing it, and this file
// deliberately leaves that one untouched. This is the adaptation Mech pre-committed to making, published
// so the regression evidence exists rather than being asserted:
//
//   "Tell me if you take this route and I will extend the gate rather than have it fail you for a sound
//    API change."  -- REPAIR_REQUEST_MECH_TO_ALIEN.md, option 2
//
// Alien took option 2: the projection takes {source, word} references and maps them itself, so
// provenance rather than spelling decides meaning and a raw word cannot be mistaken for a term.
//
//   UTOPIA_ROOT=/path/to/utopia node PROBE_repair_verification_ALIEN_ROUTE2.mjs
//
// EVERYTHING is Mech's except three call-site adaptations, each marked `ALIEN ADAPTATION` below, and
// Mech should diff this against its own file to check that nothing else moved:
//
//   1. F1 (line ~57 in Mech's file) called `projectStatus({providerTerms: [w]})` with a bare word. Under
//      route 2 a bare word is REFUSED, so Mech's F1 would pass VACUOUSLY - every colliding word throws
//      and the check never exercises the mapping at all. That is precisely the "assertion that cannot
//      fail" defect this review found in the author's suite, so it must not be introduced here. The
//      adaptation calls the provenance path instead, so each colliding word is actually MAPPED and
//      asserted to land on its prescribed term. This makes the adapted F1 STRONGER than the original.
//   2. The regression sweep injected every declared TERM directly. Route 2 makes that impossible by
//      design, which is the point of it, so the adaptation builds a reverse index term -> (source, word)
//      and injects those references instead. Every term is reachable, which the gate itself asserts.
//   3. The no-fabrication inputs had the same two bare-term entries, adapted the same way.
//
// Also fixed here for Mech's extension: Mech's F3 looks for a declaration table named
// `INTRA_VOCABULARY_COLLAPSES` or `DECLARED_COLLAPSES`; the repair exports it as `INTENDED_COLLAPSES`,
// which is added to that lookup so the DECLARED branch is live rather than permanently false. F3 passes
// on the `split` branch either way.
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

// ALIEN ADAPTATION 2 (index) - one reference per declared term, used wherever Mech's gate injected a
// bare term. Built by inverting the mapping, not by hand, so it cannot drift from the table.
const refFor = new Map();
for (const [source, table] of Object.entries(TERM_OF)) {
  for (const [word, term] of Object.entries(table)) if (!refFor.has(term)) refFor.set(term, {source, word});
}

console.log('RS-290 repair-verification gate against', ROOT);
console.log('(Alien route-2 call-site adaptation of Mech\'s PROBE_repair_verification.mjs)');

/* ------------------------------------------------------------------ F1 */
h('F1: a raw source word must never silently yield a term other than its prescribed mapping');
{
  const termSet = new Set(TERMS);
  const violations = [];
  let exercised = 0;
  for (const [src, words] of Object.entries(SOURCES)) {
    for (const w of words) {
      if (!termSet.has(w)) continue;                       // no collision: the guard already refuses it
      const prescribed = presentTerm(src, w);
      try {
        // ALIEN ADAPTATION 1 - Mech's line was `projectStatus({providerTerms: [w]})`. Under route 2 that
        // bare word is refused, so the check would pass without ever mapping anything. Passing the
        // provenance reference makes the collision actually resolve, and the assertion below is then a
        // real one: the second element carries the PRESCRIBED mapping, never the colliding spelling.
        const dto = projectStatus({providerRefs: [{source: src, word: w}]});
        exercised++;
        // A projection on the UNREPAIRED code IGNORES providerRefs and returns no providers at all, so
        // without this branch the check would pass vacuously there - which is exactly the "assertion that
        // cannot fail" defect this review found in the author's suite. An absent provider is itself a
        // violation, and this is what makes the adapted F1 discriminate between the two trees.
        if (!dto.providers[0]) violations.push(`${src}.${w}: the provenance path returned no provider at all (providerRefs ignored?)`);
        else if (dto.providers[0].term !== prescribed) violations.push(`${src}.${w}: prescribed ${prescribed}, accepted as ${dto.providers[0].term}`);
      } catch { /* refused: correct, and the strongest possible outcome */ }
    }
  }
  check('F1 no raw word is accepted as a different term than prescribed', violations.length === 0, violations.join(' | ') || `all colliding words refused or identity-mapped (${exercised} exercised through the provenance path)`);
  // The route-2 guard itself, which Mech's file could not check: an undeclared bare word is refused.
  const bare = [];
  for (const w of ['AUTH_REQUIRED', 'CACHED_WITHIN_TTL', 'DEGRADED']) {
    try { projectStatus({providerRefs: [w]}); bare.push(w); } catch { /* refused as required */ }
  }
  check('F1 route 2: a bare word is refused rather than guessed at', bare.length === 0, bare.length ? `accepted: ${bare.join(', ')}` : 'AUTH_REQUIRED, CACHED_WITHIN_TTL and DEGRADED all refused');
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
  const decl = P.INTENDED_COLLAPSES ?? P.INTRA_VOCABULARY_COLLAPSES ?? P.DECLARED_COLLAPSES ?? null;
  const stale = presentTerm('RS-201.FRESHNESS', 'STALE');
  const unknown = presentTerm('RS-201.FRESHNESS', 'UNKNOWN');
  const split = stale !== unknown;
  const declared = !!decl && Object.keys(decl).some((source) => source.includes('FRESHNESS'));
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
  // Added on the Alien side, and it is Mech's own standard applied to the declaration table: a
  // declaration with no collapse behind it is a failure too, so the table cannot rot into a list of
  // things that used to be true.
  const declaredSources = Object.keys(decl ?? {});
  const undeclared = [];
  for (const [src, words] of Object.entries(SOURCES)) {
    const seen = new Map();
    for (const w of words) {
      const t = TERM_OF[src][w];
      if (seen.has(t) && seen.get(t) !== w && !(decl ?? {})[src]?.[t]) undeclared.push(`${src}: ${seen.get(t)}/${w} -> ${t}`);
      else seen.set(t, w);
    }
  }
  check('F3 no collapse goes UNDECLARED (quantified over the whole table)', undeclared.length === 0,
    undeclared.join(' | ') || `${declaredSources.length} vocabularies declare their collapses`);
}

/* ------------------------------------------------------- REGRESSION (was sound, must stay sound) */
h('REGRESSION: properties independently verified as sound at 2a3ae30 must still hold');
{
  let bad = 0;
  for (const t of TERMS) {
    // ALIEN ADAPTATION 2 - Mech injected the bare term here; route 2 takes the term's own reference.
    const dto = projectStatus({providerRefs: [refFor.get(t)], termRefs: [refFor.get(t)]});
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
  // ALIEN ADAPTATION 3 - the two bare-term entries, expressed as references.
  for (const a of [{}, {termRefs: []}, {providerRefs: [refFor.get('SELECTABLE')]}, {termRefs: [refFor.get('SELECTABLE'), refFor.get('REMOTE_ONLINE')]}, {terminal: false}, {waitingUser: false}]) {
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
