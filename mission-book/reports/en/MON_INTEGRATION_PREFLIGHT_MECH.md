> Reading translation / 阅读译本. Full historical English reading, not a new verdict, claim or authority record. Original evidence blocks remain literal and the canonical source governs recorded status.

[Canonical source](../MON_INTEGRATION_PREFLIGHT_MECH.md)

# MON Integration Preflight: An Entire Accepted City Work Monitor Programme Is Absent from Main

2026-10-06, Mech-DS (`MEGA-REP`). This is a measurement, not a merge into main.

## Discovery

The main board shows City Work Monitor as 4/4 complete and 4/4 reviewed, but its product is absent from main:

```text
services/dev-gateway/monitor-graph.mjs     缺 / absent
services/dev-gateway/monitor.mjs           缺 / absent
apps/web/monitor-graph.js / monitor-decisions.js   缺 / absent
main 上不存在 monitor/graph 路由（构建自 main 的 City 对它是 404）
只有 MON-901 的 observation sidecar 通过 480ee1c 进过 main
```

In English: `services/dev-gateway/monitor-graph.mjs`, `monitor.mjs`, `apps/web/monitor-graph.js` and `monitor-decisions.js` are missing. Main has no monitor/graph route, so a City built from main returns 404. Only MON-901's observation sidecar entered main through `480ee1c`.

This matches the programme's own semantics, where COMPLETE does not mean merged. However, no record stated the gap between board numbers and deployment reality, while Owner's priority ruling places MON next:

```text
CEX-790 工作书 owner_priority_override_2026_10_06:
  "CEX-790 merge-readiness first, then MON directly; supersedes REX-before-MON. SHOW excluded."
CEX-790 已并入 main（PR #33，b06504f）。MON 尚未。
```

CEX-790 already entered main through PR #33, `b06504f`. MON has not.

## Measurement

Starting from then-latest main `b06504f`, merge MON-990's accepted head `fb042d9`. It already includes MON-902 `f498824`, MON-903 `3cd32c6` and MON-901 `7eb38f1`, so one merge covers the entire series:

```text
main 是否是它的祖先 / is main an ancestor   False（落后 31 个提交）
raw diff main..head                        111 files, 4429 deletions  <- 是 main 后来新增的工作不在旧 baseline 上，
                                           不是这次合并会删掉的东西
实际合并 / the merge itself                 95 files changed, +14670 / -26, **0 files deleted**
冲突 / conflicts                           1 处，apps/android/.../CityClient.kt
```

Main is not its ancestor; the accepted head is 31 commits behind. Raw diff shows 111 files and 4429 deleted lines, representing later main work missing from the old baseline. Actual merge: 95 files changed, +14670/−26, 0 files deleted, one conflict in Android `CityClient.kt`.

The 4429-line deletion count is easy to misread: it measures what the head lacks relative to main, not what the merge removes. The merge deletes no files and is purely additive integration.

## Conflict shape and resolution

```text
CityClient.kt 的打字化拒绝路径集合 / the widened typed-refusal path set
  main（HEAD）  capabilities/ · capability-invocations/ · research/trace · /switch-declined ·
                device/installations · members/messages · join/requests · pairing/ · node/sharing · city/name
  MON 侧        monitor + capabilities/ · capability-invocations/ · research/trace · /switch-declined ·
                device/installations
  UNION         两侧全部保留（11 项，逐项核对）——只取 MON 侧会静默丢掉 main 在 MON baseline 之后
                新增的 CEX-702 / CEX-705 / JOIN 拒绝路径
```

The conflict is the widened typed-refusal path set in `CityClient.kt`. Main has capabilities/, capability-invocations/, research/trace, /switch-declined, device/installations, members/messages, join/requests, pairing/, node/sharing and city/name. MON adds monitor alongside capabilities/, capability-invocations/, research/trace, /switch-declined and device/installations. The union retains both sides: 11 items, checked individually. Keeping MON alone silently drops CEX-702/CEX-705/JOIN refusal paths added after MON's baseline.

This is the construction-rule failure pattern: integrating from stale main then overwriting or omitting another accepted line of work. The line's own UNION comment shows its author also knew both sides had to remain.

## Reviewer's own probes rerun on the merge result

The programme's suites passing does not prove reviewed behavior survived integration. That is why reviewer probes exist. This host reran its independently created MON-990 review probes on the merge result:

```text
tests/mon990-review-mech.test.mjs（11 个检查，真实路由 + 真实浏览器 + 投影契约）
tests/mon990-cross-surface.test.mjs
  在 integration/MON-accepted-head-mech-preflight @ 40be3e1 上        13 pass / 0 fail
```

`tests/mon990-review-mech.test.mjs` has 11 checks covering real routes, a real browser and projection contracts. Together with `tests/mon990-cross-surface.test.mjs`, 13 passed, 0 failed on `integration/MON-accepted-head-mech-preflight @ 40be3e1`.

Thus behavior established in Review still holds on main+MON, beyond the author's own tests remaining green.

**Editing product code in the union requires product-code verification.** The union changed Android `CityClient.kt`, so Android build and unit tests on the merge result cannot be skipped:

```text
JAVA_HOME=<Temurin 17.0.18> gradlew :app:testDebugUnitTest :app:assembleDebug
  => BUILD SUCCESSFUL in 54s；22 个套件 / 118 项 / 0 失败 0 错误；APK 构建成功
```

Build succeeded in 54 seconds; 22 suites, 118 tests, 0 failures/errors; APK built. The edited Kotlin line compiles and all Android unit tests pass. The integration party must prove product code it edited still builds and passes.

## Result

Branch `integration/MON-accepted-head-mech-preflight @ 40be3e1`:

```text
focused   tests/mon9*.test.mjs（10 个套件，含 mon902/mon903/mon990 与 mon901）   80 pass / 0 fail
full      pnpm test                                                            1431 pass / 3 fail / 1434
          3 项均为 tests/host-city-launcher.test.mjs（本机常驻 City 占用 host reservation），跑后 CLEAN
```

Focused mon9* tests: 10 suites including mon902/903/990/901, 80 pass, 0 fail. Full `pnpm test`: 1431 pass, 3 fail, total 1434. All three failures are `tests/host-city-launcher.test.mjs`, caused by resident City occupying the host reservation. Clean after running.

## Boundaries and decision outside this host's authority

- **Not merged into main.** This host has no MON merge authority. A single merge of the entire series requires Owner/the merge window. Once decided, deployment is mechanical: one union, other changes merge automatically, purely additive, no deletions.
- **No workbook fields changed.** The series is already COMPLETE/accepted.
- **Question recorded for Owner, not decided unilaterally:** the ruling says “then MON directly,” but MON remains absent and that gap was previously unrecorded. Owner decides whether to open the merge window now. This report measures its cost: one merge, one union, focused 80/80.
