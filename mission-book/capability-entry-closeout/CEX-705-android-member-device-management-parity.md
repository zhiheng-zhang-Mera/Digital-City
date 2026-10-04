---
workbook_id: CEX-705
phase: CAPABILITY_ENTRY_CLOSEOUT
sequence: 705
execution_enabled: true
status: IN_PROGRESS
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: IMMUTABLE_EXACT_SHA
baseline_anchor_mode: REMOTE_REF_EXACT_SHA_AT_CLAIM
baseline_candidate_refs: ["refs/heads/main"]
required_ancestor_shas: ["612c344f9f2b06a67b2645b4662d97750dd7c44e"]
dependency_source_workbooks: []
dependency_source_shas: ["612c344f9f2b06a67b2645b4662d97750dd7c44e"]
development_baseline_sha: "0e9bea3ce739b979e582a428af8fb233045a5e75"
baseline_resolution_evidence: "mission-book/reports/CEX-705/CLAIM_RECORD.md"
baseline_blocker: null
dependencies: ["CITY_MEMBERS_HOST_ROLES_ACCEPTED_EXACT_SHA_REQUIRED"]
development_host: Alien-codex
development_branch: cex/CEX-705-Alien-codex-native-members
development_head_sha: "de9185a4ef8d761053c88316ec9efeca037239fb"
development_ci: "https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37218345150"
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/CEX-705
terminal_marker: ANDROID_MEMBER_DEVICE_MANAGEMENT_PARITY_ACCEPTED
---

# CEX-705 — Android City / Device / Member 管理入口补齐

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 论文素材：[PAPER_EVIDENCE_PROTOCOL.md](./PAPER_EVIDENCE_PROTOCOL.md)

## 目标

最新 Web 已有而 Android 缺少的管理入口：

- City rename；
- enrolled device identity；
- revoke；
- member role；
- sharing enable/disable；
- member-to-member message + receipt。

本任务补到 Android 一等 control surface。

## 必须实现

### Settings

- City display name；
- current installation summary；
- enrolled installation list（按当前 credential scope）；
- revoke self / owner-authorized revoke；
- 不显示 raw secret。

### Members / Devices

- role；
- online / computeOnline；
- sharingEnabled；
- start/stop sharing（仅合法 own node）；
- member messages；
- receipt/read state。

## 权限

Android 必须遵守 server authority：

- session 不能 rename City；
- session 不能 revoke other installation；
- own node sharing only；
- message recipient/sender scope；
- owner token 与 enrolled session UI 需要明确区分。

## 不含

- rebind / clone recovery 由 CEX-701；
- interactive Rooms 未来 backlog；
- Assistant config；
- Workbench profile UI。

## Formal Review

Android 实机 + opposite-host：

- session user；
- owner/control credential；
- rename allowed/refused；
- self revoke；
- revoke other refused for session；
- sharing toggle；
- message send/receive/receipt；
- reconnect state；
- Web/Android canonical truth 对照。

## 论文素材强制点

记录：

- parity gap count；
- authority mismatch；
- session vs owner differences；
- message delivery latency；
- reconnect；
- stale member state；
- duplicate receipt；
- UI permission presentation failures；
- review disagreement。

## 完成门槛

- Android management parity for listed features；
- authority boundaries preserved；
- Web regression none；
- opposite-host real-device Review；
- exact-head CI；
- PAPER_MATERIAL_INDEX；
- terminal marker `ANDROID_MEMBER_DEVICE_MANAGEMENT_PARITY_ACCEPTED`。
