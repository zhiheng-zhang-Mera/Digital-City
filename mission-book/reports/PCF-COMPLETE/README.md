# PCF 系列完整补全（PCF-700..728）/ PCF series completion, on a dedicated cloud branch

```text
分支 / branch        pcf/PCF-series-complete-mech-20261007
起点 / base          pcf/full-flow-alien-pending-verification-20261007 @ 998440c（对侧整条流的候选）
本机角色 / role      Mech-DS（development + verification）
云端 / cloud         已推送（origin 上存在该分支）
授权边界 / bounds    不采购/不付费、不装系统服务、不改运行 profile、不启用远端执行、不伪造外部前提
```

## 1. 先量清楚：候选到底缺什么（不猜）

原作者候选的覆盖矩阵自称 `programme_complete: false`、`ready_for_physical_handoff: false`，29 本里
只有 PCF-700 是历史已验收、PCF-701 是修复候选，其余多为 `*_COMPONENT_CANDIDATE` / `PREREQUISITE_*`。
我另做了一次**机读普查**（`pcf-census.mjs`）：把 29 本工作书里**点名要求的接口**逐条与代码实际导出对照。

```text
结果：33 个点名接口中，候选**已有 14 个**，**缺 19 个**。
但抽查后必须区分"真缺"与"换了名字"：
  · 真缺（全树 grep 无任何实现）：
      PCF-702 placementProposal · PCF-703 openBoundedStream · PCF-707 toResearchEvent
      PCF-708 normalizeWorkloadEnvelope / ExecutionAttempt · PCF-709 ArtifactRef
      PCF-710 providerManifest · PCF-712 fenceEpoch · PCF-723 shadowDecision / safetyShield
  · 换了名字/在别处（census 的假阳性，已核对）：
      PCF-728 submitRemoteJob/inspectRemoteJob/cancelRemoteJob/collectRemoteResult →
      实际存在于 `services/personal-compute-fabric/engineering-tools.mjs`
      PCF-712 reconcile → `supervisor.mjs` 的 reconcileExecution；PCF-715 renderFabricPanel → `apps/web/pcf-panel.js`
      PCF-716 deployment/rollback → `deployment.mjs` 的 createDeploymentController
      PCF-724 adapter → 抽象概念，实际是 workload/capsule 组合
```

⇒ 补全工作的正确对象是**功能缺口**而非"缺文件"，且**不得重复实现已有能力**。

### 1.1 第二次普查：工作书点名的**验收命令**（本轮新增发现）

接口普查之后我又做了一次"验收面"普查：把每本工作书里点名的 `tests/pcfNNN-*.test.mjs` 与磁盘对照。

```text
29 本工作书里 **23 本**点名的验收测试文件**不存在**：
  702 703 704 705 706 707 708 710 711 712 713 714 715 717 718 721 722 723 724 725 726 727 728
另 5 个点名模块也不存在：711 checkpoints.mjs、717 model-residency.mjs、722 controller-continuity.mjs、
  723 adaptive-policy.mjs、724 application-adapter.mjs（其中 711/723/724 的功能已在 checkpoint.mjs /
  shadow-placement.mjs / adapters.mjs 里，717/722 是外部硬前提阻塞）。
```

判断逻辑（记录在案，因为这决定了我做什么）：

```text
· 工作书原文用的是"**候选**落点"（`新增候选 …/tests/pcf702-placement.test.mjs`），所以文件路径本身是建议而非合同，
  功能在别处实现**不构成**验收失败 —— 不能据此把 23 本判为"未完成"。
· 但工作书的验收段写的是「运行 `node --test tests/pcfNNN-….test.mjs` 并由异机复核」。异机复核者按书执行的第一条命令
  就是这条；文件不存在，复核者拿到的是"命令失败"，而不是"证据"。
· 因此我把**点名文件补齐为真实验收面**（不是改名绕过、不是转发到别处），并且只在"该文件确实覆盖了工作书自己列出的
  反例清单"时才写。已补：702(9) 703(8) 707(9) 710(8) 725(7)。
· 剩余 18 本按同一标准继续，绝不写"只断言已有实现、不覆盖工作书反例"的空壳测试。
```

## 2. 本轮已完成（分支上八个增量）

```text
增量 1（7c4ece4）PCF-708 版本化 workload envelope 与 execution attempt —— 新模块 workload-envelope.mjs
  强制项：envelopeVersion 精确匹配（未知版本 typed 拒绝）、task/action/origin/parent/target/app 身份、
  executor 是**provider 合同**（providerRef/version/manifestRef，绝非命令行）、输入输出 schema、能力/输入引用/write scope、
  平台声明、四类 QoS、deadline 必须配**显式 miss policy**、独立 retry 安全能力、dataScope、**携带但不评估**的 consent、
  必须有已核实 handle 的特权请求；资源按种类声明且**单位必填**、与发布表冲突即拒绝；嵌套/数组/键长/载荷在读取前就有界，
  循环载荷被拒而不是无限遍历。
  两处**我自己的测试抓出来的缺陷**：① providerRef 曾接受任意 256 字符串 ⇒ `sh -c "rm -rf /"` 能装作 provider，
  已改为标识符校验；② 旧任务探测误把 `inputSchema/outputSchema`（legacy 也有）当作 envelope 字段 ⇒ 每个旧任务都被判成已扩展。
  测试 tests/pcf708-workload-envelope.test.mjs 9 项。

增量 2（0a9146b）PCF-709 工件引用契约与续传游标 —— 新模块 artifact-reference.mjs
  核心性质：**digest 相符是完整性，不是权限**。`verifyArtifactBytes(reference,bytes)` 刻意**不接收任何 caller 上下文**，
  因此不可能被误当作授权判定（测试直接断言它的形参个数）；`authorizeRead` 从不参考 digest。
  引用含 opaque id/digest/size/schema/owner/dataScope/副本声明/有效期/retention；**路径形状的 id 被拒**
  （store 自己通过授权适配器解析路径，引用里带路径等于让调用方指定"去哪里读"）；可用性由**已声明的副本事实**推出，
  绝不从一次失败读取去猜，且每个状态都带原因；从存储/异机读回的引用必须**重新校验**，因为解析不等于信任。
  四处**测试抓出的缺陷**：① 重新校验已归一化的引用时，其 `locationRef: null` 触发我自己的 `undefined`-only 检查
  —— 不只是崩溃，它**掩盖了真实拒绝原因**（被撤销的工件被报成"格式非法"）；② 拒绝原因优先级：撤销/过期先于 scope 判定；
  ③ 续传游标无条件要求 partial 标记，拒绝了没有进度可描述的**新游标**，现改为"一旦有进度就必须显式声明"；
  ④ 该标记的形参默认 `false`，使**调用方"未提供"与"显式 false"无法区分** —— 抹掉区别的默认值正是规则失效的方式。
  `canResume` 只在 digest 与引用契约版本**同时**匹配时续传，拒绝过期引用与"声称字节数超过工件"的游标，且游标不能后退。
  测试 tests/pcf709-artifact-reference.test.mjs 8 项。

增量 3（f4af0f3）PCF-712 fence epoch 与 start/report/commit 闸门 —— 新模块 fence.mjs
  fence **不是单纯的计数器**，而是 {holderRef, bootRef, attemptRef, epoch}，四字段各自比对、各有拒绝码。
  计数器式检查会漏掉的那一种情况被直接断言：**epoch 正确但 holder 不同** → FENCE_WRONG_HOLDER；
  **holder 与 epoch 正确但 boot 不同** → FENCE_WRONG_BOOT（重启后复用同名 holder 不是同一 worker）。
  holder 变化只推进一步 epoch；同一 holder+boot 重新注册**不烧掉**一个 epoch（否则一次什么都没改的重试会让在途回报失效）。
  持久化在动作**之前**：存储抛错则该动作**不执行**（测试断言动作从未被调用）。
  事件按 seq 幂等，重复不产生第二个结果，**丢失的 seq 作为显式 gap 保留到被 reconcile**，不被抹平。
  crash 对账**绝不从超时或沉默推断已停止**：未被观察为存活的 worker → STOP_NOT_PROVEN 交 PCF-705；
  副作用未知 → UNCERTAIN_SIDE_EFFECT 交 PCF-705；存活 → STILL_RUNNING；租约过期单独报；没有任何 finding 无证据却声称已证明停止。
  一处测试抓出的缺陷：**空 claim 曾被报成"attempt 不对"**（报错了问题），现要求 claim 完整后再比较（FENCE_CLAIM_INCOMPLETE）。
  测试 tests/pcf712-fencing.test.mjs 7 项。

增量 4（bc5d038）PCF-723 安全盾、影子决策、留出集评估与回退阶梯 —— 新模块 shadow-placement.mjs
  学习器**不得**改 trust/consent/strict target/review 门/费用授权：受保护字段被写入即 PROPOSED change 被整体拒绝，
  且拒绝后仍然给出确定性策略的决定（不是抛异常打断调用方 —— 一处测试抓出的缺陷：畸形 proposal 曾以异常逃逸）。
  置信度地板 0.6、成本上限 0（本工程不授权任何花费）与输入范围越界各自有码；评估**拒绝在自己训练过的数据上测试**
  （留出集与训练集重叠 → REFUSED）；准入阶梯 offline→shadow→owner-approved canary→reversible 不可跳级，
  canary 需要 Owner 批准而 rollback 不需要。测试 tests/pcf723-shadow-placement.test.mjs 8 项。

增量 5（07b7385）PCF-703 有界、信用流控、可续传的流 —— 新模块 bounded-stream.mjs
  工作书点名的四条性质**逐条被反证式断言**（只在不越界时正确的实现不算证据）：
  ① bytes 与 items **双上限**，越界 → STREAM_BACKPRESSURE（不是静默缓冲）；② 端到端信用：接收方没给 credit 就
  STREAM_NO_CREDIT，且**信用是累加的**（慢消费者可以一次一个窗口补授）；③ 取消终态且幂等（STREAM_CANCELLED，
  与 STREAM_CLOSED 分开）；④ 重连**带着缺口走**：resume() 报出丢失字节并把输出标成 PARTIAL_WITH_KNOWN_GAP，
  gap 未被 reconcile 之前不假装完整。
  两处**测试抓出的真实缺陷**（已在实现里修，而不是改测试期望）：
  ① `chooseTransport()` 在"未授权 offload"时无条件回答 LOCAL —— 即使调用方明说没有已获准的本地路径，
     等于承诺一个不存在的落点，正是工作书禁止的"静默改目的地"的反方向；现在每个拒绝理由都在**已声明的**本地路径或 REFUSED 之间收敛。
  ② `localAvailable` 曾默认 true —— "已获准"是不能默认的前提（本工程不允许伪造未验证前提）；现在未声明即 REFUSED，
     并新增 `localDeclared` 字段。
  一处**我的**测试期望错误被修正：信用累加，第二次授权后剩余 item 信用是 11 不是 7；测试改为显式断言累加语义。
  测试 tests/pcf703-bounded-stream.test.mjs 8 项。

增量 6（a8284a2）PCF-702 可行性优先、成本分解与可自解释的 placement proposal
  过滤**先于**排序：信任/授权/dataScope/strict target/平台/能力/freshness/isolation/硬资源 —— "最快的机器"因此不能
  赢下一个它无权运行的任务。`planPlacement()` 产出带版本号的 PlacementProposal：赢家、**全部可行候选及其排序键**、
  其余候选的**脱敏**拒绝原因、实际使用的排序规则、policy/state/observation refs 与有效期。
  拒绝码的分类学（工作书七条反例之一）：资源**缺测** → RESOURCE_UNKNOWN（remedy=REMEASURE_REQUIRED），
  资源**实测不足** → RESOURCE_INSUFFICIENT —— "缺 VRAM"既不是 0 也不是充足；成本有缺测分量 → COST_INCOMPLETE（带分量名）
  而不是笼统 COST_UNKNOWN；FIXED 排序**必须显式声明优先级**，未声明即 FIXED_PRIORITY_UNDECLARED，不再悄悄退回按设备名排。
  判断记录：**已声明的固定优先级是唯一能压过 local-first 默认的东西**（否则声明无法生效）；其余策略 local-first 仍优先。
  判断记录：proposal 的 `stateRef` 为 null 并附 `stateRefNote` —— placement 是纯函数、不拥有 canonical state，
  704 准入才是用 CAS 绑定状态的那一步；这里**不发明**一个没读过的引用。
  成本模型按工作书五分量（queue/inputTransfer/coldStart/execution/resultReturn）分解，各自保留区间与来源；
  缺测分量被报出而**不代入 0**；本仓无任何校准证据 ⇒ modelVersion=`conservative-uncalibrated-v1`、
  `accuracyClaim: 'NONE'`、排序界按声明的保守因子放宽（未校准估计不得靠一个没人测过的点估计赢过已校准的）。
  拒绝记录只有 {deviceId, code, remedy}，测试断言伪装成 secret 的 scope/路径/token 不出现在 proposal 任何位置。
  三处缺陷（两处实现、一处测试）：① queueMs 是**单个观测等待**而非两点区间，我的区间解析器把它判成缺测 ⇒
     每个真实本机执行都变成 COST_INCOMPLETE（721 study 套件抓到），现按退化区间 [wait, wait] 报告；
  ② `provider?.id ?? null` 破坏了 704 准入的身份比较（PROPOSAL_BINDING），因为 null ≠ undefined；
  ③ 我第一版把 FIXED 的 local-first 优先级搞错（见上，属设计判断，已按上述规则定稿）。
  测试 tests/pcf702-placement.test.mjs 9 项（工作书七条反例全覆盖）。

增量 7（a6e92ad）PCF-707 REX 追踪 sidecar：证据等级是**标记**而非**主张**
  `toResearchEvent(pcfReceipt, context)` 记录工作书点名的全部字段：task/action/attempt/reservation 身份、
  policy 与 runtime 版本、观测 refs、决定理由、排队/搬运/执行/恢复四阶段、Owner intervention、缺失与丢弃计数。
  三条被**强制**而非写在文档里的性质：
  ① ACTUAL_EXECUTION 必须携带真实 attempt 才有的身份（正 epoch + 64 位 hex 输入 digest），否则
     RESEARCH_EVENT_NOT_ACTUAL —— 仿真不能披着"实跑"标签；RECORDED_TRACE 必须点名它录制自哪一次 run；
     只有 ACTUAL 可以声称 MEASURED_LOCALLY，其余等级 performanceClaim=NONE 并注明"同一 trace 上的决策差异不是真实性能收益"。
  ② 与 REX schema 的边界**被报告而不是隐藏**：投影对既有封闭 schema 合法（测试用真实 normalizer 证明），
     而该 schema 没有键位承载的东西（attempt/reservation/boot/runtime refs、阶段耗时、证据等级、丢弃计数）逐条列进
     `notRepresentable`；缺测阶段是 NOT_OBSERVED + null，不是编造的 0。
  ③ sidecar **有界降级**：collector 关闭、缓冲满、collector 抛错都只让 captureReceipt 返回 false 并计数，
     绝不把异常抛回执行路径；敏感字段**按键名脱敏**且只报告键名（排序后），调用方永远看不到值被删之前的原值。
  `replayDecisions()` 在**隔离且已授权**的 scope 之外拒绝运行，不触碰生产 policy 对象；决策 digest 让两个策略的差异
  **可被第三方复算**而不是被断言；结果是 dispatchAllowed=false、performanceClaim=NONE。
  `measureInstrumentationOverhead()` 报本机一次循环的实测开销，标注 THIS_HOST_THIS_LOOP_ONLY、generalisable=false。
  一处测试抓出的缺陷：redactedKeys 曾按对象插入序，两个本该相同的 event 不可比 —— 现排序。
  测试 tests/pcf707-research-adapter.test.mjs 9 项；721 study 套件仍 10/10。

增量 8（81992e0）PCF-725 provider 合同与边界 + PCF-710 真实 CPU executor 与 attempt 入口
  725：`normalizeExecutionProvider()` 补齐工作书点名项（providerRef/version、supported workload schema、capabilities、
  platform、permission handles、argv schema、storage namespace、lifecycle、isolation enforcement、compatibility），
  并且**全面 fail-closed**：未知合同版本/未知字段/providerRef 非法/空能力表/畸形 lifecycle/倒置兼容区间各自有码；
  合同**不是第二个台账**（task/identity/credential 类字段按键名拒绝，且该判定**先于**泛化的未知字段判定，
  因为"这不是台账"是更有用的诊断）；**任意 shell/命令/路径字段按键名拒绝**（只接受 operation allowlist）；
  storage namespace 必须是相对有界命名空间（`..`、绝对路径、盘符、空格、超长都被拒）；
  ENFORCED 隔离声明必须有**另行核实**的边界证据，且**普通 Node 子进程被写成 NOT_A_SANDBOX、hardLimits 为空**。
  `describeExecutorBoundary()` 把硬/协作/UNKNOWN 三类**分开**（不是一个乐观等级），异平台核实的边界在本机不算硬；
  `lifecycleTransition()` 冻结 start/stop/disable/upgrade/rollback/依赖丢失/版本不匹配/crash 语义，
  **每条都点名实现归属**（710 进程控制、712 常驻、716 安装）并声明不影响其它 provider、不关闭 City；
  crash 只收敛到本 attempt、结论标为待核验、**绝不自动重启有副作用的工作**；`disableProvider()` 证明停用竞态
  不碰其它 provider 与 City；CONSUMER_MAPPING 覆盖 708/710/724/727/URA-002/003 且**不 import 任何消费者**，
  基础合同因此不可能反向依赖消费者。
  710：固定 CPU worker 现在由**经 725 校验的 manifest** 描述（操作 allowlist SORT/SUM、attempt-scratch namespace、
  协作式边界），`executeAttempt(envelope, reservation, controls)` 是工作书的 attempt 入口：reservation 的存在/活跃/过期/
  task-action/设备/boot 在**任何进程创建之前**检查，provider 由 envelope 的 manifest 引用解析而**不是**由 reservation 信任；
  未知 executor/版本不匹配/provider 未就绪/缺能力/缺 schema/隔离不可强制/allowlist 外操作/**多传的参数（含文件路径 ——
  worker 根本没有文件输入面）**/consent 过期或不匹配，各自 typed 拒绝；结果在**发布之前**校验（exit 0 + 可解析 + digest），
  非零退出、被杀子进程或不可解析载荷一律 FAILED 且 published=false；
  `executeCpu()` 现在把子进程放在**每次 attempt 独立的临时工作目录**并在结束后清理，相对写入不会落进 checkout ——
  但声明严格限于事实：`scratch.isolated` 指"独立 cwd"，**不是** OS 级沙箱，测试里也这么写；
  超时或取消后**实际观测**子进程 pid 消失，而不是假定"已停止"。
  两处缺陷：① 平台对象形式误用了只接受字符串数组的 `strings()`（每个真实 manifest 都 PROVIDER_PLATFORM_INVALID）；
  ② truth-duplication 拒绝曾被泛化的未知字段拒绝掩盖。
  测试 tests/pcf725-provider-boundaries.test.mjs 7 项、tests/pcf710-executor.test.mjs 8 项（两本工作书反例全覆盖）。
```

## 3. 后续顺序（按依赖与可实现性，不按编号硬爬）

```text
剩余按同一标准推进的点名验收文件（18 本）：
  704 准入/公平 · 705 恢复 · 706 策略/同意/数据边界 · 708(补齐点名文件) · 711 checkpoint ·
  712(补齐) · 713 干扰与 SLO · 714 origin 连续性 · 715 资源控制 UI · 718 Linux 合同 · 721 study 合同 ·
  723(补齐) · 724 workload pilots · 726 capsule · 727 工程连接器 · 728 origin-agent 桥
外部硬前提（保持 typed NOT_RUN，绝不冒充）：
  PCF-717 许可模型运行时、PCF-722 独立存储/fencing 基座、PCF-718 实体 Linux worker（本机无发行版）、
  PCF-719 手机 worker 安装、PCF-727 真实 Codex/DeepSeek 会话闭环、跨主机传输/授权
```

## 4. 不声称的事

```text
· 不声称"29 本全部完成"：本轮完成 8 个功能增量、补 5 个工作书点名验收文件；其余仍在推进。
· 不把作者候选已有的能力重复实现，也不改写对侧 998440c 的既有记录与已发布结论。
· 不把"点名文件不存在"说成"功能没做"，也不把"功能在别处"说成"验收已通过" —— 两者都按上面的判断逻辑分开记录。
· 任何被外部前提挡住的项目保持 typed NOT_RUN 并附证据来源；不伪造外部前提，不把 component 验收写成物理/异机验收。
· 不合并 main：该分支单独存在，等整系列补全后再按 REX/DGX/CHK 同样的异机验收口径交接。
```
