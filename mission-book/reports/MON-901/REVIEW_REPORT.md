# MON-901 — REVIEW REPORT (opposite physical host)

```text
REVIEWER            Mech (MEGA-REP) — opposite entity host from the author
AUTHOR (development) Alien-codex
REVIEWED HEAD       7eb38f1b930dfe6cc13dab0e17dedee467b1254b
BRANCH              mon/MON-901-Alien-codex-observation
BASELINE            d3262ce2dd81e51a53e39e6f9add8dee650a7682
REVIEW BRANCH       review/MON-901-mech-review @ d68afa225d3f6abb9ba93583745b305e9705fddc (probes)
EXACT-HEAD CI       V0.2 checks push run 37242446183 completed/success on the reviewed head
                    (jobs: android success, gateway-web success)
                    PR24 pull run 37242505126 completed/success on the SAME head
                    (jobs: android success, gateway-web success)
                    City linkage check pull run 37242505131 completed/success
                    (job: reciprocal-contract success)
VERDICT             PASS
FINDINGS            F1 LOW, F2 INFORMATIONAL — neither blocks the verdict
```

## 1. How this review was performed (and how it was NOT)

The reviewed surface is small: nine changed paths, 847 insertions and 1 deletion —
three gateway source files, one new test file, three docs, two raw evidence receipts. Everything
in this report was measured on this physical host; nothing is inferred from the development report,
from the PR body, or from the author's own test titles.

```text
author suite, unmodified   tests/mon901-observation.test.mjs  -> 8 tests / 8 pass / 0 fail
                           tests/gateway.test.mjs            -> 4 tests / 4 pass / 0 fail
reviewer probes, new       tests/mon901-mech-review-probes.test.mjs -> 6 tests / 6 pass / 0 fail
```

Every probe runs against a **real `createGateway` instance** on a fresh temporary store and drives the
real HTTP routes; none of them calls the observation module directly or reuses a recorded fixture.

**Unlike WBC-603, this commit modifies NO pre-existing test file** — the only test path touched is the
new `tests/mon901-observation.test.mjs`. That was checked, not assumed:

```text
git diff --name-status d3262ce2..7eb38f1b -- 'tests/*' | grep -v mon901   ->  (empty)
```

So there is no relaxed assertion here that would need independent compensation. The author's suite is
still run unmodified, but it is corroboration, not the basis of this verdict.

## 2. The four checks the workbook names, and what actually decided each

The development section of the workbook requires the formal review to independently verify four
things from the exact-head runtime. Each is mapped to a probe, and to the programme's own named
failure label that the probe is really hunting for.

| # | Workbook requirement | Probe | Failure label it rules out |
|---|---|---|---|
| 1 | projection is not task truth | PROBE 1 | `DASHBOARD_BECOMES_SECOND_TASK_TRUTH` |
| 2 | JEV sidecar failure does not freeze tasks | PROBE 2 | `MONITOR_SYNC_BARRIER`, `DECISION_TIMEOUT_GLOBAL_IMPACT` |
| 3 | projection matches canonical runtime | PROBE 3 | `MONITOR_REALITY_DRIFT`, `EDGE_CAUSALITY_MISSING` |
| 4 | an observed risk leaves an exact evidence pointer | PROBE 4 | `SUMMARY_HIDES_ACTIVE_RISK`, `DECISION_PROVENANCE_MISSING` |

```text
PROBE 1  reading /api/v0/monitor twice changes no task row, no node row and appends no canonical
         event; the returned object exposes no put/create/dispatch and no `tasks` collection, so it
         cannot be mistaken for the store. Canonical state after the reads is still RUNNING/40 on n1.
         AUTHORIZATION, checked from outside because the docs claim it: anonymous -> 401,
         worker/node token -> 401, control token -> 200, missing api/schema version -> 409.

PROBE 2  the canonical reader is made to throw. The monitor answers 200 with
         health=UNAVAILABLE / failure=CANONICAL_SOURCE_UNAVAILABLE / authoritative=false instead of
         500ing or pretending to be live, and while it is dead a full claim -> RUNNING -> COMPLETED
         cycle still finishes and the canonical task row reaches COMPLETED. Restoring the reader
         makes the next read live again, with no restart.

PROBE 3  for two real tasks, projected state / hostRef / progress equal the canonical rows exactly;
         ownerRef is null with ownerObservability=NOT_OBSERVABLE rather than an invented owner; the
         ASSIGNED_TO edge carries targetPresent and names its own reason; every projected event id is
         a real canonical event id whose seq and type match the canonical event.

PROBE 4  the window is forced to limit=1 against a population of 13 tasks. The projection admits
         tasksOmitted>0, drops to health=PARTIAL, raises unobservedTaskRisk, and its evidence pointers
         are exact records (source, path, canonicalEventId, seq) that resolve against the canonical
         store - not prose.
```

### 2.1 Two claims that only a negative test can settle — checked by planting canaries

The docs assert that "raw event payloads, task result/error, credentials and hidden reasoning are never
copied", and that "worker tokens cannot read it". A positive test cannot establish an absence, so
PROBE 6 plants a unique marker in canonical truth and then searches for it:

```text
marker present in canonical truth?      events: yes (TASK_FAILED payload.result/error)
                                        task row: yes (result/error)
marker present in the whole projection? no  (JSON.stringify(view) of the entire monitor object)
task state still observable?            yes — FAILED survives as state, so this is redaction,
                                        not omission of the fact
```

### 2.2 The authors' raw evidence receipt is hash-verified, not trusted

`evidence/raw/mission-book/MON-901/validation-receipt.json` declares
`raw_sha256["canary-receipt.json"] = 18003d74374c869ea9325d5a77bcf51b8ec88df0831cdda1d6b68f14df43514a`.
Recomputing SHA-256 over the committed blob (`git show 7eb38f1b:…`) reproduces that value byte for byte.
The receipt itself records `physicalDevices: "NOT_RUN"` and
`executor: "CONTROLLED_PROTOCOL_REPORT_NOT_HARDWARE_BENCHMARK"`, and `performance_claim: false` — the
author does not claim the physical or performance result that this slice never produced.

## 3. Findings

### F1 — LOW: `completeness.continuous` is a constant that contradicts the computed field beside it

**Observed:** `continuous` is hard-coded `false` in the projection's `base()`
(`services/dev-gateway/observation.mjs`) and sits **inside the computed `completeness` object**, next to
the computed `historyGap` that already carries the same meaning. For a window that is in fact complete
and contiguous from seq 1, the two disagree:

```text
canonical event seqs                       1,2,3,4     (nothing deleted, nothing omitted)
completeness.tasksOmitted                  0
completeness.eventsOmitted                 0
completeness.historyGap                    false       <- computed, and correct
completeness.continuous                    false       <- constant, and contradicts the above
health                                     COMPLETE
```

PROBE 5 also shows the field is not derived from anything: forcing a genuinely truncated window moves
`historyGap` from `false` to `true` while `continuous` stays `false` in both cases. The author's own
committed canary receipt carries the same pair (`historyGap:false, continuous:false`).

**Why this is reported rather than passed over.** It is *not* a truthfulness defect: the constant is
conservative, it can never over-claim, and both docs state deliberately that this slice does not claim
continuous telemetry. The defect is one of **placement and name collision**. `completeness` is read by a
consumer as "what is true about this window"; MON-902 is the very next workbook and its dashboard is the
named consumer of exactly this object. A dashboard that renders `completeness.continuous` for a complete
window will raise a false "history is not continuous" alarm, while the workbook's own required
`drop_or_gap` field (`historyGap`) is correct and would have said otherwise. Two fields that mean the
same thing, one computed and one constant, are a latent defect even when the constant is the safe value.

**Minimum repair boundary (not required for this verdict):** one expression — either move the flag out
of `completeness` (it is a capability declaration, not a window property), or derive it:
`continuous: !completeness.historyGap`. Entirely inside `observation.mjs`; no canonical truth, no
contract, and no consumer field is affected beyond this one key.

**Not a gate failure:** the workbook's Research-capture list asks for `drop_or_gap`, and the projection
carries it correctly as `historyGap`. This finding does not weaken any required evidence.

### F2 — INFORMATIONAL: a `CAPTURED` evidence claim in the frontmatter with no pointer

`state_identity_evidence: CAPTURED` is declared with `state_identity_evidence_refs: []`. The claim is
substantively supported — the projection carries the canonical City id, canonical task ids and canonical
event ids/seqs, and PROBE 3 verifies projected identity equals canonical identity — but an evidence
claim with an empty ref list cannot be checked by the next reader. Among the three workbooks in this
repository that declare `CAPTURED`, MON-901 is the only one with no ref; CEX-702 and REX-802 each cite
one. **Repaired as part of this close-out** by pointing the ref at the document that substantiates it
(`mission-book/reports/MON-901/PAPER_MATERIAL_INDEX.md`); the reviewer supplied the pointer, and that is
stated here rather than presented as an author's claim.

### 3.1 A hypothesis this review tested and REJECTED (recorded so it is not re-opened)

`observation.mjs` truncates every identifier through `ref = value => value.slice(0,160)`. Silent
truncation of an identifier would break the projection's joinability against canonical truth while still
looking well-formed, so it was attacked directly. It is **not reachable** through any canonical input:

```text
node id          validated /^[a-zA-Z0-9-]{1,80}$/      -> <= 80 chars
node displayName slice(0,100) on register              -> <= 100 chars
join displayName MAX_DISPLAY_NAME = 64                 -> <= 64 chars
task / event ids generated as Q-<uuid> / uuid          -> <= 40 chars
```

No canonical producer can hand `ref()` a value longer than 160 characters, so no defect is recorded.

## 4. Completion gates, independently checked

| # | Gate (workbook §完成门槛) | Verdict | Basis |
|---|---|---|---|
| 1 | bounded projection contract | PASS | reader rejects `limit` outside 1..256 with `RangeError`; default 128; every population `<= limit`; PROBE 4 |
| 2 | at least one real task's node/edge/event projection | PASS | PROBE 3 against a real gateway (RUNNING + queued task, ASSIGNED_TO edge, canonical event identities) |
| 3 | no-global-barrier evidence | PASS | PROBE 2: dead reader, full claim → RUNNING → COMPLETED still completes |
| 4 | opposite-host review | **PASS (this report)** | six independent probes + author suite unmodified, on a different physical host from `development_host` |
| 5 | exact-head CI | PASS | runs 37242446183 / 37242505126 / 37242505131, all success on the reviewed head |
| 6 | Registry candidate / reconciliation | PASS | `capability-registry/records/CAP-MON-001.yaml` reconciled to `FORMAL_REVIEW_RECONCILED` by this review |
| 7 | PAPER_MATERIAL_INDEX | PASS | present, with the reviewer extension appended |

Workbook strong constraints, each with where it was decided:

```text
JEV is a sidecar, not a synchronous必经路径   PROBE 2: work completes with the sidecar dead
does not copy scheduler/task/device truth      PROBE 1 (no write API, no task collection) + PROBE 6
monitor failure does not block unrelated tasks  PROBE 2
raw telemetry layered per PROCESS_DATA_POLICY  PROBE 6 (canary absent from the whole projection)
no new hidden reasoning capture                PROBE 6 + inspection: no reasoning field exists
first slice shows >=1 active task/owner/state/evidence pointer
                                               PROBE 3 + PROBE 4 (owner honestly NOT_OBSERVABLE)
no second state machine for dashboard comfort  PROBE 1: the projection cannot write at all
```

## 5. What this review does NOT claim

* **No user-visible surface was exercised.** `ui_exemption_reason: null` is correct for
  `user_exposure_class: BACKGROUND_DISCLOSED` (only `INTERNAL_ONLY` requires an exemption reason), and
  the workbook places the graph/inspector UI in MON-902. `user_reachability_status: PARTIAL` is honest;
  the reviewer verified the API and the in-repo docs, **not** any product UI, and this verdict says
  nothing about reachability that MON-902 has to deliver.
* **No cross-device, physical-worker, HA or performance result.** Every fixture here is one physical
  Windows host, as the workbook requires it to remain. `physicalDevices: NOT_RUN` and
  `performance_claim: false` are accepted as accurate statements, not as gaps this review filled.
* **`projectionLatencyMs` is not end-to-end.** It measures canonical read → projection build. The author
  labels this `latency_scope: SAMPLE_TO_PROJECTION_ONLY`; the reviewer confirms the label is accurate and
  claims nothing about ingestion latency.
* F1 is **not** repaired here and is not a condition of the PASS; it is recorded with its minimum repair
  boundary and left to the programme's discretion.
* This verdict covers only `7eb38f1b930dfe6cc13dab0e17dedee467b1254b`. A later head needs its own review;
  nothing here transfers to it, and the probe branch `review/MON-901-mech-review` is review evidence, not
  a merge candidate.

语言配对 / Language pair: [English](./REVIEW_REPORT.md) · [中文](./zh-CN/REVIEW_REPORT.md)
