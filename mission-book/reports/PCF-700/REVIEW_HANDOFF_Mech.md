# PCF-700 复检交接 / Review handoff (author → opposite host)

```text
TASK_ID            PCF-700
REVIEW TARGET      a2a567325e6ce08629eefbe67cda6f8f2c16fd64
BRANCH             pcf/PCF-700-mech-ownership-and-reality-audit（= pcf/series-mech 当前头）
BASELINE           312b627b54af5bbf274fa25eca8f8383869c1c34
AUTHOR HOST        Mech（COMPUTERNAME MEGA-REP，role Mech-DS）
REVIEWER          另一实体主机（§3 禁止自审；本文件**不是**复检声明，也不构成裁决）
DELIVERABLES       docs/zh-CN/pcf/ownership-map.md, docs/en/pcf/ownership-map.md,
                   tests/pcf700-compatibility.test.mjs, scripts/check-bilingual.mjs
REPORT             reports/PCF-700/DEVELOPMENT_REPORT.md
```

> 复检目标说明：前一交付头 `d611cfe5f0272673706b9dc5c9f6b85ed40a9406` 在 hosted CI 上因 step `pnpm check:docs`
> 失败（仓库闸门 `scripts/check-bilingual.mjs` 只读一层目录，遇到工作书要求的 `docs/*/pcf/` 嵌套直接 EISDIR）。
> 修复头 `a2a5673` 含该闸门的树感知修复，**复检请以 a2a5673 为对象**；失败头与根因保留在 DEVELOPMENT_REPORT §2.5。

## 1. 本交接存在的原因 / Why this file exists

PCF 系列 701..728 **全部**（直接或间接）依赖 PCF-700，而 PCF-701 达到 READY 要求依赖 status=COMPLETE。因此本系列当前唯一关键路径是**本任务的异机复检**。作者把复检所需的精确头、可复现命令与可被证伪的断点一次列全，避免复检方再去猜证据在哪；作者本人不做裁决、不把本文件写成 REVIEW_REPORT。

## 2. 复检方需要独立制造什么（不要读作者结论当证据）/ What the reviewer must manufacture independently

```text
R1 独立取得精确头：git ls-remote origin pcf/PCF-700-mech-ownership-and-reality-audit，
   确认等于 a2a567325e6ce08629eefbe67cda6f8f2c16fd64；再确认 312b627b54af5b 是该头祖先。
R2 独立重跑作者套件：corepack pnpm install --frozen-lockfile && corepack pnpm --dir city install --frozen-lockfile
   （两步必须都做：根目录 node_modules 是 junction 时 city workspace 不会被装上），
   然后 node --test tests/pcf700-compatibility.test.mjs，以及仓库闸门 pnpm check:docs。作者的实测是 7/7 与
   三处 PAIR_STATUS = SYNCHRONIZED，复检方须自测。
R3 证伪 R2 而不是复述：至少挑两条兼容反例自造输入使其失败再复位（例如让 strict target 命中真实在线节点，
   期望 C3 的 withheld 断言**变为不成立**），确认套件不是恒真。
R4 独立制造样本调用链的**异机**证据（TWO_HOST_VERIFIED 档）：本机侧只做到单机 LIVE 证据。
R5 核对 ownership-map 的三层接线判断是否与本机实测一致，特别是 `chooseHybridTarget` 的 NOT_WIRED 结论：
   复检方应在自己的 checkout 上 grep 调用点，而不是采信作者的 grep 结果。
R6 明确记录复检方仪器自身的错误（作者已记四条，见 DEVELOPMENT_REPORT.md §2）。
```

## 3. 可被证伪的断点清单（复检方优先攻这里）/ Falsifiable seams to attack first

```text
S1  strict target 是真的接在领取路径里（C3），还是仅是导出函数 —— 攻击：造一个目标不在线的任务，用另一节点领取。
S2  `chooseHybridTarget` 是否真的没有 gateway 调用点（C6）—— 攻击：找到任何一处生产调用即可推翻该结论。
S3  worker-pool 是否真的 registered-but-inactive（C7）—— 攻击：让 profile 切到 hybrid/worker 看是否真被选为 active。
S4  裸 City 是否真的不产生任何 pcf 命名状态（C1）—— 攻击：在全新数据目录启动后递归列出目录，找 pcf 痕迹。
S5  descriptor 契约对 legacy 记录宽容、而 live register 要求 capabilities（C5）—— 攻击：用真实旧记录走两条路径。
```

## 4. 作者已声明的未完成项（复检方不应把它们当缺陷，也不应放过）/ Declared unfinished

```text
规格修订 2 的五档核对（EM 连接器/Foreman、RF、GAI、WBC、原端工具）；
UI→backend 逐文件依赖矩阵与机器可读单写者清单；
「已验收 EM/RF/GAI 组件与 PCF 复用边界」表。
三项均写在 ownership-map.md §7 与 DEVELOPMENT_REPORT.md §6，属**未完成**而非已通过。
```

## 5. 边界 / Boundaries

```text
作者未跨过：不采购/不付费、不装系统服务、不改运行 profile、不启用远端执行、不合并（merge_authority=false）。
常驻 City（pid 44088，172.31.12.151:4391）未被本任务触碰。
复检方若需要越界动作，应在裁决里写成显式问题，而不是顺手执行。
```
