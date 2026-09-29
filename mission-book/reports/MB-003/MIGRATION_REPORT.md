# Migration Report — MB-003

```text
MISSION = MB-003
ROLE = MIGRATION
HOST = Alien
CLAIM_COMMIT = 5e69ebf0e366835547eb3c36e596937fe58565ec
DONOR_BASELINE = zhiheng-zhang-Mera/Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080
                 zhiheng-zhang-Mera/DS-Hns   @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b
IMPLEMENTATION_BRANCH = mission/MB-003-worker-gateway
IMPLEMENTATION_HEAD = aff3c283e34b596c6c0ba6c666aed96893b6c395
IMPLEMENTATION_CI = 36570163616 PASS (gateway-web + android)
MIGRATION_HEAD = c5734a5e646f1e379aa15282b59a08e8828d5d6a
MIGRATION_CI = 36571564418 PASS (gateway-web + android)
MIGRATION_COMPLETE = true
```

The implementation SHA carries the migration itself; the migration head is that tree plus
the two closing process-event commits, whose only content is
`data-records/evolution/inbox/mission-book/MB-003/events.jsonl`. Both SHAs were run through
the required CI and both are green, so the recorded head is not an unverified tree. The
claim-stage push `590d041c4398c11f53dce9c821a2c0c44d508edd` was also green (run
`36567419904`).

Sections 4 and 5 are the required record of the questions this mission did not answer for
itself, the choice made, and why. Section 7 lists what a verifier should attack first.

---

## 1. 落地边界 / Landing boundary

Target building: **`city/02-engineering/02-worker-gateway`** — an EXISTING building that
already owns the migrated `skill-intake` module. `skill-intake` was not read, wrapped,
re-exported or forked; the three new modules are siblings.

| Module | Donor source (frozen SHAs above) | Tests |
| --- | --- | --- |
| `worker-task-contract` | DS-Hns `app/extensions/mega/scheduler/lifecycle.js` | 23 |
| `provider-adapter` | Codex-Boss `electron/runtimes/runtime.ts`, `electron/runtimes/unsupported-runtime.ts`, `electron/runtimes/web/provider-runtime-adapter.ts`, `src/shared/provider-state.ts` | 29 |
| `provider-resilience` | Codex-Boss `electron/commander/circuit-breaker.ts`, `src/shared/provider-outcome.ts` | 42 |

94 new module tests. Every module carries a `DONOR.json` naming its donor paths, adaptation,
known differences, parity vectors and a four-way classification; all three declare
`UTOPIA_EXTENSION: []` — nothing was invented.

- **Preserved behavior** (every vector is asserted in that module's tests; the full list is
  in its `DONOR.json`)

  - `worker-task-contract`: the canonical terminal vocabulary (`COMPLETED`, `FAILED_FINAL`,
    `CANCELLED`) and the backward-compatible persisted vocabulary (`FAILED`⇒`FAILED_FINAL`,
    `CANCELED`/`INTERRUPTED`⇒`CANCELLED`); `persistedStatusFor`'s `fallback = 'CANCELED'`
    default and its INTERRUPTED special case; `truncate`'s single-space collapse and its
    `max-1`-characters-then-ellipsis rule; `taskDisplayName`'s fallback ladder in order;
    `errorSummary`'s `code: message` join with a never-throwing JSON fallback;
    `shortResult`'s `Xs` / `Xm Ys` / `Xh Ym` formatting and its null cases;
    `terminalEpoch`'s `Math.trunc` and 0 fallback; `terminalKey`'s `<id>#<state>#<epoch>`
    idempotency key; and `buildTerminalEvent`'s full payload shape including the
    null-vs-zero distinctions and the `source` defaulting rule. A read-only differential
    harness compared the donor source against the port over **885 comparisons with 0
    mismatches**.
  - `provider-adapter`: exactly one of the ten availability values is available (`AVAILABLE`;
    every other value including `UNKNOWN` is not); the unsupported-runtime refusal
    (`UNSUPPORTED` health, `PERMANENT_FAILURE` execute, `code: UNSUPPORTED`,
    `retryable: false`); the `web:` id-prefix rule and its exact error message; the
    all-seven-role default merged with a partial override; and `stateForRecovery`'s
    AUTO/PAUSED action sets, default reasons, `autoResume` values and the
    `retryAt`-only-when-defined rule.
  - `provider-resilience`: the breaker's state derivation (absent ⇒ `CLOSED`; a stored
    `OPEN` whose cooldown has elapsed is reported `HALF_OPEN`), `admit`'s at-most-one
    HALF_OPEN probe, `observeFailure`'s three branches including "a long outage must not
    extend the cooldown forever" and the fresh cooldown after a failed probe,
    `cancelProbe`, `reset`, `list`, the option clamps (1..20 and 1..604800000, throwing on a
    non-integer), `providerTechnicalInterruption`'s exact six-kind set, and the whole of
    `provider-outcome.ts` — which the survey proved is import-free and was therefore ported
    whole, including the donor's own A02–A08 acceptance cases.

- **Explicitly not migrated** (all recorded in the modules' `DONOR.json`)

  - DS-Hns `mega/scheduler/gate.js` (`decideTask`), `dsh-runner.js` and `scheduler.js`. The
    first is the peak-price/scheduled-start gate (scheduling policy, which belongs to a
    different City building); the second is the real `child_process` spawn seam; the third
    is the queue, and it imports the Electron-coupled DeepSeek session client, so that plane
    cannot be ported without Electron.
  - DS-Hns's **real** adapter plane, which the survey found is *not* under
    `app/extensions/mega/**` at all but under `app/core/plugin-adapters/**`, plus
    `app/sub-worker/**`, `app/engineering/**` and
    `app/core/{capability-registry, work-admission, health-supervisor}`. This is a
    deliberate scope decision, not an oversight — see D1 and D6.
  - Codex-Boss's `codex-cli-runtime.ts` and `process-gateway.ts` (both spawn
    `child_process` directly; `process-gateway` does not accept an injected spawn), the
    runtime registry/supervisor, `execution-supervisor.ts`, `scheduler.ts`, `task-ledger.ts`
    (fs), provider sessions and multi-runtime role routing.
  - Breaker persistence (`durable-json` plus `<userData>/.boss/circuit-breaker.json`).
    Snapshots are accepted and returned instead; the caller persists them.
  - The donor clock defaults: every clock is an injected parameter in all three modules.

- **Contract / interface boundary**

  Exported pure functions over plain serializable values — no fs, no network, no Electron,
  no `process.env`, no ambient I/O. The one deliberate interface adaptation is the injected
  clock (`buildTerminalEvent`'s `now`, `stateForRecovery`'s `now`, `createCircuitBreaker`'s
  `now` option, `unsupportedRuntime`'s health clock).

- **Existing Utopia UI / real-consumption path**

  `services/capability-bridge/bridge.mjs` — the capability-bridge invocation path that Web
  and Android drive, and whose per-capability degradation state is already surfaced as
  `bridgeState: 'DEGRADED'` in the descriptor list both clients read. The bridge no longer
  keeps an ad-hoc `Set` of degraded capabilities; the decision is the migrated
  `provider-resilience` breaker's, with Utopia's policy supplied as data:
  `failureThreshold: 1`, `cooldownMs: 604800000` (the donor's own maximum), and only
  `ENGINE_UNAVAILABLE` / `ADAPTER_UNAVAILABLE` counting as provider-technical.
  `tests/capability-bridge.test.mjs` drives a real bridge over a real store and proves the
  bridge satisfies the Core, that a capability-wide `EXECUTION_TIMEOUT` does **not** degrade
  anything, that further work is refused with `BRIDGE_PENDING`, and that unrelated
  capabilities are unaffected. No new UI was built.

---

## 2. 测试与运行 / Tests & runtime

- **Unit / contract / parity**: 94 module tests. Full CI-equivalent suite on this branch:
  `pnpm test` 59/59, `apps/rooms` 67/67, `node city/test-all.mjs` 224/224,
  `node scripts/verify-promotion-history.mjs` 10 records verified, `pnpm check:docs`
  `PAIR_STATUS = SYNCHRONIZED` for docs, evidence and data-records.
- **Real consumption**: `tests/capability-bridge.test.mjs :: the per-capability degradation
  latch is owned by the migrated provider-resilience breaker`.
- **Failures encountered**: two real ones, recorded as `TEST_FAIL`
  (`MB-003:c9c85a3e92400626`).
- **Repairs applied** (`MB-003:f2f3a6a4cfca830d`): see D2, D7 and D8.
- **Known limitations**: see section 6.

---

## 3. Utopia 狗粮 / Evolution handoff

- **Evolution inbox**: `data-records/evolution/inbox/mission-book/MB-003/events.jsonl`.

  | Event | Type | Outcome |
  | --- | --- | --- |
  | `MB-003:2601002ceb746040` | MISSION_CLAIMED | INFO |
  | `MB-003:afed539995d4cafd` | ATTEMPT_STARTED | INFO |
  | `MB-003:9e64b7243894d765` | CHANGE_APPLIED | INFO |
  | `MB-003:c9c85a3e92400626` | TEST_FAIL | FAIL |
  | `MB-003:f2f3a6a4cfca830d` | REPAIR_APPLIED | REPAIRED |
  | `MB-003:1234899648b27632` | TEST_PASS | PASS |
  | `MB-003:c3573e8b28930659` | RUNTIME_PASS | PASS |

  `CI_RESULT` and `MIGRATION_COMPLETE` are appended by the same host once the hosted run
  settles; the head above is the branch head before that append, which adds process data
  only.
- **Candidate evidence**: nothing published to `evidence/raw/mission-book/MB-003/`.
- **`.runtime` evidence** (git-ignored, this host):
  `.runtime/evidence/mission-book/MB-003/run-001/` holds `WORKING_STATE.md` (the durable
  handoff note written while the ports ran) and the two donor survey reports with their
  read-only analysis scripts. The full per-file coupling survey is
  `provider-adapter-layer-report.md` (440 lines).

---

## 4 & 5. 施工中的问题、选择与判断逻辑 / Problems, choices and the reasoning

**D1 — Where is DS-Hns's provider/adapter layer?**
*Problem:* the mission names DS-Hns as the primary donor but does not say where in it.
*Choice:* port the mission-named **Hns worker/task contract** from
`app/extensions/mega/scheduler/lifecycle.js` (a dependency-free, self-contained
task-lifecycle and terminal-event contract) and take the provider-adapter behaviour from
Codex-Boss; **defer** DS-Hns's `app/core/plugin-adapters/**`, `app/sub-worker/**` and
`app/engineering/**`. *Why:* the survey proved DS-Hns's real adapter plane is not under
`mega/**` at all, and that it is CJS fused to a plugin lifecycle whose closure escapes into
`child_process`, `electron`, `node:net`, `fs`, `powershell.exe` and the computer-use domain —
while `lifecycle.js` is explicit that it is dependency-free and is exactly what the
mission's "Hns worker/task contract" names. *Cost:* MB-003 ships less of DS-Hns than the
phrase "Hns 为主" might suggest. That is stated rather than glossed; D6 records what a
follow-up would need. Also relevant: DS-Hns refuses exactly **one** capability (`vision`)
and degrades everything else, so a refusal layer taken from DS-Hns would have been thin.

**D2 — The City manifest's `capabilityProvider` flag.**
*Problem:* adding three modules to `02-engineering` (a **domain** district) made the
capability registry advertise them to Web and Android as `inputKind: 'unavailable'`
capabilities "awaiting a bridge" — a claim about a product surface that does not exist.
*Choice:* add a **module-level** `"capabilityProvider": false`, validated in
`city/manifest.mjs`, and have `services/capability-bridge/registry.mjs` skip such modules.
*Why:* the modules are adapter infrastructure; the registry's rule ("every manifest module
without an adapter is an unbridged capability") is right for a domain module and wrong for
this. The alternative — editing the two count assertions — would have left the pollution in
the product surface. Supporting evidence: with the flag, every pre-existing assertion in
`tests/capability-registry.test.mjs` and `tests/capability-adapters.test.mjs` passes
**untouched**. *Cost:* a new manifest field, and a divergence from MB-001 — see D3.

**D3 — ⚠ MB-001 and MB-003 solved the same problem two different ways, from the same base.**
Both missions branch from `c7ef3cd` and both extend
`city/CITY_IMPLEMENTATION_MANIFEST.json`, `city/tests/manifest.test.mjs` and
`city/docs/{en,zh-CN}/ARCHITECTURE.md`. MB-001 added a **district-level**
`"kind": "infrastructure"` and made the registry skip infrastructure districts; MB-003 adds
a **module-level** `"capabilityProvider": false`. MB-003's modules live inside a domain
district, so MB-001's mechanism cannot cover them; MB-001's modules are an entire
infrastructure district, so MB-003's flag would also work there.
*Consequence for the Owner:* whichever of the two merges second must reconcile them —
preferably by generalising to the module-level flag and retiring the district-level `kind`,
or by documenting why both exist. *This is a finding about the mission-book's own design:*
missions branch from `main` and edit shared city files, so manifest/census/doc conflicts are
structural, not accidental. Neither mission's report could prevent it; only the merge order
or an Owner ruling can resolve it.

**D4 — Only one of the three modules could be consumed without inventing semantics.**
*Choice:* consume `provider-resilience` in the capability bridge; land
`worker-task-contract` and `provider-adapter` with parity tests and record them as
**landed-but-not-yet-consumed boundaries**. *Why, concretely:*
- `worker-task-contract` — the gateway's terminal set is `['COMPLETED','FAILED',
  'CANCELLED']`; the donor's `TERMINAL_STATUSES` is a **superset** (it also holds
  `FAILED_FINAL`, `CANCELED`, `INTERRUPTED`). Swapping `terminal.includes(state)` for
  `isTerminalStatus(state)` would change how a *legacy* persisted state is treated after a
  restart, so it is not an equivalence-preserving rewiring. Terminal events are also already
  emitted at most once, so wiring `terminalKey` idempotency would be dead code. The display
  and notification helpers have no consumer in Utopia (there is no notification surface),
  and adding one is forbidden by MB-003's exclusion list and by rule 14.
- `provider-adapter` — its vocabulary (`RuntimeAvailability`: AVAILABLE / BUSY /
  AUTH_REQUIRED / RATE_LIMITED / BUDGET_EXHAUSTED / PAGE_CHANGED / USER_ACTION_REQUIRED /
  UNSUPPORTED / DOWN / UNKNOWN) does not match the bridge's `bridgeState` (AVAILABLE /
  DEGRADED / BRIDGE_PENDING / UNAVAILABLE). Mapping one onto the other would invent a
  translation table, which is exactly what `MIGRATION_ONLY` forbids. The independent survey
  reached the same conclusion and said so plainly.
  *Cost:* two of three modules ship without a consumer.

**D5 — Is a mechanism rewiring "real product consumption"?**
*Problem:* the independent survey judged that circuit breaking "maps onto nothing" in
Utopia's product surfaces — true if you look for a *feature*. The bridge does, however,
already make exactly this decision, as a `Set`.
*Choice:* treat the consumption as a **mechanism rewiring of an existing behaviour**, with
Utopia's policy supplied as data, and say so explicitly rather than claiming a new feature.
*Why it is exactly equivalent:* a degraded capability is refused **before dispatch**
(`bridgeState !== 'AVAILABLE'` ⇒ `BRIDGE_PENDING`), so no invocation can ever succeed on a
degraded capability, so `observeSuccess` is never called, so the breaker can never return to
`CLOSED`. The permanent latch is reproduced without approximation, and
`cooldownMs = 604800000` (the donor's own maximum, since the donor clamps at 7 days) means
HALF_OPEN is unreachable inside any gateway process lifetime regardless. The test asserts
the equivalence and that an unrelated capability is unaffected. *Cost:* the reviewer must
accept that "consumption" here means "the Core owns the decision", not "a new screen
appeared".

**D6 — Deferred donor surface, recorded so it is not rediscovered.**
DS-Hns's `app/core/plugin-adapters/**` (25 files, no third-party imports; a format-agnostic
pure registry and an injected-spawn supervisor), `app/sub-worker/**` (a 13-state worker
protocol with `unsupported_capability` among its result statuses and a pure
`permissions.cjs`), `app/engineering/**` — whose `verifyResume` plus `computePlanDigest` is
the only real checkpoint/resume in either donor and lands on Utopia's already-persisted but
currently **unvalidated** `task.lastCheckpoint` blob — DS-Hns `contracts/capability.cjs`
(34 capabilities each carrying an honest "what happens without it" sentence), and
`autonomy/{progress-observer,result-validator}.js`. Each would be a coherent follow-up
mission; none was migrated here because each needs its own boundary decision.

**D7 — Repairing by fixing the registry, not the assertions.**
*Choice:* when the three new modules broke the capability count assertions, add the
`capabilityProvider` flag rather than editing the assertions. *Why:* the assertions were
correct; the product surface was wrong. *Honest note:* MB-001's equivalent failure was
repaired the other way (id-scoped assertions) because there the new modules were kernel
rather than capability concerns; both repairs removed the assumption the change invalidated,
and neither weakened an assertion.

**D8 — A genuine API trap in the ported breaker.**
*Problem:* the first consumption attempt called the module's **standalone** exports
`state(breaker, id)` / `observeFailure(breaker, id)` with the object
`createCircuitBreaker(...)` returns. Those accessors expect a *snapshot core*, not the live
breaker, so every request through the bridge threw
`TypeError: Cannot read properties of undefined (reading 'get')`. The module's **bound**
methods (`breaker.state(id)`, `breaker.observeFailure(id)`) are the stateful API and are
what the bridge now uses. *Why it is recorded:* this is a sharp edge in an otherwise clean
module — a caller reading the exports will reach for the standalone names and get a runtime
TypeError rather than a clear contract error. The module's own 42 tests pass because they
exercise the bound API. A verifier may reasonably ask for either a guard in the standalone
accessors or a rename that makes the snapshot requirement obvious; that is a repair inside
MB-003's boundary and is left to the verification host to judge.

**D9 — Test coverage the verifier should not assume.** The survey found, and this report
passes on rather than repeats as fact: Codex-Boss's `progress.ts` and `execution.ts` have
**no donor test at all**, `worker-response.ts` has two cases, and **no donor test file
imports `unsupported-runtime.ts`** — the refusal class was untested in the donor. The port's
own tests are therefore the first real coverage of that behaviour. Conversely DS-Hns's
checkpoint/resume has the strongest donor coverage in either repository (26 + 22 + 7 cases),
which is part of why D6 flags it as the highest-value follow-up.

**D10 — Environment and tooling facts.** `pnpm` is not on `PATH` on this host; the pinned
CI version is reachable as `corepack pnpm@11.19.0`. `pnpm mission:event -- --mission ...`
forwards a literal `--` to the script and fails; the working form is
`pnpm mission:event --mission ...`. `node --test <dir>` is not accepted by this Node build;
test files must be named or globbed.

---

## 6. 已知限制 / Known limitations

1. `worker-task-contract` and `provider-adapter` have **no product consumer** (D4). If the
   verifier judges that MB-003 requires all three to be consumed, this migration is not
   complete.
2. The consumption in D5 is a **mechanism** rewiring, not a new product surface. A reviewer
   who requires a user-visible behaviour change will not find one, because inventing one is
   forbidden by the mission.
3. **MB-001 and MB-003 will conflict at merge time** (D3) — same manifest, same census test,
   same bilingual docs, two different mechanisms for the same concern.
4. The breaker's persistence is deferred, so a gateway restart starts from a clean breaker.
   That matches the ad-hoc `Set` it replaced, which was also process-local.
5. DS-Hns's real adapter plane, worker protocol and checkpoint/resume verification were
   **not** migrated (D1, D6), so MB-003 covers less of the DS-Hns donor than its billing as
   the primary donor implies.
6. The **Verification gate for this mission requires a real provider path** —
   detect→submit→progress→result/unsupported with an installed, donor-supported provider —
   and it explicitly forbids a mock pass ("环境缺失则任务 BLOCKED，不得 mock pass"). The
   migration host did not attempt that gate; the verification host must establish whether
   such a provider is installed on its machine. If it is not, that gate is BLOCKED and must
   be reported as such rather than simulated.
7. The Android lane was green but every Gradle task was **UP-TO-DATE** — nothing under
   `apps/android/**` changed, so this is "unaffected and green", not a fresh compile of a
   changed input.
8. The hosted CI result is recorded in `IMPLEMENTATION_CI`; the branch was not merged to
   `main`, as the mission-book requires of the migration host.

---

## 7. 交给验证主机 / Handoff to verifier

Independent-review hints only; no conclusion is suggested.

- `city/02-engineering/02-worker-gateway/*/DONOR.json` — the declared boundary per module,
  including every `DEFERRED` item.
- `city/tests/manifest.test.mjs` — the census and the mission-incubation provenance
  contract.
- `services/capability-bridge/bridge.mjs` (the import, `PROVIDER_TECHNICAL_ERROR_CODES`,
  `CIRCUIT_COOLDOWN_MS`, the `circuit` binding) and `tests/capability-bridge.test.mjs` — the
  real-consumption claim (D5).
- `services/capability-bridge/registry.mjs` and `city/manifest.mjs` — the
  `capabilityProvider` flag (D2) and its validation.
- `city/02-engineering/02-worker-gateway/provider-resilience/circuit-breaker.mjs` — the D8
  API trap; check whether the standalone accessors should guard their input.
- `city/docs/{en,zh-CN}/ARCHITECTURE.md` §7 — the documented reconciliation of D2 and D5.
- `city/CITY_IMPLEMENTATION_MANIFEST.json` versus MB-001's branch — the D3 conflict.

- Verification must be performed by a **different host**. This host (`Alien`) has
  participated in MB-003 and may not claim its Verification stage.
- Branch HEAD: `aff3c283e34b596c6c0ba6c666aed96893b6c395` on
  `zhiheng-zhang-Mera/utopia`, branch `mission/MB-003-worker-gateway`.
- The migration host did **not** merge, and did **not** run `pnpm mission:finalize`.
