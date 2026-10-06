# REX-804 退回项修复 / Returned finding repair

原复检f76ccf5的NOT_PASSED结论保留。Alien独立运行reviewer已发布的两项回执守卫：原代码2 FAIL，其中不可读记录使City构造失败并遗留锁；采纳minimal19a420c后，全部12项相关测试通过。发布新候选f4ceae734d1d32a7d8950cd5872264135e6073ac，PR30；exact-head CI待终态，development_complete暂为false。

The NOT_PASSED verdict on original f76ccf5 remains. Alien independently reproduced both published receipt guards failing, then adopted minimal19a420c; all12 focused tests pass. New candidate f4ceae734d1d32a7d8950cd5872264135e6073ac is published to PR30; exact-head CI pending and development_complete withheld until green. Mech must re-verify the repaired head; no self-acceptance.

Registry vocabulary repaired: COMPLETE / VERIFIED / PARTIAL / NOT_TESTED, class DIRECT_CONTROL; missing individual-receipt GET route restored. PARTIAL preserves absent Android fault controls. DUPLICATE_EVENT recovery is structurally NOT_MEASURED; PROVIDER_UNAVAILABLE acts on claim seam, not a real external provider. Both limitations retained, not inflated into recovered provider evidence. Raw red/green logs and bilingual repair docs are committed at the candidate head.

## CI测量更正 / CI measurement update

f4ceae7两组CI因unit fixture50ms时序假设失败；70ms延迟独立复现故障已过期，普通heartbeat正确允许，原断言缺少时钟控制。只修unit fixture使用注入时钟，所有拒绝/停止/真实timer expiry断言保留；8unit PASS。最终candidate075ddc13869664bfbf14fa07dae99ea76a6a4b3c新CI待终态。 / Both f4ceae7 runs failed a50ms unit-clock assumption; an independent70ms delay reproduced correct expiry and permitted heartbeat. Unit clocks now controlled; product semantics and refusal/stop/timer-expiry assertions preserved.8 unit tests pass; final candidate075ddc1 CI pending.
