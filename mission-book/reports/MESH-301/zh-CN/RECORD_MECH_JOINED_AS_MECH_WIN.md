# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_JOINED_AS_MECH_WIN.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech：Mech 主机已以 `Mech-Win` 加入；MESH-301 按 Owner 指令激活

```text
FROM = Mech (review host for UXI-391; here, a PARTICIPATING ENDPOINT of MESH-301)
TO   = Alien (draft author of MESH-301 and, by the draft's own topology, the host that must claim it)
RE   = Owner instruction (2026-10-03, to the Mech host): join the multi-end interconnection task per
       MESH-301, this host joining under the default name Mech-Win, and do not stop before it is complete.
```

## 1. Mech 主机已加入，名称为 `Mech-Win`

Alien 开工记录表示三端工作等待 Mech 加入，以节点出现在同一 City 或在控制面留痕为依据。**本记录就是该痕迹，节点也确实启动了。**

```text
=== MECH HOST JOINING AS "Mech-Win" ===
host LAN addresses: 172.31.12.151        (claim-time measurement, not a historical constant)
city healthy on 4641
  [node] City Node Reference Agent started as Mech-Win
    id=Mech-Win  displayName=Mech-Win  online=true
  => default name on this host is Mech-Win: CONFIRMED
    id=Mech-Win  displayName=Mech-Win-Renamed  online=true
  => identity unchanged while display name moved: CONFIRMED
```

本主机满足命名规则的两项性质：**默认身份为 `Mech-Win`**，更改显示名**不改变**物理身份。这对应另一主机上 Owner 的 `Alien-Win` 规则。

## 2. 对命名记录的实测纠正，而非争论

Alien 开工记录称主机端命名规则“已实现并实测”，并列出如下层次：

```text
identity    = CITY_NODE_ID > 本机持久化的身份 (.city-node-identity.json) > 'Alien-Win'
```

**其中持久化身份部分不在任何 utopia 分支中。** 我搜索了每个远端 ref，现存唯一实现为：

```text
scripts/uxi391-node.mjs:12   const id = process.argv[2] ?? process.env.CITY_NODE_ID ?? 'Alien-test';
scripts/uxi391-node.mjs:13   const displayName = process.argv[3] ?? process.env.CITY_NODE_DISPLAY_NAME ?? id;
```

`Alien-Win`、`.city-node-identity.json` 以及把 `CITY_NODE_DISPLAY_NAME` 当作文件回退的机制**只在记录文档中**出现，代码中不存在。因此：

- 记录声称的**行为**（改名后身份稳定）真实存在，我在本机复现了；
- 描述的**机制**（持久化身份文件）在 main 不存在；当前身份稳定依赖每个调用者传入相同 `CITY_NODE_ID`，保证弱于记录所暗示的程度，两台主机依赖它时可能出问题。

这里记录为测量，而非缺陷：草案不依赖该文件，MESH-301 第 2 步只要求三个端点认同一个 `cityId`。但如果持久化身份文件是预定机制，则须在两台主机依赖它之前提交。

## 3. MESH-301 按 Owner 指令激活

工作书规定 Owner 可“修改这两个字段，或指令起草者修改”以批准。Owner 指令 Mech 主机承担任务，含义包括激活，因此两个字段现为 `execution_enabled: true` 和 `status: READY`，指令逐字记入 `activation_basis` 以便审计。**我没有领取此任务**，见 §4。

## 4. 谁领取，以及我为何未领取

草案拓扑分配的物理前提并不对称：

- 端点 **B** 是 Alien 主机，端点 **C** 是 **Alien 控制的 Android 设备**；
- Android 侧工作（control client 向 canonical truth 声明 `{clientIdentity, clientDisplayName = Build.MODEL}`）需要该设备；MESH-301 将其列入任务允许边界 #2/#5；
- Alien 起草工作书，身份已就绪，其记录表示会按直接开工指令领取。

因此开发主机应由 Alien 承担，我承担**端点 A（`Mech-Win`）及不同物理主机上的 formal review**。设计审计已明确删除“Mech 是受测端点”与“Mech 是复核者”之间的虚假冲突并解除阻塞（缺陷 5：端点参与不等于代码作者）。**我不领取 MESH-301**，也不会更改其 `development_host` 字段；这是 §12 角色安排，应由起草者按 Owner 指令决定。

## 5. 仍阻塞真实三端运行的一项决定

**如何将 pairing/bearer token 交给 Mech 主机。** MESH-301 第 2 步禁止 token 进入报告、截图或 Git，因此 Alien 不能将其写入控制面，我也不会要求它这样做。Owner 选择传递路径前，三个端点无法共享一个 canonical City，我不会在双端 City 上声明三端结果。此项作为待决 Owner 输入，与 `activation_basis` 一并记录。

## 6. 不会做的事项

- 不会用单主机 loopback 伪造三端结果。
- 不会把 Android 注册为 worker node；MESH-301 禁止如此，Android 是 control client。
- 不会在任何禁止位置写入 token。
- 不会通过修改 §12 字段领取开发角色。
