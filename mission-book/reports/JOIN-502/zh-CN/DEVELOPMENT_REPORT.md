# JOIN-502——开发报告

阅读译本 / Reading translation：完整历史阅读译本，不构成第二份权威任务或验收记录，原状态及延期边界保留。

> 工作簿：[JOIN-502-nearby-pc-discovery-and-owner-approval.md](../../../finished/completed-2026-10-04/connection-onboarding-components/JOIN-502-nearby-pc-discovery-and-owner-approval.md)
> Programme：[connection-onboarding/README.md](../../../finished/completed-2026-10-06/connection-onboarding/README.md)
> 开发主机Mech，本机；审查明确留不同物理主机。
> 分支/头：join/JOIN-502-nearby-discovery-approval @`86deda9c2990c78d683a8c3515d251022df9d040`。
> Utopia main基线：`13109b4c206feb3c1a9107b369715e84af65eaf1`。
> 托管CI37119234473，在精确86deda9的V0.2 checks、gateway-web与android均COMPLETED SUCCESS。
> 状态开发完成，尚未终态接受；NEARBY_PC_JOIN_ACCEPTED还需异机审查。

## 1. 任务实际解决什么

缺口是批准衔接，而非discovery。写代码前实测：

- City已经通过mDNS发布：discovery.mjs发布_utopia-city._tcp及mdnsTxt()，RF-003 contracts/remote-local-discovery-v1/discovery.mjs已定义advertisement及normalized candidate。
- 产品已渲染这些诊断，pairingView显示discovery.mdns.state及discovery.ble.state。
- 但没有浏览service type的实现，没有请求加入或决定的能力。加入PC只能提供Owner界面生成的临时配对secret成功。

因此任务是第2节要求的integration/adapter/presentation，绝非第二discovery协议、trust store或device registry。

## 2. 实现内容

| 部件 | 文件 | 职责 |
|---|---|---|
| RF-003 browse半边 | services/dev-gateway/nearby.mjs | mDNS记录转契约自身advertisement，再normalizeCandidates，并读取各发现City权威身份 |
| 请求/批准状态机 | services/dev-gateway/join.mjs | PENDING→APPROVED→CONSUMED，REJECTED/EXPIRED终态；边界、持久化、claim绑定 |
| discovery adapter | apps/web/discovery.js | 纯normalisation、去重、双侧新鲜度、transport文案、软失败probe |
| 入网界面 | app.js、index.html、两语言包 | Nearby Cities、Request Join、等待/批准/拒绝状态、Owner批准卡 |
| 四公开/三认证路由 | server.mjs | join/info、request、status、exchange公开，加入PC尚无凭据；join/nearby浏览及决定路由认证 |

status/exchange是公开路由而非公开操作，都以requester自身claim secret为门禁。每个决定路由认证，因为control credential正用于决定谁加入。

## 3. 必须作出的选择及理由

指示要求工作簿未明确选项时择优，并记录问题、选择、理由。关键项如下。

### C-1——请求经URL fragment，不跨origin POST

问题：加入页发现不同origin，POST /api/v0/join/request跨origin。Gateway无CORS头，已有pairing exchange亦如此，浏览器拒绝。

选项：(a)给join路由加CORS；(b)加入PC自身City relay转发；(c)像已有#pair=一样把请求带至目标origin fragment。

选择(c)：(a)为了少一次导航，把City join永久开放给用户碰巧访问的任意网页，扩大攻击面。(b)自身City另持requester claim，形成第二进程第二份secret及批准到领取间TOCTOU缺口，本修改无法诚实验证。(c)复用已有受信任模式：fragment不发服务器，claim不进City日志；目标页面读取后立即清地址栏。

代价：一次导航，claim短暂位于目标City地址栏。

### C-2——同origin直接递送，不导航

实跑发现：页面已在http://host/时location.assign('http://host/#join=…')为同文档导航，页面不重载，boot不运行，请求静默未记录。首UI测试行未出现，列表空。

选择：发现endpoint等于location.origin时直接resumeJoin(...)；跨origin实际load仍用fragment传输。

### C-3——固定完整City id，向City读取

实跑发现：mdnsTxt发布city:d.cityId，但discovery服务名Utopia-前8字符，浏览器测试固定广告值导致接收City拒绝合法交接：“this join link names a different City”。前缀不是身份。

选项：(a)放宽前缀匹配；(b)从发现City能力endpoint读完整身份；(c)不固定City。

选择(b)：(a)弱化防止请求送错Owner的检查，8位hex不足安全匹配；(c)允许旧/篡改链接找错City批准。(b)每发现City多一次有界GET，identifyCity1500ms并行；不能答复则从列表丢弃，而非给出无法加入的目标。

### C-4——批准释放City已有control credential

刻意如此：工作簿身份边界禁止第二用户可见永久token、第二registry及MAC/IP信任身份。join/exchange返回City本已给控制界面的凭据，与粘贴token相同。无新类型；浏览器照旧sessionStorage保存，持久设备身份留JOIN-503。

### C-5——status轮询返回终态，而非HTTP错误

全套发现：所有read走授权lookup导致expired的status410，但轮询正用于得知过期。失败poll无法报告存在目的。拆分findByClaim授权操作（终态仍失败）与locate读取（不因终态失败）。拒绝仍失败，非自身claim403。

### C-6——拒绝要答复requester，保留claim digest

UI测试发现两层问题：reject清除digest，使requester下次poll错误提示自己的请求“belongs to another requester”，页面永不知拒绝。状态到页后又把所有失败报EXPIRED，拒绝显示“no longer valid”，虽事实正确但对人无用。修复让已决定请求返回决定而不释放任何材料，并以joinTerminalState映射终态。

### C-7——能力声明报告真实discovery状态

joinCapability原常量mdns:PUBLISHED、ble:ADVERTISE_ONLY。工作簿要求诚实不可用，故状态从Gateway传入。publisher失败的City现在在加入PC读取的唯一endpoint明确失败。

### C-8——不加CORS/第二browse路由，不触碰JOIN-501

join/nearby需认证，因为读取本City LAN视图。客户端为同origin页面，始终经launcher/invite取得凭据。第6节将JOIN-501 Owner规则设硬边界，因此不碰配对生成：pairingView、clearPairing、generate handler、pairing routes不变；测试实测browse+request+approve后pairing/info仍activeSession:false、pairingSessionId:null。

## 4. 实际运行发现的缺陷

以下四项由首端到端/浏览器运行发现，各已有测试或验收脚本断言：

1. 第二if链覆盖所有join路由的out，四路由实际正确执行却响应404。首脚本probe发现store已有行但路由404。
2. version check以!publicPairing为门禁，public join完全未检查version，页面能力调用随后409。现在仅pairing/info及exchange跳header，因为调用者已部署。
3. reject清claimDigest（C-6）与expired poll410（C-5）。
4. 第三方导航假设（C-2）及前缀当身份（C-3）。

## 5. 测试覆盖

根套件全部自动运行：node --test tests/*.test.mjs，在86deda9有1071测试、1071通过、0失败。

| 文件 | 攻击范围 |
|---|---|
| join502-nearby.test.mjs，8测试 | adapter按身份非地址去重、双侧新鲜度、无endpoint不提供、软失败probe、契约DEVICE_ID_REQUIRED拒绝、能力诚实 |
| join502-gateway.test.mjs，9测试 | approval gate、claim绑定一个requester、重复请求一张卡、永久拒绝、expired不能重新批准、pending数量上限、City重启决定持久、列表/snapshot/state/events secret扫描、规范event stream到第二界面批准 |
| join502-ui.test.mjs，2测试 | 真浏览器真页面：browse→不可信行→交接→pending→Owner卡→approve→加入页online；browse拒绝仍有fallback；reject使设备留City之外 |

第9节映射：无nearby时fallback可用（UI2）；discovery非trust（两者）；Request Join产生pending（gateway+UI）；reject不可信（gateway+UI）；approve规范路径（gateway+UI）；无隐藏配对生成（gateway用pairing/info实测）；重复/重放有界（gateway）。

pairing.test.mjs为唯一契约变化更新：mdnsTxt增加join:'1'，browse客户端仅广告即可判断City接受协议。

## 6. 本机真实主机验收

.runtime/join502-live-check.mjs未跟踪，City自身runtime目录；在本机真实LAN接口172.31.12.151进行真实mDNS发布/browse，不用loopback捷径。

```text
[live] cities-up: http://172.31.12.151:61770 and http://172.31.12.151:61773 on 172.31.12.151, discovery enabled on both
[live] browse: discovered 2 City/Cities: Utopia · Alien@…:61770#a40f0234-…, Utopia · Alien@…:61773#d9b8a872-…
[live] identity: peer http://172.31.12.151:61773 reported cityId d9b8a872-ffd5-4d28-abca-bde4a4a7647d
[live] gate-holds: request PENDING; exchange before approval -> HTTP 409
[live] approved: approve HTTP 200; exchange HTTP 200; credential authenticates -> HTTP 200, cityId d9b8a872-…
[live] spent: replay -> HTTP 410; final state CONSUMED
[live] secrets: requester claim or City credential present in the owner listing: false
{"ok": true, "lan": "172.31.12.151", …}
```

原块实测证明：真实LAN multicast发现两City；固定前读取完整身份；批准前409门禁成立；释放凭据实际/api/v0/city认证200且Cityid匹配；重放410的一次性领取；批准者视图无secret。

## 7. 本主机未建立的结论

- 未端到端驱动第二物理PC。第二City在本机LAN接口，网络真实、第二机器不存在。最低Alien+Mech拓扑仍延期到入口已要求该拓扑的阶段整合；deferred != passed。
- BLE：当前platform/windows/ble.mjs仅发布，没scanner，浏览器也不能扫描。UI如实说明，不伪造设备；发现City能力声明实际BLE状态。
- 持久身份：加入浏览器仍在sessionStorage持session凭据，重启不输入token属于JOIN-503。
- Windows关闭断言：同进程关闭两个mDNS Gateway，Node可在打印验收结果后出现libuv断言!(handle->flags & UV_HANDLE_CLOSING)、src/win/async.c；单City discovery关闭干净。原文判断为框架bonjour-service teardown竞争而非join缺陷，明确保留。
- 独立再验证：这些证据来自开发主机；CONSTRUCTION_RULES第3节需不同物理主机Formal Review，尚未发生。

## 8. 证据索引

| 项 | 位置 |
|---|---|
| 头86deda9 | join/JOIN-502-nearby-discovery-approval，已push且读取ls-remote |
| 精确头托管CI | 37119234473，gateway-web与android均completed/success |
| 提交树全套 | 1071测试/1071通过/0失败，main checkout读取且git diff 86deda9为空；裸工作树缺CI另行安装的city第三方依赖 |
| Live LAN验收 | 本报告第6节 |
| 观察回执 | [EVIDENCE_LIVE_LAN_ACCEPTANCE.md](./EVIDENCE_LIVE_LAN_ACCEPTANCE.md) |

## 9. 留阶段整合的衔接

1. 按第9节真实第二PC经LAN加入，Alien+Mech。
2. 加入安装在Devices视图作为enrolled node出现，属于JOIN-503，不在此伪造。
3. 对加入设备执行revoke，JOIN-503。
4. launcher不能打开第二本地City的平台fragment交接；fallback为QR/code/link/manual，均保留屏幕。

语言配对 / Language pair: [原文 / Source](../DEVELOPMENT_REPORT.md)
