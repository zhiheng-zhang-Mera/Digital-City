# REX-806 验收后修复的合并记录 / Merge record for the post-acceptance follow-up — Mech

```text
STATUS              MERGED —— 已复检的验收后修复头进入 main
ACCEPTED HEAD       cc799234e7daa3d8ccfde5673b9d07ccb2376742（= 本文件写作时的 origin/main）
PREVIOUS MAIN       12e3d3bf868575a8e3cda983733a3186cb59da27（REX-806 先前已接受并合并的头）
MERGE KIND          fast-forward（main 是 cc79923 的祖先，实测 `git merge-base --is-ancestor` exit 0）
AUTHORITY           REX-806 `merge_authority: true`（既有 Owner 门口径：复检完成 + marker 已释放；marker 早已释放）
```

## 1. 执行前先满足的两件事

```text
① 异机复检完成：见 CROSS_HOST_VERIFICATION_FOLLOWUP_Mech.md —— 五条 finding 由本机自己的探针 **14/14** 复现，
   四套件 41/41、前驱回归 50/50、独立校验器在自建包上 15/15（含「刷新校验和也改不掉的语义检查」）。
② 合并是快进：main 是 cc79923 的祖先，因此无冲突、无需合并提交。
```

## 2. 合并的 exact-head 证据

```text
推送            git push origin cc79923:refs/heads/main => 12e3d3b..cc79923
提交后复测      origin/main = cc79923；`git merge-base --is-ancestor cc79923 origin/main` exit 0
main 上的 CI    City linkage check run 37550845871 **completed / success**（reciprocal-contract success）；
                V0.2 checks run 37550845875 在写作时仍 in_progress —— 本文件**不预写**它的结论，下一轮复查补记。
分支侧 CI       cc79923 自身的 push 37549801619 / PR 37549806262 / linkage 37549806355 三项已 success
```

## 3. 这次合并做了什么、**没有**做什么

```text
做了：把已复检的验收后修复（缺任务计数 1/n1、回执窗口边界如实记录、列表后损坏降级而不毁包、
      校验器精度与 NOT_MEASURED 处理、语义与完整性解耦）快进进 main。
没做：没有改写对 12e3d3b 的既有裁决与任何历史产物；没有 force-push；没有把窗口从 50 调大（修复是**如实报告边界**）；
      没有动 REX-807/890 的 merge_authority（各自复检未完成）；没有改 REX-807 的开发记录。
```

## 4. 记录项：交接头与复检头不同

```text
对侧交接文档写的是 1743d76，而其 push 运行 37548842702 **失败**（唯一失败项是既有
「Windows Services invokes real document, knowledge, skill, evidence and theme adapters」，非 REX-806 自身）；
分支其后前进一个提交到 cc79923，三项 CI 全绿。本次合并且复检的对象是 **cc79923**，
1743d76 的红与失败项归属已记录在复检报告中，未因「后来绿了」而删除。
```
