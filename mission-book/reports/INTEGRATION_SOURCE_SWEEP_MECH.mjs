// Which commit is actually the integration source for each accepted task?
//
// Found the hard way: the REX-803 development branch tip is not the accepted head - it is 14 commits behind, missing
// the repairs the accepted physical campaign actually ran. A mechanical "merge the task branch" would therefore
// integrate an unreviewed head. This sweep asks the same question of every workbook that records a reviewed head, and
// reports it as one of: integrated, branch tip is the accepted head, branch tip is AHEAD (unreviewed commits on top),
// branch diverged, or the accepted head is on some other ref entirely.
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join, relative} from 'node:path';
import {execFileSync} from 'node:child_process';

const BOOK = process.argv[2] ?? 'D:/utopia-chat/dc/mission-book';
const REPO = process.argv[3] ?? 'D:/utopia';
const git = (...args) => execFileSync('git', ['-C', REPO, ...args], {encoding: 'utf8'}).trim();
const tryGit = (...args) => { try { return git(...args) } catch { return null } };

const walk = dir => readdirSync(dir).flatMap(name => {
  const path = join(dir, name);
  if (statSync(path).isDirectory()) return name === '.git' ? [] : walk(path);
  return name.endsWith('.md') ? [path] : [];
});

const field = (front, name) => {
  const match = front.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'));
  return match ? match[1].trim().replace(/^"(.*)"$/, '$1') : null;
};

const rows = [];
for (const path of walk(BOOK)) {
  const text = readFileSync(path, 'utf8');
  if (!text.startsWith('---')) continue;
  const end = text.indexOf('\n---', 3);
  if (end === -1) continue;
  const front = text.slice(3, end);
  if (!field(front, 'workbook_id')) continue;
  // Which field names the integration source? JOIN-590 records BOTH: `accepted_head_sha` (what was accepted and what
  // actually landed in main) and `review_head_sha` (an earlier review round). Reading only the latter produced a wrong
  // finding about JOIN-590 in the first version of this sweep, so the field used is now recorded and reported.
  const acceptedHead = field(front, 'accepted_head_sha');
  const reviewHead = field(front, 'review_head_sha');
  const source = /^[0-9a-f]{40}$/.test(acceptedHead ?? '') ? acceptedHead : reviewHead;
  if (!source || !/^[0-9a-f]{40}$/.test(source)) continue;
  rows.push({
    id: field(front, 'workbook_id'),
    accepted: field(front, 'review_complete') === 'true',
    status: field(front, 'status'),
    branch: field(front, 'development_branch'),
    source,
    sourceField: acceptedHead ? 'accepted_head_sha' : 'review_head_sha',
    development: field(front, 'development_head_sha'),
    file: relative(BOOK, path).replace(/\\/g, '/'),
  });
}

const onMain = sha => { try { execFileSync('git', ['-C', REPO, 'merge-base', '--is-ancestor', sha, 'origin/main']); return true } catch { return false } };

const findings = [];
for (const row of rows.sort((a, b) => a.id.localeCompare(b.id))) {
  const tip = row.branch ? tryGit('rev-parse', '--verify', '--quiet', `origin/${row.branch}`) : null;
  const sourceIntegrated = onMain(row.source);
  const tipIntegrated = tip ? onMain(tip) : null;
  let relation;
  if (sourceIntegrated) relation = 'source head is in main';
  else if (tip && tipIntegrated) relation = 'branch tip is in main, source head is NOT';
  else if (tip === row.source) relation = 'branch tip IS the source head';
  else if (tip) {
    try { execFileSync('git', ['-C', REPO, 'merge-base', '--is-ancestor', row.source, tip]); relation = 'branch tip is AHEAD of the source head' }
    catch {
      try { execFileSync('git', ['-C', REPO, 'merge-base', '--is-ancestor', tip, row.source]); relation = 'branch tip is BEHIND the source head' }
      catch { relation = 'branch and source head DIVERGED' }
    }
  } else relation = 'no branch recorded';
  const ahead = tip && !sourceIntegrated ? Number(tryGit('rev-list', '--count', `${row.source}..${tip}`) ?? 0) : 0;
  const containing = sourceIntegrated ? [] : (tryGit('branch', '-r', '--contains', row.source) ?? '').split('\n').map(s => s.trim()).filter(Boolean);
  findings.push({...row, tip, sourceIntegrated, tipIntegrated, relation, commitsTipIsAhead: ahead, refsHoldingSourceHead: containing});
}

console.log(`workbooks with a recorded integration source: ${findings.length}\n`);
for (const f of findings) {
  const flags = [];
  // A risk is concrete only if integrating by branch name would move main onto a commit the record does not name.
  if (f.accepted && !f.sourceIntegrated && !f.tipIntegrated && /AHEAD|DIVERGED/.test(f.relation)) flags.push('BRANCH-NAME INTEGRATION WOULD ADD UNREVIEWED COMMITS');
  if (f.accepted && !f.sourceIntegrated && /BEHIND/.test(f.relation)) flags.push('integrate the source head, not the branch');
  if (f.accepted && !f.sourceIntegrated && f.refsHoldingSourceHead.length === 0) flags.push('source head on NO remote ref');
  console.log(`${f.id.padEnd(10)} ${(f.accepted ? 'ACCEPTED' : 'in-review').padEnd(10)} ${f.relation.padEnd(42)} ${f.sourceField === 'accepted_head_sha' ? 'accepted' : 'reviewed'}=${f.source.slice(0, 7)} tip=${(f.tip ?? '-').slice(0, 7)} ahead=${f.commitsTipIsAhead} ${flags.join(' ')}`);
  if (flags.length > 0) console.log(`           source head held by: ${f.refsHoldingSourceHead.join(', ') || '(none)'}`);
}

const acceptedRows = findings.filter(f => f.accepted);
const branchRisk = acceptedRows.filter(f => !f.sourceIntegrated && !f.tipIntegrated && /AHEAD|DIVERGED/.test(f.relation));
const behind = acceptedRows.filter(f => !f.sourceIntegrated && /BEHIND/.test(f.relation));
const unrefd = acceptedRows.filter(f => !f.sourceIntegrated && f.refsHoldingSourceHead.length === 0);
console.log(`\naccepted tasks: ${acceptedRows.length}, of which the source head is not in main: ${acceptedRows.filter(f => !f.sourceIntegrated).length}`);
console.log(`  integrating by branch name would add unreviewed commits: ${branchRisk.length}${branchRisk.length ? ' -> ' + branchRisk.map(f => f.id).join(', ') : ''}`);
console.log(`  branch tip BEHIND the source head (integrate the head, not the branch): ${behind.length}${behind.length ? ' -> ' + behind.map(f => f.id).join(', ') : ''}`);
console.log(`  source head on NO remote ref: ${unrefd.length}${unrefd.length ? ' -> ' + unrefd.map(f => f.id).join(', ') : ''}`);
console.log('\nNOTE: "not in main" is not the same as "its work is missing": a manual union can land a task\'s content in');
console.log('main without its exact head ever becoming an ancestor. This sweep tests ancestry because that is what decides');
console.log('whether the recorded head can still be checked out and re-verified.');
process.exit(0);
