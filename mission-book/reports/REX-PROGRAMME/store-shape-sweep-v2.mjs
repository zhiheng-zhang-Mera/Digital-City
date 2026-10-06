// Store-shape sweep v2 - the harness behind the paired measurement in DEFECT_RESEARCH_STORE_HARDENING.md.
//
// HOW TO RUN IT (it imports Utopia modules, so it must run from a Utopia checkout):
//   git worktree add <dir> <the-commit-to-measure>
//   cd <dir> && npm ci
//   copy this file to <dir>/.shape-sweep-v2.mjs
//   node .shape-sweep-v2.mjs
// Expected: 9 traps reported, exit code 0, and `createGateway` throwing only where the City genuinely cannot start.
//
// v1 DEFECTS, kept in the record because a sweep nobody can reproduce is not evidence:
//   1. `join-requests.json` and `execution-profile.json` were listed with `relative = null`, i.e. NO TRAP WAS PLANTED.
//      Their two rows exercised a healthy runtime and reported a route status, so the table read as if two more stores
//      had been tested when only six had. They are FILE stores anyway: "a file where a directory belongs" is the wrong
//      shape for them. Their shape is the INVERSE one, and it had not been swept at all.
//   2. The join row's `HTTP 400` was the v1 probe's own bug - it sent `claimSecret`, the field is `claim` - so the
//      request never reached the store. An unexplained status in a published table is an unclassified failure.
//
// So this harness runs both shapes and never reports a status without saying what the status MEANS:
//   SHAPE A  a FILE where the module needs a DIRECTORY   (startup-reachable -> can brick the City)
//   SHAPE B  a DIRECTORY where the module needs a FILE   (usually lazy -> can be a silent loss instead)
// Every entry states whether the trap actually engaged. "NOT EXERCISED" is a result, not a pass.
import {mkdtemp, rm, writeFile, mkdir} from 'node:fs/promises';
import {statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createGateway} from './services/dev-gateway/server.mjs';
import {createJoinRequests} from './services/dev-gateway/join.mjs';
import {createExecutionProfileController} from './services/dev-gateway/execution-profile.mjs';

const headers = {Authorization: 'Bearer owner', 'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'};
const line = (label, value) => console.log(String(label).padEnd(38), value);
const healthy = ['research/experiments', 'research/campaigns', 'monitor', 'research-trace', 'theme-packages'];
// A reachable Room Hub, so a `degraded` word can never be confused with a disabled one.
const roomFetch = async url => ({ok: true, status: 200, text: async () => JSON.stringify(url.endsWith('/health') ? {product: 'utopia-room-pack', version: 'v1'} : {rooms: [{id: 'fixture'}], loaded: ['fixture']})});

/** SHAPE A: plant a file where the module wants a directory, then try to construct a City. */
async function shapeA(label, relative) {
  const dir = await mkdtemp(join(tmpdir(), 'shapeA-'));
  let app = null;
  try {
    for (const pre of healthy) await mkdir(join(dir, pre), {recursive: true}).catch(() => {});
    await rm(join(dir, relative), {recursive: true, force: true}).catch(() => {});
    await writeFile(join(dir, relative), 'a file where a directory belongs');
    try {
      app = await createGateway({dir, port: 0, token: 'owner', nodeToken: 'node', roomFetch});
    } catch (error) {
      line(label, `BRICKED   ${String(error.message).slice(0, 60)}`);
      return;
    }
    line(label, 'STARTED   (startup-reachable, trap engaged)');
  } finally {
    await app?.close().catch(() => {});
    await rm(dir, {recursive: true, force: true, maxRetries: 10, retryDelay: 50}).catch(() => {});
  }
}

/** SHAPE B: plant a directory where the module wants a file, then find out what the City does about it. */
async function shapeB(label, relative, exercise) {
  const dir = await mkdtemp(join(tmpdir(), 'shapeB-'));
  let app = null;
  try {
    for (const pre of healthy) await mkdir(join(dir, pre), {recursive: true}).catch(() => {});
    await rm(join(dir, relative), {recursive: true, force: true}).catch(() => {});
    await mkdir(join(dir, relative), {recursive: true});
    try {
      app = await createGateway({dir, port: 0, token: 'owner', nodeToken: 'node', roomFetch});
    } catch (error) {
      line(label, `BRICKED   ${String(error.message).slice(0, 60)}`);
      return;
    }
    line(label, await exercise(app, join(dir, relative)));
  } finally {
    await app?.close().catch(() => {});
    await rm(dir, {recursive: true, force: true, maxRetries: 10, retryDelay: 50}).catch(() => {});
  }
}

console.log('--- SHAPE A: a FILE where the module needs a DIRECTORY ---');
await shapeA('theme-packages (bridge artifacts)', 'theme-packages');
await shapeA('research (REX-801 registry parent)', 'research');
await shapeA('research/experiments (REX-801 registry)', join('research', 'experiments'));
await shapeA('research/campaigns (REX-803 campaigns)', join('research', 'campaigns'));
await shapeA('monitor (MON-903 decision store)', 'monitor');
await shapeA('research-trace (REX-802 collector)', 'research-trace');

console.log('\n--- SHAPE B: a DIRECTORY where the module needs a FILE ---');
await shapeB('city.sqlite (canonical store)', 'city.sqlite', async () => 'STARTED   (the canonical store was not the trapper)');
await shapeB('join-requests.json (join store)', 'join-requests.json', async app => {
  // A VALID body, so a refusal cannot be mistaken for the trap engaging. v1 sent `claimSecret` and read the resulting
  // 400 as a measurement of the store.
  const response = await fetch(app.url + '/api/v0/join/request', {method: 'POST', headers, body: JSON.stringify({displayName: 'sweep', platform: 'windows', claim: 'c'.repeat(32)})});
  const body = await response.json().catch(() => null);
  const listed = await(await fetch(app.url + '/api/v0/join/requests', {headers})).json();
  const inMemory = Array.isArray(listed?.requests) ? listed.requests.length : 'unknown';
  return `STARTED   join -> HTTP ${response.status}${body?.errorCode ? ' ' + body.errorCode : ''}; approver rows in memory=${inMemory}`;
});
await shapeB('execution-profile.json (WBC-604)', 'execution-profile.json', async () => 'STARTED   (no write is attempted by a bare City, see the unit probe below)');

console.log('\n--- UNIT PROBES: the traps a bare City cannot reach ---');
{
  const dir = await mkdtemp(join(tmpdir(), 'unit-join-'));
  try {
    const target = join(dir, 'join-requests.json');
    await mkdir(target, {recursive: true});
    const store = createJoinRequests({file: target, credential: 'owner-credential-value', clock: () => Date.now()});
    let outcome;
    try {
      const record = store.request({displayName: 'sweep', platform: 'windows', claim: 'c'.repeat(32)});
      outcome = `request() RESOLVED (state=${record?.state ?? record?.request?.state ?? 'unstated'})`;
    } catch (error) { outcome = `request() THREW ${error.code ?? error.message}`; }
    line('join store, unwritable file', `${outcome}; trap directory ${statSync(target).isDirectory() ? 'untouched, so NOTHING was persisted' : 'gone'}`);
  } finally { await rm(dir, {recursive: true, force: true, maxRetries: 10, retryDelay: 50}).catch(() => {}); }
}
{
  const dir = await mkdtemp(join(tmpdir(), 'unit-profile-'));
  try {
    const target = join(dir, 'execution-profile.json');
    await mkdir(target, {recursive: true});
    // WORKER_POOL is not the default, so the controller really attempts a write; readinessOf says READY so the change is
    // allowed to proceed and the ONLY thing that can fail is the store.
    const controller = createExecutionProfileController({dir, readinessOf: () => 'READY'});
    const before = controller.profile();
    let outcome;
    try {
      const receipt = controller.change('WORKER_POOL');
      outcome = `change() RESOLVED changed=${receipt.changed}`;
    } catch (error) { outcome = `change() THREW ${error.code ?? error.name}`; }
    const after = controller.profile();
    line('profile store, unwritable file', `${outcome}; live profile ${before} -> ${after}; trap directory ${statSync(target).isDirectory() ? 'untouched, so NOTHING was persisted' : 'gone'}`);
  } finally { await rm(dir, {recursive: true, force: true, maxRetries: 10, retryDelay: 50}).catch(() => {}); }
}
