# REX-805 记录修复 / Record reconciliation

## 中文

保留 Mech 的正式验收元数据，仅将乱码任务正文恢复为 Git 提交 `8da6b91` 中可验证的原始正文。没有推测丢失语义。损坏前像保存在 [encoding-preimage.bin](encoding-preimage.bin)，字节数 9536，SHA256 `120f1928e7f9a9e3149c511e4364d93672c68385ac645e368546db3db5d57063`。前像按原始字节保存，不转换换行。

正式验收针对 `0261a9ed1cec88df3ab4675623d422b37b33f270`，没有授权产品 main 合并。手机研究比较页渲染在开发方和复检方均为 NOT_OBSERVED；不得将 MON 的手机截图作为 REX-805 截图。复检原文关于作者截图的表述在此明确收窄。意图验证仍为 NOT_TESTED。原材料索引 PID33420 与后续部署报告 PID44088 的差异保留，材料校验不等于远端进程身份审计。

## English

Mech's formal acceptance metadata is retained. Only the corrupted workbook body is restored from the verifiable original body at Git commit `8da6b91`; no missing meaning is inferred. The damaged preimage is retained in [encoding-preimage.bin](encoding-preimage.bin), 9536 bytes, SHA256 `120f1928e7f9a9e3149c511e4364d93672c68385ac645e368546db3db5d57063`, without newline conversion.

Formal acceptance binds `0261a9ed1cec88df3ab4675623d422b37b33f270` and does not authorize a product-main merge. Handset rendering of the research comparison page is NOT_OBSERVED on both developer and reviewer hosts. MON handset captures are not REX-805 captures; this explicitly narrows the review's author-capture wording. Intent validation remains NOT_TESTED. The material-index PID33420 versus later deployment-report PID44088 discrepancy remains recorded; material checks do not independently attest remote process identity.
