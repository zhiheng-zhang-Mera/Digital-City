# RS-203 — STEP 1 seam audit

> Host `Mech` (Development). Branch `rs/RS-203-cross-device-return-recovery`, cut from the
> CLAIM_TIME_MAIN baseline `de91f5e` — the same freeze merge RS-201 and RS-202 were built on.
> Written before any implementation, because both preceding tasks in this phase found that the
> first useful act was establishing what already exists rather than building beside it.

## 1. Baseline is green, measured rather than assumed

Run on `de91f5e`, per suite, read from the runner's own totals:

```text
general-ai-remote-execution-v1/conformance.test.mjs    19 pass  0 fail
engineering-return-control-v1/conformance.test.mjs     23 pass  0 fail
remote-presence-reconnect-v1/conformance.test.mjs      25 pass  0 fail
task-lifecycle/tests/task-lifecycle.test.mjs           11 pass  0 fail
                                                       --
                                                       78 pass  0 fail
```

**CORRECTION (raised by the RS-203 Review host, and it was right).** This section originally
reported `task-lifecycle 25/25` and a four-suite floor of **92**. Both were wrong; the correct
figure is **11** and the floor is **78**. Two independent mistakes produced it, and the second is
the instructive one:

1. **A wrong path.** I ran `task-lifecycle/task-lifecycle.test.mjs`; the file is actually at
   `task-lifecycle/tests/task-lifecycle.test.mjs`. Node reported `Could not find`, which I did not
   read.
2. **A stale variable.** The loop that collected the four counts reused `$p` and `$f` across
   iterations, and I had already seen it emit `Cannot index into a null array` on a failed
   extraction — which is exactly what happened here. The `25` printed for task-lifecycle was the
   *previous* suite's value still sitting in the variable. **I noticed that error at the time and
   moved past it**, which is the real defect: an error I observed and explained away became a
   published baseline number.

A baseline figure is evidence, so the correction is recorded rather than silently swapped. The
suite is green and the section's conclusion — that RS-203 extends a working foundation rather than
repairing a broken one — is unaffected by the count.

So RS-203 extends a working foundation. It is not repairing a broken one, and a red suite later
would mean this task broke it.

## 2. What already exists and must be REUSED rather than rebuilt

The four seams this task is allowed to touch already carry most of the vocabulary RS-203 needs.
Inventing a parallel set would be the defect, not the work.

**`general-ai-remote-execution-v1/remote-execution.mjs`**

*   `EXECUTION_ROUTES = ['LOCAL_WEB', 'REMOTE_DEVICE']` — the current-device/executing-device split
    the task's first invariant depends on already exists as a typed route.
*   `ACTION_STATES = ['DISPATCHED', 'RUNNING', 'AWAITING_USER', 'CANCELLED', 'SUCCEEDED', 'FAILED']`
    with `TERMINAL_ACTION_STATES = ['CANCELLED', 'SUCCEEDED', 'FAILED']` — **`AWAITING_USER` is
    already present**, which is step 3's "waiting for the user" case and must not be re-minted.
*   `EVENT_KINDS = ['STATUS', 'PROGRESS', 'PARTIAL', 'ERROR', 'FINAL', 'CANCELLED']` — the return
    vocabulary for step 1.
*   `EXCLUSION_REASONS`, `STAGING_POLICIES`, `REMOTE_EXECUTION_PORT`, `createRemoteExecutionRouter`.

**`engineering-return-control-v1/return-control.mjs`**

*   `RETURN_CHANNELS = ['STATE', 'STAGE', 'PROGRESS', 'EVENT', 'LOG', 'ATTENTION', ...]`.
*   `CONTROL_COMMANDS = ['PAUSE', 'RESUME', 'CANCEL', 'RESPOND']` — `RESPOND` is the user
    confirmation path step 3 needs.
*   `resolveInteractionSurface({ ownerRef, devices })` — **already resolves the current authorized
    interaction surface**, which is invariant 2's second half.
*   `createRemoteSubworkerBridge`, `ENGINEERING_REMOTE_EXECUTION_PORT`.

**`remote-presence-reconnect-v1/presence.mjs`**

*   `PRESENCE_STATES` and `REACHABLE_STATES` for the disconnected case.
*   `PENDING_STATES` including `CONFIRMED_SUCCEEDED` / `CONFIRMED_FAILED` and `RECONCILE_OUTCOMES`
    — the truthful-unknown machinery invariant 5 requires already exists here.
*   `createPresenceTracker`, `findForbiddenAuditFields`.

**`city/00-foundation/01-city-core/task-lifecycle`**

*   `advanceLifecycle(current, event)` and `candidateIdFor(taskId, requirements)` — the canonical
    lifecycle, which is the "canonical/shared state" invariant 2 names. RS-203 must return results
    INTO this rather than standing up a second truth (which the workbook forbids outright).

## 3. The gap, established by MEASUREMENT and not by reading

Searched the four seam modules for the machinery step 1 needs:

```text
correlat                                   8 hits in the seams, 38 repo-wide   -> exists
out-of-order | sequence                    39 hits in the seams                -> exists
duplicate | dedup | idempot                49 hits in the seams                -> exists
action_id                                  62 hits in the seams                -> exists
handoff                                     0 hits in the seams                -> ABSENT
provenance                                  0 hits in the seams, 409 repo-wide   -> ABSENT here
```

Two findings, and the first needs stating precisely because a careless version of it would be
false:

**A. There is no cross-device EXECUTION handoff correlation in the seams this task may modify.**
`handoff` appears **zero** times across all four seam files. It is *not* absent from the repository —
`assistant-handoff-v1/handoff.mjs` alone contains 125 occurrences — but that is **assistant**
handoff, a different domain with different vocabulary and a different subject (assistant duty
transfer, not work moving between devices). So the honest statement is: correlation, ordering and
idempotency primitives all exist, but nothing in the seams represents "the device the user is
interacting with is not the device executing the work" as a first-class, correlatable fact. That is
precisely step 1's job, and it must be built by EXTENDING the existing route/state vocabulary rather
than by borrowing assistant-handoff's semantics.

**B. `provenance` has no home in these seams.** 409 occurrences repo-wide means it exists and must
be reused rather than reinvented, but **zero** in the four files means step 5's
provenance/evidence binding has nowhere to attach yet. Locating the existing provenance contract and
binding to it is a step-5 task, not a licence to mint a second one.

## 4. Seams fixed for the remaining steps

```text
remote-execution.mjs   extend the route/action-state vocabulary with the handoff correlation and
                       the return projection; reuse ACTION_STATES and EVENT_KINDS as-is
return-control.mjs     the return channel and resolveInteractionSurface are the projection target
                       for invariant 2; RESPOND is the step-3 confirmation path
presence.mjs           the disconnected/degraded source of truth for invariant 5; do not duplicate
                       its reconciliation vocabulary
task-lifecycle         the ONE canonical state results must return into; no second truth
ONE NEW SEAM           the handoff correlation record itself, plus the ordering guard for
                       out-of-order and duplicate progress events, which finding A shows has no
                       existing home in these seams
```

## 5. Not done in this increment

Nothing is implemented yet. This audit records the baseline, the reusable surface and the measured
gap, and nothing here is offered as progress against the six steps or as a completion claim.

## 6. CORRECTION — section 3 finding A is WRONG, and how I got it wrong is the more useful result

Reading the module before implementing it overturned my own central claim, so the correction is
recorded rather than quietly edited out.

**What section 3 A claimed:** *"nothing in the seams represents 'the interacting device is not the
executing device' as a first-class correlatable fact."*

**What is actually true**, from `remote-execution.mjs`:

```text
line  6  header: "interaction_device_ref may differ from execution_device_ref, and switching the
                 execution host must not require the user to walk to or operate that host - so the
                 interaction device is never changed here"
line 211  proposeDeviceSwitch({ action_ref, interaction_device_ref, requirements, at })
line 240  interaction_device_ref,
line 241  execution_device_ref: interaction_device_ref,
line 246  interaction_device_unchanged: true,
line 275  interaction_device_ref,
line 276  execution_device_ref: best.device_ref,
```

So the split **already exists as first-class fields**, the invariant that the interaction device is
never changed by a switch is **already asserted**, and the module header states it in almost the same
words the workbook uses. My finding A was false.

**How I got it wrong, because the mechanism matters more than the retraction.** I measured the
CONCEPT by searching for the WORD: `handoff` returns 0 hits across the four seam files, and I read
that zero as "the concept is absent". But this codebase expresses the concept as **device switch**
and **interaction_device_ref versus execution_device_ref**. A word-search is not a
concept-measurement, and the zero I found was evidence about the vocabulary, not about the
capability. Note the internal contradiction this should have caught me: section 3 also reports 39
hits for ordering and 49 for idempotency, and then section 4 lists an "ordering guard for
out-of-order and duplicate progress events" as needing a NEW seam - contradicting my own measurement
in the adjacent paragraph. `REMOTE_EXECUTION_CODES` already contains **`EVENT_OUT_OF_ORDER`** and
**`LATE_EVENT_AFTER_TERMINAL`**, so the ordering machinery was never missing either.

**What survives from section 3:** only finding B, and it is narrower than stated. `provenance`
returns 0 hits in the four seam files against 409 repo-wide, so step 5's binding has no home in
these modules yet - though the same lesson applies, and I will search for the CAPABILITY (what binds
a result to its evidence) rather than for that one word before concluding anything.

**Consequence for the plan, and this is the point of recording it.** Section 4's "ONE NEW SEAM for
the handoff correlation record plus the ordering guard" is **withdrawn**. Building it would have
duplicated machinery that already exists and is already tested - the exact failure the workbook
forbids by banning a second task truth, and the exact waste both preceding tasks in this phase were
careful to avoid. Step 1's real work is therefore to be re-derived by reading
`remote-execution.mjs`'s proposal/dispatch/event path in full and locating what is genuinely absent,
rather than by adding a module on the strength of a zero-hit word search.

## 7. Step 1's real gap, re-derived by reading rather than by searching

Following section 6, the gap was re-established by inspecting what the modules actually connect to:

```text
remote-execution.mjs   imports: (none at all - a pure module with an injected port, by design)
                       mentions 'canonical' 8x and 'authorized' 10x IN ITS OWN vocabulary
                       mentions return_control 0x and task_lifecycle 0x
return-control.mjs     imports: (none at all)
task-lifecycle         referenced only 2x across every contract in the repository
```

So the picture is the opposite of the one section 3 painted. The **vocabulary is present in each
module** — remote-execution already distinguishes the interaction device from the execution device
and already emits status/progress/partial/final/error correlated to one action id, and return-control
already knows the authorized interaction surface and the return channels. What is missing is the
**connection between them**: nothing takes an execution event and returns it into the canonical state
and then projects it to the current authorized surface. That is precisely what step 1's own wording
asks for — *"canonical execution/handoff correlation 与 progress/result return"* — and it is an
INTEGRATION gap, not a vocabulary gap.

**Corrected step-1 statement of work:** build the return-and-projection bridge across
`remote-execution` → canonical state (`task-lifecycle`) → the current authorized surface
(`resolveInteractionSurface` in `return-control`), reusing every existing vocabulary above. No new
correlation vocabulary is to be minted, because the fields already exist and are already covered by
the green baseline.

This is a narrower and better-founded task than section 4's, and it is recorded as the deliberate
consequence of the correction rather than as a fresh plan that happens to differ.

语言配对 / Language pair: [原文 / Source](./STEP1_SEAM_AUDIT.md) · [译本 / Translation](./zh-CN/STEP1_SEAM_AUDIT.md)
