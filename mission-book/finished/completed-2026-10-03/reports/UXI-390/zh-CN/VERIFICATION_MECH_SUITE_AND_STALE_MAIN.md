# Reading translation / 阅读译本

[Canonical historical source / 历史权威原文](../VERIFICATION_MECH_SUITE_AND_STALE_MAIN.md)。本页完整翻译归档历史解释正文；证据代码块原样保留。当前 canonical 工作书 frontmatter 与权威报告决定当前状态，历史读本不覆盖现值、不执行任务。

# VERIFICATION — Mech：cd298c3 integration suite，以及自身checkout陈旧main缺陷

```text
FROM = Mech   HOST = Mech (review host)
RESULT = Alien's suite figure REPRODUCED EXACTLY, and both failures are PRE-EXISTING at the true baseline
STATUS = independent verification. NOT a review. No gate item is scored.
```

记录释义：Mech Review主机独立验证非review，不评分gate。精确重现Alien suite数字，两失败均真实baseline旧有。

## 1. 精确重现声明数字

Detached worktree绑定branch tip，针对特定tree检查：

```text
worktree HEAD   cd298c3a9fd2bcd3a974101506d2734ac4253e62
command         node --test "tests/*.test.mjs"      (69 test files)
result          tests 1017   pass 1015   fail 2
```

Alien报告1017/1015/2，第二主机在具名head精确一致。

## 2. 关键另一半：两失败旧有，同样成立

只计数无证明：merge可引入两新fail而巧合总数不变。因此两tests于 **真实baseline** 实跑：

```text
baseline        1a5bc0ee825c681636b9611efa2163f458c0a76f   (origin/main, the RS-290 freeze merge)

tests/city-roads.test.mjs
  ✖ Bridge Road extraction preserves all six published document retrieval digests
tests/capability-adapters.test.mjs
  ✖ document bytes flow through real readers and into temporary knowledge
```

两者未触baseline同样失败，故integration **无回归**，关键声明由验证而非作者run推断确立。与Alien merge说明同理：merge即新tree，即使可证相同，suite total不是regression check。

## 3. 不目信ref name发现自身checkout缺陷

建baseline worktree用git worktree add --detach path main，习惯打印resolved SHA，结果：

```text
e7c498f5acd86da324a45c3278219c8daa612561   merge(PROGRAMME): Engineering Manager EM-001..EM-013 corrected union
```

**不是baseline**。本地main陈旧，是origin/main **ancestor**：

```text
git rev-parse main           -> e7c498f5acd86da324a45c3278219c8daa612561
git rev-parse origin/main    -> 1a5bc0ee825c681636b9611efa2163f458c0a76f
git merge-base --is-ancestor 1a5bc0e main   -> exit 1   (NOT an ancestor: local main is behind)
git merge-base --is-ancestor main 1a5bc0e   -> exit 0   (local main is the older tree)
```

**后果本会是Alien上周发现的同wrong-tree comparison**。若在该tree运行两tests并说“main也fail”，实际比较RS-290 freeze之前EM tree，引用workbook未命名baseline。§2有效仅因打印SHA发现不匹配；撒谎的是main ref名。

**已修**：git merge --ff-only origin/main，因strict ancestor干净fast-forward，main现1a5bc0e、checkout匹配声明baseline。§2测量前从正确ref重建worktree。

**未受影响项，核验非假定**：reconcile第104行从git rev-parse origin/main非local main派baseline，因此contract字节一致check一直正确。直接读该行不凭记忆，因为“工具大概没事”正是失败推理。其他worktrees用明确origin refs，同样不受影响。

## 4. 为何记录而非悄然修

静默改变comparison含义的环境缺陷与Alien发现的tool bug同class，须具名解释并显式修复。可推广规则：**打印resolved commit非branch name**，也解释早先working tree代branch evidence check产生自信错误FAIL。

无针对Alien/产品finding。Branch干净，除两旧fail外suite绿，唯一defect在reviewer clone。
