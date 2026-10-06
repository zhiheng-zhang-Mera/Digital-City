# Capability Entry Closeout

[中文原文与生成导航](../README.md)

> **Status: READY / ACTIVE PROGRAMME**
>
> Addresses an explicit problem: **Utopia already has backend capabilities, APIs, state machines, or runtime paths, but normal Web/Android users lack direct entries, cannot readily discover them, or encounter broken final lifecycle steps.** Acceptance is **backend capability → discoverable user entry → complete user lifecycle**, rather than adding more features.
>
> [Persistent rules](../../CONSTRUCTION_RULES.md) · [Async relief](../../ASYNC_RELIEF_CONSTRUCTION.md) · [Process data](../../PROCESS_DATA_POLICY.md) · [Paper protocol](./PAPER_EVIDENCE_PROTOCOL.md) · [Entry matrix](./CAPABILITY_ENTRY_MATRIX.md) · [Registry](../../../capability-registry/README.md) · [Deferred items](./FUTURE_EXPOSURE_BACKLOG.md)

## 1. Owner objective

```text
backend semantics exists → API / action route exists → tests / runtime path exists
BUT → user cannot discover / invoke / complete it from normal UI
```

Distinguish CURRENT ENTRY GAP (mature backend, add entry now), SURFACE PARITY GAP (Web operable, other first-class surfaces such as Android incomplete), and FUTURE PRODUCT INTEGRATION (contract/infrastructure only, incomplete runtime/product route; no fake entries merely to have buttons).

## 2. Audit baseline

At programme creation, `codex/city-members-host-roles` served as a **historical discovery source** for capabilities not yet on main. It is mutable and **cannot be construction baseline or acceptance evidence**. From this control-plane reconciliation onward: each CEX workbook recognizes only its `required_ancestor_shas`; claim resolves remote candidate ref to full 40-character SHA; all ancestry guards must pass before writing `development_baseline_sha`; CEX-705 remains WAITING while City Members/Host Roles lack accepted exact SHA, never anchoring directly to the development branch.

### Claim-time baseline rules

Inherit `CONSTRUCTION_RULES.md §2A` fully:

1. Treat `baseline_candidate_refs` as discovery only.
2. Resolve full 40-character SHA remotely.
3. Verify every workbook `required_ancestor_shas`.
4. Atomically record `development_baseline_sha` only after all pass.
5. Branch names, short SHAs, and README prose cannot replace ancestry proof.
6. Upstream with only a development branch and no accepted exact SHA stays `WAITING_DEPENDENCIES`; do not start from its branch provisionally.

CEX-790 uses `DEPENDENCY_SHA_UNION_AT_CLAIM` to union accepted CEX-701..705 exact heads, never starting final audit from main lacking those components.

## 3. Confirmed entry gaps

| Category | Capability | Backend | Web | Android | Task |
|---|---|---|---|---|---|
| Current | Device reinstall/rebind | Route + identity lifecycle exists | No direct entry | None | CEX-701 |
| Current | Clone detection/credential conflict | API returns cloneFindings | Fetched but dropped | None | CEX-701 |
| Current | Provider switch declined→alternate device | switch-declined + handoff exists | No normal action entry | None | CEX-702 |
| Current | Capability catalog / what Utopia can do | /ask/targets exists | Appears only after Ask failure | Same | CEX-703 |
| Parity | Owner join approve/reject | API + Web exists | Yes | None | CEX-704 |
| Parity | Pairing session generation/share | API + Web exists | Yes | Primarily join path | CEX-704 |
| Parity | City name/enrollment/revoke | API + Web Settings exists | Yes | Older Settings | CEX-705 |
| Parity | Member roles/sharing/messaging | API + Web exists | Yes | None | CEX-705 |

## 4. Work decomposition

| ID | Work | Recorded status | Objective |
|---|---|---|---|
| [CEX-701](../CEX-701-device-recovery-rebind-and-clone-surface.md) | Device Recovery / Rebind / Clone Surface | READY | User-completable Settings recovery/clone flow |
| [CEX-702](../CEX-702-scheduler-choice-and-alternate-device-entry.md) | Scheduler Choice / Alternate Device Entry | READY | Expose another-device path instead of service switching; no generic CONFIRM abuse |
| [CEX-703](../CEX-703-capability-catalog-discoverability.md) | Capability Catalog / Discoverability | READY | Discover capabilities without first failing Ask |
| [CEX-704](../CEX-704-android-onboarding-owner-actions-parity.md) | Android Onboarding Owner Actions | READY | Join approval + pairing generation/share |
| [CEX-705](../CEX-705-android-member-device-management-parity.md) | Android Member / Device Management | WAITING_DEPENDENCIES | Wait for accepted City Members / Host Roles exact SHA |
| [CEX-790](../CEX-790-final-exposure-audit-and-freeze.md) | Final Exposure Audit / Freeze | COMPLETE | Full backend→surface reconciliation and entry-baseline freeze |

CEX-701..704 may run in parallel on two hosts if file ownership does not conflict; CEX-705 waits until accepted upstream SHA is recorded; CEX-790 waits for all five Development plus opposite-host Formal Review completions. These recorded planning statements coexist with later measured updates below; workbook/report remains authority.

### CEX-790 measured status (2026-10-06)

The table previously said WAITING_DEPENDENCIES despite workbook `status: 'COMPLETE'`; that programme-dashboard drift was corrected from workbook facts.

```text
WORKBOOK      COMPLETE; development_host Mech
              development_head_sha 04ecb7dd22ffd7296e00320b63681f7d9729181d
              Review waived by recorded Owner ruling: review_host null + review_waiver_authority
              merge_authority false
INTEGRATION   Alien current-main integration on 2026-10-06:
              integration/CEX-790-Alien-20261006 @ 4688274255464383d577841a37e85a556d92c678
              merge 65f86f91; parents main 213f9f9f + author 04ecb7dd
              PR #33 MERGEABLE / CLEAN
              reports/CEX-790/ALIEN_INTEGRATION_REPORT.md
VERIFICATION  Mech independent opposite-host report:
              reports/CEX-790/INDEPENDENT_VERIFICATION_Mech.md
              Per-file provenance traceable, no evil merge; two published repairs adopted byte-for-byte;
              server.mjs a clean union; all three cited CI runs API-rechecked SUCCESS attempt 1;
              local reproduction 1356/1359 (3 affected by persistent local City occupancy).
NOT DONE      This host did not merge and has no merge authority; PR #33 merge decision belongs elsewhere.
```

## 5. Two-host asynchronous operation

```text
Alien Development → Mech Formal Review
Mech Development → Alien Formal Review
```

Fully inherit atomic claims; physical-host independence; CI/long tests do not occupy hosts; event wake plus approximately 20-minute bounded rescan; automatic Review→Repair; typed zero-claim; no make-work; exact-head CI/evidence; latest-main integration refresh.

Do not lower independent-review requirements because frontend entries seem simple. Entry defects often need actual pages/devices. Review actively seeks counterexamples: backend exists but user cannot reach it; click invokes wrong semantics; button exists but does nothing.

## 6. Mandatory paper-material retention

All tasks follow [PAPER_EVIDENCE_PROTOCOL.md](./PAPER_EVIDENCE_PROTOCOL.md). Retain every real runtime error, test/CI failure, browser/Android page failure, stale/race/timing anomaly, design/runtime conflict, Web/Android discrepancy, Development/Review disagreement, rejected approach, repair before/after, measurable latency/retry/convergence/resource/test counts, Owner intervention, and final exact-head/merged-main acceptance. **Repair must not delete failure history.** Defect→diagnosis→repair→independent verification often supplies the most valuable material.

## 7. Scope protection

Allowed: direct entries for existing stable capabilities; frontend wiring to existing APIs/actions; discoverability/normal user paths; Web/Android parity; minimum necessary DTO/presentation adapters; tests/E2E/physical-device evidence for lifecycle closure.

Prohibited: rewriting backend ownership for buttons; rewriting Remote Fabric/Shared Task Core/Engineering Manager/General AI Gateway; presenting contract-only future capabilities as working products; second device registry/scheduler/task truth; new dangerous permissions or long-term secrets merely for UI completeness; mechanically turning debug endpoints into buttons.

## 8. Final merge lock

**Do not create a final merge workbook now.** Only when CEX-701..705 have Development complete, opposite-host Formal Review complete, exact-head CI green, required Web/Android real-surface evidence, complete PAPER_MATERIAL_INDEX.md, and no unresolved Owner gate may CEX-790 finish final audit and an integration workbook be created.

Terminal marker: `CAPABILITY_ENTRY_BASELINE_EXPOSED_AND_AUDITED`. It means **entry completeness of currently mature capabilities**, not productization of FUTURE_EXPOSURE_BACKLOG items whose runtimes remain incomplete.

## 9. Capability Registry bootstrap

CAPABILITY_ENTRY_MATRIX.md is programme-level historical exposure-debt work, not a permanent second registry. New/substantially modified capabilities follow §14C. CEX-701..705 should create/update CAP-* records as they touch capabilities. CEX-790 generates/aligns long-term Registry from final independent inventory. Verified state binds full SHA plus UI/E2E evidence. Unreverified legacy items may remain LEGACY_BACKFILL_PENDING; do not copy old matrices as verified truth.

```text
CEX matrix = historical programme discovery / closeout evidence
capability-registry/ = durable citywide capability inventory
```

Registry reconciliation is a CEX final-audit completion gate, not optional documentation work.

## Current merge status

CEX-790 merged into Utopia main under explicit Owner authorization. PR33 merge SHA `b06504f1f96984c960b2661b8ee3a7130796d379` includes audited 4688274 as ancestor. Premerge checks passed; the earlier update recorded postmerge CI pending and made no deployment claim. [Merge record](../../reports/CEX-790/MAIN_MERGE_REPORT.md).

Later postmerge measurement: exact main `b06504f1f96984c960b2661b8ee3a7130796d379`, V0.2 checks37422119627 and linkage37422119640 completed SUCCESS. Both measured checks passed; runtime deployment remains unobserved.
