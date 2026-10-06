# 异机对 PR #28 修复的复核

阅读译本 / Reading translation：完整阅读译本，不构成第二份权威审查记录；原始证据块保持原样，历史失败、缺口与边界均保留。

```text
REQUESTED BY        owner, 2026-10-05: "检查PR28的修复，重启4391城市"
PERFORMED BY        Mech (MEGA-REP), role Mech-DS - OPPOSITE host to the author of the repair (Alien-codex)
SUBJECT             PR #28 review/JOIN-590-Alien-codex @ 0ea9203d3409a59194675d48d93950c7af9fb92f
BASE FOR COMPARISON d3262ce2dd81e51a53e39e6f9add8dee650a7682  (the PR's own merge-base with main)
DEPLOYED TREE       D:\utopia-pr28 @ 0ea9203d3409a59194675d48d93950c7af9fb92f
VERDICT             the two gateway repairs VERIFIED; one PRE-EXISTING authorization gap found and NOT attributed to PR #28
```

Owner 于2026-10-05要求“检查PR28的修复，重启4391城市”。执行者 Mech（MEGA-REP）、角色 Mech-DS，与修复作者 Alien-codex 为不同主机。被检对象、真正 merge-base 与部署树精确 SHA 见原块。结论：两个 Gateway 修复 VERIFIED；另发现一个既存授权缺口，不归因于 PR #28。

## 1. PR #28 对 Gateway 的实际修改

```text
git diff d3262ce 0ea9203d -- services/dev-gateway/server.mjs
  -> 1 file changed, 2 insertions(+), 2 deletions(-)

  (a) POST /api/v0/pairing/session   now refuses a City session credential:
      if(req.citySession) refuse('SESSION_CANNOT_MINT_PAIRING',403,'Only the City owner may create a pairing code')
  (b) POST /api/v0/join/exchange     now returns a durable session credential with the enrollment:
      out={...exchanged, credential:sessionCredential(opened.session.sessionId), ...}
```

相对于真正 merge-base，server.mjs 仅一文件、2行新增/2行删除：(a) POST /api/v0/pairing/session 拒绝 City session 凭据，以403 SESSION_CANNOT_MINT_PAIRING告知仅 Owner 可创建配对码；(b) POST /api/v0/join/exchange 在 enrollment 返回中加入持久 session 凭据。PR 其余内容为 Android（NativeEnrollment.kt、relay/pairing 客户端修改）、测试与证据。因此 Gateway 修改足够小，可逐行审计，下列检查专门针对这两种行为。

## 2. 通过的验证

作者原测试套件未改动，在部署树重新运行：

```text
node --test tests/join590-native-enrollment.test.mjs    1/1 pass
```

join590-native-enrollment 测试1/1通过。异机编写独立探针 D:\utopia-pr28\tests\pr28-mech-independent-probe.test.mjs，从未提交任何分支；刻意使用 DIRECT join routes，而非作者 relay 路径。

```text
node --test tests/pr28-mech-independent-probe.test.mjs
  ✔ PR#28-A   only the OWNER may mint a pairing code, and the owner is NOT over-blocked
  ✔ PR#28-B   the credential issued at join is durable across a gateway restart, and dies with the enrollment
  ✖ PR#28-A2  a member credential reaches its own installation - and can also DECIDE join requests (see §3)
```

PR#28-A通过：只有 OWNER 可创建配对码，Owner未被过度阻止。PR#28-B通过：加入时颁发凭据能跨 Gateway 重启持久，随 enrollment 撤销失效。PR#28-A2失败：成员凭据能访问自己的安装，却也能决定加入请求（第3节）。

```text
CLAIM (a) member cannot mint
  POST /api/v0/pairing/session with the member's sess: credential       -> 403 SESSION_CANNOT_MINT_PAIRING
  POST /api/v0/pairing/session with the owner credential                -> 200 with a short code
  POST /api/v0/pairing/session with the member credential, AFTER the owner minted -> still 403
  => the refusal is typed, is not an accident of ordering, and does not over-block the owner.

CLAIM (b) durable reconnect
  join/exchange returns credential starting 'sess:' and != the owner token
  gateway closed and re-created on the SAME data directory
  POST /api/v0/device/session with the stored material -> 200, cityId unchanged
  GET  /api/v0/device/installations with the member session -> scope OWN_INSTALLATION, exactly 1 row, its own id
  POST /api/v0/device/installations/<own>/revoke -> 200, after which:
       device/session with the same stored material -> 403 (revocation survives), roster read refused
  a SIBLING device enrolled by the owner is unaffected by that revoke (200 on its own reconnect)
  PATCH /api/v0/city/name with a member credential -> refused; the City name is unchanged
```

声明(a)：成员 sess: 凭据创建码得到403 SESSION_CANNOT_MINT_PAIRING；Owner得到200及短码；Owner创建后成员仍403。这是有类型的拒绝，与调用顺序无关，且没有过度阻止 Owner。声明(b)：join/exchange 返回以sess:开头且不同于Owner token的凭据；关闭 Gateway 后在同一数据目录重建；存储材料 reconnect得到200且cityId不变；成员安装列表 scope为OWN_INSTALLATION，恰好一行自身id；撤销自身得到200，此后同一材料重连403且名单读取被拒绝，撤销持久。Owner加入的兄弟设备不受该撤销影响，自身重连200。成员 PATCH City 名称被拒绝，名称不变。

## 3. 发现 F-1（MEDIUM，main 已存在，非 PR #28 引入）

```text
OBSERVED       POST /api/v0/join/requests/<other-request-id>/approve with an ENROLLED MEMBER's session credential
               returns 200: the request moves to APPROVED. The same credential can reject.
EXPECTED       JOIN-502 makes approval the OWNER's act ("owner approval"). A joined phone admitting further devices into
               the City is a privilege escalation from "member" to "gatekeeper".
WHY IT IS NOT PR #28's
               the route line is byte-identical in the base d3262ce and in the PR head; PR #28's whole server.mjs delta is
               the two lines in section 1, neither of which touches this route. services/dev-gateway/join.mjs approve()
               (line 263) contains no authority check at all - it flips state and persists.
REPRODUCTION   tests/pr28-mech-independent-probe.test.mjs, probe PR#28-A2, first assertion.
MINIMUM REPAIR BOUNDARY
               guard the two decision routes the same way PR #28 just guarded minting, e.g.
               if(req.citySession) refuse('OWNER_ONLY',403,'Only the City owner may decide a join request')
               on /join/requests/:id/approve and /reject, plus a probe that a member is refused and the owner still
               decides. Not repaired here: it is outside PR #28, and the owner asked for no further changes.
```

观察：已入网成员 session 凭据 POST /api/v0/join/requests/<other-request-id>/approve 返回200，请求变为APPROVED，同一凭据也可reject。预期：JOIN-502将批准定义为Owner动作，手机成员接纳其他设备是从member升为gatekeeper的权限提升。之所以不是PR #28的问题：base d3262ce与PR头的路由字节完全一致；PR的server.mjs只有第1节两行变化，均未触及此路由；join.mjs:263的approve()没有权限检查，只改变状态并持久化。复现为独立探针PR#28-A2的首个断言。最小修复边界：像配对码保护一样保护approve/reject两个决定路由，如City session得到403 OWNER_ONLY，并添加成员被拒绝、Owner仍可决定的探针。本次未修复，因为超出PR #28且Owner要求不再改动。

## 4. 观察项（既存、信息性，由断言检验而非假设）

```text
O-1  the City-wide join request listing IS readable by an authenticated member credential (200). It carries no claim
     secret and no credential material - asserted by sweeping the returned rows for the claim string, for
     'credential'/'credentialSecret' and for 'sess:' prefixes. Least-privilege gap, not a secret leak.
O-2  GET /api/v0/city answers 200 to a member session (this build's contract; the Android client needs a City view).
     Recorded because a reviewer could otherwise read probe B's earlier draft as a defect - it was a wrong expectation
     in the probe, not a product bug, and the probe was corrected rather than the product.
```

O-1：已认证成员可读取全City加入请求列表（200）。遍历返回行检查claim字符串、credential/credentialSecret字段和sess:前缀，确认无claim secret或凭据材料。这是最小权限缺口，而非secret泄漏。O-2：成员 session GET /api/v0/city返回200，这是本构建契约，Android需要City视图。记录此项是因为审查者可能把探针B早期草稿误解为缺陷；错误在探针预期，而非产品，故纠正探针而未改产品。

## 5. 记录自己的测量工具失败

```text
The first classification attempt compared the running deployment's OLD tree (D:\utopia @ 48cbc21) against the PR head and
printed a delta of "54 insertions / 20 deletions" in server.mjs, which would have suggested PR #28 rewrote authorization
wholesale. That comparison was INVALID: 48cbc21 is a point on main's history, not the pull request's parent. Re-run
against the true merge-base d3262ce the delta is 2/2. Recorded because a wrong baseline produces exactly the kind of
confident false conclusion these checks exist to prevent.
```

首轮分类将运行部署旧树 D:\utopia @48cbc21与PR头比较，得到server.mjs“54 insertions /20 deletions”，可能误导为PR #28大规模改写授权。这一比较INVALID：48cbc21是main历史点，不是PR父基线。改用真正merge-base d3262ce重跑，变化是2/2。保留该失败是因为错误基线会产生本验证旨在避免的自信错误结论。

## 6. 重启4391 City（请求后半部分）

```text
BEFORE   coordination ONLINE, gatewayPid 5092, last event seq 171
ACTION   scripts\stop-city.ps1  ->  "Stopped host City 031fdba6-… Data retained at C:\ProgramData\Utopia\host\city"
         scripts\start-city.ps1 -BindAddress 172.31.12.151 -Port 4391
AFTER    coordination ONLINE, gatewayPid 22248, endpoint http://172.31.12.151:4391,
         cityId 031fdba6-e94c-4298-a095-6ff04a65481d (UNCHANGED), servicesManaged true
         GET / -> 200, GET /app.js -> 200, Rooms 4320 -> OK
         events 171 -> 173 NODE_ONLINE, 174 CLIENT_CONNECTED, 175 CLIENT_CONNECTED (pages reconnected themselves)
         credential token SHA-256 prefix 71EF027362A8, IDENTICAL to before the restart (no session loss)
         nodes: Mega-rep online=true (this host, correct identity) | Alien-PC offline | Alien-PC-JOIN590 offline
STALE ROWS KEPT
         the two offline rows are historical and were left in place, as instructed ("暂时不动")
```

重启前 coordination ONLINE、PID5092、最后seq171。stop-city.ps1停止原City并保留 C:\ProgramData\Utopia\host\city；按原BindAddress和Port启动。重启后ONLINE、PID22248、endpoint不变、City UUID不变、servicesManaged=true；GET /及/app.js均200，Rooms4320正常。事件171之后有173 NODE_ONLINE、174和175 CLIENT_CONNECTED，页面自行重连。凭据SHA-256前缀71EF027362A8与前一致，没有会话丢失。节点Mega-rep在线（本机正确身份），Alien-PC与Alien-PC-JOIN590离线。按照“暂时不动”指示，保留两个历史离线行。

语言配对 / Language pair: [原文 / Source](../PR28_FIX_VERIFICATION.md)
