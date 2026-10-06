# Mission索引 — 全局异步工程池

> 阅读译本 / Reading translation：历史导航阅读副本，不是第二份权威工作书或领取锁，不重新激活任何归档任务。

> 组件阶段2026-10-01：四池排空。BA9/9、RF10/10、GAI9/9、EM13/13双阶段完成；每任务frontmatter及../reports/ID/CORRECTION_REPORT.md记纠正头／托管。四合工作书均创建执行：[BA](../butler-assistant/BUTLER_ASSISTANT_MERGE_WORKBOOK.md)、[RF](../remote/REMOTE_FABRIC_MERGE_WORKBOOK.md)、[GAI](../general-ai-gateway/GENERAL_AI_GATEWAY_MERGE_WORKBOOK.md)、[EM](../engineering-manager/ENGINEERING_MANAGER_MERGE_WORKBOOK.md)。每纠正分支合main、同头annotated archive/ID保留、源远删，origin只main。

> 规范静态 [PROGRAMME_STATE.yaml](../PROGRAMME_STATE.yaml)，规范执行 [跨Programme契约](../CROSS_PROGRAMME_EXECUTION_CONTRACT.md)，统一基线82ed36933fb4c5b00e44768d9e1aedec1d525d9c；Alien/MechAVAILABLE。reset时41开发未领、纠正等对应开发锁。2026-10-01后41/41双阶段推送精确头绿且异机，BA→RF→GAI→EM合main e7c498f/36830053908绿，归档且远只main。下表从frontmatter生成，冲突工作书胜。

## 权威

此为仪表盘非领取锁，普通claim仅目标工作书frontmatter／报告，盘落后工作书则后者胜。

## 全局调度

空主机全扫BA/RF/GAI/EM；优先有主可修红→合资格异机纠正→任意未领开发。等CI/provider/外检查不空主机，另工作树继续领。

## Butler Assistant

| ID | 子项目 | 开发 | 纠正 | 合并 |
|---|---|---|---|---|
| [BA-001](../butler-assistant/BA-001-butler-zone-personalization.md) | Butler区及个性化契约 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [BA-002](../butler-assistant/BA-002-shared-brain-runtime.md) | 共享脑运行及上下文投影 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [BA-003](../butler-assistant/BA-003-device-embodiment-binding.md) | 设备具身及前台绑定 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [BA-004](../butler-assistant/BA-004-multi-assistant-handoff.md) | 多助手切换及显式交接 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [BA-005](../butler-assistant/BA-005-digital-me-context-gateway.md) | Digital-Me上下文及记忆／受众网关 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [BA-006](../butler-assistant/BA-006-shared-task-coordination.md) | 权威任务协调 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [BA-007](../butler-assistant/BA-007-settings-interaction-surface.md) | 助手设置及交互界面 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [BA-008](../butler-assistant/BA-008-embodiment-event-bus.md) | 事件总线及租约／重连安全 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [BA-009](../butler-assistant/BA-009-duty-permission-policy.md) | 职责／权限／主动策略 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |

## Remote Fabric

| ID | 子项目 | 开发 | 纠正 | 合并 |
|---|---|---|---|---|
| [RF-001](../remote/RF-001-node-identity-installation-lifecycle.md) | 节点身份及安装生命周期 | COMPLETE / Alien | COMPLETE / Mech | MERGED_MAIN |
| [RF-002](../remote/RF-002-unified-pairing-trust-lifecycle.md) | 统一配对及信任生命周期 | COMPLETE / Alien | COMPLETE / Mech | MERGED_MAIN |
| [RF-003](../remote/RF-003-local-discovery-lan-direct.md) | 同Wi-Fi/LAN发现及本地直连 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [RF-004](../remote/RF-004-bluetooth-bootstrap-ip-handoff.md) | 蓝牙引导及IP交接 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [RF-005](../remote/RF-005-remote-invite-rendezvous.md) | 远程邀请／会合码／深链 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [RF-006](../remote/RF-006-secure-transport-path-manager.md) | 安全路径管理及relay回退 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [RF-007](../remote/RF-007-versioned-capability-registry.md) | 版本化能力注册 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [RF-008](../remote/RF-008-typed-rpc-event-stream-commands.md) | 类型RPC/事件/流及可靠命令 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [RF-009](../remote/RF-009-presence-offline-reconnect-audit.md) | 在线／离线／重连及审计 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [RF-010](../remote/RF-010-fabric-policy-public-api.md) | Fabric策略边界及公共API | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |

## General AI Gateway

| ID | 子项目 | 开发 | 纠正 | 合并 |
|---|---|---|---|---|
| [GAI-001](../general-ai-gateway/GAI-001-core-contracts-action-vocabulary.md) | 核心契约及Action词汇 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-002](../general-ai-gateway/GAI-002-provider-model-account-registry.md) | provider/model/account注册 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-003](../general-ai-gateway/GAI-003-web-channel-persistent-session.md) | Web优先通道及持久会话 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-004](../general-ai-gateway/GAI-004-api-channel-consent-budget.md) | API通道／同意／预算 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-005](../general-ai-gateway/GAI-005-triage-jev-routing.md) | 确定性/JEV分流路由 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-006](../general-ai-gateway/GAI-006-conversation-input-stream-cancel.md) | Conversation/InputBundle/流/取消 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-007](../general-ai-gateway/GAI-007-device-aware-remote-execution.md) | 设备感知远执行及结果返回 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-008](../general-ai-gateway/GAI-008-health-resilience-degradation.md) | 健康／弹性／诚实降级 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [GAI-009](../general-ai-gateway/GAI-009-utopia-surface-integration.md) | Ask/Do、Action、Web/Android集成 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |

## Engineering Manager

| ID | 子项目 | 开发 | 纠正 | 合并 |
|---|---|---|---|---|
| [EM-001](../engineering-manager/EM-001-core-contracts-boundaries.md) | 核心契约及归属边界 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-002](../engineering-manager/EM-002-connector-adapter-process-runtime.md) | Connector适配框架及通用进程运行 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-003](../engineering-manager/EM-003-job-result-artifact-protocol.md) | Job/事件/结果/工件协议 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-004](../engineering-manager/EM-004-capability-probe-auth-registry.md) | 能力／探测／鉴权／实例注册 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-005](../engineering-manager/EM-005-attention-recent-device-alerts.md) | 注意力桥及最近设备通知／铃声 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-006](../engineering-manager/EM-006-local-first-subworker-placement.md) | 本地优先Sub-worker放置 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-007](../engineering-manager/EM-007-remote-subworker-return-control.md) | 远Sub-worker及自动返回／控制 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-008](../engineering-manager/EM-008-credential-profile-session.md) | 凭据／profile／session持久化 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-009](../engineering-manager/EM-009-runtime-health-restart-recovery.md) | 运行健康／重启／恢复 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-010](../engineering-manager/EM-010-foreman-scheduler-dag-worker-pool.md) | Foreman队列/DAG/资源/workerpool | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-011](../engineering-manager/EM-011-deepseek-codex-reference-connectors.md) | DeepSeek Harness＋Codex参考connector | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-012](../engineering-manager/EM-012-connector-sdk-claude-workbuddy.md) | ConnectorSDK及Claude Code/WorkBuddy扩展 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |
| [EM-013](../engineering-manager/EM-013-utopia-task-surface-integration.md) | 共享任务Core及Utopia控制面集成 | COMPLETE / Mech | COMPLETE / Alien | MERGED_MAIN |

## Programme合阶段

一programme组件排空即合工作书合资格，不等其他三。GAI/EM最终真实跨设备可等接受RF，只停最终接口不堵其他可跑。

2026-10-01四池BA9/RF10/GAI9/EM13全排、四合池序BA→RF→GAI→EM，各当时main起、临合再刷新，联合头与合后main都托管绿：

| Programme | 集成头／CI | main合并／CI | 归档标签 |
|---|---|---|---|
| Butler Assistant | `4ff27ba` · 36827219769 | `41e241c` · 36827422797 | `archive/BA-001..009` (9) |
| Remote Fabric | `160fcc3` · 36828179156 | `49914d9` · 36828413515 | `archive/RF-001..010` (10) |
| General AI Gateway | `a47e4eb` · 36828980482 | `74b37cf` · 36829232339 | `archive/GAI-001..009` (9) |
| Engineering Manager | `aef657f` · 36829755814 | `e7c498f` · 36830053908 | `archive/EM-001..013` (13) |

跨契约§8 ALL_PROGRAMMES_MERGED_MAIN_CI_GREEN满。分支ref换同提交annotatedtag未删历史、各开发纠正origin可达，远仅main。真实provider/login、双设备transport、Claude/WorkBuddy没被合并伪造，仍每报告开放programme门。

语言配对 / Language pair: [English](../MISSION_INDEX.md) · [中文](./MISSION_INDEX.md)
