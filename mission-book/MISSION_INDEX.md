# Mission Index

> 排序只表示当前纯迁移队列的默认施工顺序。**每个 Mission 文件自身的 Claim/Complete 字段才是运行时真值。**

| Seq | Mission | Enabled | Migration | Verification | 主要来源 | City target |
|---:|---|:---:|:---:|:---:|---|---|
| 1 | [MB-001](./MB-001-core-os.md) | YES | COMPLETE | NOT_STARTED | zhiheng-zhang-Mera/Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 00/01 City Core — Runtime Trust & Orchestration Kernel |
| 2 | [MB-002](./MB-002-capability-fabric.md) | YES | COMPLETE | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 + DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973 | 00/03 City Service Network — Capability Registry & Discovery |
| 3 | [MB-003](./MB-003-worker-gateway.md) | YES | COMPLETE | NOT_STARTED | DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973 | 02/02 Worker Gateway — Engineering Provider Adapter Layer |
| 4 | [MB-004](./MB-004-project-foreman.md) | YES | CLAIMED | NOT_STARTED | DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973 | 02/01 Project Foreman — Engineering Task Orchestrator |
| 5 | [MB-005](./MB-005-host-health.md) | YES | COMPLETE | NOT_STARTED | zhiheng-zhang-Mera/dsh-health-scheduler @ 985e2b7389330db4b32ea2946e3657746c64b47b | 02/03 Host Health Station — Runtime Health Scheduling Service |
| 6 | [MB-006](./MB-006-restart-recovery.md) | YES | COMPLETE | NOT_STARTED | zhiheng-zhang-Mera/dsh-restart @ e20fb6cc43e27cedf6303471e5b8ee18e1383ecd | 02/04 Restart Recovery Station — Safe Restart External Supervision |
| 7 | [MB-007](./MB-007-research-institute.md) | YES | **BLOCKED_OWNER_DECISION** | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 06/01 Research Institute — Research Mechanism Experimentation Platform |
| 8 | [MB-008](./MB-008-computer-use.md) | YES | CLAIMED | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 10/01 Computer Use Runtime — Generic Computer Interaction Execution Service |
| 9 | [MB-009](./MB-009-theme-relocation.md) | YES | NOT_STARTED | NOT_STARTED | Utopia main 当前 city/11-entertainment/01-entertainment-centre/theme-engine | 00/05 City Control Centre — Presentation & Theming |
| 10 | [MB-010](./MB-010-node-fabric.md) | NO | NOT_STARTED | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 00/02 City Node Network — Device Node Fabric |
| 11 | [MB-011](./MB-011-customs.md) | NO | NOT_STARTED | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 01/01 Customs Security — Extension Admission Checks |
| 12 | [MB-012](./MB-012-runtime-compliance.md) | NO | NOT_STARTED | NOT_STARTED | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080 | 01/02 Public Security — Runtime Compliance Enforcement |

> **Dependency history for MB-004 (resolved, recorded so it is not re-litigated).** MB-004
> declares `依赖 Mission: MB-003`. MB-003 was `migration_complete` while its Verification stage
> was still open and its branch was **not merged** into `zhiheng-zhang-Mera/utopia` main.
> Because rule 7 cuts every migration branch from the target repo's latest `main`, host `Alien`
> read the dependency as unsatisfied at 2026-09-29T13:02:19Z and claimed MB-006 instead, using
> the conservative definition (satisfied once the dependency's artifacts are in `main`). Host
> `Mech` subsequently claimed MB-004 under the looser reading (satisfied by
> `migration_complete` alone). **The mission-book does not define which reading is correct**;
> both are recorded here rather than one being presented as the rule. MB-004 is claimed, so the
> question is now moot for claiming, but it will matter again at MB-004's Verification, where
> the verifier must decide whether a Foreman built on a `main` that lacks MB-003 can be
> accepted, and at merge time, where MB-003 and MB-004 both touch `city/02-engineering/`.

## Selection rule

```text
1. enabled + unclaimed + MIGRATION incomplete + dependencies satisfied
   → sequence ASC
2. if none:
   enabled + migration complete + unclaimed VERIFICATION + different host
   → sequence ASC
3. claimed-but-incomplete / disabled / blocked
   → skip
```

不要把本表的静态状态当作 Claim 真值；领取前必须打开对应 Mission 文件并读取最新 Digital-City main。
