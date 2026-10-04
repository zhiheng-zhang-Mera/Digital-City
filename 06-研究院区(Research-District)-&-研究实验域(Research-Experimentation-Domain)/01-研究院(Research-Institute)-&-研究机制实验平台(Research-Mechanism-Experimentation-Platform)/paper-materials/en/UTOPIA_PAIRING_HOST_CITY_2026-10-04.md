# Paper material: Utopia pairing, single-host City ownership and remote login

FACT: MATERIAL_ID=UTOPIA-PAIRING-HOST-CITY-2026-10-04
FACT: OBSERVATION_DATE=2026-10-04
FACT: EVIDENCE_LEVEL=LOCAL_ENGINEERING_REGRESSION
FACT: PAIRING_SHA=5af0640a5b979c2830c487950f29f3da7360e1c4
FACT: HOST_CITY_SHA=bd8925082aefda059eb9932f8065904ed3250008
FACT: PAIRING_ROOT_PASS=1184/1184
FACT: HOST_ROOT_PASS=1189/1189
FACT: FINAL_FOCUSED_PASS=15/15
FACT: PHYSICAL_TWO_DEVICE_WIFI=NOT_RUN
FACT: PHYSICAL_TWO_DEVICE_BLE=NOT_RUN
FACT: CROSS_REGION_INTERNET=NOT_RUN
FACT: CI_RUN=37191764473
FACT: CI_CONCLUSION=failure
FACT: CI_GATEWAY_WEB_PASS=1189/1190
FACT: CI_ANDROID=success
FACT: PRODUCT_MAIN_MERGED=false
FACT: PAPER_STATUS=CANDIDATE_MATERIAL_NOT_PAPER_VALIDATED

## Provenance and purpose

This archive preserves existing results from two Utopia repair rounds. It runs no new experiment, changes no Digital-City runtime mechanism and grants no active-workbook acceptance. It is candidate engineering material for future papers, not completed paper validation or product-main acceptance.

- Pairing repair: [immutable commit 5af0640](https://github.com/zhiheng-zhang-Mera/utopia/commit/5af0640a5b979c2830c487950f29f3da7360e1c4).
- Host ownership and remote login: [immutable commit bd89250](https://github.com/zhiheng-zhang-Mera/utopia/commit/bd8925082aefda059eb9932f8065904ed3250008).
- The [structured manifest](../evidence/UTOPIA_PAIRING_HOST_CITY_2026-10-04.json) binds source paths, Git blob SHA-256, recorded source hashes, run scopes and untested scenarios.
- Raw logs and screenshots remain in Utopia. Digital-City stores compact summaries and evidence pointers under its [Process Data Policy](../../../../mission-book/PROCESS_DATA_POLICY.md).

## Observations and resulting behavior

The user's report that input disappeared after about 2–3 seconds and a correct code failed is a field symptom, not a controlled pre-repair timing measurement.

| Problem | Resulting behavior | Evidence and boundary |
|---|---|---|
| Snapshot refresh interrupts slow code entry | Preserve the input node, focus, draft and failure message; restore in-memory draft after navigation | Scripted browser regression covers typing, refresh, navigation and retry; no user study |
| No active Web discovery controls | Gateway runs mDNS/Windows BLE discovery; selected target origin performs code exchange | Scripted rows test selection, City pin and retry; screenshot is layout evidence |
| First broadcast address is unreachable on a multi-NIC host | Bound attempts across advertised addresses and verify City identity | One physical Ethernet Windows host resolves 3 City endpoints; not 3 physical devices |
| Different copies and ports start different Cities | Fixed loopback reservation and canonical database pointer; Gateway, Agent and Rooms share one process | Two temporary installation directories launch concurrently and reuse PID, cityId and data directory across ports |
| Crash or replacement changes City identity | Reuse canonical database; refuse a mismatched persisted City identity | Forced process termination retains cityId; Windows restart preserves options; mismatched identity prevents publication |
| Invite loses its host and reconnect uses local address | Preserve native/Web invite endpoint and reconnect to recorded target | Real local HTTP code exchange enrolls and reconnects; unreachable target starts no local fallback |
| Forgotten enrollment is imported from an old installation | Explicit forgetting prevents legacy reimport | Dedicated regression; not an OS credential-storage security assessment |

BLE supplies location discovery here. Pairing and control use LAN HTTP/WebSocket. This is not evidence of a full Bluetooth data connection or native browser BLE control.

## Results and frozen scope

| Run | Result | Scope |
|---|---|---|
| Pairing full regression | 1184/1184 PASS | Committed validation records counts and log digest; the raw log was not committed in that round |
| Pairing focused regression | 88/88 PASS | Overlaps full regression; do not add counts as independent samples |
| Host full regression | 1189/1189 PASS | Raw log retained; run started before the last identity-pin and forgotten-enrollment repairs |
| Final focused regression | 15/15 PASS | Verifies frozen final sources and the last repairs; not a full-suite run at the final SHA |
| Non-loopback single-host short-code exchange | PASS, single-use | Not a two-device Wi-Fi or cross-region experiment |
| GitHub CI at final commit | Gateway/Web 1189/1190; Android PASS; run failure | Hosted Windows, Node 24.21.0; multi-install launch readiness exceeded 20 seconds; cause unconfirmed |
| Windows BLE scan | Completed, 0 Utopia advertisements | Scanner execution only; not successful two-device discovery or pairing |

Counts denote regression cases, not users, physical devices or independent repeated trials. No repeated-trial design supports latency percentiles, confidence intervals or significance. Whole-suite duration is not connection latency.

[Full log](https://github.com/zhiheng-zhang-Mera/utopia/blob/bd8925082aefda059eb9932f8065904ed3250008/evidence/raw/host-city-remote-login/full-suite.log), [final focused log](https://github.com/zhiheng-zhang-Mera/utopia/blob/bd8925082aefda059eb9932f8065904ed3250008/evidence/raw/host-city-remote-login/final-focused.log), [pairing validation](https://github.com/zhiheng-zhang-Mera/utopia/blob/5af0640a5b979c2830c487950f29f3da7360e1c4/evidence/raw/pairing-search/validation.json).

## Failures and negative results

1. Initial pairing regression passed 1177/1179. Missing City parser dependencies in the isolated directory caused two failures; existing dependencies were made available and tests rerun. Preserve the failed attempt.
2. The [superseded host run](https://github.com/zhiheng-zhang-Mera/utopia/blob/bd8925082aefda059eb9932f8065904ed3250008/evidence/raw/host-city-remote-login/superseded-intermediate.log) passed 13/14 and recorded a 20-second readiness timeout. It is not pooled with final results; its root cause was not established through a frozen reproduction.
3. Zero BLE discoveries are a negative result. A completed scan does not imply pairing success.

4. Publishing the evidence branch triggered [CI 37191764473](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37191764473), which completed with failure: Gateway/Web passed 1189/1190 with the multi-install readiness timeout as its only failure; Android succeeded. The CI failure remains unresolved. Local success is not evidence of cross-environment stability or release readiness.

## Claims and future experiments

Supported case descriptions concern input-state preservation, host-level ownership with durable City identity under concurrent copies and crash recovery, and separation of target location from authorization with pinned reconnect behavior.

There is no measured basis for faster user connection, higher network-wide success, CPU or energy savings, general platform coverage, or deployed global short-code login. A six-digit code belongs to an active session at an explicitly reachable City. No global directory, automatic NAT traversal or public relay is deployed by these repairs.

Future experiments require two real same-Wi-Fi devices, two BLE devices with advertisement and exchange evidence, real HTTPS deployments in two regions, and repeated trials or controlled before/after comparisons on a frozen commit. Predefine topology, identity, refresh cadence, typing time, concurrent launch count, connection timing, failure counts and statistical methods.

Those experiments remain NOT_RUN/NOT_MEASURED. These suggestions do not activate a workbook. Local regression, CI, product-main acceptance and paper review remain distinct states.
