# REX 分支整体复检、修补与合并 / Whole-branch review, correction and merge

验收并合并的对象是 `rex/REX-series-verify-mech-20261007` 的实际实现，已合并 Utopia main，PR #44。 / The implemented branch was reviewed, repaired and merged to Utopia main through PR #44.

- 原始交接 / Original handoff: `099edd2ca0de01545415935723dbad09087ecb27`。
- 验收候选 / Accepted candidate: `17271f04829877ee56668221afeda5fbd35f66e8`。
- main 合并提交 / Main merge commit: `db6b6f9dbba1266d6783774d659d4eef912929ff`。
- 复检实体主机 / Reviewing physical host: `Mera-Alianware`；原开发 / original development: Mech / MEGA-REP。
- 最终候选全套 CI / Final candidate full CI: [37584030685](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37584030685) SUCCESS。
- 合并后 main 全套 CI / Post-merge main full CI: [37584814818](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37584814818) SUCCESS。
- 整系列及共存影响面 / Whole-series and coexistence surfaces: 300/300 PASS（此前冻结 REX 单系列及影响面 210/210 / previous REX-only and affected surfaces 210/210）；原始日志与 checksums / logs and checksums: [evidence](alien-evidence-2026-10-07/)。

## 范围与完整性 / Scope and completeness

原分支已含 REX-801..806，却未包含开发完成的 REX-807 `9ad888279be07220fe7ac7d91e419e8fe69fc439`。该规范实现已补入，再作复检修补。REX-807 的 Web 控制、危险操作隔离、指标/排除原因、技术详情和 Android 只读观察路径已验收；REX-890 的新实体多机独立研究复现尚未执行，未释放 `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE`。 / The handoff omitted the completed canonical REX-807 increment; it was integrated and corrected. REX-807 exposure is accepted. A new physical multi-device REX-890 study remains NOT_RUN; no programme freeze marker is released.

在合并前 main 被另一流程推进到 `a1bb0937defc29af686cb40f1a21340731d4d7a3`（已包含 DGX/CHK）。旧 main 检查拦下了最初合并，随后整合最新 main；唯一 app.js 冲突保留完整 REX Research owner/export 接线与独立 Governance render/reset。重跑浏览器 11/11、三系列共存及完整托管 CI，再合并。上述原始 REX、规范 REX-807、最新 main、DGX e5 与 CHK 9a 均以 Git 祖先检查确认包含在最终 main。 / A concurrent flow advanced main with DGX/CHK. The stale-base merge was stopped; the combined candidate retained both Web render paths, passed coexistence validation, and preserves all five ancestor SHAs in the receipt.

Owner 授权 / authorization: “云端存在REX系列的完整完成分支rex/REX-Series-verify-mech-20261007，head=099edd2ca0de。 对这个完整分支进行验收和修补，完成后合并到main。” 常驻规则 §3 明确允许独立 Reviewer 直接修复范围内缺陷；诊断子代理来自同一实体主机，不冒充第二实体主机。 / The owner explicitly authorized review, correction and main merge. Construction Rules §3 allows the independent reviewer to repair in-scope defects. Same-host diagnostic agents are not counted as extra physical hosts.

## 缺陷与复检 / Defects and verification

1. Set 地址列表被数组守卫丢弃；支持 Array/Set，使用实际绑定端口及本机网卡地址。当前已识别 City ID 的路径仍是主要判据，地址兜底缺陷不夸大成已观察网络暴露。 / Fixed the Set/array mismatch and real endpoint context; identified City ID remains primary.
2. 离线 host 别名覆盖在线 canonical node；改为稳定选择未退役在线目标，保持 nodeId、能力、遥测及 presence 一致。 / Stable live-host selection preserves execution identity and capabilities.
3. 不靠共享 NT build 猜 Windows 版本，改用实测 `os.version()`；新 Darwin 版本不套无限偏移公式。现代设备卡片也显示转义后的实测平台。 / Product labels use measured Windows edition; unknown Darwin versions stay generic. Modern cards show escaped platform facts. Sources: [Microsoft Server builds](https://learn.microsoft.com/en-us/windows/release-health/windows-server-release-info), [Apple Tahoe naming](https://support.apple.com/en-ca/122867).
4. REX-807 原 CSV 按 JSON 包装下载、真实指标/排除原因未接线、成员被误称 Owner、campaign 读取失败被吞掉、Android boolean unfinished 被按数组读取；均用真实 Gateway/浏览器反例或 Android 单测修补。 / Corrected CSV bytes, actual artifact observability, member authority wording, unknown/error handling and Android unfinished status.
5. 浏览器确认自己优先、旧离线行隐藏但原始记录仍存、平台真实、刷新后 QR/码不旋转；导出 CSV 与 Gateway 字节一致，真实成员不获 Owner 导出、读取失败可见且刷新可恢复。 / Browser checks exercise the shipped paths rather than copied predicates.

## 保留的失败与证据边界 / Preserved failures and evidence limits

首次本地全量 1482 项中 1476 PASS、6 FAIL；依赖安装时序和修补期间源树变化使其不能绑定为有效 exact-SHA 验收。后续冻结 `bc34fd3` 全量 1486 项中 1483 PASS、3 FAIL，未改动 main 复跑也在同三项驻留 City 协调端口守卫失败，未停用 City。冻结 `ee4f9a7` 的 1504 项中 1498 PASS、6 FAIL：同三项端口守卫，以及其 worktree 缺少 City parser dependencies 的三项失败；最终 v2 已安装两个 frozen lockfile，相关 adapter/inventory/roads 复跑 12/12 PASS。最终候选及合并后 main 的全套托管 CI 均成功。 / Initial mixed-state output is invalid for exact-SHA acceptance. Frozen runs preserve resident-City guards and missing City-dependency failures; the dependency-affected tests re-run 12/12 after installing both lockfiles. Clean hosted candidate and main validation passed.

历史 REX-806 包独立 Node 校验 14/14，10 份文件与 Git blob checksum 一致；Python 从 canonical task 时间戳重算 completion_time 中位数 6595ms，n=22；24 runs 中 4 个指标实测、23 个 NOT_MEASURED。Python 首两次错误假设（均值、receipt duration）导致断言失败，修正后重算一致。这是历史包复算，不是新物理 study，也不把未知干预或故障恢复变为 0/PASS。 / Historical artifact recomputation is bounded and preserves unavailable metrics and two instrument corrections; it does not satisfy the new REX-890 study.
