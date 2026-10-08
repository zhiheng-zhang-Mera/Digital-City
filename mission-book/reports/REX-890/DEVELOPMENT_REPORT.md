# REX-890 — development report / 开发报告

```text
host        Mech (role Mech-DS)     branch  feat/city-owner-remote-operation
head        314326007dce6e328792053936ce4c3a80c3b1e2      CI  run 37720240214 · success
baseline    17271f04829877ee56668221afeda5fbd35f66e8      = merge-base(HEAD, origin/main) = 依赖并集的尖端
date        2026-10-08
```

开发侧**已收口**（`development_complete: true`）。**复检侧未开始**：本报告里所有"实测"都是**本机彩排**，
不是对侧的裁决。§3 禁止自审，所以 `REVIEW_REPORT.md` 由对侧写，本机不写。

## 1. 工作书要的东西，各自在哪 / What the workbook asked for, and where it is

```text
① multi-device study（8 要素）
   multi-device execution   6 次重复逐条落在两台真实设备（dev-544adda1… / dev-1428bce5… 交替）
                            **设备身份如实写明**：dev-544adda1… = Mega-rep（本机，PRIMARY，即城市 hostDeviceId）；
                            dev-1428bce5… = **Alien**（MEMBER，**对侧那台主机**）。所以"两台真实机器"里第二台是
                            **对侧机器**，不是本机的第二个进程 —— 这是 TWO_HOST_MESH 的定义，但它同时意味着：
                            对侧机器**执行过**这些任务，而**尚未**做过独立复现（这两件事不同，别混为一谈）。
   repetitions              计划 6 / 计入 6 / 实测 6
   routing/handoff decision 每条重复的放置都点名执行设备
   one injected fault       fault-c22b857f-…，并实测定向性：被注入设备 claim→503，另一台→200
   recovery                 recoveryTimeMs = 901（读自城市）
   one replay               COMPLETED，在 dev-1428bce5 上真实执行
   one ablation             COMPLETED，**且消融真的改变了放置**（来源 run dev-1428bce5 → 消融后 dev-544adda1）
   artifact export          包 artifact-544adda1-…-41-campaigns（41 campaigns / 205 runs / 205 measured）
   未测                     fault detectionTimeMs = null，typed NOT_MEASURED（该故障拒绝认领而不是心跳）

② 独立复现的**输入**必须能独立拿到（不能靠手工递送）
   包随分支进仓 evidence/raw/rex890-studies/2026-10-08-B/artifact/（13 文件，含 checksums.json）
   包**自带**它所指的 trace 记录：trace-coverage.json listed 243 / captured 243
   包外独立清单 MANIFEST.sha256（13 条，放包外以免改动包自身的文件集合）＋ README 写明来源与两层校验

③ 可复现的不只是结论，还有**产生结论的仪器**
   scripts/rex890-dev-study.mjs 随分支进仓：参数化（--city/--out/--config/--checkout/--repetitions），
   凭据取自 --config 文件或 CITY_TOKEN（不再取自任何一台机器的绝对路径），
   软件身份**观测自检出**且观测不到就具名拒绝，故意跳过记 NOT_RUN 而不是失败，任何结局都留下记录

④ 工作书点名的最终素材
   reports/REX-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md（§6B 逐项：计数 / 缺陷分类 / 复检专用发现 /
   可复现性 delta / 未建立项 / 论文候选方向）
```

## 2. 本机实测（**彩排**，不是对侧结论）/ Measured here (a rehearsal, NOT the verdict)

在**干净检出、零安装**的 `3143260` 上，对着**当前**城市跑对侧那条命令：

```text
packageIntegrity        VERIFIED（12 文件；包外清单再覆盖到 13 文件）
rebuilt                 205 run 引用，重建自 41 份回执（包声明 205）
四项指标                completion_time_ms 6630 / failure_rate 0 / duplicate 0 / convergence_missing 0 —— 全部 agrees
canonical task 指针     214/214 仍存在 · run→task join 205/205（0 broken）
trace 指针              243/243 可解析（城市保留窗口 0 · durable store 243 · 包内自带 243）
provenance              experiments 40 · events 2291 条指针
独立执行                独立 campaign COMPLETED，两台真实设备都执行了
软件身份                观测自检出 utopia@de7e91b…（tree clean，source OBSERVED_FROM_CHECKOUT）
结论                    0 inconsistencies · 0 evidenceGaps · reproductionComplete true · exit 0
原始报告                evidence/raw/rex890-studies/2026-10-08-B/DEV-REHEARSAL-opposite-host-reproduction.de7e91b.json
```

## 3. 开发过程中**自己踩到并修掉**的东西 / Defects found by running it

```text
· 仪器只能在本机跑：脚本原本不在仓内，且从一台机器的绝对路径读凭据 ⇒ 谁取了分支都跑不了这份 study。
· 故意跳过被算成失败：城市里有排队作业时，定向性探针**故意不跑**（claim 会偷走那件活），
  结果被记成 FAIL，study 因此假报 20/21。现在记 NOT_RUN，并且点名。
· 回放源 run 靠种子抛硬币：消融把放置固定到第一个 worker，所以来源 run 若本来就在那台设备上就**证明不了**
  这个机制；第一版取"第一条已测 run"，重跑时曾给出 source=ablation=同一台，study 假报 18/20。
  现在刻意挑一条能被该机制移动的记录 run，并把选了哪条、为什么写进结果。
· manifest 里的软件身份是**记住的**（写死 185d043e…）而不是观测的 ⇒ 与复现工具同一类缺陷，一并改成观测。
· 实验 id 只用日期 ⇒ 同一天无法重跑（城市答 409 IMMUTABLE_MANIFEST，它拒得对）。
· 记录只在最后一步写 ⇒ 中途停下磁盘上什么都没有；关控制面后立刻 process.exit() 在 Windows
  触发 libuv 原生断言（0xC0000409，不是报告）。
· 文档自己指错：§7 的复现命令指向**旧包**（trace 已失效），却在下面两段写期望 exit 0 —— 指令与结论矛盾。
```

**这些都不是"产品缺陷"，是仪器与文档缺陷**，逐条都在 utopia 的提交信息里带了实测依据。

## 4. 明显**不**声称的事 / Explicitly not claimed

- **对侧的实体独立复现还没有发生。** 上面所有数字都是本机（开发主机）的彩排，包括 `exit 0` 那次。
  对侧的结论只能由对侧宣布。
- **NOT_MEASURED 不是 0**：27 项指标里 23 项未测，各带原因；本报告也不主张它们可测。
- **城市已经变了**：城市现在 50 份 campaign 回执、有界回执窗口截断了最旧 1 份，所以**现在重新导出会
  exit 1**（`RECEIPT_WINDOW_TRUNCATED`，导出器拒绝产出它无法完整支撑的包）。按**包**复现不受影响
  （包指向的 41 份仍可读）。这正是"包必须随分支走、不能靠现场重新导出"的实证。
- **跨机通道只在两台真实机器之间跑过一部分**：独立复现里的独立 campaign 确实落在两台真实设备上；
  但"主城 Owner 直接操作子城节点"这条通道**没有**在两台**不同物理主机**之间验证过（能力只在本机节点上跑通），
  见 RESEARCH_MATERIAL_SYNTHESIS §6B.4。**补充实测（2026-10-08，仪器与结果都在仓内且可重跑）**：
  remote-operation **21/21**（声明式派发、真在点名节点上执行、`shell:false`、收据被城市复核且
  `acceptanceAuthority=false`、把 `;` 当一个 argv 元素、上界**具名拒绝**、超时真杀、输出按声明截断、审计行带 cwd/argv）·
  agent-job 凭据 **9/9** · 消耗回执 **8/8** · **owner 边界 12/12**（两条 owner 读面各测：错 token / 无凭据 /
  **node token** 全 401，未认证派发不建任何东西）；另有一份**只读预检** `readiness-check.mjs`（7/7，复现前跑，
  结果默认写系统临时目录以免弄脏检出）。但那些仍限于**同一台物理主机**，"一台主机上的 owner 操作另一台主机"
  **仍未建立**；member **会话**的拒绝也仍只在套件里跑。
  自那次测试之后又修了两个产品缺陷（**凭据可进作业记录**、**通道开关活不过重启**），并把城市**重启到已验证代码**
  —— 细节在能力登记的 known_gaps 与 RESEARCH_MATERIAL_SYNTHESIS §6B.2。

## 5. final gate / The final gate

```text
① 对侧独立 reproduction 成功                       ——  未发生
② exact-head CI green                              ——  ✅ 3143260 run 37720240214 success
③ 用户 exposure gate PASS（CAP-CITY-REMOTE-OPERATION-001 与 CAP-CITY-AGENT-JOB-001 由 Owner 亲自审阅）
                                                   ——  未发生（两份登记都写着"没有独立评审"）

⇒ RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE **未释放**；REX-890 **未收口**；merge_authority 保持 false。
```

## 6. 变更历史 / Change history

```text
2026-10-08  首版。开发侧收口在 3143260（CI run 37720240214 success）；
            基线 17271f04 用 merge-base 实测（不是假设）；复检侧未开始，故 review_* 全为 null/false。
```
