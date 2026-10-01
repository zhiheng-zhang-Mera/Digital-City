# Migration Report — MB-008

```text
MISSION = MB-008
ROLE = MIGRATION
HOST = Alien
CLAIM_COMMIT = f827756053c456e0e6e682c3ab20d9c98e14c50c
DONOR_BASELINE = zhiheng-zhang-Mera/Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080
                 zhiheng-zhang-Mera/DS-Hns   @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b
IMPLEMENTATION_BRANCH = mission/MB-008-computer-use
IMPLEMENTATION_HEAD = efdd403f81ad0c1b9f9fca56a2e51829efc6e5ea
IMPLEMENTATION_CI = 36583979374 PASS (gateway-web + android)
MIGRATION_HEAD = aa2a6a8faab779a020d75b93dba548ba3755ce30
MIGRATION_CI = 36584056291 PASS (gateway-web + android)
MIGRATION_COMPLETE = false
```

> ## ⚠ NOT COMPLETE, AND NOT CLAIMED
>
> The port is done: **664 tests**, six modules, full CI green. The Mission's gate
> *"至少完成一次真实产品消费；UI/客户端要求仅复用当前存在的 Utopia 消费面"* is **unmet**, and this
> time the answer was established **before** porting rather than after: a read-only survey
> **executed** the donor modules against the live Utopia expressions and returned
> `NO_VERDICT_IDENTICAL_SEAM`, with a measured counterexample for every candidate.
>
> Under rule 13 the host marks MB-008 `BLOCKED_OWNER_DECISION`. **This is the second mission
> blocked on the identical gate** (MB-007 was the first), and section 5 asks the Owner to rule
> once for both. MB-009 will hit it too.

---

## 1. 落地边界 / Landing boundary

Target: **new district `10-automation`, new building `01-computer-use-runtime`**.

| Module | Donor files | Tests |
| --- | --- | --- |
| `execution-contract` | DS-Hns `constants.cjs`, `errors.cjs`, `action.cjs`, `criteria.cjs`, `contract.cjs` | 84 |
| `target-guard` | DS-Hns `target.cjs` | 64 |
| `routing-safety` | DS-Hns `routing.cjs`, `safety.cjs`, `modal.cjs`, `evidence.cjs` | 125 |
| `world-verification` | DS-Hns `world-state.cjs`, `verification.cjs`, `miss.cjs`, `observer.cjs`, `progress.cjs` | 97 |
| `bounded-run` | DS-Hns `stall.cjs`, `state-machine.cjs`, `recovery.cjs`, `stabilization.cjs`, `reconnect.cjs`, `health.cjs`, `resources.cjs` | 164 |
| `backend-surface` | Codex-Boss `computer-recovery.ts`, `action-readiness.ts`, `ui-surface.ts`, `ui-surface-ids.ts`, `semantic.ts`, `permission.ts`, `dom-page.ts`, `provider-dom-surface.ts` | 130 |

All six declare `"capabilityProvider": false`, so the Web and Android capability lists are
unchanged; the census in `city/tests/manifest.test.mjs` was extended and the
mission-incubation provenance contract applies.

- **Preserved behavior.** Every module mirrors the donor's exports, exact strings, ordering,
  thresholds and closed vocabularies, with pure/injectable seams only where the donor has
  them. Independent parity evidence, per module: `target-guard` differentially executed the
  **real donor module** over **9 973 comparisons, 0 mismatches**; `execution-contract` ran
  **10 801 randomized differential cases, zero differences**; `bounded-run`'s corrected
  `alternativeAction` was checked over **6 912 combinations, 0 mismatches**;
  `backend-surface` states honestly that its 43 vectors are **source-traced, not executed**,
  because the donor is TypeScript and this building is plain JS with no TS toolchain.
- **Donor defects preserved verbatim and pinned, never repaired.** 20 in `backend-surface`,
  17 in `routing-safety`, 14 each in `execution-contract` and `target-guard`, 10 in
  `world-verification`, 11 in `bounded-run`. Examples: `verification.cjs` calls
  `targetPresent(action, after)` against a `(world, action)` signature so
  `target_appears`/`target_disappears` always answer `ok: null`;
  `verdictForOutcome` can never return its own exported `ACTED`;
  `parseDomTarget` throws outside `execute()`'s `try`, so `execute()` **rejects**;
  `ring.last(0)` returns the whole ring; `progress.cjs` reads `detail.kind` while the verifier
  emits `verificationKind`; `FILE_DELETE` is `high` not `critical`, so the critical
  "must declare an expected effect" rule never fires for a plain deletion. Several ports
  reported nearly "correcting" these into sensible behaviour before the differential harness
  proved the donor really does what its code says — that is the value of the instruction.
- **Deferred** (recorded per module): the runtime plane — `executor.cjs` (99 814 B),
  `index.cjs` (31 665 B), `controllers/**` (≈90 KB), `drivers/**` (≈263 KB incl. PowerShell),
  `host-electron.cjs`, `log.cjs`, `mutation.cjs`, `workspace.cjs`, `processes.cjs`,
  `ports.cjs`, `isolation.cjs`, `autonomy.cjs`; and on the Boss side 11 of 17 files
  (`windows-ocr/uia`, `vision`, `provider-vision-surface`, `structured-apps`, `vscode-cli`,
  `computer-service`, `semantic-runtime`, `perception-loop`, `software-lease`).
- **Two recorded exclusions.** (1) `src/shared/perception.ts` was **not** ported — a
  *boundary decision*, not duplicate-avoidance: its only consumer is the deferred
  `perception-loop.ts`, so the vocabulary would land with no consumer. The survey flagged a
  possible MB-007 duplication; **that was checked and is a false alarm** — MB-007's manifest
  lists only `src/shared/research-*.ts`, and no manifest on either branch references
  `perception`. (2) `createPageRepairExecutor` was **not** ported: its `new AbortController().signal`
  is an invented interface, and every real `DomPageSurface.evaluate` is Electron's
  `webContents.executeJavaScript`, so porting it would also ship an invented behaviour.
- **The single interface change**: `world-state.cjs` hard-codes `crypto.createHash('sha1')`
  and reads `Date.now()` with no injection point. The port exposes `{ now, hash }`. The
  **default** digest is still the donor's own sha1 hex truncated to 16 characters and is
  asserted with its exact length, so `createWorldState(parts)` reproduces the donor exactly.
- **Existing Utopia UI / real-consumption path: none.** See section 4.

---

## 2. 测试与运行 / Tests & runtime

- **Module tests**: 664. **Full CI-equivalent suite**: `pnpm test` 58/58, `apps/rooms` 67/67,
  `node city/test-all.mjs` **794/794**, `verify-promotion-history.mjs` 10 records verified,
  `pnpm check:docs` `PAIR_STATUS = SYNCHRONIZED`.
- **Real consumption**: none (section 4).
- **Failures**: no fidelity defect needed correction, but one **real behavioural divergence
  was found and fixed** — see section 4, D4. It is the most important engineering event in
  this mission.

---

## 3. Utopia 狗粮 / Evolution handoff

`data-records/evolution/inbox/mission-book/MB-008/events.jsonl`:

| Event | Type | Outcome |
| --- | --- | --- |
| `MB-008:4ba425de0933dc87` | MISSION_CLAIMED | INFO |
| `MB-008:ef9cf276cbb63010` | ATTEMPT_STARTED | INFO |
| `MB-008:69a6b819de80de0b` | CHANGE_APPLIED | INFO |
| `MB-008:7189d8757b9c40de` | TEST_PASS | PASS |
| `MB-008:5a72b750eb33a552` | RUNTIME_FAIL | BLOCKED — the consumption gate |

No `MIGRATION_COMPLETE` event was written. `.runtime` evidence:
`.runtime/evidence/mission-book/MB-008/run-001/WORKING_STATE.md`, plus the survey's report.

---

## 4. 施工中的问题、选择与判断逻辑 / Problems, choices and the reasoning

**D1 — The consumption question was answered FIRST this time.**
*Why:* MB-007 was blocked because the absence of a seam was discovered only at the close. For
MB-008 a read-only survey was commissioned **before any porting** whose first deliverable was
either `VERDICT_IDENTICAL_SEAM_FOUND` or `NO_VERDICT_IDENTICAL_SEAM`. It returned the latter,
by **executing** the donors rather than reading them. *Cost:* the port went ahead knowing it
would end blocked — deliberately, because the port is the mission's deliverable and is
valuable regardless of the Owner's ruling.

**D2 — The measured counterexamples (this is the Owner's evidence).**
- The donor workspace side-effect gate vs the bridge's `OUTPUT_PATH_FORBIDDEN` check: **3 of 4
  inputs differ** — `{prompt, outDir:'../escape'}`, `{prompt, draft:{}}` and
  `{prompt, image_generator:true}` are refused today and would be **accepted**.
- The donor target/command guards vs the `INVALID_REFERENCE` traversal check: **6 of 9 differ**
  — the two are not even well-typed against each other (percent-decoded `(ref, subpath)`
  versus a filesystem path hand after `path.resolve`).
- The donor focus/foreground/destructive gates vs `platform/windows/*.mjs` and
  `agents/reference-node/*.mjs`: **the seam is empty** — no file in either has any focus,
  foreground, dialog or destructiveness concept. Wiring it would add product behaviour.
- The donor postcondition/progress/stall/recovery vs `node/report`: **four independent
  blockers** — the state vocabularies intersect only on `{COMPLETED, FAILED}`;
  `progress.cjs` counts evidence *kinds*, not the gateway's 0–100 percentage; `node/report`
  performs no postcondition verification at all and every donor evaluator needs the deferred
  `controllers/**`+`drivers/**` facts; and `classifyRetention(undefined)` would drop what
  `theme-artifacts.mjs` keeps.
- The closest pair on the whole surface (not named by the mission) —
  `createWorkspaceGuard().resolvePath` vs `FilesystemAdapter.path` — still differs on
  **5 of 14** inputs, and the donor would accept an absolute path inside the root where the
  adapter refuses.

**D3 — Why the gate cannot be met from inside the mission.** Satisfying it would require one
of: (a) adding a capability to the list Web and Android read — a new product surface,
forbidden by rule 14 and by MB-008's own "no new OS backend, vision model or automation action
type"; (b) changing an existing verdict — forbidden by the Verification gate's requirement
that the existing Evidence Engine acceptance keep passing; or (c) re-pointing a capability at
a module from another building — the same thing MB-007's D1 forbids.

**D4 — ⚠ The single-source standard caught a real behavioural divergence.**
*Problem:* to parallelise, every port was told "do not import sibling modules; declare locally
what you need". That produced four rooms each declaring the donor's shared vocabulary, and
`bounded-run` additionally **copied** `revalidate` (from `target.cjs`) and **embedded** the
`CHANNEL_PLANS` routing table (from `routing.cjs`). *The embedded table was not equivalent*: it
had `DOM_TYPE: ['dom','accessibility','gui']` where the donor's `routing.cjs` has
`['dom','accessibility']`. That copy would have offered a `gui` fallback the router never
chooses, for a `DOM_TYPE` action whose structured channels are both spent — where the donor
replans. *Every one of the copied room's 159 tests passed with the wrong table*, because no
test covered that rung.
*Repair:* `bounded-run` now imports `revalidate` from `../target-guard/target.mjs` and
`CHANNEL_PLANS`/`fallbackChannels` from `../routing-safety/routing.mjs`; the copies are
deleted; an **identity** test (not `deepEqual` — a value test would pass a drifted copy) proves
the shipped bindings are the sibling's own objects; and `alternativeAction` was re-checked over
6 912 combinations against a literal donor transcription with 0 mismatches. All 159 original
tests still pass unchanged, now at 164 with the identity suite.
*This is the third time this standard has paid for itself* (MB-006's duplicated checksum
function, MB-007's four duplicated vocabularies, MB-008's routing table). It is the strongest
argument in this report for treating "a shared vocabulary or table has exactly one home" as a
standing migration rule rather than a per-mission choice.
*Remaining, declared:* the donor's constant vocabularies are still declared per-room in four
rooms (value-identical at port time, and each room's `DONOR.json` lists the exact bindings).
That is a declared boundary, not a hidden one.

**D5 — `capabilityProvider: false`, fourth use.** Identical registry and `manifest.mjs` hunks
to MB-003/MB-006/MB-007 so they should merge cleanly. **MB-001 still uses the district-level
`kind: "infrastructure"` for the same purpose**, and MB-008 adds a *whole new district*, so the
conflict surface grows again.

**D6 — Environment.** `pnpm` is not on `PATH` (`corepack pnpm@11.19.0`);
`pnpm mission:event -- --mission …` forwards a literal `--` and fails; a `mission:event`
summary over 1000 characters is refused with exit 2 — hit **three times** in this mission.

---

## 5. 交给 Owner 的裁决请求 / The ruling being requested

**Two missions are now blocked on the same gate, with the same root cause, and MB-009 will be
the third.** MB-001/MB-003/MB-006 satisfied it only because an exact *mechanism* rewiring
happened to exist in an existing product path. MB-007 and MB-008 are infrastructure/pipeline
migrations whose honest consumer would be a **new** product surface — which rule 14 forbids
creating for acceptance.

The Owner is asked to rule **once**, covering MB-007 and MB-008 and pre-empting MB-009:

1. **Accept the boundary.** Treat "the migrated modules are exercised by the Verification
   host's bounded chain" as satisfying the gate, and amend the gate wording for MB-007/MB-008
   (and MB-009). This needs an explicit Owner ruling, not a host decision.
2. **Authorise one specific consumption** per mission, naming the surface and saying explicitly
   that it is authorised for that mission, since it adds to the Web/Android capability list.
3. **Supersede.** Rule 13 forbids a third host from quietly taking over; if the ports should
   land without consumption, an explicit superseding Mission is the sanctioned route.

Both ports are complete, parity-tested, registered behind `capabilityProvider: false` and green
on the required CI, so **any of the three rulings can be applied to finished work.**

---

## 6. 已知限制 / Known limitations

1. No product consumer for any of the six modules (D2, D3).
2. The four-room shared-vocabulary duplication is declared, not consolidated (D4).
3. The runtime plane was not migrated, so this is a library, not a working computer-use
   runtime: no executor, no controllers, no drivers, no OS backends — and MB-008 forbids
   adding new ones.
4. `backend-surface`'s parity is source-traced rather than executed, and two of its modules
   (`semantic.ts`, `permission.ts`) had **no donor test at all**, so this port is the first
   coverage of that behaviour.
5. The Verification gate requires **two hosts each performing a real donor-supported desktop,
   file, shell or UI bounded action with a verified postcondition**. The migration host did not
   attempt it, and it cannot be simulated.
6. The hosted CI result is recorded in `IMPLEMENTATION_CI`; the branch was not merged, and
   `mission:finalize` was not run.

## 7. 交给验证主机 / Handoff to verifier

**MB-008's Verification stage is not open.** Rule 13: a `BLOCKED_OWNER_DECISION` mission must
not be taken over by a third host until the Owner rules.

- `city/10-automation/01-computer-use-runtime/*/DONOR.json` — the boundary per module; the
  `knownDifferences` blocks are the highest-value reading (they enumerate the preserved donor
  defects, each pinned by a test).
- `bounded-run/tests/identity.test.mjs` and the three sibling import lines — the D4 repair; try
  to break the identity assertions.
- The differential harnesses lived outside the repo and were deleted, so re-derive parity from
  the donors at `D:\DS-Hns-donor` (`eeb57ca`) and `D:\Codex-Boss-donor` (`8df428e`) rather than
  trusting this report.
- `services/capability-bridge/registry.mjs`, `city/manifest.mjs`, `city/tests/manifest.test.mjs`
  — the `capabilityProvider` flag, the new district and the census.
- Section 5 — the ruling request.

- Branch HEAD: `aa2a6a8faab779a020d75b93dba548ba3755ce30` on `zhiheng-zhang-Mera/utopia`,
  branch `mission/MB-008-computer-use`.
- The migration host did **not** merge, and did **not** run `pnpm mission:finalize`.
