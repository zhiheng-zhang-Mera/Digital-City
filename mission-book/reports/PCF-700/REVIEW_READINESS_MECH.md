# PCF-700 复检就绪包 / Review readiness packet (作者侧)

本文件把异机复检的**第一步压成一条命令**：作者已经把自己的每一条主张写成可重算的检查，复检方先跑它是为了**把力气花在判断上**，而不是花在重新发现作者量了什么。

```text
STATUS             REVIEW_READINESS_ONLY（本文件不是复检、不释放任何 terminal marker、不构成裁决）
REVIEW TARGET      b8c142277f6425a265e88dcca75a98faf1a47742（分支与 pcf/series-mech 同指该头）
AUTHOR HOST        Mech（COMPUTERNAME MEGA-REP，role Mech-DS）
记录 / RECORD      data-records/{zh-CN,en}/pcf/reuse-wiring-audit.json（机读，中英同字节）
仪器 / INSTRUMENT  utopia:scripts/pcf700-review-packet.mjs（本文件即其输出的基线）
```

## 1. 复检方怎么跑（两条命令，或一条）

```bash
# 一条命令：自行重算并与发布记录逐字段比对
node scripts/pcf700-review-packet.mjs

# 若你的沙箱禁止捕获子进程输出（本工程 Windows 受限模式确实禁止），分开跑：
node scripts/pcf700-reuse-audit.mjs --out /tmp/observed.json
node scripts/pcf700-review-packet.mjs --observed /tmp/observed.json --out /tmp/packet.txt
```

预期输出（本机在 exact `b8c1422` 上实测，逐字）：

```text
PCF-700 review packet (review-readiness recomputation)
published record: data-records/zh-CN/pcf/reuse-wiring-audit.json
observed report: recomputed in place by scripts/pcf700-reuse-audit.mjs

PASS  C1  the published record recomputes field for field (host/node metadata excluded)
        no evidence drift
PASS  C2  exactly four contracts are LIVE_WIRED: execution-backend-v1, node-descriptor-v1, remote-local-discovery-v1, rs-presentation-contract-v1
        observed: execution-backend-v1, node-descriptor-v1, remote-local-discovery-v1, rs-presentation-contract-v1
PASS  C3  no engineering-* or general-ai-* contract has a production referrer
        zero production references, as recorded
PASS  C4  no backend module imports a front-end module
        []
PASS  C5  every /api/v0 literal a user surface names resolves against a gateway route
        unresolved: 0; ui files naming endpoints: 14
PASS  C6  no runtime module refers to the fabric, so this is still an audit
        []
PASS  C7  the candidate PCF directories were not created by this audit
        contracts/personal-compute-fabric-v1 and services/personal-compute-fabric absent
PASS  C8  every single-writer fingerprint (bytes/lines/SHA256) recomputes
        5 files match

8/8 checks pass
This packet recomputes the author's claims; it is not a review and releases no terminal marker.
```

比对**故意排除** `measuredAt`（主机名与 node 版本在复检方机器上本来就该不同）并对所有列表排序：**报告有差异 = 证据有差异，不是机器有差异**。

## 2. 这个包被证伪过（否则它只是好看的输出）

```text
篡改一处单写者 SHA256（766f7b…→deadbeef…）→ C1 与 C8 FAIL，6/8，退出码 1
把一处 tier 从 COMPONENT_TESTED 改成 LIVE_WIRED → C1 FAIL，7/8，退出码 1
临时创建 contracts/personal-compute-fabric-v1/ → C7 FAIL（并因 contractDirectoryCount 变化连带 C1），退出码 1
全部复位后 → 8/8，退出码 0
```

## 3. 这个包**没有**证明什么（复检方仍须自己做）

```text
· TWO_HOST_VERIFIED 与 ORIGIN_AGENT_CONSUMED **两档全空**：本包只重算单机静态证据，跨机样本调用链必须由
  另一实体主机真实执行（EXECUTION_CONTRACT §14）。
· 本包不跑测试套件：C1–C7 是静态与记录层面的重算；7/7 与 4/4 两套测试须由复检方自己运行并自己证伪
  （REVIEW_HANDOFF_Mech.md 的 R2/R3）。
· 本包不判断「这样设计是否正确」，只判断「作者声称的量是否可重算」。
```

## 4. 作者在这个包上的两个仪器错误（记录，不掩盖）

```text
E1  第一版探针在**带 BOM** 的记录文件上崩溃（Windows PowerShell 5.1 的 Set-Content -Encoding UTF8 默认写 BOM），
    而那次崩溃**恰好也返回退出码 1** —— 正确的退出码、错误的原因。修法：读取时剥离 BOM；判定仍由 C1–C8 决定。
E2  用 PowerShell 管道捕获**非零退出**的 node 进程时，它的 stdout 可能被吞掉（我因此一度看不到 FAIL 行）。
    修法：探针支持 --out，证伪证据一律从该文件读取；这也是本文件 §1 给出 --out 用法的原因。
```
