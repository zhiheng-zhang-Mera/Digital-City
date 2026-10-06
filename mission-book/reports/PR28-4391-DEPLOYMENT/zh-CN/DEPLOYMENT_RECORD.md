# PR #28 部署到 4391 常驻 City

阅读译本 / Reading translation：本完整阅读译本保留历史记录，不构成第二份权威部署记录。以下原始证据块逐字保留，并提供对应中文说明。

```text
KIND                OWNER_DIRECTED_DEPLOYMENT (not a claim; no workbook, no marker)
AUTHORITY           owner instruction, 2026-10-05: "更新目前的4391端口到云端PR#28"
PERFORMED BY        Mech (MEGA-REP), role Mech-DS
HOST                http://172.31.12.151:4391   City 031fdba6-e94c-4298-a095-6ff04a65481d
DATA DIR            C:\ProgramData\Utopia\host\city   (unchanged; identity, members and history preserved)
PREVIOUS CODE ROOT  D:\utopia      @ 48cbc21376007c5461e8e456a898c3f788f0fa77  (= current origin/main lineage)
NEW CODE ROOT       D:\utopia-pr28 @ 0ea9203d3409a59194675d48d93950c7af9fb92f  (PR #28 review/JOIN-590-Alien-codex)
PREVIOUS PID        24100
NEW PID             5092
```

类型为 OWNER_DIRECTED_DEPLOYMENT（不是领取任务；没有工作簿或标记）。依据为 Owner 在2026-10-05要求“更新目前的4391端口到云端PR#28”。执行者是 Mech（MEGA-REP），角色 Mech-DS。主机、City UUID、数据目录、前后源码根及精确 SHA、前后 PID 均见原块。数据目录不变，身份、成员和历史保留。

## 1. 部署内容及运行安全依据

Owner 指定 PR #28（`fix(JOIN-590): durable Android membership and secure reconnect`）。通过 API 读取其精确头，而非仅依据分支名。

```text
PR #28   base main   head review/JOIN-590-Alien-codex   headRefOid 0ea9203d3409a59194675d48d93950c7af9fb92f
CI       gateway-web SUCCESS x2, android SUCCESS x2, reciprocal-contract SUCCESS   mergeable MERGEABLE
DELTA vs the previously deployed code (48cbc21): 100 files, +7472 / -224 - the JOIN-590 Android enrollment,
         relay joining, short-code entry and reacceptance evidence.
```

PR 以 main 为 base，头分支 review/JOIN-590-Alien-codex，精确 headRefOid 见块。gateway-web 与 android 各两次 SUCCESS，reciprocal-contract SUCCESS，mergeable 为 MERGEABLE。相对于原部署48cbc21，变化100文件、+7472/-224，涉及 JOIN-590 Android enrollment、relay joining、短码输入及重新验收证据。先前运行 City 属于 origin/main 谱系，因此本次只沿 JOIN-590 维度升级；4391 原有可用功能没有被更旧版本替代。

## 2. 如何切换并保留 City

```text
1  git worktree add -b deploy/PR28-4391 D:\utopia-pr28 0ea9203d3409a59194675d48d93950c7af9fb92f
2  npm ci  +  npm install --prefix city          (the worktree's own dependencies)
3  PRE-FLIGHT: the new tree's launcher was asked what City it sees, BEFORE anything was stopped
     -> {"endpoint":"http://172.31.12.151:4391","cityId":"031fdba6-e94c-4298-a095-6ff04a65481d",
         "gatewayPid":24100,"dataDir":"C:\\ProgramData\\Utopia\\host\\city"}
   This is the step that makes the swap safe: a worktree that could NOT see the same state directory would have
   started a second, unrelated City in a fresh directory.
4  scripts\stop-city.ps1   (validates the PID owns services/dev-gateway/main.mjs before killing it)
     -> "Stopped host City 031fdba6-… Data retained at C:\ProgramData\Utopia\host\city"; coordination port released
5  scripts\start-city.ps1 -BindAddress 172.31.12.151 -Port 4391     (the same options the City already ran with:
     CITY_MANAGE_SERVICES=1, rooms 4320, discovery and telemetry enabled)
     -> "Utopia Host running at http://172.31.12.151:4391; City 031fdba6-…; Gateway pid 5092"
```

先在指定精确 SHA 建立 deploy/PR28-4391 工作树，并安装该工作树自己的根目录及 city 依赖。停止任何进程前，让新树 launcher 读取所见 City；回报相同 endpoint、City UUID、原 Gateway PID24100 和同一持久数据目录。这是切换安全的关键：若工作树看不到同一状态目录，它会在新目录启动第二个无关 City。stop-city.ps1 在终止前验证 PID 确实属于 services/dev-gateway/main.mjs；停止后保留数据并释放 coordination 端口。然后使用原有 BindAddress172.31.12.151、Port4391、CITY_MANAGE_SERVICES=1、rooms4320以及启用的 discovery/telemetry 启动，得到原 City 与新 PID5092。

## 3. 切换后验证

```text
coordination 127.0.0.1:4389    state=ONLINE  gatewayPid=5092  endpoint=http://172.31.12.151:4391  servicesManaged=true
city identity                031fdba6-e94c-4298-a095-6ff04a65481d  (UNCHANGED)
credential                   local-config.json token SHA-256 prefix 71EF027362A8, identical to before the swap, so the
                             owner's existing page session stayed valid instead of being logged out by a new token
web surface                  GET / -> 200, GET /app.js -> 200
rooms                        http://127.0.0.1:4320/ -> OK
event continuity             last event before the swap was seq 128; after the restart 129 CITY_STARTED,
                             130 NODE_ONLINE, 131 CLIENT_CONNECTED (clientLabel Mech-rep) with no later
                             CLIENT_DISCONNECTED - the open page reconnected by itself and stayed connected
```

127.0.0.1:4389 的 coordination 为 ONLINE，新 PID5092、endpoint 不变且 servicesManaged=true；City UUID 未变。local-config.json 凭据 SHA-256 前缀71EF027362A8与切换前一致，Owner 已有页面会话没有被新 token 登出。GET / 和 /app.js 均200，Rooms4320正常。切换前最后事件seq128，重启后129 CITY_STARTED、130 NODE_ONLINE、131 CLIENT_CONNECTED（clientLabel Mech-rep），之后没有 CLIENT_DISCONNECTED；已打开页面自行重连并保持连接。

## 4. 先前诊断发现且本部署修复的缺陷

部署前调查 Owner 的“4391 城市没有在线”报告，发现一个恰好由 PR #28 修复的真实问题。

```text
FINDING (pre-#28 code)  the City's own local worker agent registered with a HARDCODED identity taken from one
                        developer's machine: agents/reference-node/agent.mjs startAgent() defaulted to
                        id='alien-reference-node' / displayName='Alien-PC', and services/dev-gateway/main.mjs called
                        it without an identity. So on this host the local agent was ONLINE but labelled "Alien-PC",
                        while this host's own node id sat offline - exactly the kind of "the city is not online"
                        reading the owner reported.
EVIDENCE (pre-#28)      nodes: alien-reference-node online=true heartbeat 10:11:57Z (telemetry uptime 4996s, i.e. the
                        process the City started minutes earlier) and dev-031fdba6…e94c4298a0956ff04a65481d
                        online=false heartbeat 03:25:11Z.
FIXED BY PR #28         main.mjs:59 now passes id:'dev-'+cityId and displayName: config.deviceName||hostname();
                        agent.mjs defaults are now id='host-'+hostname() / displayName=hostname().
EVIDENCE (post-#28)     nodes: Mega-rep online=true heartbeat 11:15:35Z; Alien-PC online=false (a stale row left by
                        the pre-#28 process that this deployment stopped).
```

旧代码本地 worker 使用开发者机器硬编码身份：agent.mjs 的 startAgent() 默认 id 为 alien-reference-node、displayName 为 Alien-PC，而 main.mjs 调用时不提供身份。因此本机 agent 虽 ONLINE 却显示 Alien-PC，本机自己的节点 id 却离线，正好会造成 Owner 所报告的读法。原证据为 alien-reference-node online=true、heartbeat10:11:57Z、uptime4996s（即数分钟前启动的 City 进程），dev-031fdba6…e94c4298a0956ff04a65481d online=false、heartbeat03:25:11Z。PR #28 的 main.mjs:59 传入 id:'dev-'+cityId 与 displayName:config.deviceName||hostname()；agent.mjs 默认改为 host-加hostname及hostname。部署后 Mega-rep online=true、heartbeat11:15:35Z，Alien-PC online=false，是停止旧进程后留下的历史行。

明确不删除陈旧 Alien-PC 行：Owner 说“暂时不动”，移除设备行属于 City 状态变更，不属于本次部署。

## 5. 明确未执行的事项

```text
- the stale offline node row is left in place (§4)
- no pairing session was generated for the handset
- no workbook was opened for the agent-identity defect, because PR #28 already fixes it on the live path
- the handset's earlier join request (join-eab97ea241) was APPROVED but never collected: the phone disconnected before
  the approval. It must retry once; that is a client action, not a City action.
```

保留第4节陈旧离线行；没有为手机生成配对会话；没有为 agent 身份缺陷创建工作簿，因为 PR #28 已在实际路径修复它。手机此前 join-eab97ea241 请求已 APPROVED，但手机在批准前断连，批准结果从未领取；需要手机重试一次，这是客户端动作而非 City 动作。

## 6. 回滚

```text
cd D:\utopia-pr28 ; .\scripts\stop-city.ps1
cd D:\utopia      ; .\scripts\start-city.ps1 -BindAddress 172.31.12.151 -Port 4391
```

先在 D:\utopia-pr28 停止 City，再从 D:\utopia 用原绑定地址和4391端口启动。旧版本仍检出在 D:\utopia，精确 SHA `48cbc21376007c5461e8e456a898c3f788f0fa77`，数据目录从未移动，因而回滚恢复部署前相同 City。

语言配对 / Language pair: [原文 / Source](../DEPLOYMENT_RECORD.md)
