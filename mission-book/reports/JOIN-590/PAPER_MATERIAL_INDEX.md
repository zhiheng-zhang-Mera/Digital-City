# JOIN-590 — PAPER_MATERIAL_INDEX

> Required by `CONSTRUCTION_RULES.md` §14B and by the Connection Onboarding process-data rules. Observable facts
> only; credentials, short codes and long-lived tokens are never reproduced here.

## 1. Applicability decision

```text
research_evidence_applicability = APPLICABLE
long_horizon_context_evidence   = CAPTURED
state_identity_evidence         = CAPTURED
research_evidence_refs          = §6
```

This is APPLICABLE for both §14B reasons: the work was done by a long-running asynchronous agent across two
physical hosts, **and** it is itself a physical-acceptance task, i.e. a naturalistic source of
physical-host-only defects, restart timing, discovery latency and stale-state observations.

## 2. External-state refs used

```text
control_repo    zhiheng-zhang-Mera/Digital-City @ main
implementation  zhiheng-zhang-Mera/utopia
workbook        mission-book/connection-onboarding/JOIN-590-merged-main-physical-acceptance-and-closeout.md
report          mission-book/reports/JOIN-590/DEVELOPMENT_REPORT.md
branch          join/JOIN-590-merged-main-physical-acceptance
baseline_sha    d3262ce2dd81e51a53e39e6f9add8dee650a7682
claim_commit    98137af
canonical_city  031fdba6-e94c-4298-a095-6ff04a65481d (Mech, 172.31.12.151:4391)
peer_city       e1d87b2a-0ec5-457e-822b-91d81e40dc67 (Alien, 172.31.3.110:4391)
device          BICIPVNB5HS85H9T / PERM00 (Android 12, 172.31.3.18/16)
```

## 3. State identity, provenance and freshness

```text
expected_identity       canonical City cityId 031fdba6-… plus the workspace's immutable baseline SHA
resolved_identity       read back from the live host reservation and /api/v0/city after each restart
evidence_identity       the City's own event stream seq 1..18 (JOIN_* + CITY_STARTED + CLIENT_CONNECTED)
provenance_relation     baseline ancestors verified ANCESTOR_OK at claim time; the accepted heads of
                        JOIN-501/502/503 are ancestors of d3262ce2
freshness_revalidation  the City's state was re-read after every interruption instead of being carried forward
drift_classes_checked   MUTABLE_REFERENCE_STATE_DRIFT      -> the peer City (Alien) appeared on the LAN mid-session
                                                             and was resolved by address, not assumed
                        EVIDENCE_POINTER_MISMATCH         -> the first "three machines are linked" statement did
                                                             not say which City; the claim was resolved to
                                                             031fdba6 only after the user named it explicitly
                        STALE_EXECUTION_IDENTITY          -> the resident gateway PID changed (21452 -> 25364);
                                                             cityId and dataDir were re-verified as unchanged
                        PROVENANCE_RELATION_MISMATCH      -> none
```

## 4. Incidents worth citing

**I1 — Three Cities, one LAN, and a claim that did not name its subject.**
The user's statement "three machines are manually confirmed linked" was true but **did not identify which City**.
The LAN carried Mech's resident City (`031fdba6`), a second acceptance City started for this task (`1d5287bf`), and
Alien's City (`e1d87b2a`). Acceptance evidence bound to the wrong City would have been worthless, so the subject
was resolved by asking and then by reading canonical truth. Paper angle: **an ambiguous external assertion is not
evidence; it is a pointer that must be resolved before it can be used**, and the resolution cost is small compared
with the cost of an acceptance bound to the wrong identity.

**I2 — Environment limits found only on real hardware.**
(i) The host PATH ships JDK 26 and Gradle/AGP refuse it, so the build requires the Gradle-cached Temurin 17.
(ii) The vendor installer blocks installation behind a confirmation page, but the activity is not `FLAG_SECURE`,
so a synthetic tap completes it — a genuine user-equivalent action, not a bypass.
(iii) The soft keyboard covered the pairing `Connect` button, so coordinate taps landed on the keyboard.
Class: **UI/geometry hazards that no unit test can see**. (iii) is directly relevant to CEX-704's native onboarding
work: a real device flow must keep its primary action reachable with the IME open.

**I3 — A foreground launcher under a timeout took the City down.**
Running `scripts/restart-gateway.ps1` from a foreground shell meant the harness timeout killed the launcher
together with the gateway. Recovery was immediate and the City returned with the **same cityId**, which converted
an operational mistake into a state-identity observation: the restart preserved canonical identity while the
process identity changed. Recorded because it is the kind of thing that silently becomes "restart failed" in a
report; here it is "restart succeeded, launcher lifetime was managed wrongly".

**I4 — A live surface that is not an enrolled installation.**
The Android surface is live as `android-PERM00 / CONTROL_ONLY`, while the City's installation registry is empty and
the app's own preferences hold `host/clientRef/cityId/token` — the engineering-fallback shape. So the approved
JOIN_REQUEST belonged to a different entrant (`Alien-Win`), and the phone is attached through the token path.
Class: **exposure gap between "a surface is connected" and "an installation is enrolled"** — precisely the debt
CEX-704 (Android native owner onboarding) exists to pay.

### 4.1 Addendum — the pairing exchange was then run end-to-end on the device

A fresh pairing session was minted on the canonical City and consumed from the physical device through the app's
own **Settings → 配对 → Nearby Cities (LAN)** path. Measured: `pairing/info sessionState=USED`, then
`/api/v0/device/installations count=0`, then `CLIENT_DISCONNECTED`/`CLIENT_CONNECTED` for `android-PERM00`, and the
app's private preferences still holding `host/clientRef/cityId/token`.

**I5 — "The action completed" and "the durable state was created" are different facts.** The session was
genuinely consumed and the surface genuinely reconnected, yet no installation record exists and the client still
holds a bare token. A verification that stopped at "the pairing succeeded" — the natural, visible success signal —
would have recorded a passing enrollment that does not exist. Class of defect: **success signals that are true
about the transaction and false about the state**. Paper angle: completion criteria for onboarding must be read
from the durable registry, not from the last successful request.

**I6 — Post-restart the surface recovered by itself and told the truth about two hosts.** The Android app
re-entered the City with no credential entry and its Devices page showed `Alien-PC OFFLINE · Cached (445s)` beside
`Mega-rep ONLINE (2s)` with a real snapshot time. Recorded because a "both online" display after a restart would
have been the more flattering and less honest outcome; the platform's staleness handling is visible here.

## 5. Quantitative evidence


```text
lan Cities visible from the phone            3 (two on Mech, one on Alien)
mDNS discovery rows observed                 3, all MDNS_DNS_SD, stale=false
onboarding chain latency (canonical truth)   JOIN_REQUEST_CREATED 01:24:35.805Z
                                             JOIN_REQUEST_APPROVED 01:24:46.807Z   (+11.0 s)
                                             JOIN_REQUEST_CONSUMED 01:24:47.003Z   (+0.2 s)
gateway restart -> both surfaces reconnected CITY_STARTED seq 11 / CLIENT_CONNECTED 13,14  (and 15..18 on a second cycle)
canonical members after restart              3 (PRIMARY + web CONTROL_ONLY + android CONTROL_ONLY)
installation registry count                  0   <- the finding in I4
android unit tests + APK build               BUILD SUCCESSFUL in 3m09s (testDebugUnitTest + assembleDebug)
```

## 6. Research topics these observations feed

```text
.../paper-materials/{en,zh-CN}/
  LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md
  LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md   <- I1, I3
```

## 7. What this index deliberately does not claim

* No compaction/token telemetry: the harness exposes none and no compaction occurred (`NOT_OBSERVABLE + reason`).
* No performance or discovery-latency-quality claim: the two measured latencies are single observations, not
  distributions.
* No causal claim from I1–I4; they are naturalistic events, and §14B.5 reserves causation for controlled replay.
* No credentials: neither the control token, the node token nor the pairing short code appears in this file or in
  the report.

Alien-codex opposite-host reacceptance at fixed b91677d1478950feb79742f618d0c981773d5bb7 found actual Android-shaped relay exchange returns owner credential with zero installations (controlled actual Gateway), TLS scheme loss, unsupported both-behind-NAT reachability claim, unused-code entry gating, and stale old-head CI pointers. See REVIEW_REPORT_Alien-codex.md and independent-review-probe.mjs. Physical phone absent/Mech endpoint timeout; those gates NOT_RUN. No latency, NAT traversal or physical performance inference.

Physical Android follow-up: PHYSICAL_REACCEPTANCE_Alien-codex.md binds fixed b91677d source to isolated-package APK 78e28b95..., records signature mismatch/harness failed attempt, confirms actual blank-code relay gating and real Mech approval wait, and preserves post-approval/reconnect/revoke as unverified. Same-LAN reachability is not cross-region/NAT evidence.

Window2: PHYSICAL_WINDOW2_Alien-codex.md preserves real request join-eab97ea241, bounded absence of saved credential, uncommanded mdns trial change and late retry under changed trial identity. Cause unverified; no successful post-approval/reconnect/revoke claim. Raw redacted UI and native boundary evidence retained.

Window3 approval success, native application restart reconnect and one-task phone/Web/canonical id/state/hash/seq comparison are captured in PHYSICAL_WINDOW3_Alien-codex.md. Retain all incomplete member enrollment/revoke/NAT gates. Raw UI/traces moved to Utopia bounded evidence commit ddf7e1aa0d0978f80bf1357306378c8595fe58f7 under PROCESS_DATA_POLICY; source b91677d remains the software identity.

Direct repair continuation: REPAIR_REPORT_Alien-codex.md binds correction source ec3b6f996240ca71505b3b67af12cc222d1b283a to full clean-runner CI 37299383248 (1248/1248), Android 91 tests, native-shaped enrollment/restart/revoke tests and candidate evidence 0ea9203d3409a59194675d48d93950c7af9fb92f. Retain the live-host test interference and recovery, fourth-window timeout, fifth-window approved-but-incomplete-exchange refusal, and deployment-source uncertainty. Neither controlled restart nor green CI is promoted into a physical Mech restart/revocation result.


2026-10-05 window6: actual named Android and Windows member admission, process restart and tokenless renewal, self revoke/refused restart, phone-directed CHECKPOINT_DEMO and matching Web hash. Immutable artifact head 151c065363e52fb6ba38b0332000a7a3687042c3; software ec3b6f996240ca71505b3b67af12cc222d1b283a. See REPAIR_REPORT_Alien-codex.md for negative probes and limits. Mech City restart, exact live Mech source, opposite-host repair review, exposure/main closeout and true NAT remain unverified.
