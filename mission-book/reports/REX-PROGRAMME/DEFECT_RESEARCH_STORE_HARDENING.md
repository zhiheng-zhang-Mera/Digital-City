# Cross-task defect family: one unusable file store can stop a City from starting

> This filename is historical - the first instance found was the research registry. The document now covers the whole
> family, because the second instance was found by sweeping every file store the City touches at startup and belongs in
> the same record.

```text
FOUND BY        Mech (COMPUTERNAME MEGA-REP, role Mech-DS)
FOUND WHEN      2026-10-06, during REX-803's adversarial self-test (round 12), then by whole-City store sweeps (rounds 13-14)
AFFECTS         services/dev-gateway/research/registry.mjs      (REX-801, COMPLETE and MERGED into main)
                services/capability-bridge/theme-artifacts.mjs  (MB-008 legacy migration, long since MERGED into main)
                services/dev-gateway/store.mjs                  (canonical city.sqlite - bricking is CORRECT here, the
                                                                 diagnostic is not; see F-1)
                services/dev-gateway/join.mjs                   (silent durability loss - deliberate, unreported; F-2)
                services/dev-gateway/execution-profile.mjs      (WBC-604, COMPLETE; half-switch on store failure; F-3)
SEVERITY        Was HIGH: at `213f9f9` a City built from main did not start at all, in two instances. **RE-MEASURED 2026-10-06
                on current main `b06504f`: those two instances are CLOSED** - adopted into main by the CEX-790 integration
                (`65f86f9`) and verified by content here. What remains on main is one refusal where refusing IS correct but the
                message is untyped (F-1, `city.sqlite`), plus two silent/contradictory store failures (F-2 join silence,
                F-3 profile half-switch). No shape now stops a City from starting except the canonical store itself.
STATUS          four instances REPORTED with measured reproductions and falsified probes. **TWO REPAIRS ADOPTED INTO MAIN by
                content in `65f86f9`** (research registry, capability-bridge theme artifacts - see the re-measurement section;
                the sweep was re-run at `213f9f9` / `4688274` / `b06504f` with a byte-identical harness that first reproduced
                the old column). **TWO STILL OPEN**: F-1's typed diagnostic
                (`repair/mech-city-store-diagnostic-on-current-main @ be3670b`, one commit on top of current main, its three
                guard probes pass 3/3) and F-3's persist-first repair
                (`repair/WBC-604-mech-profile-persist-first @ 1f2f08c`, now **STALE** - cut before the CEX-790 integration, so
                adopting it as-is would delete that integration's tests; rebase onto current main first)
```

## What happens

`createExperimentRegistry` calls `mkdirSync(root, {recursive: true})` in its constructor without a guard. One file
sitting where the runtime directory wants a directory therefore makes `createGateway` throw, and the City never binds its
port. Measured against `main` = `213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef`, in a worktree created from that commit:

```text
TRAP AT <runtime>/research                 -> BRICKED   Error: ENOTDIR: not a directory, mkdir '<runtime>/research/experiments'
TRAP AT <runtime>/research/experiments     -> BRICKED   Error: EEXIST: file already exists, mkdir '<runtime>/research/experiments'
TRAP AT <runtime>/research/campaigns       -> STARTED   (REX-803; repaired by this programme's own self-test, R-1)
TRAP AT <runtime>/monitor                  -> STARTED   (MON-903; repaired by this programme's own self-test, M-1)
TRAP AT <runtime>/research-trace           -> STARTED   (REX-802 collector; already tolerant)
```

The trigger is externally caused - a hand edit, a foreign tool, a disk fault, a partially restored backup - because the
registry's own writes are atomic (temp + rename). The consequence, however, is the worst failure mode this programme
has: a City that will not start, with an untyped error and no diagnostics.

## Why this is recorded rather than quietly fixed

REX-801 is a **closed** task whose marker was released and whose code is already merged and running in main. This host
holds no claim on it, so the honest move is to publish the measurement, a minimal repair and its guard, and let the
programme's owner (or whoever holds the REX continuation) decide. Touching a closed task's merged module from inside
another task's branch would blur both records.

## The repair, adopted pattern

Every module in this family has now been repaired to one pattern - **degrade, report a typed reason, keep serving, guard
with a probe**:

```text
BRANCH      repair/REX-801-mech-store-guard @ a676c8c4dbebe9f1ed3f78e6c8fdfd99a620bcfb   (parent = current main)
CHANGE      services/dev-gateway/research/registry.mjs
              a store that cannot be created or listed -> storeState/storeReason, published by list()
              write() returns null instead of throwing, so register() answers persisted:false with persistFailure
            services/dev-gateway/server.mjs
              the registration route forwards persistFailure instead of dropping it between registry and caller
            tests/rex801-store-guard.test.mjs  (NEW)
              two probes, one per trap path: the City starts, the surface states the degraded store, a valid manifest
              is still validated and answered as "validated but not filed", and the City keeps serving
LOCAL       2/2 new probes; REX-801 manifest suite, the Alien independent-review suite, the research UI browser suite
            and the REX-802 gateway suite all pass (16 tests across those files)
CI          V0.2 checks push run 37408867982 COMPLETED SUCCESS on a676c8c4dbebe9f1ed3f78e6c8fdfd99a620bcfb (attempt 1),
            read from the Actions API and matched on headSha. A CI field is composed from a per-run read, never from an
            expectation - the rule this round recorded after a near-miss on REX-803's own CI field.
NOT DONE    the host did NOT merge it, did NOT change the registry's semantics beyond the guard, and did NOT touch main
```

## The whole-City sweep that found the second instance

Knowing the shape is worth more than knowing the instance, so the family was swept deliberately: one probe per file store
the City touches, writing a FILE where the module wants a DIRECTORY. The same harness was run against `main` and against
the repair, so the before/after is a paired measurement rather than a memory.

```text
TRAP                                      main 213f9f9f          repair/capability-bridge-mech-artifact-store-guard 8c67bb2
theme-packages (bridge artifacts)         BRICKED  EEXIST        STARTED   (startup-reachable)   <- the second instance
research (registry parent)                BRICKED  ENOTDIR       BRICKED   ENOTDIR
research/experiments (registry)           BRICKED  EEXIST        BRICKED   EEXIST
research/campaigns (campaigns)            STARTED                STARTED
monitor (decision store)                  STARTED                STARTED
research-trace (collector)                STARTED                STARTED
```

Both runs exit 0; the harness reports BRICKED only when `createGateway` itself throws, which is what makes it a
*City-does-not-start* measurement and not a route test. The two remaining BRICKED rows are the already-reported REX-801
registry, which the branch above does not touch.

The exact chain, read off the falsified probe rather than inferred:

```text
Error: EEXIST: file already exists, mkdir '<runtime>/theme-packages'
    at Object.mkdirSync (node:fs)
    at createThemeArtifacts (services/capability-bridge/theme-artifacts.mjs:6)
    at createBridge        (services/capability-bridge/bridge.mjs:31)
    at createGateway       (services/dev-gateway/server.mjs:323)
```

The second instance matters for the record because of *how it was hidden*: a test for exactly this scenario already
existed and passed on the broken tree. It plants the file **after** the gateway is already listening, so it only ever
exercised `allocate()`, never construction — the one place the fault actually lived. A probe that reproduces a symptom
is not a probe that reproduces the defect.

### Correction: the first sweep's table was two rows wider than its coverage

The first version of the sweep listed eight traps. **Only six were real.** For `join-requests.json` and
`execution-profile.json` the harness passed `relative = null`, i.e. it planted nothing, so those two rows exercised a
healthy runtime and printed a route status. Two further instrument defects were in the same two rows:

- the join row's `HTTP 400` was the probe's own bug — it sent `claimSecret` where the field is `claim` — so the request
  never reached the store and the 400 measured nothing;
- both of those stores are FILE stores, for which "a file where a directory belongs" is the wrong shape anyway. Their
  shape is the INVERSE one, and it had not been swept at all.

None of this is cleaned up: a published table that overstates its own coverage is exactly the kind of record drift this
programme's checker exists to catch, and the useful response is a corrected measurement, not a quiet edit.

### Sweep v2: both shapes, every trap proved to have engaged

The corrected harness is committed next to this record as
[`store-shape-sweep-v2.mjs`](./store-shape-sweep-v2.mjs); it runs from a Utopia checkout and reports **SHAPE A** (a file
where the module needs a directory) and **SHAPE B** (a directory where the module needs a file), and never prints a status
without saying what the status means. `NOT EXERCISED` is reported as a result, not as a pass.

```text
SHAPE A  a FILE where the module needs a DIRECTORY              main 213f9f9f      repair 8c67bb2
theme-packages (bridge artifacts)                               BRICKED EEXIST     STARTED
research (REX-801 registry parent)                              BRICKED ENOTDIR    BRICKED ENOTDIR
research/experiments (REX-801 registry)                         BRICKED EEXIST     BRICKED EEXIST
research/campaigns (REX-803 campaigns)                          STARTED            STARTED
monitor (MON-903 decision store)                                STARTED            STARTED
research-trace (REX-802 collector)                              STARTED            STARTED

SHAPE B  a DIRECTORY where the module needs a FILE              main 213f9f9f      repair 8c67bb2
city.sqlite (canonical store)                                   BRICKED            BRICKED    <- NEW INSTANCE
join-requests.json (join store)                                 STARTED            STARTED
execution-profile.json (WBC-604)                                STARTED, not exercised by a bare City

UNIT PROBES (traps a bare City cannot reach)                    main 213f9f9f      repair 8c67bb2
join store, unwritable file     request() RESOLVED PENDING, nothing persisted
profile store, unwritable file  change() THREW EPERM but the live profile moved STANDARD_DEVICES -> WORKER_POOL
```

Three findings come out of v2, and they are three *different* failure modes of one shape — which is the real reason the
sweep was worth widening:

```text
F-1  city.sqlite as a directory          createGateway throws "unable to open database file" and the City never starts.
                                          THIS ONE IS CORRECT BEHAVIOUR: a City without its canonical store has no task
                                          truth, so refusing to start is right - but the failure is untyped and gives an
                                          operator nothing to act on. The family rule is not "never fail"; it is "never fail
                                          silently or uninformatively".
F-2  join-requests.json as a directory    the City starts, POST /join/request returns HTTP 200 and the approver's row is
                                          created in memory, while NOTHING is persisted. This is deliberate - join.mjs:74-77
                                          says persistence "is a convenience for a City restart, not a correctness
                                          requirement ... the failure is silent by design". The design decision is defensible;
                                          what is missing is the third element of this programme's own pattern: REPORT THE
                                          TYPED REASON. An approver who approves a request that a restart will erase has been
                                          told nothing.
F-3  execution-profile.json unwritable    change() THROWS, but the live profile has ALREADY moved. The module's own
                                          header states rule 2 as "a failed activation leaves the CURRENT profile in place
                                          ... it never half-switches"; execution-profile.mjs:139-141 sets `profile = requested`
                                          BEFORE persist(), so a store failure produces exactly the half-switch the rule forbids,
                                          and the caller's exception hides it.
```

F-3 is a contradiction between a module's stated rule and its code, found by pointing a store at a shape the module's
own tests never used. F-2 is a *deliberate* silence that this programme's pattern would replace with a typed reason.
F-1 is the family shape landing on the one store where bricking is correct, and it sharpens the family rule rather than
extending the list of things to repair.

### 重新测量：CEX-790 集成之后 / Re-measured after the CEX-790 integration (2026-10-06, Mech)

本记录上面那张 v2 表的 `main` 列取自 `213f9f9`。此后对侧主机把 CEX-790 集成进了 main（`65f86f9` → `4688274` → merge `b06504f`），提交信息写的正是「isolate unavailable capability stores」。因此本机用**同一份** harness 重新测量了三个头，先确认仪器没变： / The v2 table's `main` column was measured at `213f9f9`. The opposite host then integrated CEX-790 into main, whose commit message is "isolate unavailable capability stores". So the same harness was re-run at three heads - and the old column was reproduced FIRST, so that the improvement below is a difference in the subject and not in the instrument:

```text
HARNESS   store-shape-sweep-v2.mjs, SHA256-compared byte-identical to the published one before each run
SHAPE A   a FILE where the module needs a DIRECTORY      213f9f9            4688274            b06504f (current main)
theme-packages (bridge artifacts)                        BRICKED EEXIST     STARTED            STARTED
research (REX-801 registry parent)                       BRICKED ENOTDIR    STARTED            STARTED
research/experiments (REX-801 registry)                  BRICKED EEXIST     STARTED            STARTED
research/campaigns (REX-803)                             STARTED            STARTED            STARTED
monitor (MON-903)                                        STARTED            STARTED            STARTED
research-trace (REX-802)                                 STARTED            STARTED            STARTED

SHAPE B   a DIRECTORY where the module needs a FILE      213f9f9            4688274            b06504f
city.sqlite (canonical store)                            BRICKED untyped    BRICKED untyped    BRICKED untyped   <- F-1 OPEN
join-requests.json (join store)                          STARTED (silent)   STARTED (silent)   STARTED (silent)  <- F-2 OPEN
execution-profile.json (WBC-604)                         not exercised      not exercised      not exercised

UNIT PROBES (traps a bare City cannot reach)             213f9f9            4688274            b06504f
join store, unwritable file                              RESOLVED PENDING, nothing persisted  (same at all three heads)  <- F-2
profile store, unwritable file                           THREW EPERM, live profile moved STANDARD_DEVICES -> WORKER_POOL
                                                         (same at all three heads)                                        <- F-3 OPEN
```

**这两处 BRICKED 是怎么没的，按代码核对而不按分支名：** `65f86f9` 对 `services/dev-gateway/research/registry.mjs` 与 `services/capability-bridge/theme-artifacts.mjs` 做的正是本记录 §"The repair, adopted pattern" 里那一套 —— 构造期 `mkdirSync` 包进 `try/catch`，置 `storeState='UNAVAILABLE'` + `storeReason`，`list()`/`write()` 改为降级返回而不是抛出，并随提交带上 `tests/rex801-store-guard.test.mjs` 与 `tests/bridge-artifact-store-guard.test.mjs`。也就是说：**本机发布的两个 store-guard 修复分支被按内容采纳了**（采纳方式是重写进集成提交，不是合并我的分支，因此按 sha 祖先关系查是查不到的 —— 这一点本身就是「按内容验证采纳」的必要性证据）。 / The two bricking rows are gone because `65f86f9` implements this record's own repair pattern in those two modules and ships the two guard tests with it. The two published repair branches were therefore adopted **by content**, not by merging their SHAs.

```text
STILL OPEN ON CURRENT MAIN
F-1  city.sqlite as a directory    refusing to start is correct, the bare "unable to open database file" is not
     REPAIR repair/mech-city-store-diagnostic-on-current-main @ be3670b
            parent = b06504f (current main), i.e. ONE commit on top of main - adoption is a fast-forward
            MEASURED at that tip: node --test tests/city-store-diagnostic.test.mjs -> 3/3 pass
            (typed refusal names the path and the reason; a corrupted database is refused the same way;
             CONTROL: a healthy runtime starts the City, so the refusals are about the store and not the fixture)
F-2  join-requests.json            deliberate silence, open by design decision - unchanged on main
F-3  execution-profile.json        change() throws but the live profile has already moved - unchanged on main
     REPAIR repair/WBC-604-mech-profile-persist-first @ 1f2f08c  **STALE**
            parent = 213f9f9, cut before the CEX-790 integration; `git diff --stat b06504f 1f2f08c` shows it would
            also remove that integration's tests (150 insertions, 4407 deletions). Whoever adopts it must rebase onto
            current main first; the part that matters is execution-profile.mjs plus its new failure test.
```

**这一轮的仪器纪律，值得单独记一句**：这份重新测量之所以可信，不是因为结果好看，而是因为同一份 harness 先在 `213f9f9` 上**复现了旧的 BRICKED 列**。若省掉那一步，「现在是 STARTED」既可能是修复，也可能是换了探针。 / The re-measurement is trustworthy because the identical harness first reproduced the old BRICKED column, not because the new result is nicer.

### 全量普查：current main 上还有没有第六个实例 / Census: is there a sixth instance on current main

上述扫描只覆盖 harness 里写死的那 6 个 store，所以「其它地方没有同类」这句话必须另外取证。对 `origin/main b06504f` 下 `services/` 的**每一处** `mkdirSync` 做普查，并把**实测**与**只读**分开标注： / The sweep only covers the six stores it names, so "nowhere else" needs its own evidence. Every `mkdirSync` under `services/` on `b06504f` was censused, with measured and read-only findings kept apart:

```text
MEASURED  research/registry.mjs:67         guarded (adopted in 65f86f9)      -> STARTED under the trap
MEASURED  capability-bridge/theme-artifacts.mjs:28  guarded (adopted in 65f86f9) -> STARTED under the trap
MEASURED  store.mjs:8                      unguarded                        -> BRICKED, untyped          (F-1, repair ready)
MEASURED  execution-profile.mjs:86         unguarded                        -> THREW EPERM after the live profile moved (F-3)
MEASURED  join.mjs:69                      unguarded, silent by design      -> HTTP 200, nothing persisted (F-2)
READ ONLY main.mjs:28        the City's data directory        inside the launcher's own try, which RETHROWS the raw error
READ ONLY host-city.mjs:32   the host state directory         same: refuse is correct, the message is not actionable
```

**两条 READ ONLY 是本记录明确没有实测的部分**：它们属于启动器一级的形状（数据目录 / 主机状态目录本身不可用），不是模块构造期的 store，本机没有为它们造 trap，因此**不主张**它们的行为，只记录代码事实——两处都在 `try` 里直接把原始错误抛出。真正要修的仍然是同一件事：**拒绝是对的，说不清原因不是**。 / Those two rows are explicitly NOT measured here: they are launcher-level shapes, and this record makes no behavioural claim about them - only that both rethrow the raw error, which is the same "refusing is right, being uninformative is not" question.

### F-3's repair, adopted pattern (third adoptable branch)

F-3 is the one of the three whose fix is both unambiguous and tiny — the module's own documented rule says what the
behaviour should be — so it carries an adoptable branch too:

```text
BRANCH      repair/WBC-604-mech-profile-persist-first @ 1f2f08ca4d947ef55c08b9aac946f424f4a28587
            (parent = main 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef)
CHANGE      services/dev-gateway/execution-profile.mjs
              persist() takes the profile to write as an argument and is called BEFORE the live assignment, so a store
              that refuses the write leaves the running profile where it was
              a refused write raises a typed ProfileChangeError(PROFILE_STORE_UNAVAILABLE), keeping the errno and path in
              `detail` for a log; the route used to surface `error.code` verbatim, so an owner saw EPERM and a path
            tests/wbc604-store-failure.test.mjs  (NEW, 3 probes)
PROBE       falsified on the unguarded tree, which reports the half-switch itself:
              "the running profile is UNCHANGED"  actual 'WORKER_POOL'  expected 'STANDARD_DEVICES'
            a positive control proves the reorder did not break persistence (a working store still records the NEW
            profile and a fresh controller still adopts it), and one probe states its own limit instead of overclaiming -
            the route's store branch is only reachable when a non-default backend is READY, which a bare City cannot
            offer, so the controller probe is the authority for the typed code and the route probe proves only the
            forwarding and the absence of a leak on the refusal it can actually reach
LOCAL       3/3 new probes; the three existing WBC-604 suites green (19 tests across the four files); full suite
            1348/1353. CORRECTED LATER - see "Correction: the five failures were not all environment" below: 3 were this
            host's resident-City reservation (a genuine host condition) and 2 were a missing `city` install on this host
            (a setup error of mine), not environment properties as first recorded
CI          V0.2 checks push run 37412629328 COMPLETED SUCCESS (attempt 1) on 1f2f08ca4d947ef55c08b9aac946f424f4a28587,
            jobs android and gateway-web both success; read per-run from the Actions API and matched on headSha
NOT DONE    WBC-604 is COMPLETE and this host did NOT reopen it, did NOT merge, and did NOT touch main
```

F-1 and F-2 are reported and **not** repaired here: `city.sqlite` lives in `services/dev-gateway/store.mjs`, and the
join store's silence is a documented design decision in `join.mjs:74-77` rather than a coding error, so both belong to
whoever owns those modules. The policy is the same one the two store guards were published under: measure, publish the
shape, let the owner adopt.

## The second repair, same pattern

```text
BRANCH      repair/capability-bridge-mech-artifact-store-guard @ 8c67bb224a4d52e47ee2cdd470690f50c39c72d6
            (parent = main 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef; two commits, the second from the analysis below)
CHANGE      services/capability-bridge/theme-artifacts.mjs
              construction catches its own mkdirSync/realpathSync failure -> storeState UNAVAILABLE + the filesystem's
              own errno; startup pruning runs inside the same guard; allocate() throws the typed
              BUILD_STORAGE_UNAVAILABLE the bridge already maps; finish() records the degradation and returns
              services/capability-bridge/bridge.mjs
              artifactStore() publishes state/reason (NOT_CONFIGURED is its own word: no root wired is a deployment
              choice, not a fault)
            services/dev-gateway/server.mjs
              health reports an `artifacts` component and deliberately EXCLUDES it from the degraded calculation
            tests/bridge-artifact-store-guard.test.mjs  (NEW, 5 probes)
LOCAL       5/5 new probes; theme-build-bridge suite (3 tests incl. the pre-existing one) green; full suite 1350/1355.
            CORRECTED LATER - see "Correction: the five failures were not all environment" below: only 3 of the 5 were a
            host condition, and 2 were a setup error of mine
CI          V0.2 checks push run 37410914313 COMPLETED SUCCESS (attempt 1) on 8c67bb224a4d52e47ee2cdd470690f50c39c72d6,
            jobs android and gateway-web both success; read per-run from the Actions API and matched on headSha. The
            first commit's run 37410520455 is also COMPLETED SUCCESS (attempt 1) on its own head 3a6b1572. Both CI
            fields are composed from a per-run read, never from an expectation - the rule this programme recorded after
            a near-miss on REX-803's own CI field.
NOT DONE    the host did NOT merge it, did NOT change what the theme lab produces, and did NOT touch main
```

Two findings inside this repair are worth carrying forward, because both are asymmetric on purpose:

1. **`allocate` throws; `finish` records.** A build with nowhere to put its package has genuinely not happened, so
   `allocate` refuses. But by `finish` the package and its digest already exist — and the bridge catches *any* throw from
   that path and rewrites the outcome to `BUILD_STORAGE_UNAVAILABLE`, so a bookkeeping fault (pruning, writing the
   `.completed` marker) would have reported a **real, verified build** as a storage failure. A guard that is applied
   uniformly to both entry points would have introduced a new lie while closing an old one.
2. **The state is live, not a construction-time verdict.** A root that is good when the City starts can still stop being
   one. If health kept saying READY until the next restart, a supervisor would learn that a capability had stopped
   persisting only after bouncing the City. The store flips to UNAVAILABLE the moment any entry point discovers it.

## The family, once the sweep was widened to both shapes

```text
REX-804  B1  an unreadable fault receipt stopped the City from starting        found by OPPOSITE-HOST REVIEW (blocking)
MON-903  M-1 an unusable decision store stopped the City from starting         found by SELF-TEST one round later
REX-803  R-1 a blocked campaign receipt store broke the campaign LIST route    found by SELF-TEST two rounds later
REX-801  ---  the same shape, in a module merged into main                     found by SELF-TEST while reviewing the
                                                                               family for the pattern
bridge   ---  the same shape, in a second module merged into main              found by SHAPE-A SWEEP
              (capability-bridge theme artifacts)                              (6 stores, 3 bricked, 1 repaired here)
city.sqlite F-1 a directory where the canonical database belongs stops the      found by SHAPE-B SWEEP
              City - bricking is CORRECT, the untyped message is not           (3 file stores, 1 bricked, 2 silent)
join     F-2  HTTP 200 and an approver row while nothing is persisted          found by SHAPE-B SWEEP + unit probe
              (deliberate silence, missing the typed reason)                   (silent by design, reported)
profile  F-3  change() throws while the live profile has ALREADY switched      found by SHAPE-B SWEEP + unit probe
              (contradicts the module's own stated rule 2)                     (half-switch, reported)
```

The observation for the programme's research record: five of the seven were found by *deliberately looking for a failure
shape* rather than by ordinary testing, and the one found by review did not propagate to its siblings - even though the
same host wrote them. Per-module review found one; per-*shape* probing found the rest, in seconds.

Three sharper observations, all of them about instruments rather than about product code:

1. **The existing test for the bridge instance passed on the broken tree.** It reproduced the symptom (a failed build)
   without reproducing the defect (a City that cannot start), because it planted the fault after construction. A
   regression probe should be falsified against the unguarded tree *before* it is trusted.
2. **The first sweep's table claimed two more traps than it planted**, printed an unexplained `HTTP 400`, and used the
   wrong shape for both file stores. Its own output contained the evidence — a status nobody could explain — and the
   useful response was a corrected measurement, not a quiet edit. This is the third instrument error this programme has
   recorded in two days, after MON-902's CI claim read from a load-sensitive wait and REX-803's CI field drafted from an
   expectation.
3. **Widening one shape from six traps to nine turned two bricking instances into four distinct behaviours** — brick,
   silent success, silent partial success, and a contradiction with the module's own documented rule. A sweep that had
   stopped at "does the City start" would have reported three of those as STARTED, i.e. as passes.

Both bricking instances found by shape A carry falsified probes and adoptable branches; the falsification output (the
`mkdirSync -> createThemeArtifacts -> createBridge -> createGateway` chain) is quoted above rather than reconstructed.

## Correction: the five failures were not all environment

Both repair records above, and the commit messages on both branches, describe this host's suite result as *"the 5
inherited environment failures … identical at baseline 213f9f9f"*. **Half of that was wrong**, and it was found while
independently reproducing a different host's integration, not while re-reading my own work:

```text
3 failures   host-city-launcher, "Requires a free local host reservation"
             GENUINE HOST CONDITION: the resident City on this machine holds the reservation.
2 failures   CORRUPT_INPUT in capability-adapters and city-roads
             MY OWN SETUP ERROR, not an environment property.
```

The falsification is a one-variable experiment on one worktree at one head, with the only difference being whether
`city/node_modules` exists:

```text
city/node_modules ABSENT    node --test tests/capability-adapters.test.mjs tests/city-roads.test.mjs
                            tests 11   pass 9    fail 2   (both CORRUPT_INPUT)
city/node_modules PRESENT   tests 11   pass 11   fail 0
```

The cause is mundane: `capability-adapters.test.mjs` imports the document readers from
`../city/09-planning-knowledge/…`, and those readers load `mammoth` / `pdfjs-dist` / `fflate` / `yaml`, which live in
`city/package.json` and are installed by a **separate, deliberate** step (`pnpm --dir city install`, `.github/workflows/
ci.yml` line 20). This host used a root-only `npm ci`, and `npm` at that, in a repository whose lockfiles are both pnpm.
The same root-only install is also why the integration's own `tests/cex790-current-inventory.test.mjs` failed here with
`Cannot find module 'yaml'` before that step was run, and why the audit's own documentation says to install both.

What this changes for a reader of this record: any "5 inherited environment failures" figure from this host means
*3 host-reservation failures plus 2 not-installed-dependency failures*. With the documented setup the correct figure is
**1356/1359**, the 3 remaining failures being the resident-City reservation. The commit messages on `repair/REX-801-…`,
`repair/capability-bridge-…` and `repair/WBC-604-…` still carry the old phrase; they are left as written, because
rewriting published history to hide a classification error is worse than the error, and this section is the correction
of record.

The gap that produced the error is a documentation one, and it is fixed the same way as the code findings — measured,
reported, published as an adoptable branch, not merged:

```text
BRANCH   repair/mech-readme-city-install-step @ b4dac610b09acf909a1758139ac8815517f2d014  (parent = main 213f9f9f)
WHY      the README's install block showed only `pnpm install --frozen-lockfile`, while `pnpm test` also needs
         `pnpm --dir city install --frozen-lockfile` (city/ is deliberately not a pnpm workspace and carries its own
         lockfile; ci.yml line 20 runs both). A root-only install therefore makes two suites fail with CORRUPT_INPUT,
         which reads like a product defect - exactly the trap this host fell into.
CHANGE   README.md: the missing command, plus a bilingual note naming the symptom so the next reader recognises it
CHECK    docs only; `node scripts/check-bilingual.mjs` reports every pair SYNCHRONIZED
CI       V0.2 checks push run 37414436113 COMPLETED SUCCESS (attempt 1) on b4dac610b09acf909a1758139ac8815517f2d014,
         jobs android and gateway-web both success; read per-run from the Actions API and matched on headSha
```


The pattern this belongs to is the one already stated three times above: **a measurement is only as good as the
instrument's setup, and an instrument that has never been asked whether its setup was complete will report a confident,
stable, wrong number.** The stable part is what made it convincing — the same two failures appeared in every run for
several rounds, which read as "environment" rather than as "not installed".

## The sweep re-run on merged main and on the pending merge candidate

Two things happened after the repairs were published: `origin/main` moved for the first time in this session (to
`b06504f`, the merge of PR #33, which carries the two adopted store-guard branches and their probes), and a second
branch became a merge candidate (Alien's REX-803 review candidate `8798ba9`). Both were swept with the same harness, so
the family record says what is true of the code that is actually about to run rather than of the commit it was measured
on months of work ago.

```text
SHAPE A  a FILE where the module needs a DIRECTORY        main 213f9f9f      merged main b06504f   REX-803 candidate 8798ba9
theme-packages (bridge artifacts)                         BRICKED EEXIST     STARTED               STARTED
research (REX-801 registry parent)                        BRICKED ENOTDIR    STARTED               STARTED
research/experiments (REX-801 registry)                   BRICKED EEXIST     STARTED               STARTED
research/campaigns (REX-803 campaigns)                    STARTED            STARTED               STARTED
monitor (MON-903 decision store)                          STARTED            STARTED               STARTED
research-trace (REX-802 collector)                        STARTED            STARTED               STARTED

SHAPE B  a DIRECTORY where the module needs a FILE
city.sqlite (canonical store)                             BRICKED            BRICKED               BRICKED       F-1 open by choice
join-requests.json (join store)                           STARTED            STARTED               STARTED       F-2 open by decision
execution-profile.json (WBC-604)                          half-switch        half-switch           half-switch   F-3 open, repair unadopted

UNIT PROBES
join store, unwritable file      request() RESOLVED PENDING, nothing persisted            unchanged on all three
profile store, unwritable file   change() THREW EPERM, live profile STANDARD -> WORKER_POOL unchanged on all three
```

The first three rows are the verification of this host's own adopted work: the two repairs that reached `main` through
PR #33 make the whole shape-A family start, on the merged main, not only on their own branches. That is a stronger
statement than "the branch was green" and it is the one the record needs.

The last two rows are the honest remainder, and one of them moved this round:

```text
F-1  city.sqlite as a directory still stops the City with "unable to open database file". Bricking is CORRECT here;
     only the diagnostic is missing. Reporter unchanged, unrepaired by design.
F-2  the join store still returns HTTP 200 with an in-memory row and persists nothing, deliberately and silently.
     Reported; the silence is a documented design decision in join.mjs, not a coding error.
F-3  the execution-profile half-switch is STILL LIVE ON MERGED MAIN: change() throws a raw EPERM while the live profile
     has already moved STANDARD_DEVICES -> WORKER_POOL. The repair for it has been published since round 15 and has
     never been adopted, so the defect outlived two merges.
```

F-3 is the one this host decided to make maximally easy to adopt rather than merely re-report: the repair was
cherry-picked onto **current main** and published as
`repair/WBC-604-mech-profile-persist-first-on-current-main @ ad1b3e8`, so its CI runs the whole merged suite instead of a
branch built on a base that is two merges old. Measured on that branch:

```text
focused   the F-3 probes plus the three existing WBC-604 suites    19 pass / 0 fail
sweep     profile store, unwritable file -> change() THREW PROFILE_STORE_UNAVAILABLE;
          live profile STANDARD_DEVICES -> STANDARD_DEVICES        (was EPERM and STANDARD -> WORKER_POOL)
full      1359/1362, the 3 failures being this host's resident-City host reservation
CI        V0.2 checks push run 37425834472 COMPLETED SUCCESS (attempt 1) on ad1b3e8, jobs android and
          gateway-web both success
```

This is the same lesson the B4 finding taught one round earlier, stated as a rule: **a repair must be measured on the
merge result, not on its own old base.** A branch that is green against a base two merges behind is evidence about a
commit nobody will run.

## The family now has one guard instead of five scattered probes

Every instance above was repaired where it was found and shipped with that module's own probe, which is why the file
names read like a list: `rex801-store-guard`, `bridge-artifact-store-guard`, the MON-903 sibling sweep, the REX-803
receipt/close probes, the REX-804 B4 guard. Five probes over five modules, and no guard over the **family** - which is
precisely why the sixth instance was always going to land silently. There is now one:

```text
test/mech-startup-store-family-guard @ 8e1c1c5   (base = the F-3 repair on current main, ad1b3e8)
  tests/startup-store-family-guard.test.mjs
```

It is deliberately about the shape rather than about any one module, and the list of stores is the thing a new module
has to join:

```text
SHAPE A  a file where a startup store needs a directory, for every store the City touches while being constructed -
         theme-packages, research, research/experiments, research/campaigns, research/faults, monitor, research-trace.
         The City must START and report itself serving.
SHAPE B  the canonical database is the ONE case where refusing to start is CORRECT, and the case asserts the refusal is
         DIAGNOSABLE rather than pretending bricking should be degraded away (F-1, open by choice).
SHAPE B  the join store is pinned as KNOWN BEHAVIOUR, not as a desired one (F-2, reported, not repaired here) - a guard
         that quietly accepts a defect is worse than no guard, because it looks like coverage.
SHAPE B  a profile the City cannot persist is refused with a typed code and the running profile does not move (F-3,
         repaired on this branch).
CONTROL  with every store healthy the City starts, serves and accepts a task, so the SHAPE A loop cannot pass by the
         City refusing to run for some other reason.
```

**Falsified before trusted.** Run against unmodified main `b06504f` the same file gives **11 pass / 1 fail**, and the
single red case is exactly the live defect:

```text
✖ SHAPE B: a profile the City cannot persist is refused, and the running profile does not move
  AssertionError: and typed, not a raw filesystem errno   actual: 'EPERM'
```

With the F-3 repair present, **12/12**. A guard that has never been seen to fail is not evidence, which is the same
rule the individual probes were held to.

CI          V0.2 checks push run 37429465001 COMPLETED SUCCESS (attempt 1) on 8e1c1c5, jobs gateway-web and
            android both success
FULL SUITE  1371/1374 on the branch, the 3 being this host's resident-City host reservation

[完整中文阅读译本 / Chinese reading translation](./zh-CN/DEFECT_RESEARCH_STORE_HARDENING.md)
