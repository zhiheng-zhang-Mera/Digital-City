# CEX-790 — DEVELOPMENT REPORT (backend → Web/Android final entry audit)

```text
WORKBOOK            CEX-790 Backend → Web/Android 最终入口审计与冻结
DEVELOPMENT HOST    Mech (COMPUTERNAME MEGA-REP), role Mech-DS
ANCHOR MODE         DEPENDENCY_SHA_UNION_AT_CLAIM
UNION BASELINE      5c7d46dcbf1b01259b5edaf574b620714beb40b7
EVIDENCE HEAD       04ecb7dd22ffd7296e00320b63681f7d9729181d  (inventory + matrix on the union branch)
BRANCH              cex/CEX-790-mech-final-audit
CLAIM EVIDENCE      mission-book/reports/CEX-790/CLAIM_RECORD.md
TERMINAL MARKER     CAPABILITY_ENTRY_BASELINE_AUDITED — NOT released by development (see §6)
```

## 1. What had to be built before the audit could start

The workbook anchors on a dependency SHA union over CEX-701 … CEX-705 and recorded
`baseline_blocker: DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE`. All five dependency markers were released by the
opposite-host reviews performed on this host, so the blocker's cause was gone — but **the union did not exist**. A single
octopus merge of the five accepted heads fails:

```text
ERROR: content conflict in apps/android/.../MainActivity.kt
fatal: merge with strategy octopus failed
```

The five tasks were developed in parallel over the same files. The union was therefore constructed with four sequential
merges, every conflict resolved by keeping **both** sides' behaviour, then validated as a working baseline:

```text
five task suites                     12 / 12 pass
join/pairing/enrollment/gateway     154 / 154 pass
scripts/check-bilingual.mjs         docs / evidence / data-records SYNCHRONIZED
:app:testDebugUnitTest :app:assembleDebug   BUILD SUCCESSFUL — 18 suites / 97 tests / 0 failures
```

Full construction notes, every resolution, and what the union does **not** assert are in `CLAIM_RECORD.md`.

## 2. The audit: ten sources, 145 items

`utopia:evidence/raw/mission-book/CEX-790/capability-inventory.json` is the machine-readable inventory;
`utopia:evidence/raw/mission-book/CEX-790/CAPABILITY_ENTRY_INVENTORY.md` is the human matrix and the curated
exception list. The ten sources the workbook names were read as follows:

```text
1  Gateway user-facing routes        parsed the dispatcher in services/dev-gateway/server.mjs   48
2  Action routes / operations        the operation catalog in services/dev-gateway/actions.mjs  9
3  Ask targets                       the same catalog the ask/targets route serves (no second copy)
4  Room catalog                      read from the same catalog module as the Room operations
5  capability registry               every record under the Digital-City capability-registry/records/  11
6  Web clickable entry               data-page / data-terminal / data-scheduler-action / data-goto / button ids  41
7  Android clickable entry           nav lists, page branches, @Composable …Panel definitions  32
8  Settings / recovery lifecycle     the device, pairing and join routes plus the Settings/recovery panels
9  scheduler user actions            ACTION_WIRING in apps/web/scheduler.js   4
10 existing registry records/backfill the same 11 records, plus the two index files reconciled in §4
                                                                                       TOTAL 145
```

Classes after curation:

```text
EXPOSED               109
EXPOSED_ADVANCED        1
INTERNAL_PROTOCOL      24
CURRENT_ENTRY_GAP       8
PARITY_GAP              3
```

**No user-facing backend capability is left unclassified.**

## 3. The curated exceptions — the audit's real output

The automated rules produce candidates, not verdicts. Each of the eleven gap candidates is curated with a reason and a
kind so the reviewer can attack a specific line rather than a classifier:

```text
REGISTRY_GAP      5  GET /api/v0/capabilities, GET /api/v0/capabilities/:id,
                     POST /api/v0/capabilities/:id/invoke, GET /api/v0/capability-invocations,
                     GET /api/v0/capability-invocations/:id
                     The Web Services page and the Android 能力服务 panel both list and invoke capabilities, so the
                     surface is user-reachable, but NO record named the bridge behind it. This is a registry gap, not
                     a UI gap, and it is closed in §4.

PARITY_GAP        2  POST /api/v0/host/join and GET /api/v0/host/join/status
                     A browser may switch this host between PRIMARY and MEMBER; the Android surface has no
                     equivalent. The route is deliberately restricted to a local host-owner request, so this is
                     recorded as a real first-class-surface parity gap rather than as a missing entry.

FALSE_POSITIVE    3  POST /api/v0/tasks/:id/cancel, POST /api/v0/tasks/:id/provider-choice, page Actions
                     The rules could not see them: the Web reaches cancel and provider-choice through the
                     ACTION_WIRING table rather than through path-shaped strings, and the Android nav names the same
                     page "Action" singular. All three are EXPOSED on both surfaces.

BY_DESIGN         1  CONFIRM
                     ACTION_WIRING declares kind=unwired with no route. The CEX-702 review accepted this as the
                     honest-unwired control; it must not be wired until a canonical route with proven-identical
                     semantics exists.
```

Two classifier defects found and fixed while building this, recorded because they were exactly the kind of thing that
silently falsifies an audit: the registry was first read from the implementation repo instead of the control plane (so
eleven registered capabilities looked unregistered), and the route patterns lost their `/api/v0/` prefix (so pattern
routes were unrecognisable). The first two drafts of the union integration also dropped functions while resolving
conflict blocks; the per-task symbol check caught them.

## 4. Registry backfill and reconciliation

```text
CAP-WORKER-POOL-AGENT-001   REALITY MISMATCH FOUND: the record still declared
                            CANDIDATE_RECONCILED_PENDING_FORMAL_REVIEW while WBC-603 is COMPLETE, review_complete true,
                            and the terminal marker WORKER_POOL_AGENT_SEAM_ACCEPTED was released by the opposite-host
                            review on this host. Reconciled to FORMAL_REVIEW_RECONCILED with the review outcome named.
                            This is precisely the CAPABILITY_REGISTRY_REALITY_MISMATCH the workbook's gate forbids.

CAP-CAPABILITY-BRIDGE-001   NEW RECORD for the surface the audit found unnamed: the capability catalogue and its
                            invocation path (GET /capabilities, GET /capabilities/:id,
                            POST /capabilities/:id/invoke, GET /capability-invocations,
                            GET /capability-invocations/:id). Exposure class DIRECT_CONTROL on both first-class
                            surfaces (Web Advanced > Services, Android More > 能力服务), implementation COMPLETE,
                            backend wiring VERIFIED, reachability PARTIAL, intent NOT_TESTED, last verified SHA bound
                            to the union baseline. It is a record of a surface that already existed, not a new feature.

CAPABILITY_INDEX.yaml       regenerated from the records: 12 records with exposure class, reconciliation state and the
                            exact verified SHA each; legacy_backfill_status moved to RECONCILED_AT_FINAL_AUDIT.
SURFACE_INDEX.yaml          POPULATED — it previously carried empty surface lists for every platform despite nine
                            records declaring surfaces. Each platform now lists its capability, location and nesting.
CAPABILITY_EXPOSURE_MATRIX  refreshed in BOTH languages as a populated 12-row table; it was previously an empty
                            BOOTSTRAP VIEW template with no data rows at all.
```

## 5. Paper material

`mission-book/reports/CEX-790/PAPER_MATERIAL_INDEX.md` records the audit's material, and the programme-level synthesis
required by the workbook is at `mission-book/reports/CEX-PROGRAMME/PAPER_MATERIAL_SYNTHESIS.md`.

## 6. What development does NOT claim

* **The terminal marker is not released.** `CAPABILITY_ENTRY_BASELINE_AUDITED` is a review outcome. The workbook's
  Formal Review section requires the reviewer to rebuild the inventory **independently from the code** and to diff the
  two inventories, classifying every difference. Development cannot self-certify that diff, and this host is not an
  eligible opposite host for its own work.
* **No intent validation.** The backfilled record keeps `intent_validation_status: NOT_TESTED`, and no user surface was
  driven by this audit; the inventory was read from code and contracts.
* **The audit baseline is the union, not `main`.** None of the five dependency heads is merged and no workbook grants
  merge authority. The union exists to give this audit a legal anchor and is published as a branch for that purpose.
* **The CEX-705 review finding F1 is inherited, not fixed.** The member projection reporting an offline node as
  connected lives in `members.mjs`, is carried by the union, and is classified by this audit as a genuine defect
  (`CAP-CITY-MEMBERS-NATIVE-001`, a presentation-truth defect rather than an entry gap).
* **The parity gap is not a defect.** The host role switch being browser-only is recorded as a gap because the workbook
  asks for parity to be stated, not because every platform must be equal.

语言配对 / Language pair: [English](./DEVELOPMENT_REPORT.md) · [中文](./zh-CN/DEVELOPMENT_REPORT.md)
