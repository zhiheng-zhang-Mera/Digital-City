# REX-803 对机复检阶段报告 / Opposite-host review progress

Reviewer Alien / MERA-ALIANWARE, developer Mech / MEGA-REP. Initial target a695bb9 independently reproduced5 failing author-proposed probes; adopted07e8c3c/42acdc6 repairs. Current review head8798ba9dd37051626033ad72080b2fad3ff66149, PR37, includes currentmain b06504f without merging this task into main.

独立发现及修复 / Independent findings and repairs:
- 损坏恢复state阻断构造；现在降级并拒绝恢复 / Malformed state blocked construction; now disclosed and refused.
- 恢复scenario漂移及上下文验证/执行不一致；现在验证原scenario和原context / Resume scenario drift and context mismatch; original identity/context verified.
- readiness拒绝覆盖原中断记录；现在保留原记录 / Readiness refusal destroyed continuation; original interrupted record preserved.
- timeout后late cleanup串到下一run；现在run独立拥有scope / Late cleanup crossed runs; each run owns its scope.
- 恢复数量/timeout不变量及measured/state/warmup矛盾；现在严格检查 / Recovery bounds and measurement contradictions now validated.
- frozen研究时钟使close不真正有界；现在单调实际时钟 / Frozen study clock defeated bounded close; monotonic clock now used.

Final affected integration71 PASS, independent critic8 PASS with no remaining important technical finding. Intermediate full suite1379 PASS, but executed while additional repairs were in progress and therefore NOT accepted as final immutable-head full-suite evidence. Exact hosted8798ba9 CI pending; original/failing logs retained in product evidence/raw/mission-book/REX-803/alien-review.

实体门槛仍未满足：当前主机未运行接入同一City的reference node，作者此前记录Alien node offline；未独立观测Alien+Mech+Android完整campaign。两个逻辑workers同机演练不能替代实体两主机。物理门槛和最终CI满足前，review_complete=false，SCENARIO_REPETITION_ENGINE_ACCEPTED不释放。

Physical gate remains unobserved: no local reference node currently joins the same live City, and author evidence records Alien offline. Two logical workers in one-host rehearsal do not satisfy two physical hosts. Until the physical campaign and final CI pass, review_complete remains false and SCENARIO_REPETITION_ENGINE_ACCEPTED is not released.

## 联机后的当前状态 / Current status after reconnection

精确8798ba9的push37423084327、PR37423138551、linkage37423138558均已终态SUCCESS；上文CI pending保留为较早检查历史。用户提供一次性配对码后，Alien在Mech City031fdba6-e94c-4298-a095-6ff04a65481d正式登记为成员dev-8128a1ef25c5c4b7f66fc31b21705858，两实体主机worker已在线，Android City ID一致。上文Alien未接入为历史观测。Mech Gateway源码仍NOT_OBSERVED，候选controlled campaign仍NOT_RUN；Owner端campaign权限是当前操作依赖，不是新的Owner验收豁免。review_complete=false，终态标记仍不释放。详见RESIDENT_CITY_RECHECK_Alien.md。

Exact8798ba9 push37423084327, PR37423138551 and linkage37423138558 are terminal SUCCESS; earlier CI-pending text is retained as history. After user-supplied one-time pairing, Alien enrolled as memberdev-8128a1ef25c5c4b7f66fc31b21705858 in Mech City031fdba6-e94c-4298-a095-6ff04a65481d. Both physical host workers are online and Android City ID matches; the earlier disconnected-Alien observation is historical. Mech Gateway source remains NOT_OBSERVED and the candidate controlled campaign NOT_RUN. Owner campaign authority is the current operational dependency, not an acceptance waiver. Review remains incomplete with no terminal marker; seeRESIDENT_CITY_RECHECK_Alien.md.

[完整中文阅读译本 / Chinese reading translation](./zh-CN/REVIEW_REPORT.md)

## 最新回查 / Latest recheck — 2026-10-06T07:00:04Z

上文CI pending是阶段快照，现已更新：8798ba9 exact push37423084327 / PR37423138551 / linkage37423138558 均终态SUCCESS。实体门槛仍NOT_RUN；[实际常驻City只读回查](./RESIDENT_CITY_RECHECK_Alien.md)确认Android与Gateway同City，但Alien offline且本地配置City不同。 / The earlier CI-pending statement is a stage snapshot: all three exact8798ba9 runs are now terminal SUCCESS. The physical gate remains NOT_RUN; the resident-City read-only check confirms Android/Gateway identity agreement, while Alien is offline and its local configuration names another City.
