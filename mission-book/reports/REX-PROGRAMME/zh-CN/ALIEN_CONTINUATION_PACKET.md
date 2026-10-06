# Alien 继续执行交接包 — 截至 2026-10-06T04:30Z 的状态（Mech）

> 中文阅读译本，不是权威任务记录。[英文原文](../ALIEN_CONTINUATION_PACKET.md)保留这一历史检查点；当前状态以 canonical 工作书为准。

这是 Mech 为另一台物理宿主写的检查点，不代表任务池已完成，也不代表 Alien 领取任务。它取代较早交接包；早先开头的执行顺序已被 Alien 自己在 `reports/CEX-790/ALIEN_INTEGRATION_REPORT.md` 记录的 Owner 指令覆盖：优先 CEX-790，使其可合并，然后直接处理 MON；SHOW 仍被排除。

## 目前实际可以领取什么

```text
claimable_now_for_Mech_in_any_programme: 0
reason: every remaining actionable item is owned by, or owed to, the opposite physical host
```

对整个 mission-book 的新扫描（24 份真实工作书，排除模板 XX-000）得到以下精确结果：

| 分类 | 数量 | 项目 |
|---|---|---|
| READY 且未领取 | 0 | — |
| 开发完成、复检未领取 | 2 | REX-803、MON-903：作者均为 Mech，§3 禁止自检 |
| 复检已领取、结论待定 | 2 | MON-902 → Alien（已领取）；REX-804 → Mech（结论 **NOT PASSED**） |
| WAITING_DEPENDENCIES | 5 | REX-805/806/807/890、MON-990 |
| Alien 已领取、尚未开始 | 1 | SHOW-401 |

仅有 REX-801/802 **不会**解锁 REX-805；其 `dependencies` 字段要求 `REX-803:SCENARIO_REPETITION_ENGINE_ACCEPTED`，该标记尚不存在。

## 任务池为空时 Mech 做了什么（全部已记录，均非任务领取）

主动扫描失败形态，产出三条可采纳修复分支和一个跨任务缺陷族。三条中有两条由 **Alien 在 PR #33 中采纳**并保留来源，记录为另一宿主接纳已发布修复，不是对任何 Mech 任务的复检。

```text
repair/REX-801-mech-store-guard                            adopted into PR #33
repair/capability-bridge-mech-artifact-store-guard @ 8c67bb2   adopted into PR #33
repair/WBC-604-mech-profile-persist-first           @ 1f2f08c   AVAILABLE, not yet adopted
```

第三条涉及 WBC-604 profile store：City 无法持久化的变更原先会执行一半，运行 profile 已改变，但调用者收到异常；路由同时暴露原始 `EPERM` 和绝对路径。被证伪的探针与逐次 CI 测量见 `reports/REX-PROGRAMME/DEFECT_RESEARCH_STORE_HARDENING.md`，其中还保存可复现工具 `reports/REX-PROGRAMME/store-shape-sweep-v2.mjs` 和第一次扫描夸大覆盖范围表格的更正。

## REX-803 完成门槛：阻塞项现在是具名身份，而不是宿主

Alien 在 04:12Z–04:18Z 回到控制平面之后重新测量：

```text
EXPERIMENT  mech-alien-android-two-host-repetition   status VALIDATED   replayed true
ATTEMPT     POST /api/v0/research/campaigns {experimentId, scenarioId: WAIT, repetitions: 3, warmup: 1}
RESULT      HTTP 409  TOPOLOGY_NOT_READY   missing: ["alien-reference-node"]
NODES       alien-reference-node  online=FALSE  lastHeartbeatAt 2026-10-05T11:15:06.977Z  (UNCHANGED)
```

Alien 已在控制平面工作，但其 reference node 尚未加入 City。因此剩余动作是“加入 `alien-reference-node`”，而非“等待 Alien”。实验已注册，并在每次尝试时重新验证；该身份出现后，只需一次 POST 即可运行。

## Alien 自己的队列

1. MON-902 正式复检：**已经执行**。六个失败和一个缓存缺陷已复现，并在 `f4988248a3316806fc2e3fa9e62864ed129fe7b3`（PR #34）修复；三个同一精确 head 的运行均达到终态 SUCCESS（37414577586 / 37414583160 / 37414583135，逐次读取）。剩余事项是 Alien 自己在其 head 上决定结论、`review_complete` 和任何标记。Mech 的作者侧接纳位于 `reports/MON-902/AUTHOR_ACCEPTANCE_OF_REVIEW.md`，明确不把绿色 CI 转换为验收。
2. MON-903 正式复检：Alien 已在 `78bdd9dc873ebc257aedecf421068a1387dbec82` 领取，PR #32，结论待定。
3. REX-803 正式复检：仍未领取且可领取；目标 `a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df`，PR #31。
4. REX-804 修复：Mech 对 `f76ccf53` 的结论是 **NOT PASSED**，阻塞发现 B1 为不可读 fault receipt 导致 City 无法启动。复验需要修复后的 head。
5. 尚待采纳决策：`repair/WBC-604-mech-profile-persist-first` 和 `repair/mech-readme-city-install-step`；后者补 README 缺失的第二条安装命令，这正是两个套件被误认为因环境失败的原因。
6. Alien 自己的集成 PR #33：Mech 已独立验证，见 `reports/CEX-790/INDEPENDENT_VERIFICATION_Mech.md`；未发现合并阻塞，合并决策不属于 Mech。

Mech 不能执行 1–3，因为三个任务都由自己开发；也不能在 head 未变化时执行第 4 项复验。第 6 项属于 Mech，已经完成。

## 本交接包的诚实边界

- 不包含虚构测量；每个数值均来自扫描输出、逐次 CI 读取或运行中 City 的拒绝。
- 不领取 Alien 的工作，不合并，也不修改 main。
- `owner_required: false`、`terminal_reason: null`、`pool_incomplete: true`。
- 唤醒条件：Alien reference node 加入 City；REX-803 或 MON-903 出现复检结论；REX-804 有修复后 head；两条开放修复分支有采纳决策；或新的 Owner 指令为 Mech 开放工作。


## REX-803 门槛阻塞是缺少传输渠道的秘密，该问题现在已修复

三轮测量都以 City 拒绝 TOPOLOGY_NOT_READY、具名 alien-reference-node 为唯一缺失身份结束，看似宿主不愿出现。实际原因更窄：交付 reference node 使用 CITY_NODE_TOKEN；秘密由 City 所在宿主持有；项目禁止把秘密写入记录。因此其他物理宿主取得凭证的渠道根本不存在。等待不会改变。

City 已包含消除秘密传输的机制：pairing/info、pairing/exchange 为 public；owner 发出的短码被消费后注册 caller，并返回仅限其 device 的 sess: credential；auth preamble 对 session bearer 提前返回；assertOwnNode 仍把 member 限于自身 node identity，没有扩大 authority。缺少的是使用它的 joiner：

```text
feat/mech-join-worker-without-node-token @ c19da18   CI push 37428348788 SUCCESS attempt 1
  scripts/join-worker.mjs      consume the short code, become a member, run the reference worker with the session
  tests/join-worker.test.mjs   a real child process joins and the City lists it ONLINE with the capabilities an
                               eligible worker needs; killing it takes it offline
```

对侧宿主执行一次，无需传输秘密：

```text
on the City host      POST /api/v0/pairing/session with the owner credential -> a short code
                      read the identity the joiner prints and declare it in the experiment manifest
on the joining host   CITY_URL=http://<city-host>:4310 node scripts/join-worker.mjs --code <shortCode> \
                        --name "alien reference node"
```

这不关闭 REX-803 完成门槛，也不记录为已关闭：仍需 node 在线并运行三端 topology campaign。但现在只差一个命令和一个短码。

原文追加段末仍保留一条重复唤醒片段：REX-804 有新 head、任一开放修复分支有采纳决策，或新 Owner 指令为 Mech 开放工作。
