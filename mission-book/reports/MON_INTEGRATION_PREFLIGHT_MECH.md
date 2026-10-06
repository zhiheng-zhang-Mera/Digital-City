# MON 集成前置测量：整条 City Work Monitor 尚未进入 main / MON integration preflight: a whole accepted programme is absent from main

2026-10-06，Mech-DS（`MEGA-REP`）。这是一次**测量**，不是向 main 的合并。 / A measurement, not a merge.

## 发现 / What was found

City Work Monitor 在主任务板上是 **4/4 完成、4/4 已复检**，但它的产品**不在 main 上**： / The programme reads 4/4 complete and 4/4 reviewed on the main board, but its product is not in main:

```text
services/dev-gateway/monitor-graph.mjs     缺 / absent
services/dev-gateway/monitor.mjs           缺 / absent
apps/web/monitor-graph.js / monitor-decisions.js   缺 / absent
main 上不存在 monitor/graph 路由（构建自 main 的 City 对它是 404）
只有 MON-901 的 observation sidecar 通过 480ee1c 进过 main
```

这与该系列工作书自己的状态语义是一致的（`COMPLETE` 不等于已合入 main），但**部署现实与板面数字之间的落差没有被任何记录写下来**，而 Owner 的优先级裁定恰好把 MON 排在下一个： / This is consistent with the programme's own status semantics, but the gap between the board's numbers and the deployed reality was not recorded anywhere - and the Owner's priority override puts MON next:

```text
CEX-790 工作书 owner_priority_override_2026_10_06:
  "CEX-790 merge-readiness first, then MON directly; supersedes REX-before-MON. SHOW excluded."
CEX-790 已并入 main（PR #33，b06504f）。MON 尚未。
```

## 测量 / The measurement

从当时最新 main `b06504f` 出发，合并 MON-990 的已接受头 `fb042d9`——它已经包含 MON-902 `f498824`、MON-903 `3cd32c6` 与 MON-901 `7eb38f1`，因此**一次合并覆盖整条系列**： / From the then-latest main, merging MON-990's accepted head, which already contains the other three:

```text
main 是否是它的祖先 / is main an ancestor   False（落后 31 个提交）
raw diff main..head                        111 files, 4429 deletions  <- 是 main 后来新增的工作不在旧 baseline 上，
                                           不是这次合并会删掉的东西
实际合并 / the merge itself                 95 files changed, +14670 / -26, **0 files deleted**
冲突 / conflicts                           1 处，apps/android/.../CityClient.kt
```

那 4 429 行删除是最容易被误读的数字：它看的是「head 相对 main 缺什么」，而不是「合并会移除什么」。合并结果里**没有任何文件被删除**，是纯增量集成。 / The 4 429 deletions are the number most easily misread: they measure what the head lacks relative to main, not what the merge removes. The merge deletes nothing.

## 冲突的形状与解法 / The one conflict

```text
CityClient.kt 的打字化拒绝路径集合 / the widened typed-refusal path set
  main（HEAD）  capabilities/ · capability-invocations/ · research/trace · /switch-declined ·
                device/installations · members/messages · join/requests · pairing/ · node/sharing · city/name
  MON 侧        monitor + capabilities/ · capability-invocations/ · research/trace · /switch-declined ·
                device/installations
  UNION         两侧全部保留（11 项，逐项核对）——只取 MON 侧会静默丢掉 main 在 MON baseline 之后
                新增的 CEX-702 / CEX-705 / JOIN 拒绝路径
```

这正是施工规则点名的失效形状：「merge/integration 基于旧 main 施工，最终覆盖或遗漏另一条已接受工作」。该行自己的注释就写着 UNION，说明作者也知道这里必须是并集。 / Keeping only the incoming side would silently drop the CEX and JOIN paths main gained later - the failure the construction rules name.

## 在合并结果上复跑 reviewer 自己的探针 / The reviewer's own probes, re-run on the merge result

程序自己的套件跑绿不等于「被复检过的行为在合并后仍然成立」——那正是 reviewer 探针存在的理由。因此把 MON-990 复检时本机**自己制造**的探针拿到合并结果上跑： / A programme's own suites passing does not show that the behaviour the review verified survived the merge, which is what the reviewer's probes exist for:

```text
tests/mon990-review-mech.test.mjs（11 个检查，真实路由 + 真实浏览器 + 投影契约）
tests/mon990-cross-surface.test.mjs
  在 integration/MON-accepted-head-mech-preflight @ 40be3e1 上        13 pass / 0 fail
```

即：**复检时验证过的行为，在 main+MÓN 的合并结果上依然成立**，而不只是「程序自己的测试还是绿的」。 / The behaviour the review verified still holds on the main+MON merge result, not merely "the author's tests are still green".

**并集改了产品代码，就必须验证产品代码。** 上面那处并集动的是 `CityClient.kt`（Android 侧），所以合并结果上的 Android 构建与单测不能跳过——见下。 / The union edited product code, so product code must be verified:

```text
JAVA_HOME=<Temurin 17.0.18> gradlew :app:testDebugUnitTest :app:assembleDebug
  => BUILD SUCCESSFUL in 54s；22 个套件 / 118 项 / 0 失败 0 错误；APK 构建成功
```

即并集里我改动的那行 Kotlin 编译通过、Android 侧全部单测通过——**集成方改过的产品代码，由集成方自己证明它仍然构建、仍然通过测试**。 / The line the union edited compiles and every Android unit test passes: whoever edits product code during an integration owes the proof that it still builds and still passes.

## 结果 / Result

分支 / branch `integration/MON-accepted-head-mech-preflight` @ `40be3e1`：

```text
focused   tests/mon9*.test.mjs（10 个套件，含 mon902/mon903/mon990 与 mon901）   80 pass / 0 fail
full      pnpm test                                                            1431 pass / 3 fail / 1434
          3 项均为 tests/host-city-launcher.test.mjs（本机常驻 City 占用 host reservation），跑后 CLEAN
```

## 边界与待决 / Boundary and the decision that is not mine

- **没有合并进 main。** 本机没有 MON 的合并授权；把整条系列一次性并入是 Owner/合并窗口的决定。这份测量的价值在于：那个决定一旦做出，落地是机械的——**一处并集，其余自动合并，纯增量，无删除**。
- **没有改动任何工作书字段。** 系列状态本来就是 COMPLETE / accepted。
- **给 Owner 的问题（记录而不擅自决定）：** Owner 的裁定写「then MON directly」，而 MON 至今未进 main，且此前无人记录这一落差。是否现在开启 MON 合并窗口，是 Owner 决定；本记录把代价测清楚了：一次合并、一处并集、定向 80/80。

语言配对 / Language pair: [Full English reading](./en/MON_INTEGRATION_PREFLIGHT_MECH.md)
