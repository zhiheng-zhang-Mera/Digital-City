# EM-006 Development Report — Local-First Sub-worker Placement Gate

```text
MISSION                  = EM-006 (Engineering Manager programme, task 6 of 13)
STAGE                    = DEVELOPMENT
DEVELOPMENT_HOST         = Mech
CLAIM_COMMIT             = 6e6cbce (Digital-City main, "claim(EM-006): Mech claims Development stage")
CLAIMED_AT               = 2026-09-30T14:12:24Z
CONTROL_REVISION_AT_CLAIM= 73e5cc0 (latest main when the claim was made)
IMPLEMENTATION_REPO      = zhiheng-zhang-Mera/utopia
MISSION_BASELINE         = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
IMPLEMENTATION_BRANCH    = engineering-manager/EM-006-local-first-subworker-placement
IMPLEMENTATION_HEAD_SHA  = 2894e8da9d95f54dbb568d8acc510b91bdeae4fb
BRANCH_CI                = 36727765139 — success
LOCAL_CHECK_SUMMARY      = 109/109 tests pass, rooms 0 fail, city 0 fail, promotion-history OK, docs SYNCHRONIZED
DEVELOPMENT_COMPLETE     = true
MERGE                    = NOT PERFORMED (forbidden for component branches)
```

## 1. Deliverable

`contracts/engineering-placement-v1/` — `placement.mjs` (measurement contract, local placement
evaluation, remote-fallback proposal/approval, capability ranking, local-attempt gate, speed-field guard),
`index.mjs` (public surface + guarantees), 8-test suite, root `tests/engineering-placement.test.mjs`.

Acceptance mapping:

| Required acceptance | Test |
|---|---|
| the local host is attempted first | `a healthy local host is used, with local concurrency as the answer`; `a remote dispatch requires a recorded local attempt first` |
| a faster/less loaded remote host alone never triggers fallback | `a faster or less loaded remote host alone never triggers fallback` |
| remote fallback needs a measured blocking decision plus explicit user approval | `remote fallback needs a measured reason and explicit user approval` |
| local concurrency is reduced before fallback is proposed | `resource pressure reduces local concurrency before any remote fallback` |
| ranking happens only after eligibility, by capability fit rather than speed | `candidates are ranked by capability fit, only after fallback is justified` |
| a protected foreground workload outranks ours | `a protected foreground workload blocks the local host rather than displacing the user` |

## 2. Decision log (problem → options → choice → reason)

**D1 — Which task to claim.** Fresh scan: no owned repair and no eligible opposite-host Correction
(Alien was correcting RF-003), so the unclaimed-Development tier applied. EM-006 chosen under the
tie-break (different programme from my BA claim) and because it carries the programme's second hard
invariant.

**D2 — What does the gate decide from?** Options: (a) device descriptions; (b) adjectives ("busy"); (c) a
typed measurement record. CHOICE: (c) with `observed_at` and `source`, and every decision returns the
measurements it used as `evidence`. Reason: the invariant says remote fallback is proposed "only for
measured local blocking", so an unmeasured opinion must not be able to produce a proposal — and the
decision has to be auditable after the fact. A measurement that is missing or nonsensical (zero free
memory, `max < 1`) is `LOCAL_UNAVAILABLE`, never "assume free".

**D3 — Order of decisions.** CHOICE: protected foreground workload first (LOCAL_BLOCKED, the user's own
work outranks a Sub-worker), then unmeasurable capacity (LOCAL_UNAVAILABLE), then pressure → reduce
concurrency to a single worker (LOCAL_THROTTLED, `remote_fallback_eligible: false`), then a pressured
headroom reduction, then LOCAL_ALLOWED. Reason: the invariant explicitly requires reducing local work
*before* proposing remote, so a throttled host must not be fallback-eligible — a busy-but-runnable host is
not a reason to move work off the machine.

**D4 — How is "faster is not a reason" enforced?** CHOICE: three independent guards. (1)
`proposeRemoteFallback` refuses any local decision that is not `LOCAL_BLOCKED`/`LOCAL_UNAVAILABLE`
(`REMOTE_FALLBACK_NOT_JUSTIFIED`); (2) it refuses a decision that did not mark itself
`remote_fallback_eligible`; (3) a candidate carrying a speed/idle/priority ranking field is **refused
outright** (`SPEED_IS_NOT_A_REASON`) rather than ignored. Reason: silently ignoring a `speed_rank` field
would let the caller believe the ranking was considered; refusing it makes the rule visible. The rank
function then orders by capability fit and host reference only, and the proposal records
`ranked_by_speed: false`.

**D5 — Approval.** CHOICE: `requires_user_approval: true` is a constant of the proposal, approval needs a
non-empty `approvedBy` plus an instant, and the result records `approved_by`, `scope: 'CURRENT_JOB'`,
`local_attempted_first: true` and `owner_preserved: true`. Reason: V1 requires explicit user approval, and
"moving execution does not move the logical owner" is the same separation EM-001/EM-003 already
establish.

**D6 — Local-attempt evidence.** CHOICE: `assertLocalFirstAttempted` refuses a dispatch with no attempt
record carrying `scope: 'LOCAL'`, and reports whether concurrency was reduced first. Reason: the
invariant is about *behaviour*, not about the shape of a proposal; without a recorded local attempt a
remote dispatch is indistinguishable from skipping the local host.

**D7 — Measurements are inputs, not probes.** CHOICE: the module performs no OS probing and imports
nothing; a host adapter supplies measurements. Reason: the same task on a different host must be testable
without a machine, and OS-specific probing is explicitly out of scope for the component.

**D8 — No `schema.json`.** Consistent with the other programme branches.

## 3. Test summary

8 tests, all passing: healthy local placement with measured evidence; pressure reducing concurrency with
fallback ineligible (CPU, full worker pool and memory paths) and a throttled proposal refused; protected
foreground workload blocking with a protected GPU and workers running, while a full-screen app alone does
not block; unmeasurable host as `LOCAL_UNAVAILABLE` with measurement-shape refusals (bad percentages, bad
boolean, unknown field, bad instant) and an invalid policy refused; the headline invariant — fallback
refused for a healthy local host with an idle fast remote, and `speed_rank`/`idle_percent` refused even
when fallback is justified; measured-reason and approval requirements including `measured_reason:
'FASTER'` refused and `requires_user_approval: false` refused; capability-fit ranking after eligibility
with deterministic host-reference ordering; and the local-attempt gate with its throttle report.

## 4. Local checks and CI

| Check | Result |
|---|---|
| `corepack pnpm test` | 109 tests, 109 pass, 0 fail (101 baseline + 8 new) |
| `node scripts/verify-promotion-history.mjs` | OK, 10 records verified at 82ed36933fb4 |
| `node --test apps/rooms/tests/*.test.mjs` | 0 fail |
| `node city/test-all.mjs` | 0 fail |
| `corepack pnpm check:docs` | PAIR_STATUS = SYNCHRONIZED |
| GitHub CI 36727765139 on 2894e8da9d95f54dbb568d8acc510b91bdeae4fb | success |

## 5. Integration seams handed to sibling tasks

- EM-002 (connector runtime): measurements come from the host adapter; `workers.running`/`workers.max`
  should reflect the runtime's own instance count rather than a separate counter.
- EM-004 (registry): candidate `capability_refs` should be resolved from the registry, so ranking here
  uses verified capability rather than a claim.
- EM-007 (remote Sub-worker return control): `approveRemoteFallback` produces the placement this task
  hands to EM-007; the `owner_preserved` flag is the same guarantee EM-007 must uphold for results
  returning to the interaction surface.
- EM-010 (queue/worker pool): `concurrency` is the pool's local budget; the pool must honour
  `LOCAL_THROTTLED` rather than maximising throughput.
- RF-009/presence and EM-007: remote candidates require real presence; this module deliberately accepts
  candidates as input and never discovers them.
- Web/Android: a user-facing approval prompt should be driven by `proposal.measured_evidence`, so the
  question shown is "your host is blocked because …" rather than "another machine is faster".

## 6. Open items for the Correction host / Owner

1. Adversarial review should try to reach remote fallback from a throttled or unmeasured decision, to
   smuggle a ranking through a field name the guard does not list, and to dispatch remotely with a
   fabricated local attempt.
2. Confirm D3's thresholds (`cpu_block_percent: 92`, `memory_block_percent: 90`,
   `reduce_concurrency_to: 1`) as platform policy, or whether they belong in owner-editable policy.
3. Confirm whether a protected GPU with no running workers should also block (it currently blocks only
   when workers are running).
4. The evolution-feed question remains open for the Owner.

```text
DEVELOPMENT_COMPLETE = true
CORRECTION_ELIGIBLE  = true (must be performed by Alien, not Mech)
MERGE_STATUS         = FORBIDDEN_UNTIL_ENGINEERING_MANAGER_PROJECT_MERGE
```

## Language reading link / 语言阅读链接

[中文完整阅读译文 / Complete Chinese reading translation](./zh-CN/DEVELOPMENT_REPORT.md)
