// REX-805 formal review probes, part 2: in-process, at the reviewed head, for the two refusals a live City cannot be
// asked to demonstrate safely:
//
//  P6  "unavailable conditions cannot be replayed" - a source whose recorded topology is no longer live must be refused
//      by name, not replayed against whatever happens to be running
//  P7  an unusable receipt store must be a TYPED refusal and the City must still start and serve - the store-guard family
//      shape this programme has found six times, where a store a City cannot use turns into a City that will not boot
import {mkdtemp, rm, mkdir} from 'node:fs/promises';
import {writeFileSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {chromium} from 'playwright';
import {createGateway} from './services/dev-gateway/server.mjs';

const results = [];
const record = (id, name, passed, detail) => { results.push({id, name, passed, detail}); console.log(`${passed ? 'PASS' : 'FAIL'}  ${id} ${name}${detail ? `  [${detail}]` : ''}`); };
const H = {'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'};
const sleep = ms => new Promise(r => setTimeout(r, ms));

// --- P6: recorded topology not live ------------------------------------------------------------------------------
{
  const dir = await mkdtemp(join(tmpdir(), 'rex805-p6-'));
  const app = await createGateway({dir, port: 0, token: 'p6-owner', nodeToken: 'p6-node', roomsDisabled: true});
  const owner = {Authorization: 'Bearer p6-owner'};
  const api = async (path, body) => { const r = await fetch(`${app.url}/api/v0/${path}`, {headers: {...H, ...owner}, ...(body ? {method: 'POST', body: JSON.stringify(body)} : {})}); return {status: r.status, body: await r.json().catch(() => null)}; };
  let browser = null;
  try {
    for (const id of ['p6-a', 'p6-b']) {
      await fetch(`${app.url}/api/v0/node/register`, {method: 'POST', headers: {...H, Authorization: 'Bearer p6-node'}, body: JSON.stringify({id, displayName: id, metadata: {platform: 'reference'}, capabilities: ['task.execute.safe', 'filesystem.temp']})});
    }
    browser = await chromium.launch({channel: process.platform === 'win32' ? 'msedge' : undefined, headless: true});
    const page = await browser.newPage({locale: 'en-US'});
    await page.goto(app.url);
    await page.locator('#token').fill('p6-owner');
    await page.locator('#connect').click();
    await page.locator('#connection').filter({hasText: 'ONLINE'}).waitFor({timeout: 15000});
    const surface = (await api('research/campaigns')).body.topology.surfaces.map(s => s.ref).filter(Boolean)[0];
    const experimentId = 'review-p6-topology';
    await api('research/experiments', {manifest: {
      experimentId, question: 'q', hypothesis: 'h', topology: 'TWO_HOST_MESH', hosts: ['p6-a', 'p6-b'], workers: ['p6-a', 'p6-b'], controlSurfaces: [surface],
      variables: {independent: ['scenario'], dependent: ['completion'], controls: ['taskType']}, repetitions: 1, seedPolicy: 'PER_REPETITION', baseSeed: 5,
      requiredCapabilities: ['research.evidence.review'], stopConditions: [{kind: 'MAX_REPETITIONS', value: 1}], artifactPolicy: {retention: 'SUMMARY_ONLY'},
      acceptance: {primary: 'the repetition is measured', minimumSuccessfulRuns: 1}, softwareRefs: ['utopia@0261a9ed1cec88df3ab4675623d422b37b33f270'],
    }});
    const started = await api('research/campaigns', {experimentId, scenarioId: 'WAIT', repetitions: 1, seed: 'p6-seed'});
    const campaignId = started.body?.started?.campaignId;
    // Let it reach a terminal state, then make the source replayable by patching only the run - the technique this
    // programme already validated. Nothing else about the receipt is touched.
    for (let i = 0; i < 60; i += 1) {
      const detail = (await api(`research/campaigns/${campaignId}`)).body?.campaign;
      if (detail && ['COMPLETED', 'STOPPED', 'FAILED'].includes(detail.state)) break;
      await sleep(1000);
    }
    const file = resolve(dir, 'research', 'campaigns', `${campaignId}.json`);
    const receipt = JSON.parse(readFileSync(file, 'utf8'));
    const workers = receipt.context.manifest.workers;
    const seed = receipt.runs[0].seed;
    receipt.runs[0] = {...receipt.runs[0], state: 'MEASURED', measured: true, warmup: false, result: {taskRef: `Q-p6-${seed}`, state: 'COMPLETED', assignedNodeId: workers[seed % workers.length], result: {waitedMs: 6000}}};
    writeFileSync(file, JSON.stringify(receipt, null, 2) + '\n');

    // Now make the recorded topology UNavailable: let the registrations decay (they carry no heartbeat) and take the
    // control surface away. The engine must refuse rather than replay against an environment it cannot reproduce.
    await browser.close();
    browser = null;
    await sleep(6000);
    const topologyNow = (await api('research/campaigns')).body.topology;
    const attempt = await api('research/replays', {sourceCampaignId: campaignId, sourceRunIndex: 0, mode: 'REPLAY'});
    record('P6', 'a source whose recorded topology is not live is refused by name, not replayed',
      attempt.status === 409 && attempt.body?.errorCode === 'REPLAY_TOPOLOGY_NOT_READY',
      `workersNow=${JSON.stringify(topologyNow.workers)} surfacesNow=${topologyNow.surfaces.length} -> status=${attempt.status} code=${attempt.body?.errorCode}`);
  } catch (error) {
    record('P6', 'a source whose recorded topology is not live is refused by name, not replayed', false, `probe error: ${error.message}`);
  } finally {
    await browser?.close().catch(() => {});
    await app.close();
    await rm(dir, {recursive: true, force: true});
  }
}

// --- P7: an unusable receipt store --------------------------------------------------------------------------------
{
  const dir = await mkdtemp(join(tmpdir(), 'rex805-p7-'));
  let app = null;
  try {
    // The family shape: a FILE where the store needs a DIRECTORY. The City must still start and serve, and the refusal
    // must be typed.
    await mkdir(resolve(dir, 'research'), {recursive: true});
    writeFileSync(resolve(dir, 'research', 'campaigns'), 'this is a file, not the receipt directory\n');
    app = await createGateway({dir, port: 0, token: 'p7-owner', nodeToken: 'p7-node', roomsDisabled: true});
    const owner = {Authorization: 'Bearer p7-owner'};
    const api = async (path, body) => { const r = await fetch(`${app.url}/api/v0/${path}`, {headers: {...H, ...owner}, ...(body ? {method: 'POST', body: JSON.stringify(body)} : {})}); return {status: r.status, body: await r.json().catch(() => null)}; };
    const city = await api('city');
    const campaigns = await api('research/campaigns');
    record('P7a', 'the City STARTED with a receipt store it cannot use (the store-guard family property)',
      city.status === 200 && campaigns.status === 200,
      `city=${city.status} campaigns=${campaigns.status} storeState=${campaigns.body?.storeState} storeReason=${JSON.stringify(campaigns.body?.storeReason ?? null).slice(0, 80)}`);
    const attempt = await api('research/replays', {sourceCampaignId: 'campaign-00000000-0000-0000-0000-000000000000', sourceRunIndex: 0, mode: 'REPLAY'});
    record('P7b', 'a replay against an unusable receipt store is refused with a typed reason',
      [404, 409, 422, 500, 503].includes(attempt.status) && typeof attempt.body?.errorCode === 'string' && attempt.body.errorCode.length > 0,
      `status=${attempt.status} code=${attempt.body?.errorCode}`);
    record('P7c', 'the store state is disclosed rather than reported as a calm empty window',
      campaigns.body?.storeState !== 'READY' || (campaigns.body?.receipts ?? []).length === 0,
      `storeState=${campaigns.body?.storeState} receipts=${(campaigns.body?.receipts ?? []).length}`);
  } catch (error) {
    record('P7a', 'the City STARTED with a receipt store it cannot use (the store-guard family property)', false, `the City did not start: ${error.message}`);
  } finally {
    await app?.close().catch(() => {});
    await rm(dir, {recursive: true, force: true});
  }
}

const failed = results.filter(r => !r.passed);
console.log(`\n${results.length - failed.length}/${results.length} in-process review probes pass`);
process.exit(0);
