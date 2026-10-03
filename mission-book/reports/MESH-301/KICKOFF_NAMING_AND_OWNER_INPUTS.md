# RECORD — MESH-301 命名规则实施 + 开工前的两项 Owner 输入

```text
FROM   = Alien
RE     = Owner 指令（2026-10-03）：按更新后的 MESH-301 做多端联动；本机默认名 Alien-Win；
         Android 默认名为设备型号；显示名可自定义但物理机器身份不变；等 Mech 主机加入后再开工。
状态   = 命名规则（主机侧）已实现并实测；Android 侧属 MESH-301 的 client-identity 工作，待激活后做；
         多端联动尚未开工（按你的指示等 Mech）。
```

## 1. 更新后的 MESH-301 我已读完，并按其修正后的设计执行

它修正了我草案的六处缺陷（Android 是 control client 而非 worker：拓扑 = **2 workers + 3 control clients + 1 canonical City**；
定向属 **routing intent** 而非 `ALLOWED_ACTIONS` action token；一致性按 **canonical server `seq` + bounded convergence**
而不是本地时钟强一致；不写死历史 IP；Mech 作为端点与 Reviewer 不冲突；终态标记 `THREE_END_MESH_E2E_ACCEPTED`）。
我按修正后的版本执行，不按我的原草案。

## 2. 命名规则（主机侧）：已实现并实测

City 的数据模型本来就把两者分开：`id`（= `devicePrincipalId`，**物理身份**）与 `displayName`（**可自定义标签**）。
`scripts/uxi391-node.mjs` 现在把二者解耦并持久化身份：

```text
identity    = CITY_NODE_ID  >  本机持久化的身份（.city-node-identity.json）  >  'Alien-Win'
displayName = CITY_NODE_DISPLAY_NAME  >  第一个参数  >  identity（默认同名）
```

**实测（同机两次启动，同一个 City）**：

```text
首次启动            → id=Alien-Win          displayName=Alien-Win
改名启动            → id=Alien-Win  devicePrincipalId=Alien-Win  displayName=Alien-Win-Renamed
节点日志            → "renamed: the identity is unchanged"
```

即：**改名不改变物理机器身份**，与该机器相关的历史、事件、交接全部仍然指向同一个 `id`。

**我自己引入并修掉的一个 bug（记录在案）**：参数过滤器写成 `args.filter((_, i) => i !== idFlag && i !== idFlag + 1)`，
在没有 `--id` 时 `idFlag = -1` → 它把 `argv[0]`（显示名）吃掉了，于是"改名"看起来毫无效果。
第一次实测正是这样：改名后 `displayName` 仍是 `Alien-Win`。改为仅在存在 `--id` 时才过滤，复测通过。

## 3. Android 侧命名（待 MESH-301 激活后实施）

```text
要求：Android 实机接入时【默认为设备型号】（Android 的 Build.MODEL），且其身份与显示名同样分层。
现状（已查）：Android 是 control client，不是 worker node；它目前只【显示】节点的 displayName
              （Devices.kt 渲染 node.displayName），自身没有向 City 声明身份的字段。
因此这需要一步最小 product 变更：让 control client 在连接时声明
    {clientIdentity（稳定）, clientDisplayName（默认 = Build.MODEL，可改）}
并由 City 记入 canonical truth（事件或客户端注册表），否则"三端实时看见彼此在做什么"缺少"谁"的那一半。
该改动落在 MESH-301 允许边界 #2/#5 内，属于该任务的工作，不在激活前擅自动产品代码。
```

## 4. 开工前必须由你决定的两件事（工作书自身也把它们留给你）

```text
(1) MESH-301 是否激活：其 frontmatter 仍是 execution_enabled: false / status: DRAFT_PENDING_OWNER_APPROVAL，
    owner_gate = OWNER_APPROVAL_TO_ACTIVATE。按 §2，我需要它成为可领取状态才能原子领取；
    （若你直接说"开工"，我会按你的直接指令领取并把该指令如实记入 claim basis。）
(2) 配对令牌如何交给 Mech：MESH-301 第 2 步明确要求"pairing/bearer token 必须脱敏，不进入报告、截图或 Git"，
    所以三端同 City 所需的令牌【不能由我写进控制面】。需要你选择一种传递方式（见下）。
```

## 5. 我这边已就绪、正在等 Mech

```text
- 本机默认身份 Alien-Win 已就绪（可随时加入 City，显示名可改而不动身份）；
- canonical City 可在 claim-time 绑定 LAN 接口（本机 172.31.3.110；MESH-301 要求 claim-time 实测而非沿用历史 IP）；
- 我会在 Mech 主机加入（其节点出现在同一个 City，或它在控制面留痕）之后才开始三端联动，
  不抢先登记一个"只有两端"的假三端结果。
```

---

## 6. Owner 的两项决定（已收到，逐条落实）

```text
第 1 件（激活）：Owner 选择 A —— 由 Owner 把 MESH-301 置为 READY（execution_enabled: true + status: READY）。
                我在该状态出现后按 §2 原子领取；在此之前不领取、不动产品代码。
第 2 件（令牌）：Owner 选择 A —— 由 Owner 私下把 canonical City 的 URL 与配对令牌转达给 Mech；
                我只需在本机设置同一个令牌。令牌【不会】由我写入控制面/报告/截图/Git（工作书第 2 步要求）。
                我这边需要 Owner 把「要在我本机设置的那个令牌值」也告知我（或由 Owner 指定后我照设）。
```

## 7. 当前等待状态（§5.1，且明确不是 POOL_TERMINAL）

```text
- MESH-301：execution_enabled=false / DRAFT_PENDING_OWNER_APPROVAL → 等 Owner 置 READY；
- Mech 主机：尚未加入同一个 City（按 Owner 指令，Mech 加入后才开始三端工作）；
- 本机：identity=Alien-Win 已就绪、可随时加入 City，且显示名可改而不动身份；
- 池内其它工作书：历史阶段已归档（finished/completed-2026-10-03），没有可自动领取的产品工作书。
  因此按 §5.1 TEMPORARILY_UNCLAIMABLE / WAITING_OWNER_ACTIVATION 解释，不写成"池已终态"，
  也不为了保持主机忙而制造新任务（看板对此有明文要求，我遵循）。
```