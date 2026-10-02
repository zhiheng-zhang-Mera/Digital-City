/**
 * UXI-390 — §7 exact-head reconciliation, the instrument for the Review Mech will take.
 *
 * Built BEFORE the review is claimable, deliberately: UXI-390's development host is Alien and its
 * `review_host` is null, so the Review is Mech's once development completes, and §7 requires that the
 * recorded control-plane state be reconciled against the authorities BEFORE a claim rather than read from
 * the author's summary. Alien did exactly this before claiming UXI-301's review, and this is the same
 * instrument pointed at the other task.
 *
 * It checks only what can be checked from outside the author's report:
 *   - the workbook's recorded development head against the ACTUAL branch head on the remote;
 *   - the recorded CI run against the exact head, branch and conclusion, from GitHub rather than from the
 *     workbook's own field;
 *   - whether the RS-290 contract the task depends on is byte-identical to frozen main, so a task cannot
 *     quietly redefine the contract it was told to consume;
 *   - whether the workbook itself parses (a BOM or a duplicate key makes a claim's fields invisible);
 *   - whether the evidence the workbook names actually exists in the repository.
 *
 * It deliberately does NOT judge the work - that is the review. It answers "is the control plane telling the
 * truth about what was built", which is the question §7 exists for.
 *
 *   node mission-book/reports/UXI-390/uxi390-reconcile.mjs [--mission-book <path>] [--utopia <path>]
 *
 * The path in this line is the one that works. It previously said scripts/, which is where the instrument was
 * first prototyped and is NOT where it lives, so a reader following the header would have got ENOENT.
 */
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const MB = argOf('--mission-book', 'D:/A-utopia/.mission-book');
const UTOPIA = argOf('--utopia', 'D:/A-utopia');
const WORKBOOK = join(MB, 'mission-book/ui-integration/UXI-390-双机最终产品验收与收口.md');
const BRANCH = 'uxi/UXI-390-final-product-acceptance';

const git = (cwd, ...a) => execFileSync('git', a, {cwd, encoding: 'utf8'}).trim();
const results = [];
const check = (id, ok, detail) => { results.push({id, ok, detail}); console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${id}${detail ? ' - ' + detail : ''}`); };

console.log('=== UXI-390 §7 reconciliation ===\n');
if (!existsSync(WORKBOOK)) throw new Error(`workbook not found at ${WORKBOOK}`);
const raw = readFileSync(WORKBOOK);
check('the workbook parses as frontmatter at all (no BOM before the opening ---)',
  !(raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf),
  raw[0] === 0xef ? 'a BOM means a strict parser sees NO frontmatter block' : 'no BOM');
const text = raw.toString('utf8').replace(/^\uFEFF/, '');
const field = (name) => (new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(text)?.[1] ?? '').trim();

// The repository under test, taken from the WORKBOOK rather than inferred from the working directory.
// Alien found this the hard way: without --repo, gh resolves the repository from the process cwd, so the
// instrument asked Digital-City about a utopia run when invoked from anywhere but the utopia checkout.
const repo = field('implementation_repo').split('/').slice(-2).join('/');
check('the workbook declares implementation_repo, so CI is asked about the right repository',
  /^[\w.-]+\/[\w.-]+$/.test(repo), repo || '(missing)');

// Wrong-tree guard FIRST, because Alien observed that a wrong-tree run reports a CLEAN PASS set, which is the
// failure mode least likely to be noticed. A mismatched tree must fail loudly rather than quietly agree.
const remoteOf = (dir) => {
  try { return git(dir, 'remote', 'get-url', 'origin'); } catch { return ''; }
};
const utopiaRemote = remoteOf(UTOPIA).replace(/^.*github\.com[:/]/, '').replace(/\.git$/, '');
const bookRemote = remoteOf(MB).replace(/^.*github\.com[:/]/, '').replace(/\.git$/, '');
check('the --utopia path is a checkout of the repository the workbook names',
  utopiaRemote.toLowerCase() === repo.toLowerCase(),
  `utopia=${utopiaRemote || '(none)'} declared=${repo || '(none)'}`);
check('the --mission-book path is a checkout of the control plane',
  bookRemote.toLowerCase().includes('digital-city'), bookRemote || '(no origin remote)');

// 0. FRESHNESS. The workbook is read from THIS checkout, so a stale checkout silently reconciles a stale
// record - which is how this instrument reported 10/12 against a workbook that origin/main had already
// superseded, and reported it confidently. A check that can only be right when run from a current clone is
// not a check; fail loudly instead.
execFileSync('git', ['fetch', '-q', 'origin'], {cwd: MB});
const mbLocal = git(MB, 'rev-parse', 'HEAD');
const mbRemote = git(MB, 'rev-parse', 'origin/main');
check('the --mission-book checkout is current with origin/main, so the workbook read is the live record',
  mbLocal === mbRemote,
  mbLocal === mbRemote ? mbLocal.slice(0, 12) : `local=${mbLocal.slice(0, 12)} origin/main=${mbRemote.slice(0, 12)} - run git pull --rebase first`);

// 1. recorded head vs the ACTUAL branch head, from the remote rather than the workbook.
execFileSync('git', ['fetch', '-q', 'origin', '--prune'], {cwd: UTOPIA});
const actualHead = git(UTOPIA, 'ls-remote', 'origin', BRANCH).split(/\s+/)[0] ?? '';
const recordedHead = field('development_head_sha');
const headMatches = actualHead.startsWith(recordedHead) && recordedHead.length > 0;
check('recorded development head == actual branch head', headMatches,
  `recorded=${recordedHead || '(none)'} actual=${actualHead.slice(0, 12) || '(none)'}`);

// 2. the recorded CI run, resolved from GitHub rather than trusted from the field.
//    development_ci may legitimately be a PER-HEAD mapping ("<sha> -> <runId> success; ..."), which is
//    strictly better than a bare run id, because a run id alone does not name the head it tested. So pick
//    the run bound to the RECORDED head. Taking the FIRST bare number instead checks whatever run happens to
//    be mentioned first - which is what this instrument did until the field moved to the per-head form, and
//    it reported a failure against a workbook that was correct.
const ciField = field('development_ci');
const pairs = [...String(ciField).matchAll(/([0-9a-f]{7,40})\s*->\s*(\d{6,})/g)].map((m) => ({head: m[1], runId: m[2]}));
const selected = pairs.find((p) => recordedHead.startsWith(p.head) || p.head.startsWith(recordedHead))
  ?? (pairs.length === 0 ? {head: null, runId: /(\d{6,})/.exec(ciField)?.[1] ?? null} : null);
const runId = selected?.runId ?? null;
if (runId === null) {
  check('a CI run is recorded for the RECORDED head', false,
    pairs.length
      ? `no run bound to ${recordedHead.slice(0, 12)}; the field names ${pairs.map((p) => p.head).join(', ')}`
      : `development_ci=${JSON.stringify(ciField)}`);
} else {
  if (pairs.length > 0 && selected.head === null) {
    check('a CI run is recorded for the RECORDED head', false,
      `no run bound to ${recordedHead.slice(0, 12)}; the field names ${pairs.map((p) => p.head).join(', ')}`);
  }
  if (pairs.length === 0) {
    check('development_ci names the head its run belongs to', false,
      'bare run id with no head binding - a run id alone does not say which head was tested');
  }
  let run = null;
  try {
    run = JSON.parse(execFileSync('gh', ['run', 'view', runId, '--repo', repo, '--json', 'headSha,headBranch,conclusion,status'], {encoding: 'utf8'}));
  } catch (error) {
    check(`CI run ${runId} is readable from GitHub`, false, String(error.message).slice(0, 120));
  }
  if (run) {
    check(`CI run ${runId} is bound to the EXACT recorded head`,
      run.headSha === actualHead, `run headSha=${run.headSha.slice(0, 12)} branch head=${actualHead.slice(0, 12)}`);
    check(`CI run ${runId} is on the recorded branch`, run.headBranch === BRANCH, `run branch=${run.headBranch}`);
    check(`CI run ${runId} concluded success`, run.status === 'completed' && run.conclusion === 'success',
      `status=${run.status} conclusion=${run.conclusion}`);
  }
}

// 3. the RS-290 contract must be CONSUMED, not redefined: byte-identical to frozen main.
const mainHead = git(UTOPIA, 'rev-parse', 'origin/main');
const contractPath = 'contracts/rs-presentation-contract-v1/presentation.mjs';
const contractDiff = git(UTOPIA, 'diff', '--stat', mainHead, actualHead, '--', contractPath);
check('the RS-290 contract is byte-identical to main, so the task consumed it rather than redefining it',
  contractDiff === '', contractDiff || 'no differences');

// 4. the workbook's claimed evidence must actually exist.
const reportPath = field('report_path');
if (reportPath) {
  check('the recorded report path exists', existsSync(join(MB, reportPath)), reportPath);
}
// Inspect the BRANCH's tree, not the working tree: the working tree is on main and cannot see the task's
// commits at all. Also check the negative - that the evidence is not ONLY under the gitignored .runtime/,
// which is the RS-203 lesson that a review host cannot open it.
const tree = git(UTOPIA, 'ls-tree', '-r', '--name-only', actualHead);
const tracked = tree.split('\n');
const published = tracked.filter((f) => f.startsWith('evidence/raw/mission-book/UXI-390/'));
check('the task published evidence OUTSIDE .runtime, so a review host can open it',
  published.length > 0,
  published.length ? `${published.length} file(s), e.g. ${published[0]}` : 'NOTHING under evidence/raw/mission-book/UXI-390 on the branch');

// Evidence that exists ONLY in the gitignored runtime directory is unopenable by a reviewer, so say so
// explicitly rather than leaving it to be inferred from a missing directory.
const runtimeEvidence = existsSync(join(UTOPIA, '.runtime/evidence'))
  ? 'a .runtime/evidence directory exists on this host, which a REVIEW HOST cannot open'
  : 'no .runtime/evidence on this host';
check('no task evidence exists only under the gitignored .runtime', published.length > 0,
  published.length > 0 ? 'published evidence found, so .runtime is not the only home' : runtimeEvidence);

const failed = results.filter((r) => !r.ok);
console.log(`\n=== RECONCILIATION: ${results.length - failed.length}/${results.length} ===`);
if (failed.length) console.log('FAILING: ' + failed.map((f) => f.id).join(', '));
console.log('NOTE: this checks the CONTROL PLANE, not the work. A clean reconciliation is a precondition for a');
console.log('claim, never a verdict - the review still has to find problems of its own, per §3.');
process.exitCode = failed.length ? 1 : 0;
