# 公安监管 Public Security — 运行时合规执行 Runtime Compliance Enforcement

```text
STATUS = PROJECT_NOT_CREATED
CURRENT_IMPLEMENTATION_SOURCE = Codex-Boss
FUTURE_EXTRACTION = PRESET_NOT_NOW
ACTION = ENFORCE
```

## Future extraction target

Extract the reusable runtime enforcement layer for city-wide hard boundaries:

- privilege-request enforcement;
- cross-domain access enforcement;
- protected-resource access checks;
- service/capability registration enforcement hooks;
- authority-escalation rejection;
- city-wide runtime-policy decision application;
- audit-friendly enforcement verdicts.

Candidate Boss seed surfaces include:

- generic enforcement portions of `electron/capability/authorization.ts`;
- `electron/commander/execution-gate.ts`;
- `electron/commander/runtime-policy.ts`;
- cross-domain/runtime boundary enforcement hooks;
- generic permission-decision application.

## Must remain in Core or owning domains

- Owner sovereignty;
- Root Trust / Root Authority as the source of truth;
- constitutional protected-surface definitions;
- domain-local policy;
- domain business state;
- qualification/promotion control.

Public Security must **consume authority facts from Core** rather than becoming a second authority source.

## Extraction gate

A standalone package/repository/service becomes justified only when the enforcement contract is stable, independently testable, used at multiple city-domain boundaries, and separation provides a real independent lifecycle/failure-domain benefit.
