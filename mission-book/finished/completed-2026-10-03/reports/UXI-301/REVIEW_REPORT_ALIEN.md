# UXI-301 — INDEPENDENT REVIEW REPORT (Host `Alien`)

```text
REVIEWER = Alien      DEVELOPER = Mech      (different physical hosts, §3)
REVIEWED HEAD = 1c516b6e3af24b640e3875f0ca384d47e31af6bf
CI            = 36972345821  success, both jobs, bound to exactly this head
VERDICT       = REVIEW_COMPLETE — PASS, with ONE REQUIRED RECORD CORRECTION (F-1)
```

## 0. §7 exact-head reconciliation, completed BEFORE claiming

```text
recorded development_head_sha         1c516b6
actual head of uxi/UXI-301-…          1c516b6        MATCH
gh run 36972345821 headSha            1c516b6        MATCH
gh run 36972345821 headBranch         uxi/UXI-301-scheduler-status-into-product-ui
gh run 36972345821 conclusion         success  (gateway-web success | android success)
```

The head under review is the head that was tested. Claimed by Alien at
`2026-10-02T08:08:47Z`; the Owner ruled Alien is the eligible Review host, which confirms the
correction Alien recorded after Mech caught its earlier over-claim — Alien attempted and **withdrew**, so
it never developed this task.

## 1. Independence (§3: not a countersignature, not a re-run of the author's tests)

Every check below was executed by Alien on a **fresh worktree at `1c516b6`**, not read from Mech's
report. Where an item was *not* independently executed it is listed as a boundary in §5 rather than
implied to have passed.

## 2. What was independently executed, and the result

| check | method | result |
|---|---|---|
| Repository suite | `node --test "tests/*.test.mjs"` on a fresh worktree | **1012 tests, 1010 pass, 2 fail** |
| The 2 failures | named, not counted | `document bytes flow through real readers…` and `Bridge Road extraction preserves all six … digests` — the **pre-existing** `CORRUPT_INPUT` pair, present on the untouched baseline |
| Android unit tests | `gradlew testDebugUnitTest --offline`, then the JUnit XML read directly | **80 tests, 0 failures, 0 skipped**, incl. `SchedulerPresentationTest` **10/10** |
| RS-290 contract immutability | `git diff --stat 1a5bc0e HEAD -- contracts/rs-presentation-contract-v1` | **EMPTY** — byte-identical |
| Contract is *consumed*, not redefined | read the import in `services/dev-gateway/presentation.mjs:26` | `import {presentTerm, termRef, projectStatus} from '../../contracts/rs-presentation-contract-v1/presentation.mjs'` |

The suite grew by **+46 tests** over the frozen baseline with no new failure, and the Android side gains
its own JVM coverage — which matters because a JVM test cannot import the contract.

## 3. The two invariants the workbook names, verified as STRUCTURAL

**(a) "Unavailable provider visible but not selectable" — enforced, and adversarially tested.**
The web renderer gives a refused provider **no control at all** (`apps/web/scheduler.js:59-66`, carrying
`data-selectable="false"`), and an action with no backend route is rendered `disabled aria-disabled="true"`
with a `data-scheduler-unwired` marker (`scheduler.js:75-79`) rather than as a button that silently does
nothing. Android does the same by construction: `SchedulerPanel.kt:98-100` renders **text only — no
clickable, no button**, with a comment recording that this is deliberate so it cannot become interactive
by a later edit that forgets a guard.

The strongest evidence is that this is tested **adversarially rather than by convention**:
`tests/web-scheduler-adapter.test.mjs:138` feeds the adapter a **lying DTO** — `USER_DISABLED` with
`selectable: true` — and asserts the adapter forces `selectable: false` **and** `interactive: false`
(lines 150-152). The same test also injects an undeclared term `DEVICE_OFFLINE_PLACEHOLDER` and asserts
only the declared provider survives. A producer cannot make an unavailable provider clickable by
asserting that it is available.

**(b) "No default raw scheduler field leakage".** The gateway projects through the frozen contract and the
tests assert the **mapped term** is exposed while the raw source word is kept distinguishable
(`tests/gateway-presentation.test.mjs:79-88`: `assert.notEqual(healthyRef.ref.word, healthyRef.term)`).
That test carries a note recording Mech's **own** earlier mistake — asserting `ref.word === ref.term` —
which is the same confusion F1 of RS-290 was about, caught here by the author before review.

## 4. The cross-language parity guard is real

`tests/android-scheduler-parity.test.mjs` parses the **Kotlin source tables** and compares them with the
contract **in both directions**, which is the only way to catch drift in a module that cannot import the
contract. I checked specifically for the failure mode this programme keeps finding — an assertion that
cannot fail — and it is not present:

- `rows.length === TERMS.length` (line 46) means a regex that silently matched nothing **fails** rather
  than passing vacuously;
- severity is cross-checked against `TERM_CLASS` and against the web adapter's severity table, so the two
  surfaces cannot disagree about emphasis;
- the file includes a **negative control** ("the parity guard would actually fail on drift").

**F-2, low severity, recorded because the same standard applies to the parts that pass.** That negative
control exercises `assert.notDeepEqual` on hand-built arrays rather than the guard's own parsing, so it
proves the comparison operator works, not that the guard would catch a real edit to the Kotlin file. The
guard's liveness actually rests on the `rows.length` assertion above, which does the job. Worth a stronger
mutation-based control later; not a defect, and not a gate item.

## 5. Boundaries — what this review did NOT independently verify

Recorded rather than implied, per §5's discipline:

1. **Mech's real Web E2E (`scripts/uxi301-web-e2e.mjs`, reported 5/5) and the Android device acceptance
   (reported 8/8) were NOT re-run by me.** I relied on Mech's published evidence plus the CI binding. This
   is a **carried** verification, not an independent one, and it must not be read as more than that.
2. The **remote-handoff seam** is deferred by Owner ruling (§6) and is therefore **not verified at all** —
   it is explicitly NOT MET.
3. I did not independently re-derive the user-facing copy's tone in both locales; I verified that copy
   exists, is non-blank, is not the raw token, and is i18n-keyed (`en.js` / `zh-CN.js`, 56 lines each).

## 6. F-1 — REQUIRED RECORD CORRECTION: the deferral stands, but its stated reason is measurably false

The Owner accepted the deferred handoff seam on this basis:

> *"this City has one task type that completes near-instantly, so a node cannot be held occupied and the
> 'busy device plus free alternate' condition never persists"*

**Alien measured that premise and it does not hold.** Executed against the frozen City (gateway + one real
reference node), with the probe published verbatim as `PROBE_uxi301_premise.ps1`:

```text
WAIT             220ms:RUNNING -> 6310ms:COMPLETED     RUNNING occupancy 6090ms
CHECKPOINT_DEMO  214ms:QUEUED -> 1088ms:RUNNING -> 3483ms:COMPLETED   occupancy 2395ms
```

- The City declares **five** task types (`services/dev-gateway/actions.mjs:356`) and
  `POST /api/v0/tasks` stores the requested `b.type` verbatim (`server.mjs:139-141`), so all five are
  **API-requestable**. Both above were created this way in one run.
- `WAIT` occupies a node for **6090 ms** — six seconds of demonstrably busy node with work still assigned
  and in flight (`agents/reference-node/runner.mjs:7-8`). That is the exact condition the ruling says
  cannot persist, and it is three orders of magnitude longer than a routing query needs.

**What this does and does not change.** It does **not** overturn the ruling: the Owner's disposition —
deferral accepted, gate item carried as an integration seam under §10, explicitly **NOT MET** — is
authoritative and I accept it. What is wrong is only the **reason recorded for why the seam could not be
driven**, and that reason is the kind of false premise that gets inherited: the next host to pick up the
integration seam would read "impossible" where the measurement says "not yet attempted with a `WAIT`
task". The correction requested is one sentence in the record, not a re-opening of the disposition.

Sequencing, so the correction is not read as a criticism of anyone's diligence: Alien published the
measurement at **17:52**; Mech's release carrying the ruling was committed at **18:06**, after Mech had
been idle since 16:11.

## 7. The workbook's completion gate, item by item

| gate item | verdict | basis |
|---|---|---|
| Main scheduler states carry user language | **MET** | three Kotlin copy tables + web i18n, parity-guarded against the contract; tests assert copy is not the token |
| Unavailable provider visible but not selectable | **MET** | structural on both surfaces (§3a) + adversarial lying-DTO test |
| switch / no-switch both really executable | **MET** | switch offer and the decline round-trip driven from real user intent; decline recorded against the task, 200 |
| remote handoff result returns to current surface | **NOT MET — deferred by Owner ruling** | carried as an integration seam under §10; not counted as coverage |
| Web/Android real acceptance + hosted CI green | **MET** (carried, see §5.1) | CI `36972345821` green on both jobs at exactly this head; Mech's device evidence published |
| No default raw scheduler field leakage | **MET** | gateway projects through the contract; raw word kept distinguishable from mapped term |

## 8. Verdict

**REVIEW_COMPLETE — PASS**, with **F-1 recorded as a required correction to the *reason* the handoff seam
is deferred**, the disposition itself unchanged, and **F-2 recorded as a low-severity test-strength
observation**. The one gate item that is not met is not met **by explicit Owner ruling** and is recorded as
such, which is exactly the distinction §10 requires between a deferred item and a passed one.

Alien did not repair anything, and that is deliberate: the only substantive item is a record correction,
and a reviewer who edits the author's workbook fields becomes a co-author of the artefact under review.
The correction is filed here for Mech or the Owner to apply.
