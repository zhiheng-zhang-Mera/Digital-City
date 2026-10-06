# WBC-604 进度（2026-10-05轮，Mech）

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；历史和未完成项原样保留，代码证据不替代验收。

```text
WORKBOOK     WBC-604 execution profile switch + HYBRID routing
CLAIMED      dc 6280ba8   host Mech (Mech-DS)   branch wbc/WBC-604-mech-execution-profile-switch
BASELINE     1a26d7499d3de39b19c3136c3032e8ccd9343428  (= refs/heads/main; it already contains WBC-603 f3510862 and
             the required ancestor 9f3e20e8, both verified ANCESTOR_OK, so the dependency union needed no constructed merge)
SMOKE        WBC-601/602/603 suites 32/32 at the baseline, run before any product change
```

工作为执行profile切换及HYBRID路由；dc6280ba8由Mech领取。main基线1a26d7499d3de39b19c3136c3032e8ccd9343428已含WBC603及必要祖先，两者ANCESTOR_OK、未构造联合合并；任何产品变更前依赖32/32。

## 本轮完成

```text
services/dev-gateway/execution-profile.mjs   NEW
  createExecutionProfileController({dir, registry, initial})
    state()      -> profile, defaultProfile, every profile's readiness + activatable, how the selection was decided
    change(p)    -> readiness-gated activation with a receipt, or a TYPED refusal (PROFILE_UNKNOWN / PROFILE_NOT_READY)
    rollback()   -> STANDARD_DEVICES, always enterable, needs no schema change
    persistence  -> execution-profile.json written through a temp file + rename; missing, corrupt or UNKNOWN persisted
                    values are NOT obeyed: the controller recovers to STANDARD_DEVICES with the reason recorded
  chooseHybridTarget({task, candidates, poolAvailable})  -> {chosen, rule, reason}
    the seven workbook rules as an ordered precedence: strict target > hard platform/capability requirement >
    trust/readiness > legacy-no-requirements stays default > policy-gated fallback > validation node for
    platform-validation work > load last. Every answer names the rule that decided it.

tests/wbc604-execution-profile.test.mjs   NEW   10 tests, 10 pass
```

新execution-profile.mjs控制器state返回profile／默认／各就绪及可激活／选择原因；change按就绪激活给收据，否则类型PROFILE_UNKNOWN／PROFILE_NOT_READY；rollback始终可进STANDARD_DEVICES，无schema改变。execution-profile.json临时文件＋rename持久化，缺／坏／UNKNOWN值不服从，恢复默认并记原因。chooseHybridTarget按工作书七规则排序：严格目标＞硬平台／能力＞信任／就绪＞无需求旧任务默认＞策略回退＞平台验证的验证节点＞负载最后，每答案命名决定规则。新单测10/10。

## 第二轮完成：运行城市可达控制面

```text
services/dev-gateway/server.mjs
  * the controller is created after the backends are registered, reading readiness through
    executionBackends.forProfile(profile).readiness(); a DORMANT backend reports ABSENT instead of throwing, which is
    what keeps "the pool is not there yet" from becoming a City that will not start;
  * GET  /api/v0/execution-profile  -> the state: live profile, default, every profile's readiness + activatable, and
    how the selection was decided (DEFAULT / PERSISTED / RECOVERED_TO_DEFAULT);
  * POST /api/v0/execution-profile  -> {profile} to change or {action:'ROLLBACK'} to roll back; a refusal answers the
    controller's typed code (PROFILE_NOT_READY / PROFILE_UNKNOWN) with HTTP 409 and CHANGES NOTHING;
  * both routes are owner-only: a member session is refused, because where work runs is an owner-level decision;
  * the City snapshot's executionBackend.profile now reports the LIVE profile instead of the startup value.

tests/wbc604-profile-route.test.mjs   NEW   2 tests (route contract + persisted selection across a restart)
VERIFIED  32 tests / 32 pass across wbc604 (unit + route), wbc601, wbc602, wbc603 and mon901 - no regression from the
          wiring; branch head d5382a799a656dbed03c95da4707aeee19c87d79 pushed, hosted CI in flight.
```

后端注册后创建控制器，通过forProfile.readiness读就绪，DORMANT报ABSENT而非抛，使pool未有不阻城市启动。GET状态含实时profile／默认／各就绪可激活及DEFAULT/PERSISTED/RECOVERED_TO_DEFAULT原因；POST profile切换或action:ROLLBACK，拒绝类型409且无改变。两路由仅Owner，因为工作在哪执行是Owner决定；成员拒绝。City快照现在实时profile非启动值。新路由2测含契约／重启持久选择；WBC604单元路由＋601/602/603＋MON901共32/32无接线回归，头d5382a799a656dbed03c95da4707aeee19c87d79已推，当时托管CI进行中。

## 称完整前仍需完成

```text
1  call chooseHybridTarget from the CLAIM path so the precedence is enforced where work is actually assigned. The
   contract and its ten tests exist, but today the only enabled profile is STANDARD_DEVICES (the pool backend is
   registered DORMANT), so the claim path's current behaviour is already correct and the invocation is only meaningful
   once a pool backend can be enabled - which is exactly what the WORKER_POOL activation this task adds would allow;
2  fail-safe evidence the workbook demands: pool lost mid-flight does not touch canonical task truth; in-flight
   ownership follows the existing lease/recovery; rollback while a task is in flight;
3  exact-head CI on this branch, then the opposite-host Formal Review (another physical host has to attack switch race,
   stale readiness and strict-target-vs-hybrid preference).
```

1 在实际CLAIM分配路径调用chooseHybridTarget；契约及十测已有，当时仅STANDARD_DEVICES enabled、pool DORMANT，所以当前claim行为正确，仅本任务激活pool后调用有意义。
2 pool运行中丢失不碰规范真相、在途归属沿既有租约／恢复、在途rollback的失败安全证据。
3 此分支精确头CI及相反物理主机审核，攻击切换竞争／旧就绪／严格目标与hybrid偏好。

终止标记EXECUTION_PROFILE_SWITCH_COMPAT_ACCEPTED未发布。原历史说明称契约及测试已有但控制面尚不可达，这是“规则实现”和“不提交代码即可切换”之间缺口。此句与上一轮“已可达”并存，译本保留原记录而不擅自裁定或提升状态。

## 第三轮：失败安全及其暴露真实缺陷

```text
DEFECT FOUND BY WRITING THE FAIL-SAFE TESTS (and repaired):
  round 2's controller obeyed a VALID persisted profile without re-checking readiness. A City that had switched to
  WORKER_POOL while the pool was healthy, and then restarted after the pool went away, would have run a profile whose
  backend cannot be activated - and executionBackends.active() throws BACKEND_DORMANT, which the claim path meets as an
  exception. That is exactly the "pool lost" case the workbook lists under Fail-safe / rollback.
  REPAIR: the load path is now readiness-aware. A persisted non-default profile is adopted only when its backend is READY
  right now; otherwise the City runs STANDARD_DEVICES and keeps the request visible
  (selection DEGRADED_TO_DEFAULT, selectedProfile vs profile, degradedFrom, recovery.code PROFILE_NOT_READY with the
  measured state). When the pool is ready again the same persisted selection is simply adopted - no operator action.

EVIDENCE ADDED  tests/wbc604-failsafe.test.mjs (4 tests)
  * persisted-but-unusable profile degrades to the rollback profile, and is adopted once the pool is ready again;
  * a REFUSED change leaves the persisted file and the running profile in agreement (nothing is written);
  * every profile action - switch, rollback, refused switch - leaves canonical task truth byte-identical, and the
    snapshot still reports the live profile;
  * readiness is re-read on every question: a pool that becomes ready is switchable without a restart, and one that
    degrades again is reported not-activatable WITH its reason.

STATE  development COMPLETE on head 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef with exact-head CI green.
REMAINING FOR THE WORKBOOK'S OWN GATE
  1  route chooseHybridTarget through the claim path. Meaningful only once a pool backend can actually be enabled, which
     is what this task's own WORKER_POOL activation would allow; today every claim already takes the compatible default,
     which is what rule 4 requires;
  2  the opposite-host Formal Review (gate 7). Development is by Mech; a different physical host must attack the switch
     race, stale readiness and strict-target-vs-hybrid preference before the marker
     EXECUTION_PROFILE_SWITCH_COMPAT_ACCEPTED can be released.
```

失败安全测试发现并修复第二轮服从有效持久profile却不重查就绪：曾健康WORKER_POOL后丢pool再重启会运行不能激活后端，active抛BACKEND_DORMANT使claim异常，正是工作书pool lost。加载现在重查就绪，非默认仅当前READY才采纳，否则运行STANDARD_DEVICES并保留请求可见：DEGRADED_TO_DEFAULT、selectedProfile/profile、degradedFrom、recovery PROFILE_NOT_READY及实测状态。pool恢复同持久选择自动采纳，不需操作员。

新增四失败安全探针：不可用持久profile降默认、恢复后采纳；拒绝变更不写文件、文件与运行一致；切换／回滚／拒绝均规范真相逐字不变、快照实时；每次问题重读就绪，pool变好不重启即可切、再次降级带原因不可激活。

历史状态声明development COMPLETE于213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef，精确CI绿；同时工作书自身门仍列两个剩余：claim路径接chooseHybridTarget（pool真正enabled才有意义，当时所有claim仍兼容默认，规则4）；相反主机正式审核门7，Mech开发须另一物理主机攻击竞争／旧就绪／目标优先，才可发布标记。这些历史COMPLETE与剩余项均保留，不由译本协调为新结论。

语言配对 / Language pair: [English](../DEVELOPMENT_REPORT.md) · [中文](./DEVELOPMENT_REPORT.md)
