# RS-290 — REPAIR OF MECH'S F1, F2 AND F3 (Alien, development host)

```text
DEVELOPER      = Alien     REVIEWER = Mech     (different physical hosts, §3)
REVIEWED HEAD  = 2a3ae30a6dc8d76ff5b1d18a30e86e8c29dc1529   (returned for repair)
REPAIRED HEAD  = 5cc081b   EVIDENCE HEAD = 2f81296
DISPOSITION    = all three findings repaired by the development host; released back for re-review
```

Mech's review (`REVIEW_FINDINGS_MECH.md`, `REVIEW_ADDENDUM_MECH.md`) concluded **DEFECTS FOUND — NOT
REVIEW_COMPLETE** and put the choice of repairer to the Owner, recommending that **Alien repairs**. Alien
was available and acting, so the recommended option applies and no Owner ruling was needed. Mech's
reasoning for declining to self-repair is adopted as correct and is not revisited here: a reviewer who
authors the fix becomes a co-author of the artefact under review, and §3's independence requirement is
the single concern this programme repeats most.

Every repair below states the defect, the choice made, the alternative rejected, and why. The workbook
requires that judgement logic be recorded rather than the outcome alone.

## F1 — the anti-leak guard was a name check; it is now a provenance check

**The defect, as Mech reproduced it.** `projectStatus` accepted bare strings and tested
`TERMS.includes(term)`. `RS-202.REACHABLE_STATES.DEGRADED` is a raw word whose *prescribed* mapping is
`PRESSURE_PAUSED` (class `RESOURCE`), but `DEGRADED` is also a declared term name, so the guard accepted
the raw word unchanged. The wrong path reported state `DEGRADED` with actions `[CANCEL, CHOOSE_PROVIDER]`
instead of `QUEUED` with `[CANCEL, KEEP_WAITING]` — it demanded a provider decision from the user for a
pool that only needed to wait, which is precisely the mistake `provider_choice_required` was reasoned
about to avoid.

**The choice.** Provenance, because the ambiguity *is* the name and no amount of checking the name can
resolve it. `projectStatus` now takes `{ source, word }` references (`termRef(source, word)`) and maps
them itself, so a word means whatever its declared vocabulary says it means. Three consequences, all
deliberate:

- a **bare string is refused**, whether or not it is spelled like a term — the caller must say where the
  word came from, so "forgot to map it" is no longer expressible;
- an unknown vocabulary or an unmapped word **throws**;
- the **removed parameter names** (`providerTerms`, `terms`, `routeStage`) are refused rather than
  ignored. This is a decision worth recording: renaming a parameter that is then silently dropped would
  reproduce F1's failure mode in a new form — a plausible DTO computed from nothing — and a loud failure
  is strictly better than a quiet wrong answer.

Alternatives Mech offered and why they were not taken: *accept only values drawn from
`Object.values(TERM_OF)`* does not work, because the colliding word `DEGRADED` **is** in that image, so the
check would still pass it — I verified this rather than assuming it; *rename the colliding term* removes
one collision but leaves the guard name-based and re-arms on the next vocabulary change.

**Quantified rather than fixed once.** The test enumerates every source word that *is* a declared term
while meaning something else, and asserts the set is exactly
`[['RS-202.REACHABLE_STATES','DEGRADED','PRESSURE_PAUSED']]`. If a future vocabulary change puts another
word in that position, the suite fails and says to re-audit the guard.

**Also fixed, found while repairing this.** `presentTerm` used a bare `table[word]` lookup, which reaches
`Object.prototype`: `presentTerm('RS-201.ENABLEMENT','constructor')` returned a **function** as if it were
a term. No vocabulary contains such a word today, which is exactly why it would have gone unnoticed until
one did. It is now an own-property check. Same class of hole as F1 — a lookup keyed on a name that a name
can fool — so it is recorded here rather than folded silently into the diff.

## F2 — a terminal outcome now outranks `waitingUser`

**The defect.** `finalState = waitingUser ? 'WAITING_USER' : presentState(...)` gave `waitingUser`
unconditional precedence, so `{terminal:true, failed:true, waitingUser:true}` reported `WAITING_USER` with
`[CANCEL, CONFIRM]`. A finished, failed run was rendered as something awaiting the user, and `RETRY` was
withheld because it is gated on `finalState === 'FAILED'` — so the recovered-from state and the recovery
action were both denied to the only user who needs them.

**The choice: precedence, not an exception.** `waitingUser` is now folded in as a `WAITING_USER` term and
`presentState` alone decides, which it already did correctly (terminal before terms, `cancelled` before
`failed`). So the fix is the *removal* of a second precedence rule rather than the addition of one, and
the ordering stays in the single place it is documented.

Mech offered *throw on the combination* and it is defensible, so the rejection is recorded: "a
confirmation was pending when the task failed" is a real sequence — RS-203's return bridge has explicit
`requestConfirmation` / `respond` / `expire` steps — so a projection that threw on it would fail on live
input. Reporting the true outcome is also the better user outcome of the two, which is the same test F1 is
judged by. Verified: `{terminal:true, failed:true, waitingUser:true}` → `FAILED` with `RETRY`;
`{terminal:true, waitingUser:true}` → `COMPLETED` with no actions; non-terminal `waitingUser` still →
`WAITING_USER` with `[CANCEL, CONFIRM]`.

## F3 — `FRESHNESS.STALE` is its own term, and the header's property is now asserted

**The defect, two parts.** (a) `RS-201.FRESHNESS.STALE` (measured, and out of date) and `.UNKNOWN` (never
measured) both mapped to `FRESHNESS_UNKNOWN`, so a UI could not distinguish them — the very ambiguity the
module's four-`UNKNOWN` rule exists to remove — and the term's own name asserted something false about
`STALE`. (b) The module header claimed *"NO TWO DISTINCT MEANINGS MAY SHARE A PRESENTATION TERM"* and no
test asserted it generally; the two that looked like they did were spot checks, so a collapse anywhere
else passed 21/21.

**The choice for (a):** split it. `STALE` → `FRESHNESS_STALE`, class `KNOWLEDGE`. The alternative Mech
offered — document the collapse and record why — was rejected because the module's own stated rule is that
these two must stay distinguishable, so documenting the exception would leave the header and the table
contradicting each other.

**The choice for (b): declare the collapses.** The property as written is not literally true of the
table, and pretending otherwise is what let the defect hide: five `ABSENCE_CODES` deliberately collapse to
`ABSENT`, which **preserves** the `ABSENT`-vs-`REMOVED` distinction RS-201's tombstone design requires.
So the honest property is *no collapse goes undeclared*, and `INTENDED_COLLAPSES` now records every real
collapse **with its reason**, exactly as the module already documents `LOAD_UNMEASURED`'s class. The suite
quantifies over the entire table in **both** directions: an undeclared collapse fails, and a declaration
with no collapse behind it fails too, so the table cannot rot into a list of things that used to be true.
The four declared collapses are `PROBE_OUTCOMES.SELECTABLE` and `ABSENCE_CODES.{ABSENT,REMOVED,
POLICY_EXCLUDED}`; `POLICY_EXCLUDED` is flagged in the table as the coarsest judgement and the first to
revisit if a UI ever needs to explain *why*.

**Mech's low-severity observation, adopted.** In test 5 the assertion
`entry.class === 'PERMITTED' || …` and `typeof entry.resolves_by_waiting === 'boolean'` cannot fail: the
first is true by construction of `TERM_CLASS`, and the second is assigned from that same table. Mech's
standard — *"a test that cannot fail is not evidence"* — is correct and applies to the parts that pass, so
they were replaced with a cross-check against the mapping computed independently in the test (a projection
that dropped, reordered or mismapped a provider now fails), plus the decision the classes exist to drive.

## Verification — the repairs are load-bearing, not decorative

**Negative control, because a test that passes against both the fixed and the broken code proves
nothing.** Mech's three defects were reintroduced into a throwaway copy of the contract and the suite was
run against it: **5 tests fail**, covering each finding — `F1: …mapped by its VOCABULARY`,
`F2: a terminal outcome OUTRANKS waitingUser`, `F3: …stay DISTINCT terms`,
`F3: NO collapse … goes UNDECLARED`, and the pre-existing `vocabulary is CLOSED` test, which independently
catches the `STALE` collapse. The control script is `PROBE_negative_control.mjs` in this directory.

**Suites.** Contract suite 25/25. Root suite **966 / 964 / 2**, where the 2 are the pre-existing
document-reader `CORRUPT_INPUT` failures present on the untouched baseline — reproduced by name, not
assumed from a count. City suite **1984 / 1977 / 0 fail / 7 skipped**. (The city suite initially failed with
`Cannot find package 'yaml'`; that is the fresh-worktree dependency gap, and
`pnpm --dir city install --frozen-lockfile` resolved it. It is recorded because a missing dependency and a
broken test look identical in a summary line, and only the message distinguishes them.)

**Both E2E gate paths re-run on the repaired head**, because the repair changed product code and the
earlier evidence heads therefore no longer bound to it. Success path: `COMPLETED`, `success true`, the full
7-event lifecycle, android/web result matches on `artifactSha256 540cd0a1`, and the new observation
sequence `RUNNING/RUNNING/COMPLETED` with `terminalObservedAt 04:02:12.824Z`. Recovery path: **3/3 PASS**,
offline/restore/online ordering intact, `stoppedPidAlive` false on every offline observation. All published
inspectably under `evidence/raw/mission-book/RS-290/`.

**APK provenance, verified twice rather than asserted.** `gradlew assembleDebug` from `apps/android`
reports `UP-TO-DATE` (an input-hash check) and `git diff de91f5e..HEAD -- apps/android` is **EMPTY**, so
the installed `7c42f423…` APK is the build of this head. Android code is untouched by the entire task.

**Mech's suggestion on evidence strength, adopted.** The success path was summary-only, so its booleans
could not be checked against raw data the way the recovery rows could. The pilot now records every poll and
the two surface readings, and computes `success`, `terminalObservedAt` and the surface booleans **from that
record**, so a summary contradicting its own observations is no longer expressible. A reader has already
recomputed `observedStates` and `success` from the published JSON.

## Defect found in the harness while re-running the E2E — and the diagnosis that cost the time

The recovery path failed on the repaired head with `success=false`, `offlineObservedAt` null and every
observation reading `ONLINE` on both surfaces, having passed 3/3 at `6514733`.

**Root cause, measured: the harness leaked detached agent processes.** `restart()` spawned
`agents/reference-node/main.mjs` with `detached:true` and `child.unref()`, and nothing ever killed it, so
each recovery run leaked one. **Five leaked agents were alive at once**, and because a leaked agent stays
connected to the gateway, the node reads `ONLINE` forever and the offline condition can *never* be met. The
failure had nothing to do with the product. Fixed at the root: strays are swept before measuring, every
spawned child is killed in the `finally`, children are no longer detached, and `sweptStrayAgents` is
recorded **in the evidence**. The confirming run swept exactly `[62568,20028,34916,70536]` and passed 3/3.

**The instrumentation stays, because the ambiguity is what cost the time.** Each offline observation now
records `stoppedPidAlive`. It proved the kill itself was correct (`false` on every observation) and pointed
at the environment instead of at the product. Without it the record was equally consistent with "the kill
failed" and "something else is serving the node".

## My own errors, recorded rather than smoothed over

1. **I asserted a collision count of 9 without measuring it, and the suite refused it: the measured answer
   is 1.** The set is exactly `DEGRADED`. Near-collisions such as `ONLINE`, `UNKNOWN` and `DISABLED` are
   *not* in it, because their terms are spelled `DEVICE_ONLINE`, `AVAILABILITY_UNKNOWN` and
   `USER_DISABLED` — a name check cannot confuse a word with a term spelled differently. Mech's operative
   claim ("for one of them the collision changes the answer") is exactly what the executable measurement
   confirms. This is the same failure the programme has now catalogued six times, and this instance is
   mine: asserting a number from the shape of a discussion rather than from a measurement.
2. **A scripted status read `build_exit=0` while the build had failed.** My first E2E command chained
   `.\gradlew.bat` at the worktree root, where it does not exist (`apps/android` is where it lives);
   PowerShell raised `CommandNotFoundException` and `$LASTEXITCODE` stayed 0, because a cmdlet failure is
   not a native exit code. The run then used the pre-existing APK. Nothing was wrong with the artefact —
   the hash matches both the `c97c821` build and the current build — but the *claim* would have been false,
   so the build was verified separately afterwards. Same shape as the `$m -eq` array misreadings earlier in
   this task: a status variable that reports success while the mechanism failed.
3. **The recovery failure was nearly another instance of the same thing.** My first instinct was that the
   kill had not taken effect, which the `stoppedPidAlive` probe then refuted. Measuring the mechanism
   first — the remedy this programme has already written down five times — is what produced the real cause
   in one further run instead of a speculative patch.

## Head binding after the repair

`2a3ae30` (reviewed) → `bbccc71` (F1/F2/F3) → `0256fce` (success-path observations) → `5cc081b` (agent-leak
fix) → `2f81296` (evidence). The evidence heads are `0256fce` (success) and `5cc081b` (success and
recovery); the final published pair is both paths at `5cc081b`, so the product under test is identical
across both halves. The delta from `5cc081b` to `2f81296` is `evidence/` only. Between `2a3ae30` and
`5cc081b` the product changes are confined to `contracts/rs-presentation-contract-v1/` and
`scripts/device-*-pilot.mjs`; `apps/android` is untouched, which the identical APK hash corroborates.
```
REVIEWED 2a3ae30 -> REPAIRED 5cc081b   product changed, so the earlier E2E carries do NOT apply
                                       and both paths were re-run rather than carried
```

## Route 2 was taken, and Mech's gate was run before pushing

Mech's repair request offered two routes for F1 and pre-committed to the consequence of the second:

> "**Take `(source, word)` pairs and map internally**, so provenance is explicit and name collisions
> cannot arise at all. Sound, but it changes the call signature, so the gate's F1 check … would need
> updating alongside it. **Tell me if you take this route and I will extend the gate rather than have it
> fail you for a sound API change.**"

**Alien took route 2**, and this section is the notification Mech asked for. Route 1 (rename the term
`DEGRADED` → `DEGRADED_STATE`) is smaller and would have satisfied the gate as written, but it fixes one
instance and leaves the guard name-based, so the next vocabulary change that puts a word where a term name
already is re-arms the same defect. Route 2 removes the class. The cost is low because the DTO is new in
this very task and unmerged, so no external caller exists to break.

**Mech's gate was run before pushing, as instructed.** `PROBE_repair_verification.mjs` against the repaired
head reports **F1 PASS, F2 PASS, F3 PASS** — and then the REGRESSION section cannot run, because it calls
`projectStatus({providerTerms: [t], terms: [t]})` and route 2 refuses those parameter names by design. That
is exactly the failure Mech anticipated, so it is reported rather than worked around by editing the
reviewer's instrument: **Alien has not touched `PROBE_repair_verification.mjs`.**

**What was published instead:** `PROBE_repair_verification_ALIEN_ROUTE2.mjs`, Mech's gate with **call-site
adaptations only**, so the regression evidence exists rather than being asserted. Mech should diff it
against its own file to confirm nothing else moved:

```text
                                   unrepaired 2a3ae30     repaired 5cc081b
Mech's gate (unmodified)           6/9, F1/F2/F3 FAIL    F1/F2/F3 PASS, then REGRESSION throws
Alien's adapted gate               6/11, exit 1          11/11, exit 0
```

The six regression checks pass in **both** trees, which is the property Mech's own self-test identifies as
what makes the gate useful, and it holds here too.

Three adaptations, each marked in the file:

1. **F1 called a bare word**, which route 2 refuses — so Mech's F1 would have passed **vacuously** on the
   adapted call, never exercising the mapping. That is the very "assertion that cannot fail" defect this
   review found in the author's suite, so it is not introduced here: the adaptation passes the provenance
   reference, so all **11 (source, word) pairs covering Mech's 10 distinct colliding words** are actually
   mapped and asserted to land on their prescribed term. The adapted F1 is therefore **stronger** than the
   original. It also asserts that an absent provider is itself a violation, because a projection that
   ignores `providerRefs` returns none — that branch is what makes the adapted check discriminate, and it
   is why the unrepaired tree fails F1 on 11 counts rather than passing it.
2. **The regression sweep injected every declared term directly**, which route 2 makes impossible by
   design. The adaptation inverts the mapping to build one reference per term and injects those.
3. **The no-fabrication inputs** had the same two bare-term entries, adapted identically.

**For Mech's extension, the exact surface:**

```text
projectStatus({ providerRefs, termRefs, routeStageRef, terminal, failed, cancelled, waitingUser })
  providerRefs / termRefs : arrays of {source, word}   routeStageRef : one {source, word} or null
termRef(source, word)     : builds one, validating both halves
removed names             : providerTerms, terms, routeStage  -> REFUSED, not ignored
declaration table         : INTENDED_COLLAPSES
F3 note                   : Mech's gate probes INTRA_VOCABULARY_COLLAPSES ?? DECLARED_COLLAPSES, so its
                            `declared` branch reads false against this repair; the name is
                            INTENDED_COLLAPSES. F3 passes on the `split` branch either way, and the
                            adapted gate adds the reverse check (a declaration with no collapse behind it
                            is a failure) so the table cannot rot.
```

Two further checks were added on the Alien side, and both are Mech's own standard applied to the new
material: the undeclared-collapse quantifier over the whole table, and the reverse check that a declaration
must correspond to a real collapse.

## A control-plane integrity defect found by widening the duplicate-key gate, and REPORTED rather than fixed

The duplicate-frontmatter-key check that this programme has had to run four times before was, until now,
applied to **the file being edited**. Running it across **all** of `mission-book/` found two committed
files carrying duplicate keys. Both are pre-existing, unmodified and in the closed UI phase; neither is
mine. Each is quoted exactly because the point is that a YAML parser keeps only one value and drops the
other silently:

```text
UI-000-视觉方向候选与审美门禁.md
  review_covers_revision_head  line 24: false      <-- and
                               line 61: true       CONTRADICTION

UI-101-Web产品壳与信息架构.md
  review_delta_verified  line 20: "Mech re-verified the post-review delta (aafff56, CI 36872799004)…"
                         line 47: "The delta's own half is correct and verified in a real browser…"
  review_delta_required  line 21: "POST-REVIEW DELTA, not covered by the completed Review…"   (string)
                         line 41: true                                                        (boolean)
  review_not_verified    line 40: "…(a) Keyboard focus order… (b) iframe embed… (c) Contrast…"
                         line 49: same opening, different (b): "…needs UI-190 to integrate UI-103's hub…"
```

**Why this is a defect and not bookkeeping.** A parser that keeps the last value reads UI-000 as
`review_covers_revision_head: true` while the earlier record says `false` — a review-gate flag silently
flipped, which is exactly the class of quiet wrongness this programme's reconciliation rules exist to
prevent. UI-101 is worse in kind: one key changes **type** between a long note and a boolean.

**Why I did not fix it, which is a decision rather than an omission.** Resolving it means deciding which
of two contradictory values is canonical for a task in a phase I did not work on. A wrong choice would
silently change a review gate, and the damage would be invisible in exactly the way the defect already is.
That choice belongs to the record's author or the Owner, so this is reported with line numbers and both
values intact. It is also deliberately **not** bundled into the RS-290 repair commits: RS-290 is a clean
deliverable on a branch Mech is reviewing, and mixing another phase's workbook surgery into it would make
the reviewed diff dishonest about its scope.

**What DID change as a result:** the gate's scope. Checking only the file being edited is why four
occurrences were caught and these two were not, so the check is now run across the whole tree before any
workbook commit, and this finding is what that widening produced.

## What is NOT claimed

`review_complete` remains **false** and `review_head_sha` remains Mech's `2a3ae30…`: moving it is the
reviewer's act, and the repaired head is released back to Mech for a fresh review. Alien has not reviewed
its own repair. The E2E was run on this host, which is the development host, and its independence rests on
the published raw evidence being checkable by Mech — as Mech demonstrated by decoding the recovery
observation sequence rather than trusting the summary booleans.

语言配对 / Language pair: [原文 / Source](./REPAIR_ALIEN_F1F2F3.md) · [译本 / Translation](./zh-CN/REPAIR_ALIEN_F1F2F3.md)
