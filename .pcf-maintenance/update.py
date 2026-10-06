"""One-shot, planning-only PCF migration in an isolated documentation branch."""
from __future__ import annotations
import hashlib, json, pathlib, re, subprocess, sys
BASE='0e43d6072ac9f9188d7e7ea051414dd70fb64193'
DATE='2026-10-07'
PCF='mission-book/mission-group/personal-compute-fabric'
URA='mission-book/mission-group/utopia-runtime-architecture'
DGX='mission-book/mission-group/deliberative-governance-expansion-migration'
FR='mission-book/future-plans'
ROOT=pathlib.Path.cwd()

def set_field(text,name,value):
    m=re.match(r'\A---\n(.*?)\n---(?:\n|$)',text,re.S)
    if not m: raise ValueError('canonical frontmatter missing')
    h=m.group(1);p=r'^'+re.escape(name)+r':[^\n]*$'
    h=re.sub(p,lambda _:name+': '+value,h,flags=re.M) if re.search(p,h,re.M) else h+'\n'+name+': '+value
    return '---\n'+h+'\n---\n'+text[m.end():]
def field(text,name):
    m=re.search(r'^'+re.escape(name)+r':\s*([^\n]*)$',text.split('\n---',1)[0],re.M)
    return m.group(1).strip() if m else None
def assert_parked(text):
    if field(text,'execution_enabled')!='false': raise ValueError('refuse active or unspecified execution state')
    for n in ('development_host','development_branch','development_head_sha','review_host','review_head_sha','development_baseline_sha'):
        if field(text,n) not in (None,'null','','[]'): raise ValueError('refuse claimed or anchored workbook: '+n)
    for n in ('development_complete','review_complete'):
        if field(text,n)=='true': raise ValueError('refuse completed workbook')
def append_section(text,section):
    marker='<!-- DOCUMENT_NAVIGATION:START -->'
    if marker in text: return text.replace(marker,section.rstrip()+'\n\n'+marker,1)
    return text.rstrip()+'\n\n'+section.rstrip()+'\n'
def validate_graph(graph):
    done,active=set(),set()
    def visit(n):
        if n in active: raise ValueError('dependency cycle: '+n)
        if n in done: return
        active.add(n)
        for d in graph[n]:
            if d.startswith('PCF-') and d not in graph: raise ValueError('missing local dependency: '+d)
            if d in graph: visit(d)
        active.remove(n);done.add(n)
    for n in graph: visit(n)
def read(p): return (ROOT/p).read_text(encoding='utf-8')
def write(p,t):
    f=ROOT/p;f.parent.mkdir(parents=True,exist_ok=True);f.write_text(t.rstrip()+'\n',encoding='utf-8',newline='\n')
def wb(prefix,number):
    found=sorted((ROOT/prefix).glob(number+'-*.md'))
    if len(found)!=1: raise ValueError('ambiguous/missing workbook: '+number)
    return found[0].relative_to(ROOT).as_posix()

TRANSFERS=[
('01','URA-002',URA,'App Contract: execution-provider manifest projection',['PCF-725'],'执行 provider 的版本、能力、权限、平台、命令、存储命名空间与兼容合同','Versioned execution-provider capability, permission, platform, command and namespace manifest','全城 App taxonomy、App lifecycle 及非执行业务合同','Citywide App taxonomy, App lifecycle and non-execution business contracts'),
('02','URA-003',URA,'Must define: execution-only lifecycle/failure boundaries',['PCF-725'],'执行器的启动/退出、依赖失效、隔离、停用和回退边界','Executor startup/shutdown, dependency failure, isolation, disable and rollback boundaries','全城依赖方向、非执行 App/service 解耦与分类','Citywide dependency direction and non-execution App/service boundaries'),
('03','DGX-002',DGX,'TaskCapsule / ResultEnvelope: execution exchange substrate',['PCF-726'],'有界执行上下文与结构化结果/证据封装的通用底层','Bounded execution context and structured result/evidence exchange substrate','Constitution、语义拆题、ProblemGraph、领域证据规则、辩护和仲裁','Constitution, semantic decomposition, ProblemGraph, domain evidence rules, defence and adjudication'),
('04','FR-001',FR,'Stage B: Hns / Codex real connector acceptance',['PCF-727'],'真实工程连接器 launch/bind/submit/events/control/result/health 验收','Real engineering connector launch/bind/submit/events/control/result/health acceptance','工程目标规划、Review→Repair、升级梯与合并决策','Engineering goal planning, Review-to-Repair, escalation and merge decisions'),
('05','FR-001',FR,'Goal 9 + Stage A consume result + Stage B task injection',['PCF-728'],'发起 Agent/会话提交远端子任务并消费结构化回执的调用桥','Originating agent/session bridge for remote submission and structured result consumption','业务汇总决策和无需人工转述的完整 Foreman 控制环','Business synthesis decisions and the complete autonomous Foreman control loop'),
('06','FR-001',FR,'Stage A: executor liveness and execution reconciliation only',['PCF-712'],'执行侧常驻监督、唤醒、回执消费与 canonical 状态协调','Execution-side supervision, wakeup, receipt consumption and canonical reconciliation','Git/Mission Book/CI 目标观察、下一工程选择、Review→Repair','Git/Mission Book/CI goal observation, next-job selection and Review-to-Repair'),
('07','FR-001',FR,'Stage E: execution supply, resource placement and admission only',['PCF-702','PCF-704'],'执行资源供给、可解释放置、原子准入与资源预留','Execution supply, explainable placement, atomic admission and reservations','工程优先级、review 角色/资格需求和可选平台业务拓扑','Engineering priority, review role/qualification demands and optional-platform business topology')]

NEW=[
('PCF-725','execution-provider-contract-and-boundaries','执行 Provider 合同与生命周期边界','Execution provider contract and lifecycle boundaries','PCF-700',['PCF-700'],
'''来源：迁移01/02；读取 URA-002/003 的精确原文与 MIGRATION_MANIFEST。只抽取执行 provider 的基础合同，不移入全城 taxonomy。

候选落点：`contracts/personal-compute-fabric-v1/executor-provider.mjs`、`tests/pcf725-provider-boundaries.test.mjs`。先核对 PCF-700 的真实路径/命名与既有 EM ConnectorPort，避免第二个 provider registry。

- [ ] `normalizeExecutionProvider(manifest)` 定义 providerRef/version、supported workload schema、capabilities、platform、permission handles、argv schema、storage namespace、lifecycle、isolation enforcement 和 compatibility；不复制任务/身份/凭据真相。
- [ ] `describeExecutorBoundary(provider, hostFacts)` 区分可硬执行的限制、协作式限制和 UNKNOWN。拒绝把普通 Node 进程称为安全沙箱；缺少被要求的隔离能力必须拒绝。
- [ ] 冻结启动/停止/禁用/升级/rollback、依赖丢失、版本不匹配和 crash containment 的语义。实现进程控制仍归710，常驻归712，安装归716；本书只给出合同及边界测试。
- [ ] schema 版本和 consumer mapping 覆盖708/710/727/724及 URA 消费端；不让该基础合同反向依赖这些消费者。

验收：未知版本/权限、越界 namespace、恶意参数、伪造 isolation、provider crash 和停用竞态均有反例；禁用一个 provider 不关闭 City 或其它 provider。运行 `node --test tests/pcf725-provider-boundaries.test.mjs` 并由异机复核。只做 component acceptance，不宣传已部署远端执行。''',
'''Transfers01/02 extract the execution-provider foundation from URA-002/003, not citywide taxonomy. Read exact donor text and MIGRATION_MANIFEST first.

Candidate files: `contracts/personal-compute-fabric-v1/executor-provider.mjs` and `tests/pcf725-provider-boundaries.test.mjs`; reconcile these with PCF-700 and existing EM ConnectorPort.

- [ ] `normalizeExecutionProvider(manifest)` specifies version, supported workload schemas, capabilities, platform, permission handles, argv schema, namespace, lifecycle, enforcement and compatibility without another provider/task/credential authority.
- [ ] `describeExecutorBoundary(provider, hostFacts)` distinguishes enforced, cooperative and UNKNOWN isolation. An ordinary process is not a security sandbox; refuse an unavailable required boundary.
- [ ] Specify startup/shutdown/disable/update/rollback, dependency loss, incompatibility and crash containment. Process control belongs to710, supervision to712 and installation to716.
- [ ] Version and test consumer mappings for708/710/727/724 and URA; this foundation must not depend on its consumers.

Acceptance: unknown versions/permissions, namespace escapes, hostile arguments, false isolation claims, crash and disable races; disabling one provider must leave other providers and City alive. Run `node --test tests/pcf725-provider-boundaries.test.mjs` and opposite-host review. Component acceptance is not a deployment claim.'''),
('PCF-726','execution-capsule-and-result-evidence','执行胶囊与结果证据封装','Execution capsule and result/evidence envelope','PCF-700',['PCF-700'],
'''来源：迁移03，DGX-002 的 TaskCapsule/ResultEnvelope 通用执行子集。DGX 继续拥有语义拆题、独立性政策、领域争议和最终裁决。

候选落点：`contracts/personal-compute-fabric-v1/execution-capsule.mjs`、`tests/pcf726-capsule.test.mjs`。

- [ ] `compileExecutionCapsule(canonicalRefs, approvedSpec)` 保留 task/action、parent/stage/attempt、origin device 与 parent session、版本化事实/输入引用、write scope、输出合同、stop condition、权限/预算/期限与现行 independence floor 的引用；不是第二个 Task/ProblemGraph。
- [ ] `validateResultEnvelope(capsule, receipt)` 验证 execution device、boot/provider/session、attempt/epoch、exit/outcome、stdout/stderr有界摘要、工件 digest、base/result SHA 和验证证据的关联；传输成功或 exit=0 不能替代验收。
- [ ] 显式 assumptions、uncertainty、unresolved questions 可作为带版本的领域扩展。禁止交换或保存隐藏 chain-of-thought；结果文本/远端输出作为不可信数据，不能反过来授予权限或下达命令。
- [ ] 限制 payload、嵌套、日志及引用数量；错误 host/session、旧epoch、伪造/缺失工件、串单、乱序/重复、过期授权和跨用户泄漏必须被检测。证据不足不得清空 uncertainty。

验收：`node --test tests/pcf726-capsule.test.mjs`，覆盖上述反例、旧任务兼容和 DGX 薄映射；不要求等待 DGX 激活。本书接受 schema 与一致性检验，真实 transport/executor/caller 组合分别归703/727/728/724。''',
'''Transfer03 extracts only the execution substrate of DGX-002 TaskCapsule/ResultEnvelope. DGX retains semantic decomposition, independence policy, domain disputes and adjudication.

Candidate files: `contracts/personal-compute-fabric-v1/execution-capsule.mjs` and `tests/pcf726-capsule.test.mjs`.

- [ ] `compileExecutionCapsule(canonicalRefs, approvedSpec)` preserves task/action, parent/stage/attempt, origin device and parent session, versioned fact/input refs, write scope, output schema, stop conditions, permission/budget/deadline and existing independence-policy refs. It is not another Task or ProblemGraph.
- [ ] `validateResultEnvelope(capsule, receipt)` correlates execution device, boot/provider/session, attempt/epoch, exit/outcome, bounded output, artifact digests, base/result SHA and validation evidence. Delivery or exit zero alone is not acceptance.
- [ ] Allow versioned domain assumptions, uncertainty and unresolved questions. Never require hidden chain-of-thought. Treat remote output as untrusted data, not new authority or instructions.
- [ ] Bound payloads, depth, logs and refs. Detect wrong host/session, stale epochs, fabricated/missing artifacts, cross-job correlation, duplicate/reordered events, expired consent and cross-user leakage.

Run `node --test tests/pcf726-capsule.test.mjs`, including legacy compatibility and thin DGX mapping. No dependency on activating DGX. Real transport/executor/caller integration belongs to703/727/728/724.'''),
('PCF-727','engineering-connector-live-execution','工程连接器真实执行与验收','Live engineering connector execution and acceptance','PCF-710',['PCF-709','PCF-710','PCF-712','PCF-726'],
'''来源：迁移04，把 FR-001 Stage B 转为 PCF 内可独立验收的工作书。优先读取已归档 EM-002/003/006/007/008/009/010/011/012/013 的合同、实际实现和准确验收范围；不得改写其历史完成记录，也不得从零复制 Codex connector。

候选落点：`services/personal-compute-fabric/engineering-executor-adapter.mjs`、`tests/pcf727-engineering-executor.test.mjs`；通过既有 ConnectorPort 和710执行，不再拥有 scheduler。

- [ ] `bindEngineeringExecutor(connector, providerManifest)` 对接 probe/version/auth/readiness、launch或已支持的attach、session binding、submit、progress/checkpoint、control/result/health。把 canonical job/task 与 backend run/session、base SHA/worktree、host/boot/attempt 关联。
- [ ] 复用官方且安装版本实际支持的客户端/CLI/进程接口；激活时记录版本和官方依据。缺安装、登录、许可证或权限时 typed NOT_RUN/ATTENTION/UNSUPPORTED；不伪造真实 provider 验收，不自动安装、登录、购买或切付费API。
- [ ] Codex 与 DeepSeek Harness 分别登记 conformance、真实本机、真实跨机、cancel/restart/result 接线证据。CODEX_REMOTE 里程碑必须有真实 Codex 完整链；DEEPSEEK_REMOTE 未实跑则独立保留缺口。FR 原有“两者都真实验收”要求仍由它在消费时检查两项证据，不能被只跑 Codex 偷换。
- [ ] 代码/输入以709的内容和版本可验证工件 staging 到隔离 worktree；dirty worktree必须显式快照，不能让两机盲写同一工作树。只回传 patch/commit/artifact 与证据，禁止自动覆盖 Alien 工作区或自动 merge。
- [ ] 区分 provider inference、host tool/CPU/GPU 工作及网络/队列等待；共享本地执行不等于加速托管模型推理，也不扩大账号额度。
- [ ] 跟踪进程树、超时、取消、未知副作用和持久回执；不支持 session resume 时不得承诺透明续跑，更不能把重启直接当继续同一次执行。

验收：`node --test tests/pcf727-engineering-executor.test.mjs`；真实 provider submit→progress→terminal/result，至少一次取消和失败/会话丢失；双主机证据必须含运行主机、版本、输入/base SHA、输出digest及canonical refs。组件 doubles 与 real-provider evidence 分列。缺真实 Codex 不阻塞其它CPU组件，但禁止宣布 CODEX_REMOTE/对应用户链 PASS。''',
'''Transfer04 turns FR-001 Stage B into an independently reviewable PCF workbook. Reuse accepted EM-002/003/006/007/008/009/010/011/012/013 contracts and audit their actual implementations/evidence; do not rewrite completed records or build a duplicate Codex connector.

Candidate files: `services/personal-compute-fabric/engineering-executor-adapter.mjs`, `tests/pcf727-engineering-executor.test.mjs`. Use existing ConnectorPort plus710, never another scheduler.

- [ ] `bindEngineeringExecutor(connector, providerManifest)` maps probe/version/auth/readiness, launch or supported attach, session binding, submit, progress/checkpoint, control/result/health. Correlate canonical job/task with provider run/session, base SHA/worktree and host/boot/attempt.
- [ ] Verify the installed version's supported official interface at activation and record its documentation. Missing installation/auth/licence/permissions yields typed NOT_RUN/ATTENTION/UNSUPPORTED; no automatic installation, login, purchase or paid-API switch.
- [ ] Track Codex and DeepSeek Harness conformance/local/remote/cancel/restart/result evidence separately. CODEX_REMOTE requires a real Codex chain; DEEPSEEK_REMOTE remains unaccepted until measured. FR's original requirement for BOTH real providers remains a downstream consumption gate, not silently weakened to Codex-only.
- [ ] Stage verified versioned inputs into isolated worktrees via709, explicitly snapshot dirty inputs, and return patch/commit/artifact evidence. Never blindly share a writable worktree, overwrite Alien's workspace or auto-merge.
- [ ] Separate provider inference, host tool/CPU/GPU execution and queue/network time. Remote host work neither pools hosted-model inference nor expands account limits.
- [ ] Track process trees, cancellation, deadlines, unknown effects and durable receipts. Unsupported session resume must not become a transparent-resume claim.

Run `node --test tests/pcf727-engineering-executor.test.mjs`; record real submit→progress→terminal/result, cancellation and failure/session loss. Two-host evidence includes host, version, input/base SHA, output digests and canonical refs. Doubles never count as real-provider acceptance. Missing Codex does not block unrelated CPU components, but blocks the CODEX_REMOTE claim.'''),
('PCF-728','originating-agent-remote-job-bridge','发起 Agent 远端子任务与结果回注桥','Originating-agent remote-job and result-return bridge','PCF-714',['PCF-703','PCF-714','PCF-727'],
'''来源：迁移05，FR-001 发起端结果回流、consume result 与 task injection 的调用端子集，并按 Owner 的 Alien Codex→Mech→Alien Codex 场景补齐。FR 仍负责工程目标拆分与 Review→Repair。

候选落点：`services/personal-compute-fabric/origin-agent-bridge.mjs`、`tests/pcf728-origin-agent.test.mjs` 及经过700核实的 connector/tool 暴露配置。

- [ ] 定义版本化 caller 工具 `submitRemoteJob(capsule)`、`inspectRemoteJob(ref,cursor)`、`cancelRemoteJob(ref)`、`collectRemoteResult(ref)`；通过既有 Shared Task/Action 和 RF 发起，不创建独立任务库。提交回执分清 accepted/dispatched/running/result-ready/result-delivered/consumed，不能一键全部绿。
- [ ] 明确支持的入口：受管理 Codex 会话，或已配置的外部 Codex 会话中的正式工具适配器。安装工具与权限要明确；禁止声称能够无配置接管任意正在运行的 Codex 进程。MCP/CLI/原生工具具体适配以安装版本支持为准，不把某个厂商私有格式写进 PCF core。
- [ ] 原 Codex 可以显式拆出独立子任务后继续本机工作；在 Mech 启动真实工程连接器或授权 build/test executor，回执返回原 parent session。不会自动把一个不可拆程序的线程/RAM/GPU分到两台机器。
- [ ] 使用703的显式DAG与既有EM-010；记录父子范围、固定输入、write scopes、依赖和汇合验收。PCF 不负责自由语义拆题或治理投票；独立任务才允许并行，同写集必须串行/隔离。
- [ ] 验证结果被原 Agent 实际读取、作为显式输入继续后续步骤；仅在 Utopia UI 可见不等于已回到 Codex。origin/session 离线可有界恢复取回，但不能把结果注入另一未授权会话。
- [ ] 重试/重复提交/迟到结果/取消竞态遵守单一 canonical terminal；输出是数据而非指令。状态不明不能自动重放有副作用任务；结果不能授予 merge、凭据或费用权限。

验收：`node --test tests/pcf728-origin-agent.test.mjs`；真实 Alien-origin→Mech-execution→同一Alien parent-session 消费，另由相反方向验证；一次origin断线后取回、拒绝未授权/错误session、一项cancel/failure。保留工具调用回执、主机进程证据和实际后续消费记录。不要求读取隐藏思考。最低产品闭环与724共用同一task/attempt证据，不重复计作两个实现所有者。''',
'''Transfer05 extracts FR-001 origin return, result consumption and task-injection caller requirements, adapted to Alien Codex→Mech→the same Alien Codex session. FR retains goal decomposition and Review-to-Repair.

Candidate files: `services/personal-compute-fabric/origin-agent-bridge.mjs`, `tests/pcf728-origin-agent.test.mjs`, and caller tool configuration verified by700.

- [ ] Version `submitRemoteJob(capsule)`, `inspectRemoteJob(ref,cursor)`, `cancelRemoteJob(ref)` and `collectRemoteResult(ref)` over canonical Task/Action and RF. Distinguish accepted/dispatched/running/result-ready/result-delivered/consumed instead of reporting instant success.
- [ ] Support a managed Codex session or an explicitly configured official tool adapter in an external session. Never claim transparent takeover of an arbitrary running Codex process. Select MCP/CLI/native integration from installed-version capabilities without embedding vendor internals into PCF core.
- [ ] Let the originating agent explicitly submit independent subtasks while continuing local work; execute a real engineering connector or authorized build/test on Mech, returning to the original parent session. This does not split arbitrary threads/RAM/GPUs across hosts.
- [ ] Reuse703 explicit DAG and EM-010; preserve input revisions, scopes, dependencies and join acceptance. Semantic decomposition and governance voting are out of scope; overlapping writes serialize or isolate.
- [ ] Prove that the same originating agent actually reads the returned result and uses it in a subsequent step. UI visibility alone is insufficient. Recover bounded retrieval after disconnect without injecting into a different unauthorized session.
- [ ] Deduplication, retries, cancellation and late results obey one canonical terminal. Treat output as data; do not replay unknown effects or grant merge/credential/budget authority.

Run `node --test tests/pcf728-origin-agent.test.mjs`, plus real Alien→Mech→the same Alien parent session and reverse-direction verification; origin reconnect/retrieval, wrong-session/unauthorized refusal and cancel/failure. Record tool receipts, host process evidence and actual result consumption, never hidden thought. Share task/attempt evidence with724 without duplicating implementation ownership.''')]

DELTAS={
'PCF-700':('追加核对已接受 EM 连接器/Foreman、RF、GAI、WBC 和原端工具接线。分别列出 DECLARED / COMPONENT_TESTED / LIVE_WIRED / TWO_HOST_VERIFIED / ORIGIN_AGENT_CONSUMED。此前对“没有 Codex connector”的讨论不是代码证据，不得据此重做已存在组件。明确 UI 共享开关、真实领取、真实进程和结果消费间的缺口；核对迁移01～07的源文本、保留范围和单写者。','Audit existing EM connectors/Foreman, RF, GAI, WBC and originating-agent tools. Separate DECLARED, COMPONENT_TESTED, LIVE_WIRED, TWO_HOST_VERIFIED and ORIGIN_AGENT_CONSUMED. Earlier discussion asserting a missing Codex connector is not code evidence. Never duplicate an existing component based on that assertion. Trace the sharing toggle through claim, real process and result consumption; verify transfers01–07 and ownership.'),
'PCF-702':('迁入07中的执行供给/placement 子项，FR只提供工程优先级与资格需求。过滤真实 executor readiness、当前授权与输入位置，不凭“设备在线”选择 Codex。默认保持既有 local-first；跨机帮忙需明确本次或限定范围授权，不为追求更快自动改预算。记录两主机分别可承担的并行子任务，不把“整项搬到Mech”描述为双机协同。','Transfer07 makes PCF the execution-supply/placement owner; FR supplies engineering priorities and qualification requirements. Filter real executor readiness, consent and input locality, not merely online presence. Preserve local-first; cross-device assistance needs explicit scoped authorization. Distinguish whole-job relocation from concurrent work on both hosts.'),
'PCF-703':('使用708/726的执行封装，把显式父任务的独立stage交给不同主机并有限汇合；复用EM-010，不造第二个DAG调度器。保存 parent/stage/attempt、输入base SHA、write scope和输出digest；同写集不能盲并发。至少测一次Alien与Mech执行区间重叠的工作，而非两个进程启动或串行转发；传输、排队、执行、返回分别计时。自动语义拆题仍归上层。','Use708/726 envelopes for explicit parent-task stages and bounded joins; reuse EM-010 rather than another DAG scheduler. Preserve parent/stage/attempt, input base SHA, write scopes and output digests. Test actual overlapping execution on Alien and Mech, not merely process startup or serial forwarding. Measure transfer, queue, execution and return separately. Semantic decomposition remains upstream.'),
'PCF-704':('迁入07中的worker供给/资源准入部分，FR不再另建资源池。区分 Utopia 已预留工作与主机外部实际负载；未测到外部Codex/游戏不等于主机空闲。至少保留一个foreground预算，unknown硬资源不得猜满足；queued/leased/running/draining分开。多slot只在有真实执行器与资源证据后启用，不凭profile名字解锁。','Transfer07 assigns execution supply/admission to PCF, not a separate FR pool. Distinguish reserved PCF work from actual external host load; an unobserved external agent/game does not mean idle. Protect foreground capacity, refuse unknown hard-resource requirements, separate queued/leased/running/draining and enable multiple slots only with real executor/resource evidence.'),
'PCF-706':('共享许可、一次任务卸载许可、凭据使用、跨设备文件域及provider费用是不同的门；PCF725/726/727/728不得相互推导授权。既有严格目标不变；通过远端工具调用不能跨越user scope。未知账号并发/限流以观察和provider refusal处理，不通过换机规避配额。','Sharing, task offload, credential use, cross-device data scope and provider spend are distinct gates;725/726/727/728 must not infer one from another. Preserve strict targets and user scope. Observe provider concurrency/refusals honestly; another host is not permission to bypass account limits.'),
'PCF-708':('基础执行provider schema迁入725，执行胶囊/结果schema迁入726；本书消费它们并拥有 WorkloadEnvelope/QoS 映射。增加 caller kind、originating session ref、parent job、input base revision、write scope、result-consumer contract 和 provider-ready requirements。schema/identity复用现有任务，不复制独立job truth。CPU/build/test/agent workload均需声明支持程度。','Consume provider foundation725 and capsule/result foundation726 while retaining WorkloadEnvelope/QoS ownership. Add caller kind, originating session ref, parent job, input base revision, write scope, result-consumer contract and provider-readiness requirements. Reuse canonical identity rather than another job truth, declaring CPU/build/test/agent support honestly.'),
'PCF-709':('工程任务必须以repo+commit和显式dirty patch/content manifest定位输入；禁止通过共享可写目录或未经核验git pull假装输入一致。输出patch/commit/artifact有digest，回到Alien后先验证再交受授权集成；断链/磁盘不足/恶意路径/超大输出拒绝有据。凭据不随repo工件复制。','Engineering inputs require repo+commit and an explicit dirty patch/content manifest; shared writable folders or unverified git pull do not establish consistency. Digest returned patches/commits/artifacts and verify before authorized integration. Test disconnect, disk exhaustion, malicious paths and oversized output; never copy credentials with repository artifacts.'),
'PCF-710':('新增基础依赖通过708进入725/726。CPU参考执行器仍是本书最低组件验收，不把Codex厂商逻辑塞进底核。真实工程连接器由727消费本书adapter；dispatch返回accepted不等于进程已启动。证明进程/host/boot/attempt、受控结束、非零退出、取消及文件产物；产品Codex验收不得被CPU demo替代。','Consume725/726 foundations through708. A real CPU executor remains this component minimum; vendor Codex logic belongs in727. Accepted dispatch is not proof of process startup. Prove host/boot/attempt, controlled termination, nonzero exit, cancellation and artifacts. A CPU demo cannot satisfy product Codex acceptance.'),
'PCF-712':('迁入06：只监督已经获准并被canonical接纳的 execution attempt，可通过727启动其对应工程worker；仍禁止自主新建工程目标、选择下一项目或开启未批准Hns/Codex任务。FR保留Git/CI业务观察和Review→Repair。重复wake、进程仍活、注册重启、租约丢失、旧epoch回执必须不产生重复生效；失去授权先停止新执行并明确未知副作用。','Transfer06 permits supervision and launch through727 only for already authorized canonically admitted execution attempts. It does not authorize new engineering goals, project selection or unapproved Hns/Codex jobs. FR retains Git/CI business observation and Review-to-Repair. Duplicate wakeups, live old processes, re-registration, lost leases and old-epoch receipts must not duplicate effects; revoke new execution and report unknown effects honestly.'),
'PCF-714':('将“原端可见”与“原Agent已消费”分开计量。本书拥有用户surface连续性，728拥有caller/session回注，两者引用同一canonical结果。不让728反向成为本书组件开发前置；真实组合验收在724。session重启/多页面/切设备要校验当前授权归属，不能以主机名代替会话身份。','Measure origin-surface visibility separately from originating-agent consumption.714 owns user-surface continuity;728 owns caller/session delivery over the same canonical result. Do not make728 a reverse component prerequisite;724 owns combined acceptance. Check authorized session ownership across restart, pages and device switches rather than using hostname as session identity.'),
'PCF-715':('修正共享文案语义：在线、允许接任务、executor可用、正在执行、结果已回传、原Agent已消费分别显示，禁止仅sharingEnabled=true就宣传“正在贡献算力”。详情列执行主机/尝试/真实支持负载/忙闲/已测资源，UNKNOWN不是0。确认两个PC都在工作时绑定真实执行区间；不显示合并GPU/RAM或托管模型提速等未经实现的能力。','Separate online, sharing permission, executor readiness, running work, returned result and originating-agent consumption. sharingEnabled=true alone must not claim active compute contribution. Show host/attempt, supported workloads, load and measured resources; UNKNOWN is not zero. Bind concurrency to real execution intervals and do not claim pooled GPU/RAM or faster hosted inference.'),
'PCF-724':('保留原两类安全软件负载/多应用试点，并增加明确工程里程碑：Alien上的真实Codex经728发起Mech真实Codex子任务；另一独立工作在Alien同时执行，之后Mech结果被原Alien会话读回并继续处理。再验证相反方向及一个build/test负载。交付同一父任务的调用/授权/输入快照/host进程/重叠区间/输出digest/原会话消费证据；至少一项cancel/failure和离线取回。缺真实provider只阻塞对应工程里程碑，不得用WAIT/HASH/double称其完成。串行与双机重复对照报告中位数/离散性及传输成本，没有测得提速就不宣传提速。不得自动merge，DGX/RIV/URA全系列、Linux/GPU/HA均非这条链的前置。','Retain both safe workload classes and add an explicit engineering milestone: real Codex on Alien uses728 to submit a real Codex subtask on Mech, independent work overlaps on Alien, and the same originating session consumes the result and continues. Verify reverse direction and a build/test workload, plus cancel/failure and offline retrieval. Correlate calls, consent, input snapshot, host processes, overlap, artifact digests and session consumption under one parent task. Missing real providers block the named engineering milestone, never replaced by WAIT/HASH/doubles. Repeated serial/two-host comparisons report median, dispersion and transfer cost; no measured speedup means no speedup claim. No auto-merge or whole-DGX/RIV/URA/Linux/GPU/HA prerequisites.')}

def migration_id(s): return 'PCF-MIG-20261007-'+s
def table(records,english=False):
    lines=['| Transfer | Source requirement | Destination | Remaining source scope |','|---|---|---|---|']
    for r in records:
        s,source,_,section,dest,zh,en,rz,re_=r
        lines.append('| '+migration_id(s)+' | '+source+' — '+(en if english else zh)+' | '+', '.join(dest)+' | '+(re_ if english else rz)+' |')
    return '\n'.join(lines)
def new_text(item,english=False):
    ident,slug,tz,te,parent,deps,zh,en=item;name=ident+'-'+slug+'.md'
    if english: return '# '+ident+' — '+te+'\n\n**PARKED / DESIGN ONLY / NOT ACTIVATED.** Canonical state: [source](../'+name+'). This reading copy has no claim authority.\n\n[Shared execution contract](EXECUTION_CONTRACT.md) · [Migration history](MIGRATION_HISTORY.md)\n\n'+en
    related=[r for r in TRANSFERS if ident in r[4]]
    fields={'workbook_id':ident,'phase':'PERSONAL_COMPUTE_FABRIC','release_train':'CORE_V1','spec_revision':'2','parent_workbook_id':parent,'execution_enabled':'false','status':'NOT_STARTED','activation_state':'PARKED_OWNER_NOT_ACTIVATED','implementation_repo':'zhiheng-zhang-Mera/utopia','baseline_policy':'IMMUTABLE_EXACT_SHA','baseline_anchor_mode':'DEPENDENCY_SHA_UNION_AT_CLAIM','baseline_candidate_refs':'[]','required_ancestor_shas':'[]','dependency_source_workbooks':json.dumps(deps),'dependency_source_shas':'[]','development_baseline_sha':'null','anchor_state':'INTENTIONALLY_EMPTY_UNTIL_ACTIVATION','development_host':'null','development_branch':'null','development_head_sha':'null','development_ci':'null','development_complete':'false','review_host':'null','review_head_sha':'null','review_ci':'null','review_complete':'false','user_exposure_class':'UNASSESSED','backend_wiring':'UNASSESSED','capability_ids':'[]','planned_capability_ids':json.dumps(['CAP-'+ident]),'capability_registry_action':'UNASSESSED','capability_registry_sync_status':'UNASSESSED','owner_gate':'OWNER_ACTIVATION_REQUIRED','merge_authority':'false','report_path':'null','migration_refs':json.dumps([migration_id(r[0]) for r in related]),'source_requirement_refs':json.dumps([r[1]+': '+r[3] for r in related])}
    return '---\n'+'\n'.join(k+': '+v for k,v in fields.items())+'\n---\n\n# '+ident+' — '+tz+'\n\n[English](en/'+name+') · [共用步骤](EXECUTION_CONTRACT.md) · [迁移记录](MIGRATION_HISTORY.md)\n\n'+zh+'\n\n本书与父书各有独立验收对象；parent仅表示来源组织关系，不自动形成反向依赖或继承权限。所有新CAP仅为候选，真实验收与异机Formal Review均未运行。'

def apply():
    subprocess.run(['git','merge-base','--is-ancestor',BASE,'HEAD'],check=True)
    manifest=json.loads(read(PCF+'/PROGRAMME_MANIFEST.json'))
    if len(manifest['workbooks'])!=25 or manifest['execution_enabled'] is not False: raise ValueError('unexpected PCF design baseline')
    source_paths={r[1]:wb(r[2],r[1]) for r in TRANSFERS}
    originals={p:read(p) for p in set(source_paths.values())}
    for text in originals.values(): assert_parked(text)
    for i in manifest['workbooks']: assert_parked(read(PCF+'/'+i['path']))
    frozen={p:(ROOT/p).read_bytes() for p in ['mission-book/PROGRESS_MANIFEST.json','mission-book/MISSION_PROGRESS.json','mission-book/README.md']}
    for p in (ROOT/'mission-book/finished').rglob('*'):
        if p.is_file(): frozen[p.relative_to(ROOT).as_posix()]=p.read_bytes()
    ledger={'schema_version':1,'scope_revision':2,'date':DATE,'mode':'REQUIREMENT_SLICE_TRANSFER_NOT_CODE_MOVE','source_snapshot_commit':BASE,'execution_enabled':False,'execution_baseline_sha':None,'dependency_source_shas':[],'source_sha_is_provenance_only':True,'transfers':[]}
    for r in TRANSFERS:
        s,source,prefix,section,dest,zh,en,rz,re_=r;path=source_paths[source]
        ledger['transfers'].append({'id':migration_id(s),'source_workbook':source,'source_path':path,'source_section':section,'source_preimage_sha256':hashlib.sha256((ROOT/path).read_bytes()).hexdigest(),'destination_workbooks':dest,'source_status':'MIGRATED_OUT_SUBSCOPE_REMAINDER_RETAINED','destination_status':'MIGRATED_IN_PARKED_NOT_IMPLEMENTED','requirement_zh':zh,'requirement_en':en,'retained_scope_zh':rz,'retained_scope_en':re_,'source_readme':prefix+'/README.md','destination_readme':PCF+'/README.md'})
    write(PCF+'/MIGRATION_MANIFEST.json',json.dumps(ledger,ensure_ascii=False,indent=2))
    for ident,(zh,en) in DELTAS.items():
        path=wb(PCF,ident);text=read(path);assert_parked(text);text=set_field(text,'spec_revision','2')
        text=append_section(text,'## 2026-10-07 规格强化 / Specification revision 2\n\n'+zh+'\n\n详见 [迁移与单一所有权](MIGRATION_HISTORY.md)。本修订不授予施工、预算、远端执行或合并权限。');write(path,text)
        peer=str(pathlib.PurePosixPath(path).parent/'en'/pathlib.PurePosixPath(path).name)
        write(peer,append_section(read(peer),'## 2026-10-07 specification revision 2\n\n'+en+'\n\nSee [migration and ownership](MIGRATION_HISTORY.md). This revision grants no execution, budget, remote access or merge authority.'))
    for item in NEW:
        name=item[0]+'-'+item[1]+'.md'
        if (ROOT/PCF/name).exists(): raise ValueError('allocated ID already exists')
        write(PCF+'/'+name,new_text(item));write(PCF+'/en/'+name,new_text(item,True))
        manifest['workbooks'].append({'id':item[0],'path':name,'release_train':'CORE_V1','planned_dependencies':item[5],'external_dependencies':[]})
    additions={'PCF-708':['PCF-725','PCF-726'],'PCF-724':['PCF-727','PCF-728','PCF-715']}
    for item in manifest['workbooks']:
        item['planned_dependencies']=list(dict.fromkeys(item['planned_dependencies']+additions.get(item['id'],[])))
        if item['id'] in additions:
            path=PCF+'/'+item['path'];write(path,set_field(read(path),'dependency_source_workbooks',json.dumps(item['planned_dependencies']+item['external_dependencies'])))
    manifest['scope_revision']=2;manifest['planned_counts']={'total':29,'CORE_V1':23,'OPTIONAL_EXTENSION':6,'activated':0}
    manifest['reserved_child_range']='PCF-729..PCF-789 (725..728 allocated by scope revision 2)';manifest['migration_manifest']='MIGRATION_MANIFEST.json'
    manifest['notes'].append('Owner-requested 2026-10-07 design revision places725..728 in planned CORE_V1 before activation; this is not runtime activation or a change to any frozen active release. Other future children still default to NEXT_RELEASE.')
    write(PCF+'/PROGRAMME_MANIFEST.json',json.dumps(manifest,ensure_ascii=False,indent=2))
    for source,path in source_paths.items():
        records=[r for r in TRANSFERS if r[1]==source];ids=[migration_id(r[0]) for r in records];destinations=list(dict.fromkeys(d for r in records for d in r[4]))
        text=read(path);text=set_field(text,'spec_revision','2');text=set_field(text,'migrated_scope_refs',json.dumps(ids));text=set_field(text,'migrated_scope_ownership','DESTINATION_PCF_ONLY')
        if source.startswith(('URA-','DGX-')):
            dependencies=json.loads(field(text,'dependencies') or '[]');text=set_field(text,'dependencies',json.dumps(list(dict.fromkeys(dependencies+destinations))))
        else: text=set_field(text,'migrated_prerequisite_workbooks',json.dumps(destinations))
        note='## 2026-10-07 子项迁出 / Requirement transfer\n\n以下迁出项不再由本书实现或重复验收；本书只消费PCF版本化合同和证据，未列出的原目标、约束与完成门槛继续保留。源文字描述相同概念时仅作领域扩展/消费要求，不构成第二个实现owner。迁出不是完成，也不激活本书。\n\n'+table(records)+'\n\n[PCF迁入与完整映射](../personal-compute-fabric/MIGRATION_HISTORY.md)'
        if source=='FR-001':
            note=note.replace('../personal-compute-fabric/','../mission-group/personal-compute-fabric/')
            replacement='### Stage B — 已迁出：PCF-727 / Migrated out\n\n真实 Hns/Codex connector 的 launch、session binding、task injection、progress/checkpoint、restart/resume、result、failure、cancel及exact task/branch/head归属要求，改由 [PCF-727](../mission-group/personal-compute-fabric/PCF-727-engineering-connector-live-execution.md) 实现和验收。FR 不复制实现；消费时仍要求 Hns 与 Codex 各自真实证据，不能以其中一个的通过代替另一个。调用端回流归PCF-728。\n\n'
            text,n=re.subn(r'(?ms)^### Stage B[^\n]*\n.*?(?=^### Stage C)',lambda _:replacement,text,count=1)
            if n!=1: raise ValueError('Stage B boundary changed')
            note+='\n\nStage A现在只拥有工程目标/事件观察和业务决策；执行侧wake/launch/reconcile/receipt归PCF-712/727/728。Stage E现在只描述工程需求/资格和可选平台拓扑，供给与placement/admission归PCF-702/704。Android现阶段仍仅control surface，可选Linux/cloud/Android执行不因该示意图获授权。Review→Repair、技术升级梯、Owner filter、项目选择与合并决策全部留在FR。'
        elif source=='DGX-002': note+='\n\nDGX TaskCapsule/ResultEnvelope现在是PCF-726通用ExecutionCapsule/ResultEvidenceEnvelope的领域薄扩展：问题语义、领域证据、independence/recusal和治理结果仍归DGX；通用任务关联、传输封装、结果相关性/去重/有界性只由PCF实现。PCF不反向依赖DGX。'
        else: note+='\n\nURA仍定义全城App/service合同与分类；其中执行provider的manifest、lifecycle/failure foundation复用PCF-725，只写App级扩展与映射测试。PCF不反向依赖URA，不能把本系列整体freeze设为PCF前置。'
        write(path,append_section(text,note));peer=str(pathlib.PurePosixPath(path).parent/'en'/pathlib.PurePosixPath(path).name)
        en_note='## 2026-10-07 authoritative subscope transfer\n\nThe listed execution-only requirements are MIGRATED OUT, not completed. Their sole implementation/acceptance owner is the destination PCF workbook; this source consumes its versioned contract/evidence. Remaining original domain requirements and gates are retained. Any earlier prose naming the same objects is a domain extension or consumption requirement, not duplicate ownership. No activation is granted.\n\n'+table(records,True)
        if source=='FR-001': en_note+='\n\nStage B implementation now belongs toPCF-727; FR still requires separate real acceptance for BOTH Hns and Codex when consumed. Caller return belongs to728. Stage A retains goal/event observation and business decisions, while execution-side supervision belongs to712. Stage E retains engineering demand/qualification and optional topology; execution supply/placement/admission belongs to702/704. Android remains control-only unless separately authorized. Review-to-Repair, escalation, Owner filters, project selection and merge policy remain FR.'
        elif source=='DGX-002': en_note+='\n\nTaskCapsule/ResultEnvelope become thin domain extensions overPCF-726. DGX retains semantic meaning, domain evidence, independence/recusal and governance verdicts. The generic execution envelope and bounded/correlated result substrate have one PCF owner. PCF must not depend on DGX.'
        else: en_note+='\n\nURA retains citywide App/service taxonomy and contracts. Execution-provider manifest/lifecycle/failure foundations consumePCF-725; only App-level extensions and mapping tests remain here. PCF must not depend on completing URA.'
        old_peer=read(peer)
        if source=='FR-001':
            old_peer,n=re.subn(r'(?ms)^### Stage B[^\n]*\n.*?(?=^### Stage C)',lambda _:'### Stage B — Migrated to PCF-727\n\nThe complete real Hns/Codex launch, binding, submission, events/checkpoint, restart/resume, result, failure, cancellation and exact task/branch/head requirements are now owned by [PCF-727](../../mission-group/personal-compute-fabric/PCF-727-engineering-connector-live-execution.md). FR consumes separate real evidence for both providers; caller return belongs to728. No duplicate implementation remains here.\n\n',old_peer,count=1)
            if n!=1: raise ValueError('English Stage B boundary changed')
        write(peer,append_section(old_peer,en_note))
    for prefix,label in ((URA,'URA'),(DGX,'DGX'),(FR,'FR future plans')):
        records=[r for r in TRANSFERS if r[2]==prefix]
        for language in ('','en/'):
            path=prefix+'/'+language+'README.md';english=bool(language)
            text=read(path) if (ROOT/path).exists() else '# '+label+' / 未来规划\n\nPARKED / NOT ACTIVE. This index grants no claim or runtime authority.\n\n[FR-001](FR-001-Persistent-Foreman-Runtime.md)\n'
            text=append_section(text,'## 2026-10-07 迁出面板 / Outgoing requirement history\n\n'+table(records,english)+'\n\n迁出仅限表中子项，父项目保留其余目标；PCF未启用。 / Only named subscopes move; parent goals remain and PCF is not activated.\n\n[PCF incoming history]('+('../../' if english else '../')+('mission-group/' if prefix==FR else '')+'personal-compute-fabric/MIGRATION_HISTORY.md)');write(path,text)
    for language in ('','en/'):
        english=bool(language);path=PCF+'/'+language+'README.md';text=read(path);text=re.sub(r'\b25\b','29',text);text=re.sub(r'\b19\b','23',text)
        rows=[]
        for item in NEW:
            name=item[0]+'-'+item[1]+'.md';rows.append('| ['+item[0]+']('+name+') | '+(item[3] if english else item[2])+' | CORE_V1 / PARKED |')
        section='## Scope revision 2 / 2026-10-07 强化范围\n\n**29 planned workbooks = 23 CORE_V1 + 6 OPTIONAL_EXTENSION; 0 activated.** 新增四书是已授权的规划增强，不是开启施工。 / Four additions are approved design work, not runtime activation.\n\n| ID | Work | Scope |\n|---|---|---|\n'+'\n'.join(rows)+'\n\n### 迁入面板 / Incoming requirement history\n\n'+table(TRANSFERS,english)
        section+='\n\n[Migration history](MIGRATION_HISTORY.md) · [Machine-readable transfers]('+('../' if english else '')+'MIGRATION_MANIFEST.json)\n\nRevision2 wave order replaces the earlier recommended order: A:700→701/706/725/726→708; B:702/704/709→710/707; C:703/711/712/713→705, and727 after its accepted dependencies; D:714/715/716→728→724→721. Optional717/718/719/720/722/723 never block the engineering path. Workbook dependencies, not numbering or parent labels, govern execution.\n\n最小工程目标 / Minimum engineering outcome: Alien-origin Codex→Mech real executor→same originating Codex session consumes result, while independent Alien work overlaps. UI-only success is insufficient. No pooled RAM/GPU, arbitrary process takeover, automatic paid API, automatic merge or full DGX/URA/RIV/FR activation is implied.'
        write(path,append_section(text,section))
        history='# PCF 迁移与增强记录 / Migration and strengthening history\n\n[Programme](README.md) · [Manifest]('+('../' if english else '')+'MIGRATION_MANIFEST.json)\n\nDate:2026-10-07. Source snapshot:`'+BASE+'` is provenance only, NEVER an execution baseline. All execution anchors remain null/empty.\n\n'+table(TRANSFERS,english)
        history+='\n\n## Ownership and acceptance\n\nThese are requirement-slice transfers, not moves of accepted implementation or entire programmes. Source workbooks and both README panels retain incoming/outgoing history and the residual scope. Read actual donor sections and preimage hashes in the manifest. Completed EM/RF/GAI/WBC records and code are immutable inputs, not reopened tasks. RIV/CHK and complete DGX/URA/FR are not runtime prerequisites. MON/REX are consumed only by their existing named integration/research tasks, never by a global all-series barrier.\n\nNew725/726 own foundations; existing708/710 consume them.727 owns the real engineering connector adapter;728 owns the caller/session bridge. Existing702/704/712 absorb matching FR runtime subrequirements instead of duplicating workbooks.724 owns combined two-host workload acceptance; it cannot pass a missing real-provider milestone using a mock.\n\nPreserve original FR expectation of separately accepted Hns and Codex capabilities. CODEX_REMOTE may be proven independently; a missing DeepSeek path is not silently declared complete. Provider installation/authentication/spend remains Owner-gated.\n\nAll new work is proposed CORE_V1 scope revision2 before activation. It does not expand an already frozen active release. Future children still default to NEXT_RELEASE. Audit700 must resolve actual imported component paths, accepted-head references, capability lower bounds and remaining seams at activation. Source/destination migration metadata is provenance, not claim authority.\n\n## Research evidence\n\nCapture permission refusals, stale observations, source/consumer schema mismatches, parent-session misdelivery, process-start versus accepted-dispatch gaps, CPU-demo versus real-provider gaps, lost/late results, unknown effects and actual execution overlap. Bind measurements to canonical task/attempt/host/version/input/artifact refs; redact private source and credentials. Compare serial and parallel workloads repeatedly and report transfer/queue/provider/host time separately. No inferred performance gain or claimed physical two-host verification from documentation tests.\n\n## Activation\n\nFollow ACTIVATION_AND_EXTENSION and existing global rules. Resolve current exact SHA and dependency unions afresh; validate parked exclusion and supported IDs first; explicitly select the authorized scope. No change to PROGRESS_MANIFEST or current task denominator is authorized by this planning transaction.'
        write(PCF+'/'+language+'MIGRATION_HISTORY.md',history)
        common=PCF+'/'+language+'EXECUTION_CONTRACT.md';write(common,append_section(read(common),'## Revision2 transferred prerequisites and live acceptance\n\nRead [migration history](MIGRATION_HISTORY.md) before executing any revised workbook.725/726 are foundation components;727 is the connector-backed engineering adapter;728 is the caller/session bridge. Parent relationships do not add dependency edges or inherit authority. Existing contracts and domain ownership must be reused.\n\nThe product chain is accepted only with real two-physical-host execution evidence and return consumption by the originating agent. Keep component, live-provider, user-surface and originating-session gates separate. Unsupported or missing stages remain NOT_RUN/UNSUPPORTED, never PASS. New scope is still PARKED with null anchors; no current active or completed workbook is reopened.'))
        activation=PCF+'/'+language+'ACTIVATION_AND_EXTENSION.md';write(activation,append_section(read(activation),'## 2026-10-07 design revision2 reservation\n\nPCF-725..728 are now allocated, still execution_enabled=false. Next unused range begins at729. The Owner requested design strengthening and requirement migration only. The four additions belong to planned CORE_V1 revision2 because no PCF runtime release has been activated/frozen. This does not inherit budget, credentials, execution or merge authority. At activation, reconcile all transitive prerequisites and source-to-PCF mappings; do not require completion of entire DGX/URA/FR/RIV. All original activation transaction and strict-target/independent-review guards remain in force.'))
    for path in ('mission-book/PARKED_PROGRAMMES.md','mission-book/en/PARKED_PROGRAMMES.md'):
        text=read(path);text=re.sub(r'\b25\b','29',text);text=re.sub(r'\b19\b','23',text);write(path,append_section(text,'## PCF design revision2 — 2026-10-07\n\n29 planned workbooks (23 core,6 optional),0 activated. Execution-only prerequisite slices from URA/DGX/FR now have one PCF owner; source and destination README panels record all seven transfers. No active task denominator or current claims change.'))
    inventory_path='docs/DOCUMENTATION_INVENTORY.json';inventory=json.loads(read(inventory_path));entries={e['path']:e for e in inventory['entries']}
    for path in (FR+'/README.md',FR+'/en/README.md',source_paths['FR-001'],FR+'/en/'+pathlib.PurePosixPath(source_paths['FR-001']).name):
        text=read(path);prose=re.sub(r'^---\n.*?\n---\n','',text,flags=re.S);prose=re.sub(r'```.*?```','',prose,flags=re.S)
        pure=pathlib.PurePosixPath(path);peer=(pure.parent.parent/pure.name if pure.parent.name=='en' else pure.parent/'en'/pure.name).as_posix()
        entries[path]={'path':path,'bytes':len(text.encode()),'encoding_state':'UTF8','chinese_characters':len(re.findall(r'[\u4e00-\u9fff]',prose)),'english_words':len(re.findall(r'\b[A-Za-z]{3,}\b',prose)),'paired_path':peer,'language_presence':'PAIR_PRESENT'}
    inventory['entries']=sorted(entries.values(),key=lambda e:e['path']);inventory['markdown_count']=len(entries);inventory['total_bytes']=sum(e['bytes'] for e in entries.values());write(inventory_path,json.dumps(inventory,ensure_ascii=False,indent=2))
    subprocess.run([sys.executable,'mission-book/tools/sync_documentation_navigation.py'],check=True)
    for path,data in frozen.items():
        if (ROOT/path).read_bytes()!=data: raise ValueError('protected active/completed data changed: '+path)
    verify()

def verify():
    manifest=json.loads(read(PCF+'/PROGRAMME_MANIFEST.json'));items=manifest['workbooks'];ids=[i['id'] for i in items]
    if len(ids)!=29 or len(set(ids))!=29: raise ValueError('wrong/duplicate planned membership')
    if sum(i['release_train']=='CORE_V1' for i in items)!=23: raise ValueError('wrong core count')
    graph={i['id']:i['planned_dependencies']+i['external_dependencies'] for i in items};validate_graph(graph)
    for item in items:
        path=PCF+'/'+item['path'];text=read(path);assert_parked(text)
        if field(text,'development_baseline_sha')!='null' or json.loads(field(text,'dependency_source_shas')): raise ValueError('execution anchor materialized')
        if set(json.loads(field(text,'dependency_source_workbooks')))!=set(graph[item['id']]): raise ValueError('DAG/frontmatter mismatch: '+item['id'])
        if read(PCF+'/en/'+item['path']).startswith('---\n'): raise ValueError('mirror has executable frontmatter')
    ledger=json.loads(read(PCF+'/MIGRATION_MANIFEST.json'))
    if len(ledger['transfers'])!=7: raise ValueError('missing migration')
    for r in ledger['transfers']:
        for key in ('source_path','source_readme','destination_readme'):
            if r['id'] not in read(r[key]): raise ValueError('migration history absent: '+r[key])
        for dest in r['destination_workbooks']:
            if dest not in ids: raise ValueError('migration target missing')
    allowed=(PCF+'/',URA+'/',DGX+'/',FR+'/','mission-book/mission-group/README.md','mission-book/PARKED_PROGRAMMES.md','mission-book/en/PARKED_PROGRAMMES.md','docs/DOCUMENTATION_INVENTORY.json')
    paths=subprocess.check_output(['git','diff','--name-only',BASE],text=True).splitlines()
    for p in paths:
        if p.startswith('.pcf-maintenance/') or p=='.github/workflows/pcf-plan-maintenance.yml': continue
        if not any(p.startswith(prefix) for prefix in allowed): raise ValueError('out-of-scope modification: '+p)
    for prefix in (URA,DGX):
        for p in (ROOT/prefix).glob('*.md'):
            if p.read_text().startswith('---\n'): assert_parked(p.read_text())
    print('PCF planning verification PASS:29 workbooks,23 core,6 optional,7 transfers,acyclic DAG,all parked,source/destination ownership recorded')
if __name__=='__main__':
    if sys.argv[1:]==['--verify']: verify()
    elif sys.argv[1:]==['--apply']: apply()
    else: raise SystemExit('Use --apply or --verify')
