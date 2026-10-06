// Receipt-robustness evidence run: what the City's own listing says and what the exporter CLI does when one of
// several campaign receipts is (1) deleted and (2) corrupt. Findings, measured on a throwaway City with two
// campaigns (head 3950d47, 2026-10-06):
//
//   R-1 CORRUPT RECEIPT DESTROYED THE WHOLE EXPORT. The City still lists it, with the typed shape
//       {"file":"campaign-<uuid>.json","state":"UNREADABLE","reason":"RECEIPT_UNREADABLE"} and no campaignId.
//       The CLI fetched its detail unguarded, threw at `get`, and died with NO artifact (exit 0xC0000409) while a
//       readable campaign sat beside it. Repaired on repair/REX-806-mech-exporter-unreadable-receipt @ 4349f3d:
//       the entry is skipped by the signal the listing already gives, named by file and reason on stderr, the
//       readable campaigns are still exported, and the exit code is 1 so a partial artifact cannot read as clean.
//       Verified output on the repaired branch:
//         err  unreadable receipts: 1 of 2 - this export describes only what could be read, ...
//         err    campaign-8567106f-f56b-40fd-a464-cbbdf137430b.json  RECEIPT_UNREADABLE
//   R-2 DELETED RECEIPT SHRINKS THE STUDY SILENTLY, and this is a STORE boundary rather than a reader defect: the
//       store keeps no tombstone, so after a deletion the City's listing reports receipts=1 and
//       receiptWindow.total=1 - the count drops with the file. The exporter then produces an internally
//       consistent artifact (campaigns=1) with nothing to name. Recorded so that no consistency check is trusted
//       to detect an absent record, and so a future store could keep a monotonic count.
//
// TWO DEFECTS OF THIS PROBE ITSELF, kept because they are the same class the record keeps finding: v1 read a field
// the listing does not have (`broken`), and its verdict regex matched the metric NAME
// `convergence_missing_event_count`, so it first reported "the artifact names the loss" when it named nothing.
//
// RUN: copy into <checkout>/.receipt-detail.mjs && node .receipt-detail.mjs
import {mkdtemp, rm, writeFile, readdir, readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import WebSocket from 'ws';
import {createGateway} from './services/dev-gateway/server.mjs';

const OWNER = 'detail-owner', NODE = 'detail-node';
const WORKERS = ['worker-a', 'worker-b'];
const OUT = 'D:/utopia-chat/evidence/REX-806/receipt-detail';
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

const dir = await mkdtemp(join(tmpdir(), 'receipt-detail-'));
const app = await createGateway({dir, port: 0, token: OWNER, nodeToken: NODE, roomsDisabled: true, heartbeatTimeout: 15000});
const ask = async (path, {body, credential = OWNER} = {}) => {
  const response = await fetch(`${app.url}/api/v0/${path}`, {method: body ? 'POST' : 'GET', headers: h(credential), body: body ? JSON.stringify(body) : undefined});
  const text = await response.text(); let json = null; try { json = JSON.parse(text); } catch {}
  return {status: response.status, body: json, text};
};
let socket = null;
try {
  for (const id of WORKERS) {
    await ask('node/register', {credential: NODE, body: {id, displayName: id, capabilities: ['task.execute.safe'], roles: ['EXECUTION_NODE'], metadata: {platform: 'reference'}}});
    await ask('node/heartbeat', {credential: NODE, body: {id}});
  }
  socket = new WebSocket(`${app.url.replace('http', 'ws')}/api/v0/events/stream?apiVersion=0&schemaVersion=0&clientRef=surface-x&clientLabel=Detail`, ['city-token.' + Buffer.from(OWNER).toString('base64url')]);
  await new Promise((yes, no) => {socket.on('open', yes); socket.on('error', no);});
  for (const id of ['detail-a', 'detail-b']) {
    await ask('research/experiments', {body: {manifest: {
      experimentId: id, question: 'receipt robustness detail', topology: 'TWO_HOST_MESH',
      hosts: WORKERS, workers: WORKERS, controlSurfaces: ['surface-x'],
      variables: {independent: ['scenario'], dependent: ['completion'], controls: ['taskType']},
      repetitions: 2, seedPolicy: 'PER_REPETITION', baseSeed: 7,
      requiredCapabilities: ['research.evidence.review'],
      stopConditions: [{kind: 'MAX_REPETITIONS', value: 2}, {kind: 'MAX_FAILURES', value: 2}],
      artifactPolicy: {retention: 'SUMMARY_ONLY'}, acceptance: {primary: 'terminal'},
      softwareRefs: ['utopia@' + '0'.repeat(40)],
    }}});
    await ask('research/campaigns', {body: {experimentId: id, scenarioId: 'WAIT'}});
    const terminal = ['COMPLETED', 'STOPPED', 'REFUSED', 'FAILED', 'INTERRUPTED'];
    let live = null; const deadline = Date.now() + 40000;
    while (Date.now() < deadline && !(live && terminal.includes(live.state))) {
      for (const id2 of WORKERS) {
        const claimed = await ask('node/claim', {credential: NODE, body: {id: id2}});
        const task = claimed.body?.task;
        if (!task) continue;
        await ask('node/report', {credential: NODE, body: {id: id2, taskId: task.id, state: 'RUNNING', progress: 50}});
        await ask('node/report', {credential: NODE, body: {id: id2, taskId: task.id, state: 'COMPLETED', progress: 100, result: {ok: true}}});
      }
      live = (await ask('research/campaigns')).body?.live ?? live;
      await sleep(25);
    }
  }
  const receiptDir = join(dir, 'research', 'campaigns');
  const receipts = (await readdir(receiptDir)).filter(n => n.endsWith('.json'));
  const doomed = join(receiptDir, receipts[0]);
  const original = await readFile(doomed, 'utf8');

  const exportNow = async label => {
    const configPath = join(dir, 'cfg.json');
    await writeFile(configPath, JSON.stringify({token: OWNER}), 'utf8');
    const result = await runChild(['scripts/export-research-artifact.mjs', '--city', app.url, '--out', `${OUT}-${label}`, '--config', configPath]);
    line(`CLI ${label} exit`, result.code);
    for (const l of result.stdout.trim().split('\n').filter(Boolean).slice(0, 3)) console.log('    out  ' + l.slice(0, 140));
    for (const l of result.stderr.trim().split('\n').filter(Boolean).slice(0, 5)) console.log('    err  ' + l.slice(0, 140));
    return result;
  };
  const list = await ask('research/campaigns');
  line('healthy: receipts', `${list.body?.receipts?.length} window.total=${list.body?.receiptWindow?.total}`);

  console.log('\n--- SHAPE 1: one of two receipts DELETED ---');
  await rm(doomed, {force: true});
  const afterDelete = await ask('research/campaigns');
  line('city: receipts', `${afterDelete.body?.receipts?.length} window.total=${afterDelete.body?.receiptWindow?.total} truncated=${afterDelete.body?.receiptWindow?.truncated} storeState=${afterDelete.body?.storeState}`);
  await exportNow('deleted');

  console.log('\n--- SHAPE 2: one of two receipts CORRUPT ---');
  await writeFile(doomed, '{ not json', 'utf8');
  const afterCorrupt = await ask('research/campaigns');
  line('city: receipts', `${afterCorrupt.body?.receipts?.length} window.total=${afterCorrupt.body?.receiptWindow?.total} storeState=${afterCorrupt.body?.storeState}`);
  // What DOES the listing say about the unreadable receipt? The entry's own shape decides whether a reader can
  // name it, so print it rather than guess.
  console.log('    raw receipts entry: ' + JSON.stringify(afterCorrupt.body?.receipts ?? null).slice(0, 400));
  await exportNow('corrupt');
  await writeFile(doomed, original, 'utf8');
} finally {
  try { socket?.close(); } catch {}
  await app.close();
  await sleep(250);
  await rm(dir, {recursive: true, force: true, maxRetries: 10, retryDelay: 50});
}
