# REX 系列状态反查：用实现仓库的推送记录核对工作书 / REX series reconciliation against the pushed record

作者 / author: Mech-DS（`MEGA-REP`）· 时间 / at: 2026-10-06 · 目的：把「工作书声称的状态」与「实现仓库里真实存在的分支/提交/CI」逐条对上 / matching each workbook's claim to what the implementation repo actually holds

> 工作书是**主张**，推送记录是**事实**；本记录只报告两者的对照结果，不改工作书字段（除非对照结果要求更正）。 / A workbook is a claim and the pushed record is the fact; this record reports the comparison and only corrects what the comparison requires.

## 方法 / Method

工具 [`REX_SERIES_STATUS_RECONCILE_MECH.py`](./REX_SERIES_STATUS_RECONCILE_MECH.py)（只读）：读 8 本 REX 工作书的 frontmatter，对每个声明的 SHA 实测

```text
git cat-file -e <sha>                      声明里的提交是否真的存在于远端
git merge-base --is-ancestor <sha> origin/main   是否已经进入 main
git branch -r --contains <sha>             它被哪些已推送分支携带
gh run list --commit <sha>                 该精确提交上的托管 CI 运行与结论
```

## 对照结果（2026-10-06，utopia `origin/main = b06504f`）/ Result

```text
任务      工作书声明                                    实测                                          判定
REX-801   COMPLETE · dev 8f8c521 · review 7e96a4d      两个头都在 main · CI SUCCESS                 一致
REX-802   COMPLETE · dev = review = 833279c            在 main · CI SUCCESS                          一致
REX-803   COMPLETE · dev a695bb9 · review 8798ba9      都存在 · CI SUCCESS · **两者都不在 main**      一致（已验收但未合并）
REX-804   COMPLETE · dev = review = fe700ab            存在 · CI SUCCESS · **不在 main**              一致（已验收但未合并）
REX-805   COMPLETE · dev = review = 0261a9e            存在 · CI SUCCESS · **不在 main**              一致（已验收但未合并）
REX-806   IN_PROGRESS · dev 3950d47 · review 未开始     存在 · CI SUCCESS · 不在 main                  一致（等对侧复检）
REX-807   WAITING_DEPENDENCIES · 无头                   —                                            一致
REX-890   WAITING_DEPENDENCIES · 无头                   —                                            一致
```

**结论一**：八本工作书的声明与推送记录**没有一处矛盾**——没有出现「声称已验收但提交不存在」「声称已合并但祖先关系不成立」这类问题。

**结论二（也是唯一的结构性事实）**：REX-803/804/805 三个**已验收**头此前都**不在 main**，这正是本次 Owner 授权合并窗口要解决的事。三者的包含关系也实测清楚：`8798ba9`（REX-803）**已在** `0261a9e`（REX-805）之内，而 `0261a9e` 与 `fe700ab`（REX-804）**互不包含**，所以并集只需 main + `0261a9e` + `fe700ab`。

**结论三**：`REX-806` 的开发头 `3950d47` 存在、CI 绿、且被三个修复分支携带；但它**没有** `review_head_sha`，与工作书 `IN_PROGRESS / review_host: null` 一致——反查不产生也不替代复检结论。

## 合并后的再反查（同一天，`origin/main = 312b627`）/ Re-run after the merge

合并执行完毕（见 [`REX_SERIES_MERGE_MECH_2026_10_06.md`](./REX_SERIES_MERGE_MECH_2026_10_06.md)）后重跑同一工具：

```text
REX-801 dev/review            in_main=True    （本就已在）
REX-802 dev/review            in_main=True    （本就已在）
REX-803 dev a695bb9 / review 8798ba9   **in_main=True**（由本次合并带入）
REX-804 dev/review fe700ab             **in_main=True**
REX-805 dev/review 0261a9e             **in_main=True**
REX-806 dev 3950d47           in_main=False   （按设计：只合并被验收的部分，REX-806 自身内容不随本次进入 main）
REX-807 / REX-890             无头、仍 WAITING_DEPENDENCIES
```

⇒ 至此「已验收的 REX 内容全部在 main 上」，而**未验收的 REX-806 内容与其标记状态不变**。 / All accepted REX content is now in main; REX-806's own content and marker state are unchanged.

## 边界 / Limits

```text
· 只做「声明 vs 推送事实」的对照：不判断验收质量（那是对侧主机的复检职责）
· CI 结论按**精确 SHA** 读取（gh run list --commit），不用邻近提交顶替
· 「在 main」只说明合并状态，不说明是否已部署（部署状态由部署指纹单独佐证）
```
