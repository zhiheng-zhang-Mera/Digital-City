# REX-990 — product acceptance

Implementation branch: `feat/rex-programme-final-android-intent-20261008`; product PR [#47](https://github.com/zhiheng-zhang-Mera/utopia/pull/47). Final candidate `27b901d37134df5923695349eebe9d8aedbe1255`; behavior reviewed at `0a4091c7592b964561e2327a576ffd4fd03e88e8`. The later two commits change only the bilingual operator guide. Accepted REX/PCF/CHK/DGX ancestry is preserved through union merge `1b09a9d9de5cc655ea122c50d4308135b03936fb`.

The Owner requested a new cloud branch containing Android, natural-language entry and programme integration, then merge after functionality and user operability are verified. After receiving the concrete design the Owner instructed: **按方案直接执行，不再分阶段确认**. This authorizes the final verified merge; it does not turn unobserved tests or approvals into PASS.

| Gate | Observed result | Evidence |
|---|---|---|
| Root regression | 2,054 PASS / 3 SKIP / 0 FAIL, 2,057 total, concurrency 2 | [full-root-bounded.log](evidence/full-root-bounded.log) |
| Initial unrestricted root run | 2,053 PASS / 3 SKIP / 1 FAIL; RS-201 timing assertion took 4,965 ms under concurrent load | [full-root.log](evidence/full-root.log) |
| Same RS-201 contract isolated | 43/43 PASS, original timeout/assertion unchanged | [rs201-isolated.log](evidence/rs201-isolated.log) |
| Rooms | 69/69 PASS | [rooms.log](evidence/rooms.log) |
| City | 1,998 PASS / 15 SKIP / 0 FAIL, 2,013 total | [city.log](evidence/city.log) |
| Android | 142 unit tests PASS; default APK and separate validation package build PASS | [android-review-fixes-green.log](evidence/android-review-fixes-green.log) |
| Independent other physical host | Mega-rep, exact code SHA, clean before/after, 41/41 PASS, no remaining Critical/Important | [independent-review-mech-report.json](evidence/independent-review-mech-report.json) |
| REX reproduction | Integrity VERIFIED; 205 runs rebuilt, 243/243 trace pointers resolved from durable store; 6 independent runs on two real devices; 0 inconsistencies | [opposite-host-reproduction.json](evidence/opposite-host-reproduction.json) |
| Exact final-head hosted CI | PENDING terminal outcome at report preparation | Updated before merge |
| Product merge / merged-main runtime | PENDING | Updated after verified merge |

The initial timing failure is retained. Isolated and bounded-concurrency results support resource contention as the explanation; the test and its bound were not relaxed. Hosted CI, actual opposite-host execution and phone observations are separate evidence.

OPPO PERM00 (Android 12, serial `BICIPVNB5HS85H9T`) was operated using ADB UI trees and actual controls. Temporary validation City `3e4b77ee-ceb3-404e-afd8-dd206afe1f54` was bound only to loopback `127.0.0.1:14323`, reached by USB reverse. The original `city.utopia.control` package was signed by another host; an attempted upgrade was correctly refused. Original private preferences were backed up privately, and `city.utopia.control.rexfinal` was installed side by side without deleting original data.

- Native Remote operation selected Alien, accepted explicit git/argv/cwd/purpose and typed confirmation, and returned real git stdout with exit 0: `Q-675e93c2-55b0-4efb-baae-a1e666d445b8`, COMPLETED.
- Native Agent jobs selected Review Agent, dispatched `Q-5d64165b-e664-4b80-92bf-0823eac1b934`, observed COMPLETED report and confirmed COLLECTED. The explicit verifier runs a real source HEAD observation. This proves the request/report/collection channel; it does not claim autonomous model/provider execution or City verification of arbitrary agent statements.
- Native Ask `run git on Alien` returned DRAFT_REQUIRED without creating a task, then opened a seeded editable native form. Filling missing fields and confirming produced `Q-77ec2c9d-8801-4151-b285-80f7e09fa672`, COMPLETED with actual stdout.
- Native Agent request to a nonclaiming strict target was withdrawn through the UI: `Q-a52f838a-b2b8-4b9e-a5e8-9b8973b1cd3e`, CANCELLED, NOTHING_TO_COLLECT.

See [actual API snapshot](evidence/phone-product-observation.json), [Ask draft](evidence/ask-draft.xml), [seeded form](evidence/ask-seeded-form.xml), [completed result](evidence/final-ask-completed.xml), [collected report](evidence/agent-collected.xml), [withdrawal](evidence/native-withdraw.xml) and corresponding PNGs. Member refusal, field edits/offline reauthorization, explicit manual-selection precedence, ambiguous names, disabled switches, bounds and response-loss retry behavior have unit/real HTTP/browser regression coverage. Android expired-job projection and target explanations preserve canonical task state.

User guide: Utopia `docs/zh-CN/REX_PROGRAMME_OWNER_CONTROLS.md`, with English mirror. Natural-language handling is bounded deterministic Chinese/English grammar, not universal language understanding. The capability contract still defaults OFF and requires Owner configuration and compatible nodes/agents.

Artifacts remain outside source: default APK SHA256 `7de8c587f0614cff3f028f3b1df63b681d9318b39ee15c7d97ff7079e170d878`; installed side-by-side APK SHA256 `943d7396cc71dfba1090ec92a45aebc5bb44acf2d57ad46db1a843187f9c2a74`. Android source is byte-identical across tested code and the final documentation head. Private credentials/preferences are excluded from published evidence. [checksums.json](evidence/checksums.json) anchors retained public evidence bytes.
