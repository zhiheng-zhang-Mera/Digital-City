# JOIN-502——观察回执：开发主机上的真实LAN验收

阅读译本 / Reading translation：完整历史阅读译本，不是独立验证或第二份权威状态记录。代码证据逐字保留，历史缺口不升级。

> Mech开发主机于2026-10-03，在开发join/JOIN-502-nearby-discovery-approval、精确头`86deda9c2990c78d683a8c3515d251022df9d040`时产生。这是开发主机回执，不是独立验证；CONSTRUCTION_RULES.md第3节要求不同物理主机正式审查，当时尚未发生。

## 测量工具

.runtime/join502-live-check.mjs未跟踪，位于City自身runtime目录。在本机真实LAN接口启动两个真实Gateway、discoveryEnabled:true，让真实mDNS广告发出并被接收，随后对真实HTTP API执行browse、identify、ask、approve、collect、replay。它不属于pnpm test：托管CI无multicast，在该处要求真实discovery会形成不稳定门禁而非证据。

调用：

```powershell
$env:JOIN502_LAN_IP='172.31.12.151'; node .runtime/join502-live-check.mjs
```

JOIN502_LAN_IP设置172.31.12.151后运行该工具。运行时主机事实：hostname Mega-rep（Mech主机）、LAN IPv4 172.31.12.151/16、接口“以太网”、Node v24.14.0。

## 原样输出

```text
[live] cities-up: http://172.31.12.151:61770 and http://172.31.12.151:61773 on 172.31.12.151, discovery enabled on both
[live] browse: discovered 2 City/Cities: Utopia · Alien@http://172.31.12.151:61770#a40f0234-1ef5-402b-a981-fbb7696ca925, Utopia · Alien@http://172.31.12.151:61773#d9b8a872-ffd5-4d28-abca-bde4a4a7647d
[live] identity: peer http://172.31.12.151:61773 reported cityId d9b8a872-ffd5-4d28-abca-bde4a4a7647d
[live] gate-holds: request PENDING; exchange before approval -> HTTP 409
[live] approved: approve HTTP 200; exchange HTTP 200; credential authenticates -> HTTP 200, cityId d9b8a872-ffd5-4d28-abca-bde4a4a7647d
[live] spent: replay -> HTTP 410; final state CONSUMED
[live] secrets: requester claim or City credential present in the owner listing: false
{
  "ok": true,
  "lan": "172.31.12.151",
  "peer": "http://172.31.12.151:61773",
  "cityId": "d9b8a872-ffd5-4d28-abca-bde4a4a7647d",
  "steps": [ … the seven lines above, verbatim, as structured records … ]
}
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76
```

两City在61770和61773端口启动，均开启discovery；browse发现两个不同endpoint及City UUID。HTTP读取peer自身完整cityId；批准前请求PENDING，exchange409；approve200、exchange200、返回凭据实际认证200且目标cityId一致；重放410，最终CONSUMED；Owner列表无requester claim或City凭据，结果false。JSON结果ok:true，记录LAN、peer、cityId及七行结构记录。之后发生原块保留的libuv断言失败。第二次运行以不同端口/身份复现同一结果，browse有#a40f0234… / #d9b8a872…、ok:true。

## 每行证明的内容及已检查的证伪条件

| 观察 | 证明 | 已检查的证伪条件 |
|---|---|---|
| browse发现两个City，endpoint及cityId均不同 | 第二进程确实通过真实接口multicast浏览发现发布服务，即此前不存在的RF-003客户端半边 | identify:false返回无身份行；首版只返回短前缀，接收者拒绝handoff |
| identity由peer报告cityId d9b8a872… | 固定身份是HTTP读取的City自身声明，而非mDNS前缀 | 从/api/v0/join/info读取；无法答复的City被丢弃，不猜测 |
| 批准前exchange409 | 批准是真门禁，未批准不释放任何内容 | 同一次exchange只有approve200之后成功 |
| approve200、exchange200、凭据认证200且cityId d9b8a872… | 释放的是City已有control credential，实际可对该City认证 | 返回cityId与固定身份比较，并用凭据执行认证GET /api/v0/city |
| replay410、CONSUMED | 一次请求一次凭据，领取为一次性 | 同claim第二次exchange拒绝 |
| secrets false | 批准者列表既无requester claim原像也无City凭据 | tests/join502-gateway.test.mjs同样扫描列表、City snapshot、持久状态文件和规范事件流并断言 |

## 末尾libuv断言：调查后保留，而非隐藏

断言在JSON结果打印后触发，仅在同一进程关闭两个发布mDNS的Gateway时出现。同主机同接口只启一个discoveryEnabled:true City关闭干净：up http://172.31.12.151:63197 → CLOSED_CLEANLY_ONE_CITY，无断言。因此原文判断为测试框架bonjour-service teardown竞争，不是join路径缺陷，不改变上面观察。

## 明确边界

- 第二City运行在本主机LAN接口；网络路径真实，但第二台机器不存在。因此工作簿第9节Alien+Mech拓扑延期至阶段整合。
- 当前BLE仅advertise，浏览器不能扫描；UI明确说明。
- 尚无独立审查重跑以上任何内容。

语言配对 / Language pair: [原文 / Source](../EVIDENCE_LIVE_LAN_ACCEPTANCE.md)
