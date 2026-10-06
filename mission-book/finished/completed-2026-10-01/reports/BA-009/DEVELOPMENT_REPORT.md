# BA-009 Development Report — Duties, Permission + Proactivity Policy

```text
MISSION                  = BA-009 (Butler Assistant programme, task 9 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = c9f1876 (Digital-City main, "claim(BA-009): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T17:26:15Z
CONTROL_REVISION_AT_CLAIM= cdeff53 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = assistant/BA-009-duty-permission-policy
IMPLEMENTATION_HEAD_SHA  = 9e1de31ba53766758406e991dbacdb8f707b1bfc (pushed)
BRANCH_CI                = 36750981300 — BLOCKED: the jobs never started
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 69/69, city 1801 pass/0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = **false** — deliberately NOT claimed (see §5b)
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 0. Blocker (read this first)

**The implementation and all local checks are complete, but this task's `development_complete` is
deliberately left `false` because hosted CI could not run.**

GitHub Actions refused to start *both* jobs of run `36750981300`:

```text
X The job was not started because recent account payments have failed or your spending limit needs to be
  increased. Please check the 'Billing & plans' section in your settings
android: .github#1 … gateway-web: .github#1
```

Evidence that this is an **account-level external blocker and not a defect in this branch**:

- The same push was retried (`gh run rerun 36750981300 --failed`) and failed identically, with the same
  billing annotation and zero job steps executed (2–3 s per job).
- Alien's two concurrent GAI-004 correction pushes (`36750532324`, `36750532665`) failed the same way.
- My immediately preceding runs on the same checkout machinery succeeded: EM-011 `36750007584` (4m10s) and
  RF-010 `36749030367` (3m50s).

The workbook rule is "push and run relevant GitHub CI; mark `development_complete` only when green", so the
honest state is *implemented + locally verified + CI unverifiable*. The claim is retained (the contract says a
hosted-CI wait must not idle a host or drop the claim), and the exact proof is deferred to the Owner fixing
GitHub billing.

**This never licenses a workaround.** Nothing here is written to GitHub main as complete, no CI result is
invented, and the workbook frontmatter records `36750981300-BLOCKED_GITHUB_ACCOUNT_BILLING`.

## 1. Deliverable

`contracts/assistant-duty-policy-v1/` — `duty-policy.mjs` (duty policy, proactivity levels, the four-axis
permission equation, handoff non-elevation, recomputation triggers, lease-is-not-permission, shared-core
contribution), `index.mjs`, 7-test suite, root `tests/assistant-duty-policy.test.mjs`.

Acceptance mapping (all verified locally; CI column unavailable):

| Required acceptance | Test |
|---|---|
| Two assistants can have different duties/proactivity while sharing the same authorized user context | `two assistants hold different duties and proactivity over one authorized user context` (same action ⇒ `CONFIRMATION_REQUIRED` for one, `REFUSED`/`OUT_OF_DUTY` for the other) |
| Out-of-duty requests are refused/delegated without changing underlying permissions | `out-of-duty requests are refused or delegated without changing permissions` (`underlying_permissions_changed: false`, `delegated_to: SHARED_CORE_DUTY_MATCHER`) |
| Changing duties is independent of Digital-Me canonical data | Test 1 (`writes_digital_me: false`) and `writeDigitalMe()` refusing with `DIGITAL_ME_IS_READ_ONLY` |
| Handoff to a less-privileged assistant remains less privileged; the payload cannot elevate it | `a handoff to a less-privileged assistant stays less privileged` (`HANDOFF_CANNOT_ELEVATE`, `recipient_inherits_grants: false`, `authority_transferred: false`) |
| Moving execution to a device lacking the required capability blocks the action even if the task owner is authorized | `effective permission is the four-axis intersection and a lease never substitutes for it` (`reason: CAPABILITY_MISSING`, `task_owner_authorized: true`) |
| Tests cover allowed, denied, confirmation-required, proactive-notification, handoff, reconnect and capability-loss boundaries | Tests 1–6 (each decision value appears: `ALLOWED`, `DENIED`, `CONFIRMATION_REQUIRED`, `PROACTIVE_NOTIFICATION`, `REFUSED`) |
| The normative equation `User/OwnerPolicy ∩ AssistantPolicy ∩ DeviceCapability ∩ TaskActionGrant` | Test 3 (each axis individually required and named in `denied_axes`) |
| A valid execution lease is an extra safety prerequisite, not a permission source | Test 3 (`lease_would_not_help: true`, `lease_does_not_grant_forbidden_capability: true`) |
| Permission recomputed after handoff/executor/device change, reconnect or capability change | `permission is recomputed after handoff, device change, reconnect and capability change` (all six triggers, `cached_decision_reused: false`, `inherited_permission: false`) |
| Contribute AssistantPolicy into Shared Core rather than a second global engine | `sharedCoreContribution()` (`is_second_global_policy_engine: false`, `root_core_authority_moved: false`, `fabric_revalidates_effective_decision: true`) |
| Proactivity/notification boundaries | `proactivity levels bound initiative and notification audiences` (SILENT/ NOTIFY / act-level, audience scope, deployment ceiling) |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible Correction for Mech (Alien holds
BA-004…BA-008, EM-004…EM-011, GAI-003…008, RF-004…010 Corrections; GAI-004 in progress). Tie-break after
EM-011 excluded Engineering, so BA-009 was chosen: it is the policy engine that RF-010's public boundary and
the GAI consent gate reference (`policy.evaluate()`), so leaving it unimplemented leaves those seams
unverifiable, and it is the last Butler policy task.

**D2 — The equation, literally.** CHOICE: `decide()` evaluates all four axes and returns the grant only when
every one holds, naming the missing axes in `denied_axes`, and it publishes the negatives —
`lease_is_not_permission`, `persona_is_not_permission`, `profile_is_not_permission`,
`relationship_state_is_not_permission`, `foreground_is_not_permission`. Reason: the workbook states the
equation normatively and lists "granting permissions merely because personality/profile says so" and "treating
an execution lease as a substitute" as out of scope; publishing the negatives makes each prohibition
checkable instead of implied.

**D3 — What does a lease do here?** CHOICE: a lease is validated as an execution-safety prerequisite and is
reported as `lease_usable`, but a policy denial or a missing capability is returned unchanged with
`lease_would_not_help: true`. Reason: the workbook calls the lease "an additional execution-safety
prerequisite; it is **not** a source of permission". The test supplies a perfectly valid lease with one axis
denied and asserts the denial survives — the case a reviewer actually worries about.

**D4 — Duty vs permission.** CHOICE: duty is checked first; an out-of-duty action is `REFUSED` with
`underlying_permissions_changed: false` and a delegation target, never a permission edit. Reason: the
acceptance bullet requires out-of-duty requests to be "refused/delegated without changing underlying
permissions"; separating the two avoids the trap where refusal is implemented by revoking something.

**D5 — Handoff.** CHOICE: `evaluateHandoff` recomputes both assistants' decisions from their own duty
policies; a handoff payload carrying `grants` throws `HANDOFF_CANNOT_ELEVATE` before any decision is taken,
and the result states `recipient_inherits_grants: false`, `authority_transferred: false`,
`recipient_more_privileged_than_before: false`. Reason: invariant 5 and the out-of-scope item "copying the
outgoing assistant's permissions to the recipient during handoff". Refusing the payload outright is stronger
than filtering it, because it also catches a caller that believes it transferred authority.

**D6 — Recompute triggers.** CHOICE: six triggers (`HANDOFF`, `EXECUTOR_CHANGE`, `DEVICE_CHANGE`,
`RECONNECT`, `CAPABILITY_CHANGE`, `DUTY_CHANGE`), each returning `recomputed_after_change: true`,
`cached_decision_reused: false` and `inherited_permission: false`. Reason: invariant 6 and the workbook's
"require permission recomputation after handoff, executor/device change, reconnect or capability change";
the test drives every trigger rather than one representative.

**D7 — Proactivity.** CHOICE: five levels with a deployment ceiling; `SILENT` never notifies, `NOTIFY`/
`SUGGEST` produce a notification (never an action, `initiative_executed: false`), act-levels require
confirmation; notification audiences are enforced rather than widened. Reason: "proactivity levels and
notification/initiative boundaries" plus "autonomous expansion into new capabilities" being out of scope. The
ceiling check means a single assistant cannot widen its own initiative.

**D8 — Where policy lives.** CHOICE: `sharedCoreContribution()` states that AssistantPolicy is contributed
into the Shared Core policy contract, is not a second global engine, moves no Root/Core authority and will be
revalidated by Remote Fabric at the target. Reason: the workbook requires exactly that, and it is also what
RF-010 expects on the other side of the seam.

**D9 — Defect found by the suite.** The `setDutyPolicy({ duties })` parameter shadowed the internal `duties`
map, so every policy write threw `TypeError: duties.get is not a function` — the module was unusable. Renamed
the parameter to `duty_refs`. (This is the kind of defect that a "looks fine" review misses and a first
execution catches immediately.)

**D10 — No `schema.json`.** Consistent with every other component branch.

## 3. Exact files

| File | Change |
|---|---|
| `contracts/assistant-duty-policy-v1/duty-policy.mjs` | new — duties, proactivity, equation, handoff, recomputation, lease boundary |
| `contracts/assistant-duty-policy-v1/index.mjs` | new — public surface |
| `contracts/assistant-duty-policy-v1/tests/conformance.test.mjs` | new — 7 conformance tests |
| `tests/assistant-duty-policy.test.mjs` | new — root runner entry (101 → 108 repository tests) |

No City/Core file, manifest or doc was changed, so the merge stays additive.

## 5b. Why `development_complete` is false

The workbook's Development stage requires: implement → add tests → **push and run relevant GitHub CI** →
write the report → **mark complete only when green**. Steps 1, 2, 4 are done and step 3's push happened, but
the CI run never executed a single step because of the account billing block. Marking complete would rewrite
an external failure as success, which the same workbook (and the cross-programme contract) forbids. The task
therefore stays `IN_PROGRESS` with its implementation pushed and locally verified, and the exact remaining
proof is "GitHub Actions must be able to start a job again".

## 4. Test summary, failures and fixes

7 tests. Two failures on first run: **one genuine module defect** and two corrected expectations.

1. **Defect:** the `duties` parameter shadowed the `duties` map in `setDutyPolicy`, so no policy could be set
   at all (D9). Fixed by renaming the parameter.
2. **Expectations:** the butler's `ACT_WITH_CONFIRMATION` proactivity was expected to yield `ALLOWED` for an
   in-duty action; the module correctly returns `CONFIRMATION_REQUIRED`, which is exactly what that level
   means. The test now asserts both the confirmation case (butler) and a genuinely allowed case (specialist at
   `NOTIFY`), which is a stronger check than the original.

## 5. Local checks and CI

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node --test apps/rooms/tests/*.test.mjs` | 69 pass, 0 fail |
| `node city/test-all.mjs` | 1801 pass, 0 fail |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node scripts/check-bilingual.mjs` | PAIR_STATUS = SYNCHRONIZED (docs, evidence, data-records) |
| GitHub CI 36750981300 on 9e1de31ba53766758406e991dbacdb8f707b1bfc | **BLOCKED** — jobs not started (account billing); retried once with the identical result |

## 6. Integration seams handed to sibling tasks

- **RF-010 (Fabric public API):** its `policy.evaluate()` is this module's decision; the four axes match
  exactly, and RF-010's own statements (`session_is_permission: false`) are the transport-side mirror of this
  module's `lease_is_not_permission`.
- **BA-004 (handoff) and BA-006 (task graph):** a handoff transfers responsibility only; the recipient's
  permission must be recomputed here, and BA-006's owner/executor split is what this policy is evaluated
  against.
- **BA-005 (Digital-Me gateway):** duties are assistant-owned and never rewrite canonical user data; the
  gateway remains the read-only source, and this module refuses the write path explicitly.
- **BA-008 (embodiment bus/leases):** a lease is an execution-safety prerequisite; BA-008 should ask this
  module for the decision *before* arming a lease, not after.
- **GAI-004 / GAI-005 (consent, triage) and GAI-008 (health):** the consent gate and the triage confirmation
  route are separate gates from this duty policy; all of them must hold for an API run, and none may be
  substituted for another.
- **EM-009 / EM-010:** an engineering worker's authority is the intersection of this policy and EM-010's
  placement; a lease (EM-009/BA-008) never widens it.
- **Owner actions (now blocking):** GitHub Actions billing must be restored before any further component task
  can reach a verified `development_complete`.
- **Owner question (unchanged):** whether the evolution feed should record component-stage events.

## 7. Open items for the Correction host

1. Adversarial review should try: a duty policy with `duties: ['*']` plus `SILENT` proactivity (currently an
   out-of-duty action is refused before proactivity is consulted — confirm the ordering is intended); two
   assistants whose duties overlap but whose proactivity differs (covered); a `decide()` call with a lease for
   a *different* holder (currently only `lease_valid` and `lease_ref` are read — a holder mismatch is not
   checked, which may be a real gap); a `recomputeForChange` with `DUTY_CHANGE` while the duty policy was
   concurrently replaced (synchronous here, so the interleaving cannot be expressed); and an audience list
   containing a canonical audience twice.
2. Confirm D3 (a valid lease never rescues a denial) and D5 (a grants-bearing handoff is refused outright
   rather than filtered).
3. Correction cannot be claimed against this task until CI can run: `development_complete` is false, which is
   the two-host gate's precondition. **The Correction host must not treat this branch as ready.**

```text
DEVELOPMENT_COMPLETE = false (CI blocked by an external account-billing condition; not a code failure)
CORRECTION_ELIGIBLE  = false until CI is green
MERGE_STATUS         = FORBIDDEN_UNTIL_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
