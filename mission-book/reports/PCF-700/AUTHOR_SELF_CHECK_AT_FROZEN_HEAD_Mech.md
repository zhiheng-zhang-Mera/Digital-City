# PCF-700 冻结头上的作者自查（不是复检）/ Author self-check at the frozen head

作者在**被复检的头 `659ff6a` 上**做的一次**只读**自查：跑一遍本机验证，并检查五档分类所用的判据是否比结论更宽。
**这不是复检、不构成裁决、不释放 marker**；复检结论仍以对侧实体主机的 REVIEW_REPORT 为准。

```text
STATUS             AUTHOR_SELF_CHECK（read-only；未修改被复检的头，未触碰 review_* 字段）
REVIEW TARGET      659ff6aa98bc5675862b1170ed0cf5e1b78dba5f（与远端两分支一致）
检查时间           2026-10-06T21:53:55Z（Mech 主机）
```

## 1. 冻结头本机复跑（2026-10-06T21:53:55Z）

```text
tests/pcf700-compatibility.test.mjs + tests/pcf700-dependency-direction.test.mjs  => 11 pass / 0 fail
node scripts/check-bilingual.mjs                                                  => exit 0（docs/evidence/data-records 三处同步）
node scripts/pcf700-review-packet.mjs                                             => exit 0（8/8）
git status --short                                                                => 空（含 .scratch-pcf700-* 在内的临时目录均已清理）
托管侧同一头：V0.2 checks run 37502818037 success（gateway-web + android），`pnpm test` 与 `pnpm check:docs` 均在其上跑过
```

## 2. 自查发现：**判据比结论宽**（作者先说出来，不等复检方发现）

五档表把「至少一个产线文件**引用**该合同」当作 LIVE_WIRED 的判据，而「引用」是**文本**判定：它可能只是一句注释或一个数据路径字符串，而不是模块 import 边。作者在被复检的头上量了这个差别：

```text
execution-backend-v1   产线**提及**者 4 个：standard-devices.mjs / worker-pool.mjs / execution-profile.mjs / server.mjs
                       产线**真有 import 边**者 2 个：worker-pool.mjs、execution-profile.mjs
                       纯提及（无 import 边）2 个：standard-devices.mjs、server.mjs
node-descriptor-v1     产线提及者 3 个，且**全部**有 import 边（worker-pool / server / headless-node-agent）
remote-local-discovery-v1   1 个提及者（nearby.mjs），**有** import 边
rs-presentation-contract-v1 1 个提及者（presentation.mjs），**有** import 边
=> 用更严的「import 边」判据重判：**四个 LIVE_WIRED 结论没有一个是靠纯提及撑起来的**（判据可收紧，结论不变）

engineering-manager-v1 / engineering-foreman-scheduler-v1 / general-ai-gateway-v1 / general-ai-registry-v1
                        **产线提及者 = 0、产线 import 边 = 0**；边只来自 tests/（含 tests/web-scheduler-adapter.test.mjs
                        导入 general-ai-registry-v1/records.mjs）⇒ 比五档表所需的还强：连「提及」都没有
rs-cross-device-return-v1   产线提及者 = 0；5 条边全在 tests/ ⇒ 用严判据同样确认 NOT_WIRED
remote-typed-dataplane-v1   产线提及者 = 0 ⇒ 确认未接线
```

**结论**：五档表的**结论**不变（四个 LIVE_WIRED、EM/GAI 仅测试、回端缝无产线证明），但**判据的精度**需要改进——审计脚本应在记录里把「import 边」与「纯提及」分开列，而不是合成一个 `productionImporters` 数字。

## 3. 作者打算怎么处理（先写清楚，避免复检期动目标头）

```text
· **现在不动**：按 AUTHOR_HOLD_Mech.md 的冻结承诺，被复检头 `659ff6a` 上的 scripts/pcf700-reuse-audit.mjs 与
  data-records/.../reuse-wiring-audit.json **保持原样**，即使作者已经知道如何改进判据。
· **裁决后**：在**新头**上把 `productionImporters` 拆成 `productionImportEdges` 与 `productionMentionsOnly`
  两栏并重生成机读记录；若复检方在结论里已把该精度问题计为 finding，新头即为其修复头并注明对应 finding。
· **本轮归类**：这不是产品缺陷，而是**本审计的一条声明需要收紧**（F5 类）——把「引用」改述为「import 边」更准。
```

## 4. 这份自查怎么复现

只读探针放在**过程目录**（不属于被复检的头）：`D:\utopia-chat\pcf700-lived-wired-precision.mjs`。
在冻结头的 checkout 里执行即可（它只读文件、不写任何东西）：

```bash
cd <reviewed checkout>
node D:\utopia-chat\pcf700-lived-wired-precision.mjs
```

探针的规则是**严判据**：先取文件里真实的模块说明符（`import`/`export ... from`、副作用 `import '...'`、动态
`import('...')`），再判断其中是否有指向该合同目录的路径；与审计脚本的「文本包含」不同，因此它既能验证结论，
也能暴露判据宽窄的差别。
