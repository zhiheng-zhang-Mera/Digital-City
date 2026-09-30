# BA-004 Development Report — Multi-Assistant Switching + Explicit Task Handoff

```text
MISSION                  = BA-004 (Butler Assistant programme, task 4 of 9)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 76de149 (Digital-City main, "claim(BA-004): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T14:04:09Z
CONTROL_REVISION_AT_CLAIM= b7e8eb3 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = assistant/BA-004-multi-assistant-handoff
IMPLEMENTATION_HEAD_SHA  = a29062fba3e88abee1830c4f1ecbd6c55e6d1c79
BRANCH_CI                = 36726727943 — success
LOCAL_CHECK_SUMMARY      = 108/108 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/assistant-handoff-v1/` — `handoff.mjs` (handoff package + validation + authority-field guard,
recipient authority recomputation, canonical task-store port and double, the handoff coordinator, and
foreground switching), `index.mjs`, 7-test suite, root `tests/assistant-handoff.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| phone foreground A→B leaves A's unrelated background task running and owned by A while A is online | `switching the foreground assistant touches no task` (`tasks_touched: 0`, zero store writes, outgoing assistant still online) |
| no responsibility transfer produces an immediate foreground switch with zero handoff | same test: `is_a_handoff: false` and `handoff_required_for_ownership_change: true` |
| a true transfer produces a machine-readable handoff, re-evaluation, acknowledged takeover and one authoritative owner | `a true transfer needs acceptance and leaves exactly one authoritative owner`; `a handoff carries responsibility and never authority` |
| rejected/expired handoff leaves the old authoritative owner unchanged | `a rejected or expired handoff leaves the authoritative owner unchanged` |
| executor is not restarted merely because the owner changed | same test as row 3 (`executor_moved: false`, executor unchanged) plus `an explicit executor move is carried by the handoff` |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair, no eligible opposite-host Correction
(Alien was correcting GAI-002), so the unclaimed-Development tier applied. BA-004 chosen under the
tie-break (different programme from my EM claim) and because it owns invariant 11.

**D2 — One operation or two?** CHOICE: switching and handoff are separate functions with separate
return shapes: `switchForegroundAssistant` reports `tasks_touched: 0`, `task_ownership_changed: false`,
`is_a_handoff: false`, and `handoff_required_for_ownership_change: true`. Reason: the workbook's first two
acceptance lines are precisely about *not* confusing them; making the report itself state which operation
occurred is what lets a caller (and a reviewer) tell them apart without reading the implementation.

**D3 — Does a handoff carry authority?** CHOICE: never. A recursive authority-field guard refuses a
package naming `grants`, `permissions`, `capabilities`, `lease`, `execution_lease`, `action_key`,
`authority`, `policy`, `scopes` or `access_token` (`HANDOFF_TRANSFERS_NO_AUTHORITY`), and the recipient's
effective authority is recomputed from policy as an intersection with `transferred_grants: []`. Reason:
invariant 11 and the out-of-scope line "copying permission grants, device grants, leases or action
approval across handoff". Refusing the *field* matters because a handoff that carries a grant would be
indistinguishable from a legitimate one at the receiving end.

**D4 — When is a takeover authoritative?** CHOICE: only on the recipient's own acceptance
(`NOT_THE_RECIPIENT` otherwise); proposing changes nothing (`ownership_changed` only on accept); the
checkpoint travels with a responsibility transfer (`CHECKPOINT_REQUIRED`). Reason: "require recipient
acknowledgement/acceptance before ownership changes become authoritative" and "rejected/expired handoff
leaves the old authoritative owner unchanged".

**D5 — Where is the capability shortfall enforced?** PROBLEM: my first test asserted that proposing a
handoff the recipient cannot cover should fail. CHOICE: the shortfall is *computed and reported at
proposal* (`can_take_over: false`, `missing_capabilities`) but the refusal happens at **acceptance**.
Reason: it is the recipient's own capability that must not be exceeded, and the recipient is the party
that answers; refusing on the proposer's side would deny the recipient the chance to answer and would
hide which capability was missing. The test was corrected to match, and both halves are asserted.

**D6 — Consultation.** CHOICE: accepted like any handoff but transfers nothing
(`ownership_changed: false`, reason `CONSULTATION_TRANSFERS_NOTHING`, no store write). Reason: the
workbook distinguishes a true transfer from advice; collapsing them would let "let me look at it" move
ownership.

**D7 — Task truth.** CHOICE: the coordinator reaches the canonical task store only through an injected
`CanonicalTaskStorePort` (`handoff_writes_task_truth_directly: false`), and the double records every
write so the tests can assert the exact write set (`setOwner`, `recordCheckpoint`, and `setExecutor` only
when the handoff explicitly names a different executor). Reason: canonical task truth is Shared Task
Core's, not Butler's; and the executor row is the acceptance line "executor is not restarted merely
because the owner changed".

**D8 — Duplicate and terminal handling.** CHOICE: re-proposing the same `handoff_id` is an idempotent
no-op (`DUPLICATE_HANDOFF`); accepting an answered handoff is a no-op; a terminal task cannot be handed
off (`TASK_TERMINAL`); a task owned by someone else cannot be handed off by this proposer
(`INVALID_HANDOFF`). Reason: retry/reconnect must not produce a second transfer, and a terminal job must
not be resurrected by a late package.

**D9 — No `schema.json`.** Consistent with BA-002/BA-003 and the EM/GAI branches.

## 3. Test summary

7 tests, all passing: switching touches no task with zero store writes and the outgoing assistant still
online; a handoff refuses authority fields in three shapes (top-level grant, nested capabilities, lease)
and recomputes the recipient's authority as an intersection with no transferred grants; acknowledged
takeover writes exactly `setOwner` + `recordCheckpoint` with the executor untouched and rejects a
non-recipient acceptance and an over-capability transfer; an explicit executor move adds `setExecutor`;
rejection and expiry leave the owner unchanged with zero writes; a consultation transfers nothing; and
package strictness (kind, version, same-assistant handoff, instant, array type, unknown field, duplicate
id, unknown task, terminal task, foreign task, missing checkpoint, missing store port).

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 108 tests, 108 pass, 0 fail (101 baseline + 7 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail |
| `corepack pnpm check:docs` | PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36726727943 on a29062fba3e88abee1830c4f1ecbd6c55e6d1c79 | success |

## 5. Integration seams handed to sibling tasks

- BA-003 (embodiment/foreground): `switchForegroundAssistant` here is the task-facing half of BA-003's
  `switchForeground`; at merge they should be one call whose report carries both the binding change and
  the `tasks_touched: 0` guarantee.
- BA-002 (Assistant Core): the recipient core is fetched/revalidated by the recipient before it accepts;
  `recomputeRecipientAuthority` is where its effective permission is derived, never from the package.
- BA-006 (task coordination): the `CanonicalTaskStorePort` is the seam to shared task truth; owner and
  executor remain distinct fields, and a handoff writes only ownership and checkpoint.
- BA-008 (lease/reconnect): `lease_ref` travels as a *reference* for the recipient to revalidate; the
  handoff never carries the lease itself, so a reconnecting recipient must revalidate before acting.
- BA-009 (duties/permission): the intersection rule here is the same shape as invariant 19; effective
  permission is `User/OwnerPolicy ∩ AssistantPolicy ∩ DeviceCapability ∩ TaskActionGrant`.
- Web/Android: after switching, a surface must not assume ownership moved; it should read the task's
  owner from canonical state.

## 6. Open items for the Correction host / Owner

1. Adversarial review should try to smuggle authority through a field name the guard does not list, to
   reach a second transfer by replaying a package with a fresh id, and to make a switch write to the task
   store.
2. Confirm D5 (shortfall computed at proposal, enforced at acceptance) as the intended semantics.
3. Confirm that `executor_ref` in a handoff is the intended way to move execution, or whether that must
   always be a separate operation (the contract currently allows it inside the same package).
4. The evolution-feed question remains open for the Owner.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_BUTLER_PROJECT_MERGE
```
