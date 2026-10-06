# REX-803 development report — Mech

```text
WORKBOOK            mission-book/research-strengthening/REX-803-scenario-runner-and-repetition-engine.md
DEVELOPMENT HOST    Mech (COMPUTERNAME MEGA-REP), role Mech-DS
BRANCH              rex/REX-803-mech-scenario-runner
BASELINE (claim)    213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef   (main at claim time; dependency union already inside)
DEV HEAD            a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df
                    (four heads: the seed repair D-7, the physical campaign evidence, and this hardening pass D-8/D-9)
CI (exact head)     MEASURED PER RUN on a695bb9f: push 37407868473 attempt 1 SUCCESS, pull_request 37407871700 attempt 1
                    SUCCESS, linkage 37407871716 attempt 1 SUCCESS. No run on this head failed. Local: 41 tests pass
                    (REX-803 + REX-801 + REX-802).
                    earlier green heads: 85a79eca4fe0f4ad8882148725249e016434873e, e284b712c53e5b7f44acdb878afd6a23c7953735
PR                  zhiheng-zhang-Mera/utopia#31  (development, open)
PHYSICAL CAMPAIGN   two controlled campaigns on the LIVE resident City with the physical Android handset as the
                    connected control surface; evidence in utopia:evidence/raw/mission-book/REX-803/
REVIEW HOST         Alien  — OUTSTANDING, not performed by this host
MARKER              SCENARIO_REPETITION_ENGINE_ACCEPTED  NOT released
```

## 1. What was built

A campaign is one **described** experiment (REX-801's registry) executed as N repetitions of one **canonical** scenario.
Every repetition creates an ordinary City task through `createCityTask` — the same path `POST /api/v0/tasks` uses — and a
run's outcome **is** the terminal state of that real task. The runner owns no work: it never writes, assigns, completes
or cancels a task except through the City's own functions, and there is no simulation path in the module at all.

```text
services/dev-gateway/scenario-runner.mjs          the repetition engine (pure, injected clock, no randomness in seeds)
services/dev-gateway/server.mjs                   campaign controller + owner-only routes + per-run trace receipts
apps/web/research-campaign.js                     DIRECT_CONTROL / OBSERVABLE surface (new page, Advanced group)
tests/rex803-scenario-runner.test.mjs             12 engine probes
tests/rex803-campaign-surface.test.mjs            4 route/E2E tests against a real Gateway
tests/rex803-campaign-web.test.mjs                2 browser tests (Playwright)
```

Routes: `GET /api/v0/research/campaigns` · `POST /api/v0/research/campaigns` (start/resume/abandon) ·
`POST /api/v0/research/campaigns/stop` · `GET /api/v0/research/campaigns/<id>`.

## 2. Decisions taken, with the reasoning (owner rule: record every unspecified choice)

| # | Question | Decision | Why |
|---|---|---|---|
| D1 | What is a "scenario"? | A canonical City task type read from `contracts/city-control-v0` (`taskTypes`), never a hand-written list | A scenario the City cannot execute must not be selectable, and a parallel list drifts from the contract it describes |
| D2 | Does a run execute or simulate? | It creates a REAL canonical task and observes its terminal state | A campaign that measured a simulator would measure the simulator |
| D3 | Where does the repetition count come from? | The manifest's `repetitions`; a caller may ask for FEWER, never more (`REPETITIONS_EXCEED_DECLARED`) | The declared count and `MAX_REPETITIONS` are part of the description the result is judged by |
| D4 | Campaign seed | Defaults to the experiment's immutable identity `<experimentId>@<digest>`; per-run seeds are `seed(campaignSeed, index)` | Two hosts running the same registered manifest derive the same sequence with no number passed around |
| D5 | Stop conditions | Read from the manifest's `stopConditions`; a caller may only TIGHTEN them. `acceptance.minimumSuccessfulRuns` is NOT used as a stop | A criterion for judging a result is not a bound on producing it; using it would end a campaign at the first passing subset |
| D6 | Warmup | Supported and recorded, default 0. The REX-801 manifest contract has **no warmup field**, so a warmup is the operator's decision, not the experiment's description | Recorded as a finding (F7) rather than silently invented |
| D7 | Resume semantics | Resuming continues the SAME campaign (id, seed, bounds). The repetition the process died inside stays `INTERRUPTED` and is NOT re-run | Re-running it would replace a visible lost measurement with a later one and break "each repetition counted once" |
| D8 | Abandon | Explicit `abandon: true`; asking to resume nothing is refused (`NOTHING_TO_RESUME`) | An unfinished campaign is never quietly dropped, and a resume that silently started a new campaign would lose the thread of the evidence |
| D9 | UI placement | A new `Research campaigns` page beside `Research` in the Advanced group, not injected into the REX-801 Research page | Keeps the describe-surface and the run-surface independently resettable; final progressive disclosure belongs to REX-807 |
| D10 | Where does a run's reason live in the trace? | A sanitised bounded `dimensions.failureCode`; the full reason stays in the run row and the receipt | A trace dimension is a reference; free text belongs in the receipt |

## 3. Defects found during development, and how each was caught

```text
D-1  RESUME REPLAYED REPETITION 0. `drive()` always looped from index 0, so a resumed campaign appended a SECOND row
     for repetition 0 and the accounting invariant silently became false while still looking plausible.
     CAUGHT BY  this task's own engine test (duplicate measured index after resume). REPAIRED: a recorded row at this
     position means the repetition is accounted for, so the loop skips it.
D-2  TRACE RECEIPT INVALID. `deviceRef` was written into `dimensions`, where it is not a member of the dimension
     vocabulary, so EVERY run receipt failed validation inside the collector - which reports a failed record instead of
     throwing. The campaign looked traced and was not.
     CAUGHT BY  this task's route test (0 receipts where 3 were expected). REPAIRED: `deviceRef` is a canonicalRef.
D-3  UNKNOWN LIMIT KEY SILENTLY IGNORED. `limits: {madeUp: 1}` was accepted and dropped, so a caller who mistyped a
     bound would believe the campaign was bounded.
     CAUGHT BY  the refusal test. REPAIRED: an unknown limit key is refused by name.
D-4  NO WAY TO LEARN THE LIVE IDENTITIES A MANIFEST MUST DECLARE. The first browser campaign was refused
     `TOPOLOGY_NOT_READY` because the test (and any owner) had to guess the browser's control-surface ref.
     CAUGHT BY  the browser test. REPAIRED: the GET surface publishes the live worker and surface vocabulary, and the
     page shows it, because the only honest place to read those identities is the City.
D-5  MISLEADING STOP GUARD. A supplied `campaignId` was compared against the last campaign even when it had already
     finished, so a UI left open on a finished campaign got a 409 conflict instead of `stopped: false`.
     CAUGHT BY  the stop test. REPAIRED: the mismatch guard applies only while a campaign is RUNNING.
D-6  MEASUREMENT DEFECT (test harness, not product). The browser fixture failed every task from the Nth onward instead
     of the Nth, producing three failures where one was intended. The product was right; the fixture was wrong.
     Recorded, not hidden (evidence protocol §4).
D-7  THE CAMPAIGN SEED WAS THE WHOLE MANIFEST. REX-801's registry record exposes `digest` as the CANONICAL
     SERIALISATION of the manifest, not a hash of it, and the route used it directly as the campaign-seed component, so
     every run row, receipt and technical view carried `experimentId@<the entire manifest as JSON>`.
     CAUGHT BY  the FIRST PHYSICAL CAMPAIGN on the live City - not by any unit test, because the tests compared the
     seed against the same value they had used to build it, which is a weaker assertion than it looked.
     REPAIRED: the route hashes the registered document and uses a 32-character identity; the route test now asserts
     the seed SHAPE and, separately, that two campaigns of the same registered manifest derive the SAME seed, which is
     the property that was supposed to be tested. The registry's field naming (a serialisation called `digest`) is left
     as it is and raised as finding F9 for REX-801/REX-806.
D-8  AN UNUSABLE RECEIPT STORE BROKE THE CAMPAIGN LIST ROUTE (finding R-1). `receipts()` called readdirSync unguarded,
     so a single file sitting where `<runtime>/research/campaigns` belongs made `GET /api/v0/research/campaigns` throw
     ENOTDIR - the operator watching a RUNNING campaign lost sight of it even though the campaign itself was fine.
     CAUGHT BY  this task's own adversarial pass, written for this round because the opposite-host review is still
     outstanding. It is the third appearance of one failure shape in this programme: the REX-804 review blocked on a
     sibling module whose unreadable receipt stopped the City from starting, and MON-903's own pass found the same shape
     one round later. REPAIRED: the store is DEGRADED AND REPORTED - `receipts()` returns an empty list with
     `storeState: UNAVAILABLE` and a reason, `persist()` records `stateStoreFailure` instead of throwing, and the route
     publishes both. Two regression probes: one drives a campaign to completion with the receipt directory blocked and
     asserts the list route still answers and the measured outcome is still reported.
D-9  AN OUTSIDE CANCELLATION WAS CLASSIFIED AS A FAILURE (finding R-2). When an operator cancelled the run's canonical
     task through the canonical route, the run was recorded `FAILED` with the reason "the canonical task ended
     CANCELLED" - the reason was honest but the CLASS was wrong, and it mis-attributed the cause to the work.
     CAUGHT BY  the same adversarial pass. REPAIRED: an outside cancellation is `CANCELLED` with the reason "the
     canonical task was cancelled outside the campaign", so a reader can tell it from a campaign-stop cancellation, and
     `summary.failed` no longer counts it. A probe asserts the class, the reason and the accounting.
```

## 3Z. Adversarial self-test of this task's own deliverable (2026-10-06, before review)

With the opposite-host review still outstanding, this host ran an adversarial pass over the campaign surface - the same
reviewer's-eye method used on MON-903 in the previous round. Four probes were run; two properties held and two were
defects (D-8/R-1 and D-9/R-2), both repaired with regression guards.

```text
HELD   a 10,000-repetition campaign stopped immediately accounts for EVERY planned run exactly once
       (planned 10000 = accounted 10000; all 10000 explained as CANCELLED, none double counted, no missing rows)
HELD   canonical truth is untouched by a store failure: with the receipt directory blocked the task still reached
       COMPLETED and the campaign still reported its measured outcome
DEFECT R-1 (D-8) a blocked receipt store made the LIST route throw        -> degraded and reported, City-level guard
DEFECT R-2 (D-9) an outside cancellation was recorded as FAILED           -> classified CANCELLED with its reason
```

The pass is recorded because it is not a review: it raises the floor for the opposite-host reviewer, and it is how this
task's own defects were found rather than found by them.

**Cross-task consequence of the same sweep.** After repairing R-1 in this module, the same probe was pointed at every
other research store in the running City, and it found the shape STILL LIVE IN MERGED MAIN: the REX-801 experiment
registry turned one stray file at `<runtime>/research` or `<runtime>/research/experiments` into a City that will not
start. REX-801 is closed and merged, so this host did not touch its code on this task's branch; the measurement, an
adoptable repair (`repair/REX-801-mech-store-guard`) and the pattern analysis are recorded in
[../REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md](../REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md).

One round later the same sweep was widened from the research stores to **every file store the City touches at startup**
(eight traps, one shape, seconds to run). It found a second live instance in merged main - the capability-bridge
theme-artifact root, which bricked construction through `mkdirSync -> createThemeArtifacts -> createBridge ->
createGateway` - and, with it, a sharper lesson: a test for that exact scenario already existed and **passed on the broken
tree**, because it planted the fault after construction and so reproduced the symptom without the defect. Both instances,
the paired before/after sweep table and the second adoptable repair
(`repair/capability-bridge-mech-artifact-store-guard`) are in the same programme record.

### 3Y. A record defect caught in this host's own hand, before it was committed

```text
OBSERVATION   the first draft of this task's development_ci field (workbook) and CI line (this report) stated that the
              push run on a695bb9f had FAILED and passed on rerun, citing run ids that this host had NOT read from the
              Actions API. It had been written from the pattern of the PREVIOUS task (MON-903), where exactly that
              happened, rather than from a measurement of this head.
MEASUREMENT   the Actions API shows three runs on a695bb9f, ALL attempt 1, ALL success: push 37407868473,
              pull_request 37407871700, linkage 37407871716. No run on this head failed.
CLASSIFICATION  RECORD DEFECT (unmeasured CI claim) - the same class this host recorded against MON-902 one round
              earlier and against which the mission-book tooling README explicitly warns ("the checker cannot tell
              whether a CI claim is true"). It was caught by writing the record LAST, from a per-run read, and it never
              left this host.
GUARD         the discipline that caught it is now the stated rule: a CI field is composed from an API read of each
              run (event, attempt, headSha, conclusion); a pattern from another task is never a measurement. The record
              consistency checker cannot enforce this - it has no network access by design - so the guard is the
              procedure plus this recorded near-miss.
```

## 3A. Physical campaign on the live City (2026-10-06)

The workbook's gate asks for a controlled campaign on the Alien + Mech + Android topology. The Alien host was offline,
so this host ran the reachable half and recorded it as PARTIAL rather than as the gate:

```text
CITY        the resident City on this host was restarted from this branch (same host reservation, same data dir, so
            the enrollments and the cityId 031fdba6-e94c-4298-a095-6ff04a65481d persisted)
TOPOLOGY    worker  dev-031fdba6e94c4298a0956ff04a65481d (this host's reference node agent, online)
            surface dev-be7832e35fc34b85966c3bb43a992e1d  (physical Android handset OPPO PERM00 over ADB)
CAMPAIGN 1  mech-android-canonical-repetition     -> COMPLETED, 3 measured of 4 planned (1 warmup), 0 unexplained
CAMPAIGN 2  mech-android-canonical-repetition-r2  -> COMPLETED, 3 measured of 4 planned (1 warmup), 0 unexplained
EVIDENCE    utopia:evidence/raw/mission-book/REX-803/ (receipt, canonical tasks read back from the City, trace run
            receipts, progress samples, pre-state, the owner-facing page, the handset)
```

Every repetition was an ordinary canonical `WAIT` task carrying `researchRunRef = <campaignId>:<index>`, all four
`COMPLETED`, all executed by this host's node; the receipt satisfies `planned = accounted` with
`terminalAccountingComplete: true`; per-repetition seeds are distinct and derived; one trace run receipt exists per
settled run, each naming the real task. Campaign 1 is the run that found D-7, and campaign 2 is the same experiment
after the repair (`…-r2@b872f35c85a66fc1d9304d5cf0b7be2f`). The handset had to be RE-ENROLLED (its previous enrollment
was retired by the JOIN-590 revocation acceptance); the pairing payload is deliberately absent from the evidence
because it contains a secret.

## 4. Test evidence on the exact head

```text
node --test tests/rex803-scenario-runner.test.mjs     12 pass / 0 fail
node --test tests/rex803-campaign-surface.test.mjs     4 pass / 0 fail
node --test tests/rex803-campaign-web.test.mjs         2 pass / 0 fail
REX-801 + REX-802 + WBC-601..604 suites               51 pass / 0 fail
npm test (whole tests/ glob)                        1363 pass / 5 fail
```

The five failures are **inherited environment failures**, each classified and reproduced away from this change:

```text
capability-adapters.test.mjs  CORRUPT_INPUT in a document reader  -> reproduced identically at the baseline 213f9f9f
city-roads.test.mjs           CORRUPT_INPUT in a document reader  -> reproduced identically at the baseline 213f9f9f
host-city-launcher.test.mjs   x3 "requires a free coordination port" -> the resident City (pid 29048) holds the host
                              reservation; these are host-owning process tests and are green when run with no City up
CLASSIFICATION  ENVIRONMENT / PRE-EXISTING  (not product defects, not measurement defects of this task)
```

## 5. Real-hardware exercise and the workbook completion gate

The workbook's gate is "at least one controlled campaign on the Alien + Mech + Android base topology with a full
research trace". The *development-release* state of that gate, measured rather than assumed, is:

```text
CITY (read from /api/v0/city on 172.31.12.151:4391, 2026-10-06)
  the resident City now runs THIS branch (deployed for the campaign; the previous tree was join590)
  nodes       alien-reference-node  online=FALSE  lastHeartbeat 2026-10-05T11:15:06Z
              dev-031f...           online=true   (this host, executed every repetition)
              dev-e1d8...           online=FALSE
  surfaces    dev-be7832e35fc34b85966c3bb43a992e1d  (physical Android PERM00, controlOnline=true)
  members     Android PERM00 re-enrolled as dev-be7832e3... after its previous enrollment was retired by JOIN-590
GATE        Alien host node OFFLINE -> a two-host manifest cannot be READY, so the full gate cannot be met from this
            host alone. Mech + Android WAS exercised end to end (section 3A) and is recorded as PARTIAL GATE, never as
            the workbook gate. The Alien host cannot be started by this host.
```

RESTORE NOTE for the owner: the resident City is now running `D:/utopia-rex803` at 57d1c919. To return to the previous
tree, `D:/utopia-join590/scripts/stop-city.ps1` followed by `D:/utopia-rex803/scripts/start-city.ps1 -BindAddress
172.31.12.151 -Port 4391` from the desired worktree; the host reservation (`C:\ProgramData\Utopia\host\city`) is shared,
so the cityId, the store and the enrollments persist across the switch.

### 5A. The gate's blocker, measured rather than assumed (2026-10-06T02:25Z)

The Alien + Mech + Android experiment was REGISTERED on the live City and a campaign was attempted against it. The City
refused with `TOPOLOGY_NOT_READY` and named exactly one missing identity, `alien-reference-node`, alongside the live
worker and control surface it does have. The full measurement, the verbatim refusal and the one-command re-run
instructions are in [THREE_END_GATE_MEASUREMENT.md](./THREE_END_GATE_MEASUREMENT.md). The three-end experiment
(`mech-alien-android-two-host-repetition`, TWO_HOST_MESH, software ref `utopia@57d1c919…`) is now registered, so the
gate becomes a single POST once the Alien host's node is online. It remains a PARTIAL gate: no three-end campaign result
is claimed, and the Alien node has not been online at any point during this task.

## 6. Claim collision (recorded per the owner's rule)

Alien published the REX-803 claim at Digital-City `5baee25` (11:45:02); this host published its claim at `1acdc10`
(11:46:24) on top of it and rewrote the claim fields. Alien reconciled at `82acb5a` (11:56:16): Mech owns REX-803
canonically, Alien stops product changes on its parallel branch and claims REX-804. Mech's acknowledgement and the
complete root cause are in `CLAIM_COLLISION_MECH.md`; Alien's is in `CLAIM_COLLISION_ALIEN.md`.

```text
FAILURE CLASS   control-plane claim ownership drift / duplicate implementation of one task
RESEARCH LABELS DUPLICATE_IMPLEMENTATION_DUE_TO_DISCOVERY_FAILURE, MUTABLE_REFERENCE_STATE_DRIFT
REFERENCE       Alien candidate cae38b22bfb6c1050221aa4aa3e51844e3ec6e47 — read as DESIGN EVIDENCE, not merged
INHERITED       (1) a run executes a real canonical task; (2) the run reference is written onto that task, so
                orphaned campaign work is findable after a restart. Both are named here for the reviewer.
```

## 7. Open items handed to the reviewer

```text
O1  Opposite-host Formal Review not performed. Workbooks 803's named checks: repeated execution, cancellation,
    restart, timeout, partial campaign, seed reproducibility. REVIEW_HOST=Alien.
O2  `npm test` must be green except the five inherited environment failures above; the reviewer should confirm the
    same classification from their own host, where the resident City is not this one.
O3  The accounting invariant (`accounted === planned` with no class double counted) is asserted in tests; the reviewer
    should try to break it by a path the author did not think of (e.g. stop racing a timeout, resume racing a start).
O4  The Alien + Android half of the completion gate is unproven. This is a physical-topology blocker, not a code one.
O5  The manifest contract has no warmup field (F7). Raised here as a finding for REX-807/REX-801 follow-up; not
    repaired inside REX-803's file ownership.
F7  FINDING: an experiment describes repetitions but cannot describe warmup, so a campaign that uses warmup measures
    something the description does not contain. Recorded; the campaign receipt carries the warmup it actually used.
F8  FINDING (reality drift, observed on hardware): `ANDROID_CONTROL_SURFACE` is satisfied by a NAME, not by a platform
    fact. The topology gate requires a declared control surface whose text matches /android/i, while the City's native
    Android enrollment stores the device id as the app's client ref
    (`apps/android/app/src/main/java/city/utopia/control/NativeEnrollment.kt` writes `record.deviceId` into
    `clientRef`), so the live surface the City reports is `dev-be7832e35fc34b85966c3bb43a992e1d` - an identity that can
    never satisfy the Android topology. The physical campaign therefore declared `SINGLE_CITY`, which is the topology
    the City actually had. Recorded for REX-807; not repaired inside REX-803's file ownership.
F9  FINDING: REX-801's registry record field `digest` holds the canonical serialisation of the manifest, not a hash of
    it. The name and the content disagree, and using the field as an identity produced defect D-7. Raised for
    REX-801/REX-806.
F10 FINDING (LOW, from the physical run): after a campaign finishes, the owner-facing form still shows the values the
    operator last typed (repetitions 3, warmup 0) while the campaign that ran used warmup 1. The campaign totals state
    the truth, so nothing is hidden, but the form does not echo the running or last campaign's own parameters.
    Recorded for REX-807 (research control surface).
MERGE AUTHORITY  false — this host does not merge REX-803. Terminal marker NOT released.
```
