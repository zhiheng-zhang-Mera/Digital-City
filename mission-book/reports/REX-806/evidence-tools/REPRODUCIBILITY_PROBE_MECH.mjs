// REX-806 reproducibility probe (Mech-DS). Run from anywhere:
//
//   node reports/REX-806/evidence-tools/REPRODUCIBILITY_PROBE_MECH.mjs
//
// Environment:
//   REX806_REPO  checkout of the implementation repo whose exporter is under test
//                (default D:/utopia-rex806, which must be at the reviewed head)
//   REX806_CITY  City endpoint (default http://172.31.12.151:4391)
//   REX806_CONFIG host reservation holding the owner token (default C:/ProgramData/Utopia/host/city/local-config.json)
//   REX806_PUBLISHED package under test (default ../artifact). Used by the negative control, which perturbs
//                one byte of a scratch copy and expects the probe to fail - a probe that cannot fail proves nothing.
//
// What it decides: is the published artifact a byte-exact function of the City it came from?
//
// The exporter is a pure function of its inputs; exactly two of them are not frozen inside the package:
//   (a) manifest.generatedAt, which the CLI reads from the wall clock, and
//   (b) rawPointers.events, which is the City's WHOLE live event stream (GET /api/v0/city), not the
//       campaign-scoped trace records. A City that keeps running therefore yields a superset later.
// This probe pins both - generatedAt to the published value, and the event stream truncated at that
// instant - re-exports, and compares every emitted byte, checksums.json included.
//
// Reading: 11/11 identical means the package is exactly the City's state at the published instant and
// the pipeline is deterministic; a difference in raw-pointers.json alone means the City moved on.
// The probe never prints the owner credential.
import {readFileSync, readdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PUBLISHED = (process.env.REX806_PUBLISHED ?? join(HERE, '..', 'artifact')).replace(/\\/g, '/');
const REPO = (process.env.REX806_REPO ?? 'D:/utopia-rex806').replace(/\\/g, '/');
const CITY = process.env.REX806_CITY ?? 'http://172.31.12.151:4391';
const CONFIG = process.env.REX806_CONFIG ?? 'C:/ProgramData/Utopia/host/city/local-config.json';

const {buildArtifact, artifactFiles, checksumsFor} = await import(`file:///${REPO}/services/dev-gateway/research/artifact.mjs`);

const token = JSON.parse(readFileSync(CONFIG, 'utf8')).token;
const headers = {'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0', Authorization: `Bearer ${token}`};
const get = async path => {
  const response = await fetch(`${CITY}/api/v0/${path}`, {headers});
  if (!response.ok) throw new Error(`GET ${path} answered ${response.status}`);
  return response.json();
};

const publishedManifest = JSON.parse(readFileSync(join(PUBLISHED, 'manifest.json'), 'utf8'));
const publishCutoff = publishedManifest.generatedAt;

const city = await get('city');
const list = await get('research/campaigns');
const receipts = [];
for (const entry of list.receipts ?? []) {
  const detail = await get(`research/campaigns/${encodeURIComponent(entry.campaignId)}`);
  if (detail.campaign) receipts.push(detail.campaign);
}
const experiments = [];
for (const entry of list.experiments ?? []) {
  const id = entry.experimentId ?? entry;
  try { const detail = await get(`research/experiments/${encodeURIComponent(id)}`); if (detail.experiment) experiments.push(detail.experiment); } catch { /* registry row unreadable, reported by its absence */ }
}
let traceRecords = [];
try { traceRecords = (await get('research/trace')).trace?.records ?? []; } catch { traceRecords = []; }

const campaignIds = new Set(receipts.map(receipt => receipt.campaignId));
const scopedTrace = traceRecords.filter(record => {
  const refs = record.canonicalRefs ?? {};
  return campaignIds.has(refs.campaignId) || (refs.taskRef && (city.tasks ?? []).some(task => task.id === refs.taskRef));
});

const liveEvents = city.events ?? [];
console.log(`exporter        ${REPO}`);
console.log(`city            ${city.cityId}`);
console.log(`publishedAt     ${publishCutoff}`);
console.log(`live events     ${liveEvents.length}`);
const after = liveEvents.filter(event => typeof event.timestamp === 'string' && event.timestamp > publishCutoff);
console.log(`events after the published snapshot: ${after.length}`);
for (const event of after) console.log(`  + ${event.timestamp}  seq=${event.seq ?? '?'}  ${event.type ?? '?'}  id=${event.id ?? '?'}`);
const pinnedEvents = liveEvents.filter(event => !(typeof event.timestamp === 'string' && event.timestamp > publishCutoff));

const artifact = buildArtifact({
  cityId: city.cityId,
  generatedAt: publishCutoff,
  environment: JSON.parse(readFileSync(join(PUBLISHED, 'environment.json'), 'utf8')),
  topology: JSON.parse(readFileSync(join(PUBLISHED, 'topology.json'), 'utf8')),
  receipts,
  tasks: city.tasks ?? [],
  events: pinnedEvents,
  traceRecords: scopedTrace,
  experiments,
});

const files = artifactFiles(artifact);
files['checksums.json'] = JSON.stringify(checksumsFor(files), null, 2) + '\n';

const publishedNames = readdirSync(PUBLISHED).sort();
const emittedNames = Object.keys(files).sort();
console.log(`\npublished files ${publishedNames.length}  emitted files ${emittedNames.length}`);
let identical = 0;
const differences = [];
for (const name of emittedNames) {
  if (!publishedNames.includes(name)) { differences.push(`${name} (not published)`); console.log(`  EXTRA      ${name}`); continue; }
  const want = readFileSync(join(PUBLISHED, name), 'utf8');
  if (want === files[name]) { identical += 1; console.log(`  identical  ${name}`); continue; }
  differences.push(name);
  console.log(`  DIFFERS    ${name}`);
  const wantLines = want.split('\n'); const gotLines = files[name].split('\n');
  let shown = 0;
  for (let i = 0; i < Math.max(wantLines.length, gotLines.length) && shown < 5; i += 1) {
    if (wantLines[i] !== gotLines[i]) {
      shown += 1;
      console.log(`      line ${i + 1} published  : ${(wantLines[i] ?? '').trim().slice(0, 140)}`);
      console.log(`      line ${i + 1} reexported : ${(gotLines[i] ?? '').trim().slice(0, 140)}`);
    }
  }
}
for (const name of publishedNames) if (!emittedNames.includes(name)) differences.push(`${name} (not emitted)`);

console.log(`\nbyte-identical files: ${identical}/${emittedNames.length}`);
console.log(`differences        : ${differences.length === 0 ? 'none' : differences.join(', ')}`);
process.exit(differences.length === 0 ? 0 : 1);
