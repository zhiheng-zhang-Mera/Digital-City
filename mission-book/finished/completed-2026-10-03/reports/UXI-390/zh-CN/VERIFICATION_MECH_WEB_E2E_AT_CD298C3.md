# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../VERIFICATION_MECH_WEB_E2E_AT_CD298C3.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# VERIFICATION — Mech：UXI-390 branch head cd298c3 的独立Web验收

```text
FROM = Mech   HOST = Mech (review host)   SURFACE = Web only
RESULT = PASS 8/8 ASSERTIONS
STATUS = independent verification performed while the review gate is shut. NOT a review; no gate item is
         scored, and the Android surface is explicitly NOT covered by this run.
```

记录释义：Mech Review主机、仅Web，8/8PASS；review gate关闭时独立验证，非review、不评分，明确不覆盖Android。

## 运行内容与精确tree

Detached worktree绑定tip，非main checkout偶然内容：

```text
worktree HEAD        cd298c3a9fd2bcd3a974101506d2734ac4253e62
tree state           clean except the evidence file this run itself wrote
command              CITY_PORT=4463 node scripts/uxi301-web-e2e.mjs
harness              real Gateway + real reference node + real Web UI (playwright), self-spawned and torn down
duration             2026-10-02T09:44:45.324Z -> 2026-10-02T09:45:09.705Z (about 24 s)
assertions           8 passed, 0 failed      verdict PASS
```

完整释义：tree除本run写出的evidence外clean；CITY_PORT4463、真实Gateway/reference node/Playwright Web UI，自启动并拆除；时间原块，约24秒，8pass0fail。

## 为什么独立验证而非继承

Alien在f1f8bc8重跑8/8，消除自己UXI-301 review“review host未重跑Mech Web E2E”边界。该run现 **落后很多commits**：f1f8bc8 integration merge后有Android nullable handler8ab8225、逐provider Choose/feed-ref1a49e0f/6361085/29f833e、guard cd298c3。应问后续Android churn是否 **回归integrated tree**，非merge时Web是否通过。

**无回归**。第二主机、当前head、真实browser/gateway，Web8/8通过。

关键acceptance不是render声明：

```text
[PASS] the choice made in the UI really reached the backend
       recorded alien-reference-node for Q-752f894d-46bc-4e0f-b4f4-12c6c1678772
[PASS] the backend recorded when the user chose - 2026-10-02T09:45:09.687Z
```

释义：UI选择确实到backend，为原块具名task记录alien-reference-node，backend记录选择时间。

还有anti-vacuity guard：真实in-flight task产生card、cards1，后续断言不能对empty panel通过；默认解释无raw scheduler token再获确认。

## 未确立内容

- **完全不说明Android**。仅Web choice往返。Android3005c85仍待review时recorded head验证，数轮真正不确定项，不能引用本绿色结果覆盖它。
- 非review verdict。重跑作者harness是claim前提非verdict，review仍须独立找问题。
- 未验证workbook record。development_head_sha8ab8225、development_ci36988292501较tip陈旧，普通开发中lag非finding，但本run绑定control plane尚未命名commit。

## 对Alien当前工作相关附带结果：本主机无残留端口

Alien数轮处理leaked nodes污染probes，采用每run端口。故使用4463，实测teardown非假定：

```text
Get-NetTCPConnection -State Listen  where LocalPort in {4463, 4341, 4310, 4311}
  -> no results
```

**本run后无process监听任何gateway/reference-node端口**，此处harness干净拆services。仅本host本run，不确认/否定Alien主机污染。符合per-run port修复合理性；一hostclean、一hostleak值得记录，不能假定对称。

本host三node processes在线，**不归因**：两run前很早启动，与session watcher相符，一run后启动。均无gateway port，这是唯一有证据claim。

## 证据，以及没有写入哪里

控制面raw artifact mission-book/reports/UXI-390/EVIDENCE_MECH_web-e2e_at_cd298c3.json，5448bytes，keys startedAt/port/conditions/assertions/notes/finishedAt/verdict。

**Harness写evidence/raw/mission-book/UXI-301/web-e2e.json，我未commit它**。Tracked file若覆盖，会毁已review关闭的UXI-301 PASS证据，正是此前failed run摧毁同path PASS的clobber风险。本verification未改branch，worktree丢弃。
