// REX-806: verify the newest-receipt-detection repair, and record the boundary it does NOT cover.
//
// MEASURED (2026-10-06, head 3950d47 and the repaired stack):
//   signal available      a deleted receipt leaves NO trace in the listing (no tombstone; receiptWindow.total
//                         drops with the file), but the live campaign record survives completion and still names
//                         the last campaign, so a TERMINAL live campaign whose id is absent from the receipts
//                         means the newest receipt was lost. Probed on a throwaway City: signal available = true.
//   before the repair     the reader ignored it and produced a complete-looking smaller artifact (two-campaign
//                         City: exit 0, campaigns=1, nothing named).
//   after the repair      repair/REX-806-mech-exporter-missing-receipt-detection
//                         A) newest deleted -> exit 1 with "the live campaign <id> (state REFUSED) has no receipt
//                            in this City's store - the newest receipt is missing, ... (an older loss is not
//                            detectable at all)"
//                         B) an OLDER deletion while the newest survives -> exit 0 and silence: the boundary the
//                            message states rather than overclaims
//   regression            the healthy path still exports with exit 0 and NO warning; the end-to-end rehearsal
//                         stays 13/13 with the package verifying 14/14; the refusal path exits 1; a corrupt
//                         receipt still yields an artifact plus exit 1 with the file named.
//
// Runs two campaigns, then:
//   A) deletes the receipt the live record names (the NEWEST)  -> expect the reader to warn and exit 1
//   B) restores it byte-for-byte and deletes the other (an OLDER) receipt -> expect silence, the documented boundary
//
// RUN: copy into <checkout>/.missing-verify.mjs && node .missing-verify.mjs
import {mkdtemp, rm, writeFile, readdir, readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import WebSocket from 'ws';
import {createGateway} from './services/dev-gateway/server.mjs';

const OWNER = 'mv-owner', NODE = 'mv-node';
const WORKERS = ['worker-a', 'worker-b'];
const OUT = 'D:/utopia-chat/evidence/REX-806/missing-verify';
const h = c => ({Authorization: 'Bearer ' + c, 'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'});
const sleep = ms => new Promise(r => setTimeout(r, ms));
const line = (l, v) => console.log(String(l).padEnd(34), v);
const runChild = args => new Promise(resolve => {
  const child = spawn(process.execPath, args, {stdio: ['ignore', 'pipe', 'pipe']});
  let stdout = '', stderr = '';
  child.stdout.on('data', d => { stdout += d; });
  child.stderr.on('data', d => { stderr += d; });
  const timer = setTimeout(() => child.kill(), 60000);
  child.on('close', code => { clearTimeout(timer); resolve({code, stdout, stderr}); });
});

const dir = await mkdtemp(join(tmpdir(), 'missing-verify-'));
const app = await createGateway({dir, port: 0, token: OWNER, nodeToken: NODE, roomsDisabled: true, heartbeatTimeout: 15000});
const ask = async (path, {body, credential = OWNER} = {}) => {
  const response = await fetch(`${app.url}/api/v0/${path}`, {method: body ? 'POST' : 'GET', headers: h(credential), body: body ? JSON.stringify(body) : undefined});
  const text = await response.text(); let json = null; try { json = JSON.parse(text); } catch {}
  return {status: response.status, body: json, text};
};
let socket = null;
const drive = async () => {
  const terminal = ['COMPLETED', 'STOPPED', 'REFUSED', 'FAILED', 'INTERRUPTED'];
  let live = null; const deadline = Date.now() + 40000;
  while (Date.now() < deadline && !(live && terminal.includes(live.state))) {
    for (const id of WORKERS) {
      const claimed = await ask('node/claim', {credential: NODE, body: {id}});
      const task = claimed.body?.task;
      if (!task) continue;
      await ask('node/report', {credential: NODE, body: {id, taskId: task.id, state: 'RUNNING', progress: 50}});
      await ask('node/report', {credential: NODE, body: {id, taskId: task.id, state: 'COMPLETED', progress: 100, result: {ok: true}}});
    }
    live = (await ask('research/campaigns')).body?.live ?? live;
    await sleep(25);
  }
  return live;
};
const exportNow = async label => {
  const configPath = join(dir, 'cfg.json');
  await writeFile(configPath, JSON.stringify({token: OWNER}), 'utf8');
  const result = await runChild(['scripts/export-research-artifact.mjs', '--city', app.url, '--out', `${OUT}-${label}`, '--config', configPath]);
  const named = /newest receipt is missing/i.test(result.stderr);
  line(`CLI ${label}`, `exit=${result.code} namesNewest=${named}`);
  for (const l of result.stderr.trim().split('\n').filter(Boolean).slice(0, 2)) console.log('    err  ' + l.slice(0, 150));
  return {result, named};
};
try {
  for (const id of WORKERS) {
    await ask('node/register', {credential: NODE, body: {id, displayName: id, capabilities: ['task.execute.safe'], roles: ['EXECUTION_NODE'], metadata: {platform: 'reference'}}});
    await ask('node/heartbeat', {credential: NODE, body: {id}});
  }
  socket = new WebSocket(`${app.url.replace('http', 'ws')}/api/v0/events/stream?apiVersion=0&schemaVersion=0&clientRef=surface-x&clientLabel=MV`, ['city-token.' + Buffer.from(OWNER).toString('base64url')]);
  await new Promise((yes, no) => {socket.on('open', yes); socket.on('error', no);});
  for (const id of ['mv-a', 'mv-b']) {
    await ask('research/experiments', {body: {manifest: {
      experimentId: id, question: 'detect the newest lost receipt', topology: 'TWO_HOST_MESH',
      hosts: WORKERS, workers: WORKERS, controlSurfaces: ['surface-x'],
      variables: {independent: ['scenario'], dependent: ['completion'], controls: ['taskType']},
      repetitions: 2, seedPolicy: 'PER_REPETITION', baseSeed: 11,
      requiredCapabilities: ['research.evidence.review'],
      stopConditions: [{kind: 'MAX_REPETITIONS', value: 2}, {kind: 'MAX_FAILURES', value: 2}],
      artifactPolicy: {retention: 'SUMMARY_ONLY'}, acceptance: {primary: 'terminal'},
      softwareRefs: ['utopia@' + '0'.repeat(40)],
    }}});
    await ask('research/campaigns', {body: {experimentId: id, scenarioId: 'WAIT'}});
    line(`campaign ${id}`, (await drive())?.state);
  }
  const receiptDir = join(dir, 'research', 'campaigns');
  const receipts = (await readdir(receiptDir)).filter(n => n.endsWith('.json'));
  const listed = await ask('research/campaigns');
  const liveId = listed.body?.live?.campaignId ?? null;
  line('receipts / live', `${receipts.length} / ${liveId}`);

  const newestFile = receipts.find(name => name.startsWith(liveId));
  // Keep the real bytes, so part B restores a READABLE receipt rather than a corrupt one.
  const newestBytes = newestFile ? await readFile(join(receiptDir, newestFile), 'utf8') : null;
  console.log('\n--- A: the NEWEST receipt deleted (the live campaign names it) ---');
  if (newestFile) await rm(join(receiptDir, newestFile), {force: true});
  const a = await exportNow('newest-deleted');

  console.log('\n--- B: an OLDER receipt deleted (the newest survives, restored byte-for-byte) ---');
  if (newestFile && newestBytes) await writeFile(join(receiptDir, newestFile), newestBytes, 'utf8');
  const older = receipts.find(name => name !== newestFile);
  if (older) await rm(join(receiptDir, older), {force: true});
  const b = await exportNow('older-deleted');

  console.log('');
  console.log(a.named && a.result.code === 1
    ? 'PASS  the newest lost receipt is named, and the run is not a clean success'
    : 'FAIL  the newest lost receipt was not named');
  console.log(b.named
    ? 'NOTE  an older deletion was ALSO named (better than recorded - update the record)'
    : 'BOUNDARY CONFIRMED  an older deletion stays silent, exactly as the repair states');
  process.exitCode = a.named && a.result.code === 1 ? 0 : 1;
} finally {
  try { socket?.close(); } catch {}
  await app.close();
  await sleep(250);
  await rm(dir, {recursive: true, force: true, maxRetries: 10, retryDelay: 50});
}
