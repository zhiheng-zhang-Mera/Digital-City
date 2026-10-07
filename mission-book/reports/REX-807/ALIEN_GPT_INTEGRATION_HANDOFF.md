# Alien-GPT 整合复检交接 / Integration review handoff

角色 / Role: **Alien-GPT**. 候选 / Candidate: `2decc71b2b9a3d0e66293498f4f1676e461da8da`, [Utopia PR #43](https://github.com/zhiheng-zhang-Mera/utopia/pull/43).

Mech 冻结头 `9ad888279be07220fe7ac7d91e419e8fe69fc439` 的聚焦与相邻守卫 25/25 通过，包括真实浏览器确认与下载。该分支不含后续已验收的 REX-806 `cc799234e7daa3d8ccfde5673b9d07ccb2376742`，是依赖整合缺口，不能指控 807 提交主动回退修复。

Focused and adjacent checks at the frozen Mech head: 25/25 pass, including actual browser confirmation and download. This branch predates the accepted REX-806 repair head; the finding is a dependency integration gap, not a deliberate rollback by its commits.

从已验收 806 复制原始 verifier 守卫到忽略的 runtime 目录、保持相对模块路径后重跑：13 项中 6 通过、7 失败；其中两项夹具读取缺失的 canonicalTaskRuns 字段抛错，按兼容性失败保留，不冒充七个独立产品缺陷。补入已验收依赖后组合守卫 34/34 通过。原始失败、成功、安装及旧 Mech 续连超时日志按字节索引保存。

Re-running the accepted 806 verifier guards from the ignored runtime directory (preserving relative imports): 6/13 pass, seven failures. Two fixture failures read absent canonicalTaskRuns fields; these are compatibility failures, not seven independently established product defects. After merging the accepted dependency, the combined checks pass 34/34. Raw red, green, installation and old-Mech connection timeout evidence is byte-indexed.

对侧 Mech 请审查 PR43 的唯一 merge 提交与组合头，并给出明确评语；在 Mech 对本修改给出许可前不合并。REX-807 marker、REX-890 和系列 PASS 均未释放。当前 `172.31.12.151:4391` 会话续连超时，正在等待当前 City 地址/ID（必要时新配对码）；未把本机隔离测试当作真实联机。

Mech should review PR43's single merge commit and integrated head and provide an explicit verdict. No merge before approval of this modification. REX-807's marker, REX-890 and programme PASS are not released. Session renewal at the old endpoint times out; current City address/ID and, if required, a fresh pairing code are pending. Isolated local tests are not physical linkage acceptance.

本机 raw evidence: `.runtime/evidence/mission-book/REX-807/2026-10-07-alien-gpt/`。论文素材保留失败分类：依赖头漂移、导出指标语义/精度、源关联缺失、端点不可达；无新 research study 计数，也不提升旧实验结论。

Local raw evidence remains under the Utopia runtime evidence tree. Paper-material classifications: dependency-head drift, export metric semantics/precision, missing source associations and endpoint unreachability. No new study counts or upgraded historical conclusions are claimed.

组合头 `2decc71` 的 REX-801–807 全部本机系列套件：152/152 通过、0 跳过，耗时 94.1 秒。该结果覆盖本机产品/浏览器守卫，不替代对侧独立验收或实体 multi-device study。 / All local REX-801–807 suites at integrated head `2decc71`: 152/152 pass, zero skips, 94.1 seconds. This covers local product/browser guards, not opposite-host independent acceptance or a physical multi-device study.
