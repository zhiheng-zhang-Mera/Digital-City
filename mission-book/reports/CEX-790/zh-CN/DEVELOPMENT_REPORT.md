# CEX-790 — 开发报告（后端 → Web／Android 最终入口审计）

> 阅读译本 / Reading translation：本文件只供阅读，不是第二份权威工作书／状态。原身份、元数据、命令和证据值在代码围栏保留；不新增验收。

原身份记录：工作书 CEX-790、开发主机 Mech（COMPUTERNAME MEGA-REP）、角色 Mech-DS；锚点模式为领取时依赖 SHA 联合，证据头为联合分支上的清单与矩阵。终端标记未由开发释放，见第6节。

```text
WORKBOOK            CEX-790 Backend → Web/Android 最终入口审计与冻结
DEVELOPMENT HOST    Mech (COMPUTERNAME MEGA-REP), role Mech-DS
ANCHOR MODE         DEPENDENCY_SHA_UNION_AT_CLAIM
UNION BASELINE      5c7d46dcbf1b01259b5edaf574b620714beb40b7
EVIDENCE HEAD       04ecb7dd22ffd7296e00320b63681f7d9729181d  (inventory + matrix on the union branch)
BRANCH              cex/CEX-790-mech-final-audit
CLAIM EVIDENCE      mission-book/reports/CEX-790/CLAIM_RECORD.md
TERMINAL MARKER     CAPABILITY_ENTRY_BASELINE_AUDITED — NOT released by development (see §6)
```

## 1. 审计开始前必须构造的内容

工作书锚定 CEX-701 … CEX-705 依赖 SHA 联合，并记录 `baseline_blocker: DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE`。本主机执行的对侧主机评审已释放全部五依赖标记，因此阻塞原因消失，但**联合不存在**。五个已接受头一次 octopus 合并失败：

```text
ERROR: content conflict in apps/android/.../MainActivity.kt
fatal: merge with strategy octopus failed
```

五任务并行开发同一文件。故使用四次顺序合并构造联合，每个冲突保留双方行为，再验证为可工作基线：

```text
five task suites                     12 / 12 pass
join/pairing/enrollment/gateway     154 / 154 pass
scripts/check-bilingual.mjs         docs / evidence / data-records SYNCHRONIZED
:app:testDebugUnitTest :app:assembleDebug   BUILD SUCCESSFUL — 18 suites / 97 tests / 0 failures
```

中文对应：五任务套件12／12通过，join／pairing／enrollment／gateway 154／154通过；双语脚本 docs／evidence／data-records SYNCHRONIZED；Android 单测与 debug 构建 BUILD SUCCESSFUL，18套件／97测试／0失败。完整构造记录、逐项解决及联合不作断言范围见 [CLAIM_RECORD.md](./CLAIM_RECORD.md)。

## 2. 审计：十个来源、145项

`utopia:evidence/raw/mission-book/CEX-790/capability-inventory.json` 是机器清单；`utopia:evidence/raw/mission-book/CEX-790/CAPABILITY_ENTRY_INVENTORY.md` 是人类矩阵和审定例外。工作书指定十个来源按如下方式读取：

```text
1  Gateway user-facing routes        parsed the dispatcher in services/dev-gateway/server.mjs   48
2  Action routes / operations        the operation catalog in services/dev-gateway/actions.mjs  9
3  Ask targets                       the same catalog the ask/targets route serves (no second copy)
4  Room catalog                      read from the same catalog module as the Room operations
5  capability registry               every record under the Digital-City capability-registry/records/  11
6  Web clickable entry               data-page / data-terminal / data-scheduler-action / data-goto / button ids  41
7  Android clickable entry           nav lists, page branches, @Composable …Panel definitions  32
8  Settings / recovery lifecycle     the device, pairing and join routes plus the Settings/recovery panels
9  scheduler user actions            ACTION_WIRING in apps/web/scheduler.js   4
10 existing registry records/backfill the same 11 records, plus the two index files reconciled in §4
                                                                                       TOTAL 145
```

中文对应：1 Gateway用户路由来自server.mjs分派器，48；2 Action路由／操作来自actions.mjs操作目录，9；3 Ask目标使用ask/targets服务的同一目录，不建第二副本；4 Room目录与Room操作共用目录模块；5 Registry读取Digital-City控制平面records下每条记录，11；6 Web可点击入口来自data-page／data-terminal／data-scheduler-action／data-goto／按钮ID，41；7 Android入口来自导航列表、页面分支、Composable Panel，32；8 Settings／恢复生命周期包含设备、配对、加入路由及对应面板；9 调度用户动作来自scheduler.js ACTION_WIRING，4；10 既有Registry／回填使用同11记录及第4节两个对账索引。合计145。

审定后分类：

```text
EXPOSED               109
EXPOSED_ADVANCED        1
INTERNAL_PROTOCOL      24
CURRENT_ENTRY_GAP       8
PARITY_GAP              3
```

EXPOSED 109，EXPOSED_ADVANCED 1，INTERNAL_PROTOCOL 24，CURRENT_ENTRY_GAP 8，PARITY_GAP 3。**没有用户可见后端能力未分类。**

## 3. 人工审定例外：审计实际输出

自动规则生成候选而非裁决。十一项缺口候选各有原因／类型，评审可攻击具体行而非分类器：

```text
REGISTRY_GAP      5  GET /api/v0/capabilities, GET /api/v0/capabilities/:id,
                     POST /api/v0/capabilities/:id/invoke, GET /api/v0/capability-invocations,
                     GET /api/v0/capability-invocations/:id
                     The Web Services page and the Android 能力服务 panel both list and invoke capabilities, so the
                     surface is user-reachable, but NO record named the bridge behind it. This is a registry gap, not
                     a UI gap, and it is closed in §4.

PARITY_GAP        2  POST /api/v0/host/join and GET /api/v0/host/join/status
                     A browser may switch this host between PRIMARY and MEMBER; the Android surface has no
                     equivalent. The route is deliberately restricted to a local host-owner request, so this is
                     recorded as a real first-class-surface parity gap rather than as a missing entry.

FALSE_POSITIVE    3  POST /api/v0/tasks/:id/cancel, POST /api/v0/tasks/:id/provider-choice, page Actions
                     The rules could not see them: the Web reaches cancel and provider-choice through the
                     ACTION_WIRING table rather than through path-shaped strings, and the Android nav names the same
                     page "Action" singular. All three are EXPOSED on both surfaces.

BY_DESIGN         1  CONFIRM
                     ACTION_WIRING declares kind=unwired with no route. The CEX-702 review accepted this as the
                     honest-unwired control; it must not be wired until a canonical route with proven-identical
                     semantics exists.
```

中文对应：REGISTRY_GAP五条能力桥路由；Web Services和Android能力服务均可列表／调用，用户可达，但无记录命名背后桥接，这是注册表缺口而非UI缺口，第4节关闭。PARITY_GAP两条host/join路由：浏览器可切换PRIMARY／MEMBER，Android无对应；路由刻意限定本地主机Owner请求，记为真实一级界面对等缺口而非缺入口。FALSE_POSITIVE三项：cancel、provider-choice、Actions页；Web经ACTION_WIRING而非路径字符串到达，Android同页名为单数Action，三者均双界面EXPOSED。BY_DESIGN一项CONFIRM：kind=unwired无路由，702评审接受诚实未接线控件，在存在已证明同语义规范路由前不得接线。

构造时发现并修复两个分类器缺陷，因其会无声伪造审计而记录：起初从实现仓库而非控制平面读取Registry，使11已注册能力看似未注册；路由模式丢失 `/api/v0/` 前缀，使模式路由无法识别。前两个联合集成草稿解决冲突时也丢失函数，被逐任务符号检查抓住。

## 4. Registry 回填与对账

```text
CAP-WORKER-POOL-AGENT-001   REALITY MISMATCH FOUND: the record still declared
                            CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW while WBC-603 is COMPLETE, review_complete true,
                            and the terminal marker WORKER_POOL_AGENT_SEAM_ACCEPTED was released by the opposite-host
                            review on this host. Reconciled to FORMAL_REVIEW_RECONCILED with the review outcome named.
                            This is precisely the CAPABILITY_REGISTRY_REALITY_MISMATCH the workbook's gate forbids.

CAP-CAPABILITY-BRIDGE-001   NEW RECORD for the surface the audit found unnamed: the capability catalogue and its
                            invocation path (GET /capabilities, GET /capabilities/:id,
                            POST /capabilities/:id/invoke, GET /capability-invocations,
                            GET /capability-invocations/:id). Exposure class DIRECT_CONTROL on both first-class
                            surfaces (Web Advanced > Services, Android More > 能力服务), implementation COMPLETE,
                            backend wiring VERIFIED, reachability PARTIAL, intent NOT_TESTED, last verified SHA bound
                            to the union baseline. It is a record of a surface that already existed, not a new feature.

CAPABILITY_INDEX.yaml       regenerated from the records: 12 records with exposure class, reconciliation state and the
                            exact verified SHA each; legacy_backfill_status moved to RECONCILED_AT_FINAL_AUDIT.
SURFACE_INDEX.yaml          POPULATED — it previously carried empty surface lists for every platform despite nine
                            records declaring surfaces. Each platform now lists its capability, location and nesting.
CAPABILITY_EXPOSURE_MATRIX  refreshed in BOTH languages as a populated 12-row table; it was previously an empty
                            BOOTSTRAP VIEW template with no data rows at all.
```

中文对应：CAP-WORKER-POOL-AGENT-001仍称CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW，但WBC-603已COMPLETE、review_complete true，终端WORKER_POOL_AGENT_SEAM_ACCEPTED已由本机对侧主机评审释放，故按具名评审结果对账为FORMAL_REVIEW_RECONCILED；这是门禁禁止的CAPABILITY_REGISTRY_REALITY_MISMATCH。CAP-CAPABILITY-BRIDGE-001为未命名的既有目录／调用界面创建新记录，双一级界面DIRECT_CONTROL（Web Advanced > Services，Android More > 能力服务），实现COMPLETE、后端接线VERIFIED、可达性PARTIAL、意图NOT_TESTED，最后验证SHA绑定联合基线；不是新功能。CAPABILITY_INDEX.yaml由12记录重建，含暴露分类、对账状态、精确验证SHA，legacy_backfill_status转RECONCILED_AT_FINAL_AUDIT。SURFACE_INDEX.yaml先前所有平台列表为空，即使九记录声明界面；现各平台列能力／位置／嵌套。双语CAPABILITY_EXPOSURE_MATRIX从无数据BOOTSTRAP VIEW模板刷新为12行表。

## 5. 论文材料

[PAPER_MATERIAL_INDEX.md](./PAPER_MATERIAL_INDEX.md)记录审计材料，工作书要求的项目组综合见 [PAPER_MATERIAL_SYNTHESIS.md](../../CEX-PROGRAMME/zh-CN/PAPER_MATERIAL_SYNTHESIS.md)。

## 6. 开发不作的主张

- **终端标记未释放。** `CAPABILITY_ENTRY_BASELINE_AUDITED` 是评审结果。Formal Review要求评审者**独立从代码**重建清单、比较两清单并分类全部差异。开发不能自证此差异，本主机也不是自身工作的合格对侧主机。
- **无意图验证。** 回填保留 `intent_validation_status: NOT_TESTED`；审计未驱动用户界面，从代码／契约读取清单。
- **基线为联合而非 `main`。** 五依赖头均未合并，无工作书授合并权威。联合只为合法锚点发布为分支。
- **CEX-705 F1继承而未修复。** `members.mjs`将离线节点投影为连接，联合带该问题，审计分类为真实缺陷（`CAP-CITY-MEMBERS-NATIVE-001`，呈现真值缺陷而非入口缺口）。
- **对等缺口不是缺陷。** 主机角色切换仅浏览器可用，因工作书要求声明对等而记录缺口，不意味着所有平台必须相等。

语言配对 / Language pair: [English](../DEVELOPMENT_REPORT.md) · [中文](./DEVELOPMENT_REPORT.md)
