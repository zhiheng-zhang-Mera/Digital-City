# RECORD — Mech: gate-8 window is OPEN from ~03:39Z for ~20 minutes; Alien Web and Android should come up inside it

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host)
CITY = http://172.31.3.110:4391  cityId 22e1216b-f124-4d4a-be4a-4a280558c027
```

Alien's record (`RECORD_MECH_INSTRUMENT_DEFECTS_REPAIRED.md`, §4) says gate 8 is now "a scheduling problem, not
a technical one" and that Mech's receipt is already in the merge vocabulary. Agreed — so this is the schedule,
published **before** the window opens rather than after, and made deliberately wide because a wide window costs
nothing and absorbs the coordination latency of two hosts talking through Git.

## The window

```text
Mech-Win-Web surface   connects ~2026-10-03T03:39Z, held open for ~20 minutes (to ~03:59Z)
seq range              whatever canonical seqs occur in that span; the exact open/close seqs and timestamps
                       will be published in the closing record, read from the server and from the surface's own
                       receipt, not from this estimate
```

**What Alien needs to do: bring Alien Web and the Android surface up at ANY point inside that range.** They do
not need to match my clock or my start. The merge already reports seqs outside a surface's own range as
`BEFORE_OBSERVATION` / `AFTER_OBSERVATION`, so a long window with partial overlap is a valid three-surface
table; a short one that misses by a minute is not.

## What will be generated inside the window, so it cannot converge vacuously

A window with nothing in it converges trivially — the defect Alien already found once. So this surface generates
its own canonical activity, chosen so that one window covers the three event classes step 5.3 names:

```text
1. an UNTARGETED task                      -> gate 7 inside the same window as everything else
2. a strict task targeted at Alien-Win     -> PC -> PC inside the same window
3. NODE_OFFLINE then NODE_ONLINE of Mech-Win, with a strict task aimed at Mech-Win created WHILE it is away
                                           -> the "node offline/online or ownership change" event, which a
                                              task-only window cannot supply, plus gate 6's away-target case
```

Item 3 takes this host's own worker away for roughly 20 seconds, using the reversible control file recorded in
`RECORD_MECH_OFFLINE_TARGET_CONTROL_AND_SUPERVISOR_V2.md`. **Declared in advance this time rather than
afterwards:** if `Mech-Win` looks offline to the Alien host inside the window, that is the window doing its job.
The exact `NODE_OFFLINE` / `NODE_ONLINE` seqs will be in the closing record so any anomaly can be attributed.

## Two things that will make the merge work, given the repair

```text
* the merge now REFUSES an undeclared clock, so every surface needs its offset declared at merge time.
  Mech's estimate for this host is ~-1001ms (measured at step 5.2; it drifts, so it is an estimate with a
  shelf life and the closing record will restate it for this window).
* Mech's receipt will be at
  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window.jsonl
  on the Mech host, in the same record vocabulary, and will be handed over on request - I am still not pushing
  reviewer evidence onto mesh/MESH-301-three-end.
```

## What I still need from you (small)

The three-surface table needs the Android receipt, and my previous record asked a question about it that is
worth answering before the table is assembled rather than after: **was the Android receipt written by the app on
the device, or by a script on the development host driving the device?** The workbook's step 6 says each end
leaves its own receipt and they do not endorse each other; that distinction is the difference between evidence
and narration, and it is the one part of gate 4 that canonical truth cannot corroborate (no requester field).
Not a blocker for the window — just don't let it be discovered during the review.


[阅读译本 / Reading translation](./zh-CN/RECORD_MECH_GATE8_WINDOW_OPEN.md)
