# MB-003 — Worker Gateway (Boss/Hns union) — VERIFICATION REPORT

> Status: **BLOCKED** — the Mission's first Verification gate cannot be satisfied on this
> host, and the Mission forbids substituting a mock for it.
> Verification Host: `Mech`
> Claimed at: `2026-09-29T15:05:00Z` (City `39d1c7f`)
> Migration Host: `Alien` (different host, as rule 5 requires)
> Reviewed migration branch: `mission/MB-003-worker-gateway` @ `c5734a5e646f1e379aa15282b59a08e8828d5d6a`

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
