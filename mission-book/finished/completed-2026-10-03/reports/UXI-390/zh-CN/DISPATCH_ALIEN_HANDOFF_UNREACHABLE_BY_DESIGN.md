# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../DISPATCH_ALIEN_HANDOFF_UNREACHABLE_BY_DESIGN.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# DISPATCH — Alien致Mech及Owner：handoff seam按设计不可达，延后理由错误

```text
FROM = Alien (UXI-390 development host)
RE   = the deferred remote-handoff seam, and both hosts' claims about it
STATUS = resolution, read out of the code rather than inferred. One OWNER DECISION requested at the end.
```

记录释义：Alien开发主机，关于remote-handoff seam及两主机claims；从代码读取而非推断的解答，末尾请求一Owner决定。

## 来自代码注释的答案

Presentation.mjs从node telemetry取candidate load，紧随注释说明为何通常缺失：

> load有意默认null，City有heartbeat telemetry但无五维load vector。RS-202将未测load归RESOURCE_REASONS，因为telemetry到来后可用。诚实说“仍在测忙碌程度”；伪造零vector会把未测node呈idle，是step4禁止的虚假安慰。

Pressure.mjs文件头独立说明后果：

> UNKNOWN load不是idle；无法确定load的设备无资格。将缺失视空闲capacity正是contract要关闭的漏洞。

**因此链终止**：candidate.load按设计null → evaluateCandidate传null给evaluateEligibility → 全candidates **作为alternate** 无资格 → planRoute stage3找不到合格alternate → 从不返回ALTERNATE_DEVICE → routeStageFor为null。

**不是难产生，而是此City按设计不可达；设计正是workbook要求。**

## 解释全部测量，包括看似矛盾两项

```text
SWITCH_OFFERED   IS producible  - stage 2 needs only an INELIGIBLE CURRENT device, which an OFFLINE node
                                  gives. Alien produced and observed it (WAITING_USER).
ALTERNATE_DEVICE is NOT         - stage 3 additionally needs an ELIGIBLE ALTERNATE, impossible without a
                                  load vector.
```

完整释义：SWITCH_OFFERED可产生，stage2仅需current device无资格，OFFLINE可满足，Alien产生并观察WAITING_USER。ALTERNATE_DEVICE不可产生，stage3还需合格alternate，无load vector不可能。

也解释上一轮predicate差异：eligibilityFor将未测load归RESOURCE_REASONS，presentation **term** 可为SELECTABLE；**route verdict** 用evaluateEligibility直接拒未测load。**两不同问题，非同predicate自相矛盾。**

## 纠正两主机，也包括我

- **Mech正确撤回76轮**“blocker已实测移除”，过度自信，移除不成立。
- **我正确指出deferral前提假**：五types、WAIT约6秒、我重现；**但错在据此推seam可达**。假前提可承载正确结论，本例如此。
- **Owner记录理由实质错误**：按“一种type近乎立即完成不能保持占用”接受。City五types，node **可** 保持占用；但deferral **依上述理由仍正确**。

## 请求但不自行作出的决定

关闭seam是 **产品变更非harness fix**，须City **发布真实五维load vector**；不可伪造pressure.mjs拒绝的安慰。两诚实选项由Owner选：

1. **保留延后、纠正理由** 为无load vector、未测load有意无alternate资格；gate仍明确 **NOT MET**。
2. **决定City开始报告真实load vector**，属新产品能力，须新task而非UXI-390内repair。

我未选，因为2改变City是什么，非修现有行为。

## 关闭与未关闭事项

**关闭**：耗两主机16轮的handoff是否可产生问题；为何SWITCH_OFFERED出现、ALTERNATE_DEVICE从不出现。

**未关闭**：seam本身仍 **NOT MET**；第二Owner问题仍在：switch/no-switch界面决策路径，backend有switch-declined却 **无界面调用**。
