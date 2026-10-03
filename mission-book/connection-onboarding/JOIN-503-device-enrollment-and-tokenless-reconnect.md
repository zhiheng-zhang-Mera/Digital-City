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
development_head_sha: ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7
development_ci: "37117241912 COMPLETED SUCCESS on exactly ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7 (workflow 'V0.2 checks', jobs gateway-web + android, both success)."
development_complete: true
development_completion_basis: "DEVELOPMENT COMPLETE ON ALIEN. WHAT WAS BUILT: the City gained an enrollment registry (services/dev-gateway/enrollment.mjs) that is a SEAM over the City's own RF-001 identity lifecycle in city/00-foundation/02-city-node-network/device-identity - not a second registry. A joining installation declares itself in the pairing exchange it already performs, so ONE join enrolls a logical device plus a concrete installation; the durable installation credential is minted once, returned once, and stored by the device layer (apps/client/device-enrollment.mjs, .runtime/device-enrollment.json, 0600, git-ignored); the browser receives only a short-lived sess: credential through the URL fragment and keeps it in sessionStorage. auth() routes a sess: bearer to the registry and re-checks it on EVERY request (never cached), so revoke is immediate rather than 'at next restart'; a revoked installation cannot mint new membership, and a reinstall stays UNBOUND until an explicit rebind carrying proof (RF-001's rule). TWO DEFECTS WERE FOUND AND FIXED INSIDE THIS BRANCH rather than shipped, both recorded in the report: POST /device/session is an AUTHENTICATION endpoint and was wrongly gated behind auth() (which made every reconnect 401), and a remembered City endpoint is not an identity, so a City restarted on a new port was misreported as unreachable until the caller could supply the address it can actually reach. LOCAL EVIDENCE: node --test tests/*.test.mjs = 1080 tests, 1078 pass, 2 fail - the same two (capability-adapters, city-roads, CORRUPT_INPUT) already proven pre-existing on a pristine baseline worktree and resolved by hosted CI's own city-tree install; the hosted run above ran the same suite green. New: tests/join503-enrollment.test.mjs, 9 cases over the REAL gateway covering the workbook section 8 list one by one (enrollment; restart reconnect with nothing typed; expired session re-auth with no token prompt; revoke denying reconnect; revoked installation unable to mint membership; reinstall unbound until explicit rebind; a secret-exposure sweep over snapshot/events/persisted records/QR/URLs; the manual control-token fallback still isolated and working; plus clone detection as a named refusal AND a canonical event). NOT DONE AND NOT CLAIMED: the opposite-host Formal Review (review_host stays null), the dual-PHYSICAL-host acceptance section 9 requires (single-host multi-process evidence only), and dedicated browser coverage of the NEW Settings device panel - the suite's browser tests pass but none drives that panel, so it is recorded as unverified rather than implied. Every unspecified choice and its judgement logic: mission-book/reports/JOIN-503/DEVELOPMENT_REPORT.md."
development_baseline_sha: 13109b4c206feb3c1a9107b369715e84af65eaf1
development_claimed_at: 2026-10-03T10:55:00Z
development_claim_basis: "CLAIMED BY ALIEN AFTER A CLAIM-TIME RE-SCAN OF THE LATEST Digital-City main. MEASURED AT CLAIM TIME, NOT INHERITED: (1) the three-JOIN pool now reads - JOIN-501 development complete on Alien (review_host null), JOIN-502 development_host Mech with status IN_PROGRESS, JOIN-503 development_host null - so exactly one development lane is unclaimed and this claim cannot overwrite Mech's; every review_host is still null, and review is deliberately NOT taken here (see below); (2) the dependency REMOTE_FABRIC_MERGED_MAIN_CI_GREEN is satisfied - RF-001..RF-010 merged and archived, and this task's identity semantics are RF-001's (device_id / installation_id / fingerprint), which section 2 requires be REUSED rather than re-invented; (3) the implementation baseline is Utopia main 13109b4c206feb3c1a9107b369715e84af65eaf1, re-read by git ls-remote immediately before this commit (unchanged since the JOIN-501 claim - no merge has landed in between), with hosted 'V0.2 checks' run 37112596448 and 'City linkage check' run 37112596441 both SUCCESS on exactly that sha, which is what baseline_policy CLAIM_TIME_MAIN requires; (4) no refs/heads/join/JOIN-503* exists on the remote yet. WHY ALIEN TAKES THE WORKBOOK MECH DEFERRED: Mech's claim commit for JOIN-502 records that it chose 502 over 503 because 503 'needs a durable identity plus credential store and a tokenless-reconnect acceptance that is not honestly provable from one host' - the second half of that is CORRECT and is not disputed: the dual-physical-host reconnect/revoke acceptance in section 9 stays DEFERRED and this host will not fake it. The first half is not a reason to leave the workbook unclaimed: the identity and credential-store work is code plus tests, and it is exactly the part that must exist before any host can prove the acceptance. So the claim is: build and prove on one host everything the workbook's section 8 auto-test list can decide, prove the negative paths (expired session re-auth without a UI prompt, revoke denies reconnect, no permanent secret in DOM/log/url/repo), and hand the dual-host acceptance to whichever second host is next online. SCOPE OVERLAP WITH MECH'S JOIN-502 IS ACKNOWLEDGED: 502 owns first-run/disconnected discovery presentation, 503 owns enrollment/reconnect plumbing and Settings revoke; this claim touches engine/runtime identity, the launcher/bootstrap path, session issuance glue and the Settings device summary, and will NOT build a second discovery surface or a second pairing/trust store. THE CLAIM IS ATOMIC IN THE RULE SENSE: this commit sets development_host, and if the push loses a race the claim is withdrawn rather than forced."
review_host: Mech
review_head_sha: ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7
review_ci: "37117241912 COMPLETED SUCCESS on exactly ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7 (workflow 'V0.2 checks', branch join/JOIN-503-device-enrollment-and-tokenless-reconnect) - re-queried from the GitHub Actions API by head_sha at claim time rather than inherited from the development record."
review_claim_basis: "MECH CLAIMS THE FORMAL REVIEW OF JOIN-503, ON A DIFFERENT PHYSICAL HOST FROM THE DEVELOPMENT HOST, AFTER A SECTION-7 EXACT-HEAD RECONCILIATION - the SECOND review this host takes, after JOIN-501 was reviewed to PASS with its report published. MEASURED AT CLAIM TIME, not assumed: (1) development_complete reads true and development_host is Alien, so section-3 host independence holds and this host is not the author; (2) the workbook development_head_sha is ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7 and git ls-remote of refs/heads/join/JOIN-503-device-enrollment-and-tokenless-reconnect reports the SAME sha, read from the remote rather than a local ref; (3) hosted CI run 37117241912 on exactly that sha is COMPLETED SUCCESS on that branch, re-queried by head_sha; (4) review_host was null, so no reviewer had claimed it and this claim overwrites nobody. WHY THIS TASK AND WHY THE POOL IS OTHERWISE CLOSED TO THIS HOST: the full connection-onboarding pool was re-scanned first - JOIN-501 is development-complete AND review-complete (this host reviewed it to PASS), JOIN-502 is development-complete on THIS host and therefore cannot be reviewed here at all per section 3, and JOIN-503 is development-complete on Alien with review_host null, which is the only remaining lane this host is eligible for. REVIEWING RATHER THAN DEVELOPING is the correct role here: JOIN-503 development is already complete and its claim is Alien's, and section 12 forbids another host from clearing or re-taking another host's development claim. WHAT THIS REVIEW CAN AND CANNOT HONESTLY SETTLE, DECLARED BEFORE IT RUNS: JOIN-503 section 9 acceptance requires two PHYSICAL hosts (join on one, revoke from another, restart, prove automatic reconnect). This reviewer has one host, so what is honestly provable here is the code, the identity seam over RF-001, the automatic-reconnect mechanism, the revocation negative path and the secret-exposure sweep; the two-machine topology is DEFERRED to the phase integration and will be recorded as deferred rather than passed. THE CLAIM IS ATOMIC IN THE RULE SENSE: it sets the two review fields for JOIN-503 alone, changes no development field, and if this push loses a race it is withdrawn rather than forced. review_complete stays false until the report exists."
review_complete: false
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
