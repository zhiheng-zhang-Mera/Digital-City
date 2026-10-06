# 能力暴露矩阵（中文）

> 状态：**终审视图**——由 CEX-790 依 `records/*.yaml` 在基线 `5c7d46dcbf1b01259b5edaf574b620714beb40b7` 上生成。
>
> MON条目增量对齐MON-990提交fb042d9b1c7026cb2e6a010e2a7ad38a82a5cb40；不替代历史全城审计基线。
> 本表是人工审查视图，不是机器权威源。结构化权威状态在 `CAPABILITY_INDEX.yaml` 与 `records/*.yaml`。

## 当前迁移状态

历史能力入口数据原位于 `mission-book/finished/completed-2026-10-06/capability-entry-closeout/CAPABILITY_ENTRY_MATRIX.md`。CEX programme 已将其
回填为长期 Registry；CEX-790 执行终审：从代码重建入口 inventory、与这些记录做 diff，并解决发现的两处不一致。
旧矩阵不再是权威来源。

## 矩阵

| Capability ID | Capability | Implementation | Backend wiring | User reachable | Intent valid | Exposure class | Web | Android | Other | Last verified SHA | Gap |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `CAP-ASK-001` | 主动发现能力目录 | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | DIRECT_CONTROL | yes | yes | — | `478d48609651` | All16 native cards and mutating confirmation NOT_RUN; the Compose catalog was not rendered |
| `CAP-CAPABILITY-BRIDGE-001` | 能力目录与调用入口 | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | DIRECT_CONTROL | yes | yes | — | `5c7d46dcbf1b` | No end-to-end intent validation was performed by this backfill; the surfaces were inventor |
| `CAP-CITY-MEMBERS-NATIVE-001` | Android 城市与成员管理 | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | DIRECT_CONTROL | no | yes | — | `de9185a4ef8d` | F1 MEDIUM recorded and left unrepaired: the shared member projection can report a device a |
| `CAP-EXECUTION-001` | 标准设备执行后端兼容接口 | COMPLETE | VERIFIED | NOT_APPLICABLE | VERIFIED | INTERNAL_ONLY | no | no | — | `f66db6099834` | none recorded |
| `CAP-EXPERIMENT-MANIFEST-001` | 实验清单登记与验证 | COMPLETE | VERIFIED | VERIFIED | VERIFIED | DIRECT_CONTROL | yes | no | — | `7e96a4d28f4c` | Android Research surface NOT_RUN; REX807 further control surface |
| `CAP-HOST-LIFECYCLE-001` | 主机启动模式、随页面存续的城市生命周期与已存储角色 | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | BACKGROUND_DISCLOSED | yes | no | 启动器 | `a8bce279e114` | 启动时会说明模式，但此后没有任何 Web/Android 界面显示当前城市属于哪种；角色被忽略也只体现在启动器那一行 |
| `CAP-IDENTITY-001` | 设备身份恢复与冲突提示 | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | DIRECT_CONTROL | yes | yes | — | `a24c04401308` | Android connected recovery NOT_RUN; only offline guidance was observed, and the Compose su |
| `CAP-MON-001` | 全城旁路观察基础 | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | BACKGROUND_DISCLOSED | yes | yes | API | `fb042d9b1c70` | Owner/review/CI/escalation absent-source NOT_OBSERVABLE |
| `CAP-MON-002` | 全城工作监控图与节点/路径检查器 | COMPLETE | VERIFIED | VERIFIED | NOT_TESTED | OBSERVABLE_ADVANCED | yes | yes | — | `fb042d9b1c70` | 受控物理手机与Web已观测；对机收口待完成，普通用户意图NOT_TESTED |
| `CAP-MON-003` | 决定建议来源 | COMPLETE | VERIFIED | VERIFIED | NOT_TESTED | OBSERVABLE_ADVANCED | yes | yes | — | `fb042d9b1c70` | 受控物理手机与Web已观测；对机收口待完成，普通用户意图NOT_TESTED |
| `CAP-NODE-DESCRIPTOR-001` | 节点角色能力资源描述契约 | COMPLETE | VERIFIED | NOT_APPLICABLE | VERIFIED | INTERNAL_ONLY | no | no | — | `d99101fdac51` | none recorded |
| `CAP-ONBOARDING-OWNER-001` | Android 城市邀请与入网审批 | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | DIRECT_CONTROL | no | yes | — | `d05f5a455ff5` | System share physical test CLOSED BY REVIEW: the chooser opens normally on OPPO PERM00, so |
| `CAP-RESEARCH-TRACE-001` | 研究记录与来源观察 | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | OBSERVABLE_ADVANCED | yes | yes | — | `833279cae237` | Android online rendering NOT_RUN; the Compose surface was not rendered on a device or emul |
| `CAP-SCHEDULER-CHOICE-001` | 保留服务并换设备执行 | COMPLETE | VERIFIED | PARTIAL | NOT_TESTED | DIRECT_CONTROL | yes | yes | — | `3d233ff39d1e` | Android online interaction NOT_RUN; the Compose surface was not rendered on a device or em |
| `CAP-WORKER-POOL-AGENT-001` | 默认关闭 Worker Pool 与节点代理接口 | COMPLETE | VERIFIED | NOT_APPLICABLE | NOT_TESTED | INTERNAL_ONLY | no | no | — | `f3510862cc34` | Real Workbench and Linux/macOS physical tests NOT_RUN |

## Review 重点

- `COMPLETE + MISSING`：代码完成但用户找不到；
- `VERIFIED wiring + MISMATCH intent`：链路通了但语义不对；
- 某平台 VERIFIED、同级平台 MISSING 的 parity gap；
- Registry 写有入口但实际找不到的 reality mismatch；
- 长期没有 exact SHA/evidence 刷新的 stale record。

## 本视图承载的未结项

- `CAP-MON-002`：MON-990原生/Web受控验收已观测；对机冻结与普通用户意图验证仍待完成。
- `CAP-ASK-001`：All16 native cards and mutating confirmation NOT_RUN; the Compose catalog was not rendered on a device or emulator by the review, and the author receipt records the online catalog as NOT_RUN
- `CAP-CAPABILITY-BRIDGE-001`：No end-to-end intent validation was performed by this backfill; the surfaces were inventoried, not exercised
- `CAP-CITY-MEMBERS-NATIVE-001`：F1 MEDIUM recorded and left unrepaired: the shared member projection can report a device as connected while its own node record says offline, because members.mjs seeds the primary row with online true and can never correct it. members.mjs is NOT in the CEX-705 diff, so this is a pre-existing defect the new Android surface exposes rather than a regression. F2 LOW (the sharing success notice is unconditional and could mask a 404), F3 INFORMATIONAL (the owner own sharing control depends on the City hostDeviceId matching its node id) and F5/F6 INFORMATIONAL (the development receipt physical_not_run list is stale against PHYSICAL_FOLLOWUP.json, and the mandatory parity-gap count and message latency were left null and supplied by the review) are also recorded
- `CAP-CITY-MEMBERS-NATIVE-001`：User-appointed primary-agent migration not implemented
- `CAP-EXPERIMENT-MANIFEST-001`：Android Research surface NOT_RUN; REX807 further control surface
- `CAP-HOST-LIFECYCLE-001`：没有任何 Web/Android 界面显示当前城市属于哪种启动模式，因此"随页面存续"只在启动时被说明、之后不可观察；intent validation 为 NOT_TESTED，因为没有跑过真实用户会话来确认这段话被理解
- `CAP-IDENTITY-001`：Android connected recovery NOT_RUN; only offline guidance was observed, and the Compose surface was not rendered on a device by the review
- `CAP-MON-001`：Owner/review/CI/escalation absent-source NOT_OBSERVABLE
- `CAP-ONBOARDING-OWNER-001`：System share physical test CLOSED BY REVIEW: the chooser opens normally on OPPO PERM00, so the earlier NOT_RUN_AUTO_APPROVAL_REJECTED is superseded
- `CAP-ONBOARDING-OWNER-001`：Optical QR scan and a second PHYSICAL device consume remain NOT_RUN; the review consumer was the host, not a second handset
- `CAP-ONBOARDING-OWNER-001`：Earlier full physical campaign APK SHA NOT_OBSERVABLE; a build of the reviewed source matched the byte count but not the SHA-256, so the build is not hermetic
- `CAP-RESEARCH-TRACE-001`：Android online rendering NOT_RUN; the Compose surface was not rendered on a device or emulator by the review
- `CAP-RESEARCH-TRACE-001`：Experiment execution binding and autonomy measurements NOT_OBSERVABLE
- `CAP-SCHEDULER-CHOICE-001`：Android online interaction NOT_RUN; the Compose surface was not rendered on a device or emulator by the review, and online_click and physical_devices_campaign remain NOT_RUN in the development receipt
- `CAP-SCHEDULER-CHOICE-001`：Opposite physical-host Formal Review PASSED on 3d233ff39d1e96b8a590b12f520f98c283356f25 (Mech, MEGA-REP); findings F1 LOW (the mandatory handoff latency was recorded as NOT_OBSERVABLE although the author's own fixture could measure it; the review measured it instead - 13 ms click to handoff, 598 ms click to result, 4 ms canonical decline to handoff on one physical host), F2 INFORMATIONAL (a presentation.mjs comment still argues that this City keeps no per-node disable state, directly above the line that now reads sharingEnabled), F3 INFORMATIONAL (Web and Android fall back differently when a service ref does not resolve) and F4 INFORMATIONAL (the Android in-flight guard can latch if the client closes mid-request) recorded; none is repaired here
- `CAP-WORKER-POOL-AGENT-001`：Real Workbench and Linux/macOS physical tests NOT_RUN
- `CAP-WORKER-POOL-AGENT-001`：Product Worker Pool profile activation deferred
- `CAP-WORKER-POOL-AGENT-001`：Checkpoint execution continuation/GPU-specific canonical telemetry/primary-agent migration not implemented
