// REX-890 option-A feasibility probe (Mech): can a deployable candidate actually inject a fault, observe
// recovery, and serve the artifact surface at the same time?
//
// Why this exists: the REX-890 preflight found that the RESIDENT City (candidate 0261a9e) answers 404 for both
// /research/faults and /research/artifacts, because the fault controller and the artifact surface arrive on later
// heads. That makes "one injected fault with recovery" look unavailable. This probe measures whether the
// capability exists on a head that is already accepted-but-unmerged (the REX-806 union head 3950d47) - i.e.
// whether option A is a deployment exercise or a product gap.
//
// HOW TO RUN (it imports Utopia modules, so it must run from a Utopia checkout at the head under test):
//   copy this file into <checkout>/.rex890-feasibility.mjs
//   node .rex890-feasibility.mjs
// It starts ONE City on an ephemeral port in a temp directory, exercises it, closes it, and removes the temp dir.
// It never touches the resident City, its data dir, or its credentials.
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createGateway} from './services/dev-gateway/server.mjs';

const OWNER = 'feasibility-owner';
const NODE = 'feasibility-node';
const HEADERS = {Authorization: `Bearer ${OWNER}`, 'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'};
const nodeHeaders = {...HEADERS, Authorization: `Bearer ${NODE}`};
const line = (label, value) => console.log(String(label).padEnd(52), value);
const sleep = ms => new Promise(done => setTimeout(done, ms));

const dir = await mkdtemp(join(tmpdir(), 'rex890-feasibility-'));
const app = await createGateway({dir, port: 0, token: OWNER, nodeToken: NODE, roomsDisabled: true, heartbeatTimeout: 2000});
const call = async (path, {method = 'GET', body, headers = HEADERS} = {}) => {
  const response = await fetch(`${app.url}/api/v0/${path}`, {method, headers, body: body ? JSON.stringify(body) : undefined});
  const text = await response.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* a non-JSON body is reported as text */ }
  return {status: response.status, json, text};
};

const results = [];
const record = (name, ok, detail) => { results.push({name, ok, detail}); line(ok ? `PASS  ${name}` : `FAIL  ${name}`, detail); };
// The City answers errors in two shapes: older routes put a bare string in `error`, newer ones an object with a
// code. MY FIRST VERSION READ ONLY `.error.code` and reported a working surface as a failure.
const errorCode = body => (typeof body?.error === 'string' ? body.error : body?.error?.code ?? null);

try {
  const register = id => ({id, displayName: id, metadata: {platform: 'reference'}, capabilities: ['task.execute.safe', 'filesystem.temp']});
  await call('node/register', {method: 'POST', body: register('target'), headers: nodeHeaders});
  await call('node/register', {method: 'POST', body: register('other'), headers: nodeHeaders});
  await call('node/heartbeat', {method: 'POST', body: {id: 'target'}, headers: nodeHeaders});

  // 1 the artifact surface is deployed on this head: a bare City has no receipt, so the typed answer is 422,
  //   not 404. 404 would mean "this candidate cannot export at all".
  const artifacts = await call('research/artifacts');
  record('artifact surface is deployed (typed 422, not 404)',
    artifacts.status === 422 && errorCode(artifacts.json) === 'ARTIFACT_NO_SOURCE',
    `HTTP ${artifacts.status} ${errorCode(artifacts.json) ?? artifacts.text.slice(0, 60)}`);
  const preview = await call('research/artifacts/preview?limit=5');
  record('artifact preview answers the same way', preview.status === 422, `HTTP ${preview.status}`);

  // 2 the research surface refuses a node credential. NON-DISCRIMINATING BY DESIGN: the generic research guard
  //   answers 401 on every head, including one with no fault route at all, so this check must never be quoted as
  //   evidence that the fault surface exists. It is kept because it documents the boundary, labelled as such.
  const nodeFaults = await call('research/faults', {headers: nodeHeaders});
  record('[non-discriminating] research surface refuses the node credential', nodeFaults.status === 401, `HTTP ${nodeFaults.status}`);

  // 3 inject a real fault, observe the injected failure, then recover. Every later check depends on this one, so a
  //   head without the controller ends the fault half cleanly instead of throwing - MY FIRST VERSION ASSUMED THE
  //   FAULT EXISTED and crashed on the candidate that has no fault surface, which is exactly the head the probe is
  //   supposed to characterise.
  const started = await call('research/faults', {method: 'POST', body: {kind: 'HEARTBEAT_LOSS', nodeId: 'target', durationMs: 5000, confirmation: 'FAULT:HEARTBEAT_LOSS:target'}});
  const fault = started.json?.fault;
  record('a fault can be injected on this head', started.status === 200 && Boolean(fault?.faultId), `HTTP ${started.status} ${fault?.faultId ?? started.text.slice(0, 80)}`);

  if (fault?.faultId) {
    const targeted = await call('node/heartbeat', {method: 'POST', body: {id: 'target'}, headers: nodeHeaders});
    const untargeted = await call('node/heartbeat', {method: 'POST', body: {id: 'other'}, headers: nodeHeaders});
    record('the fault is targeted: the faulted node fails, the other does not',
      targeted.status === 503 && untargeted.status === 200, `target=HTTP ${targeted.status} other=HTTP ${untargeted.status}`);

    // recovery: stop the fault, then the same request must succeed again without restarting anything.
    const stopped = await call(`research/faults/${fault.faultId}/stop`, {method: 'POST', body: {}});
    const recovered = await call('node/heartbeat', {method: 'POST', body: {id: 'target'}, headers: nodeHeaders});
    record('recovery is observable after the stop', stopped.status === 200 && recovered.status === 200,
      `stop=HTTP ${stopped.status} recovered=HTTP ${recovered.status}`);

    // 4 the receipt carries measured, not asserted, recovery numbers (missing reasons are typed when unobserved).
    const detail = await call(`research/faults/${fault.faultId}`);
    const metrics = detail.json?.fault?.metrics;
    record('the receipt exposes the fault with its metrics and status',
      detail.status === 200 && Boolean(metrics) && detail.json.fault.status !== 'ACTIVE',
      `status=${detail.json?.fault?.status} injected=${metrics?.injectedFailureCount} detection=${metrics?.detectionTimeMs ?? 'null'} recovery=${metrics?.recoveryTimeMs ?? 'null'}`);

    // 5 both surfaces coexist on one City and both remain owner-only.
    const ownerArtifacts = await call('research/artifacts');
    record('fault and artifact surfaces coexist on one City',
      ownerArtifacts.status === 422 && detail.status === 200, `artifacts=HTTP ${ownerArtifacts.status} fault detail=HTTP ${detail.status}`);
  } else {
    record('fault-dependent checks were skipped, not passed',
      false, 'no fault could be injected on this head, so targeting, recovery, receipt and coexistence are unmeasured here');
  }
} finally {
  await app.close();
  // Give the store and the fault timers a moment to release before the temp dir goes away: removing it while
  // sqlite still holds the file made libuv assert during teardown on Windows (the checks had already printed).
  await sleep(250);
  await rm(dir, {recursive: true, force: true});
}

const failed = results.filter(r => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} feasibility checks pass`);
process.exit(failed.length ? 1 : 0);
