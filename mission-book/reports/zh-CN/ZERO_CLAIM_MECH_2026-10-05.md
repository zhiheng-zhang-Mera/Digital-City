# Mech 零领取分类——2026-10-05

阅读译本 / Reading translation：历史完整阅读译本，不是第二份权威任务状态；保留原时点的未观察、失败和授权边界。

> 按 CONSTRUCTION_RULES.md 第5节记录。零领取结果是分类，不是任务池已经完成的声明。本文件让 Mech 下轮直接读取原因，避免重新推导，也让缺失的唤醒事件明确表现为事件缺失，而非“没有工作”。

```text
pool_incomplete                 = true
claimable_now                   = 0   (for the Mech host)
potentially_claimable_later     = true
classification                  = TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY
structural_ineligibility_reason = null
global_external_blocker         = null
terminal_reason                 = null
```

任务池未完成；Mech当前可领取数0，之后仍可能可领取。分类 TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY；结构性不适格原因、全局外部阻塞及终止原因均为null。

## 1. 测量内容与事实来源

分类前立即重新读取 origin/main 任务板，未凭记忆或README表格。

| 工作簿 | 状态 | development_host | Mech现在能否领取 |
|---|---|---|---|
| CEX-701 | IN_PROGRESS | Alien-codex | 否，另一主机已领取 |
| CEX-702 | IN_PROGRESS | Alien-codex | 否 |
| CEX-703 | IN_PROGRESS | Alien-codex | 否 |
| CEX-704 | IN_PROGRESS | Alien-codex | 否 |
| CEX-705 | IN_PROGRESS | Alien-codex | 否 |
| CEX-790 | WAITING_DEPENDENCIES | — | 否，需CEX-701..705接受 |
| JOIN-590 | READY | — | 本会话不适格，见第2节 |
| MON-901 | IN_PROGRESS | Alien-codex | 否 |
| MON-902 / MON-903 / MON-990 | WAITING_DEPENDENCIES | — | 否 |
| REX-801 | READY | Mech | 本机任务，开发完成，无需再领取 |
| REX-802 | IN_PROGRESS | Alien-codex | 否 |
| REX-803..807 / REX-890 | WAITING_DEPENDENCIES | — | 否 |
| SHOW-401 | IN_PROGRESS | Alien | 否，非产品媒体任务，首选Alien |
| WBC-601 / WBC-602 | COMPLETE | Mech | 异机审查已关闭 |
| WBC-603 | IN_PROGRESS | Alien-codex | 否 |
| WBC-604 | WAITING_DEPENDENCIES | — | 否 |

XX-000为工作簿模板，不是任务，排除在外。

## 2. JOIN-590为何不适合本会话领取

JOIN-590是唯一其他READY且未领取工作簿，因此实际检查而非跳过。最低真实拓扑为 Alien Windows + Mech Windows + Android 物理控制界面，各完成门禁需两主机协同。

```text
gate 1  real Alien↔Mech physical onboarding run        needs the other host
gate 2  restart tokenless reconnect on the member      needs a member enrolled by that run
gate 3  revoke refusal convergence                     needs the revoked installation to exist
gate 7  opposite-host Formal Review                    needs the other host by rule
gate 9  merged-main post-closeout verification         needs the above to have happened
```

门禁1真实Alien↔Mech物理入网需要另一主机；门禁2成员重启无token重连需要该次入网产生的成员；门禁3撤销拒绝收敛需要已有待撤销安装；门禁7按规则需异机Formal Review；门禁9合并main后关闭验证需要此前步骤已发生。本会话只运行在Mech，不能驱动Alien且没有Android设备连接。启动会占用一个首道门禁无法达到的任务领取，正是规则要避免的“无资格领取”。因此为双主机窗口保留未领取，记录为资格事实，而非产品问题。

## 3. 唤醒条件（事件优先，不忙轮询）

以下任一事件使Mech再次可领取：

1. Alien关闭CEX-701..705、REX-802、WBC-603或MON-901中的任务，释放programme中Mech剩余工作的启动机会。
2. WBC-601/602进入main，且一个基线依赖它们的任务就绪；WBC-604、CEX-790、REX-803正被此类接受依赖锁定。
3. Owner把新工作簿MON-902/903、REX-804..807、REX-890、WBC-604从WAITING_DEPENDENCIES激活为READY。
4. 有Android控制界面的双主机协同窗口开启，JOIN-590只有此时可领取。
5. Mech编写的头出现审查发现：当前REX-801，WBC-601/602已关闭。工作因此作为修复而不是新领取返回本机。

## 3A. “继续领取”要求后的重扫（实测，非假设）

pull origin/main后重新读取全板；分别验证“继续领取”可能指向的两条候选路径，而非直接否定。

**(a) JOIN-590，唯一其他READY且未领取工作簿。** 本机实测阻塞资源：

```text
adb devices -l                                  -> "List of devices attached" and nothing else (no physical device)
emulator -list-avds                             -> utopia36 exists (an emulator, NOT a physical Android surface)
resident City on this host                      -> http://127.0.0.1:4389  state ONLINE, endpoint
                                                   http://172.31.12.151:4391 (this host's own LAN address)
```

adb devices -l只有标题、没有物理设备；utopia36模拟器存在，但不是物理Android界面。本机常驻City coordination ONLINE，endpoint为本机LAN172.31.12.151:4391。首门禁必须真实Alien+Mech+Android，批准在已受信任的物理控制界面进行。模拟器不是该界面；工作簿规定deferred != passed。以模拟器制造批准证据会伪造验收，比零领取更糟，因此等待物理Android接入及双方约定窗口。另一主机在reports/MON-901/ELIGIBILITY_SCAN_20261005T103433_Alien-codex.md独立得出同一结论：“没有提供可调用的Mech物理会话/地址”。本机新增实测说明Mech侧实际在线但无设备，缺失的是物理Android界面，而非Mech可用性。

**(b) 合并11个已审查但未合并PR（14–25）。** 全部MERGEABLE，合并不是审查，因此作为可执行选项检查，而非领取。未执行，因为没有工作簿授权：所有相关工作簿merge_authority:false，包括WBC-601、WBC-602、REX-801、WBC-603；workbench-compatibility-migration/README.md第8节说尚无最终整合/合并工作簿，且须四个WBC任务全部完成异机审查、精确头CI绿色、无未解决回归后才可创建。没有正式整合工作簿或Owner明确裁定而合并，就是擅自取得未获授予的合并权限。因此记录为开放且未领取的整合需求，而非Mech任务。

```text
claimable_now (after re-scan) = 0
new exclusion reason (measured) = JOIN-590 additionally blocked on absent physical Android control surface
control-plane gap observed      = 11 reviewed+mergeable PRs (14–25) with no merge authority granted anywhere
```

重扫后可领取数仍0；新增实测排除原因为JOIN-590缺物理Android控制界面；观察到控制面缺口：11个已审查且可合并PR14–25没有任何已授合并权限。

rescan_after为20分钟，只作第6节低频活性兜底；主要机制是事件，而非时钟。

## 4. Mech如何避免空闲

按第4与9节，没有用新功能填补空闲。REX-801托管CI运行期间，同会话完成其控制面记录并两次重读全板；第二次发现另一主机把WBC-601/602从READY推进到COMPLETE。因此上述分类为测量，而非回忆。

语言配对 / Language pair: [原文 / Source](../ZERO_CLAIM_MECH_2026-10-05.md)
