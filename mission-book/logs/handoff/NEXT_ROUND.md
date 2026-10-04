# UTOPIA 施工交接指令（下一轮直接照此继续）

> 生成时间：2026-10-03　生成者：Alien 主机本次会话
> 本文件是**下一轮的唯一入口**：上下文已压缩，只保留本次指导 + 当前真实状态 + 下一步。
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
9. 追加：**City 常驻**；已提交内容清理；**City 联机测试日志目录必须建在 GitHub 云端**；等待 Mech 5 分钟，加入即开始最终联机测试。
10. 追加：**集成维修**，并**要求用户必须可以多方式快捷地在客户端 UI 的端口界面远程连接任意多台 PC**；**入城通道保留在端口页面**；PC 列表**不固定为 2**；"两台 PC"指**各自独立启动 Utopia、未连接状态的两台独立主机**（可能连过可能没连过），连接后应在**同一 City**、在线设备列表中**彼此可见**；**主城选网络+硬件综合最适合承载的那台**。
11. 追加：连接形态需覆盖**同网同房间 / 同网不同房间 / 不同网络 / 不同城市**，网络可为**宽带/WiFi**。
12. 追加：**先做 JOIN-502 界面二次复核（2），再做跨网通道（1）**；**跳过工程书**（即不新建 final integration / merge workbook，也不为隧道新建工作书）。
13. 追加：**直接压缩已有上下文，只保留本次指导，完整交给下一轮施工，继续。**

---

## 二、当前真实状态（以云端为准）

### 2.1 实现仓库 `zhiheng-zhang-Mera/utopia`

```text
main = a7bab55   （已推送；本次会话所有产物均在此）
全量测试        1155 tests / 1155 pass / 0 fail
check-bilingual docs / evidence / data-records 三个 SYNCHRONIZED
已有 merged-main CI：a9481ef V0.2 checks 37160987195 SUCCESS；a7bab55 之后需重新确认
分支             仅 main 本地；远端保留 join/JOIN-501..503、review/JOIN-501/502、integration/…、feat/… 作历史证据
worktree         只剩 D:/A-Utopia [main]（干净）
```

**main 已包含**：JOIN-501 配对会话生命周期、JOIN-502 入城/批准、JOIN-503 设备登记与免令牌重连、连接界面（`apps/web/connect-surface.js`、`primary-city.js`、`network-path.js`）、中继传输层（`services/dev-gateway/relay.mjs`）。

### 2.2 控制面 `zhiheng-zhang-Mera/Digital-City`

```text
mission-book/connection-onboarding/JOIN-501/502/503  三个工作书均 review_complete: true，
                                                     终态标记均已记录
mission-book/reports/JOIN-50x/                       开发/复核/复检报告
mission-book/logs/city-live-test/                    联机测试日志目录（Owner 要求建立在云端）
mission-book/logs/integration/                       ★ 集成台账（含 Owner 豁免、分批合并、
                                                     JOIN-502 二次复核 R-2、跨网机制决策表）
```

**已记录的 Owner 豁免**：本阶段集成**跳过集成工作书**，理由与事实写在 `logs/integration/CONNECTION_ONBOARDING_INTEGRATION.md` §开头——记作**豁免**而非"规则满足后省略"。

### 2.3 环境事实（下一轮直接用）

```text
City 令牌（Owner 提供）    控制令牌 1Q2W3E4R   节点令牌 1Q2W3E4R-node   （勿写入任何 Git 对象）
City 启动                  D:\A-Utopia\Utopia.cmd（已自定位 node 运行时；node 不在用户/系统 PATH，
                          实际在 D:\DS-Hns\runtime\node-v24.14.1-win-x64\node.exe）
桌面入口                   C:\Users\15601\OneDrive\Desktop\Utopia.cmd（自定位应用主体与运行时）
City 当前状态              已断开（Owner 指示断开）
```

---

## 三、下一步（唯一未完成项）：跨网真实通道的接线 + 真实两网验收

`relay.mjs` 只是**传输层**。剩下的工作，按顺序：

```text
S1  网关接线
    · 一条 WebSocket 路由让对端"拨入"成为中继 peer；准入复用**已有**凭据/邀请证明，
      不新造第二种凭据类型；
    · peerRef 用**已有**的 installationId（JOIN-503 的设备身份），不新造身份。
S2  客户端拨号器
    · choosePath 返回 relay-in-city 时改走该通道；失败要有 typed 错误并回落到其它路径。
S3  载荷复用
    · 复用 JOIN-502 的 join/request 载荷与一次性 claim；中继**只转发**，不落盘、不成为 trust store。
S4  真实两网验收
    · 两台真实 PC（可用手机热点 + 家宽）完成 join；在同一 City 的设备列表里互相可见；
      并证明"未经批准不得入城"仍成立。
S5  记录
    · 写入 mission-book/logs/integration/（按 Owner 豁免，不新建工作书），
      含问题/选择/判断逻辑、观测值、以及**明确未验证的部分**。
```

**已固定的判断逻辑（下一轮不必重新决定）**：

- 跨网机制优先级：**同网直连 > 出站拨号中继（自带，无需第三方/账号/改路由）> 已存在的 overlay > 端口转发（连同代价）> 公共中继（明确拒绝）> 无路（如实 + Owner 决策问题）**；
- 群组所需路径 = **最难那台所需**（载体必须最难对端也够得着）；
- 绝不把"估计值"喂进主城评分（`attachment`/`metered` 在 node 与浏览器都测不到 → 保持 null）。

---

## 四、必须继承的纪律（本次会话已多次用上）

1. **Claim 原子化**：读最新 main → 重判依赖/资格/claim → 只改必要字段 → fast-forward → push 失败即撤回，**不 force-push**。
2. **双机独立**：Development 与 Formal Review 必须不同实体主机；**同机不得自审**（本次 JOIN-502 的复核由 Alien 承担，因 Mech 是开发方；Owner 明确授权）。
3. **零领取必须分类**：`TEMPORARILY_UNCLAIMABLE` / `STRUCTURALLY_INELIGIBLE` / `GLOBAL_EXTERNAL_BLOCK` / `POOL_TERMINAL`，**不得把"暂时没活"写成完成**。
4. **exact-head CI**：CI 归属它跑过的那个 sha，不得用邻近 sha 顶替；本地 PASS 不能替代工作书要求的 hosted CI。
5. **`deferred != passed`**：双物理主机等未做的验收必须写明 DEFERRED。
6. **改测试要区分"改正契约"与"降低门槛"**：本次两处（`web-v02` 断言旧换码行为、`join502-gateway` 断言 401）都是**改写并写明理由**，不是删除。
7. **诚实的缺陷记录**：本次会话我自己的缺陷全部记录在案，不得掩盖——
   - JOIN-501：首版把"快照无 active session"当"已消费"，reload 会误删有效码；
   - JOIN-503：`/device/session` 被 `auth()` 拦住；把"记住的端点"当身份；
   - 集成：union 之外还有 5 层（丢参数、双鉴权前置、去重正则误删 union snapshot、`selfAuthenticating` 被并进已删段、render 双 Pairing 段）；
   - 连接面：给**冻结**对象赋值导致整页崩溃（只有真实浏览器能发现）；
   - 跨网模块：同网判定 `A && B` 短路；`sameLan(self ?? peer, peer)` **拿对端和自己比**，导致任何候选都判为同网。
8. **界面必须实机验证**：单测看不到页面级崩溃；本次已用真实 Edge 探测发现两处。
9. **凭据纪律**：令牌/长期凭据**不进 Git**；提交前做令牌值自检（本次已做，`OK：无令牌值`）。

---

## 五、流程要求（勿忘）

- **领取前**：`git fetch` 最新 `Digital-City` 与 `utopia`，实测依赖、CI、他机 claim。
- **施工中**：选择最优解，并把**问题/选择/判断逻辑**写进报告或台账。
- **完成后**：更新 `Digital-City` 工作书 frontmatter（head/CI/结论）+ 报告，推送；**再做控制面 reconciliation**。
- **零领取时**：按 §四.3 分类并留下 wake condition，不 busy-poll。
- **每次动用 City 后**：确认端口释放或按要求常驻。

---

## 六、下一轮开工第一句建议

> 读 `Digital-City/mission-book/logs/integration/CONNECTION_ONBOARDING_INTEGRATION.md` 与
> `utopia/main` 最新状态，然后执行第三节 S1（网关接线中继拨入），
> 保持第二节的纪律与第四节的环境事实。
