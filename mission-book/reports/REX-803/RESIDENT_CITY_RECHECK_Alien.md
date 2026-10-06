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
