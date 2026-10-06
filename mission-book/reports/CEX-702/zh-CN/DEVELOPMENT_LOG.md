# CEX-702 开发日志

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书／状态。保留原报告历史事实及未观测边界；不新增验收。

Alien-codex，2026-10-05。基线0e9bea3ce739b979e582a428af8fb233045a5e75；计划提交120244712c608ec065b0c0c00c0ab41504c81cef。开发仍IN_PROGRESS；未提交候选未验收／部署。

- 选择：在冻结调度DTO旁增加版本化userChoices元数据。客户端显示后端选择并经既有switch-declined提交明确ALTERNATE_DEVICE，不在本地排序设备；通用CONFIRM仍禁用。
- 发现：候选资格缺规范sharingEnabled=false；修正启用条件，停止分享的设备不得作为新替代。
- 防护：修改前拒绝过期revision、strict-target冲突、无合格替代。重复已接受替代意图不得新增事件／转移。旧空body switch-declined保持兼容。
- Web生命周期：导航／重渲染保留pending，按凭据／City上下文隔离回调。原生：pending提升至导航以上，仅client／City变时销毁回调防护。
- 实测：真实本地Gateway＋浏览器＋文件系统worker测试将一WAIT任务转到B、完成，并在原Web显示结果。其余拒strict／无替代／过期／离线／撤销分享。三新测试PASS；既有调度／Android对等／动作／handoff47／47 PASS。
- 原生parser测试先因SchedulerChoice不存在失败；后续单测／构建成功。Android在线替代交互与多物理主机资源执行NOT_RUN。
- 保留失败：首次浏览器缺翻译键（2／3），修复重跑3／3。Python WindowsApps别名未执行编辑，检查文件未变，再用明确Node／apply_patch修正。Shell大括号展开与PowerShell不兼容，不据此推断产品。
- City角色：执行设备选择不任命／迁移主要代理。用户主要代理指定仍待定；加入仅降本地主机角色，远端primary不变。
- 研究：worker输出为功能证据，不是吞吐基准。token／上下文窗口数量、干预时间、物理网络性能未另测则NOT_OBSERVABLE。本地技术评审已请求；不同物理主机Formal Review待定。

- 最终源码3d233ff39d1e96b8a590b12f520f98c283356f25已推送，PR19开启。技术评审复现legacy-decline错误explicit replay，改为单独持久化已接受明确revision，保留新红／绿案例。最终53／53，原生82单测／构建；原生pending提升导航以上、完整任务ID折叠。候选Registry已创建；精确托管CI与Formal Review待定。

语言配对 / Language pair: [English](../DEVELOPMENT_LOG.md) · [中文](./DEVELOPMENT_LOG.md)
