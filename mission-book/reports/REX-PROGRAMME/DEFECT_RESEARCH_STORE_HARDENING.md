# Cross-task defect family: one unusable file store can stop a City from starting

> This filename is historical - the first instance found was the research registry. The document now covers the whole
> family, because the second instance was found by sweeping every file store the City touches at startup and belongs in
> the same record.

```text
FOUND BY        Mech (COMPUTERNAME MEGA-REP, role Mech-DS)
FOUND WHEN      2026-10-06, during REX-803's adversarial self-test (round 12), then by a whole-City store sweep (round 13)
AFFECTS         services/dev-gateway/research/registry.mjs      (REX-801, COMPLETE and MERGED into main)
                services/capability-bridge/theme-artifacts.mjs  (MB-008 legacy migration, long since MERGED into main)
SEVERITY        HIGH - a City built from current main does not start at all
STATUS          both REPORTED with a measured reproduction and an adoptable repair branch; NOT merged by this host
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

Knowing the shape is worth more than knowing the instance, so the family was swept deliberately: **one probe per file store
the City touches at startup, each probe writing a FILE where the module wants a DIRECTORY.** Eight stores, the same
harness, run twice — once against `main` and once against the repair — so the before/after is a paired measurement rather
than a memory.

```text
TRAP                                      main 213f9f9f          repair/capability-bridge-mech-artifact-store-guard 8c67bb2
theme-packages (bridge artifacts)         BRICKED  EEXIST        STARTED   (startup-reachable)   <- the second instance
research (registry parent)                BRICKED  ENOTDIR       BRICKED   ENOTDIR
research/experiments (registry)           BRICKED  EEXIST        BRICKED   EEXIST
research/campaigns (campaigns)            STARTED                STARTED
monitor (decision store)                  STARTED                STARTED
research-trace (collector)                STARTED                STARTED
join-requests.json (join store)           STARTED; HTTP 400      STARTED; HTTP 400
execution-profile.json (profile)          STARTED; HTTP 200      STARTED; HTTP 200
```

Both runs exit 0; the harness (`D:\utopia-sweep\.sweep-startup-stores.mjs`) reports BRICKED only when `createGateway`
itself throws, which is what makes it a *City-does-not-start* measurement and not a route test. The two remaining BRICKED
rows are the already-reported REX-801 registry, which the branch above does not touch.

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

## The pattern this is the fourth and fifth instance of

```text
REX-804  B1  an unreadable fault receipt stopped the City from starting        found by OPPOSITE-HOST REVIEW (blocking)
MON-903  M-1 an unusable decision store stopped the City from starting         found by SELF-TEST one round later
REX-803  R-1 a blocked campaign receipt store broke the campaign LIST route    found by SELF-TEST two rounds later
REX-801  ---  the same shape, in a module merged into main                      found by SELF-TEST while reviewing the
                                                                               family for the pattern
bridge   ---  the same shape, in a second module merged into main              found by the deliberate whole-City SWEEP
              (capability-bridge theme artifacts)                              (six probes, two instances, one round)
```

The interesting observation for the programme's research record: four of the five were found by *deliberately looking for
a failure shape* rather than by ordinary testing, and the one found by review did not propagate to its siblings - even
though the same host wrote them. The sweep is cheap: eight stores, one shape, run in seconds, and it found every instance
that exists in the startup path. Per-module review found one; per-*shape* probing found the rest.

A second, sharper observation: **the existing test for the second instance passed on the broken tree.** It reproduced the
symptom (a failed build) without reproducing the defect (a City that cannot start), because it planted the fault after
construction. This is the same class of instrument error the programme already recorded twice — MON-902's CI claim read
from a load-sensitive wait, and REX-803's CI field drafted from an expectation — and it argues that a regression probe
should be falsified against the unguarded tree *before* it is trusted. Both repairs here were falsified that way, and the
falsification output (the `mkdirSync -> createThemeArtifacts -> createBridge -> createGateway` chain) is what is quoted
above rather than a reconstruction.

