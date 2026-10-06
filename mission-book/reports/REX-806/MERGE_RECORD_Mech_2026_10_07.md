# REX-806 合并记录 / Merge record — Mech, 2026-10-07

```text
STATUS              MERGED —— 已验收的修复头进入 main（Owner Gate 下「合格子任务可合并」的执行）
ACCEPTED HEAD       12e3d3bf868575a8e3cda983733a3186cb59da27（= 本文件写作时的 origin/main）
PREVIOUS MAIN       312b627b54af5bbf274fa25eca8f8383869c1c34
MERGE KIND          fast-forward（**无需并集解冲突**）
AUTHORITY           REX-806 `merge_authority: true`（按工作书既有门口径：review_complete=true + marker 已释放）
```

## 1. 为什么是 fast-forward 而不是一次并集合并

```text
被测关系（本机实测）：git merge-base --is-ancestor origin/main 12e3d3b => exit 0
即修复分支在形成时已经合并过 main（12e3d3b 自己就是 "Merge remote-tracking branch 'origin/main' into repair/…"），
因此 main → 12e3d3b 是严格快进，**不存在冲突点**，也不需要像 REX 系列上一轮那样解 union 冲突。
main 因此一次性获得 REX-806 的整条线（10 个提交）：基线并集 e18c5c5 → 导出器 94a7d24 → 仅 Owner 的路由 d7aa5d7
→ 独立校验器 cd4f603 → host 无关化 3950d47 → 两条 Mech 修复 4349f3d/d790a2a → Alien 的两条修复 5f3658f/897382c
→ 与 main 的合并 12e3d3b。
```

## 2. 合并的 exact-head 证据

```text
推送            git push origin 12e3d3b:refs/heads/main => 312b627..12e3d3b（快进）
提交后复测      origin/main = 12e3d3b；git merge-base --is-ancestor 12e3d3b origin/main => exit 0
main 上的 CI    V0.2 checks run 37542958872（head 12e3d3b，event push）**completed / success**，
                gateway-web success、android success
                City linkage check run 37542958826：reciprocal-contract job success（详见 §4 的状态记录）
合并前本机验证  同一棵树（12e3d3b）上：REX-806 四套件 29/29；REX-803/805 回归 54/54；
                边界探针 10/10；F4 路由探针 4/4；真实 Owner 导出与 City 记录对账 4/4
历史产物保留    D:\utopia-chat\evidence\REX-806\artifact 未随合并改动（10/10 重算无差异）
```

## 3. 合并做了什么、**没有**做什么

```text
做了：把已验收的修复头原样快进到 main，因此 main 现在包含 REX-806 的导出器、仅 Owner 的工件路由、独立校验器
      与四条 finding 的修复。
没做：没有改写任何已验收头；没有 force-push；没有把 REX-807/890 的 merge_authority 打开（它们各自的复检未完成）；
      没有把本次合并当作 REX-807 的依赖满足声明——那是 REX-807 自己 claim-time 的事（reconciler 已解析出
      REX-806 的接受头 12e3d3b 作为其依赖 SHA 之一）。
```

## 4. 合并后的两项 CI 都已落定（写作时后一项仍在跑，现已复查）

```text
V0.2 checks                 run 37542958872  head 12e3d3b  event push  **completed / success**（gateway-web + android）
City linkage check          run 37542958826  head 12e3d3b  event push  **completed / success**（reciprocal-contract）
                            —— 本文件第一次写作时该 run 仍 in_progress，只记了 reciprocal-contract job success；
                            复查后其最终结论为 success，此处按事实补记，未把「进行中」预先写成 PASS。
```
