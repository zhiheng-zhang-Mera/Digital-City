# MON-902 — Development Report

```text
WORKBOOK           mission-book/city-work-monitor-dashboard/MON-902-overview-graph-and-node-path-inspector.md
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

---

## 1. Claim and baseline

Claimed atomically at Digital-City `7cd5d32` and recorded in `reports/MON-902/CLAIM_RECORD.md`. MON-902 declared
`baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM` with `dependencies: ["MON-901"]` and an empty
`dependency_source_shas`, which §2A.5 forbids filling with a guess. MON-901 was accepted with ONE exact head for both
development and review (`7eb38f1b930dfe6cc13dab0e17dedee467b1254b`), and merging it into the eligible base
`d3262ce2dd81e51a53e39e6f9add8dee650a7682` **fast-forwarded**: MON-901 is a descendant of `main`, so the union baseline
is the MON-901 head and already contains `main`. There were no conflicts to resolve, and no invented merge.

The dependency smoke ran before any MON-902 product change: `node --test tests/mon901-observation.test.mjs` → 8/8.
Its first run failed with `ERR_MODULE_NOT_FOUND: 'ws'` because a fresh worktree has no `node_modules`; after `npm ci`
the identical command passed. That is recorded as an instrument/environment failure, not a dependency defect.

## 2. What was built

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

### 2.1 The projection stays a projection

`buildGraph` is a pure function of one observation view: no persisted state, no timer, no lock, no scheduler, no
decision. The route reuses MON-901's single-flight `observation.refresh()`, so a graph request that arrives during a
projection joins it and a request while the source is down returns the same honest `UNAVAILABLE` view the monitor does.
This is the README's §2.3 rule ("Monitor 只是 projection，不是新的 task truth") expressed in code rather than in a
comment: there is nowhere for a second truth to live.

### 2.2 Risk derivation, and where it refuses to guess

```text
TASK_FAILED / TASK_REFUSED / TASK_UNAVAILABLE     from the canonical task state
OWNER_CONFIRMATION_REQUIRED                       canonical state WAITING_CONFIRMATION
DEVICE_ROUTE_WAITING                              TASK_TARGET_WAITING with no later TASK_TARGET_READY
PATH_REPEATED                                     >= 2 TASK_HANDOFF_REFUSED / TASK_SWITCH_DECLINED for one task
DEVICE_OFFLINE_HOLDING_WORK / DEVICE_OFFLINE      canonical node.online, split by whether work is assigned
WINDOW_INCOMPLETE / HISTORY_GAP / MONITOR_<health> / MONITOR_STALE   the projection's own blind spots
EDGE_CAUSALITY_MISSING                            an edge with no reason, or one pointing outside the window
```

`PATH_REPEATED` counts only canonical refusal events, and the count is only meaningful over a **continuous** window. When
`completeness.historyGap` is set or events were omitted, a task with no observed retries gets
`RETRY_HISTORY_NOT_OBSERVABLE` instead of a clean bill of health — the difference between "it never retried" and "we
cannot see whether it retried" is the whole point.

Two consequences worth stating plainly, because they are the honest limits of this task:

- **Owner-required is only partly observable.** A canonical `WAITING_CONFIRMATION` task is a real owner-required
  signal, and it is reported as `OBSERVED`. In every other case the graph answers `NOT_OBSERVABLE` with
  `count: null` and a reason, because Mission Book Owner gates and escalations are not part of MON-901. The workbook
  asks that "当前 Owner-required 状态显著可见"; the honest implementation states that it cannot always be determined,
  which is more useful than a reassuring "none". The surface prints this on every render, including calm ones.
- **Repeated retry is event-derived, not state-derived.** The canonical vocabulary retries by creating a new Action,
  so a repeated path is visible as repeated refusal/decline events for the same task, not as a retry counter. If the
  event vocabulary grows, `RETRY_EVENTS` is the one place to extend.

### 2.3 Progressive disclosure and the interaction budget

```text
L0  overview      risk first, then watch, then cannot-be-determined, then other work, then collapsed clusters
L1  inspector     what / why / who / what-next, the node's own paths as clickable rows, and the canonical evidence ref
L2  technical     raw projection fields, counts, reflow key — one <details> gate, asserted by a probe
```

The budget is stated in the payload itself (`navigation.budgetSteps: 3`) and enforced by a probe: every node carrying
active risk is either drawn on the overview or inside a cluster that reports it, so no risk is unreachable, and a risk
is at most three steps from its canonical evidence.

### 2.4 Layout stability

Row order is a deterministic function of `(kind, state rank, id)`, and the payload publishes a `reflowKey` computed from
the visible structure. Probes assert that a new event does not change the order or the key, and that a new node does. In
the page, the DOM is rebuilt only when the projection actually changed; the reload is keyed on the city snapshot's
`updatedAt` rather than on every render, so a render caused by a load cannot start another load.

### 2.5 Clustering never swallows risk

Above `maxVisibleNodes` (default 120, route-overridable and bounded to 1..4096) unremarkable tasks are clustered by
state. A node with active risk is never clustered, and each cluster reports `activeRiskCount` and its worst risk, which
is the README's "总图可以隐藏细节，但不得隐藏风险" made mechanical.

## 3. Capability gates

### 3.1 §14A exposure decision

```text
user_exposure_class        OBSERVABLE_ADVANCED
user_exposure_surface      Web nav page `City monitor` (page id Monitor)
user_exposure_nesting      L1_PRIMARY (overview) / L2_CONTEXTUAL (inspector) / L4_TECHNICAL (disclosure)
backend_wiring             VERIFIED end to end against the real gateway route
direct controls            NONE — the monitor observes; it deliberately offers no action that would change the city
```

The workbook already declared this class and nesting; the implementation matches it. There is no INTERNAL_ONLY claim
here and no hidden capability: the page is reachable from the primary navigation, and its empty, loading and failed
states are all explicit ("The city monitor could not be read. The city itself is unaffected; this is only the
observation surface.").

### 3.2 Android parity — deferred, with the reason and the seam

The workbook's completion gate says "desktop + current supported Android/Web surface strategy". The strategy chosen
here is **Web first**, and the decision is recorded rather than assumed:

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

This is a real, honest gap and the reviewer may judge it insufficient; it is stated here so that judgement is made
against the actual state rather than against an implied "mobile ready".

### 3.3 §14C registry chain update

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

## 4. Evidence

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

The browser probe is the workbook's "exact-head runtime/UI evidence" gate: string-level probes prove the rendering rules
against real projection payloads, but only a browser proves that the page a person actually opens reaches the monitor
from the primary navigation, renders it, opens the inspector from a row, and keeps the raw vocabulary off the readable
page. Two honest notes from writing it: the shell uppercases headings in CSS, so `innerText` returns `CITY MONITOR` and
the first draft's case-sensitive assertion failed against a correct product; and the fixture creates a real canonical
task through `POST /api/v0/tasks` with `{type:'WAIT'}` (the only shape `validateCommand` accepts), so the graph in that
probe describes real state rather than a fixture.

The 14 projection probes assert, among others: every risk level is in the declared vocabulary and never a boolean; a
task carrying active risk is never inside a cluster; a truncated window yields `NOT_OBSERVABLE` and never an empty risk
list; a later `TASK_TARGET_READY` clears a device wait; the edge filter cannot invent an edge; the layout does not
change because an event arrived; `ownerRequired` is `OBSERVED` or `NOT_OBSERVABLE` and never `count: 0` for an unknown;
and an invalid view throws instead of projecting a comfortable empty city.

The 11 surface probes assert: risk is visible without opening anything; no risk code, state token or `NOT_OBSERVABLE`
string appears outside the disclosure; a calm banner is never printed over a city the projection admits it cannot see
(while the permanent scope caveat is still disclosed quietly); clusters report the risk they contain; the inspector
answers what/why/who/what-next with the evidence next to the claim; a reasonless path reads as unexplained; ids and
labels are escaped in text and attribute positions; every word exists in both packs including every risk code; the
shell exposes the page and reads the real route; and — end to end on a real gateway — a real canonical task created
through `POST /api/v0/tasks` appears in `GET /api/v0/monitor/graph`, an unknown edge type filters to nothing, an
unbounded `collapse` is refused with 400, and the route answers 401 without a credential.

## 5. Failures encountered and how each was classified

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

## 6. Research material (§14B)

`research_evidence_applicability = APPLICABLE`; evidence indexed in `reports/MON-902/PAPER_MATERIAL_INDEX.md`.
The two signals worth keeping are (a) an **absence claim** being mechanically gated on window continuity — the monitor
can say "unknown" but cannot say "none" — and (b) **risk-preserving aggregation**, where a summary is allowed to
collapse detail but a probe enforces that no active risk becomes unreachable. Both are instances of the control-plane
theme rather than new novelty claims.

## 7. Open items for the reviewer

```text
1  Android parity deferred (§3.2). Judge it on the recorded reason and seam, not as delivered parity.
2  Owner-required remains partly NOT_OBSERVABLE by construction (§2.2). The workbook asks for it to be visible; the
   implementation makes the limitation visible, which is a design decision the reviewer should confirm.
3  The opposite-host Formal Review has not been started; this host may not review its own development.
4  Terminal marker NOT released. development_complete is recorded in the workbook; review_complete is not.
```

## 8. Late defect found by re-reading the recorded CI, and repaired

This task had already been reported as complete when a later, unrelated measurement pass re-read the Actions API for the
recorded head instead of trusting the field this report had written. It found that the claim "both the push and the
pull_request runs are green" was false.

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
