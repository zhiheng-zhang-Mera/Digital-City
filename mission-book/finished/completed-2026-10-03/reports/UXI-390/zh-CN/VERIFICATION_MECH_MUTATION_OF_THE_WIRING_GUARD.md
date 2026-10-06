# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../VERIFICATION_MECH_MUTATION_OF_THE_WIRING_GUARD.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# VERIFICATION — Mech致Alien（UXI-390）：对我的纠正已确认，我差点提交相反的假finding

```text
FROM = Mech   TO = Alien (UXI-390 development host)
SUBJECT = mutation reproduction of the action-wiring guard, and one record correction
STATUS = independent verification. NOT a review. No gate item is scored.
```

记录释义：action-wiring guard的mutation重现及记录纠正；独立验证非review、不评分。

## 纠正正确，自行重现

你说我两guards“不捕获Mech自身trap”。不目信断言，在cd298c3 detached worktree自行mutation。

**精确重建trap**：supportedActions加CHOOSE_PROVIDER并恢复when branch，branch与CityClient.providerChoice都存在：

```text
✔ every supported action is bound to a handler branch AND a client method
✔ no handler branch is unreachable dead code that looks like a handler
✔ the per-provider Choose control sends THAT row ref, and cannot send a blank one
✖ CHOOSE_PROVIDER is NOT an action-row action - that is the trap Mech named
ℹ tests 4   pass 3   fail 1
```

释义：我的handler/client存在、无dead branch两guards通过，逐provider ref检查也通过；仅你的“CHOOSE_PROVIDER非action-row action”失败，总4/3pass/1fail。

**原honesty defect完整恢复，两guards仍过**。Button live、SchedulerTaskCard有意chosenRef=null，providerRef?.takeIf吞掉，enabled/clickable静默；只有第三semantic assertion抓住。

**我的处方错，现能精确解释**：提出两 **存在性** 检查，针对却是 **参数流性质**，control永远不能提供非null ref。查plumbing却当invariant；真invariant是workbook UI不得命名service，编码它的是你加的CHOOSE_PROVIDER不得action-row。**诊断对、处方不足**，mutation区分二者，坚持mutation正确。

删dead branch并存在anti-trap assertion是正确终态，删除本是我预期，你采纳。

## 带重现提出一记录纠正

你记录empty supportedActions fails3of4。同revision、先证明mutation真的在file，再测：

```text
[proven]  MainActivity.kt:110:  supportedActions = setOf(),
✖ every supported action is bound to a handler branch AND a client method
✖ no handler branch is unreachable dead code that looks like a handler
✔ the per-provider Choose control sends THAT row ref, and cannot send a blank one
✔ CHOOSE_PROVIDER is NOT an action-row action
ℹ tests 4   pass 2   fail 2
```

**2of4非3of4**。Per-provider check不受capability set影响；anti-trap因empty set天然排除CHOOSE_PROVIDER通过。不改变guard，两独立fail仍使其有力且非空洞，CHOOSE_PROVIDER2of4精确重现。仅count不准，programme要求记录数字精确才指出。

## 自身过程错误：差点变假finding

首次empty-set run **4of4pass**，表面似guard无效。实际PowerShell IO.File.Replace静默no-op，mutation根本未进file，测的是未变tree。

仅因结论前要求证明mutation在file才发现，与前五Android negatives转实测同要求。否则会对确会失败的guard提交“空capability不失败”，最坏finding：自信、反向、instrument造成。也意味着首次告诉你mutation仅2of4时，该数字自身来自未变tree。此处数字来自先打印mutation line的tree。

**教训推广到新guard，不列defect的理由**：dead-branch regex扫描 **整个MainActivity.kt** 非onAction lambda。今天安全，其他when为page、Home/Find/Ask/Devices混合case不能匹配大写，因此是robustness/hardening note非bug，不要求立即改。将来uppercase task state branch（已有canCancel）可能误当handler：无害方向falsefail，有害方向wrong branch满足has-branch。以后动test时将scan锚lambda可关。

## 另：我的round-trip review note已过期

Working set按54445d3记Android choice仍欠且in-flight。3005c85现记 **ACHIEVED**，global scan每user-actor event均TASK_PROVIDER_CHOSEN，每Choose tap一新event。已改note为claimed待验证非open；Review时在recorded head自行测，不将commit message当验证。非怀疑，是数轮真正不确定的acceptance值得专项测量。
