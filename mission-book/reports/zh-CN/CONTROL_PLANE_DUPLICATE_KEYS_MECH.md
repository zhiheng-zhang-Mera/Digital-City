[English source / 英文原稿](../CONTROL_PLANE_DUPLICATE_KEYS_MECH.md)

> 历史阅读译本：数字、结论及未修复状态绑定原报告时点，不代表2026-10-06的当前盘点。 / Historical reading view: counts, conclusions and unrepaired status belong to the original report, not the current inventory.

# 控制面完整性 — frontmatter重复键：发现、核验、已修复

```text
FOUND BY    = Alien (reported, not fixed - correct call)
VERIFIED BY = Mech
ATTRIBUTION = Mech   (established by git, not assumed)
STATUS      = REPAIRED by Mech, with each decision recorded below
```


## 实测缺陷

两份REVIEW_COMPLETE工作簿的YAML frontmatter内存在重复键。重复键导致YAML结构不规范；不同解析器可能报错、取首值或末值，因此§2规定只存在于frontmatter的领取真值变得含糊。

```text
UI-000  review_covers_revision_head  x2   ->  false   (Alien 5f1b3f1)
                                              true    (Mech 1997293)   <-- CONTRADICTION

UI-101  review_delta_verified        x2   ->  Alien c67932a narrative
                                              Mech  c8e90df detail
        review_delta_required        x2   ->  Alien c67932a prose
                                              Mech  c8e90df boolean true
        review_not_verified          x2   ->  Mech 9ccb79a narrower text
                                              Mech c8e90df wider text
```


UI-102、UI-103和UI-190没有问题，缺陷局限于我修改过的两份工作簿。

## 归因：是我引入的

```text
5f1b3f1 | Alien | feat(UI-000): record the Owner style ruling and the C-prime revision   <- wrote false
1997293 | Mech  | review(UI-000): Mech revision review complete ...                      <- wrote true
9ccb79a | Mech  | complete(UI-101): Mech Review complete ...
c8e90df | Mech  | review(UI-101): delta re-verification ...
c67932a | Alien | correct(UI-101): record the delta re-verification and withdraw an overstatement
```


重复来自我的修改：我在每份工作簿追加第二组复检字段时，使用了已有键名，而没有扩展原字段组或给新字段不同名称。这与我反复遇到的frontmatter编辑错误同类：PowerShell UTF-8 BOM、CRLF的`$`锚点问题，以及曾经吞掉字段头而留下未闭合YAML。现在每次编辑都会检查BOM和重复键；这里的检查没有发现，是因为这些修改早于该习惯。习惯正确，但形成得太晚。

## 修复及逐键处理理由

采用的规则是：重命名以保留，仅在能证明已被取代时删除。删除重复项会丢失记录事实；重命名没有这项代价，两条陈述仍可审计。因此，只有确实属于同一字段的两种情况通过删除解决。

| 工作簿 | 键 | 操作 | 理由 |
|---|---|---|---|
| UI-000 | `review_covers_revision_head` | 删除过时的false，保留true | 同一布尔字段存在真实矛盾，必须取舍。字段询问复检是否覆盖修订head；Mech的1997293就是修订复检，与revision_review_repairs、revision_review_claims_verified同组，状态为REVISION_REVIEW_COMPLETE_PASS_WITH_REPAIRS。false对应修订复检之前的状态。 |
| UI-101 | `review_not_verified` | 删除早期文字，保留后期文字 | 同一主张、同一键名。9ccb79a说“本次复检未覆盖”；c8e90df扩展为“复检和delta复验均未覆盖”，严格包含早期陈述。已确认保留字段使用更广表述而非较窄表述。 |
| UI-101 | `review_delta_required` | 段落重命名为review_delta_required_note | 同名布尔值与段落是不同类型，不必丢弃任何内容。true保留原键名，背景段落另设键。 |
| UI-101 | `review_delta_verified` | 摘要重命名为review_delta_verified_summary | 两条实质陈述彼此一致，都记录PASS_WITH_INTEGRATION_DEPENDENCY。详细内容保留原名，Alien后来的摘要保留而非删除。 |

## 修复核验

```text
duplicate keys, all UI workbooks        0
duplicate keys, ALL of mission-book     0
BOM on either edited file               false
diff                                    4 insertions, 4 deletions
UI-000 keys  66 -> 65   lost: (none)   gained: (none)
UI-101 keys  51 -> 50   lost: (none)   gained: review_delta_verified_summary, review_delta_required_note
renamed values byte-identical to originals   review_delta_verified_summary (1475 == 1475)
                                             review_delta_required_note   (1242 == 1242)
surviving review_not_verified contains the WIDER wording   true
surviving review_covers_revision_head                      true
```


没有信息丢失：两项重命名后的值与被替换字符串逐字节一致；两项删除均是已被取代的值，替代值已确认存在。

## 本次我的两个检查本身出错，均通过实际执行发现

1. 首次重复键扫描报告0重复，本会与正确发现相矛盾。原因是在遇到开头的`---`时就退出循环，解析的是空块。
2. 修复脚本的重命名后断言，对拼接字符串使用`/^…$/`却没有m标志，只能匹配偏移0，于正确重命名处抛错。异常发生在写入前，UI-101未被修改；随后从备份恢复文件并重新运行，这也是预先备份的原因。

两者单独并不特别，重复的是本项目不断提醒的教训：必须运行检查而非信任检查；明显损坏检查产生的零值或异常不能当作证据。

## 为什么冻结前必须处理

RS-290为REVIEW_COMPLETE，第7步合入main并声明RESCHEDULING_BASELINE_FROZEN。若两份工作簿frontmatter仍含糊就冻结基线，后续历史追溯会读取当时解析器偏好的值。§7的目的正是让记录状态与证据相互核对；重复键使“已记录”的含义不确定，破坏了这一目标。
