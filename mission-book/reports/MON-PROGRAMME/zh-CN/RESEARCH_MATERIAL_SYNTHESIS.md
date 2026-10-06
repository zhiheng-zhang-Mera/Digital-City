# City Work Monitor 研究材料综合——有边界的观察

阅读译本 / Reading translation：本文逐节翻译历史原文，仅供阅读，不构成第二份权威记录。所有状态、观察范围和证据边界沿用原文。

候选 `fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40`，已接受依赖为 MON9017eb38f1b / MON902f4988248 / MON9033cd32c60；programme 最终验收仍等待另一物理主机审查；精确头的 push37420061997 / PR37420065177 / linkage37420065178 均已终态 SUCCESS。源代码/采集身份与 City 身份不同。控制与测试可以检查，这不是生产性能或新颖性声明。

| 观察项 | 观察结果 | 范围 / 证据 |
|---|---|---|
| 投影延迟 | 历史 MON901 canary：running 为1ms，failed 为0ms | 原始 canary 回执；不是当前原生端到端延迟 |
| 当前端到端延迟 | null / NOT_RUN | Gateway/UI/device 之间没有带仪器的统一计时 |
| 决策延迟 | 均值0ms，2个样本 | 受控时钟精度；被拒绝决策保留null |
| 决策排队等待 | 均值3ms | 2份保留的受控回执 |
| 来源分布 | RULE2、FAST_MODEL0、CRITIC0、OWNER0 | 需要 Owner 的建议1仍属于 RULE 回执 |
| 自动建议分布 | 1/2，比例0.5 | 保留窗口；没有任何建议被应用，不是任务自动完成 |
| 需要 Owner 的回执 | 1 | 实际打断/确认数为null NOT_RUN |
| 错误安全输出 | 部分窗口及仍活跃的 FAILED 均明确展示 | 一个受控场景；分类器错误安全率为null NOT_RUN |
| 现实漂移 | 物理端/原生端/Web 具有同一 City/task/failed-event 引用 | 没有广泛生产漂移率 |
| 阻塞事件探针 | monitor500；独立任务200/QUEUED | 真实 Gateway 测试；生产次数为null NOT_RUN |
| resolver 隔离 | 有界注入超时/按任务隔离测试通过 | 已接受 MON903 测试；生产 provider 为NOT_RUN |
| 边证据 | assignedNodeId 原因、相关规范失败指针 | 分配时刻/model/review 路径为null/NOT_OBSERVABLE |
| 大图 | 总体140，保留128，聚类127，可见3 | 折叠展开不会隐藏 FAILED；过滤真实边 |
| 诊断 | 原生风险2次点击/0次滑动；路径3/0；Web3次点击 | runtime-capture.json 与 UI 图片/XML |
| 离线诚实呈现 | 清除原生图并显示断连提示 | 物理原生离线图片/XML |
| 普通用户意图 | null NOT_TESTED | 只有工程师受控验收 |
| programme 异机审查 | NOT_RUN | Mech 必须独立验证当前精确头 |

## 审查者证伪

MON902 的11项独立探针推动修复了终态/历史被当作当前状态的风险、元数据缺失造成的错误平静、忽略折叠/排序、来源丢失、错误 City/凭据/导航/离线陈旧响应，以及 heartbeat DOM 缓存下证据面板的新鲜度。MON903 的10项独立探针推动修复了 Owner resolver 分类、生命周期关闭、UUID 保留、队列满证据/store 来源、资格真实性、超时保留、轮询/错误/持久化和被 heartbeat 饿死的轮询；真实 FIFO 测试缺陷被纠正而没有弱化认证。Mech 的兄弟扫描独立增加四类指标/窗口及一个 UI 表现，先5/6 red，再6/6 green。Services/Research 继承的 CI 失败是实际导航/重连产品缺陷，已修复；后续浏览器可见性负载疑点通过有界完整执行检验，在 MON903 有1386项通过。

MON990 技术批评者发现格式异常的 graph/receipt 对象会使 Compose 崩溃，并存在静默遗漏 quiet-node 的问题；解析边界现在拒绝这些对象，7项原生探针 PASS。Web 上下文链接最初缺失（red），现在可用。空 Owner 的提示文案限定于保留回执，而不是宣称全局平静。测试框架通知/模态窗口以及同步 ADB 阻塞事件循环的情况保留为无效采集尝试，不作为产品结果证据。

## 重放 / 消融候选

使用保留的精确 graph/receipt fixtures，分别启用和禁用折叠、元数据完整性及回调范围，重放以测量错误安全输出；移除语义轮询缓存以测量检查器变化；比较按任务队列与受控全局队列，以测量无关工作的延迟；使用独立决策判断者评估一个已配置且身份明确的 resolver。这些是候选实验，状态为 NOT_RUN。既不请求也不存储隐藏推理。

追踪索引：MON990 DEVELOPMENT_REPORT.md 与产品 evidence/raw/mission-book/MON-990/alien-cross-device；先前任务 PAPER_MATERIAL_INDEX 和审查报告保留作者/审查者/原始失败之间的区分。

语言配对 / Language pair: [原文 / Source](../RESEARCH_MATERIAL_SYNTHESIS.md)
