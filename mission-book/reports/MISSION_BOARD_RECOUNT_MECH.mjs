// Independent recount of the mission-book against its own generated board.
//
// The main board's progress block is generated from workbook frontmatter and says so. That makes it checkable: recompute
// the aggregates from the frontmatter and see whether the published numbers are the numbers the sources imply. The
// programme treats a stale homepage as its own defect class (homepage sync drift), so this is a check, not a formality.
import {readFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import {join, relative} from 'node:path';

const ROOT = process.argv[2] ?? 'D:/utopia-chat/dc/mission-book';
const walk = dir => readdirSync(dir).flatMap(name => {
  const path = join(dir, name);
  if (statSync(path).isDirectory()) return name === '.git' ? [] : walk(path);
  return name.endsWith('.md') ? [path] : [];
});

const workbooks = [];
for (const path of walk(ROOT)) {
  const text = readFileSync(path, 'utf8');
  if (!text.startsWith('---')) continue;
  const end = text.indexOf('\n---', 3);
  if (end === -1) continue;
  const front = text.slice(3, end);
  const field = name => {
    const match = front.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'));
    return match ? match[1].trim().replace(/^"(.*)"$/, '$1') : null;
  };
  const id = field('workbook_id');
  if (!id) continue;
  workbooks.push({
    id,
    path: relative(ROOT, path).replace(/\\/g, '/'),
    status: field('status'),
    development: field('development_complete') === 'true',
    review: field('review_complete') === 'true',
  });
}

// A FUTURE-only plan is not a workbook yet and does not count toward the denominator; the board says so explicitly.
const future = workbooks.filter(w => /FUTURE/i.test(w.status ?? ''));
const counted = workbooks.filter(w => !future.includes(w));
const tally = {
  total: counted.length,
  development: counted.filter(w => w.development).length,
  review: counted.filter(w => w.review).length,
};

const board = readFileSync(join(ROOT, 'README.md'), 'utf8');
const progress = JSON.parse(readFileSync(join(ROOT, 'MISSION_PROGRESS.json'), 'utf8'));
const numbers = [...board.matchAll(/\*\*(?:全城合计|当前未收口项目池)[^*]*?\*\*/g)].map(m => m[0]);

const checks = [];
const check = (name, passed, detail) => checks.push({name, passed, detail});

check('every workbook has an id and a status', workbooks.every(w => w.id && w.status),
  `${workbooks.length} workbooks, ${workbooks.filter(w => !w.status).length} without status`);

// The board's total (93) spans archived programmes whose older frontmatter folds Correction/Verification into "review"
// under field names this recount cannot infer without the generator, so a blanket recompute would be an unsound check
// dressed as a strict one. Scope it to the ACTIVE POOL instead: those workbooks use one uniform convention, the pool is
// what this round's change moved, and every number below is still recomputed from frontmatter rather than read.
const activeProgrammes = (progress.programmes ?? []).filter(entry => entry.active_pool === true);
const scoped = [];
for (const entry of activeProgrammes) {
  const dir = join(ROOT, entry.readme.replace(/\/[^/]*$/, ''));
  let found = [];
  try { found = workbooks.filter(w => join(ROOT, w.path).startsWith(dir)) } catch { found = [] }
  scoped.push({
    key: entry.key,
    declared: {total: entry.total, development: entry.development_complete, review: entry.review_complete},
    recomputed: {total: found.length, development: found.filter(w => w.development).length, review: found.filter(w => w.review).length},
  });
}
const activeTotals = scoped.reduce((sum, entry) => ({
  total: sum.total + entry.recomputed.total,
  development: sum.development + entry.recomputed.development,
  review: sum.review + entry.recomputed.review,
}), {total: 0, development: 0, review: 0});
check('active-pool workbooks recompute to the pool totals the board publishes',
  activeTotals.total === progress.active_pool.tasks.total
  && activeTotals.development === progress.active_pool.development.complete
  && activeTotals.review === progress.active_pool.review.complete,
  `recomputed ${activeTotals.review}/${activeTotals.total} review, ${activeTotals.development}/${activeTotals.total} dev vs json ${progress.active_pool.review.complete}/${progress.active_pool.tasks.total}, ${progress.active_pool.development.complete}`);
const mismatched = scoped.filter(entry => entry.declared.total !== entry.recomputed.total
  || entry.declared.review !== entry.recomputed.review
  || entry.declared.development !== entry.recomputed.development);
check('every active programme row matches its own workbooks',
  mismatched.length === 0,
  mismatched.map(entry => `${entry.key}: json ${entry.declared.review}/${entry.declared.total} vs files ${entry.recomputed.review}/${entry.recomputed.total}`).join('; ') || `${scoped.length} programmes agree`);
check('MISSION_PROGRESS.json overall and review totals agree with each other',
  progress.overall.tasks.complete === progress.overall.review.complete
  && progress.overall.tasks.total === progress.overall.review.total,
  JSON.stringify(progress.overall));
check('no workbook is both review_complete and not development_complete',
  counted.every(w => !(w.review && !w.development)),
  counted.filter(w => w.review && !w.development).map(w => w.id).join(',') || 'none');
check('no review_complete workbook is still WAITING_DEPENDENCIES',
  counted.every(w => !(w.review && /WAITING/i.test(w.status))),
  counted.filter(w => w.review && /WAITING/i.test(w.status)).map(w => w.id).join(',') || 'none');
check('review_complete workbooks are COMPLETE (not IN_PROGRESS)',
  counted.every(w => !(w.review && /IN_PROGRESS/i.test(w.status))),
  counted.filter(w => w.review && /IN_PROGRESS/i.test(w.status)).map(w => w.id).join(',') || 'none');

// The specific claim this round is about: the accepted REX tasks must be visible as reviewed.
const rex = counted.filter(w => /^REX-/.test(w.id)).sort((a, b) => a.id.localeCompare(b.id));
const rexReviewed = rex.filter(w => w.review).map(w => w.id);
check('the four accepted REX tasks are counted as reviewed',
  ['REX-801', 'REX-802', 'REX-803', 'REX-804'].every(id => rexReviewed.includes(id)),
  `reviewed: ${rexReviewed.join(' ')}`);
check('REX-803 is COMPLETE with review_complete true',
  (() => { const w = rex.find(x => x.id === 'REX-803'); return w?.review === true && /COMPLETE/.test(w?.status ?? '') })(),
  JSON.stringify(rex.find(x => x.id === 'REX-803')));
check('REX-803 is no longer listed among the unresolved workbooks',
  !/REX-803/.test((board.match(/<!-- ACTIVE_WORKBOOKS:START -->[\s\S]*?<!-- ACTIVE_WORKBOOKS:END -->/) ?? [''])[0]),
  'checked the ACTIVE_WORKBOOKS block');

const failed = checks.filter(c => !c.passed);
for (const c of checks) console.log(`${c.passed ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? '  [' + c.detail + ']' : ''}`);
console.log(`\nrecomputed: ${tally.review}/${tally.total} reviewed, ${tally.development}/${tally.total} developed, ${future.length} FUTURE-only excluded`);
console.log(`board says:\n  ${numbers.join('\n  ')}`);
console.log(`\n${checks.length - failed.length}/${checks.length} consistency checks pass`);
process.exit(failed.length === 0 ? 0 : 1);
