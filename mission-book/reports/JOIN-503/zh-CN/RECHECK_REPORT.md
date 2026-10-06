# JOIN-503——修复后正式审查复验

阅读译本 / Reading translation：逐节完整历史阅读译本，不构成第二份权威状态记录；不以较晚记录改写较早时点。

> 工作簿：[JOIN-503-device-enrollment-and-tokenless-reconnect.md](../../../finished/completed-2026-10-04/connection-onboarding-components/JOIN-503-device-enrollment-and-tokenless-reconnect.md)
> 原审查：[REVIEW_REPORT.md](../REVIEW_REPORT.md)，在ede6fa2要求修复D-1、D-2。
> 复验头：`77f7f2a7d5b06fb6a448a2dda51b7f2f4b9ab32f`，分支join/JOIN-503-device-enrollment-and-tokenless-reconnect。
> 修复作者Alien（开发主机），Mech（不同物理主机）复验。
> 复验头托管CI：37120646153，在精确77f7f2a、该分支、V0.2 checks工作流COMPLETED SUCCESS，以head_sha重新查询。
> 结论PASS：D-1、D-2关闭，修复比最低要求更严格；review_complete:true。

## 1. 复验内容及为何不直接相信

修复提交说明很有说服力，恰因此没有直接信任。实际测量三点：

1. 修复不是cherry-pick审查者补丁。git merge-base --is-ancestor a3b9ab3 77f7f2a失败，说明独立重新应用，须独立验证质量而非凭补丁身份。
2. 在新头重跑审查者为发现编写的tests/join503-review-privilege.test.mjs，在77f7f2a PASS。作者将此文件带到开发分支，故该guard到达待合并分支并获得自身精确头CI。
3. 同时运行作者guard及原套件：tests/join503-session-scope.test.mjs、tests/join503-enrollment.test.mjs及审查者guard，共14测试、14通过、0失败。

## 2. 独立测量修复后行为

对77f7f2a真实Gateway测量，刻意注入重复凭据指纹，使clone scan确实有对象可查。

| 调用者 | scope | 可见安装 | cloneFindings | 跨安装撤销 |
|---|---|---|---|---|
| Owner（control token） | CITY | 2 | 341字符，全体扫描仍有效 | 与此前一样允许 |
| session（sess:凭据） | OWN_INSTALLATION | 1，仅自身 | [] | 403 SESSION_CANNOT_REVOKE_OTHER |

被拒绝撤销后，目标受害者session仍认证200。因此D-1关闭（无跨安装权限），D-2关闭（session无全体名单），Owner权限不变。

## 3. 修复比最低要求更进一步

原审查最低边界为installations数组。作者也限定cloneFindings，因为全体clone扫描会指出其他安装id及凭据指纹；仅限定数组仍会给session城市内所有重复凭据的地图。上表实测Owner看到341字符扫描，session为[]。审查者接受其正确性及相对于最低要求的实际改进；仍在缺陷边界内——同一路由缺少session仅限一个安装的规则，而非扩展范围。

响应明确给出scope OWN_INSTALLATION/CITY，不再需推断，客户端因而能读出其作用域。

## 4. 仍开放与已关闭发现

| ID | 状态 |
|---|---|
| D-1 跨安装撤销 | CLOSED：403及类型化错误码；验证受害者未受影响 |
| D-2 session可读全体名单 | CLOSED：一行自身记录，cloneFindings为空 |
| D-3 auth按sess:字面前缀分流，该形态control token会被拒绝 | OPEN，仅备注：失败关闭，无生成token呈此形态；带至阶段整合，非阻断 |
| D-4 工作簿第9节双物理主机验收 | DEFERRED，未变：审查者只有一台主机。enrollment/restart/revoke机制验证，双机拓扑属于阶段整合；deferred != passed |

## 5. 复验边界

- 结论仅针对77f7f2a。后续提交需自身CI且重新应用本复验，不能继承。
- 审查者仅有一台主机；第9节双机路径仍按原审查运行前声明延期。
- merge_authority未改；programme README阶段合并锁仍需三个JOIN任务开发完成并有异机审查。JOIN-501及503现满足；JOIN-502在Mech开发完成，仍等待本机不能提供的审查，阶段门禁不因本任务改变。

语言配对 / Language pair: [原文 / Source](../RECHECK_REPORT.md)
