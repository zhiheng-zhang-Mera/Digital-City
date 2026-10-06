# Utopia historical construction handoff — full English reading

[Chinese historical source](../NEXT_ROUND.md). Generated 2026-10-04 by Alien. The original repeats sections1–6 after a broken shell quotation; this reading consolidates those identical repetitions while covering every distinct instruction/fact. It is historical context, not today's unique entry or new authorization. Current workbooks govern current work. Historical plaintext credential values are redacted in both source and reading.

Original authority order: Owner ruling > construction rules > current workbook > frontmatter/reports > README boards. The handoff intended to preserve session goals, actual state, next action and discipline after compaction.

## 1. Historical session goals — all thirteen

1. Execute GitHub Digital-City/mission-book task lists and claim rules.
2. Claim as Alien; Android Studio allowed. If Android acceptance requires observation, loading Computer Use in the application installation directory was allowed.
3. Claim next task autonomously after completion.
4. At 75% of the context limit, automatically condense earliest 50% and replace it. This preserves the original request, not a claim that runtime controls implement it.
5. Unspecified choices use best judgment, recording problems/options/reasoning under the workbook.
6. Confirm latest repository before every claim.
7. Chinese replies throughout that chat.
8. That historical chat executed connection-onboarding only.
9. Resident City; clean submitted artifacts; City live-test logs in GitHub; wait Mech for 5 minutes and begin final joint test on arrival.
10. Integration repair with multiple convenient remote-join paths in client port UI for any number of PCs, no fixed two-PC list. Two PCs mean independently started unconnected Utopia hosts; after joining, same City and mutually visible online devices. Choose carrier by combined network/hardware fitness.
11. Same network/same room, same network/different room, different networks/cities, broadband/WiFi.
12. JOIN-502 second UI review first, then cross-network transport; skip new final-integration/merge/tunnel workbooks.
13. Compact existing context to retain this guidance and hand to next round.

## 2. Historical cloud/runtime state

### Utopia implementation

```text
main = fa85dcd   （已推送；本轮全部产物在此）
全量测试        1168 tests / 1168 pass / 0 fail   （S1-S3 轮为 1164）
check-bilingual docs / evidence / data-records 三个 SYNCHRONIZED
真实浏览器检查  npm run check:browser-relay  PASS（Edge + CDP，页面错误 0）
hosted CI       ★ 仍未取得（本地 PASS 不能替代 hosted CI，故不宣称绿）
                ★ 另注：UTOPIA_LIVE_STATUS 停在 a7bab55，云端的 5 分钟同步工作流本轮**没有运行**
本机 worktree   D:/A-Utopia [main]（干净）
```

At source time, main fa85dcd pushed; full suite 1168/1168 (no failures), earlier S1–3 had 1164; docs/evidence/data-records SYNCHRONIZED; real Edge/CDP relay-browser check PASS/zero page errors. Hosted CI not obtained, local PASS cannot replace it. Live-status remained a7bab55 because cloud 5-minute sync had not run. Local D:/A-Utopia main was clean.

Main included JOIN-501 session lifecycle,502 join/approval,503 enrollment/tokenless reconnect, connect-surface/primary-city/network-path UI, relay.mjs transport, S1–3 cross-network wiring and N2 last UI hop.

### City control repository

```text
main = 51ec0c7   （已推送）
mission-book/finished/completed-2026-10-06/connection-onboarding/JOIN-501/502/503  三个工作书 review_complete: true，终态已记录
mission-book/reports/JOIN-50x/                       开发/复核/复检报告
mission-book/logs/city-live-test/                    联机测试日志目录（Owner 要求建在云端）
mission-book/logs/integration/                       ★ 集成台账
    · RELAY_TUNNEL_S1_S3.md                          ★ 记录（S1-S3 + N2、判断逻辑、执行位置修正、缺陷、DEFERRED）
    · CONNECTION_ONBOARDING_INTEGRATION.md           ★ 正文已损坏，已插入警告块（见 §五）
mission-book/UTOPIA_LIVE_STATUS.md · .json           由工作流每 5 分钟自动刷新（会先显示 a7bab55，随后变 f3756ba）
```

City main 51ec0c7 pushed; JOIN-501/502/503 review_complete true with terminal records. JOIN-50x reports, live-test logs, integration ledger and damaged earlier onboarding ledger. Live-status MD/JSON scheduled 5-minute refresh, expected a7bab55→f3756ba. Owner waived integration workbook for this historical phase, with grounds in integration logs.

### Environment facts then

```text
City 令牌（Owner 提供）    控制令牌 [REDACTED]   节点令牌 [REDACTED]   （勿写入任何 Git 对象）
City 启动                  D:\A-Utopia\Utopia.cmd（已自定位 node 运行时；node 不在用户/系统 PATH，
                           实际在 D:\DS-Hns\runtime\node-v24.14.1-win-x64\node.exe）
桌面入口                   C:\Users\15601\OneDrive\Desktop\Utopia.cmd
City 当前状态              已断开（Owner 指示断开）
```

Owner-supplied control/node token values are now REDACTED, not reproduced. City starts from D:/A-Utopia/Utopia.cmd with self-located Node runtime; Node was absent from user/system PATH and actually D:/DS-Hns/runtime/node-v24.14.1-win-x64/node.exe. Desktop entry C:/Users/15601/OneDrive/Desktop/Utopia.cmd. City then disconnected by Owner instruction. These are historical, not current runtime identity.

## 3. Completed S1–S3/N2 work

```text
S1 网关接线    services/dev-gateway/server.mjs：新增 /api/v0/relay WebSocket 路由，对端可"拨入"；
               准入复用 City 自己发过的凭据（sess: 解析 enrollment、控制令牌），
               什么都没出示的对端仍接受（因为要入城的 PC 按定义没有凭据），
               但能载什么由 RELAY_PAYLOAD_PATHS 白名单限定 → 不可能变成开放代理；
               对端可声明自己所属 City 的地址（clientUrl），push 时带上，决定权留在持有该 peer 的 City。
S2 客户端      apps/web/relay-dial.mjs：拨号并等 RELAY_READY（开过又被拒的连接不许像一条路径）；
               转发既有 join 载荷；失败 typed 且可回落；同一管道反向也能服务 City 的 push。
               apps/web/network-path.js：relay-in-city 的 action 带中继目标，旧"未建传输"注释已改。
S3 载荷复用    转发的就是既有 join 载荷（同 body、同路由、同一次性 claim），中继只转发、不落盘、不是 trust store。
N2 界面最后一跳  apps/web/relay-join.mjs（跨网入城流程，注入 forward 的纯逻辑）+ app.js 接线：
                reach==='relay' 的行由本 City 拨号并把申请送过管道；失败回落既有导航/二维码/短码通道；
                为**另一座 City** 取回的凭据经 #handoff 片段交付（从不放进 query）；三种进行中状态各有文案（中英）。
                ★ 并修正了执行位置：**载荷在中继 City 自己身上执行**——拨号方按定义就是那台不能被拨入的机器，
                让它去执行"对另一座 City 的入城申请"等于让唯一没有路由的机器去用那条路由。
```

S1 server.mjs adds /api/v0/relay WebSocket for outbound peers. Admission reuses existing City-issued sess enrollment/control credentials; anonymous prospective joiners accepted because they have no credentials, with RELAY_PAYLOAD_PATHS whitelist preventing open proxy. Peer clientUrl travels in pushes; owning City retains decisions.

S2 relay-dial dials and waits for RELAY_READY, not merely socket open followed by refusal. Forwards existing join payloads with typed errors/fallback. Reverse pipe carries City push. network-path relay-in-city action contains target; old unimplemented-transport comment corrected.

S3 uses the same body, routes and one-time claims, forwarding only, no persistence or new trust store.

N2 relay-join pure injected forward flow with app.js wiring: relay reach causes local City dial and send, fallback navigation/QR/code retained. Other City credentials delivered via #handoff, never query. Three pending states bilingual. Execution-location correction: payload executes on relay City itself; by definition dialer cannot be reached, so making it execute another City join request would ask the sole unroutable host to use that route.

Evidence: relay-s1-tunnel 12 tests; two independent City processes, real WebSocket, full 8-step join chain; real Edge browser with zero errors; existing relay frame assertion rewritten with explicit rationale, not deleted.

## 4. Priority next actions at that time

```text
N1  ★ 真实跨网双物理主机验收：仍需第二台真实主机 + 另一条真实网络。这是"联机功能"唯一还缺的一环，
    本机只能做到"两个独立 City 进程 + 真实 WebSocket + 完整入城链路"（已 PASS，但不是跨网）。
N2  ★ hosted CI 回填：f3756ba 与 fa85dcd 的 run 号与结论都还没有。
    另需查明：UTOPIA_LIVE_STATUS 停在 a7bab55 —— 云端的 sync 工作流本轮没有运行。
N3  ★ 待 Owner 一句话：损坏台账保留现状，还是允许 Alien 按可读来源重建（见 §五）。
N4  浏览器里的"行内按钮"完整 DOM 路径：目前浏览器检查是直接驱动 window.utopiaRelay（与按钮走同一批函数），
    还没有模拟"发现到一台 remote PC → 点击行内按钮"。该路径需要真实的 remote 发现行，本机造不出。
```

N1 physical two-host/two-network acceptance requires another real host/network. Local two independent City processes+WebSocket+full join PASS is not cross-network validation.

N2 fill hosted CI runs/verdicts for f3756ba/fa85dcd and diagnose live-status a7bab55/cloud sync absent.

N3 Owner decision whether retain damaged ledger or reconstruct from readable sources.

N4 full DOM remote-discovery-row click. Browser test directly drives window.utopiaRelay, same functions as button, but real remote discovery row unavailable locally.

Fixed judgment: same-LAN direct > self-hosted outbound relay(no third party/account/router change) > existing overlay > port forwarding with cost > public relay explicitly refused > honest unavailable+Owner decision. Group needs hardest member path. Unmeasured attachment/metered stay null and never feed carrier score.

## 5. Irreversible ledger damage — historical request

```text
现状    第 1-73 行是多层错误转码后的乱码；损坏自 0b50398 起，且 origin/main 同样是坏的
范围     mission-book/ 下 56 个 md 中只有这一个文件损坏
原因     UTF-8 被当 GBK 读、再回写为 UTF-8，且至少发生两轮；无效字节被替换成 '?'（内容丢失）→ 不可逆
可恢复   1abe534 之前的正文、各版本所有 ASCII 行（commit/CI run/测试计数/行内代码）
本轮处置 只插入警告块并指明可读来源；**没有**用重建版替换 Owner 的历史记录
待 Owner 一句话决定：保留现状，还是允许 Alien 按可读来源重建并在文件头标注"重建版本"
详细     mission-book/logs/integration/RELAY_TUNNEL_S1_S3.md §5
```

Original lines 1–73 mojibake from 0b50398, including origin main. Only one of 56 Markdown files damaged in that historical survey. UTF-8 decoded as GBK and rewritten as UTF-8 at least twice; invalid bytes became question marks and meaning was lost. Recoverable: pre-1abe534 body and ASCII commits/CI/counts/code. This round added a warning and readable pointers, did not replace Owner history with reconstruction. Owner was asked retain versus explicitly labeled reconstruction; relay ledger §5 gives detail. Today's organized source is a readable bilingual facade with raw-byte archive; it does not infer lost wording.

## 6. Inherited discipline

1. Atomic claims: read latest main, reassess dependencies/eligibility/claims, change necessary fields only, fast-forward. Withdraw a claim after push failure; never force-push.
2. Physical-host independence: Development and Formal Review use different hosts; no self-review. Alien reviewed JOIN-502 because Mech authored it, under explicit Owner authorization.
3. Zero claims must be classified as TEMPORARILY_UNCLAIMABLE, STRUCTURALLY_INELIGIBLE, GLOBAL_EXTERNAL_BLOCK or POOL_TERMINAL. Temporary idleness is not completion.
4. CI belongs to its exact SHA. Neighboring runs cannot substitute, and local PASS does not replace required hosted CI.
5. deferred != passed: unexecuted physical acceptance stays DEFERRED.
6. Test edits must distinguish correcting the contract from lowering the gate. Record the reason, as with the relay frame assertion.
7. Preserve self-authored defects: double serialization (the JSON hub re-encoded socket text); one frame name for both directions made City read its own push as a foreign request; forward ignored requestId; settle addressed the wrong wait table and was changed to deliver back into the pipe; the test peer executed a push on the relay rather than the designated City.
8. Validate actual UI: unit tests miss page crashes; a real browser found two.
9. Tokens and durable credentials must not enter Git; scan values before commit. The source's earlier “no token values” claim remains a dated report. Later documentation inspection found plaintext credentials in this historical handoff and redacted the current text. Git history was not scrubbed.
10. The source quotation breaks and duplicates material near its shell-edit warning; missing quotation content is not reconstructed. The distinct surviving instruction says to avoid implicit-encoding shell replacements: Set-Content/Get-Content pipelines decoded ANSI and damaged Chinese comments. This happened and was repaired with Node and checked. Use editing tools or explicit UTF-8 reads/writes.
11. UI changes require a real-browser check. A missing import prevented app.js from initializing despite green unit tests. npm run check:browser-relay uses Edge/CDP without adding dependencies.

## 7. Process requirements

Before claiming, fetch latest City/Utopia and measure dependencies, CI and other-host claims. During construction, choose the best option and record the problem, choice and reasoning. After completion, update City frontmatter/ledger/reports, push, then reconcile the control plane. At zero claims, classify the state and retain a wake condition without busy polling. After City use, confirm released ports or required residency.

## 8. Historical opening suggestion

Read the relay ledger containing that round's facts and DEFERRED items, ask the Owner about the damaged ledger, then execute priority N2's last UI hop while preserving environment facts and discipline. This suggestion remains historical and does not replace the current user's scope.
