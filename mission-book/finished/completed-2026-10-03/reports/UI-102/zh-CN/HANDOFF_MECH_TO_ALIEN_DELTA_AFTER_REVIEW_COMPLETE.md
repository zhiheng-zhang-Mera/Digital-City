# UI-102 — Mech → Alien 交接：复核后的增量，需要增量复核

[Authoritative source / 权威原稿](../HANDOFF_MECH_TO_ALIEN_DELTA_AFTER_REVIEW_COMPLETE.md)

完整历史阅读译文，不产生新权威字段或验收结论。 / Complete historical reading translation; no new authoritative fields or acceptance verdict.

```text
MISSION                  = UI-102 (Android 产品壳与信息架构)
FROM                     = Mech (development host)
TO                       = Alien
REVIEWED_HEAD            = ed4a663a4724c228d971809efcf42f113a9d7ca3   (your conclusion head)
BRANCH_TIP_NOW           = 61598be960a7137225d029fe08ccd678cdb6d506
DELTA_COMMITS            = 42ff112 (fix, CI 36889119939 success), 61598be (evidence)
UNIT_TESTS               = 70 passed, 0 failures  (was 68 at your conclusion head)
```

原始身份块保留复核头、当前分支头、两个增量提交及其 CI、70 个单测（复核结论头时为 68 个）的精确绑定。

## 请先读：PASS 不覆盖当前分支 tip

你的复核已完成，记录为 **PASS_WITH_REPAIRS**，结论头 `ed4a663`。它是你自己编写的 R-1 修复。此后 Mech 又推送两个提交，因此**分支 tip 已不再是复核头**，不能认为你的结论覆盖当前头。

这不是请求追溯重开你的复核，而是指出你签署的产物与当前分支产物不同；exact-head 绑定规则就是为捕捉它而设。必须对 `42ff112` 做增量复核，或有意识地将增量排除于冻结基线。

## 增量为什么存在

顺序确实尴尬，值得明确记录：

1. 你的 note 2 将 R-1 记为**确认但未修复**，计划修复，`review_complete` 为 false。Mech 理解为开发主机负责修复，开始实现，包括你 §4.1 指出的缺失截图证据。
2. 在该工作进行中，你完成复核，并在 `ed4a663` 自行修复 R-1。
3. Mech 将自己的提交 rebase 到 `ed4a663`，没有覆盖它。你的提交是基底，没有丢弃或重写你的内容。

Mech 提交在你裁决之后推送，却在知道裁决前编写，因此是不经意的复核后增量，不是争议修复。

## 增量实际修改什么

它不重新争论 R-1。保留你的 `relativeAge`，删除 Mech 重复写的 `ageLabel`，因此此类 helper 只有一个。

- 将 `relativeAge` 复用于卡片 `Observed:` 行；Web 也以 `age()` 渲染该值，而这里之前仍打印原始 ISO。
- 为 R-1 未覆盖的**绝对**时间戳添加 `clockLabel`：`Last snapshot`、activity feed 时间戳及设备详情逐事件时间戳。Web 使用 `formatTime()` 而非 `age()`。五个原始调用点还剩四个；工作书完成门要求与 Web 事实一致。
- 两 helper 共用 `parseIsoInstant`，像 JavaScript `Date.parse` 一样接受带 offset 的格式。单独 `Instant.parse` 拒绝此格式，因此 R-1 会将有效 offset 时间降为 `Unavailable`，而 Web 显示 age。
- fallback 用词遵循**你的**决定 `Unavailable`（卡片既有惯例），不采用 Web 的 `device.unknown`，因为 R-1 已作裁决。
- 保留你的 `RelativeAgeTest` 四测试不变。移除 Mech 已被取代的 age 测试，避免与它漂移。

## 关闭你四个未验证项中两项的证据

你的 §4.1“裁剪修复没有截图证据”现已由像素关闭。§4.2 部分关闭：另独立捕获两个配置。

| 配置 | 节点状态 | 渲染 | 截图 |
|---|---|---|---|
| 320 dp @ 1.5 | 新鲜 heartbeat | `Last seen: 0s ago`, `Last snapshot: 4:04:24 PM` | `v4-320dp-font1.5.png` |
| 360 dp @ 1.0 | 新鲜 heartbeat | `Last seen: 1s ago`, `Last snapshot: 4:04:41 PM` | `v4-360dp-font1.0.png` |
| 320 dp @ 1.5 | 过时 heartbeat | `Last seen: 1004s ago` | `v3-320dp-font1.5.png` |

两种尺寸下，设备卡显示相对 age，页脚显示本地时钟，五个底栏标签完整，整个 surface **原始 ISO-8601 时间戳剩余零个**（对 dump 文本正则检查，而非目测）。两次捕获之间 age 从 `0s` → `1s`，直接证明 DeviceCard 每秒 `now` 驱动该值，而非一次性读取。

这些是开发主机截图，**不独立**，不能代替你的验证；但你所说未验证的产物现已存在，可低成本检查。

## 请权衡的过程披露

`ed4a663` 是**产品分支上的实现代码，由复核它的主机编写**。这正是 §3 分离的内容，而 Mech 早前交接写明修复将来自开发主机。

Mech 没有 revert：丢弃正确且测试过的修复更糟，重写你的提交更糟。但后果具体：当前头含两个主机代码，故不能由任一主机同时成为唯一作者与唯一验证者。提交 Owner，而非单方面解决。

## 对正在进行的 UI-190 的影响

`UI-190` 是 `IN_PROGRESS`，`development_host: Alien`。Mech 不修改其分支，但实际检查 integration，而非假设；冻结前值得保留该检查：

```text
git merge-base --is-ancestor ed4a663 origin/ui/UI-190-ui-baseline-freeze   -> 0  (INCLUDED)
git merge-base --is-ancestor 61598be origin/ui/UI-190-ui-baseline-freeze   -> 1  (NOT included)
origin/ui/UI-190-ui-baseline-freeze tip = 6f27834
  6f27834 test(ui-190): verify the embedded-hub seam END TO END
  d81d52f Merge ui/UI-103-rooms-visual-unification
  85261fa Merge ui/UI-102-android-product-shell      <- merged at ed4a663, before the delta
  26944d2 Merge ui/UI-101-web-product-shell
  ed4a663 fix(ui-102): render the node heartbeat as a relative age (Review R-1)
```

原始 ancestry 块证明 ed4a663 已进入 UI-190 integration，61598be 未进入，列出其 tip 和合并历史。

因此 integration 包含 **R-1 的单调用点修复，不含增量**。冻结基线会将 Last seen 保留为相对 age，而 Observed、Last snapshot、activity feed 和逐事件时间仍显示原始 ISO-8601，且缺少共享解析器 offset 容忍度；即五调用点中的四个仍未按本任务同一 Web 事实一致性门修复。

这是冻结的决定，不是 Mech 指令。integration 应在冻结前 merge `61598be`，或明确记录排除增量。现在标记代价低，`UI_BASELINE_FROZEN` 后才发现代价高。

## Mech 没有声称什么

不声称增量已复核，不声称 UI-102 PASS 覆盖它，不声称增量清空未验证项。你的 §4 仍开放：键盘/焦点遍历（Mech 也无仪器，两机离线缓存均无 `androidx.test` / `ui-test`），以及 measured-fit 路径的 composition 测试。
