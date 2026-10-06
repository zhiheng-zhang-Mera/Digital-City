// Independent verification of the published REX-803 evidence package.
//
// This is deliberately a SECOND implementation, written against the files as a fresh clone materializes them, sharing no
// code with the exporter. A package that only its own generator can check is a claim; a package two independent readers
// agree on is material. It re-derives every conclusion from the published bytes, checks the index against those bytes,
// and re-checks for credentials. It does not read the City, the runtime directory, or anything outside the package.
import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';

const DIR = process.argv[2];
if (!DIR || !existsSync(DIR)) throw new Error('usage: verify.mjs <evidence-dir>');
const read = name => readFileSync(join(DIR, name), 'utf8');
const json = name => JSON.parse(read(name));
const sha256 = text => createHash('sha256').update(text).digest('hex');

const checks = [];
const check = (name, passed, detail) => checks.push({name, passed, detail});

// 1. The index must describe the files that are actually here, or the whole package is unanchored.
const index = read('MATERIAL_INDEX.md');
const receiptText = read('campaign-receipt.json');
const receipt = JSON.parse(receiptText);
const listed = [...index.matchAll(/^\| `([^`]+)` \| (\d+) \| `([0-9a-f]{64})` \|$/gm)]
  .map(([, file, bytes, hash]) => ({file, bytes: Number(bytes), hash}));
// The expectation is derived from the directory, not asserted as a constant: a hardcoded count fails the moment the
// package legitimately gains or loses a file, and a probe that fails for a reason of its own is worse than no probe.
const payloadFiles = readdirSync(DIR).filter(name => name !== 'MATERIAL_INDEX.md');
check('index lists exactly the payload files',
  listed.length === payloadFiles.length && payloadFiles.every(file => listed.some(entry => entry.file === file)),
  `listed=${listed.length} present=${payloadFiles.length}`);
const mismatches = [];
for (const entry of listed) {
  if (!existsSync(join(DIR, entry.file))) { mismatches.push(`${entry.file} missing`); continue }
  const text = read(entry.file);
  if (sha256(text) !== entry.hash) mismatches.push(`${entry.file} hash`);
  if (Buffer.byteLength(text) !== entry.bytes) mismatches.push(`${entry.file} size`);
}
check('every listed hash and size matches the file', mismatches.length === 0, mismatches.join(', ') || 'all 7 match');
const unlisted = readdirSync(DIR).filter(name => name !== 'MATERIAL_INDEX.md' && !listed.some(entry => entry.file === name));
check('no unlisted payload file', unlisted.length === 0, unlisted.join(', ') || 'none');

// 2. The campaign identity must be the same object everywhere it appears.
const tasks = json('canonical-tasks.json').tasks;
const trace = json('trace-snapshot.json');
const declared = json('manifest-and-seed.json');
const derived = json('derived-checks.json');
const campaignId = receipt.campaignId;
check('campaign id agrees across files',
  declared.campaignId === campaignId && derived.campaignId === campaignId
  && tasks.every(task => (task.researchRunRef ?? '').startsWith(campaignId + ':')),
  campaignId);
check('candidate sha declared by the receipt and bound by the package agree',
  declared.candidateSha === receipt.context.manifest.softwareRefs[0].commitSha,
  declared.candidateSha);

// 3. Re-derive the seeds and the placement from the seed function and the placement rule, independently of the exporter.
const runSeed = (seed, index) => {
  let hash = 2166136261 >>> 0;
  for (const character of `${seed}:${index}`) { hash ^= character.codePointAt(0); hash = Math.imul(hash, 16777619) >>> 0 }
  return hash >>> 0;
};
const workers = receipt.context.manifest.workers;
const placement = receipt.runs.map(run => {
  const seed = runSeed(receipt.campaignSeed, run.index);
  return {
    index: run.index,
    seedOk: seed === run.seed,
    workerOk: run.result.assignedNodeId === (receipt.context.targetDeviceRef ?? workers[seed % workers.length]),
    worker: run.result.assignedNodeId,
    onDeclaredWorker: workers.includes(run.result.assignedNodeId),
  };
});
check('every recorded seed re-derives from campaignSeed and index', placement.every(p => p.seedOk));
check('every run landed on the worker the seed predicts', placement.every(p => p.workerOk),
  placement.map(p => `${p.index}->${p.worker.slice(0, 12)}`).join(' '));
check('no run landed outside the declared manifest', placement.every(p => p.onDeclaredWorker));
check('both host workers actually ran a measured repetition', new Set(placement.map(p => p.worker)).size === 2);

// 4. Correspondence: each run's task must appear in the City's own task list, terminal, carrying its run ref.
const correspond = receipt.runs.map(run => {
  const task = tasks.find(t => t.id === run.result.taskRef);
  return {
    index: run.index,
    found: task !== undefined,
    state: task?.state,
    ref: task?.researchRunRef,
    refOk: task?.researchRunRef === `${campaignId}:${run.index}`,
    resultOk: JSON.stringify(task?.result) === JSON.stringify(run.result.result),
  };
});
check('every run has its canonical task in the package', correspond.every(c => c.found));
check('every canonical task is terminal', correspond.every(c => c.state === 'COMPLETED'), correspond.map(c => `${c.index}:${c.state}`).join(' '));
check('every canonical task carries its own run ref', correspond.every(c => c.refOk));
check('the canonical task result equals the receipt result', correspond.every(c => c.resultOk));

// 5. Accounting: sum the runs and compare with the receipt's own summary, then with the claimed derived verdict.
const summary = receipt.summary;
const counted = {
  planned: receipt.runs.length,
  accounted: receipt.runs.length,
  measured: receipt.runs.filter(r => r.measured === true).length,
  warmup: receipt.runs.filter(r => r.warmup === true).length,
  timedOut: receipt.runs.filter(r => r.state === 'TIMED_OUT').length,
  failed: receipt.runs.filter(r => r.result?.state === 'FAILED').length,
};
check('receipt summary equals the runs it summarizes',
  Object.entries(counted).every(([key, value]) => summary[key] === value) && summary.terminalAccountingComplete === true,
  JSON.stringify(counted));
check('terminal accounting is complete and every repetition measured',
  summary.terminalAccountingComplete === true && summary.measured === summary.planned);
check('the package\'s own derived verdicts are true, re-read rather than trusted',
  derived.everySeedReproduced && derived.everyPlacementPredicted && derived.everyCityTaskCarriesItsRunRef
  && derived.accountingConsistent && derived.candidateShaAgrees);

// 6. The trace boundary: the epoch published must be the epoch that holds this campaign's tasks, and PARTIAL must have
//    exactly the cause the package names.
const epochRefs = new Set(trace.records.flatMap(r => Object.values(r.canonicalRefs ?? {})));
const taskRefsInEpoch = receipt.runs.filter(run => epochRefs.has(run.result.taskRef)).length;
check('the published epoch holds all three campaign tasks', taskRefsInEpoch === 3, `${taskRefsInEpoch}/3`);
check('every published record belongs to the published epoch', trace.records.every(r => r.runId === trace.publishedEpoch));
const disjuncts = {
  storageNotReady: trace.envelope.storageState !== 'READY',
  dropped: trace.envelope.droppedRecords > 0,
  truncated: trace.envelope.retentionTruncated === true,
  failures: (trace.envelope.failures ?? []).length > 0,
  annotations: trace.records.some(r => (r.annotations ?? []).length > 0),
  missingFields: trace.records.some(r => (r.missingFields ?? []).length > 0),
};
const holding = Object.entries(disjuncts).filter(([, held]) => held).map(([name]) => name);
check('PARTIAL has exactly the cause the package states',
  trace.envelope.completeness === 'PARTIAL' && holding.length === 1 && holding[0] === 'missingFields',
  `holding=${holding.join(',') || 'none'}`);

// 7. Clocks: no record may claim to have been captured before the occurrence it captured.
const inverted = trace.records.filter(r => r.timestamp && r.clocks?.capturedAt
  && Date.parse(r.clocks.capturedAt) < Date.parse(r.timestamp));
check('no record was captured before the event it records', inverted.length === 0, `inverted=${inverted.length}`);
const windowed = receipt.runs.every(run => {
  const task = tasks.find(t => t.id === run.result.taskRef);
  return task && Date.parse(task.createdAt) >= receipt.startedAt && Date.parse(task.updatedAt) <= receipt.finishedAt;
});
check('every run task was created and finished inside the receipt window', windowed);

// 8. Redaction, checked here rather than taken from the exporter's word.
const credentialShaped = /("token"\s*:|Bearer\s+[A-Za-z0-9._-]{16,}|sess:[0-9a-f-]{8,}|shortCode|claimSecret|credentialSecret|pairingSessionId)/;
const leaks = listed.map(entry => entry.file).filter(file => credentialShaped.test(read(file)));
check('no credential-shaped value in any listed payload', leaks.length === 0, leaks.join(', ') || 'none');

const failed = checks.filter(entry => !entry.passed);
for (const entry of checks) console.log(`${entry.passed ? 'PASS' : 'FAIL'}  ${entry.name}${entry.detail ? '  [' + entry.detail + ']' : ''}`);
console.log(`\n${checks.length - failed.length}/${checks.length} independent checks pass`);
process.exit(failed.length === 0 ? 0 : 1);
