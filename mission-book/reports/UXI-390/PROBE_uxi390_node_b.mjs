// Second reference node with a DISTINCT identity, so the gateway treats the two as two devices.
// agents/reference-node/agent.mjs defaults id to 'alien-reference-node', so a naive second copy of
// main.mjs would register under the SAME id and the gateway would see one node, not two.
import { startAgent } from '../agents/reference-node/agent.mjs';
const agent = await startAgent({
  url: process.env.CITY_URL || 'http://127.0.0.1:4310',
  token: process.env.CITY_NODE_TOKEN,
  workspace: process.env.CITY_WORKSPACE_B || '.runtime/workspace-b',
  id: 'alien-reference-node-b',
});
console.log('City Node Reference Agent B started');
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => { await agent.stop(); process.exit(0); });
