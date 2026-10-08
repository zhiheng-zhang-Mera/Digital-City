# REX-890 Alien 代码验证与收尾交接 / Alien verification and closeout handoff

执行主机 / Physical host: `Mera-Alianware` (Alien), 2026-10-08 Australia/Sydney.

本记录是代码验证与修复证据，实体独立复现仍为 `NOT_RUN`；不释放 `RESEARCH_EVALUATION_FABRIC_V1_REPRODUCIBLE`。
This record establishes code verification and repairs. Physical-host reproduction remains `NOT_RUN`; the terminal marker is not released.

## 对象与来源 / Scope and provenance

- 用户请求：读取 Mech 工作汇报与交接书，验证代码并配合收尾。文档中的操作步骤作为待验证的交接材料，而非新的用户授权或实测事实。
- 输入：`E:\REX-890_BOOTSTRAP_HANDOFF_Mech_2026-10-07.md`、`E:\session-respond.md`。
- 实现基线：`utopia origin/feat/city-owner-remote-operation @ 2d56f2779807b695c1c260391e3aed35b588c720`，本次 fetch 与远端一致。
- 基线 hosted CI：run [37656051332](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37656051332)，API 读回 `completed / success`，绑定上述 exact SHA。
- 记录基线：`Digital-City origin/main @ b9eae748491aa5f9f6164f35bc00c4fda7c8d761`。
- 修复：`utopia review/REX-890-Alien-20261008 @ 205d7b2d7d4f775c0de7dbb30ef29c156a3b94ff`；已独立核对本地 SHA、远端 ref 与干净工作树。
- 新头 CI：[37705326802](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37705326802)，最新读取 `in_progress`，不能沿用基线的 success。
- 工作区：`D:\Utopia-tree\REX-801-890\Utopia-REX890-Alien-20261008`；保留 `D:\utopia` 的现有分支及常驻城市。

## 发现与修复 / Findings and repairs

真实 CLI 黑盒用例（临时 HTTP/WS 测试服务，不是实体城市）证明六条 false-success 路径。修复前 7 项中 1 通过、6 失败；修复后 7/7 通过。
Black-box cases execute the actual CLI against a temporary HTTP/WS fixture. Before repair: 1 pass and 6 failures; after repair: 7/7 pass. These are tests, not physical-city evidence.

| 情况 / Case | 基线结果 / Before | 修复后 / After |
| --- | --- | --- |
| 包有数字，重算为 null / numeric claim, null recomputation | `agrees`, exit 0 | named inconsistency, exit 1 |
| 必需指标行缺失 / required metric row missing | note only, exit 0 | named inconsistency, exit 1 |
| 已测指标为非数字 / nonnumeric measured value | `agrees`, exit 0 | named inconsistency, exit 1 |
| 独立 campaign FAILED / independent campaign failed | attempted=true, exit 0 | terminal state mismatch, exit 1 |
| 独立 campaign 少跑重复 / missing independent repetitions | exit 0 | repetition/device evidence mismatch, exit 1 |
| trace 窗口空、持久库不可读 / no trace evidence can be read | VACUOUS note, exit 0 | evidence gap, reproductionComplete=false, exit 2 |

另检查重建总 run 数、每个独立 run 的 COMPLETED/MEASURED/设备归属、声明设备是否实际执行。报告新增 `evidenceGaps` 与 `reproductionComplete`；缺失 trace 证据保持不可验证，不伪造为数据不一致。
The repaired harness also checks rebuilt run count and independently completed measured runs on the declared devices. Unavailable trace evidence is a gap, not an invented inconsistency.

代码与回归用例：`scripts/rex890-opposite-host-reproduce.mjs`、`tests/rex890-reproduction.test.mjs`。详细日志见本目录 `evidence/`。

## 验证 / Validation

- remote-operation / agent-job / durable trace 契约与网关：34/34。
- 两条能力 Web 用例：8/8，包括页面执行、真实结果、拒绝、默认关闭、停止。
- 新复现工具回归：7/7，既验证完整证据 exit 0，也验证上述六条拒绝路径。
- `check-bilingual`：docs、evidence、data-records 均 `SYNCHRONIZED`。
- `verify-promotion-history`：10 条记录验证通过。
- 全量套件：2018 项，2009 pass、6 fail、3 skipped、0 cancelled，exit 1（279147.5851 ms）。不声称全量绿色。此轮启动时尚未安装 city 子项目依赖；以下保留该轮完整结果与针对失败的复跑。
- 首次全量运行有三条缺少 city 子项目依赖的失败：`document bytes flow through real readers and into temporary knowledge`、`CEX790 current audit includes reversed routes, owner controls, catalogs and branch-scoped YAML candidates`、`Bridge Road extraction preserves all six published document retrieval digests`。安装锁定 city 依赖后，相关套件复跑 12/12 通过。首次失败不删除。
- launcher 三项因测试主动拒绝打扰占用协调端口的常驻城市失败；协调端口 4389 正在监听。未停止城市，也未把这些项目改为 PASS。

## 尚需输入与 final gate / Remaining inputs and final gate

1. `172.31.12.151:4310` TCP 可达，但本机 `D:\utopia\.runtime\local-config.json` 属于其他 City，向目标 City 请求返回 HTTP 401 `Invalid pairing token`。需要目标城市有效 Owner 配置文件的本机路径。领取智能体任务另需该城市 node token；不在报告或命令行回显凭据。
2. Mech study 原始包 `4in1-acceptance-2026-10-07/rex890-dev-study/artifact` 未包含在所取 Git 树中，本机未找到。需要原始包的可访问本机/共享路径，不能用 REX-806 的旧包替换。
3. 已请求上述输入。未注册新节点、未 claim 已排队工作、未 report、未替换常驻 agent。交接书中的任务状态、截止时间和 live runtime identity 尚未读回验证。
4. 取得输入后，从包重建、重算、完整比对 trace/provenance，在 Alien 发起独立 campaign，再使用修复后的工具复跑；结果按实际证据报告。
5. 能力登记中的 Web reachability、Android 缺入口、intent NOT_TESTED 等边界保留。登记文件存在本身不构成新的独立 exposure PASS。

最终状态：`CODE_REPAIR_VERIFIED / PHYSICAL_REPRODUCTION_NOT_RUN / FINAL_GATE_NOT_RELEASED`。本报告不能被读成 REX-890 完成，也不构成主分支合并授权。
Final state: code repair verified; physical reproduction not run; final gate not released. This report does not establish REX-890 completion or authorize a main-branch merge.
