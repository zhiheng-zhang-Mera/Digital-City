# CEX-790 — Alien 当前 main 集成

> 阅读译本 / Reading translation：此文件是原报告的中文阅读译本，不是第二份工作书或权威状态。历史事实和状态保持原报告记录；不新增验收、不提升未观测值。权威原文见文末互链。

Owner 指令（2026-10-06）：优先处理 CEX-790，使其可合并到 main，然后直接处理 MON。这取代此前 REX 先于 MON 的顺序；SHOW 仍被排除。它授权本次集成和下一 MON 工作，不授权虚构测量或自动豁免 MON 独立评审／设备门禁。

主机为 Alien（`Mera-Alianware`）。CEX-790 原开发者为 Mech。既有控制平面闭环及其记录的历史豁免作为历史保留；本报告不虚构历史评审者。

| 身份 | 精确值 |
|---|---|
| main 集成基线 | 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef |
| Mech 已审分支头 | 04ecb7dd22ffd7296e00320b63681f7d9729181d |
| 集成来源提交（保留双亲） | 65f86f91a3d404cdbcb8f2fa43ceb9da8e994600 |
| 已发布证据头 | 4688274255464383d577841a37e85a556d92c678 |
| 分支 | integration/CEX-790-Alien-20261006 |
| PR | https://github.com/zhiheng-zhang-Mera/utopia/pull/33 |

五个文件有冲突。解决保留 main 原生 enrollment、会话续期、离开和研究轨迹；扩展 owner／message／pairing 类型化拒绝；通过删除重复渲染保留 Web 凭据防护及调度器 busy 状态。此差异没有用旧依赖联合替换 main。

独立同主机技术批评者从实际分派／导出重建路由／目录，而非使用作者矩阵：59 条按方法区分的 HTTP 路由加 health、2 个 WS 传输、4 种 Action、16 个 Ask 目标、10 个活跃及 10 个退役房间。可移植当前提取器结果一致，并记录 17 条 Registry 记录、47 个 Web 入口、35 个 Android 入口、4 个调度动作。205 项发现快照带输入内容哈希、精确源码与 Registry SHA／脏状态。它们是候选，不是 205 项已验收能力。历史 JSON／矩阵不变；旧渲染器现断言其历史基线。

全部差异分类在 `utopia:evidence/raw/mission-book/CEX-790/current/RECONCILIATION.md`。审计后的项目组债务保留：WBC-604 执行配置正常入口债务、REX 研究 Android 对等，以及五条分支范围 Registry 记录尚未进入 main。未增加已安装运行时或实体设备验收主张。

## 带溯源采纳的启动存储缺陷

既有跨项目组缺陷报告提供两个精确、独立开发的最小修复分支：`repair/capability-bridge-mech-artifact-store-guard` 和 `repair/REX-801-mech-store-guard`。代码差异经审查采纳。修补前七个实际 store 探针全失败，之后七个全通过。构造失败的红色运行留下所属测试资源未关闭，采集后终止；没有停止真实 City。

批评者发现进一步实际 API→UI 字段丢失缺陷：Web 丢弃 `persisted:false` 和失败原因。真实浏览器修复前复现缺失提示；修复后观察到存储不可用与有效但未归档回执。City 继续服务，失败主题／实验存储只降低对应能力。失败红色证据保留于本地 `.runtime/evidence/CEX-790/`，未被绿色输出替换。

Alien 实测验证：增加 guard 改动前初始完整 Gateway／Web 1350 通过／0 失败；最终受影响套件 11 通过／0 失败；Rooms 69 通过／0 失败；City 1969 通过／0 失败且明确跳过 15；双语同步；验证十条提升历史记录。最终精确头托管运行分别为 37412522043（push）、37412526500（PR）、37412526523（linkage）。初次报告发布时 push／PR 为 IN_PROGRESS，linkage SUCCESS。不从排队／运行任务推断绿色结果。

## 集成状态

PR #33 在发布头文本上 MERGEABLE。报告可合并就绪前，最终精确头 CI 仍是门禁。请求是使其可合并；工作书仍有 `merge_authority:false`，故本报告不会静默执行 main 合并。根据更新的 Owner 指令，MON 在此合并就绪门禁后启动，无需等待 REX 闭环。

最终门禁实时验证：精确 `4688274255464383d577841a37e85a556d92c678` 上 push 37412522043 和 PR 37412526500 完成 SUCCESS（gateway-web 与 android 均 success）；linkage 37412526523 SUCCESS。PR33 MERGEABLE，mergeStateStatus CLEAN，本地／远端特征分支一致且工作树干净。CEX-790 为 READY_TO_MERGE；未执行 main 合并。MON-902 评审现于此门禁后被领取。

语言配对 / Language pair: [English](../ALIEN_INTEGRATION_REPORT.md) · [中文](./ALIEN_INTEGRATION_REPORT.md)
