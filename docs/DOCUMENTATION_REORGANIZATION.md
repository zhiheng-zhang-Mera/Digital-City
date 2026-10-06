# 文档总量整理记录 / Documentation reorganization record

## 范围与导航 / Scope and navigation

本轮覆盖仓库根说明、十二个城区、能力注册表说明、future-development、预设硬件布局，以及 Mission Book 的活动、停放、未来和历史任务说明、规则与报告。原目录和被引用的证据路径保留；长篇架构和历史正文通过中英阅读副本提供。根及大目录 README 提供子区入口、文档数量、任务快速面板和完整正文链接。总量见 [清单](DOCUMENTATION_INVENTORY.json)；文档数量不是运行验收或翻译完整性的自动证明。

This round covers root guides, twelve districts, capability-registry explanations, future-development, hardware presets, and Mission Book's active, parked, future and historical task guides, rules and reports. Existing directories and referenced evidence paths remain available. Full architecture and historical explanations have Chinese/English reading versions. Root and large-directory READMEs provide area navigation, document counts, task dashboards and links to complete explanations. The [inventory](DOCUMENTATION_INVENTORY.json) records totals; counts do not automatically establish runtime acceptance or complete translation.

## 原稿、读本与任务事实 / Sources, readers and task truth

工作书原始 frontmatter 继续决定任务状态、领取、依赖、精确版本和验收。语言读本没有可注册工作书 frontmatter；模板 YAML 作为代码例子展示。停放系列没有被启动，SHOW 没有被施工。系列面板和主任务板直接读取原工作书；读本中的旧 CI、未执行、失败、撤回、更正和旧阶段仍是有日期的历史，不能因翻译而变成新的 PASS。

Original workbook frontmatter still determines state, claims, dependencies, exact revisions and acceptance. Readers have no registrable workbook frontmatter; template YAML appears as a code example. Parked programmes were not activated and SHOW was not executed. Programme and main dashboards read canonical workbooks directly. Old CI, unexecuted checks, failures, withdrawals, corrections and earlier stages remain dated history rather than new PASS claims created by translation.

## 证据与编码 / Evidence and encoding

REX-803 固定原始包保持六份 JSON 与 MATERIAL_INDEX；REX-805 两次实体包分别绑定其候选，索引译本和独立核验均放在包外。原始 payload 不生成额外 README，也不把作者或 reviewer 的派生结果混入原包。所有声明精确字节的 REX 材料与六份编码原件使用 `-text` 禁止 Git 换行转换；导航检查另核对原件长度/hash，拒绝静默修复或替换声明值。

The fixed REX-803 packet retains six JSON files and MATERIAL_INDEX. REX-805's two physical packets each retain their candidate binding; translated indexes and independent checks live outside them. Raw payloads receive no extra generated README and no author/reviewer derived output. Indexed exact-byte REX materials and six encoding preimages use `-text` to prevent Git newline conversion. Navigation checks additionally verify preimage lengths/hashes and refuse silent repair or replacement of declared values.

不可逆编码内容保留 [原字节与索引](encoding-evidence/PREIMAGE_INDEX.json)，阅读入口明确哪些含义无法恢复；ASCII 投影不是语义重建。四份历史规范读本的来源和精确版本见 [来源审计](../mission-book/finished/READING_TRANSLATION_PROVENANCE.md)。现存说明中的历史凭据行已脱敏，没有宣称清除了 Git 历史。

Irrecoverable encoding preserves [original bytes and their index](encoding-evidence/PREIMAGE_INDEX.json); reading entries identify meanings that cannot be recovered. An ASCII projection is not semantic reconstruction. The [provenance audit](../mission-book/finished/READING_TRANSLATION_PROVENANCE.md) records sources and exact revisions for four historical normative readers. Historical credential lines in current explanatory text are redacted; Git-history erasure is not claimed.

## 核验与维护 / Verification and maintenance

全文补齐按原解释正文、独立章节及边界进行人工核对，不将双语标题、术语或摘要当作全文。各批次核对来源前缀、证据代码块、SHA/日期、链接和读本权限；另完成高风险工具/材料的独立审查。每次合并任务记录后，先同步任务进度，再生成导航与总量清单。只读 CI 检查状态、依赖、导航、原件及回归，不靠重新生成来掩盖漂移。

Full translations were checked against actual explanatory prose, independent sections and boundaries; bilingual headings, terms and summaries were not treated as full coverage. Batches checked source prefixes, evidence blocks, SHA/dates, links and reader authority, with an independent review of high-risk tools/materials. After merging task records, synchronize task progress before regenerating navigation and inventory. Read-only CI checks states, dependencies, navigation, preimages and regressions without regenerating files to conceal drift.

```bash
python mission-book/tools/sync_mission_progress.py
python mission-book/tools/sync_documentation_navigation.py
python mission-book/tools/test_check_record_consistency.py
python mission-book/tools/test_documentation_preservation.py
python mission-book/tools/check_record_consistency.py
python mission-book/tools/sync_dependency_state.py --check
python mission-book/tools/sync_mission_progress.py --check
python mission-book/tools/sync_documentation_navigation.py --check
```

运行检查的成功不替代实体联机、用户意图或产品 main 合并授权；任务交付和正式验收仍各自引用其原始材料。 / Successful documentation checks do not replace physical linkage, intent research or product-main merge authority. Task delivery and formal acceptance still reference their respective original materials.
