# MON-902 development handoff and opposite-host review request — Mech → Alien

```text
FROM            Mech (COMPUTERNAME MEGA-REP), role Mech-DS, development_host for MON-902
TO              Alien (opposite physical host) — review_host for MON-902, unclaimed
REVIEW TARGET   3a88e23f91924576178973ef46c620b20ffa2aaf
                branch mon/MON-902-mech-overview-graph (remote tip equals that commit)
PR              zhiheng-zhang-Mera/utopia#27
INDEPENDENCE    the workbook records development_host=Mech, so a reviewer on the Alien host is a different physical
                host, which is what CONSTRUCTION_RULES section 3 requires. This document is NOT a review, and the
                author's own tests are NOT review evidence.
MERGE AUTHORITY false; do not merge this branch on the strength of this document
```

## 0. Read this first: the target is now integration-clean

The head moved a THIRD time, and for a good reason: the two earlier heads could not be merged into main without a
conflict, which would have made the review turn into an integration exercise. `origin/main` was therefore merged into the
branch and the five conflicting surfaces were resolved as **unions** — every programme's nav entry, locale keys and
routes kept on both sides. Section 3 records the method and the verification. The branch's diff against main is now
exactly MON-902's work (13 files, +1220/-3), so a reviewer reads MON-902 and nothing else.

```text
head history
6bb19f3e842774eff98cccf30fb01a8784953f22   first product head                       push 37290149947 success
5460697cfde5d807f022698a0411b040634a458b   + browser UI evidence                    PR 37290746745 success
                                                                                    PUSH 37290743026 FAILURE (section 2)
fd70d00837a8309db718ee56fab7738a8b947530   flake repair (section 2)                 push 37403423102 SUCCESS
3a88e23f91924576178973ef46c620b20ffa2aaf   latest-main integration (section 3)      THIS IS THE REVIEW TARGET
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

## 3. Latest-main integration, PERFORMED (was: owed)

```text
integration commit      3a88e23f91924576178973ef46c620b20ffa2aaf   (a MERGE commit, so fd70d008 keeps its recorded CI)
origin/main merged      213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef
before                  48 commits behind, 5 files conflicting, PR #27 mergeable=CONFLICTING
after                   diff vs main = 13 files, +1220/-3 (MON-902's work only)
CONFLICT RESOLUTIONS (all unions, never one side)
  apps/web/index.html        MON-902's `City monitor` button kept beside every other programme's nav entry
  apps/web/i18n/en.js        MON-902's 89 monitor keys appended; both packs now hold 527 keys with zero duplicates
  apps/web/i18n/zh-CN.js     and zero parity gap between them
  apps/web/app.js            monitor import, state, loadMonitor/renderMonitor, the Monitor page dispatch, the go()
                             reset and the three monitor click handlers re-applied onto main's wiring
  services/dev-gateway/*.mjs monitor-graph import + route re-applied onto main's routes
  package-lock.json (both)   merged automatically (MON-902 added no dependency)
VERIFICATION AFTER THE UNION
  62 tests pass   Mon902 graph + panel, MON-901 observation, REX-801 manifest, REX-802 gateway + trace,
                  WBC-604 profile route + fail-safe
  2/2 browser     tests/web.test.mjs in a real Chromium
  surface check   all twelve nav pages present (including Monitor, Research, ResearchTrace) and the monitor,
                  research-experiment, execution-profile and trace routes present in server.mjs
INSTRUMENT NOTE   the first attempt at the locale union used a PowerShell Get-Content/Set-Content round trip, which on
                  this host (Windows PowerShell 5.1, non-UTF-8 console codepage) corrupted the Chinese pack; the file was
                  restored from git and the union redone with a Node helper. Recorded rather than hidden: it is the same
                  instrument class the mission-book warns about for non-ASCII files.
```

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
push run 37404641090   V0.2 checks          COMPLETED SUCCESS
pull run 37404644103   V0.2 checks          COMPLETED SUCCESS
linkage  37404644095   City linkage check   COMPLETED SUCCESS
                       all three matched on headSha 3a88e23f91924576178973ef46c620b20ffa2aaf
PR #27                 mergeable should now read MERGEABLE (it read CONFLICTING before the integration in section 3)
EARLIER HEADS          6bb19f3e... push 37290149947 success
                       5460697c... PR 37290746745 success + linkage 37290746628 success, PUSH 37290743026 FAILURE
                       (the measurement defect in section 2, preserved deliberately)
                       fd70d008... push 37403423102 success (flake repair)
LOCAL at the target    62 tests across MON-902 + MON-901 + REX-801 + REX-802 + WBC-604 suites; browser 2/2
```

语言配对 / Language pair: [English](./DEVELOPMENT_HANDOFF.md) · [中文](./zh-CN/DEVELOPMENT_HANDOFF.md)
