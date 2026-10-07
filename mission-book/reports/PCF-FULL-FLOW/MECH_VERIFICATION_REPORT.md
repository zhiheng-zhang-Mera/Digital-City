# PCF 完整流异机验证报告 / PCF complete-flow opposite-host verification — Mech-DS

[English](en/MECH_VERIFICATION_REPORT.md) · [对侧提交包](SINGLE_BATCH_HANDOFF.md)

```text
VERIFICATION MODE   SINGLE_BATCH_OPPOSITE_HOST_VERIFICATION（整条流一次接收，不分拆逐任务）
SOURCE              utopia 998440c7772cc032d012b457c2a59cd1059826c0
                    branch pcf/full-flow-alien-pending-verification-20261007（draft PR #42）
VERIFIED BY         Mech-DS —— 第二作者 / SECOND AUTHOR（COMPUTERNAME MEGA-REP，role Mech-DS，opposite physical host）
                    Alien-codex —— 第一作者 / FIRST AUTHOR（提交方，MERA-ALIANWARE）
VERDICT             **CANDIDATE VERIFIED AS A DEVELOPMENT CANDIDATE —— NOT programme completion, NOT main-merge ready**
                    （与提交方自己的申报一致：`programme_complete=false`、`ready_for_physical_handoff=false`、
                     `new_completed_workbooks=0`。本报告**不**把任何任务书升级为已验收。）
PHYSICAL ACCEPTANCE 仍为 NOT_RUN —— 本轮的实体证据只覆盖**本机真实 CPU 执行**与**本机产品面**，
                    真实跨机授权/传输、provider、手机 worker、完整重启/SLO/研究矩阵**均未取得**
MERGED              **不合并**：PCF 全系列 `merge_authority=false`；main 未推进
```

## 1. 我实际做了什么（可复跑，证据逐文件留档）

```text
① 独立目录取候选：D:\utopia-pcf-verify，detached 于精确 SHA 998440c，**全过程 git status 干净**
   （含验证结束时；源码树状态作为证据文件留档：pcf-mech-source-tree-status.log，0 字节 = 干净）
② 冻结依赖：corepack pnpm install --frozen-lockfile + --dir city 两处，exit 0
③ 我自己的探针（**不是复用提交方的断言**），各跑两遍，全部一致：
     服务层 16/16（两次）· 网关层 15/15（两次）
④ 提交方的组合用例：node --test --test-concurrency=2 tests/pcf*.test.mjs → 164 tests / 161 pass / 2 fail / 1 skip
⑤ 全量回归：tests/*.test.mjs → 1635 / 1632 pass / 2 fail / 1 skip（同样两条）
⑥ 真实本机 CPU pilot：node scripts/pcf-full-local-pilot.mjs → exit 0
⑦ 提交方冻结的 study 配置在本机复跑 → 6/6 完成、replay 校验通过、源码 CLEAN_EXACT_SHA
⑧ exact-head CI 四项（push/PR/V0.2/Linux 组件/linkage）独立查得 success
```

**工具摆放本身就是一次纠错（记录）**：我最初把探针放在候选树内的 `.runtime/mech-verify/`，候选自己的
`PCF-700 D4` 守卫立刻变红并点名 `.runtime/mech-verify/probe.mjs` —— 它是对的：**声明路径之外不得 import
fabric**。我把探针移到树外 `D:\pcf-mech-verify-tools` 后，D4 恢复绿色，测试回到 161/2。**仪器不得扰动被测物**；
这条若被我"顺手改测试"掩盖，就会变成一次假的通过。

## 2. 我能独立确认的（不是转述提交方的话）

```text
A. **真实 CPU 执行**：pilot 报告声明 evidenceClass=ACTUAL_LOCAL_CPU、softwareSha 等于被测 SHA、
   两个应用（cpu-sort / cpu-sum）各自真实子进程完成；workspace 内 3 个不同 PID（服务探针 V12 亦独立验证
   「进程各不相同，不是伪造或复用」）。**不是 fixture 恒真回调**。
B. **canonical 终态与回执**：Task → COMPLETED、Action → SUCCEEDED 且带 resultRef.digest（V5）。
   （提交方自己记录过一处勘误：早期 pilot 的 Task 误用 SUCCEEDED，后续源码已修正；本机复跑看到的是 COMPLETED，
   与其勘误一致。）
C. **结果按 digest 消费**：collect 返回 delivered=true / consumed=false；**必须**用确切 digest acknowledge
   才转为 consumed=true（V6/V7）；错误 digest 被拒（V8：CONSUMPTION_DIGEST）。
D. **幂等**：同 key 同载荷 → 返回原任务 replayed=true；同 key 不同载荷 → IDEMPOTENCY_CONFLICT（V9/V10）。
E. **调用者边界**：parentSessionId 非自身 → CALLER_BINDING 且**不产生任何任务**（V3/V3b）；
   网关层同一边界以 403 PCF_CALLER_BINDING 拒绝（G10/G11/G11b）；node 凭据与匿名均为 401（G12/G13）。
F. **默认姿态是只读**：未显式批准时投影 state=NOT_CONFIGURED、controls.enabled=false，提交被拒（G1–G3）。
   批准后投影如实写 reason=OPPOSITE_HOST_ACCEPTANCE_PENDING、agentConsumed=NOT_OBSERVED（G4/G4b）——
   它**没有**把"本机跑通"说成"已验收"。
G. **跨机可复现性（本轮最强的一条独立证据）**：用提交方冻结的 study 配置在本机复跑，
   两次运行**输出 digest 完全相同**：
       cpu-sort 重复 3 次均 a691bb1faeabd476… · cpu-sum 重复 3 次均 7c5ae92b6d4c08c1…
   且与**对侧记录的同名 digest 逐字节一致**（对侧 report：cpu-sort a691bb1f…、cpu-sum 7c5ae92b…）。
   即：**同一冻结 SHA 上，两台实体主机独立执行得到相同结果工件**，而 6 次执行的 PID 各不相同
   （本机 6/6 不同、对侧 6/6 不同）⇒ 结果相同**不是**缓存或复用进程所致。
   同时如实记录差异：本机耗时约 199.6ms/次，对侧约 1136.6ms/次（硬件不同，DESCRIPTIVE_ONLY，不构成结论）。
H. **快照完整性守卫真的会拒绝**：我误留一个未跟踪文件时，study 直接以
   `INFRASTRUCTURE_STOP:STUDY_SOURCE_DIRTY` 拒绝运行并把 dirtyFiles 列出来；清干净后 state=CLEAN_EXACT_SHA。
   这是"宁可拒绝也不在脏树上出结论"的实证。
I. **文档/双语闸门**：candidate 树上 `node scripts/check-bilingual.mjs` 三个根 PAIR_STATUS = SYNCHRONIZED。
```

## 3. 两条**未通过**的用例：已定位到仪器，不是产品（含我如何证明）

```text
现象：tests/pcf716-deployment.test.mjs 的两条用例失败，且**只在涉及 PowerShell 的那两条**：
   ① 716 PowerShell opt-out never reads missing config or creates candidate
   ② 716 review real ancestor junction cannot redirect candidate metadata writes
根因（实测）：这两条用 spawnSync('pwsh', …)，即 **PowerShell 7**；**本机根本没有 pwsh**
   （Get-Command pwsh 为空；无 C:\Program Files\PowerShell\7；只有 5.1.26100.9444）。
   于是 result.status=null、result.stderr=undefined ⇒ 断言失败。**这是验证主机环境差，不是候选缺陷。**
我没有停在"环境问题"四个字上，而是**直接验证产品行为**（PowerShell 5.1，脚本本身只用 5.1 兼容的 cmdlet）：
   · opt-out 路径：exit=0，stdout 为 {"state":"REFUSED","reason":"EXPLICIT_OPT_IN_REQUIRED","automaticInstall":false}
   · 祖先 junction 路径：exit=1，抛 REPARSE_POINT_FORBIDDEN，**且候选清单未被写入**（manifestCreated=False）
   证据：pcf-mech-powershell51-probe.log / .ps1
与提交方记录的**差异**（这是本报告要求的"逐项引用真实证据"）：
   提交方：164 tests / 163 pass / 0 fail / 1 skip
   本机：  164 tests / 161 pass / 2 fail / 1 skip（全量 1635/1632/2/1）
   差值恰好就是上面两条 pwsh 用例 ⇒ 可解释、可复现、与产品行为无关。
   建议（非阻断）：用例改用可解析的 PowerShell 探测（优先 pwsh，回落 powershell.exe）并断言两者之一，
   否则任何没有 PowerShell 7 的主机都会看到这两条红。
```

## 4. 唯一的 skip，以及我**不能**代为证明的事

```text
skip（1 条，原因由用例自己写明）：`718 portable fixed worker uses real POSIX process lifecycle on Linux CI`
   # SKIP No Linux runtime on this host; Linux CI component evidence is separate from physical acceptance
本机实测：`wsl.exe` 存在但**没有安装任何发行版**（wsl --status 明确要求 wsl --install）⇒ **本机无法做实体 Linux 验收**。
提交方把 Linux 结论交给云端 CI 的独立 job，这一点在同一个 skip 理由里也写明了，属如实分类。
```

```text
以下**不因本轮而升级为 PASS**（与提交方 known_acceptance_gaps 一致，并逐条独立确认其未达成）：
· 真实 Mech↔Alien 传输、已认证 worker grant、部署绑定 —— 未取得（本机 pilot 是 NO_REMOTE_EXECUTION）
· 真实 Codex/DeepSeek 工程执行、受支持的 resume 与进程树停止证明 —— 未取得
· 手机 worker 注册/安装/三面回端 —— 未取得（可选面，默认不安装）
· 完整重启/故障/前台 SLO 矩阵与正式跨机 REX campaign —— 未取得
· 许可模型运行时与独立 HA 基座 —— 本机不具备（GPU 观测到 NVIDIA RTX 5060 / driver 591.59，
  但**驱动观测 ≠ GPU 执行**，且候选自身把 runtimeVersion/energyJoules 记为 null 而非编造）
· 远端流式/DAG 组合与完整工程权限清单 —— 需集成验证
```

主机事实（供对侧比对）：Windows / Node v24.14.0 / 24 核 / GPU NVIDIA GeForce RTX 5060 Laptop GPU, driver 591.59, 8151 MiB。

## 5. 第二作者登记 / Second-author registration

```text
本验证包由**两位作者**共同构成，身份与责任边界如下：
  第一作者 Alien-codex —— 提交方：候选实现、冻结的本地证据、覆盖矩阵与交接协议
  第二作者 Mech-DS     —— 验证方（本报告）：独立复现、独立探针、差异定位、边界与 NOT_RUN 分类
登记落点（三处）：
  ① 本报告标题与 frontmatter（VERIFIED BY，含 host/role）
  ② intermediate-logs/2026-10-07-mech-verification-998440c/INDEX.json 的 `verified_by` 数组
     （AUTHOR 与 VERIFIER 两条，附 host 与职责说明）
  ③ 本目录 README.md 的验证状态行
规则遵守：**不合并、不释放 marker、不改写提交方历史证据、不改写任何任务书的 review/acceptance 事实**；
本报告只**新增**"第二作者已独立验证该开发候选"这一事实。
```

## 6. 结论

```text
作为一个**开发候选**：ACCEPTED AS VERIFIED CANDIDATE。
  理由：真实 CPU 执行、canonical 终态、digest 消费、幂等、调用者边界、默认只读姿态、
  **两台实体主机同 SHA 同结果工件（digest 逐字节一致且 PID 全不同）**，以及候选对
  脏源码/未批准配置/越权调用者一律 fail-closed。
作为一个**可合并或已完成的 PCF 全系列**：NOT ESTABLISHED，且候选自己也未如此申报。
  6 条已知缺口全部仍为未取得；实体验收（跨机授权与传输、provider、手机构建、重启/SLO 矩阵）为 NOT_RUN。
两条红：定位为**验证主机缺 PowerShell 7**，产品行为已在 5.1 上实证正确；已给出非阻断修法建议。
```
