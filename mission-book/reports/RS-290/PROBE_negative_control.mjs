// RS-290 negative control for the F1/F2/F3 repair (Alien, development host).
//
// WHY THIS EXISTS: a repair whose tests pass against BOTH the fixed and the broken code has proven
// nothing, and "a test that cannot fail is not evidence" is the standard Mech's review applied to the
// original suite. So the three findings Mech reported are reintroduced into a throwaway COPY of the
// contract - the real tree is never touched - and the suite is run against the copy. The repair is only
// load-bearing if the new tests FAIL there.
//
// RUN IT from the utopia worktree root:   node PROBE_negative_control.mjs
// EXPECTED: five tests fail, one for each finding plus the closure test that independently catches the
// FRESHNESS collapse:
//   RS-290 F1: a raw word that COLLIDES with a term name is still mapped by its VOCABULARY
//   RS-290 F2: a terminal outcome OUTRANKS waitingUser, so a failure is never masked
//   RS-290 F3: FRESHNESS.STALE and FRESHNESS.UNKNOWN stay DISTINCT terms
//   RS-290 F3: NO collapse of two meanings onto one term goes UNDECLARED - quantified over the table
//   RS-290: the presentation vocabulary is CLOSED - every target is a declared term with a class
//
// The copy is placed as a SIBLING of the real contract because the suite imports its components through
// relative paths ('../../general-ai-registry-v1/...'), so the copy must sit at the same tree depth.
import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const SOURCE = 'contracts/rs-presentation-contract-v1';
const COPY = 'contracts/zz-negcontrol-tmp';

/** Each reversion restores one of Mech's findings exactly as it was at 2a3ae30. */
const REVERSIONS = [
  ['F3: FRESHNESS.STALE collapses back into FRESHNESS_UNKNOWN',
    "STALE: 'FRESHNESS_STALE',", "STALE: 'FRESHNESS_UNKNOWN',"],
  ['F2: waitingUser short-circuits the state before presentState is consulted',
    'const finalState = presentState({ terms: allTerms, terminal, failed, cancelled });',
    "const finalState = waitingUser ? 'WAITING_USER' : presentState({ terms: allTerms, terminal, failed, cancelled });"],
  ['F1: a raw word that IS a term name is accepted unchanged, as the old name check did',
    'return presentTerm(entry.source, entry.word);',
    'const mapped = presentTerm(entry.source, entry.word);\n    return TERMS.includes(entry.word) ? entry.word : mapped;'],
];

rmSync(COPY, { recursive: true, force: true });
cpSync(SOURCE, COPY, { recursive: true });

const module = `${COPY}/presentation.mjs`;
let source = readFileSync(module, 'utf8');
for (const [label, from, to] of REVERSIONS) {
  if (!source.includes(from)) throw new Error(`reversion not applicable, the module drifted: ${label}`);
  source = source.replace(from, to);
  console.log(`reintroduced defect - ${label}`);
}
writeFileSync(module, source);

let output = '';
let exitCode = 0;
try {
  output = execFileSync(process.execPath, ['--test', `${COPY}/tests/*.test.mjs`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
} catch (error) {
  output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
  exitCode = error.status ?? 1;
} finally {
  rmSync(COPY, { recursive: true, force: true });
}

// Node's reporter prints each failure twice - once inline and once in the trailing summary - so the list
// is de-duplicated; otherwise this probe would over-report the count, which is the same "read the shape of
// the output rather than the mechanism" error the findings themselves are about.
const failed = [...new Set([...output.matchAll(/^✖ (.+?) \(/gm)].map(match => match[1]))];
console.log(`\ndefects reintroduced, suite exit=${exitCode}`);
for (const name of failed) console.log(`  FAILED AS REQUIRED: ${name}`);
console.log(`\n${failed.length} tests failed on the reintroduced defects.`);
if (exitCode === 0) throw new Error('the suite PASSED against the broken code - the repair is not load-bearing');
