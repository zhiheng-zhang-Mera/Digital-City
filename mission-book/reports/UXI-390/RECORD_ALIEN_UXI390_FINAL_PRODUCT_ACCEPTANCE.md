# RECORD — UXI-390 最终接受与阶段收口：`UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED`

```text
HOST              = Alien（UXI-390 开发主机；merge_authority: true）
记录时间          = 2026-10-02T14:35Z（本地 10-03 00:35）
REVIEWED HEAD     = 6a82e35a2c5c40db426f815056bac6fda4c6806d
REVIEW            = Mech：REVIEW_COMPLETE — PASS（含必做修复 C-1/C-2 的确认）
REVIEW CI         = 37019678027 success（android + gateway-web）
OWNER GATE        = FINAL_VISUAL_ACCEPTANCE 通过（未要求修改）
MERGE             = d0507b008cc4f91c494e24388c457a8decd9e559（--no-ff）
MERGE PARENTS     = 1a5bc0ee825c681636b9611efa2163f458c0a76f + 6a82e35a2c5c40db426f815056bac6fda4c6806d
MAIN CI           = 37020640107 success（android + gateway-web）
TERMINAL MARKER   = UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED   ← 已宣告
```

## 1. 步骤 7 是怎么执行的（先门后合，且在新头上重测）

```text
1. 复核结论变为 PASS：Mech 在设备上确认了作者应用的 C-1/C-2，并把 reviewed head 重新绑定到 6a82e35
2. 合并就绪性在 FINAL HEAD 重测（不是沿用 149a4c1 的旧结论）：
     main 是 head 祖先 → 可 fast-forward；main 独有 0 / head 独有 31
     git merge-tree --write-tree 退出 0，结果树 faf7647d…，冲突 0
     变更规模 46 files, +4476 / -5
3. 合并：--no-ff（沿用 RS-290 先例，让合并记录显式命名 reviewed head）
4. 合并树与 reviewed head 逐字节一致：git diff --stat 6a82e35 d0507b0 输出为空
5. 推送 main → main CI 37020640107 双 job 全绿
6. 宣告终态标记并把状态置为 FINAL_PRODUCT_ACCEPTED
```

**合并前清掉一个会硬失败的操作障碍并记录在案**：主检出里有一个**未跟踪的 0 字节** `apps/android/.../SchedulerPanel.kt`（00:22 创建），它会让合并以
`untracked working tree files would be overwritten` 直接失败。**这是同一路径第二次出现同样的空文件**（第一次今晚早些时候已清除）；空文件不含任何工作，删除是安全的；**它由什么创建并未查明，我不猜**。

## 2. 八个门项的最终计分（依据均为他人或基础设施的测量）

| # | 门项 | 结果 | 依据 |
|---|---|---|---|
| 1 | 全部旧功能仍可达 | **MET** | Mech 在 reviewed head 跑根套件 1017/1015/2，并**在未改动基线 `1a5bc0e` 上复跑那 2 个失败用例**证明其为既有 |
| 2 | UI 不再以工程控制台为默认语言 | **MET** | Web E2E 断言 + Mech 在 Android 六个页签 50 条字符串上做 22 词元扫描，零泄漏 |
| 3 | scheduler vNext 真实工作 | **PARTLY MET** | 适配器/投影/两面/选择回环端到端由 Mech 核验；**remote handoff 子项 NOT MET**（你选项 1 裁决接受的延期） |
| 4 | 真实双设备 E2E | **MET** | Mech 自产证据：Web 10/10；Android 首次独立测量（360dp）；两台设备注册并都观测到执行 |
| 5 | Web/Android/Rooms 视觉一致 | **MET（含必做修复）** | Rooms 腿独立 PASS 5/5；跨面像素比对；C-1/C-2 已修复并由 Mech 确认 |
| 6 | Owner 最终视觉门 | **MET** | 你的目视裁决（8 张实拍，未要求修改） |
| 7 | main hosted CI 绿 | **MET** | `37020640107` success（合并提交 `d0507b0`） |
| 8 | 终态标记 | **MET** | `UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED` 已宣告 |

## 3. 仍然未达成 / 仍然开放的事项（接受不修复它们）

| 事项 | 归属 | 状态 |
|---|---|---|
| gate 3 的 remote handoff 子项 | 产品设计（City 不发布五维负载向量） | **NOT MET**，你选项 1 裁决接受的延期；**接受并不修复它**。选项 2（发布真实负载向量 + 界面接通拒绝切换）仍是**新任务** |
| C-3：360dp 下裸任务 id 折四行并与状态文字相撞 | UXI-301 的布局 + **UI-190 冻结基线**展示裸 id 的约定 | 已记录，未修；需你裁决是否重开冻结基线 |
| V-3：三面三种本地化姿态（Web 英文 / Android 英文文案 + 共享组件里的中文 `展开·收起` / Rooms 中文外壳） | **UI-190 与 UI-103 冻结组件** + Android 无 `strings.xml` | 已记录，未修；根因是基线架构，替换为字符串资源属基线决策 |
| 复核方 2 张截图放在 City 是否符合 PROCESS_DATA_POLICY 第 16 行 | 你的政策 | Mech 主动提出请你裁决，未自行重新解释 |
| UI-102 / RS-290 / UXI-301 正文 GBK 双重编码 | 控制面 | 故意未修（均已关闭，其中两本已按具体字节复核/冻结） |

## 4. 阶段整体（三项目标全部收口）

| 工程 | 结果 |
|---|---|
| UI 文明化（UI-000/101/102/103/190） | 5/5 施工与复核，`UI_BASELINE_FROZEN` |
| 再调度 vNext（RS-201/202/203/290） | 4/4 施工与复核，`RESCHEDULING_BASELINE_FROZEN`，合并 `1a5bc0e` |
| UI × 调度接线（UXI-301/390） | 2/2 施工与复核；UXI-390 合并 `d0507b0`，main CI 双绿，**终态标记已宣告** |

Utopia `main` 现为 `d0507b0`。全部 11 本工作书均为 `development_complete: true` 且 `review_complete: true`。

## 5. 若 Owner 想继续推进，可选的下一步（都属新任务，不在本阶段内）

1. **选项 2 能力**：让 City 发布真实五维负载向量并接通拒绝切换路径，使 `ALTERNATE_DEVICE` 真正可达；
2. **基线重开**：C-3 窄屏 id 布局 与 V-3 三面本地化姿态（含给 Android 引入字符串资源）；
3. **控制面加固**：给校验器加双重编码检测、修复三本已关闭工作书的编码、裁决复核截图是否可留 City。
