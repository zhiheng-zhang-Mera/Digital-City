# PCF-701 有界激活回执 / Bounded activation receipt — PCF-701

```text
ACTIVATION_ID      PCF-ACT-2026-10-07-02（第二次、有界、顺序激活）
SCOPE              仅 PCF-701 一本（不是 701..728 全开）
AUTHORITY          Owner 常驻指令：PCF 系列在专用分支系列上**连续承接**任务；本回执把该授权落到**下一本合格工作书**
DEPENDENCY         PCF-700 = COMPLETE / review_complete=true / review_host=Alien / review_head_sha=659ff6a
BASELINE           659ff6aa98bc5675862b1170ed0cf5e1b78dba5f（= pcf/series-mech 累计头）
CLAIMANT           Mech-DS（COMPUTERNAME MEGA-REP，development side）
BRANCH             pcf/PCF-701-mech-live-resource-telemetry
```

## 1. 为什么现在可以开这一本（激活事务逐条实测）

```text
1  Owner 范围与资格   Owner 指令要求 PCF 系列「连续承接」；PCF-701 是依赖图上的**下一本**（唯一依赖 PCF-700）。
                      本回执把授权**限定在这一本**：702..728 未启用、未补 anchor（见第 3 条实测）。
2  依赖是否真的验收   从**工作书 frontmatter**读，不读 README 短 SHA：
                      PCF-700 status=COMPLETE、development_complete=true、review_complete=true、
                      review_host="Alien"、review_head_sha="659ff6aa98bc5675862b1170ed0cf5e1b78dba5f"；
                      对侧 REVIEW_REPORT.md 的裁决是 ACCEPTED（audit/compatibility scope），未要求修复。
3  ancestry 与 union   实测 312b627b54af5bbf274fa25eca8f8383869c1c34（origin/main）是 659ff6a 的祖先；
                      659ff6a 正是系列分支 pcf/series-mech 的累计头 ⇒ 依赖并集就是这一个头，无需 union 合并。
                      **注意**：PCF-700 的 merge_authority=false、未做产品合并，因此 baseline 取**系列分支头**
                      而不是 main —— 这是显式选择，不是意外。
4  控制面兼容         sync_dependency_state.py 的 ID_RE 已在 PCF-700 激活事务中支持 PCF；本轮实测
                      `sync_dependency_state.py` 运行后**只改动了 PCF-701 一本**（git status 只有两个文件：
                      清单与本工作书），702..728 保持 execution_enabled=false、无 anchor。
5  显式文件集         PROGRESS_MANIFEST.json 的 pcf 条目现在是两条**显式** glob：
                      `PCF-700-*.md` 与 `PCF-701-*.md`；不使用会吸入 future task 的宽 glob。
6  在途 claim 重扫     领取前实测：无任何主机对 PCF-701 有 claim；在途开发只有 REX-806（Mech，待异机复检）与
                      SHOW-401（Alien）。MON-990 已 COMPLETE（激活规则「先让 MON-990 收口」的前置已满足）。
7  同步与检查         `sync_dependency_state.py`（无待改）、`sync_mission_progress.py` 及二者 `--check` 全绿；
                      一致性检查 0 error / 34 warning（基线）/ 4 excused。
8  回执发布           本文件（中英）。任一步失败即不授予执行权；本轮全部通过。
```

## 2. 边界（本激活**未**授予的）

```text
· 不采购、不付费、不使用付费服务；不安装系统服务；不改运行 profile；不开启远端执行。
· 不授予 merge 权限：PCF-701 与 PCF-700 的 merge_authority 都保持 false。
· 仅 PCF-701 获得执行权；702..728 仍 parked，不进当前分母。
· 双机规则不变：开发在本机，正式复检必须由另一实体主机完成（§3 禁止自审）。
```

## 3. 激活后任务池重扫

```text
pcF 分母        total=2（PCF-700 已 COMPLETE、PCF-701 在制）—— 由 sync_mission_progress.py 生成，不手改
全城            complete 90/94、development 91/94、review 90/94（生成值，见主台）
可领取          本机下一本 = PCF-701（本回执）；其后 702/704/706/708 均在等待各自依赖，不预启用
```
