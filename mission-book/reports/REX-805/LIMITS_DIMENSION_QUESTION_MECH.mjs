// Focused question: why does the comparison report the controlled dimension `limits` as differing?
//
// replay.mjs:108 checks `replay.limits` against `limits(expectedManifest, selectedLimits(source))`. If the runner
// PERSISTS a different shape than that function RETURNS, every replay of an HTTP-started source would report a
// controlled-input difference it does not actually have - which would be a real, if non-blocking, defect in the
// comparison's honesty. This prints both receipts' limits and the stop conditions each manifest declared.
import {mkdtemp, rm} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {chromium} from 'playwright';
import {createGateway} from './services/dev-gateway/server.mjs';

const H = {'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'};
const dir = await mkdtemp(resolve('.scratch-rex805-limits-'));
const app = await createGateway({dir, port: 0, token: 'lim-owner', nodeToken: 'lim-node', roomsDisabled: true});
const owner = {Authorization: 'Bearer lim-owner'};
const api = async (path, body) => { const r = await fetch(`${app.url}/api/v0/${path}`, {headers: {...H, ...owner}, ...(body ? {method: 'POST', body: JSON.stringify(body)} : {})}); return {status: r.status, body: await r.json().catch(() => null)} };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const readReceipt = id => JSON.parse(readFileSync(resolve(dir, 'research', 'campaigns', `${id}.json`), 'utf8'));
let browser = null;
try {
  for (const id of ['lim-worker', 'lim-alternate']) {
    await fetch(`${app.url}/api/v0/node/register`, {method: 'POST', headers: {...H, Authorization: 'Bearer lim-node'}, body: JSON.stringify({id, displayName: id, metadata: {platform: 'reference'}, capabilities: ['task.execute.safe', 'filesystem.temp']})});
  }
  browser = await chromium.launch({channel: process.platform === 'win32' ? 'msedge' : undefined, headless: true});
  const page = await browser.newPage({locale: 'en-US'});
  await page.goto(app.url);
  await page.locator('#token').fill('lim-owner');
  await page.locator('#connect').click();
  await page.locator('#connection').filter({hasText: 'ONLINE'}).waitFor({timeout: 15000});
  const surface = (await api('research/campaigns')).body.topology.surfaces.map(s => s.ref).filter(Boolean)[0];

  const experimentId = 'rex805-limits-question';
  const manifest = {
    experimentId, question: 'q', hypothesis: 'h', topology: 'TWO_HOST_MESH', hosts: ['lim-worker', 'lim-alternate'], workers: ['lim-worker', 'lim-alternate'], controlSurfaces: [surface],
    variables: {independent: ['scenario'], dependent: ['completion'], controls: ['taskType']}, repetitions: 1, seedPolicy: 'PER_REPETITION', baseSeed: 7,
    requiredCapabilities: ['research.evidence.review'], stopConditions: [{kind: 'MAX_REPETITIONS', value: 1}], artifactPolicy: {retention: 'SUMMARY_ONLY'},
    acceptance: {primary: 'p', minimumSuccessfulRuns: 1}, softwareRefs: ['utopia@b06504f1f96984c960b2661b8ee3a7130796d379'],
  };
  await api('research/experiments', {manifest});
  const started = await api('research/campaigns', {experimentId, scenarioId: 'WAIT', repetitions: 1, seed: 'limits-question-seed'});
  const sourceId = started.body.started?.campaignId;
  let live = (await api('research/campaigns')).body.live;
  for (let i = 0; i < 45 && live?.state === 'RUNNING'; i += 1) { await sleep(1000); live = (await api('research/campaigns')).body.live; }
  const source = readReceipt(sourceId);
  console.log(`SOURCE      limits=${JSON.stringify(source.limits)} stopConditions=${JSON.stringify(source.context.manifest.stopConditions)} timeout=${source.timeout} repetitions=${source.repetitions}`);

  // Patch the run so the replay's source conditions hold (same technique as the feasibility fixture).
  source.runs[0] = {...source.runs[0], state: 'MEASURED', measured: true, warmup: false, result: {taskRef: 'Q-fixture', state: 'COMPLETED', assignedNodeId: source.context.manifest.workers[source.runs[0].seed % source.context.manifest.workers.length], result: {waitedMs: 6000}}};
  const {writeFileSync} = await import('node:fs');
  writeFileSync(resolve(dir, 'research', 'campaigns', `${sourceId}.json`), JSON.stringify(source, null, 2) + '\n');
  for (const id of ['lim-worker', 'lim-alternate']) {
    await fetch(`${app.url}/api/v0/node/register`, {method: 'POST', headers: {...H, Authorization: 'Bearer lim-node'}, body: JSON.stringify({id, displayName: id, metadata: {platform: 'reference'}, capabilities: ['task.execute.safe', 'filesystem.temp']})});
  }
  const replay = await api('research/replays', {sourceCampaignId: sourceId, sourceRunIndex: 0, mode: 'REPLAY'});
  if (![200, 201].includes(replay.status)) { console.log(`REPLAY      refused ${replay.status} ${JSON.stringify(replay.body).slice(0, 160)}`); }
  else {
    const replayId = replay.body.started?.campaignId;
    let live2 = (await api('research/campaigns')).body.live;
    for (let i = 0; i < 45 && live2?.state === 'RUNNING'; i += 1) { await sleep(1000); live2 = (await api('research/campaigns')).body.live; }
    const r = readReceipt(replayId);
    console.log(`REPLAY      limits=${JSON.stringify(r.limits)} stopConditions=${JSON.stringify(r.context.manifest.stopConditions)} timeout=${r.timeout} repetitions=${r.repetitions} lineage=${JSON.stringify(r.context.replay ?? null).slice(0, 200)}`);
    console.log(`QUESTION    source.limits === replay.limits ? ${JSON.stringify(source.limits) === JSON.stringify(r.limits)}`);
  }
} finally {
  await browser?.close().catch(() => {});
  await app.close();
  await rm(dir, {recursive: true, force: true});
}
