# 工务区 Engineering Works District — 工程运维域 Engineering Operations Domain

STATUS = STRUCTURE_READY
PROJECT_MAPPING = PARTIALLY_REVIEWED

Engineering owns **construction execution, engineering verification, repair, deployment, host adaptation and operational recovery**. It may use broad operational authority, but it does not own City constitutional authority.

## Primary engineering system

### DS-Hns

- **Repository:** https://github.com/zhiheng-zhang-Mera/DS-Hns
- **State:** EXISTING_INDEPENDENT_REPOSITORY
- **Long-term role:** engineering construction orchestrator.

Its stable core should own:

- engineering task planning and decomposition;
- worker/provider selection inside the Engineering domain;
- repository/workspace mutation;
- checkpoint/resume;
- construction verification;
- failure diagnosis and repair loops;
- engineering scheduling;
- result/evidence production.

## Existing independent engineering services

### Health Scheduler

- **Repository:** https://github.com/zhiheng-zhang-Mera/dsh-health-scheduler
- observes runtime/host pressure;
- recommends throttle/pause/restart actions;
- does not perform the restart itself.

### Restart Service

- **Repository:** https://github.com/zhiheng-zhang-Mera/dsh-restart
- validates restart requests;
- gates on checkpoint/safe-point;
- executes restart protocol and external relaunch supervision;
- does not decide whether a restart is warranted.

These are examples of successful extraction from the Hns product surface into independently bounded engineering services.

## Legacy / reference host assets

### Harness-Alien

- **Repository:** https://github.com/zhiheng-zhang-Mera/Harness-Alien
- role: host/shell baseline and adapter lineage;
- long-term city status: reference/baseline asset rather than a required top-level building once the host-adapter contract is canonical.

### Harness-Mega

- **Repository:** https://github.com/zhiheng-zhang-Mera/Harness-Mega
- role: feature donor / legacy engineering asset;
- long-term city status: historical/reference source after retained capabilities are migrated into DS-Hns or bounded services.

## Planned extraction from Codex-Boss

```text
CURRENT_SOURCE = Codex-Boss
TARGET_OWNER = DS-Hns / Engineering
FUTURE_EXTRACTION = PRESET_NOT_NOW
```

The following ordinary engineering responsibilities should move out of City Core and converge on Hns:

- engineering goal acceptance;
- engineering verification policy;
- targeted test/check selection;
- ordinary construction/acceptance-session bookkeeping;
- construction-result verification;
- engineering recovery/retry loops;
- CI repair mechanics when they are engineering execution;
- engineering evidence production proving a task was completed.

Current seed surfaces include:

- `electron/engineering/goal-acceptance.ts`;
- `electron/engineering/verification-policy.ts`;
- ordinary Engineering portions of `electron/engineering/acceptance-session.ts`;
- ordinary Engineering portions of `electron/engineering/final-acceptance-gate.ts`.

### Must not move from Boss Core into Engineering

- Owner sovereignty / Root Trust;
- constitutional authority;
- city-wide protected-surface definitions;
- generic durable city state/event primitives;
- city-wide audit/provenance primitives.

### Must remain in Qualification Control

Production-level qualification, trusted-runner isolation, immutable-candidate attestation and promotion certification remain the responsibility of **Boss-Qualification-Control**, not Hns.

The target is one engineering verdict path:

```text
Hns
  -> executes work
  -> verifies engineering completion
  -> emits evidence

Qualification Control
  -> independently certifies candidates when high-grade qualification is required
```

## Roads

- **Node Road** → consumes eligible nodes/resources from City Node Fabric.
- **Capability Road** → consumes available engineering providers/tools from Capability Fabric.
- **Evidence Road** → emits engineering evidence to Qualification or other authorized consumers.
- **Recovery Road** → health/restart and continuation semantics.
- **Construction Road** → projects/buildings under active development.

## Boundary

Hns may be the Engineering domain's primary orchestrator, but it must not become a second City Core. City-wide task authority, identity, Root Trust and global cross-domain policy remain outside Engineering.
