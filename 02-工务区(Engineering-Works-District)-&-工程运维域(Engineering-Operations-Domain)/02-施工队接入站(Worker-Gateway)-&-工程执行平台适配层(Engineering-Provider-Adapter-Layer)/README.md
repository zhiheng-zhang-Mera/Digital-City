# Worker Gateway — 工程执行平台适配层

```text
STATUS = PROJECT_FIRST_COMPOSITE_IMPLEMENTATION
PRIMARY_PROJECT = DS-Hns
ADDITIONAL_DONOR = Codex-Boss
UTOPIA_PROMOTED_MODULE = skill-intake
```

## Role
Translate official engineering-agent/runtime products into a bounded Foreman-facing execution contract.

### Hns foundations
Official DSH integration; process/plugin/provider adapters; worker/task contracts; worker pool; Skill Intake; provider capabilities; readiness/health.

### Boss foundations
Web/API/Codex/local runtime adapters; role-router/provider-session registry; provider capability/profile/state/outcome models; circuit-breaker/health semantics; bounded dispatch/interruption/recovery.

## Target provider contract
Detect/version/capabilities/readiness; create/attach/start; submit bounded work; status/progress; cancel/interrupt; result/evidence; unsupported-capability refusal; optional checkpoint/resume.

Prefer official vendor software and stable process/API boundaries over forked vendor UI/runtime/auth/updaters.

## Boundary
Gateway does not own the Engineering plan, city-global registries, Node identity, provider reasoning or city-wide authorization.
