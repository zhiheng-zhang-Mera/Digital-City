# REX-802 开发证据 / 开发素材

> 完整中文阅读译本。[英文原文](../PAPER_MATERIAL_INDEX.md)为证据来源；历史开发待定记录和后来复检结论均按原顺序保留，不改变 canonical 当前状态。

开发者 Alien-codex，物理宿主 MERA-ALIANWARE。Baseline `0e9bea3ce739b979e582a428af8fb233045a5e75`；精确实现 `833279cae237080cca88b1b6dbc9f217027ba68f`；当时云 CI 37211053490 为 IN_PROGRESS，未验收。capability `CAP-RESEARCH-TRACE-001`。

## 决策与观察

- 先提供轻量只读用户路径：Web Advanced 和 Android More 暴露当前 recording、类型、失败、测量可用性、provenance、completeness。保留既有 owner authority；recording run 不等于实验执行。
- 可选引用 collector 避免第二 canonical task/action 数据库。带类型 normalization 排除任意 payload、credentials、fingerprints。外部 software refs 是需要验证的声明身份，不自动证明 runtime SHA。
- 有界异步 storage/queue 和有界 close 保持产品执行。未知 metrics 保持 null/reason；source clock、capture wall time、monotonic epoch 分离。仅资源观察不得改变 canonical sequence timestamp 排序。
- Governance schema 支持工作书预定义的 rule lifecycle、supervision quality、semantic integration、eligibility/wake/rescan、capability state、continuation、source identity 维度。支持不等于声称外部事件已被实际观察。

| 阶段 | 观察结果 | 证据 | 分类 |
|---|---|---|---|
| Schema baseline | 缺失 module/entry 失败；早期 restore 颠倒排序；governance 维度最初被拒绝 | Utopia schema-red / early-capture-red / governance-red logs | 已复现、修复 |
| 故障隔离 | observation clock 故障逃出 error handler；既有超大文件在拒绝前先 rotate | containment-red/green logs | 已复现、修复 |
| Gateway baseline | 集成前 research route 404；tap 前资源样本缺失 | gateway-red/resource-red 和 green logs | 已复现、修复 |
| 技术批评 | P1 pre-commit event 在 rollback 后存留；P2 restart 隐藏 retention；P2 Web 丢失 403 status；P2 delayed response 清掉 offline warning | review-red/review-all-red/review-green logs | 已复现、修复；本地批评不是物理宿主正式复检 |
| 时钟隔离 | 未来 external resource timestamp 导致 canonical timestamp regression annotation | clock-isolation-red/green | 已复现、修复；18 focused pass |
| 产品回归 | Gateway/actions/strict-target/telemetry/member browser/i18n | regression.log | 最后仅时钟修正前 53/53 pass；修正后 18 focused |
| 原生 parser/build | 缺 parser 的 red；nullableBoolean 测试断言最初编译失败；修正时未把 unknown 强制转为 false | android-red/android-green/android-green2 | 83 unit tests PASS；APK build PASS |
| OPPO 物理入口 | 找到 More 入口，打开 Research trace，refresh 禁用，诚实显示 OFFLINE/NOT_OBSERVABLE | oppo-menu.xml/oppo-panel.xml；development-receipt | 观察到离线可达；native online NOT_RUN；已恢复 CEX701 APK |

受跟踪的有界 receipt：`utopia:evidence/raw/mission-book/REX-802/development-receipt.json`；event chain：`utopia:data-records/evolution/inbox/mission-book/REX-802/events.jsonl`。原始本地日志 hash 保留在 receipt；完整日志是被忽略的 runtime artifact，不声称是云端 artifact。

## 研究与上下文边界

`research_evidence_applicability: APPLICABLE`；`long_horizon_context_evidence: CAPTURED`。session `01a105ab-95d3-71c1-9869-db6801ee8049` 从持久 claim/plan/exact baseline 和 source status 继续。发生自动 compaction；精确 token/context window/trigger/duration 和追溯性的全局重复工作总数为 NOT_OBSERVABLE。继续后重新验证 source/control。此前 helper const reassignment 错误导致两个 guard 未应用；明确 red test 复现后，验证其修复。

watchlist 继承当前工作书：`RS-G3-IDENTITY-PROVENANCE`、`RS-G3-DYNAMIC-LIVENESS`、`RS-G3-OWNER-INTERVENTION-TAXONOMY`、`RS-G3-RULE-LIFECYCLE-DEBT`、`RS-G3-SUPERVISION-ATTENTION`、`RS-G3-SEMANTIC-INTEGRATION`、`RS-G4-AUTONOMY-SURVIVAL`、`RS-G4-REALITY-DRIFT`、`RS-G3-PASSIVE-EVIDENCE-PIPELINE`。最高 G4_RARE_SYSTEMIC 与 MAXIMUM_BOUNDED 是预定义 evidence priority，不构成 novelty、performance 或 autonomous survival 主张。普通 red/green bug 和 helper 错误仍属普通工程证据。

当时 formal acceptance、native online rendering、actual experiment/provider/model binding、longitudinal autonomy/supervision measurement 均待定或 NOT_OBSERVABLE。未发出 terminal marker。

精确源结果取代此前运行中快照：`833279cae237080cca88b1b6dbc9f217027ba68f`，CI 37211053490 COMPLETED SUCCESS，两 job 均成功。最终本地独立 technical critic 18/18，未发现剩余阻塞，但不是物理宿主正式复检。开发完成，正式复检当时待定。

## 对侧物理宿主复检补充（Mech，MEGA-REP）

以上内容属于作者陈述，并按时间顺序保留；仅有一项由以下内容取代。

与 development_host Alien-codex 不同的物理宿主 Mech（COMPUTERNAME MEGA-REP）对精确 head `833279cae237080cca88b1b6dbc9f217027ba68f` 正式复检 PASS。为复检编写十一探针：`utopia:tests/rex802-mech-review-probes.test.mjs` 8/8、`utopia:tests/rex802-mech-review-web.test.mjs` 3/3，分支 `review/REX-802-mech-review` @ f94967e。探针**制造**工作书 Review 要求的七种情形：缺失、重复、乱序、过期时钟、重启、partial trace、collector failure；还驱动 load 和 append 永不 settle 的 storage，证明 collector 不能拖慢或阻塞真实 City 工作：writer 挂起时，register/create/claim/RUNNING/COMPLETED 完整生命周期在 10 秒内完成。作者套件未修改重跑 12/12+6/6。复检者执行 Android：testDebugUnitTest 15 suites、83/83，assembleDebug SUCCESS，app-debug.apk 10,500,445 bytes；byte count 与作者 receipt 一致，但 SHA-256 不同，不声称 hermetic build。复检者运行 repo gates：check-bilingual SYNCHRONIZED、browser-relay 18/18。重新测量 exact-head CI：push 37211053490 SUCCESS，同 head 的 PR17 pull 37211470934 SUCCESS，reciprocal-contract 37211470918 SUCCESS。

发现均不阻塞。F1 LOW：每个 Gateway recording 的 completeness 恒为 PARTIAL，而 bare empty collector 为 COMPLETE，因而字段与实用性方向相反；原因即逐 record missingFields 仅在折叠 raw JSON 内可读。F2 LOW：重启后 snapshot run id 过度概括仍含旧 epoch run id 的窗口。F3 LOW control plane：缺八个 template field，包括全部四个 capability field，虽然 `CAP-RESEARCH-TRACE-001` 已存在；本次复检从验证 record 回填并对账。F4 LOW test fidelity：Android unit test 以 org.json:json 替代 android.jar，optString null 语义与 device 不同，JOIN-590 期间已在硬件测量。因此关键 null guard 正确，但测试未覆盖。保留 **INVALID INSTRUMENT**：委派工具根据 test-only jar 判断 guard 是 dead code，这对交付应用是错误结论。测试并**拒绝**的假说：第二 writer 导致 pre-commit event capture（无其他持 gateway emit 的 module 调用 store.atomic；bridge.mjs 仅在 save 返回后 emit）；telemetry CPU dereference crash（validateTelemetry 要求 cpu）；research-grade inflation（九信号为 7×G3+2×G4，G4_RARE_SYSTEMIC 是声明集合最大值，按 RESEARCH_EVIDENCE_PROTOCOL §6D 映射为 MAXIMUM_BOUNDED）。

失败分类：三个 host-city-launcher 失败为 ENVIRONMENTAL，baseline 相同；relay-s1-tunnel 在 baseline 亦失败，不能归因于本任务；theme-build-bridge 是负载敏感 flake，两次 head full-suite 都失败，独立运行 4/4；mesh301 和 web-services 仅在同时启动复检浏览器的运行失败，独立运行和排除复检探针均通过。不声称 physical-device rendering、experiment、provider、model、autonomy 或 performance 结果；Android online rendering 仍 NOT_RUN。终端标记 `RESEARCH_TRACE_FOUNDATION_ACCEPTED` 已释放。见 [REVIEW_REPORT.md](./REVIEW_REPORT.md)。
