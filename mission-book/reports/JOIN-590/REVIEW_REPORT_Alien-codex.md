# JOIN-590 — opposite-host reacceptance: DEFECTS / physical gates NOT_RUN

Reviewer Alien-codex, physical MERA-ALIANWARE; developer Mech, MEGA-REP. Fixed review source `b91677d1478950feb79742f618d0c981773d5bb7`, isolated `D:/Utopia-JOIN590-Review`, branch `review/JOIN-590-Alien-codex`. Fresh workbook supersedes the old request's d3262ce review target; baseline evidence remains historical, not transferred to the new product changes. Required V0.2 checks run 37259528163 independently observed completed SUCCESS with exactly this full SHA.

## R1 — P1: relay Android join remains owner-token fallback, not a durable member installation

OBSERVED_HEAD: b91677d1478950feb79742f618d0c981773d5bb7.

OBSERVATION: Actual local Gateway relay with the same request/exchange bodies as RelayPairing returns the fixture owner credential, creates zero installation records, and permits that returned credential to mint an owner pairing session (200). Only booleans/statuses were output; no credential value was logged. This is controlled protocol evidence, not a physical handset run or an unauthenticated exploit.

REPRODUCTION: copy `independent-review-probe.mjs` to the fixed Utopia checkout's `.runtime/join590-independent-review.mjs`, attach its existing dependencies, run `node .runtime/join590-independent-review.mjs`. It starts/closes only its own temporary Gateway. Output: approvedStatus=200, exchangeStatus=200, receivedOwnerCredential=true, enrollmentPresent=false, installationCount=0, ownerSessionMintStatus=200. Instrument SHA256 `20b3618e7b2854027d10dd54f2405f672d7ff4505887a2545801fe4c9e35baf6`.

ROOT CAUSE: RelayPairing.exchangeNow sends only requestId/claim, omitting `installation`; server exchangeJoin consequently returns legacy join.exchange owner credential. MainActivity persists only host/token/cityId. Declaring installationId for relay admission does not enroll an installation. Existing session/enrollment backend tests passing do not prove this client actually uses enrollment.

EXPECTED_CONTRACT: JOIN-590 gates for durable member enrollment, tokenless reconnect and per-installation revoke refusal must be satisfied by the actual Android path. Reusing a persisted owner token cannot establish these invariants.

MINIMUM_REPAIR_BOUNDARY: native join exchange carries canonical installation metadata, persists durable installation credentials privately, connects with the resulting member session, internally renews it and refuses retired installations; preserve owner controls for genuinely authenticated owners. Test the actual Android path after approval, restart and revoke. Do not silently broaden authority or conflate admission hints with registration.

## R2 — P1: claimed both-behind-NAT reachability has no network path

OBSERVATION / REPRODUCTION: RelayDial.socketUrl directly constructs ws(s)://City-host:port/api/v0/relay. RelayPairing.target is exactly the entered City address. No public rendezvous, outbound City registration, tunnel broker or peer traversal is added by these seven changed files. A device unable to route to that City still cannot establish this initial socket. PairingPanel promises that the pipe works when neither side can be dialled, and comments repeat that assertion.

EXPECTED_CONTRACT / MINIMUM_REPAIR_BOUNDARY: disclose that this relay works only with a reachable City endpoint; true cross-network onboarding needs an explicit reachable intermediary/tunnel and real separate-network validation. Merely changing the label does not deliver the user's remote-connection requirement. Treat that requirement as incomplete until a working end-to-end path exists. No NAT campaign was run here.

## R3 — P1: secure input loses TLS scheme in relay dial

OBSERVATION / REPRODUCTION: RelayDial.target("https://example.test:443") returns only (example.test,443); RelayPairing.joinViaApproval invokes dial(host,port,...) without secure, whose default is false. socketUrl therefore generates ws://example.test:443, converted to http:// for OkHttp. wss input loses the same flag. Sensitive claim/credential exchange must not proceed by silently downgrading an explicitly secure destination. This is deterministic source tracing, not a packet capture or handset observation.

MINIMUM_REPAIR_BOUNDARY: preserve scheme/security in the parsed target throughout dialing, canonical storage and subsequent client connection; reject unsupported secure inputs explicitly rather than fall back to cleartext. The original PairingProtocol endpoint helper is HTTP-only, so a single secure flag without checking saved-host reconnect is insufficient.

## R4 — P2: relay approval requires a short code it never uses

OBSERVATION / REPRODUCTION: PairingPanel's connect action refuses ownerCode.isBlank before entering relayMode and its button also requires ownerCode.isNotBlank. RelayPairing approval carries no short code. The user cannot ask for approval without entering irrelevant characters, contrary to the request-and-wait flow advertised in the same source.

MINIMUM_REPAIR_BOUNDARY: separate approval prerequisites from direct short-code prerequisites; requesting relay approval requires a valid destination and入网名称, not unused code. Display and persist the user-selected member name rather than only Build.MODEL. Real interaction must verify the repaired path.

## R5 — P2: stale CI/evidence binding in historical review request

REPRODUCTION: GitHub run 37205444427 and linkage run 37205444385 independently resolve headSha `0e9bea3ce739b979e582a428af8fb233045a5e75`, not d3262ce as REVIEW_REQUEST.md claims. Current b91677d run 37259528163 is correctly bound and green. Preserve historical mistakes, correct their authority references, do not substitute green older-head CI for the review target. Failure label EVIDENCE_POINTER_MISMATCH.

## Current validation and remaining physical work

Gateway tests 4/4 PASS; relay tunnel + enrollment + short-code suites 23/23 PASS unchanged. Independent actual relay probe confirms R1 above. Local checkout remains exactly the recorded source; no product repairs or production Gateway shutdown performed. ADB devices -l returns no attached device. Mech documented endpoint http://172.31.12.151:4391 timed out after four seconds; Alien endpoint http://172.31.3.110:4391 publicly declares City e1d87b2a-0ec5-457e-822b-91d81e40dc67. A timeout proves only current reach failure, not a stopped Mech service.

Physical post-approval reconnect, same-City restart, targeted revoke/refusal, cross-surface CHECKPOINT_DEMO comparison, user exposure and merged-main post-closeout verification remain NOT_RUN by this reviewer. Developer baseline physical evidence is retained as supplied and not promoted into independent confirmation. Formal acceptance FAIL/PENDING_REPAIR; review_complete stays false, terminal marker withheld. Need repaired exact source plus physical phone and reachable Mech City to complete reacceptance.

Fresh physical continuation supersedes the initial availability observation: window3 successfully observed approval-to-ONLINE, application force-stop/relaunch without input, and native/Web/canonical CHECKPOINT_DEMO comparison. See PHYSICAL_WINDOW3_Alien-codex.md. These passes do not resolve durable enrollment/retirement or City-process restart gates; original findings remain. Raw snapshot placement corrected to Utopia evidence-only commit ddf7e1aa0d0978f80bf1357306378c8595fe58f7; see evidence/README.md.

Direct correction now supersedes the earlier "no product repairs" statement: source ec3b6f996240ca71505b3b67af12cc222d1b283a repairs native membership, TLS, approval prerequisites and owner-code authority; exact-head clean CI passes. See REPAIR_REPORT_Alien-codex.md. On the fifth physical window, user approval was followed by a missing-cityId enrollment refusal against the actual Mech service. Code-level repairs do not yet establish deployed-product acceptance; review_complete remains false.
