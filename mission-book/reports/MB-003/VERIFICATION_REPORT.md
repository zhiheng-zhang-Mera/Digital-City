# MB-003 — Worker Gateway (Boss/Hns union) — VERIFICATION REPORT

> Status: **BLOCKED_ENVIRONMENT** — the Mission's two-host provider gate cannot be satisfied from
> this host. The earlier "no provider environment" claim was **corrected in step 3**: this host DOES
> have a donor-supported real provider path and produced a real receipt (§8). The blocker is now
> precisely *Alien's* half, not this host's, and section R8 forbids masking it as a skip.
> Verification Host: `Mech`
> Claimed at: `2026-09-29T15:05:00Z` (City `39d1c7f`)
> Migration Host: `Alien` (different host, as rule 5 requires)
> Reviewed migration branch: `mission/MB-003-worker-gateway` @ `c5734a5e646f1e379aa15282b59a08e8828d5d6a`
> Step 3 base: Utopia `main` @ `168182c47df537f7c6c47d7e42ab3220af40de68`; branch now `8262a41`

```text
MISSION = MB-003
ROLE = VERIFICATION
HOST = Mech  (COMPUTERNAME MEGA-REP)
MIGRATION_HOST = Alien
STEP3_BASE_MAIN = 168182c47df537f7c6c47d7e42ab3220af40de68
BRANCH_SHA_PRE = 60afe9e68b6d209d3edaf29b321cce74738cd38f
BRANCH_SHA_POST = 8262a41
MERGED_MAIN_SHA = null            (blocked: no finalize, no merge)
VERIFICATION_COMPLETE = false
BLOCKER = Alien host unavailable for the required second real-provider receipt
```

## 0. Rule 9 ordering (read this first)

Mission rule 9 is explicit: the Verification Host **first** completes an independent review
from the donor, the target code, the diff, the tests and the runtime state, and writes its
findings down; **only then** may it read the Migration Report.

§1–§5 are that independent review. They were written from the branch, the donor clones and
this host's own probes, without opening `reports/MB-003/MIGRATION_REPORT.md`. §6 is the
first point at which the Migration Report is consulted.

## 1. What is being verified

MB-003 migrates the Hns-first, Boss-supplemented engineering provider/runtime adapter
behaviour into `city/02-engineering/02-worker-gateway`, keeping the already-migrated Skill
Intake in place. Donors: `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973` and
`Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`.

## 2. What the branch actually contains

Reviewed revision `c5734a5`. Diff against `c7ef3cd`: **28 files, +5241 / −6**. Three new
modules under the existing `city/02-engineering/02-worker-gateway` building:

| Module | Donor source (per its `DONOR.json`) |
|---|---|
| `provider-adapter` | Codex-Boss `electron/runtimes/{runtime,unsupported-runtime,web/provider-runtime-adapter}.ts`, `src/shared/provider-state.ts` |
| `provider-resilience` | Codex-Boss `electron/commander/circuit-breaker.ts`, `src/shared/provider-outcome.ts` |
| `worker-task-contract` | DS-Hns `app/extensions/mega/scheduler/lifecycle.js` |

Plus `city/CITY_IMPLEMENTATION_MANIFEST.json`, `city/manifest.mjs`, both
`city/docs/{en,zh-CN}/ARCHITECTURE.md`, `city/tests/manifest.test.mjs`,
`services/capability-bridge/{bridge,registry}.mjs`, `tests/capability-bridge.test.mjs` and
the mission event stream.

## 3. Independent findings

### 3.1 The required gates pass on the reviewed revision — CONFIRMED

Executed by this host on the branch at `c5734a5`:

| Gate | Result |
|---|---|
| `pnpm test` | **59 / 59** |
| `node city/test-all.mjs` | **224 / 224** |
| `node --test apps/rooms/tests/*.test.mjs` | **67 / 67** |

### 3.2 The real consumption is a resilience latch, not a provider run — CONFIRMED

`services/capability-bridge/bridge.mjs` replaces its ad-hoc `degraded` `Set` with the
migrated circuit breaker: a capability whose invocation fails with a provider-technical code
(`ENGINE_UNAVAILABLE`, `ADAPTER_UNAVAILABLE`) is observed by `circuit.observeFailure`, and
`degraded(capabilityId)` becomes `circuit.state(id) !== 'CLOSED'`. Utopia's policy travels as
data (`failureThreshold: 1`, `cooldownMs: 604800000`), which reproduces the previous
permanent latch without the breaker needing a timer.

That is a genuine consumption of the migrated `provider-resilience` boundary, and
`tests/capability-bridge.test.mjs` proves it over the real bridge, including the negative
case the change makes checkable: a `TIMEOUT` — a failure, but not a provider-health signal —
must **not** degrade anything. The migrated module is doing real work in a real product path.

### 3.3 The migrated adapter cannot execute a provider, by design — this is the blocker

The Mission's first Verification gate is:

> 每台参与主机至少用其已安装且 donor 已支持的真实 provider 完成一次
> detect→submit→progress→result/unsupported 的实际路径；环境缺失则任务 BLOCKED，
> 不得 mock pass。

I probed the migrated module directly
(`.runtime/evidence/mission-book/MB-003/run-1/unsupported-path-probe.mjs`):

- `unsupportedRuntime({...})` reports `availability: 'UNSUPPORTED'` with the donor message
  `Runtime is configured but not implemented in v0.5`, `isRuntimeAvailable('UNSUPPORTED')`
  is `false`, `execute` returns `PERMANENT_FAILURE / UNSUPPORTED / retryable false`, and the
  adapter exposes **no** `cancel` — i.e. the **unsupported** half of the required path is
  present and honest.
- `providerRuntimeAdapter({ id, hooks })` delegates `healthCheck` / `execute` / `cancel` to
  **caller-supplied hooks** and validates their shapes. With in-memory hooks it produces
  `AVAILABLE` health and a `SUCCESS` result — but the only thing that executed was my probe's
  own function.
- A source scan of all four `provider-adapter` files for provider-client seams
  (`fetch(`, `node:http`, `node:https`, `node:child_process`, `node:net`, `XMLHttpRequest`,
  `api.deepseek`, `openai`) returns **zero hits**.

The module's own `DONOR.json` says the same thing under `classification.DEFERRED`: "real
web-session automation, provider HTTP calls and page attachment", plus the runtime registry
and supervisor that consumed these contracts. The sibling modules defer the rest of the
execution path: `worker-task-contract` defers "`dsh-runner.js` … the real spawn seam
(child_process + fs)", and `provider-resilience` defers the `ExecutionSupervisor` wiring.
`services/dev-gateway/server.mjs` constructs `createBridge(store, emit, { artifactRoot })`
**without** an `execute` hook, so the local gateway cannot exercise a migrated provider
execution either.

This host's installed provider surface (recorded in
`.runtime/evidence/mission-book/MB-003/run-1/provider-inventory.txt`):

| Provider | State on this host |
|---|---|
| `codex` | absent |
| `claude` | absent |
| `gemini` | absent |
| Ollama | installed, **no models pulled**, and not a donor-supported provider |
| DeepSeek | no CLI, no local runtime; only an API key in the environment |

### 3.4 Why this is `BLOCKED` and not something I may repair

Completing the gate would require a provider client that reaches a real provider — exactly
what the migration declares under `DEFERRED`. Writing one during verification would (a) add
a capability the donor branch does not have at this boundary, which rule 10 and the Mission's
`MODE=MIGRATION_ONLY` forbid, and (b) turn a missing prerequisite into a "verified" claim.
The Mission anticipates exactly this: "环境缺失则任务 BLOCKED，不得 mock pass". So the
verification is blocked, not failed, and the reason is an environment prerequisite rather
than a defect in the migrated code.

### 3.5 Cross-mission merge conflict — reproduced, with the reconciliation shape

Both MB-001 (already merged to `main` at `d81a567`) and MB-003 edit
`city/CITY_IMPLEMENTATION_MANIFEST.json`, `city/tests/manifest.test.mjs`,
`city/docs/{en,zh-CN}/ARCHITECTURE.md` and `services/capability-bridge/registry.mjs`. The
migration host flagged this; I rehearsed the merge (`git merge --no-commit main` on the
branch) and found **two real conflicts**, both mechanical:

1. `services/capability-bridge/registry.mjs` — MB-001 filters **districts**
   (`(d.kind ?? 'domain') !== 'infrastructure'`), MB-003 filters **modules**
   (`m.capabilityProvider !== false`). The reconciliation is both filters, not either:
   they are independent exclusion mechanisms (district kind for a kernel district, module
   flag for adapter infrastructure inside a domain district), and keeping both preserves each
   Mission's intent without inventing semantics.
2. `city/tests/manifest.test.mjs` — each branch replaced the census constant with its own
   mission's modules (`EXPECTED_MODULES` for MB-001, `WAVE1` for MB-003) and the expected
   district list accordingly. The reconciliation is the **union**: five districts
   (`00-foundation`, `02-engineering`, `06-research`, `09-planning-knowledge`,
   `11-entertainment`) and the four MB-001 modules plus the three MB-003 modules.

`city/CITY_IMPLEMENTATION_MANIFEST.json` and `city/manifest.mjs` merged without conflict and
already carry both mechanisms (`"kind": "infrastructure"` at the district, three
`"capabilityProvider": false` module flags). Both architecture docs merged without conflict
and are additive. This rehearsal was abandoned before committing; nothing was merged.

### 3.6 What I could NOT confirm

- The real detect→submit→progress→result path (§3.3) — the blocker.
- Donor parity of `provider-resilience`'s failure classification and of
  `worker-task-contract`'s lifecycle against the frozen donors: the ledgers state it as
  vectors, and I did not rebuild a differential for them in this pass.
- Provider failure/interruption/circuit-breaker semantics **under a real provider**; the
  breaker is observable against the real bridge, but only with an injected failing `execute`.

## 4. Rule 9 status

Findings in §3 were established and written before the Migration Report was opened. The
report is consulted in §6.

## 5. Verification gates run by this host

Recorded so §6 depends on a measurement rather than a claim: the §3.1 gates were run by
`Mech` on `c5734a5` from a clean checkout before the Migration Report was read, and the
probes in §3.3 were written and executed by this host.

## 6. The blocker, and what would unblock it

> **SUPERSEDED IN PART — read §8 first.** Step 3 corrected the environment claim below: this host
> **does** have a donor-supported real provider path (the donor's own runner targets
> `@deepseek-ai/dsh`, installed here) and produced a real receipt. The blocker is now Alien's
> missing half, not this host's. The three options below are retained as the historical finding.

`BLOCKED` on the Mission's first Verification gate. Three ways out, all of which are Owner
decisions rather than verifier decisions:

1. **Provide a donor-backed provider environment** — install and configure the provider the
   donor actually drives (the Codex web runtime the adapter names, or the Hns worker seam
   `dsh-runner.js`), so the required path can be executed for real.
2. **Authorise the provider client as Mission scope** — a superseding Mission that migrates
   the deferred provider execution seam (the donor's real runner) rather than leaving it
   DEFERRED. Rule 10 does not permit the verifier to add it here.
3. **Declare the threshold unmeetable as written** and mark MB-003
   `BLOCKED_OWNER_DECISION`, which also blocks MB-004, whose gate is "通过 MB-003 Worker
   Gateway 跑一次真实 Engineering job".

Until one of those happens, MB-003 cannot reach `VERIFICATION_COMPLETE`, and the migration
branch must not be merged (rule 11's merge gate requires the Mission's own checks to be
green).

## 7. Evidence pointers

Host-local (git-ignored, this host):

- `.runtime/evidence/mission-book/MB-003/run-1/provider-inventory.txt` — the installed
  provider surface and the DEFERRED boundaries that make the gate unmeetable here.
- `.runtime/evidence/mission-book/MB-003/run-1/unsupported-path-probe.mjs` + `.log` — the
  executable probe behind §3.3.
- `.runtime/evidence/mission-book/MB-003/run-1/donor/DS-Hns/` — the DS-Hns clone at
  `eeb57ca5` used to confirm the DeepSeek provider plugin and the deferred runner.

Branch:

- `mission/MB-003-worker-gateway` @ `c5734a5` (not merged; the merge rehearsal was aborted).
- Mission event stream on the branch, including this host's `ATTEMPT_STARTED` and the
  `BLOCKED` finding.

---

## 8. Step 3 (2026-09-30) — reassessment, provider probe, corrected blocker

Run under the 7→8→3 closeout order and `response-9-30.md` R8, from the post-MB-008 `main`
`168182c`. Branch `60afe9e` → `8262a41`. Host-local evidence:
`.runtime/evidence/mission-book/MB-003/run-2/STEP3-STATE.md` (full detail) and
`provider-seam-receipt.mjs` / `.log` / `run/summary.json`.

### 8.1 Value reassessment — `ROUTE_B_CONTINUE`

`main`'s `city/02-engineering/02-worker-gateway` contains **only** `skill-intake`. Nothing in
`city/CITY_IMPLEMENTATION_MANIFEST.json` references `provider-adapter`, `provider-resilience` or
`worker-task-contract`, and no Worker-Gateway provider/runner execution seam exists anywhere in
`city/`. The scan's only hits (`01-project-foreman`'s `process.mjs`/`git.mjs`, and Host Health
Station's metrics "providers" registry) are other buildings' own mechanisms and a different meaning
of the word.

| Item | On `main` | Verdict |
| --- | --- | --- |
| WG-01 provider/runtime detect/version/readiness | nothing | **missing** |
| WG-02 submit/start bounded work | nothing | **missing** |
| WG-03 status/progress | nothing | **missing** |
| WG-04 cancel/interrupt | nothing | **missing** |
| WG-05 result/evidence | nothing | **missing** |
| WG-06 unsupported refusal | nothing | **missing** |
| WG-07 provider failure / circuit breaker | nothing | **missing** |
| WG-08 worker task lifecycle / real runner seam | nothing | **missing** |

Route A is **forbidden**: not one of the eight is covered. Branch was **4 ahead / 59 behind** `main`.

### 8.2 ⚠ Correction to §3.3 — this host HAS a donor-supported provider

§3.3's inventory concluded "DeepSeek: no CLI, no local runtime". That was **incomplete**: it looked
for provider CLIs on `PATH` and missed that the **donor's own runner seam** targets a runtime that is
installed here.

```text
DS-Hns @ eeb57ca  app/extensions/mega/scheduler/dsh-runner.js
  -> spawn(node, [<app>/node_modules/@deepseek-ai/dsh/lib/bin.js,
                  '--profile', 'headless', <prompt>])
     @deepseek-ai/dsh 0.1.5-rc.1   INSTALLED at D:\DS-Hns\app\node_modules\@deepseek-ai\dsh
     credential route llm-deepseek / deepseek-official
```

The host already holds an authorised key (`DeepSeek_API`, `sk-…`); the dsh route reads
`DEEPSEEK_API_KEY`. Order §12 priority 4 permits reusing the host's already-authorised session/API
configuration, so the value was passed to the child process only — **never printed, never logged**,
and the driver asserts no key material in any record or job log. `codex`/`claude`/`gemini` remain
absent; `codex-cli-runtime.ts`'s `~/.codex/.sandbox-bin/codex.exe` target is absent too.

### 8.3 Real receipts on host Mech (driver exit 0)

| Step | Receipt |
| --- | --- |
| detect / version | `@deepseek-ai/dsh` **0.1.5-rc.1**, bin present, launcher exit 0 |
| donor seam identity | donor `dsh-runner.js` loads; `runner.DSH_BIN` resolves to the **same** binary probed |
| **submit** | donor `startJob` → real child pid; bounded read-only prompt |
| **progress** | donor per-task log + child liveness sampled across the job's life |
| **result** | `exit 0`, log holds the real model answer `OK` |
| **cancel / interrupt** | donor `killTree(pid)` on a running job → `runningBefore: true`, `runningAfterInterrupt: false` |
| **unsupported** | migrated `unsupportedRuntime` → `UNSUPPORTED`, `isRuntimeAvailable false`, `PERMANENT_FAILURE`/`UNSUPPORTED`, `retryable false`, no `cancel` |
| **provider error truth** | credential withheld → `exit 1`, real `MISSING_CREDENTIAL: llm-deepseek: no API key for provider route "deepseek-official"`, **not rewritten as success** |
| **failure classification** | migrated breaker `CLOSED → OPEN`, `isOpen true`, admission refused while open |
| **module regression** | skill-intake **22/22**, provider-adapter **29/29**, provider-resilience **42/42**, worker-task-contract **23/23** = 116, 0 failures |

Machine verdicts: `PROVIDER_RUNTIME_PRESENT`, `REAL_SUBMIT_RESULT`, `PROGRESS_OBSERVED`,
`CANCEL_INTERRUPT`, `UNSUPPORTED_REFUSAL`, `PROVIDER_ERROR_NOT_REWRITTEN`, `NO_SECRET_LEAK` — all
`true`.

**Honest granularity note.** The `dsh` headless profile emits its answer as one chunk at completion,
so the donor log does **not** grow incrementally for a short job. Progress for this runtime is
therefore *job liveness plus the per-task log*, not token streaming. Recorded rather than smoothed
over.

### 8.4 Why it still stops at `BLOCKED` — and why no repair was written

The Mission requires **each participating host** to leave a real donor-supported provider receipt
(*"环境缺失则任务 BLOCKED，不得 mock pass"*). `response-9-30.md` **R7** rewrote that clause for
**MB-008 only**; for MB-003 it stands, and the closeout order states *"当前不得自行降成只测一台"*.

**Alien is a different physical host and is not reachable from this session.** Its own evidence
references working copies absent here (`D:/Digital-City`, `D:/DS-Hns-donor`, `D:/Codex-Boss-donor`;
this host is `MEGA-REP`). So Mech's half is proven achievable and reproduced; Alien's half cannot be
produced here, and `finalize`/merge cannot run.

The order's §13 repair is gated on *"若有合法环境"*. Mech has a lawful environment; the **Mission**
does not, because the two-host gate is unsatisfiable. Writing the deferred runner seam into the
branch would produce a delta that can never pass the required gate or be merged — the anti-pattern
the order names in §18 (*"任何 accepted capability 不得只存在于未合入 branch"*). The judged call was
therefore **not** to write unverifiable product code, and instead to leave the seam fully mapped
(§8.5) plus a reproducible Mech receipt. Per R8, still-valuable-without-a-complete-environment must
stay `BLOCKED` and must **not** be recorded as `SKIPPED_NOT_REQUIRED`.

### 8.5 Execution-seam source map (for the next session)

| Donor source (frozen) | What it is | Utopia target |
| --- | --- | --- |
| DS-Hns `app/extensions/mega/scheduler/dsh-runner.js` | the real spawn seam: `startJob`, `killTree`, `childEnv`, `DSH_BIN` | `worker-task-contract` (deferred today) |
| DS-Hns `.../scheduler/scheduler.js` | queue + status/progress state | worker-gateway runner module |
| DS-Hns `.../scheduler/system.js`, `gate.js` | queue system hooks / admission | worker-gateway runner module |
| Codex-Boss `electron/runtimes/codex/codex-cli-runtime.ts` | `codex:cli` runtime; spawns `codex login status`, `codex exec --ephemeral --sandbox read-only` | `provider-adapter` |
| Codex-Boss `electron/runtimes/native-api-runtime.ts` | `api` runtime over a `ProviderApiClient` | `provider-adapter` |
| Codex-Boss runtime registry + `ExecutionSupervisor` | adapter registration, provider-for-role resolution | new wiring (R8 permits) |

### 8.6 Step-3 evolution events appended on the branch (`8262a41`)

| Event | Outcome | Event id |
| --- | --- | --- |
| OWNER_INTERVENTION (R8) | INFO | `MB-003:f6c10e2976dde044` |
| ATTEMPT_STARTED | INFO | `MB-003:c5aba9348638068d` |
| RUNTIME_PASS (Mech only, explicitly scoped) | PASS | `MB-003:de2ff78e06806a93` |
| TEST_PASS | PASS | `MB-003:3f13f658e8d00e09` |
| VERIFIER_FINDING | **BLOCKED** | `MB-003:6803294c04110f7d` |

Retained from the earlier rounds: the real `MIGRATION_COMPLETE/PASS` `MB-003:e11774421776f289` and the
original `BLOCKED` finding `MB-003:972dd415607db28b`.

### 8.7 What would unblock MB-003

1. **Alien runs the same probe** on its own host and leaves its receipt (one
   `detect→submit→progress→result` chain with an installed, donor-supported provider). If Alien's
   host has no such runtime, the two-host clause needs an explicit **Owner rewrite**, exactly as
   `response-9-30.md` R7 did for MB-008.
2. Then §13's repair — merge `main`, migrate the §8.5 seams, resolve the shared control plane as
   union/superset — §14's two-host gate, `host-pass` finalize (MB-003 already has a real
   `MIGRATION_COMPLETE/PASS`), final CI and merge.

### 8.8 Step-3 judgment calls (unspecified options, recorded)

**B1 — reusing the host's already-authorised API key for the probe.**
*Problem:* the donor runtime refused to start with `MISSING_CREDENTIAL`; the host holds the key under
`DeepSeek_API` while the dsh route reads `DEEPSEEK_API_KEY`. Mapping it is a credential decision the
order does not spell out. *Judged:* allowed, and required — order §12 priority 4 explicitly lists
"使用当前已授权 session/API 配置", and §12's BLOCKED escape hatch applies only when a user-unique
MFA/new login is needed **and** the existing session is unusable. Here an authorised key already
exists. The value was passed to the child process only, never printed, never written to a log, and
the driver asserts the absence of key material in every record and job log. *Not done:* no new
credential was created, requested or stored.

**B2 — was the earlier `BLOCKED` finding wrong?**
*Problem:* the order says to preserve the old no-provider blocker; but the probe found a real
provider path, so preserving it verbatim would now be false. *Judged:* correct the **environment
fact** loudly (§8.2) while keeping the original finding in the record and in the mission timeline
(`MB-003:972dd415607db28b`) as a historical entry. Rewriting history was never an option; leaving a
now-known-false blocker standing unchallenged was also not.

**B3 — whether to run §13's code repair anyway.**
*Problem:* Mech has a lawful environment, so §13's stated precondition arguably holds; but the
Mission cannot be completed because Alien's half is unobtainable. *Judged:* **do not write the
repair.** The mission-level environment is incomplete, so the repair could never pass the required
gate or be merged, and the order's §18 forbids accepted capability living only on an unmerged branch.
Instead the seam is mapped in full so the next session can execute it directly. This is recorded as a
deliberate choice, not an omission.

**B4 — whether to record `RUNTIME_PASS` for a half-satisfied gate.**
*Problem:* Mech's chain genuinely passed, but the Mission gate does not. Recording the event risks
being read as the gate passing; omitting it understates real, reproducible evidence. *Judged:*
record it, with a summary that states in the first sentence that it is **one host's** receipt and
that the gate is **not** met. The evidence is too valuable to hide, and the scoping is explicit.

**B5 — progress granularity.**
*Problem:* the driver's first `PROGRESS_OBSERVED` check was a fixed short window and reported
`false`, because the `dsh` headless profile buffers its answer to completion. Loosening the check
would have been dishonest. *Judged:* measure across the job's whole life and record the **true**
granularity — job liveness plus the per-task log, not token streaming — as a property of the
donor-backed runtime. The verdict is true without overclaiming.

**B6 — three driver bugs found while writing a throwaway probe.**
*Problem:* the driver hit the migrated APIs' real shapes three times (`kind` must be one of the four
`RUNTIME_KINDS`; the injected `now` returns an ISO **string** for `checkedAt`; the breaker is a
**bound** object whose options nest under `options`). *Judged:* fix the driver, never the migrated
module, and record the real API shapes here so the next session does not rediscover them. Same
discipline as MB-008's V2.


1. **Alien runs the same probe** on its own host and leaves its receipt (one
   `detect→submit→progress→result` chain with an installed, donor-supported provider). If Alien's
   host has no such runtime, the two-host clause needs an explicit **Owner rewrite**, exactly as
   `response-9-30.md` R7 did for MB-008.
2. Then §13's repair — merge `main`, migrate the §8.5 seams, resolve the shared control plane as
   union/superset — §14's two-host gate, `host-pass` finalize (MB-003 already has a real
   `MIGRATION_COMPLETE/PASS`), final CI and merge.
