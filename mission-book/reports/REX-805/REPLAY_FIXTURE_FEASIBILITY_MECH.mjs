// Feasibility fixture for the REX-805 review: can a replay be exercised on a City with no executing worker?
//
// Last round's smoke established that a replay needs a MEASURED source run, and that a bare in-process City cannot
// produce one because nothing executes canonical tasks. The review needs the replay chain, so this builds the
// precondition the honest way: let the City write an AUTHENTIC receipt (real context, real manifestIdentity, real
// campaign seed - the runner writes it), then patch only the RUN to the measured form a real worker would have produced,
// and see whether the engine accepts it and produces a comparison.
//
// Everything except the run's outcome is the City's own bytes. That is the difference between manufacturing the
// precondition and manufacturing the evidence.
import {mkdtemp, rm} from 'node:fs/promises';
import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createGateway} from './services/dev-gateway/server.mjs';

const H = {'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'};
const dir = await mkdtemp(resolve('.scratch-rex805-fixture-'));
const app = await createGateway({dir, port: 0, token: 'fx-owner', nodeToken: 'fx-node', roomsDisabled: true});
const owner = {Authorization: 'Bearer fx-owner'};
const api = async (path, body) => { const r = await fetch(`${app.url}/api/v0/${path}`, {headers: {...H, ...owner}, ...(body ? {method: 'POST', body: JSON.stringify(body)} : {})}); return {status: r.status, body: await r.json().catch(() => null)} };
const sleep = ms => new Promise(r => setTimeout(r, ms));

let browser = null;
try {
  for (const id of ['fx-worker', 'fx-alternate']) {
    await fetch(`${app.url}/api/v0/node/register`, {method: 'POST', headers: {...H, Authorization: 'Bearer fx-node'}, body: JSON.stringify({id, displayName: id, metadata: {platform: 'reference'}, capabilities: ['task.execute.safe', 'filesystem.temp']})});
  }
  browser = await chromium.launch({channel: process.platform === 'win32' ? 'msedge' : undefined, headless: true});
  const page = await browser.newPage({locale: 'en-US'});
  await page.goto(app.url);
  await page.locator('#token').fill('fx-owner');
  await page.locator('#connect').click();
  await page.locator('#connection').filter({hasText: 'ONLINE'}).waitFor({timeout: 15000});
  const surface = (await api('research/campaigns')).body.topology.surfaces.map(s => s.ref).filter(Boolean)[0];
  assert.ok(surface, 'a live control surface is required by every topology in this contract');

  const experimentId = 'rex805-replay-fixture';
  const manifest = {
    experimentId, question: 'Can a recorded campaign be replayed and compared here?', hypothesis: 'h',
    // TWO_HOST_MESH, not SINGLE_CITY: ABLATION needs a second declared worker to be able to disable its selection, and
    // SINGLE_CITY rejects a second worker that is not also a declared host (learned from a rejected manifest).
    topology: 'TWO_HOST_MESH', hosts: ['fx-worker', 'fx-alternate'], workers: ['fx-worker', 'fx-alternate'], controlSurfaces: [surface],
    variables: {independent: ['scenario'], dependent: ['completion'], controls: ['taskType']},
    repetitions: 1, seedPolicy: 'PER_REPETITION', baseSeed: 20261006,
    requiredCapabilities: ['research.evidence.review'],
    stopConditions: [{kind: 'MAX_REPETITIONS', value: 1}], artifactPolicy: {retention: 'SUMMARY_ONLY'},
    acceptance: {primary: 'the repetition completes on a declared worker', minimumSuccessfulRuns: 1},
    softwareRefs: ['utopia@b06504f1f96984c960b2661b8ee3a7130796d379'],
  };
  const registered = await api('research/experiments', {manifest});
  assert.ok([200, 201].includes(registered.status), `experiment registration answered ${registered.status}: ${JSON.stringify(registered.body).slice(0, 200)}`);

  // Let the City write a REAL receipt. Its run times out because nothing executes here - that is the precondition this
  // fixture exists to repair, and the receipt's context is what must stay authentic.
  const started = await api('research/campaigns', {experimentId, scenarioId: 'WAIT', repetitions: 1, seed: 'rex805-fixture-seed'});
  assert.ok([200, 201].includes(started.status), `campaign start answered ${started.status}`);
  const campaignId = started.body.started?.campaignId;
  let live = (await api('research/campaigns')).body.live;
  for (let i = 0; i < 45 && live?.state === 'RUNNING'; i += 1) { await sleep(1000); live = (await api('research/campaigns')).body.live; }

  // Patch ONLY the run, on disk, where receipt() reads it.
  const file = resolve(dir, 'research', 'campaigns', `${campaignId}.json`);
  const receipt = JSON.parse(readFileSync(file, 'utf8'));
  const authentic = {state: receipt.state, scenarioId: receipt.scenarioId, campaignSeed: receipt.campaignSeed, manifestIdentity: receipt.context?.manifestIdentity, runBefore: {state: receipt.runs[0].state, measured: receipt.runs[0].measured, result: receipt.runs[0].result ?? null}};
  const cityTasks = (await api('city')).body.tasks ?? [];
  const waitTask = [...cityTasks].reverse().find(task => task.type === 'WAIT');
  assert.ok(waitTask, 'the campaign created a canonical task; the fixture uses its real id');
  // A real placement is not arbitrary: the run lands on workers[seed % workers.length], and the engine refuses a source
  // whose recorded placement contradicts that. So the fixture reproduces the rule rather than inventing a node - which
  // is also what the acceptance criteria mean by "the seed is used, not decorative".
  const workers = receipt.context.manifest.workers;
  const seed = receipt.runs[0].seed;
  const placedOn = workers[seed % workers.length];
  receipt.runs[0] = {...receipt.runs[0], state: 'MEASURED', measured: true, warmup: false, result: {taskRef: waitTask.id, state: 'COMPLETED', assignedNodeId: placedOn, result: {waitedMs: 6000}}};
  writeFileSync(file, JSON.stringify(receipt, null, 2) + '\n');
  console.log(`fixture     campaign=${campaignId} authentic=${JSON.stringify(authentic)}`);
  console.log(`fixture     patched run -> ${JSON.stringify({state: receipt.runs[0].state, measured: receipt.runs[0].measured, seed, placementRule: `${seed} % ${workers.length}`, taskRef: receipt.runs[0].result.taskRef, assigned: placedOn})}`);

  const sources = await api('research/replays');
  assert.ok((sources.body.sources ?? []).some(s => (s.campaignId ?? s.id) === campaignId), 'the patched receipt must be offered as a replay source');

  // The engine's preflight requires the RECORDED topology to be live NOW ("unavailable conditions cannot be replayed
  // deterministically"), and these registered nodes send no heartbeat, so they went offline during the campaign's
  // 30-second timeout. Re-registering restores them; a real worker with a heartbeat would not need this.
  for (const id of ['fx-worker', 'fx-alternate']) {
    await fetch(`${app.url}/api/v0/node/register`, {method: 'POST', headers: {...H, Authorization: 'Bearer fx-node'}, body: JSON.stringify({id, displayName: id, metadata: {platform: 'reference'}, capabilities: ['task.execute.safe', 'filesystem.temp']})});
  }
  const readiness = (await api('research/campaigns')).body.topology;
  console.log(`fixture     topology now live: workers=${JSON.stringify(readiness.workers)} surfaces=${JSON.stringify(readiness.surfaces.map(s => s.ref))}`);

  const replay = await api('research/replays', {sourceCampaignId: campaignId, sourceRunIndex: 0, mode: 'REPLAY'});
  console.log(`REPLAY      status=${replay.status} ${JSON.stringify(replay.body).slice(0, 220)}`);
  assert.ok([200, 201].includes(replay.status), `REPLAY must be accepted once a measured source exists (answered ${replay.status})`);
  const replayCampaignId = replay.body.started?.campaignId ?? replay.body.started?.id;
  assert.ok(replayCampaignId, 'the replay must name the campaign it runs');

  let replayLive = (await api('research/campaigns')).body.live;
  for (let i = 0; i < 45 && replayLive?.state === 'RUNNING'; i += 1) { await sleep(1000); replayLive = (await api('research/campaigns')).body.live; }
  const comparison = await api(`research/replays/${encodeURIComponent(replayCampaignId)}`);
  console.log(`COMPARE     status=${comparison.status} keys=${Object.keys(comparison.body?.comparison ?? {}).join(',') || '(none)'}`);
  console.log(`COMPARE     body=${JSON.stringify(comparison.body?.comparison ?? comparison.body).slice(0, 400)}`);
  assert.equal(comparison.status, 200, 'the comparison must answer for a replay of a measured source run');
  console.log('FEASIBLE    a replay runs and compares on a City with no executor, using an authentic receipt with a patched run');
} finally {
  await browser?.close().catch(() => {});
  await app.close();
  await rm(dir, {recursive: true, force: true});
}
