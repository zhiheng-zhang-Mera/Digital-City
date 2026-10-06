# REX-803 基准与领取

[English source / 英文原文](../BASELINE.md)。本文为阅读译本，当前任务事实以工作书和源报告为准。

主机 Alien（Mera-Alianware），Development 角色。实现 baseline：`1a26d7499d3de39b19c3136c3032e8ccd9343428`。fetch 远端 main，并独立检查 required base `69a097b5394a9fece39dd11cc13f04c9b4d28bfe`、REX-801 `7e96a4d28f4cb701d7a0951bace69857c3228f32`、REX-802 `833279cae237080cca88b1b6dbc9f217027ba68f` 的 ancestry，均退出 0；main 已包含依赖 union。既有 SHOW 与产品 worktree 保留。

Owner 顺序：按 research-strengthening 中符合资格的任务编号升序，然后 monitor；SHOW 排除。正式 Review 由 Mech 执行。每次状态跃迁前重新验证 claims 和 dependency state。无 merge authority。
