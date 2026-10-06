# WBC-602 — PAPER_MATERIAL_INDEX

> Required by `CONSTRUCTION_RULES.md` §14B (Long-Horizon Agent Research Evidence Gate) and, for the state-identity
> half, by the `state_identity_evidence` fields the template gained while this task was in flight
> (`MISSION_TEMPLATE.md` @ Digital-City `eb5c2bc`). Scope discipline is the same as WBC-601's index: only
> observable engineering facts, no hidden reasoning, and `NOT_OBSERVABLE + reason` instead of an invented number.

## 1. Applicability decision

```text
research_evidence_applicability = APPLICABLE
long_horizon_context_evidence   = CAPTURED
state_identity_evidence         = CAPTURED
research_evidence_refs          = see §6
```

Signals actually observed in this session (as opposed to signalled by the task type): a second consecutive claim
in a long-running asynchronous session; a self-found defect in a projection that *looked* correct field by field; a
measurement defect in this task's own test instrumentation; and one **invented commit-SHA suffix** written from
memory into a report draft, caught before publication.

## 2. External-state refs used (RQ3)

```text
control_repo        zhiheng-zhang-Mera/Digital-City @ main
implementation_repo zhiheng-zhang-Mera/utopia
workbook            mission-book/finished/completed-2026-10-06/workbench-compatibility-migration/WBC-602-node-role-capability-resource-descriptor.md
report              mission-book/reports/WBC-602/DEVELOPMENT_REPORT.md
branch              wbc/WBC-602-node-descriptor
baseline_sha        0e9bea3ce739b979e582a428af8fb233045a5e75
head_sha            c312a60b4d73f02597bde1f106372b253067fe33
required_ci         V0.2 checks / City linkage check on baseline: 37205444427 / 37205444385 (both success)
independent_of      wbc/WBC-601-execution-backend-contract head d65dbd3af2d8903aca13726f74110e1f2f6b9b65 is NOT an ancestor of baseline
claim_commit        623190f
worktree            D:/utopia-wbc602
```

Observation for RQ3: the two facts this session most needed and could not have remembered correctly —
*which baseline* and *whether the parallel task's code was already in it* — were both resolved by commands
(`git rev-parse`, `git merge-base --is-ancestor`) rather than recalled. The second one is the interesting case: an
agent that "remembered" WBC-601 as finished would have built on the wrong assumption, because finished **on its own
branch** is not the same as merged into `main`.

## 3. State identity, provenance and freshness (§14B state-identity half)

```text
expected_identity            head of the branch as pushed
resolved_identity            git rev-parse HEAD = c312a60b4d73f02597bde1f106372b253067fe33
evidence_identity            CI (V0.2 checks) headSha on that branch = c312a60b4d73f02597bde1f106372b253067fe33
provenance_relation          resolved_identity == evidence_identity  -> MATCH
freshness_revalidation       re-resolved after the push, not carried over from the pre-push value
drift_classes_checked        MUTABLE_REFERENCE_STATE_DRIFT      -> observed and handled (§4 I3)
                             EVIDENCE_POINTER_MISMATCH         -> observed and corrected (§4 I4)
                             STALE_EXECUTION_IDENTITY          -> the branch was resolved fresh at claim time
                             PROVENANCE_RELATION_MISMATCH      -> none; baseline ancestry re-verified per claim
```

## 4. Incidents worth citing

**I1 — A projection that was self-contradictory while every field looked right (LOGIC_CONFLICT).**
The first `nodeDescriptors()` produced `availability: { state: 'ONLINE', acceptingWork: true, sharingEnabled: false,
reason: 'SHARING_DISABLED_BY_OWNER' }`. Each field was individually defensible; the combination answered "will this
node take work?" with *yes* for a device whose owner had switched sharing off. It was found by a test written to
check read-time freshness, not by inspection. Generalisable observation: **derived-state bugs hide in the joins
between correct fields**, and a contract that exposes a derived boolean must state the exact predicate it is the
conjunction/disjunction of.
Evidence: `DEVELOPMENT_REPORT.md` §5; regression guard in `tests/wbc602-node-descriptor.test.mjs`.

**I2 — "Unknown" versus "zero" as a compatibility hazard (COMPATIBILITY_MODEL).**
The workbook's rule that a missing measurement may not become `0` or `unavailable` is a policy that a single
careless default (`?? 0`) would silently violate. The task therefore made every resource field a three-state
`presence` value (`KNOWN` / `UNKNOWN` / `UNSUPPORTED`) with a reason, and made an unmet requirement on an unmeasured
resource `decided: false` rather than a refusal. Paper angle: backwards-compatible schema evolution — *the absence
of a value is itself a value that must be represented*.

**I3 — MUTABLE_REFERENCE_STATE_DRIFT on the control plane across hosts (state identity).**
While WBC-601 was being recorded, the other host pushed 13 commits into Digital-City `main` from a local state that
predated the record, and the WBC-601 workbook's `development_head_sha` / `development_ci` / `development_complete`
were observed back at `null` / `false` in `origin/main`. The code and report were untouched; the repair was
`fetch` → `rebase` → re-publish, repeated twice because `main` moved again mid-repair. Nothing was force-pushed and
no other host's claim was altered.
Evidence: `git diff HEAD..origin/main` showing the three fields reset; `git merge-base --is-ancestor 898db10
origin/main` proving the claim commit itself survived (so this was **not** a claim takeover).
Paper angle: on a multi-host control plane, **a push is not a durable-state transition — only a read-back is**.

**I4 — EVIDENCE_POINTER_MISMATCH in this task's own report draft (state identity, self-inflicted).**
The first draft of `DEVELOPMENT_REPORT.md` recorded `HEAD_SHA = c312a60b6bb6fbcc7cb0ee3ecab90dc9d64d8daf`. The
first seven characters were real; the remaining 33 were written from memory and correspond to no commit. It was
caught before publication by resolving the identity from Git and cross-checking it against the CI `headSha`.
Paper angle: this is the concrete failure mode that motivates §2A's "full 40-char SHA only" rule — a partially
invented hash is indistinguishable from a real one to a human reader, and only a resolve-and-compare step detects
it. Recorded as a **recording defect of the agent**, not a product defect.
Evidence: this file §3; `DEVELOPMENT_REPORT.md` §8.1.

**I5 — MEASUREMENT_DEFECT in this task's own test (not a product defect).**
One assertion expected `resources.network.reachable === true` for an online node; the fixture's agent was not
online, so the expectation was wrong, not the translation. It was corrected to assert the facts the descriptor
really separates. Logged separately from I1 precisely because §4 of the CEX/REX evidence discipline requires
tool-error and product-error to be distinguishable in the record.
Evidence: `DEVELOPMENT_REPORT.md` §5 (second finding).

## 5. Task-pool continuity (post-completion re-scan)

Immediately before this report: `WBC-601` development complete + recorded; `CEX-701` claimed and in progress by the
other host (`Alien-codex`); `CEX-702`, `CEX-703`, `CEX-704`, `REX-801`, `REX-802` READY and unclaimed; `JOIN-590`
(physical acceptance) and `SHOW-401` (non-product media, preferred host Alien) not eligible for this host. The next
claim will be taken from that set after re-reading the live board, because a claim decision made from a cached
board is exactly the stale-state class in I3.

## 6. Research Institute topics these observations feed

```text
.../paper-materials/{en,zh-CN}/
  LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md
  LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md   <- I3, I4
```

`NO_RESEARCH_SIGNAL` is not claimed.

## 7. What this index deliberately does not claim

* No causal conclusion from a single session; I1–I5 are naturalistic observations.
* No token/cost/compaction telemetry: no compaction occurred in this session and the harness exposes no occupancy
  numbers, so those fields are `NOT_OBSERVABLE + reason` rather than invented.
* No hardware or GPU claim: the descriptor models no accelerator measurement at all, and says `UNSUPPORTED`.

## Opposite-host correction evidence supersedes original projection assumptions

Actual reviewer Alien-codex/MERA-ALIANWARE is distinct from developer Mech/MEGA-REP. Correction d99101fdac5169aad74ae84fb7c0c25be43ad7d9 binds REVIEW_FINDINGS.md and receipt; CI37211820065 IN_PROGRESS. Original unsupported-GPU statement above is a repaired defect: unmeasured hardware must be UNKNOWN. Six findings, root red/green19/19 and canonical HTTP10/10 equivalent; no hardware benchmark. CAP-NODE-DESCRIPTOR-001 foundation registry backfill, INTERNAL_ONLY with explicit no-new-user-verb exemption.

research_evidence_applicability=APPLICABLE; long_horizon_context_evidence=CAPTURED. Current continuation revalidated source/control/CI; exact token/window/compaction trigger and global rework counters NOT_OBSERVABLE. Candidate watchlist RS-G3-INDEPENDENT-REVIEW-BOUNDARY, RS-G3-IDENTITY-PROVENANCE, RS-G3-SEMANTIC-INTEGRATION and RS-G4-CAPABILITY-STATE inherit City taxonomy, not novelty claims. Defects remain ordinary engineering evidence; foundation/formal/CI/main integration states stay distinct.

Final outcome: exact correction d99101fdac5169aad74ae84fb7c0c25be43ad7d9; CI37211820065 COMPLETED SUCCESS, opposite-host Formal Review PASS, CAP-NODE-DESCRIPTOR-001 reconciled. Accepted terminal refers to this exact source, not main inclusion. Source PR18 remains open under merge_authority=false.

语言配对 / Language pair: [English](./PAPER_MATERIAL_INDEX.md) · [中文](./zh-CN/PAPER_MATERIAL_INDEX.md)
