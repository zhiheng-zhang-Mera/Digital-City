// Verify the recovery evidence's claim from its OBSERVATION SEQUENCE, not its summary booleans.
// success=true is the author's assertion; the observations are the underlying record.
import {readFileSync} from 'node:fs';

const ROOT = process.env.UTOPIA_ROOT ?? 'D:/A-utopia/.runtime/worktrees/RS-290-review';
const rows = JSON.parse(readFileSync(`${ROOT}/evidence/raw/mission-book/RS-290/node-recovery.json`, 'utf8'));

console.log('=== recovery evidence: does the observation sequence support success=true? ===');
console.log('rows:', rows.length);
for (const r of rows) {
  console.log(`\n-- run ${r.run} kind=${r.kind} success=${r.success}`);
  console.log(`   offlineObservedAt=${r.offlineObservedAt}`);
  console.log(`   restoreAt        =${r.restoreAt}`);
  console.log(`   onlineObservedAt =${r.onlineObservedAt}`);
  const off = Date.parse(r.offlineObservedAt), on = Date.parse(r.onlineObservedAt), rst = Date.parse(r.restoreAt);
  console.log(`   ordering offline < restore < online : ${off < rst} ${rst < on} -> ${off < rst && rst < on}`);
  r.observations.forEach((o, i) => {
    console.log(`   obs[${i}] androidUiPresent=${o.androidUiPresent} android=${JSON.stringify(o.android)} web=${JSON.stringify(o.web)} webNode=${JSON.stringify(o.webNode)}`);
  });
  const sawOffline = r.observations.some((o) => (o.android ?? []).includes('OFFLINE') || o.webNode === 'OFFLINE');
  const sawOnline = r.observations.some((o) => (o.android ?? []).filter((s) => s === 'ONLINE').length >= 2 && o.web === 'ONLINE' && o.webNode === 'ONLINE');
  console.log(`   sequence contains an OFFLINE observation: ${sawOffline}`);
  console.log(`   sequence contains an ONLINE observation : ${sawOnline}`);
  console.log(`   summary success matches the sequence    : ${r.success === (sawOffline && sawOnline && r.historyPreserved && r.cityIdentityPreserved)}`);
}
console.log('\n=== exactly-once check: each row counts occurrences of the ONLINE state in android labels ===');
for (const r of rows) {
  const counts = r.observations.map((o) => (o.android ?? []).filter((s) => s === 'ONLINE').length);
  console.log(`  run ${r.run}: per-observation ONLINE counts = ${JSON.stringify(counts)}`);
}
