# REX-804：测试重写了它所认证的证据 / A test rewrites the evidence it certifies

2026-10-06，Mech-DS（`MEGA-REP`）。在 REX 集成前置测量中发现，**不是**本轮新引入的问题：它在已接受、标记已释放的 REX-804 里一直存在。 / Found while measuring the REX integration preflight. It is not new this round: it has been in accepted REX-804, whose marker is already released.

## 缺陷 / The defect

```text
tests/rex804-web.test.mjs:9
  await mkdir('evidence/raw/mission-book/REX-804',{recursive:true});
  await page.screenshot({path:'evidence/raw/mission-book/REX-804/danger-zone.png',fullPage:true});
```

`evidence/raw/mission-book/REX-804/danger-zone.png` 是**已提交**的证据文件，并且 `reports/REX-804/PAPER_MATERIAL_INDEX.md:6` 正是把它引用为“真实 Web Owner 确认/拒绝/停止界面”的人类可读证据。于是： / The path is a COMMITTED artefact, cited by the workbook's paper material index as the human-readable Web surface evidence. Therefore:

```text
1  每次跑这个测试，被评审过的、属于 accepted head 的证据就被一次新的浏览器渲染悄悄替换；
   every run silently replaces the reviewed evidence of the accepted head with a fresh browser render;
2  渲染字节取决于跑它的人的浏览器、字体、DPI 与视口——本机实测同一次提交：已提交 141809 字节 -> 单次运行后 139403 字节；
   the bytes depend on browser/fonts/DPI/viewport of whoever runs it - measured here on one commit: 141809 committed -> 139403 after one run;
3  cwd 相对路径：在子目录里跑就会在那个子目录下造出 evidence/raw/...；
   cwd-relative: run from a subdirectory and it creates evidence/raw/... there;
4  跑绿的测试会把 tracked tree 留成脏的，直接破坏复核记录所依赖的 “tracked state clean after testing”。
   a green run leaves the tracked tree dirty, breaking the "tracked state clean after testing" property the review records rely on.
```

**会因为你验证它而改变的证据，不是证据。** / Evidence whose bytes change when you verify it is not evidence.

## 先证伪 / Falsified first

在**未修复**的 head 上，同一测试 / On the unmodified head, the same test：

```text
node --test tests/rex804-web.test.mjs     ->  1 pass / 0 fail
git status --porcelain                    ->   M evidence/raw/mission-book/REX-804/danger-zone.png
```

测试通过，同时把证据改了——这正是这个缺陷危险的地方：没有任何断言会红。 / The test passes while changing the evidence, which is what makes it dangerous: no assertion goes red.

## 修复 / The repair

`repair/REX-804-mech-test-evidence-outside-repo @ 690d723`（基于 REX-804 已接受 head `fe700ab`）：截图改写到 `.runtime/evidence/mission-book/REX-804/`。 / The capture now goes to `.runtime/evidence/...`.

选这里的依据不是发明新约定，而是**同一程序里已有的正确先例**：REX-803 的同类 Web 测试（`tests/rex803-campaign-web.test.mjs`）本来就写 `.runtime/evidence/mission-book/REX-803/research-campaign-measured.png`，而 `.gitignore` 第 2 行就是 `.runtime/`。同一作者、同一系列、同一个模式，只有 REX-804 写错了地方。 / The basis is not a new convention but the correct precedent already in this programme: REX-803's sibling Web test writes to `.runtime/...`, and `.gitignore` line 2 is `.runtime/`. Same author, same programme, same pattern - only REX-804 wrote to the wrong place.

修复后 / After the repair：

```text
focused   tests/rex804-*.test.mjs                        14 pass / 0 fail
capture   .runtime/evidence/mission-book/REX-804/danger-zone.png 仍然生成 / still produced（137268 字节）
committed evidence 未变 / unchanged
tracked state after the suite                            CLEAN
```

行为断言一行未改：同一个 head、同样 1/1。修复只改证据落在哪里。 / No behaviour assertion changed: same head, same 1/1. Only where the capture lands changed.

## 在合并结果上测量 / Measured on the merge result

依本节目的既有规则（修复必须在合并结果上测，而不是在自己的旧 base 上）——在 `integration/REX-803-804-mech-preflight` 之上合并本修复得到 `0492dfd`： / Following the programme's existing rule, measured on the merge result `0492dfd` = main `b06504f` + REX-803 + REX-804 + this repair：

```text
tests/rex804-web.test.mjs                     1 pass / 0 fail，跑后 tracked state CLEAN
tests/rex803-*.test.mjs + tests/rex804-*.test.mjs   34 pass / 0 fail，跑后 tracked state CLEAN
full suite                                    见 reports/REX-PROGRAMME/INTEGRATION_PREFLIGHT.md
```

> 本机第一次做这个测量时把结果看错了：脏文件是**修复前**那一轮留下的，不是修复后产生的。恢复文件、重跑，才得到上面的 CLEAN。记录在此，因为“先看到脏再下结论”正是这个缺陷本身教的同一课。 / The first attempt at this measurement misread its own result: the dirty file was left by the pre-repair run, not produced by the repaired one. Restoring and re-running produced the CLEAN above, and that near-miss is recorded because "notice dirt, then conclude" is the same lesson this defect teaches.

## 待采纳 / Awaiting adoption

本机对 REX 无合并授权，也没有开启 REX 合并窗口；这是**已验证、待采纳**的提案，同 WBC-604 的 F-3 修复一样：是否采纳由 REX-804 的记录持有人决定。 / This host holds no REX merge authority and no REX merge window is open, so this is a verified proposal awaiting adoption, exactly as F-3 is for WBC-604.
