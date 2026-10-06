# CEX-703 evidence / 能力发现素材

Capability CAP-ASK-001; registry backfill candidate. Backend target catalog already existed but Web Ask/Do had no ordinary page button; Android showed picker only after unmatched Ask. Choose thin real path using existing catalog, no second hard-coded list.

| Event | Observation / judgement | Evidence | Status |
|---|---|---|---|
| Discovery gap | First test assumed nonexistent Ask/Do nav button, timed out; instrument selector invalid. New visible Ask-bar catalog entry required by product reachability | Utopia web-red.log / web-green.log | INVALID_INSTRUMENT, retained |
| Baseline red | Corrected entry test against baseline terminal confirms missing catalog-open control | Utopia web-functional-red.log | REPRODUCED |
| Backend parity | Fixture16 targets: ROOM5/CAPABILITY6/CITY_TASK5; Room Hub down leaves5 unavailable | Utopia evidence/raw/mission-book/CEX-703/catalog-receipt.json | COMPONENT_PASS |
| Thin user path | Web2 clicks opens real catalog without Ask failure; selecting prepares action and posts nothing | Utopia tests/cex703-catalog-ui.test.mjs | PASS |
| Dynamic propagation | New operation inserted into canonical backend ROOM_OPERATIONS test fixture appears after reload without frontend changes; removed after test | same real Gateway/browser test | PASS; controlled fixture only |
| Confirmation | Selected City target creates no task until existing confirmation; user confirmation creates exactlyone queued task | same real Gateway/browser test | PASS |
| Android | Existing80 unit tests/build pass; OPPO offline Ask catalog visible and disabled. Online native catalog NOT_RUN. Previous CEX701 test APK restored; prefs retained | Utopia android-green2.log / physical-ask.xml | BOUNDED_COMPONENT_PASS |
| Execution error | Editing helper script attempted reassignment to const and stopped native state-key change; corrected explicitly, reran native build | local execution output / android-green2.log | REPAIRED |

Exact development source358fbb20a7b23826e92a04d7d893f22c65d56eec, CI37207524312 IN_PROGRESS. No final acceptance or intent-validation claim. Prior exact historical steps, context window/pressure and global rework counts NOT_OBSERVABLE. Task/branch/baseline recovered from durable claim; no hidden reasoning stored.

research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
research_evidence_refs: [mission-book/reports/CEX-703/CLAIM_RECORD.md, mission-book/reports/CEX-703/PAPER_MATERIAL_INDEX.md]

| Independent review P2 | uncertain request retry lost selection/key; route.fetch then response abort reproduces; fixed preserve draft through uncertainty | Utopia retry-red.log / retry-green.log | REPAIRED;9/9 |
| Exact source CI | final a96da907a937eb043a59ddd00f48031ded749fa9 CI37207716885 success; earlier source success is not substituted | DEVELOPMENT_HANDOFF.md | PASS |

Watchlist reconciliation at control rules9541aeb: research_watchlist_hits=[RS-G3-EXEC-WORK-ARTIFACT,RS-G3-IDENTITY-PROVENANCE,RS-G3-INDEPENDENT-REVIEW-BOUNDARY,RS-G4-CAPABILITY-STATE,RS-G4-USER-REACHABLE-TERMINAL]; highest_research_grade_observed=G4_RARE_SYSTEMIC; research_capture_level=MAXIMUM_BOUNDED. These are City predefined candidate classes, not novelty claims. Development/CI is complete while native online/opposite-host accepted intent remains pending; registry records four dimensions honestly. Source/report/CI links form the bounded event chain; unobservable timing/counters remain unknown.

Watchlist freshness: rulesa44613d supersede the earlier snapshot classification. USER-REACHABLE-TERMINAL is now RS-G3-USER-REACHABLE-TERMINAL, G3_SPARSE_ACTIVE; earlier frozen snapshot labels above are historical. Capability-state remains RS-G4-CAPABILITY-STATE. Literature reclassification cause comes from external policy update; recurrence prevention/activation totals NOT_OBSERVABLE.

Native online follow-up supersedes earlier offline-only gap for observed layout and selection only: NATIVE_LAYOUT_FINDING.md and NATIVE_LAYOUT_FIX_RECEIPT.json preserve actual display failure, repaired source/APK, 80 unit/build results, no-task selection and restoration. All16 card inspection / native mutating confirmation / opposite Formal Review remain unobserved.


## Opposite-host review extension / 对侧物理主机复核（Mech, MEGA-REP）

The statements above are the author's and remain chronological. They are superseded on one point only.

Formal Review PASS on exact head478d486096512eea3266350efe070323a232a120 by Mech (COMPUTERNAME MEGA-REP), a different physical host from development_host Alien-codex. Seven probes written for the review (utopia:tests/cex703-mech-review-probes.test.mjs, branch review/CEX-703-mech-review at006ec9f)7/7 pass, six of them driving a real browser against a real gateway, and they decide every check the workbook names: a fresh user reaches the catalog in EXACTLY TWO interactions with ZERO Ask submissions; the rendered rows equal the backend rows in order and in both directions (16 of16); every unavailable target is rendered disabled and carries the backend own unavailableReason; choosing a card executes nothing and the submission carries a canonical selection naming the chosen target; replacing the response with a synthetic target renders exactly that one row, which proves there is no second handwritten catalog; and a City task target creates nothing before the existing confirmation step. Author suite rerun unmodified3/3. Android executed here: testDebugUnitTest80/80 across14 suites. No pre-existing test file is touched.

F1 MEDIUM: the Android availability chip reads availability and side-effect but IGNORES the mutating flag, so checklist, bookmarks and knowledge.add-entry - measured on the live route as mutating=true with sideEffect=false and unavailable only because room hub is not reachable on loopback - are labelled SAFE whenever a Room Hub answers, contradicted three lines below by the card own warning that the target writes local product data and diverging from the Web, which flags mutating by name. Authority is not lost: the mutation still passes through the existing confirmation. F2 LOW: an empty catalog renders on the Web as a bare heading with no reason, while Android renders an explicit empty state for the same payload. F3 INFORMATIONAL: the mandatory before-this-change step count is declared NOT_OBSERVABLE, but the baseline commit shows the exact sequence (the Web fetched targets only after an Ask returned UNMATCHED, and the Android surface additionally required a click), so the counts are derivable even though unmeasurable; the workbook never defines a step. F4 INFORMATIONAL: this index records unavailableCount5 of16 while a Room-Hub-less fixture observes10 of16; classified as an ENVIRONMENT difference, and the same difference is what makes F1 reachable rather than latent, so a count of that kind should carry its environment.

Android online catalog remains NOT_RUN and intent validation remains NOT_TESTED. Terminal marker CAPABILITY_CATALOG_DISCOVERABLE released. See REVIEW_REPORT.md.

语言配对 / Language pair: [English](./PAPER_MATERIAL_INDEX.md) · [中文](./zh-CN/PAPER_MATERIAL_INDEX.md)
