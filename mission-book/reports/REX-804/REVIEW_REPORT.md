# REX-804 opposite-host Formal Review — Mech

```text
REVIEWER            Mech (COMPUTERNAME MEGA-REP), role Mech-DS, physical host MEGA-REP
DEVELOPER           Alien (different physical host) — the workbook records development_host=Alien
REVIEWED HEAD       f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5   (branch rex/REX-804-Alien-codex-faults)
REVIEW BRANCH       review/REX-804-mech-review @ 737c3e1602b87b18395c69757127a3b500fc54e4
CLAIM               mission-book/reports/REX-804/REVIEW_CLAIM_Mech.md (published before any verdict)
VERDICT             NOT PASSED on the reviewed head — returned for repair of finding B1
TERMINAL MARKER     FAULT_INJECTION_RECOVERY_ACCEPTED  NOT RELEASED
MERGE AUTHORITY     none
```

## 1. Independence and claim-time measurement

The workbook records `development_host: Alien`; the reviewer is Mech on a different physical machine, so this is not a
self-review. Before any verdict the reviewer re-measured, rather than trusted:

```text
remote tip of rex/REX-804-Alien-codex-faults == f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5   (exit 0)
required ancestor 69a097b5394a9fece39dd11cc13f04c9b4d28bfe reachable   (git merge-base --is-ancestor, exit 0)
declared dependency REX-802 833279cae237080cca88b1b6dbc9f217027ba68f reachable   (exit 0)
exact-head check runs re-read from the GitHub API: gateway-web success (x2), android success (x2),
    reciprocal-contract success — all terminal success
```

## 2. What the reviewer could and could not reproduce

| Item | Author's claim | Reviewer's measurement |
|---|---|---|
| `tests/rex804-faults.test.mjs` | focused pass | 8 pass / 0 fail on the reviewer host |
| `tests/rex804-gateway.test.mjs` | focused pass | 1 pass / 0 fail |
| `tests/rex804-web.test.mjs` | focused pass | 1 pass / 0 fail |
| Focused total | 10 PASS | **10 PASS reproduced** |
| Whole local suite / the S1 relay timing failure | reported by the author | **NOT re-run by this review** — out of the reviewer's instrument scope, and no verdict here rests on it |
| Physical-host / external-provider recovery | declared NOT measured | not measured here either; the reviewer agrees it is absent, not zero |
| Android controls | declared an explicit seam | confirmed absent from the change; no Android fault surface exists |

## 3. Independent instruments (nine probes, all on the reviewed head)

Written for this review at `utopia:tests/rex804-mech-review-probes.test.mjs`, deliberately attacking what the author's
tests do not:

```text
P1  TWO faults live at once on two different nodes: each acts only on its own node and its own operation, and stopping
    one leaves the other ACTIVE.                                            -> VERIFIED CORRECT
P2  A new fault on the same node immediately after an emergency stop, then wait past the STOPPED fault's original
    expiry: the stopped fault stays STOPPED (its timer is dead) and the live one stays ACTIVE.  -> VERIFIED CORRECT
P3  Expiry persisted to the RECEIPT FILE by the timer itself, with no API read in between.       -> VERIFIED CORRECT
P4  A delayed report released by the fault's OWN EXPIRY (not by a manual stop) and reaching canonical truth, with
    recovery attributed.                                                                            -> VERIFIED CORRECT
P5  Owner-only boundary measured with an ENROLLED MEMBER credential, plus typed refusals over HTTP (confirmation
    mismatch, duration bound, unknown key, unknown class, unknown target, unknown id).               -> VERIFIED CORRECT
P6  The four-class matrix read FROM DISK: startable, stoppable, recorded, exercised, and recovery measured or
    honestly absent.                                                            -> VERIFIED, with finding F1
P7  A receipt left ACTIVE by a dead process: disabled on the next start, persisted as INTERRUPTED/PROCESS_RESTART,
    and the fault is not in force.                                                                    -> VERIFIED CORRECT
P8  An unreadable fault receipt present at start.                              -> FINDING B1 (blocking)
P9  A receipt that is valid JSON but has no fault identity.                    -> FINDING B3
```

## 4. Findings

### B1 — BLOCKING: one unreadable fault receipt prevents the entire City from starting

```text
OBSERVED   createFaultController iterated every fault-*.json in its directory and called JSON.parse without a guard, so
           a single unreadable file made createGateway throw a raw SyntaxError (no code, no status, no typed refusal).
           Measured directly: "RESULT: createGateway THREW -> SyntaxError Expected property name or '}' in JSON at
           position 1" with the City never binding its port.
TRIGGER    honestly bounded: the module writes through temp+rename, so the routine torn write is NOT the expected
           cause. An external edit, a disk fault, a foreign tool, or a future format change is.
WHY BLOCKING (a) the workbook's own completion gate says the product in normal mode with no fault active must not be
           affected, and with a broken receipt the product does not run at all;
           (b) the same programme already settled this pattern twice: the experiment registry reports `broken` files
           and keeps serving, and the trace collector degrades to PARTIAL instead of failing. This new module is the
           only one in the family that turns a bad record into a dead City.
           (c) the failure is untyped, so a supervisor cannot even classify it.
```

### B2 — the same path leaves the opened store behind

When construction throws after `new Store(dir)` has opened `city.sqlite`, nothing closes it; the runtime directory stays
locked (observed as `EBUSY ... unlink city.sqlite` when the reviewer tried to clean up). B2 is a consequence of B1 and
disappears with the same repair, but it is recorded because a City that fails to start should not also leave a half-open
store for the next attempt.

### B3 — a shapeless receipt is adopted without identity instead of being reported

A file whose name matches `fault-<uuid>.json` but whose content has no `faultId` was inserted into the receipt map under
the key `undefined` and returned by the listing as an anonymous row, with no `broken` channel. Same class as B1 (a bad
record silently misrepresented) with a smaller blast radius.

### F1 — one of the four classes can never have a measured recovery

`recoveryTimeMs` is attributed only for the `heartbeat`, `claim` and `report` operations. `DUPLICATE_EVENT` has no
canonical operation to restore, so its recovery metric is structurally `NOT_MEASURED` forever. The record says so with a
reason instead of writing 0, which is honest, but the workbook's "quantify recovery" therefore holds for three classes
and not four. Recorded for the author (or REX-806) to decide whether a duplicate-observation recovery definition is
meaningful.

### F2 — registry vocabulary drift in the candidate record

`capability-registry/records/CAP-RESEARCH-FAULTS-001.yaml` uses values outside the vocabulary `CAPABILITY_INDEX.yaml`
defines (`implementation_status: CANDIDATE`, `backend_wiring_status: LOCALLY_VERIFIED`,
`user_reachability_status: WEB_VERIFIED_ANDROID_PENDING`, `intent_validation_status: PENDING_FORMAL_REVIEW`), and its
`api_or_actions` omits `GET /api/v0/research/faults/:id`, which exists. Everything else in the record — paths, symbols,
nesting, exposure class, evidence refs — reconciled correctly against the running code.

### F3 — class naming

`PROVIDER_UNAVAILABLE` is implemented at the node's execution-CLAIM seam, not against an external provider API. The UI
copy says so plainly, so nothing is hidden, but the class name describes a broader fault than the one injected.

### Instrument defect found in this review's own work

The first version of P7 created the fault through a gateway and then called `close()`, which correctly stops live faults
as `PROCESS_CLOSE`; the probe then expected `PROCESS_RESTART` and failed. The product was right and the probe was wrong.
Corrected by writing the crashed-process receipt directly. Recorded so the reviewer's error rate is visible too
(evidence protocol §4).

## 5. Reviewer-proposed repair (a proposal, not an accepted head)

The repair is deliberately minimal — the reader's guard, nothing else:

```text
CHANGE  services/dev-gateway/research/faults.mjs — construction now validates each receipt file by name and shape,
        collects anything it cannot use into a `broken` list (UNREADABLE_RECEIPT / RECEIPT_SHAPE_MISMATCH /
        RECEIPT_REWRITE_FAILED), and never throws. `list()` publishes `broken`, exactly as the experiment registry does.
BRANCH  review/REX-804-mech-review @ 737c3e1602b87b18395c69757127a3b500fc54e4
        V0.2 checks 37399882138 COMPLETED SUCCESS (reviewer probes + the repair together, 18/18 locally)
GUARDS  P8 and P9 are the regression guards; the author's own 10 focused tests still pass unmodified alongside them
NOT DONE  the reviewer did NOT change the fault semantics, the routes, the UI, or any other file.
```

### 5A. Adoptable minimal repair on the AUTHOR's own line

So that the repair does not have to be extracted from a reviewer branch, the same change is also published on a branch
whose parent IS the author's reviewed head, containing the repair and only its two regression guards:

```text
BRANCH   repair/REX-804-mech-minimal @ 19a420c6725532eabb9bf4cb0b06add180f6ce4e
PARENT   f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5   (the reviewed head - a fast-forward for the author's branch)
CHANGE   1 file: services/dev-gateway/research/faults.mjs (the reader guard)
        1 file added: tests/rex804-receipt-guard.test.mjs (the two probes named above)
CI       V0.2 checks 37402198156 COMPLETED SUCCESS on 19a420c6725532eabb9bf4cb0b06add180f6ce4e
LOCAL    11/11 in one run (2 guards + the author's 8 unit probes + the author's 1 gateway probe)
STATUS   PROPOSED, NOT ACCEPTED. Adopting it is the author's act (or the owner's ruling); the reviewer's verdict stays
         NOT PASSED on f76ccf53 until a repaired head is re-reviewed, and no terminal marker is released by this branch.
```


## 6. Verdict

**NOT PASSED on f76ccf53c4e2fecc32ce0ed8a8bb07daaa6935d5** because finding B1 is a blocking defect against the
workbook's own completion gate. The terminal marker `FAULT_INJECTION_RECOVERY_ACCEPTED` is **not released**, and
`review_complete` remains false. Re-verification requires a repaired head — the author's own repair or adoption of the
review branch above — with exact-head CI green, after which the reviewer's probes must be re-run on that head and the
verdict re-issued.

## 7. Measurement honesty notes

```text
The reviewed head's CI was green and independently re-read (section 1). The REVIEW BRANCH's own CI is now terminal
SUCCESS: V0.2 checks run 37399882138 COMPLETED SUCCESS on 737c3e1602b87b18395c69757127a3b500fc54e4 (the reviewer's
probes plus the minimum repair). An earlier commit of that branch (f7c10f2f0767198c0dcff00808b71150ea160c09) had a
queued run which was CANCELLED as superseded: the first commit of the branch was amended to restore the AUTHOR's
evidence screenshot, which running the author's web test had overwritten. That screenshot was restored rather than
re-attributed.
```



[完整中文阅读译本 / Chinese reading translation](./zh-CN/REVIEW_REPORT.md)
