> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../MB-008-computer-use.md) 的原始 frontmatter 是唯一元数据来源。

# MB-008 — Computer Use Runtime Boss/Hns Union migration only

> **Repair queue step 2.** Mech’s Verification claim remains, but finalize/merge is forbidden before MB-007 repair reaches `repair_status=COMPLETE`. After synchronizing post-007 Utopia main, first reassess current value: if the whole migration has no value, `SKIPPED_NOT_REQUIRED` is permitted; otherwise continue bounded verification.

> ## ✅ Owner ruling applied — Migration COMPLETE / Verification OPEN
>
> In [`response-9-29.md`](../../completed-2026-10-01/response-9-29.md) R7, the Owner accepted the measured `NO_VERDICT_IDENTICAL_SEAM` conclusion: for this Mission’s
> `capabilityProvider:false` infrastructure/pipeline modules, adding UI/capability for the old consumption gate
> or changing existing verdicts is forbidden. The Verification Host may use a real, bounded, reproducible Computer-Use chain to verify the declared boundary.
>
> Because migration implementation, 664 parity tests, and required CI completed, this file now marks `migration_complete` as `true`.
> An actual host different from Migration Host `Alien` must claim Verification and synchronize the latest Utopia `main` at the start.
> This ruling does not establish completion of the deferred runtime plane; the Verifier must not broaden this Mission’s delivery claims.
> The next worker touching the implementation branch must first record `OWNER_INTERVENTION` referencing `response-9-29.md`, and, under the current
> Utopia evolution contract, add the completion events required after the Owner ruling before entering Verification.

## Goal

Combine and migrate Boss backend breadth and Hns contract/safety/recovery/verification into 10/01 general Computer Use Runtime without introducing a new planner.

## Donor / Frozen baseline

- `Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080`
- `DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973`

## City ownership and implementation boundary

- **City owner:** 10/01 Computer Use Runtime — Generic Computer Interaction Execution Service
- **Target implementation repository:** `zhiheng-zhang-Mera/utopia`
- **Target path:** `city/10-automation/01-computer-use-runtime`
- **Dependency Mission:** none
- The migration report must record the actual final implementation path. If path design conflicts with the current City map, stop and mark blocked; do not change City ownership unilaterally.

## Existing behavior permitted to migrate

- Boss DOM/UIA/structured-app/VSCode/vision backend routing and the workspace side-effect permission gate.
- Hns goal/success/capability/safety/limit/plan execution contract。
- browser/desktop/file/shell/vision controllers；screenshot/UIA/Win32 drivers。
- focus/foreground/destructive-action safety、target/command guards。
- world-state/progress、stabilization/stall/recovery、postcondition verification、receipt/screenshot retention。

## Explicit exclusions / Outside this Mission

- Autonomous Environment Explorer world-model/planning.
- Engineering Foreman plan ownership.
- City task authority。
- Adding OS backends, vision models, or automation action types.

## Migration completion gates

- Establish traceable source→target mapping from the frozen donor baseline.
- Equivalently migrate/adapt existing donor behavior inside target boundary; do not fill unimplemented items with new capability.
- Target branch pushed; Migration does **not merge into main**.
- Relevant unit/contract/parity tests complete; retain actual failures and repair records.
- Real consumption follows `mission-book/README.md` §7; in `response-9-29.md` R7, the Owner accepted a bounded real Computer-Use chain as the way to satisfy this Mission.
- Traceable data/error/recovery/interruption records where applicable.
- City Migration Report committed:
  - `Digital-City/mission-book/reports/MB-008/MIGRATION_REPORT.md`
- Update this file migration_complete: true and branch/head/CI/report fields.

## Verification completion gates

- For this round, response-9-30 R7 does not require Alien to replay old blockers retrospectively. Verification Host Mech must complete a real bounded desktop/file/shell or UI action already supported by the donor and verify its postcondition.
- Actually record at least one refusal/permission/error path and one recovery/stabilization path.
- Resolve safety conflicts using the stricter donor behavior; permissions must not be relaxed for convenient verification.
- Verification host must differ from Migration host.
- Complete independent code/runtime review and record findings before reading Migration report.
- Necessary repair only on the same Mission branch, without expanding functionality.
- All required CI and Mission gates green.
- Verification host performs merge into target implementation repository main.
- City Verification Report committed:
  - `Digital-City/mission-book/reports/MB-008/VERIFICATION_REPORT.md`
- Update this file verification_complete: true, final CI, merge SHA and report fields.

## Claim / Host claim record
### Migration Claim

- Host: **Alien**
- Claimed at: 2026-09-29T13:55:23Z
- City claim commit: this commit (SHA recorded verbatim in `reports/MB-008/MIGRATION_REPORT.md`, since a commit cannot name itself)
- Implementation branch: `mission/MB-008-computer-use` (created from `zhiheng-zhang-Mera/utopia` main @ `c7ef3cd1c6be0155332d03afc3607dfdbf49c205`)

> **Claim order note.** MB-007 is `BLOCKED_OWNER_DECISION` (ported and green, but its
> product-consumption gate is unmet and awaits an Owner ruling). MB-008 declares no dependency on
> MB-007, so it is the lowest-sequence claimable migration. **The same consumption question will
> arise here**, because rule 14 and the Migration gate require consumption by an EXISTING Utopia
> surface: before marking anything complete, the host must either find a genuinely
> equivalence-preserving rewiring into an existing surface or record the gate as unmet, as MB-007
> did. Inventing a surface, or wiring a guard in a way that changes an existing verdict, is
> forbidden.

#### Migration closeout — PARTIAL

- City claim commit: `f827756053c456e0e6e682c3ab20d9c98e14c50c`
- Implementation head: `efdd403f81ad0c1b9f9fca56a2e51829efc6e5ea` (CI `36583979374` PASS)
- Migration head: `aa2a6a8faab779a020d75b93dba548ba3755ce30` (CI `36584056291` PASS)
- Report: [`reports/MB-008/MIGRATION_REPORT.md`](../../completed-2026-10-01/reports/MB-008/MIGRATION_REPORT.md)
- **Done:** six modules, 664 tests, the new `10-automation` district and
  `01-computer-use-runtime` building registered, census extended, the `capabilityProvider`
  filter added, full CI green, donor defects preserved verbatim and pinned.
- **Not done:** the product-consumption gate. The absence of a verdict-identical seam was
  established by measurement **before** porting began (report §4 D2). No `MIGRATION_COMPLETE`
  event was written; the branch event stream records `RUNTIME_FAIL / BLOCKED`
  (`MB-008:5a72b750eb33a552`).
- Not merged to `main`; `mission:finalize` deliberately not run.

> **Engineering finding worth carrying forward (report §4 D4).** The ports were parallelised
> with a "do not import sibling modules" instruction, which produced a copied routing table in
> `bounded-run` that was **not** equivalent to the donor's — `DOM_TYPE` had an extra `gui`
> channel the donor lacks — while all 159 of that module's tests still passed. It was caught by
> the single-source standard and repaired by importing the sibling binding plus an **identity**
> test (a `deepEqual` copy would have passed). This is the third time that standard has caught
> a real divergence; it should be a standing migration rule, not a per-mission choice.

### Verification Claim

- Host: **Mech**
- Claimed at: 2026-09-30T05:20:00Z
- City claim commit: the commit that introduces this line (a commit cannot name itself; the SHA is recorded verbatim in `reports/MB-008/VERIFICATION_REPORT.md`)
- Reviewed migration branch: `mission/MB-008-computer-use` @ `aa2a6a8faab779a020d75b93dba548ba3755ce30`
- **Selection under `README.md` §3 (integration first).** **P0 — Verification / Integration**, and after MB-007 the only P0 left for this host: MB-008 has `migration_complete=true`, its verification stage is unclaimed, its migration host is `Alien` (≠ `Mech`), and it is not `BLOCKED_OWNER_DECISION`. The assessment-first Missions MB-010..012 are P1A and remain ineligible while a P0 exists.
- **Basis for verification being open.** Owner ruling [`response-9-29.md`](../../completed-2026-10-01/response-9-29.md) **R7** accepts this Mission's boundary (`NO_VERDICT_IDENTICAL_SEAM`: the candidate seam had a quantified semantic counterexample, so wiring it would have added product behaviour) and explicitly declares *"Owner hereby declares MB-008 Migration complete."* R7 authorises the `README.md` §7.2 bounded chain for this Mission: the Verification Host directly exercises the migrated modules' **contract / safety / recovery / postcondition** behaviour rather than inventing a consumer. R7 also warns that this exemption does **not** make Computer Use a complete product runtime — the deferred runtime plane stays deferred, and this verification may only verify the boundary the Mission declared.
- **Integration note.** As with MB-007, verification begins by merging the latest `main` into this branch and resolving the shared control-plane union **before** any gate runs (`README.md` §6). The failure mode found on MB-007 was that this gate set cannot be run against an uncommitted merge: `verify-promotion-history` tests `HEAD`, so the merge must be committed first.
- **Rule 9 discipline:** this host's independent review is performed and written down **before** the Migration Report is opened.

### Verification milestone — bounded runtime chain green (repair step 2)

- **Value reassessment (before any merge work, per `response-9-30.md` R6 step 2).**
  `main` declares **no** `city/10-automation` district, and nothing elsewhere covers
  `createSafetyGuard` / `classifyRisk` / the target guard. Verdict = **`ROUTE_B_CONTINUE`**, so
  `SKIPPED_NOT_COMPLETE` was not available; the Mission still has value.
- **Reconciliation.** The branch was 48 commits behind `main`; `main` was merged **before** any gate
  ran and committed as `77b774c` (integration-first, `README.md` §6). Three shared-control-plane
  conflicts were resolved as union/superset; the census was regenerated in manifest **declaration
  order**. Reconciled CI `36655586918` PASS.
- **Bounded chain (the §7.2 real consumption).** Driver
  `.runtime/evidence/mission-book/MB-008/run-2/bounded-computer-use-chain.mjs` → exit 0:
  happy path (`FILE_WRITE`, risk `high`, postcondition `success` kind `file`) · refusal (migrated
  guard throws `DESTRUCTIVE_FORBIDDEN`, **zero** mutations, artifact byte-identical) · genuine miss
  (target **really** deleted; the same real `facts.fileExists` reports it absent; donor postcondition
  `failure` kind `file`) · recovery (donor `retry`/`RETRYABLE` + `settle stable` → `landed`;
  re-verified `success`). `NO_MOCK_FACTS = true`.
- **Driver-only repairs.** Three bookkeeping defects in the host-local evidence driver were fixed
  (`assertActionAllowed` is `async` and was being called in a sync `try/catch`; side-effect absence
  was asserted rather than measured; `validateAction` is throw-based and has no `.valid` field).
  **No migrated module was touched** — the guard and verifier were already correct, and editing them
  to flatter the evidence is forbidden.
- **Gates.** `pnpm test` 73/73 · `city/test-all.mjs` 1698/1699 (0 failures, 1 skipped) ·
  `apps/rooms` 69/69 · `verify-promotion-history` 10 records · `check:docs` SYNCHRONIZED.
- **Evolution events.** `RUNTIME_PASS` `MB-008:bbf126eae72598ed`, final `CI_RESULT` PASS
  `MB-008:06f57c0602aa5553`, `VERIFICATION_COMPLETE` PASS `MB-008:fd0225d163afa3d2`. Ordering
  asserted: `VERIFIER_FINDING` < latest `CI_RESULT PASS` < `VERIFICATION_COMPLETE PASS`.
  Alien's `RUNTIME_FAIL / BLOCKED` `MB-008:5a72b750eb33a552` is **retained**; no
  `MIGRATION_COMPLETE` was fabricated (`response-9-30.md` R5).
- **Still open.** Owner-override `mission:finalize`, episode, final branch CI on the episode commit,
  merge to `main`, merged-main CI. The **deferred runtime plane remains deferred** — no real
  desktop/browser/UI automation was driven, and this does not make Computer Use a product runtime.

### Verification closeout — REPAIR STEP 2 COMPLETE (2026-09-30)

All items left open at the milestone above are now closed.

| Item | Result |
| --- | --- |
| Owner-override `mission:finalize` | done — `--migration-acceptance owner-override --owner-ruling Digital-City/mission-book/response-9-29.md#R7` |
| Episode | `data-records/evolution/episodes/mission-book/MB-008/episode.json` |
| Episode id | **`MB-008:6ae0bbd46e425c9f`** |
| Episode sha256 | `a4b6e8fc6c87d07a3ac03a767e9a12f92bdf32931f37e624e48650a5a5b87e0e` |
| Episode status | `VERIFIED`; `participants` Alien / Mech; `migrationAcceptance.mode = OWNER_OVERRIDE` |
| Inbox | consumed (removed) by the finalizer |
| Final branch HEAD | `f8f82cd54d2192ae63317b42182f96a9aaab466f` |
| Final branch CI | `36663533485` **PASS** (gateway-web + android) |
| Merge commit | `168182c47df537f7c6c47d7e42ab3220af40de68` (`--no-ff`, matching project precedent) |
| Merged-main CI | `36663813362` **PASS** (gateway-web + android) |
| Merged-main gates | `pnpm test` 73/73 · city 1698/1699 (0 fail, 1 skip) · rooms 69/69 · promotion-history 10 records at `168182c47df5` · `check:docs` SYNCHRONIZED |
| Structural checks | `10-automation` once · `01-computer-use-runtime` unique · `capabilityProvider:false` on all six · district/building/module ids unique · theme engine owned only by `00-foundation/05-control-centre` · `11-entertainment` absent |

Episode assertions verified: `status = VERIFIED`, `participants.migrationHost = Alien`,
`participants.verificationHost = Mech`, `migrationAcceptance.mode = OWNER_OVERRIDE`,
`ownerRuling = ...response-9-29.md#R7`, `migrationBlockerEventId = MB-008:5a72b750eb33a552`,
`ownerInterventionEventId = MB-008:fe4650b1af0044de`; Alien's original `RUNTIME_FAIL / BLOCKED` is
retained in both `timeline` and `failures`; **no** `MIGRATION_COMPLETE` was fabricated; `RUNTIME_PASS`
and `VERIFICATION_COMPLETE` are both present.

**Verification Report status: `COMPLETE — OWNER_OVERRIDE_CLOSEOUT_COMPLETE`.**

**Deferred runtime limitations (unchanged, and not to be read as complete).** No executor,
controllers, drivers or OS backends were migrated or exercised: no real desktop, browser or UI
automation was driven. The bounded action is a **file** action inside the evidence workspace. Donor
parity was not independently re-derived here. Two-host coverage was not achieved — `response-9-30.md`
R7 authorises single-host coverage for MB-008 specifically. This exemption does **not** make Computer
Use a complete product runtime.


## Binding execution conditions (mandatory for every Mission)

> **LATEST OWNER RULING:** [`response-9-30.md`](../../completed-2026-10-01/response-9-30.md)
> **PRIOR OWNER RULINGS:** [`response-9-29.md`](../../completed-2026-10-01/response-9-29.md) (clauses not superseded by 9-30 remain effective)
> **ACTIVE RULESET:** [`README.md`](.././README.md)  
> [`past-rules/`](../../completed-2026-10-01/past-rules) is historical archive only, with no runtime authority.
>
> Current Mission frontmatter and mission-specific gates remain effective; historical rule numbers in old Claims/Reports/body are interpreted in their original context only. In conflict, latest-dated Owner response prevails.

## Mission-specific evidence

- real UI/desktop execution receipts
- permission/refusal trace
- postcondition verification
- recovery/stall evidence
- screenshot/UIA evidence where donor supports it
