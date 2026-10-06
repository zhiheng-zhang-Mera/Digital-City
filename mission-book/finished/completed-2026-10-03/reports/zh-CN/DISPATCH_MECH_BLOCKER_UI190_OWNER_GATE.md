# 调度——Mech类型化阻塞：UI-190 Owner gate挡住整个余下programme

> 阅读译本 / Reading translation：完整历史阅读版本；原报告为权威记录，不创建第二份任务状态，代码证据原样保留。

```text
HOST             = Mech
CLASSIFICATION   = 5.1 TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY  (see §3)
CONSECUTIVE GOAL ROUNDS WITH THIS SAME CONDITION = 3  (rounds 21, 22, 23)
BLOCKER TYPE     = Owner action required; no internal code can produce it
```

## 1. 精确条件

FINAL_VISUAL_PREVIEW_PACKAGE已交付等待。Owner gate **开放未解决**，workbook将step8 merge main/UI_BASELINE_FROZEN置于step7Owner交付**之后**。

```text
UI-190  status = REVIEW_COMPLETE, development_complete = true, review_complete = true
        development_head = 10cdd75604836ad0b903f4dd749e80e16bdf32b6
        review_head_sha  = 11bb3f6fc76aecbb1ae41f2e258cccf7beaa429b
        review_ci        = 36895816630 success (android + gateway-web)
        review_verdict   = PASS_WITH_REVIEW_REPAIR
        owner_gate       = FINAL_VISUAL_PREVIEW   <-- the blocker
        UI_BASELINE_FROZEN = NOT declared
```

记录UI190Reviewcomplete、Dev/Reviewtrue、两head/CI/verdictexact，FINAL_VISUAL_PREVIEW是阻塞，未声明freeze。

## 2. 为什么无别可claim

逐activeworkbook扫描确认、非假定：

| Task | Dependency | 锁定理由 |
|---|---|---|
| RS201/202 | UI190 | step8自动解锁，两项需**freeze**非Reviewcomplete |
| RS203 | RS201/202 | 串联 |
| RS290 | RS201..203 | 串联 |
| UXI301 | UI190/RS290 | 串联 |
| UXI390 | UXI301 | 串联 |
| UI000/101/102/103/190 | 无 | Development与Review均complete |

每round、mission-book每programme claimable_now=0。

## 3. 属5.1而非5.2/5.3

分类决定下一行为：

- **非5.2STRUCTURALLY_INELIGIBLE**：非稳定机制排本host，是必将改变的pendingdecision；Mech等待非被禁。
- **非5.3GLOBAL_EXTERNAL_BLOCK**：虽Owneraction外部，但rules§5.1line110明确将“Owner gate解除”列为unlockevent。按规则例单，Ownergate为WAITING_ELIGIBILITY，低成本wait+boundedrescan，非不poll外部block。
- **非**poolterminal或phasefinished，只typedblockerreport。

## 4. 为什么Mech不自行merge

UI190merge_authoritytrue，merge似进展但刻意未做：

1. step8在step7Owner之后，现merge会抢Ownergate前freeze。
2. DevhostAlien，freeze属Devstep；已完成Reviewhost做他机未开始step正是§2claimoverreach。
3. Ownerstep是mandatoryapproval还是permissivecomment（“可给方向性意见”）确有歧义；单方面以skipgate解释不属Mech，归Owner或Devhost。明确记reason。

替代只读确认freezeclean：branch..main0、mainstrictancestor，merge-tree--write-treeexit0无conflict，mainCIgreen，此SHA可**fast-forward**；见ReviewReport§8。

## 5. Owner解阻动作

- 对FINAL_VISUAL_PREVIEW_PACKAGE给方向意见，只需“好看/不好看”与必改处，不需code知识；或
- 裁step7仅permissive非gate，允许step8声明freeze。记录ruling对后续ownergate重要。

任一释放merge→freeze→RS201/202→RS203→RS290→UXI301→UXI390。

## 6. Mech解阻后

先§7reconciliation再rescan/claim下一eligible，freeze一声明RS201/202即可claim。

## 7. 等待非空闲的证据

三round内完成关闭UI190Review非park：两轮自建刻意不同criticinstrument；在Dev记exhaustedroute完成Androidconnectedcapture；发现修复一confirmeddefect且双边验证；在report_path原空目录写boundedReviewReport。

语言配对 / Language pair: [原文 / Source](../DISPATCH_MECH_BLOCKER_UI190_OWNER_GATE.md)
