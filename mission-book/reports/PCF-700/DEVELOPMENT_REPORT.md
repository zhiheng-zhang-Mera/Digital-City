# PCF-700 开发报告 / Development report

```text
TASK_ID            PCF-700  所有权、调用链与兼容现实审计 / Ownership, call-chain and compatibility reality audit
PROGRAMME          PERSONAL_COMPUTE_FABRIC
ROLE               Development
IMPLEMENTATION     zhiheng-zhang-Mera/utopia
CONTROL REPO       zhiheng-zhang-Mera/Digital-City
HOST               Mech（COMPUTERNAME MEGA-REP；role Mech-DS，development side）
BRANCH             pcf/PCF-700-mech-ownership-and-reality-audit
SERIES BRANCH      pcf/series-mech（= d611cfe，本系列累计头）
BASELINE_SHA       312b627b54af5bbf274fa25eca8f8383869c1c34  （= origin/main，见 CLAIM_REPORT.md）
HEAD_SHA           d611cfe5f0272673706b9dc5c9f6b85ed40a9406
CI                 V0.2 checks run 37497553367（见下「本轮 CI 状态」）
DELIVERABLES       docs/zh-CN/pcf/ownership-map.md, docs/en/pcf/ownership-map.md,
                   tests/pcf700-compatibility.test.mjs
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
V0.2 checks run 37497553367  head=d611cfe  status=in_progress at report time
V0.2 checks run 37496389297  head=312b627  completed / success（基线头，两个 job 全绿）
本机侧证据：node --test tests/pcf700-compatibility.test.mjs => 7 tests / 7 pass / 0 fail
```

CI 结论以仓库 Actions 的实际结论为准；本报告不把「已推送」写成「已验证」。

## 6. 下一步（交给下一轮或异机复检）/ Next

```text
a 异机（另一实体主机）独立复检：样本调用链两主机走一遍、TWO_HOST_VERIFIED 档位；本机不替代这一步
b 规格修订 2 的五档核对（EM 连接器/Foreman、RF、GAI、WBC、原端工具）—— 目前只测到合同目录存在
c UI→backend 逐文件依赖矩阵与机器可读的单写者清单
d 「已验收 EM/RF/GAI 组件与 PCF 复用边界」表
```

`ownership-map.md` 第 7 节与本节同源：`UNKNOWN` 是结论，不是空白。
