# CEX-704 — Android Onboarding Owner Actions parity

> **Reading translation; non-authoritative.** [Canonical source and live metadata](../CEX-704-android-onboarding-owner-actions-parity.md). Source workbook/report controls state, claims, SHA, CI, and gates.
>
> [Persistent rules](../../CONSTRUCTION_RULES.md) · [Paper material](./PAPER_EVIDENCE_PROTOCOL.md)

## Objective

Android chiefly joins others today; as a first-class control surface it should show incoming requests, Approve/Reject, Generate pairing, display/share Android-suitable short code/QR/link, and preserve Scan QR/LAN/BLE/Manual join.

## Required implementation

### Incoming approval

Reuse existing list/approve/reject; no new approval database.

### Pairing generation

Follow JOIN-501: create only after user Generate; remain fixed while ACTIVE; regenerate after consumed/expired; no background rotation.

### Share

At least QR, short code, and share-sheet-compatible Web invite/link or equivalent existing material. Never share durable credentials.

## Cross-network

If Android relay lacks full product contract, Web invite/share material is allowed, but no claim of complete Android cross-network relay execution; record exact future seam in backlog/report.

## Formal Review

Independently test on physical Android: generate, share, second-device consume, incoming approve, reject, expiry, double-click, background/resume, existing join regression.

## Mandatory paper material

Web/Android parity gaps, user-step comparison, Android lifecycle/background problems, permission errors, QR/share failures, races, approval latency, negative controls.

## Completion gate

Android Owner onboarding surface; no JOIN-501/existing-join regressions; physical-device opposite-host Review; exact-head CI; PAPER_MATERIAL_INDEX; ANDROID_ONBOARDING_OWNER_ACTIONS_PARITY_ACCEPTED marker.

## Review conclusion (Mech, opposite physical host, physical-device matrix)

Formal Review PASS: `mission-book/reports/CEX-704/REVIEW_REPORT.md`. Ten physical-device checks against self-hosted City on OPPO PERM00 / BICIPVNB5HS85H9T, all observed: reachable panel with canonical City name; six-digit code and 612×612 QR, code proven canonical by another client's successful HTTP 200 consumption because pairing/info never reports it; ACTIVE never rotates, proved by disabled control, forced click preserving material/session, guarded route 409 PAIRING_STATE_CHANGED. **System share sheet opened**, closing rather than confirming author share_sheet NOT_RUN_AUTO_APPROVAL_REJECTED gap. Second client (**local, not second phone**) consumed material and next poll cleared code/QR/share. Approval/rejection changed canonical truth with decidedAt. Fifteen-second expiry removed material with no regeneration. Two clicks about100ms apart created one session; same code and correct countdown survived background/resume. Four existing joins remained reachable. Crash buffer empty, no FATAL EXCEPTION.

Non-device checks: eight concurrent guarded generates yield one success and remaining409; additive guard preserves old route; material binds City/host/credential hashes and is discarded on mismatch; failed polls do not fabricate empty lists; anonymous decisions refused while trusted enrolled-device decisions are JOIN-502 design, correcting reviewer's wrong expectation; six concurrent approvals never split records; unclaimed approval may reverse to rejection, rejected cannot approve. Required approval latency formerly NOT_OBSERVABLE measured HTTP8–11ms and Owner-visible9–16ms, single-machine local City only, no performance claim.

Five nonblocking findings: F1 LOW share failure messages overwritten by2s polling, source inference only since chooser worked. F4 LOW control-plane21 missing fields including all exposure/capability backfilled from CAP-ONBOARDING-OWNER-001; unmappable G2 signals left empty. F2 informational other-surface-generated pairing leaves phone-only Owner disabled control without countdown. F3 informational invite is **one-time carrier for durable City credentials**: exchanged credential equals control token byte-for-byte, accepted by /api/v0/city; same-code replay410; share text itself contains no durable credential. Existing pairing contract, not introduced here. F5 informational panel untested; four units cover lifecycle model only. Still open: second **physical phone**, only one attached, local consumer; optical scan and Scan QR/LAN/BLE not run. No APK provenance claim: same-source byte count10500445 matches receipt but SHA-256 differs, build not reproducible.
