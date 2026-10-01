# BA-009 Correction Report — Duties, Permission + Proactivity Policy

```text
MISSION              = BA-009 (Butler Assistant programme, task 9 of 9)
PROGRAMME            = BUTLER_ASSISTANT_ENGINEERING
STAGE                = CORRECTION
CORRECTION_HOST      = Alien
DEVELOPMENT_HOST     = Mech
CONTROL_BOOK         = Digital-City/mission-book/butler-assistant/BA-009-duty-permission-policy.md
CLAIM_COMMIT         = 958d0e8 (Digital-City main, claim of BA-009 Correction by Alien)
CLAIMED_AT           = 2026-10-01T05:00:18Z
COMPONENT_BASELINE   = 82ed36933fb4c5b00e44768d9e1aedec1d525d9c
DEVELOPMENT_HEAD     = 9e1de31ba53766758406e991dbacdb8f707b1bfc
DEVELOPMENT_CI       = 36750981300-success-attempt-5
CORRECTION_BRANCH    = assistant/BA-009-duty-permission-policy
CORRECTION_HEAD_SHA  = 2abf8d47ad0663c175779ab9a3057594d2db86ab
BRANCH_CI            = 36818585688-gateway-web-success-android-success
LOCAL_CHECK_SUMMARY  = BA-009 17 pass (7 author + 10 Alien regressions), root/rooms/city/promotion/bilingual all pass
MERGE                = NOT PERFORMED (forbidden for component branches)
CORRECTION_COMPLETE  = true (hosted CI green on the exact pushed head)
```

## 1. Hosted CI

```text
development head   9e1de31 (Mech)   run 36750981300   success
corrected head     2abf8d4 (Alien)  run 36818585688   gateway-web success / android success
```

The Development run id is the one the workbook recorded as `BLOCKED_GITHUB_ACCOUNT_BILLING`; it concluded
success once the Owner cleared the billing refusal, which is what made this Correction eligible
(`mission-book/reports/DEVELOPMENT_CI_RECOVERY_2026-10-01.md`).

## 2. Independent review method

The Development head was exported with `git archive` (`D:\A-Utopia\.runtime\evidence\mission-book\BA-009\frozen-9e1de31\`)
and all four branch blobs were verified against their Git objects before any review started (all MATCH). An
independent adversarial reviewer was pointed only at that frozen export, told to read the workbook first —
including the **normative permission equation** `User/OwnerPolicy ∩ AssistantPolicy ∩ DeviceCapability ∩
TaskActionGrant` — and briefed that an over-permissive answer is the security defect here. It returned 17
probes and `probes/FINDINGS.md` with 14 mechanisms (`MATERIAL_DEFECTS_FOUND`, confidence high; module bytes
hash-verified stable before and after every probe). My own probe
(`probes-alien/probe-alien-ba009.mjs`) reproduced six; the merged set is below, with three of the reviewer's
recorded as boundaries because the author's suite encodes them.

## 3. Defects found and repaired — 11 mechanisms

Class numbers follow the shared taxonomy used across this programme's Corrections (1 own-key/prototype,
2 opt-in or literal-only guard, 3 caller-controlled limit, 4 authority not bound to its subject, 5 state
mutated before a refusal, 6 unvalidated instants, 7 validated-but-unread, 8 hardcoded claim, 9
recursion/clone failure, 10 dropped or re-read fields, 11 mutable-key idempotency, 12 accessor TOCTOU,
13 audit not bound to its actor, 14 a claim not backed by the data).

| # | Mechanism | Class | Repair | Regression |
| --- | --- | --- | --- | --- |
| 1 | **The duty gate was bound to the caller's duty reference, not to the action.** `required = duty_ref ?? action_ref`, so an assistant that held `calendar.read` was granted `shell.execute.rm-rf` by naming the duty it did hold | 4, 2 | the duty check is bound to the ACTION; a named duty reference can only narrow the decision, and the payload reports `action_in_duty` / `duty_ref_in_duty` | yes |
| 2 | **The assistant axis was the caller's boolean.** `effective_permission.granted` followed `axes.assistant_policy`, which the caller that wants the action also supplies | 4, 8 | the assistant axis is the registry's own duty record (in-duty, inside the deployment ceiling); a caller may narrow it, never assert it | yes |
| 3 | **The confirmation requirement was switchable off.** `confirmation_required: false` (or any falsy value) disabled confirmation for `ACT_WITH_CONFIRMATION` / `ACT_AUTONOMOUSLY`, and the decision returned `ALLOWED` | 3, 2 | the deployment policy sets a floor; an assistant policy may add to it, and a non-boolean is refused | yes |
| 4 | **A handoff payload could carry authority.** `HANDOFF_CANNOT_ELEVATE` fired only for a non-empty **Array** under `grants`, so `grants` as an object or string, and `permissions` / `capabilities` / `scopes` / `authority` / `elevate`, passed silently | 1, 4 | any authority-bearing key is refused whatever its shape, with an explicit allow-list for responsibility, checkpoint and evidence references | yes |
| 5 | **A handoff ignored the capability factor and asserted relative privilege.** `evaluateHandoff` recomputed the recipient from the sender's axes, dropped `capability_available`, and hardcoded `recipient_more_privileged_than_before: false` even when the sender was refused and the recipient allowed | 4, 7, 12 | the recipient is recomputed with the same capability factor, `recipient_capability_checked` says so, and `recipient_more_privileged_than_sender` is derived from the two decisions | yes |
| 6 | **A lease was usable without being unexpired or held here.** `lease_usable` read only `lease_valid === true && lease_ref`, so an expired or another assistant's lease was reported `LEASE_VALID` | 6, 4 | a lease must be declared valid, unexpired against the clock and held by this assistant, and its `expires_at` must be a real instant | yes |
| 7 | **The deployment policy could remove its own ceiling.** `proactivity_ceiling: 'NONSENSE'` (or `null`, a number) compared against `PROACTIVITY_RANK[undefined]`, so `ACT_AUTONOMOUSLY` was accepted; unknown keys and mistyped lists were accepted too | 3 | the policy is validated (ceiling in the level vocabulary, confirmation list and audience list of known references, known keys, `policy_ref` text) | yes |
| 8 | **Notification audiences were a substring match.** `notification_audiences: 'USERS'` was stored and `.includes('USER')` then admitted the audience `USER` | 1, 3 | audiences must be a list of references, and a non-text entry is refused | yes |
| 9 | **A decision could be stale and unmarked.** `recomputeForChange` produced a new decision while the earlier one stayed readable as current, and decision ids were a bare per-registry counter that collided across registries | 12, 14, 11 | earlier decisions about the same assistant and action are marked `superseded_by`, and ids are scoped to the minting registry | yes |
| 10 | **Instants were shape-only and caller `at` was recorded verbatim** at all six sites | 6 | `isIsoInstant` and the clock require a real instant, and every caller `at` goes through one validated helper | yes |
| 11 | **Canonical records accepted non-plain objects and the freezer was cycle-unsafe**; uncloneable values could reach the registry before validation | 1, 9 | plain-prototype requirement, cycle-safe freezer, and stored values are typed before anything is written | yes |

## 4. Local test summary

```text
corrected module                    17 tests / 17 pass / 0 fail
development head 9e1de31            17 tests /  7 pass / 10 fail   ← every Alien regression discriminates
root / rooms / city / promotion-history / bilingual   all green (exit 0)
```

The author's 7 tests are unchanged and all 7 pass. Evidence under
`D:\A-Utopia\.runtime\evidence\mission-book\BA-009\`: `frozen-9e1de31/` (byte-verified export),
`prefix-test.log`, `gate-BA-009.log`, `patch-duty-policy.mjs` and `patch-duty-policy-2.mjs` (the anchor-guarded
repair passes; each aborted cleanly on a mismatched anchor at least once before writing),
`probes-alien/probe-alien-ba009.mjs`, and the independent review's `probes/FINDINGS.md` + 17 probes.

## 5. Boundaries (deliberately not "repaired")

| Boundary | Reasoning |
| --- | --- |
| **`capability_available` defaults to `true`** (reviewer defect 4) | Author-encoded: the original suite's allowed case omits it and asserts `ALLOWED` (`conformance.test.mjs:96`, and every `recomputeForChange` case at `:147`). The capability factor is present twice — as the `DEVICE_CAPABILITY` axis and as this explicit signal — so a caller that declares no capability still has to declare the axis, and the payload now states that the Core-owned axes are caller declarations (`caller_declared_axes`, `core_axes_verified_here: false`). Making it fail closed would break the encoded contract; recorded for the integration owner. |
| **`decide()` has no initiative input** (reviewer defect 8): a `SILENT`/`NOTIFY` assistant is `ALLOWED` for an action that `proactiveNotice` refuses | Author-encoded at the original `conformance.test.mjs:96`. The two questions are deliberately separate: `decide` answers "may this assistant do this if asked", `proactiveNotice` answers "may it initiate this unasked". A caller that wants the initiative boundary must consult `proactiveNotice`; the separation is recorded rather than collapsed. |
| **`checkDuty` keeps `duty_ref ?? action_ref`** (the same pattern as the repaired #1) | The author's suite asserts that an explicit duty reference stands in for the action (`conformance.test.mjs:78`), and `checkDuty` grants nothing — it reports a duty classification. The *decision* path (`decide`) is the one that was repaired, and the asymmetry is recorded. |
| **The stored decision list is unbounded and `decide()` does not journal** | Retention is a metrics decision the workbook does not scope here; `decisions()`/`decision(id)` are read-only, and supersession (#9) now marks what is no longer current. A decision journal would be a new surface, not a repair. |
| **A lease's `lease_valid` flag remains caller-declared** | Lease issuance belongs to BA-004; this module consumes the lease as an execution-safety prerequisite and now checks the parts it can see (expiry against its own clock, holder binding) while publishing `lease_validity_source: 'CALLER_DECLARED'` and `lease_verified_here: false`. |
| **The three Core-owned axes are caller declarations** (reviewer probe-14's "design seam") | `USER_OWNER_POLICY`, `DEVICE_CAPABILITY` and `TASK_ACTION_GRANT` come from Shared Core policy and device capability, which this module neither owns nor can verify; the payload now names them as caller-declared instead of implying an intersection it validated end to end. |
| **Unthrown codes**: 10 of 16 `DUTY_CODES` are never constructed, and `DELEGATE`/`REFUSE`/`DELEGATED` are never produced as decisions | The corresponding facts are reported through `duty_kind`, `delegated_to`, `decision` and refusal payloads. Coverage evidence, not a behavioural defect. |

## 6. Review-integrity note

The reviewer twice reported that the *frozen* export's test file changed while it was working. That is
expected and explained: the Correction host appends its regression block to the frozen export to produce the
pre-fix baseline (`prefix-test.log`), exactly as the earlier tasks did. The **module** bytes it judged were
hash-verified stable before and after every probe (`duty-policy.mjs`, sha256 recorded in its report), and its
13-test run against that superset is the same 7 pass / 6 fail baseline reproduced here as 7 pass / 10 fail
after the third pass added four more regressions.

## 7. Disclosure

- Three passes were needed: my own probe found six mechanisms, the independent review's first interim message
  added the action/duty binding and the handoff capability hole (its two most material findings), and its
  final report added the lease and supersession points. All are repaired above; nothing material was left
  open when the workbook was marked complete.
- My own errors are recorded, not hidden: one regression asserted `policy()` would notice a bad clock (it is
  validated lazily, so the module was right and the assertion moved to a call that reads the clock); two more
  asserted the wrong expectation for a named duty inside the list and for a recipient that is
  `CONFIRMATION_REQUIRED` rather than `ALLOWED`. Each was fixed in the test, not in the module.
- Two repair scripts failed to parse at first because a doc comment inside an embedded template literal
  contained unescaped backticks; both aborted before touching the module, were fixed, and re-ran. The
  byte-preserving `append-regressions.mjs` helper is used for every regression block.
- No billing refusal was recorded as a code failure; every hosted run in this task that started executed real
  steps.
