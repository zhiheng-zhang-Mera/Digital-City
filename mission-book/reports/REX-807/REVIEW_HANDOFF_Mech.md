# REX-807 异机复检交接 / Review handoff — Mech

```text
TASK_ID            REX-807 Research Control Surface + Progressive Disclosure
REVIEW TARGET      9ad888279be07220fe7ac7d91e419e8fe69fc439
                   （分支 rex/REX-807-mech-research-control-surface，增量 4c；CI run 37559402329）
REVIEWER           对侧实体主机（本机 COMPUTERNAME MEGA-REP，role Mech-DS，不得自审）
MARKER             RESEARCH_CONTROL_SURFACE_ACCEPTED（未释放；`merge_authority` 仍为 false）
FROZEN             收到裁决或明确要求前，本机不再向该分支与 pcf/series-mech 推送；所有修复走**新头**并保留被复检头
```

## 1. 这次要验的是什么

工作书六条「必须验证」现在都已有**实现 + 可跑证据**（下表第 3 列是能自己重跑的命令位置）：

```text
① 普通 Home / Ask / Devices 不被 research controls 淹没
   → researchView 的 primarySurfaces + assertPrimarySurfacesClean（对含 research 的主面**抛错**）；S5
② Research 功能不靠 console/API 才能使用
   → 真实浏览器：主流程由 REX-803 套件驱动（登记 → 选 scenario/repetitions → 运行 → 见 measured/excluded/receipts）；
     导出由新增 S12 驱动（下载并**校验字节**）；两者都不需要手工打 API
③ high-impact fault controls 不误触
   → 危险区默认折叠 + 确认令牌**单一来源** + `assertAdvancedControlsConfirmed`（三种形状都会抛错）+ S9/S10/S11
④ raw IDs 默认折叠
   → 主标签是人话摘要，标识符只作属性/折叠技术层；S1、S8（含「标识符不得是可见文本」的属性剥离断言）
⑤ errors / exclusions / incomplete metrics 对用户可见
   → 都成为 visible alert 并带原因；指标值现在真的渲染出来（S3、以及 S8 新增的指标渲染断言）
⑥ Web 为完整控制面；Android 至少能观察 run/status/critical attention
   → Web：见 ②；Android：MainActivity 高级导航 + ResearchRunPanel 调用 `client.researchCampaigns`（只读），
     ResearchRunTest 8 项守卫，编译与单测证据来自 CI android job（**本机无法构建 Android**，见第 4 节）
```

## 2. 我建议你重点找的问题（不是让你确认我做对了）

```text
F1 「假按钮」还剩没有？我删/改了 replay-export 区块的语义（replay 不在本页、export 已在本页实现），
   请用普通用户路径点一遍**每一个**控件，尤其是折叠区里的，看有没有点了没反应的。
F2 确认令牌的单一来源是否真的只有一处？改 research-surface.js 的 `faultConfirmationToken` 应同时影响
   提示文本、客户端拒绝与提交值；若你在别处还能改到它，说明我漏了。
F3 指标渲染是否会把「没测到」和「测到 0」显示成一样？我给未测项保留 reason，但请构造一个 value 为 0
   的指标与一个 NOT_MEASURED 指标，看两者在页面上是否可区分。
F4 导出是否真的 Owner-only？我的 S12 只证明「Owner 能导出」，没证明「成员会话不能」——后者由 REX-806 的
   服务端套件覆盖（403 RESEARCH_OWNER_REQUIRED），但**页面在成员会话下的表现**我没有断言，请验。
F5 折叠与可见性的交互：我踩过一次 `innerText` 在折叠元素下为空的坑，请确认「重要信息」不会因为藏在
   折叠区而在视觉上消失（尤其 alert 与未结清运行）。
F6 危险区在故障存储不可用时：注入被禁用且写明原因（REX-804 套件），确认那时**紧急停止**是否仍可用。
```

## 3. 本机证据与可复跑方式

```text
聚焦套件：node --test tests/rex807-surface.test.mjs tests/rex807-danger-confirmation.test.mjs
          （12/12；含 S12 的真实浏览器下载与字节校验）
相邻集：  + tests/rex804-web.test.mjs tests/rex804-faults.test.mjs tests/rex804-gateway.test.mjs
            tests/rex804-receipt-guard.test.mjs tests/rex801-research-ui.test.mjs tests/rex806-artifact-surface.test.mjs
          （32/32）
证伪：    python <process-dir>/rex807-danger-falsify.py —— **9 处突变全部变红**并按字节还原，
          其中一处改**网关**（放宽服务端令牌检查）、一处把 Export 留成摆设、一处把指标值退回散文。
全量：    node --test tests/*.test.mjs —— **1470 项 / 1465 通过 / 5 失败**，同一组 5 项在未改动 baseline
          `b9d6db2` 上同样失败（stash 实测）；差别只有一处：REX-804 危险区浏览器用例在全量并行下
          baseline 失败、加本增量后通过。**不把负载抖动写成产品缺陷，也不把你该看到的红藏起来。**
exact-head CI：V0.2 checks push 37559402329（结论以 Actions 为准，本文件不预写绿）
```

## 4. 环境事实与已知限制（不是借口，是给复检方的信息）

```text
· 本机**无法构建 Android**（无 JDK ≤21；AGP 拒绝 25/26）。Android 的编译与单测证据一律来自 CI android job；
  我从未声称在本机跑过 Android。
· Android 只做**观察**（run/status/critical attention）；authoring parity（创建/启动/停止/注入）是工作书允许
  记录为 future backlog 的部分，我没有实现，也没有声称实现。
· 本机全量并行下有 5 项既有失败（3 项 launcher/enrolment、1 项 theme lab、1 项浏览器），与 baseline 相同。
· 我在本轮**两次**改坏过文档/记录并已修复，均留在记录里：一次是把开发报告截断（锚点重复），一次是
  客户端的错误确认本地拒绝**挪动了已验收的 REX-804 边界**（已回退为只拒绝空/纯空白）。
```

## 5. 我明确**不**声称的事

```text
· 不声称已验收：所有裁决归对侧实体主机；本机不自审。
· 不声称「不靠 console」对**每一个**网关研究端点都成立：我只覆盖了本页渲染出的控件 + REX-803 已验收的主流程；
  若你发现某个端点在 UI 里没有对应控件，那是**应当被记录为缺口**的东西，而不是我声称已覆盖的。
· 不声称任何指标是「完整」的：无法测量的一律带原因，空列表就写空。
```
