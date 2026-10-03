---
workbook_id: JOIN-503
phase: CONNECTION_ONBOARDING
sequence: 503
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["REMOTE_FABRIC_MERGED_MAIN_CI_GREEN"]
development_host: Alien
development_branch: join/JOIN-503-device-enrollment-and-tokenless-reconnect
development_head_sha: 77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f
development_ci: "37120646153 COMPLETED SUCCESS on exactly 77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f (workflow 'V0.2 checks', jobs gateway-web + android, both success) - the CI of the REPAIR head, which is now the tip of this branch. The earlier development CI 37117241912 SUCCESS on ede6fa2 remains the CI of the REVIEWED head."
development_repair_basis: "REPAIR OF MECH'S REVIEW FINDINGS D-1/D-2, ON THIS BRANCH, AT 77f7f2a. D-1 IS ACCEPTED AS A REAL DEFECT IN MY CHANGE, NOT ARGUED WITH: POST /device/installations/:id/revoke required only auth(), and auth() accepts a sess: credential, so ANY enrolled installation could revoke ANY OTHER installation - including the client the owner was using - with nothing but the short-lived session credential a browser keeps in sessionStorage; GET /device/installations answered the same session with the City's ENTIRE roster. What makes it indefensible is that I had already written the boundary on the two sibling routes (SESSION_CANNOT_ENROLL, SESSION_CANNOT_REBIND) and stated the intent in a comment on the enroll route, so it is a gap in my own rule rather than an open design question. THE RULE IS NOW STATED ONCE IN THE FILE SO THE NEXT ROUTE CANNOT MISS IT: a session credential may act on ITS OWN installation and on nothing else. A session may revoke ITSELF (leaving the City affects nobody), a cross-installation revoke is refused with the typed code SESSION_CANNOT_REVOKE_OTHER, the read route returns only the caller's own record with scope OWN_INSTALLATION, and the owner control token is unchanged (scope CITY, every installation). ONE DELIBERATE STEP PAST THE REVIEW'S MINIMUM, recorded as mine: cloneFindings is a CITY-WIDE population scan whose findings name other installations' ids AND credential fingerprints, so scoping only the installations array would still have disclosed the same class of owner information on the same response; a session now receives an empty scan. D-3 (auth routing on the literal sess: prefix) and D-4 (the two-physical-host acceptance) are left exactly as the review recorded them. GUARD PROVEN BOTH WAYS: tests/join503-session-scope.test.mjs FAILS 3 of 4 cases on the unrepaired head ede6fa2 - and the owner-authority case falls over because the unrepaired revoke really killed the victim, so the exploit was live rather than theoretical - and PASSES 4 of 4 on the repair; Mech's own tests/join503-review-privilege.test.mjs is CARRIED ONTO THIS BRANCH so the reviewer's guard reaches the branch that will merge and gets its own exact-head CI; my original 9 enrollment cases still pass unchanged. LIVE ACCEPTANCE ON A RUNNING CITY: 38 checks / 38 PASS against a real gateway with the Owner-supplied node credential 1Q2W3E4R-node, including a second installation's attack being refused while the victim stays BOUND and the owner's revoke still biting on the very next request. REVIEW_COMPLETE STAYS FALSE AND THE TERMINAL MARKER IS NOT SET: a PASS names an artifact, so the re-check of 77f7f2a belongs to Mech, and CONSTRUCTION_RULES section 3 forbids this host recording its own repair as reviewed. Full record: mission-book/reports/JOIN-503/REPAIR_D1_D2.md."
development_complete: true
development_completion_basis: "DEVELOPMENT COMPLETE ON ALIEN. WHAT WAS BUILT: the City gained an enrollment registry (services/dev-gateway/enrollment.mjs) that is a SEAM over the City's own RF-001 identity lifecycle in city/00-foundation/02-city-node-network/device-identity - not a second registry. A joining installation declares itself in the pairing exchange it already performs, so ONE join enrolls a logical device plus a concrete installation; the durable installation credential is minted once, returned once, and stored by the device layer (apps/client/device-enrollment.mjs, .runtime/device-enrollment.json, 0600, git-ignored); the browser receives only a short-lived sess: credential through the URL fragment and keeps it in sessionStorage. auth() routes a sess: bearer to the registry and re-checks it on EVERY request (never cached), so revoke is immediate rather than 'at next restart'; a revoked installation cannot mint new membership, and a reinstall stays UNBOUND until an explicit rebind carrying proof (RF-001's rule). TWO DEFECTS WERE FOUND AND FIXED INSIDE THIS BRANCH rather than shipped, both recorded in the report: POST /device/session is an AUTHENTICATION endpoint and was wrongly gated behind auth() (which made every reconnect 401), and a remembered City endpoint is not an identity, so a City restarted on a new port was misreported as unreachable until the caller could supply the address it can actually reach. LOCAL EVIDENCE: node --test tests/*.test.mjs = 1080 tests, 1078 pass, 2 fail - the same two (capability-adapters, city-roads, CORRUPT_INPUT) already proven pre-existing on a pristine baseline worktree and resolved by hosted CI's own city-tree install; the hosted run above ran the same suite green. New: tests/join503-enrollment.test.mjs, 9 cases over the REAL gateway covering the workbook section 8 list one by one (enrollment; restart reconnect with nothing typed; expired session re-auth with no token prompt; revoke denying reconnect; revoked installation unable to mint membership; reinstall unbound until explicit rebind; a secret-exposure sweep over snapshot/events/persisted records/QR/URLs; the manual control-token fallback still isolated and working; plus clone detection as a named refusal AND a canonical event). NOT DONE AND NOT CLAIMED: the opposite-host Formal Review (review_host stays null), the dual-PHYSICAL-host acceptance section 9 requires (single-host multi-process evidence only), and dedicated browser coverage of the NEW Settings device panel - the suite's browser tests pass but none drives that panel, so it is recorded as unverified rather than implied. Every unspecified choice and its judgement logic: mission-book/reports/JOIN-503/DEVELOPMENT_REPORT.md."
development_baseline_sha: 13109b4c206feb3c1a9107b369715e84af65eaf1
development_claimed_at: 2026-10-03T10:55:00Z
development_claim_basis: "CLAIMED BY ALIEN AFTER A CLAIM-TIME RE-SCAN OF THE LATEST Digital-City main. MEASURED AT CLAIM TIME, NOT INHERITED: (1) the three-JOIN pool now reads - JOIN-501 development complete on Alien (review_host null), JOIN-502 development_host Mech with status IN_PROGRESS, JOIN-503 development_host null - so exactly one development lane is unclaimed and this claim cannot overwrite Mech's; every review_host is still null, and review is deliberately NOT taken here (see below); (2) the dependency REMOTE_FABRIC_MERGED_MAIN_CI_GREEN is satisfied - RF-001..RF-010 merged and archived, and this task's identity semantics are RF-001's (device_id / installation_id / fingerprint), which section 2 requires be REUSED rather than re-invented; (3) the implementation baseline is Utopia main 13109b4c206feb3c1a9107b369715e84af65eaf1, re-read by git ls-remote immediately before this commit (unchanged since the JOIN-501 claim - no merge has landed in between), with hosted 'V0.2 checks' run 37112596448 and 'City linkage check' run 37112596441 both SUCCESS on exactly that sha, which is what baseline_policy CLAIM_TIME_MAIN requires; (4) no refs/heads/join/JOIN-503* exists on the remote yet. WHY ALIEN TAKES THE WORKBOOK MECH DEFERRED: Mech's claim commit for JOIN-502 records that it chose 502 over 503 because 503 'needs a durable identity plus credential store and a tokenless-reconnect acceptance that is not honestly provable from one host' - the second half of that is CORRECT and is not disputed: the dual-physical-host reconnect/revoke acceptance in section 9 stays DEFERRED and this host will not fake it. The first half is not a reason to leave the workbook unclaimed: the identity and credential-store work is code plus tests, and it is exactly the part that must exist before any host can prove the acceptance. So the claim is: build and prove on one host everything the workbook's section 8 auto-test list can decide, prove the negative paths (expired session re-auth without a UI prompt, revoke denies reconnect, no permanent secret in DOM/log/url/repo), and hand the dual-host acceptance to whichever second host is next online. SCOPE OVERLAP WITH MECH'S JOIN-502 IS ACKNOWLEDGED: 502 owns first-run/disconnected discovery presentation, 503 owns enrollment/reconnect plumbing and Settings revoke; this claim touches engine/runtime identity, the launcher/bootstrap path, session issuance glue and the Settings device summary, and will NOT build a second discovery surface or a second pairing/trust store. THE CLAIM IS ATOMIC IN THE RULE SENSE: this commit sets development_host, and if the push loses a race the claim is withdrawn rather than forced."
review_host: Mech
review_head_sha: 77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f
review_ci: "37120646153 COMPLETED SUCCESS on exactly 77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f, branch join/JOIN-503-device-enrollment-and-tokenless-reconnect (workflow 'V0.2 checks') - the exact-head CI of the REPAIRED head, re-queried by head_sha, replacing the ede6fa2 run that belonged to the head the review originally refused."
review_result: "PASS on the REPAIRED head 77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f. ORIGINAL REVIEW (at ede6fa2): REPAIR REQUIRED for D-1/D-2 - the revoke route accepted a sess: credential, so any enrolled installation could revoke ANY other including the owner client, and the roster route answered a session with the City entire enrollment roster. THE AUTHOR ACCEPTED THE FINDING AND RE-APPLIED IT INDEPENDENTLY, which is why the re-check did NOT take it on trust: git merge-base --is-ancestor a3b9ab3 77f7f2a FAILS, so 77f7f2a is not the reviewer patch but an independent re-application that has to stand on its own merits. MEASURED ON THE REPAIRED HEAD, not read from the commit message: (1) the reviewer own guard tests/join503-review-privilege.test.mjs PASSES; (2) the author guard tests/join503-session-scope.test.mjs plus the original 9-case suite plus the reviewer guard = 14 tests, 14 pass, 0 fail; (3) measured against a real gateway with a deliberately injected duplicate credential fingerprint - the OWNER sees scope CITY, 2 installations and a 341-character population clone scan, while a SESSION sees scope OWN_INSTALLATION, exactly 1 installation (itself), cloneFindings [] and a typed 403 SESSION_CANNOT_REVOKE_OTHER on a cross-installation revoke, with the would-be victim still authenticating 200 afterwards. THE REPAIR IS STRICTLY STRONGER THAN THE REQUESTED MINIMUM AND THE REVIEWER ACCEPTS THAT AS CORRECT: the minimum covered the installations array, and the author additionally scoped cloneFindings because a population-level clone scan names OTHER installations ids and credential fingerprints - scoping only the array would still have handed a session a map of every duplicated credential in the City. It stays inside the defect boundary (the same missing rule on the same route), not a widening of scope. STILL OPEN AND DECLARED: D-3 (auth routes on the literal sess: prefix, so a control token that began with those characters would be refused - fail-closed, no generated token has that shape, carried to the phase integration as a note) and D-4 (workbook section 9 two-PHYSICAL-host acceptance remains DEFERRED to the phase integration, because this reviewer has one host - deferred != passed). THE VERDICT IS ON 77f7f2a AND ONLY ON 77f7f2a. Full re-check: reports/JOIN-503/RECHECK_REPORT.md."
review_complete: true
terminal_marker_recorded: "DEVICE_ENROLLMENT_RECONNECT_ACCEPTED recorded by Mech on 2026-10-03, after the opposite-host formal review passed on the repaired head. THE CONDITIONS OF WORKBOOK SECTION 10 ARE MET AS FAR AS ONE HOST CAN HONESTLY MEET THEM: initial enrollment (a real join enrolls an installation over the pairing exchange the owner authorised), restart automatic reconnect (a restart re-mints a session from the durable installation credential with NOTHING typed and no UI prompt), revoke negative path (a revoked installation is refused on the very next request through the same auth() the WebSocket handshake uses, and cannot silently mint new membership), secret exposure sweep (the durable secret is returned once, stored only by the device layer in a git-ignored 0600 file, never readable back from the City which holds only its fingerprint, and the browser holds only a session credential), Development + opposite-host Review + exact-head CI (Alien + Mech + 37120646153 on 77f7f2a). WHAT IS EXPLICITLY NOT CLAIMED: section 9 acceptance additionally requires the run on TWO PHYSICAL HOSTS (join on one, approve/revoke from another). That is DEFERRED to the phase integration and is NOT part of this acceptance - it was declared as deferred in this workbook before the review ran and is unchanged by it. merge_authority stays false: the programme README section 5 merge lock still needs all three JOIN tasks to carry opposite-host reviews, and JOIN-502 has not been reviewed by a host other than its author."
review_claim_basis: "MECH CLAIMS THE FORMAL REVIEW OF JOIN-503, ON A DIFFERENT PHYSICAL HOST FROM THE DEVELOPMENT HOST, AFTER A SECTION-7 EXACT-HEAD RECONCILIATION - the SECOND review this host takes, after JOIN-501 was reviewed to PASS with its report published. MEASURED AT CLAIM TIME, not assumed: (1) development_complete reads true and development_host is Alien, so section-3 host independence holds and this host is not the author; (2) the workbook development_head_sha is ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7 and git ls-remote of refs/heads/join/JOIN-503-device-enrollment-and-tokenless-reconnect reports the SAME sha, read from the remote rather than a local ref; (3) hosted CI run 37117241912 on exactly that sha is COMPLETED SUCCESS on that branch, re-queried by head_sha; (4) review_host was null, so no reviewer had claimed it and this claim overwrites nobody. WHY THIS TASK AND WHY THE POOL IS OTHERWISE CLOSED TO THIS HOST: the full connection-onboarding pool was re-scanned first - JOIN-501 is development-complete AND review-complete (this host reviewed it to PASS), JOIN-502 is development-complete on THIS host and therefore cannot be reviewed here at all per section 3, and JOIN-503 is development-complete on Alien with review_host null, which is the only remaining lane this host is eligible for. REVIEWING RATHER THAN DEVELOPING is the correct role here: JOIN-503 development is already complete and its claim is Alien's, and section 12 forbids another host from clearing or re-taking another host's development claim. WHAT THIS REVIEW CAN AND CANNOT HONESTLY SETTLE, DECLARED BEFORE IT RUNS: JOIN-503 section 9 acceptance requires two PHYSICAL hosts (join on one, revoke from another, restart, prove automatic reconnect). This reviewer has one host, so what is honestly provable here is the code, the identity seam over RF-001, the automatic-reconnect mechanism, the revocation negative path and the secret-exposure sweep; the two-machine topology is DEFERRED to the phase integration and will be recorded as deferred rather than passed. THE CLAIM IS ATOMIC IN THE RULE SENSE: it sets the two review fields for JOIN-503 alone, changes no development field, and if this push loses a race it is withdrawn rather than forced. review_complete stays false until the report exists."
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/JOIN-503
terminal_marker: DEVICE_ENROLLMENT_RECONNECT_ACCEPTED
---

# JOIN-503 — Device Enrollment + Tokenless Routine Reconnect

> **Programme：** [README.md](./README.md)  
> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> **异步减压施工：** [../ASYNC_RELIEF_CONSTRUCTION.md](../ASYNC_RELIEF_CONSTRUCTION.md)

## 1. 目标

第一次 join 成功后，把新 PC 从“拿着某个 token 的浏览器/进程”升级为 canonical City 已登记 installation。

正常用户只配对一次：

```text
first join
→ trust approval
→ existing RF device identity / installation lifecycle enrollment
→ durable local device identity
→ future boot authenticates automatically
```

之后日常启动不得再次要求用户复制/粘贴 bare token。

## 2. 身份边界

必须复用 RF-001 已有语义：

- `device_id` = stable logical device identity；
- `installation_id` = concrete installation；
- key/fingerprint = cryptographic anchor；
- display name / OS / IP / MAC = metadata。

禁止创建：
- 第二套 user-visible permanent token；
- 第二套 device registry；
- 以 MAC/IP 作为 trust identity。

## 3. 用户可见行为

成功加入后：
- Devices 中能看到新 installation/node；
- enrollment 状态明确；
- app/agent restart 后自动重连；
- 自动重连可以内部签发短期 session credential，但用户不接触它；
- Settings 可以看到设备身份摘要与 revoke/remove action；
- manual token entry 仅保留 Advanced / Engineering fallback。

## 4. 凭据生命周期

要求：

- durable private material 不写进 repo；
- 不写进 URL；
- 不写进 ordinary UI；
- 不写进 demo/log；
- 不把 one-time pairing secret 当 durable credential；
- restart 时使用已有 device identity 证明身份并获取/恢复 session；
- credential rotation 不能要求用户重新复制 token；
- revoke 后旧 installation 自动重连失败；
- reinstall/rebind 服从 existing RF lifecycle。

具体 secure storage 按当前平台能力选择最小合适实现；若平台暂缺系统级 keystore adapter，可用明确标记的 local secure-store abstraction，但不得把 plaintext permanent token 退回 UI。

## 5. 与 Web UI 的关系

当前 Web 仍有 `sessionStorage['city-token']` 和 bare-token connect fallback。

本任务不是要求立刻删除工程 fallback，而是：

- normal onboarded PC path 不再经过手工 token 输入；
- launcher / local agent 可以把 authenticated session 交给 web surface；
- web surface 继续只持有 session-scoped credential；
- durable device key 由 device/runtime layer 持有，不塞进 browser DOM。

## 6. 允许修改

- device enrollment glue；
- platform/runtime credential store adapter；
- launcher/bootstrap path；
- session issuance/reconnect integration；
- settings revoke/remove surface；
- tests/docs/evidence。

## 7. 禁止修改

- 不改变 RF identity ownership；
- 不复制 trust registry；
- 不让 Web localStorage 保存永久 bearer token；
- 不把 token 直接写进 deep link；
- 不因 reconnect 扩大成账号/云同步系统；
- 不改 task scheduling。

## 8. 必须测试

自动至少：
1. first approved join creates/reuses canonical installation identity；
2. restart → reconnect without user-entered token；
3. expired session → refresh/re-auth internal, no UI token prompt；
4. revoke → reconnect denied；
5. revoked installation cannot silently mint new membership；
6. reinstall/rebind follows explicit lifecycle；
7. no permanent secret in DOM/log/url/repo；
8. engineering manual fallback remains isolated from default path。

## 9. 实机验收

至少 Alien + Mech：

- clean/unregistered installation 完成一次 join；
- shutdown app/agent；
- restart；
- 不输入 URL/token；
- device 自动 ONLINE；
- 从 trusted endpoint revoke；
- 再 restart；
- 自动连接失败并要求重新进入 approved pairing，而不是偷偷生成新信任。

Formal Review 必须由另一实体主机完成。

## 10. 完成门槛

`DEVICE_ENROLLMENT_RECONNECT_ACCEPTED` 只有在：
- initial enrollment；
- restart automatic reconnect；
- revoke negative path；
- secret exposure sweep；
- Development + opposite-host Review + exact-head CI；

全部通过后才可设置。
