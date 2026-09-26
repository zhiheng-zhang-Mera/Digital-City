# 项目工头 Project Foreman — 工程任务编排器 Engineering Task Orchestrator

```text
STATUS = EXISTING_PROJECT_WITH_FUTURE_REFACTOR
REPOSITORY = https://github.com/zhiheng-zhang-Mera/DS-Hns
CURRENT_PRODUCT_BIAS = DeepSeek-Harness
TARGET_IDENTITY = Hns / vendor-neutral Engineering Orchestrator
```

## Role

Hns is the **Engineering-domain foreman**.

It receives an Engineering-owned task from City Core, decomposes it, selects appropriate providers/nodes, supervises execution, verifies the result, repairs failures and emits evidence.

## Stable Hns core

Hns should permanently own:

- project/repository inspection;
- engineering goal interpretation;
- plan / DAG / subtask decomposition;
- Engineering-domain provider selection;
- Engineering-domain node/workspace assignment;
- scheduling and concurrency;
- checkpoint/resume coordination;
- failure diagnosis and retry/reassignment;
- repository mutation coordination;
- construction verification;
- engineering result/evidence production.

## Provider-neutral refactor

DeepSeek Harness must become **one provider**, not the identity of Hns itself.

Target invariant:

> Disabling/removing the DeepSeek provider must not prevent Hns from starting, planning, scheduling, supervising and verifying work through another compatible provider.

Vendor-specific UI, authentication, updater and runtime internals must not become Hns Core dependencies.

## Planned extraction from Codex-Boss

The following ordinary Engineering responsibilities are preset to converge here:

- engineering goal acceptance;
- engineering verification policy;
- targeted test/check selection;
- ordinary engineering session bookkeeping;
- construction-result verification;
- engineering recovery/retry loops;
- engineering CI-repair mechanics;
- completion evidence generation.

Candidate Boss seed surfaces currently include:

- `electron/engineering/goal-acceptance.ts`;
- `electron/engineering/verification-policy.ts`;
- ordinary Engineering portions of `electron/engineering/acceptance-session.ts`;
- ordinary Engineering portions of `electron/engineering/final-acceptance-gate.ts`.

## Must stay outside Hns

- city-wide task ownership and global cross-domain priority;
- Owner / Root Trust / constitutional authority;
- Node Fabric identity/membership truth;
- Capability Fabric global registry truth;
- production qualification / trusted-runner attestation;
- domain business logic outside Engineering.
