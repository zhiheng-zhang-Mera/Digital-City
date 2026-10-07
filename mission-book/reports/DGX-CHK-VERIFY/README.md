# DGX + CHK 系列异机验收与合并 / DGX and CHK series: opposite-host acceptance and merge

```text
验收方 / verifier     Mech-DS（COMPUTERNAME MEGA-REP，role Mech-DS）—— 对两条分支均为**合法对侧实体主机**
提交方 / author       Alien-GPT（MERA-ALIANWARE）
验收依据 / criteria   **Digital-City 原始工作书**：DGX-990 §必测场景 13 条；CHK-990 §必测 12 条
豁免 / waiver         Owner 明示**豁免旧版的分拆验收要求**：两条系列各按**整系列一次验收**，不逐本拆分
合并 / merge          已合并入 main：DGX 先、CHK 后，两次 --no-ff 合并提交
合并后 main / main    **a1bb0937defc29af686cb40f1a21340731d4d7a3**
```

## 1. 验收对象（精确头）

```text
DGX  Alien-GPT-DGX  e5a03dae02ca341d6d23565735e6cd6c3edc27d9  16 提交 / 43 文件（contracts/deliberative-governance-v2/*、governance 服务与网关路由、13 份 dgx 测试、验收矩阵与系列校验器）
CHK  Alien-GPT-CHK  9a646d6b894babd0fb316c0b4a0ba302bd7bca7d   3 提交 / 12 文件（city-self-health-check 模块、CLI、第二主机校验器、2 份测试）
两者都包含当前 main（cc79923），彼此**无共同改动文件**（实测），可无冲突堆叠。
```

## 2. 我做的独立验收（不是转述作者自己的测试）

```text
DGX
· 作者自带的系列校验器 `scripts/verify-dgx-series.mjs --second-host`：**PASS**
  （它以 OPPOSITE_PHYSICAL_HOST_REQUIRED 逻辑拒绝在作者本机运行，本机 Mega-rep 正是它要的第二主机）
  但它的 SERIES_EVIDENCE.json 自行申报 `formal_series_acceptance: NOT_RUN` ⇒ **裁决仍是我做的**。
· 我的独立对抗探针 **54/54 通过**，逐条覆盖 13 个必测场景，且每条安全属性都用**反向突变**验证：
  例如场景 13（Engineering 对侧 Formal Review 底线）被攻击十种方式——同主机、缺 reviewer host、
  符号化 review_sha("main")、review 与 candidate 头不一致、CI failure、formal_review 未 PASS、
  作者自审、reviewer 无 session、SHA 非 40 位——**全部按名字拒绝**（OPPOSITE_PHYSICAL_HOST_REQUIRED /
  REVIEW_HEAD_MISMATCH / CI_NOT_PASS_AT_HEAD / FORMAL_REVIEW_NOT_PASS / INDEPENDENT_REVIEWER_REQUIRED …）。
· 作者分支全量套件：1526 项 / 1523 通过 / 3 失败，**同样 3 项在未改动 base cc79923 上就失败**。
· exact-head CI：push 37579270778 **success**。

CHK
· 我的独立对抗探针 **30/30 通过**，逐条覆盖 CHK-990 的 12 条必测：
  自带受控夹具**故意放入一个被 git 跟踪的 .env 与一个含凭据的源文件**，验证「敏感路径从不读取」
  （.env 出现在 skipped 而非 evidence_manifest）与「报告不含明文凭据」；
  并用一个「PARKED 但生成进度仍称 enabled」的工作书验证它被报为 PARKED_ACTIVE_TRUTH 且**不进入 active 列表**。
· 作者分支全量套件：1471 项 / 1468 通过 / 3 失败，同样的 3 项既有失败。
· exact-head CI：push 37578970705 **success**。
```

**我明确不能替对侧做的事**：真实物理双机交付、`independent_review`（CHK 报告自己记 `NOT_RUN`）、
模型/HA 等外部前提，均保持未取得。CHK 报告自身也把 `freeze_outcome` 记为
`NOT_ACCEPTED_PENDING_WHOLE_SERIES_REVIEW`——**我没有把它改成已验收**，只是完成了它的异机验收。

## 3. 合并前后复核（合并后仍成立）

```text
合并前（各分支）   DGX 54/54、CHK 30/30；各自全量套件仅 3 项既有失败；各自 exact-head CI success
合并动作           DGX → main（--no-ff），随后 CHK → main（--no-ff）；两次均**无冲突**
合并后（a1bb093）  全量套件 **1526 项 / 1523 通过 / 3 失败**（仍只有那 3 项既有失败）
                   我的 DGX 探针 54/54、CHK 探针 30/30 **在合并后的树上重跑仍全通过**
                   check:docs 三个根 PAIR_STATUS = SYNCHRONIZED
                   main 分支 CI：linkage 37583516830 success；V0.2 checks push 37583516899 运行中（结论以 Actions 为准）
```

## 4. 我造成的探针错误（记录，不做美化）

```text
验收过程中我的探针自己错了 **7 次**，全部在记录里：
· DGX：release 用例少给了一名参与者的 review（契约要求**每个**参与者都要有 scoped review）→ 我误判为"未到达 PASS"；
  把 createAdjudication 当成一次性函数（它其实是 Pass A → 辩护 → Pass B 的协议对象）；
  claim 少了 identity/classification 字段；assignParticipant 的 request 少了 origin、candidate 少了
  readiness/facts_ref/roles；把"图节点无 canonical 引用"当成校验错误（实际在 **projection** 层通过
  CANONICAL_TASK_UNAVAILABLE / PROBLEM_GRAPH_RECONCILIATION 警告暴露，这是可辩护的设计：图是**计划**，
  节点可以先于其 canonical 任务存在）；字符串引号写错导致语法错误。
· CHK：误以为 appendCaseRevision 会**抛错**拒绝凭据（它其实是**脱敏**后照常记录，是更强的保证——明文从不落库）；
  reconcileBoss 的键是连字符 `BLG-001` 而非下划线；对 async 的 runHealthCheck 用同步 try/catch 捕拒绝（捕不到，
  加了 async 版本）。
这些都不是产品缺陷，是**我的仪器错误**；改正后全部通过，说明被测行为是对的。
```
