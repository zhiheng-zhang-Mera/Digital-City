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

## 5. Verification gates run by this host

Recorded here because §6 depends on it: the gates in §3.1 were run by `Mech` on the
reviewed revision, from a clean checkout of `mission/MB-001-core-os`, before the Migration
Report was read. §3.1's numbers are therefore an independent measurement, not a
confirmation of the migration host's table.

No finding in Part A was revised while writing §6. Two further required gates were run
after reading the report — see §6.8, which is recorded as a coverage gap in Part A rather
than as a finding.

---

# PART B — RECONCILIATION WITH THE MIGRATION REPORT (§6)

## 6. Reconciling the independent review with the Migration Report

The Migration Report was opened for the first time at this point, after §1–§5 were written
and committed to the City repository (claim commit `835c7db`, independent review `03c9f75`).
What follows is a comparison, not a rewrite.

### 6.1 Shape of the report

`reports/MB-001/MIGRATION_REPORT.md` is 331 lines: a `MIGRATION = …` status block (§0),
landing boundary (§1), tests and runtime (§2), evolution handoff (§3), the decisions
D1–D10 (§4), verifier hints (§5), known limitations (§6) and handoff (§7). It is written in
the construction order the mission-book asks for and, unusually for this queue, §4 is the
substantive part: ten named decision points, each with the choice, the reason and the cost.
That is exactly the material rule 9's second reading is for, and it is the reason this
reconciliation is mostly convergence rather than correction.

### 6.2 What the independent review found that the report does not say

1. **The report never connects its own §6.3 limitation to the Mission's own Verification
   threshold.** MB-001's Verification gate list contains the line "重启/恢复后 durable
   task/audit 身份不被伪造为成功", and the Mission's `Mission-specific evidence` list
   requires "task lifecycle + restart/recovery receipts". The report states in §1 and D1
   that the donor's durable-state layer (`electron/state-core/**`, `node:sqlite`) is **not**
   migrated, and lists it under "已知限制" as a limitation. It does not state that the
   Mission names a *threshold* that the deferral leaves unmeetable by the migrated code.
   My review reached the same fact independently (§3.5) and also treated it as a limitation
   rather than a threshold. The gap between the two is real and belongs to this Mission, not
   to the report's diligence: a deferral that is correct under `MODE=MIGRATION_ONLY` can
   still leave an acceptance criterion unsatisfied, and the report's framing ("已知限制")
   understates that. This is a defect of the mission *design* (its Verification gate asks for
   something its Migration boundary forbids supplying) as much as of the report. It is
   carried forward to the criteria assessment, not resolved here, and it is not something a
   verifier may repair on the branch without enlarging the boundary that rule 10 forbids
   enlarging.
2. **The evidence pointers in §2 and §3 point at host-local material that cannot be read
   from the branch or from this host.** §2 cites `.runtime/mb001-android-build.log` and §3
   cites `.runtime/evidence/mission-book/MB-001/run-001/donor-survey/DONOR-SURVEY-REPORT.md`
   (73 KB) "with its four read-only analysis scripts". `.runtime/` is git-ignored by design
   (rule 15) and this host has no MB-001 directory there — the four Mech-delivered Missions
   left MB-002/004/005/009 evidence and nothing for MB-001. So the survey that the report
   says "proved by complete transitive closure which donor files are runtime leaves" (D1) is
   **not independently checkable**. The report is candid that nothing was published to
   `evidence/raw/mission-book/MB-001/` ("the bulky material stayed local"), and its own §2/§3
   `evidence` lists in `events.jsonl` are mostly empty arrays or local `D:/` paths. The
   consequence the report does not draw: for MB-001 the only cross-host verifiable artefact
   is the branch plus the reports. That is a defensible process choice under rule 15's second
   sentence, but it means the boundary reasoning rests on an unarchived 73 KB document.
3. **The donor-parity strength claim is stated by the report in a way a verifier cannot
   confirm from the branch.** §1 says a differential fuzz harness "transcribed the donor
   classifier verbatim and compared it with the port over ~93 000 generated cases … with
   **0 divergences**". No harness, and no file containing the string `fuzz`, exists anywhere
   on the branch or in the repository (I searched tracked content and the working tree). The
   report does not say where the harness lives, so as written the claim is unverifiable
   rather than false. This is the same gap as §3.5's first bullet, now with a concrete
   artefact name attached; I record it as unconfirmed, not as contradicted.
4. **§3 says 7 events; the branch carries 9.** The report was written before its two closing
   process events. The version of `data-records/evolution/inbox/mission-book/MB-001/events.jsonl`
   at `MIGRATION_HEAD` contains `… TEST_PASS`, `RUNTIME_PASS`, `CI_RESULT` (PASS, run
   `36566575068`) and `MIGRATION_COMPLETE`. The report anticipates this itself ("the
   `MIGRATION_HEAD` above is the branch head *before* that append"), so this is a note about
   what the reader of the report will find, not a discrepancy in the record.
5. **One of the two global-count repairs is not the one described.** D8 says "two
   global-count assertions (`unavailable.length`, `catalog.length`) were scoped to the module
   refs under test". In the tree I reviewed, `tests/capability-adapters.test.mjs:31` still
   asserts a bare whole-manifest `catalog.length === 6`, and `tests/capability-registry.test.mjs:40`
   still asserts a bare whole-catalog
   `catalog.filter(c=>c.bridgeState==='AVAILABLE').length === 5`. The *id-based* anchor and
   the scoping did land where they matter (`capability-registry.test.mjs:13` now looks the
   duplicate up by qualified `capabilityId` instead of by district index, and a new test at
   `:31–41` asserts the infrastructure exclusion directly, including `kind === 'infrastructure'`),
   so the *intent* — remove the dependence on district ordering — is met. But the report's
   description of the second repair overstates what the code does. Recorded because the
   report asks the verifier to check that claim rather than take it (D8's last sentence).
6. **A hardening consequence the report does not mention.** Because the gateway's required
   capabilities are supplied as *data* by Utopia while the test restates that same data
   locally, the new consumption test is circular with respect to the one thing it looks like
   it proves (§3.3). The report presents `tests/gateway.test.mjs` under "Real consumption"
   without that caveat. The runtime half of the test is genuine, so this is a strength
   question about the test, not a defect in the migration.

### 6.3 What the report claims that the independent review could not confirm

| Report claim | Status after independent review |
|---|---|
| Gates: `pnpm test` 60/60, `apps/rooms` 67/67, `city/test-all.mjs` 229/229 | **Confirmed** by this host (§3.1, measured before §6) |
| `verify-promotion-history.mjs` 10 records, `check:docs` `SYNCHRONIZED` | **Confirmed** by this host, but only after §6 was reached — see §6.8 |
| 99 module tests across the four modules; 18/11/28/42 per module | **Not re-derived**; consistent with the event stream's `TEST_PASS` breakdown |
| Android lane green on the migration host, `app-debug.apk` 10 488 900 bytes | **Not confirmable here.** The claimed log is absent, and this host cannot build the Android lane at all. The *hosted* `android` job is green (see §6.5), which is the CI-attributable half of the claim |
| Differential fuzz, ~93 000 cases, 0 divergences | **Not confirmable** — no harness on the branch (§6.2.3) |
| "30 files, 288 509 bytes" donor closure; "30 files" target | Plausible but **not re-derived**. The four `DONOR.json` files declare 11 donor `sourcePaths` and 11 `portedFiles`; "30" is a closure measurement, not a source-path count. The report does not give the rule that produces it |
| Gateway rewiring is "byte-identical"/equivalent | **Confirmed independently from the code**, not from the test (§3.3) |
| Consumption criterion "proves the running gateway agrees with the Core" | **Half-confirmed.** The gateway does call `acceptsWork`; the agreement assertion is circular (§3.3) |
| `MIGRATION_COMPLETE = true`, branch not merged, `mission:finalize` not run | **Confirmed** against the mission file and the branch |

### 6.4 Where the report and the independent review agree without prompting

The report's own §6 already declares: no product consumer for clusters A, B and D (D4);
`root-authority` shipping mechanism without an active policy (D6); cluster B being the
lifecycle half only (D1); and the donor's `evidence-ledger`/`coordination-ledger` being
outside the boundary (D1). My review reached each of these from the diff, the `DONOR.json`
files and the tests. **None of my Part A findings needed to be revised, and none of the
report's declarations needed to be corrected.** On the specific question the report says the
verifier should attack first ("three modules ship without a product consumer", D4), the
report is right about the fact and right that it is the weakest part of the Mission.

Provenance checks I ran against the report's claims and which matched exactly:

- All four modules carry a `DONOR.json` with `repository` `zhiheng-zhang-Mera/Codex-Boss`,
  `commit` `8df428e…`, plus `module`/`cityPath`/`district`/`building` provenance fields.
  `sourcePaths` = 3 / 1 / 3 / 4 for `root-authority` / `task-lifecycle` / `audit-ledger` /
  `fleet-routing`, matching the §1 table's donor file lists.
- `fleet-routing`'s ledger is **10 PARITY / 6 PORT_ADAPTATION / 1 UTOPIA_EXTENSION /
  7 DEFERRED** — exactly the counts in my §3.4, and the report's §5 statement that
  `fleet-routing` declares "one composition helper" is right. `root-authority` declares
  **0** `UTOPIA_EXTENSION`, matching §5's "three modules declare none".
- The `DEFERRED` lists across the four modules name, between them, every boundary the report
  declares in D1 and §1, and nothing in the branch's *code* contradicts the deferral: no
  `node:sqlite`, no `node:child_process`, no fs/network reachable from a module entry point.

### 6.5 Divergences and open judgements

1. **The consumption criterion is met narrowly, and the report and I read "consumes the Core
   boundary" differently in scope but not in conclusion.** §1 and §2 present the gateway
   rewiring as the real-consumption path; my §3.3 confirms one predicate — the node-claim
   placement decision — is now owned by `fleet-routing`, and nothing else was wired. The
   Mission's Verification gate adds "并保持 Web/Android 状态真值一致" (Web/Android state
   truth stays consistent). Neither the report nor my review demonstrated anything about
   *client* state: the evidence is an HTTP gateway placement response, not a Web or Android
   UI state. The Android lane is green but, as the report honestly says in §6.5, every
   Gradle task was UP-TO-DATE with no input changed — so it is "unaffected", and it proves
   no client consumed anything. I record this as an **open judgement for the criteria
   assessment**, with the report's §6.5 disclosure counted in its favour.
2. **The "30 files" figure and the "byte-identical" adverb.** D8's "byte-identical" claim is
   about behaviour the event stream describes as "byte-identical"; §1 cites a differential
   fuzz result. I confirmed behavioural equivalence of the gateway predicate by reading both
   versions (§3.3); I did not and cannot confirm byte-identity of anything. The report's
   wording is stronger than what is checkable, but the underlying claim survived review.
3. **`CI_RESULT`'s `targetRef` is the implementation SHA `8a7fe21`, not `MIGRATION_HEAD`.**
   The mission file's `migration_head_sha` is `a71bf90` and there are hosted runs for
   `36566973111` (final branch) and `36566575068` (implementation) — so the CI attribution
   is consistent with the report's §0 block. Noted only because a reader reconciling
   `CI_RESULT.targetRef` against `migration_head_sha` will see two different SHAs; the
   report explains the relationship correctly.
4. **D8's repair description** — see §6.2.5. This is the single place where a report claim
   and the tree disagree in detail, and it is a description defect, not a code defect.

### 6.6 Net effect on Part A

Nothing in Part A is withdrawn. The report adds the *reasoning* behind choices that Part A
had only inferred from the code — most importantly D3 (why amending the gateway freeze was
the right call rather than a boundary violation), D5 (why `00-foundation` is
`kind: "infrastructure"`), D2 (the mission-derived incubation identity) and D7 (splitting
`candidate-gate.ts` across clusters B and D). Those four decisions are consistent with what
the code does and with what the Mission permits under `MODE=MIGRATION_ONLY`; on D3 I had
already reached the same reading independently in §3.3.

### 6.7 Independent gates re-run after reading the report (for the record)

| Gate | Result |
|---|---|
| `node scripts/verify-promotion-history.mjs` | 10 records verified against local Git history at `a71bf90` |
| `pnpm check:docs` | `PAIR_STATUS = SYNCHRONIZED` for docs, evidence and data-records |

### 6.8 Coverage gap in Part A, disclosed

Part A ran the three behavioural suites but **not** `verify-promotion-history.mjs` or
`check:docs` before the report was read. Those two ran at §6.7 and pass. This does not change
any Part A finding — neither can affect the code-level findings, and neither was failed —
but the sequencing is disclosed here rather than presented as if Part A had run every gate.
The reason it matters is rule 11: the merge gate requires *all* required CI and
Mission-specified checks green, and it must be this host's own measurement that says so.

## 7. Verification criteria assessment, repairs and closeout

**NOT YET WRITTEN.** §6 completes the rule 9 reconciliation only. Still to come, in order:
the criterion-by-criterion verdict against MB-001's Verification gates; any repairs on
`mission/MB-001-core-os` (rule 10); the required-CI result and the dogfooded
`CI_RESULT=PASS` / `VERIFICATION_COMPLETE=PASS` events; `pnpm mission:finalize`; the final
branch HEAD re-run; the merge to `main` and its SHA; and the evidence pointers.
