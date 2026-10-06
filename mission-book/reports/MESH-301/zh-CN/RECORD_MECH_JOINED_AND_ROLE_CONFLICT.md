# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_JOINED_AND_ROLE_CONFLICT.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech：`Mech-Win` 已加入 canonical City；角色冲突由 Owner 决定

```text
FROM = Mech   TO = Owner (for the role conflict), Alien (for the join evidence)
STATE = MESH-301 step 2's worker-node half is DONE. A role conflict exists and I have NOT resolved it by force.
```

## 1. 已加入，同一 City 内有两个真实 worker node

两项凭据均通过带外到达，本主机终于可以注册。结果针对另一主机 City 而非本地 City 实测：

```text
BEFORE   cityId=22e1216b-f124-4d4a-be4a-4a280558c027  nodes=1   Alien-Win online=true
AFTER    cityId=22e1216b-f124-4d4a-be4a-4a280558c027  nodes=2
           id=Alien-Win  displayName=Alien-Win  online=true
           id=Mech-Win   displayName=Mech-Win   online=true
```

因此 MESH-301 完成 gate 2——**Alien 和 Mech 是两个真实且不同的 worker node**——满足。City 在另一主机（`http://172.31.3.110:4391`），不是 loopback 启动。按工作书要求在领取时测量可达路径，未沿用早前任务地址。

## 2. 凭据缺口已关闭，与 Alien 自身决策规则一致

Owner 转达一个值，gateway 需要两个。Alien 的 D1 记录已作同样推导并选择规则：**control 凭据原样使用 Owner 值；node 凭据在其后加 `-node`**，通过派生而非另行请求，使 Owner 转达一组且无需另造秘密。随后 Owner 提供的 node 凭据正是 `-node` 形式。**本文件、任何截图及 Git 均无 token 值**，只有规则，符合 MESH-301 第 2 步。

记录此事，因为花费了一轮：我首先为两个角色尝试同一值，`POST /api/v0/node/register` 返回 `Invalid pairing token`，而 `GET /api/v0/city` 接受该值。因此 control/node 凭据结构性分离（`server.mjs auth()` 在 node 路由比较 `nodeToken`），且 **pairing 不能替代 node token**，因为 `pairing.exchange()` 返回 control token，即 `credential: this.credential`。我探测 pairing 路由确认，而非假设。

## 3. 角色冲突：本端不会强行解决

- **Alien 在控制面提交 `f532089` 领取 MESH-301 开发角色**（“领取时核对后，Alien 在 Utopia main ec12fd0 领取三端 mesh……”）；第 2 步记录亦自称开发主机，并已启动 City。
- **Owner 曾将开发分配给 Mech。** 直接询问角色安排后，Owner 选择“Mech 开发，Alien 正式复核”，另指令本主机以默认名 `Mech-Win` 加入任务。

两者无法同时成立；§2 要求领取**原子化**，§12 将角色安排交给 **Owner**。因此：

- **我没有推送竞争领取。** 本地分支短暂存在此领取，随后使用 `git reset --hard origin/main` 放弃，未推送覆盖已有领取，也未修改 Alien 当前持有的 `development_host`。
- **我不把 Owner 回答当作覆盖字段理由。** 口头裁决有权威，但修改领取的机制是领取者释放；复核主机伸手夺取，是本 programme 已裁决禁止的失败模式。

**Owner 需决定：** Alien 是否释放，让 Mech 按此前裁决开发；或修订裁决，让 Alien 保持开发，Mech 承担端点 A 和正式复核。后者无需返工，因为 Alien 已做第 2 步且控制 Android 设备，但选择权不属于我。

## 4. 无论角色如何安排，同时将做什么

**任一**安排均需要、且不属于任何领取的工作：

1. 保持本主机 `Mech-Win` 可加入，并记录启动参数：身份使用 `CITY_NODE_ID`、City 按领取时测量、凭据带外传递；
2. 记录另一主机指出的**重复身份风险**，确认本主机不涉此风险；
3. 准备开发与复核双方都需的三端测量仪器（server-`seq` 收敛 probe、负对照）。第 5 步要求基于 canonical `seq` 的有界收敛 probe；不论作者是谁，第 6 步都要求负对照。

开发角色确定前，不开始 strict target-device routing contract；这是实际产品改动，在有争议领取下编写，正是原子领取规则防止的领取冲突。

## 5. Owner 已解决，与本端请求相反

请求解决后，Owner **修订早前回答**：

```text
roles = Alien develops; Mech is endpoint A (Mech-Win) plus the formal reviewer
note  = Alien's drafting task was revised by a third party, so it is allowed to proceed and Alien is NOT to be
        treated as a duplicate participant
```

**后果明确记录，因为改变本端立场而不只是手续：**

- **无需解决领取冲突，且从未推送竞争领取。** Alien 的 `f532089` 领取未受挑战；§3“两安排无法同时成立”对当时收到的回答属实，Owner 现修订早前安排使之统一。
- **本端无开发领取，也不会领取。** 已放弃的本地领取提交继续保持放弃。
- **本端承担端点 A 及正式复核**，正是 MESH-301 设计审计删除缺陷 5 后确认的组合。端点参与不等于作者身份；唯一要求是 Development/Formal Review 在不同物理主机。本端非开发主机，因此结构性满足要求。
- **1 小时凭据窗口与加入不受影响**：无论安排如何，`Mech-Win` 仍是 canonical City 中真实注册的 worker，符合 MESH-301 对本主机所需。

**作为自身记录纠正追加，而不重写 §3**，因为顺序重要：本端报告冲突、拒绝强行解决，Owner 随后消除冲突。若仅显示最终状态，会隐藏拒绝强占领取如何保护两主机工作的过程。

