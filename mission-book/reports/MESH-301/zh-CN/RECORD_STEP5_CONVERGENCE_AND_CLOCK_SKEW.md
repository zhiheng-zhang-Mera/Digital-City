# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_STEP5_CONVERGENCE_AND_CLOCK_SKEW.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — MESH-301 第 5 步：Android 自测收敛，以及本可能被报成延迟的 592 ms 时钟偏移

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ d9a3bac
```

## 1. 双界面有界收敛测量，其中之一为真实 Android 设备

```text
surfaces       Alien-Host (desktop probe on the Alien host)   PERM00 (the Android app, on the device)
window         5000 ms
timeline       taken from the SERVER's own event table (223 events), not from the union of the receipts
result         Alien-Host 0 ms   PERM00 13-97 ms (median ~15 ms)   every measured seq CONVERGED
verdict        INCOMPLETE — solely because the Alien-Host probe's own shutdown boundary is unmeasurable
```

Android receipt 由 app **在设备上**写入，使用与桌面 probe 相同 JSONL 词汇（`start` / `event` / `stale` / `reconnected` / `resync` / `stop`），因此 `merge` 可同时读取 Android 与桌面 receipt，生成一张表。

### D16：界面记录自身观察，而非别人计算的关于它的数字

- **问题：** 第 5 步要求每界面对每个 canonical `seq` 的 observed-at。Android app 不是 Node 进程，无法运行桌面 probe。
- **选择：** app 从 event-stream callback 写自身 receipt `files/surface-observations.jsonl`。
- **判断逻辑：** 本步骤重点是数字确为 Android 在观察时获得的内容。主机产生或后来快照推导的时间戳，会把**关于 Android 的声明**伪装成 Android 自身测量；此 programme 已反复遭遇不能失败的仪器。一个 session 对应一个 receipt（`surfaceReset()` 截断文件），因为桌面 probe 实际运行已发现过两 session 共一文件缺陷。

## 2. 发现：恒定偏移来自时钟，不是延迟

首次双界面合并报告 Android **每个事件约 606 ms**，另一界面 **0–1 ms**。此模式具有诊断意义：每事件*恒定*偏移不是投递延迟，而是时钟差。直接实测设备时钟偏移 **592 ms**。

若作为收敛延迟报告，会成为**伪装测量的 600 ms 虚假数字**：精确、可复现却错误，因而最糟。它还会通过 5 秒窗口，看起来像证据。

- **选择：** `merge` 接受声明的 `--skew <surface>=<ms>`，receipt **同时**保留原始与校正数字。
- **判断逻辑：** 静默减去偏移会隐藏数字来源；校正本身带有偏移测量方式的不确定性（这里通过 `adb` 往返）。保留两者，让复核者可反对校正而非只能信任。声明偏移后，Android 在 **13–97 ms** 收敛，这是实际投递延迟。

另按机制记录：工作书明确警告不得比较三设备本地时钟，这就是该警告的数字表现。

## 3. 实际验证离线重连，而非摆拍

此工作中 Android app 保持连接，City 重启两次。app 进入 `stale`、重试、重连并重新读取服务器（`resync`），正是第 5.6 步要求路径。每次重启后，带 `{"clientRef":"android-PERM00","clientLabel":"PERM00"}` 的 `CLIENT_CONNECTED` 均出现在 canonical stream（首次后为 `seq 156`）。

## 4. 精确陈述完成 gate 状态

```text
 2  Alien + Mech two real distinct worker nodes, both ONLINE ............ MET (measured, running)
 3  Android is not faked as a worker node ............................... MET (nodes = Alien-Win, Mech-Win only;
                                                                              Android is in controlSurfaces)
 4  Android strict-targets Alien and Mech once each ..................... MET (seq 157-163, seq 164-170)
 5  Alien and Mech mutually strict-target ............................... HALF (Alien -> Mech DONE, seq 16-76;
                                                                              Mech -> Alien NOT DONE: needs Mech)
 6  negative controls fail-honest ....................................... MET on the live City (8/8), but the
                                                                              reviewer must rebuild them itself
 7  untargeted tasks unregressed ........................................ MET (Android-issued untargeted task
                                                                              completed; suite 1041/1043)
 8  three online surfaces converge within the bounded window ............ PARTIAL: two surfaces measured
                                                                              (desktop + Android); Mech Web absent
 9  Android offline/reconnect re-converges .............................. PARTIAL: reconnect observed twice;
                                                                              needs a receipt across a measured
                                                                              window
10  Formal Review PASS by another physical host ......................... NOT STARTED
11  exact review-head CI PASS .......................................... NOT STARTED (branch CI green per push)
12  main merge + merged-main CI ........................................ NOT STARTED
13  THREE_END_MESH_E2E_ACCEPTED ........................................ NOT STARTED
14  post-completion re-entry ........................................... NOT STARTED
```

## 5. 尚缺什么，谁能提供

距离可供 Mech 复核的开发报告，现只缺两项：

1. **Mech 主机控制界面**：Mech 浏览器连接此 City 并点名，提供自身 `observe` receipt，以及 **Mech → Alien strict-target**（第 5.2 步）。本机无法生成这些；Mech 已在 `mesh/MESH-301-three-end` 持有工具，自身身份已可用。
2. **Mech 独立仪器**：第 6 步要求复核者重建场景而非只读本报告，因此其负对照和自身收敛 receipt 是复核本身，不是重复。
