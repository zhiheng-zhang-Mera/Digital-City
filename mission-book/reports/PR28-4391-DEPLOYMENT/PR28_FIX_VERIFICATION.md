# PR #28 fix verification by the opposite host / 异机对 PR #28 修复的复核

```text
REQUESTED BY        owner, 2026-10-05: "检查PR28的修复，重启4391城市"
PERFORMED BY        Mech (MEGA-REP), role Mech-DS - OPPOSITE host to the author of the repair (Alien-codex)
SUBJECT             PR #28 review/JOIN-590-Alien-codex @ 0ea9203d3409a59194675d48d93950c7af9fb92f
BASE FOR COMPARISON d3262ce2dd81e51a53e39e6f9add8dee650a7682  (the PR's own merge-base with main)
DEPLOYED TREE       D:\utopia-pr28 @ 0ea9203d3409a59194675d48d93950c7af9fb92f
VERDICT             the two gateway repairs VERIFIED; one PRE-EXISTING authorization gap found and NOT attributed to PR #28
```

## 1. What PR #28 actually changes in the gateway

```text
git diff d3262ce 0ea9203d -- services/dev-gateway/server.mjs
  -> 1 file changed, 2 insertions(+), 2 deletions(-)

  (a) POST /api/v0/pairing/session   now refuses a City session credential:
      if(req.citySession) refuse('SESSION_CANNOT_MINT_PAIRING',403,'Only the City owner may create a pairing code')
  (b) POST /api/v0/join/exchange     now returns a durable session credential with the enrollment:
      out={...exchanged, credential:sessionCredential(opened.session.sessionId), ...}
```

Everything else in the pull request is Android (`NativeEnrollment.kt` and the relay/pairing client changes) plus tests
and evidence. The gateway repair is therefore small enough to audit line by line, which is why the checks below target
exactly these two behaviours.

## 2. Verifications that PASSED

Author's own suite, re-run unmodified in the deployed tree:

```text
node --test tests/join590-native-enrollment.test.mjs    1/1 pass
```

Independent probes written by this host (`D:\utopia-pr28\tests\pr28-mech-independent-probe.test.mjs`, never committed to
any branch), deliberately using the DIRECT join routes rather than the author's relay path:

```text
node --test tests/pr28-mech-independent-probe.test.mjs
  ✔ PR#28-A   only the OWNER may mint a pairing code, and the owner is NOT over-blocked
  ✔ PR#28-B   the credential issued at join is durable across a gateway restart, and dies with the enrollment
  ✖ PR#28-A2  a member credential reaches its own installation - and can also DECIDE join requests (see §3)
```

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

## 3. FINDING F-1 (MEDIUM, PRE-EXISTING in main - NOT introduced by PR #28)

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

## 4. OBSERVATIONS (pre-existing, informational, asserted rather than assumed)

```text
O-1  the City-wide join request listing IS readable by an authenticated member credential (200). It carries no claim
     secret and no credential material - asserted by sweeping the returned rows for the claim string, for
     'credential'/'credentialSecret' and for 'sess:' prefixes. Least-privilege gap, not a secret leak.
O-2  GET /api/v0/city answers 200 to a member session (this build's contract; the Android client needs a City view).
     Recorded because a reviewer could otherwise read probe B's earlier draft as a defect - it was a wrong expectation
     in the probe, not a product bug, and the probe was corrected rather than the product.
```

## 5. Instrument failure recorded (my own)

```text
The first classification attempt compared the running deployment's OLD tree (D:\utopia @ 48cbc21) against the PR head and
printed a delta of "54 insertions / 20 deletions" in server.mjs, which would have suggested PR #28 rewrote authorization
wholesale. That comparison was INVALID: 48cbc21 is a point on main's history, not the pull request's parent. Re-run
against the true merge-base d3262ce the delta is 2/2. Recorded because a wrong baseline produces exactly the kind of
confident false conclusion these checks exist to prevent.
```

## 6. Restart of the 4391 City (second half of the request)

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
