# MON-902 论文材料索引

> 阅读译本 / Reading translation：只供阅读，不是第二份权威工作书／状态。历史与未知边界保留，原证据块代码围栏保留，不新增验收。

工作书MON902 overview/inspector；grade G3_SPARSE_ACTIVE、capture MAXIMUM_BOUNDED为frontmatter声明；主题可靠长时coding需持久工程control plane；有界无hidden reasoning/unbounded logs/credentials。

```text
WORKBOOK       MON-902  (City Work Monitor: overview graph + node/path inspector)
GRADE OBSERVED G3_SPARSE_ACTIVE (control-plane observation & decision surface)
CAPTURE LEVEL  MAXIMUM_BOUNDED   (declared by the workbook frontmatter)
THEME          Reliable long-horizon coding requires a persistent software-engineering control plane
EVIDENCE       bounded; no hidden reasoning, no unbounded logs, no credentials
```

## 1. 本任务采集信号

### S1 — 无发生主张由窗口连续性机械门控

```text
OBSERVATION      a monitor is asked "is anything retrying?" and the comfortable answer is "no". The projection can
                 only support that answer when the canonical event window is continuous; when events are omitted or
                 the history has a gap, the honest answer is NOT_OBSERVABLE with the reason.
IMPLEMENTATION   services/dev-gateway/monitor-graph.mjs windowContinuity(); probe "absence of retries is NOT claimed
                 from a truncated event window"
FAILURE LABEL    SUMMARY_HIDES_ACTIVE_RISK (inverted: a summary that would have asserted absence)
WHY IT MATTERS   the same shape recurs wherever an agent summarises partial state: "no errors", "no blockers",
                 "nothing pending". A projection that can express "unknown" without expressing it as zero is the
                 difference between a monitor and a comforting dashboard.
BEFORE/AFTER     before: a task with no observed retries was indistinguishable from one that never retried.
                 after: the window's continuity is a required input to the claim.
REPRODUCTION     tests/mon902-monitor-graph.test.mjs, the same task under two completeness records
```

完整中文：问“在retry吗”舒适答无，只有规范event连续才支持；omitted/history gap诚实NOT_OBSERVABLE带reason。monitor-graph windowContinuity及truncated absence probe；failure SUMMARY_HIDES_ACTIVE_RISK反向（误断absence）。所有agent partial“无error/blocker/pending”同形，unknown非zero区分monitor/安慰dashboard。前无observed retry与从未retry不区分；后continuity为必需input。两completeness同task可复。

### S2 — 聚合保风险（折detail不折risk）

```text
OBSERVATION      every graph that can grow must collapse. Collapsing by state is the obvious choice and silently
                 swallows the one node that matters.
IMPLEMENTATION   cluster only nodes with no ACTIVE risk; publish activeRiskCount and worstRisk per cluster; a probe
                 asserts that every ACTIVE-risk node is in the drawn set or in a cluster that reports it.
FAILURE LABEL    SUMMARY_HIDES_ACTIVE_RISK
REPRODUCTION     200 RUNNING tasks + 1 FAILED task at maxVisibleNodes 50
```

完整中文grow graph必须collapse，按state显然却静吞关键node；仅cluster无ACTIVE，公布activeRiskCount/worstRisk，probe每ACTIVE在drawn或报告它的cluster。SUMMARY_HIDES_ACTIVE_RISK；200RUNNING＋1FAILED/max50复现。

### S3 — 投影自身盲点作为可检查node

```text
OBSERVATION      a monitor's health (PARTIAL/UNAVAILABLE/DISCONNECTED/stale), omitted populations and history gaps are
                 facts about the OBSERVER, not about the city, and they are exactly the facts a reader needs before
                 trusting a quiet screen.
IMPLEMENTATION   nodes of kind OBSERVATION carrying WINDOW_INCOMPLETE / HISTORY_GAP / MONITOR_<health> / MONITOR_STALE
                 / EDGE_CAUSALITY_MISSING, drawn like any other node and inspectable the same way.
FAILURE LABEL    MONITOR_REALITY_DRIFT
```

中文health PARTIAL/UNAVAILABLE/DISCONNECTED/stale、omitted/gap是observer非City事实，信quiet screen前最需；OBSERVATION nodes带WINDOW_INCOMPLETE/HISTORY_GAP/MONITOR_health/STale/EDGE_CAUSALITY_MISSING，同普通draw/inspect。label MONITOR_REALITY_DRIFT。

### S4 — 无原因edge是一级缺陷，不是quiet line

```text
OBSERVATION      an assignment path whose reason is absent, or which points at something outside the observation
                 window, cannot explain anything. Rendering it as an ordinary line makes the graph look connected
                 while the causality is missing.
IMPLEMENTATION   edge.incomplete = (reason missing) OR (target not present); summary.incompleteEdges; the path panel
                 says so in words ("treat it as unexplained rather than as fine").
FAILURE LABEL    EDGE_CAUSALITY_MISSING
```

中文assignment缺reason或target窗口外不能解释，普通line显连接但因果缺。incomplete=reason缺或target缺、summary incompleteEdges，path明确当unexplained非fine。EDGE_CAUSALITY_MISSING。

### S5 — 确定性layout是契约，非偶然render

```text
OBSERVATION      an observation surface that re-lays-out on every event moves target elements under the pointer and
                 makes the picture harder to read the more live the system is.
IMPLEMENTATION   order = f(kind, state rank, id); payload carries layout.reflowKey computed from visible structure;
                 probes assert an event does not change the key and a new node does.
NOTE             G1/G2 territory (stable layout is ordinary engineering). Kept as a control/failure cause, not a claim.
```

中文每event重layout会移动pointer下targets，越live越难读；order=f(kind,state rank,id)、visible structure reflowKey，probe event不改key/new node改。属G1/G2 ordinary，作control/failure cause非claim。

## 2. 不作主张

```text
- "we built an agent dashboard" is NOT novelty (README §6, watchlist G2).
- No autonomy, latency or decision-quality measurement: MON-902 has no decision layer (that is MON-903), so
  decision_latency / queue_wait / timeout fields are NOT_APPLICABLE here rather than missing.
- Owner-required observability is partial by construction; no claim is made that the monitor can see Owner gates.
- Android parity was not delivered, so no cross-surface observation is claimed.
```

完整中文dashboard非novelty（README6、G2）；无autonomy/latency/decision quality，902无decision（903），latency/queue/timeout NOT_APPLICABLE非缺；Owner gate观测结构partial不claim全；未Android parity无crosssurface。

## 3. 证据位置

```text
utopia:services/dev-gateway/monitor-graph.mjs
utopia:tests/mon902-monitor-graph.test.mjs         14 probes, projection rules
utopia:tests/mon902-monitor-panel.test.mjs         11 probes, surface rules + real-route wiring
utopia:evidence/raw/mission-book/MON-902/development-receipt.json
mission-book/reports/MON-902/DEVELOPMENT_REPORT.md  sections 2.2, 2.4, 2.5, 5
```

中文graph源码，graph14probe投影规则，panel11probe surface+real-route，development receipt及report§2.2/2.4/2.5/5。

## 最终精确头门禁（Alien实测，2026-10-06）

接受f4988248a3316806fc2e3fa9e62864ed129fe7b3，push37414577586/PR37414583160/linkage37414583135 COMPLETED SUCCESS，PR34 CLEAN/MERGEABLE。local HEAD=remote tip、clean；Registry exact对账。宽provisional1387/1387 PASS但起于final cache改前，hosted final-head acceptance权威。Android native/physical NOT_RUN仍990。MON902_OVERVIEW_GRAPH_REVIEW_ACCEPTED仅stage非freeze/main merge。

语言配对 / Language pair: [English](../PAPER_MATERIAL_INDEX.md) · [中文](./PAPER_MATERIAL_INDEX.md)
