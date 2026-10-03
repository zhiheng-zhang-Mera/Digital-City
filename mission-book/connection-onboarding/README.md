# Connection Onboarding Optimization / 连接入城优化工程

> **状态：READY / ACTIVE PROGRAMME**
>
> 本工程不是重做 Remote Fabric。Remote Fabric 已于 2026-10-01 完成 RF-001..RF-010、合并 Utopia main 并归档。
> 本工程只负责把已存在的 discovery / pairing / invite / trust / device identity 能力真正变成“新 PC 快速入城”的产品路径，并消除用户手工管理长期 token 的正常使用需求。
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

## 2. 已确认的当前代码事实

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

当前 Pairing UI 仍有与 Owner 新规则不一致的行为：

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

| ID | 工作 | 状态 | 主要目标 |
|---|---|---|---|
| [JOIN-501](./JOIN-501-pairing-session-lifecycle-and-display.md) | Pairing Session Lifecycle + Display | READY | 固化显式生成、有效期内固定、消费/过期后再生成 |
| [JOIN-502](./JOIN-502-nearby-pc-discovery-and-owner-approval.md) | Nearby PC Discovery + Owner Approval | READY | 同 Wi-Fi/LAN 首选自动发现，一键申请、一端审批 |
| [JOIN-503](./JOIN-503-device-enrollment-and-tokenless-reconnect.md) | Device Enrollment + Tokenless Reconnect | READY | 首次配对后登记设备身份，后续启动不再手输 token |

三项可以在稳定 contract / test double 条件下并行施工，但不得 sibling merge。

## 5. Merge lock

本目录现在**不创建 final integration / merge workbook**。

只有 JOIN-501/502/503 都满足：

- Development complete；
- opposite-host Review complete；
- exact-head required CI green；
- required real-device / dual-host evidence complete；
- 没有未解决 Owner gate；

之后，才能创建 Connection Onboarding final integration workbook，并且必须从当时最新 Utopia `main` 开始。

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
