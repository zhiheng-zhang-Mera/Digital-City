# WBC-604 progress (round 2026-10-05, Mech)

```text
WORKBOOK     WBC-604 execution profile switch + HYBRID routing
CLAIMED      dc 6280ba8   host Mech (Mech-DS)   branch wbc/WBC-604-mech-execution-profile-switch
BASELINE     1a26d7499d3de39b19c3136c3032e8ccd9343428  (= refs/heads/main; it already contains WBC-603 f3510862 and
             the required ancestor 9f3e20e8, both verified ANCESTOR_OK, so the dependency union needed no constructed merge)
SMOKE        WBC-601/602/603 suites 32/32 at the baseline, run before any product change
```

## Done this round

```text
services/dev-gateway/execution-profile.mjs   NEW
  createExecutionProfileController({dir, registry, initial})
    state()      -> profile, defaultProfile, every profile's readiness + activatable, how the selection was decided
    change(p)    -> readiness-gated activation with a receipt, or a TYPED refusal (PROFILE_UNKNOWN / PROFILE_NOT_READY)
    rollback()   -> STANDARD_DEVICES, always enterable, needs no schema change
    persistence  -> execution-profile.json written through a temp file + rename; missing, corrupt or UNKNOWN persisted
                    values are NOT obeyed: the controller recovers to STANDARD_DEVICES with the reason recorded
  chooseHybridTarget({task, candidates, poolAvailable})  -> {chosen, rule, reason}
    the seven workbook rules as an ordered precedence: strict target > hard platform/capability requirement >
    trust/readiness > legacy-no-requirements stays default > policy-gated fallback > validation node for
    platform-validation work > load last. Every answer names the rule that decided it.

tests/wbc604-execution-profile.test.mjs   NEW   10 tests, 10 pass
```

## Done in round 2 (control surface reachable from the running City)

```text
services/dev-gateway/server.mjs
  * the controller is created after the backends are registered, reading readiness through
    executionBackends.forProfile(profile).readiness(); a DORMANT backend reports ABSENT instead of throwing, which is
    what keeps "the pool is not there yet" from becoming a City that will not start;
  * GET  /api/v0/execution-profile  -> the state: live profile, default, every profile's readiness + activatable, and
    how the selection was decided (DEFAULT / PERSISTED / RECOVERED_TO_DEFAULT);
  * POST /api/v0/execution-profile  -> {profile} to change or {action:'ROLLBACK'} to roll back; a refusal answers the
    controller's typed code (PROFILE_NOT_READY / PROFILE_UNKNOWN) with HTTP 409 and CHANGES NOTHING;
  * both routes are owner-only: a member session is refused, because where work runs is an owner-level decision;
  * the City snapshot's executionBackend.profile now reports the LIVE profile instead of the startup value.

tests/wbc604-profile-route.test.mjs   NEW   2 tests (route contract + persisted selection across a restart)
VERIFIED  32 tests / 32 pass across wbc604 (unit + route), wbc601, wbc602, wbc603 and mon901 - no regression from the
          wiring; branch head d5382a799a656dbed03c95da4707aeee19c87d79 pushed, hosted CI in flight.
```

## Still to do before WBC-604 can be called complete

```text
1  call chooseHybridTarget from the CLAIM path so the precedence is enforced where work is actually assigned. The
   contract and its ten tests exist, but today the only enabled profile is STANDARD_DEVICES (the pool backend is
   registered DORMANT), so the claim path's current behaviour is already correct and the invocation is only meaningful
   once a pool backend can be enabled - which is exactly what the WORKER_POOL activation this task adds would allow;
2  fail-safe evidence the workbook demands: pool lost mid-flight does not touch canonical task truth; in-flight
   ownership follows the existing lease/recovery; rollback while a task is in flight;
3  exact-head CI on this branch, then the opposite-host Formal Review (another physical host has to attack switch race,
   stale readiness and strict-target-vs-hybrid preference).
```

The terminal marker `EXECUTION_PROFILE_SWITCH_COMPAT_ACCEPTED` is NOT released: the contract and its tests exist, but the
control surface is not yet reachable from the running City, which is exactly the gap between "the rule is implemented" and
"the user can switch without a code submission".
