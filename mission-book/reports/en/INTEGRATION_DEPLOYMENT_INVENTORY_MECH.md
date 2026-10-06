> Reading translation / 阅读译本. Full historical English reading, not a new verdict, claim or authority record. Original evidence blocks remain literal and the canonical source governs recorded status.

[Canonical source](../INTEGRATION_DEPLOYMENT_INVENTORY_MECH.md)

# Integration Deployment Inventory: Accepted Products Not Yet on Main

2026-10-06, Mech-DS (`MEGA-REP`). Every number was measured on main `b06504f`. Once main moves, this inventory becomes stale and must be remeasured.

## Why this inventory exists

Acceptance semantics are explicit: COMPLETE means Development, opposite-host Review and exact-head CI; it does not mean merged into main. Previously, no record identified which accepted products remained outside main or the cost of deploying them. The entire MON programme's absence from main was discovered through an incidental integration measurement, rather than an inventory.

## Measurements on b06504f

| Accepted product | In main | Merge shape | Decision responsibility |
|---|:---:|---|---|
| CEX-790 `a24c044` | Yes | Already merged: PR #33 is `b06504f` itself | Deployed |
| JOIN-590 `322162e` | Yes | Already merged, including manual union `1a26d74` | Deployed |
| WBC-601…604 | Yes | All four `wbc/*` branches are ancestors of main | Deployed |
| MON-990 `fb042d9`, containing MON-901/902/903 | No | One merge covers the entire series: 95 files, +14670/−26, 0 files deleted, purely additive; 1 union conflict in Android typed-refusal paths | Owner merge window |
| REX-803 `8798ba9` plus REX-804 `fe700ab` | No | Individually clean; together, 2 union conflicts at the `server.mjs` construction point and return | Owner merge window |
| REX-805 candidate `4b39468`, not yet accepted | No | Fast-forward relative to main, which is its ancestor; adding it to 803+804 creates 1 further union conflict | Acceptance first, then merge window |

Raw `diff main..head` reports larger deletion counts: MON 4429 and REX-803 6. These are later main changes absent from old baselines, not what merging removes. Use measured merge results: the MON merge deletes 0 files.

## Integration measurements already completed

```text
MON          integration/MON-accepted-head-mech-preflight @ 40be3e1
             定向 mon9* 80/80（10 套件）· 全量 1431/1434（3 项 host-city-launcher）· 跑后 CLEAN
             reviewer 自己的 13 个探针在合并结果上 13/13 · Android 构建+单测 118/118（22 套件）
REX 803+804  integration/REX-accepted-heads-mech-preflight @ 704c518
             定向 48/48（13 套件）· 全量 1404/1407
REX 3 家并集  integration/REX-805-candidate-mech-preflight @ 0d8bdce
             定向 67/67（17 套件）· 全量 1423/1426 · 跑后 CLEAN（含已发布的 REX-804 证据修复）
```

In English, MON preflight `integration/MON-accepted-head-mech-preflight @ 40be3e1` passed focused mon9* 80/80 across 10 suites; full suite 1431/1434 with 3 host-city-launcher failures, clean afterward. The reviewer's own 13 probes passed 13/13 on the merge result, and Android build/unit tests passed 118/118 across 22 suites.

REX 803+804 preflight `integration/REX-accepted-heads-mech-preflight @ 704c518` passed focused 48/48 across 13 suites; full suite 1404/1407. Three-way REX union `integration/REX-805-candidate-mech-preflight @ 0d8bdce` passed focused 67/67 across 17 suites; full suite 1423/1426, clean afterward, including the published REX-804 evidence repair.

## Rule stated by this inventory

**COMPLETE is an acceptance status, not deployment status.** Every integration must start from the then-latest main and be remeasured. Run the programme's suites and the reviewer's own probes on the merge result, and verify that product code edited during integration still builds and passes tests.

## Decisions outside this host's authority

Three items await Owner or the record holder:

```text
1  MON 合并窗口是否开启（整条系列，代价已测清：一次合并、一处并集、零删除）
2  REX 合并窗口是否开启（须先等 REX-805 被验收；三家并集已预备好）
3  两处待采纳的修复提案：REX-804 证据写入修复、relay 限流探针修复
```

1. Whether to open the MON merge window for the entire series. Cost measured: one merge, one union conflict, zero deletions.
2. Whether to open the REX merge window. REX-805 must first be accepted; the three-way union is prepared.
3. Adoption of the repair proposals listed below. Their "where it stands" was measured **by content** on 2026-10-06, not inferred from SHA ancestry.

## Where the pending repairs actually stand

```text
ADOPTED   the two store-guard instances (research registry, capability-bridge theme artifacts)
          main's CEX-790 integration commit 65f86f9 implements this host's own pattern by content
          (degrade at construction + storeState/storeReason + guard tests), so an ancestry check finds nothing.
          Re-measured evidence: reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md

READY NOW repair/mech-relay-rate-probe-burst @ 14499ad
          parent = b06504f (current main) => exactly one commit on top of main; adoption is a fast-forward.
          Changes only tests/relay-s1-tunnel.test.mjs: the sequential 30-request loop becomes 30 concurrent writes
          that fill the pipe, and the 429 assertion now reports the measured send span. The old shape was a
          host-speed assertion in disguise that reported a working limiter as a product defect under load.

RIDES ALONG repair/REX-804-mech-test-evidence-outside-repo @ 690d723
          parent = fe700ab (the accepted but UNMERGED REX-804 head), so the branch is 10 commits ahead of main and
          cannot be adopted alone. The part to adopt is its single hunk (the screenshot moves from the committed
          evidence path to .runtime/), and it should enter main together with the REX-804 branch.
          Correction (measured 2026-10-06): it no longer waits on adc075e - the accepted head fe700ab already
          carries the fault-store guard, and a stricter one (degrade at construction plus a typed 503
          FAULT_STORE_UNAVAILABLE refusal to start a fault). Evidence:
          reports/REX-PROGRAMME/fault-store-start-check.mjs and store-shape-sweep-v3.mjs

OPEN, REBASE FIRST repair/WBC-604-mech-profile-persist-first @ 1f2f08c (F-3 profile half-switch)
          parent = 213f9f9, cut before the CEX-790 integration; adopting it as-is would delete that integration's
          tests, so it must be rebased onto current main.

OPEN, READY repair/mech-city-store-diagnostic-on-current-main @ be3670b (F-1 typed diagnostic)
          parent = b06504f => one commit on top of current main; its guard probes pass 3/3 at that tip.
```

This inventory changes no workbook fields and merges nothing.
