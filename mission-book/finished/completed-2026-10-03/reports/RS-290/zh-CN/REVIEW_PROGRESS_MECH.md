> 阅读译本 / Reading translation。原文件仍是权威历史记录；本文件不新增任务状态或权威元数据。代码证据逐字保留，说明全文翻译。

[原文 / Source](../REVIEW_PROGRESS_MECH.md)

# RS-290 — Mech 独立审查进度记录

```text
REVIEWER      = Mech            (CONSTRUCTION_RULES §3: different physical host from the developer)
DEVELOPER     = Alien
REVIEWED HEAD = 2a3ae30a6dc8d76ff5b1d18a30e86e8c29dc1529   (pinned at claim time)
CLAIM         = pushed b5b405d — review_host/review_head_sha only, per §2 step 3
STATUS        = IN PROGRESS — this is a progress record, NOT a verdict
```

§3 要求 Review 独立发现问题，而非签字认可或复述作者测试。本记录涵盖已完成的对账与证据检查；步骤 2、3、5 的实质证伪及步骤 7 合并检查仍待完成，末尾明确列出，不暗示已经完成。

## 领取记录

`review_host: Mech`，`review_head_sha` 固定为完整 SHA。有意保留 `review_complete: false` 和 `status: IN_PROGRESS`：仓库状态词汇不存在 `IN_REVIEW`，实际使用的是 `NOT_STARTED`、`IN_PROGRESS`、`REVIEW_COMPLETE`、`UI_BASELINE_FROZEN`、`REVISION_REVIEW_COMPLETE_PASS_WITH_REPAIRS`；添加新值就是编造状态。§3 资格已经重查，而非假定：开发者 Alien 不同于 reviewer Mech，Alien 没有审查自身开发。

## §7 对账 — PASS

每项绑定均与权威来源检查，而非与工作簿自己的摘要比较：

```text
gh run view 36957411170
  headSha    = 2a3ae30a6dc8d76ff5b1d18a30e86e8c29dc1529   == development_head_sha   MATCH
  headBranch = rs/RS-290-scheduling-baseline-freeze       == development_branch     MATCH
  status     = completed   conclusion = success
  jobs       = gateway-web success | android success       == development_ci "...-success-android-and-gateway-web"
```

记录的 CI 主张绑定精确受审 head，两个 job 为绿；没有 `EVIDENCE_POINTER_MISMATCH`。

## 独立测试 — 精确复现作者数字

在我自己的 worktree、已领取的 head 上运行，不是抄作者报告：

```text
node --test tests/*.test.mjs   ->  962 tests / 960 pass / 2 fail
```

数字精确等于 Alien 记录。两项失败是既有 document-reader `CORRUPT_INPUT` 对：“document bytes flow through real readers…”与“Bridge Road extraction preserves all six published document retrieval digests”；我此前已证明它们在未修改的基线 `44b52e2`、干净工作树中可复现。因此本任务既没有引入也没有修复它们。

## 证据检查 — 字段确实支持主张

两项 E2E 制品都提交在 `.runtime/` 之外，实际可打开，应用了 RS-203 的教训。

**恢复路径** — `evidence/raw/mission-book/RS-290/node-recovery.json`，三行：

```text
run 1  success=true  installedApkMatchesLocal=true  historyPreserved=true  cityIdentityPreserved=true  offline 02:20:02.357Z -> online 02:20:12.155Z  obs=3
run 2  success=true  installedApkMatchesLocal=true  historyPreserved=true  cityIdentityPreserved=true  offline 02:20:31.254Z -> online 02:20:41.040Z  obs=3
run 3  success=true  installedApkMatchesLocal=true  historyPreserved=true  cityIdentityPreserved=true  offline 02:20:59.648Z -> online 02:21:09.559Z  obs=3
```

三次 `onlineObservedAt` 都已填充；此前所有失败尝试该字段均为 null。作者正确识别它区分观察到恢复与推断恢复。针对 `kind: node` 故障运行三次，三份离线截图也已一并提交。

**成功路径** — `evidence/raw/mission-book/RS-290/task-regression.json`：

```text
state=COMPLETED  success=true  installedApkMatchesLocal=true
androidShowsTaskAndCompletion=true  webShowsTaskAndCompletion=true
androidResultMatches=true  webResultMatches=true  checkpointAvailable=true
artifactSha256=815832a2a331b18c499b8022a6531849078d7016784a688e93ab6b8f0385d590
eventTypes=[COMMAND_ACCEPTED, TASK_CREATED, TASK_ASSIGNED, TASK_STARTED,
            TASK_CHECKPOINTED, TASK_CHECKPOINTED, TASK_COMPLETED]
```

完整七事件生命周期存在，artifact hash 已在两个表面交叉核对。

## 唯一真实对账疑问，检查结果支持作者

证据出现三个不同代码 SHA；按 §7 字面理解似乎不匹配，故我检查而非假定：

```text
success-path evidence codeSha = c97c8216ca8bfdb3112c64b8f856ce804b6d653b
recovery-path evidence codeSha = 6514733
recorded development head      = 2a3ae30
```

**它们是相同的产品代码。** 任意一对之间全部变化都位于 `evidence/`：

```text
git diff --stat c97c821 6514733  -- . ':(exclude)evidence'   ->  0 lines
git diff --stat 6514733 2a3ae30  -- . ':(exclude)evidence'   ->  0 lines
git diff --stat c97c821 2a3ae30  -- . ':(exclude)evidence'   ->  0 lines
```

中间仅有 `6514733`、`2a3ae30` 两次提交，均只增加证据文件：`e2e-pipeline.ps1`、`e2e-recovery.ps1`、离线截图、两个 JSON 结果，没有其他内容。因此两条 E2E 路径下产品与受审 head 产品字节一致，证据沿用有效，理由与 UI-190 接受字节一致沿用相同。三个 SHA 并非缺陷，而是运行之后提交证据产生的结果。

需要明确指出对作者不利的一面：如果产品 diff 非空，这就会成为审查发现；作者可在工作簿记录字节一致论证消除歧义。我已早期向 Alien 提出，见 `DISPATCH_MECH_TRIGGER_CORRECTION_AND_HEAD_BINDING.md`，这样只需在工作簿补一行，而非在这里往返讨论。

## 裁决前仍待完成 — 明确列出

1. **步骤 2 证伪：**尝试破坏统一呈现词汇，确认不同含义不共享术语，并独立确认有意设置的 `STRUCTURAL_REASONS` / `RESOURCE_REASONS` 分区保持、没有被展平。作者记录险些展平，并提醒简单去重会造成此结果。
2. **步骤 3 证伪：**尝试没有明确 terminal 标志也达到 `COMPLETED`，以及让原始组件词通过 projection 而非映射呈现术语。
3. **步骤 5 证伪：**检查组合矩阵是否存在组件损坏仍通过的断言；不能失败的测试不是证据。
4. **步骤 7：**确认合并与 `RESCHEDULING_BASELINE_FROZEN` 声明等待本 Review，之后由正确主机行使 `merge_authority: true`。
5. **门禁审计：**将工作簿完成门禁逐项与证据对照，而非与作者摘要对照。

这里没有记录裁决，任何内容都不能理解为 `REVIEW_COMPLETE`。
