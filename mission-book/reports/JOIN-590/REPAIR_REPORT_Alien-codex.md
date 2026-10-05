# JOIN-590 修补与实机再验收（Alien-codex）

原复检源码：`b91677d1478950feb79742f618d0c981773d5bb7`。修补源码：`ec3b6f996240ca71505b3b67af12cc222d1b283a`。开发主机仍为 Mech，复检及这些修补由 Alien-codex 完成，不覆盖原 development head。

[修补 PR #28（draft）](https://github.com/zhiheng-zhang-Mera/utopia/pull/28)。本次未合并 main，未释放终止标记。

## 修补内容

- Android 审批交换携带规范 `dev-<32hex>` / `inst-<32hex>` 身份及用户可填写的入网名称。完整安装凭据保存在应用私有存储，界面、URL 和记录不输出秘密。
- 手机使用独立成员会话；启动时用安装凭据续期，401/403 后内部复核身份。安装被撤销或拒绝后停止自动重试，不回退到主城令牌。
- 增加仅撤销自身安装的“退出城市”。手动令牌连接保留为明确选择，清除以前的安装关联。
- 审批入网不再要求未使用的短码；直接方式要求六位短码。等待过程中锁定地址和名称，退出界面后取消、隔离迟到回调和凭据保存。
- HTTPS/WSS 地址保留 TLS 至拨号、保存和重连；拒绝 URL 用户信息、路径、查询参数及跨地址重定向。
- 短码的 enrollment.session 与审批回复结构不同，客户端均选用成员会话。网关对安装入网回复不再附带 owner credential，并拒绝成员创建主城配对码。
- 全量运行暴露启动器测试隔离缺陷，修补其提前检查；主机状态目录不隔离机器级 4389 端口。

## 验证

Android 实际 Gradle 构建成功，91 项单元测试、0 failure/error；实际网关相关测试 28/28。新增真实 socket/HTTP 回归覆盖 Android 形状的命名审批、独立会话、City 数据持久化重启、成员权限及本机撤销后旧会话和安装凭据拒绝。

本机全量测试 1245/1248：三个 launcher 用例遇到正在运行的 City，保留失败，不改成 PASS。最初远程短码用例缺少隔离检查，曾把真实 Alien 进程变为临时测试 City 的 MEMBER；这是复检运行造成的干扰。原数据库身份 `e1d87b2a-0ec5-457e-822b-91d81e40dc67` 保持不变，已恢复 PRIMARY。临时安装文件已单独隔离保留，默认启动器实测重新复用原 City。修补后的安全重跑提前拒绝这三个用例，City ID / PID 不变。

独立干净 Windows runner 已验证修补源码全量 **1248/1248**、Rooms、City test-all、文档检查及 Android 构建成功：[源码 CI 37299383248](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37299383248)，API headSha 精确匹配 ec3b6f9。证据分支 `0ea9203d3409a59194675d48d93950c7af9fb92f` 与源码只差 evidence 文件，其 [V0.2 CI 37299640073](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37299640073) 和 [City linkage 37299640012](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37299640012) 均为 completed/success。

## 手机第四、第五轮

隔离 applicationId `city.utopia.control.join590review`，未卸载或覆盖原 `city.utopia.control`。原应用私有配置与此前备份逐字节一致（本轮采集时）。这是签名不匹配情况下的明确测试差异，不宣称已验证生产包原位升级。

第四轮 APK SHA256 `6790075dbd9f185b85d1dfb95568b9c643cc0432ef3033597d8fe270a5afd712`：`join-c301d67807` 请求成功，不输入无关短码；180 秒内未观测到审批，正常超时，恢复可操作状态。OS 拒绝 adb pm clear，未绕过；使用隔离应用自身“Clear pairing”开始试验。

最终修补 APK SHA256 `970839d29a3066e01ecee8aab3040f9dc2ac81959727b144ab0694dd3d183800`：用户确认 Mech 就绪后创建 `join-535174ce61`，用户回复“已批准”。手机到达 APPROVED / exchange 后显示 `RELAY_ENROLLMENT_REFUSED: Enrollment missing cityId`，125 秒观察未保存凭据；Mech 安装列表只读回读仍为两条，与第三轮一致。后续独立回读确认该请求为 CONSUMED，手机 credentialPresent=false、durableFieldNames=[]；本机 trace 10:59:08.181979Z APPROVED 后 10:59:08.199605Z retry。该回复与旧交换行为一致，但 **Mech 进程源码 SHA 未核实**，不能据此断言某个确切版本正在运行。拒绝保存不完整入网回复是正确行为；跨主机产品验收尚未通过。

当前阻点是 Mech 实际服务需要部署修补网关，保留 canonical City `031fdba6-e94c-4298-a095-6ff04a65481d` 并重新入网。已请求用户协调更新，不用旧 owner token 代替新审批。手机单独重启、安装撤销、City 进程重启，以及真实 Windows 主机链路，均须在更新后的实际产品路径重新验收。

Alien 端已切换修补源码（工作树代码 ec3，证据 head 0ea），启动前确认 0 active task，保持原数据目录和 City ID；当前新 Gateway PID 44580。原 D:/utopia checkout 未修改。此部署事实不等于 merged-main 验收。

## 证据与论文使用边界

[修补候选原始证据及 receipt](https://github.com/zhiheng-zhang-Mera/utopia/tree/0ea9203d3409a59194675d48d93950c7af9fb92f/evidence/raw/mission-book/JOIN590-repair)。[第五轮固化 UI、native trace、只读回读、源码 CI 及 receipt](https://github.com/zhiheng-zhang-Mera/utopia/tree/41e8743d7c49771bcc335add2ee722f73085869e/evidence/raw/mission-book/JOIN590-repair/window5)。41e 是新的 evidence-only head，当前尚待其自身 CI；源码 ec3 CI 与已有证据 head 0ea CI 的成功事实不转移到这个新 head。完整 CI log 留在 Utopia `.runtime`；Digital-City 只保留报告与索引。

可以研究：客户端身份缺失、legacy token 兼容路径、不同 exchange 回复结构、测试对全局 reservation 的干扰、拒绝后的交互恢复、代码验证与实际部署之间的差异。不得将模拟 City 重启升级为 Mech 实机重启证据，也不得将 LAN 可达端点升级为两端不可达 NAT 的远程连接证据。真实 NAT 路由、最终 Windows 物理成员链路、完整 exposure、opposite-host 修补复检和 merged-main post-closeout 仍未完成。`review_complete: false`。


## 第六轮更新后实机联动（2026-10-05，Alien-codex）

用户报告 Mech 已更新；实际服务保持 canonical City `031fdba6-e94c-4298-a095-6ff04a65481d`，运行源码 SHA 尚不能从协议读回，保留 null。Android APK 仍为上述 ec3 修补构建。第五轮失败不撤销，以下是新的独立观测。

- Alien 已有 City 上，手机六位短码在输入超过 3 秒后成功交换；保存完整安装凭据及 `sess:` 成员会话。强制停止并重启隔离应用后，安装身份不变、会话更新、City GET 200。手机点击“退出城市（仅本机）”后旧会话 401、无 Bearer 安装续期 403、原 owner City GET 200；重启仍无会话且显示 retired。原始 retired=false 是脚本读取 Android boolean `.text` 的错误，已在 proof 中注明，不当作产品失败。未覆盖生产包升级验证。
- Mech 新审批请求 `join-0751220e8f` 成功交换。手机保存独立成员凭据；强制重启后同一 installation 和 durable credential 自动换取新会话、City GET 200，无人工令牌输入。
- 实际 Alien Windows 申请 `a8c47038-1114-421e-a6fa-148d657b65c8`，入网名 `Alien-PC-JOIN590`。受信任侧批准后，PID 44580 从 PRIMARY 降为 MEMBER，仅本机原服务退休，Mech canonical City 保持。
- 产品 `scripts/restart-gateway.ps1` 从修补 checkout 运行：PID 41244，MEMBER / ONLINE，仍是同一 Mech City 与安装身份；安装文件不存会话，重新取得成员会话，无人工令牌。Android 实际设备列表出现在线 `Alien-PC-JOIN590`。辅助脚本误试 `/api/v0/devices` 返回 404，是不存在的观察端点，不计设备接口 PASS；真实设备可见性来自手机 UI。
- 手机在 Tasks 选择该 Windows 节点并执行 `CHECKPOINT_DEMO`：`Q-87818c40-a204-46d6-96e6-7da0077085fa`，由 `dev-e1d87b2a0ec5457e822b91d81e40dc67` 完成，SHA256 `4150752ac4f326d3d74dd939e31d6abfa3d8055df4a00d7614f7c360353bf71a`。实际 Web task detail、手机 detail 与 canonical API 对应同一任务及结果，7 events seq 158..164。只证明此次 demo 的跨设备执行及一致呈现，不泛化吞吐或通用资源调度性能。
- Windows 使用自己的成员会话撤销自己的 installation：200，旧会话 401，续期 `INSTALLATION_RETIRED` / 403；Mech public City identity 不变。停掉此 member 后普通 launcher 退出 1，保留 MEMBER role，不存在 4389 reservation，监听检查 4389/4391/4320 均无本地备用 City。Alien 当前刻意保持已撤销状态，不能把手工 PRIMARY 恢复算自动拒绝。

[第六轮不可变原始证据与 receipt](https://github.com/zhiheng-zhang-Mera/utopia/tree/151c065363e52fb6ba38b0332000a7a3687042c3/evidence/raw/mission-book/JOIN590-repair/window6)，16 项安全制品；软件 SHA ec3 与 evidence SHA 151c 分开。41e 的 CI 已独立完成 SUCCESS：[37301659943](https://github.com/zhiheng-zhang-Mera/utopia/actions/runs/37301659943)。新 151c 自身 CI 当前待终态，不转用旧成功。

这些观测完成修补源码上的实际 Windows 入网、member 进程重启、自身撤销/拒绝及跨面 demo。仍待 Mech 主城真实进程重启、其准确运行源码确认、对 Alien 修补的 opposite-host Formal Review、完整 Capability Exposure Gate 和 merged-main post-closeout。两端 NAT 不可直达问题仍未实现，不将当前 /16 LAN 端点说成跨地域实测。review_complete 仍为 false。
