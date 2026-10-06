# Reading translation / 阅读译本

[Canonical source / 权威原文](../README.md)

This page translates the explanatory body of a historical reading snapshot; generated bilingual navigation/dashboard blocks are available at the canonical source. Source SHA256: `e9261341518554d543ea1abbce0ee5dda400d691bb4373236d08c52b8d451b4c`. Current canonical workbooks and records determine authority and state; this page grants no execution or claim authority.

本页为历史阅读快照的完整解释正文译本；已双语的生成导航/面板见权威原文。当前任务状态以canonical工作书和记录为准，本页不授予执行或领取权。

# City live-test log

> **Status: ACTIVE / log directory**
>
> This directory is the cloud registration and verdict ledger for **City live tests**. This host, Alien, registers each round and writes **bounded** receipts and verdicts here. **Raw** process data—logs, sqlite, original .jsonl files and backups—stays in the construction host's Git-ignored `.runtime/`, outside this directory.
>
> Governing rules: [CONSTRUCTION_RULES.md](../../../CONSTRUCTION_RULES.md); process-data boundary: [PROCESS_DATA_POLICY.md](../../../PROCESS_DATA_POLICY.md).

## 1. Why this directory is in the cloud, rather than only on the construction host

Owner directly instructed that **the live-test log directory must be created in GitHub's cloud**. Otherwise the fact that this machine ran a live test exists only on its disk and is invisible to the control plane. This directory records **control-plane facts**: which round, which participants, extent of execution, and verdict.

Mission Book previously had no logs/ layer. This is a category **added under Owner instruction**, explicitly recorded here rather than silently placed in reports/. Reports contain a workbook's Development/Review conclusions; live testing is **cross-workbook and repeatable**, required by JOIN-501, JOIN-503 and subsequent MESH tasks. Their lifecycles differ.

## 2. Verdict definitions (fixed beforehand to avoid selecting criteria afterward)

```text
RUN            = 一次联机测试
参与者          = 发起主机 + 至少一台第二实体主机
PASS           = 全部检查通过，且参与者齐备
FAIL           = 有检查 FAIL（收据里写观测值，不写结论）
NOT_RUN        = 指定的第二主机在窗口内未加入
DEFERRED       = 需要真实第二主机才能判定的部分，明确留到阶段集成
```

Full translation: RUN means one live test. Participants must include the initiating host and at least one second physical host. PASS requires every check passing and all participants present. FAIL means a check fails; receipts record observations, not conclusions. NOT_RUN means the designated second host did not join within the window. DEFERRED explicitly reserves the parts requiring a real second host for stage integration.

**NOT_RUN is neither a pass nor a failure**: it means this round never formed a two-host topology. Results from two processes on one host **must not** masquerade as a two-host conclusion (`deferred != passed`).

## 3. Credential discipline

- Control tokens, node tokens and long-term device credentials **never enter this directory or any Git object**.
- Registration says only “configured”; receipts report credential **presence and length**, never values.
- Test City endpoint, cityId, SHA and CI run number are public facts and are recorded.

## 4. Directory conventions

```text
README.md            本文件：口径与纪律
register/            每轮登记（RUN_ID、参与者、范围、判定）
receipts/            每轮有界收据（逐项 PASS/FAIL/NOT_RUN 的观测）
```

README.md defines verdicts and discipline; register/ contains each round's RUN_ID, participants, scope and verdict; receipts/ contains bounded observations for each PASS/FAIL/NOT_RUN check.

## 5. Registered rounds

| RUN_ID | Date | Initiator | Second host | Verdict |
|---|---|---|---|---|
| [JOIN-LIVE-2026-10-03-01](.././register/JOIN-LIVE-2026-10-03-01.md) | 2026-10-03 | Alien | Mech | **NOT_RUN**: Mech did not join within five minutes; Alien's unilateral self-test passed 38/38. |
