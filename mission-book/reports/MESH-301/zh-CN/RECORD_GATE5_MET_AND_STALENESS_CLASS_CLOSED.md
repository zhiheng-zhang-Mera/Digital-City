# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_GATE5_MET_AND_STALENESS_CLASS_CLOSED.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — MESH-301：Mech 满足 gate 5；静默陈旧类型已关闭（R1/R2 修复并核验）

```text
FROM = Alien (development host)   TO = Mech (formal reviewer), Owner
UTOPIA = branch mesh/MESH-301-three-end @ 6854209
```

## 1. 第 5.2 步完成，由 Mech 从自身 Web 界面执行

这些不是我发出的；重点在痕迹，以下保留完整链路：

```text
seq 325  03:28:17.068Z  CLIENT_CONNECTED {"clientRef":"web-mech-39xei5vm","clientLabel":"Mech-Win-Web"}
action   03:28:17.540Z  target=Alien-Win  -> task Q-5d076006…  COMPLETED on Alien-Win   (472 ms later)

seq 357  03:29:03.637Z  CLIENT_CONNECTED {"clientRef":"web-mech-bpsf9r9j","clientLabel":"Mech-Win-Web"}
action   03:29:04.085Z  target=Alien-Win  -> task Q-0e068bea…  COMPLETED on Alien-Win   (448 ms later)
```

有两项独立佐证，因为仅“任务存在”不能说明谁发出：`Action` 记录带 Web UI 自身 idempotency-key 形式（`Date.now()-Math.random()`），**且**每次 `Mech-Win-Web` 连接均在对应任务之前不足半秒。两个任务均严格定向 `Alien-Win`，并在 Alien 主机执行。

因此 **gate 5（Alien ↔ Mech 相互 strict target）为 MET**；两个方向来自两台不同物理主机、两个不同控制界面：Alien Web → Mech-Win（`seq 267–273`）及上述 Mech-Win-Web → Alien-Win。

## 2. R1：界面现自行声明缺口，`MISSING` 已消除

上一轮缺陷是网络中断至 `onLost` 触发之间事件在**任何陈旧信号出现前**丢失，receipt 无法界定未见开始的缺口（8 个此类 seq）。修复无需新服务器信号，因为界面可自行发现不连续：比较连续 `seq` 并写 `gap`，精确点名遗漏内容。

设备上核验，在独立桌面观察者覆盖下关闭并恢复 Wi-Fi：

```text
{"kind":"stale",      "observedAt":1790998346588}
{"kind":"reconnected","observedAt":1790998354141}
{"kind":"gap",        "gapFrom":436,"gapTo":470}      <- the surface naming its own hole
{"kind":"resync",     "maxSeq":471}                   <- and re-reading the server after it

PERM00 states:  CONVERGED x40,  OFFLINE_AT_EMIT x33,  GAP_DECLARED x3,  MISSING x0
verdict = INCOMPLETE
```

上一轮 `MISSING x8` 变成 `MISSING x0`，这是全部结果。三项 `GAP_DECLARED` 是缺口中位于已声明离线区间**之外**的部分，即 pre-`stale` 窗口；现已*声明*，不再静默缺失。verdict 为 `INCOMPLETE` 而非 `CONVERGED`，因为已声明缺口仍是缺口；变化是仪器不再遭遇遗漏造成的虚假陈述。

## 3. R2：resync 绑定 socket generation

布尔 `pendingResync` 被每 2 秒也会执行的 `refresh()` 消费，导致 socket 重开时已经启动的 refresh 用**重连前**快照记录 resync（实测 `394` 已存在，`maxSeq` 却为 `392`）。现于请求*之前*捕获 generation 计数，因此只有开启 generation 内拉取的快照可作为重新收敛见证。本轮 `RESYNC_STALE` 未再出现。

## 4. 同时修复桌面 probe 匿名连接

此前 canonical truth 将我的 probe 记录为 `CLIENT_CONNECTED {"clientRef":null,"clientLabel":null}`，一个无法与他人区分的“界面”，会因三端之一无法识别而静默削弱三界面表。probe 现自行声明身份。

## 5. gate 状态

```text
 2  two real workers online ................ MET
 3  Android is not a fake worker ............ MET
 4  Android strict-targets Alien and Mech ... MET
 5  Alien <-> Mech mutual strict target ..... MET   (Alien Web -> Mech-Win; Mech-Win-Web -> Alien-Win x2)
 6  negative controls fail-honest ........... live City 8/8; the REVIEWER must rebuild independently
 7  untargeted unregressed .................. MET
 8  three surfaces in ONE window ............ NOT MET — all three have now been exercised, but never inside a
                                              single measured window; that is the only form the gate accepts
 9  Android re-converges after reconnect .... MET on re-convergence (stale -> gap -> resync to server max),
                                              with ONE open policy question below
10-14  Formal Review / CI / merge / marker / re-entry .... NOT STARTED
```

### 唯一未决政策问题：陈述而非自行决定

pre-`stale` 窗口（回调前丢失的事件）现已**声明**，但仍是在界面名义上认为在线时发生的丢失。两种读法均有依据，应由 Owner 决定设计，而非本端在运行中选择：

1. **可接受**：工作书允许离线界面遗漏事件，只要求显示陈旧并重新收敛；现可证明已满足（声明 gap，随后 `resync` 至服务器自身最大值）。按此读法 gate 9 满足，三项 `GAP_DECLARED` 是预期行为。
2. **不可接受**：界面尚未声明离线期间的任何丢失，原则上是长度无界的静默缺口；诚实修复是服务器端存活信号（City 在漏掉 heartbeat 时标记界面缺席），让边界由服务器而非客户端划定。

同时记录两者，因为区别不是表面措辞：读法 1 可仅由客户端满足，读法 2 需要服务器机制并改动 City，承诺范围更大。

## 6. 下一步

```text
1. ONE window holding all three surfaces simultaneously (Alien Web + Mech-Win-Web + PERM00) -> gate 8, and
   the only remaining development-side item.
2. Mech's independent instruments and its Formal Review on the review head (step 6) -> gates 10-14.
3. The Owner's reading of §5's open question, since it decides whether gate 9 is already met or needs the
   server-side liveness signal.
```
