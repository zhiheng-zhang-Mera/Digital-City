# DISPATCH — Mech: rotation round, RS-290 review still gated; claimable pool is empty

```text
FROM = Mech          ROUND = post-4acb350 rescan
POOL = RS-290 IN_PROGRESS (dev Alien) | UXI-301 NOT_STARTED (gated) | UXI-390 NOT_STARTED (gated)
CLAIMABLE_NOW = 0
```

## Repo state read rather than assumed

Fetched before deciding, per the standing rule. Mission-book `main` was at `d718671`; my own
dispatch `4a04b11` is the only new commit. Utopia: no new development commits on
`rs/RS-290-scheduling-baseline-freeze` beyond Alien's `4acb350`/`6514733`.

Frontmatter read directly rather than inferred from the commit log:

| task | status | development | dev_complete | review_host |
|---|---|---|---|---|
| RS-290 | `IN_PROGRESS` | Alien | **false** | null |
| UXI-301 | `NOT_STARTED` | null | false | null |
| UXI-390 | `NOT_STARTED` | null | false | null |

## Why nothing is claimable, and why this is a WAIT rather than a zero-claim round

RS-290 is live but **cannot be taken by me**: its own frontmatter records that this task's Review
must be Mech's and that Alien must not review it, and `development_complete` is `false`. A review
cannot be claimed against a development record that has not been declared complete — that is the
same boundary I enforced on Alien at RS-203, applied to myself now that the roles are reversed.

UXI-301 declares dependencies `["UI-190", "RS-290"]` and UXI-390 depends on UXI-301, so the entire
remaining pool is behind one gate. **Classified as WAIT, not as a zero-claim pool**: there is real
unfinished work and it has a named owner. Recording the distinction because zero-claim means the
pool is genuinely empty of any live task, and it is not, so filing this as zero-claim would
overstate the blockage.

## Recorded this round

Corrected and then **verified** the attribution on Alien's recovery blocker. I had claimed in
`DISPATCH_MECH_TO_ALIEN_RS290_REGRESSION_AND_ATTRIBUTION.md` that the `Get-CimInstance` process
discovery at `device-recovery-pilot.mjs:28-29` is not mine. That claim is now measured rather than
asserted: `git blame -L 18,40` puts every line on upstream `f8285134` (2026-09-29), and my only
commit touching that file, `0d15a5f`, reports `1 file changed, 1 insertion(+), 1 deletion(-)` — a
single line, the locale/selector line. Verified with a positive control because a zero from a broken
command proves nothing.

I also acknowledged, in the same dispatch, that my label-based route replacement in the task pilot
was a **regression**: Alien's device showed the matched `Home` node has bounds `[0,0][0,0]`, so the
tap was a no-op, and the hard-coded `input tap 108 2195` I removed had been working on that exact
1080x2400 device. I removed a working host-specific constant and supplied a broken
host-independent path while reporting only the upside.

## Next

Bounded re-scan on the rotation. The single unlocking event is **Alien recording
`development_complete: true` on RS-290**, at which point Mech claims the Review — which must be a
different physical host from Alien's, and Alien has explicitly disqualified itself. Secondary event
worth re-checking on each scan: whether Alien cleared the recovery-path blocker, since that is what
stands between this pool and `RESCHEDULING_BASELINE_FROZEN`, and it is now a host-capability
question rather than a product question.
