# REX-807 claim-readiness preflight — Mech

Author: Mech-DS (`MEGA-REP`), 2026-10-06. English reading of [REX-807_CLAIM_READINESS_MECH.md](../REX-807_CLAIM_READINESS_MECH.md); the Chinese source remains authoritative.

```text
Measured        control plane dc @ 1569f07 (origin/main); implementation utopia @ b06504f (origin/main);
                and the REX-806 development head 3950d478e627aaa615ef69e3ac65c30da37c5ea6
Boundary        READ-ONLY preflight: it does not claim REX-807, writes none of its workbook fields,
                does not create its report directory, and merges nothing
```

## Why this exists

By round 49 the series had reduced to one chain - REX-806 review, then REX-807, then REX-890 - and this host's rescan found nothing claimable. So the opening conditions of the next task were measured and recorded rather than guessed. The opposite host had also relocated 274 files, so the programme now lives under `mission-book/mission-group/research-strengthening/`.

## Zero-claim, classified

All 89 workbooks' frontmatter was read (read-only script, process file on this host). Status distribution: `NOT_STARTED 49`, `COMPLETE 25`, `REVIEW_COMPLETE 7`, `IN_PROGRESS 2`, `WAITING_DEPENDENCIES 2`, plus one each of four frozen/accepted states.

```text
TEMPORARILY_UNCLAIMABLE   2   REX-807, REX-890 - one clear blocker: no accepted SHA for REX-806 yet
STRUCTURALLY_INELIGIBLE  49   every NOT_STARTED task whose execution_enabled is not true:
                              personal-compute-fabric 25, deliberative-governance 8, city-self-health-check 5,
                              review-independence-v2 5, utopia-runtime-architecture 5 (+1 template).
                              A programme not being activated is the record holder's state, not something this host activates.
ASSIGNED ELSEWHERE        1   SHOW-401 (dev=Alien)
MINE, AWAITING REVIEW     1   REX-806 (development complete, review unclaimed)
READY AND UNCLAIMED       0
```

Wake condition: the opposite host completes REX-806's independent recomputation and releases `RESEARCH_ARTIFACT_EXPORT_ACCEPTED`.

## The dependency gate, measured

```text
REX-801:EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED   released; both its development head 8f8c521 and review head 7e96a4d
                                                are ancestors of current main - so this dependency creates no union conflict
REX-806:RESEARCH_ARTIFACT_EXPORT_ACCEPTED       not released
required_ancestor 69a097b                       ancestor of current main
dependency_source_shas []  ·  development_baseline_sha null  ·  baseline_blocker DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE
merge_authority false
```

## What the claim-time union will resolve to

`DEPENDENCY_SHA_UNION_AT_CLAIM` requires the union of accepted exact SHAs. Measured: the REX-806 development head `3950d47` contains all three accepted REX heads (`8798ba9`, `fe700ab`, `0261a9e` - 3/3 ancestors). So the union is main, plus REX-801's accepted head (already in main), plus REX-806's accepted head - which itself already contains the other three.

```text
Case A (predicted)  the review accepts 3950d47 unchanged -> the union is main fast-forwarded to 3950d47,
                    with no union conflict to resolve
Case B (predicted)  the review requires repairs -> the union must use the ACCEPTED repair head, never the
                    development head as a substitute (REX-806 itself hit that: dev a695bb9 was 14 commits
                    behind accepted 8798ba9)
```

Both cases are predictions; the review decides. This preflight does not claim REX-806 will be accepted.

## Where the surfaces it must expose actually live

REX-807 requires seven layers: Experiments, Runs, Metrics, Replay/Ablation, Export, Advanced Fault Injection, Technical Details. Checked against both heads:

```text
route                                            main b06504f   REX-806 head 3950d47
GET  /api/v0/research/trace                      yes            yes
GET/POST /api/v0/research/experiments            yes            yes
POST /api/v0/research/experiments/validate       yes            yes
GET/POST /api/v0/research/campaigns (+stop)      no             yes (REX-803)
GET/POST /api/v0/research/replays                no             yes (REX-805, ablation included)
GET/POST /api/v0/research/faults                 no             yes (REX-804)
GET  /api/v0/research/artifacts[?format=csv]     no             yes (REX-806, owner-only)
GET  /api/v0/monitor                             yes            yes

web: index.html already carries a SECONDARY "Advanced" nav group containing Research and Research trace, so the
     "clear but secondary entry" foundation exists; apps/web/research.js is 52 lines and only authors and
     validates manifests; apps/web/research-trace.js is 21 lines.
owner boundary: a member session gets 403 RESEARCH_OWNER_REQUIRED on the fault routes (server.mjs:804) and on
     the campaign/replay routes (:807).
```

Conclusion: every surface REX-807 must expose arrives with the union; what it must build is the surface and its layering, not the back end.

## The contract mapped to evidence

Per `RESEARCH_CONTROL_SURFACE.md`, the review walks the ordinary-user path looking for hidden entries, fake buttons, over-collapsing, missing information and visual overload:

```text
DIRECT_CONTROL    create / start / stop / scenario / repetitions / replay / export -> campaigns, replays and
                  artifacts routes, in the Research page's primary area
ADVANCED_CONTROL  fault injection / destructive cleanup / seed-config override -> faults routes plus explicit
                  confirmation; the owner-only rule is already enforced server-side, the UI must prevent mis-taps
OBSERVABLE        current run, progress, topology, failures, retries, handoffs, recovery, metrics, exclusions,
                  provenance, artifact status -> read from campaigns/replays/artifacts/trace; user-language
                  summary by default with raw identifiers collapsed
INTERNAL_ONLY     e.g. the trace collector's internal buffer - if it never appears, the workbook must state
                  UI_EXEMPT_INTERNAL_ONLY with a reason
```

## The honest size of the job

1. The 52-line `research.js` becomes a layered page (Experiments / Runs / Metrics / Replay / Export / Danger / Diagnostics).
2. The Danger Zone is an interaction and state problem, not a copy problem - a reviewer must be able to test it along the ordinary path.
3. Errors, exclusions and NOT_MEASURED metrics must stay visible: REX-806 deliberately published 23 unavailable metrics with reasons and three exclusions, and hiding them would turn "truthful" into "flattering".
4. Raw identifiers collapse by default, but not into "insufficient information" - by the contract's own words, overload is solved by layering, folding and search, not by hiding capability.
5. Android is only required to observe run/status/critical attention; full authoring parity may be recorded as future backlog.
6. It must be verified in a real browser: in this series, unit tests have missed page-level crashes.

Not done here: no UI was run, no browser check was made, no REX-807 workbook field was written, no branch or baseline was created for it, and nothing is claimed about whether it will pass review.

## The checklist a claimant should run

```powershell
# 1) refresh both repositories and read origin/main for each
# 2) re-read the workbook frontmatter: is the REX-806 marker released, and which SHA is accepted
# 3) build the union from the ACCEPTED SHAs and measure every ancestor relation explicitly
#    git merge-base --is-ancestor <required_ancestor> <baseline>
#    git merge-base --is-ancestor <accepted_head>     <baseline>
# 4) dependency smoke on that baseline, before touching product code - 26 research suites:
#    rex801 (4), rex802 (2), rex803 (8), rex804 (5), rex805 (4), rex806 (3)
# 5) write the claim (only the necessary fields plus baseline_resolution_evidence) and push in the same step;
#    on a rejected push, withdraw rather than force-push
```
