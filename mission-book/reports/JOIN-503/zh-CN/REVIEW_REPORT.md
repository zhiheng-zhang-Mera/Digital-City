# JOIN-503——正式审查报告

阅读译本 / Reading translation：完整历史阅读译本，不构成第二份权威审查记录；原修复要求及未完成状态保留。

> 工作簿：[JOIN-503-device-enrollment-and-tokenless-reconnect.md](../../../finished/completed-2026-10-04/connection-onboarding-components/JOIN-503-device-enrollment-and-tokenless-reconnect.md)
> 被审查头：`ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7`，join/JOIN-503-device-enrollment-and-tokenless-reconnect。
> 开发主机Alien，审查主机Mech，不同物理主机，符合CONSTRUCTION_RULES.md第3节。
> 精确头托管CI37117241912 COMPLETED SUCCESS，V0.2 checks；按head_sha重新查询，而非继承旧结果。
> 修复交付分支review/JOIN-503-mech-formal-review @a3b9ab3，涉及server.mjs与join503-review-privilege.test.mjs。
> 结论REPAIR REQUIRED（D-1、D-2）：修复已交付并验证，但审查尚未完成。review_complete:false，不记录terminal marker。

## 1. 精确头对账

| 事实 | 实测 |
|---|---|
| 工作簿development_head_sha | ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7 |
| git ls-remote分支头 | 同一SHA |
| 此SHA托管CI | 37117241912，该JOIN503分支，completed/success |
| 审查与开发主机 | Mech与Alien，独立 |
| 被审查提交基线 | JOIN-501头e925ae1；范围e925ae1..ede6fa2，10文件、+1300/−15 |

## 2. 修改内容及是否属于任务

services/dev-gateway/enrollment.mjs registrar是city/00-foundation/02-city-node-network/device-identity上的衔接层，而非平行registry。导入createInstallation、resolveInstallationPresentation、retireInstallation、rebindInstallation、detectCredentialClones等，仅增加session半边（mint/check/revoke）。持久cred-…/secret只生成一次、返回一次，由device层写.runtime/device-enrollment.json，mode0600；.runtime已git忽略，从不进入浏览器。浏览器获得sess:凭据，符合工作簿第2节身份边界及第5节“浏览器仅持session作用域凭据”。

auth()每个请求都向registry解析sess: bearer，绝不缓存；WebSocket握手也经过同一auth()。因此撤销安装在紧接下一请求，包括重连，即被拒绝，满足第4节要求的机制。

## 3. 发现

### D-1——必须修复：session可撤销任何其他安装

观察头ede6fa2。POST /api/v0/device/installations/:id/revoke仅要求auth()，且auth()接受sess:凭据。因此任一已入网安装只持浏览器sessionStorage内短期凭据即可撤销任何其他安装，包括Owner使用的安装。GET /api/v0/device/installations同样向session返回全City安装名单及每个installation/device记录。

为何这是缺陷而非选择：兄弟路由已用SESSION_CANNOT_ENROLL与SESSION_CANNOT_REBIND拒绝session，作者enrollment注释也明确“session凭据不能访问这些操作，因此已加入设备不能自行加入第二设备”。revoke未执行该意图，不对称无法成立；session仅属于一个安装。

最小修复边界：Owner control token继续像原来一样看到并操作所有安装；session只见自身，scope:OWN_INSTALLATION，并只可撤销自身，合法离城且不影响他人。其余情况返回类型化SESSION_CANNOT_REVOKE_OTHER。

审查分支a3b9ab3应用修复，guard为tests/join503-review-privilege.test.mjs。guard经反证有效，不只是描述实现：未修复头FAILS（名单scope undefined，跨安装撤销成功），修复后PASSES；作者原13测试仍通过，修复路径仍真正生效，撤销安装在下一请求即拒绝。

### D-3（备注，未修复）——sess:开头的control token会进入session验证器

auth()按Bearer sess:字面前缀分流。City control token若恰以这五字符开头，会被当session id解析并拒绝，Owner被锁定直到改token。这是fail-closed，请求被拒绝，绝不以错误权限接受；生成token未有此形态。但更准确分流为“registry认识此值则session，否则与control token比较”。超出本发现有界修复，留阶段整合。

### D-4（备注）——第9节双机验收延期，未通过

工作簿需两个物理主机Alien+Mech：一机join，另一机approve/revoke，再重启，证明自动重连且撤销身份不能静默重新进入。审查者只有一机。实际验证的是代码、身份衔接、机制、负向路径及secret扫描；双机拓扑延期至阶段整合，与开发记录和本机领取在审查前声明一致。deferred != passed。

## 4. 独立执行的检查

| 检查 | 结果 |
|---|---|
| 在原审查头重跑作者join503-enrollment真实Gateway9case | PASS |
| pairing.test.mjs、web-v02.test.mjs，JOIN503变化无回归 | PASS |
| D-1/D-2 guard在未修复头 | FAILS，符合预期 |
| D-1/D-2 guard修复后 | PASS |
| 撤销在下一请求生效，HTTP与WebSocket握手共用auth() | PASS |
| City不可读取持久secret且浏览器不存它 | PASS：记录仅有凭据指纹；浏览器存city-session / city-session-id |
| 变化的跟踪文件无字面凭据 | PASS：匹配仅为注释mint前缀、test fixture token及无关TARGET_*标识符 |
| device文件所在.runtime被git忽略 | PASS |

测试环境说明：裸次级工作树运行整套出现两项无关失败，city-roads与web-terminal-shell、ENGINE_UNAVAILABLE，涉及City树另行安装的第三方parser。完整checkout通过，托管CI将安装作为自身步骤。这些不是本修改属性；上文精确头托管运行绿色。

## 5. 为何尚不能PASS

review_complete仍false，DEVICE_ENROLLMENT_RECONNECT_ACCEPTED不记录：修复须进入实际待合并分支并有自身精确头CI。仅存在审查分支的行为变化尚未进入开发线，而PASS必须指出待整合artifact。修复已交付、最小且验证；剩正常Review→Repair→re-check交接。

## 6. 交回开发主机

```text
FINDING_ID              D-1 (with D-2 as the same root cause on the read route)
SEVERITY                privilege escalation across installations (a session credential could revoke another installation)
OBSERVED_HEAD           ede6fa22e0165156aadcf3cbd6ba748b6f2b39d7
OBSERVATION             POST /device/installations/:id/revoke and GET /device/installations were reachable with a
                        `sess:` credential, so an enrolled installation could revoke any other (including the
                        owner's client) and read the whole enrollment roster
REPRODUCTION            tests/join503-review-privilege.test.mjs on the unrepaired head: roster scope undefined,
                        cross-installation revoke returned 200
EXPECTED_CONTRACT       workbook section 2/3: a session belongs to ONE installation; the City's roster and the
                        authority to revoke another installation belong to the owner's control credential
MINIMUM_REPAIR_BOUNDARY services/dev-gateway/server.mjs only: scope the roster to the caller's own installation for
                        a session, and refuse a cross-installation revoke with a typed code
EVIDENCE                review/JOIN-503-mech-formal-review @ a3b9ab3 (repair + guard), guard FAILS unrepaired /
                        PASSES repaired, author 13/13 still pass
REVIEWER                Mech
```

交接原块：发现D-1及读路由同根因D-2；严重性为session跨安装权限提升。原观察头与重现工具均保留；未修复名单scope undefined、跨撤销200。预期每session仅属于一安装，全名单及撤销他安装属于Owner control credential。最小边界仅server.mjs：限制session名单自身并类型化拒绝跨撤销。证据为a3b9ab3修复+guard，未修复失败/修复通过、作者13/13仍通过；审查者Mech。

修复为一文件两个hunk，可cherry-pick或手工重做；欢迎按自己的表述重新应用。具有自身托管CI的新头才关闭本审查。

语言配对 / Language pair: [原文 / Source](../REVIEW_REPORT.md)
