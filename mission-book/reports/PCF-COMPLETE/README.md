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

增量 9（d5209c7）PCF-703 **计划半**（自描述 DAG + 规范化 stage runner）+ PCF-716 宿主可移植性修复
  `compileExecutionPlan()` 增加 version 2：每个 stage 必须自述输入/输出 schema、资源与单位、权限 handle、副作用、
  deadline、checkpoint 能力（"可续传"必须带能力引用，与 708 同规则）、placement 策略与所需 executor；
  缺任一项按名拒绝，**未知 stage 字段也拒绝**（测试断言 `shellCommand` 与 `prompt` 都被拒 —— 这正是"不是让 LLM
  自动拆分任意程序"的机械保证）。version 1 旧计划仍可编译，但被**标注**为 LEGACY_V1_NOT_SELF_DESCRIBING 并列出每个
  stage 缺哪些声明，且**规范化 runner 拒绝执行它**：没声明资源与落点的 stage 不能进真机。
  `executeStages()` 是真 runner：每个 stage 经 709 发布输入并**读回校验 digest**、经 704 准入、claim attempt、
  经 710 执行、在 canonical task 上提交；规范身份（task/action/origin/session）每个 stage 完全相同，只有 attempt/epoch 变。
  **发现的真缺陷（不在我的代码里）**：canonical 合同每个 task 只有**一个终态**，因此两段流水线的第一段成功后 task 变
  COMPLETED，第二段再也无法准入（CANONICAL_TASK_NOT_EXECUTABLE）。两条绕路都是撒谎：提交 UNKNOWN 会给一个明明成功的
  stage 打上 SIDE_EFFECT_UNKNOWN，给每段建独立 task 则改变 canonical 归属。诚实修法是新增阶段进度原语：
  `admission.mjs` 的 `commitStageResult()` —— attempt 变 STAGED（确实跑完）、释放 reservation 让下一段可准入、
  task 回到 QUEUED 并追加已完成 stage，**task 身份一字不改**。这是 703 要求、704 面必须补的能力，按此记录而非隐藏。
  另修：新增的权限校验误用了裸标识符模式，拒绝了 provider 合同本来就在用的 handle 形状（`process:own-child`）。
  PCF-716：该工作书自己的两个测试在本机失败、且只在本机失败 —— 它们硬编码 `pwsh`(PowerShell 7)，而普通 Windows 工作站
  只有 Windows PowerShell 5.1，于是**检查从未真正运行**（spawnSync 返回 null status，断言拿 null stderr 去 match）。
  这是测试可移植性缺陷，不是产品缺陷：我手工验证两条行为在 5.1 下都真实成立（opt-out 打印 EXPLICIT_OPT_IN_REQUIRED
  且退出 0；junction 祖先被 REPARSE_POINT_FORBIDDEN 拒绝、退出 1、未写入任何文件）。测试改为**发现可用的 PowerShell 宿主**，
  两者都不存在时才 typed NOT_RUN skip。**断言一字未改**，两个测试现在真的在本机执行：12/12。

增量 10（f09129a）PCF-722 连续性/HA 合同 + PCF-717 模型常驻合同
  722 的常态就是"前提缺失"，所以模块的职责是 fail-closed 且 typed：先固定 failure model，RPO/RTO 记为**未验证目标**
  （调用方不能自报 verified：SLO_CANNOT_BE_SELF_VERIFIED，验证只能来自真实故障测试）；自动提升需要**独立于两个节点**且
  证据已核实的仲裁/lease 基座，没有就是 NO_PROVEN_SUBSTRATE + 人工可验证 fence 路径；分区不可能产生双 primary
  （无 quorum 拒绝、他人持有未过期 lease 拒绝、已记录 primary 未 fence 拒绝、重复提升报 DUPLICATE_PROMOTION 而不是第二个写者）；
  时钟偏差超过 lease 余量、副本落后超过声明的 RPO、controller 与 worker 同时故障各自有独立拒绝码；旧 leader 复活
  **按 epoch 而不是按信任**被 fence，过期期间写入被拒（STALE_EPOCH_WRITE_REFUSED）；staged handover 必须五步齐全、
  凭据只走 **handle**（裸 secret 直接拒绝而不是脱敏）、并区分计划维护/人工 fenced standby/自动 failover ——
  前两者一律 NOT_CLAIMED 且单独签收；AUTOMATIC_HA 标记只在**真实故障证据 + 单写者证明**下释放，文档评审/设计稿/仿真
  一律 BLOCKED 并报 DOCUMENT_REVIEW_IS_NOT_IMPLEMENTATION；缺基座时保持 NOT_RUN 且 coreV1Blocked=false（722 不得阻塞 CORE_V1）。
  717 本机没有许可模型运行时，所以不加载任何模型，但把常驻管理容易做错的每个判断都显式化：manifest 版本化且做兼容校验、
  工件经 709 引用契约校验、下载或付费 provider 必须有显式授权（**花费授权与授权本身是两件事**）；
  **声明需求与宿主观测分开**，观测源 UNSUPPORTED/UNKNOWN 一律 UNKNOWN（既不是 0 也不是充足）；admission 计算
  **已常驻 + 已预留**而不是数加速器个数；warm pool 有界、先逐空闲项、**拒绝驱逐有在途请求的模型**；OOM 是带 Owner attention
  的事件且 automaticRetry=false；KV 随所属 task 释放，跨 task 复用报 KV_CONTEXT_ISOLATION_VIOLATION；
  路由偏好 warm，但**绝不为了 cache hit 跨隐私门或费用门**。
  物理半边保持 typed NOT_RUN：真实许可模型运行时、真实加速器观测、真实故障切换基座都是本工程不具备的外部前提。

增量 11（0c39530）PCF-708 工作书点名验收文件 + 信封封闭字段集
  tests/pcf708-workload.test.mjs 是工作书点名的文件，逐条覆盖它的验收段：旧 task 往返保持身份与语义、缺扩展被**报告**而不是
  被静默升级；providerRef/handoffTargetRef **不被当作 strict target**；空/负/无限/单位冲突资源被拒而 0 仍是真实声明；
  未知枚举、负 deadline、缺 miss policy 被拒；**过去的 deadline 在有钟的地方拒绝**（信封本身刻意无钟，所以断言落在
  胶囊编译处）；四类 QoS 与五种 retry 安全能力逐一枚举，CHECKPOINT_RESUMABLE 必须带能力引用；载荷大小/嵌套深度/循环/
  非纯数据在读取前就有界；未来或缺失的 schema 版本被拒而不是被降级；ExecutionAttempt 继承信封身份而旧 epoch 的迟到回报被拒。
  另导出 `ENVELOPE_FIELDS`：信封是**封闭投影**，把这份字段表公布出来才让"Android control principal 不能被提升为 worker"
  这条从散文变成可测事实 —— 该字段根本不是信封能携带的字段。

增量 12（33bc3a8）+ 增量 13（20c94c7）15 个点名验收文件 + 它们暴露的**六个产品缺陷**（已修）
  子代理只写新测试文件、发现缺陷必须上报；六个缺陷由我复核后修在产品里，并把每个 skip 转成真断言：
  ①**PCF-715** `presentation.mjs` + `apps/web/pcf-panel.js`：canonical 的 `pcfAttention='SIDE_EFFECT_UNKNOWN'`
    （正是 `commitResult`/`persistFailure` 写的值）**完全没进投影**，面板在有未决任务时显示一切正常。
    现在投影带 `activeRisk`（数量/逐条 attention/`bubblesToOverview`），面板渲染它，平静时显式 `present:false`。
  ②**PCF-715**：部分 canonical 快照让 `buildFabricProjection` 抛裸 TypeError，整个 `/api/v0/pcf` 读取失败。
    现在报 `completeness:'PARTIAL'` 并**点名缺哪一半**为 unknown —— 关键区别是"读不到"永远不等于"空闲"。
  ③**PCF-704** `canonical-state-adapter.snapshot()` 把**自己产出的 state** 过 64 KiB 的**不可信入参**守卫，
    于是在 admission 允许的 256 条 reservation 深度上抛 PAYLOAD_LIMIT：观察者面读不到"队列已满"的状态。
    现在快照用 store 自己的**声明上限**（4 MiB，typed `SNAPSHOT_LIMIT`），而 state 因准入上限而天然有界。
  ④**PCF-714 line 48**：UNKNOWN 之后**终态提交可以覆盖它**，出现 task.state=CANCELLED 与 pcfAttention=SIDE_EFFECT_UNKNOWN
    并存的**两个互相矛盾的终态**（late cancel 伪称外部副作用已撤回）。现在 UNKNOWN 对**终态**提交是 sticky 的
    （`OUTCOME_UNKNOWN_REQUIRES_VERIFICATION`），只能由显式核验证据解除（705 的职责）。
    **我自己第一版把守卫写宽了**（连"重复上报 UNKNOWN"也拒），被 705 验收文件的重复恢复用例抓红，已收窄为只拦终态。
  ⑤**PCF-726 bullet 1**：capsule 现在携带 `independenceFloorRef`，未声明时显式 `NOT_DECLARED`；
    `independenceFloorOf`/`assertIndependenceFloor` 让"沉默不等于满足"可测，且**不发明**这一治理事实。
  ⑥**PCF-712 bullet 4** `fence.reconcileAfterRestart` 只读 `holderRef/bootRef`，而 canonical attempt 写的是 `holder/bootId`，
    于是把真实 canonical 记录喂进去会把**活着的 worker 报成 STOP_NOT_PROVEN**（恰恰在"不许猜"的路径上产生假阴性）。
    现在两种拼写都读，真正不可读的身份有独立 disposition `IDENTITY_UNREADABLE` 并交 705。
  全量套件：1874 项，除**既有的四项宿主相关失败**（theme-packages 负载下、三个 launcher/enrolment 探针）外无新增失败。
增量 14（6b69632）第二轮：把**最后五个可实现的缺口**全部补上，另加 715 概览补全
  ①**PCF-705 子任务2**：`planRecovery` 现在接收 retry budget 与数据位置输入 —— 每任务重试上限
    （`RETRY_BUDGET_EXHAUSTED` 带剩余数）、畸形预算报 `RETRY_BUDGET_INVALID` 而不是当成"无限"、未声明预算保持旧行为
    （不是"零预算"）、预算检查**先于**冷却（耗尽者要 attention 而不是等定时器）、目标设备够不到输入报
    `DATA_LOCATION_INCOMPATIBLE`。
  ②**PCF-705 子任务3**：新增 `migrationBenefit()` 给工作书点名的三项成本（传输/冷启动/丢弃工作）定价，并且**拒绝而不是假设**：
    缺分量报 `MIGRATION_COST_UNKNOWN`（列出缺哪个、不给总额）、收益盖不住全额报 `MIGRATION_BENEFIT_INSUFFICIENT`、
    盖住但落在迟滞余量内报 `MIGRATION_BENEFIT_BELOW_HYSTERESIS`（靠四舍五入取胜的搬迁正是两机来回抖动的成因）。
    `planRecovery` 会咨询它：换设备搬迁没有定价收益即拒绝，有则把算式带进 proposal；留在原设备不算搬迁。
  ③**PCF-706 验收"多请求竞争额度仍不越界"**：`assertPolicy` 必须保持无记忆的纯解析器（这正是两个并发请求都能拿满预算的原因），
    聚合半边现在是 `createAllowanceLedger()`：进程内单写者有界账本，拒绝会越界的声明（`ALLOWANCE_EXCEEDED` 带 would-be 总额）、
    同一 requestId 视为**同一笔**（不重复扣费，改金额报 `ALLOWANCE_CLAIM_CONFLICT`）、release 精确退款、
    零额度不许花钱，并**声明自己的作用域**（`SINGLE_PROCESS_SINGLE_WRITER`、`holdsTaskTruth:false`）以免被当成第二个权威。
  ④**PCF-704 rev2"至少保留一个foreground预算"**：调用方声明 `foregroundReserve` 时每项资源至少留 1 个单位
    （`FOREGROUND_RESERVE_MINIMUM`）、不得超过 app 配额（`FOREGROUND_RESERVE_EXCEEDS_QUOTA`）、不得为没有配额的资源声明
    （`FOREGROUND_RESERVE_UNAUTHORISED`）；BATCH/BACKGROUND 不得花掉预留部分（`FOREGROUND_RESERVE_HELD`），
    INTERACTIVE/SOFT_DEADLINE 仍然可以。**未声明的调用方逐字节不变**（保持 708 的 legacy 规则）——
    "声明才生效"这一取舍按判断记录在案，不冒充成普遍强制。
  ⑤**PCF-721 line 49 时钟偏差**：研究工件包新增 `clocks` 块 —— 每 trial 时间戳来自宿主墙钟、**时长来自进程单调钟**
    （墙钟跳变无法扭曲它，测试逐 trial 断言时长为实测非负数）、而单机无法测量的**跨机偏差**记为
    `NOT_MEASURED` + `SINGLE_HOST_HAS_NO_INDEPENDENT_REFERENCE` + 需要什么才能测，而不是留空。
  ⑥**PCF-715 line 45 概览补全**：投影新增 `queue`（预留/运行/排队/完成）、`stateFreshness`（canonical 版本、完整性、
    以及两个**无法从这些输入推导**的项**具名说明**：per-observation freshness 与 candidate rejection reasons）、
    `background`（backend/服务状态）与 `capabilityScope`。判断记录：per-task 的候选拒绝原因需要**持久化 placement proposal**
    （当前是每提交临时产生），per-observation freshness 需要观测快照 —— 这两项属数据模型新增而非显示修复，因此按"具名不可得"
    处理，不伪造字段。
  另有两处既有精确形状断言随之更新（`SIDE_EFFECT_OR_COMPATIBILITY_UNKNOWN` 现在额外携带 `retryClass` 与 `distinguisher`，
  让调用方看得出是两类原因中的哪一类），属于**加强可追溯性**而非放宽断言。
  验证：全量 1874 项 → 1868 通过、3 失败（**只剩既有的三个 launcher/enrolment 探针**）、3 skip（全部是外部前提 NOT_RUN）；
  theme-packages 与两个 REX web 套件在负载下会 flake，单独运行均通过。
```

### 2.2 子代理产出的点名验收文件与诚实缺口清单

704..728 的点名验收文件按同一标准并行生成（每个子代理只写**新文件**，禁止改 `services/` 或既有测试；发现产品缺陷
必须保留诚实断言并上报，不得为了让测试变绿而削弱断言）。子代理上报的产品缺陷由我复核后再动手修（见增量 12），
本轮把余下的可实现缺口全部补上（见增量 14）。最终**套件级 skip 只剩 3 项，全部是外部前提的 typed NOT_RUN**
（704/705 的双机样本、718 的实体 Linux runtime），没有任何 NOT_IMPLEMENTED 残留：

```text
历史缺口清单（第一轮结束时记录，第二轮已逐条关闭 —— 保留在此以显示判断链，不是当前状态）：
PCF-704 验收「queue full 显式披露」观察面：snapshot() 过 64 KiB 入参守卫导致 256 深度不可读。→ 增量 12 修复。
PCF-704 rev2「至少保留一个 foreground 预算」：当时判断"预留会与每一个既有配额测试交互，需要单独一轮"。
  → 增量 14 实现为**声明式**预留（声明则至少 1 个单位；未声明逐字节不变），因此既有测试不受影响，判断被更好的做法取代。
PCF-705 子任务2「retry budget / 数据位置」与子任务3「搬迁收益必须覆盖三项成本」。→ 增量 14 实现。
PCF-706 验收「多请求竞争额度仍不越界」。→ 增量 14 实现为进程内单写者有界账本，并显式声明其作用域。
PCF-714 line 48 反例面：UNKNOWN 之后第二次 commit 会覆盖终态。→ 增量 12 修复。
PCF-715 line 47：canonical risk 不进投影、部分快照抛 TypeError。→ 增量 12 修复。
PCF-715 line 45：概览显示项不全。→ 增量 14 补 queue/stateFreshness/background/capabilityScope；
  其中 per-observation freshness 与 per-task 候选拒绝原因**无法从 canonical 快照推导**（前者要观测快照、后者要持久化
  placement proposal），按"具名不可得"记录，不伪造字段 —— 这是**数据模型边界**，不是显示遗漏。
PCF-726 bullet 1「现行 independence floor 的引用」。→ 增量 12 修复。
PCF-721 line 49 时钟偏差字段。→ 增量 14 修复（recorded as NOT_MEASURED + 原因 + 需要什么）。
PCF-721/724 的 glasses/health 输入面：本树**根本没有该输入面**，保持 typed NOT_RUN/UNSUPPORTED，不造一个假接口来"通过"。
```

子代理另报告三处非工作书违反的观察（记录在案，不当作缺陷夸大）：
`applySafetyShield` 对带限定符的 gate 码（`SHIELD_LOW_CONFIDENCE:0.1`）报 `SCORER_FAILED`（更粗但更安全，回退顺序仍正确）；
`validateResultEnvelope` 只做摘要形状校验，工件存在性在读取时（709 store）强制——"伪造工件"在交付时被发现；
`toResearchEvent` 校验 inputDigest 但不把它带进事件 refs（试验级记录在 research-study 里带了）。

## 3. 现状与后续顺序（按依赖与可实现性，不按编号硬爬）

```text
本轮结束时的点名验收文件状态（29 本工作书）：
  已存在且已复核：700 701 709 716（+本机可移植性修复）719 720
  本轮补齐并复核：702 703 704 705 706 707 708 710 711 712 713 714 715 717 718 721 722 723 724 725 726 727 728
  ⇒ 29 本全部有工作书点名的验收面；6 本的物理/外部半边仍未验收（下文 NOT_RUN）。

仍然**未实现**：**无**。第一轮记录的 5 项（704 foreground 预留、705 retry budget 与搬迁收益、706 额度聚合账本、
  721 clock-skew 字段）已在增量 14 全部实现，对应 skip 已转成真断言；唯一的例外不是一个可实现缺口：
  PCF-721/724 的 glasses/health 输入面在本树**不存在**（不是"没实现"，而是没有该输入路径），因此保持
  typed NOT_RUN/UNSUPPORTED，并明确拒绝为它造一个假接口。

外部硬前提（保持 typed NOT_RUN，绝不冒充；且"本机没有"本身被断言，前提出现时测试会自己变红）：
  PCF-717 真实许可模型运行时与加速器观测 · PCF-722 独立存储/fencing 基座（合同已实现并 fail-closed）
  PCF-718 实体 Linux worker（本机无发行版，wsl 零发行版）· PCF-719 手机 worker 安装
  PCF-727/728 真实 Codex/DeepSeek 会话闭环 · 所有跨主机/双机测量（704 705 713 714 718 721 722 728）
```

## 4. 不声称的事

```text
· 不声称"29 本全部完成"：29 本都有可运行的工作书点名验收面、且不再有 NOT_IMPLEMENTED 残留，但 6 本的物理/外部半边是
  NOT_RUN（需要第二台实体主机、真实 Linux、手机、许可模型运行时或真实 Codex/DeepSeek 会话）。
· 不声称高可用、不声称性能提升、不声称跨机协同：PCF-722 的 AUTOMATIC_HA 只有真实故障+单写者证据才释放；
  721 的所有 SLO 是待验证目标；727/728 的远端闭环是 NOT_RUN。
· 不把"点名文件不存在"说成"功能没做"，也不把"功能在别处"说成"验收已通过" —— 两者分开记录（见 1.1）。
· 不把子代理的测试当作我的判断：15 个文件由我逐份复核（断言必须对应工作书反例、refusal 必须按码断言、
  skip 必须带行号），六个缺陷是我复核后修在产品里、再把 skip 转成真断言的。
· 不把"声明式预留"说成"普遍强制"：704 的 foreground 预留只在调用方声明时生效（未声明保持 legacy 逐字节不变），
  这一取舍在增量 14 里明确记录。
· 不合并 main：该分支单独存在，等整系列补全并交接异机验收。
```

## 5. 本轮不声称的事项（存档）

```text
· 不把作者候选已有的能力重复实现，也不改写对侧 998440c 的既有记录与已发布结论。
· 任何被外部前提挡住的项目保持 typed NOT_RUN 并附证据来源；不伪造外部前提，不把 component 验收写成物理/异机验收。
· 分支按 REX/DGX/CHK 同样的异机验收口径交接：异机复核者按工作书逐条运行点名测试即可复现本轮全部结论。
```
