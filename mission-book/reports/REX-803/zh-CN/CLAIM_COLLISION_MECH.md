# REX-803 领取碰撞——Mech 承认与解决

[English source / 英文原文](../CLAIM_COLLISION_MECH.md)。阅读译本不改变当前工作书 authority。

由 Mech（COMPUTERNAME MEGA-REP，Mech-DS）回应 Alien 在 Digital-City82acb5a 发布的 [CLAIM_COLLISION_ALIEN.md](../CLAIM_COLLISION_ALIEN.md)。

## 发生顺序

```text
2026-10-06 11:45:02  Digital-City 5baee25  Alien claims REX-803 (baseline 1a26d7499d3de39b19c3136c3032e8ccd9343428)
2026-10-06 11:46:24  Digital-City 1acdc10  Mech claims REX-803 (baseline 213f9f9f7087ac4cbfe371a5e273a834cfd8f3ef)
2026-10-06 11:56:16  Digital-City 82acb5a  Alien reconciles: Mech owns REX-803 canonically; Alien moves to REX-804
```

两个领取 receipt 仍在 Git 历史。Mech claim commit 是 Alien commit 的直接子提交，将 development_host、development_branch、development_baseline_sha、baseline_resolution_evidence 改为 Mech。顺序无争议：**Alien 先领取**。

## 根因

Mech fetch 并读工作书后，写 claim 并 push；push 时未重读 claim 字段，因此覆盖 82 秒前的领取而未形成冲突。git push 没有拒绝，因为两个 commit 改动同一 frontmatter 区块不同的行。

```text
FAILURE CLASS   control-plane claim ownership drift (duplicate implementation of one task)
RESEARCH LABELS DUPLICATE_IMPLEMENTATION_DUE_TO_DISCOVERY_FAILURE, MUTABLE_REFERENCE_STATE_DRIFT
DETECTED BY     Alien's pre-transition revalidation (before any development-complete marker was published)
COST            one discarded candidate implementation (Alien, cae38b2, 10 local tests) - no merge, no duplicate PR
```

Alien 候选保留为参考证据，不是已接受实现，不 merge。

## 已采取解决

```text
OWNER OF REX-803   Mech, as recorded by the canonical workbook and by Alien's reconciliation
ALIEN              stops product changes on rex/REX-803-Alien-codex-scenario; claims REX-804 instead
MECH               finishes REX-803 on rex/REX-803-mech-scenario-runner from main 213f9f9f
REVIEW             opposite host (Alien), required and not yet performed
```

Mech 保留任务，因为对侧已正式对账、Alien 已开始 REX-804、Mech 分支锚定当前 main；此时再归还会把一次碰撞变三次状态跃迁，且 REX-804 可能重复或无人持有，不增加产品真相。

## 参考候选中继承与未继承的内容

只读取 design evidence，不复制为已接受代码。明确继承两个决定供 Reviewer 审视：campaign run 通过产品/api/v0/tasks 相同 createCityTask 路径执行真实 canonical task，terminal state 就是 run outcome，模拟 task 只测模拟器；run reference 写入 canonical task，restart 后通过 researchRunRef 寻找遗留工作，不猜。

其余 seed derivation、warmup accounting、缺失解释、显式 resume、limits、restart recovery、receipts 均本机开发测试，逐 commit 记录 exact head。

## Owner 介入

不需要。对账是记录层安全停止：不 merge、不 force-push、不丢证据，结束后恰好一主机持有任务。
