// Store-shape sweep v3 - v2 plus the FIFTH family instance (the REX-804 fault controller's store).
//
// WHY A SEPARATE FILE RATHER THAN AN EDIT: v2's published table is the evidence for the earlier paired
// measurement, and rewriting it would silently change what that table means. v3 adds one store and one rule.
//
// WHAT IS NEW
//   1. `research/faults` is swept. The fault controller is a fifth instance of the same family: its constructor
//      called mkdirSync unguarded until REX-804's review found it (finding B4), which is why the accepted REX-804
//      head could not merge into main at the time.
//   2. A trap that a head does not construct must not read as "started safely". v2 could only print STARTED;
//      v3 probes the fault surface afterwards and reports NOT EXERCISED when the route is absent, DEGRADED with
//      its typed reason when the store guard works, and STARTED-SILENT when the store trap engaged but the
//      surface says nothing about it.
//
// HOW TO RUN (it imports Utopia modules, so it must run from a Utopia checkout):
//   git worktree add <dir> <the-commit-to-measure>
//   cd <dir> && npm ci
//   copy this file to <dir>/.shape-sweep-v3.mjs
//   node .shape-sweep-v3.mjs
import {mkdtemp, rm, writeFile, mkdir} from 'node:fs/promises';
import {statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createGateway} from './services/dev-gateway/server.mjs';
import {createJoinRequests} from './services/dev-gateway/join.mjs';
import {createExecutionProfileController} from './services/dev-gateway/execution-profile.mjs';

const headers = {Authorization: 'Bearer owner', 'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'};
const line = (label, value) => console.log(String(label).padEnd(44), value);
const healthy = ['research/experiments', 'research/campaigns', 'monitor', 'research-trace', 'theme-packages'];
// A reachable Room Hub, so a `degraded` word can never be confused with a disabled one.
const roomFetch = async url => ({ok: true, status: 200, text: async () => JSON.stringify(url.endsWith('/health') ? {product: 'utopia-room-pack', version: 'v1'} : {rooms: [{id: 'fixture'}], loaded: ['fixture']})});

/** SHAPE A: plant a file where the module wants a directory, then try to construct a City. */
async function shapeA(label, relative, verify) {
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
    line(label, verify ? await verify(app) : 'STARTED   (startup-reachable, trap engaged)');
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
await shapeA('research/faults (REX-804 fault controller)', join('research', 'faults'), async app => {
  // The City started with a file where the fault store belongs. Did the trap actually reach the module, and does
  // the surface disclose the degradation rather than serving as if the store were healthy?
  const response = await fetch(app.url + '/api/v0/research/faults', {headers});
  const body = await response.json().catch(() => null);
  if (response.status === 404) return 'NOT EXERCISED  (this head serves no fault surface, so nothing read the trap)';
  const state = body?.storeState ?? body?.faults?.storeState ?? null;
  const reason = body?.storeReason ?? body?.faults?.storeReason ?? null;
  if (state === 'UNAVAILABLE') return `STARTED-DEGRADED  storeState=${state} reason=${reason} (the guard reports the trap)`;
  return `STARTED-SILENT  HTTP ${response.status} storeState=${state ?? 'not reported'} (the trap engaged and the surface does not say so)`;
});
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
