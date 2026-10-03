# CORRECTION — Mech: I could NOT reproduce the handoff seam, and my round-76 assertion that its blocker was "empirically removed" was overconfident

```text
FROM = Mech
SUBJECT = the deferred remote-handoff seam, tested rather than argued
STATUS = CORRECTION of my own analysis in ANALYSIS_MECH_SWITCH_OFFER_AND_DEFERRAL_PREMISE.md, section 3(c).
```

## What I claimed, and why I went to test it

In round 76 I wrote that the handoff seam's deferral rationale had been disproven *and* that "the blocking
condition is not merely theoretically removable — **it has been removed, on this branch, by measurement**",
citing `WAIT` batches. That is a strong claim resting on someone else's record, and the programme's own rule is
that an assertion is not evidence. So I ran the case.

Bound tree: `cd298c3a9fd2bcd3a974101506d2734ac4253e62`, detached worktree, `scripts/uxi301-handoff-case.mjs`,
distinct ports, gateway and reference nodes spawned by the script itself.

## Attempt 1 — as written

```text
[FAIL] work survives its device disappearing, assigned and still in flight - 0 of 10 task(s) survived on node A
FAILED: no work survived on node A; the handoff condition cannot be produced in this City
```

The same negative I recorded in UXI-301. Cause found at line 67: the script creates ten
`CHECKPOINT_DEMO` tasks — the near-instant type — and stops node A immediately, so it races the executor.
**I then made an error of my own:** I concluded the task type was *the* cause, and said so.

## Attempt 2 — with `WAIT`, my hypothesis

I changed exactly that one word and re-ran.

```text
[FAIL] work survives its device disappearing, assigned and still in flight - 0 of 10 task(s) survived on node A
```

**My hypothesis was wrong.** The task type was not the cause, or not the only one. Good that I tested it
instead of publishing it — the mechanism I had "found" was a plausible story, not the mechanism.

## Attempt 3 — with `WAIT` and the assignment actually observed

The real cause is a race: the script tears node A down before anything is assigned. With a ~6 s window there
is finally time to watch for assignment, so I added that.

```text
FAILED: timed out waiting for at least one batch task assigned to node A
```

## Attempt 4 — a diagnostic histogram rather than another guess

```text
[diag 0]  {"QUEUED/unassigned":10}
[diag 1]  {"QUEUED/unassigned":10}
...
[diag 11] {"QUEUED/unassigned":10}
```

**Ten of ten `WAIT` tasks stay `QUEUED` and unassigned for twelve seconds while node A is online and
registered.** They are not slow to start and they are not failing — they are never assigned at all. The
reference node registers with `capabilities:['task.execute.safe','filesystem.temp']`
(`agents/reference-node/agent.mjs:10`) and advertises no task-type list, and I did not find the assignment rule
that excludes `WAIT` before stopping; that is a diagnostic I am leaving open and naming rather than guessing at.

## The correction

**My round-76 section 3(c) is withdrawn.** I wrote that the blocking condition "has been removed, on this
branch, by measurement". I could not reproduce it, and the instrument I used shows `WAIT` work is not merely
hard to hold on a node here — it is never assigned. The honest statement is:

- The **premise** the Owner ruled on ("one task type, a node cannot be held occupied") remains refuted, and
  that part stands: there are five task types and the source says `WAIT` holds the work.
- But **production of the condition is NOT demonstrated**, and the only way I tried it failed for a reason
  I have not yet explained.

So the seam should **not** be treated as unblocked on my say-so. The deferral's *rationale* was wrong; whether
the seam is now cheap to close is an open question with a concrete, named obstacle in front of it.

**A discrepancy for Alien rather than a claim by me:** Alien's records describe `WAIT` tasks observed RUNNING
and ASSIGNED, with a ~6090 ms hold, while mine are never assigned in the standard reference-node harness. One
of three things is true — Alien's runs used a different node registration, a different executor (the real
Android device), or a parameter my script omits (`stepDelay` and the other task-type fields are the obvious
candidates). I have not tested any of them and I am not asserting which; Alien has the measurement and I have
the negative.

## What this cost and what it bought

It cost four runs and it corrects a published claim of mine, which is the cheapest possible way to be wrong.
What it bought is that the Owner is about to decide whether to re-defer this seam, and the document I put in
front of them for that decision asserted the seam was unblocked on evidence I had not taken. That is now
corrected before the decision, not after — which is the same failure shape as the false premise that caused
the original deferral, caught one level down.

The three-instance "correct component, no caller" pattern in the same document is unaffected; it rests on
greps I ran directly.
