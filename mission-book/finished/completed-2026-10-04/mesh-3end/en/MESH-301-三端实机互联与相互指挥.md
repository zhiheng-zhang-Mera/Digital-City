> 中文阅读译本 / Reading translation。此文件没有工作书元数据，也不赋予 authority。以下规则与状态属于历史归档；[canonical source](../MESH-301-三端实机互联与相互指挥.md) 的原始 frontmatter 是唯一元数据来源。

# MESH-301 — Three-end physical interconnection and mutual command (Mech + Alien + physical Android)

> [Persistent rules](../../../../CONSTRUCTION_RULES.md) · [Async relief](../../../../ASYNC_RELIEF_CONSTRUCTION.md) · [Process data](../../../../PROCESS_DATA_POLICY.md). README is only monitoring, not rules/claim lock.
>
> Owner authorized Alien to draft this workbook (§12 reserves creation to Owner). Owner activated it on 2026-10-03 with execution_enabled=true/status=IN_PROGRESS; Alien claimed normally (development_claim_basis). Earlier execution_enabled=false/status=DRAFT_PENDING_OWNER_APPROVAL and unclaimable text is obsolete; retain correction because dashboard must match frontmatter.
>
> 2026-10-03 design-audit correction: Android is control client, not worker; user task creation/targeting differs from RS ALLOWED_ACTIONS; three-end sync uses bounded convergence on server event seq, not simultaneous local-clock strong consistency.

## Goal

Three real endpoints run simultaneously in one City, see each other and issue real commands:

```text
端点 A = Mech 主机（Windows）
端点 B = Alien 主机（Windows，本机；其节点名为 **`Alien-Win`**，按 Owner 2026-10-03 的命名裁决）
端点 C = Android 实机（Alien 控制、Android Studio 连接，Android 版）
```

English interpretation: A is Mech Windows; B is Alien Windows, local node name Alien-Win per Owner's 2026-10-03 ruling; C is physical Android controlled by Alien and attached through Android Studio.

Owner requires Android to intervene and command both hosts, rather than read-only display; either host commands others/reports tasks centrally; every device knows in real time what the others do.

## Confirmed context / actual code after 2026-10-03 design audit

### Layered endpoint identity

Alien/Mech Windows are actual execution worker nodes using register→heartbeat→claim→report. Their Web clients plus Android are three control/observation clients. Android has CityClient/snapshot/WebSocket/safe-task creation, but no worker claim/execute/report path. V1 topology: 2 workers + 3 control clients + 1 canonical City. No fake Android node unable to execute.

### Android can already command City

CityClient.createTask() POSTs CHECKPOINT_DEMO to /api/v0/tasks. No RS ALLOWED_ACTIONS extension needed. CANCEL/RETRY/KEEP_WAITING/CHOOSE_PROVIDER/CONFIRM describe scheduler follow-up actions, not all user commands.

### Actual missing strict target-device intent

Current /api/v0/tasks creates ordinary QUEUED task; eligible node/claim has no persistent must-run-on-Alien-or-Mech intent. Add minimal explicit target-device routing intent, not new scheduler token. Target references known current City node; intent enters canonical task/action truth; only target claims; offline/unknown/ineligible target waits explicitly or typed refusal, no silent fallback; no misuse of providerRef/handoffTargetRef; prioritize user Action/idempotency semantics and add duplicate-submit boundary if low-level /tasks extended.

### Existing canonical event order

Store events have server AUTOINCREMENT seq and event ID. Three-end sync proves convergence on same server seq, not three local-clock screenshots.

### UXI-391 complete

Accepted Utopia main `ec12fd0831f31fd81aef9cd9dfb0c959d010f63b`, recorded main CI 37088960085 green, REMOTE_HANDOFF_CLOSEOUT_REPAIRED complete, historical workbook archived under finished/completed-2026-10-03/.

## Dependencies and unlock

UXI-391 reviewed/Step7 merged/marker released supplies genuine execution/result return; Owner approval execution_enabled=true/status=READY; Mech/local host/physical Android available via Studio/adb; agree same City address/pairing token, record at Step1 rather than memory.

## Allowed change boundary

1. Minimal three-client same-City connection config.
2. Minimal Web/Android strict-target safe-task interaction.
3. Minimal City task/Action contract for explicit intent.
4. Minimal node-claim target guard, preserve untargeted scheduler.
5. Web/Android common event-truth synchronization/convergence probes.
6. Three-end E2E harness/receipts/negatives/tests/reports/evidence.

## Prohibited change boundary

No fake Android worker; reopened frozen UI/RS/UXI work; ALLOWED_ACTIONS expansion for create/target; provider/handoff fields smuggling target; new AI provider/public relay/TLS/permission model; peer-to-peer authoritative truth; silent unavailable-target reassignment; cache/missing events posing as realtime consistency. Development/Formal Review remain different physical hosts.

## Task-specific construction steps

### Step 1 — Claim-time reconciliation

Reread Digital-City/Utopia main and hosted CI, UXI-391 closeout/dependencies; record development_baseline_sha and agreed City address/token; begin only execution_enabled=true.

### Step 2 — Three clients, one City

1. Measure Gateway reachability at claim, not historical permanent IP.
2. Alien Web/Mech Web/Android may use different transport but read same cityId.
3. Trusted private LAN/routed private network/existing RF allowed; adb reverse allowed controlled development if same canonical Gateway.
4. Redact tokens from reports/screenshots/Git; no public Internet exposure for test.
5. Only two distinct Alien+Mech workers; Android control client.

### Step 3 — Strict target-device routing

Explicit user target intent, prove:

```text
target=Alien → only Alien may claim
target=Mech  → only Mech may claim
target offline/unknown → no silent fallback
duplicate user action → no accidental duplicate execution
untargeted task → existing scheduler behavior unchanged
```

Field name follows actual Action/City contract, never reuse different-semantics field.

### Step 4 — Android → Alien / Mech

Physical Android initiates target=Alien and target=Mech safe task. Each proves control input→canonical action/task→correct claim→RUNNING→report/result→terminal truth→same result observed by three online controls.

### Step 5 — PC ↔ PC and bounded convergence

Alien control→Mech worker, Mech control→Alien worker. Choose TASK_CREATED/TASK_STARTED/TASK_COMPLETED and at least one offline/online/ownership event. For each server seq record all three observed-at/convergence latency. Default online-surface convergence within five seconds of server emit; claim-time stricter window allowed with independent Review retest. Offline end need not update during outage, but displays stale/offline and reconverges on recovery.

### Step 6 — Three-end physical acceptance, opposite host

After Development, opposite physical host independently reviews and joins acceptance. Negatives include one offline end with other two, duplicate command, stale target, issued command with nobody eligible. Each end leaves its own receipt, no mutual endorsement.

### Step 7 — Merge and terminal

Exact review-head CI green→Utopia main merge→main CI→THREE_END_MESH_E2E_ACCEPTED→mandatory post-completion re-entry scan (reports/MESH-301/POST_COMPLETION_REENTRY.md or §5 typed zero-claim).

## Task-specific independent review

Do not merely sign reports. Reconstruct same-City three-end setup with own instruments, not just developer scripts; independently prove Android changes backend through e.g. global event scan, not screenshot; realtime who-does-what convergence plus deliberate-offline counterexample; stale/duplicate/unauthorized target negative; exact-head CI/evidence readability; actual post-completion re-entry.

## Tests / physical / visual evidence

```text
- 一个 canonical cityId 的三端连接 receipts
- Alien + Mech 两个真实 worker node 身份
- Android control-client receipt（不得伪装 worker）
- Android -> Alien strict-target task E2E
- Android -> Mech strict-target task E2E
- Alien -> Mech 与 Mech -> Alien E2E
- canonical event seq 在三端的 bounded-convergence 记录
- negative controls: unknown/offline/duplicate/stale target
- 普通未定向 task scheduler regression
- exact-head hosted CI
```

English equivalent of this original checklist: one-cityId three-end receipts; two real distinct Alien/Mech workers; Android control-client receipt, no fake worker; Android→Alien and Android→Mech strict-target E2E; PC↔PC E2E; event-seq bounded convergence on three ends; unknown/offline/duplicate/stale negatives; ordinary untargeted scheduler regression; exact-head hosted CI.

Bulky raw evidence stays in Utopia evidence/raw/mission-book/MESH-301/**.

## Completion gates

1. Three real controls simultaneously in one City.
2. Alien/Mech two real distinct workers.
3. Android not fake worker.
4. Android strict-target safe task to each host.
5. Hosts mutually strict-target safe tasks.
6. Unavailable/unknown/duplicate negatives fail honestly.
7. Untargeted tasks no regression.
8. Three online surfaces converge on seq within bounded window.
9. Android offline/reconnect reconverges.
10. Opposite physical host Formal Review PASS.
11. Exact review-head CI PASS.
12. Utopia main merge/merged-main CI PASS.
13. THREE_END_MESH_E2E_ACCEPTED recorded.
14. Post-completion re-entry executed.

## Design audit: six original draft defects corrected

1. Android client/worker confusion → 2 workers + 3 controls.
2. ALLOWED_ACTIONS as all commands → removed false fork; target task is routing intent.
3. False simultaneous strong consistency → canonical seq + bounded convergence.
4. Fixed historical LAN/IP → claim-time route, same cityId rather than same transport.
5. False Mech endpoint/reviewer conflict → no Owner fork; endpoint participation not authorship, only Development/Review different hosts.
6. Weak THREE_END_MESH_RUNNING → THREE_END_MESH_E2E_ACCEPTED.

The remaining Owner gate in this historical design passage was only activation, not the six technical choices; the opening correction above records later activation.

## Reports / Utopia evolution records

mission-book/reports/MESH-301/DEVELOPMENT_REPORT.md, REVIEW_REPORT.md, POST_COMPLETION_REENTRY.md; Utopia evidence/raw/mission-book/MESH-301/**.

## Binding persistent rules

Inherit CONSTRUCTION_RULES atomic claim, independent hosts, wait/wake, 20-minute fallback rescan, external reconciliation, exact-head CI/evidence, no-idle/no-make-work/integration refresh. Also inherit ASYNC_RELIEF Hns supervisor/Codex worker, Review→Repair relay, L0→L3 escalation. Relief reduces Owner manual relay only; never weakens physical independence, CI, evidence or safety gates.
