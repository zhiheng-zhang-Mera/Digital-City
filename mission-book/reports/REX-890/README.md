# REX-890 report set / 本工作书的报告集

本目录是 **REX-890（独立可复现性 study + V1 冻结）报告集的入口**。
工作书本体：[已归档工作书](../../finished/completed-2026-10-08/research-strengthening/REX-890-reproducibility-study-and-freeze.md)

**最终状态 / Final status (2026-10-08): COMPLETE.** Alien 独立实体复现通过，exact-head CI 37731833084 success，Owner 明确批准 exposure PASS 并完成收尾；终标 `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE` 已释放。见 [独立复核报告](REVIEW_REPORT.md)、[exposure 复核](EXPOSURE_REVIEW_ALIEN.md)、[Owner 裁决](OWNER_EXPOSURE_RULING_2026-10-08.md)。以下开发机交接说明保留为历史记录，旧 NOT_RUN/未释放描述不代表最终状态。

## 这里有什么 / What is here

| 文件 | 谁写的 | 是什么 |
|---|---|---|
| `README.md` | Mech | 本索引 |
| `DEVELOPMENT_REPORT.md` | Mech | 开发报告：做了什么、证据在哪、**不**声称什么 |
| `REVIEW_HANDOFF_Mech.md` | Mech | 给复检方的交接：要跑什么、要判什么 —— **不是**复检结论 |
| `ALIEN_VERIFICATION_2026-10-08.md` + `evidence/` | **Alien-codex（对侧）** | 对侧的代码验证与收尾交接：六条 false-success 已复现并修好（7/7）、全量套件**不声称全绿**、实体复现仍 `NOT_RUN`、终标未释放。已 cherry-pick 进 `main` 并保留作者与出处 |
| `RESPONSE_TO_ALIEN_VERIFICATION_2026-10-08.md` | Mech | 本机对那份报告的答复：两项输入的答复（Owner 配置带外交付 + **要用的包在分支里，不是它点名的旧路径**）、确切命令与期望值、自其基线以来的变化 |
| `EXPOSURE_GATE_PACKET.md` | Mech | 给 **Owner** 的 exposure gate 审阅材料（§14A.5 五字段 + 六项独立检查逐项指向证据 + 未建立项）—— **不是**裁决 |
| `CLOSEOUT_CHECKLIST.md` | Mech | 对侧宣布复现结论**之后**那一刻用的收口清单（触发条件、要核对的字段、门槛、归档、不许做的事）—— **已备好，未执行** |
| `tools/audit_gate_doc_refs.py` | Mech | 本目录四份**决定用**文档的引用审计（路径/仪器是否真的存在；"应缺席"的 `REVIEW_REPORT.md` 单独豁免）。**实测 0 缺失** |
| `REVIEW_REPORT.md` | **Alien-GPT（独立对侧）** | 最终实体复现结论，及原始证据；由独立复检主机完成 |

## REX-890 的实质材料在哪 / Where the substance lives

```text
最终素材（工作书点名要生成的那一份）
  reports/REX-PROGRAMME/RESEARCH_MATERIAL_SYNTHESIS.md
    §6B 逐项：experiment/run/failure 计数 · defect taxonomy · review-only findings ·
               reproducibility delta（能复现什么、不能复现什么）· 未建立项 · potential paper directions
  §7 只写一件事：对侧还缺什么输入、期望值是多少、以及凭据的范围与轮换

同目录的其他 REX-890 报告
  reports/REX-PROGRAMME/REX-890_CLAIM_READINESS_MECH.md        领取前预检
  reports/REX-PROGRAMME/REX-890_BOOTSTRAP_HANDOFF_Mech_2026-10-07.md
  reports/REX-PROGRAMME/REX-890_DEV_STUDY_Mech_2026-10-07.md    study 仪器/结果

代码与证据（utopia 仓，分支 feat/city-owner-remote-operation）
  scripts/rex890-dev-study.mjs                 study 仪器（参数化、可从裸检出重跑）
  scripts/rex890-opposite-host-reproduce.mjs   复现工具（对侧要跑的就是它）
  evidence/raw/rex890-studies/2026-10-08-B/    包（13 文件）+ 包外清单 + README
                                              + 本机彩排的原始报告（逐字节入库）
  evidence/raw/rex890-dev-study/artifact/      旧包，**故意保留**：它证明了"包可以活得比它指向的城市状态更久"
```

## 开发机交接时状态 / Historical handoff status

```text
development_complete  true   （2026-10-08，head 3143260，CI run 37720240214 success）
review_complete       false  （等对侧独立复现；本机只做彩排，且明说是彩排）
merge_authority       false
terminal_marker       RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE  —— 尚未释放
```

**final gate 的三项条件**（工作书 §Final gate）：① 对侧独立 reproduction 成功；② exact-head CI green；
③ 用户 exposure gate PASS。目前只有 ② 成立，因此终标**未**释放、REX-890 **未**收口。

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **10**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|

### 本目录说明 / Local documents

- [ALIEN_VERIFICATION_2026-10-08.md](ALIEN_VERIFICATION_2026-10-08.md)
- [CLOSEOUT_CHECKLIST.md](CLOSEOUT_CHECKLIST.md)
- [DEVELOPMENT_REPORT.md](DEVELOPMENT_REPORT.md)
- [EXPOSURE_GATE_PACKET.md](EXPOSURE_GATE_PACKET.md)
- [EXPOSURE_REVIEW_ALIEN.md](EXPOSURE_REVIEW_ALIEN.md)
- [OWNER_EXPOSURE_RULING_2026-10-08.md](OWNER_EXPOSURE_RULING_2026-10-08.md)
- [RESPONSE_TO_ALIEN_VERIFICATION_2026-10-08.md](RESPONSE_TO_ALIEN_VERIFICATION_2026-10-08.md)
- [REVIEW_HANDOFF_Mech.md](REVIEW_HANDOFF_Mech.md)
- [REVIEW_REPORT.md](REVIEW_REPORT.md)

<!-- DOCUMENT_NAVIGATION:END -->
