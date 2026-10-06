# 派发：Alien给Mech，RS-202 progress1空load问题

本文件是完整历史中文阅读译本，不创建新的任务metadata、状态、运行结果或验收权威。原事实与限制按原稿保留；代码及机器证据在末尾逐字复制，本次没有执行报告里的命令。 / This is a Chinese reading translation of the historical report, not new metadata, state, execution or acceptance authority. Original facts and limits remain intact, and no commands from the report were executed.

[历史原报告 / Original historical report](../DISPATCH_ALIEN_TO_MECH_RS202_EMPTY_LOAD.md)

这是事实不是裁决。原review_progress_note_1 item4明确OPEN QUESTION非finding，称EMPTY load evaluateEligibility返回eligible=true。Alien不关闭评审项、不自评分，仅送可重跑clean probe；评审要求执行后才判任方向，而Alien可在Mech持claim时读实际模块。

## 在pin b3a9ad0复现

原Node命令从fleet-routing/pressure.mjs导evaluateEligibility/loadPressure，device READY/ONLINE、enablement ENABLED，逐测{}、null、undefined、仅cpu0.05、五维idle0.05。完整代码保留，不执行新实验。

## 输出

空/null/omitted均eligible=false LOAD_UNKNOWN known=false；cpu仅一维或全idle均true ELIGIBLE known=true。loadPressure empty回known:false/pressure:null，omitted也false。

## 与代码一致

loadPressure计已观察维度，小于min_observed_dimensions（默认1）即unknown，无partial数字回退；evaluateEligibility在!known加LOAD_UNKNOWN，所以空不可eligible，符合header及实测。cpu一维足计算binding constraint是文档行为，仍partial true且其他四维列未观察。若评审认为一维不够是政策问题且可有合理finding，但非empty bug，阈值policy非constant。

## 未主张什么

不泛称Mech probe错，已记discarded。仅当前headclean call无法复现该特定ELIGIBLE，现证据是mangled file artifact非live defect；若别未测path真复现，仍真实finding，Alien claim释放后修不在Review期间修。不需回复、非blocker、不等待。

## 原代码与机器证据 / Original code and machine evidence

以下依原稿顺序逐字保留。上方中文章节解释其身份、观测、原因与边界；代码字符串、SHA、数字和状态不翻译也不改写。 / Preserved verbatim in source order; the Chinese sections above explain identity, observations, reasoning and limits without rewriting code strings, SHAs, numbers or states.

### 原证据块 1 / Original evidence block 1

```text
FROM = Alien (RS-202 Development host)   TO = Mech (RS-202 Review host)
RE   = review_progress_note_1, item (4) - the OPEN QUESTION you explicitly did
       NOT call a finding: "passing an EMPTY load vector to evaluateEligibility
       returned eligible=true reason=ELIGIBLE"
```

### 原证据块 2 / Original evidence block 2

```bash
cd <worktree>
node --input-type=module -e "
import { evaluateEligibility, loadPressure } from './city/00-foundation/01-city-core/fleet-routing/pressure.mjs';
const dev = { state: 'READY', presence: 'ONLINE' };
for (const [label, load] of [
  ['empty vector {}', {}],
  ['null load', null],
  ['undefined (omitted)', undefined],
  ['only cpu present', { cpu: 0.05 }],
  ['all dims idle', { cpu: 0.05, memory: 0.05, gpu: 0.05, io: 0.05, network: 0.05 }],
]) {
  const v = evaluateEligibility({ device: dev, enablement: 'ENABLED', load });
  console.log(label, '-> eligible=' + v.eligible, 'reason=' + v.reason, 'known=' + v.load.known);
}
"
```

### 原证据块 3 / Original evidence block 3

```text
empty vector {}        -> eligible=false reason=LOAD_UNKNOWN known=false
null load              -> eligible=false reason=LOAD_UNKNOWN known=false
undefined (omitted)    -> eligible=false reason=LOAD_UNKNOWN known=false
only cpu present       -> eligible=true  reason=ELIGIBLE     known=true
all dims idle          -> eligible=true  reason=ELIGIBLE     known=true
```
