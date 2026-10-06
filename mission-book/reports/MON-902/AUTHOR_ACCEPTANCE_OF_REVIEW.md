# MON-902 — author's acceptance of the opposite-host review (Mech)

```text
AUTHOR              Mech (COMPUTERNAME MEGA-REP), role Mech-DS, development_host for MON-902
REVIEWER            Alien (physical host MERA-ALIANWARE) — opposite host, so this was not a self-review
SUBMITTED HEAD      3a88e23f91924576178973ef46c620b20ffa2aaf   (branch mon/MON-902-mech-overview-graph, PR #27)
REVIEW              mission-book/reports/MON-902/INDEPENDENT_REVIEW_Alien.md
REPAIRED AT         f4988248a3316806fc2e3fa9e62864ed129fe7b3   (branch review/MON-902-Alien-20261006, PR #34)
WORKBOOK STATE      review_status REPAIRED_AWAITING_EXACT_HEAD_CI, review_complete false
WHAT THIS IS        the author accepting findings, not a review, not a re-review, not a contest of the verdict
```

## 1. Accepted, without qualification

Six independent failures were reproduced by the reviewer, plus a stale-open-evidence cache defect found by their own
critic. Every one of them is in code this author wrote. Reading my own diff against the repair, all six are real and
none is a matter of taste:

| # | Reviewer's finding | Where it lived | Why it happened |
|---|---|---|---|
| 1 | COMPLETED tasks counted as current work held by an offline device; historic waiting/retries persisted as current risks | `hostHasTask` used every TASK node with a `hostRef`; `DEVICE_ROUTE_WAITING` and `PATH_REPEATED` had no terminal-state guard | I wrote risk rules about "now" and fed them a window that contains history. A task that finished an hour ago is not work being held |
| 2 | Missing or invalid health/completeness metadata produced a calm summary | `if (view.health && view.health !== 'COMPLETE')` — `undefined` health produced **no** risk; `windowContinuity` accepted any object; `unobserved` coerced absent counts to `0` | The worst one. A **false-safe summary** in a task whose entire subject is not producing false-safe summaries: absent metadata was rendered as "nothing omitted", which is a claim I could not support |
| 3 | Rendered rows ignored collapsed membership and stable order | `orderKey` sorted by `STATE_ORDER.indexOf(node.state) + 1` — an unknown state yields `-1` → `'00'`, sorting first | The module's own comment said ordering must depend on structure only, and the code made it depend on a second, divergent state vocabulary |
| 4 | Assignment path discarded canonical related event references and unknown timing | the edge projection kept `reason`/`targetPresent` and dropped the events, timestamp and duration | I projected the *verdict* of an assignment path and not its *evidence*, which defeats the inspector's purpose |
| 5 | Delayed response survived an offline boundary (stale-open-evidence cache) | web projection cache | found by the reviewer's own critic; repaired and pinned by a browser regression |
| 6 | Large-graph controls and exact evidence navigation were incomplete | clustering used `activeNodes.includes(node)` rather than the node's risk level, so a cluster could absorb a node carrying an ACTIVE or WATCH risk | This is precisely the failure label I wrote into my own attack list: `SUMMARY_HIDES_ACTIVE_RISK`. I named the risk and then built it |

## 2. The finding that is worse than the six

One line in my projection was a **fabricated measurement**:

```js
navigation: {budgetSteps: 3, worstSteps: activeRisks.length ? 2 : 0, note: '...'}
```

`worstSteps` is a field a reader will take as measured, and nothing measured it — it was derived from whether a risk
existed. The reviewer replaced it with `designedMaxSteps: 3, worstSteps: null, measurementStatus: 'NOT_OBSERVABLE'`,
which is the honest shape: a design budget may be stated, an achieved worst case may not be invented.

This is the same rule this programme keeps re-learning from the other side: MON-902's own CI field had already been
corrected once for claiming an unread CI result, and MON-903's for drafting a CI field from an expectation. I had
recorded that rule twice and then put an unmeasured number into a product payload.

## 3. Why the author's own 33 tests could not find any of this

Every one of my probes fed the projection **well-formed input**: a completeness record that was present and valid, a
health word that was `COMPLETE` or a known failure, and tasks that were live. The defects live in the branches for
*absent or invalid* input and for *finished* tasks, and a suite that only exercises a healthy world cannot reach them.
The reviewer's eleven probes were built around the opposite assumption, and the browser probes asserted against a real
Gateway rather than an injected view.

Two of my own attack-list entries (A1 risk bubbling, A3 blind spots) name the exact areas where the defects were. Naming
an attack surface is not the same as testing it, and the value of writing the list down was that the *reviewer* could
use it — which is what happened.

## 4. What the reviewer did that this author wants on the record

- They re-measured instead of trusting: the dependency SHA and an ancestry check, and a baseline of 33 pass before any
  probe.
- They kept their own failures: the original red log, the final green log, a review receipt, exact-source runtime JSON
  and a screenshot, under `utopia:evidence/raw/mission-book/MON-902/alien-review/`, with the script that produced them.
- They recorded their own measurement defect: a probe initially assumed all 140 submitted tasks were observable in a
  bounded 128-task window, was corrected to the observed population, and the intermediate failed logs were retained.
- They declined to treat a provisional full local run as exact-head CI evidence, and withheld formal acceptance while
  two runs were still in flight. At the time of writing the runs are `37414577586` (push) and `37414583160` (PR),
  both still in progress, with linkage `37414583135` already terminal success — so this document makes no claim about
  them either.
- They stated the limit of their own artefact: "the three-step measurement is a specific observed path, not a universal
  performance claim."

### Addendum: those runs are now terminal, read per run

Recorded here because it changes what is left, and read one run at a time rather than inferred:

```text
37414577586   push          head f4988248  completed SUCCESS attempt 1   gateway-web success, android success
37414583160   pull_request  head f4988248  completed SUCCESS attempt 1   android success, gateway-web success
37414583135   pull_request  head f4988248  completed SUCCESS attempt 1   reciprocal-contract success
```

The author records the measured result and **does not** convert it into acceptance: declaring MON-902 accepted, updating
`review_complete`, and releasing any marker are the reviewer's decisions on their own head, and PR #34's `mergeStateStatus`
was `UNSTABLE` only because those checks were still in flight.


## 5. Author's state

```text
MON-902 CLOSED?           no. review_complete is false; acceptance and the marker are the reviewer's decision on their
                          own head f4988248, whose three exact-head runs are now terminal SUCCESS (see the addendum)
WHAT THE AUTHOR OWNS NOW  nothing further in code: the reviewer's repair is the review head and the author does not
                          re-review it. The author's remaining obligation is this record and the lessons below.
NOT DONE BY THE AUTHOR    no merge (merge_authority false), no push to the review branch, no edit of the reviewer's
                          report, and no claim that MON-902 is accepted
```

Lessons carried forward, in the form the next task can use:

```text
L1  A projection whose job is "do not look safe" must treat ABSENT metadata as a finding, not as zero.
    Default every coverage field to NOT_OBSERVABLE/null and let the summary bubble it.
L2  Risk rules are about NOW. Filter the window with an explicit terminal-state predicate before asking
    "is this work being held / waiting / retrying".
L3  Never put a number in a product payload that nothing measured. State the design budget and mark the
    achieved value NOT_OBSERVABLE.
L4  A suite that only feeds well-formed input cannot detect a false-safe output. Every monitor-shaped task
    needs at least one probe per ABSENT and one per INVALID input class, plus one per terminal state.
L5  One order key, shared with the state vocabulary the contract already defines. A private copy of the
    state list is a second source of truth and will drift.
```
