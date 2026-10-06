# Qualification Control Plane — 资格控制平面 / 可信候选认证服务

```text
STATUS = EXISTING_PRIVATE_QUALIFICATION_CONTROL_PLANE
REPOSITORY = https://github.com/zhiheng-zhang-Mera/Boss-Qualification-Control
SOURCE_SNAPSHOT = 24bf31e7beee5adb0e94e6496a7114769b3b21f4
DOMAIN = GOVERNANCE / QUALIFICATION
```

## Role

Protect real-host qualification from untrusted public-repository workflow changes.

```text
public Codex-Boss exact main SHA
      ↓
private qualification workflow
      ↓ Owner-approved protected environment
self-hosted real-soak runner
      ↓
required qualification chain
      ↓
redacted provenance + attestation + verdict
```

## Rooms / capability clusters

- immutable candidate-SHA resolution and detached checkout;
- runner-registration isolation proof;
- workflow-trigger/input restriction;
- Owner protected-environment approval;
- real corpus snapshot for read-only qualification;
- Root Trust / architecture / migration / capability / lifecycle / targeted qualification chain;
- redacted provenance and commitment digest;
- aggregate qualification record / verdict.

## Boundary

- not a development surface;
- never mirrors Boss source/history as project state;
- does not publish raw corpus, prompts, sessions or credentials;
- does not own Root Authority;
- qualification evidence is not equivalent to City-wide runtime enforcement.

## 中文说明 / Chinese explanation

状态为 `EXISTING_PRIVATE_QUALIFICATION_CONTROL_PLANE`；仓库和固定快照如上，领域为治理/资格。其职责是防止不可信公共仓库工作流改动影响真实主机资格验收。流程为公共 Codex-Boss 精确 main SHA → 私有资格工作流 → Owner 批准的受保护环境 → self-hosted real-soak runner → 必需资格链 → 脱敏来源、认证和裁决。

能力包括不可变候选 SHA 解析与 detached checkout、runner 注册隔离证明、触发/输入限制、Owner 受保护环境审批、只读资格所用真实语料快照、Root Trust/架构/迁移/能力/生命周期/定向资格链、脱敏来源与 commitment digest，以及聚合资格记录和裁决。

它不是开发界面，不把 Boss 源码/历史镜像为自身项目状态，不公开原始语料、提示、会话或凭据，不拥有 Root Authority；资格证据不等同于城市级运行执行。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 0 |
| 递归 Markdown 文档 / Recursive Markdown documents | 1 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `EXISTING_PRIVATE_QUALIFICATION_CONTROL_PLANE` |

### 子区导航 / Subarea navigation

本目录无直接子目录；功能归属和后续计划参见上方说明。 / No direct subdirectories; see the explanations above for capability ownership and future plans.

### 本目录文档 / Documents in this directory

- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
