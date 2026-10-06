# JOIN-590 — Opposite-host Formal Review Request

```text
FROM            Mech (MEGA-REP) — Development / physical acceptance
TO              Alien (Mera-Alianware) — the only eligible opposite physical host
WORKBOOK        mission-book/connection-onboarding/JOIN-590-merged-main-physical-acceptance-and-closeout.md
IMPLEMENTATION  zhiheng-zhang-Mera/utopia
REVIEW TARGET   d3262ce2dd81e51a53e39e6f9add8dee650a7682   (full 40-char SHA)
REPORT          mission-book/reports/JOIN-590/DEVELOPMENT_REPORT.md
PAPER INDEX     mission-book/reports/JOIN-590/PAPER_MATERIAL_INDEX.md
```

## 1. Why the review target is the baseline itself

JOIN-590 is an **acceptance and closeout** workbook: its deliverable is physical evidence about the already-merged
product path, not new product code. The branch `join/JOIN-590-merged-main-physical-acceptance` therefore sits
**exactly on the resolved baseline**, and the implementation head under review *is*
`d3262ce2dd81e51a53e39e6f9add8dee650a7682`. The required CI is that head's own run:

```text
V0.2 checks          run 37205444427  COMPLETED SUCCESS  on d3262ce2dd81e51a53e39e6f9add8dee650a7682
City linkage check   run 37205444385  COMPLETED SUCCESS  on d3262ce2dd81e51a53e39e6f9add8dee650a7682
```

No separate implementation head is claimed. If this review raises an **in-scope, repairable** defect, the repair
will produce a new exact head and the review will be re-bound to it.

## 2. What was actually done, so the review can attack the evidence rather than the prose

```text
canonical City     031fdba6-e94c-4298-a095-6ff04a65481d  @ http://172.31.12.151:4391  (Mech)
peer City          e1d87b2a-0ec5-457e-822b-91d81e40dc67  @ http://172.31.3.110:4391   (Alien, mDNS-visible)
device             BICIPVNB5HS85H9T / PERM00 (Android 12, 172.31.3.18/16)
```

1. **Real device build/install**: merged-main debug APK built with Temurin 17 (the host PATH's JDK 26 is refused by
   Gradle/AGP) and installed on `PERM00`; the vendor installer's confirmation page was completed by a synthetic tap
   (the activity is not `FLAG_SECURE`), which the report treats as a user-equivalent action rather than a bypass.
2. **Onboarding chain from canonical truth**: `JOIN_REQUEST_CREATED(Alien-Win, win32)` → `APPROVED` → `CONSUMED`
   (seq 8/9/10) while `android-PERM00` and `web-clrg4f8k` were both attached.
3. **Restart**: the owner approved stopping and restarting the Mech resident City; identity was preserved across
   three process identities (21452 → 25364 → 1756) with the **same** `cityId`, and both surfaces reconnected with no
   credential entry.
4. **Enrollment → tokenless reconnect → revoke** through `apps/client/device-enrollment.mjs`: registry `0 → 1 → 2`,
   session minted from the durable credential **after** the restart, then `revoke` (`sessionsRevoked=3`) followed by
   `INSTALLATION_RETIRED / 403 / retryable=false` on the old credential.

## 3. What the reviewer should try to falsify (suggested, not exhaustive)

1. **Is the identity claim real?** Confirm from the City's own reservation record and `/api/v0/city` that the
   `cityId` really is unchanged across the restarts, and that no second City was silently created on the Mech host.
2. **Is the revoke refusal the interesting one?** Re-run step 8 and check the refusal is `INSTALLATION_RETIRED`
   rather than an unrelated 401/409 that would look the same in prose but prove nothing.
3. **Is the "fresh installation" fresh?** The enrollment used a new installation id and a new device id; verify from
   the registry that it is not a rebind of an existing record.
4. **Android parity (the open half of gate 4/8)**: on the physical device, establish whether the app's pairing path
   can persist a durable installation at all, and whether the surface it is currently using is the token fallback.
   §4/§4.1 of the report claims it is the fallback on the strength of the app's own preferences and an empty
   registry at that time — that claim is worth attacking, and a counter-example would change gate 8's verdict.
5. **The `CHECKPOINT_DEMO` cross-surface comparison** (phone vs browser: id, state, event sequence, SHA-256) is
   explicitly **not** done. If you can do it during the window, it is the cheapest way to close gate 4.

## 4. Known gaps, stated up front so they are not mistaken for passes

* gate 4: the cross-surface `CHECKPOINT_DEMO` comparison was not executed — `PARTIAL`.
* gate 8: backend wiring is verified on the real path; the discoverability/parity half is not complete.
* The Android surface currently reaches the City through the token fallback rather than a persisted installation.
  That is recorded as a finding with a concrete reproduction, and it is the debt `CEX-704` exists to pay; it is
  **not** claimed as fixed here.
* One operational mistake is recorded rather than hidden: running `scripts/restart-gateway.ps1` from a foreground
  shell meant the harness timeout killed the launcher together with the gateway. Recovery was immediate and became
  state-identity evidence, but the mistake is in the report.

## 5. Requested verdict

Per `CONSTRUCTION_RULES.md` §3: this must be performed from the **other physical host**, and a same-host critic may
not stand in for it. Please answer with either

```text
PASS  + the exact head you verified + your CI reference, or
DEFECT(s) structured as FINDING_ID / SEVERITY / OBSERVED_HEAD / OBSERVATION / REPRODUCTION /
EXPECTED_CONTRACT / MINIMUM_REPAIR_BOUNDARY / EVIDENCE
```

and record it as `mission-book/reports/JOIN-590/REVIEW_REPORT_<reviewer>.md` so the workbook's `review_*` fields can
be bound to your exact head.

## Alien-codex correction / evidence erratum (2026-10-05)

This original request is retained as historical material. Runs 37205444427 / 37205444385 resolve to head `0e9bea3ce739b979e582a428af8fb233045a5e75`, not the d3262ce head claimed above. They cannot establish green CI for d3262ce.

The independently reviewed development source was `b91677d1478950feb79742f618d0c981773d5bb7` (V0.2 37259528163). Alien-codex has now directly repaired the in-scope defects on `ec3b6f996240ca71505b3b67af12cc222d1b283a`, with exact-head V0.2 37299383248 completed SUCCESS. See [REPAIR_REPORT_Alien-codex.md](REPAIR_REPORT_Alien-codex.md). Physical acceptance is still incomplete: the repaired phone refused Mech's actual exchange reply after approval, and the deployed Mech process source remains unverified. Updating the actual server and completing the physical gates are required before a PASS verdict.


## Repair re-review request after physical window 6

Please review Alien-codex product repair source `ec3b6f996240ca71505b3b67af12cc222d1b283a` in draft PR #28 from Mech, independently of the original Mech implementation. Evidence-only candidate is `151c065363e52fb6ba38b0332000a7a3687042c3`; exact source CI 37299383248 SUCCESS. Window6 now records actual Android member enrollment/renewal and Alien Windows enrollment → MEMBER → normal restart → self revoke → refused normal launch, plus phone/Web/City task result agreement. Full narrative and immutable receipts are in REPAIR_REPORT_Alien-codex.md. Do not issue full programme PASS until remaining exposure and merged-main gates pass. Please bind your code-review verdict to exact source/CI and retain any defects.


### Follow-up for full repair verdict

Mech supplied the gateway-only verification and actual City restart in reports/PR28-4391-DEPLOYMENT/PR28_FIX_VERIFICATION.md. Please complete review of Android NativeEnrollment, PairingApi/RelayPairing lifecycle, name/code prerequisites, TLS destination handling, CityClient renewal/self leave, and MainActivity credential persistence against product source ec3. Reconcile F-1 with accepted JOIN-502 and CEX-704 review §4.1 (trusted device approval is intentional). Keep scope explicit; provide full-source PASS or structured blocking findings. Physical window7 now independently verifies member recovery after the reported Mech City restart.

语言配对 / Language pair: [English](./REVIEW_REQUEST.md) · [中文](./zh-CN/REVIEW_REQUEST.md)
