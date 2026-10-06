> 阅读译本 / Reading translation。原文件仍为正式历史记录；本文件不新增领取、验收、任务状态或合并权。所有原始代码证据块逐字保留。

[原文 / Canonical source](../REVIEW_REPORT.md)

# REX-805 正式复检报告 — Mech：中文阅读译本

```text
REVIEWER            Mech-DS (COMPUTERNAME MEGA-REP), physical host MEGA-REP
DEVELOPER           Alien (physical host MERA-ALIANWARE); workbook records development_host=Alien
REVIEWED HEAD       0261a9ed1cec88df3ab4675623d422b37b33f270
CLAIM               reports/REX-805/REVIEW_CLAIM_Mech.md (published before any verdict)
VERDICT             PASSED on 0261a9e — no defect found; one observation recorded, not a defect
TERMINAL MARKER     TRACE_REPLAY_ABLATION_ACCEPTED — RELEASED, with the handset-rendered half disclosed as NOT_OBSERVED
MERGE AUTHORITY     none
```

复检者与作者属于不同实体主机，因此满足 §3，不是自审。作者自己的代码重审不作为本机证据。

> 范围更正：依据 [RECORD_RECONCILIATION.md](../RECORD_RECONCILIATION.md)，研究比较页手机渲染在开发方与复检方均为 NOT_OBSERVED。原报告提及作者真机捕获的措辞不证明存在 REX-805 作者手机渲染截图；MON 手机截图不能充作 REX-805 截图。正式验收仍绑定原 SHA，不新增产品 main 合并权。以下保留当时报告及证据，不据后续情况改判。

## 1. 本机自己的探针

本次独立制造两套复检测试，均不是重跑作者套件。17 个探针全部通过：13 个针对运行受审 head 的常驻 City，4 个针对该 head 的进程内实例。

```text
live    P1a-P1g  空 limit 集源的全链路（作者 0261a9e 修的那条分支）      —— 独立复测，非采信
        P2       同一源重放两次，9 个描述性字段完全一致（确定性）
        P3       alternate-device 消融落在第一个声明 worker 上，且 placementChanged 如实
        P4/P4b   精确策略之外的机制被按名拒绝（ABLATION_UNSUPPORTED）
        P5/P5b   未知源、越界 run index 均按名拒绝
inproc  P6       记录拓扑不在线时按名拒绝（REPLAY_TOPOLOGY_NOT_READY），不拿现有环境凑
        P7a      **receipt store 不可用时 City 仍然启动**（storeState=UNAVAILABLE, reason=ENOTDIR）
        P7b      对该 store 的重放被打字化拒绝，不是崩溃
        P7c      store 状态被如实披露，而不是一个平静的空窗口
```

关键实测结果：

```text
P1d  源回执持久化的 limits 确实是空集 {}          —— 修复分支的前提成立
P1f  空 limit 源重放后 controlledInputsMatch=true、differences=[] —— 修复有效，本机独立复现
P1g  新身份：新 campaign、新 experiment、新 canonical task，全部不同
P3   原 run 落 dev-031fdba6…（即第一个声明 worker），消融后仍落该 worker，
     placementChanged=false —— **如实报告「没有变化」**，而不是硬报 true
P6   拓扑离线 -> 409 REPLAY_TOPOLOGY_NOT_READY；「不可用条件不得被重放」被真正强制
P7a  research/campaigns 是文件而非目录时，City 仍然 200 启动并服务，storeState=UNAVAILABLE(reason=ENOTDIR)
```

## 2. 复检者自己的仪器缺陷：记录而不掩盖

第一轮 live 探针 8/13 通过。五个失败全部来自本机探针缺陷，非产品缺陷；逐项查明并修正后，第二轮 13/13。

```text
P1c/P1g/P3 的 undefined   waitTerminal 要求 `live` 为空，而 City 在 campaign 结束后仍把它留在 `live` 里，
                          于是等待循环从不返回 —— 探针缺陷
P1d                      同上（回执其实有 limits={}）
P3                       探针写死「placementChanged 必须为 true」；而该源本来就落在第一个声明 worker 上，
                          正确行为恰恰是 false —— 把假设当成了被测对象的性质
P5                       探针要求特定错误码；产品回 404 CAMPAIGN_UNKNOWN，比探针要求的更具体 —— 探针过窄
```

这些与本系列反复记录的仪器缺陷同源。保留失败与修正过程，因为一个先失败的探针才是证据。

## 3. 与作者材料独立核对

```text
实体门槛     本机执行过两次（修复前 4b39468 / 修复后 0261a9e），材料逐字节可核对：
             evidence/ 与 evidence-repaired/（各 9 个文件 + 索引，逐文件 SHA256）
             源回执在三个材料包与 City 自身副本中哈希相同（34bf5257…）
作者 CI      精确头三条 run 逐条 API 复读：push 37446455570 / PR 37446461188 / linkage 37446461192 全 SUCCESS
作者数字     开发记录称 local 1413/1410PASS/3ENV_FAIL；本机在修复后并集上实测 1424/1427（3 项 host-city-launcher），
             机况不同但失败身份一致，无人为抹平
```

## 4. 一处观察，记录为观察而非缺陷

```text
现象   receipt store 不可用（ENOTDIR）时，对 replay 的 POST 回 404 CAMPAIGN_UNKNOWN
分析   引擎 preflight 里本有 REPLAY_STORE_UNAVAILABLE 这一条，但**源查找先失败**，于是错误码把
       「store 不可用」说成了「没有这个 campaign」
影响   同一次响应链上的 /research/campaigns 已经如实给出 storeState=UNAVAILABLE 与 reason=ENOTDIR，
       调用方据此可以区分；因此这是**表述精度**问题，不是隐藏事实
判定   不构成缺陷、不阻塞：它保守且可区分。记为观察，供作者后续按需改进
```

## 5. 未观测

```text
手持机上的渲染视图（本机无 adb 设备）——该半边以作者的真机捕获为唯一证据，本报告不主张观测过
durationDeltaMs 不作因果性能结论（引擎自身 causalPerformanceClaim=false）
```

上述历史证据块中“以作者的真机捕获为唯一证据”一语，按范围更正记录明确收窄：两侧均未观测到 REX-805 研究比较页手机渲染；不能由该措辞推定作者已提供截图。`durationDeltaMs` 不作因果性能结论，`causalPerformanceClaim=false` 保留。

## 6. 结论

**PASSED，绑定 `0261a9ed1cec88df3ab4675623d422b37b33f270`。**17 项本机探针全部通过：重放及比较的确定性、新身份成立；空 limit 集修复被独立复现；消融按精确策略放置并如实报告是否变化；六条拒绝路径均按名拒绝；记录拓扑不在线时拒绝重放；receipt store 不可用时 City 仍能启动并提供打字化拒绝。

未发现缺陷。唯一观察是 store 不可用场景错误码表述精度不足，而同一响应链已提供可区分的 store 状态。`TRACE_REPLAY_ABLATION_ACCEPTED` 释放，真机渲染半边明确 NOT_OBSERVED。本机不行使任何产品 main 合并权。
