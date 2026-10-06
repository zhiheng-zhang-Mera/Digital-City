# 居民区 Residential District — 数字身份代理域 Digital Identity / Agent Domain

```text
REVIEW_METHOD = PROJECT_FIRST_DECOMPOSITION
SOURCE_PROJECT = zhiheng-zhang-Mera/Digital-Me
PROJECT_REVIEW = RECORDED_2026_09_29
```

## Why Digital-Me exists

Digital-Me was originally planned as a **“second me”** that could represent the Owner in an online interview or meeting while remaining bounded by what the Owner actually knows, has done, and is entitled to claim.

The original design was broader than a single chatbot or avatar. It combined:

- identity and Owner profile;
- knowledge/evidence grounding from public GitHub and authorized private repositories;
- real capability boundaries and honest refusal;
- Owner language habits, wording and multilingual consistency;
- voice, cadence and pauses;
- facial/non-verbal behaviour and habitual movement;
- realtime speech/video interaction;
- avatar / virtual-camera / meeting delivery;
- first-run calibration and capability review;
- later Personal Academy / Learn-Practice-Verify capability assessment;
- future embodied context from cameras, wearables and environment sensors.

The current repository expresses that plan as an **Evidence-Constrained Personal Digital Twin**. Its later truthfulness architecture did not replace the original goal; it made the “second me” boundary mechanically enforceable.

## Project-first decomposition

The City mapping follows the project rather than forcing the whole repository into one building.

| Original Digital-Me function cluster | Current repository surfaces | City placement | Ownership interpretation |
|---|---|---|---|
| Owner identity / profile / semantic self | `identity`, `profile-runtime`, contracts | **03 Residential → Digital Resident Core** | Resident-owned core |
| Personal evidence and autobiographical truth boundary | `evidence`, `capability-graph`, `claim-guard` | **03 Residential → Personal Evidence & Claim Boundary** | Resident-specific evidence remains with the resident |
| Knowledge/project grounding from GitHub | `github-source`, repository analyzers/providers | **09 Planning & Knowledge → Knowledge/Evidence Intake contribution** | Generic source/retrieval capability; Digital-Me consumes it for personal evidence |
| Real capability learning / Personal Academy / Owner review | calibration, question bank, claim review, real-capability assessment branches | **03 Residential → Capability Self-Model & Calibration** | Measures “what this resident may truthfully claim”; not generic Research by default |
| Persona / wording / multilingual identity | `persona`, `language-router` | **03 Residential → Persona & Language Identity** | Resident-specific expression model |
| Pauses / pace / conversational timing | `timing` | **03 Residential → Interaction Timing** | Personal behaviour semantics stay with resident |
| Non-verbal habits / state-conditioned behaviour | `behavior` | **03 Residential → Behaviour Model** | Personal behaviour model; rendering/capture may live elsewhere |
| Dialogue planning, interruption and Owner takeover | `dialogue`, `session-runtime`, realtime runtime | **03 Residential → Resident Interaction Runtime** | Resident-local runtime semantics |
| Voice synthesis / voice-cloning provider adapters | `voice`, CosyVoice / generic TTS adapters | **11 Entertainment → Voice Presentation contribution** | 03 decides what/how the resident intends to say; 11 produces media output |
| Avatar / lip-sync / virtual audiovisual presentation | `avatar`, LiveTalking adapter, virtual-device abstraction | **11 Entertainment → Avatar / Presentation contribution** | Presentation/rendering service, not resident truth authority |
| Microphone/camera/raw embodied acquisition | perception/provider abstractions; future camera/MediaPipe/wearables | **08 Device & Edge → Sensor / Embodied Input contribution** | Device-facing acquisition belongs at the edge; 03 consumes scoped observations |
| Mock interview / future meeting participation | `apps/mock-interview`, future meeting runtime | **03 Resident application + 11 presentation + external meeting adapter** | A composition/bridge, not a new city-wide authority |
| Audit / readiness / operator control | `audit`, readiness, operator console | **03 local operational module**, with Roads to city audit/control/privacy where needed | Do not prematurely extract a generic service from one resident implementation |
| Embodied-intelligence extension | signed presence/context, attention/activity/environment contracts | **08 input → 03 semantic resident → 11 presentation**, with city orchestration outside the resident | Future cross-district composition, not evidence of implemented embodiment |

## What stays conceptually inside Residential

The stable 03-owned semantic core is:

```text
Digital Resident
├── Owner Identity / Profile
├── Personal Evidence Boundary
├── Capability Self-Model
├── Claim Guard / Reasoning Boundary
├── Persona & Language Identity
├── Interaction Timing
├── Behaviour Model
├── Calibration / Personal Academy
└── Resident Interaction Runtime / Owner Takeover
```

These capabilities answer questions such as:

- Who is this resident representing?
- What personal facts and work can it claim?
- How strong may each claim be?
- What does the Owner genuinely know or know how to do?
- How does this Owner usually phrase, pace and behave?
- When must the system decline, correct itself, or hand control back to the Owner?

## What Digital-Me contributes outside 03

Digital-Me already contains bounded implementations/adapters that belong architecturally elsewhere:

### 09 Planning & Knowledge

- GitHub evidence source/provider;
- repository/project evidence retrieval;
- generic source provenance and snapshot access.

The **resident-specific evidence graph and claim boundary do not move with them**.

### 11 Entertainment

- TTS / voice provider adapters;
- avatar rendering adapters;
- lip-sync and audiovisual presentation;
- virtual camera/audio publication;
- future meeting-facing media surfaces.

03 supplies verified resident semantics; 11 renders/publishes them.

### 08 Device & Edge

- microphone/camera acquisition;
- low-level sensor/perception providers;
- MediaPipe or equivalent physical observation adapters;
- future wearable/embodied-context inputs.

08 should expose scoped observations rather than turning raw biometrics into resident authority.

## Roads created by the actual Digital-Me decomposition

Only roads required by the existing project are recorded:

- **Knowledge / Evidence Road:** 09 → 03 — repository/world evidence into resident-specific reasoning.
- **Capability Road:** 03 ↔ City capability fabric — what the resident can expose or consume.
- **Embodied Input Road:** 08 → 03 — scoped sensory/context observations.
- **Presentation Road:** 03 → 11 — verified semantic output plus presentation intent.
- **Privacy Road:** 04 ↔ 03 — rules for personal/biometric/profile data; current enforcement may remain local until a shared service exists.
- **Control Road:** City control surface ↔ 03 — readiness, Owner takeover and resident-local controls.

## Important boundaries

1. **Digital-Me is not the City Core.** It has no independent Owner sovereignty.
2. **Repository location is not permanent city ownership.** Cross-district modules may remain physically inside Digital-Me until extraction has a real engineering benefit.
3. **Generic providers do not get to widen personal truth.** TTS, avatar, LLM, ASR and presentation layers only receive/return bounded data.
4. **Personal Academy is resident calibration first.** It should not be moved into Research merely because it contains tests/learning.
5. **Meeting/interview participation is a composition of existing modules**, not a reason to invent a separate empty “Interview District”.
6. **Owner calibration remains a real boundary.** Synthetic/mock voice/video/persona evidence cannot be promoted into a claim of real Owner similarity.

## Current project status

Current Digital-Me implementation is foundation-complete enough to demonstrate the architecture, but real Owner voice/video/persona calibration and real end-to-end meeting execution remain separate acceptance items.

The City mapping therefore records **implemented capability provenance plus future ownership boundaries**, not a claim that every original product goal is already complete.

## 中文说明 / Chinese explanation

### Digital-Me 的初衷

Digital-Me 是能在在线面试或会议中代表 Owner 的“第二个我”，其陈述必须受 Owner 实际知识、经历和可主张范围约束。原设计不仅是聊天机器人或 avatar，还包括身份画像、公开 GitHub 与获授权私有仓库的证据、真实能力边界与诚实拒绝、措辞习惯和多语言一致性、语音节奏停顿、面部非语言行为与动作、实时语音视频、虚拟摄像头及会议输出、初始校准与能力评审、Personal Academy / Learn-Practice-Verify，以及未来摄像头穿戴环境传感的具身背景。

当前项目称为“证据约束的个人数字孪生”。后续真实性架构保留初衷，并使代表边界可机械执行。

### 按项目拆解及归属

| 原功能 | 仓库模块 | 城市归属与解释 |
|---|---|---|
| Owner 身份、画像、语义自我 | `identity`、`profile-runtime`、contracts | 03 数字居民核心，由居民拥有 |
| 个人证据与自传事实边界 | `evidence`、`capability-graph`、`claim-guard` | 03 个人证据/陈述边界，个人图谱留在居民内 |
| GitHub 知识与项目证据 | `github-source`、仓库分析/提供者 | 09 通用摄取/检索，03 消费个人证据 |
| 实际能力学习与 Owner 评审 | 校准、题库、陈述评审、能力评估分支 | 03 能力自模型/校准，衡量居民可真实主张什么，不默认属于研究 |
| 人格措辞与多语言身份 | `persona`、`language-router` | 03 居民表达模型 |
| 停顿节奏和会话时序 | `timing` | 03 个人行为语义 |
| 非语言习惯与按状态改变的行为 | `behavior` | 03 行为模型，捕获和渲染可在别区 |
| 对话规划、中断、Owner 接管 | `dialogue`、`session-runtime`、实时运行时 | 03 居民局部运行语义 |
| 语音合成/克隆适配 | `voice`、CosyVoice、通用 TTS | 11 语音展示；03 决定内容和表达意图 |
| avatar、口型与虚拟视听 | `avatar`、LiveTalking、虚拟设备抽象 | 11 展示渲染，不拥有居民真实性 |
| 麦克风、摄像头、原始具身采集 | 感知/提供者、未来 MediaPipe/穿戴设备 | 08 采集；03 消费有边界观察 |
| 模拟面试/未来会议参与 | `apps/mock-interview`、未来会议运行 | 03 应用 + 11 展示 + 外部会议适配，属于组合桥接 |
| 审计、就绪与操作员控制 | `audit`、readiness、operator console | 03 局部运营，必要时连接城市审计控制隐私道路 |
| 具身智能扩展 | 签名 presence/context、注意活动环境契约 | 08 输入 → 03 语义 → 11 展示；城市编排在居民之外，属于未来组合 |

### 03 保留的语义核心

Owner 身份画像、个人证据边界、能力自模型、Claim Guard/推理边界、人格语言身份、交互时序、行为模型、校准/Personal Academy、居民交互运行/Owner 接管都属于 03。这些模块回答：代表谁、哪些个人事实和工作可主张、陈述强度、Owner 真正知道/会做什么、通常如何表达停顿行为，以及何时拒绝、纠正或交还控制。

### 跨区贡献

09 接收 GitHub 来源、仓库项目证据检索、通用来源与快照访问；个人图谱和陈述边界不随之迁移。11 接收 TTS/语音适配、avatar 渲染、口型视听、虚拟摄像头音频发布及未来会议媒体；03 提供已验证语义，由 11 渲染发布。08 接收麦克风摄像头、低层传感感知、MediaPipe 等物理观察及未来穿戴/具身输入，输出有边界观察，不能把原始生物数据变成居民权威。

### 实际拆解所需道路

- 知识/证据道路：09 → 03，仓库/世界证据进入个人推理。
- 能力道路：03 ↔ 城市能力网，居民可暴露或消费的能力。
- 具身输入道路：08 → 03，范围受限感知/背景观察。
- 展示道路：03 → 11，已验证语义和展示意图。
- 隐私道路：04 ↔ 03，个人/生物/画像规则；共享服务出现前可在本地执行。
- 控制道路：城市控制界面 ↔ 03，就绪、Owner 接管及居民局部控制。

### 边界及当前状态

Digital-Me 不是城市核心，没有独立 Owner 主权；物理仓库位置不是永久城市归属，有实际工程收益前无需拆分。TTS、avatar、LLM、ASR 等通用提供者只能处理受限数据，不能扩大个人事实。Personal Academy 首先校准居民，不因学习测试而迁入研究。会议面试是已有模块组合，不需新建空“面试区”。合成/模拟语音视频人格证据不能升级为真实 Owner 相似性。

现有基础实现足以演示架构，但真实 Owner 语音/视频/人格校准和真实端到端会议仍是独立验收项。映射记录已实现能力来源与未来归属边界，不表示所有原产品目标均已完成。项目评审时间仍为原记录 `RECORDED_2026_09_29`。

## 快速信息仪表盘与导航 / Quick dashboard and navigation

实测范围：当前文档目录树，2026-10-06；实现状态引用原文已有记录，不是本次运行验收。 / Measurement: this documentation tree on 2026-10-06; implementation status quotes existing records, rather than a new runtime acceptance result.

| 项目 / Item | 信息 / Information |
|---|---|
| 直接子目录 / Direct subdirectories | 0 |
| 递归 Markdown 文档 / Recursive Markdown documents | 1 |
| 文档覆盖 / Documentation coverage | 中文与英文说明已保存在同一文档 / Chinese and English explanations in the same document |
| 原记录状态 / Recorded status | `PROJECT_REVIEW_RECORDED_2026_09_29 (implementation acceptance incomplete / 实现验收未完)` |

### 子区导航 / Subarea navigation

本目录无直接子目录；功能归属和后续计划参见上方说明。 / No direct subdirectories; see the explanations above for capability ownership and future plans.

### 本目录文档 / Documents in this directory

- [README.md](./README.md) — 中文与英文说明 / Chinese and English explanations.
