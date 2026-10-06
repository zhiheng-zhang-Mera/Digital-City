# EM-002 Development Report — Connector Adapter Framework + Generic Managed-Process Runtime

```text
MISSION                  = EM-002 (Engineering Manager programme, task 2 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 051ae09 (Digital-City main, "claim(EM-002): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T12:57:30Z
CONTROL_REVISION_AT_CLAIM= 7129082 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DONOR_POLICY             = DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b pinned but NOT read; no build/runtime dependency
IMPLEMENTATION_BRANCH    = engineering-manager/EM-002-connector-adapter-process-runtime
IMPLEMENTATION_HEAD_SHA  = 4e71558a9fc44a15a209eef4d711d8d90f90933b
BRANCH_CI                = 36718724624 — gateway-web success, android success
LOCAL_CHECK_SUMMARY      = 115/115 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

| File | Purpose |
|---|---|
| `contracts/engineering-connector-v1/manifest.mjs` | Connector manifest vocabulary (runtime kind, capabilities with declared methods, proposed needs, bounded limits, provenance), strict validation with no credential slot, permission mediation, invocation authorization |
| `contracts/engineering-connector-v1/pipeline.mjs` | detect → select → adapt → validate → standardize → unify with per-adapter fault isolation and pipeline-written provenance |
| `contracts/engineering-connector-v1/runtime.mjs` | Generic managed-process runtime: bounded startup, heartbeat freshness, invoke, stop, bounded restart budget with terminal safe mode, bounded logs with caller-policy redaction, provenance |
| `contracts/engineering-connector-v1/index.mjs` | Public surface + published guarantees |
| `contracts/engineering-connector-v1/tests/conformance.test.mjs` | 14-test conformance suite |
| root `tests/engineering-connector.test.mjs` | Registers the suite with `pnpm test` |

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| one malformed connector cannot prevent other connectors from loading | `one malformed connector cannot prevent another connector from loading` (throwing detector, non-object detector answer, malformed manifest — all become recorded failures while the healthy connector loads) |
| generic process runtime hosts at least two synthetic connector manifests with different capabilities | `the runtime hosts two synthetic connectors with different capabilities`; `loading two synthetic connectors with different capabilities needs no core change` |
| undeclared capability/method calls are refused | `undeclared capability or method calls are refused` (contract) + `CAPABILITY_NOT_DECLARED` across instances (runtime) |
| restart attempts are bounded and terminal safe mode exists | `restarts are bounded and exhaustion is a terminal safe mode` |
| logs/output are bounded and secrets can be redacted by the caller policy | `logs are bounded by the manifest and redactable by caller policy` |
| adding a synthetic connector requires registration/manifest code, not a Foreman-core conditional | `loading two synthetic connectors … needs no core change` (selection is a declared rule, proven by a third adapter winning on score) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.**
Choice: EM-002. Reason: the fresh scan found no owned repair and no eligible opposite-host Correction (BA-003's correction belongs to Alien, RF-002 Development was in progress by Alien), so the unclaimed-Development tier applied. EM is the largest pool (13 of 41 tasks, only EM-001 complete) and no other host was working in it, and EM is a different programme from my previous claim (BA), which the tie-break prefers.

**D2 — Cross-branch discipline.**
Problem: EM-001's contract package (`contracts/engineering-manager-v1/`) is on an unmerged sibling branch from the same frozen baseline, so it cannot be imported and must not be copied.
Choice: EM-002 declares its own connector manifest/pipeline/runtime contract and records the seam: at merge, the manifest and pipeline must satisfy EM-001's `ConnectorPort` and connector envelope shapes. Recorded so the merge is a deliberate binding rather than an accidental fork.

**D3 — How fault isolation is implemented.**
Options: (a) one try/catch around the whole pipeline; (b) guard every adapter call and treat bad output as data.
Choice: (b). `guardStage` wraps each stage, and invalid output *shapes* are checked explicitly (a detector must answer `{matched: boolean}`; a validator must answer `boolean` or `{ok: boolean}`). Each failure records `{stage, adapter_ref, code, detail}` and the pipeline continues. Reason: (a) would let the first broken connector abort every later one, which is exactly the acceptance line this task exists to satisfy. `ADAPTER_INVALID_OUTPUT` is a first-class code for "the adapter answered, but not in a way anyone can use", distinct from "the adapter threw".

**D4 — Selection as a declared rule.**
Problem: choosing an adapter per connector is where a "foreman-core conditional" would normally creep in.
Choice: one declared rule — highest `score`, then `adapter_ref` order — applied identically to every adapter, with a test proving a third adapter wins on score without any pipeline change. Reason: this is the acceptance line "adding a synthetic connector requires registration/manifest code, not a Foreman-core conditional" made structural rather than promised.

**D5 — Provenance ownership.**
Options: (a) trust the adapter's own provenance; (b) have the pipeline write it.
Choice: (b): after standardization the pipeline overwrites `manifest.provenance` with the observed detection evidence, the selected adapter reference and the winning runtime kind. Reason: an adapter that could write its own provenance could claim a different adapter or different evidence, which is the one field a reviewer must be able to trust.

**D6 — Manifest strictness and the "no raw secret" rule.**
Problem: my first test draft assumed a `credential_ref` slot was legal on a manifest.
Choice: no credential slot exists at all. Every object in the contract is strict, so a credential/secret-shaped field is refused as an undeclared field; the recursive secret scan is kept as defence in depth for any future permissive field. Reason: a manifest *declares needs*; the credential handle belongs to the platform credential store, not to the worker declaration. The test was corrected to match the design rather than the design loosened to match the test — recorded because it is a case where development changed its own mind.

**D7 — Permission mediation is an intersection.**
Choice: `effective = declared ∩ granted`; a grant for an undeclared need is refused outright (`UNDECLARED_NEED_GRANT`), and a declared need nobody decided is reported as `undecided` rather than silently treated as granted or refused. Reason: an adapter must never be able to widen policy, and policy must never be able to widen an adapter's declaration; "undecided" must stay visible so the operator can answer it.

**D8 — Where undeclared invocations are refused.**
Choice: in `authorizeInvocation` before the process is touched (`CAPABILITY_NOT_DECLARED`, `METHOD_NOT_DECLARED`, `UNDECLARED_NEED_GRANT`), with the runtime test also proving capabilities do not leak between two hosted instances. Reason: refusing after spawning would already have executed a side effect the declaration never covered.

**D9 — Process port is injected.**
Choice: `createManagedProcessRuntime({ spawnProcess })` requires a port; the suite uses `createProcessPortDouble`. The module never imports `node:child_process`. Reason: tests stay hermetic and deterministic — "bounded startup" is decided by the port's `ready` answer against the manifest's `startup_timeout_ms` budget, so no wall-clock waiting or timer flake is involved, and a real host injects the real spawner unchanged.

**D10 — Restart budget semantics.**
Choice: attempts increment before the check, a *failed* restart also consumes budget, and exhaustion enters a terminal `SAFE_MODE` that refuses start/invoke/restart; clearing it requires an explicit `operatorRef` and resets the budget. Reason: a crash loop must not spin, and "terminal" must mean terminal — an automatic cooldown would make the safe mode a delay rather than a stop. The operator action is recorded with its actor.

**D11 — Log bound behaviour.**
Choice: bytes are tracked against `limits.max_log_bytes`; the current entry is truncated and the store reports `truncated: true`; once full, further appends are refused with `appended: false`. Reason: silently discarding output would be the false-success pattern the programme forbids — the caller can always see that the log is incomplete.

**D12 — Redaction timing.**
Choice: caller policy (`{patterns, replacement}`) is applied at *write* time, so un-redacted text never enters the store; a thrown or failed invocation logs a coded message rather than raw process output. Reason: redacting on read leaves secrets in memory and in any later dump.

**D13 — Donor policy.**
Choice: DS-Hns was **not** read, cloned or fetched; nothing in this branch references it. Reason: the workbook pins it as a donor but does not require reading it, and the runtime here is written from the workbook's own requirements. Recording the absence matters because the workbook names the donor and a later reader should not assume a provenance link exists. Codex-Boss was not accessed in any form.

**D14 — PROCESS_DATA_POLICY evolution inbox.**
Choice: not used, consistent with EM-001 D13, BA-001 D11, BA-002 D13, BA-003 D12, GAI-001 D10, RF-001 D8.

## 3. Test summary

14 tests, all passing: manifest declaration and closed vocabularies; no credential slot and nested secret scanning; permission mediation as intersection with undeclared-grant refusal and visible undecided needs; invocation authorization (capability, method, ungranted need); the six-stage pipeline with pipeline-written provenance; four fault-isolation shapes across three broken adapters with a healthy connector still loading; two synthetic connectors loaded without a core change plus score-based selection; two hosted instances with different capabilities and no leakage between them; bounded startup on a never-ready process; a failing spawn and a failing invocation surviving as data; heartbeat freshness against the manifest interval with recovery; bounded restarts ending in terminal safe mode and explicit operator clearing; bounded logs with write-time redaction; honest unknown-instance and stopped-instance behaviour.

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 115 tests, 115 pass, 0 fail (101 baseline + 14 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail (7 skipped as in baseline) |
| `corepack pnpm check:docs` | docs/evidence/data-records PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36718724624 on 4e71558a9fc44a15a209eef4d711d8d90f90933b | gateway-web success, android success |

## 5. Integration seams handed to sibling tasks

- EM-001 (core contracts): this branch's manifest/pipeline/runtime must be bound to `ConnectorPort`, `ConnectorDescriptor`, `ConnectorInstance`, `CapabilityManifest` and `AuthStatus` at merge. Mapping needed: `connector_kind` ↔ `ConnectorDescriptor.connector_kind`; `capabilities[].methods` ↔ connector `capabilities()`; `permission` result ↔ `AUTH_STATUS_SPEC` where relevant.
- EM-004 (capability/probe/auth registry): `mediateConnectorPermissions` and `authorizeInvocation` are the policy seam; the registry supplies `policyDecision`, never grants.
- EM-009 (health/restart/recovery): `checkHealth`/`restart`/`safe_mode` are the runtime side; health *pressure* may request recovery, but this runtime owns only its own restart budget.
- EM-010 (queue/DAG/worker pool): the runtime hosts one instance per connector; pool-level resource limits are EM-010's, and `limits.max_restarts` is deliberately connector-scoped.
- EM-011/EM-012 (reference connectors and connector SDK): a connector is a manifest + a registered adapter; the SDK surface is `registerAdapter`, `runAdapterPipeline` and `createManagedProcessRuntime`. A real host injects `child_process.spawn` through the process port.
- GAI/RF: nothing here touches transport, device placement or provider login — deliberately out of scope per the workbook.

## 6. Open items for the Correction host / Owner

1. Adversarial review should try to escape fault isolation (an adapter mutating shared state, a detector that never returns, an adapter whose `standardize` returns a manifest naming another adapter's provenance), to execute an undeclared invocation, and to keep a restart loop running past the budget.
2. Confirm D6 (no credential slot on a manifest at all) and D11 (appends are refused once the log budget is full, rather than dropping silently).
3. Confirm whether a future EM task should own a shared process port for the real host (this task injects it, but does not ship one).
4. Confirm whether an evolution/process-data record is wanted for EM component work (D14).

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
