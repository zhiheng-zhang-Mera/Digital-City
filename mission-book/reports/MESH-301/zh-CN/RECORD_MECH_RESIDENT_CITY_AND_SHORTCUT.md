# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_MECH_RESIDENT_CITY_AND_SHORTCUT.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — Mech：City 常驻且可见，有桌面快捷方式；本主机重新进入队列

```text
FROM = Mech   RE = Owner instruction: re-enter the queue, and bring a City up ONCE and keep it resident,
                   like a Computer-Use session - with the run visible on screen.
STATE = done and verified across a call boundary, which is the only way "resident" means anything here.
```

## 1. 启动调用结束后实测当前存在的内容

```text
visible console window   pid 21236   title "Utopia City - Mech-Win (resident)"   HasWindow = TRUE
this host's City         LISTENING on 172.31.12.151:4391   pid 42368
shared canonical City    nodes: Alien-Win=true, Mech-Win=true
desktop shortcut         D:\UserData\Desktop\Utopia City (Mech-Win).lnk
```

关键检查是**跨调用**检查：harness 会在发起调用结束时终止进程树，因此“下一次调用中窗口仍存在、端口仍绑定”才是真正常驻证明，启动成功本身并不是。

## 2. 桌面快捷方式，以及使用 `start` 的原因

```text
D:\UserData\Desktop\Utopia City (Mech-Win).lnk   (930 bytes, WindowStyle = 1 = normal visible window)
  -> D:\A-utopia\.runtime\utopia-city-open.cmd
       start "Utopia City - Mech-Win" cmd /k "D:\A-utopia\.runtime\utopia-city-foreground.cmd"
  -> D:\A-utopia\.runtime\utopia-city-foreground.cmd
       node .runtime\tmp\mesh301-resident-city.mjs      (the supervisor: City + workers, held open)
```

**从非交互会话直接启动 `.cmd` 会获得隐藏控制台**，因此第一次尝试产生了完全工作的 City，却没有任何窗口。这经核验而非假设：进程树为 `cmd /c launcher -> node supervisor -> node gateway`，所有进程 `HasWindow` 均为 `False`、标题为空，而 City 正常监听。`start` 请求 Windows 创建**新**控制台，使运行真正可见；因此快捷方式指向 opener 而非 launcher。

## 3. 常驻内容，以及刻意不声明的事项

- **本主机常驻：** 本主机自己的 City 及 worker。
- **mesh 中常驻：** `Mech-Win` 在**共享 canonical City**（`22e1216b-…`，另一主机的 City）在线；三端 mesh 始终看见此端点，无需每条命令重新启动。
- **未将本主机自己的 City 声明为 MESH-301 canonical City。** 它有不同 `cityId`（`0841938e-…`）。MESH-301 要求一个 canonical City，由 Owner/Alien 决定；启动常驻 City 不意味着可以切换它。因此任务 canonical City 仍在另一主机，本机 City 是独立保有自身真值的常驻实例。
- **凭据在 `.runtime/` 下 launcher 中，此目录被 Git 忽略**（`.gitignore:2:.runtime/`），因此 token 能到达快捷方式而不进入报告、截图或 Git 对象。本记录不出现 token 值。

## 4. 过程中的三项自身错误，全部记录

1. **`CITY_HOST=0.0.0.0` 不可用**，gateway 直接拒绝并要求“配置明确的 loopback 或 LAN 接口”。这是刻意设计的安全性质：City 不得静默出现在所有接口。第一次常驻尝试因此以 `exit code=1` 退出。绑定**实测** LAN 地址后修复，也符合 MESH-301 要求端点只能作为测量事实的规则。
2. **我直接终止进程，而未使用 job 接口**，harness 返回 `Windows Job runner exited with exit code 4294967295 before proving its managed range empty`；命令触及 harness 自身管理的 job 范围。受支持路径是 job 工具，我用它完成其余清理。即使恢复，会破坏会话稳定性的行动也应记录。
3. **PowerShell 字符串往返再次损坏注释**：`-replace | WriteAllText` 把 supervisor 首行长破折号转为乱码，与我在四本 mission-book 工作书报告、且此前自己仪器也遭遇的 GBK 双重编码同类。使用 Node 修复（未用 PowerShell），文件现为 **ASCII-only**，此处不会再出现该类问题。

## 5. 对 MESH-301 改变及未改变的内容

- **改变：** 完成 gate 2 的“两个真实 worker node”现有**持续**在线的 Mech 端点，而非只存在于一条命令内；这很重要，因为有界收敛测量（gate 8）要求事件发出时界面在线。
- **未改变：** 未实现或声明任何 strict-target 行为（开发主机工作），未声明 canonical City，也未推动任何 gate。gate 4、5、8、9 仍未测量，Android control client 完全不在本次范围。
