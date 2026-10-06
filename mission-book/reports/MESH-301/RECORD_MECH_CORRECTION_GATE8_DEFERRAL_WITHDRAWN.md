# RECORD — Mech: I WITHDRAW the gate-8 deferral. Filtering to the declared window shows zero losses inside it, and my alarm was an inference I should have measured first

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host), Owner
WITHDRAWS = RECORD_MECH_INDEPENDENT_GATE8_TABLE_REBUILD.md, section 3, the DEFERRED classification
MEASURED = my own independent-window2-merge.json over the merged four-observer timeline
```

## 1. What I said, and what one command showed

I classified gate 8 as **DEFERRED**, on the argument that the four `GAP_DECLARED` events meant a surface had
lost canonical seqs while it still reported itself online, so the bounded-convergence claim was not clean.

I then filtered the merged timeline to the interval that was actually under test and looked for the states that
would matter:

```text
declared window   2026-10-03T04:08:00Z .. 04:26:00Z
entries inside it 376
entries inside it with GAP_DECLARED, MISSING or LATE, for ANY of the four observers:  ZERO
```

And the six unmeasured entries, named — which is where my argument was simply wrong:

```text
seq 436, 437, 438   PERM00       inside a gap the device declared at 03:32:34Z - BEFORE window 2 opened at seq 863
seq 861             Alien Web    inside a gap the surface declared at 04:27:24Z - AFTER the declared window closed
seq 1268            Alien-Host   the probe's own shutdown boundary
seq 1269            PERM00       the receipt's own shutdown boundary
```

**Not one of the six falls inside the measured window.** I had asserted that the pre-stale loss was inside it.
It is not: it is a single seq at the very edge of the session, and it belongs to the socket drop that happened
after the declared interval ended.

## 2. So the deferral is wrong twice over, and I am withdrawing it rather than restating it

```text
WRONG ON THE FACTS     I claimed the pre-stale gaps were inside the window under test. They are not.
WRONG ON THE READING   I used a surface's SELF-REPORTED status to define "online", and then judged the gate
                       against my definition. The workbook defines it by the condition (5.6: an offline
                       surface need not update live, but must show stale and re-converge), not by what the
                       client believed at the moment. And requiring the client to know instantly that the
                       network died is requiring clairvoyance; requiring a server-side liveness signal would
                       be a new mechanism the workbook does not ask for, and building one to pass a gate is
                       the manufactured work the standing rules forbid.
```

**Withdrawn.** On the workbook's own words, gate 8 reads to me as **MET**: three surfaces on three physical
machines, one canonical City, 2033 convergences measured against canonical server `seq`, **zero window
breaches, and zero losses inside the declared window**. My earlier framing that "no online surface breached 5 s"
but that the verdict was nonetheless blocked was a distinction without a difference inside the window, and the
difference it did have lives outside it.

The final MET / NOT MET still gets stated once, in the formal review, against the frozen review head. This
record only removes an objection I should not have raised.

## 3. What survives, unchanged and not inflated

```text
1. Alien-Host -1 ms   The declared skew is 0 against a minimum raw of -1, so 40 seqs in window 2 and 41 in
                      window 1 are reported at -1 ms. It is the shape of the defect we already fixed once (a
                      number that cannot be a latency, displayed in the latency column), the magnitude is 1 ms,
                      and it changes no verdict. Either declare -1 or have the merge refuse a negative latency.
                      NOT a re-run request.
2. Pre-stale boundary This is a real policy question and it remains the Owner's: should the boundary be drawn
                      by the City (server-side liveness) rather than by the client's discovery of its own
                      disconnection? What I withdraw is calling it a gate-8 blocker. It is a hardening item.
3. Android provenance Unchanged and still open: was the Android receipt written by the app on the device or by
                      a script on the development host? Gate 4's issuing-surface identity rests on it, and
                      canonical truth cannot corroborate it (no requester field).
```

## 4. The lesson, recorded because it is the second instance in this task

The first was the unnamed control surface: I read `{"clientRef":null,"clientLabel":null}` as a leaked stale entry
and only found out it was a live anonymous client — and that the list is correctly maintained — by testing it.
This time I read six `unmeasured` entries as a gate blocker without filtering them to the interval being judged.

Both times the alarm dissolved under a measurement that cost one command. The pattern is the same: **I inferred a
property of a window from a property of a session.** A session's residue is not a window's residue, and a
receipt's list of leftovers is not evidence about the interval it was declared for. From here I will filter to
the declared interval first and only then characterise it — and the honest thing to record is that the reviewer
produced two false alarms before producing this one correction, not that the corrections were timely.


[阅读译本 / Reading translation](./zh-CN/RECORD_MECH_CORRECTION_GATE8_DEFERRAL_WITHDRAWN.md)
