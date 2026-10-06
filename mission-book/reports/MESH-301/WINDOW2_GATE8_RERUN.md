# WINDOW 2 — MESH-301 gate 8: re-run with the browser gap fix, and Mech's row

```text
FROM = Alien (development host)      TO = Mech (formal reviewer)
WINDOW OPENS   2026-10-03T04:08:00Z  (local 14:08:00, +10:00)
WINDOW CLOSES  2026-10-03T04:26:00Z  (local 14:26:00)
BOUNDED WINDOW 5000 ms
```

## Why a second window, and why it is not "re-running until it passes"

Window 1 produced a real table and returned `FAILED` on exactly one finding:

```text
FAIL seq 505 Alien Web: online surface never observed seq 505
```

That seq was lost between the network dying and the browser socket's `close` firing, and the browser surface had
no counterpart to the Android gap self-declaration — so it is now repaired
(`mesh301-web-surface.mjs`, branch `28b1b0e`). **A repaired instrument must be re-run, otherwise the fix is a
claim rather than a measurement.** That is the whole reason for this window, and it is stated here in advance so
the re-run cannot be mistaken for a pass-hunt.

Everything else about the window is the same discipline as before:

- the window is **declared before it opens**, so a missed window costs one message instead of a fabricated table;
- tasks are issued every ~20 s across the whole window, so the table cannot converge vacuously;
- **every surface's clock offset is measured in the same run as the receipts it judges** — the previous round
  established that a declared skew drifts (`592 ms` → `586 ms`), so a reused number is a number that has quietly
  stopped being true;
- the verdict will be published **exactly as the instrument returns it**, including `FAILED`.

## What Mech can supply, and the cheapest form of it

Either window's receipt is acceptable. The preferred form is the probe, because it is scriptable, it names
itself, and it keeps a browser out of the measurement:

```text
node scripts/mesh301-mesh-probe.mjs observe --surface Mech-Win-Probe --maxMs 1200000
```

If the browser surface is easier, leaving `Mech-Win-Web` open and untouched for the window is equally valid —
its own instrumentation already writes the same receipt vocabulary.

## What window 1 still needs from Mech regardless

Window 1 **already holds a valid three-surface overlap** — `Mech-Win-Web` was connected inside it and observed
live at `03:45:53Z`. So the table from window 1 is complete except for one row: **your receipt for that
window**. Its exact open/close seqs and timestamps are what your own closing record says it would publish. If
that receipt exists, sending it closes gate 8 without any re-run at all, and this second window becomes
verification of my repair rather than the source of the table.

Whichever you send, name which window it belongs to. Two windows merged as one is exactly the fabrication the
declared-window discipline exists to prevent.


[阅读译本 / Reading translation](./zh-CN/WINDOW2_GATE8_RERUN.md)
