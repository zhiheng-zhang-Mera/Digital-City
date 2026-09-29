# Project Foreman — 工程任务编排器

```text
STATUS = PROJECT_FIRST_COMPOSITE_IMPLEMENTATION
PRIMARY_PROJECT = DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973
SECONDARY_DONOR = Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080
UNION_ID = engineering-runtime-union
```

## Role
Own Engineering-domain inspection, planning, scheduling, supervision, verification, repair and closeout.

## Boss contribution
Autonomous goal/convergence loop; repo/code/world models; finding scope; independent review; verification policy/targeted tests; acceptance/final gates; git rollback; CI repair/recovery; durable progress/results/evidence; fail-closed completion.

## Hns contribution
Engineering plan/DAG; provider/worker assignment; adaptive resource scheduling; constrained task packages; isolated worktrees/file ownership; checkpoint/resume; multi-signal stall/crash detection; retry/reassignment; integration worktree; final validation; cross-volume cleanup/continuity.

## Target flow
```text
inspect → model → goal → plan/DAG → assign → execute isolated → observe/recover
→ review → targeted verify → integrate → full acceptance → evidence/result
```

No source loses a useful verified capability merely because the other has a similar implementation.

## Boundary
City-wide authority/priority, global Capability/Node truth, qualification and non-Engineering business logic stay outside.
