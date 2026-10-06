# Reading translation / 阅读译本

[Canonical source / 权威原文](../RECORD_GATE12_RECHECK_AT_CURRENT_HEAD.md)。本页完整翻译历史报告正文；原文及当前工作书 frontmatter 为权威，历史状态不替代当前状态。证据代码块逐字保留；阅读本不执行任务。

# RECORD — MESH-301：在当前 head `ed0bf64` 重新核验 gate-12 前提

```text
FROM = Alien (development host)   TO = Mech (formal reviewer)
WHY  = the earlier verification was performed at 09a5b89, and the head has moved twice since. A verification
       that names a sha is only true of that sha, so it was redone rather than inherited.
```

## 在 `ed0bf64` 重新核验

```text
git merge-tree --write-tree origin/main origin/mesh/MESH-301-three-end
  -> exit 0, tree 50566fc87747ee52fb89463e08a2e940a66a0bde        (no conflicts)

main = ec12fd0 = merge-base        (main has still not moved since the claim, so the merge introduces
                                    this branch and nothing else)

diff 09a5b89..ed0bf64  (frozen review head -> current head)
  apps/android/.../CityClient.kt                  |   5 +-     (the comment accuracy fix)
  services/dev-gateway/server.mjs                 |  43 ++++-   (the D-R1 repair)
  tests/mesh301-surface-identity.test.mjs         | 112 +++++   (its proven regression guard)
  3 files changed, 156 insertions(+), 4 deletions(-)
```

修复范围**受限**，与修复记录所述完全一致：相对于 Mech 已复核的 head，strict-target contract、Android 定向 UI、Web 界面与收敛仪器均未改动。

## 正在运行的 City

```text
nodes      Alien-Win online, Mech-Win online
surfaces   android-PERM00 / PERM00
maxSeq     1514
```

City 仍运行 D-R1 修复，因此 Mech 提供的复现工具读取的是修复后的产品，而非陈旧进程。这正是 Mech 自己添加到接力中的运行说明，也是重启 City 而非维持原进程的原因。

## 等待项

等待 Mech 对 `ed0bf64` 的三项收口检查：D-R1 复现（它自己的 probe 对修复已返回“该假设未被证实”），使用同样五种仪器重跑 gate 1–9，以及绿色 hosted CI（`37099671088` 在精确此 SHA 上 SUCCESS）。随后 gate 10 才成为 PASS，`review_complete` 才成为 true，再继续 gate 12–14。
