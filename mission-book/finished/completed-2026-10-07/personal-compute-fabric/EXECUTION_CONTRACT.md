# PCF 共用施工、复核与证据合同

[English](en/EXECUTION_CONTRACT.md)

本文件是每本 PCF 的必读补充，不替代 [全局规则](../../CONSTRUCTION_RULES.md)、[异步协议](../../ASYNC_RELIEF_CONSTRUCTION.md)、[过程数据](../../PROCESS_DATA_POLICY.md) 或 [Capability Registry](../../../capability-registry/README.md)。冲突按全局 authority hierarchy 处理。

## 所有工作书共同步骤

- [ ] 激活门通过后读取最新任务 frontmatter，确认未被领取；解析依赖 accepted full SHA，合并到不缺依赖的 exact baseline，原子写入 claim；parked 时禁止做这一步。
- [ ] 核对 PCF-700 的文件/接口 ownership map；声明新增、修改、测试文件和 component/product completion boundary。
- [ ] 先写本书列出的失败场景测试，运行 `node --test tests/pcfNNN-*.test.mjs`，保存可解释的红跑；不能以缺 SDK/缺账号的报错误充行为反例。
- [ ] 实现本书约定接口的最小正确版本；复杂子步骤逐个 red→green，不跨任务偷偷扩展 authority。
- [ ] 重跑本书测试与受影响既有 tests；使用当时 package.json 的全套测试和 docs checks；声明未运行项，不制造预期 PASS。
- [ ] 由另一实体主机独立构造反例、运行 exact-head 验证并修复范围内缺陷；CI 也必须绑定同一 exact head。
- [ ] 以本书声明的范围填写 Development/Review 两个完成状态，记录遗留真实 seam。组件验收不能发布用户路径或整体 programme 成功标记。
- [ ] 复核 CAP registry 与 UI/后端现实；更新 bounded reports，依赖同步在前、进度同步在后；重新扫描可领取任务。

`NNN` 替换为本书数字；命令在 Utopia 根目录执行。未来 Android/Linux 的额外测试由相应书明确要求。无测试环境不是成功。

## 双机异步与共享文件

不预分配 Alien/Mech：claim-time 按资格和真实占用领取；本任务 Development 与 Formal Review 不同实体主机。一个物理主机中的多个进程/VM/容器不能伪装成独立主机。

CI、外部权限或长测试等待不占整机；用独立 worktree 做其它合格任务。TEMPORARILY_UNCLAIMABLE 优先事件唤醒，约 20 分钟兜底；STRUCTURALLY_INELIGIBLE 和稳定外部缺硬件不无意义轮询。不得通过造任务来填空闲。

每本书只修改自己的模块；公共 `services/dev-gateway/server.mjs`、Store、Task/Action contract、Web/Android shell 属于 serial integration seam。先提交 adapter 和测试，再由受授权的接线阶段顺序整合；不能两个 worker 各造一个新的 scheduler/registry。共享契约变更必须有 consumer impact 表。

## 组件依赖与用户验收不能互锁

合同/库任务的 accepted head 只证明其明确的 component scope；允许按全局 §10 对真实外部 seam 分离验收。必须写清待接线负责人和验收编号，不把 disabled/NOT_RUN 填成 PASS。

用户能力 release 必须走：可发现入口 → canonical request → 接受/拒绝 → 进度/错误/结果 → UI reconcile。PCF-715 负责公共 UI 宿主，714 负责发起端连续性，790 负责最终组合证明。若现行模板要求本任务的用户 exposure 在 Development 前完成，则激活时将该工作拆为独立 primitive 与 product-wiring 单元并修正 DAG，不能用本条豁免全局 gate。

计划中的 CAP-PCF-* 只是预留映射：激活时查重、识别应更新的既有 CAP；先登记 candidate，再由真实 evidence 提升。计划提交不触碰 verified inventory。

## 证据落点

Utopia：`docs/{zh-CN,en}/pcf/`、`evidence/{zh-CN,en}/pcf/`、`data-records/{zh-CN,en}/pcf/`；高频 raw 进入 git-ignored runtime/artifact storage，不能推满仓库。

City：`mission-book/reports/PCF-NNN/{zh-CN,en}/` 仅保存 bounded Development/Review/Failure/Closeout 摘要、exact SHA、CI/run/artifact 引用和原始材料的 digest/location/retention。敏感内容不直接提交公开仓库；脱敏摘要也记录规则。

必须记录：功能真实输入输出、失败/超时/取消、stale/unknown、重试与恢复、资源竞争、授权拒绝、Owner intervention、rule conflict、身份/状态漂移、测试构造不足、异机复核反例。未知指标保持 null 并给 measurementStatus；失败样本不得丢弃。

## 版本与收口

每书 `spec_revision` 单调递增。已领取任务的基线与验收边界不被后台修改；新增目标进入 revision proposal 或新 child workbook。没有 merge 授权的组件不能合入 main；最终整合从届时最新 main 建立，保留其它已接受工作，合并前刷新，合并后复核 merged-main CI。

English mirrors are read-only documentation without frontmatter. Dynamic state lives only in the canonical root workbook, avoiding duplicate workbook IDs and doubled statistics.

## Revision2 transferred prerequisites and live acceptance

Read [migration history](MIGRATION_HISTORY.md) before executing any revised workbook.725/726 are foundation components;727 is the connector-backed engineering adapter;728 is the caller/session bridge. Parent relationships do not add dependency edges or inherit authority. Existing contracts and domain ownership must be reused.

The product chain is accepted only with real two-physical-host execution evidence and return consumption by the originating agent. Keep component, live-provider, user-surface and originating-session gates separate. Unsupported or missing stages remain NOT_RUN/UNSUPPORTED, never PASS. New scope is still PARKED with null anchors; no current active or completed workbook is reopened.
