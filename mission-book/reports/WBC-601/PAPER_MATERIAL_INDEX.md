# WBC-601 — PAPER_MATERIAL_INDEX

> Required by `CONSTRUCTION_RULES.md` §14B (Long-Horizon Agent Research Evidence Gate), which was added to the
> persistent rules **while this task was in flight** (Digital-City commit `3f26702` / `b088dd3`). This index is
> therefore the §14B decision for WBC-601, recorded after the work rather than before it, and it says so.
>
> Scope discipline: this file records **observable** engineering facts about a long-horizon agent session. It
> contains no hidden reasoning, no model chain-of-thought, and no invented numbers. A field the harness did not
> expose is written `NOT_OBSERVABLE + reason`, never `0`.

## 1. Applicability decision

```text
research_evidence_applicability = APPLICABLE
long_horizon_context_evidence   = CAPTURED
research_evidence_refs          = see §6
```

Why APPLICABLE (the §14B.1 signal list matched against what actually happened in this session):

| Signal | Observed in WBC-601 |
|---|---|
| long-running / asynchronous agent construction | yes — one claim, full implementation, hosted CI round trip, a CI-triggered repair, and two control-plane rebases in a single session |
| context pressure / compaction | **not observed in this session** (see §3 `NOT_OBSERVABLE`); the Owner's standing instruction to compact at 70 % was in force but did not fire |
| session restart / resume | not on this host; the *other* host (Alien) pushed 13 commits into the same control-plane branch while this session ran, including a template/rule change |
| Mission Book / external state recovery | yes — the authoritative state (workbook frontmatter, report, branch, SHA, CI runs) was written to Digital-City/Utopia **before** it was needed for recovery, and was in fact read back after the rebases |
| task-pool continuous claiming | yes — the session completed this task and then re-scanned the pool (see §5) |
| Owner had to come back to continue | no — zero Owner interventions (§3) |
| false COMPLETE | **one near-miss, caught by hosted CI** (§4) |
| duplicate / regression work | one near-duplicate measurement avoided, one genuine staleness read caught (§4) |
| stale branch / stale SHA / stale task state | **twice** — a stale generated status file at claim time, and a pushed record that was silently reset by another host's later commit (§4) |

## 2. External-state refs used (RQ3: what should live outside the prompt)

```text
control_repo        zhiheng-zhang-Mera/Digital-City @ main
implementation_repo zhiheng-zhang-Mera/utopia
workbook            mission-book/workbench-compatibility-migration/WBC-601-execution-backend-contract-and-standard-default.md
report              mission-book/reports/WBC-601/DEVELOPMENT_REPORT.md
branch              wbc/WBC-601-execution-backend-contract
baseline_sha        612c344f9f2b06a67b2645b4662d97750dd7c44e
head_sha            d65dbd3af2d8903aca13726f74110e1f2f6b9b65
ci_green            V0.2 checks run 37205291447 completed/success on head_sha
ci_failed_earlier   V0.2 checks run 37204673910 completed/failure on 9f9db6384779e75f51ec317074238c139e1de609
claim_commit        898db10   (mission-book workbook claim)
record_commit       29d7436   (after rebase onto fd0fc87)
worktree            D:/utopia-wbc601
```

Observation worth keeping (RQ3): **every** step of this session that survived its own context was recoverable
from those refs alone. Nothing important lived only in the conversation. Concretely, the state that had to be
recovered mid-session — "which head is the real one, which CI run belongs to it, and why is the previous one
red" — was restored by re-reading the Actions API and the report, not by remembering.

## 3. Observable fields (§14B.3)

```text
agent_provider        DeepSeek
agent_model           exact model identifier NOT_OBSERVABLE + reason: the session runtime exposes only the
                      display family "deepseek-flash"; no model id/version string is available to the agent
agent_harness         DeepSeek Harness (dsh), Web GUI at http://127.0.0.1:3080
harness_version_or_sha NOT_OBSERVABLE + reason: the checkout at D:\DS-Hns\app\package.json reports
                      "ds-harness" version "1.0.0-alien-rebuild", which is a build label rather than a
                      verifiable commit; recording it as a SHA would be a guess
run_or_session_id     session-c292d635-5695-453e-8340-57cf491cc007
workbook_id           WBC-601
start_time            2026-10-04T12:5x Z (first command of the session; exact second not instrumented)
end_time              NOT_OBSERVABLE at capture time (session still open when this index was written)

context_window_limit_if_known            NOT_OBSERVABLE + reason: not exposed by the harness to the agent
context_tokens_before_compaction_if_known NOT_OBSERVABLE + reason: no compaction occurred in this session
context_occupancy_ratio_if_known          NOT_OBSERVABLE + reason: same
compaction_trigger                        NOT_OBSERVABLE + reason: no compaction occurred in this session
compaction_trigger_reason                 NOT_OBSERVABLE + reason: same
task_phase_at_compaction                  NOT_APPLICABLE (no compaction)
semantic_boundary_type                    NOT_APPLICABLE (no compaction)

summary_or_checkpoint_artifact_ref        mission-book/reports/WBC-601/DEVELOPMENT_REPORT.md
                                          (this is the checkpoint that a resumed agent would read first)
external_state_refs_used                  §2
state_fields_reconstructed                (a) exact head SHA after the forced update;
                                          (b) that an earlier pushed record had been reset by another host;
                                          (c) which root-suite failures are environmental;
                                          (d) the current claim state of every READY workbook
state_reconstruction_errors               0 observed on this host; the cross-host reset in §4 was caught by
                                          comparing local and remote, not by a wrong decision

owner_intervention_count                  0
owner_intervention_reason                 NOT_APPLICABLE
task_transitions_completed                claim -> implementation -> local verification -> push -> CI FAIL ->
                                          repair -> CI PASS -> control-plane record -> rebase/publish
duplicate_work_count                      0 executed; 1 avoided (see §4, last item)
stale_state_error_count                   2 (both caught before they could cause a wrong action; §4)
false_completion_count                    0 declared; 1 prevented by hosted CI (§4)
regression_or_reopened_work_count         0
recovery_time_if_measurable               NOT_OBSERVABLE + reason: no wall-clock instrumentation around the
                                          rebase/recovery steps
autonomous_work_span_if_measurable        NOT_OBSERVABLE + reason: session start time was not instrumented
                                          before work began, so an honest span cannot be given
terminal_reason                           EXECUTION_BACKEND_STANDARD_COMPAT_ACCEPTED (development side);
                                          opposite-host Formal Review PENDING
```

## 4. Incidents worth citing (RQ1/RQ2 raw material)

**I1 — A local PASS that a hosted runner correctly refused (false-COMPLETE prevention).**
The new equivalence test asserted the literal health word `healthy`. It passed on this host because a resident
City serves a Rooms hub here, and failed on the clean runner because there is no Rooms hub there. The test was
asserting *the environment* while believing it was asserting *the contract*. Two things follow for RQ2: the
local environment is part of the agent's "active working context" and is exactly the kind of context that must
**not** be trusted as evidence; and the hosted CI receipt is an externalised fact that corrected a semantic
error the agent could not see from inside its own context.
Evidence: CI run 37204673910 log; `DEVELOPMENT_REPORT.md` §10.

**I2 — A generated status file that was two merges stale (stale-SHA avoidance).**
`UTOPIA_LIVE_STATUS.json` named `69a097b5` as Utopia `main` while the real head was `612c344f`. The claim would
have anchored the whole task to a superseded baseline had the generated file been trusted. The rule
(§7: reconciliation, and "runtime measurement > canonical source") is what caught it.
Evidence: `DEVELOPMENT_REPORT.md` §1.

**I3 — A pushed record silently reset by another host (cross-host state hazard).**
This host pushed the claim and then the development record; the other host pushed 13 commits from a local state
that predated them, and the WBC-601 workbook's `development_head_sha`/`development_ci`/`development_complete`
were observed back at `null`/`false` in `origin/main`. Nothing was lost (the code and report were untouched) and
the repair was a rebase plus re-publish, but the generalisable fact is: **on a multi-host control plane, a
push is not a durable-state transition; only a read-back verifies it.** This is a concrete candidate for
"authoritative structured execution state needs optimistic concurrency or a verify-after-push step".
Evidence: `git diff HEAD..origin/main` showing the three fields reset; `git merge-base --is-ancestor` proving the
claim commit itself was still an ancestor (i.e. this was **not** a claim takeover).

## 5. Task-pool continuity (post-completion re-scan)

Recorded because §14B.1 names "task-pool continuous claiming and drain" as an APPLICABLE signal. As of this
index, the READY workbooks visible on the live board are: `WBC-602`, `CEX-701` (claimed by the other host),
`CEX-702`, `CEX-703`, `CEX-704`, `REX-801`, `REX-802`, plus `JOIN-590` (physical acceptance) and `SHOW-401`
(non-product media, preferred host Alien). Zero-claim classification was therefore not reached:
`claimable_now = 1` for this host at the moment of the scan.

## 6. Research Institute topics these observations should feed

```text
06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/01-研究院(Research-Institute)-\
&-研究机制实验平台(Research-Mechanism-Experimentation-Platform)/paper-materials/{en,zh-CN}/
    LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md          <- RQ1/RQ2/RQ3 framing; I1, I2
    LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md  <- I2, I3 (state identity and
                                                                   freshness of external facts)
```

`NO_RESEARCH_SIGNAL` is **not** claimed: the session produced at least three citable incidents (I1–I3).

## 7. What this index deliberately does not claim

* No causal conclusion. I1–I3 are naturalistic observations from one session; §14B.5 reserves causal claims for
  controlled replay / ablation, and none was run.
* No token or cost telemetry: the harness did not expose it, and §14B.3 forbids substituting a number.
* No compaction study: no compaction occurred in this session, so the fields are `NOT_OBSERVABLE + reason`
  rather than a fabricated trigger story.

## Opposite-host review extension

Alien-codex physical MERA-ALIANWARE independently found original dispatch target/reservation bypass and running-task reassignment, readiness contradiction, and null-port untyped refusal. See REVIEW_FINDINGS.md and correction11e59e71a2aaf00a03bb95d1f6d6a9a600191dd0. Existing developerCI success did not cover independent negatives. Reviewer original fixture-ID error retained as INVALID_INSTRUMENT, not product failure.

research_watchlist_hits=[RS-G3-INDEPENDENT-REVIEW-BOUNDARY,RS-G3-IDENTITY-PROVENANCE,RS-G4-UNIFIED-CONTROL-PLANE]; highest_research_grade_observed=G4_RARE_SYSTEMIC; research_capture_level=MAXIMUM_BOUNDED. Original head, corrected head, role eligibility, canonical behavior comparator, new registry gate and pendingCI are separate evidence states. Not a novelty judgement.

Final correction f66db60998343bf99243621cfcfa2363a4566db8 CI37208400707 SUCCESS; focused24 and critic20 pass. Core readiness mismatch was interface-boundary counterexample, not observed current Gateway regression. Formal root opposite-host acceptance nowPASS; merge not performed. See REVIEW_REPORT.md.
