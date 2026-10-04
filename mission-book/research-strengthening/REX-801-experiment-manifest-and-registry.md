---
workbook_id: REX-801
phase: RESEARCH_STRENGTHENING
sequence: 801
execution_enabled: true
status: READY
implementation_repo: zhiheng-zhang-Mera/utopia
baseline_policy: CLAIM_TIME_MAIN
dependencies: []
development_host: null
development_branch: null
development_head_sha: null
development_ci: null
development_complete: false
review_host: null
review_head_sha: null
review_ci: null
review_complete: false
user_exposure_class: DIRECT_CONTROL
user_exposure_surface: RESEARCH_ADVANCED
ui_exemption_reason: null
owner_gate: NONE
merge_authority: false
report_path: mission-book/reports/REX-801
terminal_marker: EXPERIMENT_MANIFEST_REGISTRY_ACCEPTED
---

# REX-801 — Experiment Manifest + Registry

> 常驻规则：[../CONSTRUCTION_RULES.md](../CONSTRUCTION_RULES.md)  
> 研究素材：[RESEARCH_EVIDENCE_PROTOCOL.md](./RESEARCH_EVIDENCE_PROTOCOL.md)

## 目标

建立机器可读 Experiment Manifest 与实验注册表，使每个研究问题都能绑定：

- question / hypothesis；
- topology；
- independent variables；
- dependent metrics；
- controls；
- repetitions；
- seed；
- required capabilities；
- stop conditions；
- artifact policy；
- exact software/config provenance。

## 最低 manifest

至少表达：

```text
experiment_id
question
topology
variables
metrics
repetitions
seed_policy
scenario_ref
fault_profile_ref
software_refs
acceptance
```

## 用户入口

属于 DIRECT_CONTROL。

必须预留稳定的 Research control contract，允许：

- list experiments；
- inspect manifest；
- create/import manifest；
- validate before run。

初期 UI 可在 Research/Advanced，不要求挤进主导航。

## 禁止

- manifest 成为第二 task database；
- 把实验描述写死成某一论文；
- 缺字段时编造默认 measurement；
- manifest 自动获得危险 fault 权限。

## Review

另一实体主机独立构造：

- malformed manifest；
- unknown capability；
- impossible topology；
- conflicting variables；
- duplicated experiment id；
- deterministic same-seed parsing。

## 素材

强制记录 schema 演化、拒绝案例、错误默认值、用户步骤、review disagreement。

## 完成门槛

- stable manifest；
- registry；
- validation；
- direct-control contract；
- opposite-host Review；
- exact-head CI；
- PAPER_MATERIAL_INDEX；
- exposure gate PASS。
