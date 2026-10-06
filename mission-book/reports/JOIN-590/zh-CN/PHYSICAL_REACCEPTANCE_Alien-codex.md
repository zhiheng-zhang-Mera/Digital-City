# JOIN-590 Android真机延续 — 2026-10-05

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；保留历史失败与缺口，不以随后进展替代原证据。

固定源b91677d1478950feb79742f618d0c981773d5bb7，审核Alien-codex／MERA-ALIANWARE。ADB真机BICIPVNB5HS85H9T、PERM00、Wi-Fi172.31.3.18/16。Mech公开join/info现于http://172.31.12.151:4391报City031fdba6-e94c-4298-a095-6ff04a65481d；Alien仍e1d87b2a-0ec5-457e-822b-91d81e40dc67。是同LAN真机，不是跨区或双NAT证据，公开descriptor未独立确定Mech服务版本。

## 构建与夹具身份

固定源assembleDebug/testDebugUnitTest BUILD SUCCESSFUL，XML85个无失败错误。默认ID APK SHA256 63770d17ae071812d6fdf11d0f63bef42adb1dee642476d54abb357f42a6c07e更新安装因旧签名异而INSTALL_FAILED_UPDATE_INCOMPATIBLE。原APK／私有prefs/files已备份不印秘密。原APK哈希a03b276741a09cb4f94699e282e76e20d02e9bda1b929ba94b2055e6f87c2a24，源码未知，不由versionName0.3.2推断。

保留原应用，临时隔离applicationId city.utopia.control.join590review。未跟踪Gradle init通过androidComponents.finalizeDsl只改ID，产品源仍固定。首init projectsEvaluated太晚失败，纠正后构建成功；装隔离APK哈希78e28b9565a967c7eae7d347944e2258e7f5748682aeeea79b10c69b8f6fc87d。厂商安装确认经可见按钮，测试通知权限拒绝。ID差是明确夹具条件，不证明生产包升级兼容。

## 观测用户路径

新隔离应用→Welcome→CODE→Mech URL→relay。短码空时Connect over relay禁用，实际UI XML clickable enabled=false，独立重现REVIEW_REPORT的R4。六占位数字启用但不参加relay审批。后UI仍输入长度6，此有界运行未见自动清除，不裁定所有旧短码时序。

真实手机到join-4d2e2617ba审批等待。原生pairing-events relayasking2026-10-05T09:38:13.731281Z、relaywaiting09:38:13.752777Z（Sydney20:38），只描述本面事件，不推协议延迟。UI截图等待Owner批准，无用户可选入网名称，仅Android型号。

向可信Mech面操作员请求审批，审核者没有该精确City Owner凭据。原应用备份指http://172.31.12.151:4401，当前不可达，凭据未发4391或其他origin。未虚构审批／拒绝／重启／撤销／提权。

## 证据与当前门边界

本地D:/Utopia-JOIN590-Review/.runtime/evidence/JOIN590-device，Private-original.tar和原APK仅本地。脱敏UI及公开截图哈希：

- relay-blank-code.xml：52edfc1f0ff8333c6b8f5e71579a74e963dc6eb8599c191d918854dd7e802220
- mech-approval-pending.xml：576c2fc35fb4105c7e34c24c7f838a8cdbd27c4dd84bb6a71c780e3102fece1b
- mech-pending.png：ef4472f13829b1fd44f58eb274b85ce175a08b67eb944284c59280d6d0676910

手机创建请求／可达Mech relay OBSERVED。审批后成员会话、持久注册、重启重连、定向撤销拒绝、Windows成员降级、跨面CHECKPOINT_DEMO均NOT_RUN/PENDING_OWNER_DECISION。旧受控relay Owner凭据缺陷修复重验前仍阻塞，等审批不能解。正式审核未完、标记扣留。

最终客户端180秒内未观察审批，UI RELAY_APPROVAL_TIMEOUT，原生retry2026-10-05T09:41:14.844430Z（20:41）。是未完成窗口非Owner故意拒。UI超时并残留等待文案，旧进度披露。保留超时XML和事件后停仅隔离应用，重开原应用，原city-connection prefs与备份逐字同。未停既有City/worker、未印token；无协调Owner窗口不发新尝试。新流程需新请求，单批准旧id不会恢复已闭手机pipe。

语言配对 / Language pair: [English](../PHYSICAL_REACCEPTANCE_Alien-codex.md) · [中文](./PHYSICAL_REACCEPTANCE_Alien-codex.md)
