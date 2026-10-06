// REX-890 rehearsal (Mech): can a BRAND-NEW City produce a verifiable research artifact end to end?
//
// Why: the published REX-806 package came from the resident City, so every check so far was run against one
// package from one City. The programme's terminal claim is that the fabric produces reproducible research
// material, and REX-890 additionally requires an injected fault with recovery. This rehearses the whole chain on
// a City that did not exist a minute earlier, touching nothing of the resident City (temp dir, ephemeral port,
// throwaway credentials):
//
//   fresh City -> 2 execution nodes -> experiment manifest -> WAIT campaign x6 -> a real fault injected,
//   observed as targeted, and recovered -> artifact exported by the real CLI -> verified package-only
//
// HOW TO RUN (imports Utopia modules, so it must live inside the checkout):
//   copy to <checkout>/.rex890-rehearsal.mjs && node .rex890-rehearsal.mjs
//
// FIRST VERSION'S DEFECTS, kept because they are the kind this programme records: it called record() inside the
// drive loop, so one check printed hundreds of times and buried the earlier phases; and it stopped the fault on
// every loop iteration instead of once. A rehearsal that floods its own log cannot be read.
import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import WebSocket from 'ws';
import {createGateway} from './services/dev-gateway/server.mjs';

// spawnSync DEADLOCKS here by construction: the City runs inside THIS process, and spawnSync blocks this
// process's event loop, so the child's HTTP request to the City is never served and it hangs until its timeout.
// MEASURED - it produced ETIMEDOUT three runs in a row. An async child keeps the loop alive to answer it.
const runChild = (args, timeoutMs = 60000) => new Promise(resolve => {
  const child = spawn(process.execPath, args, {stdio: ['ignore', 'pipe', 'pipe']});
  let stdout = '', stderr = '';
  child.stdout.on('data', chunk => { stdout += chunk; });
  child.stderr.on('data', chunk => { stderr += chunk; });
  const timer = setTimeout(() => { child.kill(); }, timeoutMs);
  child.on('close', code => { clearTimeout(timer); resolve({status: code, stdout, stderr}); });
});

const OWNER = 'rehearsal-owner';
const NODE_TOKEN = 'rehearsal-node';
const OUT = process.env.REX890_OUT ?? 'D:/utopia-chat/evidence/REX-890/rehearsal-artifact';
const WORKERS = ['worker-a', 'worker-b'];
const REPETITIONS = 6;
const line = (label, value) => console.log(String(label).padEnd(46), value);
const phase = label => console.log(`\n--- ${label} ---`);
const sleep = ms => new Promise(done => setTimeout(done, ms));
const headersFor = credential => ({Authorization: 'Bearer ' + credential, 'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'});

const results = [];
const record = (name, ok, detail) => { results.push({name, ok, detail}); line(ok ? `PASS  ${name}` : `FAIL  ${name}`, detail); };
setTimeout(() => { console.log('WATCHDOG: the rehearsal did not finish in 150 s'); process.exit(2); }, 150000).unref();

const dir = await mkdtemp(join(tmpdir(), 'rex890-rehearsal-'));
const app = await createGateway({dir, port: 0, token: OWNER, nodeToken: NODE_TOKEN, roomsDisabled: true, heartbeatTimeout: 2000});
const ask = async (path, {body, credential = OWNER} = {}) => {
  const response = await fetch(`${app.url}/api/v0/${path}`, {method: body ? 'POST' : 'GET', headers: headersFor(credential), body: body ? JSON.stringify(body) : undefined});
  const text = await response.text();
  let json = null; try { json = JSON.parse(text); } catch { /* reported as text */ }
  return {status: response.status, body: json, text};
};

let socket = null;
try {
  phase('1 a fresh City');
  const city = await ask('city');
  record('a fresh City starts and answers the owner', city.status === 200 && Boolean(city.body?.cityId), `HTTP ${city.status} city=${String(city.body?.cityId).slice(0, 8)}`);

  phase('2 two execution nodes and a live control surface');
  for (const id of WORKERS) {
    const registered = await ask('node/register', {credential: NODE_TOKEN, body: {id, displayName: id, capabilities: ['task.execute.safe', 'filesystem.temp'], roles: ['EXECUTION_NODE'], metadata: {platform: 'reference'}}});
    const beat = await ask('node/heartbeat', {credential: NODE_TOKEN, body: {id}});
    line(`node ${id}`, `register=${registered.status} heartbeat=${beat.status}`);
  }
  const nodes = (await ask('city')).body?.nodes?.filter(node => WORKERS.includes(node.id)) ?? [];
  record('two execution nodes are online', nodes.length === 2 && nodes.every(n => n.online === true), nodes.map(n => `${n.id}:${n.online}`).join(' '));
  socket = new WebSocket(`${app.url.replace('http', 'ws')}/api/v0/events/stream?apiVersion=0&schemaVersion=0&clientRef=rehearsal-surface&clientLabel=Rehearsal`, ['city-token.' + Buffer.from(OWNER).toString('base64url')]);
  await new Promise((yes, no) => {socket.on('open', yes); socket.on('error', no);});
  line('control surface', 'open');

  phase('3 register the experiment and start the campaign');
  const manifest = {
    experimentId: 'rex890-rehearsal-multi-device',
    question: 'Does a fresh City produce a reproducible artifact from a multi-device repetition set?',
    // MEASURED against the manifest contract, and against the accepted receipts: SINGLE_CITY means ONE host, and
    // every worker must be one of the declared hosts, so a two-worker study must declare TWO_HOST_MESH. The real
    // accepted campaigns in the resident City do exactly this - hosts and workers are both the two device refs.
    topology: 'TWO_HOST_MESH', hosts: WORKERS, workers: WORKERS, controlSurfaces: ['rehearsal-surface'],
    variables: {independent: ['scenario'], dependent: ['completion'], controls: ['taskType']},
    repetitions: REPETITIONS, seedPolicy: 'PER_REPETITION', baseSeed: 20261006,
    requiredCapabilities: ['research.evidence.review'],
    stopConditions: [{kind: 'MAX_REPETITIONS', value: REPETITIONS}, {kind: 'MAX_FAILURES', value: REPETITIONS}],
    artifactPolicy: {retention: 'SUMMARY_ONLY'},
    acceptance: {primary: 'Every repetition is a canonical task that reached a terminal state'},
    softwareRefs: ['utopia@' + '0'.repeat(40)],
  };
  const registered = await ask('research/experiments', {body: {manifest}});
  line('experiment register', `HTTP ${registered.status} ${JSON.stringify(registered.body ?? registered.text).slice(0, 120)}`);
  record('the experiment registers', registered.status === 200, `HTTP ${registered.status}`);
  const started = await ask('research/campaigns', {body: {experimentId: manifest.experimentId, scenarioId: 'WAIT'}});
  line('campaign start', `HTTP ${started.status} ${JSON.stringify(started.body ?? started.text).slice(0, 200)}`);
  record('the campaign starts', started.status === 200, `HTTP ${started.status} state=${started.body?.live?.state ?? 'n/a'}`);
  if (started.status !== 200) console.log('start refusal body: ' + started.text.slice(0, 400));

  phase('4 drive both workers until the campaign settles');
  // MEASURED mechanics (from a focused diagnostic): each campaign run creates ONE task addressed to the worker
  // the placement chose, so the claim must be attempted by every worker, and the runs are sequential - the next
  // task appears only after the previous one reaches a terminal state. The fault is injected AFTER the campaign
  // for that reason: a fault that refuses the targeted worker's claim legitimately stalls the run it targets,
  // which is a separate experiment from "can a fresh City produce an artifact".
  const terminal = ['COMPLETED', 'STOPPED', 'REFUSED', 'FAILED', 'INTERRUPTED'];
  const claimedBy = new Set();
  let live = started.body?.live ?? null;
  let lastState = null;
  let debuggedClaim = false;
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline && !(live && ['COMPLETED', 'STOPPED', 'REFUSED', 'FAILED', 'INTERRUPTED'].includes(live.state))) {
    if (live?.state !== lastState) { line('campaign state', `${live?.state ?? 'n/a'} runs=${live?.totalRuns ?? '?'}`); lastState = live?.state; }
    for (const id of WORKERS) {
      const claimed = await ask('node/claim', {credential: NODE_TOKEN, body: {id}});
      const task = claimed.body?.task;
      if (!debuggedClaim) { debuggedClaim = true; line('first claim', `${id} HTTP ${claimed.status} task=${task?.id ?? 'null'}`); }
      if (!task) continue;
      claimedBy.add(id);
      await ask('node/report', {credential: NODE_TOKEN, body: {id, taskId: task.id, state: 'RUNNING', progress: 50}});
      await ask('node/report', {credential: NODE_TOKEN, body: {id, taskId: task.id, state: 'COMPLETED', progress: 100, result: {ok: true}}});
    }
    live = (await ask('research/campaigns')).body?.live ?? live;
    await sleep(25);
  }
  record('the campaign settles', Boolean(live) && terminal.includes(live.state), `state=${live?.state} runs=${live?.totalRuns ?? '?'}`);
  const receipts = (await ask('research/campaigns')).body?.receipts ?? [];
  record('the City holds a receipt for the campaign', receipts.length >= 1, `receipts=${receipts.length}`);
  record('both workers did real work (multi-device placement)', claimedBy.size === 2, `workers that claimed: ${[...claimedBy].join(', ') || 'none'}`);

  phase('5 inject one real fault, check it is targeted, then recover');
  const faultStart = await ask('research/faults', {body: {kind: 'PROVIDER_UNAVAILABLE', nodeId: WORKERS[1], durationMs: 4000, confirmation: `FAULT:PROVIDER_UNAVAILABLE:${WORKERS[1]}`}});
  const fault = faultStart.body?.fault;
  record('a fault can be injected in this City', faultStart.status === 200 && Boolean(fault?.faultId), `HTTP ${faultStart.status} ${fault?.faultId ?? faultStart.text.slice(0, 60)}`);
  const faulted = await ask('node/claim', {credential: NODE_TOKEN, body: {id: WORKERS[1]}});
  const other = await ask('node/claim', {credential: NODE_TOKEN, body: {id: WORKERS[0]}});
  record('the fault is targeted: only the faulted worker is refused', faulted.status === 503 && other.status === 200, `faulted=HTTP ${faulted.status} other=HTTP ${other.status}`);
  const stopped = fault ? await ask(`research/faults/${fault.faultId}/stop`, {body: {}}) : {status: 0};
  const recovered = await ask('node/claim', {credential: NODE_TOKEN, body: {id: WORKERS[1]}});
  record('recovery is observable after the stop', stopped.status === 200 && recovered.status === 200, `stop=HTTP ${stopped.status} recovered=HTTP ${recovered.status}`);
  if (fault) {
    const detail = await ask(`research/faults/${fault.faultId}`);
    const metrics = detail.body?.fault?.metrics;
    record('the fault receipt records what was observed (unknowns stay typed)',
      detail.status === 200 && Boolean(metrics),
      `status=${detail.body?.fault?.status} injected=${metrics?.injectedFailureCount} detection=${metrics?.detectionTimeMs ?? 'null'} recovery=${metrics?.recoveryTimeMs ?? 'null'}`);
  }

  phase('6 export with the real CLI');
  const configPath = join(dir, 'rehearsal-config.json');
  await writeFile(configPath, JSON.stringify({token: OWNER}), 'utf8');
  const exportRun = await runChild(['scripts/export-research-artifact.mjs', '--city', app.url, '--out', OUT, '--config', configPath], 60000);
  line('export CLI exit', exportRun.status);
  console.log((exportRun.stdout ?? '').trim().split('\n').slice(0, 8).map(l => '  ' + l).join('\n'));
  if (exportRun.stderr) console.log('  stderr: ' + (exportRun.stderr ?? '').trim().split('\n').slice(0, 4).join(' | '));
  record('the real exporter CLI produces a package from this City', exportRun.status === 0, `exit=${exportRun.status}`);

  phase('7 verify the produced package (package-only, independent implementation)');
  if (exportRun.status === 0) {
    const verifyRun = await runChild(['scripts/verify-research-artifact.mjs', OUT], 60000);
    const tail = (verifyRun.stdout ?? '').trim().split('\n');
    console.log(tail.slice(-4).map(l => '  ' + l).join('\n'));
    record('the independent verifier accepts the produced package', verifyRun.status === 0, `exit=${verifyRun.status} ${tail[tail.length - 1] ?? ''}`);
  }
} finally {
  phase('teardown');
  try { socket?.close(); } catch { /* already closed */ }
  await app.close();
  await sleep(250);
  await rm(dir, {recursive: true, force: true});
}

const failed = results.filter(r => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} rehearsal checks pass`);
if (failed.length) console.log('failed: ' + failed.map(r => r.name).join(' | '));
process.exit(failed.length ? 1 : 0);
