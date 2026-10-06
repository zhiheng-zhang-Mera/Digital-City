# JOIN-502——正式审查（Alien，异机）

阅读译本 / Reading translation：完整历史阅读译本，不构成第二份权威记录。原时点PASS及DEFERRED边界均保留。

> 工作簿：[JOIN-502-nearby-pc-discovery-and-owner-approval.md](../../../finished/completed-2026-10-04/connection-onboarding-components/JOIN-502-nearby-pc-discovery-and-owner-approval.md)
> 被审查头：`86deda9c2990c78d683a8c3515d251022df9d040`，join/JOIN-502-nearby-discovery-approval。
> 开发Mech，审查Alien，不同物理主机；直接Owner授权，已记录工作簿review_claim_basis。
> 精确头托管CI37119234473 COMPLETED SUCCESS，V0.2 checks的gateway-web与android，按head_sha重新查询。
> 结论PASS，两项NOTES，无必须修复；review_complete:true。

## 1. 精确头对账

| 事实 | 实测 |
|---|---|
| 工作簿development_head_sha | 86deda9c2990c78d683a8c3515d251022df9d040 |
| git ls-remote分支头 | 同一SHA |
| 此SHA托管CI | 37119234473 completed/success，两job |
| 审查与开发主机 | Alien与Mech，独立 |
| 审查范围 | 13109b4..86deda9，13文件、+1528/−10 |

明确披露偏向。审查者开发兄弟JOIN-501及503，熟悉主题并共享作者平台假设。其双向影响：特别留意第6节禁止的隐藏短码生成，但不能声称具有第三方陌生视角。记录是因为隐藏立场的审查不如公开立场。

## 2. 独立执行项

| 检查 | 结果 |
|---|---|
| 作者join502-gateway、join502-nearby、join502-ui | 19/19 PASS |
| P1 browse/request是否生成配对session或短码，第6节 | PASS：请求前后public descriptor均pairingSessionId:null，整路径City事件日志无pairing-session事件 |
| P2 discovery或pending请求是否当作信任，第5节 | PASS：请求行grantsTrust:false、isIdentity:false；批准前无凭据；只持id不持claim拒绝403 |
| P3 能否无Owner或由requester批准 | PASS：无认证approve401、requester自己的claim approve401；已认证Owner可见pending行 |
| P4 释放的是已有City凭据而非新类型 | PASS：exchange返回City control credential且/api/v0/city认证200；无第二信任库/新类型。status绝不含凭据，仅exchange包含，批准与领取分离 |
| P5 消费与拒绝是否真正生效 | PASS：同一批准第二exchange410；CONSUMED行不向任何调用者释放；rejected行无释放且不可领取 |
| P6 旧public pairing版本检查回归 | NOTE N-1：/pairing/info使用X-City-Api-Version:9现200、原409；认证路由及/pairing/session仍409 |
| 本任务触及共享契约 | mdnsTxt增加join:'1'能力标记；重跑TXT无secret/credential探针，未发现此值。pairing.test.mjs键集合更新是有文档扩展要求，不是弱化 |

探针tests/join502-review-probes-v2.test.mjs在review/JOIN-502-alien-formal-review分支。设计允许失败：最初三项因审查者自己错误理解wire contract失败——claim由requester生成，approve/reject以id寻址，status/exchange以requestId寻址。纠正探针而非代码。保留此点，因为本次审查首轮失败确实是审查者错误。

## 3. 发现

### N-1（备注，非修复要求）——旧public pairing不再执行api/schema版本检查

认证前导从：

```text
if(!publicPairing) auth(req, nodeRoute); version(req);
```

变为：

```text
if(!publicJoin && !legacyPublicPairing) auth(req, nodeRoute);
if(!legacyPublicPairing) version(req);
```

因此GET /pairing/info及POST /pairing/exchange现在既免auth()也免version(req)。

为何不是修复要求：仅在版本不匹配客户端得到服务而非被拒这一意义fail-open；不赋权限、不暴露secret，响应仍有apiVersion/schemaVersion供客户端自查。diff理由成立：尚未了解City版本的加入客户端必须可达这两路由，409拒绝是作者实际运行发现的六缺陷之一。

为何仍记录：wire contract不对称，同版本/pairing/session409而/pairing/info接受。从一个路由学到“409表示升级”的客户端会对另一行为意外。若阶段整合要修复，诚实做法不是恢复一刀切检查，而是明确标注豁免路由容忍版本，例如响应versionMismatch:true，使豁免明示。本验收不要求此修改；审查者偏好真实且有文档豁免，而非静默409阻断合法加入。

### N-2（备注）——第9节双机拓扑DEFERRED，未通过

作者真实LAN验收的第二City在本主机自己的LAN接口。真实mDNS、browse及approval gate成立，但只有一物理主机，不能建立工作簿第9节Alien+Mech拓扑。开发记录明确，本审查确认而无新增证据。deferred != passed。

## 4. 未建立的结论

- 未对第二物理PC执行端到端，见N-2。
- BLE仅advertise，浏览器不能扫描，现任何主机均未端到端验证BLE。UI显示不可用而非伪造设备，符合第3节诚实行为。
- 本审查未在第二主机重跑作者真实LAN验收；针对真实Gateway验证代码路径、门禁及负向结果。

## 5. 交接

```text
VERDICT              PASS (review_complete: true)
REQUIRED REPAIR      none
NOTES                N-1 version-check asymmetry on the legacy public pairing routes (documented exemption;
                         a phase-integration item if the wire contract is to be made uniform)
                     N-2 section 9 two-PHYSICAL-host topology remains DEFERRED
TERMINAL MARKER      NEARBY_PC_JOIN_ACCEPTED now recorded by the reviewer, because every condition workbook
                     section 10 names is met as far as one host can honestly meet them: same-LAN real
                     discovery/join measured by the author, approval gate real, no auto-trust, no hidden
                     short-code generation, fallback entries still reachable, Development + opposite-host
                     Review + exact-head CI all satisfied
MERGE AUTHORITY      unchanged: README section 5 now permits the phase integration workbook to be created,
                     and merge authority for that phase is a separate act this review does not perform
REVIEWER             Alien
```

原交接结论PASS、review_complete:true，无required repair。N-1是旧public pairing版本检查不对称，有文档豁免，wire契约统一可留阶段整合；N-2双物理拓扑仍DEFERRED。审查者现在记录NEARBY_PC_JOIN_ACCEPTED，因为第10节要求在单主机能够诚实满足的范围内成立：作者实测同LAN发现/join、批准真门禁、无自动信任/隐藏短码、fallback入口可达、Development+异机Review+精确头CI满足。merge_authority不变；README第5节现允许创建阶段整合工作簿，阶段合并授权为独立动作，本审查不执行。审查者Alien。

语言配对 / Language pair: [原文 / Source](../REVIEW_REPORT.md)
