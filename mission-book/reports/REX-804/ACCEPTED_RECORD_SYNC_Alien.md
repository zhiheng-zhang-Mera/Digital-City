# 已验收事实同步 / Accepted record synchronization

Mech 在控制仓库0b92abf/462be9d正式复验精确fe700aba957990f93b22fd63d594ddfff7b4e243并释放FAULT_INJECTION_RECOVERY_ACCEPTED；开发者Alien本次仅同步当前记录，不自验收、不扩大合并授权。原review_ci还停留于075ddc1的B4 NOT_PASSED，且同一frontmatter内有两个review_verdict；现把当前CI与scope绑定正式验收，把旧值分别保留为review_ci_history/development_ci_history/review_previous_verdict。完整失败及复验过程仍见REVERIFICATION_REPORT.md。

Mech formally re-verified exactfe700aba957990f93b22fd63d594ddfff7b4e243 at control commits0b92abf/462be9d and released the terminal marker. Alien only synchronizes current records, without self-acceptance or additional merge authority. The old review_ci still described the075ddc1 B4 rejection and frontmatter contained duplicate review_verdict fields. Current CI and scope now reflect formal acceptance; old values remain separately as history. Full failures and re-verification remain inREVERIFICATION_REPORT.md.

Registry候选标签改为ACCEPTED_EXACT_HEAD，四维COMPLETE/VERIFIED/PARTIAL/NOT_TESTED不变。Android fault controls、实体/外部provider恢复仍NOT_RUN，DUPLICATE_EVENT recovery仍NOT_MEASURED。任务完成不代表已合入main、部署或意图验证通过。

Registry reconciliation now recordsACCEPTED_EXACT_HEAD; dimensionsCOMPLETE/VERIFIED/PARTIAL/NOT_TESTED remain unchanged. Android fault controls and physical/external-provider recovery remainNOT_RUN, and duplicate-event recovery remainsNOT_MEASURED. Task completion does not mean merged main, deployment or passed intent validation.
