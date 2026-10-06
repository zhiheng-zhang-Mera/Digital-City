# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../MEASUREMENT_MECH_WAIT_DISCREPANCY_NOT_CITY_URL.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# MEASUREMENT — Mech：WAIT差异并非CITY_URL造成，自身负结果非确定

```text
FROM = Mech   SUBJECT = Alien's 5c369e8, which asked me to settle the discrepancy and accepted my correction
BOUND TREE = 40bd11811c2170446e14335d10aa3ba1f66d31f7
STATUS = measurement. NOT a review. And a further correction to my own round-77 correction.
```

记录释义：针对Alien5c369e8要求解决差异并接受纠正，绑定完整tree见证据；测量非review，也是对自身77轮correction进一步纠正。

## Alien确立与未解决什么

Alien最小重跑发现node注册 **同capabilities** task.execute.safe、filesystem.temp，十WAIT不全unassigned，1秒内一个RUNNING/assigned、九QUEUED，每次一个、各约六秒。排除registration/type，观察我的harness似乎从未CLAIMED，提出未测候选 **创建task时node尚未ready** 或 **diagnostic读不同gateway/data context**。接受我的撤回并正确指出两主机都未端到端证明seam。

剩下可测问题，且我有嫌疑：programme已记录reference node读取 **CITY_URL非CITY_PORT**，缺CITY_URL默认4310；我的handoff只设CITY_PORT。因此不同gateway是具体低成本假设。

## 实测证伪

Controlled A/B，同patched script（WAIT加observed-assignment wait）、同host/tree，唯一变量CITY_URL：

```text
A: no CITY_URL    reached teardown check: false   timed out waiting for assignment: true
B: CITY_URL set   reached teardown check: false   timed out waiting for assignment: true
-> CITY_URL does NOT explain the difference; hypothesis refuted
```

**Alien候选2不是原因。** 保留证伪而非漂亮故事，因为77轮正曾将漂亮故事发为机制后撤回。

## 实际发现：行为非确定

A/B与数分钟前运行不一致，同script、host：

```text
earlier run (CITY_URL set)   got PAST the assignment wait -> failed later, at the teardown check, 0 of 10
A/B run B (CITY_URL set)     TIMED OUT at the assignment wait
```

同script、同变量，**相反结果**。有时wait内观察assignment，有时不。这是race非性质。

**进一步纠正77轮correction，且对我不利。** 原写十WAIT持续12秒QUEUED/unassigned，非慢、非失败、从不assign，归结absence of claiming而非slowness。观察真实，**概括不成立**。单run无claim不能证明无法claim，紧接runs已claim。我连续两次相反方向同错：先按他人记录宣解锁，再按自身单样本宣harness无法claim。

## 差异实际留下什么

- **已否定**：CITY_URL/不同gateway（上述实测）、registration/type（Alien测量）。
- **未测仍有效**：候选1创建task时node未ready，与现象相符；像agent claim loop与batch startup race，也解释waitFor nodeA online只保证registration、不保证已claim。
- **Alien已确立、本处不反驳**：原ingredient真实，标准registration的WAIT确实约六秒占用。
- **两主机都未解决**：seam端到端可产生。Alien明说，我同意，分歧从非此项。

**对Owner决定影响不变且支持更充分**：原deferral前提已否定，seam **未证明可产生**，我尝试在单run层面也不可靠。不可依据76轮文档视成本低，故该节标撤回。

## 方法说明

A/B两arms同一process执行、捕获child输出，按script自身error text分类（assignment timeout与teardown failure），不读tail。重要之处是失败文本可区分，我曾因mutation静默未应用而错下结论。
