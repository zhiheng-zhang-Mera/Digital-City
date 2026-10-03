---
workbook_id: SHOW-401
phase: SHOWCASE_MATERIAL_EXTRACTION
sequence: 401
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/Digital-City
runtime_source_repo: zhiheng-zhang-Mera/utopia
runtime_source_mode: READ_ONLY_NO_PRODUCT_CODE_WRITES
baseline_policy: CURRENT_GREEN_MAIN_OR_ACCEPTED_FUNCTIONAL_BASELINE
dependencies: ["MESH-301", "UXI-391"]
development_host: Alien
development_branch: showcase/SHOW-401-alien-capture
development_head_sha: null
development_ci: NOT_APPLICABLE_NON_PRODUCT_MEDIA_TASK
development_complete: false
development_claimed_at: 2026-10-03T08:18:10.8514234Z
local_media_root: D:/AA-Digital-City/.showcase-media/SHOW-401
owner_documents_export_root: C:/Users/15601/Documents/Utopia-Showcase/SHOW-401
review_host: null
review_head_sha: null
review_ci: NOT_APPLICABLE_NON_PRODUCT_MEDIA_TASK
review_complete: false
preferred_capture_host: Alien
required_runtime_endpoints: ["Alien-Win", "Mech-Win", "Android physical control surface"]
owner_gate: NONE
merge_authority: false
report_path: mission-book/showcase-material-extraction/reports/SHOW-401
terminal_marker: UTOPIA_SHOWCASE_PACKAGE_READY
---

# SHOW-401 — Utopia 项目展示素材提取与双 Demo 制作

> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **异步减压施工：** [../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)  
> **过程数据规则：** [../PROCESS_DATA_POLICY.md](../PROCESS_DATA_POLICY.md)  
> **本 programme 说明：** [README.md](./README.md)
>
> 这是一项 **SHOWCASE / EVIDENCE EXTRACTION** 工作，不是 Utopia 产品开发。  
> **绝对禁止借录制之名修改 Utopia 代码。**

## 1. 目标

一次性完成可直接用于：

- PhD 套磁邮件；
- 项目主页；
- GitHub README / portfolio；
- 与导师一对一快速展示；

的 Utopia 项目展示素材包。

最终必须同时交付：

1. **主 Demo**：三真实端点互联 + strict target-device execution + result return；
2. **技术 Demo**：同一 task id 的 remote handoff / ownership transfer + result return；
3. **3 张核心截图**；
4. **1 张项目结果表**；
5. **核心技术提炼包**；
6. **DELIVERABLE_MANIFEST**，绑定媒体、task id、设备、运行基线与校验信息。

**不能因为视频已经录到“差不多”就提前结束。上述六项是 AND 关系。**

---

## 2. 已确认背景 / 当前真实能力

本工作书创建时已确认：

- MESH-301 = `COMPLETE / THREE_END_MESH_E2E_ACCEPTED`；
- 已验收拓扑不是“三个 worker”，而是：
  - Alien Windows：真实 worker `Alien-Win` + Web control surface；
  - Mech Windows：真实 worker `Mech-Win` + Web control surface；
  - Android 实机：真实 control surface，**不是 worker node**；
- 三端可进入同一个 canonical City；
- strict target-device routing 已实机验证；
- Web / Android 可看到任务执行与结果；
- UXI-391 已对 remote handoff / ownership transfer 做过真实双机收尾验收；
- 当前 Utopia / City 已有 reciprocal linkage，City 可读取 Utopia live main + CI。

因此本任务不再施工产品能力，只把已经存在的能力转化成**可复用展示材料**。

---

## 3. 最高优先级硬约束

### 3.1 Utopia 代码绝对只读

本 programme 对 `zhiheng-zhang-Mera/utopia`：

**允许：**
- 查看当前 main SHA / CI；
- 启动已经接受的程序；
- 运行 Web / Android / worker；
- 使用产品 UI 创建真实任务；
- 生成运行期 `.runtime` 状态、临时 pairing、task/event 数据；
- 为启动/关闭进程使用已有脚本；
- 为录制使用 Android Studio、会议软件、录屏软件。

**禁止：**
- 编辑任何 tracked Utopia source / test / docs；
- 新建 Utopia 开发 branch；
- commit / merge / cherry-pick / revert；
- 为了视频效果修代码；
- 改测试、改 success criteria、造假状态；
- 把本任务扩大成新的 UI / scheduler / runtime 开发。

如果录制过程中发现真实产品缺陷：

```text
STOP THE AFFECTED SCENE
→ record blocker + exact observation
→ continue only other unaffected showcase items
→ DO NOT PATCH UTOPIA
```

产品修复只能由新的 Owner-authorized workbook 执行。

### 3.2 主程序必须在前端桌面可见

录制期间的产品运行必须**有明确的前台产品窗口**。

最低要求：

**Alien：**
- Utopia Web / Activity / Devices 等产品界面处于可见桌面；
- Android Studio Device Mirroring 显示真实 Android 实机；
- 录制主机不得只留下后台 Node/脚本。

**Mech：**
- 通过在线会议软件共享真实桌面；
- 共享画面必须以 Utopia Web / product surface 为主要可见内容；
- 不允许只共享 terminal / tasklist / process monitor。

**Android：**
- 通过 Alien 的 Android Studio Device Mirroring 窗口展示真实设备；
- 不能用 Android emulator 冒充本任务的“physical Android”镜头。

### 3.3 CMD / PowerShell 只能辅助，不能代替产品监控

可以使用 CMD / PowerShell：

- 启动已有 Utopia runtime；
- 启动/停止 worker 以构造技术 Demo；
- 读取辅助诊断；
- 必要时确认进程退出。

但它们**不能成为以下事实的主要证明：**

- City 是否在线；
- 哪个 node 在线；
- task 是否 RUNNING；
- task 当前属于 Alien 还是 Mech；
- remote handoff 是否发生；
- task 是否 COMPLETED；
- result 是否回到原 control surface。

这些事实必须从 **Utopia 前端产品 UI / Activity / Devices / task state** 展示。

禁止在最终 Demo 中用：

```text
tasklist
Get-Process
netstat
PowerShell JSON dump
CMD log
后台 console 文本
```

代替产品 UI。

终端可以短暂存在于辅助区，但**程序主运行窗口必须持续存在**。

---

## 4. 推荐录制拓扑

### 4.1 录制主机

默认：

```text
Alien = capture/director host
```

理由：

- Alien 已连接 Android Studio；
- 可以同时展示 Utopia Web + Android 实机镜像；
- Mech 通过在线会议共享真实桌面；
- 最终只需要 Alien 单机录屏。

### 4.2 最终画面实际包含

```text
Alien physical desktop
├─ Utopia Web
├─ Android Studio Device Mirroring
│  └─ physical Android control surface
├─ online meeting window
│  └─ Mech shared Utopia desktop
└─ screen recorder
```

视觉上是两个电脑桌面，但系统事实是三个真实端点：

```text
Alien-Win worker
Mech-Win worker
Android physical control surface
```

### 4.3 设备身份展示

开场必须出现足够证据，让观众知道：

- `Alien-Win` 与 `Mech-Win` 是两个不同 worker；
- Android 是第三真实 control endpoint；
- 三端连接的是同一个 City；
- Android 不是第三 worker。

不要求展示 MAC/IP/永久 token。

---

## 5. 录制前预检

开始任何正式 take 前：

1. 读取 City 自动生成的 Utopia live status；
2. 记录：
   - current Utopia main SHA；
   - latest full CI status；
   - MESH-301 accepted functional baseline；
3. 当前 main CI 如果红：
   - 先判断是否是产品相关；
   - 若是产品相关，停止受影响录制；
   - **不得在本工作书内修代码**；
4. Alien / Mech / Android 可达；
5. 两个 Windows worker 在线；
6. Android physical device 已通过临时 pairing 接入；
7. 三个 control endpoints 指向同一 City；
8. permanent token / `.runtime/local-config.json` / private path 不在录制画面；
9. 通知、邮箱、聊天、个人账号等可能泄露信息的窗口关闭；
10. 录屏分辨率、会议共享和 Android mirror 字体可读。

### 5.1 录制可见性预检

正式 take 前截一张内部 QC 图，必须同时能确认：

- Alien Utopia product window 可见；
- Android Studio mirror 可见；
- Mech meeting share 可见；
- 没有任何一个 endpoint 只靠 shell 证明在线。

不满足则不得开始正式 take。

---

# 6. Deliverable A — 主 Demo

## 6.1 目标

用 **60–90 秒**证明：

```text
three real endpoints
→ one canonical City
→ Android can target a Windows worker
→ Windows control surface can target another worker
→ real task ownership / execution
→ COMPLETED
→ result returns to the initiating surface
```

## 6.2 推荐镜头

### Scene A1 — 三端同城（约 8–12 秒）

画面同时或快速切换：

- Alien Web；
- Mech shared Web；
- Android Studio physical-device mirror。

至少让观众看到：

- Alien-Win；
- Mech-Win；
- Android ONLINE/control-surface state；
- 两个 worker 属于同一 City。

### Scene A2 — Android → Mech-Win（约 20–30 秒）

优先采用这条，因为画面因果最强：

```text
Android physical device
→ choose target Mech-Win
→ Run
→ Mech product UI shows the same task / assignment
→ RUNNING
→ COMPLETED
→ Android sees final state/result
```

记录：

- task id；
- requested target；
- actual assigned node；
- terminal state；
- result-return surface。

如果当前 UI 没有同时显示全部字段，可通过 Activity / task details 在产品 UI 中补拍。

### Scene A3 — Alien Web → 另一 Windows worker（约 15–25 秒）

优先：

```text
Alien Web → Mech-Win
```

或者为了避免连续两次都是 Mech：

```text
Alien Web → Alien-Win
```

选择哪个以画面更清楚为准。

必须证明：

- target 是用户选择的；
- actual worker 与 target 一致；
- 完成结果回到原 Web surface。

### Scene A4 — Activity 收尾（约 10–15 秒）

最后停在产品状态/Activity：

- 两个真实 worker；
- 三端控制面事实；
- 刚才任务 target / state / completion；
- 无 UNKNOWN-target fallback；
- 无 duplicate terminal completion。

## 6.3 主 Demo 禁止内容

- 不讲“三 worker”；
- 不打开源码；
- 不滚 CI 日志；
- 不把 terminal 输出当主要画面；
- 不故意断网；
- 不为了显得复杂加入与主线无关的 Rooms；
- 不显示永久 token。

---

# 7. Deliverable B — 技术 Demo：Remote Handoff

## 7.1 目标

用 **60–90 秒**展示比普通 remote-control 更有研究价值的系统行为：

```text
same task id
→ initially RUNNING on Worker A
→ Worker A becomes unavailable
→ user-visible routing / handoff state
→ ownership transfers to Worker B
→ Worker B continues/completes the SAME task
→ result returns to the original control surface
```

### 关键口径

必须说/写：

> guarded ownership transfer / remote handoff of an in-flight task

不能说：

> arbitrary side-effect tasks are transparently migrated exactly once

因为当前 UXI-391 的验收边界没有支持如此泛化的结论。

## 7.2 推荐场景

使用已验证可稳定持有 worker 的任务类型，例如 accepted handoff runbook 中的 WAIT 类场景。

流程：

1. 原 control surface 创建 target task；
2. 产品 UI 明确显示：
   - task id；
   - RUNNING；
   - assigned Worker A；
3. **保持 Gateway 和 control UI 前台可见**；
4. 使用辅助启动/停止机制让 Worker A 离开；
   - terminal 可以执行这一步；
   - **不要把 terminal 当主镜头**；
5. 产品 UI 显示 loss / route decision / offer / handoff；
6. Worker B 上线/接管；
7. 产品 UI 证明：
   - same task id；
   - ownership/assignment 从 A → B；
8. Worker B 完成；
9. 原始 control surface 显示最终 result。

## 7.3 防“假 handoff”断言

录制证据必须能排除：

- 创建了第二个 replacement task；
- A 实际从未 RUNNING；
- B 在 task 归属 A 之前就抢走了任务；
- UI 只是播放预设状态；
- terminal 自己打印“handoff success”但产品没有这个事实；
- A 与 B 同时完成同一 task。

最终 `RESULTS.md` 必须记录：

```text
original_task_id
initial_owner
handoff_owner
terminal_owner
terminal_state
result_return_surface
duplicate_terminal_count
```

---

# 8. Deliverable C — 三张核心截图

截图不是视频随便截三帧。必须重新选择最能在 10 秒内解释项目的三张图。

## Screenshot 1 — 三端系统/拓扑证据

目标：

> 观众一眼知道是两 Windows workers + Android control endpoint，共享 canonical City。

优先来源：

- Devices / City state + Android mirror + Mech share 的清晰组合画面；

或者制作一个**不伪造运行事实**的简洁组合图：

```text
Android control
      ↓
canonical City
↙             ↘
Alien-Win    Mech-Win
```

如果使用图解，必须和实际 run 证据分开标注：

- Architecture diagram；
- Runtime screenshot；

不能把绘图伪装成运行截图。

## Screenshot 2 — Android strict-target execution

必须出现尽可能多的：

- Android physical device mirror；
- target = Mech-Win / Alien-Win；
- task id；
- RUNNING / COMPLETED；
- actual node。

## Screenshot 3 — Activity / handoff evidence

优先技术含量最高的一张：

- same task；
- A → B ownership；
- terminal completion；
- result visible from original surface。

如果 UI 单页无法同时展示这些事实，可用两张真实截图做一个带清晰时间顺序标注的拼图；不得改动截图中的系统状态内容。

---

# 9. Deliverable D — 项目结果表

填充 [RESULTS.md](./RESULTS.md)。

表必须简短，目标是教授在 20 秒内读完。

至少包含：

| Capability | Physical setup | Observed result | Evidence |
|---|---|---|---|
| Three-end mesh | Alien + Mech + Android | same canonical City | demo/screenshot |
| Android strict target | Android → Windows worker | target == assigned node, completed | task id |
| Web strict target | Alien Web → Windows worker | target == assigned node, completed | task id |
| Remote handoff | A → B | same task id transferred and completed | tech demo |
| Result return | original surface | final backend result visible | demo |
| CI / accepted baseline | Utopia main | exact-head green | City live status |

### 9.1 历史 measurement 可以引用，但不能冒充本次 take

例如 MESH-301 中已有 convergence measurement 可以作为：

```text
Previously accepted physical validation
```

但本次 showcase 的 task ids / take evidence 必须来自本次真实录制。

历史实验数据和本次录制结果要分栏。

---

# 10. Deliverable E — 核心技术提炼

填充 [CORE_MESSAGES.md](./CORE_MESSAGES.md)。

必须产出以下五个层级：

### E1 — 一句话项目定义

目标约 25–40 English words。

必须准确表达：

- multi-device personal computing/runtime；
- canonical state；
- heterogeneous control surfaces；
- real workers。

### E2 — 三个核心贡献点

最多 3 条，每条 1–2 句：

1. canonical multi-device task/device state；
2. strict target-device execution + result return；
3. guarded remote handoff / ownership transfer。

### E3 — 套磁邮件短段

约 80–120 English words，可直接复制进 professor outreach email。

不要把项目写成功能列表。

### E4 — 项目页技术摘要

约 180–250 English words。

应包含：

- motivation；
- architecture；
- validated physical setup；
- technically interesting failure/handoff behavior；
- evidence discipline；
- limitations。

### E5 — 研究问题方向

给出 3–5 个**非夸张** research framing：

例如：

- how to coordinate heterogeneous personal devices around one task truth；
- how to expose routing/handoff decisions without making UI the scheduler；
- how to measure bounded convergence across control surfaces；
- how to reduce human orchestration in long-running AI-assisted engineering；
- how to preserve fail-honest state under partial telemetry.

这些是“可研究问题”，不能写成已经发表/已经证明的科学结论。

---

# 11. Deliverable F — 媒体清单与 provenance

填充 [DELIVERABLE_MANIFEST.md](./DELIVERABLE_MANIFEST.md)。

每个成品必须记录：

```text
artifact_id
artifact_type
title
capture_host
physical_devices
utopia_runtime_sha
utopia_ci
city_control_sha
recorded_at
file_path
file_hash
duration_or_dimensions
task_ids
contains_sensitive_content = false
claims_supported
known_limits
selected_for_outreach = yes/no
```

## 11.1 媒体文件位置

**不得把视频写进 Utopia repo。**

默认：

```text
<Owner Documents>/Utopia-Showcase/SHOW-401/
├─ video/
│  ├─ main-demo/
│  └─ technical-handoff/
├─ screenshots/
├─ qc/
└─ exports/
```

实际 claim 时记录绝对路径。

Digital-City 默认只 commit：

- 本工作书；
- media manifest；
- RESULTS.md；
- CORE_MESSAGES.md；
- 选择后的安全小尺寸 PNG（可选）；
- report。

大 MP4 默认留在本地 export folder，不塞 Git。若 Owner 后续指定云盘/Release/视频平台，再单独处理发布。

---

# 12. 实际施工顺序

严格按以下顺序，避免“录完才发现没证明关键事实”。

### Step 1 — Claim / runtime reconciliation

- 读取最新 Digital-City main；
- 读取 `UTOPIA_LIVE_STATUS.json`；
- 读取 MESH-301 / UXI-391 当前 accepted facts；
- 记录 runtime SHA + CI；
- 确认 Utopia repo 没有被本任务写入；
- 设置本地 media export root。

### Step 2 — Privacy / desktop cleanup

- 隐藏 permanent token；
- 关闭私人通知；
- 清空无关浏览器标签；
- 会议 participant 名称使用可接受展示名；
- Android 锁屏通知关闭；
- 不展示个人文件路径。

### Step 3 — 可见运行面搭建

Alien：

- Utopia Web 前台；
- Android Studio physical-device mirror 前台；
- meeting window 前台可切换。

Mech：

- Utopia Web 前台；
- meeting share 共享产品桌面。

**QC 截图通过后才能继续。**

### Step 4 — Main Demo rehearsal

只彩排一次完整路径，记录问题。

如果问题来自：

- 镜头布局；
- 字体；
- meeting share；
- 窗口位置；
- 操作节奏；

可以修录制环境。

如果问题来自 Utopia 产品行为：

- 不改代码；
- 记录 blocker；
- 只重试可合理归因于 runtime/session/transient 的一次；
- 持续复现则停止该 scene。

### Step 5 — Main Demo final takes

最多保留 3 个正式 take。

选一个：

- 因果最清楚；
- 文字可读；
- 无 secret；
- 无 terminal 主导；
- 无明显空等；
- target/assignment/result 证据完整。

### Step 6 — Technical Demo rehearsal + final

同样最多 3 个正式 take。

必须做 anti-vacuity 检查。

### Step 7 — Screenshots

从真实 runtime 状态重新截取/选择三张。

不要为了截图修改产品状态文字。

### Step 8 — Results table

使用本次 task ids + accepted historical evidence 填写。

每个结果必须指向：

- video timestamp；
- screenshot；
- task id；
- City/Utopia acceptance evidence；

至少一种。

### Step 9 — Core messages

先从结果表提炼，而不是凭记忆写 marketing copy。

顺序：

```text
observed facts
→ bounded claim
→ contribution wording
→ email paragraph
```

### Step 10 — Media QC

逐个检查：

- 视频从头到尾可播放；
- resolution / audio（若有）；
- 设备标签可读；
- secret scan；
- claim 与画面一致；
- Android 没被说成 worker；
- remote handoff 没被说成 arbitrary transparent migration；
- 没有用 terminal 冒充产品 UI。

### Step 11 — opposite-host review

Development/capture host 与 Review host 使用不同实体主机。

Reviewer 不重新录制，只独立检查：

- 主 Demo 是否真的支持声称的因果链；
- 技术 Demo 是否 same task id；
- 三张截图是否能独立读懂；
- result table 数字是否能追溯；
- core messages 是否 overclaim；
- secret/privacy；
- 终端是否抢占主画面。

若只是剪辑/文字/标注缺陷，可直接在 City showcase outputs 修复。

若涉及 Utopia 产品缺陷：

**不得修 Utopia。**

### Step 12 — Final package selection

标记：

```text
MAIN_DEMO_SELECTED
TECH_DEMO_SELECTED
SCREENSHOT_1_SELECTED
SCREENSHOT_2_SELECTED
SCREENSHOT_3_SELECTED
RESULT_TABLE_FINAL
CORE_MESSAGES_FINAL
MANIFEST_FINAL
```

然后设置：

```text
UTOPIA_SHOWCASE_PACKAGE_READY
```

---

# 13. 任务特有独立复核

Review host 至少检查：

1. 视频中确实是两个 Windows + physical Android；
2. Mech share 不是录播/静态图；
3. Android Studio 是 physical device mirror；
4. task target 与 actual assignment 能从产品 UI 读到；
5. handoff 前 A 确实 RUNNING；
6. handoff 后 B 承接的是 same task id；
7. result 回原 surface；
8. Utopia tracked files 在该任务中没有任何 product-code mutation；
9. CMD/PowerShell 没有成为主监控/主证据；
10. 没有秘密/永久 token 入镜；
11. 文案没有 overclaim。

Review finding 分两类：

```text
MEDIA_NARRATIVE_DEFECT
PRODUCT_DEFECT
```

- `MEDIA_NARRATIVE_DEFECT`：本工作书内修；
- `PRODUCT_DEFECT`：记录、阻塞对应 scene，禁止改 Utopia。

---

# 14. 完成门槛

只有以下全部满足，才允许：

```text
development_complete: true
review_complete: true
status: COMPLETE
terminal_marker: UTOPIA_SHOWCASE_PACKAGE_READY
```

硬门槛：

1. 主 Demo final 已选；
2. 技术 Demo final 已选；
3. 3 张截图 final 已选；
4. RESULTS.md 无 placeholder；
5. CORE_MESSAGES.md 五层内容全部完成；
6. DELIVERABLE_MANIFEST.md 无 placeholder；
7. 每个视频至少一个 exact task id；
8. technical demo 证明 same-task handoff；
9. Utopia runtime SHA / CI 已记录；
10. Utopia tracked source/test/docs 未被本 programme 修改；
11. 产品主运行界面始终有前台可见窗口；
12. terminal 仅辅助，不是主要 process monitor；
13. Android 为 physical device；
14. privacy/secret scan PASS；
15. opposite-host review PASS。

**缺任意一项都不能写 COMPLETE。**

---

# 15. Reports / evolution 记录

保存：

- `reports/SHOW-401/CAPTURE_REPORT.md`
- `reports/SHOW-401/REVIEW_REPORT.md`
- `reports/SHOW-401/TAKE_SELECTION.md`
- `reports/SHOW-401/PRIVACY_QC.md`

可作为 Utopia/Digital-City 未来产品论文的素材：

- 一个系统 prototype 应如何转换成 recruiter/professor 可快速理解的 evidence package；
- 实机展示中“可观测事实”和“运行后台日志”的证据层级；
- 用 same-task ownership transfer 区分真实 handoff 与 UI mock；
- 如何防止 showcase 过程中为了录制方便反向污染产品代码。

---

## 16. 绑定常驻规则

本工作书继承 `mission-book/CONSTRUCTION_RULES.md` 的：

- 原子领取；
- 双机独立；
- typed blocker；
- event-first wake-up；
- no-make-work；
- evidence honesty；

但以下 task-specific 规则更严格：

1. **Utopia 是 READ-ONLY runtime source；本工作书永远无权修改其产品代码。**
2. **程序运行必须通过前台产品窗口可见；terminal 只能辅助。**
3. **展示材料的成功标准是可追溯的真实产品行为，不是“视频看起来像成功”。**
