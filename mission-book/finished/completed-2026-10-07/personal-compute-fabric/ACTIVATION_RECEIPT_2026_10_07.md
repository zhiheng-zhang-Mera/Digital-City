# PCF 系列激活回执（有界）/ PCF series activation receipt (bounded)

> 本回执记录**一次有界激活**：Owner 本轮指令「打开 PCF 系列、连续承接其任务、单独开一个分支系列」被执行到「控制面先修好、只启用第一本、其余继续 parked」为止。 / This receipt records one bounded activation: the owner's instruction to open the PCF series is executed as far as "fix the control plane first, enable exactly one workbook, leave the rest parked".

```text
回执发出者 / issued by      Mech-DS（MEGA-REP）· 2026-10-07
授权来源 / authority        Owner 本轮直接指令（打开 PCF 系列、连续承接、单独分支系列）
scope revision              激活范围 = PCF **CORE_V1** 系列，**按顺序一本一本地领**；本轮只启用 PCF-700
预算 / budget               无（无采购、无付费服务、无外部费用）
设备资格 / eligibility      仅本机既有的常驻 City 及其已登记节点；不含远端执行、不含新硬件
未越过的边界 / boundaries   不改运行 profile、不装系统服务、不启用远端执行、不合并（merge_authority 仍 false）
不可半激活 / no half state  任一步失败即不授予执行权：本回执只有在下列每一步都实测通过后才发出
```

## 一、为什么可以激活 / Why activation was permissible

```text
REX 系列有无可用任务？   **没有**（本机可领取为 0）：
                          REX-806 开发完成、但完成门槛的另一半是**对侧实体主机的独立复检**（§3 禁止自审）；
                          REX-807 / REX-890 依赖 REX-806 的标记，仍 WAITING_DEPENDENCIES
=> 满足 Owner 条件「REX 无可用任务时打开 PCF」
```

## 二、先决条件（控制面兼容检查）/ Prerequisites, measured

```text
1  **PCF id 解析缺失（真实缺口，已修）**：sync_dependency_state.py 的 ID_RE 不含 PCF，PCF 依赖 id 对工具**不可见**。
   修复：ID_RE 加入 PCF。回归：干跑与实际 reconcile **都只改 PCF-700 一本书**；其余 programme 的 --check 全绿。
2  parked 任务不被自动解锁：PCF-701..728 状态、execution_enabled、anchor **全部未动**（实测 git status）。
3  explicit dependency_source_workbooks 解析为四个 accepted WBC 头。
4  英文镜像无 frontmatter id ⇒ 不重复计数。
5  工作分母只含**显式文件集**：PROGRESS_MANIFEST.json 新增 pcf 条目，task_globs 为
   `mission-group/personal-compute-fabric/PCF-700-*.md`（**不是** PCF-*.md 宽 glob）；生成器实测 pcf total=1。
6  依赖工具与主看板 --check 全绿；一致性检查 0 error（warning 数与基线一致）。
```

## 三、被启用与仍 parked / What is enabled, what stays parked

```text
启用 / ENABLED（1 本）   PCF-700：execution_enabled=true、status=IN_PROGRESS、
                         activation_state=ACTIVATED_OWNER_2026_10_07、anchor_state=RESOLVED_AT_CLAIM、
                         owner_gate=SATISFIED_OWNER_ACTIVATION_2026_10_07、
                         development_baseline_sha=312b627…（= 当前 main，因四个 WBC 依赖头都已在 main）
仍 parked / PARKED（28 本）PCF-701..728：execution_enabled 保持 false、activation_state 保持
                         PARKED_OWNER_NOT_ACTIVATED、anchor 保持 INTENTIONALLY_EMPTY_UNTIL_ACTIVATION；
                         它们**不进入**当前工作分母，也不因本回执获得执行权、预算、凭据或合并权
```

## 四、分支系列 / The branch series

```text
pcf/series-mech                                 系列累计分支（自 main 312b627 起），每本任务的已验证工作并入此处
pcf/PCF-700-mech-ownership-and-reality-audit    本书的开发分支（自系列分支起）
合并 / merge                                    本回执**不授予** main 合并权；系列分支先累计，合并待 Owner 裁决
```

## 五、复查后的任务池 / Pool after the rescan

```text
PCF    IN_PROGRESS：1 本在工作中（PCF-700）、28 本 parked（不计数）
REX    无本机可领取任务（REX-806 待对侧复检；807/890 依赖未满足）
其它   已完成的 WBC/CEX/MON/RS/UI 等不变；未启用的其它 programme 不变
```

**本回执的效力边界**：它授予的是「按顺序做 PCF 的施工权」与「PCF 系列分支的累计权」，**不含**合并权、不含预算、不含远端执行/系统服务/硬件采购，也不改变任何其它 programme 的状态。
