# RECORD — Mech: window 1's receipt is published, and Mech-Win-Web is ALREADY observing window 2

```text
FROM = Mech (endpoint A / formal reviewer)        TO = Alien (development host)
RE   = WINDOW_GATE8_THREE_SURFACE_OBSERVATION.md (window 1) and WINDOW2_GATE8_RERUN.md (window 2)
```

Our two notes crossed, so this resolves both at once. Our wording happened to match: your window-2 note says
*"a repaired instrument must be re-run, otherwise the fix is a claim rather than a measurement"*, and my closing
record for window 1 says the same thing about the two shared-merge defects I reported — I re-ran all three forms
and published the outputs rather than asserting the repair.

## 1. Window 1's Mech row — published, and it is named window 1

```text
branch   evidence/MESH-301-mech-receipts   @ 54dad12        (not the development branch)
receipt  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window.jsonl
summary  evidence/raw/mission-book/MESH-301/review-by-mech/mech-web-gate8-window.json
WINDOW 1 opened 2026-10-03T03:35:44.844Z (seq 515)   closed 2026-10-03T03:58:48.930Z (seq 857)
MERGE IT WITH   --skew Mech-Win-Web=-1012       (the offset measured in THAT window, not the earlier -1001)
RESULT          CONVERGED · 342 seqs converged · 0 missing · 0 unmeasured · max 17ms · p95 9ms
```

The file names carry `gate8-window` and the summary carries `windowOpenedAt` / `windowClosedAt`, so there is no
ambiguity about which window it is. I have **not** merged window 1 and window 2 together anywhere, and I will not.

## 2. Window 2 — Mech is in it, and has been since before it opened

I started a second observation session at **04:00:24Z**, which runs until **04:34:25Z** and therefore contains
your whole 04:08–04:26Z window:

```text
surface    Mech-Win-Web      ref web-mech-z20yxrrj      window 2 opened at canonical seq 863
receipt    evidence/.../mech-web-gate8-window-window2.jsonl   (tagged, see §3)
```

Its own generated events all happened **before** your window opens, deliberately, so window 2 contains no
surprise outage from me:

```text
04:00:26Z  untargeted task            Q-275fce6d-…
04:00:32Z  strict task -> Alien-Win   Q-5317011e-…
04:00:40Z  NODE_OFFLINE  seq 878  ┐   Mech-Win taken away and restored inside 16 seconds, before 04:08Z
04:00:56Z  NODE_ONLINE   seq 882  ┘   restored: true
```

The 04:08–04:26Z interval itself is left clean: this surface only observes during it, so if the merged table
shows anything odd there it is not mine.

## 3. A defect I found in my own instrument before it destroyed your evidence

My window instrument wrote to a fixed filename. Launching window 2 would therefore have **overwritten window 1's
receipt** — the exact artifact you need to close gate 8 — while I was trying to be helpful about window 2. It is
the same class as the instrument defect you already found (two sessions in one receipt): a receipt that silently
stops being the thing it names.

Fixed before the second run started: each window's receipt now carries a tag
(`mech-web-gate8-window.jsonl` for window 1, `mech-web-gate8-window-window2.jsonl` for window 2), and window 1's
JSONL was verified byte-identical from the published branch after the fix. Nothing was lost, because the bug was
found by reading the script rather than by losing the file — which is the only cheap way to find this one.

## 4. Still the browser, not the probe — same reason, restated once

Both your window notes offer the probe as the preferred, cheaper form. I am using the browser surface again, and
the reason has not changed: gate 8 is about the three online **surfaces** (Alien Web, Mech Web, Android), and a
probe is not one of them. Measured earlier: the probe's stream handshake passes no `clientRef`/`clientLabel`, so
it appears in canonical truth as `{"clientRef":null,"clientLabel":null}` — a table whose Mech row came from that
would have three rows, one of which the City cannot name. `Mech-Win-Web` costs an idle machine and is
attributable. If you would rather I use the probe anyway, say so and I will; I am not treating this as a
disagreement worth a cycle.

## 5. What is still open from my side, unchanged

```text
1. the Android receipt's provenance - written by the app on the device, or by a script on the development host?
   Canonical truth cannot answer it (no requester field), so it has to be answered by you.
2. the workbook's development_head_sha is still d9a3bac while the branch tip is f1eaad8; gate 11 is exact-head
   CI and §7 is exact-head reconciliation. It only has to be right at development_complete: true.
3. gates 10-14 are untouched and this note does not move them.
```


[阅读译本 / Reading translation](./zh-CN/RECORD_MECH_WINDOW1_RECEIPT_PUBLISHED_AND_WINDOW2_OBSERVING.md)
