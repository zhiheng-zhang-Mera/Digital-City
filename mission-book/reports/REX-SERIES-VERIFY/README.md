> **Latest / 最新：** 已完成整分支复检修补并合并 main；详见 [Alien review](REVIEW_REPORT_Alien_GPT_2026_10_07.md)。下文是原 Mech 交接历史：其中“隐藏本机卡片”建议已被纠正，正确契约是存在证据成立时自己优先显示。 / Whole-branch acceptance and main merge completed; original handoff below is historical, including the superseded hide-self advice.

# REX 系列变动收尾：验证分支交接 / REX series close-out: verification branch handoff

```text
分支 / branch        rex/REX-series-verify-mech-20261007
HEAD                 099edd2ca0de01545415935723dbad09087ecb27（前一头 0d45b8c 已被本头修正）
BASE                 main cc799234e7daa3d8ccfde5673b9d07ccb2376742（未合并）
PR                    [utopia#44](https://github.com/zhiheng-zhang-Mera/utopia/pull/44)
exact-head CI        push 37576305410 与 PR 37576308377 **两个 job 全绿**（gateway-web + android）；
                     linkage 37576308301 success
交接方式 / mode       整条分支一次交给对侧实体主机（Alien-GPT）完整验收，不逐条拆开
本机角色 / role       Mech-DS（development + auxiliary verification）
合并 / merge          **不合并**：merge_authority 仍为 false；本机不释放任何 marker
```

## 0. 一次红 CI 与两次**我造成的**修正（记录，不做美化）

```text
· 首版推送后 CI 在 `each member sees itself first ...`（tests/city-members-ui.test.mjs）**失败**，
  本地全量随后也在 `Web Devices and ephemeral pairing ...`（tests/web-v02.test.mjs）暴露同一处。
  根因**是我的过度修正**：我让设备面**不再列出主机自己那一行**。
  而已被验收的契约恰恰是「每个成员**先看到自己**」—— 那一行是用户识别列表的锚点。
  报告真正要的是「**没有东西时不要把主机说成在线**」，这是 **presence** 缺陷，不是**列表**缺陷。
  ⇒ 已**回退**主机行的排除；presence 缺陷仍在它该被决定的地方（memberSnapshot）修好。
  这不是"改测试迁就实现"：被验收用例的断言**原文未改**，改回的是我越界的那部分实现。
· 更早还有一次我造成的回归（已在本分支修掉）：身份判据第一版只用 hostname，结果把**同一台机器上另一个 City
  的 worker** 归并进本机而把它藏了起来，被 tests/host-member-role.test.mjs 抓住；现要求同时满足主机默认
  `host-` 节点 id。两次修正都写进提交信息。
```

## 1. 这一轮修的五个问题（每条都**先在运行中的 City 上复现**，修完再从本分支重启 City 复检）

```text
① 打开城市时本机设备默认为自己在线且自己就是主城
   实测根因：hostDeviceId 返回**空字符串**（launcher 传了空 id），于是 memberSnapshot 添加了一个
   `undefined` 成员，而旧代码的「排除本机节点」判据 `n.id === hostDeviceId` 永远不可能命中 ⇒ 主机自己的
   node 被当成第二个成员重复列出。
   修法：空/空白 id **不是身份**，回落为城市自己的 device id；主机 principal 从一开始就存在，但**只有拿到证据**
   （本城有控制面连上，或本机自己的 node 心跳在线）才算 presence；主机自己的 node 按 principal / 默认 host- id
   归并进主机 principal，不再另列。
   **我自己中途写错过一次并已修**：第一版只用 hostname 匹配，结果把**同一台机器上另一个 City 的 worker**
   归并进本机而把它藏了起来 —— 被 tests/host-member-role.test.mjs 抓住，记录在案。

② 自己不应该能搜索到自己的主城（重复显示）
   实测根因：`/api/v0/join/nearby` 把本城自己的 cityRef/address/port 也返回了。
   修法：先按**身份**（广告携带的 City id）排除自己；广告不带 City id 时，按**本城自己的地址 + 监听端口**
   成对判定（只比端口会误伤同端口的真邻居）。**显示名一律不作为身份**。响应新增 `excludedSelf`，
   让读者能看到过滤确实发生了，而不是列表悄悄变短。

③ 配对页二维码和令牌部分丢失（怀疑分支导致）
   实测：本分支上**有活跃会话时二维码渲染为真正的 `<svg>`、六位令牌可见，且刷新后两者都还在** ——
   即材料本身没有丢。真正缺的是**守卫**：没有任何断言要求「从存储恢复的会话必须仍然带着 QR 标记与码」，
   而这正是「刷新后看起来丢了」的样子。
   新增 V9：走真实生命周期 create → persist → restore，要求恢复后 QR 标记与码都在；同时要求**过期会话
   不得作为可用材料返回**（把过期码当可用，比没有码更糟）。

④ 设备界面在联机状态下不应该显示旧的或不在线的设备
   实测：渲染出 5 张卡，其中 4 张是离线陈旧行，走的是 legacy node 路径。
   修法：两条渲染路径共用**同一个存在性判据**（成员需 online / controlOnline / computeOnline，节点需 online
   或真正 fresh）；没有设备时**用文字说明**而不是留空；**主机自己不列在自己的远程设备里**。
   对历史事实**不做隐藏**：City 仍然完整上报原始行，可随时查看。
   既有浏览器用例原本断言的是**旧行为**，现已改为断言新行为，并**额外断言那台离线设备仍被 City 上报**
   （隐藏事实与忘记事实是两回事）。

⑤ 入网时确认自身硬件，操作系统与版本也需要确认（PC 是 Win11-64 位，UI 只显示 win32）
   实测：每个 node 的 metadata 只有 `{platform:'win32'}`。
   修法：新增共享且可单测的标签模块（`apps/web/platform-label.mjs`，由
   `services/dev-gateway/platform-facts.mjs` 再导出），把平台令牌 + release + 架构变成人话；
   node agent 注册时上报完整事实集，网关持久化，设备面展示。
   修后实测：Mega-rep → `osName=Windows 11, osRelease=10.0.26200, arch=x64, arch64 标签, Node v24.14.0,
   hostname=Mega-rep`。无法识别的 release **降级为更宽但为真的说法**（"Windows"）而不是猜；未知项**省略而不是打印**。
```

## 2. 证据

```text
· 修复前后同一个探针：City 从本分支重启后 **7/7 通过**
  （主机身份真实；每个在线成员都有证据支撑；没有 node 被列两次；不再搜到自己；设备面无死行；QR 与令牌刷新后仍在）
· 证伪：**10 处源码突变各自使套件变红**并按字节还原
· 全量（修正后）：**1482 项 / 1479 通过 / 3 失败**，且**同样这 3 项在未改动的 base cc79923 上就失败**
  （本机驻留 City 的 launcher/enrolment 探针），即本分支**没有新增失败**
· 我造成的**一次回归**（hostname-only 身份匹配）被全量套件抓住并在同一分支内修掉，写在提交信息里
```

## 3. 明确**不**声称的事

```text
· 不声称任何 REX 工作书已验收：本轮只是**提出一条可整体验收的验证分支**；裁决与 marker 归对侧。
· 不声称客户端那两处自过滤守卫被测试覆盖：实测它们**在测试中不可达**（本机显式行先占了去重键），
  因此它们是纵深防御而非 ② 的修复；真正被证明的修复是服务端排除。已从证伪集中移除并写明原因，
  而不是留在集合里假装有覆盖。
· 不合并 main、不释放 marker、不改写任何工作书的历史验收事实。
```

## 4. 给对侧（Alien-GPT）的验收建议

```text
1) 用 PR #44 的 exact SHA 建独立工作树，冻结依赖后跑：node --test tests/rex-verify-device-identity.test.mjs
   （11 项：平台标签、主机 presence、自广告排除、设备面判据、QR 恢复守卫）
2) 跑受影响面：tests/host-member-role.test.mjs、tests/web-v02.test.mjs、tests/join501-review-falsification.test.mjs
3) 真实浏览器复检（这是 ①③④⑤ 的用户可见面）：开 City → Devices 应**没有**本机自己那张卡；
   Pairing 生成一次应看到 QR 与六位码，刷新后仍在；Devices 不应出现离线/陈旧行；
   注册一台 node 后设备面应显示 `Windows 11 · 64-bit (x64)` 而不是 `win32`
4) 反例优先：把 hosts 文件/端口占用造一个**同端口不同地址**的广告，确认它**没有**被误判为 self（②的反向）
5) 我明确**不**声称的部分请重点攻击：主机 presence 的判据是否还漏了路径（例如 node 在线但控制面断开时）
```

<!-- DOCUMENT_NAVIGATION:START -->
## 导航与快速信息 / Navigation and quick information

本区文档计数来自目录扫描，不表示新的运行验收。任务状态仍以工作书为准。 / Counts come from directory inspection, not new runtime acceptance. Workbooks remain authoritative.

当前Markdown文档 / Current Markdown documents: **3**.

| 子区 / Area | 文档数 / Documents | 导航 / Entry |
|---|---:|---|
| alien-evidence-2026-10-07 | 1 | [打开 / Open](alien-evidence-2026-10-07/807-repair/verification-summary.md) |

### 本目录说明 / Local documents

- [REVIEW_REPORT_Alien_GPT_2026_10_07.md](REVIEW_REPORT_Alien_GPT_2026_10_07.md)

<!-- DOCUMENT_NAVIGATION:END -->
