# Host Health Station — 主机保健站 / 运行健康调度服务

```text
STATUS = EXISTING_IMPLEMENTATION
REPOSITORY = https://github.com/zhiheng-zhang-Mera/dsh-health-scheduler
SOURCE_SNAPSHOT = 985e2b7389330db4b32ea2946e3657746c64b47b
CURRENT_INTEGRATION = DSH/Hns plugin
TARGET_SCOPE = vendor-neutral host/runtime health service
```

## Role

Sense and judge host/runtime/worker health, then request bounded actions.

## Capability cluster

- isolated telemetry providers and canonical normalization;
- rolling windows/daily retention and bounded history;
- trend analysis with metric polarity;
- six-dimension pressure aggregation;
- explicit telemetry coverage + unknown dimensions;
- sustain/hysteresis/debounce/dwell/cooldown anti-flapping;
- maintenance windows, defer budget and safe-point gating;
- Level 1/2 throttle/pause requests;
- Level 3/4 restart/reboot requests to Restart Recovery;
- read-only status/history/policy tools and auditable decision records.

## Boundary

It **never executes restart**. It does not own Hns task/checkpoint state, City Node membership, or global scheduling authority.

## 中文说明 / Chinese explanation

状态为 `EXISTING_IMPLEMENTATION`，仓库与快照如上，当前集成为 DSH/Hns 插件，目标是厂商中立主机/运行健康服务。职责是感知并判断主机、运行时及 worker 健康，然后请求有边界动作。

能力包括隔离遥测提供者和标准化、滚动窗口/日保留/有界历史、考虑指标方向的趋势分析、六维压力汇总、明确遥测覆盖与未知维度、持续/滞回/去抖/停留/冷却防抖机制、维护窗口/延迟预算/安全点门禁、Level 1/2 限流暂停请求、向恢复站发送 Level 3/4 重启重启主机请求，以及只读状态历史政策工具和可审计决定。

它绝不执行重启，也不拥有 Hns 任务/检查点、城市节点成员或全局调度权威。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 0 |
| 递归 Markdown 文档 / Recursive Markdown documents | 1 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `EXISTING_IMPLEMENTATION` |

### 子区导航 / Subarea navigation

本目录无直接子目录；功能归属和后续计划参见上方说明。 / No direct subdirectories; see the explanations above for capability ownership and future plans.

### 本目录文档 / Documents in this directory

- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
