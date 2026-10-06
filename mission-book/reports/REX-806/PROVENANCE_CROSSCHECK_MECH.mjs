// Provenance cross-check: does the published artifact's normalized dataset actually match the City's raw store?
//
// The shipped verifier recomputes each metric from the artifact's OWN dataset and re-hashes its bytes. That catches a
// package that disagrees with itself, but not a package that agreed with itself while mis-transcribing the City - a
// wrong timestamp copied consistently would pass every check it runs. This closes that gap from the other side: it reads
// the City's raw receipts and canonical tasks and compares them with the published rows, field by field.
//
// It is a record tool, not part of the product: the reviewer's independent recomputation must not come from it.
import {readFileSync} from 'node:fs';
import {join} from 'node:path';

const CITY = 'http://172.31.12.151:4391';
const CONFIG = 'C:/ProgramData/Utopia/host/city/local-config.json';
const ARTIFACT = process.argv[2] ?? 'D:/utopia-chat/dc/mission-book/reports/REX-806/artifact';

const secret = JSON.parse(readFileSync(CONFIG, 'utf8')).token;
const H = {'Content-Type': 'application/json', 'X-City-Api-Version': '0', 'X-City-Schema-Version': '0', Authorization: `Bearer ${secret}`};
const get = async path => (await fetch(`${CITY}/api/v0/${path}`, {headers: H})).json();

const dataset = JSON.parse(readFileSync(join(ARTIFACT, 'normalized-dataset.json'), 'utf8')).rows;
const metricsCsv = readFileSync(join(ARTIFACT, 'metrics.csv'), 'utf8');
const csvValue = id => {
  const line = metricsCsv.split('\n').find(row => row.startsWith(`${id},`));
  return line ? line.split(',')[2] : null;
};

const city = await get('city');
const rawTasks = new Map((city.tasks ?? []).map(task => [task.id, task]));

const checks = [];
const check = (name, passed, detail = '') => { checks.push({passed}); console.log(`${passed ? 'PASS' : 'FAIL'}  ${name}${detail ? `  [${detail}]` : ''}`); };

// 1. Every row must point at a receipt the City still holds, and the run's own fields must match byte for byte.
const receiptCache = new Map();
const loadReceipt = async campaignId => {
  if (!receiptCache.has(campaignId)) {
    const detail = await get(`research/campaigns/${encodeURIComponent(campaignId)}`);
    receiptCache.set(campaignId, detail.campaign ?? null);
  }
  return receiptCache.get(campaignId);
};

const rowMismatches = [];
const missingReceipts = new Set();
for (const row of dataset) {
  const receipt = await loadReceipt(row.campaignId);
  if (!receipt) { missingReceipts.add(row.campaignId); continue; }
  const raw = (receipt.runs ?? []).find(run => run.index === row.index);
  if (!raw) { rowMismatches.push(`${row.rawPointer}: no such run in the City's receipt`); continue; }
  if (raw.seed !== row.seed) rowMismatches.push(`${row.rawPointer}: seed ${row.seed} vs raw ${raw.seed}`);
  if (raw.state !== row.state) rowMismatches.push(`${row.rawPointer}: state ${row.state} vs raw ${raw.state}`);
  if ((raw.measured === true) !== row.measured) rowMismatches.push(`${row.rawPointer}: measured flag`);
  if ((raw.result?.assignedNodeId ?? null) !== row.assignedNodeId) rowMismatches.push(`${row.rawPointer}: assigned node`);
  if ((raw.result?.taskRef ?? null) !== row.taskRef) rowMismatches.push(`${row.rawPointer}: task ref`);
}
check('every dataset row matches the City receipt it points at',
  rowMismatches.length === 0 && missingReceipts.size === 0,
  rowMismatches.slice(0, 3).join(' | ') || (missingReceipts.size ? `receipts no longer held: ${[...missingReceipts].join(',')}` : `${dataset.length} rows over ${receiptCache.size} receipts`));

// 2. Every canonical task the artifact references must still exist with the same timestamps and terminal state.
const taskMismatches = [];
for (const row of dataset) {
  if (!row.taskRef) continue;
  const task = rawTasks.get(row.taskRef);
  if (!task) { taskMismatches.push(`${row.taskRef} absent from the City`); continue; }
  if (task.createdAt !== row.taskCreatedAt) taskMismatches.push(`${row.taskRef}: createdAt ${row.taskCreatedAt} vs ${task.createdAt}`);
  if (task.updatedAt !== row.taskUpdatedAt) taskMismatches.push(`${row.taskRef}: updatedAt ${row.taskUpdatedAt} vs ${task.updatedAt}`);
  if (task.state !== row.taskState) taskMismatches.push(`${row.taskRef}: state ${row.taskState} vs ${task.state}`);
}
check('every referenced canonical task matches the City, timestamps included',
  taskMismatches.length === 0,
  taskMismatches.slice(0, 3).join(' | ') || `${dataset.filter(row => row.taskRef).length} task references`);

// 3. The four reported metrics must recompute from the RAW store, not just from the artifact's own copy.
const durations = dataset
  .filter(row => row.measured === true && row.taskState === 'COMPLETED')
  .map(row => Date.parse(rawTasks.get(row.taskRef).updatedAt) - Date.parse(rawTasks.get(row.taskRef).createdAt))
  .filter(ms => Number.isFinite(ms) && ms >= 0)
  .sort((a, b) => a - b);
const median = durations.length === 0 ? null : (durations.length % 2 === 1 ? durations[(durations.length - 1) / 2] : Math.round((durations[durations.length / 2 - 1] + durations[durations.length / 2]) / 2));
check('completion_time_ms recomputes from the raw task timestamps', String(median) === csvValue('completion_time_ms'), `raw ${median} vs package ${csvValue('completion_time_ms')}`);

const receipts = [...receiptCache.values()].filter(Boolean);
// The accounting check must load EVERY receipt the City holds, not only the ones dataset rows point at. The first
// version of this tool cached receipts lazily while walking the dataset, so it never saw the two campaigns that were
// refused before they ran - and it reported planned=24, undelivered=0 while the artifact says planned=32,
// undelivered=8. That is the mirror of the blind spot this exporter already had to fix: an undelivered run that hides
// because nothing points at it.
const allReceiptIds = ((await get('research/campaigns')).receipts ?? []).map(entry => entry.campaignId);
for (const id of allReceiptIds) await loadReceipt(id);
const allReceipts = [...receiptCache.values()].filter(Boolean);
const plannedRaw = allReceipts.reduce((total, receipt) => total + (receipt.summary?.planned ?? 0), 0);
const accountedRaw = allReceipts.reduce((total, receipt) => total + (receipt.summary?.accounted ?? 0), 0);
const unproductiveRaw = allReceipts.reduce((total, receipt) => total + (receipt.summary?.failed ?? 0) + (receipt.summary?.timedOut ?? 0), 0);
const rate = accountedRaw > 0 ? Number((unproductiveRaw / accountedRaw).toFixed(6)) : null;
check('failure_rate recomputes from the raw receipt accounting', String(rate) === csvValue('failure_rate'), `raw ${rate} over accounted=${accountedRaw} (planned=${plannedRaw}, undelivered=${plannedRaw - accountedRaw}) vs package ${csvValue('failure_rate')}`);

// The accounting itself must match, or a refused campaign could be dropped from the artifact without anything noticing.
const manifestAccounting = JSON.parse(readFileSync(join(ARTIFACT, 'manifest.json'), 'utf8')).supporting?.accounting ?? {};
check('the artifact accounting matches every receipt the City holds',
  manifestAccounting.planned === plannedRaw && manifestAccounting.accounted === accountedRaw
  && (manifestAccounting.planned - manifestAccounting.accounted) === (plannedRaw - accountedRaw),
  `city planned=${plannedRaw} accounted=${accountedRaw} (undelivered ${plannedRaw - accountedRaw}); artifact planned=${manifestAccounting.planned} accounted=${manifestAccounting.accounted} (undelivered ${manifestAccounting.planned - manifestAccounting.accounted})`);
const refusedRaw = allReceipts.filter(receipt => (receipt.summary?.accounted ?? 0) === 0 && (receipt.summary?.planned ?? 0) > 0);
check('every campaign that never delivered a run is named in the artifact',
  refusedRaw.every(receipt => (manifestAccounting.undeliveredCampaigns ?? []).some(entry => entry.campaignId === receipt.campaignId)),
  `${refusedRaw.length} undelivered campaign(s): ${refusedRaw.map(receipt => `${receipt.campaignId}(${receipt.reason})`).join(', ') || 'none'}`);

const refOwners = new Map();
for (const task of rawTasks.values()) {
  if (!task.researchRunRef) continue;
  refOwners.set(task.researchRunRef, (refOwners.get(task.researchRunRef) ?? 0) + 1);
}
const duplicatedRaw = [...refOwners.values()].filter(count => count > 1).length;
check('duplicate_execution_count recomputes from the raw task store', String(duplicatedRaw) === csvValue('duplicate_execution_count'), `raw ${duplicatedRaw} over ${refOwners.size} references vs package ${csvValue('duplicate_execution_count')}`);

// 4. The dataset must not contain a run the City does not hold, and must not omit one it does.
const rawRunRefs = new Set();
for (const receipt of receipts) for (const run of receipt.runs ?? []) rawRunRefs.add(`${receipt.campaignId}:${run.index}`);
const datasetRefs = new Set(dataset.map(row => `${row.campaignId}:${row.index}`));
const extra = [...datasetRefs].filter(ref => !rawRunRefs.has(ref));
const omitted = [...rawRunRefs].filter(ref => !datasetRefs.has(ref));
check('the dataset covers exactly the runs the City holds', extra.length === 0 && omitted.length === 0,
  `extra=${extra.length} omitted=${omitted.length} (city ${rawRunRefs.size} runs, artifact ${datasetRefs.size} rows)`);

const failed = checks.filter(entry => !entry.passed);
console.log(`\n${checks.length - failed.length}/${checks.length} provenance cross-checks pass against the live City`);
console.log(`city=${city.cityId} receipts=${receiptCache.size} datasetRows=${dataset.length}`);
process.exit(failed.length === 0 ? 0 : 1);
