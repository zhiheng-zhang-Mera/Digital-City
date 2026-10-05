# MON-902 — paper material index

```text
WORKBOOK       MON-902  (City Work Monitor: overview graph + node/path inspector)
GRADE OBSERVED G3_SPARSE_ACTIVE (control-plane observation & decision surface)
CAPTURE LEVEL  MAXIMUM_BOUNDED   (declared by the workbook frontmatter)
THEME          Reliable long-horizon coding requires a persistent software-engineering control plane
EVIDENCE       bounded; no hidden reasoning, no unbounded logs, no credentials
```

## 1. Signals captured by this task

### S1 — An absence claim mechanically gated on window continuity

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

### S2 — Risk-preserving aggregation (collapse detail, never risk)

```text
OBSERVATION      every graph that can grow must collapse. Collapsing by state is the obvious choice and silently
                 swallows the one node that matters.
IMPLEMENTATION   cluster only nodes with no ACTIVE risk; publish activeRiskCount and worstRisk per cluster; a probe
                 asserts that every ACTIVE-risk node is in the drawn set or in a cluster that reports it.
FAILURE LABEL    SUMMARY_HIDES_ACTIVE_RISK
REPRODUCTION     200 RUNNING tasks + 1 FAILED task at maxVisibleNodes 50
```

### S3 — The projection publishes its own blind spot as an inspectable node

```text
OBSERVATION      a monitor's health (PARTIAL/UNAVAILABLE/DISCONNECTED/stale), omitted populations and history gaps are
                 facts about the OBSERVER, not about the city, and they are exactly the facts a reader needs before
                 trusting a quiet screen.
IMPLEMENTATION   nodes of kind OBSERVATION carrying WINDOW_INCOMPLETE / HISTORY_GAP / MONITOR_<health> / MONITOR_STALE
                 / EDGE_CAUSALITY_MISSING, drawn like any other node and inspectable the same way.
FAILURE LABEL    MONITOR_REALITY_DRIFT
```

### S4 — An edge with no stated cause is a first-class defect, not a quiet edge

```text
OBSERVATION      an assignment path whose reason is absent, or which points at something outside the observation
                 window, cannot explain anything. Rendering it as an ordinary line makes the graph look connected
                 while the causality is missing.
IMPLEMENTATION   edge.incomplete = (reason missing) OR (target not present); summary.incompleteEdges; the path panel
                 says so in words ("treat it as unexplained rather than as fine").
FAILURE LABEL    EDGE_CAUSALITY_MISSING
```

### S5 — Deterministic layout as a contract, not a rendering accident

```text
OBSERVATION      an observation surface that re-lays-out on every event moves target elements under the pointer and
                 makes the picture harder to read the more live the system is.
IMPLEMENTATION   order = f(kind, state rank, id); payload carries layout.reflowKey computed from visible structure;
                 probes assert an event does not change the key and a new node does.
NOTE             G1/G2 territory (stable layout is ordinary engineering). Kept as a control/failure cause, not a claim.
```

## 2. What this task does NOT claim

```text
- "we built an agent dashboard" is NOT novelty (README §6, watchlist G2).
- No autonomy, latency or decision-quality measurement: MON-902 has no decision layer (that is MON-903), so
  decision_latency / queue_wait / timeout fields are NOT_APPLICABLE here rather than missing.
- Owner-required observability is partial by construction; no claim is made that the monitor can see Owner gates.
- Android parity was not delivered, so no cross-surface observation is claimed.
```

## 3. Where the evidence lives

```text
utopia:services/dev-gateway/monitor-graph.mjs
utopia:tests/mon902-monitor-graph.test.mjs         14 probes, projection rules
utopia:tests/mon902-monitor-panel.test.mjs         11 probes, surface rules + real-route wiring
utopia:evidence/raw/mission-book/MON-902/development-receipt.json
mission-book/reports/MON-902/DEVELOPMENT_REPORT.md  sections 2.2, 2.4, 2.5, 5
```
