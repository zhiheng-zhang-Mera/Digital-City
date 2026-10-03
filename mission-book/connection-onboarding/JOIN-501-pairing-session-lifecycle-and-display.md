---
workbook_id: JOIN-501
phase: CONNECTION_ONBOARDING
sequence: 501
execution_enabled: true
status: READY
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["REMOTE_FABRIC_MERGED_MAIN_CI_GREEN"]
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/JOIN-501
terminal_marker: PAIRING_SESSION_LIFECYCLE_ACCEPTED
---

# JOIN-501 — Pairing Session Lifecycle + Persistent Display

> **Programme：** [README.md](./README.md)  
> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **异步减压施工：** [../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> **过程数据规则：** [../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)

## 1. 目标

修正现有 Pairing 页的 session lifecycle，使临时配对码严格符合 Owner 语义：

```text
NO CLICK = NO CODE

click Generate
→ one ACTIVE session
→ same code stays visible
→ consumed OR expired
→ code removed
→ Generate becomes available again
```

这不是 crypto redesign，而是 existing RF pairing session 的产品生命周期落地。

## 2. 当前真实代码基线

当前 `apps/web/app.js` 已经做到：

- `pairing === null` 时不渲染 QR/shortCode/shareable invite；
- 点击 `#generate-pairing` 后请求 `pairing/session`；
- active pairing 有 countdown；
- `expiresAt` 到期后 `clearPairing('pairing.expired')`。

但仍需修正：

- `go(next)` 当前会无条件 clear pairing；
- `pagehide` 当前会 clear pairing；
- reconnect/status path 可能提前 clear pairing；
- active pairing button 当前显示 Refresh 并可生成新 session；
- consumed event 必须明确驱动 UI 清除，不能只靠过期。

## 3. Owner 硬约束

### 3.1 禁止隐式生成

以下动作绝对不得调用 pairing-session creation：

- 打开 Pairing 页面；
- route change；
- City refresh；
- websocket reconnect；
- app boot；
- discovery result；
- node online/offline event；
- countdown tick。

唯一正常入口：用户主动点击 Generate。

### 3.2 ACTIVE 期间不可换码

ACTIVE 时必须：

- 继续展示同一 `pairingSessionId`；
- 继续展示同一 `shortCode`；
- 继续展示同一 QR/invite payload；
- countdown 只减少剩余时间；
- Generate/Refresh 不得创建下一 session。

推荐 UI：
- 隐藏 Generate；
- 或 disabled button = `配对码有效中`；
- 可显示 expiry 倒计时。

不得提供 `Refresh` 语义替换有效 code。

### 3.3 ACTIVE 显示持久性

以下动作不得清除有效 pairing display：

- normal render；
- snapshot refresh；
- websocket reconnect；
- SPA page navigation + return；
- unrelated Settings / Devices state update。

如果 full reload 后实现恢复：
- 恢复原 ACTIVE material；
- 校验 expiresAt；
- 若已过期则进入 EXPIRED；
- 不得生成新 session。

不得用 `localStorage` 把临时配对材料变成长期 credential。优先 tab/app-session scoped persistence。

### 3.4 Consumption

当该 session 被成功 exchange / claim：
- server/canonical pairing state 标记 consumed；
- owner page 尽快收到 event / refresh observation；
- 清除显示 material；
- 状态明确为 USED；
- Generate 再次可用。

同一个 consumed secret 再用必须失败。

### 3.5 Expiry

到期：
- 清除 active material；
- 显示 EXPIRED；
- Generate 再次可用；
- **不得自动再生成**。

## 4. 允许修改边界

允许：
- `apps/web/app.js` pairing-specific state/render/handlers；
- pairing-specific i18n；
- pairing API adapter / event handling；
- existing pairing service 的最小 lifecycle repair；
- pairing-specific tests；
- docs/evidence。

若 current canonical server API 缺少“session consumed / active session state”最小读取能力，可添加 bounded endpoint/event；不得新造第二套 trust store。

## 5. 禁止修改边界

- 不重写 RF-002 / RF-005；
- 不改 transport routing；
- 不改 scheduler/task semantics；
- 不因 pairing UI 顺手重做全站 UI；
- 不降低 one-time secret / expiry 安全语义；
- 不把 bare token 暴露到 Pairing 页面。

## 6. 必须测试

自动测试至少覆盖：

1. enter Pairing page → creation API call count = 0；
2. render/refresh/reconnect → creation API call count remains 0；
3. explicit Generate once → exactly one session；
4. ACTIVE + ordinary re-render → same id/code/payload；
5. ACTIVE + SPA navigate away/back → same active session remains；
6. ACTIVE → no Refresh-caused new session；
7. consume → material disappears + USED + Generate available；
8. consumed secret reuse rejected；
9. expire → material disappears + EXPIRED + Generate available；
10. expire event itself does not call create；
11. post-expiry second explicit click → one new, different session；
12. no permanent/bare token rendered in pairing material。

## 7. 实机验收

Development host：
- 生成一次 code；
- 在倒计时有效期内触发至少一次 City refresh、一次页面内导航返回、一次 WebSocket reconnect；
- 证明 code/session 没变；
- 用另一真实 endpoint 消费；
- 证明 owner page 从 ACTIVE → USED。

Formal Review 必须由另一实体主机：
- 独立重复；
- 特别尝试通过 route/reload/reconnect 让 code 提前消失或偷偷换码；
- 若发现 defect，直接 bounded repair + regression test。

## 8. 完成门槛

`PAIRING_SESSION_LIFECYCLE_ACCEPTED` 只有在：

- Development complete；
- opposite-host Review complete；
- required CI green；
- active-session persistence evidence complete；
- consumed + expired 两条终态都实测；
- 无隐式 generation；

全部满足后才可设置。
