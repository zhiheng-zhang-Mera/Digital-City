# REX-807 领取记录 / Claim report

```text
任务 / task        REX-807 Research Control Surface + Progressive Disclosure
领取者 / claimant  Mech-DS（COMPUTERNAME MEGA-REP，role Mech-DS，development side）
时间 / at          2026-10-07
实现仓库 / repo    zhiheng-zhang-Mera/utopia
分支 / branch      rex/REX-807-mech-research-control-surface（自 12e3d3b 起）
工作书 / workbook  mission-book/mission-group/research-strengthening/REX-807-research-control-surface-and-progressive-disclosure.md
领取就绪预检 / pre  reports/REX-PROGRAMME/REX-807_CLAIM_READINESS_MECH.md（本轮重读）
规范 / spec        mission-book/mission-group/research-strengthening/RESEARCH_CONTROL_SURFACE.md
```

## 基线解析（实测，不是捷径）

```text
baseline_anchor_mode = DEPENDENCY_SHA_UNION_AT_CLAIM
依赖 = REX-801 接受头 7e96a4d2…、REX-806 接受头 12e3d3b…
实测：origin/main **就是** 12e3d3b（REX-806 的验收头已在 Owner 门下合并进 main，run 37542958872 / linkage 37542958826 全绿）
      git merge-base --is-ancestor：7e96a4d2 ✓、12e3d3b ✓、required ancestor 69a097b5 ✓（三条 exit 0）
⇒ 依赖并集 = main 本身，**不需要任何 union 构造**。development_baseline_sha = 12e3d3b。
```

## 本任务的范围（工作书原文摘要）

把 Research Fabric 暴露给 Owner，同时不让普通产品 UI 视觉过载：一个**次级但清晰**的 `Research / Experiments` 入口，
内部分层 Experiments / Runs / Metrics / Replay-Ablation / Export / Advanced Fault Injection / Technical Details。
必须验证：Home/Ask/Devices 不被 research 控件淹没；Research 不靠 console/API 才能用；高危故障控件不误触；
raw ID 默认折叠；errors/exclusions/不完整 metrics 对用户**可见**；Web 为完整控制面，Android 至少可观察 run/status/
关键 attention（完整 authoring parity 可记为 future backlog）。完成门槛：直接控制、知情、危险操作隔离、技术详情折叠
均满足全局 Capability Exposure Gate。

## 边界与打算

```text
· 不采购/不付费、不装系统服务、不改运行 profile、不启用远端执行；merge_authority 保持 false。
· 本轮先做**入口与分层骨架 + 反例测试**（Home/Ask/Devices 不被淹没、raw ID 折叠、errors/exclusions 可见、
  高危控件需明确确认），随后再做 Advanced/Technical Details 与 Android 观察面；每完成一步更新三处任务板。
· 双机规则不变：开发在本机，正式复检必须由另一实体主机执行（§3 禁止自审）。
```
