# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../REVIEW_REPORT_ALIEN.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# UXI-301 — 独立 Review 报告（Alien 主机）

```text
REVIEWER = Alien      DEVELOPER = Mech      (different physical hosts, §3)
REVIEWED HEAD = 1c516b6e3af24b640e3875f0ca384d47e31af6bf
CI            = 36972345821  success, both jobs, bound to exactly this head
VERDICT       = REVIEW_COMPLETE — PASS, with ONE REQUIRED RECORD CORRECTION (F-1)
```

记录释义：Alien reviewer、Mech developer，§3不同物理主机；精确被审SHA与两jobs成功CI如原块。裁定REVIEW_COMPLETE—PASS，附一项必需记录纠正F-1。

## 0. §7 精确 head 核对：在领取之前完成

```text
recorded development_head_sha         1c516b6
actual head of uxi/UXI-301-…          1c516b6        MATCH
gh run 36972345821 headSha            1c516b6        MATCH
gh run 36972345821 headBranch         uxi/UXI-301-scheduler-status-into-product-ui
gh run 36972345821 conclusion         success  (gateway-web success | android success)
```

被审head就是测试head。Alien在2026-10-02T08:08:47Z领取；Owner裁定Alien有Review资格，确认Mech发现过度声明后Alien记录的纠正：Alien尝试后 **撤回**，从未开发本任务。

## 1. 独立性（§3：非联署、非重跑作者tests）

以下每项均由Alien在 **1c516b6新worktree** 执行，不是从Mech报告读取。未独立执行项列在§5边界，不暗示通过。

## 2. 独立执行的内容与结果

| 检查 | 方法 | 结果 |
|---|---|---|
| Repository suite | 新worktree执行 node --test "tests/*.test.mjs" | **1012 tests、1010 pass、2 fail** |
| 两失败 | 具名、不计入通过 | document bytes flow through real readers… 与 Bridge Road extraction preserves all six … digests，未触baseline已存在的 **CORRUPT_INPUT** pair |
| Android unit tests | gradlew testDebugUnitTest --offline，直接读JUnit XML | **80 tests、0failures、0skipped**，含SchedulerPresentationTest **10/10** |
| RS-290 contract不可变 | git diff --stat 1a5bc0e HEAD -- contracts/rs-presentation-contract-v1 | **EMPTY**，字节一致 |
| 消费而非重定义contract | 读取services/dev-gateway/presentation.mjs:26 import | import {presentTerm, termRef, projectStatus} from '../../contracts/rs-presentation-contract-v1/presentation.mjs' |

Suite较冻结baseline增加 **46 tests**，无新失败；Android增加自身JVM覆盖，重要之处是JVM test无法import contract。

## 3. 工作书两不变量：验证为结构性保证

**(a)“不可用provider可见但不可选择”已执行且对抗测试。** Web renderer对被拒provider **完全不提供控件**（scheduler.js:59-66，data-selectable="false"）；无backend route的action为disabled aria-disabled="true"，带data-scheduler-unwired marker（75-79），而非静默无作用button。Android结构上同样：SchedulerPanel.kt:98-100只render **文本，无clickable、无button**，注释记录有意如此，防止未来忘guard后变interactive。

最强证据是 **对抗性而非约定性** 测试：web-scheduler-adapter.test.mjs:138输入 **说谎DTO**，USER_DISABLED却selectable:true，断言adapter强制selectable:false且interactive:false（150-152）。同时注入未声明DEVICE_OFFLINE_PLACEHOLDER，仅声明provider存活。Producer不能凭自称available使不可用provider可点击。

**(b)“默认不泄漏raw scheduler fields”。** Gateway通过冻结contract投影，tests断言暴露 **映射term**、raw source word仍可区分（gateway-presentation.test.mjs:79-88，assert.notEqual(healthyRef.ref.word,healthyRef.term)）。测试备注记录Mech **自身** 早先错误：断言ref.word===ref.term，与RS-290 F1同一混淆，作者在review前发现。

## 4. 跨语言parity guard真实有效

android-scheduler-parity.test.mjs解析 **Kotlin源表**，与contract **双向** 比较；不能import contract的模块只有此方式发现漂移。我专项检查programme反复出现的无法失败断言，没有该问题：

- 第46行rows.length===TERMS.length使regex静默未匹配任何内容时 **失败**，不会空洞通过。
- severity同时对TERM_CLASS和Web adapter severity table核验，两界面不会强调程度不一致。
- 包含negative control：“parity guard真的会在drift时失败”。

**F-2低严重度：通过项也适用同标准。** 该负控在手工arrays上执行assert.notDeepEqual，而非guard自身parsing，只证明比较operator有效，不证明真实Kotlin编辑会被guard发现。Guard存活实际依赖上面rows.length断言，足以工作。未来值得更强mutation control，非defect、非gate item。

## 5. 边界：本Review未独立核验什么

按§5纪律明确记录、不暗示通过：

1. **Mech真实Web E2E（scripts/uxi301-web-e2e.mjs，报告5/5）与Android设备验收（8/8）未由我重跑。** 依赖发布证据加CI绑定，是 **继承** 验证而非独立验证，不可加强解读。
2. **remote-handoff seam** 按Owner ruling延后（§6），所以 **完全未验证**，明确NOT MET。
3. 未独立推导两locale用户文案语气；验证文案存在、非空、非raw token、使用i18n keys，en.js/zh-CN.js各56行。

## 6. F-1 — 必需记录纠正：deferral有效，但声明理由实测为假

Owner按此基础接受seam延后：

> “City只有一种task type，近乎立即完成，不能保持节点占用，busy device+free alternate条件无法持续。”

**Alien测量此前提，它不成立。** 针对冻结City，gateway加真实reference node执行，probe逐字发布为PROBE_uxi301_premise.ps1：

```text
WAIT             220ms:RUNNING -> 6310ms:COMPLETED     RUNNING occupancy 6090ms
CHECKPOINT_DEMO  214ms:QUEUED -> 1088ms:RUNNING -> 3483ms:COMPLETED   occupancy 2395ms
```

- City声明 **五种** task types（actions.mjs:356），POST /api/v0/tasks原样存b.type（server.mjs:139-141），所以五种都 **API可请求**。原块两种在同运行经此创建。
- WAIT占用节点 **6090 ms**，六秒真实busy且work assigned/in-flight（runner.mjs:7-8），正是ruling称不能持续的条件，且比routing query需求大三个数量级。

**改变与不改变什么。** **不** 推翻ruling：Owner处置权威，接受延后、按§10作为integration seam承载、明确 **NOT MET**，我接受。错误仅是记录中 **为何未能drive** 的理由。此假前提易被继承：下一主机将读到“不可能”，而测量说“尚未尝试WAIT task”。只要求纠正记录一句，不重开处置。

为避免被误读为批评勤勉，记录顺序：Alien在 **17:52** 发布测量；Mech携ruling的release于 **18:06** commit，此前自16:11空闲。

## 7. 逐项工作书completion gate

| gate item | 裁定 | 根据 |
|---|---|---|
| 主要scheduler states有用户语言 | **MET** | 三Kotlin copy tables+web i18n，对contract parity guard，tests断言copy非token |
| 不可用provider可见但不可选 | **MET** | 两界面结构保证§3a+说谎DTO对抗test |
| switch/no-switch均真实可执行 | **MET** | 真user intent驱动switch offer与decline往返；decline记录task、200 |
| remote handoff result返回当前界面 | **NOT MET—Owner ruling延后** | §10 integration seam，不计coverage |
| Web/Android真实验收+hosted CI绿 | **MET**，继承验证见§5.1 | 精确head的36972345821两jobs绿，设备证据发布 |
| 默认无raw scheduler字段泄漏 | **MET** | gateway经contract投影，raw word可与mapped term区分 |

## 8. 裁定

**REVIEW_COMPLETE—PASS**；**F-1为handoff seam延后理由的必需记录纠正**，不变处置；**F-2为低严重度测试强度观察**。唯一未MET gate依据 **明确Owner ruling** 未MET并如实记录，正是§10要求deferred与passed的区别。

Alien未修任何内容，这是有意决定：实质项仅记录纠正，reviewer编辑作者workbook fields会成为被审artifact共同作者。此处提交给Mech或Owner应用。
