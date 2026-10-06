# Medical / Health District — 医疗健康区

```text
STATUS = PROJECT_FIRST_PARTIAL_IMPLEMENTED
REVIEWED_PROJECTS = Parama-Health + drug-simulator
PENDING_PROJECTS = NONE_FROM_PREVIOUS_HEALTH_COURSEWORK_SET
```

05 owns health-domain interpretation, longitudinal physiological state, health estimation and domain-specific simulation.

## Reviewed buildings

### 01 Integrated Health Hospital / 综合医院
[Open building](./01-综合医院(Integrated-Health-Hospital)-&-综合健康服务平台(Integrated-Health-Service-Platform)/)

**Primary source:** [Parama-Health](https://github.com/zhiheng-zhang-Mera/Parama-Health)  
**State:** `PRE_ALPHA_PARTIAL_IMPLEMENTATION`

This is the longitudinal whole-person health-state platform: observations, personal health context, body/activity/sleep state, energy flow, calibration and reconciliation.

### 02 Pharmacology Simulation Centre / 药理模拟中心
[Open building](./02-药理模拟中心(Pharmacology-Simulation-Centre)-&-机制药理模拟服务(Mechanistic-Pharmacology-Simulation-Service)/)

**Source:** [drug-simulator](https://github.com/zhiheng-zhang-Mera/drug-simulator)  
**State:** `DESIGN_ONLY_EXISTING_PROJECT`

Owns the planned mechanistic PK/PD/DDI simulation boundary.

## Relationship between the two

These are complementary services, not duplicate implementations:

```text
Parama longitudinal state/context
   │
   └─ Health Context Road
          ↓
   Drug Simulator physiological baseline
          ↓
   PK / ADME / DDI / PD / endpoints
          ↓
   exposure + mechanism + AE + uncertainty
          │
          └─ Pharmacology Result Road
                 ↓
        Parama exposure/state context
```

The simulator must never silently turn Parama estimates into clinical truth, and Parama must not interpret simulator output as diagnosis, prescribing or automatic dosing.

## Parama capability decomposition

Target project modules:

- Personal Context / Subject State Gateway;
- Observation Layer;
- Body State & Trend;
- Activity & Exercise;
- Sleep & Recovery;
- Exposure Modifiers;
- Energy Flow & Ledger;
- Baseline/Lab Calibration;
- State Estimator & Reconciliation;
- Context Resolver.

**Current runtime reality:** only the Observation contract + descriptive weight-trend starter are implemented.

## Drug Simulator capability decomposition

- input/canonicalization;
- physiological baseline projection;
- administration/regimen timeline;
- PK/ADME + exposure;
- PK-DDI;
- PD / target / pathway;
- physiological endpoints;
- adverse effects;
- evidence governance;
- uncertainty;
- mono/combination comparison;
- reporting/validation.

**Current runtime reality:** design documents only.


## Roads

- **Device/Data Road:** 08 → Parama normalized Health observations from future/reviewed device providers.
- **Privacy Road:** 04 ↔ 05.
- **Resident Context Road:** 03 ↔ 05 only when explicitly authorized.
- **Health Context Road:** Parama → Drug Simulator physiological baseline projection.
- **Pharmacology Result Road:** Drug Simulator → Parama exposure/effect context.
- **Evidence Road:** domain evidence retains source/provenance/confidence.

## Boundary

- raw device drivers/acquisition stay in 08;
- resident identity/persona stays in 03;
- privacy policy stays in 04;
- generic Research methodology does not automatically own Health-domain models;
- Health estimates/simulations do not become diagnosis/treatment recommendations.

## 中文说明 / Chinese explanation

状态为 `PROJECT_FIRST_PARTIAL_IMPLEMENTED`。已评审 Parama-Health 与 drug-simulator；原健康课程项目集合没有剩余待评审项。05 拥有健康领域解释、长期生理状态、健康估计和领域模拟。

### 已评审建筑与实现事实

1. 综合医院对应上方 01 链接，来源 Parama-Health，状态 `PRE_ALPHA_PARTIAL_IMPLEMENTATION`，目标是长期全人健康状态：观察、个人背景、身体/活动/睡眠、能量流、校准与协调。
2. 药理模拟中心对应上方 02 链接，来源 drug-simulator，状态 `DESIGN_ONLY_EXISTING_PROJECT`，规划机制 PK/PD/DDI 边界。

两者互补，未成为重复实现：Parama 长期状态经健康背景道路投影为模拟器生理基线，模拟 PK/ADME/DDI/PD/终点后返回暴露、机制、不良事件与不确定性，经药理结果道路进入 Parama 背景。模拟器不能把 Parama 估计悄然视为临床事实，Parama 不能把模拟输出视为诊断、处方或自动剂量。

### 能力拆解

Parama 目标包括个人背景/受试者状态网关、观察层、身体趋势、活动运动、睡眠恢复、暴露修饰、能量流账本、基线/实验室校准、状态估计协调及背景解析。**目前只实现 Observation 契约和描述性体重趋势起步功能。**

模拟器规划输入规范化、生理基线、给药方案时间线、PK/ADME/暴露、PK-DDI、PD/靶点/通路、生理终点、不良效应、证据治理、不确定性、单药组合比较和报告验证。**目前仅有设计文档。**

### 道路与边界

08 → Parama 提供未来/已评审设备提供者的标准健康观察；04 ↔ 05 为隐私道路；03 ↔ 05 居民背景仅在明确授权后连接；Parama → 模拟器提供基线，模拟器 → Parama 返回暴露效应，领域证据保留来源、出处和置信度。

原始驱动采集留在 08，居民身份人格留在 03，隐私政策留在 04，通用研究方法不会自动拥有健康模型。健康估计或模拟不能升级为诊断/治疗建议。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 2 |
| 递归 Markdown 文档 / Recursive Markdown documents | 3 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `PROJECT_FIRST_PARTIAL_IMPLEMENTED` |

### 子区导航 / Subarea navigation

| 目录 / Directory | 文档 / Documents | 原记录实现状态 / Recorded implementation status |
|---|---|---|
| [01-综合医院(Integrated-Health-Hospital)-&-综合健康服务平台(Integrated-Health-Service-Platform)](./01-%E7%BB%BC%E5%90%88%E5%8C%BB%E9%99%A2%28Integrated-Health-Hospital%29-%26-%E7%BB%BC%E5%90%88%E5%81%A5%E5%BA%B7%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%28Integrated-Health-Service-Platform%29/README.md) | 1 | `PRE_ALPHA_PARTIAL_IMPLEMENTATION` |
| [02-药理模拟中心(Pharmacology-Simulation-Centre)-&-机制药理模拟服务(Mechanistic-Pharmacology-Simulation-Service)](./02-%E8%8D%AF%E7%90%86%E6%A8%A1%E6%8B%9F%E4%B8%AD%E5%BF%83%28Pharmacology-Simulation-Centre%29-%26-%E6%9C%BA%E5%88%B6%E8%8D%AF%E7%90%86%E6%A8%A1%E6%8B%9F%E6%9C%8D%E5%8A%A1%28Mechanistic-Pharmacology-Simulation-Service%29/README.md) | 1 | `DESIGN_ONLY_EXISTING_PROJECT` |

### 本目录文档 / Documents in this directory

- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
