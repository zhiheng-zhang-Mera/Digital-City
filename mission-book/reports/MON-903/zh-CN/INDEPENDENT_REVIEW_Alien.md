# MON-903 Alien 独立审核

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态记录；保留历史、失败和未知边界。

Mech 作者精确目标 `78bdd9dc873ebc257aedecf421068a1387dbec82`；相反主机审核者 Alien（MERA-ALIANWARE）。原始基线25/26通过。失败的并发路由测试忽略实际 FIFO 领取，报告调用者自己创建的任务，正确被403拒绝。现在遵循领取身份并断言 RUNNING 报告成功，没有弱化产品鉴权守卫。

八个独立红色探针重现：解析器 Owner 动作误计自动解决；observe 绕过 close；UUID 排序裁掉最新收据；队列满时丢规范证据及持久化失败；规范在线但不合资格的目标丢状态；critic 成功丢弃先前超时指标；轮询关闭已打开来源并保留恢复后的错误；不可用存储不可见。第九探针证明高频城市渲染使两秒决策轮询饥饿。第十独立探针驱动实际 Gateway Action→在线但不合资格的严格目标→规范 TASK_TARGET_WAITING→Owner-required 收据，任务仍 QUEUED。

修复后36个专项探针全部通过（26个原始／依赖＋10独立）。同主机技术 critic 独立10/10，无重要剩余阻塞；这是技术批评，不是物理主机审核。Alien 本身与作者 Mech 为相反主机。

修复源 `a7f9ef71658d7ac6831fc68d8963c49e8c8cb180`；发布源／证据头 `db6bfb211064e55c15c5d60ae475272abfaaf7f1`，分支 review/MON-903-Alien-20261006，[PR35](https://github.com/zhiheng-zhang-Mera/utopia/pull/35)。保留作者 PR32。产品 evidence/raw/mission-book/MON-903/alien-review/ 保存基线／红／绿／饥饿日志、规范运行 JSON、截图。捕获两条观测决策，其中一条需 Owner，真实规范任务仍 FAILED：建议没有应用。脚本 scripts/mon903-review-capture.mjs，双语审核文档同步。

当时最终精确头 CI PENDING：push37415280676、PR37415286400、linkage37415286330，终态前扣留正式接受。广泛本地套件在未变产品源运行。不声称真实生产解析器／供应商或隐藏推理，注入解析器测试只是有界夹具。提交收据引用可经规范 MONITOR_DECISION_REQUESTED.decisionId 逆向关联，不虚构缺失事件引用。Android 原生／实物同等能力留给 MON-990，未合 main。

## CI 证伪与新审核头

db6bfb2 的 push 成功但 PR37415286400 在继承的 Services 导航失败：延迟调用使重建编辑器残留 RUNNING。确定性的双请求探针重现实际状态泄漏及旧清理清掉新 busy 状态。源 `08952928cddd620f1d65c08668a470b7bab2c134` 修复、重捕真实运行并保留失败 CI／红／绿日志。新发布头 `9eb8275bddaef10db60449308d22442c8c8b605f`；push37415913038／PR37415916197／linkage37415916421 当时待定。技术 critic 通过独立导航探针，无重要阻塞。早先1378全通过属于 Services 修复前源，最新受影响审核套件独立重跑。修正无效 JAVA_HOME 后本地 Android SDK36/JDK17 基线测试／构建 SUCCESS，保留初始环境失败。早先绿色 push 或全套运行均不接受新头。

## 第二次 CI 证伪与最终候选

9eb8275 的 PR37415916197 在继承 Research 草稿重连失败：错误把连接代次当作新凭据／城市上下文。独立真实浏览器离线／重连探针重现草稿丢失。修复源 `ae73d9d0d82ee03a29ec8d783405aa82002934fa` 以实际令牌＋城市作为草稿键，并用视图／连接 epoch 隔离在途工作。重建根释放 busy，旧晚到请求不能影响新操作；真正换凭据仍清草稿。critic 通过独立探针且无重要阻塞，保留失败托管日志和红／绿探针。

最终候选 `5b7138956ec0eb78229835b4bc3fc147ce0749d1`、PR35；此精确头受影响套件42通过/0失败。针对源 ae73d9d 更新运行捕获，证据提交不改源。push37416647955／PR37416651611 当时 PENDING，linkage37416651614 SUCCESS。Android 托管作业通过不等于全工作流接受，旧头绿色 CI 不能接受此头。

## Mech 同系列发现与有界执行

Mech 发布可采纳审核联合10a020c，四项额外发现：丢弃失败计数、队列满未测延迟、截断指标范围、仅触发事件的窗口范围。对5b71389独立执行六新探针有五失败，在联合头六个全部通过，完整受影响集合46通过。采纳双方修复，未替换规范证据或 Owner 动作分类。

5b71389 的 PR37416651611 又有两可见性等待失败（重载后配对、历史初始 ONLINE），两文件单独6/6。文件并发现在限2，保留全部检查／断言，当时全套及托管结果待定。源 b76adfeb94cbfbbe233a93c3d29261dfc00bfdfa；刷新捕获，最终候选3cd32c60d8e9beb9df961e6b7ff193a3f69ec224。不由旧头或单独运行推断接受。

最终精确头 CI 当时 push37417270815／PR37417276076 PENDING，linkage37417276063 SUCCESS。技术 critic 独立通过双方探针16/16，无重要联合阻塞；历史产品修复及新指标诚实均保留。

## 最终门 PASS

接受精确头 `3cd32c60d8e9beb9df961e6b7ff193a3f69ec224`：push37417270815、PR37417276076、linkage37417276063 终态 SUCCESS。PR35 CLEAN/MERGEABLE，独立核验远端头匹配及本地工作树干净。本地限并发全套1386通过／0失败／0跳过；证据提交不改最新源。Alien 与作者 Mech 相反主机。CAP-MON-003 在精确接受头完成注册协调。MON903_DECISION_OVERLAY_REVIEW_ACCEPTED 仅接受本任务阶段；原生同等能力及 programme 冻结仍属 MON-990。未合产品 main。

语言配对 / Language pair: [English](../INDEPENDENT_REVIEW_Alien.md) · [中文](./INDEPENDENT_REVIEW_Alien.md)
