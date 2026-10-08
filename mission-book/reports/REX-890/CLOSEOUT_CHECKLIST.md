# REX-890 收口清单（**已备好，未执行**）/ Close-out checklist (prepared, NOT executed)

```text
给谁看   给「对侧宣布复现结论之后」的那一刻用。本文件**不是**完成声明，也不释放任何东西。
为什么不现在执行   工作书 §Final gate 要求三项同时成立：① 对侧独立复现成功 ② exact-head CI green ③ 用户 exposure gate PASS。
                   现在只有 ② 成立，所以下面每一步都还是「待触发」。
```

## 0. 触发条件 / What must be true first

```text
① 对侧实体独立复现已完成，且它自己写的 `mission-book/reports/REX-890/REVIEW_REPORT.md` 已到位
   （§3 禁止自审 —— 本机**不会**创建这个文件，也**不会**替它填 review_* 字段）。
   注意它可能出现在**分支**上而不是 main：2026-10-08 那天它的验证报告就落在
   `dc docs/REX-890-Alien-20261008` 上，而本机监视器当时只看 main（已修）。
③ Owner 已就 `CAP-CITY-REMOTE-OPERATION-001` 与 `CAP-CITY-AGENT-JOB-001` 给出 exposure gate PASS，
   并把裁决记入两份登记的 `evidence.review_refs`（现在是 `[]`）。
```

## 1. 先核对对侧交回来的东西 / Verify what they hand back

```text
· `REVIEW_REPORT.md` 必须写清：观测到的软件身份（**40 位** head + 树是否干净）、exit code、
  inconsistencies / evidenceGaps **逐条**（含具名 gap）、以及"哪些不能复现、为什么"。
· 不一致与 gap 的处理：**不一致**按具名条目处理（可能触发修复→再复现一轮）；
  **gap 原样保留**，不得读成"通过"也不得读成"失败"——复核结论由对侧宣布，本机不改写它。
· 把他们的 `review_head_sha` 与 `review_ci` 原样抄进工作书（不许把短 SHA 补成 40 位，不许手写）。
```

## 2. 逐字段落库 / The exact fields, and the gate that checks them

```text
工作书：mission-book/mission-group/research-strengthening/REX-890-reproducibility-study-and-freeze.md
  review_host           ← 对侧主机/代理名（他们报告里的 `Mera-Alianware` / Alien-codex）
  review_head_sha       ← **40 位** exact SHA
  review_ci             ← run id + URL（照抄，不推论）
  review_complete: true
  status: COMPLETE      （`check_record_consistency.py` 规则：status=COMPLETE 而 review_complete 非 true ⇒ ERROR）
  merge_authority: true （REX owner gate 只对"自身复检完成且终标已释放"的任务放行）
终标：`terminal_marker: RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE` —— **释放 = 上面这些字段落库 + 本系列 README 列出该标记**，
  不是新建一份登记。（对照 REX-801..807：它们在 `finished/completed-2026-10-07/research-strengthening/README.md` 里被逐条列出。）
```

## 3. 归档与看板 / Filing and board

```text
· 把工作书移入 `finished/completed-<日期>/research-strengthening/`（REX-801..807 的先例），
  并同步该目录的 README 与 `en/` 对照；`PROGRESS_MANIFEST.json` 里 rex 的 task_globs 已同时覆盖 finished/ 与 mission-group/，
  所以移动后看板仍能统计到它（实测：rex = 8/8 开发 · 7/8 复检 · IN_PROGRESS）。
· 复检完成后看板应变成 rex = 8/8 · 8/8 · COMPLETE。
· 之后**才**允许创建工作书 §Final gate 末尾说的 programme final integration workbook —— 提前建就是绕过门。
```

## 4. 跑门并推送 / Gates, then push

```text
cd mission-book && python tools/check_record_consistency.py                     # 期望 0 error（基线 50 warn / 4 excused）
python tools/sync_dependency_state.py --check
python tools/sync_mission_progress.py            # 先同步再 --check
python tools/sync_documentation_navigation.py    # 先同步再 --check
python capability-registry/tools/audit_evidence_refs.py                          # 0 悬空 SHA；不得引入新的不可达引用
cd .. && git add -A && git commit && git push      # 推完确认 local == remote（本轮两次踩过"只提交没推送"）
```

## 5. 不许做的事 / What must NOT happen at close-out

```text
· **不许**由本机写 `REVIEW_REPORT.md`、填 `review_*`、或把对侧的代码验证报告当成复现结论
  （它自己写着：`CODE_REPAIR_VERIFIED / PHYSICAL_REPRODUCTION_NOT_RUN / FINAL_GATE_NOT_RELEASED`）。
· **不许**因为 CI 绿或代码验证通过就释放终标 —— 那正是 §14A.6 说的
  `CAPABILITY_IMPLEMENTED != PRODUCT_COMPLETE`。
· **不许**把 `evidenceGaps` 洗成不一致、或把不一致洗成 gap；两者出口不同。
· **不许**把本机彩排的 `exit 0`（干净检出、对着 B 包）当成对侧实体复现 —— 那是彩排，报告里到处都这么写着。
```

## 6. 现在就已就绪的东西 / Already in place, so close-out is mechanical

```text
B 包（自带 trace）  evidence/raw/rex890-studies/2026-10-08-B/artifact/（13 文件）+ 包外 MANIFEST.sha256
复现工具            scripts/rex890-opposite-host-reproduce.mjs（对侧已复检并采纳其修复：0907b12）
study 仪器          scripts/rex890-dev-study.mjs（可从裸检出重跑）
实机探针（4 份）    remote-operation 21/21 · agent-job 凭据 9/9 · 消耗回执 8/8 · owner 边界 12/12
登记与索引          两条能力登记 + CAPABILITY_INDEX（20 记录）+ SURFACE_INDEX（14 WEB surface）+ 证据审计工具
给 Owner 的审阅材料 reports/REX-890/EXPOSURE_GATE_PACKET.md
对侧交接            HANDOVER-TO-ALIEN.md（+ 带外 token）· RESPONSE_TO_ALIEN_VERIFICATION_2026-10-08.md
```
