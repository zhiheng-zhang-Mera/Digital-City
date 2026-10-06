# City 联机测试日志（City live-test log）

> **状态：ACTIVE / 日志目录**
>
> 本目录是 **City 联机测试**的云端登记与判定台账。本机（Alien）在每次联机测试时登记一轮，并把**有界**收据
> 与判定写入这里；**原始**过程数据（日志、sqlite、.jsonl 原件、备份）留在施工机的 `.runtime/`（Git 忽略），
> 不进本目录。
>
> 上位规则：[../CONSTRUCTION_RULES.md](../../CONSTRUCTION_RULES.md)・过程数据边界：[../PROCESS_DATA_POLICY.md](../../PROCESS_DATA_POLICY.md)

## 1. 为什么这个目录在 Cloud 而不是只在施工机

Owner 的直接指令：**联机测试日志目录必须建在 GitHub 云端**，否则"这台机器跑过一次联机测试"这件事只存在于
本机磁盘上，控制面看不见。本目录因此是**控制面事实**：哪一轮、谁参与、跑到什么程度、判定是什么。

Mission Book 此前没有 `logs/` 这一层，本目录是**按 Owner 指令新增**的类别，记在这里而不是悄悄塞进
`reports/`：`reports/` 装的是"某个工作书的开发/复核结论"，而联机测试是**跨工作书、可反复运行**的活动
（JOIN-501 / JOIN-503 / 后续 MESH 类任务都要跑），两者生命周期不同。

## 2. 判定口径（先写死，避免事后挑标准）

```text
RUN            = 一次联机测试
参与者          = 发起主机 + 至少一台第二实体主机
PASS           = 全部检查通过，且参与者齐备
FAIL           = 有检查 FAIL（收据里写观测值，不写结论）
NOT_RUN        = 指定的第二主机在窗口内未加入
DEFERRED       = 需要真实第二主机才能判定的部分，明确留到阶段集成
```

**`NOT_RUN` 不等于通过，也不等于失败**：它只说明"这一轮没有形成双主机拓扑"。单主机双进程结果**不得**用它
冒充双主机结论（`deferred != passed`）。

## 3. 凭据纪律

- 控制令牌 / 节点令牌 / 长期设备凭据**绝不进入本目录**，也不进入任何 Git 对象；
- 登记文件只写"已配置"，收据只写凭据的**存在性与长度**，不写值；
- 联机测试用的 City 端点、cityId、SHA、CI run 号属于可公开事实，照写。

## 4. 目录约定

```text
README.md            本文件：口径与纪律
register/            每轮登记（RUN_ID、参与者、范围、判定）
receipts/            每轮有界收据（逐项 PASS/FAIL/NOT_RUN 的观测）
```

## 5. 已登记轮次

| RUN_ID | 日期 | 发起 | 第二主机 | 判定 |
|---|---|---|---|---|
| [JOIN-LIVE-2026-10-03-01](./register/JOIN-LIVE-2026-10-03-01.md) | 2026-10-03 | Alien | Mech | **NOT_RUN**（Mech 5 分钟窗口内未加入）+ Alien 单侧 38/38 自测 |

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **2**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|
| register | 1 | [打开 / Open](register/JOIN-LIVE-2026-10-03-01.md) |

<!-- DOCUMENT_NAVIGATION:END -->
