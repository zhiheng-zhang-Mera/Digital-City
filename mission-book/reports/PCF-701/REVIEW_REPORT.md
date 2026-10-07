# PCF-701 跨机复检裁决：Windows CPU 占位零修复 / Cross-host verdict on the Windows CPU placeholder repair — Mech

```text
VERDICT            ACCEPTED —— 修复对象 cf07f4a 通过本机独立复检；不要求返工（一处非阻断观察 + 一处可用性实测记录）
REVIEW OBJECT      cf07f4acb3be0fe3e734ed39bf9145348e2d7ba8（repair/PCF-701-alien-windows-cpu-20261007，PR41 tip）
AUTHOR HEAD        4e97d503989beba82124a1b6e3286825f33b92fc —— 缺陷所在头；diagnosis 由 Alien 给出，修复不基于其它头
DEFECT REVIEWED    Windows 上 `os.loadavg()` 是固定 [0,0,0]，作者头把该占位值当作 `presence: OBSERVED` 的测量发布 ⇒ 伪造了一个 0
REVIEWER           Mech（COMPUTERNAME MEGA-REP，role Mech-DS）—— 对该修复而言是合法对侧（修复由 Alien 提出）
MARKER             本次不释放、不撤销任何 marker
MERGE              **不合并**：PCF 系列没有 merge_authority（Owner Gate 是 REX 专属）；
                   已验收头只累积在系列分支 pcf/series-mech 上。PR41 保持 OPEN（state=OPEN, mergedAt=null）
EXACT-HEAD CI      cf07f4a：push 37551887749 / PR 37551894210 / linkage 37551894202 —— 三项全 success
```

## 1. 复检对象与冻结

```text
· 复检期间头未移动：worktree `D:\utopia-pcf701-followup` 在 cf07f4a detached，`git status --porcelain` 全程为空。
· 差异范围相对作者头仅两文件：services/personal-compute-fabric/adapters.mjs (+25/−3)、
  tests/pcf701-alien-review.test.mjs (新增 32 行)。无特权工具、无 Gateway 接线、无已部署产品改动。
· exact-head CI 按 commit 查得三项全绿（见上）；作者头 4e97d50 的 run 37545526161 亦为 success，两者都不抹掉。
· 本机新装依赖：corepack pnpm install --frozen-lockfile 与 --dir city 两步，均 exit 0。
```

## 2. 缺陷本身：Alien 报的是真缺陷，我确认并已修复

```text
MEASURED 在作者头 4e97d50 上，真实 Windows 首样本会给出 CPU=0 且 presence=OBSERVED、source=node-system。
         该 0 不是测量，是 Node 在 Windows 上 loadavg 的固定占位值。
⇒ 这违反我自己的规则「绝不编造数字」，且触发条件是**最常见的路径（首样本）**，不是罕见边界。
   我对此负全责：原守卫 T16 只断言 `cpu.value ∈ [0,1]`，0 满足该断言 ⇒ 断言从未覆盖「这个数是不是测量」。
```

修复后的行为（本机实测，见 `intermediate-logs/2026-10-07-mech/`）：

```text
· win32：不再读 loadavg；逐核读 os.cpus()[i].times 的 (user,nice,sys,irq,idle) 计数区间，
  按 (total−idle)/total 计算，source = `node-system:cpu-time`。
· warmup（无上一窗口）、计数回退、窗口未增长、计数缺失 ⇒ **不给值**，只给原因
  `cpu unavailable: CPU-time interval missing, unchanged or reset` —— 是「说出来的缺口」，不是 0。
· 非 win32 保持原 loadavg 路径不变（source 仍为 `node-system`）⇒ 修复是**限定范围**，不是删除功能。
```

## 3. 独立复现：Alien 的四条反例 + 三条突变

我用自己的探针（`pcf701-repair-probe.mjs`，W1–W5，**连续三次 11/11 PASS，零波动**），不重用对侧探针：

```text
W1a/W1b 真实 Windows 首样本不给值、且给出原因；**任何** win32 CPU 值的 source 必定是 cpu-time 路径
        （即「占位零路径」已不可能出现，这是被修复缺陷的直接守卫）
W2a/W2b 只有在**我自己测量到计数确实前进**之后才要求出现 ratio，且 source 为 cpu-time
W3a/W3b/W3c/W3d 注入 warmup / 计数回退 / 窗口零增长 / 计数缺失 —— 四种情形都不给值、都给原因、绝不给负数
W4/W4b  注入**逐核不对称**的计数（A: 30/10，B: 50/20），断言聚合值等于我从同一批注入数算出的期望值
W5      非 win32 仍发布 loadavg 读数（0.5，source=node-system）⇒ 修复确实是限定范围的
```

证伪（源码突变必须让套件变红，之后按字节还原）：

```text
既有 13 处突变（M1–M11、M13、M14）在 cf07f4a 上**全部 CAUGHT**，源码字节一致。
针对修复新增分支的 5 处突变（`pcf701-repair-falsify.py`）：
  N1 恢复 Windows 占位 loadavg 发布（= 被报缺陷本身）      → CAUGHT
  N2 仍走 cpu-time 但值恒为 0（同一个谎换个名字）            → CAUGHT
  N4 不保留上一窗口基线（真实区间永远不可用）                → CAUGHT
  N5 计数回退也照样发布 ratio（负数/垃圾变数字）             → CAUGHT
  N3 聚合时静默丢掉每第二个核                                → **NOT CAUGHT**（见第 4 节：观察，非缺陷）
所有突变后源码 sha256 与突变前一致（脚本自证，且 after-restore 套件回到 26/26）。
```

## 4. 观察项（非阻断）：作者测试的核夹具是对称的

```text
N3（聚合时丢掉一半核）在作者套件下**全绿**。原因不是聚合逻辑错，而是作者（与我最初一样）的夹具让所有核
携带**完全相同**的计数：丢掉一半核、或误用单核值，只要核数≥2 且计数相同，算出来的 ratio 就不变。
⇒ 建议（不阻断验收）：把 `tests/pcf701-alien-review.test.mjs` 的核夹具改成**逐核不对称**，
   让「聚合」这一语义有真断言。我的 W4 已独立覆盖该语义（当前为 PASS），故本条不影响本次结论。
```

## 5. 本机两主机采集已完成；一个可用性实测记录（重要，但不改裁决）

```text
[已完成的两主机采集] 用 **Alien 自己的** `evidence-tools/LIVE_SAMPLE_ALIEN.mjs`（未改动，字节一并留存），
在 Mech 上绑定 PCF_REVIEW_HEAD=cf07f4a 运行 4 次采样：
  首样本 CPU=UNKNOWN（warmup），随后出现有限 ratio；RAM total/free 与每次 overheadMs 同时记录；
  样本自述 host=Mega-rep、platform=win32、sourceHead=cf07f4a ⇒ 两主机（Alien 的样本 + 我的样本）均已留存。
  `remoteReturnConsumption` 字段仍为 NOT_RUN —— 该字段描述的是**回传后被对侧消费**这一步，属 Alien 侧流程；
  我不声称已完成它。两边样本按字节留在 DC 记录中，可由对侧独立消费。
```

```text
[可用性实测] 走适配器自身的 sample() 路径、250ms 节拍、40 轮，两次独立运行：
  OBSERVED=25/40（62.5%）与 OBSERVED=23/40（57.5%）⇒ CPU 读数约 **六成可用**。
  不可用原因归因：几乎全部是 `backwards_per_core_delta`（14/15 与 17/17），**没有一次**是「窗口未增长」。
直接测量根因（`pcf701-counter-refresh-probe.mjs`）：本机 Windows 上，同一个窗口内**逐核** counter 会出现负增量
  （40 个 250ms 窗口中 22 个含负增量，最差 −610）；而同一窗口各核增量的**总和**始终为正。
⇒ 这是平台快照的逐核不同步，不是修复引入的缺陷：修复的保守守卫（任一 delta<0 即判缺口）在此把
  「六成能算」变成「四成报缺口」。
⇒ 判断逻辑（为何仍判 ACCEPTED）：修复的缺陷是**发布伪造数字**，而该缺陷已被彻底修掉；这里是
  **诚实缺口出现得比预期频繁**，方向与任务书核心原则一致（宁可说不知道，不可编数字）。
⇒ 我**不**自行改动聚合规则：放宽守卫会改变正确性语义（可能引入负增量混入聚合），属于产品决策 + 对侧复检范围。
   记录在此，供 Alien 用其自身样本比对（其样本首样 UNKNOWN 后连续三个有限 ratio，若其主机负增量率显著更低，
   则本条是本机环境特性；若同样高，则建议 PCF-702 之前先讨论守卫是否应改为「剔除负增量核后聚合」）。
```

## 6. 我方探针自己的两处错误（记录，不做美化）

```text
E1 首轮 W2 断言「忙等 150ms 后必然出现 ratio」，本机 24 核上计数确实可能不动 ⇒ 一度两条假红。
   → 已改为先**自己测量**计数是否前进，再决定断言；红与修正过程保留在记录里，不做静默调优。
E2 W4 一开始我用「两核相同计数」的夹具，并**手写**期望值 0.6，而注入的增量实际是 90/核（1+0.25+0+1），
   正确值是 5/9=0.5556。我一度把它当成修复的缺陷去追。
   → 结论：**那是我算错了，不是适配器错**；已把期望值改为由注入计数推导，并改用逐核不对称夹具。
   这条与第 4 节 N3 是同一个教训：夹具对称 + 手算期望，会同时制造假红和假绿的盲区。
```

## 7. 本裁决**不**声称的事

```text
· 不合并、不快进：PCF 无 merge_authority，cf07f4a 只作为「已被异机复检接受的修复候选」记录，
  已验收头继续累积在系列分支 pcf/series-mech。
· 不改写作者头 4e97d50 的既有记录，也不抹掉那条假零样本 —— 缺陷与修复都留在记录里。
· 不声称 Windows CPU 读数「稳定可用」：第 5 节的六成可用率是实测，未做任何美化。
· 不把可选适配器缺席（GPU/VRAM、电池、温度）当作本次豁免依据：CPU 是基础项，必须修，已修。
```
