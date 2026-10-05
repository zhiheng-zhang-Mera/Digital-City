# JOIN-590 physical Android continuation — 2026-10-05

Source fixed at `b91677d1478950feb79742f618d0c981773d5bb7`; reviewer Alien-codex on MERA-ALIANWARE. Physical ADB device `BICIPVNB5HS85H9T`, PERM00, Wi-Fi route 172.31.3.18/16. Mech public join/info now answers cityId `031fdba6-e94c-4298-a095-6ff04a65481d` at http://172.31.12.151:4391; Alien public City remains e1d87b2a-0ec5-457e-822b-91d81e40dc67. This is a same-LAN real-device run, not cross-region or two-sided NAT evidence. Live Mech server revision has not been independently established from the public descriptor.

## Build and harness identity

Fixed-source assembleDebug and testDebugUnitTest: BUILD SUCCESSFUL; XML results 85 tests, zero failures/errors. Default-ID APK SHA256 `63770d17ae071812d6fdf11d0f63bef42adb1dee642476d54abb357f42a6c07e` failed update installation with INSTALL_FAILED_UPDATE_INCOMPATIBLE: the existing phone app is signed by another key. Original APK/private prefs/files were backed up without printing secrets. Original APK SHA256 `a03b276741a09cb4f94699e282e76e20d02e9bda1b929ba94b2055e6f87c2a24`; original source SHA unknown and not inferred from versionName 0.3.2.

Choice: preserve the original application and use an isolated temporary applicationId `city.utopia.control.join590review`. An untracked Gradle init script changes only applicationId via androidComponents.finalizeDsl, leaving product source at the fixed SHA. First init attempt failed because projectsEvaluated is too late to set applicationId; corrected init build succeeded. Installed isolated APK SHA256 `78e28b9565a967c7eae7d347944e2258e7f5748682aeeea79b10c69b8f6fc87d`. Vendor install confirmation completed via visible install button. Notification permission denied for this test application. Application-ID difference is an explicit harness condition and does not prove production package upgrade compatibility.

## Observed user path

Fresh isolated app → Welcome → CODE → set Mech City URL → enable relay. Empty short-code field leaves Connect over relay disabled: actual UI XML confirms clickable button enabled=false. This independently reproduces R4 of REVIEW_REPORT_Alien-codex.md. Entering six placeholder digits enables the action; those digits do not participate in the relay approval protocol. A later UI observation retains input length 6; no automatic clear was seen in this particular bounded run, which does not settle all original short-code timing cases.

Actual handset reaches approval waiting for `join-4d2e2617ba`. Native pairing-events.jsonl records relayasking at 2026-10-05T09:38:13.731281Z and relaywaiting at 09:38:13.752777Z (20:38 Sydney). These timestamps describe this surface's events; no protocol latency claim is derived from them. Native UI and screenshot show Waiting for the owner to approve on the City. There is no user-selectable enrollment-name field in this path; it uses Android model label.

Approval is requested from the operator of the trusted Mech surface; the reviewer has no owner credential for that exact City. The backed-up original app instead points to http://172.31.12.151:4401, currently unreachable. That credential was not sent to City port4391 or another origin. No approval, rejection, restart, revoke, or elevated operation on the Mech City has been fabricated.

## Evidence and current gate limits

Local evidence root: D:/Utopia-JOIN590-Review/.runtime/evidence/JOIN590-device. Private-original.tar and original APK remain local. Redacted UI artifacts and public-screen screenshot hashes:

- relay-blank-code.xml: `52edfc1f0ff8333c6b8f5e71579a74e963dc6eb8599c191d918854dd7e802220`
- mech-approval-pending.xml: `576c2fc35fb4105c7e34c24c7f838a8cdbd27c4dd84bb6a71c780e3102fece1b`
- mech-pending.png: `ef4472f13829b1fd44f58eb274b85ce175a08b67eb944284c59280d6d0676910`

Physical handset request creation/reachable Mech relay: OBSERVED. Post-approval member session, durable registration, reconnect after restart, targeted revoke refusal, physical Windows member demotion, and cross-surface CHECKPOINT_DEMO remain NOT_RUN/PENDING_OWNER_DECISION. Prior controlled relay owner-credential defect remains a blocker until repaired and revalidated; reaching approval wait cannot resolve it. Formal review remains incomplete and terminal marker withheld.
