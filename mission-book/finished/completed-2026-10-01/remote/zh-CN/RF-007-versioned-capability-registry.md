> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../RF-007-versioned-capability-registry.md) 的原始 frontmatter 是唯一元数据来源。

# RF-007 — 版本化能力注册表与寻址

## 目标

upper layer 用稳定 versioned capability name 而非 device-specific API 发现 trusted node 当前可提供内容。

## 开发范围

- versioned capability ID/descriptor，例如 camera.capture@1、screen.stream@1、filesystem.read@1。
- registry 仅限 transport-addressable device/node capability；General-AI provider/model、Engineering connector/worker capability 保持 domain registry，引用 canonical RF device identity。
- device capability advertisement/snapshot 包含 availability、version range、constraint、endpoint/adapter ref。
- 预留 exclusive/shared/background-capable、queueable、requires-live-session、default expiry execution metadata。
- by-device 与 across-trusted-nodes capability lookup。
- deterministic version negotiation、explicit incompatible-version failure。
- advertised capability 仅 availability metadata，effective permission 独立 policy decision。
- hardware、OS permission、app state change 支持 dynamic capability loss/gain。
- upper layer 避免硬编码 phone_*、alien_*、OS-specific method。

## 明确排除

- 因 advertised capability 授 access；
- 选择 City task owner device；
- descriptor 嵌 assistant personality/scheduling policy；
- best-effort coercion 隐藏 incompatible version。

## 必须验收

- heterogeneous device 可在同 logical capability 下声明不同实现；
- caller 不知道 device class 仍可请求 compatible version；
- unsupported version 明确失败；
- capability loss 使 new invocation 无效，并可经 presence/capability state 看见；
- exclusive/shared/background、live/queue metadata 经 serialization/versioning 保留；
- untrusted peer spoof capability 不绕 trust/policy；
- registry test 证明 device-specific implementation detail 保持于 capability surface 下。

## 强制 Remote Fabric 架构契约

本任务必须保持全部项目不变量：

1. **多加入方式，单一信任协议。** Same-Wi-Fi discovery、LAN、Bluetooth、direct IP、remote meeting-code invite、deep link、QR/web link 都只是 discovery/bootstrap 入口。全部成功 join 汇聚于同一版本化 pairing/trust 状态机。
2. **逻辑身份基于密码学，不由网络派生。** 稳定 device_id 标识逻辑 device，installation_id 标识一次安装。IP、hostname、display name、MAC 只是 metadata，绝非 authorization identity。
3. **MAC 仅是可选本地配对证据。** OS 暴露时，本地可见 hardware MAC 可一次显示供额外人工确认；randomization/unavailability 不阻塞 pairing，MAC 绝不成为 credential、remote identity、authorization source。
4. **默认加密且认证。** local/remote transport 均须 authenticated encryption；discovery 不意味着 trust。
5. **transport 可替换且对 caller 隐藏。** upper layer 调 Fabric API，不依赖 LAN/Bluetooth/WebRTC/QUIC/WebSocket/VPN/relay 细节。
6. **按 capability 寻址，而非设备专有 API。** caller 解析 camera.capture@1、screen.stream@1 等版本化能力，不硬编码 phone_camera() 或同类设备专有 route。
7. **RPC、EVENT、STREAM 语义分离。** command 带稳定 correlation ID，外部可见/改变状态的 retry 幂等。
8. **session 不是 task authority。** Fabric 拥有 identity、discovery、trust、connectivity、routing、transport、presence、invocation delivery；不拥有 City task graph、Assistant durable state、planning、personality、orchestration policy。
9. **offline/reconnect 诚实。** offline、timeout、refused、unavailable、unknown、completed 不合并。stale local state 无当前 authority/revalidation 不恢复副作用。
10. **relay 默认不是 trusted plaintext infrastructure。** relay transport 必须能承载 end-to-end protected payload，不成为 user data/command semantic owner。
11. **permission 保持交集。** Fabric enforcement 尊重当前 Owner/User policy、适用时 caller/assistant policy、target device capability、task/action grant。presence 或 valid network session 不制造 permission。
12. **没有隐藏智能。** Fabric 可报告 reachability、capability、policy result；不能自主决定 task ownership、assistant switching、data disclosure 或由哪个 project 执行工作。

这是验收约束，不是可选未来增强。

## 项目门槛与冻结 baseline

Pre-Assistant foundation 已合并且绿色。所有 RF branch 从同一 Utopia baseline 开始：

`82ed36933fb4c5b00e44768d9e1aedec1d525d9c`

使 RF-001..RF-010 独立可集成。**当时 Alien、Mech 均可用，先前 second-host hold 已取消。** RF 可立即从冻结 baseline 异步领取。

## 开发阶段

Development Host 必须：
1. 在 City 领取阶段；
2. 从精确冻结 Remote baseline 创建 `remote/RF-007-versioned-capability-registry`；
3. 仅实现有界范围及上述强制 contract；
4. 增正/负例及相关 concurrency/recovery/security test；
5. 推送并运行相关 GitHub CI；
6. 编写 DEVELOPMENT_REPORT.md，记录精确 file、test、failure/fix、branch/head、CI；
7. 仅绿色时标记 development_complete。

不得合入 Utopia main。

## 修正阶段

Correction Host 必须是另一物理宿主，独立检查已推送开发分支与本任务有关的 architecture、trust、spoofing、stale-state、replay、concurrency、permission、lifecycle/recovery、duplicate-side-effect、false-success 缺陷。

Correction 是修复，不是被动验证。每已发现范围内缺陷直接在同分支修复并有 regression test。跨 RF 问题记录为 final-integration seam，不靠将另一 RF 实现合入本分支解决。

推送修正 head，运行相关 GitHub CI，编写 CORRECTION_REPORT.md；仅绿色时标记 correction_complete。

## 两宿主门槛

最终合并资格要求：
- Development Host != Correction Host；
- branch history/evidence 证明 Alien、Mech 均参与；
- development_complete = true；
- correction_complete = true；
- corrected head 已推送并记录。

## 全局跨项目不闲置规则

本任务参与 `mission-book/CROSS_PROGRAMME_EXECUTION_CONTRACT.md` 定义的规范性全局 BA/RF/GAI/EM pool。

- 当时 Alien、Mech 均可用，RF Development 可立即领取。
- claim truth 只写本工作书 frontmatter/reports；普通 claim 不改 README/MISSION_INDEX。
- 本任务 Development 绿色后 Correction 立即合资格，由对侧物理宿主执行。
- hosted CI、长测试、external network/provider 等待不闲置宿主；保留 claim，在独立 worktree 继续另一合资格全局阶段。
- missing sibling RF 用稳定 contract/test double 表示；缺 BA/GAI/EM code 不阻塞有界 RF 工作。
- 只有新扫描四项目后，无可执行 owned repair、无合资格对侧 Correction、无未领取 Development，宿主才停止领取。

## 合并锁

任何 worker 不得将 `remote/RF-007-versioned-capability-registry` 合入 Utopia main。只有**每条 RF-001..RF-010** 分支均通过两阶段/两宿主门槛后，才能创建 Remote Fabric project merge workbook。
