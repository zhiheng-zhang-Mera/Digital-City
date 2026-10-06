# CEX-790 基线解析／依赖 SHA 并集解析

> 阅读译本 / Reading translation：只供中文阅读，不是第二份权威工作书／状态。元数据与命令证据保留于代码围栏；历史事实保持原值。

以下为原报告身份／锚点证据：领取者 Mech（COMPUTERNAME MEGA-REP）、角色 Mech-DS；依赖 SHA 在领取时联合。联合从 CEX-705 头出发并合入 CEX-701、702、703、704 头；远端分支尖端等于联合提交。全部五个头对联合的祖先检查均 exit 0。

```text
CLAIMANT            Mech (COMPUTERNAME MEGA-REP), role Mech-DS
ANCHOR MODE         DEPENDENCY_SHA_UNION_AT_CLAIM
UNION BASELINE      5c7d46dcbf1b01259b5edaf574b620714beb40b7
UNION BRANCH        cex/CEX-790-mech-final-audit (remote tip equals that commit)
CONSTRUCTED FROM    de9185a4ef8d761053c88316ec9efeca037239fb  (CEX-705 head, the starting point)
                    + a24c04401308b11548626239e8ca1f9b4276bbdf (CEX-701 head, merged)
                    + 3d233ff39d1e96b8a590b12f520f98c283356f25 (CEX-702 head, merged)
                    + 478d486096512eea3266350efe070323a232a120 (CEX-703 head, merged)
                    + d05f5a455ff535e3e065b30ec9ec74bca2dbb521 (CEX-704 head, merged)
ANCESTRY VERIFIED   git merge-base --is-ancestor exit 0 for all five heads against the union
```

## 1. 为什么必须构造联合，而非仅读取

CEX-790 声明 `baseline_anchor_mode: DEPENDENCY_SHA_UNION_AT_CLAIM`，`dependency_source_workbooks: [CEX-701 … CEX-705]`，记录 `baseline_blocker: DEPENDENCY_ACCEPTED_SHA_NOT_YET_AVAILABLE`。本主机执行的对侧主机评审已释放全部五个依赖标记，因此阻塞原因消失，但联合本身不存在。首次从 705 头执行 octopus 合并，因 MainActivity.kt 内容冲突失败：

```text
first attempt: git merge --no-edit <701> <702> <703> <704>   (octopus, from the 705 head)
  -> ERROR: content conflict in apps/android/.../MainActivity.kt
  -> fatal: merge with strategy octopus failed
```

五项任务并行开发同一批文件：`MainActivity.kt`、`CityClient.kt`、`apps/web/app.js`、两个 i18n 文件、`services/dev-gateway/server.mjs` 均含多项任务新增内容。因此必须**构造并验证**依赖 SHA 联合，不能只是引用它。

## 2. 联合如何构造

按任务升序执行四次顺序合并；每个冲突保留**双方**行为，不选其一。原始逐项冲突／解决记录如下：

```text
merge CEX-701  conflict: MainActivity.kt Settings page
               resolution: keep the CEX-705 CityManagementSettings card AND the CEX-701 DeviceRecoveryPanel card
merge CEX-702  conflicts: apps/web/app.js (x2), i18n/en.js, i18n/zh-CN.js, CityClient.kt (x2), MainActivity.kt
               resolutions: keep the CEX-701 hash-page boot line AND the CEX-702 scheduler context state;
                            keep the CEX-701 recovery focus restore AND the CEX-702 scheduler context reset;
                            keep both Object.assign message blocks with a single export;
                            union the typed-error path list (… || endsWith("/switch-declined"));
                            keep the CEX-705 member functions AND the CEX-702 alternateDevice function;
                            keep the CEX-705 member management state AND the CEX-702 scheduler choice state
merge CEX-703  conflicts: apps/web/app.js, i18n/en.js, i18n/zh-CN.js
               resolutions: keep the CEX-703 credentialContext terminal render AND the CEX-702 busyTasks scheduler
                            render; keep all three Object.assign message blocks with a single export
merge CEX-704  conflicts: CityClient.kt (x2), MainActivity.kt
               resolutions: union the typed-error path list (… || join/requests || pairing/);
                            keep the member/alternate functions AND ownerOnboarding/generateOwnerPairing/decideJoin;
                            keep the member and scheduler state AND the owner onboarding state (ownerCityId, ownerPrefs)
```

中文对应：合并 CEX-701 时 Settings 页保留 CEX-705 CityManagementSettings 与 CEX-701 DeviceRecoveryPanel；合并 CEX-702 时同时保留 701 hash 页启动行、702 调度上下文状态，701 恢复焦点恢复、702 调度上下文重置；保留两组 Object.assign 消息且仅一个 export；联合类型化错误路径（含 `/switch-declined`）；保留 705 成员函数与 702 alternateDevice；保留成员管理状态与调度选择状态。合并 CEX-703 时保留 credentialContext 终端渲染及 busyTasks 调度渲染，三组消息只一个 export。合并 CEX-704 时联合类型化错误路径（含 join/requests、pairing/），保留成员／alternate 函数及 ownerOnboarding／generateOwnerPairing／decideJoin，保留成员／调度状态及 ownerCityId／ownerPrefs。

每次解决后以逐任务符号存在检查验证，因为两个集成草稿编辑冲突块时误删函数；检查发现并恢复。最终全部 `.kt`、`.js`、`.mjs`、`.md` 无冲突标记。

## 3. 联合验证：可工作基线，不只是合并

```text
tests/cex701-recovery-ui.test.mjs      3 / 3 pass
tests/cex702-choice-ui.test.mjs        4 / 4 pass
tests/cex703-catalog-ui.test.mjs       3 / 3 pass
tests/cex704-native-owner.test.mjs     1 / 1 pass
tests/cex705-native-members.test.mjs   1 / 1 pass
join/pairing/enrollment/gateway set  154 / 154 pass
node --check on every changed web module  OK
scripts/check-bilingual.mjs           docs / evidence / data-records all SYNCHRONIZED
:app:testDebugUnitTest :app:assembleDebug  BUILD SUCCESSFUL, 18 suites / 97 tests / 0 failures / 0 errors
```

中文对应：701 测试 3／3，702 4／4，703 3／3，704 1／1，705 1／1 均通过；join／pairing／enrollment／gateway 集合 154／154；每个修改的 Web 模块 node --check OK；双语脚本 docs／evidence／data-records 全 SYNCHRONIZED；Android 单测及 debug 构建 BUILD SUCCESSFUL，18 套件／97 测试／0 失败／0 错误。Android 构建是最强单项检查：Kotlin 冲突手动解决后，联合仍可编译并通过五任务单测联合。

## 4. 本领取依赖的标记

```text
CEX-701  DEVICE_RECOVERY_ENTRY_ACCEPTED                     released by Mech review commit 580652a
CEX-702  ALTERNATE_DEVICE_USER_CHOICE_EXPOSED               released by Mech review commit 1caf830
CEX-703  CAPABILITY_CATALOG_DISCOVERABLE                    released by Mech review commit aa9269f
CEX-704  ANDROID_ONBOARDING_OWNER_ACTIONS_PARITY_ACCEPTED    released by Mech review commit 013a862
CEX-705  ANDROID_MEMBER_DEVICE_MANAGEMENT_PARITY_ACCEPTED    released by Mech review commit bd06369
```

中文对应：701 设备恢复入口、702 替代设备选择、703 能力目录可发现、704 Android Owner 入城动作对等、705 Android 成员设备管理对等，均由表中 Mech 评审提交释放。每个来源工作书 COMPLETE 且 `review_complete: true`；`review_head_sha` 均等于上述合并头，因此联合来自**已评审头**，不是仅开发 CI 通过的开发头。

## 5. 本领取不作何种断言

- 不断言联合会成为 `main`：五项均未合并，无工作书授予合并权威。联合只为 CEX-790 提供合法依赖锚点，并为此发布为分支。
- 不重开五项评审，其发现按记录成立，联合原样继承。尤其 CEX-705 F1（成员投影将离线节点报告为连接）是 `members.mjs` 缺陷，联合带有该缺陷，须在 CEX-790 审计分类。
- 不声称联合已独立评审；那是 CEX-790 自身对侧主机评审职责。

语言配对 / Language pair: [English](../CLAIM_RECORD.md) · [中文](./CLAIM_RECORD.md)
