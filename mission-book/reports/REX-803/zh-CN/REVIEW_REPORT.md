# REX-803 对机复检阶段报告

[Bilingual source / 源报告](../REVIEW_REPORT.md)。阅读译本保留该历史快照；当前任务事实仍以工作书与最新源报告为准。

Reviewer Alien/MERA-ALIANWARE，developer Mech/MEGA-REP。初始 a695bb9 独立复现作者提案中 5 个失败 probe，采纳 07e8c3c/42acdc6。当前 review head `8798ba9dd37051626033ad72080b2fad3ff66149`，PR37，包含 current main b06504f 但未将此任务 merge 到 main。

独立发现与修复：损坏 state 阻断构造，现披露并拒绝 resume；resume scenario 漂移与 context 验证/执行不一致，现验证原 identity/context；readiness 拒绝摧毁 continuation，现保留原中断记录；timeout 后 late cleanup 跨 run，现每 run 独立 scope；恢复 bounds 与 measurement/state/warmup 矛盾，现严格验证；冻结 study clock 破坏 bounded close，现用 monotonic clock。

最终受影响 integration71 PASS，独立 critic8 PASS，无剩余重要技术 finding。中间完整套件 1379 PASS，但当时继续修复，不能作为最终 immutable-head full-suite 证据。该报告记录 exact hosted8798ba9 CI pending；原始/失败日志保留在产品 evidence/raw/mission-book/REX-803/alien-review。

实体门槛未观测：本机 reference node 未加入同一 live City，作者记录 Alien offline。同机两个逻辑 worker 不能满足两个实体主机。physical campaign 与 final CI 通过前，review_complete=false，SCENARIO_REPETITION_ENGINE_ACCEPTED 不释放。

## 最新回查 / Latest recheck — 2026-10-06T07:00:04Z

上文CI pending是阶段快照，现已更新：8798ba9 exact push37423084327 / PR37423138551 / linkage37423138558 均终态SUCCESS。实体门槛仍NOT_RUN；[实际常驻City只读回查](../RESIDENT_CITY_RECHECK_Alien.md)确认Android与Gateway同City，但Alien offline且本地配置City不同。 / The earlier CI-pending statement is a stage snapshot: all three exact8798ba9 runs are now terminal SUCCESS. The physical gate remains NOT_RUN; the resident-City read-only check confirms Android/Gateway identity agreement, while Alien is offline and its local configuration names another City.


## 联机后的当前状态 / Current status after reconnection

精确8798ba9的push37423084327、PR37423138551、linkage37423138558均已终态SUCCESS；上文CI pending保留为较早检查历史。用户提供一次性配对码后，Alien在Mech City031fdba6-e94c-4298-a095-6ff04a65481d正式登记为成员dev-8128a1ef25c5c4b7f66fc31b21705858，两实体主机worker已在线，Android City ID一致。上文Alien未接入为历史观测。Mech Gateway源码仍NOT_OBSERVED，候选controlled campaign仍NOT_RUN；Owner端campaign权限是当前操作依赖，不是新的Owner验收豁免。review_complete=false，终态标记仍不释放。详见RESIDENT_CITY_RECHECK_Alien.md。

Exact8798ba9 push37423084327, PR37423138551 and linkage37423138558 are terminal SUCCESS; earlier CI-pending text is retained as history. After user-supplied one-time pairing, Alien enrolled as memberdev-8128a1ef25c5c4b7f66fc31b21705858 in Mech City031fdba6-e94c-4298-a095-6ff04a65481d. Both physical host workers are online and Android City ID matches; the earlier disconnected-Alien observation is historical. Mech Gateway source remains NOT_OBSERVED and the candidate controlled campaign NOT_RUN. Owner campaign authority is the current operational dependency, not an acceptance waiver. Review remains incomplete with no terminal marker; seeRESIDENT_CITY_RECHECK_Alien.md.
