#!/usr/bin/env node
// Mech verification probe, part 2: the CANONICAL GATEWAY binding of the PCF service.
//
// Part 1 exercised createFabricService directly. This drives the real product path instead: createGateway with the
// default configuration (must stay read-only) and with an explicit approved local context (must execute real CPU work
// and honour the caller-binding and owner-only refusals). Nothing here reuses the candidate's own assertions.
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createGateway} from 'file:///D:/utopia-pcf-verify/services/dev-gateway/server.mjs';

const results = [];
const check = (id, claim, ok, detail = '') => { results.push({id, claim, result: ok ? 'PASS' : 'FAIL', detail}); console.log(`${ok ? 'PASS' : 'FAIL'}  ${id}  ${claim}${detail ? `\n        ${detail}` : ''}`); };
const V = {'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'};
const call = async (base, path, {token = 'owner-test', body, method} = {}) => {
  const response = await fetch(`${base}/api/v0${path}`, {method: method ?? (body ? 'POST' : 'GET'), headers: {...V, ...(token ? {Authorization: `Bearer ${token}`} : {})}, ...(body ? {body: JSON.stringify(body)} : {})});
  return {status: response.status, body: await response.json().catch(() => null)};
};

// ---- 1. The DEFAULT posture: no approval means read-only, and no job is admitted ------------------------------
{
  const dir = await mkdtemp(join(tmpdir(), 'pcf-mech-gw-default-'));
  let gateway;
  try {
    gateway = await createGateway({dir, port: 0, token: 'owner-test', nodeToken: 'node-test', roomsDisabled: true});
    const info = await call(gateway.url, '/pcf');
    check('G1', 'without an approved local context the fabric projection is still readable (200)',
      info.status === 200 && info.body?.fabric?.state === 'NOT_CONFIGURED',
      `status=${info.status} fabricState=${info.body?.fabric?.state}`);
    check('G2', 'and the projection says the local applications are NOT enabled',
      info.body?.fabric?.controls?.enabled === false, `controls=${JSON.stringify(info.body?.fabric?.controls)}`);
    const submit = await call(gateway.url, '/pcf/submit', {body: {appId: 'cpu-sort', idempotencyKey: 'default-1', input: {values: [3, 1, 2]}}});
    check('G3', 'submitting without approval is refused instead of quietly executing',
      submit.status >= 400 && submit.status < 500, `status=${submit.status} body=${JSON.stringify(submit.body).slice(0, 140)}`);
  } finally {
    await gateway?.close();
    await rm(dir, {recursive: true, force: true, maxRetries: 5, retryDelay: 50}).catch(() => {});
  }
}

// ---- 2. Explicitly approved: real execution through the product's own endpoints -------------------------------
{
  const dir = await mkdtemp(join(tmpdir(), 'pcf-mech-gw-on-'));
  let gateway;
  try {
    gateway = await createGateway({dir, port: 0, token: 'owner-test', nodeToken: 'node-test', hostDeviceId: 'local-mech', roomsDisabled: true, pcf: {enabled: true, approvedLocalContext: {deviceId: 'local-mech'}}});
    const info = await call(gateway.url, '/pcf');
    check('G4', 'with an explicit approval the projection reports the local applications enabled and pending verification',
      info.status === 200 && info.body?.fabric?.controls?.enabled === true && info.body?.fabric?.controls?.reason === 'OPPOSITE_HOST_ACCEPTANCE_PENDING',
      `controls=${JSON.stringify(info.body?.fabric?.controls)} state=${info.body?.fabric?.state}`);
    check('G4b', 'the projection states that agent consumption has not been observed',
      info.body?.fabric?.agentConsumed === 'NOT_OBSERVED', `agentConsumed=${info.body?.fabric?.agentConsumed}`);
    const parentSessionId = info.body?.parentSessionId;
    check('G5', 'the City tells the caller which parent session its jobs will be bound to',
      typeof parentSessionId === 'string' && parentSessionId.length > 0, `parentSessionId=${JSON.stringify(parentSessionId)}`);

    const submit = await call(gateway.url, '/pcf/submit', {body: {appId: 'cpu-sort', idempotencyKey: 'gw-1', input: {values: [5, 3, 9, 1]}}});
    check('G6', 'the owner session admits a real CPU job through the gateway endpoint',
      submit.status === 200 && /^T-/.test(submit.body?.taskId ?? ''), `status=${submit.status} body=${JSON.stringify(submit.body).slice(0, 180)}`);

    let state = null;
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const read = await call(gateway.url, `/pcf/tasks/${submit.body.taskId}`);
      state = read.body?.task?.state ?? null;
      if (state === 'COMPLETED' || state === 'FAILED') break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    check('G7', 'the canonical Task reaches COMPLETED through the product surface', state === 'COMPLETED', `state=${state}`);

    const collected = await call(gateway.url, `/pcf/tasks/${submit.body.taskId}/collect`, {body: {}});
    const values = collected.body?.values ?? collected.body?.output?.values;
    const digest = collected.body?.digest;
    check('G8', 'collecting the result returns the real sorted output with a digest, delivered not consumed',
      JSON.stringify(values) === JSON.stringify([1, 3, 5, 9]) && Boolean(digest) && collected.body?.consumed === false,
      `values=${JSON.stringify(values)} digest=${String(digest).slice(0, 16)} consumed=${collected.body?.consumed} status=${collected.status}`);

    const ack = await call(gateway.url, `/pcf/tasks/${submit.body.taskId}/acknowledge`, {body: {digest}});
    check('G9', 'acknowledging the exact digest is accepted and only then is the result consumed',
      ack.status === 200 && ack.body?.consumed === true, `status=${ack.status} body=${JSON.stringify(ack.body).slice(0, 140)}`);

    // Caller binding: a body may not claim someone else's parent session or another device.
    const forged = await call(gateway.url, '/pcf/submit', {body: {appId: 'cpu-sort', idempotencyKey: 'gw-forged', input: {values: [1]}, parentSessionId: 'someone-else'}});
    check('G10', 'a submission that claims another parent session is refused with a caller-binding refusal',
      forged.status === 403 && String(forged.body?.errorCode ?? forged.body?.error ?? '').includes('CALLER_BINDING'),
      `status=${forged.status} body=${JSON.stringify(forged.body).slice(0, 140)}`);
    const forgedDevice = await call(gateway.url, '/pcf/submit', {body: {appId: 'cpu-sort', idempotencyKey: 'gw-forged-2', input: {values: [1]}, deviceId: 'other-device'}});
    check('G11', 'a submission that tries to name another device is refused too',
      forgedDevice.status === 403, `status=${forgedDevice.status} body=${JSON.stringify(forgedDevice.body).slice(0, 140)}`);
    const forgedAckBody = await call(gateway.url, `/pcf/tasks/${submit.body.taskId}/acknowledge`, {body: {digest, taskId: 'T-other'}});
    check('G11b', 'an acknowledge body carrying unexpected keys is refused rather than partially honoured',
      forgedAckBody.status === 403, `status=${forgedAckBody.status} body=${JSON.stringify(forgedAckBody.body).slice(0, 140)}`);
  } finally {
    await gateway?.close();
    await rm(dir, {recursive: true, force: true, maxRetries: 5, retryDelay: 50}).catch(() => {});
  }
}

// ---- 3. A node credential is not an owner session --------------------------------------------------------------
{
  const dir = await mkdtemp(join(tmpdir(), 'pcf-mech-gw-node-'));
  let gateway;
  try {
    gateway = await createGateway({dir, port: 0, token: 'owner-test', nodeToken: 'node-test', hostDeviceId: 'local-mech', roomsDisabled: true, pcf: {enabled: true, approvedLocalContext: {deviceId: 'local-mech'}}});
    const asNode = await call(gateway.url, '/pcf/submit', {token: 'node-test', body: {appId: 'cpu-sort', idempotencyKey: 'node-1', input: {values: [1]}}});
    check('G12', 'a node credential cannot use the owner-only PCF submit surface',
      asNode.status >= 400, `status=${asNode.status} body=${JSON.stringify(asNode.body).slice(0, 120)}`);
    const noAuth = await call(gateway.url, '/pcf/submit', {token: null, body: {appId: 'cpu-sort', idempotencyKey: 'anon-1', input: {values: [1]}}});
    check('G13', 'an unauthenticated caller cannot use it either', noAuth.status === 401 || noAuth.status === 403, `status=${noAuth.status}`);
  } finally {
    await gateway?.close();
    await rm(dir, {recursive: true, force: true, maxRetries: 5, retryDelay: 50}).catch(() => {});
  }
}

const failed = results.filter(row => row.result === 'FAIL').length;
console.log(`\n${results.length - failed}/${results.length} gateway binding checks pass${failed ? ` - ${failed} FAILED` : ''}`);
console.log('Frozen candidate SHA under test: 998440c7772cc032d012b457c2a59cd1059826c0');
process.exit(failed ? 1 : 0);
