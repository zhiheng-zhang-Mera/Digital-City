[English source / 英文原稿](../CONTROL_PLANE_ENCODING_MECH_FOUR_WORKBOOKS_DOUBLE_ENCODED.md)

> 历史阅读译本：数字、结论及未修复状态绑定原报告时点，不代表2026-10-06的当前盘点。 / Historical reading view: counts, conclusions and unrepaired status belong to the original report, not the current inventory.

# 发现 — Mech控制面：仓库中四份任务工作簿经过GBK双重编码，包括UXI-390完成门槛

```text
FROM = Mech   SCOPE = Digital-City control plane (mission-book)
SEVERITY = high for this phase: the acceptance criteria the UXI-390 review is conducted against are
           unreadable in the repository.
STATUS = finding only. I did NOT repair it - see section 6.
```


## 1. 问题是什么

读取UXI-390工作簿、为复检枚举门槛项时，中文正文显示乱码：

```text
## 鏈€缁堝畬鎴愰棬妲?          <- should be  ## 最终完成门槛  (the completion gate)
## 鏂藉伐姝ラ                 <- should be  ## 施工步骤      (construction steps)
```


这不是控制台或工具显示问题。文件是有效UTF-8，替换字符数量为0（U+FFFD计数0，无BOM，以2d 2d 2d开头）；实际字符“一”（U+4E00）在整个文件中完全不存在。文字不是显示错，而是保存错：原UTF-8字节被按GBK／CP936解码，再编码为UTF-8，形成编码有效但字符错误的内容。

## 2. 已提交，非本地问题

```text
working tree vs HEAD      CLEAN
blob scan of HEAD:mission-book/...   DOUBLE-ENCODED IN COMMIT
```


乱码存在于git对象中，因此远端和每份clone均包含它；不是checkout、smudge-filter或本地编辑问题。

## 3. 局部而非系统性问题，分布有诊断意义

扫描mission-book/下全部.md，比较七个常见汉字“的 是 一 了 和 在 有”与双重编码形态“鐨 鏄 涓 浜 鍜 鍦 鏈”：

| 工作簿 | 结论 |
|---|---|
| UI-000、UI-101、UI-103、UI-190 | 正常：真实字符出现40、28、26、29次，乱码0次 |
| UI-102 | 双重编码：乱码4次，真实字符0次 |
| RS-290 | 双重编码：3、0 |
| UXI-301 | 双重编码：48、0 |
| UXI-390 | 双重编码：37、0 |

控制面96份文件包含中文，92份正常。不是整个仓库损坏；损坏的是施工期间近期编辑最多的四份工作簿。这种分布指向写入路径，而不是错误导入。

## 4. 修复方式已知，已核验可逆

```text
raw heading        鏂藉伐姝ラ
encode as CP936 -> decode as UTF-8   施工步骤     <- correct
```


因此该损坏是可精确逆转的无损往返：`UTF8.GetString(Encoding.GetEncoding(936).GetBytes(mojibake))`。已在UXI-390工作簿的一个真实标题上核验，并非仅作原理推断。

## 5. 对这次复检的具体影响

UXI-390的“最终完成门槛”，即此次复检依据的验收标准，在仓库中不可读。我能够枚举这些项，仅因为Alien记录和goal陈述以英文引用了它们。第一次打开工作簿的复检主机或Owner会看到`## 鏈€缁堝畬鎴愰棬妲?`，其下没有可用内容。

这不只是使用不便：没人能读的验收门槛无法核查；本项目的纪律正是以工作簿而非报告为authority。

## 6. 没有做什么，为什么

我没有修复。UXI-301为REVIEW_COMPLETE，复检与关闭绑定特定字节；UXI-390是另一主机正在开发的工作簿。重新编码已关闭、已复检产物的正文属于修改记录；擅自操作与复检者编辑作者工作簿是同类错误，本项目此前已经裁定过。修复虽是机械操作且已验证，是否应用应由Owner或逐文件作者决定。

我也没有认定原因。明显假设是PowerShell或ANSI代码页对CJK文本做了读写往返；本项目已经记录此危险：PowerShell5.1的`Set-Content -Encoding utf8`会写BOM，指导方式是`[IO.File]::WriteAllText`配合`UTF8Encoding($false)`。但我没有复现，不能断言具体工具或主机。GUI-102早于我参与UXI-301／390，并非单一近期事件。

## 7. 本可发现问题的保护检查

`mission-book/reports/validate_frontmatter.py`解析工作簿，报告62有效／10问题，却未标记该项，因为它验证结构而非文本完整性。加入两行检查：标记包含双重编码CJK的文件，或标记没有常见真实字符却含对应乱码的文件，就能在写入时发现此类问题，并与重复键检查同次执行。四份工作簿无人察觉地漂移，说明这应进入validator，而不只依赖复检者记忆。
