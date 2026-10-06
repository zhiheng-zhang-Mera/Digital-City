# 验证：Mech 在合并main重测，按行为及哈希确认是评审树

本文件是完整历史中文阅读译本，不创建新的任务metadata、状态、运行结果或验收权威。原事实与限制按原稿保留；代码及机器证据在末尾逐字复制，本次没有执行报告里的命令。 / This is a Chinese reading translation of the historical report, not new metadata, state, execution or acceptance authority. Original facts and limits remain intact, and no commands from the report were executed.

[历史原报告 / Original historical report](../VERIFICATION_MECH_MERGED_MAIN_REMEASURED.md)

## 哈希已相等为何仍重跑

前轮merge tree与review head逐字一致是强主张，依赖前还须行为确认。programme曾读错tree比较，hash相等也可受同错影响，因此main实际重跑而非从merge推断。原metadata为Mech review、d0507b008cc4f91c494e24388c457a8decd9e559/origin main第7步，只读无merge移动编辑。

## main结果

UXI-390跨surface措辞/action wiring/Android parity guard11/11；真Gateway/reference node/UI Web E2E10/10，technical fold存在且默认collapsed；root1019、1017 pass、2 fail，同既有document-reader pair capability-adapters/city-roads在1a5bc0e baseline证明。数字与review head同，merge没改artifact。main亦含UXI-301 reviewed1c516b6祖先，所以UI-000至UXI-301至UXI-390整链同树不只是末项。

## 关闭及不关闭的项

从review侧关闭gate7实质：main hosted CI run37020640107在d0507b0双job success，本次独立重测证明content-preserving非仅CI说或hash。gate8终态UTOPIA_PRODUCT_UI_AND_RESCHEDULING_VNEXT_ACCEPTED不算达成，没control-plane commit声称，字符串仅gate描述/claim basis，描述不是通过，最后剩余。

control plane仍没记merge/main CI，development_head_sha仍149a4c1。因已合正确head现在是记录准确性非安全，但异head记录正是此前风险根源，closeout不该保留。

## 证据

Web E2E在throwaway worktree写evidence/raw/mission-book/UXI-301/web-e2e.json，故意不commit；该tracked文件若覆UXI-301已评PASS就重演clobber风险。上方数字是run自身verdict逐字复制，本译本原block保留不声称新运行。

## 原代码与机器证据 / Original code and machine evidence

以下依原稿顺序逐字保留。上方中文章节解释其身份、观测、原因与边界；代码字符串、SHA、数字和状态不翻译也不改写。 / Preserved verbatim in source order; the Chinese sections above explain identity, observations, reasoning and limits without rewriting code strings, SHAs, numbers or states.

### 原证据块 1 / Original evidence block 1

```text
FROM = Mech (Review host)   TREE = d0507b008cc4f91c494e24388c457a8decd9e559   (origin/main, the step-7 merge)
STATUS = independent re-run on main. Read-only; nothing merged, moved or edited.
```

### 原证据块 2 / Original evidence block 2

```text
guards     UXI-390 cross-surface wording + action wiring + Android parity      11 / 11 pass
Web E2E    real Gateway + real reference node + real UI, on main               PASS 10/10
           ... including "the technical fold is PRESENT, not absent" and
               "the technical fold is COLLAPSED by default"
root suite 1019 tests   1017 pass   2 fail
           the 2 are the SAME pre-existing document-reader pair
           (capability-adapters, city-roads) proven pre-existing at baseline 1a5bc0e
```
