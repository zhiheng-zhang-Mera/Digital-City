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
SEVERITY        HIGH - a City built from current main does not start at all (two instances), plus two silent/contradictory
                store failures in merged main
STATUS          every instance REPORTED with a measured reproduction; an adoptable repair branch exists for the two
                bricking instances; F-1/F-2/F-3 are reported and NOT repaired by this host
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

All three are reported, none is repaired here. `city.sqlite` lives in `services/dev-gateway/store.mjs` and the other two
in `join.mjs` and `execution-profile.mjs` — core modules and a closed WBC task — so the same policy as the two store
guards applies: publish the measurement and the shape, let whoever owns the module adopt it.

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
LOCAL       5/5 new probes; theme-build-bridge suite (3 tests incl. the pre-existing one) green; full suite 1350/1355
            with the 5 known inherited environment failures, identical at baseline 213f9f9f
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


