# 工务区 Engineering Works District — 工程运维域 Engineering Operations Domain

STATUS = STRUCTURE_READY
PROJECT_MAPPING = REVIEWED_AT_BUILDING_LEVEL

02 owns engineering construction and operational support. It does not own city-wide authority.

## Buildings

1. [项目工头 / Project Foreman](./01-项目工头(Project-Foreman)-&-工程任务编排器(Engineering-Task-Orchestrator)/) — Hns; engineering-domain task orchestration.
2. [施工队接入站 / Worker Gateway](./02-施工队接入站(Worker-Gateway)-&-工程执行平台适配层(Engineering-Provider-Adapter-Layer)/) — thin adapters for official coding-agent products and future engineering providers.
3. [主机保健站 / Host Health Station](./03-主机保健站(Host-Health-Station)-&-运行健康调度服务(Runtime-Health-Scheduling-Service)/) — host/runtime health observation and action recommendation.
4. [重启恢复站 / Restart Recovery Station](./04-重启恢复站(Restart-Recovery-Station)-&-安全重启外部监督服务(Safe-Restart-External-Supervision-Service)/) — safe restart execution and external relaunch supervision.

## Three-level scheduling boundary

```text
City Core
  decides WHICH DOMAIN owns a city task
        ↓
Hns / Project Foreman
  decides HOW Engineering decomposes and assigns the work
        ↓
Official Provider / Worker
  decides HOW to execute its assigned engineering subtask
```

Hns must therefore not become a second City Core, and a provider must not become the Engineering orchestrator.

## Official-provider rule

The long-term Engineering model prefers the vendor's **official complete software** where available.

Hns should not maintain a forked clone of the vendor runtime, UI, authentication flow or updater merely to integrate it. Integration belongs in a thin provider adapter that can:

- detect installation/version/readiness;
- declare capabilities;
- create or attach to a task/session;
- submit work;
- observe status;
- cancel/interrupt where supported;
- collect result/evidence;
- resume/checkpoint only when the provider genuinely supports it.

Candidate future provider adapters include DeepSeek Harness, Claude Code, OpenAI Codex, WorkBuddy/CodeBuddy and other engineering agents. Their presence here is an adapter target, not a claim that every adapter already exists.

## Legacy/reference assets

- **Harness-Alien** — host/shell baseline and adapter lineage.
- **Harness-Mega** — feature donor / legacy engineering source.

They remain useful historical/reference repositories but are not long-term top-level city buildings once their retained capabilities are represented by Hns, adapters or bounded services.

## Boss → Engineering migration

Ordinary engineering completion/verification/recovery responsibilities currently retained in Codex-Boss are preset to converge on the Project Foreman:

- engineering goal acceptance;
- engineering verification policy;
- targeted test/check selection;
- ordinary construction/acceptance-session bookkeeping;
- construction-result verification;
- engineering retry/recovery mechanics;
- CI repair mechanics that are engineering execution;
- engineering evidence production.

Root Trust, constitutional authority and production qualification remain outside 02.

## Roads

- **Global Task Road** ← City Core assigns an Engineering-owned task.
- **Node Road** ← Node Fabric exposes eligible machines/resources.
- **Capability Road** ← Capability Fabric exposes available engineering providers/tools.
- **Evidence Road** → Hns emits engineering completion evidence.
- **Recovery Road** ↔ health/restart services.
