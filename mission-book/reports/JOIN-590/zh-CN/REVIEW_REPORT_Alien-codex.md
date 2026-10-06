# JOIN-590 — 相反主机再接受：DEFECTS／实物门NOT_RUN

> 阅读译本 / Reading translation：仅供阅读，不是第二份权威工作书或状态；保留历史失败与缺口，不以随后进展替代原证据。

Alien-codex真实MERA-ALIANWARE，开发Mech MEGA-REP。固定审核b91677d1478950feb79742f618d0c981773d5bb7、隔离D:/Utopia-JOIN590-Review、review/JOIN-590-Alien-codex。新工作书取代旧请求d3262ce目标，旧基线实证不转移新产品。独立观测V0.2 37259528163 COMPLETED SUCCESS且完整SHA同。

## R1 — P1：Android relay仍回退Owner token，非持久成员安装

OBSERVED_HEAD b91677d1478950feb79742f618d0c981773d5bb7。实际本地Gateway用RelayPairing同request/exchange体，返回夹具Owner凭据、创建0安装，返回凭据可mint Owner配对session200。仅输出布尔／状态无秘密；是受控协议、非手机实测或无鉴权攻击。

复现把independent-review-probe.mjs放固定checkout .runtime/join590-independent-review.mjs、附现依赖、node运行，只启动关闭自己临时Gateway。approved200/exchange200/receivedOwnerCredential true/enrollmentPresent false/installationCount0/ownerSessionMint200。仪器SHA256 20b3618e7b2854027d10dd54f2405f672d7ff4505887a2545801fe4c9e35baf6。

根因exchangeNow仅requestId/claim无installation，server返回legacy join.exchange Owner凭据；MainActivity仅存host/token/cityId。入场installationId不等注册。后端session/enrollment测试通过不证明客户端使用。

契约要求实际Android持久成员／无手填token重连／按安装撤销，持久Owner token复用不能证明。最小修复：规范安装元数据交换、私存持久凭据、结果成员session、内部续期、退休拒绝，真正Owner保控制；实测审批／重启／撤销，不扩权、不混入场提示与注册。

## R2 — P1：双NAT可达声明无网络路径

RelayDial.socketUrl直接ws(s)://City-host:port/api/v0/relay，target就是用户地址，七变更文件无公开汇合／City外连注册／tunnel broker／穿透。不能路由到City设备仍不能建初socket，但PairingPanel及注释声称双方不可拨也可。

应披露只可达City relay，真正跨网需明确可达中介／隧道及真实分网验证，仅改标签不能交付远程需求；端到端工作前不完整，本审核没跑NAT活动。

## R3 — P1：安全输入拨号丢TLS

target https://example.test:443仅返回host/port，joinViaApproval dial没secure默认false，socketUrl ws://...443经OkHttp成http；wss同失标志。秘密交换不得静默降显式安全目的。这是确定源追踪非抓包／手机观测。

最小边界：解析→拨号→规范存储→重连全保scheme/security，不支持明确拒非明文回退。原PairingProtocol endpoint仅HTTP，单secure旗标不查存host重连不足。

## R4 — P2：审批要求没用短码

PairingPanel进relayMode前拒ownerCode空且按钮需非空，RelayPairing审批不带短码。用户需无关字符才请求，违背请求等待流程。分开审批与直接短码前提：审批有效地址及入网名称、不需闲码，显示并存用户名称非仅Build.MODEL，实际交互核验。

## R5 — P2：历史请求CI／证据错绑

独立解析37205444427/linkage37205444385为0e9bea3ce739b979e582a428af8fb233045a5e75，非REVIEW_REQUEST声称d3262ce。当前b91677d CI37259528163正确绿。保历史错误、纠权威引用，旧绿不代目标。EVIDENCE_POINTER_MISMATCH。

## 当前验证与剩余实物工作

Gateway4/4、未改relay tunnel＋enrollment＋short-code23/23；独立实际relay确认R1。checkout精确源、未产品修／停生产。adb无设备；Mech4391四秒超时，Alien172.31.3.110:4391公开e1d87b2a-0ec5-457e-822b-91d81e40dc67。超时仅当前不可达，不证Mech停。

本审核审批后重连、同City重启、定向撤销、跨面CHECKPOINT_DEMO、暴露、main收尾NOT_RUN。开发旧实物证据保留不升独立。FAIL/PENDING_REPAIR、review_complete false、标记扣留，需修精确源＋手机＋可达Mech。

新真机延续取代初可用性观测：窗口3审批ONLINE、app重开无输入、native/Web/规范任务比较，见 [PHYSICAL_WINDOW3](./PHYSICAL_WINDOW3_Alien-codex.md)，不解持久注册／退休／City重启。原发现仍在。原快照纠正到Utopia证据ddf7e1aa0d0978f80bf1357306378c8595fe58f7，见 [证据索引](../evidence/README.md)。

直接纠正取代旧“未产品修”：ec3b6f996240ca71505b3b67af12cc222d1b283a修成员／TLS／审批前提／Owner码权限，精确干净CI通过。见 [修补报告](../REPAIR_REPORT_Alien-codex.md)。窗口5批准后实际Mech缺cityId入网拒，代码修不等部署产品接受，review_complete仍false。

语言配对 / Language pair: [English](../REVIEW_REPORT_Alien-codex.md) · [中文](./REVIEW_REPORT_Alien-codex.md)
