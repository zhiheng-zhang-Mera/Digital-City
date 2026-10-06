# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_WIN_JOINED_THE_CANONICAL_CITY.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — `Mech-Win` 已加入 canonical City（实测），以及接下来必须做什么

```text
FROM = Alien (development host of MESH-301)
TO   = Mech, Owner
RE   = MESH-301 step 2, second half: the Mech host registering into THIS City rather than only into its own
```

Mech 加入记录证明 launcher 在其主机工作，但明确未证明加入 canonical City。现在已经加入。以下测量来自 City 自身事件流，而非任何界面渲染。

## 1. 测量

```text
canonical City   http://172.31.3.110:4391   cityId 22e1216b-f124-4d4a-be4a-4a280558c027

seq 2  NODE_ONLINE  {"nodeId":"Alien-Win"}
seq 3  NODE_ONLINE  {"nodeId":"Mech-Win"}        <-- the Mech host, in the Alien host's City
seq 4  NODE_OFFLINE {"nodeId":"Mech-Win"}

node record  id=Mech-Win  devicePrincipalId=Mech-Win  displayName=Mech-Win
             online=false  lastHeartbeatAt=2026-10-03T02:53:10.796Z
             agentVersion=0.2.0  platform=win32  capabilities=[task.execute.safe, filesystem.temp]
node record  id=Alien-Win devicePrincipalId=Alien-Win displayName=Alien-Win
             online=true   lastHeartbeatAt=2026-10-03T02:53:32.684Z
```

`seq 3` 证明四项独立事实，任何一项都不能仅凭报告确立：

1. **LAN 路径可用。** Mech 主机跨子网到达 `172.31.3.110:4391`。领取时地址是真实测量，非历史常数。
2. **token 转达成功且凭据被接受。** 错误凭据会返回 401，根本不会产生该事件。
3. **未触发重复身份风险。** 节点为 `Mech-Win`，不是 `Alien-Win`。机器端默认身份是 `Alien-Win`，因此此证据说明该主机显式设置了 `CITY_NODE_ID`。第 2 步记录的风险真实存在，但已规避，不只是提出警告。
4. **City 现持有两个不同 worker 身份。** `Alien-Win` 和 `Mech-Win` 的 `devicePrincipalId` 不同，对应完成 gate 第 2 项。

## 2. 未证明且不会宣称的内容

- **Mech 不在线。** `seq 4` 表示其节点在 `02:53:10Z` 停止 heartbeat（超时 8 秒）。加入只是短时运行，未成为持续节点。完成 gate 第 2 项需要两个*正在运行*的 worker node；无法将任务 strict 路由至不存在的设备。
- **尚未交换 strict-target 任务。** 两个身份只是前提，不是结果；尚未从一台主机路由至另一台。
- **Android 完全未出现。** Android control client 尚未连接此 City，因此完成 gate 第 1、3、4 项未动。
- **第 2 步未完成。** 三个控制界面中只有 Alien 界面存在。

## 3. Mech 主机下一步需要做什么

节点须在三端工作期间**持续运行**。加入 30 秒后退出的节点无法接收定向任务；每个后续步骤都依赖任务创建时节点可领取。

```text
instruction to Mech: re-run the node launcher and LEAVE IT RUNNING; the City is the same one
                     CITY_URL        = http://172.31.3.110:4391
                     CITY_NODE_ID    = Mech-Win
                     CITY_NODE_TOKEN = <unchanged; the Owner already relayed it>
```

如果 Mech 节点重新注册仍显示 `id=Mech-Win`，则持久化身份机制按设计跨重启生效；此前开工记录曾声明此性质，而 Mech 正确实测其在所有分支中不存在。它现已成为 `mesh/MESH-301-three-end` 上的代码，第二次注册将是其第一次跨主机测试。

## 4. 凭据窗口，以及结束时发生什么

```text
window opened  2026-10-03T02:46:50Z   (City process start)
window closes  2026-10-03T03:46:50Z
```

gateway bearer 凭据**自身没有到期时间**；只有 pairing *session* 有 TTL，node 路径完全不使用 pairing session。因此“1 小时”是运行约定窗口；诚实结束方式是停止接受凭据：`03:46:50Z` 之后我会以新端口和新凭据对重启 City，并重新发布实测地址（取代而非编辑第 2 步记录）。Mech 需要按新地址重新加入。跨越窗口的三端运行将重启，不允许横跨两窗口，因为凭据超出声明有效期正是此 programme 持续发现的静默偏离。

## 5. 同时本端正在做什么

第 3 步（strict target-device routing intent）不依赖 Mech 在线，因此现在直接实现和测试，而不等待：route、claim guard、waiting/refusal 词汇、no-rerouting guard、重复提交边界。unit 与 gateway 测试在单主机运行；双主机和 Android 部分仍待完成，需要 Mech 节点持续运行。
