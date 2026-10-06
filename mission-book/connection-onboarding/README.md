# Connection Onboarding Optimization / 连接入城优化工程

> **状态：COMPLETE / OWNER-CONFIRMED / READY TO ARCHIVE**
>
> **Owner 人工确认（2026-10-05）**：三端连接已由人工直接确认成功——Web 控制面、Windows 主机 City、Android 真机同时在网可用。
> 这条确认是 Owner 级证据（`CONSTRUCTION_RULES.md` §0 权威层级第 1 条），已记入 JOIN-590 工作书的
> `owner_manual_three_end_confirmation` 与 `reports/JOIN-590/FINAL_PHYSICAL_ACCEPTANCE_Mech.md`。
>
> 本工程不是重做 Remote Fabric。Remote Fabric 已于 2026-10-01 完成 RF-001..RF-010、合并 Utopia main 并归档。
> 本工程只负责把已存在的 discovery / pairing / invite / trust / device identity 能力真正变成“新 PC 快速入城”的产品路径，并消除用户手工管理长期 token 的正常使用需求。
>
> 终态：JOIN-501/502/503 组件 + JOIN-590 的 merged-main 实机验收均已完成，终端标记
> `CONNECTION_ONBOARDING_MERGED_MAIN_PHYSICAL_ACCEPTED` 已释放，Utopia main 已包含 JOIN-590 的合并提交
> `59d3e09b1ea51c4b4024160fca1a575818077654`。整个 programme 可归档。
>
> 常驻施工规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 异步减压施工：[../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> 过程数据规则：[../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> 历史 Remote Fabric：[../finished/completed-2026-10-01/remote/README.md](../finished/completed-2026-10-01/remote/README.md)

## 1. Owner 目标

新 PC 加入 Utopia 的默认体验应从：

```text
find City URL
→ copy token
→ paste token
→ connect
```

收敛为：

```text
open Utopia
→ discover nearby City
→ request join
→ approve on an existing trusted device
→ enroll this installation
→ future reconnect automatically
```

QR / 短配对码 / deep link / web link 继续保留为 fallback / remote bootstrap；手工 URL / bare token 仅保留 engineering fallback，不再是正常用户路径。

## 2. Programme 创建时的代码事实（历史背景）

创建本工程书时，Utopia `apps/web/app.js` 已经具备：

- Pairing 页面；
- `POST /api/v0/pairing/session`；
- QR payload；
- short code；
- shareable `utopia://pair?... ` invite；
- invite exchange；
- mDNS / Bluetooth diagnostics 展示；
- Generate 按钮。

因此本工程不得把已经完成的 RF-001..RF-010 当成“缺失功能”重新实现。

以下是 programme 创建时的缺陷清单；这些组件缺陷已由归档的 JOIN-501/502/503 修复并独立 Review，不再是当前可领取工作：

1. `go(next)` 会 `clearPairing()`；
2. `pagehide` 会 `clearPairing()`；
3. reconnect / refresh-related state may clear active pairing display；
4. active pairing 时按钮文案变为 `Refresh`，允许在有效期内提前换码；
5. 正常首次连接仍可落回 bare token 输入逻辑。

这些是本 programme 的真实切入点。

## 3. 不可违反的临时配对码规则

这是 Owner 级产品语义，优先级高于旧 UI 行为：

### 3.1 生成前绝不出现

只有用户**主动点击“生成临时配对码 / Generate pairing code”**之后，才允许创建并显示：

- short code；
- QR；
- one-time secret；
- shareable invite；
- countdown / expiresAt。

进入 Pairing 页面、刷新 City 状态、发现新设备、启动 Utopia、重新连接 WebSocket、页面 render 都**不得自动生成**临时配对材料。

### 3.2 有效期内固定，不允许提前刷新换码

状态机固定为：

```text
IDLE
  -- owner clicks Generate -->
ACTIVE
  -- successfully consumed --> CONSUMED
  -- expires -------------> EXPIRED

CONSUMED / EXPIRED
  -- owner clicks Generate -->
ACTIVE(new session)
```

禁止：

```text
ACTIVE -- Refresh --> ACTIVE(new code)
```

所以 ACTIVE 时：
- 当前 short code / QR / invite 必须保持同一 session；
- Generate 按钮应 disabled / hidden / replaced by non-generating status；
- 不允许 silent rotation；
- 不允许 background auto-refresh 生成新 session。

### 3.3 常驻显示直到“使用”或“过期”

ACTIVE 配对材料必须在产品页面中持续可见，直到：

- 该 pairing session 成功被另一设备消费；或
- `expiresAt` 到期。

普通：
- re-render；
- City snapshot refresh；
- WebSocket reconnect；
- 页面内部导航后返回；
- 非 destructive UI state refresh；

不得让有效码提前消失。

若浏览器级 reload / app process restart 支持恢复，则只能恢复**同一个仍有效 session**；绝不能借恢复动作生成一个新 code。允许用 browser `sessionStorage` / bounded client cache 保存当前 active pairing display material，但不得升级为永久 credential storage。

### 3.4 使用 / 过期后再生成

消费成功或过期后：
- active code/QR/invite 从页面撤下；
- UI 明确显示 `USED` 或 `EXPIRED`；
- 再次出现“生成临时配对码”按钮；
- 必须由用户再次点击才创建下一 session。

## 4. Programme 工作拆分

组件施工已经结束并归档：

| ID | 状态 | Accepted implementation head |
|---|---|---|
| [JOIN-501](../finished/completed-2026-10-04/connection-onboarding-components/JOIN-501-pairing-session-lifecycle-and-display.md) | COMPLETE / ARCHIVED | `e925ae1ef4dda6f51d89a1faa025d1b8666d8c58` |
| [JOIN-502](../finished/completed-2026-10-04/connection-onboarding-components/JOIN-502-nearby-pc-discovery-and-owner-approval.md) | COMPLETE / ARCHIVED | `86deda9c2990c78d683a8c3515d251022df9d040` |
| [JOIN-503](../finished/completed-2026-10-04/connection-onboarding-components/JOIN-503-device-enrollment-and-tokenless-reconnect.md) | COMPLETE / ARCHIVED | `77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f` |

Git ancestry 已确认上述三个 accepted heads 都进入当前 Utopia main。

当前唯一可领取工作：

| ID | 工作 | 状态 | 目标 |
|---|---|---|---|
| [JOIN-590](./JOIN-590-merged-main-physical-acceptance-and-closeout.md) | Merged-main Physical Acceptance + Closeout | READY | 补齐历史 Review 明确 deferred 的两物理 Windows 主机 onboarding / restart / revoke acceptance，然后关闭整个 programme |

## 5. Closeout lock

JOIN-501/502/503 的组件实现和 Formal Review 已完成，且 accepted heads 已进入 main；因此不再创建重复 sibling merge。

当前只剩 JOIN-590 的 merged-main physical acceptance。

只有 JOIN-590 完成并记录：

`CONNECTION_ONBOARDING_MERGED_MAIN_PHYSICAL_ACCEPTED`

之后，整个 `connection-onboarding/` programme 才可归档。

## 6. 完成后用户可见终态

目标产品路径：

```text
NEW PC
  ↓
Utopia starts
  ↓
Nearby Cities
  ├─ same Wi-Fi / LAN discovery (preferred)
  ├─ BLE bootstrap (when useful)
  ├─ QR
  ├─ short one-time code
  ├─ deep/web link
  └─ manual address/token (engineering fallback)
  ↓
Request Join
  ↓
Existing trusted device: Approve / Reject
  ↓
Existing RF trust + identity lifecycle enrolls the installation
  ↓
Device appears in City
  ↓
Future boot: authenticate with stored device identity
  ↓
ONLINE
```

Token may remain inside protocol/session plumbing, but normal users must not be asked to manage it.

## 7. 范围边界

允许：
- Utopia pairing/onboarding presentation；
- existing RF public API adapter/integration；
- discovery presentation；
- pairing lifecycle persistence；
- trust approval UI；
- device enrollment/reconnect glue；
- tests/evidence/docs required by these changes。

禁止：
- 重写 RF transport；
- 新造第二套 pairing/trust state machine；
- 新造第二套 device identity；
- 修改 scheduler/assistant semantics；
- 借 onboarding 重构 UI civilization shell；
- 为了“更安全”无限扩大 crypto/network scope；
- 重新开启已归档 RF-001..RF-010。

## 8. 实机验收最低拓扑

最低：
- Alien Windows；
- Mech Windows；
- 当前真实 Android 可作为 approval/control surface 的附加证据。

至少要证明一次：
- 一台“未登记 PC installation”加入；
- existing trusted endpoint 批准；
- 加入后设备出现在 canonical City；
- 重启后无需再次输入 bare token；
- revoke 后旧身份不能继续自动接入。

所有过程继续继承 Mission Book 的双实体主机独立复核规则。

## 9. 已接受之后发现的一处测试探针缺陷（待记录持有人决定）/ A test-probe defect found after acceptance

JOIN-590 已 COMPLETE 且标记已释放。其后的 REX 集成前置测量在跑全量套件时，遇到 `tests/relay-s1-tunnel.test.mjs:420` 一次假红，追进去是**测试探针自身**的缺陷，不是产品： / JOIN-590 is COMPLETE with its marker released. A later full-suite run produced a false red at that line; the cause is the probe, not the product:

```text
规则 / the rule     同一 relay peer 在 1000 ms 窗口内第 21 个请求得到 429（RELAY_REQUESTS_PER_SECOND=20）
探针 / the probe    顺序 await 发 30 个请求，要求至少一个 429
=> 只有当前 21 次往返平均快于约 48 ms 时才成立；主机一忙，窗口被重新填满，断言失败而限流器正常
```

- 现场证据 / in situ：并集全量首跑 4 红含本项，重跑 3 红（本项消失）；main 基线 3 红（同样三个 launcher）；并集未改动该测试与限流器任何一行。
- 限度 / limit：**无法按需复现**（12 个 CPU 占满进程 0/6；并发完整全量套件 0/6）——如实记录，不含糊成“已复现”。
- 直接证明 / proved directly：同一个限流器、同一个 helper、同样注入的 60 ms 每请求延迟，只改发送纪律：顺序 await **0/30 被拒**，并发突发 **10/30 被拒**（30 个请求 0 ms 内写完）；两次数字一致；修复后探针本机连跑 10 次 0 失败、全量 1356/1359（3 项为 host-city-launcher）。
- 修复 / repair：`repair/mech-relay-rate-probe-burst`（建在当前 main `b06504f`），三段产品断言一字未改，只把突发真的作为突发发出，并在失败信息里报告发送跨度。
- 状态 / status：**已验证、待采纳的提案**。本机对 JOIN 系列无合并授权，是否采纳由该任务记录持有人决定。完整记录：`../reports/RELAY_RATE_PROBE_HOST_SPEED_MECH.md`。
