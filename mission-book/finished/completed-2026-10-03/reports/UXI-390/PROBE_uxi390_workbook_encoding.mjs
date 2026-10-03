// PROBE — is the UXI-390 workbook body recoverable EXACTLY from the Owner's original revision?
//
// Usage: node PROBE_uxi390_workbook_encoding.mjs <origBody.txt> <repairedBody.txt>
//
//   origBody.txt     = body of the healthy revision (2a319ce, the Owner's original), UTF-8
//   repairedBody.txt = the HEAD body after re-encoding as UTF-8 (U+FFFD marks each byte whose information the
//                      GBK round-trip destroyed; it is followed by a literal '?')
//
// The claim under test, stated so that a failure is informative rather than fatal:
//
//   every line of the repaired body can be produced from the corresponding line of the original by replacing
//   one or two consecutive original characters with the token U+FFFD '?' (or a bare '?') -- and NOTHING else
//   differs.
//
// That is the signature of the corruption this programme measured: the original UTF-8 bytes were decoded as
// GBK per line, so a multi-byte character whose bytes did not pair up inside the line became '?' -- one or two
// original characters per substitution, since GBK pairs two bytes at a time. If the claim holds for every
// line, then the stored body carries no legitimate edit and restoring the original body verbatim is an EXACT
// repair rather than a reconstruction. If any line fails, the original body cannot be trusted as this
// workbook's body and the repair must NOT be made from it.

import { readFileSync } from 'node:fs';

const [origPath, storedPath] = process.argv.slice(2);
const orig = readFileSync(origPath, 'utf8');
const stored = readFileSync(storedPath, 'utf8');

const lo = orig.split('\n');
const ls = stored.split('\n');

console.log(`lines: original=${lo.length} repaired=${ls.length}`);
if (lo.length !== ls.length) {
  console.log('RESULT: FAIL - line counts differ, so the two are not the same document');
  process.exit(1);
}

// Memoised walk: can stored line s be derived from original line o by turning runs of one or two original
// characters into a destroyed-byte token? Returns the number of destroyed original characters, or -1.
function explain(o, s) {
  const memo = new Map();
  const go = (i, j) => {
    if (i === o.length && j === s.length) return 0;
    if (j === s.length || i === o.length) return -1;
    const key = i * (s.length + 1) + j;
    if (memo.has(key)) return memo.get(key);
    let best = -1;
    if (o[i] === s[j]) {                          // the character survived verbatim
      const r = go(i + 1, j + 1);
      if (r >= 0) best = r;
    }
    if (best < 0) {                               // a destroyed-byte token: U+FFFD (optionally + '?'), or '?'
      const width = s[j] === '\uFFFD' ? (s[j + 1] === '?' ? 2 : 1) : (s[j] === '?' ? 1 : 0);
      if (width > 0) {
        for (const take of [1, 2]) {
          const r = go(i + take, j + width);
          if (r >= 0) { best = r + take; break; }
        }
      }
    }
    memo.set(key, best);
    return best;
  };
  return go(0, 0);
}

let destroyed = 0;
const bad = [];
for (let n = 0; n < lo.length; n++) {
  const r = explain(lo[n], ls[n]);
  if (r < 0) bad.push(n + 1);
  else destroyed += r;
}

console.log(`lines explained as original-plus-destroyed-tokens: ${lo.length - bad.length}/${lo.length}`);
console.log(`original characters destroyed by the encoding round-trip: ${destroyed}`);
for (const n of bad.slice(0, 10)) {
  console.log(`  line ${n}\n    original: ${lo[n - 1]}\n    repaired: ${ls[n - 1]}`);
}
const pass = bad.length === 0;
console.log(pass
  ? 'RESULT: PASS - every repaired line is the original line with only multi-byte characters destroyed.'
    + ' The body carries no legitimate edit, so a verbatim restore of the original body is EXACT.'
  : 'RESULT: FAIL - at least one line differs in a way the encoding cannot explain; do NOT restore.');
process.exit(pass ? 0 : 1);

