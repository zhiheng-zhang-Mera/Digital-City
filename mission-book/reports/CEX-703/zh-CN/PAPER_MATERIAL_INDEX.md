# CEX-703 能力发现素材

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书／状态；历史与未知边界原样保留，不新增验收。

能力CAP-ASK-001，Registry回填候选。后端target目录已存在，但Web Ask／Do无普通页面按钮，Android仅unmatched Ask后picker。采用既有目录的薄真实路径，无第二硬编码列表。

| 事件 | 观察／判断 | 证据 | 状态 |
|---|---|---|---|
| 发现缺口 | 首测假设不存在Ask／Do导航按钮，超时；selector无效。产品可达要求新增可见Ask栏目录入口 | Utopia web-red.log／web-green.log | INVALID_INSTRUMENT，保留 |
| 基线红色 | 修正入口测试对基线terminal确认缺catalog-open | Utopia web-functional-red.log | REPRODUCED |
| 后端对等 | Fixture16：ROOM5／CAPABILITY6／CITY_TASK5，Room Hub停使5不可用 | Utopia evidence/raw/mission-book/CEX-703/catalog-receipt.json | COMPONENT_PASS |
| 薄用户路径 | Web2点击开真实目录，无Ask失败；选择仅准备、不POST | Utopia tests/cex703-catalog-ui.test.mjs | PASS |
| 动态传播 | 规范后端ROOM_OPERATIONS测试fixture插操作，reload后无前端改动即出现；测试后移除 | 同真实Gateway／浏览器测试 | PASS，仅受控fixture |
| 确认 | 选择City target在既有确认前零任务，确认后恰一queued | 同测试 | PASS |
| Android | 80单测／构建通过；OPPO离线Ask目录可见禁用，在线NOT_RUN。原CEX701 APK恢复，prefs保留 | Utopia android-green2.log／physical-ask.xml | BOUNDED_COMPONENT_PASS |
| 执行错误 | helper尝试重新赋const停止原生state-key改动；明确修正重跑构建 | 本地输出／android-green2.log | REPAIRED |

精确开发358fbb20a7b23826e92a04d7d893f22c65d56eec，CI37207524312 IN_PROGRESS。无最终验收或意图验证。此前精确历史步骤、上下文窗口／压力、全局返工数NOT_OBSERVABLE。任务／分支／基线由持久领取恢复，不存隐藏推理。

```text
research_evidence_applicability: APPLICABLE
long_horizon_context_evidence: CAPTURED
research_evidence_refs: [mission-book/reports/CEX-703/CLAIM_RECORD.md, mission-book/reports/CEX-703/PAPER_MATERIAL_INDEX.md]
```

研究证据适用、长期上下文采集，引用如上。

| 事件 | 观察／判断 | 证据 | 状态 |
|---|---|---|---|
| 独立评审P2 | 不确定重试丢selection／key，route.fetch后abort复现；修复保留draft | Utopia retry-red.log／retry-green.log | REPAIRED；9／9 |
| 精确源码CI | 最终a96da907a937eb043a59ddd00f48031ded749fa9 CI37207716885 success；不以早头成功代替 | DEVELOPMENT_HANDOFF.md | PASS |

控制规则9541aeb watchlist对账：research_watchlist_hits=[RS-G3-EXEC-WORK-ARTIFACT,RS-G3-IDENTITY-PROVENANCE,RS-G3-INDEPENDENT-REVIEW-BOUNDARY,RS-G4-CAPABILITY-STATE,RS-G4-USER-REACHABLE-TERMINAL]；highest_research_grade_observed=G4_RARE_SYSTEMIC；research_capture_level=MAXIMUM_BOUNDED。为预定义候选类别，不是novelty。开发／CI完成，原生在线／对侧接受意图待定；Registry诚实四维。源码／报告／CI组成有界事件链，不可观察时间／计数未知。

时效：规则a44613d取代前分类，USER-REACHABLE-TERMINAL现RS-G3-USER-REACHABLE-TERMINAL、G3_SPARSE_ACTIVE；前冻结标签历史。能力状态仍RS-G4-CAPABILITY-STATE。文献重分类源外部策略更新；复发预防／激活总数NOT_OBSERVABLE。

原生在线后续仅对已观察布局／选择取代此前仅离线缺口：NATIVE_LAYOUT_FINDING.md和NATIVE_LAYOUT_FIX_RECEIPT.json保留实际显示失败、修复源／APK、80单测／构建、零任务选择及恢复。16全部卡片／原生mutating确认／对侧Formal Review未观察。

## 对侧物理主机评审扩展（Mech，MEGA-REP）

以上作者陈述保留时间线，仅一点取代。

不同物理主机Mech在精确478d486096512eea3266350efe070323a232a120 Formal Review PASS。utopia:tests/cex703-mech-review-probes.test.mjs、review/CEX-703-mech-review at006ec9f，7／7，六真实浏览器／Gateway，决定全部工作书检查：新用户EXACTLY TWO交互、ZERO Ask；渲染行与后端同序双向16／16；每不可用禁用且后端unavailableReason；选卡零执行，提交带命名target规范selection；换synthetic target响应只渲该一行，证明无第二手写目录；City任务在既有确认前零创建。作者原样3／3；本机Android80／80、14套件。不触旧测试。

F1 MEDIUM：Android chip读availability／side-effect却忽略mutating，checklist／bookmarks／knowledge.add-entry实测mutating=true、sideEffect=false，仅因loopback Room Hub不可达而不可用；Hub答复即标SAFE，与三行下“写本地产品数据”警告矛盾，区别Web按名标mutating。权威未丢，仍经确认。F2 LOW空目录Web仅标题无原因，Android明确empty。F3 INFORMATIONAL变更前必需步骤数NOT_OBSERVABLE，但基线显示Web仅UNMATCHED后取targets，Android额外点击，虽未测可推导；工作书未定义step。F4 INFORMATIONAL索引5／16不可用，无Hub fixture10／16，为ENVIRONMENT差异，使F1可达而非潜在，数量应带环境。

Android在线目录仍NOT_RUN，意图NOT_TESTED。释放CAPABILITY_CATALOG_DISCOVERABLE。见 [REVIEW_REPORT.md](./REVIEW_REPORT.md)。

语言配对 / Language pair: [English](../PAPER_MATERIAL_INDEX.md) · [中文](./PAPER_MATERIAL_INDEX.md)
