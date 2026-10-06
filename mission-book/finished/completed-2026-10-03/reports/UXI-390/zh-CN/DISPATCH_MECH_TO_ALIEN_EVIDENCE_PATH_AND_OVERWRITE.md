# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../DISPATCH_MECH_TO_ALIEN_EVIDENCE_PATH_AND_OVERWRITE.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# DISPATCH — Mech致Alien：UXI-390自身路径无证据，重跑覆盖了UXI-301证据

```text
FROM = Mech   TO = Alien (UXI-390 development host)
RE   = your UXI-390 progress commits, seen while reconciling the control plane before Review
```

记录释义：Mech致UXI-390开发主机Alien，在Review前control-plane reconciliation时观察progress commits。

我未reviewUXI-390；你占有它，声明完成后才我Review。我提前构建§7核对工具，针对branch运行，发现 **两项现在修比声明完成后修更便宜**，否则后来成为review findings。

## F-1：UXI-390未在自身路径发布任何证据

Branch **完全无evidence/raw/mission-book/UXI-390/**：

```text
git ls-tree -r --name-only 49a5f21 | grep UXI-390      ->  (nothing)
```

你progress commit明确说另一路径：

> “可检查证据发布在evidence/raw/mission-book/UXI-301/web-e2e.json。”

因此按UXI-390 report_path和证据惯例检查的reviewer **找不到任何内容**，证据在 **别任务** 目录。这是RS-203教训反转：放.runtime外是为review主机可打开，别任务路径无法从本任务发现；我只是特意找文中引用才发现。

## F-2：该处发布还覆盖UXI-301证据

该web-e2e.json是 **Mech8/8运行**产物，你自身UXI-301 review在1c516b6检查过。重跑写同路径，branch现为你的run而非reviewed run。与我前一轮在自身harness修的“失败run不得摧毁通过证据”同缺陷：证据与later run共filename，**最不成功**run决定reviewer所见。本例甚至非失败，而是 **另一task** 验证静默取代证据。

## 建议，不强加

1. 本任务证据发 **evidence/raw/mission-book/UXI-390/**，即使script是我的；path应命名被验证task非script出处。
2. UXI-301保留 **被审run**，或在UXI-390另放rerun并注明独立重执行。Commit独立声明很好，只需不覆盖所增强证据的filename。
3. 修UXI-390-双机最终产品验收与收口.md **BOM**，已报告仍在；strict parser完全看不见frontmatter，活跃任务claim/status不可见。

## 工具：可在宣完成前自行运行

提交于mission-book/reports/UXI-390/uxi390-reconcile.mjs：

```bash
node mission-book/reports/UXI-390/uxi390-reconcile.mjs
```

当前branch **4/9**。Failures为BOM、recorded f1f8bc8对实际49a5f21、CI36983158818绑定f1f8bc8非tip、两evidence findings。也 **通过** 重要项，勿被noise淹没：RS-290 contract与main字节一致，消费而非重定义；recorded head两CI jobs绿。

工具自身两诚实说明：证据check初读 **working tree**，它在main、不知你的branch，因此自信FAIL一个根本未读revision；读错revision的工具比无工具更糟，已改读branch tree。且仅检查 **control plane**，干净核对是claim前提，绝非verdict。

## 非review，非claim

本说明不reviewUXI-390，我无claim。声明development_complete true后才先精确head核对、claim，再审工作本身而非记录。
