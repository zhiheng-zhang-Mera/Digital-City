# CEX-790 baseline resolution / 依赖 SHA 并集解析

```text
CLAIMANT            Mech (COMPUTERNAME MEGA-REP), role Mech-DS
ANCHOR MODE         DEPENDENCY_SHA_UNION_AT_CLAIM
UNION BASELINE      5c7d46dcbf1b01259b5edaf574b620714beb40b7
UNION BRANCH        cex/CEX-790-mech-final-audit (remote tip equals that commit)
CONSTRUCTED FROM    de9185a4ef8d761053c88316ec9efeca037239fb  (CEX-705 head, the starting point)
                    + a24c04401308b11548626239e8ca1f9b4276bbdf (CEX-701 head, merged)
                    + 3d233ff39d1e96b8a590b12f520f98c283356f25 (CEX-702 head, merged)
                    + 478d486096512eea3266350efe070323a232a120 (CEX-703 head, merged)
                    + d05f5a455ff535e3e065b30ec9ec74bca2dbb521 (CEX-704 head, merged)
ANCESTRY VERIFIED   git merge-base --is-ancestor exit 0 for all five heads against the union
```

## 1. Why a union had to be built rather than read

CEX-790 declares `baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM` with
`dependency_source_workbooks: [CEX-701 … CEX-705]` and recorded
`baseline_blocker: DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE`. All five dependency markers were released by the
opposite-host reviews performed on this host, so the blocker's cause is gone — but the union itself did not exist:

```text
first attempt: git merge --no-edit <701> <702> <703> <704>   (octopus, from the 705 head)
  -> ERROR: content conflict in apps/android/.../MainActivity.kt
  -> fatal: merge with strategy octopus failed
```

The five tasks were developed in parallel on the same files — `MainActivity.kt`, `CityClient.kt`, `apps/web/app.js`,
the two i18n files and `services/dev-gateway/server.mjs` all carry additions from more than one of them — so the
dependency SHA union had to be **constructed and validated**, not merely quoted.

## 2. How the union was built

Four sequential merges in ascending task order, each conflict resolved by keeping **both** sides' behaviour rather
than by choosing one:

```text
merge CEX-701  conflict: MainActivity.kt Settings page
               resolution: keep the CEX-705 CityManagementSettings card AND the CEX-701 DeviceRecoveryPanel card
merge CEX-702  conflicts: apps/web/app.js (x2), i18n/en.js, i18n/zh-CN.js, CityClient.kt (x2), MainActivity.kt
               resolutions: keep the CEX-701 hash-page boot line AND the CEX-702 scheduler context state;
                            keep the CEX-701 recovery focus restore AND the CEX-702 scheduler context reset;
                            keep both Object.assign message blocks with a single export;
                            union the typed-error path list (… || endsWith("/switch-declined"));
                            keep the CEX-705 member functions AND the CEX-702 alternateDevice function;
                            keep the CEX-705 member management state AND the CEX-702 scheduler choice state
merge CEX-703  conflicts: apps/web/app.js, i18n/en.js, i18n/zh-CN.js
               resolutions: keep the CEX-703 credentialContext terminal render AND the CEX-702 busyTasks scheduler
                            render; keep all three Object.assign message blocks with a single export
merge CEX-704  conflicts: CityClient.kt (x2), MainActivity.kt
               resolutions: union the typed-error path list (… || join/requests || pairing/);
                            keep the member/alternate functions AND ownerOnboarding/generateOwnerPairing/decideJoin;
                            keep the member and scheduler state AND the owner onboarding state (ownerCityId, ownerPrefs)
```

Every resolution was verified afterwards by symbol presence per task, because two drafts of this integration
mistakenly dropped a function while editing the conflict block; those were caught by the check and restored, and the
final tree carries no conflict marker in any `.kt`, `.js`, `.mjs` or `.md` file.

## 3. Validation of the union — it is a working baseline, not merely a merge

```text
tests/cex701-recovery-ui.test.mjs      3 / 3 pass
tests/cex702-choice-ui.test.mjs        4 / 4 pass
tests/cex703-catalog-ui.test.mjs       3 / 3 pass
tests/cex704-native-owner.test.mjs     1 / 1 pass
tests/cex705-native-members.test.mjs   1 / 1 pass
join/pairing/enrollment/gateway set  154 / 154 pass
node --check on every changed web module  OK
scripts/check-bilingual.mjs           docs / evidence / data-records all SYNCHRONIZED
:app:testDebugUnitTest :app:assembleDebug  BUILD SUCCESSFUL, 18 suites / 97 tests / 0 failures / 0 errors
```

The Android build is the strongest single check: the Kotlin conflicts were resolved by hand and the union still
compiles and passes the union of all five tasks' unit suites.

## 4. Dependency markers this claim relies on

```text
CEX-701  DEVICE_RECOVERY_ENTRY_ACCEPTED                     released by Mech review commit 580652a
CEX-702  ALTERNATE_DEVICE_USER_CHOICE_EXPOSED               released by Mech review commit 1caf830
CEX-703  CAPABILITY_CATALOG_DISCOVERABLE                    released by Mech review commit aa9269f
CEX-704  ANDROID_ONBOARDING_OWNER_ACTIONS_PARITY_ACCEPTED    released by Mech review commit 013a862
CEX-705  ANDROID_MEMBER_DEVICE_MANAGEMENT_PARITY_ACCEPTED    released by Mech review commit bd06369
```

Each source workbook is COMPLETE with `review_complete: true`, and each `review_head_sha` equals the head merged
above — so the union is built from **reviewed** heads and not from development heads that merely passed development CI.

## 5. What this claim does NOT assert

* It does not assert that the union is what `main` will become: none of the five is merged, and no workbook grants
  merge authority. The union exists to give CEX-790 a legal dependency anchor, and is published as a branch for that
  purpose.
* It does not re-open the five reviews. Their findings stand as recorded; the union inherits them unchanged. In
  particular F1 of the CEX-705 review (the member projection reporting an offline node as connected) is a defect in
  `members.mjs` that this union carries, and CEX-790's audit is where it should be classified.
* It does not claim the union was independently reviewed. That is what CEX-790's own opposite-host review is for.

语言配对 / Language pair: [English](./CLAIM_RECORD.md) · [中文](./zh-CN/CLAIM_RECORD.md)
