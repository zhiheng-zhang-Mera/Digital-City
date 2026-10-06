# 全量文档整理记录 / Repository documentation maintenance

本维护记录落实 Owner 2026-10-06 步骤4，不是新的 mission 系列，不提供任务领取或验收权限。当前既有池的领取资格见 [回查报告](../mission-book/reports/POOL_RECHECK_Alien_2026-10-06.md)；可接取项为零不等于所有任务完成。

This maintenance record implements Owner step4 of2026-10-06. It is not a new mission programme and grants no claim or acceptance authority. Existing-pool eligibility is recorded in the [pool recheck](../mission-book/reports/POOL_RECHECK_Alien_2026-10-06.md); zero eligible tasks does not mean all tasks are complete.

## 范围与事实边界 / Scope and evidence boundaries

开始盘点时仓库有687份 Markdown，共6,382,409字节。范围包含根说明、12城区、Registry、活动及已归档 mission-book、future-development 解释材料；不翻译机器字段或源码来制造新的事实。SHOW不施工，新系列不激活。文档整理不改变这些执行开关。

The initial inventory contained687 Markdown files totaling6,382,409 bytes. Scope covers root guides,12 districts, Registry, active and archived mission-book explanations, and future-development material. Machine fields and source code are preserved rather than translated into new claims. SHOW work remains excluded and new programmes remain inactive; documentation maintenance changes neither execution boundary.

## 组织方式 / Organization

大目录 README 提供双语导航及快速信息；工作书 frontmatter 是任务事实来源，报告保存复现、失败和限界。完整语言阅读副本通常位于原目录 `en/` 或 `zh-CN/`，原稿追加互链。阅读副本不带权威工作书元数据，不成为第二份可领取工作书。根长篇架构说明移入 [English](./en/CITY_OVERVIEW_ARCHITECTURE.md) 与 [中文](./zh-CN/CITY_OVERVIEW_ARCHITECTURE.md)，根主页专注导航。

Large-folder READMEs provide bilingual navigation and quick information. Workbook frontmatter remains task authority; reports retain reproduction, failures and limitations. Complete reading translations normally live in adjacent `en/` or `zh-CN/` folders with reciprocal source links. They carry no authoritative workbook frontmatter and do not become claimable duplicate workbooks. The long root architecture guide is retained in [English](./en/CITY_OVERVIEW_ARCHITECTURE.md) and [Chinese](./zh-CN/CITY_OVERVIEW_ARCHITECTURE.md), while the homepage serves navigation.

## 当前交付与剩余检查 / Delivered areas and remaining checks

已整理12城区的说明与导航、根解释文档、mission-book常驻规范和工具说明、REX/MON/CEX系列规范及工作书正文、CEX报告、未来paper-factory解释和Registry导航。历史归档及其他既有报告按批次继续处理。此清单记录范围，不宣称全部历史解释已完成双语；每批保留原证据代码块并检查SHA、日期、标记、互链及frontmatter。

Completed areas include navigation and explanations across12 districts, root guides, standing mission-book rules and tooling, REX/MON/CEX programme rules and workbook bodies, CEX reports, future paper-factory explanations and Registry navigation. Historical archives and other existing reports continue in batches. This lists delivered areas without claiming complete bilingual coverage of all historical explanations. Each batch preserves original evidence blocks and checks SHAs, dates, markers, reciprocal links and frontmatter.

最新总量与待检查路径见 [DOCUMENTATION_INVENTORY.json](./DOCUMENTATION_INVENTORY.json)。`PAIR_PRESENT` 只说明语言副本存在；`BOTH_PRESENT_REVIEW_REQUIRED` 只说明检测到两种语言；`TRANSLATION_REVIEW_REQUIRED` 是人工检查提示。这些标签都不证明语义完整或质量达标，不能用词数门槛替代逐节翻译核对。

Current totals and inspection paths are in [DOCUMENTATION_INVENTORY.json](./DOCUMENTATION_INVENTORY.json). `PAIR_PRESENT` means a language peer exists, `BOTH_PRESENT_REVIEW_REQUIRED` detects both languages, and `TRANSLATION_REVIEW_REQUIRED` prompts manual inspection. None certifies semantic completeness or quality; word-count thresholds do not replace section-by-section translation checks.

## 编码与历史矛盾 / Encoding and historical contradictions

五份历史报告的无效UTF-8原字节保存在 [encoding-evidence](./encoding-evidence/PREIMAGE_INDEX.json)，索引绑定原路径、SHA256和字节数。不可恢复字符保留为明确缺失，不猜测补写。CEX-701已有损坏正文的可读副本明确绑定最后可读规范提交与当前完整英文复检来源；损坏历史保留。CEX-704复检的share结论前后矛盾在译本中保留并标注，不替作者升级为PASS。

Original invalid UTF-8 bytes from five historical reports are retained in [encoding-evidence](./encoding-evidence/PREIMAGE_INDEX.json), indexed by original path, SHA256 and byte count. Unrecoverable characters remain explicit gaps rather than guessed replacements. Readable CEX-701 views identify the last readable normative commit and current intact English review as separate sources; damaged history remains. Contradictory share statements in the CEX-704 review are retained and identified, without upgrading them to PASS.

## 重生成与检查 / Regeneration and checks

```text
python mission-book/tools/sync_mission_progress.py
python mission-book/tools/sync_documentation_navigation.py
python mission-book/tools/sync_mission_progress.py --check
python mission-book/tools/sync_documentation_navigation.py --check
python mission-book/tools/check_record_consistency.py
python mission-book/tools/test_check_record_consistency.py
```

导航生成器只更新明确的生成块和总量清单；不得掩盖任务记录冲突。链接检查区分历史失效与新增失效。编码证据和历史失败不删。既有任务的外部验收门槛释放后，先刷新依赖，再按任务代码领取已有可接取项。

The navigation generator updates designated generated blocks and inventory only; it must not hide task-record contradictions. Link checks distinguish historical and introduced failures. Encoding evidence and historical failures remain. When an external acceptance gate releases, refresh dependencies and claim eligible existing work in task-code order.
