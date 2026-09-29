# MB-001 — Codex-Boss Core OS — VERIFICATION REPORT

> Status: **IN PROGRESS**
> Verification Host: `Mech`
> Claimed at: `2026-09-29T15:30:00Z`
> Migration Host: `Alien` (different host, as rule 5 requires)
> Reviewed migration branch: `mission/MB-001-core-os` @ `a71bf9080294390a3e2c1482bb53930519d1b3b3`

## 0. Rule 9 ordering (read this first)

Mission rule 9 is explicit: the Verification Host **first** completes an independent
review from the donor, the target code, the diff, the tests and the runtime state, and
writes its findings down; **only then** may it read the Migration Report.

This document is therefore ordered that way. §1–§5 are the independent review and were
written without opening `reports/MB-001/MIGRATION_REPORT.md` or the migration host's
account. §6 is the first point at which the Migration Report is consulted, and it
records what the independent review found that the report did not say, and what the
report claimed that the independent review could not confirm.

## 1. What is being verified

The Mission migrates the City authority / runtime trust / global orchestration core out
of the Codex-Boss multi-purpose project into the Utopia `00/01 City Core` boundary.
Donor: `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`. Target path per the
Mission: `city/00-foundation/01-city-core`.

---

# PART A — INDEPENDENT REVIEW (§2–§5)

Written from the donor, the branch diff, the code and the running runtime only. The
Migration Report was **not** opened until §6.

## 2. What the branch actually contains

Reviewed revision: `mission/MB-001-core-os` @ `a71bf9080294390a3e2c1482bb53930519d1b3b3`.
Diff against the stated base `c7ef3cd`: **41 files, +6189 / −17**.

Four modules were created under `city/00-foundation/01-city-core/`:

| Module | Donor sources (per its own `DONOR.json`) |
|---|---|
| `root-authority` | Codex-Boss `src/shared/authority`/root-trust contracts, `guardian.ts` |
| `task-lifecycle` | Boss global task identity / lifecycle / durable state |
| `audit-ledger` | Boss decision ledger, guardian gate, recovery primitives |
| `fleet-routing` | `src/shared/fleet.ts`, `capability-router.ts`, `node-capabilities.ts`, `adaptive-routing.ts` |

Plus `city/manifest.mjs`, the City manifest, both ARCHITECTURE docs, the capability
bridge registry, **`services/dev-gateway/server.mjs`**, `tests/gateway.test.mjs`, and the
mission event stream.

## 3. Independent findings

### 3.1 Required gates pass on the reviewed revision — CONFIRMED

Executed by this host, on the branch, at `a71bf90`:

| Gate | Result |
|---|---|
| `pnpm test` | **60 / 60** |
| `node city/test-all.mjs` | **229 / 229** |
| `node --test apps/rooms/tests/*.test.mjs` | **67 / 67** |

### 3.2 The target path needs the same reading as MB-002/004/005 — NOT A DEFECT

The Mission names `city/00-foundation/01-city-core`, which is not itself in
`city/<district>/<building>/<module>` form. The branch resolves it as district
`00-foundation`, building `01-city-core`, and four modules beneath it
(`root-authority`, `task-lifecycle`, `audit-ledger`, `fleet-routing`). That keeps the
manifest's invariant, and each module carries flat-form provenance (`district`,
`building`, `cityPath`). This is the same reading MB-002, MB-004 and MB-005 adopted for
their own paths, so it is consistent across the queue rather than a local convenience.

### 3.3 The gateway rewiring is behaviour-preserving — CONFIRMED, and I checked it myself

`services/dev-gateway/server.mjs` replaces an inline node-claim predicate with a call
into the migrated Core:

```diff
-const ready=n.online&&n.capabilities.includes('task.execute.safe')&&n.capabilities.includes('filesystem.temp');
+const ready=acceptsWork(claimNodeFor(n),{requiredCapabilities:REQUIRED_TASK_CAPABILITIES});
```

I verified equivalence from the code rather than the test:

- `REQUIRED_TASK_CAPABILITIES = ['task.execute.safe','filesystem.temp']` — byte-identical
  to the two capabilities the inline predicate required.
- `claimNodeFor` maps `n.online ? 'READY' : 'OFFLINE'`.
- `acceptsWork` refuses when `FLEET_NODE_STATES_REFUSING_WORK` contains the state, and
  `contracts.mjs:49` defines that as `['FAILED','DISABLED','OFFLINE']` — so `OFFLINE` is
  refused, exactly as `!n.online` was.
- Then it requires `requiredCapabilities.every(...)` — the same conjunction.

So an offline node is refused whatever it lists, and a node missing either capability is
refused; everything else is accepted. **Equivalent, and the rewiring is explicitly
allowed**: MB-001's forbidden list does *not* prohibit gateway changes, and "接线"
(bounded real consumption wiring) is named in the Mission's `MODE=MIGRATION_ONLY`
allowances. It introduces no new authority policy, which is the thing that *is* forbidden.

**Finding to record, minor:** the new `tests/gateway.test.mjs` case derives its
expectation by calling the same `acceptsWork` it is testing (`coreSays(...)`) with a
**locally re-typed** `['task.execute.safe','filesystem.temp']`. That makes the assertion
circular — it cannot catch a wrong `REQUIRED_TASK_CAPABILITIES`, because the test's copy
would have to be wrong in the same way. The test's *runtime* half is nevertheless real and
valuable (a real gateway, real node registration, real claims, and observable gateway
responses: capable node placed, partial-capability node refused, silent node marked
offline and refused with its work left `QUEUED`). Recommended repair: have the test import
the constant rather than restate it, and assert the gateway's response against fixed
expectations instead of against `acceptsWork`.

### 3.4 Provenance ledgers are present and traceable — CONFIRMED

Each module carries a `DONOR.json`. I inspected `fleet-routing`: `repository`
`zhiheng-zhang-Mera/Codex-Boss`, `commit` `8df428e…`, four `sourcePaths` naming exactly
the four donor files, a per-donor-path `portedFiles` map, **10 PARITY** vectors stated as
observable rules, **6 PORT_ADAPTATION** entries, and **7 DEFERRED** entries.

The DEFERRED list is honest rather than decorative: it names the provider/fleet runtime,
heartbeat transport, connection registry, assignment/checkpoint persistence, the
scheduling loop and retry timers, provider-brand automation, the learned reranker and
profile store, and node state-machine transitions and cost accounting. Those are genuinely
absent, and their absence is declared rather than silently implied.

**Finding to record, minor:** the ledger shape is **flat** (`repository`/`commit`/
`sourcePaths` at the top level) whereas MB-002, MB-004 and MB-005 used a `donors[]` array.
Both are readable and each is internally consistent, but a machine reader written against
one shape will not read the other. Worth normalising before more Missions land.

### 3.5 What I could NOT confirm from the independent review

- **Donor parity is claimed, not proven by construction.** The ledgers state donor
  behaviour in prose vectors; they do not carry a differential harness against the frozen
  Boss sources the way MB-005 did against its compiled donor. On this branch I have
  verified the *ported* code's tests, not its equivalence to `Codex-Boss @ 8df428e` line
  by line. Closing that would need the frozen donor tree and either a differential run or
  a symbol-level comparison.
- **The seven DEFERRED items are a boundary claim.** If any of them is load-bearing for
  "at least one existing Utopia task/control flow really consumes the migrated Core
  boundary", the consumption is shallower than the Mission's wording implies. §3.3 shows
  the *one* consumption I could see is real but narrow: a node-claim predicate.
- **Durable identity across restart** (Mission criterion: "重启/恢复后 durable
  task/audit 身份不被伪造为成功") was not exercised end to end by me in this pass.

## 4. Rule 9 status

Findings in §3 were established and written **before** the Migration Report was opened.
There is no case in this report where a finding was revised after reading the migration
host's account, and §6 records the differences explicitly.
