# UTOPIA 施工交接指令（下一轮直接照此继续）

> 生成时间：2026-10-04　生成者：Alien 主机本次会话
> 本文件是**下一轮的唯一入口**：上下文已压缩，只保留会话目标 + 当前真实状态 + 下一步 + 纪律。
> 权威层级不变：Owner 裁决 > `Digital-City/mission-book/CONSTRUCTION_RULES.md` > 当前工作书 > frontmatter/报告 > README 看板。

---

## 一、会话目标（Owner 原话，逐条保留）

1. 按照 GitHub 仓库 **Digital-City/mission-book** 下的任务列表和领取规则，执行项目施工任务。
2. 本机领取任务时**角色为 "Alien"**，**允许调用 Android Studio**；若 Android 验收需要，**允许在本程序安装目录下装载 Computer Use 插件**来观察。
3. **完成任务后自行领取下一个。**
4. 上下文记忆达 75% 上限时，**自动压缩提炼最早的 50% 并替换**。
5. 施工中**任何未明确指定的选项，选最优解**，但必须按 mission-book 工程书要求，把**问题、选择、判断逻辑全部记录并报告**。
6. **每次领取任务前确认仓库最新状态。**
7. **本对话永久保持中文回复。**
8. 本次对话**只执行 connection-onboarding 部分**。
9. **City 常驻**；已提交内容清理；**City 联机测试日志目录必须建在 GitHub 云端**；等待 Mech 5 分钟，加入即开始最终联机测试。
10. **集成维修**，并**要求用户必须可以多方式快捷地在客户端 UI 的端口界面远程连接任意多台 PC**；**入城通道保留在端口页面**；PC 列表**不固定为 2**；"两台 PC"指**各自独立启动 Utopia、未连接状态的两台独立主机**，连接后应在**同一 City**、在线设备列表中**彼此可见**；**主城选网络+硬件综合最适合承载的那台**。
11. 连接形态需覆盖**同网同房间 / 同网不同房间 / 不同网络 / 不同城市**，网络可为**宽带/WiFi**。
12. **先做 JOIN-502 界面二次复核（2），再做跨网通道（1）**；**跳过工程书**（不新建 final integration / merge workbook，也不为隧道新建工作书）。
13. **直接压缩已有上下文，只保留本次指导，完整交给下一轮施工，继续。**

---

## 二、当前真实状态（以云端为准）

### 2.1 实现仓库 `zhiheng-zhang-Mera/utopia`

```text
main = fa85dcd   （已推送；本轮全部产物在此）
全量测试        1168 tests / 1168 pass / 0 fail   （S1-S3 轮为 1164）
check-bilingual docs / evidence / data-records 三个 SYNCHRONIZED
真实浏览器检查  npm run check:browser-relay  PASS（Edge + CDP，页面错误 0）
hosted CI       ★ 仍未取得（本地 PASS 不能替代 hosted CI，故不宣称绿）
                ★ 另注：UTOPIA_LIVE_STATUS 停在 a7bab55，云端的 5 分钟同步工作流本轮**没有运行**
本机 worktree   D:/A-Utopia [main]（干净）
```

**main 已包含**：JOIN-501 配对会话生命周期、JOIN-502 入城/批准、JOIN-503 设备登记与免令牌重连、
连接界面（`apps/web/connect-surface.js`、`primary-city.js`、`network-path.js`）、中继传输层（`services/dev-gateway/relay.mjs`）、
跨网通道接线（S1-S3）、**以及跨网入城流程与界面最后一跳（N2，见 §三）**。

### 2.2 控制面 `zhiheng-zhang-Mera/Digital-City`

```text
main = 51ec0c7   （已推送）
mission-book/connection-onboarding/JOIN-501/502/503  三个工作书 review_complete: true，终态已记录
mission-book/reports/JOIN-50x/                       开发/复核/复检报告
mission-book/logs/city-live-test/                    联机测试日志目录（Owner 要求建在云端）
mission-book/logs/integration/                       ★ 集成台账
    · RELAY_TUNNEL_S1_S3.md                          ★ 记录（S1-S3 + N2、判断逻辑、执行位置修正、缺陷、DEFERRED）
    · CONNECTION_ONBOARDING_INTEGRATION.md           ★ 正文已损坏，已插入警告块（见 §五）
mission-book/UTOPIA_LIVE_STATUS.md · .json           由工作流每 5 分钟自动刷新（会先显示 a7bab55，随后变 f3756ba）
```

**已记录的 Owner 豁免**：本阶段集成**跳过集成工作书**（理由与事实在 `logs/integration/` 开头）。

### 2.3 环境事实（下一轮直接用）

```text
City 令牌（Owner 提供）    控制令牌 [REDACTED]   节点令牌 [REDACTED]   （勿写入任何 Git 对象）
City 启动                  D:\A-Utopia\Utopia.cmd（已自定位 node 运行时；node 不在用户/系统 PATH，
                           实际在 D:\DS-Hns\runtime\node-v24.14.1-win-x64\node.exe）
桌面入口                   C:\Users\15601\OneDrive\Desktop\Utopia.cmd
City 当前状态              已断开（Owner 指示断开）
```

---

## 三、本轮（S1–S3）做完了什么

```text
S1 网关接线    services/dev-gateway/server.mjs：新增 /api/v0/relay WebSocket 路由，对端可"拨入"；
               准入复用 City 自己发过的凭据（sess: 解析 enrollment、控制令牌），
               什么都没出示的对端仍接受（因为要入城的 PC 按定义没有凭据），
               但能载什么由 RELAY_PAYLOAD_PATHS 白名单限定 → 不可能变成开放代理；
               对端可声明自己所属 City 的地址（clientUrl），push 时带上，决定权留在持有该 peer 的 City。
S2 客户端      apps/web/relay-dial.mjs：拨号并等 RELAY_READY（开过又被拒的连接不许像一条路径）；
               转发既有 join 载荷；失败 typed 且可回落；同一管道反向也能服务 City 的 push。
               apps/web/network-path.js：relay-in-city 的 action 带中继目标，旧"未建传输"注释已改。
S3 载荷复用    转发的就是既有 join 载荷（同 body、同路由、同一次性 claim），中继只转发、不落盘、不是 trust store。
N2 界面最后一跳  apps/web/relay-join.mjs（跨网入城流程，注入 forward 的纯逻辑）+ app.js 接线：
                reach==='relay' 的行由本 City 拨号并把申请送过管道；失败回落既有导航/二维码/短码通道；
                为**另一座 City** 取回的凭据经 #handoff 片段交付（从不放进 query）；三种进行中状态各有文案（中英）。
                ★ 并修正了执行位置：**载荷在中继 City 自己身上执行**——拨号方按定义就是那台不能被拨入的机器，
                让它去执行"对另一座 City 的入城申请"等于让唯一没有路由的机器去用那条路由。
```

**证据**：`tests/relay-s1-tunnel.test.mjs` 12 项；`tests/link-local-two-city.test.mjs`（**两个独立 City 进程**通过拨出管道联机，
入城全链路 8 步全过）；`scripts/browser-relay-check.mjs`（真实 Edge 驱动页面，0 页面错误）；
`tests/relay.test.mjs` 的帧类型断言被**改写并就地写明理由**（不是删除）。

---

## 四、下一步（按优先级）

```text
N1  ★ 真实跨网双物理主机验收：仍需第二台真实主机 + 另一条真实网络。这是"联机功能"唯一还缺的一环，
    本机只能做到"两个独立 City 进程 + 真实 WebSocket + 完整入城链路"（已 PASS，但不是跨网）。
N2  ★ hosted CI 回填：f3756ba 与 fa85dcd 的 run 号与结论都还没有。
    另需查明：UTOPIA_LIVE_STATUS 停在 a7bab55 —— 云端的 sync 工作流本轮没有运行。
N3  ★ 待 Owner 一句话：损坏台账保留现状，还是允许 Alien 按可读来源重建（见 §五）。
N4  浏览器里的"行内按钮"完整 DOM 路径：目前浏览器检查是直接驱动 window.utopiaRelay（与按钮走同一批函数），
    还没有模拟"发现到一台 remote PC → 点击行内按钮"。该路径需要真实的 remote 发现行，本机造不出。
```

**已固定的判断逻辑（不必重新决定）**：

- 跨网机制优先级：**同网直连 > 出站拨号中继（自带，无需第三方/账号/改路由）> 已存在的 overlay > 端口转发（连同代价）> 公共中继（明确拒绝）> 无路（如实 + Owner 决策问题）**；
- 群组所需路径 = **最难那台所需**；
- 绝不把"估计值"喂进主城评分（`attachment`/`metered` 在 node 与浏览器都测不到 → 保持 null）。

---

## 五、★ 待 Owner 裁决：`CONNECTION_ONBOARDING_INTEGRATION.md` 正文不可逆损坏

```text
现状    第 1-73 行是多层错误转码后的乱码；损坏自 0b50398 起，且 origin/main 同样是坏的
范围     mission-book/ 下 56 个 md 中只有这一个文件损坏
原因     UTF-8 被当 GBK 读、再回写为 UTF-8，且至少发生两轮；无效字节被替换成 '?'（内容丢失）→ 不可逆
可恢复   1abe534 之前的正文、各版本所有 ASCII 行（commit/CI run/测试计数/行内代码）
本轮处置 只插入警告块并指明可读来源；**没有**用重建版替换 Owner 的历史记录
待 Owner 一句话决定：保留现状，还是允许 Alien 按可读来源重建并在文件头标注"重建版本"
详细     mission-book/logs/integration/RELAY_TUNNEL_S1_S3.md §5
```

---

## 六、必须继承的纪律

1. **Claim 原子化**：读最新 main → 重判依赖/资格/claim → 只改必要字段 → fast-forward → push 失败即撤回，**不 force-push**。
2. **双机独立**：Development 与 Formal Review 必须不同实体主机；**同机不得自审**（JOIN-502 复核由 Alien 承担，因 Mech 是开发方；Owner 明确授权）。
3. **零领取必须分类**：`TEMPORARILY_UNCLAIMABLE` / `STRUCTURALLY_INELIGIBLE` / `GLOBAL_EXTERNAL_BLOCK` / `POOL_TERMINAL`，**不得把"暂时没活"写成完成**。
4. **exact-head CI**：CI 归属它跑过的那个 sha，不得用邻近 sha 顶替；本地 PASS 不能替代工作书要求的 hosted CI。
5. **`deferred != passed`**：双物理主机等未做的验收必须写明 DEFERRED。
6. **改测试要区分"改正契约"与"降低门槛"**：改写必须写明理由（本轮 `relay.test.mjs` 的帧类型断言即此类）。
7. **诚实的缺陷记录**：本轮接线过程中我自己写出的缺陷全部记录在案——
   - 双重序列化（hub 默认 JSON codec 又编码了一次 socket 层已编码的文本）；
   - 两个方向共用一个帧名（City 把自己的 push 读成"别人的转发请求"）；
   - `forward` 忽略了调用方传入的 `requestId`；
   - 用 `settle` 回应拨号方（它按 (id, ref) 匹配，而等待在对方表里）→ 改为 `deliver` 写回管道；
   - 测试对端把 push 的载荷执行到**承载它的中继**上，而不是载荷指定的 City。
8. **界面必须实机验证**：单测看不到页面级崩溃；此前已用真实浏览器发现两处。
9. **凭据纪律**：令牌/长期凭据**不进 Git**；提交前做令牌值自检（本轮已做，`OK：无令牌值`）。
10. **不要用 shell 命令改代码文件**：本机已两次踩到同类事故——pwsh 的双引号会吃掉 `# UTOPIA 施工交接指令（下一轮直接照此继续）

> 生成时间：2026-10-04　生成者：Alien 主机本次会话
> 本文件是**下一轮的唯一入口**：上下文已压缩，只保留会话目标 + 当前真实状态 + 下一步 + 纪律。
> 权威层级不变：Owner 裁决 > `Digital-City/mission-book/CONSTRUCTION_RULES.md` > 当前工作书 > frontmatter/报告 > README 看板。

---

## 一、会话目标（Owner 原话，逐条保留）

1. 按照 GitHub 仓库 **Digital-City/mission-book** 下的任务列表和领取规则，执行项目施工任务。
2. 本机领取任务时**角色为 "Alien"**，**允许调用 Android Studio**；若 Android 验收需要，**允许在本程序安装目录下装载 Computer Use 插件**来观察。
3. **完成任务后自行领取下一个。**
4. 上下文记忆达 75% 上限时，**自动压缩提炼最早的 50% 并替换**。
5. 施工中**任何未明确指定的选项，选最优解**，但必须按 mission-book 工程书要求，把**问题、选择、判断逻辑全部记录并报告**。
6. **每次领取任务前确认仓库最新状态。**
7. **本对话永久保持中文回复。**
8. 本次对话**只执行 connection-onboarding 部分**。
9. **City 常驻**；已提交内容清理；**City 联机测试日志目录必须建在 GitHub 云端**；等待 Mech 5 分钟，加入即开始最终联机测试。
10. **集成维修**，并**要求用户必须可以多方式快捷地在客户端 UI 的端口界面远程连接任意多台 PC**；**入城通道保留在端口页面**；PC 列表**不固定为 2**；"两台 PC"指**各自独立启动 Utopia、未连接状态的两台独立主机**，连接后应在**同一 City**、在线设备列表中**彼此可见**；**主城选网络+硬件综合最适合承载的那台**。
11. 连接形态需覆盖**同网同房间 / 同网不同房间 / 不同网络 / 不同城市**，网络可为**宽带/WiFi**。
12. **先做 JOIN-502 界面二次复核（2），再做跨网通道（1）**；**跳过工程书**（不新建 final integration / merge workbook，也不为隧道新建工作书）。
13. **直接压缩已有上下文，只保留本次指导，完整交给下一轮施工，继续。**

---

## 二、当前真实状态（以云端为准）

### 2.1 实现仓库 `zhiheng-zhang-Mera/utopia`

```text
main = fa85dcd   （已推送；本轮全部产物在此）
全量测试        1168 tests / 1168 pass / 0 fail   （S1-S3 轮为 1164）
check-bilingual docs / evidence / data-records 三个 SYNCHRONIZED
真实浏览器检查  npm run check:browser-relay  PASS（Edge + CDP，页面错误 0）
hosted CI       ★ 仍未取得（本地 PASS 不能替代 hosted CI，故不宣称绿）
                ★ 另注：UTOPIA_LIVE_STATUS 停在 a7bab55，云端的 5 分钟同步工作流本轮**没有运行**
本机 worktree   D:/A-Utopia [main]（干净）
```

**main 已包含**：JOIN-501 配对会话生命周期、JOIN-502 入城/批准、JOIN-503 设备登记与免令牌重连、
连接界面（`apps/web/connect-surface.js`、`primary-city.js`、`network-path.js`）、中继传输层（`services/dev-gateway/relay.mjs`）、
跨网通道接线（S1-S3）、**以及跨网入城流程与界面最后一跳（N2，见 §三）**。

### 2.2 控制面 `zhiheng-zhang-Mera/Digital-City`

```text
main = 51ec0c7   （已推送）
mission-book/connection-onboarding/JOIN-501/502/503  三个工作书 review_complete: true，终态已记录
mission-book/reports/JOIN-50x/                       开发/复核/复检报告
mission-book/logs/city-live-test/                    联机测试日志目录（Owner 要求建在云端）
mission-book/logs/integration/                       ★ 集成台账
    · RELAY_TUNNEL_S1_S3.md                          ★ 记录（S1-S3 + N2、判断逻辑、执行位置修正、缺陷、DEFERRED）
    · CONNECTION_ONBOARDING_INTEGRATION.md           ★ 正文已损坏，已插入警告块（见 §五）
mission-book/UTOPIA_LIVE_STATUS.md · .json           由工作流每 5 分钟自动刷新（会先显示 a7bab55，随后变 f3756ba）
```

**已记录的 Owner 豁免**：本阶段集成**跳过集成工作书**（理由与事实在 `logs/integration/` 开头）。

### 2.3 环境事实（下一轮直接用）

```text
City 令牌（Owner 提供）    控制令牌 [REDACTED]   节点令牌 [REDACTED]   （勿写入任何 Git 对象）
City 启动                  D:\A-Utopia\Utopia.cmd（已自定位 node 运行时；node 不在用户/系统 PATH，
                           实际在 D:\DS-Hns\runtime\node-v24.14.1-win-x64\node.exe）
桌面入口                   C:\Users\15601\OneDrive\Desktop\Utopia.cmd
City 当前状态              已断开（Owner 指示断开）
```

---

## 三、本轮（S1–S3）做完了什么

```text
S1 网关接线    services/dev-gateway/server.mjs：新增 /api/v0/relay WebSocket 路由，对端可"拨入"；
               准入复用 City 自己发过的凭据（sess: 解析 enrollment、控制令牌），
               什么都没出示的对端仍接受（因为要入城的 PC 按定义没有凭据），
               但能载什么由 RELAY_PAYLOAD_PATHS 白名单限定 → 不可能变成开放代理；
               对端可声明自己所属 City 的地址（clientUrl），push 时带上，决定权留在持有该 peer 的 City。
S2 客户端      apps/web/relay-dial.mjs：拨号并等 RELAY_READY（开过又被拒的连接不许像一条路径）；
               转发既有 join 载荷；失败 typed 且可回落；同一管道反向也能服务 City 的 push。
               apps/web/network-path.js：relay-in-city 的 action 带中继目标，旧"未建传输"注释已改。
S3 载荷复用    转发的就是既有 join 载荷（同 body、同路由、同一次性 claim），中继只转发、不落盘、不是 trust store。
N2 界面最后一跳  apps/web/relay-join.mjs（跨网入城流程，注入 forward 的纯逻辑）+ app.js 接线：
                reach==='relay' 的行由本 City 拨号并把申请送过管道；失败回落既有导航/二维码/短码通道；
                为**另一座 City** 取回的凭据经 #handoff 片段交付（从不放进 query）；三种进行中状态各有文案（中英）。
                ★ 并修正了执行位置：**载荷在中继 City 自己身上执行**——拨号方按定义就是那台不能被拨入的机器，
                让它去执行"对另一座 City 的入城申请"等于让唯一没有路由的机器去用那条路由。
```

**证据**：`tests/relay-s1-tunnel.test.mjs` 12 项；`tests/link-local-two-city.test.mjs`（**两个独立 City 进程**通过拨出管道联机，
入城全链路 8 步全过）；`scripts/browser-relay-check.mjs`（真实 Edge 驱动页面，0 页面错误）；
`tests/relay.test.mjs` 的帧类型断言被**改写并就地写明理由**（不是删除）。

---

## 四、下一步（按优先级）

```text
N1  ★ 真实跨网双物理主机验收：仍需第二台真实主机 + 另一条真实网络。这是"联机功能"唯一还缺的一环，
    本机只能做到"两个独立 City 进程 + 真实 WebSocket + 完整入城链路"（已 PASS，但不是跨网）。
N2  ★ hosted CI 回填：f3756ba 与 fa85dcd 的 run 号与结论都还没有。
    另需查明：UTOPIA_LIVE_STATUS 停在 a7bab55 —— 云端的 sync 工作流本轮没有运行。
N3  ★ 待 Owner 一句话：损坏台账保留现状，还是允许 Alien 按可读来源重建（见 §五）。
N4  浏览器里的"行内按钮"完整 DOM 路径：目前浏览器检查是直接驱动 window.utopiaRelay（与按钮走同一批函数），
    还没有模拟"发现到一台 remote PC → 点击行内按钮"。该路径需要真实的 remote 发现行，本机造不出。
```

**已固定的判断逻辑（不必重新决定）**：

- 跨网机制优先级：**同网直连 > 出站拨号中继（自带，无需第三方/账号/改路由）> 已存在的 overlay > 端口转发（连同代价）> 公共中继（明确拒绝）> 无路（如实 + Owner 决策问题）**；
- 群组所需路径 = **最难那台所需**；
- 绝不把"估计值"喂进主城评分（`attachment`/`metered` 在 node 与浏览器都测不到 → 保持 null）。

---

## 五、★ 待 Owner 裁决：`CONNECTION_ONBOARDING_INTEGRATION.md` 正文不可逆损坏

```text
现状    第 1-73 行是多层错误转码后的乱码；损坏自 0b50398 起，且 origin/main 同样是坏的
范围     mission-book/ 下 56 个 md 中只有这一个文件损坏
原因     UTF-8 被当 GBK 读、再回写为 UTF-8，且至少发生两轮；无效字节被替换成 '?'（内容丢失）→ 不可逆
可恢复   1abe534 之前的正文、各版本所有 ASCII 行（commit/CI run/测试计数/行内代码）
本轮处置 只插入警告块并指明可读来源；**没有**用重建版替换 Owner 的历史记录
待 Owner 一句话决定：保留现状，还是允许 Alien 按可读来源重建并在文件头标注"重建版本"
详细     mission-book/logs/integration/RELAY_TUNNEL_S1_S3.md §5
```

---

## 六、必须继承的纪律

1. **Claim 原子化**：读最新 main → 重判依赖/资格/claim → 只改必要字段 → fast-forward → push 失败即撤回，**不 force-push**。
2. **双机独立**：Development 与 Formal Review 必须不同实体主机；**同机不得自审**（JOIN-502 复核由 Alien 承担，因 Mech 是开发方；Owner 明确授权）。
3. **零领取必须分类**：`TEMPORARILY_UNCLAIMABLE` / `STRUCTURALLY_INELIGIBLE` / `GLOBAL_EXTERNAL_BLOCK` / `POOL_TERMINAL`，**不得把"暂时没活"写成完成**。
4. **exact-head CI**：CI 归属它跑过的那个 sha，不得用邻近 sha 顶替；本地 PASS 不能替代工作书要求的 hosted CI。
5. **`deferred != passed`**：双物理主机等未做的验收必须写明 DEFERRED。
6. **改测试要区分"改正契约"与"降低门槛"**：改写必须写明理由（本轮 `relay.test.mjs` 的帧类型断言即此类）。
7. **诚实的缺陷记录**：本轮接线过程中我自己写出的缺陷全部记录在案——
   - 双重序列化（hub 默认 JSON codec 又编码了一次 socket 层已编码的文本）；
   - 两个方向共用一个帧名（City 把自己的 push 读成"别人的转发请求"）；
   - `forward` 忽略了调用方传入的 `requestId`；
   - 用 `settle` 回应拨号方（它按 (id, ref) 匹配，而等待在对方表里）→ 改为 `deliver` 写回管道；
   - 测试对端把 push 的载荷执行到**承载它的中继**上，而不是载荷指定的 City。
8. **界面必须实机验证**：单测看不到页面级崩溃；此前已用真实浏览器发现两处。
9. **凭据纪律**：令牌/长期凭据**不进 Git**；提交前做令牌值自检（本轮已做，`OK：无令牌值`）。
，而
    `Set-Content -Encoding utf8` / `Get-Content|Set-Content` 这类管道会用 ANSI 代码页解码，把文件里的**中文注释换成乱码**
    （本轮真的发生过，已用 Node 重做并校验）。**改文件只用编辑工具，或用 Node 显式 UTF-8 读写。**
11. **改了界面就必须跑真实浏览器检查**：本轮单测全绿的同时，`app.js` 因为漏了一个 import 而**整页无法初始化**，
    只有真实浏览器发现。命令：`npm run check:browser-relay`（Edge + CDP，无需新增依赖）。

---

## 七、流程要求（勿忘）

- **领取前**：`git fetch` 最新 `Digital-City` 与 `utopia`，实测依赖、CI、他机 claim。
- **施工中**：选择最优解，并把**问题/选择/判断逻辑**写进报告或台账。
- **完成后**：更新 `Digital-City` 记录（工作书 frontmatter / 台账）+ 报告，推送；**再做控制面 reconciliation**。
- **零领取时**：按 §六.3 分类并留下 wake condition，不 busy-poll。
- **每次动用 City 后**：确认端口释放或按要求常驻。

---

## 八、下一轮开工第一句建议

> 先读 `Digital-City/mission-book/logs/integration/RELAY_TUNNEL_S1_S3.md`（本轮全部事实与 DEFERRED 都在里面），
> 请 Owner 对 §五 的台账处置给一句话，然后执行 §四 的 N2（界面最后一跳），
> 保持 §二 的环境事实与 §六 的纪律。

## Language / 语言

[English full reading](en/NEXT_ROUND.md)。本次文档整理遮盖两处历史明文凭据，未重写Git历史。 / This documentation pass redacts two historical plaintext credential lines; Git history is retained.
