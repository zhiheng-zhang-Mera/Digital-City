# REX-801 — PAPER_MATERIAL_INDEX

> Required by `CONSTRUCTION_RULES.md` §14B and by the Research Strengthening evidence protocol. Observable facts
> only; no hidden reasoning, and `NOT_OBSERVABLE + reason` instead of an invented number.

## 1. Applicability decision

```text
research_evidence_applicability = APPLICABLE
long_horizon_context_evidence   = CAPTURED
state_identity_evidence         = CAPTURED
research_evidence_refs          = see §6
```

This task is a **research-infrastructure** component, so it is APPLICABLE twice over: it is built by a long-running
asynchronous agent (the §14B case) and it is itself the layer that makes future experiments describable.

## 2. External-state refs used (RQ3)

```text
control_repo   zhiheng-zhang-Mera/Digital-City @ main
implementation zhiheng-zhang-Mera/utopia
workbook       mission-book/mission-group/research-strengthening/REX-801-experiment-manifest-and-registry.md
report         mission-book/reports/REX-801/DEVELOPMENT_REPORT.md
branch         rex/REX-801-experiment-manifest-registry
baseline_sha   0e9bea3ce739b979e582a428af8fb233045a5e75
head_sha       8f8c521fc299d622093776615b653457d8833f96
ci_green       V0.2 checks run 37241196692 on head_sha
claim_commit   52c0c63
worktree       D:/utopia-rex801
```

## 3. State identity, provenance and freshness

```text
expected_identity      head of rex/REX-801-experiment-manifest-registry as pushed
resolved_identity      git rev-parse HEAD = 8f8c521fc299d622093776615b653457d8833f96
evidence_identity      CI headSha for run 37241196692 = 8f8c521fc299d622093776615b653457d8833f96
provenance_relation    resolved_identity == evidence_identity -> MATCH
freshness_revalidation the baseline SHA was re-measured at claim time even though WBC-602 had claimed the same
                       value; a matching value is not evidence that it is still the value
drift_classes          MUTABLE_REFERENCE_STATE_DRIFT   -> observed control-plane drift (§4 I3, carried from the
                                                        WBC-601/602 window)
                       EVIDENCE_POINTER_MISMATCH      -> none in this task's own records (the corrective habit
                                                        recorded in WBC-602 §I4 was applied: every SHA in this
                                                        report was pasted from git/CI output, never typed)
                       STALE_EXECUTION_IDENTITY       -> avoided by re-measuring the baseline
                       PROVENANCE_RELATION_MISMATCH   -> none
```

## 4. Incidents worth citing

**I1 — A guard that could not fire because it inspected the wrong object (LOGIC_CONFLICT).**
`assertNotATaskStore` was applied to the *validated* manifest, which the validator builds from known fields — so
task-domain keys were dropped before the guard looked, and the check was decorative. Class of defect: a validation
whose input is already normalised by the thing it is meant to validate. The repair moved the check to the raw
input. This is the same family as WBC-602's `acceptingWork` contradiction: **each part looked right; the wiring
between them was wrong.**
Evidence: `DEVELOPMENT_REPORT.md` §5 D1; regression guard asserts all eight task-domain keys are refused.

**I2 — A heuristic predicate with a hole and a false classification (LOGIC_CONFLICT).**
The short-SHA detector `/^[0-9a-f]{7,39}$/` both missed 4–6 character hex strings and refused the branch name
`main` with the wrong reason (a label is not a broken anchor). Class of defect: an unanchored heuristic standing in
for a typed distinction. The repair introduced an explicit `exact` predicate generated from the parse result, so
"is this an immutable anchor" is answered by a field rather than by re-testing a regex.
Evidence: `DEVELOPMENT_REPORT.md` §5 D2.

**I3 — A fixture that asserted a vocabulary the agent had assumed (MEASUREMENT_DEFECT).**
The live-gateway tests required `task.execute.safe`, a worker task capability, as a City provider capability. The
real list is `planning.document.intake`, `planning.knowledge.query`, `engineering.skill.inspect`,
`research.evidence.review`, `presentation.theme.lab`. The product refused the manifest correctly; the fixture was
wrong. Paper angle: **this is the same failure mode as an agent quoting a SHA from memory** — an identity written
from expectation rather than read from the source. The repair turned it into a positive assertion (a task
capability must NOT be accepted as a City capability), converting a mistake into a property.
Evidence: `DEVELOPMENT_REPORT.md` §5 D3.

**I4 — A flaky pre-existing integration test under full-suite load (MEASUREMENT_ENVIRONMENT).**
`tests/theme-build-bridge.test.mjs` "D9 Bridge builds retained sandbox artifacts…" failed once in a full-suite run
(32 720 ms) and passes standalone (29 548 ms) and on re-run. No touched path is involved. Recorded so the local
board is not described as green when it was not, and so the next reader knows one failure class here is timing, not
logic.

## 5. Quantitative evidence

```text
new tests                        14 (9 contract conformance + 5 live-gateway)
root suite before / after        1219 -> 1251 tests (+32 including the new 14 and the existing files it touches)
root suite result                1247 pass / 4 fail (3 environmental, 1 flaky — both classified above)
city suite                       1984 tests / 1977 pass / 7 skipped / 0 fail
new contract surface             1 versioned contract (experiment-manifest-v1) + 1 registry module
research routes added            5 (list, create/import, validate, inspect, seeds) — and 0 execution routes
defects found and repaired       3 in this task's own code/fixtures (D1, D2, D3), 1 environmental (D4)
```

## 6. Research topics these observations feed

```text
.../paper-materials/{en,zh-CN}/
  LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md
  LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md    <- I3 (identity from the source)
```

Watchlist ids carried in the workbook frontmatter by the research monitor:
`RS-G3-PASSIVE-EVIDENCE-PIPELINE`, `highest_research_grade_observed: G3_SPARSE_ACTIVE`.

## 7. What this index deliberately does not claim

* No causal conclusion from naturalistic observation. I1–I4 are single-session engineering events; §14B.5 reserves
  causal claims for controlled replay.
* No token/cost/compaction telemetry: the harness exposes none and no compaction occurred, so those fields are
  `NOT_OBSERVABLE + reason` rather than fabricated.
* No experimental result: this task describes experiments and executes none, so there is no measurement to report.

Opposite-host review produced concrete provenance/topology/exposure mismatches; see REVIEW_FINDINGS_Alien-codex.md. Red actual HTTP inputs main-only software and repeated-host arrays pass old validation despite stated gates. Preserve these findings alongside original14/14 tests; correction/acceptance pending.

Final opposite-host acceptance PASS at corrected source 7e96a4d28f4cb701d7a0951bace69857c3228f32, exact hosted CI SUCCESS. See REVIEW_REPORT_Alien-codex.md for original-to-correction provenance, bounded user workflow, preserved invalid runs, and unobserved physical/Android execution. Earlier pending entries remain historical.


[完整中文阅读译本 / Chinese reading translation](./zh-CN/PAPER_MATERIAL_INDEX.md)
