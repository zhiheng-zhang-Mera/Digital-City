# Historical cross-network S1–S3 integration ledger — full English reading

[Chinese source](../RELAY_TUNNEL_S1_S3.md). Generated 2026-10-04 by Alien. Historical authority: NEXT_ROUND S1–3 and discipline, with Owner waiver permitting direct integration logs rather than a new workbook. Source code landed on Utopia main f3756ba. This reading does not reactivate those historical tasks or reinterpret their local tests as current cross-network acceptance.

## 0. Three matters reported to Owner first

1. CONNECTION_ONBOARDING_INTEGRATION prose was irreversibly encoding-damaged and pushed. The source described lines 1–73; no rewrite in that round, only readable pointers/recovery advice to avoid replacing Owner history with reconstruction. It requested Owner decision to retain or reconstruct (§5).
2. relay-in-city gained real transport: City admits outbound peers, pushes join payloads and returns execution answers; nine new tests and two-City grouping provide evidence (§2/4).
3. S4 real two-host/two-network acceptance was not performed, requires another physical host/network, explicitly DEFERRED (§6).

## 1. Starting state and retained decisions

Start a7bab55 had tested relay.mjs and choosePath returning relay-in-city, but no dialer, so UI named a nonexistent mechanism. Retained priority: same-network direct > outbound relay > existing overlay > port forwarding with cost > public relay explicitly refused > no route. Group needs hardest member's path; estimates never enter carrier score. Only S1 gateway wiring, S2 client dialer, S3 payload reuse, with problems/options recorded.

## 2. Implementation

### S1 — Gateway admits outbound dialing

/api/v0/relay WebSocket lets the unreachable PC dial outward and register a peer. Admission reuses existing City credentials:

| Presented material | City decision | peerRef origin |
|---|---|---|
| JOIN-503 sess credential | Resolve enrollment registry | Actual session installationId, not peer claim |
| Control token | Accept Owner machine | Declared ref with control: prefix |
| Nothing | Accept prospective joiner | Declared installationId |

Anonymous admission is needed because a PC requesting membership has no credential. join/request already public; forwarding adds no authority. RELAY_PAYLOAD_PATHS whitelists four join handshake routes and JOIN-503 tokenless-session route; other paths typed 403. It is not an arbitrary-machine/open proxy, stores no state and is not a second trust store. Dialing peers declare clientUrl for their City; pushes carry it, leaving decisions with the City holding that peer (two-City test §4.6).

### S2 — apps/web/relay-dial.mjs

DialRelay waits City's RELAY_READY rather than socket open: a connection opened then refused must not appear usable. forward sends existing join payload, with RELAY_UNREACHABLE/RELAY_TIMEOUT/RELAY_PATH_REFUSED/RELAY_DIAL_CLOSED and fallback:true so UI can explain and fall back. Reverse direction serves City pushes, executing at the payload's City and returning through the same pipe. This is the half City needs but cannot initiate, absent in a pure client/server design. network-path relay-in-city actions carry relayHost/relayPort/relayCityRef because “dial outward” alone is not executable; obsolete unimplemented-transport comment corrected.

### S3 — existing wire payload

Forward {path,body} where path is existing City route and body existing joinApi request. JOIN-502 admission, one-time claim and Owner approval unchanged; relay forwards only. Carry method: POST join/request, GET join/info. Forcing one method would make the other appear healthy while returning 404.

## 3. Choices and costs

| Question | Choice | Cost of alternative |
|---|---|---|
| Credential required for admission? | No, payload-restricted | Unjoined PC could never dial in |
| Presented but unresolvable credential | Refuse, no anonymous downgrade | Revoked device would keep its pipe |
| Frame names | relay-push/request/answer by direction | Same name lets City read own push as foreign request |
| Return answer to dialer | deliver back into pipe | Dialer's wait is in its own table; local City cannot settle it |
| Push execution address, first design | Peer clientUrl, otherwise local City | Wrong address records request in relay while status codes look normal; corrected by N2 below |

## 4. Observations

```text
main（本轮）                f3756ba        已推送（a7bab55..f3756ba）
全量测试                    1164 tests / 1164 pass / 0 fail   （起点 1155，本轮 +9）
check-bilingual             docs / evidence / data-records   三个 PAIR_STATUS = SYNCHRONIZED
新增测试文件                tests/relay-s1-tunnel.test.mjs   9 项
改写的旧断言                tests/relay.test.mjs 帧类型断言（改写并就地写明理由，不是删除）
hosted CI                   ★ 未取得：本轮未等待 GitHub Actions 结果，见 §6「未验证」
```

At f3756ba pushed from a7bab55: full suite 1164/1164, 0 failures (starting count 1155, +9); all 3 language pairs synchronized; relay-s1-tunnel: 9 tests; old relay frame assertion rewritten with rationale, not deleted; hosted CI not obtained/not awaited.

Nine guarded boundaries:

1. Anonymous peers are admitted with RELAY_READY, a City-chosen ref and allowed paths.
2. Session refs come from the registry; control credentials are accepted, and bad credentials are refused.
3. A real join request leads to Owner-authenticated approval and credential release; reusing the claim returns 410.
4. Unapproved requests release no credential (409).
5. Non-whitelisted paths are refused before dialing; a nonexistent target returns 404 with a reason.
6. The request traverses the relay but is recorded and approved at its owning City; nothing is recorded at the relay.
7. A City 400 response remains 400, rather than becoming a generic relay error.
8. A reverse payload executes in its City and returns through the same pipe.
9. Missing refs and credentials, or incompatible versions, are refused with readable explanations.

## 5. Encoding defect: earlier ledger irreversibly damaged

Found by reading the prior ledger under NEXT_ROUND discipline. Historical survey of 56 Markdown files: only that file damaged, including origin main. Git-version measurements:

| Commit | First-line state | Bytes |
|---|---|---:|
|1abe534|Normal Chinese onboarding integration title|3965|
|0b50398|UTF-8 decoded as GBK, classic mojibake|4991|
|16b6999|Another wrong conversion|8883|
|3fd47b4|Same deeper conversion|15142|
|26f9194|Same at then-current version|23601|

Invalid bytes became question marks, destroying content; inverse UTF8/GBK attempts did not restore legal original even in earlier versions. Fully recoverable: pre-1abe534 body and ASCII commit/CI/count/inline-code across versions. Chinese prose was lost. That round did not rewrite the file, only recorded damage. Suggested explicitly labeled reconstruction from readable remnants and verifiable current facts, subject to Owner decision. Today's documentation retains raw bytes behind a readable bilingual facade; unknown prose is not inferred.

## 6. Unverified / DEFERRED at first round

S4 real two-networks/two-hosts remained DEFERRED: need two actual hosts/networks (e.g. hotspot + home broadband), one unreachable inbound. Local real Gateway/WebSocket end-to-end and two City instances are not physical cross-network PASS. Hosted CI unavailable, local PASS cannot attest to f3756ba CI. UI last hop not wired: connect-surface already chooses relay with target, but app.js still navigates target origin; dial-outbound button→relay-dial→join/request remained unfinished. Source reported precommit token scan clean, not a current whole-history security claim.

## 7. Historical next-round entry

1 decide damaged-ledger handling;2 wire app.js relay action so the different-network button actually dials/forwards joining with QR/code fallback and reasons;3 fill f3756ba hosted runs when available;4 perform and separately record S4 when real hosts/networks are available, including limitations.

## N2 append — UI wiring and local joint validation, second round

This round landed on main fa85dcd and completed the earlier missing UI hop.

### A. A decision becomes executable

| Link | Before | After |
|---|---|---|
| Connection-row button | Navigate to target origin, unreachable across networks | With relay reach, local City dials and sends the request while user stays on the page |
| UI language | Waiting for approval only | DIALING, waiting through relay and unreachable relay each have bilingual messages |
| Other-City credentials | No delivery location | Deliver via #handoff fragment, never query, then connect to that City |
| Failure | Silent | Show refusal or expiry; relay failure falls back to QR/code/invite, preserving working entries |

relay-join.mjs turns cross-network joining into a pure flow with injected forward. First inspect target capabilities: a request nobody can approve is worse than no request. Send existing join payloads and report each terminal state honestly: refusal is not unreachable, expiry is not refusal. Exchange credentials only for APPROVED. The flow stores no credentials and retries nothing itself.

### B. Correcting execution location

Earlier code pushed the request to the peer named in the frame. It looked reasonable but could never admit anyone: by definition the dialer cannot be reached from outside. Asking it to execute a join request against another City asks the only host without a route to use that route. Now the relay City executes the payload with its own handler, bounded by a per-peer rate limit. The correction is recorded to prevent recurrence.

### C. Measurements

```text
main（本轮）              fa85dcd              已推送
全量测试                  1168 tests / 1168 pass / 0 fail    （上一轮 1164；本轮 +4）
中继套件                  tests/relay-s1-tunnel.test.mjs    12 项
本机双 City 联机          tests/link-local-two-city.test.mjs 1 项（8 个断言阶段全过）
真实浏览器检查            npm run check:browser-relay       PASS，页面错误 0
check-bilingual           docs / evidence / data-records    SYNCHRONIZED
hosted CI                 ★ 仍未取得（本地 PASS 不替代）
```

At fa85dcd:1168 tests pass, zero fail, four added after1164. Relay suite12; one local two-City test passes all eight assertion stages; real-browser relay check passes with zero page errors; language pairs synchronized. Hosted CI remained unavailable and local PASS does not substitute.

Exact local chain, with two independent City processes, stores and identities:

```text
[1] City-B 向 City-A 拨出（NAT 允许的方向）：peerRef=city-b-installation
[2] 申请沿管道抵达 City-A：status=200 state=PENDING
[3] City-A 在**自己的**认证界面看到申请
[4] owner 在 City-A 批准：200
[5] 凭据沿同一管道释放（一次性 claim）
[6] 该凭据在 City-A 上可用：/api/v0/city → 200
[7] 重放已用 claim：410（City 自己的状态，不是"中继失败"）
[8] City-B 自己没有记录这条申请（管道不是第二个 trust store）
```

1. City B dials City A outward, the NAT-compatible direction, with peerRef city-b-installation.
2. Request reaches A:200 PENDING.
3. A sees it in its own authenticated UI.
4. Owner approves on A:200.
5. Credential is released through the same pipe with a one-time claim.
6. Credential works on A: /api/v0/city returns200.
7. Reusing the claim returns410 from City, not a generic relay failure.
8. B records no join request: the pipe is not another trust store.

Real Edge/CDP, without new dependencies, verifies zero page-load errors, correct connection UI, a page-created pipe (page-install), request arrival and approval on A, and zero errors after the whole flow.

### D. Self-authored defects

1. askToJoin used dialRelay but imported only relay-join.mjs. Missing dialRelay prevented the whole page from initializing although all unit tests passed. Fixed; browser-relay-check remains a standing check.
2. Wrong execution location put the request in the wrong City despite normal status codes.
3. joinCityOverRelay reported APPROVED twice, adding a sequence step that never happened.
4. The browser instrument attached an error listener to a context destroyed by navigation, returning undefined rather than the real page error.
5. The repair itself used Set-Content UTF-8 on app.js with ANSI decoding, corrupting Chinese comments. Node rewrote it and checks showed six Chinese locations, zero mojibake and no BOM. This is the same accident class as the damaged ledger.

### E. Deferred

Physical two-host cross-network acceptance remained DEFERRED. Everything ran on local loopback; NAT, routers, metered links and two real PCs were not tested. Hosted f3756ba/fa85dcd verdicts remained unfilled. Browser checks drove window.utopiaRelay directly, using the button's functions, without discovering a remote PC and clicking its row; that requires a real remote mDNS row unavailable locally. The source reports its precommit token-value check.

## N3 append — pairing UI and pasteable invitations, third round

Owner's three real-use reports led to main afe9596, including 024ca0a.

### A. Reports, causes and remedies

No visible pair-code entry: it existed inside #pair, but connection hid the entire panel exactly when users needed it. One definition now renders twice, on the unconnected first screen and connected pairing page via renderPairCodeCard. Different ID prefixes prevent querySelector from selecting the hidden copy.

No active LAN search: #connect-rescan already existed but wording and result guidance were weak. Rename to “Search computers on this network”, point the list to it and retain the initial automatic scan so new users do not face an empty panel.

Shared invitation could not be pasted into a browser: utopia://pair is a custom protocol and ordinary address bars did nothing. Pairing now also emits inviteUrl, an ordinary HTTP(S) link to the source City, displayed as a real hyperlink with Copy Link. The utopia:// payload remains for QR/Android deep links and in folded details.

The receiving PC sees one confirmation naming the source machine; a click completes pairing. Opening does not automatically switch City. The one-time key is immediately removed from the address bar, like the existing #pair fragment.

Disclosed trade-off: the key now enters a URL that a server might log. It is bounded by single use, short TTL, one session and lockout after five attempts. The alternative was an unusable sharing path on ordinary Windows PCs. This is an explicit choice.

### B. Measurements

```text
main（本轮）            afe9596（含 024ca0a）        已推送
全量测试                1172 tests / 1172 pass / 0 fail      （上一轮 1168；本轮 +4）
新增测试                tests/pairing-invite-link.test.mjs   4 项
真实浏览器检查          npm run check:browser-relay          18/18 PASS（含完整"生成链接 → 打开链接 → 确认即配对"）
check-bilingual         docs / evidence / data-records       SYNCHRONIZED
hosted CI               ★ 仍未取得（本地 PASS 不替代）
```

Full suite: 1172 tests pass, zero fail, four added after 1168. New pairing-invite-link suite has four tests. Real-browser check 18/18 includes generate link→open→confirm→pair. Language pairs synchronized; hosted CI still unavailable.

Edge/CDP tests show visible entries when disconnected and connected, a bare six-digit code explicitly rejected as not a link, a real selectable HTTP invitation, one confirmation naming the source, key removed from address bar, and online state after clicking. Both paths have zero page errors; no new dependencies.

### C. Self-authored defects

1. beginPairingFromInvite silently discarded every pasted link. ?pair contains an encoded inner query (v=1&host=…), but parseInvite expects the utopia://pair prefix. Deep link and web URL wrap the same material differently. A valid payload was discarded on the next line without error; actual browser testing caught what units missed.
2. Duplicate IDs broke four JOIN-501 acceptance checks because pairing-code matched two elements; that ID originally meant the six-digit display. The swap prefix fixed it.
3. Browser-tool defects: accessing sessionStorage at opaque about:blank and attaching an error listener to a navigation-destroyed context. Both were instrument defects, not product defects.
4. pairing.linkHint was used before declaration in language packs and caught by key coverage.

### D. Unverified

Physical cross-network two-host acceptance remains DEFERRED. All testing was local; the second PC was the same browser navigating to the link, not another machine/network. Full remote-discovery-row DOM clicking remained untested. Hosted f3756ba/fa85dcd/024ca0a/afe9596 verdicts were unfilled; cloud sync remained at a7bab55. Automated tests and the author's judgment do not prove human impressions. The Owner must try whether the connection feels direct on two real Windows PCs.

## Launcher append — clone and double-click, fourth round

Owner requested default direct startup, preparation only for missing dependencies under project-root dependence, and normal opening after a fresh clone on any host. Work landed at acf7763.

### A. Start first; prepare only when necessary

1. Always find Node: cached dependence/node, then PATH, then actual known local locations.
2. Only when no Node exists, download/extract under dependence. Prefer npmmirror with nodejs.org fallback. Delete failed partial downloads so file existence cannot falsely skip the next attempt.
3. Node reads package.json and identifies absent node_modules packages; install only when missing.
4. Always start City.

Do not duplicate the dependency list in batch; it would stale on the first added package. node_modules contains standard packages. dependence contains runtime, npm cache, probes and launcher.log. Both are ignored by Git and created only when needed.

### B. Actual clone evidence

```text
node_modules 存在: False      dependence 存在: False
启动后:
  node: found on PATH
  Missing package(s): bonjour-service qrcode ws
  Installing into node_modules\ - first run only, this can take a minute ...
  packages: installed.
  City endpoint : http://<lan-ip>:4391
dependence 内容: npm-cache, .env-probe, launcher.log
```

A real temporary clone had neither directory. Node was found on PATH; bonjour-service, qrcode and ws were missing and installed; City endpoint appeared. dependence held npm-cache, .env-probe and launcher.log. With complete packages, startup reported OK without network/install. Bootstrap no longer generated package-lock: no lock means --package-lock=false, preserving the worktree. Actual clone CMD line endings CR223/LF223 prove CRLF.

### C. Self-authored defects

1. Initial Chinese batch messages were parsed as command fragments by cmd.exe's OEM/ANSI code page. Use pure ASCII/English batch and Chinese README.
2. LF endings also broke cmd. Write CRLF and assert it during file generation.
3. A nested node -p command inside for/f returned v0 locally. Node now writes dependence/.env-probe and batch reads lines; avoid fragile nested quoting.
4. Initial npm install created package-lock in checkout. With exact declared versions, --package-lock=false avoids bootstrap edits.
5. Attributes specified CRLF for bat only; cmd inherited automatic LF. Local CRLF masked failure on a fresh clone. Add *.cmd text eol=crlf and verify an actual clone.

### D. Deferred

The no-Node download/extract branch was not physically executed because local Node existed; only code and failure design were checked. Offline/proxy bootstrap needs packages, with failures pointing to launcher.log and HTTPS_PROXY. Entirely offline opening is not established; prebundled dependencies would be another decision. Installation was checked only on the local network, three packages in roughly ten seconds.

## No-console launcher append — fifth round

Previous 987a1ce clone/double-click work had a broken missing-dependency probe for launch without a console: shortcuts, scheduled tasks and Start-Process output redirection. Repair landed at 69a097b.

### A. Two self-authored causes

```text
系统找不到指定的路径。        （the system cannot find the path specified）
句柄无效。                    （invalid handle）
```

Reported errors were “the system cannot find the path specified” and “invalid handle”. A for/f command creates a pipe requiring console handles absent in a no-console process. The probe never ran, MISSING stayed empty, the launcher declared packages OK and started with nothing installed. Now Node redirects answers to a file and batch reads it; > needs no console handle. Delete old output first and read only if present, so a stale answer cannot represent this run.

No answer cannot mean no work, even after fixing the probe. Missing/empty node_modules itself triggers npm. Batch does not tell npm which packages: npm reads the whole package.json declaration; batch only chooses whether to invoke it. If modules are populated but probe unavailable, disclose and start; the application reports missing modules more precisely.

### B. Instrument noise

Several runs wrote the same log, making old text look like current output and causing two unnecessary repairs. Unique filenames showed both console and no-console paths reporting packages OK. The launcher was already correct; measurement was wrong.

### C. Verification by fresh setup

```text
全新 clone（临时目录，既无 node_modules 也无 dependence）:
  Missing package(s): bonjour-service qrcode ws
  packages: installed.
  City endpoint : http://<lan-ip>:4391
依赖齐全:
  有控制台      packages: OK - starting now.
  无控制台      packages: OK - starting now.
行尾:
  真实 clone 拿到的 Utopia.cmd 是 CRLF（acf7763 修的 .gitattributes），否则它根本跑不起来
```

A fresh temporary local clone without node_modules/dependence installed the three packages and exposed City endpoint. With packages present, both console/no-console paths reported OK. Clone Utopia.cmd was CRLF due to acf7763's attribute repair. Desktop launcher now hands off to project launcher, including runtime acquisition/dependency install; direct application launch is fallback only when Utopia.cmd is absent.

### D. Still deferred

No-Node acquisition remains unexecuted on hardware. Offline/proxy environment still requires package access; failures expose log location and HTTPS_PROXY, not a claim of offline readiness. An independent clean Windows host cloning from GitHub was not tested: this was a local clone, so GitHub transport and npm retrieval on another host remain unverified.
