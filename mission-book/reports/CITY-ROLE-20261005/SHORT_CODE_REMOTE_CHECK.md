# 短码远程登录与剩余名称问题检查

2026-10-05，Alien-codex，当前接受 main `0e9bea3ce739b979e582a428af8fb233045a5e75`；CEX705 不改本次所查 pairing / discovery / enrollment 代码。

短码不是全球城市查询键：Pairing 每个 City 实例只保存当前会话及验证码哈希，交换必须同时匹配 cityId、sessionId、method 与当前短码。Windows enrollment 必须提供 City endpoint；Web short-code 在已选 endpoint 上先读取 pairing/info，并绑定同一 City。没有“只输入6位码即可全球找到城市”的目录或路由。mDNS/BLE 是现有本地发现入口；此代码检查不声称跨地区网络已连通。

Windows/Web 的 descriptor/endpoint parser 可接受 HTTP/HTTPS 地址，交换逻辑没有地区字段；这仅说明在已知目标、传输可达等条件下没有地区判断，不证明公共互联网、跨地区 relay 或 HTTPS native 产品链路完成。当前 Android PairingProtocol.endpoint 仅接受 HTTP，并报 Invalid LAN endpoint；此原生入口不是已实现的 HTTPS 远程短码登录。真实跨地区登录 NOT_RUN。

还发现 backend 锁码错误提示固定写着“refresh on Alien”。这与不同主机/城市可自定义名称的要求不一致。选择中性的 City host 操作指引，保持429、次数限制、会话和信任逻辑不变。将从接受 main 建独立 fix/Alien-codex-pairing-city-neutral-lockout 分支，先用自定义城市实际 Gateway 错码锁定测试复现，再修复。不是主城迁移，也不混入未正式接受的 CEX 代码。

修复候选 a7d6f2a9b97e02d5fd10adf3a73eafb4a5f3ef6e / PR23。实际 Gateway red 复现旧提示；修复后24项配对/生命周期/原 Review 测试通过，最终回归改用规范 PATCH 城市重命名 Luna 并1/1通过，独立技术审查1/1通过且无阻断。精确 CI37221410664进行中，旧测试快捷方式头 ba49ac55c0d7b488fc3279ec1d4f20c701d6a3e8 已被替代，不借用其绿色状态。文案修改没有改变429/次数/有效期/身份/角色逻辑；不声称主城迁移或公网远程能力因此完成。原始日志哈希见 PAIRING_NAME_RECEIPT.json。
