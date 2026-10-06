# PCF-700 开发报告 / Development report

```text
TASK_ID            PCF-700  所有权、调用链与兼容现实审计 / Ownership, call-chain and compatibility reality audit
PROGRAMME          PERSONAL_COMPUTE_FABRIC
ROLE               Development
IMPLEMENTATION     zhiheng-zhang-Mera/utopia
CONTROL REPO       zhiheng-zhang-Mera/Digital-City
HOST               Mech（COMPUTERNAME MEGA-REP；role Mech-DS，development side）
BRANCH             pcf/PCF-700-mech-ownership-and-reality-audit
SERIES BRANCH      pcf/series-mech（= f75b2a6，本系列累计头）
BASELINE_SHA       312b627b54af5bbf274fa25eca8f8383869c1c34  （= origin/main，见 CLAIM_REPORT.md）
HEAD_SHA           f75b2a6c2fa28d183a09795c70823c775123e1ac  （增量 2；前序头 a2a5673…、d611cfe…）
CI                 run 37497553367（d611cfe，**失败**）→ run 37498638940（a2a5673，**success**）
                   → f75b2a6 的 run 见 §7（结论以仓库 Actions 为准）
DELIVERABLES       docs/{zh-CN,en}/pcf/ownership-map.md、reuse-tiers.md、ui-backend-matrix.md,
                   tests/pcf700-compatibility.test.mjs、tests/pcf700-dependency-direction.test.mjs,
                   scripts/pcf700-reuse-audit.mjs、data-records/{zh-CN,en}/pcf/reuse-wiring-audit.json,
                   scripts/check-bilingual.mjs（CI 暴露的仓库闸门缺陷修复，见 §2.5）
REVIEW             review_host = null（等待另一实体主机，本机不自审）
```

## 1. 本轮交付物与实际测量 / Deliverables and what was actually measured

`docs/{zh-CN,en}/pcf/ownership-map.md`（中英互镜）冻结三件事：

```text
reuse/extend/missing 表   每个复用点写全 declaration → caller → live API → user surface → exact evidence 五段，
                          例如 targeting.mjs:30 的 STRICT_TARGET_FIELD 由 standard-devices.mjs 在领取路径内使用，
                          而不是「导出即启用」。
九接口 / 八类型            实测 ARCHITECTURE §4 的九个候选接口在 312b627 上**一个都不存在**；
                          observeResources / admit 两个名字分别被 EM Foreman 与 capability 路由占用，
                          是**同名异物**，不是复用点。最小共享类型表全部缺失 => 必须在
                          contracts/personal-compute-fabric-v1/ 下新建，本轮**一个都没建**。
接线三层                  (1) profile 切换 LIVE_WIRED（server.mjs:503 构建、:963/:967 路由、:718 快照）；
                          (2) chooseHybridTarget（execution-profile.mjs:166）NOT_WIRED —— gateway 无调用点，
                              仅被 WBC-604 测试调用，C6 把它冻结成断言；
                          (3) strict target 真正接在 live 领取路径里（standard-devices.mjs 的
                              classifyTarget / withheldTasks / claimAllowedByTarget），C3 用真 HTTP 领取验证。
单写者 / 无新 canonical DB   server.mjs 是路由与控制器构造的唯一写入者，store.mjs 是 canonical 事实唯一写入者，
                          node-descriptor-v1 是 descriptor 字段唯一写入者；裸 City 启动后数据目录**测不到**
                          任何 pcf 命名状态，仓库里 personal-compute-fabric 只出现在 mission-book 规划与文档中。
```

`tests/pcf700-compatibility.test.mjs`：**7/7 通过**（本轮提交前重跑确认，1.06 s），覆盖 C1–C7 七条兼容反例。

## 2. 本轮仪器自身的三处错误（记录而不是隐去）/ Instrument errors

```text
E1  以为 POST /api/v0/tasks 能带 targetDeviceRef —— 实测只接受 type，带参数返回 400
    「Choose a supported safe task type; parameters are not accepted」
E2  以为 withheld 行的字段是 id、reason 是 UNKNOWN —— 实测字段是 taskId，reason 是 STRICT_TARGET_BOUND
E3  以为 classifyTarget 返回 {ok} —— 实测返回 {state, claimable, reason}
E4（次要）以为 POST /api/v0/node/register 接受旧式 descriptor —— 实测缺 capabilities 返回 400，roles 可选
```

四条都写进了测试注释与 ownership-map 第 6 节：探针先被证伪，结论才可用。

## 2.5 CI 暴露的**仓库闸门**缺陷与修复（不是本机探针的错，是闸门自己的错）/ Repo gate defect

```text
现象   hosted run 37497553367（head d611cfe）在 step `pnpm check:docs` **失败**；gateway-web 失败、android 成功。
       本机按同一命令复现（scripts/check-bilingual.mjs）→ 同样失败，报 EISDIR: illegal operation on a directory, read。
根因   check-bilingual.mjs 对 docs/zh-CN 与 docs/en 只做**一层** readdir，然后把每个条目当文件读。
       本工作书要求的交付路径就是 docs/{zh-CN,en}/pcf/ownership-map.md，于是第一次出现嵌套配对时闸门直接崩，
       而不是「检查后通过」。
选项   (a) 把交付物挪成平铺 docs/zh-CN/pcf-ownership-map.md —— 违背工作书明文声明的路径，且 PCF 后续 28 本
           都会需要 docs/*/pcf/*，只是把问题推给下一本；
       (b) 把闸门改成**树感知**：递归走两棵树、比对相对路径列表完全相等，再逐对比较事实行 —— 保留原语义并
           覆盖嵌套。
选择   (b)。理由：配对翻译的性质与所在层级无关，错的是一层假设；工作书是权威，不能为迁就工具而改交付路径。
证伪   修改后必须证明闸门不是恒真：临时移走 en 镜像 → 'docs missing language pair'，退出 1；
       临时在 en 文件加一行 STATUS: → 'docs/pcf/ownership-map.md facts differ'，退出 1；
       两者复位后 docs/evidence/data-records 三处均 PAIR_STATUS = SYNCHRONIZED，退出 0。
残留   空目录不属于该契约（两语言都空则不报），已在脚本注释中写明，不假装它被覆盖。
```

## 3. 本轮未明确指定之处的最优解选择（记录判断逻辑）/ Judgement calls

```text
J1  系列分支如何累计？ 选 **fast-forward 推送**（pcf/series-mech: 312b627 → d611cfe），不造合并提交：
    因为到此为止系列里只有一本任务，是否累计已验收工作由 PCF-700 复检后的 Owner 合并裁决决定，
    现在多造一个合并对象只会增加后面要解释的历史。记录在此，供复检者推翻。
J2  报告镜像放哪？ 沿用本目录已有 CLAIM_REPORT.md 的双语同文件体例写 DEVELOPMENT_REPORT.md，
    并在 en/ 放英文镜像；不放 zh-CN/ 目录，避免与既有 CLAIM_REPORT.md 体例冲突（冲突本身已在此记录）。
J3  完成一本后是否立刻领 PCF-701？ **不领**，原因是被规则而不是被意愿挡住：PCF-701..728 全部（直接或间接）
    依赖 PCF-700，而 PCF-701 的 READY 要求依赖 status=COMPLETE（一致性检查规则 4
    READY_WITH_UNACCEPTED_DEPENDENCY）。PCF-700 的 review_host=null，正式复检必须由另一实体主机完成
    （§3 禁止自审）。因此本系列当前**唯一关键路径**是 PCF-700 的异机复检，而不是再开一本。
    这与 REX 系列上一轮卡住 15 轮的成因**同构**，故本轮把它作为显式问题上报，而不是自行开例外。
J4  是否顺手把 PCF 的 9 个接口建出来？ **不建**。本书是审计与兼容契约，第 7 节明确列出未完成项；
    无工作书授权的接口实现会越过 scope，属于「借审计扩权」。
```

## 4. 边界（未越过，写明而不是默认）/ Boundaries not crossed

```text
不采购、不付费、不使用付费服务；不装系统服务；不改运行 profile；不启用远端执行；
merge_authority 保持 false（系列分支只累计，合并权待 Owner 裁决）；
常驻 City（pid 44088，172.31.12.151:4391）本轮未被 PCF 工作触碰；本机不复检本机产物。
```

## 5. 本轮 CI 状态 / CI status

```text
V0.2 checks run 37497553367  head=d611cfe  completed / **failure**
    → gateway-web: step `pnpm check:docs` failure（其余 9 步全 success，含 `pnpm test`：新增的
      tests/pcf700-compatibility.test.mjs 在 hosted CI 上实测通过）；android: success
    → 本机复现同一失败，根因与修复见 §2.5
V0.2 checks run 37496389297  head=312b627  completed / success（基线头，两个 job 全绿）
修复头 a2a567325e6ce08629eefbe67cda6f8f2c16fd64 已推送（分支与 pcf/series-mech 同步到该头）；
    hosted run **37498638940 completed / success**（gateway-web success，android success）——修复后两 job 全绿。
本机侧证据：node --test tests/pcf700-compatibility.test.mjs => 7 tests / 7 pass / 0 fail；
    node scripts/check-bilingual.mjs => docs / evidence / data-records 三处 PAIR_STATUS = SYNCHRONIZED。
```

一次失败与一次修复都在这里留痕：**失败头 d611cfe 的记录不删除**，修复头不冒充它的绿色。

## 6. 增量 2（head `f75b2a6`）：把「已接受组件」量成档位，而不是当成可用服务

**交付**：`docs/{zh-CN,en}/pcf/reuse-tiers.md`、`docs/{zh-CN,en}/pcf/ui-backend-matrix.md`、`scripts/pcf700-reuse-audit.mjs`、`data-records/{zh-CN,en}/pcf/reuse-wiring-audit.json`、`tests/pcf700-dependency-direction.test.mjs`（D1–D4，4/4）。

```text
五档核对（49 个合同目录）
  LIVE_WIRED 只有 4 个：execution-backend-v1、node-descriptor-v1（WBC）、remote-local-discovery-v1、
    rs-presentation-contract-v1（RF）。其余 30 个 EM/GAI/RF 合同**只有测试引用，零产线引用**。
  EM 13 个目录共 379 条 export、GAI 9 个目录共 264 条 export，但网关一条都不 import
    ⇒ 它们是「已测组件」，不是 PCF 可依赖的活服务。
  rs-cross-device-return-v1（跨设备回端）**只有测试** ⇒ 结果回原端目前靠 handoff.mjs + presentation 的组合，
    这条专门的合同**没有任何产线路径证明** —— 正是 PCF-714 要接的缝，列为显式缺口。
  TWO_HOST_VERIFIED 与 ORIGIN_AGENT_CONSUMED **两档全空**（本机不替异机签名），逐条写明归属工作书。
UI→后端方向
  81 个前端文件、14 个含 /api/v0 字面量；网关 49 条路由；**未解析端点 = 0**（D2 断言）
  **后端模块 import 前端模块 = 0**（D1 断言）；静态服务路径 1 处（static.mjs 把 apps/web 当静态根，方向正确）、
  工具/测试驱动器 17 处，三类分开统计而不是混成一句「无环」。
单写者
  server.mjs / store.mjs / targeting.mjs / execution-profile.mjs / node-descriptor.mjs 的 bytes/lines/SHA256
  公开，异机可重算而不是采信。
```

**增量 2 的仪器错误（记录）**：第一版方向探针用一条宽松正则，报出 19 条「后端 import 前端」，**全部假阳性**（服务路径与 tests/scripts 驱动器）；修好后只认 `import ... from '...'`，又被**副作用导入** `import '../apps/web/app.js';`（真实依赖）绕过——后者靠**故意证伪守卫**发现。D1–D4 四条守卫都已用「制造反例 → 变红 → 复位 → 变绿」证伪过（probe 文件均即建即删，树保持干净）。探针脚本被排除在自身统计之外，避免自我放大。

## 7. 下一步（交给下一轮或异机复检）/ Next

```text
a 异机（另一实体主机）独立复检：样本调用链两主机走一遍、TWO_HOST_VERIFIED 档位；本机不替代这一步
b TWO_HOST_VERIFIED 与 ORIGIN_AGENT_CONSUMED 两档目前**全空**（reuse-tiers.md §5 逐条写明归属）
c Android 侧 Gradle BuildConfig 生成的 URL 未纳入静态矩阵（下一增量）
d （已在增量 2 完成）五档核对、复用边界表、UI→后端矩阵与单写者清单
```

`ownership-map.md` 第 7 节与本节同源：`UNKNOWN` 是结论，不是空白。
