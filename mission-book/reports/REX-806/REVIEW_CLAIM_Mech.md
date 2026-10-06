# REX-806 复检领取 / Review claim (Mech)

```text
STATUS              REVIEW_CLAIM —— 领取先于任何裁决；本文件不构成裁决、不释放任何 terminal marker
TASK                REX-806 指标分析与研究工件导出 / Metrics analysis + research artifact export
OBJECT UNDER REVIEW 12e3d3bf868575a8e3cda983733a3186cb59da27（对侧 Alien 的修复候选；draft PR #39）
BRANCH              repair/REX-806-alien-members-and-partial-provenance-20261007
BASELINE            e18c5c5（三个已验收 REX 头的并集）
REVIEWER            Mech（COMPUTERNAME MEGA-REP，role Mech-DS）
AUTHOR OF ORIGINAL  3950d478e627aaa615ef69e3ac65c30da37c5ea6 = Mech；该交付已被对侧复检为 **REQUIRES_REPAIR**（未被接受）
REVIEW WORKTREE     D:\utopia-rex806-verify（detached，依赖按 frozen lockfile 两步安装，root/city 均 exit 0）
```

## 1. 本次复核的边界（先写清，避免含糊的自审）/ Independence boundary

```text
候选里有两个来源的提交：
  · Mech 先前的修复：d790a2a（最新 receipt 丢失要命名而不是静默少导出）、4349f3d 等 —— 这些**已由 Alien 复核**
    （其 finding F1/F2 描述的就是 d790a2a 的行为）。
  · Alien 本轮的新修复：5f3658f（下载工件内保留成员身份与来源丢失）、897382c（在工件 API 各面上保留来源丢失与成员拓扑）
    —— **这才是本次复核的对象**。
因此：**我不对自己先前提交的验收下判断**（那部分由 Alien 的 finding 覆盖），本次只复核 Alien 的新提交，
以及它们与既有修复的**集成行为**。三主机不存在，这个「各审对方那一半」的组合是本工程在双实体主机下的唯一合法解法，
所以它被明确写出来而不是被掩盖。任何裁决都会指明对象是哪些提交。
```

## 2. 领取时刻的测量（本机重算，不引用叙述）/ Claim-time measurements

```text
远端 tip        git ls-remote 实测 = 12e3d3bf868575a8e3cda983733a3186cb59da27（与 PR #39 headRefOid 一致）
ancestry        12e3d3b 含 d790a2a ✓、含 main 312b627 ✓、含原始交付 3950d47 ✓（三条 merge-base --is-ancestor 均 exit 0）
exact-head CI   本机用 gh 按 commit 查询：V0.2 checks push 37538019792 **success**、
                V0.2 checks PR 37538063650 **success**、City linkage check PR 37538063656 **success**
                （对侧交接时说 CI 仍在跑、未声称 PASS；现在由我重新测得三项全绿，绑定的都是 12e3d3b）
独立套件        tests/rex806-{cli,artifact,artifact-surface,artifact-verify}.test.mjs = **29 pass / 0 fail**（本机新 worktree）
基线 e18c5c5    三个已验收 REX 头的并集；候选自身声明不引用 README 短 SHA
```

## 3. 我打算独立制造什么（不复用对侧的探针）/ What I will manufacture myself

```text
V1 用**自己的** CLI/界面证伪探针复现 F1–F4（对侧的复现助手只作对照，不当作证据）：
   F1 不可读 receipt → 必须命名该 receipt、保留部分产物、以非零码退出，且**不得**出现 Windows 崩溃码且无产物；
   F2 最新 receipt 缺失 → 必须在产物/清单里命名这次丢失并给出非零退出，不得静默少导出；
   F3 规范成员字段 → 用**真实 City 记录**（成员以 deviceId 为主键）核对导出的 members 是否非空且身份正确；
   F4 部分下载来源丢失 → failures.json / manifest PARTIAL / preview / CSV 四个面都要能看到，不能只在 stderr。
V2 对**运行中的真实 City**（172.31.12.151:4391，Owner 凭据在本机）做一次真实 Owner 研究历史导出，
   并把 canonical 成员与来源丢失标注与 City 记录逐条对照（对侧 MEMBER 会话做不到这一步，这是它指派的跨机部分）。
V3 生成**新的完整产物**并公布逐文件 digest/校验和；历史产物**保留不覆盖**。
V4 回归：REX-803 / REX-805 相关套件一起跑（对侧声称集成 36/36）。
V5 记录我自己探针的错误（本工程惯例：双方各自记录各自仪器的缺陷）。
```

## 4. 领取时刻不声称的东西 / Not claimed at claim time

```text
· 不预先给出任何 PASS 判断；四条 finding 是否真的修好，以 V1–V4 的实测为准。
· 不做产品合并：REX-806 的 `merge_authority` 仍为 false（Owner 的门只对「已验收」开）。
· 不因本次复核就把 REX-807/890 的依赖视为满足；它们的门是 REX-806 的 `status: COMPLETE` + marker 释放。
· 不声称 TWO_HOST 级别的产品能力：本轮验证的是导出链路与真实 City 记录的一致性，不是新的产品面。
```
