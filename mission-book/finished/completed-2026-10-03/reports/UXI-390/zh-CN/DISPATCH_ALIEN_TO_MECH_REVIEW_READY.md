# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../DISPATCH_ALIEN_TO_MECH_REVIEW_READY.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# DISPATCH — Alien致Mech：UXI-390开发完成并释放Review

```text
FROM      = Alien (UXI-390 development host)
TO        = Mech (Review host; section 3 forbids Alien reviewing its own output)
STATE     = development_complete = true, released to Review
BRANCH    = uxi/UXI-390-final-product-acceptance
HEAD      = 149a4c14b596b92f04fab6269eca1dcb7727303f
CI        = run 36998342105, completed SUCCESS on exactly that head, both jobs (android + gateway-web)
BASE      = main 1a5bc0ee825c681636b9611efa2163f458c0a76f  (RS-290 freeze merge)
```

记录释义：Alien开发，MechReview，§3禁止Alien审自身产出；development_complete true。精确branch/head、base与两jobs成功CI如原块。

## 1. 交付内容

上述head完成工作书1-3、5要求开发主机的全部内容：合入UXI-301独立review head的最终integration branch、实际驱动Web/Android acceptance、Rooms coverage、action-wiring honesty repairs、第5步最小Owner package。

Owner包在本控制面reports/UXI-390/FINAL_VISUAL_PREVIEW_PACKAGE.md；图像在实现repo evidence/raw/mission-book/UXI-390/owner-package/，八images、两capture receipts，含逐图SHA256及capture时可见文字。PROCESS_DATA_POLICY.md第16行禁止City堆截图。

## 2. 唯一不得重新争论的事项

**Remote-handoff deferral已由Owner裁定，非“未解决”。**

```text
Owner ruling      = OPTION 1: keep the deferral, reason corrected, gate item explicitly NOT MET
the corrected     = the City publishes no five-dimension load vector, and unmeasured load is deliberately
reason              ineligible as an alternate
what it does not  = it does NOT pass the item, does NOT change the frozen RS-290 contract, and does NOT
mean                make ALTERNATE_DEVICE reachable
```

完整释义：OPTION1保留延后、纠正理由、gate明确NOT MET。正确理由City不发布五维load vector，未测load故意无alternate资格；不代表通过、不改冻结RS-290 contract、不使ALTERNATE_DEVICE可达。

答案写在产品注释presentation.mjs的routeStageFor及fleet-routing/pressure.mjs。此问题耗两主机 **16轮**，包括Mech正确撤回的过度声明及Alien过度概括，因此handoff明示，不让review重复发现。若不同意ruling，应告诉Owner，不花review预算重推可达性。

## 3. 开发主机具名记录已知限制，避免再当新defects

- **ALTERNATE_DEVICE按设计不可达**；SWITCH_OFFERED可达且已产生/观察。Provider capture正是offer带“nothing available to switch to”。
- Web仅 **1440x900一个viewport**；Android仅 **一个device** BICIPVNB5HS85H9T，因device locale显示 **中文**。Narrow、其他locale/devices由reviewer按§3判断是否增加。
- 第5步capture scripts断言preconditions并 **明确失败**；本轮因此发现修复三instrument faults：opened room截图与overview字节一致，因为room在fold下；receipt截sidebar非content；首click target是Home room card的data-goto，仅导航。保留这些programme最常见faults。
- **UI-102、RS-290、UXI-301仍GBK双重编码**。UXI-390自身body已修（Alien于claim1199229造成），另三closed、其中两按特定字节frozen/reviewed，有意留Owner处理而非静默重写。

## 4. Review主机负责什么

工作书第4步visual-critic loop和独立review，选择自身head。若自身repairs移head，**修复head成为被审head**并记录，如UXI-301先例。Review期间Alien不碰branch。

## 5. Review期间Alien状态

5.1 TEMPORARILY_UNCLAIMABLE / WAITING_ELIGIBILITY，记录README与reports/ZERO_CLAIM_ALIEN_ROUND197_SECTION_5_1.md。Wake为review完成或Owner发FINAL_VISUAL_ACCEPTANCE（材料已交）。第7步merge **只读预核验** 为干净fast-forward，merge-tree exit0无冲突；有意 **未执行**，因需两gates后才第7步。
