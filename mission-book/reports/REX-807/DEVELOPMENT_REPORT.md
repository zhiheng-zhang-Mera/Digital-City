## 9. 增量 4b（head `10aed3e2`）：Export 变成真控件 —— 工作书要求「不靠 console/API 也能用」

```text
实测缺口（不是推断）：`/api/v0/research/artifacts` 存在，但**没有任何 Web 模块调用它**，也没有任何页面渲染出口。
「产出研究交付物的那一个能力」当时只能手工打 API，而视图模型的 replay-export 区块里却列着一条
「Export artifact」控件、无人实现 ⇒ **列了没接的控件就是假按钮**。
交付：Research 页新增 Export 折叠区与两个**真控件**（下载工件 JSON / 下载指标 CSV）。会话凭据由外壳持有
（app.js 侧把 `exportArtifact` 能力注入页面），页面在拿不到该能力时**明确拒绝并说明原因**，区块写明需要 Owner 会话
而不是静默失败。连带修掉「接线元数据在说谎」：每条控件现在都记录 `wired`/`wiredAt`，export 为 `wired:true`（本页），
replay 为 `wired:false`（实际在 research-replay）。
新守卫 S12（真实浏览器 + 真实持有一份 campaign 回执的 City）：点击下载后**校验字节** —— 清单里的 cityId 等于本城、
指标与校验和在场、文件名是具名而非 blob id、CSV 带指标表、页面报告「上次导出」。
写这条测试时暴露并修掉**我自己**的三个缺陷（逐个记录，不静默修）：
  E1 外壳能力返回裸字符串，页面把名字存成 `''`，于是「上次导出」永不显示 —— 改为返回 `{name,format,bytes}`。
     （这一处在第一次运行时表现为「控件渲染正确但状态不更新」，靠浏览器端 console 定位，不是靠猜。）
  E2 测试读了**折叠区块的 innerText**（该浏览器下折叠元素 innerText 为空），把正确控件误判为未渲染 —— 改用 textContent。
  E3 测试自己的助手把刚展开的折叠区又**点了关**（点开着的 `<details>` summary 会收起），导致按钮不可见。
另有一个更早的失败也是我的、不是产品的：首版导出测试用错了 node 凭据，看到的是空节点列表。
证伪：**8 处突变全部变红**并按字节还原（新增两处：**网关**放宽令牌检查；把 Export 控件留成无处理器的摆设）。
本地证据：rex807 两套 12/12；更宽的相邻集（已验收 REX-801 研究界面、REX-804 故障/回执/Web、REX-806 工件面）32/32；
check:docs 三根 SYNCHRONIZED。exact-head CI 结论见工作书 development_ci 字段（不预写绿）。
```

## 10. 边界（未越过）