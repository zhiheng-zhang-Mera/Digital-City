# MON-902 — 开发报告

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态记录；历史、失败及未知边界保留，元数据和证据仅以代码围栏引用。

```text
WORKBOOK           mission-book/finished/completed-2026-10-06/city-work-monitor-dashboard/MON-902-overview-graph-and-node-path-inspector.md
ROLE               Development (Mech host, COMPUTERNAME MEGA-REP, role Mech-DS)
IMPLEMENTATION     zhiheng-zhang-Mera/utopia
CONTROL REPO       zhiheng-zhang-Mera/Digital-City
BRANCH             mon/MON-902-mech-overview-graph
ANCHOR MODE        DEPENDENCY_SHA_UNION_AT_CLAIM
BASELINE (UNION)   7eb38f1b930dfe6cc13dab0e17dedee467b1254b   (= MON-901 accepted head; contains main d3262ce2)
DEVELOPMENT HEAD   3a88e23f91924576178973ef46c620b20ffa2aaf   (the head moved three times: browser UI evidence, the
                                                              flake repair in section 8, and the latest-main
                                                              integration that makes the branch conflict-free)
PULL REQUEST       zhiheng-zhang-Mera/utopia#27
WORKTREE           D:/utopia-mon902
DEVELOPMENT HOST   Mech (MEGA-REP)
REVIEW HOST        Alien  — NOT STARTED (opposite physical host required)
MERGE AUTHORITY    false
```

以上为原始身份及版本记录：开发由 Mech 主机 MEGA-REP 执行，审核须由相反物理主机 Alien 执行；当时审核未开始，没有合并权限。开发头三次移动分别用于浏览器 UI 证据、第8节不稳定测量修复以及消除冲突的最新 main 集成。

## 1. 领取与基线

在 Digital-City `7cd5d32` 原子领取，记录于 `reports/MON-902/CLAIM_RECORD.md`。MON-902 声明 `baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM`、`dependencies: ["MON-901"]`，但 `dependency_source_shas` 为空；§2A.5 禁止猜填。MON-901 开发和审核共用唯一接受头 `7eb38f1b930dfe6cc13dab0e17dedee467b1254b`，合入符合条件的基线 `d3262ce2dd81e51a53e39e6f9add8dee650a7682` 时发生快进：MON-901 是 main 的后代，因此联合基线就是该头并已包含 main。没有冲突，也没有虚构合并。

在任何 MON-902 产品变更前运行依赖冒烟 `node --test tests/mon901-observation.test.mjs`，结果8/8。首次因新工作树没有 node_modules 而报 `ERR_MODULE_NOT_FOUND: 'ws'`；`npm ci` 后相同命令通过。这是仪器／环境失败，不是依赖缺陷。

## 2. 实现内容

```text
services/dev-gateway/monitor-graph.mjs     NEW  pure buildGraph(view, options)
services/dev-gateway/server.mjs                 route GET /api/v0/monitor/graph?edges=&collapse=
apps/web/monitor-graph.js                  NEW  monitorOverview / monitorNodePanel / monitorPathPanel / monitorTechnical
apps/web/index.html                             nav entry `City monitor` (data-page="Monitor")
apps/web/app.js                                 page wiring: fetch, keyed reload, deliberate selection, stable redraw
apps/web/i18n/{en,zh-CN}.js                     89 monitor keys in both packs, risk codes translated exactly once
docs/CITY_WORK_MONITOR_GRAPH.md            NEW  bilingual usage summary
docs/plans/MON-902-overview-graph-plan.md  NEW  the design that was followed
evidence/raw/mission-book/MON-902/development-receipt.json  NEW
```

上表逐项列出纯图构造器、真实 Gateway 图路由、Web 总图／节点／路径／技术面板、主导航入口、获取与键控重载、两种语言各89个监视键、双语用法文档、实际遵循的计划以及开发收据。

### 2.1 投影仍只是投影

`buildGraph` 是单个观测视图的纯函数，没有持久状态、计时器、锁、调度器或决策。路由复用 MON-901 的 single-flight `observation.refresh()`：投影进行中的图请求加入该操作，源不可用时返回与监视器相同的诚实 UNAVAILABLE 视图。这把 README §2.3“Monitor 只是 projection，不是新的 task truth”落实到代码：没有容纳第二份真相的位置。

### 2.2 风险推导及拒绝猜测的边界

```text
TASK_FAILED / TASK_REFUSED / TASK_UNAVAILABLE     from the canonical task state
OWNER_CONFIRMATION_REQUIRED                       canonical state WAITING_CONFIRMATION
DEVICE_ROUTE_WAITING                              TASK_TARGET_WAITING with no later TASK_TARGET_READY
PATH_REPEATED                                     >= 2 TASK_HANDOFF_REFUSED / TASK_SWITCH_DECLINED for one task
DEVICE_OFFLINE_HOLDING_WORK / DEVICE_OFFLINE      canonical node.online, split by whether work is assigned
WINDOW_INCOMPLETE / HISTORY_GAP / MONITOR_<health> / MONITOR_STALE   the projection's own blind spots
EDGE_CAUSALITY_MISSING                            an edge with no reason, or one pointing outside the window
```

原始映射表示：失败／拒绝／不可用来自规范任务状态；Owner 确认来自 WAITING_CONFIRMATION；设备等待要求有等待且没有后续 READY；同任务至少两次拒绝交接／切换形成重复路径；离线按是否持有工作区分；窗口缺失、历史缺口、监视健康／陈旧属于投影自身盲区；缺原因或指向窗口外的边缺少因果证据。

PATH_REPEATED 只计规范拒绝事件，且计数仅在连续窗口中有意义。若 completeness.historyGap 或省略事件存在，没有观测到重试的任务得到 RETRY_HISTORY_NOT_OBSERVABLE，而非健康结论。“从未重试”和“看不到是否重试”的区分正是目的。

- Owner-required 仅部分可观测。规范 WAITING_CONFIRMATION 是真实信号并标为 OBSERVED；其余情况返回 NOT_OBSERVABLE、count:null 及原因，因为 Mission Book 的 Owner 门和升级不属于 MON-901。工作书要求当前 Owner-required 显著可见；实现明确无法始终判定，比令人安心的“没有”更有用。每次渲染包括平静状态都会显示该边界。
- 重复重试来自事件而非状态。规范词汇通过新 Action 重试，所以同任务的连续拒绝／谢绝事件表现重复路径，而非重试计数器。词汇扩展时应扩展 RETRY_EVENTS。

### 2.3 渐进披露与交互预算

```text
L0  overview      risk first, then watch, then cannot-be-determined, then other work, then collapsed clusters
L1  inspector     what / why / who / what-next, the node's own paths as clickable rows, and the canonical evidence ref
L2  technical     raw projection fields, counts, reflow key — one <details> gate, asserted by a probe
```

L0 优先风险，再需关注、无法判定、其他工作、折叠群组；L1 回答什么／为什么／谁／下一步，提供节点自己的可点击路径和规范证据引用；L2 在一个 details 门后展示原始字段、计数和 reflow key，由探针断言。负载声明 navigation.budgetSteps:3；探针约束每个活跃风险节点出现在总图或报告该风险的群组中，因此风险可达且至规范证据最多三步。这保留当时开发报告的断言，不替代后续独立审核。

### 2.4 布局稳定

行顺序由 `(kind, state rank, id)` 确定，负载以可见结构计算 reflowKey。探针要求新事件不改变顺序／键而新节点会改变。页面仅在投影实际变化时重建 DOM；重载键使用城市快照 updatedAt 而非每次渲染，避免加载导致渲染又触发加载。

### 2.5 群组不得吞没风险

超过 maxVisibleNodes（默认120、路由可覆盖并限1..4096）时按状态聚合普通任务。活跃风险节点不聚合，每群报告 activeRiskCount 和最严重风险，将“总图可以隐藏细节，但不得隐藏风险”机械化。

## 3. 能力门

### 3.1 §14A 暴露决定

```text
user_exposure_class        OBSERVABLE_ADVANCED
user_exposure_surface      Web nav page `City monitor` (page id Monitor)
user_exposure_nesting      L1_PRIMARY (overview) / L2_CONTEXTUAL (inspector) / L4_TECHNICAL (disclosure)
backend_wiring             VERIFIED end to end against the real gateway route
direct controls            NONE — the monitor observes; it deliberately offers no action that would change the city
```

类别为 OBSERVABLE_ADVANCED，Web 主导航 City monitor，层级为总图 L1_PRIMARY／检查器 L2_CONTEXTUAL／技术披露 L4_TECHNICAL；真实路由端到端接线 VERIFIED。没有直接控制：监视器仅观测，不提供改变城市的动作。工作书已声明这些分类，实现与其一致；没有 INTERNAL_ONLY 声明或隐藏能力。空、加载、失败状态都明确，失败提示说明仅观测面无法读取、城市本身不受影响。

### 3.2 Android 同等能力：延期原因与接口缝隙

工作书完成门要求桌面及当前支持 Android/Web 的策略。选择 Web 优先并明确记录：

```text
DECISION    do not build the Android surface in MON-902
REASON      the graph needs a layout/collapse model and a bottom-sheet inspector in Compose, and MON-903 adds the
            event-triggered decision overlay on the SAME surface. Building it twice - once now without decisions, once
            again with them - would produce two graph designs and two sets of interaction budgets for the same data.
            The projection's contract (nodes/edges/clusters/summary/navigation) is now stable and tested, which is
            exactly what a Compose implementation should be written against.
SEAM        GET /api/v0/monitor/graph is surface-neutral: no HTML, no ids, no layout hints beyond the deterministic
            ordering. A Compose client needs no gateway change.
EVIDENCE    none claimed for Android. user_reachability_status for CAP-MON-002 is PARTIAL for this reason, and this
            is recorded as a known gap rather than as parity.
```

MON-902 不构建 Android 面。Compose 需要图布局／折叠与底部检查面板，而 MON-903 将在同一界面加入事件触发决策叠层；分两次构建会产生同一数据的两套图设计和交互预算。nodes/edges/clusters/summary/navigation 契约目前稳定且经测试，适合作为 Compose 实现基础。GET 图接口中没有 HTML、ids 或超出确定顺序的布局提示，Compose 无需 Gateway 变更。不声称 Android 证据，CAP-MON-002 可达性 PARTIAL 是已知缺口，不能算同等能力。审核可认为理由不足，应按实际状态而非暗示“移动端已准备”判断。

### 3.3 §14C 注册链更新

```text
capability_ids              ["CAP-MON-002"]  (declared by the workbook; immutable)
capability_registry_action  CREATE
record                      capability-registry/records/CAP-MON-002.yaml
index / surface index       CAPABILITY_INDEX.yaml + SURFACE_INDEX.yaml updated
matrices                    CAPABILITY_EXPOSURE_MATRIX.{en,zh-CN}.md updated
sync status                 CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW
last_verified_full_sha      6bb19f3e842774eff98cccf30fb01a8784953f22
four dimensions             implementation COMPLETE / wiring VERIFIED / reachability PARTIAL / intent NOT_TESTED
```

工作书不可变能力 ID CAP-MON-002，动作为 CREATE；记录、能力索引、界面索引及双语矩阵已更新，状态 CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW。四维分别为实现 COMPLETE、接线 VERIFIED、可达性 PARTIAL、意图 NOT_TESTED；原始核验 SHA 保留于证据块。

## 4. 证据

```text
node --test tests/mon902-monitor-graph.test.mjs   pass 14 / fail 0     (projection rules)
node --test tests/mon902-monitor-panel.test.mjs   pass 11 / fail 0     (surface rules, incl. the real route)
node --test tests/web.test.mjs                    pass 2  / fail 0     (REAL BROWSER: the monitor page renders, a row
                                                                       opens the inspector, no raw code is readable)
node --test tests/mon901-observation.test.mjs     pass 8  / fail 0     (dependency smoke, before any product change)
node --test tests/web-i18n.test.mjs               pass 9  / fail 0     (both locale packs still consistent)
node --test tests/web-terminal-shell.test.mjs     pass 6  / fail 0     (the shell still renders with the new page)
node --test tests/city-roads.test.mjs             pass 6  / fail 0     (see §5: an environment artefact, verified)
node scripts/check-bilingual.mjs                  SYNCHRONIZED
```

证据依次是图14/0、面板11/0、真实浏览器2/0、变更前依赖8/0、双语包9/0、终端壳6/0、city roads6/0（§5说明环境工件）以及双语 SYNCHRONIZED。

浏览器探针对应工作书精确头运行时／UI 门。字符串探针证明真实投影负载的渲染规则；浏览器才证明用户从主导航进入页面、看到图、由行打开检查器以及可读面无原始词汇。壳 CSS 大写使 innerText 返回 CITY MONITOR，首次大小写敏感断言误判正确产品；夹具通过真实 POST /api/v0/tasks 创建 type:WAIT（validateCommand 唯一接受形状），故图描述真实状态而不是虚构夹具。

14个投影探针验证风险等级属于声明词汇且非布尔值、活跃风险任务不在群组、截断窗口产生 NOT_OBSERVABLE 而非空风险、后续 READY 清除设备等待、边过滤不虚构边、事件到来不改变布局、Owner 为 OBSERVED 或 NOT_OBSERVABLE 而未知不报 count:0，以及无效视图抛错而不是舒服的空城。

11个界面探针验证默认风险可见；风险码／状态令牌／NOT_OBSERVABLE 不出现在技术披露外；承认无法观测的城市不显示平静横幅，同时永久范围说明仍静默披露；群组报告风险；检查器回答什么／为什么／谁／下一步并邻接证据；无原因路径显示未解释；文本及属性位置转义 ID／标签；两语言包含所有词和风险码；壳暴露页面并读取真实路由。真实 Gateway 端到端探针还确认实际 POST 创建的任务出现在 GET 图、未知边类型过滤为空、无界 collapse 返回400、无凭据返回401。

## 5. 失败与分类

```text
F1  dependency smoke: ERR_MODULE_NOT_FOUND 'ws'
    CLASS  environment setup (fresh worktree has no node_modules). Reproduced-and-fixed: npm ci -> 8/8. NOT a defect.

F2  full suite: 5 failures (1280 tests)
    a) 3x tests/host-city-launcher.test.mjs -> "Requires a free local host reservation" / "City did not become ready
       within 45 seconds". CLASS environment: the resident City on this host holds coordination port 4389 and the
       preflight refuses a second City. Same 3 failures exist on every branch that runs against this host.
    b) 2x tests/city-roads.test.mjs -> document-reader digests. CLASS environment: the `city` tree has its own
       third-party parsers and CI installs them (`pnpm --dir city install --frozen-lockfile`) before `pnpm test`,
       which a fresh worktree has not done. Verified by installing: pass 6 / fail 0.
    NEITHER is attributable to MON-902: no MON-902 file is imported by those paths, and the same suite state is
    reproduced by installing the missing trees rather than by changing code.

F3  two probe drafts failed against my own wrong assumptions, both recorded rather than adjusted silently:
    - the surface probe asserted `"authoritative": false` inside the disclosure, but the disclosure is HTML-escaped
      like every other value, so the assertion was wrong, not the product;
    - the browser probe asserted the visible heading with a case-sensitive match, but the shell uppercases headings in
      CSS and `innerText` reflects that (`CITY MONITOR`), so again the assertion was wrong, not the product.
    - the "calm city" probe initially demanded no caveat at all, which contradicted the honesty rule. The product was
      changed deliberately instead of the assertion being weakened: the permanent Owner-gate limitation moved from the
      alarming blind-spot block to a quiet, always-present scope line, so a healthy city does not cry wolf while the
      limitation is still disclosed. Both the product and the probe changed, and the reason is this paragraph.

F4  registry maintenance (control-plane side, not product code): preparing CAP-MON-002, a
    `Get-Content -Raw | Set-Content -Encoding UTF8` round trip in Windows PowerShell MANGLED the Chinese capability name
    (`全城工作监视器…` -> `鍏ㄥ煄宸ヤ綔…`) and added a UTF-8 BOM and CRLF endings, because that pipeline reads the file in
    the ANSI code page. CLASS instrument failure. CAUGHT by re-reading the file and parsing it, not by the write
    appearing to succeed. REPAIR: the record was rewritten whole with a UTF-8 writer, then verified by parsing it and
    printing the Chinese value back, and both registry YAML files were confirmed BOM-free with LF endings. This is the
    second BOM-class incident on this host, so the rule is now: never round-trip a non-ASCII file through that pipeline.
```

F1 缺 ws 是新工作树环境设置，npm ci 后8/8，不是缺陷。

F2 全套1280个测试有5失败：3个 host-city-launcher 因常驻城市占协调端口4389，预检拒绝第二城市并报本地主机预约缺失／45秒未就绪；该主机各分支都有同样3失败。另2个 city-roads 文档摘要失败，因为独立 city 树第三方解析依赖未安装，CI 测试前会 pnpm --dir city install --frozen-lockfile；安装后6/0。这些路径不导入 MON-902，且安装依赖即可重现修复，分类为环境而非 MON-902。

F3 探针草稿中的错误假设没有静默调整：技术披露值经过 HTML 转义，直接匹配 authoritative:false 错；CSS 大写引起标题大小写断言错。平静城市最初要求完全无说明与诚实规则矛盾，因此有意改变产品而非弱化断言：永久 Owner 门边界从警示盲区块移到始终存在的安静范围行，健康城市不虚惊但边界仍披露；产品与探针都改，理由明确记录。

F4 控制面注册维护中 Windows PowerShell Get-Content -Raw | Set-Content -Encoding UTF8 以 ANSI 读取，损坏中文能力名并加入 BOM／CRLF。这是仪器失败，通过重新读取与解析捕获，不因写成功就认为正确。用完整 UTF-8 写入器重写、解析并回读中文，确认两 YAML 无 BOM 且 LF。该主机第二次 BOM 类事件，规则为不再用该流水线往返非 ASCII 文件。

## 6. 研究材料（§14B）

research_evidence_applicability=APPLICABLE，证据索引 reports/MON-902/PAPER_MATERIAL_INDEX.md。保留两个信号：缺失声明受窗口连续性机械约束，能说未知不能说没有；风险保持聚合允许摘要折叠细节，但探针要求活跃风险不变为不可达。两者是控制面主题实例，不是新的新颖性声明。

## 7. 审核开放项

```text
1  Android parity deferred (§3.2). Judge it on the recorded reason and seam, not as delivered parity.
2  Owner-required remains partly NOT_OBSERVABLE by construction (§2.2). The workbook asks for it to be visible; the
   implementation makes the limitation visible, which is a design decision the reviewer should confirm.
3  The opposite-host Formal Review has not been started; this host may not review its own development.
4  Terminal marker NOT released. development_complete is recorded in the workbook; review_complete is not.
```

审核须判断 Android 延期的实际理由／接口而非按已交付同等能力；Owner-required 部分 NOT_OBSERVABLE 是构造边界，显式暴露该边界的设计须确认。相反主机正式审核尚未开始，开发主机不得自审。终止标记未发布：工作书记 development_complete，不记 review_complete。

## 8. 回读 CI 发现的晚期缺陷及修复

任务已报告完成，后来无关测量重新读取所记录头的 Actions API，而没有相信本报告字段，发现“push 和 pull_request 两次运行都绿”不真实。

```text
OBSERVATION   head 5460697cfde5d807f022698a0411b040634a458b had push run 37290743026 COMPLETED FAILURE
              (job gateway-web failure, android success) while its PR run 37290746745 and linkage 37290746628 succeeded.
              The workbook field and this report both over-claimed. Both have been corrected in place; the failure is
              preserved, not cleaned away.
REPRODUCTION  the failing assertion was tests/web.test.mjs:49 -
              actual 'CITY MONITOR\n\nLoading from the Gateway...' vs expected the loaded-state copy regex.
ROOT CAUSE    MEASUREMENT DEFECT (the probe, not the product). The probe waited for `.monitor-panel`, which exists as
              soon as the page mounts, and then asserted content that only exists after the projection arrives. It
              passed locally and in one CI run and failed in the other, i.e. it raced the fetch.
REPAIR        the panel's state is now machine-readable (`data-loaded` true / false / error), and the probe waits for
              `data-loaded="true"`. This is a product change, small on purpose: without it there is no way for any
              reader - human or test - to tell a shell from a projection.
REGRESSION    the probe can no longer pass before the projection arrives.
NEW HEAD      fd70d00837a8309db718ee56fab7738a8b947530
CLASSIFICATION  MEASUREMENT_DEFECT, repaired; the recorded over-claim is a RECORD DEFECT of this task and is also
                corrected in the workbook frontmatter.
LESSON        a CI field that says "both runs are green" must be written from a per-run read of both events, not from
                one green run plus an assumption about the other one.
```

头5460697cfde5d807f022698a0411b040634a458b 的 push37290743026 已完成失败（gateway-web 失败、android 成功），PR37290746745 与 linkage37290746628 成功。工作书和报告均过度声明，已原位修正并保留失败。

失败断言 tests/web.test.mjs:49 实际仍为 CITY MONITOR／Loading from the Gateway，预期已加载文案。探针仅等待挂载时就存在的 monitor-panel，随后断言投影到来后才存在的内容，因此与 fetch 竞争，本地和一次 CI 通过、另一次失败；根因为测量缺陷。小幅产品修复将面板状态暴露为 data-loaded true/false/error，探针等 true；否则人或测试无法区分壳与投影。回归探针现在不能在投影到来前通过。新头fd70d00837a8309db718ee56fab7738a8b947530。测量缺陷已修复；过度声明也是记录缺陷，工作书 frontmatter 已纠正。两次 CI 都绿的字段必须来自两事件逐运行回读，不能由一次绿色加对另一次的假设推得。

语言配对 / Language pair: [English](../DEVELOPMENT_REPORT.md) · [中文](./DEVELOPMENT_REPORT.md)
