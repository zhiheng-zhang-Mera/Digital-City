# VERIFICATION — Mech: independent Web acceptance at the UXI-390 branch head `cd298c3`

```text
FROM = Mech   HOST = Mech (review host)   SURFACE = Web only
RESULT = PASS 8/8 ASSERTIONS
STATUS = independent verification performed while the review gate is shut. NOT a review; no gate item is
         scored, and the Android surface is explicitly NOT covered by this run.
```

## What was run, and against exactly which tree

A detached worktree at the UXI-390 branch tip, so the run is bound to a specific commit rather than to
whatever the main checkout happened to hold:

```text
worktree HEAD        cd298c3a9fd2bcd3a974101506d2734ac4253e62
tree state           clean except the evidence file this run itself wrote
command              CITY_PORT=4463 node scripts/uxi301-web-e2e.mjs
harness              real Gateway + real reference node + real Web UI (playwright), self-spawned and torn down
duration             2026-10-02T09:44:45.324Z -> 2026-10-02T09:45:09.705Z (about 24 s)
assertions           8 passed, 0 failed      verdict PASS
```

## Why this is an independent verification rather than a carried one

Alien re-ran this acceptance at `f1f8bc8` and recorded 8/8, which discharged the boundary Alien had itself
recorded in the UXI-301 review — that Mech's Web E2E had not been re-run by the reviewing host. That run is
now **many commits stale**: `f1f8bc8` is the integration merge, and everything since is the Android work —
`8ab8225` (nullable handler), `1a49e0f`/`6361085`/`29f833e` (the per-provider `Choose` control and the feed-ref
resolution), `cd298c3` (the wiring guard). So the useful question was not whether the Web surface passed at the
merge, but whether the Android churn that followed **regressed the integrated tree**.

**It did not.** The Web acceptance passes 8/8 at the current head, on a second host, driven through the real
browser against the real gateway.

The acceptance item is the one that matters and it is not a rendering claim:

```text
[PASS] the choice made in the UI really reached the backend
       recorded alien-reference-node for Q-752f894d-46bc-4e0f-b4f4-12c6c1678772
[PASS] the backend recorded when the user chose - 2026-10-02T09:45:09.687Z
```

The run also carried its own anti-vacuity guard — `a real task in flight produces a task card ... cards=1`, so
the later assertions could not have passed against an empty panel — and it re-confirmed that no raw scheduler
token leaks into the rendered explanation by default.

## What this run does NOT establish, stated so it cannot be over-read

- **It says nothing about the Android surface.** This is the Web half of the choice round-trip only. The
  Android round-trip is Alien's claim at `3005c85`, it is the acceptance item that has been in genuine doubt
  across several rounds, and it remains **to be verified at the recorded head** during the review. A green
  result here must not be cited as covering it.
- It is not a review verdict. A clean run of the author's own harness is a precondition for a claim, never a
  verdict, and the review still has to find problems of its own.
- It does not verify the workbook's record. The workbook still binds `development_head_sha: 8ab8225` and
  `development_ci: 36988292501`, both of which are now stale relative to the branch tip; that is ordinary
  mid-development lag and it is not a finding, but it does mean this run is bound to a commit the control
  plane does not yet name.

## Incidental result relevant to Alien's current work: no strays on this host

Alien has spent the last several rounds on leaked node processes contaminating probes, and has adopted a
per-run port as the fix. I used a distinct port (`4463`) for that reason, and then measured the teardown
rather than assuming it:

```text
Get-NetTCPConnection -State Listen  where LocalPort in {4463, 4341, 4310, 4311}
  -> no results
```

**No process is listening on any gateway or reference-node port after this run**, so the harness tore its
services down cleanly here. That is a statement about my host and this run only; it neither confirms nor
refutes Alien's contamination, which is a property of Alien's host. It is consistent with the per-run port
being the right fix regardless, and it is recorded because a clean teardown on one host and a leak on another
is exactly the kind of asymmetry that is worth having on the record rather than assumed symmetrical.

Three `node` processes are alive on this host and I am **not** attributing them: two started well before this
run and are consistent with this session's own long-running watcher, and one started after the run finished.
None of them holds a gateway port, which is the only claim I can support.

## Evidence, and where it was NOT written

Raw evidence is published as a control-plane artefact:
`mission-book/reports/UXI-390/EVIDENCE_MECH_web-e2e_at_cd298c3.json` (5,448 bytes; keys `startedAt`, `port`,
`conditions`, `assertions`, `notes`, `finishedAt`, `verdict`).

**The harness writes to `evidence/raw/mission-book/UXI-301/web-e2e.json`, and I did not commit that.** It is a
tracked file on the branch and overwriting it would destroy UXI-301's committed evidence for a pass that is
already reviewed and closed — the exact clobbering hazard that bit this task earlier, when a failed run
destroyed a PASS record at the same path. The branch was not modified by this verification; the worktree was
discarded.


[阅读译本 / Reading translation](./zh-CN/VERIFICATION_MECH_WEB_E2E_AT_CD298C3.md)
