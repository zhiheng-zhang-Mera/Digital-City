# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_ANDROID_SILENT_STALENESS_FIXED.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — MESH-301：Android 静默陈旧缺陷已修复并核验；仍有两项残留发现

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ a8fe3ef
```

## 1. 根因正是一行操作的顺序

前一轮实测 Android 界面丢失 `seq 233`，receipt 却**没有 `stale`，也没有 `reconnected`**；这使界面可能静默陈旧，违反工作书。根因现已确认，不再只是怀疑：

```kotlin
// refresh()'s failure path, AND the network callback, both did this:
socketOnline = false; socket?.cancel(); socket = null;

// ...and onFailure's guard then read:
override fun onFailure(...) { if (webSocket === socket) { ... log.surface("stale") ... } }
```

**先**将字段设为 null，使 `webSocket === socket` 与 `null` 比较，导致原本会写入 `stale` 的回调被**丢弃**。界面存在一个自身 receipt 无法表达的状态：已放弃 socket，却没有记录。

修复建立唯一放弃入口 `dropSocket(message)`：先记录 `stale`，再 cancel，再 clear。重点是恢复不变量，而非重构本身：**socket 要么仍被持有，要么通过此入口放弃且 receipt 已记录；不存在第三状态。**

## 2. 在设备上通过此前没有记录的路径核验

直接测试方法是执行原本出错的精确代码路径。`adb shell svc wifi disable` 触发 `onLost`，它正是此前不写记录的两个路径之一：

```text
{"kind":"resync",     "observedAt":1790998092378,"maxSeq":323}
{"kind":"stale",      "observedAt":1790998106918}      <- NEW: the drop is now recorded
{"kind":"reconnected","observedAt":1790998115292}
{"kind":"resync",     "observedAt":1790998115379,"maxSeq":334}
```

随后第二次切断 Android 网络，同时桌面 probe 覆盖**同一**窗口，使合并工具依据独立观察者判断缺口，而非仅依赖设备自述：

```text
PERM00 states across the run:  BEFORE_OBSERVATION x323, CONVERGED x48, OFFLINE_AT_EMIT x32, MISSING x8
verdict = FAILED
```

`OFFLINE_AT_EMIT x32` 证明修复生效：这 32 个事件在界面离线期间发出，现在正确分类为*非其责任*，而不是计作遗漏，或更糟地静默略去。

## 3. 两项真实残留发现，均未淡化

### R1：网络中断至回调触发之间发出的事件仍丢失（`MISSING x8`）

剩余 8 项遗漏（`seq 359–364` 及另外两项）位于 `stale` 时间戳 `03:29:04.360Z` **之前**。网络已中断，`onLost` 尚未触发。receipt 因此是诚实的，没有声称观察这些事件，但事件确实丢失；**receipt 无法界定一个从未看到开始的缺口**。

这是客户端驱动陈旧信号的真实限制，关系到工作书要求陈旧界面展示陈旧状态，而非将缺失事件呈现为实时一致性。诚实解决方案可为：服务器能用于标记界面缺席的 heartbeat；拉取缺口并记录恢复内容的 resync；或合并工具明确限定静默缺口持续多久即为失败。**这是设计决定而非 bug 修复；现记录为未决，不在运行中单方选择。**

### R2：`resync` 可能携带 socket 重开之前读取的快照

```text
resync saw maxSeq 392 but 394 had already been emitted   -> verdict RESYNC_STALE
```

`pendingResync` 在 `onOpen` 设置，由 `refresh()` 消费，但 `refresh()` 也每 2 秒定时执行。因此 socket 重开之前启动的定时 refresh 可能消费标志，写入带有*重连前*快照的 `resync`。界面随后仍观察到 393 和 394，实际上没有丢失，但**重新收敛记录低报了界面已有内容**；这正是本 programme 持续发现的静默不准确。修复（将 resync 绑定 `open` generation 计数而非布尔值）很小，应与 R1 决定一起处理。

## 4. gate 状态未变，8/9 仍为 NOT MET

```text
 2/3/4/7  MET.   5 HALF (reverse direction's tool is in place; Mech has not pressed it).
 6  live City 8/8; the reviewer must rebuild independently.
 8  three surfaces converging in ONE window ....... NOT MET (Mech Web has been exercised, and the Android
                                                     defect is now fixed, but no single window holds all three)
 9  Android offline/reconnect re-converges ........ NOT MET while R1 stands: the surface now SAYS it went
                                                     away, but it still cannot account for the gap's beginning.
10-14  NOT STARTED.
```

核验运行自身 verdict 为 **FAILED**，这是正确解释：修复已获证明，但其旨在支持的收敛声明尚未成立。
