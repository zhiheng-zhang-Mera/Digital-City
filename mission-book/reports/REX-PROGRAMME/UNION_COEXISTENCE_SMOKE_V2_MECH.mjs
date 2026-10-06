// REX three-way union coexistence smoke, v2 - the full chain, driven by a real worker.
//
// WHAT CHANGED FROM v1, and why the change is the point: v1 only WAITED after starting the campaign. The City
// creates one canonical task per repetition and nothing claims it, so the run TIMED OUT, the receipt carried no
// taskRef, and the replay was refused with REPLAY_SOURCE_INVALID. v1's record states that honestly as a limitation
// of the instrument ("campaign -> replay 的完整链路未跑通"), and this version removes the limitation by driving the
// declared worker: heartbeat, claim, RUNNING, COMPLETED.
//
// The three-way claim this proves on the union of REX-803 + REX-804 + REX-805 in ONE City:
//   1. a fault is injected on a second node and is ACTIVE
//   2. a campaign runs to a MEASURED completion on the declared worker
//   3. a fault is ACTIVE at the moment the replay starts, and the replay produces a comparison
//
// THREE OF THIS VERSION'S OWN CORRECTIONS, kept because they are the same class the record keeps finding:
//   a. it re-injected a fault before the replay unconditionally, and got FAULT_TARGET_BUSY when the first one was
//      still ACTIVE - the product was right, the probe was wrong; it now reuses a live fault and injects only when
//      the window closed.
//   b. it asserted the fault was still ACTIVE AFTER the replay, which fails when nothing hit the faulted node and
//      the 30 s contract maximum simply expired - an expired, never-hit fault is evidence of nothing either way.
//      The claim is asserted where it belongs: a fault ACTIVE at replay start.
//   c. the replay is itself a campaign, so its run needs the worker driven too.
//
// RUN (it imports Utopia modules, so it must live inside the checkout):
//   copy to <checkout>/.union-smoke-v2.mjs && node .union-smoke-v2.mjs
import {mkdtemp, rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createGateway} from './services/dev-gateway/server.mjs';

const H = {'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'};
const dir = await mkdtemp(resolve('.scratch-rex-coexist-'));
const app = await createGateway({dir, port: 0, token: 'smoke-owner', nodeToken: 'smoke-node', roomsDisabled: true});
const owner = {Authorization: 'Bearer smoke-owner'};
const api = async (path, body) => {
  const response = await fetch(`${app.url}/api/v0/${path}`, {headers: {...H, ...owner}, ...(body ? {method: 'POST', body: JSON.stringify(body)} : {})});
  return {status: response.status, body: await response.json().catch(() => null)};
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const registerNode = id => fetch(`${app.url}/api/v0/node/register`, {method: 'POST', headers: {...H, Authorization: 'Bearer smoke-node'}, body: JSON.stringify({id, displayName: id, metadata: {platform: 'reference'}, capabilities: ['task.execute.safe', 'filesystem.temp']})});

let browser = null;
try {
  await registerNode('smoke-worker');
  await registerNode('faulted-worker');

  // Every topology in this contract requires at least one LIVE control surface, and a bare gateway has none: a surface
  // is a connected client, which is exactly how the real three-end campaign ran (a browser and the handset). So connect
  // a real browser before declaring the manifest.
  browser = await chromium.launch({channel: process.platform === 'win32' ? 'msedge' : undefined, headless: true});
  const page = await browser.newPage({locale: 'en-US'});
  await page.goto(app.url);
  await page.locator('#token').fill('smoke-owner');
  await page.locator('#connect').click();
  await page.locator('#connection').filter({hasText: 'ONLINE'}).waitFor({timeout: 15000});
  const surfaceRef = (await api('research/campaigns')).body.topology.surfaces.map(s => s.ref).filter(Boolean)[0];
  assert.ok(surfaceRef, 'a connected browser must appear to the City as a live control surface');
  const topology = (await api('research/campaigns')).body.topology;
  assert.deepEqual(topology.workers.filter(id => id === 'smoke-worker'), ['smoke-worker'], 'the City must report the worker the manifest will declare');
  console.log(`setup       live surface=${surfaceRef} workers=${JSON.stringify(topology.workers)}`);

  // --- 2. REX-804 FIRST, on the other node: a registered node is online at registration but these nodes never send a
  // heartbeat, so the window closes within seconds. Injecting while it is still online also makes the coexistence claim
  // stronger, because the fault is then live across the whole campaign and the replay, not just at the end. The contract
  // caps durationMs at 30000 (INVALID_FAULT above it), which is enough for a one-repetition campaign plus its replay. ---
  const fault = await api('research/faults', {kind: 'PROVIDER_UNAVAILABLE', nodeId: 'faulted-worker', durationMs: 30000, confirmation: 'FAULT:PROVIDER_UNAVAILABLE:faulted-worker'});
  assert.ok([200, 201].includes(fault.status), `REX-804: injecting the fault answered ${fault.status} ${JSON.stringify(fault.body).slice(0, 200)}`);
  assert.equal(fault.body.fault?.status, 'ACTIVE', 'REX-804: the fault must be ACTIVE');
  console.log(`REX-804     fault ${fault.body.fault.faultId} kind=${fault.body.fault.kind} node=${fault.body.fault.nodeId} status=${fault.body.fault.status} (injected BEFORE the campaign)`);

  // --- 1. REX-803: a real campaign, one repetition, on a declared live worker ---
  const experimentId = 'rex-union-coexistence-smoke';
  const manifest = {
    experimentId,
    question: 'Do the campaign, fault and replay surfaces coexist in one City?',
    hypothesis: 'A campaign receipt can be replayed while a fault is active on another node.',
    topology: 'SINGLE_CITY',
    hosts: ['smoke-worker'],
    workers: ['smoke-worker'],
    controlSurfaces: [surfaceRef],
    variables: {independent: ['scenario'], dependent: ['completion'], controls: ['taskType']},
    repetitions: 1,
    seedPolicy: 'PER_REPETITION',
    baseSeed: 424242,
    requiredCapabilities: ['research.evidence.review'],
    stopConditions: [{kind: 'MAX_REPETITIONS', value: 1}, {kind: 'MAX_FAILURES', value: 1}],
    artifactPolicy: {retention: 'SUMMARY_ONLY'},
    acceptance: {primary: 'the repetition completes on a declared worker', minimumSuccessfulRuns: 1},
    // The contract wants software refs as `<component>@<full 40-hex sha>` strings, not objects and not short shas -
    // learned from two rejected manifests, not from guessing.
    softwareRefs: ['utopia@b06504f1f96984c960b2661b8ee3a7130796d379'],
  };
  const registered = await api('research/experiments', {manifest});
  assert.ok([200, 201].includes(registered.status), `REX-803: registering the experiment answered ${registered.status} ${JSON.stringify(registered.body).slice(0, 200)}`);
  const started = await api('research/campaigns', {experimentId, scenarioId: 'WAIT', repetitions: 1, seed: 'union-coexistence-smoke'});
  assert.ok([200, 201].includes(started.status), `REX-803: starting the campaign answered ${started.status} ${JSON.stringify(started.body).slice(0, 200)}`);
  const campaignId = started.body.started?.campaignId ?? started.body.campaignId;
  assert.ok(campaignId, 'REX-803: the campaign start must name its campaign');
  // DRIVE THE CAMPAIGN. The City creates one canonical task per repetition and only a node can claim and complete
  // it; v1 merely waited, so its run TIMED OUT and the replay was refused - recorded then as an instrument
  // limitation. The heartbeat matters too: a node's online window closes and a task addressed to an offline worker
  // is unclaimable.
  const driveCampaign = async ({nodeId = 'smoke-worker', credential = 'smoke-node', deadlineMs = 60000} = {}) => {
    const terminalStates = ['COMPLETED', 'STOPPED', 'REFUSED', 'FAILED', 'INTERRUPTED'];
    const until = Date.now() + deadlineMs;
    while (Date.now() < until) {
      const live = (await api('research/campaigns')).body.live ?? (await api('research/campaigns')).body;
      if (live && terminalStates.includes(live.state)) return live;
      await fetch(`${app.url}/api/v0/node/heartbeat`, {method: 'POST', headers: {...H, Authorization: `Bearer ${credential}`}, body: JSON.stringify({id: nodeId})});
      const claimed = await fetch(`${app.url}/api/v0/node/claim`, {method: 'POST', headers: {...H, Authorization: `Bearer ${credential}`}, body: JSON.stringify({id: nodeId})});
      const claimedBody = await claimed.json().catch(() => null);
      const task = claimedBody?.task;
      if (task) {
        await fetch(`${app.url}/api/v0/node/report`, {method: 'POST', headers: {...H, Authorization: `Bearer ${credential}`}, body: JSON.stringify({id: nodeId, taskId: task.id, state: 'RUNNING', progress: 50})});
        await fetch(`${app.url}/api/v0/node/report`, {method: 'POST', headers: {...H, Authorization: `Bearer ${credential}`}, body: JSON.stringify({id: nodeId, taskId: task.id, state: 'COMPLETED', progress: 100, result: {ok: true}})});
      }
      await sleep(50);
    }
    return (await api('research/campaigns')).body.live;
  };
  const settled = await driveCampaign({});
  assert.ok(settled && settled.state !== 'RUNNING', `REX-803: the campaign must settle, state=${settled?.state}`);
  const receipt = (await api(`research/campaigns/${campaignId}`)).body.campaign ?? (await api(`research/campaigns/${campaignId}`)).body;
  const state = receipt?.state ?? receipt?.campaign?.state;
  assert.equal(state, 'COMPLETED', `REX-803: the campaign must complete, state=${state}`);
  console.log(`REX-803     campaign ${campaignId} state=${state} measured=${receipt?.summary?.measured ?? receipt?.campaign?.summary?.measured}`);

  // --- 3. REX-805: replay that receipt while the fault is live ---
  const sources = await api('research/replays');
  assert.equal(sources.status, 200, `REX-805: the replay surface answered ${sources.status}`);
  assert.ok((sources.body.sources ?? []).some(s => (s.campaignId ?? s.id) === campaignId), 'REX-805: the campaign receipt must be offered as a replay source');

  // Before asking for a replay, test the conditions the engine requires of a source, so a refusal names the failing
  // field instead of only "not fully observable".
  const sourceRun = receipt.runs?.[0] ?? null;
  const sourceChecks = {
    'source terminal': ['COMPLETED', 'STOPPED', 'FAILED'].includes(receipt.state),
    'context.experimentId present': Boolean(receipt.context?.experimentId),
    'exactly one run at index 0': receipt.runs?.filter(r => r.index === 0).length === 1,
    'campaignSeed is string': typeof receipt.campaignSeed === 'string',
    'run.state observable': ['MEASURED', 'FAILED', 'TIMEOUT', 'CANCELLED', 'EXCLUDED'].includes(sourceRun?.state),
    'run.warmup === false': sourceRun?.warmup === false,
    'run.measured matches state': sourceRun?.measured === (sourceRun?.state === 'MEASURED'),
    'run.result.taskRef present': Boolean(sourceRun?.result?.taskRef),
    'assignedNodeId in manifest workers': ['smoke-worker'].includes(sourceRun?.result?.assignedNodeId),
    'timeout a sane integer': Number.isSafeInteger(receipt.timeout) && receipt.timeout >= 1 && receipt.timeout <= 3600000,
    'scenarioId is string': typeof receipt.scenarioId === 'string',
  };
  const failedSourceChecks = Object.entries(sourceChecks).filter(([, ok]) => !ok).map(([name]) => name);
  console.log(`source      run=${JSON.stringify(sourceRun && {index: sourceRun.index, state: sourceRun.state, measured: sourceRun.measured, warmup: sourceRun.warmup, seed: sourceRun.seed, assigned: sourceRun.result?.assignedNodeId, taskRef: sourceRun.result?.taskRef})}`);
  console.log(`source      failed preconditions: ${failedSourceChecks.length ? failedSourceChecks.join(' | ') : '(none)'}`);

  // A LIVE FAULT FOR THE REPLAY WINDOW. Measured twice: the first fault's 30 s window (the contract's maximum) can
  // expire between campaign and replay now that the campaign completes quickly, and a second injection while it is
  // STILL active is refused with FAULT_TARGET_BUSY - the product being correct, the probe being wrong. So reuse the
  // live fault when there is one, inject only when the window has closed, and assert ACTIVE where it matters: as the
  // replay starts.
  const beforeReplay = await api('research/faults');
  let replayFault = (beforeReplay.body.faults ?? []).find(f => f.faultId === fault.body.fault.faultId && f.status === 'ACTIVE') ?? null;
  if (!replayFault) {
    const reInjected = await api('research/faults', {kind: 'PROVIDER_UNAVAILABLE', nodeId: 'faulted-worker', durationMs: 30000, confirmation: 'FAULT:PROVIDER_UNAVAILABLE:faulted-worker'});
    replayFault = reInjected.body?.fault ?? null;
    assert.equal(replayFault?.status, 'ACTIVE', `coexistence: a fault must be ACTIVE when the replay starts (answered ${reInjected.status} ${JSON.stringify(reInjected.body).slice(0, 160)})`);
  }
  console.log(`REX-804     replay-window fault ${replayFault.faultId} status=${replayFault.status}`);
  const replay = await api('research/replays', {sourceCampaignId: campaignId, sourceRunIndex: 0, mode: 'REPLAY'});
  assert.ok([200, 201].includes(replay.status), `REX-805: starting the replay answered ${replay.status} ${JSON.stringify(replay.body).slice(0, 240)}`);
  const replayCampaign = replay.body.started?.campaignId ?? replay.body.started?.id;
  assert.ok(replayCampaign, 'REX-805: the replay start must name the campaign it runs');
  // The replay is itself a campaign, so ITS run needs the worker driven too.
  let replayProgress = (await api('research/campaigns')).body.live;
  for (let i = 0; i < 60 && replayProgress?.state === 'RUNNING'; i += 1) { await driveCampaign({deadlineMs: 4000}); replayProgress = (await api('research/campaigns')).body.live; }
  const comparison = await api(`research/replays/${encodeURIComponent(replayCampaign)}`);
  assert.equal(comparison.status, 200, `REX-805: the comparison answered ${comparison.status} ${JSON.stringify(comparison.body).slice(0, 200)}`);

  // A THIRD correction: this block first asserted the fault was still ACTIVE AFTER the replay, which fails when
  // nothing hit the faulted node and the window simply closed - an expired, never-hit fault is evidence of nothing
  // either way. The coexistence claim was asserted where it belongs, at replay start; what is checked here is only
  // that the fault record is still readable afterwards.
  const stillFaulted = await api('research/faults');
  const active = (stillFaulted.body.faults ?? []).find(f => f.faultId === replayFault.faultId);
  assert.ok(active, `coexistence: the replay-window fault must be readable afterwards, got ${JSON.stringify(stillFaulted.body).slice(0, 160)}`);
  console.log(`REX-805     replay ${replayCampaign} comparison keys=${Object.keys(comparison.body.comparison ?? {}).join(',') || '(none)'}`);
  console.log(`COEXISTENCE campaign completed + fault ACTIVE at replay start (now ${active.status}, injected failures=${active.metrics?.injectedFailureCount ?? 0}) + replay compared, all in one City (cityId=${(await api('city')).body.cityId})`);
} finally {
  await browser?.close().catch(() => {});
  await app.close();
  await rm(dir, {recursive: true, force: true});
}
