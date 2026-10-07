> English reading translation / 英文阅读译本. The [original document](../CHK-401-evolution-candidate-triage-routing.md) remains authoritative for status and evidence. This reader grants no claim, execution, activation, or migration authority.

> **Owner ruling (2026-10-07):** 暂时屏蔽旧版工作书的验收限制，对 DGX 和 CHK 系列在各自分支上全量完成。第二机验收会直接一次性处理整个系列而不是分拆逐个任务验收。 Internal development proceeds across all five CHK workbooks on Alien-GPT-CHK without waiting for old per-task opposite-host acceptance. Whole-series independent second-host review remains NOT_RUN. This exception changes development sequencing only; no main merge, scheduling, repair or promotion authority is granted. Accepted dependency SHAs remain unfilled until actually accepted.


# CHK-401 — Evolution Candidate Triage & Routing

> **OWNER ACTIVATED / EXECUTION ENABLED.** The first run is bounded dry-run/read-only. Dependency, independent review and promotion gates remain in force; automatic repairs and self-modification are not authorized.

## Objective
Send candidates produced by CHK-301 to the appropriate follow-up mechanisms, so that self-evolution does not become universal permission to change everything directly.

## Candidate routing
### Rule / governance change
→ DGX / RIV / Mission Book rule migration, depending on scope.

### Runtime architecture / ownership
→ URA or an independent architecture migration.

### Research hypothesis / replay / fault / ablation
→ REX.

### Capability/UI exposure repair
→ A Mission workbook linked to the Capability Registry.

### Provider/routing intelligence
→ The corresponding Engineering/GAI runtime programme; put high-risk strategies through shadow mode first.

### Boss donor harvest
→ Perform a legacy diff first, then decide KEEP_AS_REFERENCE / EXTRACT_DESIGN / EXTRACT_CODE / SUPERSEDED.

## Safety ladder
Every actual self-evolution proposal requires at least the following by default:

```text
candidate
→ sandbox / isolated implementation
→ historical replay
→ controlled evaluation
→ shadow mode
→ independent verification
→ explicit promotion authority
→ limited rollout
→ Monitor/JEV observation
→ full promotion or rollback
```

Individual tasks may be stricter; they must not be relaxed enough to bypass domain safety boundaries.

## Candidate states
```text
PROPOSED
NEEDS_EVIDENCE
ROUTED
CONTROLLED_EVALUATION
SHADOW
AWAITING_PROMOTION_AUTHORITY
PROMOTED_LIMITED
PROMOTED
ROLLED_BACK
REJECTED
SUPERSEDED
```

In the future, these states must be held by the actual owner programme. CHK retains only the routing receipt and must not establish a second execution truth.

## Completion gate
Every quarterly candidate has a unique destination, deferral reason, or rejection reason. No evolution proposal remains ownerless.
