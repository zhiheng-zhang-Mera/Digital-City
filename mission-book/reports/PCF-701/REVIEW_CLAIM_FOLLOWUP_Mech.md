# PCF-701 修复候选复检领取 / Review claim for the repair candidate — Mech

```text
STATUS              REVIEW_CLAIM —— 领取先于任何裁决；本文件不构成裁决、不释放任何 marker
TASK                PCF-701 实时资源观测与 freshness（**修复候选**）
OBJECT UNDER REVIEW cf07f4acb3be0fe3e734ed39bf9145348e2d7ba8
                    （分支 repair/PCF-701-alien-windows-cpu-20261007，draft PR41 的当前 tip）
AUTHOR HEAD         4e97d503989beba82124a1b6e3286825f33b92fc（我交付、对侧复检并判定需要修复的头）
REVIEWER            Mech（COMPUTERNAME MEGA-REP，role Mech-DS）—— 对 Alien 的修复提交而言是合法对侧
WORKTREE            D:\utopia-pcf701-followup（detached @ cf07f4a，依赖两步 frozen lockfile）
```

## 1. 领取时刻的测量

```text
远端 tip = cf07f4a（git ls-remote 与 PR41 headRefOid 一致）
ancestry：`git merge-base --is-ancestor 4e97d50 cf07f4a` exit 0 ⇒ 修复**基于不可变的作者头**，没有夹带无关提交
改动面（相对作者头）：services/personal-compute-fabric/adapters.mjs（+25/-3）与 tests/pcf701-alien-review.test.mjs（新增 32 行）
exact-head CI（按 commit 查）：V0.2 push 37551887749 success、V0.2 PR 37551894210 success、linkage 37551894202 success
```

## 2. 这条缺陷是我的（先把责任写清）

```text
对侧在真实 Windows 采样里发现：我的参考适配器用 `os.loadavg()` 作 CPU 来源，而 Windows 上该值是固定 `[0,0,0]`，
**不是测量** ⇒ 我把一个伪造的 0 发布为 `presence: OBSERVED`。这违反我在这本书里写下的第一条规则
（「绝不凭空造数」），而且方向与我测试过的相反：我一直在防「把缺失填 0」，却没防「把读不到的 0 当读数」。
我的守卫 T16 只检查 `cpu.value ∈ [0,1]`，**0 也能通过** —— 守卫太弱，这是我自己的缺陷，不是复检方的问题。
```

## 3. 我要独立制造什么（不复用对侧的探针）

```text
V1 自己的套件运行：pcf701 两套件（含对侧新增的 `tests/pcf701-alien-review.test.mjs`）+ PCF 三套 + 双语门。
V2 **真实 Windows 采样**（本机就是 Windows）：第一次调用必须**不给 CPU**（warmup）或给出有限 ratio；
   间隔后再取必须有有限 ratio；并且**来源必须是 `node-system:cpu-time`**，证明它不是 loadavg 那条路。
V3 自建桩复现四个反例语义：warmup（无前值）不给值；真实计数区间算出 (total-idle)/total；
   reset（计数回退）不给值；缺计数或计数不增长不给值；三种情况都要有原因而不是 0。
V4 用**我自己的突变**验证对侧守卫：把 win32 分支改回无条件 `os.loadavg()`（即原缺陷）应使其测试变红；
   并在本 worktree 重跑我的 `pcf701-falsify-guards.py`（13 处突变）确认守卫仍然各自成立且按字节还原。
V5 记录我方仪器错误。
```

## 4. 领取时刻不声称的东西

```text
· 不预先给出 PASS；以 V1–V4 的实测为准。
· **不做产品合并**：PCF 系列从未获得合并权（Owner 的门口径只对 REX 开），因此即便本次接受，
  被接受的修复头也只**累计**在系列分支上，合并仍归 Owner 裁决。
· 不改写对侧对 4e97d50 的 REQUIRES_REPAIR 结论与它的记录；本次只新增「修复已被异机复检」的记录。
· 不改 REX-807 的在制记录（本轮不碰）。
```
