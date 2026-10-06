# WBC-602 相反主机独立发现

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；保留历史失败、未知边界和原证据，不新增验收。

审核者Alien-codex／MERA-ALIANWARE，开发者Mech／MEGA-REP。独立验证原c312a60b4d73f02597bde1f106372b253067fe33及原CI37206331839成功。纠正d99101fdac5169aad74ae84fb7c0c25be43ad7d9已推，CI37211820065当时进行中。无WBC601同系列合并或REX802导入。

独立根测试：原13/13通过；五新对抗修复前5/5失败，修复后连原18/18通过。技术批评另发现构造器不一致，新红后19/19通过。这些是根物理审核观测；同主机子代理批评仅附加技术审核。

| 发现 | 重现 | 纠正 |
|---|---|---|
| P2未知硬件 | 无GPU数据投成NODE_REPORTS_NONE/UNSUPPORTED，缺网络投false | 没明确硬件报告则UNKNOWN/null；活性提示用规范online实测旗标 |
| P2需求匹配 | Windows满足linux限制，GPU实测0满足加速器 | PLATFORM_MISMATCH/PLATFORM_UNKNOWN、ACCELERATOR_UNAVAILABLE与UNKNOWN分开 |
| P2畸形需求 | 字符串拆成能力字符，null抛无类型异常 | 有界字符串数组／支持的最低值映射／类型INVALID_REQUIREMENTS |
| P2忙时就绪 | 已分配worker acceptingWork仍true而claim返回null | 用规范非终态已分配任务、ENDPOINT_BUSY，不重写调度器 |
| P2声明角色丢失 | HTTP注册丢EXECUTION_NODE+VALIDATION_NODE，重启不可恢复 | 验证可选worker角色词汇及真实worker EXEC、在规范记录持久化、忽略角色时保留旧重连 |
| P2构造器角色不变量 | 字符串／空roles静默成为执行身份，工厂生成validator不接受的descriptor | 拒明确畸形数组，从有效角色推导省略执行旗标，强制旗标／角色一致 |

与独立接受基线0e9bea3ce739b979e582a428af8fb233045a5e75的受控真实Gateway HTTP比较：启动／旧任务claim/report／错误持有者／进度／完成／严格离线／正确持有者／未知目标／取消10/10等价。最终构造器修正前较广专项34/34；后19/19并重跑HTTP10/10。双语事实检查SYNCHRONIZED。收据utopia:evidence/raw/mission-book/WBC-602/review-receipt.json。不声称新分布式硬件或GPU性能；可选声明验证角色不从Windows/Alien/Mech名推断主机认证或权限。

城市PRIMARY/MEMBER归属与执行能力角色分开，此纠正不任命或迁移主城代理。用户未来City代理选择另跟CITY-ROLE-20261005。

精确最终CI和能力注册协调前扣留正式PASS／终止标记，merge_authority=false。

语言配对 / Language pair: [English](../REVIEW_FINDINGS.md) · [中文](./REVIEW_FINDINGS.md)
