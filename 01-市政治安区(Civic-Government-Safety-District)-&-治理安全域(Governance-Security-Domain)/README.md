# 市政治安区 Civic Government & Safety District — Governance & Security Domain

```text
STATUS = PROJECT_FIRST_REVIEWED_PARTIAL
EXISTING_BUILDING = 03 Qualification Control Plane
LOGICAL_GATES = 01 Customs + 02 Runtime Compliance
```

01 owns qualification/admission/runtime hard-boundary governance.

## 03 Qualification Control Plane

The private Boss-Qualification-Control repository remains a real independent qualification/attestation building.

## 01 Customs / ADMIT

Customs is a **logical admission gate first**, not a mandatory standalone service.

Boss authority/permission semantics plus Hns plugin/install/compatibility mechanics already define its future behavior target. Keep those checks in their current owners until multiple independent consumers justify extraction.

## 02 Runtime Compliance / ENFORCE

Runtime Compliance is likewise a **logical enforcement gate first**. Boss-derived enforcement may remain internal until a separate lifecycle/failure domain provides real value.

## Product-priority rule

Neither Customs nor Runtime Compliance extraction blocks the Utopia personal-terminal fast path.

```text
00 Core = authority facts
01 = qualification/admission/enforcement decisions using those facts
```

## 中文说明 / Chinese explanation

状态为 `PROJECT_FIRST_REVIEWED_PARTIAL`；现有建筑是 03 资格控制平面，01 海关准入与 02 运行合规是逻辑门禁。此区负责资格、准入及运行时硬边界治理。私有 Boss-Qualification-Control 仍是独立且真实的资格/认证建筑。

海关首先是逻辑准入门禁，不要求独立服务。Boss 权威/权限语义加 Hns 插件安装兼容机制定义未来目标；在多个独立消费者确有拆分需要前，检查保留在当前所有者内。运行合规同样先作为逻辑执行门禁；Boss 衍生执行逻辑可以保持内部，直到独立生命周期/故障域带来真实收益。

两种拆分都不阻塞 Utopia 个人终端快速路径。00 核心拥有权威事实，01 使用这些事实做资格、准入和执行决定。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 3 |
| 递归 Markdown 文档 / Recursive Markdown documents | 4 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `PROJECT_FIRST_REVIEWED_PARTIAL` |

### 子区导航 / Subarea navigation

| 目录 / Directory | 文档 / Documents | 原记录实现状态 / Recorded implementation status |
|---|---|---|
| [01-海关安检(Customs-Security)-&-扩展准入检查(Extension-Admission-Checks)](./01-%E6%B5%B7%E5%85%B3%E5%AE%89%E6%A3%80%28Customs-Security%29-%26-%E6%89%A9%E5%B1%95%E5%87%86%E5%85%A5%E6%A3%80%E6%9F%A5%28Extension-Admission-Checks%29/README.md) | 1 | `PROJECT_NOT_CREATED` |
| [02-公安监管(Public-Security)-&-运行时合规执行(Runtime-Compliance-Enforcement)](./02-%E5%85%AC%E5%AE%89%E7%9B%91%E7%AE%A1%28Public-Security%29-%26-%E8%BF%90%E8%A1%8C%E6%97%B6%E5%90%88%E8%A7%84%E6%89%A7%E8%A1%8C%28Runtime-Compliance-Enforcement%29/README.md) | 1 | `PROJECT_NOT_CREATED` |
| [03-资格控制平面(Qualification-Control-Plane)-&-可信候选认证服务(Trusted-Candidate-Attestation-Service)](./03-%E8%B5%84%E6%A0%BC%E6%8E%A7%E5%88%B6%E5%B9%B3%E9%9D%A2%28Qualification-Control-Plane%29-%26-%E5%8F%AF%E4%BF%A1%E5%80%99%E9%80%89%E8%AE%A4%E8%AF%81%E6%9C%8D%E5%8A%A1%28Trusted-Candidate-Attestation-Service%29/README.md) | 1 | `EXISTING_PRIVATE_QUALIFICATION_CONTROL_PLANE` |

### 本目录文档 / Documents in this directory

- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
