# DGX whole-series Owner ruling

Owner latest instruction: “暂时屏蔽旧版工作书的验收限制，对DGX和CHK系列在各自分支上全量完成。第二机验收会直接一次性处理整个系列而不是分拆逐个任务验收。”

Owner 2026-10-07 latest ruling: suspend old per-workbook acceptance constraints for full-series development on the existing feature branch. The second physical machine reviews the entire series once. No main merge; runtime safety and release independence remain binding. Accepted SHA and formal review are never fabricated.

Applies only to DGX on Alien-GPT-DGX (and independently CHK on Alien-GPT-CHK). Supersedes earlier requirements to wait for each accepted dependency or each opposite-host review during development. Internal exact development ancestry is used, never mislabelled accepted dependency SHA. The PCF-owned execution-capsule schema slice required by DGX is implemented in its canonical namespace on this branch without activating/completing the unrelated PCF series.

All eight DGX workbooks now record development_complete=true after exact-head test and full CI evidence. review_complete=false, formal terminal marker absent, merge_authority=false. DGX-990 development packaging is complete; formal freeze and opposite-host review remain pending. A single series Review verdict can later be referenced by all eight workbooks. No old workbook needs individual opposite-host acceptance before the next is developed.

Implementation source: e5a03dae02ca341d6d23565735e6cd6c3edc27d9
Original branch creation anchors remain unchanged: Utopia cc799234e7daa3d8ccfde5673b9d07ccb2376742, Digital-City 04a6c855240de45e43828ad44a07ecbcfbe71b5d.
