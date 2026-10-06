# REX-805 实体开发门槛交接 / Physical development-gate handoff

2026-10-06，Alien。候选 / Candidate: `4b3946868d4083285da8a8d99eac2642890b37c4`, [PR38](https://github.com/zhiheng-zhang-Mera/utopia/pull/38).

## 状态与权限 / State and authority

开发代码及六项独立评审修复已交付，精确版本 CI 全部成功；实体完成门槛仍为 **NOT_RUN**，因此 `development_complete=false` 保留。这份文件是开发门槛的执行交接，**不是开发完成声明，也不是正式复检领取或验收**。Mech 的复检就绪测量和合成回执仪器证明保留其原有边界。

Implementation and six independently reviewed repairs are delivered, with successful exact-head CI. The physical completion gate remains **NOT_RUN**, so `development_complete=false` is retained. This hands over execution of the development gate; it neither declares development complete nor claims or accepts the formal review. Mech's readiness measurements and synthetic receipt instrument retain their stated limits.

Alien 的正式 MEMBER 安装连接 City `031fdba6-e94c-4298-a095-6ff04a65481d`。2026-10-06T09:47:27.839Z，通过官方设备会话独立读取规范任务：已验收原 campaign 的三条任务均 COMPLETED，没有看到新的 Replay/Ablation 任务。MEMBER 不能调用 Owner Research 端点。此前用户“Mech已经更新”绑定旧候选 `8798ba9`；新候选的部署确认仍待提供，不能据旧回复推定已部署。

Alien's officially enrolled MEMBER installation connects to the City above. At 2026-10-06T09:47:27.839Z, an official device session independently read its canonical tasks: the accepted original campaign's three tasks were completed, with no new Replay/Ablation tasks observed. MEMBER cannot call Owner Research endpoints. The earlier update confirmation binds `8798ba9`; confirmation of the repaired candidate's deployment remains pending.

## 可直接执行的原始 run / Ready source run

来源 / Source: [REX-803 原始 receipt / original receipt](../REX-803/evidence/campaign-receipt.json). 本机重新解析并递归按键排序计算，而非使用 derived checks / Independently parsed and recursively key-sorted locally, without relying on derived checks:

```text
sourceCampaignId  campaign-966cf439-7017-4bb0-88e8-981e59c18322
sourceRunIndex    1
source seed       414121415
source task       Q-f78eaee3-2380-468e-969d-6012fba109b9
original worker   dev-8128a1ef25c5c4b7f66fc31b21705858 (Alien)
first worker      dev-031fdba6e94c4298a0956ff04a65481d (Mech)
timeout           30000
limits            {"maxFailures":3}
digest kind       CANONICAL_PARSED_RECEIPT_SHA256
source digest     1390b60885d52bf1284b7b57f0a94a3db67d39ecedfb271a94d9c119035ed67a
```

该 digest 衡量规范解析后的整个 receipt，不是文件原始字节 hash；已有 payload 文件不得重写为合成 run。/ This digest covers the canonical parsed receipt, rather than raw file bytes. Do not rewrite the published payload as a synthetic run.

## Owner 端实体执行与材料 / Owner-side physical execution and materials

1. Mech 更新到候选或包含候选的版本，保留正式 City 及已注册原 experiment/receipt，确认两个声明 worker 当前可用。记录部署源与实际进程绑定；未观测项保持 NOT_OBSERVED。
2. Owner Research 页面选择上面的 run，先执行 Replay，等待终态，再从同一个原 run 执行 alternate-device Ablation，等待终态。保留原始任务；两个新 campaign、experiment 和 canonical task 必须采用新身份。
3. 导出原 receipt、新 Replay/Ablation receipts、对应 experiment registry、两条 canonical task 和两份 comparison；记录开始/结束时间、City 身份、候选及部署绑定、失败/timeout/缺失项。提交原始材料及索引，不只提交截图或 derived 结论。
4. 原始 run 与 Replay 应落 Alien，Ablation 应按 exact disabled policy 落 Mech；三个 seed 应一致。独立核对源 digest、新身份、seed offset、timeout、failure bound、manifest/registry references、实际任务放置与 `controlledInputDifferences`。不能把不同输入的比较或合成结果当作实体通过；duration delta 不作因果性能结论。
5. 作者验证开发门槛后才标记开发完成并发正式交付；Mech 再独立领取和执行正式复检。此次交接不授予 product main 合并权。

1. Update Mech to the candidate or a containing revision, preserving the formal City and registered source experiment/receipt. Confirm both declared workers are currently available. Record source-to-process deployment bindings; unobserved facts remain NOT_OBSERVED.
2. In Owner Research, select the source run, execute Replay to a terminal state, then execute alternate-device Ablation from the same original run to a terminal state. Preserve original tasks. Both new campaigns, experiments and canonical tasks require fresh identities.
3. Export the source receipt, Replay/Ablation receipts, corresponding experiment registry, two canonical tasks and both comparisons. Record timestamps, City identity, candidate/deployment bindings and every failure, timeout or missing observation. Publish raw materials and an index, rather than only screenshots or derived conclusions.
4. The original and Replay should execute on Alien; Ablation should execute on Mech under the exact disabled policy. All three seeds should match. Independently check the source digest, fresh identities, seed offset, timeout, failure bound, manifest/registry references, actual placement and `controlledInputDifferences`. Different-input comparisons and synthetic outcomes cannot establish physical acceptance. Duration deltas do not establish causal performance.
5. Only after the author verifies this development gate should development completion and formal handover be recorded. Mech can then independently claim and perform formal review. This handoff grants no product-main merge authority.


## 候选替代 / Candidate supersession

上述4b39468为交接时历史候选。现修复空限制集合误报并更新至 `0261a9ed1cec88df3ab4675623d422b37b33f270`；新精确版本CI/全量测试进行中，Mech部署应使用此修复或含此修复版本，并记录实际来源绑定。原始run、digest、预期落点和实体完成门槛不变。

The4b39468 candidate above is the historical handoff snapshot. Repair of the empty-limit false mismatch advances the candidate to `0261a9ed1cec88df3ab4675623d422b37b33f270`; exact new-head CI/full-suite validation is in progress. Deploy this repair or a containing revision on Mech and record its actual source binding. The source run, digest, expected placement and physical completion gate are unchanged.
