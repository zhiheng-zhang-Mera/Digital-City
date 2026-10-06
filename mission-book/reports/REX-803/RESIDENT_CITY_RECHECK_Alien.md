# 常驻 City 只读回查 / Resident City read-only recheck

观测时间 / Observation: **2026-10-06T07:00:04Z**。这是实际运行状态观测，不是候选源码8798ba9的实体campaign验收，也不证明常驻服务部署了该源码。 / This observes actual runtime state; it is not physical campaign acceptance of candidate8798ba9 and does not prove that candidate is deployed.

从现有 Android `city.utopia.control` 的连接配置仅提取地址和身份；凭据仅在内存用于授权只读 `/api/v0/city` 请求，未输出或写入报告。`/api/v0/health` 返回 healthy。手机保存的 City ID 与 Gateway canonical snapshot 相同。

Only address and identity were extracted from the existing Android connection configuration. Credentials were used in memory for an authorized read-only `/api/v0/city` request and were neither printed nor stored in this report. `/api/v0/health` returned healthy; the saved Android City ID matched the canonical Gateway snapshot.

| 项目 / Item | 观测 / Observed |
|---|---|
| 地址 / Endpoint | `http://172.31.12.151:4391` |
| City ID | `031fdba6-e94c-4298-a095-6ff04a65481d` |
| Alien reference node | `alien-reference-node`, offline |
| Alien 最后心跳 / Last heartbeat | `2026-10-05T11:15:06.977Z` |
| 当前在线节点 / Online node | `dev-031fdba6e94c4298a0956ff04a65481d` |
| 在线节点心跳 / Online heartbeat | `2026-10-06T06:59:31.959Z` |
| 另一离线节点 / Another offline node | `dev-e1d87b2a0ec5457e822b91d81e40dc67` |
| 另一离线心跳 / Other heartbeat | `2026-10-05T11:32:34.777Z` |
| Alien 本地配置 / Local configuration | `D:/utopia/.runtime/local-config.json` |
| 本地配置 City ID / Local configured City | `e1d87b2a-0ec5-457e-822b-91d81e40dc67` — 与常驻 City 不同 / differs from resident City |
| 常驻源码 SHA / Runtime source SHA | `NOT_OBSERVED` |

因此实体两主机+Android门槛仍为NOT_RUN。现有 Alien 配置不能当作同一 City 的有效配置启动使用；等待正确的已有安装/节点配置，不重绑、替换或伪造设备身份。没有运行campaign、启动新City或修改常驻服务。

The two-physical-hosts-plus-Android gate therefore remains NOT_RUN. The existing Alien configuration cannot be treated as a valid same-City configuration; the correct existing installation/node configuration is still required. No identity was rebound, replaced or fabricated. No campaign was executed, no new City started and no resident service changed.

## 保存的成员配置复查 / Saved member configuration check

随后从标准客户端路径 `C:/Users/15601/AppData/Local/Utopia/client/device-enrollment.json` 找到同 City 的 Alien 成员记录：`deviceId=dev-e1d87b2a0ec5457e822b91d81e40dc67`、`installationId=ins-e7f0f7cd90d276ebf8985062ab1a88e1`、显示名 `Alien-PC-JOIN590`。只调用候选8798ba9原有 `startMemberAgent` 及 `openDeviceSession` 尝试恢复该成员；Gateway 返回403 `INSTALLATION_RETIRED`。注册步骤未执行、成员未启动；该结果证明配置属于同 City 但安装已退休，不能作为可用的实体 worker。

A later inspection found an Alien member record for the same City at the standard client path: device `dev-e1d87b2a0ec5457e822b91d81e40dc67`, installation `ins-e7f0f7cd90d276ebf8985062ab1a88e1`, display name `Alien-PC-JOIN590`. Candidate8798ba9's existing `startMemberAgent` and `openDeviceSession` were used to attempt restoration. The Gateway returned403 `INSTALLATION_RETIRED`; node registration was not reached and the member did not start. The record belongs to the same City but its installation is retired, so it cannot provide a usable physical worker.

尝试前 canonical snapshot 有10个COMPLETED任务、无活动任务。没有修改存储的安装记录、重新配对或解除退休状态，凭据没有落入证据。实体campaign保持NOT_RUN，继续等待可用的正确安装配置。

Before the attempt, the canonical snapshot contained10 COMPLETED tasks and no active tasks. The stored enrollment was not modified, paired again or unretired; credentials remain absent from evidence. The physical campaign remains NOT_RUN pending a valid installation configuration.

## 正式重新连接与 main 编译 / Formal reconnection and main build

2026-10-06，用户提供 Mech 当前 City 的一次性配对码后，官方客户端启动器完成重新登记。Alien 以 MEMBER 身份运行，City ID 为 `031fdba6-e94c-4298-a095-6ff04a65481d`，设备为 `dev-8128a1ef25c5c4b7f66fc31b21705858`，显示名 `Alien-MERA-ALIANWARE`。本机此前没有运行中的旧 City；旧数据和退休安装备份保留。只启动成员及本地4389协调端点，没有启动新的 PRIMARY。配对码、令牌和会话凭据不进入证据。

On 2026-10-06, after the user supplied a one-time pairing code for Mech's current City, the official client launcher completed enrollment. Alien runs as a MEMBER in City `031fdba6-e94c-4298-a095-6ff04a65481d`, device `dev-8128a1ef25c5c4b7f66fc31b21705858`, named `Alien-MERA-ALIANWARE`. No old local City was running; old data and the retired enrollment backup were retained. Only the member and local coordination endpoint4389 started, with no new PRIMARY. Pairing codes, tokens and session credentials are excluded from evidence.

独立读取本地成员状态和 Gateway canonical roster，Alien 与 Mech 均在线，Android 配置的 City ID 一致。Alien 运行源码是已合入 CEX-790 的 main `b06504f1f96984c960b2661b8ee3a7130796d379`；Mech Gateway 的运行源码仍为 NOT_OBSERVED。该 main 的 Android `testDebugUnitTest assembleDebug` 在独立成员工作区完成，Gradle 输出 BUILD SUCCESSFUL（41项任务）。这些结果不等于 REX-803 候选部署或 controlled campaign 验收；campaign 仍为 NOT_RUN。

Independent local member status and the Gateway canonical roster showed Alien and Mech online, with the same City ID in Android configuration. Alien runs merged CEX-790 main `b06504f1f96984c960b2661b8ee3a7130796d379`; Mech Gateway's runtime source remains NOT_OBSERVED. Android `testDebugUnitTest assembleDebug` on that main completed in the isolated member worktree: Gradle reported BUILD SUCCESSFUL,41 tasks. These observations do not establish REX-803 candidate deployment or controlled-campaign acceptance; the campaign remains NOT_RUN.

补充构建统计：21个Android测试套件、111项测试，0失败、0错误；APK已生成。CEX-790清单与成员角色定向检查5/5通过。启动器集成3项因在线成员占用4389协调端口而拒绝运行，原始拒绝保留，不计为通过；为保持联机未停止成员。 / Additional build totals:21 Android suites,111 tests, zero failures/errors; APK generated. CEX-790 inventory and member-role checks passed5/5. Three launcher integration checks refused execution because the online member occupies coordination port4389; refusals are retained and are not passes. The member remains online.

APK SHA256: `3b40b8d365a17893e01bdf88b190829f8de609bce3859ef10a7acadf4ca9ed0e`.

## 当前canonical与权限实测 / Current canonical and authority measurement

2026-10-06T07:54Z，用Alien正规成员会话只读获取City：两个在线node均公布task.execute.safe与filesystem.temp；Mech心跳07:54:41.474Z，Alien07:54:41.929Z。canonical controlSurfaces列出Alien新设备、Android `dev-be7832e35fc34b85966c3bb43a992e1d`（Android · PERM00）及Mech。与仅匹配手机配置不同，这是Gateway当前返回的控制界面引用。随后只读GET /api/v0/research/campaigns返回403 RESEARCH_OWNER_REQUIRED，未创建／停止／修改campaign。Owner端需以新Alien canonical身份注册或选择相应experiment；旧alien-reference-node声明不能当作新成员身份。

At2026-10-06T07:54Z, an ordinary Alien member session read the canonical City. Both online nodes advertise task.execute.safe and filesystem.temp; Mech heartbeat07:54:41.474Z and Alien07:54:41.929Z. Canonical controlSurfaces list Alien's new device, Android `dev-be7832e35fc34b85966c3bb43a992e1d` (Android · PERM00), and Mech. These are current Gateway-returned references, beyond matching phone configuration. A read-only GET /api/v0/research/campaigns then returned403 RESEARCH_OWNER_REQUIRED; no campaign was created, stopped or modified. The Owner must register or select an experiment declaring the new canonical Alien identity; the old alien-reference-node declaration does not identify this member.
