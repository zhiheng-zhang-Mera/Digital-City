# REX-806 材料包可复现性 / Artifact reproducibility — Mech

作者 / author: Mech-DS（`MEGA-REP`）· 对侧主机 Alien 复检用材料 · 时间 / at: 2026-10-06
工具 / tool: `evidence-tools/REPRODUCIBILITY_PROBE_MECH.mjs`（`REX806_REPO` / `REX806_CITY` / `REX806_CONFIG` / `REX806_PUBLISHED`）

## 要回答的问题 / The question

**这个包是不是「那台 City 在那个时刻」的字节级函数？** 若不是，对侧主机一跑就会看到差异，然后花时间怀疑包、怀疑自己、或怀疑环境。所以本机先把差异**主动制造出来并解释掉**，而不是等复检者撞上。

```text
包        mission-book/reports/REX-806/artifact/（10 个数据文件 + checksums.json）
exporter  services/dev-gateway/research/artifact.mjs（纯函数）+ scripts/export-research-artifact.mjs（读 City）
City      031fdba6-e94c-4298-a095-6ff04a65481d（常驻，运行已接受候选 0261a9e）
published 生成时刻 manifest.generatedAt = 2026-10-06T10:38:11.611Z
```

## 哪两个输入没有被冻结 / Two inputs the package does not freeze

导出器本身是纯函数：同样的输入产出同样的字节。但 CLI 的**两个**输入来自「活的」City，不可能被包本身冻结：

```text
(a) manifest.generatedAt   CLI 读墙钟（new Date().toISOString()）
(b) rawPointers.events     CLI 取 GET /api/v0/city 的**整条**事件流，而不是 campaign 范围的 trace 记录
                           —— 一个还在运行的 City，后一次导出必然看到超集
```

`traceRecords` 反而是 campaign 范围的（CLI 按 campaignId/taskRef 过滤），因此它不随无关活动增长——这正是同一份包在两次导出中 `traceRecords` 完全相同、而 `events` 不同的原因。

## 实测一：什么都不钉的朴素重导（会看到差异）/ Naive re-export

```text
11 个文件中 3 个不同，8 个字节相同：
  manifest.json      仅 generatedAt（2026-10-06T10:38:11.611Z → 11:21:32.713Z）
  raw-pointers.json  多出 3 条 event id，receipts 18 / canonicalTasks 26 / traceRecords 176 / experiments 17
                     **四类指针全部逐条相同**，多出的 3 条只出现在 events（574 → 577）
  checksums.json     只有上面两个文件的条目不同，其余 8 条 sha256 与包内一致
```

多出的 3 条是包生成之后才到达的实时活动：它们的 `sourceStreamRef` 是 **City 级 stream id**（= `cityId`），而非某个 campaign，`canonicalRefs` 也为空——因此它们进得了「整条事件流」，却在 CLI 的 campaign 过滤下进不了 `traceRecords`（本机在 City 的 `research-trace/trace.jsonl` 里能找到这 3 条，包里却没有引用它们）：

```text
+ 2026-10-06T10:40:18.756Z  seq=575  DEVICE_SESSION_ISSUED   （设备 dev-8128a1ef…）
+ 2026-10-06T10:47:40.492Z  seq=576  CLIENT_CONNECTED
+ 2026-10-06T10:47:50.432Z  seq=577  CLIENT_DISCONNECTED
```

**这条差异本身就是包的属性说明：它是 City 事件流的「时间切片」，不是「该 stream 的全部事件」。** 复检者若做朴素重导，应当预期且只应当预期这三处。

## 实测二：钉住两个输入后重导（应当字节相同）/ Frozen-input re-export

把 `generatedAt` 钉到包内值、把事件流截断到该时刻，再导出一次：

```text
byte-identical files: 11/11     differences: none
```

**包括 `checksums.json` 在内全部字节相同**——于是「包 = 那台 City 在那个时刻」这句话是可以被证伪而没有倒的。同时这也独立复算了一遍 `checksums.json`：对目录内 10 个文件重新 sha256，与包内条目逐项一致（`bytes` 与 `sha256` 都一致，0 mismatch）。

## 实测三：负对照（探针必须会失败）/ Negative control

按本机惯例，先证明探针能红：把 `metrics.csv` 里 `completion_time_ms` 由 `6595` 改成 `6596`（1 ms），其余不动：

```text
DIFFERS metrics.csv   → byte-identical files: 10/11   exit=1
```

一个改一毫秒就能变红的探针，通过了上面 11/11 才有意义。

## 本工具自己的一处仪器错误，记录而不掩盖 / My own instrument error

第一次核对「包内 checksums.json 是否仍与目录字节一致」时，脚本把 PowerShell 的 `PSCustomObject`（`@{bytes=…; sha256=…}`）直接与哈希字符串比较，`-eq` 恒为 false，于是 10 个文件全被打印成 `MISMATCH`；同一段脚本对「朴素重导的 checksums 差异」也因此把 10 个文件全报成不同。改为比较 `.sha256` / `.bytes` 字段后，结论是上面写的那样（10 个文件 0 mismatch；朴素重导只有 2 条不同）。**属于本机复发的「仪器错误」类：探针的输出格式与判断不在同一维度，看起来像发现、实际是工具坏。** 该脚本不随包发布（一次性核对），但这正是本机不把「打印出的 MISMATCH」直接当结论的原因。

## 对复检者的结论 / What this means for the review

```text
1  包不需要「相信」：钉住两个输入即可逐字节重造（本机 11/11）
2  朴素重导应当只差 manifest.generatedAt、raw-pointers.events 的后续事件、以及 checksums.json 中对应的两条
   若差在别处（尤其 metrics.csv / normalized-dataset.json / exclusions.json），那才是真问题
3  独立重算的入口仍然是包内第二实现 scripts/verify-research-artifact.mjs（14 项检查，不 import 导出器），
   或自己另写一份——本机对它的运行不是复检证据
4  本机未改动开发头：本记录与 PROVENANCE_CROSSCHECK_MECH.mjs 一样，是关于这份包的证据，
   head 仍为 3950d478e627aaa615ef69e3ac65c30da37c5ea6
```

**边界 / Limits：** 本探针需要产出该 City 的 owner 凭据才能读 `GET /api/v0/city`，因此只有持有该 City 的主机能跑；对侧主机（MEMBER）能跑的是包内自带的独立校验器或自己另写的重算。本探针**不主张** City 的生产确定性（同一 campaign 两次运行是否给出同样数值），那属于另一问题，也未见有证据。
