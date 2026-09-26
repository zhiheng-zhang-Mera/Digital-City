# 市政治安区 Civic Government & Safety District — 治理安全域 Governance & Security Domain

STATUS = STRUCTURE_READY
PROJECT_MAPPING = PARTIALLY_REVIEWED

This district contains city-level qualification, admission and runtime hard-boundary enforcement. It **does not contain the City Core itself**.

## Existing independent project

### Boss Qualification Control Plane

- **Repository:** https://github.com/zhiheng-zhang-Mera/Boss-Qualification-Control
- **State:** EXISTING_INDEPENDENT_REPOSITORY
- **Role:** qualification workflow, real-soak runner isolation, immutable-candidate attestation, evidence-backed promotion control.
- **Extraction from Boss:** NO — this control plane is already separated.

## Planned future extractions from Codex-Boss

### 01 海关安检 / Customs Security — ADMIT

See [Customs Security](./01-海关安检(Customs-Security)-&-扩展准入检查(Extension-Admission-Checks)/).

Current source material remains inside Codex-Boss. Future extraction is preset, but **not now**.

Target extracted responsibility:

- extension/plugin manifest and schema validation;
- identity/source checks;
- dependency declaration checks;
- requested capability/permission declarations;
- domain/storage namespace declarations;
- crash/isolation declaration checks;
- enable/disable/uninstall/rollback readiness;
- admission-time lifecycle preflight.

It must not take Root Trust, post-admission enforcement or domain-quality decisions.

### 02 公安监管 / Runtime Compliance — ENFORCE

See [Runtime Compliance](./02-公安监管(Public-Security)-&-运行时合规执行(Runtime-Compliance-Enforcement)/).

Current source material also remains inside Codex-Boss. Future extraction is preset, but **not now**.

Target extracted responsibility:

- privilege-request enforcement;
- cross-domain access enforcement;
- protected-resource access checks;
- service/capability registration enforcement hooks;
- authority-escalation rejection;
- city-wide runtime-policy application;
- audit-friendly enforcement verdicts.

It must consume authority facts from Core, not duplicate Owner sovereignty, Root Trust or Root Authority.

## Placement corrections

- **Codex-Boss** belongs to **00/01 City Core**, not this district.
- **General-Logic-Engine** belongs to **00/05 Control Centre** as a logic/rule/state/explanation backend component, not this district.

## Boundary

```text
00 Core
  owns authority facts and constitutional primitives

01 Qualification / Customs / Runtime Compliance
  evaluates or enforces using those facts
```

Research, Health, Engineering and other domain-local rules remain in their own domains unless explicitly promoted to city-wide scope.
