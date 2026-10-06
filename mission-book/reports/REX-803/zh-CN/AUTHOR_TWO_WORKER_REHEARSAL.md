# REX-803 双 worker 拓扑演练（Mech，2026-10-06）

[English source / 英文原文](../AUTHOR_TWO_WORKER_REHEARSAL.md)。阅读译本保留历史快照；原证据代码块逐字保留，current task authority 不变。

```text
AUTHOR              Mech (COMPUTERNAME MEGA-REP), role Mech-DS, development_host for REX-803
RECORDED TARGET     a695bb9fc5fe7c1cc3be8c68b37f0d4ab7de44df — UNCHANGED, and still what PR #31 points at
BRANCH              probe/REX-803-mech-two-worker-rehearsal @ 42acdc6bfacb1e2260364afd2edce041f003638c
                    stacked on repair/REX-803-mech-receipt-order-and-close @ 07e8c3c
WHAT THIS IS        an AUTHOR SELF-TEST, in the form of a rehearsal. Not review evidence, no verdict, no marker.
                    It is NOT the completion gate: the gate needs the Alien host's own node, and two identities on
                    one physical host cannot satisfy it.
```

## 1. 为什么值得写双 worker 演练

所有 campaign fixture 与两个真实常驻 City physical campaign 只声明一个 worker；Android 是 CONTROL SURFACE 不是 worker。因此唯一设备 placement 代码：

```js
const workers = context?.workers ?? [];
const target  = context?.targetDeviceRef ?? (workers.length > 0 ? workers[seed % workers.length] : null);
```

从未有多个 candidate。worker[seed % 1]总是唯一 worker，单 worker 无法区分规则生效与从未执行；这是 coverage gap 不是猜测。programme 反复出现退化 case suite 报告自己 fixture 属性。

## 2. 首次运行发现

```text
red run on 07e8c3c (probes only)      tests 2   pass 0   fail 2
  "6 of 6 campaign task(s) were created with no targetDeviceRef, so the derived-seed placement rule never ran and
   the receipt's assignment is claim order, not the declared rule"
  "run 1 (seed 2220486659) landed on rehearsal-alpha, but the declared rule selects rehearsal-beta"
```

根因一个错误读取，看两行可验证：

```text
server.mjs  campaignContext()  carries the topology under `manifest.workers` and never sets a top-level `workers`
server.mjs  runOnce()          reads `context?.workers ?? []`, so the array is ALWAYS empty
```

target 恒 null，所有 repetition untargeted，receipt assignedNodeId 是第一个 eligible claimant。module 注释称任意 host 同 campaign 同 repetition 同 device，paper index 重复；单 worker 观测一致，故逃过两 physical campaign、33 probes 与一次兄弟工作的 opposite-host review。

此任务迄今最严重 defect 是交付物自身**虚假的可复现性声明**，非 storage edge case。receipt 对发生了什么未错，关于为何该 device 的声明错了。

## 3. 修复

```text
server.mjs   runOnce():  const workers = context?.manifest?.workers ?? context?.workers ?? [];
```

canonical claimAllowedByTarget 已 strict-target 拒绝其他 device；设 target 后 placement 真实而非 advisory。明确后果：repetition 绑定声明 worker，该 worker 中途离开则 WAITS（等待）而不静默 reroute，遵循 no-silent-fallback；campaign timeout 内未回则 TIMEOUT 带 reason。Reviewer 若选择删 dead rule/改 docs，是与代码声明 intent 不同，不是与 measurement 不同，必须回应上述 measurement。

## 4. 测量

```text
NEW PROBES                 2/2 on the repair; 0/2 on 07e8c3c (the red run above)
REX-803's five suites      24/24
FULL SUITE                 1373/1376, the 3 failures being this host's resident-City host reservation
CI (exact head)  V0.2 checks push run 37420563832 COMPLETED SUCCESS (attempt 1) on 42acdc6, jobs android and
                 gateway-web both success; read per-run from the Actions API and matched on headSha
```

依 ci.yml 双 install 执行，无此前 missing-city artifact。fixture 通过扫描 seed 选出 derived run seeds 跨两 worker，并 assert 两 worker 确实用到；F-S6 早期 fixture 侥幸同意 defect，这个 fixture 不能如此。

## 5. 对记录改变与不改变

```text
CORRECTED   reports/REX-803/PAPER_MATERIAL_INDEX.md: the reproducibility entry now carries the correction rather
            than the claim, with a pointer to this file
UNCHANGED   REX-803's head, workbook, review target, claim, terminal marker and PR #31
NOT CLAIMED the completion gate, which still needs alien-reference-node online in the City (last heartbeat
            2026-10-05T11:15:06.977Z, unchanged across every measurement this host has taken)
```

不 harden 理由与 third-class 一致：已有 collision，领取 a695bb9 者不能发现 target 移走。可应请求 hardening；作者对该 finding 建议应该 harden，因为 false reproducibility 比 storage edge case 更不该留 Review target，但记录建议而不单方面执行。
