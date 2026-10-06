# JOIN-590 repair and physical reacceptance (Alien-codex)

> Reading translation / 阅读译本: for reading only, not a second authoritative workbook or status record. Historical failures and unobserved limits remain unchanged.

Original re-review source: `b91677d1478950feb79742f618d0c981773d5bb7`. Repair source: `ec3b6f996240ca71505b3b67af12cc222d1b283a`. Mech remains the development host; Alien-codex performs this re-review and these repairs without overwriting the original development head.

[Repair PR28, draft](https://github.com/zhiheng-zhang-Mera/utopia/pull/28). No main merge or terminal marker in this round.

## Repairs

- Android approval exchange carries canonical dev-<32hex>/inst-<32hex> identity and a user-entered admission name. Complete installation credentials stay app-private; UI, URLs and records disclose no secrets.
- The phone uses its own member session and renews from installation credentials at startup; 401/403 prompts internal identity revalidation. Retired/refused installations stop automatic retries and never fall back to the primary City's token.
- Leave City revokes only this installation. Manual-token connection remains an explicit choice and clears prior enrollment association.
- Approval no longer requires an unused short code; direct mode requires six digits. Address/name are locked while waiting; leaving cancels and fences late callbacks and credential saves.
- HTTPS/WSS preserves TLS through dial, save and reconnect; URL userinfo, paths, queries and cross-address redirects are refused.
- Short-code enrollment.session and approval replies differ, but both select member sessions. Gateway enrollment replies omit owner credentials and refuse member minting of primary-City pairing codes.
- Full runs exposed launcher-test isolation defects, repaired in preflight: a host-state directory does not isolate machine-wide port4389.

## Verification

Actual Android Gradle build succeeds, 91 unit tests with no failures/errors; actual Gateway tests28/28. New socket/HTTP regressions cover Android-shaped named approval, independent sessions, persisted City-data restart, member authority, and refusal of old sessions/material after self revoke.

Local full suite1245/1248: three launcher cases meet a live City; failures remain. The initial remote-code case lacked isolation preflight and changed the actual Alien process into a temporary test City's MEMBER, interference caused by this review run. Original database City e1d87b2a-0ec5-457e-822b-91d81e40dc67 stayed unchanged and PRIMARY was restored. Temporary installation files were separately isolated and retained; ordinary launcher measured reuse of the original City. Safe reruns refuse these three cases before acting, with City ID/PID unchanged.

Independent clean Windows runner verifies repair full1248/1248, Rooms, City test-all, document checks and Android: [source CI37299383248](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37299383248), exact API headSha ec3. Evidence branch0ea9203d3409a59194675d48d93950c7af9fb92f differs only in evidence, with [V0.2 37299640073](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37299640073) and [linkage37299640012](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37299640012) completed/success.

## Phone windows four and five

Isolated applicationId city.utopia.control.join590review never uninstalls/overwrites production city.utopia.control. Original private config matches prior backup byte-for-byte at capture. This is an explicit signature-mismatch harness condition, not proof of production in-place upgrade.

Window4 APK SHA256 `6790075dbd9f185b85d1dfb95568b9c643cc0432ef3033597d8fe270a5afd712`: join-c301d67807 succeeds without irrelevant code; no approval within180s, normal timeout restores controls. OS refuses adb pm clear; no bypass, the isolated app's Clear pairing starts the experiment.

Final repair APK SHA256 `970839d29a3066e01ecee8aab3040f9dc2ac81959727b144ab0694dd3d183800`: after user says Mech ready, join-535174ce61 and user says approved. Phone reaches APPROVED/exchange then RELAY_ENROLLMENT_REFUSED: Enrollment missing cityId;125s observes no saved credential, read-only Mech roster remains two as window3. Independent reread finds CONSUMED, credentialPresent=false/durableFieldNames=[], native10:59:08.181979Z APPROVED then10:59:08.199605Z retry. Reply is consistent with legacy exchange, but live Mech SHA is unverified; do not assert an exact deployed version. Refusing incomplete enrollment is correct; cross-host product acceptance has not passed.

Blocker: deploy repaired Gateway to actual Mech, preserve canonical031fdba6-e94c-4298-a095-6ff04a65481d and join again. User coordination requested, no old owner-token substitute. Phone restart, installation revoke, City restart and real Windows chain must be reaccepted on updated actual path.

Alien deploys repaired source (worktree ec3/evidence0ea), verifies0 active tasks before startup, preserves original data and City ID, new Gateway PID44580. Original D:/utopia checkout unchanged. Deployment is not merged-main acceptance.

## Evidence and research limits

[Candidate raw evidence/receipt](https://github.com/zhiheng-zhang-Mera/utopia/tree/0ea9203d3409a59194675d48d93950c7af9fb92f/evidence/raw/mission-book/JOIN590-repair). [Window5 UI/native/readback/source CI/receipt](https://github.com/zhiheng-zhang-Mera/utopia/tree/41e8743d7c49771bcc335add2ee722f73085869e/evidence/raw/mission-book/JOIN590-repair/window5). New evidence-only41e then awaits its own CI; ec3/0ea successes do not transfer. Full CI logs stay Utopia .runtime; Digital-City only reports/indexes.

Researchable: missing client identity, legacy-token compatibility, differing exchange replies, tests interfering with global reservation, interaction recovery after refusal, and code verification versus actual deployment. A simulated City restart is not physical Mech restart; reachable LAN is not both-unreachable NAT remote proof. True NAT, final Windows physical chain, full exposure, opposite-host repair review and main closeout then remain incomplete, review_complete:false.

## Window6 after update (2026-10-05, Alien-codex)

User reports Mech updated; actual service preserves031fdba6-e94c-4298-a095-6ff04a65481d. Protocol cannot read source SHA, retain null. Android remains above ec3 APK. Window5 failure remains; these are new independent observations.

- On Alien's existing City, phone exchanges six-digit code after input remains over3s, saves complete installation and sess member. Isolated force-stop/relaunch preserves installation, updates session, City GET200. Self Leave City yields old session401, bearerless enrollment renewal403, original owner City200; restart no session/retired. Initial retired=false was script reading Android boolean .text wrongly, annotated in proof rather than a product failure. Production-package upgrade still unverified.
- Mech new join-0751220e8f exchanges successfully, phone saves independent member material; force restart same installation/durable credential renews session automatically, City200 with no manual token.
- Actual Alien Windows request a8c47038-1114-421e-a6fa-148d657b65c8/name Alien-PC-JOIN590: trusted-side approval changes PID44580 PRIMARY to MEMBER, retires only its prior local service, keeps canonical Mech.
- Product restart-gateway from repaired checkout givesPID41244 MEMBER/ONLINE, same Mech City/installation; installation file has no session, fresh member session acquired without manual token. Phone Devices actually shows Alien-PC-JOIN590 online. Helper's nonexistent /api/v0/devices404 is not device-interface PASS; visibility comes from real UI.
- Phone Tasks selects Windows node, CHECKPOINT_DEMO Q-87818c40-a204-46d6-96e6-7da0077085fa, completed bydev-e1d87b2a0ec5457e822b91d81e40dc67, SHA256 `4150752ac4f326d3d74dd939e31d6abfa3d8055df4a00d7614f7c360353bf71a`. Actual Web/phone/canonical same task/result, seven seq158..164. This demo proves cross-device execution/presentation only, not throughput or general scheduling.
- Windows revokes own installation with own member session200, old401, renewalINSTALLATION_RETIRED403, Mech public identity unchanged. Stop member then ordinary launcher exit1 retainsMEMBER, no4389reservation, no local fallback listeners4389/4391/4320. Alien deliberately remains retired; manual PRIMARY restore cannot count as automatic refusal.

[Window6 fixed artifacts/receipt](https://github.com/zhiheng-zhang-Mera/utopia/tree/151c065363e52fb6ba38b0332000a7a3687042c3/evidence/raw/mission-book/JOIN590-repair/window6),16 safe artifacts; ec3 software and151c evidence identities distinct.41e [37301659943](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37301659943) independently SUCCESS; new151c then pending, no borrowed success.

These observations complete repaired-source actual Windows join, member restart, self-revoke/refusal and cross-surface demo. Still await real primary Mech restart, exact live source, opposite-host repair review, full exposure and main closeout. Two-NAT-unreachable route not implemented; /16LAN is not cross-region. review_complete false.

Additional reread:151c065363e52fb6ba38b0332000a7a3687042c3 [V0.2 37303827480](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37303827480) completed/success exacthead, linkage37303827505 likewise. Earlier pending wording is not current CI.

Mech [deployment record](../../PR28-4391-DEPLOYMENT/DEPLOYMENT_RECORD.md), Digital-City ce45c070988bf5626d8b1f99949a89d802d908a9, binds D:/utopia-pr28 SHA0ea9203d3409a59194675d48d93950c7af9fb92f, C:/ProgramData/Utopia/host/city, PID24100→5092, sameCity.0ea/ec3 product identical/evidence differ. This is opposite-side supplied deployment measurement, distinct from Alien directly reading source in public descriptor (protocol lacks field), not formal repair review. Deployment restart predates new installation; need primary restart after registration.

While Mech member phone uses More→Pairing→LAN, actually finds Mega-rep/4391/correctCity and staysONLINE without registering again. Redacted round6-lan-browse.xml temporarily Utopia.runtime, awaiting later restart artifacts. Windows self revoke leaves phone own installationBOUND/City200; member read-only roster must not treat unauthorized others as absent.

## After primary City restart: recheck and opposite-side review scope (2026-10-05)

User reports Mech restarted; PR28_FIX_VERIFICATION§6 records0ea/PID5092→22248/same data+City/events171→175. Alien independently reads172 CITY_STARTED then phoneONLINE/member City200/same installation+durable credential, no new token entry. Completed Q-87818c40 remainsCOMPLETED/node/hash. Previously retired real Windows material again tokenless mint after primary restart stillINSTALLATION_RETIRED403. Only this proves actual primary restart after enrollment, not earlier deployment restart.

[Window7 immutable artifacts/receipt](https://github.com/zhiheng-zhang-Mera/utopia/tree/62e9bad92b70af3098da8ce421becf99d8c6d00c/evidence/raw/mission-book/JOIN590-repair/window7), sourceec3/evidence62e. Own CI then pending, not borrowed151c.

Opposite [repair verification](../../PR28-4391-DEPLOYMENT/PR28_FIX_VERIFICATION.md), Digital-City33a04b6, independently confirms no member owner-code mint, durable session and revoke isolation, but reviews only two Gateway behaviors, not full Android opposite-host Formal Review.

Keep F-1 member may approve/reject observation, but check expected contract: acceptedJOIN502 explicitly existing trusted device decides; join.mjs1/260 and existing server control-credential semantics agree. Same Mech CEX704§4.1 explicitly corrected member must not decide admissions as wrong probe expectation. A latest OWNER-only label cannot change accepted trust contract. Classify CONTRACT_EXPECTATION_CONFLICT, no OWNER-only patch; final reviewer must resolve. Explicit Owner tightening would be a new recorded authority decision.

Remaining: full Android opposite review, complete exposure and merged-main CI/product; do not turn partial GatewayVERIFIED into overallPASS. Primary restart subgate is newly verified above.

语言配对 / Language pair: [原文 / Source](../REPAIR_REPORT_Alien-codex.md) · [译本 / Translation](./REPAIR_REPORT_Alien-codex.md)
