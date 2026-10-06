# PCF-701 复检交接 / Review handoff (author → opposite host)

作者把 PCF-701 的开发侧交付完毕（含增量 1–3），本文件供**另一实体主机**执行正式复检。它**不是复检、不含裁决、不释放任何 marker**。

```text
TASK_ID            PCF-701 实时资源观测与 freshness / Live resource telemetry, presence and freshness
REVIEW TARGET      4e97d503989beba82124a1b6e3286825f33b92fc
BRANCH             pcf/PCF-701-mech-live-resource-telemetry（系列分支 pcf/series-mech 同指该头）
BASELINE           659ff6aa98bc5675862b1170ed0cf5e1b78dba5f（= PCF-700 已验收头）
AUTHOR HOST        Mech（COMPUTERNAME MEGA-REP，role Mech-DS）
DELIVERABLES       contracts/personal-compute-fabric-v1/observations.mjs
                   services/personal-compute-fabric/{telemetry,adapters,network-probe}.mjs
                   tests/pcf701-telemetry.test.mjs（22 项）
REPORT             reports/PCF-701/DEVELOPMENT_REPORT.md（含增量 1–3 与全部自查）
```

## 1. 复检方需要独立制造什么（不要读作者结论当证据）

```text
R1 自行取得精确头：git ls-remote origin pcf/PCF-701-mech-live-resource-telemetry，
   确认等于 4e97d503989beba82124a1b6e3286825f33b92fc，且 659ff6a 是其祖先。
R2 自行安装并跑：`corepack pnpm install --frozen-lockfile` **与**
   `corepack pnpm --dir city install --frozen-lockfile`（两步都必须做），
   然后 node --test tests/pcf701-telemetry.test.mjs（作者实测 22/22）、
   node --test tests/pcf700-compatibility.test.mjs tests/pcf700-dependency-direction.test.mjs（作者实测 33/33 三套合计）、
   node scripts/check-bilingual.mjs、node scripts/pcf700-review-packet.mjs（8/8）。
R3 **证伪**而不是复述：至少自造三处反例（例如让一个 facet 的 `free > total`、让一次 transfer 返回 0 字节、
   让 event-loop 直方图读出 NaN），确认套件会变红；作者的做法是 13 处源码突变（见 §3），复检方应自建自己的。
R4 **两主机真实采集**（工作书独立验收里唯一作者做不了的部分）：至少在一台设备上采集 CPU/RAM 并把结果
   送回原端消费，并记录**测量自身开销**；无 GPU 只能声明 `UNKNOWN/UNSUPPORTED`，不得填 0。
R5 独立判断「可选适配器缺席」这一条是否达到验收：作者**刻意未写** GPU/VRAM、电池、温度的适配器，
   也不 shell out 到厂商工具（理由见 §2）。这是一个**需要复检方裁定**的边界，不是已完成的实现。
R6 记录复检方仪器自身的错误（作者已记 4 条，见 §4）。
```

## 2. 作者声明的完成与未完成（复检方既不该当缺陷，也不该放过）

```text
完成：有界缓冲/限频/丢弃计数/overhead；缺失·NaN·负值·单位不符·越界一律不是 0；sequence 防旧包覆盖；bootId 不混
      epoch；时钟回拨既不能保鲜也不能撤销老化；超时不冻结调用方且返回全 UNKNOWN；越权维度不落库；
      total/free/reserved/inUse 独立成 facet 且 `free > total` 判 FACET_INCONSISTENT；presence/freshness 分离；
      网络按**路径**测 RTT **与吞吐**（吞吐靠搬字节计时，绝不从延迟推断），未测路径不给 0，预算/期限/退避齐备；
      队列需显式 source 否则 UNSUPPORTED；occupancy 读平台直方图（读不出就报原因而不是 0ms）。
未完成（明确留给复检方裁定）：GPU/VRAM、电池、温度**没有真实适配器**，只能声明 UNSUPPORTED。
      理由：读取它们需要调用厂商工具/特权接口，作者认为那属于「未获批准的新特权面」，因此不顺手实现；
      工作书原文只要求「缺席不阻塞基本采集」，该条已实现并测试。请复检方判断这是否足够，或要求新增适配器任务。
```

## 3. 作者侧的证伪证据（复检方须自建自己的）

```text
13 处源码突变各自使套件变红并按字节还原；其中三处有额外价值：
· 删掉第二个 `bytesPerSecond <= 0` 检查后**全部测试仍绿** ⇒ 那是**不可达的死守卫**，已从源码删除（连突变一并删）。
· 「没有队列 source 不得编造」与「直方图读不出不得报 0ms」两个分支，在 registry 路径上**不可达**（registry 会先
  短路不可用适配器），因此两条测试现在**同时直接调用 `sample()`**，两处突变才会变红。
· 本轮修掉的两个真实缺陷：只读查询曾为未探测路径创建状态；INVALID_RESULT 曾只计数不长退避。
```

## 4. 作者在本任务记录过的仪器错误（供复检方对照）

```text
E1 spawnSync + 进程内 fixture 服务器 ⇒ 自我死锁（改异步 spawn）。
E2 猜测 manifest 字段名（`campaigns` vs 真实 `campaignIds`）—— 同类错误在 PCF-701 上也犯过一次（把 freshness 数量
   与 `Object.keys(DIMENSIONS)` 比，未计 facets）。
E3 以为 CSV 文本内会写 PARTIAL（实际随响应信封）。
E4 把夹具限制当缺陷（用加/不加损坏文件的差分自证伪）。
E5 本机 Node 在 `app.close()` 触发 libuv 断言（测量打印之后，已隔离）。
E6 证伪脚本自身的 before/after 只列两个文件，新增源文件后报假「未还原」——已修并记录。
```

## 5. 边界（作者未越过）

```text
不采购/不付费、不装系统服务、不改运行 profile、不启用远端执行；fabric 未接入网关（PCF-700 D4 边界守卫在守）；
UI 一律未接线（资源/freshness 属 Advanced device detail，风险投影归 715）；PCF-701 `merge_authority` 保持 false。
历史/已验收资产未被改写：PCF-700 的验收头 659ff6a 与其记录原样保留。
```
