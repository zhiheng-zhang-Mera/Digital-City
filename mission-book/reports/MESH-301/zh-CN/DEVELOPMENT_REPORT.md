# Reading translation / 阅读译本

[Canonical source / 权威原文](../DEVELOPMENT_REPORT.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# MESH-301 — 开发报告

```text
workbook      mission-book/mesh-3end/MESH-301-三端实机互联与相互指挥.md
task          three real endpoints on one canonical City, mutually commandable
development   Alien host (development host, per Owner ruling 2026-10-03)
review        Mech host (endpoint A + formal reviewer; a DIFFERENT physical machine)
utopia        zhiheng-zhang-Mera/utopia, branch mesh/MESH-301-three-end
baseline      ec12fd0831f31fd81aef9cd9dfb0c959d010f63b  (main)
status        development COMPLETE except gate 8's final row; see §6
```

每项决定的详细推理位于本目录同层记录。本报告提供索引与阶段概述，不重复这些完整记录。

## 1. 实现内容

```text
services/dev-gateway/targeting.mjs        NEW  strict target-device rules; pure and unit-tested
services/dev-gateway/server.mjs           MOD  one task-creation path, the claim guard, the no-reroute
                                               guards, control-surface identity on the stream handshake
services/dev-gateway/actions.mjs          MOD  the user-level path; the target travels in `input`
apps/web/app.js, apps/web/index.html      MOD  the surface declares itself; a target selector beside Run
apps/android/.../CityClient.kt            MOD  self-declaration, createTargetedTask, dropSocket, gap
                                               self-declaration, generation-bound resync
apps/android/.../PairingApi.kt            MOD  the surface-observation receipt
apps/android/.../MainActivity.kt          MOD  the RUN ON row, built from the City's own node list
scripts/mesh301-mesh-probe.mjs            NEW  canonical-seq convergence and negative-control instrument
scripts/mesh301-web-surface.mjs           NEW  drives the browser surface and records what IT observed
tests/mesh301-strict-target.test.mjs      NEW  7 tests for the strict-target contract
evidence/raw/mission-book/MESH-301/alien-side/**   the gate-8 receipts and merge results
```

**未重开任何冻结内容。** 底层 `POST /api/v0/tasks` 仍只接受 `type`，保留其契约保证；定向经 Action facade 进入 City。未扩展 RS presentation `ALLOWED_ACTIONS`。未复用 `providerRef` 或 `handoffTargetRef`；新增第三字段 `targetDeviceRef`，正因为用户目标不可释放，而 `handoffTargetRef` 是 City 按设计在 15 秒后释放的预留。

## 2. 第 1–7 步

```text
Step 1  claim-time reconciliation ....... done; baseline, hosted CI and dependencies recorded in the
                                          workbook's own claim fields
Step 2  three surfaces, one City ........ Alien Web, Mech-Win-Web and the Android client (PERM00) each
                                          declare themselves on the stream handshake and appear in
                                          GET /api/v0/city as controlSurfaces; two real worker nodes
                                          (Alien-Win, Mech-Win) are the only entries in `nodes`
Step 3  strict target-device routing .... done; the five required properties each have a named enforcing
                                          rule and a test (see RECORD_STEP3_STRICT_TARGET_INTENT.md)
Step 4  Android -> Alien / Mech ......... done end to end: Q-fa5c5669 (Alien-Win, seq 157-163),
                                          Q-cfc3912a (Mech-Win, seq 164-170)
Step 5  PC -> PC and convergence ........ both directions done: Alien Web -> Mech-Win (seq 267-273) and
                                          Mech-Win-Web -> Alien-Win x2 (traced by connection-then-task
                                          timing, 448 ms and 472 ms). Convergence instrument built and
                                          run over two declared windows
Step 6  dual-host acceptance ............ negative controls 8/8 on the live City from this side; Mech
                                          reports 11/11 of its own. Formal Review NOT STARTED
Step 7  merge and terminal state ........ NOT STARTED
```

## 3. 按工作书要求陈述 strict-target contract

| 要求 | 执行位置 |
| --- | --- |
| `target=Alien` → 仅 Alien 可领取 | `/node/claim` guard 中 `claimAllowedByTarget` |
| `target=Mech` → 仅 Mech 可领取 | 对称的同一规则；健康 Alien 节点被拒绝证明此项 |
| offline/unknown → 不得静默 fallback | 创建时拒绝 `UNKNOWN`（`TARGET_DEVICE_UNKNOWN`）；`OFFLINE`/`INELIGIBLE` 创建后**等待**；handoff sweep 与 switch-decline 路径均拒绝转移定向任务 |
| 重复 action → 不得双重执行 | Action facade 的 `idempotencyKey` 加已 hash `input` 的 request fingerprint；同一 key 不可代表两个设备 |
| untargeted task → 保持原行为 | 字段缺省时 `claimAllowedByTarget` 返回 `true`；通过测试套件与 City 全部 untargeted 任务历史测量 |

## 4. 证据及复核者查阅位置

```text
strict target, unit + gateway    tests/mesh301-strict-target.test.mjs           7/7
full root suite                  node --test "tests/*.test.mjs"                1041/1043
                                 (2 failures are PRE-EXISTING and unrelated: capability-adapters and
                                  city-roads document-reader CORRUPT_INPUT fixtures; reproduced on the
                                  untouched baseline with this work stashed)
negative controls, live City     scripts/mesh301-mesh-probe.mjs negative -> negatives.json   8/8
convergence, window 1            four observers on three machines, 1434 CONVERGED,
                                 verdict FAILED on exactly one silent miss (seq 505)
convergence, window 2            three observers, MISSING x0, verdict INCOMPLETE
branch CI                        run 37092665142 SUCCESS (and per-push runs green)
```

## 5. 本工作在自身仪器中发现的缺陷

复核者应重点阅读此部分，因为每项均通过**运行**仪器而非阅读发现，其中数项属于“看似证据却并非证据”：

```text
1  merge read `at` for the server timestamp; the store's field is `timestamp` -> all latencies vs null
2  merge reported CONVERGED on an EMPTY timeline ("no surface breached the window" is vacuously true)
3  the desktop probe appended across runs, so one receipt held two sessions' boundaries interleaved
4  the probe reported its own start and stop as convergence failures
5  --skew defaulted to 0, so a table built WITHOUT declaring an offset still printed CONVERGED while a
   clock offset sat in the latency column (found by MECH, and the dangerous one)
6  --skew could not be combined with positional receipt filenames - the flag's value was read as a file
   (also found by Mech); my own first repair of it started at index 2 on an already-sliced argv
7  the Android surface recorded no `stale` because the drop path nulled the socket BEFORE cancel(), so
   the callback that would have logged the drop was discarded -> the surface could be SILENTLY STALE
8  a static clock skew drifts (592 ms -> 586 ms between runs), so a declared skew expires
```

缺陷 7、8 影响实质判断。7 是产品缺陷，通过唯一放弃入口 `dropSocket` 修复。8 意味着每张表都须声明**与其判定 receipt 同轮实测**的偏移；gate-8 表已经如此。

## 6. 明确陈述已知限制，不淡化

1. **未宣称 gate 8 满足。** 窗口 1 产生完整四观察者表，1434 中一项 seq 返回 `FAILED`：浏览器静默遗漏 `seq 505`。缺陷已修复，并通过窗口 2 重跑核验（`MISSING x1` → `GAP_DECLARED x1`，verdict `FAILED` → `INCOMPLETE`）。剩余项为 **Mech 窗口 2 行**；Mech 自 04:00:24Z 观察但尚未发布，`mech-web-gate8-window.jsonl` 仅覆盖窗口 1。
2. **未决政策问题由 Owner 解释。** 网络中断至客户端 `close` 触发之间事件，在任何陈旧信号出现前丢失。界面现通过 `gap` *声明*它们，但丢失仍发生于界面名义上认为在线期间。读法 A：可接受，工作书允许离线界面遗漏，只要求展示陈旧并重新收敛，现可证明满足。读法 B：不可接受；诚实修复是服务器端存活信号，由 City 而非 client 划定边界。我未在运行中自行选择。
3. **两项既有套件失败**不在本任务允许边界内，未改动。
4. **`GET /api/v0/health` 报 `degraded`**，因为 Room Hub 未在 loopback 运行。这是诚实组件状态，非 MESH-301 失败；City 自身路由为 `READY`。

## 7. 要求复核者完成什么

按工作书，复核不得只是报告签字。须用自身仪器重建场景，从全局事件而非截图证明 Android 发出指令确实改变后端状态，给实时一致性反例检查，至少包含一个 stale/duplicate/unauthorised-target 负对照，核验精确 head CI、证据可打开性和实际完成后的重新入池。Mech 已开始：报告 11/11 独立负对照、独立 Mech→Alien strict-target，以及共享合并工具两项缺陷。**这些尚不满足 gate 10；gate 10 由冻结 review head 上的 PASS 满足。**
