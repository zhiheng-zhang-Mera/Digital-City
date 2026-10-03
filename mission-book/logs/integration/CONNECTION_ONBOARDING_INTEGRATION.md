# 阶段集成日志 — connection-onboarding（分批合并）

> **Owner 裁决（记录在案）：本阶段集成由 Owner 直接指认，豁免创建 final integration / merge workbook。**
> `mission-book/connection-onboarding/README.md` 第 5 节要求"三个 JOIN 全部 opposite-host review 完成后才能创建
> 集成工作书"。Owner 于 2026-10-03 直接指示"集成，直接合并到 main"并明确"**不需要工作书**"，
> 因此本次以 **Owner 指认豁免**（Owner-directed exemption）跳过集成工作书，改由本日志承担登记职责。
> 这是**豁免**而非"规则已满足后省略"：规则原文要求的工件没有被创建，此处如实写明，避免日后被读成"按 §5 正常走完"。

## 1. 分批合并的依据与结果

三个分支的 exact-head CI 全部 SUCCESS：

```text
join/JOIN-501 @ e925ae1   CI 37116491572 SUCCESS
join/JOIN-502 @ 86deda9   CI 37119234473 SUCCESS
join/JOIN-503 @ 77f7f2a   CI 37120646153 SUCCESS
```

顺序按**分支血缘**确定，不按偏好：JOIN-503 是从 JOIN-501 的 head 分出的，因此 `501 → 503` 可无冲突组合。

### 第一批（已并入 main，已推送）

```text
merge 5d67976  JOIN-501
merge 967a959  JOIN-503
main = 967a9597fb9d1c0f1fc78886e4bde6e4f3d24dbf
冲突 0
集成后全量测试 1085 tests / 1085 pass / 0 fail
check-bilingual：docs / evidence / data-records 三个 PAIR_STATUS = SYNCHRONIZED
hosted CI：City linkage check 37124791081 SUCCESS；V0.2 checks 37124791099 见 §3
```

### 第二批（JOIN-502，**未并入 main**）

`main` 的当前状态**不包含** JOIN-502。JOIN-502 保留在独立集成分支上继续收口：

```text
branch integration/join-502-nearby
906df7e  union 解冲突 + 删除旧定义
d419004  删除第二段鉴权前置
```

## 2. 冲突与"标记之外"的偏差（本次集成最关键的一条经验）

文本层面的 union 只解决**冲突标记内**的分歧；两个分支长期分叉后，真正的偏差在**标记之外**。本次连续三层都属此类：

| 层 | 现象 | 状态 |
|---|---|---|
| 1 | union 只保留了 `deviceClock`，丢了 `nearbyTimeoutMs` → 每个 JOIN-502 测试都死于**请求时** `ReferenceError`（加载期检查抓不到） | 已修 |
| 2 | union 保留了**两段鉴权前置**，靠前的那段先执行 → 所有 join 路由返回 **401**，而路由后面的实现是正确的 | 已修 |
| 3 | 集成后的 snapshot 调用 `join.snapshot()`，而合入的 `join.mjs` **不提供该方法** → join 列表为 `undefined`，JOIN-502 网关套件因此报 `Cannot read properties of undefined` | **未修** |

第 3 层是**语义**差异（方法不存在），不是文本差异，需要把 JOIN-502 的 `join.mjs` 与 main 上 JOIN-501/503 之后的
`render()`、启动路径、事件分发逐函数比对，判断是"补一个方法"还是"改用新契约"。这正是 §11 要求"冲突按显式
union/superset 处理"的真实工作量所在。

## 3. CI 与残余门槛

- 第一批 main 的 V0.2 checks 已触发（run 见 §1）；**需在推送后按其 terminal 状态回填**，未绿时不得宣称
  "merge 后验收通过"。
- 第二批未合并，因此**不产生 merged-main CI**；JOIN-502 仍处于"已复核但未集成"的状态。
- 三个工作书的 `merge_authority` 均为 false，本次合并是 Owner 授权的集成动作，**不改变工作书自身的字段语义**。

## 4. 下一步（可直接照做）

1. 修第 3 层：比对 `services/dev-gateway/join.mjs` 与 `join502` 分支上的同名文件，确定 `snapshot()` 是缺失还是改名。
2. 逐函数比对 `apps/web/app.js` 的 `render()` / 启动路径 / 事件分发（JOIN-502 的入城面假定"首屏即入城"，
   在 JOIN-501 的 lifecycle 与 JOIN-503 的会话引导进入后已不成立）。
3. 全量 1104 项 + `check:docs` 通过后，把 `integration/join-502-nearby` 合入 main，并在**精确 merge commit** 上验证 CI。