# MB-007 — Research Institute — VERIFICATION REPORT

> Status: **IN PROGRESS**
> Verification Host: `Mech`
> Claimed at: `2026-09-30T03:10:00Z` (City `5d57a30`)
> Migration Host: `Alien` (different host, as required)
> Reviewed migration branch: `mission/MB-007-research-institute`
>   - migration head `68015caa71b7788f700abb1c7918d1b5ee8f9e8c`
>   - **reconciled head `8bce1f79ba0940e35eb3b2e2ac352793af886802`** (latest `main` merged in first, per `README.md` §6)

## 0. Rule 9 ordering (read this first)

`README.md` §9 keeps the mission-book's original discipline: the Verification Host first
completes an independent review from the donor, the target code, the diff, the tests and the
runtime state, and writes its findings down; **only then** does it read the Migration Report.

§1–§4 are that independent review, written from the branch, the code and this host's own runs.
§5 is the first point at which the Migration Report is consulted.

## 1. What is being verified

MB-007 migrates the Boss research pipeline into `city/06-research/01-research-institute`:
five modules beside the pre-existing `evidence-engine`.

| Module | Donor source (per its `DONOR.json`) | PARITY / ADAPT / EXT / DEFERRED |
|---|---|---|
| `research-protocol` | `src/shared/research-{ir,protocol,contract,roles,command}.ts` | 11 / 5 / 1 / 5 |
| `research-statistics` | `src/shared/research-statistics.ts`, `research-battery.ts` | 8 / 5 / 0 / 5 |
| `research-provenance` | `src/shared/research-{citation,bibliography,input}.ts` | 5 / 5 / 0 / 5 |
| `research-manuscript` | `src/shared/research-{figures,manuscript}.ts` | 7 / 4 / 0 / 4 |
| `research-review` | `src/shared/research-{review,adjudicate,levela,levelb,capability-registry}.ts` | 8 / 5 / 0 / 5 |

Donor: `zhiheng-zhang-Mera/Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`.

## 2. Integration first: the branch was synced before any gate was run

Per `README.md` §6, verification begins with the latest `main`, not with the stale branch. At
claim time the branch was **23 commits behind** `main` and touches the shared control plane
(`CITY_IMPLEMENTATION_MANIFEST.json`, `city/manifest.mjs`, `city/tests/manifest.test.mjs`,
`services/capability-bridge/registry.mjs`) — exactly the P0 integration pressure the scheduler
describes.

Merging `main` in produced two conflicts, both resolved in favour of the union and neither
weakening a mechanism:

- **`services/capability-bridge/registry.mjs`.** The branch carried only the module-level
  `capabilityProvider: false` filter. **`main` already carried both** exclusions — a
  building-aware `kind` filter (`(b.kind ?? d.kind ?? 'domain') !== 'infrastructure'`) *and*
  the module-level flag — plus the `declared` vs enumerated split that MB-009 needs so a
  bridged module inside an infrastructure district still resolves. Main's side is a strict
  superset, so main's was taken and the surviving file was confirmed to contain **both** filters.
- **`city/tests/manifest.test.mjs`.** Census is the union over the current districts. One
  conflict block was the head of the module list rather than an alternative to it; taking only
  the branch's side silently dropped seven modules (`00-foundation/01-city-core/*`,
  `03-capability-fabric`, `05-control-centre/theme-engine`, `02-engineering/01-project-foreman`)
  and the gate caught it. Restored, and the census test passes.

**A real failure worth recording.** With the merge resolved but *uncommitted*, the
`verify-promotion-history` gate reported three problems (`theme-engine-*.json: …
does not exist at HEAD`). The cause was not the merge content: the verifier tests
`pathExistsAt('HEAD', path)`, and `HEAD` was still the pre-merge commit, which predates MB-009's
relocation. Committing the merge made all ten records verify. This is a genuine ordering
constraint on this gate — it cannot be run against an uncommitted working tree — and it is
recorded here because it looks exactly like a content defect until the commit is made.

## 3. Independent findings

### 3.1 The required gates pass on the reconciled revision — CONFIRMED

Executed by this host at `8bce1f7`:

| Gate | Result |
|---|---|
| `pnpm test` | **62 / 62** |
| `node city/test-all.mjs` | **1034 / 1035 pass, 0 fail** (1035 tests; the runner reports one skipped/cancelled slot) |
| `node --test apps/rooms/tests/*.test.mjs` | **69 / 69** |
| `node scripts/verify-promotion-history.mjs` | **10 records verified** at `8bce1f7` |
| `pnpm check:docs` | `PAIR_STATUS = SYNCHRONIZED` (docs, evidence, data-records) |

### 3.2 Real consumption: the bounded research chain — CONFIRMED, and it runs the whole pipeline

MB-007 has no semantically equivalent Utopia product seam, and inventing one is forbidden.
Owner ruling `response-9-29.md` **R6** accepts that boundary and `README.md` §7.2 authorises
the substitute: a **real, bounded, reproducible chain** that directly executes the migrated
modules and records inputs, outputs, failure/recovery, parity and evidence. This host built and
ran exactly that (`bounded-research-chain.mjs`, 22 recorded steps, all six research modules
exercised end to end):

| Stage | What the migrated module actually did |
|---|---|
| `research-protocol` | built a validated research contract (question, hypothesis, claim, experiment plan, criterion, citation policy, sections, acceptance gates), a command spec against the donor's `ALLOWED_EXECUTABLES`, a budget, and the seven donor roles |
| measurement | a **seeded, reproducible** two-arm experiment (seed `20260930`, n = 40/arm) — the numbers are computed, not asserted |
| `research-statistics` | `describe`, `bootstrapCi`, `effectSize`, `permutationP` over real arrays: **effect 0.4800, p = 0.0330**, bootstrap CI `[106.500, 108.183]` |
| `research-provenance` | the citation ladder driven step by step — `UNSUPPORTED → METADATA_ONLY → SOURCE_RETRIEVED → CLAIM_SUPPORTED` — plus a rendered `references.bib` with 2 entries |
| `research-manuscript` | a donor-shaped result table (markdown) and a metric figure as real SVG |
| `research-review` | the four-condition publication gate in both failing and passing states |
| `research-statistics` (battery) | the donor's own battery: **6/6 scenarios** reach their expected verdict |
| top-level adjudication | the full artifact chain returns status `READY`, `pass: true`, `missing: []` |

**Negative controls, because a chain that only ever passes proves nothing:**

- a **broken** evidence chain (statistics/citations/manuscript/final-audit absent, replication
  `NOT_ATTEMPTED`, review `NOT_RUN`) is **refused** — `pass: false`, with the missing artifacts
  enumerated;
- a **vetoed review** is refused;
- `primaryClaimSupported` **refuses** when an `UNSUPPORTED` citation is present (and passes
  when it is not);
- `publicationReady` refuses an incomplete chain and passes a complete one.

Artifact digests are pinned in `run/provenance-ledger.json` (protocol, measurement, statistics,
citation, manuscript, and the ledger itself), so the run is reproducible and its provenance is
checkable rather than narrated.

### 3.3 The Mission-specific evidence list — CONFIRMED

| Required | Produced |
|---|---|
| bounded research run | the chain above, 22 steps, seeded and reproducible |
| source/provenance ledger | `run/provenance-ledger.json`, six digests including the ledger's own |
| statistics/evidence receipts | bootstrap CI, effect size, permutation p, and the 6-scenario battery |
| manuscript/PDF artifact digest | table + SVG figure digests in the ledger (`manuscriptDigest`) |
| resume/partial-failure trace | the broken-chain and vetoed-review refusals, plus `missing[]` from the adjudicator |

Note on the manuscript item: this host produced the manuscript **artifacts** (table, figure,
section plan) and their digests. It did **not** produce a compiled PDF, because PDF compilation
is not part of the migrated modules — the donor's PDF pipeline is deferred, as the module
`DONOR.json` files record. That is a boundary, not a gap this verification may close by
inventing a compiler.

### 3.4 What I could NOT confirm

- **No PDF/LaTeX compilation.** See §3.3; the donor's compile step is deferred.
- **No donor differential for these five modules in this pass.** I exercised the ported
  behaviour and its refusals, but I did not rebuild a differential harness against
  `Codex-Boss @ 8df428e` for them, so `DONOR.json`'s PARITY vectors remain the migration host's
  claim rather than something I re-derived.
- **`evidence-engine`'s own acceptance** was exercised only through the suite, not through the
  chain; it predates this Mission and was not modified.

## 4. Rule 9 status

Findings in §3 were established and written before the Migration Report was opened. §5 is the
first reference to it.

---

# PART B — RECONCILIATION (§5)

## 5. The Migration Report

*Written after Part A was complete.*

### 5.1 Claim-by-claim reconciliation

| Report claim | Status after independent review |
|---|---|
| Five modules migrated with parity tests | **Confirmed as code and behaviour**; the parity *vectors* were not re-derived here (§3.4) |
| Donor defects preserved verbatim and pinned by tests | **Confirmed by reading the code and driving the refusals** — the adjudicator refuses broken chains and vetoed reviews rather than passing them (§3.2) |
| `capabilityProvider: false` keeps the product capability surface from being faked wider | **Confirmed**, and the merge preserved main's second exclusion mechanism as well (§2) |
| The product-consumption gate could not be met through an existing seam | **Confirmed by inspection:** nothing in `apps/` or `services/` consumes these modules; the pre-existing `research.evidence.review` capability bridges only `evidence-engine` |
| Migration is complete and verification is open | **Confirmed by Owner ruling** `response-9-29.md` R6, and by `README.md` §7.2's v2 rule |
| The report's own record of the gate as `RUNTIME_FAIL / BLOCKED` | **Consistent with the facts**; the Owner overrode the gate, not the evidence |

### 5.2 Divergences and repairs

- **One repair, and it is a merge repair, not a behaviour change:** the census list in
  `city/tests/manifest.test.mjs` had to be restored to the union after the reconciliation
  (§2). No production module was modified; no assertion was weakened.
- **No divergence found between the report's boundary claims and the code.** The deferred items
  named in the `DONOR.json` files are genuinely absent rather than silently stubbed.

## 6. Criteria assessment, repairs and closeout

### 6.1 The Mission's Verification gates, one by one

| # | Gate | Verdict | Evidence |
|---|---|---|---|
| 1 | 使用 donor 已有能力完成一个有界的 protocol→evidence/statistics→manuscript/PDF 或等价既有链路，并保存 provenance | **MET for protocol→statistics→manuscript artifacts, with the PDF step recorded as deferred** | §3.2's chain plus `run/provenance-ledger.json`; the donor's compile step is not in the migrated modules (§3.3) |
| 2 | 中断/部分失败时 ledger/resume 与错误真值保持 donor 语义 | **MET** | the broken-chain, vetoed-review and `UNSUPPORTED`-citation refusals all keep the donor's error truth — a failure is reported as a failure with its missing artifacts, never as a pass (§3.2) |
| 3 | Evidence Engine 现有验收与引用关系保持通过 | **MET** | `city/test-all.mjs` and `apps/rooms` are green, including the pre-existing evidence-engine and promotion-history records (10 verified) |
| 4 | Verification 主机必须与 Migration 主机不同 | **MET** | Migration `Alien`, verification `Mech` |
| 5 | 先独立审查后看迁移报告 | **MET** | Part A written and this report's §1–§4 precede §5 |
| 6 | 必要维修只能发生在同一 Mission 分支，不得扩大功能边界 | **MET** | the only repair is the merge reconciliation on this branch; no module behaviour changed |
| 7 | 所有 required CI 与本 Mission 门禁全绿 | **MET** | §6.2 |
| 8 | 由 Verification 主机完成合并到 main | **DONE** | merge SHA in §6.4 |
| 9 | City Verification Report 已提交 | **MET** | this file, plus the mission front matter |

### 6.2 Gates on this host

| Tree | Result |
|---|---|
| Reconciled branch `8bce1f7` | root 62/62 · city 1034/1035 (0 fail) · rooms 69/69 · promotion-history 10 records · check:docs SYNCHRONIZED |
| Hosted CI (reconciled branch) | see §6.4 |
| Merged `main` | see §6.4 |

### 6.3 Evidence pointers

Host-local (git-ignored):

- `.runtime/evidence/mission-book/MB-007/run-1/bounded-research-chain.mjs` — the chain driver.
- `.runtime/evidence/mission-book/MB-007/run-1/run/{summary.json,provenance-ledger.json,audit.jsonl}`
  — the machine-readable result, the six-digest provenance ledger, and the 22-step audit.
- `.runtime/evidence/mission-book/MB-007/run-1/bounded-research-chain.log` — the console trace.
- `.runtime/evidence/mission-book/MB-007/run-1/resolve-census-conflicts.mjs` — the reconcile step.

Cross-host:

- `mission/MB-007-research-institute` @ `8bce1f7` (merged).
- `data-records/evolution/episodes/mission-book/MB-007/episode.json`.
- This report, committed to `Digital-City` `main`.

### 6.4 Final record

```text
MISSION = MB-007
ROLE = VERIFICATION
HOST = Mech
CLAIM_COMMIT = 5d57a30
MIGRATION_HEAD = 68015caa71b7788f700abb1c7918d1b5ee8f9e8c
RECONCILED_HEAD = 8bce1f79ba0940e35eb3b2e2ac352793af886802
RECONCILED_CI = 36649748973 PASS (gateway-web + android)
FINDING_SHA = ff500866f1665723a62c7d16e94ca052654c46a4
FINAL_BRANCH_CI = 36650198208 PASS (gateway-web + android) at ff50086
MERGED_MAIN_SHA = cb8e0bd77ccf0864cf0af50b4624f2f556b6b279
MERGED_MAIN_CI = 36650723833 PASS (gateway-web + android)
EPISODE = NOT GENERATED — mission:finalize refuses this Mission; see §6.5
CITY_REPORT = mission-book/reports/MB-007/VERIFICATION_REPORT.md
```

Gates re-run on the merged `main`: root 62/62, city 1034/1035 with 0 failures, apps/rooms
69/69, promotion-history 10 records at `cb8e0bd`, `check:docs` SYNCHRONIZED.

### 6.5 Rule 16 deviation, disclosed: no verified episode exists for this Mission

The closeout order in `README.md` §11 ends with `pnpm mission:finalize` producing a verified
episode. **That step cannot run for MB-007**, and this report says so rather than quietly
skipping it:

- `scripts/finalize-mission-episode.mjs` requires a `MIGRATION_COMPLETE` event with outcome
  `PASS` authored by the migration host.
- MB-007's migration host recorded **`RUNTIME_FAIL` / `BLOCKED`** for the product-consumption
  gate (`MB-007:7d6c861428278c83`) and never wrote `MIGRATION_COMPLETE`. That is precisely the
  case `README.md` §7.2 and Owner ruling `response-9-29.md` R6 were written for: the Owner
  **overrode that gate**, declaring *"ACCEPT THE BOUNDARY. MIGRATION IS COMPLETE; OPEN
  VERIFICATION."*
- The finalizer therefore exits with `Missing PASS MIGRATION_COMPLETE`.

**This verifier did not backfill the missing event.** Authoring a `MIGRATION_COMPLETE=PASS`
event would attribute to host `Alien` a claim it deliberately did not make and would bury the
blocker it recorded. The deviation is instead recorded as a `VERIFIER_FINDING` on the branch
and here.

Consequences, stated plainly:

1. **No `data-records/evolution/episodes/mission-book/MB-007/episode.json` exists**, so the
   rule-16 "final branch HEAD must be green *after* the episode commit" ordering could not be
   applied. The equivalent guarantee was met a different way: the last branch commit
   (`ff50086`) was run through the required CI and is green (`36650198208`), and the merge
   commit on `main` is green too (`36650723833`).
2. **The merge decision rests on `response-9-29.md` R6 directly**, not on a generated episode.
3. **Requested from the Owner:** either teach the finalizer to accept an Owner-ruling basis for
   `MIGRATION_COMPLETE`, or state that a superseding event is authorised. The same question
   will arise for MB-008, whose Owner ruling (`response-9-29.md` R7) is worded identically.

### 6.6 What this verification did **not** establish

1. **No PDF/LaTeX compilation**, because the donor's compile step is deferred rather than
   migrated; the manuscript artifacts and their digests exist, the compiled artifact does not.
2. **No re-derived donor differential** for the five modules' PARITY vectors.
3. **`evidence-engine` was not re-verified beyond the suite** — it predates this Mission and was
   untouched by it.
4. **This does not mean the research pipeline is a complete product runtime.** The verification
   covers the boundary this Mission declared, and the deferred items stay deferred.

---

# APPENDIX — Repair step 1: Owner-override closeout (2026-09-30)

This appendix is appended by the closeout repair required by
[`ENGINEERING_BOOK-2026-09-30-MB-007-008-003-CLOSEOUT.md`](../ENGINEERING_BOOK-2026-09-30-MB-007-008-003-CLOSEOUT.md)
§2. It closes the one gap §6.5 disclosed. **No part of the accepted implementation or
verification was redone**, and the original blocker is preserved verbatim below.

## What was repaired

§6.5 recorded that `pnpm mission:finalize` refused this Mission with
`Missing PASS MIGRATION_COMPLETE`, because the finalizer required an event the migration host
deliberately never wrote, and that this verifier would not backfill it. That refusal was
correct behaviour from a contract that could not express the v2 case. The repair extends the
contract instead:

- `scripts/finalize-mission-episode.mjs` gains
  `--migration-acceptance host-pass|owner-override` and `--owner-ruling <ref>`, **defaulting to
  `host-pass`** so no existing Mission's behaviour changes.
- `owner-override` validates all seven conditions the engineering book requires: a real
  migration-side `BLOCKED`/`FAIL` event; a verification-host `OWNER_INTERVENTION`; that
  intervention being locatable to the named ruling (the document path in the evidence **and**
  the ruling anchor, or the exact `path#anchor`); an independent `VERIFIER_FINDING` after the
  blocker; a final `CI_RESULT=PASS`; a `VERIFICATION_COMPLETE=PASS` after it; and different
  hosts. It refuses an inbox that already carries a host `PASS`, and refuses a bare document
  reference with no anchor.
- `contracts/evolution/mission-episode-v1.schema.json` documents the new optional
  `migrationAcceptance` object. It is deliberately **not** in the schema's `required` list, so
  the six episodes finalized before this field existed stay valid.
- `tests/finalize-mission-episode.test.mjs` pins both happy paths and the failure cases the
  book enumerates (no blocker, no ruling, ruling/intervention mismatch, no verifier finding,
  finding before the blocker, final CI not PASS, same host, host-PASS inbox, ruling argument in
  host-pass mode). **11 tests, all passing.**

## What was NOT done

- **No `MIGRATION_COMPLETE` event was written for host `Alien`.** The episode's timeline
  contains no such event, and the original `RUNTIME_FAIL` / `BLOCKED` remains in both the
  timeline and `failures[]`.
- No change to any migrated module; no re-migration of the Research Institute.
- No edit to the original `MIGRATION_REPORT.md` or to Parts A/B of this report.

## The original blocker, preserved

> The migration host recorded the product-consumption gate as **`RUNTIME_FAIL` / `BLOCKED`**
> (`MB-007:7d6c861428278c83`) and wrote no `MIGRATION_COMPLETE` event. Owner ruling
> `response-9-29.md` **R6** overrode that gate: *"ACCEPT THE BOUNDARY. MIGRATION IS COMPLETE;
> OPEN VERIFICATION."*

The episode now records *why* completion was accepted rather than pretending the blocker never
happened:

```json
"migrationAcceptance": {
  "mode": "OWNER_OVERRIDE",
  "ownerRuling": "Digital-City/mission-book/response-9-29.md#R6",
  "migrationBlockerEventId": "MB-007:7d6c861428278c83",
  "ownerInterventionEventId": "MB-007:3a505bc6470364fb"
}
```

## Repair record

```text
REPAIR_SEQUENCE = 1
REPAIR_STATUS = COMPLETE
REPAIR_BRANCH = repair/MB-007-owner-override-finalize
FINALIZER_SHA = f25cdb4c98f0e349d386b31ab504d00700d9faf6
REPAIR_BRANCH_CI = 36654292817 PASS (gateway-web + android)
EPISODE_FILE = data-records/evolution/episodes/mission-book/MB-007/episode.json
EPISODE_ID = MB-007:553ab7ba1c4b0902
EPISODE_SHA256 = 1c5742fb44293cc829a356d3c1da80169702536276a51bb6eb96157f12d260ed
INBOX_REMOVED = data-records/evolution/inbox/mission-book/MB-007/events.jsonl
REPAIR_MERGE_SHA = d850d73a9c23dbd07f9a0c7483dd2f44272f273f
MERGED_MAIN_CI = 36654669625 PASS (gateway-web + android)
GATES = root 73/73 · city 1034/1035 (0 fail) · rooms 69/69 · promotion-history 10 records · check:docs SYNCHRONIZED
```

**Disclosure.** The book's stated closeout order is `implementation CI → CI_RESULT →
VERIFICATION_COMPLETE → mission:finalize → commit episode → final branch HEAD CI → merge`.
For this Mission the `mission:finalize` step runs *after* the merge of the accepted
implementation (which was already on `main` at `cb8e0bd`), because the repair is what makes
finalization possible at all. The equivalent guarantee was met: the repair branch head
`f25cdb4` — which carries the finalizer changes **and** the generated episode — was run through
the required CI and is green, and the merge commit on `main` is green too.
