# UI-101 — Web 产品壳与信息架构 · DEVELOPMENT REPORT

> 常驻规则：[../../CONSTRUCTION_RULES.md](../../CONSTRUCTION_RULES.md)
> 工作书：[../../ui-civilization/UI-101-Web产品壳与信息架构.md](../../ui-civilization/UI-101-Web产品壳与信息架构.md)
> Development Host：`Alien`　分支：`ui/UI-101-web-product-shell`
> 结论头：`56c819000548d9496ecb9fd2459f19d1ad9fcec1`　CI：`36870347917` success
> 视觉方向来源：UI-000 已采用方向 **C″**（`aea8361`，Mech 复核 `2978e31` PASS_WITH_REPAIRS）

## 1. 交付内容

`apps/web/**` 的 presentation 层按采用方向重做为产品壳：暗色舞台 + 紫罗兰结构色 + 荧光绿主信号 +
全息青副信号、切角面板、发丝框、大写宽字距微标签、tabular 数字、分段仪表。

| 施工步骤 | 状态 | 说明 |
| --- | --- | --- |
| 1 一级导航产品化 | 完成 | Home / Tools·Rooms / Devices / Activity 为一级；Services·Tasks·Actions·Pairing·Settings 归入「高级」组 |
| 2 删除工程标题 | 完成 | 双语包同时改写：`WORKSPACE / ALIEN`→`城市链路`、`CONTROL SURFACE`→`此刻`、`Reference implementation`→`个人终端`、`DIGITAL CITY / 01`→`个人终端` |
| 3 Home 以「现在能做什么/正在发生什么」为主 | 完成 | 统计卡片行删除；Home 首屏为**助理位**，其后依次是运行节点＋最近动态、房间栅格、最近任务 |
| 4 Ask/Do 为自然语言主入口，状态表现清晰 | **部分验证**（见 §4） | 壳层具备 已就绪／需要确认／请选择目标／没有匹配／执行中 的表现分支；本环境只能触发其中两种 |
| 5 raw record 默认折叠 | 完成 | 事件类型、事件序号、任务 id、房间 slug、`LOCAL_PRODUCT`、action id/route、Ask 协议状态全部折叠或本地化 |
| 6 保留全部既有可达能力 | 完成 | 未删除任何能力路径；`repo` 套件 854/854 |
| 7 可复用 design token/组件 | 完成 | `apps/web/style.css` 重写为壳层设计系统，覆盖既有 JS 产出的**全部** class，未逐页硬补 |
| 8 真实浏览器覆盖桌面与窄屏 + 截图 | 完成 | 见 §3 的两支验收脚本 |

### 主页助理位（采用方向的落点）

切角＋扫描线帧、青色边缘光、`ASSISTANT` 标签、`SLOT 01`，身份区 `未指派 / Unassigned`，并列出后期将绑定的
四个 v2-invariant-4 字段（绑定设备／形象／语音／职务），文案明说「现在只是占位」。

**两处刻意决定（记录而非默默处理）：**
1. **人物位不挂任何控件。** 渲染出来点了没反应的控件，正是本项目已抓到过的假可点击缺陷（`6059252` 修掉的
   17 个空 handler），故配置入口留在「设置」。
2. **立绘是诚实的线稿剪影。** 仓库无角色美术资源，界面明写「占位剪影」，不暗示成品资产。

### 继承自 UI-000 复核的修复

壳层沿用 Mech 复核修复后的安全三级色 `--ink-3: #8b82a8`（原 `#6f6788` 在白底/近黑底上仅 3.26–3.79:1，
低于 WCAG AA 4.5:1），**不重新推导**，避免该修复在下游丢失。

## 2. 自动化验收脚本（随分支提交）

| 脚本 | 覆盖 |
| --- | --- |
| `scripts/ui-101/shell-shots.mjs` | 配对后走遍 9 个壳层页面（1440）＋ Home/Rooms/Devices（390）；断言两种语言均无工程语汇、无禁用几何字符图标、默认路径无原始内部词表、无横向溢出、无页面错误 |
| `scripts/ui-101/ask-and-detail-shots.mjs` | 驱动壳层自己的 Ask 表单走各状态并读取状态徽章；打开 Action 行，断言详情默认折叠且展开后可达 |

> `dev-gateway` 必须同时提供 `CITY_TOKEN` 与 `CITY_NODE_TOKEN` 才能启动——这是先前阻塞验收的原因，已解决。

## 3. 验证结果

```text
repo 套件                     854/854 pass
hosted CI                     36870347917 success（android + gateway-web）
shell-shots                   CLEAN
ask-and-detail-shots          CLEAN
```

**这几支探针在本任务期间共抓到并修掉 10 个真实缺陷**，全部是 Alien 自己上一轮刚推的代码里的问题：

1. 导航用 ASCII/Unicode 几何字符当图标系统（UI-101 硬规则违反）
2. 运行节点图标残留 `U+25A3`
3. Home 与房间栅格打印房间 slug
4. Home 与 Activity 打印原始事件词表（`CLIENT_CONNECTED` / `CITY_STARTED`）
5. Rooms 页打印 `LOCAL_PRODUCT` 生命周期与 slug
6. Actions 列表内联打印 action id 与 route
7. Ask/Do 把原始协议状态当徽章显示
8. `terminal.js` 的 `badge()` 只接受一个参数，使本地化标签被静默忽略（真正的根因）
9. 探针自身的脆弱文本 marker（改为读状态徽章）
10. 探针自身点错元素（点 `#view` 第一个按钮而非 action 行，从未真正打开它断言的详情）

第 9、10 条是**复核工具自己的缺陷**，一并记录：工具的通过必须由工具本身挣得。

## 4. 明确未验证项（不当作通过）

**Ask/Do 四态在本环境只能触发两种。** 实测：

```text
route-confirmed   state=已就绪     controls=2
needs-choice      state=没有匹配   controls=16
ambiguous         state=没有匹配   controls=16
unmatched         state=没有匹配   controls=16
```

原因是本验收环境的 gateway **没有 Room hub、也没有注册节点**，triage 把所有输入都解到 unmatched 家族。
这是**环境限制，不是壳层缺陷**：`askResultMarkup()` 对 `AWAITING_CONFIRMATION` / `AMBIGUOUS` /
`UNMATCHED` / 结果态各有独立分支与独立控件。但「未能触发」不等于「已验证」，故此处如实标为部分验证，
**交由复核主机在具备 Room hub 的环境下补测**。

同样如实说明：Action 详情截图是在演示行（FAILED）上拍的；本环境没有真实成功行动历史。

## 5. 边界与披露

- 未改 `services/**`、`contracts/**`、scheduler/provider/runtime 语义；未改任何 API/DTO。
- 未迁移框架：Web 仍是 Vanilla HTML/CSS/JS。
- 设备**详情面板**保留原始事件类型（`events(list, raw=true)`）：该面板本身就是「运行详情」落点，与 UI-000
  复核对 advanced surface 的裁定同一逻辑；`tests/web-v02.test.mjs` 亦钉住此处的 `NODE_ONLINE`。
- 演示数据（房间摘要等）仍是英文，未随界面本地化——属数据层，非本次 presentation 范围，记录备查。
- 本报告由 Development 主机 `Alien` 出具；按 §3，UI-101 的独立复核**必须由 Mech** 执行，Alien 不得自审。
