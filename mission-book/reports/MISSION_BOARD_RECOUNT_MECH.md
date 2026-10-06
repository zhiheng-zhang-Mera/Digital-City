# 主任务板独立重算 / Independent recount of the main board

2026-10-06，Mech-DS（`MEGA-REP`）。REX-803 被对侧主机验收后，主任务板与 `MISSION_PROGRESS.json` 由生成器同步了一次。这一记录是**独立重算**，不是复述生成器的输出。 / After the opposite host accepted REX-803, the main board and `MISSION_PROGRESS.json` were regenerated. This is an independent recount, not a restatement of the generator's output.

工具 / tool：`MISSION_BOARD_RECOUNT_MECH.mjs`（本次与记录同目录发布；`node MISSION_BOARD_RECOUNT_MECH.mjs <mission-book 目录>`）。 / The recount script is published beside this record.

## 本轮变化 / What changed this round

```text
全城合计 / city-wide      总任务 86/93 -> 87/93   复检 86/93 -> 87/93   开发 88/93 不变
未收口项目池 / active pool 总任务 16/23 -> 17/23   复检 16/23 -> 17/23   开发 18/23 不变
Research Strengthening    复检 3/8 -> 4/8（REX-801/802/803/804 四项已复检）
```

## 重算结果 / Result

```text
PASS  每个工作书都有 id 与 status / every workbook has an id and a status（89 本）
PASS  活跃池工作书重算后与发布的总数一致 / active-pool workbooks recompute to the published totals
      重算 17/23 复检、18/23 开发  =  json 17/23、18/23
PASS  每个活跃 programme 的行与它自己的工作书一致 / every active programme row matches its own workbooks
PASS  JSON 内部自洽（总任务=复检、分母一致）/ the JSON is internally consistent
PASS  没有工作书同时 review_complete 且未 development_complete / no workbook is reviewed but undeveloped
PASS  没有 review_complete 的工作书仍停在 WAITING_DEPENDENCIES / none
PASS  没有 review_complete 的工作书仍是 IN_PROGRESS / none
PASS  REX-801/802/803/804 四项均计入已复检 / the four accepted REX tasks are counted as reviewed
PASS  REX-803 为 COMPLETE 且 review_complete=true / REX-803 is COMPLETE and reviewed
PASS  REX-803 已不在“未收口工作书”自动同步块中 / REX-803 has left the unresolved block
```

10/10。

## 我第一次把这个检查写错了 / The check I first wrote was wrong

第一版直接对全部 89 本工作书重算，得到 34/89，与 87/93 差得很远。差的原因**不是板子错了**：主任务板自己写明“历史项目的 Correction / Verification 统一折算为复检”，即归档 programme 的 frontmatter 用的是另一套字段名，而这个重算脚本无法在不读生成器的情况下推出来。把一套猜测当成分母，会产出看起来很严格的假失败。 / The first version recounted all 89 workbooks and got 34/89 against the published 87/93. The board was not wrong: it states that historical Correction/Verification fold into "复检", so archived frontmatter uses different field names that this script cannot infer without the generator. Guessing a denominator produces a false failure dressed as a strict check.

这正是本系列反复记录的那一类仪器缺陷：**探针把自己的假设当成了被测对象的条件**。修正后的检查因此只做两件能站得住的事：对**活跃池**（字段约定统一、也正是本轮变化所在）逐 programme 重算；对全城只做**结构性不变量**检查（状态互斥、JSON 自洽）。 / This is the instrument-error class this programme keeps recording: the probe treated its own assumption as a property of the subject. The corrected check therefore does two defensible things only.

## 边界 / Boundary

- **不主张**重算了历史 64 本工作书：93 的分母包含归档 programme，其折算规则在生成器里，本机没有生成器源码，因此不作断言。 / It does NOT claim to have recomputed the historical 64 workbooks.
- 本记录不构成新的修复授权，也不改变任何工作书字段；它只是一次只读核对。 / This record authorizes no repair and changes no workbook field; it is a read-only check.
- 若此表与工作书冲突，以工作书 frontmatter 为准——这是主任务板自己写的规则，也是本次核对采用的方向。 / If the table conflicts with a workbook, the frontmatter wins, which is the board's own rule and the direction this check took.


## 记录不变量巡检 / Records-integrity sweep

2026-10-06，本机在推进 research 系列的同时对本记录面做了一次不变量巡检（这类检查便宜、且能抓住「我自己的记录悄悄过期」）：

```text
生成视图 / generated views    python mission-book/tools/sync_mission_progress.py --check -> 同步
独立重算 / independent recount 本目录的重算工具 -> 10/10 与生成视图一致
字节一致 / byte fidelity      全新 clone 后逐包核对：
                              REX-803/evidence 6 文件 · REX-805/evidence 9 · REX-805/evidence-repaired 9
                              REX-806/artifact 10（checksums.json）—— **全部零失配**
```

同一轮里发现并修掉了一处**我自己的记录过期**：`INTEGRATION_DEPLOYMENT_INVENTORY_MECH.md` 仍把 REX-805 写成「候选 `4b39468`（尚未验收）」，而它已在 `0261a9e` 被本机复检通过并释放标记；清单里也没有 REX-806。已按实测更正，并补上「集成方实际要解决什么」一节（三个已验收 REX 头各自都包含 main ⇒ 所谓合并其实是 fast-forward；真正要解的是 `server.mjs` 那一处 union，且已被**独立解出两次**：`704c518` 与 REX-806 自身的 baseline `e18c5c5`，两者内容等价、提交不同、互不为祖先）。

**巡检的价值不在通过，而在于它把「记录是否仍然为真」变成了可以失败的东西。** / The sweep matters because it makes a stale record something that can fail, rather than something a reader has to notice.

### 迁移之后再巡检一次 / Re-swept after the relocation

对侧主机随后做了一次**大范围搬迁**（`8d675be`，274 个文件：活跃 programme 移入 `mission-book/mission-group/`，完成项归档到 `mission-book/finished/completed-2026-10-06/`）。一次重写 274 个文件的搬迁，正是「证据字节被顺手改掉」的高风险动作，因此本机在 `8367ac0` 上重跑了同一套只读核对： / The opposite host then relocated 274 files. A migration that rewrites that many paths is exactly when published evidence bytes get silently rewritten, so the same read-only check was re-run at `8367ac0`:

```text
全新 clone（git -c core.longpaths=true clone --depth 1）后，与工作副本逐文件比对 SHA256：
  REX-806/artifact          11 文件（含 checksums.json）    差异 0
  REX-803/evidence           7 文件（含索引）                差异 0
  REX-805/evidence          10 文件（含索引）                差异 0
  REX-805/evidence-repaired 10 文件（含索引）                差异 0
另：REX-806 包在 clone 内自校 checksums.json -> 10/10 通过
.gitattributes 覆盖仍在：artifact/**、REX-803/evidence/**、REX-805/evidence** 均为 text: unset
```

**顺带记录一条会让其它主机误判的既有条件**：在 Windows 上**不加** `core.longpaths=true`（或不用短路径）clone 本仓库，checkout 会在 `06-研究院区(Research-District)-&-研究实验域(...)/…/paper-materials/*.md` 处报 `Filename too long` 并以 `fatal: unable to checkout working tree` 结束——**传输成功、检出失败**，于是「clone 出来的树不全」会被误读成证据缺失。本机第一次就是这么撞上的；改加 `-c core.longpaths=true` 后 clone 干净。 / A pre-existing condition worth recording: on Windows a clone without `core.longpaths=true` aborts checkout on deep Chinese-named paper-material paths, leaving an incomplete tree that can be misread as missing evidence.

---

语言读本 / Reading translation: [English](en/MISSION_BOARD_RECOUNT_MECH.md). 本文件保留原始状态与证据权威 / This source remains authoritative for status and evidence.
