# 联机集成历史台账：损坏来源导航 / Onboarding integration ledger: damaged-source navigation

## 快速信息 / Quick dashboard

| 项目 / Item | 状态 / State |
|---|---|
| 历史中文语义 / Historical Chinese meaning | 部分不可逆丢失，UNKNOWN / Partly irreversibly lost, UNKNOWN |
| 原始材料 / Original material | [原始字节 / Original bytes](../../../docs/encoding-evidence/CONNECTION_ONBOARDING_INTEGRATION.md.bin) |
| 校验索引 / Checksums | [PREIMAGE_INDEX](../../../docs/encoding-evidence/PREIMAGE_INDEX.json) |
| 可读叙述 / Readable narrative | [S1–S3及后续修正 / S1–S3 and corrections](RELAY_TUNNEL_S1_S3.md) |
| 逐行ASCII / Linewise ASCII | [机械投影 / Mechanical projection](../../../docs/encoding-evidence/CONNECTION_ONBOARDING_ASCII_PROJECTION.json) |
| 当前任务 / Current tasks | [主任务板 / Main board](../../README.md)，不是此历史快照 / not this historical snapshot |

## 已知损坏边界 / Known damage boundary

旧文件警告记录：UTF-8曾按GBK解码再写回UTF-8，至少重复两次；无效字节被替成问号，中文语义丢失，逆转编码不能保证恢复。警告将首次损坏绑定历史提交0b50398，并指出1abe534尚有可读较早正文。当时origin/main也含损坏。其原稿行号“1–73”、该轮“56个Markdown仅一文件损坏”是历史观察，不能视为今天全仓库检查结论；本次原始材料150行，后来追加也含乱码。

The former warning records UTF-8 decoded as GBK and written back as UTF-8 at least twice. Invalid bytes became question marks, losing Chinese meaning; inverse transcoding cannot guarantee recovery. It binds first damage to historical commit0b50398 and identifies readable earlier material at1abe534; origin/main was also damaged then. Its “lines1–73” and “one damaged Markdown among56” are historical observations, not today's repository-wide audit. The preserved material has150 lines and later additions also contain mojibake.

## 本次整理方法 / Current organization method

本次全量文档整理将原始字节保存在不可翻译的证据文件，计算SHA256和字节数，保留Git历史。此原路径改为中英导航说明；机械投影保留逐行ASCII顺序，并把非ASCII替换为显式未知标记。投影仅用于定位commit、CI号码、计数、路径等残留，不是完整句子、不提供语义解释，也不证明历史成功。

This documentation organization preserves the original bytes as non-translatable evidence, records SHA256 and size, and retains Git history. The original path now serves as bilingual navigation. A mechanical projection preserves linewise ASCII order and explicitly marks non-ASCII as unknown. It locates residual commits, CI IDs, counts and paths; it is neither complete prose nor semantic interpretation nor proof of historical success.

未重建不可知中文，没有从乱码猜测Owner裁决；没有据残留数字升级验收状态。旧警告要求Owner裁定是否重建完整历史，其原文仍在原始证据中；本次仅提供可读入口及材料归档。可读事实与各轮纠正在S1–S3台账中独立描述，当前主任务板和工作书仍是状态来源。

No unknown Chinese meaning or Owner ruling is inferred from mojibake, and residual numbers do not upgrade acceptance. The former warning's request for a decision on full historical reconstruction remains preserved in the raw evidence; this change provides readable access and archiving only. The S1–S3 ledger independently describes readable facts and corrections. Current boards and workbooks remain the state authority.
