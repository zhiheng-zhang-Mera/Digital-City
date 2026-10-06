# CEX-705 论文素材

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书／状态；保留历史与未观测边界，不新增验收。

精确源 `de9185a4ef8d761053c88316ec9efeca037239fb`，计划 `56f3e50088982fba0d47fbb3e42c1c12acd24a5e`，已接受基线 `0e9bea3ce739b979e582a428af8fb233045a5e75`。PR21、托管37218345150 IN_PROGRESS。无正式验收或终端标记。

产品改动：原生Settings有范围身份／installations／改名／撤销；Devices按准入名City人口、绑定自身置顶、member／compute状态区分、合法自身分享；明确消息／回执。服务器权威；owner/control与enrolled session分离；client拒City／installation／device不匹配和畸形人口。回调防护属于提升的client／City连接生命周期而非panel mount。不确定网络发送警告、不自动重发。

观察：Android87单测／构建、8定向规范测试通过；精确APK绑定OPPO自身置顶／peer名／消息回执smoke。实体SHA256 `a13b0727b225c9aa20c16defc0b4ed89cfd90da739969974156ccb657bec07ae`。两实体主机、原生改名／撤销／分享／发送／重连NOT_RUN。无实测延迟／性能；对等缺口数／token／上下文null。不得把模拟广告变实际Android计算。

Utopia回执／演进保留失败：缺投影模型、畸形人口、跨City／畸形enrollment、同installation／错误device权威红色。最后绑定回归7测试／1失败在修复前。最终评审独立读修正源，无实际实体Formal Review。回执utopia:evidence/raw/mission-book/CEX-705/development-receipt.json；演进utopia:data-records/evolution/mission-book/CEX-705/events.jsonl；用法utopia:docs/NATIVE_MEMBER_MANAGEMENT.md。临时私有凭据不入Git。

问题／选择：Owner control的currentMemberRef不能识别实体手机，用enrolled规范绑定标本机、明确Owner City-host actor。畸形人口应不可用而非健康空。UI权威需City＋installation＋device一致，后端终权威。主要代理任命是另待定生命周期功能，不从改名／执行节点选择推断。

闭环：独立重读37218345150在精确de9185a4ef8d761053c88316ec9efeca037239fb COMPLETED SUCCESS。开发完成，status IN_PROGRESS、review_complete=false、merge_authority=false。对侧Formal Review及实体缺口仍有，无终端。

后续PHYSICAL_FOLLOWUP.json保留同源／APK并增实测原生改名、自身分享、发送／回执显示、自身／Owner撤销、保存session进程重启。原生session改名阻塞（按钮父enabled=false，子TextView独enabled=true非权威）。自撤销旧fixture session401；Owner撤B规范RETIRED、Owner ONLINE。仅选定NOT_RUN取代；两实体Windows、无token Windows installation刷新、对侧Formal Review仍未观察。无加速／时间主张。fixture和私有恢复有界索引，未提交凭据／原XML。

## 对侧物理主机评审扩展（Mech，MEGA-REP，真机）

以上作者陈述历史保留，两点取代。

不同物理主机Mech在精确de9185a4ef8d761053c88316ec9efeca037239fb Formal Review PASS，OPPO PERM00／BICIPVNB5HS85H9T、Android12，对评审自启City九场景：Owner双界面可达；Owner改名规范真值及Web标题；session UI禁字段、输入不变，服务器403 Only the City owner can rename the City；自撤销退役installation、回Find your City、shared_prefs清token、旧凭据401 SESSION_UNKNOWN；cross-revoke有范围列表／服务器403 SESSION_CANNOT_REVOKE_OTHER，targets仍BOUND；仅caller自身node分享，规范sharingEnabled翻转，无他node控件；消息／回执忽略SPOOFED senderDeviceId而用认证actor，PENDING→RECEIVED带receivedAt，无关成员不可见，重复回执不改时间；重连RECONNECTING明确非live缓存，再渲全规范members，无过期installation；Web／Android／规范对City名、成员身份／角色、分享标志一致。crash空，14785 logcat中FATAL EXCEPTION／ANR匹配0，进程活。秘密扫描无session／token匹配，配对token掩码，身份仅deviceId／nodeId。非手机：真实Android请求形状七探针utopia tests/cex705-mech-review-authority.test.mjs7／7，review/CEX-705-mech-review at e0b2006；本机Android87／87。

取代一：开发回执physical_not_run过期，同日PHYSICAL_FOLLOWUP记改名、分享、自身／他撤销、发送OBSERVED，独立矩阵确认。仅两物理主机真正未跑，两记录保留历史。

取代二：必需对等缺口数／消息延迟原null由评审提供：工作书六项Web有Android缺全从Android client路由可达；延迟发送往返6ms、recipient可见9ms、回执往返7ms、规范created→received9ms，范围一主机本地City，非性能主张。

F1 MEDIUM唯一跨界面差：共享成员投影可报CONNECTED，但自身node离线；规范members[host].online true、computeOnline false，对nodes[host].online false。members.mjs种primary行online true、合prior.online OR n.online永不能修正。Android忠实渲输入非app错；members.mjs不在diff，是新界面暴露既有缺陷非回归。最小修：nodeId=deviceId时从node导online，或null，app已渲未报告。

F2 LOW分享成功提示无条件；primary行sharingEnabled默认false、无node行会显示404 toggle，潜在未到fixture。F3 INFORMATIONAL Owner自身分享控件依赖hostDeviceId=nodeId，canToggleSharing要求nodeId=actorRef，primary仅注册此node后得nodeId；直接双向验证，门禁正确、可达依配置。F4 LOW缺21模板字段含全exposure／capability，CAP-CITY-MEMBERS-NATIVE-001已存在；评审回填，歧义G2排除而非发明。

限制：仅一手机，无第二实体手机；其他成员为真实City成员、真实session HTTP。Web未作为enrolled session驱动；无soak／rotation／低内存测试。带限制释放ANDROID_MEMBER_DEVICE_MANAGEMENT_PARITY_ACCEPTED。见 [REVIEW_REPORT.md](./REVIEW_REPORT.md)。

语言配对 / Language pair: [English](../PAPER_MATERIAL_INDEX.md) · [中文](./PAPER_MATERIAL_INDEX.md)
