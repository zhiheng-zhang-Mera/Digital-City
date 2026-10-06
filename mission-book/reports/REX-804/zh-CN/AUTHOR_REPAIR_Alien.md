# REX-804 退回 finding 修复

[Bilingual source / 双语原报告](../AUTHOR_REPAIR_Alien.md)。阅读译本保留每次历史 snapshot；current workbook/report 仍为 authority。

原 f76ccf5 NOT_PASSED 保留。Alien 独立复现两个已发布 receipt guards 原代码 2 FAIL，不可读 record 使 City 构造失败并遗留锁；采纳 minimal19a420c 后 focused12 PASS。新候选 `f4ceae734d1d32a7d8950cd5872264135e6073ac` 发布 PR30，当时 exact CI pending、development_complete 暂 false。Mech 必须复验新 head，作者不 self-accept。

Registry vocabulary 修为 COMPLETE/VERIFIED/PARTIAL/NOT_TESTED、class DIRECT_CONTROL，补 individual receipt GET。PARTIAL 保留缺 Android controls。DUPLICATE_EVENT recovery 结构性 NOT_MEASURED，PROVIDER_UNAVAILABLE 只在 claim seam，非 external provider；两限制保留，不夸作 provider 恢复证据。candidate 包含 red/green raw logs 与双语 repair docs。

## CI 测量更正

f4ceae7 两 run 因 50ms unit-clock 假设失败；独立 70ms 延迟使 fault 正确过期、heartbeat 允许，原 assertion 未控制时钟。只修 unit fixture 注入 clock，产品语义和拒绝/stop/real timer expiry 断言保持；8 unit PASS。candidate075ddc13869664bfbf14fa07dae99ea76a6a4b3c 当时 CI pending。

## Current-main 兼容性复现与修复

075ddc1 push37423677731 成功、PR37423681875 失败。merge main b06504f 后，两个独立 probe 复现 unavailable research/faults dir 使 City construction 失败，违反 CEX-790 degraded-storage 保证。目录 discovery 已 guard，公开 UNAVAILABLE/storeReason；inject 返回 503 FAULT_STORE_UNAVAILABLE，normal task 可用。Web Danger Zone 双语 reason、禁用 inject 但保留 refresh。原 red logs 与错误 WAIT payload 中间失败保留，按真实 API contract 修 probe 后相关 19 PASS。

final candidate `fe700aba957990f93b22fd63d594ddfff7b4e243`，[PR30](https://github.com/zhiheng-zhang-Mera/utopia/pull/30)。exact push37424946247、PR37424951038、linkage37424951044 全部终态 SUCCESS。development_complete=true 仅表示开发交回复验；Mech 旧 f76ccf5 NOT_PASSED 仍作历史。新候选未正式 accepted，FAULT_INJECTION_RECOVERY_ACCEPTED 不释放；Android/external-provider 物理恢复未测量。
