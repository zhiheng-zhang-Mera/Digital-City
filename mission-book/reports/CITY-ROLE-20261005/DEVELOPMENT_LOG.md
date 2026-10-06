# City 角色与设备列表开发日志

- 日期：2026-10-05；记录人：Alien-codex。
- 用户问题：连接成功后设备列表未正确表达同城多主机；本机应置顶，其余设备按入网名称显示。存在同主机重复 City 的历史现象。
- 角色要求：主城代理不得固定绑定 Alien 或其他设备；后续由用户选择。未加入其他城市的新主机默认拥有自己的主城；成功加入后仅本机变为成员，目标网络原有主城保持不变。失败或未获批准不得降级。
- 已入网主机重启应恢复成员身份，避免再次启动独立主城；每台主机最多运行一个 City。
- 当前调查：已合入本机降级与成员角色持久化代码；需要核查安装版本、设备列表与角色显示一致性，不能仅因代码存在就判定现场问题已解决。
- 修复顺序：复验角色隔离；定位设备列表身份映射；检查入网命名和默认名称；验证通信和现有计算资源入口。代理指定/迁移的权限与生命周期另需明确实现，不能把设备标签变更当作主城迁移。
- 实验状态：本次复验尚未运行；真实多物理主机验证 NOT_RUN；不宣称性能提升或跨地区远程登录已验证。

## 本次复验结果
- 检验源代码：Utopia `3bab6bdc78c18467645f3fb88272dab7a86f8a0d`（已合入 main 的修复分支）。
- 命令：`node --test tests/host-member-role.test.mjs tests/city-members.test.mjs tests/city-members-ui.test.mjs`；结果 11/11 PASS。
- 观察：成功入网仅关闭本机旧 Gateway/worker，目标主城保留 PRIMARY；失败或本地任务繁忙时不降级；成员角色重启持久化；同城设备按入网名称显示且本机置顶；成员消息带接收回执；另一成员实际执行测试任务，关闭共享与撤销后停止领取。
- 边界：以上是本机受控网关/浏览器/worker 测试，不能替代双物理主机实测，也未验证主城代理用户指定或运行中迁移。
- 当前差距：默认主城和本机降级已有实现；“用户后续指定主城代理”尚不能据此声明完成。需要把指定、授权与代理生命周期作为独立功能处理，避免影响当前网络主城。

## 设备执行入口修复进展
- CEX-702 正在开发：把现有后端 switch-declined → 另一设备 handoff 链路做成 Web/Android 明确用户选择，禁止客户端自行排序设备。
- 已发现并修复候选计算设备忽略“停止共享”的判断；拒绝指定设备任务的冲突切换、过期决策及无可用设备，保持原有主城角色不变。
- 受控网关/浏览器/worker 三项测试通过，实际任务由 B 完成并回到原 Web 页面；47 项旧调度兼容测试通过。未部署到安装版；双物理主机验证、主城代理用户指定仍 NOT_RUN/待实现。
- 详细问题与判断见 ../CEX-702/DEVELOPMENT_LOG.md。后续仍需精确 SHA/CI、能力注册与异主机正式审查。

## Android 成员管理候选
- CEX-705 / PR21，精确源 de9185a4ef8d761053c88316ec9efeca037239fb：同城所有成员按入网名称显示，已入网本机置顶；成员在线、计算在线与资源共享分别显示。加入同城不会改写目标主城角色。
- 87 Android 单元测试/构建与 8 项最终后端测试通过。OPPO 已观察本机置顶、另一成员名称及原生消息确认后的服务端 RECEIVED；另一成员为同主机受控程序，双物理主机 NOT_RUN。
- 安装列表权限要求 City、安装及设备绑定一致，拒绝缺失/重复身份。Owner 控制表示城市主机权限，不冒充手机本机身份。技术审查两项问题已回归修复。
- CI37218345150 仍进行中；异机正式审查待办。原生重命名、撤销、共享切换和发送的真机验证仍待完成。现场应用/私人连接已恢复，运行中 City 未变更。
- 后期用户指定/迁移主城代理仍待独立实现，不将本次显示或执行选择描述为已完成迁移。

## 成员管理真机补测
- 精确 CEX705 源 de9185a4ef8d761053c88316ec9efeca037239fb / APK a13b0727b225c9aa20c16defc0b4ed89cfd90da739969974156ccb657bec07ae；不改源码、不替换已验证 CI 身份。
- OPPO 原生操作已观察共享暂停/开启、发送消息及确认接收显示、Session 重启身份保持、只管理本机且重命名按钮禁用、自撤销后旧会话401、Owner 重命名与撤销另一安装。重命名未改变 PRIMARY 角色；没有指定/迁移代理。
- 原来对应动作的 NOT_RUN 仅在补测观察范围内更新；详情及原始 UI 哈希见 ../CEX-705/PHYSICAL_FOLLOWUP.json。同主机逻辑成员/计算广告不能充当双物理主机或 Android 算力执行证据。恢复原应用与私人连接，运行中 City 未变更。

2026-10-05: City-neutral pairing lockout wording PR23 merged at d3262ce after exact-head attempt2 and PR checks success; attempt1 timeout retained with unresolved full-suite timing attribution. Main CI pending. CEX703 native catalog physical defect logged before repair; full-width title/short status/full reason fixed and OPPO selection remains no-task. Primary default/self-only demotion semantics unchanged; future user-appointed primary migration remains NOT_IMPLEMENTED, rename does not appoint an agent.

Role boundary revalidated at exact pointfix sourcea7d6f2a9b97e02d5fd10adf3a73eafb4a5f3ef6e: host-member-role + city-members + city-members-ui 11/11 PASS. Observed controlled native production local Gateway/worker retirement and target PRIMARY preservation; restart keeps MEMBER/original City pointer. This is controlled integration evidence, not double-physical-host acceptance.

PR23 merged-main d3262ce2dd81e51a53e39e6f9add8dee650a7682 CI37222674520 terminal SUCCESS. Sourcea7d6f2a is retained by verified cloud archive tag; remote head removed with exact-SHA lease after ancestry verification. CEX703 source478d486 exact CI and all PR checks SUCCESS; opposite physical-host Formal Review remains pending.

语言配对 / Language pair: [原文 / Source](./DEVELOPMENT_LOG.md) · [译本 / Translation](./en/DEVELOPMENT_LOG.md)
