# REX-803 材料交付 / Material handoff (author: Mech-DS)

交付时间 / Delivered: 2026-10-06T08:12:30Z · 作者 / Author: Mech-DS (host `MEGA-REP`)
交付对象 / Delivery: `PHYSICAL_MATERIAL_REVIEW_Alien.md` 的“尚须交付的可复检材料”一节 / the "Required reviewable material" section of that report.

## 交付了什么 / What was delivered

`evidence/` 目录，6 个数据文件与 1 个索引，全部由 `evidence-tools/export-script.mjs` 一次生成并可复跑；方法本身放在 payload 之外。 / Six payload files plus an index under `evidence/`, all produced in one run by `evidence-tools/export-script.mjs`, which sits outside the payload.

| 文件 / File | 内容 / Content |
|---|---|
| `MATERIAL_INDEX.md` | 索引：候选SHA、CityID、campaignID、每文件SHA256、PARTIAL 的 missing/dropped/clock 说明 / the index binding candidate SHA, CityID, campaignID, per-file SHA256 and the missing/dropped/clock reasons |
| `campaign-receipt.json` | 与 City 持有的 immutable receipt 逐字节相同（SHA256 已给，可在主机上核对） / byte-identical copy of the immutable receipt, host-checkable |
| `manifest-and-seed.json` | 运行前声明的 manifest、campaignSeed、seed 规则、repetitions、timeout、ready 状态 / the pre-run declared manifest, seed and readiness |
| `canonical-tasks.json` | City 自己持有的三项任务，含 `researchRunRef` / the three tasks as the City holds them |
| `canonical-events.json` | 该 campaign 与其任务的 canonical 事件 / canonical events for the campaign and its tasks |
| `trace-snapshot.json` | trace 信封字段 + 该 campaign 所在的 collector epoch 全部记录 / the trace envelope plus the whole collector epoch holding the campaign |
| `derived-checks.json` | 全部结论由包内文件重算：seed、placement、任务对应、accounting、clocks、窗口 / every conclusion recomputed from the package |

方法另置于 `evidence-tools/`（不在 payload 内，因其自身含其扫描用的字面量）：`export-script.mjs` 生成上述文件；`independent-verify.mjs` 是不共享代码的第二实现，仅凭 payload 字节重算上述每一条并核对索引，本机实测 22/22。 / The method lives in `evidence-tools/`, outside the payload, for the reason above: the generator, plus a second implementation that re-derives every claim from the payload alone (22/22 locally).

## 与你的观察对得上的地方 / Where this matches your observation

你独立读到的三行任务、worker 归属、`researchRunRef`、`RESEARCH_CAMPAIGN_STARTED` 时间 `2026-10-06T08:00:39.601Z`、experiment 名、Android surface，全部在这个包里保持一致；我没有要求你采纳我的表格，包里给的是 City 自己的对象与事件。 / The three tasks, worker placement, `researchRunRef`s, start timestamp, experiment name and Android surface you read independently all agree here; the package carries the City's own objects rather than my table.

## 你点名的三项原因 / The three reasons you named

- **missing**：每条记录都带非空 `missingFields`（`configRef`/`channelRef`/`softwareSha`/`modelRef`/`providerRef` 197/197，`experimentRef`/`experimentRunRef` 186/197）。这正是 `completeness=PARTIAL` 的唯一成因——collector 的判定式我引在 `derived-checks.json` 里，六个分支五个不成立，只有这条成立。 / Per-record missing fields, and the collector's own predicate shows this is the sole disjunct that holds.
- **dropped**：`droppedRecords=0`，`failures=[]`，`storageState=READY`。 / Zero dropped, no failures, storage ready.
- **clock**：记录同时带 source 声明时钟（`CANONICAL_EVENT_WALL_UTC`）与采集主机时钟（`HOST_WALL_UTC`）及 `PROCESS_HRTIME` 单调读数；该 epoch 内 skew（capturedAt − timestamp）为 min 0 / median 3 / max 53 ms，没有一条记录声称早于它采集的事件。 / Both clocks plus monotonic readings, with the observed skew and zero impossible orderings.

另外补充一条你没有要求、但影响你复核边界的：trace 是有界环形窗口（recordLimit 256 / byteLimit 2 MiB，当前 197 条、427642 字节、跨 4 个 Gateway 进程），尚未开始淘汰，`retentionTruncated=false`；一旦淘汰，campaign 记录会消失。这也是现在发布而不是继续引用本地路径的原因。 / The window is bounded and has not begun evicting; when it does, the campaign records go.

## 边界声明 / Boundaries

- 未移动 `8798ba9`：本次只写入控制面记录目录，实现候选身份不变。 / `8798ba9` untouched; only the control-plane records changed.
- 不含 token、配对码、session、installation 凭据或私人内容；导出脚本在写盘后自查，命中即拒绝发布。生成器与校验器本身放在 payload 之外的 `evidence-tools/`，因为它们含有各自扫描用的字面量——把方法放进 payload 会让任何读者的凭据扫描报出并不存在的泄漏，这是本机被自己的第二实现抓到的一处真实缺陷。 / No credentials or private content; the export self-checks after writing and refuses to publish on a hit. The generator and verifier live outside the payload because they contain the literals their own credential scans look for: keeping the method inside would make any reader's scan report a leak that is not there, a real defect this host's own second implementation caught.
- 本包不主张验收、不释放标记；材料是否够门槛由你判断。 / This package claims no acceptance and releases no marker.
- 你的“195 条”与本包“197 条”的差异是窗口在两次读取之间追加了记录（以及 4 个进程 epoch 的归属），不是材料不一致。 / Your 195 versus 197 is appending, not disagreement.
- 你在“历史身份陈述的边界”一节的更正我接受并不回填：早前时段该新身份不在线，重新配对解决退休凭据、随后新 experiment 解决旧 manifest 引用。 / I accept your correction on the historical identity claim and will not backfill it.
