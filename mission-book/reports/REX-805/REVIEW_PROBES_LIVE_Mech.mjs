// REX-805 formal review probes, part 1: against the LIVE resident City, which runs the reviewed head 0261a9e with both
// declared host workers and the Android control surface online. These are the reviewer's own probes and none of them
// re-runs the author's suite.
//
//  P1  an EMPTY limit set source stays comparable after replay   (the branch the author repaired in 0261a9e)
//  P2  two replays of one source agree on every descriptive field (determinism, and fresh identities)
//  P3  alternate-device ablation changes the placement it claims to change
//  P4  a mechanism outside the exact v1 policy is refused, not ignored
//  P5  an unknown source is refused by name
import {readFileSync} from 'node:fs';

const CITY = 'http://172.31.12.151:4391';
const secret = JSON.parse(readFileSync('C:/ProgramData/Utopia/host/city/local-config.json', 'utf8')).token;
const H = {'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0', Authorization: `Bearer ${secret}`};
const api = async (path, body) => {
  const response = await fetch(`${CITY}/api/v0/${path}`, {headers: H, ...(body ? {method: 'POST', body: JSON.stringify(body)} : {})});
  return {status: response.status, body: await response.json().catch(() => null)};
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = [];
const record = (id, name, passed, detail) => { results.push({id, name, passed, detail}); console.log(`${passed ? 'PASS' : 'FAIL'}  ${id} ${name}${detail ? `  [${detail}]` : ''}`); };

const city = (await api('city')).body;
const topology = (await api('research/campaigns')).body.topology;
const workers = topology.workers.filter(Boolean);
const surface = topology.surfaces.map(s => s.ref).filter(Boolean)[0];

const waitTerminal = async campaignId => {
  // Poll the DETAIL route for a terminal state. The first version of this probe also required `live` to be empty, but
  // the City keeps the last campaign in `live` even after it completes, so the loop never fired and three probes read
  // `undefined` from receipts they had actually produced. That was the probe's defect, not the product's.
  for (let i = 0; i < 90; i += 1) {
    const detail = (await api(`research/campaigns/${campaignId}`)).body?.campaign;
    if (detail && ['COMPLETED', 'STOPPED', 'FAILED', 'REFUSED'].includes(detail.state)) return detail;
    await sleep(1000);
  }
  return null;
};
const comparisonOf = async campaignId => {
  const r = await api(`research/replays/${encodeURIComponent(campaignId)}`);
  return {status: r.status, comparison: r.body?.comparison ?? r.body};
};

// --- P4 / P5: refusals first, because they need no campaign and must not be silent -------------------------------
const unsupported = await api('research/replays', {sourceCampaignId: 'campaign-966cf439-7017-4bb0-88e8-981e59c18322', sourceRunIndex: 1, mode: 'ABLATION', disabledMechanisms: ['handoff']});
record('P4', 'a mechanism outside the exact v1 ablation policy is refused by name',
  unsupported.status === 422 && unsupported.body?.errorCode === 'ABLATION_UNSUPPORTED',
  `status=${unsupported.status} code=${unsupported.body?.errorCode}`);

const replayWithDisable = await api('research/replays', {sourceCampaignId: 'campaign-966cf439-7017-4bb0-88e8-981e59c18322', sourceRunIndex: 1, mode: 'REPLAY', disabledMechanisms: ['alternate-device']});
record('P4b', 'a REPLAY carrying an ablation control is refused rather than quietly accepted',
  replayWithDisable.status === 422 && replayWithDisable.body?.errorCode === 'ABLATION_UNSUPPORTED',
  `status=${replayWithDisable.status} code=${replayWithDisable.body?.errorCode}`);

const unknownSource = await api('research/replays', {sourceCampaignId: 'campaign-00000000-0000-0000-0000-000000000000', sourceRunIndex: 0, mode: 'REPLAY'});
// The product may name this either way - an unknown campaign or an invalid source - and both are typed refusals. The
// first version demanded one specific code, which is the probe assuming an implementation detail rather than the
// property that matters: it must refuse by NAME rather than proceed or throw something shapeless.
record('P5', 'an unknown source campaign is refused by name',
  [404, 422].includes(unknownSource.status) && ['REPLAY_SOURCE_INVALID', 'CAMPAIGN_UNKNOWN'].includes(unknownSource.body?.errorCode),
  `status=${unknownSource.status} code=${unknownSource.body?.errorCode}`);

const badIndex = await api('research/replays', {sourceCampaignId: 'campaign-966cf439-7017-4bb0-88e8-981e59c18322', sourceRunIndex: 99, mode: 'REPLAY'});
record('P5b', 'a source run index that does not exist is refused by name',
  [404, 422].includes(badIndex.status) && badIndex.body?.errorCode === 'REPLAY_SOURCE_INVALID',
  `status=${badIndex.status} code=${badIndex.body?.errorCode}`);

// --- P1: an EMPTY limit set source, which is the branch the author repaired --------------------------------------
const emptyLimitExperiment = `review-empty-limits-${Date.now().toString(36)}`;
const manifest = {
  experimentId: emptyLimitExperiment,
  question: 'Does a campaign whose persisted limits are empty remain comparable after replay?',
  hypothesis: 'The runner persists absent limits as {}, so the comparison must treat {} and null as the same set.',
  topology: 'TWO_HOST_MESH', hosts: workers, workers, controlSurfaces: [surface],
  variables: {independent: ['scenario'], dependent: ['completion'], controls: ['taskType']},
  repetitions: 1, seedPolicy: 'PER_REPETITION', baseSeed: 414121415,
  requiredCapabilities: ['research.evidence.review'],
  // ONLY a repetition bound: no wall clock and no failure bound, which is what makes the persisted limits empty.
  stopConditions: [{kind: 'MAX_REPETITIONS', value: 1}],
  artifactPolicy: {retention: 'SUMMARY_ONLY'},
  acceptance: {primary: 'the repetition is measured, and a replay of it stays comparable', minimumSuccessfulRuns: 1},
  softwareRefs: [`utopia@${'0261a9ed1cec88df3ab4675623d422b37b33f270'}`],
};
const registered = await api('research/experiments', {manifest});
record('P1a', 'the reviewer can register an empty-limit experiment on the live City', [200, 201].includes(registered.status), `status=${registered.status}`);

const started = await api('research/campaigns', {experimentId: emptyLimitExperiment, scenarioId: 'WAIT', repetitions: 1, seed: 'review-empty-limits-seed'});
const sourceCampaignId = started.body?.started?.campaignId;
record('P1b', 'the empty-limit campaign starts', [200, 201].includes(started.status) && Boolean(sourceCampaignId), `status=${started.status}`);

const sourceReceipt = sourceCampaignId ? await waitTerminal(sourceCampaignId) : null;
const sourceRun = sourceReceipt?.runs?.[0] ?? null;
record('P1c', 'the empty-limit source is terminal and MEASURED on a declared worker',
  sourceReceipt?.state === 'COMPLETED' && sourceRun?.state === 'MEASURED' && workers.includes(sourceRun?.result?.assignedNodeId),
  `state=${sourceReceipt?.state} run=${sourceRun?.state} assigned=${sourceRun?.result?.assignedNodeId}`);
record('P1d', 'the persisted source limits really are the empty set (the precondition for the repaired branch)',
  JSON.stringify(sourceReceipt?.limits ?? null) === '{}', `limits=${JSON.stringify(sourceReceipt?.limits ?? null)}`);

const replay1 = await api('research/replays', {sourceCampaignId, sourceRunIndex: 0, mode: 'REPLAY'});
const replay1Id = replay1.body?.started?.campaignId;
record('P1e', 'the empty-limit source is accepted as a replay source', [200, 201].includes(replay1.status) && Boolean(replay1Id), `status=${replay1.status} ${replay1.body?.errorCode ?? ''}`);
const replay1Receipt = replay1Id ? await waitTerminal(replay1Id) : null;
const comparison1 = replay1Id ? await comparisonOf(replay1Id) : {comparison: null};
record('P1f', 'a replay of an empty-limit source compares with NO controlled-input difference (the repaired behaviour)',
  comparison1.comparison?.controlledInputsMatch === true && Array.isArray(comparison1.comparison?.controlledInputDifferences) && comparison1.comparison.controlledInputDifferences.length === 0,
  `match=${comparison1.comparison?.controlledInputsMatch} differences=${JSON.stringify(comparison1.comparison?.controlledInputDifferences)}`);

record('P1g', 'the replay carries fresh identities: new campaign, new experiment, new canonical task',
  Boolean(replay1Id) && replay1Id !== sourceCampaignId
  && replay1Receipt?.context?.experimentId !== emptyLimitExperiment
  && replay1Receipt?.runs?.[0]?.result?.taskRef !== sourceRun?.result?.taskRef,
  `campaign ${replay1Id} vs ${sourceCampaignId}; experiment ${replay1Receipt?.context?.experimentId}; task ${replay1Receipt?.runs?.[0]?.result?.taskRef} vs ${sourceRun?.result?.taskRef}`);

// --- P2: determinism --------------------------------------------------------------------------------------------
const replay2 = await api('research/replays', {sourceCampaignId, sourceRunIndex: 0, mode: 'REPLAY'});
let determinismDetail = `status=${replay2.status} code=${replay2.body?.errorCode ?? ''}`;
if ([200, 201].includes(replay2.status)) {
  const replay2Id = replay2.body.started?.campaignId;
  await waitTerminal(replay2Id);
  const comparison2 = await comparisonOf(replay2Id);
  const fields = ['mode', 'sourceRunRef', 'disabledMechanisms', 'controlledInputsMatch', 'controlledInputDifferences', 'expectedTarget', 'placementChanged', 'determinism', 'nondeterministicConditions'];
  const differing = fields.filter(field => JSON.stringify(comparison1.comparison?.[field]) !== JSON.stringify(comparison2.comparison?.[field]));
  record('P2', 'two replays of one source agree on every descriptive field', differing.length === 0, differing.length ? `differ on ${differing.join(',')}` : `all ${fields.length} fields equal`);
} else {
  // A typed refusal is a legitimate outcome on a live City (for example another campaign unfinished); record which.
  record('P2', 'two replays of one source agree on every descriptive field', false, `second replay refused: ${determinismDetail}`);
}

// --- P3: ablation semantics -------------------------------------------------------------------------------------
const ablation = await api('research/replays', {sourceCampaignId, sourceRunIndex: 0, mode: 'ABLATION', disabledMechanisms: ['alternate-device']});
if ([200, 201].includes(ablation.status)) {
  const ablationId = ablation.body.started?.campaignId;
  const ablationReceipt = await waitTerminal(ablationId);
  const ablationComparison = (await comparisonOf(ablationId)).comparison;
  // The policy, not a fixed outcome: the ablation must land on the FIRST declared worker, and the comparison must report
  // placementChanged exactly when that differs from where the source run actually sat. Asserting "changed must be true"
  // was this probe's own mistake - a source whose run already sat on the first worker changes nothing, correctly.
  const expectedFirst = workers[0];
  const originalPlacement = sourceRun?.result?.assignedNodeId;
  const placementActuallyChanged = originalPlacement !== expectedFirst;
  record('P3', 'alternate-device ablation lands on the first declared worker and reports the change truthfully',
    ablationComparison?.mode === 'ABLATION'
    && JSON.stringify(ablationComparison?.disabledMechanisms) === JSON.stringify(['alternate-device'])
    && ablationComparison?.expectedTarget === expectedFirst
    && ablationComparison?.placementChanged === placementActuallyChanged
    && ablationReceipt?.runs?.[0]?.result?.assignedNodeId === expectedFirst,
    `original=${originalPlacement} expected=${ablationComparison?.expectedTarget} landed=${ablationReceipt?.runs?.[0]?.result?.assignedNodeId} changed=${ablationComparison?.placementChanged} (true iff original != first)`);
} else {
  record('P3', 'alternate-device ablation lands on the first declared worker and reports the change truthfully', false, `refused: status=${ablation.status} code=${ablation.body?.errorCode}`);
}

const failed = results.filter(r => !r.passed);
console.log(`\n${results.length - failed.length}/${results.length} live review probes pass`);
console.log(`city=${city.cityId} workers=${JSON.stringify(workers)} surface=${surface}`);
process.exit(0);
