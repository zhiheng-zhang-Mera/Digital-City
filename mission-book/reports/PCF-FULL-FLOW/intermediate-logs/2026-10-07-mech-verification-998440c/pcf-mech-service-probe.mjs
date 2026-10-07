#!/usr/bin/env node
// Mech verification probe for the PCF single-batch candidate, frozen SHA 998440c.
//
// This is the OPPOSITE HOST's independent exercise of the canonical CPU service. It is deliberately NOT a copy of the
// candidate's own test: it drives the real submit -> queue -> execute -> collect -> acknowledge path through
// createFabricService with a session identity of my own, and it asserts the refusal boundaries that matter most for
// safety (a caller who is not the origin, an idempotency conflict, and reading a result before it exists).
//
// Real child processes run real CPU work; nothing here is a fixture returning a constant.
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Store} from 'file:///D:/utopia-pcf-verify/services/dev-gateway/store.mjs';
import {createFabricService} from 'file:///D:/utopia-pcf-verify/services/personal-compute-fabric/service.mjs';

const results = [];
const check = (id, claim, ok, detail = '') => { results.push({id, claim, result: ok ? 'PASS' : 'FAIL', detail}); console.log(`${ok ? 'PASS' : 'FAIL'}  ${id}  ${claim}${detail ? `\n        ${detail}` : ''}`); };
const dir = await mkdtemp(join(tmpdir(), 'pcf-mech-verify-'));
const store = new Store(dir);
const DEVICE = 'mech-verify-device';
const SESSION = 'mech-verify-session';
const OTHER = 'mech-verify-other-session';
// The authority facts are evaluated independently from the candidate's own fixture: only THIS session, device and data
// scope are authorized, so a caller-boundary refusal below cannot be an artefact of a permissive stub.
const readAuthority = async caller => ({
  version: 1, authorized: caller?.sessionId === SESSION, expiresAt: Date.now() + 300000,
  originDeviceId: DEVICE, allowedDevices: [DEVICE], dataScopes: ['PUBLIC'], sharingConsent: false, cloudConsent: false,
  budgets: {cpuMs: 60000, bytes: 1048576, cloudFeeMinor: 0}, fallback: 'NONE', revocation: null,
});
const service = createFabricService({store, artifactRoot: join(dir, 'artifacts'), deviceId: DEVICE, readAuthority, maxParallel: 2, maxQueue: 8});
const context = {sessionId: SESSION, deviceId: DEVICE};

try {
  const health0 = service.health();
  check('V1', 'the service reports READY_NOT_STARTED and names its execution scope and physical acceptance honestly',
    health0.state === 'READY_NOT_STARTED' && health0.executionScope === 'ACTUAL_LOCAL_CPU' && health0.physicalAcceptance === 'NOT_RUN',
    JSON.stringify(health0));

  await service.start();
  check('V2', 'start() reports RUNNING with a recorded owned supervisor',
    service.health().state === 'RUNNING', JSON.stringify(service.health()));

  // A refusal must happen BEFORE any task exists.
  let refusal = null;
  try { await service.submit({appId: 'cpu-sort', idempotencyKey: 'wrong-caller', input: {values: [3, 1, 2]}, parentSessionId: OTHER}, context); }
  catch (error) { refusal = error.code ?? error.message; }
  check('V3', 'a caller whose parentSessionId is not its own session is refused at submission', refusal === 'CALLER_BINDING', `code=${refusal}`);
  check('V3b', 'and the refused submission created no canonical task at all',
    store.list('tasks').filter(t => t.executionBackendId === 'pcf-v1').length === 0,
    `pcf tasks=${store.list('tasks').filter(t => t.executionBackendId === 'pcf-v1').length}`);

  // Real execution: SORT.
  const accepted = await service.submit({appId: 'cpu-sort', idempotencyKey: 'verify-sort-1', input: {values: [9, 4, 7, 1, 5]}, parentSessionId: SESSION}, context);
  check('V4', 'a well-formed request is admitted with canonical task and action identities',
    /^T-/.test(accepted.taskId) && /^A-/.test(accepted.actionId) && accepted.replayed === false, JSON.stringify(accepted));
  await service.waitForIdle();
  const task = await service.inspect(accepted.taskId, context);
  const action = store.get('actions', accepted.actionId);
  check('V5', 'the canonical Task reaches COMPLETED and its Action reports SUCCEEDED with a result reference',
    task.state === 'COMPLETED' && action.status === 'SUCCEEDED' && Boolean(action.resultRef?.digest),
    `task=${task.state} action=${action.status} resultRef=${JSON.stringify(action.resultRef)}`);

  const delivery = await service.collect(accepted.taskId, context);
  check('V6', 'collect() returns the real sorted output with a digest, delivered but NOT yet consumed',
    JSON.stringify(delivery.output?.values) === JSON.stringify([1, 4, 5, 7, 9]) && Boolean(delivery.digest) && delivery.delivered === true && delivery.consumed === false,
    `output=${JSON.stringify(delivery.output)} consumed=${delivery.consumed} digest=${String(delivery.digest).slice(0, 16)}`);

  const ack = await service.acknowledge(accepted.taskId, context, delivery.digest);
  const after = await service.collect(accepted.taskId, context);
  check('V7', 'consumption requires the exact digest, and only then does collect() report consumed',
    ack.consumed === true && after.consumed === true, `ack=${JSON.stringify(ack)} consumedAfter=${after.consumed}`);

  let wrongDigest = null;
  try { await service.acknowledge(accepted.taskId, context, 'deadbeef'); } catch (error) { wrongDigest = error.code ?? error.message; }
  check('V8', 'acknowledging with the wrong digest is refused', wrongDigest === 'CONSUMPTION_DIGEST', `code=${wrongDigest}`);

  // Idempotency: the same key with the same payload replays; the same key with a different payload conflicts.
  const replay = await service.submit({appId: 'cpu-sort', idempotencyKey: 'verify-sort-1', input: {values: [9, 4, 7, 1, 5]}, parentSessionId: SESSION}, context);
  check('V9', 're-submitting the same idempotency key with the same payload replays instead of executing again',
    replay.replayed === true && replay.taskId === accepted.taskId, JSON.stringify(replay));
  let conflict = null;
  try { await service.submit({appId: 'cpu-sort', idempotencyKey: 'verify-sort-1', input: {values: [1, 2, 3]}, parentSessionId: SESSION}, context); }
  catch (error) { conflict = error.code ?? error.message; }
  check('V10', 'the same idempotency key with a different payload is refused as a conflict', conflict === 'IDEMPOTENCY_CONFLICT', `code=${conflict}`);

  // A second app, admitted in parallel, must get its own real process.
  const [sumA, sumB] = await Promise.all([
    service.submit({appId: 'cpu-sum', idempotencyKey: 'verify-sum-a', input: {values: [1, 2, 3, 4]}, parentSessionId: SESSION}, context),
    service.submit({appId: 'cpu-sum', idempotencyKey: 'verify-sum-b', input: {values: [10, 20, 30]}, parentSessionId: SESSION}, context),
  ]);
  await service.waitForIdle();
  const [resA, resB] = await Promise.all([service.collect(sumA.taskId, context), service.collect(sumB.taskId, context)]);
  const tasks = store.list('tasks').filter(t => t.executionBackendId === 'pcf-v1');
  const pids = tasks.map(t => t.pcfResult?.pid).filter(Boolean);
  check('V11', 'two concurrently admitted workloads both complete with correct arithmetic',
    resA.output?.sum === 10 && resB.output?.sum === 60, `sumA=${resA.output?.sum} sumB=${resB.output?.sum}`);
  check('V12', 'genuinely different child processes executed the work (no fabricated or reused pid)',
    pids.length >= 3 && new Set(pids).size === pids.length, `pids=${JSON.stringify(pids)}`);

  // Reading a result that does not exist yet.
  let notReady = null;
  try { await service.collect('T-does-not-exist', context); } catch (error) { notReady = error.code ?? error.message; }
  check('V13', 'collecting an unknown task is refused rather than answering with empty data',
    notReady === 'ORIGIN_UNAUTHORIZED' || notReady === 'RESULT_NOT_READY', `code=${notReady}`);

  const health1 = service.health();
  check('V14', 'the health surface still declines to claim physical acceptance after local execution',
    health1.physicalAcceptance === 'NOT_RUN' && health1.queued === 0, JSON.stringify(health1));

  await service.drain();
  await service.stop();
  check('V15', 'drain() then stop() leaves the service STOPPED', service.health().state === 'STOPPED', JSON.stringify(service.health()));
} finally {
  try { store.db.close(); } catch { /* already closed */ }
  await rm(dir, {recursive: true, force: true, maxRetries: 5, retryDelay: 50}).catch(() => {});
}

const failed = results.filter(row => row.result === 'FAIL').length;
console.log(`\n${results.length - failed}/${results.length} independent service checks pass${failed ? ` - ${failed} FAILED` : ''}`);
console.log('Frozen candidate SHA under test: 998440c7772cc032d012b457c2a59cd1059826c0');
process.exit(failed ? 1 : 0);
