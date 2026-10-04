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
