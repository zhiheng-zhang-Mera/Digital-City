# 工程书 — 异步派发恢复与Programme排空

> 阅读译本 / Reading translation：历史阅读副本，不是第二份权威工作书或新任务激活。所有阶段时点与证据边界保留。

> 日期2026-10-01；控制Digital-City，实现utopia；仅恢复／调度修复，禁止产品功能扩张。

## 0. 目的

恢复当时外阻组件运行，不创建第五programme或加产品范围。实际池：41/41开发实现存在，20/41开发＋异机纠正完成，2纠正代码完但托管阻，5开发代码完但托管阻，14绿开发待异机纠正，GitHub账户账单／额度阻新job。目标恢复CI→诚实闭七头→依赖优先排空纠正→一programme合资格就集成→双主机有效且不破分工。

## 1. 事件快照

历史COMPONENT_BASELINE=82ed36933fb4c5b00e44768d9e1aedec1d525d9c。现main已有仅证据记录，文档提交不授权把已报告头改“更新”；未来集成从当时main保记录。

| 类别 | 数量 | 任务 |
| --- | ---: | --- |
| 开发＋纠正完成 | 20 | BA-001..005; EM-001..006; GAI-001/002/003/005; RF-001..005 |
| 纠正代码完整、托管阻 | 2 | GAI-004, RF-006 |
| 开发绿、等异机纠正 | 14 | BA-006/008; EM-007..011; GAI-006..008; RF-007..010 |
| 开发代码完整、托管阻 | 5 | BA-007/009; EM-012/013; GAI-009 |

七阻头：

| 任务 | 阶段 | 主机 | 头 | 阻运行 |
| --- | --- | --- | --- | --- |
| GAI-004 | 纠正 | Alien | 11d5ece | 36750532324 / 36750532665 及重跑 |
| RF-006 | 纠正 | Alien | 8fbd71d | 36751505413 / 36752017760 及重跑 |
| BA-007 | 开发 | Mech | 8fa4686 | 36752540378 |
| BA-009 | 开发 | Mech | 9e1de31 | 36750981300 |
| EM-012 | 开发 | Mech | 364c516 | 36751919772 |
| EM-013 | 开发 | Mech | 5920e80 | 36753243377 |
| GAI-009 | 开发 | Mech | 8dfdf9e | 36753891511 |

已知GitHub注释：近期账户付款失败或额度需增，检查Billing & plans；Owner／账户改变前为类型外阻，不当代码问题。

## 2. 硬规则

1 要求托管时本地PASS不替代。
2 账单恢复先重跑精确记录阻头，不仅main多文档就rebase。
3 主机闲不增组件功能。
4 开发主机≠纠正主机继续绑定。
5 programme全组件门前无合工作书。
6 job实际启动但测试失败转普通代码缺陷，不继续叫billing。
7 保失败时段论文／dogfood证据。

## 3. R0 — Owner外部解阻

要求RESTORE_GITHUB_ACTIONS_BILLING_OR_SPENDING_LIMIT。job恢复前Alien对GAI004/RF006托管闭合GLOBAL_EXTERNAL_BLOCK，不堆未验纠正头；Mech开发池已排空、自己写大部分余开发所以STRUCTURALLY_INELIGIBLE，不造替代工作。双机可类型原因停放。约20分钟扫描适TEMPORARILY_UNCLAIMABLE，不要求轮询已知未变账户全局阻。

## 4. R1 — 七阻头恢复

恢复后双机并行。

### Alien通道

精确GAI004@11d5ece、RF006@8fbd71d重跑。绿则新run、correction_complete true、旧阻留历史。实际跑失败则ACTIONABLE_OWNED_REPAIR，仅修观测缺陷、重本地门＋托管、记新纠正头。

### Mech通道

BA007@8fa4686、BA009@9e1de31、EM012@364c516、EM013@5920e80、GAI009@8dfdf9e精确重跑；绿标development_complete true、新run、允许Alien纠正。Mech不得自纠五项。若七全无代码变绿，FULLY_COMPLETE22/41、WAITING_CORRECTION19/41、开发阻0、纠正CI阻0。

## 5. R2 — Alien纠正排空通道

R1后高吞吐纠正目标依赖感知排空非公平分配。

### A — RF优先

006闭后007→008→009→010。接受RF去掉GAI/EM否则延期的真实跨设备接口。全001–010双阶段满发REMOTE_COMPONENT_POOL_DRAINED唤Mech集成。

### B — GAI

006→007→008→009（开发恢复绿后），004已R1闭。

### C — BA

006→008→007→009，后两开发恢复绿。

### D — EM

007→008→009→010→011→012→013，后两开发恢复绿。内部顺序可因更早可操作变化，不为守列表空等。Alien继续独立对抗，作者测试不足。

## 6. R3 — Mech programme集成通道

R1后因自写开发通常组件纠正结构不合资格：STRUCTURALLY_INELIGIBLE_FOR_COMPONENT_CORRECTION、SAME_PHYSICAL_HOST_AS_DEVELOPMENT。不得制造忙碌工作。唤醒REMOTE／GENERAL_AI／BUTLER／ENGINEERING_MANAGER_COMPONENT_POOL_DRAINED之一；即按既有规则建对应集成工作书。

按R2预计RF→GAI→BA→EM，若别programme真实先排空可先取其ready。各集成须当时main、保事故／他已合、纠正分支显式联合超集、全相关本地＋托管、要求真实接受、真实最终门绿才合、合main再CI。

## 7. 资格感知空闲规则

每零领取用跨programme契约四类。TEMPORARILY_UNCLAIMABLE：有未完以后可能可领、主机非结构禁，约20分钟后重扫不忙轮询。STRUCTURALLY_INELIGIBLE：稳定机制禁本机所有余阶段，记精确原因到显式唤醒，无周期必扫。GLOBAL_EXTERNAL_BLOCK：进展需账户／Owner／硬件／provider改变，精确证据报一次停，不20分钟反复已知阻。POOL_TERMINAL：仅各实际终态语义全满足。

## 8. 论文／dogfood仪器

未来零领取记timestamp、host、pool_incomplete、claimable_now、potentially_claimable_later、structural_ineligibility_reason、global_external_blocker、rescan_after、next_scan_timestamp/outcome、work_became_eligible、owner_intervention_required。比较一次退出、固定约20分钟有界重入、事件唤醒、依赖排空。

材料：研究院paper-materials ASYNC_DISPATCH_TRANSIENT_QUIESCENCE_2026-10-01；Utopia evidence PAPER_EVIDENCE同名；raw async-dispatch-2026-10-01/incident-summary.json。

## 9. 停止条件

成功SEVEN_BLOCKED_HEADS_RECOVERED AND SCHEDULER_RULE_ACTIVE AND HOST_LANES_ASSIGNED。类型外停RECOVERY_BLOCKED_ONLY_ON_GITHUB_ACTIONS_ACCOUNT_STATE，不以绕法改称成功。

## 10. 恢复闭合及控制面协调事故

STATUS RECOVERY_CLOSED_WITH_RECONCILIATION_REPAIR。账户阻解，精确阻头重跑不改历史，七绿：

| 任务 | 阶段 | 运行 | 尝试 | 精确头 | 结果 |
| --- | --- | ---: | ---: | --- | --- |
| GAI-004 | 纠正 | 36750532665 | 4 | `11d5eced3e913cdd0cd9249d55825dedbcc3d5ac` | 成功 |
| RF-006 | 纠正 | 36752017760 | 4 | `8fbd71df10535456cddd8146e28b08fd7684d714` | 成功 |
| BA-007 | 开发 | 36752540378 | 3 | `8fa4686bb7acb2b57a34a00fe517f6ecaad9769f` | 成功 |
| BA-009 | 开发 | 36750981300 | 5 | `9e1de31ba53766758406e991dbacdb8f707b1bfc` | 成功 |
| EM-012 | 开发 | 36751919772 | 3 | `364c5160952039d31074af3bfae843c1d0f4be24` | 成功 |
| EM-013 | 开发 | 36753243377 | 3 | `5920e8076d317e15142b7d16c8531e529ce587f0` | 成功 |
| GAI-009 | 开发 | 36753891511 | 3 | `8dfdf9edcf6f525797de964650b383a916271371` | 成功 |

外恢复暴露第二失败：执行真相外部改变、控制面不自动协调。五开发frontmatter仍BLOCKED_GITHUB_ACCOUNT_BILLING、dashboard原全未领、GAI005纠正CI错指RF00936746849199非自身36746845955。CONTROL_PLANE_STATE_RECONCILIATION_LAG，别于billing，系统已恢复余为旧／误归元数据。

2026-10-01修：五开发精确绿头COMPLETE、当前删旧billing但报告保事故、005来源纠36746845955、dashboard从任务重算、RF排空解集成、规范契约增外状态协调／来源验证门。

```text
DEVELOPMENT_GREEN = 41/41
CORRECTION_COMPLETE = 36/41
REMOTE_FABRIC = 10/10 DEVELOPMENT + 10/10 CORRECTION
WAITING_ALIEN_CORRECTION = BA-007, BA-009, GAI-009, EM-012, EM-013
GITHUB_ACTIONS_ACCOUNT_BLOCK = RECOVERED
```

重算开发41/41、纠正36/41、RF双10/10，待Alien BA007/009 GAI009 EM012/013，账单RECOVERED。上§0–9不变历史不可改成无事故。

## 附录 — 组件收尾（2026-10-01，Owner请求纠正后）

原36/41后的五由Alien纠Mech开发已闭，各精确头／托管／修机制、开发头上失败的Alien回归、作者边界、披露：

```text
BA-007   head f8f15af835e6ea04921142403c1c33584364d451   run 36817491957   reports/BA-007/CORRECTION_REPORT.md
BA-009   head 2abf8d47ad0663c175779ab9a3057594d2db86ab   run 36818585688   reports/BA-009/CORRECTION_REPORT.md
GAI-009  head 4e65e265eba4bb346924d1c078955a587e9e199f   run 36820218698   reports/GAI-009/CORRECTION_REPORT.md
EM-012   head e4afd5ea5a822b481a93771b4b33041d64e29cb8   run 36821442088   reports/EM-012/CORRECTION_REPORT.md
EM-013   head 0ef455eabbdf54a7edfd975fa0fe82eb89690ca6   run 36822830353   reports/EM-013/CORRECTION_REPORT.md
```

```text
FINAL COMPONENT TRUTH (2026-10-01, generated from task workbook frontmatter)
DEVELOPMENT_GREEN                                = 41/41
CORRECTION_COMPLETE                              = 41/41
OPPOSITE_PHYSICAL_HOSTS_ON_EVERY_TASK            = true
COMPONENT_BRANCHES_MERGED_TO_UTOPIA_MAIN          = 0
MERGE_WORKBOOKS_CREATED                          = 0/4
ACTIONABLE_OWNED_REPAIR                          = 0
ELIGIBLE_CORRECTION_OTHER_HOST                   = 0
UNCLAIMED_DEVELOPMENT                            = 0
DEVELOPMENT_IN_PROGRESS_BY                       = 0
```

此时最终组件开发／纠正41/41、各异物理true，但main组件合0、合工作书0/4，各可操作修／纠正／未领开发／开发进行0。四池排空可建合但当时未开，是独立Owner授权未开始阶段。真实provider/login、双设备传输、Claude/WorkBuddy仍开放集成门，组件未造；事故不改。此附录再被B合阶段取代。

## 附录B — 合阶段收尾（2026-10-01）

Owner授权，四工作书池序BA→RF→GAI→EM，各当时main并临最终合再刷新§7.6，对刷新头重本地／docs／CI，合main再核§7.7：

```text
programme              integration head / CI      main merge / CI            archive tags
Butler Assistant       4ff27ba  · 36827219769     41e241c · 36827422797      9   (archive/BA-001..009)
Remote Fabric          160fcc3  · 36828179156     49914d9 · 36828413515      10  (archive/RF-001..010)
General AI Gateway     a47e4eb  · 36828980482     74b37cf · 36829232339      9   (archive/GAI-001..009)
Engineering Manager    aef657f  · 36829755814     e7c498f · 36830053908      13  (archive/EM-001..013)
```

```text
FINAL MERGE TRUTH (2026-10-01)
MERGE_WORKBOOKS_CREATED                    = 4/4
COMPONENT_BRANCHES_MERGED_TO_UTOPIA_MAIN    = 41
UTOPIA_MAIN_SHA                             = e7c498f5acd86da324a45c3278219c8daa612561
UTOPIA_MAIN_CI                              = 36830053908 success
ARCHIVE_TAGS_ON_ORIGIN                      = 79
REMOTE_BRANCHES_REMAINING                   = main (only)
CORRECTED_HEADS_ANCESTORS_OF_MAIN           = 41/41
HISTORY_DELETED                             = 0
TERMINAL_MARKER                             = ALL_PROGRAMMES_MERGED_MAIN_CI_GREEN
```

最终4/4工作书、41组件合main、main e7c498f5acd86da324a45c3278219c8daa612561/36830053908成功、origin标签79、远仅main、纠正头祖先41/41、删除历史0、ALL_PROGRAMMES_MERGED_MAIN_CI_GREEN。

每合分支ref换同纠正提交annotated tag后删远，开发纠正仍archive及main可达无删commit。兼容冲突显式联合：BA无、RF001×002 manifest及test/registry test/双建筑；GAI/EM干净。BA切分支后main仅证据漂移，祖先核捕获、刷新重全CI，Butler D决定记。

合代码非真实外运行证据。provider/login、双设备传输、第三方Claude/WorkBuddy仍如报告REAL_PROVIDER_ACCEPTANCE_PENDING类型门，以上附录不改。

语言配对 / Language pair: [English](../ENGINEERING_BOOK-2026-10-01-ASYNC-DISPATCH-RECOVERY-AND-DRAIN.md) · [中文](./ENGINEERING_BOOK-2026-10-01-ASYNC-DISPATCH-RECOVERY-AND-DRAIN.md)
