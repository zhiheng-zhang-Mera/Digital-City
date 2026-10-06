// Mechanical "evil merge" check for an integration/merge commit.
//
// A merge M of A (main) and B (author branch) is allowed to change file F relative to A ONLY IF some DECLARED SOURCE
// also changed F relative to A. If M changes a file that no declared source touched, the merge introduced content that
// exists in no reviewed side, and no review of the two sides would have shown it.
//
// Declared sources are: the author branch, plus any additional branch whose adoption the integration report states
// (here: the two published store-guard repair branches). The point is not to make the check pass - it is to produce the
// EXACT set of files that came from outside the documented sources, which is the set a reviewer has to look at.
//
//   usage: node evil-merge-check.mjs <worktree> <mainSha> <headSha> <sourceSha> [<sourceSha> ...]
import {execFileSync} from 'node:child_process';

const [worktree, main, head, ...sources] = process.argv.slice(2);
if (!worktree || !main || !head || sources.length === 0) {
  console.error('usage: node evil-merge-check.mjs <worktree> <mainSha> <headSha> <sourceSha> [<sourceSha> ...]');
  process.exit(2);
}
const git = args => execFileSync('git', ['-C', worktree, ...args], {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});
const files = (a, b) => {
  const out = git(['diff', '--name-only', a, b]).trim();
  return out ? out.split(/\r?\n/) : [];
};
const explained = new Set();
for (const source of sources) for (const file of files(main, source)) explained.add(file);
const touched = files(main, head);
const unexplained = touched.filter(file => !explained.has(file));

console.log(`main                ${main}`);
console.log(`head                ${head}`);
console.log(`declared sources    ${sources.length}`);
for (const source of sources) console.log(`  ${source}  (${files(main, source).length} files vs main)`);
console.log(`\nfiles the head changes relative to main : ${touched.length}`);
console.log(`explained by a declared source          : ${touched.length - unexplained.length}`);
console.log(`NOT explained by any declared source    : ${unexplained.length}`);
for (const file of unexplained) console.log(`  ${file}`);
console.log(`\nVERDICT  ${unexplained.length === 0 ? 'every changed file traces to a declared source' : `${unexplained.length} file(s) trace to NO declared source - these are the ones a reviewer must justify`}`);
process.exit(unexplained.length === 0 ? 0 : 1);
