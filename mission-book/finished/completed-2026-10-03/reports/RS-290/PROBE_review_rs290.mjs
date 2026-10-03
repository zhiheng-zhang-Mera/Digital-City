// RS-290 review probes (Mech). REPRODUCES the three findings in REVIEW_FINDINGS_MECH.md.
//
// Run against any checkout of the reviewed head:
//
//     UTOPIA_ROOT=/path/to/utopia node PROBE_review_rs290.mjs
//
// Defaults to the review worktree used at review time. Every check imports the REAL modules, so the
// results are properties of the tree and not of a copy of the table.
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

const ROOT = process.env.UTOPIA_ROOT ?? 'D:/A-utopia/.runtime/worktrees/RS-290-review';
const load = (rel) => import(pathToFileURL(join(ROOT, rel)).href);

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
const h = (t) => console.log('\n=== ' + t + ' ===');

h('F1: raw words colliding with a declared TERM name, and where the accepted term differs');
const termSet = new Set(TERMS);
let collide = 0, wrong = 0;
for (const [src, words] of Object.entries(SOURCES)) {
  for (const w of words) {
    if (!termSet.has(w)) continue;
    collide++;
    const prescribed = presentTerm(src, w);
    let accepted = false;
    try { projectStatus({providerTerms: [w]}); accepted = true; } catch { /* refused, correct */ }
    if (accepted && prescribed !== w) {
      wrong++;
      const raw = projectStatus({providerTerms: [w]});
      const mapped = projectStatus({providerTerms: [prescribed]});
      console.log(`  ${src}.${w}`);
      console.log(`    mapping prescribes ${prescribed} (${TERM_CLASS[prescribed]}); guard accepts raw as ${w} (${TERM_CLASS[w]})`);
      console.log(`    via RAW word   -> state=${raw.state} actions=${JSON.stringify(raw.actions)}`);
      console.log(`    via MAPPED     -> state=${mapped.state} actions=${JSON.stringify(mapped.actions)}`);
      console.log(`    STATES DIFFER  = ${raw.state !== mapped.state}`);
    }
  }
}
console.log(`  raw words colliding with a term name: ${collide}; wrongly accepted with a different term: ${wrong}`);

h('F2: waitingUser overrides terminal / failed, masking a failure and withholding RETRY');
for (const c of [{terminal: true, failed: true, waitingUser: true}, {terminal: true, waitingUser: true},
  {terminal: true, failed: true, cancelled: true}, {terminal: true, failed: true}]) {
  const d = projectStatus(c);
  console.log(`  ${JSON.stringify(c).padEnd(56)} -> state=${d.state.padEnd(13)} actions=${JSON.stringify(d.actions)}`);
}
console.log('  terminal FAILED run reported as WAITING_USER offers no RETRY:',
  !projectStatus({terminal: true, failed: true, waitingUser: true}).actions.includes('RETRY'));

h('F3: the header property, and the FRESHNESS collapse');
console.log('  RS-201 declares FRESHNESS =', JSON.stringify(registry.FRESHNESS));
for (const w of registry.FRESHNESS) console.log(`    ${w.padEnd(8)} -> ${presentTerm('RS-201.FRESHNESS', w)}`);
console.log('  STALE and UNKNOWN share a term:',
  presentTerm('RS-201.FRESHNESS', 'STALE') === presentTerm('RS-201.FRESHNESS', 'UNKNOWN'));
const intra = [];
for (const [src, words] of Object.entries(SOURCES)) {
  const seen = new Map();
  for (const w of words) {
    const t = TERM_OF[src][w];
    if (seen.has(t) && seen.get(t) !== w) intra.push(`${src}: ${seen.get(t)} / ${w} -> ${t}`);
    else seen.set(t, w);
  }
}
console.log(`  intra-vocabulary shared targets across the whole table: ${intra.length}`);
console.log('  NOTE: most are intended category merges (ABSENCE_CODES -> ABSENT/REMOVED,');
console.log('  PROBE_OUTCOMES -> SELECTABLE). Only the FRESHNESS case loses a distinction the');
console.log('  module argues for elsewhere. Listed for a reader to judge, not asserted as defects:');
for (const v of intra) console.log('    ' + v);

h('POSITIVE: properties independently verified as sound');
let bad = 0;
for (const t of TERMS) {
  const d = projectStatus({providerTerms: [t], terms: [t]});
  if (!PRESENTATION_STATES.includes(d.state) || d.actions.some((a) => !ALLOWED_ACTIONS.includes(a)) || d.provider_choice_taken !== false) bad++;
}
console.log('  totality over all', TERMS.length, 'terms: violations =', bad);
console.log('  terms without a class:', TERMS.filter((t) => !TERM_CLASS[t]).length);
console.log('  TERM_CLASS keys outside TERMS:', Object.keys(TERM_CLASS).filter((k) => !TERMS.includes(k)).length);
console.log('  declared terms never produced:',
  TERMS.filter((t) => !Object.values(TERM_OF).flatMap((x) => Object.values(x)).includes(t)).length);
let fab = 0;
for (const a of [{}, {terms: []}, {providerTerms: ['SELECTABLE']}, {terms: ['SELECTABLE', 'REMOTE_ONLINE']}, {terminal: false}]) {
  if (projectStatus(a).state === 'COMPLETED') fab++;
}
console.log('  inputs fabricating COMPLETED without terminal:true =', fab);
console.log('  presentState always declared:', [['SELECTABLE'], [], ['AT_CAPACITY'], ['FRESHNESS_UNKNOWN']]
  .every((terms) => PRESENTATION_STATES.includes(presentState({terms}))));
