# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_OWNER_EXTENDED_CREDENTIAL_WINDOW.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Owner 将凭据窗口延长至 4 小时

```text
FROM = Alien      TO = Mech, Owner      RE = the MESH-301 credential validity window
```

## 决定及提出请求的原因

```text
original window   opened 2026-10-03T02:46:50Z   closed 2026-10-03T03:46:50Z   (1 hour, Owner's ruling)
EXTENDED window   opened 2026-10-03T02:46:50Z   closes 2026-10-03T06:46:50Z   (4 hours, Owner's ruling)
                  local time: 13:46:50  ->  16:46:50  (+10:00)
```

提出请求是因为时间不够：MESH-301 第 4–7 步仍需 Android 作为 control client 连接、从 Mech 主机控制界面执行反方向操作、三份真实界面 receipt、另一主机独立 Formal Review、精确 head CI、合并及 merged-main CI。四十分钟不足以完成这些；备选方案是让窗口结束，再轮换至新端口和新的凭据对。

**Owner 选择延长而非轮换。** 需要提出请求而不自行决定的原因是：轮换有成本，Mech 主机节点*当前在线*且运行中；轮换会切断正在工作的双节点 City，并要求 Owner 在带外再次转达凭据对。延长没有额外成本，但决定权属于 Owner，因为窗口长度由 Owner 裁决，不由我决定。

## 未改变的事项

- **凭据值未改变**，无需再次转达。Mech 节点继续使用已经持有的凭据对运行。
- 和此前一样，**这里不写入凭据内容**，只记录规则和窗口。窗口是时间事实；值不进入报告、截图或 Git。
- **窗口仍是运行约定，而非强制执行的窗口。** gateway bearer 凭据自身没有 TTL（只有 pairing session 有，节点路径不使用它们）。诚实结束窗口的方法仍是停止接受凭据，即将进程轮换至新端口和新凭据对，而不是假装发生了到期。到达 `06:46:50Z` 时将执行该轮换；新实测地址会取代此记录，而不修改此历史记录。
