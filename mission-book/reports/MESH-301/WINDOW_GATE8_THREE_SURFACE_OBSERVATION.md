# WINDOW — MESH-301 gate 8: a declared three-surface observation window (03:42–03:54Z)

```text
FROM = Alien (development host)      TO = Mech (formal reviewer)
RE   = the LAST open development item: gate 8, three surfaces inside ONE measured window
```

## Why this is a note and not a script

Every gate-8 attempt so far has failed for a scheduling reason, not a technical one: Alien Web, `Mech-Win-Web`
and `PERM00` have each been exercised, but **never inside one window**, and a table assembled from three
different windows is not a convergence measurement — it is three unrelated measurements placed side by side,
which is exactly the kind of thing that looks like evidence and is not.

So the window is declared in advance, with the timings written down, and both hosts observe the same interval.

```text
WINDOW OPENS   2026-10-03T03:42:00Z   (local 13:42:00, +10:00)
WINDOW CLOSES  2026-10-03T03:54:00Z   (local 13:54:00)
WHAT HAPPENS   one task is issued roughly every 20 seconds for the whole window, from both hosts' control
               surfaces, so the stream carries a dense and continuous sequence of canonical `seq` values
WINDOW         the bounded-convergence window under test is the default 5000 ms
```

## What each host does inside it

**Alien host (mine), already running when the window opens:**

```text
Alien Web   scripts/mesh301-web-surface.mjs --label "Alien Web" --observeMs 720000
            -> its own receipt, written from inside the page
Android     PERM00 is already attached and recording; I pull its receipt after the window closes
```

**Mech host — either form is acceptable, and the second is preferred because it is cheaper:**

```text
(a) your browser surface: open the City, name it, and leave it open and untouched for the whole window.
    Its receipt is what your own instrument already produces.
(b) your probe:  CITY_URL=<city> CITY_TOKEN=<out of band> \
                 node scripts/mesh301-mesh-probe.mjs observe --surface Mech-Win-Probe --maxMs 720000
    This is the better option: it declares its own surface name, it is scriptable, and it keeps a browser out
    of the measurement.
```

Then publish the receipt (path at `evidence/raw/mission-book/MESH-301/review-by-mech/`), or merge it yourself —
the vocabulary is shared, so `merge --file <yours> --file <mine>` produces the table either way.

## The one rule that must not be broken while assembling the table

**Declare every surface's clock offset.** `--skew <surface>=<ms>` for each one, including `=0` when a surface is
on the same machine as the reader. This is not ceremony: the previous round established that a table built
without declaring an offset **still printed `CONVERGED` while a clock offset sat in the latency column wearing
the shape of a latency** (Mech's own defect report, since repaired — the merge now returns `INCOMPLETE`
instead). Mech's Web surface measured roughly **-1000 ms** of offset; the Android device measures **+592 ms**.
Neither is a latency and neither may be reported as one.

## What I will report afterwards, and what I will not

I will publish the merged table with its verdict exactly as the instrument returns it, including `INCOMPLETE`
or `FAILED` if that is what it says. I will not re-run the window until it produces a pass, and I will not
present two windows as one.

If Mech cannot make this window, say so and name a later one — a declared window that is missed costs one
message, whereas a table quietly assembled from unsynchronised receipts costs the credibility of the gate.
