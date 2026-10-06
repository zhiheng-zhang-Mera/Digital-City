# PCF-700 作者侧冻结与配合声明 / Author hold and cooperation note

对侧实体主机已接入并开始 PCF-700 的正式复检。本文件是**作者侧**的冻结声明与配合口径，用于消除复检期最常见的失败模式：**目标头在复检途中被移动**。

```text
STATUS             AUTHOR_HOLD_ACTIVE（这不是复检、不是裁决、不释放任何 terminal marker、不改 review_* 字段）
REVIEW TARGET      659ff6aa98bc5675862b1170ed0cf5e1b78dba5f
BRANCH             pcf/PCF-700-mech-ownership-and-reality-audit
SERIES BRANCH      pcf/series-mech（同指该头）
AUTHOR HOST        Mech（COMPUTERNAME MEGA-REP，role Mech-DS，development side）
CLAIM STATUS       截至本文件撰写：工作书 review_host 仍为 null，远端尚无 review/PCF-700-* 分支 —— 领取由复检方发布，作者不代填
```

## 1. 冻结承诺 / Freeze

```text
· 在复检给出裁决（或明确要求）之前，作者**不再向上述两条分支推送任何提交**，也不 rebase/merge main 进它们，
  因此复检目标头保持不变。
· 若复检发现需要修复的缺陷：作者会在**新头**上修复，并在修复记录里写明「针对哪条 finding、以哪个头为基线」，
  同时保留被复检头 `659ff6a` 的全部记录（失败头不删除，也不借新头的绿色）。
· 作者不会改动 `review_host` / `review_head_sha` / `review_ci` / `review_complete`，也不会创建、修改或删除
  复检方的领取文件与报告，更不会释放 terminal marker。
· City 侧（Digital-City）作者仍会更新**作者自己的**记录（报告、看板、任务板非 review 字段）；若这些更新与复检
  结论冲突，以复检方的 REVIEW_REPORT 与工作书 frontmatter 为准。
```

## 2. 冻结头的事实位（复检开始时刻）/ Facts at the frozen head

```text
HEAD              659ff6aa98bc5675862b1170ed0cf5e1b78dba5f
远端一致性         git ls-remote 实测：任务分支与系列分支**都等于**该头
CI                V0.2 checks run 37502818037 completed / success（gateway-web success、android success）
                  `pnpm test`（含 tests/pcf700-compatibility.test.mjs 与 tests/pcf700-dependency-direction.test.mjs）
                  与 `pnpm check:docs` 都在该头上跑过且成功
作者在冻结头重算    scripts/pcf700-review-packet.mjs => 8/8，退出码 0
                  scripts/check-bilingual.mjs => docs / evidence / data-records 三处 PAIR_STATUS = SYNCHRONIZED
复核时间           2026-10-06T21:52:12Z（Mech 主机）
```

## 3. 作者会怎样处理 finding（先写口径，事后不解释）/ Handling protocol

```text
F1 范围内、阻塞性缺陷 → 在**新头**修复，附最小复现与回归证据，发布 REPAIR 记录；被复检头保持不动。
F2 范围内、非阻塞 → 记录为 finding + 影响面 + 是否影响验收结论，由复检方裁定是否需要修复。
F3 超出本书范围（例如 PCF-701+ 才该做的实现）→ 标 `NOT_IN_SCOPE_OF_PCF-700` 并指向应归属的工作书，
   不借复检扩权、不顺手实现。
F4 复检方仪器自身的问题（例如把导出函数当成已接线、把 legacy 记录当成缺陷）→ 给出反例与实测输出，
   双方各自记录各自仪器的错误（本工程既有惯例：作者已记录 4+2+2 条自身仪器错误）。
F5 与本审计冲突的既有行为 → 归为「本审计的声明需要修正」而不是「产品缺陷」，并说明是哪一条声明。
```

## 4. 复检方可能踩到的两个已知坑（作者先说明，避免误判）/ Two known traps

```text
T1  在 worktree 里安装依赖必须两步：`corepack pnpm install --frozen-lockfile` **和**
    `corepack pnpm --dir city install --frozen-lockfile`；只做第一步时 city workspace 不会被装上，
    document-reader 类套件会以**环境原因**失败——那不是我方代码的缺陷。
T2  `git worktree remove` 在 `node_modules` 是目录 junction 时会**顺着链接删掉真实文件**；正确顺序是
    先 `cmd /c rmdir <link>` 再 `git worktree remove`。（这条是本机上一轮真实踩过并修复的。）
```

## 5. 复检入口（作者提供的全部材料）

**追加（2026-10-06T21:53:55Z，冻结头自查）**：`AUTHOR_SELF_CHECK_AT_FROZEN_HEAD_Mech.md` —— 作者在冻结头上只读自查，
发现五档表的**判据比结论宽**（「引用」含纯文本提及，不只有 import 边）：`execution-backend-v1` 的 4 个产线提及者中
2 个是纯提及（`standard-devices.mjs`、`server.mjs`），但**四个 LIVE_WIRED 结论没有一个是靠纯提及撑住的**；
EM/GAI 与 `rs-cross-device-return-v1` 更是在产线里连提及都没有。按冻结承诺，**收紧判据的改动留到裁决后的新头**，
不在复检期动 `659ff6a`。

```text
REVIEW_READINESS_MECH.md   一条命令的 8 项重算基线（含预期输出与三向证伪）
REVIEW_HANDOFF_Mech.md     精确头、可复现命令 R0–R6、可证伪断点 S1–S8、作者已声明的完成与未完成
DEVELOPMENT_REPORT.md      四个头与 CI 全过程、仪器错误、判断逻辑、未证明项
ownership-map / reuse-tiers / ui-backend-matrix   三项交付物本体（utopia 侧 docs/{zh-CN,en}/pcf/）
CLAIM_REPORT.md            领取与基线解析（claim-time 实测）
```

作者在此等待复检结论；在此期间不动被复检的头。
