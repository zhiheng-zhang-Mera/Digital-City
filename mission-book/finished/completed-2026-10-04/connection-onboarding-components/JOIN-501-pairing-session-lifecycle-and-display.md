---
workbook_id: JOIN-501
phase: CONNECTION_ONBOARDING
sequence: 501
execution_enabled: false
status: COMPLETE
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: ["REMOTE_FABRIC_MERGED_MAIN_CI_GREEN"]
development_host: Alien
development_branch: join/JOIN-501-pairing-session-lifecycle
development_baseline_sha: 13109b4c206feb3c1a9107b369715e84af65eaf1
development_head_sha: e925ae1ef4dda6f51d89a1faa025d1b8666d8c58
development_ci: "37116491572 COMPLETED SUCCESS on exactly e925ae1ef4dda6f51d89a1faa025d1b8666d8c58 (workflow 'V0.2 checks', jobs gateway-web + android, both success) - the branch CI run, on the head this development is handed over at."
development_complete: true
development_completion_basis: "DEVELOPMENT COMPLETE ON ALIEN. What was actually built: the temporary pairing code became a SESSION with a lifecycle instead of a render artifact. apps/web/pairing-lifecycle.js is a new state machine (IDLE -> ACTIVE -> CONSUMED/EXPIRED -> ACTIVE(new)) that owns the material and its session-scoped persistence; apps/web/app.js now reads it and no longer has ANY of the five implicit paths that used to create or destroy pairing material - go() no longer clears on navigation, pagehide PERSISTS instead of clearing, a non-ONLINE status or WebSocket reconnect no longer clears, refresh() asks the City before ending a session, and the ACTIVE control is a disabled status label rather than the old 'Revoke and refresh session' rotation button. THE OLD BEHAVIOUR WAS NOT A MISSING BUTTON: clearPairing() had no state at all, so the session could not have been stable even if the button had been hidden. ONE DEFECT WAS FOUND AND FIXED INSIDE THIS BRANCH rather than shipped: the first cut treated 'the city snapshot has no active session id' as 'your code was consumed', which on a reload (page still OFFLINE, descriptor genuinely empty) removed a perfectly valid code. The fix routes every end-of-session decision through the City's public, credential-free GET /api/v0/pairing/info and only ends a session on a definite answer; this is recorded because the defect was in this branch's own work, not inherited. LOCAL EVIDENCE: node --test tests/*.test.mjs = 1070 tests, 1068 pass, 2 fail - and BOTH failures (tests/capability-adapters.test.mjs, tests/city-roads.test.mjs, both CORRUPT_INPUT) were reproduced identically on a pristine worktree at the untouched baseline 13109b4 and resolved by hosted CI's own 'pnpm --dir city install', so they are a local environment gap in the city tree's separate parsers, not this change; the hosted run above ran the SAME suite green. New tests: tests/pairing-lifecycle.test.mjs (15 cases, no browser, pins the transition table including that ACTIVE refuses a second create) and tests/pairing-session-lifecycle-web.test.mjs (4 cases against a real gateway and msedge: zero creation calls on open/refresh/reconnect/navigate, a full reload restoring the SAME session, a consumed secret refused with 410, a SECOND process consuming the invite and driving the owner page ACTIVE -> USED by itself, and expiry that removes the material without creating anything). tests/web-v02.test.mjs was updated IN PLACE because it asserted exactly the behaviour the Owner rule removed; the replacement is stronger, not weaker - rotation is now checked with a network request counter instead of an element-state proxy, and 'clearing on navigation' became 'the same session survives navigation'. NOT DONE AND NOT CLAIMED: the opposite-host Formal Review (review_host stays null) and the second PHYSICAL host in the real-device evidence - the receiver in the tests is a second real process, not a second machine. Full record, including every unspecified choice and its judgement logic: mission-book/reports/JOIN-501/DEVELOPMENT_REPORT.md."
development_claimed_at: 2026-10-03T10:12:00Z
development_claim_basis: "CLAIMED BY ALIEN AFTER A CLAIM-TIME RECONCILIATION. MEASURED AT CLAIM TIME, NOT INHERITED: (1) Digital-City main = c913f3d + the connection-onboarding programme commits, fetched immediately before this commit, and the three JOIN workbooks read execution_enabled: true / status: READY with development_host, review_host, development_complete and review_complete all empty - so no host held a claim and this claim cannot overwrite one; (2) the dependency REMOTE_FABRIC_MERGED_MAIN_CI_GREEN is satisfied - Remote Fabric RF-001..RF-010 is merged and archived (finished/completed-2026-10-01/remote/README.md); (3) the implementation baseline is Utopia main 13109b4c206feb3c1a9107b369715e84af65eaf1, read by git ls-remote rather than from a local ref, with hosted workflow 'V0.2 checks' run 37112596448 COMPLETED SUCCESS on exactly that sha (and 'City linkage check' run 37112596441 SUCCESS on the same sha), which is what baseline_policy CLAIM_TIME_MAIN requires; (4) the workbooks are explicitly parallelisable under README section 4 with 'no sibling merge', so JOIN-501 is claimed alone rather than scooping 502/503. WHY JOIN-501 FIRST: it is the only one of the three whose Owner rule (README section 3) is stated as a CORRECTION to behaviour that already ships, and JOIN-502/503 both depend on its semantics for 'nearby discovery must not secretly mint a short code' (JOIN-502 section 6) - so fixing the lifecycle first keeps the other two from building on the behaviour the Owner rejected. THE CLAIM IS ATOMIC IN THE RULE SENSE: this commit sets development_host, and if the push loses a race the claim is withdrawn rather than forced."
review_host: Mech
review_head_sha: e925ae1ef4dda6f51d89a1faa025d1b8666d8c58
review_ci: "37116491572 COMPLETED SUCCESS on exactly e925ae1ef4dda6f51d89a1faa025d1b8666d8c58 (workflow 'V0.2 checks') - re-measured from the GitHub Actions API by head_sha at claim time rather than inherited from the development record, because a CI result belongs to the sha it ran on and not to a nearby one."
review_claim_basis: "MECH CLAIMS THE FORMAL REVIEW OF JOIN-501, ON A DIFFERENT PHYSICAL HOST FROM THE DEVELOPMENT HOST, AFTER A SECTION-7 EXACT-HEAD RECONCILIATION. MEASURED AT CLAIM TIME, not assumed: (1) development_complete reads true and development_host is Alien, so the section-3 host-independence requirement is satisfiable and this host is not the author; (2) the workbook's development_head_sha is e925ae1ef4dda6f51d89a1faa025d1b8666d8c58 and git ls-remote of refs/heads/join/JOIN-501-pairing-session-lifecycle reports the SAME sha, read from the remote rather than from a local ref, so the recorded head is the branch tip and not a superseded one; (3) hosted CI run 37116491572 on exactly that sha is COMPLETED SUCCESS, re-queried by head_sha instead of trusting the development_ci text; (4) review_host was null, so no reviewer had claimed this task and this claim overwrites nobody; (5) the whole connection-onboarding pool was re-scanned first - JOIN-501 and JOIN-503 are both development-complete with review_host null and both were developed by Alien, while JOIN-502 was developed by THIS host and therefore cannot be reviewed here. WHY JOIN-501 FIRST RATHER THAN JOIN-503: JOIN-501 states its requirements as a numbered list of twelve automatic tests plus explicit product semantics for what the Owner sees, so it can be attacked with concrete falsifiers (does the code survive a route change, a reload, a socket reconnect; can a consumed or expired session still be replaced early; is the same material shown after a reload). It is also the semantics JOIN-502 section 6 depends on, and reviewing it first keeps the programme dependency order. JOIN-503 acceptance is dominated by a dual-physical-host restart and revoke path whose honest execution belongs to the phase integration; it remains unclaimed and is the next review candidate. THE CLAIM IS ATOMIC IN THE RULE SENSE: it sets the two review fields for JOIN-501 alone, changes no development field, and if this push loses a race it is withdrawn rather than forced. review_complete stays false until the review report exists."
review_complete: true
review_result: "PASS - no required repair, on head e925ae1ef4dda6f51d89a1faa025d1b8666d8c58. THE VERDICT IS ON THAT SHA AND ONLY ON IT. Established by three things rather than by reading the development report: (1) EXACT-HEAD ALIGNMENT: the workbook development_head_sha, the remote branch tip read by ls-remote, and hosted CI run 37116491572 COMPLETED SUCCESS (branch join/JOIN-501-pairing-session-lifecycle, event push, jobs gateway-web + android) are all the same sha, re-queried by head_sha rather than inherited; (2) THE AUTHOR INSTRUMENTS WERE RE-RUN by the reviewer on a different physical host - 23 tests pass, covering all twelve numbered requirements in workbook section 6; (3) FOUR INDEPENDENT FALSIFICATION ATTACKS were built and they all FAILED TO BREAK IT, which is the result these gates want: A1 a SECOND client of the same City replaces the canonical session under a page that did nothing (the mirror of the Owner rule, untested before) - the superseded material left the page with an explanation and nothing was created; A2 the page LIVE WebSocket is closed so the product own reconnect path runs (the author tests synthetic offline/online events instead) - no creation, no rotation, same code and QR after reconnection; A3 three Generate clicks dispatched in ONE task, the worst case for a busy-flag guard - exactly one creation call and one active session; A4 the tab is HIDDEN across an expiry derived from the City own expiresAt - no code shown afterwards, terminal reason EXPIRY rather than consumption, no creation, and one genuinely new session on the next click. INSTRUMENTS ARE PUBLISHED so the claims can be re-executed: review/JOIN-501-mech-formal-review @ 4917a51, tests/join501-review-falsification.test.mjs. FINDINGS: no blocking defect; four notes recorded rather than argued away - F-1 a session replaced by another client is reported as USED (correct action, a shade less precise than replaced, and distinguishing them would need a server contract change outside this bounded scope), F-2 REASON_REVOKED is defined but no product path produces it yet, F-3 pairing.reconnect and pairing.unavailable are superseded strings still present in both packs, and F-4 THE REVIEWER OWN FIRST A4 INSTRUMENT WAS WRONG and reported two product failures that were entirely its own - a 10-minute TTL with a 20-second wait could not expire and the empty display came from an earlier attack consumption; corrected, then passing. F-4 is recorded because a reviewer measurement error must not be silently fixed inside a PASS. FULL REPORT with the gate-by-gate verdict, the test-environment observation (a bare secondary worktree shows 2 unrelated ENGINE_UNAVAILABLE city-tree failures caused by the separately installed third-party parsers, which pass in a full checkout and in hosted CI on this exact head) and the stated limits: reports/JOIN-501/REVIEW_REPORT.md."
terminal_marker_recorded: "PAIRING_SESSION_LIFECYCLE_ACCEPTED recorded by Mech on 2026-10-03, on the same day as the review, because every condition workbook section 8 names is now met: development complete (Alien), opposite-host formal review complete (Mech, a different physical host), exact-head required CI green (37116491572 on e925ae1), active-session persistence evidence complete (same session across render, refresh, reconnect, SPA navigation and a full reload), and the consumed and expired terminal states both measured - consumed by a SEPARATE PROCESS and by the page own exchange, expired by the countdown and by a hidden tab. NO IMPLICIT GENERATION was observed anywhere: every instrument counts POST /api/v0/pairing/session at the network layer, and the total across every path exercised is one call per explicit click. THIS IS NOT A MERGE: merge_authority stays false, because the programme README section 5 forbids creating the phase integration workbook - and therefore merging any sibling - until JOIN-501, JOIN-502 and JOIN-503 are ALL development-complete with opposite-host reviews and the required real-device evidence. JOIN-502 is development-complete on Mech and awaiting ITS opposite-host review (which this host cannot give, since it wrote it); JOIN-503 is development-complete on Alien and unclaimed for review. The residual phase gate is therefore unchanged by this task completion."
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/JOIN-501
terminal_marker: PAIRING_SESSION_LIFECYCLE_ACCEPTED
archived_at: 2026-10-04
archive_reason: COMPONENT_OR_MISSION_COMPLETE
---

# JOIN-501 — Pairing Session Lifecycle + Persistent Display

> **Programme：** [README.md](./README.md)  
> **常驻施工规则：** [../CONSTRUCTION_RULES.md](../../../CONSTRUCTION_RULES.md)
> **异步减压施工：** [../ASYNC_RELIEF_CONSTRUCTION.md](../../../ASYNC_RELIEF_CONSTRUCTION.md)
> **过程数据规则：** [../PROCESS_DATA_POLICY.md](../../../PROCESS_DATA_POLICY.md)

## 1. 目标

修正现有 Pairing 页的 session lifecycle，使临时配对码严格符合 Owner 语义：

```text
NO CLICK = NO CODE

click Generate
→ one ACTIVE session
→ same code stays visible
→ consumed OR expired
→ code removed
→ Generate becomes available again
```

这不是 crypto redesign，而是 existing RF pairing session 的产品生命周期落地。

## 2. 当前真实代码基线

当前 `apps/web/app.js` 已经做到：

- `pairing === null` 时不渲染 QR/shortCode/shareable invite；
- 点击 `#generate-pairing` 后请求 `pairing/session`；
- active pairing 有 countdown；
- `expiresAt` 到期后 `clearPairing('pairing.expired')`。

但仍需修正：

- `go(next)` 当前会无条件 clear pairing；
- `pagehide` 当前会 clear pairing；
- reconnect/status path 可能提前 clear pairing；
- active pairing button 当前显示 Refresh 并可生成新 session；
- consumed event 必须明确驱动 UI 清除，不能只靠过期。

## 3. Owner 硬约束

### 3.1 禁止隐式生成

以下动作绝对不得调用 pairing-session creation：

- 打开 Pairing 页面；
- route change；
- City refresh；
- websocket reconnect；
- app boot；
- discovery result；
- node online/offline event；
- countdown tick。

唯一正常入口：用户主动点击 Generate。

### 3.2 ACTIVE 期间不可换码

ACTIVE 时必须：

- 继续展示同一 `pairingSessionId`；
- 继续展示同一 `shortCode`；
- 继续展示同一 QR/invite payload；
- countdown 只减少剩余时间；
- Generate/Refresh 不得创建下一 session。

推荐 UI：
- 隐藏 Generate；
- 或 disabled button = `配对码有效中`；
- 可显示 expiry 倒计时。

不得提供 `Refresh` 语义替换有效 code。

### 3.3 ACTIVE 显示持久性

以下动作不得清除有效 pairing display：

- normal render；
- snapshot refresh；
- websocket reconnect；
- SPA page navigation + return；
- unrelated Settings / Devices state update。

如果 full reload 后实现恢复：
- 恢复原 ACTIVE material；
- 校验 expiresAt；
- 若已过期则进入 EXPIRED；
- 不得生成新 session。

不得用 `localStorage` 把临时配对材料变成长期 credential。优先 tab/app-session scoped persistence。

### 3.4 Consumption

当该 session 被成功 exchange / claim：
- server/canonical pairing state 标记 consumed；
- owner page 尽快收到 event / refresh observation；
- 清除显示 material；
- 状态明确为 USED；
- Generate 再次可用。

同一个 consumed secret 再用必须失败。

### 3.5 Expiry

到期：
- 清除 active material；
- 显示 EXPIRED；
- Generate 再次可用；
- **不得自动再生成**。

## 4. 允许修改边界

允许：
- `apps/web/app.js` pairing-specific state/render/handlers；
- pairing-specific i18n；
- pairing API adapter / event handling；
- existing pairing service 的最小 lifecycle repair；
- pairing-specific tests；
- docs/evidence。

若 current canonical server API 缺少“session consumed / active session state”最小读取能力，可添加 bounded endpoint/event；不得新造第二套 trust store。

## 5. 禁止修改边界

- 不重写 RF-002 / RF-005；
- 不改 transport routing；
- 不改 scheduler/task semantics；
- 不因 pairing UI 顺手重做全站 UI；
- 不降低 one-time secret / expiry 安全语义；
- 不把 bare token 暴露到 Pairing 页面。

## 6. 必须测试

自动测试至少覆盖：

1. enter Pairing page → creation API call count = 0；
2. render/refresh/reconnect → creation API call count remains 0；
3. explicit Generate once → exactly one session；
4. ACTIVE + ordinary re-render → same id/code/payload；
5. ACTIVE + SPA navigate away/back → same active session remains；
6. ACTIVE → no Refresh-caused new session；
7. consume → material disappears + USED + Generate available；
8. consumed secret reuse rejected；
9. expire → material disappears + EXPIRED + Generate available；
10. expire event itself does not call create；
11. post-expiry second explicit click → one new, different session；
12. no permanent/bare token rendered in pairing material。

## 7. 实机验收

Development host：
- 生成一次 code；
- 在倒计时有效期内触发至少一次 City refresh、一次页面内导航返回、一次 WebSocket reconnect；
- 证明 code/session 没变；
- 用另一真实 endpoint 消费；
- 证明 owner page 从 ACTIVE → USED。

Formal Review 必须由另一实体主机：
- 独立重复；
- 特别尝试通过 route/reload/reconnect 让 code 提前消失或偷偷换码；
- 若发现 defect，直接 bounded repair + regression test。

## 8. 完成门槛

`PAIRING_SESSION_LIFECYCLE_ACCEPTED` 只有在：

- Development complete；
- opposite-host Review complete；
- required CI green；
- active-session persistence evidence complete；
- consumed + expired 两条终态都实测；
- 无隐式 generation；

全部满足后才可设置。
