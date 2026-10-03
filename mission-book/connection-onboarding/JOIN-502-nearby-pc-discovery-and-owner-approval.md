---
workbook_id: JOIN-502
phase: CONNECTION_ONBOARDING
sequence: 502
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["REMOTE_FABRIC_MERGED_MAIN_CI_GREEN"]
development_host: Mech
development_branch: join/JOIN-502-nearby-discovery-approval
development_baseline_sha: 13109b4c206feb3c1a9107b369715e84af65eaf1
development_claimed_at: 2026-10-03T10:25:00Z
development_claim_basis: "MECH CLAIMS JOIN-502 FOR DEVELOPMENT AFTER A CLAIM-TIME RECONCILIATION, AND AFTER WITHDRAWING ITS OWN EARLIER JOIN-501 CLAIM WHEN THAT RACE WAS LOST. THE WITHDRAWAL IS PART OF THIS RECORD because section 2 requires it: this host read Digital-City main 0bbc743, measured JOIN-501 development_host null, created branch join/JOIN-501-pairing-session-lifecycle and committed a claim, and the push was REJECTED because Alien had pushed claim 9545842 for the same task seconds earlier. The claim was withdrawn exactly as the rule prescribes - fetch, re-scan, fast-forward, and no force-push - and the local claim commit was discarded rather than merged, so Alien's claim stands untouched and untouchable. RE-SCAN AFTER THE WITHDRAWAL, measured on Digital-City main 9545842: JOIN-501 development_host Alien (claimed, not re-entered); JOIN-502 development_host null; JOIN-503 development_host null; every review_host null. TWO TASKS WERE THEREFORE AVAILABLE AND JOIN-502 WAS CHOSEN - see development_claim_rationale. DEPENDENCY AND BASELINE RE-MEASURED, not inherited from the sibling claim: (1) REMOTE_FABRIC_MERGED_MAIN_CI_GREEN resolves to evidence - RF-001..RF-010 archived as merged at finished/completed-2026-10-01/remote/; (2) the implementation baseline is Utopia main 13109b4c206feb3c1a9107b369715e84af65eaf1, read by git ls-remote origin refs/heads/main rather than from a local ref, and unchanged between this claim and the withdrawn one; (3) hosted CI on exactly that sha is completed/success for both required workflows - V0.2 checks run 37112596448 and City linkage check run 37112596441; (4) git ls-remote refs/heads/join/* still returns NOTHING, so the sibling development branch has not been pushed yet and this claim cannot collide with it. THE CLAIM IS ATOMIC IN THE RULE SENSE: it sets development_host for JOIN-502 alone, changes no other workbook, and if this push loses a race it is withdrawn rather than forced."
development_claim_rationale: "WHY JOIN-502 RATHER THAN JOIN-503, decided by the workbooks and the measured code rather than by preference. (1) DEPENDENCY ORDER: the programme README section 4 makes all three parallelisable under stable contracts with no sibling merge, and none declares a dependency on another JOIN task - all three declare only REMOTE_FABRIC_MERGED_MAIN_CI_GREEN - so neither remaining task is blocked by Alien holding JOIN-501. (2) WHAT THE BASELINE ALREADY HAS: the current apps/web pairing surface already RENDERS discovery diagnostics from the city snapshot (apps/web/app.js pairingView renders discovery.mdns.state and discovery.ble.state) but offers NO onboarding action, which is exactly the seam JOIN-502 section 2 names - build the integration, adapter and presentation, do not build a second discovery protocol. JOIN-503 instead requires a durable local device identity, a platform credential store and a tokenless restart path, which is a strictly larger change whose real acceptance (restart an app, revoke from another endpoint, prove reconnect fails) is the harder half to make honest from a single host. (3) SECTION 6 CONFLICT SURFACE IS SMALL AND EXPLICIT: JOIN-502 section 6 requires that nearby discovery NEVER secretly mints a short code, which is the same Owner rule JOIN-501 is implementing - so the two tasks touch the same generation path and must not both rewrite it. This host takes the discovery/approval side and will keep every change on the request-join path bounded so that it composes rather than conflicts; the exact interface is recorded before implementation and the residual risk is declared in the development report instead of hidden."
development_head_sha: 86deda9c2990c78d683a8c3515d251022df9d040
development_ci: "37119234473 COMPLETED SUCCESS on exactly 86deda9c2990c78d683a8c3515d251022df9d040 (workflow 'V0.2 checks', jobs gateway-web + android, both completed/success, started 2026-10-03T11:18:29Z) - the exact-head hosted CI this workbook requires, read from the GitHub Actions API by head_sha and confirmed job by job, not inferred from a neighbouring sha. NOTE ON THE OTHER WORKFLOW: 'City linkage check' is triggered only on pushes to main and on pull requests, so a task-branch push has no run of its own; its green on the baseline main 13109b4 (run 37112596441) stands as the linkage evidence, and PROJECT_LINKAGE.json is untouched by this task."
development_complete: true
development_outcome: "DEVELOPMENT COMPLETE AND HANDED TO AN OPPOSITE-HOST REVIEW; the terminal marker NEARBY_PC_JOIN_ACCEPTED is NOT set, because section 10 also requires an opposite-host review that has not happened yet. WHAT WAS BUILT: the browse half of RF-003 (services/dev-gateway/nearby.mjs), the request/approval state machine (services/dev-gateway/join.mjs), the pure browser adapter (apps/web/discovery.js), the first-run onboarding surface with Nearby Cities, Request Join and the owner's Approve/Reject card, and seven routes - four public because a joining PC holds no credential (join/info, join/request, join/status, join/exchange, the last two gated by the requester's own claim secret) and three authenticated (the browse and both decision routes). NO second discovery protocol, NO second trust store, NO second device registry, NO new credential type: an approval releases the City's EXISTING control credential. WHAT WAS MEASURED RATHER THAN ASSUMED: 1071/1071 root tests pass on the committed tree; real-host acceptance on this host's LAN interface 172.31.12.151 with two real gateways publishing and browsing over real mDNS found 2 Cities with their authoritative identities, held the approval gate (exchange before approval 409), released a credential that genuinely authenticates (200 against /api/v0/city with a matching cityId), refused the replay (410) and put no secret in the approver's listing. EIGHT LOAD-BEARING CHOICES AND SIX DEFECTS FOUND BY RUNNING IT are recorded in reports/JOIN-502/DEVELOPMENT_REPORT.md with their reasoning; the defects include a second if-chain that made every join route answer 404 while working correctly, a version check that skipped the public join routes, a rejection that told the requester its own request belonged to somebody else, and a poll that failed with the very state it exists to report. NOT ESTABLISHED AND SAID SO: no second PHYSICAL PC was driven end to end (the second City ran on this host's LAN interface) so workbook section 9's Alien+Mech topology is deferred to the phase integration; BLE is advertise-only and a browser cannot scan it, which the UI states rather than fakes; durable device identity remains JOIN-503. REVIEW IS THE NEXT ELIGIBLE ROLE AND MUST BE A DIFFERENT PHYSICAL HOST per CONSTRUCTION_RULES section 3."
review_host: Alien
review_head_sha: 86deda9c2990c78d683a8c3515d251022df9d040
review_ci: "37119234473 COMPLETED SUCCESS on exactly 86deda9c2990c78d683a8c3515d251022df9d040 (workflow 'V0.2 checks', jobs gateway-web + android both success) - re-queried from the GitHub Actions API by head_sha at review time rather than inherited from the development record."
review_complete: true
review_result: "PASS at head 86deda9c2990c78d683a8c3515d251022df9d040, with two NOTES and NO required repair. INDEPENDENTLY EXERCISED: the author's own suites re-run 19/19 pass, plus five adversarial probes written so that they can fail, all PASS - (P1) the browse/request path mints NO pairing session or short code anywhere: the City public descriptor reports pairingSessionId null before AND after a join request, and the canonical event log carries no pairing-session event across the whole path, which is workbook section 6 measured rather than promised; (P2) a request row states grantsTrust false and isIdentity false, no credential exists before approval, and a caller holding the id without the claim is refused 403; (P3) neither an anonymous caller nor the REQUESTER itself can approve, both 401; (P4) the credential released on exchange is the City EXISTING control credential and it authenticates against /api/v0/city, so there is no second trust store and no new credential type, and status deliberately never carries it; (P5) a consumed approval cannot be collected twice (410), the consumed row reports CONSUMED and releases nothing, and a rejected row is inert. NOTES, NOT REPAIRS: N-1 the same change also exempted the legacy public pairing routes from version(req), measured as /pairing/info answering 200 to apiVersion 9 where it used to answer 409 while authenticated routes still refuse 409 - accepted because these routes must be reachable by a joining client that has not yet learned the version and because the response still carries apiVersion/schemaVersion so a client can detect the mismatch itself; recorded anyway because it leaves the wire contract ASYMMETRICAL with /pairing/session, and the honest repair if the phase integration wants one is a stated version-tolerant answer rather than a silent 409 that blocks a legitimate join. N-2 the two-PHYSICAL-host topology of section 9 is DEFERRED, not passed: the author real-LAN acceptance ran the second City on the same host LAN interface. NOT ESTABLISHED AND SAID SO: no second physical PC was driven end to end, and BLE remains advertise-only with no browser able to scan it. REVIEWER STANDPOINT DECLARED: this reviewer developed the sibling JOIN-501/503, so it is primed to look for the hidden short-code generation section 6 forbids but cannot claim a stranger unfamiliarity; it also records that three of its own probes first failed on the REVIEWER wrong assumptions about the wire contract (the claim secret is generated by the requester; approve/reject address the row by id while status/exchange use requestId) and were corrected in the probes rather than in the code. Evidence: review/JOIN-502-alien-formal-review @ 082735e. Full report: mission-book/reports/JOIN-502/REVIEW_REPORT.md."
review_claim_basis: "CLAIMED BY ALIEN, ON A DIRECT OWNER AUTHORISATION, AFTER A SECTION-7 EXACT-HEAD RECONCILIATION. The Owner was asked whether this host could take JOIN-502's review and answered 鍏佽, which matters because CONSTRUCTION_RULES section 3 requires only that the reviewer be a DIFFERENT ENTITY HOST FROM THE DEVELOPMENT HOST, not that it be any particular host: Mech developed this workbook and Alien did not, so Alien reviewing it satisfies the rule. DECLARED HONESTLY SO IT IS NOT MISTAKEN FOR A STRONGER INDEPENDENCE THAN IT IS: this reviewer is not a stranger to the subject matter - it developed the sibling JOIN-501 and JOIN-503, including the pairing-session lifecycle that JOIN-502 section 6 must not violate, and it shares the author's platform assumptions. That makes some defects MORE visible to it (a hidden short-code generation is precisely what JOIN-501 forbids, so this reviewer is primed to look for it) and it is recorded as a bias as well as an advantage. MEASURED AT CLAIM TIME, NOT INHERITED: (1) the workbook reads development_complete true, development_host Mech, review_host null, so no reviewer had claimed it and this claim overwrites nobody; (2) development_head_sha is 86deda9c2990c78d683a8c3515d251022df9d040 and git ls-remote of refs/heads/join/JOIN-502-nearby-discovery-approval returns the SAME sha, read from the remote rather than from a local ref; (3) hosted workflow 'V0.2 checks' run 37119234473 is COMPLETED SUCCESS on exactly that sha, jobs gateway-web and android both success, re-queried through the GitHub Actions API by head_sha rather than inherited from the development record; (4) the pool was re-scanned first - JOIN-501 and JOIN-503 are review-complete with their terminal markers recorded, JOIN-502 is the only lane left, and the phase integration (README section 5) stays locked until this review exists. THE CLAIM IS ATOMIC IN THE RULE SENSE: this commit sets review_host and review_head_sha, and if the push loses a race the claim is withdrawn rather than forced. review_complete stays false until the report exists, and NEARBY_PC_JOIN_ACCEPTED is NOT set by this commit."
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/JOIN-502
terminal_marker: NEARBY_PC_JOIN_ACCEPTED
---

# JOIN-502 鈥?Nearby PC Discovery + Owner Approval

> **Programme锛?* [README.md](./README.md)  
> **甯搁┗鏂藉伐瑙勫垯锛?* [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **寮傛鍑忓帇鏂藉伐锛?* [../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)

## 1. 鐩爣

鎶婂凡缁忓瓨鍦ㄤ簬 Remote Fabric contract 涓殑 same-Wi-Fi / LAN discovery 鐪熸鎺ュ埌鏂?PC 鐨勯灞?onboarding銆?

榛樿鐢ㄦ埛浣撻獙锛?

```text
new PC opens Utopia
鈫?Nearby Cities
鈫?choose discovered City
鈫?Request Join
鈫?existing trusted device receives approval request
鈫?Approve / Reject
```

鐢ㄦ埛涓嶅簲鍏堝幓鎵?URL銆両P 鎴?bare token銆?

## 2. 澶嶇敤鏃㈡湁 RF锛屼笉閲嶅缓

蹇呴』浼樺厛澶嶇敤宸插綊妗ｅ苟鍚堝苟鐨勶細
- RF-003 local discovery / LAN direct锛?
- RF-004 BLE bootstrap锛?
- RF-002 pairing/trust lifecycle锛?
- RF-010 public Fabric API銆?

濡傛灉褰撳墠 product surface 鍙睍绀?mDNS/BLE diagnostics锛岃€屾病鏈?onboarding action锛屽氨琛?integration / adapter / presentation锛涗笉寰楀彟璧风浜屽 discovery protocol銆?

## 3. 鍔犲叆鍏ュ彛浼樺厛绾?

浜у搧鎺ㄨ崘椤哄簭锛?

1. same-Wi-Fi / LAN nearby discovery锛?
2. BLE nearby bootstrap锛堝彲鐢ㄦ椂锛夛紱
3. QR锛?
4. short one-time code锛?
5. deep/web link锛?
6. manual host/token engineering fallback銆?

涓嶆槸鎵€鏈夊钩鍙板繀椤诲悓鏃舵敮鎸?BLE锛屼絾 UI 蹇呴』璇氬疄鏄剧ず unavailable / unsupported锛屼笉鑳戒吉閫?discovered device銆?

## 4. Nearby UX

鏈繛鎺ョ姸鎬佷笉鍐嶅彧鍛堢幇 token 杈撳叆銆?

鑷冲皯鎻愪緵锛?

- `Nearby Cities` / `Nearby Utopia`锛?
- city display name锛?
- bounded device/city preview锛?
- transport hint: LAN / nearby锛?
- `Request Join`锛?
- fallback `Use QR / code / link`锛?
- advanced/manual entry 鏀惰繘娆＄骇鍏ュ彛銆?

鍙戠幇缁撴灉鏈韩**涓嶆巿浜?trust**銆?

## 5. Owner approval

Request Join 鍚庯細

- 宸叉湁 trusted endpoint 鏀跺埌鏄庣‘ approval request锛?
- 鏄剧ず鏂?installation 鐨?bounded preview锛?
  - requested display name锛?
  - OS/platform锛?
  - installation fingerprint / short fingerprint锛?
  - local/network context when available锛?
- Approve / Reject锛?
- 涓嶄互 MAC 浣滀负韬唤閿氾紱
- MAC 鍙綔涓烘湰鍦拌緟鍔╄瘉鎹紝浣?unavailable/randomized 涓嶅緱闃诲銆?

鏈粡 approval锛?
- 涓嶅緱鎴愪负 TRUSTED_NODE锛?
- 涓嶅緱鎷垮埌 durable membership锛?
- 涓嶅緱鑷姩杩涘叆 worker pool銆?

## 6. Pairing code 涓?Nearby discovery 鐨勫叧绯?

Nearby discovery **涓嶈兘鍋峰伔鐢熸垚 short code**銆?

瀹冨彲浠ュ缓绔?discovery/request context锛屼絾 JOIN-501 鐨?Owner 瑙勫垯缁х画鐢熸晥锛?

- 娌＄偣 Generate 鈫?椤甸潰涓婃病鏈?temporary short code / QR / invite secret锛?
- nearby join 鍙互璧拌嚜宸辩殑 authenticated pairing handshake锛?
- 鑻ョ敤鎴蜂富鍔ㄩ€夋嫨鈥滄敼鐢ㄩ厤瀵圭爜鈥濓紝鎵嶈繘鍏?JOIN-501 鐨?explicit generation銆?

## 7. 鍏佽淇敼

- first-run / disconnected web surface锛?
- discovery adapter锛?
- approval request presentation锛?
- existing RF public API glue锛?
- pairing/trust integration tests锛?
- minimal server route needed to expose existing RF semantics銆?

## 8. 绂佹淇敼

- 涓嶉噸鍐?mDNS protocol锛?
- 涓嶆妸 IP 鍦板潃褰?stable identity锛?
- 涓嶈嚜鍔?trust 鍚?LAN 璁惧锛?
- 涓嶆妸 discovery response 褰撹璇侊紱
- 涓嶈姹傜敤鎴疯緭鍏?MAC锛?
- 涓嶆妸 Bluetooth 鍙樻垚涓昏 bulk transport锛?
- 涓嶅娲?archived RF branch銆?

## 9. 娴嬭瘯 / 瀹炴満

鑷姩锛?
- no nearby result 鈫?fallback 鍙敤锛?
- discovery result does not imply trust锛?
- Request Join creates pending approval锛?
- reject leaves device untrusted锛?
- approve follows canonical pairing/trust path锛?
- no hidden pairing-code generation锛?
- duplicate/replayed request bounded/idempotent銆?

瀹炴満锛?
- Alien / Mech 鍚?LAN锛?
- 涓€绔ā鎷?鎵ц clean unregistered installation锛?
- 鍙︿竴 trusted endpoint approve锛?
- 璇佹槑鍔犲叆 canonical City銆?

Formal Review 鐢卞彟涓€瀹炰綋涓绘満鐙珛瀹屾垚銆?

## 10. 瀹屾垚闂ㄦ

缁堟€?`NEARBY_PC_JOIN_ACCEPTED` 瑕佹眰锛?
- same-LAN real discovery/join 鎴愬姛锛?
- approval gate 鐪熷疄瀛樺湪锛?
- no auto-trust锛?
- no hidden short-code generation锛?
- fallback entries 浠嶅彲鐢紱
- Development + opposite-host Review + exact-head CI 鍏ㄩ儴瀹屾垚銆?

## 11. Reports

- [DEVELOPMENT_REPORT.md](../reports/JOIN-502/DEVELOPMENT_REPORT.md) 鈥?what was built, the eight load-bearing choices with their alternatives and costs, the six defects found by running it rather than reading it, the 搂9 test mapping, the real-host LAN acceptance, and the limits stated as limits.
- [EVIDENCE_LIVE_LAN_ACCEPTANCE.md](../reports/JOIN-502/EVIDENCE_LIVE_LAN_ACCEPTANCE.md) 鈥?the verbatim acceptance receipt, what each line establishes and what would falsify it, the investigated libuv teardown assertion, and the limits.

Handoff for the formal review 鈥?the next eligible role, on a **different physical host**:

```text
TASK_ID              JOIN-502
ROLE                 formal review (opposite host)
IMPLEMENTATION_REPO  zhiheng-zhang-Mera/utopia
CONTROL_REPO         zhiheng-zhang-Mera/Digital-City
BRANCH               join/JOIN-502-nearby-discovery-approval
BASELINE_SHA         13109b4c206feb3c1a9107b369715e84af65eaf1
HEAD_SHA             86deda9c2990c78d683a8c3515d251022df9d040
CI                   37119234473 SUCCESS on exactly HEAD_SHA (gateway-web + android)

DONE                 browse adapter, join/approval state machine, onboarding surface, 7 routes,
                     19 task tests, full suite 1071/1071, real-LAN acceptance (this host only)
CURRENT_TRUTH        development_complete true; review_complete false; no terminal marker
OPEN_FINDINGS        none raised by the author; the author's own six defects are recorded and fixed
REPAIRS_APPLIED      six, each with a test or an acceptance assertion behind it
NEXT_ACTION          attack the approval gate, the claim binding, the no-short-code boundary,
                     the fragment pin, and the "unavailable must be honest" claims
WAKE_CONDITION       review claimed by a different physical host
BLOCKER_TYPE         NONE
OWNER_REQUIRED       false
EVIDENCE_POINTERS    reports/JOIN-502/*, tests/join502-*.test.mjs, services/dev-gateway/{join,nearby}.mjs
```

