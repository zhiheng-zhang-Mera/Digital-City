# Verification Report — MB-002

[Authoritative source / 权威原稿](../VERIFICATION_REPORT.md)

本文件为历史报告的完整阅读译文；不产生新的阶段声明或重新验证结论。This is a complete reading translation of the historical report, not a new stage declaration or verification result.

```text
MISSION = MB-002
ROLE = VERIFICATION
HOST = Alien
MIGRATION_HOST = Mech
IMPLEMENTATION_BRANCH = mission/MB-002-capability-fabric
MIGRATION_HEAD = db3ac518de1d6125e00cee1d9ff6ff7868b58336
FINAL_BRANCH_SHA = 63acf7af029357ca8ad85939a23dc9ab46e06f85
FINAL_BRANCH_CI = PASS — run 36586312554 (V0.2 checks) on 63acf7af029357ca8ad85939a23dc9ab46e06f85
MERGED_MAIN_SHA = 83ea44e02274f8d5bcbe866d339a5cd703839e9b
VERIFICATION_COMPLETE = true
```

Verification claimed 2026-09-29T14:44:07Z, City commit `8c4d214a9287a346e9b4b8060f82e7c5e1c6d695`. Rule 5: migration Mech, verification Alien, different hosts. Under rule 9 the independent review and events below were recorded before opening the Migration Report; it is first referenced in reconciliation.

## 1. Independent review

This section predates reading the Migration Report and uses only the frozen donors, target code, diff, tests and runtime state.

### 1.1 Scope

| Item | Value |
|---|---|
| Branch | mission/MB-002-capability-fabric @ db3ac518de1d6125e00cee1d9ff6ff7868b58336 |
| Merge-base main | c7ef3cd1c6be0155332d03afc3607dfdbf49c205 |
| Implementation | 00607f8b243e166b112319b1663eebb3d763fcfc |
| Donors | Codex-Boss @ 8df428eaa437a409368401e95194e40266b83080; DS-Hns @ eeb57ca5c2c56bdf2e58c1216c610b4b9fbc973b |
| New module | city/00-foundation/03-capability-fabric/capability-fabric/, seven .mjs, DONOR.json, two test files |
| Composition-root change | services/capability-bridge/registry.mjs |

### 1.2 Code/diff findings

- **F1 — Derivation was rewritten, but migration proved only covered cases.** registry moved inline availability derivation to describeOwnership/bridgeStateForLifecycles. Tests cover current real manifest combinations, whereas derivation is combination-sensitive for lifecycle tuples of length 1–3. Equivalence appears to hold in the diff but was unproved.
- **F2 — Four descriptor fields added:** moduleState, owner, priority, fallback. Consumer inspection confirms purely additive: Web services.js and Android ServicesPanel.kt/CapabilityPolicy.kt read capabilityId, name, bridgeState, cityLifecycle, operations, inputKind, resultDigest, errorCode, status by key; neither compares entire objects or counts keys.
- **F3 — Changed old tests redefine boundaries without relaxing them.** capability-registry, capability-adapters and manifest tests change fixed counts to baseline-relative increments, preserving strength (§3.2).
- **F4 — Invocation path does not consume the module.** bridge.mjs remains unchanged, with its own invocation implementation: workers.size>=2 → BUSY429, >3*1024*1024 → RESULT_TOO_LARGE, restart INTERRUPTED/GATEWAY_RESTARTED, degraded Set. Fabric supplies a second implementation with no cross-check, a real main drift risk, but outside this Mission's defect boundary: it requires existing donor behavior and existing qualified identity/availability/bounded invocation/typed errors, not rewiring bridge invocation to fabric.
- **F5 — composedProviders(manifest, adapters)** ignores manifest and always returns version:null, matching the donor; recorded as existing behavior.

### 1.3 Donor parity findings

Boss provider/multi-owner registry resolves capability ID, sorts priority, refuses two owners claiming one capability and removes all an owner's capabilities on revocation; broker/routing and stable outcome/state models. Hns covers capability/plugin dependency, lifecycle, adapter/compatibility, fallback/fault, health, config/lockfile verification. Both have scenarios in 44 new module tests; DONOR.json records mission and incubationRooms.

### 1.4 Runtime/use findings

All historical/current vectors of five bridged services pass. Web services.js renders city.capabilities cards showing bridgeState·cityLifecycle and enables Run only AVAILABLE. Android renders the same array as a dropdown, same fields, using canInvokeCapability = ONLINE && AVAILABLE && !busy. Both availability rules agree; result/error use the same invocation records (resultDigest/errorCode/invocationId/status), history the same invocations list.

Initial product observation, not a blocker: one foundation module raises capability list from five to six, adding permanently uncallable BRIDGE_PENDING. Both clients display it with Run disabled. This does not invent UI for acceptance, but changes the visible services list.

### 1.5 Initial verdict

PASS-with-observations. Correct boundary, traceable donor mapping, existing behavior retained, no weakened tests. F1 needs independent oracle evidence before accepting unchanged availability (§3.1). Product-list addition must align with accepted main rules (§5).

## 2. Migration Report reconciliation

Written after reading the report, comparing it with independent findings.

### 2.1 Confirmed

Landing is city/00-foundation/03-capability-fabric/capability-fabric, matching district/building/module. Forty-four parity tests cover both Boss provider/broker and Hns lifecycle/fallback/compat. The report's self-found repairs—compareLock iterating Map keys instead of values, duplicate RUNNING row—agree with diff review. Its §4 claims only registry composition-root change, never invocation rewiring, agreeing with F4. capabilityProvider:false was not used, and the report does not claim otherwise.

### 2.2 Differences

| ID | Difference | Verdict |
|---|---|---|
| D1 | Rewritten derivation was not proved. | This host added §3.1 tests, resolving it. |
| D2 | Report §8.5 adaptation2 says absent module refs derive NOT_IN_MANIFEST/BRIDGE_PENDING. | Description wrong, behavior correct. NOT_IN_MANIFEST is fabric's default when lifecycleFor returns undefined. Live registry passes moduleRef=>index.get(moduleKey(moduleRef))?.lifecycle??'UNAVAILABLE', so absent refs derive UNAVAILABLE→DEGRADED, matching old behavior and existing assertion. ABSENT_LIFECYCLE is unreachable from live registry. |
| D3 | Report omits list five→six. | Recorded observation §1.4/§5, removed at merge using accepted main rules. |

### 2.3 Boundary

Explicit exclusions agree with diff: no provider planning/worker pool, Customs admission/runtime enforcement or second Skill Intake copy. perception.ts was not moved, contrary to MB008 survey duplication warning; MB008 records the boundary decision.

## 3. Secondary repair and verification

### 3.1 R1 — Independent oracle parity test

Added city/00-foundation/03-capability-fabric/capability-fabric/tests/v03-derivation-parity.test.mjs, three cases. Old registry derivation from merge-base c7ef3cd1 is transcribed verbatim as oracle rather than calling new code. Enumerate lengths1–3 × six lifecycles × adapter present/absent, 516 combinations. Assert bridgeState and cityLifecycle equal oracle per combination. Third case records sole divergence: empty moduleRefs old MIXED, new UNAVAILABLE. Unreachable from live registry, whose adapter/module descriptors each have at least one ref, so accepted behavior unaffected, but disclosed. This tests equivalence rather than a single value, which could let a drifting copy pass.

### 3.2 Modified-test review

| File | Change | Verdict |
|---|---|---|
| capability-registry.test.mjs | Absolute→baseline-relative count | Not weakened: baseline+1 and distinct qualified IDs for duplicate names across buildings retained. |
| capability-adapters.test.mjs | catalog.length===6→baseline.length+1 | Not weakened: AVAILABLE count still baseline. |
| manifest.test.mjs | Census adds one | Not weakened: hardcoded EXPECTED_MODULES and actual code per entry. |

No tests skipped, deleted or marked todo.

### 3.3 Acceptance matrix

Branch d0052d029f769ecbe1b7e8279fafb7aa93510ef2 including R1: root58/58, rooms67/67, city176/176 (fabric47/47 including three R1), promotion10 OK, docs/evidence/data-records SYNCHRONIZED. Merged main83ea44e02274f8d5bcbe866d339a5cd703839e9b: root61/61 (three MB001 cases), rooms67/67, city276/276 across29files, promotion10 OK, three pairs SYNCHRONIZED.

### 3.4 Real use

Web cards show bridgeState·cityLifecycle, Run requires AVAILABLE. Android ServicesPanel dropdown/same fields, CapabilityPolicy ONLINE&&AVAILABLE&&!busy, CapabilityPolicyTest and CapabilityRequestExceptionTest cover INPUT_TOO_LARGE/413, OPERATION_BLOCKED/400, BRIDGE_PENDING/409, CAPABILITY_NOT_FOUND/404, INVALID_INPUT/400, OFFLINE, INVOCATION_UNAVAILABLE, INTERRUPTED/COMPLETED acceptance. Cross-client consistency rests on source review and client unit tests actually running :app:testDebugUnitTest in CI. This host did not click-test an Android emulator.

### 3.5 Failure/recovery

bridge interrupt(), GATEWAY_RESTARTED and degraded are untouched, old tests pass; fabric added coverage focuses registration/revocation/priority/owner cleanup.

## 4. Utopia verified episode

mission:finalize used implementation CI36585852227 V0.2 checks on d0052d029f769ecbe1b7e8279fafb7aa93510ef2, both jobs success. Episode data-records/evolution/episodes/mission-book/MB-002/episode.json, ID MB-002:f859fd8391837e33, inbox SHA2560779d9c364af3f99e8a84ed98ce8525545d488366dbc33b06df41dbafc71127a. Data-only closeout63acf7af029357ca8ad85939a23dc9ab46e06f85 creates episode and removes inbox events.jsonl. VERIFIED,19events,two findings,two repairs,one owner intervention.

### 4.1 Event stream (19)

| Role | Host | Type | Outcome |
|---|---|---|---|
| MIGRATION | Mech | MISSION_CLAIMED/ATTEMPT_STARTED/OWNER_INTERVENTION/CHANGE_APPLIED | INFO |
| MIGRATION | Mech | TEST_PASS | PASS |
| MIGRATION | Mech | CI_RESULT | PASS |
| MIGRATION | Mech | RUNTIME_PASS | PASS |
| MIGRATION | Mech | RECOVERY | PASS |
| MIGRATION | Mech | CI_RESULT | PASS |
| MIGRATION | Mech | MIGRATION_COMPLETE | PASS |
| VERIFICATION | Alien | MISSION_CLAIMED/ATTEMPT_STARTED | INFO |
| VERIFICATION | Alien | VERIFIER_FINDING F1–F5 | INFO |
| VERIFICATION | Alien | REPAIR_APPLIED R1 | REPAIRED |
| VERIFICATION | Alien | VERIFIER_FINDING report reconciliation | INFO |
| VERIFICATION | Alien | TEST_PASS | PASS |
| VERIFICATION | Alien | RUNTIME_PASS | PASS |
| VERIFICATION | Alien | CI_RESULT | PASS |
| VERIFICATION | Alien | VERIFICATION_COMPLETE | PASS |

## 5. Merge/conflict rulings

Main advanced eight commits during verification, MB001 verified/merged by Mech. Seven conflicts, all shared control files, structural. Preserve both real invariants, never relax for green.

| File | Ruling |
|---|---|
| CITY_IMPLEMENTATION_MANIFEST.json | Union: MB001 district kind:infrastructure plus foundation03-capability-fabric building. Eleven modules, neither side missing. |
| registry.mjs | Keep infrastructure filter/DISTRICT_KINDS, fabric registration/ADAPTERS compatibility alias, default ADAPTER_PROVIDERS. |
| capability-adapters.test.mjs | Both absolute MB001 and baseline-relative MB002 assertions hold, strictly stronger. |
| capability-registry.test.mjs | Exact qualified identity, census-independent form, cross-building duplicate distinct ID. |
| manifest.test.mjs | MB001 EXPECTED_MODULES naming, ID-based fixture, add census; duplicate room case uses ID lookup and room from declaration, satisfying both comments. |
| city/docs/{en,zh-CN}/ARCHITECTURE.md | Tree union: city-core branch, capability-fabric last foundation child, paired structure. |

Merged descriptors exactly five, all AVAILABLE; fabric no longer uncallable Web/Android entry because foundation is infrastructure filtered by accepted MB001 rule. Initial/D3 product change disappears; V0.3 surface precisely retained. No scope expansion or weakened acceptance; branch side effect brought under accepted main rules.

## 6. Final gates

| Gate | Status | Evidence |
|---|---|---|
| Five services historical/current vectors | PASS | Root61 merged/58branch. |
| ≥1 Boss provider/broker parity | PASS | Registry/routing/outcome in44tests. |
| ≥1 Hns lifecycle/fallback/compat | PASS | Lifecycle/adapter-compat in44tests. |
| All lifecycle derivation equivalence | PASS | R1 516combinations, one unreachable difference disclosed. |
| Web/Android consistency | PASS | §3.4 source/unit, no emulator. |
| Different hosts | PASS | Mech/Alien. |
| Review before report | PASS | §1before§2, event evidence. |
| Same-branch repair | PASS | d0052d0 one test file. |
| No skipped/deleted/weakened tests | PASS | §3.2. |
| Required CI | PASS | 36585852227,final36586312554,Android success. |
| Verifier merged main | PASS | 83ea44e02274f8d5bcbe866d339a5cd703839e9b. |
| Episode closeout/two CI rule16 | PASS | §4/two CI above. |

Conclusion: PASS.

## 7. Carry-forward observations, not blockers

1. Duplicate invocation contracts F4: bridge/fabric each concurrency/result/interruption with no cross-check. Library migrated, invocation untouched. Owner should decide binding test; otherwise both may drift on main.
2. ABSENT_LIFECYCLE unreachable D2: absent refs correctly DEGRADED, but fabric branch no production caller. A later lifecycleFor without UNAVAILABLE fallback differs from pre-migration.
3. composedProviders ignores manifest/version:null, donor-equivalent existing state.
4. Consistency depth source/client unit, no Android emulator; separate device evidence if future Mission needs it.
5. Report D2 descriptive error corrected here; author reusing wording should use actual lifecycleFor fallback.

## 8. Evidence pointers

Migration report mission-book/reports/MB-002/MIGRATION_REPORT.md; utopia branch mission/MB-002-capability-fabric; [branch CI](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36585852227), [final HEAD CI](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/36586312554); episode data-records/evolution/episodes/mission-book/MB-002/episode.json (MB-002:f859fd8391837e33); merge83ea44e02274f8d5bcbe866d339a5cd703839e9b; field log D:\A-Utopia\.runtime\evidence\mission-book\MB-002\run-001\WORKING_STATE.md.
