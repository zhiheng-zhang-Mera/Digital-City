# REX-804 退回项修复 / Returned finding repair

原复检f76ccf5的NOT_PASSED结论保留。Alien独立运行reviewer已发布的两项回执守卫：原代码2 FAIL，其中不可读记录使City构造失败并遗留锁；采纳minimal19a420c后，全部12项相关测试通过。发布新候选f4ceae734d1d32a7d8950cd5872264135e6073ac，PR30；exact-head CI待终态，development_complete暂为false。

The NOT_PASSED verdict on original f76ccf5 remains. Alien independently reproduced both published receipt guards failing, then adopted minimal19a420c; all12 focused tests pass. New candidate f4ceae734d1d32a7d8950cd5872264135e6073ac is published to PR30; exact-head CI pending and development_complete withheld until green. Mech must re-verify the repaired head; no self-acceptance.

Registry vocabulary repaired: COMPLETE / VERIFIED / PARTIAL / NOT_TESTED, class DIRECT_CONTROL; missing individual-receipt GET route restored. PARTIAL preserves absent Android fault controls. DUPLICATE_EVENT recovery is structurally NOT_MEASURED; PROVIDER_UNAVAILABLE acts on claim seam, not a real external provider. Both limitations retained, not inflated into recovered provider evidence. Raw red/green logs and bilingual repair docs are committed at the candidate head.

## CI测量更正 / CI measurement update

f4ceae7两组CI因unit fixture50ms时序假设失败；70ms延迟独立复现故障已过期，普通heartbeat正确允许，原断言缺少时钟控制。只修unit fixture使用注入时钟，所有拒绝/停止/真实timer expiry断言保留；8unit PASS。最终candidate075ddc13869664bfbf14fa07dae99ea76a6a4b3c新CI待终态。 / Both f4ceae7 runs failed a50ms unit-clock assumption; an independent70ms delay reproduced correct expiry and permitted heartbeat. Unit clocks now controlled; product semantics and refusal/stop/timer-expiry assertions preserved.8 unit tests pass; final candidate075ddc1 CI pending.

## 新 main 兼容性复现与修复 / Current-main compatibility repair

075ddc1 的 push37423677731 成功，但 PR37423681875 失败。与 b06504f main 合并后，两项独立守卫复现：不可用的 research/faults 目录仍使 City 构造失败，破坏 CEX-790 的存储降级保证。新增目录发现守卫，公开 UNAVAILABLE/storeReason；故障注入拒绝为503 FAULT_STORE_UNAVAILABLE，普通任务保持可用。Web Danger Zone 双语显示存储原因并禁用注入，刷新保留。原红灯日志及一次错误 WAIT 测试 payload 的失败日志均保留；修正为实际 API 合约后19项相关测试通过。

Push37423677731 succeeded on075ddc1, but PR37423681875 failed. After merging main b06504f, two independent probes reproduced City construction failing with an unavailable research/faults directory, violating the CEX-790 degraded-storage guarantee. Directory discovery is now guarded, UNAVAILABLE/storeReason disclosed, and injection returns503 FAULT_STORE_UNAVAILABLE while normal tasks remain usable. The Web Danger Zone shows the reason in both languages and disables injection while retaining refresh. Red logs and an intermediate invalid WAIT test-payload failure remain preserved; corrected API-contract probes and related tests total19 PASS.

最终候选 / Final candidate: `fe700aba957990f93b22fd63d594ddfff7b4e243`, [PR30](https://github.com/zhiheng-zhang-Mera/utopia/pull/30). Exact-head push37424946247、PR37424951038、linkage37424951044 均终态 SUCCESS；development_complete=true，仅表示开发交回复核。Mech 对旧 f76ccf5 的 NOT_PASSED 保留；新候选未正式验收，FAULT_INJECTION_RECOVERY_ACCEPTED 不释放，Android/外部 provider 实体恢复仍未测量。

All three exact-head runs are terminal SUCCESS. Development is complete for re-review; Mech's NOT_PASSED verdict on original f76ccf5 remains historical. The new candidate is not formally accepted, the terminal marker stays withheld, and Android/external-provider physical recovery remains unmeasured.


[完整中文阅读译本 / Chinese reading translation](./zh-CN/AUTHOR_REPAIR_Alien.md)
