// Does the ACCEPTED REX-804 head's fault guard also refuse to START a fault when its store is unusable?
//
// Why: two implementations of the same guard exist. The accepted head fe700ab guards the constructor AND refuses
// `start` with a typed FAULT_STORE_UNAVAILABLE 503; an earlier adoptable-merge repair (adc075e) guards the
// constructor only and reports state through accessors. The sweep proves the constructor half; this measures the
// start half, so "the accepted head is at least as safe as the repair that was offered for merging" is evidenced
// rather than assumed.
//
// RUN: copy into <checkout>/.fault-store-start-check.mjs && node .fault-store-start-check.mjs
import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createGateway} from './services/dev-gateway/server.mjs';

const OWNER = 'start-check-owner', NODE = 'start-check-node';
const headers = c => ({Authorization: 'Bearer ' + c, 'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'});
const dir = await mkdtemp(join(tmpdir(), 'fault-start-'));
// Plant the trap: a FILE where the fault store wants a directory.
await writeFile(join(dir, 'research-faults-trap'), 'x').catch(() => {});
const {mkdir} = await import('node:fs/promises');
await mkdir(join(dir, 'research'), {recursive: true});
await writeFile(join(dir, 'research', 'faults'), 'a file where a directory belongs');

const app = await createGateway({dir, port: 0, token: OWNER, nodeToken: NODE, roomsDisabled: true, heartbeatTimeout: 20000});
const ask = async (path, {body, credential = OWNER} = {}) => {
  const response = await fetch(`${app.url}/api/v0/${path}`, {method: body ? 'POST' : 'GET', headers: headers(credential), body: body ? JSON.stringify(body) : undefined});
  const text = await response.text(); let json = null; try { json = JSON.parse(text); } catch {}
  return {status: response.status, body: json, text};
};
try {
  const city = await ask('city');
  console.log('city started           : HTTP ' + city.status);
  await ask('node/register', {credential: NODE, body: {id: 'target', displayName: 'target', capabilities: ['task.execute.safe'], roles: ['EXECUTION_NODE'], metadata: {platform: 'reference'}}});
  await ask('node/heartbeat', {credential: NODE, body: {id: 'target'}});

  const listed = await ask('research/faults');
  console.log('fault list             : HTTP ' + listed.status + ' storeState=' + (listed.body?.storeState ?? listed.body?.faults?.storeState ?? 'not reported')
    + ' reason=' + (listed.body?.storeReason ?? listed.body?.faults?.storeReason ?? 'not reported'));

  const started = await ask('research/faults', {body: {kind: 'PROVIDER_UNAVAILABLE', nodeId: 'target', durationMs: 3000, confirmation: 'FAULT:PROVIDER_UNAVAILABLE:target'}});
  const code = started.body?.errorCode ?? started.body?.error?.code ?? started.body?.error ?? null;
  console.log('fault start attempt    : HTTP ' + started.status + ' code=' + code);
  const refusedTyped = started.status === 503 && String(code).includes('FAULT_STORE_UNAVAILABLE');
  console.log('');
  console.log(refusedTyped
    ? 'PASS  an unusable store refuses to START a fault, with the typed reason (a fault that cannot be recorded is not injected)'
    : `FAIL  the start path answered HTTP ${started.status} (${code}) instead of a typed FAULT_STORE_UNAVAILABLE refusal`);
  // process.exit() here reproduced the very defect the REX-806 CLI was repaired for: with fetch handles still
  // closing it asserts in libuv on Windows and the exit code becomes 0xC0000409. Setting the code instead lets
  // the process drain. My own probe had to be repaired with the same pattern.
  process.exitCode = refusedTyped ? 0 : 1;
} finally {
  await app.close();
  await new Promise(r => setTimeout(r, 250));
  await rm(dir, {recursive: true, force: true, maxRetries: 10, retryDelay: 50});
}
