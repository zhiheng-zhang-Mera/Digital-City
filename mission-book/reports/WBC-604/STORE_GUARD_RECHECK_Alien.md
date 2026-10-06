# WBC-604 存储修复独立回查 / Independent store-repair recheck

2026-10-06，回查既有WBC-604已发布修复，不开启新系列，不重开原已完成工作簿。本检查不构成合并或部署。 / On 2026-10-06, the published repair for existing WBC-604 was independently checked. No new programme or reopened workbook is introduced; this is not a merge or deployment.

## 精确身份与环境 / Exact identity and environment

- 基线 / Baseline: merged main `b06504f1f96984c960b2661b8ee3a7130796d379`.
- 修复 / Repair: `ad1b3e85918faf4d8ccc9ccda43e8eaaf7dc634c`, branch `repair/WBC-604-mech-profile-persist-first-on-current-main`.
- 独立工作区 / Isolated review checkout: `D:/Utopia-WBC604-Recheck-20261006`; tracked state clean after testing.
- root与city冻结安装均通过 / Frozen installs passed in root and city.

## 独立缺陷对照 / Independent defect comparison

使用独立构造的临时目录，让execution-profile.json成为目录，readiness报告READY；分别直接导入上述两份controller。临时数据清理完毕，未触及在线Mech或Alien成员。 / An independently constructed temporary directory makes execution-profile.json a directory, with READY readiness. Each exact controller was imported directly; temporary data was removed and the online Mech/Alien member was untouched.

```json
{"label":"main-b06504f","store":"DIRECTORY_INSTEAD_OF_FILE","code":"EPERM","liveProfile":"WORKER_POOL"}
{"label":"repair-ad1b3e8","store":"DIRECTORY_INSTEAD_OF_FILE","code":"PROFILE_STORE_UNAVAILABLE","liveProfile":"STANDARD_DEVICES"}
```

基线报错后仍改变live profile；修复产生类型化拒绝并保留STANDARD_DEVICES。源码核对确认先persist(requested)、再赋值profile；未引入新的调度或canonical任务写入路径。 / The baseline changes the live profile despite throwing. The repair gives a typed refusal and retains STANDARD_DEVICES. Source inspection confirms persist(requested) precedes assignment, without a new scheduler or canonical task-write path.

## 定向验证与边界 / Targeted verification and limits

`node --test tests/wbc604-store-failure.test.mjs tests/wbc604-profile-route.test.mjs tests/wbc604-failsafe.test.mjs tests/wbc604-execution-profile.test.mjs`: **19 passed,0 failed**. 正常持久化／重启采用、readiness拒绝、回滚、hybrid顺序和canonical不被重写均在范围内。 / The four targeted suites passed19/19, covering healthy persistence/restart adoption, readiness refusal, rollback, hybrid precedence and unchanged canonical tasks.

没有在本次执行全量suite、实体执行配置切换或部署。route的存储失败路径未在具备READY非默认backend的实体City中测量；不能将bare City的PROFILE_NOT_READY断言写作route的PROFILE_STORE_UNAVAILABLE观测。原工作簿验收与Owner waiver保持不变；修复仍是已验证、待采纳的提案。 / The full suite, physical execution-profile switch and deployment were not run here. The route's store-failure branch was not measured with a READY non-default backend in a physical City; the bare City's PROFILE_NOT_READY assertion is not a route-level PROFILE_STORE_UNAVAILABLE observation. Existing acceptance and Owner waiver remain intact; this is a verified proposal awaiting adoption.
