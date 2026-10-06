# PCF-701 开发报告（增量 1）/ Development report, increment 1

```text
TASK_ID            PCF-701 实时资源观测与 freshness / Live resource telemetry, presence and freshness
ROLE               Development（增量 1，开发未收口）
HOST               Mech（COMPUTERNAME MEGA-REP，role Mech-DS）
BRANCH             pcf/PCF-701-mech-live-resource-telemetry（系列分支 pcf/series-mech 同步该头）
BASELINE           659ff6aa98bc5675862b1170ed0cf5e1b78dba5f（= PCF-700 已验收头，也是系列累计头）
HEAD_SHA           e3c7256069796aac9e67c38042a1da03dbe26c7b（增量 1 修复头；前一交付头 20b55b6855fed1…）
CI                 run 37538196436（20b55b6，**失败一次：REX-801 套件拆除竞态，非本任务缺陷**，同头重跑全绿）
                   → run 37540047630（e3c7256，**success**，gateway-web 与 android 全绿）
DELIVERABLES       contracts/personal-compute-fabric-v1/observations.mjs（新增）
                   services/personal-compute-fabric/telemetry.mjs（新增）
                   tests/pcf701-telemetry.test.mjs（新增，13 项）
                   + PCF-700 的四条相位守卫在**本分支**上被改写为边界守卫（见 §2.3）
```

## 1. 交付物的语义（工作书要求 vs 已实现）

```text
observeResources(sample, context) -> ResourceObservation：**纯函数**，没有 I/O、定时器或环境时钟，
  因此同一组输入永远得到同一个结果，录制可回放（T13 断言）。
不许凭空造数：missing / NaN / 负数 / 单位不符 / 越界一律**不是 0**，而是带原因的存在性
  （UNKNOWN / UNSUPPORTED）+ value=null；可选适配器缺席 = UNSUPPORTED，与「读到了 0」严格区分（T1/T6）。
顺序：每个维度带 sequence，旧包不能覆盖新值（T2）。
epoch：bootId 不同一律拒绝，不与本 boot 混合（T3）。
时钟：ageOf 手工单调化 —— 回拨既不能让旧数据保持新鲜，也不能把已记录的老化撤销；回拨期间**即使被接受**的
  观测也只能是 STALE（T4/T5）。未来时间戳的样本记录但不称新鲜。
越权面：契约只认声明的维度；进程名/窗口标题/个人文件等维度记为 UNSUPPORTED 且 value=null，绝不落库（T12）。
collector：有界环（最旧被逐出，丢弃数按原因可见）、限频（节流时不调用采样器、返回上一次观测）、
  每次尝试有 deadline（超时返回全 UNKNOWN 而不是 0，且**不冻结调用方**：T7 用永不 resolve 的适配器验证）、
  采样失败显式上报、overhead 用注入的单调时钟测量（T9/T10/T11）。
```

## 2. 证据与自查（含本轮发现的自身问题）

### 2.1 逐条证伪：六处源码突变，六处变红

```text
M1 接受负值（去掉 NEGATIVE 分支）→ T1 红      M2 去掉顺序检查 → T2 红
M3 混合 boot epoch → T3 红                    M4 回拨后仍允许 FRESH → T4 红
M5 超时路径填 0 而不是 UNKNOWN → T7/T8 红     M6 环满不再计数 → T9 红
每次突变后源码按字节还原（sha256 比对一致），复位后 13/13 绿。
```

### 2.2 突变暴露的**装饰性断言**（已修，记录在此）

M4 第一次**没有变红**：T4 原本只用「未来时间戳」的样本验证回拨，而那条样本在**更早的规则**就被 CLOCK_ROLLBACK
拒绝，`freshnessOf` 里的回拨分支从未被执行 —— 断言看似覆盖、实则空转。修法：T4 增加**被接受的回拨路径**
（样本相对回拨后的 now 仅 5ms 旧、TTL 内，只有回拨标志能阻止它被报成 FRESH），改后再跑 M4 即变红。
这条按工程书要求记录为「探针自身的缺陷」，而不是悄悄补测试。

### 2.3 PCF-700 的相位守卫被**改写为边界守卫**（不是删除）

PCF-701 激活了 fabric 的第一个运行期模块，于是 PCF-700 里三条**相位性**断言不再成立：

```text
D4（tests/pcf700-dependency-direction.test.mjs）原为「没有任何运行期模块引用 fabric」→
   改为「fabric 引用只允许出现在声明路径下，且除 fabric 自身/其测试/其工具外无人 import 它」。
审计脚本 scripts/pcf700-reuse-audit.mjs 现在**同时**报告「全部运行期引用」与「声明路径之外的引用」；
复检包 C6 检查后者为 0，C7 由「候选目录未创建」改为「fabric 只存在于声明路径下且声明模块在场」。
**被验收头 659ff6a 保留原文**；本分支承载后继版本。改写的理由与前后语义都写在测试文件头部注释里。
证伪：临时在 services/dev-gateway 下放一个 import fabric 的文件 → D4 变红（3 pass/1 fail）、复检包 C6 变红
（6/8）；删除并重生成记录后恢复 4/4 与 8/8。
```

### 2.4 仪器修复：walker 抗目录抖动

PCF-700 的兼容套件在同一 `node --test` 进程池里 mkdtemp 并删除 `.scratch-pcf700-*`；守卫与审计脚本的 walker
若在 readdir 与递归之间撞上被删目录会抛 ENOENT，曾表现为一次**极快且令人困惑的 D2 失败**（而文件其实完好）。
walker 现在对 ENOENT 跳过而不是失败。连续三次并行跑三套 PCF 套件均 **24/24**。

### 2.5 机读记录的差异（相对 PCF-700 的已验收副本）

`data-records/{zh-CN,en}/pcf/reuse-wiring-audit.json` 已重生成（中英同字节），与 PCF-700 验收副本的差异**只有**：
新增字段 `pcfRuntimeReferencesOutsideDeclaredPaths`（本头为 `[]`），以及 `pcfRuntimeReferences` 现在包含
`services/personal-compute-fabric/telemetry.mjs`；合同目录计数随之变化。其余字段不变。PCF-700 的验收副本仍留在
`659ff6a` 上，未被改写。

### 2.6 CI 一次假红与修复（跨系列测试卫生问题，实测而非猜测）

`20b55b6` 的 hosted run 37538196436 **只失败一个**测试：`two equal host references are one physical host, not a
TWO_HOST_MESH`（位于对侧的 `tests/rex801-alien-independent-review.test.mjs`）。取回原始 job 日志后可见**断言其实已经通过**，
失败来自 finally 块：

```text
[Error: ENOTEMPTY: directory not empty, rmdir 'C:\Users\RUNNER~1\AppData\Local\Temp\rex801-review-J6CeIU']
```

即 Windows runner 上 `rm()` 与刚关闭的网关文件刷写竞速。证据链：同一头**重跑两个 job 全绿**；该套件在两个头上单独跑均 3/3；
本机全量套件里它也是通过的。因此这是**测试拆除竞态**，不是产品行为、更不是 PCF-701 的缺陷。

处理：把该文件里的三处 `rm()` 加上 `maxRetries/retryDelay` —— 与本仓库其它 helper 已有的写法一致（PCF-700 自己的
scratch-City helper 就是这么写的）。这是**测试脚手架修复，不改 REX-801 的验收**：对侧已验收头保留原文，本分支承载后继。
修复后该套件连续 3 次 3/3，PCF 三套仍 24/24。修复提交 `e3c7256`（本报告头）。

## 2.7 增量 2（head `f7581e9`）：facets、adapters、按路径的网络测量

```text
facets        total/free/reserved/inUse 改为**独立 facet**（`memory.free`、`disk.total`…），不再折成一个数：
              一个「memory: 8」会让放置决策把 reserved 当可用。每个 facet **各自校验**（free 读坏不影响 total）；
              缺失 facet 记 UNKNOWN（不是复制基础读数、更不是 0）；**free > total 视为 FACET_INCONSISTENT**，
              两个数都不再作为可用值交出，并保留 raw 对供诊断（否则调用方会算出负的 used）。
              `dimensionKeys()` 公布完整声明键集（基础维度 + facets），供界面审计逐项比对。
adapters      适配器**声明自己供哪些维度**；registry 合并可用者，并把「没有任何可用适配器覆盖的已声明维度」
              报为 UNSUPPORTED（绝不填 0）。参考适配器只读 Node 平台 API（`os.totalmem/freemem/cpus/loadavg`
              与 `fs.statfs`），**不 shell out 到厂商工具**（那会是无审批的新特权面）；vram/battery/thermal/网络
              在本运行时**声明为 unsupported 而不是省略** —— 省略与不支持对消费者看起来一样，必须能区分。
network-probe 延迟属于**路径**（`{from,to,route}`），不属于「局域网在线」：按路径标识键控；**未测量过的路径答
              UNKNOWN/NEVER_MEASURED 而不是 0ms**；挂死的探测变成有界 TIMEOUT 且不拖住调用方；非数值结果是
              INVALID_RESULT **失败**而非被接受；连续失败退避翻倍并有上限、成功即清零；只有真正测过的路径才会
              产出 networkRtt 样本，且以路径作为 provenance。
测试          T14–T19（新增 6 项，套件 19/19）；**11 处源码突变各自使套件变红**并按字节还原。
```

**新测试抓出了本轮我自己的两个缺陷（记录在案）**：

```text
D1 `rttOrNull` 这个**只读查询**会为从未探测过的路径创建状态 —— 读一次就改变了「哪些路径存在」的记忆。
   修法：改为 state.get(...) 读取，不创建；T18 现在锁住这一点（M9 突变复现该缺陷即变红）。
D2 INVALID_RESULT 分支只加失败计数、**没加退避** —— 一个说谎的探测会被全速重试。修法：与非数值失败同样翻倍退避；
   T19 锁住（M10 突变即变红）。
另：**证伪脚本自身**也有一处 bug —— 最终 before/after 比较仍只列两个文件（新增两个源文件后必然报「未还原」），
   制造了一次假警报；已修并记录，而不是悄悄改掉。
```

## 2.8 增量 3（head `4e97d50`）：throughput、queue 与 occupancy——以及证伪集暴露的死守卫

```text
throughput   `measureThroughput` **靠搬字节并计时**得出速率，绝不从延迟推断（1ms 的路径也可能很慢）；transfer 由注入
             提供（工厂或单次调用）。搬运量为 0/负数、挂死、非数值结果一律是 FAILED，**不是 0 B/s 的路径**；失败同样退避。
             延迟与吞吐是两个事实：测过一个**不会**回答另一个。
queue        `createQueueAdapter` **必须显式给出 source**，没有 source 就不可用 ⇒ `queue` 报 UNSUPPORTED，而不是编一个 0
             （`queue: 0` 会告诉放置决策「这台设备空闲」）。
occupancy    新增 `createRuntimeOccupancyAdapter`，读平台的 event-loop delay 直方图 ⇒ 「占用」是**运行时自身**的可测属性，
             而不是猜出来的队列长度；有直方图但暂时读不出均值时**不给值并给出原因**，绝不 0ms（0ms 等于声称「完全响应」）。
契约          `occupancy` 加入声明维度（milliseconds）。测试 T20–T22：套件 **22/22**，PCF 三套 **33/33**。
```

**证伪集这次真的起作用了（13 处突变全部被抓住，且暴露了两件事）**：

```text
· M12 删掉第二个 `bytesPerSecond <= 0` 检查后**全部测试仍绿** ⇒ 该检查是**不可达的防御性代码**。
  处理：从源码中**删除**该检查、并一并删除这条突变，而不是留着一个「看起来被覆盖」的分支。
· M13/M14 一开始没被抓住：registry 会**先短路不可用适配器**，其 `sample()` 根本不会被调用，于是「没有 source 就不编造」
  与「直方图读不出就不给 0ms」这两个分支在 registry 路径上不可达。处理：两条测试**同时直接调用 `sample()`**，
  现在两处突变都会变红。
· 所有突变按字节还原（sha256 一致）；套件在还原后仍 22/22。
```

## 3. 未完成（工作书子步骤）

```text
子步骤 1 部分：CPU/内存/磁盘已有**真实读数**（参考适配器）且来源/单位/bootId/seq/observedAt/receivedAt/TTL 齐备；
   **队列/占用尚无测量源**；GPU/VRAM、电池/温度仍只能**声明 UNSUPPORTED**（缺席处理正确，但真实适配器未做）。
子步骤 2 基本完成但**仍未勾选**：total/free/reserved/in-use 已区分并有矛盾守卫；presence 与 freshness 分离；
   观测/估计/用户声明分离；网络**按路径**测量并带预算/期限/退避 —— 唯一剩余缺口是**带宽（throughput）探测**未实现
   （`networkThroughput` 目前只会随适配器声明为 UNSUPPORTED）。
子步骤 3 完成：有界缓冲、限频、丢弃计数、overhead 测量、以及「不采集未授权进程名/窗口内容/个人文件」。
异机验收部分（真实两主机至少采集 CPU/RAM 并记录自身开销）属复检方执行（EXECUTION_CONTRACT §14）；
   本轮仍只做到单机组件证据（本机的参考适配器已能产出真实 CPU/内存读数，供复检方跨机对照）。
```

## 4. 边界（未越过）

```text
不采购/不付费、不装系统服务、不改运行 profile、不启用远端执行；未把 fabric 接入网关（D4 边界守卫在守）；
UI 一律未接线（资源/freshness 属 Advanced device detail，风险投影归 715）；merge_authority 保持 false。
```
