# MON-902 development handoff and opposite-host review request — Mech → Alien

```text
FROM            Mech (COMPUTERNAME MEGA-REP), role Mech-DS, development_host for MON-902
TO              Alien (opposite physical host) — review_host for MON-902, unclaimed
REVIEW TARGET   fd70d00837a8309db718ee56fab7738a8b947530
                branch mon/MON-902-mech-overview-graph (remote tip equals that commit)
PR              zhiheng-zhang-Mera/utopia#27
INDEPENDENCE    the workbook records development_host=Mech, so a reviewer on the Alien host is a different physical
                host, which is what CONSTRUCTION_RULES section 3 requires. This document is NOT a review, and the
                author's own tests are NOT review evidence.
MERGE AUTHORITY false; do not merge this branch on the strength of this document
```

## 1. Head history, and why the head moved

```text
6bb19f3e842774eff98cccf30fb01a8784953f22   first product head; push CI 37290149947 success
5460697cfde5d807f022698a0411b040634a458b   added the browser-rendered UI evidence (tests/web.test.mjs)
                                          PR CI 37290746745 success + linkage 37290746628 success
                                          PUSH CI 37290743026 FAILURE (gateway-web)   <-- see section 2
fd70d00837a8309db718ee56fab7738a8b947530   repairs that failure (data-loaded marker + deterministic wait)
                                          THIS is the review target
```

The workbook previously over-claimed that both runs on `5460697c` were green. That claim has been corrected in place
rather than deleted: the failed push run is part of the record.

## 2. The defect the head move repairs (author's own, preserved)

```text
OBSERVATION   push CI 37290743026 failed on tests/web.test.mjs:49 with
              actual   'CITY MONITOR\n\nLoading from the Gateway...'
              expected /always true of this monitor|whether the owner is needed cannot be told from here/i
REPRODUCTION  the probe waited for `.monitor-panel`, which exists as soon as the page mounts and says "Loading from the
              Gateway...", then immediately read innerText and asserted LOADED-state copy. Under CI load the projection
              fetch had not resolved. The same head's PR run passed, so the failure was load-sensitive.
ROOT CAUSE    a MEASUREMENT DEFECT in the probe, not a rendering bug: the assertion was one step ahead of the product's
              own state, and the panel exposed no machine-readable way to tell "shell" from "projection arrived".
REPAIR        apps/web/monitor-graph.js marks the rendered projection `data-loaded="true"`; app.js marks the loading
              shell `data-loaded="false"` and the error panel `data-loaded="error"`; the probe now waits for
              `.monitor-panel[data-loaded="true"]`. The marker is also what makes the state assertable at all.
REGRESSION    the repaired probe cannot pass while the page is still loading, so the race cannot silently return.
              Local: tests/web.test.mjs 2/2 in two consecutive runs; mon902-monitor-graph + mon902-monitor-panel +
              mon901-observation 33/33.
```

## 3. Latest-main integration still owed (measured, not assumed)

```text
reviewed head           fd70d00837a8309db718ee56fab7738a8b947530
origin/main at hand-off  213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef
behind main              48 commits        ahead of merge-base 32 commits
merge-base               7eb38f1b930dfe6cc13dab0e17dedee467b1254b   (= the accepted MON-901 head)
files BOTH sides touch   apps/web/app.js, apps/web/i18n/en.js, apps/web/i18n/zh-CN.js, apps/web/index.html,
                         services/dev-gateway/server.mjs, package-lock.json, city/package-lock.json
```

A merge of this branch into current main therefore needs a UNION for those seven files, and the union is where the review's
attention is most valuable: `apps/web/app.js` and `index.html` now carry nav entries and page wiring from several
programmes (MON-902's `City monitor`, MON-903's `Decision provenance`, REX-801/802's research pages), so an integration
that keeps only one side would silently delete another programme's surface. The author did NOT rebase the branch: the
review target is the exact head above, and rebasing would invalidate the evidence already recorded for it.

## 4. What to review, in the workbook's own words

The MON-902 completion gate names: real task DAG projection; node/path inspector; risk bubbling; stable/collapsible
layout; desktop plus the current supported Android/Web surface strategy; exact-head runtime/UI evidence; opposite-host
review; PAPER_MATERIAL_INDEX. Suggested attack list (offered so the reviewer can reject it rather than repeat it):

```text
A1  Risk bubbling: construct a city where an ACTIVE risk exists on a non-first node and prove the overview shows it -
    including a cluster that would otherwise hide it. A summary that can hide an active risk is the failure label
    SUMMARY_HIDES_ACTIVE_RISK.
A2  Projection, not truth: prove nothing in the graph path can write a task, and that the route reuses MON-901's
    single-flight projection rather than inventing a second one.
A3  Blind spots: when the observation window is partial, prove the page says so and does not present a complete-looking
    picture (MONITOR_REALITY_DRIFT / WINDOW_INCOMPLETE).
A4  Layout stability: prove an ordinary refresh does not reflow the graph (stable layout is a stated requirement).
A5  The repaired probe: try to make the browser probe pass while the projection has NOT arrived - it should be
    impossible now; if it is possible, the repair is incomplete.
A6  Integration: perform (or simulate) the union of the seven shared files with current main and confirm no other
    programme's surface is lost.
```

## 5. Honest gaps

```text
Android surface      the workbook names "desktop + current supported Android/Web surface strategy": this branch ships a
                     WEB surface (Advanced/Primary nav `City monitor`) and claims NO Android surface. Cross-device
                     monitor acceptance belongs to MON-990.
Hosted CI            the review target's exact-head CI is recorded below and in the workbook; the previous head's red
                     push run is documented above and was NOT hidden.
Physical rendering   the browser evidence is headless Chromium on this host, not a physical handset.
```

## 6. Exact-head CI of the review target (author-measured; the reviewer must re-measure)

```text
push run 37403423102   V0.2 checks   COMPLETED SUCCESS   gateway-web pass (5m24s), android pass (1m24s)
PR #27 check view      reports the same head fd70d00837a8309db718ee56fab7738a8b947530 with both jobs passing
PR #27 mergeable       CONFLICTING - this is the latest-main integration obligation (section 3), not a CI failure
EARLIER HEADS          6bb19f3e... push 37290149947 success
                       5460697c... PR 37290746745 success + linkage 37290746628 success, PUSH 37290743026 FAILURE
                       (the measurement defect in section 2, preserved deliberately)
LOCAL at the target    33/33 for mon902-monitor-graph + mon902-monitor-panel + mon901-observation;
                       tests/web.test.mjs 2/2 in two consecutive runs
```
