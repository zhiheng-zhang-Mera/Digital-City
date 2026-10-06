# Integrated Health Hospital — 综合医院

```text
STATUS = PRE_ALPHA_PARTIAL_IMPLEMENTATION
PRIMARY_REPOSITORY = https://github.com/zhiheng-zhang-Mera/Parama-Health
SOURCE_SNAPSHOT = e4b545b12d094032a72dab9fb72ec29e85861a8f
DOMAIN = HEALTH
```

## Role

The Integrated Health Hospital is now backed by a real source project: **Parama-Health**.

Its long-term job is to maintain a time-aware, uncertainty-aware picture of personal physiological state from sparse consumer-grade observations and periodic calibration.

## Project rooms / capability clusters

1. **Personal Context** — time-consistent `PersonalContextSnapshot`.
2. **Observation Layer** — raw observations with source/time/confidence.
3. **Body State** — slow body-state and trend estimates.
4. **Activity Engine** — activity/exercise estimation.
5. **Sleep & Recovery** — recovery context and reliability modifiers.
6. **Exposure Modifiers** — medication/supplement/environment context at the whole-person level.
7. **Energy Flow & Ledger** — intake/absorption/loss/expenditure/storage decomposition.
8. **Baseline Calibration** — labs/DXA/high-information periodic patches.
9. **State Estimator & Reconciliation** — multi-source reconciliation and personalization.
10. **Context Resolver** — version-consistent context for downstream calculations.

## Honest implementation boundary

At snapshot `e4b545b12d094032a72dab9fb72ec29e85861a8f`, runtime code currently implements only:

- immutable Observation with kind/value/time/source/confidence;
- timezone/source/confidence validation;
- weight / resting-HR / sleep observation vocabulary;
- descriptive weight-trend estimate;
- fail-closed insufficient-data and invalid-time behavior;
- explicit `OBSERVATION_ONLY` result status.

The ten-module architecture is **not yet implemented** merely because module documentation exists.

## External boundaries

- Wearable/smart-scale/camera/device acquisition → **08 Device & Edge**.
- Health privacy/consent/retention policy → **04 Legal & Privacy**.
- Digital resident identity/persona → **03 Residential**.
- Detailed mechanistic drug PK/PD/DDI → **05/02 Pharmacology Simulation Centre**.

## Pharmacology integration

Parama may project a minimal, time-consistent physiological baseline to the Drug Simulator and consume returned exposure/mechanism/endpoint/uncertainty data as one health-context input.

It must not convert simulator output into automatic diagnosis, prescription or dosing.

## 中文说明 / Chinese explanation

状态为 `PRE_ALPHA_PARTIAL_IMPLEMENTATION`，真实来源项目是 Parama-Health，固定快照和仓库如上。长期目标是在稀疏消费级观察和周期校准基础上，维持带时间和不确定性的个人生理状态。

十个目标能力簇为：时间一致的 `PersonalContextSnapshot`；保留来源时间置信度的观察；慢变身体状态趋势；活动运动估计；睡眠恢复可靠性；药物补充剂环境暴露背景；摄入吸收损失消耗存储的能量账本；实验室/DXA 等高信息校准；多来源协调个性化状态估计；下游版本一致背景解析。

上述快照实际只实现带 kind/value/time/source/confidence 的不可变 Observation、时区来源置信度验证、体重/静息心率/睡眠词汇、描述性体重趋势、不足数据和无效时间的保守失败行为、明确 `OBSERVATION_ONLY` 状态。模块文档不代表十模块架构已实现。

穿戴/体重秤/摄像头采集归 08；隐私同意保留政策归 04；数字居民身份人格归 03；细粒度机制 PK/PD/DDI 归 05/02。Parama 可向模拟器投影最小时间一致生理基线，把返回暴露机制终点不确定性作为健康背景输入；不能转成自动诊断、处方或剂量。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 0 |
| 递归 Markdown 文档 / Recursive Markdown documents | 1 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `PRE_ALPHA_PARTIAL_IMPLEMENTATION` |

### 子区导航 / Subarea navigation

本目录无直接子目录；功能归属和后续计划参见上方说明。 / No direct subdirectories; see the explanations above for capability ownership and future plans.

### 本目录文档 / Documents in this directory

- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
