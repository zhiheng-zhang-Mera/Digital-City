# MON-902 开发交接及对侧主机评审请求 — Mech → Alien

> 阅读译本 / Reading translation：只供阅读，不是第二份权威工作书／状态。历史与未知边界保留，原证据块代码围栏保留，不新增验收。

Mech MEGA-REP/Mech-DS为dev，Alien对侧review未领取；精确target、remote tip/PR27。不同physical满足Rules3。本文件非review，author tests非review evidence；merge authority false，不能据此merge。

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

## 0. 先读：目标现集成干净

head第三次移动有原因：两早头main冲突，会把review变integration。因此merge origin/main，五conflicting surface以联合解，所有programme nav/locale/routes双保。§3记方法验证。对main diff恰902工作13files+1220/-3，review只看902。

```text
head history
6bb19f3e842774eff98cccf30fb01a8784953f22   first product head                       push 37290149947 success
5460697cfde5d807f022698a0411b040634a458b   + browser UI evidence                    PR 37290746745 success
                                                                                    PUSH 37290743026 FAILURE (section 2)
fd70d00837a8309db718ee56fab7738a8b947530   flake repair (section 2)                 push 37403423102 SUCCESS
3a88e23f91924576178973ef46c620b20ffa2aaf   latest-main integration (section 3)      THIS IS THE REVIEW TARGET
```

完整history中文：初6bb19f3e842774eff98cccf30fb01a8784953f22 push37290149947 success；5460697cfde5d807f022698a0411b040634a458b加browser evidence，PR37290746745 success但PUSH37290743026 FAILURE；fd70d00837a8309db718ee56fab7738a8b947530修probe，push37403423102成功；3a88e23f91924576178973ef46c620b20ffa2aaf latest-main集成为review target。workbook曾overclaim5460697双green，原地改非删，fail保。

## 2. head移动修的作者自身缺陷（保留）

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

完整中文对应push CI在web.test49，实际CITY MONITOR/Loading，期待loaded copy。probe等monitor-panel mount即存在，立即innerText断loaded，CI load fetch未resolve，同头PR过所以load-sensitive。根因测量缺陷非render：断言领先product own state，panel无machine-readable shell/projection。修graph projection data-loaded true、app loading false/error panel error，probe等true；marker也让state可assert。修probe loading不能pass，防race；local web2/2两连，graph/panel/observation33/33。

## 3. latest-main集成已执行（此前欠）

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

完整中文对应merge commit3a88e23...保fd70d008原CI；main213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef；前落后48commit/5conflict/PR CONFLICTING，后13files+1220/-3仅902。index保City monitor与全nav；en/zh追加89key，两pack527、零duplicate/parity；app monitor import/state/load/render/dispatch/go reset/三click handler重施main；server graph import/route重施；双方package-lock自动（无新dependency）。union后62 MON902/901/REX801/802/WBC604 tests、realChromium web2/2；12nav含Monitor/Research/ResearchTrace、monitor/research-experiment/execution-profile/trace routes全在。仪器首locale联合PowerShell5.1非UTF8 Get/Set roundtrip损Chinese pack，git恢复Node重做；记录同mission非ASCII警告类，不隐藏。

## 4. 按工作书审什么

gate真实DAG、node/path inspector、risk bubbling、stable/collapsible、desktop+current Android/Web策略、exact runtime/UI、opposite review、材料。建议攻击让reviewer可拒非照重复：

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

完整中文A1非first node ACTIVE/可能cluster risk可见，防SUMMARY_HIDES_ACTIVE_RISK；A2 graph不写task且复901 single-flight非第二；A3 partial明确非完整图防drift/window incomplete；A4普通refresh不reflow；A5未projection时修probe不可pass，否则修不全；A6 perform/simulate七shared files当前main union、不失他surface。

## 5. 诚实缺口

```text
Android surface      the workbook names "desktop + current supported Android/Web surface strategy": this branch ships a
                     WEB surface (Advanced/Primary nav `City monitor`) and claims NO Android surface. Cross-device
                     monitor acceptance belongs to MON-990.
Hosted CI            the review target's exact-head CI is recorded below and in the workbook; the previous head's red
                     push run is documented above and was NOT hidden.
Physical rendering   the browser evidence is headless Chromium on this host, not a physical handset.
```

中文Android策略本branch只Web Advanced/Primary City monitor，无Android；cross-device990。CI目标精确如下、早红未隐藏；physical rendering仅headlessChromium非phone。

## 6. target精确CI（作者测，review必须重测）

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

中文三37404641090/37404644103/37404644095 SUCCESS精确3a88e23f91924576178973ef46c620b20ffa2aaf，PR27应MERGEABLE而非前CONFLICTING。早head6bb push成功、546 PR/link成功但push失败（§2测量缺陷保），fd70修后push成功。target local62跨suite、browser2/2。

语言配对 / Language pair: [English](../DEVELOPMENT_HANDOFF.md) · [中文](./DEVELOPMENT_HANDOFF.md)
