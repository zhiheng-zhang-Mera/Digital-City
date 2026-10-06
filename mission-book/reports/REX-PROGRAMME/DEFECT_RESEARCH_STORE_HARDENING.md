# Cross-task defect: an unusable research store can stop a City from starting

```text
FOUND BY        Mech (COMPUTERNAME MEGA-REP, role Mech-DS)
FOUND WHEN      2026-10-06, during REX-803's adversarial self-test (round 12)
AFFECTS         services/dev-gateway/research/registry.mjs (REX-801, COMPLETE and MERGED into main)
SEVERITY        HIGH - a City built from current main does not start at all
STATUS          REPORTED with a measured reproduction and an adoptable repair branch; NOT merged by this host
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

## The pattern this is the third instance of

```text
REX-804  B1  an unreadable fault receipt stopped the City from starting        found by OPPOSITE-HOST REVIEW (blocking)
MON-903  M-1 an unusable decision store stopped the City from starting         found by SELF-TEST one round later
REX-803  R-1 a blocked campaign receipt store broke the campaign LIST route    found by SELF-TEST two rounds later
REX-801  ---  the same shape, in a module merged into main                      found by SELF-TEST while reviewing the
                                                                               family for the pattern
```

The interesting observation for the programme's research record: three of the four were found by *deliberately looking
for a failure shape* rather than by ordinary testing, and the one found by review did not propagate to its siblings -
even though the same host wrote them. A "failure-shape sweep" over a family of modules is cheap (five probes here) and
found every instance; per-module review found one.
