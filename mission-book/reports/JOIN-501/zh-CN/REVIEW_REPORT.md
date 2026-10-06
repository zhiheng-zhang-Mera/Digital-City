# JOIN-501——正式审查报告

阅读译本 / Reading translation：逐节完整历史阅读译本，不构成第二份权威审查状态；失败及边界保留。

> 工作簿：[JOIN-501-pairing-session-lifecycle-and-display.md](../../../finished/completed-2026-10-04/connection-onboarding-components/JOIN-501-pairing-session-lifecycle-and-display.md)
> 被审查头：`e925ae1ef4dda6f51d89a1faa025d1b8666d8c58`，join/JOIN-501-pairing-session-lifecycle。
> Utopia main基线：`13109b4c206feb3c1a9107b369715e84af65eaf1`。
> 开发Alien，审查Mech，不同物理主机，符合CONSTRUCTION_RULES.md第3节。
> 精确头托管CI37116491572 COMPLETED SUCCESS，该分支push、head_sha e925ae1…；gateway-web15步、android12步均completed/success。
> 审查工具：review/JOIN-501-mech-formal-review @4917a51，tests/join501-review-falsification.test.mjs。
> 结论PASS，无必须修复，review_complete:true。

## 1. 审查内容与验证方法

工作簿要求特殊：十二项编号自动测试以及Owner所见产品语义，因此依次做三件事。

1. 精确头对齐：工作簿development_head_sha与git ls-remote分支完全一致；按head_sha重查托管CI，未直接信任development_ci。运行是该SHA、该分支的push。
2. 实际运行作者工具，不仅读代码。精确头23相关测试全通过：pairing-lifecycle257行/16case、pairing-session-lifecycle-web4浏览器case，以及pairing.test.mjs与重做web-v02.test.mjs。
3. 构建第4节独立证伪，在作者未覆盖的四点攻击规则，同时检查页面发送内容（网络POST /api/v0/pairing/session计数）和City持有内容（规范GET /api/v0/pairing/info）。规则可能双向破坏：失效码显示活跃，或活跃码丢失；每次攻击都检查两者。

## 2. 逐工作簿门禁判断

| # | 要求 | 结论 | 建立方式 |
|---|---|---|---|
| 1 | 进入Pairing页创建API调用0 | MET | 重跑作者工具 |
| 2 | render/refresh/reconnect仍0 | MET | 作者模拟offline/online，加审查A2真实关闭WebSocket并让产品重连 |
| 3 | 显式Generate一次恰一session | MET | 作者网络计数，A3增加同task密集点击 |
| 4 | ACTIVE普通重绘同id/code/payload | MET | 作者工具，A2传输断连后独立再观察 |
| 5 | ACTIVE SPA离开返回同session | MET | 作者工具及web-v02按规范session id断言 |
| 6 | ACTIVE无Refresh新session | MET | 控件为禁用状态标签Code active · expires on its own；两套强制点击都确认0创建且规范id不变 |
| 7 | consume后材料消失、USED、可Generate | MET | 作者真实pairing/exchange及独立进程consume；A1镜像情形是另一客户端替换City session |
| 8 | 已消费secret重用拒绝 | MET | server410两次断言 |
| 9 | expire后材料消失、EXPIRED、可Generate | MET | 作者3s TTL，A4过期期间隐藏tab |
| 10 | 过期事件不创建 | MET | 两套均检查整个过期路径创建计数 |
| 11 | 过期后第二次显式点击恰一新且不同session | MET | 对规范id而非DOM断言 |
| 12 | 配对材料无永久/裸token | MET | 渲染视图、invite载荷、QR及存储记录扫描control token |

第7节还要求尝试经route/reload/reconnect使码提前消失或秘密轮换，正是A1–A4所做。四项都未能破坏规则，这是门禁要求的结果。

## 3. 发现

无必须修复或阻断缺陷。以下记录使审查可被检查，而不只有“通过”。

### F-1（备注，非缺陷）——被替换session报告USED

pairing-lifecycle.clearOnSessionChanged()以自身expiry判断终态：尚未到期即USED。消费场景正确，也是工作簿命名场景；但同City另一control客户端轮换session时，原页面也显示“That code was used”。码确实死亡且正确动作是生成新的，所以操作不会误导用户，只是比“replaced”略不精确。City没有规范consumed/replaced区分，Pairing.active()为boolean且descriptor只有id；区分需server契约变化，超出UI生命周期有界修复。留阶段整合备注。

### F-2（备注）——REASON_REVOKED定义但无产品路径产生

pairing.revoked只能通过clear(reason)显式reason到达，而唯一调用者disconnect传空reason，所以当前不可达文案。非缺陷：i18n覆盖要求两语言pack都有该key，其存在可标注显式用户可见取消选择；但当前无人调用前属于死文案。

### F-3（备注）——两语言pack均留两个被替代字符串

pairing.reconnect与pairing.unavailable已不被app.js引用，它们描述的重连清配对路径正是本任务删除的。无害且仍受locale parity测试覆盖。

### F-4（审查者工具错误，改变了结果）

首轮隐藏tab攻击报告两产品FAILURE：“隐藏时过期的码不应仍显示active”及“City确认session已消失”。两者源于测量工具：设置10分钟TTL却只等20秒，session不可能过期；所见空显示来自前一个攻击的消费。修正工具，从City expiresAt读取TTL，并明确断言EXPIRY，防止观察consume误通过，所有检查通过。保留此点，因为审查测量错误不能在PASS中静默修正。

## 4. 审查者独立证伪工具

review/JOIN-501-mech-formal-review @4917a51的tests/join501-review-falsification.test.mjs在被审查头运行，4/4 PASS。

| ID | 攻击 | 作者套件未覆盖原因 | 结果 |
|---|---|---|---|
| A1 | 同City第二客户端创建自己的session，被测页不操作 | 工作簿禁止Owner页轮换活跃码，但未测City在页面下方变更session | PASS：旧材料离开页面并说明，累计一次创建 |
| A2 | 关闭页面真实WebSocket，触发产品onclose→connect | 作者只有模拟offline/online，非真实传输断开 | PASS：无创建/轮换，重连后同码同QR |
| A3 | 同task三次Generate，在任何await返回前 | busy-flag最坏竞争，光标签检查看不到 | PASS：恰一次创建、一个active session、控件再次禁用 |
| A4 | 隐藏tab跨过expiry再显示 | 倒计时间隔被节流/冻结会破坏自动消失 | PASS：无码、原因EXPIRY非consume、无创建；下一点击一新session |

## 5. 明示测试环境观察

裸次级工作树跑整套1075测试、1073通过、2失败：city-roads和web-terminal-shell，均ENGINE_UNAVAILABLE。原因是City树另外安装的第三方parser，CI自身步骤pnpm --dir city install而裸工作树没有。未改基线上同样复现，安装完整checkout通过；上文同精确头托管整套绿色。因此是审查工作树环境缺口，不是被审修改属性。

## 6. 本审查边界

- 审查与开发是不同物理主机，满足第3节；浏览器在审查本机对loopback Gateway运行。真实双机网络属于阶段整合，而非本UI生命周期任务。
- 未验证Android界面。第7节验收要求Owner Web页及第二endpoint消费码，两者已验证，第二endpoint包括独立进程。
- 结论只针对e925ae1。后续提交需自身CI及重新应用审查，不能继承。

语言配对 / Language pair: [原文 / Source](../REVIEW_REPORT.md)
