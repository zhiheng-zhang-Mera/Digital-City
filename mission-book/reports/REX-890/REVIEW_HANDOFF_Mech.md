# REX-890 — hand-off to the reviewer / 给复检方的交接

```text
从        Mech（开发主机）
给        对侧实体主机（review_host）
性质      交接，**不是**复检结论。§3 禁止自审：本文件不含、也不得被读成"复检已完成"。
```

## 1. 取什么 / What to fetch

```text
repo       zhiheng-zhang-Mera/utopia      branch  feat/city-owner-remote-operation
head       314326007dce6e328792053936ce4c3a80c3b1e2     （40 位，请照抄；CI run 37720240214 success）
package    evidence/raw/rex890-studies/2026-10-08-B/artifact/     （13 文件，随分支进仓）
manifest   evidence/raw/rex890-studies/2026-10-08-B/MANIFEST.sha256（13 条，包外，覆盖全部文件）
无需安装   复现工具只用 Node 内置模块（WebSocket 用全局的，Node 22+）
```

## 2. 跑什么 / What to run

```bash
node scripts/rex890-opposite-host-reproduce.mjs \
  --artifact evidence/raw/rex890-studies/2026-10-08-B/artifact \
  --city <城市> --config <带 token 的文件> --out <你的输出目录> --label <你的主机名>
```

这正是工作书要求的六步：**重建 → 独立执行 → 重算 metrics → 对比 trace/provenance → 指出不一致 →
（修复后）再复现**；工具把前五步做成可读的输出，第六步只有在出现不一致时才需要。

## 3. 期望值 / Expected

```text
inconsistencies 0 · evidenceGaps 0 · reproductionComplete true · exit 0
```

**两个"看起来像失败、其实不是"的情形，先看这里：**

1. **树必须是干净的。** 工具会**观测**它运行的检出的软件身份；工作树不干净 ⇒ 如实记为
   `checkout has uncommitted changes` 的 **evidence gap** ⇒ **exit 2**。
   这表示"这份结果无法从它声称的提交复现"，**不是**"复现失败"。
2. 包声明 3 个节点，但它的 run 只落在 2 台上；工具会打印
   `the package's topology lists 3 node(s) but its runs name 2 executing device(s); declaring the executors`
   并按**真正执行过的设备**判断 —— 这是已修的已知行为，不是不一致。

另：城市现在有 50 份 campaign 回执，回执窗口截断了最旧 1 份，所以**现在重新导出会 exit 1**
（`RECEIPT_WINDOW_TRUNCATED`）。按**包**复现不受影响。不要用"重新导出"当作复现手段。

## 4. 你要产出什么 / What you must produce

```text
① 你自己那次复现的原始报告（不要只给结论；exit code 与 inconsistencies/evidenceGaps 逐条列出）
② mission-book/reports/REX-890/REVIEW_REPORT.md
   至少要写：你观测到的软件身份（40 位 head + 树是否干净）、你跑出的 exit code、
   你的 inconsistencies/evidenceGaps 条目（**原样**，包括具名 gap）、你**不能**复现的部分及原因、
   以及你对 final gate 第①项是否成立的判断
③ 若出现不一致：按具名条目带回。若出现 gap：**原样带回**，不要自行解释成"通过"或"失败"。
```

本目录的 `REVIEW_REPORT.md` **故意不存在**，等你写。本机不会替你写，也不会先填 `review_*` 字段。

## 5. 请你不要做的事 / Please do not

- **不要复述本机的数字当自己的结论。** 本机的彩排记录（含那份 `exit 0`）写在
  `reports/REX-890/DEVELOPMENT_REPORT.md` 与包的 README 里，供你对照，不供你引用为你的证据。
- 不要把 `NOT_MEASURED` 读成 0。27 项指标里 23 项未测，各带原因。
- 不要用开发主机上的旧 checkout：那会声明一个不是你所跑代码的软件身份（工具会把它记成 gap）。

## 6. 凭据 / The credential

Owner 的裁决（2026-10-08）是**带外交付 + 跑完即轮换**，**不**新建"受限复现凭据"能力。
**范围如实说明**：拿到的 control token 是该城的**主凭据**（可读城市/任务/节点/研究状态、建任务、
发远程操作（受 allowlist 限制）、改名、撤设备、批准入网），**比"只读 + 复现"宽得多**。
跑完请通知 Owner 轮换（改 `local-config.json` 的 `token` 并重启城市，旧 token 随即失效）。

## 7. 不在你范围内的 / Not yours

**exposure gate PASS** 由 **Owner** 亲自审阅 `CAP-CITY-REMOTE-OPERATION-001` 与
`CAP-CITY-AGENT-JOB-001` 后给出（两份登记都写着"没有独立评审"）。这不是对侧能决定的事，
但它和你的复现结论**一起**决定 final gate 是否成立。
