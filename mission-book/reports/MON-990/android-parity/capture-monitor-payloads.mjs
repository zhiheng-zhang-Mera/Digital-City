// Capture the reviewed head's OWN canonical monitor payloads, so the Android projection can be fed what this server
// actually produces rather than a fixture. This is the closest thing to observed cross-surface parity that is available
// on a host with no handset attached: the Web half was verified by the review's browser probes, and this supplies the
// Android half with the same head's real payloads.
//
// It writes raw envelopes (no rewriting), because the point is to test the Android parser against the server's bytes.
import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createGateway} from './services/dev-gateway/server.mjs';

const OUT = process.env.CAPTURE_DIR ?? 'D:/utopia-mon990-android/apps/android/app/src/test/resources';
const H = {'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0'};
const dir = await mkdtemp(resolve('.scratch-mon990-capture-'));
const app = await createGateway({dir, port: 0, token: 'review-owner', nodeToken: 'review-node', roomsDisabled: true});
const owner = {Authorization: 'Bearer review-owner'};
try {
  // Give the City something worth projecting: a worker, more tasks than the collapse threshold so clusters exist, one
  // cancelled task so a risk-carrying node must stay visible, and a decision receipt so the advisory-truth invariant is
  // exercised by real bytes rather than by a fixture.
  await fetch(`${app.url}/api/v0/node/register`, {method: 'POST', headers: {...H, Authorization: 'Bearer review-node'}, body: JSON.stringify({id: 'capture-worker', displayName: 'Capture Worker', metadata: {platform: 'reference'}, capabilities: ['task.execute.safe', 'filesystem.temp']})});
  const ids = [];
  for (let index = 0; index < 30; index += 1) {
    // The HTTP route accepts a type and nothing else: parameters are refused by validateCommand, which is itself part of
    // the contract this head publishes. Tasks therefore arrive QUEUED and unassigned, which is enough to make the graph
    // collapse at collapse=24 and to give the receipt path something real to reference.
    const created = await fetch(`${app.url}/api/v0/tasks`, {method: 'POST', headers: {...H, ...owner}, body: JSON.stringify({type: 'WAIT'})});
    const task = await created.json();
    if (task?.id) ids.push(task.id);
  }
  if (ids.length < 30) throw new Error(`only ${ids.length} of 30 tasks were created`);
  const terminalTask = ids[24];
  const cancelled = await fetch(`${app.url}/api/v0/tasks/${terminalTask}/cancel`, {method: 'POST', headers: {...H, ...owner}, body: '{}'});
  const receipt = await fetch(`${app.url}/api/v0/monitor/decisions`, {method: 'POST', headers: {...H, ...owner}, body: JSON.stringify({kind: 'OWNER_DECISION_CANDIDATE', taskRef: ids[3], reason: 'parity capture'})});
  const receiptBody = await receipt.json();
  console.log(`  setup      tasks=${ids.length} cancelStatus=${cancelled.status} receiptStatus=${receipt.status} receipt=${JSON.stringify(receiptBody?.window?.decisions?.[0] ?? receiptBody?.error ?? null).slice(0, 160)}`);

  const graphResponse = await fetch(`${app.url}/api/v0/monitor/graph?collapse=24`, {headers: {...H, ...owner}});
  const graphText = await graphResponse.text();
  const decisionsResponse = await fetch(`${app.url}/api/v0/monitor/decisions?limit=50`, {headers: {...H, ...owner}});
  const decisionsText = await decisionsResponse.text();
  if (graphResponse.status !== 200) throw new Error(`monitor/graph answered ${graphResponse.status}: ${graphText.slice(0, 200)}`);
  if (decisionsResponse.status !== 200) throw new Error(`monitor/decisions answered ${decisionsResponse.status}: ${decisionsText.slice(0, 200)}`);

  await writeFile(resolve(OUT, 'reviewed-head-monitor-graph.json'), graphText);
  await writeFile(resolve(OUT, 'reviewed-head-monitor-decisions.json'), decisionsText);
  const graph = JSON.parse(graphText);
  const decisions = JSON.parse(decisionsText);
  console.log(`captured from the reviewed head's own server:`);
  console.log(`  graph      cityId=${graph.graph?.projectionOf?.cityId} health=${graph.graph?.projectionOf?.health} nodes=${graph.graph?.nodes?.length} visible=${graph.graph?.visibleNodeIds?.length} clusters=${graph.graph?.clusters?.length} authoritative=${graph.graph?.authoritative}`);
  console.log(`  decisions  cityId=${decisions.cityId} decisions=${decisions.window?.decisions?.length}`);
  console.log(`  written to ${OUT}`);
} finally {
  await app.close();
  await rm(dir, {recursive: true, force: true});
}
