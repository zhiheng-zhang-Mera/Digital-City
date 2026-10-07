# PCF-701 复检进度：Windows CPU 反例 / Windows CPU counterexample

作者候选 / Author candidate: `4e97d503989beba82124a1b6e3286825f33b92fc`; Alien复检原头33/33，审计包8/8。但真实Windows样本把CPU报为0：来源os.loadavg固定[0,0,0]，不是测量。依据：[Node官方文档](https://nodejs.org/api/os.html#osloadavg)。 / Independent baseline checks pass33/33 and the audit packet8/8, but a real Windows sample publishes CPU0 from Node's fixed Windows loadavg placeholder. This is a measurement-source defect, not observed idle capacity.

四个自造反例在原头全红：Windows首样本不应填0；计数区间应有真实busy/total；reset应unknown后重建区间；缺计数或无增长不应填0。 / Four counterexamples fail on the author head: warmup, genuine counter intervals, reset/recovery, and missing or unchanged counters.

修复 / Repair: `cf07f4acb3be0fe3e734ed39bf9145348e2d7ba8`, [PR41](https://github.com/zhiheng-zhang-Mera/utopia/pull/41), based on the immutable author head. Windows reads per-core CPU-time deltas; invalid/reset/unchanged/warmup remains unavailable. POSIX unchanged. No privileged tools, Gateway wiring or deployed product changes. 四套相关测试37/37，双语检查通过；只读代码审查未发现阻断，但不是Mech实体复检。

独立证伪三处：删除memory.free>total守卫、放过zero-byte throughput、恢复Windows占位来源，三者均使测试退出1，且修改后按原字节恢复。 / Three independent source mutations are caught with exact-byte restoration: inconsistent RAM facets, zero-byte throughput, and Windows placeholder CPU.

Alien真实采样：首CPU UNKNOWN，后续三次CPU为有限ratio；RAM total/free和每次采样overheadMs同时保存。该样本绑定cf07f4a；原头假零样本保留。 / Real Alien collection retains warmupUNKNOWN, three finite CPU ratios, RAM facets and collection overhead, bound tocf07f4a. The original false-zero sample remains preserved.

可选GPU/VRAM、电池、温度适配器缺席按任务书允许的UNSUPPORTED处理，不阻断基础收集；CPU为基础项，必须修复，不能套用可选豁免。 / Optional GPU/VRAM, battery and thermal absence may remain explicitlyUNSUPPORTED under the workbook; CPU is basic collection and cannot use that exemption.

## Mech独立复检与两主机采样 / Mech verification and two-host sampling

请独立检查修复cf07f4a，并在Mech该checkout中将本报告旁 `evidence-tools/LIVE_SAMPLE_ALIEN.mjs` 复制到 `.runtime/pcf701-live-sample.mjs`，两步frozen安装后执行： / Independently inspectcf07f4a and copy the adjacent sampling helper into that checkout's.runtime path, then run after both frozen installs:

```powershell
$env:PCF_REVIEW_HEAD='cf07f4acb3be0fe3e734ed39bf9145348e2d7ba8'
node .runtime/pcf701-live-sample.mjs .runtime/pcf701-mech-cpu-memory.json
```

把Mech样本返回给Alien以独立消费与比对host/SHA/presence/CPU/RAM/overhead。采样仅用Node系统API，持续约一秒，不读凭据。 / Return the Mech sample to Alien for independent origin consumption ofhost/SHA/presence/CPU/RAM/overhead. Sampling uses Node system APIs for about one second and reads no credentials.

两主机采集与返回消费NOT_RUN；修复CI仍运行；review_complete:false、merge_authority:false，不释放任何marker。 / Two-host collection and return consumption remainNOT_RUN, repair CI is running, review_complete and merge_authority remainfalse; no marker is released.

[原始材料与哈希 / Raw materials and hashes](intermediate-logs/2026-10-07-alien/INDEX.json)。首次安装corepack不可用，改用环境现有pnpm11.19.0成功；不把命令缺失当产品缺陷。 / Corepack was unavailable; existingpnpm11.19.0 completed the installs. A missing installer command is not a product defect.
