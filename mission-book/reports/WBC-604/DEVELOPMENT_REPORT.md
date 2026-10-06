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

## Still to do before WBC-604 can be called complete

```text
1  wire the control surface into the gateway: GET /api/v0/execution-profile (state) and POST /api/v0/execution-profile
   (change + rollback), owner-authenticated, and have the City snapshot report the LIVE profile from the controller
   instead of the startup-frozen CITY_EXECUTION_PROFILE value;
2  route the HYBRID decision through the claim path so rule precedence is enforced where work is actually assigned,
   and prove a task with no requirements keeps the legacy default;
3  fail-safe evidence the workbook demands: pool lost mid-flight does not touch canonical task truth; in-flight
   ownership follows the existing lease/recovery; rollback while in-flight;
4  exact-head CI, then the opposite-host Formal Review (another physical host has to attack switch race, stale
   readiness and strict-target-vs-hybrid preference).
```

The terminal marker `EXECUTION_PROFILE_SWITCH_COMPAT_ACCEPTED` is NOT released: the contract and its tests exist, but the
control surface is not yet reachable from the running City, which is exactly the gap between "the rule is implemented" and
"the user can switch without a code submission".
