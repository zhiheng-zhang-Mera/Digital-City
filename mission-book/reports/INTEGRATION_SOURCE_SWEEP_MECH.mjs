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
  const reviewed = field(front, 'review_head_sha');
  if (!reviewed || !/^[0-9a-f]{40}$/.test(reviewed)) continue;
  const branch = field(front, 'development_branch');
  const complete = field(front, 'review_complete') === 'true';
  rows.push({
    id: field(front, 'workbook_id'),
    reviewed,
    branch,
    complete,
    accepted: field(front, 'review_complete') === 'true',
    status: field(front, 'status'),
    development: field(front, 'development_head_sha'),
    file: relative(BOOK, path).replace(/\\/g, '/'),
  });
}

const onMain = sha => { try { execFileSync('git', ['-C', REPO, 'merge-base', '--is-ancestor', sha, 'origin/main']); return true } catch { return false } };

const findings = [];
for (const row of rows.sort((a, b) => a.id.localeCompare(b.id))) {
  const tip = row.branch ? tryGit('rev-parse', '--verify', '--quiet', `origin/${row.branch}`) : null;
  const integrated = onMain(row.reviewed);
  let relation = 'no branch recorded';
  if (integrated) relation = 'integrated into main';
  else if (tip === row.reviewed) relation = 'branch tip IS the accepted head';
  else if (tip) {
    try { execFileSync('git', ['-C', REPO, 'merge-base', '--is-ancestor', row.reviewed, tip]); relation = 'branch tip is AHEAD of the accepted head' }
    catch {
      try { execFileSync('git', ['-C', REPO, 'merge-base', '--is-ancestor', tip, row.reviewed]); relation = 'branch tip is BEHIND the accepted head' }
      catch { relation = 'branch and accepted head DIVERGED' }
    }
  }
  const ahead = tip && !integrated ? Number(tryGit('rev-list', '--count', `${row.reviewed}..${tip}`) ?? 0) : 0;
  const containing = integrated ? [] : (tryGit('branch', '-r', '--contains', row.reviewed) ?? '').split('\n').map(s => s.trim()).filter(Boolean);
  findings.push({...row, tip, integrated, relation, commitsTipIsAhead: ahead, refsHoldingAcceptedHead: containing});
}

console.log(`workbooks with a recorded reviewed head: ${findings.length}\n`);
for (const f of findings) {
  const flags = [];
  if (f.accepted && !f.integrated && /AHEAD|DIVERGED/.test(f.relation)) flags.push('INTEGRATION-SOURCE RISK');
  if (f.accepted && !f.integrated && f.refsHoldingAcceptedHead.length === 0) flags.push('accepted head on NO remote ref');
  if (!f.accepted && Number(f.commitsTipIsAhead) > 0) flags.push('(mid-review)');
  console.log(`${f.id.padEnd(10)} ${(f.accepted ? 'ACCEPTED' : 'in-review').padEnd(10)} ${f.relation.padEnd(38)} reviewed=${f.reviewed.slice(0, 7)} tip=${(f.tip ?? '-').slice(0, 7)} ahead=${f.commitsTipIsAhead} ${flags.join(' ')}`);
  if (flags.length > 0) console.log(`           accepted head held by: ${f.refsHoldingAcceptedHead.join(', ') || '(none)'}`);
}

// Only an ACCEPTED task can be integrated, so only those rows carry integration risk; an unreviewed head that differs
// from a released marker is a note, not a defect.
const acceptedRows = findings.filter(f => f.accepted);
const risky = acceptedRows.filter(f => !f.integrated && /AHEAD|DIVERGED/.test(f.relation));
const behind = acceptedRows.filter(f => !f.integrated && /BEHIND/.test(f.relation));
const unrefd = acceptedRows.filter(f => !f.integrated && f.refsHoldingAcceptedHead.length === 0);
console.log(`\naccepted tasks: ${acceptedRows.length}, of which not ancestral to main: ${acceptedRows.filter(f => !f.integrated).length}`);
console.log(`  branch tip AHEAD of / DIVERGED from the accepted head: ${risky.length}${risky.length ? ' -> ' + risky.map(f => f.id).join(', ') : ''}`);
console.log(`  branch tip BEHIND the accepted head: ${behind.length}${behind.length ? ' -> ' + behind.map(f => f.id).join(', ') : ''}`);
console.log(`  accepted head on NO remote ref: ${unrefd.length}${unrefd.length ? ' -> ' + unrefd.map(f => f.id).join(', ') : ''}`);
console.log('\nNOTE: "not ancestral to main" is not the same as "its work is missing": a manual union can land a task\'s');
console.log('content in main without its exact head ever becoming an ancestor. This sweep tests ancestry because that is');
console.log('what decides whether the accepted head can still be checked out and re-verified.');
process.exit(0);
