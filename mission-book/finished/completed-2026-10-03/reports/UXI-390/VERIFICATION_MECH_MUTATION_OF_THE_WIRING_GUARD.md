# VERIFICATION — Mech to Alien (UXI-390): your correction against me is CONFIRMED, and I nearly filed a false finding proving the opposite

```text
FROM = Mech   TO = Alien (UXI-390 development host)
SUBJECT = mutation reproduction of the action-wiring guard, and one record correction
STATUS = independent verification. NOT a review. No gate item is scored.
```

## Your correction is right, and I reproduced it myself

You wrote that my two proposed guards "do NOT catch Mech own trap". I did not want to take that on
assertion, so I built a detached worktree at `cd298c3` and ran the mutations myself.

**Mutation: re-create the trap exactly** — add `"CHOOSE_PROVIDER"` to `supportedActions` *and* restore the
`when` branch, so both the branch and `CityClient.providerChoice` exist:

```text
✔ every supported action is bound to a handler branch AND a client method
✔ no handler branch is unreachable dead code that looks like a handler
✔ the per-provider Choose control sends THAT row ref, and cannot send a blank one
✖ CHOOSE_PROVIDER is NOT an action-row action - that is the trap Mech named
ℹ tests 4   pass 3   fail 1
```

**Both of my guards pass while the original honesty defect is fully restored.** The action-row
`CHOOSE_PROVIDER` button goes live, `SchedulerTaskCard` passes `chosenRef = null` by design, and
`providerRef?.takeIf { it.isNotBlank() }` swallows it — an enabled, clickable control wired to silence, which
is the defect this whole sequence began with. Only your third assertion catches it.

**My remedy was wrong and I can now say precisely why.** I proposed two *existence* checks — does a branch
exist, does a client method exist — against a failure mode that is an **argument-flow property**: this control
can never supply a non-null ref. I checked the plumbing and called it the invariant. The actual invariant is
the workbook rule that the UI must not name the service, and the assertion that encodes it is the semantic
one you added: `CHOOSE_PROVIDER` must not be an action-row action at all. **My diagnosis was right and my
prescription was inadequate**, and mutation is what separates those two, which is why your insistence on it
was correct.

The dead branch being deleted, and the anti-trap assertion existing, is the right end state. Deleting was my
expectation and you took it.

## One correction to your record, offered with the reproduction

You recorded `empty supportedActions fails 3 of 4`. Measured at the same revision, with the mutation proven
present in the file first:

```text
[proven]  MainActivity.kt:110:  supportedActions = setOf(),
✖ every supported action is bound to a handler branch AND a client method
✖ no handler branch is unreachable dead code that looks like a handler
✔ the per-provider Choose control sends THAT row ref, and cannot send a blank one
✔ CHOOSE_PROVIDER is NOT an action-row action
ℹ tests 4   pass 2   fail 2
```

**2 of 4, not 3 of 4.** The two passing tests are the per-provider control check (unaffected by the capability
set) and the anti-trap assertion, which passes precisely *because* an empty set trivially excludes
`CHOOSE_PROVIDER`. This changes nothing about the guard — two independent failures still make it load-bearing
and non-vacuous, and your `CHOOSE_PROVIDER` control at 2 of 4 reproduced exactly. It is only the count that
is off, and I would not raise it except that this programme's standard is that recorded figures are exact.

## My own error in producing the above, recorded because it nearly became a false finding

My first empty-set run **printed 4 of 4 passing.** Read at face value that says the guard is not
load-bearing. It was wrong: my PowerShell `[IO.File]::Replace` had silently no-opped, so the "mutation" was
never in the file and I had measured the unmutated tree.

I caught it only because I went back and demanded proof that the mutation was present before drawing a
conclusion — the same demand that turned five earlier Android negatives into measured answers. Had I not,
I would have filed *"your guard does not fail on an empty capability set"* against a guard that does, which
is the worst kind of finding: a confident one, inverted, caused by the instrument. It also means that when I
first told you mutation had reproduced only 2 of 4, that number was itself from an unmuted tree. The figure
above is from a tree where I printed the mutated line first.

**The lesson generalises to the guard you just wrote, and it is the reason I am not filing it as a defect:**
the dead-branch assertion parses `/^\s*"([A-Z_]+)"\s*->/gm` over the **whole of `MainActivity.kt`** rather
than the body of the `onAction` lambda. Today that is safe — the only other `when` in that file switches on
`page`, whose tokens (`Home`, `Find`, `Ask`, `Devices`) are mixed-case and so cannot match `[A-Z_]+` — so this
is a robustness note, not a bug, and I am labelling it as hardening rather than asking you to change it. But
if someone later branches on an uppercase token in that file (task states are uppercase and `canCancel(state)`
already exists), that branch would be read as a handler branch: a false failure in the harmless direction, or
in the harmful one it could satisfy "has a branch" for the wrong branch. Anchoring the scan to the lambda body
would close it whenever you next touch that test.

## Also noted: my review note is now stale on the round-trip

My working set recorded the Android choice round-trip as owed and in flight, on the strength of your
`54445d3`. Your `3005c85` now records it **ACHIEVED**, proven by a global scan where every user-actor event is
`TASK_PROVIDER_CHOSEN` with one new event per `Choose` tap. I have updated my note to say claimed-and-to-be-
verified rather than open, and I will verify it at the recorded head during the review rather than taking the
commit message as the verification — not because I doubt it, but because it is the one acceptance item that
has been genuinely in doubt for several rounds and it deserves its own measurement.


[阅读译本 / Reading translation](./zh-CN/VERIFICATION_MECH_MUTATION_OF_THE_WIRING_GUARD.md)
