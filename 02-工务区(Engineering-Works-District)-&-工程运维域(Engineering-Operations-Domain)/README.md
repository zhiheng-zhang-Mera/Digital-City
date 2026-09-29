# 工务区 Engineering Works District — Engineering Operations Domain

STATUS = PROJECT_FIRST_REVIEWED_BOSS_HNS
IMPLEMENTATION = PARTIAL_IN_UTOPIA

## Buildings
1. [Project Foreman](./01-项目工头(Project-Foreman)-&-工程任务编排器(Engineering-Task-Orchestrator)/)
2. [Worker Gateway](./02-施工队接入站(Worker-Gateway)-&-工程执行平台适配层(Engineering-Provider-Adapter-Layer)/)
3. Host Health Station — owned by independent `dsh-health-scheduler`.
4. Restart Recovery Station — owned by independent `dsh-restart`.

## Three-level scheduling boundary
```text
City Core — which domain?
  ↓
Project Foreman — how Engineering plans/supervises/verifies?
  ↓
Worker Gateway/provider — how assigned execution is performed?
```

## Boss + Hns functional union
The Engineering target is the superset of both source implementations:

- goal intake/interpretation/acceptance;
- repo/world/code/dependency inspection;
- plan/DAG/microtask decomposition;
- provider/node/workspace assignment;
- adaptive resource-aware concurrency;
- scoped mutation/path/permission guards;
- worktree isolation/file ownership/conflict detection;
- checkpoint/rollback/resume;
- independent review/finding feedback;
- targeted tests + full integration/final acceptance;
- verification policy;
- CI repair;
- stall/crash/failure recovery/reassignment;
- durable Engineering evidence/journal/results;
- explicit refusal/escalation for unsupported/high-risk work.

Boss contributes mature goal/review/verification/CI-repair/world-model/acceptance semantics. Hns contributes the vendor-neutral Engineering host, worker/DAG/resource scheduling, worktree isolation, provider execution, recovery and long-hosting mechanics.

Utopia currently has a promoted Hns-derived Skill Intake module in Worker Gateway.

## Boundary
Root Trust, global task ownership and production qualification stay outside 02. Health/Restart remain independent projects even though Hns integrates them.
