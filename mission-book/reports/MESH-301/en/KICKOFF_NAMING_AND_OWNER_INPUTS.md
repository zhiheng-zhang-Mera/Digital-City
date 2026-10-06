# Reading translation / 阅读译本

[Canonical source / 权威原文](../KICKOFF_NAMING_AND_OWNER_INPUTS.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — MESH-301 naming-rule implementation and two Owner inputs before starting

```text
FROM   = Alien
RE     = Owner 指令（2026-10-03）：按更新后的 MESH-301 做多端联动；本机默认名 Alien-Win；
         Android 默认名为设备型号；显示名可自定义但物理机器身份不变；等 Mech 主机加入后再开工。
状态   = 命名规则（主机侧）已实现并实测；Android 侧属 MESH-301 的 client-identity 工作，待激活后做；
         多端联动尚未开工（按你的指示等 Mech）。
```

## 1. Updated MESH-301 read in full; execution follows its corrected design

It corrects six defects in my draft: Android is a control client rather than a worker, with topology **2 workers + 3 control clients + 1 canonical City**; targeting is **routing intent**, not an `ALLOWED_ACTIONS` action token; consistency uses **canonical server `seq` + bounded convergence**, not strong consistency between local clocks; historical IPs are not hardcoded; Mech endpoint participation does not conflict with Reviewer status; the terminal marker is `THREE_END_MESH_E2E_ACCEPTED`. I follow the corrected version rather than my original draft.

## 2. Host-side naming rule: implemented and actually measured

The City data model already separates `id` (= `devicePrincipalId`, **physical identity**) from `displayName` (**customizable label**). `scripts/uxi391-node.mjs` now decouples them and persists identity:

```text
identity    = CITY_NODE_ID  >  本机持久化的身份（.city-node-identity.json）  >  'Alien-Win'
displayName = CITY_NODE_DISPLAY_NAME  >  第一个参数  >  identity（默认同名）
```

**Actual measurement (two starts on the same machine, same City):**

```text
首次启动            → id=Alien-Win          displayName=Alien-Win
改名启动            → id=Alien-Win  devicePrincipalId=Alien-Win  displayName=Alien-Win-Renamed
节点日志            → "renamed: the identity is unchanged"
```

Thus **renaming does not change physical machine identity**; the machine’s history, events, and handoffs still point to the same `id`.

**A bug I introduced and repaired, recorded explicitly:** the argument filter was `args.filter((_, i) => i !== idFlag && i !== idFlag + 1)`. Without `--id`, `idFlag = -1`, so it swallowed `argv[0]` (display name), making “renaming” appear ineffective. The first measurement showed exactly this: after renaming, `displayName` remained `Alien-Win`. Filtering only when `--id` exists fixed it, and the rerun passed.

## 3. Android naming, to be implemented after MESH-301 activation

```text
要求：Android 实机接入时【默认为设备型号】（Android 的 Build.MODEL），且其身份与显示名同样分层。
现状（已查）：Android 是 control client，不是 worker node；它目前只【显示】节点的 displayName
              （Devices.kt 渲染 node.displayName），自身没有向 City 声明身份的字段。
因此这需要一步最小 product 变更：让 control client 在连接时声明
    {clientIdentity（稳定）, clientDisplayName（默认 = Build.MODEL，可改）}
并由 City 记入 canonical truth（事件或客户端注册表），否则"三端实时看见彼此在做什么"缺少"谁"的那一半。
该改动落在 MESH-301 允许边界 #2/#5 内，属于该任务的工作，不在激活前擅自动产品代码。
```

## 4. Two decisions required from the Owner before starting, as the workbook itself specifies

```text
(1) MESH-301 是否激活：其 frontmatter 仍是 execution_enabled: false / status: DRAFT_PENDING_OWNER_APPROVAL，
    owner_gate = OWNER_APPROVAL_TO_ACTIVATE。按 §2，我需要它成为可领取状态才能原子领取；
    （若你直接说"开工"，我会按你的直接指令领取并把该指令如实记入 claim basis。）
(2) 配对令牌如何交给 Mech：MESH-301 第 2 步明确要求"pairing/bearer token 必须脱敏，不进入报告、截图或 Git"，
    所以三端同 City 所需的令牌【不能由我写进控制面】。需要你选择一种传递方式（见下）。
```

## 5. This host is ready and waiting for Mech

```text
- 本机默认身份 Alien-Win 已就绪（可随时加入 City，显示名可改而不动身份）；
- canonical City 可在 claim-time 绑定 LAN 接口（本机 172.31.3.110；MESH-301 要求 claim-time 实测而非沿用历史 IP）；
- 我会在 Mech 主机加入（其节点出现在同一个 City，或它在控制面留痕）之后才开始三端联动，
  不抢先登记一个"只有两端"的假三端结果。
```

---

## 6. Two Owner decisions received and followed individually

```text
第 1 件（激活）：Owner 选择 A —— 由 Owner 把 MESH-301 置为 READY（execution_enabled: true + status: READY）。
                我在该状态出现后按 §2 原子领取；在此之前不领取、不动产品代码。
第 2 件（令牌）：Owner 选择 A —— 由 Owner 私下把 canonical City 的 URL 与配对令牌转达给 Mech；
                我只需在本机设置同一个令牌。令牌【不会】由我写入控制面/报告/截图/Git（工作书第 2 步要求）。
                我这边需要 Owner 把「要在我本机设置的那个令牌值」也告知我（或由 Owner 指定后我照设）。
```

## 7. Current waiting state (§5.1, explicitly not POOL_TERMINAL)

```text
- MESH-301：execution_enabled=false / DRAFT_PENDING_OWNER_APPROVAL → 等 Owner 置 READY；
- Mech 主机：尚未加入同一个 City（按 Owner 指令，Mech 加入后才开始三端工作）；
- 本机：identity=Alien-Win 已就绪、可随时加入 City，且显示名可改而不动身份；
- 池内其它工作书：历史阶段已归档（finished/completed-2026-10-03），没有可自动领取的产品工作书。
  因此按 §5.1 TEMPORARILY_UNCLAIMABLE / WAITING_OWNER_ACTIVATION 解释，不写成"池已终态"，
  也不为了保持主机忙而制造新任务（看板对此有明文要求，我遵循）。
```

Complete English reading of the Chinese instructions and status inside preserved evidence blocks:

The 2026-10-03 Owner instruction is to perform multi-end interconnection under updated MESH-301. This host defaults to Alien-Win; Android defaults to the device model. Display names may be customized without changing physical identity. Wait for the Mech host to join before beginning. At this historical point, host-side naming is implemented and measured; Android client identity belongs to MESH-301 and awaits activation; multi-end work has not started.

Identity precedence is `CITY_NODE_ID`, then this machine’s persisted identity in `.city-node-identity.json`, then `Alien-Win`. Display-name precedence is `CITY_NODE_DISPLAY_NAME`, then the first argument, then identity (same-name default). First start measured id/displayName both Alien-Win. Renamed start retained id/devicePrincipalId Alien-Win while displayName became Alien-Win-Renamed; the node log said identity was unchanged.

On real Android entry, the default name must be Android `Build.MODEL`, with identity separate from display name. Inspection found Android is a control client, not a worker; it only displays node displayName via Devices.kt and had no field declaring its own identity to City. The minimal product change is to declare `{clientIdentity (stable), clientDisplayName (default Build.MODEL, customizable)}` on connection and record it in canonical truth through events or a client registry. Otherwise “three ends see what one another is doing” lacks the “who” half. This is within allowed boundaries #2/#5 and must not be implemented before activation.

Before starting, the Owner must decide activation and credential relay. At this point frontmatter remains `execution_enabled: false`, `status: DRAFT_PENDING_OWNER_APPROVAL`, and `owner_gate = OWNER_APPROVAL_TO_ACTIVATE`; §2 requires claimable status for atomic claiming. A direct “start” instruction would be recorded honestly as claim basis. Step 2 requires pairing/bearer tokens to remain redacted and absent from reports, screenshots, and Git; the agent cannot put the token in the control plane and needs an Owner-selected delivery route.

Alien-Win identity is ready, with display-name changes leaving identity unchanged. Canonical City can bind the claim-time measured LAN interface, here 172.31.3.110, rather than inheriting historical IP. Three-end work begins only after Mech joins the same City or leaves a control-plane trace; it will not register a false three-end result with only two ends.

The Owner chose A for activation: the Owner will set MESH-301 to READY (`execution_enabled: true`, `status: READY`); atomic claiming follows that state, with no claim or product code change beforehand. The Owner chose A for relay: privately forward canonical City URL and pairing token to Mech; this host only sets the same token locally. The token will not be written to control plane, report, screenshot, or Git. This host still needs the Owner to provide the local token value or specify it for setup.

The historical waiting state is MESH-301 disabled/DRAFT_PENDING_OWNER_APPROVAL awaiting Owner READY, Mech not yet in the same City, and Alien-Win identity ready. Other pool workbooks are archived at finished/completed-2026-10-03, with no automatically claimable product workbook. Classify as §5.1 `TEMPORARILY_UNCLAIMABLE` / `WAITING_OWNER_ACTIVATION`, not a terminal pool, and do not manufacture tasks merely to keep the host busy, as the board expressly requires.
