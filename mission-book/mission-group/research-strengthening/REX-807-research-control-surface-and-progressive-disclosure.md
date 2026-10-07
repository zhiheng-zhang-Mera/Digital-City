---
workbook_id: REX-807
phase: RESEARCH_STRENGTHENING
sequence: 807
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["69a097b5394a9fece39dd11cc13f04c9b4d28bfe"]
dependency_source_workbooks: ["REX-801","REX-806"]
dependency_source_shas: ["7e96a4d28f4cb701d7a0951bace69857c3228f32","12e3d3bf868575a8e3cda983733a3186cb59da27"]
development_baseline_sha: "12e3d3bf868575a8e3cda983733a3186cb59da27"
baseline_resolution_evidence: "CLAIM-TIME MEASUREMENT (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS, 2026-10-07): baseline_anchor_mode is DEPENDENCY_SHA_UNION_AT_CLAIM and the declared sources are REX-801's accepted head 7e96a4d28f4cb701d7a0951bace69857c3228f32 and REX-806's accepted head 12e3d3bf868575a8e3cda983733a3186cb59da27. MEASURED, not assumed: origin/main IS 12e3d3b (the accepted REX-806 repair head was merged into main under the owner gate; runs 37542958872 and 37542958826 both green), and git merge-base --is-ancestor confirms BOTH dependency heads are ancestors of main (7e96a4d2 exit 0, 12e3d3b exit 0), as is the required ancestor 69a097b5394a9fece39dd11cc13f04c9b4d28bfe (exit 0). The dependency union is therefore main itself and no union construction was needed - a direct consequence of the REX-806 merge, recorded so the claim does not read as an unverified shortcut. Branch rex/REX-807-mech-research-control-surface starts from that head. Prerequisites re-read before claiming: this workbook's own preflight reports/REX-PROGRAMME/REX-807_CLAIM_READINESS_MECH.md, the control-surface specification RESEARCH_CONTROL_SURFACE.md and the research evidence protocol. Boundaries unchanged: no purchase, no system service, no running-profile change, no remote execution, and merge_authority false (the REX owner gate grants merging only to qualified tasks and REX-807 is not accepted yet)."
baseline_blocker: null
dependencies: ["REX-801:EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED", "REX-806:RESEARCH_ARTIFACT_EXPORT_ACCEPTED"]
development_host: "Mech"
development_branch: "rex/REX-807-mech-research-control-surface"
development_head_sha: "9ad888279be07220fe7ac7d91e419e8fe69fc439"
development_ci: "SEVEN heads, every failure kept with its cause. (1) b06e978fb1c6578305ba485445992d3a1d82913f: run 37546655667 gateway-web failed on ONE pre-existing browser test (tests/rex803-campaign-web.test.mjs) while this commit was purely additive - classified as a load-sensitive flake on five measured grounds and confirmed green on re-run. (2) 05ca33e015387149dded134e493b5bc46a8cea1e: run 37548550930 gateway-web failed TWO ACCEPTED browser tests and this one WAS my fault - the first wiring of research.js dropped the #research-vocabulary disclosure the suite waits for, moved the storage-unavailable sentence out of #research-list where the suite reads it, and referenced a deleted esc() helper so show() threw 'esc is not defined' and left every control disabled; my own shape test missed it because its stubs defeated the page's identity check. (3) e07e1cb6ef85dde74babf08c6c1352246f8e799e: run 37549643362 completed/success (gateway-web and android green) after the fix and after the S8 harness was made faithful (memoised nodes so the render path really runs and its post-conditions are asserted). (4) afe8f1cc79dd44e4010e6b1dae841ee4fbb57689 (the Android observation increment): run 37552135025 gateway-web success and **android failure** - the Kotlin compiled cleanly and 119 tests ran with exactly ONE failure, my own reflection guard at ResearchRunTest.kt:74, because the Compose compiler plugin adds a synthetic \$stable field to a class it treats as stable so declaredFields holds six entries rather than the five I had asserted as an exact set. (5) b9d6db2b99f7c0b6e2980896c3733966ba17aef4: run 37552757573 completed/success with BOTH jobs green after the guard was re-expressed as 'the five observation fields are present AND no field name is control-shaped'. Local on the Web side: rex807 8/8, the accepted rex801 research UI suite 3/3, adjacent web suites green, EIGHT source mutations all caught with byte-identical restoration. ENVIRONMENT FACT: this host cannot build Android - no JDK below 25/26 is installed and the Android Gradle Plugin refuses both (JAVA_HOME pointed at a stale D:\\Android_Studio\\jbr; the real JetBrains runtime is JDK 25 and C:\\Program Files\\Java holds JDK 26), so the Android increment's compile and unit-test evidence comes from CI's android job and the record says so instead of implying a local pass. A SIXTH head f81ac5f6f5b5212906f8c46d5c27e4779274b332 (increment 4, the danger-zone confirmation gate): exact-head V0.2 checks push 37556641795 completed/SUCCESS with BOTH jobs green (gateway-web and android); local evidence for that head was the three focused suites 12/12, the wider adjacent set 27/27, and SEVEN source mutations caught. A SEVENTH head 10aed3e2d464270a129f46537c570113ee3894b9 (increment 4b, Export implemented as a real control): exact-head V0.2 checks push 37558498188 completed/SUCCESS with BOTH jobs green (gateway-web and android). An EIGHTH head 9ad888279be07220fe7ac7d91e419e8fe69fc439 (increment 4c, metric values rendered): exact-head V0.2 checks push 37559402329 completed/SUCCESS with BOTH jobs green, and that is the development head this task closes on. Local evidence at that head: rex807 suites 15/15 including the metric-rendering assertions, the wider adjacent set 32/32, and NINE source mutations caught with byte-identical restoration. Local evidence: rex807-surface + rex807-danger-confirmation 12/12, the wider adjacent set (accepted REX-801 research UI, REX-804 fault/receipt/web, REX-806 artifact surface) 32/32, check:docs SYNCHRONIZED in all three roots, and EIGHT source mutations each turning the suites red with byte-identical restoration - one of them in the GATEWAY and one that leaves Export declared but inert. Local evidence for that head: the three focused suites 12/12, the adjacent REX-804 fault and receipt suites plus REX-807 and the accepted REX-801 research UI suite 27/27, check:docs SYNCHRONIZED in all three roots, and SEVEN source mutations (including one in the GATEWAY rather than the page) each turning the suites red with byte-identical restoration. The full local suite is recorded honestly at 1470 tests / 1465 pass / 5 fail, with the SAME five failing at the untouched baseline head b9d6db2 when this work was stashed - except that the REX-804 danger-zone browser test fails at baseline under full-suite load and passes with this increment."
development_complete: true
development_completion_note: "Development closed at head 9ad888279be07220fe7ac7d91e419e8fe69fc439 (increments 1-4c), with the six workbook 'must verify' items each implemented and each backed by a runnable check. NOTHING IMPORTANT IS HIDDEN: storage outage, unreadable records, exclusions, unmeasured metrics and an unfinished run are visible alerts carrying their reasons. IDENTIFIERS ARE FOLDED, NOT DELETED: the primary label is the human summary, identifiers travel as attributes, and the exact records live in a collapsed technical layer that also names every payload field this view does not place yet. HIGH-IMPACT CONTROLS CANNOT BE TRIGGERED BY ACCIDENT: the Danger Zone is collapsed, the confirmation token has ONE source of truth built from what the gateway actually enforces (FAULT:<kind>:<nodeId>), and researchView REFUSES to return a shape in which an ADVANCED_CONTROL section or control would be unconfirmed. RESEARCH IS USABLE WITHOUT A CONSOLE: the whole experiment path (import, validate, register, run a campaign with repetitions, see measured/excluded rows and the filed receipt) is driven through the browser by the accepted REX-803 suite, and Export - which until this increment existed ONLY as an HTTP endpoint, with a declared control that nothing implemented - is now a real control whose downloaded bytes are asserted. METRICS ARE READABLE: reported metrics render with their values and units, unmeasurable ones keep their reason beside them, and an empty list says it is empty instead of claiming everything was measurable. ANDROID OBSERVES: MainActivity routes to ResearchRunPanel, which reads client.researchCampaigns read-only, with eight guards in ResearchRunTest. EVIDENCE: rex807 suites 12/12 plus the metrics-rendering assertions, the wider adjacent set 32/32 (accepted REX-801 research UI, REX-804 fault/receipt/web, REX-806 artifact surface), NINE source mutations each turning the suites red with byte-identical restoration - one of them in the GATEWAY, one leaving Export inert, one returning the metrics to prose - and exact-head CI 37559402329 green on BOTH jobs. KNOWN LIMITS, named rather than glossed: this host cannot build Android (no JDK <=21; AGP refuses 25/26) so Android compile/test evidence comes from CI's android job; Android is observation only, since authoring parity is the workbook's own future-backlog allowance; the full local suite is 1470 tests / 1465 pass / 5 fail, and the SAME five fail at the untouched baseline head b9d6db2 (three launcher/enrolment, one theme lab, one browser), so this increment neither caused nor hid them. Handoff for the opposite host: reports/REX-807/REVIEW_HANDOFF_Mech.md, which lists what to attack (remaining false buttons, whether the token really has one source, whether an unmeasured metric is distinguishable from a measured zero, whether the export read is owner-only in the PAGE as well as the gateway, disclosure versus visibility, and emergency stop while the fault store is unavailable)."
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: RESEARCH_ADVANCED
user_exposure_nesting: L3_ADVANCED
backend_wiring: TO_BE_VERIFIED
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/REX-807
terminal_marker: RESEARCH_CONTROL_SURFACE_ACCEPTED
owner_gate_ruling_2026_10_07: "OWNER GATE OPEN for the REX series (owner instruction this session): QUALIFIED sub-tasks may merge, i.e. those whose own review is complete and whose marker is released. merge_authority is set true on REX-801..805 (all accepted and now in main) and stays false on REX-806/807/890 until their reviews complete - acceptance, the opposite-host review and the markers are unchanged, and section 3 still forbids self-review. Recorded by Mech-DS."
---

# REX-807 — Research Control Surface + Progressive Disclosure

> 常驻规则：[../CONSTRUCTION_RULES.md](../../CONSTRUCTION_RULES.md)  
> 异步协议：[../ASYNC_RELIEF_CONSTRUCTION.md](../../ASYNC_RELIEF_CONSTRUCTION.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](RESEARCH_EVIDENCE_PROTOCOL.md)

## 目标

把 Research Fabric 暴露给 Owner，同时不让普通产品 UI 视觉过载。

遵循 [RESEARCH_CONTROL_SURFACE.md](RESEARCH_CONTROL_SURFACE.md)。

## 最低入口

一个清晰但次级的：

```text
Research / Experiments
```

入口。

里面分层：

- Experiments；
- Runs；
- Metrics；
- Replay / Ablation；
- Export；
- Advanced Fault Injection；
- Technical Details。

## 必须验证

- 普通 Home / Ask / Devices 不被 research controls 淹没；
- Research 功能不靠 console/API 才能使用；
- high-impact fault controls 不误触；
- raw IDs 默认折叠；
- errors / exclusions / incomplete metrics 对用户可见；
- Web 为完整控制面；Android 至少能观察 run/status/critical attention，完整 authoring parity 可记录 future backlog。

## Review

Formal Reviewer 用普通用户路径寻找隐藏入口、假按钮、过度折叠、信息不足和视觉过载。

## 完成门槛

直接控制、知情、危险操作隔离、技术详情折叠均满足全局 Capability Exposure Gate。

## 2026-10-07 增量 4c（head `9ad8882`）：指标值真的渲染出来 —— 最小入口里最后一个「信息过薄」的点

```text
缺口：工作书的最小入口列了 **Metrics**，而视图模型对这一段只渲染**一句话**。一个永远读不到任何指标的 Metrics 区，
正是复检方被要求去找的「信息不足」失败；空列表时那句话还会断言「本运行报告的指标都可测量」——
这是对本视图并不掌握的数据下结论。
交付：`researchMarkup` 现在逐项渲染指标（名称 + **值** + 单位），读不出的指标把原因留在同一行旁边；
**空列表就写空**，不再替数据打包票。S8 直接断言渲染片段：名称在场、**值是 `<strong>` 而非只有名字**、单位保留、
空列表产出「尚未报告任何指标」。
证伪：**9 处突变全部变红**并按字节还原（本轮新增：把指标值退回散文）。
本地：rex807 两套 + 已验收 REX-801 研究界面 15/15；exact-head CI `37559402329` 两 job 全绿。
开发侧到此收口（`development_complete: true`），交对侧复检；交接与「建议你重点攻击什么」见
reports/REX-807/REVIEW_HANDOFF_Mech.md（含我明确**不**声称的事）。
```

## 2026-10-07 增量 4b（Export 变成真控件：工作书要求「不靠 console/API 也能用」）

```text
实测缺口：`/api/v0/research/artifacts` **存在**，但**没有任何 Web 模块调用它**，也没有任何页面渲染出口 ——
即「产出研究交付物的那一个能力」当时只能手工打 API。而视图模型的 replay-export 区块里列着一条
「Export artifact」控件，却无人实现 ⇒ **列了没接的控件就是假按钮**。
交付：Research 页新增 Export 折叠区与两个**真控件**（下载工件 JSON / 下载指标 CSV）。凭据由外壳持有（`.js` 侧
`exportArtifact` 能力注入），页面在没有该能力时**明确拒绝并说明原因**，区块也写明需要 Owner 会话而不是静默失败。
连带修掉「接线元数据在说谎」：每条控件现在都记录 `wired`/`wiredAt`，export 为 `wired:true`（本页），
replay 为 `wired:false`（实际在 research-replay）。
新守卫 **S12**（真实浏览器 + 真实持有一份 campaign 回执的 City）：点击下载后**校验字节** —— 清单里的 cityId 等于本城、
指标与校验和在场、文件名是具名而非 blob id、CSV 带指标表、页面报告「上次导出」。
写这条测试时暴露并修掉**我自己**的三个缺陷（逐个记录，不静默修）：外壳能力返回裸字符串导致页面把名字存成 `''` 而
不报告（改为返回 `{name,format,bytes}`）；测试读了**折叠区块的 innerText**（该浏览器下为空）而把正确控件误判为未渲染；
测试自己的助手把刚展开的折叠区又**点了关**（点开着的 `<details>` summary 会收起）。另有一个更早的失败也是我的：
首版导出测试用错了 node 凭据，看到的是空节点列表。
证伪：**8 处突变全部变红**并按字节还原（新增两处：**网关**放宽令牌检查、把 Export 控件留成无处理器的摆设）。
本地证据：rex807 两套 12/12；更宽的相邻集（已验收 REX-801 研究界面、REX-804 故障/回执/Web、REX-806 工件面）32/32；
check:docs 三根 SYNCHRONIZED。exact-head CI：V0.2 checks push `37558498188` **completed/success，两个 job 全绿**。
```

## 2026-10-07 增量 4（危险区确认从「一句话」变成「一道闸」；并修好那句说错的提示）

```text
缺口是**我自己写的**：危险区带了 requiresConfirmation 与确认语，但 (a) 没有任何东西真的**拒绝**任何操作，
测试也只断言那句话里出现过某个词；(b) 那句话本身**错的** —— 视图模型要求「输入 campaign id」，而网关只接受
`FAULT:<kind>:<nodeId>`（services/dev-gateway/research/faults.mjs:41）。照屏幕提示做的操作者会被
403 FAULT_CONFIRMATION_REQUIRED 拒绝：**无法被满足的安全提示比没有提示更糟**，它会教操作者随便粘点什么让它消失。
交付：令牌**单一来源**（`faultConfirmationToken`，页面渲染它、不再自拼短语）；`assertAdvancedControlsConfirmed`
把要求变成**会抛错**的检查并覆盖三种形状（未确认的高级区块 / 区块内未确认的高级控件 / 顶层未确认的高级控件），
`researchView()` 返回前调用 ⇒ 以后新增高级控件**不可能悄悄变成一键**；
新套件 tests/rex807-danger-confirmation.test.mjs S9–S11（S10 用**真实网关**证明"本模块拼出的令牌 = 网关接受的令牌"，
且拒绝时确实零注入；S11 用**真实浏览器**证明错误确认零注入、空/空白本地被拒并写出确切令牌、只有确切令牌能注入且只注入一次）。
与**已验收边界**的冲突（如实记录）：第一版让客户端拒绝一切不匹配，**悄悄挪动了已被验收的 REX-804 边界**
（tests/rex804-web.test.mjs 断言网关的类型化 403 会显示给用户）。改为：非空确认一律提交（网关是权威），
本地只拒绝**空/纯空白**；**不为迁就 UI 改动而改写已验收测试**，并把该已验收套件并入本增量证伪集。
证伪：**7 处突变全部变红**并按字节还原（含一处改**网关**而非页面 —— 它会红正说明守卫绑的是真实契约）；
聚焦三套件 12/12；相邻 REX-804 故障/回执 + REX-807 + 已验收 REX-801 研究界面共 27/27；check:docs 三根 SYNCHRONIZED。
本机全量套件如实记录：1470 / 1465 通过 / 5 失败，**同一组 5 项**在未改动 baseline `b9d6db2` 上同样失败（stash 实测），
差别只有一处：REX-804 危险区浏览器用例全量并行下 baseline 失败、本增量后通过。
详细记录见 reports/REX-807/DEVELOPMENT_REPORT.md §8。exact-head CI：V0.2 checks push `37556641795` **completed/success，两个 job 全绿**（gateway-web 与 android）。
```

## 2026-10-07 增量 3（Android 观察面；本机无法构建 Android，改用 CI 验证）

```text
apps/android：新增 ResearchRun.kt（**纯解析 + 视图模型**：当前运行、回执窗口自身边界、可见 attention
  RUN_INCOMPLETE / UNFINISHED_CAMPAIGN / STORE_UNAVAILABLE 带原因；owner 被拒时不是空页；标识符只进折叠技术层）、
  ResearchRunPanel.kt（**观察专用**，无创建/启动/停止/故障注入）、MainActivity 高级导航新增「研究运行」、
  CityClient 新增只读 researchCampaigns；ResearchRunTest.kt 8 项守卫（含「视图模型不得暴露控制形状字段」的反射断言）。
验证：**本机无法构建 Android**（无 JDK ≤21，AGP 拒绝 25/26）⇒ 以 CI 的 android job 为编译器与测试机。
首跑 head afe8f1c：android **failure** —— Kotlin 编译干净、119 测试仅 1 失败，且失败是**我自己**的反射断言：
Compose 编译器插件会给 stable 类加合成字段 `$stable`，`declaredFields` 是 6 个而非我写死的 5 个。
修法：断言改为「五个观察字段必须在场，且字段名不得为控制形状（create/start/stop/inject/fault/confirm/submit/mutat）」。
修复头 b9d6db2：**CI run 37552757573 两个 job 全绿**。
```

## 2026-10-07 增量 2（页面真正渲染这一层；含一次**我造成的真实回归**）

```text
research.js 重建为用视图模型渲染：顶部可见告警（存储不可用/坏记录/排除项/未测量指标/未结清运行，都带原因）、
直接控制区展开、实验列表以 question 作主标签且标识符仅作属性、Runs/Metrics 用用户语言、Technical details 折叠
并含「未归位字段」清单；页面同时读 registry 与 live run。research-surface.js 新增 `researchMarkup`，
使「形状」可在无浏览器下断言。
第一次接线（05ca33e）打坏了**已被验收**的 REX-801 界面契约（删掉 `#research-vocabulary`、移走 `#research-list` 里的
存储不可用句、并引用了已删除的 `esc()` ⇒ show() 抛错 ⇒ 控件全 disabled），CI 失败两个既有浏览器用例；
**我自己的形状测试没抓住**（stub 每次返回新对象 ⇒ 页面身份检查不过 ⇒ show() 未执行）。
发现方式：本地直接跑被验收的 `tests/rex801-research-ui.test.mjs` + 真实浏览器调试脚本打印 `pageerror: esc is not defined`。
修复：词汇披露归位、存储句两处都写（告警 + 列表）、恢复 esc；**S8 容器改为 memoise 节点**使渲染路径真的执行并可断言
后置条件，新增突变 N8 复现该回归 —— 现在 **8 处突变全部变红**。最终 head e07e1cb：CI run 37549643362 两 job 全绿；
本地 rex807 8/8、rex801 研究界面 3/3、相邻 web 套件绿。
```

## 2026-10-07 增量 1（组件范围：分层视图模型 + 守卫，当时尚未接线）

```text
现状实测（baseline 12e3d3b）：apps/web/research.js 是扁平技术面板（manifest JSON textarea + 仅验证/登记 +
原样 JSON 打印）—— 能用，但要读标识符与完整配置；没有分层、没有用户语言摘要、raw id 直接进主标签。
增量 1 交付 apps/web/research-surface.js（**纯视图模型**）把四个暴露等级变成**数据**：
  DIRECT_CONTROL（创建/开始/停止/重放/导出，默认展开）· ADVANCED_CONTROL（故障注入在折叠的危险区且**必须确认**，
  确认语要求输入 campaign id）· OBSERVABLE（运行/进度/指标/排除项，用户语言）· INTERNAL_ONLY（不进 UI）。
两条规则写进模型而不是指望渲染层：**重要的不许藏**（存储不可用/坏记录/排除项/未测量指标/未结清运行都成为
visible alert 并带原因）；**标识符折叠但不删除**（完整 manifest/运行记录进 collapsed 技术层；本视图未归位的
payload 字段列为 unmapped 并写明，网关新增字段因此可见而不是消失）。
测试 tests/rex807-surface.test.mjs 7 项，逐条对应工作书「必须验证」；**7 处源码突变全部被抓住**并按字节还原。
未完成：**尚未接线**（research.js 仍渲染旧面板）、Advanced/Technical 交互细节、Android 观察面。
详细记录见 reports/REX-807/DEVELOPMENT_REPORT.md。
```


---

[English reading translation / 完整英文阅读说明](en/REX-807-research-control-surface-and-progressive-disclosure.md)
