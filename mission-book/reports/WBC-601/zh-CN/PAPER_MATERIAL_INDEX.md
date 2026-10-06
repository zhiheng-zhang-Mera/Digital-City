# WBC-601 — 论文素材索引

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；原历史事实、失败、未知边界完整保留，元数据和证据仅以代码围栏引用。

> CONSTRUCTION_RULES §14B长程agent研究门在任务进行中加入持久规则（Digital-City3f26702/b088dd3），故这是工作后而非工作前记录的适用决定，并明确说明。仅记录可观测工程事实，无隐藏推理、思维链或虚构数字；夹具未暴露字段为NOT_OBSERVABLE＋原因，绝非0。

## 1. 适用决定

```text
research_evidence_applicability = APPLICABLE
long_horizon_context_evidence   = CAPTURED
research_evidence_refs          = see §6
```

APPLICABLE、长程上下文CAPTURED、研究引用§6；§14B.1信号与实发事件逐项对照：

| 信号 | WBC601观测 |
|---|---|
| 长运行异步构建 | 是，一次领取、完整实现、托管CI往返、CI修复、两控制面rebase同会话 |
| 上下文压力／压缩 | 此会话未观测，§3未知；Owner70%压缩常设指令生效但未触发 |
| 会话重启／恢复 | 本机无；另一Alien在其运行时同控制分支推13提交含模板／规则改变 |
| Mission Book外部恢复 | 是，工作书／报告／分支／SHA／CI在恢复需要前写外部，rebase后实际回读 |
| 连续任务领取 | 完成后重扫§5 |
| Owner需回来继续 | 无，干预0 |
| 虚假COMPLETE | 托管CI捕获一次险情 |
| 重复／回归 | 避免一次近重复测量，发现一次真实旧状态读取 |
| 旧分支／SHA／任务状态 | 两次，旧生成状态及记录被另一主机后提交静默重置 |

## 2. 外部状态引用（RQ3：提示外存什么）

```text
control_repo        zhiheng-zhang-Mera/Digital-City @ main
implementation_repo zhiheng-zhang-Mera/utopia
workbook            mission-book/workbench-compatibility-migration/WBC-601-execution-backend-contract-and-standard-default.md
report              mission-book/reports/WBC-601/DEVELOPMENT_REPORT.md
branch              wbc/WBC-601-execution-backend-contract
baseline_sha        612c344f9f2b06a67b2645b4662d97750dd7c44e
head_sha            d65dbd3af2d8903aca13726f74110e1f2f6b9b65
ci_green            V0.2 checks run 37205291447 completed/success on head_sha
ci_failed_earlier   V0.2 checks run 37204673910 completed/failure on 9f9db6384779e75f51ec317074238c139e1de609
claim_commit        898db10   (mission-book workbook claim)
record_commit       29d7436   (after rebase onto fd0fc87)
worktree            D:/utopia-wbc601
```

控制／实现仓库、工作书、开发报告、分支、基线／头、绿与早红CI、领取898db10、rebase fd0fc87后记录29d7436、工作树均可恢复。会话每个跨上下文步骤都能仅从这些引用恢复，无重要信息只在对话。中途恢复真实头、其CI、旧头为何红靠Actions API与报告回读而非记忆。

## 3. 可观测字段（§14B.3）

```text
agent_provider        DeepSeek
agent_model           exact model identifier NOT_OBSERVABLE + reason: the session runtime exposes only the
                      display family "deepseek-flash"; no model id/version string is available to the agent
agent_harness         DeepSeek Harness (dsh), Web GUI at http://127.0.0.1:3080
harness_version_or_sha NOT_OBSERVABLE + reason: the checkout at D:\DS-Hns\app\package.json reports
                      "ds-harness" version "1.0.0-alien-rebuild", which is a build label rather than a
                      verifiable commit; recording it as a SHA would be a guess
run_or_session_id     session-c292d635-5695-453e-8340-57cf491cc007
workbook_id           WBC-601
start_time            2026-10-04T12:5x Z (first command of the session; exact second not instrumented)
end_time              NOT_OBSERVABLE at capture time (session still open when this index was written)

context_window_limit_if_known            NOT_OBSERVABLE + reason: not exposed by the harness to the agent
context_tokens_before_compaction_if_known NOT_OBSERVABLE + reason: no compaction occurred in this session
context_occupancy_ratio_if_known          NOT_OBSERVABLE + reason: same
compaction_trigger                        NOT_OBSERVABLE + reason: no compaction occurred in this session
compaction_trigger_reason                 NOT_OBSERVABLE + reason: same
task_phase_at_compaction                  NOT_APPLICABLE (no compaction)
semantic_boundary_type                    NOT_APPLICABLE (no compaction)

summary_or_checkpoint_artifact_ref        mission-book/reports/WBC-601/DEVELOPMENT_REPORT.md
                                          (this is the checkpoint that a resumed agent would read first)
external_state_refs_used                  §2
state_fields_reconstructed                (a) exact head SHA after the forced update;
                                          (b) that an earlier pushed record had been reset by another host;
                                          (c) which root-suite failures are environmental;
                                          (d) the current claim state of every READY workbook
state_reconstruction_errors               0 observed on this host; the cross-host reset in §4 was caught by
                                          comparing local and remote, not by a wrong decision

owner_intervention_count                  0
owner_intervention_reason                 NOT_APPLICABLE
task_transitions_completed                claim -> implementation -> local verification -> push -> CI FAIL ->
                                          repair -> CI PASS -> control-plane record -> rebase/publish
duplicate_work_count                      0 executed; 1 avoided (see §4, last item)
stale_state_error_count                   2 (both caught before they could cause a wrong action; §4)
false_completion_count                    0 declared; 1 prevented by hosted CI (§4)
regression_or_reopened_work_count         0
recovery_time_if_measurable               NOT_OBSERVABLE + reason: no wall-clock instrumentation around the
                                          rebase/recovery steps
autonomous_work_span_if_measurable        NOT_OBSERVABLE + reason: session start time was not instrumented
                                          before work began, so an honest span cannot be given
terminal_reason                           EXECUTION_BACKEND_STANDARD_COMPAT_ACCEPTED (development side);
                                          opposite-host Formal Review PENDING
```

provider DeepSeek；runtime仅deepseek-flash家族，无精确模型ID／版；DeepSeek Harness Web127.0.0.1:3080，package的1.0.0-alien-rebuild只是构建标签非可验SHA。会话session-c292d635-5695-453e-8340-57cf491cc007，开始2026-10-04T12:5x Z未测精确秒，捕获时仍开所以结束未知。窗口限未暴露、未压缩故token／占用／触发及原因NOT_OBSERVABLE，阶段／语义边界NOT_APPLICABLE。开发报告是恢复优先检查点，外部引用§2。重建头、跨主机重置、环境失败、所有READY领取状态；本机重建错误观测0，reset通过本远比较发现非错决策。Owner干预0、原因不适用；完整claim→实现→本测→推→CI失败→修复→CI通过→控制记录→rebase发布。重复执行0、避免1；旧状态错误2均行动前捕获；虚假完成声明0、CI阻止1；回归重开0。恢复时间无墙钟仪器、自治跨度起时未测，均未知。终止仅开发侧标记，正式审核待定。

## 4. 可引用事件（RQ1/RQ2原材料）

**I1 本地PASS被托管正确拒绝。** 等价测字面healthy，在常驻Rooms机通过、干净无Rooms失败。以为断言契约却断言环境。RQ2：环境是活跃工作上下文但不得当证据信任；托管收据是外部事实纠正内部上下文看不到的语义错误。证据37204673910日志、开发报告§10。

**I2 生成状态落后两合并。** UTOPIA_LIVE_STATUS.json说main69a097b5、真实612c344f；信它会锚定旧基线。§7协调及运行测量优先规范源规则捕获，开发报告§1。

**I3 已推记录被另主机静默reset。** 本机推领取及开发记录，另机由旧本地状态推13提交，origin/main三字段development_head_sha/development_ci/development_complete回null/false。代码／报告未损，rebase再发修复；可推广事实是多主机控制面push不等持久状态转移，只有回读验证。候选建议权威结构执行状态需乐观并发或推后验证。证据HEAD..origin/main三字段diff，以及领取提交仍祖先，故不是夺领取。

## 5. 完成后任务池连续扫描

§14B.1连续领取／排空适用信号。当时READY为WBC602、CEX701（另一机已领）、702/703/704、REX801/802，另JOIN590实物和SHOW401非产品媒体偏Alien。尚未到零可领，此机当时claimable_now=1。

## 6. 研究院主题

```text
06-研究院区(Research-District)-&-研究实验域(Research-Experimentation-Domain)/01-研究院(Research-Institute)-\
&-研究机制实验平台(Research-Mechanism-Experimentation-Platform)/paper-materials/{en,zh-CN}/
    LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05.md          <- RQ1/RQ2/RQ3 framing; I1, I2
    LONG_HORIZON_AGENT_STATE_IDENTITY_PROVENANCE_FRESHNESS_2026-10-05.md  <- I2, I3 (state identity and
                                                                   freshness of external facts)
```

LONG_HORIZON_AGENT_CONTEXT_LIFECYCLE_2026-10-05对应RQ1/2/3及I1/I2；STATE_IDENTITY_PROVENANCE_FRESHNESS对应I2/I3外部事实身份与新鲜性。未声称NO_RESEARCH_SIGNAL，因为至少I1–I3三可引用事件。

## 7. 声明边界

无因果结论：单会话自然观测，§14B.5控制重放／消融未跑。无token／成本遥测，未暴露且禁数字代替。无压缩研究：未发生，所以NOT_OBSERVABLE＋原因而非虚构触发故事。

## 相反主机审核扩展

Alien-codex真实MERA-ALIANWARE独立发现原dispatch目标／预约绕过及运行重分、就绪矛盾、空端口无类型拒绝。见 [REVIEW_FINDINGS](./REVIEW_FINDINGS.md) 和纠正11e59e71a2aaf00a03bb95d1f6d6a9a600191dd0。开发CI成功未覆盖独立负面；审核原夹具ID错保留INVALID_INSTRUMENT，不是产品失败。

watchlist=[RS-G3-INDEPENDENT-REVIEW-BOUNDARY,RS-G3-IDENTITY-PROVENANCE,RS-G4-UNIFIED-CONTROL-PLANE]，最高G4_RARE_SYSTEMIC、MAXIMUM_BOUNDED。原头／纠正头／角色资格／规范比较器／新注册门／待CI是不同证据状态，不作新颖性判定。

最终f66db60998343bf99243621cfcfa2363a4566db8、CI37208400707成功，专项24及critic20通过。Core就绪错配是接口边界反例，不是当前Gateway观测回归。根相反主机正式接受PASS，未合并，见 [REVIEW_REPORT](./REVIEW_REPORT.md)。

语言配对 / Language pair: [English](../PAPER_MATERIAL_INDEX.md) · [中文](./PAPER_MATERIAL_INDEX.md)
