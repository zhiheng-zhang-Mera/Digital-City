# JOIN-503——作者对审查发现D-1 / D-2的修复记录

阅读译本 / Reading translation：完整历史阅读译本，不构成第二份权威状态。不用后续复验结果升级本记录的PENDING。

> 工作簿：[JOIN-503-device-enrollment-and-tokenless-reconnect.md](../../../finished/completed-2026-10-04/connection-onboarding-components/JOIN-503-device-enrollment-and-tokenless-reconnect.md)
> 审查者报告：[REVIEW_REPORT.md](../REVIEW_REPORT.md)，Mech，不同物理主机。
> 原审查头：`ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7`。
> 修复头：`77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f`，分支join/JOIN-503-device-enrollment-and-tokenless-reconnect。
> 修复头托管CI37120646153精确SHA COMPLETED SUCCESS，gateway-web及android jobs。
> 作者Alien；状态：修复交付，审查者复验PENDING。review_complete仍false，不记录DEVICE_ENROLLMENT_RECONNECT_ACCEPTED。

## 1. 接受发现，不作争辩

Mech的D-1是作者修改的缺陷，不是设计分歧。POST /api/v0/device/installations/:id/revoke只要求auth()，而auth()接受sess:凭据。因此任一已入网安装仅持浏览器sessionStorage中短期session凭据就能撤销任何其他安装，包括Owner正在使用的客户端。GET /api/v0/device/installations向同一session返回全City名单，D-2与写路由同根因。

不可辩护之处在于作者已在两个兄弟路由写出边界：enroll的SESSION_CANNOT_ENROLL与rebind的SESSION_CANNOT_REBIND，并在enroll注释明确意图。三个路由只保护两个不构成完整边界，而是攻击者会寻找的缺口。作者不争辩严重性。

## 2. 修复与超过审查最低要求的一个方面

按照审查允许重新应用而非cherry-pick，用作者自己的表述在开发分支重做。文件内统一陈述规则，防止下个路由遗漏：

> session凭据只可操作自身安装，不能操作其他安装。

| 路由 | 修复前 | 修复后 |
|---|---|---|
| POST /device/installations/:id/revoke | 任意auth() | session可撤销自身，scope:OWN_INSTALLATION；跨安装以SESSION_CANNOT_REVOKE_OTHER拒绝；control token不变，仍可作用全体安装，scope:CITY |
| GET /device/installations | 任意auth()得到全名单 | session只有自身记录及OWN_INSTALLATION；control token仍见全City及CITY |
| GET /device/installations的cloneFindings | 全City扫描 | session得到[] |

**为何cloneFindings属于范围而非额外装饰。** 审查最低要求仅限定installations数组，但detectCredentialClones遍历全安装群体，各发现包含installationId及credentialFingerprint。仅限定数组仍会给session一张全City重复凭据安装地图，仍是D-2同类泄露且在同一响应中。仅允许知道自身的调用者询问“此City哪些安装重复”，诚实答案是空数组。记录此项因为这是刻意扩展修复，而非审查明确要求。

未修复且保持审查原记载：D-3，auth()按sess:字面前缀分流，会拒绝该形态control token；这是fail-closed，超出有界修复范围。D-4，第9节双物理主机验收仍DEFERRED至阶段整合；deferred != passed。

## 3. 用正反两面证明guard有效

审查者编写tests/join503-review-privilege.test.mjs；若仅按作者表述重新应用，guard会遗留在审查分支。因此带入开发分支并获得精确头CI。第二个guard tests/join503-session-scope.test.mjs验证整个路由家族，而非仅已发现问题的两路由。

实测而非口头声明：

| 测量工具 | 未修复头ede6fa2 | 修复头77f7f2a |
|---|---|---|
| tests/join503-session-scope.test.mjs | 4项中3项FAIL | 4/4 PASS |
| Mech的tests/join503-review-privilege.test.mjs | FAILS | PASSES |
| 作者原9项tests/join503-enrollment.test.mjs | PASS | 9/9 PASS，无回归 |

未修复失败形态本身也是证据：Owner权限case不是仅断言失败，而是因为未修复跨安装撤销真的杀掉受害者而崩溃。攻击可实际执行，不是理论问题。

## 4. 在运行City上验证同一规则，而非仅测试

对真实Gateway的live acceptance：cityId `c5cff65e-ea1c-4bc7-9964-3054f2e5f563`，Owner提供node凭据 `1Q2W3E4R-node`。共38检查、38 PASS，其中D-1/D-2相关项：

- session读名单获得OWN_INSTALLATION，恰好一安装及cloneFindings:[]。
- control token同路由得到CITY及全名单。
- session试撤销第二安装得到403 SESSION_CANNOT_REVOKE_OTHER；受害者仍可用且BOUND。拒绝是真拒绝，而非只报告失败。
- control token撤销第二安装成功，紧接下一请求即401；自身重连以INSTALLATION_RETIRED拒绝、retryable:false。

回执.runtime/evidence/join-final-test/receipt.json，git忽略且本地；工具.runtime/evidence/join-final-test/final-acceptance.mjs。

## 5. 仍开放事项

1. 审查者复验修复头。PASS必须指明artifact，结论属于Mech对77f7f2a的复验及自身精确头CI，当前CI绿色。本机不会为自己的修复记录review_complete:true或terminal marker。
2. 第9节双物理主机验收仍延期，与审查运行前记录一致。Owner凭据只在本机对本机City使用；当时Mech不可达，其City不响应任何被探测endpoint且主机不响应ping。作为本次运行事实记录，没有绕过。
3. 合并/整合仍超出本范围。mission-book/finished/completed-2026-10-06/connection-onboarding/README.md第5节禁止三个JOIN都有异机审查之前创建阶段整合工作簿；JOIN-502仍等待本机不能提供的审查。

语言配对 / Language pair: [原文 / Source](../REPAIR_D1_D2.md)
